/*global opaTest QUnit */
sap.ui.define([
	"sap/ui/test/opaQunit",
	"sap/suite/ui/generic/template/integration/AnalyticalListPage/journeys/FilterBarJourney"
], function () {

	"use strict";

	QUnit.module("AnalyticalListPage - FilterDialogJourney");

	opaTest("Switch filter mode to Visual Filter", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		Then.onTheMainPage.iCheckVisualFilterCharts(3);
	});
	opaTest("Check for disabled measures button", function (Given, When, Then) {
		Then.onTheFilterBar.iCheckHiddenFilters(3);
		When.onTheFilterBar.iClickTheFilterButton();
		When.onTheVisualFilterDialog.iSetShowOnFilterBarCheckBoxState(false, 0);
		When.onTheGenericAnalyticalListPage.iClickTheLink("More Filters (2)");
		When.onTheVisualFilterDialog.iCheckSelectFilterCheckbox("Planned Costs by Totalled Properties", true, false);
		When.onTheVisualFilterDialog.iClickTheButtonOnTheDialog("OK", "Select Filters");
		Then.onTheGenericAnalyticalListPage.checkButtonEnablement("template::VisualFilterDialog::MeasureChangeButton::ZCOSTCENTERCOSTSQUERY0020_CDS.ZCOSTCENTERCOSTSQUERY0022Type::TotaledProperties");
		When.onTheVisualFilterDialog.iSetShowOnFilterBarCheckBoxState(true, 0);
		When.onTheGenericAnalyticalListPage.iClickTheLink("More Filters (1)");
		When.onTheVisualFilterDialog.iCheckSelectFilterCheckbox("Planned Costs by Totalled Properties", false, false);
		When.onTheVisualFilterDialog.iClickTheButtonOnTheDialog("OK", "Select Filters");
	});

	opaTest("Check Measure UI.Hidden Overlay Message", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickTheLink("More Filters (2)");
		When.onTheVisualFilterDialog.iCheckSelectFilterCheckbox("Planned Costs by Totalled Properties", true, false);
		When.onTheVisualFilterDialog.iCheckSelectFilterCheckbox("Planned Costs by Controlling Area", true, false);
		When.onTheVisualFilterDialog.iClickTheButtonOnTheDialog("OK", "Select Filters");
		Then.onTheVisualFilterDialog.iCheckOverlay(true, "M_VISUAL_FILTER_HIDDEN_MEASURE", 1, "Planned Costs");
		When.onTheGenericAnalyticalListPage.iClickTheLink("Change Filters");
		When.onTheVisualFilterDialog.iCheckSelectFilterCheckbox("Planned Costs by Totalled Properties", false, false);
		When.onTheVisualFilterDialog.iCheckSelectFilterCheckbox("Planned Costs by Controlling Area", false, false);
		When.onTheVisualFilterDialog.iClickTheButtonOnTheDialog("OK", "Select Filters");
	});

	opaTest("Check for enabled sort order and chart type change buttons", function (Given, When, Then) {
		When.onTheVisualFilterDialog.iClickTheOverflowButtonForTheToolbar("Actual Costs by Cost Center");
		Then.onTheGenericAnalyticalListPage.iShouldSeeTheButtonWithId("template:::VisualFilterDialog:::ValueHelpButton:::sProperty::CostCenter");
		Then.onTheGenericAnalyticalListPage.iShouldSeeTheButtonWithId("template::VisualFilterDialog::SortOrderChangeButton::ZCOSTCENTERCOSTSQUERY0020_CDS.ZCOSTCENTERCOSTSQUERY0021Type::CostCenter");
		Then.onTheGenericAnalyticalListPage.iShouldSeeTheButtonWithId("template::VisualFilterDialog::ChartTypeChangeButton::ZCOSTCENTERCOSTSQUERY0020_CDS.ZCOSTCENTERCOSTSQUERY0021Type::CostCenter");
	});

	opaTest("Check for aria-haspopup", function (Given, When, Then) {
		Then.onTheFilterBar.iCheckForButtonWithAriaHasPopup("template:::VisualFilterDialog:::ValueHelpButton:::sProperty::CostCenter", true);
		Then.onTheFilterBar.iCheckForButtonWithAriaHasPopup("template::VisualFilterDialog::SortOrderChangeButton::ZCOSTCENTERCOSTSQUERY0020_CDS.ZCOSTCENTERCOSTSQUERY0021Type::CostCenter", true);
		Then.onTheFilterBar.iCheckForButtonWithAriaHasPopup("template::VisualFilterDialog::ChartTypeChangeButton::ZCOSTCENTERCOSTSQUERY0020_CDS.ZCOSTCENTERCOSTSQUERY0021Type::CostCenter", true);
		Then.onTheFilterBar.iCheckForButtonWithAriaHasPopup("template::VisualFilterDialog::MeasureChangeButton::ZCOSTCENTERCOSTSQUERY0020_CDS.ZCOSTCENTERCOSTSQUERY0021Type::CostCenter", true);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Cancel");
		Then.onTheFilterBar.iCheckForButtonWithAriaHasPopup("template:::VisualFilterBar:::ValueHelpButton:::sProperty::CostCenter", false);
		Then.onTheFilterBar.iCheckForButtonWithAriaHasPopup("template::VisualFilterDialogButton", false);
	});

	opaTest("Check Support of Value help button", function (Given, When, Then) {
		When.onTheFilterBar.iClickTheFilterButton();
		When.onTheVisualFilterDialog.iClickTheSegmentedButton("visual", true);
		When.onTheVisualFilterDialog.iClickTheValueHelp("CostCenter");
		When.onTheFilterBar.iClickOnButtonWithText("Go", true);
		When.onTheFilterBar.iMakeSelection([2]);
		When.onTheFilterBar.iClickTheButtonOnTheDialog("OK");
		Then.onTheVisualFilterDialog.iCheckSelectedButtonCount(2, "Cost Center");
	});

	opaTest("Check tooltip for value help button on the VFD- VH with selections", function (Given, When, Then) {
		Then.onTheVisualFilterDialog.iCheckVHTooltip("Bar", "Cost Center", "VH_MULTI_SELECTED", 2);
	});

	opaTest("Check VF Labels as per Text Arrangement Annotation", function (Given, When, Then) {
		Then.onTheFilterBar.iCheckVFLabelforTextArangement("Bar", "TextFirst", true);
	});

	opaTest("Make selection to a chart which is in parameter to a hidden chart", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iSelectVFChart("bar", "300-2000", true, "CostCenter");
		When.onTheGenericAnalyticalListPage.iClickTheLink("More Filters (2)");
		When.onTheVisualFilterDialog.iCheckSelectFilterCheckbox("Planned Costs by Controlling Area", true, false);
		When.onTheVisualFilterDialog.iClickTheButtonOnTheDialog("OK", "Select Filters");
		When.onTheVisualFilterDialog.iClickChartButton("Chart Type");
		When.onTheVisualFilterDialog.iChangeChartProperty(1);
		When.onTheGenericAnalyticalListPage.iClickTheLink("More Filters (1)");
		When.onTheVisualFilterDialog.iCheckSelectFilterCheckbox("Planned Costs by Controlling Area", false, false);
		When.onTheVisualFilterDialog.iClickTheButtonOnTheDialog("OK", "Select Filters");
	});

	opaTest("Check visibility of BASIC group when more than one group is present", function (Given, When, Then) {
		When.onTheVisualFilterDialog.iClickTheSegmentedButton("visual", true);
		Then.onTheVisualFilterDialog.iCheckControlPropertiesByControlType("sap.m.Title", { "visible": true, "text": "Basic" });
		Then.onTheVisualFilterDialog.iCheckControlPropertiesByControlType("sap.m.Title", { "visible": true, "text": "ZCOSTCENTERCOSTSQUERY0020" });
	});
	opaTest("Check if chart is colored Criticality information is given in the datapoint Annotation", function (Given, When, Then) {
		Then.onTheFilterBar.isChartColored("InteractiveBarChart", "CostCenter", ["Error", "Good", "Good"], true);
	});

	opaTest("check show on filter bar checkbox", function (Given, When, Then) {
		Then.onTheVisualFilterDialog.iCheckShowOnFilterBarCheckBox();
	});
	opaTest("check VF charts rendering based on show on filter bar checkbox enable/disable", function (Given, When, Then) {
		When.onTheVisualFilterDialog.iSetShowOnFilterBarCheckBoxState(false, 1);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
		Then.onTheMainPage.iCheckVisualFilterCharts(2);
		When.onTheFilterBar.iClickTheFilterButton();
		When.onTheVisualFilterDialog.iSetShowOnFilterBarCheckBoxState(true, 1);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
		Then.onTheMainPage.iCheckVisualFilterCharts(3);
		When.onTheFilterBar.iClickTheFilterButton();
	});
	opaTest("Check if chart is NOT colored when Measure in datapoint doesn't match Chart measure", function (Given, When, Then) {
		Then.onTheFilterBar.isChartColored("InteractiveBarChart", "CostCenter", ["Error", "Good", "Good"], true);
		Then.iTeardownMyApp();
	});

	opaTest("Open app without values for mandatory fields", function (Given, When, Then) {
		Given.iStartMyAppInDemokit("analytics2");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Cancel");
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
	});
	opaTest("Check Scale Factor on Visual Filter", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage
			.iSetTheFilter({Field: "CostElement", Value: "400020"})
			.and
			.iSetTheFilter({Field: "DisplayCurrency", Value: "USD"})
			.and
			.iClickOnFilterSwitchButton("visual");
		When.onTheFilterBar.iClickTheFilterButton();
		Then.onTheVisualFilterDialog.iCheckChartScale(undefined, "");
		When.onTheVisualFilterDialog.iClickTheOverflowButtonForTheToolbar("Actual Costs by Cost Center");
		When.onTheGenericAnalyticalListPage.iClickTheButtonWithId("template::VisualFilterDialog::MeasureChangeButton::ZCOSTCENTERCOSTSQUERY0020_CDS.ZCOSTCENTERCOSTSQUERY0021Type::CostCenter");
		Then.onTheVisualFilterDialog.iCheckForHiddenMeasure("Planned Costs");
		When.onTheVisualFilterDialog.iChangeChartProperty(1);
		Then.onTheVisualFilterDialog.iCheckChartScale(1000, "K");
		When.onTheVisualFilterDialog.iClickTheOverflowButtonForTheToolbar("Actual Costs by Cost Center");
		When.onTheGenericAnalyticalListPage.iClickTheButtonWithId("template::VisualFilterDialog::MeasureChangeButton::ZCOSTCENTERCOSTSQUERY0020_CDS.ZCOSTCENTERCOSTSQUERY0021Type::CostCenter");
		Then.onTheVisualFilterDialog.iCheckForHiddenMeasure("Planned Costs");
		When.onTheVisualFilterDialog.iChangeChartProperty(2);
		Then.onTheVisualFilterDialog.iCheckChartScale(1, undefined);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
	});
	opaTest("Check overlay", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		When.onTheGenericAnalyticalListPage
			.iSetTheFilter({Field: "CostElement", Value: "400021"})
			.and
			.iSetTheFilter({Field: "DisplayCurrency", Value: ""})
			.and
			.iClickOnFilterSwitchButton("visual");
		Then.onTheFilterBar.iCheckOverlay(true, "M_VISUAL_FILTERS_MULTIPLE_CURRENCY", 1, "Cost Element");
		When.onTheFilterBar.iClickTheFilterButton();
		Then.onTheVisualFilterDialog.iCheckOverlay(true, "M_VISUAL_FILTERS_MULTIPLE_CURRENCY", 1, "Cost Element");
		When.onTheGenericAnalyticalListPage
			.iClickTheButtonOnTheDialogWithLabel("Cancel")
			.and
			.iClickOnFilterSwitchButton("compact")
			.and
			.iSetTheFilter({Field: "DisplayCurrency", Value: "USD"})
			.and
			.iClickOnFilterSwitchButton("visual");
		When.onTheFilterBar.iClickTheFilterButton();
		Then.onTheVisualFilterDialog.iCheckOverlay(false, "INVALID_MEASURE_DONUT_MESSAGE", 2);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
		Then.onTheFilterBar.iCheckOverlay(true, "INVALID_MEASURE_DONUT_MESSAGE", 2);
	});

	opaTest("Valid/Invalid Measure - Donut Chart", function (Given, When, Then) {
		Then.onTheFilterBar.iCheckOverlay(true, "INVALID_MEASURE_DONUT_MESSAGE", 1);
		When.onTheFilterBar.iClickTheFilterButton();
		Then.onTheVisualFilterDialog.iCheckOverlay(true, "INVALID_MEASURE_DONUT_MESSAGE", 1);
		When.onTheVisualFilterDialog.iClickToolbarButton("Chart Type", 1);
		When.onTheVisualFilterDialog.iChangeChartProperty(0);
		Then.onTheVisualFilterDialog.iCheckOverlay(false, "INVALID_MEASURE_DONUT_MESSAGE", 2);
		When.onTheVisualFilterDialog.iClickToolbarButton("Measure", 1);
		When.onTheVisualFilterDialog.iChangeChartProperty(2);
		When.onTheVisualFilterDialog.iClickToolbarButton("Chart Type", 1);
		When.onTheVisualFilterDialog.iChangeChartProperty(1);
		Then.onTheVisualFilterDialog.iCheckOverlay(false, "INVALID_MEASURE_DONUT_MESSAGE", 2);
		When.onTheVisualFilterDialog.iClickToolbarButton("Chart Type", 1);
		When.onTheVisualFilterDialog.iChangeChartProperty(1);
		Then.onTheVisualFilterDialog.iCheckOverlay(false, "INVALID_MEASURE_DONUT_MESSAGE", 2);
		When.onTheVisualFilterDialog.iClickToolbarButton("Measure", 1);
		When.onTheVisualFilterDialog.iChangeChartProperty(1);
		Then.onTheVisualFilterDialog.iCheckOverlay(true, "INVALID_MEASURE_DONUT_MESSAGE", 2);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Cancel");
		Then.iTeardownMyApp();
	});
});
