sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Sales Order No Extensions - List Report");

		opaTest("Starting the app and loading data", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordernoext");
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(20)
				.and
				.theResultListFieldHasTheCorrectValue({Line: 2, Field: "TaxAmount", Value: "899.08"})
				.and
				.theResultListFieldHasTheCorrectValue({Line: 11, Field: "CurrencyCode", Value: "USD"});
			Then.onTheListReportPage
				.iCheckRenderedColumnTextOnNthRowOfTable(12, [1, 7], ["500000011", "United States Dollar (USD)"]);
		});


		opaTest("Checking the 412 confirmation pop up for function import action", function (Given, When, Then) {
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(20);
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([12]);
			When.onTheListReportPage
				.iClickTheControlWithId("Setopportunityid");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Set Opportunity 'ID");
			When.onTheListReportPage
				.iEnterValueInField("123", "C_STTA_SalesOrder_WD_20Setopportunityid-Opportunity-input");
			When.onTheListReportPage
				.iClickTheButtonOnTheDialog("Set Opportunity 'ID");
			When.onTheListReportPage
				.iShouldSeeTheMessagesInsideTheMessagePopUpOrMessagePopOver("sap.m.Dialog", [{ "type": "Warning", "title": "412 code sent Warning Transient Message", "subTitle": "", "description": "" }]);
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Set Opportunity 'ID");
		});

		opaTest("Checking the 412 confirmation pop up after clicking on delete for a record", function (Given, When, Then) {
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(20);
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([12]);
			When.onTheGenericListReport
				.iClickTheButtonWithId("deleteEntry");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Delete");
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Delete");
			When.onTheListReportPage
				.iShouldSeeTheMessagesInsideTheMessagePopUpOrMessagePopOver("sap.m.Dialog", [{ "type": "Warning", "title": "412 code sent Warning Transient Message", "subTitle": "", "description": "" }]);
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Delete");
			Then.onTheGenericListReport
				.theResultListIsVisible();
		});

		opaTest("Parameter-Dialog - Select a draft item and press the action", function (Given, When, Then) {
			When.onTheListReportPage
				.iSelectAnItemOnLRTableWithStatus("Draft")
				.and
				.iClickTheControlWithId("Setopportunityid");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Set Opportunity 'ID");
		});

		opaTest("Parameter-Dialog - Trigger the action from dialog without entering the mandatory field value", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Set Opportunity 'ID");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Set Opportunity 'ID");
			Then.onTheListReportPage
				.iCheckControlPropertiesById("Setopportunityid-Opportunity", { "visible": true, "valueState": "Error", "valueStateText": "Opportunity is a required field." });
		});

		opaTest("Parameter-Dialog - Wait for the dialog and press the cancel button", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Cancel");
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(19);
		});

		opaTest("Parameter-Dialog - Select multiple items and press the action", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([7,8]);
			When.onTheListReportPage
				.iClickTheControlWithId("Setopportunityid");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Set Opportunity 'ID");
		});

		opaTest("Parameter-Dialog - Wait for the dialog and press the cancel button", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Cancel");
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(19);
		});

		opaTest("ApplicablePath - Select 3rd sales order and check button enablement", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([2]);
			Then.onTheGenericListReport
				.theResultListFieldHasTheCorrectValue({Line:2, Field:"EnabledStatus", Value:false})
				.and
				.theButtonWithIdIsEnabled("action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrder_WD_20Setenabledstatus")
				.and
				.theOverflowToolBarButtonIsEnabled("Disable", false);
		});

		opaTest("ApplicablePath - Press Enable and check buttons and field", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonWithId("action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrder_WD_20Setenabledstatus");
			Then.onTheGenericListReport
				.theResultListFieldHasTheCorrectValue({Line:2, Field:"EnabledStatus", Value:true})
				.and
				.theOverflowToolBarButtonIsEnabled("Enable", false)
				.and
				.theButtonWithIdIsEnabled("action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrder_WD_20Setdisabledstatus");
		});

		opaTest("Button is enabled without selection", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([2], false);
			Then.onTheGenericListReport
				.theButtonWithIdIsEnabled("action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrder_WD_20Create_simple")
				.and
				.theButtonWithIdIsEnabled("action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrder_WD_20Create_simple_param");
		});

		opaTest("Context independent action is triggered without selection", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonWithId("action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrder_WD_20Create_simple");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithContent("FI Action without parameter triggered");
		});

		opaTest("Context independent action with parameter is triggered without selection", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("OK")
				.and
				.iClickTheButtonWithId("action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrder_WD_20Create_simple_param");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Create w/o Context_with_param");
			Then.onTheListReportPage
				.iCheckControlPropertiesByControlType("sap.ui.comp.smartfield.SmartField", {"visible": true, "textLabel": "Test"});
			When.onTheListReportPage
				.iEnterValueInField("Hello", "C_STTA_SalesOrder_WD_20Create_simple_param-Test");
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Create w/o Context_with_param");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithContent("FI Action with parameter triggered");
		});

		opaTest("Context independent determining action is triggered without selection", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("OK")
				.and
				.iClickTheButtonWithId("action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrder_WD_20Create_simple::Determining");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithContent("FI Action without parameter triggered");
		});

		opaTest("Close dialog", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("OK");
		});

		opaTest("Select an item, then check if button is enabled", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSelectListItemsByLineNo(1);
			Then.onTheGenericListReport
				.theButtonWithIdIsEnabled("action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrder_WD_20Create_simple")
		});

		opaTest("Context independent action is triggered with selection", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonWithId("action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrder_WD_20Create_simple");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithContent("FI Action without parameter triggered");
		});

		opaTest("Context independent action with parameter is triggered with selection", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("OK")
				.and
				.iClickTheButtonWithId("action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrder_WD_20Create_simple_param");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Create w/o Context_with_param");
			Then.onTheListReportPage
				.iCheckControlPropertiesByControlType("sap.ui.comp.smartfield.SmartField", {"visible": true, "textLabel": "Test"});
			When.onTheListReportPage
				.iEnterValueInField("Hello", "C_STTA_SalesOrder_WD_20Create_simple_param-Test");
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Create w/o Context_with_param");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithContent("FI Action with parameter triggered");
		});

		opaTest("Context independent determining action is triggered with selection", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("OK")
				.and
				.iClickTheButtonWithId("action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrder_WD_20Create_simple::Determining");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithContent("FI Action without parameter triggered");
		});

		opaTest("Close dialog", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("OK");
		});

		opaTest("List Report Table Group By 'Sales Order Id'", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickTheButtonOnTableToolBar("Settings", "listReport")
				.and
				.iClickTheControlByControlType("sap.m.IconTabFilter", { "text": "Group" });
			When.onTheGenericListReport
				.iChoosetheItemInComboBox("Sales Order ID")
				.and
				.iClickTheButtonHavingLabel("OK")
				.and
				.iExecuteTheSearch();
			Then.onTheListReportPage
				.iCheckGroupHeaderTitleOnTable("Sales Order ID: 500000004", 5);
		});

		opaTest("List Report Table Group By 'Created At'", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickTheButtonOnTableToolBar("Settings", "listReport")
				.and
				.iClickTheControlByControlType("sap.m.IconTabFilter", { "text": "Group" });
			When.onTheGenericListReport
				.iChoosetheItemInComboBox("Created At")
				.and
				.iClickTheButtonHavingLabel("OK")
				.and
				.iExecuteTheSearch();
			Then.onTheListReportPage
				.iCheckGroupHeaderTitleOnTable("Created At:", 1);
		});

		opaTest("List Report Table Group By '(None)'", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickTheButtonOnTableToolBar("Settings", "listReport")
				.and
				.iClickTheControlByControlType("sap.m.IconTabFilter", { "text": "Group" });
			When.onTheGenericListReport
				.iClickTheButtonWithIcon("sap-icon://decline")
				.and
				.iClickTheButtonHavingLabel("OK")
				.and
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListIsVisible();
			Then.iTeardownMyApp();
		});
	}
);
