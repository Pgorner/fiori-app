sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Non Draft FCL with MultiEdit");

		opaTest("Starting the app and loading data, open the record in FCL 2nd column", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordernd", "manifestWithFCL");
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({ "MultiEdit": [true, false] });
			When.onTheGenericListReport
				.iExecuteTheSearch()
				.and
				.iNavigateFromListItemByLineNo(0);
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000010");
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("TwoColumnsMidExpanded");
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({ "MultiEdit": [true, false] });
		});

		opaTest("Check MultiEdit button not enabled when Draft, Locked or Non updatable records are selected from LR table", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([3], true);
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({ "MultiEdit": [true, false] });
		});

		opaTest("Check MultiEdit button is enabled when updatable records are selected", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([3], false)
				.and
				.iSelectListItemsByLineNo([0, 1, 2], true);
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({ "MultiEdit": [true, true] });
		});

		opaTest("Launch the Multi Edit Dialog and verify the Multi Edit Dialog and it's components", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickTheButtonOnTableToolBar("Edit", "listReport");
			Then.onTheListReportPage
				.iVerifyTheMultiEditDialogAttributesAreCorrect("Edit (3)", ["DeliveryStatus", "BusinessPartnerID", "OpportunityID", "TaxAmount", "LastChangedUserName"]);
			Then.onTheGenericListReport
				.iShouldSeeTheButtonsOnTheDialog(["Save", "Cancel"]);
		});

		opaTest("Click on Cancel from th dialog and check the dialog is getting closed and app is in 2 column layout", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Cancel");
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("TwoColumnsMidExpanded");
			Then.onTheListReportPage
				.iCheckTheRowSelectionInTheTable([
					{ Index: 0, Selected: true },
					{ Index: 1, Selected: true },
					{ Index: 2, Selected: true }
				]);
		});

		opaTest("Click on save from MultiEdit dialog without making any change and check the toast message and app is in 2 column layout", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickTheButtonOnTableToolBar("Edit", "listReport");
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Save");
			Then.onTheGenericListReport
				.iShouldSeeTheMessageToastWithText("You haven't made any changes.");
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("TwoColumnsMidExpanded");
			Then.onTheListReportPage
				.iCheckTheRowSelectionInTheTable([
					{ Index: 0, Selected: true },
					{ Index: 1, Selected: true },
					{ Index: 2, Selected: true }
				]);
		});

		opaTest("Launch the Multi Edit Dialog and change properties and validate save - object opened in display mode in 2nd column", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickTheButtonOnTableToolBar("Edit", "listReport");
			When.onTheListReportPage
				.iSetSmartMultiEditField([
					{ Choice: "Index", PropertyName: "DeliveryStatus", Value: 3 },
					{ Choice: "Index", PropertyName: "OpportunityID", Value: 4 },
					{ Choice: "Replace", PropertyName: "TaxAmount", Value: "100" },
					{ Choice: "Replace", PropertyName: "LastChangedUserName", Value: "Test" }
				]);
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Save");
			Then.onTheGenericListReport
				.iShouldSeeTheMessageToastWithText("Your changes have been saved.");
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("TwoColumnsMidExpanded");
			Then.onTheGenericObjectPage
				.theObjectPageIsInDisplayMode()
				.and
				.theObjectPageDataFieldHasTheCorrectValue({Field: "DeliveryStatus", Value: "D" })
				.and
				.theObjectPageDataFieldHasTheCorrectValue({Field: "OpportunityID", Value: "JAMILA"});
			Then.onTheObjectPage
				.iCheckControlPropertiesById("dataPoint::TaxAmount::Value", {"visible": true, "value": "100.000"});
			Then.onTheListReportPage
				.iCheckTheRowSelectionInTheTable([
					{ Index: 0, Selected: true },
					{ Index: 1, Selected: true },
					{ Index: 2, Selected: true }
				]);
			When.onTheListReportPage
				.iClickTheButtonOnTableToolBar("Settings", "listReport")
				.and
				.iAddColumnFromP13nDialog("LastChangedUserName");
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("OK");
			Then.onTheListReportPage
				.iCheckRenderedColumnTextOnNthRowOfTable(1, [7, 10, 11, 15], ["100.000", "Initial (D)", "JAMILA", "Test"])
				.and
				.iCheckRenderedColumnTextOnNthRowOfTable(2, [7, 10, 11, 15], ["100.000", "Initial (D)", "JAMILA", "Test"])
				.and
				.iCheckRenderedColumnTextOnNthRowOfTable(3, [7, 10, 11, 15], ["100.000", "Initial (D)", "JAMILA", "Test"]);		
		});

		opaTest("Check the warning dialog - Object opened in edit mode is part of the selection", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([0, 1, 2], true);
			When.onTheGenericObjectPage
				.iClickTheEditButton();
			Then.onTheGenericObjectPage
				.theObjectPageIsInEditMode();
			When.onTheListReportPage
				.iClickTheButtonOnTableToolBar("Edit", "listReport");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Warning")
				.and
				.iShouldSeeTheButtonsOnTheDialog(["Edit", "Cancel"])
				.and
				.iShouldSeeTheDialogWithContent("1 of 3 objects can't be edited. This can happen if someone is working on the object or if editing isn't allowed.\n\n Do you want to edit the remaining 2 objects?");
		});

		opaTest("Launch the Multi Edit Dialog and change properties and validate save - object opened in edit mode in 2nd column", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Edit")
			Then.onTheListReportPage
				.iVerifyTheMultiEditDialogAttributesAreCorrect("Edit (2)", ["DeliveryStatus", "BusinessPartnerID", "OpportunityID", "TaxAmount", "LastChangedUserName"]);
			When.onTheListReportPage
				.iSetSmartMultiEditField([
					{ Choice: "Clear", PropertyName: "DeliveryStatus" },
					{ Choice: "Replace", PropertyName: "OpportunityID", Value: "DEMO" },
					{ Choice: "Replace", PropertyName: "TaxAmount", Value: "200" },
					{ Choice: "Replace", PropertyName: "LastChangedUserName", Value: "Testing" }
				]);
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Save");
			Then.onTheGenericListReport
				.iShouldSeeTheMessageToastWithText("Your changes have been saved.");
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("TwoColumnsMidExpanded");
			Then.onTheGenericObjectPage
				.theObjectPageIsInEditMode()
				.and
				.theObjectPageDataFieldHasTheCorrectValue({Field: "DeliveryStatus", Value: "D" })
				.and
				.theObjectPageDataFieldHasTheCorrectValue({Field: "OpportunityID", Value: "JAMILA"});
			Then.onTheListReportPage
				.iCheckRenderedColumnTextOnNthRowOfTable(1, [7, 10, 11, 15], ["100.000", "Initial (D)", "JAMILA", "Test"])
				.and
				.iCheckRenderedColumnTextOnNthRowOfTable(2, [7, 10, 11, 15], ["200.000", "Initial", "DEMO", "Testing"])
				.and
				.iCheckRenderedColumnTextOnNthRowOfTable(3, [7, 10, 11, 15], ["200.000", "Initial", "DEMO", "Testing"])
				.and
				.iCheckTheRowSelectionInTheTable([
					{ Index: 0, Selected: true },
					{ Index: 1, Selected: true },
					{ Index: 2, Selected: true }
				]);
			Then.iTeardownMyApp();
		});
	}
);
