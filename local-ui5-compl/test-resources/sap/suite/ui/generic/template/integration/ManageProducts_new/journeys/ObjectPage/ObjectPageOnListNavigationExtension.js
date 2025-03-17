sap.ui.define(["sap/ui/test/opaQunit"],
    function (opaTest) {
        "use strict";

        QUnit.module("Check visual indication for the navigated item with onListNavigationExtension - OP");

        opaTest("Check visual indication for the navigated item with onListNavigationExtension - OP Responsive table", function (Given, When, Then) {
            Given.iStartMyAppInDemokit("sttaproducts#STTA_C_MP_Product(Product='HT-1000',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)", "manifestWithCanvas");
            When.onTheObjectPage
                .iWaitForThePageToLoad("ObjectPage", "STTA_C_MP_Product");
            When.onTheGenericObjectPage
                .iSelectSectionOrSubSectionByName("General Information", "Product Texts")
                .and
                .iNavigateFromObjectPageTableByFieldValue("to_ProductText", { Field: "LanguageForEdit", Value: "EN" });
            Then.onTheObjectPage
                .iShouldSeeTheNavigatedRowHighlighted(0, true, "to_ProductText::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
            When.onTheGenericObjectPage
                .iCloseTheObjectPage();
            Then.onTheObjectPage
                .iShouldSeeTheNavigatedRowHighlighted(0, true, "to_ProductText::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
            When.onTheGenericObjectPage
                .iCloseTheObjectPage();
            When.onTheGenericListReport
                .iExecuteTheSearch();
            Then.onTheObjectPage
                .iShouldSeeTheNavigatedRowHighlighted(3, true);
            Then.iTeardownMyApp();
        });

        opaTest("Check visual indication for the navigated item with onListNavigationExtension - OP Grid table", function (Given, When, Then) {
            Given.iStartMyAppInDemokit("sttaproducts#STTA_C_MP_Product(Product='HT-1000',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)", "manifestWithCanvaOPGridTable");
            When.onTheObjectPage
                .iWaitForThePageToLoad("ObjectPage", "STTA_C_MP_Product");
            When.onTheGenericObjectPage
                .iSelectSectionOrSubSectionByName("General Information", "Product Texts")
                .and
                .iNavigateFromObjectPageTableByLineNo("to_ProductText", 0, "STTA_C_MP_Product");
            Then.onTheObjectPage
                .iShouldSeeTheNavigatedRowHighlightedInUITables(0, true, "to_ProductText::com.sap.vocabularies.UI.v1.LineItem::gridTable");
            When.onTheGenericObjectPage
                .iCloseTheObjectPage();
            Then.onTheObjectPage
                .iShouldSeeTheNavigatedRowHighlightedInUITables(0, true, "to_ProductText::com.sap.vocabularies.UI.v1.LineItem::gridTable");
            Then.iTeardownMyApp();
        });
    }
);
