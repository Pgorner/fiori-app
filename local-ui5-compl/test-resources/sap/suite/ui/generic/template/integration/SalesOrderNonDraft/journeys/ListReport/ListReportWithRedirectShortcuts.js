sap.ui.define(["sap/ui/test/opaQunit"],
    function (opaTest) {
        "use strict";

        QUnit.module("Non Draft List Report with Redirect shortcut");

        opaTest("Custom Create with redirect Create shortcut in LR: Standard Create is hidden and Standard Create is redirected to Custom Create ", function (Given, When, Then) {
            Given.iStartMyAppInDemokit("sttasalesordernd", "manifestKeyboardShortcuts");
            When.onTheListReportPage
                .iLookAtTheScreen();

            Then.onTheGenericListReport
                .iShouldNotSeeTheButtonWithIdInToolbar("template::ListReport::TableToolbar", "addEntry")
                .and
                .theButtonWithLabelIsEnabled("Create Extension", true);

            When.onTheGenericListReport
                .iClickTheButtonWithId("CreateExt");

            Then.onTheGenericListReport
                .iShouldSeeTheDialogWithContent("Custom Create Action triggered");

            When.onTheGenericListReport
                .iClickTheButtonOnTheDialog("OK");
        });

        opaTest("Custom Delete with redirect Delete shortcut in LR: Standard Delete is hidden and Standard Delete is redirected to Custom Delete", function (Given, When, Then) {
            When.onTheListReportPage
                .iLookAtTheScreen();

            Then.onTheGenericListReport
                .iShouldNotSeeTheButtonWithIdInToolbar("template::ListReport::TableToolbar", "deleteEntry");

            When.onTheGenericListReport
                .iExecuteTheSearch()
                .and
                .iSelectListItemsByLineNo([0, 1], true)
                .and
                .iClickTheButtonWithId("DeleteExt");

            Then.onTheGenericListReport
                .iShouldSeeTheDialogWithContent("Custom Delete Action triggered");

            When.onTheGenericListReport
                .iClickTheButtonOnTheDialog("OK");
        });


        opaTest("Custom Edit with redirect Edit shortcut in OP: Standard Edit is hidden and Standard Edit is redirected to Custom Edit", function (Given, When, Then) {
            When.onTheListReportPage
                .iLookAtTheScreen()
                .and
                .iClickTheItemInResponsiveTable(1);

            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("500000011")
                .and
                .iShouldNotSeeTheControlWithId("template::ObjectPage::Edit");

            When.onTheGenericObjectPage
                .iClickTheButtonWithId("action::EditExt");

            Then.onTheGenericObjectPage
                .iShouldSeeTheDialogWithContent("Custom Edit Action triggered");

            When.onTheGenericObjectPage
                .iClickTheButtonOnTheDialog("OK");

        });

        opaTest("Custom Delete with redirect Delete shortcut in OP: Standard Delete is hidden and Standard Delete is redirected to Custom Delete", function (Given, When, Then) {
            Then.onTheGenericObjectPage
                .iShouldNotSeeTheControlWithId("template::ObjectPage::Delete");

            When.onTheGenericObjectPage
                .iClickTheButtonWithId("action::DeleteExt");

            Then.onTheGenericObjectPage
                .iShouldSeeTheDialogWithContent("Custom Delete Action triggered");

            When.onTheGenericObjectPage
                .iClickTheButtonOnTheDialog("OK");

        });
        
        opaTest("Custom Table Entry Create with redirect Table Entry Create shortcut in OP: Standard Table Add Entry is hidden and Standard Table Add Entry is redirected to Custom Table Add Entry", function (Given, When, Then) {
			Then.onTheGenericObjectPage
				.iShouldNotSeeTheButtonWithIdInToolbar("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table::Toolbar","to_Item::com.sap.vocabularies.UI.v1.LineItem::addEntry");

            When.onTheGenericObjectPage
				.iClickTheButtonWithId("MySmartTableAdd");
                
            Then.onTheGenericObjectPage
                .iShouldSeeTheDialogWithContent("Custom Create Table Action triggered");

            When.onTheGenericObjectPage
                .iClickTheButtonOnTheDialog("OK");
        });


        opaTest("Custom Table Entry Delete with redirect Table Entry Delete shortcut in OP: Standard Table Delete Entry is hidden and Standard Table Delete Entry is redirected to Custom Table Delete Entry", function (Given, When, Then) {
			Then.onTheGenericObjectPage
				.iShouldNotSeeTheButtonWithIdInToolbar("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table::Toolbar","to_Item::com.sap.vocabularies.UI.v1.LineItem::deleteEntry");

            When.onTheGenericObjectPage
				.iClickTheButtonWithId("MySmartTableDelete");
                
            Then.onTheGenericObjectPage
                .iShouldSeeTheDialogWithContent("Custom Delete Table Action triggered");

            When.onTheGenericObjectPage
                .iClickTheButtonOnTheDialog("OK");
            
            Then.iTeardownMyApp();
        });
    }
);