/* global QUnit */
sap.ui.define([
	"sap/base/i18n/ResourceBundle",
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/test/actions/Press",
	"sap/ui/test/actions/EnterText",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"sap/ui/core/date/UniversalDateUtils",
	"test-resources/sap/ui/mdc/qunit/p13n/OpaTests/utility/Util",
	"sap/ui/test/matchers/Ancestor",
	"sap/ui/test/matchers/Descendant",
	"sap/ui/test/matchers/Properties",
	"sap/ui/comp/qunit/smartfilterbar/opaTests/DateRangeType/actions/DateRangeActions",
	"sap/ui/comp/qunit/smartfilterbar/opaTests/DateRangeType/assertions/DateRangeAssertions"
], function (
	ResourceBundle,
	Opa5,
	opaTest,
	Press,
	EnterText,
	PropertyStrictEquals,
	UniversalDateUtils,
	TestUtil,
	Ancestor,
	Descendant,
	Properties,
	Actions,
	Assertions
) {
	"use strict";

	var oResourceBundle = ResourceBundle.create({
			bundleUrl: sap.ui.require.toUrl(
				"sap/ui/comp/qunit/smartfilterbar/opaTests/DateRangeType/applicationUnderTest/smartfilterbar_DDR/i18n/i18n.properties"
			),
			supportedLocales: [""]
		}),
		gatDateAsString = function (oDate, oSecondDate) {
			var sDate = oDate.oDate ? oDate.oDate.toISOString() : oDate.toISOString();
			if (oSecondDate) {
				var sSecondDate = oSecondDate.oDate ? oSecondDate.oDate.toISOString() : oSecondDate.toISOString();
				return sDate.substring(0, sDate.length - 13) + sSecondDate.substring(sSecondDate.length - 5, 11);
			}
			return sDate.substring(0, sDate.length - 5);
		},
		oToday = UniversalDateUtils.ranges.today(),
		oThisYear = UniversalDateUtils.ranges.currentYear(),
		sTodayStart = gatDateAsString(oToday[0]),
		sTodayEnd =   gatDateAsString(oToday[1]),
		sThisYearStart = gatDateAsString(oThisYear[0]),
		sThisYearEnd = gatDateAsString(oThisYear[1]),
		sInfinityDate = gatDateAsString(new Date("9999", 11,31,23,59,59)),
		oLast3Months = UniversalDateUtils.ranges.lastMonths(3)[0].oDate.setDate(oToday[0].getDate()),
		sLast3MonthsStart = gatDateAsString(new Date(oLast3Months)),
		oTomorrow = UniversalDateUtils.ranges.tomorrow()[1],
		sTomorrowEnd = gatDateAsString(oTomorrow),
		oDueUp = new Date("2002", oToday[0].getMonth(), oToday[0].getDate()),
		sDueUpStart = gatDateAsString(oDueUp),
		oYesterday = UniversalDateUtils.ranges.yesterday(),
		sYesterdayStart = gatDateAsString(oYesterday[0]),
		oLast7Days = UniversalDateUtils.ranges.lastDays(6),
		sLast7DaysStart = gatDateAsString(oLast7Days[0]),
		oLast14Days = UniversalDateUtils.ranges.lastDays(14),
		sLast14DaysStart = gatDateAsString(oLast14Days[0]),
		oNow = new Date(),
		oLast31Days = new Date(oNow.getFullYear(), oNow.getMonth(), oNow.getDate() - 31, 23, 59, 59),
		sTodayDateEnd = gatDateAsString(new Date(oNow.getFullYear(), oNow.getMonth(), oNow.getDate(), 23, 59, 59)),
		oLast90Days = new Date(oNow.getFullYear(), oNow.getMonth(), oNow.getDate() - 90, 0, 0, 0),
		sLast31DaysEnd = gatDateAsString(oLast31Days),
		sLast90DaysStart = gatDateAsString(oLast90Days),
		oLast180Days = new Date(oNow.getFullYear(), oNow.getMonth(), oNow.getDate() - 181, 23, 59, 59),
		oMoreInThePast = new Date(1900, 0, 1, 0, 0, 0),
		sLast180DaysEnd = gatDateAsString(oLast180Days),
		sMoreInThePastStart = gatDateAsString(oMoreInThePast),
		oLast5Days = UniversalDateUtils.ranges.lastDays(4),
		sLast5DaysStart = gatDateAsString(oLast5Days[0]),
		oNext3Years = UniversalDateUtils.ranges.nextYears(2),
		sNext3YearsEnd =  gatDateAsString(oNext3Years[1]),
		oLast4Months = UniversalDateUtils.ranges.today(),
		sLast4MonthsStart = gatDateAsString(new Date(oLast4Months[0].setMonth(oLast4Months[0].getMonth() - 4))),
		oNext4Weeks = UniversalDateUtils.ranges.today(),
		sNext4WeeksEnd,
		oPast6Months = UniversalDateUtils.ranges.today(),
		sPast6MonthsStart,
		sYesterdayEnd = gatDateAsString(oYesterday[1]),
		sNow = gatDateAsString(new Date(oNow.getFullYear(), oNow.getMonth(), oNow.getDate(), 0)),
		sNowPlus30Minutes = gatDateAsString(new Date(oNow.getFullYear(), oNow.getMonth(), oNow.getDate(), 0, 30)),
		sNowPlus120Minutes = gatDateAsString(new Date(oNow.getFullYear(), oNow.getMonth(), oNow.getDate(), 2));


	oNext4Weeks[1].setDate(oNext4Weeks[1].getDate() + 28);
	oNext4Weeks[1].setDate(oNext4Weeks[1].getDate() - (oNext4Weeks[1].getDay() + 7) % 7);
	sNext4WeeksEnd = gatDateAsString(oNext4Weeks[1]);
	oPast6Months[0].setMonth(oPast6Months[0].getMonth() - 6);
	sPast6MonthsStart = gatDateAsString(oPast6Months[0]);

	Opa5.extendConfig({
		viewName: "SmartFilterBar",
		viewNamespace: "applicationUnderTest.smartfilterbar_DDR",
		autoWait: true,
		enabled: false,
		async: true,
		timeout: 120,
		arrangements: new Opa5({
			iStartMyApp: function () {
				return this.iStartMyAppInAFrame(
					sap.ui.require.toUrl(
						"sap/ui/comp/qunit/smartfilterbar/opaTests/DateRangeType/applicationUnderTest/SmartFilterBar_DDR.html"
					)).then(function () {
						// Cache resource bundle URL
						Opa5.getWindow().sap.ui.require("sap/base/i18n/ResourceBundle")?.create({
							bundleName: "applicationUnderTest.smartfilterbar_DDR.i18n",
							supportedLocales: [""],
							fallbackLocale: ""
						});
					});
			},
			iEnsureMyAppIsRunning: function () {
				if (!this._myApplicationIsRunning) {
					this.iStartMyApp();
					this._myApplicationIsRunning = true;
				}
			}
		}),
		actions: Actions,
		assertions: Assertions
	});

	QUnit.module("Set custom operation");
	opaTest("TestPage2", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		//Test2
		When.iOpenTheVHD("smartFilterBar-filterItemControlA_-Test2-input");
		When.iSelectDateOperation("From Today");
		When.iPressTheFilterGoButton();

		// Assert
		var sResult = "(Test1 ge datetime'" + sThisYearStart + "' and Test1 le datetime'" + sTodayEnd + "') " +
			"and (Test2 ge datetime'" + sTodayStart + "' and Test2 le datetime'" + sInfinityDate + "') " +
			"and (Test3 ge datetime'" + sTodayStart + "' and Test3 le datetime'" + sTodayEnd + "') " +
			"and (Test7 ge datetime'" + sThisYearStart + "' and Test7 le datetime'" + sThisYearEnd + "')";
		Then.theFiltersShouldMatch(sResult);

		// Cleanup
		When.iPressTheRestoreButton();
	});

	opaTest("TestPage4", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iOpenTheVHD("smartFilterBar-filterItemControlA_-Test4-input");
		When.iSelectDateOperation(oResourceBundle.getText("recent3Months"));
		When.iPressTheFilterGoButton();

		// Assert
		//Test4
		var sResult = "(Test1 ge datetime'" + sThisYearStart + "' and Test1 le datetime'" + sTodayEnd + "') " +
			"and (Test3 ge datetime'" + sTodayStart + "' and Test3 le datetime'" + sTodayEnd + "') " +
			"and (Test4 ge datetime'" + sLast3MonthsStart + "' and Test4 le datetime'" + sTodayEnd + "') " +
			"and (Test7 ge datetime'" + sThisYearStart + "' and Test7 le datetime'" + sThisYearEnd + "')";
		Then.theFiltersShouldMatch(sResult);

		// Cleanup
		When.iPressTheRestoreButton();

	});

	opaTest("TestPage5", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iOpenTheVHD("smartFilterBar-filterItemControlA_-Test5-input");
		When.iSelectDateOperation(oResourceBundle.getText("TodayAndTomorrow"));
		When.iPressTheFilterGoButton();

		// Assert
		//Test5
		var sResult = "(Test1 ge datetime'" + sThisYearStart + "' and Test1 le datetime'" + sTodayEnd + "') " +
			"and (Test3 ge datetime'" + sTodayStart + "' and Test3 le datetime'" + sTodayEnd + "') " +
			"and (Test5 ge datetime'" + sTodayStart + "' and Test5 le datetime'" + sTomorrowEnd + "') " +
			"and (Test7 ge datetime'" + sThisYearStart + "' and Test7 le datetime'" + sThisYearEnd + "')";
		Then.theFiltersShouldMatch(sResult);

		// Act
		When.iOpenTheVHD("smartFilterBar-filterItemControlA_-Test5-input");
		When.iSelectDateOperation("Due Up Until Tomorrow");
		When.iPressTheFilterGoButton();

		// Assert
		sResult = "(Test1 ge datetime'" + sThisYearStart + "' and Test1 le datetime'" + sTodayEnd + "') " +
			"and (Test3 ge datetime'" + sTodayStart + "' and Test3 le datetime'" + sTodayEnd + "') " +
			"and (Test5 ge datetime'" + sDueUpStart + "' and Test5 le datetime'" + sTomorrowEnd + "') " +
			"and (Test7 ge datetime'" + sThisYearStart + "' and Test7 le datetime'" + sThisYearEnd + "')";
		Then.theFiltersShouldMatch(sResult);

		// Cleanup
		When.iPressTheRestoreButton();

		// Act
		When.iOpenTheVHD("smartFilterBar-filterItemControlA_-Test6-input");
		When.iSelectDateOperation("Yesterday and Today");
		When.iPressTheFilterGoButton();

		// Assert
		//Test6
		sResult = "(Test1 ge datetime'" + sThisYearStart + "' and Test1 le datetime'" + sTodayEnd + "') " +
			"and (Test3 ge datetime'" + sTodayStart + "' and Test3 le datetime'" + sTodayEnd + "') " +
			"and (Test6 ge datetime'" + sYesterdayStart + "' and Test6 le datetime'" + sTodayEnd + "') " +
			"and (Test7 ge datetime'" + sThisYearStart + "' and Test7 le datetime'" + sThisYearEnd + "')";
		Then.theFiltersShouldMatch(sResult);

		// Act
		When.iOpenTheVHD("smartFilterBar-filterItemControlA_-Test6-input");
		When.iSelectDateOperation("Last Seven Days");
		When.iPressTheFilterGoButton();

		// Assert
		sResult = "(Test1 ge datetime'" + sThisYearStart + "' and Test1 le datetime'" + sTodayEnd + "') " +
			"and (Test3 ge datetime'" + sTodayStart + "' and Test3 le datetime'" + sTodayEnd + "') " +
			"and (Test6 ge datetime'" + sLast7DaysStart + "' and Test6 le datetime'" + sTodayEnd + "') " +
			"and (Test7 ge datetime'" + sThisYearStart + "' and Test7 le datetime'" + sThisYearEnd + "')";
		Then.theFiltersShouldMatch(sResult);

		// Cleanup
		When.iPressTheRestoreButton();

	});

	opaTest("TestPage8", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iOpenTheVHD("smartFilterBar-filterItemControlA_-Test8-input");
		When.iSelectDateOperation("Within Last 14 Days");
		When.iPressTheFilterGoButton();

		// Assert
		//Test8
		var sResult = "(Test1 ge datetime'" + sThisYearStart + "' and Test1 le datetime'" + sTodayEnd + "') " +
			"and (Test3 ge datetime'" + sTodayStart + "' and Test3 le datetime'" + sTodayEnd + "') " +
			"and (Test7 ge datetime'" + sThisYearStart + "' and Test7 le datetime'" + sThisYearEnd + "') " +
			"and (Test8 ge datetime'" + sLast14DaysStart + "' and Test8 le datetime'" + sTodayDateEnd + "')";
		Then.theFiltersShouldMatch(sResult);

		// Act
		When.iOpenTheVHD("smartFilterBar-filterItemControlA_-Test8-input");
		When.iSelectDateOperation("Last 31 To 90 Days");
		When.iPressTheFilterGoButton();

		// Assert
		sResult = "(Test1 ge datetime'" + sThisYearStart + "' and Test1 le datetime'" + sTodayEnd + "') " +
			"and (Test3 ge datetime'" + sTodayStart + "' and Test3 le datetime'" + sTodayEnd + "') " +
			"and (Test7 ge datetime'" + sThisYearStart + "' and Test7 le datetime'" + sThisYearEnd + "') " +
			"and (Test8 ge datetime'" + sLast90DaysStart + "' and Test8 le datetime'" + sLast31DaysEnd + "')";
		Then.theFiltersShouldMatch(sResult);

		// Act
		When.iOpenTheVHD("smartFilterBar-filterItemControlA_-Test8-input");
		When.iSelectDateOperation("More Than 180 Days In The Past");
		When.iPressTheFilterGoButton();

		// Assert
		sResult = "(Test1 ge datetime'" + sThisYearStart + "' and Test1 le datetime'" + sTodayEnd + "') " +
			"and (Test3 ge datetime'" + sTodayStart + "' and Test3 le datetime'" + sTodayEnd + "') " +
			"and (Test7 ge datetime'" + sThisYearStart + "' and Test7 le datetime'" + sThisYearEnd + "') " +
			"and (Test8 ge datetime'" + sMoreInThePastStart + "' and Test8 le datetime'" + sLast180DaysEnd + "')";
		Then.theFiltersShouldMatch(sResult);

		// Cleanup
		When.iPressTheRestoreButton();
	});

	opaTest("TestPage9", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();


		// Act
		When.iOpenTheVHD("smartFilterBar-filterItemControlA_-Test9-input");
		When.iSelectDateOperation("Next 30 Minutes");
		When.iPressTheFilterGoButton();

		// Assert
		//Test9
		var sResult = "(Test1 ge datetime'" + sThisYearStart + "' and Test1 le datetime'" + sTodayEnd + "') " +
			"and (Test3 ge datetime'" + sTodayStart + "' and Test3 le datetime'" + sTodayEnd + "') " +
			"and (Test7 ge datetime'" + sThisYearStart + "' and Test7 le datetime'" + sThisYearEnd + "') " +
			"and (Test9 ge datetime'" + sNow + "' and Test9 le datetime'" + sNowPlus30Minutes + "')";
		Then.theFiltersShouldMatch(sResult);

		// Act
		When.iOpenTheVHD("smartFilterBar-filterItemControlA_-Test9-input");
		When.iSelectDateOperation("Next 2 Hours");
		When.iPressTheFilterGoButton();

		// Assert
		//Test9
		sResult = "(Test1 ge datetime'" + sThisYearStart + "' and Test1 le datetime'" + sTodayEnd + "') " +
			"and (Test3 ge datetime'" + sTodayStart + "' and Test3 le datetime'" + sTodayEnd + "') " +
			"and (Test7 ge datetime'" + sThisYearStart + "' and Test7 le datetime'" + sThisYearEnd + "') " +
			"and (Test9 ge datetime'" + sNow + "' and Test9 le datetime'" + sNowPlus120Minutes + "')";
		Then.theFiltersShouldMatch(sResult);

		// Act
		When.iOpenTheVHD("smartFilterBar-filterItemControlA_-Test9-input");
		When.iSelectDateOperation("Clear Date");
		When.iPressTheFilterGoButton();

		// Assert
		//Test9
		sResult = "(Test1 ge datetime'" + sThisYearStart + "' and Test1 le datetime'" + sTodayEnd + "') " +
			"and (Test3 ge datetime'" + sTodayStart + "' and Test3 le datetime'" + sTodayEnd + "') " +
			"and (Test7 ge datetime'" + sThisYearStart + "' and Test7 le datetime'" + sThisYearEnd + "')";
		Then.theFiltersShouldMatch(sResult);

		// Cleanup
		When.iPressTheRestoreButton();
	});

	opaTest("TestPage10", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iOpenTheVHD("smartFilterBar-filterItemControlA_-Test10-input");
		When.iSelectDateOperation("Last X days to date");
		When.iEnterValue("smartFilterBar-filterItemControlA_-Test10field", 5);
		When.iClickApply();
		When.iPressTheFilterGoButton();

		// Assert
		//Test10
		var sResult = "(Test1 ge datetime'" + sThisYearStart + "' and Test1 le datetime'" + sTodayEnd + "') " +
			"and (Test3 ge datetime'" + sTodayStart + "' and Test3 le datetime'" + sTodayEnd + "') " +
			"and (Test7 ge datetime'" + sThisYearStart + "' and Test7 le datetime'" + sThisYearEnd + "') " +
			"and (Test10 ge datetime'" + sLast5DaysStart + "' and Test10 le datetime'" + sTodayEnd + "')";
		Then.theFiltersShouldMatch(sResult);

		// Cleanup
		When.iPressTheRestoreButton();

		// Act
		When.iOpenTheVHD("smartFilterBar-filterItemControlA_-Test10-input");
		When.iSelectDateOperation("Next X years from date");
		When.iEnterValue("smartFilterBar-filterItemControlA_-Test10field", 3);
		When.iClickApply();
		When.iPressTheFilterGoButton();

		// Assert
		//Test10
		sResult = "(Test1 ge datetime'" + sThisYearStart + "' and Test1 le datetime'" + sTodayEnd + "') " +
			"and (Test3 ge datetime'" + sTodayStart + "' and Test3 le datetime'" + sTodayEnd + "') " +
			"and (Test7 ge datetime'" + sThisYearStart + "' and Test7 le datetime'" + sThisYearEnd + "') " +
			"and (Test10 ge datetime'" + sTodayStart + "' and Test10 le datetime'" + sNext3YearsEnd + "')";
		Then.theFiltersShouldMatch(sResult);

		// Cleanup
		When.iPressTheRestoreButton();
	});

	opaTest("TestPage1", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iOpenTheVHD("smartFilterBar-filterItemControlA_-Test11-input");
		When.iSelectDateOperation("Recent fiscal periods");
		When.iPressTheFilterGoButton();


		// Assert
		//Test11
		var sResult = "(Test1 ge datetime'" + sThisYearStart + "' and Test1 le datetime'" + sTodayEnd + "') " +
			"and (Test3 ge datetime'" + sTodayStart + "' and Test3 le datetime'" + sTodayEnd + "') " +
			"and (Test7 ge datetime'" + sThisYearStart + "' and Test7 le datetime'" + sThisYearEnd + "') " +
			"and (Test11 ge datetime'" + sLast4MonthsStart + "' and Test11 le datetime'" + sTodayEnd + "')";
		Then.theFiltersShouldMatch(sResult);

		// Cleanup
		When.iPressTheRestoreButton();
	});

	opaTest("TestPage12", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iOpenTheVHD("smartFilterBar-filterItemControlA_-Test12-input");
		When.iSelectDateOperation("Next 4 Weeks");
		When.iPressTheFilterGoButton();

		// Assert
		//Test12
		var sResult = "(Test1 ge datetime'" + sThisYearStart + "' and Test1 le datetime'" + sTodayEnd + "') " +
			"and (Test3 ge datetime'" + sTodayStart + "' and Test3 le datetime'" + sTodayEnd + "') " +
			"and (Test7 ge datetime'" + sThisYearStart + "' and Test7 le datetime'" + sThisYearEnd + "') " +
			"and (Test12 ge datetime'" + sTodayStart + "' and Test12 le datetime'" + sNext4WeeksEnd + "')";
		Then.theFiltersShouldMatch(sResult);

		// Act
		When.iOpenTheVHD("smartFilterBar-filterItemControlA_-Test12-input");
		When.iSelectDateOperation("Past 6 Months");
		When.iPressTheFilterGoButton();

		// Assert
		//Test12
		sResult = "(Test1 ge datetime'" + sThisYearStart + "' and Test1 le datetime'" + sTodayEnd + "') " +
			"and (Test3 ge datetime'" + sTodayStart + "' and Test3 le datetime'" + sTodayEnd + "') " +
			"and (Test7 ge datetime'" + sThisYearStart + "' and Test7 le datetime'" + sThisYearEnd + "') " +
			"and (Test12 ge datetime'" + sPast6MonthsStart + "' and Test12 le datetime'" + sYesterdayEnd + "')";
		Then.theFiltersShouldMatch(sResult);

		// Cleanup
		When.iPressTheRestoreButton();

		// Cleanup
		When.iPressTheRestoreButton();
	});

	opaTest("TestPage13", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iOpenTheVHD("smartFilterBar-filterItemControlA_-Test13-input");
		When.iSelectDateOperation("Next 4 Weeks");
		When.iPressTheFilterGoButton();

		// Assert
		//Test13
		var sResult = "(Test1 ge datetime'" + sThisYearStart + "' and Test1 le datetime'" + sTodayEnd + "') " +
			"and (Test3 ge datetime'" + sTodayStart + "' and Test3 le datetime'" + sTodayEnd + "') " +
			"and (Test7 ge datetime'" + sThisYearStart + "' and Test7 le datetime'" + sThisYearEnd + "') " +
			"and (Test13 ge datetime'" + sTodayStart + "' and Test13 le datetime'" + sNext4WeeksEnd + "')";
		Then.theFiltersShouldMatch(sResult);

		// Cleanup
		When.iPressTheRestoreButton();
	});
});
