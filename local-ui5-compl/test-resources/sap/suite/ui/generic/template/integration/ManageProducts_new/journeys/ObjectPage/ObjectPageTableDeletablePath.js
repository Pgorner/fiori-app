sap.ui.define(["sap/ui/test/opaQunit"],
	function(opaTest) {
		"use strict";

		QUnit.module("Deletable Path Object Page Tables");

		opaTest("The Delete button in Object Page Tables is rendered correctly", function(Given, When, Then) {
			Given.iStartMyAppInDemokit("sttaproducts#/STTA_C_MP_Product(Product='HT-1000',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)");
			When.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "STTA_C_MP_Product");
			Then.onTheGenericObjectPage
				.iCheckSelectedSectionByIdOrName("General Information");
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("General Information", "Product Texts");
			Then.onTheObjectPage
				.iCheckControlPropertiesById("--to_ProductText::com.sap.vocabularies.UI.v1.LineItem::Table", { "visible": true, "enableAutoColumnWidth": true })
				.and
				.iCheckTableToolbarControlProperty({"DeleteEntry": [false, false], "AddEntry": [false, true]}, "--to_ProductText::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("Check the Show Details button on the Table and None, Low and Medium importance columns are hidden from the table popin", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("to_ProductText::com.sap.vocabularies.UI.v1.LineItem::Table::Toolbar-overflowButton");
			Then.onTheObjectPage
				.iCheckControlPropertiesById("to_ProductText::com.sap.vocabularies.UI.v1.LineItem::Table-btnShowHideDetails", {"visible": true, "enabled": true, "selectedKey": "hideDetails"})
				.and
				.iCheckTheCoulmnsHiddenInPoppinForTheTable(["None", "Low", "Medium"], "to_ProductText::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
				.and
				.iCheckTheColumnDisplayedInTheTablePopin("Revenue", false, "to_ProductText::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
				.and
				.iCheckTheColumnDisplayedInTheTablePopin("Ref. Product (WithNavPath)", false, "to_ProductText::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
				.and
				.iCheckTheColumnDisplayedInTheTablePopin("Manage Product Texts (ST)", false, "to_ProductText::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("Click on the Show Details button and check None, Low and Medium importance columns are displayed as table popin", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheShowDetailsButtonOnTheTableToolBar("to_ProductText");
			Then.onTheObjectPage
				.iCheckControlPropertiesById("to_ProductText::com.sap.vocabularies.UI.v1.LineItem::Table-btnShowHideDetails", {"visible": true, "enabled": true, "selectedKey": "showDetails"})
				.and
				.iCheckTheCoulmnsHiddenInPoppinForTheTable("", "to_ProductText::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
				.and
				.iCheckTheColumnDisplayedInTheTablePopin("Revenue", true, "to_ProductText::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
				.and
				.iCheckTheColumnDisplayedInTheTablePopin("Ref. Product (WithNavPath)", true, "to_ProductText::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
				.and
				.iCheckTheColumnDisplayedInTheTablePopin("Manage Product Texts (ST)", true, "to_ProductText::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
			When.onTheGenericObjectPage
				.iClickTheShowDetailsButtonOnTheTableToolBar("to_ProductText");
		});

		opaTest("The Delete button in Object Page Tables is rendered correctly after pressing Edit", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheEditButton();
			When.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "STTA_C_MP_Product");
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("General Information", "Product Texts");
			Then.onTheObjectPage
				.iCheckTableToolbarControlProperty({"DeleteEntry": [true, false], "AddEntry": [true, true]}, "--to_ProductText::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("The Delete button has the correctly enablement after selection", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iChoosetheItemInSelect("ZH","Language Filter")
				.and
				.iSelectListItemsByLineNo([0], true, "to_ProductText::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
			Then.onTheObjectPage
				.iCheckTableToolbarControlProperty({"DeleteEntry": [true, true], "AddEntry": [true, true]}, "--to_ProductText::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
			When.onTheGenericObjectPage
				.iChoosetheItemInSelect("EN","Language Filter")
				.and
				.iSelectListItemsByLineNo([0], true, "to_ProductText::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
			Then.onTheObjectPage
				.iCheckTableToolbarControlProperty({"DeleteEntry": [true, false], "AddEntry": [true, true]}, "--to_ProductText::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
			Then.iTeardownMyApp();
		});
	}
);
