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

	var sCardAdditionalActionsButtonId = "application-procurement-overview-component---card024_InsightsOriginal--sapOvpCardAdditionalActions";
	var sCardAdditionalActionsButtonId1 = "application-procurement-overview-component---card006Original--sapOvpCardAdditionalActions";
	var sAddCardToInsightsButtonId = "application-procurement-overview-component---card006Original--ovpAddToInsightButton-unifiedmenu";
	var sViewDetailsUrlId = "__link4";
	var sExpectedErrorMessage = "The selected card cannot be added to the Insights Cards section of the My Home entry page.";
    var sExpectedErrorMessageDetails = "Navigation on this card is not configured. Reach out to your administrator for further assistance.";

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
				Then.iVerifyAdditionalActionsCountOnCard(2);
			});
			opaTest("#3 Click on Add to repository from addition actions menu and validate the card manifest", function (Given, When, Then) {
				When.iClickTheButtonWithId(sCardAdditionalActionsButtonId);
				When.iClickOnMenuItemWithId("application-procurement-overview-component---card024_InsightsOriginal--ovpAddToInsightButton-unifiedmenu");
				Then.iVerifyTheDialogTitleText("Add Card to Repository");
                Then.iValidateTheIntegrationCardManifest("card024_Insights", "DT");
				When.iCloseTheDialogPopover();
			});

			opaTest("#4 Click on Add to repository from addition actions menu and validate if error dialog is displayed with correct error messages", function (Given, When, Then) {
				When.iClickTheButtonWithId(sCardAdditionalActionsButtonId1);
				When.iClickOnMenuItemWithId(sAddCardToInsightsButtonId);
				When.iClickOnMenuItemWithId(sViewDetailsUrlId);
                Then.iValidateMessagesInErrorDialog(sExpectedErrorMessage, sExpectedErrorMessageDetails);
				When.iCloseTheDialogPopover();
				Given.iTeardownMyApp();
			});
			
			return Journey;
		}
	};
	Journey.start().testAndEnd();
});
