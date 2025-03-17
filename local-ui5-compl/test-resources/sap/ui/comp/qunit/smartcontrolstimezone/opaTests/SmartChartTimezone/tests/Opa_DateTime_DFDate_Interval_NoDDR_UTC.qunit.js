sap.ui.define([
	"sap/ui/comp/qunit/smartcontrolstimezone/opaTests/SmartChartTimezone/tests/TestRunner"
], function (
	TestRunner
) {
	"use strict";

	var oConfig = {
			appUrl: "sap/ui/comp/qunit/smartcontrolstimezone/opaTests/SmartChartTimezone/applicationUnderTest/SmartChart_Timezone_UTC.html",
			fieldName: "DateTime Interval d-f Date",
			fieldConfigurationString: "Edm.DateTime sap:display-format='Date' sap:filter-restriction='interval' - No DateRangeType"
		},
		oExpected = {
			filterQuery: "(DATETIME_INTERVAL_d-f_Date ge datetime'2023-02-01T00:00:00' and DATETIME_INTERVAL_d-f_Date le datetime'2023-02-08T23:59:59.999')",
			variant: "2023-02-01T00:00:00.000-2023-02-08T23:59:59.999",
			uiState: "2023-02-01T00:00:00.000-2023-02-08T23:59:59.999",
			filterModelNoTimezone: new Date(2023, 1, 1).toISOString() + "-" + new Date(2023, 1, 8, 23, 59, 59, 999).toISOString(), // 1st of February 2023 - 8th of February 2023
			filterModelHonolulu: "2023-02-01T10:00:00.000Z-2023-02-09T09:59:59.999Z",
			filterModelUTC: "2023-02-01T00:00:00.000Z-2023-02-08T23:59:59.999Z",
			filterModelTarawa: "2023-01-31T12:00:00.000Z-2023-02-08T11:59:59.999Z"
		};

	var oTestRunner = new TestRunner(oConfig, oExpected);

	oTestRunner.iEnterValue = function (When, sFieldName) {
		When.iEnterValueInDateRangeSelection("sap.m.p13n.FilterPanel", sFieldName, "2/1/23 - 2/8/23"); // 1st of February 2023 - 8th of February 2023
	};

	oTestRunner.start();
});
