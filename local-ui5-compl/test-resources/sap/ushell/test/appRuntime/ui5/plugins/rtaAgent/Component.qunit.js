// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

// eslint-disable-next-line no-unused-expressions
window.blanket && window.blanket.options("sap-ui-cover-only", "[sap/ushell/appRuntime/ui5/plugins]");

sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "sap/ushell/appRuntime/ui5/plugins/rtaAgent/Component",
    "sap/ushell/plugin/utils/TestUtil",
    "sap/ui/core/EventBus",
    "sap/ui/fl/write/api/FeaturesAPI",
    "sap/base/i18n/ResourceBundle",
    "sap/base/Log",
    "sap/ushell/api/RTA",
    "sap/ushell/appRuntime/ui5/plugins/baseRta/AppLifeCycleUtils",
    "sap/ushell/appRuntime/ui5/plugins/baseRta/CheckConditions",
    "sap/ushell/appRuntime/ui5/plugins/baseRta/Trigger",
    "sap/ushell/Container",
    "sap/ui/thirdparty/sinon-4",
    "sap/ui/fl/library"
], function (
    jQuery,
    RTAPlugin,
    TestUtil,
    EventBus,
    FlFeaturesAPI,
    ResourceBundle,
    Log,
    RtaApi,
    AppLifeCycleUtils,
    CheckConditions,
    Trigger,
    Container,
    sinon
) {
    "use strict";

    /* global QUnit */

    const sandbox = sinon.sandbox.create();
    const sPostMessageGroupId = "user.postapi.rtaPlugin";
    const sSwitchToolbarVisibilityPostMessageId = "switchToolbarVisibility";
    const sShowAdaptUIPostMessageId = "showAdaptUI";
    const sActivatePostMessageId = "activatePlugin";

    QUnit.module("Given a application that is of type UI5 but without key user enablement", {
        beforeEach: function () {
            const oContainer = TestUtil.createContainerObject.call(this, "UI5");
            sandbox.stub(AppLifeCycleUtils, "getContainer").returns(oContainer);
            // disables key user specific functionality on start
            this.oIsKeyUserStub = sandbox.stub(FlFeaturesAPI, "isKeyUser").resolves(false);
            this.oRegisterPostMessageAPIsStub = sandbox.stub();
            this.oPostMessageToFlpStub = sandbox.stub().returns(new jQuery.Deferred().resolve());
            this.oPlugin = new RTAPlugin(TestUtil.createComponentData.call(this));
        },
        afterEach: function () {
            this.oPlugin.destroy();
            return this.oPlugin.getPluginPromise()
                .then(function () {
                    sandbox.restore();
                });
        }
    });

    QUnit.test("when app gets loaded and is not enabled for key user adaptation", function (assert) {
        const mInitialConfiguration = this.oPlugin.mConfig;
        assert.strictEqual(mInitialConfiguration.sComponentName, "sap.ushell.appRuntime.ui5.plugins.rtaAgent",
            "then the component name is set");
        assert.strictEqual(mInitialConfiguration.layer, "CUSTOMER", "then the layer is set");
        assert.strictEqual(mInitialConfiguration.developerMode, false, "then the developer mode is set");
        assert.ok(this.oIsKeyUserStub.calledOnce, "then the 'isKeyUser' function is called");
    });

    let fnRTAPluginInitPromiseResolve;
    let oRTAPluginInitPromise;

    async function createDefaultStubs () {
        this.oContainer = await Container.init("local");
        this.oIsKeyUserStub = sandbox.stub(FlFeaturesAPI, "isKeyUser").resolves(true);
        oRTAPluginInitPromise = new Promise(function (resolve) {
            fnRTAPluginInitPromiseResolve = resolve;
        });
        this.oRegisterPostMessageAPIsStub = sandbox.stub().callsFake(fnRTAPluginInitPromiseResolve);
        this.oPostMessageToFlpStub = sandbox.stub().returns(new jQuery.Deferred().resolve());
        this.oRestartRtaIfRequiredSpy = sandbox.spy(RTAPlugin.prototype, "_restartRtaIfRequired");
    }

    function instantiatePlugin () {
        return new Promise(function (resolve) {
            const RTAPluginExtended = RTAPlugin.extend("test", {
                init: function () {
                    RTAPlugin.prototype.init.apply(this, arguments);
                    oRTAPluginInitPromise.then(resolve);
                }
            });
            this.oPlugin = new RTAPluginExtended(TestUtil.createComponentData.call(this));
        }.bind(this));
    }

    QUnit.module("Given a application that is of type UI5 and key user enabled", {
        beforeEach: async function (assert) {
            this.oGetAppLifeCycleServiceStub = sandbox.stub(AppLifeCycleUtils, "getAppLifeCycleService")
            .resolves(TestUtil.createAppLifeCycleService("UI5", true, undefined, false));
            await createDefaultStubs.call(this, this.oContainer);
            return instantiatePlugin.call(this);
        },
        afterEach: function () {
            this.oPlugin.destroy();
            return this.oPlugin.getPluginPromise()
                .then(function () {
                    sandbox.restore();
                });
        }
    });
    QUnit.test("when 'init' function is called and key user adaptation is enabled", function (assert) {
        const mConfig = this.oPlugin.mConfig;
        assert.ok(this.oIsKeyUserStub.calledOnce, "then the 'isKeyUser' function is called");
        assert.ok(!!(this.oPostMessageToFlpStub.getCall(0)),
            "then the postmessage 'activatePlugin' is triggered");
        assert.strictEqual(this.oPostMessageToFlpStub.getCall(0).args[0], sPostMessageGroupId,
            "then the postmessage group id is provided");
        assert.strictEqual(this.oPostMessageToFlpStub.getCall(0).args[1], sActivatePostMessageId,
            "then the postmessage id is provided");
        assert.ok(mConfig.i18n instanceof ResourceBundle, "then 'i18n' resource bundle is instantiated");
        assert.ok(mConfig.onStartHandler, "then 'onStartHandler' is available");
        assert.ok(mConfig.onErrorHandler, "then 'onErrorHandler' is available");
        assert.ok(mConfig.onStopHandler, "then 'onStopHandler' is available");
        assert.ok(this.oPlugin.oTrigger instanceof Trigger, "then 'trigger' module is instantiated");
        const mPostMessageRegistration = this.oRegisterPostMessageAPIsStub.getCall(0).args[0][sPostMessageGroupId];
        assert.strictEqual(typeof mPostMessageRegistration.inCalls.startUIAdaptation.executeServiceCallFn, "function",
            "then the 'startUIAdaptation' function is registered as inCall in the post message interface");
        assert.ok(typeof mPostMessageRegistration.outCalls.activatePlugin,
            "then the 'activatePlugin' function is registered as outCall in the post message interface");
        assert.ok(typeof mPostMessageRegistration.outCalls.showAdaptUI,
            "then the 'showAdaptUI' function is registered as outCall in the post message interface");
        assert.ok(this.oRestartRtaIfRequiredSpy.calledOnce,
            "then '_restartRtaIfRequired' function is called");
        assert.ok(this.oGetAppLifeCycleServiceStub.called,
            "then 'getAppLifeCycleService' function is called");
        assert.ok(!!(this.oPostMessageToFlpStub.getCall(1)),
            "then the postmessage 'showAdaptUI' is triggered");
        assert.strictEqual(this.oPostMessageToFlpStub.getCall(1).args[0], sPostMessageGroupId,
            "then the postmessage group id is provided");
        assert.strictEqual(this.oPostMessageToFlpStub.getCall(1).args[1], sShowAdaptUIPostMessageId,
            "then the postmessage id is provided");
    });

    QUnit.test("when 'init' function is called and an exception is thrown during execution", function (assert) {
        const fnDone = assert.async();
        const sTestErrorMessage = "testError";
        this.oPlugin._restartRtaIfRequired.restore();
        sandbox.stub(this.oPlugin, "_restartRtaIfRequired").throws(new Error(sTestErrorMessage));
        const oErrorStub = sandbox.stub(Log, "error");
        this.oPlugin.init();
        setTimeout(() => {
            assert.strictEqual(oErrorStub.getCall(0).args[0].message, sTestErrorMessage, "then the error is logged in console");
            fnDone();
        }, 100);
    });

    QUnit.test("when 'startUIAdaptation' is triggered by post message call", function (assert) {
        const mPostMessageRegistration = this.oRegisterPostMessageAPIsStub.getCall(0).args[0][sPostMessageGroupId];
        const fnExecuteServiceCallFn = mPostMessageRegistration.inCalls.startUIAdaptation.executeServiceCallFn;
        const oTriggerStartRtaStub = sandbox.stub(this.oPlugin.oTrigger, "triggerStartRta");
       sandbox.stub(RtaApi, "addTopHeaderPlaceHolder");
        return fnExecuteServiceCallFn()
            .done(function () {
                assert.ok(oTriggerStartRtaStub.calledOnce, "then the trigger start rta function is called");
            });
    });

    QUnit.test("when 'startUIAdaptation' is triggered and an 'appClosed' event is published", function (assert) {
        const mPostMessageRegistration = this.oRegisterPostMessageAPIsStub.getCall(0).args[0][sPostMessageGroupId];
        const fnExecuteServiceCallFn = mPostMessageRegistration.inCalls.startUIAdaptation.executeServiceCallFn;
        const oTriggerStartRtaStub = sandbox.stub(this.oPlugin.oTrigger, "triggerStartRta");
        const oTriggerStopRtaStub = sandbox.stub(this.oPlugin.oTrigger, "triggerStopRta");
        sandbox.stub(RtaApi, "addTopHeaderPlaceHolder");
        return fnExecuteServiceCallFn()
            .done(function () {
                assert.ok(oTriggerStartRtaStub.calledOnce, "then the trigger start rta function is called");

                EventBus.getInstance().publish("sap.ushell", "appClosed");
                assert.ok(oTriggerStopRtaStub.called, "then after appClosed event trigger stop rta function is called");
                assert.ok(oTriggerStopRtaStub.args[0][0], "then 'bDontSaveChanges' parameter is 'true'");
            });
    });

    QUnit.test("when '_restartRtaIfRequired' function is called", function (assert) {
        const oTriggerStartRtaStub = sandbox.stub(this.oPlugin.oTrigger, "triggerStartRta");
        const oCheckUI5AppSpy = sandbox.spy(CheckConditions, "checkUI5App");
        const oCheckRestartRTAStub = sandbox.stub(CheckConditions, "checkRestartRTA").returns(true);
        const oAddTopPlaceHolderStub = sandbox.stub(RtaApi, "addTopHeaderPlaceHolder");
        return this.oPlugin._restartRtaIfRequired()
            .then(function () {
                assert.ok(oCheckUI5AppSpy.calledOnce, "then 'checkUI5App' function is called");
                assert.ok(oCheckRestartRTAStub.calledOnce, "then 'checkRestartRTA' function is called");
                const oMessageContent = { visible: false };
                assert.ok(!!(this.oPostMessageToFlpStub.getCall(2)),
                    "then the postmessage 'switchToolbarVisibility' is triggered");
                assert.strictEqual(this.oPostMessageToFlpStub.getCall(2).args[0], sPostMessageGroupId,
                    "then the postmessage group id is provided");
                assert.strictEqual(this.oPostMessageToFlpStub.getCall(2).args[1], sSwitchToolbarVisibilityPostMessageId,
                    "then the postmessage id is provided");
                assert.deepEqual(this.oPostMessageToFlpStub.getCall(2).args[2], oMessageContent,
                    "then the postmessage content is provided");
                assert.ok(oTriggerStartRtaStub.calledOnce, "then 'triggerStartRta' function is called");
                assert.ok(oAddTopPlaceHolderStub.calledOnce, "then 'addTopHeaderPlaceHolder' function is called");
            }.bind(this));
    });

    QUnit.test("when the app gets loaded", function (assert) {
        const fnDone = assert.async();
        const oCheckUI5AppSpy = sandbox.spy(CheckConditions, "checkUI5App");
        this.oPostMessageToFlpStub.reset();
        this.oPostMessageToFlpStub = sandbox.stub()
            .callsFake(function () {
                if (this.oPostMessageToFlpStub.callCount === 3) {
                    assert.ok(!!(this.oPostMessageToFlpStub.getCall(2)),
                        "then the postmessage 'switchToolbarVisibility' is triggered");
                    assert.strictEqual(this.oPostMessageToFlpStub.getCall(2).args[0], sPostMessageGroupId,
                        "then the postmessage group id is provided");
                    assert.strictEqual(this.oPostMessageToFlpStub.getCall(2).args[1], sShowAdaptUIPostMessageId,
                        "then the postmessage id is provided");
                    fnDone();
                }
                return new jQuery.Deferred().resolve();
            }.bind(this));
        sandbox.stub(RtaApi, "removeTopHeaderPlaceHolder");

        instantiatePlugin.call(this)
            .then(function () {
                this.oPlugin._onAppLoaded(); // event handler with async functionality
                assert.ok(oCheckUI5AppSpy.called, "then 'checkUI5App' function is called");
                assert.ok(!!(this.oRestartRtaIfRequiredSpy.called), "then '_restartRtaIfRequired' function is called");
            }.bind(this));
    });

    QUnit.test("when the rta gets stopped", function (assert) {
        const oExitRtaStub = sandbox.stub(this.oPlugin.oTrigger, "exitRta");
        const oEventBusSpy = sandbox.spy(EventBus.getInstance(), "unsubscribe");
        sandbox.stub(RtaApi, "removeTopHeaderPlaceHolder");
        this.oPlugin._onStopHandler();
        assert.ok(oExitRtaStub.called, "then 'exitRta' function is called");
        assert.ok(!!(this.oPostMessageToFlpStub.getCall(2)),
            "then the postmessage 'switchToolbarVisibility' is triggered");
        assert.strictEqual(this.oPostMessageToFlpStub.getCall(2).args[0], sPostMessageGroupId,
            "then the postmessage group id is provided");
        assert.strictEqual(this.oPostMessageToFlpStub.getCall(2).args[1], sSwitchToolbarVisibilityPostMessageId,
            "then the postmessage id is provided");
        assert.deepEqual(this.oPostMessageToFlpStub.getCall(2).args[2], { visible: true },
            "then the postmessage content is provided");
        assert.equal(oEventBusSpy.firstCall.args[1], "appClosed", "then appClosed event got unsubscribed");
    });

    QUnit.test("when 'exit' function is called", function (assert) {
        const oDetachAppLoadedStub = sandbox.stub();
        AppLifeCycleUtils.getAppLifeCycleService.restore();
        sandbox.stub(AppLifeCycleUtils, "getAppLifeCycleService").resolves({
            detachAppLoaded: oDetachAppLoadedStub
        });
        this.oPlugin.exit();
        return this.oPlugin.getPluginPromise()
            .then(function () {
                assert.ok(oDetachAppLoadedStub.called, "then 'detachAppLoaded' is called");
                assert.strictEqual(typeof oDetachAppLoadedStub.lastCall.args[0], "function",
                    "then handler function for 'AppLifeCycleService.onAppLoaded' event is detached");
                assert.ok(!!(this.oPostMessageToFlpStub.getCall(2)),
                    "then the postmessage 'switchToolbarVisibility' is triggered");
                assert.strictEqual(this.oPostMessageToFlpStub.getCall(2).args[0], sPostMessageGroupId,
                    "then the postmessage group id is provided");
                assert.strictEqual(this.oPostMessageToFlpStub.getCall(2).args[1], sSwitchToolbarVisibilityPostMessageId,
                    "then the postmessage id is provided");
                assert.deepEqual(this.oPostMessageToFlpStub.getCall(2).args[2], { visible: true },
                    "then the postmessage content is provided");
            }.bind(this));
    });

    QUnit.module("Given an application that is not UI5 and backend is enabled for key user adaptation", {
        beforeEach: async function () {
            this.oGetAppLifeCycleServiceSpy = sandbox.spy(AppLifeCycleUtils, "getAppLifeCycleService");
            await createDefaultStubs.call(this);
            return instantiatePlugin.call(this);
        },
        afterEach: function () {
            this.oPlugin.destroy();
            return this.oPlugin.getPluginPromise()
                .then(function () {
                    sandbox.restore();
                });
        }
    });
    QUnit.test("when 'init' function is called", function (assert) {
        const mConfig = this.oPlugin.mConfig;
        assert.ok(this.oIsKeyUserStub.calledOnce, "then the 'isKeyUser' function is called");
        assert.ok(!!(this.oPostMessageToFlpStub.called),
            "then the postmessage 'activatePlugin' is triggered");
        assert.strictEqual(this.oPostMessageToFlpStub.getCall(0).args[0], sPostMessageGroupId,
            "then the postmessage group id is provided");
        assert.strictEqual(this.oPostMessageToFlpStub.getCall(0).args[1], sActivatePostMessageId,
            "then the postmessage id is provided");
        assert.ok(mConfig.i18n instanceof ResourceBundle, "then 'i18n' resource bundle is instantiated");
        assert.ok(mConfig.onStartHandler, "then 'onStartHandler' is available");
        assert.ok(mConfig.onErrorHandler, "then 'onErrorHandler' is available");
        assert.ok(mConfig.onStopHandler, "then 'onStopHandler' is available");
        assert.ok(this.oPlugin.oTrigger instanceof Trigger, "then 'trigger' module is instantiated");
        const mPostMessageRegistration = this.oRegisterPostMessageAPIsStub.getCall(0).args[0][sPostMessageGroupId];
        assert.strictEqual(typeof mPostMessageRegistration.inCalls.startUIAdaptation.executeServiceCallFn, "function",
            "then the 'startUIAdaptation' function is registered as inCall in the post message interface");
        assert.ok(typeof mPostMessageRegistration.outCalls.activatePlugin,
            "then the 'activatePlugin' function is registered as outCall in the post message interface");
        assert.ok(typeof mPostMessageRegistration.outCalls.showAdaptUI,
            "then the 'showAdaptUI' function is registered as outCall in the post message interface");
        assert.ok(this.oRestartRtaIfRequiredSpy.calledOnce, "then '_restartRtaIfRequired' function is called");
        assert.ok(this.oGetAppLifeCycleServiceSpy.called, "then 'getAppLifeCycleService' function is called");
        assert.notStrictEqual(this.oPostMessageToFlpStub.lastCall.args[1], sShowAdaptUIPostMessageId,
            "then the postmessage 'showAdaptUI' is NOT sent");
    });

    QUnit.test("when a new not UI5 app gets loaded", function (assert) {
        const oCheckUI5AppSpy = sandbox.spy(CheckConditions, "checkUI5App");
        this.oRestartRtaIfRequiredSpy.resetHistory();
        this.oPostMessageToFlpStub.resetHistory();
        this.oPlugin._onAppLoaded();
        assert.ok(oCheckUI5AppSpy.called, "then 'checkUI5App' function is called");
        assert.notOk(this.oRestartRtaIfRequiredSpy.called, "then '_restartRtaIfRequired' function is NOT called");
        assert.notOk(this.oPostMessageToFlpStub.called, "then the postmessage 'showAdaptUI' is NOT sent");
    });

    QUnit.test("when a new app of type UI5 gets loaded", function (assert) {
        const fnDone = assert.async();
        const oContainer = TestUtil.createContainerObject.call(this, "UI5");
        sandbox.stub(AppLifeCycleUtils, "getContainer").returns(oContainer);
        const oCheckUI5AppSpy = sandbox.spy(CheckConditions, "checkUI5App");
        this.oRestartRtaIfRequiredSpy.resetHistory();
        this.oPostMessageToFlpStub.reset();
        this.oPostMessageToFlpStub = sandbox.stub()
            .callsFake(function () {
                if (this.oPostMessageToFlpStub.callCount === 3) {
                    assert.ok(!!(this.oPostMessageToFlpStub.called),
                        "then the postmessage 'showAdaptUI' is triggered");
                    assert.strictEqual(this.oPostMessageToFlpStub.lastCall.args[0], sPostMessageGroupId,
                        "then the postmessage group id is provided");
                    assert.strictEqual(this.oPostMessageToFlpStub.lastCall.args[1], sShowAdaptUIPostMessageId,
                        "then the postmessage with id 'showAdaptUI' is provided");
                    fnDone();
                }
                return new jQuery.Deferred().resolve();
            }.bind(this));

        oRTAPluginInitPromise = new Promise(function (resolve) {
            fnRTAPluginInitPromiseResolve = resolve;
        });
        this.oRegisterPostMessageAPIsStub = sandbox.stub().callsFake(fnRTAPluginInitPromiseResolve);

        instantiatePlugin.call(this)
            .then(function () {
                this.oPlugin._onAppLoaded();
                assert.ok(oCheckUI5AppSpy.called, "then 'checkUI5App' function is called");
                assert.ok(this.oRestartRtaIfRequiredSpy.calledOnce, "then '_restartRtaIfRequired' function is called");
            }.bind(this));
    });
});
