sap.ui.define(["sap/ui/test/opaQunit"],
    function (opaTest) {
        "use strict";

        QUnit.module("Sales Order SmartList - Object List");

        opaTest("Starting the app and loading data - LR having Object List with 3 datafields and 3 data points", function (Given, When, Then) {
            Given.iStartMyAppInDemokit("sttasalesordersmartlist", "manifest_ObjList");
            When.onTheGenericListReport
                .iLookAtTheScreen();
            Then.onTheGenericListReport
                .theListReportPageIsVisible();
            Then.onTheListReportPage
                .iShouldSeeTheSmartListWithListItemType("sap.m.ObjectListItem")
                .and
                .iCheckTheObjectListItemPropertiesOnSmartList(0, {
                    "title": "500000000", "number": "25867.03 EUR", "numberState": "None",
                    "firstStatusText": "21737.00 EUR", "firstStatusState": "Warning",
                    "secondStatusText": "4.270 KG", "secondStatusState": "Success",
                    "firstObjAttributeText": "DEMO_USER1", "secondObjAttributeText": "HT-1000"
                })
                .and
                .iCheckTheObjectListItemPropertiesOnSmartList(1, {
                    "title": "500000001", "number": "14602.49 USD", "numberState": "Error",
                    "firstStatusText": "12271.00 USD", "firstStatusState": "Warning",
                    "secondStatusText": "5.640 MG", "secondStatusState": "Success",
                    "firstObjAttributeText": "DEMO_USER2", "secondObjAttributeText": "HT-1001"
                })
                .and
                .iCheckTheObjectListItemPropertiesOnSmartList(2, {
                    "title": "500000002", "number": "5631.08 INR", "numberState": "Warning",
                    "firstStatusText": "4732.00 INR", "firstStatusState": "Warning",
                    "secondStatusText": "7.510 TO", "secondStatusState": "Success",
                    "firstObjAttributeText": "DEMO_USER3", "secondObjAttributeText": "HT-1002"
                })
                .and
                .iCheckTheObjectListItemPropertiesOnSmartList(3, {
                    "title": "500000003", "number": "1704.04 EUR", "numberState": "Success",
                    "firstStatusText": "1431.97 EUR", "firstStatusState": "Warning",
                    "secondStatusText": "8.320 G", "secondStatusState": "Success",
                    "firstObjAttributeText": "EPM_DEMO", "secondObjAttributeText": "HT-1003"
                });
            Then.iTeardownMyApp();
        });

        opaTest("Starting the app and loading data - LR having Object List with 4 datafields and 2 data points", function (Given, When, Then) {
            Given.iStartMyAppInDemokit("sttasalesordersmartlist", "manifest_ObjList_Two_DataPoint");
            When.onTheGenericListReport
                .iLookAtTheScreen();
            Then.onTheGenericListReport
                .theListReportPageIsVisible();
            Then.onTheListReportPage
                .iShouldSeeTheSmartListWithListItemType("sap.m.ObjectListItem")
                .and
                .iCheckTheObjectListItemPropertiesOnSmartList(0, {
                    "title": "500000000", "number": "25867.03 EUR", "numberState": "None",
                    "firstStatusText": "4.270 KG", "firstStatusState": "Warning",
                    "secondStatusText": "100000000", "secondStatusState": "None",
                    "firstObjAttributeText": "DEMO_USER1", "secondObjAttributeText": "HT-1000"
                })
                .and
                .iCheckTheObjectListItemPropertiesOnSmartList(1, {
                    "title": "500000001", "number": "14602.49 USD", "numberState": "Error",
                    "firstStatusText": "5.640 MG", "firstStatusState": "Warning",
                    "secondStatusText": "100000004", "secondStatusState": "None",
                    "firstObjAttributeText": "DEMO_USER2", "secondObjAttributeText": "HT-1001"
                })
                .and
                .iCheckTheObjectListItemPropertiesOnSmartList(2, {
                    "title": "500000002", "number": "5631.08 INR", "numberState": "Warning",
                    "firstStatusText": "7.510 TO", "firstStatusState": "Warning",
                    "secondStatusText": "100000010", "secondStatusState": "None",
                    "firstObjAttributeText": "DEMO_USER3", "secondObjAttributeText": "HT-1002"
                })
                .and
                .iCheckTheObjectListItemPropertiesOnSmartList(3, {
                    "title": "500000003", "number": "1704.04 EUR", "numberState": "Success",
                    "firstStatusText": "8.320 G", "firstStatusState": "Warning",
                    "secondStatusText": "100000012", "secondStatusState": "None",
                    "firstObjAttributeText": "EPM_DEMO", "secondObjAttributeText": "HT-1003"
                });
            Then.iTeardownMyApp();
        });

        opaTest("Starting the app and loading data - LR having Object List with 5 datafields and 1 data point", function (Given, When, Then) {
            Given.iStartMyAppInDemokit("sttasalesordersmartlist", "manifest_ObjList_One_DataPoint");
            When.onTheGenericListReport
                .iLookAtTheScreen();
            Then.onTheGenericListReport
                .theListReportPageIsVisible();
            Then.onTheListReportPage
                .iShouldSeeTheSmartListWithListItemType("sap.m.ObjectListItem")
                .and
                .iCheckTheObjectListItemPropertiesOnSmartList(0, {
                    "title": "500000000", "number": "25867.03 EUR", "numberState": "None",
                    "firstStatusText": "HT-1000", "firstStatusState": "None",
                    "secondStatusText": "EUR", "secondStatusState": "None",
                    "firstObjAttributeText": "DEMO_USER1", "secondObjAttributeText": "100000000"
                })
                .and
                .iCheckTheObjectListItemPropertiesOnSmartList(1, {
                    "title": "500000001", "number": "14602.49 USD", "numberState": "Error",
                    "firstStatusText": "HT-1001", "firstStatusState": "None",
                    "secondStatusText": "USD", "secondStatusState": "None",
                    "firstObjAttributeText": "DEMO_USER2", "secondObjAttributeText": "100000004"
                })
                .and
                .iCheckTheObjectListItemPropertiesOnSmartList(2, {
                    "title": "500000002", "number": "5631.08 INR", "numberState": "Warning",
                    "firstStatusText": "HT-1002", "firstStatusState": "None",
                    "secondStatusText": "INR", "secondStatusState": "None",
                    "firstObjAttributeText": "DEMO_USER3", "secondObjAttributeText": "100000010"
                })
                .and
                .iCheckTheObjectListItemPropertiesOnSmartList(3, {
                    "title": "500000003", "number": "1704.04 EUR", "numberState": "Success",
                    "firstStatusText": "HT-1003", "firstStatusState": "None",
                    "secondStatusText": "EUR", "secondStatusState": "None",
                    "firstObjAttributeText": "EPM_DEMO", "secondObjAttributeText": "100000012"
                });
            Then.iTeardownMyApp();
        });

        opaTest("Starting the app and loading data - LR having Object List with 6 datafields and no data point", function (Given, When, Then) {
            Given.iStartMyAppInDemokit("sttasalesordersmartlist", "manifest_ObjList_NoDataPoint");
            When.onTheGenericListReport
                .iLookAtTheScreen();
            Then.onTheGenericListReport
                .theListReportPageIsVisible();
            Then.onTheListReportPage
                .iShouldSeeTheSmartListWithListItemType("sap.m.ObjectListItem")
                .and
                .iCheckTheObjectListItemPropertiesOnSmartList(0, {
                    "title": "500000000", "number": "HT-1000", "numberState": "None",
                    "firstStatusText": "100000000", "firstStatusState": "None",
                    "secondStatusText": "25867.03 EUR", "secondStatusState": "None",
                    "firstObjAttributeText": "DEMO_USER1", "secondObjAttributeText": "EUR"
                })
                .and
                .iCheckTheObjectListItemPropertiesOnSmartList(1, {
                    "title": "500000001", "number": "HT-1001", "numberState": "None",
                    "firstStatusText": "100000004", "firstStatusState": "None",
                    "secondStatusText": "14602.49 USD", "secondStatusState": "None",
                    "firstObjAttributeText": "DEMO_USER2", "secondObjAttributeText": "USD"
                })
                .and
                .iCheckTheObjectListItemPropertiesOnSmartList(2, {
                    "title": "500000002", "number": "HT-1002", "numberState": "None",
                    "firstStatusText": "100000010", "firstStatusState": "None",
                    "secondStatusText": "5631.08 INR", "secondStatusState": "None",
                    "firstObjAttributeText": "DEMO_USER3", "secondObjAttributeText": "INR"
                })
                .and
                .iCheckTheObjectListItemPropertiesOnSmartList(3, {
                    "title": "500000003", "number": "HT-1003", "numberState": "None",
                    "firstStatusText": "100000012", "firstStatusState": "None",
                    "secondStatusText": "1704.04 EUR", "secondStatusState": "None",
                    "firstObjAttributeText": "EPM_DEMO", "secondObjAttributeText": "EUR"
                });
        });

        opaTest("Navigate to OP of different entityset from Object List", function (Given, When, Then) {
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
                .iShouldSeeTheSmartListWithListItemType("sap.m.ObjectListItem")
                .and
                .iShouldSeeTheNavigatedRowHighlighted(1, true, "SmartList-ui5list");
            Then.iTeardownMyApp();
        });
    }
);
