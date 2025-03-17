/*global QUnit */
// TableCardJourneys
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit", //Don't move this item up or down, this will break everything!
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
		viewNamespace: "view.",
	});

	opaTest("TC01 : Open app", function (Given, When, Then) {
		Given.iStartMyApp("browse-books");
		Then.checkAppTitle("Browse Books (V4)");
		When.iClickTheEnterKey("application-browse-books-component---mainView--ovpGlobalMacroFilter::FilterField::title");
	});


	/* ToDo : Find Root Cause for V2 cards not rendered in Jenkins */
	// opaTest("TC03 : Number of Table Cards", function (Given, When, Then) {
	// 	Then.iCheckForNumberOFCards("Table",4,"sap.m.Table");
	// });

	opaTest("TC04 : Table Card Header Title for Card TableCard with View Switch", function (Given, When, Then) {
		Then.iCheckCardText("TableCard with View Switch", "--ovpHeaderTitle", "Title");
	});

	opaTest("TC05 : Table Card Header SubTitle for Card Custom Table Card", function (Given, When, Then) {
		Then.iCheckCardText("Extension for V4 | EUR", "--SubTitle-Text", "SubTitle");
	});

	opaTest("TC06 : Table Card Header Value Selection Info for Card TableCard with View Switch", function (Given, When, Then) {
		Then.iCheckCardText("Value Selection Info", "--ovpValueSelectionInfo", "Value Selection Info");
	});

	opaTest("TC07 : Table Card Header KPI Value for Card TableCard with View Switch", function (Given, When, Then) {
		Then.iCheckCardKpiInfo("card_05_v4", "7.87K", "KPIValue");
	});

	opaTest("TC08 : Table Card Header KPI Info Colouring for Card TableCard with View Switch", function (Given, When, Then) {
		Then.iCheckCardKpiInfo("card_05_v4", "Good", "KPIColour");
	});

	opaTest("TC09 : Table Card Header KPI Arrow Indicator Direction for Card TableCard with View Switch", function (Given, When, Then) {
		Then.iCheckCardKpiInfo("card_05_v4", "Up", "KPIDirection");
	});

	opaTest("TC10 : Table Card Header Target Value for Card TableCard with View Switch", function (Given, When, Then) {
		Then.iCheckCardTargetValue("card_05_v4", "1.00K");
	});

	opaTest("TC11 : Table Card Header Deviation Value for Card TableCard with View Switch", function (Given, When, Then) {
		Then.iCheckCardDeviation("card_05_v4", "686.60%");
	});

	opaTest("TC12 : Table Card Header Count for Card TableCard with View Switch", function (Given, When, Then) {
	    Then.iCheckForCardHeaderCount("card_05_v4Original_Tab1--ovpCountHeader","TableCard with View Switch","5 of 11")
	});  

	opaTest("TC13 : Table Card Header Navigation for Card TableCard with View Switch", function (Given, When, Then) {
		When.iClickTheCardHeader("application-browse-books-component---card_05_v4Original_Tab1--ovpCardHeader");
		Then.checkAppTitle("Procurement Overview Page");
		When.iClickBackButton();
		Then.checkAppTitle("Browse Books (V4)");

		Given.iTeardownMyApp();
	});

	opaTest("TC14 : Open app", function (Given, When, Then) {
		Given.iStartMyApp("browse-books");
		Then.checkAppTitle("Browse Books (V4)");
		When.iClickTheEnterKey("application-browse-books-component---mainView--ovpGlobalMacroFilter::FilterField::title");
	});

	opaTest("TC15 : Table Card Record Criticality for Card TableCard with View Switch", function (Given, When, Then) {
		Then.iCheckCardCriticality("card_05_v4Original_Tab1--ovpTable-0", "1", "", "Error", "sap.m.ObjectNumber");
		Then.iCheckCardCriticality("card_05_v4Original_Tab1--ovpTable-1", "2", "1K", "Warning", "sap.m.ObjectNumber");
	});

	opaTest("TC16 : Filter Table Data based on Filter Values", function (Given, When, Then) {
		When.iClickTheEnterKey("application-browse-books-component---mainView--ovpGlobalMacroFilter::FilterField::ID-inner", '201');
		When.iClickTheEnterKey("application-browse-books-component---mainView--ovpGlobalMacroFilter::FilterField::title");
		Then.iCheckCardKpiInfo("card_05_v4", "122.00", "KPIValue");
		Given.iTeardownMyApp();
	});

	/*  Commented as of now due to Issue 2380072460 */
	/*  opaTest("TC17 : Table Card Record Item Navigation for Card TableCard with View Switch", function (Given, When, Then) {
		When.iClickTheCardItem("card_05_v4Original--tableItem", 2, "TableCard with View Switch","sap.m.ColumnListItem");
		Then.checkAppTitle("Procurement Overview Page");
		When.iClickBackButton();
		Then.checkAppTitle("Browse Books (V4)");

		Given.iTeardownMyApp();
	}); */

});
