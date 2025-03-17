sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Check Add Card To Insights button functionality ");

		opaTest("Check whether button is enabled after Search", function (Given, When, Then) {
			Given.iStartMyAppInSandboxWithNoParams("#SalesOrder-TableTabs");
			When.onTheGenericListReport
				.iClickTheButtonWithId("template::ListReport::TableToolbar-1-overflowButton");
			Then.onTheListReportPage
				.iCheckControlPropertiesById("template:::ListReportAction:::AddCardtoInsights:::sQuickVariantKey::1", { "enabled": true, "icon": "sap-icon://add-folder", "text": "Add Card to Insights" });
		});

		opaTest("Click on Add Card To Insights button and check the card creation dialog from Insights is triggered", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickTheButtonOnTableToolBar("Add Card to Insights", "listReport-1");
			Then.onTheGenericListReport
				.iShouldSeeTheMessageToastWithText("Card Preview Triggered!");
		});

		opaTest("Click on second tab and check the Add Card To Insights button functionality", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnIconTabFilter("2")
				.and
				.iClickTheButtonWithId("template::ListReport::TableToolbar-2-overflowButton");
			Then.onTheListReportPage
				.iCheckControlPropertiesById("template:::ListReportAction:::AddCardtoInsights:::sQuickVariantKey::2", { "enabled": true, "icon": "sap-icon://add-folder", "text": "Add Card to Insights" });
			When.onTheListReportPage
				.iClickTheButtonOnTableToolBar("Add Card to Insights", "listReport-2");
			Then.onTheGenericListReport
				.iShouldSeeTheMessageToastWithText("Card Preview Triggered!");
			Then.iTeardownMyApp();
		});
	}
);