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
	'use strict';

	ApplicationUnderTestUtil.windowBlanket();
	ApplicationUnderTestUtil.extendConfig();

	QUnit.module("SelectionPanelRestore");

	opaTest("When I look at the screen, a table with SmartLinks should appear", function(Given, When, Then) {
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

	opaTest("When I click on 'Gladiator MX' link in the 'Name' column, popover should open", function(Given, When, Then) {
		When.onTheSmartLink.iPressTheLink({text: "Gladiator MX"});

		Then.onTheSmartLink.iShouldSeeAPopover({text: "Gladiator MX"});
		Then.onTheSmartLink.iShouldSeeAPopover({text: "Gladiator MX"});
		Then.onTheSmartLink.iShouldSeeLinksOnPopover({text: "Gladiator MX"}, [
			"Name Link2"
		]);
		Then.onThePersonalizationPage.iShouldSeeTheMoreLinksButton();
	});

	opaTest("When I click on link personalization button, selection dialog should open", function(Given, When, Then) {
		When.onThePersonalizationPage.iPressOnMoreLinksButton();
		Then.onThePersonalizationPage.iShouldSeeTheDefineLinksDialog();
	});

	opaTest("When I set all links as invisible, the links on popover should not be shown", function(Given, When, Then) {
		When.onThePersonalizationPage.iClickOnTheCheckboxSelectAll(); // select all
		When.onThePersonalizationPage.iClickOnTheCheckboxSelectAll(); // deselect all
		When.onThePersonalizationPage.iPressOkButton();

		Then.thePersonalizationDialogShouldBeClosed(); // wait until the P13nDialog with P13nSelectionPanel has been closed
		Then.onTheSmartLink.iShouldSeeAPopover({text: "Gladiator MX"});
		Then.onTheSmartLink.iShouldSeeLinksOnPopover({text: "Gladiator MX"}, []);
		Then.onThePersonalizationPage.iShouldSeeTheMoreLinksButton();

		When.onTheSmartLink.iCloseThePopover();
	});

	opaTest("When I click on 'Flat Medium' link in the 'Name' column, popover should open", function(Given, When, Then) {
		When.onTheSmartLink.iPressTheLink({text: "Flat Medium"});

		Then.onTheSmartLink.iShouldSeeAPopover({text: "Flat Medium"});
		Then.onTheSmartLink.iShouldSeeLinksOnPopover({text: "Flat Medium"}, []);
		Then.onThePersonalizationPage.iShouldSeeTheMoreLinksButton();
	});

	opaTest("When I click on 'Restore' and then on 'OK', popover should show previous link selection again", function(Given, When, Then) {
		When.onTheSmartLink.iResetThePersonalization({text: "Flat Medium"});

		Then.thePersonalizationDialogShouldBeClosed(); // wait until the P13nDialog with P13nSelectionPanel has been closed
		Then.onTheSmartLink.iShouldSeeAPopover({text: "Flat Medium"});
		Then.onTheSmartLink.iShouldSeeLinksOnPopover({text: "Flat Medium"}, [
			"Name Link2"
		]);
		Then.onThePersonalizationPage.iShouldSeeTheMoreLinksButton();

		When.onTheSmartLink.iCloseThePopover();
	});

	// ---------------------------------------------------------------------------------------------------------

	opaTest("When I click on 'Keyboard' link in the 'Category' column, popover should open with 1 superior link", function(Given, When, Then) {
		When.onTheSmartLink.iPressTheLink({text: "Keyboard", objectIdentifier: true});

		Then.onTheSmartLink.iShouldSeeAPopover({text: "Keyboard", objectIdentifier: true});
		Then.onTheSmartLink.iShouldSeeLinksOnPopover({text: "Keyboard", objectIdentifier: true}, [
			"Category Link2"
		]);
		Then.onThePersonalizationPage.iShouldSeeTheMoreLinksButton();

		When.onTheSmartLink.iCloseThePopover();
		Then.iTeardownMyUIComponent();
	});

});
