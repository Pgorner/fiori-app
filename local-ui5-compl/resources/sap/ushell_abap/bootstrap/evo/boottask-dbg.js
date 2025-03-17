// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell_abap/bootstrap/evo/abap.xhrlogon.LibLoader",
    "./abap.bootstrap.utils",
    "./abap.request.startup",
    "./abap.request.pageset",
    "./abap.xhrlogon.handler",
    "./abap.theme.handler",
    "sap/ushell/EventHub",
    "sap/ui/performance/trace/initTraces",
    "sap/base/util/ObjectPath",
    "sap/base/Log",
    "sap/ushell_abap/pbServices/ui2/Utils",
    "sap/ushell/bootstrap/common/common.util",
    "./SAPCompanionConditionSetter"
],
function(
    oXhrLibLoader,
    oAbapUtils,
    oStartupHandler,
    oPageSetHandler,
    oXhrHandler,
    oThemeHandler,
    EventHub,
    initTraces,
    ObjectPath,
    Log,
    ui2Utils,
    commonUtils,
    SAPCompanionConditionSetter
) {
    "use strict";

    var oBoottask = {};

    var rShellHash = new RegExp("^(#)?([A-Za-z0-9_]+)-([A-Za-z0-9_]+)"),
        sSystemThemeRoot, // theme root - provided by startup service or fallback
        oStartupTheme; // theme from startup service


    //**************************************
    //function for operation with hash and url
    //
    //URLParsing service could not used because some functional need before Container is created
    //
    //TODO: move to ushell or seperate module or find other solution
    //**************************************

    /**
     * Determines whether an application
     * direct start is occurring.
     *
     * The root intent (e.g., #Shell-home) will
     * not determine a direct start condition.
     * @private
     */
    function isDirectStart (sHash) {
        /**
         * Determine whether sHash is a standalone hash.
         * In this case, the hash is not set as initial target for the start_up service.
         *
         * @param {string} sName
         *   URL parameter name
         * @returns {boolean}
         * @private
         */
        function isStandaloneHash (sCurrentHash) {
            if (!sCurrentHash) {
                return false;
            }
            return sCurrentHash.indexOf("Shell-home") === 0
                || sCurrentHash.indexOf("Launchpad-openFLPPage") === 0
                || sCurrentHash.indexOf("Shell-appfinder") === 0
                || sCurrentHash.indexOf("Shell-catalog") === 0
                || sCurrentHash.indexOf("shell-catalog") === 0
                || sCurrentHash.indexOf("Action-search") === 0;
        }

        /**
         * We allow to switch off the initial target resolution via configuration; use case is
         * SAP Fiori launchpad designer which bootstraps the ushell,
         * but uses non-standard URL hashes; start_up service performance is very bad if target
         * cannot be resolved; see internal CSN 0000796004 2014
         *
         * @returns {boolean} <code>true</code>, if window['sap-ushell_abap-bootstrap-abap-noInitialTarget']
         *      is set to any value
         */
        function isNoInitialTargetResolution () {
            return window["sap-ushell_abap-bootstrap-abap-noInitialTarget"] !== undefined;
        }

        var oMatch = sHash.match(rShellHash);
        var sSemanticObject = oMatch && oMatch[2];
        var sAction = oMatch && oMatch[3];
        var bIsDirectStart = sHash && !isStandaloneHash(sHash) && !isNoInitialTargetResolution() && sSemanticObject && sAction;
        return bIsDirectStart;
    }

    /**
     * Returns the shell hash which is the part of the URL fragment which determines the
     * navigation for the shell. If the URL fragment does not exist or is empty, an empty
     * string is returned.
     *
     * @returns {string}
     *     the shell hash
     *
     * @private
     */
    //TODO Refactor: Align with URLParsing.getShellHash
    function getFullShellHash () {
        var sHashDecoded,
            sHref = oAbapUtils.getLocationHref(),
            iHashIndex = sHref.indexOf("#");
        if (iHashIndex < 0) {
            return "";
        }
        //decode hash: identical behavior to ShellNavigationInternal.hrefForExternal
        sHashDecoded = decodeURI(sHref.slice(iHashIndex + 1));
        return sHashDecoded;
    }

    function getShellHash () {
        var sHashDecoded = getFullShellHash(),
            iAppStateIndex = sHashDecoded.indexOf("&/");
        return iAppStateIndex < 0 ? sHashDecoded : sHashDecoded.slice(0, iAppStateIndex);
    }

    function getContainer() {
        return sap.ui.require("sap/ushell/Container");
    }
    /**
     * Returns the parsed shell hash
     *
     * @returns {object} with properties <code>semanticObject</code> and <code>action</code>
     *
     * @private
     */
    //TODO Refactor: Align with URLParsing.getShellHash
    function getParsedShellHash (sHash) {
        var oMatch = sHash.match(rShellHash);
        return oMatch ? {semanticObject: oMatch[2], action: oMatch[3]} : undefined;
    }

    /**
     * Determine whether sHash is a hash which loads the home page; in this case
     * some OData requests are triggered early for performance optimization
     *
     * @param {string} sHash
     *   URL parameter name
     * @returns {boolean}
     *   Return true if home page or catalog
     * @private
     */
    function isHomepageHash (sHash) {
        if (!sHash || sHash === "#") {
            return true;
        }
        return (sHash.indexOf("Shell-home") === 0)
            || (sHash.indexOf("Launchpad-openFLPPage") === 0)
            || (sHash.indexOf("Shell-appfinder") === 0)
            || (sHash.indexOf("Shell-catalog") === 0)
            || (sHash.indexOf("shell-catalog") === 0);
    }

    //**************************************
    //end function for operation with hash and url
    //**************************************

    /**
     * Clone a JSON object.
     *
     * @param {object} oObject to clone
     * @returns {object} copy of the input object
     *
     * @private
     */
    function clone (oObject) {
        if (oObject === undefined) {
            return undefined;
        }
        try {
            return JSON.parse(JSON.stringify(oObject));
        } catch (e) {
            Log.error(
                "Could not clone object",
                null,
                "sap.ushell_abap.bootstrap"
            );
            return undefined;
        }
    }

    /**
     * Determines if a theme is a SAP theme
     * @param {string} sTheme
     *      Theme to be tested
     * @returns {boolean}
     *      <code>true</code> if the theme is an SAP theme
     * @private
     */
    function isSapTheme (sTheme) {
        return sTheme.indexOf("sap_") === 0;
    }

    /**
     * Sets the given language and format settings in SAPUI5.
     *
     * @param {object} [oSettings] the options (may be undefined when nothing to apply)
     * @param {string} [oSettings.language] the language
     * @param {string} [oSettings.legacyDateFormat] the date format
     * @param {string} [oSettings.legacyNumberFormat] the number format
     * @param {string} [oSettings.legacyTimeFormat] the time format
     * @param {object} [oCurrencyFormats] Currecnty Format Information
     * @param {string} [sTimeZoneIana] IANA timezone
     *
     * @private
     */
    function setSapui5Settings (oSettings, oCurrencyFormats) {
        Log.debug("setSapui5Settings()", JSON.stringify(oSettings), "sap.ushell_abap.bootstrap.abap");

        const Formatting = sap.ui.require("sap/base/i18n/Formatting");
        const Localization = sap.ui.require("sap/base/i18n/Localization");

        if (oSettings.language) {
            Localization.setLanguage(oSettings.language, oSettings.ABAPLanguage);
        }
        if (oSettings.legacyDateFormat) {
            Formatting.setABAPDateFormat(oSettings.legacyDateFormat);
        }
        if (oSettings.legacyDateCalendarCustomizing) {
            Formatting.setCustomIslamicCalendarData(oSettings.legacyDateCalendarCustomizing);
        }
        if (oSettings.legacyNumberFormat) {
            Formatting.setABAPNumberFormat(oSettings.legacyNumberFormat);
        }
        if (oSettings.legacyTimeFormat) {
            Formatting.setABAPTimeFormat(oSettings.legacyTimeFormat);
        }
        // Copy currency formats, if provided, to the UI5 custom currencies format settings
        if (typeof oCurrencyFormats === "object") {
            Formatting.addCustomCurrencies(oCurrencyFormats);
        }

        if (oSettings.useTimeZoneIana && oSettings.timeZoneIana !== "") {
            Localization.setTimezone(oSettings.timeZoneIana);
        }
    }

    /**
     *  determine a theme from the startup result, propagating it into the configuration
     *  at  window["sap-ushell-config"].services.Container.adapter.config.bootTheme
     *
     * @param {object} oBootTheme the parsed response of the start-up service call
     *
     * @private
     */
    function copyThemeToContainerAdapterConfig (oBootTheme) {
        (ObjectPath.get("sap-ushell-config.services.Container.adapter.config") || ObjectPath.create("sap-ushell-config.services.Container.adapter.config")).bootTheme = clone(oBootTheme);
    }


    /**
     * Extracts the theme root from the startup service result or fall back
     * @param {object} oStartupServiceResult
     * @returns {string} the system theme root
     *
     * @private
     */
    function extractSystemThemeRoot (oStartupServiceResult) {
        if (!oStartupServiceResult) {
            Log.error("extractSystemThemeRoot: mandatory parameter oStartupServiceResult not supplied");
        }
        if (oStartupServiceResult.themeRoot) {
            // we expect that theme root is supplied by the startup service
            return oStartupServiceResult.themeRoot;
        }
        if (oStartupServiceResult.client) {
            // fallback
            Log.warning(
                "Theme root was not contained in startup service result. A fallback to /sap/public/bc/themes/~client-<client number> is used",
                null,
                "sap.ushell_abap.bootstrap"
            );
            return "/sap/public/bc/themes/~client-" + oStartupServiceResult.client;
        }
        Log.error("extractSystemThemeRoot: Could not determine system theme root");
    }

    /**
     * Extracts the theme from the startup service result
     * @param {object} startup service result
     * @returns {string} the theme or undefined
     *
     * @private
     */
    function extractThemeFromStartupServiceResult (oStartupServiceResult) {
        var aProperties,
            oThemeData;

        if (oStartupServiceResult && oStartupServiceResult.userProfile && oStartupServiceResult.userProfile.filter) {
            aProperties = oStartupServiceResult.userProfile.filter(function (obj) {
                return obj.id === "THEME";
            });
            oThemeData = aProperties.length ? aProperties[0] : {};
            if (oThemeData.value) {
                return oThemeData.value; // this is the one we expect
            }
        }
        if (oStartupServiceResult && oStartupServiceResult.theme) {
            return oStartupServiceResult.theme; // fallback to system default theme
        }
        return ""; // fallback
    }

    /**
     * Determines the theme root for the given theme.
     * In case the theme begins with sap_ we assume that it is a theme provided by sap and therefore
     * theme root is set to "". The theme is then loaded by the UI5 http handler. This is necessary
     * as the themeing infrastructure is not mandatory and therefore it cannot be ensured that the
     * http handler of the theming infrastructure is running.
     * @params {string} theme
     * @params {string} system theme root
     * @returns {string} theme root for the given theme
     *
     * @private
     */
    function determineThemeRoot (sTheme, sSystemThemeRoot) {
        if (sTheme && isSapTheme(sTheme)) {
            // SAP theme
            return "";
        }
        return sSystemThemeRoot;
    }

    /**
     * Determines the startup theme.
     * Assumption: The theme returned in the startup service does not have a root.
     * It is only the theme name!
     * The theme root is amended here in.
     * @params {string} startup theme
     * @params {string} system theme root
     * @returns {object} theme root for the startup theme
     *
     * @private
     */
    function determineStartupTheme (oStartupServiceResult, sSystemThemeRoot) {
        var sTheme;

        sTheme = extractThemeFromStartupServiceResult(oStartupServiceResult);
        return {
            theme: sTheme,
            root: determineThemeRoot(sTheme, sSystemThemeRoot)
        };
    }

    /**
     * Extracts the theme from the URL and determines the theme root
     * @returns {object} contains the theme and the theme root, undefined if no URL theme supplied
     *
     * @private
     */
    function determineUrlTheme (sSystemThemeRoot) {
        var sThemeUrlParameter,
            aThemeParts;

        sThemeUrlParameter = oAbapUtils.getUrlParameterValue("sap-theme") || oAbapUtils.getUrlParameterValue("sap-ui-theme");
        if (sThemeUrlParameter) {
            if (sThemeUrlParameter.indexOf("@") > 0) {
                aThemeParts = sThemeUrlParameter.split("@", 2);
                return {
                    theme: aThemeParts[0],
                    root: aThemeParts[1]
                };
            }
            // no theme root supplied
            return {
                theme: sThemeUrlParameter,
                root: determineThemeRoot(sThemeUrlParameter, sSystemThemeRoot)
            };
        }
        return undefined;
    }

    /**
     * Returns value of "sap-theme" URL parameter
     * @returns {string|undefined} Theme as given via "sap-theme" URL parameter
     *
     * @private
     */
    function getSapThemeUrlParameter () {
        const oParameterMap = ui2Utils.getParameterMap();
        return oParameterMap["sap-theme"]?.[0] || oParameterMap["sap-ui-theme"]?.[0];
    }

    /**
     * Checks if a theme string is evaluated safe from an FLP perspective.
     *
     * Returns true if the theme root is not given in the theme string passed on entry,
     * or if the theme root has no origin.
     *
     * Returns false if a theme root is given and its origin is not listed in the
     * <code><meta name="sap-allowed-theme-origins" ...></code> meta tag
     *
     * Returns false if a theme root with origin is given, but no
     * <code><meta name="sap-allowed-theme-origins" ...></code> tag is available
     * to check against.
     *
     * @param {string} theme Theme string: <theme ID> or <theme ID>@<theme root>
     * @returns {boolean} <code>true</code>, <code>false</code>
     * <code>true</code> if the theme is safe.
     * <code>false</code> if the allowlist check of the theme root origin against the
     * meta tag failed or if an allowlist check of the theme origin was not
     * performed because no allowlist was given.
     *
     * @private
     */
    function isThemeSafe (theme) {

        // Analyze theme string
        var sTheme = theme;
        var iIndex = theme.indexOf("@");
        if (iIndex >= 0) {
            var sThemeRoot = sTheme.slice(iIndex + 1);
            return oThemeHandler.isThemeRootSafe(sThemeRoot);
        }
        return true;
    }

    /**
     * Process themes
     *
     * @private
     */
    function processTheme (oStartupTheme, sSystemThemeRoot) {
        var oUrlTheme;
        var oHtmlTheme = {};
        var oBootTheme;
        var sUrlTheme = getSapThemeUrlParameter();


        if (sUrlTheme && isThemeSafe(sUrlTheme)) { // URL = prio 1
            oUrlTheme = determineUrlTheme(sSystemThemeRoot);
            oBootTheme = oUrlTheme;
            Log.debug(`theme: URL theme = "${oBootTheme.theme}"  theme root = "${oBootTheme.root}"`, null, "sap.ushell_abap.bootstrap");
        } else if (oStartupTheme) { // startup theme = prio 2
            oBootTheme = oStartupTheme;
            Log.debug(`theme: startup service theme = "${oBootTheme.theme}"  theme root = "${oBootTheme.root}"`, null, "sap.ushell_abap.bootstrap");
            // If the theme is provided in the url and the theme origin is not in "sap-allowed-theme-origins" meta tag,
            // switch to the theme from userParameters because ui5 core does not do such a switch itself.
            if (sUrlTheme) {
                const sTheme = oBootTheme.theme;
                // replace unsafe url theme theme only after the core is ready
                sap.ui.require("sap/ui/core/Core").ready(() => sap.ui.require("sap/ui/core/Theming").setTheme(sTheme));
            }
        } else { // html file theme = prio 3
            // set via e.g. data-sap-ui-theme="sap_horizon" as part of UI5 startup in the central
            // Fiori launchpad html file
            oHtmlTheme.theme = ObjectPath.get("sap-ui-config.theme");
                    // could be the URL theme; no problem
                    // Assumption: no theme root included here
            if (oHtmlTheme.theme) {
                oHtmlTheme.root = ObjectPath.get("sap-ui-config.themeRoots." + oHtmlTheme.theme || "");
                if (!oHtmlTheme.root) {
                    oHtmlTheme.root = determineThemeRoot(oHtmlTheme.theme, sSystemThemeRoot);
                }
                oBootTheme = {
                    theme: oHtmlTheme.theme,
                    root: oHtmlTheme.root
                };
                Log.debug(`theme: html file theme = "${oBootTheme.theme}"  theme root = "${oBootTheme.root}"`, null, "sap.ushell_abap.bootstrap");
            } else {
                oBootTheme = {
                    theme: "",
                    root: ""
                };
                Log.error("Could not determine theme", null, "sap.ushell_abap.bootstrap");
            }
        }
        copyThemeToContainerAdapterConfig(oBootTheme);
        return oBootTheme;
    }

    /**
     * Processes the result of the Context independent
     * configuration results (part of the FioriLaunchpad.html response)
     *
     *
     * @param {object} oStartupResult
     *   the result as a JSON object
     */
    function processStartup (oStartupResult) {
        const mParameterMap = ui2Utils.getParameterMap();
        const sRequestLocale = oAbapUtils.getUrlParameterValue("sap-locale", mParameterMap);
        const oUshellConfig = {
            services: {}
        };

        // write the support ticket service enablement to the bootstrap config;
        // do not enable if already disabled, but disable if not available in backend
        const vSupportTicketEnabled = ObjectPath.get("sap-ushell-config.services.SupportTicket.config.enabled");
        if (vSupportTicketEnabled !== false) {
            oUshellConfig.services.SupportTicket = {
                config: {
                    enabled: oStartupResult.isEmbReportingActive === true
                }
            };
        }

        // we just copy the setting of the startupResult to the bootstrap configuration
        // startup result might have been adjusted with fallback URL
        oUshellConfig.services.ClientSideTargetResolution = {
            adapter: {
                config: {
                    services: {
                        targetMappings: oStartupResult?.services?.targetMappings
                    }
                }
            }
        };

        // the same settings must be copied also in the LaunchPage adapter
        // configuration as long as OData requests to target mappings are being
        // made in there.
        oUshellConfig.services.LaunchPage = {
            adapter: {
                config: {
                    services: {
                        targetMappings: oStartupResult?.services?.targetMappings,
                        launchPage: oStartupResult?.services?.pbFioriHome
                    }
                }
            }
        };

        // the same LaunchPage settings must be copied to the VisualizationDataProvider
        // configuration as it uses the LaunchPage adapter inside.
        oUshellConfig.services.VisualizationDataProvider = {
            adapter: {
                module: "sap.ushell_abap.adapters.abap.FlpLaunchPageAdapter",
                config: {
                    services: {
                        targetMappings: oStartupResult?.services?.targetMappings,
                        launchPage: oStartupResult?.services?.pbFioriHome
                    }
                }
            }
        };

        oUshellConfig.services.PageBuilding = {
            adapter: {
                config: {
                    services: {
                        pageBuilding: oStartupResult?.services?.pbFioriHome
                    }
                }
            }
        };

        // we just copy the setting of the startupResult to the bootstrap configuration
        // startup result might have been adjusted with fallback URL
        oUshellConfig.services.Personalization = {
            adapter: {
                config: {
                    services: {
                        personalization: oStartupResult?.services?.personalization
                    }
                }
            }
        };

        let oUi5UserInfo = {};
        if (!sRequestLocale) {
            oUi5UserInfo = {
                language: oStartupResult.languageBcp47 || oStartupResult.language,
                ABAPLanguage: oStartupResult.language,
                legacyDateFormat: oStartupResult.dateFormat,
                legacyDateCalendarCustomizing: oStartupResult.tislcal,
                legacyNumberFormat: oStartupResult.numberFormat === "" ? " "
                        : oStartupResult.numberFormat,
                legacyTimeFormat: oStartupResult.timeFormat
            };
        }

        // IANA Timezone support based on server config
        let bTimeZoneIana = ObjectPath.get("sap-ushell-config.ui5.timeZoneFromServerInUI5");
        if (bTimeZoneIana === undefined) {
            bTimeZoneIana = false;
            ObjectPath.set("startupConfig.timeZoneFromServerInUI5", bTimeZoneIana, oUshellConfig);
            ObjectPath.set("ushell.ui5.timeZoneFromServerInUI5", bTimeZoneIana);
        }
        let sTimeZoneIana = ObjectPath.get("sap-ushell-config.startupConfig.timeZone");
        if (sTimeZoneIana === undefined) {
            sTimeZoneIana = "";
            ObjectPath.set("startupConfig.timeZone", sTimeZoneIana, oUshellConfig);
        }

        oUi5UserInfo.useTimeZoneIana = bTimeZoneIana;
        oUi5UserInfo.timeZoneIana = sTimeZoneIana;

        // migrate configuration and write to global
        const oMigrationConfig = commonUtils.getV2ServiceMigrationConfig(oUshellConfig);
        commonUtils.mergeConfig(window["sap-ushell-config"], oMigrationConfig, true);
        commonUtils.mergeConfig(window["sap-ushell-config"], oUshellConfig, true);

        processTheme(oStartupTheme, sSystemThemeRoot);
        setSapui5Settings(oUi5UserInfo, oStartupResult.currencyFormats);
    }

    /**
     * Processes the result of the Context dependent
     * configuration results (part of an explicit start_up call)
     * result processing will trigger resolution of the following two
     * promises
     *  a) AppState Service
     *        services.AppState.config.initialAppStatesPromise
     *        (initialAppStates : { "<key>" : "value as json"})
     *  b) ClientSideTargetResolutionAdapter abap
     *        services.ClientSideTargetResolution.adapter.config.initialSegmentPromise
     *        {[aSegments], oTargetMappings, oSystems);
     * Sends AllCatalogs request if the FLP is started in page mode.
     * @param {object} oStartupResult
     *   the result as a JSON object
     */
    function processDirectStart (oStartupResult) {
        var sHash = oBoottask._getShellHash(),
            sFullHash = getFullShellHash(),
            oRequestSegment = getParsedShellHash(sHash),
            aSegment = [oRequestSegment],
            oInitialAppStates = {},
            oInitialKeys = {},
            oRequestPromise;

        var oAppStateConfig = ObjectPath.get("sap-ushell-config.services.AppState.config") ||
            ObjectPath.create("sap-ushell-config.services.AppState.config");
        var oClientTargetResolutionAdapterConfig = ObjectPath.get("sap-ushell-config.services.ClientSideTargetResolution.adapter.config") ||
            ObjectPath.create("sap-ushell-config.services.ClientSideTargetResolution.adapter.config");

        function addInitialKey (oRegex, sFullHash) {
            var oMatch = sFullHash.match(oRegex);
            var aSplit = [];
            if (!oMatch) {
                return;
            }
            aSplit = (oMatch[2]).toString().split("=");
            oInitialKeys[aSplit[0]] = aSplit[1];
        }

        function addInitialAppState (oTarget, oData, oInitialKeys, oParam, oMember) {
            if (oData && oData[oMember] && oInitialKeys && oInitialKeys[oParam]) {
                oTarget[oInitialKeys[oParam]] = oData[oMember];
            }
        }

        if (isDirectStart(sHash)) {

            addInitialKey(/(\?|&)(sap-xapp-state=[A-Z0-9]+)/, sHash);
            addInitialKey(/(\?|&)(sap-intent-param=[A-Z0-9]+)/, sHash);
            addInitialKey(/(\?|&)(sap-system=[A-Z0-9]+)/, sHash);
            addInitialKey(/(\?|&|[/])(sap-iapp-state=[A-Z0-9]+)/, sFullHash);

            oRequestPromise = oStartupHandler.requestDirectStart(oStartupResult, oRequestSegment, oInitialKeys);

            oAppStateConfig.initialAppStatesPromise = oRequestPromise.then(function (oDirectStart) {
                addInitialAppState(oInitialAppStates, oDirectStart, oInitialKeys, "sap-intent-param", "iparState");
                addInitialAppState(oInitialAppStates, oDirectStart, oInitialKeys, "sap-iapp-state", "iappState");
                addInitialAppState(oInitialAppStates, oDirectStart, oInitialKeys, "sap-xapp-state", "xappState");

                oAppStateConfig.initialAppStates = oInitialAppStates;
                return Promise.resolve(oInitialAppStates);
            });

            oClientTargetResolutionAdapterConfig.initialSegmentPromise = oRequestPromise.then(function (oDirectStart) {
                if (oDirectStart.targetMappings) {
                    return Promise.resolve([aSegment, oDirectStart.targetMappings, oDirectStart.systemAliases, oDirectStart.urlTemplates]);
                }
                return Promise.resolve(null);
            });
        } else {
            oAppStateConfig.initialAppStatesPromise = Promise.resolve({});
            oClientTargetResolutionAdapterConfig.initialSegmentPromise = Promise.resolve(null);
        }
    }

    /**
     * Creates an ECMA6 Promise which resolves after the shell renderer has been created. This
     * is necessary to delay the component creation in direct start case, so that the shell renderer
     * had time to initialize (e.g. init shell navigation service).
     *
     * This method must only be called after the shell bootstrap!
     * @returns {Promise} A promise to chain following steps.
     * @private
     */
    function createWaitForRendererCreatedPromise () {
        var oPromise = new Promise(function (resolve, reject) {
            var oRenderer,
                fnOnRendererCreated;

            fnOnRendererCreated = function () {
                Log.info("Direct application start: resolving component waitFor promise after shell renderer created event fired.");
                resolve();
                getContainer().detachRendererCreatedEvent(fnOnRendererCreated);
            };

            EventHub.once("ShellNavigationInitialized").do(function () {
                oRenderer = getContainer().getRendererInternal();
                if (oRenderer) {
                    Log.info("Direct application start: resolving component waitFor promise immediately (shell renderer already created).");
                    resolve();
                } else {
                    // the renderer should be created when the shell navigation is initialized, just to but be robust
                    getContainer().attachRendererCreatedEvent(fnOnRendererCreated);
                }
            });
        });

        return oPromise;
    }


    function afterBootstrap () {
        SAPCompanionConditionSetter.run().catch(() => {
            Log.info("SAPCompanion conditions could not be set.");
        });

        var sShellHash = oBoottask._getShellHash();

        if (isHomepageHash(sShellHash) && window["sap-ushell-config"].ushell &&
            window["sap-ushell-config"].ushell.spaces && window["sap-ushell-config"].ushell.spaces.enabled) {
            oBoottask._loadPage(sShellHash); // earliest point available to load page object
        }
        oXhrLibLoader.getLib().then(function (oXhrLogonLib) {
            var oFrameLogonManager = oXhrLogonLib.FrameLogonManager.getInstance();
            getContainer().oFrameLogonManager = oFrameLogonManager;
        });
        if (isDirectStart(sShellHash)) { // only set on direct app start (not #Shell-home)
            var fnResolve, fnReject;
            window["sap-ushell-async-libs-promise-directstart"] = new Promise(function (resolve, reject) {
                fnResolve = resolve;
                fnReject = reject;
            });
            window["sap-ushell-async-libs-promise-directstart"].catch(function (sMsg) { // always provide catch handler
                /*silently ignore*/
            });
            // resolve the shell hash and try to load a UI5 component for it; if successful,
            // the application context for the component will be attached to the resolution result
            // for non-UI5 targets, it will be empty
            getContainer().getServiceAsync("NavTargetResolutionInternal").then(function (oNavTargetResolutionInternal) {
                oNavTargetResolutionInternal.resolveHashFragment("#" + oBoottask._getShellHash())
                    .done(function (oResolutionResult) {
                        sap.ui.require(["sap/ushell/services/AppConfiguration"], function (AppConfiguration) {
                            AppConfiguration.setCurrentApplication(oResolutionResult);

                            if (oResolutionResult && oResolutionResult.ui5ComponentName) {
                                // create UI5 component early
                                getContainer().getServiceAsync("Ui5ComponentLoader").then(function (oUi5ComponentLoader) {
                                    oUi5ComponentLoader.createComponent(
                                        oResolutionResult,
                                        getParsedShellHash(sShellHash),
                                        createWaitForRendererCreatedPromise(),
                                        "Application"
                                    )
                                        .done(function (oResolutionResultWithComponentHandle) {
                                            fnResolve({
                                                resolvedHashFragment: oResolutionResultWithComponentHandle,
                                                dependenciesLoaded: true
                                            });
                                        })
                                        .fail(function (vError) {
                                            fnReject(vError);
                                        });
                                });
                            } else {
                                // non-ui5 app
                                fnResolve({
                                    resolvedHashFragment: oResolutionResult,
                                    dependenciesLoaded: false
                                });
                            }
                        });
                    })
                    .fail(function (sMsg) {
                        fnReject(sMsg);
                    });

            });
        }
    }


    function _loadPage (sShellHash) {
        if (sShellHash && sShellHash.indexOf("Shell-appfinder") === 0) {
            return;
        }

        getContainer().getServiceAsync("PersonalizationV2").then(async function (oPersonalizationService) {
            var oPersId = {
                container: "sap.ushell.cdm3-1.personalization",
                item: "data"
            };

            var oScope = {
                validity: "Infinity",
                keyCategory: oPersonalizationService.KeyCategory.GENERATED_KEY,
                writeFrequency: oPersonalizationService.WriteFrequency.HIGH,
                clientStorageAllowed: false
            };
            const oPersonalizer = await oPersonalizationService.getPersonalizer(oPersId, oScope);
            return oPersonalizer.getPersData();
        });

        sap.ui.require([ "sap/ushell/components/pages/controller/PagesAndSpaceId" ], function (oPagesAndSpaceId) {
            var pId = oPagesAndSpaceId.getPageAndSpaceId(sShellHash);
            var pPagePersistenceService = getContainer().getServiceAsync("PagePersistence");
            Promise.all([pId, pPagePersistenceService])
                .then(function (aResults) {
                    var oIds = aResults[0];
                    var oPagePersistenceService = aResults[1];
                    oPagePersistenceService.getPage(oIds.pageId);
                })
                .catch(function (sError) {
                    Log.error(sError);
                });
        });
    }

    /**
     * Performs a start-up request and synchronizes it with the SAPUI5 boot task.
     * @param {object} fnCallback To be called for UI5 Core during boot process
     */
    function start (fnCallback) {
        oXhrHandler.initXhrLogon(window["sap-ushell-config"]);

        // initialize UI5 performance tracing (FESR) before first request is sent, so that this is also instrumented
        initTraces();

        //fire start-up request if direct start also indicates suppression of pageset request
        //must be kept before success handler of requestStartUp
        oStartupHandler.requestStartupConfig().then(function (oStartupResult) {
            var sHash = oBoottask._getShellHash();
            (ObjectPath.get("sap-ushell-config.services.Container.adapter") || ObjectPath.create("sap-ushell-config.services.Container.adapter")).config = oStartupResult;
            var oLaunchPageAdapterConfig = ObjectPath.get("sap-ushell-config.services.LaunchPage.adapter.config") || ObjectPath.create("sap-ushell-config.services.LaunchPage.adapter.config");
            var oClientSideTargetResolutionAdapterConfig = ObjectPath.get("sap-ushell-config.services.ClientSideTargetResolution.adapter.config") ||
                ObjectPath.create("sap-ushell-config.services.ClientSideTargetResolution.adapter.config");
            if (ObjectPath.get("sap-ushell-config.ushell.spaces.enabled")) {
                //VisualizationDataProvider and LaunchPageAdapter should have the same configuration
                ObjectPath.set("sap-ushell-config.services.VisualizationDataProvider.adapter.config", oLaunchPageAdapterConfig);
                //NavigationDataProvider and ClientSideTargetResolutionAdapter should have the same config
                ObjectPath.set("sap-ushell-config.services.NavigationDataProvider.adapter.config", oClientSideTargetResolutionAdapterConfig);
            }
            processDirectStart(oStartupResult);

            // Startup theme processing: as early as possible for performance reasons
            sSystemThemeRoot = extractSystemThemeRoot(oStartupResult);
            oStartupTheme = determineStartupTheme(oStartupResult, sSystemThemeRoot);
            if (!getSapThemeUrlParameter() && oStartupTheme) {
                Log.debug("theme: load theme from startup service via window",
                        null, "sap.ushell_abap.bootstrap");
            }
            // Request page set and incomplete target mappings only if the home page is loaded
            // (not a direct application start)
            if (isHomepageHash(sHash) && !ObjectPath.get("sap-ushell-config.ushell.spaces.enabled")) {
                // do not create cache entries for PageSet and compact TMs
                // otherwise the FLP will freeze when returning to HOME from the cold started app (???)
                oPageSetHandler.requestPageSet(oStartupResult);
            }
            var oTMPromise = oStartupHandler.requestFullTM(oStartupResult);
            oClientSideTargetResolutionAdapterConfig.navTargetDataPromise = oTMPromise;
            // Do not issue the separate compact request for the launchpage adapter, as it was done in the earlier FLP versions.
            // Reuse the existing full target mappings request that is sent in any case.
            oLaunchPageAdapterConfig.compactTMPromise = oTMPromise;
            ObjectPath.set("sap-ushell-config.services.FlpLaunchPage.adapter.config.compactTMPromise", oTMPromise);

            // Request the target mappings immediately when startup request is finished; this is always requested,
            // because we need it for navigation target resolution
            return Promise.resolve(oStartupResult);
        }, function (sMessage) {
            Log.error("start_up request failed: " + sMessage, null,
                "sap.ushell_abap.bootstrap");
            return Promise.resolve({});
        }).then(function (oStartupResult) {
            // Note: processStartup creates window["sap-ushell-config"]
            processStartup(oStartupResult);
            fnCallback();
        });
    }

    oBoottask.start = start;
    oBoottask.afterBootstrap = afterBootstrap;
    oBoottask._getShellHash = getShellHash; //only for testing
    oBoottask._getFullShellHash = getFullShellHash; //only for testing
    oBoottask._createWaitForRendererCreatedPromise = createWaitForRendererCreatedPromise; //only for testing
    oBoottask._loadPage = _loadPage; // only for testing
    return oBoottask;
});
