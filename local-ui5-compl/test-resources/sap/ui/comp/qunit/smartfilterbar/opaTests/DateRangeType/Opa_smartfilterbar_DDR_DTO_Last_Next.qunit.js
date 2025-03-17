/* global QUnit */
sap.ui.define([
	"sap/ui/core/Lib",
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/test/actions/Press",
	"sap/ui/test/actions/EnterText",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"sap/ui/core/date/UniversalDateUtils",
	'sap/ui/core/date/UniversalDate',
	'sap/ui/core/date/UI5Date',
	"sap/ui/comp/qunit/smartfilterbar/opaTests/DateRangeType/actions/DateRangeActions",
	"sap/ui/comp/qunit/smartfilterbar/opaTests/DateRangeType/assertions/DateRangeAssertions"
], function(
	Library,
	Opa5,
	opaTest,
	Press,
	EnterText,
	PropertyStrictEquals,
	UniversalDateUtils,
	UniversalDate,
	UI5Date,
	Actions,
	Assertions
) {
	"use strict";

	var getDateTimeAsDateTimeOffsetString = function (oDate, bEnd) {
			var oCurrentDate = oDate.oDate ? oDate.oDate : oDate;
			var sPadString = "0",
				sDate = oCurrentDate.getFullYear().toString().padStart(4, sPadString) + "-" +
					(oCurrentDate.getMonth() + 1).toString().padStart(2, sPadString) + "-" +
					oCurrentDate.getDate().toString().padStart(2, sPadString) + "T" +
					oCurrentDate.getHours().toString().padStart(2, sPadString) + ":" +
					oCurrentDate.getMinutes().toString().padStart(2, sPadString) + (bEnd ? ":59.999Z" : ":00Z");
			return sDate;
		},
		getDateAsDateTimeString = function (oDate) {
			var sDate = oDate.oDate ? oDate.oDate.toISOString() : oDate.toISOString();

			return sDate.substring(0, sDate.length - 13) + "00:00:00";
		},
		oYesterday = UniversalDateUtils.ranges.yesterday(),
		sYesterdayStart = getDateAsDateTimeString(oYesterday[0]);

	Opa5.extendConfig({
		viewName: "SmartFilterBar",
		viewNamespace: "applicationUnderTest.smartfilterbar_DateTypes_useDRT",
		autoWait: true,
		enabled: false,
		async: true,
		timeout: 120,
		arrangements: new Opa5({
			iStartMyApp: function () {
				return this.iStartMyAppInAFrame(
					sap.ui.require.toUrl(
						"sap/ui/comp/qunit/smartfilterbar/opaTests/DateRangeType/applicationUnderTest/SmartFilterBar_DateTypes_UseDRT.html"
					));
			},
			iEnsureMyAppIsRunning: function () {
				if (!this._myApplicationIsRunning) {
					this.iStartMyApp();
					this._myApplicationIsRunning = true;
				}
			},
			iStopMyApp: function () {
				this._myApplicationIsRunning = false;
				return this.iTeardownMyAppFrame();
			}
		}),
			actions: Actions,
			assertions: Assertions
	});


	QUnit.module("Include current period options EDM.DateTimeOffset");

	opaTest("Check DateTimeOffset interval option last days included", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		var  sControlId = "smartFilterBar-filterItemControlA_-DTOFFSET_INTERVAL-input",
			oLastDays = UniversalDateUtils.ranges.lastDays(1),
			sLasDaysStart = getDateTimeAsDateTimeOffsetString(oLastDays[0]),
			sLastDaysEnd = getDateTimeAsDateTimeOffsetString(oLastDays[1], true),
			oLastDaysIncluded = UniversalDateUtils.ranges.lastDays(0),
			sLastDaysIncludedStart = getDateTimeAsDateTimeOffsetString(oLastDaysIncluded[0]),
			oLastDaysIncludedEnd = UniversalDate.getInstance(UI5Date.getInstance());
		oLastDaysIncludedEnd.setHours(23);
		oLastDaysIncludedEnd.setMinutes(59);
		var sLastDaysIncludedEnd =  getDateTimeAsDateTimeOffsetString(oLastDaysIncludedEnd, true);
		// Act
		When.iOpenTheVHD(sControlId);
		When.iSelectDateOperationByKey("LASTMINUTES");
		When.iSetValueToSelectedOperation([1], "LASTDAYS");
		When.iClickApply();

		When.iPressTheFilterGoButton();

		// Assert
		var sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and (DTOFFSET_INTERVAL ge datetimeoffset'" + sLasDaysStart + "' and DTOFFSET_INTERVAL le datetimeoffset'" + sLastDaysEnd + "')";

		Then.theFiltersShouldMatch(sResult);

		// Clean
		When.iPressTheRestoreButton();
		When.iClickShowAll();

		// Act
		When.iOpenTheVHD(sControlId);
		When.iSelectDateOperationByKey("LASTMINUTES");
		When.iSetValueToSelectedOperation([1], "LASTDAYSINCLUDED");
		When.iClickApply();

		When.iPressTheFilterGoButton();

		// Assert
		sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and (DTOFFSET_INTERVAL ge datetimeoffset'" + sLastDaysIncludedStart + "' and DTOFFSET_INTERVAL le datetimeoffset'" + sLastDaysIncludedEnd + "')";

		Then.theFiltersShouldMatch(sResult);

		// Clean
		When.iPressTheRestoreButton();
		When.iClickShowAll();
	});

	opaTest("Check DateTimeOffset interval option last weeks included", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		var  sControlId = "smartFilterBar-filterItemControlA_-DTOFFSET_INTERVAL-input",
			oLastWeek = UniversalDateUtils.ranges.lastWeeks(2),
			sLastWeekStart = getDateTimeAsDateTimeOffsetString(oLastWeek[0]),
			sLastWeekEnd = getDateTimeAsDateTimeOffsetString(oLastWeek[1], true),
			oLastWeekIncluded = UniversalDateUtils.ranges.lastWeeks(1),
			sLastWeekIncludedStart = getDateTimeAsDateTimeOffsetString(oLastWeekIncluded[0]),
			oLastWeekIncludedEnd = UniversalDate.getInstance(UI5Date.getInstance());
		oLastWeekIncludedEnd.setHours(23);
		oLastWeekIncludedEnd.setMinutes(59);
		var sLastWeekIncludedEnd =  getDateTimeAsDateTimeOffsetString(oLastWeekIncludedEnd, true);

		// Act
		When.iOpenTheVHD(sControlId);
		When.iSelectDateOperationByKey("LASTMINUTES");
		When.iSetValueToSelectedOperation([2], "LASTWEEKS");
		When.iClickApply();

		When.iPressTheFilterGoButton();

		// Assert
		var sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and (DTOFFSET_INTERVAL ge datetimeoffset'" + sLastWeekStart + "' and DTOFFSET_INTERVAL le datetimeoffset'" + sLastWeekEnd + "')";

		Then.theFiltersShouldMatch(sResult);

		// Clean
		When.iPressTheRestoreButton();
		When.iClickShowAll();

		// Act
		When.iOpenTheVHD(sControlId);
		When.iSelectDateOperationByKey("LASTMINUTES");
		When.iSetValueToSelectedOperation([2], "LASTWEEKSINCLUDED");
		When.iClickApply();

		When.iPressTheFilterGoButton();

		// Assert
		sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and (DTOFFSET_INTERVAL ge datetimeoffset'" + sLastWeekIncludedStart + "' and DTOFFSET_INTERVAL le datetimeoffset'" + sLastWeekIncludedEnd + "')";

		Then.theFiltersShouldMatch(sResult);

		// Clean
		When.iPressTheRestoreButton();
		When.iClickShowAll();
	});

	opaTest("Check DateTimeOffset interval option last months included", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		var  sControlId = "smartFilterBar-filterItemControlA_-DTOFFSET_INTERVAL-input",
			oLastMonths = UniversalDateUtils.ranges.lastMonths(2),
			sLastMonthsStart = getDateTimeAsDateTimeOffsetString(oLastMonths[0]),
			sLastMonthsEnd = getDateTimeAsDateTimeOffsetString(oLastMonths[1], true),
			oLastMonthsIncluded = UniversalDateUtils.ranges.lastMonths(1),
			sLastMonthsIncludedStart = getDateTimeAsDateTimeOffsetString(oLastMonthsIncluded[0]),
			oLastMonthsIncludedEnd = UniversalDate.getInstance(UI5Date.getInstance());
		oLastMonthsIncludedEnd.setHours(23);
		oLastMonthsIncludedEnd.setMinutes(59);
		var sLastMonthsIncludedEnd =  getDateTimeAsDateTimeOffsetString(oLastMonthsIncludedEnd, true);

		// Act
		When.iOpenTheVHD(sControlId);
		When.iSelectDateOperationByKey("LASTMINUTES");
		When.iSetValueToSelectedOperation([2], "LASTMONTHS");
		When.iClickApply();

		When.iPressTheFilterGoButton();

		// Assert
		var sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and (DTOFFSET_INTERVAL ge datetimeoffset'" + sLastMonthsStart + "' and DTOFFSET_INTERVAL le datetimeoffset'" + sLastMonthsEnd + "')";

		Then.theFiltersShouldMatch(sResult);

		// Clean
		When.iPressTheRestoreButton();
		When.iClickShowAll();

		// Act
		When.iOpenTheVHD(sControlId);
		When.iSelectDateOperationByKey("LASTMINUTES");
		When.iSetValueToSelectedOperation([2], "LASTMONTHSINCLUDED");
		When.iClickApply();

		When.iPressTheFilterGoButton();

		// Assert
		sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and (DTOFFSET_INTERVAL ge datetimeoffset'" + sLastMonthsIncludedStart + "' and DTOFFSET_INTERVAL le datetimeoffset'" + sLastMonthsIncludedEnd + "')";

		Then.theFiltersShouldMatch(sResult);

		// Clean
		When.iPressTheRestoreButton();
		When.iClickShowAll();
	});

	opaTest("Check DateTimeOffset interval option last quarters included", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		var  sControlId = "smartFilterBar-filterItemControlA_-DTOFFSET_INTERVAL-input",
			oLastQuarters = UniversalDateUtils.ranges.lastQuarters(2),
			sLastQuartersStart = getDateTimeAsDateTimeOffsetString(oLastQuarters[0]),
			sLastQuartersEnd = getDateTimeAsDateTimeOffsetString(oLastQuarters[1], true),
			oLastQuartersIncluded = UniversalDateUtils.ranges.lastQuarters(1),
			sLastQuartersIncludedStart = getDateTimeAsDateTimeOffsetString(oLastQuartersIncluded[0]),
			oLastQuartersIncludedEnd = UniversalDate.getInstance(UI5Date.getInstance());
		oLastQuartersIncludedEnd.setHours(23);
		oLastQuartersIncludedEnd.setMinutes(59);
		var sLastQuartersIncludedEnd =  getDateTimeAsDateTimeOffsetString(oLastQuartersIncludedEnd, true);

		// Act
		When.iOpenTheVHD(sControlId);
		When.iSelectDateOperationByKey("LASTMINUTES");
		When.iSetValueToSelectedOperation([2], "LASTQUARTERS");
		When.iClickApply();

		When.iPressTheFilterGoButton();

		// Assert
		var sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and (DTOFFSET_INTERVAL ge datetimeoffset'" + sLastQuartersStart + "' and DTOFFSET_INTERVAL le datetimeoffset'" + sLastQuartersEnd + "')";

		Then.theFiltersShouldMatch(sResult);

		// Clean
		When.iPressTheRestoreButton();
		When.iClickShowAll();

		// Act
		When.iOpenTheVHD(sControlId);
		When.iSelectDateOperationByKey("LASTMINUTES");
		When.iSetValueToSelectedOperation([2], "LASTQUARTERSINCLUDED");
		When.iClickApply();

		When.iPressTheFilterGoButton();

		// Assert
		sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and (DTOFFSET_INTERVAL ge datetimeoffset'" + sLastQuartersIncludedStart + "' and DTOFFSET_INTERVAL le datetimeoffset'" + sLastQuartersIncludedEnd + "')";

		Then.theFiltersShouldMatch(sResult);

		// Clean
		When.iPressTheRestoreButton();
		When.iClickShowAll();
	});

	opaTest("Check DateTimeOffset interval option last years included", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		var  sControlId = "smartFilterBar-filterItemControlA_-DTOFFSET_INTERVAL-input",
			oLastYears = UniversalDateUtils.ranges.lastYears(2),
			sLastYearsStart = getDateTimeAsDateTimeOffsetString(oLastYears[0]),
			sLastYearsEnd = getDateTimeAsDateTimeOffsetString(oLastYears[1], true),
			oLastYearsIncluded = UniversalDateUtils.ranges.lastYears(1),
			sLastYearsIncludedStart = getDateTimeAsDateTimeOffsetString(oLastYearsIncluded[0]),
			oLastYearsIncludedEnd = UniversalDate.getInstance(UI5Date.getInstance());
		oLastYearsIncludedEnd.setHours(23);
		oLastYearsIncludedEnd.setMinutes(59);
		var sLastYearsIncludedEnd =  getDateTimeAsDateTimeOffsetString(oLastYearsIncludedEnd, true);

		// Act
		When.iOpenTheVHD(sControlId);
		When.iSelectDateOperationByKey("LASTMINUTES");
		When.iSetValueToSelectedOperation([2], "LASTYEARS");
		When.iClickApply();

		When.iPressTheFilterGoButton();

		// Assert
		var sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and (DTOFFSET_INTERVAL ge datetimeoffset'" + sLastYearsStart + "' and DTOFFSET_INTERVAL le datetimeoffset'" + sLastYearsEnd + "')";

		Then.theFiltersShouldMatch(sResult);

		// Clean
		When.iPressTheRestoreButton();
		When.iClickShowAll();

		// Act
		When.iOpenTheVHD(sControlId);
		When.iSelectDateOperationByKey("LASTMINUTES");
		When.iSetValueToSelectedOperation([2], "LASTYEARSINCLUDED");
		When.iClickApply();

		When.iPressTheFilterGoButton();

		// Assert
		sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and (DTOFFSET_INTERVAL ge datetimeoffset'" + sLastYearsIncludedStart + "' and DTOFFSET_INTERVAL le datetimeoffset'" + sLastYearsIncludedEnd + "')";

		Then.theFiltersShouldMatch(sResult);

		// Clean
		When.iPressTheRestoreButton();
		When.iClickShowAll();
	});

	opaTest("Check DateTimeOffset interval option next days included", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		var  sControlId = "smartFilterBar-filterItemControlA_-DTOFFSET_INTERVAL-input",
			oNextDays = UniversalDateUtils.ranges.nextDays(2),
			sNextDaysStart = getDateTimeAsDateTimeOffsetString(oNextDays[0]),
			sNextDaysEnd = getDateTimeAsDateTimeOffsetString(oNextDays[1], true),
			oNextDaysIncluded = UniversalDateUtils.ranges.nextDays(1),
			sNextDaysIncludedEnd =  getDateTimeAsDateTimeOffsetString(oNextDaysIncluded[1], true);
		// Act
		When.iOpenTheVHD(sControlId);
		When.iSelectDateOperationByKey("NEXTMINUTES");
		When.iSetValueToSelectedOperation([2], "NEXTDAYS");
		When.iClickApply();

		When.iPressTheFilterGoButton();

		// Assert
		var sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and (DTOFFSET_INTERVAL ge datetimeoffset'" + sNextDaysStart + "' and DTOFFSET_INTERVAL le datetimeoffset'" + sNextDaysEnd + "')";

		Then.theFiltersShouldMatch(sResult);

		// Clean
		When.iPressTheRestoreButton();
		When.iClickShowAll();

		// Act
		When.iOpenTheVHD(sControlId);
		When.iSelectDateOperationByKey("NEXTMINUTES");
		When.iSetValueToSelectedOperation([2], "NEXTDAYSINCLUDED");
		When.iClickApply();

		When.iPressTheFilterGoButton();

		// Assert
		var aResult = ["DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and (DTOFFSET_INTERVAL ge datetimeoffset'", "' and DTOFFSET_INTERVAL le datetimeoffset'" + sNextDaysIncludedEnd + "')"];

		Then.theFiltersShouldContains(aResult);
		Then.theFiltersShouldNotContains([sNextDaysStart]);

		// Clean
		When.iPressTheRestoreButton();
		When.iClickShowAll();
	});

	opaTest("Check DateTimeOffset interval option next weeks included", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		var  sControlId = "smartFilterBar-filterItemControlA_-DTOFFSET_INTERVAL-input",
			oNextWeeks = UniversalDateUtils.ranges.nextWeeks(2),
			sNextWeeksStart = getDateTimeAsDateTimeOffsetString(oNextWeeks[0]),
			sNextWeeksEnd = getDateTimeAsDateTimeOffsetString(oNextWeeks[1], true),
			oNextWeeksIncluded = UniversalDateUtils.ranges.nextWeeks(1),
			sNextWeeksIncludedEnd =  getDateTimeAsDateTimeOffsetString(oNextWeeksIncluded[1], true);

		// Act
		When.iOpenTheVHD(sControlId);
		When.iSelectDateOperationByKey("NEXTMINUTES");
		When.iSetValueToSelectedOperation([2], "NEXTWEEKS");
		When.iClickApply();

		When.iPressTheFilterGoButton();

		// Assert
		var sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and (DTOFFSET_INTERVAL ge datetimeoffset'" + sNextWeeksStart + "' and DTOFFSET_INTERVAL le datetimeoffset'" + sNextWeeksEnd + "')";

		Then.theFiltersShouldMatch(sResult);

		// Clean
		When.iPressTheRestoreButton();
		When.iClickShowAll();

		// Act
		When.iOpenTheVHD(sControlId);
		When.iSelectDateOperationByKey("NEXTMINUTES");
		When.iSetValueToSelectedOperation([2], "NEXTWEEKSINCLUDED");
		When.iClickApply();

		When.iPressTheFilterGoButton();

		// Assert
		var aResult = ["DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and (DTOFFSET_INTERVAL ge datetimeoffset'", "' and DTOFFSET_INTERVAL le datetimeoffset'" + sNextWeeksIncludedEnd + "')"];

		Then.theFiltersShouldContains(aResult);
		Then.theFiltersShouldNotContains([sNextWeeksStart]);

		// Clean
		When.iPressTheRestoreButton();
		When.iClickShowAll();
	});

	opaTest("Check DateTimeOffset interval option next months included", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		var  sControlId = "smartFilterBar-filterItemControlA_-DTOFFSET_INTERVAL-input",
			oNextMonths = UniversalDateUtils.ranges.nextMonths(2),
			sNextMonthsStart = getDateTimeAsDateTimeOffsetString(oNextMonths[0]),
			sNextMonthsEnd = getDateTimeAsDateTimeOffsetString(oNextMonths[1], true),
			oNextMonthsIncluded = UniversalDateUtils.ranges.nextMonths(1),
			sNextMonthsIncludedEnd =  getDateTimeAsDateTimeOffsetString(oNextMonthsIncluded[1], true);

		// Act
		When.iOpenTheVHD(sControlId);
		When.iSelectDateOperationByKey("NEXTMINUTES");
		When.iSetValueToSelectedOperation([2], "NEXTMONTHS");
		When.iClickApply();

		When.iPressTheFilterGoButton();

		// Assert
		var sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and (DTOFFSET_INTERVAL ge datetimeoffset'" + sNextMonthsStart + "' and DTOFFSET_INTERVAL le datetimeoffset'" + sNextMonthsEnd + "')";

		Then.theFiltersShouldMatch(sResult);

		// Clean
		When.iPressTheRestoreButton();
		When.iClickShowAll();

		// Act
		When.iOpenTheVHD(sControlId);
		When.iSelectDateOperationByKey("NEXTMINUTES");
		When.iSetValueToSelectedOperation([2], "NEXTMONTHSINCLUDED");
		When.iClickApply();

		When.iPressTheFilterGoButton();

		// Assert
		var aResult = ["DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and (DTOFFSET_INTERVAL ge datetimeoffset'", "' and DTOFFSET_INTERVAL le datetimeoffset'" + sNextMonthsIncludedEnd + "')"];

		Then.theFiltersShouldContains(aResult);
		Then.theFiltersShouldNotContains([sNextMonthsStart]);

		// Clean
		When.iPressTheRestoreButton();
		When.iClickShowAll();
	});

	opaTest("Check DateTimeOffset interval option next quarters included", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		var  sControlId = "smartFilterBar-filterItemControlA_-DTOFFSET_INTERVAL-input",
			oNextQuarters = UniversalDateUtils.ranges.nextQuarters(2),
			sNextQuartersStart = getDateTimeAsDateTimeOffsetString(oNextQuarters[0]),
			sNextQuartersEnd = getDateTimeAsDateTimeOffsetString(oNextQuarters[1], true),
			oNextQuartersIncluded = UniversalDateUtils.ranges.nextQuarters(1),
			sNextQuartersIncludedEnd = getDateTimeAsDateTimeOffsetString(oNextQuartersIncluded[1], true);

		// Act
		When.iOpenTheVHD(sControlId);
		When.iSelectDateOperationByKey("NEXTMINUTES");
		When.iSetValueToSelectedOperation([2], "NEXTQUARTERS");
		When.iClickApply();

		When.iPressTheFilterGoButton();

		// Assert
		var sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and (DTOFFSET_INTERVAL ge datetimeoffset'" + sNextQuartersStart + "' and DTOFFSET_INTERVAL le datetimeoffset'" + sNextQuartersEnd + "')";

		Then.theFiltersShouldMatch(sResult);

		// Clean
		When.iPressTheRestoreButton();
		When.iClickShowAll();

		// Act
		When.iOpenTheVHD(sControlId);
		When.iSelectDateOperationByKey("NEXTMINUTES");
		When.iSetValueToSelectedOperation([2], "NEXTQUARTERSINCLUDED");
		When.iClickApply();

		When.iPressTheFilterGoButton();

		// Assert
		var aResult = ["DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and (DTOFFSET_INTERVAL ge datetimeoffset'", "' and DTOFFSET_INTERVAL le datetimeoffset'" + sNextQuartersIncludedEnd + "')"];

		Then.theFiltersShouldContains(aResult);
		Then.theFiltersShouldNotContains([sNextQuartersStart]);

		// Clean
		When.iPressTheRestoreButton();
		When.iClickShowAll();
	});

	opaTest("Check DateTimeOffset interval option next years included", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		var  sControlId = "smartFilterBar-filterItemControlA_-DTOFFSET_INTERVAL-input",
			oNextYears = UniversalDateUtils.ranges.nextYears(2),
			sNextYearsStart = getDateTimeAsDateTimeOffsetString(oNextYears[0]),
			sNextYearsEnd = getDateTimeAsDateTimeOffsetString(oNextYears[1], true),
			oNextYearsIncluded = UniversalDateUtils.ranges.nextYears(1),
			sNextYearsIncludedEnd =  getDateTimeAsDateTimeOffsetString(oNextYearsIncluded[1], true);

		// Act
		When.iOpenTheVHD(sControlId);
		When.iSelectDateOperationByKey("NEXTMINUTES");
		When.iSetValueToSelectedOperation([2], "NEXTYEARS");
		When.iClickApply();

		When.iPressTheFilterGoButton();

		// Assert
		var sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and (DTOFFSET_INTERVAL ge datetimeoffset'" + sNextYearsStart + "' and DTOFFSET_INTERVAL le datetimeoffset'" + sNextYearsEnd + "')";

		Then.theFiltersShouldMatch(sResult);

		// Clean
		When.iPressTheRestoreButton();
		When.iClickShowAll();

		// Act
		When.iOpenTheVHD(sControlId);
		When.iSelectDateOperationByKey("NEXTMINUTES");
		When.iSetValueToSelectedOperation([2], "NEXTYEARSINCLUDED");
		When.iClickApply();

		When.iPressTheFilterGoButton();

		// Assert
		var aResult = ["DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and (DTOFFSET_INTERVAL ge datetimeoffset'", "' and DTOFFSET_INTERVAL le datetimeoffset'" + sNextYearsIncludedEnd + "')"];

		Then.theFiltersShouldContains(aResult);
		Then.theFiltersShouldNotContains([sNextYearsStart]);

		// Clean
		Given.iStopMyApp();
	});
});
