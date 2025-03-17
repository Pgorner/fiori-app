sap.ui.define([
	"sap/ui/Device"
],function(
	Device
){
	"use strict";
	var oUnitTest =  {
		name: "Package 'sap.ui.comp.smartchart' Timezone",
		defaults: {
			group: "SmartChart Timezone",
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
					"sap/ui/core/qunit": "test-resources/sap/ui/core/qunit/",
					"sap/ui/comp/integration": "test-resources/sap/ui/comp/integration/"
				}
			},
			autostart: true,
			module: "./opaTests/SmartChartTimezone/tests/{name}.qunit"
		},
		tests: {
			"Opa_DateTime_DFDate_Single_NoDDR_UTC": {
				group: "SmartChart"
			},
			"Opa_DateTime_DFDate_Multi_NoDDR_UTC": {
				group: "SmartChart"
			},
			"Opa_DateTime_DFDate_Interval_NoDDR_UTC": {
				group: "SmartChart"
			},
			"Opa_DateTime_DFDate_Auto_NoDDR_UTC": {
				group: "SmartChart"
			},
			"Opa_DTOffset_Single_NoDDR_UTC": {
				group: "SmartChart"
			},
			"Opa_DTOffset_Multi_NoDDR_UTC": {
				group: "SmartChart"
			},
			"Opa_DTOffset_Interval_NoDDR_UTC": {
				group: "SmartChart"
			},
			"Opa_DTOffset_Auto_NoDDR_UTC": {
				group: "SmartChart"
			},
			"Opa_Time_Single_NoDDR_UTC": {
				group: "SmartChart"
			},
			"Opa_Time_Multi_NoDDR_UTC": {
				group: "SmartChart"
			},
			"Opa_Time_Interval_NoDDR_UTC": {
				group: "SmartChart"
			},
			"Opa_Time_Auto_NoDDR_UTC": {
				group: "SmartChart"
			}
		}
	};

	return oUnitTest;
});
