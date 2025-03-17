sap.ui.define(function () {
	"use strict";

	return {
		name: "Tests for Products Manage",
		defaults: {
			page: "ui5://test-resources/sap/ui/demoapps/rta/freestyle/Test.qunit.html?testsuite={suite}&test={name}",
			qunit: {
				version: 2
			},
			sinon: {
				version: 4
			},
			ui5: {
				theme: "sap_horizon"
			},
			loader: {
				paths: {
					"sap/ui/demoapps/rta": "../../",
					"sap/ui/rta/test": "../../../../../../../sap/ui/rta/",
					"test-resources": "../../../../../../../../test-resources"
				}
			}
		},
		tests: {
			"unit/unitTests": {
				title: "Unit tests for Products Manage"
			},
			"integration/opaTestsRta": {
				title: "Opa tests for Products Manage"
			},
			"integration/opaTestsProductMaster": {
				title: "Opa tests for Products Manage"
			},
			"integration/opaTestsIFrame": {
				title: "Opa tests for Products Manage"
			},
			"integration/opaTestsCViz": {
				title: "Opa tests for Products Manage"
			},
			"integration/opaTestsCombined": {
				title: "Opa tests for Products Manage"
			}
		}
	};
});