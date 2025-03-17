sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Non Draft OP: Delete Extension");

		opaTest("Object Page beforeDeleteExtension check", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordernd#/STTA_C_SO_SalesOrder_ND('500000011')");
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("delete");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithTitle("My Title (Breakout)");

			Then.iTeardownMyApp();
		});

});
