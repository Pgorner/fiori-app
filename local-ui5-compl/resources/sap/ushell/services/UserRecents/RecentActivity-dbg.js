// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/base/util/extend",
    "sap/ui/Device",
    "sap/ushell/Container",
    "sap/ushell/EventHub",
    "sap/ushell/library",
    "sap/ushell/services/UserRecents/UserRecentsBase",
    "sap/ushell/utils/UrlParsing"
], function (
    Log,
    extend,
    Device,
    Container,
    EventHub,
    ushellLibrary,
    UserRecentsBase,
    UrlParsing
) {
    "use strict";

    // shortcut for sap.ushell.AppType
    const AppType = ushellLibrary.AppType;

    /**
     * @typedef sap.ushell.services.UserRecents.ActivityItemMetadata
     * Wrapper for the item which is saved via the UserRecents service.
     * Stores the metadata of the item and the usage array.
     * @property {sap.ushell.services.UserRecents.ActivityItem} oItem
     * @property {int} iTimestamp
     * @property {int[]} aUsageArray
     * @property {int} iCount
     * @property {boolean} [mobile]
     * @property {boolean} [tablet]
     * @property {boolean} [desktop]
     * @property {sap.ui.core.URI} [icon]
     *
     * @private
     */

    /**
     * @typedef sap.ushell.services.UserRecents.RecentActivityContainer
     * The internal data structure of the recent activities.
     * This data structure is saved in the personalization container.
     * @property {string} recentDay
     * @property {sap.ushell.services.UserRecents.ActivityItemMetadata[]} recentUsageArray
     *
     * @private
     */

    /**
     * @alias sap.ushell.services.UserRecents.RecentActivity
     * @class
     *
     * @extends sap.ushell.services.UserRecents.UserRecentsBase
     *
     * @private
     */
    const RecentActivity = UserRecentsBase.extend("sap.ushell.services.UserRecents.RecentActivity", /** @lends sap.ushell.services.UserRecents.RecentActivity.prototype */ {
        constructor: function (maxItems) {
            UserRecentsBase.call(this, "RecentActivity", maxItems);
        }
    });

    const aGenericIntents = [
        "#Shell-launchURL",
        "#Shell-startGUI",
        "#Shell-startIntent",
        "#Shell-startURL",
        "#Shell-startWDA"
    ];

    /**
     * Number of days to be considered "recent"
     */
    RecentActivity.MAX_DAYS = 30;
    /**
     * Number of items to use for the item feed
     */
    RecentActivity.ITEM_COUNT = 30;

    /**
     * Compares items a and b for equality.
     * This does not depend on the identical references or content, but on the properties "appType", "url" and "appId".
     *
     * @param {sap.ushell.services.UserRecents.ActivityItem} oItem1 The first item to be checked.
     * @param {sap.ushell.services.UserRecents.ActivityItem} oItem2 The second item to be checked.
     * @returns {boolean} True if both items are considered equal, otherwise false.
     * @private
     */
    RecentActivity._compareItems = function (oItem1, oItem2) {
        const bSameAppType = oItem1.appType === oItem2.appType;
        const bSameUrl = oItem1.url === oItem2.url;
        const bSameAppId = oItem1.appId === oItem2.appId;
        const bSameTitle = oItem1.title === oItem2.title;

        if (bSameAppType) {
            if (oItem1.appType !== AppType.APP) {
                return bSameUrl;
            }

            if (bSameAppId && aGenericIntents.includes(oItem1.appId)) {
                // This is a special case for apps launched with the generic intents.
                return bSameTitle;
            }
            return bSameAppId;
        } else if (oItem1.appType === AppType.APP || oItem2.appType === AppType.APP) {
            return bSameAppId && bSameUrl;
        }
        return false;
    };

    /**
     * Updates an existing item if it is already in the recents list.
     * @param {sap.ushell.services.UserRecents.RecentActivityContainer} oRecentActivityContainer The recent activities.
     * @param {sap.ushell.services.UserRecents.ActivityItem} oUpdateItem The item to update.
     * @param {int} iTimestampNow The current timestamp.
     * @returns {boolean} True if the item was updated, otherwise false.
     *
     * @private
     */
    RecentActivity.prototype._updateIfAlreadyIn = function (oRecentActivityContainer, oUpdateItem, iTimestampNow) {
        return oRecentActivityContainer.recentUsageArray.some((oMetadata) => {
            const { oItem, aUsageArray } = oMetadata;
            if (RecentActivity._compareItems(oItem, oUpdateItem)) {
                /*
                 * in case both items considered as equal (by _compareItems function),
                 * we will override the saved item only in case its type is not type 'Application'.
                 *
                 * As the shell always adds user recent entry after every app closed, it might be that a different
                 * App as 'OVP' for example will also use API to add its app as user-recent entry, and the information
                 * they provide regarding the item to save is with higher value then the information the shell constructs (icon title etc)
                 */
                const bSameAppType = oUpdateItem.appType === oItem.appType;
                const bUpdateItemIsApp = oUpdateItem.appType === AppType.APP;
                if (bSameAppType || !bUpdateItemIsApp) {
                    // override the item
                    extend(oItem, oUpdateItem);
                    oItem.timestamp = iTimestampNow;
                    oMetadata.iTimestamp = iTimestampNow;
                    oMetadata.mobile = undefined;
                    oMetadata.tablet = undefined;
                    oMetadata.desktop = undefined;
                    oMetadata[this._getCurrentDevice()] = true;

                    // we update the counter if -
                    // - existing item and new item are of the same type OR
                    // - existing item and new item is not of same type BUT both are not Application
                    const bExistingItemIsApp = oItem.appType === AppType.APP;
                    if (bSameAppType || (!bUpdateItemIsApp && !bExistingItemIsApp)) {
                        // update both the usage array's last day and the global entry counter
                        aUsageArray[aUsageArray.length - 1] += 1;
                        oMetadata.iCount += 1;
                    }

                    oRecentActivityContainer.recentUsageArray.sort(UserRecentsBase.itemSorter);
                }

                return true;
            }
            return false;
        });
    };

    /**
     * Inserts a new item to the recents list and removes the oldest item if the list is full.
     * Updates the timestamp of the item.
     * @param {sap.ushell.services.UserRecents.RecentActivityContainer} oRecentActivityContainer The recent activities.
     * @param {sap.ushell.services.UserRecents.ActivityItem} oItem The item to add.
     * @param {int} iTimestampNow The current timestamp.
     * @param {sap.ui.core.URI} [sIcon] The icon.
     *
     * @private
     */
    RecentActivity.prototype._insertNew = function (oRecentActivityContainer, oItem, iTimestampNow, sIcon) {
        oItem.timestamp = iTimestampNow;
        if (sIcon) {
            oItem.icon = sIcon;
        }
        const oNewEntry = {
            oItem: oItem,
            iTimestamp: iTimestampNow,
            aUsageArray: [1],
            iCount: 1,
            mobile: undefined,
            tablet: undefined,
            desktop: undefined
        };
        oNewEntry[this._getCurrentDevice()] = true;

        if (oRecentActivityContainer.recentUsageArray.length === this.iMaxItems) {
            oRecentActivityContainer.recentUsageArray.pop();
        }
        oRecentActivityContainer.recentUsageArray.unshift(oNewEntry);
    };

    /**
     * Adds a new item or updates an existing item to the recents list with the current time.
     * @param {sap.ushell.services.UserRecents.ActivityItem} oItem The item to add.
     * @returns {Promise} Resolves when the new item was added.
     *
     * @private
     */
    RecentActivity.prototype.newItem = async function (oItem) {
        const iTimestampNow = Date.now();
        const sIcon = this._getActivityIcon(oItem.appType, oItem.icon);
        const currentDay = this.getDayFromDate(new Date());

        const oRecentActivityContainer = await this._getRecentActivitiesFromLoadedData();
        // If the current day is different than the recent one -
        // add a new entry (for the current day's usage) to each usage array
        if (currentDay !== oRecentActivityContainer.recentDay) {
            this._addNewDay(oRecentActivityContainer);
            oRecentActivityContainer.recentDay = currentDay;
        }

        const bAlreadyIn = this._updateIfAlreadyIn(oRecentActivityContainer, oItem, iTimestampNow);
        if (!bAlreadyIn) {
            this._insertNew(oRecentActivityContainer, oItem, iTimestampNow, sIcon);
        }

        await this.save(oRecentActivityContainer);

        EventHub.emit("newUserRecentsItem", oRecentActivityContainer);
    };

    /**
     * Returns the activity icon according to the app type and provided icon.
     * @param {sap.ushell.AppType} sAppType The app type.
     * @param {sap.ui.core.URI} [sIcon] Icon override.
     * @returns {sap.ui.core.URI} The final activity icon.
     *
     * @private
     */
    RecentActivity.prototype._getActivityIcon = function (sAppType, sIcon) {
        if (sIcon) {
            return sIcon;
        }
        switch (sAppType) {
            case AppType.SEARCH:
                return "sap-icon://search";
            case AppType.COPILOT:
                return "sap-icon://co";
            case AppType.URL:
                return "sap-icon://internet-browser";
            default:
                return "sap-icon://product";
        }
    };

    /**
     * Clears all recent activities.
     * @returns {Promise} Resolves when the recent activities are cleared.
     *
     * @private
     */
    RecentActivity.prototype.clearAllActivities = async function () {
        await this.save([]);
        EventHub.emit("userRecentsCleared", Date.now());
    };

    /**
     * Returns the current device.
     * @returns {string} The current device.
     *
     * @private
     */
    RecentActivity.prototype._getCurrentDevice = function () {
        if (Device.system.desktop) {
            return "desktop";
        } else if (Device.system.tablet) {
            return "tablet";
        }
        return "mobile";
    };


    /**
     * getRecentItems return last RecentActivity.ITEM_COUNT activities for current device.
     *   - Check if for the current device we have unresolved entries.
     *   - resolve the unresolved entries and set the attribute according to the current device.
     *   - persist data.
     *   - return the last <maxNumOfActivities> entries or all entries supported by current device (if maxNumOfActivities was not provided).
     *
     * @param {int} iMaxNumOfActivities The maximum amount of activities to return.
     * @returns {Promise<sap.ushell.services.UserRecents.ActivityItemMetadata[]>} Resolves with the recent items.
     *
     * @private
     */
    RecentActivity.prototype._filterRecentItems = async function (iMaxNumOfActivities) {
        const sCurrentDay = this.getDayFromDate(new Date());
        const sCurrentDevice = this._getCurrentDevice();

        const oRecentActivityContainer = await this._getRecentActivitiesFromLoadedData();
        // If the current day is different than the recent one -
        // add a new entry (for the current day's usage) to each usage array
        let bNewDayAdded = false;
        if (sCurrentDay !== oRecentActivityContainer.recentDay) {
            this._addNewDay(oRecentActivityContainer);
            oRecentActivityContainer.recentDay = sCurrentDay;
            bNewDayAdded = true;
        }

        //collect all unresolved activities for current device.
        const oUnresolvedActivities = oRecentActivityContainer.recentUsageArray.reduce((oUnresolved, oMetadata, iIndex) => {
            if (oMetadata[sCurrentDevice] === undefined) {
                const { url: sUrl } = oMetadata.oItem;
                const sHash = UrlParsing.getShellHash(sUrl);

                if (sHash) {
                    oUnresolved.intent.push({
                        index: iIndex,
                        hash: sHash
                    });
                } else {
                    oUnresolved.url.push({ index: iIndex });
                }
            }
            return oUnresolved;
        }, { url: [], intent: [] });

        const bShouldPersist = bNewDayAdded || oUnresolvedActivities.url.length > 0 || oUnresolvedActivities.intent.length > 0;

        // resolve urls
        oUnresolvedActivities.url.forEach(({ index }) => {
            const oMetadata = oRecentActivityContainer.recentUsageArray[index];
            oMetadata[sCurrentDevice] = true;
        });

        // resolve intents
        if (oUnresolvedActivities.intent.length > 0) {
            const aIntentsToResolve = oUnresolvedActivities.intent.map(({ hash }) => ({ target: { shellHash: hash } }));

            const NavigationService = await Container.getServiceAsync("Navigation");
            const aResult = await NavigationService.isNavigationSupported(aIntentsToResolve);

            oUnresolvedActivities.intent.forEach(({ index }, iIndex) => {
                const { supported } = aResult[iIndex];
                const oMetadata = oRecentActivityContainer.recentUsageArray[index];
                oMetadata[sCurrentDevice] = supported;
            });
        }

        if (bShouldPersist) {
            await this.save(oRecentActivityContainer);
        }

        const aMetadata = this._getRecentItemsForCurrentDevice(oRecentActivityContainer);

        if (iMaxNumOfActivities) {
            return aMetadata.slice(0, iMaxNumOfActivities);
        }
        return aMetadata;
    };

    /**
     * Filters the recent items according to the current device.
     * @param {sap.ushell.services.UserRecents.RecentActivityContainer} oRecentActivities The recent activities.
     * @returns {sap.ushell.services.UserRecents.ActivityItemMetadata[]} The recent items for the current device.
     *
     * @private
     */
    RecentActivity.prototype._getRecentItemsForCurrentDevice = function (oRecentActivities) {
        const sCurrentDevice = this._getCurrentDevice();

        return oRecentActivities.recentUsageArray.filter((oMetadata) => oMetadata[sCurrentDevice]);
    };

    /**
     * Returns the recent items.
     * @returns {Promise<sap.ushell.services.UserRecents.ActivityItem[]>} Resolves with the recent items.
     *
     * @private
     */
    RecentActivity.prototype.getRecentItems = async function () {
        const aFilteredMetadata = await this._filterRecentItems(RecentActivity.ITEM_COUNT);
        return aFilteredMetadata.map((oMetadata) => oMetadata.oItem);
    };

    /**
     * Returns the frequent items.
     * @returns {Promise<sap.ushell.services.UserRecents.ActivityItem[]>} Resolves with the frequent items.
     *
     * @private
     */
    RecentActivity.prototype.getFrequentItems = async function () {
        const aMetadata = await this._filterRecentItems();
        let iWorkingDaysCounter = 0;
        let aFrequentActivity = [];
        let dPreviousDate = aMetadata[0] ? new Date(aMetadata[0].iTimestamp).toDateString() : "";
        // Go through the recent activities list and leave only activities from the last MAX_DAYS working days
        for (let iIndex = 0; iIndex < aMetadata.length && iWorkingDaysCounter < RecentActivity.MAX_DAYS; iIndex++) {
            const oMetadata = aMetadata[iIndex];
            // Add only activities that happened more than once
            if (oMetadata.iCount > 1) {
                aFrequentActivity.push(oMetadata);
            }
            const dCurrentDate = new Date(oMetadata.iTimestamp).toDateString();
            if (dPreviousDate !== dCurrentDate) {
                // If found an activity with a different date than the previous one, increase the days counter
                iWorkingDaysCounter++;
                dPreviousDate = dCurrentDate;
            }
        }
        // Sort in descending order according to the count
        aFrequentActivity.sort(function (a, b) {
            return b.iCount - a.iCount;
        });
        // Take only first items (ITEM_COUNT most frequent items)
        aFrequentActivity = aFrequentActivity.slice(0, RecentActivity.ITEM_COUNT);
        return aFrequentActivity.map((oRecentEntry) => oRecentEntry.oItem);
    };

    /**
     * Adds a new day to the usage array of each activity.
     * @param {sap.ushell.services.UserRecents.RecentActivityContainer} oRecentActivityContainer The recent activities.
     *
     * @private
     */
    RecentActivity.prototype._addNewDay = function (oRecentActivityContainer) {
        oRecentActivityContainer.recentUsageArray.forEach(function (oMetadata) {
            // initialize the array if it doesn't exist
            if (!oMetadata.aUsageArray) {
                oMetadata.aUsageArray = [];
                oMetadata.iCount = 0;
            }

            const { aUsageArray } = oMetadata;

            // Add an item in the Array for the new day
            aUsageArray.push(0);

            // If the array size is > iMaximumDays, remove the first (oldest) entry and update the count accordingly
            if (aUsageArray.length > RecentActivity.MAX_DAYS) {
                oMetadata.iCount -= aUsageArray[0];
                aUsageArray.shift();
            }
        });
    };

    /**
     * Returns the recent activities from the loaded data.
     * Transforms the loaded data into the expected format.
     * @returns {Promise<sap.ushell.services.UserRecents.RecentActivityContainer>} The recent activities.
     *
     * @private
     */
    RecentActivity.prototype._getRecentActivitiesFromLoadedData = async function () {
        const vLoadedRecentsOrUsages = await this.load();
        let oLoadedRecentActivities;
        let aLoadedUsages;

        // Legacy format
        if (Array.isArray(vLoadedRecentsOrUsages)) {
            aLoadedUsages = vLoadedRecentsOrUsages;

            // New format
        } else {
            oLoadedRecentActivities = vLoadedRecentsOrUsages;
        }

        const oRecentActivities = oLoadedRecentActivities || {
            recentDay: null,
            recentUsageArray: aLoadedUsages || []
        };

        // Validate entries
        oRecentActivities.recentUsageArray = oRecentActivities.recentUsageArray.filter(function (oMetadata) {
            const bIsValid = !!oMetadata?.oItem?.url;
            if (!bIsValid) {
                Log.error("FLP Recent Activity", oMetadata, "is not valid. The activity is removed from the list.");
            }
            return bIsValid;
        });

        return oRecentActivities;
    };

    return RecentActivity;
});
