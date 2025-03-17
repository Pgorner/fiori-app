sap.ui.define(["sap/ui/test/opaQunit"],
    function (opaTest) {
        "use strict";

        QUnit.module("Object Page - External Navigations");

        opaTest("Starting the app and navigating to object page", function (Given, When, Then) {
            Given.iStartMyAppInSandbox("EPMManageProduct-displayFactSheet,EPMProduct-manage_st,BusinessPartner-displayFactSheet,SalesOrder-MultiViews,STTASOWD20-STTASOWD20#STTASOWD20-STTASOWD20", "manifestVariantManagementOnObjectPage");
            When.onTheGenericListReport
                .iExecuteTheSearch();
            Then.onTheGenericListReport
                .theResultListIsVisible()
                .and
                .theResultListContainsTheCorrectNumberOfItems(20);
            When.onTheGenericListReport
                .iNavigateFromListItemByFieldValue({ Field: "SalesOrder", Value: "500000002" });
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("500000002");
        });

        opaTest("Check the dedicated actions in the related apps in the object page", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iClickTheRelatedAppMenuButton("SOwoExt::sap.suite.ui.generic.template.ObjectPage.view.Details::C_STTA_SalesOrder_WD_20--relatedApps");
            Then.onTheObjectPage
                .iCheckRelatedAppsSheetList(true, ["Trace Navigation Parameters"]);
            When.onTheGenericObjectPage
                .iNavigateToRelatedApp(0);
            Then.onTheGenericListReport
                .iSeeShellHeaderWithTitle("Trace Navigation Parameters");
            When.onTheGenericListReport
                .iClickTheBackButtonOnFLP();
            Then.onTheObjectPage
                .iCheckObjectPageEntitySet("C_STTA_SalesOrder_WD_20");
        });

        opaTest("Open a draft object and check no discard draft popup appears in case of IBN navigation when set to restricted in manifest", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iCloseTheObjectPage();
            When.onTheGenericListReport
                .iNavigateFromListItemByFieldValue({ Field: "SalesOrder", Value: "500000001" });
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("500000001");
            When.onTheGenericObjectPage
                .iClickTheLink("100000004");
            Then.onTheGenericObjectPage
                .iSeeShellHeaderWithTitle("Business Partner");
        });

        opaTest("Check no discard draft popup appears in case of Chevron navigation when set to restricted in manifest", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iClickTheBackButtonOnFLP();
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("500000001");
            When.onTheGenericObjectPage
                .iNavigateFromObjectPageTableByLineNo("to_Item", 1);
            Then.onTheGenericObjectPage
                .iSeeShellHeaderWithTitle("Product");
        });

        opaTest("Navigate back to OP and then back to LR", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iClickTheBackButtonOnFLP();
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("500000001");
            When.onTheGenericObjectPage
                .iClickTheBackButtonOnFLP();
            Then.onTheGenericObjectPage
                .iShouldSeeTheDialogWithTitle("Warning");
            When.onTheGenericObjectPage
                .iSelectTheOptionFromDiscardDraftPopUp("Keep Draft")
                .and
                .iClickTheButtonOnTheDialog("OK");
            Then.onTheGenericListReport
                .theListReportPageIsVisible();
        });

        opaTest("Navigate to an active ObjectPage", function (Given, When, Then) {
            When.onTheGenericListReport
                .iNavigateFromListItemByFieldValue({ Field: "SalesOrder", Value: "500000000" });
            When.onTheGenericObjectPage
                .iSelectSectionOrSubSectionByName("Sales Order Items");
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("500000000")
                .and
                .theObjectPageTableFieldHasTheCorrectValue("to_Item", {
                    Line: 0,
                    Field: "SalesOrderItem",
                    Value: "100"
                });
        });

        opaTest("Sort the item list", function (Given, When, Then) {
            When.onTheObjectPage
                .iRemoveAllTheCustomVariantsForTheTable("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table");
            When.onTheGenericObjectPage
                .iClickTheOverflowToolbarButton("Settings");
            When.onTheListReportPage
                .iClickTheControlByControlType("sap.m.IconTabFilter", { "text": "Sort" });
            When.onTheGenericObjectPage
                .iChoosetheItemInComboBox("Item Position")
                .and
                .iClickTheButtonHavingLabel("OK");
            Then.onTheObjectPage
                .iCheckTheSelectedVariantIsModified(true, "to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-variant");
        });

        opaTest("Save the variant", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iClickOnSmartVariantViewSelection("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-variant-vm-trigger")
                .and
                .iClickTheButtonWithId("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-variant-vm-saveas")
                .and
                .iSetTheInputFieldWithId("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-variant-vm-name", "Sorted")
                .and
                .iClickTheButtonOnTheDialog("Save");
            Then.onTheObjectPage
                .theCorrectSmartVariantIsSelected("Sorted")
                .and
                .iCheckTheSelectedVariantIsModified(false, "to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-variant");
        });

        opaTest("External navigation to EPM Manage Products ", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iClickTheLink("HT-1000");
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("Notebook Basic 15");
        });

        opaTest("Navigate back to Sales Order Object Page and check the Table variant name is retained", function (Given, When, Then) {
            When.onTheGenericListReport
                .iClickTheBackButtonOnFLP();
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("500000000");
            Then.onTheObjectPage
                .theCorrectSmartVariantIsSelected("Sorted");
            Then.onTheObjectPage
                .iCheckTheSelectedVariantIsModified(false, "to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-variant");
        });

        opaTest("Select a different record on LR Page and navigate to Object Page - Check Table variant name", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iClickTheBackButtonOnFLP();
            Then.onTheGenericListReport
                .theResultListIsVisible();
            When.onTheGenericListReport
                .iNavigateFromListItemByFieldValue({ Field: "SalesOrder", Value: "500000002" });
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("500000002");
            When.onTheGenericObjectPage
                .iSelectSectionOrSubSectionByName("Sales Order Items");
            Then.onTheObjectPage
                .theCorrectSmartVariantIsSelected("Standard");
            Then.onTheObjectPage
                .iCheckTheSelectedVariantIsModified(false, "to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-variant");
        });

        opaTest("Delete the newly created Table variant ", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iClickOnSmartVariantViewSelection("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-variant-vm-trigger")
                .and
                .iClickTheButtonWithId("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-variant-vm-manage")
                .and
                .iClickTheButtonWithIcon("sap-icon://decline")
                .and
                .iClickTheButtonHavingLabel("Save");
            Then.onTheObjectPage
                .theCorrectSmartVariantIsSelected("Standard");
        });

        opaTest("External navigation from OP Header - Dynamic values for Semantic Object and Action", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iClickTheLink("100000010", 1);
            Then.onTheGenericObjectPage
                .iSeeShellHeaderWithTitle("Business Partner");
            When.onTheGenericObjectPage
                .iClickTheBackButtonOnFLP();
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("500000002");
        });

        opaTest("External navigation from OP Form - Dynamic values for Semantic Object and Action", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iSelectSectionOrSubSectionByName("Sales Order Items")
                .and
                .iClickTheLink("100000010", 2);
            Then.onTheGenericObjectPage
                .iSeeShellHeaderWithTitle("Business Partner");
            When.onTheGenericObjectPage
                .iClickTheBackButtonOnFLP();
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("500000002");
        });

        opaTest("External navigation from OP Table - Dynamic values for Semantic Object and Action", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iCloseTheObjectPage();
            When.onTheGenericListReport
                .iNavigateFromListItemByFieldValue({ Field: "SalesOrder", Value: "500000003" });
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("500000003");
            When.onTheGenericObjectPage
                .iSelectSectionOrSubSectionByName("Contacts")
                .and
                .iClickTheLink("100000012", 3);
            Then.onTheGenericObjectPage
                .iSeeShellHeaderWithTitle("Business Partner");
            When.onTheGenericObjectPage
                .iClickTheBackButtonOnFLP();
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("500000003");
        });

        opaTest("Cross navigation from OP table - Navigate to EPM Manage Products app", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iSelectSectionOrSubSectionByName("Sales Order Items");
            When.onTheGenericObjectPage
                .iNavigateFromObjectPageTableByLineNo("to_Item", 0);
            Then.onTheGenericObjectPage
                .iSeeShellHeaderWithTitle("Product");
            When.onTheGenericObjectPage
                .iClickTheBackButtonOnFLP();
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("500000003");
        });

        opaTest("External navigation to the OP of MultiEntity App - OP having Entity set other than main entity", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iCloseTheObjectPage();
            When.onTheGenericListReport
                .iNavigateFromListItemByFieldValue({ Field: "SalesOrder", Value: "500000002" });
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("500000002");
            When.onTheGenericObjectPage
                .iSelectSectionOrSubSectionByName("Sales Order Items")
                .and
                .iSelectListItemsByLineNo([6], true, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
                .and
                .iClickTheButtonWithId("to_Item::com.sap.vocabularies.UI.v1.LineItem::action::SalesOrder::MultiViews");
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("20");
            Then.onTheObjectPage
                .iCheckObjectPageEntitySet("C_STTA_SalesOrderItem_WD_20");
        });

        opaTest("Correct tab is selected in the List Report when navigated externally to a multi entity application", function (Given, When, Then) {
            When.onTheGenericListReport
                .iClickOnItemFromTheShellNavigationMenu("Sales Orders");
            When.onTheListReportPage
                .iWaitForThePageToLoad("ListReport", "C_STTA_SalesOrder_WD_20");
            Then.onTheListReportPage
                .iCheckControlPropertiesByControlType("sap.m.IconTabHeader", { "selectedKey": "2" });
            Then.iTeardownMyApp();
        });
    }
);
