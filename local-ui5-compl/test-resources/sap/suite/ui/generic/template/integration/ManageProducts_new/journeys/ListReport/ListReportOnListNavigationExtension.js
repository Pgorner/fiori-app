sap.ui.define(["sap/ui/test/opaQunit"],
    function (opaTest) {
        "use strict";

        QUnit.module("Check visual indication for the navigated item with onListNavigationExtension - LR");

        opaTest("Check visual indication for the navigated item with onListNavigationExtension - LR Responsive table", function (Given, When, Then) {
            Given.iStartMyAppInDemokit("sttaproducts", "manifestListNavigationExtension");
            When.onTheGenericListReport
                .iExecuteTheSearch();
            When.onTheListReportPage
                .iClickTheItemInResponsiveTable(4);
            Then.onTheListReportPage
                .iShouldSeeTheNavigatedRowHighlighted(4, true);
            When.onTheGenericObjectPage
                .iCloseTheObjectPage();
            Then.onTheListReportPage
                .iShouldSeeTheNavigatedRowHighlighted(4, true);
            Then.iTeardownMyApp();
        });

        opaTest("Check visual indication for the navigated item with onListNavigationExtension - LR Grid table", function (Given, When, Then) {
            Given.iStartMyAppInDemokit("sttaproducts", "manifestLRGridOnListNavigationExtension");
            When.onTheGenericListReport
                .iExecuteTheSearch()
                .and
                .iNavigateFromListItemByLineNo(1);
            When.onTheGenericObjectPage
                .iNavigateBack();
            Then.onTheListReportPage
                .iShouldSeeTheNavigatedRowHighlightedInUITables(1, true, "GridTable");
            Then.iTeardownMyApp();
        });

        opaTest("Check visual indication for the navigated item with onListNavigationExtension - LR Tree table", function (Given, When, Then) {
            Given.iStartMyAppInDemokit("sttaproducts", "manifestLRTreeTableOnListNavigationExtension");
            When.onTheGenericListReport
                .iExecuteTheSearch();
            When.onTheListReportPage
                .iNavigateUsingUITable(3, "TreeTable");
            When.onTheGenericObjectPage
                .iNavigateBack();
            Then.onTheListReportPage
                .iShouldSeeTheNavigatedRowHighlightedInUITables(2, true, "TreeTable");
            Then.iTeardownMyApp();
        });
    }
);
