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
		sComponent = "__component0---textArrangement2--";

	Opa5.extendConfig({
		autoWait: true,
		enabled: false,
		timeout: 60,
		testLibs: {
			compTestLibrary: {
				appUrl: "test-resources/sap/ui/comp/smartfield/SmartFieldTypes/SmartField_Types.html#/pages/textArrangement2"
			}
		}
	});

	sap.ui.require([
		"sap/ui/comp/qunit/smartfield/opa/SmartFieldTypes/pages/SmartFieldTypes"
	], function() {

		opaTest("When I select an item from ComboBox, the TextArrangement from the ValueList property should be applied", function (Given, When, Then) {
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iSelectSmartFieldItemByKey(sComponent + "languageCode12", "BG");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlSelectedItemText(sComponent + "languageCode12", "Bulgaria (BG)");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlValue(sComponent + "languageCode12", "BG (Bulgaria)");

			//Action
			// When.onTheSmartFieldTypesPage.iToggleFormEditMode(true);
			When.onTheSmartField.iSelectSmartFieldItemByKey(sComponent + "languageCode12", "DE");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlSelectedItemText(sComponent + "languageCode12", "Germany (DE)");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlValue(sComponent + "languageCode12", "DE (Germany)");

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", false);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlSelectedItemText(sComponent + "languageCode12", "Germany (DE)");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlValue(sComponent + "languageCode12", "DE (Germany)");

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", true);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlSelectedItemText(sComponent + "languageCode12", "Germany (DE)");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlValue(sComponent + "languageCode12", "DE (Germany)");

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "languageCode12", "GG");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "languageCode12", "GG");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sComponent + "languageCode12", ValueState.Error);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I enter an invalid value to a SmartField with defaultTextInEditModeSource ValueListNoValidation, the Description from the local Text annotation should get cleared", function (Given, When, Then) {
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "languageCode13", "PL (SB)");

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", false);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "languageCode13", "PL (SB)");

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", true);

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "languageCode13", "GG");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "languageCode13", "GG");

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", false);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "languageCode13", "GG");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I use SmartFields with defaultTextInEditModeSource, the description path for edit mode should be properly updated from display mode", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "languageCode13", "PL (SB)");

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", false);
			When.onTheSmartFieldTypesPage.iEnterValueInSmartField(sComponent + "languageCode13", "DE");
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", true);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "languageCode13", "DE (Germany)");

			//Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("SmartField of type Guid with TextArrangement and textInEditModeSource valueList should format the zero guid as empty string", function(Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "objectUUID1", "00000000-0000-0000-0000-000000000000");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "objectUUID1", "");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I use SmartFields with ValueList annotation and no Text annotations, I should see only whole single key for value", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Action
			When.onTheValueHelpDialog.iOpenTheValueHelpForInputField(sComponent + "languageCode20-input");
			When.onTheSmartFieldTypesPage.iSelectRowInVHDTable(0);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "languageCode20", "BG (Partial Value)");

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", false);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "languageCode20", "BG (Partial Value)");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I use SmartFields with ValueList annotation and no Text annotations, I should see only single keys for values", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "languageCode16", "DE");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "languageCode17", "DE");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "languageCode18", "DE");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "languageCode19", "DE");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "languageCode16", "DE");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlSelectedItemText(sComponent + "languageCode17", "DE");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "languageCode18", "DE");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlSelectedItemText(sComponent + "languageCode19", "DE");

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", false);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "languageCode16", "DE");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlSelectedItemText(sComponent + "languageCode17", "DE");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "languageCode18", "DE");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlSelectedItemText(sComponent + "languageCode19", "DE");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When SmartFields configured to render ObjectStatus is set to display/edit mode, its inner controls should be the right type", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", false);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldFirstInnerControlIsA(sComponent + "ObjectStatusDataFieldDefault", "sap.m.ObjectStatus");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldFirstInnerControlIsA(sComponent + "ObjectStatusLineItem", "sap.m.ObjectStatus");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldFirstInnerControlIsA(sComponent + "ObjectStatusDataPoint", "sap.m.ObjectStatus");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldFirstInnerControlIsA(sComponent + "ObjectStatusFieldGroup", "sap.m.ObjectStatus");

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", true);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldFirstInnerControlIsA(sComponent + "ObjectStatusDataFieldDefault", "sap.m.Input");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldFirstInnerControlIsA(sComponent + "ObjectStatusLineItem", "sap.m.Input");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldFirstInnerControlIsA(sComponent + "ObjectStatusDataPoint", "sap.m.Input");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldFirstInnerControlIsA(sComponent + "ObjectStatusFieldGroup", "sap.m.Input");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When changing value on SmartField with ObjectStatus and TextArrangement configuration, it should be presented correctly", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "ObjectStatusDataFieldDefault", "DE");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "ObjectStatusLineItem", "BG");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "ObjectStatusDataPoint", "DE");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "ObjectStatusFieldGroup", "BG");

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", false);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "ObjectStatusDataFieldDefault", "DE (Germany)");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "ObjectStatusLineItem", "BG (Bulgaria)");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "ObjectStatusDataPoint", "DE (Germany)");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "ObjectStatusFieldGroup", "BG (Bulgaria)");

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", true);
			When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sComponent + "ObjectStatusDataFieldDefault", "BG");
			When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sComponent + "ObjectStatusLineItem", "DE");
			When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sComponent + "ObjectStatusDataPoint", "BG");
			When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sComponent + "ObjectStatusFieldGroup", "DE");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "ObjectStatusDataFieldDefault", "BG");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "ObjectStatusLineItem", "DE");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "ObjectStatusDataPoint", "BG");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "ObjectStatusFieldGroup", "DE");

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", false);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "ObjectStatusDataFieldDefault", "BG (Bulgaria)");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "ObjectStatusLineItem", "DE (Germany)");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "ObjectStatusDataPoint", "BG (Bulgaria)");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "ObjectStatusFieldGroup", "DE (Germany)");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("Value Help Dialog title is changeable by annotation", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Action
			When.onTheValueHelpDialog.iOpenTheValueHelpForInputField(sComponent + "languageCode13-input");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeDialogTitleWithValue("Language Codes and Names");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.start();

	});
});
