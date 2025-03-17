sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Sales Order with Segmented Buttons - List Report: Smart Variant");

		opaTest("Starting the app - Check Data is loaded on App launch", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("SalesOrder-SegButtons#SalesOrder-SegButtons");
			When.onTheListReportPage
				.iLookAtTheScreen();
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(7)
				.and
				.iShouldSeeTheSegmentedButtonWithLabel("Expensive (7)");	
		});

		opaTest("Check the Apply Automatically is set and unselect it and save", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnSmartVariantViewSelection("template::PageVariant-vm")
				.and
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
				.iClickTheControlByControlType("sap.m.GenericTile", { "visible": true, "header": "Sales Order with Segmented Buttons in FCL" });
			Then.onTheListReportPage
				.theCorrectSmartVariantIsSelected("Standard", "PageVariant-vm");
			Then.onTheGenericListReport
				.theResultListContainsTheCorrectNumberOfItems("0");
			When.onTheGenericListReport
				.iClickOnSmartVariantViewSelection("template::PageVariant-vm")
				.and
				.iClickTheButtonHavingLabel("Manage");
			Then.onTheListReportPage
				.iCheckCheckboxSelectedValue("If predefined filter values are available, the content loads automatically.", "PageVariant-vm-manage-exe-0", false);
			Then.iTeardownMyApp();
		});
	}
);
