sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Fallback navigation to LR: With sap-keep-alive property not set");

		opaTest("Starting the app and navigate to OP", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("SalesOrder-SegButtons#SalesOrder-SegButtons");
			When.onTheListReportPage
				.iWaitForThePageToLoad("ListReport", "C_STTA_SalesOrder_WD_20");
			When.onTheGenericListReport
				.iExecuteTheSearch()
				.and
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000000"});
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000000");
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("TwoColumnsMidExpanded");
		});

		opaTest("Navigate to Sub Object page in three column layout", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateFromObjectPageTableByLineNo("to_Item", 0);
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("60", "C_STTA_SalesOrderItem_WD_20");
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("ThreeColumnsEndExpanded");
		});

		opaTest("Navigate to Home page ", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickOnItemFromTheShellNavigationMenu("Home");
			Then.onTheListReportPage
				.iCheckControlPropertiesByControlType("sap.ushell.ui.shell.ShellAppTitle", { "visible": true, "text": "Home" });
		});

		opaTest("Do a back navigation and check page is in three column layout", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateBack();
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("ThreeColumnsEndExpanded");
		});

		opaTest("Close the 3rd column and navigate to two column layout", function (Given, When, Then) {
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("closeColumn");
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("TwoColumnsMidExpanded");
		});

		opaTest("Click on the Shell back button and check the fallback navigation to LR page", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheBackButtonOnFLP();
			Then.onTheGenericListReport
				.theListReportPageIsVisible();
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("OneColumn");
			Then.iTeardownMyApp();
		});

		opaTest("Starting the app and navigate to OP", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("SalesOrder-SegButtons#SalesOrder-SegButtons");
			When.onTheGenericListReport
				.iExecuteTheSearch()
				.and
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000000"});
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("TwoColumnsMidExpanded");
		});

		opaTest("Save as tile from the OP in two column layout - Check static tile is created", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("template::Share-internalBtn")
			When.onTheObjectPage
				.iClickMenuItem("Save as Tile");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithTitle("Save as Tile");
			When.onTheObjectPage
				.iClickOnPagesMultiInputOnSaveAsTileDialog();
			When.onTheObjectPage
				.iClickOnCheckboxWithText("", "SelectedNodesComboBox-ValueHelpDialog--ContentNodesTree-1-selectMulti");
			When.onTheObjectPage
				.iClickTheButtonOnTheDialog("Apply");
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Save");
			Then.onTheGenericObjectPage
				.iShouldSeeTheMessageToastWithText("The tile was created and added to your page.");
		});

		opaTest("Close the two column and navigate to LR", function (Given, When, Then) {
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("closeColumn");
			Then.onTheGenericListReport
				.theListReportPageIsVisible();
		});

		opaTest("Go back to Home page and click on the newly created tile from the FLP", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnItemFromTheShellNavigationMenu("Home");
			When.onTheFLPPage
				.iClickTheControlByControlType("sap.m.GenericTile", {"visible": true, "header": "Sales Order", "subheader": "500000000"});
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("TwoColumnsMidExpanded");
		});

		opaTest("Close the Object page column and check the fallback navigation to LR page", function (Given, When, Then) {
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("closeColumn");
			Then.onTheGenericListReport
				.theListReportPageIsVisible();
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("OneColumn");
			Then.iTeardownMyApp();
		});
	}
);
