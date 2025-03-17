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

	opaTest("When I look at the screen, table with some visible columns should appear", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyAppInAFrame('test-resources/sap/ui/comp/qunit/personalization/opaTests/appUnderTestResponsiveTableWithVariant/start.html');

		//Actions
		When.iLookAtTheScreen();

		// Assertions
		Then.theTableShouldContainColumns("sap.m.Table", 2);
		Then.iShouldSeeVisibleColumnsInOrder("sap.m.Column", [
			"Product Name", "Product Category"
		]);
	});

	opaTest("When I navigate to columns panel, columns panel is shown", function(Given, When, Then) {
		//Actions
		When.iPressOnPersonalizationButton().and.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Column"));

		// Assertions
		Then.thePersonalizationDialogOpens();
		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Column"));
		Then.iShouldSeePanel("sap.m.p13n.SelectionPanel");

		Then.iShouldSeeItemOnPosition("Product Name", 0);
		Then.iShouldSeeItemWithSelection("Product Name", true);

		Then.iShouldSeeItemOnPosition("Product Category", 1);
		Then.iShouldSeeItemWithSelection("Product Category", true);

		Then.iShouldSeeItemOnPosition("Bool", 2);
		Then.iShouldSeeItemWithSelection("Bool", false);

		Then.iShouldSeeItemOnPosition("Company Name", 3);
		Then.iShouldSeeItemWithSelection("Company Name", false);

		Then.iShouldSeeItemOnPosition("Currency Code", 4);
		Then.iShouldSeeItemWithSelection("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 5);
		Then.iShouldSeeItemWithSelection("Date", false);

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

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});

	opaTest("When I select 'Price', the 'Price' should be selected", function(Given, When, Then) {
		//Actions
		When.iSelectColumn("Price");

		// Assertions
		Then.iShouldSeeItemOnPosition("Product Name", 0);
		Then.iShouldSeeItemWithSelection("Product Name", true);

		Then.iShouldSeeItemOnPosition("Product Category", 1);
		Then.iShouldSeeItemWithSelection("Product Category", true);

		Then.iShouldSeeItemOnPosition("Bool", 2);
		Then.iShouldSeeItemWithSelection("Bool", false);

		Then.iShouldSeeItemOnPosition("Company Name", 3);
		Then.iShouldSeeItemWithSelection("Company Name", false);

		Then.iShouldSeeItemOnPosition("Currency Code", 4);
		Then.iShouldSeeItemWithSelection("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 5);
		Then.iShouldSeeItemWithSelection("Date", false);

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
		Then.iShouldSeeItemWithSelection("Price", true);

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

	opaTest("When I press 'Ok' button, the dialog should close and selected 'Price' should be visible in table", function(Given, When, Then) {
		When.iPressOkButton();
		Then.thePersonalizationDialogShouldBeClosed();
		Then.theTableShouldContainColumns("sap.m.Table", 20);
		Then.iShouldSeeVisibleColumnsInOrder("sap.m.Column", [
			"Product Name", "Product Category", "Price"
		]);
		Then.iTeardownMyAppFrame();
	});
});
