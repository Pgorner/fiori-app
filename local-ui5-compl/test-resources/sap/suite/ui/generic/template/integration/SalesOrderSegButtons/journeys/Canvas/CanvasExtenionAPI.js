sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Sales Order with Segmented Buttons - Canvas Page");

		opaTest("Starting the app, navigating to the Canvas Page and calling Extension API refreshAncestor()", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordersb", "manifestWithCanvas");
			When.onTheGenericListReport
				.iExecuteTheSearch()
				.and
				.iNavigateFromListItemByFieldValue({Field: "SalesOrder", Value: "500000000"});
			When.onTheObjectPage
				.iEnterValueInField("UpdatePath", "listReportFilter-filterItemControl_BASIC-SalesOrder");
			When.onTheObjectPage
				.iClickOnButtonWithText("RefreshAncestor");
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.m.Input", {"value": "SalesOrder='500000000',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true"});
		});

		opaTest("Use Canvas Page Extension API onCustomStateChange()", function (Given, When, Then) {
			When.onTheObjectPage
				.iClickTheControlWithId("Details");
			When.onTheObjectPage
				.iClickOnButtonWithText("Save Icon Tab Bar State");
			When.onTheObjectPage
				.iClickTheControlWithId("Info");
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field: "SalesOrder", Value: "500000002"});
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.m.IconTabFilter", { "text": "Details" });
		});

		opaTest("Select multiple records from LR page and navigate to the Canvas Page using navigateInternal method", function (Given, When, Then) {
			When.onTheObjectPage
				.iClickOnButtonWithText("Back to LR");
			Then.onTheGenericListReport
				.theListReportPageIsVisible();
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([0, 2], true)
				.and
				.iClickTheButtonWithId("selectedItems");
			Then.onTheObjectPage
				.iCheckForStringInAppUrl("/SalesOrderListInfo(500000000,500000002)/", true)
				.and
				.iCheckControlPropertiesById("ImplementingComponentContent---View--salesOrderIds", { "visible": true, "text": "500000000,500000002" });
		});

		opaTest("Navigate to Canvas page with context using navigateInternal method", function (Given, When, Then) {
			When.onTheObjectPage
				.iClickOnButtonWithText("Go to first sales order");
			Then.onTheObjectPage
				.iCheckForStringInAppUrl("/SalesOrderListInfo(500000000)/", true)
				.and
				.iCheckControlPropertiesById("ImplementingComponentContent---View--salesOrderIds", { "visible": true, "text": "500000000" });
		});

		opaTest("Navigate to Canvas page with a different context using navigateInternal method", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateBack();
			When.onTheObjectPage
				.iClickOnButtonWithText("Go to last sales order");
			Then.onTheObjectPage
				.iCheckForStringInAppUrl("/SalesOrderListInfo(500000002)/", true)
				.and
				.iCheckControlPropertiesById("ImplementingComponentContent---View--salesOrderIds", { "visible": true, "text": "500000002" });
			Then.iTeardownMyApp();
		});
	}
);
