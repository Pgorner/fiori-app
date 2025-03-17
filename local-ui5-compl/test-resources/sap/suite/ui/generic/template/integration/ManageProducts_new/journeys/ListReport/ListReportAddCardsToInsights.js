sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Check Add Card To Insights button functionality");

		opaTest("Check for the error dialog while clicking on Add Card To Insights button when none of the displayed table columns can be shown in a card", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("EPMProduct-manage_st#EPMProduct-manage_st");
			When.onTheGenericListReport
				.iExecuteTheSearch();
			When.onTheListReportPage
				.iClickTheButtonOnTableToolBar("Settings", "listReport")
				.and
				.iClickOnCheckboxWithText("", "innerSelectionPanelTable-sa", true)
				.and
				.iClickOnCheckboxWithText("", "innerSelectionPanelTable-sa", true)
				.and
				.iAddColumnFromP13nDialog("FieldGroupColumn")
				.and
				.iAddColumnFromP13nDialog("Supplier")
				.and
				.iAddColumnFromP13nDialog("Product (Rating and Progress)")
				.and
				.iAddColumnFromP13nDialog("Breakout Column");
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("OK")
				.and
				.iClickTheButtonWithId("template::ListReport::TableToolbar-overflowButton")
				.and
				.iClickTheButtonWithId("template::AddCardtoInsights");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Error")
				.and
				.iShouldSeeTheDialogWithContent("Card creation isn't possible.\nPlease retry after ensuring the following:\n- No relative date filters (like \"Yesterday\") are used.\n- At least one text-based column with a single value is displayed in the table.");
		});

		opaTest("Add one supported column and click on Card To Insights button and check the card creation dialog from Insights is triggered", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Close");
			When.onTheListReportPage
				.iClickTheButtonOnTableToolBar("Settings", "listReport")
				.and
				.iAddColumnFromP13nDialog("Product");
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("OK")
				.and
				.iClickTheButtonWithId("template::ListReport::TableToolbar-overflowButton")
				.and
				.iClickTheButtonWithId("template::AddCardtoInsights");
			Then.onTheGenericListReport
				.iShouldSeeTheMessageToastWithText("Card Preview Triggered!");
			Then.iTeardownMyApp();
		});
	}
);