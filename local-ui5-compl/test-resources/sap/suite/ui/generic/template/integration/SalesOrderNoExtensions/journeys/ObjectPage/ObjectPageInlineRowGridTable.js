sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module(" Grid table Inline Row Creation");

		opaTest("Checking if the inline row is getting created  in grid Table", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordernoext#//C_STTA_SalesOrder_WD_20(SalesOrder='500000009',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)", "manifestInlineRowGridTable");
			When.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "C_STTA_SalesOrder_WD_20");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000009");
			Then.onTheObjectPage
				.iCheckNumberOfItemsInTable(2, "to_Item::com.sap.vocabularies.UI.v1.LineItem::gridTable", "gridTable");
			When.onTheGenericObjectPage
				.iClickTheEditButton();
			Then.onTheObjectPage
				.iCheckNumberOfItemsInTable(3, "to_Item::com.sap.vocabularies.UI.v1.LineItem::gridTable", "gridTable")
				.and
				.iShouldSeeTheInactiveRowOnTheTable(1, "to_Item::com.sap.vocabularies.UI.v1.LineItem::gridTable");
			Then.onTheObjectPage
				.iCheckControlPropertiesById("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-btnPaste", { "icon": "sap-icon://paste", "visible": true, "enabled": true })
				.and
				.iCheckControlPropertiesById("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-btnExcelExport", { "icon": "sap-icon://excel-attachment", "visible": true, "enabled": true })
				.and
				.iCheckControlPropertiesById("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-btnPersonalisation", { "icon": "sap-icon://action-settings", "visible": true, "enabled": true });

		});

		opaTest("Checking the visibility of actions in toolbar for the inactive row", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectListItemsByLineNo([2], true, "to_Item::com.sap.vocabularies.UI.v1.LineItem::gridTable")
			Then.onTheGenericObjectPage
				.theButtonWithIdIsEnabled("to_Item::com.sap.vocabularies.UI.v1.LineItem::action::SalesOrder::MultiViews", false);
			Then.onTheObjectPage
				.iCheckTableToolbarControlProperty({ "deleteEntry": [true, false] }, "to_Item::com.sap.vocabularies.UI.v1.LineItem::gridTable", "gridTable");

		});
		opaTest("Checking if the create button is enabled and check clicking on create is not adding more inline rows", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("to_Item::com.sap.vocabularies.UI.v1.LineItem::addEntry");
			Then.onTheObjectPage
				.iCheckNumberOfItemsInTable(3, "to_Item::com.sap.vocabularies.UI.v1.LineItem::gridTable", "gridTable")
				.and
				.iShouldSeeTheInactiveRowOnTheTable(1, "to_Item::com.sap.vocabularies.UI.v1.LineItem::gridTable");
		});

		opaTest("Check for the error message for the missing required fields during creation of new row", function (Given, When, Then) {
			When.onTheObjectPage
				.iEnterValuesInCellsOnNthRowOfTable(3, [1], ["1000"], "to_Item::com.sap.vocabularies.UI.v1.LineItem::gridTable", "gridTable");
			Then.onTheObjectPage
				.iCheckMessageStripValueOnTable("to_Item::com.sap.vocabularies.UI.v1.LineItem::gridTable", "Error", "The table contains errors. Opportunity Item ID is a required value but is not displayed in the table. Please add it in the view settings.")
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
				.iCheckTheFocusOnNthColumnOnNthRowOfTable(3, 7, "to_Item::com.sap.vocabularies.UI.v1.LineItem::gridTable", "gridTable");
			When.onTheObjectPage
				.iClickOnNthMessageInMessagePopover(2);
			Then.onTheObjectPage
				.iCheckTheFocusOnNthColumnOnNthRowOfTable(3, 8, "to_Item::com.sap.vocabularies.UI.v1.LineItem::gridTable", "gridTable");
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
				.iEnterValuesInCellsOnNthRowOfTable(3, [7, 8], ["EUR", "10"], "to_Item::com.sap.vocabularies.UI.v1.LineItem::gridTable", "gridTable");
			Then.onTheObjectPage
				.iCheckNumberOfItemsInTable(4, "to_Item::com.sap.vocabularies.UI.v1.LineItem::gridTable", "gridTable")
				.and
				.iShouldSeeTheInactiveRowOnTheTable(1, "to_Item::com.sap.vocabularies.UI.v1.LineItem::gridTable");
			When.onTheGenericObjectPage
				.iSelectListItemsByLineNo([2], true, "to_Item::com.sap.vocabularies.UI.v1.LineItem::gridTable")
			Then.onTheObjectPage
				.iCheckControlPropertiesById("to_Item::com.sap.vocabularies.UI.v1.LineItem::action::SalesOrder::MultiViews", { "enabled": true })
				.and
				.iCheckTableToolbarControlProperty({ "deleteEntry": [true, true] }, "to_Item::com.sap.vocabularies.UI.v1.LineItem::gridTable", "gridTable");
			Then.onTheObjectPage
				.iCheckTableToolbarControlProperty({ "addEntry": [true, true] }, "to_Item::com.sap.vocabularies.UI.v1.LineItem::gridTable", "gridTable");
			Then.iTeardownMyApp();
		});
	}
);
