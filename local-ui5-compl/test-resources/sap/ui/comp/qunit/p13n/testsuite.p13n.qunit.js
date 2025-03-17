sap.ui.define([
	"sap/ui/Device"
], function () {
	"use strict";
	var oUnitTest = {
		name: "Package 'sap.ui.comp.p13n'",
		defaults: {
			group: "P13n",
			qunit: {
				version: 2
			},
			sinon: {
				version: 4,
				useFakeTimers: false
			},
			ui5: {
				language: "en-US",
				rtl: false,
				libs: [
					"sap.ui.comp"
				],
				"xx-waitForTheme": true
			},
			coverage: {
				only: "sap/ui/comp",
				branchCoverage: true
			},
			loader: {
				paths: {
					"sap/ui/comp/qunit": "test-resources/sap/ui/comp/qunit/",
					"sap/ui/core/qunit": "test-resources/sap/ui/core/qunit/",
					"sap/ui/comp/integration": "test-resources/sap/ui/comp/integration/"
				}
			},
			autostart: false,
			module: "./{name}.qunit"
		},
		tests: {
			"P13nOperationsHelper": {
				group: "P13n",
				coverage: {
					only: "sap/ui/comp/p13n/P13nOperationsHelper.js"
				}
			},
			"P13nConditionPanel": {
				group: "P13n",
				coverage: {
					only: "sap/ui/comp/p13n/P13nConditionPanel.js"
				}
			}
		}
	};

	return oUnitTest;
});
