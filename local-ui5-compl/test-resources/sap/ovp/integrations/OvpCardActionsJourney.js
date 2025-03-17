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
	var sCustomProductListAdditionButtonId = "application-procurement-overview-component---card_023Original--sapOvpCardAdditionalActions";
	var sAdditionButtonIdInsightCard = "application-procurement-overview-component---card024_InsightsOriginal--sapOvpCardAdditionalActions";
	var sAdditionButtonIdProductsTableCustom = "application-procurement-overview-component---card_022Original--sapOvpCardAdditionalActions";

	var Journey = {
		start: function () {
			QUnit.module("Journey - OVP - Card Actions Journey for Card");
			opaTest("#0: Start", function (Given, When, Then) {
				Given.iStartMyApp("procurement-overview");
				Then.checkAppTitle("Procurement Overview Page");
			});
			return Journey;
		},

		testAndEnd: function () {
            opaTest("#1 Check if all cards have the additional actions button on header", function (Given, When, Then) {
				Then.iCheckForAdditionalActionsButtonForAllCards();
			});
			opaTest("#2 Verify the count of additional actions on custom card, insight card and standard card.", function (Given, When, Then) {
				When.iClickTheButtonWithId(sCustomProductListAdditionButtonId);
				Then.iVerifyAdditionalActionsCountOnCard(1);
				Then.iVerifyAdditionalActionsName("Manage Cards");
				When.iClickTheButtonWithId(sAdditionButtonIdInsightCard);
				Then.iVerifyAdditionalActionsCountOnCard(1);
				Then.iVerifyAdditionalActionsName("Manage Cards");
				When.iClickTheButtonWithId(sAdditionButtonIdProductsTableCustom);
				Then.iVerifyAdditionalActionsCountOnCard(2);
				Then.iVerifyAdditionalActionsName("Manage Cards");
				Then.iVerifyAdditionalActionsName("Refresh");
				When.iClickTheButtonWithId(sCardAdditionalActionsButtonId);
				Then.iVerifyAdditionalActionsCountOnCard(2);
			});
			opaTest("#3 Click on manage cards from addition actions menu", function (Given, When, Then) {
				When.iClickOnMenuItemWithId("application-procurement-overview-component---card002Original--ovpManageCardsButton-unifiedmenu");
				Then.iVerifyTheDialogTitleText("Manage Cards");
				When.iCloseTheDialogPopover();
			});
			opaTest("#4 Click on refresh from addition actions menu", function (Given, When, Then) {
				When.iClickTheButtonWithId(sCardAdditionalActionsButtonId);
				When.iClickOnMenuItemWithId("application-procurement-overview-component---card002Original--ovpRefreshCardButton-unifiedmenu");
				Given.iTeardownMyApp();
			});
			return Journey;
		}
	};
	Journey.start().testAndEnd();
});
