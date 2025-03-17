sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Sales Order No Extensions - Master Detail");

		opaTest("Starting the app and loading data and check placeholder", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("STTASOWD20-STTASOWD20#STTASOWD20-STTASOWD20", "manifestMD", { "bWithPlaceHolder": true });
			// Then.onTheListReportPage
			// 	.iCheckPlaceholderIsPresent("sap.fe.placeholder.view.PlaceholderLR");
			When.onTheGenericListReport
				.iLookAtTheScreen();
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("TwoColumnsMidExpanded");
			Then.onTheObjectPage
				.iCheckControlPropertiesById("template::ObjectPage::ObjectPageDynamicHeaderTitle", { "visible": true, "text": "500000000" });
			Then.onTheGenericListReport
				.theHeaderExpandedPropertyIsCorrectlySet(true);
			Then.iTeardownMyApp();
		});
	}
);
