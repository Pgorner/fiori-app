sap.ui.define([
	"sap/ui/comp/qunit/smartcontrolstimezone/opaTests/SmartFilterBarTimezone/tests/TestRunner"
], function (
	TestRunner
) {
	"use strict";

	var oConfig = {
			appUrl: "sap/ui/comp/qunit/smartcontrolstimezone/opaTests/SmartFilterBarTimezone/applicationUnderTest/SmartFilterBar_Timezone_UTC.html",
			fieldName: "String Single CalendarDate DDR",
			fieldConfigurationString: "Edm.String sap:filter-restriction='single-value' CalendarDate - DateRangeType"
		},
		oExpected = {
			filterQuery: "STRING_SINGLE_CalendarDate_DDR eq '20230201'",
			variant: "20230201",
			uiState: "20230201",
			filterModelNoTimezone: "20230201",
			filterModelHonolulu: "20230201",
			filterModelUTC: "20230201",
			filterModelTarawa: "20230201",
			usingUI5Date: "N/A"
		};

	var oTestRunner = new TestRunner(oConfig, oExpected);

	oTestRunner.iEnterValue = function (When, sFieldName) {
		When.iEnterValueInDynamicDateRange("sap.ui.comp.smartfilterbar.SmartFilterBar", sFieldName, "2/1/23"); // 1st of February 2023
	};

	oTestRunner.start();
});

