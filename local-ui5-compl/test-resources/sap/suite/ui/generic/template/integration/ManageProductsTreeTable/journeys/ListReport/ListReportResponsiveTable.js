sap.ui.define(["sap/ui/test/opaQunit"],
    function (opaTest) {
        "use strict";

        QUnit.module("List Report With Responsive Table Type");

        opaTest("Starting the app with responsive table type and checking the enablement of the multi edit button", function (Given, When, Then) {
            Given.iStartMyAppInDemokit("sttaproductstreetable", "manifestResponsiveTable");
            Then.onTheListReportPage
                .iCheckTableToolbarControlProperty({ "MultiEdit": [true, false] });
            When.onTheGenericListReport
                .iExecuteTheSearch();
            Then.onTheGenericListReport
                .theAvailableNumberOfItemsIsCorrect("10");
            Then.onTheListReportPage
                .iCheckTableToolbarControlProperty({ "MultiEdit": [true, false] });
        });

        opaTest("Checking multi edit button enablement and dialog contents when update restrictions are not defined for the objects", function (Given, When, Then) {
            When.onTheGenericListReport
                .iSelectListItemsByLineNo([0], true);
            Then.onTheListReportPage
                .iCheckTableToolbarControlProperty({ "MultiEdit": [true, true] });
            When.onTheGenericListReport
                .iClickTheButtonWithId("template:::ListReportAction:::MultiEdit");
            Then.onTheListReportPage
                .iVerifyTheMultiEditDialogAttributesAreCorrect("Edit (1)", ["ProductForEdit", "ProductCategory", "Supplier", "Price"]);
            Then.onTheGenericListReport
                .iShouldSeeTheButtonsOnTheDialog(["Save", "Cancel"]);
            When.onTheGenericListReport
                .iClickTheButtonOnTheDialog("Cancel");
            Then.onTheGenericListReport
                .theAvailableNumberOfItemsIsCorrect("10");
            Then.iTeardownMyApp();
        });
    }
);
