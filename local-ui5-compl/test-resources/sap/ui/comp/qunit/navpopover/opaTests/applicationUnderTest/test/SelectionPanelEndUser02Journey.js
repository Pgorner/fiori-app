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

	QUnit.module("SelectionPanelEndUser", {
		before: function() {
			this.mItems = ApplicationUnderTestUtil.getInitialState();
		}
	});

	opaTest("When start the '/navpopover/applicationUnderTest' application, some columns should be shown", function (Given, When, Then) {
		Given.iStartMyUIComponentInViewMode("applicationUnderTest");
		Given.iClearTheLocalStorageFromRtaRestart();

		Then.iShouldSeeStartRtaButton();
		Then.iShouldSeeVisibleColumnsInOrder("sap.m.Column", ["Name", "Product ID", "Category"]);
		Then.onThePersonalizationPage.iShouldSeeTheColumnInATable("Name");
		Then.onThePersonalizationPage.iShouldSeeTheColumnInATable("Product ID");
		Then.onThePersonalizationPage.iShouldSeeTheColumnInATable("Category");
	});

	// ------------------------------------------------------
	// Test: deselect one, select another item and restore
	// ------------------------------------------------------

	opaTest("When I deselect the 'Category Link2' item and select 'Category Link4', the 'Restore' button should be enabled", function (Given, When, Then) {
		When.onTheSmartLink.iPressTheLink({text: "Projector", objectIdentifier: true});

		Then.onTheSmartLink.iShouldSeeAPopover({text: "Projector", objectIdentifier: true});
		Then.onTheSmartLink.iShouldSeeLinksOnPopover({text: "Projector", objectIdentifier: true}, [
			"Category Link2"
		]);
		Then.onThePersonalizationPage.iShouldSeeTheMoreLinksButton();

		When.onTheSmartLink.iPersonalizeTheLinks({text: "Projector", objectIdentifier: true}, [
			"Category Link4"
		]);

		this.mItems["Category Link2"].selected = false;
		this.mItems["Category Link2"].position = 1;

		this.mItems["Category Link3"].position = 2;

		this.mItems["Category Link4"].selected = true;
		this.mItems["Category Link4"].position = 0;

		When.onThePersonalizationPage.iPressOnMoreLinksButton();
		Then.onThePersonalizationPage.iShouldSeeTheDefineLinksDialog();

		ApplicationUnderTestUtil.checkLinks(Then, this.mItems);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
		When.onThePersonalizationPage.iPressOkButton();

		// Hurricane GX is in column "Name" but has the semantic object of the column "Category" due to path annotation
		When.onTheSmartLink.iCloseThePopover();
		When.onTheSmartLink.iPressTheLink({text: "Hurricane GX"});
		Then.onTheSmartLink.iShouldSeeAPopover({text: "Hurricane GX"});
		Then.onTheSmartLink.iShouldSeeLinksOnPopover({text: "Hurricane GX"}, []);
		When.onTheSmartLink.iCloseThePopover();
	});

	opaTest("When I press 'Restore' button, the 'Restore' button should be disabled and the initial selection should reappear", function (Given, When, Then) {
		When.onTheSmartLink.iResetThePersonalization({text: "Projector", objectIdentifier: true});

		this.mItems["Category Link2"].selected = true;
		this.mItems["Category Link2"].position = 0;

		this.mItems["Category Link3"].position = 1;

		this.mItems["Category Link4"].selected = false;
		this.mItems["Category Link4"].position = 2;

		When.onThePersonalizationPage.iPressOnMoreLinksButton();

		ApplicationUnderTestUtil.checkLinks(Then, this.mItems);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
		When.onThePersonalizationPage.iPressOkButton();
	});

	opaTest("When I deselect the 'Category Link2' item and select 'Category Link4', the 'Restore' button should be enabled", function (Given, When, Then) {
		When.onTheSmartLink.iPersonalizeTheLinks({text: "Projector", objectIdentifier: true}, [
			"Category Link3", "Category Link4"
		]);

		this.mItems["Category Link2"].selected = false;
		this.mItems["Category Link2"].position = 2;

		this.mItems["Category Link3"].selected = true;
		this.mItems["Category Link3"].position = 0;

		this.mItems["Category Link4"].selected = true;
		this.mItems["Category Link4"].position = 1;

		When.onThePersonalizationPage.iPressOnMoreLinksButton();
		ApplicationUnderTestUtil.checkLinks(Then, this.mItems);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});

	opaTest("When I press 'Ok' button, the dialog should close", function (Given, When, Then) {
		When.onThePersonalizationPage.iPressOkButton();

		Then.thePersonalizationDialogShouldBeClosed();
		Then.onTheSmartLink.iShouldSeeLinksOnPopover({text: "Projector", objectIdentifier: true}, [
			"Category Link3", "Category Link4"
		]);
	});

	opaTest("When I click on 'More Links' button again, the selection dialog opens", function (Given, When, Then) {
		When.onThePersonalizationPage.iPressOnMoreLinksButton();

		Then.onThePersonalizationPage.iShouldSeeTheDefineLinksDialog();

		ApplicationUnderTestUtil.checkLinks(Then, this.mItems);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});

	opaTest("When I press 'Restore' button, the 'Restore' button should be disabled and the initial selection should reappear", function (Given, When, Then) {
		When.onThePersonalizationPage.iPressOkButton();
		When.onTheSmartLink.iResetThePersonalization({text: "Projector", objectIdentifier: true});

		this.mItems["Category Link2"].selected = true;
		this.mItems["Category Link2"].position = 0;

		this.mItems["Category Link3"].selected = false;
		this.mItems["Category Link3"].position = 1;

		this.mItems["Category Link4"].selected = false;
		this.mItems["Category Link4"].position = 2;

		When.onThePersonalizationPage.iPressOnMoreLinksButton();
		Then.onThePersonalizationPage.iShouldSeeTheDefineLinksDialog();
		ApplicationUnderTestUtil.checkLinks(Then, this.mItems);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});

	opaTest("When I press 'Ok' button, the dialog should close", function (Given, When, Then) {
		When.onThePersonalizationPage.iPressOkButton();

		Then.thePersonalizationDialogShouldBeClosed();
		Then.onTheSmartLink.iShouldSeeLinksOnPopover({text: "Projector", objectIdentifier: true}, [
			"Category Link2"
		]);
		Then.iTeardownMyUIComponent();
	});
});
