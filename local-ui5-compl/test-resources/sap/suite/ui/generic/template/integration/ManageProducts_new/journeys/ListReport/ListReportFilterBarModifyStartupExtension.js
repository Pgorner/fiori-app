sap.ui.define(["sap/ui/test/opaQunit"],
	function(opaTest) {
		"use strict";

		QUnit.module("Testing modifyStartupExtension");

		opaTest("Check the input field(coming from different entity) has the value EUR and results are displayed", function(Given, When, Then) {
			Given.iStartMyAppInSandbox("EPMProduct-manage_st#EPMProduct-manage_st?ProductForEdit=XX-4711","manifest_modifyStartupExtension");
			Then.onTheListReportPage
				.iWaitForThePageToLoad("ListReport", "STTA_C_MP_Product");
			Then.onTheListReportPage
                .iCheckTheMultiInputFieldValues("listReportFilter-filterItemControlA_-to_Currency.CurrencyISOCode", ["=EUR"]);
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theAvailableNumberOfItemsIsCorrect(48);
			Then.iTeardownMyApp();
		});
	}
);