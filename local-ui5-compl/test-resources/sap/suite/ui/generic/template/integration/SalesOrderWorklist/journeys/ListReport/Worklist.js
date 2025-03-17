sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Sales Order Worklist");
		
		opaTest("Starting the app and loading data", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesorderwklt");
			When.onTheGenericListReport
				.iLookAtTheScreen();
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(11);
		});

		opaTest("Check the heading level value for the WorkList page title", function (Given, When, Then) {
			Then.onTheListReportPage
				.iCheckControlPropertiesByControlType("sap.m.Title", { "visible": true, "text": "Sales Order Worklist", "level": "H2" });
		});

		opaTest("Check the heading level value for the WorkList table", function (Given, When, Then) {
			Then.onTheListReportPage
				.iCheckControlPropertiesById("listReport", { "visible": true, "header": "Sales Orders", "headerLevel": "H3" });
		});

		opaTest("Searching for SalesOrder '500000003' in the Search Field should return 1 items", function (Given, When, Then) {
			When.onTheListReportPage
				.iSearchInTableToolbarOrSearchInputField("500000003");
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(1);
		});

		opaTest("The Search with no Filter displays all items", function (Given, When, Then) {
			When.onTheListReportPage
				.iSearchInTableToolbarOrSearchInputField("");
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(11);
		});

		opaTest("Check for table toolbar buttons", function(Given, When, Then) {
			When.onTheListReportPage
				.iLookAtTheScreen();
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({ "Showsinglemsg": [true, false], "btnPersonalisation": [true, true] });
		});

		opaTest("Check for Export to Excel button", function(Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonWithIcon("sap-icon://overflow");
			Then.onTheListReportPage
				.iShouldNotSeeTheExportToExcelButton();
			});

		opaTest("Click on Settings button on the Table toolbar to open the Personalisation dialog", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickTheButtonOnTableToolBar("Settings", "listReport");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("View Settings");
		});

		opaTest("Check the Column, Sort, Filter, Group options are available on the Table Personalisation dialog", function (Given, When, Then) {
			Then.onTheListReportPage
				.iCheckControlPropertiesByControlType("sap.m.IconTabFilter", { "text": "Columns", "visible": true, "enabled": true })
				.and
				.iCheckControlPropertiesByControlType("sap.m.IconTabFilter", { "text": "Sort", "visible": true, "enabled": true })
				.and
				.iCheckControlPropertiesByControlType("sap.m.IconTabFilter", { "text": "Filter", "visible": true, "enabled": true })
				.and
				.iCheckControlPropertiesByControlType("sap.m.IconTabFilter", { "text": "Group", "visible": true, "enabled": true });
		});

		opaTest("Check Visibility of Create Dialog and close the dialog", function(Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Cancel");
			Then.onTheGenericListReport
				.theAvailableNumberOfItemsIsCorrect(11);
			When.onTheListReportPage
				.iClickTheButtonOnTableToolBar("Create", "listReport");
			Then.onTheListReportPage
				.iCheckFieldsAndTitleOfCreateObjectDialog("New Sales order", ["Business Partner ID", "ISO Currency Code", "Confirmation Status", "SO Ordering Status", "Opportunity ID"]);
			Then.onTheGenericListReport
				.iShouldSeeTheButtonOnTheDialog("Create")
				.and
				.iShouldSeeTheButtonOnTheDialog("Cancel");
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Cancel");
			Then.onTheGenericListReport
				.theAvailableNumberOfItemsIsCorrect(11);
		});

		opaTest("Enter some value to the dialog fields and click on Create and check for table count", function(Given, When, Then) {
			When.onTheListReportPage
				.iClickTheButtonOnTableToolBar("Create", "listReport");
			When.onTheListReportPage
				.iSetTheFieldValuesInsideCreateObjectDialog({"Business Partner ID":"100000008","ISO Currency Code":"EUR"});
			Then.onTheListReportPage
				.iCheckTheFieldValuesInsideCreateDialogIsCorrect({"Business Partner ID":"AVANTEL (100000008)","ISO Currency Code":"European Euro (EUR)"});
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Create");
			Then.onTheGenericListReport
				.iShouldSeeTheMessageToastWithText("Object was created.")
				.and
				.theAvailableNumberOfItemsIsCorrect(12);
			Then.iTeardownMyApp();
		});
	}
);
