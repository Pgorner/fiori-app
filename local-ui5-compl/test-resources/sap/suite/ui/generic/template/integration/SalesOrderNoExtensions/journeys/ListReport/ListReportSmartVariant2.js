sap.ui.define(["sap/ui/test/opaQunit", "sap/ui/test/Opa5"],
	function (opaTest, Opa5) {
		"use strict";

		QUnit.module("Sales Order No Extensions - List Report: Smart Variant 2");

		opaTest("#1: Smart Variant - Change on applying search", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("STTASOWD20-STTASOWD20#STTASOWD20-STTASOWD20");
			When.onTheGenericListReport
				.iSetTheSearchField("500000000");
			Then.onTheGenericListReport
				.theAvailableNumberOfItemsIsCorrect(1);
			Then.onTheListReportPage
				.theCorrectSmartVariantIsSelected("Standard");
		});

		opaTest("Open Table Personalization settings change the Column, Sort and Group", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickTheButtonOnTableToolBar("Settings", "listReport");
			Then.onTheListReportPage
				.iCheckControlPropertiesByControlType("sap.m.Title", { "text": "View Settings" });
			Then.onTheListReportPage
				.iAddColumnFromP13nDialog("Changed At");
			When.onTheListReportPage
				.iClickTheControlByControlType("sap.m.IconTabFilter", { "text": "Sort" });
			When.onTheGenericListReport
				.iChoosetheItemInComboBox("Business Partner ID");
			When.onTheListReportPage
				.iClickTheControlByControlType("sap.m.IconTabFilter", { "text": "Group" });
			When.onTheGenericListReport
				.iChoosetheItemInComboBox("Business Partner ID")
				.and
				.iClickTheButtonHavingLabel("OK");
		});

		opaTest("Navigate to the FLP Home page", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnItemFromTheShellNavigationMenu("Home");
			Then.onTheGenericListReport
				.iSeeShellHeaderWithTitle("Home");
		});

		opaTest("Do a back navigation to LR and Check if Column, Sort and Group loaded Correctly from iAppState", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateBack();
			When.onTheListReportPage
				.iWaitForThePageToLoad("ListReport", "C_STTA_SalesOrder_WD_20");
			Then.onTheListReportPage
				.iCheckGroupHeaderTitleOnTable("Business Partner ID: 100000000", 1);
			When.onTheListReportPage
				.iClickTheButtonOnTableToolBar("Settings", "listReport");
            When.onTheGenericListReport
                .iClickTheButtonHavingLabel("Show Selected");
            Then.onTheListReportPage
                .iAddColumnFromP13nDialog("Changed At");
            When.onTheGenericListReport
                .iClickTheButtonHavingLabel("Show All");
			When.onTheListReportPage
				.iClickTheControlByControlType("sap.m.IconTabFilter", { "text": "Sort" });
            Then.onTheListReportPage
                .iCheckControlPropertiesByControlType("sap.m.ComboBox", { "selectedKey": "template::DataFieldWithIntentBasedNavigation::BusinessPartner::displayFactSheet::BusinessPartnerID" });
            When.onTheGenericListReport
				.iClickTheButtonWithIcon("sap-icon://decline");
			When.onTheListReportPage
				.iClickTheControlByControlType("sap.m.IconTabFilter", { "text": "Group" });
            When.onTheGenericListReport
				.iClickTheButtonWithIcon("sap-icon://decline")
                .and
                .iClickTheButtonHavingLabel("OK");
		});


		opaTest("#2: Smart Variant - Creating a new Smart Variant with Apply Automatically true", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickOnVariantById("PageVariant-vm");
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Save As");
			When.onTheListReportPage
				.iEnterValueInField("Test", "template::PageVariant-vm-name")
				.and
				.iClickOnCheckboxWithText("Set as Default", "PageVariant-vm-default")
				.and
				.iClickOnCheckboxWithText("Apply Automatically", "PageVariant-vm-execute");
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Save");
			Then.onTheListReportPage
				.theCorrectSmartVariantIsSelected("Test", "PageVariant-vm");
		});

		opaTest("#3: Smart Variant - Check that the custom variant is loaded correctly", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheBackButtonOnFLP();
			When.onTheFLPPage
				.iClickTheControlByControlType("sap.m.GenericTile", {"visible": true, "header": "Sales Order with Draft"});
			Then.onTheListReportPage
				.theCorrectSmartVariantIsSelected("Test", "PageVariant-vm");
			Then.onTheGenericListReport
				.theAvailableNumberOfItemsIsCorrect(1);
		});

		opaTest("#4: Smart Variant - Delete created variant", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickOnVariantById("PageVariant-vm");
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Manage")
				.and
				.iClickTheButtonWithIcon("sap-icon://decline")
				.and
				.iClickTheButtonHavingLabel("Save");
			Then.onTheListReportPage
				.theCorrectSmartVariantIsSelected("Standard", "PageVariant-vm");
			Then.iTeardownMyApp();
		});
	}
);
