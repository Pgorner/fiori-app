sap.ui.define(["sap/ui/test/opaQunit"],
    function (opaTest) {
        "use strict";

        QUnit.module("Object Page Rendering with ViewLazyLoading");

        opaTest("Starting the app and loading the records", function (Given, When, Then) {
            Given.iStartMyAppInDemokit("sttasalesordernoext", "manifestViewLazyLoading");
            When.onTheGenericListReport
                .iExecuteTheSearch();
            Then.onTheGenericListReport
                .theAvailableNumberOfItemsIsCorrect(20);
        });

        opaTest("Create a new Object", function (Given, When, Then) {
            When.onTheGenericListReport
                .iClickTheCreateButton();
            Then.onTheGenericObjectPage
                .theObjectPageIsInEditMode()
                .and
                .iShouldSeeTheSections(["General Information", "Sales Order Items", "Contacts"]);
            When.onTheGenericObjectPage
                .iSelectSectionOrSubSectionByName("Sales Order Items");
            Then.onTheObjectPage
                .iShouldSeeTheInactiveRowOnTheTable(1, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
            When.onTheGenericObjectPage
                .iSetTheObjectPageDataField("Amount", "CurrencyCode", "EUR");
            When.onTheObjectPage
                .iEnterValuesInCellsOnNthRowOfTable(1, [1], ["1000"], "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
        });

        opaTest("Save the Object and check the Object is created with the details provided", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iSaveTheDraft();
            Then.onTheGenericObjectPage
                .theObjectPageIsInDisplayMode()
                .and
                .theObjectPageHeaderTitleIsCorrect("4711")
                .and
                .iShouldSeeTheSections(["General Information", "Sales Order Items", "Contacts"])
                .and
                .theObjectPageDataFieldHasTheCorrectValue({ Field: "CurrencyCode", Value: "EUR" });
            Then.onTheObjectPage
                .iCheckNumberOfItemsInTable(1, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
        });

        opaTest("Close the object page and open a draft object from the LR", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iCloseTheObjectPage();
            Then.onTheGenericListReport
                .theListReportPageIsVisible()
                .and
                .theAvailableNumberOfItemsIsCorrect(21);
            When.onTheGenericListReport
                .iNavigateFromListItemByFieldValue({ Field: "SalesOrder", Value: "500000001" });
            Then.onTheGenericObjectPage
                .theObjectPageIsInEditMode()
                .and
                .theObjectPageHeaderTitleIsCorrect("500000001")
                .and
                .iShouldSeeTheSections(["General Information", "Sales Order Items", "Contacts"]);
        });

        opaTest("Check the OP table is populated with the records", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iSelectSectionOrSubSectionByName("Sales Order Items");
            Then.onTheObjectPage
                .iCheckNumberOfItemsInTable(10, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
        });

        opaTest("Open the sub Object page and make some changes and Save", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iNavigateFromObjectPageTableByLineNo("to_Item", 2);
            Then.onTheGenericObjectPage
                .theObjectPageIsInEditMode()
                .and
                .theObjectPageHeaderTitleIsCorrect("30");
            When.onTheObjectPage
                .iEnterValueInField("HT-1000", "com.sap.vocabularies.UI.v1.FieldGroup::Identification::Product::Field")
                .and
                .iClickOnButtonWithText("Apply");
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("500000001");
            Then.onTheObjectPage
                .iCheckRenderedColumnTextOnNthRowOfTable(3, [2], ["HT-1000"], "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
        });

        opaTest("Delete an item from OP table", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iSelectListItemsByLineNo([3], true, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
            When.onTheObjectPage
                .iClickTheButtonOnTableToolBar("Delete", "to_Item::com.sap.vocabularies.UI.v1.LineItem::Table")
                .and
                .iClickTheButtonOnTheDialog("Delete");
        });

        opaTest("Save the OP and check the changes are saved", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iSaveTheDraft();
            Then.onTheGenericObjectPage
                .theObjectPageIsInDisplayMode()
                .and
                .theObjectPageHeaderTitleIsCorrect("500000001")
                .and
                .iShouldSeeTheSections(["General Information", "Sales Order Items", "Contacts"]);
            When.onTheGenericObjectPage
                .iSelectSectionOrSubSectionByName("Sales Order Items");
            Then.onTheObjectPage
                .iCheckNumberOfItemsInTable(9, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
                .and
                .iCheckRenderedColumnTextOnNthRowOfTable(2, [2], ["HT-1000"], "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
            Then.iTeardownMyApp();
        });
    }
);