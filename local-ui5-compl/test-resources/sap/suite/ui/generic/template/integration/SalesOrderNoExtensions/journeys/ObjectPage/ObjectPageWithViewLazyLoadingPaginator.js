sap.ui.define(["sap/ui/test/opaQunit"],
    function (opaTest) {
        "use strict";

        QUnit.module("Object Page Rendering with ViewLazyLoading - Paginator button");

        opaTest("Starting the app and navigate to an active Object page", function (Given, When, Then) {
            Given.iStartMyAppInDemokit("sttasalesordernoext", "manifestViewLazyLoading", { "bWithChange": true });
            When.onTheGenericListReport
                .iExecuteTheSearch()
                .and
                .iNavigateFromListItemByFieldValue({ Field: "SalesOrder", Value: "500000000" });
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("500000000")
                .and
                .iShouldSeeTheSections(["General Information", "Sales Order Items", "Contacts"]);
            When.onTheGenericObjectPage
                .iSelectSectionOrSubSectionByName("Sales Order Items");
            Then.onTheObjectPage
                .iCheckNumberOfItemsInTable(10, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
            When.onTheGenericObjectPage
                .iSelectSectionOrSubSectionByName("Contacts");
            Then.onTheObjectPage
                .iCheckNumberOfItemsInTable(2, "to_BPAContact::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
        });

        opaTest("Move to next object using the paginator button", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iNavigateUpOrDownUsingObjectPageHeaderActionButton("NavigationDown");
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("500000001")
                .and
                .theObjectPageIsInEditMode()
                .and
                .iShouldSeeTheSections(["General Information", "Sales Order Items", "Contacts"]);
            When.onTheGenericObjectPage
                .iSelectSectionOrSubSectionByName("Sales Order Items");
            Then.onTheObjectPage
                .iCheckNumberOfItemsInTable(10, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
            When.onTheGenericObjectPage
                .iSelectSectionOrSubSectionByName("Contacts");
            Then.onTheObjectPage
                .iCheckNumberOfItemsInTable(2, "to_BPAContact::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
        });

        opaTest("Move to next object using the paginator button", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iNavigateUpOrDownUsingObjectPageHeaderActionButton("NavigationUp")
                .and
                .iSelectTheOptionFromDiscardDraftPopUp("Keep Draft")
                .and
                .iClickTheButtonOnTheDialog("OK");
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("500000000")
                .and
                .theObjectPageIsInDisplayMode()
                .and
                .iShouldSeeTheSections(["General Information", "Sales Order Items", "Contacts"]);
            When.onTheGenericObjectPage
                .iSelectSectionOrSubSectionByName("Sales Order Items");
            Then.onTheObjectPage
                .iCheckNumberOfItemsInTable(10, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
            When.onTheGenericObjectPage
                .iSelectSectionOrSubSectionByName("Contacts");
            Then.onTheObjectPage
                .iCheckNumberOfItemsInTable(2, "to_BPAContact::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
        });

        opaTest("Check the uploaded file is rendered on the OP", function (Given, When, Then) {
            Then.onTheObjectPage
                .iCheckControlPropertiesByControlType("sap.ui.core.Icon", { "src": "sap-icon://attachment-text-file", "useIconTooltip": true })
                .and
                .iCheckControlPropertiesByControlType("sap.m.Link", { "visible": true, "text": "File500000000.txt" });
            When.onTheGenericObjectPage
                .iClickTheEditButton();
            Then.onTheGenericObjectPage
                .iShouldSeeTheButtonWithIcon("sap-icon://upload")
                .and
                .iShouldSeeTheButtonWithIcon("sap-icon://sys-cancel");
            Then.iTeardownMyApp();
        });
    }
);