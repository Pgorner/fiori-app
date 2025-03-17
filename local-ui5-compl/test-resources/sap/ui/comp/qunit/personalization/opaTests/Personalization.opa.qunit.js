sap.ui.define([
	'sap/ui/test/Opa5',
	'sap/ui/test/opaQunit',
	'./Util',
	'./Arrangement',
	'./Action',
	'./Assertion',
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
	var sAppURL = sap.ui.require.toUrl("sap/ui/comp/qunit/personalization/opaTests/applicationUnderTest/start.html");

	Opa5.extendConfig({
		autoWait:true,
		arrangements: new Arrangement(),
		actions: new Action(),
		assertions: new Assertion(),
		viewNamespace: "view."
	});

	opaTest("When I look at the screen, table with some visible columns should appear", function(Given, When, Then) {
		// Arrangements

		//sap.ui.require.toUrl("sap.ui.comp.qunit.personalization.opaTests/module.js");
		Given.iStartMyAppInAFrame(sAppURL);

		//Actions
		When.iLookAtTheScreen();

		// Assertions
		Then.theTableShouldContainColumns("sap.ui.table.AnalyticalTable", 2);
		Then.iShouldSeeVisibleColumnsInOrder("sap.ui.table.AnalyticalColumn", [
			"Name", "Category"
		]);
	});

	opaTest("When I press on personalization button, the personalization dialog opens", function(Given, When, Then) {
		//Actions
		When.iPressOnPersonalizationButton();

		// Assertions
		Then.thePersonalizationDialogOpens();
		Then.iShouldSeeNavigationControl();
		Then.iShouldSeeNavigationControlWithPanels(4);
		Then.iShouldSeePanelsInOrder([
			Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Column"),
			Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Sort"),
			Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Filter"),
			Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Group")
		]);
	});

	// Test "Don't group unvisible column"

	opaTest("When I navigate to columns panel, columns panel is shown", function(Given, When, Then) {
		//Actions
		When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Column"));

		// Assertions
		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Column"));
		Then.iShouldSeePanel("sap.m.p13n.SelectionPanel");

		Then.iShouldSeeItemOnPosition("Name", 0);
		Then.iShouldSeeItemWithSelection("Name", true);

		Then.iShouldSeeItemOnPosition("Category", 1);
		Then.iShouldSeeItemWithSelection("Category", true);

		Then.iShouldSeeItemOnPosition("Currency Code", 2);
		Then.iShouldSeeItemWithSelection("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 3);
		Then.iShouldSeeItemWithSelection("Date", false);

		Then.iShouldSeeItemOnPosition("Price", 4);
		Then.iShouldSeeItemWithSelection("Price", false);

		Then.iShouldSeeItemOnPosition("Product ID", 5);
		Then.iShouldSeeItemWithSelection("Product ID", false);

		Then.iShouldSeeItemOnPosition("Status", 6);
		Then.iShouldSeeItemWithSelection("Status", false);

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});

	opaTest("When I switch off 'Select all' (clicking twice), all columns should be deselected", function(Given, When, Then) {
		//Actions
		When.iClickOnTheCheckboxSelectAll().and.iClickOnTheCheckboxSelectAll();

		// Assertions
		Then.iShouldSeeItemOnPosition("Name", 0);
		Then.iShouldSeeItemWithSelection("Name", false);

		Then.iShouldSeeItemOnPosition("Category", 1);
		Then.iShouldSeeItemWithSelection("Category", false);

		Then.iShouldSeeItemOnPosition("Currency Code", 2);
		Then.iShouldSeeItemWithSelection("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 3);
		Then.iShouldSeeItemWithSelection("Date", false);

		Then.iShouldSeeItemOnPosition("Price", 4);
		Then.iShouldSeeItemWithSelection("Price", false);

		Then.iShouldSeeItemOnPosition("Product ID", 5);
		Then.iShouldSeeItemWithSelection("Product ID", false);

		Then.iShouldSeeItemOnPosition("Status", 6);
		Then.iShouldSeeItemWithSelection("Status", false);

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});

	opaTest("When I press on group tab, group panel with selected group and warning message should appear", function(Given, When, Then) {
		//Actions
		if (Device.system.phone) {
			When.iPressBackButton().and.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "GROUPPANEL_TITLE"));
		} else {
			When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Group"));
		}

		// Assertions
		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Group"));
		Then.iShouldSeePanel("sap.m.p13n.GroupPanel");
		Then.iShouldSeeGroupSelectionWithColumnName("Category");

		Then.iShouldSeeGroupSelectionWithCheckedShowFieldAsColumn("Category", true);
		Then.iShouldSeeGroupSelectionWithEnabledShowFieldAsColumn("Category", true);
		//TODO: Then.theComboBoxShouldHaveWarningMessage();
	});

	opaTest("When I press on columns tab, columns panel should appear", function(Given, When, Then) {
		//Actions
		if (Device.system.phone) {
			When.iPressBackButton().and.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "COLUMSPANEL_TITLE"));
		} else {
			When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Column"));
		}

		// Assertions
		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Column"));
		Then.iShouldSeePanel("sap.m.p13n.SelectionPanel");
	});

	opaTest("When I set grouped column to visible and press on group tab, warning message should disappear", function(Given, When, Then) {
		//Actions
		if (Device.system.phone) {
			When.iSelectColumn("Category").and.iPressBackButton().and.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "GROUPPANEL_TITLE"));
		} else {
			When.iSelectColumn("Category").and.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Group"));
		}

		// Assertions
		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Group"));
		Then.iShouldSeeGroupSelectionWithColumnName("Category");
		// TODO: clarify the checkbox situation on group tab
		//Then.theComboBoxShouldNotHaveWarningMessage();

		Then.iTeardownMyAppFrame();
	});

	// Test 'fixedColumnCount'

	opaTest("When I start the 'applicationUnderTest' again, table with some visible columns should appear", function(Given, When, Then) {
		Given.iStartMyAppInAFrame(sAppURL);

		When.iLookAtTheScreen();

		Then.theTableShouldContainColumns("sap.ui.table.AnalyticalTable", 2);
		Then.iShouldSeeVisibleColumnsInOrder("sap.ui.table.AnalyticalColumn", [
			"Name", "Category"
		]);
	});
	opaTest("When I freeze the first column and press on personalization button, the personalization dialog opens", function(Given, When, Then) {
		When.iFreezeColumn("Name").and.iPressOnPersonalizationButton();
		Then.thePersonalizationDialogOpens();
	});
	opaTest("When I navigate to columns panel, columns panel is shown", function(Given, When, Then) {
		When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Column"));

		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Column"));
		Then.iShouldSeePanel("sap.m.p13n.SelectionPanel");

		Then.iShouldSeeItemOnPosition("Name", 0);
		Then.iShouldSeeItemWithSelection("Name", true);

		Then.iShouldSeeItemOnPosition("Category", 1);
		Then.iShouldSeeItemWithSelection("Category", true);

		Then.iShouldSeeItemOnPosition("Currency Code", 2);
		Then.iShouldSeeItemWithSelection("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 3);
		Then.iShouldSeeItemWithSelection("Date", false);

		Then.iShouldSeeItemOnPosition("Price", 4);
		Then.iShouldSeeItemWithSelection("Price", false);

		Then.iShouldSeeItemOnPosition("Product ID", 5);
		Then.iShouldSeeItemWithSelection("Product ID", false);

		Then.iShouldSeeItemOnPosition("Status", 6);
		Then.iShouldSeeItemWithSelection("Status", false);

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});
	opaTest("When I select 'Product ID' column, the 'Product ID' should be selected", function(Given, When, Then) {
		When.iSelectColumn("Product ID");

		Then.iShouldSeeItemOnPosition("Name", 0);
		Then.iShouldSeeItemWithSelection("Name", true);

		Then.iShouldSeeItemOnPosition("Category", 1);
		Then.iShouldSeeItemWithSelection("Category", true);

		Then.iShouldSeeItemOnPosition("Currency Code", 2);
		Then.iShouldSeeItemWithSelection("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 3);
		Then.iShouldSeeItemWithSelection("Date", false);

		Then.iShouldSeeItemOnPosition("Price", 4);
		Then.iShouldSeeItemWithSelection("Price", false);

		Then.iShouldSeeItemOnPosition("Product ID", 5);
		Then.iShouldSeeItemWithSelection("Product ID", true);

		Then.iShouldSeeItemOnPosition("Status", 6);
		Then.iShouldSeeItemWithSelection("Status", false);

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});
	opaTest("When I close the dialog, the first column should still be frozen", function(Given, When, Then) {
		When.iPressOkButton();

		Then.thePersonalizationDialogShouldBeClosed();
		Then.iShouldSeeVisibleColumnsInOrder("sap.ui.table.AnalyticalColumn", [
			"Name", "Category", "Product ID"
		]);
		Then.theTableHasFreezeColumn("Name");
		Then.iTeardownMyAppFrame();
	});
	opaTest("When I press on personalization button, the personalization dialog opens", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyAppInAFrame(sAppURL);

		// Assertions
		Then.theTableShouldContainColumns("sap.ui.table.AnalyticalTable", 2);
		Then.iShouldSeeVisibleColumnsInOrder("sap.ui.table.AnalyticalColumn", [
			"Name", "Category"
		]);

		//Actions
		When.iPressOnPersonalizationButton();

		// Assertions
		Then.thePersonalizationDialogOpens();
	});

	opaTest("When I press now 'Cancel' button, the dialog should close and no columns are added to the table ", function(Given, When, Then) {
		//Actions
		When.iPressCancelButton();

		// Assertions
		Then.thePersonalizationDialogShouldBeClosed();
		Then.theTableShouldContainColumns("sap.ui.table.AnalyticalTable", 2);
		Then.iShouldSeeVisibleColumnsInOrder("sap.ui.table.AnalyticalColumn", [
			"Name", "Category"
		]);
	});

	opaTest("When I open the personalization dialog and press 'OK', new columns are added to the table", function(Given, When, Then) {
		//Actions
		When.iPressOnPersonalizationButton().and.iPressOkButton();

		// Assertions
		Then.thePersonalizationDialogShouldBeClosed();
		Then.theTableShouldContainColumns("sap.ui.table.AnalyticalTable", 7);
		Then.iShouldSeeVisibleColumnsInOrder("sap.ui.table.AnalyticalColumn", [
			"Name", "Category"
		]);

		Then.iTeardownMyAppFrame();
	});

	opaTest("When I group and ungroup sap.ui.table.AnalyticalColumn, no duplicate requests should be sent", function(Given, When, Then) {
		Given.iStartMyAppInAFrame(sAppURL);

		//Actions
		When.iClearTheLog();
		// We group the column
		When.iOpenColumnMenu("Name").iPressGroupByProperty("Name");

		// Assertions
		Then.iShouldSeeNumberOfRequests(1, "$batch");

		//Actions
		When.iClearTheLog();
		// We ungroup the column
		When.iOpenColumnMenu("Name").iPressGroupByProperty("Name");

		// Assertions
		Then.iShouldSeeNumberOfRequests(1, "$batch");

		Then.iTeardownMyAppFrame();
	});

	opaTest("When I set 'Show Field as Column' to false for a column, the column should not be visible in the table", function(Given, When, Then) {
		Given.iStartMyAppInAFrame(sAppURL);

		//Actions
		When.iPressOnPersonalizationButton();

		When.iSelectColumn("Currency Code");
		When.iSelectColumn("Date");
		When.iSelectColumn("Product ID");

		When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "GROUPPANEL_TITLE"));

		When.iChangeGroupSelection(Util.getTextFromResourceBundle("sap.m", "P13NDIALOG_SELECTION_NONE"), "Currency Code");
		When.iChangeGroupSelection(Util.getTextFromResourceBundle("sap.m", "P13NDIALOG_SELECTION_NONE"), "Date");
		When.iChangeGroupSelection(Util.getTextFromResourceBundle("sap.m", "P13NDIALOG_SELECTION_NONE"), "Product ID");

		When.iClickOnTheCheckboxShowFieldAsColumn("Currency Code");
		When.iClickOnTheCheckboxShowFieldAsColumn("Date");
		When.iClickOnTheCheckboxShowFieldAsColumn("Product ID");

		When.iPressOkButton();

		// Assertions
		Then.iShouldSeeVisibleColumnsInOrder("sap.ui.table.AnalyticalColumn", [
			"Name", "Category"
		]);

		Then.iTeardownMyAppFrame();
	});
});
