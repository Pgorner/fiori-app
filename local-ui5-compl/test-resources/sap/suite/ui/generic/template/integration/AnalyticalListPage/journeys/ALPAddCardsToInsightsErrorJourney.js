sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Check Add Card To Insights button functionality - Error Scenarios");

		opaTest("Check for the error dialog while clicking on Add Card To Insights button when DateRange filter is applied from compact filter", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("alpWithExtensions-display#alpWithExtensions-display", "manifestWithoutMapView");
			When.onTheMainPage
				.iClickTheSegmentedButton("chart");
			When.onTheGenericAnalyticalListPage
				.iClickTheButtonWithId("template::ChartToolbar-overflowButton")
				.and
				.iClickTheButtonWithId("template::AddCardtoInsights");
			Then.onTheGenericAnalyticalListPage
				.iShouldSeeTheDialogWithTitle("Error")
				.and
				.iShouldSeeTheDialogWithContent("Card creation isn't possible. Please retry after ensuring no relative date filters (like \"Yesterday\") are used.");
		});

		opaTest("Check the card creation dialog from Insights is triggered when Non Semantic date from DateRange filter is applied from compact filter", function (Given, When, Then) {
			When.onTheGenericAnalyticalListPage
				.iClickTheButtonOnTheDialogWithLabel("Close");
			When.onTheGenericAnalyticalListPage
				.iSetTheFilter({ Field: "StartDate", Value: "" })
				.and
				.iSetTheFilter({ Field: "SemanticDate1", Value: "Jan 1, 2020 - Dec 31, 2020" })
				.and
				.iSetTheFilter({ Field: "SemanticDate2", Value: "Jan 20, 2020" })
				.and
				.iSetTheFilter({ Field: "SemanticDate3", Value: "Jan 20, 2020, 10:10:10 PM" })
				.and
				.iClickTheButtonWithId("template::ChartToolbar-overflowButton")
				.and
				.iClickTheButtonWithId("template::AddCardtoInsights");
			Then.onTheGenericAnalyticalListPage
				.iShouldSeeTheMessageToastWithText("Card Preview Triggered!");
		});

		opaTest("Clear the dateRange filter from compact filter and click on Card To Insights button and check the card creation dialog from Insights is triggered", function (Given, When, Then) {
			When.onTheGenericAnalyticalListPage
				.iSetTheFilter({ Field: "SemanticDate1", Value: "" })
				.and
				.iSetTheFilter({ Field: "SemanticDate2", Value: "" })
				.and
				.iClickTheButtonWithId("template::ChartToolbar-overflowButton")
				.and
				.iClickTheButtonWithId("template::AddCardtoInsights");
			Then.onTheGenericAnalyticalListPage
				.iShouldSeeTheMessageToastWithText("Card Preview Triggered!");
		});

		opaTest("Check for the error dialog while clicking on Add Card To Insights button when DateRange filter is applied from visual filter", function (Given, When, Then) {
			When.onTheGenericAnalyticalListPage
				.iClickOnFilterSwitchButton("visual")
				.and
				.iClickTheButtonWithId("template:::VisualFilterBar:::ValueHelpButton:::sProperty::StartDate");
			When.onTheMainPage
				.iSelectTheItemInTheList("Today");
			When.onTheGenericAnalyticalListPage
				.iClickTheButtonWithId("template::ChartToolbar-overflowButton")
				.and
				.iClickTheButtonWithId("template::AddCardtoInsights");
			Then.onTheGenericAnalyticalListPage
				.iShouldSeeTheDialogWithTitle("Error")
				.and
				.iShouldSeeTheDialogWithContent("Card creation isn't possible. Please retry after ensuring no relative date filters (like \"Yesterday\") are used.");
		});

		opaTest("Check the card creation dialog from Insights is triggered when Non Semantic date from DateRange filter is applied from visual filter", function (Given, When, Then) {
			When.onTheGenericAnalyticalListPage
				.iClickTheButtonOnTheDialogWithLabel("Close")
				.and
				.iSelectVFChart("line", new Date(1540376285174), false, "StartDate")
				.and
				.iClickTheButtonWithId("template::ChartToolbar-overflowButton")
				.and
				.iClickTheButtonWithId("template::AddCardtoInsights");
			Then.onTheGenericAnalyticalListPage
				.iShouldSeeTheMessageToastWithText("Card Preview Triggered!");
		});

		opaTest("Clear the dateRange filter from visual filter and click on Card To Insights button and check the card creation dialog from Insights is triggered", function (Given, When, Then) {
			When.onTheGenericAnalyticalListPage
				.iDeselectVFChart("line", new Date(1540376285174), false, "StartDate")
				.and
				.iClickTheButtonWithId("template::ChartToolbar-overflowButton")
				.and
				.iClickTheButtonWithId("template::AddCardtoInsights");
			Then.onTheGenericAnalyticalListPage
				.iShouldSeeTheMessageToastWithText("Card Preview Triggered!");
			Then.iTeardownMyApp();
		});

		opaTest("Check Add Card to Insights button is hidden on the Chart toolbar when it is restricted from manifest", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("alpWithExtensions-display#alpWithExtensions-display", "manifestForTimeSeries");
			Then.onTheGenericAnalyticalListPage
				.iShouldNotSeeTheButtonWithIdInToolbar("template::ChartToolbar", "template::AddCardtoInsights");
			When.onTheGenericAnalyticalListPage
				.iClickOnFilterSwitchButton("compact");
			Then.onTheGenericAnalyticalListPage
				.iShouldNotSeeTheButtonWithIdInToolbar("template::ChartToolbar", "template::AddCardtoInsights");
			Then.iTeardownMyApp();
		});
	}
);