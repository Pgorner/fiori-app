sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("LR with tree table and sap-keep-alive property set to true");

		opaTest("Starting the app and check if expand/ collapse status of row is retained with sap keep live", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("STTAMPTT-STTAMPTT#STTAMPTT-STTAMPTT", null, { sapKeepAlive: true });
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheListReportPage
				.iExpandTreeTableRows(1);
			Then.onTheListReportPage
				.iCheckControlPropertiesByControlType("sap.m.Text", { "text": "Lenovo" });
			When.onTheGenericListReport
				.iClickOnItemFromTheShellNavigationMenu("Home");
			When.onTheFLPPage
				.iClickTheControlByControlType("sap.m.GenericTile", { "visible": true, "header": "List report with tree table" });
			Then.onTheListReportPage
				.iCheckControlPropertiesByControlType("sap.m.Text", { "text": "Lenovo" });
			Then.iTeardownMyApp();
		});
	}
);