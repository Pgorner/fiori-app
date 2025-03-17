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

	var sComponent = "__component0---manyFilters--";

	Opa5.extendConfig({
		autoWait: true,
		enabled: false,
		timeout: 60,
		testLibs: {
			compTestLibrary: {
				appUrl: "test-resources/sap/ui/comp/smartfield/SmartFieldTypes/SmartField_Types.html#/pages/manyFilters"
			}
		}
	});

	sap.ui.require([
		"sap/ui/comp/qunit/smartfield/opa/SmartFieldTypes/pages/SmartFieldTypes"
	], function() {

		opaTest("defaultShowAllFilters and defaultFilterBarExpanded should work when added as custom data", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Action
			When.onTheValueHelpDialog.iOpenTheValueHelpForInputField(sComponent + "VH_many_filters-input");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeValueHelpDialogWithFiltersAndRows(10, 1);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});


		opaTest("showAllFilters button should be hidden when there are 7 visible and 3 hidden filters", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Action
			When.onTheValueHelpDialog.iOpenTheValueHelpForInputField(sComponent + "VH_visible_hidden_filters-input");

			//Assertion
			Then.onTheValueHelpDialog.iCheckFilterBarShowAllFiltersButtonIsHidden();

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.start();
	});
});
