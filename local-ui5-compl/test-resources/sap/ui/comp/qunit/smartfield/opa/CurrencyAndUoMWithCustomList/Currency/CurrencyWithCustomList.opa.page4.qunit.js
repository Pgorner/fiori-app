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
		opaTest("When I input a valid currency amount and code, it should be formatted correctly with value state NONE", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyCodeControlId, "DKK");
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyControlId, "10");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "DKK");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "DKK");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyCodeControlId, ValueState.None);

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10.0000");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.None);

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(false);

			// Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlValue(sCurrencyControlId, "10.0000" + "\u2007");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		/**
		 * @deprecated As of version 1.64, replaced by {@link sap.ui.comp.smartfield.SmartField#checkValuesValidity}
		 */
		opaTest("When I input a valid currency amount and code, it should be formatted correctly with value state NONE", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyCodeControlId, "DKK");
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyControlId, "10.5");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "DKK");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "DKK");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyCodeControlId, ValueState.None);

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10.5");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10.5000");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.None);

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(false);

			// Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlValue(sCurrencyControlId, "10.5000" + "\u2007");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		/**
		 * @deprecated As of version 1.64, replaced by {@link sap.ui.comp.smartfield.SmartField#checkValuesValidity}
		 */
		opaTest("When I input a valid currency amount and code, it should be formatted correctly with value state NONE", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyCodeControlId, "DKK");
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyControlId, "10.50");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "DKK");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "DKK");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyCodeControlId, ValueState.None);

			//Because of core implementation waiting for confirmation from them  that will stay like this the zeros are truncated and the value is parsed as 10.5
			//Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10.50");
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10.5");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10.5000");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.None);

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(false);

			// Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlValue(sCurrencyControlId, "10.5000" + "\u2007");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I input a currency value with invalid scale, the binding currency value should fallback to the last valid one with value state of ERROR", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyCodeControlId, "DKK");
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyControlId, "10.5000");
			//Because of core implementation waiting for confirmation from them  that will stay like this the zeros are truncated and the value is parsed as 10.5
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyControlId, "10.50001");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "DKK");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "DKK");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyCodeControlId, ValueState.None);

			//Because of core implementation waiting for confirmation from them  that will stay like this the zeros are truncated and the value is parsed as 10.5
			//Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10.50");
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10.5");

			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10.50001");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.Error);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I input a currency value with invalid scale, the binding currency value should fallback to the last valid one with value state of ERROR", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyCodeControlId, "DKK");
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyControlId, "10.5000");
			//Because of core implementation waiting for confirmation from them  that will stay like this the zeros are truncated and the value is parsed as 10.5
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyControlId, "10.500001");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "DKK");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "DKK");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyCodeControlId, ValueState.None);

			//Because of core implementation waiting for confirmation from them  that will stay like this the zeros are truncated and the value is parsed as 10.5
			//Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10.50");
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10.5");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10.500001");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.Error);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I input a currency value with invalid precision, the binding currency value should fallback to the last valid one with value state of ERROR", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyCodeControlId, "DKK");
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyControlId, "100000000");
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyControlId, "100000000000");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "DKK");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "DKK");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyCodeControlId, ValueState.None);

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "100000000");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "100000000000");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.Error);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.start();
	});
});
