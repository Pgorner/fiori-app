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
		autoWait:true,
		arrangements: new Arrangement(),
		actions: new Action(),
		assertions: new Assertion(),
		viewNamespace: "view."
	});

	opaTest("When I press on personalization button, the personalization dialog opens", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyAppInAFrame('test-resources/sap/ui/comp/qunit/personalization/opaTests/applicationUnderTest/start.html');

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

	opaTest("When I navigate to group panel, group panel is shown", function(Given, When, Then) {
		//Actions
		When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Group"));

		// Assertions
		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Group"));
		Then.iShouldSeePanel("sap.m.p13n.GroupPanel");
		Then.iShouldSeeGroupSelectionWithColumnName("Category");
	});

	opaTest("When I press 'remove line' button, the initial group should disappear", function(Given, When, Then) {
		//Actions
		When.iRemoveAGroupLine(0);

		// Assertions
		Then.iShouldSeeGroupSelectionWithColumnName(Util.getTextFromResourceBundle("sap.m", "P13NDIALOG_SELECTION_NONE"));
		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});

	opaTest("When I navigate to columns panel, columns panel is shown", function(Given, When, Then) {
		//Actions
		// On phone we have explicit navigate back and then to group panel
		if (Device.system.phone) {
			When.iPressBackButton().and.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "COLUMSPANEL_TITLE"));
		} else {
			When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Column"));
		}

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

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});

	opaTest("When I deselect the 'Name' column and select 'Price', the 'Restore' button should be enabled", function(Given, When, Then) {
		//Actions
		When.iSelectColumn("Name");
		When.iSelectColumn("Price");

		// Assertions
		Then.iShouldSeeItemOnPosition("Name", 0);
		Then.iShouldSeeItemWithSelection("Name", false);

		Then.iShouldSeeItemOnPosition("Category", 1);
		Then.iShouldSeeItemWithSelection("Category", true);

		Then.iShouldSeeItemOnPosition("Currency Code", 2);
		Then.iShouldSeeItemWithSelection("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 3);
		Then.iShouldSeeItemWithSelection("Date", false);

		Then.iShouldSeeItemOnPosition("Price", 4);
		Then.iShouldSeeItemWithSelection("Price", true);

		Then.iShouldSeeItemOnPosition("Product ID", 5);
		Then.iShouldSeeItemWithSelection("Product ID", false);

		Then.iShouldSeeItemOnPosition("Status", 6);
		Then.iShouldSeeItemWithSelection("Status", false);

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});

	opaTest("When I press 'Ok' button, the dialog should close", function(Given, When, Then) {
		//Actions
		When.iPressOkButton();

		// Assertions
		Then.thePersonalizationDialogShouldBeClosed();
		Then.theTableShouldContainColumns("sap.ui.table.Table", 7);
		Then.iShouldSeeVisibleColumnsInOrder("sap.ui.table.Column", [
			"Category", "Price"
		]);
	});

	opaTest("When I press on personalization button again, the personalization dialog opens", function(Given, When, Then) {
		//Actions
		When.iPressOnPersonalizationButton();
		When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Column"));

		// Assertions
		Then.thePersonalizationDialogOpens();
		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Column"));
		Then.iShouldSeePanel("sap.m.p13n.SelectionPanel");

		Then.iShouldSeeItemOnPosition("Category", 0);
		Then.iShouldSeeItemWithSelection("Category", true);

		Then.iShouldSeeItemOnPosition("Price", 1);
		Then.iShouldSeeItemWithSelection("Price", true);

		Then.iShouldSeeItemOnPosition("Currency Code", 2);
		Then.iShouldSeeItemWithSelection("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 3);
		Then.iShouldSeeItemWithSelection("Date", false);

		Then.iShouldSeeItemOnPosition("Name", 4);
		Then.iShouldSeeItemWithSelection("Name", false);

		Then.iShouldSeeItemOnPosition("Product ID", 5);
		Then.iShouldSeeItemWithSelection("Product ID", false);

		Then.iShouldSeeItemOnPosition("Status", 6);
		Then.iShouldSeeItemWithSelection("Status", false);

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});

	opaTest("When I press now 'Restore' button and cancel the warning, nothing should change", function(Given, When, Then) {
		//Actions
		When.iPressRestoreButton();
		Then.iShouldSeeWarning();
		When.iPressCancelButtonOnTheWarningDialog();

		// Assertions
		Then.iShouldSeeItemOnPosition("Category", 0);
		Then.iShouldSeeItemWithSelection("Category", true);

		Then.iShouldSeeItemOnPosition("Price", 1);
		Then.iShouldSeeItemWithSelection("Price", true);

		Then.iShouldSeeItemOnPosition("Currency Code", 2);
		Then.iShouldSeeItemWithSelection("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 3);
		Then.iShouldSeeItemWithSelection("Date", false);

		Then.iShouldSeeItemOnPosition("Name", 4);
		Then.iShouldSeeItemWithSelection("Name", false);

		Then.iShouldSeeItemOnPosition("Product ID", 5);
		Then.iShouldSeeItemWithSelection("Product ID", false);

		Then.iShouldSeeItemOnPosition("Status", 6);
		Then.iShouldSeeItemWithSelection("Status", false);

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});

	opaTest("When I press now 'Cancel' button, the dialog should close", function(Given, When, Then) {
		//Actions
		When.iPressCancelButton();

		// Assertions
		Then.thePersonalizationDialogShouldBeClosed();
		Then.theTableShouldContainColumns("sap.ui.table.Table", 7);
		Then.iShouldSeeVisibleColumnsInOrder("sap.ui.table.Column", [
			"Category", "Price"
		]);

	});

	opaTest("When I press on personalization button again and press 'Escape' the dialog will behave the same as 'Cancel'", function(Given, When, Then) {
		//Actions
		When.iPressOnPersonalizationButton();
		When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Column"));

		//Actions
		When.iPressEscape();

		// Assertions
		Then.thePersonalizationDialogShouldBeClosed();
		Then.theTableShouldContainColumns("sap.ui.table.Table", 7);
		Then.iShouldSeeVisibleColumnsInOrder("sap.ui.table.Column", [
			"Category", "Price"
		]);
	});

	opaTest("When I press on personalization button again, the personalization dialog opens", function(Given, When, Then) {
		//Actions
		When.iPressOnPersonalizationButton();
		When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Column"));

		// Assertions
		Then.thePersonalizationDialogOpens();
		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Column"));
		Then.iShouldSeePanel("sap.m.p13n.SelectionPanel");

		Then.iShouldSeeItemOnPosition("Category", 0);
		Then.iShouldSeeItemWithSelection("Category", true);

		Then.iShouldSeeItemOnPosition("Price", 1);
		Then.iShouldSeeItemWithSelection("Price", true);

		Then.iShouldSeeItemOnPosition("Currency Code", 2);
		Then.iShouldSeeItemWithSelection("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 3);
		Then.iShouldSeeItemWithSelection("Date", false);

		Then.iShouldSeeItemOnPosition("Name", 4);
		Then.iShouldSeeItemWithSelection("Name", false);

		Then.iShouldSeeItemOnPosition("Product ID", 5);
		Then.iShouldSeeItemWithSelection("Product ID", false);

		Then.iShouldSeeItemOnPosition("Status", 6);
		Then.iShouldSeeItemWithSelection("Status", false);

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});

	opaTest("When I press now 'Restore' button, the initial columns selection should reappear", function(Given, When, Then) {
		//Actions
		When.iPressRestoreButton();
		Then.iShouldSeeWarning();
		When.iPressOkButtonOnTheWarningDialog();

		// Assertions
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

	opaTest("When I press 'Ok' button, the dialog should close", function(Given, When, Then) {
		//Actions
		When.iPressOkButton();

		// Assertions
		Then.thePersonalizationDialogShouldBeClosed();
		Then.theTableShouldContainColumns("sap.ui.table.Table", 7);
		Then.iShouldSeeVisibleColumnsInOrder("sap.ui.table.Column", [
			"Name", "Category"
		]); // 'Category' is not visible as the column is grouped

	});

	opaTest("When I select 'Price', the 'Restore' button should be enabled, triggering a reset will execute immediately", function(Given, When, Then) {

		When.iPressOnPersonalizationButton();

		//Actions
		When.iSelectColumn("Date");

		// Assertions
		Then.iShouldSeeItemOnPosition("Name", 0);
		Then.iShouldSeeItemWithSelection("Name", true);

		Then.iShouldSeeItemOnPosition("Category", 1);
		Then.iShouldSeeItemWithSelection("Category", true);

		Then.iShouldSeeItemOnPosition("Currency Code", 2);
		Then.iShouldSeeItemWithSelection("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 3);
		Then.iShouldSeeItemWithSelection("Date", true);

		Then.iShouldSeeItemOnPosition("Price", 4);
		Then.iShouldSeeItemWithSelection("Price", false);

		Then.iShouldSeeItemOnPosition("Product ID", 5);
		Then.iShouldSeeItemWithSelection("Product ID", false);

		Then.iShouldSeeItemOnPosition("Status", 6);
		Then.iShouldSeeItemWithSelection("Status", false);

		//Close Dialog --> column added
		When.iPressOkButton();
		Then.iShouldSeeVisibleColumnsInOrder("sap.ui.table.Column", [
			"Name", "Category", "Date"
		]);

		//Open dialog and trigger a reset
		When.iPressOnPersonalizationButton();
		When.iPressRestoreButton();
		Then.iShouldSeeWarning();
		When.iPressOkButtonOnTheWarningDialog();

		//cancel the dialog --> reset should still be triggered
		When.iPressCancelButton();
		Then.iShouldSeeVisibleColumnsInOrder("sap.ui.table.Column", [
			"Name", "Category"
		]);

		When.iPressOnPersonalizationButton();

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

		When.iPressOkButton();

		Then.iTeardownMyAppFrame();
	});
});
