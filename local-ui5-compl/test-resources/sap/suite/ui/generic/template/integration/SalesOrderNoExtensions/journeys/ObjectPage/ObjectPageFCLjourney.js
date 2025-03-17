sap.ui.define(["sap/ui/test/opaQunit"],
    function (opaTest) {
        "use strict";

        QUnit.module("Object Page Flexible Column Layout Journey");

        opaTest("Starting the app and check the focus sets on the first editable field while clicking on create", function (Given, When, Then) {
            Given.iStartMyAppInSandbox("EPMProduct-manage_st,STTASOWD20-STTASOWD20#STTASOWD20-STTASOWD20", "manifestFCLDiscardDraft");
            When.onTheGenericListReport
                .iExecuteTheSearch();
            When.onTheListReportPage
                .iClickTheButtonOnTableToolBar("Create", "listReport");
            Then.onTheGenericObjectPage
                .theObjectPageIsInEditMode();
            Then.onTheGenericObjectPage
                .iExpectFocusSetOnControlById("com.sap.vocabularies.UI.v1.FieldGroup::GeneralInformation::SalesOrder::Field-input");
        });

        opaTest("Enter some values and click on discard button and check the discard draft popover", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iSetTheObjectPageDataField("Amount", "CurrencyCode", "EUR");
            When.onTheGenericObjectPage
                .iClickTheButtonWithId("discard");
            Then.onTheGenericObjectPage
                .iShouldSeeThePopoverWithButtonLabel("Discard");
        });

        opaTest("Keep the draft and navigate to a different object", function (Given, When, Then) {
            When.onTheGenericListReport
                .iNavigateFromListItemByFieldValue({ Field: "SalesOrder", Value: "500000000" });
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("500000000");
        });

        opaTest("Open the previous draft object and click on discard button and check the discard draft popover", function (Given, When, Then) {
            When.onTheGenericListReport
                .iNavigateFromListItemByFieldValue({ Field: "SalesOrder", Value: "4711" });
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("4711")
                .and
                .theObjectPageIsInEditMode();
            When.onTheGenericObjectPage
                .iClickTheButtonWithId("discard");
            Then.onTheGenericObjectPage
                .iShouldSeeThePopoverWithButtonLabel("Discard");
        });

        opaTest("Clicking on Cancel while trying to navigate externally in edit mode", function (Given, When, Then) {
            When.onTheGenericListReport
                .iNavigateFromListItemByFieldValue({ Field: "SalesOrder", Value: "500000000" });
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("500000000");
            When.onTheGenericObjectPage
                .iClickTheEditButton();
            Then.onTheGenericObjectPage
                .theObjectPageIsInEditMode();
            When.onTheGenericObjectPage
                .iClickTheLink("HT-1032");
            Then.onTheGenericListReport
                .iShouldSeeTheDialogWithTitle("Warning");
            When.onTheGenericObjectPage
                .iSelectTheOptionFromDiscardDraftPopUp("Discard Draft")
                .and
                .iClickTheButtonOnTheDialog("OK");
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("Ergo Screen E-III");
            When.onTheGenericObjectPage
                .iClickTheBackButtonOnFLP();
            Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000000")
				.and
				.theObjectPageIsInDisplayMode();
            Then.iTeardownMyApp();
        });
    }
);
