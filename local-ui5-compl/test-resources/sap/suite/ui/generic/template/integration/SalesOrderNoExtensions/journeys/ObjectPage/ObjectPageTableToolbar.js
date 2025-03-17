sap.ui.define(["sap/ui/test/opaQunit"],
	function(opaTest) {
		"use strict";

		QUnit.module("Table Toolbar Buttons in Object Page");

		opaTest("The 'Delete' button in Object Page Tables is initially not visible", function(Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordernoext#//C_STTA_SalesOrder_WD_20(SalesOrder='500000000',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)");
			Then.onTheObjectPage
				.iCheckTableProperties({"visible": true}, "responsiveTable", "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
				.and
				.iCheckTableToolbarControlProperty({"deleteEntry": [false, false]}, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("The Excel export button is rendered for the table when Copy & Paste is available - Display Mode ", function (Given, When, Then) {
			When.onTheObjectPage
				.iLookAtTheScreen();
			Then.onTheObjectPage
				.iCheckControlPropertiesById("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-btnExcelExport", { "icon": "sap-icon://excel-attachment", "visible": true, "enabled": true });
		});

		opaTest("The 'Delete' button in Object Page Tables is visible and disabled after pressing 'Edit' 'Paste' button enabled", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheEditButton()
				.and
				.iSelectSectionOrSubSectionByName("Sales Order Items");
			Then.onTheObjectPage
				.iCheckTableToolbarControlProperty({"deleteEntry": [true, false]}, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
				.and
				.iCheckControlPropertiesById("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-btnPaste", { "icon": "sap-icon://paste", "visible": true, "enabled": true });
		});

		opaTest("The Excel export button is rendered for the table when Copy & Paste is available - Edit Mode ", function (Given, When, Then) {
			When.onTheObjectPage
				.iLookAtTheScreen();
			Then.onTheObjectPage
				.iCheckControlPropertiesById("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-btnExcelExport", { "icon": "sap-icon://excel-attachment", "visible": true, "enabled": true });
		});

		opaTest("The 'Delete' button in Object Page Tables is enabled after selecting an item", function (Given, When, Then) {
			When.onTheObjectPage
				.iRemoveAllTheCustomVariantsForTheTable("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table");
			When.onTheGenericObjectPage
				.iSelectListItemsByLineNo([1], true, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
			Then.onTheObjectPage
				.iCheckTableToolbarControlProperty({"deleteEntry": [true, true]}, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("The 'Delete' button in Object Page Tables is not visible after pressing 'Cancel'", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectListItemsByLineNo([1], false, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
				.and
				.iCancelTheDraft(true);
			Then.onTheObjectPage
				.iCheckTableToolbarControlProperty({"deleteEntry": [false, false]}, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("The 'Delete' button in Object Page Tables is visible and disabled after pressing 'Edit' again", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheEditButton();
			Then.onTheObjectPage
				.iCheckTableToolbarControlProperty({"deleteEntry": [true, false]}, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("The SmartmultiInput and smart toggle field is rendered on the Object page table", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iCancelTheDraft(true);
			Then.onTheObjectPage
				.iCheckRenderedColumnControlTypeOnNthRowOfTable(3, [1, 3], ["sap.ui.comp.SmartToggle", "sap.ui.comp.smartmultiinput.SmartMultiInput"], "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("Check the FE rendered column properties on the OP table - Data field with 1:n association", function (Given, When, Then) {
			Then.onTheObjectPage
				.iCheckTheAutoColumnWidthCustomDataForTheColumn({ "min": 2, "max": 19 }, "to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-to_Categories_CategoryId");
		});

		opaTest("Check the table entries are marked which contains error", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheEditButton()
				.and
				.iSelectSectionOrSubSectionByName("General Information")
				.and
				.iSetTheObjectPageDataField("Amount", "CurrencyCode", "abcdefg");
			Then.onTheObjectPage
				.iCheckControlPropertiesById("showMessages", { "visible": true, "enabled": true, "text": "1", "type": "Negative", "icon": "sap-icon://message-error" });
			When.onTheObjectPage
				.iToggleMessagePopoverDialog()
				.and
				.iAddMessagesToMessageDialogOrPopOver("sap.m.PopOver", [{ "msg": "Error Message 1", "msgType": "Error", "fullTarget": "/to_Item(SalesOrder='500000000',SalesOrderItem='100',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)", "persistent": false },
												{ "msg": "Error Message 1", "msgType": "Error", "fullTarget": "/to_Item(SalesOrder='500000000',SalesOrderItem='80',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)", "persistent": false }])
				.and
				.iCloseMessagePopover();
			Then.onTheObjectPage
				.iShouldSeeTheRowHighlighted("to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable", 0, "Error")
				.and
				.iShouldSeeTheRowHighlighted("to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable", 2, "Error");
		});

		opaTest("Check the error rows are filtered after clicking on the Filter Items link on the message strip", function (Given, When, Then) {
			When.onTheObjectPage
				.iLookAtTheScreen();
			Then.onTheObjectPage
				.iCheckMessageStripValueOnTable("to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable", "Error", "The table contains errors.")
				.and
				.iCheckNumberOfItemsInTable(10, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
			When.onTheGenericObjectPage
				.iClickTheLink("Filter Items");
			Then.onTheObjectPage
				.iCheckNumberOfItemsInTable(2, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
				.and
				.iCheckControlPropertiesByControlType("sap.m.Text", { text: "Filtered By: Errors" })
				.and
				.iCheckControlPropertiesByControlType("sap.m.Toolbar", { visible: true, design: "Info", active: true });
		});

		opaTest("Check the error row filtering is removed after clicking on the Clear Filter link on the message strip", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheLink("Clear Filter");
			Then.onTheObjectPage
				.iCheckNumberOfItemsInTable(10, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("Check the Info toolbar text on the responsive table in OP", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iCancelTheDraft(true);
			Then.onTheObjectPage
				.iCheckControlPropertiesById("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table", { "Visible": true, "useInfoToolbar": "On" });
			When.onTheListReportPage
				.iClickTheButtonOnTableToolBar("Settings", "to_Item::com.sap.vocabularies.UI.v1.LineItem::Table")
				.and
				.iClickTheControlByControlType("sap.m.IconTabFilter", { "text": "Filter" });
			When.onTheGenericListReport
				.iChoosetheItemInComboBox("ISO Currency Code");
			When.onTheListReportPage
				.iEnterValueInField("EUR", "CurrencyCode")
				.and
				.iClickOnButtonWithText("OK");
			Then.onTheListReportPage
				.iCheckInfoToolbarTextOnTheTable("1 table filter active: ISO Currency Code", "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
				.and
				.iCheckNumberOfItemsInTable(6, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
			Then.iTeardownMyApp();
		});
	}
);
