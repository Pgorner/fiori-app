sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Sales Order Multi EntitySets - List Report: External Navigation");

		opaTest("Check restricted filter parameters are not passed to the external App during external navigation", function (Given, When, Then) {
			Given.iStartMyAppInSandboxWithNoParams("#SalesOrder-MultiViews");
			When.onTheGenericListReport
				.iSetTheFilter({ Field: "CreatedDate", Value: "Jan 1, 2020 - Dec 31, 2020" })
				.and
				.iSetTheFilter({ Field: "DeliveryDate", Value: "" })
				.and
				.iSetTheFilter({ Field: "UpdatedDate", Value: "" })
				.and
				.iSetTheFilter({ Field: "CurrencyCode", Value: "EUR" })
				.and
				.iSetTheFilter({ Field: "Product", Value: "HT-1003" })
				.and
				.iExecuteTheSearch()
				.and
				.iClickOnIconTabFilter("2");
			Then.onTheGenericListReport
				.theResultListContainsTheCorrectNumberOfItems(2, 2);
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("To SOWD");
			Then.onTheGenericListReport
				.iSeeShellHeaderWithTitle("Sales Order w/o Extensions");
			Then.onTheListReportPage
				.iCheckTheMultiInputFieldValues("listReportFilter-filterItemControl_BASIC-CurrencyCode", [])
				.and
				.iCheckTheMultiInputFieldValues("listReportFilter-filterItemControl_BASIC-Product", [])
				.and
				.iCheckForStringInAppUrl("CurrencyCode", false)
				.and
				.iCheckForStringInAppUrl("Product", false);
		});

		opaTest("Check that Navigation handler does not pass fields with only blank values in the SV of navigation context", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheBackButtonOnFLP()
				.and
				.iSetTheFilter({ Field: "OpportunityID", Value: "<empty>" })
				.and
				.iExecuteTheSearch()
				.and
				.iClickOnIconTabFilter("2")
				.and
				.iSelectListItemsByLineNo([1], true, 2)
				.and
				.iClickTheButtonHavingLabel("To SOWD");
			Then.onTheGenericListReport
				.iSeeShellHeaderWithTitle("Sales Order w/o Extensions");
			Then.onTheListReportPage
				.iCheckTheMultiInputFieldValues("listReportFilter-filterItemControl_BASIC-GrossAmount", [])//checking for blank fields
				.and
				.iCheckTheMultiInputFieldValues("listReportFilter-filterItemControl_BASIC-SalesOrder", ["=500000123"])//checking for non-empty field
				.and
				.iCheckTheMultiInputFieldValues("listReportFilter-filterItemControl_BASIC-OpportunityID", ["=<empty>"]);//checking for manually set empty value
			Then.iTeardownMyApp();
		});
	}
);
