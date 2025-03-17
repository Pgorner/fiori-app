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

	var sCardAdditionalActionsButtonId = "application-procurement-overview-component---card005Original--sapOvpCardAdditionalActions"
	opaTest("Open app", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyApp("procurement-overview");
		Then.checkAppTitle("Procurement Overview Page");
	});

	opaTest("Click on search", function (Given, When, Then) {
		When.iEnterValueInField('EUR',"application-procurement-overview-component---mainView--ovpGlobalFilter-filterItemControlA_-_Parameter.P_DisplayCurrency");
        When.iClickTheGoButton("application-procurement-overview-component---mainView--ovpGlobalFilter-btnGo");
	});

	opaTest("Number of LinkList Cards", function (Given, When, Then) {
        Then.iCheckForNumberOFCards("LinkList",3,"sap.m.List");
		Then.iCheckForNumberOFCards("Carousel LinkList",2,"sap.m.Carousel");
	});

	opaTest("LinkList Card Header Title", function (Given, When, Then) {
		Then.iCheckCardText("Recent Contacts","--ovpHeaderTitle","Title");
	});

	opaTest("LinkList Card Header SubTitle", function (Given, When, Then) {
        Then.iCheckCardText("Members displayed by role","--SubTitle-Text","SubTitle");
	});

	opaTest("Static LinkList Card additional action menu", function (Given, When, Then) {
		When.iClickTheButtonWithId(sCardAdditionalActionsButtonId);
		Then.iVerifyAdditionalActionsCountOnCard(1);
		Then.iVerifyAdditionalActionsName("Manage Cards");
		Given.iTeardownMyApp();
	});
});
