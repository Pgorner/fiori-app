/*global opaTest QUnit */
sap.ui.define(["sap/ui/test/opaQunit"], function () {

	"use strict";

	QUnit.module("AnalyticalListPage - ALPWithSettingsMultiViewsJourney");

	opaTest("Starting the Analytical List Page with Settings app and check default filters coming from Selection Variant via SegmentedButtons", function (Given, When, Then) {
		Given.iStartMyAppInDemokit("analytics3");
		Then.onTheMainPage.iCheckControlPropertiesById("chart", { "visible": true, "noData": "To start, set the relevant filters and choose \"Go\"." });
		Then.onTheMainPage.iCheckControlPropertiesById("table", { "visible": true, "initialNoDataText": "To start, set the relevant filters and choose \"Go\"." });
		When.onTheFilterBar.iClickOnButtonWithText("Go");
		Then.onTheMainPage.iShouldSeeTheSegmentedButtonWithLabel("Expensive (4)");
		Then.onTheMainPage.iCheckNumberOfItemsInTable(4, "analyticalTable", "analyticalTable");
		When.onTheMainPage.iClickTheSegmentedButton("_tab2");
		Then.onTheMainPage.iShouldSeeTheSegmentedButtonWithLabel("Cheap (1)");
		Then.onTheMainPage.iCheckNumberOfItemsInTable(1, "analyticalTable", "analyticalTable");
		When.onTheMainPage.iClickTheSegmentedButton("_tab1");
		Then.iTeardownMyApp();
	});

	opaTest("Starting the Analytical List Page with Settings app and check default filters coming from Selection Variant via Drop-down", function (Given, When, Then) {
		Given.iStartMyAppInDemokit("analytics3", "manifestForMultiViews");
		Then.onTheMainPage.iCheckControlPropertiesById("chart", { "visible": true, "noData": "To start, set the relevant filters and choose \"Go\"." });
		Then.onTheMainPage.iCheckControlPropertiesById("table", { "visible": true, "initialNoDataText": "To start, set the relevant filters and choose \"Go\"." });
		When.onTheFilterBar.iClickOnButtonWithText("Go");
		Then.onTheMainPage.iCheckComboboxSelectedValue("analytics3::sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage::ZCOSTCENTERCOSTSQUERY0020--template::VariantSelect", "Expensive");
		Then.onTheMainPage.iCheckNumberOfItemsInTable(4, "analyticalTable", "analyticalTable");
		Then.onTheMainPage.iSelectComboboxValue("analytics3::sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage::ZCOSTCENTERCOSTSQUERY0020--template::VariantSelect", 2);
		Then.onTheMainPage.iCheckNumberOfItemsInTable(1, "analyticalTable", "analyticalTable");
		When.onTheMainPage.iEnterValueInField("SAP", "SmartFilterBar-filterItemControl_BASIC-CompanyCode");
		When.onTheFilterBar.iClickOnButtonWithText("Go");
		Then.onTheMainPage.iSelectComboboxValue("analytics3::sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage::ZCOSTCENTERCOSTSQUERY0020--template::VariantSelect", 3);
		Then.onTheMainPage.iCheckNumberOfItemsInTable(2, "analyticalTable", "analyticalTable");
		Then.onTheMainPage.iSelectComboboxValue("analytics3::sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage::ZCOSTCENTERCOSTSQUERY0020--template::VariantSelect", 4);
		Then.onTheMainPage.iCheckNumberOfItemsInTable(1, "analyticalTable", "analyticalTable");
		Then.iTeardownMyApp();
	});
});