sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Draft List Report with multi edit functionality in Grid Table");

		opaTest("Starting the app and loading data, check MultiEdit button Enablement", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttaproducts", "manifestLRGridTable");
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({ "MultiEdit": [true, false] }, undefined, "gridTable");
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theAvailableNumberOfItemsIsCorrect("125");
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({ "MultiEdit": [true, false] }, undefined, "gridTable");
		});

		opaTest("Check MultiEdit button not enabled when Draft record is selected", function (Given, When, Then) {
			When.onTheListReportPage
				.iSelectTheItemsInUITable(0, 0, "GridTable");
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({ "MultiEdit": [true, false] }, undefined, "gridTable");
		});

		opaTest("Check MultiEdit button not enabled when Locked record is selected", function (Given, When, Then) {
			When.onTheListReportPage
				.iSelectTheItemsInUITable(4, 4, "GridTable");
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({ "MultiEdit": [true, false] }, undefined, "gridTable");
		});

		opaTest("Check MultiEdit button not enabled when non updatable record is selected", function (Given, When, Then) {
			When.onTheListReportPage
				.iSelectTheItemsInUITable(7, 7, "GridTable");
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({ "MultiEdit": [true, false] }, undefined, "gridTable");
		});

		opaTest("Check MultiEdit button is enabled when updatable records are selected", function (Given, When, Then) {
			When.onTheListReportPage
				.iSelectTheItemsInUITable(3, 3, "GridTable");
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({ "MultiEdit": [true, true] }, undefined, "gridTable");
		});

		opaTest("Launch the Multi Edit Dialog and verify the Multi Edit Dialog and it's components", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonWithId("template:::ListReportAction:::MultiEdit");
			Then.onTheListReportPage
				.iVerifyTheMultiEditDialogAttributesAreCorrect("Edit 1 Products", ["ProductForEdit", "ProductCategory", "Currency", "Supplier", "Price", "Price"]);
			Then.onTheGenericListReport
				.iShouldSeeTheButtonsOnTheDialog(["Save", "Cancel"]);
		});

		opaTest("Click on Cancel from th dialog and check the dialog is getting closed", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Cancel");
			Then.onTheListReportPage
				.iCheckTheRowSelectionInTheTable([{ Index: 3, Selected: true }], "GridTable");
		});

		opaTest("Check the warning dialog - Non updatable record is selected and only one record is editable", function (Given, When, Then) {
			When.onTheListReportPage
				.iSelectTheItemsInUITable(6, 7, "GridTable");
			When.onTheGenericListReport
				.iClickTheButtonWithId("template:::ListReportAction:::MultiEdit");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Warning")
				.and
				.iShouldSeeTheButtonsOnTheDialog(["Edit", "Cancel"])
				.and
				.iShouldSeeTheDialogWithContent("1 of 2 objects can't be edited. This can happen if someone is working on the object or if editing isn't allowed. \n\n Do you want to edit the remaining object?");
		});

		opaTest("Click on Cancel button from the warning dialog and cancel the edit flow", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Cancel");
			Then.onTheListReportPage
				.iCheckTheRowSelectionInTheTable([
					{ Index: 6, Selected: true },
					{ Index: 7, Selected: true }
				], "GridTable");
		});

		opaTest("Check the warning message when non updatable records are part of the selection and multiple records are editable", function (Given, When, Then) {
			When.onTheListReportPage
				.iSelectTheItemsInUITable(5, 7, "GridTable");
			When.onTheGenericListReport
				.iClickTheButtonWithId("template:::ListReportAction:::MultiEdit");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Warning")
				.and
				.iShouldSeeTheDialogWithContent("1 of 3 objects can't be edited. This can happen if someone is working on the object or if editing isn't allowed.\n\n Do you want to edit the remaining 2 objects?");
		});

		opaTest("Click on save from MultiEdit dialog without making any change and check the toast message", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Edit");
			Then.onTheListReportPage
				.iVerifyTheMultiEditDialogAttributesAreCorrect("Edit 2 Products", ["ProductForEdit", "ProductCategory", "Currency", "Supplier", "Price", "Price"]);
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Save");
			Then.onTheGenericListReport
				.iShouldSeeTheMessageToastWithText("You haven't made any changes.");
			Then.onTheListReportPage
				.iCheckTheRowSelectionInTheTable([
					{ Index: 5, Selected: true },
					{ Index: 6, Selected: true },
					{ Index: 7, Selected: true }
				], "GridTable");
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
				.iCheckRenderedColumnTextOnNthRowOfTable(6, [2, 7, 8, 9, 10], ["基础版笔记本电脑 19 (HT-1003)", "Notebooks", "Indian Rupee (INR)", "Panorama Studios (100000050)", "1,650.00 "], "GridTable", "gridTable")
				.and
				.iCheckRenderedColumnTextOnNthRowOfTable(7, [2, 7, 8, 9, 10], ["ITelO Vault (HT-1007)", "Notebooks", "Indian Rupee (INR)", "Panorama Studios (100000050)", "299.00 "], "GridTable", "gridTable")
				.and
				.iCheckRenderedColumnTextOnNthRowOfTable(8, [2, 7, 8, 9, 10], ["专业版笔记本电脑 15 (HT-1010)", "Notebooks", "European Euro (EUR)", "TECUM (100000051)", "1,999.00 "], "GridTable", "gridTable")
				.and
				.iCheckTheRowSelectionInTheTable([
					{ Index: 5, Selected: true },
					{ Index: 6, Selected: true },
					{ Index: 7, Selected: true }
				], "GridTable");
			Then.iTeardownMyApp();
		});
	}
);
