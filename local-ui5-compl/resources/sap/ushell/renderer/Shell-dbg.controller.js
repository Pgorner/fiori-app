// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview Shell Controller
 */
sap.ui.define([
    "sap/ushell/renderer/History",
    "sap/base/Log",
    "sap/base/util/extend",
    "sap/base/util/isPlainObject",
    "sap/m/InstanceManager",
    "sap/ui/core/Component",
    "sap/ui/core/Element",
    "sap/ui/core/EventBus",
    "sap/ui/core/library",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/HashChanger",
    "sap/ui/core/routing/History",
    "sap/ui/Device",
    "sap/ui/performance/trace/Interaction",
    "sap/ui/thirdparty/hasher",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/bootstrap/SchedulingAgent",
    "sap/ushell/components/applicationIntegration/AppLifeCycle",
    "sap/ushell/components/applicationIntegration/relatedServices/RelatedServices",
    "sap/ushell/Config",
    "sap/ushell/EventHub",
    "sap/ushell/library",
    "sap/ushell/performance/FesrEnhancer",
    "sap/ushell/renderer/LogonFrameProvider",
    "sap/ushell/resources",
    "sap/ushell/services/AppConfiguration",
    "sap/ushell/utils",
    "sap/ushell/utils/UrlParsing",
    "sap/ushell/utils/WindowUtils",
    "sap/ushell/renderer/ShellLayout",
    "sap/ushell/renderer/utils",
    "sap/base/util/ObjectPath",
    "sap/ushell/Container",
    "sap/ushell/state/ShellModel",
    "sap/ushell/state/StateManager",
    "sap/ushell/renderers/fiori2/LogonFrameProvider", // restore deprecated globals
    "sap/ushell/renderers/fiori2/History", // restore deprecated globals
    "sap/ushell/components/applicationIntegration/configuration/AppMeta",
    "sap/ushell/ui5service/ShellUIServiceFactory"
], (
    History,
    Log,
    extend,
    isPlainObject,
    InstanceManager,
    Component,
    Element,
    EventBus,
    library,
    Controller,
    HashChanger,
    Ui5History,
    Device,
    Interaction,
    hasher,
    jQuery,
    SchedulingAgent,
    AppLifeCycleAI,
    RelatedServices,
    Config,
    EventHub,
    ushellLibrary,
    FesrEnhancer,
    LogonFrameProvider,
    ushellResources,
    AppConfiguration,
    ushellUtils,
    UrlParsing,
    WindowUtils,
    ShellLayout,
    RendererUtils,
    ObjectPath,
    Container,
    ShellModel,
    StateManager,
    DeprecatedLogonFrameProvider, // restore deprecated globals
    DeprecatedHistory, // restore deprecated globals
    AppMeta,
    ShellUIServiceFactory
) => {
    "use strict";

    // shortcut for sap.ushell.renderer.ShellLayout.ShellArea
    const ShellArea = ShellLayout.ShellArea;

    // shortcut for sap.ui.core.routing.HistoryDirection
    const Ui5HistoryDirection = library.routing.HistoryDirection;

    // shortcut for sap.ushell.AppType
    const AppType = ushellLibrary.AppType;

    // shortcut for sap.ushell.state.StateManager.LaunchpadState
    const LaunchpadState = StateManager.LaunchpadState;

    // shortcut for sap.ushell.state.StateManager.Operation
    const Operation = StateManager.Operation;

    // shortcut for sap.ushell.state.StateManager.ShellMode
    const ShellMode = StateManager.ShellMode;
    const {
        Standalone,
        Embedded,
        Minimal
    } = ShellMode;

    /* don't delay these cause they are needed for direct bookmarks */

    // create global model and add some demo data
    let closeAllDialogs = true;
    let bPreviousPageDirty = false;
    const oEPCMNavigationMode = {
        embedded: 0,
        newWindowThenEmbedded: 1,
        newWindow: 1,
        replace: 0
    };
    const NavigationMode = {
        embedded: "embedded",
        newWindowThenEmbedded: "newWindowThenEmbedded",
        newWindow: "newWindow",
        replace: "replace"
    };
    let oConfig = {};

    // track performance marks and enhance UI5's Frontend Sub Records with FLP specific information
    // Note: This can not yet be done using the SchedulingAgent as plain modules cannot be loaded and
    // making it a UI5 component would be overhead (performance).
    FesrEnhancer.init();

    const sModuleName = "Shell.controller";
    const sLogFesrPrefix = "[FesrFlp]";

    /**
     * @alias sap.ushell.renderer.Shell
     * @class
     * @extends sap.ui.core.mvc.Controller
     * @private
     */
    return Controller.extend("sap.ushell.renderer.Shell", /** @lends sap.ushell.renderer.Shell.prototype */ {
        _aDoables: [],

        addDoable: function (oDoable) {
            this._aDoables.push(oDoable);
        },

        _aDanglingControls: [],

        /**
         * @param {sap.ui.core.Control} oControl The Control
         * @see #onExit
         *
         * @private
         * @since 1.115.0
         */
        addDanglingControl: function (oControl) {
            this._aDanglingControls.push(oControl);
        },

        _aDanglingBindings: [],

        /**
         * Adds a binding which is destroyed on Renderer destroy
         * @param {sap.ui.model.Binding} oBinding The Binding
         * @see #onExit
         *
         * @private
         * @since 1.115.0
         */
        addDanglingBinding: function (oBinding) {
            this._aDanglingBindings.push(oBinding);
        },

        /**
         * @param {sap.ui.model.Binding} oTargetBinding The Binding
         * @see #onExit
         *
         * @private
         * @since 1.115.0
         */
        removeDanglingBinding: function (oTargetBinding) {
            const iBindingIndex = this._aDanglingBindings.findIndex((oBinding) => {
                return oBinding === oTargetBinding;
            });

            if (iBindingIndex > -1) {
                this._aDanglingBindings.splice(iBindingIndex, 1);
            }
        },

        _aPendingInitializations: [],

        /**
         * Adds a promise to the list of initializations
         * Only used in test environments!
         * @param {Promise} oPromise A Promise
         * @returns {Promise} Returns the provided promise to allow chaining
         *
         * @private
         * @since 1.115.0
         */
        addPendingInitialization: function (oPromise) {
            this._aPendingInitializations.push(oPromise);
            return oPromise;
        },

        /**
         * Only used in test environments!
         * @returns {Promise} Resolves once all initializations have settled
         *
         * @private
         * @since 1.115.0
         */
        awaitPendingInitializations: function () {
            const iOldLength = this._aPendingInitializations.length;
            return Promise.allSettled(this._aPendingInitializations)
                .then(() => {
                    const iNewLength = this._aPendingInitializations.length;
                    if (iOldLength < iNewLength) {
                        return this.awaitPendingInitializations();
                    }
                });
        },

        onComponentTargetDisplay: function (oEvent) {
            const oParameters = oEvent.getParameters();
            const oContainer = oParameters.control;
            const oComponentContainer = oParameters.object;

            if (this.bRestorePreviousHash) {
                this.bRestorePreviousHash = false;
            }

            oContainer.navTo("centerViewPort", oComponentContainer.getId(), "show");
        },

        onInit: function () {
            const oRouter = Component.getOwnerComponentFor(this.getView()).getRouter();

            // TODO We still need to think about implementing a custom router to move the display handler from
            // this file to the custom router. Maybe use oRouter.attachBypassed?
            oRouter.getTarget("home").attachDisplay(this.onComponentTargetDisplay, this);
            oRouter.getTarget("appfinder").attachDisplay(this.onComponentTargetDisplay, this);
            oRouter.getTarget("contentfinder").attachDisplay(this.onComponentTargetDisplay, this);
            oRouter.getTarget("pages").attachDisplay(this.onComponentTargetDisplay, this);
            oRouter.getTarget("workpages").attachDisplay(this.onComponentTargetDisplay, this);
            oRouter.getTarget("runtimeSwitcher").attachDisplay(this.onComponentTargetDisplay, this);
            oRouter.getTarget("wzsearch").attachDisplay(this.onComponentTargetDisplay, this);

            if (Config.last("/core/homeApp/enabled")) {
                oRouter.getTarget("homeapp").attachDisplay(this.onComponentTargetDisplay, this);
            }

            /*
             * Assign hash changer directly because otherwise a default one is used.
             *
             * Default hash changers for UI5 routers assume &/ is the separator for a nested component route.
             *
             * We must re-assign this otherwise an hash like `#Shell-appfinder&/userMenu' ends up in `#Shell-appfinder&/'
             * in the URL - &/userMenu part is eaten by the default hash changer.
             */
            oRouter.oHashChanger = HashChanger.getInstance();
            oRouter.initialize(true /*tell the router not to parse the current browser hash, and wait for ShellNavigationInternal.init*/);

            this.bEnableHashChange = true;
            closeAllDialogs = true;
            const oView = this.getView();
            const oViewData = oView.getViewData() || {};
            const mediaQ = window.matchMedia("(min-width: 600px)");
            const oViewConfig = oViewData.config || {};

            // Add global model to view
            oView.setModel(this._getConfigModel(), "configModel");
            oView.setModel(ShellModel.getModel(), "shellModel");
            this._bindTabTitle();

            Config.emit("/core/shell/model/personalization", Config.last("/core/shell/enablePersonalization"));

            function handleMedia (mq) {
                Config.emit("/core/shell/model/isPhoneWidth", !mq.matches);
            }
            if (mediaQ.addListener) { // Assure that mediaMatch is supported(Not supported on IE9).
                mediaQ.addListener(handleMedia);
                handleMedia(mediaQ);
            }

            // Bind the translation model to this view
            oView.setModel(ushellResources.i18nModel, "i18n");

            EventBus.getInstance().subscribe("externalSearch", this.externalSearchTriggered, this);
            EventBus.getInstance().subscribe("sap.ushell", "appOpened", this.onAppOpened, this);
            EventBus.getInstance().subscribe("ESHSearchFinished", this._logSearchActivity, this);
            // handling of configuration should be done before the code block below otherwise the doHashChange is
            // triggered before the personalization flag is disabled (URL may contain hash value which invokes navigation)
            this._setConfigurationToModel();

            // Doable objects are kept in a global array to enable their off-ing later on.
            this._registerAndCreateEventHubDoables();
            ShellUIServiceFactory.attachBackNavigationChanged(this._onBackNavigationChanged, this);

            this.history = History;
            this.oViewPortContainer = Element.getElementById("viewPortContainer");
            AppLifeCycleAI.init(this.oViewPortContainer, oViewConfig.disableHomeAppCache);

            // init Shell Navigation
            Promise.all([
                Container.getServiceAsync("ShellNavigationInternal"),
                Container.getServiceAsync("AppLifeCycle")
            ])
                .then((aServices) => {
                    const oShellNavigationInternal = aServices[0];
                    this._oAppLifeCycleService = aServices[1];

                    this._initShellNavigationInternal(oShellNavigationInternal, this._oAppLifeCycleService, oRouter);
                });

            Container.setLogonFrameProvider(this._getLogonFrameProvider());

            if (Device.system.desktop) {
                sap.ui.require(["sap/ushell/renderer/AccessKeysHandler"], (AccessKeysHandler) => {
                    AccessKeysHandler.init();
                });
            }

            window.onbeforeunload = function () {
                if (Container && Container.getDirtyFlag()
                    // workaround: skip data-loss-warning in IE when app is NWBC-based (as there is a separate implementation)
                    && !(Device.browser.name === Device.browser.BROWSER.INTERNET_EXPLORER
                        && AppLifeCycleAI.getCurrentApplication().container.getApplicationType() === "NWBC")
                ) {
                    if (!ushellResources.browserI18n) {
                        ushellResources.browserI18n = ushellResources.getTranslationModel(window.navigator.language).getResourceBundle();
                    }
                    return ushellResources.browserI18n.getText("dataLossExternalMessage");
                }

                return;
            };

            if (Config.last("/core/shell/model/contentDensity")) {
                // do not call _applyContentDensity,
                // no promise that the component-preload is fully loaded and _applyContentDensity loads the root application.
                // we only want to display the shell in its default state, once the root application will be loaded
                // then the _applyContentDensity will be called with promise that component-preload loaded.
                AppMeta._applyContentDensityClass();
            }

            if (oConfig.enableOnlineStatus) {
                sap.ui.require(["sap/ushell/ui5service/UserStatus"], (UserStatus) => {
                    this.oUserStatus = new UserStatus({
                        scopeObject: this.getOwnerComponent(),
                        scopeType: "component"
                    });
                });
            }

            if (!oViewConfig.disableSignOut && (oViewConfig.sessionTimeoutTileStopRefreshIntervalInMinutes > 0 || oViewConfig.sessionTimeoutReminderInMinutes > 0)) {
                this._createSessionHandler(oViewConfig);
            }

            if (Device.system.desktop) {
                sap.ui.require(["sap/ushell/renderer/AccessKeysHandler"], (AccessKeysHandler) => {
                    oView.waitForShellLayout().then(() => {
                        const oNavigationBar = document.getElementById(ShellArea.NavigationBar);
                        oNavigationBar.addEventListener("focusin", () => {
                            // focus not in the shell
                            AccessKeysHandler.bFocusOnShell = false;
                            AccessKeysHandler.bFocusPassedToExternalHandlerFirstTime = false;
                        });
                        oNavigationBar.addEventListener("focusout", () => {
                            // focus in the shell
                            AccessKeysHandler.bFocusOnShell = true;
                            AccessKeysHandler.bFocusPassedToExternalHandlerFirstTime = true;
                        });
                        const oRootView = document.getElementById(ShellArea.RendererRootView);
                        oRootView.addEventListener("focusin", () => {
                            // focus not in the shell
                            AccessKeysHandler.bFocusOnShell = false;
                            AccessKeysHandler.bFocusPassedToExternalHandlerFirstTime = false;
                        });
                        oRootView.addEventListener("focusout", () => {
                            // focus in the shell
                            AccessKeysHandler.bFocusOnShell = true;
                            AccessKeysHandler.bFocusPassedToExternalHandlerFirstTime = true;
                        });
                    });
                });
            }
        },

        /**
         * @param {object} oShellNavigationInternal
         * @param {object} oAppLifeCycleService
         * @param {object} oRouter
         */
        _initShellNavigationInternal: function (oShellNavigationInternal, oAppLifeCycleService, oRouter) {
            this.oShellNavigationInternal = oShellNavigationInternal;
            this.oShellNavigationInternal.registerPrivateFilters(oAppLifeCycleService);

            // register the router in the ShellNavigationInternal to let it skip the split of hash before firing the hashChange event
            this.oShellNavigationInternal.registerExtraRouter(oRouter);
            this.oShellNavigationInternal.registerNavigationFilter(this._handleEmptyHash.bind(this));
            // must be after event registration (for synchronous nav target resolver calls)
            this.oShellNavigationInternal.init(this.doHashChange.bind(this));

            this.oShellNavigationInternal.registerNavigationFilter(this._disableSourceAppRouter.bind(this));

            this.oShellNavigationInternal.registerNavigationFilter(this.handleDataLoss.bind(this));
            this.oShellNavigationInternal.registerNavigationFilter(this._unblockUI.bind(this));

            AppLifeCycleAI.registerHandleHashChange(this.oShellNavigationInternal);
            // enable the direct app start and tests to wait for the initialization
            EventHub.emit("ShellNavigationInitialized", Date.now());
        },

        /**
         */
        _bindTabTitle: function () {
            const oBinding = ShellModel.getModel().bindProperty("/application/title");
            oBinding.attachChange(() => {
                const sTitle = oBinding.getValue();

                /*
                 * the tab should have always a title
                 * => only set the title if it is not empty
                 */
                if (sTitle) {
                    AppConfiguration.setWindowTitle(sTitle);
                }
            });

            this._aDanglingBindings.push(oBinding);
        },

        /**
         * Returns the current configuration model.
         * Note: The model instance changes when the launchpad is restarted (e.g. in tests)
         * @returns {sap.ui.model.Model} The configuration model.
         *
         * @since 1.127.0
         * @private
         */
        _getConfigModel: function () {
            return ShellModel.getConfigModel();
        },

        getViewPortContainer: function () {
            return Element.getElementById("viewPortContainer");
        },

        /**
         * Creates the EventHub event bindings and saves them.
         */
        _registerAndCreateEventHubDoables: function () {
            [
                EventHub.once("CenterViewPointContentRendered").do(this._loadCoreExt.bind(this)),
                EventHub.once("PagesRuntimeRendered").do(this._loadCoreExt.bind(this)),
                EventHub.once("AppRendered").do(this._loadCoreExtNonUI5.bind(this)),
                EventHub.on("toggleContentDensity").do(this.toggleContentDensity.bind(this)),

                EventHub.once("CoreResourcesComplementLoaded").do(this._onCoreResourcesComplementLoaded.bind(this)),
                EventHub.once("loadRendererExtensions").do(this._loadRendererExtensionPlugins.bind(this)),
                EventHub.once("loadWarmupPlugins").do(this._loadWarmupPlugins.bind(this)),
                EventHub.once("loadTrackingActivitiesSetting").do(this._loadTrackingActivitiesSetting.bind(this))
            ].forEach((oDoable) => {
                this.addDoable(oDoable);
            });
        },

        /**
         * This method change the back navigation handler with custom logic in the shell header when the ShellUIService#setBackNavigation method is called.
         *
         * This method currently assumes that the application is displayed in the "minimal" state (no home button present).
         */
        _onBackNavigationChanged: function (oEvent) {
            const fnCallback = oEvent.getParameters().data;
            const sCurrentShellMode = StateManager.getShellMode();
            const sCurrentLaunchpadState = StateManager.getLaunchpadState();

            if (fnCallback) {
                RelatedServices.setNavigateBack(fnCallback);

                if (sCurrentLaunchpadState === LaunchpadState.App && [Minimal, Standalone, Embedded].includes(sCurrentShellMode)) {
                    Container.getRendererInternal("fiori2").showHeaderItem("backBtn", true);
                }
            } else {
                //if no callback is provided we set the default handler: history back
                RelatedServices.resetNavigateBack();
            }
        },

        toggleContentDensity: function (oData) {
            const isCompact = oData.contentDensity === "compact";
            AppMeta._applyContentDensityByPriority(isCompact, true);
        },

        _handleEmptyHash: function (sHash) {
            sHash = (typeof sHash === "string") ? sHash : "";
            sHash = sHash.split("?")[0];
            if (sHash.length === 0) {
                const oViewData = this.getView() ? this.getView().getViewData() : {};
                oConfig = oViewData.config || {};
                // Migration support: we have to set rootIntent empty
                // And continue navigation in order to check if  empty hash is resolved locally
                if (oConfig.migrationConfig) {
                    return this.oShellNavigationInternal.NavigationFilterStatus.Continue;
                }
                if (oConfig.rootIntent) {
                    window.setTimeout(() => {
                        window.hasher.setHash(oConfig.rootIntent);
                    }, 0);
                    return this.oShellNavigationInternal.NavigationFilterStatus.Abandon;
                }
            }
            return this.oShellNavigationInternal.NavigationFilterStatus.Continue;
        },

        // Make sure that UI is unblocked during navigation.
        // The header and menu are blocked when an embedded ui5 app shows a modal popup.
        // However, such a block does not prevent navigation via the browser url and back/forward button navigation.
        // Therefore, this unblock code is related only to the very specific case and has low impact.
        _unblockUI: function () {
            Element.getElementById("shell-header")?.setBlocked?.(false);
            Element.getElementById("menubar")?.setBlocked?.(false);
            return this.oShellNavigationInternal.NavigationFilterStatus.Continue;
        },

        /**
         * Wrapper for {@link sap.ui.performance.trace.Interaction#notifyAsyncStep} to enable isolated tests.
         * @returns {function} A handler that should be called when the interaction is done.
         *
         * @since 1.129.0
         * @private
         */
        _notifyAsyncStep: function () {
            return Interaction.notifyAsyncStep();
        },

        _setConfigurationToModel: function () {
            const oViewData = this.getView().getViewData();

            if (oViewData) {
                oConfig = oViewData.config || {};
            }
            if (oConfig) {
                /**
                 * @deprecated since 1.120 The 'states' configuration was discontinued.
                 */
                if (oConfig.states) {
                    Log.error("The 'states' configuration was discontinued");
                }

                if (oConfig.enableSetTheme !== undefined) {
                    this._getConfigModel().setProperty("/setTheme", oConfig.enableSetTheme);
                }

                // Compact Cozy mode
                this._getConfigModel().setProperty("/contentDensity", oConfig.enableContentDensity === undefined ? true : oConfig.enableContentDensity);

                // Check if the configuration is passed by html of older version(1.28 and lower)
                if (oConfig.migrationConfig !== undefined) {
                    this._getConfigModel().setProperty("/migrationConfig", oConfig.migrationConfig);
                }
                // User default parameters settings
                if (oConfig.enableUserDefaultParameters !== undefined) {
                    this._getConfigModel().setProperty("/userDefaultParameters", oConfig.enableUserDefaultParameters);
                }

                if (oConfig.disableHomeAppCache !== undefined) {
                    this._getConfigModel().setProperty("/disableHomeAppCache", oConfig.disableHomeAppCache);
                }
                // xRay enablement configuration
                this._getConfigModel().setProperty("/enableHelp", Config.last("/core/extension/enableHelp"));
                this._getConfigModel().setProperty("/searchAvailable", (oConfig.enableSearch !== false));

                if (oConfig.title !== undefined) {
                    this.setHeaderTitle(oConfig.title);
                }
            }
        },

        _loadTrackingActivitiesSetting: async function (eventData) {
            // Tracking activities
            try {
                let bEnableTrackingActivity = await this._getPersData({
                    container: "flp.settings.FlpSettings",
                    item: "userActivitesTracking"
                });

                if (bEnableTrackingActivity === undefined) {
                    bEnableTrackingActivity = true;
                }
                this._getConfigModel().setProperty("/enableTrackingActivity", bEnableTrackingActivity);
                EventHub.emit("StepDone", eventData.stepName);
            } catch (error) {
                Log.error(
                    "Failed to load tracking activities state from the personalization, tracking activities is disabled", error,
                    "sap.ushell.components.flp.settings.FlpSettings");
                // if the personalization cannot be read disable the functionality
                // but don't prevent the FLP scheduler from triggering further steps
                this._getConfigModel().setProperty("/enableTrackingActivity", false);
                EventHub.emit("StepDone", eventData.stepName);
            }
        },

        _getPreviousPageDirty: function () {
            return bPreviousPageDirty;
        },

        _setPreviousPageDirty: function (bState) {
            bPreviousPageDirty = bState;
        },

        getModelConfiguration: function () {
            const oViewData = this.getView().getViewData();
            let oShellConfig;

            if (oViewData) {
                const oConfiguration = oViewData.config || {};
                oShellConfig = extend({}, oConfiguration);
            }
            delete oShellConfig.applications;
            return oShellConfig;
        },

        /**
         * This method will be used by the Container service in order to create, show and destroy a Dialog control with an inner iframe.
         * The iframe will be used for rare scenarios in which additional authentication is required.
         * This is mainly related to SAML 2.0 flows. The api sequence will be managed by UI2 services.
         *
         * @returns {{create: function, show: function, destroy: function}} Logon Frame Provider interface
         * @private
         */
        _getLogonFrameProvider: function () {
            return LogonFrameProvider;
        },

        onExit: function () {
            closeAllDialogs = true;

            this._aDoables.forEach((oDoable) => {
                oDoable.off();
            });
            this._aDoables = [];

            ShellUIServiceFactory.detachBackNavigationChanged(this._onBackNavigationChanged, this);

            this._aDanglingControls.forEach((oControl) => {
                oControl.destroy();
            });
            this._aDanglingControls = [];

            this._aDanglingBindings.forEach((oBinding) => {
                oBinding.destroy();
            });
            this._aDanglingBindings = [];

            EventBus.getInstance().unsubscribe("externalSearch", this.externalSearchTriggered, this);
            EventBus.getInstance().unsubscribe("ESHSearchFinished", this._logSearchActivity, this);
            EventBus.getInstance().unsubscribe("sap.ushell", "appOpened", this.onAppOpened, this);

            // Some qUnits destroy the shell very early, check if oShellNavigationInternal exists
            if (this.oShellNavigationInternal && this.oShellNavigationInternal.hashChanger) {
                this.oShellNavigationInternal.hashChanger.destroy();
            }

            sap.ui.require("sap/ushell/UserActivityLog")?.deactivate();

            StateManager.destroy(true);
        },

        /**
         * @returns {object} the current router of the current application component
         */
        _getCurrentAppRouter: function () {
            const oAppLifeCycle = this._oAppLifeCycleService;
            const oCurrentApplication = oAppLifeCycle && oAppLifeCycle.getCurrentApplication && oAppLifeCycle.getCurrentApplication();
            const oComponentInstance = oCurrentApplication && oCurrentApplication.componentInstance;

            if (oComponentInstance) {
                return oComponentInstance.getRouter();
            }
            return null;
        },

        /**
         * If the navigation is not an inner app navigation, this function stops the router of the old application.
         *
         * @param {string} newHash new url hash
         * @param {string} oldHash old url hash
         *
         * @returns {string} ShellNavigationInternal.NavigationFilterStatus
         */
        _disableSourceAppRouter: function (newHash, oldHash) {
            if (!this.bEnableHashChange || this.bRestorePreviousHash) {
                return this.oShellNavigationInternal.NavigationFilterStatus.Continue;
            }

            const bAppSpecificChange = this.oShellNavigationInternal.hashChanger.isInnerAppNavigation(newHash, oldHash);
            if (!bAppSpecificChange) {
                const oCurrentAppRouter = this._getCurrentAppRouter();

                if (oCurrentAppRouter && oCurrentAppRouter.isInitialized()) {
                    oCurrentAppRouter.stop();
                }
            }

            return this.oShellNavigationInternal.NavigationFilterStatus.Continue;
        },

        /**
         * Makes sure that the router is not stopped after a failed / aborted navigation.
         * We ignore the current hash when re-initializing the router because we are handling cases that restore the old state
         * (nothing should change application side when the router is resumed).
         */
        _resumeAppRouterIgnoringCurrentHash: function () {
            const oAppRouter = this._getCurrentAppRouter();

            if (oAppRouter) {
                oAppRouter.initialize(true /* bIgnoreInitialHash */);
            }
        },

        /**
         * Navigation Filter function registered with ShellNavigationInternal service.
         * Triggered on each navigation.
         * Aborts navigation if there are unsaved data inside app(getDirtyFlag returns true).
         * For non-IE browsers the dirtyState=true gets handled asynchronously by undoing the navigation and redoing the navigation.
         * In case of an explace navigation there is no data loss popup.
         *
         * @param {string} targetIntent The new intent to navigate to.
         * @param {string} currentIntent The current intent before navigation was triggered.
         * @returns {string|object} A navigation filter status object or string.
         * @private
         */
        handleDataLoss: function (targetIntent, currentIntent) {
            const oShellNavigationHashChanger = this.oShellNavigationInternal.hashChanger;
            const bReloadApplication = oShellNavigationHashChanger.getReloadApplication();

            if (this.bReloadApplication !== null && this.bReloadApplication !== undefined) {
                oShellNavigationHashChanger.setReloadApplication(this.bReloadApplication);
                this.bReloadApplication = null;
            }

            // We are navigating from empty hash to rootIntent
            if (currentIntent === "" || hasher.disableBlueBoxHashChangeTrigger === true) {
                return this.oShellNavigationInternal.NavigationFilterStatus.Continue;
            }

            if (!this.bEnableHashChange && !this.bRedoNavigation) {
                this.bEnableHashChange = true;

                return this.oShellNavigationInternal.NavigationFilterStatus.Custom;
            }

            if (this.bRestorePreviousHash) {
                return this.oShellNavigationInternal.NavigationFilterStatus.Continue;
            }

            // User confirmed the data loss and now we do the hash change again
            if (this.bRedoNavigation) {
                this.bRedoNavigation = false;
                this.bEnableHashChange = true;
                this.bExplaceNavigation = false;
                return this.oShellNavigationInternal.NavigationFilterStatus.Continue;
            }

            // Do we do an ex-place navigation?
            const oParsedHash = UrlParsing.parseShellHash(targetIntent);
            const bBuiltInIntent = Container.getRendererInternal()._isBuiltInIntent(oParsedHash);
            const aParsedNavMode = oParsedHash.params["sap-ushell-navmode"];
            const sNavMode = aParsedNavMode && aParsedNavMode[0];

            // Built-in intents must never be opened ex-place, therefore only continue with non built-in Intents
            if (!bBuiltInIntent && (this.bExplaceNavigation || sNavMode === "explace" || sNavMode === "frameless")) {
                // Yes, just continue the navigation without a dirtyFlag popup
                this.bExplaceNavigation = false;
                return this.oShellNavigationInternal.NavigationFilterStatus.Continue;
            }

            // In case the async dirtyState provider is NOT set we only have to check the sync dirtyState.
            // TODO: Simplify (Remove) the shortcut once the OPA test iframe issue is solved.
            // The OPA iframe handler overwrites some hasher methods which results in a confused ushell navigation flow.
            const bIsDirty = Container.getDirtyFlag();
            const bIsAsyncDirtyStateProviderSet = Container.isAsyncDirtyStateProviderSet();
            if (!bIsAsyncDirtyStateProviderSet && !bIsDirty) {
                bPreviousPageDirty = bIsDirty;
                return this.oShellNavigationInternal.NavigationFilterStatus.Continue;
            }

            // The dirtyState is either true or has to be retrieved async.
            // After the hash changes we evaluate the dirtyState asynchronously
            // and redo the navigation in case it is false. In case it is true we do additional logic
            // _restoreHashUsingAction returns the NavigationFilterStatus Custom.
            const bIsBackNavigation = Ui5History.getInstance().getHistoryStateOffset() < 0;
            this._oLastDataLossPromise = Promise.all([
                this._waitForHash(currentIntent),
                Container.getServiceAsync("NavTargetResolutionInternal"),
                Container.getDirtyFlagsAsync()
            ])
                .then(async (aResults) => {
                    const oService = aResults[1];
                    const bIsDirty = aResults[2];

                    // Update the internal dirtyFlag to match the current dirtyFlag
                    // This is needed in case of a hashChangeFailure. When we navigate to a broken app the
                    // controller does not ask for the dirtyState therefore we need to be able to restore it
                    bPreviousPageDirty = bIsDirty;

                    if (!bIsDirty) {
                        this.bRedoNavigation = true;
                        this._restoreHashUsingAction(targetIntent, "redo");
                        return;
                    }

                    // Built-in intents can not be resolved, so we need to check
                    // first if the user is trying to navigate to one of them.
                    if (bBuiltInIntent) {
                        // We assume built-in intents are always in-place, so we need user input
                        if (this._handleDirtyStateUserConfirm()) {
                            this.bRedoNavigation = true;
                            this._restoreHashUsingAction(targetIntent, "redo");
                        }
                        return;
                    }

                    // resolveHashFragment expects a full hash, this filter always gets the target without '#'
                    const sTargetHash = `#${targetIntent}`;
                    try {
                        const oResolvedHashFragment = await oService.resolveHashFragment(sTargetHash);

                        const bIsExplaceNavigation = oResolvedHashFragment.targetNavigationMode === "explace" || oResolvedHashFragment.targetNavigationMode === "frameless";
                        const bIsBackNavigationAndNewWindow = bIsBackNavigation && oResolvedHashFragment.navigationMode === NavigationMode.newWindowThenEmbedded;

                        if (bIsExplaceNavigation && (!bIsBackNavigationAndNewWindow)) {
                            this.bExplaceNavigation = true;
                            this.bRedoNavigation = true;
                            this._restoreHashUsingAction(targetIntent, "redo");
                        } else if (this._handleDirtyStateUserConfirm()) {
                            this.bRedoNavigation = true;
                            this.bReloadApplication = bReloadApplication;
                            this._restoreHashUsingAction(targetIntent, "redo");
                        }
                    } catch {
                        // If the resolution failed, redoing the navigation will trigger the
                        // error pop-up.
                        this.bRedoNavigation = true;
                        this._restoreHashUsingAction(targetIntent, "redo");
                    }
                });

            // Returns this.oShellNavigationInternal.NavigationFilterStatus.Custom
            return this._restoreHashUsingAction(currentIntent, "undo");
        },

        /**
         * Wait for the given hash to be loaded by the browser.
         *
         * @param {string} hash The hash to wait for.
         * @returns {Promise<undefined>} A promise that is resolved once the given hash was found. It is not rejected.
         * @since 1.86.0
         * @private
         */
        _waitForHash: function (hash) {
            const sHash = `#${hash}`;

            return new Promise((resolve) => {
                function fnWaitChange () {
                    const bChanged = sHash === decodeURIComponent(window.location.hash);

                    if (bChanged) {
                        window.removeEventListener("hashchange", fnWaitChange);
                        resolve();
                    }
                }

                window.addEventListener("hashchange", fnWaitChange);
            });
        },

        /**
         * Shows a browser-popup for the user to confirm that they want to discard their changes.
         * @returns {boolean} True if the popup has been confirmed by the user, otherwise false.
         *
         * @private
         * @since 1.86.0
         */
        _handleDirtyStateUserConfirm: function () {
            Log.debug(`${sLogFesrPrefix} Interaction Start`, "_handleDirtyStateUserConfirm", sModuleName);
            const fnResolveInteraction = this._notifyAsyncStep();

            // eslint-disable-next-line no-alert
            if (window.confirm(ushellResources.i18n.getText("dataLossInternalMessage"))) {
                Container.setDirtyFlag(false);
                Log.debug(`${sLogFesrPrefix} Interaction End`, "_handleDirtyStateUserConfirm", sModuleName);
                fnResolveInteraction();

                bPreviousPageDirty = true;
                return true;
            }
            Log.debug(`${sLogFesrPrefix} Interaction End`, "_handleDirtyStateUserConfirm", sModuleName);
            fnResolveInteraction();

            return false;
        },

        /**
         * Undoes or redoes navigation. Restores the previous or next hash and the navigation history that lead to it.
         *
         * @param {string} sHash The old hash that should be reset.
         * @param {string} sAction Whether a 'redo' or 'undo' action is to be performed.
         * @returns {object} The navigation filter status.
         * @since 1.86.0
         * @private
         */
        _restoreHashUsingAction: function (sHash, sAction) {
            const bWasHistoryEntryReplaced = this.oShellNavigationInternal.wasHistoryEntryReplaced();
            const oRestoreStrategy = this._getRestoreHashStrategy(bWasHistoryEntryReplaced, sAction);

            this._resumeAppRouterIgnoringCurrentHash();

            return this._restoreHash(oRestoreStrategy, sHash);
        },

        /**
         * Decides the strategy to use when restoring an old hash in an attempt to undo a forward or a backward navigation.
         * This method is mostly used for data loss handling, after a user confirmed that they want to stay in the current application.
         *
         * @param {boolean} bNavToReplacedHash Whether the last navigation had replaced the history without adding a new entry.
         * @param {string} sAction The action to be carried out.
         * @returns {object} The strategy to use to restore the previous shell hash which is one of:
         *     "historyBack", "replaceHash", "historyForward" and the number of steps to restore the hash.
         */
        _getRestoreHashStrategy: function (bNavToReplacedHash, sAction) {
            /**
             * The bNavToReplacedHash needs to be checked first because the iHistoryStateOffset is undefined when:
             *  * hash is replaced
             *  * new hash is given
             *  * in browser where history pushState isn't fully supported
             */
            if (bNavToReplacedHash) {
                return {
                    strategy: "replaceHash",
                    stepCount: 0
                };
            }

            // This is a workaround:
            // Notifying the UI5 history via the hashChanged event triggers unwanted navigation.
            // But without the notify the offset gets out of sync with the current state and stacks up.
            // We are now assuming that we only do (and undo) single navigation steps
            let sStrategy;
            let iHistoryStateOffset = Ui5History.getInstance().getHistoryStateOffset();
            if (iHistoryStateOffset === undefined || iHistoryStateOffset >= 0) {
                // Forward
                iHistoryStateOffset = 1;
            } else if (iHistoryStateOffset < 0) {
                // Backward
                iHistoryStateOffset = -1;
            }

            // If the history offset exists, we use the absolute value because later we use dedicated functions like _windowHistoryBack
            // and _windowHistoryForward for back- and forwards navigation, respectively.
            // Calling either of those function with a negative value would yield the exact opposite.
            // TODO: Actually, we could refactor this to call history.go directly, so we don't have to transform it.

            if (sAction === "undo") {
                if (iHistoryStateOffset < 0) {
                    // Went backwards
                    sStrategy = "historyForward";
                } else {
                    // Went forwards
                    sStrategy = "historyBack";
                }

                this.sLastUndoStrategy = sStrategy;
            } else {
                switch (this.sLastUndoStrategy) {
                    case "historyBack":
                        sStrategy = "historyForward";
                        break;
                    case "historyForward":
                        sStrategy = "historyBack";
                        break;
                    default:
                        sStrategy = "replaceHash";
                }
            }

            return {
                strategy: sStrategy,
                stepCount: 1
            };
        },

        /**
         * Restores the previous or next hash using the given restore-strategy.
         * If the restore strategy is 'replaceHash', the given hash is used.
         *
         * @param {object} oRestoreStrategy A restore strategy containing a strategy such as 'historyBack', 'historyForward' or 'replaceHash'.
         * @param {string} sHash A hash without hash sign to be set if the 'replaceHash' strategy is to be used.
         * @returns {object} The Custom navigation filter status.
         * @throws If the given restore strategy is not recognized.
         * @private
         */
        _restoreHash: function (oRestoreStrategy, sHash) {
            const oNavigationFilterStatus = {
                status: this.oShellNavigationInternal.NavigationFilterStatus.Custom,
                hash: ""
            };
            switch (oRestoreStrategy.strategy) {
                case "historyBack":
                    this.bEnableHashChange = false;
                    this._windowHistoryBack(oRestoreStrategy.stepCount);
                    break;
                case "historyForward":
                    this.bEnableHashChange = false;
                    this._windowHistoryForward(oRestoreStrategy.stepCount);
                    break;
                case "replaceHash":
                    this.bEnableHashChange = false;
                    hasher.replaceHash(sHash);
                    break;
                default:
                    throw new Error("Cannot execute unknown navigation strategy");
            }

            return oNavigationFilterStatus;
        },

        _setEnableHashChange: function (bValue) {
            this.bEnableHashChange = bValue;
        },

        /**
         * Triggers the app-usage mechanism to log an openApp action.
         *
         * @param {object} oRecentActivity An object containing details of a recently opened app
         * @returns {Promise} A promise that is resolved once the action is logged
         * @private
         */
        _logRecentActivity: async function (oRecentActivity) {
            // In a direct app start the logging happens before the user setting is loaded
            if (!this.oInitialEnableTrackingPromise) {
                // The initial value was overwritten by now
                if (Config.last("/core/shell/model/enableTrackingActivity") !== undefined) {
                    this.oInitialEnableTrackingPromise = Promise.resolve();
                } else {
                    this.oInitialEnableTrackingPromise = new Promise((resolve) => {
                        Config.once("/core/shell/model/enableTrackingActivity").do(resolve);
                    });
                }
            }

            await this.oInitialEnableTrackingPromise;

            if (Config.last("/core/shell/model/enableTrackingActivity")) {
                const UserRecents = await Container.getServiceAsync("UserRecents");
                return UserRecents.addActivity(oRecentActivity);
            }
            Log.warning("Tracking is not enabled", null, "sap.ushell.renderer.Shell.controller");
            throw new Error("Tracking is not enabled");
        },

        /**
         * Sets application container based on information in URL hash.
         *
         * This is a callback registered with NavService. It's triggered whenever the url (or the hash fragment in the url) changes.
         *
         * NOTE: when this method is called, the new URL is already in the address bar of the browser.
         * Therefore back navigation is used to restore the URL in case of wrong navigation or errors.
         *
         * @param {string} sShellHash shell hash
         * @param {string} sAppPart application part
         * @param {string} sOldShellHash previous shell hash
         * @param {string} sOldAppPart previous application part
         * @param {object} oParseError parse error
         * @returns {jQuery.Promise} Resolves once the hash change is done.
         * @public
         */
        doHashChange: function (sShellHash, sAppPart, sOldShellHash, sOldAppPart, oParseError) {
            Log.debug(`${sLogFesrPrefix} Interaction Start`, "doHashChange", sModuleName);
            ushellUtils.setPerformanceMark("FLP-ShellController-doHashChange-begin");
            EventHub.emit("trackHashChange", sShellHash);

            const oDeferred = new jQuery.Deferred();

            // reset here because the result of wasHistoryEntryReplaced is only useful in navigation filters
            // and might give inconsistent results after this point.
            this._bWasHistoryEntryReplaced = this.oShellNavigationInternal.wasHistoryEntryReplaced();
            this.oShellNavigationInternal.resetHistoryEntryReplaced();

            if (!this.bEnableHashChange) {
                this.bEnableHashChange = true;
                oDeferred.resolve();
                return oDeferred.promise();
            }

            // When the application is opened in the new tab, the ShellHashEvent should be fired in order to update UI5 hasher,
            // but the application should not be resolved again.
            if (this.bRestorePreviousHash) {
                this.bRestorePreviousHash = false;
                oDeferred.resolve();
                return oDeferred.promise();
            }

            const sFixedShellHash = UrlParsing.ensureLeadingHash(sShellHash);
            const sFixedOldShellHash = UrlParsing.ensureLeadingHash(sOldShellHash);

            // todo [FLPCOREANDUX-10024] where does this oParseError come from?
            if (oParseError) {
                Log.error(`Error when parsing the hash: '${sFixedShellHash}'`, oParseError);
                this.hashChangeFailure(
                    this.history.getHistoryLength(),
                    oParseError.message,
                    null,
                    "sap.ushell.renderer.Shell.controller",
                    false
                )
                    .then(oDeferred.resolve.bind(oDeferred))
                    .catch(oDeferred.reject.bind(oDeferred));
                return oDeferred.promise();
            }

            const oDashboard = Element.getElementById("sapUshellDashboardPage");
            if (oDashboard) {
                oDashboard.setBlocked(true);
                oDashboard.setBusy(true);
            }

            const fnResolveInteraction = this._notifyAsyncStep();

            this._doHashChange(sFixedShellHash, sAppPart, sFixedOldShellHash)
                .catch(() => {
                    EventHub.emit("doHashChangeError", Date.now());
                })
                .finally(() => {
                    Log.debug(`${sLogFesrPrefix} Interaction End`, "doHashChange", sModuleName);
                    fnResolveInteraction();

                    if (oDashboard) {
                        oDashboard.setBlocked(false);
                        oDashboard.setBusy(false);
                    }

                    oDeferred.resolve();
                });

            return oDeferred.promise();
        },

        _doHashChange: async function (sShellHash, sAppPart, sOldShellHash) {
            // save current history length to handle errors (in case)
            const iOriginalHistoryLength = this.history.getHistoryLength();

            // track hash change
            this.history.hashChange(sShellHash, sOldShellHash);

            // we save the current-application before resolving the next navigation's fragment,
            // as in cases of navigation in a new window we need to set it back for the app-configuration to be consistent
            const oOldResolvedHashFragment = AppConfiguration.getCurrentApplication();

            try {
                // NOTE: AppConfiguration.setCurrentApplication was called with the currently resolved target.
                const oResult = await this._resolveHashFragment(sShellHash);

                // Only for testing
                if (!oResult && window.QUnit !== undefined) {
                    // return without navigation if no result was returned.
                    return;
                }

                const oResolvedHashFragment = oResult.resolvedHashFragment;
                const oParsedShellHash = oResult.parsedShellHash;

                // todo: [FLPCOREANDUX-10024] is this a real life use case?
                /*
                 * A null navigationMode indicates that no hashFragment was resolved.
                 * However, we need to restore the current hash to the previous one.
                 * If cold start happened (history has only one entry), we go to the shell home.
                 */
                if (oResolvedHashFragment.navigationMode === null) {
                    if (ushellUtils.isColdStart()) {
                        window.hasher.setHash("");
                        return;
                    }

                    this.bEnableHashChange = false;
                    this.history.pop();
                    this._windowHistoryBack(1);
                    return;
                }

                // store the state of the current app before opening the new app
                await AppLifeCycleAI.storeAppExtensions();

                // stall all state management changes, those __most probably__ come from the target application
                StateManager.stallChanges();

                const bOpenedViaNWBC = await this._openAppViaNWBC(oResolvedHashFragment, oOldResolvedHashFragment);
                if (bOpenedViaNWBC === true) {
                    this.logOpenAppAction(oResolvedHashFragment, sAppPart).catch(() => {
                        Log.info("NWBC application was not logged.", undefined, "sap.ushell.renderer.Shell.controller");
                    });

                    StateManager.applyStalledChanges();
                    return;
                }

                if (oResolvedHashFragment.navigationMode === NavigationMode.newWindow) {
                    // add the app to application usage log
                    this.logOpenAppAction(oResolvedHashFragment, sAppPart).catch(() => {
                        Log.info("Application in new window was not logged.", undefined, "sap.ushell.renderer.Shell.controller");
                    });
                    await this._openAppExplace(oResolvedHashFragment, oOldResolvedHashFragment);

                    StateManager.applyStalledChanges(); // no changes were done by the source application
                    return;
                }

                // Handle "/core/shell/model/migrationConfig"
                const bHandledViaMigrationConfig = this._rewriteRootIntentForMigrationConfig(oResolvedHashFragment, sShellHash);
                if (bHandledViaMigrationConfig) {
                    StateManager.applyStalledChanges(); // no changes were done by the source application
                    return;
                }

                // todo: [FLPCOREANDUX-10024] simplify error handling
                try {
                    const bPreviousIsInitialNavigation = this.oShellNavigationInternal.isInitialNavigation();
                    try {
                        await this._openAppInplace(oParsedShellHash, sShellHash, oResolvedHashFragment, sOldShellHash, sAppPart, oOldResolvedHashFragment);
                    } catch (oError) {
                        Log.error(`Application initialization for intent "${sShellHash}" failed.`, oError);

                        // assumption is that the resolvedHashFragment already contains the componentHandle
                        const oMetadata = AppConfiguration.getMetadata(oResolvedHashFragment);
                        this.oShellNavigationInternal.setIsInitialNavigation(bPreviousIsInitialNavigation);
                        await this.hashChangeFailure(
                            iOriginalHistoryLength,
                            oError.name,
                            oError.message,
                            oMetadata ? oMetadata.title : "",
                            false
                        );
                    }
                } catch (oError) {
                    Log.error("Failed to open application", oError, "sap.ushell.renderer.Shell.controller");

                    const sErrorReason = ushellResources.i18n.getText("cannot_load_ui5_component_details", [sShellHash]);
                    const sErrorReasonEnglish = `Failed to load UI5 component for navigation intent "${sShellHash}"`;

                    AppConfiguration.setCurrentApplication(oOldResolvedHashFragment);
                    await this.hashChangeFailure(
                        iOriginalHistoryLength,
                        {
                            title: ushellResources.i18n.getText("error"),
                            message: ushellResources.i18n.getText("failed_to_open_ui5_component"),
                            technicalMessage: sErrorReasonEnglish
                        },
                        {
                            info: sErrorReason,
                            technicalMessage: `${oError.message}\n${oError.stack}`
                        },
                        "sap.ushell.renderer.Shell.controller",
                        false
                    );
                }
            } catch (oError) {
                Log.error("Hash change handling failed. Could not open app.", oError, "sap.ushell.renderer.Shell.controller");
                const sErrorReason = ushellResources.i18n.getText("cannot_resolve_navigation_target_details", [sShellHash]);
                // eslint-disable-next-line max-len
                const sErrorReasonEnglish = `Failed to resolve navigation target "${sShellHash}". This is most likely caused by an incorrect SAP Fiori launchpad content configuration or by missing role assignment.`;

                await this.hashChangeFailure(
                    iOriginalHistoryLength,
                    {
                        title: ushellResources.i18n.getText("error"),
                        message: ushellResources.i18n.getText("failed_to_open_app_missing_configuration_or_role_assignment"),
                        technicalMessage: sErrorReasonEnglish
                    },
                    {
                        info: sErrorReason,
                        fixedShellHash: sShellHash,
                        technicalMessage: oError.message
                    },
                    "sap.ushell.renderer.Shell.controller",
                    false
                );

                throw oError;
            }
        },

        _rewriteRootIntentForMigrationConfig: function (oResolvedHashFragment, sShellHash) {
            // In case of empty hash, if there is a resolved target, set the flag to false, from now on the rootIntent
            // will be an empty hash. Otherwise, change hash to rootIntent to trigger normal resolution.
            if (Config.last("/core/shell/model/migrationConfig")) {
                oConfig.migrationConfig = false;
                this._getConfigModel().setProperty("/migrationConfig", false);

                if (oResolvedHashFragment && sShellHash === "#") {
                    oConfig.rootIntent = "";
                } else if (sShellHash === "#") {
                    window.setTimeout(() => {
                        window.hasher.setHash(oConfig.rootIntent);
                    }, 0);

                    return true;
                }
            }
            return false;
        },

        _openAppExplace: async function (oResolvedHashFragment, oOldResolvedHashFragment) {
            const [ApplicationContainer] = await ushellUtils.requireAsync(["sap/ushell/components/container/ApplicationContainer"]);

            // Call relevant for Legacy-UI apps that are launched "standalone"; in case of "embedded in new window", the URL doesn't need adaptions.
            oResolvedHashFragment.url = ApplicationContainer.prototype._checkNwbcUrlAdjustment(undefined, oResolvedHashFragment.applicationType, oResolvedHashFragment.url, true);

            EventBus.getInstance().publish("launchpad", "appOpening", oResolvedHashFragment);

            const oNewWin = WindowUtils.openURL(oResolvedHashFragment.url);
            // Show a message when window.open returns null --> Popup Blocker
            // Exception: in WorkZone's mobile client, when external nav happens: Keep calm and carry on.
            if (!oNewWin && !this._checkWindowLocationSearch("workzone-mobile-app=true")) {
                const msg = ushellResources.i18n.getText("fail_to_start_app_popup_blocker", [window.location.hostname]);
                this.delayedMessageError(msg);
            }

            EventBus.getInstance().publish("sap.ushell", "appOpened", oResolvedHashFragment);
            this._restorePreviousHashAfterOpenNewWindow(oResolvedHashFragment, oOldResolvedHashFragment);
        },

        _closeAllDialogs: function () {
            if (InstanceManager && closeAllDialogs) {
                InstanceManager.closeAllDialogs();
                InstanceManager.closeAllPopovers();
            }

            closeAllDialogs = true;
        },

        /**
         * Callback registered with NavService. Triggered on navigation requests
         *
         * @param {string} sShellHash the hash fragment to parse (must start with "#")
         * @returns {Promise<{ resolvedHashFragment: object , parsedShellHash: object }>} Resolves with an object containing the resolved hash fragment (i.e., the result of
         *   {@link sap.ushell.services.NavTargetResolutionInternal#resolveHashFragment}), the parsed shell hash obtained via
         *   {@link sap.ushell.services.URLParsing#parseShellHash}, and a boolean value indicating whether application dependencies
         *   <b>and</b> core-ext-light were loaded earlier. The promise is rejected with an error message in case errors occur.
         */
        _resolveHashFragment: async function (sShellHash) {
            const oParsedShellHash = UrlParsing.parseShellHash(sShellHash) || {}; // might be empty in tests
            const oConfig = this._getConfig(); // for testing
            let oResolvedHashFragment;

            // Check and use resolved hash fragment from direct start promise if it's there
            if (window["sap-ushell-async-libs-promise-directstart"]) {
                try {
                    const oDirectstartPromiseResult = await window["sap-ushell-async-libs-promise-directstart"];
                    delete window["sap-ushell-async-libs-promise-directstart"];

                    oResolvedHashFragment = oDirectstartPromiseResult.resolvedHashFragment;
                } catch (oError) {
                    delete window["sap-ushell-async-libs-promise-directstart"];
                    throw oError;
                }
            } else {
                // Perform target resolution as normal...
                const NavTargetResolutionInternal = await Container.getServiceAsync("NavTargetResolutionInternal");
                oResolvedHashFragment = await ushellUtils.promisify(NavTargetResolutionInternal.resolveHashFragment(sShellHash));
            }

            // Only for testing: return without result if the NavTargetResolutionInternal resolved nothing
            if (!oResolvedHashFragment && window.QUnit !== undefined && !window._bTestNullNavigationMode) {
                return;
            }

            if (!oResolvedHashFragment) {
                // indicate that resolving failed
                oResolvedHashFragment = {
                    navigationMode: null
                };
            }

            AppConfiguration.setCurrentApplication(oResolvedHashFragment);

            // add application config to the application properties
            const sBasicHash = UrlParsing.getBasicHash(sShellHash);
            if (oConfig?.applications?.[sBasicHash]) {
                oResolvedHashFragment.applicationConfiguration = oConfig.applications[sBasicHash];
            }

            // adding intent as this published application info is required for the contact-support scenario
            oResolvedHashFragment.sFixedShellHash = sShellHash;

            // Override navigation mode for root intent.
            // Shell home should be opened in embedded mode to allow a new window to be opened from GUI applications.
            if (`${oParsedShellHash.semanticObject}-${oParsedShellHash.action}` === oConfig.rootIntent) {
                oResolvedHashFragment.navigationMode = NavigationMode.embedded;
            }

            // todo: [FLPCOREANDUX-10024] move any navigationMode logic to sap/ushell/navigationMode
            if (oResolvedHashFragment.navigationMode !== null && !oResolvedHashFragment.navigationMode) {
                Log.error(
                    "Mandatory member 'navigationMode' is missing in the resolution result! Temporarily set to 'embedded' for further processing...",
                    "sap.ushell.renderer.Shell.controller"
                );
                oResolvedHashFragment.navigationMode = NavigationMode.embedded;
            }

            // override the navigation mode based on the current state of the Shell and application
            this._setEffectiveNavigationMode(oResolvedHashFragment);

            ushellUtils.setPerformanceMark("FLP-ShellController-resolveHashFragment-end");

            return {
                resolvedHashFragment: oResolvedHashFragment,
                parsedShellHash: oParsedShellHash
            };
        },

        /**
         * Adjust Navigation mode based on current state of the Shell and application and the ResolveHashFragment bo be started
         * This operation mutates oResolvedHashFragment {@link #navigate}.
         *
         * @param {object} oResolvedHashFragment the hash fragment resolved via {@link sap.ushell.services.NavTargetResolutionInternal#resolveHashFragment}
         *
         * @private
         */
        _setEffectiveNavigationMode: function (oResolvedHashFragment) {
            if (!oResolvedHashFragment) {
                return; // happens in tests
            }
            const sNavigationMode = oResolvedHashFragment.navigationMode;

            if (sNavigationMode === NavigationMode.newWindowThenEmbedded) {
                // Implement newWindowThenEmbedded based on current state.
                if (ushellUtils.isColdStart() || Ui5History.getInstance().getDirection() === Ui5HistoryDirection.Backwards) {
                    /*
                     * cold start
                     *   -> always open in place because the new window was opened by the user
                     *
                     * Ui5History.getInstance().getDirection()
                     *   -> URL has already been navigated to and it was the predecessor of the previous page
                     */
                    oResolvedHashFragment.navigationMode = NavigationMode.embedded;
                } else {
                    oResolvedHashFragment.navigationMode = NavigationMode.newWindow;
                    // If its a non-native navigation, we resolve the hash again in the new window
                    // we set the full current location hash as URL for the new window and switch to type URL
                    // to avoid encoding issues and lost parameters/inner-app-route.
                    if (!ushellUtils.isNativeWebGuiNavigation(oResolvedHashFragment)) {
                        oResolvedHashFragment.applicationType = "URL";
                        oResolvedHashFragment.url = this._getCurrentLocationHash();
                    }
                }
                return;
            }

            if (sNavigationMode === NavigationMode.newWindow && ushellUtils.isColdStart()) {
                // Workaround for URLs that start an FLP app which needs the shell.
                if (this._hasAppCapabilitiesNavigationMode(oResolvedHashFragment)
                    && oResolvedHashFragment.appCapabilities.navigationMode === NavigationMode.embedded) {
                    oResolvedHashFragment.navigationMode = NavigationMode.embedded;
                    return oResolvedHashFragment;
                }
                // Replace the content of the current window if the user has already opened one.
                oResolvedHashFragment.navigationMode = NavigationMode.replace;
                return;
            }

            if (sNavigationMode === NavigationMode.newWindow
                && this._hasAppCapabilitiesNavigationMode(oResolvedHashFragment)
                && oResolvedHashFragment.appCapabilities.navigationMode === NavigationMode.embedded) {
                oResolvedHashFragment.url = this._getCurrentLocationHash();
            }
        },

        // Workaround for URLs that start an FLP app which needs the shell.
        _hasAppCapabilitiesNavigationMode: function (oResolvedHashFragment) {
            return ushellUtils.isPlainObject(oResolvedHashFragment.appCapabilities) && oResolvedHashFragment.appCapabilities.hasOwnProperty("navigationMode");
        },

        _usesNavigationRedirect: async function (oComponentHandle) {
            if (!oComponentHandle) {
                return false;
            }

            const oComponent = oComponentHandle.getInstance({});
            if (!oComponent) {
                return false;
            }

            if (typeof oComponent.navigationRedirect !== "function") {
                return false;
            }

            // oComponent refers to a trampoline application
            const oNavRedirectThenable = oComponent.navigationRedirect();
            if (!oNavRedirectThenable || typeof oNavRedirectThenable.then !== "function") {
                return false;
            }

            try {
                const sNextHash = await ushellUtils.promisify(oNavRedirectThenable);
                Log.warning(`Performing navigation redirect to hash "${sNextHash}"`);

                oComponent.destroy();
                this.history.pop();

                const ShellNavigationInternal = await Container.getServiceAsync("ShellNavigationInternal");
                ShellNavigationInternal.toExternal({ target: { shellHash: sNextHash } }, undefined, false);

                return true;
            } catch {
                return false;
            }

        },

        /**
         * Performs navigation based on the given resolved hash fragment.
         *
         * @param {object} oParsedShellHash the parsed shell hash obtained via {@link sap.ushell.services.URLParsing} service
         * @param {string} sShellHash the hash fragment to navigate to. It must start with "#" (i.e., fixed).
         * @param {object} oResolvedHashFragment the hash fragment resolved via {@link sap.ushell.services.NavTargetResolutionInternal#resolveHashFragment}
         * @param {string} sOldShellHash the old hash fragment. It must start with "#" (i.e., fixed).
         * @param {string} sAppPart the application part
         *
         * @returns {Promise} Navigation Promise
         */
        _openAppInplace: async function (oParsedShellHash, sShellHash, oResolvedHashFragment, sOldShellHash, sAppPart, oOldResolvedHashFragment) {
            // todo: [FLPCOREANDUX-10024] check the parameters sent to the AI methods

            const bNavigationFromHome = this._isFLPIntent(sOldShellHash);
            const bNavigationWithInnerAppRoute = !!sAppPart;

            // Close dialogs only for inplace navigation
            this._closeAllDialogs();

            await AppLifeCycleAI.handleBeforeCreateApp(sShellHash, oResolvedHashFragment, bNavigationFromHome, bNavigationWithInnerAppRoute);

            // Enhances the resolved hash fragment with the componentHandle for UI5 apps
            await AppLifeCycleAI.handleCreateApp(sShellHash, oParsedShellHash, oResolvedHashFragment, bNavigationFromHome, bNavigationWithInnerAppRoute);

            // todo: [FLPCOREANDUX-10024] Validate the issue
            // the activation of user activity logging must be done after the app component is fully loaded
            // otherwise the module loading sequence causes race conditions on firefox
            const bContactSupportEnabled = Config.last("/core/extension/SupportTicket");
            if (bContactSupportEnabled) {
                ushellUtils.awaitTimeout(0)
                    .then(() => {
                        return ushellUtils.requireAsync("sap/ushell/UserActivityLog");
                    })
                    .then(([UserActivityLog]) => {
                        UserActivityLog.activate();
                    });
            }

            const sEffectiveNavigationMode = oResolvedHashFragment.navigationMode;
            if (sEffectiveNavigationMode === NavigationMode.embedded) {
                if (!ushellUtils.isColdStart() && !this._bWasHistoryEntryReplaced) {
                    this.oShellNavigationInternal.setIsInitialNavigation(false);
                }

                // The trampoline application subsequently gets destroyed after it's used to enable the redirection.
                const bHandledByNavigationRedirect = await this._usesNavigationRedirect(oResolvedHashFragment.componentHandle);
                if (bHandledByNavigationRedirect) {
                    // todo: [FLPCOREANDUX-10024] check cleanup stuff (StateManager, ...)
                    return;
                }

                AppLifeCycleAI.resetGlobalShellUIService();

                const oShellConfig = this._getConfig();
                const sBasicShellHash = UrlParsing.getBasicHash(sShellHash);

                await AppLifeCycleAI.handleCreateApplicationContainer(
                    sBasicShellHash, // sAppId
                    oParsedShellHash,
                    oResolvedHashFragment,
                    sOldShellHash,
                    bNavigationFromHome
                );

                // todo: [FLPCOREANDUX-10024] TBD
                AppLifeCycleAI.navToCurrentApp(); // todo: [FLPCOREANDUX-10024] triggers appLoaded event

                // @Alon Barnes: Is this call even needed? The beforehand given oMetadata has not included the accessed property in the AppMeta.js
                // So, maybe this call can even be removed?
                AppMeta.setAppIcons();

                // todo: [FLPCOREANDUX-10024] should this be done after handleControl?
                // this only targets the overwritten rootIntent (e.g. workzone advanced)
                const bIsNavToHome = sShellHash === "#" || (oShellConfig.rootIntent && sBasicShellHash === UrlParsing.getBasicHash(oShellConfig.rootIntent));
                AppLifeCycleAI.switchViewState(
                    bIsNavToHome ? LaunchpadState.Home : LaunchpadState.App,
                    sBasicShellHash, // sAppId
                    oResolvedHashFragment.applicationType,
                    oResolvedHashFragment.explicitNavMode
                );

                // todo: [FLPCOREANDUX-10024] check whether this needs to be awaited
                await AppLifeCycleAI.handleAfterNavigate(oResolvedHashFragment, oOldResolvedHashFragment);

                /*
                * The event is used for FESR records
                * Normally FESR record is closed on the "AppRendered" event, but for some cases (stateful container, etc.)
                * the application container is not re-rendered and EmbeddedNavigationDone is additionally fired to close the record.
                */
                const oMetadata = AppConfiguration.getMetadata(oResolvedHashFragment);
                EventHub.emit("CloseFesrRecord", { time: Date.now(), technicalName: oMetadata.technicalName });
                return;
            }

            // todo: [FLPCOREANDUX-10024] clarify whether there is an actual use case of replace navigation which requires the steps above
            if (sEffectiveNavigationMode === NavigationMode.replace) {
                this.oShellNavigationInternal.setIsInitialNavigation(false);
                // restore hash
                this.bEnableHashChange = false;
                this._changeWindowLocation(oResolvedHashFragment.url);
                return;
            }

            // the navigation mode doesn't match any valid one.
            // In this case an error message is logged and previous hash is fetched
            await this.hashChangeFailure(
                this.history.getHistoryLength(),
                `Navigation mode '${sEffectiveNavigationMode}' was not recognized`,
                null,
                "sap.ushell.renderer.Shell.controller",
                false
            );
        },

        /**
         * Attempts opening the application via NWBC.
         *
         * @param {object} oResolvedHashFragment The resolved hash fragment
         * @returns {Promise<boolean>} Whether NWBC managed to open the application (resolved with either true or false)
         *
         * @private
         */
        _openAppViaNWBC: async function (oResolvedHashFragment, oOldResolvedHashFragment) {
            const bNwbcHandling = oResolvedHashFragment && (ushellUtils.isNativeWebGuiNavigation(oResolvedHashFragment) || oResolvedHashFragment.nativeNWBCNavigation);

            if (!bNwbcHandling) {
                return false;
            }

            const oEPCM = ushellUtils.getPrivateEpcm();
            const iEPCMNavigationMode = oEPCMNavigationMode[oResolvedHashFragment.navigationMode];

            let iMode;
            if (ushellUtils.hasNavigationModeCapability()) {
                iMode = iEPCMNavigationMode || oEPCMNavigationMode[NavigationMode.embedded];
            }

            const sUrlWithSapUser = await this._appendUserIdToUrl("sap-user", oResolvedHashFragment.url);
            const sUrlWithSapUserAndShellParam = await ushellUtils.appendSapShellParam(sUrlWithSapUser);

            const sAppType = oResolvedHashFragment.applicationType;
            const sFrameworkId = oResolvedHashFragment?.appCapabilities?.appFrameworkId;

            let oPostBodyParams;
            try {
                if (ushellUtils.isSAPLegacyApplicationType(sAppType, sFrameworkId)) {
                    const oFLPParams = Object.create(null);
                    const Navigation = await Container.getServiceAsync("Navigation");
                    const oAppStatesInfo = ushellUtils.getParamKeys(sUrlWithSapUserAndShellParam);

                    if (oAppStatesInfo.aAppStateNamesArray.length > 0) {
                        const aDataArray = await Navigation.getAppStateData(oAppStatesInfo.aAppStateKeysArray);
                        oAppStatesInfo.aAppStateNamesArray.forEach((item, index) => {
                            if (aDataArray[index]) {
                                oFLPParams[item] = aDataArray[index];
                            }
                        });
                    }

                    oFLPParams["sap-flp-url"] = Container.getFLPUrl(true);
                    oFLPParams["system-alias"] = oResolvedHashFragment.systemAlias;

                    oPostBodyParams = [{
                        name: "sap-flp-params",
                        value: JSON.stringify(oFLPParams)
                    }];
                }
            } catch {
                //nothing to do, we will open the app without the post params as before
            }

            try {
                EventBus.getInstance().publish("launchpad", "appOpening", oResolvedHashFragment);
                if (!oEPCM.doNavigate(sUrlWithSapUserAndShellParam, iMode, undefined, undefined, undefined, undefined, undefined, oPostBodyParams)) {
                    return false;
                }
                EventBus.getInstance().publish("sap.ushell", "appOpened", oResolvedHashFragment);

                await this._restoreAfterNwbcNavigation(oResolvedHashFragment, oOldResolvedHashFragment);
                /*
                 * TODO: This is a workaround.
                 * We should rather update the resolvedHashFragment before the navigation happens. Other Components listening
                 * to the appOpened event might rely on the correct navigationMode / targetNavigationMode of the
                 * resolvedHashFragment.
                 */

                // restore menu bar in case we are still on home
                if (this._oAppLifeCycleService.getCurrentApplication() && this._oAppLifeCycleService.getCurrentApplication().homePage) {
                    this._setMenuVisible(true);
                    this._setSideNavigationVisible(true);
                }

                return true;
            } catch (e) {
                if (e.stack) {
                    Log.error(`Application initialization failed due to an Exception:\n${e.stack}`);
                }
                await this.hashChangeFailure(this.history.getHistoryLength(), e.name, e.message, oResolvedHashFragment.text, false);
                return false;
            }
        },

        /**
         *
         * If a GUI application that was handled by NWBC was opened via deep link, a new tab is opened, which started the GUI.
         * Therefore, the current tab must navigate to the home page.
         *
         * In all other cases (non-deep link), it is sufficient
         * to navigate one step back in the browser history to restore the current hash.
         *
         * @param {object} oResolvedHashFragment The resolved hash fragment.
         * @returns {Promise} A Promise resolving when the hash is restored.
         * @private
         */
        _restoreAfterNwbcNavigation: async function (oResolvedHashFragment, oOldResolvedHashFragment) {
            if (this.history.getHistoryLength() === 1 && !this._oAppLifeCycleService.getCurrentApplication()) {
                // Deep link case
                const Navigation = await Container.getServiceAsync("Navigation");
                Navigation.navigate({ target: { shellHash: "#" }, writeHistory: false });
                return;
            }

            // Regular case
            this._restorePreviousHashAfterOpenNewWindow(oResolvedHashFragment, oOldResolvedHashFragment);
        },

        /**
         * Appends the ID of the user to the given URL.
         * The ID of the user is retrieved via the UserInfo service, and appended blindly to the given URL.
         * This method tries to detect whether a previous parameter was already appended
         * and use the <code>?</code> or <code>&</code> separator for the parameter accordingly.
         *
         * @param {string} sParamName The name of the parameter that needs to be appended.
         * @param {string} sUrl A URL with or without the sap-user parameter.
         * @returns {Promise<string>} The URL with the user id parameter appended.
         * @private
         */
        _appendUserIdToUrl: async function (sParamName, sUrl) {
            const UserInfo = await Container.getServiceAsync("UserInfo");
            const sUserId = UserInfo.getUser().getId();
            const sSep = sUrl.indexOf("?") >= 0 ? "&" : "?";
            return `${sUrl + sSep + sParamName}=${sUserId}`;
        },

        /**
         * The method restore the previous hash when app is opened in the new tab
         * @param {*} oResolvedHashFragment resolved hash fragment
         */
        _restorePreviousHashAfterOpenNewWindow: function (oResolvedHashFragment, oOldResolvedHashFragment) {
            this.history.pop();
            const oVarInstance = oResolvedHashFragment.componentHandle && oResolvedHashFragment.componentHandle.getInstance
                && oResolvedHashFragment.componentHandle.getInstance({});
            if (oVarInstance) {
                oVarInstance.destroy();
            }
            this._resumeAppRouterIgnoringCurrentHash();
            this.bRestorePreviousHash = true;
            this._windowHistoryBack(1);

            // set back the current application to be the one before this navigation occurred as current application is opened in a new window
            AppConfiguration.setCurrentApplication(oOldResolvedHashFragment);
            EventHub.emit("openedAppInNewWindow", Date.now());
        },

        _isShellHomeIntent: function (sIntent) {
            return sIntent === "#" || sIntent === oConfig.rootIntent;
        },

        /**
         * Adds a listener to the "appComponentLoaded" Event that is published by the "sap.ushell".
         * Once the "home app" Component is saved, the listener is removed, and this function will not do anything.
         */
        _saveHomePageComponent: function () {
            if (this.oHomeApp) {
                return;
            }

            const sContainerNS = "sap.ushell";
            function fListener (oEvent, sChannel, oData) {
                this.oHomeApp = oData.component;
                EventBus.getInstance().unsubscribe(sContainerNS, "appComponentLoaded", fListener, this);
            }
            EventBus.getInstance().subscribe(sContainerNS, "appComponentLoaded", fListener, this);
        },

        /**
         * Shows an error message and navigates to the previous page.
         *
         * @param {int} iHistoryLength the length of the history <b>before</b> the navigation occurred.
         * @param {string|object} vMessage the error message
         * @param {string|object} vDetails the detailed error message
         * @param {string} sComponent the component that generated the error message
         * @param {boolean} bEnableHashChange enable hash change
         * @returns {Promise} A promise resolving when the error message is shown.
         */
        hashChangeFailure: async function (iHistoryLength, vMessage, vDetails, sComponent, bEnableHashChange) {
            StateManager.discardStalledChanges();

            if (ushellUtils.isPlainObject(vMessage)) {
                this.reportError(vMessage.technicalMessage, vDetails.technicalMessage, sComponent);
                const MessageInternal = await Container.getServiceAsync("MessageInternal");
                MessageInternal.show(
                    MessageInternal.Type.ERROR,
                    vMessage.message,
                    {
                        title: vMessage.title,
                        details: vDetails
                    }
                );
            } else {
                this.reportError(vMessage, vDetails, sComponent);
                // use timeout to avoid "MessageService not initialized.: error
                this.delayedMessageError(ushellResources.i18n.getText("fail_to_start_app_try_later"));
            }
            closeAllDialogs = false;

            this._resumeAppRouterIgnoringCurrentHash();
            if (iHistoryLength === 0) {
                // if started with an illegal shell hash (deep link), we just remove the hash
                window.hasher.setHash("");
            } else if (new URLSearchParams(window.location.search).get("bFallbackToShellHome")) {
                // The previous url is not valid navigation
                window.hasher.setHash("");
            } else {
                // navigate to the previous URL since in this state the hash that has failed to load is in the URL.
                this.bEnableHashChange = bEnableHashChange;
                Container.setDirtyFlag(bPreviousPageDirty);
                this._windowHistoryBack(1);
            }
        },

        reportError: function (sMessage, sDetails, sComponent) {
            Log.error(sMessage, sDetails, sComponent);
        },

        delayedMessageError: async function (sMsg) {
            try {
                await ushellUtils.awaitTimeout(0);

                const MessageInternal = await Container.getServiceAsync("MessageInternal");
                MessageInternal.error(sMsg);
            } catch {
                // fail silently
            }
        },

        _checkWindowLocationSearch: function (sTerm) {
            return window.location.search.indexOf(sTerm) > -1;
        },

        _windowHistoryBack: function (iSteps) {
            window.history.go(-1 * iSteps);
        },

        _windowHistoryForward: function (iSteps) {
            window.history.go(iSteps);
        },

        _changeWindowLocation: function (sUrl) {
            window.location.href = sUrl;
        },

        _setMenuVisible: function (bVisible) {
            const navigationBar = document.getElementById(ShellArea.NavigationBar);
            if (!navigationBar) {
                return;
            }
            bVisible = bVisible ||
                (Config.last("/core/menu/enabled") &&
                Config.last("/core/menu/position") === "Top" &&
                Config.last("/core/menu/visibleInAllStates")); // visibleInAllStates:true has priority

            navigationBar.classList.toggle("sapUshellShellHidden", !bVisible);
        },

        _setSideNavigationVisible: function (bVisible) {
            const sideNavigation = document.getElementById(ShellArea.SideNavigation);
            if (!sideNavigation) {
                return;
            }
            bVisible = bVisible ||
                (Config.last("/core/menu/enabled") &&
                Config.last("/core/menu/position") === "Side" &&
                Config.last("/core/menu/visibleInAllStates")); // visibleInAllStates:true has priority

            sideNavigation.classList.toggle("sapUshellShellHidden", !bVisible);
        },

        /**
         * Triggered by the EventBus "appOpened" event.
         * Performs logging for recent activities and application usage
         *
         * @param {string} sChannelId The channelId of the event
         * @param {string} sEventId The event id
         * @param {object} oResolvedHashFragment The resolved hash fragment object belonging to the event
         */
        onAppOpened: function (sChannelId, sEventId, oResolvedHashFragment) {
            if (oResolvedHashFragment.targetNavigationMode !== "explace" && oResolvedHashFragment.targetNavigationMode !== "frameless") {
                this._setMenuVisible(false);
            }
            this._setSideNavigationVisible(true);

            const sAppHash = this.oShellNavigationInternal.hashChanger.getAppHash();
            const sAppPart = sAppHash ? `&/${sAppHash}` : null;

            this.logOpenAppAction(oResolvedHashFragment, sAppPart).catch(() => {
                Log.info("Opened application was not logged.", undefined, "sap.ushell.renderer.Shell.controller");
            });

            this._notifyUITracer(oResolvedHashFragment);
        },

        externalSearchTriggered: function (sChannelId, sEventId, oData) {
            Config.emit("/core/shell/model/searchTerm", oData.searchTerm);
            oData.query = oData.searchTerm;
        },

        onBeforeNavigate: function (oEvent) {
            const oToView = oEvent.getParameter("to");
            const oOwnerComponent = this.getOwnerComponent();

            const bToDashboardView = oToView === oOwnerComponent.byId("Shell-home-component-container");
            const bToPagesView = oToView === oOwnerComponent.byId("pages-component-container");
            const bToHomeAppView = oToView === oOwnerComponent.byId("homeApp-component-container");
            const bToWorkpagesView = oToView === oOwnerComponent.byId("workPageRuntime-component-container");
            const bToSwitcherView = oToView === oOwnerComponent.byId("runtimeSwitcher-component-container");
            const bMenuVisible = bToDashboardView || bToPagesView || bToHomeAppView || bToWorkpagesView || bToSwitcherView;

            AppLifeCycleAI.onBeforeNavigate(oEvent.getParameter("fromId"), oEvent.getParameter("from"), oEvent.getParameter("toId"), oEvent.getParameter("to"));
            this._setMenuVisible(bMenuVisible);
            this._setSideNavigationVisible(bMenuVisible);
        },

        onAfterNavigate: function (oEvent) {
            const sToId = oEvent.mParameters ? oEvent.mParameters.toId : undefined;

            const oDashboard = Element.getElementById("sapUshellDashboardPage");
            if (oDashboard) {
                oDashboard.setBlocked(false);
                oDashboard.setBusy(false);
            }

            AppLifeCycleAI.onAfterNavigate(oEvent.getParameter("fromId"), oEvent.getParameter("from"), sToId, oEvent.getParameter("to"));
            EventBus.getInstance().publish("sap.ushell", "navigated", {});
        },

        /**
         * Logs an application to the recent activities.
         *
         * @param {object} oResolvedHashFragment The resolved target intent
         * @param {string} sAppPart The inner app route part of the intent
         * @returns {Promise} A promise that is resolved once the action is logged
         * @throws {Error} If the application was not logged.
         */
        logOpenAppAction: async function (oResolvedHashFragment, sAppPart) {
            const bEnableRecentActivity = Config.last("/core/shell/enableRecentActivity") && Config.last("/core/shell/enableRecentActivityLogging");
            if (!bEnableRecentActivity) {
                throw new Error("Tracking of RecentActivity is disabled.");
            }

            const oMetadata = AppConfiguration.getMetadata(oResolvedHashFragment);
            // If the app is kept alive in the background, the fixedShellHash is often not supplied.
            // In these cases, we then try to get the hash from the current location.
            const sShellHash = oResolvedHashFragment.sFixedShellHash || this._getCurrentLocationHash();
            const oRecentEntry = {
                title: oMetadata.title,
                appType: AppType.APP, // default app type the shell adds is 'Application'
                url: sAppPart ? sShellHash + sAppPart : sShellHash
            };

            const oParsed = UrlParsing.parseShellHash(sShellHash);
            if (oParsed) {

                // This is the key that determines whether an existing activity should be updated or added.

                // In theory we could use the full hash without parameters here, however this causes the same application to be logged
                // multiple times with the same title, confusing the user.

                // Therefore we choose to update a previous entry in case just the parameters change. This might cause a bit of
                // confusion in case another target mapping is opened, as the title of a previously logged entry would be updated
                // instead of having a new title added to the recent activities (same target mapping but different title).

                // Perhaps this could be further fixed by hashing a target mapping on the client before returning the resolution
                // result, and using the hash as the id.
                oRecentEntry.appId = `#${UrlParsing.constructShellHash({
                    semanticObject: oParsed.semanticObject,
                    action: oParsed.action
                })}`;
            } else {
                oRecentEntry.appId = sShellHash;
            }

            // The recent activity for searches is done in a different way, see this._logSearchActivity
            if (sShellHash && sShellHash.indexOf("#Action-search") === -1 && sShellHash.indexOf("#Shell-startIntent") === -1) {
                await ushellUtils.awaitTimeout(1500);
                await this._logRecentActivity(oRecentEntry);
                return;
            }

            throw new Error("RecentActivity was not logged.");
        },

        /**
         * Notifies the UITracer service about the navigation (app launch) by emitting
         * a corresponding event on the event hub.
         *
         * @param {object} oResolvedHashFragment - the result of the NavTargetResolutionInternal service
         */
        _notifyUITracer: function (oResolvedHashFragment) {
            try {
                const sApplicationId =
                    oResolvedHashFragment.reservedParameters?.["sap-fiori-id"]?.[0] ||
                    oResolvedHashFragment.reservedParameters?.["sap-ui-app-id-hint"]?.[0] ||
                    oResolvedHashFragment.ui5ComponentName;

                EventHub.emit("UITracer.trace", {
                    reason: "NavigateApp",
                    source: "Intent",
                    data: {
                        applicationId: sApplicationId || "",
                        applicationType: oResolvedHashFragment.applicationType || "",
                        hash: oResolvedHashFragment.sFixedShellHash || "",
                        targetNavigationMode: oResolvedHashFragment.targetNavigationMode || "",
                        providerId: oResolvedHashFragment.contentProviderId || "",
                        targetUrl: oResolvedHashFragment.url || ""
                    }
                });
            } catch (ex) {
                Log.warning("Could not emit UITracer.trace event", ex, "sap.ushell.renderer.Shell.controller");
            }
        },

        // Special logic for Search.
        // The search activity must be logged even after a user makes different searches in a single #Action-search session.
        // Therefore, the logging should occur on the search event and not by the navigation to the search application.
        _logSearchActivity: function () {
            if (Config.last("/core/shell/enableRecentActivity") && Config.last("/core/shell/enableRecentActivityLogging")) {
                let sTitle = "";
                try {
                    sTitle = Element.getElementById("searchFieldInShell-input").getModel().getLastSearchTerm();
                } catch (ex) {
                    Log.error("Shell: last search term is not available to log a recent activity");
                }
                this._logRecentActivity({
                    appId: "#Action-search",
                    appType: AppType.SEARCH,
                    title: sTitle,
                    url: `#${window.hasher.getHash()}`
                }).catch(() => {
                    Log.info("Search activity was not logged.", undefined, "sap.ushell.renderer.Shell.controller");
                });
            }
        },

        _loadCoreExtNonUI5: function (oAppTarget) {
            if (oAppTarget && oAppTarget.applicationType !== "SAPUI5") {
                this._loadCoreExt();
            }
        },

        /**
         * RendererExtensions plugins are loaded after the core-ext modules.
         * core-ext is loaded, either in first application load flow in case app is not FLP or explicitly by the Renderer (in this file) after FLP is loaded.
         * In any case, after we load the plugins, we also publish the event that all Core resources are loaded
         */
        _onCoreResourcesComplementLoaded: function () {
            ushellUtils.setPerformanceMark("SchedulingAgent-StartOfFlow");
            // Create delayed controls in the view
            const oView = this.getView();
            if (oView) { // some qUnits do not create the view
                oView.createPostCoreExtControls();
            }

            SchedulingAgent._initialize();

            EventHub.emit("startScheduler");
        },

        /**
         * After core-ext is loaded (see_onCoreResourcesComplementLoaded) the renderer extensions plugins can be loaded.
         * To enable the Scheduling Agent to direct this the loading is wrapped in this function.
         */
        _loadRendererExtensionPlugins: async function (eventData) {
            const oUriParameters = new URLSearchParams(window.location.search);
            const bDelayPlugin = oUriParameters.get("sap-ushell-xx-pluginmode") === "delayed";

            const PluginManager = await Container.getServiceAsync("PluginManager");

            if (bDelayPlugin) {
                // delay loading by 5 sec.
                await ushellUtils.awaitTimeout(5000);
            }

            // load the plugins and always publish post events
            PluginManager
                .loadPlugins("RendererExtensions")
                // in addition we have to ensure the new EventHub Event is thrown
                .always(function fnPublishPostLoadingEvents () {
                    EventHub.emit("StepDone", eventData.stepName);
                });
        },

        // Triggers loading of the warmup plugins via Plugin Manager
        _loadWarmupPlugins: async function (eventData) {
            const PluginManager = await Container.getServiceAsync("PluginManager");

            PluginManager
                .loadPlugins("AppWarmup")
                .always(() => {
                    Log.debug("WARMUP plugins loaded", null, "sap.ushell.renderer.Shell");
                    EventHub.emit("StepDone", eventData.stepName);
                    ushellUtils.setPerformanceMark("SchedulingAgent-EndOfFlow");
                    ushellUtils.setPerformanceMeasure("SchedulingAgentTotalTime", "SchedulingAgent-StartOfFlow", "SchedulingAgent-EndOfFlow");
                });
        },

        // Triggers loading of CoreExt via EventHub
        _loadCoreExt: async function () {
            // Trigger oEventHub.once("loadCoreResourcesComplement") in case homepage is first rendered.
            // Usually this is done with resolveHashFragment, but without passing from that path we should trigger it actively.
            await Container.getServiceAsync("Ui5ComponentLoader");

            EventHub.emit("loadCoreResourcesComplement", Date.now());
        },

        getRightFloatingContainerVisibility: function () {
            const oRightFloatingContainer = this.getView().getRightFloatingContainer();
            return oRightFloatingContainer && oRightFloatingContainer.getVisible();
        },

        setHeaderTitle: function (sTitle) {
            StateManager.updateAllBaseStates("header.secondTitle", Operation.Set, sTitle || "");
        },

        setNavigationBar: function (oNavigationBar) {
            oNavigationBar.placeAt(ShellArea.NavigationBar, "only");
            this.addDanglingControl(oNavigationBar);
        },

        setSideNavigation: function (oSideNavigation) {
            oSideNavigation.placeAt(ShellArea.SideNavigation, "only");
            this.addDanglingControl(oSideNavigation);
        },

        setShellShapes: function (oShellShapes) {
            if (oShellShapes.placeAt) {
                oShellShapes.placeAt(ShellArea.ShellShapes, "only");
                this.addDanglingControl(oShellShapes);
            } else if (oShellShapes instanceof Node) {
                document.getElementById(ShellArea.ShellShapes).appendChild(oShellShapes);
            }
        },

        setFooter: function (oFooter) {
            if (typeof oFooter !== "object" || !oFooter.getId) {
                throw new Error("oFooter value is invalid");
            }

            const sOldFooterId = this.getFooterId();
            if (sOldFooterId) {
                Log.warning(`You can only set one footer. Replacing existing footer "${sOldFooterId}", with the new footer "${oFooter.getId()}".`);
            }

            StateManager.updateAllBaseStates("footer.content", Operation.Set, oFooter.getId());
            oFooter.placeAt(ShellArea.Footer, "only");
            this.addDanglingControl(oFooter);

            if (oFooter._applyContextClassFor) {
                oFooter._applyContextClassFor("footer");
            }
        },

        getFooterId: function () {
            return ShellModel.getModel().getProperty("/footer/content");
        },

        removeFooter: function () {
            const sFooterId = this.getFooterId();

            if (sFooterId) {
                const oFooter = Element.getElementById(sFooterId);
                if (oFooter && oFooter.destroy) {
                    oFooter.destroy();
                }
            }

            StateManager.updateAllBaseStates("footer.content", Operation.Set, "");
        },

        addUserPreferencesEntry: function (entryObject, bGrouped) {
            this._validateUserPrefEntryConfiguration(entryObject, bGrouped);
            this._updateUserPrefModel(entryObject, bGrouped);
        },

        _validateUserPrefEntryConfiguration: function (entryObject, bGrouped) {
            if ((!entryObject) || (typeof entryObject !== "object")) {
                throw new Error("object oConfig was not provided");
            }

            if (!entryObject.title) {
                throw new Error("title was not provided");
            }

            if (!entryObject.value) {
                throw new Error("value was not provided");
            }

            if (typeof entryObject.entryHelpID !== "undefined") {
                if (typeof entryObject.entryHelpID !== "string") {
                    throw new Error("entryHelpID type is invalid");
                } else if (entryObject.entryHelpID === "") {
                    throw new Error("entryHelpID should not be an empty string");
                }
            }

            if (entryObject.title && typeof entryObject.title !== "string") {
                throw new Error("title type is invalid");
            }

            if (typeof entryObject.value !== "function" && typeof entryObject.value !== "string" && typeof entryObject.value !== "number") {
                throw new Error("value type is invalid");
            }

            [
                "onSave",
                "content",
                "onCancel"
            ].forEach((sPropertyName) => {
                if (entryObject[sPropertyName] && typeof entryObject[sPropertyName] !== "function") {
                    throw new Error(`"${sPropertyName}" type is "${typeof entryObject[sPropertyName]}" but should be a function`);
                }
            });

            if (bGrouped) {
                [
                    {
                        name: "groupingId",
                        type: "string"
                    },
                    {
                        name: "groupingTabTitle",
                        type: "string"
                    },
                    {
                        name: "groupingTabHelpId",
                        type: "string"
                    }
                ].forEach((oProperty) => {
                    if (!entryObject[oProperty.name]) {
                        throw new Error(`${oProperty.name} is missing`);
                    } else if (typeof entryObject[oProperty.name] !== oProperty.type) {
                        throw new Error(`"${oProperty.name}" type is "${typeof entryObject[oProperty.name]}" but should be a "${oProperty.type}"`);
                    }
                });
            }
        },

        _createSessionHandler: function (oSessionConfig) {
            const iLazyCreationTime = 20000;

            sap.ui.require(["sap/ushell/SessionHandler"], (SessionHandler) => {
                this.oSessionHandler = new SessionHandler(AppLifeCycleAI);
                //we need to immediately init the logout logic that is needed
                //for cFLP without any delay
                this.oSessionHandler.initLogout();
                window.setTimeout(() => {
                    this.oSessionHandler.init({
                        sessionTimeoutReminderInMinutes: oSessionConfig.sessionTimeoutReminderInMinutes,
                        sessionTimeoutIntervalInMinutes: oSessionConfig.sessionTimeoutIntervalInMinutes,
                        sessionTimeoutTileStopRefreshIntervalInMinutes: oSessionConfig.sessionTimeoutTileStopRefreshIntervalInMinutes,
                        enableAutomaticSignout: oSessionConfig.enableAutomaticSignout
                    });
                }, iLazyCreationTime);
            });
        },

        _getSessionHandler: function () {
            return this.oSessionHandler;
        },

        _navBack: function () {
            // set meAria as closed when navigating back
            this.setUserActionsMenuSelected(false);
            RelatedServices.navigateBack();
        },

        _updateUserPrefModel: function (entryObject, bGrouped) {
            const oNewEntry = this._getModelEntryFromEntryObject(entryObject);
            let aEntries = Config.last("/core/userPreferences/entries") || [];

            if (bGrouped) {
                oNewEntry.groupingEnablement = true;
                oNewEntry.groupingId = entryObject.groupingId;
                oNewEntry.groupingTabTitle = entryObject.groupingTabTitle;
                oNewEntry.groupingTabHelpId = entryObject.groupingTabHelpId;
            }

            aEntries.push(oNewEntry);
            // Re-order the entries array to have the Home Page entry right after the Appearance entry (if both exist)
            aEntries = this._reorderUserPrefEntries(aEntries);
            Config.emit("/core/userPreferences/entries", aEntries);
        },

        _getModelEntryFromEntryObject: function (entryObject) {
            return {
                id: ushellUtils._getUid(),
                entryHelpID: entryObject.entryHelpID,
                title: entryObject.title,
                valueArgument: entryObject.value,
                valueResult: null,
                onSave: entryObject.onSave,
                onCancel: entryObject.onCancel,
                contentFunc: entryObject.content,
                contentResult: null,
                icon: entryObject.icon,
                provideEmptyWrapper: entryObject.provideEmptyWrapper
            };
        },

        _reorderUserPrefEntries: function (aEntries) {
            const aNewEntries = [];
            const aOrderedIds = [
                "userAccountEntry",
                "themes",
                "language",
                "notificationsEntry",
                "homepageEntry",
                "spacesEntry",
                "userActivitiesEntry",
                "userDefaultEntry"
            ];
            const mSpecialEntries = {};

            for (let i = aEntries.length - 1; i >= 0; i--) {
                if (aOrderedIds.indexOf(aEntries[i].id) !== -1) {
                    const oSpecialEntry = aEntries.splice(i, 1)[0];
                    mSpecialEntries[oSpecialEntry.id] = oSpecialEntry;
                }
            }

            aOrderedIds.forEach((sId) => {
                const oEntry = mSpecialEntries[sId];
                if (oEntry) {
                    aNewEntries.push(oEntry);
                }
            });

            return aNewEntries.concat(aEntries);
        },

        _getConfig: function () {
            return oConfig || {};
        },

        _getPersData: async function (oPersonalizationId) {
            const oComponent = Component.getOwnerComponentFor(this.getView());
            const PersonalizationV2 = await Container.getServiceAsync("PersonalizationV2");
            const oScope = {
                keyCategory: PersonalizationV2.KeyCategory.FIXED_KEY,
                writeFrequency: PersonalizationV2.WriteFrequency.LOW,
                clientStorageAllowed: true
            };
            const oPersonalizer = await PersonalizationV2.getPersonalizer(oPersonalizationId, oScope, oComponent);
            return oPersonalizer.getPersData();
        },

        // encapsulate access to location so that we can stub it easily in tests
        _getCurrentLocationHash: function () {
            return window.location.hash;
        },

        setUserActionsMenuSelected: function (bSelected) {
            EventHub.emit("showUserActionsMenu", bSelected);
        },

        setNotificationsSelected: function (bSelected) {
            EventHub.emit("showNotifications", bSelected);
        },

        _isFLPIntent: function (sHash) {
            const sBasicHash = UrlParsing.getBasicHash(sHash);
            const aFLPIntents = [
                "Shell-home",
                "Shell-appfinder",
                "Launchpad-openFLPPage",
                "Launchpad-openWorkPage"
            ];

            return aFLPIntents.some((sIntent) => sBasicHash === sIntent);
        }
    });
});
