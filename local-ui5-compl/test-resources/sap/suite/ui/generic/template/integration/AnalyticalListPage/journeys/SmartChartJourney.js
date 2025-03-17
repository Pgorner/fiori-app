/*global opaTest QUnit */
sap.ui.define(["sap/ui/test/opaQunit"], function () {

	"use strict";

	QUnit.module("AnalyticalListPage - SmartChartJourney");

	opaTest("Check if the Chart have all the defined buttons", function (Given, When, Then) {
		Given.iStartMyAppInDemokit("analytics2");
		When.onTheVisualFilterDialog.iAddFilterValueInCompactDialog("Cost Element", "400020");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
		When.onTheFilterBar.iClickOnButtonWithText("Go");
	});

	opaTest("SmartChart dataLabel visibility", function (Given, When, Then) {
		Then.onTheMainPage.iCheckChartDataLabelOnSmartChart();
	});

	opaTest("Action Buttons on Chart and table toolbars", function (Given, When, Then) {
		Then.onTheChart.iCheckChartToolbarControlProperty({ "ActionF_chartOnly": [true, true, "Chart Only"], "ALPFunction::chart": [true, false, "Chart Action"], "display::chart": [true, false, "NavToLR"] }, "ZCOSTCENTERCOSTSQUERY0020--chart");
		Then.onTheTable.iCheckAbsenceOfActionButton("Chart Only", "table");
		Then.onTheTable.iCheckAbsenceOfActionButton("Chart Action", "table");
		Then.onTheTable.iCheckAbsenceOfActionButton("NavToLR", "table");
	});

	opaTest("Check for hidden filters", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		When.onTheMainPage.iAppylHiddenFilterToFilterBar("multiple", "Customer", "C000001");
		When.onTheFilterBar.iClickOnButtonWithText("Go");
		Then.iTeardownMyApp();
	});

	opaTest("OPA for checking direct navigation", function (Given, When, Then) {
		Given.iStartMyAppInSandbox("alp-display#alp-display?ID=0013");
		Then.onTheGenericObjectPage.theObjectPageHeaderTitleIsCorrect("400020");
		Then.iTeardownMyApp();
	});
});
