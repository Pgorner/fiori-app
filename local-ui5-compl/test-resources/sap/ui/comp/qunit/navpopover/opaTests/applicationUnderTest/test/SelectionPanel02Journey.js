/* globals QUnit */

sap.ui.define([
	"sap/ui/test/opaQunit",
	"applicationUnderTest/test/Util",
	"applicationUnderTest/test/pages/Personalization",
	"test-resources/sap/ui/comp/testutils/opa/TestLibrary",
	"test-resources/sap/ui/mdc/testutils/opa/TestLibrary"
], function(
	opaTest,
	ApplicationUnderTestUtil
) {
	"use strict";

	ApplicationUnderTestUtil.windowBlanket();
	ApplicationUnderTestUtil.extendConfig();

	// ----------------------------------------------
	// Test scenario:
	//  t   Key-User   End-User   Result
	// ----------------------------------------------
	//  0                         L2 (superior link)
	// ----------------------------------------------
	//  1               L3 on     L2 (superior link)
	// 							  L3
	// ----------------------------------------------
	//  2               L3 off    L2
	// ----------------------------------------------
	//  3   L2 off,
	//      L3 on                 ----
	// ----------------------------------------------
	//  4               L4 on     L4
	// ----------------------------------------------
	//  5              Restore,
	//                  L4 on     L3
	//                            L4
	// ----------------------------------------------

	QUnit.module("SelectionPanel02", {
		before: function() {
			this.mItems = ApplicationUnderTestUtil.getInitialState();
		}
	});

	opaTest("When I start the app again, a table with SmartLinks should appear", function(Given, When, Then) {
		Given.iStartMyUIComponentInViewMode("applicationUnderTest");
		Given.iClearTheLocalStorageFromRtaRestart();

		Then.iShouldSeeStartRtaButton();
		Then.iShouldSeeVisibleColumnsInOrder("sap.m.Column", [
			"Name", "Product ID", "Category"
		]);
		Then.onThePersonalizationPage.iShouldSeeTheColumnInATable("Name");
		Then.onThePersonalizationPage.iShouldSeeTheColumnInATable("Product ID");
		Then.onThePersonalizationPage.iShouldSeeTheColumnInATable("Category");
	});

	opaTest("When I click on 'Projector' link in the 'Category' column, popover should open with one link", function(Given, When, Then) {
		When.onTheSmartLink.iPressTheLink({text: "Projector", objectIdentifier: true});

		Then.onTheSmartLink.iShouldSeeAPopover({text: "Projector", objectIdentifier: true});
		Then.onTheSmartLink.iShouldSeeLinksOnPopover({text: "Projector", objectIdentifier: true}, [
			"Category Link2"
		]);
		Then.onThePersonalizationPage.iShouldSeeTheMoreLinksButton();
	});

	opaTest("When I click on 'More Links' button, the selection dialog opens", function(Given, When, Then) {
		When.onThePersonalizationPage.iPressOnMoreLinksButton();

		Then.onThePersonalizationPage.iShouldSeeTheDefineLinksDialog();

		ApplicationUnderTestUtil.checkLinks(Then, this.mItems);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
		When.onThePersonalizationPage.iPressOkButton();
	});

	opaTest("When I select the 'Category Link3' item, the 'Restore' button should be enabled", function(Given, When, Then) {
		When.onTheSmartLink.iPersonalizeTheLinks({text: "Projector", objectIdentifier: true}, [
			"Category Link2", "Category Link3"
		]);

		this.mItems["Category Link3"].selected = true;

		When.onThePersonalizationPage.iPressOnMoreLinksButton();
		ApplicationUnderTestUtil.checkLinks(Then, this.mItems);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});

	opaTest("When I press 'Ok' button, the dialog should close", function(Given, When, Then) {
		When.onThePersonalizationPage.iPressOkButton();

		Then.thePersonalizationDialogShouldBeClosed();
		Then.onTheSmartLink.iShouldSeeLinksOnPopover({text: "Projector", objectIdentifier: true}, [
			"Category Link2", "Category Link3"
		]);
	});

	opaTest("When I click on 'More Links' button again, the selection dialog opens", function(Given, When, Then) {
		When.onThePersonalizationPage.iPressOnMoreLinksButton();

		Then.onThePersonalizationPage.iShouldSeeTheDefineLinksDialog();

		ApplicationUnderTestUtil.checkLinks(Then, this.mItems);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
		When.onThePersonalizationPage.iPressOkButton();
	});

	opaTest("When I deselect the 'Category Link3' item, the 'Restore' button should be enabled", function(Given, When, Then) {
		When.onTheSmartLink.iPersonalizeTheLinks({text: "Projector", objectIdentifier: true}, [
			"Category Link2"
		]);

		this.mItems["Category Link3"].selected = false;

		When.onThePersonalizationPage.iPressOnMoreLinksButton();
		ApplicationUnderTestUtil.checkLinks(Then, this.mItems);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});

	opaTest("When I press 'Ok' button, the dialog should close", function(Given, When, Then) {
		When.onThePersonalizationPage.iPressOkButton();

		Then.thePersonalizationDialogShouldBeClosed();
		Then.onTheSmartLink.iShouldSeeLinksOnPopover({text: "Projector", objectIdentifier: true}, [
			"Category Link2"
		]);

		When.onTheSmartLink.iCloseThePopover();

		Then.iTeardownMyUIComponent();
	});
});
