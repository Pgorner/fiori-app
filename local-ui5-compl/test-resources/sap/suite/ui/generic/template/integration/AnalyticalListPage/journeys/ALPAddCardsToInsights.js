sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Check Add Card To Insights button functionality ");

		opaTest("Check the Add Card To Insights button is not enabled when search is not triggered", function (Given, When, Then) {
			Given.iStartMyAppInSandboxWithNoParams("#alp-display");
			When.onTheVisualFilterDialog
				.iAddFilterValueInCompactDialog("Cost Element", "400020");
			When.onTheGenericAnalyticalListPage
				.iClickTheButtonOnTheDialogWithLabel("OK");
			Then.onTheMainPage
				.iCheckChartToolbarControlProperty({ "AddCardtoInsights": [true, false, "Add Card to Insights"] }, "ZCOSTCENTERCOSTSQUERY0020--chart");
			When.onTheGenericAnalyticalListPage
				.iClickOnFilterSwitchButton("compact");
			Then.onTheMainPage
				.iCheckChartToolbarControlProperty({ "AddCardtoInsights": [true, false, "Add Card to Insights"] }, "ZCOSTCENTERCOSTSQUERY0020--chart");
		});

		opaTest("Check the Add Card To Insights button is enabled when search is triggered", function (Given, When, Then) {
			When.onTheGenericAnalyticalListPage
				.iExecuteTheSearch()
				.and
				.iClickTheButtonWithId("template::ChartToolbar-overflowButton");
			Then.onTheMainPage
				.iCheckControlPropertiesById("template::AddCardtoInsights", { "enabled": true, "icon": "sap-icon://add-folder", "text": "Add Card to Insights" });
			When.onTheGenericAnalyticalListPage
				.iClickOnFilterSwitchButton("visual")
				.and
				.iClickTheButtonWithId("template::ChartToolbar-overflowButton");
			Then.onTheMainPage
				.iCheckControlPropertiesById("template::AddCardtoInsights", { "enabled": true, "icon": "sap-icon://add-folder", "text": "Add Card to Insights" });
		});

		opaTest("Click on Add Card To Insights button and check the card creation dialog from Insights is triggered", function (Given, When, Then) {
			When.onTheGenericAnalyticalListPage
				.iClickTheButtonWithId("template::AddCardtoInsights");
			Then.onTheGenericAnalyticalListPage
				.iShouldSeeTheMessageToastWithText("Card Preview Triggered!");
			Then.iTeardownMyApp();
		});
	}
);