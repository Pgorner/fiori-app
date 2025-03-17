sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Sales Order Worklist with table tabs");

		opaTest("Starting the app and loading data", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesorderwklt", "manifestTableTabs");
			When.onTheGenericListReport
				.iLookAtTheScreen();
			Then.onTheGenericListReport
				.theResultListContainsTheCorrectNumberOfItems(5, "_tab1");
			Then.onTheListReportPage
				.iCheckControlPropertiesByControlType("sap.m.IconTabHeader", { "selectedKey": "_tab1" });
		});

		opaTest("Check that the search field is not available for the table when SearchRestriction is applied for the entity", function (Given, When, Then) {
			When.onTheGenericListReport
				.iLookAtTheScreen();
			Then.onTheGenericListReport
				.iShouldNotSeeTheControlWithId("Table::Toolbar::SearchField-_tab1");
		});

		opaTest("Check for Export to Excel button", function (Given, When, Then) {
			When.onTheGenericListReport
				.iLookAtTheScreen();
			Then.onTheListReportPage
				.iShouldNotSeeTheExportToExcelButton();
		});

		opaTest("Click on the second tab and check the table contents", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnIconTabFilter("_tab2");
			Then.onTheListReportPage
				.iCheckControlPropertiesByControlType("sap.m.IconTabHeader", { "selectedKey": "_tab2" });
			Then.onTheGenericListReport
				.theResultListContainsTheCorrectNumberOfItems(6, "_tab2")
				.and
				.iShouldNotSeeTheControlWithId("Table::Toolbar::SearchField-_tab2");
			Then.onTheListReportPage
				.iShouldNotSeeTheExportToExcelButton();
			Then.iTeardownMyApp();
		});
	}
);
