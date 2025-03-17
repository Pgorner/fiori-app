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
		Given.iStartMyAppInAFrame('test-resources/sap/ui/comp/qunit/personalization/opaTests/applicationUnderTest/start.html');

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

	// ----------------------------------------------------------------------
	// Test: deselect and select the 'Show Field as Column' checkbox
	// ----------------------------------------------------------------------

	opaTest("When I press on group tab, group panel with initial grouped column should appear", function(Given, When, Then) {
		//Actions
		When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Group"));

		// Assertions
		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Group"));
		Then.iShouldSeePanel("sap.m.p13n.GroupPanel");
		Then.iShouldSeeGroupSelectionWithColumnName("Category");
		Then.iShouldSeeGroupSelectionWithCheckedShowFieldAsColumn("Category", true);
		Then.iShouldSeeGroupSelectionWithEnabledShowFieldAsColumn("Category", true);

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});

	opaTest("When I deselect 'show field as column' checkbox, 'Restore' button should be enabled", function(Given, When, Then) {
		//Actions
		When.iClickOnTheCheckboxShowFieldAsColumn("Category");

		// Assertions
		Then.iShouldSeeGroupSelectionWithColumnName("Category");
		Then.iShouldSeeGroupSelectionWithCheckedShowFieldAsColumn("Category", false);
		Then.iShouldSeeGroupSelectionWithEnabledShowFieldAsColumn("Category", true);

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});

	opaTest("When I select 'show field as column' checkbox again, 'Restore' button should be disabled", function(Given, When, Then) {
		//Actions
		When.iClickOnTheCheckboxShowFieldAsColumn("Category");

		// Assertions
		Then.iShouldSeeGroupSelectionWithColumnName("Category");
		Then.iShouldSeeGroupSelectionWithCheckedShowFieldAsColumn("Category", true);
		Then.iShouldSeeGroupSelectionWithEnabledShowFieldAsColumn("Category", true);

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});

	opaTest("When I press 'Ok' button, the dialog should close", function(Given, When, Then) {
		//Actions
		When.iPressOkButton();

		// Assertions
		Then.thePersonalizationDialogShouldBeClosed();
		Then.iTeardownMyAppFrame();
	});
});
