/* global QUnit */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/core/library",
	"sap/ui/core/Lib",
	"test-resources/sap/ui/comp/testutils/opa/TestLibrary"
], function (
	Opa5,
	opaTest,
	coreLibrary,
	Library
) {
	"use strict";
	var ValueState = coreLibrary.ValueState,
		sComponent = "__component0---emptyKey--",
		oCompRB = Library.getResourceBundleFor("sap.ui.comp"),
		sError = oCompRB.getText("SMARTFIELD_NOT_FOUND");

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

		QUnit.module("Validation with textInEditModeSource");

		opaTest("When I use SmartFields with ValueList fixed and TextArrangement, I should see error message only for textInEditModeSource ValueList and ValueListWarning", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "sf1", "r");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "sf2", "r");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "sf3", "r");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "sf4", "r");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sComponent + "sf1", ValueState.None);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueStateError(sComponent + "sf2", ValueState.Error, sError);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sComponent + "sf3", ValueState.None);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueStateError(sComponent + "sf4", ValueState.Warning, sError);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I use SmartFields with ValueList fixed and TextArrangement, I should see error message for all cases of textInEditModeSource", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "sf1", "rrrrrr");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "sf2", "rrrrrr");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "sf3", "rrrrrr");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "sf4", "rrrrrr");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueStateError(sComponent + "sf1", ValueState.Error, sError);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueStateError(sComponent + "sf2", ValueState.Error, sError);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueStateError(sComponent + "sf3", ValueState.Error, sError);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueStateError(sComponent + "sf4", ValueState.Warning, sError);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});


		QUnit.start();

	});
});
