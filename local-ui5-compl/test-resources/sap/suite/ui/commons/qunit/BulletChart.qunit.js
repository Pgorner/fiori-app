/*global QUnit, sinon */
sap.ui.define(["sap/ui/qunit/utils/nextUIUpdate"], function (nextUIUpdate) {
	jQuery.sap.initMobile();

	QUnit.module("Rendering", {
		beforeEach: async function () {
			this.oChart = new sap.suite.ui.commons.BulletChart("bullet-chart", {
				size: sap.suite.ui.commons.InfoTileSize.M,
				scale: "M",
				actual: {value: 120, color: sap.suite.ui.commons.InfoTileValueColor.Good},
				targetValue: 60,
				forecastValue: 112,
				minValue: 0,
				maxValue: 120,
				showValueMarker: true,
				mode: "Delta",
				thresholds: [{value: 0, color: sap.suite.ui.commons.InfoTileValueColor.Error}]
			}).placeAt("qunit-fixture");
			await nextUIUpdate();

		},
		afterEach: function () {
			this.oChart.destroy();
		}
	});

	QUnit.test("BulletChart wrapper is working", function (assert) {
		assert.ok(jQuery(document.getElementById("bullet-chart")), "BulletChart was rendered successfully");
	});
});

