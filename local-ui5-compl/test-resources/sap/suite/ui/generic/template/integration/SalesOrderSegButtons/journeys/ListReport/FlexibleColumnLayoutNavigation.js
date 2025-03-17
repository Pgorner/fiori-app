sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Flexible Column Layout Navigation");

		opaTest("Starting the app and loading data", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordersb", null, null, { width: "1500", height: "900" });
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListIsVisible();
		});

		opaTest("Navigate to the main ObjectPage", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000002"});
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000002")
				.and
				.iShouldSeeTheSections(["Sales Order Items","ProductTableReuse"]);
			Then.onTheGenericFCLApp
				.iCheckFCLHeaderActionButtonsVisibility({"fullScreen": true});
			Then.onTheObjectPage
				.iCheckTheControlWithIdIsVisible("sap.m.Button", "ManageSalesOrderWithSegButtons::sap.suite.ui.generic.template.ObjectPage.view.Details::C_STTA_SalesOrder_WD_20--SalesOrderInfo", true);
		});

		opaTest("Navigate to draft object page ", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000001"});
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000001")
				.and
				.iShouldSeeTheSections(["Sales Order Items","ProductTableReuse"]);
		});

		opaTest("Check the Delete item dialog content in OP where title and description is coming from concat annotation", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectListItemsByLineNo([0],true, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
				.and
				.iClickTheControlWithId("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table::Toolbar-overflowButton")
				.and
				.iClickTheButtonWithId("to_Item::com.sap.vocabularies.UI.v1.LineItem::deleteEntry");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("Delete item 90 (ProductID HT-1022)?");
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Cancel");
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("fullScreen");
			When.onTheGenericObjectPage
				.iClickTheControlWithId("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table::Toolbar-overflowButton")
				.and
				.iClickTheButtonWithId("to_Item::com.sap.vocabularies.UI.v1.LineItem::deleteEntry");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("Delete item 90?");
			});

		opaTest("Change to fullscreen, close the column and open another item", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Cancel");
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("closeColumn");
			When.onTheGenericObjectPage
				.iSelectTheOptionFromDiscardDraftPopUp("Keep Draft")
				.and
				.iClickTheButtonOnTheDialog("OK");
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000000"});
			Then.onTheGenericFCLApp
				.iCheckFCLHeaderActionButtonsVisibility({"closeColumn": true});
		});

		opaTest("Maximize the ObjectPage", function (Given, When, Then) {
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("fullScreen");
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("MidColumnFullScreen")
				.and
				.iCheckFCLHeaderActionButtonsVisibility({"exitFullScreen": true});
		});

		opaTest("Minimize the ObjectPage", function (Given, When, Then) {
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("exitFullScreen");
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("TwoColumnsMidExpanded")
				.and
				.iCheckFCLHeaderActionButtonsVisibility({"fullScreen": true});
		});

		opaTest("Make some table personalisation changes in LR table and check the FCL layout remains the same", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickTheButtonOnTableToolBar("Settings", "listReport");
			When.onTheListReportPage
				.iAddColumnFromP13nDialog("Confirmation Status");
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("OK");
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("TwoColumnsMidExpanded");
		});

		opaTest("Expand the ObjectPage", function (Given, When, Then) {
			When.onTheGenericFCLApp
				.iSetTheFCLLayout("TwoColumnsBeginExpanded");
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("TwoColumnsBeginExpanded");
		});

		opaTest("Collapse the ObjectPage", function (Given, When, Then) {
			When.onTheGenericFCLApp
				.iSetTheFCLLayout("TwoColumnsMidExpanded");
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("TwoColumnsMidExpanded");
		});

		opaTest("Navigate to items Sub-ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateFromObjectPageTableByFieldValue("to_Item", {Field:"SalesOrderItem", Value:"30"});
			Then.onTheGenericObjectPage
				.iShouldSeeTheSections(["General Information", "Schedule Lines"]);
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("ThreeColumnsEndExpanded");
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("Schedule Lines", null, 2);
			Then.onTheGenericObjectPage
				.iCheckSelectedSectionByIdOrName("Schedule Lines", null, 2)
				.and
				.iShouldSeeTheButtonWithId("fullScreen", "C_STTA_SalesOrderItem_WD_20");
		});

		opaTest("Maximize the Sub-ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("fullScreen", "C_STTA_SalesOrderItem_WD_20");
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("EndColumnFullScreen");
			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithId("exitFullScreen", "C_STTA_SalesOrderItem_WD_20");
		});

		opaTest("Minimize the Sub-ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("exitFullScreen", "C_STTA_SalesOrderItem_WD_20");
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("ThreeColumnsEndExpanded");
			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithId("fullScreen", "C_STTA_SalesOrderItem_WD_20");
		});

		opaTest("Make some table personalisation changes in LR table and check the FCL layout remains the same", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickTheButtonOnTableToolBar("Settings", "listReport");
			When.onTheListReportPage
				.iAddColumnFromP13nDialog("Changed At");
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("OK");
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("ThreeColumnsEndExpanded");
		});

		opaTest("Collapse the Sub-ObjectPage", function (Given, When, Then) {
			When.onTheGenericFCLApp
				.iSetTheFCLLayout("ThreeColumnsMidExpanded");
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("ThreeColumnsMidExpanded");
		});

		opaTest("Expand the Sub-ObjectPage", function (Given, When, Then) {
			When.onTheGenericFCLApp
				.iSetTheFCLLayout("ThreeColumnsEndExpanded");
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("ThreeColumnsEndExpanded");
		});

		opaTest("Navigate to Canvas page by clicking on an Custom Action onSalesOrderInfo", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("SalesOrderInfo");
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("ThreeColumnsEndExpanded");
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.ui.core.mvc.XMLView", {"viewName": "sap.suite.ui.generic.template.Canvas.view.Canvas"})
				.and
				.iCheckControlPropertiesByControlType("sap.m.Page", {"Title": "Information for the Sales Order"})
				.and
				.iCheckControlPropertiesByControlType("sap.uxap.ObjectPageHeaderActionButton", {"text": "Full Screen"})
				.and
				.iCheckControlPropertiesByControlType("sap.ui.layout.form.SimpleForm", {"visible": true})
				.and
				.iCheckControlPropertiesByControlType("sap.ui.core.Title", {"text": "Look at the following information"})
				.and
				.iCheckControlPropertiesByControlType("sap.m.Text", {"text": "Display"});
		});

		opaTest("Collapse/Expand the Sub-ObjectPage/Canvas", function (Given, When, Then) {
			When.onTheGenericFCLApp
				.iSetTheFCLLayout("ThreeColumnsMidExpanded");
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("ThreeColumnsMidExpanded");
			When.onTheGenericFCLApp
				.iSetTheFCLLayout("ThreeColumnsEndExpanded");
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("ThreeColumnsEndExpanded");
		});

		opaTest("FullScreen Close the Canvas page and app teardown", function (Given, When, Then) {
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("fullScreen");
			Then.onTheGenericFCLApp
				.iCheckFCLHeaderActionButtonsVisibility({exitFullScreen: true, closeColumn: true})
				.and
				.iCheckFCLLayout("EndColumnFullScreen");
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("exitFullScreen");
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("ThreeColumnsEndExpanded");
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("closeColumn");
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("TwoColumnsMidExpanded");
			Then.iTeardownMyApp();
		});
	}
);
