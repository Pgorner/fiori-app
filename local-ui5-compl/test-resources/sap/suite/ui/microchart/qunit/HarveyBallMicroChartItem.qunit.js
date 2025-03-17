/*global QUnit */
sap.ui.define([
	"sap/suite/ui/microchart/HarveyBallMicroChartItem",
	"sap/m/library"
], function (HarveyBallMicroChartItem, mobileLibrary) {
	"use strict";

	var ValueColor = mobileLibrary.ValueColor;

	QUnit.module("Properties", {
		beforeEach: function() {
			this.oItem = new HarveyBallMicroChartItem({});
		},
		afterEach: function() {
			this.oItem.destroy();
		}
	});

	QUnit.test("Default Property Values", function(assert) {
		assert.equal(this.oItem.getColor(), ValueColor.Neutral, "color is sap.m.ValueColor.Neutral");
		assert.equal(this.oItem.getFormattedLabel(), false, "formattedLabel is false");
		assert.equal(this.oItem.getFraction(), 0, "fraction is 0");
	});


});

