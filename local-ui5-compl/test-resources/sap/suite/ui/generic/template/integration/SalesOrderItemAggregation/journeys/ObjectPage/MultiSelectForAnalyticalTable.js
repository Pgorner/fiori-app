sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Sales Order Item Aggregation - MultiSelectForAnalyticalTable: Single Select", function () {

			opaTest("Starting the app (Object Page) and check for the Analytical Table", function (Given, When, Then) {
				Given.iStartMyAppInDemokit("sttasalesorderitemaggr#/STTA_C_SO_ItemAggr('.1~0500000000.2~0000000080')", "manifestAnalyticalTable");
				Then.onTheObjectPage
					.iCheckTableProperties({"visible": true}, "analyticalTable")
					.and
					.iCheckControlPropertiesById("to_ScheduleLine::com.sap.vocabularies.UI.v1.LineItem::Table", { "visible": true, "enableAutoColumnWidth": true });
				Then.iTeardownMyApp();
			});
		});
	}
);
