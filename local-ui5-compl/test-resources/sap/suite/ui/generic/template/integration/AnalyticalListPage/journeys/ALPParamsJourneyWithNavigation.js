/*global opaTest QUnit */
sap.ui.define(["sap/ui/test/opaQunit"], function () {

	"use strict";

	QUnit.module("AnalyticalListPage - ALPWithParamsJourneyWithNavigation");

	opaTest("Check if the Analytical List Page with Params App is up", function (Given, When, Then) {
		Given.iStartMyAppInSandbox("alpWithTreeTable-display,SalesOrder-nondraft,alpWithSettings-display,alpWithExtensions-display,alpwp-display#alpwp-display?DisplayCurrency=USD");
		When.onTheMainPage.iWaitForThePageToLoad("AnalyticalListPage", "ZEPM_C_SALESORDERITEMQUERYResults");
		Then.onTheFilterBar.isParameterApplied("$Parameter.P_DisplayCurrency", "USD");
		Then.onTheMainPage.iShouldSeeTheComponent("KPI", "sap.suite.ui.generic.template.AnalyticalListPage.control.SmartKpiTag");
		When.onTheMainPage.iClickTheSegmentedButton("chart");
		Then.onTheMainPage.iShouldSeeTheComponent("SmartChart", "sap.ui.comp.smartchart.SmartChart");
		When.onTheMainPage.iClickTheSegmentedButton("table");
		Then.onTheMainPage.iShouldSeeTheComponent("SmartTable", "sap.ui.comp.smarttable.SmartTable");
		Then.onTheMainPage.iShouldSeeVariantControls();
	});

	opaTest("Check Objectpage fullscreen external navigation from KPIHeader", function (Given, When, Then) {
		When.onTheMainPage.iClickTheControlByControlType("sap.m.GenericTag", { "qualifier": "NetAmount22" });
		Then.onTheMainPage.iCheckOpenKPICard();
		When.onTheMainPage.iClickKPIHeader();
		Then.onTheGenericAnalyticalListPage.iSeeShellHeaderWithTitle("Title");
		When.onTheGenericAnalyticalListPage.iClickTheBackButtonOnFLP();
	});

	opaTest("Check navigation from KPI constructed using UI.KPI", function (Given, When, Then) {
		When.onTheMainPage.iClickFilterBarHeader();
		When.onTheMainPage.iClickTheControlByControlType("sap.m.GenericTag", { "qualifier": "ActualCosts2" });
		When.onTheMainPage.iClickKPIHeader();
		Then.onTheGenericAnalyticalListPage.iSeeShellHeaderWithTitle("Analytical List Page");
		When.onTheGenericAnalyticalListPage.iClickTheBackButtonOnFLP();
		Then.onTheGenericAnalyticalListPage.iSeeShellHeaderWithTitle("Analytical List Page with Parameter");
	});

	opaTest("Check row actions", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iNavigateFromListItemByLineNo(0);
		Then.onTheGenericAnalyticalListPage.iSeeShellHeaderWithTitle("Analytical List Page With Settings");
		When.onTheGenericAnalyticalListPage.iClickTheBackButtonOnFLP();
		Then.onTheGenericAnalyticalListPage.iSeeShellHeaderWithTitle("Analytical List Page with Parameter");
		When.onTheFilterBar.iClickInputValuehelp("CustomerCountry");
		When.onTheFilterBar.iSelectOperatorInVH("equal to")
		When.onTheFilterBar.iAddValueInValuehelp("AR");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
	});

	opaTest("Check for Navigation from Table Column - DataFieldWithIBN", function (Given, When, Then) {
		When.onTheMainPage.iClickTheSegmentedButton("table");
		Then.onTheTable.iCheckTableColumnVisibility("Customer Country (IBN)", true, "ZEPM_C_SALESORDERITEMQUERYResults--responsiveTable");
		When.onTheGenericAnalyticalListPage.iClickTheLink("AR");
		Then.onTheGenericAnalyticalListPage.iSeeShellHeaderWithTitle("Analytical List Page Tree Table");
		When.onTheGenericAnalyticalListPage.iClickTheBackButtonOnFLP();
		Then.onTheGenericAnalyticalListPage.iSeeShellHeaderWithTitle("Analytical List Page with Parameter");
	});

	opaTest("Check for Navigation from Sticky Table Toolbar - DataFieldForIBN", function (Given, When, Then) {
		When.onTheMainPage.iClickTheSegmentedButton("table");
		When.onTheTable.iSelectRowInTable();
		When.onTheGenericAnalyticalListPage.iClickTheButtonHavingLabel("SalesOrder Non Draft");
		When.onTheMainPage.iWaitForThePageToLoad("ListReport", "STTA_C_SO_SalesOrder_ND");
		Then.onTheGenericAnalyticalListPage.iSeeShellHeaderWithTitle("Sales Order Non Draft");
		When.onTheGenericAnalyticalListPage.iClickTheBackButtonOnFLP();
		Then.onTheGenericAnalyticalListPage.iSeeShellHeaderWithTitle("Analytical List Page with Parameter");
	});

	opaTest("Check for Navigation from Sticky Table Toolbar - Determining DataFieldForIBN", function (Given, When, Then) {
		When.onTheMainPage.iClickTheSegmentedButton("table");
		When.onTheTable.iSelectRowInTable();
		When.onTheGenericAnalyticalListPage.iClickTheButtonHavingLabel("NavigateToALP");
		Then.onTheGenericAnalyticalListPage.iSeeShellHeaderWithTitle("Analytical List Page With Settings");
		Then.onTheFilterBar.isFilterAppliedOnFilterBar("WBSElement", "BLUE PRINT VALIDATION");
		Then.onTheFilterBar.isFilterAppliedOnFilterBar("CompanyCode", "SAP");
		Then.onTheFilterBar.isFilterNotAppliedOnFilterBar("CompanyCode", "EASI");
		When.onTheGenericAnalyticalListPage.iClickTheBackButtonOnFLP();
		Then.onTheGenericAnalyticalListPage.iSeeShellHeaderWithTitle("Analytical List Page with Parameter");
	});

	opaTest("Check KPI chart selection when KPI card has no target defined", function (Given, When, Then) {
		When.onTheMainPage.iWaitForThePageToLoad("AnalyticalListPage", "ZEPM_C_SALESORDERITEMQUERYResults");
		When.onTheMainPage.iClickTheControlByControlType("sap.m.GenericTag", { "qualifier": "NetAmount1" });
		When.onTheMainPage.iSelectKPIChart();
		Then.onTheMainPage.iCheckOpenKPICard();
	});

	opaTest("Check KPI Card opening and navigation from KPI Card", function (Given, When, Then) {
		When.onTheMainPage.iClickTheSegmentedButton("compact");
		When.onTheMainPage.iClickTheControlByControlType("sap.m.GenericTag", { "qualifier": "ActualCosts2" });
		When.onTheMainPage.iSelectKPIChart();
		Then.onTheFilterBar.isFilterNotAppliedOnFilterBar("DisplayCurrency", "EUR");
		Then.onTheFilterBar.isFilterNotAppliedOnFilterBar("CustomerCountry", "AR");
		Then.onTheFilterBar.isFilterNotAppliedOnFilterBar("CustomerCountryName", "Argentina");
		When.onTheGenericAnalyticalListPage.iClickOnItemFromTheShellNavigationMenu("Home");
		When.onTheMainPage.iClickTheControlByControlType("sap.m.GenericTile", { "visible": true, "header": "Analytical List Page with Parameter" });
		Then.onTheFilterBar.isFilterNotAppliedOnFilterBar("CustomerCountry", "US");
		Then.iTeardownMyApp();
	});

	opaTest("Check if app-state works as expected with Semantic Dates", function (Given, When, Then) {
		Given.iStartMyAppInSandbox("alpWithSettings-display,alpwp-display#alpwp-display?DisplayCurrency=USD");
		When.onTheFilterBar.iClickInputValuehelp("CreationDateTime");
		Then.onTheFilterBar.iCheckTheItemsInDateRangePopOverList(35, "CreationDateTime-RP-popover");
		When.onTheFilterBar.iSetTheDynamicDateRangeValue("SmartFilterBar-filterItemControl_BASIC-CreationDateTime", new Date("Jan 1, 2020"));
		When.onTheMainPage.iClickTheControlByControlType("sap.m.GenericTag", { "qualifier": "NetAmount22" });
		When.onTheMainPage.iClickKPIHeader();
		When.onTheGenericAnalyticalListPage.iClickTheBackButtonOnFLP();
		Then.onTheMainPage.iCheckFilterCountInOverflowToolbar("2");
		Then.iTeardownMyApp();
	});
});
