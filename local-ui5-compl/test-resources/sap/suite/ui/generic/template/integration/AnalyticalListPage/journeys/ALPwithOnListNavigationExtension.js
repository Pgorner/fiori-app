/*global opaTest QUnit */
sap.ui.define(["sap/ui/test/opaQunit"], function () {

	"use strict";

	QUnit.module("AnalyticalListPage - OnListNavigationExtension");

	opaTest("Check visual indication for the navigated item with onListNavigationExtension - ALP", function (Given, When, Then) {
		Given.iStartMyAppInDemokit("analytics2", "manifestWithCanvas");
		When.onTheVisualFilterDialog.iAddFilterValueInCompactDialog("Cost Element", "400020");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
		When.onTheFilterBar.iClickOnButtonWithText("Go");
		When.onTheMainPage.iClickRowActionDetails(0);
		When.onTheGenericAnalyticalListPage.iClickTheButtonHavingLabel("Back to ALP");
		Then.onTheMainPage.iShouldSeeTheNavigatedRowHighlightedInUITables(0, true, "analyticalTable");
		Then.iTeardownMyApp();
	});
});
