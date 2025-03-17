sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Checking the functionality actions in the list report");

        opaTest("Starting the app loading the data", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("SalesOrder-nondraft#SalesOrder-nondraft");
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListIsVisible();
		});

		opaTest("Checking the text arrangement and the formatting in set opportunity function import", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([0]);
			When.onTheListReportPage
				.iClickTheButtonOnTableToolBar("Set Opp ID", "listReport");
			Then.onTheListReportPage
				.iCheckControlPropertiesById("BusinessPartnerID-input", {"value": "100000000 (SAP)"});
			Then.onTheListReportPage
				.iCheckControlPropertiesById("GrossAmount-input", {"value": "15,637.790"});
			Then.iTeardownMyApp();
		});
	}
);