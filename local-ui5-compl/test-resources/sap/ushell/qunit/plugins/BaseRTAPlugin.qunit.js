// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/* global QUnit, sinon*/

// eslint-disable-next-line no-unused-expressions
window.blanket && window.blanket.options("sap-ui-cover-only", "[sap/ushell/plugins]");

sap.ui.define([
    "sap/ushell/plugin/utils/TestUtil",
    "sap/ushell/plugins/rta/Component",
    "sap/ushell/appRuntime/ui5/plugins/baseRta/AppLifeCycleUtils",
    "sap/ushell/appRuntime/ui5/plugins/baseRta/CheckConditions",
    "sap/ushell/appRuntime/ui5/plugins/baseRta/Renderer",
    "sap/ushell/appRuntime/ui5/plugins/baseRta/Trigger",
    "sap/ui/core/Component",
    "sap/ui/Device",
    "sap/ui/fl/write/api/FeaturesAPI"
], function (
    TestUtil,
    RTAPlugin,
    AppLifeCycleUtils,
    CheckConditions,
    Renderer,
    Trigger,
    Component,
    Device,
    FeaturesAPI
) {
    "use strict";

    const sandbox = sinon.createSandbox();
    QUnit.module("Given an application that is not of type UI5", {
        beforeEach: async function () {
            const oContainer = TestUtil.createContainerObject.call(this, "notUI5");
            sandbox.stub(AppLifeCycleUtils, "getContainer").returns(oContainer);
            sandbox.stub(FeaturesAPI, "isKeyUser").returns(true);
            this.oPlugin = await Component.create({
                name: "sap.ushell.plugins.rta"
            });
        },
        afterEach: function () {
            this.oPlugin.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("when a new app of type UI5 gets loaded", function (assert) {
        const done = assert.async();
        AppLifeCycleUtils.getContainer.restore();
        const oContainer = TestUtil.createContainerObject.call(this, "UI5");
        sandbox.stub(AppLifeCycleUtils, "getContainer").returns(oContainer);
        const oSetButtonVisilibitySpy = sandbox.spy(RTAPlugin.prototype, "_setButtonVisibility");
        this.oPlugin._onAppLoaded()
            .then(function () {
                done();
                assert.strictEqual(oSetButtonVisilibitySpy.lastCall.args[0], true, "then the button was set to visible");
            });
    });

    QUnit.module("Given a application that is of type UI5", {
        beforeEach: async function () {
            const oContainer = TestUtil.createContainerObject.call(this, "UI5");
            sandbox.stub(AppLifeCycleUtils, "getContainer").returns(oContainer);
            sandbox.stub(FeaturesAPI, "isKeyUser").returns(true);
            this.oPlugin = await Component.create({
                name: "sap.ushell.plugins.rta"
            });
        },
        afterEach: function () {
            this.oPlugin.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("when a new app (not UI5) gets loaded", function (assert) {
        const done = assert.async();
        const done2 = assert.async();
        AppLifeCycleUtils.getContainer.restore();
        const oContainer = TestUtil.createContainerObject.call(this, "notUI5");
        sandbox.stub(AppLifeCycleUtils, "getContainer").returns(oContainer);
        let oSetButtonVisilibitySpy;
        CheckConditions.checkUI5App()
            .then(function (bIsUI5App) {
                done();
                assert.notOk(bIsUI5App, "_checkUI5App returns false");
                oSetButtonVisilibitySpy = sandbox.spy(RTAPlugin.prototype, "_setButtonVisibility");
                return this.oPlugin._onAppLoaded();
            }.bind(this))
            .then(function () {
                done2();
                assert.strictEqual(oSetButtonVisilibitySpy.lastCall.args[0], false, "then the button was hidden");
            });
    });

    QUnit.module("Given a UI5 application and restart enabled", {
        beforeEach: function () {
            this.sStorageKey = "sap.ui.rta.restart.CUSTOMER";
            window.sessionStorage.setItem(this.sStorageKey, true);
        },
        afterEach: function () {
            // Session storage is cleaned up by RTA instance
            window.sessionStorage.removeItem(this.sStorageKey);
            this.oPlugin.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("When the plugin gets initialized", async function (assert) {
        const oContainer = TestUtil.createContainerObject.call(this, "UI5");
        sandbox.stub(AppLifeCycleUtils, "getContainer").returns(oContainer);
        const oRestartStub = sandbox.stub(Trigger.prototype, "triggerStartRta");
        sandbox.stub(FeaturesAPI, "isKeyUser").returns(true);
        this.oPlugin = this.oPlugin = await Component.create({
            name: "sap.ushell.plugins.rta"
        });
        await this.oPlugin.getPluginPromise();
        assert.strictEqual(oRestartStub.callCount, 1, "then RTA Start is triggered");
    });

    QUnit.module("Given a UI5 application and restart in VENDOR layer enabled", {
        beforeEach: function () {
            this.sStorageKey = "sap.ui.rta.restart.VENDOR";
            window.sessionStorage.setItem(this.sStorageKey, true);
            const oStub = sandbox.stub(URLSearchParams.prototype, "get");
            oStub.withArgs("sap-ui-layer").returns("VENDOR");
        },
        afterEach: function () {
            // Session storage is cleaned up by RTA instance
            window.sessionStorage.removeItem(this.sStorageKey);
            this.oPlugin.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("When the plugin gets initialized", async function (assert) {
        const oContainer = TestUtil.createContainerObject.call(this, "UI5");
        sandbox.stub(AppLifeCycleUtils, "getContainer").returns(oContainer);
        const oRestartStub = sandbox.stub(Trigger.prototype, "triggerStartRta");
        sandbox.stub(FeaturesAPI, "isKeyUser").returns(true);
        this.oPlugin = this.oPlugin = await Component.create({
            name: "sap.ushell.plugins.rta"
        });
        await this.oPlugin.getPluginPromise();
        assert.strictEqual(oRestartStub.callCount, 1, "then RTA Start is triggered");
    });

    QUnit.module("Given a application that is of type UI5 and a renderer returned in the created callback", {
        beforeEach: async function (assert) {
            const oContainer = TestUtil.createContainerObject.call(this, "UI5", true, false, assert);
            sandbox.stub(AppLifeCycleUtils, "getContainer").returns(oContainer);
            sandbox.stub(FeaturesAPI, "isKeyUser").returns(true);
            this.oPlugin = await Component.create({
                name: "sap.ushell.plugins.rta"
            });
            await this.oPlugin.getPluginPromise();
            return Renderer.createActionButton(this.oPlugin, function () { }, true);
        },
        afterEach: function () {
            this.oPlugin.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("when the renderer created event is thrown", function (assert) {
        const done = assert.async();
        assert.expect(2);
        this.oPlugin.destroy();
        this.oPlugin.getPluginPromise()
            .then(function () {
                assert.strictEqual(this.fnAttachCallback, this.fnDetachCallback, "the callback function is the same in attach and detach");
                assert.strictEqual(this.oAttachContext, this.oDetachContext, "the context function is the same in attach and detach");
                done();
            }.bind(this));
    });

    QUnit.module("Given a application that is of type UI5 and no renderer returned in the created callback", {
        beforeEach: async function (assert) {
            const oContainer = TestUtil.createContainerObject.call(this, "UI5", true, true, assert);
            sandbox.stub(AppLifeCycleUtils, "getContainer").returns(oContainer);
            sandbox.stub(FeaturesAPI, "isKeyUser").returns(true);
            this.oPlugin = await Component.create({
                name: "sap.ushell.plugins.rta"
            });
            await this.oPlugin.getPluginPromise();
            return Renderer.createActionButton(this.oPlugin, function () { }, true);
        },
        afterEach: function () {
            this.oPlugin.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("when the renderer created event is thrown", function (assert) {
        const done = assert.async();
        assert.expect(3);
        this.oPlugin.destroy();
        this.oPlugin.getPluginPromise()
            .then(function () {
                assert.strictEqual(this.mAddActionParameters, undefined, "the action button didn't get added");
                assert.equal(this.fnAttachCallback, this.fnDetachCallback, "the callback function is the same in attach and detach");
                assert.equal(this.oAttachContext, this.oDetachContext, "the context function is the same in attach and detach");
                done();
            }.bind(this));
    });

    QUnit.module("misc", {
        afterEach: function () {
            this.oPlugin.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("When the plugin gets initialized without key user authorization", async function (assert) {
        const oContainer = TestUtil.createContainerObject.call(this, "UI5");
        sandbox.stub(AppLifeCycleUtils, "getContainer").returns(oContainer);
        const oCreateActionButtonStub = sandbox.stub(Renderer, "createActionButton").resolves();
        const oIsKeyUserStub = sandbox.stub(FeaturesAPI, "isKeyUser").resolves(false);
        this.oPlugin = await Component.create({
            name: "sap.ushell.plugins.rta"
        });
        await this.oPlugin.getPluginPromise();
        assert.strictEqual(oIsKeyUserStub.callCount, 1, "the key user authorization is checked");
        assert.strictEqual(oCreateActionButtonStub.lastCall.args[2], false, "the action button is hidden");
    });

    QUnit.test("When the plugin is initialized and a app load is triggered without key user authorization", async function (assert) {
        const oContainer = TestUtil.createContainerObject.call(this, "UI5");
        sandbox.stub(AppLifeCycleUtils, "getContainer").returns(oContainer);
        sandbox.stub(FeaturesAPI, "isKeyUser").resolves(false);
        this.oPlugin = await Component.create({
            name: "sap.ushell.plugins.rta"
        });
        await this.oPlugin.getPluginPromise();
        const oAdaptButtonVisibilityStub = sandbox.stub(this.oPlugin, "_setButtonVisibility");
        await this.oPlugin._onAppLoaded();
        assert.strictEqual(oAdaptButtonVisibilityStub.lastCall.args[0], false, "the action button is hidden");
    });

    QUnit.test("When the plugin is initialized and a app load is triggered with key user authorization", async function (assert) {
        const oContainer = TestUtil.createContainerObject.call(this, "UI5");
        sandbox.stub(AppLifeCycleUtils, "getContainer").returns(oContainer);
        sandbox.stub(FeaturesAPI, "isKeyUser").resolves(true);
        this.oPlugin = await Component.create({
            name: "sap.ushell.plugins.rta"
        });
        await this.oPlugin.getPluginPromise();
        const oAdaptButtonVisibilityStub = sandbox.stub(this.oPlugin, "_setButtonVisibility");
        await this.oPlugin._onAppLoaded();
        assert.strictEqual(oAdaptButtonVisibilityStub.lastCall.args[0], true, "the action button is visible");
    });

    QUnit.test("When the plugin is initialized without key user authorization and a app load is triggered with key user authorization", async function (assert) {
        const oContainer = TestUtil.createContainerObject.call(this, "UI5");
        sandbox.stub(AppLifeCycleUtils, "getContainer").returns(oContainer);
        const oIsKeyUserStub = sandbox.stub(FeaturesAPI, "isKeyUser").resolves(false);
        this.oPlugin = await Component.create({
            name: "sap.ushell.plugins.rta"
        });
        await this.oPlugin.getPluginPromise();
        oIsKeyUserStub.resolves(true);
        const oAdaptButtonVisibilityStub = sandbox.stub(this.oPlugin, "_setButtonVisibility");
        await this.oPlugin._onAppLoaded();
        assert.strictEqual(oAdaptButtonVisibilityStub.lastCall.args[0], true, "the action button is visible");
    });

    QUnit.test("When the plugin is initialized with key user authorization and a app load is triggered without key user authorization", async function (assert) {
        const oContainer = TestUtil.createContainerObject.call(this, "UI5");
        sandbox.stub(AppLifeCycleUtils, "getContainer").returns(oContainer);
        const oIsKeyUserStub = sandbox.stub(FeaturesAPI, "isKeyUser").resolves(true);
        this.oPlugin = await Component.create({
            name: "sap.ushell.plugins.rta"
        });
        await this.oPlugin.getPluginPromise();
        oIsKeyUserStub.resolves(false);
        const oAdaptButtonVisibilityStub = sandbox.stub(this.oPlugin, "_setButtonVisibility");
        await this.oPlugin._onAppLoaded();
        assert.strictEqual(oAdaptButtonVisibilityStub.lastCall.args[0], false, "the action button is hidden");
    });

    QUnit.test("when an UI5-App is started on a mobile device", async function (assert) {
        const oContainer = TestUtil.createContainerObject.call(this, "UI5", true, false, assert);
        sandbox.stub(AppLifeCycleUtils, "getContainer").returns(oContainer);
        sandbox.stub(FeaturesAPI, "isKeyUser").returns(true);
        //simulate phone
        sandbox.stub(Device.system, "phone").value(true);
        sandbox.stub(Device.system, "desktop").value(false);
        this.oCreateActionButtonSpy = sandbox.spy(Renderer, "createActionButton");
        this.oPlugin = await Component.create({
            name: "sap.ushell.plugins.rta"
        });
        await this.oPlugin.getPluginPromise();
        assert.strictEqual(this.oCreateActionButtonSpy.lastCall.args[2], false, "then the 'Adapt UI' button was hidden");
    });

    QUnit.test("when an UI5-App is started on a dektop device", async function (assert) {
        const oContainer = TestUtil.createContainerObject.call(this, "UI5", true, false, assert);
        sandbox.stub(AppLifeCycleUtils, "getContainer").returns(oContainer);
        sandbox.stub(FeaturesAPI, "isKeyUser").returns(true);
        //simulate desktop
        sandbox.stub(Device.system, "phone").value(false);
        sandbox.stub(Device.system, "desktop").value(true);
        this.oCreateActionButtonSpy = sandbox.spy(Renderer, "createActionButton");
        this.oPlugin = await Component.create({
            name: "sap.ushell.plugins.rta"
        });
        await this.oPlugin.getPluginPromise();
        assert.strictEqual(this.oCreateActionButtonSpy.lastCall.args[2], true, "then the 'Adapt UI' button was set to visible");
    });

});
