sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Check Share Cards to Collaboration Manager functionality");

		opaTest("Launch the app and load the data", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("SalesOrder-MultiViews,SalesOrder-nondraft#SalesOrder-nondraft");
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theAvailableNumberOfItemsIsCorrect("1,080");
		});

		opaTest("Apply some filter on the SmartFilterBar and check the Share cards to Insights channel is removed", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSetTheFilter({ Field: "BusinessPartnerID", Value: "100000000" });
			Then.onTheGenericListReport
				.iShouldSeeTheMessageToastWithText("Share cards to Insights channel removed");
		});

		opaTest("Check the Insights card channel is updated after search is triggered", function (Given, When, Then) {
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.iShouldSeeTheMessageToastWithText("Insights channel is updated with new cards");
		});

		opaTest("Check the Insights card channel is unregistered when navigating away from the application", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonWithId("NavigatioButton");
			Then.onTheGenericObjectPage
				.iShouldSeeTheMessageToastWithText("CardProvider is unregistered");
			Then.iTeardownMyApp();
		});
	}
);
