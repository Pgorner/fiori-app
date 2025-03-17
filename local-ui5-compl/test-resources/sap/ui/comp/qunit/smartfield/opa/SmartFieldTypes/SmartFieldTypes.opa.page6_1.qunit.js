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

	var sComponent = "__component0---emptyConstant--";

	Opa5.extendConfig({
		autoWait: true,
		enabled: false,
		timeout: 60,
		testLibs: {
			compTestLibrary: {
				appUrl: "test-resources/sap/ui/comp/smartfield/SmartFieldTypes/SmartField_Types.html#/pages/emptyConstant"
			}
		}
	});

	sap.ui.require([
		"sap/ui/comp/qunit/smartfield/opa/SmartFieldTypes/pages/SmartFieldTypes"
	], function() {

		opaTest("When I use SmartFields with ValueList standard values and I open the VHD, I should see the items filtered correctly by empty const parameter depending on the InitialValueIsSignificant value", function (Given, When, Then) {

			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheValueHelpDialog.iOpenTheValueHelpForInputField(sComponent + "constant1-input");

			//Assertion
			Then.onTheValueHelpDialog.iCheckItemsCountEqualTo(7);


			//Action
			When.onTheValueHelpDialog.iCloseTheValueHelpDialog(true);
			When.onTheValueHelpDialog.iOpenTheValueHelpForInputField(sComponent + "constant2-input");

			//Assertion
			Then.onTheValueHelpDialog.iCheckItemsCountEqualTo(1);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I use SmartFields with ValueList fixed values and I open the popup, items should not be filtered by empty const parameter if the InitialValueIsSignificant value is false", function (Given, When, Then) {

			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iOpenSuggestionsForSmartField(sComponent + "constant3");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFiledPopupFiltered(sComponent + "constant3", 7);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I use SmartFields with ValueList fixed values and I open the popup, items should not be filtered by empty const parameter if the InitialValueIsSignificant value is true", function (Given, When, Then) {

			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iOpenSuggestionsForSmartField(sComponent + "constant4");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFiledPopupFiltered(sComponent + "constant4", 1);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.start();

	});
});
