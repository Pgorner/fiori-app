sap.ui.define(["sap/ui/test/opaQunit"],
    function (opaTest) {
        "use strict";

        QUnit.module("Sales Order SmartList Master Details - Object List");

        opaTest("Starting the Master Details app and loading data - Object List on LR", function (Given, When, Then) {
            Given.iStartMyAppInDemokit("sttasalesordersmartlist", "manifest_ObjList_MD");
            When.onTheGenericListReport
                .iLookAtTheScreen();
            Then.onTheGenericFCLApp
				.iCheckFCLLayout("TwoColumnsMidExpanded")
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000000");
            Then.onTheListReportPage
                .iShouldSeeTheSmartListWithListItemType("sap.m.ObjectListItem")
                .and
                .iShouldSeeTheChevronIconOnTheSmartListItem()
                .and
                .iShouldSeeTheNavigatedRowHighlighted(0, true, "SmartList-ui5list");
        });

        opaTest("Open a different Object from the Object List", function (Given, When, Then) {
            When.onTheListReportPage
                .iNavigateFromSmartListItemByLineNo(1);
            Then.onTheGenericFCLApp
				.iCheckFCLLayout("TwoColumnsMidExpanded")
            Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000001");
            Then.onTheListReportPage
                .iShouldSeeTheNavigatedRowHighlighted(1, true, "SmartList-ui5list");
        });

        opaTest("Close the object page and check the LR in full screen", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iCloseTheObjectPage();
            Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithTitle("Warning")
				.and
				.iShouldSeeTheDialogWithContent("You've made changes to this object.\nWhat would you like to do?");
            When.onTheGenericObjectPage
				.iSelectTheOptionFromDiscardDraftPopUp("Discard Draft")
				.and
				.iClickTheButtonOnTheDialog("OK");
            Then.onTheGenericListReport
                .theListReportPageIsVisible();
            Then.onTheListReportPage
                .iShouldSeeTheSmartListWithListItemType("sap.m.ObjectListItem");
            Then.onTheGenericFCLApp
				.iCheckFCLLayout("OneColumn");
            Then.iTeardownMyApp();
        });
    }
);
