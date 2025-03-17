sap.ui.define([
	"sap/ui/comp/qunit/smartcontrolstimezone/opaTests/SmartTableTimezone/tests/TestRunner"
], function (
	TestRunner
) {
	"use strict";

	var oConfig = {
			appUrl: "sap/ui/comp/qunit/smartcontrolstimezone/opaTests/SmartTableTimezone/applicationUnderTest/SmartTable_Timezone_UTC.html",
			fieldName: "Time Single",
			fieldConfigurationString: "Edm.Time Single"
		},
		oExpected = {
			filterQuery: "TIME_SINGLE eq time'PT13H30M00S'",
			variant: "1970-01-01T13:30:00.000",
			uiState: "1970-01-01T13:30:00.000",
			filterModelNoTimezone: new Date(1970, 0, 1, 13, 30).toISOString(), // 1 January 1970 13:30
			filterModelHonolulu: "1970-01-01T23:30:00.000Z",
			filterModelUTC: "1970-01-01T13:30:00.000Z",
			filterModelTarawa: "1970-01-01T01:30:00.000Z"
		};

	var oTestRunner = new TestRunner(oConfig, oExpected);

	oTestRunner.iEnterValue = function (When, sFieldName) {
		When.iEnterValueInTimePicker("sap.m.p13n.FilterPanel", sFieldName, " 1:30 PM"); // 13:30
	};

	oTestRunner.start();
});
