// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview The Unified Shell's AppLifeCycle service enables plug-ins to enquire the which
 *    application is currently displayed and listen to life cycle events.
 *
 * @version 1.132.1
 */
sap.ui.define([
    "sap/base/Log",
    "sap/ui/base/EventProvider",
    "sap/ui/core/Element",
    "sap/ui/thirdparty/hasher",
    "sap/ushell/AppInfoParameters",
    "sap/ushell/EventHub",
    "sap/ushell/TechnicalParameters",
    "sap/ui/core/Component",
    "sap/ushell/services/AppConfiguration",
    "sap/ui/thirdparty/URI",
    "sap/ushell/Config",
    "sap/ushell/Container"
], function (
    Log,
    EventProvider,
    Element,
    hasher,
    AppInfoParameters,
    EventHub,
    TechnicalParameters,
    Component,
    AppConfiguration,
    URI,
    Config,
    Container
) {
    "use strict";

    const S_APP_LOADED_EVENT = "appLoaded";

    /**
     * @alias sap.ushell.services.AppLifeCycle
     * @class
     * @classdesc The Unified Shell's AppLifeCycle service.
     *
     * <b>Note:</b> To retrieve a valid instance of this service, it is necessary to call {@link sap.ushell.Container#getServiceAsync}.
     * <pre>
     *   sap.ui.require(["sap/ushell/Container"], async function (Container) {
     *     const AppLifeCycle = await Container.getServiceAsync("AppLifeCycle");
     *     // do something with the AppLifeCycle service
     *   });
     * </pre>
     *
     * @param {object} oAdapter not used
     * @param {object} oContainerInterface not used
     * @param {string} sParameters not used
     * @param {object} oServiceConfiguration not used
     *
     * @augments sap.ushell.services.Service
     * @hideconstructor
     *
     * @since 1.38
     * @public
     */
    function AppLifeCycle (oAdapter, oContainerInterface, sParameters, oServiceConfiguration) {
        var oCurrentApplication;
        var oCurrentApplicationContainer;
        var oEventProvider;

        /**
         * Defines an intent.
         *  See {@link sap.ushell.services.URLParsing#parseShellHash} for details.
         *
         * @typedef {object} sap.ushell.services.AppLifeCycle.Intent
         * @property {string} semanticObject The semantic object of the intent.
         * @property {string} action The action of the intent.
         * @property {string} contextRaw The raw context of the intent.
         * @property {Object<string,string[]>} params The parameters of the intent.
         * @property {string} appSpecificRoute The app specific route of the intent.
         * @since 1.120.0
         * @public
         */

        /**
         * Defines the application info.
         *
         * @typedef {object} sap.ushell.services.AppLifeCycle.AppInfo
         * @property {string} productName
         * A human readable free form text maintained on the platform where FLP runs, and identifying the current product.
         * @property {string} theme
         * Current FLP theme. Includes the path to the theme resources if the theme is not an sap theme (does not start with sap_)
         * @property {string} languageTag Current Language (BCP47 format)
         * @property {string} appIntent Intent that was used to launch the application (including parameters)
         * @property {string} appFrameworkId ID of the framework
         * @property {string} technicalAppComponentId Identifier of the component that implements the base application.
         * @property {string} appId Universal stable logical identifier of the application across the whole content.
         * @property {string} appVersion Version of the app
         * @property {string} appSupportInfo The name of an organizational component that handles support incidents.
         * @property {string} appFrameworkVersion Version of the framework
         * @since 1.120.0
         * @public
         */

        /**
         * Defines the application info metadata.
         *
         * @typedef {object} sap.ushell.services.AppLifeCycle.AppInfoMetadata
         * @property {string} value The value of the parameter.
         * @property {boolean} [showInAbout] Whether the parameter should be shown in the about dialog.
         * @property {string} [label] The label of the parameter
         * @since 1.131.0
         * @private
         */

        /**
         * Defines the current application.
         *
         * @typedef sap.ushell.services.AppLifeCycle.CurrentApplication
         * @property {sap.ushell.services.AppLifeCycle.ApplicationType} applicationType The type of the current application.
         * @property {sap.ui.core.Component} [componentInstance] reference to component (only for applicationType "UI5")
         * @property {boolean} homePage <code>true</code> when root intent (normally #Shell-home) or Appfinder (#Shell-appfinder) is currently displayed.
         * @property {function} getTechnicalParameter
         * function that returns the value of a technical parameter for the given application.
         * This method is for SAP internal usage only.
         * @property {function():Promise<sap.ushell.services.AppLifeCycle.Intent>} getIntent
         * See {@link sap.ushell.services.URLParsing#parseShellHash} for details. <i>This property is for SAP-internal use only!</i>
         * @property {function(Array<sap.ushell.services.AppLifeCycle.AppInfoParameterName>): Promise<sap.ushell.services.AppLifeCycle.AppInfo>} getInfo
         * provides the values of the given parameters.
         * @since 1.120.0
         * @public
        */

        /**
         * Returns information about the currently running application or <code>undefined</code> if no application is running.
         *
         * @returns {sap.ushell.services.AppLifeCycle.CurrentApplication|undefined} Information object about currently running application or <code>undefined</code> if no application is running.
         * <b>Note:</b>
         * Return value is only valid after app is loaded. See {@link #attachAppLoaded} for details.
         * Before an app is loaded, <code>undefined</code> is returned.
         * @since 1.38
         * @public
         */
        this.getCurrentApplication = function () {
            return oCurrentApplication;
        };

        /**
         * Attaches an event handler for the appLoaded event. This event handler will be triggered
         * each time an application has been loaded.
         *
         * @template ObjectToBePassedToHandler {object} Object that will be passed to the handler along with the event object when the event is fired.
         * @param {ObjectToBePassedToHandler} oData
         *     An object that will be passed to the handler along with the event object when the
         *     event is fired.
         * @param {function(sap.ui.base.Event, ObjectToBePassedToHandler)} fnFunction
         *     The handler function to call when the event occurs.
         * @param {object} oListener
         *     The object that wants to be notified when the event occurs (this context within the
         *     handler function).
         * @since 1.38
         * @public
         */
        this.attachAppLoaded = function (oData, fnFunction, oListener) {
            oEventProvider.attachEvent(S_APP_LOADED_EVENT, oData, fnFunction, oListener);
        };

        /**
         * Detaches an event handler from the EventProvider.
         *
         * @param {function} fnFunction
         *     The handler function that has to be detached from the EventProvider.
         * @param {object} oListener
         *     The object that wanted to be notified when the event occurred
         * @since 1.38
         * @public
         */
        this.detachAppLoaded = function (fnFunction, oListener) {
            oEventProvider.detachEvent(S_APP_LOADED_EVENT, fnFunction, oListener);
        };

        /**
         * Set current application object from AppRuntime in cFLP
         *
         * @param {string} sApplicationType The type of the current application.
         * @param {sap.ui.core.Component} oComponentInstance The instance of the component.
         * @param {boolean} bHomePage Indicator for a home page.
         * @param {string} oApplicationContainer The application container.
         * @param {string} sFramework The type of the current application running in iframe.
         *
         * @since 1.82
         * @private
         */
        this.prepareCurrentAppObject = function (sApplicationType, oComponentInstance, bHomePage, oApplicationContainer, sFramework) {
            setCurrentApplicationObject(sApplicationType, oComponentInstance, bHomePage, oApplicationContainer, sFramework);
        };

        /**
         * Reloads the currently displayed app (used by RTA plugin).
         *
         * @since 1.84
         * @private
         * @ui5-restricted sap.ui.rta
         */
        this.reloadCurrentApp = function () {
            EventHub.emit("reloadCurrentApp", {
                sAppContainerId: oCurrentApplicationContainer.getId(),
                sCurrentHash: hasher.getHash(),
                date: Date.now()
            });
        };

        this.setAppInfo = function (oAppInfo, bIsNewApp) {
            AppInfoParameters.setCustomAttributes(oAppInfo?.info);
            if (Config.last("/core/shell/enableMessageBroker")) {
                Container.getServiceAsync("MessageBroker").then(function (oMessageBrokerService) {
                    oCurrentApplication.getAllAppInfo(true).then(function (data) {
                        oMessageBrokerService.publish("flp-app-info", "FLP", Date.now().toString(), (bIsNewApp === true ? "new-app-info" : "app-info-update"), "*", data);
                    });
                });
            }
        };

        function handleMessageBrokerIncommingMessage (oMessageBrokerService, sClientId, sChannelId, sMessageName, data) {
            if (sChannelId === "flp-app-info" && sMessageName === "get-current-app-info" && oCurrentApplication) {
                oCurrentApplication.getAllAppInfo(true).then(function (appData) {
                    oMessageBrokerService.publish("flp-app-info", "FLP", Date.now().toString(), sMessageName, [sClientId], appData);
                });
            }
        }

        // CONSTRUCTOR CODE //
        if (window.QUnit === undefined && Container.inAppRuntime() === false) {
            if (Config.last("/core/shell/enableMessageBroker")) {
                Container.getServiceAsync("MessageBroker").then(function (oMessageBrokerService) {
                    oMessageBrokerService.subscribe(
                        "FLP",
                        [{
                            channelId: "flp-app-info",
                            version: "1.0"
                        }],
                        handleMessageBrokerIncommingMessage.bind(undefined, oMessageBrokerService),
                        function () { }
                    );
                });
            }
        }
        oEventProvider = new EventProvider();
        if (Container.inAppRuntime() === false) {
            if (Container.getRendererInternal()) {
                registerToNavigationEvent();
            } else {
                // Renderer not created yet. This can happen if the AppLifeCycle service is preloaded.
                EventHub.once("RendererLoaded").do(function () {
                    registerToNavigationEvent();
                });
            }
        }

        function registerToNavigationEvent () {
            // only continue executing the constructor if the view port container exists in expected format
            var oViewPortContainer = Element.getElementById("viewPortContainer");
            if (!oViewPortContainer || typeof oViewPortContainer.attachAfterNavigate !== "function") {
                Log.error(
                    "Error during instantiation of AppLifeCycle service",
                    "Could not attach to afterNavigate event",
                    "sap.ushell.services.AppLifeCycle"
                );
                return;
            }

            oViewPortContainer.attachAfterNavigate(function (oEvent) {
                var oComponentContainer;
                var oApplicationContainer;
                var sApplicationType;
                var oComponentInstance;
                var sComponentInstanceId;
                var bHomePage = false;

                if (oEvent.mParameters.toId.indexOf("applicationShellPage") === 0) {
                    // instance is a shell, which hosts the ApplicationContainer
                    oApplicationContainer = oEvent.mParameters.to.getApp();
                } else if (oEvent.mParameters.toId.indexOf("application") === 0) {
                    // instance is already the ApplicationContainer
                    oApplicationContainer = oEvent.mParameters.to;
                }

                // try to get component instance if accessible via the component handle
                if (oApplicationContainer && typeof oApplicationContainer.getComponentHandle === "function"
                    && oApplicationContainer.getComponentHandle()) {
                    oComponentInstance = oApplicationContainer.getComponentHandle().getInstance();
                } else if (oApplicationContainer) {
                    oComponentContainer = oApplicationContainer.getAggregation("child");
                    if (oComponentContainer) {
                        oComponentInstance = oComponentContainer.getComponentInstance();
                    }
                } else {
                    oComponentInstance = Component.getComponentById(oEvent.mParameters.to.getComponent());
                }

                // determine if we're dealing with home page by checking the component instance id
                if (oComponentInstance) {
                    sComponentInstanceId = oComponentInstance.getId();
                    // In the past Homepage and AppFinder were the same component.
                    // for compatibility reason bHomePage is
                    // also true for the AppFinder
                    bHomePage = sComponentInstanceId.indexOf("Shell-home-component") !== -1
                        || sComponentInstanceId.indexOf("pages-component") !== -1
                        || sComponentInstanceId.indexOf("workPageRuntime-component") !== -1
                        || sComponentInstanceId.indexOf("Shell-appfinder-component") !== -1
                        || sComponentInstanceId.indexOf("homeApp-component") !== -1
                        || sComponentInstanceId.indexOf("runtimeSwitcher-component") !== -1;
                }

                // type can either be read from application container or set to UI5 if component instance exists
                sApplicationType = oApplicationContainer &&
                    typeof oApplicationContainer.getApplicationType === "function" &&
                    oApplicationContainer.getApplicationType();
                if ((!sApplicationType || sApplicationType === "URL") && oComponentInstance) {
                    sApplicationType = "UI5";
                }

                setCurrentApplicationObject(sApplicationType, oComponentInstance, bHomePage, oApplicationContainer);
            });
        }

        function getAppIntent (bRealAppIntent) {
            var sHash = hasher.getHash();
            var oParsedHash;
            if (!sHash) {
                return Promise.reject("Could not identify current application hash");
            }

            var oService = Container.getServiceAsync("URLParsing");
            return oService.then(function (oParsingService) {
                oParsedHash = oParsingService.parseShellHash(sHash);
                if (bRealAppIntent === true && oCurrentApplicationContainer && typeof oCurrentApplicationContainer.getCurrentAppUrl === "function") {
                    var sAppUrl = oCurrentApplicationContainer.getCurrentAppUrl();
                    if (sAppUrl) {
                        var oUriParams = new URI(sAppUrl).search(true);
                        if (oUriParams.hasOwnProperty("sap-remote-intent")) {
                            oParsedHash.semanticObject = oUriParams["sap-remote-intent"].split("-")[0];
                            oParsedHash.action = oUriParams["sap-remote-intent"].split("-")[1];
                            delete oParsedHash.params["sap-shell-so"];
                            delete oParsedHash.params["sap-shell-action"];
                        }
                    }
                }
                return oParsedHash;
            });
        }

        function setCurrentApplicationObject (sApplicationType, oComponentInstance, bHomePage, oApplicationContainer, sFramework) {
            oCurrentApplicationContainer = oApplicationContainer;
            oCurrentApplication = {
                applicationType: sApplicationType,
                componentInstance: oComponentInstance,
                homePage: bHomePage,
                getTechnicalParameter: function (sParameterName) {
                    return TechnicalParameters.getParameterValue(
                        sParameterName,
                        oComponentInstance,
                        oApplicationContainer,
                        sApplicationType
                    );
                },
                getIntent: getAppIntent,
                /**
                 * A function to collect the values of the given parameters
                 * @param {string[]} aParameters Array of requested parameters
                 * @returns {Promise} oPromise Promise that resolves to an object
                 *    keeping the application info parameters with values
                 */
                getInfo: function (aParameters) {
                    return AppInfoParameters.getInfo(aParameters, oCurrentApplication, oApplicationContainer);
                },
                /**
                 * Returns all application info parameters with values related to this application.
                 *
                 * @example
                 *   const oResultWithValuesOnly = {
                 *       appFrameworkId: "UI5",
                 *       appId: "F1234",
                 *       productName: "SAP Fiori launchpad",
                 *       "custom.property": "customValue"
                 *   };
                 *   const oResultWithMetadata = {
                 *       appFrameworkId: { value: "UI5" },
                 *       appId: { value: "F1234" },
                 *       productName: { value: "SAP Fiori launchpad" },
                 *       "custom.property": { value: "customValue", showInABout: true, label: "Custom Property" }
                 *   };
                 * @param {boolean} bValues Whether to return the metadata or just the values.
                 * @returns {Promise<Object<string, string>|Object<string, sap.ushell.services.AppLifeCycle.AppInfoMetadata>>} Object containing the application info parameters with values.
                 *
                 * @private
                 */
                getAllAppInfo: function (bValues) {
                    return AppInfoParameters.getAllAppInfo(bValues, oCurrentApplication, oComponentInstance, oApplicationContainer)
                        .then(function (oData) {
                            if (bValues === true) {
                                oData.applicationType = oCurrentApplication.applicationType;
                                oData.homePage = oCurrentApplication.homePage;
                            } else {
                                oData.applicationType = { value: oCurrentApplication.applicationType };
                                oData.homePage = { value: oCurrentApplication.homePage };
                            }
                            return oData;
                        });
                },
                getSystemContext: function () {
                    var oCurrentApp = AppConfiguration.getCurrentApplication() || {};
                    var sContentProviderId = oCurrentApp.contentProviderId /* a content provider id */ || ""/* i.e., the local system */;

                    return Container.getServiceAsync("ClientSideTargetResolution")
                        .then(function (ClientSideTargetResolutionService) {
                            return ClientSideTargetResolutionService.getSystemContext(sContentProviderId);
                        });
                },
                /**
                 * Emits an event when disableKeepAliveAppRouterRetrigger API is called
                 * This API should be used only by Fiori Elements team
                 *
                 * @param {boolean} bDisableRouterRetrigger
                 *     A flag to disable or enable the router's re-trigger
                 *     when a keep-alive application is restored
                 * @since 1.98
                 * @private
                 */
                disableKeepAliveAppRouterRetrigger: function (bDisableRouterRetrigger) {
                    getAppIntent().then(function (oIntent) {
                        EventHub.emit("disableKeepAliveRestoreRouterRetrigger", {
                            disable: bDisableRouterRetrigger,
                            intent: oIntent,
                            componentId: oCurrentApplication.componentInstance.oContainer.sId,
                            date: Date.now()
                        });
                    });
                }
            };

            setTimeout(function () {
                oEventProvider.fireEvent(S_APP_LOADED_EVENT, oCurrentApplication);
                // shell analytics is listening to this event
                EventHub.emit("FESRAppLoaded", {technicalName: oCurrentApplication?.technicalName});
                if (window.QUnit === undefined && Container.inAppRuntime() === false) {
                    if (Config.last("/core/shell/enableMessageBroker")) {
                        Container.getServiceAsync("MessageBroker").then(function (oMessageBrokerService) {
                            oCurrentApplication.getAllAppInfo(true).then(function (data) {
                                oMessageBrokerService.publish("flp-app-info", "FLP", Date.now().toString(), "new-app-info", "*", data);
                            });
                        });
                    }
                }
            }, 0);
        }
    }

    /**
     * @alias sap.ushell.services.AppLifeCycle.ApplicationType
     * @enum {string}
     * Enumeration of application types.
     *
     * @since 1.120.0
     * @public
     *
    */
    AppLifeCycle.prototype.ApplicationType = {
        /**
         * The application is a UI5 application.
         * @public
         */
        UI5: "UI5",
        /**
         * The application is a Webdynpro application.
         * @public
         */
        WDA: "WDA",
        /**
         * The application is starting using the SAP Business Client.
         * @public
         */
        NWBC: "NWBC",
        /**
         * The application is started using a URL
         * @public
         */
        URL: "URL",
        /**
         * The application is started using a transaction
         * @public
         */
        TR: "TR"
    };

    /**
     * @alias sap.ushell.services.AppLifeCycle.AppInfoParameterName
     * @enum {string}
     * Enumeration of application info parameter names.
     *
     * @since 1.120.0
     * @public
     */
    AppLifeCycle.prototype.AppInfoParameterName = {
        /**
         * A human readable free form text maintained on the platform where FLP runs, and identifying the current product.
         * @public
         */
        productName: "productName",
        /**
         * Current FLP theme. Includes the path to the theme resources if the theme is not an sap theme (does not start with sap_)
         * @public
         */
        theme: "theme",
        /**
         * Current Language (BCP47 format)
         * @public
         */
        languageTag: "languageTag",
        /**
         * Intent that was used to launch the application (including parameters)
         * @public
         */
        appIntent: "appIntent",
        /**
         * ID of the framework
         * @public
         */
        appFrameworkId: "appFrameworkId",
        /**
         * Identifier of the component that implements the base application.
         * @public
         */
        technicalAppComponentId: "technicalAppComponentId",
        /**
         * Universal stable logical identifier of the application across the whole content.
         * @public
         */
        appId: "appId",
        /**
         * Version of the app
         * @public
         */
        appVersion: "appVersion",
        /**
         * The name of an organizational component that handles support incidents.
         * @public
         */
        appSupportInfo: "appSupportInfo",
        /**
         * Version of the framework
         * @public
         */
        appFrameworkVersion: "appFrameworkVersion"
    };

    AppLifeCycle.hasNoAdapter = true;
    return AppLifeCycle;
}, true/* bExport */);
