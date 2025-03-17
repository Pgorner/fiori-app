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

	// ----------------------------------------------------------------
	// BCP 1880469461: Wrong order of measures
	// ----------------------------------------------------------------

	opaTest("When I start the app and press on personalization button, the personalization dialog opens", function(Given, When, Then) {
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
			Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Chart"), Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Sort"), Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Filter")
		]);
	});
	opaTest("When I navigate to chart panel, chart panel is shown", function(Given, When, Then) {
		When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Chart"));

		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Chart"));

		Then.iShouldSeeP13nItems([
			{p13nItem: "Name", selected: true},
			{p13nItem: "Category", selected: true},
			{p13nItem: "Price", selected: true},
			{p13nItem: "Quantity", selected: true},
			{p13nItem: "Currency Code", selected: false}
		]);

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});
	opaTest("When I select the 'Depth' measure and move the 'Depth' to the top, the 'Restore' button should be enabled", function(Given, When, Then) {

		When.iAddMeasure("Depth");
		When.iClickOnTableItemWithComboBox("Depth").and.iPressOnButtonWithIcon("sap-icon://collapse-group");
		Then.iShouldSeeP13nItems([
			{p13nItem: "Name", selected: true},
			{p13nItem: "Category", selected: true},
			{p13nItem: "Depth", selected: true},
			{p13nItem: "Price", selected: true},
			{p13nItem: "Quantity", selected: true},
			{p13nItem: "Currency Code", selected: false}
		]);

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});
	opaTest("When I press 'Ok' button, the dialog should close and new measure should be visible", function(Given, When, Then) {
		When.iPressOkButton();

		Then.thePersonalizationDialogShouldBeClosed();
		Then.iShouldSeeVisibleDimensionsInOrder([
			"Name", "Category"
		]);
		Then.iShouldSeeVisibleMeasuresInOrder([
			"Depth", "Price", "Quantity"
		]);

		Then.iTeardownMyAppFrame();
	});

	// ----------------------------------------------------------------
	// BCP 1880469461: Wrong order of dimensions
	// ----------------------------------------------------------------

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
		Then.iShouldSeePanelsInOrder([
			Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Chart"),
			Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Sort"),
			Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Filter")
		]);
	});
	opaTest("When I navigate to chart panel, chart panel is shown", function(Given, When, Then) {
		When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Chart"));

		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Chart"));

		Then.iShouldSeeP13nItems([
			{p13nItem: "Name", selected: true},
			{p13nItem: "Category", selected: true},
			{p13nItem: "Price", selected: true},
			{p13nItem: "Quantity", selected: true},
			{p13nItem: "Currency Code", selected: false}
		]);

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});
	opaTest("When I select the 'Date' dimension and move the 'Date' to the top, the 'Restore' button should be enabled", function(Given, When, Then) {

		When.iAddDimension("Date");
		When.iClickOnTableItemWithComboBox("Date").and.iPressOnButtonWithIcon("sap-icon://collapse-group");
		Then.iShouldSeeP13nItems([
			{p13nItem: "Date", selected: true},
			{p13nItem: "Name", selected: true},
			{p13nItem: "Category", selected: true},
			{p13nItem: "Price", selected: true},
			{p13nItem: "Quantity", selected: true},
			{p13nItem: "Currency Code", selected: false}
		]);

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});
	opaTest("When I press 'Ok' button, the dialog should close and new measure should be visible", function(Given, When, Then) {
		When.iPressOkButton();

		Then.thePersonalizationDialogShouldBeClosed();
		Then.iShouldSeeVisibleDimensionsInOrder([
			"Date", "Name", "Category"
		]);
		Then.iShouldSeeVisibleMeasuresInOrder([
			"Price", "Quantity"
		]);

	});
	opaTest("When I select add a Dropdown field I should see a correctly filled popup list", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iAddFilter("Category with ValueList");
		When.iOpenVHDropdown("FilterPanel-filterItemControlA_-applicationUnderTestDimeasure---IDView--IDSmartChart-CategoryVL");

		Then.iShouldSeeDropdownWithItems("FilterPanel-filterItemControlA_-applicationUnderTestDimeasure---IDView--IDSmartChart-CategoryVL-popup-list", ["SmartPhone"]);

		Then.iTeardownMyAppFrame();

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});
});
