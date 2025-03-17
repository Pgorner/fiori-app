sap.ui.define(["sap/ui/test/opaQunit", "sap/ui/test/Opa5"],
    function (opaTest, Opa5) {
        "use strict";

        QUnit.module("Sales Order No Extensions - List Report: Control Variant");

        opaTest("Smart control Variant - rendering on start-up ", function (Given, When, Then) {
            Given.iStartMyAppInSandboxWithNoParams("#STTASOWD20-STTASOWD20");
            When.onTheGenericListReport
                .iLookAtTheScreen();
            Then.onTheListReportPage
                .theCorrectSmartVariantIsSelected("Standard")
                .and
                .iCheckTheSelectedVariantIsModified(false, "listReport-variant");
            Then.onTheGenericListReport
                .theAvailableNumberOfItemsIsCorrect(20);
        });

        opaTest("Adding a filter in the smart filter bar and pinning the header", function (Given, When, Then) {
            When.onTheGenericListReport
                .iClickTheButtonWithId("listReportFilter-btnFilters");
            Then.onTheGenericListReport
                .iShouldSeeTheDialogWithTitle("Adapt Filters");
            When.onTheListReportPage
                .iAddColumnFromP13nDialog("Action for IBN");
            When.onTheGenericListReport
                .iClickTheButtonOnTheDialog("OK");
            When.onTheListReportPage
                .iLookAtTheScreen();
            Then.onTheListReportPage
                .iCheckControlPropertiesById("listReportFilter-filterItemControlA_-IBNAction", { "enabled": true, "editable": true });
            When.onTheListReportPage
                .iClickTheControlByControlType("sap.m.ToggleButton", { "icon": "sap-icon://pushpin-off" });
        });

        opaTest("Saving a new control variant with removing a column as personalization changes", function (Given, When, Then) {
            When.onTheGenericListReport
                .iExecuteTheSearch();
            When.onTheListReportPage
                .iClickTheButtonOnTableToolBar("Settings", "listReport");
            When.onTheListReportPage
                .iAddColumnFromP13nDialog("Opportunity ID");
            When.onTheGenericListReport
                .iClickTheButtonHavingLabel("OK");
            Then.onTheListReportPage
                .iCheckTableColumnVisibility("Opportunity ID", false,"C_STTA_SalesOrder_WD_20--responsiveTable");
            When.onTheListReportPage
                .iClickOnVariantById("listReport-variant-vm");
            When.onTheGenericListReport
                .iClickTheButtonHavingLabel("Save As");
            When.onTheListReportPage
                .iEnterValueInField("Test", "listReport-variant-vm-name")
                .and
                .iClickOnCheckboxWithText("Set as Default", "listReport-variant-vm-default");
            When.onTheGenericListReport
                .iClickTheButtonHavingLabel("Save");
            Then.onTheListReportPage
                .theCorrectSmartVariantIsSelected("Test", "listReport-variant-vm");
        });

        opaTest("Saving the newly created control variant as save as tile", function (Given, When, Then) {
            When.onTheGenericListReport
                .iClickTheButtonWithId("template::Share-internalBtn");
            When.onTheListReportPage
                .iClickMenuItem("Save as Tile");
            Then.onTheGenericListReport
                .iShouldSeeTheDialogWithTitle("Save as Tile");
            When.onTheListReportPage
				.iClickOnPagesMultiInputOnSaveAsTileDialog();
			When.onTheListReportPage
				.iClickOnCheckboxWithText("", "SelectedNodesComboBox-ValueHelpDialog--ContentNodesTree-1-selectMulti");
			When.onTheListReportPage
				.iClickTheButtonOnTheDialog("Apply");
            When.onTheGenericListReport
                .iClickTheButtonOnTheDialog("Save");
            Then.onTheGenericListReport
                .iShouldSeeTheMessageToastWithText("The tile was created and added to your page.")
        });

        opaTest("Launching the saved tile and checking the control variant,smart filterbar changes and pin header button", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iClickOnItemFromTheShellNavigationMenu("Home");
            When.onTheFLPPage
                .iClickTheControlByControlType("sap.m.GenericTile", { "visible": true, "header": "Sales Order w/o Extensions" });
            Then.onTheListReportPage
                .theCorrectSmartVariantIsSelected("Test", "listReport-variant-vm")
                .and
                .iCheckTheSelectedVariantIsModified(false, "listReport-variant")
                .and
                .iCheckTableColumnVisibility("Opportunity ID", false,"C_STTA_SalesOrder_WD_20--responsiveTable")
                .and
                .iCheckControlPropertiesById("listReportFilter-filterItemControlA_-IBNAction", { "enabled": true, "editable": true })
                .and
                .iCheckControlPropertiesById("template:::ListReportPage:::DynamicPageHeader-pinBtn", { "enabled": true, "pressed": true });

        });

        opaTest("Delete the newly created variant", function (Given, When, Then) {
            When.onTheListReportPage
                .iClickOnVariantById("listReport-variant-vm");
            When.onTheGenericListReport
                .iClickTheButtonHavingLabel("Manage")
                .and
                .iClickTheButtonWithIcon("sap-icon://decline")
                .and
                .iClickTheButtonHavingLabel("Save");
            Then.onTheListReportPage
                .theCorrectSmartVariantIsSelected("Standard", "listReport-variant-vm");
        });

        opaTest("Navigate to OP and create a new control variant for OP table after adding a column from table personalisation", function (Given, When, Then) {
            When.onTheGenericListReport
                .iNavigateFromListItemByLineNo(0);
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("500000000");
            When.onTheObjectPage
                .iClickTheButtonOnTableToolBar("Settings", "to_Item::com.sap.vocabularies.UI.v1.LineItem::Table")
                .and
                .iAddColumnFromP13nDialog("Opportunity Item ID");
            When.onTheGenericObjectPage
                .iClickTheButtonHavingLabel("OK");
            Then.onTheObjectPage
                .iCheckTableColumnVisibility("Opportunity Item ID", true, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
            When.onTheObjectPage
                .iClickOnVariantById("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-variant-vm");
            When.onTheGenericObjectPage
                .iClickTheButtonHavingLabel("Save As");
            When.onTheObjectPage
                .iEnterValueInField("Test", "to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-variant-vm-name")
                .and
                .iClickOnCheckboxWithText("Set as Default", "to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-variant-vm-default");
            When.onTheGenericObjectPage
                .iClickTheButtonHavingLabel("Save");
            Then.onTheObjectPage
                .theCorrectSmartVariantIsSelected("Test", "to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-variant-vm");
        });

        opaTest("Navigate back to LR and open a different record and check the custom variant is selected for the table which is set as default", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iClickTheBackButtonOnFLP();
            When.onTheGenericListReport
                .iNavigateFromListItemByLineNo(2);
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("500000002");
            Then.onTheObjectPage
                .theCorrectSmartVariantIsSelected("Test", "to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-variant-vm")
                .and
                .iCheckTableColumnVisibility("Opportunity Item ID", true, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
        });

        opaTest("Delete the newly created variant", function (Given, When, Then) {
            When.onTheObjectPage
                .iClickOnVariantById("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-variant-vm");
            When.onTheGenericObjectPage
                .iClickTheButtonHavingLabel("Manage")
                .and
                .iClickTheButtonWithIcon("sap-icon://decline")
                .and
                .iClickTheButtonHavingLabel("Save");
            Then.onTheObjectPage
                .theCorrectSmartVariantIsSelected("Standard", "to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-variant-vm");
            Then.iTeardownMyApp();
        });
    }
);
