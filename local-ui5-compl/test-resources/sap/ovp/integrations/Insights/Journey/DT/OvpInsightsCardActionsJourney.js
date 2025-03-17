/* global QUnit */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
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

	var sCardAdditionalActionsButtonId = "application-procurement-overview-component---card002Original--sapOvpCardAdditionalActions";
	var Journey = {
		start: function () {
			QUnit.module("Journey - OVP Insights Card");
			opaTest("#0: Start", function (Given, When, Then) {
				Given.iStartInsightsEnabledApp("DT");
				Then.checkAppTitle("Procurement Overview Page");
			});
			return Journey;
		},

		testAndEnd: function () {
            opaTest("#1 Check if all cards have the additional actions button on header", function (Given, When, Then) {
				Then.iCheckForAdditionalActionsButtonForAllCards();
			});
			opaTest("#2 Verify the count of additional actions on Reorder Soon card.", function (Given, When, Then) {
				When.iClickTheButtonWithId(sCardAdditionalActionsButtonId);
				Then.iVerifyAdditionalActionsCountOnCard(3);
			});
			opaTest("#3 Click on manage cards from addition actions menu", function (Given, When, Then) {
				When.iClickOnMenuItemWithId("application-procurement-overview-component---card002Original--ovpManageCardsButton-unifiedmenu");
				Then.iVerifyTheDialogTitleText("Manage Cards");
				When.iCloseTheDialogPopover();
			});

			opaTest("#4 Click on Add to repository from addition actions menu", function (Given, When, Then) {
				When.iClickTheButtonWithId(sCardAdditionalActionsButtonId);
				When.iClickOnMenuItemWithId("application-procurement-overview-component---card002Original--ovpAddToInsightButton-unifiedmenu");
				Then.iVerifyTheDialogTitleText("Add Card to Repository");
				When.iCloseTheDialogPopover();
			});
			opaTest("#5 Click on refresh from addition actions menu", function (Given, When, Then) {
				When.iClickTheButtonWithId(sCardAdditionalActionsButtonId);
				When.iClickOnMenuItemWithId("application-procurement-overview-component---card002Original--ovpRefreshCardButton-unifiedmenu");
				Given.iTeardownMyApp();
			});
			return Journey;
		}
	};
	Journey.start().testAndEnd();
});
