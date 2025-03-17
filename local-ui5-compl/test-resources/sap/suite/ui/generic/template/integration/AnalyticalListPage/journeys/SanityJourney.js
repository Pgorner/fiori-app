/*global opaTest QUnit */
sap.ui.define(["sap/ui/test/opaQunit"], function() {

	"use strict";

	QUnit.module("AnalyticalListPage - SanityTest Journey");

	opaTest("Single Selection in VF Chart", function(Given, When, Then) {
		Given.iStartMyAppInDemokit("analytics2");
		When.onTheVisualFilterDialog.iAddFilterValueInCompactDialog("Cost Element", "400020");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
		Then.onTheFilterBar.iCheckOverlayForChart(true,"M_VISUAL_FILTERS_MULTIPLE_CURRENCY",1, "Cost Element");
		When.onTheGenericAnalyticalListPage.iSelectVFChart("Bar", "100-1100", false, "CostCenter");
		Then.onTheFilterBar.iCheckVFChartSelected("Bar", "100-1100", "CostCenter");
		Then.onTheFilterBar.iCheckVHTooltip("Bar", "Cost Center", "VH_SINGLE_SELECTED", 1);
		When.onTheFilterBar.iClickOnButtonWithText("Go");
		When.onTheMainPage.iClickTheSegmentedButton("compact");
		Then.onTheFilterBar.isFilterAppliedOnFilterBar("CostCenter", "100-1100");
		Then.onTheMainPage.iCheckNumberOfItemsInTable(1, "analyticalTable", "analyticalTable");
		When.onTheMainPage.iClickFilterBarHeader();
		Then.onTheFilterBar.iCheckFilterBarCollapsedText("2 filters active: Cost Element, Cost Center");
		When.onTheMainPage.iClickFilterBarHeader();
		Then.onTheMainPage.iCheckFilterCount(2);
    	When.onTheMainPage.iClickTheSegmentedButton("visual");
    	When.onTheFilterBar.iClickTheFilterButton();
		Then.onTheVisualFilterDialog.iCheckSelectedButtonCount(1);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Cancel");
	});

	opaTest("Interaction between related charts", function(Given, When, Then) {
		When.onTheMainPage.iClickTheSegmentedButton("visual");
		Then.onTheFilterBar.iCheckVFChartSelected("Line", "400020", "CostElement");
		Then.onTheFilterBar.iCheckNoOverlayForChart(false,1);
		When.onTheMainPage.iClickTheSegmentedButton("compact");
		Then.onTheFilterBar.isFilterAppliedOnFilterBar("CostElement", "400020");
	});

	opaTest("Multiple Selections in VF Chart", function(Given, When, Then) {
		When.onTheMainPage.iClickTheSegmentedButton("visual");
		When.onTheGenericAnalyticalListPage.iSelectVFChart("Bar", "300-1000", false, "CostCenter");
		Then.onTheFilterBar.iCheckVFChartSelected("Bar", "300-1000", "CostCenter");
		Then.onTheFilterBar.iCheckVHTooltip("Bar", "Cost Center", "VH_MULTI_SELECTED", 2);
		When.onTheFilterBar.iClickOnButtonWithText("Go");
		When.onTheMainPage.iClickTheSegmentedButton("compact");
		Then.onTheFilterBar.isFilterAppliedOnFilterBar("CostCenter", "300-1000");
		Then.onTheMainPage.iCheckNumberOfItemsInTable(2, "analyticalTable", "analyticalTable");
		When.onTheMainPage.iClickTheSegmentedButton("visual");
    	When.onTheFilterBar.iClickTheFilterButton();
		Then.onTheVisualFilterDialog.iCheckSelectedButtonCount(2);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Cancel");
	});

	opaTest("Selections in Chart After Chart Type Change", function(Given,When,Then){
		When.onTheFilterBar.iClickTheFilterButton();
		When.onTheVisualFilterDialog.iClickTheSegmentedButton("visual", true);
		When.onTheVisualFilterDialog.iClickTheOverflowButtonForTheToolbar("Actual Costs by Cost Center");
		When.onTheGenericAnalyticalListPage.iClickTheButtonWithId("template::VisualFilterDialog::ChartTypeChangeButton::ZCOSTCENTERCOSTSQUERY0020_CDS.ZCOSTCENTERCOSTSQUERY0021Type::CostCenter");
		When.onTheVisualFilterDialog.iChangeChartProperty(1);
		Then.onTheVisualFilterDialog.iCheckTypeOfChart("Donut","CostCenter");
		Then.onTheVisualFilterDialog.iCheckSelectedButtonCount(2);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
		When.onTheMainPage.iClickTheSegmentedButton("visual");
		Then.onTheFilterBar.iCheckVFChartSelected("Donut", "100-1100", "CostCenter");
		Then.onTheFilterBar.iCheckVFChartSelected("Donut", "300-1000", "CostCenter");
		Then.onTheFilterBar.iCheckVHTooltip("Donut", "Cost Center", "VH_MULTI_SELECTED", 2);
		When.onTheMainPage.iClickTheSegmentedButton("compact");
		Then.onTheFilterBar.isFilterAppliedOnFilterBar("CostCenter", "100-1100");
		Then.onTheFilterBar.isFilterAppliedOnFilterBar("CostCenter", "300-1000");
		When.onTheFilterBar.iClickOnButtonWithText("Go");
		Then.onTheMainPage.iCheckNumberOfItemsInTable(2, "analyticalTable", "analyticalTable");
	});

	opaTest("Others Selection in Donut Chart",function(Given,When,Then){
		When.onTheMainPage.iClickTheSegmentedButton("visual");
		When.onTheGenericAnalyticalListPage.iSelectVFChart("Donut", "__IS_OTHER__", false, "CostCenter");
		Then.onTheFilterBar.iCheckVFChartSelected("Donut", "__IS_OTHER__", "CostCenter");
		When.onTheFilterBar.iClickTheValueHelp("sap-icon://value-help", "CostCenter");
		Then.onTheMainPage.iCheckValueHelpDialogForTokens(["!(=300-1000)", "!(=100-1100)"]);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
		When.onTheFilterBar.iClickOnButtonWithText("Go");
		Then.onTheMainPage.iCheckFilterCount(2);
		Then.onTheMainPage.iCheckNumberOfItemsInTable(7, "analyticalTable", "analyticalTable");
	});

	opaTest("Removal of Others Selection in Donut Chart",function(Given,When,Then){
		When.onTheMainPage.iClickTheSegmentedButton("visual");
		When.onTheGenericAnalyticalListPage.iSelectVFChart("Donut", "100-1100", false, "CostCenter");
		Then.onTheFilterBar.iCheckVFChartSelected("Donut", "100-1100", "CostCenter");
		Then.onTheFilterBar.iCheckVFChartSelected("Donut", "__IS_OTHER__", "CostCenter", true);
		Then.onTheFilterBar.iCheckVHTooltip("Donut", "Cost Center", "VH_SINGLE_SELECTED", 1);
		When.onTheMainPage.iClickTheSegmentedButton("compact");
		Then.onTheFilterBar.isFilterAppliedOnFilterBar("CostCenter", "100-1100");
		When.onTheFilterBar.iClickOnButtonWithText("Go");
		Then.onTheMainPage.iCheckFilterCount(2);
		Then.onTheMainPage.iCheckNumberOfItemsInTable(1, "analyticalTable", "analyticalTable");
	});

	opaTest("Remove Selection from VF Dialog",function(Given,When,Then){
		When.onTheMainPage.iClickTheSegmentedButton("visual");
		When.onTheFilterBar.iClickTheFilterButton();
		When.onTheGenericAnalyticalListPage.iDeselectVFChart("Donut", "100-1100", true, "CostCenter");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
		Then.onTheFilterBar.iCheckOverlayForChart(true,"M_VISUAL_FILTERS_MULTIPLE_CURRENCY",1, "Cost Element");
		Then.onTheMainPage.iCheckFilterCount(1);
		Then.onTheMainPage.iCheckNumberOfItemsInTable(1, "analyticalTable", "analyticalTable");
	});

	opaTest("Apply Selection from VF Dialog",function(Given,When,Then){
		When.onTheFilterBar.iClickTheFilterButton();
		When.onTheGenericAnalyticalListPage.iSelectVFChart("Donut", "100-1100", true, "CostCenter");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
		Then.onTheFilterBar.iCheckNoOverlayForChart(false,1);
		Then.onTheFilterBar.iCheckVFChartSelected("Donut", "100-1100", "CostCenter");
		Then.onTheMainPage.iCheckNumberOfItemsInTable(1, "analyticalTable", "analyticalTable");
	});

	opaTest("Sync CF-VF",function(Given,When,Then){
		When.onTheMainPage.iClickTheSegmentedButton("compact");
		When.onTheFilterBar.iEnterValueInField("300-1000", "SmartFilterBar-filterItemControl_BASIC-CostCenter");
		When.onTheMainPage.iClickTheSegmentedButton("visual");
		Then.onTheFilterBar.iCheckVFChartSelected("Donut", "300-1000", "CostCenter");
		When.onTheFilterBar.iClickOnButtonWithText("Go");
		Then.onTheMainPage.iCheckFilterCount(2);
		Then.onTheMainPage.iCheckNumberOfItemsInTable(2, "analyticalTable", "analyticalTable");
	});

	opaTest("Drilldown in chart does not result in table rebind",function(Given,When,Then){
		When.onTheGenericAnalyticalListPage.iClickTheButtonWithId("chart-btnDrillDownText-drillDown");
		Then.onTheMainPage.iCheckNumberOfItemsInTable(2, "analyticalTable", "analyticalTable");
		When.onTheChart.iDrillDownChart("Cost Center");
		Then.onTheChart.iShouldSeeChartDrilledDown("CostCenter", true);
		Then.onTheMainPage.iCheckNumberOfItemsInTable(2, "analyticalTable", "analyticalTable");
	});

	opaTest("p13n Changes in Chart does not reload the Table",function(Given,When,Then){
		When.onTheGenericAnalyticalListPage.iClickTheButtonWithId("chart-chart_settings");
		When.onTheChart.iAddDimensionFromP13nDialog("Controlling Area");
		When.onTheMainPage.iClickOnButtonWithText("OK");
		Then.onTheMainPage.iCheckNumberOfItemsInTable(2, "analyticalTable", "analyticalTable");
		Then.onTheChart.iShouldSeeChartDrilledDown("ControllingArea", true);
		Then.onTheChart.iCheckChartBreadCrumbs(2);
	});

	opaTest("p13n Changes in Table does not reload the Chart",function(Given,When,Then){
		When.onTheGenericAnalyticalListPage.iClickTheButtonWithId("table-btnPersonalisation");
		When.onTheTable.iAddColumnFromP13nDialog("Customer");
		When.onTheMainPage.iClickOnButtonWithText("OK");
		Then.onTheMainPage.iCheckNumberOfItemsInTable(2, "analyticalTable", "analyticalTable");
		Then.onTheChart.iShouldSeeChartDrilledDown("Customer", false);
		Then.onTheChart.iCheckChartBreadCrumbs(2);
	});

	opaTest("Grouping in Table With Selection in Chart",function(Given,When,Then){
		When.onTheGenericAnalyticalListPage.iClickTheButtonWithId("table-btnPersonalisation");
		When.onTheTable.iClickTheControlByControlType("sap.m.IconTabFilter", { "text": "Group" });
		When.onTheGenericAnalyticalListPage.iChoosetheItemInComboBox("Display Currency");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
		Then.onTheTable.iCheckGroupHeaderTitleOnTable("Display Currency:", 1, "ZCOSTCENTERCOSTSQUERY0020--analyticalTable", "analyticalTable");
		When.onTheMainPage.iClickTheSegmentedButton("filter");
		Then.onTheMainPage.iCheckNumberOfItemsInTable(2, "analyticalTable", "analyticalTable");
		Then.onTheChart.iShouldSeeChartDrilledDown("DisplayCurrency", false);

	});

	opaTest("KPI Tag Title",function(Given,When,Then){
		Then.onTheMainPage.iCheckKpiIndicator(0,"Good");
		Then.onTheMainPage.iCheckKpiTagTooltip(0, "Actual Cost 2,000.00 EUR ", "Good");
		Then.onTheMainPage.iCheckKpiScaleFactor("ActualCosts","K");
		Then.onTheMainPage.iCheckNumberofFractionalDigit("ActualCosts",1);
	});

	opaTest("KPI Card Title",function(Given,When,Then){
		When.onTheMainPage.iClickTheControlByControlType("sap.m.GenericTag", { "qualifier": "ActualCosts" });
		Then.onTheMainPage.iCheckKpiTitleInCard("Actual Cost");
		Then.onTheMainPage.iCheckCriticalityInKPICard("Good");
		When.onTheMainPage.iCloseTheKPIPopover();
		Then.iTeardownMyApp();
	});

	opaTest("Selecting a value from DropDown in VF",function(Given,When,Then){
		Given.iStartMyAppInDemokit("analytics4", "manifestWithoutMapView", null, { width: "1500", height: "900" });
		When.onTheGenericAnalyticalListPage.iSetTheFilter({ Field: "StartDate", Value: "" });
		When.onTheMainPage.iClickTheSegmentedButton("visual");
		Then.onTheFilterBar.iCheckVHTooltip("Bar", "Cost Center", "DROPDOWN_WITHOUT_SELECTIONS");
		When.onTheGenericAnalyticalListPage.iSelectVFChart("Bar", "200-3000", false, "CostCenter");
		When.onTheFilterBar.iClickSelectedButton(1);
		When.onTheFilterBar.iClickDropdownPopoverOk();
		When.onTheFilterBar.iClickTheFilterButton();
		Then.onTheVisualFilterDialog.iCheckSelectedButtonCount(1);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Cancel");
		When.onTheMainPage.iClickTheSegmentedButton("compact");
		Then.onTheFilterBar.isFilterAppliedOnFilterBar("CostCenter", "200-3000");
	});

	opaTest("Check for global actions and determining buttons not seen on table toolbar", function(Given, When, Then) {
		When.onTheMainPage.iClickTheSegmentedButton("table");
		Then.onTheMainPage.theCustomToolbarForTheSmartTableIsRenderedWithoutGlobalAndDetermining();
	});

	opaTest("Check for global actions on the dynamic header", function(Given, When, Then) {
		Then.onTheMainPage.isTheDynamicHeaderRenderingGlobalActions();
	});

	opaTest("Check for determining buttons on footer", function(Given, When, Then) {
		Then.onTheMainPage.isTheFooterBarHasDeterminingButtonsCorrectly();
		When.onTheMainPage.iClickTheSegmentedButton("chart");
		Then.onTheMainPage.isTheFooterBarHasDeterminingButtonsCorrectly();
		When.onTheMainPage.iClickTheSegmentedButton("charttable");
		Then.onTheMainPage.isTheFooterBarHasDeterminingButtonsCorrectly();
		When.onTheMainPage.iClickTheSegmentedButton("table");
		Then.onTheMainPage.isTheFooterBarHasDeterminingButtonsCorrectly();
	});

	opaTest("Removal of selections from DropDown in VF",function(Given,When,Then){
		When.onTheMainPage.iClickTheSegmentedButton("visual");
		When.onTheFilterBar.iClickSelectedButton(1);
		When.onTheFilterBar.iClickSelectedButtonClearAll();
		When.onTheFilterBar.iClickDropdownPopoverOk();
		Then.onTheFilterBar.iCheckVHTooltip("Bar", "Cost Center", "DROPDOWN_WITHOUT_SELECTIONS");
	});

	opaTest("Check DatePicker button rendered for DateTime field in VF, VFD and selected values are synced from CF to VF",function(Given,When,Then){
		When.onTheMainPage.iClickTheSegmentedButton("compact");
		When.onTheFilterBar.iEnterValueInField("Dec 10, 2016", "SmartFilterBar-filterItemControl_BASIC-StartDate");
		When.onTheMainPage.iClickTheSegmentedButton("visual");
		/*Then.onTheFilterBar.iCheckVFLabelAndTooltip("Line", "StartDate", "Dec 10, 2016");
		When.onTheFilterBar.iCheckForDynamicDateControl("sap-icon://check-availability", "1 item selected for Date", false);
		When.onTheFilterBar.iClickTheItemsInDynamicDatePopOver("Date");
		When.onTheFilterBar.iCheckForCalendar(new Date("Dec 10, 2016"), false);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Cancel");
		Then.onTheMainPage.iCheckFilterCountInOverflowToolbar("4");
		Given.onTheFilterBar.iClickTheFilterButton();
		When.onTheFilterBar.iCheckForDynamicDateControl("sap-icon://check-availability", "1 item selected for Date", true);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Cancel");*/
		Then.iTeardownMyApp();
	});

	opaTest("Check initial no data text",function(Given,When,Then){
		Given.iStartMyAppInDemokit("analytics2");
		When.onTheGenericAnalyticalListPage.iClickTheButtonWithId("template::SmartFilterBar-adapt-filters-dialog-cancelBtn");
		Then.onTheChart.iCheckControlPropertiesById("ZCOSTCENTERCOSTSQUERY0020--analyticalTable", { "visible": true, "noData": "To start, set the relevant filters and choose \"Go\"." });
		Then.onTheTable.iCheckControlPropertiesById("ZCOSTCENTERCOSTSQUERY0020--table", { "visible": true, "initialNoDataText": "To start, set the relevant filters and choose \"Go\"." });
	 });
	opaTest("Check error up is shown or not", function(Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		Then.onTheFilterBar.iCheckGoButton();
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		When.onTheGenericAnalyticalListPage.iClickTheButtonWithId("template::SmartFilterBar-adapt-filters-dialog-cancelBtn");
		Then.iTeardownMyApp();
	});

	 opaTest("Check no data text",function(Given,When,Then){
		Given.iStartMyAppInDemokit("analytics2");
		When.onTheVisualFilterDialog.iAddFilterValueInCompactDialog("Cost Element", "400020");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		When.onTheGenericAnalyticalListPage.iSetTheFilter({Field: "DisplayCurrency", Value: "EUR"});
		When.onTheFilterBar.iClickOnButtonWithText("Go");
		Then.onTheChart.iCheckSmartChartNoDataText("No data found. Try adjusting the filter parameters.", "ZCOSTCENTERCOSTSQUERY0020--chart");
		Then.onTheTable.iCheckControlPropertiesById("ZCOSTCENTERCOSTSQUERY0020--analyticalTable", { "visible": true, "noData": "No items available. Try adjusting the search or filter parameters." });
		Then.iTeardownMyApp();
	 });

	opaTest("Check for mandatory fields missing info message for KPI entityset different than main entityset with matching fields", function (Given, When, Then) {
		Given.iStartMyAppInDemokit("alpWithParams");
		When.onTheMainPage.iClickTheControlByControlType("sap.m.GenericTag", { "qualifier": "NetAmount4" });
		Then.onTheMainPage.iCheckKpiErrorText("KPI_INFO_FOR_MISSING_MANDATE_FILTPAR");
		Then.onTheMainPage.iCheckKpiIndicator(4, "Neutral");
		When.onTheMainPage.iCloseTheKPIPopover();
		When.onTheMainPage.iEnterValueInField("USD", "P_DisplayCurrency");
	});

	opaTest("Apply Filters on Filterable KPIs and check the values",function(Given,When,Then){
		Then.onTheMainPage.iCheckKpiValue("NetAmount2","309.8K");
		Then.onTheMainPage.iCheckKpiScaleFactor("NetAmount2","K");
		Then.onTheMainPage.iCheckNumberofFractionalDigit("NetAmount2",1);
		When.onTheGenericAnalyticalListPage.iSetTheFilter({Field: "DisplayCurrency", Value: "EUR"});
		When.onTheFilterBar.iClickInputValuehelp("CustomerCountry");
		When.onTheFilterBar.iSelectOperatorInVH("equal to");
		When.onTheFilterBar.iAddValueInValuehelp("BR");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
		Then.onTheMainPage.iCheckKpiValue("NetAmount2","2.6M");
		Then.onTheMainPage.iCheckKpiScaleFactor("NetAmount2","M");
		Then.onTheMainPage.iCheckNumberofFractionalDigit("NetAmount2",1);
		Then.iTeardownMyApp();
	});

	opaTest("Start the application with a different manifest", function (Given, When, Then) {
		Given.iStartMyAppInDemokit("analytics2", "manifestForAllFiltersAsInParameters");
		When.onTheVisualFilterDialog.iAddFilterValueInCompactDialog("Cost Element", "400020");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
		When.onTheGenericAnalyticalListPage.iSelectVFChart("bar", "100-1100", false, "CostCenter");
	});

	opaTest("Check if all filters are InParameter", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iSelectVFChart("bar", "100-1100", false, "CostCenter");
		Then.onTheFilterBar.iCheckVFTitle("ActualCosts", "CostElement", "title", "Actual Costs by Cost Element | USD (Dollar)");
		Then.iTeardownMyApp();
	});

	opaTest("Start the application with a different manifest for Timeseries annotations check in VF", function (Given, When, Then) {
		Given.iStartMyAppInDemokit("analytics4", "manifestForTimeSeries");
		Then.onTheFilterBar.iCheckDateFormat("DeliveryCalendarYearWeek");
		Then.onTheFilterBar.iCheckDateFormat("DeliveryCalendarYearQuarter");
		Then.onTheFilterBar.iCheckDateFormat("FiscalYearPeriod");
	});

	opaTest("Check for Timeseries annotations in VFD", function(Given, When, Then) {
		When.onTheFilterBar.iClickTheFilterButton();
		Then.onTheFilterBar.iCheckDateFormat("DeliveryCalendarYearWeek", true);
		Then.onTheFilterBar.iCheckDateFormat("DeliveryCalendarYearQuarter", true);
		Then.onTheFilterBar.iCheckDateFormat("FiscalYearPeriod", true);
		Then.iTeardownMyApp();
	});

	opaTest("To check chart/table P13n changes are stored in iAppstate via Save As Tile", function(Given, When, Then) {
		Given.iStartMyAppInSandbox("alp-display#alp-display?DisplayCurrency=USD&CostElement=400020");
        When.onTheFilterBar.iClickOnButtonWithText("Go");
        When.onTheGenericAnalyticalListPage.iClickTheButtonWithId("chart-chart_settings");
        When.onTheChart.iAddDimensionFromP13nDialog("Customer");
        When.onTheMainPage.iClickOnButtonWithText("OK");
        When.onTheFilterBar.iClickOnButtonWithText("Go");
		When.onTheMainPage.iClickShareIcon();
		When.onTheMainPage.iClickMenuItem("Save as Tile");
        Then.onTheGenericAnalyticalListPage.iShouldSeeTheDialogWithTitle("Save as Tile");
		When.onTheMainPage.iEnterValueInField("ALP iAppstate Demo", "bookmarkTitleInput");
		When.onTheMainPage.iClickOnPagesMultiInputOnSaveAsTileDialog();
		When.onTheMainPage.iClickOnCheckboxWithText("", "SelectedNodesComboBox-ValueHelpDialog--ContentNodesTree-1-selectMulti");
		When.onTheMainPage.iClickTheButtonOnTheDialog("Apply");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Save");
		When.onTheGenericAnalyticalListPage.iClickOnItemFromTheShellNavigationMenu("Home");
		When.onTheMainPage.iClickTheControlByControlType("sap.m.GenericTile", { "visible": true, "header": "ALP iAppstate Demo" });
        Then.onTheChart.iShouldSeeChartDrilledDown("Customer", true);
		Then.iTeardownMyApp();
	});
});
