sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Check Add Card To Insights button functionality");

		opaTest("Check for the error dialog while clicking on Add Card To Insights button when Semantic date from DateRange filter is applied", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("SalesOrder-MultiViews#SalesOrder-MultiViews", "manifest_SingleView");
			When.onTheGenericListReport
				.iSetTheFilter({ Field: "CreatedDate", Value: "Today" })
				.and
				.iExecuteTheSearch()
				.and
				.iClickTheButtonWithId("template::ListReport::TableToolbar-overflowButton")
				.and
				.iClickTheButtonWithId("template::AddCardtoInsights");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Error")
				.and
				.iShouldSeeTheDialogWithContent("Card creation isn't possible.\nPlease retry after ensuring the following:\n- No relative date filters (like \"Yesterday\") are used.\n- At least one text-based column with a single value is displayed in the table.");
		});

		opaTest("Check the card creation dialog from Insights is triggered when Non Semantic date from DateRange filter is applied", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Close")
				.and
				.iSetTheFilter({ Field: "CreatedDate", Value: "Jan 1, 2020 - Dec 31, 2020" })
				.and
				.iSetTheFilter({ Field: "DeliveryDateTime", Value: "Jan 1, 2020, 10:10:10 PM" })
				.and
				.iExecuteTheSearch()
				.and
				.iClickTheButtonWithId("template::ListReport::TableToolbar-overflowButton")
				.and
				.iClickTheButtonWithId("template::AddCardtoInsights");
			Then.onTheGenericListReport
				.iShouldSeeTheMessageToastWithText("Card Preview Triggered!");
		});

		opaTest("Clear the dateRange filter and click on Card To Insights button and check the card creation dialog from Insights is triggered", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSetTheFilter({ Field: "CreatedDate", Value: "" })
				.and
				.iSetTheFilter({ Field: "DeliveryDateTime", Value: "" })
				.and
				.iExecuteTheSearch()
				.and
				.iClickTheButtonWithId("template::ListReport::TableToolbar-overflowButton")
				.and
				.iClickTheButtonWithId("template::AddCardtoInsights");
			Then.onTheGenericListReport
				.iShouldSeeTheMessageToastWithText("Card Preview Triggered!");
			Then.iTeardownMyApp();
		});

		opaTest("Check whether Add Card To Insights button is enabled for Multiview tables", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("SalesOrder-MultiViews#SalesOrder-MultiViews");
			When.onTheGenericListReport
				.iSetTheFilter({ Field: "CreatedDate", Value: "" })
				.and
				.iSetTheFilter({ Field: "DeliveryDate", Value: "" })
				.and
				.iSetTheFilter({ Field: "UpdatedDate", Value: "" })
				.and
				.iSetTheFilter({ Field: "DeliveryDateTime", Value: "" })
				.and
				.iExecuteTheSearch()
				.and
				.iClickTheButtonWithId("template::ListReport::TableToolbar-1-overflowButton");
			Then.onTheListReportPage
				.iCheckControlPropertiesById("template:::ListReportAction:::AddCardtoInsights:::sQuickVariantKey::1", { "enabled": true, "icon": "sap-icon://add-folder", "text": "Add Card to Insights" });
		});

		opaTest("Click on Add Card To Insights button and check the card creation dialog from Insights is triggered", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonWithId("template:::ListReportAction:::AddCardtoInsights:::sQuickVariantKey::1");
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
			When.onTheGenericListReport
				.iClickTheButtonWithId("template:::ListReportAction:::AddCardtoInsights:::sQuickVariantKey::2");
			Then.onTheGenericListReport
				.iShouldSeeTheMessageToastWithText("Card Preview Triggered!");
		});

		opaTest("Click on third tab and check the Add Card To Insights button is not available for the chart", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnIconTabFilter("3");
			Then.onTheGenericListReport
				.iShouldNotSeeTheButtonWithIdInToolbar("template::ListReport::ChartToolbar-3", "template:::ListReportAction:::AddCardtoInsights:::sQuickVariantKey::3");
			Then.iTeardownMyApp();
		});
	}
);