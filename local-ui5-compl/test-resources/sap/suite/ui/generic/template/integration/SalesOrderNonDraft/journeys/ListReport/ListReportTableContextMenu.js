sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Context Menu on the LR table");

		opaTest("Check for the ContextMenu on the table when single row is selected", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("EPMProduct-manage_st,SalesOrder-nondraft#SalesOrder-nondraft");
			When.onTheGenericListReport
				.iExecuteTheSearch();
			When.onTheListReportPage
				.iOpenTheContextMenuForNthRowOfTable(4, "responsiveTable");
			Then.onTheListReportPage
				.iCheckTheItemsOnTheContextMenu([{ text: "Set Random Opp ID", enabled: true },
				{ text: "Manage Products (Ext Nav)", enabled: true },
				{ text: "Navigation Tester", enabled: true },
				{ text: "Set Opp ID", enabled: true },
				{ text: "Edit", enabled: false },
				{ text: "Delete", enabled: true },
				{ text: "Open in New Tab or Window", enabled: true }]);
			When.onTheListReportPage
				.iOpenTheContextMenuForNthRowOfTable(3, "responsiveTable");
			Then.onTheListReportPage
				.iCheckTheItemsOnTheContextMenu([{ text: "Set Random Opp ID", enabled: true },
				{ text: "Manage Products (Ext Nav)", enabled: true },
				{ text: "Navigation Tester", enabled: true },
				{ text: "Set Opp ID", enabled: true },
				{ text: "Edit", enabled: true },
				{ text: "Delete", enabled: true },
				{ text: "Open in New Tab or Window", enabled: true }]);
		});

		opaTest("Check for the ContextMenu on the table when multiple rows are selected", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([0, 1, 2], true);
			When.onTheListReportPage
				.iOpenTheContextMenuForNthRowOfTable(1, "responsiveTable");
			Then.onTheListReportPage
				.iCheckTheItemsOnTheContextMenu([{ text: "Set Random Opp ID", enabled: true },
				{ text: "Manage Products (Ext Nav)", enabled: true },
				{ text: "Navigation Tester", enabled: true },
				{ text: "Set Opp ID", enabled: true },
				{ text: "Edit", enabled: true },
				{ text: "Delete", enabled: true },
				{ text: "Open in New Tab or Window", enabled: true }]);
			When.onTheListReportPage
				.iOpenTheContextMenuForNthRowOfTable(4, "responsiveTable");
			Then.onTheListReportPage
				.iCheckTheItemsOnTheContextMenu([{ text: "Set Random Opp ID", enabled: true },
				{ text: "Manage Products (Ext Nav)", enabled: true },
				{ text: "Navigation Tester", enabled: true },
				{ text: "Set Opp ID", enabled: true },
				{ text: "Edit", enabled: false },
				{ text: "Delete", enabled: true },
				{ text: "Open in New Tab or Window", enabled: true }]);
		});

		opaTest("Click on Delete from the context menu when multiple records are selected and check the action invoked correctly", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([0, 1, 2, 3], true);
			When.onTheListReportPage
				.iOpenTheContextMenuForNthRowOfTable(1, "responsiveTable")
				.and
				.iClickTheItemOnTheContextMenu("Delete");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Delete (4)");
		});

		opaTest("Click on Edit from the context menu when multiple records are selected and check the action invoked correctly", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Cancel");
			When.onTheListReportPage
				.iOpenTheContextMenuForNthRowOfTable(1, "responsiveTable")
				.and
				.iClickTheItemOnTheContextMenu("Edit");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Warning");
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Edit");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Edit (3)");
		});

		opaTest("Click on Set Opp ID from the context menu when multiple records are selected and check the action invoked correctly", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Cancel");
			When.onTheListReportPage
				.iOpenTheContextMenuForNthRowOfTable(1, "responsiveTable")
				.and
				.iClickTheItemOnTheContextMenu("Set Opp ID");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Set Opp ID");
		});

		opaTest("Click on Delete from the context menu for single record and check the action invoked correctly", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Cancel");
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([0, 1, 2, 3], false);
			When.onTheListReportPage
				.iOpenTheContextMenuForNthRowOfTable(1, "responsiveTable")
				.and
				.iClickTheItemOnTheContextMenu("Delete");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Delete");
		});

		opaTest("Click on Edit from the context menu for single record and check the action invoked correctly", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Cancel");
			When.onTheListReportPage
				.iOpenTheContextMenuForNthRowOfTable(1, "responsiveTable")
				.and
				.iClickTheItemOnTheContextMenu("Edit");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Edit (1)");
		});

		opaTest("Click on Set Opp ID from the context menu for single record and check the action invoked correctly", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Cancel");
			When.onTheListReportPage
				.iOpenTheContextMenuForNthRowOfTable(1, "responsiveTable")
				.and
				.iClickTheItemOnTheContextMenu("Set Opp ID");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Set Opp ID");
		});

		opaTest("Click on Manage Products (Ext Nav) from the context menu and check the external navigation", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Cancel");
			When.onTheListReportPage
				.iOpenTheContextMenuForNthRowOfTable(1, "responsiveTable")
				.and
				.iClickTheItemOnTheContextMenu("Manage Products (Ext Nav)");
			Then.onTheGenericListReport
				.iSeeShellHeaderWithTitle("Manage Products (Technical Application)");
			Then.iTeardownMyApp();
		});
	}
);