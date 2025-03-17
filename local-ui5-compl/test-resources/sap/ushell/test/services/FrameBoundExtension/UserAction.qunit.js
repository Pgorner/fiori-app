// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.FrameBoundExtension.UserAction
 */
sap.ui.define([
    "sap/ushell/Container",
    "sap/ushell/services/FrameBoundExtension",
    "sap/ushell/services/FrameBoundExtension/Item",
    "sap/ushell/state/StateManager"
], function (
    Container,
    FrameBoundExtension,
    ExtensionItem,
    StateManager
) {
    "use strict";

    /* global QUnit, sinon */

    const sandbox = sinon.createSandbox({});

    QUnit.module("createUserAction", {
        beforeEach: async function () {
            this.oExtensionService = new FrameBoundExtension();
            this.oUserActionControlMock = {
                getId: sandbox.stub().returns("myButtonId")
            };

            this.oRendererMock = {
                addUserAction: sandbox.stub().returns(this.oUserActionControlMock),
                showActionButton: sandbox.stub(),
                hideActionButton: sandbox.stub()
            };
            sandbox.stub(Container, "getRendererInternal").returns(this.oRendererMock);

            sandbox.stub(StateManager, "addManagedControl");
            sandbox.stub(StateManager, "updateManagedControl");
            sandbox.stub(StateManager, "removeManagedControl");
        },
        afterEach: function () {
            sandbox.restore();
            StateManager.reset();
        }
    });

    QUnit.test("Adds new UserActions by default as sap.m.Button", async function (assert) {
        // Arrange
        const aExpectedArgs = [{
            controlType: "sap.m.Button",
            oControlProperties: {
                id: "myButtonId",
                text: "My Button Text"
            },
            bIsVisible: false,
            bCurrentState: undefined,
            aStates: undefined
        }];

        // Act
        const oUserAction = await this.oExtensionService.createUserAction({
            id: "myButtonId",
            text: "My Button Text"
        });

        // Assert
        assert.ok(oUserAction instanceof ExtensionItem, "Returned an Extension Item");
        assert.deepEqual(this.oRendererMock.addUserAction.getCall(0).args, aExpectedArgs, "Called the Renderer with correct args");

        assert.deepEqual(StateManager.removeManagedControl.getCall(0).args, ["myButtonId"], "Control was reset in StateManager");
        assert.deepEqual(StateManager.addManagedControl.getCall(0).args, ["myButtonId"], "Control was added correctly");
    });

    QUnit.test("Adds new UserActions with custom control types", async function (assert) {
        // Arrange
        const aExpectedArgs = [{
            controlType: "my.special.control",
            oControlProperties: {
                id: "myButtonId",
                text: "My Button Text"
            },
            bIsVisible: false,
            bCurrentState: undefined,
            aStates: undefined
        }];

        // Act
        const oUserAction = await this.oExtensionService.createUserAction({
            id: "myButtonId",
            text: "My Button Text"
        }, {
            controlType: "my.special.control"
        });

        // Assert
        assert.ok(oUserAction instanceof ExtensionItem, "Returned an Extension Item");
        assert.deepEqual(this.oRendererMock.addUserAction.getCall(0).args, aExpectedArgs, "Called the Renderer with correct args");
    });

    QUnit.module("getControl", {
        beforeEach: async function () {
            const oExtensionService = new FrameBoundExtension();
            this.oUserActionControlMock = {
                getId: sandbox.stub().returns("myButtonId")
            };

            this.oRendererMock = {
                addUserAction: sandbox.stub().returns(this.oUserActionControlMock),
                showActionButton: sandbox.stub(),
                hideActionButton: sandbox.stub()
            };
            sandbox.stub(Container, "getRendererInternal").returns(this.oRendererMock);

            this.oUserAction = await oExtensionService.createUserAction({
                id: "myButtonId",
                text: "My Button Text"
            });
        },
        afterEach: async function () {
            sandbox.restore();
            StateManager.reset();
        }
    });

    QUnit.test("Resolves the control", async function (assert) {
        // Act
        const oControl = await this.oUserAction.getControl();
        // Assert
        assert.strictEqual(oControl, this.oUserActionControlMock, "Resolved the correct control");
    });

    QUnit.module("Visibility handling", {
        beforeEach: async function () {
            const oExtensionService = new FrameBoundExtension();
            this.oUserActionControlMock = {
                getId: sandbox.stub().returns("myButtonId")
            };

            this.oRendererMock = {
                addUserAction: sandbox.stub().returns(this.oUserActionControlMock),
                showActionButton: sandbox.stub(),
                hideActionButton: sandbox.stub()
            };
            sandbox.stub(Container, "getRendererInternal").returns(this.oRendererMock);

            sandbox.stub(StateManager, "addManagedControl");
            sandbox.stub(StateManager, "updateManagedControl");
            sandbox.stub(StateManager, "removeManagedControl");

            this.oUserAction = await oExtensionService.createUserAction({
                id: "myButtonId",
                text: "My Button Text"
            });
        },
        afterEach: async function () {
            sandbox.restore();
            StateManager.reset();
        }
    });

    QUnit.test("showForCurrentApp sets the visibility via the renderer", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "myButtonId",
            true,
            undefined
        ];
        // Act
        const oReturnValue = this.oUserAction.showForCurrentApp();
        // Assert
        assert.strictEqual(oReturnValue, this.oUserAction, "Returned itself to allow chaining");
        assert.deepEqual(this.oRendererMock.showActionButton.getCall(0).args, aExpectedArgs, "Called the renderer with correct args");
        assert.strictEqual(StateManager.updateManagedControl.callCount, 0, "StateManager was not called");
    });

    QUnit.test("hideForCurrentApp sets the visibility via the renderer", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "myButtonId",
            true,
            undefined
        ];
        // Act
        const oReturnValue = this.oUserAction.hideForCurrentApp();
        // Assert
        assert.strictEqual(oReturnValue, this.oUserAction, "Returned itself to allow chaining");
        assert.deepEqual(this.oRendererMock.hideActionButton.getCall(0).args, aExpectedArgs, "Called the renderer with correct args");
        assert.strictEqual(StateManager.updateManagedControl.callCount, 0, "StateManager was not called");
    });

    QUnit.test("showForAllApps sets the visibility via the renderer", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "myButtonId",
            false,
            ["app"]
        ];
        // Act
        const oReturnValue = this.oUserAction.showForAllApps();
        // Assert
        assert.strictEqual(oReturnValue, this.oUserAction, "Returned itself to allow chaining");
        assert.deepEqual(this.oRendererMock.showActionButton.getCall(0).args, aExpectedArgs, "Called the renderer with correct args");
        assert.deepEqual(StateManager.updateManagedControl.getCall(0).args, ["myButtonId", true], "StateManager was called correctly");
    });

    QUnit.test("hideForAllApps sets the visibility via the renderer", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "myButtonId",
            false,
            ["app"]
        ];
        // Act
        const oReturnValue = this.oUserAction.hideForAllApps();
        // Assert
        assert.strictEqual(oReturnValue, this.oUserAction, "Returned itself to allow chaining");
        assert.deepEqual(this.oRendererMock.hideActionButton.getCall(0).args, aExpectedArgs, "Called the renderer with correct args");
        assert.strictEqual(StateManager.updateManagedControl.callCount, 0, "StateManager was not called");
    });

    QUnit.test("showOnHome sets the visibility via the renderer", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "myButtonId",
            false,
            ["home"]
        ];
        // Act
        const oReturnValue = this.oUserAction.showOnHome();
        // Assert
        assert.strictEqual(oReturnValue, this.oUserAction, "Returned itself to allow chaining");
        assert.deepEqual(this.oRendererMock.showActionButton.getCall(0).args, aExpectedArgs, "Called the renderer with correct args");
        assert.deepEqual(StateManager.updateManagedControl.getCall(0).args, ["myButtonId", true], "StateManager was called correctly");
    });

    QUnit.test("hideOnHome sets the visibility via the renderer", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "myButtonId",
            false,
            ["home"]
        ];
        // Act
        const oReturnValue = this.oUserAction.hideOnHome();
        // Assert
        assert.strictEqual(oReturnValue, this.oUserAction, "Returned itself to allow chaining");
        assert.deepEqual(this.oRendererMock.hideActionButton.getCall(0).args, aExpectedArgs, "Called the renderer with correct args");
        assert.strictEqual(StateManager.updateManagedControl.callCount, 0, "StateManager was not called");
    });

    QUnit.module("destroy", {
        beforeEach: async function () {
            const oExtensionService = new FrameBoundExtension();
            this.oUserActionControlMock = {
                getId: sandbox.stub().returns("myButtonId"),
                destroy: sandbox.stub()
            };

            this.oRendererMock = {
                addUserAction: sandbox.stub().returns(this.oUserActionControlMock),
                showActionButton: sandbox.stub(),
                hideActionButton: sandbox.stub()
            };
            sandbox.stub(Container, "getRendererInternal").returns(this.oRendererMock);

            this.oUserAction = await oExtensionService.createUserAction({
                id: "myButtonId",
                text: "My Button Text"
            });
        },
        afterEach: async function () {
            sandbox.restore();
            StateManager.reset();
        }
    });

    QUnit.test("Destroys the control", async function (assert) {
        // Act
        await this.oUserAction.destroy();
        // Assert
        assert.strictEqual(this.oUserActionControlMock.destroy.callCount, 1, "control was destroyed");
    });

    QUnit.test("Hides the UserAction for all states", async function (assert) {
        // Arrange
        const aHomeArgs = [
            "myButtonId",
            false,
            ["home"]
        ];
        const aAllAppsArgs = [
            "myButtonId",
            false,
            ["app"]
        ];
        const aCurrentAppsArgs = [
            "myButtonId",
            true,
            undefined
        ];
        // Act
        await this.oUserAction.destroy();
        // Assert
        assert.deepEqual(this.oRendererMock.hideActionButton.withArgs(...aHomeArgs).callCount, 1, "Called the renderer with correct args");
        assert.deepEqual(this.oRendererMock.hideActionButton.withArgs(...aAllAppsArgs).callCount, 1, "Called the renderer with correct args");
        assert.deepEqual(this.oRendererMock.hideActionButton.withArgs(...aCurrentAppsArgs).callCount, 1, "Called the renderer with correct args");
    });
});
