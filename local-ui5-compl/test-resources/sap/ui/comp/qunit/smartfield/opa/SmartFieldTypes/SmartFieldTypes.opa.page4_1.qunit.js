/* global QUnit */
sap.ui.define([
	"sap/ui/core/Lib",
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/core/library",
	"test-resources/sap/ui/comp/testutils/opa/TestLibrary"
], function (
	Library,
	Opa5,
	opaTest,
	coreLibrary
) {
	"use strict";

	var ValueState = coreLibrary.ValueState,
		oCoreRB = Library.getResourceBundleFor("sap.ui.core"),
		sComponent = "__component0---textArrangement--";

	Opa5.extendConfig({
		autoWait: true,
		enabled: false,
		timeout: 60,
		testLibs: {
			compTestLibrary: {
				appUrl: "test-resources/sap/ui/comp/smartfield/SmartFieldTypes/SmartField_Types.html#/pages/textArrangement"
			}
		}
	});

	sap.ui.require([
		"sap/ui/comp/qunit/smartfield/opa/SmartFieldTypes/pages/SmartFieldTypes"
	], function() {

		opaTest("When I use SmartFields with TextArrangement type space from the end of a string value should get trimmed", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "languageCode1", "CN      ");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "languageCode1", "CN (China)");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I use SmartFields with TextArrangement type non breaking space from the end of a string value should not get trimmed", function (Given, When, Then) {
			var sValueWithNonBreakingSpace = decodeURIComponent("CN%C2%A0");

			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "languageCode1", sValueWithNonBreakingSpace);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "languageCode1", sValueWithNonBreakingSpace);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sComponent + "languageCode1", ValueState.Error);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I use SmartFields with Value List fixed-values and TextArrangement type, I should see the text and its description in display mode", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iSelectSmartFieldItemByKey(sComponent + "languageCode3", "CN");
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", false);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlValue(sComponent + "languageCode3", "CN (China)");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I use SmartFields with TextArrangement type with IsUpperCase annotations, the user input must be converted to uppercase", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "languageCode5", "aa");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "languageCode5", "AA");

			// Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "languageCode5", "bb");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "languageCode5", "BB");

			// Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "languageCode5", "cc");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "languageCode5", "CC");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I use SmartFields with Value List fixed-values (ComboBox) and enter value which is not in the list to be saved in the model and shown in display mode", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "languageCode3", "NV");
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", false);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlValue(sComponent + "languageCode3", "NV");
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "languageCode3", "NV");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "languageCode3", "NV");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I use SmartFields with Value List fixed-values (ComboBox) and enter value which is not in the list but the list have key empty string should update the model", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartFieldTypesPage.iChangeFirstItemKeyInInnerControl(sComponent + "languageCode3", "");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "languageCode3", "NV");
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", false);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlValue(sComponent + "languageCode3", "NV");
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "languageCode3", "NV");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "languageCode3", "NV");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("BCP: 2180289934 ComboBox field resets when model.resetChanges is called on temporary model entry", function(Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Action
			When.onTheSmartFieldTypesPage.iPressButton(sComponent + "btnCreateTempEntry");
			When.onTheSmartField.iSelectSmartFieldItemByKey(sComponent + "languageCode4", "CN");

			// Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "languageCode4", "CN");

			// Action - call model resetChanges
			When.waitFor({
				id: sComponent + "languageCode4",
				success: function (oSF) {
					oSF.getBinding("value").getModel().resetChanges();
				}
			});

			// Assertion - value should be reset
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "languageCode4", null);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("SmartField with TextArrangement descriptionOnly should respect maxLength constraint", function(Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "languageCode15", "NNNNNNNNN");

			// Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sComponent + "languageCode15", ValueState.Error);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueStateError(sComponent + "languageCode15", ValueState.Error, oCoreRB.getText("EnterTextMaxLength", ["8"]));

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("If a field is with TextArrangement, it is  not nullable and clientSideMandatoryCheck is false when I delete the value, we should send empty string to the backend.", function (Given, When, Then) {
			var sSmartFieldId = sComponent + "languageCode24";

			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sSmartFieldId, "");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sSmartFieldId, "");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sSmartFieldId, "");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sSmartFieldId, ValueState.None);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("If a field is with TextArrangement, it is  nullable and clientSideMandatoryCheck is false when I delete the value, we should send null to the backend.", function (Given, When, Then) {
			var sSmartFieldId = sComponent + "languageCode26";

			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sSmartFieldId, "");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sSmartFieldId, null);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sSmartFieldId, "");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sSmartFieldId, ValueState.None);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.start();

	});
});
