/* global QUnit */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/core/Lib",
	"sap/ui/core/library",
	"test-resources/sap/ui/comp/testutils/opa/TestLibrary"
], function (
	Opa5,
	opaTest,
	Library,
	coreLibrary
) {
	"use strict";

	var sComponent = "__component0---textArrangement2--",
		ValueState = coreLibrary.ValueState;

	Opa5.extendConfig({
		autoWait: true,
		enabled: false,
		testLibs: {
			compTestLibrary: {
				appUrl: "test-resources/sap/ui/comp/smartfield/SmartFieldTypes/SmartField_Types.html#/pages/textArrangement2"
			}
		}
	});

	sap.ui.require([
		"sap/ui/comp/qunit/smartfield/opa/SmartFieldTypes/pages/SmartFieldTypes"
	], function() {

		QUnit.module("SmartField TextArrangement with Numc");

		opaTest("When I enter value, I should see suggestions and select last item from the list", function (Given, When, Then) {
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartFieldTypesPage.iOpenSmartFieldSuggestions(sComponent + "NumcMaxLength", "1");
			When.onTheSmartField.iSelectAnItemFromTheSuggest(2);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "NumcMaxLength", "Desc for 0051 (51)");

			//Action
			When.onTheSmartFieldTypesPage.iOpenSmartFieldSuggestions(sComponent + "NumcTextArrangement", "1");
			When.onTheSmartField.iSelectAnItemFromTheSuggest(2);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "NumcTextArrangement", "Desc for 51 (51)");
		});


		opaTest("When I enter value, I should see corresponding description", function (Given, When, Then) {
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "NumcMaxLength", "Desc for 0001 (1)");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "NumcTextArrangement", "Desc for 1 (1)");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "NumcMaxLength", "Desc for 0001 (1)");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "NumcTextArrangement", "Desc for 1 (1)");

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", false);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "NumcMaxLength", "Desc for 0001 (1)");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "NumcTextArrangement", "Desc for 1 (1)");

			// Clean
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", true);
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "NumcMaxLength", "");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "NumcTextArrangement", "");

		});

		opaTest("When I enter value and after that deleted it , I should see empty field", function (Given, When, Then) {
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "NumcMaxLength", "Desc for 0001 (1)");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "NumcTextArrangement", "Desc for 1 (1)");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "NumcMaxLength", "Desc for 0001 (1)");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "NumcTextArrangement", "Desc for 1 (1)");

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "NumcMaxLength", "");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "NumcTextArrangement", "");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "NumcMaxLength", "");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "NumcTextArrangement", "");

			// Clean
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "NumcMaxLength", "");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "NumcTextArrangement", "");
		});

		opaTest("When I enter value and after that invalid value , I should see error state", function (Given, When, Then) {
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "NumcMaxLength", "Desc for 0001 (1)");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "NumcTextArrangement", "Desc for 1 (1)");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "NumcMaxLength", "Desc for 0001 (1)");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "NumcTextArrangement", "Desc for 1 (1)");

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "NumcMaxLength", "Desc for 00");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "NumcTextArrangement", "Desc for 00");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sComponent + "NumcMaxLength", ValueState.Error);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sComponent + "NumcTextArrangement", ValueState.Error);

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "NumcMaxLength", "Desc for 0001 (1)");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "NumcTextArrangement", "Desc for 1 (1)");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sComponent + "NumcMaxLength", ValueState.None);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sComponent + "NumcTextArrangement", ValueState.None);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "NumcMaxLength", "Desc for 0001 (1)");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "NumcTextArrangement", "Desc for 1 (1)");

			// Clean
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "NumcMaxLength", "");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "NumcTextArrangement", "");
		});

		opaTest("When I enter only zeros key should load description", function (Given, When, Then) {
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartFieldTypesPage.iOpenSmartFieldSuggestions(sComponent + "NumcMaxLength", "0");
			When.onTheSmartField.iSelectAnItemFromTheSuggest(0);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "NumcMaxLength", "Desc for 000 (0000)");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sComponent + "NumcMaxLength", ValueState.None);

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", false);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlSelectedItemText(sComponent + "NumcMaxLength", "Desc for 000 (0000)");


			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When the model contains 0 for the current field's property it is not shown in the field initially", function (Given, When, Then) {
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "NumcMaxLength", "");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.module("SmartField Fixed list Numc");

		opaTest("When I select value in combobox, trim zeros should be shown when have max length", function (Given, When, Then) {
			var sSmartFieldId = sComponent + "NumcMaxLengthFixed";
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iSelectSmartFieldItemByKey(sSmartFieldId, "1");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlSelectedItemText(sSmartFieldId, "Desc for 0001 (1)");

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", false);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlSelectedItemText(sSmartFieldId, "Desc for 0001 (1)");

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", true);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlSelectedItemText(sSmartFieldId, "Desc for 0001 (1)");

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sSmartFieldId, "55");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sSmartFieldId, "55");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sSmartFieldId, ValueState.Error);

			// Clean
			When.onTheSmartField.iEnterTextInSmartField(sSmartFieldId, "");
		});

		opaTest("When I enter navigation with the keys over ComboBox items and I hit Enter, the Data model should get updated when have max length", function (Given, When, Then) {
			var sSmartFieldId = sComponent + "NumcMaxLengthFixed",
				sKeyValue = "0001",
				sTextArrangementValue = "Desc for 0001 (1)";

			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iOpenItemsPopover(sSmartFieldId).iSelectsPopoverItemByIndex(sSmartFieldId, 1, false);
			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sSmartFieldId, sKeyValue);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sSmartFieldId, sTextArrangementValue);

			// Clean
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "NumcMaxLengthFixed", "");
		});

		opaTest("When I select value in combobox, trim zeros should be shown", function (Given, When, Then) {
			var sSmartFieldId = sComponent + "NumcTextArrangementFixed";
				Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iSelectSmartFieldItemByKey(sSmartFieldId, "1");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlSelectedItemText(sSmartFieldId, "Desc for 0001 (1)");

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", false);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlSelectedItemText(sSmartFieldId, "Desc for 0001 (1)");

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", true);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlSelectedItemText(sSmartFieldId, "Desc for 0001 (1)");

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sSmartFieldId, "55");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sSmartFieldId, "55");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sSmartFieldId, ValueState.Error);

			//Action
			When.onTheSmartField.iSelectSmartFieldItemByKey(sSmartFieldId, "000");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlSelectedItemText(sSmartFieldId, "Desc for 000 (000)");

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", false);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlSelectedItemText(sSmartFieldId, "Desc for 000 (0)");

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", true);

			// Clean
			When.onTheSmartField.iEnterTextInSmartField(sSmartFieldId, "");
		});

		opaTest("When I enter navigation with the keys over ComboBox items and I hit Enter, the Data model should get updated", function (Given, When, Then) {
			var sSmartFieldId = sComponent + "NumcTextArrangementFixed",
				sKeyValue = "1",
				sTextArrangementValue = "Desc for 0001 (1)";

			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iOpenItemsPopover(sSmartFieldId).iSelectsPopoverItemByIndex(sSmartFieldId, 1);
			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sSmartFieldId, sKeyValue);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sSmartFieldId, sTextArrangementValue);

			// Clean
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "NumcMaxLengthFixed", "");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "NumcMaxLengthFixed", "");
			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.start();

	});
});
