sap.ui.define(["sap/ui/test/opaQunit", "sap/ui/test/Opa5"],
	function (opaTest, Opa5) {
		"use strict";

		QUnit.module("Applicable Path Object Page Charts");

		if (sap.ui.Device.browser.safari) {
			opaTest("Safari detected - SKIPPED", function (Given, When, Then) {
				Opa5.assert.expect(0);
			});
		} else {

		opaTest("Applicable-path based Action buttons on the Object Page Chart are rendered correctly and check the Standard variant name", function(Given, When, Then) {
			Given.iStartMyAppInDemokit("sttaproducts#STTA_C_MP_Product(Product='HT-1000',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)", null, {bWithChange: true});
			When.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "STTA_C_MP_Product");
			When.onTheGenericObjectPage
			    .iSelectSectionOrSubSectionByName("Sales Data");
			Then.onTheObjectPage
				.iCheckControlPropertiesById("to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::Chart", {"visible": true})
				.and
				.iCheckChartToolbarControlProperty({"EPMProduct::EPMProduct": [true, false]}, "to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::Chart") // EPMProduct::EPMProduct text is Manage Products (STTA)
				.and
				.theCorrectSmartVariantIsSelected("Standard")
				.and
				.iCheckTheSelectedVariantIsModified(false, "to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::Chart-variant");
		});

		opaTest("Save a variant in Chart and check the variant is retained for the record after navigating to LR and Open again", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickOnSmartVariantViewSelection("to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::Chart-variant-vm")
				.and
				.iClickTheButtonWithId("to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::Chart-variant-vm-saveas")
				.and
				.iSetTheInputFieldWithId("to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::Chart-variant-vm-name", "Sorted")
				.and
				.iClickTheButtonOnTheDialog("Save");
			Then.onTheObjectPage
				.theCorrectSmartVariantIsSelected("Sorted")
				.and
				.iCheckTheSelectedVariantIsModified(false, "to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::Chart-variant");
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("back");
			Then.onTheGenericListReport
				.theResultListIsVisible();
			When.onTheGenericListReport
				.iExecuteTheSearch()
				.and
				.iNavigateFromListItemByLineNo(3);
			When.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "STTA_C_MP_Product");
			When.onTheGenericObjectPage
			    .iSelectSectionOrSubSectionByName("Sales Data");
			Then.onTheObjectPage
				.theCorrectSmartVariantIsSelected("Sorted")
				.and
				.iCheckTheSelectedVariantIsModified(false, "to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::Chart-variant");
		});

		opaTest("New chart variant is not retained for a different record - Standard variant is selected", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateBack();
			Then.onTheGenericListReport
				.theResultListIsVisible();
			When.onTheGenericListReport
				.iNavigateFromListItemByLineNo(4);
			When.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "STTA_C_MP_Product");
			When.onTheGenericObjectPage
			    .iSelectSectionOrSubSectionByName("Sales Data");
			Then.onTheObjectPage
				.theCorrectSmartVariantIsSelected("Standard")
				.and
				.iCheckTheSelectedVariantIsModified(false, "to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::Chart-variant");
		});

		opaTest("Delete the newly created variant", function (Given, When, Then) {
			When.onTheObjectPage
				.iClickOnVariantById("to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::Chart-variant-vm");
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Manage")
				.and
				.iClickTheButtonWithIcon("sap-icon://decline")
				.and
				.iClickTheButtonHavingLabel("Save");
			Then.onTheObjectPage
				.theCorrectSmartVariantIsSelected("Standard", "to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::Chart-variant-vm");
			Then.iTeardownMyApp();
		});
	}
	}
);
