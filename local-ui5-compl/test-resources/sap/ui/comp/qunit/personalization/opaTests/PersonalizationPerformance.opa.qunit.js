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
		arrangements: new Arrangement(),
		actions: new Action(),
		assertions: new Assertion(),
		viewNamespace: "applicationUnderTestPerf.view."
	});

	opaTest("When I look at the screen, personalization button should appear", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyAppInAFrame('test-resources/sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestPerf/start.html');

		//Actions
		When.iLookAtTheScreen();

		// Assertions
		Then.iShouldSeePersonalizationButton("sap.m.Button");
		Then.theTableShouldContainColumns("sap.ui.table.AnalyticalTable", 2);
		Then.iShouldSeeVisibleColumnsInOrder("sap.ui.table.AnalyticalColumn", [
			"Category"
		]);
	});

	opaTest("When I press on personalization button, the personalization dialog opens", function(Given, When, Then) {
		// Arrangements

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

		Then.theTableShouldContainColumns("sap.ui.table.AnalyticalTable", 2); // we do not add columns to the table after open
		Then.iShouldSeeVisibleColumnsInOrder("sap.ui.table.AnalyticalColumn", [
			"Category"
		]);
	});

	opaTest("When I navigate to columns panel, columns panel is shown", function(Given, When, Then) {
		// Arrangements

		//Actions
		When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Column"));

		// Assertions
		Then.iShouldSeeItemOnPosition("Name", 0);
		Then.iShouldSeeItemWithSelection("Name", true);

		Then.iShouldSeeItemOnPosition("Category", 1);
		Then.iShouldSeeItemWithSelection("Category", true);

		Then.iShouldSeeItemOnPosition("Date", 2);
		Then.iShouldSeeItemWithSelection("Date", false);

		Then.iShouldSeeItemOnPosition("Price", 3);
		Then.iShouldSeeItemWithSelection("Price", false);

		Then.iShouldSeeItemOnPosition("Product ID", 4);
		Then.iShouldSeeItemWithSelection("Product ID", false);

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});

	opaTest("When I press 'Ok' button, the dialog should close and 2 visible columns appear", function(Given, When, Then) {
		// Arrangements

		//Actions
		When.iPressOkButton();

		// Assertions
		Then.thePersonalizationDialogShouldBeClosed();
		Then.theTableShouldContainColumns("sap.ui.table.AnalyticalTable", 5); // we add the lazy columns with 'Ok'
		Then.iShouldSeeVisibleColumnsInOrder("sap.ui.table.AnalyticalColumn", [
			"Category"
		]);
	});

	opaTest("When I press on personalization button again, the personalization dialog opens", function(Given, When, Then) {
		// Arrangements

		//Actions
		When.iPressOnPersonalizationButton().and.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Column"));

		// Assertions
		Then.thePersonalizationDialogOpens();

		Then.iShouldSeeItemOnPosition("Name", 0);
		Then.iShouldSeeItemWithSelection("Name", true);

		Then.iShouldSeeItemOnPosition("Category", 1);
		Then.iShouldSeeItemWithSelection("Category", true);

		Then.iShouldSeeItemOnPosition("Date", 2);
		Then.iShouldSeeItemWithSelection("Date", false);

		Then.iShouldSeeItemOnPosition("Price", 3);
		Then.iShouldSeeItemWithSelection("Price", false);

		Then.iShouldSeeItemOnPosition("Product ID", 4);
		Then.iShouldSeeItemWithSelection("Product ID", false);

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});

	opaTest("When I select 'Product ID' column, the 'Restore' button should be enabled", function(Given, When, Then) {
		// Arrangements

		//Actions
		When.iSelectColumn("Product ID");

		// Assertions
		Then.iShouldSeeItemOnPosition("Name", 0);
		Then.iShouldSeeItemWithSelection("Name", true);

		Then.iShouldSeeItemOnPosition("Category", 1);
		Then.iShouldSeeItemWithSelection("Category", true);

		Then.iShouldSeeItemOnPosition("Date", 2);
		Then.iShouldSeeItemWithSelection("Date", false);

		Then.iShouldSeeItemOnPosition("Price", 3);
		Then.iShouldSeeItemWithSelection("Price", false);

		Then.iShouldSeeItemOnPosition("Product ID", 4);
		Then.iShouldSeeItemWithSelection("Product ID", true);

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});

	opaTest("When I press 'Ok' button, the dialog should close and 1 visible columns appear", function(Given, When, Then) {
		// Arrangements

		//Actions
		When.iPressOkButton();

		// Assertions
		Then.thePersonalizationDialogShouldBeClosed();
		Then.theTableShouldContainColumns("sap.ui.table.AnalyticalTable", 5);
		Then.iShouldSeeVisibleColumnsInOrder("sap.ui.table.AnalyticalColumn", [
			"Product ID"
		]);

		Then.iTeardownMyAppFrame();
	});
});
