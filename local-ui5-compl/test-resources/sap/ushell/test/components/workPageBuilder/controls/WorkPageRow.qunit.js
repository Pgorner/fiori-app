// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.workPageBuilder.controls.WorkPageRow
 */
sap.ui.define([
    "sap/ushell/components/workPageBuilder/controls/WorkPageRow"
], function (
    WorkPageRow
) {
    "use strict";
    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox({});

    QUnit.module("WorkPageRow control", {
        beforeEach: function () {
            this.oWorkPageRowControl = new WorkPageRow();
        }
    });

    QUnit.test("instantiation works", function (assert) {
        assert.ok(this.oWorkPageRowControl.isA("sap.ushell.components.workPageBuilder.controls.WorkPageRow"), "The control was instantiated.");

        assert.strictEqual(this.oWorkPageRowControl.getEditMode(), false, "The editMode property exists");
        assert.strictEqual(this.oWorkPageRowControl.getMaxColumns(), 4, "The maxColumns property exists");
        assert.strictEqual(this.oWorkPageRowControl.getAddRowButtonTooltip(), "", "The addRowButtonTooltip property exists");
        assert.strictEqual(this.oWorkPageRowControl.getColumnMinFlex(), 4, "The columnMinFlex property exists");
        assert.deepEqual(this.oWorkPageRowControl.getAriaLabel(), "", "The ariaLabel property exists");
        assert.deepEqual(this.oWorkPageRowControl.getColumns(), [], "The columns aggregation exists");
        assert.deepEqual(this.oWorkPageRowControl.getHeaderBar(), null, "The headerBar aggregation exists");
        assert.deepEqual(this.oWorkPageRowControl.getControlButtons(), [], "The controlButtons aggregation exists");
        assert.deepEqual(this.oWorkPageRowControl.getTitle(), null, "The title aggregation exists");
        assert.deepEqual(this.oWorkPageRowControl.getAggregation("_addButtonBottom"), null, "The _addButtonBottom aggregation exists");
        assert.deepEqual(this.oWorkPageRowControl.getAggregation("_addButtonTop"), null, "The _addButtonTop aggregation exists");
        assert.deepEqual(this.oWorkPageRowControl.getMessageStrip(), null, "The messageStrip aggregation exists");
        assert.strictEqual(this.oWorkPageRowControl._oColumnsChangeDetection.isA("sap.ushell.ui.launchpad.ExtendedChangeDetection"), true, "The ExtendedChangeDetection was initialized.");

        assert.ok(this.oWorkPageRowControl.getMetadata().getEvent("addRow"), "The addRow event exists");
    });

    QUnit.test("exit", function (assert) {
        // Act
        this.oWorkPageRowControl.exit();

        // Assert
        assert.strictEqual(this.oWorkPageRowControl._oColumnsChangeDetection.isDestroyed(), true, "The ExtendedChangeDetection was destroyed.");
    });

    QUnit.test("returns the expected value for single column width", function (assert) {
        sandbox.stub(this.oWorkPageRowControl, "getDomRef").returns({
            querySelector: sandbox.stub().returns({
                offsetWidth: 2400
            })
        });

        var fResult = this.oWorkPageRowControl.getSingleColumnWidth();
        assert.strictEqual(fResult, 100, "The expected result was returned");
    });

    QUnit.test("returns the expected value for single column width if domref is undefined", function (assert) {
        sandbox.stub(this.oWorkPageRowControl, "getDomRef").returns(undefined);

        var fResult = this.oWorkPageRowControl.getSingleColumnWidth();
        assert.strictEqual(fResult, 1, "The expected result was returned");
    });

    QUnit.test("returns the expected value for single column width if innderdomref is undefined", function (assert) {
        sandbox.stub(this.oWorkPageRowControl, "getDomRef").returns({
            querySelector: sandbox.stub().returns(undefined)
        });

        var fResult = this.oWorkPageRowControl.getSingleColumnWidth();
        assert.strictEqual(fResult, 1, "The expected result was returned");
    });

    QUnit.test("creates and saves the add buttons", function (assert) {
        // Arrange
        this.oWorkPageRowControl.getAddButton("top");
        this.oWorkPageRowControl.getAddButton("bottom");

        // Act
        var oAddButtonBottom = this.oWorkPageRowControl.getAggregation("_addButtonBottom");
        var oAddButtonTop = this.oWorkPageRowControl.getAggregation("_addButtonTop");

        // Assert
        assert.ok(oAddButtonBottom.isA("sap.ushell.components.workPageBuilder.controls.WorkPageButton"), "The bottom button was created.");
        assert.ok(oAddButtonTop.isA("sap.ushell.components.workPageBuilder.controls.WorkPageButton"), "The top button was created.");
        assert.strictEqual(oAddButtonTop.getIcon(), "sap-icon://add", "The top button has the correct icon.");
        assert.strictEqual(oAddButtonBottom.getIcon(), "sap-icon://add", "The bottom button has the correct icon.");
    });

    QUnit.test("getIndex works", function (assert) {
        // Arrange
        sandbox.stub(this.oWorkPageRowControl, "getParent").returns({
            indexOfAggregation: sandbox.stub().returns(5)
        });

        // Act
        var iIndex = this.oWorkPageRowControl.getIndex();

        // Assert
        assert.strictEqual(iIndex, 5, "The expected index was returned.");
    });


    QUnit.test("getCappedColumnCount returns the correct amount for edit mode", function (assert) {
        // Arrange
        sandbox.stub(this.oWorkPageRowControl, "getColumns").returns([
            { col: 1 },
            { col: 2 },
            { col: 3 },
            { col: 4 },
            { col: 5 },
            { col: 6 }
        ]);

        sandbox.stub(this.oWorkPageRowControl, "getEditMode").returns(true);

        // Act
        var iAmount = this.oWorkPageRowControl.getCappedColumnCount();

        // Assert
        assert.strictEqual(iAmount, 6, "The expected amount was returned.");
    });

    QUnit.test("getCappedColumnCount caps the amount for display mode", function (assert) {
        // Arrange
        sandbox.stub(this.oWorkPageRowControl, "getColumns").returns([
            { col: 1 },
            { col: 2 },
            { col: 3 },
            { col: 4 },
            { col: 5 },
            { col: 6 }
        ]);

        sandbox.stub(this.oWorkPageRowControl, "getEditMode").returns(false);
        sandbox.stub(this.oWorkPageRowControl, "getMaxColumns").returns(4);

        // Act
        var iAmount = this.oWorkPageRowControl.getCappedColumnCount();

        // Assert
        assert.strictEqual(iAmount, 4, "The expected amount was returned.");
    });


    QUnit.test("getGridLayoutString", function (assert) {
        // Arrange
        this.oGetColumnFlexValuesStub = sandbox.stub(this.oWorkPageRowControl, "getColumnFlexValues");
        this.oGetColumnFlexValuesStub.onCall(0).returns([12, 8, 4]);
        this.oGetColumnFlexValuesStub.onCall(1).returns([24]);
        this.oGetColumnFlexValuesStub.onCall(2).returns([1]);
        this.oGetColumnFlexValuesStub.onCall(3).returns([1, 1, 1, 1]);
        this.oGetColumnFlexValuesStub.onCall(4).returns([12, 12]);
        this.oGetColumnFlexValuesStub.onCall(5).returns([]);

        // Act
        var aResults = [
            this.oWorkPageRowControl.getGridLayoutString(),
            this.oWorkPageRowControl.getGridLayoutString(),
            this.oWorkPageRowControl.getGridLayoutString(),
            this.oWorkPageRowControl.getGridLayoutString(),
            this.oWorkPageRowControl.getGridLayoutString(),
            this.oWorkPageRowControl.getGridLayoutString()
        ];

        // Assert
        assert.deepEqual(aResults, [
            "12-8-4",
            "24",
            "1",
            "1-1-1-1",
            "12-12",
            ""
        ], "The expected result was returned.");
    });

    QUnit.test("setGridLayoutString", function (assert) {
        this.oInnerDomRef = {
            dataset: {
                wpGridLayout: "10-12"
            }
        };

        sandbox.stub(this.oWorkPageRowControl, "getDomRef").returns({
            querySelector: sandbox.stub().returns(this.oInnerDomRef)
        });

        this.oWorkPageRowControl.setGridLayoutString([12, 12]);

        assert.strictEqual(this.oInnerDomRef.dataset.wpGridLayout, "12-12", "The expected string was set.");
    });
});
