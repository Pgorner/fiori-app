sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("External Navigation Inbound 9");

		opaTest("Open LR Application and check if Smart Table is rendered correctly", function (Given, When, Then) {
			// Arrangements
			Given.iStartMyAppInSandbox("STTASOWD20-STTASOWD20,EPMProduct-manage_st#EPMProduct-manage_st");

			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheListReportPage
				.iWaitForThePageToLoad("ListReport", "STTA_C_MP_Product")
				.and
				.theSmartTableIsRenderedCorrectly();
        });
        opaTest("Check if multiple context navigation works properly", function (Given, When, Then) {
            When.onTheGenericListReport
				.iSelectListItemsByLineNo([3, 5, 6, 7], true);
            When.onTheGenericListReport
                .iClickTheButtonHavingLabel("To SOWD");
            Then.onTheGenericListReport
                .iSeeShellHeaderWithTitle("Sales Order w/o Extensions");
            Then.onTheListReportPage
                .iCheckControlPropertiesByControlType("sap.f.DynamicPage", { "visible": true, "headerExpanded": true })
                .and
                .iCheckTheMultiInputFieldValues("listReportFilter-filterItemControl_BASIC-Product", ["=HT-1000", "=HT-1003", "=HT-1007", "=HT-1010"]);
            Then.iTeardownMyApp();    
    });

    }
);        