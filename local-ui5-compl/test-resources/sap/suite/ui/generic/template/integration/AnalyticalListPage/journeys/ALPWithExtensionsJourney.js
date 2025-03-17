/*global opaTest QUnit */
sap.ui.define(["sap/ui/test/opaQunit"], function () {

	"use strict";

	QUnit.module("AnalyticalListPage - ALPWithExtensionsJourney");

	opaTest("Check if the Analytical List Page Extension App is up", function (Given, When, Then) {
		Given.iStartMyAppInDemokit("analytics4", "manifestWithoutMapView", null, { width: "1100", height: "600" });
		Then.onTheMainPage.iShouldSeeTheComponent("KPI", "sap.suite.ui.generic.template.AnalyticalListPage.control.SmartKpiTag");
		Then.onTheMainPage.iShouldSeeTheComponent("SmartTable", "sap.ui.comp.smarttable.SmartTable");
		Then.onTheMainPage.iShouldSeeVariantControls();
	});

	opaTest("Check if semantic coloring for dimension is applied as expected", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		Then.onTheFilterBar.isChartColored("InteractiveBarChart", "CostCenter", ["Good", "Critical", "Good"], false);
		Then.onTheFilterBar.isChartColored("InteractiveDonutChart", "Supplier", ["Good", "Error", "Good"], false);
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		When.onTheGenericAnalyticalListPage.iSetTheFilter({Field: "CostElement", Value: "421000"});
		Then.onTheFilterBar.isFilterAppliedOnFilterBar("CostElement", "421000");
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		Then.onTheFilterBar.isChartColored("InteractiveBarChart", "CostCenter", ["Error", "Good", "Critical"], false);
		Then.onTheFilterBar.isChartColored("InteractiveDonutChart", "Supplier", ["Good", "Error", "Good"], false);
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		When.onTheGenericAnalyticalListPage.iSetTheFilter({Field: "CostElement", Value: ""});
		Then.onTheFilterBar.isFilterNotAppliedOnFilterBar("CostElement", "421000");
	});

	opaTest("Check the default values and available options for single value DateTime field", function (Given, When, Then) {
		Then.onTheFilterBar.iCheckTheValueOfDateRangeField("SmartFilterBar-filterItemControl_BASIC-StartDate", { key: "StartDate", operator: "TODAY" });
		Then.onTheFilterBar.iCheckTheAvailableOptionsForDateRangeField("SmartFilterBar-filterItemControl_BASIC-StartDate", ['DATE', 'YESTERDAY', 'TODAY', 'FIRSTDAYWEEK',
			'LASTDAYWEEK', 'FIRSTDAYMONTH', 'LASTDAYMONTH', 'FIRSTDAYQUARTER', 'LASTDAYQUARTER', 'FIRSTDAYYEAR', 'LASTDAYYEAR']);
	});

	opaTest("Check the available options for field with type String and semantics yearmonthday", function (Given, When, Then) {
		Then.onTheFilterBar.iCheckTheAvailableOptionsForDateRangeField("SmartFilterBar-filterItemControl_BASIC-EndDate", ['DATE', 'YESTERDAY', 'TODAY', 'TOMORROW', 'FIRSTDAYWEEK', 'LASTDAYWEEK']);
	});

	opaTest("Check the default values and available options for interval value DateTime field", function (Given, When, Then) {
		Then.onTheFilterBar.iCheckTheValueOfDateRangeField("SmartFilterBar-filterItemControl_BASIC-SemanticDate2", { key: "SemanticDate2", operator: "LASTYEAR" });
		Then.onTheFilterBar.iCheckTheAvailableOptionsForDateRangeField("SmartFilterBar-filterItemControl_BASIC-SemanticDate2", ['DATERANGE', 'DATE', 'FROM', 'TO', 'LASTDAYS', 'LASTWEEKS', 'LASTYEARS', 'NEXTDAYS', 'NEXTWEEKS', 'NEXTYEARS', 'YESTERDAY', 'TOMORROW', 'THISWEEK', 'LASTWEEK', 'LAST2WEEKS', 'LAST3WEEKS', 'LAST4WEEKS', 'LAST5WEEKS', 'NEXTWEEK', 'NEXT2WEEKS', 'NEXT3WEEKS', 'NEXT4WEEKS', 'NEXT5WEEKS', 'YEARTODATE', 'THISYEAR', 'LASTYEAR', 'TODAYFROMTO', 'DATETOYEAR', 'LASTDAYSINCLUDED', 'LASTWEEKSINCLUDED', 'LASTMONTHSINCLUDED', 'LASTYEARSINCLUDED', 'NEXTDAYSINCLUDED', 'NEXTWEEKSINCLUDED', 'NEXTMONTHSINCLUDED', 'NEXTYEARSINCLUDED']);
	});

	opaTest("Check available options for interval value DateTimeOffset field", function (Given, When, Then) {
		Then.onTheFilterBar.iCheckTheAvailableOptionsForDateRangeField("SmartFilterBar-filterItemControl_BASIC-SemanticDate3", ['NEXTMINUTES', 'NEXTHOURS', 'LASTMINUTES', 'LASTHOURS', 'LASTMINUTESINCLUDED', 'LASTHOURSINCLUDED', 'NEXTMINUTESINCLUDED', 'NEXTHOURSINCLUDED', 'DATE', 'FROM', 'TO', 'LASTWEEKS', 'NEXTWEEKS', 'YESTERDAY', 'TODAY', 'TOMORROW', 'THISWEEK', 'LASTWEEK', 'LAST2WEEKS', 'LAST3WEEKS', 'LAST4WEEKS', 'LAST5WEEKS', 'NEXTWEEK', 'NEXT2WEEKS', 'NEXT3WEEKS', 'NEXT4WEEKS', 'NEXT5WEEKS', 'TODAYFROMTO', 'LASTWEEKSINCLUDED', 'NEXTWEEKSINCLUDED', 'DATETIME', 'DATETIMERANGE']);
	});

	opaTest("Check the default values and available options for custom daterange implementation field", function (Given, When, Then) {
		var currentYear = new Date().getFullYear();
		Then.onTheFilterBar.iCheckControlPropertiesById("SmartFilterBar-filterItemControl_BASIC-SemanticDate1-input", { "visible": true, "value": "Jan 1, " + currentYear + " - Dec 31, " + currentYear });
		Then.onTheFilterBar.iCheckTheAvailableOptionsForDateRangeField("SmartFilterBar-filterItemControl_BASIC-SemanticDate1", ['DATERANGE', 'DATE', 'FROM', 'TO', 'LASTDAYS', 'LASTWEEKS', 'LASTMONTHS', 'LASTQUARTERS', 'LASTYEARS', 'NEXTDAYS', 'NEXTWEEKS', 'NEXTMONTHS', 'NEXTQUARTERS', 'NEXTYEARS', 'SPECIFICMONTH', 'YESTERDAY', 'TODAY', 'TOMORROW', 'THISWEEK', 'LASTWEEK', 'LAST2WEEKS', 'LAST3WEEKS', 'LAST4WEEKS', 'LAST5WEEKS', 'NEXTWEEK', 'NEXT2WEEKS', 'NEXT3WEEKS', 'NEXT4WEEKS', 'NEXT5WEEKS', 'THISMONTH', 'LASTMONTH', 'NEXTMONTH', 'THISQUARTER', 'LASTQUARTER', 'NEXTQUARTER', 'YEARTODATE', 'THISYEAR', 'LASTYEAR', 'NEXTYEAR', 'QUARTER1', 'QUARTER2', 'QUARTER3', 'QUARTER4', 'TODAYFROMTO', 'DATETOYEAR', 'LASTDAYSINCLUDED', 'LASTWEEKSINCLUDED', 'LASTMONTHSINCLUDED', 'LASTQUARTERSINCLUDED', 'LASTYEARSINCLUDED', 'NEXTDAYSINCLUDED', 'NEXTWEEKSINCLUDED', 'NEXTMONTHSINCLUDED', 'NEXTQUARTERSINCLUDED', 'NEXTYEARSINCLUDED']);
	});

	opaTest("Check the Date value set from Compact filter is available in the Visual filter", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iSetTheFilter({ Field: "EndDate", Value: "Jun 3, 2018" });
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		Then.onTheFilterBar.iCheckSelectedButtonCount(1, "Date");
		When.onTheGenericAnalyticalListPage.iClickTheButtonWithId("template:::VisualFilterBar:::ValueHelpButton:::sProperty::StartDate");
		Then.onTheFilterBar.iCheckTheSelectedItemInTheList("Today");
		Then.onTheFilterBar.iCheckSelectedButtonCount(1, "StringDate");
		Then.onTheFilterBar.iCheckVFChartSelected("line", "20180603", "EndDate");
		When.onTheGenericAnalyticalListPage.iClickTheButtonWithId("template:::VisualFilterBar:::ValueHelpButton:::sProperty::EndDate");
		Then.onTheFilterBar.iCheckTheSelectedItemInTheList("Date");
	});

	opaTest("Check the Date value set from visual filter is available in the compact filter ", function (Given, When, Then) {
		When.onTheFilterBar.iSelectTheItemInTheList("Tomorrow");
		Then.onTheFilterBar.iCheckSelectedButtonCount(1, "StringDate");
		When.onTheGenericAnalyticalListPage.iClickTheButtonWithId("template:::VisualFilterBar:::ValueHelpButton:::sProperty::StartDate");
		When.onTheFilterBar.iSelectTheItemInTheList("First Day in This Week");
		Then.onTheFilterBar.iCheckSelectedButtonCount(1, "Date");
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		Then.onTheFilterBar.iCheckTheValueOfDateRangeField("SmartFilterBar-filterItemControl_BASIC-EndDate", { key: "EndDate", operator: "TOMORROW" });
		Then.onTheFilterBar.iCheckTheValueOfDateRangeField("SmartFilterBar-filterItemControl_BASIC-StartDate", { key: "StartDate", operator: "FIRSTDAYWEEK" });
	});

	opaTest("Check if filtering works as expected with Semantic Dates", function (Given, When, Then) {
		var previousYear = new Date().getFullYear() - 1;
		When.onTheGenericAnalyticalListPage.iSetTheFilter({ Field: "StartDate", Value: "" });
		When.onTheGenericAnalyticalListPage.iSetTheFilter({ Field: "EndDate", Value: "" });
		Then.onTheFilterBar.isFilterAppliedOnFilterBar("SemanticDate2", new Date("Jan 1, " + previousYear + ""));
		When.onTheFilterBar.iClickInputValuehelp("SemanticDate1");
		Then.onTheFilterBar.iCheckTheItemsInDateRangePopOverList(35, "SemanticDate1-RP-popover");
		When.onTheGenericAnalyticalListPage.iSetTheFilter({ Field: "SemanticDate1", Value: "From Jan 1, 2020" });
		When.onTheGenericAnalyticalListPage.iSetTheFilter({ Field: "SemanticDate2", Value: "From Jan 1, 2021" });
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		Then.onTheMainPage.iCheckNumberOfItemsInTable(6, "gridTable", "gridTable");
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		When.onTheFilterBar.iClickInputValuehelp("SemanticDate2");
		Then.onTheFilterBar.iCheckTheItemsInDateRangePopOverList(20, "SemanticDate2-RP-popover");
		When.onTheGenericAnalyticalListPage.iSetTheFilter({ Field: "SemanticDate2", Value: "From Jan 1, 2009" });
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		Then.onTheMainPage.iCheckNumberOfItemsInTable(106, "gridTable", "gridTable");
	});

	opaTest("Check if dropdown filtering works as expected with in in-params", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		Then.onTheFilterBar.isFilterAppliedOnFilterBar("DisplayCurrency", "USD");
		When.onTheGenericAnalyticalListPage.iSetTheFilter({Field: "CostElement", Value: "400020"});
		Then.onTheFilterBar.isFilterAppliedOnFilterBar("CostElement", "400020");
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		When.onTheGenericAnalyticalListPage.iSelectVFChart("bar", "100-1100", false, "CostCenter");
		When.onTheFilterBar.iClickSelectedButton(1);
		Then.onTheFilterBar.iSeeDropdownListItems(7);
		Then.iTeardownMyApp();
	});

	opaTest("Check if the Analytical List Page Extension App is up", function (Given, When, Then) {
		Given.iStartMyAppInDemokit("analytics4", "manifestWithoutMapView", null, { width: "1100", height: "700" });
		Then.onTheMainPage.iShouldSeeTheComponent("KPI", "sap.suite.ui.generic.template.AnalyticalListPage.control.SmartKpiTag");
		Then.onTheMainPage.iShouldSeeTheComponent("SmartTable", "sap.ui.comp.smarttable.SmartTable");
		Then.onTheFilterBar.isFilterAppliedOnFilterBar("DisplayCurrency", "USD");
		When.onTheGenericAnalyticalListPage.iSetTheFilter({ Field: "StartDate", Value: "" });
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		Then.onTheMainPage.iShouldSeeVariantControls();
	});

	opaTest("Pin Button should not be Present", function (Given, When, Then) {
		Then.onTheFilterBar.iCheckControlPropertiesByControlType("sap.f.DynamicPageHeader", { "visible": true, "pinnable": false });
	});

	opaTest("KpiTagTooltipCheck for Undetermined", function (Given, When, Then) {
		Then.onTheMainPage.iCheckKpiTagTooltip(0, "Actual Cost 2,000.00 EUR", "Error");
		Then.onTheMainPage.iCheckKpiTagTooltip(1, "Actual Margin Relative 0.31", "Neutral");
		Then.onTheMainPage.iCheckKpiTagTooltip(2, "TargetMargin 800.00", "Risk");
	});

	opaTest("Check the Adapt Filters visibility in VF Live mode if FilterBar collapsed", function (Given, When, Then) {
		When.onTheMainPage.iClickFilterBarHeader();
		Then.onTheMainPage.iShouldSeeTheAdaptFiltersVisibilityInLivemode();
		When.onTheMainPage.iClickFilterBarHeader();
		Then.onTheMainPage.iShouldSeeTheAdaptFiltersVisibilityInLivemode();
	});

	opaTest("Check VF Labels in FilterBar as per Text Arrangement Annotation", function (Given, When, Then) {
		Then.onTheFilterBar.iCheckVFLabelforTextArangement("Bar", "TextLast", false);
	});

	opaTest("Check if the table is Grid Table", function (Given, When, Then) {
		Then.onTheTable.iCheckControlPropertiesByControlType("sap.ui.table.Table", { "visible": true });
	});

	opaTest("Check tooltip for value help button on the VF bar - only VH", function (Given, When, Then) {
		Then.onTheFilterBar.iCheckVHTooltip("Line", "Start Date", "DP_WITHOUT_SELECTIONS");
	});

	opaTest("Check tooltip for value help button on the VF bar - no VH, no Selections", function (Given, When, Then) {
		Then.onTheFilterBar.iCheckVHTooltip("Bar", "Cost Center", "DROPDOWN_WITHOUT_SELECTIONS");
	});

	opaTest("Check Restore button on dialog", function (Given, When, Then) {
		When.onTheFilterBar.iClickTheFilterButtonInOverflowToolbar();
		Then.onTheVisualFilterDialog.iCheckChartButton("Reset");
	});

	opaTest("Check Cancel button on dialog", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Cancel");
		Then.onTheMainPage.iCheckFilterCountInOverflowToolbar("3");
	});

	opaTest("Check Date format", function (Given, When, Then) {
		Then.onTheFilterBar.iCheckDateFormat("StartDate", false);
	});

	opaTest("Valid/Invalid Measure - Donut Chart", function (Given, When, Then) {
		Then.onTheFilterBar.iCheckNoOverlayForChart(false, 2);
		Then.onTheFilterBar.iCheckNoOverlayForChart(false, 4);
		When.onTheFilterBar.iClickTheFilterButton();
		Then.onTheVisualFilterDialog.iCheckOverlay(false, "INVALID_MEASURE_DONUT_MESSAGE", 0);
		When.onTheVisualFilterDialog.iClickToolbarButton("Measure", 1);
		When.onTheVisualFilterDialog.iChangeChartProperty(2);
		Then.onTheVisualFilterDialog.iCheckOverlay(true, "INVALID_MEASURE_DONUT_MESSAGE", 1);
		When.onTheVisualFilterDialog.iClickToolbarButton("Chart Type", 1);
		When.onTheVisualFilterDialog.iChangeChartProperty(0);
		Then.onTheVisualFilterDialog.iCheckOverlay(false, "INVALID_MEASURE_DONUT_MESSAGE", 0);
		When.onTheVisualFilterDialog.iClickToolbarButton("Chart Type", 3);
		When.onTheVisualFilterDialog.iChangeChartProperty(1);
		Then.onTheVisualFilterDialog.iCheckOverlay(true, "INVALID_MEASURE_DONUT_MESSAGE", 1);
		When.onTheVisualFilterDialog.iClickToolbarButton("Measure", 3);
		When.onTheVisualFilterDialog.iChangeChartProperty(1);
		Then.onTheVisualFilterDialog.iCheckOverlay(false, "INVALID_MEASURE_DONUT_MESSAGE", 0);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Cancel");
	});

	opaTest("Check VF Select button count for value-help", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iSelectVFChart("bar", "200-3000", false, "CostCenter");
		When.onTheGenericAnalyticalListPage.iSelectVFChart("line", "400020", false, "CostElement")
			.and
			.iSelectVFChart("line", "400021", false, "CostElement")
			.and
			.iSelectVFChart("line", "410050", false, "CostElement");
		Then.onTheFilterBar.iCheckVFChartSelected("line", "400021", "CostElement")
			.and
			.iCheckVFChartSelected("line", "410050", "CostElement");
		Then.onTheFilterBar.iCheckSelectedButtonCount(3, "Cost Element");
		Then.onTheFilterBar.iCheckVHTooltip("Line", "Cost Element", "VH_MULTI_SELECTED", 3);
	});

	opaTest("Check VF Select button delete value-help", function (Given, When, Then) {
		When.onTheFilterBar.iClickSelectedButton(3);
		When.onTheFilterBar.iClickSelectedButtonDeleteIcon(1);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
	});

	opaTest("Check VF Select button Clear All value-help", function (Given, When, Then) {
		When.onTheFilterBar.iClickSelectedButton(2);
		When.onTheFilterBar.iClickSelectedButtonRemove();
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
	});

	opaTest("Check VFD Select button count for value-help", function (Given, When, Then) {
		When.onTheFilterBar.iClickTheFilterButtonInOverflowToolbar();
		When.onTheGenericAnalyticalListPage.iSelectVFChart("line", "400020", true, "CostElement")
			.and
			.iSelectVFChart("line", "400021", true, "CostElement")
			.and
			.iSelectVFChart("line", "410050", true, "CostElement");
		Then.onTheFilterBar.iCheckVFChartSelected("line", "400021", "CostElement").and.iCheckVFChartSelected("line", "410050", "CostElement");
		Then.onTheVisualFilterDialog.iCheckSelectedButtonCount(3, "Cost Element");
		Then.onTheVisualFilterDialog.iCheckVHTooltip("Line", "Cost Element", "VH_MULTI_SELECTED", 3);
	});

	opaTest("Check VFD Select button delete value-help", function (Given, When, Then) {
		When.onTheVisualFilterDialog.iClickSelectedButton(3);
		When.onTheVisualFilterDialog.iClickSelectedButtonDeleteIcon(1);
		When.onTheVisualFilterDialog.iClickTheButtonOnTheDialog("OK");
	});

	opaTest("Check VFD Select button Clear All value-help", function (Given, When, Then) {
		When.onTheVisualFilterDialog.iClickSelectedButton(2);
		When.onTheVisualFilterDialog.iClickSelectedButtonRemove();
		When.onTheVisualFilterDialog.iClickTheButtonOnTheDialog("OK");
	});

	opaTest("Check tooltip for value help button on the VFD - no VH, no Selections", function (Given, When, Then) {
		Then.onTheVisualFilterDialog.iCheckVHTooltip("Line", "Cost Element", "VALUE_HELP");
	});

	opaTest("Check VFD Select button count for non value-help", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iSelectVFChart("bar", "200-3000", true, "CostCenter");
		Then.onTheFilterBar.iCheckVFChartSelected("bar", "200-3000", "CostCenter");
		Then.onTheVisualFilterDialog.iCheckSelectedButtonCount(2, "Cost Center");
	});

	opaTest("Check tooltip for selections button on the VFD - only selections", function (Given, When, Then) {
		Then.onTheVisualFilterDialog.iCheckVHTooltip("Bar", "Cost Center", "DROPDOWN_WITH_SELECTIONS", 2);
	});

	opaTest("Check VF Labels in VFD as per Text Arrangement Annotation", function (Given, When, Then) {
		Then.onTheFilterBar.iCheckVFLabelforTextArangement("Bar", "TextLast", true);
	});

	opaTest("Check VF Labels in VFD popover as per Text Arrangement Annotation", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickTheButtonWithId("template:::VisualFilterDialog:::ValueHelpButton:::sProperty::CostCenter");
		Then.onTheFilterBar.iCheckPopoverLabelforTextArangement(true);
	});

	opaTest("Check VFD Select button Clear All non value-help", function (Given, When, Then) {
		When.onTheFilterBar.iClickSelectedButtonClearAll();
		When.onTheFilterBar.iClickDropdownPopoverOk();
		Then.onTheVisualFilterDialog.iCheckBarChartSelection();
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
	});

	opaTest("Check VF Select button count for non value-help", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iSelectVFChart("bar", "200-3000", false, "CostCenter")
			.and
			.iSelectVFChart("bar", "100-1100", false, "CostCenter");
		Then.onTheFilterBar.iCheckVFChartSelected("Bar", "200-3000", "CostCenter")
			.and
			.iCheckVFChartSelected("Bar", "100-1100", "CostCenter");
		Then.onTheFilterBar.iCheckSelectedButtonCount(2, "Cost Center");
	});

	opaTest("Check tooltip for selections button on the VF bar - only selections", function (Given, When, Then) {
		Then.onTheFilterBar.iCheckVHTooltip("Bar", "Cost Center", "DROPDOWN_WITH_SELECTIONS", 2);
	});

	opaTest("Check tooltip for value help button on the VFD - no VH, no Selections", function (Given, When, Then) {
		Then.onTheFilterBar.iCheckVHTooltip("Line", "Cost Element", "VALUE_HELP");
	});

	opaTest("Check if chart is NOT colored when ChartMeasureAttributes are missing", function (Given, When, Then) {

		Then.onTheFilterBar.isChartColored("InteractiveLineChart", "StartDate", ["Neutral", "Neutral", "Neutral", "Neutral", "Neutral", "Neutral"]);
	});

	opaTest("Check if chart is NOT colored when ChartMeasureAttributes is present but Datapoint is missing", function (Given, When, Then) {

		Then.onTheFilterBar.isChartColored("InteractiveLineChart", "CostElement", ["Neutral", "Neutral", "Neutral", "Neutral", "Neutral", "Neutral"]);
	});

	opaTest("Check VF Labels in FilterBar popover as per Text Arrangement Annotation", function (Given, When, Then) {
		When.onTheFilterBar.iClickSelectedButton(2);
		Then.onTheFilterBar.iCheckPopoverLabelforTextArangement();
	});
	opaTest("Check VF Select button delete non value-help", function (Given, When, Then) {
		When.onTheFilterBar.iClickDropdownList(1);
		When.onTheFilterBar.iClickDropdownPopoverSearchFieldWithFilter('$$$');
		Then.onTheFilterBar.iShouldSeeEmptyDropdownList();
		When.onTheFilterBar.iClickDropdownPopoverSearchFieldWithFilter('');
		Then.onTheFilterBar.iSeeDropdownListItems(15);
		When.onTheFilterBar.iClickDropdownPopoverOk();
		Then.onTheFilterBar.iCheckSelectedButtonCount(1, "Cost Center");
	});
	opaTest("Check VF Select button Clear All non value-help", function (Given, When, Then) {
		When.onTheFilterBar.iClickSelectedButton(1);
		When.onTheFilterBar.iClickSelectedButtonClearAll();
		When.onTheFilterBar.iClickDropdownPopoverOk();
		Then.onTheFilterBar.iCheckBarChartSelection();
	});

	opaTest("Check unit field", function (Given, When, Then) {
		Then.onTheFilterBar.iCheckChartTitleInTheBar("Actual Costs by Supplier | K USD");
		When.onTheFilterBar.iClickTheFilterButtonInOverflowToolbar();
		Then.onTheVisualFilterDialog.iCheckChartTitle(true, "Actual Costs by Supplier | K USD");
		When.onTheVisualFilterDialog.iClickChartButton("Measure");
		When.onTheVisualFilterDialog.iChangeChartProperty(3);
		Then.onTheVisualFilterDialog.iCheckChartTitle(true, "Difference (%) by StringDate");
		When.onTheVisualFilterDialog.iClickChartButton("Measure");
		When.onTheVisualFilterDialog.iChangeChartProperty(1);
		Then.onTheVisualFilterDialog.iCheckChartTitle(true, "Planned Costs by StringDate | K EUR");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
		Then.onTheFilterBar.iCheckChartTitleInTheBar("Planned Costs by StringDate | K EUR");
		Then.onTheFilterBar.iCheckUnitFieldInChart("K", "bar", "CostCenter");
	});
	opaTest("Check for customviews", function (Given, When, Then) {
		When.onTheMainPage.iClickOnButtonWithTooltip("Chart and Table View");
		Then.onTheMainPage.iCheckContentViewButtonsToolbar("masterViewExtensionToolbar");
		Then.onTheMainPage.iCheckControlPropertiesByControlType("sap.m.Button", { "visible": true, "tooltip": "Custom View 1" });
		Then.onTheMainPage.iCheckControlPropertiesByControlType("sap.m.Button", { "visible": true, "tooltip": "Custom View 2" });
		When.onTheMainPage.iClickOnButtonWithTooltip("Chart View");
		Then.onTheMainPage.iCheckContentViewButtonsToolbar("masterViewExtensionToolbar");
		Then.onTheMainPage.iCheckControlPropertiesByControlType("sap.m.Button", { "visible": true, "tooltip": "Custom View 1" });
		Then.onTheMainPage.iCheckControlPropertiesByControlType("sap.m.Button", { "visible": true, "tooltip": "Custom View 2" });
		When.onTheMainPage.iClickOnButtonWithTooltip("Custom View 1");
		Then.onTheMainPage.iCheckContentViewButtonsToolbar("contentViewExtensionToolbar");
		Then.onTheMainPage.iCheckControlPropertiesByControlType("sap.m.Button", { "visible": true, "tooltip": "Custom View 1" });
		Then.onTheMainPage.iCheckControlPropertiesByControlType("sap.m.Button", { "visible": true, "tooltip": "Custom View 2" });
		When.onTheMainPage.iClickOnButtonWithTooltip("Custom View 2");
		Then.onTheMainPage.iCheckContentViewButtonsToolbar("contentViewExtension2Toolbar");
		Then.onTheMainPage.iCheckControlPropertiesByControlType("sap.m.Button", { "visible": true, "tooltip": "Custom View 1" });
		Then.onTheMainPage.iCheckControlPropertiesByControlType("sap.m.Button", { "visible": true, "tooltip": "Custom View 2" });
		When.onTheMainPage.iClickOnButtonWithTooltip("Table View");
		Then.onTheMainPage.iCheckContentViewButtonsToolbar("TableToolbar");
		Then.onTheMainPage.iCheckControlPropertiesByControlType("sap.m.Button", { "visible": true, "tooltip": "Custom View 1" });
		Then.onTheMainPage.iCheckControlPropertiesByControlType("sap.m.Button", { "visible": true, "tooltip": "Custom View 2" });
		Then.iTeardownMyApp();
	});

	opaTest("Check if the Analytical List Page Extension App is up", function (Given, When, Then) {
		Given.iStartMyAppInDemokit("analytics4", "manifestWithoutMapView");
		When.onTheGenericAnalyticalListPage.iSetTheFilter({ Field: "StartDate", Value: "" });
		When.onTheFilterBar.iSetTheDynamicDateRangeValue("SmartFilterBar-filterItemControl_BASIC-SemanticDate1", new Date("Jan 1, 2020"));
		When.onTheFilterBar.iSetTheDynamicDateRangeValue("SmartFilterBar-filterItemControl_BASIC-SemanticDate2", new Date("Jan 1, 2009"));
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
	});
	opaTest("Check if Filtering with Empty Values work as expected", function (Given, When, Then) {
		Then.onTheMainPage.iCheckNumberOfItemsInTable(106, "gridTable", "gridTable");
		When.onTheGenericAnalyticalListPage.iSelectVFChart("donut", "", false, "Supplier");
		Then.onTheMainPage.iCheckNumberOfItemsInTable(9, "gridTable", "gridTable");
		When.onTheGenericAnalyticalListPage.iDeselectVFChart("donut", "", false, "Supplier");
		Then.onTheMainPage.iCheckNumberOfItemsInTable(106, "gridTable", "gridTable");
	});
	opaTest("Absence of datepicker/datetimepicker on filterbar", function (Given, When, Then) {
		When.onTheFilterBar.iClickTheFilterButton();
		When.onTheVisualFilterDialog.iClickMoreFiltersLink("More Filters (5)");
		When.onTheVisualFilterDialog.iCheckSelectFilterCheckbox("Quantity by Delivery Time", true, false);
		When.onTheVisualFilterDialog.iCheckSelectFilterCheckbox("Quantity by Delivery Date", true, false);
		When.onTheVisualFilterDialog.iClickTheButtonOnTheDialog("OK", "Select Filters");
		Then.onTheMainPage.iCheckAbsenceOfValueHelpButton("Delivery Time", true);
		Then.onTheMainPage.iCheckAbsenceOfValueHelpButton("Delivery Date", true);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
		Then.onTheMainPage.iCheckAbsenceOfValueHelpButton("Delivery Time");
		Then.onTheMainPage.iCheckAbsenceOfValueHelpButton("Delivery Date");
	});
	opaTest("Check YearMonth semantics Label & Tooltip", function (Given, When, Then) {
		When.onTheFilterBar.iClickTheFilterButton();
		When.onTheVisualFilterDialog.iClickMoreFiltersLink("More Filters (3)");
		When.onTheVisualFilterDialog.iCheckSelectFilterCheckbox("Actual Costs by YearMonth", true, false);
		When.onTheVisualFilterDialog.iClickTheButtonOnTheDialog("OK", "Select Filters");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
		Then.onTheFilterBar.iCheckDateFormat("YearMonth", false);
	});

	opaTest("Check empty place holder in VF/VFD", function (Given, When, Then) {
		Given.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		When.onTheFilterBar.iClickTheFilterButton();
		Then.onTheFilterBar.iCheckVFLabelAndTooltipChart("Donut", "Supplier", "Not Assigned", true);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Cancel");
		Then.onTheFilterBar.iCheckVFLabelAndTooltipChart("Donut", "Supplier", "Not Assigned");
	});

	opaTest("Check chart selection on filterbar", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iSelectVFChart("line", new Date(1543273200000), false, "DeliveryDateTime");
		Then.onTheFilterBar.iCheckVFChartSelected("line", new Date(1543273200000), "DeliveryDateTime", false);
		Then.onTheFilterBar.iCheckSelectedButtonCount(1, "Delivery Time");
		When.onTheGenericAnalyticalListPage.iSelectVFChart("line", new Date(1543190400000), false, "DeliveryCalendarDate");
		Then.onTheFilterBar.iCheckVFChartSelected("line", new Date(1543190400000), "DeliveryCalendarDate", false);
		Then.onTheFilterBar.iCheckSelectedButtonCount(1, "Delivery Date");
	});

	opaTest("Check chart deselection - Date/DateTime fields in filterbar", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		When.onTheGenericAnalyticalListPage.iDeselectVFChart("line", new Date(1543273200000), false, "DeliveryDateTime");
		When.onTheGenericAnalyticalListPage.iDeselectVFChart("line", new Date(1543190400000), false, "DeliveryCalendarDate");
	});
	opaTest("Check sync of Date values in cf-vf on deselection in filterbar", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		Then.onTheFilterBar.isFilterNotAppliedOnFilterBar("DeliveryDateTime", new Date(1543273200000));
		Then.onTheFilterBar.isFilterNotAppliedOnFilterBar("DeliveryCalendarDate", new Date(1543190400000));
	});

	opaTest("Check chart selection on dialog", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		When.onTheFilterBar.iClickTheFilterButton();
		When.onTheGenericAnalyticalListPage.iSelectVFChart("line", new Date(1543273200000), true, "DeliveryDateTime");
		Then.onTheFilterBar.iCheckVFChartSelected("line", new Date(1543273200000), "DeliveryDateTime", false);
		Then.onTheFilterBar.iCheckSelectedButtonCount(1, "Delivery Time");
		When.onTheGenericAnalyticalListPage.iSelectVFChart("line", new Date(1543190400000), true, "DeliveryCalendarDate");
		Then.onTheFilterBar.iCheckVFChartSelected("line", new Date(1543190400000), "DeliveryCalendarDate", false);
		Then.onTheFilterBar.iCheckSelectedButtonCount(1, "Delivery Date");
	});

	opaTest("Check chart deselection - Date/DateTime fields in dialog", function (Given, When, Then) {
		When.onTheVisualFilterDialog.iClickTheSegmentedButton("visual", true);
		When.onTheGenericAnalyticalListPage.iDeselectVFChart("line", new Date(1543273200000), true, "DeliveryDateTime");
		When.onTheGenericAnalyticalListPage.iDeselectVFChart("line", new Date(1543190400000), true, "DeliveryCalendarDate");
		Then.iTeardownMyApp();
	});
});
