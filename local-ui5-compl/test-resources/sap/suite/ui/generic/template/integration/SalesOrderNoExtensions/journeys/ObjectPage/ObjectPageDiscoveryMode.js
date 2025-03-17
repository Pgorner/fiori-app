sap.ui.define(["sap/ui/test/opaQunit"],
    function (opaTest) {
        "use strict";

        QUnit.module("Object Page - Discovery mode checks");

        opaTest("Starting the FCL app and loading the OP", function (Given, When, Then) {
            Given.iStartMyAppInDemokit("sttasalesordernoext", "manifestMD", null, { width: "1400", height: "600" });
            When.onTheGenericListReport
                .iExecuteTheSearch()
                .and
                .iNavigateFromListItemByFieldValue({ Field: "SalesOrder", Value: "500000000" });
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("500000000");
        });

        opaTest("Pin the object page header", function (Given, When, Then) {
			When.onTheObjectPage
				.iClickTheControlWithId("objectPage-OPHeaderContent-pinBtn");
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.uxap.ObjectPageLayout", {"headerContentPinned": true});
		});

        opaTest("Select the Sales Order Items tab and make changes from table personalisation", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iSelectSectionOrSubSectionByName("Sales Order Items");
            When.onTheObjectPage
                .iRemoveAllTheCustomVariantsForTheTable("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table")
                .and
                .iClickTheButtonOnTableToolBar("Settings", "to_Item::com.sap.vocabularies.UI.v1.LineItem::Table")
                .and
                .iAddColumnFromP13nDialog("Sales Order ID")
                .and
                .iClickTheControlByControlType("sap.m.IconTabFilter", { "text": "Sort" });
            When.onTheGenericObjectPage
                .iChoosetheItemInComboBox("Total Gross Amount");
            When.onTheObjectPage
                .iClickTheControlByControlType("sap.m.IconTabFilter", { "text": "Group" });
            When.onTheGenericObjectPage
                .iChoosetheItemInComboBox("ISO Currency Code")
                .and
                .iClickTheButtonHavingLabel("OK");
            Then.onTheObjectPage
                .iCheckTableColumnVisibility("Sales Order ID", true, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
                .and
                .iCheckControlPropertiesById("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-GrossAmount", { "visible": true, "sortIndicator": "Ascending" })
                .and
                .iCheckGroupHeaderTitleOnTable("ISO Currency Code:", 1, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
        });

        opaTest("Open another record from LR and check the Object page header pin status is not persisted", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iSelectSectionOrSubSectionByName("Sales Order Items");
            When.onTheGenericListReport
                .iNavigateFromListItemByFieldValue({ Field: "SalesOrder", Value: "500000002" });
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("500000002");
            Then.onTheObjectPage
                .iCheckControlPropertiesByControlType("sap.uxap.ObjectPageLayout", { "headerContentPinned": false });
        });

        opaTest("Check the tab selection and table personalisation changes are not persisted", function (Given, When, Then) {
            Then.onTheGenericObjectPage
                .iCheckSelectedSectionByIdOrName("General Information");
            Then.onTheObjectPage
                .iCheckTableColumnVisibility("Sales Order ID", false, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
                .and
                .iCheckControlPropertiesById("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-GrossAmount", { "visible": true, "sortIndicator": "None" });
        });

        opaTest("Save a new variant for SalesOrderItem table", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iClickOnSmartVariantViewSelection("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-variant-vm-trigger")
                .and
                .iClickTheButtonWithId("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-variant-vm-saveas")
                .and
                .iSetTheInputFieldWithId("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-variant-vm-name", "Test")
                .and
                .iClickTheButtonOnTheDialog("Save");
            Then.onTheObjectPage
                .theCorrectSmartVariantIsSelected("Test", "to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-variant-vm");
        });

        opaTest("Open another record from LR and check the table variant selection is not persisted", function (Given, When, Then) {
            When.onTheGenericListReport
                .iNavigateFromListItemByFieldValue({ Field: "SalesOrder", Value: "500000003" });
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("500000003")
            Then.onTheObjectPage
                .theCorrectSmartVariantIsSelected("Standard", "to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-variant-vm");
        });

        opaTest("Delete the newly created variant", function (Given, When, Then) {
            When.onTheObjectPage
                .iClickOnVariantById("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-variant-vm");
            When.onTheGenericListReport
                .iClickTheButtonHavingLabel("Manage")
                .and
                .iClickTheButtonWithIcon("sap-icon://decline")
                .and
                .iClickTheButtonHavingLabel("Save");
            Then.onTheObjectPage
                .theCorrectSmartVariantIsSelected("Standard", "to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-variant-vm");
            Then.iTeardownMyApp();
        });

        opaTest("Starting the app and loading the OP with Paginator button", function (Given, When, Then) {
            Given.iStartMyAppInDemokit("sttasalesordernoext", "manifestSPV", { "bWithChange": true });
            When.onTheGenericListReport
                .iNavigateFromListItemByFieldValue({ Field: "SalesOrder", Value: "500000001" });
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("500000001");
        });

        opaTest("No discard draft popup appears on navigating via paginator button when set to never in manifest", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateUpOrDownUsingObjectPageHeaderActionButton("NavigationDown");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000019");
		});

        opaTest("Pin the object page header", function (Given, When, Then) {
            When.onTheObjectPage
                .iClickTheControlWithId("objectPage-OPHeaderContent-pinBtn");
            Then.onTheObjectPage
                .iCheckControlPropertiesByControlType("sap.uxap.ObjectPageLayout", { "headerContentPinned": true });
        });

        opaTest("Select the Sales Order Items tab and make changes from table personalisation", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iSelectSectionOrSubSectionByName("Sales Order Items");
            When.onTheObjectPage
                .iRemoveAllTheCustomVariantsForTheTable("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table");
            When.onTheGenericObjectPage
                .iClickTheControlWithId("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-btnPersonalisation");
            When.onTheObjectPage
                .iAddColumnFromP13nDialog("Sales Order ID")
                .and
                .iClickTheControlByControlType("sap.m.IconTabFilter", { "text": "Sort" });
            When.onTheGenericObjectPage
                .iChoosetheItemInComboBox("Total Gross Amount");
            When.onTheObjectPage
                .iClickTheControlByControlType("sap.m.IconTabFilter", { "text": "Group" });
            When.onTheGenericObjectPage
                .iChoosetheItemInComboBox("ISO Currency Code")
                .and
                .iClickTheButtonHavingLabel("OK");
            Then.onTheObjectPage
                .iCheckTableColumnVisibility("Sales Order ID", true, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
                .and
                .iCheckControlPropertiesById("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-GrossAmount", { "visible": true, "sortIndicator": "Ascending" })
                .and
                .iCheckGroupHeaderTitleOnTable("ISO Currency Code:", 1, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
        });

        opaTest("Move to a different object using paginator button and check the Object page header pin status is not persisted", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iSelectSectionOrSubSectionByName("Sales Order Items");
            When.onTheGenericObjectPage
                .iNavigateUpOrDownUsingObjectPageHeaderActionButton("NavigationDown");
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("500000007");
            Then.onTheObjectPage
                .iCheckControlPropertiesByControlType("sap.uxap.ObjectPageLayout", { "headerContentPinned": false });
        });

        opaTest("Check the tab selection and table personalisation changes are not persisted", function (Given, When, Then) {
            Then.onTheGenericObjectPage
                .iCheckSelectedSectionByIdOrName("General Information");
            When.onTheGenericObjectPage
                .iSelectSectionOrSubSectionByName("Sales Order Items");
            Then.onTheObjectPage
                .iCheckTableColumnVisibility("Sales Order ID", false, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
                .and
                .iCheckControlPropertiesById("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-GrossAmount", { "visible": true, "sortIndicator": "None" });
        });

        opaTest("Save a new variant for SalesOrderItem table", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iClickOnSmartVariantViewSelection("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-variant-vm-trigger")
                .and
                .iClickTheButtonWithId("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-variant-vm-saveas")
                .and
                .iSetTheInputFieldWithId("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-variant-vm-name", "Test")
                .and
                .iClickTheButtonOnTheDialog("Save");
            Then.onTheObjectPage
                .theCorrectSmartVariantIsSelected("Test", "to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-variant-vm");
        });

        opaTest("Move to a different object using paginator button and check the table variant selection is not persisted", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iNavigateUpOrDownUsingObjectPageHeaderActionButton("NavigationDown");
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("500000013");
            When.onTheGenericObjectPage
                .iSelectSectionOrSubSectionByName("Sales Order Items");
            Then.onTheObjectPage
                .theCorrectSmartVariantIsSelected("Standard", "to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-variant-vm");
        });

        opaTest("Delete the newly created variant", function (Given, When, Then) {
            When.onTheObjectPage
                .iClickOnVariantById("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-variant-vm");
            When.onTheGenericListReport
                .iClickTheButtonHavingLabel("Manage")
                .and
                .iClickTheButtonWithIcon("sap-icon://decline")
                .and
                .iClickTheButtonHavingLabel("Save");
            Then.onTheObjectPage
                .theCorrectSmartVariantIsSelected("Standard", "to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-variant-vm");
            Then.iTeardownMyApp();
        });

        opaTest("Starting the app and loading the OP having table without variant management", function (Given, When, Then) {
            Given.iStartMyAppInDemokit("sttasalesordernoext", "manifestDraftPopup", { "bWithChange": true });
            When.onTheGenericListReport
                .iExecuteTheSearch()
                .and
                .iNavigateFromListItemByFieldValue({ Field: "SalesOrder", Value: "500000000" });
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("500000000");
        });

        opaTest("Select the Sales Order Items tab and make changes from table personalisation", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iSelectSectionOrSubSectionByName("Sales Order Items");
            When.onTheObjectPage
                .iRemoveAllTheCustomVariantsForTheTable("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table")
                .and
                .iClickTheButtonOnTableToolBar("Settings", "to_Item::com.sap.vocabularies.UI.v1.LineItem::Table")
                .and
                .iClickTheControlByControlType("sap.m.IconTabFilter", { "text": "Columns" })
                .and
                .iAddColumnFromP13nDialog("Sales Order ID")
                .and
                .iClickTheControlByControlType("sap.m.IconTabFilter", { "text": "Sort" });
            When.onTheGenericObjectPage
                .iChoosetheItemInComboBox("Total Gross Amount");
            When.onTheObjectPage
                .iClickTheControlByControlType("sap.m.IconTabFilter", { "text": "Group" });
            When.onTheGenericObjectPage
                .iChoosetheItemInComboBox("ISO Currency Code")
                .and
                .iClickTheButtonHavingLabel("OK");
            Then.onTheObjectPage
                .iCheckTableColumnVisibility("Sales Order ID", true, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
                .and
                .iCheckControlPropertiesById("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-GrossAmount", { "visible": true, "sortIndicator": "Ascending" })
                .and
                .iCheckGroupHeaderTitleOnTable("ISO Currency Code:", 1, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
        });

        opaTest("Close the OP and Open another record from LR and check the table personalisation changes are not persisted", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iSelectSectionOrSubSectionByName("Sales Order Items")
                .and
                .iCloseTheObjectPage();
            When.onTheGenericListReport
                .iNavigateFromListItemByFieldValue({ Field: "SalesOrder", Value: "500000002" });
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("500000002");
            Then.onTheGenericObjectPage
                .iCheckSelectedSectionByIdOrName("General Information");
            Then.onTheObjectPage
                .iCheckTableColumnVisibility("Sales Order ID", false, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
                .and
                .iCheckControlPropertiesById("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-GrossAmount", { "visible": true, "sortIndicator": "None" });
        });

        opaTest("Make changes from table personalisation", function (Given, When, Then) {
            When.onTheObjectPage
                .iClickTheButtonOnTableToolBar("Settings", "to_Item::com.sap.vocabularies.UI.v1.LineItem::Table")
                .and
                .iClickTheControlByControlType("sap.m.IconTabFilter", { "text": "Columns" })
                .and
                .iAddColumnFromP13nDialog("Sales Order ID")
                .and
                .iClickTheControlByControlType("sap.m.IconTabFilter", { "text": "Sort" });
            When.onTheGenericObjectPage
                .iChoosetheItemInComboBox("Total Gross Amount");
            When.onTheObjectPage
                .iClickTheControlByControlType("sap.m.IconTabFilter", { "text": "Group" });
            When.onTheGenericObjectPage
                .iChoosetheItemInComboBox("ISO Currency Code")
                .and
                .iClickTheButtonHavingLabel("OK");
            Then.onTheObjectPage
                .iCheckTableColumnVisibility("Sales Order ID", true, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
                .and
                .iCheckControlPropertiesById("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-GrossAmount", { "visible": true, "sortIndicator": "Ascending" })
                .and
                .iCheckGroupHeaderTitleOnTable("ISO Currency Code:", 1, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
        });

        opaTest("Move to a different object using paginator button and check the table personalisation changes are not persisted", function (Given, When, Then) {
            When.onTheGenericObjectPage
                .iSelectSectionOrSubSectionByName("Sales Order Items")
                .and
                .iNavigateUpOrDownUsingObjectPageHeaderActionButton("NavigationDown");
            Then.onTheGenericObjectPage
                .theObjectPageHeaderTitleIsCorrect("500000003");
            Then.onTheGenericObjectPage
                .iCheckSelectedSectionByIdOrName("General Information");
            Then.onTheObjectPage
                .iCheckTableColumnVisibility("Sales Order ID", false, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
                .and
                .iCheckControlPropertiesById("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-GrossAmount", { "visible": true, "sortIndicator": "None" });
            Then.iTeardownMyApp();
        });
    }
);
