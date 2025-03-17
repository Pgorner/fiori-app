sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Actions Journey");

		opaTest("Starting the app and loading data", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordernoext");
			When.onTheGenericListReport
				.iExecuteTheSearch();

			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(20);

		});

		opaTest("Create: Click the Create button", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheCreateButton();
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("4711")
				.and
				.theObjectPageIsInEditMode()
				.and
				.iShouldSeeTheButtonWithLabel("Discard Draft");
		});

		opaTest("Check the focus is set on the control passed from 'focusOnEditExtension' extension", function (Given, When, Then) {
			Then.onTheGenericObjectPage
				.iExpectFocusSetOnControlById("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table::Toolbar::SearchField");
		});

		opaTest("Check for client side validation for value help entity set", function (Given, When, Then) {
			When.onTheObjectPage
				.iEnterValueInField("1234", "C_STTA_SalesOrder_WD_20--com.sap.vocabularies.UI.v1.FieldGroup::Amount::CurrencyCode::Field-input");
			Then.onTheObjectPage
				.iCheckControlPropertiesById("showMessages", { "visible": true, "enabled": true, "text": "1", "type": "Negative", "icon": "sap-icon://message-error" })
				.and
				.iToggleMessagePopoverDialog()
				.and
				.iShouldSeeTheMessagesInsideTheMessagePopUpOrMessagePopOver("sap.m.Popover", [{ "type": "Error", "title": "Value does not exist.", "subTitle": "ISO Currency Code", "description": "", "groupName": "General Information" }]);
			When.onTheGenericObjectPage
				.iClickTheLink("Value does not exist.");
			Then.onTheGenericObjectPage
				.iExpectFocusSetOnControlById("com.sap.vocabularies.UI.v1.FieldGroup::Amount::CurrencyCode::Field-input");
		});

		opaTest("Check for discard draft popup when user navigates away from draft OP without making any changes", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithIcon("sap-icon://nav-back");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithTitle("Warning")
				.and
				.iShouldSeeTheDialogWithContent("You haven't created this object yet.\nWhat would you like to do?");
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Cancel");
			Then.onTheGenericObjectPage
				.theObjectPageIsInEditMode();
		});

		opaTest("The table and search field is rendered correctly and i check no data text on both the tables present in OP", function(Given, When, Then) {
			When.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "C_STTA_SalesOrder_WD_20");
			Then.onTheObjectPage
				.iCheckTableProperties({"visible": true, "noDataText": "No items available."}, "responsiveTable", "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
				.and
				.iCheckTableProperties({"visible": true, "noDataText": "No contacts found."}, "responsiveTable", "to_BPAContact::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
				.and
				.iCheckTableToolbarControlProperty({"SearchField": [true, true]}, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("Discard Creation: Click the Discard button", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("discard");
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("DiscardDraftConfirmButton");
			Then.onTheGenericListReport
				.theResultListIsVisible();
		});

		opaTest("Navigate to the ObjectPage and check the boundary of the secondary buttons in OP header", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000000"});
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000000");
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.m.Avatar", {"visible": true, "src": "sap-icon://accept", "displayShape": "Square"});
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.m.Button", {"text": "Delete", "type": "Ghost"});
		});

		opaTest("Checking the newly created record appearing at the top of the object page table", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheEditButton();
			When.onTheObjectPage
				.iClickTheButtonOnTableToolBar("Create", "to_Item::com.sap.vocabularies.UI.v1.LineItem::Table");
			When.onTheObjectPage
				.iClickTheControlByControlType("sap.m.CustomListItem", { "type": "Active" });
			Then.onTheObjectPage
				.iCheckNumberOfItemsInTable(11, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
			Then.onTheListReportPage
				.iCheckThePropertiesOfNthRowOfTable(1, { "highlight": "Information" }, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("discard")
				.and
				.iClickTheButtonWithId("DiscardDraftConfirmButton");
			Then.onTheGenericObjectPage
				.theObjectPageIsInDisplayMode();
		});

		opaTest("The Semantic actions are rendered correctly", function (Given, When, Then) {
			Then.onTheObjectPage
				.iCheckControlPropertiesById("action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrder_WD_20Setopportunityid", {"type": "Accept", "visible": true})
				.and
				.iCheckControlPropertiesById("edit", {"type": "Default", "visible": true});//Edit button is not Emphasized when criticality is defined for another action
		});

		opaTest("The table and search field is rendered correctly on object page", function(Given, When, Then) {
			When.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "C_STTA_SalesOrder_WD_20");
			Then.onTheObjectPage
				.iCheckTableProperties({"visible": true}, "responsiveTable", "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
				.and
				.iCheckTableToolbarControlProperty({"SearchField": [true, true]}, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("I fire the search and check the no-data text", function(Given, When, Then) {
			When.onTheObjectPage
				.iSearchInTableToolbarOrSearchInputField("Some random text which give 0 result", "to_Item::com.sap.vocabularies.UI.v1.LineItem::Table::Toolbar::SearchField");
			Then.onTheObjectPage
				.iCheckTableProperties({"visible": true, "noDataText": "No items available. Try adjusting the search or filter parameters."}, "responsiveTable", "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("I clear the search ", function(Given, When, Then) {
			When.onTheObjectPage
				.iSearchInTableToolbarOrSearchInputField("", "to_Item::com.sap.vocabularies.UI.v1.LineItem::Table::Toolbar::SearchField");
			Then.onTheObjectPage
				.iCheckTableProperties({"visible": true}, "responsiveTable", "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("I apply filters on both the tables present in object page and check no data text", function(Given, When, Then) {
			When.onTheObjectPage
				.iApplyFiltersOnOPTable()
				.and
				.iApplyFiltersOnOPTable('to_BPAContact');
			Then.onTheObjectPage
				.iCheckTableProperties({"visible": true, "noDataText": "No items available. Try adjusting the search or filter parameters."}, "responsiveTable", "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
				.and
				.iCheckTableProperties({"visible": true, "noDataText": "No contacts present. Adjust filters."}, "responsiveTable", "to_BPAContact::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("Press the Share button", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithIcon("sap-icon://action");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000000");
		});

		opaTest("Navigate back to the ListReport", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateBack();
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(20);
		});

		opaTest("Checking the the return to draft/display saved version when the showDraftToggle is false", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({ Field: "SalesOrder", Value: "500000000" });
			When.onTheGenericObjectPage
				.iClickTheEditButton();
			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithLabel("Display Saved Version")
			Then.onTheObjectPage
				.iCheckControlPropertiesById("template:::ObjectPageAction:::DisplayActiveVersion", { "Visible": true, "enabled": true });
		});

		opaTest("Check the focus is set on the control passed from 'focusOnEditExtension' extension", function (Given, When, Then) {
			Then.onTheGenericObjectPage
				.iExpectFocusSetOnControlById("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table::Toolbar::SearchField");
		});

		opaTest("Navigate back to the list report by clicking on save", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSaveTheDraft()
				.and
				.iNavigateBack();
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(20);
		});

		opaTest("Navigate to the ObjectPage of a Draft item", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000005"});
			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithIcon("sap-icon://user-edit");
		});

		opaTest("Press the Draft-Info icon", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithIcon("sap-icon://user-edit");
			Then.onTheGenericObjectPage
				.iShouldSeeThePopoverWithTitle("Unsaved Changes");
		});

		opaTest("Navigate back to the ListReport", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateBack();
			Then.onTheGenericListReport
				.theResultListIsVisible();
		});

		opaTest("Navigate to the ObjectPage to check Transient Message", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000005"});
			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithId("action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrder_WD_20Setopportunityid");
		});

		opaTest("Transient Message Dialog rendering TC-1", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheEditButton();
			When.onTheObjectPage
				.iAddMessagesToMessageDialogOrPopOver("sap.m.Dialog", [{ "msg": "New Error Message", "description": "Error Message", "msgType": "Error", "persistent": true },
												{ "msg": "New Warning Message", "description": "Warning Message", "msgType": "Warning", "persistent": true} ,
												{ "msg": "New Information Message", "description": "Information Message", "msgType": "Information", "persistent": true }]);
			Then.onTheObjectPage
				.iCheckMessageCountInTransientMessagesDialog(4);
		});

		opaTest("Transient Message Dialog rendering TC-2", function (Given, When, Then) {
			When.onTheObjectPage
				.iClickTheMessageListItem("New Error Message");
			Then.onTheObjectPage
				.iCheckTheMessagePropertyInDetailedMessagesPage("New Error Message","Error Message","error");
		});

		opaTest("Transient Message Dialog rendering TC-3", function (Given, When, Then) {
			When.onTheObjectPage
				.iClickOnPopoverButton("nav-back");
			Then.onTheObjectPage
				.iCheckMessageCountInTransientMessagesDialog(4);
		});

		opaTest("Transient Message Dialog rendering TC-4", function (Given, When, Then) {
			When.onTheObjectPage
				.iClickOnPopoverButton("alert");
			Then.onTheObjectPage
				.iCheckMessageCountInTransientMessagesDialog(4);
		});

		opaTest("Transient Message Dialog rendering TC-5", function (Given, When, Then) {
			When.onTheObjectPage
				.iClickTheMessageListItem("New Warning Message");
			Then.onTheObjectPage
				.iCheckTheMessagePropertyInDetailedMessagesPage("New Warning Message","Warning Message","alert");
		});

		opaTest("Press the Set Opportunity action button", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Close")
				.and
				.iClickTheButtonWithId("action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrder_WD_20Setopportunityid");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithTitle("Set Opportunity 'ID");
		});

		opaTest("Cancel the dialog and navigate back to LR page", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Cancel");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000005")
				.and
				.iShouldSeeTheButtonWithIcon("sap-icon://nav-back");
			When.onTheGenericObjectPage
				.iNavigateBack();
		});

		opaTest("Navigate to OP of draft item and check for discard draft confirmation dialog during back navigation", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000001"});
			When.onTheGenericObjectPage
				.iSetTheObjectPageDataField("GeneralInformation", "OpportunityID", "0002")
				.and
				.iClickTheButtonWithIcon("sap-icon://nav-back");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithTitle("Warning")
				.and
				.iShouldSeeTheDialogWithContent("You've made changes to this object.\nWhat would you like to do?");
			Then.onTheObjectPage
				.iCheckTheOptionInTheDiscardDraftPopUp("Save", "Apply changes to the saved version.", true)
				.and
				.iCheckTheOptionInTheDiscardDraftPopUp("Keep Draft", "Changes are only visible to you and have no effect on dependent processes and functions.", false)
				.and
				.iCheckTheOptionInTheDiscardDraftPopUp("Discard Draft", "All changes will be lost.", false);
		});

		opaTest("Select Keep Draft Option from the dialog and proceed with Saving Draft", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectTheOptionFromDiscardDraftPopUp("Keep Draft")
				.and
				.iClickTheButtonOnTheDialog("OK");
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListFieldHasTheCorrectValue({Line: 1, Field: "OpportunityID", Value: "0002"})
				.and
				.theResultListFieldHasTheCorrectObjectMarkerEditingStatus({
					Line: 1,
					Field: "SalesOrder",
					Value: "Draft"
				});
		});

		opaTest("Navigate to OP of draft item and check for discard draft confirmation dialog during back navigation - Continue with Save", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000001"});
			When.onTheGenericObjectPage
				.iClickTheButtonWithIcon("sap-icon://nav-back");
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("OK");
			Then.onTheGenericListReport
				.iShouldSeeTheMessageToastWithText("Your changes have been saved.")
				.and
				.theResultListIsVisible()
				.and
				.theResultListFieldHasTheCorrectValue({Line: 1, Field: "OpportunityID", Value: "0002"})
				.and
				.theResultListFieldHasTheCorrectObjectMarkerEditingStatus({
					Line: 1,
					Field: "SalesOrder",
					Value: "Flagged"
				});
		});

		opaTest("Create Object and check for discard draft confirmation dialog during back navigation", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheCreateButton();
			When.onTheGenericObjectPage
				.iSetTheObjectPageDataField("GeneralInformation", "OpportunityID", "0001")
				.and
				.iClickTheButtonWithIcon("sap-icon://nav-back");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithTitle("Warning")
				.and
				.iShouldSeeTheDialogWithContent("You haven't created this object yet.\nWhat would you like to do?");
			Then.onTheObjectPage
				.iCheckTheOptionInTheDiscardDraftPopUp("Create", "Create the object.", true)
				.and
				.iCheckTheOptionInTheDiscardDraftPopUp("Keep Draft", "Changes are only visible to you and have no effect on dependent processes and functions.", false)
				.and
				.iCheckTheOptionInTheDiscardDraftPopUp("Discard Draft", "All changes will be lost.", false);
		});

		opaTest("Select Create Option from the dialog and proceed with Object creation", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("OK");
			Then.onTheGenericListReport
				.iShouldSeeTheMessageToastWithText("Object was created.")
				.and
				.theListReportPageIsVisible()
				.and
				.theAvailableNumberOfItemsIsCorrect(21)
				.and
				.theResultListFieldHasTheCorrectValue({ Line: 0, Field: "SalesOrder", Value: "4711" })
				.and
				.theResultListFieldHasTheCorrectValue({ Line: 0, Field: "OpportunityID", Value: "0001" })
				.and
				.theResultListFieldHasTheCorrectObjectMarkerEditingStatus({
					Line: 0,
					Field: "SalesOrder",
					Value: "Flagged"
				});
			Then.iTeardownMyApp();
		});
	}
);
