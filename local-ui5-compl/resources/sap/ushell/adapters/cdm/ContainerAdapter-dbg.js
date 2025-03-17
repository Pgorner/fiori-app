// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview The Unified Shell"s container adapter for the Common Data Model (CDM) platform.
 *
 * @version 1.132.1
 */
sap.ui.define([
    "sap/base/Log",
    "sap/base/util/deepClone",
    "sap/base/util/extend",
    "sap/base/util/ObjectPath",
    "sap/ui/thirdparty/URI",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/System",
    "sap/ushell/User",
    "sap/ushell/utils",
    "sap/ushell/Container",
    "sap/ushell/resources"
], function (
    Log,
    deepClone,
    extend,
    ObjectPath,
    URI,
    jQuery,
    System,
    User,
    ushellUtils,
    Container,
    resources
) {

    "use strict";

    /**
     * @namespace sap.ushell.adapters.cdm
     * @description Default namespace for Unified Shell adapters for the Common Data Model (CDM) platform.
     *
     * @see sap.ushell.adapters.cdm.ContainerAdapter
     * @since 1.48.0
     * @private
     */

    var oLogger = Log.getLogger("sap/ushell/adapters/cdm/ContainerAdapter", Log.Level.INFO);

    /**
     * @class
     * @classdesc The Unified Shell's container adapter which does the bootstrap for the Common Data Model (CDM) platform.
     *
     * This method MUST be called by the Unified Shell"s container only, others MUST call
     * <code>sap.ushell.services.initializeContainer("cdm")</code>.
     * Constructs a new instance of the container adapter for the Common Data Model (CDM) platform.
     *
     * @param {sap.ushell.System} oInitialSystem the logon system (alias, platform, base URL)
     *
     * @see sap.ushell.services.initializeContainer
     *
     * @hideconstructor
     *
     * @since 1.48.0
     * @private
     */
    var ContainerAdapter = function (oInitialSystem, sParameter, oProperties) {
        var S_LOGOUT_URL_DEFAULT = "/sap/public/bc/icf/logoff",
            sLogoutUrl = getLogoffUrl(oProperties.config, S_LOGOUT_URL_DEFAULT),
            sLogoutMethod = ObjectPath.get("systemProperties.logoutMethod", oProperties.config) || "GET",
            sCsrfTokenUrl = ObjectPath.get("systemProperties.csrfTokenUrl", oProperties.config),
            oUser = createUser(oProperties.config),
            oSystem = createSystem(oInitialSystem, oProperties.config),
            oSessionKeepAliveConfig = getSessionKeepAliveConfig(oProperties.config);

        function getLogoffUrl (oConfig, sDefaultLogoffUrl) {
            if (oConfig.systemProperties && oConfig.systemProperties.logoutUrl) {
                return oConfig.systemProperties.logoutUrl;
            }

            return sDefaultLogoffUrl;
        }

        function createUser (oConfig) {
            var oUserSettings,
                oUserProfile = oConfig.userProfile;

            if (oUserProfile) {
                oUserSettings = createUserSettingsAsExpectedByUser(
                    oUserProfile.defaults,
                    oConfig.userProfilePersonalization,
                    oUserProfile.metadata
                );
            }

            // safe guard user settings
            const oEffectiveUserSettings = removeUnsupportedUserProperties(oUserSettings || getNewUserSettingsWithDefaults());

            return new User(oEffectiveUserSettings);
        }

        function createSystem (oOldSystem, oConfig) {
            var oSystemProperties = oConfig.systemProperties,
                sAlias = oOldSystem.getAlias(),
                sPlatform = oOldSystem.getPlatform(),
                sBaseUrl = oOldSystem.getBaseUrl(),
                sSID,
                sClient,
                sProductName,
                sProductVersion,
                sSystemName,
                sSystemRole,
                sTenantRole;

            if (oSystemProperties) {
                sAlias = oSystemProperties.alias || sAlias;
                sPlatform = oSystemProperties.platform || sPlatform;
                sSID = oSystemProperties.SID;
                sClient = oSystemProperties.client;
                sProductName = oSystemProperties.productName;
                sProductVersion = oSystemProperties.productVersion;
                sSystemName = oSystemProperties.systemName;
                sSystemRole = oSystemProperties.systemRole;
                sTenantRole = oSystemProperties.tenantRole;
            }

            return new System({
                alias: sAlias,
                platform: sPlatform,
                baseUrl: sBaseUrl,
                system: sSID,
                client: sClient,
                productName: sProductName,
                productVersion: sProductVersion,
                systemName: sSystemName,
                systemRole: sSystemRole,
                tenantRole: sTenantRole
            });
        }

        /**
         * sap.ushell.User expects an object with user settings. This looks different than in
         * oProperties.config.userProfile as the interface expects the structure as the ABAP
         * start_up service returned it.
         *
         * @param {object} oDefaults
         * @param {object} oPersonalization
         * @param {object} oUserMetadata
         * @returns {object} UserSettings
         *
         * @private
         */
        function createUserSettingsAsExpectedByUser (oDefaults, oPersonalization, oUserMetadata) {
            var oUserSettings = extend(getNewUserSettingsWithDefaults(), oDefaults, oPersonalization);

            oUserSettings.bootTheme = oUserSettings.bootTheme || {
                theme: oUserSettings.theme,
                root: ""
            };

            // ... remove redundant theme properties
            delete oUserSettings.theme;
            if (oUserMetadata) {
                // set edit modes
                if (oUserMetadata.editablePropterties) {
                    oUserSettings.setThemePermitted = oUserMetadata.editablePropterties.indexOf("theme") > -1;
                    oUserSettings.setAccessibilityPermitted = oUserMetadata.editablePropterties.indexOf("accessibility") > -1;
                    oUserSettings.setContentDensityPermitted = oUserMetadata.editablePropterties.indexOf("contentDensity") > -1;
                }
                if (oUserMetadata.ranges) {
                    oUserSettings.ranges = oUserMetadata.ranges;
                }
            }
            return oUserSettings;
        }

        /**
         * Returns an object with default settings as sap.ushell.Container expects it.
         * @returns {object}
         *   The user settings defaults within a new object
         * @private
         */
        function getNewUserSettingsWithDefaults () {
            return {
                setThemePermitted: false,
                setAccessibilityPermitted: false,
                setContentDensityPermitted: false
            };
        }

        /**
         * Validates and extracts the sessionKeepAlive configuration from the adapter configuration
         *
         * @param {object} oAdapterConfig the adapter config
         * @returns {object} the extracted sessionKeepAlive config or <code>null</code> if invalid of undefined
         */
        function getSessionKeepAliveConfig (oAdapterConfig) {
            var oConfig = oAdapterConfig && oAdapterConfig.systemProperties
                && oAdapterConfig.systemProperties.sessionKeepAlive;

            if (!oConfig) {
                return null;
            }

            if (!oConfig.url) {
                oLogger.error("Mandatory parameter 'url' missing in 'sessionKeepAlive' configuration.");
                return null;
            }

            if (oConfig.method !== "HEAD" && oConfig.method !== "GET") {
                oConfig.method = "HEAD";
            }

            return oConfig;
        }

        /**
         * Returns the logout URL.
         *
         * @returns {string}
         *  The logout URL as configured.
         *
         * @private
         */
        this._getLogoutUrl = function () {
            return sLogoutUrl;
        };

        /**
         * Sets the given sLocation as window.document.location in order to force a redirect
         *
         * @param {string} sLocation
         * @private
         */
        this._setDocumentLocation = function (sLocation) {
            document.location = sLocation;
        };


        this._setWindowLocation = function (data) {
            window.location.href = data;
        };

        /**
         * Returns the logon system.
         *
         * @returns {sap.ushell.System}
         *     object providing information about the system where the container is logged in
         *
         * @since 1.48.0
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
         * @since 1.48.0
         */
        this.getUser = function () {
            return oUser;
        };

        /**
         * Does the bootstrap for the Common Data Model (CDM) platform (and loads the container's configuration).
         *
         * @returns {jQuery.Promise}
         *     a promise that is resolved once the bootstrap is done
         *
         * @since 1.48.0
         */
        this.load = function () {
            // nothing to do here, as the configuration is already loaded via the cdm bootstrap.
            return jQuery.when();
        };

        /**
         * Returns the current URL. Mainly defined to ease testability.
         *
         * @returns {string}
         *    the URL displayed currently in the address bar
         *
         * @private
         */
        this.getCurrentUrl = function () {
            return window.location.href;
        };

        /**
         * Logs out the current user from this adapter's systems backend system.
         *
         * @param {boolean} bLogonSystem <code>true</code> if this system is the logon system
         * @returns {Promise<undefined>} Returns a <code>Promise</code> to be resolved when logout is finished, even when it failed
         *
         * @since 1.48.0
         */
        this.logout = async function (bLogonSystem) {
            var sFullLogOffUrl;

            if (!bLogonSystem) {
                // this is the logout from a non-logon system
                throw new Error("Not implemented");
            }

            // This is the logout from the logon system (FES).
            if (ushellUtils.hasNativeLogoutCapability()) {
                sFullLogOffUrl = (new URI(this._getLogoutUrl()))
                    .absoluteTo(this.getCurrentUrl())
                    .search("") // NOTE: remove query parameters
                    .toString();
                ushellUtils.getPrivateEpcm().doLogOff(sFullLogOffUrl);
            } else {
                // Do a redirect to the corresponding logout URL
                await this.logoutRedirect();
            }
        };

        /**
         * Does necessary url adjustments and triggers the technical redirect to the logoff page.
         *
         * @returns {Promise<undefined>} Returns a <code>Promise</code> to be resolved
         *
         * @since 1.48.0
         * @private
         */
        this.logoutRedirect = async function () {
            // adjust the URL, e.g. by applying sap-client or base URL
            const sCurrentLogout = oSystem.adjustUrl(this._getLogoutUrl());

            //new support for logoff via POST and not GET (currently used in CF)
            if (sLogoutMethod === "POST") {
                Log.info("performing logout from system via POST", undefined, "sap.ushell.adapters.cdm.ContainerAdapter::logoutRedirect");

                // First, fetch the X-CSRF-Token
                let bError = false;
                let responseCsrfToken;
                try {
                    responseCsrfToken = await fetch(sCsrfTokenUrl, {
                        method: "HEAD",
                        headers: {
                            "X-CSRF-Token": "Fetch"
                        }
                    });
                } catch (error) {
                    bError = true;
                }

                if (bError || !responseCsrfToken.ok) {
                    Log.error("fetching X-CSRF-Token for logout via POST failed for system: " + oSystem.getAlias(),
                        undefined, "sap.ushell.adapters.cdm.ContainerAdapter::logoutRedirect");

                    // Unauthorized, no need to log off
                    if (responseCsrfToken.status === 401) {
                        ushellUtils.reload();
                        return;
                    }

                    // All other errors should be shown in an error dialog and the page should be reloaded when the dialog was closed
                    const oMessageService = await Container.getServiceAsync("MessageInternal");
                    oMessageService.show(oMessageService.Type.ERROR, resources.i18n.getText("LogoutFailed"), { callback: ushellUtils.reload });

                    // Don't proceed with the logoff
                    return;
                }

                let responseLogout;
                try {
                    responseLogout = await fetch(sCurrentLogout, {
                        method: "POST",
                        headers: {
                            "X-CSRF-Token": responseCsrfToken.headers.get("X-CSRF-Token")
                        }
                    });

                    const sLogoutRedirectUrl = await responseLogout.text();
                    this._setWindowLocation(sLogoutRedirectUrl);
                } catch (error) {
                    bError = true;
                }

                if (bError || !responseLogout.ok) {
                    Log.error("logout via POST failed for system: " + oSystem.getAlias(),
                        undefined, "sap.ushell.adapters.cdm.ContainerAdapter::logoutRedirect");
                }
            } else {
                Log.info("performing logout from system via GET (redirect)", undefined, "sap.ushell.adapters.cdm.ContainerAdapter::logoutRedirect");
                this._setDocumentLocation(sCurrentLogout);
            }
        };

        /**
         * Sends a request in order to extend server session
         * and prevent server session time out before client session time.
         * <p>
         * Reads the URL and HTTP method from the bootstrap configuration.
         *
         * @since 1.66.0
         */
        this.sessionKeepAlive = function () {

            if (!oSessionKeepAliveConfig) {
                return;
            }

            var oXHR = new XMLHttpRequest();
            oXHR.open(oSessionKeepAliveConfig.method, oSessionKeepAliveConfig.url, /*async=*/true);

            oXHR.onreadystatechange = function () {
                if (this.readyState === /*DONE*/4) {
                    oLogger.debug("Server session was extended");
                }
            };

            oXHR.send();
        };

        /**
         * Accessor for the sessionKeepAlive configuration. Only exposed for tests.
         *
         * @returns {object} - the validated sessionKeepAlive config
         *
         * @private
         */
        this._getSessionKeepAliveConfig = function () {
            return oSessionKeepAliveConfig;
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
