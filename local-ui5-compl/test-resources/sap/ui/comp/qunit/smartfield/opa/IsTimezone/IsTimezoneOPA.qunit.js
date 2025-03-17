/* global QUnit */
sap.ui.define([
	"sap/base/i18n/Localization",
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"test-resources/sap/ui/comp/testutils/opa/TestLibrary"
], function (
	Localization,
	Opa5,
	opaTest
) {
	"use strict";
	var sLocalTimeZone = Localization.getTimezone().replace("/",", "),
		sSmartFieldControlId = "idView--Name",
		sSmartFieldControlVLId = "idView--LastName",
		sSmartFieldFixedValueId = "idView--Cbmx",
		sModelDumpId = "idView--modelDump";

	Opa5.extendConfig({
		testLibs: {
			compTestLibrary: {
				appUrl: "test-resources/sap/ui/comp/qunit/smartfield/opa/IsTimezone/applicationUnderTest/IsTimezone.html"
			}
		},
		viewName: "mainView",
		viewNamespace: "",
		autoWait: true,
		async: true,
		timeout: 120
	});

	sap.ui.require([
		"sap/ui/comp/qunit/smartfield/opa/IsTimezone/applicationUnderTest/test/pages/Application"
	], function() {

		QUnit.module("Defaults");
		opaTest("SmartField should show the default Timezone", function(Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Assertions
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue(sSmartFieldControlId, sLocalTimeZone);
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue(sSmartFieldControlVLId, sLocalTimeZone);
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue(sSmartFieldFixedValueId, sLocalTimeZone);

			// Cleanup
			Given.onTheCompTestLibrary.iStopMyApp();
		});
		opaTest("Suggestions should be formatted correctly", function(Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Actions
			When.onTheApplicationPage.iOpenSmartFieldSuggestions(sSmartFieldControlId, "A");
			When.onTheApplicationPage.iOpenSmartFieldSuggestions(sSmartFieldControlVLId, "A");

			// Assertions
			Then.onTheSmartField.iShouldSeeSmartFieldSuggestionItemWithText(sSmartFieldControlId, 0, "Europe, Berlin");
			Then.onTheSmartField.iShouldSeeSmartFieldSuggestionItemWithText(sSmartFieldControlVLId, 0, "Europe, Berlin");

			// Cleanup
			Given.onTheCompTestLibrary.iStopMyApp();
		});
		opaTest("ComboBox items should be formatted correctly", function(Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Assertions
			Then.onTheApplicationPage.iShouldSeeSmartFieldFixedListItemWithText(sSmartFieldFixedValueId, 2, "Europe, Sofia");

			// Cleanup
			Given.onTheCompTestLibrary.iStopMyApp();
		});
		opaTest("SmartField with IsTimezone - should show ValueHelp", function(Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Actions
			When.onTheApplicationPage.iOpenVHD("idView--Name-input");

			// Assertions
			Then.onTheValueHelpDialog.iCheckValueHelpDialogIsOpened("idView--Name-input");
			Then.onTheApplicationPage.iCheckTableItemWithText(3, "Europe, Paris");

			// Cleanup
			Given.onTheCompTestLibrary.iStopMyApp();
		});
		opaTest("Change model should be updated on delete", function(Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Actions
			When.onTheSmartField.iEnterTextInSmartField(sSmartFieldControlId, "");
			When.onTheSmartField.iEnterTextInSmartField(sSmartFieldFixedValueId, "");

			// Assertions
			Then.onTheApplicationPage.iCheckPedningChanges(sModelDumpId, "Name:null, Cbmx:null");

			// Cleanup
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.start();

	});

});
