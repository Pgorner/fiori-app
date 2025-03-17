/* global QUnit */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/comp/qunit/smartfilterbar/opaTests/TextArrangement/_actions/SmartFilterBarActions",
	"sap/ui/comp/qunit/smartfilterbar/opaTests/TextArrangement/_assertions/SmartFilterBarAssertions",
	"test-resources/sap/ui/comp/testutils/opa/TestLibrary"
], function (
	Opa5,
	opaTest,
	SmartFilterBarActions,
	SmartFilterBarAssertions
) {
	"use strict";
	const sComponent = "__xmlview0--smartFilterBar-filterItemControlA_-",
		  aExpectedFieldsKeys = [
				sComponent + "STRING_SINGLE_TEXTONLY",
				sComponent + "STRING_MULTIPLE_TEXTONLY",
				sComponent + "STRING_SINGLE_TEXTSEPARATE",
				sComponent + "STRING_MULTIPLE_TEXTSEPARATE",
				sComponent + "STRING_SINGLE_TEXTFIRST",
				sComponent + "STRING_MULTIPLE_TEXTFIRST",
				sComponent + "STRING_SINGLE_TEXTLAST",
				sComponent + "STRING_MULTIPLE_TEXTLAST",
				sComponent + "STRING_SINGLE_DEFAULT",
				sComponent + "STRING_MULTIPLE_DEFAULT",
				sComponent + "STRING_SINGLE_TEXTONLY_FL",
				sComponent + "STRING_MULTIPLE_TEXTONLY_FL",
				sComponent + "STRING_SINGLE_DEFAULT_FL"
			];

	Opa5.extendConfig({
		viewName: "SmartFilterBar",
		viewNamespace: "sap.ui.comp.sample.smartfilterbar_textarrangement",
		autoWait: true,
		enabled: false,
		async: true,
		testLibs: {
			compTestLibrary: {
				appUrl: "test-resources/sap/ui/comp/qunit/smartfilterbar/opaTests/TextArrangement/applicationUnderTest/SmartFilterBar_TextArrangement.html"
			}
		},
		actions: SmartFilterBarActions,
		assertions: SmartFilterBarAssertions
	});

	QUnit.module("ValueHelpDialog");

	aExpectedFieldsKeys.slice(0,8).forEach(function (sControlId) {
		opaTest("Number of columns for " + sControlId + " field", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.iOpenTheVHD(sControlId);

			// Assert
			Then.iShouldSeeValueHelpDialogWithColumns(sControlId + "-valueHelpDialog", 1, ['Key', 'Desc']);

			// Act
			When.iPressTheVHDCancelButton();

			// Cleanup
			When.iPressTheRestoreButton();
		});
	});

	aExpectedFieldsKeys.slice(8,10).forEach(function (sControlId) {
		opaTest("Number of columns for " + sControlId + " field", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.iOpenTheVHD(sControlId);

			// Assert
			Then.iShouldSeeValueHelpDialogWithColumns(sControlId + "-valueHelpDialog", 2, ['Key', 'Desc']);

			// Act
			When.iPressTheVHDCancelButton();

			// Cleanup
			When.iPressTheRestoreButton();
		});
	});

	opaTest("LAST-The purpose of this test is to Cleanup after all the tests", function (Given) {
		Opa5.assert.ok(true); // We need one assertion

		// Cleanup
		Given.onTheCompTestLibrary.iStopMyApp();
	});

	QUnit.start();
});
