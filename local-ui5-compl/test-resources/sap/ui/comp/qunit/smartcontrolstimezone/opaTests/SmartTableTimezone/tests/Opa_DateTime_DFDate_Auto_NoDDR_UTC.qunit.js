sap.ui.define([
	"sap/ui/comp/qunit/smartcontrolstimezone/opaTests/SmartTableTimezone/tests/TestRunner"
], function (
	TestRunner
) {
	"use strict";

	var oConfig = {
			appUrl: "sap/ui/comp/qunit/smartcontrolstimezone/opaTests/SmartTableTimezone/applicationUnderTest/SmartTable_Timezone_UTC.html",
			fieldName: "DateTime Auto d-f Date",
			fieldConfigurationString: "Edm.DateTime sap:display-format='Date' - No DateRangeType"
		},
		oExpected = {
			filterQuery: "DATETIME_AUTO_d-f_Date eq datetime'2023-02-01T00:00:00'",
			variant: "2023-02-01T00:00:00.000",
			uiState: "2023-02-01T00:00:00.000",
			filterModelNoTimezone: new Date(2023, 1, 1).toISOString(), // 1st of February 2023
			filterModelHonolulu: "2023-02-01T10:00:00.000Z",
			filterModelUTC: "2023-02-01T00:00:00.000Z",
			filterModelTarawa: "2023-01-31T12:00:00.000Z"
		};

	var oTestRunner = new TestRunner(oConfig, oExpected);

	oTestRunner.iEnterValue = function (When, sFieldName) {
		When.iEnterValueInValueHelpMultiInput("sap.m.p13n.FilterPanel", "sap.m.DatePicker", sFieldName, "2/1/23"); // 1st of February 2023
	};

	oTestRunner.start();
});
