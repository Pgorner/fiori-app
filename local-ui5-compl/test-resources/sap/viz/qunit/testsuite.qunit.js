sap.ui.define(function () {
	"use strict";
	return {
		name: "QUnit TestSuite for sap.viz",
		defaults: {
			group: "Default",
			qunit: {
				version: 2
			},
			sinon: {
				version: 4
			},
			ui5: {
				language: "en",
				libs: ["sap.ui.core", "sap.viz"],
				"xx-waitForTheme": "init"
			},
			coverage: {
				only: ["sap/viz"]
			},
			loader: {
				paths: {
					"sap/ui/demo/mock": "test-resources/sap/ui/documentation/sdk/"
				}
			},
			module: "./controls/{name}.test",
			autostart: true
		},
		tests: {
			CategoryTicker: {
				title: "QUnit Test for Category Ticker"
			},
			/**
			 * @deprecated since 1.32
			 */
			charts: {
				title: "Qunit Test for Display Charts"
			},
			/**
			 * @deprecated since 1.32
			 */
			ChartWrappers: {
				title: "QUnit Test for Chart Wrappers"
			},
			ColorPalette: {
				skip: true,
				title: "QUnit Test for Display Charts",
				ui5: {
					theme: "sap_belize" // test only knows expected values for sap_belize(hcb|hcw) themes
				}
			},
			/**
			 * @deprecated since 1.32
			 */
			Dataset: {
				title: "QUnit Test for FlattenedDataset"
			},
			DonutCharts: {
				title: "QUnit Test for Donut Charts"
			},
			EnforceSemanticRendering: {
				title: "QUnit Test for Enforcing Semantic Rendering"
			},
			/**
			 * @deprecated since 1.32
			 */
			Events: {
				title: "QUnit Test for Display Charts"
			},
			ExploredSamples: {
				title: "Test Page for 'Explored' samples from sap.viz",
				loader: {
					map: {
						"*": {
							"sap/ui/thirdparty/sinon": "sap/ui/thirdparty/sinon-4",
							"sap/ui/thirdparty/sinon-qunit": "sap/ui/qunit/sinon-qunit-bridge"
						}
					}
				},
				runAfterLoader: "sap/ui/demo/mock/qunit/SampleTesterErrorHandler",
				ui5: {
					libs: ["sap.ui.documentation", "sap.ui.layout", "sap.m", "sap.viz"],
					"xx-componentPreload": "off"
				},
				autostart: false
			},
			"Generic Testsuite": {
				page: "test-resources/sap/viz/qunit/testsuite.generic.qunit.html"
			},
			/**
			 * @deprecated since 1.32
			 */
			Interaction: {
				title: "QUnit Tests for Selection/Interaction"
			},
			Popover: {
				title: "QUnit Test for Chart Popover"
			},
			/**
			 * @deprecated since 1.32
			 */
			Properties: {
				title: "QUnit Test for Chart Properties"
			},
			RangeSlider: {
				title: "QUnit Test for Display Charts"
			},
			RequireCssPlugin: {
				title: "QUnit Test for Display Charts"
			},
			ThemingUtil: {
				title: "QUnit Test for Theming Util"
			},
			TimeSeriesCharts: {
				title: "QUnit Test for Display Chart"
			},
			Tooltip: {
				title: "QUnit Test for Chart Tooltip"
			},
			/**
			 * @deprecated since 1.32
			 */
			VizContainer: {
				title: "QUnit Test for Display VizContainer"
			},
			VizFrame: {
				title: "QUnit Test for Display VizFrame"
			},
			VizFrame_unavoidablyUsingInlineStyles: {
				title: "QUnit Test for Display VizFrame (exportAsSVG)"
			},
			VIZGlobalAPI: {
				title: "QUnit Test for Display Charts",
				qunit: {
					reorder: false
				}
			},
			CalendarWeeks: {
				title: "QUnit Test for Calendar Weeks"
			},
			/**
			 * @deprecated since 1.32
			 */
			VIZGlobalAPIUsingWrapper: {
				title: "QUnit Test for Display Charts",
				qunit: {
					reorder: false
				}
			}
		}
	};
});
