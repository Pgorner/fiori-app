sap.ui.define(function() {

	"use strict";
	return {
		name: "QUnit TestSuite for sap.suite.ui.microchart",
		defaults: {
			title: "QUnit Test {name} - sap.suite.ui.microchart",
			ui5: {
				language: "en-US",
				libs: "sap.ui.core,sap.m,sap.suite.ui.microchart",
				theme: "sap_fiori_3",
				"xx-waitForTheme": "init"
			},
			qunit: {
				version: 2,
				reorder: false
			},
			sinon: {
				version: 4,
				qunitBridge: true,
				useFakeTimers: false
			},
			coverage: {
				only: "//sap\/suite\/ui\/microchart\/.*/"
			}
		},
		tests: {
			AreaMicroChart: {},
			BulletMicroChart: {},
			ColumnMicroChart: {},
			ComparisonMicroChart: {},
			DeltaMicroChart: {
				coverage: {
					only: "//sap\/suite\/ui\/microchart\/Delta.*/"
				}
			},
			ExploredSamples: {
				title: "Test Page for 'Explored' samples from sap.suite.ui.microchart",
				loader: {
					map: {
						"*": {
							"sap/ui/thirdparty/sinon": "sap/ui/thirdparty/sinon-4",
							"sap/ui/thirdparty/sinon-qunit": "sap/ui/qunit/sinon-qunit-bridge"
						}
					},
					paths: {
						"sap/ui/demo/mock": "test-resources/sap/ui/documentation/sdk/"
					}
				},
				runAfterLoader: "sap/ui/demo/mock/qunit/SampleTesterErrorHandler",
				ui5: {
					libs: ["sap.ui.layout", "sap.m", "sap.suite.ui.microchart", "sap.ui.documentation"],
					"xx-componentPreload": "off"
				},
				autostart: false
			},
			"Generic Testsuite": {
				page: "test-resources/sap/suite/ui/microchart/qunit/testsuite.generic.qunit.html"
			},
			HarveyBallMicroChart: {},
			HarveyBallMicroChartItem: {},
			InteractiveBarChart: {},
			InteractiveBarChartBar: {},
			InteractiveDonutChart: {},
			InteractiveDonutChartSegment: {},
			InteractiveLineChart: {},
			InteractiveLineChartPoint: {},
			LineMicroChart: {},
			RadialMicroChart: {},
			StackedBarMicroChart: {},
			library: {
				title: "QUnit: library - sap.suite.ui.microchart",
				ui5: {
					libs: "sap.suite.ui.microchart, sap.m, sap.ui.layout, sap.ui.comp, sap.ui.fl"
				}
			}
		}
	};
});
