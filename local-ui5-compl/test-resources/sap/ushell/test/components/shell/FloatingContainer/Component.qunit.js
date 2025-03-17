// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.shell.FloatingContainer
 */
sap.ui.define([
    "sap/base/i18n/Localization",
    "sap/m/HBox",
    "sap/m/VBox",
    "sap/ui/core/Component",
    "sap/ui/core/Element",
    "sap/ui/core/EventBus",
    "sap/ui/Device",
    "sap/ui/qunit/utils/nextUIUpdate",
    "sap/ui/util/Storage",
    "sap/ushell/renderer/ShellLayout",
    "sap/ushell/state/ShellModel",
    "sap/ushell/state/StateManager"
], function (
    Localization,
    HBox,
    VBox,
    Component,
    Element,
    EventBus,
    Device,
    nextUIUpdate,
    Storage,
    ShellLayout,
    ShellModel,
    StateManager
) {
    "use strict";

    QUnit.config.reorder = false;

    /* global QUnit, sinon */

    const oGlobalEventBus = EventBus.getInstance();

    // shortcut for sap.ushell.renderer.ShellLayout.ShellArea
    const ShellArea = ShellLayout.ShellArea;

    // shortcut for sap.ushell.state.StateManager.Operation
    const Operation = StateManager.Operation;

    const sandbox = sinon.createSandbox({});

    /* ==========================================================================
     *                              Test Setup
     * ==========================================================================
     * The test uses the qunit-fixture and the shell layout.
     * Any drag events are simulated by calling the the handlers directly.
     *
     * To fasten the test execution, we use the fake timers.
     * You can set bDebug to true to see the drag events in motion.
     * Additionally the drag clone and a red dot are rendered to visualize the drag.
     *
     * RTL is only enabled within the qunit-fixture.
     * The rendering looks wrong in the browser, because the LTR css is used.
     */
    const bDebug = false;

    const iShellHeaderHeight = 30;
    const iFloatingContainerHeight = 100;
    const iFloatingContainerWidth = 416; // 26rem

    async function resizeFixture (height, width) {
        Device.resize.width = width;
        Device.resize.height = height;

        const oFixture = document.getElementById("qunit-fixture");
        oFixture.style.height = height + "px";
        oFixture.style.width = width + "px";

        if (Device.resize.attachHandler.callCount) {
            const [fnHandler, oScope] = Device.resize.attachHandler.getCall(0).args;
            const fnFireResize = fnHandler.bind(oScope);
            fnFireResize();
        }
    }

    function getRelativePosition (oElement) {
        const oFixture = document.getElementById("qunit-fixture");
        var oElementRect = oElement.getBoundingClientRect();
        var oFixtureRect = oFixture.getBoundingClientRect();
        return {
            top: Math.round(oElementRect.top - oFixtureRect.top),
            bottom: Math.round(oFixtureRect.bottom - oElementRect.bottom),
            right: Math.round(oFixtureRect.right - oElementRect.right),
            left: Math.round(oElementRect.left - oFixtureRect.left)
        };
    }

    function createDragPoint () {
        const oDragPoint = document.createElement("div");
        oDragPoint.style.position = "absolute";
        oDragPoint.style.width = "5px";
        oDragPoint.style.height = "5px";
        oDragPoint.style.backgroundColor = "red";
        oDragPoint.style.borderRadius = "50%";
        oDragPoint.style.zIndex = 1000;

        return oDragPoint;
    }

    async function dragContainerTo (iDeltaX, iDeltaY, oCallBacks = {}) {
        const oQunitThis = QUnit.config.current.testEnvironment;
        const { oComponent, oWrapperDomRef } = oQunitThis;
        const { beforeDrop, afterDrag, beforeDrag } = oCallBacks;

        const oControlDomRef = Element.getElementById("shell-floatingContainer").getDomRef();
        const oCurrentPosition = getRelativePosition(oControlDomRef);

        if (beforeDrag) {
            await beforeDrag();
        }

        /*
         * The UIActions module calls _onDragStart twice.
         * The first call is before the drag clone was created.
         * The second call is after the drag clone was created.
         * Afterwards the _handleDrag callback is called once.
         */

        oComponent._onDragStart();

        const oDragClone = oWrapperDomRef.cloneNode(true);
        oDragClone.removeAttribute("id");
        oDragClone.children[0].style.backgroundColor = "lightcoral";
        oDragClone.classList.add("sapUshellFloatingContainer-clone");
        oWrapperDomRef.parentElement.appendChild(oDragClone);

        const oActualDragPoint = createDragPoint(); // easier debugging
        oWrapperDomRef.parentElement.appendChild(oActualDragPoint);
        oActualDragPoint.style.left = `${oCurrentPosition.left + iFloatingContainerWidth / 2}px`;
        oActualDragPoint.style.top = `${oCurrentPosition.top}px`;

        oComponent._onDragStart();
        oComponent._handleDrag();

        if (afterDrag) {
            await afterDrag();
        }

        const iStepsX = Math.floor(Math.abs(iDeltaX) / 10);
        const iStepsY = Math.floor(Math.abs(iDeltaY) / 10);
        for (let i = 0; i < Math.max(iStepsX, iStepsY); i++) {
            const iStepX = Math.min(i, iStepsX);
            const iLeft = oCurrentPosition.left + iStepX * 10 * Math.sign(iDeltaX);
            const iDragPosX = iLeft + iFloatingContainerWidth / 2; // drag from the center

            const iStepY = Math.min(i, iStepsY);
            const iTop = oCurrentPosition.top + iStepY * 10 * Math.sign(iDeltaY);
            const iDragPosY = iTop;

            // clone has no width
            if (getComputedStyle(oDragClone).direction === "rtl") {
                oDragClone.style.left = `${iLeft + iFloatingContainerWidth}px`;
            } else {
                oDragClone.style.left = `${iLeft}px`;
            }
            oDragClone.style.top = `${iTop}px`;

            oActualDragPoint.style.left = `${iDragPosX}px`;
            oActualDragPoint.style.top = `${iDragPosY}px`;

            if (bDebug) {
                await sleep(100);
            }

            oComponent._onDrag({
                moveX: iDragPosX,
                moveY: iDragPosY
            });
        }

        const iFinalDragPosX = oCurrentPosition.left + iDeltaX + iFloatingContainerWidth / 2;
        const iFinalDragPosY = oCurrentPosition.top + iDeltaY;
        oComponent._onDrag({
            moveX: iFinalDragPosX,
            moveY: iFinalDragPosY
        });

        // wait for throttling
        if (bDebug) {
            await sleep(400);
        } else {
            sandbox.clock.tick(500);
        }

        if (beforeDrop) {
            await beforeDrop();
        }

        oDragClone.remove();
        oActualDragPoint.remove();
        oComponent._handleDrop({}, {}, {
            deltaX: iDeltaX,
            deltaY: iDeltaY
        });

        // await fullHeight rendering
        await nextUIUpdate();
    }

    async function createComponent () {
        const oComponent = await Component.create({
            name: "sap.ushell.components.shell.FloatingContainer"
        });
        await oComponent.oInitPromise;
        await nextUIUpdate(); // await initial repositioning

        sandbox.stub(oComponent, "_getBoundingClientRect").callsFake((oDomRef) => {
            return getRelativePosition(oDomRef);
        });

        return oComponent;
    }

    function sleep (ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    QUnit.module("FloatingContainer", {
        beforeEach: async function () {
            if (!bDebug) {
                sandbox.useFakeTimers({
                    now: Date.now(),
                    shouldAdvanceTime: true
                });
            }
            sandbox.stub(oGlobalEventBus, "publish");
            sandbox.stub(Device.resize, "attachHandler");
            sandbox.stub(Device.media, "getCurrentRange").returns({ name: "Desktop" });
            QUnit.sap.ushell.createTestDomRef();
            ShellLayout.applyLayout("qunit-canvas");
            document.getElementById(ShellArea.ShellHeader).style.height = `${iShellHeaderHeight}px`;
            await resizeFixture(500, 1000);

            sandbox.stub(Localization, "getRTL");
            Localization.getRTL.returns(false);

            this.oStorage = new Storage(Storage.Type.local, "com.sap.ushell.adapters.local.FloatingContainer");
            this.oStorage.clear();

            const oDraggableControl = new HBox({
                height: "20px"
            });
            oDraggableControl.addStyleClass("draggableControl");
            this.oContent = new VBox({
                items: [
                    oDraggableControl
                ],
                height: `${iFloatingContainerHeight}px`
            });

            StateManager.updateAllBaseStates("floatingContainer", Operation.Set, {
                visible: true,
                state: "floating",
                dragSelector: ".draggableControl",
                items: [this.oContent.getId()]
            });

            this.oFixture = document.getElementById("qunit-fixture");
            this.oFixture.style.outline = "1px solid black";
            this.oFixture.style.margin = "2rem";
            this.oWrapperDomRef = document.getElementById(ShellArea.FloatingContainer);
        },
        afterEach: async function () {
            if (!bDebug) {
                sandbox.clock.runAll();
            }
            sandbox.restore();
            this.oStorage.clear();
            this.oComponent.destroy();
            this.oContent.destroy();
            StateManager.resetAll();

            this.oFixture.style.direction = "";
            this.oFixture.style.outline = "";
            this.oFixture.style.margin = "";
        }
    });

    QUnit.test("with initial position", async function (assert) {
        // Arrange
        await resizeFixture(500, 2000);

        // Act
        this.oComponent = await createComponent();

        // Assert
        assert.ok(this.oWrapperDomRef.children.length, "The wrapper was rendered");
        assert.ok(this.oContent.getDomRef(), "The content was rendered");

        const oControlDomRef = Element.getElementById("shell-floatingContainer").getDomRef();
        const oPosition = getRelativePosition(oControlDomRef);
        assert.strictEqual(oPosition.top, iShellHeaderHeight, "The top position is correct");
        assert.strictEqual(oPosition.left, 1200, "The left position is correct");
    });

    QUnit.test("with initial position and repositioning due to small screen size", async function (assert) {
        // Act
        this.oComponent = await createComponent();

        /*
         * The desired position of the floating container is outside of the window.
         * The floating container should be repositioned to the right of the window.
         */

        // Assert
        assert.ok(this.oWrapperDomRef.children.length, "The wrapper was rendered");
        assert.ok(this.oContent.getDomRef(), "The content was rendered");

        const oControlDomRef = Element.getElementById("shell-floatingContainer").getDomRef();
        const oPosition = getRelativePosition(oControlDomRef);
        assert.strictEqual(oPosition.top, iShellHeaderHeight, "The top position is correct");
        assert.strictEqual(oPosition.right, 0, "The right position is correct");
        assert.ok(oPosition.left < 600, "The left position is correct");
    });

    QUnit.test("with initial position in RTL", async function (assert) {
        // Arrange
        Localization.getRTL.returns(true);
        this.oFixture.style.direction = "rtl";

        // Act
        this.oComponent = await createComponent();

        // Assert
        assert.ok(this.oWrapperDomRef.children.length, "The wrapper was rendered");
        assert.ok(this.oContent.getDomRef(), "The content was rendered");

        const oControlDomRef = Element.getElementById("shell-floatingContainer").getDomRef();
        const oPosition = getRelativePosition(oControlDomRef);
        assert.strictEqual(oPosition.top, iShellHeaderHeight, "The top position is correct");
        assert.strictEqual(oPosition.right, 400, "The right position is correct");
    });

    QUnit.test("with position in storage", async function (assert) {
        // Arrange
        this.oStorage.put("floatingContainerStyle", "left: 0%; top: 0%; position: absolute; display: block;");

        // Act
        this.oComponent = await createComponent();

        // Assert
        assert.ok(this.oWrapperDomRef.children.length, "The wrapper was rendered");
        assert.ok(this.oContent.getDomRef(), "The content was rendered");

        const oControlDomRef = Element.getElementById("shell-floatingContainer").getDomRef();
        const oPosition = getRelativePosition(oControlDomRef);
        assert.strictEqual(oPosition.top, 0, "The top position is correct");
        assert.strictEqual(oPosition.left, 0, "The left position is correct");
    });

    QUnit.test("with position in storage in RTL", async function (assert) {
        // Arrange
        Localization.getRTL.returns(true);
        this.oFixture.style.direction = "rtl";
        this.oStorage.put("floatingContainerStyle", "left: 0%; top: 0%; position: absolute; display: block;");

        // Act
        this.oComponent = await createComponent();

        // Assert
        assert.ok(this.oWrapperDomRef.children.length, "The wrapper was rendered");
        assert.ok(this.oContent.getDomRef(), "The content was rendered");

        const oControlDomRef = Element.getElementById("shell-floatingContainer").getDomRef();
        const oPosition = getRelativePosition(oControlDomRef);
        assert.strictEqual(oPosition.top, 0, "The top position is correct");
        assert.strictEqual(oPosition.left, 0, "The right position is correct");
    });

    QUnit.test("with position and docked:right in storage", async function (assert) {
        // Arrange
        this.oStorage.put("floatingContainerStyle", "left: 50%; top: 50%; position: absolute; display: block;");
        this.oStorage.put("lastState", "docked:right");

        // Act
        this.oComponent = await createComponent();

        // Assert
        assert.ok(this.oWrapperDomRef.children.length, "The wrapper was rendered");
        assert.ok(this.oContent.getDomRef(), "The content was rendered");

        const oControlDomRef = Element.getElementById("shell-floatingContainer").getDomRef();
        const oPosition = getRelativePosition(oControlDomRef);
        assert.strictEqual(oPosition.top, 0, "The top position is correct");
        assert.strictEqual(oPosition.right, 0, "The right position is correct");
        const sState = ShellModel.getModel().getProperty("/floatingContainer/state");
        assert.strictEqual(sState, "docked:right", "The state is correct");
    });

    QUnit.test("with position and docked:left in storage", async function (assert) {
        // Arrange
        this.oStorage.put("floatingContainerStyle", "left: 50%; top: 50%; position: absolute; display: block;");
        this.oStorage.put("lastState", "docked:left");

        // Act
        this.oComponent = await createComponent();

        // Assert
        assert.ok(this.oWrapperDomRef.children.length, "The wrapper was rendered");
        assert.ok(this.oContent.getDomRef(), "The content was rendered");

        const oControlDomRef = Element.getElementById("shell-floatingContainer").getDomRef();
        const oPosition = getRelativePosition(oControlDomRef);
        assert.strictEqual(oPosition.top, 0, "The top position is correct");
        assert.strictEqual(oPosition.left, 0, "The left position is correct");
        const sState = ShellModel.getModel().getProperty("/floatingContainer/state");
        assert.strictEqual(sState, "docked:left", "The state is correct");
    });

    QUnit.test("with position and docked:right in storage in RTL", async function (assert) {
        // Arrange
        Localization.getRTL.returns(true);
        this.oFixture.style.direction = "rtl";
        this.oStorage.put("floatingContainerStyle", "left: 50%; top: 50%; position: absolute; display: block;");
        this.oStorage.put("lastState", "docked:right");

        // Act
        this.oComponent = await createComponent();

        // Assert
        assert.ok(this.oWrapperDomRef.children.length, "The wrapper was rendered");
        assert.ok(this.oContent.getDomRef(), "The content was rendered");

        const oControlDomRef = Element.getElementById("shell-floatingContainer").getDomRef();
        const oPosition = getRelativePosition(oControlDomRef);
        assert.strictEqual(oPosition.top, 0, "The top position is correct");
        assert.strictEqual(oPosition.right, 0, "The right position is correct");
        const sState = ShellModel.getModel().getProperty("/floatingContainer/state");
        assert.strictEqual(sState, "docked:right", "The state is correct");
    });

    QUnit.test("with position and docked:left in storage in RTL", async function (assert) {
        // Arrange
        Localization.getRTL.returns(true);
        this.oFixture.style.direction = "rtl";
        this.oStorage.put("floatingContainerStyle", "left: 50%; top: 50%; position: absolute; display: block;");
        this.oStorage.put("lastState", "docked:left");

        // Act
        this.oComponent = await createComponent();

        // Assert
        assert.ok(this.oWrapperDomRef.children.length, "The wrapper was rendered");
        assert.ok(this.oContent.getDomRef(), "The content was rendered");

        const oControlDomRef = Element.getElementById("shell-floatingContainer").getDomRef();
        const oPosition = getRelativePosition(oControlDomRef);
        assert.strictEqual(oPosition.top, 0, "The top position is correct");
        assert.strictEqual(oPosition.left, 0, "The left position is correct");
        const sState = ShellModel.getModel().getProperty("/floatingContainer/state");
        assert.strictEqual(sState, "docked:left", "The state is correct");
    });

    QUnit.test("repositioning after horizontal window resize", async function (assert) {
        // Arrange
        this.oComponent = await createComponent();
        const oControlDomRef = Element.getElementById("shell-floatingContainer").getDomRef();

        // Act
        await resizeFixture(500, 800);

        /*
         * Floating container moves horizontally out of the window.
         * Its right position should be adjusted to the right of the window.
         * The top position should remain the same.
         */

        // Assert
        const oPosition = getRelativePosition(oControlDomRef);
        assert.strictEqual(oPosition.top, iShellHeaderHeight, "The top position is correct");
        assert.strictEqual(oPosition.right, 0, "The right position is correct");
    });

    QUnit.test("repositioning after vertical window resize", async function (assert) {
        // Arrange
        this.oComponent = await createComponent();
        const oControlDomRef = Element.getElementById("shell-floatingContainer").getDomRef();

        // Act
        await resizeFixture(iFloatingContainerHeight - 10, 1000);

        /*
         * Floating container does not fit vertically anymore into the window.
         * Its top position should be adjusted to the top of the window.
         * The right position should remain the same.
         */

        // Assert
        const oPosition = getRelativePosition(oControlDomRef);
        assert.strictEqual(oPosition.top, 0, "The top position is correct");
        assert.strictEqual(oPosition.right, 0, "The right position is correct");
    });

    QUnit.test("with drag into right docking area", async function (assert) {
        // Arrange
        this.oComponent = await createComponent();
        const oControlDomRef = Element.getElementById("shell-floatingContainer").getDomRef();
        const oPositionBefore = getRelativePosition(oControlDomRef);

        /*
         * Docking area starts at 64px from the sides of the window.
         * Dragging happens from the center of the floating container width.
         */
        const iTargetX = Device.resize.width - 64 - iFloatingContainerWidth / 2;
        const iDeltaX = iTargetX - oPositionBefore.left;

        // Act
        await dragContainerTo(iDeltaX, 0, {
            beforeDrag: () => {
                const sDragSelector = ShellModel.getModel().getProperty("/floatingContainer/dragSelector");
                assert.ok(this.oFixture.querySelector(sDragSelector), "The drag selector was rendered");
            },
            beforeDrop: () => {
                const oPreview = this.oFixture.querySelector(".sapUshellShellDisplayDockingAreaRight");
                assert.ok(oPreview, "The preview was rendered on the correct side");
            }
        });

        // Assert
        const oPosition = getRelativePosition(oControlDomRef);
        assert.strictEqual(oPosition.top, 0, "The top position is correct");
        assert.strictEqual(oPosition.bottom, 0, "The bottom position is correct");
        assert.strictEqual(oPosition.right, 0, "The right position is correct");
        const sState = ShellModel.getModel().getProperty("/floatingContainer/state");
        assert.strictEqual(sState, "docked:right", "The state is correct");

        assert.ok(oGlobalEventBus.publish.withArgs("launchpad", "shellFloatingContainerIsDocked").called, "The docked event was published");
    });

    QUnit.test("with drag into right docking area in RTL", async function (assert) {
        // Arrange
        Localization.getRTL.returns(true);
        this.oFixture.style.direction = "rtl";
        this.oComponent = await createComponent();
        const oControlDomRef = Element.getElementById("shell-floatingContainer").getDomRef();
        const oPositionBefore = getRelativePosition(oControlDomRef);

        /*
         * Docking area starts at 64px from the sides of the window.
         * Dragging happens from the center of the floating container width.
         */
        const iTargetX = Device.resize.width - 64;
        const iDeltaX = iTargetX - (oPositionBefore.left + iFloatingContainerWidth / 2);

        // Act
        await dragContainerTo(iDeltaX, 0, {
            beforeDrag: () => {
                const sDragSelector = ShellModel.getModel().getProperty("/floatingContainer/dragSelector");
                assert.ok(this.oFixture.querySelector(sDragSelector), "The drag selector was rendered");
            },
            beforeDrop: () => {
                /*
                * Debugging Hint: the preview will only be correctly rendered with the actual RTL css
                */
                const oPreview = this.oFixture.querySelector(".sapUshellShellDisplayDockingAreaLeft");
                assert.ok(oPreview, "The preview was rendered on the correct side");
            }
        });

        // Assert
        const oPosition = getRelativePosition(oControlDomRef);
        assert.strictEqual(oPosition.top, 0, "The top position is correct");
        assert.strictEqual(oPosition.bottom, 0, "The bottom position is correct");
        assert.strictEqual(oPosition.right, 0, "The right position is correct");
        const sState = ShellModel.getModel().getProperty("/floatingContainer/state");
        assert.strictEqual(sState, "docked:right", "The state is correct");

        assert.ok(oGlobalEventBus.publish.withArgs("launchpad", "shellFloatingContainerIsDocked").called, "The docked event was published");
    });

    QUnit.test("with drag into left docking area", async function (assert) {
        // Arrange
        this.oComponent = await createComponent();
        const oControlDomRef = Element.getElementById("shell-floatingContainer").getDomRef();
        const oPositionBefore = getRelativePosition(oControlDomRef);

        /*
         * Docking area starts at 64px from the sides of the window.
         * Dragging happens from the center of the floating container width.
         */
        const iTargetX = 63;
        const iDeltaX = iTargetX - (oPositionBefore.left + iFloatingContainerWidth / 2);

        // Act
        await dragContainerTo(iDeltaX, 0, {
            beforeDrag: () => {
                const sDragSelector = ShellModel.getModel().getProperty("/floatingContainer/dragSelector");
                assert.ok(this.oFixture.querySelector(sDragSelector), "The drag selector was rendered");
            },
            beforeDrop: () => {
                const oPreview = this.oFixture.querySelector(".sapUshellShellDisplayDockingAreaLeft");
                assert.ok(oPreview, "The preview was rendered on the correct side");
            }
        });

        // Assert
        const oPosition = getRelativePosition(oControlDomRef);
        assert.strictEqual(oPosition.top, 0, "The top position is correct");
        assert.strictEqual(oPosition.bottom, 0, "The bottom position is correct");
        assert.strictEqual(oPosition.left, 0, "The right position is correct");
        const sState = ShellModel.getModel().getProperty("/floatingContainer/state");
        assert.strictEqual(sState, "docked:left", "The state is correct");

        assert.ok(oGlobalEventBus.publish.withArgs("launchpad", "shellFloatingContainerIsDocked").called, "The docked event was published");
    });

    QUnit.test("with drag into left docking area in RTL", async function (assert) {
        // Arrange
        Localization.getRTL.returns(true);
        this.oFixture.style.direction = "rtl";
        this.oComponent = await createComponent();
        const oControlDomRef = Element.getElementById("shell-floatingContainer").getDomRef();
        const oPositionBefore = getRelativePosition(oControlDomRef);

        /*
         * Docking area starts at 64px from the sides of the window.
         * Dragging happens from the center of the floating container width.
         */
        const iTargetX = 63;
        const iDeltaX = iTargetX - (oPositionBefore.left + iFloatingContainerWidth / 2);

        // Act
        await dragContainerTo(iDeltaX, 0, {
            beforeDrag: () => {
                const sDragSelector = ShellModel.getModel().getProperty("/floatingContainer/dragSelector");
                assert.ok(this.oFixture.querySelector(sDragSelector), "The drag selector was rendered");
            },
            beforeDrop: () => {
                const oPreview = this.oFixture.querySelector(".sapUshellShellDisplayDockingAreaRight");
                assert.ok(oPreview, "The preview was rendered on the correct side");
                /*
                * Debugging Hint: the preview will only be correctly rendered with the actual RTL css
                */
            }
        });

        // Assert
        const oPosition = getRelativePosition(oControlDomRef);
        assert.strictEqual(oPosition.top, 0, "The top position is correct");
        assert.strictEqual(oPosition.bottom, 0, "The bottom position is correct");
        assert.strictEqual(oPosition.left, 0, "The right position is correct");
        const sState = ShellModel.getModel().getProperty("/floatingContainer/state");
        assert.strictEqual(sState, "docked:left", "The state is correct");

        assert.ok(oGlobalEventBus.publish.withArgs("launchpad", "shellFloatingContainerIsDocked").called, "The docked event was published");
    });

    QUnit.test("with drag into right docking area not possible on tablet", async function (assert) {
        // Arrange
        Device.media.getCurrentRange.returns({ name: "Tablet" });
        this.oComponent = await createComponent();
        const oControlDomRef = Element.getElementById("shell-floatingContainer").getDomRef();
        const oPositionBefore = getRelativePosition(oControlDomRef);

        /*
         * Docking area starts at 64px from the sides of the window.
         * Dragging happens from the center of the floating container width.
         */
        const iTargetX = Device.resize.width - 64 - iFloatingContainerWidth / 2;
        const iDeltaX = iTargetX - oPositionBefore.left;

        // Act
        await dragContainerTo(iDeltaX, 0, {
            beforeDrag: () => {
                const sDragSelector = ShellModel.getModel().getProperty("/floatingContainer/dragSelector");
                assert.ok(this.oFixture.querySelector(sDragSelector), "The drag selector was rendered");
            },
            beforeDrop: () => {
                const oPreview = this.oFixture.querySelector(".sapUshellShellDisplayDockingAreaRight");
                assert.notOk(oPreview, "No preview was rendered");
            }
        });

        // Assert
        const oPosition = getRelativePosition(oControlDomRef);
        assert.strictEqual(oPosition.top, iShellHeaderHeight, "The top position is correct");
        assert.ok(oPosition.bottom > 0, "The bottom position is correct");
        assert.strictEqual(oPosition.right, 0, "The right position is correct");
        const sState = ShellModel.getModel().getProperty("/floatingContainer/state");
        assert.strictEqual(sState, "floating", "The state is correct");
    });

    QUnit.test("Adjust position after drag into right boundary", async function (assert) {
        // Arrange
        this.oStorage.put("floatingContainerStyle", "left: 0%; top: 0%; position: absolute; display: block;");
        this.oComponent = await createComponent();
        const oControlDomRef = Element.getElementById("shell-floatingContainer").getDomRef();
        const oPositionBefore = getRelativePosition(oControlDomRef);

        const iTargetX = Device.resize.width - iFloatingContainerWidth + 50;
        const iDeltaX = iTargetX - oPositionBefore.left;

        // Act
        await dragContainerTo(iDeltaX, 0);

        // Assert
        const oPosition = getRelativePosition(oControlDomRef);
        assert.strictEqual(oPosition.top, 0, "The top position is correct");
        assert.ok(oPosition.bottom > 0, "The bottom position is correct");
        assert.strictEqual(oPosition.right, 0, "The right position is correct");
        const sState = ShellModel.getModel().getProperty("/floatingContainer/state");
        assert.strictEqual(sState, "floating", "The state is correct");
    });

    QUnit.test("Adjust position after drag into left boundary", async function (assert) {
        // Arrange
        this.oComponent = await createComponent();
        const oControlDomRef = Element.getElementById("shell-floatingContainer").getDomRef();
        const oPositionBefore = getRelativePosition(oControlDomRef);

        const iTargetX = -50;
        const iDeltaX = -oPositionBefore.left + iTargetX;

        // Act
        await dragContainerTo(iDeltaX, 0);

        // Assert
        const oPosition = getRelativePosition(oControlDomRef);
        assert.strictEqual(oPosition.top, iShellHeaderHeight, "The top position is correct");
        assert.ok(oPosition.bottom > 0, "The bottom position is correct");
        assert.strictEqual(oPosition.left, 0, "The left position is correct");
        const sState = ShellModel.getModel().getProperty("/floatingContainer/state");
        assert.strictEqual(sState, "floating", "The state is correct");
    });

    QUnit.test("Adjust position after drag into top boundary", async function (assert) {
        // Arrange
        this.oStorage.put("floatingContainerStyle", "left: 50%; top: 50%; position: absolute; display: block;");
        this.oComponent = await createComponent();
        const oControlDomRef = Element.getElementById("shell-floatingContainer").getDomRef();
        const oPositionBefore = getRelativePosition(oControlDomRef);

        const iTargetY = -50;
        const iDeltaY = iTargetY - oPositionBefore.top;

        // Act
        await dragContainerTo(0, iDeltaY);

        // Assert
        const oPosition = getRelativePosition(oControlDomRef);
        assert.strictEqual(oPosition.top, 0, "The top position is correct");
        assert.ok(oPosition.bottom > 0, "The bottom position is correct");
        assert.strictEqual(oPosition.left, Device.resize.width / 2, "The left position is correct");
        const sState = ShellModel.getModel().getProperty("/floatingContainer/state");
        assert.strictEqual(sState, "floating", "The state is correct");
    });

    QUnit.test("Adjust position after drag into bottom boundary", async function (assert) {
        // Arrange
        this.oStorage.put("floatingContainerStyle", "left: 50%; top: 50%; position: absolute; display: block;");
        this.oComponent = await createComponent();
        const oControlDomRef = Element.getElementById("shell-floatingContainer").getDomRef();
        const oPositionBefore = getRelativePosition(oControlDomRef);

        const iTargetY = Device.resize.height - 50;
        const iDeltaY = iTargetY - oPositionBefore.top;

        // Act
        await dragContainerTo(0, iDeltaY);

        // Assert
        const oPosition = getRelativePosition(oControlDomRef);
        assert.ok(oPosition.top > 0, "The top position is correct");
        assert.strictEqual(oPosition.bottom, 0, "The bottom position is correct");
        assert.strictEqual(oPosition.left, Device.resize.width / 2, "The left position is correct");
        const sState = ShellModel.getModel().getProperty("/floatingContainer/state");
        assert.strictEqual(sState, "floating", "The state is correct");
    });

    QUnit.test("with resize while docked:right", async function (assert) {
        // Arrange
        this.oStorage.put("floatingContainerStyle", "left: 50%; bottom: 50%; position: absolute; display: block;");
        this.oStorage.put("lastState", "docked:right");
        this.oComponent = await createComponent();
        const oControlDomRef = Element.getElementById("shell-floatingContainer").getDomRef();

        // Act
        resizeFixture(500, 800);

        // Assert
        const oPosition = getRelativePosition(oControlDomRef);
        assert.strictEqual(oPosition.top, 0, "The top position is correct");
        assert.strictEqual(oPosition.right, 0, "The right position is correct");
        const sState = ShellModel.getModel().getProperty("/floatingContainer/state");
        assert.strictEqual(sState, "docked:right", "The state is correct");

        assert.ok(oGlobalEventBus.publish.withArgs("launchpad", "shellFloatingContainerDockedIsResize").called, "The resize while docked event was published");
    });

    QUnit.test("with resize while docked:left", async function (assert) {
        // Arrange
        this.oStorage.put("floatingContainerStyle", "left: 50%; bottom: 50%; position: absolute; display: block;");
        this.oStorage.put("lastState", "docked:left");
        this.oComponent = await createComponent();
        const oControlDomRef = Element.getElementById("shell-floatingContainer").getDomRef();

        // Act
        resizeFixture(500, 800);

        // Assert
        const oPosition = getRelativePosition(oControlDomRef);
        assert.strictEqual(oPosition.top, 0, "The top position is correct");
        assert.strictEqual(oPosition.left, 0, "The left position is correct");
        const sState = ShellModel.getModel().getProperty("/floatingContainer/state");
        assert.strictEqual(sState, "docked:left", "The state is correct");

        assert.ok(oGlobalEventBus.publish.withArgs("launchpad", "shellFloatingContainerDockedIsResize").called, "The resize while docked event was published");
    });

    QUnit.test("with resize while docked:right until undock", async function (assert) {
        // Arrange
        this.oStorage.put("floatingContainerStyle", "left: 50%; bottom: 50%; position: absolute; display: block;");
        this.oStorage.put("lastState", "docked:right");
        this.oComponent = await createComponent();
        const oControlDomRef = Element.getElementById("shell-floatingContainer").getDomRef();

        // Act
        Device.media.getCurrentRange.returns({ name: "Tablet" });
        resizeFixture(500, 800);

        /*
         * When restoring from the storage, the floating container is docked.
         * In this case the position is not stored.
         * When undocked after resize the position is initially set to the top corner of the corresponding side.
         */

        // Assert
        const oPosition = getRelativePosition(oControlDomRef);
        assert.strictEqual(oPosition.top, 0, "The top position is correct");
        assert.strictEqual(oPosition.right, 0, "The right position is correct");
        const sState = ShellModel.getModel().getProperty("/floatingContainer/state");
        assert.strictEqual(sState, "floating", "The state is correct");

        assert.ok(oGlobalEventBus.publish.withArgs("launchpad", "shellFloatingContainerDockedIsResize").called, "The resize while docked event was published");
        assert.ok(oGlobalEventBus.publish.withArgs("launchpad", "shellFloatingContainerIsUnDocked").called, "The resize while docked event was published");
        assert.ok(oGlobalEventBus.publish.withArgs("launchpad", "shellFloatingContainerIsUnDockedOnResize").called, "The resize while docked event was published");
    });

    QUnit.test("with resize while docked:left until undock", async function (assert) {
        // Arrange
        this.oStorage.put("floatingContainerStyle", "left: 50%; bottom: 50%; position: absolute; display: block;");
        this.oStorage.put("lastState", "docked:left");
        this.oComponent = await createComponent();
        const oControlDomRef = Element.getElementById("shell-floatingContainer").getDomRef();

        // Act
        Device.media.getCurrentRange.returns({ name: "Tablet" });
        resizeFixture(500, 800);

        /*
         * When restoring from the storage, the floating container is docked.
         * In this case the position is not stored.
         * When undocked after resize the position is initially set to the top corner of the corresponding side.
         */

        // Assert
        const oPosition = getRelativePosition(oControlDomRef);
        assert.strictEqual(oPosition.top, 0, "The top position is correct");
        assert.strictEqual(oPosition.left, 0, "The left position is correct");
        const sState = ShellModel.getModel().getProperty("/floatingContainer/state");
        assert.strictEqual(sState, "floating", "The state is correct");

        assert.ok(oGlobalEventBus.publish.withArgs("launchpad", "shellFloatingContainerDockedIsResize").called, "The resize while docked event was published");
        assert.ok(oGlobalEventBus.publish.withArgs("launchpad", "shellFloatingContainerIsUnDocked").called, "The resize while docked event was published");
        assert.ok(oGlobalEventBus.publish.withArgs("launchpad", "shellFloatingContainerIsUnDockedOnResize").called, "The resize while docked event was published");
    });

    QUnit.test("with dragged while docked:right", async function (assert) {
        // Arrange
        this.oStorage.put("floatingContainerStyle", "left: 50%; bottom: 50%; position: absolute; display: block;");
        this.oStorage.put("lastState", "docked:right");
        this.oComponent = await createComponent();
        const oControlDomRef = Element.getElementById("shell-floatingContainer").getDomRef();

        // Act
        await dragContainerTo(-100, 0, {
            afterDrag: () => {
                const sState = ShellModel.getModel().getProperty("/floatingContainer/state");
                assert.strictEqual(sState, "floating", "The state is correct after drag");

                assert.strictEqual(this.oWrapperDomRef.style.display, "none", "The wrapper is hidden");
            }
        });

        // Assert
        const oPosition = getRelativePosition(oControlDomRef);
        assert.strictEqual(oPosition.top, 0, "The top position is correct");
        assert.ok(oPosition.bottom > 0, "The bottom position is correct");
        assert.strictEqual(oPosition.right, 100, "The right position is correct");
        const sState = ShellModel.getModel().getProperty("/floatingContainer/state");
        assert.strictEqual(sState, "floating", "The state is correct");

        assert.ok(oGlobalEventBus.publish.withArgs("launchpad", "shellFloatingContainerIsUnDocked").called, "The resize while docked event was published");
    });

    QUnit.test("with dragged while docked:left", async function (assert) {
        // Arrange
        this.oStorage.put("floatingContainerStyle", "left: 50%; bottom: 50%; position: absolute; display: block;");
        this.oStorage.put("lastState", "docked:left");
        this.oComponent = await createComponent();
        const oControlDomRef = Element.getElementById("shell-floatingContainer").getDomRef();

        // Act
        await dragContainerTo(100, 0, {
            afterDrag: () => {
                const sState = ShellModel.getModel().getProperty("/floatingContainer/state");
                assert.strictEqual(sState, "floating", "The state is correct after drag");

                assert.strictEqual(this.oWrapperDomRef.style.display, "none", "The wrapper is hidden");
            }
        });

        // Assert
        const oPosition = getRelativePosition(oControlDomRef);
        assert.strictEqual(oPosition.top, 0, "The top position is correct");
        assert.ok(oPosition.bottom > 0, "The bottom position is correct");
        assert.strictEqual(oPosition.left, 100, "The right position is correct");
        const sState = ShellModel.getModel().getProperty("/floatingContainer/state");
        assert.strictEqual(sState, "floating", "The state is correct");

        assert.ok(oGlobalEventBus.publish.withArgs("launchpad", "shellFloatingContainerIsUnDocked").called, "The resize while docked event was published");
    });

    QUnit.test("restores position after hide > show", async function (assert) {
        // Arrange
        this.oComponent = await createComponent();
        const oPositionBefore = getRelativePosition(this.oContent.getDomRef());

        StateManager.updateAllBaseStates("floatingContainer.visible", Operation.Set, false);
        await nextUIUpdate();

        assert.ok(this.oContent.getDomRef(), "The content is still rendered");

        // Act
        StateManager.updateAllBaseStates("floatingContainer.visible", Operation.Set, true);
        await nextUIUpdate();

        // Assert
        assert.ok(this.oContent.getDomRef(), "The content was rendered");

        const oPosition = getRelativePosition(this.oContent.getDomRef());
        assert.deepEqual(oPosition, oPositionBefore, "The position is the same");
    });

    QUnit.test("updates content while hidden", async function (assert) {
        // Arrange
        this.oComponent = await createComponent();
        const oPositionBefore = getRelativePosition(this.oContent.getDomRef());

        StateManager.updateAllBaseStates("floatingContainer.visible", Operation.Set, false);
        await nextUIUpdate();

        assert.ok(this.oContent.getDomRef(), "The content is still rendered");

        const oContent2 = new VBox({
            items: [
                new HBox({
                    height: "20px"
                })
            ],
            height: `${iFloatingContainerHeight}px`
        });

        // Act
        StateManager.updateAllBaseStates("floatingContainer.items", Operation.Set, [oContent2.getId()]);
        await nextUIUpdate();

        // Assert before showing
        assert.notOk(this.oContent.getDomRef(), "The content was not rendered");
        assert.ok(oContent2.getDomRef(), "The new content was rendered");

        StateManager.updateAllBaseStates("floatingContainer.visible", Operation.Set, true);
        await nextUIUpdate();

        // Assert after showing
        assert.notOk(this.oContent.getDomRef(), "The content was not rendered");
        assert.ok(oContent2.getDomRef(), "The new content was rendered");

        const oPosition = getRelativePosition(oContent2.getDomRef());
        assert.deepEqual(oPosition, oPositionBefore, "The position is the same");

        // Cleanup
        oContent2.destroy();
    });

    QUnit.test("updates content while docked", async function (assert) {
        // Arrange
        this.oStorage.put("floatingContainerStyle", "left: 0%; top: 0%; position: absolute; display: block;");
        this.oStorage.put("lastState", "docked:right");
        this.oComponent = await createComponent();
        const oPositionBefore = getRelativePosition(this.oContent.getDomRef());

        const oContent2 = new VBox({
            items: [
                new HBox({
                    height: "20px"
                })
            ],
            height: `${iFloatingContainerHeight}px`
        });

        // Act
        StateManager.updateAllBaseStates("floatingContainer.items", Operation.Set, [oContent2.getId()]);
        await nextUIUpdate();

        // Assert
        assert.notOk(this.oContent.getDomRef(), "The content was not rendered");
        assert.ok(oContent2.getDomRef(), "The new content was rendered");

        const oPosition = getRelativePosition(oContent2.getDomRef());
        assert.deepEqual(oPosition, oPositionBefore, "The position is the same");

        // Cleanup
        oContent2.destroy();
    });

    QUnit.test("updates content while floating", async function (assert) {
        // Arrange
        this.oStorage.put("floatingContainerStyle", "left: 50%; top: 50%; position: absolute; display: block;");
        this.oStorage.put("lastState", "floating");
        this.oComponent = await createComponent();
        const oPositionBefore = getRelativePosition(this.oContent.getDomRef());

        const oContent2 = new VBox({
            items: [
                new HBox({
                    height: "20px"
                })
            ],
            height: `${iFloatingContainerHeight}px`
        });

        // Act
        StateManager.updateAllBaseStates("floatingContainer.items", Operation.Set, [oContent2.getId()]);
        await nextUIUpdate();

        // Assert
        assert.notOk(this.oContent.getDomRef(), "The content was not rendered");
        assert.ok(oContent2.getDomRef(), "The new content was rendered");

        const oPosition = getRelativePosition(oContent2.getDomRef());
        assert.deepEqual(oPosition, oPositionBefore, "The position is the same");

        // Cleanup
        oContent2.destroy();
    });
});
