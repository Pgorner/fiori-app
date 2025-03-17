sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Sales Order No Extensions - Opening OP in Edit mode");

		opaTest("Starting the app and loading data and checking the Edit icon on the LR table", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordernoext", "manifestOPDirectEdit");
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListContainsTheCorrectNumberOfItems(20);
			Then.onTheListReportPage
				.iCheckControlPropertiesByControlType("sap.m.ColumnListItem", { "visible": true, "type": "Detail" });
		});

		opaTest("Navigate to OP and check the OP is opened in edit mode", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({ Field: "SalesOrder", Value: "500000000" });
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000000")
				.and
				.theObjectPageIsInEditMode();
		});

		opaTest("Click on Save and check the navigation to LR", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSetTheObjectPageDataField("Amount", "CurrencyCode", "INR")
				.and
				.iSaveTheDraft();
			Then.onTheGenericListReport
				.theListReportPageIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(20);
			Then.onTheListReportPage
				.iCheckRenderedColumnTextOnNthRowOfTable(1, [7], ["Indian Rupee (INR)"]);
		});

		opaTest("Navigate to draft OP and check the OP is opened in edit mode", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({ Field: "SalesOrder", Value: "500000001" });
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000001")
				.and
				.theObjectPageIsInEditMode();
		});

		opaTest("Click on Cancel and check the navigation to LR", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("discard");
			Then.onTheGenericListReport
				.theListReportPageIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(20);
			Then.iTeardownMyApp();
		});
	}
);
