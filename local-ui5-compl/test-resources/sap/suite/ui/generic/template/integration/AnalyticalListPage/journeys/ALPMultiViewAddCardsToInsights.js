/*global opaTest QUnit */
sap.ui.define(["sap/ui/test/opaQunit"], function () {

	"use strict";

	QUnit.module("AnalyticalListPage - Multiview Add Cards to Insights");

	opaTest("Check whether Add Card To Insights button is not enabled for Multiview charts when search is not triggered", function (Given, When, Then) {
		Given.iStartMyAppInSandboxWithNoParams("#alp-multitabledisplay");
		When.onTheVisualFilterDialog
			.iAddFilterValueInCompactDialog("Cost Element", "400020");
		When.onTheGenericAnalyticalListPage
			.iClickTheButtonOnTheDialogWithLabel("OK")
			.and
			.iClickOnIconTabFilter("3")
			.and
			.iClickTheButtonWithId("template:::ALPChart:::SmartChartToolbar:::sQuickVariantKey::3-overflowButton");
		Then.onTheMainPage
			.iCheckControlPropertiesById("ALPChart:::AddCardtoInsights:::sQuickVariantKey::3", { "enabled": false, "icon": "sap-icon://add-folder", "text": "Add Card to Insights" });
		When.onTheGenericAnalyticalListPage
			.iClickOnFilterSwitchButton("compact")
			.and
			.iClickTheButtonWithId("template:::ALPChart:::SmartChartToolbar:::sQuickVariantKey::3-overflowButton");
		Then.onTheMainPage
			.iCheckControlPropertiesById("template:::ALPChart:::AddCardtoInsights:::sQuickVariantKey::3", { "enabled": false, "icon": "sap-icon://add-folder", "text": "Add Card to Insights" });
	});

	opaTest("Check the Add Card To Insights button is enabled when search is triggered", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage
			.iExecuteTheSearch()
			.and
			.iClickTheButtonWithId("template:::ALPChart:::SmartChartToolbar:::sQuickVariantKey::3-overflowButton");
		Then.onTheMainPage
			.iCheckControlPropertiesById("template:::ALPChart:::AddCardtoInsights:::sQuickVariantKey::3", { "enabled": true, "icon": "sap-icon://add-folder", "text": "Add Card to Insights" });
		When.onTheGenericAnalyticalListPage
			.iClickOnFilterSwitchButton("visual")
			.and
			.iClickTheButtonWithId("template:::ALPChart:::SmartChartToolbar:::sQuickVariantKey::3-overflowButton");
		Then.onTheMainPage
			.iCheckControlPropertiesById("template:::ALPChart:::AddCardtoInsights:::sQuickVariantKey::3", { "enabled": true, "icon": "sap-icon://add-folder", "text": "Add Card to Insights" });
	});

	opaTest("Click on Add Card To Insights button and check the card creation dialog from Insights is triggered", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage
			.iClickTheButtonWithId("template:::ALPChart:::AddCardtoInsights:::sQuickVariantKey::3");
		Then.onTheGenericAnalyticalListPage
			.iShouldSeeTheMessageToastWithText("Card Preview Triggered!");
	});

	opaTest("Click on fourth tab and check the Add Card To Insights button functionality", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage
			.iClickOnIconTabFilter("4")
			.and
			.iClickTheButtonWithId("template:::ALPChart:::SmartChartToolbar:::sQuickVariantKey::4-overflowButton");
		Then.onTheMainPage
			.iCheckControlPropertiesById("template:::ALPChart:::AddCardtoInsights:::sQuickVariantKey::4", { "enabled": true, "icon": "sap-icon://add-folder", "text": "Add Card to Insights" });
		When.onTheGenericAnalyticalListPage
			.iClickTheButtonWithId("template:::ALPChart:::AddCardtoInsights:::sQuickVariantKey::4");
		Then.onTheGenericAnalyticalListPage
			.iShouldSeeTheMessageToastWithText("Card Preview Triggered!");
	});

	opaTest("Click on second tab and check the Add Card To Insights button is not available for the table", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage
			.iClickOnIconTabFilter("2");
		Then.onTheGenericAnalyticalListPage
			.iShouldNotSeeTheButtonWithIdInToolbar("template:::ALPTable:::SmartTableToolbar:::sQuickVariantKey::2", "template:::ALP:::AddCardtoInsights:::sQuickVariantKey::2");
		Then.iTeardownMyApp();
	});
});