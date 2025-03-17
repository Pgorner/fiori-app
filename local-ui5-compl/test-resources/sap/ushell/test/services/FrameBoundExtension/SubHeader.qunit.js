// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.FrameBoundExtension.SubHeader
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

    const oMockItem1 = {
        getId: sandbox.stub().returns("testButton1"),
        id: "testButton1",
        text: "Test Button 1",
        press: () => {
            MessageToast.show("Press Sub SubHeader Middle Button");
        }
    };
    Object.freeze(oMockItem1);

    QUnit.module("SubHeader Content", {
        beforeEach: function () {
            sandbox.stub(Container, "getRendererInternal");
            this.oRendererMock = {
                addShellSubHeader: sandbox.stub().callsFake((oCreateProperties) => oCreateProperties.oControlProperties),
                showSubHeader: sandbox.stub(),
                hideSubHeader: sandbox.stub()
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

    QUnit.test("Adds a button as a SubHeader", async function (assert) {
        // Act
        const oMockControlProperties = {
            id: "SubHeader1",
            text: "button as a subheader",
            getId: sandbox.stub().returns("SubHeader1")
        };
        await this.oExtensionService.createSubHeader(
            oMockControlProperties,
            {
                controlType: "sap.m.Button"
            }
        );
        // Assert
        const {
            controlType,
            oControlProperties
        } = this.oRendererMock.addShellSubHeader.getCall(0).args[0];

        assert.deepEqual(controlType, "sap.m.Button", "addShellSubSubHeader was called with correct control type");
        assert.deepEqual(oControlProperties, oMockControlProperties, "renderer API was called with correct control properties");

        assert.deepEqual(StateManager.removeManagedControl.getCall(0).args, ["SubHeader1"], "Control was reset in StateManager");
        assert.deepEqual(StateManager.addManagedControl.getCall(0).args, ["SubHeader1"], "Control was added correctly");
    });

    QUnit.test("Adds a text as a SubHeader", async function (assert) {
        // Act
        const oMockControlProperties = {
            id: "SubHeader1",
            text: "button as a subheader",
            getId: sandbox.stub().returns("SubHeader1")
        };
        await this.oExtensionService.createSubHeader(
            oMockControlProperties,
            {
                controlType: "sap.m.Text"
            }
        );
        // Assert
        const {
            controlType,
            oControlProperties
        } = this.oRendererMock.addShellSubHeader.getCall(0).args[0];

        assert.deepEqual(controlType, "sap.m.Text", "addShellSubSubHeader was called with correct control type");
        assert.deepEqual(oControlProperties, oMockControlProperties, "renderer API was called with correct control properties");
    });

    QUnit.test("Adds a button to the SubHeader at the left content", async function (assert) {
        // Act
        await this.oExtensionService.createSubHeader({
            id: "SubHeader1",
            contentLeft: [oMockItem1],
            getId: sandbox.stub().returns("SubHeader1")
        });
        // Assert
        const {
            controlType,
            oControlProperties
        } = this.oRendererMock.addShellSubHeader.getCall(0).args[0];

        assert.deepEqual(controlType, "sap.m.Bar", "renderer API was called with correct control type");
        assert.deepEqual(oControlProperties.contentLeft[0], oMockItem1, "renderer API was called with correct control of content left");
    });

    QUnit.test("Adds a button to the SubHeader at the middle and right content", async function (assert) {
        // Arrange
        const oMockItem2 = {
            getId: sandbox.stub().returns("testButton2"),
            id: "testButton2",
            text: "Test Button 2",
            press: () => {
                MessageToast.show("Press Sub SubHeader Right Button");
            }
        };
        // Act
        await this.oExtensionService.createSubHeader({
            id: "SubHeader2",
            contentMiddle: [oMockItem1],
            contentRight: [oMockItem2],
            getId: sandbox.stub().returns("SubHeader1")
        });
        // Assert
        const {
            controlType,
            oControlProperties
        } = this.oRendererMock.addShellSubHeader.getCall(0).args[0];

        assert.deepEqual(controlType, "sap.m.Bar", "renderer API was called with correct control type");
        assert.deepEqual(oControlProperties.contentMiddle[0], oMockItem1, "renderer API was called with correct control type of content middle");
        assert.deepEqual(oControlProperties.contentRight[0], oMockItem2, "renderer API was called with correct control type of contentLeft");
    });

    QUnit.module("Operations on SubHeader", {
        beforeEach: async function () {
            sandbox.stub(Container, "getRendererInternal");
            this.oRendererMock = {
                addShellSubHeader: sandbox.stub().callsFake((oCreateProperties) => oCreateProperties.oControlProperties),
                showSubHeader: sandbox.stub(),
                hideSubHeader: sandbox.stub()
            };
            Container.getRendererInternal.returns(this.oRendererMock);

            sandbox.stub(StateManager, "addManagedControl");
            sandbox.stub(StateManager, "updateManagedControl");
            sandbox.stub(StateManager, "removeManagedControl");

            this.oMockSubHeader = {
                id: "SubHeader1",
                contentLeft: [oMockItem1],
                destroy: sandbox.stub(),
                getId: sandbox.stub().returns("SubHeader1")
            };

            this.oExtensionService = new FrameBoundExtension();

            this.oSubHeader = await this.oExtensionService.createSubHeader(this.oMockSubHeader);
        },
        afterEach: function () {
            sandbox.restore();
            StateManager.reset();
        }
    });

    QUnit.test("Destroys a SubHeader", async function (assert) {
        // Act
        await this.oSubHeader.destroy();
        // Assert
        assert.deepEqual(this.oRendererMock.hideSubHeader.callCount, 3, "hide was called correctly three times");
        assert.ok(this.oMockSubHeader.destroy.called, "item was destroyed correctly");
    });

    QUnit.test("Gets the control of a SubHeader", async function (assert) {
        // Act
        const oActualControl = await this.oSubHeader.getControl();
        // Assert
        assert.strictEqual(oActualControl, this.oMockSubHeader, "control was received");
    });

    QUnit.test("hide for all apps", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "SubHeader1",
            false,
            ["app"]
        ];
        // Act
        this.oSubHeader.hideForAllApps();
        // Assert
        assert.deepEqual(this.oRendererMock.hideSubHeader.getCall(0).args, aExpectedArgs, "Renderer was called correctly");
        assert.strictEqual(StateManager.updateManagedControl.callCount, 0, "StateManager was not called");
    });

    QUnit.test("hide for current app", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "SubHeader1",
            true,
            undefined
        ];
        // Act
        this.oSubHeader.hideForCurrentApp();
        // Assert
        assert.deepEqual(this.oRendererMock.hideSubHeader.getCall(0).args, aExpectedArgs, "Renderer was called correctly");
        assert.strictEqual(StateManager.updateManagedControl.callCount, 0, "StateManager was not called");
    });

    QUnit.test("hide on home", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "SubHeader1",
            false,
            ["home"]
        ];
        // Act
        this.oSubHeader.hideOnHome();
        // Assert
        assert.deepEqual(this.oRendererMock.hideSubHeader.getCall(0).args, aExpectedArgs, "Renderer was called correctly");
        assert.strictEqual(StateManager.updateManagedControl.callCount, 0, "StateManager was not called");
    });

    QUnit.test("show for all apps", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "SubHeader1",
            false,
            ["app"]
        ];
        // Act
        this.oSubHeader.showForAllApps();
        // Assert
        assert.deepEqual(this.oRendererMock.showSubHeader.getCall(0).args, aExpectedArgs, "Renderer was called correctly");
        assert.deepEqual(StateManager.updateManagedControl.getCall(0).args, ["SubHeader1", true], "StateManager was called correctly");
    });

    QUnit.test("show for current app", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "SubHeader1",
            true,
            undefined
        ];
        // Act
        this.oSubHeader.showForCurrentApp();
        // Assert
        assert.deepEqual(this.oRendererMock.showSubHeader.getCall(0).args, aExpectedArgs, "Renderer was called correctly");
        assert.strictEqual(StateManager.updateManagedControl.callCount, 0, "StateManager was not called");
    });

    QUnit.test("show on home", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "SubHeader1",
            false,
            ["home"]
        ];
        // Act
        const oActualSubHeader = this.oSubHeader.showOnHome();
        // Assert
        assert.deepEqual(this.oRendererMock.showSubHeader.getCall(0).args, aExpectedArgs, "Renderer was called correctly");
        assert.strictEqual(oActualSubHeader, this.oSubHeader, "chaining works ok");
        assert.deepEqual(StateManager.updateManagedControl.getCall(0).args, ["SubHeader1", true], "StateManager was called correctly");
    });

    QUnit.test("chaining works properly", async function (assert) {
        // Act
        const oActualHeader = this.oSubHeader
            .hideForAllApps()
            .hideForCurrentApp()
            .showForAllApps()
            .hideOnHome()
            .showForAllApps()
            .showForCurrentApp()
            .showOnHome();
        // Assert
        assert.strictEqual(oActualHeader, this.oSubHeader, "chaining is ok");
    });

});

