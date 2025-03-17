sap.ui.define(["sap/ui/test/opaQunit"],
    function (opaTest) {
        "use strict";

        QUnit.module("Sales Order SmartList - Standard List Navigation");

        opaTest("Starting the app and loading data - Standard List on LR", function (Given, When, Then) {
            Given.iStartMyAppInSandbox("STTASOWD20-STTASOWD20,SalesOrder-List#SalesOrder-List");
            When.onTheGenericListReport
                .iLookAtTheScreen();
            Then.onTheGenericListReport
                .theListReportPageIsVisible();
            Then.onTheListReportPage
                .iShouldSeeTheSmartListWithListItemType("sap.m.StandardListItem")
                .and
                .iShouldSeeTheChevronIconOnTheSmartListItem();
        });

        opaTest("Navigate to OP from Standard List and come back and check the navigated row highlight", function (Given, When, Then) {
            When.onTheListReportPage
                .iNavigateFromSmartListItemByLineNo(0);
            Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000000");
            When.onTheGenericObjectPage
                .iCloseTheObjectPage();
            Then.onTheGenericListReport
                .theListReportPageIsVisible();
            Then.onTheListReportPage
                .iShouldSeeTheSmartListWithListItemType("sap.m.StandardListItem")
                .and
                .iShouldSeeTheNavigatedRowHighlighted(0, true, "SmartList-ui5list");
        });

        opaTest("Navigate to external app from Standard List and come back", function (Given, When, Then) {
            When.onTheListReportPage
                .iNavigateFromSmartListItemByLineNo(8);
            Then.onTheGenericListReport
				.iSeeShellHeaderWithTitle("Sales Order w/o Extensions");
            When.onTheGenericListReport
                .iClickTheBackButtonOnFLP();
            Then.onTheGenericListReport
                .theListReportPageIsVisible();
            Then.onTheListReportPage
                .iShouldSeeTheSmartListWithListItemType("sap.m.StandardListItem");
            Then.iTeardownMyApp();
        });
    }
);
