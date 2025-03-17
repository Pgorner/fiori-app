// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.workPageBuilder.controls.WorkPageButton
 */
sap.ui.define([
    "sap/ushell/components/workPageBuilder/controls/WorkPageButton"
], function (
    WorkPageButton
) {
    "use strict";
    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox({});

    QUnit.module("WorkPageButton control", {
        beforeEach: function () {
            this.oWorkPageButtonControl = new WorkPageButton();
        }
    });

    QUnit.test("instantiation works", function (assert) {
        // Assert
        assert.ok(this.oWorkPageButtonControl, "The control was instantiated.");
        assert.strictEqual(this.oWorkPageButtonControl.getIcon(), "", "The control has the correct property for icon.");
        assert.strictEqual(this.oWorkPageButtonControl.getTooltip(), null, "The control has the correct property for tooltip.");
        assert.strictEqual(this.oWorkPageButtonControl.getAggregation("_icon"), null, "The control has the correct aggregation for _icon.");
        assert.ok(this.oWorkPageButtonControl.getMetadata().getEvent("press"), "The press event is defined.");
    });

    QUnit.test("creates and saves an icon control", function (assert) {
        this.oWorkPageButtonControl.getIconControl();
        assert.ok(this.oWorkPageButtonControl.getAggregation("_icon").isA("sap.ui.core.Icon"), "The icon control was created.");
    });

    QUnit.test("fires the press event", function (assert) {
        // Arrange
        var oEvent = {
            preventDefault: sandbox.stub(),
            stopPropagation: sandbox.stub()
        };

        // Assert
        assert.expect(3);
        this.oWorkPageButtonControl.attachEvent("press", function () {
            assert.ok(true, "press was fired");
        });

        // Act
        this.oWorkPageButtonControl.onClick(oEvent);

        // Assert
        assert.ok(oEvent.preventDefault.calledOnce, "preventDefault was called on the event.");
        assert.ok(oEvent.stopPropagation.calledOnce, "stopPropagation was called on the event.");
    });

});
