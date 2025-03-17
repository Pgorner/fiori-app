// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview The Unified Shell's user activity service.
 * @version 1.132.1
 */
sap.ui.define([
    "sap/base/util/ObjectPath",
    "sap/ushell/services/UserRecents/RecentsList",
    "sap/ushell/services/UserRecents/RecentActivity",
    "sap/ushell/services/UserRecents/RecentAppsUsage",
    "sap/ushell/utils/UrlParsing"
], function (
    ObjectPath,
    RecentsList,
    RecentActivity,
    RecentAppsUsage,
    UrlParsing
) {
    "use strict";

    /**
     * @typedef {object} sap.ushell.services.UserRecents.AppsUsageSummary
     * @property {Object<string, int>} usageMap A map of hashes to usage numbers
     * @property {int} maxUsage The number of maximum usage of an application among all applications
     * @property {int} minUsage The number of minimum usage of an application among all applications
     *
     * @private
     */

    /**
     * @typedef sap.ushell.services.UserRecents.ActivityItem
     * Item describing an activity.
     * @property {sap.ushell.AppType} appType
     * @property {string} url
     * @property {string} appId
     * @property {string} title
     * @property {string} icon
     *
     * @private
     * @ui5-restricted S/4 MyHome (ux.eng.s4producthomes1)
     */

    /**
     * @typedef sap.ushell.services.UserRecents.RecentDataSource
     * Item describing a recent data sources.
     * @property {{ value: string }} objectName The data source.
     *
     * @private
     */

    /**
     * @typedef sap.ushell.services.UserRecents.RecentSearch
     * Item describing a recent search.
     * @property {{ objectName: { value: string } }} [oDataSource] The data source.
     * @property {string} [sTerm] The search term.
     *
     * @private
     */

    /**
     * @typedef sap.ushell.services.UserRecents.RecentApp
     * Item describing a recent app usage.
     * @property {string} semanticObject The semantic object.
     * @property {string} action The action.
     *
     * @private
     */

    /**
     * @alias sap.ushell.services.UserRecents
     * @class
     * @classdesc The Unified Shell's user recents service.
     * Manages recent searches and recently viewed apps.
     *
     * <b>Note:</b> To retrieve a valid instance of this service, it is necessary to call {@link sap.ushell.Container#getServiceAsync}.
     * <pre>
     *   sap.ui.require(["sap/ushell/Container"], async function (Container) {
     *     const UserRecents = await Container.getServiceAsync("UserRecents");
     *     // do something with the UserRecents service
     *   });
     * </pre>
     *
     * @hideconstructor
     *
     * @since 1.15.0
     * @private
     * @ui5-restricted S/4 MyHome (ux.eng.s4producthomes1)
     */
    function UserRecents () {
        this.oRecentSearches = new RecentsList("RecentSearches", 10, UserRecents._compareSearchItems);
        this.oRecentDataSources = new RecentsList("RecentDataSources", 6, UserRecents._compareDataSources);
        this.oRecentApps = new RecentsList("RecentApps", 6, UserRecents._compareApps);

        this.oRecentActivity = new RecentActivity(500);
        this.oAppsUsage = new RecentAppsUsage();
    }

    // ========================================================================================
    // ================================== Recent Searches =====================================

    /**
     * Checks if the given search items are equivalent.
     *
     * @param {sap.ushell.services.UserRecents.RecentSearch} oItem1 The first search item to be checked.
     * @param {sap.ushell.services.UserRecents.RecentSearch} oItem2 The second search item to be checked.
     * @returns {boolean} True if both search item are equivalent, otherwise false.
     *
     * @static
     * @private
     */
    UserRecents._compareSearchItems = function (oItem1, oItem2) {
        let bResult = false;

        if (oItem1.oDataSource && oItem2.oDataSource) {
            if (oItem1.oDataSource.objectName && oItem2.oDataSource.objectName) {
                bResult = ((oItem1.sTerm === oItem2.sTerm) && (oItem1.oDataSource.objectName.value === oItem2.oDataSource.objectName.value));
            }
            if (!oItem1.oDataSource.objectName && !oItem2.oDataSource.objectName) {
                bResult = (oItem1.sTerm === oItem2.sTerm);
            }
        }

        if (!oItem1.oDataSource && !oItem2.oDataSource) {
            bResult = (oItem1.sTerm === oItem2.sTerm);
        }

        return bResult;
    };

    /**
     * Notification that the given search item has just been used.
     * Adds the search to the list of recently done searches.
     *
     * Was part of the public interface.
     * @param {sap.ushell.services.UserRecents.RecentSearch} oSearchItem The search item identified by the string parameter <code>sTerm</code>
     * @returns {Promise<sap.ushell.services.UserRecents.RecentSearch[]>} A Promise that is resolved to the updated list of recent searches.
     *
     * @since 1.15.0
     * @private
     * @deprecated since 1.93. Please use {@link #addSearchActivity} instead.
     */
    UserRecents.prototype.noticeSearch = UserRecents.prototype.addSearchActivity;

    /**
     * Notifies the service that the given search item has been used recently.
     *
     * Was part of the public interface.
     * @param {sap.ushell.services.UserRecents.RecentSearch} oSearchItem The search item identified by the string parameter <code>sTerm</code>
     * @returns {Promise<sap.ushell.services.UserRecents.RecentSearch[]>} A Promise that is resolved to the updated list of recent searches.
     *
     * @since 1.93.0
     * @private
     */
    UserRecents.prototype.addSearchActivity = async function (oSearchItem) {
        await this.oRecentSearches.newItem(oSearchItem);
        return this.oRecentSearches.getRecentItems();
    };

    /**
     * Returns the list of recently done searches.
     *
     * Was part of the public interface.
     * @returns {Promise<sap.ushell.services.UserRecents.RecentSearch[]>} A Promise that is resolved to the list of recent searches.
     *
     * @since 1.15.0
     * @private
     */
    UserRecents.prototype.getRecentSearches = function () {
        return this.oRecentSearches.getRecentItems();
    };

    // ===========================================================================================
    // ================================== Recent DataSources =====================================

    /**
     * Checks if the given data sources are equivalent.
     *
     * @param {sap.ushell.services.UserRecents.RecentDataSource} oItem1 The first data source to be checked.
     * @param {sap.ushell.services.UserRecents.RecentDataSource} oItem2 The second data source to be checked.
     * @returns {boolean} True if both data sources are equivalent, otherwise false.
     *
     * @static
     * @private
     */
    UserRecents._compareDataSources = function (oItem1, oItem2) {
        if (oItem1.objectName && oItem2.objectName) {
            return oItem1.objectName.value === oItem2.objectName.value;
        }
        return false;
    };

    /**
     * Notification that the given data source has just been used.
     * Adds the search to the LRU list of data sources.
     *
     * Was part of the public interface.
     * @param {sap.ushell.services.UserRecents.RecentDataSource} oDataSource The data source identified by the string parameter <code>objectName.value</code>
     * @returns {Promise<sap.ushell.services.UserRecents.RecentDataSource[]>} A Promise that is resolved to the list of updated entries for data sources.
     *
     * @since 1.19.0
     * @private
     * @deprecated since 1.93. Please use {@link #addDataSourceActivity} instead.
     */
    UserRecents.prototype.noticeDataSource = UserRecents.prototype.addDataSourceActivity;

    /**
     * Notifies the service that the given data source has been used recently.
     *
     * Was part of the public interface.
     * @param {sap.ushell.services.UserRecents.RecentDataSource} oDataSource The data source identified by the string parameter <code>objectName.value</code>
     * @returns {Promise<sap.ushell.services.UserRecents.RecentDataSource[]>} A Promise that is resolved to the list of updated entries for data sources.
     *
     * @since 1.93.0
     * @private
     */
    UserRecents.prototype.addDataSourceActivity = async function (oDataSource) {
        const sObjectNameValue = ObjectPath.get("objectName.value", oDataSource) || "";
        const sObjectName = ObjectPath.get("objectName", oDataSource) || "";
        const bValueIsAll = sObjectNameValue.toLowerCase() === "$$all$$";
        const bObjectNameIsAll = sObjectName.toLowerCase() === "$$all$$";

        // Don't save $$ALL$$
        if (!bValueIsAll && !bObjectNameIsAll) {
            await this.oRecentDataSources.newItem(oDataSource);
        }

        return this.oRecentDataSources.getRecentItems();
    };

    /**
     * Returns the list of recently used data sources.
     *
     * Was part of the public interface.
     * @returns {Promise<sap.ushell.services.UserRecents.RecentDataSource[]>} A Promise that is resolved to the list of updated entries for data sources.
     *
     * @since 1.19.0
     * @private
     */
    UserRecents.prototype.getRecentDataSources = function () {
        return this.oRecentDataSources.getRecentItems();
    };

    // ====================================================================================
    // ================================== Recent Apps =====================================

    /**
     * Checks if the given applications are equivalent.
     *
     * @param {sap.ushell.services.UserRecents.RecentApp} oItem1 The first app to be checked.
     * @param {sap.ushell.services.UserRecents.RecentApp} oItem2 The second app to be checked.
     * @returns {boolean} True if both applications are equivalent, otherwise false.
     *
     * @static
     * @private
     */
    UserRecents._compareApps = function (oItem1, oItem2) {
        return oItem1.semanticObject === oItem2.semanticObject && oItem1.action === oItem2.action;
    };

    /**
     * Notification that the given app item has just been used.
     * Adds the search to the list of recently done searches.
     *
     * Was part of the public interface.
     * @param {sap.ushell.services.UserRecents.RecentApp} oAppItem The app item identified by the string parameter <code>id</code>
     * @returns {Promise<sap.ushell.services.UserRecents.RecentApp[]>} A Promise that is resolved to the updated list of recent apps.
     *
     * @since 1.15.0
     * @private
     * @deprecated since 1.93. Please use {@link #addAppActivity} instead.
     */
    UserRecents.prototype.noticeApp = UserRecents.prototype.addAppActivity;

    /**
     * Notifies the service that the given app item has been used recently.
     *
     * Was part of the public interface.
     * @param {sap.ushell.services.UserRecents.RecentApp} oAppItem The app item identified by the string parameter <code>id</code>
     * @returns {Promise<sap.ushell.services.UserRecents.RecentApp[]>} A Promise that is resolved to the updated list of recent apps.
     *
     * @since 1.93.0
     * @private
     */
    UserRecents.prototype.addAppActivity = async function (oAppItem) {
        await this.oRecentApps.newItem(oAppItem);
        return this.oRecentApps.getRecentItems();
    };

    /**
     * Returns the list of recently used apps.
     *
     * Was part of the public interface.
     * @returns {Promise<sap.ushell.services.UserRecents.RecentApp[]>} A Promise that is resolved to the list of recent apps.
     *
     * @since 1.15.0
     * @private
     */
    UserRecents.prototype.getRecentApps = function () {
        return this.oRecentApps.getRecentItems();
    };

    // ===================================================================================================
    // ================================== Frequent / Recent Activity =====================================

    /**
     * Adds the given activity item to the list of activities.
     *
     * Was part of the public interface.
     * @param {sap.ushell.services.UserRecents.ActivityItem} oActivityItem The activity to be added.
     * @returns {Promise<sap.ushell.services.UserRecents.ActivityItem[]>} A Promise that is resolved to the list of updated activities.
     *
     * @since 1.32.0
     * @private
     */
    UserRecents.prototype.addActivity = async function (oActivityItem) {
        await this.oRecentActivity.newItem(oActivityItem);
        return this.oRecentActivity.getRecentItems();
    };

    /**
     * Clears the list of activities.
     *
     * Was part of the public interface.
     * @returns {Promise} A promise that is resolved once all activities are cleared.
     *
     * @since 1.54.0
     * @private
     */
    UserRecents.prototype.clearRecentActivities = async function () {
        await this.oRecentActivity.clearAllActivities();
    };

    /**
     * Resolves to the list of activities.
     *
     * Was part of the public interface.
     * @returns {Promise<sap.ushell.services.UserRecents.ActivityItem[]>} A Promise that is resolved to the list of activities.
     *
     * @since 1.32.0
     * @private
     * @ui5-restricted S/4 MyHome (ux.eng.s4producthomes1)
     */
    UserRecents.prototype.getRecentActivity = function () {
        return this.oRecentActivity.getRecentItems();
    };

    /**
     * Resolves the frequent activities.
     *
     * Was part of the public interface.
     * @returns {Promise<sap.ushell.services.UserRecents.ActivityItem[]>} A Promise that is resolved to a list of frequently used activities.
     *
     * @since 1.42.0
     * @private
     * @ui5-restricted S/4 MyHome (ux.eng.s4producthomes1)
     */
    UserRecents.prototype.getFrequentActivity = function () {
        return this.oRecentActivity.getFrequentItems();
    };

    // ==================================================================================
    // ================================== App Usage =====================================

    /**
     * Increment usage count for the given hash.
     * Currently called on openApp event.
     *
     * @param {string} sHash The hash for the app for which a usage should be registered.
     * @returns {Promise} Resolves once the app usage is added.
     *
     * @private
     */
    UserRecents.prototype.addAppUsage = async function (sHash) {
        const sRelevantHash = UrlParsing.getBasicHash(sHash);

        await this.oAppsUsage.addAppUsage(sRelevantHash);
    };

    /**
     * API function for the New VD 1 - user action Collector
     * Returns a map of total usage of all (used) applications, plus the maximum and minimum values.
     *
     * @returns {Promise<sap.ushell.services.UserRecents.AppsUsageSummary>} A Promise that is resolved to an object containing usage-per-hash map and the minimum and maximum values.
     *
     * @private
     */
    UserRecents.prototype.getAppsUsage = function () {
        return this.oAppsUsage.getAppsUsage();
    };

    UserRecents.hasNoAdapter = true;
    return UserRecents;
});
