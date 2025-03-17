/*global opaTest QUnit */
sap.ui.define(["sap/ui/test/opaQunit"], function () {

	"use strict";

	QUnit.module("AnalyticalListPage - SmartTableJourney");

	opaTest("Check if the table have all the defined buttons", function (Given, When, Then) {
		Given.iStartMyAppInDemokit("analytics2");
		When.onTheVisualFilterDialog.iAddFilterValueInCompactDialog("Cost Element", "400020");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
		When.onTheFilterBar.iClickOnButtonWithText("Go");
		Then.onTheTable.iCheckTableToolbarControlProperty({ "ActionA_standard": [true, true, "Standard"], "ActionB_requiresSelection": [true, false, "Requires Selection"], "ActionD_common": [true, true, "Common"], "ActionE_tableOnly": [true, true, "Table Only"] }, "ZCOSTCENTERCOSTSQUERY0020--analyticalTable", "analyticalTable");
		Then.onTheTable.iCheckAbsenceOfActionButton("Standard", "chart", true);
		Then.onTheTable.iCheckAbsenceOfActionButton("Requires Selection", "chart");
		Then.onTheTable.iCheckAbsenceOfActionButton("Common", "chart");
		Then.onTheTable.iCheckAbsenceOfActionButton("Table Only", "chart");
	});

	opaTest("Check if the table is AnalyticalTable", function (Given, When, Then) {
		Then.onTheTable.iCheckControlPropertiesByControlType("sap.ui.table.AnalyticalTable", { "visible": true });
	});

	opaTest("Check if the table have defined extended column", function (Given, When, Then) {
		Then.onTheTable.iShouldSeeTheComponent("extended column", "sap.ui.table.AnalyticalColumn", { id: "extCol" }, undefined, "analytics2", "sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage", "ZCOSTCENTERCOSTSQUERY0020");
	});

	opaTest("Check if Both Rating and Progress Indicator are shown in one column", function (Given, When, Then) {
		Then.onTheTable.iCheckIndicatorControlsInAColumn("VisualizationGroup");
	});

	opaTest("Check for condensed mode", function (Given, When, Then) {
		Then.onTheTable.iShouldSeeTheComponent("check condensed mode", "sap.ui.comp.smarttable.SmartTable", { styleClass: "sapUiSizeCondensed" }, undefined, "analytics2", "sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage", "ZCOSTCENTERCOSTSQUERY0020");
	});
	opaTest("Check table grouping before chart selection", function (Given, When, Then) {
		Then.onTheTable.iCheckGroupHeaderTitleOnTable(null, 1, "ZCOSTCENTERCOSTSQUERY0020--analyticalTable", "analyticalTable");
	});
	opaTest("Add filters to CostElement and prepare for chart selection", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact")
			.and
			.iSetTheFilter({Field: "DisplayCurrency", Value: "USD"})
			.and
			.iClickOnFilterSwitchButton("visual");
		When.onTheFilterBar.iClickTheValueHelp("sap-icon://value-help", "CostElement");
		When.onTheFilterBar.iClickOnButtonWithText("Go", true);
		Then.onTheFilterBar.iSearchForItemsTable();
		When.onTheFilterBar.iMakeSelection([6,7]);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		When.onTheFilterBar.iClickOnButtonWithText("Go");
	});

	opaTest("Check row actions", function (Given, When, Then) {
		Then.onTheMainPage.iShouldSeeTheComponent("rowActions", "sap.ui.table.RowAction");
	});

	opaTest("Check enablement of RequiresSelection breakout action button", function (Given, When, Then) {
		When.onTheTable.iSelectARow();
		Then.onTheTable.iCheckTableToolbarControlProperty({ "ActionB_requiresSelection": [true, true, "Requires Selection"] }, "ZCOSTCENTERCOSTSQUERY0020--analyticalTable", "analyticalTable");
	});

	opaTest("Apply AnalyticalTable Column Filter", function (Given, When, Then) {
		When.onTheTable.iClickOnColumnHeaderWithId("DisplayCurrency")
			.and
			.iSelectColumnMenuItem("Filter")
			.and
			.iEnterFilterValue("EUR");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
		Then.onTheMainPage.iCheckNumberOfItemsInTable(18, "analyticalTable", "analyticalTable");
	});

	opaTest("Check quick view Contact card", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickTheLink("OXFORD");
		Then.onTheTable.iShouldSeeTheComponent("ContactCard", "sap.m.Popover");
		Then.onTheTable.iCheckTheQuickViewContactCard(["E-Mail", "Phone", "Fax"]);
		When.onTheMainPage.iClickFilterBarHeader();
		Then.iTeardownMyApp();
	});
});
