sap.ui.define([
	"sap/ui/test/opaQunit"],

	function (opaTest) {
		"use strict";

		QUnit.module("OPA for path support in OP tables");

		opaTest("Starting the app and loading the data", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("Demo-ObjectPagePathSupport#Demo-ObjectPagePathSupport");
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theAvailableNumberOfItemsIsCorrect(2);
		});

		opaTest("Check the OP table column 'SubProperty1' is hidden using the path value set to the property of parent entity - true", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({ Field: "HideColumnProperty", Value: true });
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("Property 1 Entity 1");
			Then.onTheObjectPage
				.iCheckNumberOfItemsInTable(4, "ReferenceFacet_2::responsiveTable")
				.and
				.iCheckTableColumnVisibility("SubProperty1", false, "ReferenceFacet_2::responsiveTable")
				.and
				.iCheckTableColumnVisibility("SubProperty2", true, "ReferenceFacet_2::responsiveTable");
		});

		opaTest("Check the OP table column 'SubProperty1' is not hidden using the path value set to the property of parent entity - false", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheBackButtonOnFLP();
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({ Field: "HideColumnProperty", Value: false });
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("Property 1 Entity 2");
			Then.onTheObjectPage
				.iCheckNumberOfItemsInTable(2, "ReferenceFacet_2::responsiveTable")
				.and
				.iCheckTableColumnVisibility("SubProperty1", true, "ReferenceFacet_2::responsiveTable")
				.and
				.iCheckTableColumnVisibility("SubProperty2", true, "ReferenceFacet_2::responsiveTable");
		});

		opaTest("Check the OP table cell visibility for the column 'RootProperty1' based on the property 'BoolProperty' of the sub entity", function (Given, When, Then) {
			Then.onTheObjectPage
				.iCheckRenderedColumnTextOnNthRowOfTable(1, [5], ["Yes"], "ReferenceFacet_2::responsiveTable")
				.and
				.iCheckTheCellVisibilityOfNthColumnOnNthRowOfTable(1, 6, false, "ReferenceFacet_2::responsiveTable")
				.and
				.iCheckRenderedColumnTextOnNthRowOfTable(2, [5], ["No"], "ReferenceFacet_2::responsiveTable")
				.and
				.iCheckTheCellVisibilityOfNthColumnOnNthRowOfTable(2, 6, true, "ReferenceFacet_2::responsiveTable")
		});

		opaTest("Check the OP table column 'SubProperty1' is getting hidden when the path value is set to true from the OP form", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheEditButton();
			When.onTheObjectPage
				.iClickOnCheckboxWithText("", "HideColumnProperty::Field-cBoxBool");
			Then.onTheObjectPage
				.iCheckNumberOfItemsInTable(2, "ReferenceFacet_2::responsiveTable")
				.and
				.iCheckTableColumnVisibility("SubProperty1", false, "ReferenceFacet_2::responsiveTable")
				.and
				.iCheckTableColumnVisibility("SubProperty2", true, "ReferenceFacet_2::responsiveTable");
		});

		opaTest("Check the OP table column 'SubProperty1' is getting visible when the path value is set to false from the OP form", function (Given, When, Then) {
			When.onTheObjectPage
				.iClickOnCheckboxWithText("", "HideColumnProperty::Field-cBoxBool");
			Then.onTheObjectPage
				.iCheckNumberOfItemsInTable(2, "ReferenceFacet_2::responsiveTable")
				.and
				.iCheckTableColumnVisibility("SubProperty1", true, "ReferenceFacet_2::responsiveTable")
				.and
				.iCheckTableColumnVisibility("SubProperty2", true, "ReferenceFacet_2::responsiveTable");
			Then.iTeardownMyApp();
		});
	}
);