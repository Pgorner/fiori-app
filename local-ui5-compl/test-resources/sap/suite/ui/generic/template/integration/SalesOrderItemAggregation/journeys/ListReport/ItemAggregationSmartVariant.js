sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Sales Order Item Aggregation LR - Smart Variant");

		opaTest("Loading the app - Check Data is not loaded on App launch", function (Given, When, Then) {
            Given.iStartMyAppInSandbox("SalesOrder-itemaggregation#SalesOrder-itemaggregation");
			When.onTheGenericListReport
				.iLookAtTheScreen();
            Then.onTheGenericListReport
				.theHeaderExpandedPropertyIsCorrectlySet(true);
			Then.onTheListReportPage
				.iCheckControlPropertiesByControlType("sap.ui.comp.smartvariants.SmartVariantManagement", {"visible": true})
				.and
				.theCorrectSmartVariantIsSelected("Standard", "PageVariant-vm")
				.and
				.iCheckControlPropertiesById("listReport-_tab1-header", { "visible": true, "text": "Sales Order Items" });
            When.onTheGenericListReport
                .iExecuteTheSearch();
            Then.onTheGenericListReport
				.theResultListContainsTheCorrectNumberOfItems(182,"_tab1");
        });

        opaTest("Check the Apply Automatically is set and unselect it and save", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickOnVariantById("PageVariant-vm");
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Manage");
			Then.onTheListReportPage
				.iCheckCheckboxSelectedValue("If predefined filter values are available, the content loads automatically.", "PageVariant-vm-manage-exe-0", true);
			When.onTheListReportPage
				.iClickOnCheckboxWithText("If predefined filter values are available, the content loads automatically.", "PageVariant-vm-manage-exe-0");
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Save");
		});

		opaTest("Relaunch the app and check the Apply Automatically for standard variant", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheBackButtonOnFLP();
			When.onTheFLPPage
				.iClickTheControlByControlType("sap.m.GenericTile", { "visible": true, "header": "Sales Order Items Aggregation" });
			Then.onTheListReportPage
				.theCorrectSmartVariantIsSelected("Standard", "PageVariant-vm")
				.and
				.iCheckControlPropertiesById("listReport-_tab1-header", { "visible": true, "text": "Sales Order Items" });
			When.onTheListReportPage
				.iClickOnVariantById("PageVariant-vm");
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Manage");
			Then.onTheListReportPage
				.iCheckCheckboxSelectedValue("If predefined filter values are available, the content loads automatically.", "PageVariant-vm-manage-exe-0", false);
			Then.iTeardownMyApp();
		});
	}
);
