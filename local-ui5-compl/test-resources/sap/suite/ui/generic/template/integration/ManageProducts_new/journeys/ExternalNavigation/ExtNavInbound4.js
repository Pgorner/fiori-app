sap.ui.define(["sap/ui/test/opaQunit"],
	function(opaTest) {
		"use strict";

		QUnit.module("External Navigation Inbound 4");

		opaTest("1a. ExtNav_SK_CallonExistingActiveObject", function(Given, When, Then) {
			Given.iStartMyAppInSandbox("EPMProduct-manage_st#EPMProduct-manage_st?ProductForEdit=HT-1001");
			Then.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "STTA_C_MP_Product");
			Then.iTeardownMyApp();
		});
	}
);
