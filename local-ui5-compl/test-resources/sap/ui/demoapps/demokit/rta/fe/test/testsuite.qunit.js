sap.ui.define(function () {
	"use strict";

	return {
		name: "QUnit TestSuite for Products Manage V2 Key User Adaptation",
		defaults: {
			page: "ui5://test-resources/sap/ui/demoapps/demokit/rta/fe/Test.qunit.html?testsuite={suite}&test={name}",
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
					"sap/ui/demoapps/rta": "../../",
					"sap/ui/demoapps/rta/fe": "../",
					"sap/ui/rta/test": "../../../../../../../sap/ui/rta/",
					"test-resources": "../../../../../../../../test-resources"
				}
			}
		},
		tests: {
			"integration/opaTests": {
				title: "QUnit TestSuite for Products Manage V2 Key User Adaptation"
			}
		}
	};
});