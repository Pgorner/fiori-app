sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Draft List Report with multi edit functionality");

		opaTest("Starting the app and loading data, check MultiEdit button Enablement", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttaproducts", "manifestAddressFacet");
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({ "MultiEdit": [true, false] });
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theAvailableNumberOfItemsIsCorrect("125");
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({ "MultiEdit": [true, false] });
		});

		opaTest("Check MultiEdit button not enabled when Draft record is selected", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([0, 1], true);
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({ "MultiEdit": [true, false] });
		});

		opaTest("Check MultiEdit button not enabled when Locked record is selected", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([0, 1], false)
				.and
				.iSelectListItemsByLineNo([4], true);
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({ "MultiEdit": [true, false] });
		});

		opaTest("Check MultiEdit button not enabled when non updatable record is selected", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([4], false)
				.and
				.iSelectListItemsByLineNo([7], true);
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({ "MultiEdit": [true, false] });
		});

		opaTest("Check MultiEdit button is enabled when updatable records are selected", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([7], false)
				.and
				.iSelectListItemsByLineNo([3, 5, 6], true);
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({ "MultiEdit": [true, true] });
		});

		opaTest("Launch the Multi Edit Dialog and verify the Multi Edit Dialog and it's components", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonWithId("template:::ListReportAction:::MultiEdit");
			Then.onTheListReportPage
				.iVerifyTheMultiEditDialogAttributesAreCorrect("Edit 3 Products", ["ProductForEdit", "ProductCategory", "Currency", "Supplier", "Price"]);
			Then.onTheGenericListReport
				.iShouldSeeTheButtonsOnTheDialog(["Save", "Cancel"]);
		});

		opaTest("Click on Cancel from th dialog and check the dialog is getting closed", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Cancel");
			Then.onTheListReportPage
				.iCheckTheRowSelectionInTheTable([
					{ Index: 3, Selected: true },
					{ Index: 5, Selected: true },
					{ Index: 6, Selected: true }
				]);
		});

		opaTest("Check the warning dialog - Non updatable record is selected and only one record is editable", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([5, 6], false)
				.and
				.iSelectListItemsByLineNo([2, 7], true)
				.and
				.iClickTheButtonWithId("template:::ListReportAction:::MultiEdit");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Warning")
				.and
				.iShouldSeeTheButtonsOnTheDialog(["Edit", "Cancel"])
				.and
				.iShouldSeeTheDialogWithContent("2 of 3 objects can't be edited. This can happen if someone is working on the object or if editing isn't allowed. \n\n Do you want to edit the remaining object?");
		});

		opaTest("Click on Cancel button from the warning dialog and cancel the edit flow", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Cancel");
			Then.onTheListReportPage
				.iCheckTheRowSelectionInTheTable([
					{ Index: 2, Selected: true },
					{ Index: 3, Selected: true },
					{ Index: 7, Selected: true }
				]);
		});

		opaTest("Check the warning message when non updatable records are part of the selection and multiple records are editable", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([5, 6], true)
				.and
				.iClickTheButtonWithId("template:::ListReportAction:::MultiEdit");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Warning")
				.and
				.iShouldSeeTheDialogWithContent("2 of 5 objects can't be edited. This can happen if someone is working on the object or if editing isn't allowed.\n\n Do you want to edit the remaining 3 objects?");
		});

		opaTest("Click on save from MultiEdit dialog without making any change and check the toast message", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Edit");
			Then.onTheListReportPage
				.iVerifyTheMultiEditDialogAttributesAreCorrect("Edit 3 Products", ["ProductForEdit", "ProductCategory", "Currency", "Supplier", "Price"]);
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Save");
			Then.onTheGenericListReport
				.iShouldSeeTheMessageToastWithText("You haven't made any changes.");
			Then.onTheListReportPage
				.iCheckTheRowSelectionInTheTable([
					{ Index: 2, Selected: true },
					{ Index: 3, Selected: true },
					{ Index: 5, Selected: true },
					{ Index: 6, Selected: true },
					{ Index: 7, Selected: true }
				]);
		});

		opaTest("Launch the Multi Edit Dialog and change properties and validate save", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonWithId("template:::ListReportAction:::MultiEdit")
				.and
				.iClickTheButtonOnTheDialog("Edit");
			When.onTheListReportPage
				.iSetSmartMultiEditField([
					{ Choice: "Keep", PropertyName: "ProductForEdit" },
					{ Choice: "Replace", PropertyName: "ProductCategory", Value: "Notebooks" },
					{ Choice: "Replace", PropertyName: "Currency", Value: "INR" },
					{ Choice: "Index", PropertyName: "Supplier", Value: 3 },
					{ Choice: "Keep", PropertyName: "Price" }
				]);
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Save");
			Then.onTheGenericListReport
				.iShouldSeeTheMessageToastWithText("Your changes have been saved.");
			Then.onTheListReportPage
				.iCheckRenderedColumnTextOnNthRowOfTable(4, [2, 6, 7, 8, 9], ["HT-1000", "Computer Systems (Notebooks)", "INR (Indian Rupee)", "100000049 (Talpa)", "956.00 "])
				.and
				.iCheckRenderedColumnTextOnNthRowOfTable(6, [2, 6, 7, 8, 9], ["HT-1003", "Computer Systems (Notebooks)", "INR (Indian Rupee)", "100000049 (Talpa)", "1,650.00 "])
				.and
				.iCheckRenderedColumnTextOnNthRowOfTable(7, [2, 6, 7, 8, 9], ["HT-1007", "Computer Systems (Notebooks)", "INR (Indian Rupee)", "100000049 (Talpa)", "299.00 "])
				.and
				.iCheckTheRowSelectionInTheTable([
					{ Index: 2, Selected: true },
					{ Index: 3, Selected: true },
					{ Index: 5, Selected: true },
					{ Index: 6, Selected: true },
					{ Index: 7, Selected: true }
				]);
			Then.iTeardownMyApp();
		});
	}
);
