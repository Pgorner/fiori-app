// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.workPageBuilder.controls.WorkPageColumnResizer
 */
sap.ui.define([
    "sap/ushell/components/workPageBuilder/controls/WorkPageColumnResizer"
], function (
    WorkPageColumnResizer
) {
    "use strict";
    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox({});

    QUnit.module("WorkPageColumnResizer control", {
        beforeEach: function () {
            this.oWorkPageColumnResizerControl = new WorkPageColumnResizer();
        }
    });

    QUnit.test("instantiation works", function (assert) {
        // Assert
        assert.ok(this.oWorkPageColumnResizerControl.isA("sap.ushell.components.workPageBuilder.controls.WorkPageColumnResizer"), "The control was instantiated.");
        assert.ok(this.oWorkPageColumnResizerControl.getMetadata().getEvent("resizerMoved"), "The resizerMoved event was defined");
        assert.ok(this.oWorkPageColumnResizerControl.getMetadata().getEvent("resizerReleased"), "The resizerReleased event was defined");
    });

    QUnit.test("fires the resizerReleased event", function (assert) {
        // Arrange
        assert.expect(1);

        // Act
        this.oWorkPageColumnResizerControl.attachEvent("resizerReleased", function () {

            // Assert
            assert.ok(true, "The resizerReleased event was fired.");
        });

        this.oWorkPageColumnResizerControl.mouseUp();
    });

    QUnit.test("fires the resizerMoved event", function (assert) {
        // Arrange
        var oEvent = {
            pageX: 100
        };
        sandbox.stub(this.oWorkPageColumnResizerControl, "getXOrigin").returns(50);
        assert.expect(2);

        // Act
        this.oWorkPageColumnResizerControl.attachEvent("resizerMoved", function (event) {

            // Assert
            assert.ok(true, "The resizerReleased event was fired.");
            assert.strictEqual(event.getParameter("posXDiff"), 50, "The posXDiff parameter has the expected value.");
        });

        this.oWorkPageColumnResizerControl.mouseMove(oEvent);
    });

    QUnit.test("getXOrigin returns the expected number", function (assert) {
        // Arrange
        sandbox.stub(this.oWorkPageColumnResizerControl, "$").returns({
            get: sandbox.stub().returns({
                getBoundingClientRect: sandbox.stub().returns({
                    x: 10,
                    width: 100
                })
            })
        });

        // Act
        var fResult = this.oWorkPageColumnResizerControl.getXOrigin();

        // Assert
        assert.strictEqual(fResult, 60, "The expected result was returned");
    });

    QUnit.test("getXOrigin returns the expected number", function (assert) {
        // Arrange
        sandbox.stub(this.oWorkPageColumnResizerControl, "$").returns({
            get: sandbox.stub().returns({
                getBoundingClientRect: sandbox.stub().returns({
                    x: -150,
                    width: 200
                })
            })
        });

        // Act
        var fResult = this.oWorkPageColumnResizerControl.getXOrigin();

        // Assert
        assert.strictEqual(fResult, -50, "The expected result was returned");
    });

    QUnit.test("onkeydown fires event if the left arrow is pressed", function (assert) {
        // Arrange
        this.oEvent = {
            keyCode: 37
        };

        assert.expect(3);

        sandbox.stub(this.oWorkPageColumnResizerControl, "getParent").returns({
            getParent: sandbox.stub().returns({
                getSingleColumnWidth: sandbox.stub().returns(50)
            })
        });

        this.oWorkPageColumnResizerControl.attachResizerMoved(function (oEvent) {
            assert.ok(true, "resizerMoved was called.");
            assert.strictEqual(oEvent.getParameter("posXDiff"), -50, "resizerMoved was called with the expected parameter");
        });

        this.oWorkPageColumnResizerControl.attachResizerReleased(function (oEvent) {
            assert.ok(true, "resizerReleased was called.");
        });

        // Act
        this.oWorkPageColumnResizerControl.onkeydown(this.oEvent);
    });

    QUnit.test("onkeydown fires event if the right arrow is pressed", function (assert) {
        // Arrange
        this.oEvent = {
            keyCode: 39
        };

        assert.expect(3);

        sandbox.stub(this.oWorkPageColumnResizerControl, "getParent").returns({
            getParent: sandbox.stub().returns({
                getSingleColumnWidth: sandbox.stub().returns(50)
            })
        });

        this.oWorkPageColumnResizerControl.attachResizerMoved(function (oEvent) {
            assert.ok(true, "resizerMoved was called.");
            assert.strictEqual(oEvent.getParameter("posXDiff"), 50, "resizerMoved was called with the expected parameter");
        });

        this.oWorkPageColumnResizerControl.attachResizerReleased(function (oEvent) {
            assert.ok(true, "resizerReleased was called.");
        });

        // Act
        this.oWorkPageColumnResizerControl.onkeydown(this.oEvent);
    });
});
