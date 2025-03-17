/* global QUnit */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"test-resources/sap/ui/comp/testutils/opa/smartchart/Actions",
	"test-resources/sap/ui/comp/testutils/opa/smartchart/Assertions"
], function(
	Opa5,
	opaTest,
	SmartChartActions,
	SmartChartAssertions
) {
	"use strict";

	if (window.blanket) {
		//window.blanket.options("sap-ui-cover-only", "sap/ui/comp");
		window.blanket.options("sap-ui-cover-never", "sap/viz");
	}

	Opa5.extendConfig({
		autoWait: true,
		enabled: false,
		testLibs: {
			compTestLibrary: {
				appUrl: "test-resources/sap/ui/comp/qunit/opaTests/applicationUnderTestSmartChart/SmartChart.qunit.html"
			}
		},
		actions: SmartChartActions,
		assertions: SmartChartAssertions,
		arrangements: {
			iStartMyUIComponentInViewMode: function(sComponentName) {
				return this.iStartMyUIComponent({
					componentConfig: {
						name: sComponentName,
						async: true
					},
					hash: "",
					autowait: true
				});
			}
		}
	});

	QUnit.module("SmartChart");

	opaTest("When I look at the screen, SmartChart should appear", function(Given, When, Then) {
		Given.iStartMyUIComponentInViewMode("applicationUnderTestSmartChart");

		Then.iShouldSeeAChart();
	});

	opaTest("When I change the chart type, the chart should change it's type", function(Given, When, Then) {
		When.iSelectAChartType("__xmlview0--smartChart01", "Pie Chart");

		Then.iShouldSeeTheChartWithChartType("__xmlview0--smartChart01", "pie");
	});

	opaTest("When I click on \"Zoom In\", SmartChart should zoom in", function(Given, When, Then) {
		When.iClickOnZoomIn("__xmlview0--smartChart01");

		Then.iShouldSeeAChart();
	});

	opaTest("When I click on \"Legend\", SmartChart should toggle the legend", function(Given, When, Then) {
		When.iClickOnTheLegendToggleButton("__xmlview0--smartChart01");

		Then.iShouldSeeNoLegend("__xmlview0--smartChart01");

		When.iClickOnTheLegendToggleButton("__xmlview0--smartChart01");

		Then.iShouldSeeALegend("__xmlview0--smartChart01");
	});

	opaTest("When I click on the  \"Fullscreen\" button, SmartChart should open the fullscreen mode", function(Given, When, Then) {
		When.iClickOnTheFullscreenButton("__xmlview0--smartChart01");

		Then.iShouldSeeAChartInFullscreenMode();

		When.iClickOnTheExitFullscreenButton("__xmlview0--smartChart01");
	});

	opaTest("When I click on a  breadcrumb, SmartChart should perform a drill-up", function(Given, When, Then) {
		When.iClickOnTheBreadcrumbWithName("Name", "__xmlview0--smartChart01");

		Then.iSeeTheDrillStack(["Name"], "__xmlview0--smartChart01");
	});


	opaTest("When I perform a drill-down, it should be visible on the chart", function(Given, When, Then) {
		When.iDrillDownInDimension("__xmlview0--smartChart01", "Date");

		Then.iSeeTheDrillStack(["Name", "Date"], "__xmlview0--smartChart01");
	});

	/*
	opaTest("When I click on a  \"View By\", SmartChart should open the drill-down window", function(Given, When, Then) {
		When.iClickOnTheDrillDownButton("__xmlview0--smartChart01");

		Then.iShouldSeeADrillDownPopover(); //TODO: I should see drilldown popover

		When.iSelectANewDrillDimensionInPopover("Date");

		Then.iSeeTheDrillStack(["Name", "Date"], "__xmlview0--smartChart01");
	});*/

	opaTest("When I select a datapoint, the \"Details\" button should become available", function(Given, When, Then) {
		When.iSelectTheDatapoint([{index: 2, measures: ["Price"]}], "__xmlview0--smartChart01");

		Then.iShouldSeeAChart();
	});



});
