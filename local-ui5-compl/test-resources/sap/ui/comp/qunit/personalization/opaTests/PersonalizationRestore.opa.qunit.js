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
		asyncPolling: true,
		arrangements: new Arrangement(),
		actions: new Action(),
		assertions: new Assertion(),
		viewNamespace: "applicationUnderTestPerf.view."
	});

	opaTest("When I look at the screen, table with some visible columns should appear", function(Given, When, Then) {
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

	opaTest("When I press on group tab, group panel with initial selected group should appear", function(Given, When, Then) {
		//Actions
		When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Group"));

		// Assertions
		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Group"));
		Then.iShouldSeePanel("sap.m.p13n.GroupPanel");

		Then.iShouldSeeGroupSelectionWithColumnName("Name");
		Then.iShouldSeeGroupSelectionOnPosition("Name", 0);

		Then.iShouldSeeGroupSelectionWithColumnName("Category");
		Then.iShouldSeeGroupSelectionOnPosition("Category", 1);
	});

	// ------------------------------------------------------
	// Test: delete and restore a filter
	// ------------------------------------------------------

	opaTest("When I select filter tab, the initial filtering should appear", function(Given, When, Then) {
		//Actions
		if (Device.system.phone) {
			When.iPressBackButton().and.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "FILTERPANEL_TITLE"));
		} else {
			When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Filter"));
		}

		// Assertions
		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Filter"));
		Then.iShouldSeePanel(sMDCFilterPanel);
		Then.iShouldSeeFilterWithNameAndToken("Date", "=Apr 15, 2014", "EQ");
	});

	opaTest("When I press 'remove line' button, the initial filtering should disappear", function(Given, When, Then) {
		//Actions
		When.iPressOnButtonWithIcon("sap-icon://decline");

		// Assertions
		Then.iShouldSeeEmptyFilterPanel();
	});

	opaTest("When I press 'Restore' button, the initial filtering should reappear", function(Given, When, Then) {
		//Actions
		When.iPressRestoreButton();
		Then.iShouldSeeWarning();
		When.iPressOkButtonOnTheWarningDialog();

		// Assertions
		Then.iShouldSeeFilterWithNameAndToken("Date", "=Apr 15, 2014", "EQ");

		Then.theNumberOfFilterableColumnKeysShouldRemainStable();
	});

	opaTest("When I press 'Ok' button, the dialog should close", function(Given, When, Then) {
		//Actions
		When.iPressOkButton();

		// Assertions
		Then.thePersonalizationDialogShouldBeClosed();
	});

	// ------------------------------------------------------
	// Test: delete and restore a variant filter
	// ------------------------------------------------------

	opaTest("When I load 'Filtered By Name 'Gladiator MX'' variant and open filter panel of the dialog, some table characteristics should be changed", function(Given, When, Then) {
		//Actions
		When.iSelectVariant("Filtered By Name 'Gladiator MX'").and.iPressOnPersonalizationButton(true).and.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Filter"));

		// Assertions
		Then.iShouldSeeFilterWithNameAndToken("Name", "*Gladiator MX*", "Contains");
	});

	opaTest("When I press 'remove line' button, the empty filtering should appear", function(Given, When, Then) {
		//Actions
		When.iPressOnButtonWithIcon("sap-icon://decline");

		// Assertions
		Then.iShouldSeeEmptyFilterPanel();
	});

	opaTest("When I press 'Ok' button, the dialog should close", function(Given, When, Then) {
		//Actions
		When.iPressOkButton();

		// Assertions
		Then.thePersonalizationDialogShouldBeClosed();
	});

	opaTest("When I press on personalization button again, the personalization dialog opens", function(Given, When, Then) {
		//Actions
		When.iPressOnPersonalizationButton();

		// Assertions
		Then.thePersonalizationDialogOpens();
		Then.iShouldSeeNavigationControl();
		Then.iShouldSeeNavigationControlWithPanels(4);
	});

	opaTest("When I navigate to filter panel, filter panel is shown", function(Given, When, Then) {
		//Actions
		When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Filter"));

		// Assertions
		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Filter"));
		Then.iShouldSeePanel(sMDCFilterPanel);
		Then.iShouldSeeEmptyFilterPanel();
	});

	opaTest("When I press 'Restore' button, the initial filtering should reappear", function(Given, When, Then) {
		//Actions
		When.iPressRestoreButton();
		Then.iShouldSeeWarning();
		When.iPressOkButtonOnTheWarningDialog();

		// Assertions
		Then.iShouldSeeFilterWithNameAndToken("Date", "=Apr 15, 2014", "EQ");

		Then.theNumberOfFilterableColumnKeysShouldRemainStable();
	});

	opaTest("When I press 'Ok' button, the dialog should close", function(Given, When, Then) {
		//Actions
		When.iPressOkButton();

		// Assertions
		Then.thePersonalizationDialogShouldBeClosed();
		Then.iTeardownMyAppFrame();
	});
});
