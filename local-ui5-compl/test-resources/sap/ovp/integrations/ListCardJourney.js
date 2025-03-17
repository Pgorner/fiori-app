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

	opaTest("Number of List Cards", function (Given, When, Then) {
		Then.iCheckForNumberOFCards("List", 8, "sap.m.List");
	});

	opaTest("List Card Header Title for Card Reorder Soon", function (Given, When, Then) {
		Then.iCheckCardText("Reorder Soon", "--ovpHeaderTitle", "Title");
	});

	opaTest("List Card Header SubTitle for Card Overall Contract Capacity", function (Given, When, Then) {
		Then.iCheckCardText("Per supplier and compared to last year", "--SubTitle-Text", "SubTitle");
	});

	opaTest("List Card Header Value Selection Info for Card Contract Monitoring", function (Given, When, Then) {
		Then.iCheckCardText("Total contract volume", "--ovpValueSelectionInfo", "Value Selection Info");
	});

	opaTest("List Card Header KPI Info for Card Contract Monitoring", function (Given, When, Then) {
		Then.iCheckCardKpiInfo("card009", "101.3K", "KPIValue");
	});

	opaTest("List Card Header KPI Info Colouring for Card Contract Monitoring", function (Given, When, Then) {
		Then.iCheckCardKpiInfo("card009", "Good", "KPIColour");
	});

	opaTest("List Card Header KPI Arrow Indicator Direction for Card Contract Monitoring", function (Given, When, Then) {
		Then.iCheckCardKpiInfo("card009", "Up", "KPIDirection");
	});

	opaTest("List Card Header Target Value for Card Contract Monitoring", function (Given, When, Then) {
		Then.iCheckCardTargetValue("card009", "85.0K");
	});

	opaTest("List Card Header Deviation Value for Card Contract Monitoring", function (Given, When, Then) {
		Then.iCheckCardDeviation("card009", "19.2%");
	});

	opaTest("List Card Header Count for Card Contract Monitoring", function (Given, When, Then) {
		Then.iCheckForCardHeaderCount("card009Original_Tab1--ovpCountHeader", "Contract Monitoring", "3 of 4")
	});

	opaTest("List Card Header Navigation for Card Reorder Soon", function (Given, When, Then) {
		When.iClickTheCardHeader("application-procurement-overview-component---card002Original--ovpCardHeader", false);
		Then.checkAppTitle("Sales Overview Page");
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

	opaTest("List Card Record Criticality for Card Extended List Card", function (Given, When, Then) {
		Then.iCheckCardCriticality("card001Original--ovpList-1-ObjectNumber", "1", "2,219", "Success", "sap.m.ObjectNumber");
		Then.iCheckCardCriticality("card001Original--ovpList-2-ObjectNumber", "2", "2,611", "Warning", "sap.m.ObjectNumber");
	});

	opaTest("Click on View Switch Dropdown for Card Contract Monitoring", function (Given, When, Then) {
		When.iClickOnViewSwitchinCard("application-procurement-overview-component---card009Original_Tab1--ovp_card_dropdown", "Contract Monitoring");
		When.iSetViewinViewSwitch("application-procurement-overview-component---card009Original_Tab1--2", "2");
		Then.iCheckCardKpiInfo("card009", "25.9K", "KPIValue");
	});

	opaTest("Filter List Data based on Filter Values", function (Given, When, Then) {
		When.iEnterValueInField('SAP', "application-procurement-overview-component---mainView--ovpGlobalFilter-filterItemControl_BASIC-SupplierName");
		When.iClickTheGoButton("application-procurement-overview-component---mainView--ovpGlobalFilter-btnGo");
		Then.iCheckCardKpiInfo("card009", "14.6K", "KPIValue");
		When.iClickOnViewSwitchinCard("application-procurement-overview-component---card009Original_Tab2--ovp_card_dropdown", "card009");
		When.iSetViewinViewSwitch("application-procurement-overview-component---card009Original_Tab2--1", "1");
		Then.iCheckCardKpiInfo("card009", "10.3K", "KPIValue");
	});

	opaTest("List Card List Item Navigation for Card Overall Contract Capacity", function (Given, When, Then) {
		When.iClickTheCardItem("card007Original--listItem", 2, "Overall Contract Capacity", "sap.m.CustomListItem");
		Then.checkAppTitle("Sales Overview Page");
		When.iClickBackButton();
		Then.checkAppTitle("Procurement Overview Page");

		Given.iTeardownMyApp();
	});

});
