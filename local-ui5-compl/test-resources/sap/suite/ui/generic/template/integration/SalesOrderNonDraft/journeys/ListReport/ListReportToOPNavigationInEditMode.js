sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Non Draft List Report - Opening OP in Edit mode");

		opaTest("Starting the app and loading data and checking the Edit icon on the LR table", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordernd", "manifestOPDirectEdit");
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theAvailableNumberOfItemsIsCorrect("1,080");
			Then.onTheListReportPage
				.iCheckThePropertiesOfNthRowOfTable(1, { "visible": true, "type": "Detail" });
		});

		opaTest("Check the Edit icon not available for the record which is not editable", function (Given, When, Then) {
			Then.onTheListReportPage
				.iCheckThePropertiesOfNthRowOfTable(4, { "visible": true, "type": "Inactive" });
		});

		opaTest("Navigate to OP and check the OP is opened in edit mode", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({ Field: "SalesOrderID", Value: "500000010" });
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000010")
				.and
				.theObjectPageIsInEditMode();
		});

		opaTest("Click on Save and check the navigation to LR", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSetTheObjectPageDataField("GeneralInformation", "OpportunityID", "1111")
				.and
				.iSaveTheDraft(true);
			Then.onTheGenericListReport
				.theListReportPageIsVisible()
				.and
				.theAvailableNumberOfItemsIsCorrect("1,080");
			Then.onTheListReportPage
				.iShouldSeeTheNavigatedRowHighlighted(0, true)
				.and
				.iCheckRenderedColumnTextOnNthRowOfTable(1, [11], ["1111"]);
		});

		opaTest("Navigate to another OP and check the OP is opened in edit mode", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({ Field: "SalesOrderID", Value: "500000011" });
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000011")
				.and
				.theObjectPageIsInEditMode();
		});

		opaTest("Click on Save and Next and check the navigation to next OP in edit mode", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithLabel("Save and Next");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000012")
				.and
				.theObjectPageIsInEditMode();
		});

		opaTest("Click on Save and Next where the next object is not editable", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithLabel("Save and Next");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000014")
				.and
				.theObjectPageIsInEditMode();
		});

		opaTest("Click on Cancel and check the navigation to LR", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("cancel");
			Then.onTheGenericListReport
				.theListReportPageIsVisible()
				.and
				.theAvailableNumberOfItemsIsCorrect("1,080");
			Then.onTheListReportPage
				.iShouldSeeTheNavigatedRowHighlighted(4, true);
		});

		opaTest("Click on Save and Next for the last object in LR", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSetTheSearchField("500000010")
				.and
				.iExecuteTheSearch();
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({ Field: "SalesOrderID", Value: "500000010" });
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000010");
			When.onTheGenericObjectPage
				.iClickTheButtonWithLabel("Save and Next");
			Then.onTheGenericListReport
				.theListReportPageIsVisible()
				.and
				.theAvailableNumberOfItemsIsCorrect("1");
			Then.iTeardownMyApp();
		});
	}
);
