/*global QUnit */

sap.ui.define([
	'sap/chart/Chart',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/ui/thirdparty/jquery',
	'../mockds/init',
	'require'
], function(
	Chart,
	ODataModel,
	$,
	mockADataService,
	require
) {
	"use strict";

	var sDataUrl = "http://fake.nonanalytical.odataservice";
	var sResultPath = "/zgk_sflight_max_seats(P_MaxSeats=1000)/Set";
	mockADataService({
		 url: sDataUrl,
		 metadata: require.toUrl("../mockds/zgk_sflightset/metadata.xml"),
		 mockdata: require.toUrl("../mockds/zgk_sflightset/data")
	});

	var oModel, oChart;
	var oBindingInfo = {
		path: sResultPath
	};
	var oDefaultChartOptions = {
		width: "1280px",
		height: "720px",
		chartType: "column"
	};

	function createChart(oCfg) {
		return new Chart($.extend({}, oDefaultChartOptions, oCfg));
	}

	QUnit.module("nonAnalyticalODataService", {
		beforeEach: function() {
			oModel = new ODataModel(sDataUrl, true);
			return oModel.getMetaModel().loaded();
		},
		afterEach: function() {
			try {
				if (oModel) {
					oModel.destroy();
				}
				if (oChart) {
					oChart.destroy();
				}
				$("#qunit-fixture").empty();
			} catch (e) {
				// don't care
			}
		}
	});

	QUnit.test("Create Chart with ODataModel", function(assert) {
		var done = assert.async();
		oChart = createChart({
			visibleDimensions: ["Carrier", "PlaneType"],
			visibleMeasures: ["Price"]
		});

		oChart.attachEventOnce("renderComplete", function() {
			assert.ok(document.querySelectorAll("#qunit-fixture .v-datapoint").length > 0, "chart is rendered");
			assert.equal(document.querySelector("#qunit-fixture .v-m-timeAxis .v-title text").textContent, "Flight Date");
			assert.equal(document.querySelector("#qunit-fixture .v-m-valueAxis .v-title text").textContent, "Airfare", "Measure label property is derived");
			done();

		});

		oChart.setModel(oModel);
		oChart.bindData(oBindingInfo);
		oChart.placeAt("qunit-fixture");
	});

	QUnit.test("Change textProperty and unitBinding", function(assert) {
		var done = assert.async();
		oChart = createChart({
			visibleDimensions: ["Carrier"],
			visibleMeasures: ["Price"]
		});

		oChart.attachEventOnce("renderComplete", function() {
			// var oPrice = oChart.getMeasureByName("Price");
			var oCarrier = oChart.getDimensionByName("Carrier");
			oChart.attachEventOnce("renderComplete", testUnitChange);
			oChart.setVisibleDimensions(["Carrier"]);
			// oPrice.setUnitBinding("Currency");
			oCarrier.setTextProperty("PlaneType");
		});

		function testUnitChange(oEvent) {
			assert.equal(document.querySelectorAll("#qunit-fixture .v-m-legend .v-legend-element")[0].textContent.split("/").length, 3, "textProperty is removed.");
			done();
		}

		oChart.setModel(oModel);
		oChart.bindData(oBindingInfo);
		oChart.placeAt("qunit-fixture");
	});
});
