sap.ui.define([
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/suite/ui/commons/HarveyBallMicroChart",
	"sap/suite/ui/commons/HarveyBallMicroChartItem",
	"sap/suite/ui/commons/library",
	"sap/ui/util/Mobile"
], function(
	nextUIUpdate,
	HarveyBallMicroChart,
	HarveyBallMicroChartItem,
	commonsLibrary,
	Mobile
) {
	"use strict";

	// shortcut for sap.suite.ui.commons.InfoTileValueColor
	var InfoTileValueColor = commonsLibrary.InfoTileValueColor;


	Mobile.init();

	QUnit.module("Rendering", {
		beforeEach : async function() {
			this.oChart = new HarveyBallMicroChart("harvey-ball-micro-chart", {
				size: "M",
				total: 355,
				totalLabel: "360",
				totalScale: "Mrd",
				formattedLabel: false,
				showTotal: true,
				showFractions: true,
				tooltip: "Cumulative Totals\n{AltText}\ncalculated in EURO",
				items: [ new HarveyBallMicroChartItem({
					fraction: 125,
					color: InfoTileValueColor.Good,
					fractionLabel: "130",
					fractionScale: "Mln",
					formattedLabel: false
				})]
			}).placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach : function() {
			this.oChart.destroy();
		}
	});

	QUnit.test("HarveyBallMicroChart wrapper is working", function(assert) {
		assert.ok(this.oChart.getDomRef(), "HarveyBallMicroChart was rendered successfully");
	});
});