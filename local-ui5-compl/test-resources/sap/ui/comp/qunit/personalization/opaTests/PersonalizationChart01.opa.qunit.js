sap.ui.define([
	'sap/ui/test/Opa5',
	'sap/ui/test/opaQunit',
	'sap/ui/comp/qunit/personalization/opaTests/Util',
	'sap/ui/comp/qunit/personalization/opaTests/Arrangement',
	'sap/ui/comp/qunit/personalization/opaTests/Action',
	'sap/ui/comp/qunit/personalization/opaTests/Assertion',
	'sap/ui/Device',
	'sap/m/library'
], function(
	Opa5,
	opaTest,
	Util,
	Arrangement,
	Action,
	Assertion,
	Device,
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

		Then.iShouldSeePanelsInOrder([
			Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Chart"),
			Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Sort"),
			Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Filter")
		]);
	});
/*
	opaTest("When I navigate to chart panel, chart panel is shown", function(Given, When, Then) {
		When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Chart"));

		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Chart"));
		Then.iShouldSeePanel("sap.m.P13nDimMeasurePanel");

		Then.iShouldSeeComboBoxWithChartType(Util.getTextOfChartType("column"));

		Then.iShouldSeeItemOnPosition("Name", 0);
		Then.iShouldSeeItemWithSelection("Name", true);

		Then.iShouldSeeItemOnPosition("Category", 1);
		Then.iShouldSeeItemWithSelection("Category", true);

		Then.iShouldSeeItemOnPosition("Price", 2);
		Then.iShouldSeeItemWithSelection("Price", true);

		Then.iShouldSeeItemOnPosition("Quantity", 3);
		Then.iShouldSeeItemWithSelection("Quantity", true);

		Then.iShouldSeeItemOnPosition("Currency Code", 4);
		Then.iShouldSeeItemWithSelection("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 5);
		Then.iShouldSeeItemWithSelection("Date", false);

		Then.iShouldSeeItemOnPosition("Depth", 6);
		Then.iShouldSeeItemWithSelection("Depth", false);

		Then.iShouldSeeItemOnPosition("Description", 7);
		Then.iShouldSeeItemWithSelection("Description", false);

		Then.iShouldSeeItemOnPosition("Dimension Unit", 8);
		Then.iShouldSeeItemWithSelection("Dimension Unit", false);

		Then.iShouldSeeItemOnPosition("Height", 9);
		Then.iShouldSeeItemWithSelection("Height", false);

		Then.iShouldSeeItemOnPosition("Product ID", 10);
		Then.iShouldSeeItemWithSelection("Product ID", false);

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

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});*/

	opaTest("When I navigate to sort panel, sort panel should have an item 'Like It'", function(Given, When, Then) {
		Device.system.phone ? When.iPressBackButton().and.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "SORTPANEL_TITLE")) : When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "SORTPANEL_TITLE"));
		Then.theSelectShouldHaveItemWithText("Category", "Like It");
	});

	opaTest("When I press 'Ok' button, the dialog should close", function(Given, When, Then) {
		When.iPressOkButton();

		Then.thePersonalizationDialogShouldBeClosed();
		Then.iShouldSeeChartOfType("column");
		Then.iShouldSeeChartTypeButtonWithIcon("sap-icon://vertical-bar-chart");
	});

	opaTest("When I press 'DrillUp' button and open personalization dialog, dimension 'Category' should be invisible", function(Given, When, Then) {
		When.iPressOnDrillUpButton().and.iPressOnPersonalizationButton();
		if (Device.system.phone) {
			When.iPressBackButton().and.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Chart"));
		} else {
			When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Chart"));
		}

		Then.thePersonalizationDialogOpens();


		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Chart"));
		Then.iShouldSeeP13nItems([
			{p13nItem: "Name", selected: true},
			{p13nItem: "Price", selected: true},
			{p13nItem: "Quantity", selected: true},
			{p13nItem: "Category", selected: false},
			{p13nItem: "Currency Code", selected: false}
		]);

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});

	opaTest("When I press 'Ok' button, the dialog should close", function(Given, When, Then) {
		When.iPressOkButton();

		Then.thePersonalizationDialogShouldBeClosed();
		Then.iShouldSeeChartOfType("column");
		Then.iShouldSeeChartTypeButtonWithIcon("sap-icon://vertical-bar-chart");
	});

	opaTest("When I press 'DrillUp' button and open personalization dialog, dimension 'Name' should be invisible", function(Given, When, Then) {
		When.iPressOnDrillUpButton().and.iPressOnPersonalizationButton();
		Device.system.phone ? When.iPressBackButton().and.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "CHARTPANEL_TITLE")) : When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "CHARTPANEL_TITLE"));

		Then.thePersonalizationDialogOpens();
		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Chart"));

		Then.iShouldSeeP13nItems([
			{p13nItem: "Price", selected: true},
			{p13nItem: "Quantity", selected: true},
			{p13nItem: "Category", selected: false},
			{p13nItem: "Currency Code", selected: false},
			{p13nItem: "Name", selected: false}
		]);

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});

	opaTest("When I press 'Ok' button, the dialog should close", function(Given, When, Then) {
		When.iPressOkButton();

		Then.thePersonalizationDialogShouldBeClosed();
		Then.iShouldSeeChartOfType("column");
		Then.iShouldSeeChartTypeButtonWithIcon("sap-icon://vertical-bar-chart");
	});

	opaTest("When I press 'DrillDown' button with dimension 'Category' and open personalization dialog, 'Category' should be visible", function(Given, When, Then) {
		When.iPressOnDrillDownButton("Category").and.iPressOnPersonalizationButton();
		if (Device.system.phone) {
			When.iPressBackButton().and.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Chart"));
		} else {
			When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Chart"));
		}

		Then.thePersonalizationDialogOpens();

		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Chart"));


		Then.iShouldSeeP13nItems([
			{p13nItem: "Category", selected: true},
			{p13nItem: "Price", selected: true},
			{p13nItem: "Quantity", selected: true},
			{p13nItem: "Currency Code", selected: false},
			{p13nItem: "Name", selected: false}
		]);

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});

	opaTest("When I press 'Ok' button, the dialog should close", function(Given, When, Then) {
		When.iPressOkButton();

		Then.thePersonalizationDialogShouldBeClosed();
		Then.iShouldSeeChartOfType("column");
		Then.iShouldSeeChartTypeButtonWithIcon("sap-icon://vertical-bar-chart");
	});

	opaTest("When I press 'DrillDown' button with dimension 'Name' and open personalization dialog, 'Name' should be visible", function(Given, When, Then) {
		When.iPressOnDrillDownButton("Name").and.iPressOnPersonalizationButton();
		Device.system.phone ? When.iPressBackButton().and.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "CHARTPANEL_TITLE")) : When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "CHARTPANEL_TITLE"));

		Then.thePersonalizationDialogOpens();

		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Chart"));

		Then.iShouldSeeP13nItems([
			{p13nItem: "Category", selected: true},
			{p13nItem: "Name", selected: true},
			{p13nItem: "Price", selected: true},
			{p13nItem: "Quantity", selected: true},
			{p13nItem: "Currency Code", selected: false}
		]);

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});

	opaTest("When I press 'Ok' button, the dialog should close", function(Given, When, Then) {
		When.iPressOkButton();

		Then.thePersonalizationDialogShouldBeClosed();
		Then.iShouldSeeChartOfType("column");
		Then.iShouldSeeChartTypeButtonWithIcon("sap-icon://vertical-bar-chart");

		Then.iTeardownMyAppFrame();
	});
});
