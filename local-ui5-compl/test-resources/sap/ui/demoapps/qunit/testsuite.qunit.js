sap.ui.define(function () {
	"use strict";

	return {
		name: "QUnit test suite for TSTodos",
		defaults: {
			page: "ui5://test-resources/sap/ui/demoapps/demokit/rta/Test.qunit.html?testsuite={suite}&test={name}",
			qunit: {
				version: 2
			},
			sinon: {
				version: 1
			},
			ui5: {
				theme: "sap_horizon"
			},
			loader: {
				paths: {
					"sap/ui/demoapps/demokit/rta": "../"
				}
			}
		},
		tests: {
			"fe": {
				title: "QUnit TestSuite for Products Manage V2 Key User Adaptation",
				page: "test-resources/sap/ui/demoapps/demokit/rta/fe/test/testsuite.qunit.html"
			},
			"fev4": {
				title: "Opa tests for Products Manage V4 Key User Adaptation",
				page: "test-resources/sap/ui/demoapps/demokit/rta/fev4/test/testsuite.qunit.html"
			},
			"freestyle": {
				title: "Tests for Products Manage",
				skip: true,
				page: "test-resources/sap/ui/demoapps/demokit/rta/freestyle/test/testsuite.qunit.html"
			}
		}
	};
});