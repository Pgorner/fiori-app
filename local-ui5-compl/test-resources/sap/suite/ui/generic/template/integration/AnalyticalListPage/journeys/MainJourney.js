/*global opaTest QUnit */
sap.ui.define(["sap/ui/test/opaQunit"], function () {

	"use strict";

	QUnit.module("AnalyticalListPage - MainJourney");

	opaTest("Check if the Analytical List Page is displaying with components", function (Given, When, Then) {
		Given.iStartMyAppInDemokit("analytics2", null, null, { width: "1500", height: "900" });
		Then.onTheGenericAnalyticalListPage.iShouldSeeTheDialogWithTitle("Adapt Filters");
		When.onTheVisualFilterDialog.iAddFilterValueInCompactDialog("Cost Element", "400020");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
		Then.onTheFilterBar.iCheckHiddenFilters(3);
		Then.onTheMainPage.iShouldSeeTheComponent("KPI", "sap.suite.ui.generic.template.AnalyticalListPage.control.SmartKpiTag");
		Then.onTheMainPage.iShouldSeeTheComponent("SmartChart", "sap.ui.comp.smartchart.SmartChart");
		Then.onTheMainPage.iShouldSeeTheComponent("SmartTable", "sap.ui.comp.smarttable.SmartTable");
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		Then.onTheMainPage.iShouldSeeTheComponent("SmartCompactFilterBar", "sap.suite.ui.generic.template.AnalyticalListPage.control.SmartFilterBarExt");
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		Then.onTheMainPage.iShouldSeeTheComponent("SmartVisualFilterBar", "sap.suite.ui.generic.template.AnalyticalListPage.control.visualfilterbar.SmartVisualFilterBar");
		Then.onTheMainPage.iShouldSeeVariantControls();
	});

	opaTest("Check the heading level value for the ALP page variant", function (Given, When, Then) {
		Then.onTheMainPage.iCheckControlPropertiesById("PageVariant", { "visible": true, "headerLevel": "H2" });
	});

	opaTest("Check the heading level value for the Visual filter field title", function (Given, When, Then) {
		Then.onTheMainPage.iCheckControlPropertiesByControlType("sap.m.Title", { "visible": true, "text": "Actual Costs by Cost Element", "level": "H3" });
	});

	opaTest("Check the heading level value for the KPI Tag overflow toolbar title", function (Given, When, Then) {
		When.onTheFilterBar.iClickOnButtonWithText("Go");
		Then.onTheMainPage.iCheckControlPropertiesByControlType("sap.m.Title", { "visible": true, "text": "Project Costs", "level": "H3" });
	});

	opaTest("Check the heading level value for the chart and table on the ALP page", function (Given, When, Then) {
		Then.onTheMainPage.iCheckControlPropertiesById("chart", { "visible": true, "header": "Cost Element Info", "headerLevel": "H4" });
		Then.onTheMainPage.iCheckControlPropertiesById("table", { "visible": true, "header": "Cost Element Info", "headerLevel": "H4" });
	});

	opaTest("Check Keyboard shortcut command of Table Toolbar custom action buttons  action in toolbar", function (Given, When, Then) {
		When.onTheTable.iSelectARow();
		Then.onTheTable.iCheckTableToolbarControlProperty({ "ActionE_tableOnly": [true, true] }, "ZCOSTCENTERCOSTSQUERY0020--analyticalTable", "analyticalTable");
		Then.onTheMainPage.iCheckTheCommandExecutionPropertiesForTheControl("table", { "command": "TableActionCommand", "visible": true, "shortcut": "Ctrl+G" })
		When.onTheGenericAnalyticalListPage.iClickTheButtonHavingLabel("Table Only");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
	});

	opaTest("Check the presence and the Keyboard shortcut command of Global action in toolbar", function (Given, When, Then) {
		Then.onTheGenericAnalyticalListPage.iShouldSeeTheButtonWithLabel("Global");
		Then.onTheMainPage.iCheckTheCommandExecutionPropertiesForTheControl("Page", { "command": "GlobalActionCommand", "visible": true, "shortcut": "Ctrl+B" });
		When.onTheGenericAnalyticalListPage.iClickTheButtonHavingLabel("Global");
		Then.onTheGenericAnalyticalListPage.iShouldSeeTheDialogWithTitle("Global Action Button Clicked");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
	});

	opaTest("Check the Visibility of CF and VF", function (Given, When, Then) {
		Then.onTheFilterBar.iCheckChartTitleInTheBar("Actual Costs by Cost Center | USD");
		Then.onTheFilterBar.iCheckUnitFieldInChart("K", "bar", "CostCenter", true);
	});

	opaTest("Check if selection exists after an in-param chart is selected", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iSelectVFChart("Bar", "300-2000", false, "CostCenter");
		When.onTheGenericAnalyticalListPage.iSelectVFChart("Line", "435000", false, "CostElement");
		When.onTheFilterBar.iClickTheValueHelp("sap-icon://value-help", "CostCenter");
		Then.onTheMainPage.iCheckValueHelpDialogForTokens(["United States Dollar (300-2000)"]);
		When.onTheFilterBar.iClickTheButtonOnTheDialog("OK");
		When.onTheGenericAnalyticalListPage.iDeselectVFChart("Line", "435000", false, "CostElement");
		When.onTheGenericAnalyticalListPage.iDeselectVFChart("Bar", "300-2000", false, "CostCenter");
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		Then.onTheFilterBar.iCheckTokensAreApplied("CostCenter", []);
		Then.onTheFilterBar.iCheckTokensAreApplied("CostElement", []);
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
	});

	opaTest("Check the Visibility of CF and VF", function (Given, When, Then) {
		Then.onTheMainPage.iShouldSeeTheFilterVisibility();
	});

	opaTest("Check the Adapt Filters button in CF Go button mode", function (Given, When, Then) {
		Then.onTheMainPage.iShouldSeeTheAdaptFiltersInGoButtonmode();
	});

	opaTest("Check if InvisibleText is present on mandatory visual filter on the dialog and on adding new visual filter", function (Given, When, Then) {
		When.onTheFilterBar.iClickTheFilterButton();
		Then.onTheVisualFilterDialog.iCheckVisualFilterDialogInvisibleText("visualFilterDialogInvisibleTextCostElement", "CostElement");
		When.onTheGenericAnalyticalListPage.iClickTheLink("More Filters (2)");
		When.onTheVisualFilterDialog.iCheckSelectFilterCheckbox("Planned Costs by Totalled Properties", true, false);
		When.onTheVisualFilterDialog.iCheckSelectFilterCheckbox("Planned Costs by Controlling Area", true, false);
		When.onTheVisualFilterDialog.iClickTheButtonOnTheDialog("OK", "Select Filters");
		Then.onTheVisualFilterDialog.iCheckVisualFilterDialogInvisibleText("visualFilterDialogInvisibleTextTotaledProperties", "");
		Then.onTheVisualFilterDialog.iCheckVisualFilterDialogInvisibleText("visualFilterDialogInvisibleTextControllingArea", "");
	});

	opaTest("Check if InvisibleText is present on mandatory visual filter on the bar and on adding new visual filter", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
		Then.onTheFilterBar.iCheckVisualFilterBarInvisibleText(0, "visualFilterBarInvisibleTextCostElement", "true", "M_VISUAL_FILTERS_MULTIPLE_CURRENCY", "Cost Element");
		Then.onTheFilterBar.iCheckVisualFilterBarInvisibleText(3, "visualFilterBarInvisibleTextTotaledProperties", "", "M_VISUAL_FILTERS_ERROR_DATA_TEXT");
		Then.onTheFilterBar.iCheckVisualFilterBarInvisibleText(4, "visualFilterBarInvisibleTextControllingArea", "", "M_VISUAL_FILTER_HIDDEN_MEASURE", "Planned Costs");
		When.onTheFilterBar.iClickTheFilterButton();
		When.onTheGenericAnalyticalListPage.iClickTheLink("Change Filters");
		When.onTheVisualFilterDialog.iCheckSelectFilterCheckbox("Planned Costs by Totalled Properties", false, false);
		When.onTheVisualFilterDialog.iCheckSelectFilterCheckbox("Planned Costs by Controlling Area", false, false);
		When.onTheVisualFilterDialog.iClickTheButtonOnTheDialog("OK", "Select Filters");
	});

	opaTest("Check if cancel button closes dialog in case nothing is changed inside", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
		When.onTheFilterBar.iClickTheFilterButton();
		Then.onTheGenericAnalyticalListPage.iShouldSeeTheDialogWithTitle("Adapt Filters");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Cancel");
	});

	opaTest("Check if Cancel button cancel's the changes made", function (Given, When, Then) {
		When.onTheFilterBar.iClickTheFilterButton();
		When.onTheVisualFilterDialog.iClickTheSegmentedButton("visual", true);
		When.onTheGenericAnalyticalListPage.iSelectVFChart("Bar", "100-1100", true, "CostCenter");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Cancel");
		Then.onTheVisualFilterDialog.iCheckBarChartSelection();
	});

	opaTest("Switch filter mode to Visual Filter", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		Then.onTheMainPage.iShouldSeeTheComponent("SmartVisualFilterBar", "sap.suite.ui.generic.template.AnalyticalListPage.control.visualfilterbar.SmartVisualFilterBar");
	});

	opaTest("Check the Adapt Filters button in VF Go button mode", function (Given, When, Then) {
		Then.onTheMainPage.iShouldSeeTheAdaptFiltersInGoButtonmode();
	});

	opaTest("Check hidden visual filters are not part of visualfilterbar", function (Given, When, Then) {
		Then.onTheFilterBar.iCheckHiddenFilters(3);
	});

	opaTest("Check if mandatory filter field values are passed to Visual filter chart even if they are not defined as In Parameter", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iSelectVFChart("Bar", "100-1100", false, "CostCenter");
		Then.onTheMainPage.iCheckVFMandatoryFilter("CostCenter", "CostElement", "Bar", "400020", true);
	});

	opaTest("Check hidden visual filters are part of visualfilterbar after enable", function (Given, When, Then) {
		When.onTheFilterBar.iClickTheFilterButton();
		When.onTheGenericAnalyticalListPage.iClickTheLink("More Filters (2)");
		When.onTheVisualFilterDialog.iCheckSelectFilterCheckbox("Planned Costs by Controlling Area ", true, false);
		When.onTheVisualFilterDialog.iClickTheButtonOnTheDialog("OK", "Select Filters");
		Then.onTheVisualFilterDialog.iCheckOverlay(true, "M_VISUAL_FILTER_HIDDEN_MEASURE", 1, "Planned Costs");
		When.onTheVisualFilterDialog.iClickChartButton("Measure");
		When.onTheVisualFilterDialog.iChangeChartProperty(0);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
		Then.onTheFilterBar.iCheckHiddenFilters(4);
	});

	opaTest("Check hidden visual filters are not part of visualfilterbar after disable", function (Given, When, Then) {
		When.onTheFilterBar.iClickTheFilterButton();
		When.onTheGenericAnalyticalListPage.iClickTheLink("More Filters (1)");
		When.onTheVisualFilterDialog.iCheckSelectFilterCheckbox("Actual Costs by Controlling Area   ", false, false);
		When.onTheVisualFilterDialog.iClickTheButtonOnTheDialog("OK", "Select Filters");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
		Then.onTheFilterBar.iCheckHiddenFilters(3);
	});

	opaTest("Check Visibility sync: Make Visual Visible and check if Value Help shows up for chart freshly made visible", function (Given, When, Then) {
		When.onTheFilterBar.iClickTheFilterButton();
		When.onTheGenericAnalyticalListPage.iClickTheLink("More Filters (2)");
		When.onTheVisualFilterDialog.iCheckSelectFilterCheckbox("Actual Costs by Controlling Area ", true, false);
		When.onTheVisualFilterDialog.iClickTheButtonOnTheDialog("OK", "Select Filters");
		When.onTheVisualFilterDialog.iClickTheValueHelp("ControllingArea");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
		When.onTheFilterBar.iClickTheValueHelp("sap-icon://slim-arrow-down", "ControllingArea");
		When.onTheFilterBar.iClickTheButtonOnTheDialog("OK");
		When.onTheFilterBar.iClickTheFilterButton();
		When.onTheVisualFilterDialog.iClickTheSegmentedButton("group", true);
	});

	opaTest("Check if dropdown shows dimensiontext from navigation property", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
		When.onTheFilterBar.iClickTheValueHelp("sap-icon://slim-arrow-down", "ControllingArea");
		Then.onTheFilterBar.iCheckDropdownResponsivePopoverFromNavigationText();
		When.onTheFilterBar.iClickDropdownPopoverOk();
	});

	opaTest("Check VF Chart and Title Width", function (Given, When, Then) {
		When.onTheFilterBar.iClickTheFilterButton();
		When.onTheVisualFilterDialog.iClickToolbarButton("Measure", 1);
		When.onTheVisualFilterDialog.iChangeChartProperty(2);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
		Then.onTheMainPage.iCheckVFChartandTitleWidth();
		When.onTheFilterBar.iClickOnButtonWithText("Go");
	});

	opaTest("Changing chart type to Donut- check chart type", function (Given, When, Then) {
		When.onTheFilterBar.iClickTheFilterButton();
		When.onTheVisualFilterDialog.iClickTheOverflowButtonForTheToolbar("Actual Costs by Cost Center");
		When.onTheGenericAnalyticalListPage.iClickTheButtonWithId("template::VisualFilterDialog::ChartTypeChangeButton::ZCOSTCENTERCOSTSQUERY0020_CDS.ZCOSTCENTERCOSTSQUERY0021Type::CostCenter");
		When.onTheVisualFilterDialog.iChangeChartProperty(1);
		Then.onTheVisualFilterDialog.iCheckTypeOfChart("donut", "CostCenter");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
		Then.onTheMainPage.iCheckFilterCount("2");
	});

	opaTest("View mode switch to Table-only", function (Given, When, Then) {
		When.onTheMainPage.iClickTheSegmentedButton("table");
		Then.onTheMainPage.iShouldSeeTheComponent("Table Container", "sap.ui.comp.smarttable.SmartTable");
	});

	opaTest("Check navigation", function (Given, When, Then) {
		When.onTheMainPage.iClickRowActionButton();
		Then.onTheMainPage.iShouldSeeTheComponent("rowActions", "sap.ui.table.RowAction");
	});

	opaTest("View mode switch to Chart-only", function (Given, When, Then) {
		When.onTheMainPage.iClickTheSegmentedButton("chart");
		Then.onTheMainPage.iShouldSeeTheComponent("Chart Container", "sap.ui.comp.smartchart.SmartChart");
	});

	opaTest("View mode switch to Chart-Table", function (Given, When, Then) {
		When.onTheMainPage.iClickTheSegmentedButton("charttable");
		Then.onTheMainPage.iShouldSeeTheComponent("Table Container", "sap.ui.comp.smarttable.SmartTable");
		Then.onTheMainPage.iShouldSeeTheComponent("Chart Container", "sap.ui.comp.smartchart.SmartChart");
	});

	opaTest("Check for table and chart determining buttons on Hybrid view mode", function (Given, When, Then) {
		Then.onTheMainPage.iShouldSeeTheComponent("Determining", "sap.m.Button");
		Then.onTheMainPage.iShouldSeeTheComponent("Copy", "sap.m.Button");
	});

	opaTest("Changing chart type to Bar back", function (Given, When, Then) {
		When.onTheFilterBar.iClickTheFilterButton();
		When.onTheVisualFilterDialog.iClickToolbarButton("Chart Type", 1);
		When.onTheVisualFilterDialog.iChangeChartProperty(0);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
		Then.onTheMainPage.iCheckFilterCount("2");
	});

	opaTest("Check to see all action buttons rendering with valid id", function (Given, When, Then) {
		Then.onTheMainPage.iShouldSeeActionButtonsWithValidId();
	});

	opaTest("Check for Require Selection Buttons on Table toolbar", function (Given, When, Then) {
		When.onTheMainPage.iClickTheSegmentedButton("table");
		When.onTheTable.iSelectARow();
		Then.onTheMainPage.theCustomToolbarForTheSmartTableIsRenderedWithRequireSelectionCorrectly(true);
		When.onTheTable.iClearSelection();
		Then.onTheMainPage.theCustomToolbarForTheSmartTableIsRenderedWithRequireSelectionCorrectly(false);
	});

	opaTest("Check if a property having unconfigured semantic object and quick view annotations is rendered as link", function (Given, When, Then) {
		Then.onTheTable.iCheckIfColumnTemplateIsRenderedAsLink("CostElement");
		Then.iTeardownMyApp();
	});

	opaTest("Check filterable KPI gets hidden in toolbar", function (Given, When, Then) {
		Given.iStartMyAppInDemokit("analytics2", null, null, { width: "750", height: "500" });
		When.onTheVisualFilterDialog.iAddFilterValueInCompactDialog("Cost Element", "400020");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
		When.onTheFilterBar.iClickOnButtonWithText("Go");
		Then.onTheMainPage.iCheckTheChartTableSegmentedButtonDoesNotOverflow();
		Then.onTheGenericAnalyticalListPage.iShouldSeeTheButtonWithId("template::KPITagContainer::filterableKPIs-overflowButton");
		When.onTheGenericAnalyticalListPage.iClickTheButtonWithId("template::KPITagContainer::filterableKPIs-overflowButton");
		Then.onTheMainPage.iShouldSeeTheComponent("template::KPITag::kpi::ActualMarginRelative5", "sap.suite.ui.generic.template.AnalyticalListPage.control.SmartKpiTag", { id: "template::KPITag::kpi::ActualMarginRelative5" });
		When.onTheGenericAnalyticalListPage.iClickTheButtonWithId("template::KPITagContainer::filterableKPIs-overflowButton");
		Then.iTeardownMyApp();
	});
});
