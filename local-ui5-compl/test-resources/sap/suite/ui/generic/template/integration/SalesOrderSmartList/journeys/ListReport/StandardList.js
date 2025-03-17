sap.ui.define(["sap/ui/test/opaQunit"],
    function (opaTest) {
        "use strict";

        QUnit.module("Sales Order SmartList - Standard List");

        opaTest("Starting the app and loading data - LR having Standard List with one DataPoint annotation", function (Given, When, Then) {
            Given.iStartMyAppInDemokit("sttasalesordersmartlist");
            When.onTheGenericListReport
                .iLookAtTheScreen();
            Then.onTheGenericListReport
                .theListReportPageIsVisible();
            Then.onTheListReportPage
                .iShouldSeeTheSmartListWithListItemType("sap.m.StandardListItem")
                .and
                .iCheckTheStandardListItemPropertiesOnSmartList(0, {
                    "title": "500000000", "description": "DEMO_USER1", "info": "25867.03 EUR",
                    "infoState": "None", "icon": "sample.stta.sales.order.smartlist/webapp/localService/mockdata/images/HT-1000.jpg"
                })
                .and
                .iCheckTheStandardListItemPropertiesOnSmartList(1, {
                    "title": "500000001", "description": "DEMO_USER2", "info": "14602.49 USD",
                    "infoState": "Error", "icon": "sample.stta.sales.order.smartlist/webapp/localService/mockdata/images/HT-1001.jpg"
                })
                .and
                .iCheckTheStandardListItemPropertiesOnSmartList(2, {
                    "title": "500000002", "description": "DEMO_USER3", "info": "5631.08 INR",
                    "infoState": "Warning", "icon": "sample.stta.sales.order.smartlist/webapp/localService/mockdata/images/HT-1002.jpg"
                })
                .and
                .iCheckTheStandardListItemPropertiesOnSmartList(3, {
                    "title": "500000003", "description": "EPM_DEMO", "info": "1704.04 EUR",
                    "infoState": "Success", "icon": "sap-icon://product"
                });
            Then.iTeardownMyApp();
        });

        opaTest("Starting the app and loading data - LR having Standard List without DataPoint annotation", function (Given, When, Then) {
            Given.iStartMyAppInDemokit("sttasalesordersmartlist", "manifest_StdList_NoDataPoint");
            When.onTheGenericListReport
                .iLookAtTheScreen();
            Then.onTheGenericListReport
                .theListReportPageIsVisible();
            Then.onTheListReportPage
                .iShouldSeeTheSmartListWithListItemType("sap.m.StandardListItem")
                .and
                .iCheckTheStandardListItemPropertiesOnSmartList(0, {
                    "title": "500000000", "description": "DEMO_USER1", "info": "25867.03 EUR",
                    "infoState": "None", "icon": "sample.stta.sales.order.smartlist/webapp/localService/mockdata/images/HT-1000.jpg"
                })
                .and
                .iCheckTheStandardListItemPropertiesOnSmartList(1, {
                    "title": "500000001", "description": "DEMO_USER2", "info": "14602.49 USD",
                    "infoState": "None", "icon": "sample.stta.sales.order.smartlist/webapp/localService/mockdata/images/HT-1001.jpg"
                })
                .and
                .iCheckTheStandardListItemPropertiesOnSmartList(2, {
                    "title": "500000002", "description": "DEMO_USER3", "info": "5631.08 INR",
                    "infoState": "None", "icon": "sample.stta.sales.order.smartlist/webapp/localService/mockdata/images/HT-1002.jpg"
                })
                .and
                .iCheckTheStandardListItemPropertiesOnSmartList(3, {
                    "title": "500000003", "description": "EPM_DEMO", "info": "1704.04 EUR",
                    "infoState": "None", "icon": "sap-icon://product"
                });
        });

        opaTest("Navigate to OP of different entityset from Standard List", function (Given, When, Then) {
            When.onTheListReportPage
                .iNavigateFromSmartListItemByLineNo(1);
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("100000004");
            Then.onTheObjectPage
                .iCheckObjectPageEntitySet("I_STTA_BusinessPartner");
        });

        opaTest("Come back to LR page and check the navigated row is highlighted", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iCloseTheObjectPage();
            Then.onTheGenericListReport
                .theListReportPageIsVisible();
            Then.onTheListReportPage
                .iShouldSeeTheSmartListWithListItemType("sap.m.StandardListItem")
                .and
                .iShouldSeeTheNavigatedRowHighlighted(1, true, "SmartList-ui5list");
            Then.iTeardownMyApp();
        });
    }
);
