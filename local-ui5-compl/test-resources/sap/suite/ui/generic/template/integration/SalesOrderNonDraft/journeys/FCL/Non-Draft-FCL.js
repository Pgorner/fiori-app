sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Non Draft FCL Functionality");

		opaTest("Starting the app with FCL settings and loading data", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("SalesOrder-nondraft#SalesOrder-nondraft", "manifestWithFCL");
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheListReportPage
				.theSmartTableIsVisible("STTA_C_SO_SalesOrder_ND--listReport");
			Then.onTheGenericListReport
				.iSeeShellHeaderWithTitle("Sales Order Non Draft");
		});

		opaTest("Two Column: Naviagte from LR and check FCL layout", function (Given, When, Then) {
			When.onTheGenericListReport
			    .iNavigateFromListItemByLineNo(2);
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("TwoColumnsMidExpanded")
				.and
				.iCheckFCLActionButtonsVisibility(true)
				.and
				.iCheckFCLHeaderActionButtonsVisibility({fullScreen: true, exitFullScreen: false, closeColumn: true})
				.and
				.iCheckForFCLLayoutAppStateInUrl();
		});

		opaTest("Two Column: Check FCL Action Button Functionality", function (Given, When, Then) {
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("fullScreen");
			Then.onTheGenericFCLApp
				.iCheckFCLHeaderActionButtonsVisibility({exitFullScreen: true, closeColumn: true})
				.and
				.iCheckFCLLayout("MidColumnFullScreen");
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("exitFullScreen");
			Then.onTheGenericFCLApp
				.iCheckFCLHeaderActionButtonsVisibility({fullScreen: true, closeColumn: true})
				.and
				.iCheckFCLLayout("TwoColumnsMidExpanded");
		});

		opaTest("Two Column: Object page is in edit mode", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheEditButton();
			Then.onTheGenericObjectPage
				.theObjectPageIsInEditMode();
		});

		opaTest("Two Column: Make some changes on OP", function(Given, When, Then) {
			When.onTheObjectPage
				.iEnterValueInField("1000000", "com.sap.vocabularies.UI.v1.FieldGroup::GeneralInformation::OpportunityID::Field");
			Then.onTheGenericObjectPage
				.theObjectPageDataFieldHasTheCorrectValue({
					Field: "OpportunityID",
					Value: "1000000"
				});
		});

		opaTest("Two Column: Check for data loss dialog when doing back using shell back button", function(Given, When, Then) {
			When.onTheGenericObjectPage
			    .iClickTheBackButtonOnFLP();
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithTitle("Warning")
				.and
				.iShouldSeeTheButtonsOnTheDialog(["Leave Page", "Cancel"])
				.and
				.iShouldSeeTheDialogWithContent("Your entries will be lost when you leave this page.")
		});

		opaTest("Two Column: Check for data loss dialog when closing the FCL column", function(Given, When, Then) {
			When.onTheGenericObjectPage
			    .iClickTheButtonOnTheDialog("Cancel");
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("closeColumn");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithTitle("Warning")
				.and
				.iShouldSeeTheButtonsOnTheDialog(["Leave Page", "Cancel"])
				.and
				.iShouldSeeTheDialogWithContent("Your entries will be lost when you leave this page.");
		});

		opaTest("Two Column: Check for data loss dialog when clicking on a link in the LR", function(Given, When, Then) {
			When.onTheGenericObjectPage
			    .iClickTheButtonOnTheDialog("Cancel");
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("TwoColumnsMidExpanded");
			When.onTheGenericListReport
			    .iClickTheLink("100000006", 2);
			Then.onTheGenericListReport
				.iShouldSeeThePopoverWithMainNavigationId("100000006");
			When.onTheGenericListReport
			    .iClickTheLink("Trace Navigation Parameters");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithTitle("Warning")
				.and
				.iShouldSeeTheButtonsOnTheDialog(["Leave Page", "Cancel"])
				.and
				.iShouldSeeTheDialogWithContent("Your entries will be lost when you leave this page.");
		});

		opaTest("Two Column: Close two column layout", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Cancel");
			Then.onTheObjectPage
				.iCheckTheControlWithIdIsVisible("sap.uxap.ObjectPageHeaderActionButton", "STTA_SO_ND::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_SO_SalesOrder_ND--edit", false)
				.and
				.iCheckTheControlWithIdIsVisible("sap.uxap.ObjectPageHeaderActionButton", "STTA_SO_ND::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_SO_SalesOrder_ND--delete", true)
				.and
				.iCheckTheControlWithIdIsVisible("sap.uxap.ObjectPageHeaderActionButton", "STTA_SO_ND::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_SO_SalesOrder_ND--action::STTA_SALES_ORDER_ND_SRV_01.STTA_SALES_ORDER_ND_SRV_01_Entities::STTA_C_SO_SalesOrder_NDSetopportunityid", true);
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("closeColumn");
			When.onTheGenericObjectPage
			    .iClickTheButtonOnTheDialog("Leave Page");
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("OneColumn");
		});

		opaTest("Three Column: Navigate from LR to OP to Sub-OP and check FCL layout", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByLineNo(4);
			When.onTheGenericObjectPage
			    .iNavigateFromObjectPageTableByLineNo("to_Item", 0);
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("ThreeColumnsEndExpanded")
				.and
				.iCheckFCLHeaderActionButtonsVisibility({fullScreen: true, exitFullScreen: false, closeColumn: true},"STTA_C_SO_SalesOrderItem_ND")
				.and
				.iCheckForFCLLayoutAppStateInUrl();
		});

		opaTest("Three Column: Check FCL Action Button visibility Functionality", function (Given, When, Then) {
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("fullScreen");
			Then.onTheGenericFCLApp
				.iCheckFCLHeaderActionButtonsVisibility({exitFullScreen: true, closeColumn: true},"STTA_C_SO_SalesOrderItem_ND")
				.and
				.iCheckFCLLayout("EndColumnFullScreen");
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("exitFullScreen");
			Then.onTheGenericFCLApp
				.iCheckFCLHeaderActionButtonsVisibility({fullScreen: true, closeColumn: true},"STTA_C_SO_SalesOrderItem_ND")
				.and
				.iCheckFCLLayout("ThreeColumnsEndExpanded");
		});

		opaTest("Three Column: Object page is in edit mode", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("edit","STTA_C_SO_SalesOrderItem_ND");
			Then.onTheGenericObjectPage
				.theObjectPageIsInEditMode();
			Then.onTheObjectPage
				.iCheckTheControlWithIdIsVisible("sap.uxap.ObjectPageHeaderActionButton", "STTA_SO_ND::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_SO_SalesOrder_ND--edit", false)
				.and
				.iCheckTheControlWithIdIsVisible("sap.uxap.ObjectPageHeaderActionButton", "STTA_SO_ND::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_SO_SalesOrder_ND--delete", false)
				.and
				.iCheckTheControlWithIdIsVisible("sap.uxap.ObjectPageHeaderActionButton", "STTA_SO_ND::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_SO_SalesOrder_ND--action::STTA_SALES_ORDER_ND_SRV_01.STTA_SALES_ORDER_ND_SRV_01_Entities::STTA_C_SO_SalesOrder_NDSetopportunityid", true);
		});

		opaTest("Three Column: Make some changes on Sub-OP and see the values updated in OP table", function(Given, When, Then) {
			When.onTheObjectPage
				.iEnterValueInField("INR", "STTA_SO_ND::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_SO_SalesOrderItem_ND--com.sap.vocabularies.UI.v1.Identification::CurrencyCode::Field");
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByIndex(1, null, 1);
			Then.onTheGenericObjectPage
				.iCheckSelectedSectionByIdOrName("Sales Order Items", false, 1);
			Then.onTheObjectPage
				.iCheckRenderedColumnTextOnNthRowOfTable(1, [8], ["INR"], "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("Three Column: Check for data loss dialog when doing back using shell back button", function(Given, When, Then) {
			When.onTheGenericObjectPage
			    .iClickTheBackButtonOnFLP();
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithTitle("Warning")
				.and
				.iShouldSeeTheButtonsOnTheDialog(["Leave Page", "Cancel"])
				.and
				.iShouldSeeTheDialogWithContent("Your entries will be lost when you leave this page.")
		});

		opaTest("Three Column: Check for data loss dialog when closing the FCL column", function(Given, When, Then) {
			When.onTheGenericObjectPage
			    .iClickTheButtonOnTheDialog("Cancel");
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("closeColumn");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithTitle("Warning")
				.and
				.iShouldSeeTheButtonsOnTheDialog(["Leave Page", "Cancel"])
				.and
				.iShouldSeeTheDialogWithContent("Your entries will be lost when you leave this page.");
		});

		opaTest("Three Column: Make Changes on sub-OP and Click on Save and see values updated in OP table", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Cancel");
			When.onTheObjectPage
				.iEnterValueInField("USD", "STTA_SO_ND::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_SO_SalesOrderItem_ND--com.sap.vocabularies.UI.v1.Identification::CurrencyCode::Field")
				.and
				.iLookAtTheScreen();
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("save","STTA_C_SO_SalesOrderItem_ND");
			Then.onTheObjectPage
				.iCheckRenderedColumnTextOnNthRowOfTable(1, [8], ["USD"], "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("Three Column: Check for data loss dialog when clicking on a link in three column layout", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("edit","STTA_C_SO_SalesOrderItem_ND");
			When.onTheObjectPage
				.iEnterValueInField("EUR", "STTA_SO_ND::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_SO_SalesOrderItem_ND--com.sap.vocabularies.UI.v1.Identification::CurrencyCode::Field")
				.and
				.iLookAtTheScreen();
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("ThreeColumnsEndExpanded");
			When.onTheGenericObjectPage
			    .iClickTheSmartLinkWithLabel("Notebook Basic 15 with 2,80 GHz quad core, 15\" LCD, 4 GB DDR3 RAM, 500 GB Hard Disc, Windows 8 Pro (HT-1100)")
			Then.onTheGenericListReport
				.iShouldSeeThePopoverWithMainNavigationId("Notebook Basic 15 with 2,80 GHz quad core, 15\" LCD, 4 GB DDR3 RAM, 500 GB Hard Disc, Windows 8 Pro")
			When.onTheGenericListReport
			    .iClickTheLink("Trace Navigation Parameters");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithTitle("Warning")
				.and
				.iShouldSeeTheButtonsOnTheDialog(["Leave Page", "Cancel"])
				.and
				.iShouldSeeTheDialogWithContent("Your entries will be lost when you leave this page.");
		});

		opaTest("Three Column: Delete sub item from sub-op and validate the deletion on OP table", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Cancel");
			Then.onTheObjectPage
				.iCheckNumberOfItemsInTable(4, "STTA_SO_ND::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_SO_SalesOrder_ND--to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("delete","STTA_C_SO_SalesOrderItem_ND")
				.and
				.iClickTheButtonOnTheDialog("Delete");
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("TwoColumnsMidExpanded");
			Then.onTheObjectPage
				.iCheckNumberOfItemsInTable(3, "STTA_SO_ND::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_SO_SalesOrder_ND--to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("Three Column: Close two column layout and tear down the app", function(Given, When, Then) {
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("closeColumn");
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("OneColumn");
			Then.iTeardownMyApp();
		});
	}
);
