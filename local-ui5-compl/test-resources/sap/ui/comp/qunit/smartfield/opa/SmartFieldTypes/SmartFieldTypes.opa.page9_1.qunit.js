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

	var sComponent = "__component0---whitespace--";

	Opa5.extendConfig({
		autoWait: true,
		enabled: false,
		timeout: 60,
		testLibs: {
			compTestLibrary: {
				appUrl: "test-resources/sap/ui/comp/smartfield/SmartFieldTypes/SmartField_Types.html#/pages/whitespace"
			}
		}
	});

	sap.ui.require([
		"sap/ui/comp/qunit/smartfield/opa/SmartFieldTypes/pages/SmartFieldTypes"
	], function() {

		opaTest("White spaces visualization in read-only mode", function(Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "StringWs", "Text          with 10 whitespace characters");
			When.onTheSmartField.iOpenSuggestionsForSmartField(sComponent + "StringFixedWs");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "SuggestionsWS", "t");

			// Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldPopupItemWithTitle(sComponent + "StringFixedWs", 5, "Text with 1 whitespace");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldSuggestionItemWithText(sComponent + "SuggestionsWS", 0, "Text with 1 whitespace");

			// Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", false);

			// Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "StringWs", "Text          with 10 whitespace characters");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.start();

	});
});
