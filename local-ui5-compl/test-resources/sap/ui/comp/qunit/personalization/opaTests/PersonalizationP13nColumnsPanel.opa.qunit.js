sap.ui.define([
	'sap/ui/test/Opa5',
	'sap/ui/test/opaQunit',
	'sap/ui/comp/qunit/personalization/opaTests/Arrangement',
	'sap/ui/comp/qunit/personalization/opaTests/Action',
	'sap/ui/comp/qunit/personalization/opaTests/Assertion',
	'sap/m/library'
], function(
	Opa5,
	opaTest,
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
		Given.iStartMyAppInAFrame('test-resources/sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestP13nColumnsPanel/start.html');

		When.iLookAtTheScreen();

		Then.iShouldSeePersonalizationButton("sap.m.Button");

		When.iPressOnPersonalizationButton();

		Then.thePersonalizationDialogOpens();

		Then.iShouldSeeItemOnPosition("Name", 0);
		Then.iShouldSeeItemWithSelection("Name", true);
		Then.iShouldSeeMarkingOfItem("Name", true);

		Then.iShouldSeeItemOnPosition("Category", 1);
		Then.iShouldSeeItemWithSelection("Category", true);
		Then.iShouldSeeMarkingOfItem("Category", false);

		Then.iShouldSeeItemOnPosition("Currency Code", 2);
		Then.iShouldSeeItemWithSelection("Currency Code", false);
		Then.iShouldSeeMarkingOfItem("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 3);
		Then.iShouldSeeItemWithSelection("Date", false);
		Then.iShouldSeeMarkingOfItem("Date", false);

		Then.iShouldSeeItemOnPosition("Price", 4);
		Then.iShouldSeeItemWithSelection("Price", false);
		Then.iShouldSeeMarkingOfItem("Price", false);

		Then.iShouldSeeItemOnPosition("Product ID", 5);
		Then.iShouldSeeItemWithSelection("Product ID", false);
		Then.iShouldSeeMarkingOfItem("Product ID", false);

		Then.iShouldSeeItemOnPosition("Status", 6);
		Then.iShouldSeeItemWithSelection("Status", false);
		Then.iShouldSeeMarkingOfItem("Status", false);

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});

	opaTest("When I select the 'Product ID' column, this item should become marked", function(Given, When, Then) {
		When.iSelectColumn("Product ID");

		Then.iShouldSeeItemOnPosition("Name", 0);
		Then.iShouldSeeItemWithSelection("Name", true);
		Then.iShouldSeeMarkingOfItem("Name", false);

		Then.iShouldSeeItemOnPosition("Category", 1);
		Then.iShouldSeeItemWithSelection("Category", true);
		Then.iShouldSeeMarkingOfItem("Category", false);

		Then.iShouldSeeItemOnPosition("Currency Code", 2);
		Then.iShouldSeeItemWithSelection("Currency Code", false);
		Then.iShouldSeeMarkingOfItem("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 3);
		Then.iShouldSeeItemWithSelection("Date", false);
		Then.iShouldSeeMarkingOfItem("Date", false);

		Then.iShouldSeeItemOnPosition("Price", 4);
		Then.iShouldSeeItemWithSelection("Price", false);
		Then.iShouldSeeMarkingOfItem("Price", false);

		Then.iShouldSeeItemOnPosition("Product ID", 5);
		Then.iShouldSeeItemWithSelection("Product ID", true);
		Then.iShouldSeeMarkingOfItem("Product ID", true);

		Then.iShouldSeeItemOnPosition("Status", 6);
		Then.iShouldSeeItemWithSelection("Status", false);
		Then.iShouldSeeMarkingOfItem("Status", false);

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});

	opaTest("When I deselect the 'Category' column, this item should become marked", function(Given, When, Then) {
		When.iSelectColumn("Category");

		Then.iShouldSeeItemOnPosition("Name", 0);
		Then.iShouldSeeItemWithSelection("Name", true);
		Then.iShouldSeeMarkingOfItem("Name", false);

		Then.iShouldSeeItemOnPosition("Category", 1);
		Then.iShouldSeeItemWithSelection("Category", false);
		Then.iShouldSeeMarkingOfItem("Category", true);

		Then.iShouldSeeItemOnPosition("Currency Code", 2);
		Then.iShouldSeeItemWithSelection("Currency Code", false);
		Then.iShouldSeeMarkingOfItem("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 3);
		Then.iShouldSeeItemWithSelection("Date", false);
		Then.iShouldSeeMarkingOfItem("Date", false);

		Then.iShouldSeeItemOnPosition("Price", 4);
		Then.iShouldSeeItemWithSelection("Price", false);
		Then.iShouldSeeMarkingOfItem("Price", false);

		Then.iShouldSeeItemOnPosition("Product ID", 5);
		Then.iShouldSeeItemWithSelection("Product ID", true);
		Then.iShouldSeeMarkingOfItem("Product ID", false);

		Then.iShouldSeeItemOnPosition("Status", 6);
		Then.iShouldSeeItemWithSelection("Status", false);
		Then.iShouldSeeMarkingOfItem("Status", false);

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});

	opaTest("When I press 'Restore' button, 'Category' should remain marked", function(Given, When, Then) {
		When.iPressRestoreButton();

		Then.iShouldSeeItemOnPosition("Name", 0);
		Then.iShouldSeeItemWithSelection("Name", true);
		Then.iShouldSeeMarkingOfItem("Name", false);

		Then.iShouldSeeItemOnPosition("Category", 1);
		Then.iShouldSeeItemWithSelection("Category", true);
		Then.iShouldSeeMarkingOfItem("Category", true);

		Then.iShouldSeeItemOnPosition("Currency Code", 2);
		Then.iShouldSeeItemWithSelection("Currency Code", false);
		Then.iShouldSeeMarkingOfItem("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 3);
		Then.iShouldSeeItemWithSelection("Date", false);
		Then.iShouldSeeMarkingOfItem("Date", false);

		Then.iShouldSeeItemOnPosition("Price", 4);
		Then.iShouldSeeItemWithSelection("Price", false);
		Then.iShouldSeeMarkingOfItem("Price", false);

		Then.iShouldSeeItemOnPosition("Product ID", 5);
		Then.iShouldSeeItemWithSelection("Product ID", false);
		Then.iShouldSeeMarkingOfItem("Product ID", false);

		Then.iShouldSeeItemOnPosition("Status", 6);
		Then.iShouldSeeItemWithSelection("Status", false);
		Then.iShouldSeeMarkingOfItem("Status", false);

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});

	opaTest("When I press 'Ok' button, the dialog should close", function(Given, When, Then) {
		When.iPressOkButton();
		Then.thePersonalizationDialogShouldBeClosed();
		Then.iTeardownMyAppFrame();
	});

	// Test toolbar buttons

	opaTest("When I start the 'applicationUnderTestP13nColumnsPanel' again and press on personalization button, the personalization dialog opens", function(Given, When, Then) {
		Given.iStartMyAppInAFrame('test-resources/sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestP13nColumnsPanel/start.html');

		When.iLookAtTheScreen();

		Then.iShouldSeePersonalizationButton("sap.m.Button");

		When.iPressOnPersonalizationButton();

		Then.thePersonalizationDialogOpens();

		Then.iShouldSeeItemOnPosition("Name", 0);
		Then.iShouldSeeItemWithSelection("Name", true);
		Then.iShouldSeeMarkingOfItem("Name", true);

		Then.iShouldSeeItemOnPosition("Category", 1);
		Then.iShouldSeeItemWithSelection("Category", true);
		Then.iShouldSeeMarkingOfItem("Category", false);

		Then.iShouldSeeItemOnPosition("Currency Code", 2);
		Then.iShouldSeeItemWithSelection("Currency Code", false);
		Then.iShouldSeeMarkingOfItem("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 3);
		Then.iShouldSeeItemWithSelection("Date", false);
		Then.iShouldSeeMarkingOfItem("Date", false);

		Then.iShouldSeeItemOnPosition("Price", 4);
		Then.iShouldSeeItemWithSelection("Price", false);
		Then.iShouldSeeMarkingOfItem("Price", false);

		Then.iShouldSeeItemOnPosition("Product ID", 5);
		Then.iShouldSeeItemWithSelection("Product ID", false);
		Then.iShouldSeeMarkingOfItem("Product ID", false);

		Then.iShouldSeeItemOnPosition("Status", 6);
		Then.iShouldSeeItemWithSelection("Status", false);
		Then.iShouldSeeMarkingOfItem("Status", false);

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});
	opaTest("When I click on 'Move to Bottom' button, the marked 'Name' column is moved to bottom", function(Given, When, Then) {
		When.iPressOnMoveToBottomButton();

		Then.iShouldSeeItemOnPosition("Category", 0);
		Then.iShouldSeeItemWithSelection("Category", true);
		Then.iShouldSeeMarkingOfItem("Category", false);

		Then.iShouldSeeItemOnPosition("Currency Code", 1);
		Then.iShouldSeeItemWithSelection("Currency Code", false);
		Then.iShouldSeeMarkingOfItem("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 2);
		Then.iShouldSeeItemWithSelection("Date", false);
		Then.iShouldSeeMarkingOfItem("Date", false);

		Then.iShouldSeeItemOnPosition("Price", 3);
		Then.iShouldSeeItemWithSelection("Price", false);
		Then.iShouldSeeMarkingOfItem("Price", false);

		Then.iShouldSeeItemOnPosition("Product ID", 4);
		Then.iShouldSeeItemWithSelection("Product ID", false);
		Then.iShouldSeeMarkingOfItem("Product ID", false);

		Then.iShouldSeeItemOnPosition("Status", 5);
		Then.iShouldSeeItemWithSelection("Status", false);
		Then.iShouldSeeMarkingOfItem("Status", false);

		Then.iShouldSeeItemOnPosition("Name", 6);
		Then.iShouldSeeItemWithSelection("Name", true);
		Then.iShouldSeeMarkingOfItem("Name", true);

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});
	opaTest("When I click on 'Move to Top' button, the marked 'Name' column is moved to top", function(Given, When, Then) {
		When.iPressOnMoveToTopButton();

		Then.iShouldSeeItemOnPosition("Name", 0);
		Then.iShouldSeeItemWithSelection("Name", true);
		Then.iShouldSeeMarkingOfItem("Name", true);

		Then.iShouldSeeItemOnPosition("Category", 1);
		Then.iShouldSeeItemWithSelection("Category", true);
		Then.iShouldSeeMarkingOfItem("Category", false);

		Then.iShouldSeeItemOnPosition("Currency Code", 2);
		Then.iShouldSeeItemWithSelection("Currency Code", false);
		Then.iShouldSeeMarkingOfItem("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 3);
		Then.iShouldSeeItemWithSelection("Date", false);
		Then.iShouldSeeMarkingOfItem("Date", false);

		Then.iShouldSeeItemOnPosition("Price", 4);
		Then.iShouldSeeItemWithSelection("Price", false);
		Then.iShouldSeeMarkingOfItem("Price", false);

		Then.iShouldSeeItemOnPosition("Product ID", 5);
		Then.iShouldSeeItemWithSelection("Product ID", false);
		Then.iShouldSeeMarkingOfItem("Product ID", false);

		Then.iShouldSeeItemOnPosition("Status", 6);
		Then.iShouldSeeItemWithSelection("Status", false);
		Then.iShouldSeeMarkingOfItem("Status", false);

		// TODO: clearify this: Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});
	opaTest("When I press 'Ok' button, the dialog should close", function(Given, When, Then) {
		When.iPressOkButton();

		Then.thePersonalizationDialogShouldBeClosed();
		Then.iTeardownMyAppFrame();
	});
});
