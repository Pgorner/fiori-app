sap.ui.define(["sap/ui/test/opaQunit", "sap/ui/test/Opa5"],
    function (opaTest, Opa5) {
        "use strict";

        QUnit.module("Sales Order No Extensions - Object Page: File Upload check for draft app");

        opaTest("Check the File uploader Icon rendered correctly", function (Given, When, Then) {
            Given.iStartMyAppInDemokit("sttasalesordernoext");
            When.onTheGenericListReport
                .iExecuteTheSearch()
                .and
                .iNavigateFromListItemByLineNo(1);
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("500000001");
            Then.onTheGenericObjectPage
                .iShouldSeeTheButtonWithIcon("sap-icon://upload")
            Then.onTheObjectPage
                .iCheckControlPropertiesByControlType("sap.m.Text", { "visible": true, "text": "" })
        });

        opaTest("#1: Check the uploaded file is text and in edit mode delete icon is rendered properly ", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iNavigateBack();
            When.onTheGenericListReport
                .iNavigateFromListItemByLineNo(0);
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("500000000");
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
            When.onTheGenericObjectPage
                .iClickTheButtonWithId("discard")
                .and
                .iClickTheButtonWithId("back");
            Then.onTheGenericListReport
                .theResultListIsVisible();

        });

        opaTest("#2: Check the uploaded file is xml", function (Given, When, Then) {
            When.onTheGenericListReport
                .iNavigateFromListItemByLineNo(2);
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("500000002");
            Then.onTheObjectPage
                .iCheckControlPropertiesByControlType("sap.ui.core.Icon", { "src": "sap-icon://attachment-html", "useIconTooltip": true })
                .and
                .iCheckControlPropertiesByControlType("sap.m.Link", { "visible": true, "text": "File500000002.xml" });
        });

        opaTest("#3: Check the  uploaded file is pdf", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iNavigateBack();
            Then.onTheGenericListReport
                .theResultListIsVisible();
            When.onTheGenericListReport
                .iNavigateFromListItemByLineNo(4);
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("500000004");
            Then.onTheObjectPage
                .iCheckControlPropertiesByControlType("sap.ui.core.Icon", { "src": "sap-icon://pdf-attachment", "useIconTooltip": true })
                .and
                .iCheckControlPropertiesByControlType("sap.m.Link", { "visible": true, "text": "File500000004.pdf" });
        });
        opaTest("#4: Check the uploaded file is document", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iNavigateBack();
            Then.onTheGenericListReport
                .theResultListIsVisible();
            When.onTheGenericListReport
                .iNavigateFromListItemByLineNo(8);
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("500000008");
            Then.onTheObjectPage
                .iCheckControlPropertiesByControlType("sap.ui.core.Icon", { "src": "sap-icon://doc-attachment", "useIconTooltip": true })
                .and
                .iCheckControlPropertiesByControlType("sap.m.Link", { "visible": true, "text": "File500000008.docx" });

        });

        opaTest("#5: Check the uploaded file is image", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iNavigateBack();
            Then.onTheGenericListReport
                .theResultListIsVisible();
            When.onTheGenericListReport
                .iNavigateFromListItemByLineNo(9);
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("500000009");
            Then.onTheObjectPage
                .iCheckControlPropertiesByControlType("sap.ui.core.Icon", { "src": "sap-icon://attachment-photo", "useIconTooltip": true })
                .and
                .iCheckControlPropertiesByControlType("sap.m.Link", { "visible": true, "text": "File500000009.gif" });

        });

        opaTest("#6: Check the uploaded file is zip", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iNavigateBack();
            Then.onTheGenericListReport
                .theResultListIsVisible();
            When.onTheGenericListReport
                .iNavigateFromListItemByLineNo(11);
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("500000011");
            Then.onTheObjectPage
                .iCheckControlPropertiesByControlType("sap.ui.core.Icon", { "src": "sap-icon://attachment-zip-file", "useIconTooltip": true })
                .and
                .iCheckControlPropertiesByControlType("sap.m.Link", { "visible": true, "text": "File500000011.zip" });
            Then.iTeardownMyApp();

        });

    }
);
