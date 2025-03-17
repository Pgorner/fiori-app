/* global QUnit */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/core/library",
	"test-resources/sap/ui/comp/testutils/opa/TestLibrary"
], function (
	Opa5,
	opaTest,
	coreLibrary
) {
	"use strict";

	var ValueState = coreLibrary.ValueState,
		sComponent = "__component0---calendarTypes--";

	Opa5.extendConfig({
		autoWait: true,
		enabled: false,
		timeout: 60,
		testLibs: {
			compTestLibrary: {
				appUrl: "test-resources/sap/ui/comp/smartfield/SmartFieldTypes/SmartField_Types.html#/pages/calendarTypes"
			}
		}
	});

	sap.ui.require([
		"sap/ui/comp/qunit/smartfield/opa/SmartFieldTypes/pages/SmartFieldTypes"
	], function() {

		opaTest("CalendarDateType validation set error state", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "CalendarYear", "11111");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "CalendarWeek", "55");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "CalendarMonth", "13");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "CalendarQuarter", "5");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "CalendarYearWeek", "54/2022");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "CalendarYearMonth", "13/2022");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "CalendarYearQuarter", "5/2022");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sComponent + "CalendarYear", ValueState.Error);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sComponent + "CalendarWeek", ValueState.Error);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sComponent + "CalendarMonth", ValueState.Error);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sComponent + "CalendarQuarter", ValueState.Error);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sComponent + "CalendarYearWeek", ValueState.Error);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sComponent + "CalendarYearMonth", ValueState.Error);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sComponent + "CalendarYearQuarter", ValueState.Error);

			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("CalendarDateType validation passed", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "CalendarYear", "2020");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "CalendarWeek", "53");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "CalendarMonth", "1");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "CalendarQuarter", "3");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "CalendarYearWeek", "52/2022");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "CalendarYearMonth", "12/2022");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "CalendarYearQuarter", "1/2022");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sComponent + "CalendarYear", ValueState.None);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sComponent + "CalendarWeek", ValueState.None);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sComponent + "CalendarMonth", ValueState.None);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sComponent + "CalendarQuarter", ValueState.None);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sComponent + "CalendarYearWeek", ValueState.None);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sComponent + "CalendarYearMonth", ValueState.None);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sComponent + "CalendarYearQuarter", ValueState.None);

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "CalendarYear", "2020");
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "CalendarWeek", "53");
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "CalendarMonth", "01");
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "CalendarQuarter", "3");
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "CalendarYearWeek", "202252");
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "CalendarYearMonth", "202212");
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "CalendarYearQuarter", "20221");

			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.start();

	});
});
