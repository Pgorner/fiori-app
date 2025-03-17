sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Check Add Card To Insights button functionality ");

		opaTest("Check whether button is enabled after Search", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("SalesOrder-nondraft#SalesOrder-nondraft");
			When.onTheGenericListReport
				.iClickTheButtonWithId("template::ListReport::TableToolbar-overflowButton");
			Then.onTheGenericListReport
				.theOverflowToolBarButtonIsEnabled("Add Card to Insights", false);
			When.onTheGenericListReport
				.iExecuteTheSearch();
			When.onTheGenericListReport
				.iClickTheButtonWithId("template::ListReport::TableToolbar-overflowButton");
			Then.onTheListReportPage
				.iCheckControlPropertiesById("template::AddCardtoInsights", { "enabled": true, "icon": "sap-icon://add-folder","text": "Add Card to Insights" });
		});

		opaTest("Click on Add Card To Insights button and check the card creation dialog from Insights is triggered", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonWithId("template::AddCardtoInsights");
			Then.onTheGenericListReport
				.iShouldSeeTheMessageToastWithText("Card Preview Triggered!");
			Then.iTeardownMyApp();
		});
	}
);