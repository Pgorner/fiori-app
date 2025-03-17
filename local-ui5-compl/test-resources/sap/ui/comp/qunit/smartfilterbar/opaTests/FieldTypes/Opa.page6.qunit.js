/* global QUnit */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/m/library",
	"sap/ui/core/library",
	"test-resources/sap/ui/comp/testutils/opa/TestLibrary"
], function (
	Opa5,
	opaTest,
	mLibrary,
	coreLibrary
) {
	"use strict";

	Opa5.extendConfig({
		viewName: "App",
		viewNamespace: "test.app.view",
		autoWait: true,
		enabled: false,
		async: true,
		testLibs: {
			compTestLibrary: {
				appUrl: "test-resources/sap/ui/comp/qunit/smartfilterbar/opaTests/FieldTypes/applicationUnderTestValidation/index.html"
			}
		}
	});

	sap.ui.require([
		"sap/ui/comp/qunit/smartfilterbar/opaTests/FieldTypes/pages/SmartFilterBarTypes"
	], function () {

		opaTest("Mandatory visible filters of a type ComboBox should be validated on search for invalid selected key" , function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheSmartFilterBarTypesPage.iSetFilterData( "__xmlview0--smartFilterBar", {
				"ComboBoxMandatory": "1111"
			});

			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theErrorDialogIsOpen("EMPTY_MANDATORY_MESSAGE");

			// Cleanup
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("Non-mandatory visible filters of a type ComboBox should be validated on search for invalid selected key" , function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheSmartFilterBarTypesPage.iSetFilterData( "__xmlview0--smartFilterBar", {
				"ComboBoxNonMandatory": "1111"
			});
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theErrorDialogIsOpen("VALIDATION_ERROR_MESSAGE");

			// Cleanup
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("SmartFilterBar valueListAnnotationLoaded, initialise and initialized events should be fired even with ComboBox filter with invalid Service MetaData" , function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Assert
			Then.onTheSmartFilterBarTypesPage.iShouldSeeAFilterControl("smartFilterBar-filterItemControlA_-ComboBoxIvalidVL", true);
			Then.onTheSmartFilterBarTypesPage.iShouldSeeSmartFieldFiredEvent("__xmlview0--smartFilterBar", "valueListAnnotationLoaded");
			Then.onTheSmartFilterBarTypesPage.iShouldSeeSmartFieldFiredEvent("__xmlview0--smartFilterBar", "initialise");
			Then.onTheSmartFilterBarTypesPage.iShouldSeeSmartFieldFiredEvent("__xmlview0--smartFilterBar", "initialized");

			// Cleanup
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("SmartFilterBar valueListAnnotationLoaded, initialise and initialized events should be fired even with ComboBox filter with invalid Service MetaData" , function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Assert
			Then.onTheSmartFilterBarTypesPage.iShouldSeeAFilterControl("smartFilterBar-filterItemControlA_-ComboBoxIvalidVL", true);
			Then.onTheSmartFilterBarTypesPage.iShouldSeeSmartFieldFiredEvent("__xmlview0--smartFilterBar", "valueListAnnotationLoaded");
			Then.onTheSmartFilterBarTypesPage.iShouldSeeSmartFieldFiredEvent("__xmlview0--smartFilterBar", "initialise");
			Then.onTheSmartFilterBarTypesPage.iShouldSeeSmartFieldFiredEvent("__xmlview0--smartFilterBar", "initialized");

			// Cleanup
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("SmartFilterBar getFiltersWithValues should not return invalid ComboBox selected keys as filters" , function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Assert
			Then.onTheSmartFilterBarTypesPage.iShouldSeeAFilterControl("smartFilterBar-filterItemControlA_-ComboBoxIvalidVL", true);
			Then.onTheSmartFilterBarTypesPage.iShouldSeeFiltersWithValues("__xmlview0--smartFilterBar", ["$Parameter.P_ComboBoxNoItemsValidation", "ComboBoxMandatory"]);

			// Cleanup
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("I should see CompanyCode and BusinessArea groups in the AdaptFilters dialog", function(Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheSmartFilterBarTypesPage.iOpenTheAdaptFiltersDialog();
			When.onTheSmartFilterBarTypesPage.iSwitchAdaptFiltersToGroupView();
			When.onTheSmartFilterBarTypesPage.iExpandAdaptFiltersGroup("Company Code");

			// Assert
			Then.onTheSmartFilterBarTypesPage.filtersGroupShouldHaveFilters("Company Code", 2);

			// Act
			When.onTheSmartFilterBarTypesPage.iExpandAdaptFiltersGroup("Business Area");

			// Assert
			Then.onTheSmartFilterBarTypesPage.filtersGroupShouldHaveFilters("Business Area", 2);

			// Cleanup
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.start();
	});
});