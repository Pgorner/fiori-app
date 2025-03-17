sap.ui.define(["sap/ui/test/opaQunit"],
    function (opaTest) {
        "use strict";

        QUnit.module("Sales Order with Table Tabs - Opening OP in Edit mode");

        opaTest("Starting the app and loading data and checking the Edit icon on the LR table - tab1", function (Given, When, Then) {
            Given.iStartMyAppInDemokit("sttasalesordertt", "manifestOPDirectEdit");
            When.onTheGenericListReport
                .iExecuteTheSearch();
            Then.onTheGenericListReport
                .theResultListContainsTheCorrectNumberOfItems(5, 1);
            Then.onTheListReportPage
                .iCheckControlPropertiesByControlType("sap.m.IconTabHeader", { "selectedKey": "1" })
                .and
                .iCheckControlPropertiesByControlType("sap.m.ColumnListItem", { "visible": true, "type": "Detail" });
        });

        opaTest("Navigate to OP from first tab and check the OP is opened in edit mode", function (Given, When, Then) {
            When.onTheGenericListReport
                .iNavigateFromListItemByFieldValue({ Field: "SalesOrder", Value: "500000000" });
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("500000000")
                .and
                .theObjectPageIsInEditMode();
        });

        opaTest("Click on Save and check the navigation to LR - tab1", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iSetTheInputFieldWithId("com.sap.vocabularies.UI.v1.Identification::OpportunityID::Field-input", "TEST")
                .and
                .iSaveTheDraft();
            Then.onTheGenericListReport
                .theListReportPageIsVisible()
                .and
                .theResultListContainsTheCorrectNumberOfItems(5, 1);
            Then.onTheListReportPage
                .iCheckControlPropertiesByControlType("sap.m.IconTabHeader", { "selectedKey": "1" })
                .and
                .iCheckRenderedColumnTextOnNthRowOfTable(2, [7], ["TEST"], "responsiveTable-1");
        });

        opaTest("Clicking on Tab2 and check Edit icon on the LR table - tab2", function (Given, When, Then) {
            When.onTheGenericListReport
                .iClickOnIconTabFilter("2");
            Then.onTheGenericListReport
                .theResultListContainsTheCorrectNumberOfItems(6, 2);
            Then.onTheListReportPage
                .iCheckControlPropertiesByControlType("sap.m.IconTabHeader", { "selectedKey": "2" })
                .and
                .iCheckControlPropertiesByControlType("sap.m.ColumnListItem", { "visible": true, "type": "Detail" });
        });

        opaTest("Navigate to OP from second tab and check the OP is opened in edit mode", function (Given, When, Then) {
            When.onTheGenericListReport
                .iNavigateFromListItemByFieldValue({ Field: "SalesOrder", Value: "500000003" });
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("500000003")
                .and
                .theObjectPageIsInEditMode();
        });

        opaTest("Click on Save and check the navigation to LR - tab2", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iSetTheInputFieldWithId("com.sap.vocabularies.UI.v1.Identification::OpportunityID::Field-input", "TEST")
                .and
                .iSaveTheDraft();
            Then.onTheGenericListReport
                .theListReportPageIsVisible()
                .and
                .theResultListContainsTheCorrectNumberOfItems(6, 2);
            Then.onTheListReportPage
                .iCheckControlPropertiesByControlType("sap.m.IconTabHeader", { "selectedKey": "2" })
                .and
                .iCheckRenderedColumnTextOnNthRowOfTable(1, [3], ["TEST"], "responsiveTable-2");
            Then.iTeardownMyApp();
        });
    }
);
