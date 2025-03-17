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
	var appUrl = sap.ui.require.toUrl("test-resources/sap/ui/comp/qunit/smartfield/opa/CurrencyAndUoMWithCustomList/applicationUnderTestUoM/UoMWithCustomList.html"),
		sQuantityControlId = "idView--Quantity",
		sQuantityMandatoryControlId = "idView--QuantityMandatory",
		sUnitCodeControlId = "idView--Quantity-sfEdit",
		sUnitCodeMandatoryControlId = "idView--QuantityMandatory-sfEdit",
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

		QUnit.module("Unit of measure");

		/**
		 * @deprecated As of version 1.64, replaced by {@link sap.ui.comp.smartfield.SmartField#checkValuesValidity}
		 */
		opaTest("When I input a Quantity value with invalid precision, the binding Quantity value should fallback to the last valid one with value state of ERROR", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sUnitCodeControlId, "KG");
			//Because of core implementation waiting for confirmation from them  that will stay like this the zeros are truncated and the value is parsed as 10.5
			When.onTheSmartField.iEnterTextInSmartField(sQuantityControlId, "1000000.51");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sUnitCodeControlId, "KG");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sUnitCodeControlId, "KG");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sUnitCodeControlId, ValueState.None);

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sQuantityControlId, "1000000.51");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sQuantityControlId, "1,000,000.510");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sQuantityControlId, ValueState.None);

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(false);

			// Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlValue(sQuantityControlId, "1,000,000.510" + "\u2007");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I input a Quantity value with invalid scale, the binding Quantity value should fallback to the last valid one with value state of ERROR", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sUnitCodeControlId, "KG");
			When.onTheSmartField.iEnterTextInSmartField(sQuantityControlId, "1000000.51");
			When.onTheSmartField.iEnterTextInSmartField(sQuantityControlId, "1000000.5011");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sUnitCodeControlId, "KG");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sUnitCodeControlId, "KG");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sUnitCodeControlId, ValueState.None);

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sQuantityControlId, "1000000.51");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sQuantityControlId, "1000000.5011");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sQuantityControlId, ValueState.Error);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I input an invalid Quantity type, the binding Quantity value should fallback to the last valid one with value state of ERROR", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sUnitCodeControlId, "KG");
			When.onTheSmartField.iEnterTextInSmartField(sQuantityControlId, "1000000.50");
			When.onTheSmartField.iEnterTextInSmartField(sQuantityControlId, "foo");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sUnitCodeControlId, "KG");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sUnitCodeControlId, "KG");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sUnitCodeControlId, ValueState.None);

			//Because of core implementation waiting for confirmation from them  that will stay like this the zeros are truncated and the value is parsed as 10.5
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sQuantityControlId, "1000000.5");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sQuantityControlId, "foo");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sQuantityControlId, ValueState.Error);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		/**
		 * @deprecated As of version 1.64, replaced by {@link sap.ui.comp.smartfield.SmartField#checkValuesValidity}
		 */
		opaTest("When I input a valid Quantity value and an empty string for Quantity code, the amount should be formatted with scale of 2 with value state of NONE", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sUnitCodeControlId, "KG");
			When.onTheSmartField.iEnterTextInSmartField(sUnitCodeControlId, "");
			When.onTheSmartField.iEnterTextInSmartField(sQuantityControlId, "10");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sUnitCodeControlId, "");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sUnitCodeControlId, "");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sUnitCodeControlId, ValueState.None);

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sQuantityControlId, "10");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sQuantityControlId, "10.000000");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sQuantityControlId, ValueState.None);

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(false);

			// Assertion
			// the change of the behavior is requested by BCP incident 2180298240
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlValue(sQuantityControlId, "10.000000" + "\u2007");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		/**
		 * @deprecated As of version 1.64, replaced by {@link sap.ui.comp.smartfield.SmartField#checkValuesValidity}
		 */
		opaTest("When I input a valid Quantity value and Quantity code for Mandatory field, but clientSideMandatoryCheck is set to false, there should be no validation error", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sQuantityMandatoryControlId, "10");
			When.onTheSmartField.iEnterTextInSmartField(sUnitCodeMandatoryControlId, "KG");


			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sUnitCodeMandatoryControlId, ValueState.None);

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(false);

			// Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlValue(sQuantityMandatoryControlId, "10.000" + "\u2007");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I input a valid Quantity value and an empty string for Quantity code for Mandatory field, but clientSideMandatoryCheck is set to false, there should be no validation error", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sQuantityMandatoryControlId, "10");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sUnitCodeMandatoryControlId, ValueState.None);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.start();
	});
});
