sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Sales Order Item Aggregation - MultiSelectForGridTable: Single Select", function () {

			opaTest("Starting the app (Object Page) and check the Grid Table", function (Given, When, Then) {
				Given.iStartMyAppInDemokit("sttasalesorderitemaggr#/STTA_C_SO_ItemAggr('.1~0500000000.2~0000000080')", "manifestGridTable");
				Then.onTheObjectPage
					.iCheckTableProperties({"visible": true}, "gridTable")
					.and
					.iCheckControlPropertiesById("to_ScheduleLine::com.sap.vocabularies.UI.v1.LineItem::Table", { "visible": true, "enableAutoColumnWidth": true });
			});

			opaTest("Select one item and select another one", function (Given, When, Then) {
				When.onTheGenericObjectPage
					.iSelectListItemsByLineNo([0], true, "to_ScheduleLine::com.sap.vocabularies.UI.v1.LineItem::gridTable")
					.and
					.iSelectListItemsByLineNo([1], true, "to_ScheduleLine::com.sap.vocabularies.UI.v1.LineItem::gridTable")
					.and
					.iClickTheButtonWithLabel("Show Selected Count");
				Then.onTheGenericObjectPage
					.iShouldSeeTheDialogWithContent("1");
				Then.iTeardownMyApp();
			});
		});

		QUnit.module("Sales Order Item Aggregation - MultiSelectForGridTable: Multi Select", function () {

			opaTest("Starting the app (Object Page)", function (Given, When, Then) {
				Given.iStartMyAppInDemokit("sttasalesorderitemaggr#/STTA_C_SO_ItemAggr('.1~0500000000.2~0000000080')", "manifestGridTableMS");
				Then.onTheObjectPage
					.iCheckTableProperties({"visible": true}, "gridTable");
			});

			opaTest("Select one item and select a range of 12", function (Given, When, Then) {
				When.onTheGenericObjectPage
					.iSelectListItemsByLineNo([0], true, "to_ScheduleLine::com.sap.vocabularies.UI.v1.LineItem::gridTable")
					.and
					.iSelectItemRange("SOITMAGGR::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_SO_ItemAggr--to_ScheduleLine::com.sap.vocabularies.UI.v1.LineItem::gridTable", 1, 12)
					.and
					.iClickTheButtonWithLabel("Show Selected Count");
				Then.onTheGenericObjectPage
					.iShouldSeeTheDialogWithContent("13");
				Then.iTeardownMyApp();
			});
		});

		QUnit.module("Sales Order Item Aggregation - MultiSelectForGridTable: Multi Select with Limit", function () {

			opaTest("Starting the app (Object Page)", function (Given, When, Then) {
				Given.iStartMyAppInDemokit("sttasalesorderitemaggr#/STTA_C_SO_ItemAggr('.1~0500000000.2~0000000080')", "manifestGridTableMSL");
				Then.onTheObjectPage
					.iCheckTableProperties({"visible": true}, "gridTable");
			});

			opaTest("Select one item and select another one", function (Given, When, Then) {
				When.onTheGenericObjectPage
					.iSelectListItemsByLineNo([0], true, "to_ScheduleLine::com.sap.vocabularies.UI.v1.LineItem::gridTable")
					.and
					.iSelectItemRange("SOITMAGGR::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_SO_ItemAggr--to_ScheduleLine::com.sap.vocabularies.UI.v1.LineItem::gridTable", 1, 12)
					.and
					.iClickTheButtonWithLabel("Show Selected Count");
				Then.onTheGenericObjectPage
					.iShouldSeeTheDialogWithContent("11");
				Then.iTeardownMyApp();
			});
		});
	}
);
