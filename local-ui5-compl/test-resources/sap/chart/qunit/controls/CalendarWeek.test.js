/*global QUnit*/

sap.ui.define([
	'sap/chart/Chart',
	'sap/chart/data/TimeDimension',
	'sap/chart/data/Measure',
	'sap/ui/model/json/JSONModel',
	"sap/base/i18n/Formatting",
	"sap/base/i18n/date/CalendarType",
	"sap/base/i18n/date/CalendarWeekNumbering",
	'sap/ui/layout/VerticalLayout',
	"sap/ui/core/date/Japanese"
], function (
	Chart,
	TimeDimension,
	Measure,
	JSONModel,
	Formatting,
	CalendarType,
	CalendarWeekNumbering,
	VerticalLayout,
	Japanese
) {
	"use strict";

	var setCalendarType = Formatting.setCalendarType;
	var setCalendarWeekNumbering = Formatting.setCalendarWeekNumbering;
	var oModel, oChart, oVerticalLayout;

	QUnit.module("Charts Support of Calendar weeks", {
		beforeEach: function () {
			oModel = new JSONModel({
				Products: [
					{ Price: 3, Unit: "EUR", CalendarYearWeek: "202001" },
					{ Price: 10, Unit: "EUR", CalendarYearWeek: "202002" },
					{ Price: 1.5, Unit: "EUR", CalendarYearWeek: "202003" }
				]
			});
			oVerticalLayout = new VerticalLayout({
				width: "100%"
			});
		},
		afterEach: function () {
			try {
				if (oModel) {
					oModel.destroy();
				}
				if (oChart) {
					oChart.destroy();
				}
				if (oVerticalLayout) {
					oVerticalLayout.destroy();
				}
				document.getElementById("qunit-fixture").innerHTML = "";
			} catch (e) {
				// ignore
			}
		}
	});

    function getUpLabel() {
        return document.querySelector("#qunit-fixture .v-label.v-morphable-label.viz-axis-label .v-label-upperLevel").textContent;
    }

    function getBaseLabel() {
        return document.querySelector("#qunit-fixture .v-label.v-morphable-label.viz-axis-label .v-label-baseLevel").textContent;
    }

	QUnit.test("Chart set calendar type and week numbering", function (assert) {
		var done = assert.async();

		oChart = new Chart({
			id: "myChart",
			chartType: "column", // "column" "Line, "pie"
			height: "600px",
			uiConfig: {
				applicationSet: "fiori"
			},
			vizProperties: {
				title: { text: "Demo", visible: true },
				tooltip: { visible: true },
				legend: {
					visible: true
				},
				interaction: { behaviorType: null }
			},
			visibleMeasures: ["Price"]
		});

		var oCalendarDim = new TimeDimension({
			name: "CalendarYearWeek",
			label: "C. Year Week",
			timeUnit: "yearweek",
			textFormatter: function (v1) { return v1; }
		});
		oChart.addDimension(oCalendarDim);

		var oPriceMeas = new Measure({
			name: "Price",
			unitBinding: "Unit"
		});
		oChart.addMeasure(oPriceMeas);

		var oStockMeas = new Measure({
			name: "Stock"
		});
		oChart.addMeasure(oStockMeas);

		function initRender(oEvent) {
			assert.equal(getUpLabel(), '2019');
			assert.equal(getBaseLabel(), 'CW 52');
			oChart.detachRenderComplete(initRender);
			setCalendarType(CalendarType.Japanese);
			oChart.attachRenderComplete(null, setChartCalendarType);
		}
		oChart.attachRenderComplete(null, initRender);

		function setChartCalendarType(oEvent) {
			assert.equal(getUpLabel(), '2019');
			assert.equal(getBaseLabel(), 'CW 52');
			oChart.detachRenderComplete(setChartCalendarType);
			setCalendarWeekNumbering(CalendarWeekNumbering.ISO_8601);
			oChart.attachRenderComplete(null, setChartCalendarWeekNumbering);
		}

		function setChartCalendarWeekNumbering(oEvent) {
			assert.equal(getUpLabel(), '2019');
			assert.equal(getBaseLabel(), 'CW 52');
			oChart.detachRenderComplete(setChartCalendarWeekNumbering);
			setCalendarType(CalendarType.Default);
			setCalendarWeekNumbering(CalendarWeekNumbering.Default);
			done();
		}

		oChart.bindData({
			path: "/Products"
		});
		oChart.setModel(oModel);

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

});
