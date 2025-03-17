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
		sComponent = "__component0---emptyKey--";

	Opa5.extendConfig({
		autoWait: true,
		enabled: false,
		testLibs: {
			compTestLibrary: {
				appUrl: "test-resources/sap/ui/comp/smartfield/SmartFieldTypes/SmartField_Types.html#/pages/emptyKey"
			}
		}
	});

	sap.ui.require([
		"sap/ui/comp/qunit/smartfield/opa/SmartFieldTypes/pages/SmartFieldTypes"
	], function() {

		QUnit.module("TextArrangement with empty IDs");

		opaTest("When I use SmartFields with ValueList standard and TextArrangement type with initial empty string value for ID, I should see the empty key's description", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey1None", "");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey1None", "");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey1ValueList", "");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey1ValueList", " (Empty Key Description)");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey1ValueListNoValidation", "");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey1ValueListNoValidation", " (Empty Key Description)");

			// Action
			// There is no present property in the current entity at all
			When.onTheSmartFieldTypesPage.iPressSelectProduct("1002");

			//Action
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey1None", undefined);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey1None", "");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey1ValueList", undefined);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey1ValueList", "");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey1ValueListNoValidation", undefined);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey1ValueListNoValidation", "");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I use SmartFields with ValueList fixed-values and TextArrangement type with initial empty string value for ID, I should see the empty key's description", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey2None", "");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey2None", " (Empty Key Description)");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey2ValueList", "");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey2ValueList", " (Empty Key Description)");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey2ValueListNoValidation", "");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey2ValueListNoValidation", " (Empty Key Description)");

			// Action
			// There is no present property in the current entity at all
			When.onTheSmartFieldTypesPage.iPressSelectProduct("1002");

			//Action
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey2None", undefined);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey2None", "");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey2ValueList", undefined);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey2ValueList", "");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey2ValueListNoValidation", undefined);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey2ValueListNoValidation", "");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I use SmartFields with ValueList standard and TextArrangement type with initial value for ID and I delete the value, I shouldn't see any value", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Action
			When.onTheSmartFieldTypesPage.iPressSelectProduct("1003");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey1None", "DE");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey1None", "DE");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey1ValueList", "DE");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey1ValueList", "DE (Germany)");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey1ValueListNoValidation", "DE");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey1ValueListNoValidation", "DE (Germany)");

			// Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "emptyKey1None", "");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "emptyKey1ValueList", "");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "emptyKey1ValueListNoValidation", "");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey1None", null);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey1None", "");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey1ValueList", null);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey1ValueList", "");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey1ValueListNoValidation", null);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey1ValueListNoValidation", "");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I use SmartFields with ValueList fixed-values and TextArrangement type with initial value for ID and I delete the value, I shouldn't see any value", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Action
			When.onTheSmartFieldTypesPage.iPressSelectProduct("1003");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey2None", "DE");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey2None", "DE (Germany)");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey2ValueList", "DE");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey2ValueList", "DE (Germany)");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey2ValueListNoValidation", "DE");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey2ValueListNoValidation", "DE (Germany)");

			// Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "emptyKey2None", "");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "emptyKey2ValueList", "");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "emptyKey2ValueListNoValidation", "");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey2None", null);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey2None", "");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey2ValueList", null);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey2ValueList", "");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey2ValueListNoValidation", null);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey2ValueListNoValidation", "");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I use mandatory SmartFields with ValueList standard not nullable and TextArrangement type with initial value for ID and I delete the value, I should see an error", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Action
			When.onTheSmartFieldTypesPage.iPressSelectProduct("1003");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey3ValueList", "DE");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey3ValueList", "DE (Germany)");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey3ValueListNoValidation", "DE");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey3ValueListNoValidation", "DE (Germany)");

			// Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "emptyKey3ValueList", "");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "emptyKey3ValueListNoValidation", "");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey3ValueList", "DE");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey3ValueList", "");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sComponent + "emptyKey3ValueList", ValueState.Error);

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey3ValueListNoValidation", "DE");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey3ValueListNoValidation", "");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sComponent + "emptyKey3ValueListNoValidation", ValueState.Error);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I use mandatory SmartFields with ValueList fixed-values not nullable and TextArrangement type with initial value for ID and I delete the value, I should see an error", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Action
			When.onTheSmartFieldTypesPage.iPressSelectProduct("1003");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey4ValueList", "DE");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey4ValueList", "DE (Germany)");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey4ValueListNoValidation", "DE");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey4ValueListNoValidation", "DE (Germany)");

			// Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "emptyKey4ValueList", "");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "emptyKey4ValueListNoValidation", "");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey4ValueList", "DE");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey4ValueList", "");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sComponent + "emptyKey4ValueList", ValueState.Error);

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey4ValueListNoValidation", "DE");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey4ValueListNoValidation", "");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sComponent + "emptyKey4ValueListNoValidation", ValueState.Error);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I use SmartFields with ValueList standard and TextArrangement type with initial empty string value for ID, I should see the key's description in Display mode", function (Given, When, Then) {
			// Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey1None", "");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey1None", "");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey1ValueList", "");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey1ValueList", " (Empty Key Description)");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey1ValueListNoValidation", "");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey1ValueListNoValidation", " (Empty Key Description)");

			// Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", false);

			// Action
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey1None", "");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey1None", " (Empty Key Description)");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey1ValueList", "");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey1ValueList", " (Empty Key Description)");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey1ValueListNoValidation", "");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey1ValueListNoValidation", " (Empty Key Description)");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I use SmartFields with ValueList fixed-values and TextArrangement type with initial empty string value for ID, I should see the key's description in Display mode", function (Given, When, Then) {
			// Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey2None", "");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey2None", " (Empty Key Description)");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey2ValueList", "");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey2ValueList", " (Empty Key Description)");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey2ValueListNoValidation", "");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey2ValueListNoValidation", " (Empty Key Description)");

			// Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", false);

			// Action
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey2None", "");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey2None", " (Empty Key Description)");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey2ValueList", "");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey2ValueList", " (Empty Key Description)");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey2ValueListNoValidation", "");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey2ValueListNoValidation", " (Empty Key Description)");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});


		opaTest("When I use mandatory SmartFields with ValueList standard not nullable and TextArrangement type without value and I explicitly check the errors, I should see an error", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Action
			When.onTheSmartFieldTypesPage.iPressSelectProduct("1002");

			When.onTheSmartFieldTypesPage.iCheckSmartFieldForErrors(sComponent + "emptyKey3ValueList");
			When.onTheSmartFieldTypesPage.iCheckSmartFieldForErrors(sComponent + "emptyKey3ValueListNoValidation");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey3ValueList", undefined);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey3ValueList", "");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sComponent + "emptyKey3ValueList", ValueState.Error);

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey3ValueListNoValidation", undefined);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey3ValueListNoValidation", "");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sComponent + "emptyKey3ValueListNoValidation", ValueState.Error);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I use mandatory SmartFields with ValueList fixed-values not nullable and TextArrangement type without value and I explicitly check the errors, I should see an error", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Action
			When.onTheSmartFieldTypesPage.iPressSelectProduct("1002");

			When.onTheSmartFieldTypesPage.iCheckSmartFieldForErrors(sComponent + "emptyKey4ValueList");
			When.onTheSmartFieldTypesPage.iCheckSmartFieldForErrors(sComponent + "emptyKey4ValueListNoValidation");

			//Assertion

			/// There is a bug in the SmartField#checkValuesValidity and the test is failing
			/// This test should be uncommented when the bug is fixed
			// Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey4ValueList", undefined);
			// Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey4ValueList", "");
			// Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sComponent + "emptyKey4ValueList", ValueState.Error);

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "emptyKey4ValueListNoValidation", undefined);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "emptyKey4ValueListNoValidation", "");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sComponent + "emptyKey4ValueListNoValidation", ValueState.Error);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.start();

	});
});
