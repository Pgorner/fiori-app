sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Non Draft List Report with copy and multi edit functionality");

		opaTest("Starting the app and loading data, check MultiEdit Action Enablement", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("SalesOrder-nondraft#SalesOrder-nondraft", "manifestWithCopyBreakout");
			When.onTheListReportPage
				.iWaitForThePageToLoad("ListReport", "STTA_C_SO_SalesOrder_ND");
			Then.onTheListReportPage
				.theSmartTableIsVisible("listReport")
				.and
				.iCheckTableToolbarControlProperty({"MultiEdit": [true, false]});
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheListReportPage
				.theSmartTableIsVisible("STTA_C_SO_SalesOrder_ND--listReport");
		});

		opaTest("Check the MultiSelect and SelectAll button for the responsive table on LR", function (Given, When, Then) {
			Then.onTheListReportPage
				.iCheckTableProperties({"visible": true, "mode": "MultiSelect", "multiSelectMode": "SelectAll"});
		});

		opaTest("Check MultiEdit Action Enablement based on updatable and non updatable records selection", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([0, 1], true);
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({"MultiEdit": [true, true]});
			When.onTheListReportPage
				.iDeselectItemsInTheTable([0, 1]);
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({"MultiEdit": [true, false]});
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([3], true);
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({"MultiEdit": [true, false]});
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([0, 3], true); //Item at index 3 is not updatable
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({"MultiEdit": [true, true]});
		});

		opaTest("Check the warning dialog and click on Cancel- Non updatable record is selected and only one record is editable", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonWithId("template:::ListReportAction:::MultiEdit");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Warning")
				.and
				.iShouldSeeTheButtonsOnTheDialog(["Edit", "Cancel"])
				.and
				.iShouldSeeTheDialogWithContent("1 of 2 objects can't be edited. This can happen if someone is working on the object or if editing isn't allowed. \n\n Do you want to edit the remaining object?");
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Cancel");
			Then.onTheListReportPage
				.iCheckTheRowSelectionInTheTable([
					{Index:0,Selected:true},
					{Index:3,Selected:true}
				]);
		});

		opaTest("Check the warning dialog and continue to edit - Non updatable record is selected and Multiple records are editable", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([1], true)
				.and
				.iClickTheButtonWithId("template:::ListReportAction:::MultiEdit");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Warning")
				.and
				.iShouldSeeTheDialogWithContent("1 of 3 objects can't be edited. This can happen if someone is working on the object or if editing isn't allowed.\n\n Do you want to edit the remaining 2 objects?");
		});

		opaTest("Launch the Multi Edit Dialog and verify the Multi Edit Dialog and it's components", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Edit");
			Then.onTheListReportPage
				.iVerifyTheMultiEditDialogAttributesAreCorrect("Edit (2)",["BusinessPartnerID", "CurrencyCode", "GrossAmount", "NetAmount",
			"TaxAmount", "LifecycleStatus", "BillingStatus", "DeliveryStatus", "OpportunityID"]);
			Then.onTheGenericListReport
				.iShouldSeeTheButtonsOnTheDialog(["Save", "Cancel"]);
		});

		opaTest("Click on Cancel to close the multi edit dialog and check the row selection is retained", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Cancel");
			Then.onTheListReportPage
				.iCheckTheRowSelectionInTheTable([
					{Index:0,Selected:true},
					{Index:1,Selected:true},
					{Index:3,Selected:true}
				]);
		});

		opaTest("Click on save without making any change and check the toast message", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonWithId("template:::ListReportAction:::MultiEdit")
				.and
				.iClickTheButtonOnTheDialog("Edit")
				.and
				.iClickTheButtonOnTheDialog("Save");
			Then.onTheGenericListReport
				.iShouldSeeTheMessageToastWithText("You haven't made any changes.");
			Then.onTheListReportPage
				.iCheckTheRowSelectionInTheTable([
					{Index:0,Selected:true},
					{Index:1,Selected:true},
					{Index:3,Selected:true}
				]);
		});

		opaTest("Launch the Multi Edit Dialog and click on save without entering the mandatory fields", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonWithId("template:::ListReportAction:::MultiEdit")
				.and
				.iClickTheButtonOnTheDialog("Edit");
			When.onTheListReportPage
				.iSetSmartMultiEditField([
					{ Choice: "Replace", PropertyName: "TaxAmount", Value: "" }
				]);
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Save");
			Then.onTheListReportPage
				.iCheckControlPropertiesByControlType("sap.ui.comp.smartfield.SmartField", { "visible": true, "valueState": "Error", "valueStateText": "Tax Amount is a required field." });
		});

		opaTest("Change properties and validate save", function (Given, When, Then) {
			When.onTheListReportPage
				.iSetSmartMultiEditField([
					{Choice:"Replace",PropertyName:"BusinessPartnerID",Value:"100000011"}, 
					{Choice:"Keep",PropertyName:"CurrencyCode"}, 
					{Choice:"Index",PropertyName:"GrossAmount",Value:2}, 
					{Choice:"Index",PropertyName:"NetAmount",Value:3}, 
					{Choice:"Replace",PropertyName:"TaxAmount",Value:"30"},
					{Choice:"Clear",PropertyName:"LifecycleStatus"},
					{Choice:"Keep",PropertyName:"BillingStatus"},
					{Choice:"Replace",PropertyName:"DeliveryStatus",Value:"Initial"},
					{Choice:"Index",PropertyName:"OpportunityID",Value:4}
				]);
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Save");
			Then.onTheGenericListReport
				.iShouldSeeTheMessageToastWithText("Your changes have been saved.");
			Then.onTheListReportPage
				.iCheckRenderedColumnTextOnNthRowOfTable(1, [1, 2, 4, 5, 6, 7, 8, 9, 10, 11], 
					["500000010", "100000011", "Peseta (777)", "15,637.790", "12,271.000", "30.000", "New", "Initial (P)", "Initial", "TEST SHARON"]);

			Then.onTheListReportPage
				.iCheckRenderedColumnTextOnNthRowOfTable(2, [1,2,4,5,6,7,8,9,10,11], 
					["500000011", "100000011", "Peseta (E1E)", "15,637.790", "12,271.000", "30.000", "New", "Initial (P)", "Initial", "TEST SHARON"]);

			Then.onTheListReportPage
				.iCheckRenderedColumnTextOnNthRowOfTable(4, [1,2,4,5,6,7,8,9,10,11], 
					["500000013", "100000006", "Peseta (EUR)", "1,704.040", "1,431.970", "272.070", "New (C)", "Initial (P)", "Initial (D)", "123"]);
			Then.onTheListReportPage
				.iCheckTheRowSelectionInTheTable([
					{Index:0,Selected:true},
					{Index:1,Selected:true},
					{Index:3,Selected:true}
				]);
		});

		opaTest("Check for Delete Object Confirmation Pop up message", function (Given, When, Then) {
			When.onTheListReportPage
				.iDeselectItemsInTheTable([0, 1, 3]);
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([2])
				.and
				.iClickTheButtonWithId("deleteEntry");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithContent("Delete object 500000012?");
		});

		opaTest("Navigate to OP and check the MultiSelect and ClearAll button for the responsive table on OP", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Cancel")
				.and
				.iNavigateFromListItemByLineNo(2);
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000012");
			Then.onTheListReportPage
				.iCheckControlPropertiesById("to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable", { "visible": true, "mode": "MultiSelect", "multiSelectMode": "ClearAll" });
		});

		opaTest("Navigate back to LR and create a new object", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iCloseTheObjectPage();
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Create");
			When.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "STTA_C_SO_SalesOrder_ND");
			When.onTheGenericObjectPage
				.iSetTheObjectPageDataField("GeneralInformation", "BusinessPartnerID", "100000000")
				.and
				.iSetTheObjectPageDataField("GeneralInformation", "CurrencyCode", "EUR")
				.and
				.iSaveTheDraft(true);
			Then.onTheGenericObjectPage
				.iShouldSeeTheMessageToastWithText("Object was created.")
				.and
				.theObjectPageIsInDisplayMode();
		});

		opaTest("Click on back button and navigate back to LR", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheBackButtonOnFLP();
			Then.onTheGenericListReport
				.theListReportPageIsVisible()
				.and
				.theResultListIsVisible();
		});

		opaTest("Copy the third line", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([2], true);
			When.onTheGenericListReport
				.iClickTheButtonWithId("Copy");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("Unnamed Object");
			Then.onTheGenericObjectPage
				.theObjectPageDataFieldHasTheCorrectValue({
					Field: "BusinessPartnerID",
					Value: "100000005"
				})
				.and
				.iTeardownMyApp();
		});
	}
);
