/* eslint-disable no-undef */
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
	var appUrl = sap.ui.require.toUrl("test-resources/sap/ui/comp/qunit/smartfield/opa/CurrencyAndUoMWithCustomList/applicationUnderTestCurrency/CurrencyWithCustomList.html"),
		sCurrencyControlId = "idView--Currency",
		sCurrencyCodeControlId = "idView--Currency-sfEdit",
		ValueState = coreLibrary.ValueState;

	Opa5.extendConfig({
		autoWait: true,
		enabled: false,
		testLibs: {
			compTestLibrary: {
				appUrl: appUrl
			}
		}
	});
	sap.ui.require([
		"sap/ui/comp/qunit/smartfield/opa/CurrencyAndUoMWithCustomList/pages/Application"
	], function() {

		//In the custom list we override the decimals for DKK to be not 2 but 4 to be able to validate the the formatting is coming from the custom list from the backend
		QUnit.module("Currency with 'DKK' which is with different scale in the list then local");

		/**
		 * @deprecated As of version 1.64, replaced by {@link sap.ui.comp.smartfield.SmartField#checkValuesValidity}
		 */
		opaTest("When I input a currency value with invalid precision, the binding currency value should fallback to the last valid one with value state of ERROR", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyCodeControlId, "DKK");
			//Because of core implementation waiting for confirmation from them  that will stay like this the zeros are truncated and the value is parsed as 10.5
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyControlId, "100000000.5111");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "DKK");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "DKK");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyCodeControlId, ValueState.None);

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "100000000.5111");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "100,000,000.5111");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.None);

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(false);

			// Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlValue(sCurrencyControlId, "100,000,000.5111" + "\u2007");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I input a currency value with invalid scale, the binding currency value should fallback to the last valid one with value state of ERROR", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyCodeControlId, "DKK");
			//Because of core implementation waiting for confirmation from them  that will stay like this the zeros are truncated and the value is parsed as 10.5
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyControlId, "100000000.5111");
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyControlId, "100000000.50111");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "DKK");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "DKK");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyCodeControlId, ValueState.None);

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "100000000.5111");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "100000000.50111");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.Error);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I input an invalid currency type, the binding currency value should fallback to the last valid one with value state of ERROR", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyCodeControlId, "DKK");
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyControlId, "100000000.5000");
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyControlId, "foo");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "DKK");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "DKK");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyCodeControlId, ValueState.None);

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "100000000.5");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "foo");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.Error);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I input a valid currency value and an empty string for currency code, the amount should be formatted with scale of 2 with value state of NONE", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyCodeControlId, "DKK");
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyControlId, "10");
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyCodeControlId, "");

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

		opaTest("When I input a valid currency amount and code, it should be formatted correctly with value state NONE", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyCodeControlId, "DKK");
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyControlId, "");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "DKK");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "DKK");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, null);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.None);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.start();
	});
});
