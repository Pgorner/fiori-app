/*global QUnit */

sap.ui.define([
	'sap/chart/Chart',
	'sap/chart/data/Dimension',
	'sap/chart/data/TimeDimension',
	'sap/chart/data/Measure',
	'sap/chart/utils/RoleFitter',
	'sap/ui/core/Theming',
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/analytics/ODataModelAdapter',
	'sap/ui/model/analytics/AnalyticalTreeBindingAdapter',
	'sap/ui/layout/VerticalLayout',
	'sap/chart/utils/ChartTypeAdapterUtils',
	"sap/ui/thirdparty/jquery",
	'../analytics/JSONData'
], function(
	Chart,
	Dimension,
	TimeDimension,
	Measure,
	RoleFitter,
	Theming,
	JSONModel,
	ODataModelAdapter,
	AnalyticalTreeBindingAdapter,
	VerticalLayout,
	ChartTypeAdapterUtils,
	jQuery,
	JSONData
) {
	"use strict";

	var oModel, oVerticalLayout, oChart, oChartPopover, oTooltip, oProductDim, oFiscalYearPeriodDimWithTextFormatter, oFiscalYearDimWithTextFormatter, oCalendarYearQuarterDimWithTextFormatter, oCalendarYearMonthDimWithTextFormatter, oFiscalYearDim, oFiscalYearPeriodDim, oFiscalYearDim, oCalendarYearQuarterDim, oCalendarYearMonthDim, oPriceMeas, oStockMeas, sResultSet = "businessData", sResultPath = "/businessData";

    var EventTestUtil = {
		selectData : function(index){
		    var element = jQuery('.v-datapoint')[index],
				o = element.getBoundingClientRect();
			var mousedown = document.createEvent("MouseEvent");
		    mousedown.initMouseEvent('mousedown',  true, true, window, 0,
		        undefined, undefined, o.x, o.y,
		        undefined, undefined, undefined, undefined,
		        0, null);
		    element.dispatchEvent(mousedown);
		    var mouseup = document.createEvent("MouseEvent");
		    mouseup.initMouseEvent('mouseup',  true, true, window, 0,
		        undefined, undefined, o.x, o.y,
		        undefined, undefined, undefined, undefined,
		        0, null);
		    element.dispatchEvent(mouseup);
	    },
	    hoverData : function (index) {
		    var element = jQuery('.v-datapoint')[index];
	        var o = element.getBoundingClientRect();
	        var mousemove = document.createEvent("MouseEvent");
		    mousemove.initMouseEvent('mousemove',  true, true, window, 0,
		        undefined, undefined, o.left, o.top,
		        undefined, undefined, undefined, undefined,
		        0, null);
		    element.dispatchEvent(mousemove);
	    }
	};
	var oData = {
        businessData: [
            {
                Name: "Bread", Price: 10, Unit: "EUR", Stock: 1, InStock: true, InStockValue: "Yes", CalendarYearMonth: "202002", CalendarYearQuarter: "20201", FiscalYearPeriod: "2006001",
                FiscalYear: '2006'
            },
            {
                Name: "Milk", Price: 1.5, Unit: "EUR", Stock: 0, InStock: false, InStockValue: "No", CalendarYearMonth: "202005", CalendarYearQuarter: "20202", FiscalYearPeriod: "2006002",
                FiscalYear: '2006'
            },
            {
                Name: "Butter", Price: 3, Unit: "EUR", Stock: 5, InStock: true, InStockValue: "Ja", CalendarYearMonth: "202008", CalendarYearQuarter: "20203", FiscalYearPeriod: "2006003",
                FiscalYear: '2006'
            }
        ]
    };

	QUnit.module("AnalyticalChart", {
		beforeEach: function() {
			// Define dimensions for the chart
		    oProductDim = new sap.chart.data.Dimension({
		        name: "Name",
		        label: "Product"
		    });

		    oFiscalYearPeriodDimWithTextFormatter = new sap.chart.data.TimeDimension({
		        name: "FiscalYearPeriod",
		        label: "F. Year Period",
		        timeUnit: "fiscalyearperiod",
		        textFormatter: function (v1) { return 'FiscalYearPeriod' + v1; }
		    });

		    oFiscalYearDimWithTextFormatter = new sap.chart.data.TimeDimension({
		        name: "FiscalYear",
		        label: "F. Year",
		        timeUnit: "fiscalyear",
		        textFormatter: function (v1) { return 'FiscalYear' + v1; }
		    });

		    oCalendarYearQuarterDimWithTextFormatter = new sap.chart.data.TimeDimension({
		        name: "CalendarYearQuarter",
		        label: "F. CalendarYearQuarter",
		        timeUnit: "yearquarter",
		        textFormatter: function (v1) { return 'CalendarYearQuarter' + v1; }
		    });

		    oCalendarYearMonthDimWithTextFormatter = new sap.chart.data.TimeDimension({
		        name: "CalendarYearMonth",
		        label: "F. CalendarYearMonth",
		        timeUnit: "yearmonth",
		        textFormatter: function (v1) { return 'CalendarYearMonth' + v1; }
		    });

		    oFiscalYearPeriodDim = new sap.chart.data.TimeDimension({
		        name: "FiscalYearPeriod",
		        label: "F. Year Period",
		        timeUnit: "fiscalyearperiod"
		    });

		    oFiscalYearDim = new sap.chart.data.TimeDimension({
		        name: "FiscalYear",
		        label: "F. Year",
		        timeUnit: "fiscalyear"
		    });

		    oCalendarYearQuarterDim = new sap.chart.data.TimeDimension({
		        name: "CalendarYearQuarter",
		        label: "F. CalendarYearQuarter",
		        timeUnit: "yearquarter"
		    });

		    oCalendarYearMonthDim = new sap.chart.data.TimeDimension({
		        name: "CalendarYearMonth",
		        label: "F. CalendarYearMonth",
		        timeUnit: "yearmonth"
		    });

		    // Define measures for the chart
		    oPriceMeas = new sap.chart.data.Measure({
		        name: "Price",
		        unitBinding: "Unit"
		    });

		    oStockMeas = new sap.chart.data.Measure({
		        name: "Stock"
		    });
		},
		afterEach: function() {
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
				if (oChartPopover) {
					oChartPopover.destroy();
				}
				if (oTooltip) {
					oTooltip.destroy();
				}
				document.getElementById("qunit-fixture").innerHTML = "";
			} catch (e) {
				// ignore
			}
		}
	});
	function createChart(JSONData, aDims, aMsrs, isVizTooltip) {
		oModel = new JSONModel(JSONData);
		oVerticalLayout = new VerticalLayout({
			width: "100%"
		});
		oChart = new Chart({
			'width': '100%',
			'height': '600px',
			'chartType': 'column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'isAnalytical': true,
			'visibleMeasures': ['Price', 'Stock']
		});

		aDims.forEach(function(dim){oChart.addDimension(dim);});

		aMsrs.forEach(function(mea){oChart.addMeasure(mea);});

		oChart.setModel(oModel);
		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});
		oVerticalLayout.addContent(oChart);
		if (isVizTooltip) {
			oTooltip = new sap.viz.ui5.controls.VizTooltip({});
			oTooltip.connect(oChart.getVizUid());
		} else {
		    oChartPopover = new sap.viz.ui5.controls.Popover({});
		    oChartPopover.connect(oChart.getVizUid());
		}

		oVerticalLayout.placeAt("qunit-fixture");
	}

	QUnit.test("Create simple fiscal Chart with v and d, popover test", function(assert) {
		var done = assert.async();
		createChart(oData, [oProductDim, oFiscalYearPeriodDimWithTextFormatter], [oPriceMeas, oStockMeas]);
		oChart.attachRenderComplete(null, function(oEvent) {
			assert.equal(oEvent.getSource(), oChart, "renderComplete event is correct");
			assert.ok(document.querySelector("#qunit-fixture").querySelectorAll(".v-datapoint").length > 0, "chart is rendered");
			assert.equal(oChart.getVisibleDimensions().length, 2, "visibleDimensions are auto appended ");
			EventTestUtil.selectData(2);
		});
		var checkTimeFormat = function(e){
		    assert.equal(document.querySelectorAll('.viz-controls-chartPopover-measure-labels.viz-controls-chartPopover-measure-labels-wrapper-value .sapMObjectNumberText')[0].innerText, "FiscalYearPeriod2006002", "chart's popover is right");
		    done();
		};

		var oResPop = oChartPopover._Popover._oPopover;
		oResPop.attachAfterOpen(checkTimeFormat);
	});
	QUnit.test("Create fiscal Chart with two fiscal dimensions, v and d, popover test", function(assert) {
		var done = assert.async();
		createChart(oData, [oProductDim, oFiscalYearPeriodDimWithTextFormatter, oFiscalYearDimWithTextFormatter], [oPriceMeas, oStockMeas]);
		oChart.attachRenderComplete(null, function(oEvent) {
			assert.equal(oEvent.getSource(), oChart, "renderComplete event is correct");
			assert.ok(document.querySelector("#qunit-fixture").querySelectorAll(".v-datapoint").length > 0, "chart is rendered");
			assert.equal(oChart.getVisibleDimensions().length, 3, "visibleDimensions are auto appended ");
			EventTestUtil.selectData(2);
		});
		var checkTimeFormat = function(e){
		    assert.equal(document.querySelectorAll('.viz-controls-chartPopover-measure-labels.viz-controls-chartPopover-measure-labels-wrapper-value .sapMObjectNumberText')[0].innerText, "FiscalYearPeriod2006002", "chart's popover measure label is right");
		    assert.equal(document.querySelectorAll('.viz-controls-chartPopover-dimension-label')[0].innerText, "Milk - FiscalYear2006", "chart's popover dimension label is right");
		    done();
		};

		var oResPop = oChartPopover._Popover._oPopover;
		oResPop.attachAfterOpen(checkTimeFormat);
	});
	QUnit.test("Create fiscal Chart with two fiscal dimensions, popover test", function(assert) {
		var done = assert.async();
		createChart(oData, [oProductDim, oFiscalYearPeriodDim, oFiscalYearDim], [oPriceMeas, oStockMeas]);
		oChart.attachRenderComplete(null, function(oEvent) {
			assert.equal(oEvent.getSource(), oChart, "renderComplete event is correct");
			assert.ok(document.querySelector("#qunit-fixture").querySelectorAll(".v-datapoint").length > 0, "chart is rendered");
			assert.equal(oChart.getVisibleDimensions().length, 3, "visibleDimensions are auto appended ");
			EventTestUtil.selectData(2);
		});
		var checkTimeFormat = function(e){
		    assert.equal(document.querySelectorAll('.viz-controls-chartPopover-measure-labels.viz-controls-chartPopover-measure-value .sapMObjectNumberText')[0].innerText, "2006", "chart's popover measure fiscal year label is right");
		    assert.equal(document.querySelectorAll('.viz-controls-chartPopover-measure-labels.viz-controls-chartPopover-measure-value .sapMObjectNumberText')[1].innerText, "2", "chart's popover measure fiscal period label is right");
		    assert.equal(document.querySelectorAll('.viz-controls-chartPopover-dimension-label')[0].innerText, "Milk - 2006", "chart's popover dimension label is right");
		    done();
		};

		var oResPop = oChartPopover._Popover._oPopover;
		oResPop.attachAfterOpen(checkTimeFormat);
	});
	QUnit.test("Create time Chart with 1 fiscal dimensions, v and d, popover test", function(assert) {
		var done = assert.async();
		createChart(oData, [oProductDim, oCalendarYearQuarterDimWithTextFormatter, oFiscalYearPeriodDimWithTextFormatter], [oPriceMeas, oStockMeas]);
		oChart.attachRenderComplete(null, function(oEvent) {
			assert.equal(oEvent.getSource(), oChart, "renderComplete event is correct");
			assert.ok(document.querySelector("#qunit-fixture").querySelectorAll(".v-datapoint").length > 0, "chart is rendered");
			assert.equal(oChart.getVisibleDimensions().length, 3, "visibleDimensions are auto appended ");
			EventTestUtil.selectData(2);
		});
		var checkTimeFormat = function(e){
		    assert.equal(document.querySelectorAll('.viz-controls-chartPopover-measure-labels.viz-controls-chartPopover-measure-labels-wrapper-value .sapMObjectNumberText')[0].innerText, "CalendarYearQuarter20202", "chart's popover measure label is right");
		    assert.equal(document.querySelectorAll('.viz-controls-chartPopover-dimension-label')[0].innerText, "Milk - FiscalYearPeriod2006002", "chart's popover dimension label is right");
		    done();
		};

		var oResPop = oChartPopover._Popover._oPopover;
		oResPop.attachAfterOpen(checkTimeFormat);
	});
	QUnit.test("Create time Chart with 1 fiscal dimensions, popover test", function(assert) {
		var done = assert.async();
		createChart(oData, [oProductDim, oCalendarYearQuarterDim, oFiscalYearPeriodDim], [oPriceMeas, oStockMeas]);
		oChart.attachRenderComplete(null, function(oEvent) {
			assert.equal(oEvent.getSource(), oChart, "renderComplete event is correct");
			assert.ok(document.querySelector("#qunit-fixture").querySelectorAll(".v-datapoint").length > 0, "chart is rendered");
			assert.equal(oChart.getVisibleDimensions().length, 3, "visibleDimensions are auto appended ");
			EventTestUtil.selectData(2);
		});
		var checkTimeFormat = function(e){
		    assert.equal(document.querySelectorAll('.viz-controls-chartPopover-measure-labels.viz-controls-chartPopover-measure-labels-wrapper-value .sapMObjectNumberText')[0].innerText, "Q2 2020", "chart's popover measure quarter year label is right");
		    assert.equal(document.querySelectorAll('.viz-controls-chartPopover-dimension-label')[0].innerText, "Milk - 2006002", "chart's popover dimension label is right");
		    done();
		};

		var oResPop = oChartPopover._Popover._oPopover;
		oResPop.attachAfterOpen(checkTimeFormat);
	});
	QUnit.test("Create fiscal Chart with 2 time dimensions, 1 fiscal dimension, v and d, popover test", function(assert) {
		var done = assert.async();
		createChart(oData, [oProductDim, oFiscalYearPeriodDimWithTextFormatter, oCalendarYearQuarterDimWithTextFormatter, oCalendarYearMonthDimWithTextFormatter, oFiscalYearDimWithTextFormatter], [oPriceMeas, oStockMeas]);
		oChart.attachRenderComplete(null, function(oEvent) {
			assert.equal(oEvent.getSource(), oChart, "renderComplete event is correct");
			assert.ok(document.querySelector("#qunit-fixture").querySelectorAll(".v-datapoint").length > 0, "chart is rendered");
			assert.equal(oChart.getVisibleDimensions().length, 5, "visibleDimensions are auto appended ");
			EventTestUtil.selectData(2);
		});
		var checkTimeFormat = function(e){
		    assert.equal(document.querySelectorAll('.viz-controls-chartPopover-measure-labels.viz-controls-chartPopover-measure-labels-wrapper-value .sapMObjectNumberText')[0].innerText, "FiscalYearPeriod2006002", "chart's popover measure label is right");
		    assert.equal(document.querySelectorAll('.viz-controls-chartPopover-dimension-label')[0].innerText, "Milk - CalendarYearQuarter20202 - CalendarYearMonth202005 - FiscalYear2006", "chart's popover dimension label is right");
		    done();
		};

		var oResPop = oChartPopover._Popover._oPopover;
		oResPop.attachAfterOpen(checkTimeFormat);
	});
	QUnit.test("Create fiscal Chart with 2 time dimensions, 1 fiscal dimension -1, popover test", function(assert) {
		var done = assert.async();
		createChart(oData, [oProductDim, oFiscalYearPeriodDim, oCalendarYearQuarterDim, oCalendarYearMonthDim, oFiscalYearDim], [oPriceMeas, oStockMeas]);
		oChart.attachRenderComplete(null, function(oEvent) {
			assert.equal(oEvent.getSource(), oChart, "renderComplete event is correct");
			assert.ok(document.querySelector("#qunit-fixture").querySelectorAll(".v-datapoint").length > 0, "chart is rendered");
			assert.equal(oChart.getVisibleDimensions().length, 5, "visibleDimensions are auto appended ");
			EventTestUtil.selectData(2);
		});
		var checkTimeFormat = function(e){
		    assert.equal(document.querySelectorAll('.viz-controls-chartPopover-measure-labels.viz-controls-chartPopover-measure-value .sapMObjectNumberText')[0].innerText, "2006", "chart's popover measure fiscal year label is right");
		    assert.equal(document.querySelectorAll('.viz-controls-chartPopover-measure-labels.viz-controls-chartPopover-measure-value .sapMObjectNumberText')[1].innerText, "2", "chart's popover measure fiscal period label is right");
		    assert.ok(document.querySelectorAll('.viz-controls-chartPopover-dimension-label')[0].innerText.indexOf("2006") > -1, "chart's popover dimension label is right");
		    done();
		};

		var oResPop = oChartPopover._Popover._oPopover;
		oResPop.attachAfterOpen(checkTimeFormat);
	});
	QUnit.test("Create fiscal Chart with 2 time dimensions, 1 fiscal dimension -2, popover test", function(assert) {
		var done = assert.async();
		createChart(oData, [oProductDim, oFiscalYearDim, oCalendarYearQuarterDim, oCalendarYearMonthDim, oFiscalYearPeriodDim], [oPriceMeas, oStockMeas]);
		oChart.attachRenderComplete(null, function(oEvent) {
			assert.equal(oEvent.getSource(), oChart, "renderComplete event is correct");
			assert.ok(document.querySelector("#qunit-fixture").querySelectorAll(".v-datapoint").length > 0, "chart is rendered");
			assert.equal(oChart.getVisibleDimensions().length, 5, "visibleDimensions are auto appended ");
			EventTestUtil.selectData(2);
		});
		var checkTimeFormat = function(e){
		    assert.equal(document.querySelectorAll('.viz-controls-chartPopover-measure-labels.viz-controls-chartPopover-measure-value .sapMObjectNumberText')[0].innerText, "2006", "chart's popover measure fiscal year label is right");
		    assert.ok(document.querySelectorAll('.viz-controls-chartPopover-dimension-label')[0].innerText.indexOf("2006002") > -1, "chart's popover dimension label is right");
		    done();
		};

		var oResPop = oChartPopover._Popover._oPopover;
		oResPop.attachAfterOpen(checkTimeFormat);
	});
	QUnit.test("Create fiscal Chart with two fiscal dimensions, v and d, tooltip test", function(assert) {
		var done = assert.async();
		createChart(oData, [oProductDim, oFiscalYearPeriodDimWithTextFormatter, oFiscalYearDimWithTextFormatter], [oPriceMeas, oStockMeas], true);
		oChart.attachRenderComplete(null, function(oEvent) {
			EventTestUtil.hoverData(2);
		});
		var checkTimeFormat = function(e){
			assert.ok(true, "show tooltip");
			var aSelector = document.querySelectorAll('.viz-controls-chartTooltip-dimension-value');
		    assert.equal(aSelector[0].innerText, "FiscalYearPeriod2006002", "chart's tooltip dimension value fiscal period is right");
		    assert.equal(aSelector[2].innerText, "FiscalYear2006", "chart's tooltip dimension value fiscal year is right");
		    done();
		};
		oTooltip._oPopup.attachOpened(checkTimeFormat);
	});
	QUnit.test("Create fiscal Chart with two fiscal dimensions, tooltip test", function(assert) {
		var done = assert.async();
		createChart(oData, [oProductDim, oFiscalYearPeriodDim, oFiscalYearDim], [oPriceMeas, oStockMeas], true);
		oChart.attachRenderComplete(null, function(oEvent) {
			EventTestUtil.hoverData(2);
		});
		var checkTimeFormat = function(e){
			var aSelector = document.querySelectorAll('.viz-controls-chartTooltip-dimension-value');
		    assert.equal(aSelector[0].innerText, "2006", "chart's tooltip dimension value fiscal year is right");
		    assert.equal(aSelector[1].innerText, "2", "chart's tooltip dimension value fiscal priod is right");
		    assert.equal(aSelector[3].innerText, "2006", "chart's tooltip dimension value fiscal is right");
		    done();
		};

		oTooltip._oPopup.attachOpened(checkTimeFormat);
	});
	QUnit.test("Create time Chart with 1 fiscal dimensions, v and d, tooltip test", function(assert) {
		var done = assert.async();
		createChart(oData, [oProductDim, oCalendarYearQuarterDimWithTextFormatter, oFiscalYearPeriodDimWithTextFormatter], [oPriceMeas, oStockMeas], true);
		oChart.attachRenderComplete(null, function(oEvent) {
			EventTestUtil.hoverData(2);
		});
		var checkTimeFormat = function(e){
			var aSelector = document.querySelectorAll('.viz-controls-chartTooltip-dimension-value');
		    assert.equal(aSelector[2].innerText, "FiscalYearPeriod2006002", "chart's tooltip dimension value fiscal period is right");
		    assert.equal(aSelector[0].innerText, "CalendarYearQuarter20202", "chart's tooltip dimension value yearquarter is right");
		    done();
		};

		oTooltip._oPopup.attachOpened(checkTimeFormat);
	});
	QUnit.test("Create time Chart with 1 fiscal dimensions, tooltip test", function(assert) {
		var done = assert.async();
		createChart(oData, [oProductDim, oCalendarYearQuarterDim, oFiscalYearPeriodDim], [oPriceMeas, oStockMeas], true);
		oChart.attachRenderComplete(null, function(oEvent) {
			EventTestUtil.hoverData(2);
		});
		var checkTimeFormat = function(e){
			var aSelector = document.querySelectorAll('.viz-controls-chartTooltip-dimension-value');
		    assert.equal(aSelector[2].innerText, "2006002", "chart's tooltip dimension value fiscal period is right");
		    assert.equal(aSelector[0].innerText, "Q2 2020", "chart's tooltip dimension value yearquarter is right");
		    done();
		};

		oTooltip._oPopup.attachOpened(checkTimeFormat);
	});
	QUnit.test("Create fiscal Chart with 2 time dimensions, 1 fiscal dimension, v and d, tooltip test", function(assert) {
		var done = assert.async();
		createChart(oData, [oProductDim, oFiscalYearPeriodDimWithTextFormatter, oCalendarYearQuarterDimWithTextFormatter, oCalendarYearMonthDimWithTextFormatter, oFiscalYearDimWithTextFormatter], [oPriceMeas, oStockMeas], true);
		oChart.attachRenderComplete(null, function(oEvent) {
			EventTestUtil.hoverData(2);
		});
		var checkTimeFormat = function(e){
			var aSelector = document.querySelectorAll('.viz-controls-chartTooltip-dimension-value');
		    assert.equal(aSelector[0].innerText, "FiscalYearPeriod2006002", "chart's tooltip dimension value fiscal period is right");
		    assert.equal(aSelector[2].innerText, "CalendarYearQuarter20202", "chart's tooltip dimension value yearquarter is right");
		    assert.equal(aSelector[3].innerText, "CalendarYearMonth202005", "chart's tooltip dimension value yearmonth is right");
		    assert.equal(aSelector[4].innerText, "FiscalYear2006", "chart's tooltip dimension value fiscal year is right");
		    done();
		};

		oTooltip._oPopup.attachOpened(checkTimeFormat);
	});
	QUnit.test("Create fiscal Chart with 2 time dimensions, 1 fiscal dimension -1, tooltip test", function(assert) {
		var done = assert.async();
		createChart(oData, [oProductDim, oFiscalYearPeriodDim, oCalendarYearQuarterDim, oCalendarYearMonthDim, oFiscalYearDim], [oPriceMeas, oStockMeas], true);
		oChart.attachRenderComplete(null, function(oEvent) {
			EventTestUtil.hoverData(2);
		});
		var checkTimeFormat = function(e){
			var aSelector = document.querySelectorAll('.viz-controls-chartTooltip-dimension-value');
		    assert.equal(aSelector[0].innerText, "2006", "chart's tooltip dimension value fiscal year is right");
		    assert.equal(aSelector[1].innerText, "2", "chart's tooltip dimension value fiscal priod is right");
		    assert.equal(aSelector[5].innerText, "2006", "chart's tooltip dimension value fiscal is right");
		    done();
		};

		oTooltip._oPopup.attachOpened(checkTimeFormat);
	});
	QUnit.test("Create fiscal Chart with 2 time dimensions, 1 fiscal dimension -2, tooltip test", function(assert) {
		var done = assert.async();
		createChart(oData, [oProductDim, oFiscalYearDim, oCalendarYearQuarterDim, oCalendarYearMonthDim, oFiscalYearPeriodDim], [oPriceMeas, oStockMeas], true);
		oChart.attachRenderComplete(null, function(oEvent) {
			EventTestUtil.hoverData(2);
		});
		var checkTimeFormat = function(e){
			var aSelector = document.querySelectorAll('.viz-controls-chartTooltip-dimension-value');
		    assert.equal(aSelector[0].innerText, "2006", "chart's tooltip dimension value fiscal is right");
		    assert.equal(aSelector[4].innerText, "2006002", "chart's tooltip dimension value fiscal year priod is right");
		    done();
		};

		oTooltip._oPopup.attachOpened(checkTimeFormat);
	});
});
