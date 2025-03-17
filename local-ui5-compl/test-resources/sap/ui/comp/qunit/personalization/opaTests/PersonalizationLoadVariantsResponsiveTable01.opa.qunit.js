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
	var sMDCFilterPanel = "sap.m.p13n.FilterPanel";

	Opa5.extendConfig({
		asyncPolling: false,
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

	opaTest("When I load 'Compatibility02' variant and open columns panel of the dialog, some columns should be changed", function(Given, When, Then) {
		//Actions
		When.iSelectVariant("Compatibility02").and.iPressOnPersonalizationButton(true).and.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Column"));

		// Assertions
		Then.thePersonalizationDialogOpens();

		Then.iShouldSeeItemOnPosition("Product Category", 0);
		Then.iShouldSeeItemWithSelection("Product Category", true);

		Then.iShouldSeeItemOnPosition("Product Name", 1);
		Then.iShouldSeeItemWithSelection("Product Name", true);

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

	opaTest("When I navigate to sort panel, the sorting should be empty", function(Given, When, Then) {
		if (Device.system.phone) {
			When.iPressBackButton().and.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "SORTPANEL_TITLE"));
		} else {
			When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Sort"));
		}

		// Assertions
		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Sort"));
		Then.iShouldSeePanel("sap.m.p13n.SortPanel");
		Then.iShouldSeeSortSelectionWithColumnName(Util.getTextFromResourceBundle("sap.m", "P13NDIALOG_SELECTION_NONE"));
		Then.iShouldSeeSortSelectionWithSortOrderAscending(Util.getTextFromResourceBundle("sap.m", "P13NDIALOG_SELECTION_NONE"));
	});

	opaTest("When I navigate to filter panel, the filter should be empty", function(Given, When, Then) {
		if (Device.system.phone) {
			When.iPressBackButton().and.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "FILTERPANEL_TITLE"));
		} else {
			When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Filter"));
		}

		// Assertions
		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Filter"));
		Then.iShouldSeePanel(sMDCFilterPanel);
		Then.iShouldSeeEmptyFilterPanel();
	});

	opaTest("When I navigate to group panel, the group should be empty", function(Given, When, Then) {
		if (Device.system.phone) {
			When.iPressBackButton().and.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "GROUPPANEL_TITLE"));
		} else {
			When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Group"));
		}

		// Assertions
		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Group"));
		Then.iShouldSeePanel("sap.m.p13n.GroupPanel");
		Then.iShouldSeeGroupSelectionWithColumnName(Util.getTextFromResourceBundle("sap.m", "P13NDIALOG_SELECTION_NONE"));
	});

	opaTest("When I press 'OK' button, the dialog should close", function(Given, When, Then) {
		When.iPressOkButton();
		Then.thePersonalizationDialogShouldBeClosed();
		Then.iTeardownMyAppFrame();
	});
});
