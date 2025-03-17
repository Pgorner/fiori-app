sap.ui.define([
		"sap/ui/test/opaQunit"
	], function (opaTest) {
		"use strict";

		QUnit.module("Sales Order Multi EntitySets - List Report - FCL");

		opaTest("Starting the app and checking the default values and available options for date range fields on SFB", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordermultientity", "manifestWithFCL");
			Then.onTheListReportPage
				.iCheckTheValueOfDateRangeField("listReportFilter-filterItemControl_BASIC-DeliveryDate", {key: "DeliveryDate", operator: "TOMORROW"})
				.and
				.iCheckTheAvailableOptionsForDateRangeField("listReportFilter-filterItemControl_BASIC-DeliveryDate", ['DATERANGE', 'DATE', 'FROM', 'TO', 'LASTDAYS', 'LASTWEEKS', 'LASTMONTHS', 'LASTQUARTERS', 'LASTYEARS', 'NEXTDAYS', 'NEXTWEEKS', 'NEXTMONTHS', 'NEXTQUARTERS', 'NEXTYEARS', 'SPECIFICMONTH', 'YESTERDAY', 'TOMORROW', 'THISWEEK', 'LASTWEEK', 'LAST2WEEKS', 'LAST3WEEKS', 'LAST4WEEKS', 'LAST5WEEKS', 'NEXTWEEK', 'NEXT2WEEKS', 'NEXT3WEEKS', 'NEXT4WEEKS', 'NEXT5WEEKS', 'THISMONTH', 'LASTMONTH', 'NEXTMONTH', 'THISQUARTER', 'LASTQUARTER', 'NEXTQUARTER', 'YEARTODATE', 'THISYEAR', 'LASTYEAR', 'NEXTYEAR', 'QUARTER1', 'QUARTER2', 'QUARTER3', 'QUARTER4', 'TODAYFROMTO', 'DATETOYEAR', 'LASTDAYSINCLUDED', 'LASTWEEKSINCLUDED', 'LASTMONTHSINCLUDED', 'LASTQUARTERSINCLUDED', 'LASTYEARSINCLUDED', 'NEXTDAYSINCLUDED', 'NEXTWEEKSINCLUDED', 'NEXTMONTHSINCLUDED', 'NEXTQUARTERSINCLUDED', 'NEXTYEARSINCLUDED'])
				.and
				.iCheckTheAvailableOptionsForDateRangeField("listReportFilter-filterItemControl_BASIC-UpdatedDate", ['DATE', 'YESTERDAY', 'TODAY', 'TOMORROW', 'FIRSTDAYWEEK', 'LASTDAYWEEK', 'FIRSTDAYMONTH', 'LASTDAYMONTH', 'FIRSTDAYQUARTER', 'LASTDAYQUARTER', 'FIRSTDAYYEAR', 'LASTDAYYEAR'])
				.and
				.iCheckTheAvailableOptionsForDateRangeField("listReportFilter-filterItemControl_BASIC-DeliveryDateTime", ['NEXTMINUTES', 'NEXTHOURS', 'LASTMINUTES', 'LASTHOURS', 'LASTMINUTESINCLUDED', 'LASTHOURSINCLUDED', 'NEXTMINUTESINCLUDED', 'NEXTHOURSINCLUDED', 'DATERANGE', 'DATE', 'FROM', 'TO', 'LASTDAYS', 'LASTWEEKS', 'LASTMONTHS', 'LASTQUARTERS', 'LASTYEARS', 'NEXTDAYS', 'NEXTWEEKS', 'NEXTMONTHS', 'NEXTQUARTERS', 'NEXTYEARS', 'SPECIFICMONTH', 'YESTERDAY', 'TODAY', 'TOMORROW', 'THISWEEK', 'LASTWEEK', 'NEXTWEEK', 'THISMONTH', 'LASTMONTH', 'NEXTMONTH', 'THISQUARTER', 'LASTQUARTER', 'NEXTQUARTER', 'YEARTODATE', 'THISYEAR', 'LASTYEAR', 'NEXTYEAR', 'QUARTER1', 'QUARTER2', 'QUARTER3', 'QUARTER4', 'TODAYFROMTO', 'DATETOYEAR', 'LASTDAYSINCLUDED', 'LASTWEEKSINCLUDED', 'LASTMONTHSINCLUDED', 'LASTQUARTERSINCLUDED', 'LASTYEARSINCLUDED', 'NEXTDAYSINCLUDED', 'NEXTWEEKSINCLUDED', 'NEXTMONTHSINCLUDED', 'NEXTQUARTERSINCLUDED', 'NEXTYEARSINCLUDED', 'DATETIME', 'DATETIMERANGE']);
		});
		
		opaTest("Internal Navigation to OP1-Tab1", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSetTheFilter({Field: "DeliveryDate", Value: ""})
				.and
				.iExecuteTheSearch();
			When.onTheGenericListReport
				.iClickOnIconTabFilter("1");
			When.onTheListReportPage
				.iClickTheItemInResponsiveTable(2, 1);
			Then.onTheObjectPage
				.iCheckObjectPageEntitySet("C_STTA_SalesOrder_WD_20");
		});

		opaTest("Internal Navigation to OP2-Extension", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickTheItemInResponsiveTable(1, 1);
			Then.onTheObjectPage
				.iCheckObjectPageEntitySet("I_AIVS_Confirm_Status");
		});

		opaTest("Internal Navigation to OP3-Tab2", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnIconTabFilter("2");
			When.onTheListReportPage
				.iClickTheItemInResponsiveTable(1, 2);
			Then.onTheObjectPage
				.iCheckObjectPageEntitySet("C_STTA_SO_BPAContact");
		});

		opaTest("Create OP for EntitySet2", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheControlWithId("template::ListReport::TableToolbar-2-overflowButton")
				.and
				.iClickTheControlWithId("addEntry-2");
			Then.onTheObjectPage
				.iCheckObjectPageEntitySet("C_STTA_SO_BPAContact");
		});

		opaTest("Create OP for EntitySet1", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnIconTabFilter("1")
				.and
				.iClickTheControlWithId("template::ListReport::TableToolbar-1-overflowButton")
				.and
				.iClickTheControlWithId("addEntry-1");
			Then.onTheObjectPage
				.iCheckObjectPageEntitySet("C_STTA_SalesOrder_WD_20");
			Then.iTeardownMyApp();
		});

		opaTest("Starting the app and check the initial No data text for the table and chart for each tab", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordermultientity", "manifestWithFCL");
			Then.onTheListReportPage
				.iCheckControlPropertiesById("responsiveTable-1", { "visible": true, "noDataText": "To start, set the relevant filters and choose \"Go\"." });
			When.onTheGenericListReport
				.iClickOnIconTabFilter("2");
			Then.onTheListReportPage
				.iCheckControlPropertiesById("responsiveTable-2", { "visible": true, "noDataText": "To start, set the relevant filters and choose \"Go\"." });
			When.onTheGenericListReport
				.iClickOnIconTabFilter("3");
			Then.onTheListReportPage
				.iCheckControlPropertiesById("listReport-3", { "visible": true, "noData": "To start, set the relevant filters and choose \"Go\"." });
		});

		opaTest("Enter filter value and trigger search and check the No data text for the table and chart for each tab", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSetTheFilter({Field: "SalesOrder", Value: "500000050"})
				.and
				.iSetTheFilter({Field: "BusinessPartnerID", Value: "100000000"})
				.and
				.iExecuteTheSearch();
			Then.onTheListReportPage
				.iCheckSmartChartNoDataText("There is no data for the selected filter criteria and chart view.", "listReport-3");
			When.onTheGenericListReport
				.iClickOnIconTabFilter("2");
			Then.onTheListReportPage
				.iCheckControlPropertiesById("responsiveTable-2", { "visible": true, "noDataText": "There is no data for the selected filter criteria and table view." });
			When.onTheGenericListReport
				.iClickOnIconTabFilter("1");
			Then.onTheListReportPage
				.iCheckControlPropertiesById("responsiveTable-1", { "visible": true, "noDataText": "There is no data for the selected filter criteria and table view." });
			Then.iTeardownMyApp();
		});
	}
);
