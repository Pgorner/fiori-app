sap.ui.define(["sap/ui/test/opaQunit", "sap/ui/test/Opa5"],
	function (opaTest, Opa5) {
		"use strict";

		QUnit.module("Draft List Report in FCL with multi edit functionality");

		if (sap.ui.Device.browser.safari) {
			opaTest("Safari detected - SKIPPED", function (Given, When, Then) {
				Opa5.assert.expect(0);
			});
		} else {

			opaTest("Starting the app and loading data, open the record in FCL 2nd column", function (Given, When, Then) {
				Given.iStartMyAppInDemokit("sttaproducts", "manifestDynamicHeaderInFCL");
				Then.onTheListReportPage
					.iCheckTableToolbarControlProperty({ "MultiEdit": [true, false] });
				When.onTheGenericListReport
					.iExecuteTheSearch()
					.and
					.iNavigateFromListItemByLineNo(3);
				Then.onTheGenericObjectPage
					.theObjectPageHeaderTitleIsCorrect("Notebook Basic 15");
				Then.onTheGenericFCLApp
					.iCheckFCLLayout("TwoColumnsMidExpanded");
				Then.onTheListReportPage
					.iCheckTableToolbarControlProperty({ "MultiEdit": [true, false] });
			});

			opaTest("Check MultiEdit button not enabled when Draft, Locked or Non updatable records are selected from LR table", function (Given, When, Then) {
				When.onTheGenericListReport
					.iSelectListItemsByLineNo([0, 1, 4, 7], true);
				Then.onTheListReportPage
					.iCheckTableToolbarControlProperty({ "MultiEdit": [true, false] });
			});

			opaTest("Check MultiEdit button is enabled when updatable records are selected", function (Given, When, Then) {
				When.onTheGenericListReport
					.iSelectListItemsByLineNo([0, 1, 4, 7], false)
					.and
					.iSelectListItemsByLineNo([3, 5, 6], true);
				Then.onTheListReportPage
					.iCheckTableToolbarControlProperty({ "MultiEdit": [true, true] });
			});

			opaTest("Launch the Multi Edit Dialog and verify the Multi Edit Dialog and it's components", function (Given, When, Then) {
				When.onTheListReportPage
					.iClickTheButtonOnTableToolBar("Edit", "listReport");
				Then.onTheListReportPage
					.iVerifyTheMultiEditDialogAttributesAreCorrect("Edit 3 Products", ["ProductForEdit", "ProductCategory", "Currency", "Supplier", "Price"]);
				Then.onTheGenericListReport
					.iShouldSeeTheButtonsOnTheDialog(["Save", "Cancel"]);
			});

			opaTest("Click on Cancel from the dialog and check the dialog is getting closed and app is in 2 column layout", function (Given, When, Then) {
				When.onTheGenericListReport
					.iClickTheButtonOnTheDialog("Cancel");
				Then.onTheGenericFCLApp
					.iCheckFCLLayout("TwoColumnsMidExpanded");
				Then.onTheListReportPage
					.iCheckTheRowSelectionInTheTable([
						{ Index: 3, Selected: true },
						{ Index: 5, Selected: true },
						{ Index: 6, Selected: true }
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
						{ Index: 3, Selected: true },
						{ Index: 5, Selected: true },
						{ Index: 6, Selected: true }
					]);
			});

			opaTest("Launch the Multi Edit Dialog and change properties and validate save - object opened in display mode in 2nd column", function (Given, When, Then) {
				When.onTheListReportPage
					.iClickTheButtonOnTableToolBar("Edit", "listReport")
					.and
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
				Then.onTheGenericFCLApp
					.iCheckFCLLayout("TwoColumnsMidExpanded");
				Then.onTheGenericObjectPage
					.theObjectPageIsInDisplayMode()
					.and
					.theObjectPageDataFieldHasTheCorrectValue({ Field: "ProductForEdit", Value: "HT-1000" })
					.and
					.theObjectPageDataFieldHasTheCorrectValue({ Field: "ProductCategory", Value: "Notebooks" })
					.and
					.theObjectPageDataFieldHasTheCorrectValue({ Field: "Supplier", Value: "100000049" })
					.and
					.theObjectPageDataFieldHasTheCorrectValue({ Field: "Price", Value: "956.00" });
				Then.onTheListReportPage
					.iCheckRenderedColumnTextOnNthRowOfTable(4, [2, 3, 4, 5, 7], ["HT-1000", "Notebooks (Computer Systems)", "INR (Indian Rupee)", "100000049 (Talpa)", "956.00 "])
					.and
					.iCheckRenderedColumnTextOnNthRowOfTable(6, [2, 3, 4, 5, 7], ["HT-1003", "Notebooks (Computer Systems)", "INR (Indian Rupee)", "100000049 (Talpa)", "1,650.00 "])
					.and
					.iCheckRenderedColumnTextOnNthRowOfTable(7, [2, 3, 4, 5, 7], ["HT-1007", "Notebooks (Computer Systems)", "INR (Indian Rupee)", "100000049 (Talpa)", "299.00 "])
					.and
					.iCheckTheRowSelectionInTheTable([
						{ Index: 3, Selected: true },
						{ Index: 5, Selected: true },
						{ Index: 6, Selected: true }
					]);
				Then.iTeardownMyApp();
			});

			opaTest("Check the warning dialog - Object opened in edit mode is part of the selection", function (Given, When, Then) {
				Given.iStartMyAppInDemokit("sttaproducts", "manifestDynamicHeaderInFCL");
				When.onTheGenericListReport
					.iExecuteTheSearch()
					.and
					.iNavigateFromListItemByLineNo(2)
					.and
					.iSelectListItemsByLineNo([2, 3, 5], true);
				Then.onTheGenericFCLApp
					.iCheckFCLLayout("TwoColumnsMidExpanded");
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
					.iVerifyTheMultiEditDialogAttributesAreCorrect("Edit 2 Products", ["ProductForEdit", "ProductCategory", "Currency", "Supplier", "Price"]);
				When.onTheListReportPage
					.iSetSmartMultiEditField([
						{ Choice: "Keep", PropertyName: "ProductForEdit" },
						{ Choice: "Replace", PropertyName: "ProductCategory", Value: "PDAs & Organizers" },
						{ Choice: "Replace", PropertyName: "Currency", Value: "INR" },
						{ Choice: "Replace", PropertyName: "Supplier", Value: "100000050" },
						{ Choice: "Keep", PropertyName: "Price" }
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
					.theObjectPageDataFieldHasTheCorrectValue({ Field: "ProductForEdit", Value: "HT-1001" })
					.and
					.theObjectPageDataFieldHasTheCorrectValue({ Field: "ProductCategory", Value: "Notebooks" })
					.and
					.theObjectPageDataFieldHasTheCorrectValue({ Field: "Supplier", Value: "100000047" })
					.and
					.theObjectPageDataFieldHasTheCorrectValue({ Field: "Price", Value: "1299.00" });
				Then.onTheListReportPage
					.iCheckRenderedColumnTextOnNthRowOfTable(3, [2, 3, 4, 5, 7], ["HT-1001", "Notebooks (Computer Systems)", "EUR (European Euro)", "100000047 (Becker Berlin)", "1,299.00 "])
					.and
					.iCheckRenderedColumnTextOnNthRowOfTable(4, [2, 3, 4, 5, 7], ["HT-1000", "PDAs & Organizers (Computer Components)", "INR (Indian Rupee)", "100000050 (Panorama Studios)", "956.00 "])
					.and
					.iCheckRenderedColumnTextOnNthRowOfTable(6, [2, 3, 4, 5, 7], ["HT-1003", "PDAs & Organizers (Computer Components)", "INR (Indian Rupee)", "100000050 (Panorama Studios)", "1,650.00 "])
					.and
					.iCheckTheRowSelectionInTheTable([
						{ Index: 2, Selected: true },
						{ Index: 3, Selected: true },
						{ Index: 5, Selected: true }
					]);
				Then.iTeardownMyApp();
			});
		}
	}
);
