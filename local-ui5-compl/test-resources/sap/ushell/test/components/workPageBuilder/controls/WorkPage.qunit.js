// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.workPageBuilder.controls.WorkPage
 */
sap.ui.define([
    "sap/ushell/components/workPageBuilder/controls/WorkPage"
], function (
    WorkPage
) {
    "use strict";
    /* global QUnit */

    QUnit.module("WorkPage control", {
        beforeEach: function () {
            this.oWorkPageControl = new WorkPage();
        }
    });

    QUnit.test("instantiation works", function (assert) {
        // Assert
        assert.ok(this.oWorkPageControl, "The control was instantiated.");
        assert.ok(this.oWorkPageControl.isA("sap.ushell.components.workPageBuilder.controls.WorkPage"), "The control has the correct type.");
        assert.strictEqual(this.oWorkPageControl.getEditMode(), false, "The control has the correct property for editMode.");
        assert.strictEqual(this.oWorkPageControl.getBreakpoint(), "lt-lp-4", "The control has the correct property for breakpoint.");
        assert.strictEqual(this.oWorkPageControl.getEmptyIllustrationTitle(), "", "The control has the correct properties for illustration title.");
        assert.strictEqual(this.oWorkPageControl.getEmptyIllustrationMessage(), "", "The control has the correct property for empty illustration message.");
        assert.strictEqual(this.oWorkPageControl.getEmptyIllustrationButtonText(), "", "The control has the correct property for empty button text.");
        assert.strictEqual(this.oWorkPageControl.getLoaded(), false, "The control has the correct property for loaded.");
        assert.deepEqual(this.oWorkPageControl.getRows(), [], "The control has the correct aggregation for rows.");
        assert.strictEqual(this.oWorkPageControl.getTitle(), null, "The control has the correct aggregation for title.");
        assert.strictEqual(this.oWorkPageControl.getAggregation("_emptyIllustration"), null, "The control has the private aggregation for _emptyIllustration.");
        assert.strictEqual(this.oWorkPageControl._oRowsChangeDetection.isA("sap.ushell.ui.launchpad.ExtendedChangeDetection"), true, "The ExtendedChangeDetection was initialized.");
        assert.strictEqual(this.oWorkPageControl.getShowTitle(), true, "The control has the correct property for showTitle.");
    });

    QUnit.test("exit", function (assert) {
        // Act
        this.oWorkPageControl.exit();

        // Assert
        assert.strictEqual(this.oWorkPageControl._oRowsChangeDetection.isDestroyed(), true, "The ExtendedChangeDetection was destroyed.");
    });

    QUnit.test("creates and saves an illustrated message", function (assert) {
        // Act
        this.oWorkPageControl.getIllustratedMessage();

        // Assert
        assert.ok(this.oWorkPageControl.getAggregation("_emptyIllustration").isA("sap.m.IllustratedMessage"), "The IllustratedMessage was created.");
    });

});
