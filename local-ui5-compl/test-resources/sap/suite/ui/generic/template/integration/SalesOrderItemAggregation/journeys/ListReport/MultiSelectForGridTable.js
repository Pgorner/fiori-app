sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Sales Order Item Aggregation - MultiSelectForGridTable: Single Select", function () {

			opaTest("Starting the app and loading data", function (Given, When, Then) {
				Given.iStartMyAppInSandbox("STTASOWD20-STTASOWD20,SalesOrder-itemaggregation#SalesOrder-itemaggregation", "manifestGridTable");
				When.onTheGenericListReport
					.iExecuteTheSearch();
				Then.onTheGenericListReport
					.theResultListIsVisible()
					.and
					.iShouldSeeTheExcelButton();
				Then.onTheListReportPage
					.iCheckTableProperties({"visible": true}, "gridTable", "GridTable-_tab1");
			});

			opaTest("Checking the FE rendered column properties on the Grid Table", function (Given, When, Then) {
				When.onTheListReportPage
					.iLookAtTheScreen()
				Then.onTheListReportPage
					.iCheckControlPropertiesById("sAction::STTA_C_SO_ItemAggr", { "visible": true, "sortProperty": "", "filterProperty": "Category", "width": "15rem" })
					.and
					.iCheckControlPropertiesById("sSemanticObject::STTASOWD20:::sAction::STTASOWD20", { "visible": true, "sortProperty": "ProductId", "filterProperty": "", "width": "15rem" })
					.and
					.iCheckControlPropertiesById("sProperty::SalesOrderId:::sSemanticObject::STTASOWD20:::sAction::STTASOWD20", { "visible": true, "sortProperty": "SalesOrderId", "filterProperty": "SalesOrderId", "width": "9rem" })
					.and
					.iCheckControlPropertiesById("sTarget:::40com.sap.vocabularies.UI.v1.DataPoint:23Progress", { "visible": true, "sortProperty": "to_Product/Width", "filterProperty": "to_Product/Width", "width": "6.875rem" });
			});

			opaTest("External navigation from Grid Table - Dynamic values for Semantic Object and Action", function (Given, When, Then) {
				When.onTheGenericListReport
					.iClickTheLink("500000695", 1);
				Then.onTheGenericListReport
					.iSeeShellHeaderWithTitle("Sales Order w/o Extensions");
				When.onTheGenericListReport
					.iClickTheBackButtonOnFLP();
				Then.onTheGenericListReport
					.theListReportPageIsVisible()
					.and
					.iSeeShellHeaderWithTitle("Sales Order Item Aggregation");
			});

			opaTest("Select one item and show selected", function (Given, When, Then) {
				When.onTheGenericListReport
					.iSelectListItemRange(0, 0, "_tab1")
					.and
					.iClickTheButtonWithId("ShowSelected-_tab1");

				Then.onTheGenericListReport
					.iShouldSeeTheDialogWithTitle("Show Selected");

				Then.onTheListReportPage
					.iCheckControlPropertiesByControlType("sap.m.List", {"headerText": "Sales Order Items (1)"});
			});

			opaTest("Select one and then another item and show selected", function (Given, When, Then) {
				When.onTheGenericListReport
					.iClickTheButtonOnTheDialog("OK")
					.and
					.iDeselectAllListItems("_tab1")
					.and
					.iSelectListItemRange(0, 0, "_tab1")
					.and
					.iSelectListItemRange(10, 10, "_tab1")
					.and
					.iClickTheButtonWithId("ShowSelected-_tab1");

				Then.onTheGenericListReport
					.iShouldSeeTheDialogWithTitle("Show Selected");

				Then.onTheListReportPage
					.iCheckControlPropertiesByControlType("sap.m.List", {"headerText": "Sales Order Items (1)"});
			});

			opaTest("Close dialog", function (Given, When, Then) {
				When.onTheGenericListReport
					.iClickTheButtonOnTheDialog("OK");
				Then.onTheGenericListReport
					.theResultListIsVisible();
				Then.iTeardownMyApp();
			});
		});


		QUnit.module("Sales Order Item Aggregation - MultiSelectForGridTable: Multi Select", function () {

			opaTest("Starting the app and loading data", function (Given, When, Then) {
				Given.iStartMyAppInDemokit("sttasalesorderitemaggr", "manifestGridTableMS");
				When.onTheGenericListReport
					.iExecuteTheSearch();
				Then.onTheGenericListReport
					.theResultListIsVisible();
				Then.onTheListReportPage
					.iCheckTableProperties({"visible": true}, "gridTable", "GridTable-_tab1");
			});

			opaTest("Select one item and show selected", function (Given, When, Then) {
				When.onTheGenericListReport
					.iSelectListItemRange(0, 0, "_tab1")
					.and
					.iClickTheButtonWithId("ShowSelected-_tab1");
				Then.onTheGenericListReport
					.iShouldSeeTheDialogWithTitle("Show Selected");
				Then.onTheListReportPage
					.iCheckControlPropertiesByControlType("sap.m.List", {"headerText": "Sales Order Items (1)"});
			});

			opaTest("Select multiple items and show selected", function (Given, When, Then) {
				When.onTheGenericListReport
					.iClickTheButtonOnTheDialog("OK")
					.and
					.iSelectListItemRange(0, 1, "_tab1")
					.and
					.iSelectListItemRange(5, 9, "_tab1")
					.and
					.iSelectListItemRange(11, 13, "_tab1")
					.and
					.iClickTheButtonWithId("ShowSelected-_tab1");

				Then.onTheGenericListReport
					.iShouldSeeTheDialogWithTitle("Show Selected");

				Then.onTheListReportPage
					.iCheckControlPropertiesByControlType("sap.m.List", {"headerText": "Sales Order Items (10)"});
			});

			opaTest("Select all items and show selected", function (Given, When, Then) {
				When.onTheGenericListReport
					.iClickTheButtonOnTheDialog("OK")
					.and
					.iSelectAllListItems("_tab1")
					.and
					.iClickTheButtonWithId("ShowSelected-_tab1");

				Then.onTheGenericListReport
					.iShouldSeeTheDialogWithTitle("Show Selected");

				Then.onTheListReportPage
					.iCheckControlPropertiesByControlType("sap.m.List", {"headerText": "Sales Order Items (182)"}); // all items
			});

			opaTest("Clear selection", function (Given, When, Then) {
				When.onTheGenericListReport
					.iClickTheButtonOnTheDialog("OK")
					.and
					.iDeselectAllListItems("_tab1");
				Then.onTheGenericListReport
					.theResultListIsVisible();
				Then.iTeardownMyApp();
			});
		});


		QUnit.module("Sales Order Item Aggregation - MultiSelectForGridTable: Multi Select with Limit and OP direct edit", function () {

			opaTest("Starting the app and loading data", function (Given, When, Then) {
				Given.iStartMyAppInDemokit("sttasalesorderitemaggr", "manifestGridTableMSL");
				When.onTheGenericListReport
					.iExecuteTheSearch();
				Then.onTheGenericListReport
					.theResultListIsVisible();
				Then.onTheListReportPage
					.iCheckTableProperties({"visible": true}, "gridTable", "GridTable-_tab1");
			});

			opaTest("Check the Edit icon visibility on the Grid table on LR", function (Given, When, Then) {
				Then.onTheListReportPage
					.iCheckTheEditIconVisibilityOnNthRowOfTable(1, true, "GridTable-_tab1");
			});

			opaTest("Check the Edit icon not visible for the non editable records", function (Given, When, Then) {
				Then.onTheListReportPage
					.iCheckTheEditIconVisibilityOnNthRowOfTable(4, false, "GridTable-_tab1")
			});

			opaTest("Navigate to OP and check the OP is opened in edit mode", function (Given, When, Then) {
				When.onTheGenericListReport
					.iNavigateFromListItemByLineNo(0, "listReport-_tab1");
				Then.onTheGenericObjectPage
					.theObjectPageIsInEditMode();
			});

			opaTest("Click on Save and check the navigation to LR", function (Given, When, Then) {
				When.onTheGenericObjectPage
					.iSetTheInputFieldWithId("com.sap.vocabularies.UI.v1.Identification::Category::Field-input", "Test")
					.and
					.iSaveTheDraft(true);
				Then.onTheGenericListReport
					.theListReportPageIsVisible();
				Then.onTheListReportPage
					.iShouldSeeTheNavigatedRowHighlightedInUITables(0, true, "GridTable-_tab1")
					.and
					.iCheckRenderedColumnTextOnNthRowOfTable(1, [4], ["Test"], "GridTable-_tab1", "gridTable");
			});

			opaTest("Navigate to another OP and check the OP is opened in edit mode", function (Given, When, Then) {
				When.onTheGenericListReport
					.iNavigateFromListItemByLineNo(1, "listReport-_tab1");
				Then.onTheGenericObjectPage
					.theObjectPageIsInEditMode();
			});

			opaTest("Click on Cancel and check the navigation to LR", function (Given, When, Then) {
				When.onTheGenericObjectPage
					.iClickTheButtonWithId("cancel");
				Then.onTheGenericListReport
					.theListReportPageIsVisible();
				Then.onTheListReportPage
					.iShouldSeeTheNavigatedRowHighlightedInUITables(1, true, "GridTable-_tab1");
			});

			opaTest("Select one item and show selected", function (Given, When, Then) {
				When.onTheGenericListReport
					.iSelectListItemRange(0, 0, "_tab1")
					.and
					.iClickTheButtonWithId("ShowSelected-_tab1");

				Then.onTheGenericListReport
					.iShouldSeeTheDialogWithTitle("Show Selected");
				Then.onTheListReportPage
					.iCheckControlPropertiesByControlType("sap.m.List", {"headerText": "Sales Order Items (1)"});
			});

			opaTest("Select multiple items below limit and show selected", function (Given, When, Then) {
				When.onTheGenericListReport
					.iClickTheButtonOnTheDialog("OK")
					.and
					.iDeselectAllListItems("_tab1")
					.and
					.iSelectListItemRange(0, 9, "_tab1") // 10 items (limit)
					.and
					.iClickTheButtonWithId("ShowSelected-_tab1");

				Then.onTheGenericListReport
					.iShouldSeeTheDialogWithTitle("Show Selected");
				Then.onTheListReportPage
					.iCheckControlPropertiesByControlType("sap.m.List", {"headerText": "Sales Order Items (10)"});
			});

			opaTest("Select multiple items above limit and show selected", function (Given, When, Then) {
				When.onTheGenericListReport
					.iClickTheButtonOnTheDialog("OK")
					.and
					.iDeselectAllListItems("_tab1")
					.and
					.iSelectListItemRange(0, 10, "_tab1") // 11 items
					.and
					.iClickTheButtonWithId("ShowSelected-_tab1");

				Then.onTheGenericListReport
					.iShouldSeeTheDialogWithTitle("Show Selected");
				Then.onTheListReportPage
					.iCheckControlPropertiesByControlType("sap.m.List", {"headerText": "Sales Order Items (10)"}); // limited to 10
			});

			opaTest("Select multiple items above limit several times and show selected", function (Given, When, Then) {
				When.onTheGenericListReport
					.iClickTheButtonOnTheDialog("OK")
					.and
					.iDeselectAllListItems("_tab1")
					.and
					.iSelectListItemRange(1, 11, "_tab1") // 11 items, only 10 will be selected
					.and
					.iSelectListItemRange(13, 23, "_tab1") // 11 items, only 10 will be selected
					.and
					.iClickTheButtonWithId("ShowSelected-_tab1");

				Then.onTheGenericListReport
					.iShouldSeeTheDialogWithTitle("Show Selected");
				Then.onTheListReportPage
					.iCheckControlPropertiesByControlType("sap.m.List", {"headerText": "Sales Order Items (20)"}); // limited to 2*10
			});

			opaTest("Clear selection", function (Given, When, Then) {
				When.onTheGenericListReport
					.iClickTheButtonOnTheDialog("OK")
					.and
					.iDeselectAllListItems("_tab1");

				Then.onTheGenericListReport
					.theResultListIsVisible();
				Then.iTeardownMyApp();
			});
		});
	}
);
