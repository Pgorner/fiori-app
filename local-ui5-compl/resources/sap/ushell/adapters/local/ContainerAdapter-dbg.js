// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview The Unified Shell's container adapter for standalone demos.
 *
 * @version 1.132.1
 */
sap.ui.define([
    "sap/base/Log",
    "sap/base/i18n/Localization",
    "sap/base/util/deepClone",
    "sap/base/util/ObjectPath",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/System",
    "sap/ushell/User",
    "sap/ushell/utils"
], function (
    Log,
    Localization,
    deepClone,
    ObjectPath,
    jQuery,
    System,
    User,
    utils
) {
    "use strict";

    /**
     * @namespace sap.ushell.adapters.local
     * @description Default namespace for Unified Shell adapters for standalone demos. They can usually
     * be placed directly into this namespace, e.g.
     * <code>sap.ushell.adapters.local.ContainerAdapter</code>.
     *
     * @see sap.ushell.adapters.local.ContainerAdapter
     * @since 1.15.0
     */

    /**
     * @class
     * @classdesc The Unified Shell's container adapter which does the bootstrap for standalone demos.
     *
     * This method MUST be called by the Unified Shell's container only, others MUST call
     * <code>sap.ushell.services.initializeContainer("local")</code>.
     * Constructs a new instance of the container adapter for standalone demos.
     *
     * @param {sap.ushell.System} oSystem the logon system (alias, platform, base URL)
     * @param {string} sParameter Parameter string, not in use
     * @param {object} oAdapterConfiguration the Adapter Configuration
     *
     * @hideconstructor
     *
     * @see sap.ushell.services.initializeContainer
     * @since 1.15.0
     * @private
     */
    var ContainerAdapter = function (oSystem, sParameter, oAdapterConfiguration) {
        var oUser;

        var oAdapterConfig = ObjectPath.create("config", oAdapterConfiguration);
        var oUserConfig = { // default values
            id: "DEFAULT_USER",
            firstName: "Default",
            lastName: "User",
            fullName: "Default User",
            accessibility: false,
            isJamActive: false,
            language: Localization.getLanguage() || "en",
            bootTheme: {
                theme: "sap_horizon",
                root: ""
            },
            themeRoot: "/sap/public/bc/themes/",
            setAccessibilityPermitted: true,
            setThemePermitted: true,
            isLanguagePersonalized: false,
            setContentDensityPermitted: true,
            trackUsageAnalytics: null
        };

        for (var sKey in oAdapterConfig) {
            if (oAdapterConfig.hasOwnProperty(sKey)) {
                oUserConfig[sKey] = oAdapterConfig[sKey];
            }
        }

        // recreate the system object to add system related properties
        oSystem = new System({
            alias: oSystem.getAlias(),
            platform: oSystem.getPlatform(),
            productName: ObjectPath.get("systemProperties.productName", oAdapterConfig),
            productVersion: ObjectPath.get("systemProperties.productVersion", oAdapterConfig),
            systemName: ObjectPath.get("systemProperties.systemName", oAdapterConfig),
            systemRole: ObjectPath.get("systemProperties.systemRole", oAdapterConfig),
            tenantRole: ObjectPath.get("systemProperties.tenantRole", oAdapterConfig)
        });

        /**
         * Returns the logon system.
         *
         * @returns {sap.ushell.System}
         *     object providing information about the system where the container is logged in
         *
         * @since 1.15.0
         */
        this.getSystem = function () {
            return oSystem;
        };

        /**
         * Returns the logged-in user.
         *
         * @returns {sap.ushell.User}
         *      object providing information about the logged-in user
         *
         * @since 1.15.0
         */
        this.getUser = function () {
            return oUser;
        };

        /**
         * Instructs the platform/backend system to keep the session alive.
         *
         * @since 1.48.0
         */
        this.sessionKeepAlive = function () {
            console.warn("Demo container adapter sessionKeepAlive called");
        };

        /**
         * Does the bootstrap for the demo platform (and loads the container's configuration).
         *
         * @returns {jQuery.Promise}
         *     a promise that is resolved once the bootstrap is done
         *
         * @since 1.15.0
         */
        this.load = function () {
            var oDeferredLoad = new jQuery.Deferred();

            if (oAdapterConfig && typeof oAdapterConfig.setUserCallback === "string") {
                // enables a delayed setting of the displayed user name
                var oDeferredUserCallback = new jQuery.Deferred();
                var aUserCallbackNamespace = oAdapterConfig.setUserCallback.split(".");
                var sUserCallback = aUserCallbackNamespace.pop();
                var oUserCallback;
                if (aUserCallbackNamespace.length === 0) {
                    oUserCallback = window;
                } else {
                    oUserCallback = ObjectPath.get(aUserCallbackNamespace.join("."));
                }
                if (oUserCallback && typeof oUserCallback[sUserCallback] === "function") {
                    oUserCallback[sUserCallback](oDeferredUserCallback);
                } else {
                    throw new utils.Error("ContainerAdapter local platform: Cannot execute setUserCallback - " +
                        oAdapterConfig.setUserCallback);
                }
                oDeferredUserCallback.done(function (oUserNames) {
                    [
                        "id",
                        "firstName",
                        "lastName",
                        "fullName"
                    ].forEach(function (val) {
                        if (oUserNames[val] && typeof oAdapterConfig.setUserCallback !== "function") {
                            oUserConfig[val] = oUserNames[val];
                        }
                    });

                    // safe guard user settings
                    const oEffectiveUserSettings = removeUnsupportedUserProperties(oUserConfig);

                    oUser = new User(oEffectiveUserSettings);
                    oDeferredLoad.resolve();
                });
            } else {
                // safe guard user settings
                const oEffectiveUserSettings = removeUnsupportedUserProperties(oUserConfig);

                oUser = new User(oEffectiveUserSettings);
                oDeferredLoad.resolve();
            }
            return oDeferredLoad.promise();
        };

        /**
         * Logs out the current user from this adapter's systems backend system.
         *
         * @returns {Promise<undefined>}
         *      a <code>Promise</code> to be resolved when logout is finished, even when it failed
         * @since 1.15.0
         * @public
         */
        this.logout = async function () {
            Log.info("Demo system logged out: " + oSystem.getAlias(), null,
                "sap.ushell.adapters.local.ContainerAdapter");
            utils.reload();
        };

        /**
         * Removes all unsupported user properties from the given user settings. This allows to safely
         * create a new User object with the given settings.
         * @param {object} oProperties The user settings
         * @returns {object} The user settings without unsupported properties
         *
         * @since 1.132.0
         * @private
         */
        function removeUnsupportedUserProperties (oProperties) {
            const oPropertiesClone = deepClone(oProperties);

            const aSupportedProperties = [
                "id",
                "email",
                "firstName",
                "lastName",
                "fullName",
                "isJamActive",
                "isAdminUser",
                "timeZone",
                "language",
                "languageBcp47",
                "image",
                "isImageConsent",
                "isLanguagePersonalized",
                "calendarWeekNumbering",
                "trackUsageAnalytics",
                "contentDensity",
                "setContentDensityPermitted",
                "accessibility",
                "setAccessibilityPermitted",
                "bootTheme",
                "themeRoot",
                "ranges",
                "setThemePermitted",
                "importBookmarks",
                "showMyHome",
                "detectDarkMode"
            ];

            Object.keys(oPropertiesClone).forEach(function (sKey) {
                if (!aSupportedProperties.includes(sKey)) {
                    delete oPropertiesClone[sKey];
                }
            });

            return oPropertiesClone;
        }
    };


    return ContainerAdapter;

}, /* bExport= */ false);
