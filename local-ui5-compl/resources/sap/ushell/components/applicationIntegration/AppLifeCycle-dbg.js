// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview handle all the resources for the different applications.
 * @version 1.132.1
 */
sap.ui.define([
    "sap/ui/Device",
    "sap/ui/core/Element",
    "sap/ui/core/EventBus",
    "sap/ushell/components/applicationIntegration/Storage",
    "sap/ushell/components/applicationIntegration/application/BlueBoxHandler",
    "sap/ushell/components/applicationIntegration/application/Application",
    "sap/ushell/components/applicationIntegration/application/PostMessageUtils",
    "sap/ushell/components/applicationIntegration/application/WebGUIStatefulHandler",
    "sap/ushell/components/applicationIntegration/relatedServices/RelatedServices",
    "sap/ushell/components/applicationIntegration/configuration/AppMeta",
    "sap/ushell/services/AppConfiguration",
    "sap/ushell/utils",
    "sap/ushell/Config",
    "sap/ushell/ApplicationType",
    "sap/base/util/deepExtend",
    "sap/ushell/utils/UriParameters",
    "sap/base/Log",
    "sap/ushell/EventHub",
    "sap/ushell/utils/UrlParsing",
    "sap/ui/thirdparty/hasher",
    "sap/ushell/services/MessageBroker/MessageBrokerEngine",
    "sap/ushell/renderer/utils",
    "sap/m/library",
    "sap/ushell/AppInfoParameters",
    "sap/ushell/Container",
    "sap/ushell/resources",
    "sap/ushell/state/ShellModel",
    "sap/ushell/state/StateManager",
    "sap/ushell/state/KeepAlive",
    "sap/ushell/ui5service/ShellUIServiceFactory",
    "sap/ui/core/service/ServiceFactoryRegistry",
    "sap/base/util/ObjectPath"
], (
    Device,
    Element,
    EventBus,
    Storage,
    BlueBoxHandler,
    Application,
    PostMessageUtils,
    WebGUIStatefulHandler,
    RelatedServices,
    AppMeta,
    AppConfiguration,
    ushellUtils,
    Config,
    ApplicationType,
    deepExtend,
    UriParameters,
    Log,
    EventHub,
    UrlParsing,
    hasher,
    MessageBrokerEngine,
    RendererUtils,
    mobileLibrary,
    AppInfoParameters,
    Container,
    ushellResources,
    ShellModel,
    StateManager,
    KeepAlive,
    ShellUIServiceFactory,
    ServiceFactoryRegistry,
    ObjectPath
) => {
    "use strict";

    // shortcut for sap.ushell.state.StateManager.ShellMode
    const ShellMode = StateManager.ShellMode;

    // shortcut for sap.ushell.state.StateManager.LaunchpadState
    const LaunchpadState = StateManager.LaunchpadState;

    // shortcut for sap.ushell.state.StateManager.Operation
    const Operation = StateManager.Operation;

    // shortcut for sap.m.URLHelper
    const URLHelper = mobileLibrary.URLHelper;

    // todo: [FLPCOREANDUX-10024] cleanup
    // const CACHED_APP_TYPES = ["URL"];

    const KEEP_ALIVE_MODES = {
        FULL: "true",
        RESTRICTED: "restricted",
        FALSE: "false"
    };

    function AppLifeCycle () {
        //Dangling controls is a queue of requests to change shell elements attributes, requested by the application in the process of createContent before the actual application state was apply.
        let bDisableHomeAppCache = false;
        let bEnableRouterRetrigger = true;
        let oCurrentApplication = {};
        const oComponentCreatedPromises = {};
        let oGlobalShellUIService,
            fnOldTriggerEmail,
            oViewPortContainer;

        //connect FLP to the message broker
        if (window.QUnit === undefined) {
            MessageBrokerEngine.connect("FLP");
        }

        /**
         * @returns {object} Returns the RelatedServices API.
         */
        this.service = function () {
            return RelatedServices;
        };

        /**
         * Sets the componentCreated promise for a given appId if it does not exist yet.
         * Returns the promise along with the resolve and reject functions.
         * @private
         * @since 1.125.0
         * @param {string} sStorageAppId The id of the created application.
         * @returns {{
         *     promise: Promise,
         *     resolve: function,
         *     reject: function
         * }} An object containing the promise and the resolve and reject functions.
         */
        this._setComponentCreatedPromise = function (sStorageAppId) {
            if (!oComponentCreatedPromises[sStorageAppId]) {
                oComponentCreatedPromises[sStorageAppId] = {};
                oComponentCreatedPromises[sStorageAppId].promise = new Promise((resolve, reject) => {
                    oComponentCreatedPromises[sStorageAppId].resolve = resolve;
                    oComponentCreatedPromises[sStorageAppId].reject = reject;
                });
            }

            return oComponentCreatedPromises[sStorageAppId];
        };

        /**
         * Resolves the componentCreated promise for the given appId. If the promise does not yet exist, it is created.
         * @param {string} sStorageAppId The id of the created application.
         * @private
         * @since 1.125.0
         */
        this._resolveComponentCreatedPromise = function (sStorageAppId) {
            if (!sStorageAppId) {
                return;
            }
            this._setComponentCreatedPromise(sStorageAppId).resolve();
        };

        /**
         * Returns the componentCreated promise for the given appId. If the promise does not yet exist, it is created.
         * @param {string} sStorageAppId The id of the created application.
         * @returns {Promise | undefined} The componentCreated promise for the given appId or undefined if no appId is given.
         * @private
         * @since 1.125.0
         */
        this._getComponentCreatedPromise = function (sStorageAppId) {
            if (!sStorageAppId) { return; }
            return this._setComponentCreatedPromise(sStorageAppId).promise;
        };

        /**
         * @param {string} sId Id of the control might end with "-component"
         * @returns {string} Returns the normalized appId
         */
        this._normalizeAppId = function (sId) {
            const sCmp = "-component";
            const isCmp = sId.endsWith(sCmp);

            if (isCmp) {
                return sId.substring(0, sId.length - sCmp.length);
            }
            return sId;
        };

        /**
         * @param {object} oEvent
         * @param {string} sChannel
         * @param {object} oData
         */
        this._onComponentCreated = function (oEvent, sChannel, oData) {
            const oApp = oData.component;
            const sStorageAppId = this._normalizeAppId(oApp.getId());
            const oStorageEntry = Storage.get(sStorageAppId);

            if (oStorageEntry) {
                oStorageEntry.app = oApp;
                Application.active(oStorageEntry.app);

            } else {
                oCurrentApplication.app = oApp;

                if (oApp.active) {
                    oApp.active();
                }
            }

            this._resolveComponentCreatedPromise(sStorageAppId);
        };

        /**
         * @param {object} oEvent
         * @param {string} sChannel
         * @param {object} oData
         */
        this._onGetMe = function (oEvent, sChannel, oData) {
            oData.AppLifeCycle = this;
        };

        /**
         * @param {string} sStorageAppId
         */
        this._store = function (sStorageAppId) {
            const oStorageEntry = Storage.get(sStorageAppId);

            if (oStorageEntry) {
                Application.store(oStorageEntry);
                oStorageEntry.stateStored = true;
            }
        };

        /**
         * @param {string} sStorageAppId
         * @param {object} oApplicationContainer
         * @param {boolean} bHardDestroy
         * @returns {Promise} Resolves when the app is destroyed.
         */
        this._destroyApplication = async function (sStorageAppId, oApplicationContainer, bHardDestroy) {
            const oStorageEntry = Storage.get(sStorageAppId);

            if (!sStorageAppId || !oApplicationContainer) {
                return;
            }

            // todo: [FLPCOREANDUX-10024] instead we should check for keepAlive property
            // ignore stateful destroy when hard destroy is requested
            if (oStorageEntry && !bHardDestroy) { // keep alive
                Storage.removeById(sStorageAppId);

                // Stateful - appruntime (v1, v2 keepAlive is not stateful)
                if (BlueBoxHandler.isStatefulContainer(oStorageEntry.container)) {
                    await BlueBoxHandler.statefulDestroyApp(oStorageEntry.container, sStorageAppId);

                    // Return v1, v2 keepAlive to pool
                } else if (oStorageEntry.container.getIsKeepAlive() && BlueBoxHandler.isReusableContainer(oStorageEntry.container)) {
                    BlueBoxHandler.returnUnusedKeepAliveContainer(oStorageEntry.container);
                    await this._handleExitStateful(oStorageEntry.container, false);

                    // embedded keep alive
                } else {
                    this._removeApplicationContainerFromViewPort(sStorageAppId);
                    BlueBoxHandler.deleteBlueBoxByContainer(oStorageEntry.container);
                    oStorageEntry.container.destroy();
                }
                return;
            }

            if (bHardDestroy) {
                Storage.removeByContainer(oApplicationContainer);
            }

            this._removeApplicationContainerFromViewPort(sStorageAppId);
            /**
             * If the application running in an iframe registered for "before close" event,
             * we first post it a message to prepare for closing (usually, the app will close
             * its session or release locks held on the server), and only when the iframe send a response
             * back that it finished processing the event, we will continue to destroy the app (iframe).
             * If the app in the iframe did not register to the event, we destroy the app immediately exactly
             * as it was done before.
             * Note that even if the response from the iframe is not successful, we still destroy the app
             * because the second app that we navigated to was already created so we can not stop
             * the actual navigation (this is the same behaviour that we had before).
             * This mechanism was added to solve the change made in Chrome to disallow Sync XHR on
             * browser close.
             */
            try {
                const oThenable = oApplicationContainer.sendBeforeAppCloseEvent();
                await ushellUtils.promisify(oThenable);
            } catch (sError) {
                Log.error(
                    "FLP got a failed response from the iframe for the 'sap.ushell.services.CrossApplicationNavigation.beforeAppCloseEvent' message sent",
                    sError,
                    "sap.ushell.components.applicationIntegration.AppLifeCycle.js"
                );
            }

            if (oStorageEntry) {
                KeepAlive.destroy(oStorageEntry);
            }

            BlueBoxHandler.deleteBlueBoxByContainer(oApplicationContainer);
            Application.destroy(oApplicationContainer);
        };

        /**
         * @param {string} sStorageAppId
         */
        this._restore = function (sStorageAppId) {
            const oStorageEntry = Storage.get(sStorageAppId);

            if (oStorageEntry?.stateStored) {
                // 1) Extensions
                RelatedServices.restore(oStorageEntry.service);
                AppMeta.restore(oStorageEntry.meta);
                // 2) Extension API
                ShellUIServiceFactory.restore(oStorageEntry);
                // 3) Application
                Application.restore(oStorageEntry);
            }
        };

        /**
         * @param {object} oApplicationContainer
         * @param {boolean} bNavigationToFlpComponent
         * @param {boolean} [bForceCloseApp]
         * @returns {Promise} Resolves when the app is closed.
         */
        this._handleExitStateful = function (oApplicationContainer, bNavigationToFlpComponent, bForceCloseApp) {
            const sActualAppFromId = oApplicationContainer.getCurrentAppId();

            if (Storage.get(sActualAppFromId)) {
                const bDestroyApp = bForceCloseApp || (RelatedServices.isBackNavigation() && !bNavigationToFlpComponent);
                if (bDestroyApp) {
                    EventBus.getInstance().publish("sap.ushell", "appClosed", oApplicationContainer);
                    Storage.removeById(sActualAppFromId);
                    return BlueBoxHandler.statefulDestroyApp(oApplicationContainer);
                }
                // in this case the store of the currently running application, so we do not need to pass the sCacheId
                EventBus.getInstance().publish("sap.ushell", "appClosed", oApplicationContainer);
                return BlueBoxHandler.statefulStoreKeepAliveApp(oApplicationContainer, sActualAppFromId);
            }
            // in this case the destroy of the currently running application, so we do not need to pass the sCacheId
            return BlueBoxHandler.statefulDestroyApp(oApplicationContainer);
        };

        /**
         * @param {object} oOldApplicationContainer
         * @param {boolean} bNavigationToFlpComponent
         * @param {boolean} bFromAfterNavigate
         * @returns {Promise} Resolves when the app is closed.
         */
        this._handleExitApplication = async function (oOldApplicationContainer, bNavigationToFlpComponent, bFromAfterNavigate) {
            if (!oOldApplicationContainer) {
                return;
            }

            const sOldStorageAppId = oOldApplicationContainer.getCurrentAppId();

            if (!sOldStorageAppId) {
                return;
            }

            // todo: [FLPCOREANDUX-10024] should not be necessary; the destroy should be callable multiple times w/o issues
            // if called from onAfterNavigate, do nothing if oOldApplicationContainer is stateful container, because
            // application was already closed at the beginning of 'handleCreateApplicationContainer'
            if (!bNavigationToFlpComponent
                && bFromAfterNavigate
                && (
                    BlueBoxHandler.isStatefulContainer(oOldApplicationContainer)
                    || BlueBoxHandler.isStatefulContainerInKeepAlivePool(oOldApplicationContainer)
                )
            ) {
                return;
            }

            const oOldStorageEntry = Storage.get(sOldStorageAppId);
            // STATEFUL
            if (BlueBoxHandler.isStatefulContainer(oOldApplicationContainer)) {
                await this._handleExitStateful(oOldApplicationContainer, bNavigationToFlpComponent);

                //STATELESS
            } else if (oOldStorageEntry) {
                // Back Navigation Case
                if (RelatedServices.isBackNavigation() && !bNavigationToFlpComponent) {
                    //check if the Iframe needs to be cached instead of destroy
                    if (oOldApplicationContainer.getIsKeepAlive() && BlueBoxHandler.isReusableContainer(oOldApplicationContainer)) {
                        BlueBoxHandler.returnUnusedKeepAliveContainer(oOldApplicationContainer);
                        await this._handleExitStateful(oOldApplicationContainer, bNavigationToFlpComponent);

                    } else {
                        await this._destroyApplication(sOldStorageAppId, oOldApplicationContainer);
                    }

                    // Forward Navigation Cases
                } else if (oOldApplicationContainer.getApplicationType() === "UI5") {
                    // Wait until navigation's source app has been started completely, so that a later back navigation finds a proper app that
                    // can be re-enabled (keep-alive scenario)
                    await this._getComponentCreatedPromise(sOldStorageAppId);
                    this._store(sOldStorageAppId);
                } else {
                    this._store(sOldStorageAppId);
                }
                EventBus.getInstance().publish("sap.ushell", "appClosed", oOldApplicationContainer);

                // LEGACY STATEFUL (WebGUI)
            } else if (oOldApplicationContainer.getStatefulType() === BlueBoxHandler.STATEFUL_TYPES.GUI_V1) {
                if (bNavigationToFlpComponent) {
                    await PostMessageUtils.postMessageToIframeApp(oOldApplicationContainer, "sap.gui", "triggerCloseSessionImmediately");
                }

                // THE REST...
            } else {
                //destroy the application and its resources
                await this._destroyApplication(sOldStorageAppId, oOldApplicationContainer);
            }
        };

        /**
         * @param {function(): boolean} fnFilterApps The filter function
         * @returns {Promise} Resolves when all keep alive apps are closed.
         */
        this._closeKeepAliveApps = function (fnFilterApps) {
            try {
                const aKeepAliveRestrictedApps = [];

                Storage.forEach((oStorageEntry) => {
                    if (fnFilterApps(oStorageEntry)) {
                        aKeepAliveRestrictedApps.push(oStorageEntry);
                    }
                });
                const aClosePromises = aKeepAliveRestrictedApps.map((oRestrictedApp) => {
                    //check if it needs to be cached instead of destroy
                    const bCanHandleKeepAlive = BlueBoxHandler.isStatefulContainerSupportingKeepAlive(oRestrictedApp.container);
                    const bIsKeepAlive = oRestrictedApp.container.getIsKeepAlive();
                    const bIsReusable = BlueBoxHandler.isReusableContainer(oRestrictedApp.container);

                    if (!bCanHandleKeepAlive && bIsKeepAlive && bIsReusable) {
                        BlueBoxHandler.returnUnusedKeepAliveContainer(oRestrictedApp.container);
                        // todo: [FLPCOREANDUX-10024] what is the actual difference between destroyApplication and handleExitStateful?
                        return this._handleExitStateful(oRestrictedApp.container, true, true);
                    }

                    return this._destroyApplication(oRestrictedApp.appId, oRestrictedApp.container);
                });

                return Promise.all(aClosePromises);
            } catch (e) {
                Log.error("closeKeepAliveApps call failed", e);
            }
        };

        /**
         * @param {string} sFromId
         * @param {object} oFrom
         */
        this.onBeforeNavigate = function (sFromId, oFrom) {
            if (sFromId && oFrom && oFrom.isA("sap.ushell.components.container.ApplicationContainer")) {
                const sStorageAppId = sFromId;
                const oApplicationContainer = oFrom;

                const bHasIframe = !!oApplicationContainer._getIFrame(); // todo: [FLPCOREANDUX-10024] is this really required?
                const bIsSupportedType = oApplicationContainer.getStatefulType() > BlueBoxHandler.STATEFUL_TYPES.NOT_SUPPORTED;

                const bCached = !!Storage.get(sStorageAppId);
                const bSessionHandlingSupported = bHasIframe && bIsSupportedType;

                if (bCached || bSessionHandlingSupported) {
                    PostMessageUtils.postMessageToIframeApp(oApplicationContainer, "sap.ushell.sessionHandler", "beforeApplicationHide", {}, false);
                }
            }

        };

        /**
         * @param {string} sFromId
         * @param {object} oFrom
         * @param {string} sToId
         * @param {object} oTo
         */
        this.onAfterNavigate = async function (sFromId, oFrom, sToId, oTo) { //call lifecycle interface "setInitialConfiguration"
            if (!sToId) {
                sToId = "";
            }
            if (!sFromId) {
                sFromId = "";
            }
            //destroy the application if not cached or marked for reuse.
            const aFlpComponentIds = [
                "Shell-appfinder-component",
                "Shell-home-component",
                "pages-component-container",
                "homeApp-component-container",
                "workPageRuntime-component-container",
                "runtimeSwitcher-component-container"
            ];

            const bNavigationToFlpComponent = aFlpComponentIds.some((sFlpComponentId) => sToId.includes(sFlpComponentId));
            const bNavigationFromFlpComponent = aFlpComponentIds.some((sFlpComponentId) => sFromId.includes(sFlpComponentId));

            if (bNavigationToFlpComponent) {
                await this._closeKeepAliveApps((oStorageEntry) => oStorageEntry.keepAliveMode === KEEP_ALIVE_MODES.RESTRICTED);

                Application.setActiveAppContainer(undefined);

                // Clear custom About Dialog parameters
                AppInfoParameters.flush();
            } else if (sToId && oTo) {
                const sStorageAppId = sToId;
                const oApplicationContainer = oTo;

                // this code must be at the beginning of the function to allow it to be processed once in
                // a cycle of opening an app
                if (oApplicationContainer.getIframeReusedForApp()) {
                    oApplicationContainer.setProperty("iframeReusedForApp", false, true);
                    PostMessageUtils.postMessageToIframeApp(oApplicationContainer, "sap.ushell.sessionHandler", "afterApplicationShow", {}, false);
                }

                if (Storage.get(sStorageAppId)) {
                    this._restore(sStorageAppId);
                }
            }

            if (bNavigationFromFlpComponent) {
                //handle the case of appFinder
                if (sToId.indexOf("Shell-appfinder-component") > 0) {
                    EventBus.getInstance().publish("sap.ushell", "appFinderAfterNavigate");
                }

                if (bDisableHomeAppCache) {
                    try {
                        this._removeApplicationContainerFromViewPort(sFromId);
                        oFrom.destroy();
                    } catch (oError) {
                        Log.error(`Error when trying to destroy the home component: '${sToId}'`, oError);
                    }
                }
            } else if (sFromId && oFrom) {
                const oApplicationContainer = oFrom;

                await this._handleExitApplication(oApplicationContainer, bNavigationToFlpComponent, true);
            }
        };

        /**
         * @param {object} oOldResolvedHashFragment
         * @param {object} oResolvedHashFragment
         * @returns {Promise} Resolves when the after navigation was handled.
         */
        // todo: [FLPCOREANDUX-10024] should be moved to onAfterNavigate
        this.handleAfterNavigate = async function (oResolvedHashFragment, oOldResolvedHashFragment) {
            if (!oOldResolvedHashFragment) {
                return;
            }

            const sAppFrameworkId = ObjectPath.get("appCapabilities.appFrameworkId", oOldResolvedHashFragment);
            const bFromApplicationIsTR = ushellUtils.isTRApplicationType(oOldResolvedHashFragment.applicationType, sAppFrameworkId);
            const bToApplicationIsTR = ushellUtils.isTRApplicationType(oResolvedHashFragment.applicationType);

            if (bFromApplicationIsTR && !bToApplicationIsTR) {
                const oPreviousStatefulContainer = BlueBoxHandler.getBlueBoxByUrl(oOldResolvedHashFragment.url);
                if (oPreviousStatefulContainer && oPreviousStatefulContainer.getStatefulType() === BlueBoxHandler.STATEFUL_TYPES.GUI_V1) {
                    return WebGUIStatefulHandler.guiStatefulCloseCurrentApp(oPreviousStatefulContainer);
                }
            }
        };

        /**
         * @param {string} sStorageAppId
         * @param {object} oApplicationContainer
         * @param {object} oResolvedHashFragment
         * @param {string} oParsedShellHash
         * @param {string} sKeepAliveMode
         * @returns {boolean} Returns true if the app was stored
         */
        this._storeApp = function (sStorageAppId, oApplicationContainer, oResolvedHashFragment, oParsedShellHash, sKeepAliveMode) {
            if (Storage.get(sStorageAppId)) {
                return false;
            }

            oApplicationContainer.setProperty("isKeepAlive", true, true);

            Storage.set(sStorageAppId, {
                service: {},
                shellHash: `#${UrlParsing.constructShellHash(oParsedShellHash)}`,
                appId: sStorageAppId,
                stt: "loading",
                currentState: null, // current state is stored before close see: sap/ushell/state/CurrentState
                controlManager: null, // control manager state is stored before close see: sap/ushell/state/ControlManager
                container: oApplicationContainer,
                meta: AppConfiguration.getMetadata(oResolvedHashFragment),
                app: undefined,
                keepAliveMode: sKeepAliveMode,
                appTarget: oResolvedHashFragment,
                ui5ComponentName: oResolvedHashFragment.ui5ComponentName,
                enableRouterRetrigger: bEnableRouterRetrigger,
                stateStored: false
            });

            return true;
        };

        /**
         * Stores the state of the current application
         *  - back navigation
         *  - title, hierarchy, relatedApps
         *  - currentState, controlManager
         * @returns {Promise} Resolves when the store is done.
         *
         * @since 1.128.0
         * @private
         */
        this.storeAppExtensions = async function () {
            const oCurrentApp = this.getCurrentApplication();
            if (!oCurrentApp) {
                return;
            }
            const sStorageAppId = oCurrentApp.appId;
            const oStorageEntry = Storage.get(sStorageAppId);

            if (!oStorageEntry) {
                // do not store for non-keep-alive apps
                return;
            }

            if (oStorageEntry.container.getApplicationType() === "UI5") {
                await this._getComponentCreatedPromise(sStorageAppId);
            }

            // back navigation
            RelatedServices.store(oStorageEntry.service);
            // currentState, controlManager
            KeepAlive.store(oStorageEntry);
            // About Dialog
            AppInfoParameters.store(oStorageEntry);
        };

        /**
         * @param {string} sStorageAppId
         * @param {object} oResolvedHashFragment
         * @param {object} oParsedShellHash
         * @returns {string} Returns the keep alive mode.
         */
        this._calculateKeepAliveMode = function (sStorageAppId, oResolvedHashFragment, oParsedShellHash) {
            //generic intent currently can never be keep alive
            if (sStorageAppId === "application-Shell-startIntent") {
                return;
            }

            // Global override in query parameters
            let sKeepAlive = new URLSearchParams(window.location.search).get("sap-keep-alive");
            if (sKeepAlive === KEEP_ALIVE_MODES.FULL || sKeepAlive === KEEP_ALIVE_MODES.RESTRICTED) {
                return sKeepAlive;
            } else if (sKeepAlive === KEEP_ALIVE_MODES.FALSE) {
                return;
            }

            // App override in intent parameters
            sKeepAlive = oParsedShellHash.params?.["sap-keep-alive"];
            if (sKeepAlive === KEEP_ALIVE_MODES.FULL || sKeepAlive === KEEP_ALIVE_MODES.RESTRICTED) {
                return sKeepAlive;
            } else if (sKeepAlive === KEEP_ALIVE_MODES.FALSE) {
                return;
            }

            // Magic override in resolved hash fragment
            if (oResolvedHashFragment.url) {
                sKeepAlive = UriParameters.fromURL(oResolvedHashFragment.url).get("sap-keep-alive");
                if (sKeepAlive === KEEP_ALIVE_MODES.FULL || sKeepAlive === KEEP_ALIVE_MODES.RESTRICTED) {
                    return sKeepAlive;
                } else if (sKeepAlive === KEEP_ALIVE_MODES.FALSE) {
                    return;
                }
            }

            // if the app is a root intent, it should be kept alive (e.g. workzone advanced)
            // can be overridden by the above checks
            const sShellHash = UrlParsing.constructShellHash(oParsedShellHash);
            if (sShellHash && ushellUtils.isRootIntent(sShellHash)) {
                return KEEP_ALIVE_MODES.FULL;
            }
        };

        /**
         * @param {object} oResolvedHashFragment
         * @returns {string} Returns the application type.
         */
        this._calculateAppType = function (oResolvedHashFragment) {
            if (oResolvedHashFragment.applicationType === "URL" && oResolvedHashFragment.additionalInformation?.startsWith?.("SAPUI5.Component=")) {
                return "SAPUI5";
            }
            return oResolvedHashFragment.applicationType;
        };

        /**
         * @param {object} oData
         * @returns {Promise} Resolves when the app is reloaded.
         */
        this._reloadCurrentApp = async function (oData) {
            const oTmpAppContainer = BlueBoxHandler.getBlueBoxById(oData.sAppContainerId);
            if (oTmpAppContainer) {
                // todo: [FLPCOREANDUX-10024] this destroy/remove can be simplified
                const sTmpUrl = oTmpAppContainer.getUrl();
                BlueBoxHandler.removeCapabilities(oTmpAppContainer);
                Storage.removeByContainer(oTmpAppContainer);
                await this._destroyApplication(oData.sAppContainerId, oTmpAppContainer);
                BlueBoxHandler.deleteBlueBoxByUrl(sTmpUrl);
            }

            const ShellNavigationInternal = await Container.getServiceAsync("ShellNavigationInternal");
            try {
                ShellNavigationInternal.hashChanger.treatHashChanged(oData.sCurrentHash);
            } catch (error) {
                Log.error("Error when trying to re-load the current displayed application", error, "sap.ushell.services.AppLifeCycle");
            }
        };

        /**
         * @param {string} sAppId
         * @param {object} oResolvedHashFragment
         * @param {object} oParsedShellHash
         */
        this._openApp = async function (sAppId, oResolvedHashFragment, oParsedShellHash) {
            let oTmpAppContainer,
                oApplicationContainerToUse,
                sTmpUrl;

            //format appId, the is the storage identifier
            const sStorageAppId = `application-${sAppId}`;

            //this case will handle the stateful containers flow.
            let oApplicationContainer = BlueBoxHandler.getBlueBoxByUrl(oResolvedHashFragment.url);

            const sKeepAliveMode = this._calculateKeepAliveMode(sStorageAppId, oResolvedHashFragment, oParsedShellHash);
            const bShouldBeCached = !!sKeepAliveMode;

            if (BlueBoxHandler.isStatefulContainer(oApplicationContainer)) {
                if (bShouldBeCached) {
                    //this is the case where we have a stateful container and keep alive
                    //is cached application
                    let oStorageEntry = Storage.get(sStorageAppId);
                    if (!oStorageEntry) {
                        this._storeApp(sStorageAppId, oApplicationContainer, oResolvedHashFragment, oParsedShellHash, sKeepAliveMode);
                        oStorageEntry = Storage.get(sStorageAppId);
                    }

                    oCurrentApplication = oStorageEntry;
                } else {
                    //create application that is not persisted and not cashed
                    oCurrentApplication = {
                        appId: sStorageAppId,
                        stt: "loading",
                        container: oApplicationContainer,
                        meta: AppConfiguration.getMetadata(oResolvedHashFragment),
                        app: undefined
                    };
                }
            } else if (bShouldBeCached) {
                //is cached application
                let oStorageEntry = Storage.get(sStorageAppId);
                if (!oStorageEntry) {
                    oApplicationContainerToUse = BlueBoxHandler.findFreeContainerForNewKeepAliveApp(oResolvedHashFragment);
                    if (!oApplicationContainerToUse) {
                        //in cFLP, there night me an existing container of the same app from a different server,
                        //so we will need to destroy it to avoid duplicate id
                        oTmpAppContainer = BlueBoxHandler.getBlueBoxById(sStorageAppId) || this._getApplicationContainerFromViewPort(sAppId);
                        // todo: [FLPCOREANDUX-10024] this destroy/remove can be simplified
                        if (oTmpAppContainer) {
                            sTmpUrl = oTmpAppContainer.getUrl();
                            BlueBoxHandler.removeCapabilities(oTmpAppContainer);
                            await this._destroyApplication(sStorageAppId, oTmpAppContainer);
                            BlueBoxHandler.deleteBlueBoxByUrl(sTmpUrl);
                        }
                        oApplicationContainer = Application.createApplicationContainer(sStorageAppId, oResolvedHashFragment);
                    } else {
                        oApplicationContainer = oApplicationContainerToUse;
                    }

                    this._storeApp(sStorageAppId, oApplicationContainer, oResolvedHashFragment, oParsedShellHash, sKeepAliveMode);
                    oStorageEntry = Storage.get(sStorageAppId);
                }

                oCurrentApplication = oStorageEntry;
            } else if (oResolvedHashFragment.applicationType === "TR" || oResolvedHashFragment.appCapabilities?.appFrameworkId === "GUI") {
                oApplicationContainer = BlueBoxHandler.getBlueBoxByUrl(oResolvedHashFragment.url);
                if (oApplicationContainer && oApplicationContainer.getStatefulType() !== BlueBoxHandler.STATEFUL_TYPES.GUI_V1) {
                    oApplicationContainer = undefined;
                }

                //in cFLP, there night me an existing container of the same app from a different server,
                //so we will need to destroy it to avoid duplicate id
                oTmpAppContainer = BlueBoxHandler.getBlueBoxById(sStorageAppId) || this._getApplicationContainerFromViewPort(sAppId);
                // todo: [FLPCOREANDUX-10024] this destroy/remove can be simplified
                if (oTmpAppContainer && (!oApplicationContainer || oTmpAppContainer !== oApplicationContainer)) {
                    sTmpUrl = oTmpAppContainer.getUrl();
                    BlueBoxHandler.removeCapabilities(oTmpAppContainer);
                    await this._destroyApplication(sStorageAppId, oTmpAppContainer);
                    BlueBoxHandler.deleteBlueBoxByUrl(sTmpUrl);
                }

                if (!oApplicationContainer) {
                    oApplicationContainer = Application.createApplicationContainer(sStorageAppId, oResolvedHashFragment);
                }
                //create application that is not persisted and not cashed
                oCurrentApplication = {
                    appId: sStorageAppId,
                    stt: "loading",
                    container: oApplicationContainer,
                    meta: AppConfiguration.getMetadata(oResolvedHashFragment),
                    app: undefined
                };
            } else {
                if (oApplicationContainer) {
                    const oApplicationContainer = this._getApplicationContainerFromViewPort(sAppId);

                    if (oApplicationContainer) {
                        this._removeApplicationContainerFromViewPort(oApplicationContainer.getId());
                        oApplicationContainer.destroy();
                    }
                }
                if (oResolvedHashFragment.applicationType === "URL"
                    || oResolvedHashFragment.applicationType === "TR"
                    || oResolvedHashFragment.applicationType === "NWBC"
                    || oResolvedHashFragment.applicationType === "WDA"
                ) {
                    //Temporary fix - fix duplicate app container id in cFLP
                    //explanation: in cFLP, there might be a case where there are
                    // two apps with the same Semantic object + Action, but from different
                    // backend. The stateful container mechanism does not support it.
                    // Until it is supported, and due to an urgent fix needed for a customer,
                    // we delete here the blue box and then create the new one.
                    // In future BLI, we will change the id of the container to be
                    // more unique.
                    oTmpAppContainer = BlueBoxHandler.getBlueBoxById(sStorageAppId) || this._getApplicationContainerFromViewPort(sAppId);
                    if (oTmpAppContainer) {
                        // todo: [FLPCOREANDUX-10024] this destroy/remove can be simplified
                        sTmpUrl = oTmpAppContainer.getUrl();
                        BlueBoxHandler.removeCapabilities(oTmpAppContainer);
                        await this._destroyApplication(sStorageAppId, oTmpAppContainer, true);
                        BlueBoxHandler.deleteBlueBoxByUrl(sTmpUrl);
                    }
                }
                oApplicationContainer = Application.createApplicationContainer(sStorageAppId, oResolvedHashFragment);

                // //create application that is not persisted and not cashed
                oCurrentApplication = {
                    appId: sStorageAppId,
                    stt: "loading",
                    container: oApplicationContainer,
                    meta: AppConfiguration.getMetadata(oResolvedHashFragment),
                    app: undefined
                };
            }
        };

        /**
         * Any event one wishes to subscribe to during the AppLifeCycle.init() call should be added here.
         * Events will only be added the first time AppLifeCycle.init() is called.
         */
        this._addEvents = (function () {
            let hasBeenCalled = false;
            return function () {
                if (!hasBeenCalled) {
                    hasBeenCalled = true;

                    // Subscribe to events.
                    EventHub.on("disableKeepAliveRestoreRouterRetrigger").do((oData) => {
                        const sAppId = `${oData.intent.semanticObject}-${oData.intent.action}`;
                        const sStorageAppId = `application-${sAppId}`;

                        bEnableRouterRetrigger = oData.disable;

                        if (Storage.get(sStorageAppId)) {
                            Storage.get(sStorageAppId).enableRouterRetrigger = oData.disable;
                        }
                    });
                    EventHub.on("setApplicationFullWidth").do((oData) => {
                        this._setApplicationFullWidth(oData.bValue);
                    });

                    EventHub.on("reloadCurrentApp").do((oData) => {
                        this._reloadCurrentApp(oData);
                    });
                }
            };
        }());

        /**
         * @param {object} oInViewPortContainer
         * @param {boolean} bInDisableHomeAppCache
         */
        this.init = function (oInViewPortContainer, bInDisableHomeAppCache) {
            if (Container && Config.last("/core/shell/enablePersistantAppstateWhenSharing")) {
                Container.getServiceAsync("AppState").then((oAppStateService) => {
                    fnOldTriggerEmail = URLHelper.triggerEmail.bind(URLHelper);
                    URLHelper.triggerEmail = function (sTo, sSubject, sBody, sCc, sBcc) {
                        const sFLPUrl = document.URL;
                        oAppStateService.setAppStateToPublic(sFLPUrl)
                            .done((sNewURL, sXStateKey, sIStateKey, sXStateKeyNew, sIStateKeyNew) => {
                                sSubject = sSubject && sXStateKey && sXStateKeyNew && sSubject.includes(sXStateKey) ? sSubject.replace(sXStateKey, sXStateKeyNew) : sSubject;
                                sSubject = sSubject && sIStateKey && sIStateKeyNew && sSubject.includes(sIStateKey) ? sSubject.replace(sIStateKey, sIStateKeyNew) : sSubject;
                                sBody = sBody && sXStateKey && sXStateKeyNew && sBody.includes(sXStateKey) ? sBody.replace(sXStateKey, sXStateKeyNew) : sBody;
                                sBody = sBody && sIStateKey && sIStateKeyNew && sBody.includes(sIStateKey) ? sBody.replace(sIStateKey, sIStateKeyNew) : sBody;
                                fnOldTriggerEmail(sTo, sSubject, sBody, sCc, sBcc);
                            })
                            .fail((sTo, sSubject, sBody, sCc, sBcc) => {
                                fnOldTriggerEmail(sTo, sSubject, sBody, sCc, sBcc);
                            });
                    };
                });
            }

            ShellUIServiceFactory.init().then(() => {
                ServiceFactoryRegistry.register(
                    "sap.ushell.ui5service.ShellUIService",
                    ShellUIServiceFactory
                );
            });
            this._createGlobalShellUIService();

            oViewPortContainer = oInViewPortContainer;
            bDisableHomeAppCache = bInDisableHomeAppCache;

            BlueBoxHandler.init();
            Application.init(BlueBoxHandler, PostMessageUtils);
            PostMessageUtils.init(Application, BlueBoxHandler);

            //setup & register communication
            this.registerShellCommunicationHandler({
                "sap.ushell.services.AppLifeCycle": {
                    oRequestCalls: {
                        create: {
                            isActiveOnly: true,
                            distributionType: ["URL"]
                        },
                        destroy: {
                            isActiveOnly: true,
                            distributionType: ["URL"]
                        },
                        store: {
                            isActiveOnly: true,
                            distributionType: ["URL"]
                        },
                        restore: {
                            isActiveOnly: true,
                            distributionType: ["URL"]
                        }
                    },
                    oServiceCalls: {
                        subscribe: {
                            executeServiceCallFn: async function (oServiceParams) {
                                const { oContainer: oApplicationContainer } = oServiceParams;
                                const aNewCapabilities = oServiceParams.oMessageData.body;
                                if (!Array.isArray(aNewCapabilities)) {
                                    Log.error("subscribe service call failed: capabilities must be an array");
                                    return {};
                                }
                                oApplicationContainer.addBlueBoxCapabilities(aNewCapabilities);
                                return {};
                            }
                        },
                        setup: {
                            executeServiceCallFn: async function (oServiceParams) {
                                const oSetup = oServiceParams?.oMessageData?.body;
                                const { oContainer: oApplicationContainer } = oServiceParams;

                                const aNewCapabilities = [];
                                if (oSetup) {
                                    const bIsSAPLegacyApplicationType = ushellUtils.isSAPLegacyApplicationType(oApplicationContainer.getApplicationType(), oApplicationContainer.getFrameworkId());
                                    // appruntime supports statefulContainer + keepAlive
                                    const bIgnoreStateful = oApplicationContainer.getIsKeepAlive() && bIsSAPLegacyApplicationType;

                                    if (oSetup.isStateful) {
                                        if (bIgnoreStateful) {
                                            // todo: [FLPCOREANDUX-10024] why not NOT_SUPPORTED instead?
                                            oApplicationContainer.setProperty("statefulType", BlueBoxHandler.STATEFUL_TYPES.FLP_V2_KEEP_ALIVE, true);
                                        } else {
                                            aNewCapabilities.push({ service: "sap.ushell.services.AppLifeCycle", action: "create" });
                                            aNewCapabilities.push({ service: "sap.ushell.services.AppLifeCycle", action: "destroy" });
                                            oApplicationContainer.setProperty("statefulType", BlueBoxHandler.STATEFUL_TYPES.FLP_V2, true);
                                        }
                                    }
                                    if (oSetup.isIframeValid) {
                                        aNewCapabilities.push({ action: "iframeIsValid", service: "sap.ushell.appRuntime" });
                                    }
                                    if (oSetup.session?.bLogoutSupport) {
                                        aNewCapabilities.push({ action: "logout", service: "sap.ushell.sessionHandler" });
                                    }

                                    // todo: [FLPCOREANDUX-10024] this is a workaround
                                    const bIsAppruntime = ushellUtils.isSAPLegacyApplicationType(oApplicationContainer.getApplicationType(), oApplicationContainer.getFrameworkId());
                                    if (bIsAppruntime) {
                                        aNewCapabilities.push({ service: "sap.ushell.services.AppLifeCycle", action: "store" });
                                        aNewCapabilities.push({ service: "sap.ushell.services.AppLifeCycle", action: "restore" });
                                    }

                                    oApplicationContainer.addBlueBoxCapabilities(aNewCapabilities);
                                }
                            }
                        }
                    }
                },
                "sap.gui": {
                    oServiceCalls: {
                        loadFinished: {
                            executeServiceCallFn: async function (oServiceParams) {
                                const { oContainer: oApplicationContainer } = oServiceParams;

                                if (!oApplicationContainer.getIsKeepAlive()) {
                                    oApplicationContainer.setProperty("statefulType", BlueBoxHandler.STATEFUL_TYPES.GUI_V1, true);
                                    oCurrentApplication = {
                                        appId: oApplicationContainer.getId(),
                                        stt: "loading",
                                        container: oApplicationContainer,
                                        meta: undefined,
                                        app: undefined
                                    };
                                } else {
                                    oApplicationContainer.setProperty("statefulType", BlueBoxHandler.STATEFUL_TYPES.GUI_V1_KEEP_ALIVE, true);
                                }
                                return {};
                            }
                        }
                    }
                }

            });

            //TODO add unsubscribe
            EventBus.getInstance().subscribe("sap.ushell", "appComponentLoaded", this._onComponentCreated, this);
            EventBus.getInstance().subscribe("sap.ushell", "getAppLifeCycle", this._onGetMe, this);

            this._addEvents();
        };

        /**
         * @param {object} oShellNavigationInternal
         */
        this.registerHandleHashChange = function (oShellNavigationInternal) {
            oShellNavigationInternal.hashChanger.attachEvent("hashChanged", (oHashChange) => {
                //FIX for internal incident #1980317281 - In general, hash structure in FLP is splitted into 3 parts:
                //A - application identification & B - Application parameters & C - Internal application area
                // Now, when an IFrame changes its hash, it sends PostMessage up to the FLP. The FLP does 2 things: Change its URL
                // and send a PostMessage back to the IFrame. This fix, initiated in the PostMessageAPI.js, blocks only
                // the message back to the IFrame.
                if (hasher.disableBlueBoxHashChangeTrigger) {
                    return;
                }
                if (oHashChange.mParameters && oShellNavigationInternal.hashChanger.isInnerAppNavigation(oHashChange.mParameters.newHash, oHashChange.mParameters.oldHash)) {
                    PostMessageUtils.postMessageToMultipleIframes("sap.ushell.appRuntime", "innerAppRouteChange", {
                        oHash: oHashChange.mParameters
                    });
                }

                PostMessageUtils.postMessageToMultipleIframes("sap.ushell.appRuntime", "hashChange", {
                    sHash: oHashChange.mParameters.fullHash
                });
            });
        };

        /**
         * @param {object} oApplicationContainer
         */
        this._addApplicationContainerToViewPort = function (oApplicationContainer) {
            oViewPortContainer.addCenterViewPort(oApplicationContainer);
        };

        /**
         * @param {string} sId
         */
        this._removeApplicationContainerFromViewPort = function (sId) {
            const oBlueBox = BlueBoxHandler.getBlueBoxById(sId);
            const bIsStateful = BlueBoxHandler.isStatefulContainer(oBlueBox);

            if (!bIsStateful) {
                oViewPortContainer.removeCenterViewPort(sId, true);
            }
        };

        /**
         * @param {string} sAppId
         * @returns {object} Returns the control.
         */
        this._getApplicationContainerFromViewPort = function (sAppId) {
            if (!oViewPortContainer) {
                return;
            }
            return oViewPortContainer.getViewPortControl("centerViewPort", `application-${sAppId}`)
                || oViewPortContainer.getViewPortControl("centerViewPort", `applicationShellPage-${sAppId}`);
        };

        /**
         * @returns {object} Returns the view port container.
         */
        this._getViewPortContainer = function () {
            return oViewPortContainer;
        };

        /**
         * @param {string} sId
         */
        this._navTo = function (sId) {
            oViewPortContainer.navTo("centerViewPort", sId, "show");
        };

        /**
         * @returns {object} Returns the current application.
         */
        this.getCurrentApplication = function () {
            return oCurrentApplication;
        };

        /**
         */
        this.unsetCurrentApplication = function () {
            oCurrentApplication = {};
        };

        /**
         * @param {boolean} bIsFull
         */
        this._setApplicationFullWidth = function (bIsFull) {
            const oCurrent = this.getCurrentApplication();

            //validate that we have a valid applicationContainer
            if (oCurrent.container) {
                oCurrent.container.toggleStyleClass("sapUShellApplicationContainerLimitedWidth", !bIsFull);
            }
        };

        /**
         * Returns the global ShellUIService instance.
         * @returns {object} The global ShellUIService instance
         */
        this.getShellUIService = function () {
            return oGlobalShellUIService;
        };

        /**
         */
        this.resetGlobalShellUIService = function () {
            if (oGlobalShellUIService) {
                oGlobalShellUIService.resetService();
            }
        };

        /**
         * Creates the ShellUIService instance of the AppLifeCycle in application integration if not already created.
         *
         * @returns {Promise} A promise that resolves when the ShellUIService instance is created
         *
         * @since 1.127.0
         * @private
         */
        this._createGlobalShellUIService = async function () {
            oGlobalShellUIService = await ShellUIServiceFactory.createInstanceInternal();
        };

        /**
         * In the FLP, only one container at a time can be active. If we have
         * multiple ApplicationContainers, they may still be active in the
         * background, and still be able to send/receive postMessages (e.g.,
         * change the title while the user is on the FLP home).
         *
         * Also, we distinguish between visible containers and active
         * containers. As it is desirable that when a container is being opened
         * it starts setting the FLP title for example. It results in better
         * perceived performance.
         *
         * This method sets only one container as active and de-activates all
         * other application containers around.
         *
         * @param {object} oTargetApplicationContainer
         *   The application container to activate. Pass <code>null</code> in
         *   case no application container must be activated.
         *
         * @private
         */
        this._activeContainer = function (oTargetApplicationContainer) {
            BlueBoxHandler.forEach((oApplicationContainer) => {
                if (oApplicationContainer && oApplicationContainer !== oTargetApplicationContainer) {
                    try {
                        Log.info(`Deactivating container ${oApplicationContainer.getId()}`);
                        oApplicationContainer.setActive(false);
                    } catch (e) {
                        /* empty */
                    }
                }
            });

            if (oTargetApplicationContainer) {
                Log.info(`Activating container "${oTargetApplicationContainer.getId()}"`);
                oTargetApplicationContainer.setActive(true);
            }
        };

        /**
         * @param {object} oApplicationContainer
         * @param {object} oApplication
         * @param {function} fnOnAfterRendering
         */
        this._publishNavigationStateEvents = function (oApplicationContainer, oApplication, fnOnAfterRendering) {
            //after the app container is rendered, publish an event to notify
            //that an app was opened
            const sId = oApplicationContainer.getId ? oApplicationContainer.getId() : "";
            const appMetaData = AppConfiguration.getMetadata();
            const sIcon = appMetaData.icon;
            const sTitle = appMetaData.title;

            //Attach an event handler which will be called onAfterRendering
            oApplicationContainer.addEventDelegate({ onAfterRendering: fnOnAfterRendering });

            //after the app container exit, publish an event to notify
            //that an app was closed
            const that = this;
            const origExit = oApplicationContainer.exit;
            oApplicationContainer.exit = function () {
                if (origExit) {
                    origExit.apply(this, arguments);
                }
                //apply the original density settings
                AppMeta._applyContentDensityByPriority();

                //wrapped in setTimeout since "publish" is not async
                setTimeout(() => {
                    // TODO: do not mutate an internal structure (in a Timeout!),
                    // create a new object
                    const oEventData = deepExtend({}, oApplication);
                    delete oEventData.componentHandle;
                    oEventData.appId = sId;
                    oEventData.usageIcon = sIcon;
                    oEventData.usageTitle = sTitle;
                    EventBus.getInstance().publish("sap.ushell", "appClosed", oEventData);
                    Log.info("app was closed");
                }, 0);

                // the former code leaked an *internal* data structure, making it part of a public API
                // restrict hte public api to the minimal set of precise documented properties which can be retained under
                // under future evolutions
                const oPublicEventData = that._publicEventDataFromResolutionResult(oApplication);
                //publish the event externally
                RendererUtils.publishExternalEvent("appClosed", oPublicEventData);
            };
        };

        /**
         * Creates a new object Expose a minimal set of values to public external stakeholders
         * only expose what you can guarantee under any evolution of the unified shell on all platforms
         * @param {object} oApplication an internal result of NavTargetResolutionInternal
         * @returns {object} an object exposing certain information to external stakeholders
         */
        this._publicEventDataFromResolutionResult = function (oApplication) {
            const oPublicEventData = {};
            if (!oApplication) {
                return oApplication;
            }
            ["applicationType", "ui5ComponentName", "url", "additionalInformation", "text"].forEach((sProp) => {
                oPublicEventData[sProp] = oApplication[sProp];
            });
            Object.freeze(oPublicEventData);
            return oPublicEventData;
        };

        /**
         * @param {string} sAppId
         * @param {string} sShellHash
         * @param {boolean} bNavigationFromHome
         * @param {boolean} bNavigationWithInnerAppRoute
         * @returns {object}
         */
        this._getInMemoryInstance = function (sAppId, sShellHash, bNavigationFromHome, bNavigationWithInnerAppRoute) {
            const sStorageAppId = `application-${sAppId}`;
            const oAppEntry = Storage.get(sStorageAppId);

            //remove application from cache if has different parameters
            if (oAppEntry) {
                //Special case - when we're navigating from homepage to an application with state, when keep-alive
                //is active. In this case, although keep alive is active we need to destroy the application
                //ans re-open it.
                const bNavigatingFromHomeWithInnerAppRoute = bNavigationFromHome && bNavigationWithInnerAppRoute;
                // todo: [FLPCOREANDUX-10024] Add logging

                const bSameParameters = oAppEntry.shellHash === sShellHash;
                if (bSameParameters && !bNavigatingFromHomeWithInnerAppRoute) {
                    return {
                        destroyApplication: false,
                        appId: oAppEntry.appId,
                        container: oAppEntry.container
                    };
                }
                return {
                    destroyApplication: true,
                    appId: oAppEntry.appId,
                    container: oAppEntry.container
                };
            }

            return {
                destroyApplication: true,
                appId: undefined,
                container: undefined
            };
        };

        /**
         * @param {boolean} bNewlyCreatedApplicationContainer
         * @param {boolean} bShouldBeCached
         * @param {string} sStorageAppId
         * @param {object} oApplicationContainer
         * @param {object} oResolvedHashFragment
         * @param {string} oParsedShellHash
         * @param {string} sKeepAliveMode
         * @param {boolean} bNavigationInSameStatefulContainer
         * @param {boolean} bReturnedFromKeepAlivePoolFLPV2
         * @returns {Promise} Resolves when the stateful app was opened.
         */ // eslint-disable-next-line max-len
        this._handleOpenStateful = async function (bNewlyCreatedApplicationContainer, bShouldBeCached, sStorageAppId, oApplicationContainer, oResolvedHashFragment, oParsedShellHash, sKeepAliveMode, bNavigationInSameStatefulContainer, bReturnedFromKeepAlivePoolFLPV2) {
            oApplicationContainer.setProperty("iframeReusedForApp", true, true);
            try {
                if (Storage.get(sStorageAppId) && !bNewlyCreatedApplicationContainer && !bReturnedFromKeepAlivePoolFLPV2) {
                    await BlueBoxHandler.statefulRestoreKeepAliveApp(oApplicationContainer, oResolvedHashFragment.url, sStorageAppId, oResolvedHashFragment, bNavigationInSameStatefulContainer);
                } else {
                    const oResult = await BlueBoxHandler.statefulCreateApp(oApplicationContainer, oResolvedHashFragment.url, sStorageAppId, oResolvedHashFragment, bNavigationInSameStatefulContainer);
                    if (oResult?.deletedKeepAliveId) {
                        Storage.removeById(oResult.deletedKeepAliveId);
                    }

                    //creating a new application check if needs to be keep (for the keep alive), and if so store the application
                    if (bShouldBeCached && !Storage.get(sStorageAppId)) {
                        this._storeApp(sStorageAppId, oApplicationContainer, oResolvedHashFragment, oParsedShellHash, sKeepAliveMode);
                    }
                }

                Application.setActiveAppContainer(oApplicationContainer);

                Log.info("New application context opened successfully in an existing transaction UI session.");
            } catch (vError) {
                Log.error(vError?.message || vError);
                // do not bubble up the error
            }
        };

        this._isFullWidth = function (oResolvedHashFragment) {
            let bFullWidth;
            const sAppType = this._calculateAppType(oResolvedHashFragment);
            const bDefaultFullWidth = ApplicationType.getDefaultFullWidthSetting(sAppType);

            const bFullWidthCapability = oResolvedHashFragment.appCapabilities?.fullWidth;
            const oMetadata = AppConfiguration.getMetadata(oResolvedHashFragment);
            //Here there's a double check for the fullwidth - once as a type of boolean and one as a string.
            //This is because we found that developers configured this variable in the manifest also as a string,
            //so the checks of the oMetadata and the oResolvedHashFragment are to avoid regression with the use of this field.
            if (bDefaultFullWidth) {
                if (oResolvedHashFragment.fullWidth === false || oResolvedHashFragment.fullWidth === "false" ||
                    oMetadata.fullWidth === false || oMetadata.fullWidth === "false" || bFullWidthCapability === false) {
                    bFullWidth = false;
                }
            } else if (oResolvedHashFragment.fullWidth || oResolvedHashFragment.fullWidth === "true" ||
                oMetadata.fullWidth || oMetadata.fullWidth === "true") {
                bFullWidth = true;
            }

            if (bFullWidth === undefined) {
                bFullWidth = bDefaultFullWidth;
            }
            return bFullWidth;
        };

        /**
         * formerly known as "handleControl"
         * @param {string} sAppId
         * @param {object} oParsedShellHash
         * @param {object} oResolvedHashFragment
         * @param {string} sOldShellHash
         * @param {boolean} bNavigationFromHome
         * @returns {Promise} Resolves when the control is handled
         */
        this.handleCreateApplicationContainer = async function (sAppId, oParsedShellHash, oResolvedHashFragment, sOldShellHash, bNavigationFromHome) {
            let bReturnedFromKeepAlivePoolFLPV2 = false;
            let bReturnedFromKeepAlivePoolGuiV1 = false;
            const sStorageAppId = `application-${sAppId}`;
            let bNewlyCreatedApplicationContainer = false;
            let bNavigationInSameStatefulContainer = false;
            let oApplicationContainer,
                bReuseStatefulContainer,
                oTargetAppContainer,
                iLastValidTimeDelta,
                bKeptAliveApp,
                oCachedEntry;

            //get the potential target stateful container and check if it's valid. if not, destroy it
            //before we try to create the new application
            oTargetAppContainer = BlueBoxHandler.getBlueBoxByUrl(oResolvedHashFragment.url);
            // todo: [FLPCOREANDUX-10024] DELETES iframe
            if (BlueBoxHandler.isStatefulContainer(oTargetAppContainer)) {
                iLastValidTimeDelta = new Date().getTime() - oTargetAppContainer.getIsIframeValidTime().time;
                if ((BlueBoxHandler.isIframeIsValidSupported(oTargetAppContainer) && iLastValidTimeDelta >= 3500) ||
                    oTargetAppContainer.getIsInvalidIframe()) {
                    const sReason = oTargetAppContainer.getIsInvalidIframe() ? `iframe did not ping in the last '${iLastValidTimeDelta}' ms` : "iframe is in invalid state";
                    Log.warning(
                        `Destroying stateful container iframe due to unresponsiveness (${oTargetAppContainer.getId()})`,
                        `reason: ${sReason}`,
                        "sap.ushell.components.applicationIntegration.AppLifeCycle"
                    );

                    // todo: [FLPCOREANDUX-10024] this destroy/remove can be simplified
                    BlueBoxHandler.removeCapabilities(oTargetAppContainer);
                    await this._destroyApplication(sStorageAppId, oTargetAppContainer);
                    BlueBoxHandler.deleteBlueBoxByUrl(oResolvedHashFragment.url);
                    oTargetAppContainer = undefined;
                    //in this case we do not care about the old application intent as it is currently relevant only when
                    //trying to open app in the same current stateful container
                    sOldShellHash = undefined;
                }
            }

            //we will close the application we are leaving when:
            // 1. the application is running in a stateful container
            // 2. this is a legacy keep alive app, and we navigate back (this in order to return the container to the pool
            //    of containers to it can be used again for the upcoming opened app)
            // todo: [FLPCOREANDUX-10024] DELETES more iframe
            if (!bNavigationFromHome) {
                const oCurrentAppContainer = this.getCurrentApplication()?.container;
                bReuseStatefulContainer = BlueBoxHandler.isStatefulContainer(oCurrentAppContainer);
                // todo [FLPCOREANDUX-10024] why is id required here?
                const bSourceIsKeepAliveFromPool = oCurrentAppContainer && !!oCurrentAppContainer.getCurrentAppId() && BlueBoxHandler.isStatefulContainerInKeepAlivePool(oCurrentAppContainer);
                if (bReuseStatefulContainer || bSourceIsKeepAliveFromPool) {
                    await this._handleExitApplication(oCurrentAppContainer, false, false);
                    if (oCurrentAppContainer === oTargetAppContainer) {
                        bNavigationInSameStatefulContainer = true;
                    }
                }
            }

            //now, we can open the new application
            const sKeepAliveMode = this._calculateKeepAliveMode(sStorageAppId, oResolvedHashFragment, oParsedShellHash);
            const bShouldBeCached = !!sKeepAliveMode;

            oApplicationContainer = BlueBoxHandler.getBlueBoxByUrl(oResolvedHashFragment.url);
            bReuseStatefulContainer = BlueBoxHandler.isStatefulContainer(oApplicationContainer);
            // todo: [FLPCOREANDUX-10024] GETTER of innerControl for keep alive / stateful
            if (!bReuseStatefulContainer) {
                // only clear oApplicationContainer in case it is not a navigation from an application to the same application
                if (oCurrentApplication && sStorageAppId !== oCurrentApplication.appId) {
                    oApplicationContainer = undefined;
                }

                oCachedEntry = Storage.get(sStorageAppId);
                oApplicationContainer = oCachedEntry?.container;

                if (oApplicationContainer && bShouldBeCached) {
                    bKeptAliveApp = true;
                }
            }

            // todo: [FLPCOREANDUX-10024] CREATE / SETTER of currentApplication
            if (bReuseStatefulContainer) {
                if (!oApplicationContainer) {
                    oApplicationContainer = await this._createApplicationContainer(sAppId, oParsedShellHash, oResolvedHashFragment);

                    // todo: [FLPCOREANDUX-10024] the following should be obsolete
                    const oStorageEntry = Storage.get(oApplicationContainer.getId());
                    if (oStorageEntry) {
                        oCurrentApplication = oStorageEntry;
                    }

                    bNewlyCreatedApplicationContainer = true;
                }
            } else if (oApplicationContainer && !bShouldBeCached && BlueBoxHandler.getStatefulContainerType(oResolvedHashFragment.url, true) !== BlueBoxHandler.STATEFUL_TYPES.GUI_V1) {
                //this case this controller can't be reused and we need it to be embed, so delete it.
                await this._destroyApplication(oApplicationContainer.getId(), oApplicationContainer);

                // The immediately following method call internally calls
                // `this.oViewPortContainer.addCenterViewPort(oApplicationContainer)`
                // when Gui V1 Stateful Container is true, and in that case
                // `oApplicationContainer` will be the component control of an existing session.
                oApplicationContainer = await this._createApplicationContainer(sAppId, oParsedShellHash, oResolvedHashFragment);
            } else if (!oApplicationContainer) {
                // The immediately following method call internally calls
                // `this.oViewPortContainer.addCenterViewPort(oApplicationContainer)`
                // when Gui V1 Stateful Container is true, and in that case
                // `oApplicationContainer` will be the component control of an existing session.
                oApplicationContainer = await this._createApplicationContainer(sAppId, oParsedShellHash, oResolvedHashFragment);

                //if we got an iframe from cache, simulate stateful container
                //open that should happen later here
                if (oApplicationContainer.getIsFetchedFromCache()) {
                    if (oApplicationContainer.getStatefulType() === BlueBoxHandler.STATEFUL_TYPES.GUI_V1_KEEP_ALIVE) {
                        bReturnedFromKeepAlivePoolGuiV1 = true;
                    } else {
                        bReuseStatefulContainer = true;
                        bReturnedFromKeepAlivePoolFLPV2 = true;
                    }
                }
            }

            // todo: [FLPCOREANDUX-10024] rework empty applicationContainer case
            // fallback?

            await ushellUtils.promisify(oApplicationContainer.getDeffedControlCreation());

            //here, we simply show (turning to visible) the container of the new opened application in case it is not stateful container
            //and not old gui v1 stateful
            if (oApplicationContainer.getStatefulType() !== BlueBoxHandler.STATEFUL_TYPES.GUI_V1 && !bReuseStatefulContainer) {
                if (bKeptAliveApp) {
                    EventBus.getInstance().publish("launchpad", "appOpening", oResolvedHashFragment);
                }
                const oStorageEntry = Storage.get(oApplicationContainer.getId());
                if (oStorageEntry) {
                    oCurrentApplication = oStorageEntry;
                }

                if (bKeptAliveApp) {
                    EventBus.getInstance().publish("sap.ushell", "appOpened", oResolvedHashFragment);
                }
            }

            // Assuming a previously existing TR container existed and is now
            // going to be reused, we prompt the container to load the new application context.

            //  SAP GUI is sending post messages for back navigation as soon the create application event is sent to the iframe,
            // so this makes sure the container is active before sending the event.
            // For WD applications, the application is active only after the application is created.
            // So it is not navigated twice.
            if (oApplicationContainer.getApplicationType() === ApplicationType.TR.type) {
                this._activeContainer(oApplicationContainer);
            }

            const oStorageEntry = Storage.get(sStorageAppId);
            if (oStorageEntry) {
                AppInfoParameters.restore(oStorageEntry);
            } else {
                AppInfoParameters.flush();
            }


            //here, we create the application in case this is a stateful container (meaning, using the existing iframe)
            if (bReuseStatefulContainer) {
                //for scube - make sure the container is active before we open the app
                //to allow post messages form the iframe to flp that are sent
                //as part of the target resolution process
                if (oResolvedHashFragment.appCapabilities?.appFrameworkId === "UI5") {
                    oApplicationContainer.setProperty("active", true, true);
                }
                // eslint-disable-next-line max-len
                await this._handleOpenStateful(bNewlyCreatedApplicationContainer, bShouldBeCached, sStorageAppId, oApplicationContainer, oResolvedHashFragment, oParsedShellHash, sKeepAliveMode, bNavigationInSameStatefulContainer, bReturnedFromKeepAlivePoolFLPV2);

            } else if (oApplicationContainer.getStatefulType() === BlueBoxHandler.STATEFUL_TYPES.GUI_V1 || bReturnedFromKeepAlivePoolGuiV1) {
                //here, we create the application in case this is old gui v1 stateful
                await WebGUIStatefulHandler.guiStatefulCreateApp(this, oApplicationContainer, oResolvedHashFragment);
            }

            //for case of stateful container or gui v1 stateful, show the application view (make it visible)
            ushellUtils.setPerformanceMark("FLP -- centerViewPort");
            if (oApplicationContainer.getApplicationType() !== ApplicationType.TR.type) {
                // Activate container before showing it (start reacting to postMessage calls)
                this._activeContainer(oApplicationContainer);
            }

            /*
             * Workaround:
             * The oCurrentApplication object does not reflect the currently opened application.
             * This leads to store/restore calls on the wrong application.
             * Create application that is not persisted and not cashed as a fallback.
             *
             * This issue occurs for iframe applications reusing the iframe.
             */
            if (oCurrentApplication.appId !== sStorageAppId) {
                oCurrentApplication = {
                    appId: sStorageAppId,
                    stt: "loading",
                    container: oApplicationContainer,
                    meta: AppConfiguration.getMetadata(oResolvedHashFragment),
                    app: undefined
                };
            }
        };

        /**
         */
        this.navToCurrentApp = function () {
            const oApplicationContainer = this.getCurrentApplication().container;
            // todo: [FLPCOREANDUX-10024] maybe switch to 'this.getCurrentApplication().appId' instead
            this._navTo(oApplicationContainer.getId());

            // todo: [FLPCOREANDUX-10024]
            // - Move styles into control? or at least out of here
            // - Is this even needed? This doesn't seem to trigger the onAfterNavigate as indicated by the following comment.
            //Added this because in cases when navigating to the same id (can happen when stateful container, I need the on onAfterNavigate)
            //This must only be done after the _navTo as the ViewPortContainer's navTo function relies on the state of those classes.
            if (oApplicationContainer.hasStyleClass("sapUShellApplicationContainerShiftedIframe")) {
                oApplicationContainer.toggleStyleClass("sapUShellApplicationContainerIframeHidden", false);
            } else {
                oApplicationContainer.toggleStyleClass("hidden", false);
            }
        };

        /**
         * New app was created and we now have to switch the state
         * @param {string} sLaunchpadState
         * @param {string} sAppId
         * @param {string} sAppType
         * @param {boolean} bIsExplaceNavigation
         */
        this.switchViewState = function (sLaunchpadState, sAppId, sAppType, bIsExplaceNavigation) {
            // Store state before creating a new one
            const oFromStorageEntry = Storage.get(oCurrentApplication.appId);
            if (!oFromStorageEntry) {
                // We have to destroy managed queue BEFORE we're applying the pending changes
                StateManager.destroyManagedControls();
            }

            const sShellMode = StateManager.getShellMode();
            // GUI Applications need a back button to work properly
            const oShellModeOverrides = {
                TR: {
                    headerless: ShellMode.Minimal
                }
            };

            let sShellModeOverride;
            if (!bIsExplaceNavigation) {
                sShellModeOverride = oShellModeOverrides[sAppType]?.[sShellMode];
            }
            StateManager.switchState(sLaunchpadState, sShellModeOverride);

            // Restore state if it already exists
            const sToStorageAppId = `application-${sAppId}`;
            const oToStorageEntry = Storage.get(sToStorageAppId);
            if (oToStorageEntry) {
                KeepAlive.restore(oToStorageEntry);
            } else {
                KeepAlive.flush();
            }

            //Process Dangling UI elements and continue.
            StateManager.applyStalledChanges();
        };

        /**
         * @param {object} oCommunicationHandler
         */
        this.registerShellCommunicationHandler = function (oCommunicationHandler) {
            Application.registerShellCommunicationHandler(oCommunicationHandler);
        };

        /**
         * @returns {boolean} Whether the floating container is docked.
         */
        this._isFloatingContainerDocked = function () {
            const bDocked = ShellModel.getModel().getProperty("/floatingContainer/state").includes("docked");
            const bVisible = ShellModel.getModel().getProperty("/floatingContainer/visible");
            return bDocked && bVisible;
        };

        /**
         */
        this._sendFocusBackToShell = function () {
            if (!Device.system.desktop) {
                return;
            }

            sap.ui.require(["sap/ushell/renderer/AccessKeysHandler"], (AccessKeysHandler) => {
                const sCurrentLaunchpadState = StateManager.getLaunchpadState();
                const bDefaultShellMode = StateManager.getShellMode() === ShellMode.Default;
                const oShellAppTitle = Element.getElementById("shellAppTitle");

                if (oShellAppTitle && sCurrentLaunchpadState === LaunchpadState.App && bDefaultShellMode) {
                    const oShellAppTitleDomRef = oShellAppTitle.getFocusDomRef();
                    if (oShellAppTitleDomRef) {
                        AccessKeysHandler.sendFocusBackToShell(oShellAppTitleDomRef.getAttribute("id"));
                    }
                }
            });
        };

        /**
         * @param {object} oResolvedHashFragment
         */
        this._announceAppOpening = function (oResolvedHashFragment) {
            //Screen reader: "Loading Complete"
            window.setTimeout(() => {
                window.setTimeout(() => {
                    const oAccessibilityHelperLoadingComplete = document.getElementById("sapUshellLoadingAccessibilityHelper-loadingComplete");

                    if (oAccessibilityHelperLoadingComplete) {
                        oAccessibilityHelperLoadingComplete.setAttribute("aria-live", "polite");
                        oAccessibilityHelperLoadingComplete.innerHTML = ushellResources.i18n.getText("loadingComplete");
                        window.setTimeout(() => {
                            oAccessibilityHelperLoadingComplete.setAttribute("aria-live", "off");
                            oAccessibilityHelperLoadingComplete.innerHTML = "";
                        }, 0);
                    }
                }, 600);

                EventBus.getInstance().publish("launchpad", "appOpening", oResolvedHashFragment);
                Log.info("app is being opened");
            }, 0);
        };

        /**
         * @param {string} sAppId
         * @param {object} oParsedShellHash
         * @param {object} oResolvedHashFragment
         * @param {string} sShellHash
         * @returns {object} The app container.
         */
        this._createApplicationContainer = async function (sAppId, oParsedShellHash, oResolvedHashFragment) {
            const oMetadata = AppConfiguration.getMetadata(oResolvedHashFragment, oResolvedHashFragment?.sFixedShellHash);
            const bFullWidth = this._isFullWidth(oResolvedHashFragment);

            /*
             * The external navigation mode in the resolution result is calculated
             * statically, and indicates a future state. It currently answers the
             * question: "is the application going to be opened explace?".
             *
             * The target navigation mode, instead, answers the question: "was
             * the application opened explace?".
             *
             * We need to have this logic, because embedded applications do not
             * check the coldstart condition.
             */
            oResolvedHashFragment.targetNavigationMode = ushellUtils.isColdStart() ? "explace" : "inplace";
            oResolvedHashFragment.shellUIService = oGlobalShellUIService.getInterface();

            // send focus back to shell for new ApplicationContainers
            this._sendFocusBackToShell();

            this._announceAppOpening(oResolvedHashFragment);

            await this._openApp(sAppId, oResolvedHashFragment, oParsedShellHash);
            const oApplicationContainer = oCurrentApplication.container;

            const bContainerFromCachePool = oApplicationContainer.getIsFetchedFromCache();

            if (!bContainerFromCachePool) {
                this._publishNavigationStateEvents(oApplicationContainer, oResolvedHashFragment, this.onAppAfterRendering.bind(this, oResolvedHashFragment));

                if (ushellUtils.isSAPLegacyApplicationType(oApplicationContainer.getApplicationType(), oApplicationContainer.getFrameworkId())) {
                    oApplicationContainer.addStyleClass("sapUShellApplicationContainerShiftedIframe");
                }

                if (!bFullWidth) {
                    oApplicationContainer.addStyleClass("sapUShellApplicationContainerLimitedWidth");
                }

                // todo: [FLPCOREANDUX-10024] clarify whether this should be reactive instead of one time only
                // todo: [FLPCOREANDUX-10024] move this block to ShellController
                if (this._isFloatingContainerDocked() && window.matchMedia("(min-width: 106.4rem)").matches) {
                    oApplicationContainer.addStyleClass("sapUShellDockingContainer");
                    oApplicationContainer.removeStyleClass("sapUShellApplicationContainerLimitedWidth");
                } else if (this._isFloatingContainerDocked()) {
                    oApplicationContainer.removeStyleClass("sapUShellApplicationContainerLimitedWidth");
                }

                oApplicationContainer.toggleStyleClass("sapUshellDefaultBackground", !oMetadata.hideLightBackground);

                AppMeta._applyContentDensityByPriority();

                // Add inner control for next request
                this._addApplicationContainerToViewPort(oApplicationContainer);
            }

            ushellUtils.setPerformanceMark("FLP - addAppContainer");

            return oApplicationContainer;
        };

        /**
         * @param {string} sShellHash
         * @param {object} oResolvedHashFragment
         * @param {boolean} bNavigationFromHome
         * @param {boolean} bNavigationWithInnerAppRoute
         */
        this.handleBeforeCreateApp = async function (sShellHash, oResolvedHashFragment, bNavigationFromHome, bNavigationWithInnerAppRoute) {
            const sIntent = UrlParsing.getBasicHash(sShellHash);
            const bComponentLoaded = !!oResolvedHashFragment?.componentHandle;
            // for SAPUI5 apps, the application type is still "URL" due to backwards compatibility, but the
            // NavTargetResolutionInternal service already extracts the component name, so this can directly be used as indicator
            const sTargetUi5ComponentName = oResolvedHashFragment?.ui5ComponentName;

            // handle special case when navigating from home to an application with state, when keep-alive is active
            const oInMemoryApplicationInstance = this._getInMemoryInstance(sIntent, sShellHash, bNavigationFromHome, bNavigationWithInnerAppRoute);

            if (!oInMemoryApplicationInstance.destroyApplication) {
                // no destroy required

            } else if (bComponentLoaded || !sTargetUi5ComponentName) { // non UI5 Application
                if ((
                    oResolvedHashFragment.applicationType === "URL"
                    || ushellUtils.isSAPLegacyApplicationType(oResolvedHashFragment.applicationType)
                )
                    && oInMemoryApplicationInstance.destroyApplication
                    && oInMemoryApplicationInstance.appId
                ) {
                    await this._destroyApplication(oInMemoryApplicationInstance.appId, oInMemoryApplicationInstance.container);
                }

            } else { // UI5 Application
                await this._destroyApplication(oInMemoryApplicationInstance.appId, oInMemoryApplicationInstance.container);
                const oApplicationContainer = this._getApplicationContainerFromViewPort(sIntent);

                if (oApplicationContainer) {
                    this._removeApplicationContainerFromViewPort(oApplicationContainer.getId());
                    oApplicationContainer.destroy();
                }

                // close all keep alive apps with the same component name
                await this._closeKeepAliveApps((oStorageEntry) => oStorageEntry.ui5ComponentName === oResolvedHashFragment.ui5ComponentName);
            }
        };

        /**
         * @param {string} sShellHash
         * @param {object} oParsedShellHash
         * @param {object} oResolvedHashFragment
         * @param {boolean} bNavigationFromHome
         * @param {boolean} bNavigationWithInnerAppRoute
         */
        this.handleCreateApp = async function (sShellHash, oParsedShellHash, oResolvedHashFragment, bNavigationFromHome, bNavigationWithInnerAppRoute) {
            const sIntent = UrlParsing.getBasicHash(sShellHash);
            const bComponentLoaded = !!oResolvedHashFragment?.componentHandle;
            // for SAPUI5 apps, the application type is still "URL" due to backwards compatibility, but the
            // NavTargetResolutionInternal service already extracts the component name, so this can directly be used as indicator
            const sTargetUi5ComponentName = oResolvedHashFragment?.ui5ComponentName;
            const bIsUI5App = !!sTargetUi5ComponentName;
            const oInMemoryApplicationInstance = this._getInMemoryInstance(sIntent, sShellHash, bNavigationFromHome, bNavigationWithInnerAppRoute);

            // todo: [FLPCOREANDUX-10024] checking on the destroyApplication flag is odd at this point
            if (bIsUI5App && !bComponentLoaded && oInMemoryApplicationInstance.destroyApplication) { // UI5 Application
                AppConfiguration.setApplicationInInitMode();

                /*
                * normal application:
                * fire the _prior.newUI5ComponentInstantion event before creating the new component instance, so that
                * the ApplicationContainer can stop the router of the current app (avoid inner-app hash change notifications)
                * NOTE: this dependency to the ApplicationContainer is not nice, but we need a fast fix now; we should refactor
                * the ApplicationContainer code, because most of the logic has to be done by the shell controller;
                * maybe rather introduce a utility module
                */
                EventBus.getInstance().publish("ApplicationContainer", "_prior.newUI5ComponentInstantion",
                    { name: sTargetUi5ComponentName }
                );

                // load ui5 component via shell service; core-ext-light will be loaded as part of the asyncHints
                await Container.getServiceAsync("Ui5ComponentLoader");

                /*
                 * FIXME: It would be better to call a function that simply
                 * and intentionally loads the dependencies of the UI5
                 * application, rather than creating a component and expecting
                 * the dependencies to be loaded as a side effect.
                 * Moreover, the comment reads "load ui5 component via shell service"
                 * however that is 'not needed' since the loaded component
                 * is not used. We should evaluate the possible performance
                 * hit taken due to this implicit means to an end.
                 */

                /*
                 * return value is unused.
                 * This is because oResolvedHashFragment contains the component handle already.
                 * See the preceding note in AppLifeCycle.createComponent.
                 */
                await Application.createComponent(oResolvedHashFragment, oParsedShellHash);
            }
        };

        /**
         *
         * @param {sap.ui.core.Component} oApplication
         */
        this.onAppAfterRendering = function (oApplication) {
            // wrapped in setTimeout since "publish" is not async
            window.setTimeout(() => {
                EventBus.getInstance().publish("sap.ushell", "appOpened", oApplication);
                Log.info("app was opened");
            }, 0);

            // publish the event externally
            // TODO: cloned, frozen object!
            const oAppOpenedEventData = this._publicEventDataFromResolutionResult(oApplication);

            // Event is emitted internally (EventHub) _and_ externally (for compatibility reasons)
            EventHub.emit("AppRendered", oAppOpenedEventData, true);
            RendererUtils.publishExternalEvent("appOpened", oAppOpenedEventData);
            ushellUtils.setPerformanceMark("FLP.appOpened");

            const sIcon = AppMeta.getAppIcon();
            StateManager.updateCurrentState("application.icon", Operation.Set, sIcon);
        };

        /**
         * Only for testing
         * @param {sap.ui.core.Control} oNewViewPortContainer
         *
         * @private
         */
        this.setViewPortContainer = function (oNewViewPortContainer) {
            oViewPortContainer = oNewViewPortContainer;
        };
    }

    return new AppLifeCycle();
}, /* bExport= */ true);
