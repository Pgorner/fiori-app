// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.workPageBuilder.controls.WorkPageCell
 */
sap.ui.define([
    "sap/ushell/components/workPageBuilder/controls/WorkPageCell",
    "sap/ui/core/ResizeHandler",
    "sap/ui/integration/widgets/Card"
], function (
    WorkPageCell,
    ResizeHandler,
    Card
) {
    "use strict";
    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox({});

    QUnit.module("WorkPageCell control", {
        beforeEach: function () {
            this.oWorkPageCellControl = new WorkPageCell();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("instantiation works", function (assert) {
        assert.ok(this.oWorkPageCellControl, "The control was instantiated.");
        assert.strictEqual(this.oWorkPageCellControl.getDeleteWidgetTooltip(), "", "The control has the expected properties.");
        assert.strictEqual(this.oWorkPageCellControl.getAddApplicationButtonText(), "", "The control has the expected properties.");
        assert.strictEqual(this.oWorkPageCellControl.getEditMode(), false, "The control has the expected properties.");
        assert.strictEqual(this.oWorkPageCellControl.getTileMode(), false, "The control has the expected properties.");
        assert.strictEqual(this.oWorkPageCellControl.getGridContainerGap(), "0.5rem", "The control has the expected properties.");
        assert.strictEqual(this.oWorkPageCellControl.getGridContainerRowSize(), "5.25rem", "The control has the expected properties.");
        assert.strictEqual(this.oWorkPageCellControl.getEmptyIllustrationTitle(), "", "The control has the expected properties.");
        assert.strictEqual(this.oWorkPageCellControl.getEmptyIllustrationMessage(), "", "The control has the expected properties.");

        assert.deepEqual(this.oWorkPageCellControl.getWidgets(), [], "The control has the expected public aggregations.");
        // assert.deepEqual(this.oWorkPageCellControl.getHeaderBar(), [], "The control has the expected public aggregations.");

        assert.ok(this.oWorkPageCellControl.getMetadata().getEvent("moveVisualization"), "The moveVisualization event is defined.");
        assert.ok(this.oWorkPageCellControl.getMetadata().getEvent("gridColumnsChange"), "The gridColumnsChange event is defined.");
        assert.ok(this.oWorkPageCellControl.getMetadata().getEvent("gridContainerBorderReached"), "The gridContainerBorderReached event is defined.");
        assert.ok(this.oWorkPageCellControl._oWidgetsChangeDetection.isA("sap.ushell.ui.launchpad.ExtendedChangeDetection"), "The change detection was initialized.");
    });

    QUnit.test("creates and saves a GridContainer", function (assert) {
        // Act
        this.oWorkPageCellControl.getGridContainer();

        // Assert
        assert.ok(this.oWorkPageCellControl.getAggregation("_gridContainer").isA("sap.f.GridContainer"), "The GridContainer was created and saved.");
    });

    QUnit.test("configures the GridContainer correctly", function (assert) {
        // Act
        var oGridContainer = this.oWorkPageCellControl.getGridContainer();

        // Assert
        assert.strictEqual(oGridContainer.getInlineBlockLayout(), true, "inlineBlockLayout was set to true");
        assert.strictEqual(oGridContainer.getSnapToRow(), false, "snapToRow was set to false");
        assert.strictEqual(oGridContainer.getMinHeight(), "0", "minHeight was set to 0");
        assert.strictEqual(oGridContainer.getContainerQuery(), false, "containerQuery was set to false");
    });

    QUnit.test("removes DnD from GridContainer if not tile edit mode", function (assert) {
        // Arrange
        this.oWorkPageCellControl.setTileMode(false);
        var oStubbedGridContainer = this.oWorkPageCellControl._createGridContainer();

        sandbox.stub(oStubbedGridContainer, "getItems").returns([
            { testItem: "1" },
            { testItem: "2" }
        ]);

        this.oWorkPageCellControl.setAggregation("_gridContainer", oStubbedGridContainer);


        // Act
        var oGridContainer = this.oWorkPageCellControl.getGridContainer();

        // Assert
        assert.strictEqual(oGridContainer.getDragDropConfig().length, 0, "No DragDropConfig was added");
    });

    QUnit.test("removes DnD from GridContainer if there are no items", function (assert) {
        // Arrange
        this.oWorkPageCellControl.setTileMode(false);
        var oStubbedGridContainer = this.oWorkPageCellControl._createGridContainer();

        sandbox.stub(oStubbedGridContainer, "getItems").returns([]);

        this.oWorkPageCellControl.setAggregation("_gridContainer", oStubbedGridContainer);

        // Act
        var oGridContainer = this.oWorkPageCellControl.getGridContainer();

        // Assert
        assert.strictEqual(oGridContainer.getDragDropConfig().length, 0, "No DragDropConfig was added");
    });

    QUnit.test("adds DnD to GridContainer if tileMode and editMode and there are items", function (assert) {
        // Arrange
        this.oWorkPageCellControl.setTileMode(true);
        this.oWorkPageCellControl.setEditMode(true);
        var oStubbedGridContainer = this.oWorkPageCellControl._createGridContainer();

        sandbox.stub(oStubbedGridContainer, "getItems").returns([
            { testItem: "1" },
            { testItem: "2" }
        ]);

        this.oWorkPageCellControl.setAggregation("_gridContainer", oStubbedGridContainer);

        // Act
        var oGridContainer = this.oWorkPageCellControl.getGridContainer();

        // Assert
        assert.strictEqual(oGridContainer.getDragDropConfig().length, 2, "The DragDropConfig was added");
    });

    QUnit.test("Does not add DnD twice to GridContainer if tileMode and editMode and there are items", function (assert) {
        // Arrange
        this.oWorkPageCellControl.setTileMode(true);
        this.oWorkPageCellControl.setEditMode(true);
        var oStubbedGridContainer = this.oWorkPageCellControl._createGridContainer();

        sandbox.stub(oStubbedGridContainer, "getItems").returns([
            { testItem: "1" },
            { testItem: "2" }
        ]);

        this.oWorkPageCellControl.setAggregation("_gridContainer", oStubbedGridContainer);

        // Act
        this.oWorkPageCellControl.getGridContainer();
        var oGridContainer = this.oWorkPageCellControl.getGridContainer();

        // Assert
        assert.strictEqual(oGridContainer.getDragDropConfig().length, 2, "The DragDropConfig was added once.");
    });

    QUnit.module("exit", {
        beforeEach: function () {
            this.oWorkPageCellControl = new WorkPageCell();
            this.oDeregisterStub = sandbox.stub(this.oWorkPageCellControl, "_deregisterResizeHandles");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("destroys the ExtendedChangeDetection listeners", function (assert) {
        this.oWorkPageCellControl.exit();

        assert.strictEqual(this.oWorkPageCellControl._oWidgetsChangeDetection.isDestroyed(), true, "The ExtendedChangeDetection was destroyed.");
        assert.ok(this.oDeregisterStub.calledOnce, "_deregisterResizeHandles was called");
    });

    QUnit.module("_deregisterResizeHandles", {
        beforeEach: function () {
            this.oWorkPageCellControl = new WorkPageCell();

            this.oWorkPageCellControl._aRegistrationIds = [
                "test-id-1",
                "test-id-2",
                "test-id-3"
            ];

            this.oDeregisterStub = sandbox.stub(ResizeHandler, "deregister");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("calls deregister on all registered ResizeHandlers", function (assert) {
        this.oWorkPageCellControl._deregisterResizeHandles();

        assert.strictEqual(this.oDeregisterStub.callCount, 3, "deregister was called 3 times.");
        assert.strictEqual(this.oDeregisterStub.firstCall.args[0], "test-id-1", "deregister was called with the expected arguments.");
        assert.strictEqual(this.oDeregisterStub.secondCall.args[0], "test-id-2", "deregister was called with the expected arguments.");
        assert.strictEqual(this.oDeregisterStub.thirdCall.args[0], "test-id-3", "deregister was called with the expected arguments.");
    });

    QUnit.module("insertAggregation", {
        beforeEach: function () {
            this.oWorkPageCellControl = new WorkPageCell();
            this.oRegisterStub = sandbox.stub(ResizeHandler, "register");
            this.oIsAStub = sandbox.stub();
            this.oIsAStub.withArgs("sap.ui.integration.widgets.Card").returns(true);
            this.oCard = new Card();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("registers a ResizeHandler if the control is a card", function (assert) {
        // Arrange
        this.oRegisterStub.returns("test-register-id");

        // Act
        this.oWorkPageCellControl.insertAggregation("widgets", this.oCard);

        // Assert
        assert.ok(this.oRegisterStub.calledOnce, "register was called once");
        assert.deepEqual(this.oWorkPageCellControl._aRegistrationIds, ["test-register-id"], "The registration id was saved");
    });

    QUnit.module("_resizeCard", {
        beforeEach: function () {
            this.oSetWidthStub = sandbox.stub();
            this.oCard = {
                setWidth: this.oSetWidthStub
            };
            this.oWorkPageCellControl = new WorkPageCell();

            sandbox.stub(this.oWorkPageCellControl, "getAggregation").returns({
                getDomRef: sandbox.stub().returns({
                    test: "domRef"
                })
            });

            sandbox.stub(window, "getComputedStyle").returns({
                width: 111
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("calls setWidth on the card with the expected arguments", function (assert) {
        // Act
        this.oWorkPageCellControl._resizeCard(this.oCard, this.oEvent);

        // Assert
        assert.ok(this.oSetWidthStub.calledOnce, "setWidth was called once.");
        assert.strictEqual(this.oSetWidthStub.firstCall.args[0], "111px", "setWidth was called with the expected arguments.");
    });

    QUnit.module("onDrop", {
        beforeEach: function () {
            this.oWorkPageCellControl = new WorkPageCell();
            this.oFireEventStub = sandbox.stub(this.oWorkPageCellControl, "fireEvent");
            this.oEvent = {
                getParameters: sandbox.stub().returns({
                    test: "param"
                })
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("calls fireEvent and passes the parameters", function (assert) {
        this.oWorkPageCellControl.onDrop(this.oEvent);

        assert.ok(this.oFireEventStub.calledWith("moveVisualization", {
            test: "param"
        }), "fireEvent was called with the expected arguments.");
    });

    QUnit.module("The function getIllustratedMessage", {
        beforeEach: function () {
            this.oWorkPageCellControl = new WorkPageCell();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("creates and saves an illustrated message", function (assert) {
        // Act
        this.oWorkPageCellControl.getIllustratedMessage();

        // Assert
        assert.ok(this.oWorkPageCellControl.getAggregation("_emptyIllustration").isA("sap.m.IllustratedMessage"), "The IllustratedMessage was created.");
    });
});
