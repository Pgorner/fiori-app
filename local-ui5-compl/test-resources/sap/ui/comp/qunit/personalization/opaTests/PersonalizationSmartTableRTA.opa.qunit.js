sap.ui.define([
	'sap/ui/test/Opa5',
	'sap/ui/test/opaQunit',
	'test-resources/sap/ui/comp/testutils/opa/TestLibrary',
	'sap/ui/comp/qunit/personalization/opaTests/Util',
	'sap/ui/comp/qunit/personalization/opaTests/Arrangement',
	'sap/ui/comp/qunit/personalization/opaTests/Action',
	'sap/ui/comp/qunit/personalization/opaTests/Assertion',
	'test-resources/sap/ui/rta/integration/pages/Adaptation'
], function(
	Opa5,
	opaTest,
	testLibrary,
	Util,
	Arrangement,
	Action,
	Assertion,
	Adaptation
) {
	'use strict';

	Opa5.extendConfig({
		autoWait:true,
		arrangements: new Arrangement(),
		actions: new Action(),
		assertions: new Assertion(),
		viewNamespace: "view."
	});

	var ST_ID = "applicationUnderTest---IDView--IDSmartTable";
	var VM_ID = "applicationUnderTest---IDView--IDSmartTable-variant";

	opaTest("Start the test application", function(Given, When, Then) {
		Given.iClearTheLocalStorageFromRtaRestart();
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/personalization/opaTests/applicationUnderTest/start.html"));

		Then.iShouldSeeVisibleColumnsInOrder("sap.ui.table.AnalyticalColumn", [
			"Name", "Category"
		]);
	});

	opaTest("Switch into RTA mode", function(Given, When, Then){

		When.iPressButtonWithText("Start RTA");

		Then.onPageWithRTA.iShouldSeeTheToolbar();
	});

	opaTest("Open custom p13n action + check amount of panels", function(Given, When, Then) {
		When.onPageWithRTA.iRightClickOnAnElementOverlay(ST_ID);
		When.onPageWithRTA.iClickOnAContextMenuEntry(3); //view settings
		Then.thePersonalizationDialogOpens();

		Then.iShouldSeePanelsInOrder([
			Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Column"),
			Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Sort"),
			Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Filter"),
			Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Group")
		]);

		When.iPressOkButton();
		Then.thePersonalizationDialogShouldBeClosed();
	});

	opaTest("Change the column personalization for the SmartTable", function(Given, When, Then) {

		// the standard variant can't be changed, so a new variant should be created first
		When.onPageWithRTA.iRightClickOnAnElementOverlay(VM_ID);
		When.onPageWithRTA.iClickOnAContextMenuEntry(0); // save as
		When.iEnterNewVariantName("Standard", "Standard2");

		When.onPageWithRTA.iRightClickOnAnElementOverlay(ST_ID);
		When.onPageWithRTA.iClickOnAContextMenuEntry(3); //view settings
		Then.thePersonalizationDialogOpens();

		When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Column"));

		When.iSelectColumn("Product ID");

		Then.iShouldSeeItemOnPosition("Name", 0);
		Then.iShouldSeeItemWithSelection("Name", true);

		Then.iShouldSeeItemOnPosition("Category", 1);
		Then.iShouldSeeItemWithSelection("Category", true);

		Then.iShouldSeeItemOnPosition("Currency Code", 2);
		Then.iShouldSeeItemWithSelection("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 3);
		Then.iShouldSeeItemWithSelection("Date", false);

		Then.iShouldSeeItemOnPosition("Price", 4);
		Then.iShouldSeeItemWithSelection("Price", false);

		Then.iShouldSeeItemOnPosition("Product ID", 5);
		Then.iShouldSeeItemWithSelection("Product ID", true);

		Then.iShouldSeeItemOnPosition("Status", 6);
		Then.iShouldSeeItemWithSelection("Status", false);

	});

	opaTest("Check and close the Dialog and cleanup", function(Given, When, Then) {

		When.iPressOkButton();
		Then.thePersonalizationDialogShouldBeClosed();

		Then.iShouldSeeVisibleColumnsInOrder("sap.ui.table.AnalyticalColumn", [
			"Name", "Category", "Product ID"
		]);

		Then.iTeardownMyAppFrame();
	});
});


