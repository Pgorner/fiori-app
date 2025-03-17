// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview The Unified Shell's container adapter for the ABAP platform.
 *
 * @version 1.132.1
 */
sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "sap/ushell/System",
    "sap/ushell/User",
    "sap/ushell/utils",
    "sap/ushell_abap/bootstrap/evo/abap.bootstrap.utils",
    "sap/ushell_abap/pbServices/ui2/ODataWrapper",
    "sap/ui/thirdparty/URI",
    "sap/ui/thirdparty/datajs",
    "sap/base/util/deepClone",
    "sap/base/util/ObjectPath",
    "sap/base/Log",
    "sap/ushell/Container"
], function(
    jQuery,
    System,
    User,
    utils,
    abapUtils,
    ODataWrapper,
    URI,
    OData,
    deepClone,
    ObjectPath,
    Log,
    Container
) {
    "use strict";

    /**
     * @class
     * @classdesc The Unified Shell's container adapter which does the bootstrap for the ABAP platform.
     *
     * This method MUST be called by the Unified Shell's container only, others MUST call
     * <code>sap.ushell.services.initializeContainer("abap")</code>.
     * Constructs a new instance of the container adapter for the ABAP platform.
     *
     * @param {sap.ushell.System} oSystem the logon system (alias, platform, base URL)
     *
     * @hideconstructor
     * @see sap.ushell.services.initializeContainer
     *
     * @since 1.11.0
     * @private
     */
    var ContainerAdapter = function (oSystem, sParameter, oProperties) {
        var oUser,
            S_LOGOFF_URL = "/sap/public/bc/icf/logoff";

        /**
         * Performs a logout to a remote system by adding a hidden IFRAME pointing to the logout URL.
         * Resolves the <code>Promise</code> when the iframe has been loaded
         * (e.g. the logoutURL has been requested and the cookies processed).
         *
         * @param {string} sUrl The logout URL
         * @returns {Promise<undefined>} A <code>Promise</code> that resolves when the iframe has been loaded
         *
         * @private
         */
        this._logoutViaHiddenIFrame = function (sUrl) {
            return new Promise((resolve) => {
                var oFrame = document.createElement("iframe"),
                    sSafeUrl = sUrl.replace(/"/g, "\\\"");

                window.addEventListener("message", function (oEvent) {
                    if (oEvent.data === sUrl) {
                        resolve();
                    }
                });

                oFrame.style.visibility = "hidden";
                oFrame.setAttribute("src", sUrl);

                function onload () {
                    parent.postMessage(sSafeUrl, "*");
                }

                oFrame.addEventListener("load", onload);
                oFrame.addEventListener("error", onload);

                document.body.appendChild(oFrame);
            });
        };

        /**
         * Returns the logon system.
         *
         * @returns {sap.ushell.System} An object providing information about the system where the container is logged in
         *
         * @since 1.11.0
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
         * @since 1.11.0
         */
        this.getUser = function () {
            return oUser;
        };

        this._determineAccessibility = function (oStartupResult) {
            var vAccesibilityUrl = utils.getParameterValueBoolean("sap-accessibility");
            if (vAccesibilityUrl !== undefined) {
                return vAccesibilityUrl;
            }
            vAccesibilityUrl = oStartupResult.accessibility;
            if (vAccesibilityUrl !== undefined) {
                return vAccesibilityUrl;
            }
            // as sap.ui.getCore().getConfiguration().getAccessibility(); //always true
            return false;
        };

        // propagate a) THEME editstate;
        //           b) ACCESSIBLITY and ACCESSIBLITY editstate to other properties of the
        // startup result (modified!)
        this._setThemeAccessibilityFlags = function (oStartupResult) {
            if (oStartupResult.userProfile && oStartupResult.userProfile.length) {
                var oUserProfileDataTheme,
                    oUserProfileDataAccessibility;
                oUserProfileDataTheme = oStartupResult.userProfile.filter(function (profileProperty) {
                    return profileProperty.id && profileProperty.id === "THEME";
                })[0];
                // Theme
                if (oUserProfileDataTheme && oUserProfileDataTheme.value) {
                    oStartupResult.setThemePermitted = (oUserProfileDataTheme.editState === 3);
                    // it is not a good idea to disable theme editing when a url parameter is present
                    // if one has applied a messed up theme which corrupts the dialoge to set the theme,
                    // there is no non-expert easy way to get rid of the setting
                } else {
                    oStartupResult.oUserProfileDataTheme = false;
                }
                // AccessibilityPermitted: Note: we only register whether editing the Accessibility is allowed on the
                // ABAP Platform, we don't test whether accessibility is available!
                oUserProfileDataAccessibility = oStartupResult.userProfile.filter(function (profileProperty) {
                    return profileProperty.id && profileProperty.id === "ACCESSIBILITY";
                })[0];
                if (oUserProfileDataAccessibility && oUserProfileDataAccessibility.id) {
                    oStartupResult.setAccessibilityPermitted = (oUserProfileDataAccessibility.editState === 3);
                } else {
                    oStartupResult.setAccessibilityPermitted = false;
                }
                if (oUserProfileDataAccessibility && oUserProfileDataAccessibility.value === "true") {
                    oStartupResult.accessibility = true;
                }
                if (oUserProfileDataAccessibility && oUserProfileDataAccessibility.value === "false") {
                    oStartupResult.accessibility = false;
                }
                // else present accessibility is retained!
                // set accessibility itself, respecting url parameters
                // note that currently sap.ui.getCore().getConfiguration().getAccessiblity() is always true per default
                oStartupResult.accessiblity = this._determineAccessibility(oStartupResult);
            }
        };

        /**
         * Propagates editState of profile properties
         * -> For further implementations please use this method instead of _setThemeAccessibilityFlags
         * -> should also fill the userProfile if some of the properties are missing e.g. 'value'
         * @param {object} oStartupResult
         *     Data which comes from Startup Service
         *
         * @private
         *
         * @since 1.30.0
         */
        this._setUserProfileFlags = function (oStartupResult) {

            if (oStartupResult.userProfile && oStartupResult.userProfile.length && Array.isArray(oStartupResult.userProfile)) {
                var oUserProfileIdHistory = {};
                //Initialize setContentDensityPermitted with a default value
                oStartupResult.setContentDensityPermitted = false;
                // ContentDensityPermitted: Note: we only register whether editing the ContentDensity is allowed on the
                // ABAP Platform, we don't test whether ContentDensity is available!
                oStartupResult.userProfile.forEach(function (oUserProfileParameter) {
                    //to avoid the treatment of duplicates -> so the first one will be used
                    if ((oUserProfileParameter.id in oUserProfileIdHistory)) {
                        return;
                    }
                    oUserProfileIdHistory[oUserProfileParameter.id] = oUserProfileParameter.id;
                    if (oUserProfileParameter.id === "CONTENT_DENSITY") {
                        oStartupResult.contentDensity = oUserProfileParameter.value;
                        oStartupResult.setContentDensityPermitted = (
                                oUserProfileParameter &&
                                oUserProfileParameter.editState === 3
                            ) || false;
                    }
                    if (oUserProfileParameter.id === "TRACKING_USAGE_ANALYTICS") {
                        if (typeof oUserProfileParameter.value === "string") {
                            //check if string is 'true' OR 'false' -> if 'yes' set the explicit boolean value
                            if (oUserProfileParameter.value.toLowerCase() === "true" || oUserProfileParameter.value.toLowerCase() === "false") {
                                oUserProfileParameter.value = (oUserProfileParameter.value.toLowerCase() === "true") || false;
                            } else {
                                oUserProfileParameter.value = undefined;
                            }
                        }

                        if (typeof oUserProfileParameter.value === "undefined" || typeof oUserProfileParameter.value === "boolean") {
                            oStartupResult.trackUsageAnalytics = oUserProfileParameter.value;
                        } else {
                            oStartupResult.trackUsageAnalytics = undefined;
                        }
                    }
                    // FLP Spaces MyHome - whether the user has opted not to import bookmarks from classical FLP
                    if (oUserProfileParameter.id === "MYHOME_IMPORT_FROM_CLASSIC") {
                        oStartupResult.importBookmarks = oUserProfileParameter.value;
                    }
                    // FLP Spaces MyHome - whether the user has opted not to show the My Home page
                    if (oUserProfileParameter.id === "MYHOME_ENABLEMENT") {
                        switch (oUserProfileParameter.value) {
                            case "false":
                                oStartupResult.showMyHome = false;
                                break;
                            case "true":
                                oStartupResult.showMyHome = true;
                                break;
                            default:
                                oStartupResult.showMyHome = undefined;
                                break;
                        }
                    }
                    // Dark Mode Auto Detection - whether the user has disabled it
                    if (oUserProfileParameter.id === "THEME_DARKMODE_AUTO_DETECTION") {
                        switch (oUserProfileParameter.value) {
                            case "false":
                                oStartupResult.detectDarkMode = false;
                                break;
                            case "true":
                                oStartupResult.detectDarkMode = true;
                                break;
                            default:
                                oStartupResult.detectDarkMode = undefined;
                                break;
                        }
                    }
                });
            }
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
        this._removeUnsupportedUserProperties = function (oProperties) {
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
                "detectDarkMode",
                "userProfile"
            ];

            Object.keys(oPropertiesClone).forEach((sKey) => {
                if (!aSupportedProperties.includes(sKey)) {
                    delete oPropertiesClone[sKey];
                }
            });

            return oPropertiesClone;
        };

        /**
         * Does the bootstrap for the ABAP platform (and loads the container's configuration).
         *
         * @returns {jQuery.Promise} Resolves once the bootstrap is done.
         *
         * @since 1.11.0
         */
        this.load = function () {
            var oDeferred = new jQuery.Deferred(),
                oStartupResult = oProperties.config,
                oSystemProperties = oStartupResult.systemProperties;

            // recreate the system object as the oStartupResult contains more system
            // related information than oSystem
            oSystem = new System({
                alias: oSystem.getAlias(),
                platform: oSystem.getPlatform(),
                baseUrl: oStartupResult.baseUrl,
                client: oStartupResult.client,
                clientRole: oStartupResult.clientRole,
                system: oStartupResult.system,
                productName: oSystemProperties && oSystemProperties.productName,
                systemName: oSystemProperties && oSystemProperties.systemName,
                systemRole: oSystemProperties && oSystemProperties.systemRole,
                tenantRole: oSystemProperties && oSystemProperties.tenantRole,
                productVersion: oStartupResult.productVersion,
                isTrialSystem: oStartupResult.isTrialSystem,
                sysInfoBar: oSystemProperties && oSystemProperties.sysInfoBar,
                sysInfoBarColor: oSystemProperties && oSystemProperties.sysInfoBarColor,
                sysInfoBarMainText: oSystemProperties && oSystemProperties.sysInfoBarMainText,
                sysInfoBarSecondaryText: oSystemProperties && oSystemProperties.sysInfoBarSecondaryText,
                sysInfoBarIcon: oSystemProperties && oSystemProperties.sysInfoBarIcon
            });

            // Remove once oStartupResult is retrieved with 'setAccessibilityPermitted' & 'setThemePermitted' flags.
            this._setThemeAccessibilityFlags(oStartupResult);
            this._setUserProfileFlags(oStartupResult);

            // safe guard user settings
            const oEffectiveUserSettings = this._removeUnsupportedUserProperties(oStartupResult);
            oUser = new User(oEffectiveUserSettings);
            // set the SAP Language on the ODataWrapper,
            // if supplied, this will propagated to a sap-language header
            // assuring a consistent window language
            ODataWrapper["sap-language"] = oStartupResult.language;
            ODataWrapper["sap-client"] = oStartupResult.client;

            if (oStartupResult.target) {
                // cache information about initial application resolution
                ContainerAdapter.startUpApplication = {
                    adjustedInitialTarget: oStartupResult.adjustedInitialTarget, // "output"
                    target: oStartupResult.target // "input"
                };
            }

            // TODO: remove this from startup sequence
            this._setUserImage(oUser);

            return oDeferred.resolve().promise();
        };

        /**
         * Add further remote systems to be logged out
         *
         * @returns {jQuery.Promise} Resolved after further remote systems are added in to local storage
         * @since 1.19.0
         */
        this.addFurtherRemoteSystems = function () {
            var oDeferred = new jQuery.Deferred();

            Container.getServiceAsync("PageBuilding")
                .then(function (PageBuildingService) {
                    PageBuildingService
                        .getFactory()
                        .getPageBuildingService()
                        .readAllCatalogsForUser("type eq 'H' or type eq 'REMOTE'", function (oData) { //success handler
                            var sSocialMediaUrl = "/sap/opu/odata/sap/SM_CATALOG_SRV/";
                            if (oData.results) {
                                oData.results.forEach(function (oCatalog) {
                                    var bIsHANAUrl = /^\/sap\/hba\//.test(oCatalog.baseUrl);
                                    if (oCatalog.type === "H" || oCatalog.baseUrl === sSocialMediaUrl || bIsHANAUrl) {
                                        Container.addRemoteSystem(new System({
                                            alias: oCatalog.systemAlias,
                                            platform: (bIsHANAUrl || oCatalog.type === "H")
                                                ? "hana" : "abap",
                                            baseUrl: oCatalog.type === "H" ? "" : ";o="
                                        }));
                                    }
                                });
                            }
                            oDeferred.resolve();
                        }, function (sError) { //error handler
                            Log.error("Reading REMOTE catalogs failed: "
                                + sError, null,
                                "sap.ushell_abap.adapters.abap.ContainerAdapter");
                            oDeferred.reject();
                        });
                })
                .catch(oDeferred.reject);

            return oDeferred.promise();
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
         * The HEAD call to PageSet service in order to extend server session
         * and prevent server session time out before client session time.
         */
        this.sessionKeepAlive = function () {
            var sPageSetsUrl = "/sap/opu/odata/UI2/PAGE_BUILDER_PERS";
            var oXHR = abapUtils.createAndOpenXHR(sPageSetsUrl, null, "HEAD");
            oXHR.onreadystatechange = function () {
                if (this.readyState === /*DONE*/4) {
                   Log.debug("server session was extended");
                }
            };
            oXHR.send();
        };
        /**
         * Logs out the current user from this adapter's systems backend system.
         *
         * @param {boolean} bLogonSystem <code>true</code> if this system is the logon system
         * @returns {Promise<undefined>} Resolved when logout is finished
         *
         * @since 1.11.0
         * @private
         */
        this.logout = async function (bLogonSystem) {
            if (bLogonSystem) {
                if (utils.hasNativeLogoutCapability()) {
                    var sFullLogOffUrl = (new URI(S_LOGOFF_URL))
                        .absoluteTo(this.getCurrentUrl())
                        .search("") // NOTE: remove query parameters
                        .toString();
                    window.external.getPrivateEpcm().doLogOff(sFullLogOffUrl);
                } else {
                    this.logoutRedirect();
                }
                Log.info("ABAP system logged out: " + oSystem.getAlias(), null,
                    "sap.ushell_abap.adapters.abap.ContainerAdapter");
            } else {
                // construct fully qualified logoff URL (potentially adds scheme, authority, origin, sap-client)
                var sUrl = this._setUrlLanguage(oSystem.adjustUrl(S_LOGOFF_URL));

                // always logout via hidden iframe; this avoids implicit XHR re-logon in case the
                // logoff URL triggers a redirect (see BCP 0020079747 0000863255 2015)
                Log.info("Logging out from system '" + oSystem.getAlias() + "' via hidden iframe");
                await this._logoutViaHiddenIFrame(sUrl);
            }
        };

        /**
         * Does necessary url adjustments and triggers the technical
         * redirect to the logoff page
         *
         * @since 1.19.0
         */
        this.logoutRedirect = function () {
            var sUrl = this._setUrlLanguage(oSystem.adjustUrl(S_LOGOFF_URL));
            this._setDocumentLocation(sUrl);
        };

        /**
         * Updates the document location forcing a redirect
         *
         * (Note: This functionality needs to be encapsulated
         * into an own helper function as it needs to be stubbed
         * in unit tests avoiding redirection to different locations)
         *
         * @param {string} sLocation document location
         * @private
         */
        this._setDocumentLocation = function (sLocation) {
            window.document.location = sLocation;
        };

        /**
         * Retrieves the user profile picture URL from Jam and sets it in the user object.
         *
         * TODO: this functionality should be moved out of the Container Adapter completely
         * and called lazily by the FLP shell, ideally by invoking a plug-in. Then the
         * configuration of the profile picture is also correctly accessed only in the shell
         * controller. But for now, we keep the logic here but evaluate the configruation
         * setting - to omit the odata call completely if profile picture is switched off and
         * to really ensure that it is not loaded (user image URL not set).
         *
         * Image is requested and set asynchronously, failures are only logged.
         *
         * @param {object} oUser user object
         * @private
         */
        this._setUserImage = function (oUser) {

            function isUserImageEnabled () {
                // just as quick workaround, we read the renderer configuration directly
                // will be removed later
                var oConfig = window["sap-ushell-config"],
                    vUserImageEnabled = ObjectPath.get("renderers.fiori2.componentData.config.enableUserImage", oConfig);

                return !!vUserImageEnabled;
            }

            if (isUserImageEnabled() && oUser && oUser.isJamActive && oUser.isJamActive()) {
                OData.read("/sap/bc/ui2/smi/rest_tunnel/Jam/api/v1/OData/Self?$format=json", function (oResponseData) {
                    var sJamUserId = oResponseData.results.Id,
                        sJamUserImageUrl = "/sap/bc/ui2/smi/rest_tunnel/Jam/api/v1/OData/Members('" + sJamUserId + "')/ProfilePhoto/$value";

                    oUser.setImage(sJamUserImageUrl);
                }, function () {
                    Log.error("Could not recieve JAM user data");
                });
            }
        };

        /**
         * Appends the sap-language parameter if defined
         *
         * This ensures that the logout screen is always in the desired language
         *
         * @param {string} sUrl document location
         * @returns {string} the modified Url
         * @private
         */
        this._setUrlLanguage = function (sUrl) {
            const sLanguage = this.getUser().getLanguage();
            if (sLanguage) {
                sUrl += (sUrl.indexOf("?") >= 0 ? "&" : "?") + "sap-language=" + sLanguage;
            }
            return sUrl;
        };
    };

    return ContainerAdapter;
});
