// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.appRuntime.ui5.services.Extension
 */
sap.ui.define([
    "sap/ui/core/Control",
    "sap/ushell/appRuntime/ui5/AppCommunicationMgr",
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/ushell/appRuntime/ui5/services/Extension"
], function (
    Control,
    AppCommunicationMgr,
    AppRuntimeService,
    Extension
) {
    "use strict";

    var sandbox = sinon.createSandbox({});

    /* global QUnit, sinon */

    QUnit.module("Constructor", {
        beforeEach: async function () {
            this.oRegisterCommHandlersStub = sandbox.stub(AppCommunicationMgr, "registerCommHandlers");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Registers to the Communication Handlers", async function (assert) {
        // Act
        new Extension();
        // Assert
        const oHandler = this.oRegisterCommHandlersStub.getCall(0).args[0];
        assert.deepEqual(Object.keys(oHandler), ["sap.ushell.services.Extension"], "The correct channel was registered");
        assert.deepEqual(Object.keys(oHandler["sap.ushell.services.Extension"].oServiceCalls), ["handleControlEvent"], "The correct handler was registered");
    });

    QUnit.test("Event handler does silently fail for non existent items", async function (assert) {
        // Arrange
        new Extension();
        const fnCallHandleControlEvent = this.oRegisterCommHandlersStub.getCall(0).args[0]["sap.ushell.services.Extension"].oServiceCalls.handleControlEvent.executeServiceCallFn;

        // Act
        await fnCallHandleControlEvent({
            oMessageData: {
                body: {
                    itemId: "nonExistentItem",
                    eventName: "press"
                }
            }
        });
        // Assert
        assert.ok(true, "The function did not throw an error");
    });

    QUnit.test("Event handler does silently fail for non existent events on items", async function (assert) {
        // Arrange
        const ExtensionService = new Extension();
        const fnCallHandleControlEvent = this.oRegisterCommHandlersStub.getCall(0).args[0]["sap.ushell.services.Extension"].oServiceCalls.handleControlEvent.executeServiceCallFn;

        const sItemId = "newItem1";
        sandbox.stub(AppRuntimeService, "postMessageToFLP").resolves({ itemId: sItemId });
        await ExtensionService.createHeaderItem({
            icon: "sap-icon://da"
        });

        // Act
        await fnCallHandleControlEvent({
            oMessageData: {
                body: {
                    itemId: sItemId,
                    eventName: "press"
                }
            }
        });
        // Assert
        assert.ok(true, "The function did not throw an error");
    });

    QUnit.module("Header Item", {
        beforeEach: async function () {
            this.oRegisterCommHandlersStub = sandbox.stub(AppCommunicationMgr, "registerCommHandlers");
            this.oPostMessageToFLPStub = sandbox.stub(AppRuntimeService, "postMessageToFLP");
            this.Extension = new Extension();

            this.fnCallHandleControlEvent = this.oRegisterCommHandlersStub.getCall(0).args[0]["sap.ushell.services.Extension"].oServiceCalls.handleControlEvent.executeServiceCallFn;
        },
        afterEach: async function () {
            sandbox.restore();
        }
    });

    QUnit.test("Creates regular item", async function (assert) {
        // Arrange
        this.oPostMessageToFLPStub.resolves({ itemId: "newItem1" });

        const aExpectedArgs = ["sap.ushell.services.Extension.createHeaderItem", {
            controlProperties: {
                icon: "sap-icon://da",
                text: "Hello"
            },
            events: ["press"],
            parameters: {
                position: "begin"
            }
        }];

        // Act
        await this.Extension.createHeaderItem({
            icon: "sap-icon://da",
            text: "Hello",
            press: function () {}
        }, {
            position: "begin"
        });

        // Assert
        assert.deepEqual(this.oPostMessageToFLPStub.getCall(0).args, aExpectedArgs, "The postMessageToFLP was called with the correct arguments");
    });

    QUnit.test("Create handles undefined parameters", async function (assert) {
        // Arrange
        this.oPostMessageToFLPStub.resolves({ itemId: "newItem1" });

        const aExpectedArgs = ["sap.ushell.services.Extension.createHeaderItem", {
            controlProperties: {
                icon: "sap-icon://da"
            },
            events: [],
            parameters: {}
        }];

        // Act
        await this.Extension.createHeaderItem({
            icon: "sap-icon://da"
        });

        // Assert
        assert.deepEqual(this.oPostMessageToFLPStub.getCall(0).args, aExpectedArgs, "The postMessageToFLP was called with the correct arguments");
    });

    QUnit.test("Create does not check for allowed properties", async function (assert) {
        // Arrange
        this.oPostMessageToFLPStub.resolves({ itemId: "newItem1" });

        const aExpectedArgs = ["sap.ushell.services.Extension.createHeaderItem", {
            controlProperties: {
                unsupported: "property"
            },
            events: ["unsupportedEvent"],
            parameters: {
                unsupported: "parameter"
            }
        }];

        // Act
        await this.Extension.createHeaderItem({
            unsupported: "property",
            unsupportedEvent: function () {}
        }, {
            unsupported: "parameter"
        });

        // Assert
        assert.deepEqual(this.oPostMessageToFLPStub.getCall(0).args, aExpectedArgs, "The postMessageToFLP was called with the correct arguments");
    });

    QUnit.test("Create fails for controls as properties", async function (assert) {
        // Arrange
        this.oPostMessageToFLPStub.resolves({ itemId: "newItem1" });

        try {
            // Act
            await this.Extension.createHeaderItem({
                prop1: new Control()
            });
            assert.ok(false, "The test should have failed");
        } catch (oError) {
            assert.ok(true, "An error was thrown");
        }
    });

    QUnit.test("Handles event call correctly", async function (assert) {
        // Arrange
        const sItemId = "newItem1";
        this.oPostMessageToFLPStub.resolves({ itemId: sItemId });
        const oMockHandler = sandbox.stub();

        await this.Extension.createHeaderItem({
            icon: "sap-icon://da",
            text: "Hello",
            press: oMockHandler
        });

        // Act
        await this.fnCallHandleControlEvent({
            oMessageData: {
                body: {
                    itemId: sItemId,
                    eventName: "press"
                }
            }
        });

        // Assert
        assert.strictEqual(oMockHandler.callCount, 1, "The event handler was called");
    });

    QUnit.test("destroy is forwarded correctly", async function (assert) {
        // Arrange
        const sItemId = "newItem1";
        this.oPostMessageToFLPStub.resolves({ itemId: sItemId });

        const oHeaderItem = await this.Extension.createHeaderItem({
            icon: "sap-icon://da"
        });

        this.oPostMessageToFLPStub.resetHistory();

        const aExpectedArgs = ["sap.ushell.services.Extension.Item.destroy", {
            itemId: sItemId
        }];

        // Act
        await oHeaderItem.destroy();

        // Assert
        assert.deepEqual(this.oPostMessageToFLPStub.getCall(0).args, aExpectedArgs, "The postMessageToFLP was called with the correct arguments");
    });

    QUnit.test("showForCurrentApp is forwarded correctly", async function (assert) {
        // Arrange
        const sItemId = "newItem1";
        this.oPostMessageToFLPStub.resolves({ itemId: sItemId });

        const oHeaderItem = await this.Extension.createHeaderItem({
            icon: "sap-icon://da"
        });

        this.oPostMessageToFLPStub.resetHistory();

        const aExpectedArgs = ["sap.ushell.services.Extension.Item.showForCurrentApp", {
            itemId: sItemId
        }];

        // Act
        await oHeaderItem.showForCurrentApp();

        // Assert
        assert.deepEqual(this.oPostMessageToFLPStub.getCall(0).args, aExpectedArgs, "The postMessageToFLP was called with the correct arguments");
    });

    QUnit.test("hideForCurrentApp is forwarded correctly", async function (assert) {
        // Arrange
        const sItemId = "newItem1";
        this.oPostMessageToFLPStub.resolves({ itemId: sItemId });

        const oHeaderItem = await this.Extension.createHeaderItem({
            icon: "sap-icon://da"
        });

        this.oPostMessageToFLPStub.resetHistory();

        const aExpectedArgs = ["sap.ushell.services.Extension.Item.hideForCurrentApp", {
            itemId: sItemId
        }];

        // Act
        await oHeaderItem.hideForCurrentApp();

        // Assert
        assert.deepEqual(this.oPostMessageToFLPStub.getCall(0).args, aExpectedArgs, "The postMessageToFLP was called with the correct arguments");
    });

    QUnit.test("showForAllApps is forwarded correctly", async function (assert) {
        // Arrange
        const sItemId = "newItem1";
        this.oPostMessageToFLPStub.resolves({ itemId: sItemId });

        const oHeaderItem = await this.Extension.createHeaderItem({
            icon: "sap-icon://da"
        });

        this.oPostMessageToFLPStub.resetHistory();

        const aExpectedArgs = ["sap.ushell.services.Extension.Item.showForAllApps", {
            itemId: sItemId
        }];

        // Act
        await oHeaderItem.showForAllApps();

        // Assert
        assert.deepEqual(this.oPostMessageToFLPStub.getCall(0).args, aExpectedArgs, "The postMessageToFLP was called with the correct arguments");
    });

    QUnit.test("hideForAllApps is forwarded correctly", async function (assert) {
        // Arrange
        const sItemId = "newItem1";
        this.oPostMessageToFLPStub.resolves({ itemId: sItemId });

        const oHeaderItem = await this.Extension.createHeaderItem({
            icon: "sap-icon://da"
        });

        this.oPostMessageToFLPStub.resetHistory();

        const aExpectedArgs = ["sap.ushell.services.Extension.Item.hideForAllApps", {
            itemId: sItemId
        }];

        // Act
        await oHeaderItem.hideForAllApps();

        // Assert
        assert.deepEqual(this.oPostMessageToFLPStub.getCall(0).args, aExpectedArgs, "The postMessageToFLP was called with the correct arguments");
    });

    QUnit.test("showOnHome is forwarded correctly", async function (assert) {
        // Arrange
        const sItemId = "newItem1";
        this.oPostMessageToFLPStub.resolves({ itemId: sItemId });

        const oHeaderItem = await this.Extension.createHeaderItem({
            icon: "sap-icon://da"
        });

        this.oPostMessageToFLPStub.resetHistory();

        const aExpectedArgs = ["sap.ushell.services.Extension.Item.showOnHome", {
            itemId: sItemId
        }];

        // Act
        await oHeaderItem.showOnHome();

        // Assert
        assert.deepEqual(this.oPostMessageToFLPStub.getCall(0).args, aExpectedArgs, "The postMessageToFLP was called with the correct arguments");
    });

    QUnit.test("hideOnHome is forwarded correctly", async function (assert) {
        // Arrange
        const sItemId = "newItem1";
        this.oPostMessageToFLPStub.resolves({ itemId: sItemId });

        const oHeaderItem = await this.Extension.createHeaderItem({
            icon: "sap-icon://da"
        });

        this.oPostMessageToFLPStub.resetHistory();

        const aExpectedArgs = ["sap.ushell.services.Extension.Item.hideOnHome", {
            itemId: sItemId
        }];

        // Act
        await oHeaderItem.hideOnHome();

        // Assert
        assert.deepEqual(this.oPostMessageToFLPStub.getCall(0).args, aExpectedArgs, "The postMessageToFLP was called with the correct arguments");
    });

    QUnit.module("User Action", {
        beforeEach: async function () {
            this.oRegisterCommHandlersStub = sandbox.stub(AppCommunicationMgr, "registerCommHandlers");
            this.oPostMessageToFLPStub = sandbox.stub(AppRuntimeService, "postMessageToFLP");
            this.Extension = new Extension();

            this.fnCallHandleControlEvent = this.oRegisterCommHandlersStub.getCall(0).args[0]["sap.ushell.services.Extension"].oServiceCalls.handleControlEvent.executeServiceCallFn;
        },
        afterEach: async function () {
            sandbox.restore();
        }
    });

    QUnit.test("Creates regular item", async function (assert) {
        // Arrange
        this.oPostMessageToFLPStub.resolves({ itemId: "newItem1" });

        const aExpectedArgs = ["sap.ushell.services.Extension.createUserAction", {
            controlProperties: {
                icon: "sap-icon://da",
                text: "Hello"
            },
            events: ["press"],
            parameters: {
                controlType: "sap.ushell.ui.launchpad.ActionItem"
            }
        }];

        // Act
        await this.Extension.createUserAction({
            icon: "sap-icon://da",
            text: "Hello",
            press: function () {}
        }, {
            controlType: "sap.ushell.ui.launchpad.ActionItem"
        });

        // Assert
        assert.deepEqual(this.oPostMessageToFLPStub.getCall(0).args, aExpectedArgs, "The postMessageToFLP was called with the correct arguments");
    });

    QUnit.test("Create handles undefined parameters", async function (assert) {
        // Arrange
        this.oPostMessageToFLPStub.resolves({ itemId: "newItem1" });

        const aExpectedArgs = ["sap.ushell.services.Extension.createUserAction", {
            controlProperties: {
                icon: "sap-icon://da"
            },
            events: [],
            parameters: {}
        }];

        // Act
        await this.Extension.createUserAction({
            icon: "sap-icon://da"
        });

        // Assert
        assert.deepEqual(this.oPostMessageToFLPStub.getCall(0).args, aExpectedArgs, "The postMessageToFLP was called with the correct arguments");
    });

    QUnit.test("Create does not check for allowed properties", async function (assert) {
        // Arrange
        this.oPostMessageToFLPStub.resolves({ itemId: "newItem1" });

        const aExpectedArgs = ["sap.ushell.services.Extension.createUserAction", {
            controlProperties: {
                unsupported: "property"
            },
            events: ["unsupportedEvent"],
            parameters: {
                unsupported: "parameter"
            }
        }];

        // Act
        await this.Extension.createUserAction({
            unsupported: "property",
            unsupportedEvent: function () {}
        }, {
            unsupported: "parameter"
        });

        // Assert
        assert.deepEqual(this.oPostMessageToFLPStub.getCall(0).args, aExpectedArgs, "The postMessageToFLP was called with the correct arguments");
    });

    QUnit.test("Create fails for controls as properties", async function (assert) {
        // Arrange
        this.oPostMessageToFLPStub.resolves({ itemId: "newItem1" });

        try {
            // Act
            await this.Extension.createUserAction({
                prop1: new Control()
            });
            assert.ok(false, "The test should have failed");
        } catch (oError) {
            assert.ok(true, "An error was thrown");
        }
    });

    QUnit.test("Handles event call correctly", async function (assert) {
        // Arrange
        const sItemId = "newItem1";
        this.oPostMessageToFLPStub.resolves({ itemId: sItemId });
        const oMockHandler = sandbox.stub();

        await this.Extension.createUserAction({
            icon: "sap-icon://da",
            text: "Hello",
            press: oMockHandler
        });

        // Act
        await this.fnCallHandleControlEvent({
            oMessageData: {
                body: {
                    itemId: sItemId,
                    eventName: "press"
                }
            }
        });

        // Assert
        assert.strictEqual(oMockHandler.callCount, 1, "The event handler was called");
    });

    QUnit.test("destroy is forwarded correctly", async function (assert) {
        // Arrange
        const sItemId = "newItem1";
        this.oPostMessageToFLPStub.resolves({ itemId: sItemId });

        const oHeaderItem = await this.Extension.createUserAction({
            icon: "sap-icon://da"
        });

        this.oPostMessageToFLPStub.resetHistory();

        const aExpectedArgs = ["sap.ushell.services.Extension.Item.destroy", {
            itemId: sItemId
        }];

        // Act
        await oHeaderItem.destroy();

        // Assert
        assert.deepEqual(this.oPostMessageToFLPStub.getCall(0).args, aExpectedArgs, "The postMessageToFLP was called with the correct arguments");
    });

    QUnit.test("showForCurrentApp is forwarded correctly", async function (assert) {
        // Arrange
        const sItemId = "newItem1";
        this.oPostMessageToFLPStub.resolves({ itemId: sItemId });

        const oHeaderItem = await this.Extension.createUserAction({
            icon: "sap-icon://da"
        });

        this.oPostMessageToFLPStub.resetHistory();

        const aExpectedArgs = ["sap.ushell.services.Extension.Item.showForCurrentApp", {
            itemId: sItemId
        }];

        // Act
        await oHeaderItem.showForCurrentApp();

        // Assert
        assert.deepEqual(this.oPostMessageToFLPStub.getCall(0).args, aExpectedArgs, "The postMessageToFLP was called with the correct arguments");
    });

    QUnit.test("hideForCurrentApp is forwarded correctly", async function (assert) {
        // Arrange
        const sItemId = "newItem1";
        this.oPostMessageToFLPStub.resolves({ itemId: sItemId });

        const oHeaderItem = await this.Extension.createUserAction({
            icon: "sap-icon://da"
        });

        this.oPostMessageToFLPStub.resetHistory();

        const aExpectedArgs = ["sap.ushell.services.Extension.Item.hideForCurrentApp", {
            itemId: sItemId
        }];

        // Act
        await oHeaderItem.hideForCurrentApp();

        // Assert
        assert.deepEqual(this.oPostMessageToFLPStub.getCall(0).args, aExpectedArgs, "The postMessageToFLP was called with the correct arguments");
    });

    QUnit.test("showForAllApps is forwarded correctly", async function (assert) {
        // Arrange
        const sItemId = "newItem1";
        this.oPostMessageToFLPStub.resolves({ itemId: sItemId });

        const oHeaderItem = await this.Extension.createUserAction({
            icon: "sap-icon://da"
        });

        this.oPostMessageToFLPStub.resetHistory();

        const aExpectedArgs = ["sap.ushell.services.Extension.Item.showForAllApps", {
            itemId: sItemId
        }];

        // Act
        await oHeaderItem.showForAllApps();

        // Assert
        assert.deepEqual(this.oPostMessageToFLPStub.getCall(0).args, aExpectedArgs, "The postMessageToFLP was called with the correct arguments");
    });

    QUnit.test("hideForAllApps is forwarded correctly", async function (assert) {
        // Arrange
        const sItemId = "newItem1";
        this.oPostMessageToFLPStub.resolves({ itemId: sItemId });

        const oHeaderItem = await this.Extension.createUserAction({
            icon: "sap-icon://da"
        });

        this.oPostMessageToFLPStub.resetHistory();

        const aExpectedArgs = ["sap.ushell.services.Extension.Item.hideForAllApps", {
            itemId: sItemId
        }];

        // Act
        await oHeaderItem.hideForAllApps();

        // Assert
        assert.deepEqual(this.oPostMessageToFLPStub.getCall(0).args, aExpectedArgs, "The postMessageToFLP was called with the correct arguments");
    });

    QUnit.test("showOnHome is forwarded correctly", async function (assert) {
        // Arrange
        const sItemId = "newItem1";
        this.oPostMessageToFLPStub.resolves({ itemId: sItemId });

        const oHeaderItem = await this.Extension.createUserAction({
            icon: "sap-icon://da"
        });

        this.oPostMessageToFLPStub.resetHistory();

        const aExpectedArgs = ["sap.ushell.services.Extension.Item.showOnHome", {
            itemId: sItemId
        }];

        // Act
        await oHeaderItem.showOnHome();

        // Assert
        assert.deepEqual(this.oPostMessageToFLPStub.getCall(0).args, aExpectedArgs, "The postMessageToFLP was called with the correct arguments");
    });

    QUnit.test("hideOnHome is forwarded correctly", async function (assert) {
        // Arrange
        const sItemId = "newItem1";
        this.oPostMessageToFLPStub.resolves({ itemId: sItemId });

        const oHeaderItem = await this.Extension.createUserAction({
            icon: "sap-icon://da"
        });

        this.oPostMessageToFLPStub.resetHistory();

        const aExpectedArgs = ["sap.ushell.services.Extension.Item.hideOnHome", {
            itemId: sItemId
        }];

        // Act
        await oHeaderItem.hideOnHome();

        // Assert
        assert.deepEqual(this.oPostMessageToFLPStub.getCall(0).args, aExpectedArgs, "The postMessageToFLP was called with the correct arguments");
    });

    QUnit.module("setSecondTitle", {
        beforeEach: async function () {
            this.oPostMessageToFLPStub = sandbox.stub(AppRuntimeService, "postMessageToFLP").resolves();
            this.Extension = new Extension();
        },
        afterEach: async function () {
            sandbox.restore();
        }
    });

    QUnit.test("setSecondTitle call is forwarded correctly", async function (assert) {
        // Arrange
        const aExpectedArgs = ["sap.ushell.services.Extension.setSecondTitle", {
            title: "[secondTitle]"
        }];

        // Act
        await this.Extension.setSecondTitle("[secondTitle]");

        // Assert
        assert.deepEqual(this.oPostMessageToFLPStub.getCall(0).args, aExpectedArgs, "The postMessageToFLP was called with the correct arguments");
    });

    QUnit.test("Rejects when PostMessageAPI forwards an error", async function (assert) {
        // Arrange
        this.oPostMessageToFLPStub.rejects(new Error("PostMessageAPI failed"));

        // Act
        return this.Extension.setSecondTitle("[secondTitle]")
            .catch(() => {
                // Assert
                assert.ok(true, "Promise was rejected");
            });
    });
});
