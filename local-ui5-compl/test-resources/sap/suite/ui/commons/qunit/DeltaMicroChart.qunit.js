sap.ui.define([
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/suite/ui/commons/DeltaMicroChart"
], function(nextUIUpdate, DeltaMicroChart) {
	"use strict";


	QUnit.module("Rendering", {
		beforeEach: async function() {
			this.oChart = new DeltaMicroChart("delta-micro-chart", {
				value1: 5,
				value2: 20,
				title1: "title1",
				title2: "title2",
				press: function() {}
			}).placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function() {
			this.oChart.destroy();
		}
	});

	QUnit.test("DeltaMicroChart wrapper is working", function(assert) {
		assert.ok(this.oChart.getDomRef(), "DeltaMicroChart was rendered successfully");
	});
});