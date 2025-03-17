sap.ui.define(["sap/ui/test/opaQunit"],
    function (opaTest) {
        "use strict";

        QUnit.module("Sales order no extensions with Keep Alive Journey");

        opaTest("Starting the application with sap keep alive true and clicking on cancel in discard draft popup while navigating externally", function (Given, When, Then) {
            Given.iStartMyAppInSandbox("EPMProduct-manage_st,STTASOWD20-STTASOWD20#STTASOWD20-STTASOWD20&/C_STTA_SalesOrder_WD_20(SalesOrder='500000002',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)", null, { sapKeepAlive: true });
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("500000002");
            When.onTheGenericObjectPage
                .iClickTheEditButton();
            Then.onTheGenericObjectPage
                .theObjectPageIsInEditMode();
            When.onTheGenericObjectPage
                .iClickTheLink("HT-1056");
            Then.onTheGenericListReport
                .iShouldSeeTheDialogWithTitle("Warning");
            When.onTheGenericObjectPage
                .iSelectTheOptionFromDiscardDraftPopUp("Discard Draft")
                .and
                .iClickTheButtonOnTheDialog("OK");
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("Multi Color");
            When.onTheGenericObjectPage
                .iClickTheBackButtonOnFLP();
            Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000002")
				.and
				.theObjectPageIsInDisplayMode();
            Then.iTeardownMyApp();
        });
    }
);