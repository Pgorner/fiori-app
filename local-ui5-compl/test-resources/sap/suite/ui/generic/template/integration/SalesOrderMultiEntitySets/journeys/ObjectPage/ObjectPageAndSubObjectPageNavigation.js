sap.ui.define([
		"sap/ui/test/opaQunit"
	],
	function (opaTest) {
		"use strict";

		QUnit.module("Sales Order Multi EntitySets - OP-SOP - FCL");

		opaTest("Internal Navigation to OP and check the OP in FCL mode", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordermultientity","manifestWithFCL", null, {width: "1500", height: "900" });
			When.onTheGenericListReport
				.iSetTheFilter({Field: "DeliveryDate", Value: ""})
				.and
				.iExecuteTheSearch()
				.and
				.iClickOnIconTabFilter("1");
			When.onTheListReportPage
				.iClickTheItemInResponsiveTable(2, 1);
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000002");
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("TwoColumnsMidExpanded")
				.and
				.iCheckFCLActionButtonsVisibility(true)
				.and
				.iCheckFCLHeaderActionButtonsVisibility({fullScreen: true, exitFullScreen: false, closeColumn: true});

			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("fullScreen");
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("MidColumnFullScreen")
				.and
				.iCheckFCLActionButtonsVisibility(true)
				.and
				.iCheckFCLHeaderActionButtonsVisibility({fullScreen: false, exitFullScreen: true, closeColumn: true});

			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("exitFullScreen");
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("TwoColumnsMidExpanded");
		});

		opaTest("Internal Navigation to OP-SOP and check the SOP in FCL mode", function (Given, When, Then) {
			When.onTheObjectPage
				.iClickTheItemInResponsiveTable(1);
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("ThreeColumnsEndExpanded")
				.and
				.iCheckFCLActionButtonsVisibility(true, "C_STTA_SalesOrderItem_WD_20")
				.and
				.iCheckFCLHeaderActionButtonsVisibility({
					fullScreen: true,
					exitFullScreen: false,
					closeColumn: true
				}, "C_STTA_SalesOrderItem_WD_20")
				.and
				.iCheckFCLActionButtonsVisibility(false); //Check FCL action buttons are not visible on OP when SOP is opened in FCL mode
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.ui.comp.smarttable.SmartTable", {"entitySet": "C_STTA_SalesOrderItemSL_WD_20"});
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("20", "C_STTA_SalesOrderItem_WD_20")
				.and
				.iShouldSeeTheSections(["General Information", "Schedule Lines"])
				.and
				.iCheckTheIndexOfTheSectionIsCorrect(0, "General Information", "C_STTA_SalesOrderItem_WD_20")
				.and
				.iCheckTheIndexOfTheSectionIsCorrect(1, "Schedule Lines", "C_STTA_SalesOrderItem_WD_20")
				.and
				.theObjectPageDataFieldHasTheCorrectValue({
					Field: "Product",
					Value: "HT-1002"
				});
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("fullScreen");
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("EndColumnFullScreen")
				.and
				.iCheckFCLActionButtonsVisibility(true, "C_STTA_SalesOrderItem_WD_20")
				.and
				.iCheckFCLHeaderActionButtonsVisibility({
					fullScreen: false,
					exitFullScreen: true,
					closeColumn: true
				}, "C_STTA_SalesOrderItem_WD_20");

			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("exitFullScreen");
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("ThreeColumnsEndExpanded");
		});

		opaTest("Navigate back from SOP to OP and then to LR", function (Given, When, Then) {
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("closeColumn");
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("TwoColumnsMidExpanded");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000002");
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("closeColumn");
			Then.onTheGenericListReport
				.theResultListIsVisible();
		});

		opaTest("Checking the tab selection persistence in LR to OP ", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByLineNo(3, "listReport-1");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000003");
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByIndex(1, null, 1);
			Then.onTheGenericObjectPage
				.iCheckSelectedSectionByIdOrName("Sales Order Items", false, 1);
			When.onTheGenericListReport
				.iNavigateFromListItemByLineNo(5, "listReport-1");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000005")
				.and
				.iCheckSelectedSectionByIdOrName("Sales Order Items", false, 1);
		});

		opaTest("Checking the tab selection persistence in OP to SOP ", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateFromObjectPageTableByLineNo("to_Item", 1, "C_STTA_SalesOrder_WD_20", "SalesOrderItemsID");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("20", "C_STTA_SalesOrderItem_WD_20");
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("ThreeColumnsEndExpanded");
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByIndex(1, null, 2);
			Then.onTheGenericObjectPage
				.iCheckSelectedSectionByIdOrName("Schedule Lines", false,2);
			When.onTheGenericObjectPage
				.iNavigateFromObjectPageTableByLineNo("to_Item", 2, "C_STTA_SalesOrder_WD_20", "SalesOrderItemsID");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("30", "C_STTA_SalesOrderItem_WD_20");
			Then.onTheGenericObjectPage
				.iCheckSelectedSectionByIdOrName("Schedule Lines", false, 2);
		});

		opaTest("Checking the tab selection persistence in SOP - Paginator button navigation ", function (Given, When, Then) {
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("fullScreen");
			When.onTheGenericObjectPage
				.iNavigateUpOrDownUsingObjectPageHeaderActionButton("NavigationDown","C_STTA_SalesOrderItem_WD_20");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("40")
				.and
				.iCheckSelectedSectionByIdOrName("Schedule Lines", false, 1);
		});

		opaTest("Check the Delete Object Dialog text when the Object with concat annotation is deleted from the Object page", function (Given, When, Then) {
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("exitFullScreen")
				.and
				.iClickTheFCLActionButton("closeColumn");
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("delete");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("Delete this object (500000005 100000016)?");
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Cancel");
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("fullScreen");
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("delete");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("Delete object 500000005?");
			Then.iTeardownMyApp();
		});
	}
);
