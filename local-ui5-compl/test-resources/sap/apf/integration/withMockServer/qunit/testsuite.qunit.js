sap.ui.define(function() {
	"use strict";

	return {
		name: "APF TestSuite",
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
				noConflict: true
			},
			bootCore: true,
			module: "test-resources/sap/apf/integration/withMockServer/{name}",
			page: "test-resources/sap/apf/integration/withMockServer/{name}.html"
		},
		tests: {
			tAnalysis: {
				/* was commented out in original testsuite / not migrated / might have errors */
				skip: true
			},
			tAnalysisPath: {
				/* was not part of original testsuite, has errors */
				skip: true,
				title: "Addition and Deletion of steps in Analysis Path"
			},
			tAnalysisPathToolBar: {
				/* was not part of original testsuite, has errors */
				skip: true,
			},
			tAPF_Filters: {
				/* was commented out in original testsuite / not migrated / might have errors */
				skip: true
			},
			tChartContainer: {
				/* was commented out in original testsuite / not migrated / might have errors */
				skip: true
			},
			tChartToolbar: {
				/* was not part of original testsuite, has errors */
				skip: true
			},
			tDragnDrop: {
				/* was not part of original testsuite, has errors */
				skip: true
			},
			tFacetFilters: {
				/* was not part of original testsuite, has errors */
				skip: true
			},
			tFooterFilters: {
				/* was not part of original testsuite, has errors */
				skip: true
			},
			tViewSettingsIcon: {
				/* was not part of original testsuite, has errors */
				skip: true
			}
		}
	};
});
