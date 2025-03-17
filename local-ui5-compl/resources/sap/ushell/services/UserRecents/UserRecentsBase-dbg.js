// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/base/Log",
    "sap/ui/base/Object",
    "sap/ushell/Container"
], function (
    Log,
    BaseObject,
    Container
) {
    "use strict";

    /**
     * @alias sap.ushell.services.UserRecents.UserRecentsBase
     * @class
     * @classdesc Base class for all helper classes.
     *
     * @extends sap.ui.base.Object
     *
     * @private
     */
    const UserRecentsBase = BaseObject.extend("sap.ushell.services.UserRecents.UserRecentsBase", {
        constructor: function (personalizationItemName, maxItems) {
            this.iMaxItems = maxItems;
            this.sPersonalizationItemName = personalizationItemName;

            if (!UserRecentsBase.prototype.oContainerPromise) {
                UserRecentsBase.prototype.oContainerPromise = Container.getServiceAsync("PersonalizationV2").then(async (PersonalizationV2) => {
                    const sContainerKey = "sap.ushell.services.UserRecents";
                    const oScope = {};
                    const oContainer = await PersonalizationV2.getContainer(sContainerKey, oScope);
                    await oContainer.load();
                    return oContainer;
                });
            }
        }
    });

    /**
     * Fetches the stored data.
     * @returns {Promise<any>} Returns the stored data.
     *
     * @private
     */
    UserRecentsBase.prototype.load = async function () {
        try {
            const oContainer = await UserRecentsBase.prototype.oContainerPromise;
            return oContainer.getItemValue(this.sPersonalizationItemName);
        } catch (error) {
            Log.error("Personalization service does not work:", error);
            return Promise.reject(error);
        }
    };

    /**
     * Stores the given data.
     * @param {any} vData The data to save.
     * @returns {Promise} Resolves when the data is saved.
     *
     * @private
     */
    UserRecentsBase.prototype.save = async function (vData) {
        try {
            const oContainer = await UserRecentsBase.prototype.oContainerPromise;
            oContainer.setItemValue(this.sPersonalizationItemName, vData);
            await oContainer.save();
        } catch (error) {
            Log.error("Personalization service does not work:", error);
            return Promise.reject(error);
        }
    };

    /**
     * Sorts the items by timestamp.
     * @param {{ iTimestamp: int }} oItemMetadata1 The first item.
     * @param {{ iTimestamp: int }} oItemMetadata2 The second item.
     * @returns {int} The sort priority.
     *
     * @private
     */
    UserRecentsBase.itemSorter = function (oItemMetadata1, oItemMetadata2) {
        return oItemMetadata2.iTimestamp - oItemMetadata1.iTimestamp;
    };

    /**
     * Transforms a date to a day string.
     * @param {Date} dDate The date to transform.
     * @returns {string} The day string.
     *
     * @private
     */
    UserRecentsBase.prototype.getDayFromDate = function (dDate) {
        return `${dDate.getUTCFullYear()}/${dDate.getUTCMonth() + 1}/${dDate.getUTCDate()}`;
    };

    return UserRecentsBase;
});
