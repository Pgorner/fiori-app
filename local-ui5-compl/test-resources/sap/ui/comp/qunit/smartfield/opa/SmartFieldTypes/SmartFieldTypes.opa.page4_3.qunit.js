/* global QUnit */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"test-resources/sap/ui/comp/testutils/opa/TestLibrary"
], function (
	Opa5,
	opaTest
) {
	"use strict";

	var sComponent = "__component0---textArrangement--";

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

		opaTest("When I use SmartFields with ValueList fixed-values, if an invalid key is set to the ComboBox, the selected item should get reset", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "languageCode21", "PL");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlValue(sComponent + "languageCode21", "PL (Poland)");

			// Action
			When.onTheSmartFieldTypesPage.iUpdateTheInParamFromDataModel(sComponent + "languageCode21", "Continent", "CentralEurope");
			When.onTheSmartFieldTypesPage.iUpdateTheValueFromDataModel(sComponent + "languageCode21", "DE");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "languageCode21", "DE (Germany - Central Europe)");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("SmartField with TextArrangement descriptionOnly should not manipulate corresponding ValueList entity", function(Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "languageCode15", "BG");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "languageCode15", "");

			// Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeePendingChanges(sComponent + "languageCode15", {
				"TextArrangement('1001')": {
					"__metadata": {
						"id": "TextArrangement/TextArrangement('1001')",
						"uri": "TextArrangement/TextArrangement('1001')",
						"type": "MyNamespace.MyEntityType",
						"deepPath": "/TextArrangement('1001')"
					},
					"LanguageCode15": null
				}
			});

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I change the SmartField Edit/Display mode, the modeToggled event should be fired", function (Given, When, Then) {

			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldFiredEvent(sComponent + "events", sComponent + "languageCode1", "modeToggled");

			//Action
			When.onTheSmartFieldTypesPage.iClearEventsLog(sComponent + "events");
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", false);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldFiredEvent(sComponent + "events", sComponent + "languageCode1", "modeToggled");

			//Action
			When.onTheSmartFieldTypesPage.iClearEventsLog(sComponent + "events");
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", true);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldFiredEvent(sComponent + "events", sComponent + "languageCode1", "modeToggled");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I change the SmartField visible property multiple times, it should fire the visibleChanged event only once", function (Given, When, Then) {

			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartFieldTypesPage.iClearEventsLog(sComponent + "events");
			When.onTheSmartField.iSetSmartFieldControlProperty(sComponent + "languageCode1", "visible", true);
			When.onTheSmartField.iSetSmartFieldControlProperty(sComponent + "languageCode1", "visible", true);
			When.onTheSmartField.iSetSmartFieldControlProperty(sComponent + "languageCode1", "visible", true);
			When.onTheSmartField.iSetSmartFieldControlProperty(sComponent + "languageCode1", "visible", false);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldFiredEvent(sComponent + "events", sComponent + "languageCode1", "visibleChanged");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.start();

	});
});
