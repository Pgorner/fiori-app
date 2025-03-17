/*global opaTest QUnit */
//ListCard Journey
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
		// Arrangements
		Given.iStartMyApp("browse-books");
		Then.checkAppTitle("Browse Books (V4)");
		When.iClickTheEnterKey("application-browse-books-component---mainView--ovpGlobalMacroFilter::FilterField::title");
	});

	/* ToDo : Find Root Cause for V2 cards not rendered in Jenkins */
	// opaTest("TC03 : Number of List Cards", function (Given, When, Then) {
	// 	Then.iCheckForNumberOFCards("List",10,"sap.m.List");
	// });

	opaTest("TC04 : List Card Header Title for V4 Card Extended List Card With Bar", function (Given, When, Then) {
		Then.iCheckCardText("Extended List Card With Bar", "card_01_v4Original_Tab1--ovpHeaderTitle", "Title");
	});

	opaTest("TC05 : List Card Header SubTitle for V4 Card Condensed List Card With Bar", function (Given, When, Then) {
		Then.iCheckCardText("List Card(V4) | EUR", "card_03_v4Original--SubTitle-Text", "SubTitle");
	});

	opaTest("TC06 : List Card Header Value Selection Info for V4 Card Condensed List Card Standard", function (Given, When, Then) {
		Then.iCheckCardText("Value Selection Info", "card_04_v4Original_Tab1--ovpValueSelectionInfo", "Value Selection Info");
	});

	opaTest("TC07 : List Card Header KPI Info for V4 Card Extended List Card Standard", function (Given, When, Then) {
		Then.iCheckCardKpiInfo("card_02_v4", "7.87K", "KPIValue");
	});

	opaTest("TC08 : List Card Header KPI Info Colouring for V4 Card Extended List Card With Bar", function (Given, When, Then) {
		Then.iCheckCardKpiInfo("card_01_v4", "Good", "KPIColour");
	});

	opaTest("TC09 : List Card Header KPI Arrow Indicator Direction for V4 Card Condensed List Card With Bar", function (Given, When, Then) {
		Then.iCheckCardKpiInfo("card_03_v4", "Up", "KPIDirection");
	});

	opaTest("TC10 : List Card Header Target Value for V4 Card Condensed List Card Standard", function (Given, When, Then) {
		Then.iCheckCardTargetValue("card_04_v4", "1.00K");
	});

	opaTest("TC11 : List Card Header Deviation Value for V4 Card Condensed List Card Standard", function (Given, When, Then) {
		Then.iCheckCardDeviation("card_04_v4", "686.60%");
	});

	opaTest("TC12 : List Card Header Count for V4 Card Extended List Card Standard", function (Given, When, Then) {
		Then.iCheckForCardHeaderCount("card_02_v4Original_Tab1--ovpCountHeader", "Extended List Card Standard", "3 of 11");
	});

	opaTest("TC13 : List Card Header Navigation for V4 Card Extended List Card With Bar", function (Given, When, Then) {
		When.iClickTheCardHeader("application-browse-books-component---card_01_v4Original_Tab1--ovpCardHeader", false);
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


	opaTest("TC15 : List Card Record Criticality for V4 Card Condensed List Card With Bar", function (Given, When, Then) {
		Then.iCheckCardCriticality("card_03_v4Original--ovpList-1", "1", "1K", "Warning", "sap.m.ObjectNumber");
		Then.iCheckCardCriticality("card_03_v4Original--ovpList-3", "3", "0K", "Success", "sap.m.ObjectNumber");
	});

	opaTest("TC16 : Click on View Switch Dropdown for V4 Card Extended List Card With Bar", function (Given, When, Then) {
		When.iClickOnViewSwitchinCard("application-browse-books-component---card_01_v4Original_Tab1--ovp_card_dropdown", "Extended List Card With Bar");
		When.iSetViewinViewSwitch("application-browse-books-component---card_01_v4Original_Tab1--3", "3");
		Then.iCheckForCardHeaderCount("card_01_v4Original_Tab3--ovpCountHeader", "Extended List Card Standard", "");
	});

	opaTest("TC17 : List Card List Item Navigation for V4 Card Extended List Card With Bar", function (Given, When, Then) {
		When.iClickTheCardItem("card_01_v4Original_Tab3--ovpList-0", 0, "Extended List Card With Bar", "sap.m.CustomListItem");
		Then.checkAppTitle("Procurement Overview Page");
		Then.iCheckIfFilterFieldIsPopulated("application-procurement-overview-component---mainView--ovpGlobalFilter-filterItemControlA_-ID", '=201');
		When.iClickBackButton();
		Then.checkAppTitle("Browse Books (V4)");
		Given.iTeardownMyApp();
	});

    opaTest("TC18 : Open app", function (Given, When, Then) {
		Given.iStartMyApp("browse-books");
		Then.checkAppTitle("Browse Books (V4)");
		When.iClickTheEnterKey("application-browse-books-component---mainView--ovpGlobalMacroFilter::FilterField::title");
	});

	opaTest("TC 19: Check if filter params are passed & populated correctly on forward navigation", function (Given, When, Then) {
		When.iClickOnViewSwitchinCard("application-browse-books-component---card_01_v4Original_Tab3--ovp_card_dropdown", "Extended List Card With Bar");
		When.iSetViewinViewSwitch("application-browse-books-component---card_01_v4Original_Tab3--1", "1");
		Then.iCheckForCardHeaderCount("card_01_v4Original_Tab1--ovpCountHeader", "Extended List Card Standard", "3 of 11");
        When.iEnterValueInField('252',"application-browse-books-component---mainView--ovpGlobalMacroFilter::FilterField::ID");
        When.iClickTheGoButton("application-browse-books-component---mainView--ovpGlobalMacroFilter-content-btnSearch");
		When.iClickTheCardHeader("application-browse-books-component---card_01_v4Original_Tab1--ovpCardHeader");
		Then.checkAppTitle("Procurement Overview Page");
		Then.iCheckIfFilterFieldIsPopulated("application-procurement-overview-component---mainView--ovpGlobalFilter-filterItemControlA_-ID", '=252');
		When.iClickBackButton();
		Given.iTeardownMyApp();
    });

	opaTest("TC20 : Open app", function (Given, When, Then) {
		Given.iStartMyApp("browse-books");
		Then.checkAppTitle("Browse Books (V4)");
		When.iClickTheEnterKey("application-browse-books-component---mainView--ovpGlobalMacroFilter::FilterField::title");
	});

	opaTest("TC21 : List Card Header Count for V4 Card Extended List Card Bar With Exclude filters being applied", function (Given, When, Then) {
		Then.iCheckForCardHeaderCount("card_01_v4_Exclude_FiltersOriginal--ovpCountHeader", "Extended List Card With Exclude Filters", "3 of 4");
		When.iClickTheCardHeader("application-browse-books-component---card_01_v4_Exclude_FiltersOriginal--ovpCardHeader", false);
		Then.checkAppTitle("Freestyle Inbound");
		Then.iCheckTheSelectionVariantPassedForFilter("ID", '[{"Sign":"E","Option":"EQ","Low":"207","High":null},{"Sign":"E","Option":"EQ","Low":"271","High":null},{"Sign":"E","Option":"BT","Low":"199","High":"203"},{"Sign":"I","Option":"GT","Low":"208","High":null},{"Sign":"I","Option":"LE","Low":"421","High":null},{"Sign":"I","Option":"GE","Low":"251","High":null},{"Sign":"I","Option":"LE","Low":"401","High":null}]');
		Then.iCheckTheSelectionVariantPassedForFilter("title", '[{"Sign":"E","Option":"CP","Low":"*The Raven*","High":null},{"Sign":"E","Option":"CP","Low":"Eleonora*","High":null}]');
		When.iClickBackButton();
		Then.checkAppTitle("Browse Books (V4)");

		Given.iTeardownMyApp();
	});

	opaTest("TC22 : Checking scenario's of percentage implementation for a list card in bar flavor", function (Given, When, Then) {
		Given.iStartMyApp("browse-books");
		Then.checkAppTitle("Browse Books (V4)");
		When.iClickTheEnterKey("application-browse-books-component---mainView--ovpGlobalMacroFilter::FilterField::title");
		Then.iCheckCardText("Extended List Card With Percentage", "card_showPercentage_v4Original--ovpHeaderTitle", "Title");
		Then.iCheckCardText("List Card(V4) | EUR", "card_showPercentage_v4Original--SubTitle-Text", "SubTitle");
		Then.iCheckCardKpiInfo("card_showPercentage_v4", "7.87K", "KPIValue");
		Then.iCheckCardKpiInfo("card_showPercentage_v4", "Good", "KPIColour");
		Then.iCheckForCardHeaderCount("card_showPercentage_v4Original--ovpCountHeader", "Extended List Card With Percentage", "3 of 11");
		Then.iCheckForNumberOfRecordsInCard("sap.m.CustomListItem", "card_showPercentage_v4Original--listItem", 3);
		Then.iCheckMicroChartData("application-browse-books-component---card_showPercentage_v4Original--BarChartDataPoint-application-browse-books-component---card_showPercentage_v4Original--ovpList-0", 25, "Critical");
		Then.iCheckMicroChartData("application-browse-books-component---card_showPercentage_v4Original--BarChartDataPoint-application-browse-books-component---card_showPercentage_v4Original--ovpList-1", 50, "Critical");
		Then.iCheckMicroChartData("application-browse-books-component---card_showPercentage_v4Original--BarChartDataPoint-application-browse-books-component---card_showPercentage_v4Original--ovpList-2", 100, "Error");
		Then.iCheckCardCriticality("card_showPercentage_v4Original--ovpList-0", "0", "25%", "None", "sap.m.ObjectNumber");
		Then.iCheckCardCriticality("card_showPercentage_v4Original--ovpList-1", "1", "50%", "None", "sap.m.ObjectNumber");
		Then.iCheckCardCriticality("card_showPercentage_v4Original--ovpList-2", "2", "100%", "None", "sap.m.ObjectNumber");

		Given.iTeardownMyApp();
	});
});