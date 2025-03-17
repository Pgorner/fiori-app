// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/i18n/Localization",
    "sap/base/i18n/ResourceBundle",
    "sap/base/Log",
    "sap/base/util/ObjectPath",
    "sap/m/library",
    "sap/ui/core/IconPool",
    "sap/ui/thirdparty/hasher",
    "sap/ui/thirdparty/jquery",
    "sap/ui/util/Mobile",
    "sap/ushell/EventHub",
    "sap/ushell/resources",
    "sap/ushell/utils/UrlParsing",
    "sap/ushell/utils",
    "sap/ushell/Container",
    "sap/ushell/Config"
], function (
    Localization,
    ResourceBundle,
    Log,
    ObjectPath,
    mobileLibrary,
    IconPool,
    hasher,
    jQuery,
    Mobile,
    EventHub,
    ushellResources,
    UrlParsing,
    ushellUtils,
    Container,
    Config
) {
    "use strict";

    // shortcut for sap.m.ButtonType
    var ButtonType = mobileLibrary.ButtonType;

    /**
     * @alias sap.ushell.services.AppConfiguration
     * @namespace
     * @description The unified shell's AppConfiguration service as a singleton object.
     *
     * @since 1.15.0
     * @public
     */
    function AppConfiguration () {
        const oMetadata = {};
        let bApplicationInInitMode = true;
        let oCurrentApplication = null;
        let aIdsOfAddedButtons = [];
        const aAppRequestsQueue = [];

        /**
         * Handles the appRendered event.
         *
         * @private
         * @alias sap.ushell.services.AppConfiguration#_applicationOpenedHandler
         */
        this._applicationOpenedHandler = function (/*sChannelId, sEventId, oData*/) {
            // update the opened application object
            bApplicationInInitMode = false;

            // check the app requests queue and call all the requests if any
            while (aAppRequestsQueue.length > 0) {
                aAppRequestsQueue.shift()();
            }
        };

        /**
         * Due to performance changes on component (app) loading, it is possible that an application would be initialized before
         * the shell state was changed, therefore we listen to the appRendered event and keep a reference to the opened app metadata
         * object, to verify that the addApplicationSettingsButtons APIs is called only after the application is actually opened.
         *
         * @private
         */
        EventHub.on("AppRendered").do(this._applicationOpenedHandler.bind(this));

        /**
         * Adds an entry to user recent activity list.
         * The list of recent activities will be displayed in the UserActionsMenu of FLP application (fiori 2.0)
         * This method should be used by applications of special types. like "Search", "OVP", "Co-Pilot" and "FactSheet"
         * This method should be only called in the "exit" method of applications Component.js
         * in order to assure that it will be added to recent activities.
         * For these applications the unique identifier of the entry is url and not appId, so in order to add different entry,
         * different url should be specified, otherwise the entry will be updated with a new timestamp
         * Only applications of type Search and Co-Pilot can set their icon.
         *
         * @param {object} oRecentActivity oRecentActivity
         * @example Of oRecentActivity object - all properties are mandatory:
         * <pre>
         *   {
         *     title: 'Sample Activity Entry',
         *     appType: 'OVP',
         *     appId: "#Action-todefaultapp",
         *     url: "#Action-todefaultapp?param1"
         *   }
         * </pre>
         * @example Of oRecentActivity object for application of type Search and Co-Pilot:
         * <pre>
         *   {
         *     icon: 'sap-icon://search',//not mandatory. In case icon is not set, a default one will be used
         *     title: 'Sample Activity Entry',
         *     appType: 'Search',
         *     appId: "#Action-todefaultapp",
         *     url: "#Action-todefaultapp?param1"
         *   }
         * </pre>
         * @returns {jQuery.Promise} Resolves the updated list of user recents.
         *
         * @public
         * @deprecated since 1.120 without replacement.
         * @alias sap.ushell.services.AppConfiguration#addActivity
         */
        this.addActivity = function (oRecentActivity) {
            const oDeferred = new jQuery.Deferred();

            Container.getServiceAsync("UserRecents")
                .then((UserRecentsService) => {
                    return UserRecentsService.addActivity(oRecentActivity);
                })
                .then(oDeferred.resolve)
                .catch(oDeferred.reject);

            return oDeferred.promise();
        };

        /**
         * @private
         * @alias sap.ushell.services.AppConfiguration#setApplicationInInitMode
         */
        this.setApplicationInInitMode = function () {
            bApplicationInInitMode = true;
        };

        /**
         * Returns the application request queue.
         * @returns {function[]} The application request queue
         *
         * @private
         * @alias sap.ushell.services.AppConfiguration#getApplicationRequestQueue
         */
        this.getApplicationRequestQueue = function () {
            return aAppRequestsQueue;
        };

        /**
         * Returns the current application, excluding the home page and the appfinder (which are FLP Core components).
         *
         * @returns {object} A copy of the metadata object related to the application, or null if no application is currently opened
         *   (e.g., when home or app finder are opened).
         *
         * @private
         * @alias sap.ushell.services.AppConfiguration#getCurrentApplication
         */
        this.getCurrentApplication = function () {
            return oCurrentApplication;
        };

        /**
         * Returns the current application, excluding the home page and the appfinder (which are FLP Core components).
         *
         * @returns {object} A copy of the metadata object related to the application, or null if no application is currently opened
         *   (e.g., when home or app finder are opened).
         *
         * @private
         * @deprecated since 1.120.0. Use {@link sap.ushell.services.AppConfiguration#getCurrentApplication} instead.
         * @alias sap.ushell.services.AppConfiguration#getCurrentAppliction
         */
        this.getCurrentAppliction = this.getCurrentApplication;


        /**
         * Type for the metadata object for AppConfiguration
         * @typedef {object} sap.ushell.services.AppConfiguration.Metadata
         * @property {string} title The title of the application
         * @property {string} library The library of the application
         * @property {string} version The version of the application
         * @property {boolean} fullWidth A Boolean value indicating if the application fills the full width of the screen
         * @since 1.120.0
         * @public
         */

        /**
         * Returns the current metadata.
         *
         * @param {object} [oApplication] oApplication
         * @param {string|undefined} [sFixedShellHash] sFixedShellHash
         * @returns {sap.ushell.services.AppConfiguration.Metadata} A copy of the metadata object
         *
         * @private
         * @ui5-restricted sap.feedback.ui
         * @alias sap.ushell.services.AppConfiguration#getMetadata
         */
        this.getMetadata = function (oApplication, sFixedShellHash) {
            if (!oApplication) {
                oApplication = oCurrentApplication;
            }

            if (oApplication) {
                let sHash;
                if (sFixedShellHash) {
                    // remove the "#" from the hash
                    sHash = sFixedShellHash.slice(1);
                } else {
                    sHash = hasher?.getHash ? hasher.getHash() : "";
                }

                const sKey = this._getMemoizationKey(sHash);

                return this._getMetadata(oApplication, sKey);
            }

            return {};
        };

        /**
         * @param {string} sCompleteHash The complete hash
         * @returns {sap.ui.core.URI} The intent
         *
         * @private
         * @alias sap.ushell.services.AppConfiguration#_getMemoizationKey
         */
        this._getMemoizationKey = function (sCompleteHash) {
            const [ sIntent, sParams ] = sCompleteHash.split("?");

            const sProcessedParams = this._processParams(sParams);
            if (sProcessedParams) {
                return sIntent + sProcessedParams;
            }

            const oParsedShellHash = UrlParsing.parseShellHash(sCompleteHash);
            if (oParsedShellHash) {
                const { semanticObject, action } = oParsedShellHash;
                return `${semanticObject}-${action}`;
            }
            return "";
        };

        /**
         * @param {string} [sParams] The params
         * @returns {string} The process params
         *
         * @private
         * @alias sap.ushell.services.AppConfiguration#_getMemoizationKey
         */
        this._processParams = function (sParams) {
            if (!sParams) {
                return "";
            }

            const oParams = {};

            sParams.split("&").forEach((item) => {
                const [sName, sValue] = item.split("=");

                oParams[sName] = sValue;
            });

            const aSortedParamKeys = Object.keys(oParams).sort();

            const sProcessedParams = aSortedParamKeys.reduce((sResult, sKey, iIndex) => {
                const sParam = `${sKey}=${oParams[sKey]}`;

                return `${sResult}${iIndex > 0 ? "&" : "?"}${sParam}`;
            }, "");

            return sProcessedParams;
        };

        /**
         * @param {object} oApplication The application
         * @param {string} sKey The key
         * @returns {object} The metadata
         *
         * @private
         * @alias sap.ushell.services.AppConfiguration#_getMetadata
         */
        this._getMetadata = function (oApplication, sKey) {
            if (!(oMetadata.hasOwnProperty(sKey)) || !oMetadata[sKey].complete) {
                this.addMetadata(oApplication, sKey);
            }

            // If metadata was not created - create it now as an empty object
            if (!oMetadata[sKey]) {
                oMetadata[sKey] = {
                    complete: false
                };
            }
            // If title doesn't exist in the metadata - try to get it from the result of navTargetResolution,
            // or use the default application title
            if (!oMetadata[sKey].title) {
                oMetadata[sKey].title = oApplication.text || ushellResources.i18n.getText("default_app_title");
            }
            return oMetadata[sKey];
        };

        /**
         * @param {object} oApplication The new application
         *
         * @private
         * @alias sap.ushell.services.AppConfiguration#setCurrentApplication
         */
        this.setCurrentApplication = function (oApplication) {
            oCurrentApplication = oApplication;

            // make sure that the queue is empty for the new app
            // if there was an error in an application initialization the queue may have entries of another application
            aAppRequestsQueue.splice(0);
        };

        /**
         * Sets the hiding of the shell header.
         *
         * @private
         * @deprecated since 1.56 without replacement. The header hiding is not supported anymore.
         * @alias sap.ushell.services.AppConfiguration#setHeaderHiding
         */
        this.setHeaderHiding = function () {
            Log.warning("Application configuration headerHiding property is deprecated and has no effect");
        };

        /**
         * Adds buttons to the action sheet in the shell header.
         * This function always overrides the already existing application settings buttons with the new buttons.
         * It is meant to be used by applications that want to add their own settings button to the shell header.
         *
         * @param {sap.m.Button[]} aButtons List of sap.m.Button controls
         *
         * @public
         * @deprecated since 1.120. Use {@link sap.ushell.services.Extension#addUserAction} instead.
         * @alias sap.ushell.services.AppConfiguration#addApplicationSettingsButtons
         */
        this.addApplicationSettingsButtons = function (aButtons) {
            // in case current application is not yet open we delay the call till it would be opened.
            /**
             * oCurrentApplication should not be null as the setCurrentApplication API must be set before application is loaded!
             * However currently it may happen in case ABAP is loading the application inside when the target is resolved in abap.js
             * before the shell.controller sets the application.
             * Therefore we are making sure that the oCurrentApplication is not null
             * so the app settings button will not appear in the home screen.
             * This check may be removed once this issue will be resolved.
             * See ticket #1680036349
             */
            /**
             * We check only the equality between the url's because it is sufficient condition to identify an app.
             * We also check the existence of both url's to avoid edge case of "undefined === undefined" which results in true.
             * See ticket #1670473374
             */
            if (bApplicationInInitMode) {
                aAppRequestsQueue.push(() => {
                    this._addApplicationSettingsButtons(aButtons);
                });
            } else {
                this._addApplicationSettingsButtons(aButtons);
            }
        };

        /**
         * Adds buttons to the action sheet in the shell header.
         * @param {sap.m.Button[]} aButtons List of sap.m.Button controls
         *
         * @private
         * @deprecated since 1.120. Use {@link sap.ushell.services.Extension#addUserAction} instead.
         * @alias sap.ushell.services.AppConfiguration#_addApplicationSettingsButtons
         */
        this._addApplicationSettingsButtons = function (aButtons) {
            const oRenderer = Container.getRendererInternal("fiori2");
            const aIds = [];

            for (let i = 0; i < aButtons.length; i++) {
                const oCurrentButton = aButtons[i];
                aIds.push(oCurrentButton.getId());
                oCurrentButton.setIcon(oCurrentButton.getIcon() || IconPool.getIconURI("customize"));
                // in case the button has the text "Settings" we change it to "App Setting" in order prevent name collision
                if (ushellResources.i18n.getText("userSettings") === oCurrentButton.getProperty("text")) {
                    oCurrentButton.setProperty("text", ushellResources.i18n.getText("userAppSettings"));
                }
                oCurrentButton.setType(ButtonType.Unstyled);
            }
            if (oRenderer) {
                if (aIdsOfAddedButtons.length) {
                    // remove buttons that were added earlier
                    oRenderer.hideActionButton(aIdsOfAddedButtons, true);
                }
                aIdsOfAddedButtons = aIds;
                oRenderer.showActionButton(aIds, true, undefined, true);
            }
        };

        /**
         * Sets the title of the browser tabSets the title of the browser tab.
         *
         * @param {string} sTitle title
         *
         * @private
         * @alias sap.ushell.services.AppConfiguration#setWindowTitle
         */
        this.setWindowTitle = function (sTitle) {
            const sWindowTitleExtension = ushellResources.getTranslationFromJSON(Config.last("/core/shell/windowTitleExtension"));
            if (sWindowTitleExtension) {
                if (ushellResources.getRTL()) {
                    sTitle = `${sWindowTitleExtension} - ${sTitle}`;
                } else {
                    sTitle = `${sTitle} - ${sWindowTitleExtension}`;
                }
            }
            window.document.title = sTitle;
        };

        /**
         * Sets the icons of the browser.
         *
         * @param {object} oIconsProperties Icon properties, an object holding icon URLs
         *
         * @public
         * @deprecated since 1.120.0. Use {@link sap.ui.util.Mobile#setIcons} instead.
         * @alias sap.ushell.services.AppConfiguration#setIcons
         */
        this.setIcons = function (oIconsProperties) {
            Mobile.setIcons(oIconsProperties);
        };

        /**
         * Sets the application screen size to full width
         *
         * @param {boolean} bValue A Boolean value indicating if the application fills the full width of the screen
         *
         * @public
         * @deprecated since 1.120.0. Use the "sap.ui/fullWidth" property in the application's manifest.json instead.
         * @alias sap.ushell.services.AppConfiguration#setApplicationFullWidth
         */
        this.setApplicationFullWidth = function (bValue) {
            this.setApplicationFullWidthInternal(bValue);
        };

        /**
         * Sets the application screen size to full width
         *
         * @param {boolean} bValue A Boolean value indicating if the application fills the full width of the screen
         *
         * @private
         * @alias sap.ushell.services.AppConfiguration#setApplicationFullWidthInternal
         */
        this.setApplicationFullWidthInternal = function (bValue) {
            EventHub.emit("setApplicationFullWidth", {
                bValue: bValue,
                date: Date.now()
            });
        };

        /**
         * @param {object} oApplication The application
         * @returns {string} the application name
         *
         * @private
         * @alias sap.ushell.services.AppConfiguration#getApplicationName
         */
        this.getApplicationName = function (oApplication) {
            const sAdditionalInformation = oApplication?.additionalInformation;

            if (sAdditionalInformation) {
                // SAPUI5.Component=<fully-qualified-component-name>
                const aMatches = /^SAPUI5\.Component=(.+)$/i.exec(sAdditionalInformation);
                if (aMatches) {
                    // determine namespace, view name, and view type
                    return aMatches[1];
                }
            }
            return null;
        };

        /**
         * @param {object} oApplication The application
         * @returns {string} the application url
         *
         * @private
         * @alias sap.ushell.services.AppConfiguration#getApplicationUrl
         */
        this.getApplicationUrl = function (oApplication) {
            let sUrl = oApplication?.url;
            const sSegmentToDetermineWebGUITransaction = "P_TCODE";

            if (sUrl) {
                if (oApplication.applicationType === "NWBC" && sUrl.indexOf(sSegmentToDetermineWebGUITransaction)) {
                    // in case it is a WebGUI transaction then return the whole URL of the application
                    return sUrl;
                }
                const iIndexOfQuestionMark = sUrl.indexOf("?");
                if (iIndexOfQuestionMark >= 0) {
                    // pass GET parameters of URL via component data as member startupParameters
                    // (to allow blending with other oComponentData usage, e.g. extensibility use case)
                    sUrl = sUrl.slice(0, iIndexOfQuestionMark);
                }
                if (sUrl.slice(-1) !== "/") {
                    sUrl += "/"; // ensure URL ends with a slash
                }
            }
            return sUrl;
        };

        /**
         * Reads a property value from the configuration
         *
         * Value translation is required if the configuration includes another property
         * whose key is composed of the original key + the string "Resource".
         * e.g. For translating the value of the property "title" - there's another configuration property: "titleResource": "TITLE_KEY".
         * The value (e.g. "TITLE_KEY") is the translation key in the resource bundle
         * @param {object} oConfig The configuration
         * @param {string} sPropertyKey The property key
         * @param {sap.base.i18n.ResourceBundle} oResourceBundle The resource bundle
         * @returns {string|undefined} The value of the property, or undefined if the property is not found
         *
         * @private
         * @alias sap.ushell.services.AppConfiguration#_getPropertyValueFromConfig
         */
        this._getPropertyValueFromConfig = function (oConfig, sPropertyKey, oResourceBundle) {
            const sKey = `${sPropertyKey}Resource`;

            if (oResourceBundle && oConfig.hasOwnProperty(sKey)) {
                return oResourceBundle.getText(oConfig[sKey]);
            }

            if (oConfig.hasOwnProperty(sPropertyKey)) {
                return oConfig[sPropertyKey];
            }
        };

        /**
         * Reads a property value from the manifest
         *
         * @param {sap.ui.core.Component} oComponentInstance The metadata component
         * @param {object} oProperties The properties
         * @param {string} sPropertyKey The property key
         * @returns {string|object} The value of the property, or undefined if the property is not found
         *
         * @private
         * @alias sap.ushell.services.AppConfiguration#_getPropertyValueFromManifest
         */
        this._getPropertyValueFromManifest = function (oComponentInstance, oProperties, sPropertyKey) {
            const sManifestEntryKey = oProperties[sPropertyKey].manifestEntryKey;
            const sManifestPropertyPath = oProperties[sPropertyKey].path || "";
            const oManifestEntry = oComponentInstance.getManifestEntry(sManifestEntryKey);

            return ObjectPath.get(sManifestPropertyPath, oManifestEntry);
        };

        /**
         * Adds the application metadata to oMetadata object.
         * Application metadata is taken from the manifest/descriptor (1st priority),
         * if exists, and from the component configuration (2nd priority).
         *
         * @param {object} oApplication Includes data for launching the application, such as applicationType, url, etc..
         * @param {string} sKey - the complete url hash of the application which consists of the app Intent
         *   and the parameters in lexicographically sorted order.
         *
         * @private
         * @alias sap.ushell.services.AppConfiguration#addMetadata
         */
        this.addMetadata = function (oApplication, sKey) {
            try {
                const sComponentName = this.getApplicationName(oApplication);
                const sUrl = this.getApplicationUrl(oApplication);
                // Hash object that maps application metadata property (i.e. property name) to its corresponding entry and path
                // in the application descriptor (i.e. manifest file), if exists
                const oProperties = {
                    fullWidth:
                        { manifestEntryKey: "sap.ui", path: "fullWidth" },
                    hideLightBackground:
                        { manifestEntryKey: "sap.ui", path: "hideLightBackground" },
                    title:
                        { manifestEntryKey: "sap.app", path: "title" },
                    icon:
                        { manifestEntryKey: "sap.ui", path: "icons.icon" },
                    favIcon:
                        { manifestEntryKey: "sap.ui", path: "icons.favIcon" },
                    homeScreenIconPhone:
                        { manifestEntryKey: "sap.ui", path: "icons.phone" },
                    "homeScreenIconPhone@2":
                        { manifestEntryKey: "sap.ui", path: "icons.phone@2" },
                    homeScreenIconTablet:
                        { manifestEntryKey: "sap.ui", path: "icons.tablet" },
                    "homeScreenIconTablet@2":
                        { manifestEntryKey: "sap.ui", path: "icons.tablet@2" },
                    startupImage320x460:
                        { manifestEntryKey: "sap.ui", path: "icons.startupImage640x920" },
                    startupImage640x920:
                        { manifestEntryKey: "sap.ui", path: "icons.startupImage640x920" },
                    startupImage640x1096:
                        { manifestEntryKey: "sap.ui", path: "icons.startupImage640x1096" },
                    startupImage768x1004:
                        { manifestEntryKey: "sap.ui", path: "icons.startupImage768x1004" },
                    startupImage748x1024:
                        { manifestEntryKey: "sap.ui", path: "icons.startupImage748x1024" },
                    startupImage1536x2008:
                        { manifestEntryKey: "sap.ui", path: "icons.startupImage1536x2008" },
                    startupImage1496x2048:
                        { manifestEntryKey: "sap.ui", path: "icons.startupImage1496x2048" },
                    compactContentDensity:
                        { manifestEntryKey: "sap.ui5", path: "contentDensities.compact" },
                    cozyContentDensity:
                        { manifestEntryKey: "sap.ui5", path: "contentDensities.cozy" }
                };
                const oComponentHandle = oApplication?.componentHandle;

                if (!sKey) {
                    return;
                }

                if (!(oMetadata.hasOwnProperty(sKey))) {
                    // independent from application type - create an object for metadata; initialize the complete flag with false!
                    oMetadata[sKey] = { complete: false };
                }

                if (!oMetadata[sKey].complete) {
                    let oComponentInstance;
                    let oComponentMetadata;

                    if (oComponentHandle) {
                        oComponentInstance = oComponentHandle.getInstance();
                        oComponentMetadata = oComponentHandle.getMetadata();
                    } else if (sComponentName) {
                        Log.warning(`No component handle available for '${sComponentName}'; SAPUI5 component metadata is incomplete`, null, "sap.ushell.services.AppConfiguration");
                        return;
                    }

                    if (oComponentInstance && oComponentMetadata) {
                        let oResourceBundle;
                        const oConfig = oComponentInstance._getManifestEntry("/sap.ui5/config", true); // Allowed private API usage
                        oMetadata[sKey].complete = true;

                        // If configuration exists and no resource bundle was created from the manifest
                        if (oConfig) {
                            let sConfigResourceBundleUrl = oConfig.resourceBundle;
                            if (sConfigResourceBundleUrl) {
                                if (sConfigResourceBundleUrl.slice(0, 1) !== "/") {
                                    sConfigResourceBundleUrl = sUrl + sConfigResourceBundleUrl;
                                }
                                oResourceBundle = ResourceBundle.create({
                                    url: sConfigResourceBundleUrl,
                                    locale: Localization.getLanguage()
                                });
                            }
                        }

                        const bManifestExists = !!oComponentInstance.getManifest();

                        // Loop over all property names, and for each one get the value from the manifest or from the application configuration
                        for (const sPropertyKey in oProperties) {
                            if (oProperties.hasOwnProperty(sPropertyKey)) {
                                if (bManifestExists) {
                                    // Get property value from the manifest
                                    oMetadata[sKey][sPropertyKey] = this._getPropertyValueFromManifest(oComponentInstance, oProperties, sPropertyKey);
                                }

                                // If application configuration exists and the property value was not found in the manifest -
                                // look for it in the configuration
                                if (oConfig && oMetadata[sKey][sPropertyKey] === undefined) {
                                    // Get property value from the configuration
                                    oMetadata[sKey][sPropertyKey] = this._getPropertyValueFromConfig(oConfig, sPropertyKey, oResourceBundle);
                                }
                            }
                        }

                        oMetadata[sKey].version = oComponentInstance.getManifestEntry("/sap.app/applicationVersion/version");
                        oMetadata[sKey].technicalName = oComponentMetadata.getComponentName();

                        this._setTitleFromNavResult(oMetadata[sKey], oApplication);

                    } else if (ushellUtils.isApplicationTypeEmbeddedInIframe(oApplication.applicationType)) {
                        const sWdaApplicationUrlString = "/~canvas;window=app/wda/";
                        const iIndexOfWdaApplicationUrlString = oApplication.url.indexOf(sWdaApplicationUrlString);
                        const sWdaApplicationOtherUrlString = "/sap/bc/webdynpro/sap/";
                        const sWebGUIApplicationUrlString = "/bc/gui/sap/its/webgui";
                        const iIndexOfWebGUIApplicationUrlString = oApplication.url.indexOf(sWebGUIApplicationUrlString);

                        if (iIndexOfWdaApplicationUrlString >= 0) {
                            // WebDynproABAPApplication
                            // /ui2/nwbc/~canvas;window=app/wda/S_EPM_FPM_PD/?sap-wd-configId=s_epm_fpm_pd
                            oMetadata[sKey].technicalName = oApplication.url.substring(
                                (iIndexOfWdaApplicationUrlString + sWdaApplicationUrlString.length),
                                oApplication.url.indexOf("/", (iIndexOfWdaApplicationUrlString + sWdaApplicationUrlString.length))
                            );
                        }
                        if (oApplication.url.indexOf(sWdaApplicationOtherUrlString) >= 0) {
                            // other WebDynproABAPApplication
                            // /sap/bc/webdynpro/sap/S_EPM_FPM_PO?sap-client=120&sap-language=EN&sap-ui-tech-hint=WDA&
                            oMetadata[sKey].technicalName = new RegExp(sWdaApplicationOtherUrlString + "(.*)[?]").exec(oApplication.url)[1];
                        }
                        oMetadata[sKey].complete = true;
                        if (iIndexOfWebGUIApplicationUrlString >= 0) {
                            // WebGUITransaction
                            // /sap/bc/gui/sap/its/webgui;~sysid=XXX;~service=3255?%7etransaction=SU01&%7enosplash=1
                            const sETransactionString = "etransaction=";
                            const iETransactionStart = oApplication.url.indexOf(sETransactionString, iIndexOfWebGUIApplicationUrlString + sWebGUIApplicationUrlString.length);
                            const iETransactionEndDetermination = oApplication.url.indexOf("&", iETransactionStart);
                            const iETransactionEnd = (iETransactionEndDetermination >= 0) ? iETransactionEndDetermination : oApplication.url.length;
                            oMetadata[sKey].technicalName = decodeURIComponent(oApplication.url.substring(
                                iETransactionStart + sETransactionString.length,
                                iETransactionEnd
                            )) + " (TCODE)";
                        }
                    } else {
                        Log.warning("No technical information for the given application could be determined", null, "sap.ushell.services.AppConfiguration");
                    }
                }

                /*
                 * Special behavior for relative URLs:
                 * Relative URLs are considered relative to the folder containing the Component.js, which requires adjustments here.
                 * Otherwise the browser would interpret them as relative to the location of the HTML file,
                 * which might be different and also hard to guess for app developers.
                 */
                const potentiallyRelativeUrls = [
                    "favIcon",
                    "homeScreenIconPhone",
                    "homeScreenIconPhone@2",
                    "homeScreenIconTablet",
                    "homeScreenIconTablet@2",
                    "startupImage320x460",
                    "startupImage640x920",
                    "startupImage640x1096",
                    "startupImage768x1004",
                    "startupImage748x1024",
                    "startupImage1536x2008",
                    "startupImage1496x2048"
                ];

                const sComponentUrl = (sUrl?.[sUrl.length - 1] === "/") ? sUrl.substring(0, sUrl.length - 1) : sUrl;

                potentiallyRelativeUrls.forEach((sPropName) => {
                    const sOrigValue = oMetadata[sKey][sPropName];
                    let sFinalValue = null;
                    // Some URL properties might not be defined.
                    if (sOrigValue) {
                        sFinalValue = this._isUrlRelative(sOrigValue) ? `${sComponentUrl}/${sOrigValue}` : sOrigValue;
                    }
                    oMetadata[sKey][sPropName] = sFinalValue;
                });
            } catch (err) {
                Log.warning("Application configuration could not be parsed");
            }
        };

        /**
         * Checks if the given URL is relative.
         * @param {sap.ui.core.URI} sUrl The URL to check
         * @returns {boolean} true if the URL is relative, false otherwise
         *
         * @private
         * @alias sap.ushell.services.AppConfiguration#_isUrlRelative
         */
        this._isUrlRelative = function (sUrl) {
            if (!sUrl) {
                return false;
            }
            if (sUrl.match(/^https?:\/\/.*/)) {
                return false;
            }
            return sUrl[0] !== "/";
        };

        /**
         * Helper function to override the title of the manifest
         * with the title from the navigation result (target mapping).
         * This is done for "generic" UI5 apps which have a concrete specialization
         * in the FLP content with a specific title.
         *
         * @param {object} oMetadataEntry - the metadata for a specific app
         * @param {object} oApplication - the application data retrieved from the navigation target resolution
         *
         * @private
         * @alias sap.ushell.services.AppConfiguration#_setTitleFromNavResult
         */
        this._setTitleFromNavResult = function (oMetadataEntry, oApplication) {
            const sNavTargetResolutionTitle = oApplication?.text;
            const sUi5ComponentName = oMetadataEntry.technicalName;
            const aUseAppTitleFromNavTargetResolutionConfig = Config.last("/core/shell/useAppTitleFromNavTargetResolution") || [];
            if (sNavTargetResolutionTitle && aUseAppTitleFromNavTargetResolutionConfig.includes(sUi5ComponentName)) {
                oMetadataEntry.title = sNavTargetResolutionTitle;
            }
        };
    }

    return new AppConfiguration();
}, true /* bExport */);
