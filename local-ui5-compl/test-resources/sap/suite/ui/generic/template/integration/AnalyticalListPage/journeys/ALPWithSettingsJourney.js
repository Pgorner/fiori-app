/*global opaTest QUnit */
sap.ui.define(["sap/ui/test/opaQunit"], function () {

	"use strict";

	QUnit.module("AnalyticalListPage - ALPWithSettingsJourney");

	opaTest("Check if the Analytical List Page with Settings App is up", function (Given, When, Then) {
		Given.iStartMyAppInDemokit("analytics3");
		Then.onTheFilterBar.isFilterAppliedOnFilterBar("CompanyCode", "EASI");
		Then.onTheMainPage.iCheckControlPropertiesById("chart", { "visible": true, "noData": "To start, set the relevant filters and choose \"Go\"." });
		Then.onTheMainPage.iCheckControlPropertiesById("table", { "visible": true, "initialNoDataText": "To start, set the relevant filters and choose \"Go\"." });
		Then.onTheMainPage.iShouldSeeTheComponent("KPI", "sap.suite.ui.generic.template.AnalyticalListPage.control.SmartKpiTag");
		When.onTheFilterBar.iClickOnButtonWithText("Go");
		Then.onTheGenericAnalyticalListPage.iShouldSeeTheButtonWithIcon("sap-icon://excel-attachment");
		Then.onTheMainPage.iShouldSeeTheComponent("SmartChart", "sap.ui.comp.smartchart.SmartChart");
		Then.onTheMainPage.iShouldSeeTheComponent("SmartTable", "sap.ui.comp.smarttable.SmartTable");
		Then.onTheMainPage.iShouldSeeVariantControls();
	});

	opaTest("Check the Component of CF", function (Given, When, Then) {
		Then.onTheMainPage.iShouldSeeTheComponent("SmartFilterBarExt", "sap.suite.ui.generic.template.AnalyticalListPage.control.SmartFilterBarExt");
	});

	opaTest("Check the Visibility of CF and VF", function (Given, When, Then) {
		Then.onTheMainPage.iShouldSeeTheFilterVisibility();
	});

	opaTest("Check if the table is Analytical Table and navigation highlight works", function (Given, When, Then) {
		Then.onTheTable.iCheckControlPropertiesByControlType("sap.ui.table.AnalyticalTable", { "visible": true });
		When.onTheMainPage.iClickRowActionDetails();
		Then.onTheGenericObjectPage.theObjectPageHeaderTitleIsCorrect("EASIDEMO");
		Then.onTheMainPage.iShouldSeeTheNavigatedRowHighlightedInUITables(2, true, "analyticalTable");
		Then.onTheMainPage.iShouldSeeTheNavigatedRowHighlightedInUITables(4, false, "analyticalTable");
	});

	opaTest("Check for ShowDetails button", function (Given, When, Then) {
		When.onTheMainPage.iClickTheSegmentedButton("chart");
		Then.onTheMainPage.iShouldSeeTheComponent("Show Details", "sap.m.SelectionDetails");
	});

	opaTest("Check for absence of Filter Switch Button", function (Given, When, Then) {
		Then.onTheMainPage.iCheckForFilterSwitch();
	});
	opaTest("Check dialog Cancel button functionality when VF is hidden", function (Given, When, Then) {
		When.onTheFilterBar.iClickTheFilterButton();
		When.onTheGenericAnalyticalListPage.iClickTheButtonWithIcon("sap-icon://group-2");
		When.onTheMainPage.iEnterValueInField("June", "SmartFilterBar-filterItemControl_BASIC-FiscalMonth");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Cancel");
		Then.onTheFilterBar.isFilterNotAppliedOnFilterBar("FiscalMonth", "June");
	});

	opaTest("Check for Inline Action button", function (Given, When, Then) {
		When.onTheMainPage.iClickTheSegmentedButton("table");
		Then.onTheMainPage.iShouldSeeTheComponent("Inline", "sap.m.Button");
	});

	opaTest("Table Group By 'Company Code Crcy'", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickTheButtonWithId("table-btnPersonalisation");
		When.onTheTable.iClickTheControlByControlType("sap.m.IconTabFilter", { "text": "Group" });
		When.onTheGenericAnalyticalListPage
			.iClickTheButtonWithIcon("sap-icon://decline")
			.and
			.iClickTheButtonWithIcon("sap-icon://decline")
			.and
			.iClickTheButtonOnTheDialogWithLabel("OK");
		When.onTheTable.iClickOnColumnHeaderWithId("CompanyCodeCurrency");
		When.onTheTable.iSelectColumnMenuItem("Group");
		When.onTheGenericAnalyticalListPage.iChoosetheItemInComboBox("Company Code Crcy")
			.and
			.iClickTheButtonOnTheDialogWithLabel("OK");
		Then.onTheTable.iCheckGroupHeaderTitleOnTable("Company Code Crcy:", 1, "ZCOSTCENTERCOSTSQUERY0020--analyticalTable", "analyticalTable");
		Then.onTheMainPage.iCheckNumberOfItemsInTable(4, "analyticalTable", "analyticalTable");
	});

	opaTest("Table Ungroup 'Company Code Crcy'", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickTheButtonWithId("table-btnPersonalisation");
		When.onTheTable
			.iClickTheControlByControlType("sap.m.IconTabFilter", { "text": "Group" })
			.and
			.iClickTheButtonWithIcon("sap-icon://decline");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
		Then.onTheMainPage.iCheckNumberOfItemsInTable(4, "analyticalTable", "analyticalTable");
	});

	opaTest("Table Filter By 'Company Code Crcy' and check the Info toolbar", function (Given, When, Then) {
		Then.onTheTable.iCheckControlPropertiesById("table", { "Visible": true, "useInfoToolbar": "On" });
		When.onTheGenericAnalyticalListPage.iClickTheButtonWithId("table-btnPersonalisation");
		When.onTheTable.iClickTheControlByControlType("sap.m.IconTabFilter", { "text": "Filter" });
		When.onTheGenericAnalyticalListPage.iChoosetheItemInComboBox("Company Code Crcy");
		When.onTheTable
			.iEnterValueInField("EUR", "CompanyCodeCurrency")
			.and
			.iClickOnButtonWithText("OK");
		Then.onTheTable.iCheckInfoToolbarTextOnTheTable("1 table filter active: Company Code Crcy", "analyticalTable");
	});

	opaTest("Check Working of flexible column layout", function (Given, When, Then) {
		Then.onTheFilterBar.iCheckForSingleShareButton();
		When.onTheFilterBar.iClickOnButtonWithText("Go");
		When.onTheMainPage.iClickRowActionDetails();
		Then.onTheFilterBar.iCheckForSingleShareButton();
		When.onTheMainPage.iClickOnButtonWithTooltip("Close");
		Then.onTheFilterBar.iCheckForSingleShareButton();
	});

	opaTest("Check for table compact mode", function (Given, When, Then) {
		Then.onTheTable.iShouldSeeTheComponent("check table compact mode", "sap.ui.comp.smarttable.SmartTable", { styleClass: "sapUiSizeCompact" });
	});

	opaTest("Check value axis labels", function (Given, When, Then) {
		When.onTheMainPage.iClickTheSegmentedButton("chart");
		Then.onTheMainPage.iShouldSeeTheComponent("Actual Cost", "sap.m.Label");
		Then.onTheMainPage.iShouldSeeTheComponent("Margin(%)", "sap.m.Label");
	});
	opaTest("Check for kpi tag indicator for filterable KPIs", function (Given, When, Then) {
		Then.onTheMainPage.iCheckKpiIndicator(1, "Neutral");
		Then.onTheMainPage.iCheckKpiIndicator(2, "Error");
	});

	opaTest("Check for default PV missing error scenario in kpi tag", function (Given, When, Then) {
		Then.onTheMainPage.iCheckForHiddenKPI("ActualCost");
		Then.iTeardownMyApp();
	});
});