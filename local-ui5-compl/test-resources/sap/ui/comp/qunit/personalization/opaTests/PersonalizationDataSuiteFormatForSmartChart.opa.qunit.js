sap.ui.define([
	'sap/ui/test/Opa5',
	'sap/ui/test/opaQunit',
	'sap/ui/comp/qunit/personalization/opaTests/Util',
	'sap/ui/comp/qunit/personalization/opaTests/Arrangement',
	'sap/ui/comp/qunit/personalization/opaTests/Action',
	'sap/ui/comp/qunit/personalization/opaTests/Assertion',
	'sap/m/library'

], function(
	Opa5,
	opaTest,
	Util,
	Arrangement,
	Action,
	Assertion,
	mlibrary
) {
	'use strict';

	Opa5.extendConfig({
		asyncPolling: false,
		autoWait:true,
		arrangements: new Arrangement(),
		actions: new Action(),
		assertions: new Assertion(),
		viewNamespace: "view."
	});

	opaTest("When I press on personalization button, the personalization dialog opens", function(Given, When, Then) {
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestDimeasure/start.html"));

		When.iLookAtTheScreen();

		Then.iShouldSeePersonalizationButton();
		Then.iShouldSeeVisibleDimensionsInOrder([
			"Name", "Category"
		]);
		Then.iShouldSeeVisibleMeasuresInOrder([
			"Price", "Quantity"
		]);
		Then.iShouldSeeChartOfType("column");
		Then.iShouldSeeChartTypeButtonWithIcon("sap-icon://vertical-bar-chart");

		When.iPressOnPersonalizationButton();

		Then.thePersonalizationDialogOpens();
		Then.iShouldSeeNavigationControl();
		Then.iShouldSeeNavigationControlWithPanels(3);
		Then.iShouldSeePanelsInOrder([
			Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Chart"),
			Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Sort"),
			Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Filter")
		]);
	});

	// -------------------------------------------------------------------------------------------------------------------------------
	// ------------------- new test --------------------------------------------------------------------------------------------------
	// -------------------------------------------------------------------------------------------------------------------------------

	opaTest("When I navigate to chart panel, chart panel is shown", function(Given, When, Then) {
		When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Chart"));

		Then.iShouldSeeP13nItems([
			{p13nItem: "Name", selected: true},
			{p13nItem: "Category", selected: true},
			{p13nItem: "Price", selected: true},
			{p13nItem: "Quantity", selected: true},
			{p13nItem: "Currency Code", selected: false}
		]);

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});

	opaTest("When I press 'Ok' button, the dialog should close", function(Given, When, Then) {
		When.iPressOkButton();

		Then.thePersonalizationDialogShouldBeClosed();
		Then.iShouldSeeVisibleDimensionsInOrder([
			"Name", "Category"
		]);
		Then.iShouldSeeVisibleMeasuresInOrder([
			"Price", "Quantity"
		]);
		Then.iShouldSeeChartOfType("column");
		Then.iShouldSeeChartTypeButtonWithIcon("sap-icon://vertical-bar-chart");
	});

	// -------------------------------------------------------------------------------------------------------------------------------
	// ------------------- new test --------------------------------------------------------------------------------------------------
	// -------------------------------------------------------------------------------------------------------------------------------

	opaTest("When I set dimension 'Name' and measure 'Price' as visible and change the chart type to 'Pie Chart', the chart should be shown differently", function(Given, When, Then) {
		When.iSetDataSuiteFormat("sap.ui.comp.smartchart.SmartChart", {
			"Visualizations": [
				{
					"Type": "Chart",
					"Content": {
						"ChartType": "com.sap.vocabularies.UI.v1.ChartType/Pie",
						"Measures": [
							"Price"
						],
						"Dimensions": [
							"Name"
						],
						"MeasureAttributes": [
							{
								"Measure": "Price",
								"Role": "axis1"
							}
						],
						"DimensionAttributes": [
							{
								"Dimension": "Name",
								"Role": "category"
							}
						]
					}
				}
			]
		});

		Then.iShouldSeeVisibleDimensionsInOrder([
			"Name"
		]);
		Then.iShouldSeeVisibleMeasuresInOrder([
			"Price"
		]);
		Then.iShouldSeeChartOfType("pie");
		Then.iShouldSeeChartTypeButtonWithIcon("sap-icon://pie-chart");
	});

	opaTest("When I navigate to chart panel, chart panel is shown", function(Given, When, Then) {
		When.iPressOnPersonalizationButton();

		Then.iShouldSeeP13nItems([
			{p13nItem: "Name", selected: true},
			{p13nItem: "Category", selected: false},
			{p13nItem: "Price", selected: true},
			{p13nItem: "Quantity", selected: false},
			{p13nItem: "Currency Code", selected: false}
		]);

		/*
		Then.thePersonalizationDialogOpens();

		Then.iShouldSeeComboBoxWithChartType(Util.getTextOfChartType("pie"));

		Then.iShouldSeeItemOnPosition("Name", 0);
		Then.iShouldSeeItemWithSelection("Name", true);

		Then.iShouldSeeItemOnPosition("Price", 1);
		Then.iShouldSeeItemWithSelection("Price", true);

		Then.iShouldSeeItemOnPosition("Category", 2);
		Then.iShouldSeeItemWithSelection("Category", false);

		Then.iShouldSeeItemOnPosition("Currency Code", 3);
		Then.iShouldSeeItemWithSelection("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 4);
		Then.iShouldSeeItemWithSelection("Date", false);

		Then.iShouldSeeItemOnPosition("Depth", 5);
		Then.iShouldSeeItemWithSelection("Depth", false);

		Then.iShouldSeeItemOnPosition("Description", 6);
		Then.iShouldSeeItemWithSelection("Description", false);

		Then.iShouldSeeItemOnPosition("Dimension Unit", 7);
		Then.iShouldSeeItemWithSelection("Dimension Unit", false);

		Then.iShouldSeeItemOnPosition("Height", 8);
		Then.iShouldSeeItemWithSelection("Height", false);

		Then.iShouldSeeItemOnPosition("Product ID", 9);
		Then.iShouldSeeItemWithSelection("Product ID", false);

		Then.iShouldSeeItemOnPosition("Quantity", 10);
		Then.iShouldSeeItemWithSelection("Quantity", false);

		Then.iShouldSeeItemOnPosition("Status", 11);
		Then.iShouldSeeItemWithSelection("Status", false);

		Then.iShouldSeeItemOnPosition("Supplier Name", 12);
		Then.iShouldSeeItemWithSelection("Supplier Name", false);

		Then.iShouldSeeItemOnPosition("Weight Measure", 13);
		Then.iShouldSeeItemWithSelection("Weight Measure", false);

		Then.iShouldSeeItemOnPosition("Weight Unit", 14);
		Then.iShouldSeeItemWithSelection("Weight Unit", false);

		Then.iShouldSeeItemOnPosition("Width", 15);
		Then.iShouldSeeItemWithSelection("Width", false);
		*/
		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});

	opaTest("When I press 'Ok' button, the dialog should close", function(Given, When, Then) {
		When.iPressOkButton();

		Then.thePersonalizationDialogShouldBeClosed();
		Then.iShouldSeeChartOfType("pie");
		Then.iShouldSeeChartTypeButtonWithIcon("sap-icon://pie-chart");

		Then.iTeardownMyAppFrame();
	});

	// -------------------------------------------------------------------------------------------------------------------------------
	// ------------------- new test --------------------------------------------------------------------------------------------------
	// -------------------------------------------------------------------------------------------------------------------------------

	opaTest("When I start the app again and press on personalization button, the personalization dialog opens", function(Given, When, Then) {
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestDimeasure/start.html"));

		When.iLookAtTheScreen();

		Then.iShouldSeePersonalizationButton();
		Then.iShouldSeeVisibleDimensionsInOrder([
			"Name", "Category"
		]);
		Then.iShouldSeeVisibleMeasuresInOrder([
			"Price", "Quantity"
		]);
		Then.iShouldSeeChartOfType("column");
		Then.iShouldSeeChartTypeButtonWithIcon("sap-icon://vertical-bar-chart");

		When.iPressOnPersonalizationButton();

		Then.thePersonalizationDialogOpens();
		Then.iShouldSeeNavigationControl();
		Then.iShouldSeeNavigationControlWithPanels(3);
		Then.iShouldSeePanelsInOrder([
			Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Chart"),
			Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Sort"),
			Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Filter")
		]);
	});
	opaTest("When I navigate to chart panel, chart panel is shown", function(Given, When, Then) {
		When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Chart"));

		Then.iShouldSeeP13nItems([
			{p13nItem: "Name", selected: true},
			{p13nItem: "Category", selected: true},
			{p13nItem: "Price", selected: true},
			{p13nItem: "Quantity", selected: true},
			{p13nItem: "Currency Code", selected: false}
		]);

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});
	opaTest("When I press 'Ok' button, the dialog should close", function(Given, When, Then) {
		When.iPressOkButton();

		Then.thePersonalizationDialogShouldBeClosed();
		Then.iShouldSeeVisibleDimensionsInOrder([
			"Name", "Category"
		]);
		Then.iShouldSeeVisibleMeasuresInOrder([
			"Price", "Quantity"
		]);
		Then.iShouldSeeChartOfType("column");
		Then.iShouldSeeChartTypeButtonWithIcon("sap-icon://vertical-bar-chart");
	});
	opaTest("When I change the chart type to 'Bar' and set all dimensions as invisible and set the order of measure 'Depth' to the first, the chart should be shown differently", function(Given, When, Then) {
		When.iSetDataSuiteFormat("sap.ui.comp.smartchart.SmartChart", {
			"Visualizations": [
				{
					"Type": "Chart",
					"Content": {
						"ChartType": "com.sap.vocabularies.UI.v1.ChartType/Bar",
						"Measures": [
							"Depth", "Price", "Quantity"
						],
						"Dimensions": [],
						"MeasureAttributes": [
							{
								"Measure": "Price",
								"Role": "axis1"
							}
						],
						"DimensionAttributes": [
							{
								"Dimension": "Name",
								"Role": "category"
							}
						]
					}
				}
			]
		});

		Then.iShouldSeeVisibleDimensionsInOrder([]);
		Then.iShouldSeeVisibleMeasuresInOrder([
			"Depth", "Price", "Quantity"
		]);
		Then.iShouldSeeChartOfType("bar");
		Then.iShouldSeeChartTypeButtonWithIcon("sap-icon://horizontal-bar-chart");

		Then.iTeardownMyAppFrame();
	});
});
