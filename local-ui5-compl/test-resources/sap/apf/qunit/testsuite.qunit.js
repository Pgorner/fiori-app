sap.ui.define(function() {
	"use strict";

	return {
		name: "Global APF QUnit TestSuite",
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
			bootCore: true,
			module: "test-resources/sap/apf/{name}.qunit",
			page: "test-resources/sap/apf/{name}.qunit.html"
		},
		tests: {
	        // first we execute all the Core QUnit tests
			"core/qunit/testsuite": {},
			"ui/qunit/testsuite": {},
			"integration/withDoubles/qunit/testsuite": {},
			"integration/withMockServer/qunit/testsuite": {},
			"abap/tLrepConnector": {
				title: "Lrep Connector",
				sinon: {
					version: 4,
					qunitBridge: false
				},
				ui5: {
					libs: "sap.m,sap.suite.ui.commons"
				}
			},
			//modeler
			"modeler/core/qunit/testsuite": {},
			"modeler/ui/qunit/testsuite": {},
			"modeler/integration/qunit/testsuite": {},
			"demokit/tMockserver": {
				title: "Demokit Mockerserver",
				ui5: {
					libs: "sap.m"
				}
			},
			// cloud foundry
			"cloudFoundry/ui/qunit/testsuite": {},
			"integration/cloudFoundry/qunit/testsuite": {},
			"testhelper/tests/qunit/testsuite": {}
		}
	};
});
