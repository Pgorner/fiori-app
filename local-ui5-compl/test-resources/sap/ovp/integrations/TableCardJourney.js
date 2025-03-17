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

	opaTest("Open app", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyApp("procurement-overview");
		Then.checkAppTitle("Procurement Overview Page");
	});

	opaTest("Click on search", function (Given, When, Then) {
		When.iEnterValueInField('EUR', "application-procurement-overview-component---mainView--ovpGlobalFilter-filterItemControlA_-_Parameter.P_DisplayCurrency");
		When.iEnterValueInField('', "application-procurement-overview-component---mainView--ovpGlobalFilter-filterItemControl_BASIC-DeliveryDate");
		When.iClickTheGoButton("application-procurement-overview-component---mainView--ovpGlobalFilter-btnGo");
	});

    opaTest("Number of Table Cards", function (Given, When, Then) {
		Then.iCheckForNumberOFCards("Table", 4, "sap.m.Table");
	});

	opaTest("Table Card Header Title for Card New Purchase Orders", function (Given, When, Then) {
		Then.iCheckCardText("New Purchase Orders", "--ovpHeaderTitle", "Title");
	});

	opaTest("Table Card Header SubTitle for Card New Contracts", function (Given, When, Then) {
		Then.iCheckCardText("Created in the last three months", "--SubTitle-Text", "SubTitle");
	});

	opaTest("Table Card Header Value Selection Info for Card Purchase Forecast", function (Given, When, Then) {
		Then.iCheckCardText("Next 6 months", "--ovpValueSelectionInfo", "Value Selection Info");
	});

	opaTest("Table Card Header KPI Value for Card Purchase Forecast", function (Given, When, Then) {
		Then.iCheckCardKpiInfo("card012", "21.7K", "KPIValue");
	});

	opaTest("Table Card Header KPI Info Colouring for Card Purchase Forecast", function (Given, When, Then) {
		Then.iCheckCardKpiInfo("card012", "Good", "KPIColour");
	});

	opaTest("Table Card Header KPI Arrow Indicator Direction for Card Purchase Forecast", function (Given, When, Then) {
		Then.iCheckCardKpiInfo("card012", "Down", "KPIDirection");
	});

	opaTest("Table Card Header Target Value for Card Purchase Forecast", function (Given, When, Then) {
		Then.iCheckCardTargetValue("card012", "85.0K");
	});

	opaTest("Table Card Header Deviation Value for Card Purchase Forecast", function (Given, When, Then) {
		Then.iCheckCardDeviation("card012", "-74.4%");
	});

	opaTest("Table Card Header Count for Card Purchase Forecast", function (Given, When, Then) {
		Then.iCheckForCardHeaderCount("card012Original_Tab1--ovpCountHeader", "Purchase Forecast", "6 of 9")
	});

	opaTest("Table Card Header Navigation for Card New Purchase Orders", function (Given, When, Then) {
		When.iClickTheCardHeader("application-procurement-overview-component---card011Original--ovpCardHeader");
		Then.checkAppTitle("Freestyle Inbound");
		When.iClickBackButton();
		Then.checkAppTitle("Procurement Overview Page");

		Given.iTeardownMyApp();
	});

	opaTest("Open app", function (Given, When, Then) {
		Given.iStartMyApp("procurement-overview");
		Then.checkAppTitle("Procurement Overview Page");
	});

    opaTest("Click on search", function (Given, When, Then) {
		When.iEnterValueInField('', "application-procurement-overview-component---mainView--ovpGlobalFilter-filterItemControl_BASIC-DeliveryDate");
		When.iClickTheGoButton("application-procurement-overview-component---mainView--ovpGlobalFilter-btnGo");
	});

	opaTest("Table Card Record Criticality for Card New Purchase Orders", function (Given, When, Then) {
		Then.iCheckCardCriticality("ovpTable-1", "1", "Rejected", "Error", "sap.m.ObjectStatus");
		Then.iCheckCardCriticality("ovpTable-2", "2", "Approved", "Success", "sap.m.ObjectStatus");
	});

	opaTest("Filter Table Data based on Filter Values", function (Given, When, Then) {
		When.iEnterValueInField('SAP', "application-procurement-overview-component---mainView--ovpGlobalFilter-filterItemControl_BASIC-SupplierName");
		When.iClickTheGoButton("application-procurement-overview-component---mainView--ovpGlobalFilter-btnGo");
		Then.iCheckCardKpiInfo("card012", "12.3K", "KPIValue");
	});

	opaTest("Click on View Switch Dropdown for Card Purchase Forecast", function (Given, When, Then) {
		When.iClickOnViewSwitchinCard("application-procurement-overview-component---card012Original_Tab1--ovp_card_dropdown", "Purchase Forecast");
		When.iSetViewinViewSwitch("application-procurement-overview-component---card012Original_Tab1--2", "2");
		Then.iCheckCardKpiInfo("card012", "14.6K", "KPIValue");
		When.iClickTheGoButton("application-procurement-overview-component---mainView--ovpGlobalFilter-btnGo");
		Then.iCheckCardKpiInfo("card012", "12.3K", "KPIValue");
	});

	opaTest("Table Card Record Item Navigation for Card New Contracts", function (Given, When, Then) {
		When.iClickTheCardItem("card003Original--tableItem", 2, "New Contracts", "sap.m.ColumnListItem");
		Then.checkAppTitle("Sales Overview Page");
		When.iClickBackButton();
		Then.checkAppTitle("Procurement Overview Page");

		Given.iTeardownMyApp();
	});

});
