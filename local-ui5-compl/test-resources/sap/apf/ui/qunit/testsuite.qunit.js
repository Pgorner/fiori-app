sap.ui.define(function() {
	"use strict";

	return {
		name: "sap.apf.ui testsuite",
		defaults: {
			loader: {
				paths: {
					"sap/apf/integration": "test-resources/sap/apf/integration/",
					"sap/apf/testhelper": "test-resources/sap/apf/testhelper/"
				}
			},
			qunit: {
				version: 2
			},
			sinon: {
				version: 1,
				qunitBridge: true,
				useFakeTimer: false
			},
			ui5: {
				libs: "sap.m"
			},
			bootCore: true,
			module: "test-resources/sap/apf/ui/{name}.qunit",
			page: "test-resources/sap/apf/ui/{name}.qunit.html"
		},
		tests: {
			"tInstance": {
				title: "Ui Instance"
			},
			"representations/tBarChart": {
				title: "Bar Chart"
			},
			"representations/tBaseUI5ChartRepresentation": {
				title: "BaseUI5ChartRepresentation"
			},
			"representations/tBaseVizFrameChartRepresentation": {
				title: ""
			},
			"representations/tBubbleChart": {
				title: "Bubble Chart"
			},
			"representations/tColumnChart": {
				title: "Column Chart"
			},
			"representations/tCombinationChart": {
				title: "Combination Chart"
			},
			"representations/tDonutChart": {
				title: "Donut Chart"
			},
			"representations/tDualCombinationChart": {
				title: "Dual Combination Chart"
			},
			"representations/tDualStackedCombinationChart": {
				title: "Dual Stacked Combination Chart"
			},
			"representations/tHeatmapChart": {
				title: "Heatmap Chart"
			},
			"representations/tLineChart": {
				title: "Line Chart"
			},
			"representations/tLineChartWithTimeAxis": {
				title: "Line Chart With Time Axis"
			},
			"representations/tLineChartWithTwoVerticalAxes": {
				title: "Line Chart With Two Vertical Axes"
			},
			"representations/tPercentageStackedBarChart": {
				title: "Percentage Stacked Bar Chart"
			},
			"representations/tPercentageStackedColumnChart": {
				title: "Percentage Stacked Column Chart"
			},
			"representations/tPieChart": {
				title: "Pie Chart"
			},
			"representations/tScatterPlotChart": {
				title: "ScatterPlot Chart"
			},
			"representations/tStackedBarChart": {
				title: "Stacked Bar Chart"
			},
			"representations/tStackedColumnChart": {
				title: "Stacked Column Chart"
			},
			"representations/tStackedCombinationChart": {
				title: "Stacked Combination Chart"
			},
			"representations/tTable": {
				title: "Table"
			},
			"representations/tTreeTable": {
				title: "Tree Table"
			},

			"representations/utils/tChartDataSetHelper": {
				title: "Chart Dataset Helper",
				ui5: {
					libs: "sap.m,sap.ui.comp,sap.viz,sap.ui.layout"
				}
			},
			"representations/utils/tDisplayOptionHandler": {
				title: "Display Option Handler",
				ui5: {
					libs: "sap.m,sap.ui.comp,sap.viz,sap.ui.layout"
				}
			},
			"representations/utils/tPaginationDisplayOptionHandler": {
				title: "Pagination Display Option Handler",
				ui5: {
					libs: "sap.m,sap.ui.comp,sap.viz,sap.ui.layout"
				}
			},
			"representations/utils/tPaginationHandler": {
				title: "Pagination Handler Unit Test",
				ui5: {
					libs: "sap.m,sap.ui.comp,sap.viz,sap.ui.layout"
				}
			},
			"representations/utils/tRepresentationFilterHandler": {
				title: "Representation Filter Handler",
				ui5: {
					libs: "sap.m,sap.ui.comp,sap.viz,sap.ui.layout"
				}
			},
			"representations/utils/tTimeAxisDateConverter": {
				title: "Time Axis Date Converter"
			},
			"representations/utils/tVizFrameSelectionHandler": {
				title: "VizFrame Selection Handler",
				ui5: {
					libs: "sap.m,sap.ui.comp,sap.viz,sap.ui.layout"
				}
			},

			"reuse/tAnalysisPath": {
				title: "Analysis Path Unit Test"
			},
			"reuse/tCarouselAPI": {
				title: "Carousel - API contract with other modules",
				loader: {
					paths: {
						"sap/apf/ui/fixture": "test-resources/sap/apf/ui/fixture/"
					}
				}
			},
			"reuse/tDeleteAnalysisPath": {
				title: "Delete Analysis Path - Unit Tests",
				ui5: {
					libs: "sap.m,sap.viz"
				}
			},
			"reuse/tFacetFilter": {
				title: "Facet Filter Controller"
			},
			"reuse/tLayout": {
				title: "Layout"
			},
			"reuse/tMessageHandler": {
				title: "Message Handler Unit Tests"
			},
			"reuse/tNavigationTarget": {
				title: "Navigation Target Unit Test"
			},
			"reuse/tPathFilterDisplay": {
				title: "Path Filter Display"
			},
			"reuse/tPathGallery": {
				title: "Path Gallery - Unit Tests"
			},
			"reuse/tSmartFilterBar": {
				title: "Smart Filter Bar Tests",
				ui5: {
					libs: "sap.m,sap.ui.comp,sap.viz,sap.ui.layout"
				}
			},
			"reuse/tStepContainer": {
				title: "Step Container View",
				ui5: {
					libs: "sap.suite.ui.commons"
				}
			},
			"reuse/tStepGallery": {
				title: "Step Gallery Unit Test"
			},
			"reuse/tToolbar": {
				title: "Toolbar Unit Test"
			},
			"reuse/tViewSetting": {
				title: "View Setting Unit Test"
			},

			"utils/tDateTimeFormatter": {
				title: "Date Time Formatter Unit Tests"
			},
			"utils/tDecimalFormatter": {
				title: "Decimal Formatter Unit Tests"
			},
			"utils/tDetermineColumnSettingsForSpreadSheetExport": {
				title: "Determine Column Settings for SpreadSheet Export Unit Tests"
			},
			"utils/tFacetFilterListConverter": {
				title: "Facet Filter List Converter - Unit Tests"
			},
			"utils/tFacetFilterListHandler": {
				title: "Facet Filter List Handler - Unit Tests"
			},
			"utils/tFacetFilterValueFormatter": {
				title: "Facet Filter Value Formatter - Unit Tests"
			},
			"utils/tFormatter": {
				title: "Formatter Unit Tests"
			},
			"utils/tHelper": {
				title: "Utils Helper Unit Tests"
			},
			"utils/tPrint": {
				title: "Print - Unit Tests"
			},
			"utils/tPrintModel": {
				title: "Print Model - Unit Tests"
			},
			"utils/tPrintView": {
				title: "Print View - Unit Tests"
			},
			"utils/tRepresentationTypesHandler": {
				title: "Representation Types Handler - Unit Tests"
			},
			"utils/tStringToDateFormatter": {
				title: "String To Date Formatter Unit Tests"
			},
			"utils/tTimeFormatter": {
				title: "Time Formatter Unit Tests"
			}
		}
	};
});
