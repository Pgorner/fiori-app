sap.ui.define([
	'sap/ui/test/Opa5',
	'sap/ui/test/opaQunit',
	'test-resources/sap/ui/comp/testutils/opa/TestLibrary',
	'sap/ui/comp/qunit/personalization/opaTests/Arrangement',
	'sap/ui/comp/qunit/personalization/opaTests/Action',
	'sap/ui/comp/qunit/personalization/opaTests/Assertion'
], function(
	Opa5,
	opaTest,
	testLibrary,
	Arrangement,
	Action,
	Assertion
) {
	'use strict';

	Opa5.extendConfig({
		autoWait: true,
		arrangements: new Arrangement(),
		actions: new Action(),
		assertions: new Assertion(),
		viewNamespace: "view."
	});

	var sTableId = "appUnderTestSmartTableResponsiveTable---mainView--IDSmartTable";
	var sFilterPanel = "sap.m.p13n.FilterPanel";

	opaTest("Start the test application", function(Given, When, Then) {
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/personalization/opaTests/appUnderTestSmartTableResponsiveTable/start.html"));
		Then.iShouldSeeATable();
	});

	opaTest("Open column header menu and add a filter", function(Given, When, Then) {
		When.iPressColumnHeader("Name");
		Then.iShouldSeeTheColumnMenu();

		When.iPressOnListItemWithTitle("Filter");
		Then.iShouldSeePanel(sFilterPanel);

		When.iEnterFilterPanelInput(sTableId, "Name", "*a*");
		When.iPressOkButton();
	});

	opaTest("Check Filter OverflowToolbar", function(Given, When, Then) {
		Then.iShouldSeeFilterOverflowToolBar();

		When.iPressFilterOverflowToolbar();
		Then.iShouldSeePanel(sFilterPanel);
		When.iPressOkButton();

		When.iPressFilterOverflowToolbarClearFilterButton(sTableId);
		Then.iShouldNotSeeFilterOverflowToolBar();

		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		Then.iShouldSeeEmptyFilterPanel();

		//Check that p13n controller is not bypassed and no missmatch between table state and personalisation controller exists
		When.iPressOkButton();
		Then.iShouldNotSeeFilterOverflowToolBar();
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		Then.iShouldSeeEmptyFilterPanel();

		Then.iTeardownMyApp();
	});
});
