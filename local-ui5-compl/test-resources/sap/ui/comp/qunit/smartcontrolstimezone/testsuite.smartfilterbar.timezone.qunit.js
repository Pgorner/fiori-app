sap.ui.define([
	"sap/ui/Device"
],function(
	Device
){
	"use strict";
	var oUnitTest =  {
		name: "Package 'sap.ui.comp.smartfilterbar' Timezone",
		defaults: {
			group: "SmartFilterBar Timezone",
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
			module: "./opaTests/SmartFilterBarTimezone/tests/{name}.qunit"
		},
		tests: {
			"Opa_DateTime_DFDate_Single_NoDDR_UTC": {
				group: "SmartFilterBar"
			},
			"Opa_DateTime_DFDate_Multi_NoDDR_UTC": {
				group: "SmartFilterBar"
			},
			"Opa_DateTime_DFDate_Interval_NoDDR_UTC": {
				group: "SmartFilterBar"
			},
			"Opa_DateTime_DFDate_Auto_NoDDR_UTC": {
				group: "SmartFilterBar"
			},
			"Opa_DateTime_DFDate_Single_DDR_UTC": {
				group: "SmartFilterBar"
			},
			"Opa_DateTime_DFDate_Multi_DDR_UTC": {
				group: "SmartFilterBar"
			},
			"Opa_DateTime_DFDate_Interval_DDR_UTC": {
				group: "SmartFilterBar"
			},
			"Opa_DateTime_DFDate_Auto_DDR_UTC": {
				group: "SmartFilterBar"
			},
			"Opa_DateTime_Single_DDR_UTC": {
				group: "SmartFilterBar"
			},
			"Opa_DateTime_Multi_DDR_UTC": {
				group: "SmartFilterBar"
			},
			"Opa_DateTime_Interval_DDR_UTC": {
				group: "SmartFilterBar"
			},
			"Opa_DateTime_Auto_DDR_UTC": {
				group: "SmartFilterBar"
			},
			"Opa_String_Single_CalendarDate_NoDDR_UTC": {
				group: "SmartFilterBar"
			},
			"Opa_String_Multi_CalendarDate_NoDDR_UTC": {
				group: "SmartFilterBar"
			},
			"Opa_String_Interval_CalendarDate_NoDDR_UTC": {
				group: "SmartFilterBar"
			},
			"Opa_String_Auto_CalendarDate_NoDDR_UTC": {
				group: "SmartFilterBar"
			},
			"Opa_String_Single_CalendarDate_DDR_UTC": {
				group: "SmartFilterBar"
			},
			"Opa_String_Interval_CalendarDate_DDR_UTC": {
				group: "SmartFilterBar"
			},
			"Opa_String_Interval_DDR_UTC": {
				group: "SmartFilterBar"
			},
			"Opa_DTOffset_Single_NoDDR_UTC": {
				group: "SmartFilterBar"
			},
			"Opa_DTOffset_Multi_NoDDR_UTC": {
				group: "SmartFilterBar"
			},
			// TODO: add tests for interval Edm.DateTimeOffset field
			"Opa_DTOffset_Auto_NoDDR_UTC": {
				group: "SmartFilterBar"
			},
			"Opa_DTOffset_Interval_DDR_UTC": {
				group: "SmartFilterBar"
			},
			"Opa_Time_Single_NoDDR_UTC": {
				group: "SmartFilterBar"
			},
			"Opa_Time_Multi_NoDDR_UTC": {
				group: "SmartFilterBar"
			},
			// TODO: add tests for interval Edm.Time
			"Opa_DTOffset_Interval_DDR_PRECISION_0": {
				group: "SmartFilterBar"
			},
			"Opa_DTOffset_Interval_DDR_PRECISION_1": {
				group: "SmartFilterBar"
			},
			"Opa_DTOffset_Interval_DDR_PRECISION_2": {
				group: "SmartFilterBar"
			},
			"Opa_DTOffset_Interval_DDR_PRECISION_3": {
				group: "SmartFilterBar"
			},
			"Opa_DTOffset_Interval_DDR_PRECISION_4": {
				group: "SmartFilterBar"
			},
			"Opa_DTOffset_Interval_DDR_PRECISION_5": {
				group: "SmartFilterBar"
			},
			"Opa_DTOffset_Interval_DDR_PRECISION_6": {
				group: "SmartFilterBar"
			},
			"Opa_DTOffset_Interval_DDR_PRECISION_7": {
				group: "SmartFilterBar"
			}
		}
	};

	return oUnitTest;
});
