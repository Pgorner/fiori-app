/*global opaTest QUnit */
sap.ui.define(["sap/ui/test/opaQunit"], function () {

	"use strict";

	QUnit.module("AnalyticalListPage - ALPWithParamsSaveAsTileJourney");

	opaTest("Launch the Analytical List Page with Params and apply filters", function (Given, When, Then) {
		Given.iStartMyAppInSandbox("alpwp-display#alpwp-display?DisplayCurrency=USD");
		When.onTheMainPage.iWaitForThePageToLoad("AnalyticalListPage", "ZEPM_C_SALESORDERITEMQUERYResults");
		Then.onTheFilterBar.isParameterApplied("$Parameter.P_DisplayCurrency", "USD");
		When.onTheFilterBar.iClickInputValuehelp("CustomerCountry");
		When.onTheFilterBar.iSelectOperatorInVH("equal to")
		When.onTheFilterBar.iAddValueInValuehelp("AR");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
	});

	opaTest("Save the tile with two filters applied", function (Given, When, Then) {
		When.onTheMainPage.iClickShareIcon();
		When.onTheMainPage.iClickMenuItem("Save as Tile");
		Then.onTheGenericAnalyticalListPage.iShouldSeeTheDialogWithTitle("Save as Tile");
		When.onTheMainPage.iEnterValueInField("ALP Demo", "bookmarkTitleInput");
		When.onTheMainPage.iClickOnPagesMultiInputOnSaveAsTileDialog();
		When.onTheMainPage.iClickOnCheckboxWithText("", "SelectedNodesComboBox-ValueHelpDialog--ContentNodesTree-1-selectMulti");
		When.onTheMainPage.iClickTheButtonOnTheDialog("Apply");
		When.onTheFilterBar.iClickTheButtonOnTheDialog("Save");
	});

	opaTest("Open the created tile and check the filter count", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickOnItemFromTheShellNavigationMenu("Home");
		When.onTheMainPage.iClickTheControlByControlType("sap.m.GenericTile", { "visible": true, "header": "ALP Demo" });
		Then.onTheMainPage.iCheckFilterCountInOverflowToolbar("2");
		Then.iTeardownMyApp();
	});
});
