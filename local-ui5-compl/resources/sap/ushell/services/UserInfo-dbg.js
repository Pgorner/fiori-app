// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview The Unified Shell's user information service. Allows retrieving information about the logged-in user.
 *
 * @version 1.132.1
 */
sap.ui.define([
    "sap/base/Log",
    "sap/ushell/Config",
    "sap/ushell/User",
    "sap/ushell/Container"
], function (
    Log,
    Config,
    User,
    Container
) {
    "use strict";

    // To not overload the adapter implementation on any platform, we memorize the Promises,
    // so we can return the same for each method call
    var mAdapterPromises = {
        themeList: null,
        languageList: null,
        userSettingList: null
    };

    /**
     * @alias sap.ushell.services.UserInfo
     * @class
     * @classdesc The Unified Shell's user information service.
     * Allows retrieving information about the logged-in user.
     *
     * <b>Note:</b> To retrieve a valid instance of this service, it is necessary to call {@link sap.ushell.Container#getServiceAsync}.
     * <pre>
     *   sap.ui.require(["sap/ushell/Container"], async function (Container) {
     *     const UserInfo = await Container.getServiceAsync("UserInfo");
     *     // do something with the UserInfo service
     *   });
     * </pre>
     *
     * @param {object} oAdapter Adapter
     * @param {object} oContainerInterface interface
     *
     * @augments sap.ushell.services.Service
     * @hideconstructor
     *
     * @since 1.16.3
     * @public
     */
    function UserInfo (oAdapter, oContainerInterface) {
        /**
         * Returns the id of the user.
         *
         * @returns {string} The user id.
         *
         * @since 1.16.3
         * @public
         */
        this.getId = function () {
            return Container.getUser().getId();
        };

        /**
         * Returns the first name of the user.
         *
         * @returns {string} The user's first name.
         *
         * @since 1.86.0
         * @public
         */
        this.getFirstName = function () {
            return Container.getUser().getFirstName();
        };

        /**
         * Returns the last name of the user.
         *
         * @returns {string} The user's last name.
         *
         * @since 1.86.0
         * @public
         */
        this.getLastName = function () {
            return Container.getUser().getLastName();
        };

        /**
         * Returns the full name of the user.
         *
         * @returns {string} The user's full name.
         *
         * @since 1.86.0
         * @public
         */
        this.getFullName = function () {
            return Container.getUser().getFullName();
        };

        /**
         * Returns the email address of the user.
         *
         * @returns {string} The user's email address.
         *
         * @since 1.86.0
         * @public
         */
        this.getEmail = function () {
            return Container.getUser().getEmail();
        };

        /**
         * Returns an object representing the logged-in user.
         *
         * @returns {User} object providing information about the logged-in user
         *
         * @since 1.15.0
         * @private
         */
        this.getUser = function () {
            return Container.getUser();
        };

        /**
         * Type for an object representing data about the user: ID, first name, last name, full name, e-mail address.
         * @typedef {object} sap.ushell.services.UserInfo.ShellUserInfo
         * @property {string} id The user id.
         * @property {string} email The user's email address.
         * @property {string} firstName The user's first name.
         * @property {string} lastName The user's last name.
         * @property {string} fullName The user's full name.
         *
         * @since 1.120.0
         * @public
         */

        /**
         * Returns an object representing data about the user.
         *
         * @returns {Promise<sap.ushell.services.UserInfo.ShellUserInfo>}
         *      Object providing information about the logged-in user.
         *
         * @since 1.71.0
         * @public
         */
        this.getShellUserInfo = function () {
            return Promise.resolve({
                id: this.getId(),
                email: this.getEmail(),
                firstName: this.getFirstName(),
                lastName: this.getLastName(),
                fullName: this.getFullName()
            });
        };

        /**
         * Returns the list of available calendar week numberings to the user.
         * @returns {object[]|null} Array of calendar week numberings, null if method in adapter does not exist.
         *
         * @private
         */
        this.getCalendarWeekNumberingList = function () {
            return oAdapter.getCalendarWeekNumberingList?.();
        };

        /**
         * Returns the list of themes available for the user.
         *
         * @returns {jQuery.Promise} Resolves the theme list.
         *
         * @private
         */
        this.getThemeList = function () {
            if (mAdapterPromises.themeList) {
                return mAdapterPromises.themeList;
            }
            var oPromise = oAdapter.getThemeList();
            mAdapterPromises.themeList = oPromise;
            oPromise.fail(function () {
                Log.error("getThemeList failed");
            });
            return oPromise;
        };

        /**
         * Sends the updated user attributes to the adapter.
         *
         * @returns {jQuery.Promise} Resolves once the preferences were updated.
         *
         * @private
         */
        this.updateUserPreferences = function () {
            var oPromise = oAdapter.updateUserPreferences(Container.getUser());
            oPromise.fail(function () {
                Log.error("updateAttributes: ");
            });
            return oPromise;
        };

        /**
         * Returns the list of languages or locales available for the user.
         * A list of language (e.g., en) or locale IDs (e.g., en-us).
         * The first item is the browser language - e.g. {"Browser Language":"en-us"}
         * @returns {jQuery.Promise} Resolves the list of languages.
         *
         * @private
         */
        this.getLanguageList = function () {
            if (mAdapterPromises.languageList) {
                return mAdapterPromises.languageList;
            }
            var oPromise = oAdapter.getLanguageList();
            mAdapterPromises.languageList = oPromise;
            oPromise.fail(function () {
                Log.error("getLanguageList failed");
            });
            return oPromise;
        };

        /**
         * Returns the list of User Profile Property ValueLists .
         * @returns {jQuery.Promise} Resolves the user settings list.
         *
         * @private
         */
        this.getUserSettingList = function () {
            if (mAdapterPromises.userSettingList) {
                return mAdapterPromises.userSettingList;
            }
            var oPromise = oAdapter.getUserProfilePropertyValueLists();
            mAdapterPromises.userSettingList = oPromise;
            oPromise.fail(function () {
                Log.error("getUserProfilePropertyValueLists failed");
            });
            return oPromise;
        };

        /**
         * Returns if the adapter supports editing User profile value list
         * @returns {boolean} true if the adapter allows it, false otherwise
         *
         * @private
         */
        this.getUserSettingListEditSupported = function () {
            if (typeof oAdapter.getUserProfilePropertyValueLists !== "undefined") {
                return true;
            }
            return false;
        };
    }

    UserInfo.hasNoAdapter = false;
    return UserInfo;
}, true /* bExport */);
