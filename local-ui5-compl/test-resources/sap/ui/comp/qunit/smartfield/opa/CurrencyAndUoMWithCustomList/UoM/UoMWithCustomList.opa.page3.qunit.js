/* eslint-disable no-undef */
sap.ui.define([
	'sap/ui/test/Opa5',
	'sap/ui/test/opaQunit',
	'sap/ui/core/library',
	"test-resources/sap/ui/comp/testutils/opa/TestLibrary"
], function (
	Opa5,
	opaTest,
	coreLibrary
) {
	"use strict";
	var appUrl = sap.ui.require.toUrl("test-resources/sap/ui/comp/qunit/smartfield/opa/CurrencyAndUoMWithCustomList/applicationUnderTestUoM/UoMWithCustomList.html"),
		sQuantityControlId = "idView--Quantity",
		sUnitCodeControlId = "idView--Quantity-sfEdit",
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
		opaTest("When I input a valid Quantity amount and code, it should be formatted correctly with value state NONE", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sUnitCodeControlId, "G/L");
			When.onTheSmartField.iEnterTextInSmartField(sQuantityControlId, "10");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sUnitCodeControlId, "G/L");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sUnitCodeControlId, "G/L");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sUnitCodeControlId, ValueState.None);

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sQuantityControlId, "10");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sQuantityControlId, "10");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sQuantityControlId, ValueState.None);

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(false);

			// Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlValue(sQuantityControlId, "10" + "\u2007");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		/**
		 * @deprecated As of version 1.64, replaced by {@link sap.ui.comp.smartfield.SmartField#checkValuesValidity}
		 */
		opaTest("When I input an amount with only zeros as fraction digits and Quantity code without fraction, it should be formatted correctly with value state NONE", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sUnitCodeControlId, "G/L");
			When.onTheSmartField.iEnterTextInSmartField(sQuantityControlId, "10.00");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sUnitCodeControlId, "G/L");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sUnitCodeControlId, "G/L");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sUnitCodeControlId, ValueState.None);

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sQuantityControlId, "10");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sQuantityControlId, "10");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sQuantityControlId, ValueState.None);

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(false);

			// Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlValue(sQuantityControlId, "10" + "\u2007");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I input a Quantity value with invalid scale, the binding Quantity value should fallback to the last valid one with value state of ERROR", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sUnitCodeControlId, "G/L");
			When.onTheSmartField.iEnterTextInSmartField(sQuantityControlId, "10");
			When.onTheSmartField.iEnterTextInSmartField(sQuantityControlId, "10.5");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sUnitCodeControlId, "G/L");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sUnitCodeControlId, "G/L");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sUnitCodeControlId, ValueState.None);

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sQuantityControlId, "10");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sQuantityControlId, "10.5");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sQuantityControlId, ValueState.Error);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I input a Quantity value with invalid scale, the binding Quantity value should fallback to the last valid one with value state of ERROR", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sUnitCodeControlId, "G/L");
			When.onTheSmartField.iEnterTextInSmartField(sQuantityControlId, "10");
			When.onTheSmartField.iEnterTextInSmartField(sQuantityControlId, "10.50");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sUnitCodeControlId, "G/L");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sUnitCodeControlId, "G/L");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sUnitCodeControlId, ValueState.None);

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sQuantityControlId, "10");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sQuantityControlId, "10.50");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sQuantityControlId, ValueState.Error);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I input a Quantity value with invalid scale, the binding Quantity value should fallback to the last valid one with value state of ERROR", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sUnitCodeControlId, "G/L");
			When.onTheSmartField.iEnterTextInSmartField(sQuantityControlId, "10");
			When.onTheSmartField.iEnterTextInSmartField(sQuantityControlId, "10.500");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sUnitCodeControlId, "G/L");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sUnitCodeControlId, "G/L");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sUnitCodeControlId, ValueState.None);

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sQuantityControlId, "10");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sQuantityControlId, "10.500");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sQuantityControlId, ValueState.Error);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I input a Quantity value with invalid scale, the binding Quantity value should fallback to the last valid one with value state of ERROR", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sUnitCodeControlId, "G/L");
			When.onTheSmartField.iEnterTextInSmartField(sQuantityControlId, "10");
			When.onTheSmartField.iEnterTextInSmartField(sQuantityControlId, "10.5000");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sUnitCodeControlId, "G/L");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sUnitCodeControlId, "G/L");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sUnitCodeControlId, ValueState.None);

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sQuantityControlId, "10");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sQuantityControlId, "10.5000");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sQuantityControlId, ValueState.Error);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.start();
	});
});
