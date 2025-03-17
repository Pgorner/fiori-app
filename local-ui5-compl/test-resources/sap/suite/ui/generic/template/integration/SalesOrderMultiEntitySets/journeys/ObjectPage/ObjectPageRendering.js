sap.ui.define([
    "sap/ui/test/opaQunit"
],
    function (opaTest) {
        "use strict";

        QUnit.module("Sales Order Multi EntitySets- Object Page rendering");

        opaTest("Starting the Object page of the application and checking the custom message above Object Page table", function (Given, When, Then) {
            Given.iStartMyAppInDemokit("sttasalesordermultientity#/C_STTA_SalesOrder_WD_20(SalesOrder='500000003',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)");
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("500000003");
            When.onTheObjectPage
                .iLookAtTheScreen();
            Then.onTheObjectPage
                .theSmartTableIsVisible("C_STTA_SalesOrder_WD_20--SalesOrderItemsID::Table")
            Then.onTheObjectPage
                .iCheckMessageStripValueOnTable("C_STTA_SalesOrder_WD_20--SalesOrderItemsID::responsiveTable", "Success", "Custom message on object page table");
        });

        opaTest("Check the Invisible text for the Edit button when the ObjectPage title is coming from apply function odata.concat", function (Given, When, Then) {
            When.onTheObjectPage
                .iLookAtTheScreen();
            Then.onTheObjectPage
                .iCheckControlPropertiesById("template:::ObjectPageAction:::EditText", { "text": "Edit: 500000003" });
            Then.iTeardownMyApp();
        });
    }
);