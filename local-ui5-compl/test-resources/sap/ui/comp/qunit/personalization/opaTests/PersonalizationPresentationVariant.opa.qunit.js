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
		autoWait:true,
		arrangements: new Arrangement(),
		actions: new Action(),
		assertions: new Assertion(),
		viewNamespace: "view."
	});

	opaTest("When I press on personalization button, the personalization dialog opens", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyAppInAFrame('test-resources/sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestSmartTable/start.html');

		//Actions
		When.iLookAtTheScreen();

		// Assertions
		Then.theTableShouldContainColumns("sap.ui.table.AnalyticalTable", 3);
		Then.iShouldSeeVisibleColumnsInOrder("sap.ui.table.AnalyticalColumn", ["Name", "Price", "Category"]);
	});

	opaTest("When I press on personalization button, the personalization dialog opens", function (Given, When, Then) {
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

	opaTest("When I navigate to columns panel, the initially visible columns should be selected", function (Given, When, Then) {
		//Actions
		When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Column"));

		// Assertions
		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Column"));
		Then.iShouldSeePanel("sap.m.p13n.SelectionPanel");

		Then.iShouldSeeItemOnPosition("Name", 0);
		Then.iShouldSeeItemWithSelection("Name", true);

		Then.iShouldSeeItemOnPosition("Price", 1);
		Then.iShouldSeeItemWithSelection("Price", true);

		Then.iShouldSeeItemOnPosition("Category", 2);
		Then.iShouldSeeItemWithSelection("Category", true);

		Then.iShouldSeeItemOnPosition("Bool", 3);
		Then.iShouldSeeItemWithSelection("Bool", false);

		Then.iShouldSeeItemOnPosition("Company Name", 4);
		Then.iShouldSeeItemWithSelection("Company Name", false);

		Then.iShouldSeeItemOnPosition("Currency Code", 5);
		Then.iShouldSeeItemWithSelection("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 6);
		Then.iShouldSeeItemWithSelection("Date", false);

		Then.iShouldSeeItemOnPosition("Description", 7);
		Then.iShouldSeeItemWithSelection("Description", false);

		Then.iShouldSeeItemOnPosition("Dimension Depth", 8);
		Then.iShouldSeeItemWithSelection("Dimension Depth", false);

		Then.iShouldSeeItemOnPosition("Dimension Height", 9);
		Then.iShouldSeeItemWithSelection("Dimension Height", false);

		Then.iShouldSeeItemOnPosition("Dimension Unit", 10);
		Then.iShouldSeeItemWithSelection("Dimension Unit", false);

		Then.iShouldSeeItemOnPosition("Dimension Width", 11);
		Then.iShouldSeeItemWithSelection("Dimension Width", false);

		Then.iShouldSeeItemOnPosition("GUID", 12);
		Then.iShouldSeeItemWithSelection("GUID", false);

		Then.iShouldSeeItemOnPosition("Product ID", 13);
		Then.iShouldSeeItemWithSelection("Product ID", false);

		Then.iShouldSeeItemOnPosition("Quantity", 14);
		Then.iShouldSeeItemWithSelection("Quantity", false);

		Then.iShouldSeeItemOnPosition("Status", 15);
		Then.iShouldSeeItemWithSelection("Status", false);

		Then.iShouldSeeItemOnPosition("Unit Of Measure", 16);
		Then.iShouldSeeItemWithSelection("Unit Of Measure", false);

		Then.iShouldSeeItemOnPosition("Weight", 17);
		Then.iShouldSeeItemWithSelection("Weight", false);

		Then.iShouldSeeItemOnPosition("Weight Unit", 18);
		Then.iShouldSeeItemWithSelection("Weight Unit", false);

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});

	opaTest("When I navigate to sort panel, the initially sorted column should appear", function (Given, When, Then) {
		//Actions
		if (Device.system.phone) {
			When.iPressBackButton().and.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Sort"));
		} else {
			When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Sort"));
		}

		// Assertions
		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Sort"));
		Then.iShouldSeePanel("sap.m.p13n.SortPanel");
		Then.iShouldSeeSortSelectionWithColumnName("Price");
		Then.iShouldSeeSortSelectionWithSortOrderAscending("Price");

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});

	opaTest("When I navigate to filter panel, the initial filter should be empty", function (Given, When, Then) {
		//Actions
		if (Device.system.phone) {
			When.iPressBackButton().and.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Filter"));
		} else {
			When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Filter"));
		}

		// Assertions
		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Filter"));
		Then.iShouldSeePanel(sMDCFilterPanel);
		Then.iShouldSeeEmptyFilterPanel();
	});

	opaTest("When I navigate to group panel, the initially grouped column should appear", function (Given, When, Then) {
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
	});

	opaTest("When I press 'Ok' button, the dialog should close", function (Given, When, Then) {
		// Action
		When.iPressOkButton();

		// Assertions
		Then.thePersonalizationDialogShouldBeClosed();
	});

	opaTest("Filter Icon behaviour", function (Given, When, Then) {
		Then.iShouldSeeNoFilterIconOnAnalyticalColumn("Name");
		Then.iShouldSeeNoFilterIconOnAnalyticalColumn("Price");
		Then.iShouldSeeNoFilterIconOnAnalyticalColumn("Category");

		When.iPressAnalyticalColumnHeader("Name");
		Then.iShouldSeeTheColumnMenu();
		When.iPressOnListItemWithTitle("Filter");
		When.iAddFilter("Name");
		When.iEnterFilterPanelInput("applicationUnderTestSmartTable", "--mainView--IDSmartTable-Name", "*a*");
		When.iPressOkButton();
		Then.iShouldSeeFilterIconOnAnalyticalColumn("Name");
		Then.iShouldSeeNoFilterIconOnAnalyticalColumn("Price");
		Then.iShouldSeeNoFilterIconOnAnalyticalColumn("Category");

		When.iPressAnalyticalColumnHeader("Name");
		Then.iShouldSeeTheColumnMenu();
		When.iPressOnListItemWithTitle("Filter");
		When.iAddFilter("Category");
		When.iEnterFilterPanelInput("applicationUnderTestSmartTable", "--mainView--IDSmartTable-Category", "*c*");
		When.iPressOkButton();
		Then.iShouldSeeFilterIconOnAnalyticalColumn("Name");
		Then.iShouldSeeNoFilterIconOnAnalyticalColumn("Price");
		Then.iShouldSeeFilterIconOnAnalyticalColumn("Category");

		When.iPressAnalyticalColumnHeader("Category");
		Then.iShouldSeeTheColumnMenu();
		When.iPressOnListItemWithTitle("Filter");
		When.iClickRemoveFilterCriterionForColumn("Name");
		When.iPressOkButton();
		Then.iShouldSeeNoFilterIconOnAnalyticalColumn("Name");
		Then.iShouldSeeNoFilterIconOnAnalyticalColumn("Price");
		Then.iShouldSeeFilterIconOnAnalyticalColumn("Category");

		When.iPressAnalyticalColumnHeader("Name");
		Then.iShouldSeeTheColumnMenu();
		When.iPressOnListItemWithTitle("Filter");
		When.iAddFilter("Name");
		When.iEnterFilterPanelInput("applicationUnderTestSmartTable", "--mainView--IDSmartTable-Name", "*c*");
		When.iPressOkButton();
		Then.iShouldSeeFilterIconOnAnalyticalColumn("Name");
		Then.iShouldSeeNoFilterIconOnAnalyticalColumn("Price");
		Then.iShouldSeeFilterIconOnAnalyticalColumn("Category");

		When.iPressAnalyticalColumnHeader("Name");
		Then.iShouldSeeTheColumnMenu();
		When.iPressOnListItemWithTitle("Filter");
		When.iClickRemoveFilterCriterionForColumn("Name");
		When.iClickRemoveFilterCriterionForColumn("Category");
		When.iPressOkButton();
		Then.iShouldSeeNoFilterIconOnAnalyticalColumn("Name");
		Then.iShouldSeeNoFilterIconOnAnalyticalColumn("Price");
		Then.iShouldSeeNoFilterIconOnAnalyticalColumn("Category");

		Then.iTeardownMyAppFrame();
	});
});
