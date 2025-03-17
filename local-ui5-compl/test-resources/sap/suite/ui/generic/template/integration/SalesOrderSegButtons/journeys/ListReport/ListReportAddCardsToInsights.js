sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Check Add Card To Insights button functionality ");

		opaTest("Check whether button is enabled after Search", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("SalesOrder-SegButtons#SalesOrder-SegButtons");
			When.onTheGenericListReport
				.iExecuteTheSearch()
				.and
				.iClickTheButtonWithId("template::ListReport::TableToolbar-overflowButton");
			Then.onTheListReportPage
				.iCheckControlPropertiesById("template::AddCardtoInsights", { "enabled": true, "icon": "sap-icon://add-folder", "text": "Add Card to Insights" });
		});

		opaTest("Click on Add Card To Insights button and check the card creation dialog from Insights is triggered", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickTheButtonOnTableToolBar("Add Card to Insights", "listReport");
			Then.onTheGenericListReport
				.iShouldSeeTheMessageToastWithText("Card Preview Triggered!");
		});

		opaTest("Click on segmented button second tab and check the Add Card To Insights button functionality", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnSegmentedButton("_tab2")
				.and
				.iClickTheButtonWithId("template::ListReport::TableToolbar-overflowButton");
			Then.onTheListReportPage
				.iCheckControlPropertiesById("template::AddCardtoInsights", { "enabled": true, "icon": "sap-icon://add-folder", "text": "Add Card to Insights" });
			When.onTheListReportPage
				.iClickTheButtonOnTableToolBar("Add Card to Insights", "listReport");
			Then.onTheGenericListReport
				.iShouldSeeTheMessageToastWithText("Card Preview Triggered!");
			Then.iTeardownMyApp();
		});
	}
);