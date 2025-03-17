sap.ui.define(["./common/testHelper", "./common/utility"], function (TestHelper, Utility) {
	"use strict";
	var sSelectedTests = Utility.searchParams("runTests"),
		sSelectedTestGroups = Utility.searchParams("runTestGroups"),
		sExcludeTestGroups = Utility.searchParams("excludeTestGroups");

	return {
		name: "QUnit TestSuite for sap.fe (runs only under /testsuite)",
		defaults: {
			ui5: {
				language: "en",
				noConflict: true,
				theme: "sap_fiori_3",
				resourceRoots: {
					"test.sap.fe.templates.internal": "/test-resources/sap/fe/templates/internal"
				},
				libs: ["sap.fe.templates", "sap.fe.test"]
			},
			sinon: true,
			loader: {
				paths: {
					tests: "test-resources/sap/fe/templates/qunit",
					qunit: "test-resources/sap/fe/templates/qunit"
				}
			},
			bootCore: true,
			qunit: {
				version: 2
			}
		},
		tests: TestHelper.createTestSuite(sSelectedTestGroups, sSelectedTests, sExcludeTestGroups)
	};
});
