sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Navigations For Object Page and Sub Object Page 2");

		opaTest("Load the List Report with active Sales Orders", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordernoext", null, {"bWithChange": true});
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

		opaTest("Check the visibility of Edit button on Subobject page", function (Given, When, Then) {
			Then.onTheObjectPage
				.iCheckControlPropertiesById("edit", {"visible": true})	
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

		opaTest("Check the visibility of Edit button on Subobject page level 2", function (Given, When, Then) {
			Then.onTheObjectPage
				.iCheckControlPropertiesById("edit", {"visible": true})	
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
		});

		opaTest("Navigation Down in Edit mode of Sub-Object Page", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("back");
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000000"});
			When.onTheGenericObjectPage
				.iNavigateFromObjectPageTableByFieldValue("to_Item", {Field:"SalesOrderItem", Value:"30"})
				.and
				.iNavigateUpOrDownUsingObjectPageHeaderActionButton("NavigationDown","C_STTA_SalesOrderItem_WD_20");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("20");
		});

		opaTest("Checking the tab selection persistence in SOP in persistence mode ", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByIndex(1);
			Then.onTheGenericObjectPage
				.iCheckSelectedSectionByIdOrName("Schedule Lines")
			When.onTheGenericObjectPage
				.iNavigateUpOrDownUsingObjectPageHeaderActionButton("NavigationDown","C_STTA_SalesOrderItem_WD_20");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("10")
				.and
				.iCheckSelectedSectionByIdOrName("Schedule Lines")
		});
		
		opaTest("Navigation Up in Edit mode of Sub-Object Page", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateUpOrDownUsingObjectPageHeaderActionButton("NavigationUp","C_STTA_SalesOrderItem_WD_20");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("20");
			Then.iTeardownMyApp();
		});

	}
);
