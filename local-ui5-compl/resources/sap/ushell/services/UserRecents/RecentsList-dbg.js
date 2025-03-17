// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ushell/services/UserRecents/UserRecentsBase"
], function (
    UserRecentsBase
) {
    "use strict";

    /**
     * @typedef sap.ushell.services.UserRecents.RecentItemMetadata
     * Wrapper for the item which is saved via the UserRecents service.
     * Stores the metadata of the item.
     * @property {sap.ushell.services.UserRecents.RecentDataSource|sap.ushell.services.UserRecents.RecentSearch|sap.ushell.services.UserRecents.RecentApp} oItem
     * @property {int} iTimestamp
     * @property {int} iCount
     *
     * @private
     */

    /**
     * @alias sap.ushell.services.UserRecents.RecentsList
     * @class
     *
     * @extends sap.ushell.services.UserRecents.UserRecentsBase
     *
     * @private
     */
    const RecentsList = UserRecentsBase.extend("sap.ushell.services.UserRecents.RecentsList", /** @lends sap.ushell.services.UserRecents.RecentsList.prototype */ {
        constructor: function (personalizationItemName, maxItems, compareItems) {
            UserRecentsBase.apply(this, arguments);

            this._compareItems = compareItems;
        }
    });

    /**
     * Updates an existing item if it is already in the recents list
     * @param {sap.ushell.services.UserRecents.RecentItemMetadata[]} aRecents The recents list.
     * @param {sap.ushell.services.UserRecents.RecentDataSource|sap.ushell.services.UserRecents.RecentSearch|sap.ushell.services.UserRecents.RecentApp} oItem The item to update
     * @param {int} iTimestampNow The current timestamp
     * @returns {boolean} Whether the item was updated
     *
     * @private
     */
    RecentsList.prototype._updateIfAlreadyIn = function (aRecents, oItem, iTimestampNow) {
        return aRecents.some((oRecentEntry) => {
            let bFound;

            if (this._compareItems(oRecentEntry.oItem, oItem)) {
                oRecentEntry.oItem = oItem;
                oRecentEntry.iTimestamp = iTimestampNow;
                oRecentEntry.iCount += 1;
                bFound = true;
            } else {
                bFound = false;
            }

            return bFound;
        });
    };

    /**
     * Inserts a new item to the recents list and removes the oldest item if the list is full.
     * @param {sap.ushell.services.UserRecents.RecentItemMetadata[]} aRecents The recents list.
     * @param {sap.ushell.services.UserRecents.RecentDataSource|sap.ushell.services.UserRecents.RecentSearch|sap.ushell.services.UserRecents.RecentApp} oItem The item to add
     * @param {int} iTimestampNow The current timestamp
     *
     * @private
     */
    RecentsList.prototype._insertNew = function (aRecents, oItem, iTimestampNow) {
        const oNewEntry = {
            oItem: oItem,
            iTimestamp: iTimestampNow,
            iCount: 1
        };

        if (aRecents.length === this.iMaxItems) {
            aRecents.sort(UserRecentsBase.itemSorter);
            aRecents.pop();
        }

        aRecents.push(oNewEntry);
    };

    /**
     * Adds a new item to the recents list with the current timestamp
     * @param {sap.ushell.services.UserRecents.RecentItemMetadata} oItem The item to add
     * @returns {Promise} Resolves after the item is added or updated
     *
     * @private
     */
    RecentsList.prototype.newItem = async function (oItem) {
        const iTimestampNow = Date.now();

        const aRecents = await this.load() || [];

        const bAlreadyIn = this._updateIfAlreadyIn(aRecents, oItem, iTimestampNow);
        if (!bAlreadyIn) {
            this._insertNew(aRecents, oItem, iTimestampNow);
        }

        await this.save(aRecents);
    };

    /**
     * Fetches the recent items and sorts them by timestamp
     * @returns {Promise<sap.ushell.services.UserRecents.RecentDataSource[]|sap.ushell.services.UserRecents.RecentSearch[]|sap.ushell.services.UserRecents.RecentApp[]>} The recent items
     *
     * @private
     */
    RecentsList.prototype.getRecentItems = async function () {
        const aLoadedRecents = await this.load() || [];
        aLoadedRecents.sort(UserRecentsBase.itemSorter);
        const aRecents = aLoadedRecents.slice(0, this.iMaxItems);
        return aRecents.map((oRecentEntry) => oRecentEntry.oItem);
    };

    return RecentsList;
});
