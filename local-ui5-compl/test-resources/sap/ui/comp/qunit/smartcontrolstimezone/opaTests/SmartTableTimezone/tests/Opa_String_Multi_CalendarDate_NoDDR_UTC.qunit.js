sap.ui.define([
	"sap/ui/comp/qunit/smartcontrolstimezone/opaTests/SmartTableTimezone/tests/TestRunner"
], function (
	TestRunner
) {
	"use strict";

	var oConfig = {
			appUrl: "sap/ui/comp/qunit/smartcontrolstimezone/opaTests/SmartTableTimezone/applicationUnderTest/SmartTable_Timezone_UTC.html",
			fieldName: "String Multi CalendarDate",
			fieldConfigurationString: "Edm.String sap:filter-restriction='multi-value' CalendarDate - No DateRangeType"
		},
		oExpected = {
			filterQuery: "STRING_MULTI_CalendarDate eq '20230201'",
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
		When.iEnterValueInValueHelpMultiInput("sap.m.p13n.FilterPanel", "sap.m.DatePicker", sFieldName, "2/1/23"); // 1st of February 2023
	};

	oTestRunner.start();
});
