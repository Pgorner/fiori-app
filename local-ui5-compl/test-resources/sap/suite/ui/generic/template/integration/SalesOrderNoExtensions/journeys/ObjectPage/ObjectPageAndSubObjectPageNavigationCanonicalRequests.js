sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Navigations For Object Page and Sub Object Page CanonicalRequests");

		opaTest("Internal Linking: Load the Object Page", function(Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordernoext#//C_STTA_SalesOrder_WD_20(SalesOrder='500000018',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)", "manifestCanonicalRequests");
			When.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "C_STTA_SalesOrder_WD_20");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000018");
		});

		opaTest("Internal Linking: Navigate internally to a different Sales Order", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheLink("500000019");
			When.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "C_STTA_SalesOrder_WD_20");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000019");
		});

		opaTest("Internal Linking: Back to the List Report", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("back")
				.and
				.iClickTheButtonWithId("back");
			Then.onTheGenericListReport
				.theResultListIsVisible()
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListContainsTheCorrectNumberOfItems(20);
		});

		opaTest("Navigate to the ObjectPage by LineNumber", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByLineNo(6);
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000006")
				.and
				.iShouldSeeTheSections(["General Information","Sales Order Items"]);
		});

		opaTest("Navigate back to the ListReport", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateBack();
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(20);
		});

		opaTest("Navigate to the ObjectPage by Field/Value", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000002"});
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000002")
				.and
				.iShouldSeeTheSections(["General Information","Sales Order Items"]);
		});


		opaTest("Navigate to the Item ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateFromObjectPageTableByFieldValue("to_Item", {Field:"SalesOrderItem", Value:"50"});
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("50");
		});

		opaTest("Navigate to the ScheduleLine ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateFromObjectPageTableByLineNo("to_SalesOrderItemSL", 0, "C_STTA_SalesOrderItem_WD_20");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("1");
		});

		opaTest("Navigate back to the Item", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("back","C_STTA_SalesOrderItemSL_WD_20");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("50");
		});

		opaTest("Navigate back to the SalesOrder", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("back","C_STTA_SalesOrderItem_WD_20");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000002");
			Then.iTeardownMyApp();
		});


		opaTest("Load the List Report with active Sales Orders", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordernoext");
			When.onTheGenericListReport
				.iSetTheFilter({Field:"editStateFilter", Value:4})
				.and
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(19)
				.and
				.theResultListFieldHasTheCorrectValue({Line:4, Field:"GrossAmount", Value:"101299.22"})
				.and
				.theResultListFieldHasTheCorrectValue({Line:11, Field:"SalesOrder", Value:"500000012"});
		});

		opaTest("Navigate to the ObjectPage and check title", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000010"});
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000010");
		});

		opaTest("Navigate to the Item ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateFromObjectPageTableByFieldValue("to_Item", {Field:"SalesOrderItem", Value:"50"});
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("50")
				.and
				.iShouldSeeTheSections(["General Information","Schedule Lines"])
				.and
				.theObjectPageDataFieldHasTheCorrectValue({
					Field  : "Product",
					Value : "HT-1067"
				})
				.and
				.theObjectPageTableFieldHasTheCorrectValue("to_SalesOrderItemSL", {
					Line   : 0,
					Field  : "Quantity",
					Value : "2"
				}, "C_STTA_SalesOrderItem_WD_20");
		});

		opaTest("Navigate to the ScheduleLine ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateFromObjectPageTableByLineNo("to_SalesOrderItemSL", 0, "C_STTA_SalesOrderItem_WD_20");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("1")
				.and
				.iShouldSeeTheSections(["General Information"])
				.and
				.theObjectPageDataFieldHasTheCorrectValue({
					Field  : "SalesOrder",
					Value : "500000010"
				});
		});

		opaTest("Breadcrumb back to the SalesOrderItem", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheLastBreadCrumbLink();
			Then.onTheGenericObjectPage
				.theObjectPageDataFieldHasTheCorrectValue({
					Field  : "GrossAmount",
					Value : "21.40"
				});
		});

		opaTest("Breadcrumb back to the SalesOrder", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheLastBreadCrumbLink();
			Then.onTheGenericObjectPage
				.theObjectPageDataFieldHasTheCorrectValue({
					Field  : "BusinessPartnerID",
					Value : "100000004"
				});
			Then.iTeardownMyApp();
		});
	}
);
