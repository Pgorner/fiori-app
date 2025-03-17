/*global opaTest QUnit */
//LinkListCard Journey
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit", //Don't move this item up or down, this will break everything!
	"test-resources/sap/ovp/integrations/pages/CommonArrangements",
	"test-resources/sap/ovp/integrations/pages/CommonActions",
	"test-resources/sap/ovp/integrations/pages/CommonAssertions",
], function (
	Opa5,
	opaTest,
	CommonArrangements,
	CommonActions,
	CommonAssertions
) {
	"use strict";

	Opa5.extendConfig({
		arrangements: new CommonArrangements(),
		actions: new CommonActions(),
		assertions: new CommonAssertions(),
		autoWait: true,
		viewNamespace: "view.",
	});

	opaTest("TC01 : Open app", function (Given, When, Then) {
		Given.iStartMyApp("browse-books");
		Then.checkAppTitle("Browse Books (V4)");
		When.iClickTheEnterKey("application-browse-books-component---mainView--ovpGlobalMacroFilter::FilterField::title");
	});

	/* ToDo : Find Root Cause for V2 cards not rendered in Jenkins - TaskTacker Issue 236 */
	// opaTest("TC02 : Number of LinkList Cards", function (Given, When, Then) {
    // Then.iCheckForNumberOFCards("LinkList",4,"sap.m.List");
	// Then.iCheckForNumberOFCards("Carousel LinkList",2,"sap.m.Carousel");
	// });

	opaTest("TC03 : LinkList Card Header Title", function (Given, When, Then) {
		Then.iCheckCardText("Standard dynamic link list card","--ovpHeaderTitle","Title");
	});

	opaTest("TC04 : LinkList Card Header Navigation for V4 Card Standard dynamic link list card", function (Given, When, Then) {
		When.iClickTheCardHeader("application-browse-books-component---card_12_v4Original--ovpCardHeader", false);
		Then.checkAppTitle("Procurement Overview Page");
		When.iClickBackButton();
		Then.checkAppTitle("Browse Books (V4)");
		Given.iTeardownMyApp();
	});

	opaTest("TC05 : Open app", function (Given, When, Then) {
		Given.iStartMyApp("browse-books");
		Then.checkAppTitle("Browse Books (V4)");
		When.iClickTheEnterKey("application-browse-books-component---mainView--ovpGlobalMacroFilter::FilterField::title");
	});

	opaTest("TC06 : LinkList Card List Item Contact Information for V4 Card Standard dynamic link list card", function (Given, When, Then) {
		When.iClickTheCardItem("linkListTitleLabel-application-browse-books-component---card_12_v4Original--ovpLinkList-2", 2, "Standard dynamic link list card", "sap.m.Link");
		Then.iCheckControlExists("application-browse-books-component---card_12_v4Original--ovpLinkList-2-quickView-popover","sap.m.Popover");
	});

	opaTest("TC07 : LinkList Card Icon Navigation and passing filter params on forward navigation", function (Given, When, Then) {
		When.iClickTheButtonWithId("application-browse-books-component---mainView--ovpMainPageTitle-expandBtn");
    	When.iClickTheEnterKey("application-browse-books-component---mainView--ovpGlobalMacroFilter::FilterField::ID","252");
		When.iClickTheEnterKey("application-browse-books-component---mainView--ovpGlobalMacroFilter::FilterField::title");
		When.iClickTheCardItem("linkListIcon-application-browse-books-component---card_12_v4Original--ovpLinkList-0", 0, "Standard dynamic link list card","sap.ui.core.Icon");
		Then.checkAppTitle("Procurement Overview Page");
		Then.iCheckIfFilterFieldIsPopulated("application-procurement-overview-component---mainView--ovpGlobalFilter-filterItemControlA_-ID", '=252');
		When.iClickBackButton();
		Given.iTeardownMyApp();
    });

	opaTest("TC08 : Open app", function (Given, When, Then) {
		Given.iStartMyApp("browse-books");
		Then.checkAppTitle("Browse Books (V4)");
		When.iClickTheEnterKey("application-browse-books-component---mainView--ovpGlobalMacroFilter::FilterField::title");
	});

	opaTest("TC09 : Visibilty of record with valid and invaild semantic object", function (Given, When, Then) {
		Then.iCheckLabelText("Jaden Lee","card_16_v4Original--linkListTitleLabel--linkListItem--1","Text");
		Then.iCheckTextNotPresent("Jim Smith","card_16_v4Original--linkListTitleLabel--linkListItem");
	});

	opaTest("TC10 : LinkList Card LineItem Navigation for V4 Card Static link list card", function (Given, When, Then) {
		When.iClickTheCardItem("application-browse-books-component---card_16_v4Original--linkListTitleLabel--linkListItem--1", 1, "Static link list card", "sap.m.Label");
		Then.checkAppTitle("Sales Overview Page");
		Given.iTeardownMyApp();
	});

	opaTest("TC11 : Open app", function (Given, When, Then) {
		Given.iStartMyApp("browse-books");
		Then.checkAppTitle("Browse Books (V4)");
		When.iClickTheEnterKey("application-browse-books-component---mainView--ovpGlobalMacroFilter::FilterField::title");
	});

	opaTest("TC12 : LinkList Card Header Navigation for V4 Card Static link list card", function (Given, When, Then) {
		When.iClickTheCardHeader("application-browse-books-component---card_13_v4Original--ovpCardHeader", false);
		Given.iTeardownMyApp();
	});

});


