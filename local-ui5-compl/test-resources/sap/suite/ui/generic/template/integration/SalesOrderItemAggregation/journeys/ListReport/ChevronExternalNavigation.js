sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Sales Order Item Aggregation LR - External Navigations");

		opaTest("Starting the app and loading data - LR with analytical Table", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("SalesOrder-nondraft,STTASOWD20-STTASOWD20,SalesOrder-itemaggregation#SalesOrder-itemaggregation", "manifestAnalyticalTableMS");
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListIsVisible()
		});

		opaTest("Make a chevron navigation and check external navigation is triggered", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByLineNo(0, "listReport-_tab1");
			Then.onTheGenericListReport
				.iSeeShellHeaderWithTitle("Sales Order w/o Extensions");
			When.onTheGenericListReport
				.iClickTheBackButtonOnFLP();
			Then.onTheGenericListReport
				.theListReportPageIsVisible()
				.and
				.iSeeShellHeaderWithTitle("Sales Order Item Aggregation");
		});

		opaTest("Click on Create button and check the navigation to external app", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonWithId("addEntry-_tab1");
			Then.onTheGenericObjectPage
				.iSeeShellHeaderWithTitle("Sales Order")
				.and
				.theObjectPageIsInEditMode();
			Then.onTheObjectPage
				.iCheckObjectPageEntitySet("STTA_C_SO_SalesOrder_ND");
		});

		opaTest("Save the object and navigate back to source app", function (Given, When, Then) {
			When.onTheObjectPage
				.iEnterValueInField("100000000", "BusinessPartnerID::Field-input")
				.and
				.iEnterValueInField("EUR", "CurrencyCode::Field-input")
				.and
				.iClickOnButtonWithText("Create");
			Then.onTheGenericObjectPage
				.theObjectPageIsInDisplayMode();
			When.onTheGenericListReport
				.iClickTheBackButtonOnFLP();
			Then.onTheGenericListReport
				.theListReportPageIsVisible()
				.and
				.iSeeShellHeaderWithTitle("Sales Order Item Aggregation");
			Then.iTeardownMyApp();
		});

		opaTest("Starting the app and loading data - LR with Grid Table", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("SalesOrder-nondraft,STTASOWD20-STTASOWD20,SalesOrder-itemaggregation#SalesOrder-itemaggregation", "manifestGridTableMS");
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListIsVisible()
		});

		opaTest("Make a chevron navigation and check external navigation is triggered", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByLineNo(0, "listReport-_tab1");
			Then.onTheGenericListReport
				.iSeeShellHeaderWithTitle("Sales Order w/o Extensions");
			When.onTheGenericListReport
				.iClickTheBackButtonOnFLP();
			Then.onTheGenericListReport
				.theListReportPageIsVisible()
				.and
				.iSeeShellHeaderWithTitle("Sales Order Item Aggregation");
		});

		opaTest("Click on Create button and check the navigation to external app", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonWithId("addEntry-_tab1");
			Then.onTheGenericObjectPage
				.iSeeShellHeaderWithTitle("Sales Order")
				.and
				.theObjectPageIsInEditMode();
			Then.onTheObjectPage
				.iCheckObjectPageEntitySet("STTA_C_SO_SalesOrder_ND");
		});

		opaTest("Save the object and navigate back to source app", function (Given, When, Then) {
			When.onTheObjectPage
				.iEnterValueInField("100000000", "BusinessPartnerID::Field-input")
				.and
				.iEnterValueInField("EUR", "CurrencyCode::Field-input")
				.and
				.iClickOnButtonWithText("Create");
			Then.onTheGenericObjectPage
				.theObjectPageIsInDisplayMode();
			When.onTheGenericListReport
				.iClickTheBackButtonOnFLP();
			Then.onTheGenericListReport
				.theListReportPageIsVisible()
				.and
				.iSeeShellHeaderWithTitle("Sales Order Item Aggregation");
			Then.iTeardownMyApp();
		});

		opaTest("Starting the app and loading data - LR with Tree Table", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("STTASOWD20-STTASOWD20,SalesOrder-itemaggregation#SalesOrder-itemaggregation", "manifestTreeTableMS");
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListIsVisible()
		});

		opaTest("Make a chevron navigation and check external navigation is triggered", function (Given, When, Then) {
			When.onTheListReportPage
				.iNavigateUsingUITable(1, "TreeTable-_tab1");
			Then.onTheGenericListReport
				.iSeeShellHeaderWithTitle("Sales Order w/o Extensions");
			When.onTheGenericListReport
				.iClickTheBackButtonOnFLP();
			Then.onTheGenericListReport
				.theListReportPageIsVisible()
				.and
				.iSeeShellHeaderWithTitle("Sales Order Item Aggregation");
			Then.iTeardownMyApp();
		});

		opaTest("Starting the app and loading data - LR with Responsive Table", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("SalesOrder-nondraft,STTASOWD20-STTASOWD20,SalesOrder-itemaggregation#SalesOrder-itemaggregation", "manifestResponsiveTableMS");
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListIsVisible()
		});

		opaTest("Make a chevron navigation and check external navigation is triggered", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByLineNo(0, "listReport-_tab1");
			Then.onTheGenericListReport
				.iSeeShellHeaderWithTitle("Sales Order w/o Extensions");
			When.onTheGenericListReport
				.iClickTheBackButtonOnFLP();
			Then.onTheGenericListReport
				.theListReportPageIsVisible()
				.and
				.iSeeShellHeaderWithTitle("Sales Order Item Aggregation");
		});

		opaTest("Click on Create button and check the navigation to external app", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonWithId("addEntry-_tab1");
			Then.onTheGenericObjectPage
				.iSeeShellHeaderWithTitle("Sales Order")
				.and
				.theObjectPageIsInEditMode();
			Then.onTheObjectPage
				.iCheckObjectPageEntitySet("STTA_C_SO_SalesOrder_ND");
		});

		opaTest("Save the object and navigate back to source app", function (Given, When, Then) {
			When.onTheObjectPage
				.iEnterValueInField("100000000", "BusinessPartnerID::Field-input")
				.and
				.iEnterValueInField("EUR", "CurrencyCode::Field-input")
				.and
				.iClickOnButtonWithText("Create");
			Then.onTheGenericObjectPage
				.theObjectPageIsInDisplayMode();
			When.onTheGenericListReport
				.iClickTheBackButtonOnFLP();
			Then.onTheGenericListReport
				.theListReportPageIsVisible()
				.and
				.iSeeShellHeaderWithTitle("Sales Order Item Aggregation");
			Then.iTeardownMyApp();
		});
	}
);
