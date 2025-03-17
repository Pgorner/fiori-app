sap.ui.define([
	"sap/ui/test/opaQunit"],

	function (opaTest) {
		"use strict";

		QUnit.module("OPA for path support hiding columns in LR table");

		opaTest("Starting the app and loading the data", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("Demo-ObjectPagePathSupport#Demo-ObjectPagePathSupport");
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theAvailableNumberOfItemsIsCorrect(2);
		});

		opaTest("Check the FE rendered column on LR table is hidden when UI.Hidden property is set to boolean value true ", function (Given, When, Then) {
			Then.onTheListReportPage
				.iCheckTableColumnVisibility("DataField with IBN Column 2", false, "responsiveTable");
		});

		opaTest("Check the LR table cell visibility for the columns 'RootProperty2' and 'DataField with IBN Column 2' based on the path value 'HideColumnProperty'", function (Given, When, Then) {
			Then.onTheListReportPage
				.iCheckRenderedColumnTextOnNthRowOfTable(1, [5], ["Yes"], "responsiveTable")
				.and
				.iCheckTheCellVisibilityOfNthColumnOnNthRowOfTable(1, 2, false, "responsiveTable")
				.and
				.iCheckTheCellVisibilityOfNthColumnOnNthRowOfTable(1, 3, false, "responsiveTable")
				.and
				.iCheckRenderedColumnTextOnNthRowOfTable(2, [5], ["No"], "responsiveTable")
				.and
				.iCheckTheCellVisibilityOfNthColumnOnNthRowOfTable(2, 2, true, "responsiveTable")
				.and
				.iCheckTheCellVisibilityOfNthColumnOnNthRowOfTable(2, 3, true, "responsiveTable");
		});

		opaTest("Check the LR table cell visibility for the columns 'RootProperty2' and 'DataField with IBN Column 2' when the path value is set to false from the OP form", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({ Field: "HideColumnProperty", Value: true });
			When.onTheGenericObjectPage
				.iClickTheEditButton();
			When.onTheObjectPage
				.iClickOnCheckboxWithText("", "HideColumnProperty::Field-cBoxBool");
			When.onTheGenericObjectPage
				.iSaveTheDraft(true);
			When.onTheGenericObjectPage
				.iClickTheBackButtonOnFLP();
			Then.onTheGenericListReport
				.theListReportPageIsVisible()
				.and
				.theAvailableNumberOfItemsIsCorrect(2);
			Then.onTheListReportPage
				.iCheckRenderedColumnTextOnNthRowOfTable(1, [5], ["No"], "responsiveTable")
				.and
				.iCheckTheCellVisibilityOfNthColumnOnNthRowOfTable(1, 2, true, "responsiveTable")
				.and
				.iCheckTheCellVisibilityOfNthColumnOnNthRowOfTable(1, 3, true, "responsiveTable");
			Then.iTeardownMyApp();
		});
	}
);