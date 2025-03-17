sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Responsive Table Inline Row Creation");

		opaTest("Checking if the inline row is getting created  in responsive Table", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordernoext#//C_STTA_SalesOrder_WD_20(SalesOrder='500000003',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)", "manifestInlineRow");
			When.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "C_STTA_SalesOrder_WD_20")
				.and
				.iRemoveAllTheCustomVariantsForTheTable("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table")
			Then.onTheObjectPage
				.iCheckNumberOfItemsInTable(5, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000003");
			When.onTheGenericObjectPage
				.iClickTheEditButton();
			Then.onTheObjectPage
				.iCheckNumberOfItemsInTable(6, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
				.and
				.iShouldSeeTheInactiveRowOnTheTable(1, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
			Then.onTheObjectPage
				.iCheckControlPropertiesById("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-btnPaste", { "icon": "sap-icon://paste", "visible": true, "enabled": true })
				.and
				.iCheckControlPropertiesById("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-btnExcelExport", { "icon": "sap-icon://excel-attachment", "visible": true, "enabled": true })
				.and
				.iCheckControlPropertiesById("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-btnPersonalisation", { "icon": "sap-icon://action-settings", "visible": true, "enabled": true });

		});

		opaTest("Checking the visibility of actions in toolbar for the inactive row", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectListItemsByLineNo([0], true, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
			Then.onTheGenericObjectPage
				.theButtonWithIdIsEnabled("to_Item::com.sap.vocabularies.UI.v1.LineItem::action::SalesOrder::MultiViews", false);
			Then.onTheObjectPage
				.iCheckTableToolbarControlProperty({ "deleteEntry": [true, false] }, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");

		});		

		opaTest("Checking that the transient rows are not visible when the dynamic insert restriction path resolves to false value", function (Given, When, Then) {
			When.onTheObjectPage
				.iClickOnCheckboxWithText("","NavResTest::Field-cBoxBool");
			Then.onTheObjectPage
				.iCheckNumberOfItemsInTable(5, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
		});

		opaTest("Checking that the transient rows are visible when the dynamic insert restriction path resolves to true value", function (Given, When, Then) {
			When.onTheObjectPage
				.iClickOnCheckboxWithText("","NavResTest::Field-cBoxBool");
			Then.onTheObjectPage
				.iCheckNumberOfItemsInTable(6, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("Check for the error message for the missing required fields during creation of new row", function (Given, When, Then) {
			When.onTheObjectPage
				.iEnterValuesInCellsOnNthRowOfTable(1, [1], ["1000"], "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
			Then.onTheObjectPage
				.iCheckMessageStripValueOnTable("to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable", "Error", "The table contains errors. Opportunity Item ID is a required value but is not displayed in the table. Please add it in the view settings.")
				.and
				.iCheckControlPropertiesById("showMessages", { "visible": true, "enabled": true, "text": "2", "type": "Negative", "icon": "sap-icon://message-error" });
			When.onTheObjectPage
				.iToggleMessagePopoverDialog();
			Then.onTheObjectPage
				.iShouldSeeTheMessagesInsideTheMessagePopUpOrMessagePopOver("sap.m.Popover", [{ "type": "Error", "title": "Enter a value for CurrencyCode.", "subTitle": "Row: 1000", "description": "", "groupName": "Sales Order Items" },
																								{ "type": "Error", "title": "Enter a value for Opportunity Item ID.", "subTitle": "Row: 1000", "description": "", "groupName": "Sales Order Items" }]);
		});

		opaTest("Add all the erroneous columns as visible columns and check the focus on the error fields on the table", function (Given, When, Then) {
			When.onTheObjectPage
				.iClickTheButtonOnTableToolBar("Settings", "to_Item::com.sap.vocabularies.UI.v1.LineItem::Table")
				.and
				.iAddColumnFromP13nDialog("Opportunity Item ID");
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("OK");
			When.onTheObjectPage
				.iClickOnNthMessageInMessagePopover(1);
			Then.onTheObjectPage
				.iCheckTheFocusOnNthColumnOnNthRowOfTable(1, 7, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
			When.onTheObjectPage
				.iClickOnNthMessageInMessagePopover(2);
			Then.onTheObjectPage
				.iCheckTheFocusOnNthColumnOnNthRowOfTable(1, 10, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("Click on Save button and check the message pop up", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonHavingLabel("Save");
			Then.onTheObjectPage
				.iShouldSeeTheMessagesInsideTheMessagePopUpOrMessagePopOver("sap.m.Dialog", [{ "type": "Error", "title": "Enter a value for CurrencyCode.", "subTitle": "Row: 1000", "description": "" },
																							{ "type": "Error", "title": "Enter a value for Opportunity Item ID.", "subTitle": "Row: 1000", "description": "" }]);
		});

		opaTest("Adding data to the inline row and check the visibility of actions in toolbar", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Cancel");
			When.onTheObjectPage
				.iEnterValuesInCellsOnNthRowOfTable(1, [7, 10], ["EUR", "10"], "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
			Then.onTheObjectPage
				.iCheckNumberOfItemsInTable(7, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
				.and
				.iShouldSeeTheInactiveRowOnTheTable(1, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
			When.onTheGenericObjectPage
				.iSelectListItemsByLineNo([0], true, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
			Then.onTheObjectPage
				.iCheckControlPropertiesById("to_Item::com.sap.vocabularies.UI.v1.LineItem::action::SalesOrder::MultiViews", { "enabled": true })
				.and
				.iCheckTableToolbarControlProperty({ "deleteEntry": [true, true] }, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
			Then.iTeardownMyApp();
		});
	}
);
