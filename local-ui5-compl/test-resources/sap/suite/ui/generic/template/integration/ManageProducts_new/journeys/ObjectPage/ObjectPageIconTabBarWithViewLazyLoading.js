sap.ui.define(["sap/ui/test/opaQunit", "sap/ui/test/Opa5"],
	function (opaTest, Opa5) {
		"use strict";

		QUnit.module("Object Page Rendering With ViewLazyLoading - Icon Tab Bar");

		if (sap.ui.Device.browser.safari) {
			opaTest("Safari detected - SKIPPED", function (Given, When, Then) {
				Opa5.assert.expect(0);
			});
		} else {

		opaTest("Starting the app and navigate to an active Object page", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttaproducts", "manifestViewLazyLoading", { "bWithChange": true });
			When.onTheGenericListReport
				.iExecuteTheSearch()
				.and
				.iNavigateFromListItemByFieldValue({ Field: "ProductForEdit", Value: "HT-1000" });
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("Notebook Basic 15");
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.uxap.ObjectPageLayout", { "useIconTabBar": true });
		});

		opaTest("Check the Facets are rendered correctly", function (Given, When, Then) {
			Then.onTheObjectPage
				.theFacetProductInformationInsideTheFacetGeneralInformationIsRenderedCorrectly();
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByIndex(1, 1);
			Then.onTheObjectPage
				.theFacetProductDescriptionsAndSupplierInsideTheFacetGeneralInformationIsRenderedCorrectly()
				.and
				.theFacetProductDescriptionsAndSupplierInsideTheFacetGeneralInformationRendersCharts()
				.and
				.iSearchInTableToolbarOrSearchInputField();
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("Sales Data");
			Then.onTheObjectPage
				.theExtensionFacetSalesDataIsRenderedCorrectly();
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("Sales Revenue");
			Then.onTheObjectPage
				.theFacetSalesRevenueIsRenderedCorrectly();
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("Target Rating")
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.m.Button", { "visible": true, "text": "Manage Rating" });
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("Rating (CollectionFacet)");
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.m.Button", { "visible": true, "text": "Manage Rating 1" });
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("Contacts");
			Then.onTheObjectPage
				.theFacetContactsIsRenderedCorrectly();
		});

		opaTest("Check the OP table is populated with the records", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("General Information", "Product Texts");
			Then.onTheObjectPage
				.iCheckNumberOfItemsInTable(1, "to_ProductText::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("The Subsection title is hidden when the title of the table and subsection are the same", function (Given, When, Then) {
			Then.onTheObjectPage
				.iCheckSectionOrSubSectionTitleVisibilityByIndex(1, 1, false)
				.and
				.iCheckControlPropertiesById("to_ProductText::com.sap.vocabularies.UI.v1.LineItem::Table", { "visible": true, "header": "Product Texts" });
		});

		opaTest("The Subsection title is hidden when the title of the chart and subsection are the same", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("Sales Data", "Product Sales Data");
			Then.onTheObjectPage
				.iCheckSectionOrSubSectionTitleVisibilityByIndex(2, 0, false)
				.and
				.iCheckControlPropertiesById("to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::Chart", { "visible": true, "header": "Product Sales Data" });
		});

		opaTest("Dynamic Side Content Validation- Show Content", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("Sales Revenue")
				.and
				.iClickTheButtonHavingLabel("Show File");
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.ui.layout.DynamicSideContent", { "showSideContent": true });
		});

		opaTest("Dynamic Side Content Validation- Hide Content & subsection rendering", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonHavingLabel("Hide File");
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.ui.layout.DynamicSideContent", { "showSideContent": false })
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("Sales Revenue", "Target Sales Data");
			Then.onTheObjectPage
				.theSmartTableIsVisible("to_ProductSalesData::com.sap.vocabularies.UI.v1.LineItem::Table");
		});

		opaTest("Navigation from OP to Sub OP", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("General Information", "Product Texts")
				.and
				.iNavigateFromObjectPageTableByLineNo("to_ProductText", 0);
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("Notebook Basic 15")
				.and
				.iShouldSeeTheSections(["General Information"]);
		});

		opaTest("Navigate from Sub OP to OP and back to LR ", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iCloseTheObjectPage();
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("Notebook Basic 15");
			When.onTheGenericObjectPage
				.iCloseTheObjectPage();
			Then.onTheGenericListReport
				.theListReportPageIsVisible();
		});

		opaTest("Open a draft object from LR ", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({ Field: "ProductForEdit", Value: "HT-1001" });
			Then.onTheGenericObjectPage
				.theObjectPageIsInEditMode()
				.and
				.theObjectPageHeaderTitleIsCorrect("基础版笔记本电脑 17");
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.uxap.ObjectPageLayout", { "useIconTabBar": true });
		});

		opaTest("Check the OP table is populated with the records", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("General Information", "Product Texts");
			Then.onTheObjectPage
				.iCheckNumberOfItemsInTable(1, "to_ProductText::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("Navigation from OP to Sub OP in edit mode", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateFromObjectPageTableByLineNo("to_ProductText", 0);
			Then.onTheGenericObjectPage
				.theObjectPageIsInEditMode()
				.and
				.theObjectPageHeaderTitleIsCorrect("Notebook Basic 17");
			Then.iTeardownMyApp();
		});
	}
	}
);
