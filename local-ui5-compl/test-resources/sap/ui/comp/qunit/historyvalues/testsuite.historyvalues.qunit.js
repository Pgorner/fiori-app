sap.ui.define([
	"sap/ui/Device"
],function(
	Device
){
	"use strict";
	var oUnitTest =  {
		name: "Package 'sap.ui.comp.historyvalues'",
		defaults: {
			group: "HistoryValues",
			qunit: {
				version: 2
			},
			sinon: {
				version: 4
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
					"sap/ui/core/qunit": "test-resources/sap/ui/core/qunit/"
				}
			},
			autostart: false,
			module: "./{name}.qunit"
		},
		tests: {
			"HistoryAppDataService": {
				group: "HistoryValues",
				coverage: {
					only: "sap/ui/comp/historyvalues/HistoryAppDataService.js"
				}
			},
			"HistoryGlobalDataService": {
				group: "HistoryValues",
				coverage: {
					only: "sap/ui/comp/historyvalues/HistoryGlobalDataService.js"
				}
			},
			"HistoryValuesProvider": {
				group: "HistoryValues",
				coverage: {
					only: "sap/ui/comp/historyvalues/HistoryValuesProvider.js"
				}
			}
		}
	};

	return oUnitTest;
});
