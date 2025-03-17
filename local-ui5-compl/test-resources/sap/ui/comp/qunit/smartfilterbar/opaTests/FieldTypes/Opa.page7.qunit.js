/* global QUnit */
sap.ui.define([
    "sap/ui/core/Lib",
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
    "test-resources/sap/ui/comp/testutils/opa/TestLibrary"
], function (
    Library,
	Opa5,
	opaTest
) {
	"use strict";

    const oRB = Library.getResourceBundleFor("sap.ui.comp"),
		oCoreRB = Library.getResourceBundleFor("sap.ui.core"),
		sLongText = "x".repeat(1001);


	Opa5.extendConfig({
		viewName: "SmartFilterBar",
		viewNamespace: "sap.ui.comp.sample.smartfilterbar_types",
		autoWait: true,
		enabled: false,
		async: true,
		testLibs: {
			compTestLibrary: {
				appUrl: "test-resources/sap/ui/comp/qunit/smartfilterbar/opaTests/FieldTypes/applicationUnderTest/SmartFilterBar_Types.html"
			}
		}
	});

	sap.ui.require([
		"sap/ui/comp/qunit/smartfilterbar/opaTests/FieldTypes/pages/SmartFilterBarTypes"
	], function () {
        QUnit.module("Booleans");

		opaTest("Boolean Single field should have meaningful text for not selected option" , function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theSelectShouldHaveSelectedItemWithKeyAndText("", oRB.getText("NO_BOOLEAN_VALUE_SELECTED"), false);

			// Cleanup
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("Boolean Single field should have meaningful text for not selected option" , function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

            // Act
            When.onTheSmartFilterBarTypesPage.iOpenTheVHD("__xmlview0--smartFilterBar-filterItemControlA_-BOOL_AUTO");

			// Assert
			Then.onTheSmartFilterBarTypesPage.theSelectShouldHaveSelectedItemWithKeyAndText(0, oRB.getText("NO_BOOLEAN_VALUE_SELECTED"), true);

			// Cleanup
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("Mandatory field without value should be always visible", function(Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheSmartFilterBarTypesPage.iOpenTheAdaptFiltersDialog();
			When.onTheSmartFilterBarTypesPage.iSwitchAdaptFiltersToGroupView();
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("__xmlview0--smartFilterBar-filterItemControlA_-_Parameter.P_Bukrs", "");

			When.onTheSmartFilterBarTypesPage.iSelectFilter("BUKRS", false);

			// Assert
			Then.onTheSmartFilterBarTypesPage.iCheckFilterIsSelected("BUKRS", true);

			// Cleanup
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("ValueHelpDialog should be opened when openValueHelpRequestForFilterItem is called", function(Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			var sControlId = "__xmlview0--smartFilterBar-filterItemControlA_-STRING_AUTO";

			// Act
			When.onTheSmartFilterBarTypesPage.iOpenValueHelpRequestForFilterItem("STRING_AUTO", "__xmlview0--smartFilterBar");

			// Assert
			Then.onTheSmartFilterBarTypesPage.iShouldSeeValueHelpDialog(sControlId + "-valueHelpDialog", "", 8);

			// Cleanup
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.module("BasicSearch");

		opaTest("BasicSearch should show error when more than 1000 characters are added", function(Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("__xmlview0--smartFilterBar-btnBasicSearch", sLongText);

			// Assert
			Then.onTheSmartFilterBarTypesPage.theErrorDialogIsOpen();

			// Act
			When.onTheSmartFilterBarTypesPage.iPressTheErrorDialogCloseButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.iShouldSeeFilterWithValueState("__xmlview0--smartFilterBar-btnBasicSearch", "Error");
			Then.onTheSmartFilterBarTypesPage.iShouldSeeFilterWithValueStateText("__xmlview0--smartFilterBar-btnBasicSearch", oCoreRB.getText("EnterTextMaxLength", [1000]));

			// Cleanup
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("BasicSearch inside VHD should show error when more than 1000 characters are added", function(Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheSmartFilterBarTypesPage.iOpenTheVHD("__xmlview0--smartFilterBar-filterItemControlA_-STRING_INOUT");
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("__xmlview0--smartFilterBar-filterItemControlA_-STRING_INOUT-valueHelpDialog-smartFilterBar-btnBasicSearch", sLongText);

			// Assert
			Then.onTheSmartFilterBarTypesPage.iShouldSeeFilterWithValueState("__xmlview0--smartFilterBar-filterItemControlA_-STRING_INOUT-valueHelpDialog-smartFilterBar-btnBasicSearch", "Error");
			Then.onTheSmartFilterBarTypesPage.iShouldSeeFilterWithValueStateText("__xmlview0--smartFilterBar-filterItemControlA_-STRING_INOUT-valueHelpDialog-smartFilterBar-btnBasicSearch", oCoreRB.getText("EnterTextMaxLength", [1000]));

			// Cleanup
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("BasicSearch inside VHD should show error on initial opening of VHD when value is taken from the input field", function(Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("__xmlview0--smartFilterBar-filterItemControlA_-STRING_INOUT", sLongText, undefined, true);
			When.onTheSmartFilterBarTypesPage.iOpenTheVHD("__xmlview0--smartFilterBar-filterItemControlA_-STRING_INOUT");

			// Assert
			Then.onTheSmartFilterBarTypesPage.iShouldSeeFilterWithValueState("__xmlview0--smartFilterBar-filterItemControlA_-STRING_INOUT-valueHelpDialog-smartFilterBar-btnBasicSearch", "Error");
			Then.onTheSmartFilterBarTypesPage.iShouldSeeFilterWithValueStateText("__xmlview0--smartFilterBar-filterItemControlA_-STRING_INOUT-valueHelpDialog-smartFilterBar-btnBasicSearch", oCoreRB.getText("EnterTextMaxLength", [1000]));

			// Cleanup
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.start();
	});
});