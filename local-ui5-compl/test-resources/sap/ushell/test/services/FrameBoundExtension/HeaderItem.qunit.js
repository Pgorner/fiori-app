// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.FrameBoundExtension.HeaderItem
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

    /* global QUnit, sinon */

    const sandbox = sinon.createSandbox({});

    QUnit.module("Header Begin Item", {
        beforeEach: function () {
            sandbox.stub(Container, "getRendererInternal");
            this.oRendererMock = {
                addHeaderItem: sandbox.stub().returnsArg(0),
                showHeaderItem: sandbox.stub(),
                hideHeaderItem: sandbox.stub()
            };
            Container.getRendererInternal.returns(this.oRendererMock);

            sandbox.stub(StateManager, "addManagedControl");
            sandbox.stub(StateManager, "updateManagedControl");
            sandbox.stub(StateManager, "removeManagedControl");

            this.oExtensionService = new FrameBoundExtension();
        },
        afterEach: function () {
            sandbox.restore();
            StateManager.reset();
        }
    });

    QUnit.test("Adds a button to the Header at the begin position", async function (assert) {
        // Arrange
        const oMockItem = {
            id: "myTestButton1",
            getId: sandbox.stub().returns("myTestButton1"),
            text: "myBeginButton",
            press: () => {
                MessageToast.show("Press HeaderItem Begin Button");
            }
        };
        // Act
        await this.oExtensionService.createHeaderItem(
            oMockItem,
            {
                position: "begin"
            }
        );
        // Assert
        assert.deepEqual(this.oRendererMock.addHeaderItem.getCall(0).args[0].id, "myTestButton1", "addHeaderItem was called with correct ID");
        assert.deepEqual(this.oRendererMock.addHeaderItem.getCall(0).args.slice(1), [false, undefined, undefined], "addHeaderItem was called correctly");

        assert.deepEqual(StateManager.removeManagedControl.getCall(0).args, ["myTestButton1"], "Control was reset in StateManager");
        assert.deepEqual(StateManager.addManagedControl.getCall(0).args, ["myTestButton1"], "Control was added correctly");
    });

    QUnit.module("Header End Item", {
        beforeEach: function () {
            sandbox.stub(Container, "getRendererInternal");
            this.oRendererMock = {
                addHeaderEndItem: sandbox.stub().returnsArg(0),
                showHeaderEndItem: sandbox.stub(),
                hideHeaderEndItem: sandbox.stub()
            };
            Container.getRendererInternal.returns(this.oRendererMock);

            sandbox.stub(StateManager, "addManagedControl");
            sandbox.stub(StateManager, "updateManagedControl");
            sandbox.stub(StateManager, "removeManagedControl");

            this.oExtensionService = new FrameBoundExtension();
        },
        afterEach: function () {
            sandbox.restore();
            StateManager.reset();
        }
    });

    QUnit.test("Adds a button to the Header at the end position", async function (assert) {
        // Arrange
        const oMockItem = {
            id: "myTestButton1",
            getId: sandbox.stub().returns("myTestButton1"),
            press: () => {
                MessageToast.show("Press HeaderItem End Button");
            }
        };
        // Act
        await this.oExtensionService.createHeaderItem(
            oMockItem,
            {
                position: "end"
            }
        );
        // Assert
        assert.deepEqual(this.oRendererMock.addHeaderEndItem.getCall(0).args[0].id, "myTestButton1", "addHeaderItem was called with correct ID");
        assert.deepEqual(this.oRendererMock.addHeaderEndItem.getCall(0).args[0], oMockItem, "addHeaderItem was called with correct item");
        assert.deepEqual(this.oRendererMock.addHeaderEndItem.getCall(0).args.slice(1), [false, undefined, undefined], "addHeaderItem was called correctly");

        assert.deepEqual(StateManager.removeManagedControl.getCall(0).args, ["myTestButton1"], "Control was reset in StateManager");
        assert.deepEqual(StateManager.addManagedControl.getCall(0).args, ["myTestButton1"], "Control was added correctly");
    });

    QUnit.test("Adds a button to the Header at the default position", async function (assert) {
        // Arrange
        const oMockItem = {
            id: "myTestButton1",
            getId: sandbox.stub().returns("myTestButton1"),
            press: () => {
                MessageToast.show("Press HeaderItem End Button");
            }
        };
        // Act
        await this.oExtensionService.createHeaderItem(
            oMockItem
        );
        // Assert
        assert.deepEqual(this.oRendererMock.addHeaderEndItem.called, true, "addHeaderItem was called with position end");
    });

    QUnit.test("Adds 2 buttons to the Header at the end position", async function (assert) {
        // Arrange
        const oMockItem = {
            id: "myTestButton1",
            getId: sandbox.stub().returns("myTestButton1"),
            press: () => {
                MessageToast.show("Press HeaderItem End Button");
            }
        };
        const oMockItem2 = {
            id: "myTestButton2",
            getId: sandbox.stub().returns("myTestButton2"),
            press: () => {
                MessageToast.show("Press HeaderItem End Button 2");
            }
        };
        // Act
        await this.oExtensionService.createHeaderItem(
            oMockItem,
            {
                position: "end"
            }
        );
        await this.oExtensionService.createHeaderItem(
            oMockItem2,
            {
                position: "end"
            }
        );
        // Assert
        assert.deepEqual(this.oRendererMock.addHeaderEndItem.getCall(1).args[0].id, "myTestButton2", "addHeaderItem was called with correct ID");
        assert.deepEqual(this.oRendererMock.addHeaderEndItem.getCall(1).args.slice(1), [false, undefined, undefined], "addHeaderItem was called correctly");

    });

    QUnit.module("Operations on Header Begin Item", {
        beforeEach: async function () {
            sandbox.stub(Container, "getRendererInternal");
            this.oRendererMock = {
                addHeaderItem: sandbox.stub().returnsArg(0),
                showHeaderItem: sandbox.stub(),
                hideHeaderItem: sandbox.stub()
            };
            Container.getRendererInternal.returns(this.oRendererMock);

            sandbox.stub(StateManager, "addManagedControl");
            sandbox.stub(StateManager, "updateManagedControl");
            sandbox.stub(StateManager, "removeManagedControl");

            this.oExtensionService = new FrameBoundExtension();

            this.oMockItem = {
                getId: sandbox.stub().returns("myTestButton1"),
                destroy: sandbox.stub(),
                id: "myTestButton1",
                ariaLabel: "ariaLabel",
                ariaHaspopup: "dialog",
                icon: "sap-icon://Action-settings",
                tooltip: "tooltip-begin",
                text: "myBeginButton",
                press: () => {
                    MessageToast.show("Press HeaderBeginItem Button");
                }
            };
            // Act
            this.oHeaderBeginItem = await this.oExtensionService.createHeaderItem(
                this.oMockItem,
                {
                    position: "begin"
                }
            );
        },
        afterEach: function () {
            sandbox.restore();
            StateManager.reset();
        }
    });

    QUnit.test("Destroys a header begin item", async function (assert) {
        // Act
        await this.oHeaderBeginItem.destroy();
        // Assert
        assert.deepEqual(this.oRendererMock.hideHeaderItem.callCount, 3, "hide was called correctly three times");
        assert.ok(this.oMockItem.destroy.called, "item was destroyed correctly");
    });

    QUnit.test("Gets the control of a header item", async function (assert) {
        // Act
        const oActualControl = await this.oHeaderBeginItem.getControl();
        // Assert
        assert.strictEqual(oActualControl, this.oMockItem, "control was received");
    });

    QUnit.test("hide for all apps", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "myTestButton1",
            false,
            ["app"]
        ];
        // Act
        this.oHeaderBeginItem.hideForAllApps();
        // Assert
        assert.deepEqual(this.oRendererMock.hideHeaderItem.getCall(0).args, aExpectedArgs, "Renderer was called correctly");
        assert.strictEqual(StateManager.updateManagedControl.callCount, 0, "StateManager was not called");
    });

    QUnit.test("hide for current app", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "myTestButton1",
            true,
            undefined
        ];
        // Act
        this.oHeaderBeginItem.hideForCurrentApp();
        // Assert
        assert.deepEqual(this.oRendererMock.hideHeaderItem.getCall(0).args, aExpectedArgs, "Renderer was called correctly");
        assert.strictEqual(StateManager.updateManagedControl.callCount, 0, "StateManager was not called");
    });

    QUnit.test("hide on home", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "myTestButton1",
            false,
            ["home"]
        ];
        // Act
        this.oHeaderBeginItem.hideOnHome();
        // Assert
        assert.deepEqual(this.oRendererMock.hideHeaderItem.getCall(0).args, aExpectedArgs, "Renderer was called correctly");
        assert.strictEqual(StateManager.updateManagedControl.callCount, 0, "StateManager was not called");
    });

    QUnit.test("show for all apps", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "myTestButton1",
            false,
            ["app"]
        ];
        // Act
        this.oHeaderBeginItem.showForAllApps();
        // Assert
        assert.deepEqual(this.oRendererMock.showHeaderItem.getCall(0).args, aExpectedArgs, "Renderer was called correctly");
        assert.deepEqual(StateManager.updateManagedControl.getCall(0).args, ["myTestButton1", true], "StateManager was called correctly");
    });

    QUnit.test("show for current app", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "myTestButton1",
            true,
            undefined
        ];
        // Act
        this.oHeaderBeginItem.showForCurrentApp();
        // Assert
        assert.deepEqual(this.oRendererMock.showHeaderItem.getCall(0).args, aExpectedArgs, "Renderer was called correctly");
        assert.strictEqual(StateManager.updateManagedControl.callCount, 0, "StateManager was not called");
    });

    QUnit.test("show on home", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "myTestButton1",
            false,
            ["home"]
        ];
        // Act
        const oActualHeaderItem = this.oHeaderBeginItem.showOnHome();
        // Assert
        assert.deepEqual(this.oRendererMock.showHeaderItem.getCall(0).args, aExpectedArgs, "Renderer was called correctly");
        assert.strictEqual(oActualHeaderItem, this.oHeaderBeginItem, "returned the exact same interface");
        assert.deepEqual(StateManager.updateManagedControl.getCall(0).args, ["myTestButton1", true], "StateManager was called correctly");
    });

    QUnit.test("chaining works properly", async function (assert) {
        // Act
        const oActualHeader = this.oHeaderBeginItem
            .hideForAllApps()
            .hideForCurrentApp()
            .showForAllApps()
            .hideOnHome()
            .showForAllApps()
            .showForCurrentApp()
            .showOnHome();
        // Assert
        assert.strictEqual(oActualHeader, this.oHeaderBeginItem, "chaining is ok");
    });

    QUnit.module("Operations on Header End Item", {
        beforeEach: async function () {
            sandbox.stub(Container, "getRendererInternal");
            this.oRendererMock = {
                addHeaderEndItem: sandbox.stub().returnsArg(0),
                showHeaderEndItem: sandbox.stub(),
                hideHeaderEndItem: sandbox.stub()
            };
            Container.getRendererInternal.returns(this.oRendererMock);

            sandbox.stub(StateManager, "addManagedControl");
            sandbox.stub(StateManager, "updateManagedControl");
            sandbox.stub(StateManager, "removeManagedControl");

            this.oExtensionService = new FrameBoundExtension();

            this.oMockItem = {
                getId: sandbox.stub().returns("myTestButton1"),
                destroy: sandbox.stub(),
                id: "myTestButton1",
                ariaLabel: "ariaLabel",
                ariaHaspopup: "dialog",
                icon: "sap-icon://Action-settings",
                tooltip: "tooltip-end",
                text: "myEndButton",
                press: () => {
                    MessageToast.show("Press HeaderEndItem Button");
                }
            };
            // Act
            this.oHeaderEndItem = await this.oExtensionService.createHeaderItem(
                this.oMockItem,
                {
                    position: "end"
                });
        },
        afterEach: function () {
            sandbox.restore();
            StateManager.reset();
        }
    });

    QUnit.test("Destroys a header item", async function (assert) {
        // Act
        await this.oHeaderEndItem.destroy();
        // Assert
        assert.deepEqual(this.oRendererMock.hideHeaderEndItem.callCount, 3, "hide was called correctly three times");
        assert.ok(this.oMockItem.destroy.called, "item was destroyed correctly");
    });

    QUnit.test("Gets the control of a header item", async function (assert) {
        // Act
        const oActualControl = await this.oHeaderEndItem.getControl();
        // Assert
        assert.equal(oActualControl, this.oMockItem, "control was received");
    });

    QUnit.test("hide for all apps", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "myTestButton1",
            false,
            ["app"]
        ];
        // Act
        this.oHeaderEndItem.hideForAllApps();
        // Assert
        assert.deepEqual(this.oRendererMock.hideHeaderEndItem.getCall(0).args, aExpectedArgs, "Renderer was called correctly");
        assert.strictEqual(StateManager.updateManagedControl.callCount, 0, "StateManager was not called");
    });

    QUnit.test("hide for current app", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "myTestButton1",
            true,
            undefined
        ];
        // Act
        this.oHeaderEndItem.hideForCurrentApp();
        // Assert
        assert.deepEqual(this.oRendererMock.hideHeaderEndItem.getCall(0).args, aExpectedArgs, "Renderer was called correctly");
        assert.strictEqual(StateManager.updateManagedControl.callCount, 0, "StateManager was not called");
    });

    QUnit.test("hide on home", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "myTestButton1",
            false,
            ["home"]
        ];
        // Act
        this.oHeaderEndItem.hideOnHome();
        // Assert
        assert.deepEqual(this.oRendererMock.hideHeaderEndItem.getCall(0).args, aExpectedArgs, "Renderer was called correctly");
        assert.strictEqual(StateManager.updateManagedControl.callCount, 0, "StateManager was not called");
    });

    QUnit.test("show for all apps", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "myTestButton1",
            false,
            ["app"]
        ];
        // Act
        this.oHeaderEndItem.showForAllApps();
        // Assert
        assert.deepEqual(this.oRendererMock.showHeaderEndItem.getCall(0).args, aExpectedArgs, "Renderer was called correctly");
        assert.deepEqual(StateManager.updateManagedControl.getCall(0).args, ["myTestButton1", true], "StateManager was called correctly");
    });

    QUnit.test("show for current app", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "myTestButton1",
            true,
            undefined
        ];
        // Act
        this.oHeaderEndItem.showForCurrentApp();
        // Assert
        assert.deepEqual(this.oRendererMock.showHeaderEndItem.getCall(0).args, aExpectedArgs, "Renderer was called correctly");
        assert.strictEqual(StateManager.updateManagedControl.callCount, 0, "StateManager was not called");
    });

    QUnit.test("show on home", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "myTestButton1",
            false,
            ["home"]
        ];
        // Act
        const oActualHeaderEndItem = this.oHeaderEndItem.showOnHome();
        // Assert
        assert.deepEqual(this.oRendererMock.showHeaderEndItem.getCall(0).args, aExpectedArgs, "Renderer was called correctly");
        assert.strictEqual(oActualHeaderEndItem, this.oHeaderEndItem, "returned the exact same interface");
        assert.deepEqual(StateManager.updateManagedControl.getCall(0).args, ["myTestButton1", true], "StateManager was called correctly");
    });

    QUnit.test("chaining works properly", async function (assert) {
        // Act
        const oActualHeader = this.oHeaderEndItem
            .hideForAllApps()
            .hideForCurrentApp()
            .showForAllApps()
            .hideOnHome()
            .showForAllApps()
            .showForCurrentApp()
            .showOnHome();
        // Assert
        assert.strictEqual(oActualHeader, this.oHeaderEndItem, "chaining is ok");
    });
});
