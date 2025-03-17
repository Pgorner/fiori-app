// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.FrameBoundExtension.ToolArea
 */
sap.ui.define([
    "sap/m/MessageToast",
    "sap/ushell/Container",
    "sap/ushell/services/FrameBoundExtension",
    "sap/ushell/services/FrameBoundExtension/ToolArea",
    "sap/ushell/state/StateManager"
], function (
    MessageToast,
    Container,
    FrameBoundExtension,
    ToolArea,
    StateManager
) {
    "use strict";

    /* global QUnit, sinon */

    const sandbox = sinon.createSandbox({});
    const oMockItem1 = {
        id: "toolAreaContent1",
        text: "ToolAreaContent Button",
        press: function () {
            MessageToast.show("Press ToolAreaContent Button");
        },
        getId: sandbox.stub().returns("toolAreaContent1"),
        destroy: sandbox.stub()
    };
    Object.freeze(oMockItem1);
    const oMockItem2 = {
        id: "toolAreaContent2",
        text: "ToolAreaContent Button",
        press: function () {
            MessageToast.show("Press ToolAreaContent Button");
        },
        getId: sandbox.stub().returns("toolAreaContent2")
    };
    Object.freeze(oMockItem2);

    QUnit.module("ToolArea", {
        afterEach: function () {
            sandbox.restore();
            StateManager.reset();
        }
    });

    QUnit.test("Gets a Tool area", async function (assert) {
        // Arrange
        this.oExtensionService = new FrameBoundExtension();
        sandbox.stub(Container, "getRendererInternal");
        // Act
        const oToolArea = await this.oExtensionService.getToolArea();
        //Assert
        assert.ok(oToolArea instanceof ToolArea, "get Tool area returned a suitable object");

    });

    QUnit.module("ToolAreaItem Creation", {
        beforeEach: async function () {
            sandbox.stub(Container, "getRendererInternal");
            this.oRendererMock = {
                addToolAreaItem: sandbox.stub().returnsArg(0),
                showToolAreaItem: sandbox.stub(),
                removeToolAreaItem: sandbox.stub()
            };
            Container.getRendererInternal.returns(this.oRendererMock);

            sandbox.stub(StateManager, "addManagedControl");
            sandbox.stub(StateManager, "updateManagedControl");
            sandbox.stub(StateManager, "removeManagedControl");

            this.oExtensionService = new FrameBoundExtension();

            this.oToolArea = await this.oExtensionService.getToolArea();
        },
        afterEach: function () {
            sandbox.restore();
            StateManager.reset();
        }
    });

    QUnit.test("Destroys a Tool area tem", async function (assert) {
        // Arrange
        const oToolAreaItem = await this.oToolArea.createItem(oMockItem1);
        // Act
        await oToolAreaItem.destroy();
        // Assert
        assert.deepEqual(this.oRendererMock.removeToolAreaItem.callCount, 3, "hide was called correctly three times");
        assert.ok(oMockItem1.destroy.called, "item was destroyed correctly");
    });

    QUnit.test("Creates a Tool area item", async function (assert) {
        // Act
        await this.oToolArea.createItem(oMockItem1);
        // Assert
        assert.strictEqual(this.oRendererMock.addToolAreaItem.getCall(0).args[0], oMockItem1, "addToolAreaContent was called with correct mock item");

        assert.deepEqual(StateManager.removeManagedControl.getCall(0).args, ["toolAreaContent1"], "Control was reset in StateManager");
        assert.deepEqual(StateManager.addManagedControl.getCall(0).args, ["toolAreaContent1"], "Control was added correctly");
    });

    QUnit.test("Creates 2 Tool area items", async function (assert) {
        // Act
        await this.oToolArea.createItem(oMockItem1);
        await this.oToolArea.createItem(oMockItem2);
        // Assert
        assert.deepEqual(this.oRendererMock.addToolAreaItem.getCall(0).args[0], oMockItem1, "addToolAreaContent was called with correct mock item");
        // Assert
        assert.deepEqual(this.oRendererMock.addToolAreaItem.getCall(1).args[0], oMockItem2, "addToolAreaContent was again called with correct mock item");
    });

    QUnit.module("Tool Area Operations", {
        beforeEach: async function () {
            sandbox.stub(Container, "getRendererInternal");
            this.oRendererMock = {
                showToolArea: sandbox.stub(),
                addToolAreaItem: sandbox.stub().returnsArg(0),
                showToolAreaItem: sandbox.stub(),
                removeToolAreaItem: sandbox.stub()
            };
            Container.getRendererInternal.returns(this.oRendererMock);

            this.oExtensionService = new FrameBoundExtension();

            this.oToolArea = await this.oExtensionService.getToolArea();
            await this.oToolArea.createItem(oMockItem1, { controlType: "sap.m.Button" });
        },
        afterEach: function () {
            sandbox.restore();
            StateManager.reset();
        }
    });

    QUnit.test("hide for all apps", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "app",
            false
        ];
        // Act
        await this.oToolArea.hideForAllApps();
        // Assert
        assert.deepEqual(this.oRendererMock.showToolArea.getCall(0).args, aExpectedArgs, "Renderer was called correctly");
    });

    QUnit.test("hide on home", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "home",
            false
        ];
        // Act
        await this.oToolArea.hideOnHome();
        // Assert
        assert.deepEqual(this.oRendererMock.showToolArea.getCall(0).args, aExpectedArgs, "Renderer was called correctly");
    });

    QUnit.test("show for all apps", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "app",
            true
        ];
        // Act
        await this.oToolArea.showForAllApps();
        // Assert
        assert.deepEqual(this.oRendererMock.showToolArea.getCall(0).args, aExpectedArgs, "Renderer was called correctly");
    });

    QUnit.test("hide for all apps", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "app",
            false
        ];
        // Act
        await this.oToolArea.hideForAllApps();
        // Assert
        assert.deepEqual(this.oRendererMock.showToolArea.getCall(0).args, aExpectedArgs, "Renderer was called correctly");
    });

    QUnit.test("chaining", async function (assert) {
        // Act
        const oActualToolArea = this.oToolArea
            .hideForAllApps()
            .hideOnHome()
            .showForAllApps()
            .showOnHome();
        // Assert
        assert.strictEqual(oActualToolArea, this.oToolArea, "chaining is ok");
    });

    QUnit.module("ToolAreaItem Operations", {
        beforeEach: async function () {
            sandbox.stub(Container, "getRendererInternal");
            this.oRendererMock = {
                addToolAreaItem: sandbox.stub().returnsArg(0),
                showToolAreaItem: sandbox.stub(),
                showToolArea: sandbox.stub(),
                removeToolAreaItem: sandbox.stub()
            };
            Container.getRendererInternal.returns(this.oRendererMock);

            sandbox.stub(StateManager, "addManagedControl");
            sandbox.stub(StateManager, "updateManagedControl");
            sandbox.stub(StateManager, "removeManagedControl");

            this.oExtensionService = new FrameBoundExtension();

            this.oToolArea = await this.oExtensionService.getToolArea();
            this.oToolAreaItem = await this.oToolArea.createItem(oMockItem1);
        },
        afterEach: function () {
            sandbox.restore();
            StateManager.reset();
        }
    });

    QUnit.test("hide for all apps", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "toolAreaContent1",
            false,
            ["app"]
        ];
        // Act
        await this.oToolAreaItem.hideForAllApps();
        // Assert
        assert.deepEqual(this.oRendererMock.removeToolAreaItem.getCall(0).args, aExpectedArgs, "Renderer was called correctly");
        assert.strictEqual(StateManager.updateManagedControl.callCount, 0, "StateManager was not called");
    });

    QUnit.test("hide for current app", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "toolAreaContent1",
            true,
            undefined
        ];
        // Act
        await this.oToolAreaItem.hideForCurrentApp();
        // Assert
        assert.deepEqual(this.oRendererMock.removeToolAreaItem.getCall(0).args, aExpectedArgs, "Renderer was called correctly");
        assert.strictEqual(StateManager.updateManagedControl.callCount, 0, "StateManager was not called");
    });

    QUnit.test("hide on home", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "toolAreaContent1",
            false,
            ["home"]
        ];
        // Act
        await this.oToolAreaItem.hideOnHome();
        // Assert
        assert.deepEqual(this.oRendererMock.removeToolAreaItem.getCall(0).args, aExpectedArgs, "Renderer was called correctly");
        assert.strictEqual(StateManager.updateManagedControl.callCount, 0, "StateManager was not called");
    });

    QUnit.test("show for all apps", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "toolAreaContent1",
            false,
            ["app"]
        ];
        // Act
        await this.oToolAreaItem.showForAllApps();
        // Assert
        assert.deepEqual(this.oRendererMock.showToolAreaItem.getCall(0).args, aExpectedArgs, "Renderer was called correctly");
        assert.deepEqual(StateManager.updateManagedControl.getCall(0).args, ["toolAreaContent1", true], "StateManager was called correctly");
    });

    QUnit.test("show for current app", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "toolAreaContent1",
            true,
            undefined
        ];
        // Act
        await this.oToolAreaItem.showForCurrentApp();
        // Assert
        assert.deepEqual(this.oRendererMock.showToolAreaItem.getCall(0).args, aExpectedArgs, "Renderer was called correctly");
        assert.strictEqual(StateManager.updateManagedControl.callCount, 0, "StateManager was not called");
    });

    QUnit.test("show on home", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "toolAreaContent1",
            false,
            ["home"]
        ];
        // Act
        await this.oToolAreaItem.showOnHome();
        // Assert
        assert.deepEqual(this.oRendererMock.showToolAreaItem.getCall(0).args, aExpectedArgs, "Renderer was called correctly");
        assert.deepEqual(StateManager.updateManagedControl.getCall(0).args, ["toolAreaContent1", true], "StateManager was called correctly");
    });

    QUnit.test("chaining", async function (assert) {
        // Act
        const oActualToolAreaItem = this.oToolAreaItem
            .hideForAllApps()
            .hideForCurrentApp()
            .hideOnHome()
            .showForAllApps()
            .showForCurrentApp()
            .showOnHome();
        // Assert
        assert.strictEqual(oActualToolAreaItem, this.oToolAreaItem, "chaining is ok");
    });
});
