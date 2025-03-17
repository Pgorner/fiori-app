// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @file QUnit tests for "sap.ushell.ui.launchpad.LinkTileWrapper"
 * @deprecated since 1.120
 */
sap.ui.define([
    "sap/m/GenericTile",
    "sap/m/library",
    "sap/ui/core/Element",
    "sap/ui/qunit/utils/nextUIUpdate",
    "sap/ushell/ui/launchpad/FailedTileDialog",
    "sap/ushell/ui/launchpad/LinkTileWrapper"
], function (
    GenericTile,
    mobileLibrary,
    Element,
    nextUIUpdate,
    FailedTileDialog,
    LinkTileWrapper
) {
    "use strict";

    // shortcut for sap.m.GenericTileMode
    var GenericTileMode = mobileLibrary.GenericTileMode;

    // shortcut for sap.m.LoadState
    var LoadState = mobileLibrary.LoadState;

    /* global QUnit, sinon */

    QUnit.module("_onPress() & _launchTileViaKeyboard()", {
        beforeEach: function () {
            this.oGenericTile = new GenericTile();
            this.oLinkTileWrapper = new LinkTileWrapper({ tileViews: this.oGenericTile }).setDebugInfo(JSON.stringify({ test: "test" }));
            this.oLinkTileWrapper.FailedTileDialog = new FailedTileDialog();
            this.openForStub = sinon.stub(this.oLinkTileWrapper.FailedTileDialog, "openFor");
        }
    });

    QUnit.test("Calls \"FailedTileDialog.openFor()\" when the wrapped Tile \"state\" is \"Failed\"", function (assert) {
        // Arrange
        var oEvent = { target: { tagName: "test" } };
        this.oGenericTile.setState("Failed");

        // Act
        this.oLinkTileWrapper._onPress();
        this.oLinkTileWrapper._launchTileViaKeyboard(oEvent);

        // Assert
        assert.strictEqual(this.openForStub.callCount, 2, "The method was called");
    });

    QUnit.test("Does not call \"FailedTileDialog.openFor()\" when the wrapped Tile \"state\" is not \"Failed\"", function (assert) {
        // Arrange
        var oEvent = { target: { tagName: "test" } };
        this.oGenericTile.setState("Loaded");

        // Act
        this.oLinkTileWrapper._onPress();
        this.oLinkTileWrapper._launchTileViaKeyboard(oEvent);

        // Assert
        assert.ok(this.openForStub.notCalled, "The method was not called");
    });

    QUnit.test("Does not call \"FailedTileDialog.openFor()\" when \"tileActionModeActive\" is \"true\"", function (assert) {
        // Arrange
        var oEvent = { target: { tagName: "test" } };
        this.oLinkTileWrapper.setTileActionModeActive(true);
        this.oGenericTile.setState("Failed");

        // Act
        this.oLinkTileWrapper._onPress();
        this.oLinkTileWrapper._launchTileViaKeyboard(oEvent);

        // Assert
        assert.ok(this.openForStub.notCalled, "The method was not called");

        // Arrange
        this.oGenericTile.setState("Loaded");

        // Act
        this.oLinkTileWrapper._onPress();
        this.oLinkTileWrapper._launchTileViaKeyboard(oEvent);

        // Assert
        assert.ok(this.openForStub.notCalled, "The method was not called");
    });

    QUnit.module("renderer", {
        beforeEach: function () {
            this.oLinkTileWrapper = new LinkTileWrapper("LinkTileWrapper");
            this.oLinkTileWrapper.placeAt("qunit-fixture");
            return nextUIUpdate();
        },
        afterEach: function () {
            this.oLinkTileWrapper.destroy();
        }
    });

    QUnit.test('Renders a "sap.m.GenericTile" in "LineMode" and "Failed" state in case the Tile cannot be loaded', function (assert) {
        // Arrange
        var oGenericTileElement = this.oLinkTileWrapper.getDomRef().querySelector(".sapMGT");
        var oGenericTile = Element.closestTo(oGenericTileElement);

        // Act
        oGenericTile.firePress();

        // Assert
        assert.strictEqual(!!oGenericTileElement, true, "The control was rendered");
        assert.strictEqual(oGenericTile.getMode(), GenericTileMode.LineMode, "The control has the expected mode");
        assert.strictEqual(oGenericTile.getState(), LoadState.Failed, "The control has the expected state");
    });
});
