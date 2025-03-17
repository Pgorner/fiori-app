sap.ui.define([
	'sap/ui/test/Opa5',
	'sap/ui/test/opaQunit',
	'sap/ui/comp/qunit/personalization/opaTests/Util',
	'sap/ui/comp/qunit/personalization/opaTests/Arrangement',
	'sap/ui/comp/qunit/personalization/opaTests/Action',
	'sap/ui/comp/qunit/personalization/opaTests/Assertion',
	'sap/ui/Device'

], function(Opa5, opaTest, Util, Arrangement, Action, Assertion, Device) {
	'use strict';

	Opa5.extendConfig({
		asyncPolling: false,
		arrangements: new Arrangement(),
		actions: new Action(),
		assertions: new Assertion(),
		viewNamespace: "applicationUnderTestWithVariant.view."
	});

	opaTest("When I press on personalization button, the personalization dialog opens", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyAppInAFrame('test-resources/sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestWithVariant/start.html');

		//Actions
		When.iPressOnPersonalizationButton();

		// Assertions
		Then.thePersonalizationDialogOpens();
	});

	opaTest("When I navigate to sort panel, the initial sorting should appear and the 'Restore' button should be disabled", function(Given, When, Then) {
		//Actions
		When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Sort"));

		// Assertions
		// check that variant management is not used i.g. FullReset!!!
		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Sort"));
		Then.iShouldSeePanel("sap.m.p13n.SortPanel");
		Then.iShouldSeeSortSelectionWithSortOrderAscending("Product Category");

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});

	opaTest("When I press 'remove line' button, the initial sorting should disappear and the 'Restore' button should be enabled", function(Given, When, Then) {
		//Actions
		When.iRemoveASortLine(0);

		// Assertions
		Then.iShouldSeeSortSelectionWithSortOrderAscending(Util.getTextFromResourceBundle("sap.m", "P13NDIALOG_SELECTION_NONE"));

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});

	opaTest("When I press 'Restore' button, the initial sorting should reappear and the 'Restore' button should be disabled", function(Given, When, Then) {
		//Actions
		When.iPressRestoreButton();
		Then.iShouldSeeWarning();
		When.iPressOkButtonOnTheWarningDialog();

		// Assertions
		Then.iShouldSeeSortSelectionWithSortOrderAscending("Product Category");
		Then.theNumberOfSortableColumnKeysShouldRemainStable();

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});

	opaTest("When I change sorting column and press 'Restore', the initial sorting should reappear", function(Given, When, Then) {
		//Actions
		When.iChangeSortSelection("Product Category", "Product Name");
		When.iPressRestoreButton();
		Then.iShouldSeeWarning();
		When.iPressOkButtonOnTheWarningDialog();

		// Assertions
		Then.iShouldSeeSortSelectionWithSortOrderAscending("Product Category");
		Then.theNumberOfSortableColumnKeysShouldRemainStable();

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});

	opaTest("When I press 'OK' button, the dialog should close", function(Given, When, Then) {
		//Actions
		When.iPressOkButton();

		// Assertions
		Then.thePersonalizationDialogShouldBeClosed();
	});

	opaTest("When I load 'SortByName' variant and open dialog, the variant sorting should appear and the 'Restore' button should be disabled", function(Given, When, Then) {
		//Actions
		When.iSelectVariant("SortByName").and.iPressOnPersonalizationButton(true);

		// Assertions
		Then.thePersonalizationDialogOpens();

		When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Sort"));

		Then.iShouldSeeSortSelectionWithSortOrderAscending("Product Name");

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});

	opaTest("When I press 'remove line' button, the empty sorting should appear and the 'Restore' button should be enabled", function(Given, When, Then) {
		//Actions
		When.iRemoveASortLine(0);

		// Assertions
		Then.iShouldSeeSortSelectionWithSortOrderAscending(Util.getTextFromResourceBundle("sap.m", "P13NDIALOG_SELECTION_NONE"));

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});

	opaTest("When I press 'Ok' button, the dialog should close", function(Given, When, Then) {
		//Actions
		When.iPressOkButton();

		// Assertions
		Then.thePersonalizationDialogShouldBeClosed();
	});

	opaTest("When I press on personalization button again, the personalization dialog opens and the 'Restore' button should be enabled", function(Given, When, Then) {
		//Actions
		When.iPressOnPersonalizationButton();

		// Assertions
		Then.thePersonalizationDialogOpens();
		Then.iShouldSeeNavigationControl();
		Then.iShouldSeeNavigationControlWithPanels(4);

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});

	opaTest("When I navigate to sort panel, sort panel is shown", function(Given, When, Then) {
		//Actions
		When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Sort"));

		// Assertions
		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Sort"));
		Then.iShouldSeePanel("sap.m.p13n.SortPanel");
		Then.iShouldSeeSortSelectionWithSortOrderAscending(Util.getTextFromResourceBundle("sap.m", "P13NDIALOG_SELECTION_NONE"));
	});

	opaTest("When I press 'Restore' button, the variant sorting should reappear and the 'Restore' button should be disabled", function(Given, When, Then) {
		//Actions
		When.iPressRestoreButton();
		Then.iShouldSeeWarning();
		When.iPressOkButtonOnTheWarningDialog();

		// Assertions
		Then.iShouldSeeSortSelectionWithSortOrderAscending("Product Name");

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});

	opaTest("When I press 'Ok' button, the dialog should close", function(Given, When, Then) {
		//Actions
		When.iPressOkButton();

		// Assertions
		Then.thePersonalizationDialogShouldBeClosed();
	});

	opaTest("When I load 'SortByName' variant again and open dialog, the variant sorting should appear and the 'Restore' button should be disabled", function(Given, When, Then) {
		//Actions
		When.iSelectVariant("SortByName").and.iPressOnPersonalizationButton(true);

		// Assertions
		Then.thePersonalizationDialogOpens();

		When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Sort"));
		Then.iShouldSeeSortSelectionWithSortOrderAscending("Product Name");

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});

	opaTest("When I change sorting column and press 'OK', the dialog should close", function(Given, When, Then) {
		//Actions
		When.iChangeSortSelection("Product Name", "Description");
		Then.iShouldSeeSortSelectionWithSortOrderAscending("Description");
		Then.theNumberOfSortableColumnKeysShouldRemainStable();

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
		When.iPressOkButton();

		// Assertions
		Then.thePersonalizationDialogShouldBeClosed();
	});

	opaTest("When I save the variant, new variant name should appear", function(Given, When, Then) {
		//Actions
		When.iSaveVariantAs("SortByName", "SortByDescription");

		// Assertions
		Then.iShouldSeeSelectedVariant("SortByDescription");
	});

	opaTest("When I change to the Standard Variant, the initial sorting should appear and the 'Restore' button should be disabled", function(Given, When, Then) {
		//Actions
		When.iSelectVariant("Standard").and.iPressOnPersonalizationButton(true);

		// Assertions
		Then.thePersonalizationDialogOpens();

		When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Sort"));
		Then.iShouldSeeSortSelectionWithSortOrderAscending("Product Category");

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});

	opaTest("When I press 'Ok' button, the dialog should close", function(Given, When, Then) {
		//Actions
		When.iPressOkButton();

		// Assertions
		Then.thePersonalizationDialogShouldBeClosed();
	});

	// BCP 1870572957
	opaTest("When I make the 'SortByName' variant dirty, the 'Restore' button should be enabled", function(Given, When, Then) {
		//Actions
		When.iSelectVariant("SortByName").and.iPressOnPersonalizationButton(true);
		if (Device.system.phone) {
			When.iPressBackButton().and.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "COLUMSPANEL_TITLE"));
		} else {
			When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Column"));
		}
		When.iSelectColumn("Date");

		// Assertions
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
		Then.iShouldSeeItemWithSelection("Date", true);

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

	opaTest("When I switch now from the dirty 'SortByName' variant to the standard variant, the 'Restore' button should be disabled", function(Given, When, Then) {
		//Actions
		When.iPressOkButton();
		When.iSelectVariant("Standard").and.iPressOnPersonalizationButton(true);

		// Assertions
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

		//Remove the App Frame within the last test
		Then.iTeardownMyAppFrame();
	});
});
