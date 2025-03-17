sap.ui.define(["sap/ui/test/opaQunit"],
    function (opaTest) {
        "use strict";

        QUnit.module("Non Draft Object Page with Redirect shortcut");

        opaTest("Custom Save with redirect Save shortcut in OP: Custom Save button is displayed in the place of Standard Save button", function (Given, When, Then) {
            Given.iStartMyAppInDemokit("sttasalesordernd", "manifestRedirectShortcuts");
            When.onTheGenericListReport
                .iExecuteTheSearch()
                .and
                .iNavigateFromListItemByFieldValue({ Field: "SalesOrderID", Value: "500000010" });
            Then.onTheGenericObjectPage
                .theButtonWithIdIsEnabled("edit", true);
            When.onTheGenericObjectPage
                .iClickTheEditButton();
            Then.onTheGenericObjectPage
                .iShouldNotSeeTheControlWithId("save");
            When.onTheGenericObjectPage
                .iClickTheButtonWithId("SaveExt");
            Then.onTheGenericObjectPage
                .iShouldSeeTheDialogWithContent("Custom Save Action triggered");
            When.onTheGenericObjectPage
                .iClickTheButtonOnTheDialog("OK");
            Then.iTeardownMyApp();
        });
    }
);