// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/* global QUnit, sinon, hasher */

/**
 * @fileOverview QUnit tests for sap.ushell.renderer.Shell
 */
sap.ui.define([
    "sap/base/Log",
    "sap/base/i18n/Localization",
    "sap/base/util/Deferred",
    "sap/base/util/deepClone",
    "sap/base/util/extend",
    "sap/base/util/ObjectPath",
    "sap/m/BusyDialog",
    "sap/ui/core/Theming",
    "sap/ui/core/Element",
    "sap/ui/core/EventBus",
    "sap/ui/core/library",
    "sap/ui/core/RenderManager",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "sap/ui/performance/trace/Interaction",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/ApplicationType",
    "sap/ushell/bootstrap/SchedulingAgent",
    "sap/ushell/components/applicationIntegration/application/BlueBoxHandler",
    "sap/ushell/components/applicationIntegration/application/PostMessageUtils",
    "sap/ushell/components/applicationIntegration/AppLifeCycle",
    "sap/ushell/components/applicationIntegration/Storage",
    "sap/ushell/components/applicationIntegration/relatedServices/RelatedServices",
    "sap/ushell/components/container/ApplicationContainer",
    "sap/ushell/Config",
    "sap/ushell/Container",
    "sap/ushell/EventHub",
    "sap/ushell/library",
    "sap/ushell/renderer/History",
    "sap/ushell/resources",
    "sap/ushell/services/AppConfiguration",
    "sap/ushell/services/Message",
    "sap/ushell/utils",
    "sap/ushell/utils/UrlParsing",
    "sap/ushell/utils/WindowUtils",
    "sap/ushell/renderer/ShellLayout",
    "sap/ushell/renderer/Shell.controller",
    "sap/ushell/renderer/Shell.view",
    "sap/ui/thirdparty/URI",
    "sap/ui/qunit/utils/nextUIUpdate",
    "sap/ushell/state/StateManager",
    "sap/ushell/state/ShellModel",
    "sap/ushell/ui5service/ShellUIServiceFactory",
    "sap/m/InstanceManager",
    "sap/ushell/test/utils"
], (
    Log,
    Localization,
    Deferred,
    deepClone,
    extend,
    ObjectPath,
    BusyDialog,
    Theming,
    Element,
    EventBus,
    coreLibrary,
    RenderManager,
    Controller,
    Ui5History,
    JSONModel,
    Interaction,
    jQuery,
    ApplicationType,
    SchedulingAgent,
    BlueBoxHandler,
    PostMessageUtils,
    AppLifeCycleAI,
    Storage,
    RelatedServices,
    ApplicationContainer,
    Config,
    Container,
    EventHub,
    ushellLibrary,
    History,
    resources,
    AppConfiguration,
    MessageService,
    ushellUtils,
    UrlParsing,
    WindowUtils,
    ShellLayout,
    ShellController,
    ShellView,
    URI,
    nextUIUpdate,
    StateManager,
    ShellModel,
    ShellUIServiceFactory,
    InstanceManager,
    testUtils
) => {
    "use strict";

    // shortcut for sap.ushell.AppType
    const AppType = ushellLibrary.AppType;

    // shortcut for sap.ui.core.routing.HistoryDirection
    const Ui5HistoryDirection = coreLibrary.routing.HistoryDirection;

    // shortcut for sap.ushell.renderer.ShellLayout.ShellArea
    const ShellArea = ShellLayout.ShellArea;

    // overwrite the private methods which change the window context to prevent
    // loss of context in tests, which are not stubbed correctly.
    ShellController.prototype._windowHistoryBack = function () {
        throw new Error("_windowHistoryBack was called directly without a stub");
    };
    ShellController.prototype._windowHistoryForward = function () {
        throw new Error("_windowHistoryForward was called directly without a stub");
    };
    ShellController.prototype._changeWindowLocation = function () {
        throw new Error("_changeWindowLocation was called directly without a stub");
    };

    QUnit.config.reorder = false;

    sinon.addBehavior("resolvesDeferred", (oStub, vValue) => {
        return oStub.returns(new jQuery.Deferred().resolve(vValue).promise());
    });
    sinon.addBehavior("rejectsDeferred", (oStub, vValue) => {
        return oStub.returns(new jQuery.Deferred().reject(vValue).promise());
    });
    const sandbox = sinon.sandbox.create();

    let fnGetCoreRTLStub;

    function createMockedView (oShellModel) {
        return {
            createPostCoreExtControls: sandbox.stub(),
            getViewData: sandbox.stub().returns({ shellModel: oShellModel }),
            setModel: sandbox.stub(),
            oShellHeader: { setModel: sandbox.stub() }
        };
    }

    QUnit.module("Scheduling tests", {
        beforeEach: async function () {
            window.location.hash = "";
            const oConfig = ObjectPath.create("sap-ushell-config.renderers.fiori2.componentData.config");
            oConfig.rootIntent = "Shell-home";

            await Container.init("local");

            this.oController = await Controller.create({ name: "sap.ushell.renderer.Shell" });
            sandbox.stub(this.oController, "_windowHistoryBack");
            sandbox.stub(this.oController, "_windowHistoryForward");

            this.oDoables = this.oController._registerAndCreateEventHubDoables();
        },
        afterEach: function () {
            sandbox.restore();
            EventHub._reset();
            this.oController.onExit(); // Only called automatically when connected to a view
            this.oController.destroy();
            StateManager.resetAll();
        }
    });

    QUnit.test("_onCoreResourcesComplementLoaded starts the Scheduling Agent", function (assert) {
        // Arrange
        const fnDone = assert.async();
        sandbox.stub(SchedulingAgent, "_initialize");

        // Act
        EventHub.emit("CoreResourcesComplementLoaded");

        // Assert
        EventHub.wait("CoreResourcesComplementLoaded").then(() => {
            EventHub.once("CoreResourcesComplementLoaded").do(() => {
                assert.ok(SchedulingAgent._initialize.called, "The Scheduling Agent was initialized");
                EventHub.once("startScheduler").do(() => {
                    assert.ok(true, "The Scheduling Agent was started");
                    fnDone();
                });
            });
        });
    });

    QUnit.test("The event loadRendererExtensions triggers the loading of the Renderer Plugins", function (assert) {
        // Arrange
        const fnDone = assert.async();

        sandbox.stub(Container, "getServiceAsync");
        Container.getServiceAsync.withArgs("PluginManager").resolves({
            loadPlugins: sandbox.stub().resolvesDeferred()
        });
        Container.getServiceAsync.callThrough();

        // Act
        EventHub.emit("loadRendererExtensions", { stepName: "myDupiStep" });

        // Assert
        EventHub.wait("loadRendererExtensions").then(() => {
            EventHub.once("StepDone").do((eventData) => {
                assert.ok(true, "StepDone was emitted");
                assert.strictEqual(eventData, "myDupiStep", "StepDone was emitted with the correct step name.");
                fnDone();
            });
        });
    });

    QUnit.test("The event loadTrackingActivitiesSetting triggers the loading of the tracking activities and enables it", function (assert) {
        // Arrange
        const fnDone = assert.async();
        sandbox.stub(this.oController, "_getPersData").resolves();
        const oShellModel = Config.createModel("/core/shell/model", JSONModel);
        sandbox.stub(this.oController, "getView").returns(createMockedView(oShellModel));

        // Act
        EventHub.emit("loadTrackingActivitiesSetting", { stepName: "myDupiStep" });

        // Assert
        EventHub.wait("loadTrackingActivitiesSetting").then(() => {
            EventHub.once("StepDone").do((eventData) => {
                assert.ok(true, "StepDone was emitted");
                assert.strictEqual(eventData, "myDupiStep", "StepDone was emitted with the correct step name.");
                assert.strictEqual(ShellModel.getConfigModel().getProperty("/enableTrackingActivity"), true, "The activity tracking was enabled");
                fnDone();
            });
        });
    });

    QUnit.test("The event loadTrackingActivitiesSetting triggers the loading of the tracking activities and disables it if the personalization cannot be read", function (assert) {
        // Arrange
        const fnDone = assert.async();
        sandbox.stub(this.oController, "_getPersData").rejects();
        const oShellModel = Config.createModel("/core/shell/model", JSONModel);
        sandbox.stub(this.oController, "getView").returns(createMockedView(oShellModel));

        // Act
        EventHub.emit("loadTrackingActivitiesSetting", { stepName: "myDupiStep" });

        // Assert
        EventHub.wait("loadTrackingActivitiesSetting").then(() => {
            EventHub.once("StepDone").do((eventData) => {
                assert.ok(true, "StepDone was emitted");
                assert.strictEqual(eventData, "myDupiStep", "StepDone was emitted with the correct step name.");
                assert.strictEqual(ShellModel.getConfigModel().getProperty("/enableTrackingActivity"), false, "The activity tracking was disabled");
                fnDone();
            });
        });
    });


    QUnit.test("The event loadWarmupPlugins triggers the loading of the warmup plugins", function (assert) {
        // Arrange
        const fnDone = assert.async();

        sandbox.stub(Container, "getServiceAsync");
        Container.getServiceAsync.withArgs("PluginManager").resolves({
            loadPlugins: sandbox.stub().resolvesDeferred()
        });
        Container.getServiceAsync.callThrough();

        // Act
        EventHub.emit("loadWarmupPlugins", { stepName: "myDupiStep" });

        // Assert
        EventHub.wait("loadWarmupPlugins").then(() => {
            EventHub.once("StepDone").do((eventData) => {
                assert.ok(true, "StepDone was emitted");
                assert.strictEqual(eventData, "myDupiStep", "StepDone was emitted with the correct step name.");
                fnDone();
            });
        });
    });


    QUnit.module("sap.ushell.renderer.Shell - Fiori 2.0 Configuration ON", {
        beforeEach: async function () {
            window["sap-ushell-config"] = {};
            window["sap-ushell-config"].renderers = { fiori2: { componentData: { config: { enableNotificationsUI: true } } } };

            await Container.init("local");
            this.ShellNavigationInternal = await Container.getServiceAsync("ShellNavigationInternal");
            this.oInitStub = sandbox.stub(this.ShellNavigationInternal, "init");

            this.oController = await Controller.create({ name: "sap.ushell.renderer.Shell" });
            const oShellModel = Config.createModel("/core/shell/model", JSONModel);

            this.oController.getView = sandbox.stub().returns(createMockedView(oShellModel));
            this.oController.history = History;
            this.oController.oShellNavigationInternal = this.ShellNavigationInternal;
            sandbox.stub(this.oController, "_windowHistoryBack");
            sandbox.stub(this.oController, "_windowHistoryForward");

            this.oBusyDialogOpenStub = sandbox.stub(BusyDialog.prototype, "open");
        },
        afterEach: async function () {
            sandbox.restore();

            Container.resetServices();
            EventHub._reset();
            StateManager.resetAll();
            this.oController.onExit(); // Only called automatically when connected to a view
            this.oController.destroy();
        }
    });

    QUnit.test("test _reorderUserPrefEntries", function (assert) {
        const aEntries = [
            { id: "testId1" },
            { id: "userActivitiesEntry" },
            { id: "language" },
            { id: "homepageEntry" },
            { id: "userDefaultEntry" },
            { id: "notificationsEntry" },
            { id: "spacesEntry" },
            { id: "themes" },
            { id: "testId2" },
            { id: "userAccountEntry" }
        ];
        const aExpectedReorderedEntries = [
            { id: "userAccountEntry" },
            { id: "themes" },
            { id: "language" },
            { id: "notificationsEntry" },
            { id: "homepageEntry" },
            { id: "spacesEntry" },
            { id: "userActivitiesEntry" },
            { id: "userDefaultEntry" },
            { id: "testId1" },
            { id: "testId2" }
        ];

        const aResult = this.oController._reorderUserPrefEntries(aEntries);

        assert.deepEqual(aResult, aExpectedReorderedEntries, "Entries have been reordered correctly.");
    });

    QUnit.test("test _reorderUserPrefEntries with only some of the entries", function (assert) {
        const aEntries = [
            { id: "userDefaultEntry" },
            { id: "homepageEntry" },
            { id: "userAccountEntry" },
            { id: "homepageEntry" },
            { id: "notificationsEntry" },
            { id: "spacesEntry" }
        ];
        const aExpectedReorderedEntries = [
            { id: "userAccountEntry" },
            { id: "notificationsEntry" },
            { id: "homepageEntry" },
            { id: "spacesEntry" },
            { id: "userDefaultEntry" }
        ];

        const aResult = this.oController._reorderUserPrefEntries(aEntries);

        assert.deepEqual(aResult, aExpectedReorderedEntries, "Entries have been reordered correctly.");
    });

    QUnit.test("ASYNC - test_allowupToThreeFlpActionsInShellHeader", function (assert) {
        // destroy old controller it will be recreated in the test
        this.oController.destroy();
        this.oController.onExit(); // Only called automatically when connected to a view

        const done = assert.async();
        const sapUshellConfig = {
            enablePersonalization: true,
            moveAppFinderActionToShellHeader: true,
            moveUserSettingsActionToShellHeader: true,
            moveContactSupportActionToShellHeader: true,
            moveEditHomePageActionToShellHeader: true
        };
        sandbox.stub(ShellView.prototype, "getViewDataConfig").returns(sapUshellConfig);

        Container.createRendererInternal("fiori2").then((oRendererControl) => {
            EventHub.once("RendererLoaded").do(async () => {
                // wait for ShellNavigationInitialized event
                await testUtils.waitForEventHubEvent("ShellNavigationInitialized");

                const oController = Element.getElementById("mainShell").getController();

                oController.getView()._allowUpToThreeActionInShellHeader(sapUshellConfig);

                assert.strictEqual(sapUshellConfig.moveContactSupportActionToShellHeader, true, "moveContactSupportActionToShellHeader should be set to true ");
                assert.strictEqual(sapUshellConfig.moveEditHomePageActionToShellHeader, false, "moveEditHomePageActionToShellHeader should be set to false ");
                assert.strictEqual(sapUshellConfig.moveAppFinderActionToShellHeader, true, "moveAppFinderActionToShellHeader should be set to true ");
                assert.strictEqual(sapUshellConfig.moveUserSettingsActionToShellHeader, true, "moveUserSettingsActionToShellHeader should be set to true ");

                await oRendererControl.destroy();
                done();
            });
        });
    });

    QUnit.module("sap.ushell.renderer.Shell", {
        beforeEach: async function (assert) {
            window.location.hash = "";

            await Container.init("local");

            this.NavTargetResolutionInternal = await Container.getServiceAsync("NavTargetResolutionInternal");
            sandbox.stub(this.NavTargetResolutionInternal, "resolveHashFragment");
            this.NavTargetResolutionInternal.resolveHashFragment.resolvesDeferred({ url: "/from/service" });

            this.ShellNavigationInternal = await Container.getServiceAsync("ShellNavigationInternal");
            sandbox.stub(this.ShellNavigationInternal, "init");

            BusyDialog.prototype.open = sandbox.stub();

            this.oController = await Controller.create({ name: "sap.ushell.renderer.Shell" });
            this.oController.bEnableHashChange = true;

            const oShellModel = Config.createModel("/core/shell/model", JSONModel);

            this.oController.getView = sandbox.stub().returns(createMockedView(oShellModel));
            this.oController.history = History;
            this.oController.oShellNavigationInternal = this.ShellNavigationInternal;
            sandbox.stub(this.oController, "delayedMessageError"); // prevent showing error popup
            sandbox.stub(this.oController, "_windowHistoryBack");
            sandbox.stub(this.oController, "_windowHistoryForward");

            sandbox.stub(AppConfiguration, "setCurrentApplication");
            BlueBoxHandler._destroyAllApplicationContainer();
        },
        // This method is called after each test. Add every restoration code here.
        afterEach: function () {
            window.location.hash = "";

            if (fnGetCoreRTLStub) {
                Localization.getRTL = fnGetCoreRTLStub;
            }

            sandbox.restore();
            this.oController.onExit(); // Only called automatically when connected to a view
            this.oController.destroy();
            StateManager.resetAll();

            EventHub._reset();
        }
    });

    const sBasicShellHash = "#hash";
    const sOldShellHash = "#oldHash";
    const sOldAppPart = "oldAppPart";
    const sAppPart = "AppPart";

    /**
     * Test the behavior of doHashChange with cold start promise.
     */
    [{
        testDescription: "sap-ushell-async-libs-promise-directstart does not exist",
        bDirectStartPromiseLoadsComponent: false,
        bInjectPromiseInWindow: false,
        bIsUi5Target: true,
        expectedResolveHashFragmentCalls: 1,
        expectedResolvedHashFragment: {
            sFixedShellHash: "#hash",
            url: "/from/service",
            ui5ComponentName: "fake.ui5.component",
            navigationMode: "embedded" // fallback
        },
        expectedLoadComponentCalls: 1
    }, {
        testDescription: "sap-ushell-async-libs-promise-directstart exists with ui5 target direct started",
        bDirectStartPromiseLoadsComponent: true, // ui5 component loaded early
        bInjectPromiseInWindow: true,
        bIsUi5Target: true,
        expectedResolveHashFragmentCalls: 0,
        expectedResolvedHashFragment: {
            sFixedShellHash: "#hash",
            url: "/from/promise",
            ui5ComponentName: "fake.ui5.component",
            componentHandle: { fake: "componentHandle" },
            navigationMode: "embedded"
        },
        expectedLoadComponentCalls: 0
    }, {
        testDescription: "sap-ushell-async-libs-promise-directstart exists with non-ui5 target direct started",
        bDirectStartPromiseLoadsComponent: false, // non-ui5 target
        bInjectPromiseInWindow: true,
        bIsUi5Target: false,
        expectedResolveHashFragmentCalls: 0,
        expectedResolvedHashFragment: {
            sFixedShellHash: "#hash",
            url: "/from/promise",
            navigationMode: "embedded"
        }, // takes resolved hash fragment from promise
        expectedLoadComponentCalls: 0 // Ui5ComponentLoader is NOT called for non-ui5 targets (would ignore it,
        // but we avoid stopping the current app's router in that case
    }].forEach((oFixture) => {
        QUnit.test(`doHashChange loads application component correctly when ${oFixture.testDescription}`, async function (assert) {
            const oResolvedHashFragment = { // shallow copy to avoid side effects
                ...oFixture.expectedResolvedHashFragment
            };

            if (oFixture.bIsUi5Target) {
                oResolvedHashFragment.ui5ComponentName = "fake.ui5.component";
            }

            // if component is loaded, the resolved hash fragment contains a componentHandle property
            if (oFixture.bDirectStartPromiseLoadsComponent) {
                oResolvedHashFragment.componentHandle = { fake: "componentHandle" };
                sandbox.stub(Storage, "get").returns({});
            }

            this.oController._loadCoreExt = sandbox.spy();
            this.oController.history = sandbox.spy();
            this.oController.history.hashChange = sandbox.spy();
            this.oController.history.getHistoryLength = sandbox.stub().returns(0);

            let oClonedResult;
            sandbox.stub(this.oController, "_resolveHashFragment").callsFake(async (...args) => {
                const oResult = await ShellController.prototype._resolveHashFragment.call(this.oController, ...args);

                oClonedResult = deepClone(oResult);
                return oResult;
            });

            this.NavTargetResolutionInternal.resolveHashFragment.resolvesDeferred(extend({ url: "/from/service" }, oResolvedHashFragment));

            sandbox.stub(Container, "getServiceAsync");
            const Ui5ComponentLoader = {
                createComponent: sandbox.stub().resolvesDeferred()
            };
            Container.getServiceAsync.withArgs("Ui5ComponentLoader").resolves(Ui5ComponentLoader);
            Container.getServiceAsync.callThrough();

            // simulate direct start promise in window
            const oOriginalDirectStartPromise = window["sap-ushell-async-libs-promise-directstart"];
            if (oFixture.bInjectPromiseInWindow) {
                window["sap-ushell-async-libs-promise-directstart"] = new Promise((resolve) => {
                    resolve({ resolvedHashFragment: extend({ url: "/from/promise" }, oResolvedHashFragment) });
                });
            } else {
                window["sap-ushell-async-libs-promise-directstart"] = undefined;
            }

            const oDeferred = this.oController.doHashChange(sBasicShellHash, sAppPart, sOldShellHash, sOldAppPart, null);
            await ushellUtils.promisify(oDeferred);

            const iResolveHashFragmentCalls = this.NavTargetResolutionInternal.resolveHashFragment.callCount;
            assert.strictEqual(iResolveHashFragmentCalls, oFixture.expectedResolveHashFragmentCalls, "NavTargetResolutionInternal#resolveHashFragment method was called correctly");
            assert.deepEqual(oClonedResult.resolvedHashFragment, oFixture.expectedResolvedHashFragment, "_resolveHashFragment resolved to the expected hash fragment");

            if (!oFixture.bDirectStartPromiseLoadsComponent && oFixture.bIsUi5Target) {
                assert.strictEqual(AppConfiguration.setCurrentApplication.callCount, 1, "setCurrentApplication was called");
            }
            assert.strictEqual(Ui5ComponentLoader.createComponent.callCount, oFixture.expectedLoadComponentCalls, "Ui5ComponentLoader.loadComponent was called correctly");

            // Cleanup
            window["sap-ushell-async-libs-promise-directstart"] = oOriginalDirectStartPromise;
        });
    });

    /**
     * Test the behavior of doHashChange with with different previous state.
     * Note that the new window is started without component creation and newWindow starting.
     */
    [{
        testDescription: "align to newWindow : start direct",
        bDirectStartPromiseLoadsComponent: false,
        bInjectPromiseInWindow: false,
        bIsUi5Target: true,
        alignedNavigationMode: "newWindow",
        expectedResolveHashFragmentCalls: 1,
        expectedOpenAppInNewWindowCalls: 1,
        expectedResolvedHashFragment: {
            url: "/from/service",
            sFixedShellHash: "#hash",
            ui5ComponentName: "fake.ui5.component",
            navigationMode: "newWindow"
        },
        expectedLoadComponentCalls: 0,
        applicationIsStatefulTypeCallCount: 0,
        getControlCallCount: 0,
        removeCenterViewPortCallCount: 0,
        expectedRemoteStart: true
    }, {
        testDescription: "align to embedded, start direct",
        bDirectStartPromiseLoadsComponent: false,
        bInjectPromiseInWindow: false,
        bIsUi5Target: true,
        alignedNavigationMode: "embedded",
        expectedResolveHashFragmentCalls: 1,
        expectedOpenAppInNewWindowCalls: 0,
        expectedResolvedHashFragment: {
            url: "/from/service",
            sFixedShellHash: "#hash",
            ui5ComponentName: "fake.ui5.component",
            navigationMode: "embedded"
        },
        expectedLoadComponentCalls: 1,
        applicationIsStatefulTypeCallCount: 1,
        getControlCallCount: 1,
        removeCenterViewPortCallCount: 1,
        expectedRemoteStart: true
    }].forEach((oFixture) => {
        QUnit.test(`doHashChange loads application component correctly when ${oFixture.testDescription}`, async function (assert) {
            // Hash change is enabled at the beginning of this test
            this.oController._setEnableHashChange(true);

            const oResolvedHashFragment = { // shallow copy to avoid side effects
                ...oFixture.expectedResolvedHashFragment
            };

            if (oFixture.bIsUi5Target) {
                oResolvedHashFragment.ui5ComponentName = "fake.ui5.component";
            }

            // if component is loaded, the resolved hash fragment contains a componentHandle property
            if (oFixture.bDirectStartPromiseLoadsComponent) {
                oResolvedHashFragment.componentHandle = { fake: "componentHandle" };
            }

            this.oController._loadCoreExt = sandbox.spy();
            this.oController.history = sandbox.spy();
            this.oController.history.hashChange = sandbox.spy();
            this.oController.history.getHistoryLength = sandbox.stub().returns(0);
            this.oController.history.pop = sandbox.spy();

            sandbox.spy(this.oController, "_resolveHashFragment");
            sandbox.stub(this.oController, "_setEffectiveNavigationMode").callsFake((oResolvedHashFragment) => {
                oResolvedHashFragment.navigationMode = oFixture.alignedNavigationMode;
            });
            sandbox.stub(AppLifeCycleAI, "handleCreateApplicationContainer").resolves();

            const oOpenURLStub = sandbox.stub(WindowUtils, "openURL");

            this.NavTargetResolutionInternal.resolveHashFragment.resolvesDeferred(extend({ url: "/from/service" }, oResolvedHashFragment));

            sandbox.stub(Container, "getServiceAsync");
            const Ui5ComponentLoader = {
                createComponent: sandbox.stub().resolvesDeferred()
            };
            Container.getServiceAsync.withArgs("Ui5ComponentLoader").resolves(Ui5ComponentLoader);
            Container.getServiceAsync.callThrough();

            // simulate direct start promise in window
            const oOriginalDirectStartPromise = window["sap-ushell-async-libs-promise-directstart"];
            if (oFixture.bInjectPromiseInWindow) {
                window["sap-ushell-async-libs-promise-directstart"] = new Promise((resolve) => {
                    resolve({ resolvedHashFragment: extend({ url: "/from/promise" }, oResolvedHashFragment) });
                });
            } else {
                window["sap-ushell-async-libs-promise-directstart"] = undefined;
            }

            const oDeferred = this.oController.doHashChange(sBasicShellHash, sAppPart, sOldShellHash, sOldAppPart, null);
            await ushellUtils.promisify(oDeferred);

            // promise from _resolveHashFragment not resolveHashFragment
            const oResult = await this.oController._resolveHashFragment.getCall(0).returnValue;

            const iResolveHashFragmentCalls = this.NavTargetResolutionInternal.resolveHashFragment.callCount;
            assert.strictEqual(iResolveHashFragmentCalls, oFixture.expectedResolveHashFragmentCalls, "NavTargetResolutionInternal#resolveHashFragment method was called correctly");
            assert.deepEqual(oResult.resolvedHashFragment, oFixture.expectedResolvedHashFragment, "_resolveHashFragment resolved to the expected hash fragment");

            const iExpectedSetCurrentApplicationCalls = oFixture.alignedNavigationMode === "newWindow" ? 2 : 1;
            assert.strictEqual(AppConfiguration.setCurrentApplication.callCount, iExpectedSetCurrentApplicationCalls, "setCurrentApplication was called");
            assert.strictEqual(Ui5ComponentLoader.createComponent.callCount, oFixture.expectedLoadComponentCalls, "Ui5ComponentLoader.loadComponent was called correctly");
            assert.strictEqual(oOpenURLStub.callCount, oFixture.expectedOpenAppInNewWindowCalls, "openURL was called correctly");

            // Cleanup
            window["sap-ushell-async-libs-promise-directstart"] = oOriginalDirectStartPromise;
        });
    });

    /**
     * Test the behavior of _setEffectiveNavigationMode with with different previous state
     * Note that the new window is started without component creation and newWindow starting
     */
    [{
        testDescription: "native navigation",
        sUi5HistoryDirection: Ui5HistoryDirection.Unknown,
        isNative: true,
        oParsedShellHash: {},
        isColdStart: false,
        sCurrentLocationHash: "#AA-bb?def=jjj",
        oResolutionResult: { url: "/from/service", ui5ComponentName: "fake.ui5.component", navigationMode: "newWindowThenEmbedded" },
        expectedResolvedHashFragment: { url: "/from/service", ui5ComponentName: "fake.ui5.component", navigationMode: "newWindow" }
    }, {
        testDescription: "non-native navigation coldstart",
        sUi5HistoryDirection: Ui5HistoryDirection.Unknown,
        isNative: true,
        oParsedShellHash: {},
        isColdStart: true,
        sCurrentLocationHash: "#AA-bb?def=jjj",
        oResolutionResult: { url: "/from/service", ui5ComponentName: "fake.ui5.component", navigationMode: "newWindowThenEmbedded" },
        expectedResolvedHashFragment: { url: "/from/service", ui5ComponentName: "fake.ui5.component", navigationMode: "embedded" }
    }, {
        testDescription: "non-native navigation with inner-app route",
        sUi5HistoryDirection: Ui5HistoryDirection.Unknown,
        isNative: false,
        isColdStart: false,
        oParsedShellHash: {},
        sCurrentLocationHash: "#AA-bb?def=jjj&some/inner/app%20route",
        oResolutionResult: { url: "/from/service", ui5ComponentName: "fake.ui5.component", navigationMode: "newWindowThenEmbedded" },
        expectedResolvedHashFragment: { url: "#AA-bb?def=jjj&some/inner/app%20route", ui5ComponentName: "fake.ui5.component", navigationMode: "newWindow", applicationType: "URL" }
    }, {
        testDescription: "undefined",
        sUi5HistoryDirection: Ui5HistoryDirection.Unknown,
        isNative: false,
        isColdStart: false,
        oParsedShellHash: {},
        sCurrentLocationHash: "#AA-bb?def=jjj",
        oResolutionResult: undefined,
        expectedResolvedHashFragment: undefined
    }, {
        testDescription: "back navigation",
        sUi5HistoryDirection: Ui5HistoryDirection.Backwards,
        isNative: false,
        isColdStart: false,
        oParsedShellHash: {},
        sCurrentLocationHash: "#AA-bb?def=jjj",
        oResolutionResult: {
            url: "/from/service",
            ui5ComponentName: "fake.ui5.component",
            navigationMode: "newWindowThenEmbedded"
        },
        expectedResolvedHashFragment: {
            navigationMode: "embedded",
            ui5ComponentName: "fake.ui5.component",
            url: "/from/service"
        }
    }, {
        testDescription: "ex-place navigation for URLT application",
        sUi5HistoryDirection: Ui5HistoryDirection.Unknown,
        isNative: false,
        oParsedShellHash: {},
        isColdStart: false,
        sCurrentLocationHash: "#AA-bb?def=jjj",
        oResolutionResult: { url: "/from/service", applicationType: "URL", navigationMode: "newWindow", appCapabilities: { navigationMode: "embedded" } },
        expectedResolvedHashFragment: { url: "#AA-bb?def=jjj", applicationType: "URL", navigationMode: "newWindow", appCapabilities: { navigationMode: "embedded" } }
    }, {
        testDescription: "cold start of URLT application",
        sUi5HistoryDirection: Ui5HistoryDirection.Unknown,
        isNative: false,
        oParsedShellHash: {},
        isColdStart: true,
        sCurrentLocationHash: "#AA-bb?def=jjj",
        oResolutionResult: { url: "/from/service", applicationType: "URL", navigationMode: "newWindow", appCapabilities: { navigationMode: "embedded" } },
        expectedResolvedHashFragment: { url: "/from/service", applicationType: "URL", navigationMode: "embedded", appCapabilities: { navigationMode: "embedded" } }
    }].forEach((oFixture) => {
        QUnit.test(`_setEffectiveNavigationMode when ${oFixture.testDescription}`, function (assert) {
            sandbox.stub(Ui5History, "getInstance").returns({
                getDirection: function () {
                    return oFixture.sUi5HistoryDirection;
                }
            });
            sandbox.stub(ushellUtils, "isNativeWebGuiNavigation").returns(oFixture.isNative);
            // no need to restore stubs on controller, because every test creates a new instance
            sandbox.stub(ushellUtils, "isColdStart").returns(oFixture.isColdStart);
            sandbox.stub(this.oController, "_getCurrentLocationHash").returns(oFixture.sCurrentLocationHash);
            this.oController._setEffectiveNavigationMode(oFixture.oResolutionResult);
            assert.deepEqual(oFixture.oResolutionResult, oFixture.expectedResolvedHashFragment, "correct result");
        });
    });

    /**
     * Test the behavior of doHashChange
     */
    QUnit.test("test doHashChange with trampolin app", async function (assert) {
        this.oController._loadCoreExt = sandbox.spy();
        this.oController._requireCoreExt = sandbox.spy();
        this.oController.history = sandbox.spy();
        this.oController.history.hashChange = sandbox.spy();
        this.oController.history.getHistoryLength = sandbox.stub();
        this.oController.history.pop = sandbox.stub();
        this.oController.history.getHistoryLength.returns(0);
        const oResolvedHashFragment = {
            additionalInformation: "additionalInformation",
            url: "url",
            applicationType: "UI5",
            navigationMode: "embedded"
        };

        this.NavTargetResolutionInternal.resolveHashFragment.resolvesDeferred(oResolvedHashFragment);

        sandbox.stub(Container, "getServiceAsync");
        const oShellNavigationInternalFake = { toExternal: sandbox.spy() };
        Container.getServiceAsync.withArgs("ShellNavigationInternal").resolves(oShellNavigationInternalFake);
        Container.getServiceAsync.callThrough();

        const oComponent = {
            navigationRedirect: sandbox.stub().resolves("#RedirectMe-here"),
            destroy: sandbox.stub()
        };
        const oHandle = { getInstance: function () { return oComponent; } };
        sandbox.spy(this.oController, "_usesNavigationRedirect");

        oResolvedHashFragment.componentHandle = oHandle;
        oResolvedHashFragment.navigationMode = "embedded";
        // act
        const oDeferred = this.oController.doHashChange("Abc-def", null, "Abc-def", null);
        await ushellUtils.promisify(oDeferred);

        assert.strictEqual(this.oController._usesNavigationRedirect.callCount, 1, "redirect test called");
        assert.strictEqual(oShellNavigationInternalFake.toExternal.callCount, 1, "called ");
        assert.deepEqual(oShellNavigationInternalFake.toExternal.args[0][0], { target: { shellHash: "#RedirectMe-here" } }, " toExternal called with args");
        assert.strictEqual(oShellNavigationInternalFake.toExternal.args[0][1], undefined, " toExternal called with args");
        assert.strictEqual(oShellNavigationInternalFake.toExternal.args[0][2], false, "toExternal called with args");
        assert.strictEqual(this.oController.history.pop.callCount, 1, "history pop was called once");
    });

    QUnit.test("_resolveHashFragment: forces the root intent to 'embedded' navigationMode", function (assert) {
        const done = assert.async();
        sandbox.stub(this.oController, "_getConfig").returns({ rootIntent: "Root-intent" });

        sandbox.stub(Container, "getServiceAsync");
        Container.getServiceAsync.withArgs("NavTargetResolutionInternal").resolves({ // a fake service
            resolveHashFragment: sandbox.stub().returns(
                new jQuery.Deferred().resolve({ navigationMode: "newWindowThenEmbedded" }).promise()
            )
        });
        Container.getServiceAsync.callThrough();

        this.oController._resolveHashFragment("#Root-intent")
            .then((oResult) => {
                const oResolvedHashFragment = oResult.resolvedHashFragment;
                assert.ok(true, "promise was resolved");
                assert.strictEqual(oResolvedHashFragment.navigationMode, "embedded", "promise was resolved to the expected navigation mode");
            })
            .catch(() => { assert.ok(false, "promise was resolved"); })
            .finally(done);
    });

    QUnit.test("_resolveHashFragment: align navigation mode and navigate directly", function (assert) {
        const done = assert.async();
        sandbox.stub(this.oController, "_getConfig").returns({ rootIntent: "Root-intent" });

        sandbox.stub(Container, "getServiceAsync");
        Container.getServiceAsync.withArgs("NavTargetResolutionInternal").resolves({ // a fake service
            resolveHashFragment: sandbox.stub().returns(
                new jQuery.Deferred().resolve({ navigationMode: "newWindowThenEmbedded" }).promise()
            )
        });
        Container.getServiceAsync.callThrough();

        const oOpenURLStub = sandbox.stub(WindowUtils, "openURL");
        this.oController._resolveHashFragment("#Root-intent")
            .then((oResult) => {
                const oResolvedHashFragment = oResult.resolvedHashFragment;
                assert.ok(true, "promise was resolved");
                assert.strictEqual(oResolvedHashFragment.navigationMode, "embedded", "promise was resolved to the expected navigation mode");
                assert.strictEqual(oOpenURLStub.called, false, "open in new app called");
            })
            .catch(() => { assert.ok(false, "promise was resolved"); })
            .finally(done);
    });

    [{
        sNavigationMode: "newWindowThenEmbedded",
        expectedEpcmNavigationMode: 1
    }, {
        sNavigationMode: "embedded",
        expectedEpcmNavigationMode: 0
    }, {
        sNavigationMode: "newWindow",
        expectedEpcmNavigationMode: 1
    }, {
        sNavigationMode: "replace",
        expectedEpcmNavigationMode: 0
    }, {
        sNavigationMode: "unknown",
        expectedEpcmNavigationMode: 0, // default
        homePage: true
    }].forEach((oFixture) => {
        QUnit.test(`_openAppViaNWBC: call of epcm with navigation mode: ${oFixture.sNavigationMode}`, function (assert) {
            const done = assert.async();
            // prepare mock stubs
            sandbox.stub(ushellUtils, "isNativeWebGuiNavigation").returns(true);

            this.oController._oAppLifeCycleService = {
                getCurrentApplication: sandbox.stub().returns({
                    homePage: oFixture.homePage
                })
            };

            let iExpectedToggleMenuCallCount = 0;
            if (oFixture.homePage) {
                iExpectedToggleMenuCallCount = 1;
            }
            const oToggleMenuStub = sandbox.stub(this.oController, "_setMenuVisible");
            sandbox.stub(this.oController, "_appendUserIdToUrl").callsFake((dummy, sUrl) => {
                return Promise.resolve(`${sUrl}?${dummy}=1`);
            });

            const oNavigate = sandbox.stub().returns(true);

            sandbox.stub(ushellUtils, "getPrivateEpcm").returns({

                doNavigate: oNavigate,
                getNwbcFeatureBits: function () { return 4; }
            });

            const oNavTargetResolutionResolvedHash = {
                additionalInformation: "additionalInformation",
                url: "url",
                applicationType: "applicationType",
                navigationMode: oFixture.sNavigationMode
            };

            // prepare measure stubs
            sandbox.stub(this.oController.history, "pop");
            sandbox.stub(WindowUtils, "openURL");
            sandbox.stub(this.oController.history, "getHistoryLength").returns(2);

            // test
            this.oController._openAppViaNWBC(oNavTargetResolutionResolvedHash).then(() => {
                assert.strictEqual(oNavigate.called, true, " navigate called");
                assert.strictEqual(/url\?sap-user=1&sap-shell=FLP.*/.test(oNavigate.args[0][0]), true, "correct url");
                assert.strictEqual(oNavigate.args[0][1], oFixture.expectedEpcmNavigationMode, "correct navigation mode passed to EPCM");
                assert.strictEqual(oNavigate.args[0][2], undefined, "param 2 should be undefined");
                assert.strictEqual(oNavigate.args[0][3], undefined, "param 3 should be undefined");
                assert.strictEqual(oNavigate.args[0][4], undefined, "param 4 should be undefined");
                assert.strictEqual(oNavigate.args[0][5], undefined, "param 5 should be undefined");
                assert.strictEqual(WindowUtils.openURL.called, false, "WindowUtils.openURL not called");
                assert.ok(this.oController.history.pop.called, "history pop called");
                assert.strictEqual(this.oController.bRestorePreviousHash, true, "bRestorePreviousHash flag was set to true");

                assert.strictEqual(oToggleMenuStub.callCount, iExpectedToggleMenuCallCount, "_setMenuVisible was called the correct times");
                if (iExpectedToggleMenuCallCount) {
                    assert.deepEqual(oToggleMenuStub.getCall(0).args, [true], "_setMenuVisible was called with correct args");
                }
                done();
            });
        });
    });

    [{
        sNavigationMode: "newWindowThenEmbedded",
        expectedEpcmNavigationMode: 1
    }, {
        sNavigationMode: "embedded",
        expectedEpcmNavigationMode: 0
    }, {
        sNavigationMode: "newWindow",
        expectedEpcmNavigationMode: 1
    }, {
        sNavigationMode: "replace",
        expectedEpcmNavigationMode: 0
    }, {
        sNavigationMode: "unknown",
        expectedEpcmNavigationMode: 0 // default
    }].forEach((oFixture) => {
        QUnit.test(`_openAppViaNWBC: call of epcm via deeplink and with navigation mode: ${oFixture.sNavigationMode}`, async function (assert) {
            // prepare mock stubs
            sandbox.stub(ushellUtils, "isNativeWebGuiNavigation").returns(true);

            this.oController._oAppLifeCycleService = {
                getCurrentApplication: sandbox.stub().returns(false)
            };

            const oToggleMenuStub = sandbox.stub(this.oController, "_setMenuVisible");
            sandbox.stub(this.oController, "_appendUserIdToUrl").callsFake((dummy, sUrl) => {
                return Promise.resolve(`${sUrl}?${dummy}=1`);
            });

            const oNavigate = sandbox.stub().returns(true);

            sandbox.stub(ushellUtils, "getPrivateEpcm").returns({
                doNavigate: oNavigate,
                getNwbcFeatureBits: function () { return 4; }
            });

            const oNavTargetResolutionResolvedHash = {
                additionalInformation: "additionalInformation",
                url: "url",
                applicationType: "applicationType",
                navigationMode: oFixture.sNavigationMode
            };

            // prepare measure stubs
            sandbox.stub(this.oController.history, "pop");
            sandbox.stub(WindowUtils, "openURL");
            sandbox.stub(this.oController.history, "getHistoryLength").returns(1);
            const Navigation = await Container.getServiceAsync("Navigation");
            sandbox.spy(Navigation, "navigate");

            // test
            return this.oController._openAppViaNWBC(oNavTargetResolutionResolvedHash).then(() => {
                assert.ok(Navigation.navigate.called, "Navigation.navigate called");
                assert.strictEqual(this.oController.history.pop.called, false, "history pop not called");

                assert.strictEqual(oToggleMenuStub.callCount, 0, "_setMenuVisible was called the correct times");
            });
        });
    });

    QUnit.test("_openAppViaNWBC: call of epcm with GUI URL with appstates", function (assert) {
        const done = assert.async();
        sandbox.stub(ushellUtils, "isNativeWebGuiNavigation").returns(true);

        this.oController._oAppLifeCycleService = {
            getCurrentApplication: sandbox.stub().returns({
                homePage: true
            })
        };

        const oToggleMenuStub = sandbox.stub(this.oController, "_setMenuVisible");

        const oNavigate = sandbox.stub().returns(true);

        sandbox.stub(ushellUtils, "getPrivateEpcm").returns({
            doNavigate: oNavigate,
            getNwbcFeatureBits: function () { return 4; }
        });

        const oNavTargetResolutionResolvedHash = {
            additionalInformation: "additionalInformation",
            url: "http://www.webgui.com?p1=1&sap-iapp-state=1234&sap-xapp-state=5678&sap-intent-param=90",
            applicationType: "GUI",
            navigationMode: "newWindowThenEmbedded",
            systemAlias: "ABC"
        };

        // prepare measure stubs
        sandbox.stub(this.oController.history, "pop");
        sandbox.stub(WindowUtils, "openURL");
        sandbox.stub(this.oController, "_appendUserIdToUrl").callsFake((dummy, sUrl) => {
            return Promise.resolve(`${sUrl}&${dummy}=1`);
        });

        let iCallsGetAppStateData = 0;
        sandbox.stub(Container, "getFLPUrl").returns("http://www.flp.com");

        sandbox.stub(Container, "getServiceAsync");
        Container.getServiceAsync.withArgs("Navigation").resolves({
            getAppStateData: function () {
                iCallsGetAppStateData++;
                const oDeferred = new jQuery.Deferred();
                setTimeout(() => {
                    oDeferred.resolve([
                        "90data",
                        "5678data",
                        "1234data"
                    ]);
                }, 0);
                return oDeferred.promise();
            }
        });
        Container.getServiceAsync.callThrough();

        // test
        this.oController._openAppViaNWBC(oNavTargetResolutionResolvedHash).then(() => {
            assert.strictEqual(oNavigate.called, true, " navigate called");
            assert.strictEqual(/http:\/\/www.webgui.com\?p1=1&sap-iapp-state=1234&sap-xapp-state=5678&sap-intent-param=90&sap-user=1&sap-shell=FLP.*/.test(oNavigate.args[0][0]), true, "correct url");
            assert.strictEqual(oNavigate.args[0][1], 1, "correct navigation mode passed to EPCM");
            assert.strictEqual(oNavigate.args[0][2], undefined, "param 3 should be undefined");
            assert.strictEqual(oNavigate.args[0][3], undefined, "param 4 should be undefined");
            assert.strictEqual(oNavigate.args[0][4], undefined, "param 5 should be undefined");
            assert.strictEqual(oNavigate.args[0][5], undefined, "param 6 should be undefined");
            assert.strictEqual(oNavigate.args[0][6], undefined, "param 7 should be undefined");
            assert.deepEqual(oNavigate.args[0][7], [{
                name: "sap-flp-params",
                value: JSON.stringify({
                    "sap-intent-param-data": "90data",
                    "sap-xapp-state-data": "5678data",
                    "sap-iapp-state-data": "1234data",
                    "sap-flp-url": "http://www.flp.com",
                    "system-alias": "ABC"
                })
            }], `param 8 for: ${oNavTargetResolutionResolvedHash.url}`);
            assert.strictEqual(WindowUtils.openURL.called, false, "WindowUtils.openURL not called");
            assert.ok(this.oController.history.pop.called, "history pop called");
            assert.strictEqual(this.oController.bRestorePreviousHash, true, "bRestorePreviousHash flag was set to true");

            assert.strictEqual(oToggleMenuStub.callCount, 1, "_setMenuVisible was called the correct times");
            assert.deepEqual(oToggleMenuStub.getCall(0).args, [true], "_setMenuVisible was called with correct args");
            assert.strictEqual(iCallsGetAppStateData, 1, "call count to getAppStateData should be 1");
            done();
        });
    });

    QUnit.test("_openAppViaNWBC: call of epcm with GUI URL with and no appstates", function (assert) {
        const done = assert.async();
        sandbox.stub(ushellUtils, "isNativeWebGuiNavigation").returns(true);

        this.oController._oAppLifeCycleService = {
            getCurrentApplication: sandbox.stub().returns({
                homePage: true
            })
        };

        const oToggleMenuStub = sandbox.stub(this.oController, "_setMenuVisible");

        const oNavigate = sandbox.stub().returns(true);

        sandbox.stub(ushellUtils, "getPrivateEpcm").returns({
            doNavigate: oNavigate,
            getNwbcFeatureBits: function () { return 4; }
        });

        const oNavTargetResolutionResolvedHash = {
            additionalInformation: "additionalInformation",
            url: "http://www.webgui.com?p1=1",
            applicationType: "GUI",
            navigationMode: "newWindowThenEmbedded",
            systemAlias: "ABC"
        };

        // prepare measure stubs
        sandbox.stub(this.oController.history, "pop");
        sandbox.stub(WindowUtils, "openURL");
        sandbox.stub(this.oController, "_appendUserIdToUrl").callsFake((dummy, sUrl) => {
            return Promise.resolve(`${sUrl}&${dummy}=1`);
        });

        let iCallsGetAppStateData = 0;
        sandbox.stub(Container, "getFLPUrl").returns("http://www.flp.com");

        sandbox.stub(Container, "getServiceAsync");
        Container.getServiceAsync.withArgs("Navigation").resolves({
            _getParamKeys: function (sUrl, aInfoArray) {
                return [];
            },
            getAppStateData: function () {
                iCallsGetAppStateData++;
                const oDeferred = new jQuery.Deferred();
                setTimeout(() => {
                    oDeferred.resolve();
                }, 0);
                return oDeferred.promise();
            }
        });

        // test
        this.oController._openAppViaNWBC(oNavTargetResolutionResolvedHash).then(() => {
            assert.strictEqual(oNavigate.called, true, " navigate called");
            assert.strictEqual(/http:\/\/www.webgui.com\?p1=1&sap-user=1&sap-shell=FLP.*/.test(oNavigate.args[0][0]), true, "correct url");
            assert.strictEqual(oNavigate.args[0][1], 1, "correct navigation mode passed to EPCM");
            assert.strictEqual(oNavigate.args[0][2], undefined, "param 3 should be undefined");
            assert.strictEqual(oNavigate.args[0][3], undefined, "param 4 should be undefined");
            assert.strictEqual(oNavigate.args[0][4], undefined, "param 5 should be undefined");
            assert.strictEqual(oNavigate.args[0][5], undefined, "param 6 should be undefined");
            assert.strictEqual(oNavigate.args[0][6], undefined, "param 7 should be undefined");
            assert.deepEqual(oNavigate.args[0][7], [{
                name: "sap-flp-params",
                value: JSON.stringify({
                    "sap-flp-url": "http://www.flp.com",
                    "system-alias": "ABC"
                })
            }], "param 8 should be undefined");
            assert.strictEqual(WindowUtils.openURL.called, false, "WindowUtils.openURL not called");
            assert.ok(this.oController.history.pop.called, "history pop called");
            assert.strictEqual(this.oController.bRestorePreviousHash, true, "bRestorePreviousHash flag was set to true");

            assert.strictEqual(oToggleMenuStub.callCount, 1, "_setMenuVisible was called the correct times");
            assert.deepEqual(oToggleMenuStub.getCall(0).args, [true], "_setMenuVisible was called with correct args");
            assert.strictEqual(iCallsGetAppStateData, 0, "call count to getAppStateData should be 1");
            done();
        });
    });

    [{
        testDescription: "native webgui navigation (via capability) is handled via NWBC",

        bEnableMigrationConfig: true,
        sShellHash: "#GUI-intent",
        bIsNativeWebGuiNavigation: true,
        bNWBCHandledNavigation: true,

        oResolvedHashFragment: {
            nativeNWBCNavigation: false,
            navigationMode: "newWindow"
        },
        expected: {
            handler: "nwbc", // 'nwbc' -> navigation handled via epcm.doNavigate
            // 'newWindow' -> navigation opened in a new window
            // 'rootIntentRedirect' -> navigation is redirected to #Shell-home
            // 'none' -> pre-emptive navigation was not handled
            closeDialogsCount: 0
        }
    }, {
        testDescription: "native webgui navigation (forced) is handled via NWBC",
        bEnableMigrationConfig: true,
        sShellHash: "#GUI-intent",
        bIsNativeWebGuiNavigation: false, // no native navigation capability
        bNWBCHandledNavigation: true,
        oResolvedHashFragment: {
            nativeNWBCNavigation: true, // but forced via resolution result
            navigationMode: "newWindow"
        },
        expected: {
            handler: "nwbc",
            closeDialogsCount: 0
        }
    }, {
        testDescription: "native webgui navigation is not handled via NWBC, and newWindow is configured as the navigation mode",
        bEnableMigrationConfig: true,
        sShellHash: "#GUI-intent",
        bIsNativeWebGuiNavigation: true,
        bNWBCHandledNavigation: false,
        oResolvedHashFragment: {
            nativeNWBCNavigation: true,
            navigationMode: "newWindow" // test fallback is applied
        },
        expected: {
            handler: "newWindow",
            closeDialogsCount: 0
        }
    }, {
        testDescription: "native webgui navigation is not handled via NWBC, and something else than newWindow is configured as the navigation mode",
        bEnableMigrationConfig: true,
        sShellHash: "#GUI-intent",
        bIsNativeWebGuiNavigation: true,
        bNWBCHandledNavigation: false,
        oResolvedHashFragment: {
            nativeNWBCNavigation: true,
            navigationMode: "somethingElse"
        },
        expected: {
            handler: "none",
            closeDialogsCount: 1
        }
    }, {
        testDescription: "non-native newWindow navigation",
        bEnableMigrationConfig: true,
        sShellHash: "#GUI-intent",
        bIsNativeWebGuiNavigation: false,
        bNWBCHandledNavigation: false,
        oResolvedHashFragment: {
            nativeNWBCNavigation: false,
            navigationMode: "newWindow"
        },
        expected: {
            handler: "newWindow",
            closeDialogsCount: 0
        }
    }, {
        testDescription: "rootIntent is navigated in place with a resolution result",
        bEnableMigrationConfig: true,
        sShellHash: "#",
        bIsNativeWebGuiNavigation: false,
        bNWBCHandledNavigation: false,
        oResolvedHashFragment: {
            nativeNWBCNavigation: false,
            navigationMode: "embedded"
        },
        expected: {
            handler: "none", // resolution result exists: navigation can proceed as usual
            closeDialogsCount: 1
        }
    }, {
        testDescription: "rootIntent is navigated in a new window",
        bEnableMigrationConfig: true,
        sShellHash: "#",
        bIsNativeWebGuiNavigation: false,
        bNWBCHandledNavigation: false,
        oResolvedHashFragment: {
            nativeNWBCNavigation: false,
            navigationMode: "newWindow"
        },
        expected: {
            handler: "newWindow",
            closeDialogsCount: 0
        }
    }].forEach((oFixture) => {
        QUnit.test(`handles navigation as expected when ${oFixture.testDescription}`, async function (assert) {
            let sLastHandlerCalled = "none";
            sandbox.stub(ushellUtils, "isColdStart").returns(false);
            const oCloseAllDialogsStub = sandbox.spy(InstanceManager, "closeAllDialogs");

            // Arrange
            const oIsNativeWebGuiNavigationStub = sandbox.stub(ushellUtils, "isNativeWebGuiNavigation");
            oIsNativeWebGuiNavigationStub.returns(oFixture.bIsNativeWebGuiNavigation);

            sandbox.stub(this.oController, "_openAppViaNWBC").callsFake(async () => {
                if (oFixture.bNWBCHandledNavigation) {
                    sLastHandlerCalled = "nwbc";
                }
                return oFixture.bNWBCHandledNavigation;
            });

            sandbox.stub(this.oController, "_openAppExplace").callsFake(async () => {
                sLastHandlerCalled = "newWindow";
            });

            const oLogOpenAppActionStub = sandbox.stub(this.oController, "logOpenAppAction").resolves();

            const oConfigLastStub = sandbox.stub(Config, "last");
            oConfigLastStub
                .withArgs("/core/shell/model/migrationConfig")
                .returns(oFixture.bEnableMigrationConfig);

            // callback called immediately as this test checks setHash was called synchronously
            sandbox.stub(window.hasher, "setHash").callsFake(() => {
                sLastHandlerCalled = "rootIntentRedirect";
            });
            sandbox.stub(window, "setTimeout").callsFake((fnCallback, iInterval) => {
                fnCallback();
            });

            this.NavTargetResolutionInternal.resolveHashFragment.resolvesDeferred(oFixture.oResolvedHashFragment);

            // Act
            const oDeferred = this.oController.doHashChange(oFixture.sShellHash, "/app/part", "", null);
            await ushellUtils.promisify(oDeferred);

            // Assert
            assert.strictEqual(sLastHandlerCalled, oFixture.expected.handler, "Navigation was handled in the expected way");

            if (["newWindow", "nwbc"].indexOf(sLastHandlerCalled) >= 0) {
                assert.strictEqual(oLogOpenAppActionStub.callCount, 1, "The action of opening the application was logged once");
                assert.strictEqual(oFixture.oResolvedHashFragment.sFixedShellHash, oFixture.sShellHash, "Shell hash is reflected into the resolved hash fragment when logging occurs");
            } else if (sLastHandlerCalled === "none") {
                assert.strictEqual(oLogOpenAppActionStub.callCount, 0, "The action of opening the application was not logged");
            }
            assert.strictEqual(oCloseAllDialogsStub.callCount, oFixture.expected.closeDialogsCount, "closeAllDialogs called correctly");
        });
    });

    QUnit.test("_restorePreviousHashAfterOpenNewWindow: navigate back after opening a new window", function (assert) {
        // Arrange
        sandbox.stub(this.oController.history, "pop");
        sandbox.stub(this.oController, "_resumeAppRouterIgnoringCurrentHash");

        // Act
        this.oController._restorePreviousHashAfterOpenNewWindow({}, true);

        // Assert
        assert.strictEqual(this.oController._windowHistoryBack.callCount, 1, "back navigation was called");
        assert.strictEqual(this.oController._resumeAppRouterIgnoringCurrentHash.callCount, 1, "resumeAppRouterIgnoringCurrentHash was called");
        assert.strictEqual(this.oController.bRestorePreviousHash, true, "bRestorePreviousHash was set to true");
        assert.ok(this.oController._windowHistoryBack.calledWith(1), "back navigation was called with the correct amount of steps");
    });

    QUnit.test("Test fallback to Shell-home if history exist & previous url is not valid navigation", async function (assert) {
        // Arrange
        sandbox.stub(this.oController, "reportError");
        sandbox.stub(URLSearchParams.prototype, "get").returns(true);
        const setHashStub = sandbox.stub(hasher, "setHash");

        // Act
        await this.oController.hashChangeFailure(1, null, null, null);

        // Assert
        assert.strictEqual(setHashStub.callCount, 1, "Attached navigateBack function is used");
    });

    [{
        testDescription: "message is an object",
        vMessage: {
            title: "the title",
            message: "the message (translated)",
            technicalMessage: "the technical message (in english)"
        },
        vErrorDetails: "error details (translated)",
        expectedCallCount: 1,
        expectedCallArgs: [
            MessageService.Type.ERROR,
            "the message (translated)",
            {
                title: "the title",
                details: "error details (translated)"
            }
        ]
    }, {
        testDescription: "message is an object and details is an object",
        vMessage: {
            title: "the title",
            message: "the message (translated)",
            technicalMessage: "the technical message (in english)"
        },
        vErrorDetails: {
            info: "error details (translated)",
            technicalMessage: "important debugging stuff"
        },
        expectedCallCount: 1,
        expectedCallArgs: [
            MessageService.Type.ERROR,
            "the message (translated)",
            {
                title: "the title",
                details: {
                    info: "error details (translated)",
                    technicalMessage: "important debugging stuff"
                }
            }
        ]
    }, {
        testDescription: "message is not an object",
        vMessage: "error message",
        vErrorDetails: "error details",
        expectedCallCount: 0
    }].forEach((oFixture) => {
        QUnit.test(`hashChangeFailure calls #show method as expected when ${oFixture.testDescription}`, async function (assert) {
            // Arrange
            const iSomeHistoryLength = 0;
            const sSomeComponent = "some.component";
            const bEnableHashChange = false;

            sandbox.stub(window.hasher, "setHash");

            sandbox.stub(Container, "getServiceAsync");
            const oMessageServiceShowStub = sandbox.stub();
            const oFakeMessageService = {
                show: oMessageServiceShowStub,
                Type: { ERROR: 1 }
            };
            Container.getServiceAsync.withArgs("MessageInternal").resolves(oFakeMessageService);
            Container.getServiceAsync.callThrough();

            // Act
            await this.oController.hashChangeFailure(iSomeHistoryLength, oFixture.vMessage, oFixture.vErrorDetails, sSomeComponent, bEnableHashChange);
            await ushellUtils.awaitTimeout(0);

            // Assert
            assert.strictEqual(oMessageServiceShowStub.callCount, oFixture.expectedCallCount, "Message service #show was called one time");
            if (oFixture.expectedCallArgs) {
                assert.deepEqual(
                    oMessageServiceShowStub.getCall(0).args,
                    oFixture.expectedCallArgs,
                    "the #show method was called with the expected arguments"
                );
            }
        });
    });

    /**
     * Test the behaviour of doHashChange with parseError or resolveHashFragment failure.
     */
    QUnit.test("test doHashChange failure flow", async function (assert) {
        const oResolveAsyncStepStub = sandbox.stub();
        const oNotifyAsyncStepStub = sandbox.stub(this.oController, "_notifyAsyncStep").returns(oResolveAsyncStepStub);
        this.oController._loadCoreExt = sandbox.spy();
        this.oController._requireCoreExt = sandbox.spy();
        this.oController.history = sandbox.spy();
        this.oController.history.hashChange = sandbox.spy();
        this.oController.history.getHistoryLength = sandbox.stub();
        this.oController.history.getHistoryLength.returns(0);
        this.oController._setEnableHashChange(true);

        const parseShellHashMock = sandbox.stub();
        let resolveHashFragmentStub = sandbox.stub(this.oController, "_resolveHashFragment");

        Container.getService = sandbox.stub().returns({
            parseShellHash: parseShellHashMock,
            show: sandbox.stub()
        });

        sandbox.spy(this.oController, "hashChangeFailure");

        const oParseError = { message: "error" };
        this.oController.reportError = sandbox.spy();
        this.oController._windowHistoryBack = sandbox.spy();

        // #1 Test doHashChange with parseError and history = 0
        this.oController.bEnableHashChange = true;
        const oDeferred = this.oController.doHashChange(sBasicShellHash, sAppPart, sOldShellHash, sOldAppPart, oParseError);
        await ushellUtils.promisify(oDeferred);
        assert.strictEqual(this.oController.hashChangeFailure.callCount, 1, "#1 Parse Error (with no history) - hashChangeFailure called");
        assert.strictEqual(hasher.getHash(), "", "#1 Parse Error (with no history) - Hash set to empty string");
        assert.strictEqual(oNotifyAsyncStepStub.callCount, 0, "#1 notifyAsyncStep was not called");
        assert.strictEqual(oResolveAsyncStepStub.callCount, 0, "#1 notifyAsyncStep-resolve was not called");

        this.oController.hashChangeFailure.resetHistory();
        this.oController._windowHistoryBack.resetHistory();
        oNotifyAsyncStepStub.resetHistory();
        oResolveAsyncStepStub.resetHistory();

        // #2 Test doHashChange with parseError and history > 0
        this.oController.bEnableHashChange = true;
        this.oController.history.getHistoryLength.returns(1);
        const oDeferred2 = this.oController.doHashChange(sBasicShellHash, sAppPart, sOldShellHash, sOldAppPart, oParseError);
        await ushellUtils.promisify(oDeferred2);
        assert.strictEqual(this.oController.hashChangeFailure.callCount, 1, "#2 Parse Error (with history) - hashChangeFailure called for the 2nd time");
        assert.strictEqual(this.oController._windowHistoryBack.callCount, 1, "#2 Parse Error (with history) - windowHistoryBack called once");
        assert.strictEqual(oNotifyAsyncStepStub.callCount, 0, "#2 notifyAsyncStep was not called");
        assert.strictEqual(oResolveAsyncStepStub.callCount, 0, "#2 notifyAsyncStep-resolve was not called");

        this.oController.hashChangeFailure.resetHistory();
        this.oController._windowHistoryBack.resetHistory();
        oNotifyAsyncStepStub.resetHistory();
        oResolveAsyncStepStub.resetHistory();

        // #3 Test doHashChange when resolveHashFragment fails (no parse error, history = 0)
        this.oController.bEnableHashChange = true;
        this.oController.history.getHistoryLength.returns(0);
        const dfdA = new Deferred();
        resolveHashFragmentStub.restore();
        resolveHashFragmentStub = sandbox.stub(this.oController, "_resolveHashFragment");
        resolveHashFragmentStub.returns(dfdA.promise);

        dfdA.reject(new Error("error"));
        const oDeferred3 = this.oController.doHashChange(sBasicShellHash, sAppPart, sOldShellHash, sOldAppPart, null);
        await ushellUtils.promisify(oDeferred3);
        assert.strictEqual(hasher.getHash(), "", "#3 Test doHashChange with failure in resolveHashFragment and history = 0");
        assert.strictEqual(oNotifyAsyncStepStub.callCount, 1, "#3 notifyAsyncStep was called");
        assert.strictEqual(oResolveAsyncStepStub.callCount, 1, "#3 notifyAsyncStep-resolve was called");

        this.oController.hashChangeFailure.resetHistory();
        this.oController._windowHistoryBack.resetHistory();
        oNotifyAsyncStepStub.resetHistory();
        oResolveAsyncStepStub.resetHistory();

        // #4 Test doHashChange when resolveHashFragment fails (no parse error, history > 0)
        this.oController.history.getHistoryLength.returns(1);

        resolveHashFragmentStub.restore();
        resolveHashFragmentStub = sandbox.stub(this.oController, "_resolveHashFragment");
        const dfdB = new Deferred();
        resolveHashFragmentStub.returns(dfdB.promise);

        dfdB.reject(new Error("error"));
        const oDeferred4 = this.oController.doHashChange(sBasicShellHash, sAppPart, sOldShellHash, sOldAppPart, null);
        await ushellUtils.promisify(oDeferred4);
        assert.strictEqual(this.oController._windowHistoryBack.callCount, 1, "#4 Test doHashChange with failure in resolveHashFragment and history > 0");
        assert.strictEqual(oNotifyAsyncStepStub.callCount, 1, "#4 notifyAsyncStep was called");
        assert.strictEqual(oResolveAsyncStepStub.callCount, 1, "#4 notifyAsyncStep-resolve was called");

        resolveHashFragmentStub.restore();
    });

    QUnit.test("test NWBC navigation: direct open new window with original intent", async function (assert) {
        // Arrange
        // eslint-disable-next-line max-len
        const sTargetUrl = "https://some.base.name.corp:12345/sap/bc/ui2/nwbc/~canvas;window=app/wda/S_EPM_FPM_PD/?sap-client=000&sap-language=EN&sap-ie=edge&sap-theme=sap_bluecrystal&sap-shell=FLP1.34.1-NWBC";
        const oResolvedHashFragment = {
            applicationType: "NWBC",
            url: sTargetUrl,
            additionalInformation: "",
            navigationMode: "newWindowThenEmbedded",
            "sap-system": "U1Y_000"
        };

        sandbox.stub(Container, "getServiceAsync");
        Container.getServiceAsync.withArgs("NavTargetResolutionInternal").resolves({
            resolveHashFragment: sandbox.stub().resolvesDeferred(oResolvedHashFragment)
        });
        Container.getServiceAsync.callThrough();
        const sShellHash = "#Action-test?sap-system=U1Y_000";
        const sCurrentLocationHash = "#Action-test?sap-system=U1Y_000";
        sandbox.stub(ApplicationContainer.prototype, "_checkNwbcUrlAdjustment").returns(sCurrentLocationHash);

        this.oController._loadCoreExt = sandbox.spy();
        this.oController._requireCoreExt = sandbox.spy();
        sandbox.stub(WindowUtils, "openURL").returns();
        sandbox.stub(this.oController, "_changeWindowLocation").returns();
        sandbox.stub(this.oController, "_openAppInplace").returns();
        sandbox.stub(this.oController, "_getCurrentLocationHash").returns(sCurrentLocationHash);

        // Test the behaviour when navigationMode is newWindowThenEmbedded and coldStart=false.
        // The result should be one (new) call to navigate with navigationMode=newWindow
        sandbox.stub(ushellUtils, "isColdStart").returns(false);
        sandbox.stub(Ui5History, "getInstance").returns({
            getDirection: function () {
                return "NewEntry";
            }
        });

        // Act
        const oDeferred = this.oController.doHashChange(sShellHash, null, "", null, null);
        await ushellUtils.promisify(oDeferred);

        // Assert
        assert.strictEqual(oResolvedHashFragment.url, sCurrentLocationHash, `aligned url, ok with url: ${oResolvedHashFragment.url}`);
        assert.strictEqual(oResolvedHashFragment.navigationMode, "newWindow", `aligned Navigation mode ok: navigation mode ${oResolvedHashFragment.navigationMode}`);
    });

    QUnit.test("test WDA navigation fallback", async function (assert) {
        // Arrange
        // eslint-disable-next-line max-len
        const sVeryLongUrl = "https://some.base.name.corp:12345/sap/bc/ui2/nwbc/~canvas;window=app/wda/FAC_GL_ACCOUNT/?sap-client=500&sap-wd-configId=FAC_GL_ACCOUNT_AC&sap-ie=EDGE&WDUIGUIDELINE=FIORI&%2fERP%2fCATEGORY=ACT01&%2fERP%2fCHRTACCT=INT&%2fERP%2fCOMPCODE=0001&%2fERP%2fCO_AREA=0001&%2fERP%2fLEDGER=0L&0CURRENCY=EUR&0FISCVARNT=K3&0FISCYEAR=K32015&0MANDT=500&BSA_VARIABLE_%2fERP%2fP_0CURRENCY03=EUR&BSA_VARIABLE_%2fERP%2fP_0FISCVARNT01=K3&BSA_VARIABLE_%2fERP%2fP_0FISCYEAR01=2015&BSA_VARIABLE_%2fERP%2fP_CATEGORY=ACT01&BSA_VARIABLE_%2fERP%2fP_CHRTACCT01=INT&BSA_VARIABLE_%2fERP%2fP_CO_AREA01=0001&BSA_VARIABLE_%2fERP%2fP_LEDGER01=0L&BSA_VARIABLE_%2fERP%2fS_COMPCODE01=0001&BSA_VARIABLE_0SYMANDT=500&ChartOfAccounts=INT&CompanyCode=0001&Currency=EUR&sap-xapp-state=ASTFFDW8OLVYUYO016MJRGDLFN2ZLC8I8RIJXZ5G&sap-language=EN&sap-client=902&sap-language=EN";
        const oResolvedHashFragment = {
            applicationType: "NWBC",
            url: sVeryLongUrl,
            additionalInformation: "",
            navigationMode: "newWindowThenEmbedded"
        };
        sandbox.stub(Container, "getServiceAsync");
        Container.getServiceAsync.withArgs("NavTargetResolutionInternal").resolves({
            resolveHashFragment: sandbox.stub().resolvesDeferred(oResolvedHashFragment)
        });
        Container.getServiceAsync.callThrough();
        // eslint-disable-next-line max-len
        const sShellHash = "#GLAccount-manage?%2FERP%2FCATEGORY=ACT01&%2FERP%2FCHRTACCT=INT&%2FERP%2FCOMPCODE=0001&%2FERP%2FCO_AREA=0001&%2FERP%2FLEDGER=0L&0CURRENCY=EUR&0FISCVARNT=K3&0FISCYEAR=K32015&0MANDT=500&BSA_VARIABLE_%2FERP%2FP_0CURRENCY03=EUR&BSA_VARIABLE_%2FERP%2FP_0FISCVARNT01=K3&BSA_VARIABLE_%2FERP%2FP_0FISCYEAR01=2015&BSA_VARIABLE_%2FERP%2FP_CATEGORY=ACT01&BSA_VARIABLE_%2FERP%2FP_CHRTACCT01=INT&BSA_VARIABLE_%2FERP%2FP_CO_AREA01=0001&BSA_VARIABLE_%2FERP%2FP_LEDGER01=0L&BSA_VARIABLE_%2FERP%2FS_COMPCODE01=0001&BSA_VARIABLE_0SYMANDT=500&ChartOfAccounts=INT&CompanyCode=0001&Currency=EUR&sap-xapp-state=ASTFFDW8OLVYUYO016MJRGDLFN2ZLC8I8RIJXZ5G";
        const sCurrentLocationHash = sShellHash;
        sandbox.stub(ApplicationContainer.prototype, "_checkNwbcUrlAdjustment").returns(sCurrentLocationHash);

        this.oController._loadCoreExt = sandbox.spy();
        this.oController._requireCoreExt = sandbox.spy();
        sandbox.stub(WindowUtils, "openURL").returns();
        sandbox.stub(this.oController, "_changeWindowLocation").returns();
        sandbox.stub(this.oController, "_openAppInplace").returns();
        sandbox.stub(this.oController, "_getCurrentLocationHash").returns(sCurrentLocationHash);

        // Test the behaviour when navigationMode is newWindowThenEmbedded and coldStart=false.
        // The result should be one (new) call to navigate with navigationMode=newWindow
        sandbox.stub(ushellUtils, "isColdStart").returns(false);
        sandbox.stub(Ui5History, "getInstance").returns({
            getDirection: function () {
                return "NewEntry";
            }
        });

        // Act
        const oDeferred = this.oController.doHashChange(sShellHash, null, "", null, null);
        await ushellUtils.promisify(oDeferred);

        // Assert
        assert.strictEqual(oResolvedHashFragment.url, sCurrentLocationHash, `target window hash is ok with url: ${oResolvedHashFragment.url}`);
        assert.strictEqual(oResolvedHashFragment.navigationMode, "newWindow");
    });

    QUnit.test("navigate: ShellNavigationInternal._bIsInitialNavigation is set to false when navigation mode is embedded and is not cold start", async function (assert) {
        const oResolvedHashFragment = {
            applicationType: "NWBC",
            additionalInformation: "",
            navigationMode: "embedded"
        };
        this.NavTargetResolutionInternal.resolveHashFragment.resolvesDeferred(oResolvedHashFragment);

        // eslint-disable-next-line max-len
        const sShellHash = "#GLAccount-manage?%2FERP%2FCATEGORY=ACT01&%2FERP%2FCHRTACCT=INT&%2FERP%2FCOMPCODE=0001&%2FERP%2FCO_AREA=0001&%2FERP%2FLEDGER=0L&0CURRENCY=EUR&0FISCVARNT=K3&0FISCYEAR=K32015&0MANDT=500&BSA_VARIABLE_%2FERP%2FP_0CURRENCY03=EUR&BSA_VARIABLE_%2FERP%2FP_0FISCVARNT01=K3&BSA_VARIABLE_%2FERP%2FP_0FISCYEAR01=2015&BSA_VARIABLE_%2FERP%2FP_CATEGORY=ACT01&BSA_VARIABLE_%2FERP%2FP_CHRTACCT01=INT&BSA_VARIABLE_%2FERP%2FP_CO_AREA01=0001&BSA_VARIABLE_%2FERP%2FP_LEDGER01=0L&BSA_VARIABLE_%2FERP%2FS_COMPCODE01=0001&BSA_VARIABLE_0SYMANDT=500&ChartOfAccounts=INT&CompanyCode=0001&Currency=EUR&sap-xapp-state=ASTFFDW8OLVYUYO016MJRGDLFN2ZLC8I8RIJXZ5G";

        sandbox.stub(ushellUtils, "isColdStart").returns(false);
        sandbox.stub(this.oController, "_usesNavigationRedirect").resolves(false);

        const oDeferred = this.oController.doHashChange(sShellHash, null, "", null, null);
        await ushellUtils.promisify(oDeferred);

        assert.ok(!this.oController.oShellNavigationInternal.isInitialNavigation(), "ShellNavigationInternal._bIsInitialNavigation was set to false");
    });

    QUnit.test("navigate: ShellNavigationInternal._bIsInitialNavigation is set to false when history entry is not replaced", async function (assert) {
        const oResolvedHashFragment = {
            applicationType: "NWBC",
            additionalInformation: "",
            navigationMode: "embedded"
        };
        this.NavTargetResolutionInternal.resolveHashFragment.resolvesDeferred(oResolvedHashFragment);

        // eslint-disable-next-line max-len
        const sShellHash = "#GLAccount-manage?%2FERP%2FCATEGORY=ACT01&%2FERP%2FCHRTACCT=INT&%2FERP%2FCOMPCODE=0001&%2FERP%2FCO_AREA=0001&%2FERP%2FLEDGER=0L&0CURRENCY=EUR&0FISCVARNT=K3&0FISCYEAR=K32015&0MANDT=500&BSA_VARIABLE_%2FERP%2FP_0CURRENCY03=EUR&BSA_VARIABLE_%2FERP%2FP_0FISCVARNT01=K3&BSA_VARIABLE_%2FERP%2FP_0FISCYEAR01=2015&BSA_VARIABLE_%2FERP%2FP_CATEGORY=ACT01&BSA_VARIABLE_%2FERP%2FP_CHRTACCT01=INT&BSA_VARIABLE_%2FERP%2FP_CO_AREA01=0001&BSA_VARIABLE_%2FERP%2FP_LEDGER01=0L&BSA_VARIABLE_%2FERP%2FS_COMPCODE01=0001&BSA_VARIABLE_0SYMANDT=500&ChartOfAccounts=INT&CompanyCode=0001&Currency=EUR&sap-xapp-state=ASTFFDW8OLVYUYO016MJRGDLFN2ZLC8I8RIJXZ5G";

        this.oController._wasHistoryEntryReplaced = false;
        sandbox.stub(this.oController, "_usesNavigationRedirect").resolves(false);

        const oDeferred = this.oController.doHashChange(sShellHash, null, "", null, null);
        await ushellUtils.promisify(oDeferred);

        assert.ok(!this.oController.oShellNavigationInternal.isInitialNavigation(), "ShellNavigationInternal._bIsInitialNavigation was set to false");
    });

    QUnit.test("navigate: ShellNavigationInternal._bIsInitialNavigation is set to false when navigation mode is replace", async function (assert) {
        const oResolvedHashFragment = {
            applicationType: "NWBC",
            additionalInformation: "",
            navigationMode: "replace"
        };
        this.NavTargetResolutionInternal.resolveHashFragment.resolvesDeferred(oResolvedHashFragment);

        // eslint-disable-next-line max-len
        const sShellHash = "#GLAccount-manage?%2FERP%2FCATEGORY=ACT01&%2FERP%2FCHRTACCT=INT&%2FERP%2FCOMPCODE=0001&%2FERP%2FCO_AREA=0001&%2FERP%2FLEDGER=0L&0CURRENCY=EUR&0FISCVARNT=K3&0FISCYEAR=K32015&0MANDT=500&BSA_VARIABLE_%2FERP%2FP_0CURRENCY03=EUR&BSA_VARIABLE_%2FERP%2FP_0FISCVARNT01=K3&BSA_VARIABLE_%2FERP%2FP_0FISCYEAR01=2015&BSA_VARIABLE_%2FERP%2FP_CATEGORY=ACT01&BSA_VARIABLE_%2FERP%2FP_CHRTACCT01=INT&BSA_VARIABLE_%2FERP%2FP_CO_AREA01=0001&BSA_VARIABLE_%2FERP%2FP_LEDGER01=0L&BSA_VARIABLE_%2FERP%2FS_COMPCODE01=0001&BSA_VARIABLE_0SYMANDT=500&ChartOfAccounts=INT&CompanyCode=0001&Currency=EUR&sap-xapp-state=ASTFFDW8OLVYUYO016MJRGDLFN2ZLC8I8RIJXZ5G";

        sandbox.stub(ushellUtils, "isColdStart").returns(false);
        sandbox.stub(this.oController, "_changeWindowLocation").returns();

        const oDeferred = this.oController.doHashChange(sShellHash, null, "", null, null);
        await ushellUtils.promisify(oDeferred);

        assert.ok(!this.oController.oShellNavigationInternal.isInitialNavigation(), "ShellNavigationInternal._bIsInitialNavigation was not changed");
    });

    QUnit.test("navigate: ShellNavigationInternal._bIsInitialNavigation is not changed when navigation mode is newWindow", async function (assert) {
        const oResolvedHashFragment = {
            applicationType: "NWBC",
            additionalInformation: "",
            navigationMode: "newWindow"
        };
        this.NavTargetResolutionInternal.resolveHashFragment.resolvesDeferred(oResolvedHashFragment);

        const bInitIsInitialNavigation = this.oController.oShellNavigationInternal.isInitialNavigation();
        // eslint-disable-next-line max-len
        const sShellHash = "#GLAccount-manage?%2FERP%2FCATEGORY=ACT01&%2FERP%2FCHRTACCT=INT&%2FERP%2FCOMPCODE=0001&%2FERP%2FCO_AREA=0001&%2FERP%2FLEDGER=0L&0CURRENCY=EUR&0FISCVARNT=K3&0FISCYEAR=K32015&0MANDT=500&BSA_VARIABLE_%2FERP%2FP_0CURRENCY03=EUR&BSA_VARIABLE_%2FERP%2FP_0FISCVARNT01=K3&BSA_VARIABLE_%2FERP%2FP_0FISCYEAR01=2015&BSA_VARIABLE_%2FERP%2FP_CATEGORY=ACT01&BSA_VARIABLE_%2FERP%2FP_CHRTACCT01=INT&BSA_VARIABLE_%2FERP%2FP_CO_AREA01=0001&BSA_VARIABLE_%2FERP%2FP_LEDGER01=0L&BSA_VARIABLE_%2FERP%2FS_COMPCODE01=0001&BSA_VARIABLE_0SYMANDT=500&ChartOfAccounts=INT&CompanyCode=0001&Currency=EUR&sap-xapp-state=ASTFFDW8OLVYUYO016MJRGDLFN2ZLC8I8RIJXZ5G";

        sandbox.stub(ushellUtils, "isColdStart").returns(false);
        sandbox.stub(this.oController, "_changeWindowLocation").returns();
        sandbox.stub(WindowUtils, "openURL").returns();

        const oDeferred = this.oController.doHashChange(sShellHash, null, "", null, null);
        await ushellUtils.promisify(oDeferred);

        assert.equal(this.oController.oShellNavigationInternal.isInitialNavigation(), bInitIsInitialNavigation, "ShellNavigationInternal._bIsInitialNavigation was not changed");
    });

    QUnit.test("navigate: ShellNavigationInternal._bIsInitialNavigation is not changed when navigation mode is null and is not cold start", async function (assert) {
        const oResolvedHashFragment = {
            applicationType: "NWBC",
            additionalInformation: "",
            navigationMode: null
        };
        this.NavTargetResolutionInternal.resolveHashFragment.resolvesDeferred(oResolvedHashFragment);

        // eslint-disable-next-line max-len
        const sShellHash = "#GLAccount-manage?%2FERP%2FCATEGORY=ACT01&%2FERP%2FCHRTACCT=INT&%2FERP%2FCOMPCODE=0001&%2FERP%2FCO_AREA=0001&%2FERP%2FLEDGER=0L&0CURRENCY=EUR&0FISCVARNT=K3&0FISCYEAR=K32015&0MANDT=500&BSA_VARIABLE_%2FERP%2FP_0CURRENCY03=EUR&BSA_VARIABLE_%2FERP%2FP_0FISCVARNT01=K3&BSA_VARIABLE_%2FERP%2FP_0FISCYEAR01=2015&BSA_VARIABLE_%2FERP%2FP_CATEGORY=ACT01&BSA_VARIABLE_%2FERP%2FP_CHRTACCT01=INT&BSA_VARIABLE_%2FERP%2FP_CO_AREA01=0001&BSA_VARIABLE_%2FERP%2FP_LEDGER01=0L&BSA_VARIABLE_%2FERP%2FS_COMPCODE01=0001&BSA_VARIABLE_0SYMANDT=500&ChartOfAccounts=INT&CompanyCode=0001&Currency=EUR&sap-xapp-state=ASTFFDW8OLVYUYO016MJRGDLFN2ZLC8I8RIJXZ5G";
        const bInitIsInitialNavigation = this.oController.oShellNavigationInternal.isInitialNavigation();

        sandbox.stub(ushellUtils, "isColdStart").returns(false);

        const oDeferred = this.oController.doHashChange(sShellHash, null, "", null, null);
        await ushellUtils.promisify(oDeferred);

        assert.equal(this.oController.oShellNavigationInternal.isInitialNavigation(), bInitIsInitialNavigation, "ShellNavigationInternal._bIsInitialNavigation was not changed");
    });

    QUnit.test("_openAppInplace: ShellNavigationInternal._bIsInitialNavigation is changed to initial value when an error arises", function (assert) {
        const bInitIsInitialNavigation = this.oController.oShellNavigationInternal.isInitialNavigation();

        sandbox.stub(this.oController, "_openAppInplace").rejects("Error");
        sandbox.stub(this.oController, "hashChangeFailure");
        this.oController.oShellNavigationInternal.isInitialNavigation(!bInitIsInitialNavigation);
        this.oController._openAppInplace();
        assert.equal(this.oController.oShellNavigationInternal.isInitialNavigation(), bInitIsInitialNavigation, "ShellNavigationInternal._bIsInitialNavigation was restored");
    });

    QUnit.test("test _loadCoreExtNonUI5 navigation ", function (assert) {
        const loadExtSpy = sandbox.spy(this.oController, "_loadCoreExt");

        this.oController._loadCoreExtNonUI5({ applicationType: "TR" });
        assert.strictEqual(loadExtSpy.called, true, "_loadCoreExt for TR application was called");
    });

    QUnit.test("test not supported type navigation ", function (assert) {
        const loadExtSpy = sandbox.spy(this.oController, "_loadCoreExt");

        this.oController._loadCoreExtNonUI5({ applicationType: "SAPUI5" });
        assert.strictEqual(loadExtSpy.called, false, "_loadCoreExt for UI5 application was not called");
    });

    QUnit.test("test URL navigation ", function (assert) {
        const loadExtSpy = sandbox.spy(this.oController, "_loadCoreExt");

        this.oController._loadCoreExtNonUI5({ applicationType: "URL" });
        assert.strictEqual(loadExtSpy.called, true, "_loadCoreExt for URL application was called");
    });

    QUnit.test("test NWBC navigation ", function (assert) {
        const loadExtSpy = sandbox.spy(this.oController, "_loadCoreExt");

        this.oController._loadCoreExtNonUI5({ applicationType: "NWBC" });
        assert.strictEqual(loadExtSpy.called, true, "_loadCoreExt for NWBC application was called");
    });

    QUnit.test("test WDA navigation ", async function (assert) {
        // Arrange
        // eslint-disable-next-line max-len
        const sNotLongUrl = "https://some.base.name.corp:12345/sap/bc/ui2/nwbc/~canvas;window=app/wda/FAC_GL_ACCOUNT/?sap-client=500&sap-wd-configId=FAC_GL_ACCOUNT_AC&sap-ie=EDGE&WDUIGUIDELINE=FIORI&%2fERP%2fCATEGORY=ACT01&%2fERP%2fCHRTACCT=INT&sap-client=902&sap-language=EN";
        const oResolvedHashFragment = {
            applicationType: "NWBC",
            url: sNotLongUrl,
            additionalInformation: "",
            navigationMode: "newWindowThenEmbedded"
        };
        this.NavTargetResolutionInternal.resolveHashFragment.resolvesDeferred(oResolvedHashFragment);

        const sShellHash = "#semanticObject-action?";
        const sCurrentLocationHash = sShellHash;
        sandbox.stub(ApplicationContainer.prototype, "_checkNwbcUrlAdjustment").returns(sCurrentLocationHash);

        this.oController._loadCoreExt = sandbox.spy();
        this.oController._requireCoreExt = sandbox.spy();
        sandbox.stub(WindowUtils, "openURL").returns();
        sandbox.stub(this.oController, "_changeWindowLocation").returns();
        sandbox.stub(this.oController, "_openAppInplace").returns();
        sandbox.stub(this.oController, "_getCurrentLocationHash").returns(sCurrentLocationHash);

        // Test the behaviour when navigationMode is newWindowThenEmbedded and coldStart=true.
        // The result should be one (new) call to navigate with navigationMode=embedded
        sandbox.stub(ushellUtils, "isColdStart").returns(false);
        sandbox.stub(Ui5History, "getInstance").returns({
            getDirection: function () {
                return "NewEntry";
            }
        });

        //  Act
        const oDeferred = this.oController.doHashChange(sShellHash, null, "", null, null);
        await ushellUtils.promisify(oDeferred);

        // Assert
        assert.strictEqual(oResolvedHashFragment.url, "#semanticObject-action?", `The URL was replaced and is now: ${oResolvedHashFragment.url}`);
    });

    /**
     * Test the correctness of navigation mode as it is changed in function navigate:
     *
     * navigation mode = newWindowThenEmbedded:
     *   If coldStart = true  => Call navigate once with "embedded";
     *   If coldStart = false => Call navigate once with "newWindow" for opening the app;
     *   If history.backwards => Call navigate once with "embedded".
     *
     * navigation mode = newWindow:
     *   If coldStart = true => call navigate once with "replace";
     *   If coldStart = false => call WindowUtils.openURL and _windowHistoryBack.
     */
    QUnit.test("test navigate - navigationMode change", async function (assert) {
        window._bTestNullNavigationMode = true;
        const sShellHash = "#semanticObject-action";

        this.oController._loadCoreExt = sandbox.spy();
        this.oController._requireCoreExt = sandbox.spy();
        sandbox.stub(WindowUtils, "openURL").returns();
        sandbox.stub(this.oController, "_changeWindowLocation").returns();
        sandbox.stub(this.oController, "_openAppInplace").resolves();
        sandbox.spy(this.oController, "_openAppExplace");

        // ===========================================================================
        // Arrange #0
        // Test the behaviour when navigationMode is newWindowThenEmbedded and coldStart=true.
        // The result should be one (new) call to navigate with navigationMode=embedded
        sandbox.stub(ushellUtils, "isColdStart").returns(true);
        let oResolvedHashFragment = {
            applicationType: "NWBC",
            url: "http://www.sap.com/index.html",
            additionalInformation: "",
            navigationMode: "newWindowThenEmbedded"
        };
        this.NavTargetResolutionInternal.resolveHashFragment.resolvesDeferred(oResolvedHashFragment);

        // Act #0
        const oDeferred0 = this.oController.doHashChange(sShellHash, null, "", null, null);
        await ushellUtils.promisify(oDeferred0);

        // Assert #0
        assert.ok(true, "Test #0 ===========================");
        assert.strictEqual(this.oController._openAppInplace.callCount, 1, "_openAppInplace called");
        assert.strictEqual(this.oController._openAppExplace.callCount, 0, "_openAppExplace not called");
        assert.strictEqual(oResolvedHashFragment.navigationMode, "embedded", `Navigate called with navigationMode=embedded: navigation mode ${oResolvedHashFragment.navigationMode}`);

        // ===========================================================================
        // Arrange #1
        // Prepare for next test. Make sure history.backwards=false won't cause the next test to succeed.
        ushellUtils.isColdStart.returns(undefined);
        oResolvedHashFragment = {
            applicationType: "NWBC",
            url: "http://www.sap.com/index.html",
            additionalInformation: "",
            navigationMode: "newWindowThenEmbedded"
        };
        this.NavTargetResolutionInternal.resolveHashFragment.resolvesDeferred(oResolvedHashFragment);
        sandbox.stub(Ui5History.getInstance(), "getDirection").returns("NewEntry");
        // Reset call counts
        this.oController._openAppInplace.resetHistory();
        this.oController._openAppExplace.resetHistory();

        // Act #1
        const oDeferred1 = this.oController.doHashChange(sShellHash, null, "", null, null);
        await ushellUtils.promisify(oDeferred1);

        // Assert #1
        assert.ok(true, "Test #1 ===========================");
        assert.strictEqual(this.oController._openAppInplace.callCount, 0, "_openAppInplace not called");
        assert.strictEqual(this.oController._openAppExplace.callCount, 1, "_openAppExplace called");
        assert.notStrictEqual(oResolvedHashFragment.navigationMode, "embedded", "Navigated with navigationMode other than embedded.");

        // Cleanup #1
        this.oController.bRestorePreviousHash = false;

        // ===========================================================================
        // Arrange #2
        // Test the behaviour when navigationMode is newWindowThenEmbedded and history.backwards=true.
        // The result should be one (new) call to navigate with navigationMode=embedded
        // simulate newWindowThenEmbedded url once navigated to
        Ui5History.getInstance().getDirection.returns("Backwards");
        ushellUtils.isColdStart.returns(undefined);
        oResolvedHashFragment = {
            applicationType: "NWBC",
            url: "http://www.sap.com/index.html",
            additionalInformation: "",
            navigationMode: "newWindowThenEmbedded"
        };
        this.NavTargetResolutionInternal.resolveHashFragment.resolvesDeferred(oResolvedHashFragment);
        // Reset call counts
        this.oController._openAppInplace.resetHistory();
        this.oController._openAppExplace.resetHistory();

        // Act #2
        const oDeferred2 = this.oController.doHashChange(sShellHash, null, "", null, null);
        await ushellUtils.promisify(oDeferred2);

        // Assert #2
        assert.ok(true, "Test #2 ===========================");
        assert.strictEqual(this.oController._openAppInplace.callCount, 1, "_openAppInplace called");
        assert.strictEqual(this.oController._openAppExplace.callCount, 0, "_openAppExplace not called");
        assert.strictEqual(oResolvedHashFragment.navigationMode, "embedded", "Navigated with navigationMode=embedded");

        // Cleanup #2
        Ui5History.getInstance().getDirection.restore();

        // ===========================================================================
        // Arrange #3
        // Test the behaviour when navigationMode is newWindowThenEmbedded and coldStart=false.
        // The result should be one (new) call to navigate with navigationMode=newWindow
        ushellUtils.isColdStart.returns(false);
        oResolvedHashFragment = {
            applicationType: "NWBC",
            url: "http://www.sap.com/index.html",
            additionalInformation: "",
            navigationMode: "newWindowThenEmbedded"
        };
        this.NavTargetResolutionInternal.resolveHashFragment.resolvesDeferred(oResolvedHashFragment);
        // Reset call counts
        this.oController._openAppInplace.resetHistory();
        this.oController._openAppExplace.resetHistory();

        // Act #3
        const oDeferred3 = this.oController.doHashChange(sShellHash, null, "", null, null);
        await ushellUtils.promisify(oDeferred3);

        // Assert #3
        assert.ok(true, "Test #3 ===========================");
        assert.strictEqual(this.oController._openAppInplace.callCount, 0, "_openAppInplace not called");
        assert.strictEqual(this.oController._openAppExplace.callCount, 1, "_openAppExplace called");
        assert.strictEqual(oResolvedHashFragment.navigationMode, "newWindow", "Navigated with navigationMode=newWindow");

        // Cleanup #3
        this.oController.bRestorePreviousHash = false;

        // ===========================================================================
        // Arrange #4
        // Test the behaviour when navigationMode is newWindow and coldStart=true.
        // The result should be one (new) call to navigate with navigationMode=replace
        ushellUtils.isColdStart.returns(true);
        oResolvedHashFragment = {
            applicationType: "XXX",
            url: "http://www.sap.com/index.html",
            additionalInformation: "",
            navigationMode: "newWindow"
        };
        this.NavTargetResolutionInternal.resolveHashFragment.resolvesDeferred(oResolvedHashFragment);
        // Reset call counts
        this.oController._openAppInplace.resetHistory();
        this.oController._openAppExplace.resetHistory();

        // Act #4
        const oDeferred4 = this.oController.doHashChange(sShellHash, null, "", null, null);
        await ushellUtils.promisify(oDeferred4);

        // Assert #4
        assert.ok(true, "Test #4 ===========================");
        assert.strictEqual(this.oController._openAppInplace.callCount, 1, "_openAppInplace called");
        assert.strictEqual(this.oController._openAppExplace.callCount, 0, "_openAppExplace not called");
        assert.strictEqual(oResolvedHashFragment.navigationMode, "replace", "Navigated with navigationMode=replace");

        // Cleanup #4
        this.oController.bEnableHashChange = true; // 'replace' changed bEnableHashChange to false

        // ===========================================================================
        // Arrange #5
        // Test the behaviour when navigationMode is newWindow and coldStart=false.
        // The result: WindowUtils.openURL and _windowHistoryBack are called
        sandbox.spy(this.oController.history, "pop");
        ushellUtils.isColdStart.returns(false);

        const oMockComponent = { destroy: sandbox.stub() };
        const oMockComponentHandle = { getInstance: function () { return oMockComponent; } };

        oResolvedHashFragment = {
            applicationType: "XXX",
            url: "http://www.sap.com/index.html",
            additionalInformation: "",
            navigationMode: "newWindow",
            componentHandle: oMockComponentHandle
        };
        this.NavTargetResolutionInternal.resolveHashFragment.resolvesDeferred(oResolvedHashFragment);
        // Reset call counts
        this.oController._openAppInplace.resetHistory();
        this.oController._openAppExplace.resetHistory();
        this.oController._windowHistoryBack.resetHistory();
        WindowUtils.openURL.resetHistory();
        this.oController._windowHistoryBack.resetHistory();

        // Act #5
        const oDeferred5 = this.oController.doHashChange(sShellHash, null, "", null, null);
        await ushellUtils.promisify(oDeferred5);

        // Assert #5
        assert.ok(true, "Test #5 ===========================");
        assert.strictEqual(this.oController._openAppInplace.callCount, 0, "_openAppInplace not called");
        assert.strictEqual(this.oController._openAppExplace.callCount, 1, "_openAppExplace called");
        assert.strictEqual(WindowUtils.openURL.callCount, 1, "WindowUtils.openURL called once");
        assert.strictEqual(this.oController._windowHistoryBack.callCount, 1, "_windowHistoryBack called once");
        assert.strictEqual(oMockComponent.destroy.callCount, 1, "destroy called");

        // Cleanup #5
        this.oController.bRestorePreviousHash = false;

        // ===========================================================================
        // Arrange #6
        // Test the behaviour when resolveHashFragment resolves to undefined (no coldstart case)
        sandbox.stub(window.hasher, "setHash");
        ushellUtils.isColdStart.returns(false);
        this.NavTargetResolutionInternal.resolveHashFragment.resolvesDeferred(undefined);
        // Reset call counts
        this.oController._openAppInplace.resetHistory();
        this.oController._openAppExplace.resetHistory();
        this.oController._windowHistoryBack.resetHistory();
        this.oController.history.pop.resetHistory();

        // Act #6
        const oDeferred6 = this.oController.doHashChange(sShellHash, null, "", null, null);
        await ushellUtils.promisify(oDeferred6);

        // Assert #6
        assert.ok(true, "Test #6 ===========================");
        assert.strictEqual(this.oController._openAppInplace.callCount, 0, "_openAppInplace not called");
        assert.strictEqual(this.oController._openAppExplace.callCount, 0, "_openAppExplace not called");
        assert.strictEqual(this.oController._windowHistoryBack.callCount, 1, "_windowHistoryBack called once");
        assert.strictEqual(this.oController.history.pop.callCount, 1, "History pop is called once");
        assert.strictEqual(window.hasher.setHash.callCount, 0, "window.hasher.setHash was not called");

        // Cleanup #7
        this.oController.bEnableHashChange = true;

        // ===========================================================================
        // Arrange #7
        // Test the behaviour when resolveHashFragment resolves to undefined (coldstart case)
        ushellUtils.isColdStart.returns(true);
        this.NavTargetResolutionInternal.resolveHashFragment.resolvesDeferred(undefined);
        // Reset call counts
        this.oController._openAppInplace.resetHistory();
        this.oController._openAppExplace.resetHistory();
        this.oController._windowHistoryBack.resetHistory();
        this.oController.history.pop.resetHistory();

        // Act #7
        const oDeferred7 = this.oController.doHashChange(sShellHash, null, "", null, null);
        await ushellUtils.promisify(oDeferred7);

        // Assert #7
        assert.ok(true, "Test #7 ===========================");
        assert.strictEqual(this.oController._openAppInplace.callCount, 0, "_openAppInplace not called");
        assert.strictEqual(this.oController._openAppExplace.callCount, 0, "_openAppExplace not called");
        assert.strictEqual(this.oController._windowHistoryBack.callCount, 0, "_windowHistoryBack not called");
        assert.strictEqual(this.oController.history.pop.callCount, 0, "History pop is not called");
        assert.strictEqual(window.hasher.setHash.callCount, 1, "window.hasher.setHash was called");

        // Cleanup
        window._bTestNullNavigationMode = false;
    });

    QUnit.test("navigate: Heal navigationMode when navigationMode is not part of resolution result", async function (assert) {
        sandbox.stub(Container, "getServiceAsync");

        const oResolvedHashFragment = {
            applicationType: "NWBC",
            additionalInformation: ""
            // navigationMode: undefined
        };
        Container.getServiceAsync.withArgs("NavTargetResolutionInternal").resolves({
            resolveHashFragment: sandbox.stub().resolvesDeferred(oResolvedHashFragment)
        });
        Container.getServiceAsync.callThrough();
        const sShellHash = "#semanticObject-action";

        sandbox.stub(ushellUtils, "isColdStart").returns(false);
        const oHashChangeFailureStub = sandbox.stub(this.oController, "hashChangeFailure");
        const oOpenAppInplaceStub = sandbox.stub(this.oController, "_openAppInplace");

        const oDeferred = this.oController.doHashChange(sShellHash, null, "", null, null);
        await ushellUtils.promisify(oDeferred);

        assert.ok(!oHashChangeFailureStub.called, "hashChangeFailure hasn't been called");
        assert.ok(oOpenAppInplaceStub.called, "_openAppInplace has been called");
    });

    QUnit.test("test navigate - restores url to correct hash after navigation occurs when intent to external url is navigated from the same window", async function (assert) {
        sandbox.stub(ushellUtils, "isNativeWebGuiNavigation").returns(false);
        sandbox.stub(WindowUtils, "openURL");
        sandbox.stub(this.oController, "hashChangeFailure");
        sandbox.stub(this.oController, "_changeWindowLocation");
        sandbox.stub(this.oController, "_openAppInplace").resolves();
        sandbox.stub(ushellUtils, "isColdStart").returns(false);
        sandbox.stub(window.hasher, "replaceHash");

        this.NavTargetResolutionInternal.resolveHashFragment.resolvesDeferred({
            applicationType: "URL",
            additionalInformation: "",
            text: "toAbsoluteUrl",
            navigationMode: "newWindow"
        });

        // Act
        const oDeferred = this.oController.doHashChange(
            "#Action-toAbsoluteUrl",
            null,
            "",
            null,
            null
        );
        await ushellUtils.promisify(oDeferred);

        // Assert
        assert.strictEqual(this.oController.hashChangeFailure.called, false, "hashChangeFailure was not called");
        assert.strictEqual(this.oController._changeWindowLocation.callCount, 0, "_changeWindowLocation was not called");

        assert.strictEqual(this.oController._windowHistoryBack.callCount, 1, "_windowHistoryBack was called");
        assert.deepEqual(this.oController._windowHistoryBack.getCall(0).args[0], 1, "_windowHistoryBack was called with the expected parameter");

        assert.strictEqual(window.hasher.replaceHash.callCount, 0, "window.hasher.replaceHash was not called");
    });

    QUnit.test("test navigate - restores url to correct hash after navigation occurs when intent to external url is pasted in a new window", async function (assert) {
        sandbox.stub(ushellUtils, "isNativeWebGuiNavigation").returns(false);
        sandbox.stub(WindowUtils, "openURL");
        sandbox.stub(this.oController, "hashChangeFailure");
        sandbox.stub(this.oController, "_changeWindowLocation");
        sandbox.spy(this.oController, "_openAppInplace");
        sandbox.stub(ushellUtils, "isColdStart").returns(true);
        sandbox.stub(window.hasher, "replaceHash");

        const oResolvedHashFragment = {
            applicationType: "URL",
            additionalInformation: "",
            text: "toAbsoluteUrl",
            url: "http://test",
            navigationMode: "newWindow"
        };
        this.NavTargetResolutionInternal.resolveHashFragment.resolvesDeferred(oResolvedHashFragment);

        // Act
        const oDeferred = this.oController.doHashChange(
            "#Action-toAbsoluteUrl",
            null,
            "",
            null,
            null
        );
        await ushellUtils.promisify(oDeferred);

        // Assert
        assert.strictEqual(this.oController._openAppInplace.callCount, 1, "_openAppInplace was called");
        assert.strictEqual(this.oController.hashChangeFailure.callCount, 0, "hashChangeFailure was not called");

        assert.strictEqual(this.oController._changeWindowLocation.callCount, 1, "_changeWindowLocation was called");
        assert.deepEqual(this.oController._changeWindowLocation.getCall(0).args[0], "http://test", "_changeWindowLocation was called with the expected parameter");


        assert.strictEqual(this.oController._windowHistoryBack.callCount, 0, "_windowHistoryBack was not called");

        assert.strictEqual(window.hasher.replaceHash.callCount, 0, "window.hasher.replaceHash was not called");
    });

    QUnit.test("ASYNC - test getLogonProvider api", function (assert) {
        const sapUshellConfig = window["sap-ushell-config"];
        let iframe,
            logonProvider;
        const done = assert.async();

        sandbox.stub(Theming, "attachApplied");
        sapUshellConfig.renderers = { fiori2: { componentData: { config: { rootIntent: "Shell-home" } } } };
        window["sap-ushell-config"] = sapUshellConfig;
        return Container.createRendererInternal("fiori2").then((oRenderer) => {
            EventHub.once("RendererLoaded").do(async () => {
                await testUtils.waitForEventHubEvent("ShellNavigationInitialized");

                logonProvider = this.oController._getLogonFrameProvider();
                iframe = logonProvider.create();

                assert.strictEqual(iframe.getAttribute("id"), "SAMLDialogFrame", "Verify SAML logon iframe ID is samlLogonFrame");
                assert.strictEqual(iframe.nodeName, "IFRAME", "Verify SAML logon frame nodeName is an IFRAME");
                assert.strictEqual(iframe.getAttribute("src"), "", "Verify SAML logon frame src is empty");

                // Check function functions well (skipping on DOM checks or CSS classes existence..)
                logonProvider.show();
                logonProvider.destroy();

                // Test API create, show and destroy must be exposed for UI5 services:
                assert.strictEqual(typeof logonProvider.create, "function", "Verify that oController._getLogonFrameProvider().create() exists");
                assert.strictEqual(typeof logonProvider.show, "function", "Verify that oController._getLogonFrameProvider().show() exists");
                assert.strictEqual(typeof logonProvider.destroy, "function", "Verify that oController._getLogonFrameProvider().destroy() exists");
                await oRenderer.destroy();

                done();
            });
        });
    });

    /**
     * Test the correctness of the state, in "embedded" navMode.
     * The state is manipulated by the calls to switchViewState in _openAppInplace:
     *   If applicationType = "NWBC" => state = "minimal";
     *   If applicationType = "TR" => state = "minimal";
     *   If sShellHash = "#" => state = "home";
     *   If non of the above => state = "app".
     */
    [
        { sApplicationType: "NWBC" },
        { sApplicationType: "TR" }
    ].forEach((oFixture) => {
        QUnit.test(`test navigate - switching view state - ${oFixture.sApplicationType}`, async function (assert) {
            let oResolvedHashFragment = {
                applicationType: oFixture.sApplicationType,
                url: "XXX",
                additionalInformation: "",
                navigationMode: "embedded"
            };
            this.NavTargetResolutionInternal.resolveHashFragment.resolvesDeferred(oResolvedHashFragment);
            const sShellHash = "#semanticObject-action";

            this.oController.oViewPortContainer = {
                removeCenterViewPort:
                    function () { return null; },
                navTo:
                    function () { return null; },
                getViewPortControl:
                    function () { return null; },
                addCenterViewPort:
                    function () { return null; }
            };

            await AppLifeCycleAI.init(this.oController.oViewPortContainer, false);

            this.oController._loadCoreExt = sandbox.spy();
            this.oController._requireCoreExt = sandbox.spy();
            sandbox.stub(AppLifeCycleAI, "handleCreateApplicationContainer");
            const switchViewStateSpy = sandbox.spy(AppLifeCycleAI, "switchViewState");

            const oDeferred = this.oController.doHashChange(sShellHash, null, "", null, null);
            await ushellUtils.promisify(oDeferred);

            assert.strictEqual(AppLifeCycleAI.switchViewState.callCount, 1, "switchViewState called");
            assert.strictEqual(AppLifeCycleAI.switchViewState.args[0][0], "app", "switching to state minimal");

            oResolvedHashFragment = {
                applicationType: "Whatever",
                url: "AnyUrl",
                additionalInformation: "",
                navigationMode: "embedded"
            };
            this.NavTargetResolutionInternal.resolveHashFragment.resolvesDeferred(oResolvedHashFragment);

            const oDeferred2 = this.oController.doHashChange("#", null, "", null, null);
            await ushellUtils.promisify(oDeferred2);

            assert.strictEqual(AppLifeCycleAI.switchViewState.callCount, 2, "switchViewState called");
            assert.strictEqual(AppLifeCycleAI.switchViewState.args[1][0], "home", "switching to state home");

            const oDeferred3 = this.oController.doHashChange("XX", null, "", null, null);
            await ushellUtils.promisify(oDeferred3);

            assert.strictEqual(AppLifeCycleAI.switchViewState.callCount, 3, "switchViewState called");
            assert.strictEqual(AppLifeCycleAI.switchViewState.args[2][0], "app", "switching to state app");

            switchViewStateSpy.restore();
        });
    });

    // (function () {
    //     function createStubsForHandleEmbeddedNavMode (oController, oActiveStatefulContainers, sNavigateToContainer) {
    //         var oResolvedHashFragment = {
    //             applicationType: sNavigateToContainer,
    //             url: "XXX",
    //             additionalInformation: "",
    //             navigationMode: "embedded"
    //         };
    //
    //         var oMetadata = {},
    //             oParsedShellHash = {
    //                 action: "action",
    //                 appSpecificRoute: undefined,
    //                 contextRaw: undefined,
    //                 params: {},
    //                 semanticObject: "semanticObject"
    //             },
    //             sFixedShellHash = "semanticObject-action";
    //
    //         function createApplicationContainer (bIsActive) {
    //             return {
    //                 _getIFrame: function () {
    //                     return { contentWindow: { postMessage: sandbox.stub() } };
    //                 },
    //                 getId: function () { return null; },
    //                 setActive: sandbox.stub(),
    //                 getActive: sandbox.stub().returns(bIsActive),
    //                 destroy: sandbox.spy(),
    //                 setNewApplicationContext: sandbox.stub().returns(Promise.resolve()),
    //                 toggleStyleClass: sandbox.stub()
    //             };
    //         }
    //
    //         AppLifeCycle.setStatefulApplicationContainer(Object.keys(oActiveStatefulContainers || {}).reduce(function (oContainers, sTechnology) {
    //             var oApplicationContainerInnerControl = createApplicationContainer(oActiveStatefulContainers[sTechnology]);
    //             oContainers[sTechnology] = oApplicationContainerInnerControl;
    //             return oContainers;
    //         }, {}));
    //
    //         var switchViewStateSpy,
    //             oNavigateToInnerControl =
    //                 AppLifeCycle.getStatefulApplicationContainer()[sNavigateToContainer]
    //                 || createApplicationContainer(true /* bIsActive */);
    //
    //         oController.initShellUIService();
    //
    //         oController.oViewPortContainer = {
    //             navTo: sandbox.spy(),
    //             getViewPortControl: sandbox.spy(),
    //             addCenterViewPort: sandbox.spy(),
    //             removeCenterViewPort: sandbox.spy()
    //         };
    //
    //         AppLifeCycle.removeControl = sandbox.spy();
    //         oController._loadCoreExt = sandbox.spy();
    //         oController._requireCoreExt = sandbox.spy();
    //
    //         var oGetWrappedApplicationStub = sandbox.stub(oController, "getWrappedApplicationWithMoreStrictnessInIntention").returns(oNavigateToInnerControl);
    //
    //         switchViewStateSpy = sandbox.spy(AppLifeCycle, "switchViewState");
    //         AppLifeCycle.getControl = sandbox.stub().returns(oNavigateToInnerControl);
    //
    //         switchViewStateSpy.restore();
    //
    //         return {
    //             sFixedShellHash: sFixedShellHash,
    //             oParsedShellHash: oParsedShellHash,
    //             oMetadata: oMetadata,
    //             oResolvedHashFragment: oResolvedHashFragment,
    //             oInnerControl: oNavigateToInnerControl,
    //             oGetWrappedApplicationStub: oGetWrappedApplicationStub
    //         };
    //     }
    //
    //     function restoreStubs (oStubs) {
    //         oStubs.oGetWrappedApplicationStub.restore();
    //     }
    //
    //     [{
    //         testDescription: "two persistent containers exist",
    //         oActiveStatefulContainers: {
    //             WDA: true, // isActive?
    //             TR: false
    //         },
    //         sNavigateToContainer: "TR",
    //         expectedVal: {
    //             WDA: { recNumber: 0, recCount: 1 },
    //             TR: { recNumber: 1, recCount: 2 }
    //         },
    //         expectedActiveAfterNavigation: {
    //             WDA: false,
    //             TR: true
    //         }
    //     }].forEach(function (oFixture) {
    //         QUnit.test("#_handleEmbeddedNavMode sets active containers as expected, when " + oFixture.testDescription, function (assert) {
    //             var oStubs = createStubsForHandleEmbeddedNavMode(
    //                 oController,
    //                 oFixture.oActiveStatefulContainers,
    //                 oFixture.sNavigateToContainer
    //             ),
    //                 done = assert.async();
    //
    //             var oParsedShellHash = oStubs.oParsedShellHash,
    //                 oMetadata = oStubs.oMetadata,
    //                 oResolvedHashFragment = oStubs.oResolvedHashFragment,
    //                 sFixedShellHash = oStubs.sFixedShellHash;
    //
    //             AppLifeCycle.init(oController.oViewPortContainer, false);
    //             oController._handleEmbeddedNavMode(sFixedShellHash, oParsedShellHash, oMetadata, oResolvedHashFragment).then(function () {
    //                 Object.keys(AppLifeCycle.getStatefulApplicationContainer()).forEach(function (sTechnology) {
    //                     // all the stateful container should be updated when an embedded navigation occurs
    //                     assert.strictEqual(
    //                         AppLifeCycle.getStatefulApplicationContainer()[sTechnology].setActive.callCount,
    //                         oFixture.expectedVal[sTechnology].recCount,
    //                         "setActive was called the expected number of times on " + sTechnology + " container"
    //                     );
    //
    //                     // if active: setActive(true)
    //                     // if inactive: setActive(false)
    //                     assert.strictEqual(
    //                         AppLifeCycle.getStatefulApplicationContainer()[sTechnology].setActive.getCall(oFixture.expectedVal[sTechnology].recNumber).args[0],
    //                         oFixture.expectedActiveAfterNavigation[sTechnology],
    //                         "setActive was called with 'true' on " + sTechnology + " container"
    //                     );
    //                 });
    //                 restoreStubs(oStubs);
    //                 done();
    //             });
    //         });
    //     });
    //
    //     [{
    //         callCount: 2,
    //         testDescription: "#_handleEmbeddedNavMode when `bReuseAnExistingAppSession` is set to `true`",
    //         oActiveStatefulContainers: { TR: true /* isActive? */ },
    //         bReuseAnExistingAppSession: true,
    //         sNavigateToContainer: "TR"
    //     }, {
    //         callCount: 1,
    //         testDescription: "#_handleEmbeddedNavMode when `bReuseAnExistingAppSession` is set to `false`",
    //         oActiveStatefulContainers: {}, // no active containers
    //         bReuseAnExistingAppSession: false,
    //         sNavigateToContainer: "URL"
    //     }].forEach(function (oFixture) {
    //         QUnit.test(oFixture.testDescription, function (assert) {
    //             // little sanity
    //             if (oFixture.bReuseAnExistingAppSession && Object.keys(oFixture.oActiveStatefulContainers).length === 0) {
    //                 throw new Error("Fixture should specify entries in oActiveStatefulContainers if bReuseAnExistingAppSession is set to true");
    //             }
    //             if (!oFixture.bReuseAnExistingAppSession && Object.keys(oFixture.oActiveStatefulContainers).length > 0) {
    //                 throw new Error("Fixture should not specify entries in oActiveStatefulContainers if bReuseAnExistingAppSession is set to false");
    //             }
    //
    //             var reuseApplicationContainerStub = sandbox.spy(AppLifeCycle, "reuseApplicationContainer"),
    //                 done = assert.async(),
    //                 oStubs = createStubsForHandleEmbeddedNavMode(
    //                     oController,
    //                     oFixture.oActiveStatefulContainers,
    //                     oFixture.sNavigateToContainer
    //                 ),
    //                 oParsedShellHash = oStubs.oParsedShellHash,
    //                 oMetadata = oStubs.oMetadata,
    //                 oResolvedHashFragment = oStubs.oResolvedHashFragment,
    //                 oInnerControl = oStubs.oInnerControl,
    //                 sFixedShellHash = oStubs.sFixedShellHash;
    //
    //             oController._handleEmbeddedNavMode(sFixedShellHash, oParsedShellHash, oMetadata, oResolvedHashFragment).then(function () {
    //                 if (oFixture.bReuseAnExistingAppSession) {
    //                     assert.equal(
    //                         oInnerControl.setNewApplicationContext.calledOnce,
    //                         true,
    //                         "Existing session is considered and is requested to set a new application context"
    //                     );
    //                     assert.equal(
    //                         oInnerControl.setNewApplicationContext.args[0][0],
    //                         oResolvedHashFragment.applicationType,
    //                         "setNewApplicationContext is called with the application type as argument"
    //                     );
    //                     assert.equal(
    //                         oInnerControl.setNewApplicationContext.args[0][1],
    //                         oResolvedHashFragment.url,
    //                         "setNewApplicationContext is called with the url of the expected new context as argument"
    //                     );
    //                 } else {
    //                     assert.equal(
    //                         oInnerControl.setNewApplicationContext.called,
    //                         false,
    //                         "Session reuse is not required and NO request is sent to create a new context under an existing session"
    //                     );
    //                     assert.equal(
    //                         AppLifeCycle.reuseApplicationContainer.calledOnce,
    //                         false,
    //                         "oInnerControl.destroy is called"
    //                     );
    //                 }
    //
    //                 assert.strictEqual(
    //                     oInnerControl.setActive.callCount,
    //                     oFixture.callCount,
    //                     "setActive is called once"
    //                 );
    //
    //                 if (oInnerControl.setActive.callCount === 1) {
    //                     assert.strictEqual(
    //                         oInnerControl.setActive.getCall(0).args[0],
    //                         true,
    //                         "setActive is called with true as its first argument"
    //                     );
    //                 }
    //                 reuseApplicationContainerStub.restore();
    //                 restoreStubs(oStubs);
    //                 done();
    //             });
    //         });
    //     });
    // })();

    // QUnit.test("test navigate - check sAppId", function (assert) {
    //     var oResolvedHashFragment = {
    //             additionalInformation: "aaa",
    //             applicationType: "URL",
    //             fullWidth: undefined,
    //             url: "http://xxx.yyy",
    //             navigationMode: "embedded",
    //             text: "bla bla"
    //         },
    //         done = assert.async(),
    //         oParsedShellHash = {
    //             action: "bbb",
    //             url: "http://xxx.yyy",
    //             appSpecificRoute: undefined,
    //             contextRaw: undefined,
    //             params: {},
    //             semanticObject: "aaa"
    //         },
    //         oMetadata = {},
    //         sFixedShellHash = "aaa-bbb";
    //
    //     oController.oViewPortContainer = {
    //         getViewPortControl: function (/*inner*/) { },
    //         addCenterViewPort: function (inner) {
    //             assert.strictEqual(inner.getId(), "application-aaa-bbb", "validate sAppId");
    //         },
    //         navTo: sandbox.stub()
    //     };
    //
    //     oController.oExtensionShellStates = { home: {} };
    //     oController.initShellUIService();
    //     oController.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment).then(function () {
    //         assert.strictEqual(AppLifeCycle.getViewPortContainer().addCenterViewPort.args[0][0].sId, "application-aaa-bbb", "validate sAppId");
    //         done();
    //     });
    // });

    [{
        sTestDescription: "an AppRouter exists",
        bAppRouterExists: true,
        bExpectedGetRouterCalled: true
    }, {
        sTestDescription: "an AppRouter does not exist",
        bAppRouterExists: false,
        bExpectedGetRouterCalled: false
    }].forEach((oFixture) => {
        QUnit.test(`_getCurrentAppRouter: ${oFixture.sTestDescription}`, function (assert) {
            // Arrange
            let bGetRouterCalled = false;

            this.oController._oAppLifeCycleService = {
                getCurrentApplication: function () {
                    return oFixture.bAppRouterExists && {
                        componentInstance: {
                            getRouter: function () { bGetRouterCalled = true; }
                        }
                    };
                }
            };

            // Act
            this.oController._getCurrentAppRouter();
            // Assert
            assert.strictEqual(bGetRouterCalled, oFixture.bExpectedGetRouterCalled, `router was (not) returned when ${oFixture.sTestDescription}`);
        });
    });

    QUnit.test("_disableSourceAppRouter: ", function (assert) {
        [{
            sTestDescription: "the Hash does not change (inner app link)",
            sNewHash: "#Action-toAppNavSample&/View1/",
            sOldHash: "#Action-toAppNavSample",
            bAppRouterExists: true,
            bExpectedStopCalled: false
        }, {
            sTestDescription: "the Hash does not change (inner app link), but no AppRouter is given",
            sNewHash: "#Action-toAppNavSample&/View1/",
            sOldHash: "#Action-toAppNavSample",
            bAppRouterExists: false,
            bExpectedStopCalled: false
        }, {
            sTestDescription: "the Hash changes (cross application)",
            sNewHash: "#Action-toAppNavSample2",
            sOldHash: "#Action-toAppNavSample",
            bAppRouterExists: true,
            bExpectedStopCalled: true
        }, {
            sTestDescription: "the Hash changes (cross application), but no AppRouter is given",
            sNewHash: "#Action-toAppNavSample2",
            sOldHash: "#Action-toAppNavSample",
            bAppRouterExists: false,
            bExpectedStopCalled: false
        }, {
            sTestDescription: "an empty parameter is not removed",
            sNewHash: "#Action-toAppNavSample?p1=v1&p2=v2&=some/value",
            sOldHash: "#Action-toAppNavSample?p1=v1&p2=v2",
            bAppRouterExists: true,
            bExpectedStopCalled: true
        }, {
            sTestDescription: "a parameter is changed",
            sNewHash: "#Action-toAppNavSample?p1=v1&p2=v2&p3=some/value",
            sOldHash: "#Action-toAppNavSample?p1=v1&p2=v2",
            bAppRouterExists: true,
            bExpectedStopCalled: true
        }, {
            sTestDescription: "a parameter is changed, but no AppRouter is given",
            sNewHash: "#Action-toAppNavSample?p1=v1&p2=v2&p3=some/value",
            sOldHash: "#Action-toAppNavSample?p1=v1&p2=v2",
            bAppRouterExists: false,
            bExpectedStopCalled: false
        }].forEach((oFixture) => {
            // Arrange
            let bStopCalled = false;
            const fnGetCurrentAppRouterStub = sandbox.stub(this.oController, "_getCurrentAppRouter");

            if (oFixture.bAppRouterExists) {
                fnGetCurrentAppRouterStub.returns({
                    stop: function () { bStopCalled = true; },
                    isInitialized: sandbox.stub().returns(true)
                });
            }

            // Act
            this.oController._disableSourceAppRouter(oFixture.sNewHash, oFixture.sOldHash);

            // Assert
            assert.strictEqual(bStopCalled, oFixture.bExpectedStopCalled, `router was (not) stopped when ${oFixture.sTestDescription}`);

            fnGetCurrentAppRouterStub.restore();
        });
    });

    QUnit.test("_resumeAppRouterIgnoringCurrentHash: ", function (assert) {
        [{
            sTestDescription: "an AppRouter exists",
            bAppRouterExists: true,
            bExpectedInitializeCalled: true
        }, {
            sTestDescription: "an AppRouter does not exist",
            bAppRouterExists: false,
            bExpectedInitializeCalled: false
        }].forEach((oFixture) => {
            // Arrange
            let bInitializeCalled = false;
            const fnGetCurrentAppRouterStub = sandbox.stub(this.oController, "_getCurrentAppRouter");

            if (oFixture.bAppRouterExists) {
                fnGetCurrentAppRouterStub.returns({
                    initialize: function () { bInitializeCalled = true; }
                });
            }

            // Act
            this.oController._resumeAppRouterIgnoringCurrentHash();

            // Assert
            assert.strictEqual(bInitializeCalled, oFixture.bExpectedInitializeCalled, `router was (not) initialized when ${oFixture.sTestDescription}`);

            fnGetCurrentAppRouterStub.restore();
        });
    });

    QUnit.module("Data loss navigation handler - helper functions: The _restoreHashUsingAction helper function", {
        beforeEach: async function () {
            this.oSetDirtyFlagStub = sandbox.stub(Container, "setDirtyFlag");

            // Instantiate the shell controller with a minimal capability
            this.oController = await Controller.create({ name: "sap.ushell.renderer.Shell" });
            this.oConfirmStub = sandbox.stub(window, "confirm");

            this.oGetTextStub = sandbox.stub(resources.i18n, "getText");
            this.oPostMessageStub = sandbox.stub(PostMessageUtils, "postMessageToMultipleIframes");
            this.oController.oShellNavigationInternal = {
                wasHistoryEntryReplaced: sandbox.stub().returns(true)
            };

            this.oRestoreHashStrategyStub = sandbox.stub(this.oController, "_getRestoreHashStrategy").returns("replaceHash");
            this.oResumeAppRouterStub = sandbox.stub(this.oController, "_resumeAppRouterIgnoringCurrentHash").returns(true);
            this.oRestoreHashStub = sandbox.stub(this.oController, "_restoreHash").returns("custom stuff");
            sandbox.stub(this.oController, "_windowHistoryBack");
            sandbox.stub(this.oController, "_windowHistoryForward");
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.onExit(); // Only called automatically when connected to a view
            this.oController.destroy();
            StateManager.resetAll();
        }
    });

    QUnit.test("Returns the correct status", function (assert) {
        // Arrange
        // Act
        const sReturnValue = this.oController._restoreHashUsingAction("#something-outdated", "undo");

        // Assert
        assert.strictEqual("custom stuff", sReturnValue, "Undo navigation returns custom navigation.");
        assert.ok(this.oController.oShellNavigationInternal.wasHistoryEntryReplaced.calledOnce, "wasHistoryEntryReplaced was called");
        assert.ok(this.oRestoreHashStrategyStub.calledOnce, "_getRestoreHashStrategy was called");
        assert.deepEqual(this.oRestoreHashStrategyStub.firstCall.args, [true, "undo"], "_getRestoreHashStrategy was called with the correct parameters");
        assert.ok(this.oResumeAppRouterStub.calledOnce, "_resumeAppRouterIgnoringCurrentHash was called");
        assert.ok(this.oRestoreHashStub.calledOnce, "_restoreHash was called");
        assert.ok(this.oRestoreHashStub.calledWith("replaceHash", "#something-outdated"), "_restoreHash was called with the correct parameters");
    });

    QUnit.module("Data loss navigation handler - helper functions: The _handleDirtyStateUserConfirm helper function", {
        beforeEach: async function () {
            this.oSetDirtyFlagStub = sandbox.stub(Container, "setDirtyFlag");
            this.oNotifyAsyncStepStub = sandbox.stub(Interaction, "notifyAsyncStep");

            // Instantiate the shell controller with a minimal capability
            this.oController = await Controller.create({ name: "sap.ushell.renderer.Shell" });

            this.oConfirmStub = sandbox.stub(window, "confirm");

            this.oGetTextStub = sandbox.stub(resources.i18n, "getText");
            this.oPostMessageStub = sandbox.stub(PostMessageUtils, "postMessageToMultipleIframes");

            sandbox.stub(this.oController, "_windowHistoryBack");
            sandbox.stub(this.oController, "_windowHistoryForward");
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.onExit(); // Only called automatically when connected to a view
            this.oController.destroy();
            StateManager.resetAll();
        }
    });

    QUnit.test("Shows a confirm dialog with the correct text", function (assert) {
        // Arrange
        const oResolveAsyncStepStub = sandbox.stub();
        this.oNotifyAsyncStepStub.returns(oResolveAsyncStepStub);
        this.oConfirmStub.returns(false);
        this.oGetTextStub.withArgs("dataLossInternalMessage").returns("Some Text");

        // Act
        const bResult = this.oController._handleDirtyStateUserConfirm();

        // Assert
        assert.strictEqual(bResult, false, "The correct result was returned");
        assert.strictEqual(this.oConfirmStub.callCount, 1, "The function window.confirm has been called once.");
        assert.deepEqual(this.oConfirmStub.firstCall.args, ["Some Text"], "The function window.confirm has been called with the correct parameters.");
        assert.strictEqual(this.oNotifyAsyncStepStub.callCount, 1, "notifyAsyncStep was called");
        assert.strictEqual(oResolveAsyncStepStub.callCount, 1, "notifyAsyncStep-resolve was called");
    });

    QUnit.test("Handles confirm correctly", function (assert) {
        // Arrange
        const oResolveAsyncStepStub = sandbox.stub();
        this.oNotifyAsyncStepStub.returns(oResolveAsyncStepStub);
        this.oConfirmStub.returns(true);

        // Act
        const bResult = this.oController._handleDirtyStateUserConfirm();

        // Assert
        assert.strictEqual(bResult, true, "The correct result was returned");
        assert.deepEqual(this.oSetDirtyFlagStub.getCall(0).args, [false], "setDirtyFlag was called with the correct args.");
        const bPreviousPageDirty = this.oController._getPreviousPageDirty();
        assert.strictEqual(bPreviousPageDirty, true, "bPreviousPageDirty was set correctly");
        assert.strictEqual(this.oNotifyAsyncStepStub.callCount, 1, "notifyAsyncStep was called");
        assert.strictEqual(oResolveAsyncStepStub.callCount, 1, "notifyAsyncStep-resolve was called");
    });

    QUnit.module("Data loss navigation handler - helper functions: The function _waitForHash", {
        beforeEach: async function () {
            this.oSetDirtyFlagStub = sandbox.stub(Container, "setDirtyFlag");

            // Instantiate the shell controller with a minimal capability
            this.oController = await Controller.create({ name: "sap.ushell.renderer.Shell" });

            this.oConfirmStub = sandbox.stub(window, "confirm");

            this.oGetTextStub = sandbox.stub(resources.i18n, "getText");
            this.oPostMessageStub = sandbox.stub(PostMessageUtils, "postMessageToMultipleIframes");

            this.oAddEventListenerSpy = sandbox.spy(window, "addEventListener");
            this.oRemoveEventListenerSpy = sandbox.spy(window, "removeEventListener");

            sandbox.stub(this.oController, "_windowHistoryBack");
            sandbox.stub(this.oController, "_windowHistoryForward");
        },
        afterEach: function () {
            window.location.hash = "";
            sandbox.restore();
            this.oController.onExit(); // Only called automatically when connected to a view
            this.oController.destroy();
            StateManager.resetAll();
        }
    });

    QUnit.test("Attaches an event listener to the browser's hashchange event", function (assert) {
        // Arrange
        // Act
        const oPromise = this.oController._waitForHash("what-else-happens");

        window.location.hash = "what-else-happens";

        return oPromise.finally(() => {
            // Assert
            assert.strictEqual(this.oAddEventListenerSpy.callCount, 1, "addEventListener has been called once.");
            assert.strictEqual(this.oAddEventListenerSpy.firstCall.args[0], "hashchange", "addEventListener has been called with the correct parameter.");
            assert.strictEqual(typeof this.oAddEventListenerSpy.firstCall.args[1], "function", "addEventListener has been called with the correct second parameter type.");
        });
    });

    QUnit.test("Returns a promise that is resolved when the browser's hashchange event is triggered and the hash has changed", function (assert) {
        // Arrange
        window.location.hash = "what-happens";
        const oPromise = this.oController._waitForHash("what-else-happens");

        // Act
        window.location.hash = "what-else-happens";

        // Assert
        return oPromise.then(() => {
            assert.ok(true, "The promise has been resolved.");
            assert.strictEqual(this.oRemoveEventListenerSpy.callCount, 1, "removeEventListener was called once");
        });
    });

    QUnit.test("Handles the location hash's encoding correctly", function (assert) {
        // Arrange
        window.location.hash = "what-happens";
        const oPromise = this.oController._waitForHash("what-else-happens&is=amazing%");

        // Act
        window.location.hash = encodeURIComponent("what-else-happens&is=amazing%");

        // Assert
        return oPromise.then(() => {
            // Due to the check in_waitForHAsh, this can only be resolved if the URI
            // is correctly decoded.
            assert.ok(true, "The promise has been resolved.");
            assert.strictEqual(this.oRemoveEventListenerSpy.callCount, 1, "removeEventListener was called once");
        });
    });

    QUnit.module("Data loss navigation handler - helper functions: The function _getRestoreHashStrategy", {
        beforeEach: async function () {
            this.oGetHistoryStateOffsetStub = sandbox.stub();
            const oInstance = {
                getHistoryStateOffset: this.oGetHistoryStateOffsetStub
            };
            this.oGetInstanceStub = sandbox.stub(Ui5History, "getInstance").returns(oInstance);

            this.oController = await Controller.create({ name: "sap.ushell.renderer.Shell" });
            sandbox.stub(this.oController, "_windowHistoryBack");
            sandbox.stub(this.oController, "_windowHistoryForward");
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.onExit(); // Only called automatically when connected to a view
            this.oController.destroy();
            StateManager.resetAll();
        }
    });

    QUnit.test("Returns replaceHash with a step count of zero if a previous hash change was also done via replaceHash", function (assert) {
        // Arrange
        // Act
        const oResult = this.oController._getRestoreHashStrategy(true);

        // Assert
        assert.deepEqual(oResult, {
            strategy: "replaceHash",
            stepCount: 0
        }, "The correct object structure has been returned.");
    });

    QUnit.test("Yields the step count of 1 if the history state offset is undefined", function (assert) {
        // Arrange
        // Act
        const oResult = this.oController._getRestoreHashStrategy();

        // Assert
        assert.strictEqual(oResult.stepCount, 1, "The correct value has been returned.");
    });

    QUnit.test("Yields a positive step count if the history state offset is negative", function (assert) {
        // Arrange
        this.oGetHistoryStateOffsetStub.returns(-1000);

        // Act
        const oResult = this.oController._getRestoreHashStrategy();

        // Assert
        assert.strictEqual(oResult.stepCount, 1, "The correct value has been returned.");
    });

    QUnit.test("Yields a positive step count if the history state offset is positive", function (assert) {
        // Arrange
        this.oGetHistoryStateOffsetStub.returns(1000);

        // Act
        const oResult = this.oController._getRestoreHashStrategy();

        // Assert
        assert.strictEqual(oResult.stepCount, 1, "The correct value has been returned.");
    });

    QUnit.test("For undo, saves the last selected strategy", function (assert) {
        // Arrange
        // Act
        this.oController._getRestoreHashStrategy(false, "undo");

        // Assert
        assert.strictEqual(this.oController.sLastUndoStrategy, "historyBack", "The correct value has been returned.");
    });

    QUnit.test("For undo, uses historyForward as the inverse of the historyBack strategy", function (assert) {
        // Arrange
        this.oGetHistoryStateOffsetStub.returns(-1);

        // Act
        const oResult = this.oController._getRestoreHashStrategy(false, "undo");

        // Assert
        assert.strictEqual(oResult.strategy, "historyForward", "The correct value has been returned.");
    });

    QUnit.test("For undo, uses historyBack as the inverse of the historyForward strategy", function (assert) {
        // Arrange
        this.oGetHistoryStateOffsetStub.returns(1);

        // Act
        const oResult = this.oController._getRestoreHashStrategy(false, "undo");

        // Assert
        assert.strictEqual(oResult.strategy, "historyBack", "The correct value has been returned.");
    });

    QUnit.test("For redo, uses historyForward as the inverse of the historyBack strategy", function (assert) {
        // Arrange
        this.oController.sLastUndoStrategy = "historyBack";

        // Act
        const oResult = this.oController._getRestoreHashStrategy(false, "redo");

        // Assert
        assert.strictEqual(oResult.strategy, "historyForward", "The correct value has been returned.");
    });

    QUnit.test("For redo, uses historyBack as the inverse of the historyForward strategy", function (assert) {
        // Arrange
        this.oController.sLastUndoStrategy = "historyForward";

        // Act
        const oResult = this.oController._getRestoreHashStrategy(false, "redo");

        // Assert
        assert.strictEqual(oResult.strategy, "historyBack", "The correct value has been returned.");
    });

    QUnit.test("For redo, uses replaceHash if no undo-operation preceded it", function (assert) {
        // Arrange
        this.oController.sLastUndoStrategy = undefined;

        // Act
        const oResult = this.oController._getRestoreHashStrategy(false, "redo");

        // Assert
        assert.strictEqual(oResult.strategy, "replaceHash", "The correct value has been returned.");
    });

    QUnit.test("For redo, yields a step count of 1 if the history state offset is zero", function (assert) {
        // Arrange
        this.oGetHistoryStateOffsetStub.returns(0);

        // Act
        const oResult = this.oController._getRestoreHashStrategy(false, "redo");

        // Assert
        assert.strictEqual(oResult.stepCount, 1, "The correct value has been returned.");
    });

    QUnit.module("Data loss navigation handler - helper functions: The function _restoreHash", {
        beforeEach: async function () {
            this.sCustomStatus = "KASTEM";

            this.oController = await Controller.create({ name: "sap.ushell.renderer.Shell" });
            this.oController.oShellNavigationInternal = {
                NavigationFilterStatus: {
                    Custom: this.sCustomStatus
                }
            };

            this.oWindowHistoryBackStub = sandbox.stub(this.oController, "_windowHistoryBack");
            this.oWindowHistoryForwardStub = sandbox.stub(this.oController, "_windowHistoryForward");
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.onExit(); // Only called automatically when connected to a view
            this.oController.destroy();
            StateManager.resetAll();
        }
    });

    QUnit.test("Returns a custom navigation filter result for historyBack", function (assert) {
        // Arrange
        const oRestoreStrategy = {
            strategy: "historyBack",
            stepCount: 69
        };

        // Act
        const oResult = this.oController._restoreHash(oRestoreStrategy, "test");

        // Assert
        assert.deepEqual(oResult, {
            status: this.sCustomStatus,
            hash: ""
        }, "The correct object structure has been returned.");
    });

    QUnit.test("Throws an exception if the restore-strategy cannot be found", function (assert) {
        // Arrange
        const oRestoreStrategy = {
            strategy: "justGetMeThere"
        };

        // Act
        try {
            this.oController._restoreHash(oRestoreStrategy, "test");
        } catch (e) {
            // Assert
            assert.ok(true, "An error was thrown");
            assert.strictEqual(e.message, "Cannot execute unknown navigation strategy", "Correct error was thrown");
        }
    });

    QUnit.test("Sets the bEnableHashChange flag to false for historyBack", function (assert) {
        // Arrange
        const oRestoreStrategy = {
            strategy: "historyBack"
        };

        // Act
        this.oController._restoreHash(oRestoreStrategy, "leAsh");

        // Assert
        assert.strictEqual(this.oController.bEnableHashChange, false, "bEnableHashChange was correctly set");
    });

    QUnit.test("Sets the bEnableHashChange flag to false for historyForward", function (assert) {
        // Arrange
        const oRestoreStrategy = {
            strategy: "historyForward"
        };

        // Act
        this.oController._restoreHash(oRestoreStrategy, "leAsh");

        // Assert
        assert.strictEqual(this.oController.bEnableHashChange, false, "bEnableHashChange was correctly set");
    });

    QUnit.test("Changes the bEnableHashChange flag for replaceHash", function (assert) {
        // Arrange
        const oRestoreStrategy = {
            strategy: "replaceHash"
        };

        // Act
        this.oController._restoreHash(oRestoreStrategy, "leAsh");

        // Assert
        assert.strictEqual(this.oController.bEnableHashChange, false, "bEnableHashChange was correctly set");
    });

    QUnit.test("Executes a backward navigation for historyBack", function (assert) {
        // Arrange
        const oRestoreStrategy = {
            strategy: "historyBack",
            stepCount: 69
        };
        const oExpectedReturnObject = {
            status: this.sCustomStatus,
            hash: ""
        };

        // Act
        const oResult = this.oController._restoreHash(oRestoreStrategy, "leAsh");

        // Assert
        assert.ok(this.oWindowHistoryBackStub.calledOnce, "windowHistoryBack was called");
        assert.ok(this.oWindowHistoryBackStub.calledWith(oRestoreStrategy.stepCount), "windowHistoryBack was with the correct arguments");
        assert.deepEqual(oResult, oExpectedReturnObject, "The correct navigation filter was returned");
    });

    QUnit.test("Executes a forward navigation for historyForward", function (assert) {
        // Arrange
        const oRestoreStrategy = {
            strategy: "historyForward",
            stepCount: 69
        };
        const oExpectedReturnObject = {
            status: this.sCustomStatus,
            hash: ""
        };

        // Act
        const oResult = this.oController._restoreHash(oRestoreStrategy, "leAsh");

        // Assert
        assert.ok(this.oWindowHistoryForwardStub.calledOnce, "windowHistoryForward was called");
        assert.ok(this.oWindowHistoryForwardStub.calledWith(oRestoreStrategy.stepCount), "windowHistoryForward was with the correct arguments");
        assert.deepEqual(oResult, oExpectedReturnObject, "The correct navigation filter was returned");
    });

    QUnit.test("Does navigate for replaceHash", function (assert) {
        // Arrange
        const oHasherSpy = sandbox.spy(window.hasher, "replaceHash");
        const oRestoreStrategy = {
            strategy: "replaceHash",
            stepCount: 0
        };

        // Act
        this.oController._restoreHash(oRestoreStrategy, "leAsh");

        // Assert
        assert.strictEqual(this.oWindowHistoryForwardStub.callCount, 0, "No forward navigation");
        assert.strictEqual(this.oWindowHistoryBackStub.callCount, 0, "No backward navigation");
        assert.strictEqual(oHasherSpy.callCount, 1, "Hash was replaced once");

        // Cleanup
        oHasherSpy.restore();
    });

    QUnit.test("Returns a custom navigation filter result for replaceHash", function (assert) {
        // Arrange
        const oRestoreStrategy = {
            strategy: "replaceHash",
            stepCount: 0
        };
        const oExpectedReturnObject = {
            status: this.sCustomStatus,
            hash: ""
        };

        // Act
        const oResult = this.oController._restoreHash(oRestoreStrategy, "leAsh");

        // Assert
        assert.deepEqual(oResult, oExpectedReturnObject, "The correct navigation filter was returned");
    });

    // SCENARIO TESTS FOR _handleDataLoss
    QUnit.module("Scenario tests for data loss navigation handler", {
        beforeEach: async function () {
            this.sCustomStatus = "I want it myyyyyy waaay";
            this.sContinueStatus = "Do the continue";

            this.oIsAsyncDirtyStateProviderSetStub = sandbox.stub(Container, "isAsyncDirtyStateProviderSet").returns(false);
            this.oGetDirtyFlagsAsyncStub = sandbox.stub(Container, "getDirtyFlagsAsync").resolves(true);
            this.oGetDirtyFlagStub = sandbox.stub(Container, "getDirtyFlag").returns(true);
            this.oSetDirtyFlagStub = sandbox.stub(Container, "setDirtyFlag").returns(true);

            this.oGetRendererStub = sandbox.stub(Container, "getRendererInternal");
            this.oIsBuiltInIntentStub = sandbox.stub().returns(false);
            this.oGetRendererStub.returns({
                _isBuiltInIntent: this.oIsBuiltInIntentStub
            });

            // We do not stub URLParsing, as this is already thoroughly tested and we indirectly test a minimal integration.
            this.oParseShellHashSpy = sandbox.spy(UrlParsing, "parseShellHash");

            sandbox.stub(Container, "getServiceAsync");
            Container.getServiceAsync.rejects("Service Mock not implemented!");

            this.oResolvedHashFragmentDeferred = new Deferred();
            this.oResolveHashFragmentStub = sandbox.stub().returns(this.oResolvedHashFragmentDeferred.promise);
            Container.getServiceAsync.withArgs("NavTargetResolutionInternal").resolves({
                resolveHashFragment: this.oResolveHashFragmentStub
            });

            // Instantiate the shell controller with a minimal capability
            this.oController = await Controller.create({ name: "sap.ushell.renderer.Shell" });
            this.oController.bEnableHashChange = true;

            // Stubs for our tests
            this.oController.oShellNavigationInternal = {
                NavigationFilterStatus: {
                    Continue: this.sContinueStatus,
                    Custom: this.sCustomStatus
                },
                hashChanger: {
                    treatHashChanged: sandbox.stub(),
                    getReloadApplication: sandbox.stub(),
                    setReloadApplication: sandbox.stub(),
                    destroy: sandbox.stub()
                },
                wasHistoryEntryReplaced: sandbox.stub()
            };

            this.oHashChangePromise = Promise.resolve();
            this.oWaitForHashStub = sandbox.stub(this.oController, "_waitForHash").returns(this.oHashChangePromise);

            this.oRestoreHashUsingActionSpy = sandbox.spy(this.oController, "_restoreHashUsingAction");
            this.oGetRestoreHashStrategy = sandbox.stub(this.oController, "_getRestoreHashStrategy").returns({
                strategy: "replaceHash",
                stepCount: 0
            });

            this.oResumeAppRouterStub = sandbox.stub(this.oController, "_resumeAppRouterIgnoringCurrentHash");
            this.oWindowHistoryBackStub = sandbox.stub(this.oController, "_windowHistoryBack");
            this.oWindowHistoryForwardStub = sandbox.stub(this.oController, "_windowHistoryForward");

            this.oAppLifeCyclePostMessageStub = sandbox.stub(PostMessageUtils, "postMessageToMultipleIframes").returns(true);
            this.oConfirmStub = sandbox.stub(this.oController, "_handleDirtyStateUserConfirm").returns(true);

            this.oGetHistoryStateOffsetStub = sandbox.stub().returns(0);
            const oInstance = {
                getHistoryStateOffset: this.oGetHistoryStateOffsetStub
            };
            this.oGetInstanceStub = sandbox.stub(Ui5History, "getInstance").returns(oInstance);
        },
        afterEach: async function () {
            // reject in case the promise what not resolved/rejected in test case.
            this.oResolvedHashFragmentDeferred.reject();
            if (this.oController._oLastDataLossPromise) {
                await this.oController._oLastDataLossPromise;
            }

            sandbox.restore();
            this.oController.onExit(); // Only called automatically when connected to a view
            this.oController.destroy();
            StateManager.resetAll();
        }
    });

    QUnit.test("Returns Continue navigation state if current intent is \"\"", function (assert) {
        // Act
        const sResult = this.oController.handleDataLoss("something-fancy", "");

        // Assert
        assert.strictEqual(sResult, this.sContinueStatus, "The correct value has been found.");
    });

    QUnit.test("Applies the reloadApplication flag if set to 'true'", function (assert) {
        // Arrange
        const oShellNavigationHashChanger = this.oController.oShellNavigationInternal.hashChanger;
        this.oController.bReloadApplication = true;

        // Act
        this.oController.handleDataLoss("something-fancy", "");

        // Assert
        assert.ok(oShellNavigationHashChanger.setReloadApplication.calledWith(true), "the reloadApplication flag was applied to the ShellNavigationHashChanger");
        assert.strictEqual(this.oController.bReloadApplication, null, "the reloadApplication flag was invalidated");
    });

    QUnit.test("Applies the reloadApplication flag if set to 'false'", function (assert) {
        // Act
        const oShellNavigationHashChanger = this.oController.oShellNavigationInternal.hashChanger;
        this.oController.bReloadApplication = false;

        // Act
        this.oController.handleDataLoss("something-fancy", "");

        // Assert
        assert.ok(oShellNavigationHashChanger.setReloadApplication.calledWith(false), "the reloadApplication flag was applied to the ShellNavigationHashChanger");
        assert.strictEqual(this.oController.bReloadApplication, null, "the reloadApplication flag was invalidated");
    });

    QUnit.test("Ignores the reloadApplication flag if set to 'null'", function (assert) {
        // Act
        const oShellNavigationHashChanger = this.oController.oShellNavigationInternal.hashChanger;
        this.oController.bReloadApplication = null;

        // Act
        this.oController.handleDataLoss("something-fancy", "");

        // Assert
        assert.ok(oShellNavigationHashChanger.setReloadApplication.notCalled, "setReloadApplication was not called");
    });

    QUnit.test("Returns Continue navigation state if bRestorePreviousHash is set to true", function (assert) {
        // Arrange
        this.oController.bRestorePreviousHash = true;

        // Act
        const sResult = this.oController.handleDataLoss("something-fancy", "something-outdated");

        // Assert
        assert.strictEqual(sResult, this.sContinueStatus, "The correct value has been found.");
    });

    QUnit.test("Returns Continue navigation state if ex-place navigation is forced via the sap-ushell-navmode parameter for a non-built-in target", function (assert) {
        // Arrange
        this.oIsBuiltInIntentStub.returns(false);

        // Act
        const sResult = this.oController.handleDataLoss("something-fancy?sap-ushell-navmode=explace", "something-outdated");

        // Assert
        assert.strictEqual(sResult, this.sContinueStatus, "The correct value has been found.");
        assert.strictEqual(this.oParseShellHashSpy.callCount, 1, "Hash parser was called.");
        assert.ok(this.oWaitForHashStub.notCalled, "The async process was not started - waitForHash");
        assert.ok(Container.getServiceAsync.notCalled, "The async process was not started - getServiceAsync");
        assert.strictEqual(this.oController.bExplaceNavigation, false, "Ex-place navigation flag is not true");
    });

    QUnit.test("Returns Continue navigation state if frameless navigation is forced via the sap-ushell-navmode parameter for a non-built-in target", function (assert) {
        // Arrange
        this.oIsBuiltInIntentStub.returns(false);

        // Act
        const sResult = this.oController.handleDataLoss("something-fancy?sap-ushell-navmode=frameless", "something-outdated");

        // Assert
        assert.strictEqual(sResult, this.sContinueStatus, "The correct value has been found.");
        assert.strictEqual(this.oParseShellHashSpy.callCount, 1, "Hash parser was called.");
        assert.ok(this.oWaitForHashStub.notCalled, "The async process was not started - waitForHash");
        assert.ok(Container.getServiceAsync.notCalled, "The async process was not started - getServiceAsync");
        assert.strictEqual(this.oController.bExplaceNavigation, false, "Ex-place navigation flag is not true");
    });

    QUnit.test("Returns Continue navigation state if dirty state is false", function (assert) {
        // Arrange
        this.oGetDirtyFlagsAsyncStub.resolves(false);
        this.oGetDirtyFlagStub.returns(false);

        // Act
        const sResult = this.oController.handleDataLoss("something-fancy", "something-outdated");

        // Assert
        assert.deepEqual(sResult, this.sContinueStatus, "The correct value has been found.");
        assert.notOk(this.oController.bExplaceNavigation, "The correct value has been found.");
    });

    QUnit.test("Returns Continue navigation state and enables hash change if the navigation is to be redone", function (assert) {
        // Arrange
        this.oController.bEnableHashChange = true;
        this.oController.bRedoNavigation = true;

        // Act
        const sResult = this.oController.handleDataLoss("something-fancy", "something-outdated");

        // Assert
        assert.strictEqual(sResult, this.sContinueStatus, "The correct value has been found.");
        assert.strictEqual(this.oController.bEnableHashChange, true, "The correct value has been found.");
        assert.strictEqual(this.oController.bRedoNavigation, false, "The correct value has been found.");
        assert.strictEqual(this.oController.bExplaceNavigation, false, "The correct value has been found.");
    });

    // BCP 2180057557
    QUnit.test("Resets the explace navigation flag if the navigation is to be redone", function (assert) {
        // Arrange
        this.oController.bEnableHashChange = true;
        this.oController.bRedoNavigation = true;

        // Act
        this.oController.handleDataLoss("something-fancy", "something-outdated");

        // Assert
        assert.strictEqual(this.oController.bExplaceNavigation, false, "The correct value has been found.");
    });

    QUnit.test("Returns Custom navigation state and enables hash change if the hash change was disabled and the navigation was not redone", function (assert) {
        // Arrange
        this.oController.bEnableHashChange = false;
        this.oController.bRedoNavigation = false;

        // Act
        const sResult = this.oController.handleDataLoss("something-fancy", "something-outdated");

        // Assert
        assert.deepEqual(sResult, this.sCustomStatus, "The correct value has been found.");
        assert.strictEqual(this.oController.bEnableHashChange, true, "The correct value has been found.");
    });

    QUnit.test("Returns custom navigation result if in dirty state", function (assert) {
        // Act
        // NOTICE: Not ex-place!
        const oResult = this.oController.handleDataLoss("something-fancy", "something-outdated");

        // Assert
        const oExpectedResult = {
            status: this.sCustomStatus,
            hash: ""
        };

        assert.strictEqual(this.oRestoreHashUsingActionSpy.callCount, 1, "_undoNavigation was called once.");
        assert.ok(this.oRestoreHashUsingActionSpy.calledWith("something-outdated", "undo"), "Navigation was undone");
        assert.deepEqual(oResult, oExpectedResult, "The correct value has been found.");
        assert.strictEqual(this.oConfirmStub.callCount, 0, "The user is not asked for input.");
        assert.notOk(this.oController.bExplaceNavigation, "Ex-place navigation flag is not true");
    });

    QUnit.test("Prepends the hash for target resolution with a hash sign", function (assert) {
        // Arrange
        this.oResolvedHashFragmentDeferred.resolve({
            navigationMode: "newWindowThenEmbedded",
            targetNavigationMode: "explace"
        });

        // Act
        const oResult = this.oController.handleDataLoss("something-fancy", "something-outdated");

        // Assert
        const oExpectedResult = {
            status: this.sCustomStatus,
            hash: ""
        };

        assert.strictEqual(this.oRestoreHashUsingActionSpy.withArgs("something-fancy", "redo").callCount, 0, "The function _redoNavigation was not yet called.");
        assert.strictEqual(this.oRestoreHashUsingActionSpy.withArgs("something-outdated", "undo").callCount, 1, "The function _undoNavigation was called.");
        assert.deepEqual(oResult, oExpectedResult, "The correct value has been found.");

        return Promise.all([this.oHashChangePromise, this.oServicePromise]).then(() => {
            assert.ok(this.oResolveHashFragmentStub.called, "Hash resolver was called.");
            assert.ok(this.oResolveHashFragmentStub.calledWith("#something-fancy"), "Hash resolver was called with the correct hash.");
        });
    });

    QUnit.test("Does not resolve a built-in hash", async function (assert) {
        // Arrange
        this.oIsBuiltInIntentStub.returns(true);
        this.oResolvedHashFragmentDeferred.resolve({
            navigationMode: "newWindowThenEmbedded",
            targetNavigationMode: "explace"
        });

        // Act
        const oResult = this.oController.handleDataLoss("something-fancy", "something-outdated");

        // Assert
        const oExpectedResult = {
            status: this.sCustomStatus,
            hash: ""
        };

        assert.strictEqual(this.oRestoreHashUsingActionSpy.withArgs("something-fancy", "redo").callCount, 0, "The function _redoNavigation was not yet called.");
        assert.strictEqual(this.oRestoreHashUsingActionSpy.withArgs("something-outdated", "undo").callCount, 1, "The function _undoNavigation was called.");
        assert.deepEqual(oResult, oExpectedResult, "The correct value has been found.");

        await this.oController._oLastDataLossPromise;

        assert.strictEqual(this.oResolveHashFragmentStub.callCount, 0, "Hash resolver was not called.");
    });

    QUnit.test("Checks if the target intent is a built-in intent", async function (assert) {
        // Act
        const oResult = this.oController.handleDataLoss("something-fancy", "something-outdated");

        // Assert
        const oExpectedResult = {
            status: this.sCustomStatus,
            hash: ""
        };

        assert.strictEqual(this.oRestoreHashUsingActionSpy.withArgs("something-fancy", "redo").callCount, 0, "The function _redoNavigation was not yet called.");
        assert.strictEqual(this.oRestoreHashUsingActionSpy.withArgs("something-outdated", "undo").callCount, 1, "The function _undoNavigation was called.");
        assert.deepEqual(oResult, oExpectedResult, "The correct value has been found.");

        assert.strictEqual(this.oIsBuiltInIntentStub.callCount, 1, "_isBuiltInIntent was called once.");
        assert.deepEqual(this.oIsBuiltInIntentStub.firstCall.args, [{
            action: "fancy",
            appSpecificRoute: undefined,
            contextRaw: undefined,
            params: {},
            semanticObject: "something"
        }], "_isBuiltInIntent was called with the correct parameter.");
    });

    QUnit.test("Asynchronously redoes navigation if the hash cannot be resolved to an intent", async function (assert) {
        // Arrange
        this.oIsBuiltInIntentStub.returns(false);
        this.oResolvedHashFragmentDeferred.reject();

        // Act
        const oResult = this.oController.handleDataLoss("something-fancy", "something-outdated");

        // Assert
        const oExpectedResult = {
            status: this.sCustomStatus,
            hash: ""
        };

        assert.strictEqual(this.oRestoreHashUsingActionSpy.withArgs("something-fancy", "redo").callCount, 0, "The function _redoNavigation was not yet called.");
        assert.strictEqual(this.oRestoreHashUsingActionSpy.withArgs("something-outdated", "undo").callCount, 1, "The function _undoNavigation was called.");
        assert.deepEqual(oResult, oExpectedResult, "The correct value has been found.");

        await this.oController._oLastDataLossPromise;

        assert.strictEqual(this.oRestoreHashUsingActionSpy.withArgs("something-fancy", "redo").callCount, 1, "The function _redoNavigation has been called once.");
        assert.notOk(this.oController.bExplaceNavigation, "The correct value has been found.");
        assert.strictEqual(this.oController.bRedoNavigation, true, "The correct value has been found.");
    });

    QUnit.test("Asynchronously redoes navigation for an ex-place target that is not a built-in intent if in dirty state", async function (assert) {
        // Arrange
        this.oIsBuiltInIntentStub.returns(false);
        this.oResolvedHashFragmentDeferred.resolve({
            navigationMode: "newWindowThenEmbedded",
            targetNavigationMode: "explace"
        });

        // Act
        const oResult = this.oController.handleDataLoss("something-fancy", "something-outdated");

        // Assert
        const oExpectedResult = {
            status: this.sCustomStatus,
            hash: ""
        };

        assert.strictEqual(this.oRestoreHashUsingActionSpy.withArgs("something-fancy", "redo").callCount, 0, "The function _redoNavigation was not yet called.");
        assert.strictEqual(this.oRestoreHashUsingActionSpy.withArgs("something-outdated", "undo").callCount, 1, "The function _undoNavigation was called.");
        assert.deepEqual(oResult, oExpectedResult, "The correct value has been found.");

        await this.oController._oLastDataLossPromise;

        assert.strictEqual(this.oRestoreHashUsingActionSpy.withArgs("something-fancy", "redo").callCount, 1, "The function _redoNavigation has been called once.");
        assert.strictEqual(this.oController.bExplaceNavigation, true, "The correct value has been found.");
    });

    QUnit.test("Asynchronously redoes navigation for a frameless target that is not a built-in intent if in dirty state", async function (assert) {
        // Arrange
        this.oIsBuiltInIntentStub.returns(false);
        this.oResolvedHashFragmentDeferred.resolve({
            navigationMode: "newWindow",
            targetNavigationMode: "frameless"
        });

        // Act
        const oResult = this.oController.handleDataLoss("something-fancy", "something-outdated");

        // Assert
        const oExpectedResult = {
            status: this.sCustomStatus,
            hash: ""
        };

        assert.strictEqual(this.oRestoreHashUsingActionSpy.withArgs("something-fancy", "redo").callCount, 0, "The function _redoNavigation was not yet called.");
        assert.strictEqual(this.oRestoreHashUsingActionSpy.withArgs("something-outdated", "undo").callCount, 1, "The function _undoNavigation was called.");
        assert.deepEqual(oResult, oExpectedResult, "The correct value has been found.");

        await this.oController._oLastDataLossPromise;

        assert.strictEqual(this.oRestoreHashUsingActionSpy.withArgs("something-fancy", "redo").callCount, 1, "The function _redoNavigation has been called once.");
        assert.strictEqual(this.oController.bExplaceNavigation, true, "The correct value has been found.");
    });

    QUnit.test("Does not asynchronously redo navigation for an ex-place target if user navigates back and cancels the navigation", async function (assert) {
        // Arrange
        this.oIsBuiltInIntentStub.returns(false);
        this.oResolvedHashFragmentDeferred.resolve({
            navigationMode: "newWindowThenEmbedded",
            targetNavigationMode: "explace"
        });
        this.oConfirmStub.returns(false);
        this.oGetHistoryStateOffsetStub.returns(-1);

        // Act
        const oResult = this.oController.handleDataLoss("something-fancy", "something-outdated");

        // Assert
        const oExpectedResult = {
            status: this.sCustomStatus,
            hash: ""
        };

        assert.strictEqual(this.oRestoreHashUsingActionSpy.withArgs("something-fancy", "redo").callCount, 0, "The function _redoNavigation was not yet called.");
        assert.strictEqual(this.oRestoreHashUsingActionSpy.withArgs("something-outdated", "undo").callCount, 1, "The function _undoNavigation was called.");
        assert.deepEqual(oResult, oExpectedResult, "The correct value has been found.");

        await this.oController._oLastDataLossPromise;

        assert.strictEqual(this.oRestoreHashUsingActionSpy.withArgs("something-fancy", "redo").callCount, 0, "The function _redoNavigation has been called once.");
        assert.strictEqual(this.oController.bExplaceNavigation, undefined, "The correct value has been found.");
    });

    QUnit.test("Does not asynchronously redo navigation if the user cancels the navigation for built-in targets if in dirty state", async function (assert) {
        // Arrange
        this.oIsBuiltInIntentStub.returns(true);
        this.oConfirmStub.returns(false);

        // Act
        const oResult = this.oController.handleDataLoss("something-fancy", "something-outdated");

        // Assert
        const oExpectedResult = {
            status: this.sCustomStatus,
            hash: ""
        };

        assert.strictEqual(this.oRestoreHashUsingActionSpy.withArgs("something-fancy", "redo").callCount, 0, "The function _redoNavigation was not yet called.");
        assert.strictEqual(this.oRestoreHashUsingActionSpy.withArgs("something-outdated", "undo").callCount, 1, "The function _undoNavigation was called.");
        assert.deepEqual(oResult, oExpectedResult, "The correct value has been found.");

        await this.oController._oLastDataLossPromise;

        assert.strictEqual(this.oRestoreHashUsingActionSpy.withArgs("something-fancy", "redo").callCount, 0, "The function _redoNavigation has not been called.");
    });

    QUnit.test("Does not asynchronously redo navigation if the user cancels the navigation for inplace targets if in dirty state", async function (assert) {
        // Arrange
        this.oIsBuiltInIntentStub.returns(false);
        this.oConfirmStub.returns(false);
        this.oResolvedHashFragmentDeferred.resolve({
            navigationMode: "embedded",
            targetNavigationMode: "inplace"
        });

        // Act
        const oResult = this.oController.handleDataLoss("something-fancy", "something-outdated");

        // Assert
        const oExpectedResult = {
            status: this.sCustomStatus,
            hash: ""
        };

        assert.strictEqual(this.oRestoreHashUsingActionSpy.withArgs("something-fancy", "redo").callCount, 0, "The function _redoNavigation was not yet called.");
        assert.strictEqual(this.oRestoreHashUsingActionSpy.withArgs("something-outdated", "undo").callCount, 1, "The function _undoNavigation was called.");
        assert.deepEqual(oResult, oExpectedResult, "The correct value has been found.");

        await this.oController._oLastDataLossPromise;

        assert.strictEqual(this.oRestoreHashUsingActionSpy.withArgs("something-fancy", "redo").callCount, 0, "The function _redoNavigation has not been called.");
    });

    QUnit.test("Asynchronously redoes navigation if the user confirms the navigation for built-in targets if in dirty state", async function (assert) {
        // Arrange
        this.oIsBuiltInIntentStub.returns(true);
        this.oConfirmStub.returns(true);

        // Act
        const oResult = this.oController.handleDataLoss("something-fancy", "something-outdated");

        // Assert
        const oExpectedResult = {
            status: this.sCustomStatus,
            hash: ""
        };

        assert.strictEqual(this.oRestoreHashUsingActionSpy.withArgs("something-fancy", "redo").callCount, 0, "The function _redoNavigation was not yet called.");
        assert.strictEqual(this.oRestoreHashUsingActionSpy.withArgs("something-outdated", "undo").callCount, 1, "The function _undoNavigation was called.");
        assert.deepEqual(oResult, oExpectedResult, "The correct value has been found.");

        await this.oController._oLastDataLossPromise;

        assert.strictEqual(this.oRestoreHashUsingActionSpy.withArgs("something-fancy", "redo").callCount, 1, "The function _redoNavigation has been called once.");
    });

    QUnit.test("Asynchronously redoes navigation if the user confirms the navigation for inplace targets if in dirty state", async function (assert) {
        // Arrange
        const oShellNavigationHashChanger = this.oController.oShellNavigationInternal.hashChanger;
        oShellNavigationHashChanger.getReloadApplication.returns(true);
        this.oResolvedHashFragmentDeferred.resolve({
            navigationMode: "embedded",
            targetNavigationMode: "inplace"
        });
        this.oConfirmStub.returns(true);

        // Act
        const oResult = this.oController.handleDataLoss("something-fancy", "something-outdated");

        // Assert
        const oExpectedResult = {
            status: this.sCustomStatus,
            hash: ""
        };

        assert.strictEqual(this.oRestoreHashUsingActionSpy.withArgs("something-fancy", "redo").callCount, 0, "The function _redoNavigation was not yet called.");
        assert.strictEqual(this.oRestoreHashUsingActionSpy.withArgs("something-outdated", "undo").callCount, 1, "The function _undoNavigation was called.");
        assert.deepEqual(oResult, oExpectedResult, "The correct value has been found.");

        await this.oController._oLastDataLossPromise;

        assert.strictEqual(this.oController.bReloadApplication, true, "internal reloadApplication flag was set correctly");
        assert.strictEqual(this.oRestoreHashUsingActionSpy.withArgs("something-fancy", "redo").callCount, 1, "The function _redoNavigation has been called once.");
    });

    QUnit.test("Asynchronously redoes navigation if app was not in dirtyState and async dirtyState is set", async function (assert) {
        // Arrange
        this.oIsAsyncDirtyStateProviderSetStub.returns(true);
        this.oGetDirtyFlagsAsyncStub.resolves(false);
        this.oGetDirtyFlagStub.returns(false);

        // Act
        const oResult = this.oController.handleDataLoss("something-fancy", "something-outdated");

        // Assert
        const oExpectedResult = {
            status: this.sCustomStatus,
            hash: ""
        };

        assert.strictEqual(this.oRestoreHashUsingActionSpy.withArgs("something-fancy", "redo").callCount, 0, "The function _redoNavigation was not yet called.");
        assert.strictEqual(this.oRestoreHashUsingActionSpy.withArgs("something-outdated", "undo").callCount, 1, "The function _undoNavigation was called.");
        assert.deepEqual(oResult, oExpectedResult, "The correct value has been found.");

        await this.oController._oLastDataLossPromise;

        assert.strictEqual(this.oRestoreHashUsingActionSpy.withArgs("something-fancy", "redo").callCount, 1, "The function _redoNavigation has been called once.");
    });

    QUnit.module("sap.ushell.renderer.Shell (Part 2)", {
        beforeEach: async function (assert) {
            window.location.hash = "";
            window["sap-ushell-config"] = {};
            window["sap-ushell-config"].renderers = { fiori2: { componentData: { config: { rootIntent: "Shell-home" } } } };

            await Container.init("local");
            const PluginManager = await Container.getServiceAsync("PluginManager");

            BusyDialog.prototype.open = sandbox.stub();

            this.oController = await Controller.create({ name: "sap.ushell.renderer.Shell" });

            const oShellModel = Config.createModel("/core/shell/model", JSONModel);

            this.oController.getView = sandbox.stub().returns(createMockedView(oShellModel));
            this.oController.history = History;
            sandbox.stub(this.oController, "_windowHistoryBack");
            sandbox.stub(this.oController, "_windowHistoryForward");

            AppLifeCycleAI.init(this.oController.oViewPortContainer, false);
            this.oController.oStatefulApplicationContainer = {};
            PluginManager.getRegisteredPlugins = function () { return { RendererExtensions: { init: true } }; };

            sandbox.stub(Container, "getServiceAsync");
            Container.getServiceAsync.withArgs("ShellNavigationInternal").resolves({
                toExternal: sandbox.stub()
            });
            Container.getServiceAsync.callThrough();

            ShellUIServiceFactory.attachBackNavigationChanged(this.oController._onBackNavigationChanged, this.oController);
            sandbox.stub(ushellUtils, "isColdStart").returns(true);
        },
        // This method is called after each test. Add every restoration code here.
        afterEach: function () {
            window.location.hash = "";
            this.oController.onExit(); // Only called automatically when connected to a view
            this.oController.destroy();
            sandbox.restore();
            StateManager.resetAll();
        }
    });

    QUnit.test("test ShellUIService back navigation handler", async function (assert) {
        sandbox.stub(EventBus.getInstance(), "publish");
        sandbox.stub(AppLifeCycleAI, "_createApplicationContainer").returns({
            getId: sandbox.stub(),
            getActive: sandbox.stub(),
            setActive: sandbox.stub(),
            getApplicationType: sandbox.stub().returns("URL")
        });

        this.oController.oViewPortContainer = {
            navTo: sandbox.stub(),
            getViewPortControl: sandbox.stub()
        };
        AppLifeCycleAI.init(this.oController.oViewPortContainer, false);

        const fnBackNavigation = sandbox.spy();
        AppLifeCycleAI.getShellUIService().getInterface().setBackNavigation(fnBackNavigation);
        this.oController._navBack();

        assert.strictEqual(fnBackNavigation.callCount, 1, "Custom navigation handler should be called");
    });

    QUnit.test("test ShellUIService changes model on app state", function (assert) {
        const sTitle = "App title";
        const oHierarchy = [{
            icon: "sap-icon://nav-back",
            title: "App1",
            intent: "#App1"
        }];
        const oRelatedApps = [{
            icon: "sap-icon://documents",
            title: "Related App 1",
            intent: "#Action-todefaultapp"
        }];
        const oExpectedHierarchy = [{
            icon: "sap-icon://nav-back",
            title: "App1",
            intent: "#App1"
        }, {
            icon: "sap-icon://home",
            title: "Home",
            intent: "#Shell-home"
        }];

        Config.emit("/core/shellHeader/rootIntent", "Shell-home");

        AppLifeCycleAI.switchViewState("app");

        AppLifeCycleAI.init(undefined, false);
        AppLifeCycleAI.switchViewState("app");

        AppLifeCycleAI.getShellUIService().setHierarchy(oHierarchy);
        AppLifeCycleAI.getShellUIService().setTitle(sTitle);
        AppLifeCycleAI.getShellUIService().setRelatedApps(oRelatedApps);

        const oApplicationOnApp = ShellModel.getModel().getProperty("/application");
        assert.deepEqual(oApplicationOnApp.hierarchy, oExpectedHierarchy, "oHierarchy was updated in the model properly");
        assert.deepEqual(oApplicationOnApp.title, sTitle, "title was updated in the model properly");
        assert.deepEqual(oApplicationOnApp.relatedApps, oRelatedApps, "oRelatedApps was updated in the model properly");

        AppLifeCycleAI.switchViewState("home");
        const oApplicationOnHome = ShellModel.getModel().getProperty("/application");

        assert.strictEqual(oApplicationOnHome.hierarchy.length, 0, "oHierarchy was not updated in the home state model");
        assert.strictEqual(oApplicationOnHome.title, "", "title was not updated in the home state model");
        assert.strictEqual(oApplicationOnHome.relatedApps.length, 0, "oRelatedApps was not updated in the home state model");
    });

    QUnit.test("test ShellUIService changes model on home state", function (assert) {
        const sTitle = "App title";
        const oHierarchy = [{
            icon: "sap-icon://nav-back",
            title: "App1",
            intent: "#App1"
        }];
        const oRelatedApps = [{
            icon: "sap-icon://documents",
            title: "Related App 1",
            intent: "#Action-todefaultapp"
        }];

        AppLifeCycleAI.switchViewState("home");

        AppLifeCycleAI.getShellUIService().setHierarchy(oHierarchy);
        AppLifeCycleAI.getShellUIService().setTitle(sTitle);
        AppLifeCycleAI.getShellUIService().setRelatedApps(oRelatedApps);

        const oApplication = ShellModel.getModel().getProperty("/application");
        assert.deepEqual(oApplication.hierarchy, oHierarchy, "oHierarchy was updated in the model properly");
        assert.deepEqual(oApplication.title, sTitle, "title was updated in the model properly");
        assert.deepEqual(oApplication.relatedApps, oRelatedApps, "oRelatedApps was updated in the model properly");
    });

    /**
     * Test the trampolin app decision function.
     */
    [
        { description: "noComponent", noComponent: true, expectedResult: false },
        { description: "noFunction", noFunction: true, expectedResult: false },
        { description: "returns promise, resolves", promise: true, resolve: "#Abc-def", expectedResult: true },
        { description: "returns promise, rejects", promise: true, expectedResult: false },
        { description: "returns undefined", promise: false, expectedResult: false }
    ].forEach((oFixture) => {
        QUnit.test(`_usesNavigationRedirect decision with nav redirect ${oFixture.description}`, function (assert) {
            const done = assert.async();
            let oNavResResult;
            const oComponent = { destroy: sandbox.spy() };
            if (oFixture.promise) {
                oNavResResult = new jQuery.Deferred();
            }
            if (!oFixture.noFunction) {
                oComponent.navigationRedirect = sandbox.stub().returns(oNavResResult);
            }
            const oHandle = {
                getInstance: function () {
                    return oFixture.noComponent ? undefined : oComponent;
                }
            };
            sandbox.spy(this.oController.history, "pop");

            // Act
            this.oController._usesNavigationRedirect(oHandle).then((bResult) => {
                // Assert
                assert.strictEqual(bResult, oFixture.expectedResult, "promise ok");

                if (oFixture.expectedResult) {
                    assert.strictEqual(oComponent.destroy.called, true, "component was destroyed");
                    assert.strictEqual(this.oController.history.pop.callCount, 1, "history pop was called once");
                }
                done();
            });

            if (oFixture.promise) {
                if (oFixture.resolve) {
                    oNavResResult.resolve(oFixture.resolve);
                } else {
                    oNavResResult.reject();
                }
            }
            assert.ok(true, "got to end");
        });
    });

    QUnit.module("sap.ushell.renderer.Shell.controller onAppOpened", {
        beforeEach: async function (assert) {
            this.sAppHash = "testAppHash";
            this.oResolvedHashFragment = {};

            sandbox.stub(Container, "getServiceAsync");
            Container.getServiceAsync.rejects("Service Mock not implemented!");

            this.oConfigLastStub = sandbox.stub(Config, "last");

            this.oSetVisibleStub = sandbox.stub();
            this.oGetComponentInstanceStub = sandbox.stub().returns({
                setVisible: this.oSetVisibleStub
            });

            this.oByIdStub = sandbox.stub(Element, "getElementById").returns({
                getComponentInstance: this.oGetComponentInstanceStub
            });

            this.oController = await Controller.create({ name: "sap.ushell.renderer.Shell" });
            this.getAppHashStub = sandbox.stub();
            this.oController.oShellNavigationInternal = {
                hashChanger: {
                    getAppHash: this.getAppHashStub,
                    destroy: sandbox.stub()
                }
            };
            this.oLogOpenAppActionStub = sandbox.stub(this.oController, "logOpenAppAction").resolves();
            this.oNotifyUITracerStub = sandbox.stub(this.oController, "_notifyUITracer");

            sandbox.stub(this.oController, "_windowHistoryBack");
            sandbox.stub(this.oController, "_windowHistoryForward");
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.onExit(); // Only called automatically when connected to a view
            this.oController.destroy();
            StateManager.resetAll();
        }
    });

    QUnit.test("Creates a correct sAppPart if getAppHash returns non-empty string", function (assert) {
        // Arrange
        this.getAppHashStub.returns("#test");

        // Act
        this.oController.onAppOpened("sChannelIdTest", "sEventIdTest", this.oResolvedHashFragment);

        assert.strictEqual(this.oLogOpenAppActionStub.callCount, 1, "The function logOpenAppAction has been called once.");
        assert.strictEqual(this.oLogOpenAppActionStub.firstCall.args[0], this.oResolvedHashFragment, "The function logOpenAppAction has been called with the correct first parameter.");
        assert.strictEqual(this.oLogOpenAppActionStub.firstCall.args[1], "&/#test", "The function logOpenAppAction has been called with the correct second parameter.");
    });

    QUnit.test("creates correct sAppPart if getAppHash returns empty string", function (assert) {
        // Arrange
        this.getAppHashStub.returns("");

        // Act
        this.oController.onAppOpened("sChannelIdTest", "sEventIdTest", this.oResolvedHashFragment);

        // Assert
        assert.strictEqual(this.oLogOpenAppActionStub.callCount, 1, "The function logOpenAppAction has been called once.");
        assert.strictEqual(this.oLogOpenAppActionStub.firstCall.args[0], this.oResolvedHashFragment, "The function logOpenAppAction has been called with the correct first parameter.");
        assert.strictEqual(this.oLogOpenAppActionStub.firstCall.args[1], null, "The function logOpenAppAction has been called with the correct second parameter.");
    });

    QUnit.test("creates correct sAppPart if getAppHash returns null", function (assert) {
        // Arrange
        this.getAppHashStub.returns(null);

        // Act
        this.oController.onAppOpened("sChannelIdTest", "sEventIdTest", this.oResolvedHashFragment);

        // Assert
        assert.strictEqual(this.oLogOpenAppActionStub.callCount, 1, "The function logOpenAppAction has been called once.");
        assert.strictEqual(this.oLogOpenAppActionStub.firstCall.args[0], this.oResolvedHashFragment, "The function logOpenAppAction has been called with the correct first parameter.");
        assert.strictEqual(this.oLogOpenAppActionStub.firstCall.args[1], null, "The function logOpenAppAction has been called with the correct second parameter.");
    });

    QUnit.test("Hides the navigationBar shellArea", function (assert) {
        // Arrange
        const oNavigationBarShellArea = document.createElement("div");
        oNavigationBarShellArea.setAttribute("id", ShellArea.NavigationBar);
        document.getElementById("qunit-fixture").appendChild(oNavigationBarShellArea);

        this.getAppHashStub.returns(null);

        // Act
        this.oController.onAppOpened("sChannelIdTest", "sEventIdTest", this.oResolvedHashFragment);

        // Assert
        assert.strictEqual(oNavigationBarShellArea.classList.contains("sapUshellShellHidden"), true, "NavigationBar was hidden");
    });

    QUnit.test("Keeps the navigationBar shellArea for /core/menu/visibleInAllStates=true", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/menu/visibleInAllStates").returns(true);
        this.oConfigLastStub.withArgs("/core/menu/enabled").returns(true);

        const oNavigationBarShellArea = document.createElement("div");
        oNavigationBarShellArea.setAttribute("id", ShellArea.NavigationBar);
        document.getElementById("qunit-fixture").appendChild(oNavigationBarShellArea);

        this.getAppHashStub.returns(null);
        this.oResolvedHashFragment.targetNavigationMode = "explace";

        // Act
        this.oController.onAppOpened("sChannelIdTest", "sEventIdTest", this.oResolvedHashFragment);

        // Assert
        assert.strictEqual(oNavigationBarShellArea.classList.contains("sapUshellShellHidden"), false, "NavigationBar is still visible");
    });

    QUnit.test("Keeps the navigationBar shellArea on explace navigation", function (assert) {
        // Arrange
        const oNavigationBarShellArea = document.createElement("div");
        oNavigationBarShellArea.setAttribute("id", ShellArea.NavigationBar);
        document.getElementById("qunit-fixture").appendChild(oNavigationBarShellArea);

        this.getAppHashStub.returns(null);
        this.oResolvedHashFragment.targetNavigationMode = "explace";

        // Act
        this.oController.onAppOpened("sChannelIdTest", "sEventIdTest", this.oResolvedHashFragment);

        // Assert
        assert.strictEqual(oNavigationBarShellArea.classList.contains("sapUshellShellHidden"), false, "NavigationBar is still visible");
    });

    QUnit.test("Keeps the navigationBar shellArea on frameless navigation", function (assert) {
        // Arrange
        const oNavigationBarShellArea = document.createElement("div");
        oNavigationBarShellArea.setAttribute("id", ShellArea.NavigationBar);
        document.getElementById("qunit-fixture").appendChild(oNavigationBarShellArea);

        this.getAppHashStub.returns(null);
        this.oResolvedHashFragment.targetNavigationMode = "frameless";

        // Act
        this.oController.onAppOpened("sChannelIdTest", "sEventIdTest", this.oResolvedHashFragment);

        // Assert
        assert.strictEqual(oNavigationBarShellArea.classList.contains("sapUshellShellHidden"), false, "NavigationBar is still visible");
    });

    QUnit.test("Calls _notifyUITracer with correct arguments", function (assert) {
        // Arrange
        this.getAppHashStub.returns("#test");

        // Act
        this.oController.onAppOpened("sChannelIdTest", "sEventIdTest", this.oResolvedHashFragment);

        // Assert
        assert.strictEqual(this.oNotifyUITracerStub.callCount, 1, "The function _notifyUITracer has been called once.");
        assert.deepEqual(this.oNotifyUITracerStub.firstCall.args[0], this.oResolvedHashFragment, "The function _notifyUITracer has been called with the correct parameter.");
    });

    QUnit.test("Informs console if logging failed.", async function (assert) {
        // Arrange
        this.getAppHashStub.returns(null);
        this.oLogOpenAppActionStub.rejects();
        sandbox.stub(Log, "info");

        // Act
        this.oController.onAppOpened("sChannelIdTest", "sEventIdTest", this.oResolvedHashFragment);
        await ushellUtils.awaitTimeout(0);

        // Assert
        assert.strictEqual(this.oLogOpenAppActionStub.callCount, 1, "logOpenAppAction has been called once.");
        assert.strictEqual(this.oLogOpenAppActionStub.firstCall.args[0], this.oResolvedHashFragment, "logOpenAppAction - first parameter.");
        assert.strictEqual(this.oLogOpenAppActionStub.firstCall.args[1], null, "logOpenAppAction - second parameter.");
        assert.strictEqual(Log.info.callCount, 1, "Log.info has been called once.");
        assert.strictEqual(Log.info.firstCall.args[0], "Opened application was not logged.", "Log.info - first parameter.");
        assert.strictEqual(Log.info.firstCall.args[1], undefined, "Log.info - second parameter.");
        assert.strictEqual(Log.info.firstCall.args[2], "sap.ushell.renderer.Shell.controller", "Log.info - third parameter.");
    });

    QUnit.module("sap.ushell.renderer.Shell.controller doHashChange", {
        beforeEach: async function (assert) {
            this.oResolveAsyncStepStub = sandbox.stub();
            sandbox.stub(Interaction, "notifyAsyncStep").returns(this.oResolveAsyncStepStub);

            this.oResolvedHashFragment = {
                url: "/some/target/url",
                applicationType: ApplicationType.URL.type,
                text: "App View"
            };
            this.oMetadata = { test: "oMetadata" };
            this.sOldShellHash = "#oldHash";
            this.sOldAppPart = "oldAppPart";

            this.oController = await Controller.create({ name: "sap.ushell.renderer.Shell" });

            this.oController.bEnableHashChange = true;
            this.oShellModel = Config.createModel("/core/shell/model", JSONModel);
            this.oController.getView = sandbox.stub().returns(createMockedView(this.oShellModel));
            ShellModel.getConfigModel().setProperty("/enableTrackingActivity", true);
            this.oController.history = {
                getHistoryLength: sandbox.stub().returns(0),
                hashChange: sandbox.stub(),
                pop: sandbox.stub()
            };

            sandbox.stub(Container, "getServiceAsync");
            Container.getServiceAsync.rejects("Service Mock not implemented!");

            const oResolveHashFragmentDeferred = new jQuery.Deferred();
            oResolveHashFragmentDeferred.resolve(this.oResolvedHashFragment);
            Container.getServiceAsync.withArgs("NavTargetResolutionInternal").returns({
                resolveHashFragment: sandbox.stub().returns(oResolveHashFragmentDeferred.promise())
            });

            Container.getServiceAsync.withArgs("UserRecents").resolves({
                addActivity: sandbox.stub().resolves()
            });


            sandbox.stub(AppLifeCycleAI, "_getInMemoryInstance").returns({ isInstanceSupported: true });

            this.getAppHashStub = sandbox.stub();
            this.oController.oShellNavigationInternal = {
                hashChanger: {
                    getAppHash: this.getAppHashStub,
                    destroy: sandbox.stub()
                },
                wasHistoryEntryReplaced: sandbox.stub(),
                resetHistoryEntryReplaced: sandbox.stub(),
                isInitialNavigation: function () { return false; },
                setIsInitialNavigation: sandbox.stub()
            };

            sandbox.stub(AppLifeCycleAI, "handleCreateApplicationContainer").resolves();
            sandbox.stub(AppLifeCycleAI, "navToCurrentApp");
            sandbox.stub(Storage, "get");
            sandbox.stub(AppConfiguration, "_getMemoizationKey").returns("Shell-search is started inplace");
            sandbox.stub(this.oController, "_getConfig").returns({
                enableRecentActivity: true,
                enableRecentActivityLogging: true
            });
            sandbox.stub(WindowUtils, "openURL"); // prevents new window is opened
            // prevent navigation during test
            sandbox.stub(this.oController, "_windowHistoryBack");
            sandbox.stub(this.oController, "_windowHistoryForward");

            this.oController.oNavigationHistoryMonitor = { reset: sandbox.stub() };

            /*
                * AppConfiguration memoized metadata about the current application.
                * We need to simulate here that each test is uniquely saved in the app configuration service memory.
                * Therefore we mock _getMemoizationKey, which is the function responsible to extract the key to use for the memoization.
                * By mocking in this way we ensure uniqueness of this key.
                */
            sandbox.stub(this.oController, "_setEffectiveNavigationMode").returns(this.oResolvedHashFragment);
            sandbox.stub(AppConfiguration, "getMetadata").returns(this.oMetadata);

            sandbox.spy(this.oController, "logOpenAppAction");
            sandbox.spy(this.oController, "_openAppExplace");
            sandbox.spy(this.oController, "_openAppInplace");
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.onExit(); // Only called automatically when connected to a view
            this.oController.destroy();
            StateManager.resetAll();
        }
    });

    // Test doHashChange: calls correct methods for embedded applications
    [{
        testDescription: "Shell-search is started inplace",
        sInternalNavigationMode: "embedded",
        sText: "App View",
        sHashFragment: "#Action-search"
    }, {
        testDescription: "Shell-search is started inplace with appPart",
        sInternalNavigationMode: "embedded",
        sText: "App View",
        sHashFragment: "#Action-search",
        sAppPart: "&/top=20"
    }].forEach((oFixture) => {
        QUnit.test(`doHashChange embedded when ${oFixture.testDescription}`, async function (assert) {
            const oClock = sandbox.useFakeTimers();

            // unset previous application
            AppConfiguration.setCurrentApplication(null);

            this.oResolvedHashFragment.navigationMode = oFixture.sInternalNavigationMode;
            const oDeferred = this.oController.doHashChange(
                oFixture.sHashFragment,
                oFixture.sAppPart,
                this.sOldShellHash,
                this.sOldAppPart,
                null
            );
            await ushellUtils.promisify(oDeferred);
            // Run all registered timeouts synchronously after the test to also catch there
            oClock.runAll();

            assert.deepEqual(
                this.oController._openAppInplace.getCall(0).args,
                [
                    {
                        semanticObject: "Action",
                        action: "search",
                        appSpecificRoute: undefined,
                        contextRaw: undefined,
                        params: {}
                    },
                    "#Action-search",
                    this.oResolvedHashFragment,
                    this.sOldShellHash,
                    oFixture.sAppPart,
                    null
                ],
                "_openAppInplace was called correctly"
            );
            assert.strictEqual(Interaction.notifyAsyncStep.callCount, 1, "notifyAsyncStep was called");
            assert.strictEqual(this.oResolveAsyncStepStub.callCount, 1, "notifyAsyncStep-resolve was called");

            oClock.restore();
        });
    });

    QUnit.test("Application state is stored before opening the new app embedded", async function (assert) {
        // Arrange
        this.oResolvedHashFragment.navigationMode = "embedded";
        sandbox.spy(AppLifeCycleAI, "storeAppExtensions");
        sandbox.stub(AppLifeCycleAI, "switchViewState");
        sandbox.spy(StateManager, "stallChanges");
        sandbox.spy(StateManager, "applyStalledChanges");
        sandbox.spy(StateManager, "discardStalledChanges");
        sandbox.stub(AppConfiguration, "getCurrentApplication").returns({ applicationType: "URL" });

        // Act
        const oDeferred = this.oController.doHashChange(
            "#Action-search",
            null,
            this.sOldShellHash,
            this.sOldAppPart,
            null
        );
        await ushellUtils.promisify(oDeferred);

        // Assert
        assert.strictEqual(AppLifeCycleAI.storeAppExtensions.callCount, 1, "storeAppExtensions was called");
        assert.strictEqual(StateManager.stallChanges.callCount, 1, "stallChanges was called");
        assert.strictEqual(this.oController._openAppInplace.callCount, 1, "_openAppInplace was called");

        assert.strictEqual(StateManager.applyStalledChanges.callCount, 0, "applyStalledChanges was not called");
        assert.strictEqual(StateManager.discardStalledChanges.callCount, 0, "discardStalledChanges was not called");

        // Assert that store happened before navigate
        assert.ok(AppLifeCycleAI.storeAppExtensions.calledBefore(this.oController._openAppInplace), "storeAppExtensions was called before _openAppInplace");
        assert.ok(StateManager.stallChanges.calledBefore(this.oController._openAppInplace), "stallChanges was called before _openAppInplace");
    });

    QUnit.test("StateManager is continued after handling explace navigation", async function (assert) {
        // Arrange
        this.oResolvedHashFragment.navigationMode = "newWindow";
        sandbox.spy(AppLifeCycleAI, "storeAppExtensions");
        sandbox.stub(AppLifeCycleAI, "switchViewState");
        sandbox.spy(StateManager, "stallChanges");
        sandbox.spy(StateManager, "applyStalledChanges");
        sandbox.spy(StateManager, "discardStalledChanges");
        sandbox.stub(AppConfiguration, "getCurrentApplication").returns({ applicationType: "URL" });

        // Act
        const oDeferred = this.oController.doHashChange(
            "#Action-search",
            null,
            this.sOldShellHash,
            this.sOldAppPart,
            null
        );
        await ushellUtils.promisify(oDeferred);

        // Assert
        assert.strictEqual(AppLifeCycleAI.storeAppExtensions.callCount, 1, "storeAppExtensions was called");
        assert.strictEqual(StateManager.stallChanges.callCount, 1, "stallChanges was called");
        assert.strictEqual(WindowUtils.openURL.callCount, 1, "WindowUtils.openURL was called");

        assert.strictEqual(StateManager.applyStalledChanges.callCount, 1, "applyStalledChanges was called");
        assert.strictEqual(StateManager.discardStalledChanges.callCount, 0, "discardStalledChanges was not called");

        // Assert that apply happened after navigate
        assert.ok(WindowUtils.openURL.calledBefore(StateManager.applyStalledChanges), "WindowUtils.openURL was called before applyStalledChanges");
    });

    QUnit.test("StateManager changes are discard navigation error", async function (assert) {
        // Arrange
        this.oResolvedHashFragment.navigationMode = "embedded";
        sandbox.spy(AppLifeCycleAI, "storeAppExtensions");
        sandbox.stub(AppLifeCycleAI, "switchViewState");
        sandbox.spy(StateManager, "stallChanges");
        sandbox.spy(StateManager, "applyStalledChanges");
        sandbox.spy(StateManager, "discardStalledChanges");
        sandbox.stub(AppConfiguration, "getCurrentApplication").returns({ applicationType: "URL" });

        this.oController._openAppInplace.restore();
        sandbox.stub(this.oController, "_openAppInplace").rejects(new Error("Navigation error"));

        // Act
        const oDeferred = this.oController.doHashChange(
            "#Action-search",
            null,
            this.sOldShellHash,
            this.sOldAppPart,
            null
        );
        await ushellUtils.promisify(oDeferred);

        // Assert
        assert.strictEqual(AppLifeCycleAI.storeAppExtensions.callCount, 1, "storeAppExtensions was called");
        assert.strictEqual(StateManager.stallChanges.callCount, 1, "stallChanges was called");
        assert.strictEqual(this.oController._openAppInplace.callCount, 1, "_openAppInplace was not called");

        assert.strictEqual(StateManager.applyStalledChanges.callCount, 0, "applyStalledChanges was not called");
        assert.strictEqual(StateManager.discardStalledChanges.callCount, 1, "discardStalledChanges was called");
    });

    // Test doHashChange: calls correct methods for ex-place applications (newWindow)
    [{
        testDescription: "Application with invalid hash is started in a new window",
        sInternalNavigationMode: "newWindow",
        sHashFragment: "#hash?p1=v1",
        sText: "Application Title from Target Mapping"
    }, {
        testDescription: "Application with a valid hash is started in a new window",
        sInternalNavigationMode: "newWindow",
        sText: null,
        sHashFragment: "#Object-action?p1=v1&p2=v2"
    }].forEach((oFixture) => {
        QUnit.test(`doHashChange new window when ${oFixture.testDescription}`, async function (assert) {
            const oClock = sandbox.useFakeTimers();

            this.oResolvedHashFragment.navigationMode = oFixture.sInternalNavigationMode;
            const oDeferred = this.oController.doHashChange(
                oFixture.sHashFragment,
                oFixture.sAppPart,
                this.sOldShellHash,
                this.sOldAppPart,
                null
            );
            await ushellUtils.promisify(oDeferred);

            // Run all registered timeouts synchronously after the test to also catch there
            oClock.runAll();
            assert.strictEqual(this.oController.logOpenAppAction.withArgs(this.oResolvedHashFragment, oFixture.sAppPart).calledOnce, true);
            assert.strictEqual(this.oController._openAppExplace.withArgs(this.oResolvedHashFragment).calledOnce, true);
            assert.strictEqual(Interaction.notifyAsyncStep.callCount, 1, "notifyAsyncStep was called");
            assert.strictEqual(this.oResolveAsyncStepStub.callCount, 1, "notifyAsyncStep-resolve was called");

            oClock.restore();
        });
    });

    QUnit.module("sap.ushell.renderer.Shell.controller _openAppExplace", {
        beforeEach: async function () {
            sandbox.stub(WindowUtils, "openURL");
            this.oController = await Controller.create({ name: "sap.ushell.renderer.Shell" });

            this.oDelayedMsgErrorStub = sandbox.stub(this.oController, "delayedMessageError");

            sandbox.stub(this.oController, "_checkWindowLocationSearch").callsFake((sTerm) => {
                return sTerm === "workzone-mobile-app=true";
            });

            sandbox.stub(this.oController, "_windowHistoryBack");
            sandbox.stub(this.oController, "_windowHistoryForward");
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.onExit(); // Only called automatically when connected to a view
            this.oController.destroy();
            StateManager.resetAll();
        }
    });

    QUnit.test("Check for correct WorkZone Mobile Client behavior", function (assert) {
        // Act
        this.oController._openAppExplace("https://example.com");

        // Assert
        assert.strictEqual(this.oDelayedMsgErrorStub.called, false, "delayedMessageError was not called");
    });

    QUnit.module("sap.ushell.renderer.Shell.controller _openAppInplace", {
        beforeEach: async function () {
            this.oResolvedHashFragment = {
                applicationType: "SAPUI5",
                url: "XXX",
                additionalInformation: "",
                navigationMode: "embedded"
            };
            await Container.init("local");
            this.oController = await Controller.create({ name: "sap.ushell.renderer.Shell" });

            sandbox.stub(AppLifeCycleAI, "handleCreateApplicationContainer").resolves();
            sandbox.stub(AppLifeCycleAI, "navToCurrentApp");

            this.oGetConfig = sandbox.stub(this.oController, "_getConfig");
            this.oSwitchState = sandbox.stub(AppLifeCycleAI, "switchViewState");

            sandbox.stub(this.oController, "_windowHistoryBack");
            sandbox.stub(this.oController, "_windowHistoryForward");
            sandbox.stub(ushellUtils, "isColdStart").returns(true);
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.onExit(); // Only called automatically when connected to a view
            this.oController.destroy();
            StateManager.resetAll();
        }
    });

    QUnit.test("Check home state is set for root intent with inner routes", async function (assert) {
        // Arrange
        const sShellHash = "#Test-home";
        const oParsedShellHash = {
            semanticObject: "Test",
            action: "home"
        };

        this.oGetConfig.returns({
            rootIntent: "Test-home&/home"
        });

        // Act
        await this.oController._openAppInplace(
            oParsedShellHash,
            sShellHash,
            this.oResolvedHashFragment,
            "", // sOldShellHash
            null, // sAppPart
            null // oOldResolvedHashFragment
        );

        // Assert
        assert.strictEqual(this.oSwitchState.getCall(0).args[0], "home", "Home state was set");
    });

    QUnit.test("Set app state if rootIntent is not defined", async function (assert) {
        // Arrange
        const sShellHash = "#Test-home";
        const oParsedShellHash = {
            semanticObject: "Test",
            action: "home"
        };

        this.oGetConfig.returns({
            rootIntent: null
        });

        // Act
        await this.oController._openAppInplace(
            oParsedShellHash,
            sShellHash,
            this.oResolvedHashFragment,
            "", // sOldShellHash
            null, // sAppPart
            null // oOldResolvedHashFragment
        );

        // Assert
        assert.strictEqual(this.oSwitchState.getCall(0).args[0], "app", "App state was set");
        assert.strictEqual(AppLifeCycleAI.navToCurrentApp.callCount, 1, "navToCurrentApp was called");
    });

    QUnit.test("Set app state if rootIntent and hash is different", async function (assert) {
        // Arrange
        const sShellHash = "#Test-home";
        const oParsedShellHash = {
            semanticObject: "Test",
            action: "home"
        };

        this.oGetConfig.returns({
            rootIntent: "Shell-home"
        });

        // Act
        await this.oController._openAppInplace(
            oParsedShellHash,
            sShellHash,
            this.oResolvedHashFragment,
            "", // sOldShellHash
            null, // sAppPart
            null // oOldResolvedHashFragment
        );

        // Assert
        assert.strictEqual(this.oSwitchState.getCall(0).args[0], "app", "App state was set");
        assert.strictEqual(AppLifeCycleAI.navToCurrentApp.callCount, 1, "navToCurrentApp was called");
    });

    QUnit.test("Set home state if hash is \"#\"", async function (assert) {
        // Arrange
        const sShellHash = "#";
        const oParsedShellHash = {};

        this.oGetConfig.returns({
            rootIntent: "Shell-home"
        });

        // Act
        await this.oController._openAppInplace(
            oParsedShellHash,
            sShellHash,
            this.oResolvedHashFragment,
            "", // sOldShellHash
            null, // sAppPart
            null // oOldResolvedHashFragment
        );

        // Assert
        assert.strictEqual(this.oSwitchState.getCall(0).args[0], "home", "Home state was set");
        assert.strictEqual(AppLifeCycleAI.navToCurrentApp.callCount, 1, "navToCurrentApp was called");
    });

    QUnit.module("onComponentTargetDisplay", {
        beforeEach: async function () {
            this.oNavToStub = sandbox.stub();
            this.sContainerId = "__container0";
            this.oEvent = {
                getParameters: sandbox.stub().returns({
                    control: {
                        navTo: this.oNavToStub
                    },
                    object: {
                        getId: sandbox.stub().returns(this.sContainerId)
                    }
                })
            };
            this.oController = await Controller.create({ name: "sap.ushell.renderer.Shell" });

            sandbox.stub(this.oController, "_windowHistoryBack");
            sandbox.stub(this.oController, "_windowHistoryForward");
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.onExit(); // Only called automatically when connected to a view
            this.oController.destroy();
            StateManager.resetAll();
        }
    });

    QUnit.test("Navigates to the component", function (assert) {
        // Arrange
        const aExpectedArgs = ["centerViewPort", this.sContainerId, "show"];
        // Act
        this.oController.onComponentTargetDisplay(this.oEvent);
        // Assert
        assert.deepEqual(this.oNavToStub.getCall(0).args, aExpectedArgs, "Navigated with correct args");
    });

    QUnit.test("Resets the restore hash flag", function (assert) {
        // Arrange
        this.oController.bRestorePreviousHash = true;
        // Act
        this.oController.onComponentTargetDisplay(this.oEvent);
        // Assert
        assert.strictEqual(this.oController.bRestorePreviousHash, false, "bRestorePreviousHash was reset correctly");
    });

    QUnit.module("_appendUserIdToUrl", {
        beforeEach: async function () {
            sandbox.stub(Container, "getServiceAsync");
            Container.getServiceAsync.rejects("Service Mock not implemented!");

            this.oGetIdStub = sandbox.stub().returns("USERID");
            Container.getServiceAsync.withArgs("UserInfo").returns(Promise.resolve({
                getUser: sandbox.stub().returns({
                    getId: this.oGetIdStub
                })
            }));

            this.oController = await Controller.create({ name: "sap.ushell.renderer.Shell" });

            sandbox.stub(this.oController, "_windowHistoryBack");
            sandbox.stub(this.oController, "_windowHistoryForward");
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.onExit(); // Only called automatically when connected to a view
            this.oController.destroy();
            StateManager.resetAll();
        }
    });

    QUnit.test("adds sap-user correctly to empty url", function (assert) {
        // Arrange
        const fnDone = assert.async();
        const sParamName = "sap-user";
        const sExpectedResult = "?sap-user=USERID";
        // Act
        this.oController._appendUserIdToUrl(sParamName, "")
            .then((sResult) => {
                // Assert
                assert.strictEqual(sResult, sExpectedResult, "the expected URL was returned");
                fnDone();
            })
            .catch(() => {
                assert.ok(false, "the url should be resolved");
                fnDone();
            });
    });

    QUnit.test("adds sap-user correctly to \"/\"-terminated URL", function (assert) {
        // Arrange
        const fnDone = assert.async();
        const sParamName = "sap-user";
        const sExpectedResult = "http://www.somet.hing.com/?sap-user=USERID";
        // Act
        this.oController._appendUserIdToUrl(sParamName, "http://www.somet.hing.com/")
            .then((sResult) => {
                // Assert
                assert.strictEqual(sResult, sExpectedResult, "the expected URL was returned");
                fnDone();
            })
            .catch(() => {
                assert.ok(false, "the url should be resolved");
                fnDone();
            });
    });

    QUnit.test("adds sap-user correctly to index.html terminated URL", function (assert) {
        // Arrange
        const fnDone = assert.async();
        const sParamName = "sap-user";
        const sExpectedResult = "http://www.somet.hing.com/index.html?sap-user=USERID";
        // Act
        this.oController._appendUserIdToUrl(sParamName, "http://www.somet.hing.com/index.html")
            .then((sResult) => {
                // Assert
                assert.strictEqual(sResult, sExpectedResult, "the expected URL was returned");
                fnDone();
            })
            .catch(() => {
                assert.ok(false, "the url should be resolved");
                fnDone();
            });
    });

    QUnit.test("adds sap-user correctly to URL with parameter", function (assert) {
        // Arrange
        const fnDone = assert.async();
        const sParamName = "sap-user";
        const sExpectedResult = "http://www.somet.hing.com/index.html?search=Hello&sap-user=USERID";
        // Act
        this.oController._appendUserIdToUrl(sParamName, "http://www.somet.hing.com/index.html?search=Hello")
            .then((sResult) => {
                // Assert
                assert.strictEqual(sResult, sExpectedResult, "the expected URL was returned");
                fnDone();
            })
            .catch(() => {
                assert.ok(false, "the url should be resolved");
                fnDone();
            });
    });

    QUnit.test("adds sap-user correctly to URL with multiple parameters", function (assert) {
        // Arrange
        const fnDone = assert.async();
        const sParamName = "sap-user";
        const sExpectedResult = "http://www.somet.hing.com/index.html?search=Hello&title=Foo&sap-user=USERID";
        // Act
        this.oController._appendUserIdToUrl(sParamName, "http://www.somet.hing.com/index.html?search=Hello&title=Foo")
            .then((sResult) => {
                // Assert
                assert.strictEqual(sResult, sExpectedResult, "the expected URL was returned");
                fnDone();
            })
            .catch(() => {
                assert.ok(false, "the url should be resolved");
                fnDone();
            });
    });

    QUnit.test("adds sap-user correctly to URL with sap-user already specified", function (assert) {
        // Arrange
        const fnDone = assert.async();
        const sParamName = "sap-user";
        const sExpectedResult = "http://www.somet.hing.com/index.html?search=Hello&sap-user=USERID&title=Foo&sap-user=USERID";
        // Act
        this.oController._appendUserIdToUrl(sParamName, "http://www.somet.hing.com/index.html?search=Hello&sap-user=USERID&title=Foo")
            .then((sResult) => {
                // Assert
                assert.strictEqual(sResult, sExpectedResult, "the expected URL was returned");
                fnDone();
            })
            .catch(() => {
                assert.ok(false, "the url should be resolved");
                fnDone();
            });
    });

    QUnit.test("adds sap-user correctly to URL with another parameter name other than sap-user", function (assert) {
        // Arrange
        const fnDone = assert.async();
        const sParamName = "sap-id";
        const sExpectedResult = "http://www.somet.hing.com/index.html?search=Hello&sap-id=USERID";
        // Act
        this.oController._appendUserIdToUrl(sParamName, "http://www.somet.hing.com/index.html?search=Hello")
            .then((sResult) => {
                // Assert
                assert.strictEqual(sResult, sExpectedResult, "the expected URL was returned");
                fnDone();
            })
            .catch(() => {
                assert.ok(false, "the url should be resolved");
                fnDone();
            });
    });

    QUnit.test("adds sap-user correctly to NWBC URL without prefix", function (assert) {
        // Arrange
        const fnDone = assert.async();
        const sParamName = "sap-user";
        const sExpectedResult = "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN&System=&sap-user=USERID";
        // Act
        this.oController._appendUserIdToUrl(sParamName, "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN&System=")
            .then((sResult) => {
                // Assert
                assert.strictEqual(sResult, sExpectedResult, "the expected URL was returned");
                fnDone();
            })
            .catch(() => {
                assert.ok(false, "the url should be resolved");
                fnDone();
            });
    });

    QUnit.test("adds sap-user correctly to NWBC URL with prefix", function (assert) {
        // Arrange
        const fnDone = assert.async();
        const sParamName = "sap-user";
        const sExpectedResult = "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/WDR_TEST_FLP_NAVIGATION/?sap-client=000&sap-language=EN&sap-user=USERID";
        // Act
        this.oController._appendUserIdToUrl(sParamName, "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/WDR_TEST_FLP_NAVIGATION/?sap-client=000&sap-language=EN")
            .then((sResult) => {
                // Assert
                assert.strictEqual(sResult, sExpectedResult, "the expected URL was returned");
                fnDone();
            })
            .catch(() => {
                assert.ok(false, "the url should be resolved");
                fnDone();
            });
    });

    QUnit.module("_logRecentActivity", {
        beforeEach: async function () {
            this.oWarningStub = sandbox.stub(Log, "warning");
            this.oLastStub = sandbox.stub(Config, "last");

            this.oDoStub = sandbox.stub();
            this.oOnceStub = sandbox.stub(Config, "once").returns({ do: this.oDoStub });

            sandbox.stub(Container, "getServiceAsync");
            Container.getServiceAsync.rejects("Service Mock not implemented!");

            this.oUserRecents = {
                addActivity: sandbox.stub().callsFake(async (oArg) => {
                    return oArg;
                })
            };
            Container.getServiceAsync.withArgs("UserRecents").resolves(this.oUserRecents);

            this.oController = await Controller.create({ name: "sap.ushell.renderer.Shell" });

            sandbox.stub(this.oController, "_windowHistoryBack");
            sandbox.stub(this.oController, "_windowHistoryForward");
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.onExit(); // Only called automatically when connected to a view
            this.oController.destroy();
            StateManager.resetAll();
        }
    });

    QUnit.test("Resolves if the enableTrackingActivity was already set to true", function (assert) {
        // Arrange
        this.oLastStub.withArgs("/core/shell/model/enableTrackingActivity").returns(true);
        const oActivity = {};
        // Act
        return this.oController._logRecentActivity(oActivity)
            .then((oResult) => {
                // Assert
                assert.strictEqual(oResult, oActivity, "the expected result was returned");
                assert.strictEqual(this.oWarningStub.callCount, 0, "No warning was logged");
            });
    });

    QUnit.test("Rejects if the enableTrackingActivity was already set to false", function (assert) {
        // Arrange
        this.oLastStub.withArgs("/core/shell/model/enableTrackingActivity").returns(false);
        const oActivity = {};
        const aExpectedWarning = [
            "Tracking is not enabled",
            null,
            "sap.ushell.renderer.Shell.controller"
        ];

        // Act
        return this.oController._logRecentActivity(oActivity)
            .catch((oResult) => {
                // Assert
                assert.ok(true, "the promise was rejected");
                assert.deepEqual(this.oWarningStub.getCall(0).args, aExpectedWarning, "The expected warning was logged");
            });
    });

    QUnit.test("Rejects if addActivity fails", function (assert) {
        // Arrange
        this.oLastStub.withArgs("/core/shell/model/enableTrackingActivity").returns(true);
        this.oUserRecents.addActivity.returns(Promise.reject("some Error"));
        const oActivity = {};

        // Act
        return this.oController._logRecentActivity(oActivity)
            .then(() => {
                assert.ok(false, "The promise should have been rejected");
            })
            .catch((sError) => {
                // Assert
                assert.strictEqual(sError, "some Error", "the expected error was thrown");
            });
    });

    QUnit.test("Waits until userSetting is loaded if enableTrackingActivity is undefined", function (assert) {
        // Arrange
        this.oDoStub.callsFake((fnCallback) => {
            this.oLastStub.withArgs("/core/shell/model/enableTrackingActivity").returns(true);
            fnCallback();
        });
        const oActivity = {};

        // Act
        return this.oController._logRecentActivity(oActivity)
            .then((oResult) => {
                // Assert
                assert.strictEqual(this.oOnceStub.callCount, 1, "Config.once was called once");
                assert.strictEqual(this.oLastStub.callCount, 2, "Config.last was called twice");
                assert.strictEqual(oResult, oActivity, "the expected result was returned");
                assert.strictEqual(this.oWarningStub.callCount, 0, "No warning was logged");
            });
    });

    QUnit.test("Waits only once when called twice and enableTrackingActivity is undefined", function (assert) {
        // Arrange
        this.oDoStub.callsFake((fnCallback) => {
            this.oLastStub.withArgs("/core/shell/model/enableTrackingActivity").returns(true);
            fnCallback();
        });
        const oActivity = {};

        // Act
        return Promise.all([
            this.oController._logRecentActivity(oActivity),
            this.oController._logRecentActivity(oActivity)
        ])
            .then(() => {
                assert.strictEqual(this.oOnceStub.callCount, 1, "Config.once was called once");
                assert.strictEqual(this.oLastStub.callCount, 3, "Config.last was called three times");
            });
    });

    QUnit.module("onBeforeNavigate", {
        beforeEach: async function () {
            this.oEventParameters = {
                to: { id: "toView" },
                toId: "toId",
                from: { id: "fromView" },
                fromId: "fromId"
            };
            this.oEvent = {
                getParameter: sandbox.stub().callsFake((sParameter) => {
                    return this.oEventParameters[sParameter];
                })
            };

            this.oOnBeforeNavigateStub = sandbox.stub(AppLifeCycleAI, "onBeforeNavigate");
            this.oByIdStub = sandbox.stub();

            this.oController = await Controller.create({ name: "sap.ushell.renderer.Shell" });
            this.oGetOwnerComponentStub = sandbox.stub(this.oController, "getOwnerComponent").returns({
                byId: this.oByIdStub
            });
            this.oToggleMenuStub = sandbox.stub(this.oController, "_setMenuVisible");

            sandbox.stub(this.oController, "_windowHistoryBack");
            sandbox.stub(this.oController, "_windowHistoryForward");
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.onExit(); // Only called automatically when connected to a view
            this.oController.destroy();
            StateManager.resetAll();
        }
    });

    QUnit.test("Calls onBeforeNavigate on the AppLifeCycle", function (assert) {
        // Arrange
        const aExpectedArgs = [this.oEventParameters.fromId, this.oEventParameters.from, this.oEventParameters.toId, this.oEventParameters.to];
        // Act
        this.oController.onBeforeNavigate(this.oEvent);
        // Assert
        assert.deepEqual(this.oOnBeforeNavigateStub.getCall(0).args, aExpectedArgs, "Called onBeforeNavigate with correct args");
    });

    QUnit.test("Hides the menu when navigating to an application", function (assert) {
        // Arrange
        // Act
        this.oController.onBeforeNavigate(this.oEvent);
        // Assert
        assert.deepEqual(this.oToggleMenuStub.getCall(0).args, [false], "The menu gets hidden");
    });

    QUnit.test("Shows the menu when navigating to the dashboard view", function (assert) {
        // Arrange
        this.oByIdStub.withArgs("Shell-home-component-container").returns(this.oEventParameters.to);
        // Act
        this.oController.onBeforeNavigate(this.oEvent);
        // Assert
        assert.deepEqual(this.oToggleMenuStub.getCall(0).args, [true], "The menu gets shown");
    });

    QUnit.test("Shows the menu when navigating to the pages view", function (assert) {
        // Arrange
        this.oByIdStub.withArgs("pages-component-container").returns(this.oEventParameters.to);
        // Act
        this.oController.onBeforeNavigate(this.oEvent);
        // Assert
        assert.deepEqual(this.oToggleMenuStub.getCall(0).args, [true], "The menu gets shown");
    });

    QUnit.test("Shows the menu when navigating to the home app view", function (assert) {
        // Arrange
        this.oByIdStub.withArgs("homeApp-component-container").returns(this.oEventParameters.to);
        // Act
        this.oController.onBeforeNavigate(this.oEvent);
        // Assert
        assert.deepEqual(this.oToggleMenuStub.getCall(0).args, [true], "The menu gets shown");
    });

    QUnit.test("Shows the menu when navigating to the workpage component", function (assert) {
        // Arrange
        this.oByIdStub.withArgs("workPageRuntime-component-container").returns(this.oEventParameters.to);
        // Act
        this.oController.onBeforeNavigate(this.oEvent);
        // Assert
        assert.deepEqual(this.oToggleMenuStub.getCall(0).args, [true], "The menu gets shown");
    });

    QUnit.test("Shows the menu when navigating to the switcher component", function (assert) {
        // Arrange
        this.oByIdStub.withArgs("runtimeSwitcher-component-container").returns(this.oEventParameters.to);
        // Act
        this.oController.onBeforeNavigate(this.oEvent);
        // Assert
        assert.deepEqual(this.oToggleMenuStub.getCall(0).args, [true], "The menu gets shown");
    });

    QUnit.module("sap.ushell.renderer.Shell.view - integration", {
        beforeEach: async function () {
            QUnit.sap.ushell.createTestDomRef(); // used to place the Renderer

            await Container.init("local");

            this.oMenuService = await Container.getServiceAsync("Menu");
            const oShellNavigationInternal = await Container.getServiceAsync("ShellNavigationInternal");
            sandbox.stub(oShellNavigationInternal, "init"); // prevents resolveHashFragment
        },
        afterEach: function () {
            QUnit.sap.ushell.deleteTestDomRef();
            sandbox.restore();
            StateManager.resetAll();
        }
    });

    QUnit.test("Adds sapUshellMenuBarHeight-class to navigationBar shellArea when menu is enabled", function (assert) {
        let oRendererContainer;
        // Arrange
        sandbox.stub(this.oMenuService, "isMenuEnabled").resolves(true);

        // Act
        return Container.createRendererInternal("fiori2")
            .then((oRenderer) => {
                oRendererContainer = oRenderer;
                oRendererContainer.placeAt("qunit-canvas");

                return Promise.all([
                    testUtils.waitForEventHubEvent("ShellNavigationInitialized"),
                    Container.getRendererInternal().waitForShellLayout()
                ]);
            })
            .then(() => {
                // Assert
                const oNavigationBarShellArea = document.getElementById(ShellArea.NavigationBar);
                assert.strictEqual(oNavigationBarShellArea.classList.contains("sapUshellMenuBarHeight"), true, "Container has style class");

                // Cleanup
                oRendererContainer.destroy();
            });
    });

    QUnit.test("Adds sapUshellMenuBarHeight-class to menuBarComponentContainer when menu is disabled", function (assert) {
        let oRendererContainer;
        // Arrange
        sandbox.stub(this.oMenuService, "isMenuEnabled").resolves(false);

        // Act
        return Container.createRendererInternal("fiori2")
            .then((oRenderer) => {
                oRendererContainer = oRenderer;
                oRendererContainer.placeAt("qunit-canvas");

                return Promise.all([
                    testUtils.waitForEventHubEvent("ShellNavigationInitialized"),
                    Container.getRendererInternal().waitForShellLayout()
                ]);
            })
            .then(() => {
                // Assert
                const oNavigationBarShellArea = document.getElementById(ShellArea.NavigationBar);
                assert.strictEqual(oNavigationBarShellArea.classList.contains("sapUshellMenuBarHeight"), false, "Container does not have style class");

                // Cleanup
                oRendererContainer.destroy();
            });
    });

    QUnit.module("Shell.view: initBackgroundImage", {
        beforeEach: function () {
            QUnit.sap.ushell.createTestDomRef(); // used to place the ShellLayout
            ShellLayout.applyLayout("qunit-canvas");
        },
        afterEach: function () {
            sandbox.restore();
            StateManager.resetAll();
        }
    });

    QUnit.test("Adds separate background nodes for image and shell background", function (assert) {
        // Arrange
        const oWaitForShellLayoutPromise = Promise.resolve();
        const oViewContext = {
            waitForShellLayout: sandbox.stub().returns(oWaitForShellLayoutPromise)
        };
        // Act
        ShellView.prototype.initBackgroundImage.call(oViewContext);
        return oWaitForShellLayoutPromise.then(() => {
            // Assert
            const oBackgroundImageShellArea = document.getElementById(ShellArea.BackgroundImage);

            const aAppBackgroundElement = Array.from(oBackgroundImageShellArea.querySelectorAll(".sapUiGlobalBackgroundImage"));
            const aShellBackgroundElement = Array.from(oBackgroundImageShellArea.querySelectorAll(".sapUshellShellBG"));

            assert.strictEqual(aAppBackgroundElement.length, 1, "Found exactly one App Background Node");
            assert.strictEqual(aShellBackgroundElement.length, 1, "Found exactly one Shell Background Node");
            assert.strictEqual(aAppBackgroundElement[0].isSameNode(aShellBackgroundElement[0]), false, "Elements are separate nodes");
            assert.strictEqual(aAppBackgroundElement[0].compareDocumentPosition(aShellBackgroundElement[0]), Node.DOCUMENT_POSITION_PRECEDING,
                "The shell background is positioned before the app background node within the DOM");
        });
    });

    QUnit.module("Shell.view: createShellHeader", {
        beforeEach: function () {
            QUnit.sap.ushell.createTestDomRef(); // used to place the ShellLayout
            ShellLayout.applyLayout("qunit-canvas");

            this.oViewContext = {
                waitForShellLayout: sandbox.stub().resolves(),
                getViewDataConfig: sandbox.stub().returns({}),
                getShellModel: sandbox.stub().returns(new JSONModel({})),
                addDanglingControl: sandbox.stub()
            };
        },
        afterEach: function () {
            QUnit.sap.ushell.deleteTestDomRef();
            this.oViewContext._oShellHeader.destroy();

            sandbox.restore();
            StateManager.resetAll();
        }
    });

    QUnit.test("Adds a dangling control", async function (assert) {
        // Act
        await ShellView.prototype.createShellHeader.call(this.oViewContext);
        // Assert
        const oDanglingControl = this.oViewContext.addDanglingControl.getCall(0).args[0];
        assert.strictEqual(oDanglingControl, this.oViewContext._oShellHeader, "Dangling control was correctly set");
    });

    QUnit.test("Overwrites updateAggregation", async function (assert) {
        // Act
        await ShellView.prototype.createShellHeader.call(this.oViewContext);
        // Assert
        const oShellHeader = this.oViewContext._oShellHeader;
        const oShellHeaderClass = oShellHeader.getMetadata().getClass();
        assert.notStrictEqual(oShellHeader.updateAggregation, oShellHeaderClass.prototype.updateAggregation, "updateAggregation was correctly set");
    });

    QUnit.test("Creates and renders the ShellHeader", async function (assert) {
        // Act
        await ShellView.prototype.createShellHeader.call(this.oViewContext);
        // Assert
        const ShellHeaderShellArea = document.getElementById(ShellArea.ShellHeader);
        await nextUIUpdate();

        assert.ok(ShellHeaderShellArea.children.length > 0, "Shell Header was created and rendered");
    });

    QUnit.test("Models", async function (assert) {
        // Act
        await ShellView.prototype.createShellHeader.call(this.oViewContext);
        // Assert
        const oModel = this.oViewContext._oShellHeader.getModel("shellModel");
        assert.ok(oModel, "A model was set");
        const oI18nModel = this.oViewContext._oShellHeader.getModel("i18n");
        assert.ok(oI18nModel, "A translation model was set");
        const oNewExperienceModel = this.oViewContext._oShellHeader.getModel("newExperience");
        assert.ok(oNewExperienceModel, "A new experience model was set");
    });

    QUnit.module("oOldResolvedHashFragment with TR application", {
        beforeEach: async function () {
            sandbox.stub(AppLifeCycleAI, "switchViewState");
            sandbox.stub(AppLifeCycleAI, "handleCreateApplicationContainer");
            sandbox.stub(AppLifeCycleAI, "navToCurrentApp");
            sandbox.stub(AppLifeCycleAI, "getShellUIService").returns({
                setBackNavigation: sandbox.stub()
            });

            this.oController = await Controller.create({ name: "sap.ushell.renderer.Shell" });

            sandbox.stub(this.oController, "_windowHistoryBack");
            sandbox.stub(this.oController, "_windowHistoryForward");

            sandbox.stub(ushellUtils, "isColdStart").returns(true);
        },
        afterEach: function () {
            sandbox.restore();
            StateManager.resetAll();
            this.oController.onExit(); // Only called automatically when connected to a view
            this.oController.destroy();
        }
    });

    [{
        testDescription: "Navigation made to same application type in reusable container",
        sContainerApplicationType: "TR",
        sNextApplicationType: "TR",
        statefulType: 1,
        expected: "postMessageNotSent"
    }, {
        testDescription: "Navigation made to different application type in reusable container",
        sContainerApplicationType: "TR",
        sNextApplicationType: "SAPUI5",
        statefulType: 1,
        expected: "postMessageSent"
    }, {
        testDescription: "Navigation made to different application type in non-reusable container",
        sContainerApplicationType: "TR",
        sNextApplicationType: "SAPUI5",
        statefulType: 0, // no post message if container is not reusable
        expected: "postMessageNotSent"
    }, {
        testDescription: "Navigation made to different application in non-reusable WDA container",
        sContainerApplicationType: "WDA",
        sNextApplicationType: "SAPUI5",
        statefulType: 0, // no post message if container is not reusable
        expected: "postMessageNotSent"
    }].forEach((oFixture) => {
        QUnit.test(`ApplicationContainer#onApplicationOpened: ${oFixture.testDescription}`, async function (assert) {
            // Arrange
            const iNow = Date.now();
            sandbox.useFakeTimers(iNow);
            const oContentWindow = {
                postMessage: sandbox.spy((sData) => {
                    const oData = JSON.parse(sData);

                    window.postMessage(JSON.stringify({
                        status: "success",
                        request_id: oData.request_id
                    }), "*");
                })
            };

            const oApplicationContainer = {
                getId: sandbox.stub().returns("CONTAINER_ID"),
                getDomRef: sandbox.stub().returns({
                    tagName: "IFRAME",
                    contentWindow: oContentWindow,
                    src: new URI()
                }),
                _getIFrame: ApplicationContainer.prototype._getIFrame,
                _getIFrameUrl: ApplicationContainer.prototype._getIFrameUrl,
                getIframeWithPost: sandbox.stub().returns(false),
                getApplicationType: sandbox.stub().returns(oFixture.sContainerApplicationType),
                getStatefulType: sandbox.stub().returns(oFixture.statefulType)
            };

            const oOldResolvedHashFragment = {
                applicationType: oFixture.sContainerApplicationType
            };
            sandbox.stub(BlueBoxHandler, "getBlueBoxByUrl").returns(oApplicationContainer);

            // Act
            await this.oController._openAppInplace(
                {}, // oParsedShellHash
                "#", //sShellHash
                {
                    applicationType: oFixture.sNextApplicationType,
                    navigationMode: "embedded"
                }, // oResolvedHashFragment
                "", // sOldShellHash
                null, // sAppPart
                oOldResolvedHashFragment
            );

            if (oFixture.expected === "postMessageNotSent") {
                // Assert
                assert.strictEqual(oApplicationContainer.getDomRef.callCount, 0, "A reference to the iframe that displays the application is not accessed");
                assert.strictEqual(oContentWindow.postMessage.callCount, 0, "A message was not sent to the iframe that displays the application.");
            }
            if (oFixture.expected === "postMessageSent") {
                // Assert
                assert.strictEqual(oApplicationContainer.getDomRef.callCount, 1, "A reference to the iframe that displays the application is accessed");
                assert.strictEqual(oContentWindow.postMessage.callCount, 1, "A message was sent to the iframe that displays the application.");
                assert.strictEqual(
                    new RegExp("\"service\":s*\"sap.gui.triggerCloseSession\"").test(oContentWindow.postMessage.args[0][0]),
                    true,
                    "The message sent to the iframe contains the mandatory `service` id 'sap.gui.triggerCloseSession' as expected"
                );
            }
        });
    });

    QUnit.module("logOpenAppAction", {
        beforeEach: async function () {
            window["sap-ushell-config"] = {};
            window["sap-ushell-config"].renderers = { fiori2: { componentData: { config: { enableNotificationsUI: true } } } };

            this.sHash = "#SomeObject-someAction?someParam=someValue";
            sandbox.stub(hasher, "getHash").returns(this.sHash);

            await Container.init("local");
            this.UserRecents = await Container.getServiceAsync("UserRecents");
            sandbox.stub(this.UserRecents, "addActivity").resolves();

            Config.emit("/core/shell/enableRecentActivity", true);
            Config.emit("/core/shell/enableRecentActivityLogging", true);
            Config.emit("/core/shell/model/enableTrackingActivity", true);

            const ShellNavigationInternal = await Container.getServiceAsync("ShellNavigationInternal");
            sandbox.stub(ShellNavigationInternal, "init");

            this.oController = await Controller.create({ name: "sap.ushell.renderer.Shell" });
            sandbox.stub(this.oController, "_windowHistoryBack");
            sandbox.stub(this.oController, "_windowHistoryForward");
        },
        afterEach: function () {
            Config._reset();
            sandbox.restore();
            delete window["sap-ushell-config"];
            StateManager.resetAll();
            this.oController.onExit(); // Only called automatically when connected to a view
            this.oController.destroy();
        }
    });

    QUnit.test("Does not log an application if /core/shell/enableRecentActivity is false", async function (assert) {
        // Arrange
        Config.emit("/core/shell/enableRecentActivity", false);
        const oResolvedHashFragment = {
            sFixedShellHash: this.sHash,
            text: "someAppTitle"
        };

        // Act
        await this.oController.logOpenAppAction(oResolvedHashFragment, "").catch(() => {
            // Assert
            assert.strictEqual(this.UserRecents.addActivity.callCount, 0, "UserRecents - addActivity was not called.");
        });
    });

    QUnit.test("Does not log an application if /core/shell/enableRecentActivityLogging is false", async function (assert) {
        // Arrange
        Config.emit("/core/shell/enableRecentActivityLogging", false);
        const oResolvedHashFragment = {
            sFixedShellHash: this.sHash,
            text: "someAppTitle"
        };

        // Act
        await this.oController.logOpenAppAction(oResolvedHashFragment, "").catch(() => {
            // Assert
            assert.strictEqual(this.UserRecents.addActivity.callCount, 0, "UserRecents - addActivity was not called.");
        });
    });

    QUnit.test("Does not log an application if /core/shell/model/enableTrackingActivity is false", async function (assert) {
        // Arrange
        Config.emit("/core/shell/model/enableTrackingActivity", false);
        const oResolvedHashFragment = {
            sFixedShellHash: this.sHash,
            text: "someAppTitle"
        };

        // Act
        await this.oController.logOpenAppAction(oResolvedHashFragment, "").catch(() => {
            // Assert
            assert.strictEqual(this.UserRecents.addActivity.callCount, 0, "UserRecents - addActivity was not called.");
        });
    });

    QUnit.test("Logs an app with a sFixedShellHash property in the resolved hash fragment", function (assert) {
        // Arrange
        const oResolvedHashFragment = {
            sFixedShellHash: this.sHash,
            text: "someAppTitle"
        };
        const aExpectedArgs = [
            {
                title: "someAppTitle",
                appType: AppType.APP,
                url: this.sHash,
                appId: "#SomeObject-someAction"
            }
        ];

        // Act
        return this.oController.logOpenAppAction(oResolvedHashFragment, "").then(() => {
            // Assert
            assert.strictEqual(this.UserRecents.addActivity.callCount, 1, "UserRecents - addActivity was called once.");
            assert.deepEqual(this.UserRecents.addActivity.firstCall.args, aExpectedArgs, "UserRecents - addActivity was called as expected.");
        });
    });

    QUnit.test("Logs an app without the sFixedShellHash property in the resolved hash fragment", function (assert) {
        // Arrange
        sandbox.stub(this.oController, "_getCurrentLocationHash").returns(this.sHash);
        const oResolvedHashFragment = {
            text: "someAppTitle"
        };
        const aExpectedArgs = [
            {
                title: "someAppTitle",
                appType: AppType.APP,
                url: this.sHash,
                appId: "#SomeObject-someAction"
            }
        ];

        // Act
        return this.oController.logOpenAppAction(oResolvedHashFragment, "").then(() => {
            // Assert
            assert.strictEqual(this.UserRecents.addActivity.callCount, 1, "UserRecents - addActivity was called once.");
            assert.deepEqual(this.UserRecents.addActivity.firstCall.args, aExpectedArgs, "UserRecents - addActivity was called as expected.");
        });
    });

    QUnit.test("If AppState is null do not add it to the url", function (assert) {
        // Arrange
        sandbox.stub(this.oController, "_getCurrentLocationHash").returns(this.sHash);
        const oResolvedHashFragment = {
            text: "someAppTitle"
        };
        const aExpectedArgs = [
            {
                title: "someAppTitle",
                appType: AppType.APP,
                url: this.sHash,
                appId: "#SomeObject-someAction"
            }
        ];

        // Act
        return this.oController.logOpenAppAction(oResolvedHashFragment, null).then(() => {
            // Assert
            assert.strictEqual(this.UserRecents.addActivity.callCount, 1, "UserRecents - addActivity was called once.");
            assert.deepEqual(this.UserRecents.addActivity.firstCall.args, aExpectedArgs, "UserRecents - addActivity was called as expected.");
        });
    });

    QUnit.module("The function _notifyUITracer", {
        beforeEach: async function () {
            this.oController = await Controller.create({ name: "sap.ushell.renderer.Shell" });
            this.oEmitStub = sandbox.stub(EventHub, "emit");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Prefers the Fiori ID as app ID", function (assert) {
        //Arrange
        const oResolvedHashFragment = {
            reservedParameters: {
                "sap-fiori-id": ["F1234"],
                "sap-ui-app-id-hint": ["hinthint"]
            },
            ui5ComponentName: "sap.application.component.name"
        };

        //Act
        this.oController._notifyUITracer(oResolvedHashFragment);

        //Assert
        assert.strictEqual(this.oEmitStub.getCall(0).args[1].data.applicationId, "F1234", "The correct app ID was sent to the UI tracer");
    });

    QUnit.test("Uses the app-id-hint as second option for the app ID", function (assert) {
        //Arrange
        const oResolvedHashFragment = {
            reservedParameters: {
                "sap-ui-app-id-hint": ["hinthint"]
            },
            ui5ComponentName: "sap.application.component.name"
        };

        //Act
        this.oController._notifyUITracer(oResolvedHashFragment);

        //Assert
        assert.strictEqual(this.oEmitStub.getCall(0).args[1].data.applicationId, "hinthint", "The correct app ID was sent to the UI tracer");
    });

    QUnit.test("Uses the UI5 component as third option for the app ID", function (assert) {
        //Arrange
        const oResolvedHashFragment = {
            reservedParameters: {
            },
            ui5ComponentName: "sap.application.component.name"
        };

        //Act
        this.oController._notifyUITracer(oResolvedHashFragment);

        //Assert
        assert.strictEqual(this.oEmitStub.getCall(0).args[1].data.applicationId, "sap.application.component.name", "The correct app ID was sent to the UI tracer");
    });

    QUnit.test("Returns an empty string as app ID if no app ID could be determined", function (assert) {
        //Arrange
        const oResolvedHashFragment = {};

        //Act
        this.oController._notifyUITracer(oResolvedHashFragment);

        //Assert
        assert.strictEqual(this.oEmitStub.getCall(0).args[1].data.applicationId, "", "The correct app ID was sent to the UI tracer");
    });
});
