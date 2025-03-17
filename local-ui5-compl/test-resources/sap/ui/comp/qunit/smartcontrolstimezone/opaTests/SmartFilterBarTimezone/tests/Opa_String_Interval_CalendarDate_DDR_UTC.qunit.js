sap.ui.define([
	"sap/ui/comp/qunit/smartcontrolstimezone/opaTests/SmartFilterBarTimezone/tests/TestRunner"
], function (
	TestRunner
) {
	"use strict";

	var oConfig = {
			appUrl: "sap/ui/comp/qunit/smartcontrolstimezone/opaTests/SmartFilterBarTimezone/applicationUnderTest/SmartFilterBar_Timezone_UTC.html",
			fieldName: "String Interval CalendarDate DDR",
			fieldConfigurationString: "Edm.String sap:filter-restriction='interval' CalendarDate - DateRangeType"
		},
		oExpected = {
			filterQuery: "(STRING_INTERVAL_CalendarDate_DDR ge '20230201' and STRING_INTERVAL_CalendarDate_DDR le '20230208')",
			variant: "20230201-20230208",
			uiState: "20230201-20230208",
			filterModelNoTimezone: "20230201-20230208",
			filterModelHonolulu: "20230201-20230208",
			filterModelUTC: "20230201-20230208",
			filterModelTarawa: "20230201-20230208",
			usingUI5Date: "N/A"
		};

	var oTestRunner = new TestRunner(oConfig, oExpected);

	oTestRunner.iEnterValue = function (When, sFieldName) {
		When.iEnterValueInDynamicDateRange("sap.ui.comp.smartfilterbar.SmartFilterBar", sFieldName, "2/1/23 - 2/8/23"); // 1st of February 2023 - 8th of February 2023
	};

	oTestRunner.start();
});
