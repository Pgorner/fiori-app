// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
prepareUshellConfig();
prepareModules();
sap.ui.define([
    "sap/base/i18n/Formatting",
    "sap/base/i18n/Localization",
    "sap/base/Log",
    "sap/base/util/ObjectPath",
    "sap/base/util/deepExtend",
    "sap/base/util/isEmptyObject",
    "sap/m/library",
    "sap/ui/core/BusyIndicator",
    "sap/ui/core/ComponentContainer",
    "sap/ui/core/Lib",
    "sap/ui/core/routing/History",
    "sap/ui/thirdparty/hasher",
    "sap/ui/thirdparty/jquery",
    "sap/ui/thirdparty/URI",
    "sap/ushell/appRuntime/ui5/AppCommunicationMgr",
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/ushell/appRuntime/ui5/performance/FesrEnhancer",
    "sap/ushell/appRuntime/ui5/renderers/fiori2/AccessKeysAgent",
    "sap/ushell/appRuntime/ui5/services/AppConfiguration", //must be included, do not remove
    "sap/ushell/appRuntime/ui5/services/AppLifeCycleAgent",
    "sap/ushell/appRuntime/ui5/services/ShellUIService",
    "sap/ushell/appRuntime/ui5/SessionHandlerAgent",
    "sap/ushell/EventHub",
    "sap/ushell/iconfonts",
    "sap/ushell/UI5ComponentType",
    "sap/ushell/ui5service/UserStatus",
    "sap/ushell/utils/UrlParsing",
    "sap/ushell/utils/WindowUtils",
    "sap/ushell/appRuntime/ui5/AppRuntimeContext",
    "sap/ushell/renderer/utils",
    "sap/ushell/appRuntime/ui5/renderers/fiori2/Renderer"
], function (
    Formatting,
    Localization,
    Log,
    ObjectPath,
    deepExtend,
    isEmptyObject,
    mobileLibrary,
    BusyIndicator,
    ComponentContainer,
    Library,
    History,
    hasher,
    jQuery,
    URI,
    AppCommunicationMgr,
    AppRuntimeService,
    FesrEnhancer,
    AccessKeysAgent,
    AppConfiguration,
    AppLifeCycleAgent,
    ShellUIService,
    SessionHandlerAgent,
    EventHub,
    Iconfonts,
    UI5ComponentType,
    UserStatus,
    UrlParsing,
    WindowUtils,
    AppRuntimeContext,
    RendererUtils,
    Renderer
) {
    "use strict";
    /* global apprtBIdiv, apprtBIstyle */
    /* eslint-disable valid-jsdoc, max-nested-callbacks*/

    // track performance marks and enhance UI5's Frontend Sub Records with FLP specific information

    // shortcut for sap.m.URLHelper
    var URLHelper = mobileLibrary.URLHelper;

    FesrEnhancer.init();

    var _that,
        Container,
        oPageUriParams = new URI().search(true),
        bURLHelperReplaced = false,
        fnOrigURLHelperRedirect,
        bPluginsLoaded = false,
        bHashChangeRegistered = false,
        bPopupCallbackRegistered = false,
        vGetFullWidthParamFromManifest = false,
        oShellNavigationInternal;

    /**
     * Application runtime for UI5 applications running in iframe
     *
     * @private
     */
    function AppRuntime () {

        /**
         * @private
         */
        this.main = function () {
            var arrPrimisesInit,
                oLocaleDataPromise = Promise.resolve(),
                oUrlData = _that._getURI();

            jQuery("body").css("height", "100%").css("width", "100%");
            AppCommunicationMgr.init(true);

            this.getPageConfig(oUrlData);
            _that.setModulePaths();
            arrPrimisesInit = _that.loadAdditionalLibs();

            if (oUrlData.hasOwnProperty("sap-remote-intent")) {
                oLocaleDataPromise = AppRuntimeService.postMessageToFLP("sap.ushell.services.UserInfo.getLocaleData", undefined, undefined, 3000, {});
            }

            AppRuntimeContext.setAppLifeCycleAgent(AppLifeCycleAgent);

            AppLifeCycleAgent.expandSapIntentParams(_that._getURI()).then(function (oURLParameters) {
                var sAppId, sAppIntent;
                if (oURLParameters.hasOwnProperty("sap-remote-intent") === true) {
                    AppRuntimeContext.setIsScube(true);
                    sAppIntent = oURLParameters["sap-remote-intent"];
                    if (sAppIntent === undefined) {
                        Log.error("Application cannot be opened. 'sAppIntent' is undefined");
                    }
                    AppRuntimeContext.setRemoteSystemId(oURLParameters["sap-remote-system"]);
                    _that.adjustIframeURL();
                } else {
                    sAppId = oURLParameters["sap-ui-app-id"];
                }

                _that.init();

                // must be included, do not remove
                // included separately due to synchronization issues with initializing page configuration
                var oPromiseUserInfo = new Promise(function (fnResolve) {
                    sap.ui.require(["sap/ushell/appRuntime/ui5/services/UserInfo"], fnResolve);
                });

                arrPrimisesInit.push(_that.initServicesContainer());
                Promise.all(arrPrimisesInit).then(function () {
                    _that.initPostMessages();
                    if (AppRuntimeContext.getIsScube() === true) {
                        //trigger load of site async
                        Container.getServiceAsync("CommonDataModel");
                    }
                    Promise.all([
                        _that.getAppInfo(sAppId, sAppIntent),
                        oPromiseUserInfo,
                        oLocaleDataPromise
                    ]).then(function (values) {
                        var oAppInfo = values[0].oResolvedHashFragment,
                            oParsedHash = values[0].oParsedHash,
                            oLocaleData = values[2] || {};

                        _that._setUI5LocaleAttributes(oLocaleData);
                        SessionHandlerAgent.init();
                        AccessKeysAgent.init();
                        _that._setInitialAppRoute();

                        _that.createApplication(sAppId, oURLParameters, oAppInfo, sAppIntent, oParsedHash)
                            .then(function (oCreateApplicationResult) {
                                _that.renderApplication(oCreateApplicationResult);
                            });
                    });
                });
            });
        };

        this._setUI5LocaleAttributes = function (oLocaleData) {
            if (Object.keys(oLocaleData).length > 0) {
                if (oLocaleData.calendarType) {
                    Formatting.setCalendarType(oLocaleData.calendarType);
                }
                if (oLocaleData.dateFormatShort) {
                    Formatting.setDatePattern("short", oLocaleData.dateFormatShort);
                }
                if (oLocaleData.dateFormatMedium) {
                    Formatting.setDatePattern("medium", oLocaleData.dateFormatMedium);
                }
                if (oLocaleData.numberFormatGroup) {
                    Formatting.setNumberSymbol("group", oLocaleData.numberFormatGroup);
                }
                if (oLocaleData.numberFormatDecimal) {
                    Formatting.setNumberSymbol("decimal", oLocaleData.numberFormatDecimal);
                }
                if (oLocaleData.timeFormatShort) {
                    Formatting.setTimePattern("short", oLocaleData.timeFormatShort);
                }
                if (oLocaleData.timeFormatMedium) {
                    Formatting.setTimePattern("medium", oLocaleData.timeFormatMedium);
                }
                if (oLocaleData.calendarMapping) {
                    Formatting.setCustomIslamicCalendarData(oLocaleData.calendarMapping);
                }
                if (oLocaleData.timeZone) {
                    Localization.setTimezone(oLocaleData.timeZone);
                }
                if (oLocaleData.currencyFormats) {
                    Formatting.setCustomCurrencies(oLocaleData.currencyFormats);
                }
            }
        };

        this._setInitialAppRoute = function () {
            var oHash = UrlParsing.parseShellHash(hasher.getHash());
            if (oHash && oHash.appSpecificRoute && oHash.appSpecificRoute.length > 0) {
                AppRuntimeService.postMessageToFLP(
                    "sap.ushell.services.CrossApplicationNavigation.setInnerAppRoute", {
                        appSpecificRoute: oHash.appSpecificRoute
                    });
            }
        };

        /**
         * @private
         */
        this._getURI = function () {
            return new URI().query(true);
        };

        /**
         * @private
         */
        this.init = function () {
            Iconfonts.registerFiori2IconFont();

            //Handle fullwidth/letterbox configuration
            vGetFullWidthParamFromManifest = this._getURIParams()["sap-manifest-width"];
            AppConfiguration.setFullWidthFromManifest(vGetFullWidthParamFromManifest);
        };

        /**
         * @private
         */
        this.initPostMessages = function () {
            AppCommunicationMgr.registerCommHandlers({
                "sap.ushell.appRuntime": {
                    oServiceCalls: {
                        hashChange: {
                            executeServiceCallFn: async function (oServiceParams) {
                                var sHash = oServiceParams.oMessageData.body.sHash;
                                if (typeof sHash === "string") {
                                    var oNewHash = UrlParsing.parseShellHash(sHash),
                                        oOldHash = UrlParsing.parseShellHash(hasher.getHash());
                                    if (oNewHash && oOldHash && oNewHash.semanticObject === oOldHash.semanticObject && oNewHash.action === oOldHash.action) {
                                        hasher.replaceHash(sHash);
                                    }
                                }
                            }
                        },
                        innerAppRouteChange: {
                            executeServiceCallFn: async function (oServiceParams) {
                                var sHash = oServiceParams?.oMessageData?.body?.oHash?.fullHash;
                                if (typeof sHash === "string") {
                                    hasher.replaceHash(sHash);
                                }
                            }
                        },
                        setDirtyFlag: {
                            executeServiceCallFn: async function (oServiceParams) {
                                var bIsDirty = oServiceParams.oMessageData.body.bIsDirty;
                                if (bIsDirty !== Container.getDirtyFlag()) {
                                    Container.setDirtyFlag(bIsDirty);
                                }
                            }
                        },
                        getDirtyFlag: {
                            executeServiceCallFn: async function (oServiceParams) {
                                return Container.getDirtyFlag();
                            }
                        },
                        themeChange: {
                            executeServiceCallFn: async function (oServiceParams) {
                                var currentThemeId = oServiceParams.oMessageData.body.currentThemeId;
                                Container.getUser().setTheme(currentThemeId);
                            }
                        },
                        buttonClick: {
                            executeServiceCallFn: async function (oServiceParams) {
                                Renderer.handleHeaderButtonClick(
                                    oServiceParams.oMessageData.body.buttonId
                                );
                            }
                        },
                        executeLogoutFunctions: {
                            executeServiceCallFn: async function (oServiceParams) {
                                await Container.executeAsyncAndSyncLogoutFunctions();
                            }
                        },
                        uiDensityChange: {
                            executeServiceCallFn: async function (oServiceParams) {
                                var isTouch = oServiceParams.oMessageData.body.isTouch;
                                jQuery("body")
                                    .toggleClass("sapUiSizeCompact", (isTouch === "0"))
                                    .toggleClass("sapUiSizeCozy", (isTouch === "1"));
                            }
                        },
                        handleDirtyStateProvider: {
                            executeServiceCallFn: async function (oServiceParams) {
                                return Container.handleDirtyStateProvider(oServiceParams.oMessageData.body.oNavigationContext);
                            }
                        }
                    }
                },
                "sap.ushell.services.MessageBroker": {
                    oServiceCalls: {
                        _execute: {
                            executeServiceCallFn: async function (oServiceParams) {
                                const oMessageBrokerService = await Container.getServiceAsync("MessageBroker");
                                await oMessageBrokerService.handleMessage(oServiceParams.oMessageData.body);
                            }
                        }
                    }
                }
            });
        };

        /**
         * @private
         */
        /* eslint-disable consistent-return*/
        this.handleLinkElementOpen = function (sFLPURL, event) {
            try {
                if (event.isDefaultPrevented && event.isDefaultPrevented() === true) {
                    return;
                }
                var oTarget = event.target;

                if (oTarget && oTarget.tagName === "A" && oTarget.href && oTarget.href.indexOf("#") > 0) {
                    if (oTarget.target === "_blank") {
                        const sTargetUrlSplit = oTarget.href.split("#");
                        if (sTargetUrlSplit[0].length === 0 || sTargetUrlSplit[0] === document.URL.split("#")[0]) {
                            _that.rebuildNewAppUrl(oTarget.href, sFLPURL).then((sNewURL) => {
                                WindowUtils.openURL(sNewURL);
                            });
                            //We're returning false to determine that the default browser behaviour should NOT take place
                            // and we will be the one to handle the opening of the link (with 'window.open').
                            event.preventDefault();
                        }
                    } else if (oTarget.target === undefined || oTarget.target === "" || oTarget.target === "_top" || oTarget.target === "_self") {
                        //if the new hash is different than the current one, this is a cross application navigation
                        // and we will use the ushell service for that in order to properly create a new browser history
                        // entry
                        var oTargetUrlParts = oTarget.href.split("#"),
                            oCurrUrlParts = document.URL.split("#");
                        if (oTargetUrlParts[0] === oCurrUrlParts[0]) {
                            var oTargetHashParts = oTargetUrlParts[1] && oTargetUrlParts[1].split("&/"),
                                oCurrHashParts = oCurrUrlParts[1] && oCurrUrlParts[1].split("&/");
                            if (typeof oTargetHashParts[0] === "string" && typeof oCurrHashParts[0] === "string" && oTargetHashParts[0] !== oCurrHashParts[0]) {
                                Container.getServiceAsync("Navigation").then(function (oNavService) {
                                    oNavService.navigate({
                                        target: {
                                            shellHash: oTargetUrlParts[1]
                                        }
                                    });
                                });
                                event.preventDefault();
                            }
                        }
                    }
                }
            } catch (error) {
                //do nothing means that the browser will take care of the click
            }
        };
        /* eslint-enable consistent-return*/

        /**
         * @private
         */
        this.rebuildNewAppUrl = async function (sTargetUrl, sFLPUrl) {
            const sTargetUrlSplit = sTargetUrl.split("#");
            //Check if the destination URL equals to the IFrame URL
            if (sTargetUrlSplit[0].length === 0 || sTargetUrlSplit[0] === document.URL.split("#")[0]) {
                //Replace the Iframe URL with the FLP URL or Add it before the #
                if (AppRuntimeContext.getIsScube()) {
                    const aResult = await AppRuntimeContext.checkIntentsConversionForScube([{
                        intent: "#" + sTargetUrlSplit[1]
                    }]);
                    return sFLPUrl + aResult[0].intent;
                }
                return sFLPUrl + "#" + sTargetUrlSplit[1];

            }
            return sTargetUrl;
        };

        /**
         * @private
         */
        this.getPageConfig = function (oUrlData) {
            window["sap-ushell-config"] = deepExtend({}, getDefaultShellConfig(), window["sap-ushell-config"]);

            //temp code for allways loading the web assistance plugin in the
            //scube scenario. will be removed in the next release of s4 hana cloud
            if (oUrlData.hasOwnProperty("sap-remote-intent")) {
                var oPlugins = window["sap-ushell-config"].bootstrapPlugins;
                if (oPlugins && oPlugins.hasOwnProperty("WAPluginAgent") && oPlugins.WAPluginAgent.hasOwnProperty("config")) {
                    delete oPlugins.WAPluginAgent.config["sap-plugin-agent"];
                }
            }
        };

        /**
         * @private
         */
        this.setModulePaths = function () {
            if (window["sap-ushell-config"].modulePaths) {
                var keys = Object.keys(window["sap-ushell-config"].modulePaths),
                    sModulePath;
                for (var key in keys) {
                    sModulePath = keys[key];
                    (function (sModulePathParam) {
                        var paths = {};
                        paths[sModulePathParam.replace(/\./g, "/")] = window["sap-ushell-config"].modulePaths[sModulePathParam];
                        sap.ui.loader.config({ paths: paths });
                    }(sModulePath));
                }
            }
        };

        /**
         * @private
         */
        this.loadAdditionalLibs = function () {
            var oLibs = ObjectPath.get("ui5.libs", window["sap-ushell-config"]) || {},
                arrLibs = [];
            Object.keys(oLibs).forEach(function (sLib) {
                if (oLibs[sLib] === true) {
                    arrLibs.push(Library.load(sLib));
                }
            });
            return arrLibs;
        };

        /**
         * @private
         */
        this.adjustIframeURL = function () {

        };

        /**
         * @private
         */
        this.initServicesContainer = function () {
            return new Promise(function (fnResolve) {
                sap.ui.require(["sap/ushell/appRuntime/ui5/services/Container"], function (oContainerProxy) {
                    Container = oContainerProxy;
                    Container.init("apprt", { apprt: "sap.ushell.appRuntime.ui5.services.adapters" }).then(function () {
                        //This section refers for the usecase where clicking on an Iframe link in order to open another Iframe
                        //application in a new tab. If the destination URL equals to the IFrame URL, it means that the destination
                        // Iframe URL is wrong and should be replaced with the FLP URL.
                        Container.getFLPUrlAsync().then(function (sFLPURL) {
                            jQuery(document).on("click.appruntime", _that.handleLinkElementOpen.bind(_that, sFLPURL));
                            jQuery(document).on("keydown.appruntime", function (event) {
                                if (event.code === "Enter") {
                                    return _that.handleLinkElementOpen(sFLPURL, event);
                                }
                            });
                        });

                        Container.getServiceAsync("ShellNavigationInternal").then(function (oService) {
                            oShellNavigationInternal = oService;
                            oShellNavigationInternal.init(function () { });
                            _that._enableHistoryEntryReplacedDetection();
                            fnResolve();
                        });
                    });
                });
            });
        };

        this._enableHistoryEntryReplacedDetection = function () {
            this._fnOriginalSetHash = hasher.setHash;
            this._fnOriginalReplaceHash = hasher.replaceHash;

            hasher.setHash = function () {
                if (hasher.disableCFLPUpdate === true) {
                    return this._fnOriginalSetHash.apply(hasher, arguments);
                }
                if (AppRuntimeContext.checkDataLossAndContinue()) {
                    return this._fnOriginalSetHash.apply(hasher, arguments);
                }
            }.bind(this);

            hasher.replaceHash = function () {
                if (hasher.disableCFLPUpdate === true) {
                    return this._fnOriginalReplaceHash.apply(hasher, arguments);
                }
                if (AppRuntimeContext.checkDataLossAndContinue()) {
                    return this._fnOriginalReplaceHash.apply(hasher, arguments);
                }
            }.bind(this);
        };

        /**
         * @private
         */
        this._getURIParams = function () {
            return oPageUriParams;
        };

        /**
         * @private
         */
        this.getAppInfo = function (sAppId, sAppIntent) {
            var oData, sModule, bEnableCache;
            if (sAppId) {
                oData = window["sap-ushell-config"].ui5appruntime.config.appIndex.data;
                sModule = window["sap-ushell-config"].ui5appruntime.config.appIndex.module;
                bEnableCache = window["sap-ushell-config"].ui5appruntime.config.appIndex.enableCache;
            }

            return new Promise(function (fnResolve) {
                if (sAppId && oData && !isEmptyObject(oData)) {
                    AppLifeCycleAgent.init(sModule, _that.createApplication.bind(_that), _that.renderApplication.bind(_that), bEnableCache, sAppId, oData);
                    fnResolve({
                        oResolvedHashFragment: oData
                    });
                } else {
                    AppLifeCycleAgent.init(sModule, _that.createApplication.bind(_that), _that.renderApplication.bind(_that), bEnableCache);
                    AppLifeCycleAgent.getAppInfo(sAppId, document.URL, sAppIntent).then(fnResolve);
                }
            });
        };

        /**
         * @private
         */
        this.setHashChangedCallback = function () {
            if (bHashChangeRegistered === true) {
                return;
            }

            hasher.changed.add(this._treatHashChanged.bind(this), this);
            bHashChangeRegistered = true;
        };

        this._treatHashChanged = async function (newHash, oldHash) {
            if (hasher.disableCFLPUpdate === true) {
                return;
            }

            if (newHash && typeof newHash === "string" && newHash.length > 0) {
                if (oldHash && typeof oldHash === "string" && oldHash.length > 0) {
                    // navigate via Navigation service for new apps
                    var oCompareHashResult = UrlParsing.compareHashes(newHash, oldHash);
                    if (!oCompareHashResult.sameIntent || !oCompareHashResult.sameParameters) {
                        Container.getServiceAsync("Navigation").then(function (oNavService) {
                            oNavService.navigate({
                                target: {
                                    shellHash: newHash
                                }
                            });
                        });
                        return;
                    }
                }
                AppRuntimeService.postMessageToFLP(
                    "sap.ushell.appRuntime.hashChange", {
                        newHash: newHash,
                        direction: History.getInstance().getDirection()
                    });
            }
        };

        this.createApplication = function (sAppId, oURLParameters, oAppInfo, sAppIntent, oParsedHashForScube) {
            var sHash = UrlParsing.getHash(window.location.href);

            return new Promise(function (fnResolve) {
                //Getting the history direction, taken from the history object of UI5 (sent by the FLP).
                //The direction value is used to update the direction property of the UI5 history object
                // that is running in the FLP.
                var sDirection = "";
                if (oURLParameters.hasOwnProperty("sap-history-dir")) {
                    sDirection = oURLParameters["sap-history-dir"];

                    oShellNavigationInternal.hashChanger.fireEvent("hashReplaced", {
                        hash: oShellNavigationInternal.hashChanger.getHash(),
                        direction: sDirection
                    });

                    Log.debug("AppRuntime.createApplication :: Informed by the FLP, to change the History direction " +
                        "property in the Iframe to: " + sDirection);
                }

                var oComponentContainer = new ComponentContainer({
                    id: (AppRuntimeContext.getIsScube() === true ? sAppIntent : sAppId) + "-content",
                    width: "100%",
                    height: "100%"
                });

                oComponentContainer.addStyleClass("sapAppRuntimeBaseStyle");

                var isTouch = "0";
                if (oPageUriParams.hasOwnProperty("sap-touch")) {
                    isTouch = oPageUriParams["sap-touch"];
                    if (isTouch !== "0" && isTouch !== "1") {
                        isTouch = "0";
                    }
                }
                jQuery("body")
                    .toggleClass("sapUiSizeCompact", (isTouch === "0"))
                    .toggleClass("sapUiSizeCozy", (isTouch === "1"));

                if (bPopupCallbackRegistered === false) {
                    var oShellUIService = new ShellUIService({ scopeObject: oComponentContainer, scopeType: "component" });
                    oShellUIService.setBackNavigation();

                    /* eslint-disable no-new */
                    /**
                     * @deprecated since version 1.120
                     */
                    new UserStatus({ scopeObject: oComponentContainer, scopeType: "component" });
                    /* eslint-enable no-new */

                    AppLifeCycleAgent.setShellUIService(oShellUIService);

                    RendererUtils.init();
                    bPopupCallbackRegistered = true;
                }

                (AppRuntimeContext.getIsScube() ? Promise.resolve("") : AppLifeCycleAgent.getApplicationParameters(oURLParameters)).then(function (sParams) {
                    oAppInfo.url += sParams;
                    _that.setHashChangedCallback();

                    Promise.all([
                        Container.getServiceAsync("Ui5ComponentLoader"),
                        Container.getServiceAsync("AppLifeCycle")
                    ]).then(function (values) {
                        var oUi5ComponentLoader = values[0];
                        var oAppLifeCycleService = values[1];

                        //remove the "sap.ushell" from libs to be loaded as it is not needed (its already
                        //loaded as part of the appruntime bundle)
                        if (oAppInfo.asyncHints && Array.isArray(oAppInfo.asyncHints.libs)) {
                            oAppInfo.asyncHints.libs = oAppInfo.asyncHints.libs.filter(function (hint) {
                                return hint.name !== "sap.ushell";
                            });
                        }
                        var oAppProperties, oParsedHash;
                        if (AppRuntimeContext.getIsScube() === true) {
                            oAppProperties = oAppInfo;
                            oParsedHash = oParsedHashForScube;
                        } else {
                            oAppProperties = {
                                ui5ComponentName: sAppId,
                                applicationDependencies: oAppInfo,
                                url: oAppInfo.url
                            };
                            oParsedHash = UrlParsing.parseShellHash(sHash);
                        }
                        oUi5ComponentLoader.createComponent(
                            oAppProperties,
                            oParsedHash,
                            [],
                            UI5ComponentType.Application
                        ).then(function (oResolutionResultWithComponentHandle) {
                            var sAppTitle;
                            if (AppRuntimeContext.getIsScube() === true) {
                                try {
                                    if (sHash && sHash.indexOf("Shell-startIntent") === 0) {
                                        sAppTitle = oResolutionResultWithComponentHandle.componentHandle.getInstance().getManifestEntry("/sap.app/title");
                                        if (typeof sAppTitle === "string") {
                                            setTimeout(function () {
                                                AppRuntimeService.postMessageToFLP("sap.ushell.services.ShellUIService.setTitle", {sTitle: sAppTitle});
                                            }, 2000);
                                        }
                                    }
                                } catch (error) {
                                    //do nothing
                                }
                            }
                            oComponentContainer.setComponent(oResolutionResultWithComponentHandle.componentHandle.getInstance());
                            FesrEnhancer.setAppShortId(oResolutionResultWithComponentHandle.componentHandle);
                            oAppLifeCycleService.prepareCurrentAppObject(
                                "UI5",
                                oResolutionResultWithComponentHandle.componentHandle.getInstance(),
                                false,
                                undefined
                            );

                            _that.getCurrentAppInfo(oAppLifeCycleService, oURLParameters, oAppProperties, sAppTitle);
                            _that.considerChangingTheDefaultFullWidthVal(oResolutionResultWithComponentHandle);
                            _that.overrideUrlHelperFuncs();
                            fnResolve({
                                oComponentContainer: oComponentContainer,
                                oResolutionResultWithComponentHandle: oResolutionResultWithComponentHandle,
                                sAppIntent: sAppIntent || "",
                                ui5ComponentName: oAppProperties.ui5ComponentName
                            });
                        });
                    });
                });
            });
        };

        /**
         * @private
         */
        this.getCurrentAppInfo = function (oAppLifeCycleService, oURLParameters, oAppProperties, sAppTitle) {

            var aAppInfoParams = [
                "appFrameworkVersion",
                "appVersion"
            ];
            if (!oURLParameters["sap-startup-params"] || oURLParameters["sap-startup-params"].indexOf("sap-fiori-id") === -1) {
                aAppInfoParams.push("appId");
            }
            if (!oURLParameters["sap-startup-params"] || oURLParameters["sap-startup-params"].indexOf("sap-ach") === -1) {
                aAppInfoParams.push("appSupportInfo");
            }

            var oCurrentApp = oAppLifeCycleService.getCurrentApplication();
            oCurrentApp.getInfo(aAppInfoParams).then(function (oAppInfo) {
                for (var sParameter in oAppInfo) {
                    if (oAppInfo[sParameter] === undefined || oAppInfo[sParameter] === "") {
                        delete (oAppInfo[sParameter]);
                    }
                }
                oAppInfo.appFrameworkId = "UI5";
                oAppInfo.technicalAppComponentId = oAppProperties.ui5ComponentName;
                if (typeof sAppTitle === "string") {
                    oAppInfo.appTitle = sAppTitle;
                }
                AppLifeCycleAgent.setCurrentAppAttributes(oAppInfo);
                setTimeout(function () {
                    AppRuntimeService.postMessageToFLP("sap.ushell.services.AppLifeCycle.updateCurrentAppInfo", {info: oAppInfo});
                }, 500);
            });
        };

        /**
         * @private
         */
        this.considerChangingTheDefaultFullWidthVal = function (oResolutionResultWithComponentHandle) {
            //letter box width for users who use this parameter
            if (vGetFullWidthParamFromManifest === true || vGetFullWidthParamFromManifest === "true") {
                //Making sure that if the previous app was opened in letter box, it will not affect the default behavior
                // of the next app to be opened in full width state
                EventHub.emit("appWidthChange", false);
            }

            var oComp = oResolutionResultWithComponentHandle.componentHandle.getInstance();
            var metadata = oComp.getMetadata();
            if (metadata) {
                var vFullWidthUi = oComp.getManifestEntry("/sap.ui/fullWidth");
                var vFullWidthUi5Config = oComp.getManifestEntry("/sap.ui5/config/fullWidth");
                if (vFullWidthUi === true || vFullWidthUi === "true" || vFullWidthUi5Config === true || vFullWidthUi5Config === "true") {
                    EventHub.emit("appWidthChange", true);
                } else if (vFullWidthUi === false || vFullWidthUi === "false" || vFullWidthUi5Config === false || vFullWidthUi5Config === "false") {
                    EventHub.emit("appWidthChange", false);
                }
            }
        };

        /**
         * @private
         */
        this.overrideUrlHelperFuncs = function () {
            if (bURLHelperReplaced === true) {
                return;
            }
            bURLHelperReplaced = true;

            if (URLHelper) {
                URLHelper.triggerEmail = function (sTo, sSubject, sBody, sCc, sBcc) {
                    AppRuntimeService.postMessageToFLP("sap.ushell.services.ShellUIService.sendEmail", {
                        sTo: sTo,
                        sSubject: sSubject,
                        sBody: sBody,
                        sCc: sCc,
                        sBcc: sBcc,
                        sIFrameURL: document.URL,
                        bSetAppStateToPublic: true
                    });
                };

                fnOrigURLHelperRedirect = URLHelper.redirect;
                URLHelper.redirect = function (sURL, bNewWindow) {
                    if (sURL && bNewWindow === true && sURL.indexOf("#") >= 0) {
                        Container.getFLPUrlAsync().then(function (sFLPURL) {
                            _that.rebuildNewAppUrl(sURL, sFLPURL).then((sNewURL) => {
                                fnOrigURLHelperRedirect.call(URLHelper, sNewURL, bNewWindow);
                            });
                        });
                    } else {
                        fnOrigURLHelperRedirect.call(URLHelper, sURL, bNewWindow);
                    }
                };
            }
        };

        /**
         * @private
         */
        this.loadPlugins = function () {
            if (bPluginsLoaded === true) {
                return;
            }
            bPluginsLoaded = true;

            Container.getServiceAsync("PluginManager").then(function (PluginManagerService) {
                registerRTAPluginAgent(PluginManagerService);
                if (AppRuntimeContext.getIsScube() === false) {
                    registerWAPluginAgent(PluginManagerService);
                }
                PluginManagerService.loadPlugins("RendererExtensions");
            });
        };

        /**
         * This method registers the RTA agent plugin in the AppRuntime.
         * This agent plugin will be loaded only if the FLP will loads the RTA plugin
         * @private
         */
        function registerRTAPluginAgent (PluginManagerService) {
            PluginManagerService.registerPlugins({
                RTAPluginAgent: {
                    component: "sap.ushell.appRuntime.ui5.plugins.rtaAgent",
                    url: sap.ui.require.toUrl("sap/ushell/appRuntime/ui5/plugins/rtaAgent"),
                    config: {
                        "sap-plugin-agent": true
                    }
                }
            });
        }

        /**
         * This method registers the WA agent plugin in the AppRuntime.
         * This agent plugin will be loaded only if the FLP loads the WA plugin
         * @private
         */
        function registerWAPluginAgent (PluginManagerService) {
            PluginManagerService.registerPlugins({
                WAPluginAgent: {
                    component: "sap.ushell.appRuntime.ui5.plugins.scriptAgent",
                    url: sap.ui.require.toUrl("sap/ushell/appRuntime/ui5/plugins/scriptAgent"),
                    config: {
                        "sap-plugin-agent": true,
                        scube: false
                    }
                }
            });
        }

        /**
         * @private
         */
        this.renderApplication = function (oCreateApplicationResult) {
            oCreateApplicationResult.oComponentContainer.placeAt("content");
            BusyIndicator.hide();
            setTimeout(function () {
                if (oCreateApplicationResult.oResolutionResultWithComponentHandle.componentHandle.getInstance().active) {
                    oCreateApplicationResult.oResolutionResultWithComponentHandle.componentHandle.getInstance().active();
                }
                _that.loadPlugins();
            }, 0);
            AppLifeCycleAgent.setCurrentApp(
                oCreateApplicationResult.oComponentContainer,
                oCreateApplicationResult.sAppIntent,
                oCreateApplicationResult.ui5ComponentName);
        };
    }

    /**
     * @private
     */
    function getDefaultShellConfig () {
        return {
            services: {
                CrossApplicationNavigation: {
                    module: "sap.ushell.appRuntime.ui5.services.CrossApplicationNavigation",
                    adapter: {
                        module: "sap.ushell.appRuntime.ui5.services.adapters.EmptyAdapter"
                    }
                },
                Navigation: {
                    module: "sap.ushell.appRuntime.ui5.services.Navigation",
                    adapter: {
                        module: "sap.ushell.appRuntime.ui5.services.adapters.EmptyAdapter"
                    }
                },
                NavTargetResolution: {
                    module: "sap.ushell.appRuntime.ui5.services.NavTargetResolution",
                    adapter: {
                        module: "sap.ushell.appRuntime.ui5.services.adapters.EmptyAdapter"
                    }
                },
                NavTargetResolutionInternal: {
                    module: "sap.ushell.appRuntime.ui5.services.NavTargetResolutionInternal",
                    adapter: {
                        module: "sap.ushell.appRuntime.ui5.services.adapters.EmptyAdapter"
                    }
                },
                ShellNavigation: {
                    module: "sap.ushell.appRuntime.ui5.services.ShellNavigation",
                    adapter: {
                        module: "sap.ushell.appRuntime.ui5.services.adapters.EmptyAdapter"
                    }
                },
                ShellNavigationInternal: {
                    module: "sap.ushell.appRuntime.ui5.services.ShellNavigationInternal",
                    adapter: {
                        module: "sap.ushell.appRuntime.ui5.services.adapters.EmptyAdapter"
                    }
                },
                ClientSideTargetResolution: {
                    adapter: {
                        module: "sap.ushell.appRuntime.ui5.services.adapters.EmptyAdapter"
                    }
                },
                AppConfiguration: {
                    module: "sap.ushell.appRuntime.ui5.services.AppConfiguration"
                },
                Bookmark: {
                    module: "sap.ushell.appRuntime.ui5.services.Bookmark",
                    adapter: {
                        module: "sap.ushell.appRuntime.ui5.services.adapters.EmptyAdapter"
                    }
                },
                // Until AppRuntime switches to consumption of BookmarkV2, proxy its API to the Bookmark service
                BookmarkV2: {
                    module: "sap.ushell.appRuntime.ui5.services.BookmarkV2",
                    adapter: {
                        module: "sap.ushell.appRuntime.ui5.services.adapters.EmptyAdapter"
                    }
                },
                Extension: {
                    module: "sap.ushell.appRuntime.ui5.services.Extension"
                },
                FrameBoundExtension: {
                    module: "sap.ushell.appRuntime.ui5.services.FrameBoundExtension"
                },
                LaunchPage: {
                    module: "sap.ushell.appRuntime.ui5.services.LaunchPage",
                    adapter: {
                        module: "sap.ushell.appRuntime.ui5.services.adapters.EmptyAdapter"
                    }
                },
                UserInfo: {
                    module: "sap.ushell.appRuntime.ui5.services.UserInfo",
                    adapter: {
                        module: "sap.ushell.appRuntime.ui5.services.adapters.EmptyAdapter"
                    }
                },
                UserDefaultParameters: {
                    module: "sap.ushell.appRuntime.ui5.services.UserDefaultParameters",
                    adapter: {
                        module: "sap.ushell.appRuntime.ui5.services.adapters.EmptyAdapter"
                    }
                },
                AppState: {
                    module: "sap.ushell.appRuntime.ui5.services.AppState",
                    adapter: {
                        module: "sap.ushell.appRuntime.ui5.services.adapters.EmptyAdapter"
                    }
                },
                AppLifeCycle: {
                    module: "sap.ushell.appRuntime.ui5.services.AppLifeCycle",
                    adapter: {
                        module: "sap.ushell.appRuntime.ui5.services.adapters.EmptyAdapter"
                    }
                },
                PluginManager: {
                    config: {
                        isBlueBox: true
                    }
                },
                CommonDataModel: {
                    module: "sap.ushell.appRuntime.ui5.services.CommonDataModel",
                    adapter: {
                        module: "sap.ushell.appRuntime.ui5.services.adapters.EmptyAdapter"
                    }
                },
                ReferenceResolver: {
                    module: "sap.ushell.appRuntime.ui5.services.ReferenceResolver"
                },
                MessageBroker: {
                    module: "sap.ushell.appRuntime.ui5.services.MessageBroker"
                },
                Ui5ComponentLoader: {
                    config: {
                        loadDefaultDependencies: false
                    }
                }
            },
            ushell: {
                customPreload: {
                    enabled: false
                }
            }
        };
    }

    var appRuntime = new AppRuntime();
    appRuntime._prepareUshellConfig = prepareUshellConfig;
    _that = appRuntime;
    appRuntime.main();
    return appRuntime;
});

function prepareUshellConfig () {
    "use strict";

    const ObjectPath = sap.ui.require("sap/base/util/ObjectPath");

    let oShellConfig = {};
    const oMetaData = document.querySelector("meta[name='sap.ushellConfig.ui5appruntime']");
    if (oMetaData) {
        oShellConfig = JSON.parse(oMetaData.content);
    }

    const oUriParameters = new URLSearchParams(window.location.search);

    if (oUriParameters.has("sap-spaces") && oUriParameters.get("sap-spaces") === "true") {
        ObjectPath.set("ushell.spaces.enabled", true, oShellConfig);
    }

    // for security reasons it is only possible to disable the personalization via URL parameter but not to enable it
    if (oUriParameters.has("sap-personalization") && oUriParameters.get("sap-personalization") === "false") {
        ObjectPath.set("renderers.fiori2.componentData.config.enablePersonalization", false, oShellConfig);
    }

    window["sap-ushell-config"] = oShellConfig;

    // In preparation for UI5 2.0 some services got successors.
    // To allow these successor services to run easily, the migration of the old service is copied
    // to the new service, too.
    _migrateV2ServiceConfig(window["sap-ushell-config"]);
}

/**
 * Copy from sap/ushell/bootstrap/common/common.util!
 */
function _migrateV2ServiceConfig (ushellConfig) {
    "use strict";
    var ObjectPath = sap.ui.require("sap/base/util/ObjectPath");
    // migrate service config
    [
        { from: "services.Bookmark", to: "services.BookmarkV2" },
        { from: "services.CrossApplicationNavigation", to: "services.Navigation" },
        { from: "services.Notifications", to: "services.NotificationsV2" },
        { from: "services.Personalization", to: "services.PersonalizationV2" },
        { from: "services.LaunchPage", to: "services.FlpLaunchPage" },
        { from: "services.ShellNavigation", to: "services.ShellNavigationInternal" },
        { from: "services.NavTargetResolution", to: "services.NavTargetResolutionInternal" }
    ].forEach((oMigration) => {
        const sServiceFromName = oMigration.from.split(".")[1];
        const oConfigFrom = ObjectPath.get(oMigration.from, ushellConfig);
        const oConfigTo = ObjectPath.get(oMigration.to, ushellConfig);
        if (oConfigFrom && !oConfigTo) {
            // we only need a shallow copy here, because we only want to change the module property
            const oConfigFromCopy = { ...oConfigFrom };

            // the module references the standard service name this might lead to infinite loops
            // because the old service can depend on the new service
            // DINC0103566
            if (oConfigFromCopy.module === `sap.ushell.services.${sServiceFromName}`) {
                delete oConfigFromCopy.module;
            }
            ObjectPath.set(oMigration.to, oConfigFromCopy, ushellConfig);
        }
    });
}

function prepareModules () {
    "use strict";

    sap.ui.require(["sap/ui/core/BusyIndicator"], function (BusyIndicator) {
        try {
            if (apprtBIdiv) {
                document.body.classList.remove("apprtBIbg");
                apprtBIdiv.parentNode.removeChild(apprtBIdiv);
                apprtBIstyle.parentNode.removeChild(apprtBIstyle);
            }
            BusyIndicator.show(0);
        } catch (e) {
            BusyIndicator.show(0);
        }
    });

    //when appruntime is loaded, we will avoid loading specific
    //dependencies as they are not in use
    if (document.URL.indexOf("ui5appruntime") > 0) {
        sap.ui.define("sap/ushell/URLTemplateProcessor", [], function () { return {}; });
        sap.ui.define("sap/ushell/ApplicationType/wdaResolution", [], function () { return {}; });
        sap.ui.define("sap/ushell/ApplicationType/guiResolution", [], function () { return {}; });
        if (document.URL.indexOf("sap-ui-app-id=") > 0) {
            sap.ui.define("sap/ushell/ApplicationType", [], function () {
                return {
                    URL: {
                        type: "URL"
                    },
                    WDA: {
                        type: "WDA"
                    },
                    TR: {
                        type: "TR"
                    },
                    NWBC: {
                        type: "NWBC"
                    },
                    WCF: {
                        type: "WCF"
                    },
                    SAPUI5: {
                        type: "SAPUI5"
                    }
                };
            });
        }
        sap.ui.define("sap/ushell/components/applicationIntegration/AppLifeCycle", [], function () { return {}; });
        sap.ui.define("sap/ushell/services/appstate/WindowAdapter", [], function () { return function () {}; });
        sap.ui.define("sap/ushell/services/appstate/SequentializingAdapter", [], function () { return function () {}; });
        sap.ui.define("sap/ushell/services/appstate/Sequentializer", [], function () { return function () {}; });
        sap.ui.define("sap/ushell/services/Configuration", [], function () {
            function Configuration () {
                this.attachSizeBehaviorUpdate = function () {};
                this.hasNoAdapter = true;
            }
            Configuration.hasNoAdapter = true;
            return Configuration;
        });
        sap.ui.define("sap/ushell/services/PluginManager/Extensions", [], function () { return function () {}; });
        sap.ui.define("sap/ushell/services/MessageBroker/MessageBrokerEngine", [], function () { return function () {}; });
        sap.ui.define("sap/ushell/bootstrap/common/common.load.core-min", [], function () {
            return {
                loaded: false,
                load: function (sPath) {}
            };
        });
    }
}
