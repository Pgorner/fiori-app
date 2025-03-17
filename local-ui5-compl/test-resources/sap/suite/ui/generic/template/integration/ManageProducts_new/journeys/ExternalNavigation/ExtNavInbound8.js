sap.ui.define(["sap/ui/test/opaQunit"],
	function(opaTest) {
		"use strict";

		QUnit.module("External Navigation Inbound 8");

		opaTest("1. ExtNav_TK_CallonExistingActiveObject", function(Given, When, Then) {
			Given.iStartMyAppInSandbox("EPMProduct-manage_st#EPMProduct-manage_st?Product=HT-1000&DraftUUID=guid'00000000-0000-0000-0000-000000000000'&IsActiveEntity=true", "manifestDynamicHeaderInFCLTableTabs");
			Then.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "STTA_C_MP_Product");
			Then.onTheListReportPage
				.theResponsiveTableIsFilledWithItems(1, "1");
			Then.iTeardownMyApp();
		});
	}
);
