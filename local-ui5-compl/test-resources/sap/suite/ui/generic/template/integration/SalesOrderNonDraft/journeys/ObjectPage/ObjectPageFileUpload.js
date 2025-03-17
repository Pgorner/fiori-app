sap.ui.define(["sap/ui/test/opaQunit"],
    function (opaTest) {
        "use strict";

        QUnit.module("Sales Order Non Draft - Object Page: File Upload check for non draft app");

        opaTest("Check the uploaded file rendered inside the table", function (Given, When, Then) {
            Given.iStartMyAppInDemokit("sttasalesordernd#/STTA_C_SO_SalesOrder_ND('500000012')", "manifestFileUploader");
            When.onTheObjectPage
                .iLookAtTheScreen();
            Then.onTheObjectPage
                .iCheckNumberOfItemsInTable(10, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
            Then.onTheObjectPage
                .iCheckRenderedColumnIconLinkOnNthRowOfTableFileUpload(1, 1, ["sap-icon://pdf-attachment", "Test.pdf"], "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
                .and
                .iCheckRenderedColumnTextOnNthRowOfTable(1, [2], ["application/pdf"], "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
            Then.onTheObjectPage
                .iCheckRenderedColumnIconLinkOnNthRowOfTableFileUpload(2, 1, ["sap-icon://attachment-text-file", "Test.txt"], "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
                .and
                .iCheckRenderedColumnTextOnNthRowOfTable(2, [2], ["text/plain"], "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");

            Then.onTheObjectPage
                .iCheckRenderedColumnIconLinkOnNthRowOfTableFileUpload(3, 1, ["sap-icon://excel-attachment", "Test.xlsx"], "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
                .and
                .iCheckRenderedColumnTextOnNthRowOfTable(3, [2], ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"], "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
            Then.onTheObjectPage
                .iCheckRenderedColumnIconLinkOnNthRowOfTableFileUpload(5, 1, ["sap-icon://document", "Test.sh"], "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
                .and
                .iCheckRenderedColumnTextOnNthRowOfTable(5, [2], ["application/x-sh"], "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");

            Then.onTheObjectPage
                .iCheckRenderedColumnIconLinkOnNthRowOfTableFileUpload(6, 1, ["sap-icon://attachment-zip-file", "Test.zip"], "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
                .and
                .iCheckRenderedColumnTextOnNthRowOfTable(6, [2], ["application/zip"], "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
            Then.onTheObjectPage
                .iCheckRenderedColumnIconLinkOnNthRowOfTableFileUpload(8, 1, ["sap-icon://doc-attachment", "Test.docx"], "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
                .and
                .iCheckRenderedColumnTextOnNthRowOfTable(8, [2], ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"], "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");

        });

        opaTest("Check the uploaded file rendered properly in display mode along with upload and cancel icon", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iNavigateFromObjectPageTableByLineNo("to_Item", 0)
            Then.onTheObjectPage
                .iCheckControlPropertiesByControlType("sap.ui.core.Icon", { "src": "sap-icon://pdf-attachment", "useIconTooltip": true })
                .and
                .iCheckControlPropertiesByControlType("sap.m.Link", { "visible": true, "text": "Test.pdf" });
            Then.onTheGenericObjectPage
                .iShouldSeeTheButtonWithIcon("sap-icon://upload")
                .and
                .iShouldSeeTheButtonWithIcon("sap-icon://sys-cancel");

        });

        opaTest("Check the uploaded file rendered properly in edit mode", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iClickTheButtonWithId("edit", "STTA_C_SO_SalesOrderItem_ND");
            Then.onTheGenericObjectPage
                .theObjectPageIsInEditMode();
            Then.onTheObjectPage
                .iCheckControlPropertiesByControlType("sap.ui.core.Icon", { "src": "sap-icon://pdf-attachment", "useIconTooltip": true })
                .and
                .iCheckControlPropertiesByControlType("sap.m.Link", { "visible": true, "text": "Test.pdf" });
            When.onTheGenericObjectPage
                .iClickTheButtonWithId("cancel", "STTA_C_SO_SalesOrderItem_ND");
            When.onTheGenericObjectPage
                .iNavigateBack();
            Then.onTheObjectPage
                .iCheckNumberOfItemsInTable(10, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
            Then.iTeardownMyApp();
        });
    }
);
