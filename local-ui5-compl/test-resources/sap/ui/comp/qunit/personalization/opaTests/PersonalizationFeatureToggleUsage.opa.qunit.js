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
		viewNamespace: "view."
	});

	opaTest("When I look at the screen, table with some visible columns should appear", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestIgnoreSimple/start.html"));

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

	opaTest("When I navigate to group panel, the group should be empty", function(Given, When, Then) {
		//Actions
		When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Group"));

		// Assertions
		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Group"));
		Then.iShouldSeePanel("sap.m.p13n.GroupPanel");
		Then.iShouldSeeGroupSelectionWithColumnName(Util.getTextFromResourceBundle("sap.m", "P13NDIALOG_SELECTION_NONE"));
		Then.iShouldSeeGroupSelectionWithCheckedShowFieldAsColumn(Util.getTextFromResourceBundle("sap.m", "P13NDIALOG_SELECTION_NONE"), true);
		Then.iShouldSeeGroupSelectionWithEnabledShowFieldAsColumn(Util.getTextFromResourceBundle("sap.m", "P13NDIALOG_SELECTION_NONE"), false);
	});

	opaTest("When I set 'Category' as grouped, 'Category' should be selected", function(Given, When, Then) {
		//Actions
		When.iChangeGroupSelection(Util.getTextFromResourceBundle("sap.m", "P13NDIALOG_SELECTION_NONE"), "Category");

		// Assertions
		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Group"));
		Then.iShouldSeeGroupSelectionWithColumnName("Category");
	});

	opaTest("When I close the dialog, the table should be grouped", function(Given, When, Then) {
		//Actions
		When.iPressOkButton();

		// Assertions
		Then.thePersonalizationDialogShouldBeClosed();
		Then.iShouldSeeVisibleColumnsInOrder("sap.ui.table.AnalyticalColumn", [
			"Name", "Category"
		]);
		Then.iTeardownMyAppFrame();
	});
});
