sap.ui.define([
		"sap/ui/test/opaQunit"
	], function (opaTest) {
		"use strict";

		QUnit.module("Sales Order Multi EntitySets Different Table types- List Report");

		opaTest("Starting the app and checking the available options for date range fields on SFB", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordermultientity", "manifestDifferentTableTypes");
			Then.onTheListReportPage
				.iCheckTheAvailableOptionsForDateRangeField("listReportFilter-filterItemControl_BASIC-DeliveryDate", ['DATE', 'FROM', 'TO', 'LASTYEARS', 'NEXTYEARS', 'YESTERDAY', 'TODAY', 'TOMORROW', 'YEARTODATE', 'THISYEAR', 'LASTYEAR', 'NEXTYEAR', 'TODAYFROMTO', 'DATETOYEAR', 'LASTYEARSINCLUDED', 'NEXTYEARSINCLUDED'])
				.and
				.iCheckTheAvailableOptionsForDateRangeField("listReportFilter-filterItemControl_BASIC-UpdatedDate", ['DATE', 'YESTERDAY', 'TODAY', 'TOMORROW', 'FIRSTDAYYEAR', 'LASTDAYYEAR']);
		});

		opaTest("Checking the table type - tab1", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnIconTabFilter("1");
			Then.onTheListReportPage
				.iCheckTableProperties({"visible": true}, "gridTable", "gridTable-1")
				.and
				.iCheckControlPropertiesById("listReport-1", { "visible": true, "enableAutoColumnWidth": true });
		});

		opaTest("Switching to Tab 2 and check the table type", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnIconTabFilter("2");
			Then.onTheGenericListReport
				.theResultListIsVisible();
			Then.onTheListReportPage
				.iCheckTableProperties({"visible": true}, "treeTable", "treeTable-2")
				.and
				.iCheckControlPropertiesById("listReport-2", { "visible": true, "enableAutoColumnWidth": true });
		});

		opaTest("Switching to Tab 3 and check the chart", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnIconTabFilter("3");
			Then.onTheListReportPage
				.iCheckControlPropertiesByControlType("sap.ui.comp.smartchart.SmartChart", {
					"visible": true,
					"entitySet": "C_STTA_SalesOrderItem_WD_20"
				});
		});

		opaTest("Switching to Tab 4 and check the table type", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnIconTabFilter("4");
			Then.onTheGenericListReport
				.theResultListIsVisible();
			Then.onTheListReportPage
				.iCheckTableProperties({"visible": true}, "analyticalTable", "analyticalTable-4")
				.and
				.iCheckControlPropertiesById("listReport-4", { "visible": true, "enableAutoColumnWidth": true });
		});

		opaTest("Switching to Tab 5 and check the chart", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnIconTabFilter("5");
			Then.onTheListReportPage
				.iCheckControlPropertiesByControlType("sap.ui.comp.smartchart.SmartChart", {
					"visible": true,
					"entitySet": "C_STTA_SalesOrderItemSL_WD_20"
				});
			Then.iTeardownMyApp();
		});
	}
);
