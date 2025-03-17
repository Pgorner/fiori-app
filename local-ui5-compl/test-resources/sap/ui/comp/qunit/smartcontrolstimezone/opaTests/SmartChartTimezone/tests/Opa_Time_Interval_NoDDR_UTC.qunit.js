sap.ui.define([
	"sap/ui/comp/qunit/smartcontrolstimezone/opaTests/SmartChartTimezone/tests/TestRunner"
], function (
	TestRunner
) {
	"use strict";

	var oConfig = {
			appUrl: "sap/ui/comp/qunit/smartcontrolstimezone/opaTests/SmartChartTimezone/applicationUnderTest/SmartChart_Timezone_UTC.html",
			fieldName: "Time Interval",
			fieldConfigurationString: "Edm.Time Interval"
		},
		oExpected = {
			filterQuery: "(TIME_INTERVAL ge time'PT13H30M00S' and TIME_INTERVAL le time'PT13H30M00S')",
			variant: "1970-01-01T13:30:00.000-1970-01-01T13:30:00.000",
			uiState: "1970-01-01T13:30:00.000-1970-01-01T13:30:00.000",
			filterModelNoTimezone: new Date(1970, 0, 1, 13, 30).toISOString() + "-" + new Date(1970, 0, 1, 13, 30).toISOString(), // 1 January 1970 13:30
			filterModelHonolulu: "1970-01-01T23:30:00.000Z-1970-01-01T23:30:00.000Z",
			filterModelUTC: "1970-01-01T13:30:00.000Z-1970-01-01T13:30:00.000Z",
			filterModelTarawa: "1970-01-01T01:30:00.000Z-1970-01-01T01:30:00.000Z"
		};

	var oTestRunner = new TestRunner(oConfig, oExpected);

	oTestRunner.iEnterValue = function (When, sFieldName) {
		When.iEnterValueInValueHelpMultiInput("sap.m.p13n.FilterPanel", "sap.m.TimePicker",  sFieldName, " 1:30:00 PM", "sap.m.Input"); // 13:30
	};

	oTestRunner.start();
});
