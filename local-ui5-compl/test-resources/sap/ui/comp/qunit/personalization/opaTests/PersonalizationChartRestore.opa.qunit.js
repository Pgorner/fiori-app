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
		autoWait:true,
		arrangements: new Arrangement(),
		actions: new Action(),
		assertions: new Assertion(),
		viewNamespace: "view."
	});

	opaTest("When I press on personalization button, the personalization dialog opens", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestDimeasure/start.html"));

		//Actions
		When.iLookAtTheScreen();

		// Assertions
		Then.iShouldSeePersonalizationButton();
		Then.iShouldSeeVisibleDimensionsInOrder([
			"Name", "Category"
		]);
		Then.iShouldSeeVisibleMeasuresInOrder([
			"Price", "Quantity"
		]);
		Then.iShouldSeeChartOfType("column");
		Then.iShouldSeeChartTypeButtonWithIcon("sap-icon://vertical-bar-chart");

		//Actions
		When.iPressOnPersonalizationButton();

		// Assertions
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
		//Actions
		When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Chart"));

		// Assertions
		Then.iShouldSeeP13nItems([
			{p13nItem: "Name", selected: true},
			{p13nItem: "Category", selected: true},
			{p13nItem: "Price", selected: true},
			{p13nItem: "Quantity", selected: true},
			{p13nItem: "Currency Code", selected: false}
		]);
		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});

	opaTest("When I deselect the 'Name' dimension, the 'Restore' button should be enabled", function(Given, When, Then) {
		When.iRemoveDimension("Name");
		Then.iShouldSeeP13nItems([
			{p13nItem: "Name", selected: false},
			{p13nItem: "Category", selected: true},
			{p13nItem: "Price", selected: true},
			{p13nItem: "Quantity", selected: true},
			{p13nItem: "Currency Code", selected: false}
		]);
		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});

	opaTest("When I press 'Restore' button, the 'Restore' button should be disabled and initial dimeasures should reappear", function(Given, When, Then) {
		//Actions
		When.iPressRestoreButton();
		Then.iShouldSeeWarning();
		When.iPressOkButtonOnTheWarningDialog();

		// Assertions
		Then.iShouldSeeP13nItems([
			{p13nItem: "Name", selected: true},
			{p13nItem: "Category", selected: true},
			{p13nItem: "Price", selected: true},
			{p13nItem: "Quantity", selected: true},
			{p13nItem: "Currency Code", selected: false}
		]);
		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});

	opaTest("When I deselect the 'Name' dimension and select 'Description', the 'Restore' button should be enabled", function(Given, When, Then) {
		When.iRemoveDimension("Name");
		When.iAddDimension("Description");
		Then.iShouldSeeP13nItems([
			{p13nItem: "Category", selected: true},
			{p13nItem: "Description", selected: true},
			{p13nItem: "Price", selected: true},
			{p13nItem: "Quantity", selected: true},
			{p13nItem: "Currency Code", selected: false}
		]);
		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});

	opaTest("When I press 'Restore' button, the 'Restore' button should be disabled and initial dimeasures should reappear", function(Given, When, Then) {
		//Actions
		When.iPressRestoreButton();
		Then.iShouldSeeWarning();
		When.iPressOkButtonOnTheWarningDialog();

		// Assertions
		Then.iShouldSeeP13nItems([
			{p13nItem: "Name", selected: true},
			{p13nItem: "Category", selected: true},
			{p13nItem: "Price", selected: true},
			{p13nItem: "Quantity", selected: true},
			{p13nItem: "Currency Code", selected: false}
		]);
		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});

	opaTest("When I deselect the 'Name' dimension and select 'Description', the 'Restore' button should be enabled", function(Given, When, Then) {
		When.iRemoveDimension("Name");
		When.iAddDimension("Description");
		Then.iShouldSeeP13nItems([
			{p13nItem: "Category", selected: true},
			{p13nItem: "Description", selected: true},
			{p13nItem: "Price", selected: true},
			{p13nItem: "Quantity", selected: true},
			{p13nItem: "Currency Code", selected: false}
		]);
		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});

	opaTest("When I press 'Ok' button, the dialog should close", function(Given, When, Then) {
		//Actions
		When.iPressOkButton();

		// Assertions
		Then.thePersonalizationDialogShouldBeClosed();
		Then.iShouldSeeChartOfType("column");
		Then.iShouldSeeChartTypeButtonWithIcon("sap-icon://vertical-bar-chart");
	});

	opaTest("When I press on personalization button again, the personalization dialog opens", function(Given, When, Then) {
		//Actions
		When.iPressOnPersonalizationButton();

		// Assertions
		Then.iShouldSeeP13nItems([
			{p13nItem: "Category", selected: true},
			{p13nItem: "Description", selected: true},
			{p13nItem: "Price", selected: true},
			{p13nItem: "Quantity", selected: true},
			{p13nItem: "Currency Code", selected: false}
		]);
		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});

	opaTest("When I press 'Restore' button, the 'Restore' button should be disabled and the initial selection should reappear", function(Given, When, Then) {
		//Actions
		When.iPressRestoreButton();
		Then.iShouldSeeWarning();
		When.iPressOkButtonOnTheWarningDialog();

		// Assertions
		Then.iShouldSeeP13nItems([
			{p13nItem: "Name", selected: true},
			{p13nItem: "Category", selected: true},
			{p13nItem: "Price", selected: true},
			{p13nItem: "Quantity", selected: true},
			{p13nItem: "Currency Code", selected: false}
		]);
		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});

	opaTest("When I select the measure 'Depth' - press 'Restore' - select 'Date' dimension - press 'OK', the dialog should close", function(Given, When, Then) {
		//Actions
		When.iAddMeasure("Depth").and.iPressRestoreButton();
		Then.iShouldSeeWarning();
		When.iPressOkButtonOnTheWarningDialog();
		When.iAddDimension("Date").and.iPressOkButton();

		// Assertions
		Then.thePersonalizationDialogShouldBeClosed();
		Then.iShouldSeeChartOfType("column");
		Then.iShouldSeeChartTypeButtonWithIcon("sap-icon://vertical-bar-chart");
	});

	opaTest("When I open dialog and press 'Restore' button, the initial dimeasures should reappear", function(Given, When, Then) {
		//Actions
		When.iPressOnPersonalizationButton().and.iPressRestoreButton();
		Then.iShouldSeeWarning();
		When.iPressOkButtonOnTheWarningDialog();

		// Assertions
		Then.iShouldSeeP13nItems([
			{p13nItem: "Name", selected: true},
			{p13nItem: "Category", selected: true},
			{p13nItem: "Price", selected: true},
			{p13nItem: "Quantity", selected: true},
			{p13nItem: "Currency Code", selected: false}
		]);
		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});
});
