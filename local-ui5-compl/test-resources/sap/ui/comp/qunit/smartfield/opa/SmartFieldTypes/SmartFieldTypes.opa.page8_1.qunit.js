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
	var sComponent = "__component0---importance--";

	Opa5.extendConfig({
		autoWait: true,
		enabled: false,
		timeout: 60,
		testLibs: {
			compTestLibrary: {
				appUrl: "test-resources/sap/ui/comp/smartfield/SmartFieldTypes/SmartField_Types.html#/pages/importance"
			}
		}
	});

	sap.ui.require([
		"sap/ui/comp/qunit/smartfield/opa/SmartFieldTypes/pages/SmartFieldTypes"
	], function() {

		opaTest("When Form has low importance, fields should be visible regardles of importance", function(Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Action
			When.onTheSmartField.iSetSmartFormControlProperty(sComponent + "form", "importance", "Low");

			// Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeGroupElementWithCSSDisplay(sComponent + "Importance", sComponent + "HighImportance", "");
			Then.onTheSmartFieldTypesPage.iShouldSeeGroupElementWithCSSDisplay(sComponent + "Importance", sComponent + "MediumImportance", "");
			Then.onTheSmartFieldTypesPage.iShouldSeeGroupElementWithCSSDisplay(sComponent + "Importance", sComponent + "LowImportance", "");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When Form has medium importance, field with low importance should be hidden", function(Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Action
			When.onTheSmartField.iSetSmartFormControlProperty(sComponent + "form", "importance", "Medium");

			// Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeGroupElementWithCSSDisplay(sComponent + "Importance", sComponent + "HighImportance", "");
			Then.onTheSmartFieldTypesPage.iShouldSeeGroupElementWithCSSDisplay(sComponent + "Importance", sComponent + "MediumImportance", "");
			Then.onTheSmartFieldTypesPage.iShouldSeeGroupElementWithCSSDisplay(sComponent + "Importance", sComponent + "LowImportance", "none");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When form has high importance fields with medium and low importance should be hidden", function(Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Action
			When.onTheSmartField.iSetSmartFormControlProperty(sComponent + "form", "importance", "High");

			// Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeGroupElementWithCSSDisplay(sComponent + "Importance", sComponent + "HighImportance", "");
			Then.onTheSmartFieldTypesPage.iShouldSeeGroupElementWithCSSDisplay(sComponent + "Importance", sComponent + "MediumImportance", "none");
			Then.onTheSmartFieldTypesPage.iShouldSeeGroupElementWithCSSDisplay(sComponent + "Importance", sComponent + "LowImportance", "none");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When field has property 'visible' set to false, it should stay hidden regardless of importance", function(Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Action
			When.onTheSmartField.iSetSmartFieldControlProperty(sComponent + "HighImportance", "visible", false);
			When.onTheSmartField.iSetSmartFieldControlProperty(sComponent + "LowImportance", "visible", false);
			When.onTheSmartField.iSetSmartFormControlProperty(sComponent + "form", "importance", "Low");


			// Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeGroupElementWithCSSDisplay(sComponent + "Importance", sComponent + "HighImportance", null);
			Then.onTheSmartFieldTypesPage.iShouldSeeGroupElementWithCSSDisplay(sComponent + "Importance", sComponent + "MediumImportance", "");
			Then.onTheSmartFieldTypesPage.iShouldSeeGroupElementWithCSSDisplay(sComponent + "Importance", sComponent + "LowImportance", null);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When field has property 'mandatory' set to true, it should stay visible regardless of importance", function(Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Action
			When.onTheSmartField.iSetSmartFieldControlProperty(sComponent + "HighImportance", "mandatory", true);
			When.onTheSmartField.iSetSmartFieldControlProperty(sComponent + "MediumImportance", "mandatory", true);
			When.onTheSmartField.iSetSmartFieldControlProperty(sComponent + "LowImportance", "mandatory", true);
			When.onTheSmartField.iSetSmartFormControlProperty(sComponent + "form", "importance", "High");


			// Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeGroupElementWithCSSDisplay(sComponent + "Importance", sComponent + "HighImportance", "");
			Then.onTheSmartFieldTypesPage.iShouldSeeGroupElementWithCSSDisplay(sComponent + "Importance", sComponent + "MediumImportance", "");
			Then.onTheSmartFieldTypesPage.iShouldSeeGroupElementWithCSSDisplay(sComponent + "Importance", sComponent + "LowImportance", "");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.start();

	});
});
