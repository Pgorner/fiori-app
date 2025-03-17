sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Non Draft List Report with segmented button and multi edit functionality");

		opaTest("Starting the app and loading data, check MultiEdit Action Enablement", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordernd", "manifestLRWithSegmentedButton");
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({ "ListReportAction:::MultiEdit": [true, false, "Edit"] });
			When.onTheGenericListReport
				.iClickOnSegmentedButton("2");
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({ "ListReportAction:::MultiEdit": [true, false, "Edit"] });
		});

		opaTest("Launch the Multi Edit Dialog from tab 1 and verify the Multi Edit Dialog and it's components and cancel the dialog", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnSegmentedButton("1")
				.and
				.iSelectListItemsByLineNo([0, 1, 2], true);
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({ "ListReportAction:::MultiEdit": [true, true, "Edit"] });
			When.onTheListReportPage
				.iClickTheButtonOnTableToolBar("Edit", "listReport");
			Then.onTheListReportPage
				.iVerifyTheMultiEditDialogAttributesAreCorrect("Edit (3)", ["DeliveryStatus", "BusinessPartnerID", "OpportunityID", "TaxAmount", "LastChangedUserName"]);
			Then.onTheGenericListReport
				.iShouldSeeTheButtonsOnTheDialog(["Save", "Cancel"]);
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Cancel");
			Then.onTheListReportPage
				.iCheckTheRowSelectionInTheTable([
					{ Index: 0, Selected: true },
					{ Index: 1, Selected: true },
					{ Index: 2, Selected: true }
				]);
		});

		opaTest("Launch the Multi Edit Dialog and click on save without making any change and check the toast message", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickTheButtonOnTableToolBar("Edit", "listReport");
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Save");
			Then.onTheGenericListReport
				.iShouldSeeTheMessageToastWithText("You haven't made any changes.");
		});

		opaTest("Launch the Multi Edit Dialog from tab 1 and change properties and validate save", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickTheButtonOnTableToolBar("Edit", "listReport");
			When.onTheListReportPage
				.iSetSmartMultiEditField([
					{ Choice: "Clear", PropertyName: "DeliveryStatus" },
					{ Choice: "Index", PropertyName: "OpportunityID", Value: 4 },
					{ Choice: "Keep", PropertyName: "TaxAmount" },
					{ Choice: "Replace", PropertyName: "LastChangedUserName", Value: "Test" }
				]);
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Save");
			Then.onTheGenericListReport
				.iShouldSeeTheMessageToastWithText("Your changes have been saved.");
			Then.onTheListReportPage
				.iCheckTheRowSelectionInTheTable([
					{ Index: 0, Selected: true },
					{ Index: 1, Selected: true },
					{ Index: 2, Selected: true }
				]);
			When.onTheListReportPage
				.iClickTheButtonOnTableToolBar("Settings", "listReport");
			Then.onTheListReportPage
				.iAddColumnFromP13nDialog("LastChangedUserName");
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("OK");
			Then.onTheListReportPage
				.iCheckRenderedColumnTextOnNthRowOfTable(1, [7, 10, 11, 15], ["2,496.790", "Initial", "JAMILA", "Test"])
				.and
				.iCheckRenderedColumnTextOnNthRowOfTable(2, [7, 10, 11, 15], ["2,331.490", "Initial", "JAMILA", "Test"])
				.and
				.iCheckRenderedColumnTextOnNthRowOfTable(3, [7, 10, 11, 15], ["899.080", "Initial", "JAMILA", "Test"]);
		});

		opaTest("Launch the Multi Edit Dialog from tab 2 and verify the Multi Edit Dialog and it's components", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnSegmentedButton("2")
				.and
				.iSelectListItemsByLineNo([1, 2, 3], true);
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({ "ListReportAction:::MultiEdit": [true, true, "Edit"] });
			When.onTheListReportPage
				.iClickTheButtonOnTableToolBar("Edit", "listReport");
			Then.onTheListReportPage
				.iVerifyTheMultiEditDialogAttributesAreCorrect("Edit (3)", ["DeliveryStatus", "BusinessPartnerID", "OpportunityID", "TaxAmount", "LastChangedUserName"]);
			Then.onTheGenericListReport
				.iShouldSeeTheButtonsOnTheDialog(["Save", "Cancel"]);
		});

		opaTest("Change properties in the multi edit dialog and validate save", function (Given, When, Then) {
			When.onTheListReportPage
				.iSetSmartMultiEditField([
					{ Choice: "Clear", PropertyName: "DeliveryStatus" },
					{ Choice: "Index", PropertyName: "OpportunityID", Value: 4 },
					{ Choice: "Keep", PropertyName: "TaxAmount" },
					{ Choice: "Replace", PropertyName: "LastChangedUserName", Value: "Test" }
				]);
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Save");
			Then.onTheGenericListReport
				.iShouldSeeTheMessageToastWithText("Your changes have been saved.");
			Then.onTheListReportPage
				.iCheckRenderedColumnTextOnNthRowOfTable(2, [7, 10, 11, 15], ["121.540", "Initial", "888", "Test"])
				.and
				.iCheckRenderedColumnTextOnNthRowOfTable(3, [7, 10, 11, 15], ["40.030", "Initial", "888", "Test"])
				.and
				.iCheckRenderedColumnTextOnNthRowOfTable(4, [7, 10, 11, 15], ["31.160", "Initial", "888", "Test"]);
			Then.onTheListReportPage
				.iCheckTheRowSelectionInTheTable([
					{ Index: 1, Selected: true },
					{ Index: 2, Selected: true },
					{ Index: 3, Selected: true }
				]);
			Then.iTeardownMyApp();
		});
	}
);
