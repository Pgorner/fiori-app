sap.ui.define(["sap/ui/test/opaQunit", "sap/ui/test/Opa5"],
	function (opaTest, Opa5) {
		"use strict";

		QUnit.module("Sales Order No Extensions - List Report: Smart Variant 1");

		opaTest("Smart Variant - rendering on start-up ", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("STTASOWD20-STTASOWD20#STTASOWD20-STTASOWD20");
			When.onTheGenericListReport
				.iLookAtTheScreen();
			Then.onTheGenericListReport
				.theHeaderExpandedPropertyIsCorrectlySet(true);
			Then.onTheListReportPage
				.iCheckControlPropertiesByControlType("sap.ui.comp.smartvariants.SmartVariantManagement", {"visible": true})
				.and
				.theCorrectSmartVariantIsSelected("Standard")
				.and
				.iCheckTheSelectedVariantIsModified(false, "PageVariant");
			Then.onTheGenericListReport
				.theAvailableNumberOfItemsIsCorrect(20);
		});

		opaTest("Check the Apply Automatically is set and unselect it and save", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnSmartVariantViewSelection("template::PageVariant-vm")
				.and
				.iClickTheButtonHavingLabel("Manage");
			Then.onTheListReportPage
				.iCheckCheckboxSelectedValue("", "PageVariant-vm-manage-exe-0", true);
			When.onTheListReportPage
				.iClickOnCheckboxWithText("", "PageVariant-vm-manage-exe-0");
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Save");
			});

		opaTest("Relaunch the app and check the Apply Automatically for standard variant", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheBackButtonOnFLP();
			When.onTheFLPPage
				.iClickTheControlByControlType("sap.m.GenericTile", {"visible": true, "header": "Sales Order with Draft"});
			Then.onTheListReportPage
				.theCorrectSmartVariantIsSelected("Standard", "PageVariant-vm")
				.and
				.iCheckControlPropertiesById("listReport-header", {"visible": true, "text": "Sales Orders"});
			When.onTheGenericListReport
				.iClickOnSmartVariantViewSelection("template::PageVariant-vm")
				.and
				.iClickTheButtonHavingLabel("Manage");
			Then.onTheListReportPage
				.iCheckCheckboxSelectedValue("", "PageVariant-vm-manage-exe-0", false);
		});

		opaTest("Reselect the Apply Automatically flag for the standard variant and save", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickOnCheckboxWithText("", "PageVariant-vm-manage-exe-0");
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Save");
		});

		opaTest("Change Filter Settings from Table Personalization Dialog", function (Given, When, Then) {
			When.onTheGenericListReport
				.iExecuteTheSearch();
			When.onTheListReportPage
				.iClickTheButtonOnTableToolBar("Settings", "listReport")
				.and
				.iClickTheControlByControlType("sap.m.IconTabFilter", { "text": "Filter" });
			When.onTheGenericListReport
				.iChoosetheItemInComboBox("Business Partner ID");
			When.onTheListReportPage
				.iEnterValueInField("100000000", "BusinessPartnerID")
				.and
				.iClickOnButtonWithText("OK");
			Then.onTheListReportPage
				.iCheckInfoToolbarTextOnTheTable("1 table filter active: Business Partner ID", "responsiveTable");
			Then.onTheGenericListReport
				.theAvailableNumberOfItemsIsCorrect(2);
			When.onTheGenericListReport
				.iClickOnItemFromTheShellNavigationMenu("Home");
			When.onTheGenericListReport
				.iNavigateBack();
		});

		opaTest("Check if Filter settings loaded Correctly from iAppState", function (Given, When, Then) {
			Then.onTheListReportPage
				.iCheckInfoToolbarTextOnTheTable("1 table filter active: Business Partner ID", "responsiveTable");
			Then.onTheGenericListReport
				.theAvailableNumberOfItemsIsCorrect(2);
			When.onTheListReportPage
				.iClickTheButtonOnTableToolBar("Settings", "listReport")
				.and
				.iClickTheControlByControlType("sap.m.IconTabFilter", { "text": "Filter" });
			When.onTheGenericListReport
				.iClickTheButtonWithIcon("sap-icon://decline")
				.and
				.iClickTheButtonHavingLabel("OK");
			Then.iTeardownMyApp();
		});

		opaTest("Smart Variant - Change on applying search", function (Given, When, Then) {
			Given.iStartMyAppInSandboxWithNoParams("#STTASOWD20-STTASOWD20");
			When.onTheGenericListReport
				.iSetTheSearchField("500000000");
			Then.onTheGenericListReport
				.theAvailableNumberOfItemsIsCorrect(1);
			Then.onTheListReportPage
				.theCorrectSmartVariantIsSelected("Standard");
		});

		opaTest("Smart Variant - Creating a new Smart Variant with Apply Automatically false", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickOnVariantById("PageVariant-vm");
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Save As");
			When.onTheListReportPage
				.iEnterValueInField("Test", "template::PageVariant-vm-name")
				.and
				.iClickOnCheckboxWithText("Set as Default", "PageVariant-vm-default");
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Save");
			Then.onTheListReportPage
				.theCorrectSmartVariantIsSelected("Test", "PageVariant-vm");
		});

		opaTest("Smart Variant - Switch Smart Variant back to standard and check table data", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickOnVariantById("PageVariant-vm")
				.and
				.iSelectVariantByName("Standard", "PageVariant-vm");
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheListReportPage
				.theCorrectSmartVariantIsSelected("Standard", "PageVariant-vm");
			Then.onTheGenericListReport
				.theAvailableNumberOfItemsIsCorrect(20);
		});

		opaTest("Smart Variant - Check that the custom variant is loaded correctly", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheBackButtonOnFLP();
			When.onTheFLPPage
				.iClickTheControlByControlType("sap.m.GenericTile", {"visible": true, "header": "Sales Order with Draft"});
			Then.onTheListReportPage
				.theCorrectSmartVariantIsSelected("Test", "PageVariant-vm")
				.and
				.iCheckControlPropertiesById("listReport-header", { "visible": true, "text": "Sales Orders" });
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theAvailableNumberOfItemsIsCorrect(1);
		});

		opaTest("Smart Variant - Delete created variant", function (Given, When, Then) {
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
