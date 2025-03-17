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
		// Arrangements
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestWithVariant/start.html"));
		//Actions
		When.iPressOnPersonalizationButton();
		// Assertions
		Then.thePersonalizationDialogOpens();
	});
	opaTest("I make column 'Date' visible and close the personalization dialog", function(Given, When, Then) {
		When.iSelectColumn("Date").and.iPressOkButton();
		Then.thePersonalizationDialogShouldBeClosed();
	});
	opaTest("When I press on column header of 'Date', the context menu should appear", function(Given, When, Then) {
		When.iPressAnalyticalColumnHeader("Date");
		Then.theColumnMenuOpens();
	});
	opaTest("When I press on personalization button again, the personalization dialog opens", function(Given, When, Then) {
		When.iPressOnPersonalizationButton();
		When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Column"));

		Then.thePersonalizationDialogOpens();
		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Column"));
		Then.iShouldSeePanel("sap.m.p13n.SelectionPanel");

		Then.iShouldSeeItemOnPosition("Product Name", 0);
		Then.iShouldSeeItemWithSelection("Product Name", true);
		Then.iShouldSeeItemOnPosition("Product Category", 1);
		Then.iShouldSeeItemWithSelection("Product Category", true);
		Then.iShouldSeeItemOnPosition("Date", 2);
		Then.iShouldSeeItemWithSelection("Date", true);
		Then.iShouldSeeItemOnPosition("Bool", 3);
		Then.iShouldSeeItemWithSelection("Bool", false);
		Then.iShouldSeeItemOnPosition("Company Name", 4);
		Then.iShouldSeeItemWithSelection("Company Name", false);
		Then.iShouldSeeItemOnPosition("Currency Code", 5);
		Then.iShouldSeeItemWithSelection("Currency Code", false);
		Then.iShouldSeeItemOnPosition("Description", 6);
		Then.iShouldSeeItemWithSelection("Description", false);
		Then.iShouldSeeItemOnPosition("Dimension Depth", 7);
		Then.iShouldSeeItemWithSelection("Dimension Depth", false);
		Then.iShouldSeeItemOnPosition("Dimension Height", 8);
		Then.iShouldSeeItemWithSelection("Dimension Height", false);
		Then.iShouldSeeItemOnPosition("Dimension Unit", 9);
		Then.iShouldSeeItemWithSelection("Dimension Unit", false);
		Then.iShouldSeeItemOnPosition("Dimension Width", 10);
		Then.iShouldSeeItemWithSelection("Dimension Width", false);
		Then.iShouldSeeItemOnPosition("GUID", 11);
		Then.iShouldSeeItemWithSelection("GUID", false);
		Then.iShouldSeeItemOnPosition("Price", 12);
		Then.iShouldSeeItemWithSelection("Price", false);
		Then.iShouldSeeItemOnPosition("Product ID", 13);
		Then.iShouldSeeItemWithSelection("Product ID", false);
		Then.iShouldSeeItemOnPosition("Quantity", 14);
		Then.iShouldSeeItemWithSelection("Quantity", false);
		Then.iShouldSeeItemOnPosition("Status", 15);
		Then.iShouldSeeItemWithSelection("Status", false);
		Then.iShouldSeeItemOnPosition("Time", 16);
		Then.iShouldSeeItemWithSelection("Time", false);
		Then.iShouldSeeItemOnPosition("Unit Of Measure", 17);
		Then.iShouldSeeItemWithSelection("Unit Of Measure", false);
		Then.iShouldSeeItemOnPosition("Weight", 18);
		Then.iShouldSeeItemWithSelection("Weight", false);
		Then.iShouldSeeItemOnPosition("Weight Unit", 19);
		Then.iShouldSeeItemWithSelection("Weight Unit", false);

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});
	opaTest("When I press now 'Cancel' button, the dialog should close", function(Given, When, Then) {
		When.iPressCancelButton();
		Then.thePersonalizationDialogShouldBeClosed();
	});
	opaTest("When I press on column header of 'Date', the context menu should appear", function(Given, When, Then) {
		When.iPressAnalyticalColumnHeader("Date");
		Then.theColumnMenuOpens();
	});

	opaTest("When I open settings dialog from column header menu Reset button should not be visible", function(Given, When, Then) {
		When.iPressOnListItemWithTitle("Sort");
		Then.iShouldSeeDialogWithVisibleResetButton(false);
		When.iPressCancelButton();

		When.iPressAnalyticalColumnHeader("Date");
		Then.theColumnMenuOpens();
		When.iPressOnListItemWithTitle("Filter");
		Then.iShouldSeeDialogWithVisibleResetButton(false);
		When.iPressCancelButton();

		When.iPressAnalyticalColumnHeader("Date");
		Then.theColumnMenuOpens();
		When.iPressOnListItemWithTitle("Group");
		Then.iShouldSeeDialogWithVisibleResetButton(false);
		When.iPressCancelButton();

		When.iPressAnalyticalColumnHeader("Date");
		Then.theColumnMenuOpens();
		When.iPressOnListItemWithTitle("Columns");
		Then.iShouldSeeDialogWithVisibleResetButton(false);
		When.iPressCancelButton();
	});

	opaTest("When I open settings dialog from settings button Reset button should be visible", function(Given, When, Then) {
		When.iPressOnPersonalizationButton();
		Then.iShouldSeeDialogWithVisibleResetButton(true);

		Then.iTeardownMyAppFrame();
	});
});
