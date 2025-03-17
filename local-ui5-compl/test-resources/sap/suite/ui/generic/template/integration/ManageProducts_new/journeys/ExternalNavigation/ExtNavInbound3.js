sap.ui.define(["sap/ui/test/opaQunit"],
	function(opaTest) {
		"use strict";

		QUnit.module("External Navigation Inbound 3");

		opaTest("1. ExtNav_TK_CallonExistingActiveObject", function(Given, When, Then) {
			Given.iStartMyAppInDemokit("sttaproducts#/STTA_C_MP_Product(Product='HT-1000',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)");
			Then.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "STTA_C_MP_Product");
			Then.iTeardownMyApp();
		});
	}
);
