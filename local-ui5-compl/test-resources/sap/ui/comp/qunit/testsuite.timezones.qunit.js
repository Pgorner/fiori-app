// This testsuite should not be included with the standard voter execution.
// It will be executed under different predefined timezones.
sap.ui.define([
	"sap/ui/Device"
],function(
	Device
){
	"use strict";
	var oUnitTest =  {
		name: "Timezone related tests",
		defaults: {
			group:"Library",
			qunit: {
				version: 2
			},
			sinon: {
				version: 4,
				qunitBridge: true
			},
			ui5: {
				language: "en-US",
				rtl: false,
				libs: [
					"sap.ui.comp",
					"sap.m",
					"sap.ui.unified"
				],
				"xx-waitForTheme": true
			},
			loader: {
				paths: {
					"sap/ui/comp/qunit": "test-resources/sap/ui/comp/qunit/",
					"sap/ui/core/qunit": "test-resources/sap/ui/core/qunit/",
					"sap/m/qunit": "test-resources/sap/m/qunit/",
					"sap/ui/unified/qunit": "test-resources/sap/ui/unified/qunit/",
					"sap/ui/mdc/integration": "test-resources/sap/ui/mdc/integration/"
				}
			},
			autostart: true,
			module: "./{name}.qunit"
		},
		tests: {
			"DatePicker": {
				group: "sap.m",
				module: "test-resources/sap/m/qunit/DatePicker.qunit"
			},
			"DateTimePicker": {
				group: "sap.m",
				module: "test-resources/sap/m/qunit/DateTimePicker.qunit"
			},
			"DateRangeSelection": {
				group: "sap.m",
				module: "test-resources/sap/m/qunit/DateRangeSelection.qunit"
			},
			"DynamicDateRange": {
				group: "sap.m",
				module: "test-resources/sap/m/qunit/DynamicDateRange.qunit"
			},
			"TimePicker": {
				group: "sap.m",
				module: "test-resources/sap/m/qunit/TimePicker.qunit"
			},
			"TimePickerClocks": {
				group: "sap.m",
				module: "test-resources/sap/m/qunit/TimePickerClocks.qunit"
			},
			"SinglePlanningCalendar": {
				group: "sap.m",
				module: "test-resources/sap/m/qunit/SinglePlanningCalendar.qunit"
			},
			"SinglePlanningCalendarGrid": {
				group: "sap.m",
				module: "test-resources/sap/m/qunit/SinglePlanningCalendarGrid.qunit",
				sinon: {
					useFakeTimers: true
				},
				ui5: {
					language: "en_GB"
				}
			},
			"SinglePlanningCalendarMonthGrid": {
				group: "sap.m",
				module: "test-resources/sap/m/qunit/SinglePlanningCalendarMonthGrid.qunit",
				sinon: {
					useFakeTimers: true
				},
				ui5: {
					language: "en_GB"
				}
			},
			"PlanningCalendar": {
				group: "sap.m",
				module: "test-resources/sap/m/qunit/PlanningCalendar.qunit"
			},
			"PlanningCalendar2": {
				group: "sap.m",
				module: "test-resources/sap/m/qunit/PlanningCalendar2.qunit"
			},
			"PlanningCalendarHeader": {
				group: "sap.m",
				module: "test-resources/sap/m/qunit/PlanningCalendarHeader.qunit"
			},
			"Calendar": {
				group: "sap.ui.unified",
				module: "test-resources/sap/ui/unified/qunit/Calendar.qunit"
			},
			"CalendarUtils": {
				group: "sap.ui.unified",
				module: "test-resources/sap/ui/unified/qunit/CalendarUtils.qunit"
			},
			"CalendarDate": {
				group: "sap.ui.unified",
				module: "test-resources/sap/ui/unified/qunit/CalendarDate.qunit"
			},
			"Month": {
				group: "sap.ui.unified",
				module: "test-resources/sap/ui/unified/qunit/Month.qunit"
			},
			"MonthPicker": {
				group: "sap.ui.unified",
				module: "test-resources/sap/ui/unified/qunit/MonthPicker.qunit"
			},
			"YearPicker": {
				group: "sap.ui.unified",
				module: "test-resources/sap/ui/unified/qunit/YearPicker.qunit"
			},
			"smartfilterbar/SmartFilterBar": {
				group: "SmartFilterBar"
			},
			"smartfilterbar/FilterProvider": {
				group: "SmartFilterBar"
			},
			"smartfilterbar/opaTests/DateRangeType/Opa_smartfilterbar_DateRangeConfiguration": {
				group: "SmartFilterBar"
			},
			"smartfilterbar/opaTests/DateRangeType/Opa_smartfilterbar_DateTypes_useDRT": {
				group: "SmartFilterBar"
			},
			"smartfilterbar/opaTests/DateRangeType/Opa_smartfilterbar_DateTimeOffset_Timezone": {
				group: "SmartFilterBar"
			},
			"mdc.Field": {
				group: "sap.ui.mdc",
				page: "test-resources/sap/ui/mdc/integration/field/testsuite.qunit.html"
			}
		}
	};

	return oUnitTest;
});