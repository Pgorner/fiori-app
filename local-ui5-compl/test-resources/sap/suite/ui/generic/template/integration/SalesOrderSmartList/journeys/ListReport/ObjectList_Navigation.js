sap.ui.define(["sap/ui/test/opaQunit"],
    function (opaTest) {
        "use strict";

        QUnit.module("Sales Order SmartList - Object List Navigation");

        opaTest("Starting the app and loading data - Object List on LR", function (Given, When, Then) {
            Given.iStartMyAppInSandbox("STTASOWD20-STTASOWD20,SalesOrder-List#SalesOrder-List", "manifest_ObjList");
            When.onTheGenericListReport
                .iLookAtTheScreen();
            Then.onTheGenericListReport
                .theListReportPageIsVisible();
            Then.onTheListReportPage
                .iShouldSeeTheSmartListWithListItemType("sap.m.ObjectListItem")
                .and
                .iShouldSeeTheChevronIconOnTheSmartListItem();
        });

        opaTest("Navigate to OP from Object List and come back and check the navigated row highlight", function (Given, When, Then) {
            When.onTheListReportPage
                .iNavigateFromSmartListItemByLineNo(0);
            Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000000");
            Then.onTheObjectPage
                .iCheckObjectPageEntitySet("C_STTA_SalesOrder_WD_20");
            When.onTheGenericObjectPage
                .iCloseTheObjectPage();
            Then.onTheGenericListReport
                .theListReportPageIsVisible();
            Then.onTheListReportPage
                .iShouldSeeTheSmartListWithListItemType("sap.m.ObjectListItem")
                .and
                .iShouldSeeTheNavigatedRowHighlighted(0, true, "SmartList-ui5list");
        });

        opaTest("Navigate to external app from Object List and come back", function (Given, When, Then) {
            When.onTheListReportPage
                .iNavigateFromSmartListItemByLineNo(8);
            Then.onTheGenericListReport
				.iSeeShellHeaderWithTitle("Sales Order w/o Extensions");
            When.onTheGenericListReport
                .iClickTheBackButtonOnFLP();
            Then.onTheGenericListReport
                .theListReportPageIsVisible();
            Then.onTheListReportPage
                .iShouldSeeTheSmartListWithListItemType("sap.m.ObjectListItem");
            Then.iTeardownMyApp();
        });
    }
);
