// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.FrameBoundExtension.FloatingContainer
 */
sap.ui.define([
    "sap/m/Button",
    "sap/ui/core/EventBus",
    "sap/ui/qunit/utils/nextUIUpdate",
    "sap/ushell/Container",
    "sap/ushell/services/FrameBoundExtension"
], function (
    Button,
    EventBus,
    nextUIUpdate,
    Container,
    FrameBoundExtension
) {
    "use strict";

    /* global QUnit, sinon */

    const sandbox = sinon.createSandbox({});

    QUnit.module("setContent", {
        beforeEach: async function () {
            const oExtensionService = new FrameBoundExtension();

            this.oRendererMock = {
                setFloatingContainerContent: sandbox.stub(),
                setFloatingContainerDragSelector: sandbox.stub()
            };
            sandbox.stub(Container, "getRendererInternal").returns(this.oRendererMock);
            this.oFloatingContainer = await oExtensionService.getFloatingContainer();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Sets the Content via the Renderer", async function (assert) {
        // Arrange
        const sDragSelector = ".someClass";
        const oControl = new Button(); // Could be any control with a renderer

        // Act
        this.oFloatingContainer.setContent(oControl, sDragSelector);

        // Assert
        assert.deepEqual(this.oRendererMock.setFloatingContainerContent.getCall(0).args, [oControl], "Set the control as FloatingContainer content.");

        // Cleanup
        oControl.destroy();
    });

    QUnit.test("Sets the drag selector only onAfterRendering", async function (assert) {
        // Arrange
        const sDragSelector = ".someClass";
        const oControl = new Button(); // Could be any control with a renderer

        // Act (1 of 2)
        this.oFloatingContainer.setContent(oControl, sDragSelector);
        // Assert (1 of 2)
        assert.deepEqual(this.oRendererMock.setFloatingContainerDragSelector.callCount, 0, "Drag selector was not set.");

        // Act (2 of 2)
        oControl.placeAt("qunit-fixture");
        await nextUIUpdate();
        // Assert (2 of 2)
        assert.deepEqual(this.oRendererMock.setFloatingContainerDragSelector.getCall(0).args, [sDragSelector], "Set the correct drag selector.");

        // Cleanup
        oControl.destroy();
    });

    QUnit.test("Allows chaining", async function (assert) {
        // Arrange
        const sDragSelector = ".someClass";
        const oControl = new Button(); // Could be any control with a renderer

        // Act
        const oReturnValue = this.oFloatingContainer.setContent(oControl, sDragSelector);

        // Assert
        assert.strictEqual(oReturnValue, this.oFloatingContainer, "Returned the expected interface");
    });

    QUnit.module("show", {
        beforeEach: async function () {
            const oExtensionService = new FrameBoundExtension();

            this.oRendererMock = {
                setFloatingContainerVisibility: sandbox.stub()
            };
            sandbox.stub(Container, "getRendererInternal").returns(this.oRendererMock);
            this.oFloatingContainer = await oExtensionService.getFloatingContainer();
        },
        afterEach: async function () {
            sandbox.restore();
        }
    });

    QUnit.test("Sets the Content to visible via the Renderer", async function (assert) {
        // Act
        this.oFloatingContainer.show();

        // Assert
        assert.deepEqual(this.oRendererMock.setFloatingContainerVisibility.getCall(0).args, [true], "Set the FloatingContainer to visible.");
    });

    QUnit.test("Allows chaining", async function (assert) {
        // Act
        const oReturnValue = this.oFloatingContainer.show();

        // Assert
        assert.strictEqual(oReturnValue, this.oFloatingContainer, "Returned the expected interface");
    });

    QUnit.module("hide", {
        beforeEach: async function () {
            const oExtensionService = new FrameBoundExtension();

            this.oRendererMock = {
                setFloatingContainerVisibility: sandbox.stub()
            };
            sandbox.stub(Container, "getRendererInternal").returns(this.oRendererMock);
            this.oFloatingContainer = await oExtensionService.getFloatingContainer();
        },
        afterEach: async function () {
            sandbox.restore();
        }
    });

    QUnit.test("Sets the Content to invisible via the Renderer", async function (assert) {
        // Act
        this.oFloatingContainer.hide();

        // Assert
        assert.deepEqual(this.oRendererMock.setFloatingContainerVisibility.getCall(0).args, [false], "Set the FloatingContainer to invisible.");
    });

    QUnit.test("Allows chaining", async function (assert) {
        // Act
        const oReturnValue = this.oFloatingContainer.hide();

        // Assert
        assert.strictEqual(oReturnValue, this.oFloatingContainer, "Returned the expected interface");
    });

    QUnit.module("isDocked", {
        beforeEach: async function () {
            const oExtensionService = new FrameBoundExtension();

            this.oRendererMock = {
                getFloatingContainerState: sandbox.stub()
            };
            sandbox.stub(Container, "getRendererInternal").returns(this.oRendererMock);
            this.oFloatingContainer = await oExtensionService.getFloatingContainer();
        },
        afterEach: async function () {
            sandbox.restore();
        }
    });

    QUnit.test("Resolves 'true' when Renderer returns 'docked:left'", async function (assert) {
        // Arrange
        this.oRendererMock.getFloatingContainerState.returns("docked:left");
        // Act
        const bDocked = await this.oFloatingContainer.isDocked();
        // Assert
        assert.strictEqual(bDocked, true, "FloatingContainer is docked");
    });

    QUnit.test("Resolves 'true' when Renderer returns 'docked:right'", async function (assert) {
        // Arrange
        this.oRendererMock.getFloatingContainerState.returns("docked:right");
        // Act
        const bDocked = await this.oFloatingContainer.isDocked();
        // Assert
        assert.strictEqual(bDocked, true, "FloatingContainer is docked");
    });

    QUnit.test("Resolves 'false' when Renderer returns 'floating'", async function (assert) {
        // Arrange
        this.oRendererMock.getFloatingContainerState.returns("floating");
        // Act
        const bDocked = await this.oFloatingContainer.isDocked();
        // Assert
        assert.strictEqual(bDocked, false, "FloatingContainer is undocked");
    });

    QUnit.test("Resolves 'false' when Renderer returns 'undefined'", async function (assert) {
        // Arrange
        this.oRendererMock.getFloatingContainerState.returns(undefined);
        // Act
        const bDocked = await this.oFloatingContainer.isDocked();
        // Assert
        assert.strictEqual(bDocked, false, "FloatingContainer is undocked");
    });

    QUnit.module("isVisible", {
        beforeEach: async function () {
            const oExtensionService = new FrameBoundExtension();

            this.oRendererMock = {
                getFloatingContainerVisiblity: sandbox.stub()
            };
            sandbox.stub(Container, "getRendererInternal").returns(this.oRendererMock);
            this.oFloatingContainer = await oExtensionService.getFloatingContainer();
        },
        afterEach: async function () {
            sandbox.restore();
        }
    });

    QUnit.test("Resolves 'true' for Renderer returning 'true'", async function (assert) {
        // Arrange
        this.oRendererMock.getFloatingContainerVisiblity.returns(true);
        // Act
        const bVisible = await this.oFloatingContainer.isVisible();
        // Assert
        assert.strictEqual(bVisible, true, "FloatingContainer is visible");
    });

    QUnit.test("Resolves 'false' for Renderer returning 'false'", async function (assert) {
        // Arrange
        this.oRendererMock.getFloatingContainerVisiblity.returns(false);
        // Act
        const bVisible = await this.oFloatingContainer.isVisible();
        // Assert
        assert.strictEqual(bVisible, false, "FloatingContainer is invisible");
    });

    QUnit.test("Resolves 'false' for Renderer returning 'undefined'", async function (assert) {
        // Arrange
        this.oRendererMock.getFloatingContainerVisiblity.returns(undefined);
        // Act
        const bVisible = await this.oFloatingContainer.isVisible();
        // Assert
        assert.strictEqual(bVisible, false, "FloatingContainer is invisible");
    });

    QUnit.module("Event: dockingStateUpdate", {
        beforeEach: async function () {
            const oExtensionService = new FrameBoundExtension();
            this.oRendererMock = {};
            sandbox.stub(Container, "getRendererInternal").returns(this.oRendererMock);
            this.oFloatingContainer = await oExtensionService.getFloatingContainer();
        },
        afterEach: async function () {
            sandbox.restore();
            this.oFloatingContainer.destroy();
        }
    });

    QUnit.test("Raises event for state 'docked'", async function (assert) {
        // Arrange
        const done = assert.async();
        const oEventBusData = { visible: true };
        const oExpectedEventData = {
            docked: true,
            visible: true
        };
        // Act
        this.oFloatingContainer.attachDockingStateUpdate(function (oEvent) {
            // Assert
            const oParameters = oEvent.getParameters();
            assert.deepEqual(oParameters, oExpectedEventData, "event was raised with correct parameters");
            done();
        });
        EventBus.getInstance().publish("launchpad", "shellFloatingContainerIsDocked", oEventBusData);
    });

    QUnit.test("Raises event for state 'floating'", async function (assert) {
        // Arrange
        const done = assert.async();
        const oEventBusData = { visible: true };
        const oExpectedEventData = {
            docked: false,
            visible: true
        };
        // Act
        this.oFloatingContainer.attachDockingStateUpdate(function (oEvent) {
            // Assert
            const oParameters = oEvent.getParameters();
            assert.deepEqual(oParameters, oExpectedEventData, "event was raised with correct parameters");
            done();
        });
        EventBus.getInstance().publish("launchpad", "shellFloatingContainerIsUnDocked", oEventBusData);
    });

    QUnit.test("Raises event for state 'floating' on resize", async function (assert) {
        // Arrange
        const done = assert.async();
        const oEventBusData = { visible: true };
        const oExpectedEventData = {
            docked: false,
            visible: true
        };
        // Act
        this.oFloatingContainer.attachDockingStateUpdate(function (oEvent) {
            // Assert
            const oParameters = oEvent.getParameters();
            assert.deepEqual(oParameters, oExpectedEventData, "event was raised with correct parameters");
            done();
        });
        EventBus.getInstance().publish("launchpad", "shellFloatingContainerIsUnDockedOnResize", oEventBusData);
    });

    QUnit.test("Does not raise the same event twice", async function (assert) {
        // Arrange
        const oEventBusData = { visible: true };
        const oEventHandlerStub = sandbox.stub();
        // Act & Assert
        this.oFloatingContainer.attachDockingStateUpdate(oEventHandlerStub);
        EventBus.getInstance().publish("launchpad", "shellFloatingContainerIsUnDockedOnResize", oEventBusData);
        assert.strictEqual(oEventHandlerStub.callCount, 1, "was called once");
        // calling the exact event a second time
        EventBus.getInstance().publish("launchpad", "shellFloatingContainerIsUnDockedOnResize", oEventBusData);
        assert.strictEqual(oEventHandlerStub.callCount, 1, "callCount did not change");
        // calling the equivalent undock event
        EventBus.getInstance().publish("launchpad", "shellFloatingContainerIsUnDocked", oEventBusData);
        assert.strictEqual(oEventHandlerStub.callCount, 1, "callCount did not change");
        // calling the dock event
        EventBus.getInstance().publish("launchpad", "shellFloatingContainerIsDocked", oEventBusData);
        assert.strictEqual(oEventHandlerStub.callCount, 2, "was called twice");
        // calling the dock event a second time
        EventBus.getInstance().publish("launchpad", "shellFloatingContainerIsDocked", oEventBusData);
        assert.strictEqual(oEventHandlerStub.callCount, 2, "callCount did not change");
    });

    QUnit.test("Forwards the current visibility 'true' as event parameter", async function (assert) {
        // Arrange
        const done = assert.async();
        const oEventBusData = { visible: true };

        this.oFloatingContainer.attachDockingStateUpdate(function (oEvent) {
            // Assert
            const bVisible = oEvent.getParameter("visible");
            assert.strictEqual(bVisible, true, "visible has correct value");
            done();
        });

        // Act
        EventBus.getInstance().publish("launchpad", "shellFloatingContainerIsUnDockedOnResize", oEventBusData);
    });

    QUnit.test("Forwards the current visibility 'false' as event parameter", async function (assert) {
        // Arrange
        const done = assert.async();
        const oEventBusData = { visible: false };

        this.oFloatingContainer.attachDockingStateUpdate(function (oEvent) {
            // Assert
            const bVisible = oEvent.getParameter("visible");
            assert.strictEqual(bVisible, false, "visible has correct value");
            done();
        });

        // Act
        EventBus.getInstance().publish("launchpad", "shellFloatingContainerIsUnDockedOnResize", oEventBusData);
    });

    QUnit.test("Forwards the current visibility 'undefined' as event parameter", async function (assert) {
        // Arrange
        const done = assert.async();
        const oEventBusData = { visible: undefined };

        this.oFloatingContainer.attachDockingStateUpdate(function (oEvent) {
            // Assert
            const bVisible = oEvent.getParameter("visible");
            assert.strictEqual(bVisible, false, "visible has correct value");
            done();
        });

        // Act
        EventBus.getInstance().publish("launchpad", "shellFloatingContainerIsUnDockedOnResize", oEventBusData);
    });
});
