sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Context Menu on the ALP table");

		opaTest("Check for the ContextMenu on the table when single row is selected", function (Given, When, Then) {
			Given.iStartMyAppInSandboxWithNoParams("#alpwp-display?DisplayCurrency=USD");
			When.onTheMainPage
				.iOpenTheContextMenuForNthRowOfTable(1, "responsiveTable");
			Then.onTheMainPage
				.iCheckTheItemsOnTheContextMenu([{ text: "Show Customer Country", enabled: true },
				{ text: "SalesOrder Non Draft", enabled: true },
				{ text: "Open in New Tab or Window", enabled: true }]);
		});

		opaTest("Check for the ContextMenu on the table when multiple rows are selected", function (Given, When, Then) {
			When.onTheGenericAnalyticalListPage
				.iSelectListItemsByLineNo([0, 1, 2], true);
			Then.onTheMainPage
				.iCheckTheItemsOnTheContextMenu([{ text: "Show Customer Country", enabled: true },
				{ text: "SalesOrder Non Draft", enabled: true },
				{ text: "Open in New Tab or Window", enabled: true }]);
			When.onTheMainPage
				.iOpenTheContextMenuForNthRowOfTable(4, "responsiveTable");
			Then.onTheMainPage
				.iCheckTheItemsOnTheContextMenu([{ text: "Show Customer Country", enabled: true },
				{ text: "SalesOrder Non Draft", enabled: true },
				{ text: "Open in New Tab or Window", enabled: true }]);
		});

		opaTest("Click on SalesOrder Non Draft from the context menu and check the external navigation", function (Given, When, Then) {
			When.onTheMainPage
				.iClickTheItemOnTheContextMenu("SalesOrder Non Draft")
				.and
				.iWaitForThePageToLoad("ListReport", "STTA_C_SO_SalesOrder_ND");
			Then.onTheGenericAnalyticalListPage
				.iSeeShellHeaderWithTitle("Sales Order Non Draft");
			Then.iTeardownMyApp();
		});

		opaTest("Check for the ContextMenu on the table when no rows are selected", function (Given, When, Then) {
			Given.iStartMyAppInSandboxWithNoParams("#alpwp-display?DisplayCurrency=USD");
			When.onTheMainPage
				.iOpenTheContextMenuForNthRowOfTable(1, "responsiveTable");
			Then.onTheMainPage
				.iCheckTheItemsOnTheContextMenu([{ text: "Show Customer Country", enabled: true },
				{ text: "SalesOrder Non Draft", enabled: true },
				{ text: "Open in New Tab or Window", enabled: true }]);
		});

		opaTest("Click on Show Customer Country from the context menu and check the selected context details", function (Given, When, Then) {
			When.onTheMainPage
				.iClickTheItemOnTheContextMenu("Show Customer Country");
			Then.onTheGenericAnalyticalListPage
				.iSeeTheDialogWithContent("Customer's country: AR");
			When.onTheMainPage
				.iClickOnButtonWithText("OK");
			Then.iTeardownMyApp();
		});
	}
);