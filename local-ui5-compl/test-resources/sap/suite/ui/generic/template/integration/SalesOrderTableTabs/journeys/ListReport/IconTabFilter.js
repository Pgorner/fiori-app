sap.ui.define([
		"sap/ui/test/opaQunit"],

	function (opaTest) {
		"use strict";

		QUnit.module("Sales Order with Table Tabs - List Report");

		opaTest("Starting the app and loading data and check for the custom column and the custom message from extension rendering on Tab1", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordertt", null, null, {width: "1500", height: "900"});
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.iShouldSeeTheExcelButton()
				.and
				.theResultListContainsTheCorrectNumberOfItems(3, 1);
			Then.onTheListReportPage
				.iCheckControlPropertiesByControlType("sap.m.IconTabHeader", {"selectedKey": "1"})
				.and
				.checkTheColumnOnTheLRTable({
					Index: 1,
					ColId: "1--custColumn",
					ColHeader: "Custom Column",
					ColHeaderId: "1--custColumn-header"
				}, 1)
				.and
				.iCheckRenderedColumnTextOnNthRowOfTable(1, [2], ["Custom Content"], "C_STTA_SalesOrder_WD_20--responsiveTable-1")
				.and
				.iCheckMessageStripValueOnTable("C_STTA_SalesOrder_WD_20--responsiveTable-1", "Information", "custom message above list report tab 1");
		});

		opaTest("Clicking on Tab2 and check for the custom column and the custom message from extension rendering", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnIconTabFilter("2");

			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(6, 2); //actual 39 but limited with table top 25

			Then.onTheListReportPage
				.checkTheColumnOnTheLRTable({
					Index: 1,
					ColId: "2--custColumn",
					ColHeader: "Custom Column",
					ColHeaderId: "2--custColumn-header"
				}, 2)
				.and
				.iCheckRenderedColumnTextOnNthRowOfTable(1, [2], ["Custom Content"], "C_STTA_SalesOrder_WD_20--responsiveTable-2")
				.and
				.iCheckMessageStripValueOnTable("C_STTA_SalesOrder_WD_20--responsiveTable-2", "Error", "custom message above list report tab 2");
		});

		opaTest("Check that the editing status is shown", function (Given, When, Then) {
			Then.onTheGenericListReport
				.theResultListFieldHasTheCorrectObjectMarkerEditingStatus({
					Line: 0,
					Field: "SalesOrder",
					Value: "Flagged"
				});
		});

		opaTest("Check LR custom header title", function (Given, When, Then) {
			Then.onTheListReportPage
				.iCheckControlPropertiesByControlType("sap.m.Title", {"text": "List Report Custom Title"});
		});

		opaTest("TabRefresh: Select a SalesOrder and click Raise Gross Amount button", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([3], true, 2)
				.and
				.iClickTheButtonWithId("action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrder_WD_20Raisegrossamount-2");

			Then.onTheGenericListReport
				.theResultListContainsTheCorrectNumberOfItems(6, 2);
		});


		opaTest("Clicking on Tab1", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnIconTabFilter("1");

			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(3, 1)  // one less because the selected cheap entry is now expensive!
				.and
				.theResultListFieldHasTheCorrectValue({Line: 0, Field: "GrossAmount", Value: "14602.49"}, 1)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(1, 3);
		});

		opaTest("Open a draft object and navigate back to LR - Draft discard Pop up appears and Cancel the Draft and check the draft is removed", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByLineNo(0, "listReport-1");
			Then.onTheGenericObjectPage
				.theObjectPageIsInEditMode();
			When.onTheGenericObjectPage
				.iCloseTheObjectPage();
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithTitle("Warning")
				.and
				.iShouldSeeTheDialogWithContent("You've made changes to this object.\nWhat would you like to do?");
			When.onTheGenericObjectPage
				.iSelectTheOptionFromDiscardDraftPopUp("Discard Draft")
				.and
				.iClickTheButtonOnTheDialog("OK");
			Then.onTheGenericListReport
				.theListReportPageIsVisible()
				.and
				.theResultListFieldHasTheCorrectObjectMarkerEditingStatus({
					Line: 1,
					Field: "SalesOrder",
					Value: "Flagged"
				});
		});

		opaTest("Checking custom message from extension for tab 3", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnIconTabFilter("3");
			Then.onTheListReportPage
				.iCheckMessageStripValueOnTable("C_STTA_SalesOrder_WD_20--responsiveTable-3", "Success", "custom message above list report tab 3");
			Then.iTeardownMyApp();
		});
	}
);
