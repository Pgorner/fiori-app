sap.ui.define(["sap/ui/test/opaQunit", "sap/ui/test/Opa5"],
	function (opaTest, Opa5) {
		"use strict";

		QUnit.module("FE rendered column width check - Auto");

		if (sap.ui.Device.browser.safari) {
			opaTest("Safari detected - SKIPPED", function (Given, When, Then) {
				Opa5.assert.expect(0);
			});
		} else {

			opaTest("Check the width of FE rendered columns in LR table is set to auto when the manifest property enableAutoColumnWidthForSmartTable is set to false", function (Given, When, Then) {
				Given.iStartMyAppInDemokit("sttaproducts", "manifestDynamicHeaderInFCLTableTabs");
				When.onTheGenericListReport
					.iExecuteTheSearch();
				Then.onTheListReportPage
					.iCheckControlPropertiesById("listReport-1", { "visible": true, "enableAutoColumnWidth": false })
					.and
					.iCheckControlPropertiesById("listReport-1-ProductPictureURL", { "visible": true, "width": "auto" })
					.and
					.iCheckControlPropertiesById("listReport-1-ProductForEdit", { "visible": true, "width": "auto" })
					.and
					.iCheckControlPropertiesById("listReport-1:::sProperty::Supplier:::sSemanticObject::EPMProduct:::sAction::manage", { "visible": true, "width": "auto" })
					.and
					.iCheckControlPropertiesById("listReport-1:::sTarget::to_Supplier:2f:40com.sap.vocabularies.Communication.v1.Contact", { "visible": true, "width": "auto" })
					.and
					.iCheckControlPropertiesById("listReport-1:::sTarget:::40com.sap.vocabularies.UI.v1.FieldGroup:23ProductConnectedField", { "visible": true, "width": "auto" })
					.and
					.iCheckControlPropertiesById("listReport-1:::sTarget::to_ProductSalesPrice:2f:40com.sap.vocabularies.UI.v1.Chart:23SalesPriceAreaChart", { "visible": true, "width": "auto" })
					.and
					.iCheckControlPropertiesById("listReport-1:::sTarget::to_ProductSalesRevenue:2f:40com.sap.vocabularies.UI.v1.Chart:23GrossSalesRevenueBulletChart", { "visible": true, "width": "auto" })
					.and
					.iCheckControlPropertiesById("listReport-1:::sTarget:::40com.sap.vocabularies.UI.v1.FieldGroup:23Actions", { "visible": true, "width": "auto" });
			});

			opaTest("Navigate to OP and Check the width of FE rendered column in OP table is set to auto when the manifest property enableAutoColumnWidthForSmartTable is set to false", function (Given, When, Then) {
				When.onTheGenericListReport
					.iNavigateFromListItemByLineNo(1, "listReport-1");
				Then.onTheGenericObjectPage
					.theObjectPageHeaderTitleIsCorrect("Notebook Basic 15")
				When.onTheGenericObjectPage
					.iSelectSectionOrSubSectionByName("General Information", "Product Texts")
				Then.onTheObjectPage
					.iCheckControlPropertiesById("to_ProductText::com.sap.vocabularies.UI.v1.LineItem::Table", { "visible": true, "enableAutoColumnWidth": false })
					.and
					.iCheckControlPropertiesById("to_ProductText:3a:3acom.sap.vocabularies.UI.v1.LineItem:3a:3aTable:::sProperty::Name:::sTarget::to_Product", { "visible": true, "width": "auto" });
				Then.iTeardownMyApp();
			});
		}
	}
);
