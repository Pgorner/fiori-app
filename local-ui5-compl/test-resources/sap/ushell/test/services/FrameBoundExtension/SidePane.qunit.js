// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.FrameBoundExtension.SidePane
 */
sap.ui.define([
    "sap/m/MessageToast",
    "sap/ushell/Container",
    "sap/ushell/services/FrameBoundExtension",
    "sap/ushell/state/StateManager"
], function (
    MessageToast,
    Container,
    FrameBoundExtension,
    StateManager
) {
    "use strict";

    /* global QUnit sinon */

    const sandbox = sinon.createSandbox({});
    const oMockItem = {
        id: "sidePaneContent1",
        text: "SidePaneContent Button 1",
        press: function () {
            MessageToast.show("Press SidePaneContent Button");
        },
        destroy: sandbox.stub(),
        getId: sandbox.stub().returns("sidePaneContent1")
    };
    Object.freeze(oMockItem);

    QUnit.module("SidePane", {
        afterEach: function () {
            sandbox.restore();
            StateManager.reset();
        }
    });

    QUnit.test("Gets a Side pane", async function (assert) {
        // Arrange
        sandbox.stub(Container, "getRendererInternal");
        this.oExtensionService = new FrameBoundExtension();

        // Act
        const oSidePane = await this.oExtensionService.getSidePane();
        assert.deepEqual(typeof oSidePane, "object", "get Side pane returned an object");

    });

    QUnit.module("SidePane Item create", {
        beforeEach: async function () {
            sandbox.stub(Container, "getRendererInternal");
            this.oRendererMock = {
                addSidePaneContent: sandbox.stub().callsFake((oCreateProperties) => oCreateProperties.oControlProperties),
                showLeftPaneContent: sandbox.stub(),
                hideLeftPaneContent: sandbox.stub()
            };
            Container.getRendererInternal.returns(this.oRendererMock);

            sandbox.stub(StateManager, "addManagedControl");
            sandbox.stub(StateManager, "updateManagedControl");
            sandbox.stub(StateManager, "removeManagedControl");

            this.oExtensionService = new FrameBoundExtension();

            this.oSidePane = await this.oExtensionService.getSidePane();
        },
        afterEach: function () {
            sandbox.restore();
            StateManager.reset();
        }
    });

    QUnit.test("Creates a SidePane item", async function (assert) {
        // Act
        await this.oSidePane.createItem(oMockItem, { controlType: "sap.m.Button" });
        // Assert
        const {
            oControlProperties,
            controlType
        } = this.oRendererMock.addSidePaneContent.getCall(0).args[0];

        assert.strictEqual(oControlProperties.id, "sidePaneContent1", "addSidePaneContent was called with correct ID");
        assert.strictEqual(controlType, "sap.m.Button", "addSidePaneContent was called with correct control type");

        assert.deepEqual(StateManager.removeManagedControl.getCall(0).args, ["sidePaneContent1"], "Control was reset in StateManager");
        assert.deepEqual(StateManager.addManagedControl.getCall(0).args, ["sidePaneContent1"], "Control was added correctly");
    });

    QUnit.test("Creates two SidePane items, different control types", async function (assert) {
        // Arrange
        const oMockItem2 = {
            id: "sidePaneContent2",
            text: "SidePaneContent Button 2",
            press: function () {
                MessageToast.show("Press SidePaneContent Button");
            },
            getId: sandbox.stub().returns("sidePaneContent2")
        };
        // Act
        await this.oSidePane.createItem(oMockItem, { controlType: "sap.m.Button" });
        await this.oSidePane.createItem(oMockItem2, { controlType: "sap.m.Text" });
        // Assert
        const {
            oControlProperties: oControlProperties1,
            controlType: controlType1
        } = this.oRendererMock.addSidePaneContent.getCall(0).args[0];
        assert.strictEqual(oControlProperties1.id, "sidePaneContent1", "renderer API was called with correct ID");
        assert.strictEqual(controlType1, "sap.m.Button", "renderer API was called with controlType");

        const {
            oControlProperties: oControlProperties2,
            controlType: controlType2
        } = this.oRendererMock.addSidePaneContent.getCall(1).args[0];
        assert.strictEqual(oControlProperties2.id, "sidePaneContent2", "renderer API was called with correct ID");
        assert.strictEqual(controlType2, "sap.m.Text", "renderer API was called with controlType");
    });

    QUnit.module("SidePane Operations", {
        beforeEach: async function () {
            sandbox.stub(Container, "getRendererInternal");
            this.oRendererMock = {
                addSidePaneContent: sandbox.stub().callsFake((oCreateProperties) => oCreateProperties.oControlProperties),
                showLeftPaneContent: sandbox.stub(),
                hideLeftPaneContent: sandbox.stub(),
                setLeftPaneVisibility: sandbox.stub()
            };
            Container.getRendererInternal.returns(this.oRendererMock);

            this.oExtensionService = new FrameBoundExtension();

            this.oSidePane = await this.oExtensionService.getSidePane();
            this.oSidePaneItem = await this.oSidePane.createItem(oMockItem, { controlType: "sap.m.Button" });
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
        this.oSidePane.hideForAllApps();
        // Assert
        assert.deepEqual(this.oRendererMock.setLeftPaneVisibility.getCall(0).args, aExpectedArgs, "Renderer was called correctly");
    });

    QUnit.test("hide on home", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "home",
            false
        ];
        // Act
        this.oSidePane.hideOnHome();
        // Assert
        assert.deepEqual(this.oRendererMock.setLeftPaneVisibility.getCall(0).args, aExpectedArgs, "Renderer was called correctly");
    });

    QUnit.test("show for all apps", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "app",
            true
        ];
        // Act
        this.oSidePane.showForAllApps();
        // Assert
        assert.deepEqual(this.oRendererMock.setLeftPaneVisibility.getCall(0).args, aExpectedArgs, "Renderer was called correctly");
    });

    QUnit.test("show on home", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "home",
            true
        ];
        // Act
        this.oSidePane.showOnHome();
        // Assert
        assert.deepEqual(this.oRendererMock.setLeftPaneVisibility.getCall(0).args, aExpectedArgs, "Renderer was called correctly");
    });

    QUnit.test("chaining", async function (assert) {
        // Act
        const oActualSidePane = this.oSidePane
            .hideForAllApps()
            .hideOnHome()
            .showForAllApps()
            .showOnHome();
        //Assert
        assert.strictEqual(oActualSidePane, this.oSidePane, "chaining is ok");
    });

    QUnit.module("SidePane Item Operations", {
        beforeEach: async function () {
            // Arrange
            sandbox.stub(Container, "getRendererInternal");
            this.oRendererMock = {
                addSidePaneContent: sandbox.stub().callsFake((oCreateProperties) => oCreateProperties.oControlProperties),
                showLeftPaneContent: sandbox.stub(),
                hideLeftPaneContent: sandbox.stub(),
                setLeftPaneVisibility: sandbox.stub()
            };
            Container.getRendererInternal.returns(this.oRendererMock);

            sandbox.stub(StateManager, "addManagedControl");
            sandbox.stub(StateManager, "updateManagedControl");
            sandbox.stub(StateManager, "removeManagedControl");

            this.oExtensionService = new FrameBoundExtension();

            this.oSidePane = await this.oExtensionService.getSidePane();
            this.oSidePaneItem = await this.oSidePane.createItem(
                oMockItem,
                {
                    controlType: "sap.m.Button",
                    id: "myTestButton1",
                    press: () => {
                        MessageToast.show("Press HeaderItem End Button");
                    }
                }
            );
        },
        afterEach: function () {
            sandbox.restore();
            StateManager.reset();
        }
    });

    QUnit.test("Destroys a side pane item", async function (assert) {
        // Act
        await this.oSidePaneItem.destroy();
        // Assert
        assert.deepEqual(this.oRendererMock.hideLeftPaneContent.callCount, 3, "hide was called correctly three times");
        assert.ok(oMockItem.destroy.called, "item was destroyed correctly");

    });

    QUnit.test("Gets the control of a side pane item", async function (assert) {
        // Act
        const oActualControl = await this.oSidePaneItem.getControl();
        // Assert
        assert.equal(oActualControl, oMockItem, "control was destroyed");
    });

    QUnit.test("hide for all apps", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "sidePaneContent1",
            false,
            ["app"]
        ];
        // Act
        this.oSidePaneItem.hideForAllApps();
        // Assert
        assert.deepEqual(this.oRendererMock.hideLeftPaneContent.getCall(0).args, aExpectedArgs, "Renderer was called correctly");
        assert.strictEqual(StateManager.updateManagedControl.callCount, 0, "StateManager was not called");
    });

    QUnit.test("hide for current app", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "sidePaneContent1",
            true,
            undefined
        ];
        // Act
        this.oSidePaneItem.hideForCurrentApp();
        // Assert
        assert.deepEqual(this.oRendererMock.hideLeftPaneContent.getCall(0).args, aExpectedArgs, "Renderer was called correctly");
        assert.strictEqual(StateManager.updateManagedControl.callCount, 0, "StateManager was not called");
    });

    QUnit.test("hide on home", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "sidePaneContent1",
            false,
            ["home"]
        ];
        // Act
        this.oSidePaneItem.hideOnHome();
        // Assert
        assert.deepEqual(this.oRendererMock.hideLeftPaneContent.getCall(0).args, aExpectedArgs, "Renderer was called correctly");
        assert.strictEqual(StateManager.updateManagedControl.callCount, 0, "StateManager was not called");
    });

    QUnit.test("show for all apps", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "sidePaneContent1",
            false,
            ["app"]
        ];
        // Act
        this.oSidePaneItem.showForAllApps();
        // Assert
        assert.deepEqual(this.oRendererMock.showLeftPaneContent.getCall(0).args, aExpectedArgs, "Renderer was called correctly");
        assert.deepEqual(StateManager.updateManagedControl.getCall(0).args, ["sidePaneContent1", true], "StateManager was called correctly");
    });

    QUnit.test("show for current app", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "sidePaneContent1",
            true,
            undefined
        ];
        // Act
        this.oSidePaneItem.showForCurrentApp();
        // Assert
        assert.deepEqual(this.oRendererMock.showLeftPaneContent.getCall(0).args, aExpectedArgs, "Renderer was called correctly");
        assert.strictEqual(StateManager.updateManagedControl.callCount, 0, "StateManager was not called");
    });

    QUnit.test("show on home", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "sidePaneContent1",
            false,
            ["home"]
        ];
        // Act
        const oActualHeaderEndItem = this.oSidePaneItem.showOnHome();
        // Assert
        assert.strictEqual(oActualHeaderEndItem, this.oSidePaneItem, "returned the exact same interface");
        assert.deepEqual(this.oRendererMock.showLeftPaneContent.getCall(0).args, aExpectedArgs, "Renderer was called correctly");
        assert.deepEqual(StateManager.updateManagedControl.getCall(0).args, ["sidePaneContent1", true], "StateManager was called correctly");
    });

    QUnit.test("chaining works properly", async function (assert) {
        // Act
        const oActualHeader = this.oSidePaneItem
            .hideForAllApps()
            .hideForCurrentApp()
            .showForAllApps()
            .hideOnHome()
            .showForAllApps()
            .showForCurrentApp()
            .showOnHome();
        // Assert
        assert.strictEqual(oActualHeader, this.oSidePaneItem, "chaining is ok");
    });
});
