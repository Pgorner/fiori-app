sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("List Report Page Rendering - Smart Variant");

		opaTest("Loading the app - Check Data is not loaded on App launch", function (Given, When, Then) {

            Given.iStartMyAppInSandboxWithNoParams("#EPMProduct-manage_st");
			// actions
			When.onTheGenericListReport
				.iLookAtTheScreen();
            Then.onTheGenericListReport
				.theHeaderExpandedPropertyIsCorrectlySet(true);
			Then.onTheListReportPage
				.iCheckControlPropertiesByControlType("sap.ui.comp.smartvariants.SmartVariantManagement", {"visible": true})
				.and
				.theCorrectSmartVariantIsSelected("Standard", "PageVariant-vm")
				.and
				.iCheckControlPropertiesById("listReport-header", { "visible": true, "text": "Products" });
            When.onTheGenericListReport
                .iExecuteTheSearch();
            Then.onTheGenericListReport
                .theAvailableNumberOfItemsIsCorrect("125");
        });

        opaTest("Check Apply Automatically is not set and select it and save", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickOnVariantById("PageVariant-vm");
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Manage");
			Then.onTheListReportPage
				.iCheckCheckboxSelectedValue("", "PageVariant-vm-manage-exe-0", false);
			When.onTheListReportPage
				.iClickOnCheckboxWithText("", "PageVariant-vm-manage-exe-0");
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Save");
		});

		opaTest("Relaunch the app and check the Apply Automatically for standard variant", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheBackButtonOnFLP();
			When.onTheFLPPage
				.iClickTheControlByControlType("sap.m.GenericTile", { "visible": true, "header": "Manage Products (STTA)" });
			Then.onTheListReportPage
				.theCorrectSmartVariantIsSelected("Standard", "PageVariant-vm");
			Then.onTheGenericListReport
				.theHeaderExpandedPropertyIsCorrectlySet(true)
				.and
				.theAvailableNumberOfItemsIsCorrect("125");
			When.onTheListReportPage
				.iClickOnVariantById("PageVariant-vm");
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Manage");
			Then.onTheListReportPage
				.iCheckCheckboxSelectedValue("", "PageVariant-vm-manage-exe-0", true);
			Then.iTeardownMyApp();
		});
	}
);
