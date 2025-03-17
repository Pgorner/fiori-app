sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Sales Order No Extensions - check SPV settings");

		opaTest("Starting the app and loading data and checking the filters applied in SFB via annotation path with SelectionPresentationVariant", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordernoext", "manifestSPV");
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheListReportPage
				.iCheckTheMultiInputFieldValues("listReportFilter-filterItemControl_BASIC-CurrencyCode", ["European Euro (EUR)"])
				.and
				.iCheckTheMultiInputFieldValues("listReportFilter-filterItemControl_BASIC-GrossAmount", ["1,000.000...15,000.000"]);
			Then.onTheGenericListReport
				.theResultListContainsTheCorrectNumberOfItems(8)
				.and
				.iSeeTheButtonWithLabel("Adapt Filters (2)");
		});
		
		opaTest("Check column visibility applied via annotation path with SelectionPresentationVariant", function (Given, When, Then) {
			Then.onTheListReportPage
				.iCheckTheControlWithIdIsVisible("sap.m.Column", "SOwoExt::sap.suite.ui.generic.template.ListReport.view.ListReport::C_STTA_SalesOrder_WD_20--listReport-TaxAmount", true)
				.and
				.iCheckTheControlWithIdIsVisible("sap.m.Column", "SOwoExt::sap.suite.ui.generic.template.ListReport.view.ListReport::C_STTA_SalesOrder_WD_20--listReport-BusinessPartnerID", true)
				.and
				.iCheckTheControlWithIdIsVisible("sap.m.Column", "SOwoExt::sap.suite.ui.generic.template.ListReport.view.ListReport::C_STTA_SalesOrder_WD_20--listReport-SalesOrder", true);
			Then.iTeardownMyApp();
		});
	}
);
