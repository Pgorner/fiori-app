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

	var oCompResourceBundle = Library.getResourceBundleFor("sap.ui.comp"),
		getDateAsDateTimeString = function (oDate) {
			var sDate = oDate.oDate ? oDate.oDate.toISOString() : oDate.toISOString();

			return sDate.substring(0, sDate.length - 13) + "00:00:00";
		};
	var oToday = UniversalDateUtils.ranges.today(),
		sTodayStart = getDateAsDateTimeString(oToday[0]),
		oTomorrow = UniversalDateUtils.ranges.tomorrow(),
		sTomorrowStart = getDateAsDateTimeString(oTomorrow[0]),
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

	QUnit.module("Include current period options EDM.DateTime");

	opaTest("Check DateTime interval option last days included", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		var  sControlId = "smartFilterBar-filterItemControlA_-DATETIME_INTERVAL_d-f_Date-input";
		// Act
		When.iOpenTheVHD(sControlId);
		When.iSelectDateOperationByKey("LASTDAYS");
		When.iSetValueToSelectedOperation([1], "LASTDAYS");
		When.iClickApply();

		When.iPressTheFilterGoButton();

		// Assert
		var sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and (DATETIME_INTERVAL_d-f_Date ge datetime'" + sYesterdayStart + "' and DATETIME_INTERVAL_d-f_Date le datetime'" + sTodayStart + "')";

		Then.theFiltersShouldMatch(sResult);

		// Clean
		When.iPressTheRestoreButton();
		When.iClickShowAll();

		// Act
		When.iOpenTheVHD(sControlId);
		When.iSelectDateOperationByKey("LASTDAYS");
		When.iSetValueToSelectedOperation([1], "LASTDAYSINCLUDED");
		When.iClickApply();

		When.iPressTheFilterGoButton();

		// Assert
		sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and (DATETIME_INTERVAL_d-f_Date ge datetime'" + sTodayStart + "' and DATETIME_INTERVAL_d-f_Date le datetime'" + sTomorrowStart + "')";

		Then.theFiltersShouldMatch(sResult);

		// Act
		var sVariantName = "DATETIME_INTERVAL_d-f_DateLASTDAYS" + new Date().toISOString();
		When.iSaveVariantAs(oCompResourceBundle.getText("VARIANT_MANAGEMENT_STANDARD"), sVariantName);
		When.iSelectVariant(oCompResourceBundle.getText("VARIANT_MANAGEMENT_STANDARD"));
		When.iPressTheFilterGoButton();

		// Assert
		var sResultStandard = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "'";
		Then.theFiltersShouldMatch(sResultStandard);

		// Act
		When.iSelectVariant(sVariantName);
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch(sResult);

		// Clean
		When.iSelectVariant(oCompResourceBundle.getText("VARIANT_MANAGEMENT_STANDARD"));
		When.iPressTheRestoreButton();
		When.iClickShowAll();
	});

	opaTest("Check DateTime interval option last weeks included", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		var  sControlId = "smartFilterBar-filterItemControlA_-DATETIME_INTERVAL_d-f_Date-input",
			oLastWeek = UniversalDateUtils.ranges.lastWeeks(2),
			sLastWeekStart = getDateAsDateTimeString(oLastWeek[0]),
			sLastWeekEnd = getDateAsDateTimeString(oLastWeek[1]),
			oLastWeekIncluded = UniversalDateUtils.ranges.lastWeeks(1),
			sLastWeekIncludedStart = getDateAsDateTimeString(oLastWeekIncluded[0]),
			sLastWeekIncludedEnd =  getDateAsDateTimeString(UniversalDate.getInstance(UI5Date.getInstance()));

		// Act
		When.iOpenTheVHD(sControlId);
		When.iSelectDateOperationByKey("LASTDAYS");
		When.iSetValueToSelectedOperation([2], "LASTWEEKS");
		When.iClickApply();

		When.iPressTheFilterGoButton();

		// Assert
		var sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and (DATETIME_INTERVAL_d-f_Date ge datetime'" + sLastWeekStart + "' and DATETIME_INTERVAL_d-f_Date le datetime'" + sLastWeekEnd + "')";

		Then.theFiltersShouldMatch(sResult);

		// Clean
		When.iPressTheRestoreButton();
		When.iClickShowAll();

		// Act
		When.iOpenTheVHD(sControlId);
		When.iSelectDateOperationByKey("LASTDAYS");
		When.iSetValueToSelectedOperation([2], "LASTWEEKSINCLUDED");
		When.iClickApply();

		When.iPressTheFilterGoButton();

		// Assert
		sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and (DATETIME_INTERVAL_d-f_Date ge datetime'" + sLastWeekIncludedStart + "' and DATETIME_INTERVAL_d-f_Date le datetime'" + sLastWeekIncludedEnd + "')";

		Then.theFiltersShouldMatch(sResult);

		// Clean
		When.iPressTheRestoreButton();
		When.iClickShowAll();
	});

	opaTest("Check DateTime interval option last months included", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		var  sControlId = "smartFilterBar-filterItemControlA_-DATETIME_INTERVAL_d-f_Date-input",
			oLastMonths = UniversalDateUtils.ranges.lastMonths(2),
			sLastMonthsStart = getDateAsDateTimeString(oLastMonths[0]),
			sLastMonthsEnd = getDateAsDateTimeString(oLastMonths[1]),
			oLastMonthsIncluded = UniversalDateUtils.ranges.lastMonths(1),
			sLastMonthsIncludedStart = getDateAsDateTimeString(oLastMonthsIncluded[0]),
			sLastMonthsIncludedEnd =  getDateAsDateTimeString(UniversalDate.getInstance(UI5Date.getInstance()));

		// Act
		When.iOpenTheVHD(sControlId);
		When.iSelectDateOperationByKey("LASTDAYS");
		When.iSetValueToSelectedOperation([2], "LASTMONTHS");
		When.iClickApply();

		When.iPressTheFilterGoButton();

		// Assert
		var sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and (DATETIME_INTERVAL_d-f_Date ge datetime'" + sLastMonthsStart + "' and DATETIME_INTERVAL_d-f_Date le datetime'" + sLastMonthsEnd + "')";

		Then.theFiltersShouldMatch(sResult);

		// Clean
		When.iPressTheRestoreButton();
		When.iClickShowAll();

		// Act
		When.iOpenTheVHD(sControlId);
		When.iSelectDateOperationByKey("LASTDAYS");
		When.iSetValueToSelectedOperation([2], "LASTMONTHSINCLUDED");
		When.iClickApply();

		When.iPressTheFilterGoButton();

		// Assert
		sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and (DATETIME_INTERVAL_d-f_Date ge datetime'" + sLastMonthsIncludedStart + "' and DATETIME_INTERVAL_d-f_Date le datetime'" + sLastMonthsIncludedEnd + "')";

		Then.theFiltersShouldMatch(sResult);

		// Clean
		When.iPressTheRestoreButton();
		When.iClickShowAll();
	});

	opaTest("Check DateTime interval option last quarters included", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		var  sControlId = "smartFilterBar-filterItemControlA_-DATETIME_INTERVAL_d-f_Date-input",
			oLastQuarters = UniversalDateUtils.ranges.lastQuarters(2),
			sLastQuartersStart = getDateAsDateTimeString(oLastQuarters[0]),
			sLastQuartersEnd = getDateAsDateTimeString(oLastQuarters[1]),
			oLastQuartersIncluded = UniversalDateUtils.ranges.lastQuarters(1),
			sLastQuartersIncludedStart = getDateAsDateTimeString(oLastQuartersIncluded[0]),
			sLastQuartersIncludedEnd =  getDateAsDateTimeString(UniversalDate.getInstance(UI5Date.getInstance()));

		// Act
		When.iOpenTheVHD(sControlId);
		When.iSelectDateOperationByKey("LASTDAYS");
		When.iSetValueToSelectedOperation([2], "LASTQUARTERS");
		When.iClickApply();

		When.iPressTheFilterGoButton();

		// Assert
		var sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and (DATETIME_INTERVAL_d-f_Date ge datetime'" + sLastQuartersStart + "' and DATETIME_INTERVAL_d-f_Date le datetime'" + sLastQuartersEnd + "')";

		Then.theFiltersShouldMatch(sResult);

		// Clean
		When.iPressTheRestoreButton();
		When.iClickShowAll();

		// Act
		When.iOpenTheVHD(sControlId);
		When.iSelectDateOperationByKey("LASTDAYS");
		When.iSetValueToSelectedOperation([2], "LASTQUARTERSINCLUDED");
		When.iClickApply();

		When.iPressTheFilterGoButton();

		// Assert
		sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and (DATETIME_INTERVAL_d-f_Date ge datetime'" + sLastQuartersIncludedStart + "' and DATETIME_INTERVAL_d-f_Date le datetime'" + sLastQuartersIncludedEnd + "')";

		Then.theFiltersShouldMatch(sResult);

		// Clean
		When.iPressTheRestoreButton();
		When.iClickShowAll();
	});

	opaTest("Check DateTime interval option last years included", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		var  sControlId = "smartFilterBar-filterItemControlA_-DATETIME_INTERVAL_d-f_Date-input",
			oLastYears = UniversalDateUtils.ranges.lastYears(2),
			sLastYearsStart = getDateAsDateTimeString(oLastYears[0]),
			sLastYearsEnd = getDateAsDateTimeString(oLastYears[1]),
			oLastYearsIncluded = UniversalDateUtils.ranges.lastYears(1),
			sLastYearsIncludedStart = getDateAsDateTimeString(oLastYearsIncluded[0]),
			sLastYearsIncludedEnd =  getDateAsDateTimeString(UniversalDate.getInstance(UI5Date.getInstance()));

		// Act
		When.iOpenTheVHD(sControlId);
		When.iSelectDateOperationByKey("LASTDAYS");
		When.iSetValueToSelectedOperation([2], "LASTYEARS");
		When.iClickApply();

		When.iPressTheFilterGoButton();

		// Assert
		var sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and (DATETIME_INTERVAL_d-f_Date ge datetime'" + sLastYearsStart + "' and DATETIME_INTERVAL_d-f_Date le datetime'" + sLastYearsEnd + "')";

		Then.theFiltersShouldMatch(sResult);

		// Clean
		When.iPressTheRestoreButton();
		When.iClickShowAll();

		// Act
		When.iOpenTheVHD(sControlId);
		When.iSelectDateOperationByKey("LASTDAYS");
		When.iSetValueToSelectedOperation([2], "LASTYEARSINCLUDED");
		When.iClickApply();

		When.iPressTheFilterGoButton();

		// Assert
		sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and (DATETIME_INTERVAL_d-f_Date ge datetime'" + sLastYearsIncludedStart + "' and DATETIME_INTERVAL_d-f_Date le datetime'" + sLastYearsIncludedEnd + "')";

		Then.theFiltersShouldMatch(sResult);

		// Clean
		When.iPressTheRestoreButton();
		When.iClickShowAll();
	});

	opaTest("Check DateTime interval option next days included", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		var  sControlId = "smartFilterBar-filterItemControlA_-DATETIME_INTERVAL_d-f_Date-input",
			oNextDays = UniversalDateUtils.ranges.nextDays(2),
			sNextDaysStart = getDateAsDateTimeString(oNextDays[0]),
			sNextDaysEnd = getDateAsDateTimeString(oNextDays[1]),
			oNextDaysIncluded = UniversalDateUtils.ranges.nextDays(1),
			sNextDaysIncludedEnd =  getDateAsDateTimeString(oNextDaysIncluded[1]);
		// Act
		When.iOpenTheVHD(sControlId);
		When.iSelectDateOperationByKey("NEXTDAYS");
		When.iSetValueToSelectedOperation([2], "NEXTDAYS");
		When.iClickApply();

		When.iPressTheFilterGoButton();

		// Assert
		var sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and (DATETIME_INTERVAL_d-f_Date ge datetime'" + sNextDaysStart + "' and DATETIME_INTERVAL_d-f_Date le datetime'" + sNextDaysEnd + "')";

		Then.theFiltersShouldMatch(sResult);

		// Clean
		When.iPressTheRestoreButton();
		When.iClickShowAll();

		// Act
		When.iOpenTheVHD(sControlId);
		When.iSelectDateOperationByKey("NEXTDAYS");
		When.iSetValueToSelectedOperation([2], "NEXTDAYSINCLUDED");
		When.iClickApply();

		When.iPressTheFilterGoButton();

		// Assert
		sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and (DATETIME_INTERVAL_d-f_Date ge datetime'" + sTodayStart + "' and DATETIME_INTERVAL_d-f_Date le datetime'" + sNextDaysIncludedEnd + "')";

		Then.theFiltersShouldMatch(sResult);

		// Clean
		When.iPressTheRestoreButton();
		When.iClickShowAll();
	});

	opaTest("Check DateTime interval option next weeks included", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		var  sControlId = "smartFilterBar-filterItemControlA_-DATETIME_INTERVAL_d-f_Date-input",
			oNextWeek = UniversalDateUtils.ranges.nextWeeks(2),
			sNextWeekStart = getDateAsDateTimeString(oNextWeek[0]),
			sNextWeekEnd = getDateAsDateTimeString(oNextWeek[1]),
			oNextWeekIncluded = UniversalDateUtils.ranges.nextWeeks(1),
			sNextWeekIncludedEnd =  getDateAsDateTimeString(oNextWeekIncluded[1]);

		// Act
		When.iOpenTheVHD(sControlId);
		When.iSelectDateOperationByKey("NEXTDAYS");
		When.iSetValueToSelectedOperation([2], "NEXTWEEKS");
		When.iClickApply();

		When.iPressTheFilterGoButton();

		// Assert
		var sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and (DATETIME_INTERVAL_d-f_Date ge datetime'" + sNextWeekStart + "' and DATETIME_INTERVAL_d-f_Date le datetime'" + sNextWeekEnd + "')";

		Then.theFiltersShouldMatch(sResult);

		// Clean
		When.iPressTheRestoreButton();
		When.iClickShowAll();

		// Act
		When.iOpenTheVHD(sControlId);
		When.iSelectDateOperationByKey("NEXTDAYS");
		When.iSetValueToSelectedOperation([2], "NEXTWEEKSINCLUDED");
		When.iClickApply();

		When.iPressTheFilterGoButton();

		// Assert
		sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and (DATETIME_INTERVAL_d-f_Date ge datetime'" + sTodayStart + "' and DATETIME_INTERVAL_d-f_Date le datetime'" + sNextWeekIncludedEnd + "')";

		Then.theFiltersShouldMatch(sResult);

		// Clean
		When.iPressTheRestoreButton();
		When.iClickShowAll();
	});

	opaTest("Check DateTime interval option next months included", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		var  sControlId = "smartFilterBar-filterItemControlA_-DATETIME_INTERVAL_d-f_Date-input",
			oNextMonths = UniversalDateUtils.ranges.nextMonths(2),
			sNextMonthsStart = getDateAsDateTimeString(oNextMonths[0]),
			sNextMonthsEnd = getDateAsDateTimeString(oNextMonths[1]),
			oNextMonthsIncluded = UniversalDateUtils.ranges.nextMonths(1),
			sNextMonthsIncludedEnd =  getDateAsDateTimeString(oNextMonthsIncluded[1]);

		// Act
		When.iOpenTheVHD(sControlId);
		When.iSelectDateOperationByKey("NEXTDAYS");
		When.iSetValueToSelectedOperation([2], "NEXTMONTHS");
		When.iClickApply();

		When.iPressTheFilterGoButton();

		// Assert
		var sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and (DATETIME_INTERVAL_d-f_Date ge datetime'" + sNextMonthsStart + "' and DATETIME_INTERVAL_d-f_Date le datetime'" + sNextMonthsEnd + "')";

		Then.theFiltersShouldMatch(sResult);

		// Clean
		When.iPressTheRestoreButton();
		When.iClickShowAll();

		// Act
		When.iOpenTheVHD(sControlId);
		When.iSelectDateOperationByKey("NEXTDAYS");
		When.iSetValueToSelectedOperation([2], "NEXTMONTHSINCLUDED");
		When.iClickApply();

		When.iPressTheFilterGoButton();

		// Assert
		sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and (DATETIME_INTERVAL_d-f_Date ge datetime'" + sTodayStart + "' and DATETIME_INTERVAL_d-f_Date le datetime'" + sNextMonthsIncludedEnd + "')";

		Then.theFiltersShouldMatch(sResult);

		// Clean
		When.iPressTheRestoreButton();
		When.iClickShowAll();
	});

	opaTest("Check DateTime interval option next quarters included", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		var  sControlId = "smartFilterBar-filterItemControlA_-DATETIME_INTERVAL_d-f_Date-input",
			oNextQuarters = UniversalDateUtils.ranges.nextQuarters(2),
			sNextQuartersStart = getDateAsDateTimeString(oNextQuarters[0]),
			sNextQuartersEnd = getDateAsDateTimeString(oNextQuarters[1]),
			oNextQuartersIncluded = UniversalDateUtils.ranges.nextQuarters(1),
			sNextQuartersIncludedEnd = getDateAsDateTimeString(oNextQuartersIncluded[1]);

		// Act
		When.iOpenTheVHD(sControlId);
		When.iSelectDateOperationByKey("NEXTDAYS");
		When.iSetValueToSelectedOperation([2], "NEXTQUARTERS");
		When.iClickApply();

		When.iPressTheFilterGoButton();

		// Assert
		var sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and (DATETIME_INTERVAL_d-f_Date ge datetime'" + sNextQuartersStart + "' and DATETIME_INTERVAL_d-f_Date le datetime'" + sNextQuartersEnd + "')";

		Then.theFiltersShouldMatch(sResult);

		// Clean
		When.iPressTheRestoreButton();
		When.iClickShowAll();

		// Act
		When.iOpenTheVHD(sControlId);
		When.iSelectDateOperationByKey("NEXTDAYS");
		When.iSetValueToSelectedOperation([2], "NEXTQUARTERSINCLUDED");
		When.iClickApply();

		When.iPressTheFilterGoButton();

		// Assert
		sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and (DATETIME_INTERVAL_d-f_Date ge datetime'" + sTodayStart + "' and DATETIME_INTERVAL_d-f_Date le datetime'" + sNextQuartersIncludedEnd + "')";

		Then.theFiltersShouldMatch(sResult);

		// Clean
		When.iPressTheRestoreButton();
		When.iClickShowAll();
	});

	opaTest("Check DateTime interval option next years included", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		var  sControlId = "smartFilterBar-filterItemControlA_-DATETIME_INTERVAL_d-f_Date-input",
			oNextYears = UniversalDateUtils.ranges.nextYears(2),
			sNextYearsStart = getDateAsDateTimeString(oNextYears[0]),
			sNextYearsEnd = getDateAsDateTimeString(oNextYears[1]),
			oNextYearsIncluded = UniversalDateUtils.ranges.nextYears(1),
			sNextYearsIncludedEnd =  getDateAsDateTimeString(oNextYearsIncluded[1]);

		// Act
		When.iOpenTheVHD(sControlId);
		When.iSelectDateOperationByKey("NEXTDAYS");
		When.iSetValueToSelectedOperation([2], "NEXTYEARS");
		When.iClickApply();

		When.iPressTheFilterGoButton();

		// Assert
		var sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and (DATETIME_INTERVAL_d-f_Date ge datetime'" + sNextYearsStart + "' and DATETIME_INTERVAL_d-f_Date le datetime'" + sNextYearsEnd + "')";

		Then.theFiltersShouldMatch(sResult);

		// Clean
		When.iPressTheRestoreButton();
		When.iClickShowAll();

		// Act
		When.iOpenTheVHD(sControlId);
		When.iSelectDateOperationByKey("NEXTDAYS");
		When.iSetValueToSelectedOperation([2], "NEXTYEARSINCLUDED");
		When.iClickApply();

		When.iPressTheFilterGoButton();

		// Assert
		sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and (DATETIME_INTERVAL_d-f_Date ge datetime'" + sTodayStart + "' and DATETIME_INTERVAL_d-f_Date le datetime'" + sNextYearsIncludedEnd + "')";

		Then.theFiltersShouldMatch(sResult);

		// Clean
		Given.iStopMyApp();
	});
});
