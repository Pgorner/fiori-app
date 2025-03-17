// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/StandardTreeItem",
    "sap/ushell/ui/ContentNodeTreeItem"
], function (StandardTreeItem, ContentNodeTreeItem) {
    "use strict";

    /* global QUnit, sinon */

    QUnit.module("The ContentNodeTreeItem control");

    QUnit.test("Extends sap.m.StandardTreeItem", function (assert) {
        // Act
        var oControl = new ContentNodeTreeItem();

        // Assert
        assert.ok(oControl.isA("sap.m.StandardTreeItem"), "The control type has been found.");

        // Cleanup
        oControl.destroy();
    });

    QUnit.test("Uses the correct default values", function (assert) {
        // Act
        var oControl = new ContentNodeTreeItem();

        // Assert
        assert.strictEqual(oControl.getSelectable(), true, "The correct value has been returned.");

        // Cleanup
        oControl.destroy();
    });

    QUnit.test("Uses the sap.m.StandardTreeItem's renderer", function (assert) {
        assert.strictEqual(ContentNodeTreeItem.getMetadata().getRenderer(), StandardTreeItem.getMetadata().getRenderer(), "The correct reference has been found.");
    });

    QUnit.module("The function isSelectable");

    QUnit.test("Returns the result of getSelectable", function (assert) {
        // Arrange
        var oControl = new ContentNodeTreeItem();
        var oSelectable = {};
        var oStub = sinon.stub(oControl, "getSelectable").returns(oSelectable);

        // Act
        var oResult = oControl.isSelectable();

        // Assert
        assert.strictEqual(oStub.callCount, 1, "The function getSelectable has been called once.");
        assert.strictEqual(oResult, oSelectable, "The correct reference has been returned.");

        // Cleanup
        oControl.destroy();
    });

    QUnit.module("The function getModeControl", {
        beforeEach: function () {
            this.oControl = new ContentNodeTreeItem();
        },
        afterEach: function () {
            this.oControl.destroy();
            this.oControl = null;
        }
    });

    QUnit.test("Returns null if the control is not selectable", function (assert) {
        // Arrange
        var oControl = new ContentNodeTreeItem({
            selectable: false
        });

        // Act
        var oResult = oControl.getModeControl();

        // Assert
        assert.strictEqual(oResult, null, "The correct value has been returned.");
    });

    QUnit.test("Returns the result of StandardTreeItem.getModeControl if the control is selectable", function (assert) {
        // Arrange
        var oModeControl = {};
        var oStub = sinon.stub(StandardTreeItem.prototype, "getModeControl").returns(oModeControl);
        var oControl = new ContentNodeTreeItem({
            selectable: true
        });

        // Act
        var oResult = oControl.getModeControl();

        // Assert
        assert.strictEqual(oStub.callCount, 1, "The function StandardTreeItem.getModeControl has been called once.");
        assert.strictEqual(oResult, oModeControl, "The correct value has been returned.");
    });

    QUnit.module("The function setSelected", {
        beforeEach: function () {
            this.oReturnValue = {};
            this.oSetSelectedStub = sinon.stub(StandardTreeItem.prototype, "setSelected").returns(this.oReturnValue);
            this.oControl = new ContentNodeTreeItem();
        },
        afterEach: function () {
            this.oControl.destroy();
            this.oSetSelectedStub.restore();
        }
    });

    QUnit.test("Calls the super class's setSelected function with the correct parameters", function (assert) {
        // Arrange
        var oParameter = {};

        // Act
        var oResult = this.oControl.setSelected(oParameter);

        // Assert
        assert.strictEqual(this.oSetSelectedStub.callCount, 1, "The function StandardTreeItem.setSelected has been called once.");
        assert.strictEqual(this.oSetSelectedStub.firstCall.args[0], oParameter, "The function StandardTreeItem.setSelected has been called with the correct parameters.");
        assert.strictEqual(this.oSetSelectedStub.firstCall.thisValue, this.oControl, "The function StandardTreeItem.setSelected has been called with the correct context.");
        assert.strictEqual(oResult, this.oReturnValue, "The correct return value reference has been found.");
    });

    QUnit.test("Saves the passed value in an internal property", function (assert) {
        // Arrange
        var oParameter = {};

        // Act
        this.oControl.setSelected(oParameter);

        // Assert
        assert.strictEqual(this.oControl._bSelected, oParameter, "The correct value has been found.");
    });

    QUnit.module("The function setSelectable", {
        beforeEach: function () {
            this.oSetSelectedStub = sinon.stub(StandardTreeItem.prototype, "setSelected");
            this.oControl = new ContentNodeTreeItem();
            this.oSetPropertyStub = sinon.stub(this.oControl, "setProperty");
        },
        afterEach: function () {
            this.oControl.destroy();
            this.oSetSelectedStub.restore();
        }
    });

    QUnit.test("Updates the property value and does not call setSelected if selectable=false", function (assert) {
        // Arrange
        // Act
        this.oControl.setSelectable(false);

        // Assert
        assert.strictEqual(this.oSetSelectedStub.callCount, 0, "The function StandardTreeItem.setSelected has not been called.");
        assert.strictEqual(this.oSetPropertyStub.callCount, 1, "The function setProperty has been called once.");
        assert.deepEqual(this.oSetPropertyStub.firstCall.args, [
            "selectable", false, false
        ], "The function setProperty has been called with the correct parameters.");
    });

    QUnit.test("Updates the property value and calls setSelected if selectable=true", function (assert) {
        // Arrange
        var oValue = {};
        this.oControl._bSelected = oValue;

        // Act
        this.oControl.setSelectable(true);

        // Assert
        assert.strictEqual(this.oSetSelectedStub.callCount, 1, "The function StandardTreeItem.setSelected has been called once.");
        assert.strictEqual(this.oSetSelectedStub.firstCall.args[0], oValue, "The function StandardTreeItem.setSelected has been called with the correct parameter.");
        assert.strictEqual(this.oSetSelectedStub.firstCall.thisValue, this.oControl, "The function StandardTreeItem.setSelected has been called with the correct context.");
        assert.strictEqual(this.oSetPropertyStub.callCount, 1, "The function setProperty has been called once.");
        assert.deepEqual(this.oSetPropertyStub.firstCall.args, [
            "selectable", true, false
        ], "The function setProperty has been called with the correct parameters.");
    });
});
