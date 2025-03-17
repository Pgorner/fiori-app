sap.ui.define(function() {
	"use strict";

	return {
		name: "APF Testhelper Testsuite",
		defaults: {
			loader: {
				paths: {
					"sap/apf/integration": "test-resources/sap/apf/integration/",
					"sap/apf/internal/server": "test-resources/sap/apf/internal/server/",
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
			module: "test-resources/sap/apf/testhelper/tests/{name}.qunit",
			page: "test-resources/sap/apf/testhelper/tests/{name}.qunit.html"
		},
		tests: {
			"config/tSampleConfiguration": {},
			"doubles/tMetadata": {},
			"doubles/tRepresentation": {},
			"doubles/tRequest": {},
			"odata/tSampleServiceData": {},
			"tAuthTestHelper": {
				"skip": true  // test is not suitable for automated test execution
			},
			"tConcurrenceTester": {},
			"tHelper": {},
			"tOPA": {},
			"tPropertyStub": {
				"skip": true  // test is not suitable for automated test execution
			},
			"tUshellHelper": {
				"skip": true  // test is not suitable for automated test execution
			},
		}
	};
});
