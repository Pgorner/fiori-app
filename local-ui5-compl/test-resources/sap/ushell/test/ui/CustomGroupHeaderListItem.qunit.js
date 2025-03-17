// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.CustomGroupHeaderListItem
 */

/* global QUnit, sinon */

sap.ui.define([
    "sap/ushell/ui/CustomGroupHeaderListItem",
    "sap/ushell/ui/CustomGroupHeaderListItemRenderer",
    "sap/ui/qunit/utils/nextUIUpdate"
], function (
    CustomGroupHeaderListItem,
    CustomGroupHeaderListItemRenderer,
    nextUIUpdate
) {
    "use strict";

    QUnit.module("The CustomGroupHeaderListItem with title and description", {
        beforeEach: function (assert) {
            var done = assert.async();
            this.oSetAggregationSpy = sinon.spy(CustomGroupHeaderListItem.prototype, "setAggregation");
            this.CustomGroupHeaderListItem = new CustomGroupHeaderListItem({
                title: "Test Title",
                description: "Test Description"
            }).placeAt("qunit-fixture");
            this.CustomGroupHeaderListItem.addEventDelegate({ onAfterRendering: done });
            return nextUIUpdate();
        },
        afterEach: function () {
            this.CustomGroupHeaderListItem.destroy();
            this.CustomGroupHeaderListItem = null;
            this.oSetAggregationSpy.restore();
        }
    });

    QUnit.test("The aggregation setting called by the control constructor", function (assert) {
        // Assert
        assert.strictEqual(this.oSetAggregationSpy.callCount, 2, "The aggregations were set.");
        assert.strictEqual(this.oSetAggregationSpy.firstCall.args[0], "_titleText", "The title aggregation was set.");
        assert.strictEqual(this.oSetAggregationSpy.secondCall.args[0], "_descriptionText", "The description aggregation was set.");
    });

    QUnit.test("The method getContentAnnouncement", function (assert) {
        // Arrange
        var sExpectedContentAnnouncement = "Test Title, Test Description";

        // Act
        var sContentAnnouncement = this.CustomGroupHeaderListItem.getContentAnnouncement();

        // Assert
        assert.strictEqual(sContentAnnouncement, sExpectedContentAnnouncement, "The content announcement text is correct.");
    });

    QUnit.test("The method setTitle called manually", function (assert) {
        // Arrange
        var sNewTitle = "New Title";
        var oTitleSetTextSpy = sinon.spy(this.CustomGroupHeaderListItem.getAggregation("_titleText"), "setText");

        // Act
        this.CustomGroupHeaderListItem.setTitle(sNewTitle);

        // Assert
        assert.strictEqual(this.oSetAggregationSpy.callCount, 2, "The aggregations were set by the constructor only.");
        assert.strictEqual(oTitleSetTextSpy.callCount, 1, "The text of the title control was set.");
        assert.ok(oTitleSetTextSpy.calledWith(sNewTitle), "The text of the title control was set correctly.");
        assert.strictEqual(this.CustomGroupHeaderListItem.getProperty("title"), sNewTitle, "The title property was set correctly.");
        assert.strictEqual(this.CustomGroupHeaderListItem.getAggregation("_titleText").getText(), sNewTitle, "The title aggregation was set correctly.");

        // Cleanup
        oTitleSetTextSpy.restore();
    });

    QUnit.test("The method setDescription called manually", function (assert) {
        // Arrange
        var sNewDescription = "New Description";
        var oDescriptionTextSpy = sinon.spy(this.CustomGroupHeaderListItem.getAggregation("_descriptionText"), "setText");

        // Act
        this.CustomGroupHeaderListItem.setDescription(sNewDescription);

        // Assert
        assert.strictEqual(this.oSetAggregationSpy.callCount, 2, "The aggregations were set by the constructor only.");
        assert.strictEqual(oDescriptionTextSpy.callCount, 1, "The text of the description control was set.");
        assert.ok(oDescriptionTextSpy.calledWith(sNewDescription), "The text of the description control was set correctly.");
        assert.strictEqual(this.CustomGroupHeaderListItem.getProperty("description"), sNewDescription, "The description property was set correctly.");
        assert.strictEqual(this.CustomGroupHeaderListItem.getAggregation("_descriptionText").getText(), sNewDescription, "The description aggregation was set correctly.");

        // Cleanup
        oDescriptionTextSpy.restore();
    });

    QUnit.test("Rendered with CSS content class", function (assert) {
        // Assert
        assert.ok(this.CustomGroupHeaderListItem.$().hasClass("sapUshellCGHLIContent"), "The class sapUshellCGHLIContent was set.");
    });

    QUnit.test("Rendered with description text ", function (assert) {
        // Arrange
        var aElements = document.getElementsByClassName("sapUshellCGHLIDescription");

        // Assert
        assert.strictEqual(aElements.length, 1, "One element with the class sapUshellCGHLIDescription exists.");
        assert.strictEqual(aElements[0].tagName, "SPAN", "The element has the correct tag.");
        assert.strictEqual(aElements[0].innerText, "Test Description", "The description text was set correctly.");
    });

    QUnit.module("The CustomGroupHeaderListItem with a title only", {
        beforeEach: function () {
            this.CustomGroupHeaderListItem = new CustomGroupHeaderListItem({
                title: "Test Title"
            }).placeAt("qunit-fixture");
            return nextUIUpdate();
        },
        afterEach: function () {
            this.CustomGroupHeaderListItem.destroy();
            this.CustomGroupHeaderListItem = null;
        }
    });

    QUnit.test("Rendered without description text ", function (assert) {
        // Arrange
        var aElements = document.getElementsByClassName("sapUshellCGHLIDescription");

        // Assert
        assert.strictEqual(aElements.length, 0, "The description text is not rendered");
    });
});
