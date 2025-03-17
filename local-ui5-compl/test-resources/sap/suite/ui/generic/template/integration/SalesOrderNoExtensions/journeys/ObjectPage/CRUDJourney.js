sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("CRUD Journey");

		opaTest("Create: Starting the app and loading data", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordernoext");
			When.onTheGenericListReport
				.iChoosetheItemInSelect("Unsaved Changes by Another User", "Editing Status")
				.and
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(19)
				.and
				.theResultListFieldHasTheCorrectValue({Line:1, Field:"TaxAmount", Value:"899.08"});
		});

		opaTest("Cancel Edit: Click the Edit button", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000000"});
			When.onTheGenericObjectPage
				.iClickTheEditButton();
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000000")
				.and
				.theObjectPageIsInEditMode();
		});

		opaTest("Checking the focus sets on the first editable element of the table when clicked on create", function (Given, When, Then) {
			When.onTheObjectPage
				.iClickTheButtonOnTableToolBar("Create", "to_Item::com.sap.vocabularies.UI.v1.LineItem::Table");
			Then.onTheObjectPage
				.iExpectFocusOnNthCellOfNthRowOfTheTable(0, 0, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("Cancel Edit: Click the Cancel button", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iCancelTheDraft(false)
				.and
				.iClickTheButtonWithId("back");
			Then.onTheGenericListReport
				.theResultListIsVisible();
		});

		opaTest("Reloading data", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSetTheFilter({Field:"editStateFilter", Value:0})
				.and
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(20)
				.and
				.theResultListFieldHasTheCorrectValue({Line:10, Field:"GrossAmount", Value:"827.95"});
		});

		opaTest("ApplyButton: Open ObjectPage with draft Sales Order", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000001"});
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000001");
		});

		opaTest("ApplyButton: Navigate to the Sales Order Item #50 and check the apply button", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateFromObjectPageTableByFieldValue("to_Item", {Field:"SalesOrderItem", Value:"50"});
			Then.onTheGenericObjectPage
				.iShouldSeeTheSections(["General Information","Schedule Lines"])
				.and
				.theObjectPageHeaderTitleIsCorrect("50")
				.and
				.iShouldSeeTheButtonWithLabel("Apply");
		});

		opaTest("ApplyButton: Navigate back to the Object Page", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonHavingLabel("Apply")
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000001");
		});

		opaTest("Check for discard draft confirmation popup when user navigates away from OP to LR", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("back");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithTitle("Warning")
				.and
				.iShouldSeeTheDialogWithContent("You've made changes to this object.\nWhat would you like to do?");
			When.onTheGenericObjectPage
				.iSelectTheOptionFromDiscardDraftPopUp("Keep Draft")
				.and
				.iClickTheButtonOnTheDialog("OK");
			Then.onTheGenericListReport
				.theResultListIsVisible();
		});

		//Check IncludeItemInSelection Event on LR
		opaTest("IncludeItemInSelection: Check in LR that list item is Selected when user performs forward/backward navigation",function(Given, When, Then){
			When.onTheGenericListReport
				.iSetThePropertyInTable("responsiveTable", "includeItemInSelection", true)
				.and
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000006"});
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("back");
			Then.onTheGenericListReport
				.theListItemIsSelected("responsiveTable", 6);
		});

		//Check IncludeItemInSelection Event on OP
		opaTest("IncludeItemInSelection: Check in OP that list item is Selected when user performs forward/backward navigation",function(Given, When, Then){
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000008"});
			When.onTheGenericObjectPage
				.iClickTheEditButton()
				.and
				.iSetThePropertyInTable("to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable", "includeItemInSelection", true)
				.and
				.iNavigateFromOPListItemByFieldValue({Field:"SalesOrderItem", Value:"60"})
				.and
				.iClickTheButtonWithId("back", "C_STTA_SalesOrderItem_WD_20")
				.and
				.iSelectTheOptionFromDiscardDraftPopUp("Keep Draft")
				.and
				.iClickTheButtonOnTheDialog("OK");
			Then.onTheGenericObjectPage
				.theListItemIsSelected("to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable", 0);
		});

		//Delete on Object Page
		opaTest("Delete: Check Sales Order Id on the OP Delete Confirmation Dialog",function(Given, When, Then){	
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("back")
				.and
				.iSelectTheOptionFromDiscardDraftPopUp("Keep Draft")
				.and
				.iClickTheButtonOnTheDialog("OK");
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000006"})
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("delete");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("Delete object 500000006?");
		});

		//OPA Test to check InlineCreate entry
		opaTest("InlineCreate: Check new entry in table", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Cancel")
				.and
				.iClickTheEditButton()
				.and
				.iClickTheButtonWithId("to_Item::com.sap.vocabularies.UI.v1.LineItem::addEntry");

			Then.onTheObjectPage
				.iCheckNumberOfItemsInTable(4, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("CreateDisabled: Check availability of create button in toolbar", function(Given, When, Then) {
			Then.onTheGenericObjectPage
				.iShouldNotSeeTheButtonWithIdInToolbar("to_BPAContact::com.sap.vocabularies.UI.v1.LineItem::Table::Toolbar","to_BPAContact::com.sap.vocabularies.UI.v1.LineItem::addEntry");
		});

		// Delete on SubObjectPage workflow
		opaTest("Delete: Select a SalesOrder and navigate to ObjectPage", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("back")
				.and
				.iSelectTheOptionFromDiscardDraftPopUp("Keep Draft")
				.and	
				.iClickTheButtonOnTheDialog("OK");
			When.onTheGenericListReport
				.iNavigateFromListItemByLineNo(1);
			When.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "C_STTA_SalesOrder_WD_20");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000001")
				.and
				.iShouldSeeTheSections(["General Information","Sales Order Items"]);
		});

		opaTest("Delete: The navigation from the Object Page to the Sub Object Page is correct", function(Given, When, Then) {
			When.onTheObjectPage
				.iClickTheItemInResponsiveTable(1);
			Then.onTheSubObjectPage
				.iCheckObjectPageEntitySet("C_STTA_SalesOrderItem_WD_20")
				.and
				.iCheckControlPropertiesById("footerObjectPageBackTo", {"visible": true, "enabled": true});
		});

		opaTest("Delete: The navigation from the Sub Object Page to the item object page is correct", function(Given, When, Then) {
			When.onTheObjectPage
				.iClickTheItemInResponsiveTable(0);
			Then.onTheSubObjectPage
				.iCheckObjectPageEntitySet("C_STTA_SalesOrderItemSL_WD_20")
				.and
				.iCheckControlPropertiesById("footerObjectPageBackTo", {"visible": true, "enabled": true})
				.and
				.iCheckControlPropertiesById("C_STTA_SalesOrderItemSL_WD_20--delete", {"visible": true, "enabled": true});
		});

		opaTest("Delete: Press delete button in item object page", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("delete", "C_STTA_SalesOrderItemSL_WD_20");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("Delete item 1?");
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Delete");
			Then.onTheGenericObjectPage
				.iShouldSeeTheMessageToastWithText("Item deleted")
				.and
				.theObjectPageIsInEditMode();
		});

		opaTest("Wait for sub object page to load & Check for Delete button in Sub Object Page", function (Given,When, Then) {
			When.onTheSubObjectPage
				.iWaitForThePageToLoad("ObjectPage", "C_STTA_SalesOrderItem_WD_20");
			Then.onTheSubObjectPage
				.iCheckControlPropertiesById("C_STTA_SalesOrderItem_WD_20--delete", {"visible": true, "enabled": true});
		});

		opaTest("Delete: Press Delete button in Sub Object Page", function (Given,When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("delete", "C_STTA_SalesOrderItem_WD_20");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("Delete item 30?");
		});

		opaTest("Delete: Confirm Delete button on the dialog", function (Given,When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Delete");
			Then.onTheGenericObjectPage
				.iShouldSeeTheMessageToastWithText("Item deleted")
				.and
				.theObjectPageIsInEditMode();
			Then.onTheObjectPage
				.iCheckNumberOfItemsInTable(9, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("Delete: Back to the List Report", function (Given,When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("back")
				.and
				.iSelectTheOptionFromDiscardDraftPopUp("Keep Draft")
				.and
				.iClickTheButtonOnTheDialog("OK");
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(20);
		});

		// Edit/Save workflow
		opaTest("Edit/Save: Reloading the data", function (Given, When, Then) {
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(20);
			Then.onTheListReportPage
				.iCheckRenderedColumnTextOnNthRowOfTable(3, [7], ["European Euro (EUR)"]);
		});

		// navigate to object-page and enter Edit mode
		opaTest("Edit/Save: press Edit button", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000002"});
			When.onTheGenericObjectPage
				.iClickTheEditButton();
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000002")
				.and
				.theButtonWithLabelIsEnabled("Save", true);
			Then.onTheObjectPage
				.iCheckControlPropertiesById("com.sap.vocabularies.UI.v1.FieldGroup::Amount::CurrencyCode::Field-input", {"visible": true, "enabled": true, "value": "European Euro (EUR)"});
		});

		opaTest("Edit/Save: Change the ISO Currency Code", function (Given, When, Then) {			
			When.onTheGenericObjectPage
				.iSetTheObjectPageDataField("Amount","CurrencyCode","INR");
			Then.onTheGenericObjectPage
				.theObjectPageDataFieldHasTheCorrectValue({
					Field  : "SalesOrder",
					Value : "500000002"
				})
				.and
				.theObjectPageDataFieldHasTheCorrectValue({
					Field  : "CurrencyCode",
					Value : "INR"
				});
			Then.onTheObjectPage
				.iCheckControlPropertiesById("com.sap.vocabularies.UI.v1.FieldGroup::Amount::CurrencyCode::Field-input", {"visible": true, "enabled": true, "value": "Indian Rupee (INR)"});
		});

		opaTest("Edit/Save: Save the order and check the text of the currency", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("activate");
			Then.onTheObjectPage
				.iCheckControlPropertiesById("com.sap.vocabularies.UI.v1.FieldGroup::Amount::CurrencyCode::Field-text", {"visible": true, "text": "Indian Rupee (INR)"});
			Then.onTheGenericObjectPage
				.iShouldSeeTheDataField("CurrencyCode", {
					Enabled   : true,
					Editable  : true,
					Mandatory : true
				});
		});

		opaTest("Edit/Save: Navigate back to the ListReport", function (Given,When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("back");
			Then.onTheGenericListReport
				.theResultListIsVisible();
			Then.onTheListReportPage
				.iCheckRenderedColumnTextOnNthRowOfTable(12, [7], ["United States Dollar (USD)"]);
		});

		// Edit/Cancel workflow
		opaTest("Edit: Reloading the data", function (Given, When, Then) {
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(20)
				.and
				.theResultListFieldHasTheCorrectValue({Line:10, Field:"GrossAmount", Value:"827.95"});
		});

		opaTest("Edit: Navigate to the ObjectPage", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000010"});
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000010");
		});

		opaTest("Edit: Click the Edit button", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheEditButton();
			Then.onTheGenericObjectPage
				.theObjectPageIsInEditMode();
		});

		opaTest("Edit: Change the opportunity field in the ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSetTheObjectPageDataField("GeneralInformation","OpportunityID","ABC");
			Then.onTheGenericObjectPage
				.theObjectPageDataFieldHasTheCorrectValue({
					Field  : "SalesOrder",
					Value : "500000010"
				})
				.and
				.theObjectPageDataFieldHasTheCorrectValue({
					Field  : "OpportunityID",
					Value : "ABC"
				});
		});

		opaTest("OP Edit: Click the Cancel button and check data loss message", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("discard");
			Then.onTheObjectPage
				.iCheckTextInPopover("Discard all changes?");
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("DiscardDraftConfirmButton")
				.and			
				.iClickTheButtonWithId("back");
			Then.onTheGenericListReport
				.theResultListIsVisible();
		});

		opaTest("OP Create: Click the Cancel button and check data loss message", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheCreateButton();
			When.onTheGenericObjectPage
				.iSetTheInputFieldWithId("com.sap.vocabularies.UI.v1.FieldGroup::Amount::CurrencyCode::Field-input","EUR")
				.and
				.iClickTheButtonWithId("discard");	
			Then.onTheObjectPage
				.iCheckTextInPopover("Discard this draft?");
		});

		opaTest("OP Create: Check Create button and toast message after creation", function (Given, When, Then) {
			When.onTheObjectPage
				.iLookAtTheScreen();
			Then.onTheGenericObjectPage
				.theButtonWithLabelIsEnabled("Create", true);
			When.onTheGenericObjectPage
				.iSaveTheDraft();
			Then.onTheGenericObjectPage
				.iShouldSeeTheMessageToastWithText("Object was created.");
			Then.iTeardownMyApp();
		});
	}
);
