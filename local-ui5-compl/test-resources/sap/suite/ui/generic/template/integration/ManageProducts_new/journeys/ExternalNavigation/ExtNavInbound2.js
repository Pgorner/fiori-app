sap.ui.define(["sap/ui/test/opaQunit"],
	function(opaTest) {
		"use strict";

		QUnit.module("External Navigation Inbound 2");

		opaTest("0a. ExtNav_SK_CallonNonExistingObject", function(Given, When, Then) {
			Given.iStartMyAppInSandbox("EPMProduct-manage_st#EPMProduct-manage_st?ProductForEdit=XX-4711");
			Then.onTheListReportPage
				.iWaitForThePageToLoad("ListReport", "STTA_C_MP_Product");
			Then.iTeardownMyApp();
		});
	}
);
