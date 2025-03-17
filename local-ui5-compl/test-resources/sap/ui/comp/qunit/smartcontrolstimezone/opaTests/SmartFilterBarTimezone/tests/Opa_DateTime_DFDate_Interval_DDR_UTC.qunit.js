sap.ui.define([
	"sap/ui/comp/qunit/smartcontrolstimezone/opaTests/SmartFilterBarTimezone/tests/TestRunner"
], function (
	TestRunner
) {
	"use strict";

	var oConfig = {
			appUrl: "sap/ui/comp/qunit/smartcontrolstimezone/opaTests/SmartFilterBarTimezone/applicationUnderTest/SmartFilterBar_Timezone_UTC.html",
			fieldName: "DateTime Interval d-f Date DDR",
			fieldConfigurationString: "Edm.DateTime sap:display-format='Date' sap:filter-restriction='interval' - DateRangeType"
		},
		oExpected = {
			filterQuery: "(DATETIME_INTERVAL_d-f_Date_DDR ge datetime'2023-02-01T00:00:00' and DATETIME_INTERVAL_d-f_Date_DDR le datetime'2023-02-01T00:00:00')",
			variant: "2023-02-01T00:00:00.000",
			uiState: "2023-02-01T00:00:00.000-2023-02-01T23:59:59.999",
			filterModelNoTimezone: new Date(2023, 1, 1).toISOString(), // 1st of February 2023
			filterModelHonolulu: "2023-02-01T10:00:00.000Z",
			filterModelUTC: "2023-02-01T00:00:00.000Z",
			filterModelTarawa: "2023-01-31T12:00:00.000Z"
		};

	var oTestRunner = new TestRunner(oConfig, oExpected);

	oTestRunner.iEnterValue = function (When, sFieldName) {
		When.iEnterValueInDynamicDateRange("sap.ui.comp.smartfilterbar.SmartFilterBar", sFieldName, "2/1/23"); // 1st of February 2023
	};

	oTestRunner.start();
});
