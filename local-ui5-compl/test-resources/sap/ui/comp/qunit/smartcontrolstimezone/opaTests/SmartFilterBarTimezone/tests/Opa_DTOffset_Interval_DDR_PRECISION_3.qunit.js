sap.ui.define([
	"sap/ui/core/format/DateFormat",
	"sap/ui/comp/qunit/smartcontrolstimezone/opaTests/SmartFilterBarTimezone/tests/TestRunner"
], function (
	DateFormat,
	TestRunner
) {
	"use strict";

	var oConfig = {
			appUrl: "sap/ui/comp/qunit/smartcontrolstimezone/opaTests/SmartFilterBarTimezone/applicationUnderTest/SmartFilterBar_Timezone_UTC.html",
			fieldName: "DTOffset DDR Precision=3",
			fieldConfigurationString: "Edm.DateTimeOffset sap:filter-restriction='interval' - DateRangeType Precision=3"
		},
		oExpected = {
			filterQuery: "(DTOFFSET_DDR_PRECISION3 ge datetimeoffset'2023-02-01T13:30:00Z' and DTOFFSET_DDR_PRECISION3 le datetimeoffset'2023-02-01T13:30:00.999Z')",
			variant: "2023-02-01T13:30:00.000Z",
			uiState: "2023-02-01T13:30:00.000Z",
			filterModelNoTimezone: "2023-02-01T13:30:00.000Z", // 1st of February 2023
			filterModelHonolulu: "2023-02-01T13:30:00.000Z",
			filterModelUTC: "2023-02-01T13:30:00.000Z",
			filterModelTarawa: "2023-02-01T13:30:00.000Z"
		};

	var oTestRunner = new TestRunner(oConfig, oExpected);

	oTestRunner.iEnterValue = function (When, sFieldName) {
		var oDateTimeFormat = DateFormat.getDateTimeInstance({ pattern: "M/d/yy, h:mm a"});
		var oDateToSetWhenNoTimezone = new Date(Date.UTC(2023, 1, 1, 13, 30)); // 1st of February 2023 13:30 UTC
		var sDateToSetWhenNoTimezone = oDateTimeFormat.format(oDateToSetWhenNoTimezone);
		var sValue = sDateToSetWhenNoTimezone;

		switch (this.sTimezone) {
			case "Pacific/Honolulu":
				sValue = "2/1/23, 3:30 AM";
				break;
			case "Etc/UTC":
				sValue = "2/1/23, 1:30 PM";
				break;
			case "Pacific/Tarawa":
				sValue = "2/2/23, 1:30 AM";
				break;
		}

		When.iEnterValueInDynamicDateRange("sap.ui.comp.smartfilterbar.SmartFilterBar", sFieldName, sValue);
	};

	oTestRunner.start();
});
