sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Non Draft List Report with table tabs and multi edit functionality");

		opaTest("Starting the app and loading data, check MultiEdit Action Enablement for each tab", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordernd", "manifestLRWithTableTabs");
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({ "MultiEdit:::sQuickVariantKey::1": [true, false, "Edit"] }, "responsiveTable-1");
			When.onTheGenericListReport
				.iClickOnIconTabFilter("2");
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({ "MultiEdit:::sQuickVariantKey::2": [true, false, "Edit"] }, "responsiveTable-2");
			When.onTheGenericListReport
				.iClickOnIconTabFilter("3");
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({ "MultiEdit:::sQuickVariantKey::3": [true, false, "Edit"] }, "responsiveTable-3");
			When.onTheGenericListReport
				.iClickOnIconTabFilter("4");
			Then.onTheGenericListReport
				.iShouldNotSeeTheControlWithId("template:::ListReportAction:::MultiEdit:::sQuickVariantKey::4");
		});

		opaTest("Launch the Multi Edit Dialog from tab 1 and verify the Multi Edit Dialog and it's components and cancel the dialog", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnIconTabFilter("1")
				.and
				.iSelectListItemsByLineNo([0, 1, 2], true, 1);
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({ "MultiEdit:::sQuickVariantKey::1": [true, true, "Edit"] }, "responsiveTable-1");
			When.onTheListReportPage
				.iClickTheButtonOnTableToolBar("Edit", "listReport-1");
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
				], "responsiveTable-1");
		});

		opaTest("Launch the Multi Edit Dialog and click on save without making any change and check the toast message", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickTheButtonOnTableToolBar("Edit", "listReport-1");
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Save");
			Then.onTheGenericListReport
				.iShouldSeeTheMessageToastWithText("You haven't made any changes.");
		});

		opaTest("Launch the Multi Edit Dialog from tab 1 and change properties and validate save", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickTheButtonOnTableToolBar("Edit", "listReport-1");
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
			When.onTheListReportPage
				.iClickTheButtonOnTableToolBar("Settings", "listReport-1");
			Then.onTheListReportPage
				.iAddColumnFromP13nDialog("LastChangedUserName");
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("OK");
			Then.onTheListReportPage
				.iCheckRenderedColumnTextOnNthRowOfTable(1, [7, 10, 11, 15], ["2,496.790", "Initial", "JAMILA", "Test"], "responsiveTable-1")
				.and
				.iCheckRenderedColumnTextOnNthRowOfTable(2, [7, 10, 11, 15], ["2,331.490", "Initial", "JAMILA", "Test"], "responsiveTable-1")
				.and
				.iCheckRenderedColumnTextOnNthRowOfTable(3, [7, 10, 11, 15], ["899.080", "Initial", "JAMILA", "Test"], "responsiveTable-1");
		});

		opaTest("Launch the Multi Edit Dialog from tab 2 and verify the Multi Edit Dialog and it's components", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnIconTabFilter("2");
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([1, 2, 3], true, 2);
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({ "MultiEdit:::sQuickVariantKey::2": [true, true, "Edit"] }, "responsiveTable-2");
			When.onTheListReportPage
				.iClickTheButtonOnTableToolBar("Edit", "listReport-2");
			Then.onTheListReportPage
				.iVerifyTheMultiEditDialogAttributesAreCorrect("Edit (3)", ["BusinessPartnerID", "CurrencyCode", "GrossAmount", "NetAmount",
					"TaxAmount", "LifecycleStatus", "BillingStatus", "DeliveryStatus", "OpportunityID"]);
			Then.onTheGenericListReport
				.iShouldSeeTheButtonsOnTheDialog(["Save", "Cancel"]);
		});

		opaTest("Change properties in the multi edit dialog and validate save", function (Given, When, Then) {
			When.onTheListReportPage
				.iSetSmartMultiEditField([
					{ Choice: "Replace", PropertyName: "BusinessPartnerID", Value: "100000011" },
					{ Choice: "Keep", PropertyName: "CurrencyCode" },
					{ Choice: "Index", PropertyName: "GrossAmount", Value: 3 },
					{ Choice: "Index", PropertyName: "NetAmount", Value: 4 },
					{ Choice: "Replace", PropertyName: "TaxAmount", Value: "30" },
					{ Choice: "Clear", PropertyName: "LifecycleStatus" },
					{ Choice: "Keep", PropertyName: "BillingStatus" },
					{ Choice: "Replace", PropertyName: "DeliveryStatus", Value: "Initial" },
					{ Choice: "Index", PropertyName: "OpportunityID", Value: 4 }
				]);
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Save");
			Then.onTheGenericListReport
				.iShouldSeeTheMessageToastWithText("Your changes have been saved.");
			Then.onTheListReportPage
				.iCheckRenderedColumnTextOnNthRowOfTable(2, [1, 2, 4, 5, 6, 7, 8, 9, 10, 11],
					["500000014", "100000011", "Peseta (EUR)", "250.730", "164.000", "30.000", "New", "Initial (P)", "Initial", "888"], "responsiveTable-2")
				.and
				.iCheckRenderedColumnTextOnNthRowOfTable(3, [1, 2, 4, 5, 6, 7, 8, 9, 10, 11],
					["500000016", "100000011", "Peseta (EUR)", "250.730", "164.000", "30.000", "New", "Initial (P)", "Initial", "888"], "responsiveTable-2")
				.and
				.iCheckRenderedColumnTextOnNthRowOfTable(4, [1, 2, 4, 5, 6, 7, 8, 9, 10, 11],
					["500000018", "100000011", "Peseta (EUR)", "250.730", "164.000", "30.000", "New", "Initial (P)", "Initial", "888"], "responsiveTable-2");
		});

		opaTest("Launch the Multi Edit Dialog from tab 3 after selecting some non updatable records and check the warning dialog", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnIconTabFilter("3");
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([0, 1, 2], true, 3);
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({ "MultiEdit:::sQuickVariantKey::3": [true, true, "Edit"] }, "responsiveTable-3");
			When.onTheListReportPage
				.iClickTheButtonOnTableToolBar("Edit", "listReport-3");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Warning")
				.and
				.iShouldSeeTheButtonsOnTheDialog(["Edit", "Cancel"])
				.and
				.iShouldSeeTheDialogWithContent("1 of 3 objects can't be edited. This can happen if someone is working on the object or if editing isn't allowed.\n\n Do you want to edit the remaining 2 objects?");
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Cancel");
			Then.onTheListReportPage
				.iCheckTheRowSelectionInTheTable([
					{ Index: 0, Selected: true },
					{ Index: 1, Selected: true },
					{ Index: 2, Selected: true }
				], "responsiveTable-3");
		});

		opaTest("Launch the Multi Edit Dialog from tab 3 and verify the Multi Edit Dialog and it's components", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickTheButtonOnTableToolBar("Edit", "listReport-3");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Warning");
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Edit");
			Then.onTheListReportPage
				.iVerifyTheMultiEditDialogAttributesAreCorrect("Edit (2)", ["BusinessPartnerID", "CurrencyCode"]);
			Then.onTheGenericListReport
				.iShouldSeeTheButtonsOnTheDialog(["Save", "Cancel"]);
		});

		opaTest("Change properties in the multi edit dialog and validate save", function (Given, When, Then) {
			When.onTheListReportPage
				.iSetSmartMultiEditField([
					{ Choice: "Keep", PropertyName: "BusinessPartnerID" },
					{ Choice: "Replace", PropertyName: "CurrencyCode", Value: "USD" }
				]);
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Save");
			Then.onTheGenericListReport
				.iShouldSeeTheMessageToastWithText("Your changes have been saved.");
			Then.onTheListReportPage
				.iCheckRenderedColumnTextOnNthRowOfTable(1, [2, 4], ["100000006", "Peseta (EUR)"], "responsiveTable-3")
				.and
				.iCheckRenderedColumnTextOnNthRowOfTable(2, [2, 4], ["100000011", "Peseta (USD)"], "responsiveTable-3")
				.and
				.iCheckRenderedColumnTextOnNthRowOfTable(3, [2, 4], ["100000011", "Peseta (USD)"], "responsiveTable-3");
			Then.iTeardownMyApp();
		});

		opaTest("Starting the app and loading data and check MultiEdit Action Enablement", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordernd", "manifestOPSingleSectionSingleTable");
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({ "MultiEdit": [true, false, "Edit"] });
		});

		opaTest("Launch the Multi Edit Dialog and verify the Multi Edit Dialog and it's components and cancel the dialog", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([0, 1, 2], true);
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({ "MultiEdit": [true, true, "Edit"] });
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

		opaTest("Launch the Multi Edit Dialog and change properties and validate save", function (Given, When, Then) {
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
			When.onTheListReportPage
				.iClickTheButtonOnTableToolBar("Settings", "listReport");
			Then.onTheListReportPage
				.iAddColumnFromP13nDialog("LastChangedUserName");
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("OK");
			Then.onTheListReportPage
				.iCheckRenderedColumnTextOnNthRowOfTable(1, [6, 9, 10, 14], ["2,496.790", "Initial", "JAMILA", "Test"])
				.and
				.iCheckRenderedColumnTextOnNthRowOfTable(2, [6, 9, 10, 14], ["2,331.490", "Initial", "JAMILA", "Test"])
				.and
				.iCheckRenderedColumnTextOnNthRowOfTable(3, [6, 9, 10, 14], ["899.080", "Initial", "JAMILA", "Test"]);
			Then.iTeardownMyApp();
		});
	}
);
