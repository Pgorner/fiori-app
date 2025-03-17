sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Smart Link QuickView ");

		opaTest("Start the app and verify whitespace rendered in OP header", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("EPMProduct-manage_st,EPMManageProduct-displayFactSheet#EPMProduct-manage_st&/STTA_C_MP_Product(Product='HT-1064',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)");
			Then.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "STTA_C_MP_Product");
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.uxap.ObjectPageHeader", { "objectTitle": "Internet    Keyboard", "objectSubtitle": "HT-1064", "visible": true });
		});

		opaTest("Verify whitespace rendered in shell navigation menu item description text", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("General Information", "Product Texts")
				.and
				.iNavigateFromObjectPageTableByLineNo("to_ProductText", 0);
			When.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "STTA_C_MP_ProductText");
			When.onTheObjectPage
				.iClickTheControlWithId("shellAppTitle");
			Then.onTheObjectPage
				.iCheckShellNavigationMenuItemDescriptionIcon("Internet    Keyboard");
		});

		opaTest("Check for QuickView content on the Object Page", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheBackButtonOnFLP()
				.and
				.iSelectSectionOrSubSectionByName("General Information", "Product Information");
			When.onTheObjectPage
				.iClickOnASmartLink("100000075 (C.R.T.U.)");
			Then.onTheObjectPage
				.theSmLiQvPopoverOpensAndContainsExtraContent("Label: FieldGroup_2");
		});

		opaTest("Check for QuickView clicking the title area link to navigate to external application", function (Given, When, Then) {
			When.onTheObjectPage
				.iClickTheTitleAreaLinkOnTheSmLiQvPopover();
			Then.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "SEPMRA_C_PD_Product");
		});

		opaTest("Check for QuickView contact content on the Object Page", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheBackButtonOnFLP()
				.iSelectSectionOrSubSectionByName("General Information", "Product Information")
				.and
				.iClickTheLinkWithId("header::headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::GeneralInformationForHeader::WeightUnit::Field-sl");
			Then.onTheObjectPage
				.theSmLiQvPopoverOpensAndContainsExtraContent("Label: Contact 1");
		});

		opaTest("Check for QuickView contact content opened from the Object Page table", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("General Information", "Product Texts");
			When.onTheListReportPage
				.iClickOnACellInTheTable(1, 5, "to_ProductText::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
			Then.onTheObjectPage
				.iCheckTheQuickViewContactCard({ "Title": "C.R.T.U.", "Phone": "6839542781", "Fax": "6839542004", "Address": "Waldorf, Germany" });
			Then.iTeardownMyApp();
		});
	}
);
