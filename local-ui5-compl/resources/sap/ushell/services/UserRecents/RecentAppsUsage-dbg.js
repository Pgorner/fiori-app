// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/base/Log",
    "sap/ushell/services/UserRecents/UserRecentsBase",
    "sap/ushell/utils"
], function (
    Log,
    UserRecentsBase,
    ushellUtils
) {
    "use strict";

    /**
     * @alias sap.ushell.services.UserRecents.RecentAppsUsage
     * @class
     * @classdesc User action collector counter of user usage of applications according to the URL hash.
     *
     * @extends sap.ushell.services.UserRecents.UserRecentsBase
     *
     * @private
     */
    const RecentAppsUsage = UserRecentsBase.extend("sap.ushell.services.UserRecents.RecentAppsUsage", /** @lends sap.ushell.services.UserRecents.RecentAppsUsage.prototype */ {
        constructor: function () {
            UserRecentsBase.call(this, "AppsUsage");
        }
    });

    /**
     * Number of days to be considered "recent"
     */
    RecentAppsUsage.MAX_DAYS = 30;

    /**
     * Initialization of RecentAppsUsage.
     * Called from shell.controller's <code>init</code> function
     *   - Loads user personalized data
     *   - Defines a new day is the data structure, if needed
     *   - Cleans empty hash usage arrays
     *
     * @returns {Promise} Resolves after init is done
     *
     * @private
     */
    RecentAppsUsage.prototype.init = async function () {
        const sCurrentDay = this.getDayFromDate(new Date());
        let bDataLoadedTriggered = false;

        // Personalized data not loaded yet
        if (!bDataLoadedTriggered || sCurrentDay !== this.oAppsUsageData.recentDay) {
            bDataLoadedTriggered = true;

            try {
                const oData = await this.load();
                // Initialize structure from the loaded data, or define new
                this.oAppsUsageData = oData || {
                    recentDay: null,
                    recentAppsUsageMap: {}
                };

                // Update usage
                await this.calculateInitialUsage(sCurrentDay);
                return this.oAppsUsageData;
            } catch (oError) {
                Log.error("Load data in Init failed", oError, "sap.ushell.services.UserRecents.RecentAppsUsage");
                return Promise.reject(oError);
            }
        }
    };

    /**
     * @param {string} currentDay The current day in the format YYYY/mm/dd.
     * @returns {Promise} Resolves after the data is saved
     *
     * @private
     */
    RecentAppsUsage.prototype.calculateInitialUsage = async function (currentDay) {
        // If the current day is different than the recent one - add a new entry (for the current day's usage) to each hash usage array
        if (currentDay !== this.oAppsUsageData.recentDay) {
            this._addNewDay();
            this.oAppsUsageData.recentDay = currentDay;

            this._cleanUnusedHashes();

            await this.save(this.oAppsUsageData);
        }
    };

    /**
     * Records applications usage according to URL hashes
     *   - Check hash validity
     *   - Gets the relevant hash usage array
     *   - Add this usage (increment the value) or create a new array if needed
     *   - Save the data structure
     *
     * @param {string} sHash The hash of the application for which a usage should be registered.
     * @returns {Promise} Resolves after AppUsage was added
     *
     * @private
     */
    RecentAppsUsage.prototype.addAppUsage = async function (sHash) {
        if (!ushellUtils.validHash(sHash)) { // Check hash validity
            return Promise.reject("Non valid hash");
        }

        await this.init();

        // Get the data (usage per day) for the given hash
        const aAppUsageArray = this.oAppsUsageData.recentAppsUsageMap[sHash] || [];

        // New app that wasn't opened so far. Insert "1" since this is the first time it is opened
        if (aAppUsageArray.length === 0) {
            aAppUsageArray[0] = 1;
        } else {
            // Increment the existing counter of this day for this hash (i.e. the last entry in the array)
            aAppUsageArray[aAppUsageArray.length - 1] += 1;
        }
        this.oAppsUsageData.recentAppsUsageMap[sHash] = aAppUsageArray;
        await this.save(this.oAppsUsageData);
    };

    /**
     * Summarizes and returns the usage per hash and the minimum and maximum values
     * @returns {Promise<sap.ushell.services.UserRecents.AppsUsageSummary>} Resolves the apps usage summary
     *
     * @private
     */
    RecentAppsUsage.prototype.getAppsUsage = async function () {
        await this.init();

        const oUsageMap = {};
        let iMaxUsage,
            iMinUsage;
        let bFirstHashUsage = true;

        for (const sHash in this.oAppsUsageData.recentAppsUsageMap) {
            oUsageMap[sHash] = this._getHashUsageSum(sHash);
            if (bFirstHashUsage) {
                iMaxUsage = iMinUsage = oUsageMap[sHash];
                bFirstHashUsage = false;
            } else if (oUsageMap[sHash] < iMinUsage) {
                iMinUsage = oUsageMap[sHash];
            } else if (oUsageMap[sHash] > iMaxUsage) {
                iMaxUsage = oUsageMap[sHash];
            }
        }
        return {
            usageMap: oUsageMap,
            maxUsage: iMaxUsage,
            minUsage: iMinUsage
        };
    };

    /**
     * Adds a new day to the usage array of each hash
     * and removes the oldest entry if needed
     *
     * @private
     */
    RecentAppsUsage.prototype._addNewDay = function () {
        let aAppUsageArray;
        for (const sHash in this.oAppsUsageData.recentAppsUsageMap) {
            // Get the array of app/hash usage
            aAppUsageArray = this.oAppsUsageData.recentAppsUsageMap[sHash];

            // Add an item in the Array for the new day
            aAppUsageArray[aAppUsageArray.length] = 0;

            // If the array size is > iMaximumDays, remove the first (oldest) entry
            if (aAppUsageArray.length > RecentAppsUsage.MAX_DAYS) {
                aAppUsageArray = aAppUsageArray.shift();
            }
        }
    };

    /**
     * Removes unused hashes
     *
     * @private
     */
    RecentAppsUsage.prototype._cleanUnusedHashes = function () {
        let iUsages;

        for (const sHash in this.oAppsUsageData.recentAppsUsageMap) {
            iUsages = this._getHashUsageSum(sHash);

            if (iUsages === 0) {
                delete (this.oAppsUsageData.recentAppsUsageMap[sHash]);
            }
        }
    };

    /**
     * Summarizes the usage of a given hash
     * @param {string} sHash The hash for which the usage should be summarized
     * @returns {int} The sum of the usage of the given hash
     *
     * @private
     */
    RecentAppsUsage.prototype._getHashUsageSum = function (sHash) {
        const aAppUsages = this.oAppsUsageData.recentAppsUsageMap[sHash];
        return aAppUsages.reduce(function (iSum, iUsages) {
            return iSum + iUsages;
        }, 0);
    };

    return RecentAppsUsage;
});
