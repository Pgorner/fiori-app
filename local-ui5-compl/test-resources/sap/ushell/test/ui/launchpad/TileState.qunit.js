// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileoverview QUnit tests for "sap.ushell.ui.launchpad.TileState"
 * @deprecated since 1.120
 */
sap.ui.define([
    "sap/ushell/ui/launchpad/FailedTileDialog",
    "sap/ushell/ui/launchpad/TileState"
], function (
    FailedTileDialog,
    TileState
) {
    "use strict";

    var sandbox = sinon.createSandbox({});

    /* global QUnit, sinon */

    QUnit.module("_onPress()", {
        beforeEach: function () {
            this.oTileState = new TileState();
            this.oTileState.FailedTileDialog = new FailedTileDialog();
            this.openForStub = sinon.stub(this.oTileState.FailedTileDialog, "openFor");
        }
    });

    QUnit.test("Calls \"FailedTileDialog.openFor()\" when the \"state\" is \"Failed\"", function (assert) {
        // Arrange
        this.oTileState.setState("Failed");

        // Act
        this.oTileState._onPress();

        // Assert
        assert.ok(this.openForStub.called, "The method was called");
    });

    QUnit.test("Does not call \"FailedTileDialog.openFor()\" when the \"state\" is not \"Failed\"", function (assert) {
        // Arrange
        this.oTileState.setState("Loaded");

        // Act
        this.oTileState._onPress();

        // Assert
        assert.ok(this.openForStub.notCalled, "The method was not called");
    });

    QUnit.module("_getBusyContainer", {
        beforeEach: function () {
            this.oTileState = new TileState();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Creates a new BusyContainer", function (assert) {
        // Arrange
        var sExpectedContent = "<div class='sapUshellTileStateLoading'><div>";
        // Act
        var oBusyContainer = this.oTileState._getBusyContainer();
        // Assert
        assert.strictEqual(oBusyContainer.getMetadata().getName(), "sap.ui.core.HTML", "Returned a BusyContainer");
        assert.strictEqual(oBusyContainer.getContent(), sExpectedContent, "BusyContainer has the correct content");
        assert.strictEqual(oBusyContainer.getBusy(), true, "BusyContainer is busy");
    });

    QUnit.test("Creates no duplicate BusyContainers", function (assert) {
        // Arrange
        // Act
        var oFirstBusyContainer = this.oTileState._getBusyContainer();
        var oSecondBusyContainer = this.oTileState._getBusyContainer();
        // Assert
        assert.strictEqual(oFirstBusyContainer, oSecondBusyContainer, "Returned identical BusyContainer");
    });

    QUnit.module("exit", {
        beforeEach: function () {
            this.oTileState = new TileState();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Destroys the warning icon", function (assert) {
        // Arrange
        var oDestroySpy = sandbox.spy(this.oTileState._oWarningIcon, "destroy");
        // Act
        this.oTileState.destroy();
        // Assert
        assert.strictEqual(oDestroySpy.callCount, 1, "destroy was called once");
    });

    QUnit.test("Destroys the busyContainer", function (assert) {
        // Arrange
        var oBusyContainer = this.oTileState._getBusyContainer();
        var oDestroySpy = sandbox.spy(oBusyContainer, "destroy");
        // Act
        this.oTileState.destroy();
        // Assert
        assert.strictEqual(oDestroySpy.callCount, 1, "destroy was called once");
    });
});
