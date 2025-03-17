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
	// Test: deselect and select a item
	// ------------------------------------------------------

	opaTest("When I click on 'More Links' button again, the selection dialog opens", function (Given, When, Then) {
		When.onTheSmartLink.iPressTheLink({text: "Projector", objectIdentifier: true});

		Then.onTheSmartLink.iShouldSeeAPopover({text: "Projector", objectIdentifier: true});
		Then.onTheSmartLink.iShouldSeeLinksOnPopover({text: "Projector", objectIdentifier: true}, [
			"Category Link2"
		]);
		When.onThePersonalizationPage.iPressOnMoreLinksButton();

		Then.onThePersonalizationPage.iShouldSeeTheDefineLinksDialog();

		ApplicationUnderTestUtil.checkLinks(Then, this.mItems);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});

	opaTest("When I deselect the 'Category Link2' item, the 'Restore' button should be enabled", function (Given, When, Then) {
		When.onThePersonalizationPage.iPressOkButton();
		When.onTheSmartLink.iPersonalizeTheLinks({text: "Projector", objectIdentifier: true}, []);

		this.mItems["Category Link2"].selected = false;

		When.onThePersonalizationPage.iPressOnMoreLinksButton();
		ApplicationUnderTestUtil.checkLinks(Then, this.mItems);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});

	opaTest("When I select the 'Category Link2' link again, the 'Restore' button should be disabled", function (Given, When, Then) {
		When.onThePersonalizationPage.iPressOkButton();
		When.onTheSmartLink.iPersonalizeTheLinks({text: "Projector", objectIdentifier: true}, [
			"Category Link2"
		]);

		this.mItems["Category Link2"].selected = true;

		When.onThePersonalizationPage.iPressOnMoreLinksButton();
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
