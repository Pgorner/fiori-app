// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.workPageBuilder.controls.WorkPageColumn
 */
sap.ui.define([
    "sap/ushell/components/workPageBuilder/controls/WorkPageColumn"
], function (
    WorkPageColumn
) {
    "use strict";
    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox({});


    QUnit.module("WorkPageColumn control", {
        beforeEach: function () {
            this.oWorkPageColumnControl = new WorkPageColumn();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("instantiation works", function (assert) {
        // Assert
        assert.ok(this.oWorkPageColumnControl, "The control was instantiated.");
        assert.strictEqual(this.oWorkPageColumnControl.getColumnWidth(), 24, "The control has the property columnWidth.");
        assert.strictEqual(this.oWorkPageColumnControl.getAriaLabelPlaceholder(), "", "The control has the property ariaLabelPlaceholder.");
        assert.strictEqual(this.oWorkPageColumnControl.getEditMode(), false, "The control has the property editMode.");
        assert.strictEqual(this.oWorkPageColumnControl.getDeleteColumnButtonTooltip(), "", "The control has the property deleteColumnButtonTooltip.");
        assert.strictEqual(this.oWorkPageColumnControl.getAddColumnButtonTooltip(), "", "The control has the property addColumnButtonTooltip.");
        assert.strictEqual(this.oWorkPageColumnControl.getAddWidgetButtonText(), "", "The control has the property addWidgetButtonText.");
        assert.deepEqual(this.oWorkPageColumnControl.getCells(), [], "The control has the aggregation cells.");

        assert.ok(this.oWorkPageColumnControl.getMetadata().getEvent("addColumn"), "The addColumn event is defined.");
        assert.ok(this.oWorkPageColumnControl.getMetadata().getEvent("addWidget"), "The addWidget event is defined.");
        assert.ok(this.oWorkPageColumnControl.getMetadata().getEvent("removeColumn"), "The removeColumn event is defined.");
        assert.ok(this.oWorkPageColumnControl.getMetadata().getEvent("columnResized"), "The columnResized event is defined.");
        assert.ok(this.oWorkPageColumnControl.getMetadata().getEvent("columnResizeCompleted"), "The columnResizeCompleted event is defined.");

        assert.strictEqual(this.oWorkPageColumnControl._oCellsChangeDetection.isA("sap.ushell.ui.launchpad.ExtendedChangeDetection"), true, "The ExtendedChangeDetection was initialized.");

    });

    QUnit.test("exit", function (assert) {
        // Act
        this.oWorkPageColumnControl.exit();

        // Assert
        assert.strictEqual(this.oWorkPageColumnControl._oCellsChangeDetection.isDestroyed(), true, "The ExtendedChangeDetection was destroyed.");
    });

    QUnit.test("creates a resizer control", function (assert) {
        // Assert
        assert.ok(this.oWorkPageColumnControl._oResizer.isA("sap.ushell.components.workPageBuilder.controls.WorkPageColumnResizer"), "The resizer was created");
    });

    QUnit.test("returns the resizer control", function (assert) {
        // Assert
        assert.ok(this.oWorkPageColumnControl.getResizer().isA("sap.ushell.components.workPageBuilder.controls.WorkPageColumnResizer"), "The resizer was created");
    });


    QUnit.test("creates and saves the delete button", function (assert) {
        // Act
        this.oWorkPageColumnControl.getDeleteButton();
        var oButton = this.oWorkPageColumnControl.getAggregation("_deleteButton");

        // Assert
        assert.expect(3);
        assert.ok(oButton.isA("sap.m.Button"), "The delete button was created");
        assert.strictEqual(oButton.getIcon(), "sap-icon://delete", "The delete button had the correct icon.");

        this.oWorkPageColumnControl.attachEvent("removeColumn", function () {
           assert.ok(true, "The remove event was fired");
        });

        oButton.firePress();
    });

    QUnit.test("creates and saves the add buttons", function (assert) {
        // Act
        this.oWorkPageColumnControl.getAddButton("left");
        this.oWorkPageColumnControl.getAddButton("right");

        var oButtonLeft = this.oWorkPageColumnControl.getAggregation("_addButtonLeft");
        var oButtonRight = this.oWorkPageColumnControl.getAggregation("_addButtonRight");

        // Assert
        assert.expect(6);
        assert.ok(oButtonLeft.isA("sap.ushell.components.workPageBuilder.controls.WorkPageButton"), "The left button was created");
        assert.ok(oButtonRight.isA("sap.ushell.components.workPageBuilder.controls.WorkPageButton"), "The right button was created");
        assert.strictEqual(oButtonLeft.getIcon(), "sap-icon://add", "The left button had the correct icon.");
        assert.strictEqual(oButtonRight.getIcon(), "sap-icon://add", "The right button had the correct icon.");

        this.oWorkPageColumnControl.attachEvent("addColumn", function () {
            assert.ok(true, "The add event was fired");
        });

        oButtonLeft.firePress();
        oButtonRight.firePress();
    });

    QUnit.test("Fires 'columnResized' event if resizer is moved", function (assert) {
        // Arrange
        assert.expect(1);
        this.oWorkPageColumnControl.attachEvent("columnResized", function () {
            // Assert
            assert.ok(true, "columnResized was fired");
        });

        // Act
        this.oWorkPageColumnControl._oResizer.fireEvent("resizerMoved");
    });

    QUnit.test("Fires 'columnResizeCompleted' event if resizer is released", function (assert) {
        // Arrange
        assert.expect(1);
        this.oWorkPageColumnControl.attachEvent("columnResizeCompleted", function () {
            // Assert
            assert.ok(true, "columnResizeCompleted was fired");
        });

        // Act
        this.oWorkPageColumnControl._oResizer.fireEvent("resizerReleased");
    });

    QUnit.test("creates and saves the addWidget button", function (assert) {
        // Act
        this.oWorkPageColumnControl.getAddWidgetButton();
        var oButton = this.oWorkPageColumnControl.getAggregation("_addWidgetButton");

        // Assert
        assert.expect(2);
        assert.ok(oButton.isA("sap.m.Button"), "The addWidget button was created");

        this.oWorkPageColumnControl.attachEvent("addWidget", function () {
            assert.ok(true, "The addWidget event was fired");
        });

        oButton.firePress();
    });

    QUnit.test("getCappedColumnCount returns the capped column count", function (assert) {
        // Arrange
        sandbox.stub(this.oWorkPageColumnControl, "getParent").returns({
            getCappedColumnCount: sandbox.stub().returns(4)
        });
        // Act
        var iResult = this.oWorkPageColumnControl.getCappedColumnCount();
        assert.strictEqual(iResult, 4, "The result was correct.");
    });

    QUnit.test("getIndex returns the index", function (assert) {
        // Arrange
        sandbox.stub(this.oWorkPageColumnControl, "getParent").returns({
            indexOfAggregation: sandbox.stub().returns(4)
        });
        // Act
        var iResult = this.oWorkPageColumnControl.getIndex();
        assert.strictEqual(iResult, 4, "The result was correct.");
    });

    QUnit.test("getMaxColumns returns the max columns", function (assert) {
        // Arrange
        sandbox.stub(this.oWorkPageColumnControl, "getParent").returns({
            getMaxColumns: sandbox.stub().returns(4)
        });
        // Act
        var iResult = this.oWorkPageColumnControl.getMaxColumns();
        assert.strictEqual(iResult, 4, "The result was correct.");
    });

});
