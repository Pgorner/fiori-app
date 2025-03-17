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
			When.onTheSmartField.iEnterTextInSmartField(sQuantityControlId, "100000");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sUnitCodeControlId, "G/L");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sUnitCodeControlId, "G/L");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sUnitCodeControlId, ValueState.None);

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sQuantityControlId, "100000");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sQuantityControlId, "100,000");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sQuantityControlId, ValueState.None);

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(false);

			// Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlValue(sQuantityControlId, "100,000" + "\u2007");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		/**
		 * @deprecated As of version 1.64, replaced by {@link sap.ui.comp.smartfield.SmartField#checkValuesValidity}
		 */
		opaTest("When I input a valid Quantity amount and code, it should be formatted correctly with value state NONE", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sUnitCodeControlId, "G/L");
			When.onTheSmartField.iEnterTextInSmartField(sQuantityControlId, "1000000");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sUnitCodeControlId, "G/L");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sUnitCodeControlId, "G/L");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sUnitCodeControlId, ValueState.None);

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sQuantityControlId, "1000000");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sQuantityControlId, "1,000,000");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sQuantityControlId, ValueState.None);

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(false);

			// Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlValue(sQuantityControlId, "1,000,000" + "\u2007");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		/**
		 * @deprecated As of version 1.64, replaced by {@link sap.ui.comp.smartfield.SmartField#checkValuesValidity}
		 */
		opaTest("When I input a valid Quantity amount and code, it should be formatted correctly with value state NONE", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sUnitCodeControlId, "G/L");
			When.onTheSmartField.iEnterTextInSmartField(sQuantityControlId, "1000000");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sUnitCodeControlId, "G/L");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sUnitCodeControlId, "G/L");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sUnitCodeControlId, ValueState.None);

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sQuantityControlId, "1000000");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sQuantityControlId, "1,000,000");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sQuantityControlId, ValueState.None);

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(false);

			// Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlValue(sQuantityControlId, "1,000,000" + "\u2007");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I input a Quantity value with invalid precision, the binding Quantity value should fallback to the last valid one with value state of ERROR", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sUnitCodeControlId, "G/L");
			When.onTheSmartField.iEnterTextInSmartField(sQuantityControlId, "1000000");
			When.onTheSmartField.iEnterTextInSmartField(sQuantityControlId, "10000000000000");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sUnitCodeControlId, "G/L");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sUnitCodeControlId, "G/L");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sUnitCodeControlId, ValueState.None);

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sQuantityControlId, "1000000");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sQuantityControlId, "10000000000000");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sQuantityControlId, ValueState.Error);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I input a valid Quantity amount and code, it should be formatted correctly with value state NONE", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sUnitCodeControlId, "KG");
			When.onTheSmartField.iEnterTextInSmartField(sQuantityControlId, "");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sUnitCodeControlId, "KG");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sUnitCodeControlId, "KG");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sQuantityControlId, null);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sQuantityControlId, "");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sQuantityControlId, ValueState.None);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		/**
		 * @deprecated As of version 1.64, replaced by {@link sap.ui.comp.smartfield.SmartField#checkValuesValidity}
		 */
		opaTest("In Display mode, when Quantity does not have decimal (like G/L), there should be only one space added to the amount", function(Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Action
			When.onTheSmartField.iEnterTextInSmartField(sQuantityControlId, "123");
			When.onTheSmartField.iEnterTextInSmartField(sUnitCodeControlId, "G/L");
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(false);

			// Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlValue(sQuantityControlId, "123" + "\u2007");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("Should format the value when the Unit is in display mode", function(Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Action
			When.onTheSmartField.iEnterTextInSmartField(sUnitCodeControlId, "G/L");
			When.onTheSmartFieldTypesPage.iToggleEditMode(sUnitCodeControlId, false);
			When.onTheSmartField.iEnterTextInSmartField(sQuantityControlId, "123.00");

			// Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlValue(sQuantityControlId, "123");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.start();
	});
});
