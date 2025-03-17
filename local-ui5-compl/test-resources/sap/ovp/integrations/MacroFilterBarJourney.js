/* global QUnit */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"test-resources/sap/ovp/integrations/pages/CommonArrangements",
	"test-resources/sap/ovp/integrations/pages/CommonActions",
	"test-resources/sap/ovp/integrations/pages/CommonAssertions",
], function (
	Opa5,
	opaTest,
	CommonArrangements,
	CommonActions,
	CommonAssertions
) {
	"use strict";

	Opa5.extendConfig({
		arrangements: new CommonArrangements(),
		actions: new CommonActions(),
		assertions: new CommonAssertions(),
		autoWait: true,
		viewNamespace: "view."
	});

	var sGoButtonId = "application-browse-books-component---mainView--ovpGlobalMacroFilter-content-btnSearch";
	var sButtonName = "Go Button";
	var sControlType = "sap.m.Button";

	opaTest("#0: Open App", function (Given, When, Then) {
		Given.iStartMyApp("browse-books");
		Then.checkAppTitle("Browse Books (V4)");
		When.iClickTheEnterKey("application-browse-books-component---mainView--ovpGlobalMacroFilter::FilterField::title");
	});
	opaTest("#1 Check for Macro Filter Bar Loaded", function (Given, When, Then) {
		Then.iCheckControlWithIdExists("application-browse-books-component---mainView--ovpGlobalMacroFilter-content");
	});
	opaTest("#2 Check for Go button to be disabled when live mode is enabled", function (Given, When, Then) {
		Then.iCheckIdNotExists(sGoButtonId, sButtonName, sControlType);
	});
	opaTest("#3 Check for Cards are loaded on launch of app in live mode", function (Given, When, Then) {
		Then.iCheckCardText("Extended List Card With Bar","--ovpHeaderTitle","Title");
		Given.iTeardownMyApp();
	});
	opaTest("#4: The Macro filter bar should work when filter is applied and GO button is clicked", function (Given, When, Then) {
		Given.iStartMyApp("books-overview");
		Then.checkAppTitle("Books App V4");
		Then.iCheckControlWithIdExists("application-books-overview-component---mainView--ovpGlobalMacroFilter-content");
		When.iEnterValueInField('=201',"application-books-overview-component---mainView--ovpGlobalMacroFilter::FilterField::ID");
        When.iClickTheGoButton("application-books-overview-component---mainView--ovpGlobalMacroFilter-content-btnSearch");
		Then.iCheckForNumberOFCards("List", 2, "sap.m.List");
		Then.iCheckForNumberOfRecordsInCard("sap.m.CustomListItem", "card_01_v4Original--listItem", 1);
		Then.iCheckForNumberOfRecordsInCard("sap.m.ObjectListItem", "card_02_v4Original--listItem", 1);
		Given.iTeardownMyApp();
	});
});