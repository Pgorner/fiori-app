sap.ui.define([
	"sap/ui/Device"
],function(
){
	"use strict";
	var oUnitTest =  {
		name: "Package 'sap.ui.comp.valuehelpdialog'",
		defaults: {
			group: "ValueHelpDialog",
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
			autostart: true,
			module: "./{name}.qunit"
		},
		tests: {
			"ItemsCollection": {
				group: "ValueHelpDialog",
				coverage: {
					only: "sap/ui/comp/valuehelpdialog/ItemsCollection.js"
				}
			},
			"ValueHelpDialog": {
				group: "ValueHelpDialog",
				coverage: {
					only: "sap/ui/comp/valuehelpdialog/ValueHelpDialog.js"
				}
			},
			"opaTests/ValueHelpDialog.opa": {
				group: "ValueHelpDialog"
			},
			"opaTests/ValueHelpDialog.2.opa": {
				group: "ValueHelpDialog"
			},
			"../providers/TokenParser": {
				group: "ValueHelpDialog",
				coverage: {
					only: "sap/ui/comp/providers/TokenParser.js"
				}
			}
		}
	};

	return oUnitTest;
});
