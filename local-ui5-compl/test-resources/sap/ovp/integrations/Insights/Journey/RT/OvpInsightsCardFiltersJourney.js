/* global QUnit */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"test-resources/sap/ovp/integrations/pages/CommonArrangements",
	"test-resources/sap/ovp/integrations/pages/CommonActions",
	"test-resources/sap/ovp/integrations/pages/CommonAssertions",
	"test-resources/sap/ovp/integrations/Insights/Helper/CardManifest"
], function (
	Opa5,
	opaTest,
	CommonArrangements,
	CommonActions,
	CommonAssertions,
	IntegrationCardManifestHelper
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

	var Journey = {
		start: function () {
			QUnit.module("Journey - OVP Insights Card");
			opaTest("#0: Start", function (Given, When, Then) {
				Given.iStartInsightsEnabledApp("RT");
				Then.checkAppTitle("Procurement Overview Page");
			});
			return Journey;
		},

		testAndEnd: function () {
            opaTest("#1 Check if all cards have the additional actions button on header", function (Given, When, Then) {
				Then.iCheckForAdditionalActionsButtonForAllCards();
			});
			opaTest("#2 Verify the count of additional actions on card.", function (Given, When, Then) {
				When.iClickTheButtonWithId(sCardAdditionalActionsButtonId);
				Then.iVerifyAdditionalActionsCountOnCard(3);
			});
			opaTest("#3 Click on Add to repository from addition actions menu and validate the card manifest", function (Given, When, Then) {
				When.iClickTheButtonWithId(sCardAdditionalActionsButtonId);
				When.iClickOnMenuItemWithId("application-procurement-overview-component---card024_InsightsOriginal--ovpAddToInsightButton-unifiedmenu");
                Then.iValidateTheIntegrationCardManifest("card024_Insights", "RT");
				//When.iCloseTheDialogPopover();
				//Given.iTeardownMyApp();
			});

			return Journey;
		}
	};
	Journey.start().testAndEnd();
});
