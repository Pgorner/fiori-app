sap.ui.define(["sap/ui/test/opaQunit", "sap/ui/test/Opa5"],
	function (opaTest, Opa5) {
		"use strict";

		QUnit.module("LR Page with SupportAssistant enabled");

		if (sap.ui.Device.browser.safari) {
			opaTest("Safari detected - SKIPPED", function (Given, When, Then) {
				Opa5.assert.expect(0);
			});
		} else {

		opaTest("Starting the app with SupportAssistant and checking the LR page", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("SalesOrder-TableTabs#SalesOrder-TableTabs", null, { "sap-ui-support": true });
			Then.onTheGenericListReport
				.theListReportPageIsVisible();
			Then.iTeardownMyApp();
		});
	}
	}
);
