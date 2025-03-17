/* global QUnit */
sap.ui.define([
	"sap/base/i18n/ResourceBundle",
	"sap/ui/core/Lib",
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
], function(
	ResourceBundle,
	Library,
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
			bundleUrl: sap.ui.require.toUrl("sap/ui/comp/qunit/smartfilterbar/opaTests/DateRangeType/applicationUnderTest/smartfilterbar_DDR/i18n/i18n.properties"),
			supportedLocales: [""],
			fallbackLocale: ""
		}),
		oCompResourceBundle = Library.getResourceBundleFor("sap.ui.comp"),
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
		oYesterday = UniversalDateUtils.ranges.yesterday(),
		oLast7Days = UniversalDateUtils.ranges.lastDays(6),
		sLast7DaysStart = gatDateAsString(oLast7Days[0]),
		oNow = new Date(),
		oLast180Days = new Date(oNow.getFullYear(), oNow.getMonth(), oNow.getDate() - 181, 23, 59, 59),
		oMoreInThePast = new Date(1900, 0, 1, 0, 0, 0),
		sLast180DaysEnd = gatDateAsString(oLast180Days),
		sMoreInThePastStart = gatDateAsString(oMoreInThePast),
		oLast5Days = UniversalDateUtils.ranges.lastDays(4),
		sLast5DaysStart = gatDateAsString(oLast5Days[0]),
		oLast4Months = UniversalDateUtils.ranges.today(),
		sLast4MonthsStart = gatDateAsString(new Date(oLast4Months[0].setMonth(oLast4Months[0].getMonth() - 4))),
		oNext4Weeks = UniversalDateUtils.ranges.today(),
		sNext4WeeksEnd,
		oPast6Months = UniversalDateUtils.ranges.today(),
		sPast6MonthsStart,
		sYesterdayEnd = gatDateAsString(oYesterday[1]);

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
							bundleName: "applicationUnderTest.smartfilterbar_DDR.i18n.i18n",
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

	QUnit.module("Defaults operations");

	opaTest("TestPage1 TestPage3 and TestPage7", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iPressTheFilterGoButton();

		// Assert
		var sResult = "(Test1 ge datetime'" + sThisYearStart + "' and Test1 le datetime'" + sTodayEnd + "') " +
		"and (Test3 ge datetime'" + sTodayStart + "' and Test3 le datetime'" + sTodayEnd + "') " +
		"and (Test7 ge datetime'" + sThisYearStart + "' and Test7 le datetime'" + sThisYearEnd + "')";
		Then.theFiltersShouldMatch(sResult);

		// Cleanup
		When.iPressTheRestoreButton();
	});

	QUnit.module("Custom operation from variant management");

	opaTest("All test pages", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iEnterValue("smartFilterBar-filterItemControlA_-Test2-input", "From Today", false);
		When.iEnterValue("smartFilterBar-filterItemControlA_-Test4-input", oResourceBundle.getText("recent3Months"), false);
		When.iEnterValue("smartFilterBar-filterItemControlA_-Test5-input", oResourceBundle.getText("TodayAndTomorrow"), false);
		When.iEnterValue("smartFilterBar-filterItemControlA_-Test6-input", "Last Seven Days" ,false);
		When.iEnterValue("smartFilterBar-filterItemControlA_-Test8-input", "More Than 180 Days In The Past", false);
		When.iEnterValue("smartFilterBar-filterItemControlA_-Test10-input", "Last 5 days to date", false);
		When.iEnterValue("smartFilterBar-filterItemControlA_-Test11-input", "Recent fiscal periods", false);
		When.iEnterValue("smartFilterBar-filterItemControlA_-Test12-input", "Past 6 Months", false);
		When.iEnterValue("smartFilterBar-filterItemControlA_-Test13-input", "Next 4 Weeks", false);
		When.iPressTheFilterGoButton();

		var sResult = "(Test1 ge datetime'" + sThisYearStart + "' and Test1 le datetime'" + sTodayEnd + "') " +
			"and (Test2 ge datetime'" + sTodayStart + "' and Test2 le datetime'" + sInfinityDate + "') " +
			"and (Test3 ge datetime'" + sTodayStart + "' and Test3 le datetime'" + sTodayEnd + "') " +
			"and (Test4 ge datetime'" + sLast3MonthsStart + "' and Test4 le datetime'" + sTodayEnd + "') " +
			"and (Test5 ge datetime'" + sTodayStart + "' and Test5 le datetime'" + sTomorrowEnd + "') " +
			"and (Test6 ge datetime'" + sLast7DaysStart + "' and Test6 le datetime'" + sTodayEnd + "') " +
			"and (Test7 ge datetime'" + sThisYearStart + "' and Test7 le datetime'" + sThisYearEnd + "') " +
			"and (Test8 ge datetime'" + sMoreInThePastStart + "' and Test8 le datetime'" + sLast180DaysEnd + "') " +
			"and (Test10 ge datetime'" + sLast5DaysStart + "' and Test10 le datetime'" + sTodayEnd + "') " +
			"and (Test11 ge datetime'" + sLast4MonthsStart + "' and Test11 le datetime'" + sTodayEnd + "') " +
			"and (Test12 ge datetime'" + sPast6MonthsStart + "' and Test12 le datetime'" + sYesterdayEnd + "') " +
			"and (Test13 ge datetime'" + sTodayStart + "' and Test13 le datetime'" + sNext4WeeksEnd + "')";
		Then.theFiltersShouldMatch(sResult);

		// Act
		var sVariantName = "DDR_Test" + new Date().toISOString();
		When.iSaveVariantAs(oCompResourceBundle.getText("VARIANT_MANAGEMENT_STANDARD"), sVariantName);
		When.iSelectVariant(oCompResourceBundle.getText("VARIANT_MANAGEMENT_STANDARD"));
		//When.iPressTheRestoreButton();
		When.iPressTheFilterGoButton();

		// Assert
		var sResultStandart = "(Test1 ge datetime'" + sThisYearStart + "' and Test1 le datetime'" + sTodayEnd + "') " +
			"and (Test3 ge datetime'" + sTodayStart + "' and Test3 le datetime'" + sTodayEnd + "') " +
			"and (Test7 ge datetime'" + sThisYearStart + "' and Test7 le datetime'" + sThisYearEnd + "')";
		Then.theFiltersShouldMatch(sResultStandart);

		// Act
		When.iSelectVariant(sVariantName);
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch(sResult);

		// Cleanup
		When.iPressTheRestoreButton();
	});
});
