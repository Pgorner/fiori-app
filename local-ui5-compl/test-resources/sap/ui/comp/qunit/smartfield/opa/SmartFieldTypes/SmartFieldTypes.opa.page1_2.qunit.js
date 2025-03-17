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

	var sCurrencyControlId = "__component0---types--Currency",
		sCurrencyCodeControlId = sCurrencyControlId + "-sfEdit",
		ValueState = coreLibrary.ValueState;

	Opa5.extendConfig({
		autoWait: true,
		enabled: false,
		timeout: 60,
		testLibs: {
			compTestLibrary: {
				appUrl: "test-resources/sap/ui/comp/smartfield/SmartFieldTypes/SmartField_Types.html#/pages/types"
			}
		}
	});

	sap.ui.require([
		"sap/ui/comp/qunit/smartfield/opa/SmartFieldTypes/pages/SmartFieldTypes"
	], function() {

		opaTest("When I input a valid currency amount and code, it should be formatted correctly with value state NONE", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyCodeControlId, "USD");
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyControlId, "10");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "USD");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "USD");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyCodeControlId, ValueState.None);

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10.00");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.None);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I input a valid currency amount and code, it should be formatted correctly with value state NONE", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyCodeControlId, "USD");
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyControlId, "10.5");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "USD");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "USD");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyCodeControlId, ValueState.None);

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10.5");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10.50");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.None);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I input a valid currency amount and code, it should be formatted correctly with value state NONE", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyCodeControlId, "USD");
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyControlId, "10.50");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "USD");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "USD");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyCodeControlId, ValueState.None);

			//Because of core implementation waiting for confirmation from them  that will stay like this the zeros are truncated and the value is parsed as 10.5
			//Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10.50");
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10.5");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10.50");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.None);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I input a currency value with invalid scale, the binding currency value should fallback to the last valid one with value state of ERROR", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyCodeControlId, "USD");
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyControlId, "10.50");
			//Because of core implementation waiting for confirmation from them  that will stay like this the zeros are truncated and the value is parsed as 10.5
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyControlId, "10.501");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "USD");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "USD");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyCodeControlId, ValueState.None);

			//Because of core implementation waiting for confirmation from them  that will stay like this the zeros are truncated and the value is parsed as 10.5
			//Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10.50");
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10.5");

			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10.501");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.Error);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I input a currency value with invalid scale, the binding currency value should fallback to the last valid one with value state of ERROR", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyCodeControlId, "USD");
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyControlId, "10.50");
			//Because of core implementation waiting for confirmation from them  that will stay like this the zeros are truncated and the value is parsed as 10.5
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyControlId, "10.5001");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "USD");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "USD");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyCodeControlId, ValueState.None);

			//Because of core implementation waiting for confirmation from them  that will stay like this the zeros are truncated and the value is parsed as 10.5
			//Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10.50");
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10.5");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10.5001");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.Error);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I input a currency value with invalid precision, the binding currency value should fallback to the last valid one with value state of ERROR", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyCodeControlId, "USD");
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyControlId, "10000000000");
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyControlId, "100000000000");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "USD");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "USD");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyCodeControlId, ValueState.None);

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10000000000");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "100000000000");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.Error);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I input a currency value with invalid precision, the binding currency value should fallback to the last valid one with value state of ERROR", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyCodeControlId, "USD");
			//Because of core implementation waiting for confirmation from them  that will stay like this the zeros are truncated and the value is parsed as 10.5
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyControlId, "10000000000.51");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "USD");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "USD");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyCodeControlId, ValueState.None);

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10000000000.51");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10,000,000,000.51");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.None);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I input a currency value with invalid scale, the binding currency value should fallback to the last valid one with value state of ERROR", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyCodeControlId, "USD");
			//Because of core implementation waiting for confirmation from them  that will stay like this the zeros are truncated and the value is parsed as 10.5
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyControlId, "10000000000.51");
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyControlId, "10000000000.501");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "USD");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "USD");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyCodeControlId, ValueState.None);

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10000000000.51");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10000000000.501");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.Error);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I input an invalid currency type, the binding currency value should fallback to the last valid one with value state of ERROR", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyCodeControlId, "USD");
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyControlId, "10000000000.50");
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyControlId, "foo");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "USD");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "USD");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyCodeControlId, ValueState.None);

			//Because of core implementation waiting for confirmation from them  that will stay like this the zeros are truncated and the value is parsed as 10.5
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10000000000.5");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "foo");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.Error);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I input a valid currency value and an empty string for currency code, the amount should be formatted with scale of 2 with value state of NONE", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyCodeControlId, "USD");
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyCodeControlId, "");
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyControlId, "10");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyCodeControlId, ValueState.None);

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10.00");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.None);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.start();

	});
});
