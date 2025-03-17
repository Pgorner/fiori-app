sap.ui.define([
	"sap/ui/test/opaQunit"],

	function (opaTest) {
		"use strict";

		QUnit.module("GhostApp test");

		opaTest("Starting the app and checking the url for ghostapp ", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("STTASOWD20-STTASOWD20,SalesOrder-TableTabs#SalesOrder-TableTabs", "manifest_ghostapp");
			Then.onTheGenericListReport
				.theListReportPageIsVisible();
			Then.onTheListReportPage
				.iCheckForHashValueInAppUrl("sap-iapp-state", false)
				.and
				.iCheckForHashValueInAppUrl("sap-iapp-state--history", false);
			Then.iTeardownMyApp();
		});
	}
);
