// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/* global QUnit */

sap.ui.define([
    "sap/base/Log",
    "sap/ushell/plugin/utils/TestUtil",
    "sap/ushell/appRuntime/ui5/plugins/baseRta/AppLifeCycleUtils",
    "sap/ushell/appRuntime/ui5/plugins/baseRta/Renderer",
    "sap/ui/thirdparty/sinon-4"
], function (
    Log,
    TestUtil,
    AppLifeCycleUtils,
    Renderer,
    sinon
) {
    "use strict";

    var sandbox = sinon.sandbox.create();

    QUnit.module("Given a UI5 application", {
        beforeEach: function () {
            this.oContainer = TestUtil.createContainerObject.call(this, "UI5");
            sandbox.stub(AppLifeCycleUtils, "getContainer").returns(this.oContainer);
            this.oDummyComponent = {
                mConfig: {
                    id: "RTA_AppRuntime_Plugin_ActionButton",
                    icon: "sap-icon://wrench",
                    i18n: {
                        getText: sandbox.stub().returns("Mocked RTA_BUTTON_TEXT")
                    }
                }
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("when createActionButton is called with bVisible = true", async function (assert) {
        const fnHandlerStub = sandbox.stub();
        const fnCreateUserActionStub = sandbox.stub().resolves({
            showForAllApps: sandbox.stub(),
            hideForAllApps: sandbox.stub()
        });
        sandbox.stub(this.oContainer, "getServiceAsync").withArgs("FrameBoundExtension").resolves({
            createUserAction: fnCreateUserActionStub
        });
        const oActionButton = await Renderer.createActionButton(this.oDummyComponent, fnHandlerStub, true);
        assert.deepEqual(fnCreateUserActionStub.firstCall.args[0], {
            id: "RTA_AppRuntime_Plugin_ActionButton",
            text: "Mocked RTA_BUTTON_TEXT",
            icon: "sap-icon://wrench",
            press: fnHandlerStub
        }, "then the user action is created with the correct parameters");
        assert.ok(oActionButton.showForAllApps.calledOnce, "then the button is shown");
    });

    QUnit.test("when createActionButton is called with bVisible = false", async function (assert) {
        const fnHandlerStub = sandbox.stub();
        const fnCreateUserActionStub = sandbox.stub().resolves({
            showForAllApps: sandbox.stub(),
            hideForAllApps: sandbox.stub()
        });
        sandbox.stub(this.oContainer, "getServiceAsync").withArgs("FrameBoundExtension").resolves({
            createUserAction: fnCreateUserActionStub
        });
        const oActionButton = await Renderer.createActionButton(this.oDummyComponent, fnHandlerStub, false);
        assert.ok(oActionButton.hideForAllApps.calledOnce, "then the button is hidden");
    });

    QUnit.test("when createActionButton is called with an incorrect i18n entry", async function (assert) {
        const fnHandlerStub = sandbox.stub();
        const oLogErrorStub = sandbox.stub(Log, "error");
        const fnCreateUserActionStub = sandbox.stub().resolves({
            showForAllApps: sandbox.stub(),
            hideForAllApps: sandbox.stub()
        });
        this.oDummyComponent.mConfig.i18n = "Incorrect i18n entry";
        sandbox.stub(this.oContainer, "getServiceAsync").withArgs("FrameBoundExtension").resolves({
            createUserAction: fnCreateUserActionStub
        });
        await Renderer.createActionButton(this.oDummyComponent, fnHandlerStub, true);
        assert.ok(oLogErrorStub.calledOnce, "then an error is logged");
    });
});
