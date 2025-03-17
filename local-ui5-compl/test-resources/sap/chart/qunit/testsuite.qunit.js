sap.ui.define([], function () {
	"use strict";
	return {
		name: "QUnit TestSuite for chart",
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
				libs: ["sap.ui.core", "sap.chart"],
				theme: "sap_horizon",
				"xx-waitForTheme": "init"
			},
			coverage: {
				only: ["sap/chart"]
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
			AnalyticalChart: {},
			CalendarWeek: {},
			Fiscal: {},
			Colorings: {},
			HierarchyDimension: {},
			"Non-AnalyticalChart": {},
			"Non-AnalyticalChartWithJson": {},
			ODataV2Chart: {},
			ODataV4Chart: {},
			PatternColoring: {},
			Semantics: {},
			"Generic Testsuite": {
				page: "test-resources/sap/f/qunit/testsuite.generic.qunit.html"
			}
		}
	};
});
