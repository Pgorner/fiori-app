/*global opaTest QUnit */
sap.ui.define(["sap/ui/test/opaQunit"], function () {

	"use strict";

	QUnit.module("AnalyticalListPage - MultiTable Journey");

	opaTest("MultiTable Test", function (Given, When, Then) {
		Given.iStartMyAppInDemokit("analytics6", null, null, { width: "1000", height: "500" });
		When.onTheVisualFilterDialog.iAddFilterValueInCompactDialog("Cost Element", "400020");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
		When.onTheFilterBar.iClickOnButtonWithText("Go");
	});

	opaTest("Check the keyboard shortcuts for datafieldforIBN and function import actions", function (Given, When, Then) {
		Then.onTheGenericAnalyticalListPage.iShouldSeeTheButtonWithLabel("Display Order");
		Then.onTheMainPage.iCheckTheCommandExecutionPropertiesForTheControl("ZCOSTCENTERCOSTSQUERY0020--template:::ALPTable:::SmartTable:::sQuickVariantKey::1", { "command": "OrderCommand", "visible": true, "shortcut": "Ctrl+E" });
		Then.onTheGenericAnalyticalListPage.iShouldSeeTheButtonWithLabel("Sales Order Aggregation Navigation");
		Then.onTheMainPage.iCheckTheCommandExecutionPropertiesForTheControl("ZCOSTCENTERCOSTSQUERY0020--template:::ALPTable:::SmartTable:::sQuickVariantKey::1", { "command": "SalesOrderNavigationCommand", "visible": true, "shortcut": "Ctrl+I" });
	});

	opaTest("Filtering for Supplier = 'S0003'", function (Given, When, Then) {
		var iTabIndex = 1,
			sSupplier = "Supplier",
			sValue = "S0003",
			iExpectedItems = 1;

		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		When.onTheGenericAnalyticalListPage
			.iSetTheFilter({ Field: sSupplier, Value: sValue })
			.and
			.iExecuteTheSearch();
		Then.onTheGenericAnalyticalListPage
			.theTableIsVisible()
			.and
			.theCountInTheIconTabBarHasTheCorrectValue(iTabIndex, iExpectedItems)
			.and
			.theCountInTheIconTabBarHasTheCorrectValue(2, 1)
			.and
			.theCountInTheIconTabBarHasTheCorrectValue(3, 1)
			.and
			.theCountInTheIconTabBarHasTheCorrectValue(4, 1);
		Then.onTheMainPage.theResultListFieldHasTheCorrectValue({ Line: 1, Field: sSupplier, Value: sValue }, 1)
			.and
			.iCheckTableToolbarControlProperty({ "header": [true, true, "Cost Center Query 20 (1)"] }, "--template:::ALPTable:::AnalyticalTable:::sQuickVariantKey::1", "analyticalTable");
	});

	opaTest("Switching to Tab 2", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage
			.iClickOnIconTabFilter("2");
		Then.onTheGenericAnalyticalListPage
			.theTableIsVisible();
		Then.onTheMainPage
			.iCheckControlPropertiesById("AnalyticalListPage::ZCOSTCENTERCOSTSQUERY0020--template:::ALPTable:::SmartTable:::sQuickVariantKey::2", { "entitySet": "ZCOSTCENTERCOSTSQUERY0021" })
			.and
			.iCheckTableProperties({ "visible": true }, "analyticalTable", "--template:::ALPTable:::AnalyticalTable:::sQuickVariantKey::2");
	});

	opaTest("Filtering for Supplier = 'S0005'", function (Given, When, Then) {
		var iTabIndex = 2,
			sSupplier = "Supplier",
			sValue = "S0005",
			iExpectedItems = 1;

		When.onTheGenericAnalyticalListPage
			.iSetTheFilter({ Field: sSupplier, Value: sValue }).and.iExecuteTheSearch();
		Then.onTheGenericAnalyticalListPage
			.theTableIsVisible()
			.and
			.theCountInTheIconTabBarHasTheCorrectValue(iTabIndex, iExpectedItems)
			.and
			.theCountInTheIconTabBarHasTheCorrectValue(2, 1)
			.and
			.theCountInTheIconTabBarHasTheCorrectValue(3, 1)
			.and
			.theCountInTheIconTabBarHasTheCorrectValue(4, 1);
		Then.onTheMainPage.theResultListFieldHasTheCorrectValue({ Line: 1, Field: sSupplier, Value: sValue }, 2)
			.and
			.iCheckTableToolbarControlProperty({ "header": [true, true, "Cost Center Query 21 (1)"] }, "--template:::ALPTable:::AnalyticalTable:::sQuickVariantKey::2", "analyticalTable");
	});

	opaTest("Switching to Tab 3", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage
			.iClickOnIconTabFilter("3");
		Then.onTheMainPage
			.iCheckControlPropertiesByControlType("sap.ui.comp.smartchart.SmartChart", { "visible": true, "entitySet": "ZCOSTCENTERCOSTSQUERY0020" })
			.and
			.iCheckCustomDataOfControl("sap.ui.comp.smartchart.SmartChart", "--template:::ALPChart:::SmartChart:::sQuickVariantKey::3", { "presentationVariantQualifier": "VAR3", "chartQualifier": "VAR3" })
			.and
			.iCheckCustomDataOfControl("sap.m.IconTabFilter", "IconTabFilter-3", { "variantAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionPresentationVariant#VAR3", "text": "Cost Center Query 20 Chart" });
	});

	opaTest("Check navigation from smart chart", function (Given, When, Then) {
		When.onTheChart
			.iSelectChart("CostCenter", "200-3000");
		Then.onTheGenericAnalyticalListPage
			.iShouldSeeTheButtonWithLabel("Details (1)");
		When.onTheMainPage
			.iClickOnButtonWithText("Details (1)");
		Then.onTheGenericAnalyticalListPage
			.iShouldSeeTheButtonWithLabel("Show Details");
		When.onTheGenericAnalyticalListPage
			.iClickTheButtonOnTheDialogWithLabel("Show Details");
		Then.onTheMainPage
			.iCheckObjectPageEntitySet("ZCOSTCENTERCOSTSQUERY0020");
		When.onTheGenericAnalyticalListPage
			.iClickTheButtonWithIcon("sap-icon://nav-back");
	});

	opaTest("Switching to Tab 4", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage
			.iClickOnIconTabFilter("4");
		Then.onTheMainPage
			.iCheckControlPropertiesByControlType("sap.ui.comp.smartchart.SmartChart", { "visible": true, "entitySet": "ZCOSTCENTERCOSTSQUERY0021" })
			.and
			.iCheckCustomDataOfControl("sap.ui.comp.smartchart.SmartChart", "--template:::ALPChart:::SmartChart:::sQuickVariantKey::4", { "presentationVariantQualifier": "VAR4", "chartQualifier": "VAR4" })
			.and
			.iCheckCustomDataOfControl("sap.m.IconTabFilter", "IconTabFilter-4", { "variantAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionPresentationVariant#VAR4", "text": "Cost Center Query 21 Chart" });
	});

	opaTest("Switching to Tab 5", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage
			.iClickOnIconTabFilter("5")
			.and
			.iExecuteTheSearch();
		Then.onTheGenericAnalyticalListPage
			.theTableIsVisible();
		Then.onTheMainPage
			.iCheckControlPropertiesById("AnalyticalListPage::ZCOSTCENTERCOSTSQUERY0020--template:::ALPTable:::SmartTable:::sQuickVariantKey::5", { "entitySet": "ZCOSTCENTERCOSTSQUERY0022" })
			.and
			.iCheckTableProperties({ "visible": true }, "analyticalTable", "--template:::ALPTable:::AnalyticalTable:::sQuickVariantKey::5")
			.and
			.iCheckControlPropertiesByControlType("sap.m.MessageStrip", { "visible": true, "text": "The filter \"Supplier\" isn't relevant for the \"Cost Center Query 22 Table\” tab. Setting this filter has no effect on the results." });
		When.onTheGenericAnalyticalListPage
			.iSetTheFilter({ Field: "Supplier", Value: "Prod" })
			.and
			.iExecuteTheSearch();
	});

	opaTest("Check NoData text for Smart Chart", function (Given, When, Then) {
		var iTabIndex = 3,
			iExpectedItems = 0;

		When.onTheGenericAnalyticalListPage
			.iClickOnIconTabFilter("6");
		Then.onTheMainPage
			.iCheckControlPropertiesByControlType("sap.ui.comp.smartchart.SmartChart", { "visible": true })
			.and
			.iCheckSmartChartNoDataText("No data found. Try adjusting the filter parameters.", "--template:::ALPChart:::SmartChart:::sQuickVariantKey::6");
		Then.onTheGenericAnalyticalListPage
			.theCountInTheIconTabBarHasTheCorrectValue(iTabIndex, iExpectedItems)
			.and
			.theCountInTheIconTabBarHasTheCorrectValue(2, 0)
			.and
			.theCountInTheIconTabBarHasTheCorrectValue(3, 0)
			.and
			.theCountInTheIconTabBarHasTheCorrectValue(4, 0);
	});

	opaTest("Switching back to Tab 1 and clear filters", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage
			.iClickOnIconTabFilter("1")
			.and
			.iSetTheFilter({ Field: "Supplier", Value: "" })
			.and
			.iExecuteTheSearch();
		Then.onTheMainPage
			.iCheckTableToolbarControlProperty({ "header": [true, true, "Cost Center Query 20 (9)"] }, "--template:::ALPTable:::AnalyticalTable:::sQuickVariantKey::1", "analyticalTable");
		Then.iTeardownMyApp();
	});
});