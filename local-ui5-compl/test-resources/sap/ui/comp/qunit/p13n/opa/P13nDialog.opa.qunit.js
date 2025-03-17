/*global QUnit */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"test-resources/sap/ui/comp/testutils/opa/TestLibrary"
], function(Opa5, OpaTest) {
	"use strict";

	Opa5.extendConfig({
		viewName: "SmartFilterBar",
		viewNamespace: "sap.ui.comp.sample.smartfilterbar_types",
		async: false,
		timeout: 120,
		testLibs: {
			compTestLibrary: {
				appUrl: "test-resources/sap/ui/comp/qunit/smartfilterbar/opaTests/FieldTypes/applicationUnderTest/SmartFilterBar_Types.html"
			}
		}
	});

	sap.ui.require([
		"sap/ui/comp/qunit/smartfilterbar/opaTests/FieldTypes/pages/SmartFilterBarTypes"
	], function() {

		QUnit.module("Generic");

		OpaTest("Remove all button should remove all filters from Condition panel (BCP:2280065689)", function (Given, When, Then) {
			// Arrange
			var aValues = ["=1", "=2", "=3", "=4", "=5", "=6", "=7", "=8", "=9", "=10", "=11", "=12", "=13"];

			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Add conditions to the Filter of the SmartFilterBar
			aValues.forEach(function (sValue) {
				When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_AUTO", sValue);
			});

			// Act
			When.onTheSmartFilterBarTypesPage.iOpenTheVHD("smartFilterBar-filterItemControlA_-STRING_AUTO");
			When.onTheSmartFilterBarTypesPage.__iNavigateToTheDefineConditionsTab();

			// Assert
			Then.onTheSmartFilterBarTypesPage.iShouldSeeCorrectNumberOfFiltersInP13nConditionPanel(10);

			// Act
			When.onTheSmartFilterBarTypesPage.iPressButtonWithIcon("sap-icon://navigation-right-arrow");

			// Assert
			Then.onTheSmartFilterBarTypesPage.iShouldSeeCorrectNumberOfFiltersInP13nConditionPanel(3);

			// Act
			When.onTheSmartFilterBarTypesPage.iPressTheFiltersRemoveAllButton();
			When.onTheSmartFilterBarTypesPage.iPressTheVHDOKButton();
			When.onTheSmartFilterBarTypesPage.iOpenTheVHD("smartFilterBar-filterItemControlA_-STRING_AUTO");
			When.onTheSmartFilterBarTypesPage.__iNavigateToTheDefineConditionsTab();

			// Assert
			Then.onTheSmartFilterBarTypesPage.iShouldSeeCorrectNumberOfFiltersInP13nConditionPanel(1);

			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.start();
	});
});