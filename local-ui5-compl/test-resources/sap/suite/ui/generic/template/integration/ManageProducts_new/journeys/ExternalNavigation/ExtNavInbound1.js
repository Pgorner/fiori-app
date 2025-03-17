sap.ui.define(["sap/ui/test/opaQunit"],
	function(opaTest) {
		"use strict";

		QUnit.module("External Navigation Inbound 1");

		opaTest("0. ExtNav_TK_CallonNonExistingObject", function(Given, When, Then) {
			Given.iStartMyAppInDemokit("sttaproducts#/STTA_C_MP_Product(Product='XX-4711',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)");
			Then.onTheObjectPage
				.theMessagePageShouldBeOpened();
			Then.iTeardownMyApp();
		});
	}
);
