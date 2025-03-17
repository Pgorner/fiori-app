/*global opaTest QUnit */
sap.ui.define([
	"sap/ui/test/opaQunit"
], function() {

	"use strict";

	QUnit.module("AnalyticalListPage - Filter Bar Journey");

	opaTest("Check filterable KPI gets hidden in Go mode", function(Given, When, Then) {
		Given.iStartMyAppInDemokit("analytics2", null, { "serverDelay": false }, { width: "1000", height: "500" });
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Cancel");
		Then.onTheMainPage.iCheckTheSelectedVariantIsModified(false);
		Then.onTheMainPage.iCheckForHiddenKPI("ActualMarginRelative5");
		Then.onTheMainPage.iCheckForHiddenKPI("ActualMarginRelative4");
		Then.onTheMainPage.iCheckForHiddenKPI("ActualMarginRelative3");
		Then.onTheMainPage.iCheckForHiddenKPI("TargetMargin2");
		Then.onTheMainPage.iCheckForHiddenKPI("ActualMarginRelative2");
		Then.onTheMainPage.iCheckForHiddenKPI("TargetMargin");
		Then.onTheMainPage.iCheckForHiddenKPI("ActualMarginRelative");
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		When.onTheGenericAnalyticalListPage.iSetTheFilter({Field: "CostElement", Value: "400020"});
		Then.onTheMainPage.iCheckTheSelectedVariantIsModified(true);
		When.onTheFilterBar.iClickOnButtonWithText("Go");
		Then.onTheMainPage.iShouldSeeTheComponent("template::KPITag::kpi::ActualMarginRelative", "sap.suite.ui.generic.template.AnalyticalListPage.control.SmartKpiTag", {id: "template::KPITag::kpi::ActualMarginRelative"});
		Then.onTheMainPage.iShouldSeeTheComponent("template::KPITag::kpi::ActualMarginRelative2", "sap.suite.ui.generic.template.AnalyticalListPage.control.SmartKpiTag", {id: "template::KPITag::kpi::ActualMarginRelative2"});
		When.onTheMainPage.iClickTheControlByControlType("sap.m.GenericTag", { "qualifier": "TargetMargin2" });
		Then.onTheMainPage.iShouldSeeTheComponent("template::KPITag::kpi::ActualMarginRelative2", "sap.suite.ui.generic.template.AnalyticalListPage.control.SmartKpiTag", {id: "template::KPITag::kpi::ActualMarginRelative2"});
	});
	opaTest("KPICards dataLabel visibility", function(Given, When, Then) {
		When.onTheMainPage.iClickTheControlByControlType("sap.m.GenericTag", { "qualifier": "ActualCosts" });
		Then.onTheMainPage.iCheckChartDataLabelOnVizFrame();
		When.onTheMainPage.iClickTheControlByControlType("sap.m.GenericTag", { "qualifier": "ActualMarginRelative" });
		Then.onTheMainPage.iCheckChartDataLabelOnVizFrame();
		Then.iTeardownMyApp();
	});

	opaTest("Go Button Test", function(Given, When, Then) {
		Given.iStartMyAppInDemokit("analytics2", null, null, { width: "1000", height: "500" });
		When.onTheVisualFilterDialog.iAddFilterValueInCompactDialog("Cost Element", "400020");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		When.onTheGenericAnalyticalListPage.iSetTheFilter({Field: "DisplayCurrency", Value: "USD"});
		When.onTheMainPage.iAppylHiddenFilterToFilterBar("multiple", "Customer", "C000001")
		Then.onTheFilterBar.iCheckGoButton();
		When.onTheGenericAnalyticalListPage.iSetTheFilter({Field: "CostCenter", Value: "100-1000"});
		When.onTheFilterBar.iClickOnButtonWithText("Go");
		Then.onTheMainPage.iCheckNumberOfItemsInTable(1, "analyticalTable", "analyticalTable");
	});
	
	opaTest("Pin Button should not be Present", function(Given, When, Then) {
		Then.onTheFilterBar.iCheckControlPropertiesByControlType("sap.f.DynamicPageHeader", { "visible": true, "pinnable": false });
	});

	opaTest("Apply filter to visual filter", function(Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		When.onTheMainPage.iClickTheSegmentedButton("charttable");
		When.onTheGenericAnalyticalListPage.iSelectVFChart("bar", "100-1100", false, "CostCenter");
		Then.onTheFilterBar.iCheckVFChartSelected("bar", "100-1100", "CostCenter");
		When.onTheFilterBar.iClickOnButtonWithText("Go");
		Then.onTheMainPage.iCheckNumberOfItemsInTable(1, "analyticalTable", "analyticalTable");
		Then.onTheMainPage.iShouldSeeTheComponent("Bar Chart", "sap.suite.ui.microchart.InteractiveBarChart");
	});

	opaTest("Clear filter in the visual filter via unset", function(Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iDeselectVFChart("bar", "100-1100", false, "CostCenter");
		When.onTheFilterBar.iClickOnButtonWithText("Go");
		Then.onTheMainPage.iCheckNumberOfItemsInTable(1, "analyticalTable", "analyticalTable"); //Count is 1 because compact filter is still set
	});
	opaTest("Clear filter in the compact filter via unset", function(Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		When.onTheGenericAnalyticalListPage.iSetTheFilter({Field: "CostCenter", Value: ""});
		When.onTheFilterBar.iClickOnButtonWithText("Go");
		Then.onTheMainPage.iCheckNumberOfItemsInTable(1, "analyticalTable", "analyticalTable");
	});

	opaTest("VF Title check", function(Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		Then.onTheFilterBar.iCheckMandatoryFilter();
		Then.onTheFilterBar.iCheckVFTitle("ActualCosts", "CostCenter", "title", "Actual Costs by Cost Center | USD (Dollar)");
		Then.onTheFilterBar.iCheckVFTitle("ActualCosts", "CostElement", "title", "Actual Costs by Cost Element | USD (Dollar)");

	});
	opaTest("Number of fractional digits in VF", function(Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		Then.onTheFilterBar.iCountDecimalPrecision(0);
	});
	opaTest("Check Support of Value help button", function(Given, When, Then) {
		When.onTheFilterBar.iClickTheValueHelp("sap-icon://value-help", "CostCenter");
		When.onTheFilterBar.iClickOnButtonWithText("Go", true);
		Then.onTheFilterBar.iSearchForItemsTable();
		When.onTheFilterBar.iMakeSelection([12]);
		When.onTheFilterBar.iClickTheButtonOnTheDialog("OK");
		Then.onTheFilterBar.iCheckSelectedButtonCount(1, "Cost Center");
	});
	opaTest("Check tooltip for value help button on the VF bar - VH with selections", function(Given, When, Then) {
		Then.onTheFilterBar.iCheckVHTooltip("Bar", "Cost Center", "VH_SINGLE_SELECTED", 1);
	});
	opaTest("Check VF Labels as per Text Arrangement Annotation", function(Given, When, Then) {
		Then.onTheFilterBar.iCheckVFLabelforTextArangement("Bar","TextFirst", false);
	});

	opaTest("VF Tooltip", function(Given, When, Then) {
		Then.onTheFilterBar.iCheckVFTitle("ActualCosts", "CostCenter", "tooltip", "quick info for Actual costs by quick info for cost center in USD (Dollar)");
		Then.onTheFilterBar.iCheckVFTitle("ActualCosts", "CostElement", "tooltip", "quick info for Actual costs by Cost Element in USD (Dollar)");
	});

	opaTest("Check Tooltip of Adapt Filter and Go button in Smart Visual Filter bar",function(Given, When, Then){
		Then.onTheMainPage.iCheckTooltip("Adapt Filter Button", "SmartVisualFilterbar");
	});

	opaTest("Adapt Filters Button Count", function(Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		When.onTheGenericAnalyticalListPage.iSetTheFilter({Field: "CostCenter", Value: "100-1100"});
		When.onTheFilterBar.iClickOnButtonWithText("Go");
		Then.onTheMainPage.iCheckFilterCount("3");
	});

	opaTest("Switch filter mode to Compact Filter and check if Default Values are applied from Annotation", function(Given, When, Then) {
		When.onTheMainPage.iClickTheSegmentedButton("compact");
		Then.onTheMainPage.iShouldSeeTheComponent("SmartFilterBarExt", "sap.suite.ui.generic.template.AnalyticalListPage.control.SmartFilterBarExt");
		Then.onTheFilterBar.iCheckFilterBarFilterIsApplied({"DisplayCurrency": "USD"});
	});

	opaTest("Apply filter to compact filter", function(Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		When.onTheGenericAnalyticalListPage.iSetTheFilter({Field: "CostCenter", Value: "100-1000"});
		When.onTheFilterBar.iClickOnButtonWithText("Go");
		Then.onTheMainPage.iCheckNumberOfItemsInTable(1, "analyticalTable", "analyticalTable");
	});
	opaTest("Apply URL Parameter to Currency Filter and Check Overlay", function(Given, When, Then) {
		Then.onTheFilterBar.iCheckFilterBarFilterIsApplied({"DisplayCurrency": "USD"});
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		Then.onTheFilterBar.iCheckOverlay(true, "INVALID_MEASURE_DONUT_MESSAGE", 1);
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
	});
});
