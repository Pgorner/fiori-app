/* globals QUnit */

sap.ui.define([
	"sap/ui/test/opaQunit",
	"applicationUnderTest/test/Util",
	"applicationUnderTest/test/pages/Personalization",
	"sap/ui/rta/test/integration/pages/Adaptation",
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
	//  2               L3 off    L2 (superior link)
	// ----------------------------------------------
	//  3    L2 off,
	//       L3 on                 ----
	// ----------------------------------------------
	//  4               L4 on     L4
	// ----------------------------------------------
	//  5              Restore    L3
	// ----------------------------------------------

	QUnit.module("SelectionPanel01", {
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

	opaTest("When I deselect the 'Category Link3' item, the 'Restore' button should be disabled", function(Given, When, Then) {
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
	/* Not able to do those tests as RTA requires a reload of the app when there are other changes aswell..
	opaTest("When I start key user adaptation, the Key User Adaptation mode should open", function(Given, When, Then) {
		When.iPressOnStartRtaButton().and.iWaitUntilTheBusyIndicatorIsGone("applicationUnderTest---IDView--myApp");
		Then.onPageWithRTA.iShouldSeeTheToolbar().and.iShouldSeeTheOverlayForTheApp("applicationUnderTest---IDView--myApp", undefined);
	});
	opaTest("When I right click on 'Projector' link in the 'Category' column, a context menu should open", function(Given, When, Then) {
		When.onThePersonalizationPage.iRightClickOnLinkInElementOverlay("Projector");
		Then.onPageWithRTA.iShouldSeetheContextMenu();
	});
	opaTest("When I click on 'Settings' in the context menu, selection dialog should open", function(Given, When, Then) {
		When.onPageWithRTA.iClickOnAContextMenuEntryWithText("CTX_SETTINGS");

		Then.onThePersonalizationPage.iShouldSeeTheDefineLinksDialog();

		ApplicationUnderTestUtil.checkLinks(Then, this.mItems);
	});
	opaTest("When I deselect the 'Category Link2' and select the 'Category Link3' item, the selection should be changed", function(Given, When, Then) {
		When.onThePersonalizationPage.iSelectALinkOnP13nDialog("Category Link2");
		When.onThePersonalizationPage.iSelectALinkOnP13nDialog("Category Link3");

		this.mItems["Category Link2"].selected = false;
		this.mItems["Category Link3"].selected = true;

		ApplicationUnderTestUtil.checkLinks(Then, this.mItems);
	});
	opaTest("When I press 'OK' and then 'Save & Exit' button, the key user adaptation mode should finish", function(Given, When, Then) {
		When.onThePersonalizationPage.iPressOkButton();
		When.onPageWithRTA.iExitRtaMode();
		Then.thePersonalizationDialogShouldBeClosed();

		Then.iTeardownMyUIComponent();
	});

	opaTest("When I click on 'Projector' link in the 'Category' column, popover should open with no links", function(Given, When, Then) {
		Given.iStartMyUIComponentInViewMode("applicationUnderTest");
		When.onTheSmartLink.iPressTheLink({text: "Projector", objectIdentifier: true});

		Then.onTheSmartLink.iShouldSeeAPopover({text: "Projector", objectIdentifier: true});
		Then.onTheSmartLink.iShouldSeeLinksOnPopover({text: "Projector", objectIdentifier: true}, []);
		Then.onThePersonalizationPage.iShouldSeeTheMoreLinksButton();
	});
	opaTest("When I select the 'Category Link4' item, the 'Restore' button should be enabled", function(Given, When, Then) {
		When.onTheSmartLink.iPersonalizeTheLinks({text: "Projector", objectIdentifier: true}, [
			"Category Link4"
		]);

		this.mItems["Category Link4"].selected = true;

		When.onThePersonalizationPage.iPressOnMoreLinksButton();
		ApplicationUnderTestUtil.checkLinks(Then, this.mItems);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});
	opaTest("When I press 'Restore' button, the 'Restore' button should be disabled and the key-user selection should reappear", function(Given, When, Then) {
		When.onTheSmartLink.iResetThePersonalization({text: "Projector", objectIdentifier: true});

		this.mItems["Category Link3"].selected = true;
		this.mItems["Category Link4"].selected = false;

		When.onThePersonalizationPage.iPressOnMoreLinksButton();

		ApplicationUnderTestUtil.checkLinks(Then, this.mItems);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});
	opaTest("When I press 'Ok' button, the dialog should close", function(Given, When, Then) {
		When.onThePersonalizationPage.iPressOkButton();

		Then.thePersonalizationDialogShouldBeClosed();
		Then.onThePersonalizationPage.iShouldSeeOrderedLinksOnNavigationContainer([
			"Category Link3"
		]);

		Then.iTeardownMyUIComponent();
	});
	*/
});
