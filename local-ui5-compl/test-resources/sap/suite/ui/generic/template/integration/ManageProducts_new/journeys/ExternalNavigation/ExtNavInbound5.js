sap.ui.define(["sap/ui/test/opaQunit"],
	function(opaTest) {
		"use strict";

		QUnit.module("External Navigation Inbound 5");

		opaTest("1b. ExtNav_TK_CallonExistingActiveObject_LegacyDraftUUID", function(Given, When, Then) {
			Given.iStartMyAppInSandbox("EPMProduct-manage_st#EPMProduct-manage_st?Product=HT-1001&DraftUUID=guid'00000000-0000-0000-0000-000000000000'&IsActiveEntity=true");
			Then.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "STTA_C_MP_Product");
			Then.iTeardownMyApp();
		});
	}
);
