/* global QUnit */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/core/Lib",
	"test-resources/sap/ui/comp/testutils/opa/TestLibrary"
], function (
	Opa5,
	opaTest,
	Library
) {
	"use strict";

	var oCompRB = Library.getResourceBundleFor("sap.ui.comp"),
		sComponent = "__component0---textArrangement2--";

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

		QUnit.module("SmartField with TextOnly");

		opaTest("When I enter value for Id, I should see corresponding description", function (Given, When, Then) {

			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "languageCode25", "BG");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "languageCode25", "Bulgaria");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I select item from ValueHelpDialog in SmartField with TextOnly, I should see corresponding description", function (Given, When, Then) {

			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			//Action
			When.onTheValueHelpDialog.iOpenTheValueHelpForInputField(sComponent + "languageCode25-input");
			When.onTheSmartFieldTypesPage.iSelectRowInVHDTable(0);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "languageCode25", "Bulgaria");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I enter value for Id in SmartField with GUID and TextOnly, I should see corresponding description", function (Given, When, Then) {

			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "objectUUID2", "10000000-0000-0000-0000-000000000000");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "objectUUID2", "Bulgaria");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I select item from ValueHelpDialog in SmartField with GUID and TextOnly, I should see corresponding description", function (Given, When, Then) {

			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			//Action
			When.onTheValueHelpDialog.iOpenTheValueHelpForInputField(sComponent + "objectUUID2-input");
			When.onTheSmartFieldTypesPage.iSelectRowInVHDTable(0);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "objectUUID2", "Bulgaria");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I enter invalid value in SmartField with TextArrangement and TextOnly, I should see SMARTFIELD_NOT_UNIQUE error", function (Given, When, Then) {

			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "languageCode25", "fff");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "languageCode27", "fff");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueStateText(sComponent + "languageCode25", oCompRB.getText("SMARTFIELD_NOT_UNIQUE"));
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueStateText(sComponent + "languageCode27", oCompRB.getText("SMARTFIELD_NOT_UNIQUE"));

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I enter value in SmartField (TextOnly configuration), I should see entry with corresponding description", function (Given, When, Then) {
			var sKeyValue = "TT",
				sDescriptionValue = "Test";

			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "languageCode25", sDescriptionValue);
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "languageCode27", sDescriptionValue, false, false, false);

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "languageCode25", sKeyValue);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "languageCode25", sDescriptionValue);
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "languageCode27", sKeyValue);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "languageCode27", sDescriptionValue);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I enter value in SmartField (TextOnly configuration) and no entry matched by description, I should see entry matched by key if any", function (Given, When, Then) {
			var sKeyValue = "TT",
				sDescriptionValue = "Test";

			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "languageCode25", sKeyValue);
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "languageCode27", sKeyValue);

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "languageCode25", sKeyValue);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "languageCode25", sDescriptionValue);
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "languageCode27", sKeyValue);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "languageCode27", sDescriptionValue);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		// opaTest("When I enter navigation with the keys over ComboBox items and I hit Enter, the Data model should get updated", function (Given, When, Then) {
		// 	var sSmartFieldId = sComponent + "languageCode12",
		// 		sKeyValue = "DE",
		// 		sTextArrangementValue = "DE (Germany)";

		// 	Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

		// 	//Action
		// 	When.onTheSmartField.iOpenItemsPopover(sSmartFieldId).iSelectsPopoverItemByIndex(sSmartFieldId, 1, true);
		// 	//Assertion
		// 	Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sSmartFieldId, sKeyValue);
		// 	Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sSmartFieldId, sTextArrangementValue);

		// 	// Clean
		// 	Given.onTheCompTestLibrary.iStopMyApp();
		// });

		QUnit.start();

	});
});
