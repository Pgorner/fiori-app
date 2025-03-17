/* global QUnit */
sap.ui.define([
	"sap/ui/test/opaQunit",
	"sap/base/strings/whitespaceReplacer",
	"sap/ui/test/actions/Press",
	"./ValueHelpDialogPage",
	"test-resources/sap/ui/comp/testutils/opa/TestLibrary"
], function(
	opaTest,
	whitespaceReplacer,
	Press,
	ValueHelpDialogPage,
	TestLibrary
) {
	"use strict";
	const APPLICATION_UNDER_TEST_NO_BINDIG_CONTEXT_URL = "test-resources/sap/ui/comp/qunit/valuehelpdialog/opaTests/applicationUnderTestNoBindingContext/ValueHelpDialog.html";


	// OpenCloseJourney
	QUnit.module("ValueHelpDialog PageObject");
	let sInputId = "valuehelpdialog---mainView--MI-mInput";

	opaTest("I open and close the ValueHelpDialog for a given input field", function(Given, When, Then) {
		Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

		When.onTheValueHelpDialog.iOpenTheValueHelpForInputField(sInputId);
		When.onTheValueHelpDialog.iCloseTheValueHelpDialog(true);

		When.onTheValueHelpDialog.iOpenTheValueHelpForInputField(sInputId);
		When.onTheValueHelpDialog.iCloseTheValueHelpDialog(false);

		// cleanup
		Given.onTheCompTestLibrary.iStopMyApp();
	});

	opaTest("I close ValueHelpDialog with the 'OK' button", function(Given, When, Then) {
		Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

		When.onTheValueHelpDialogPage.iOpenValueHelpDialogForInput(sInputId);
		When.onTheValueHelpDialogPage.iPressValueHelpDialogOKButton(sInputId);

		Then.onTheValueHelpDialogPage.iCheckValueHelpDialogIsNotOpenedForInput(sInputId);
	});

	opaTest("I close ValueHelpDialog with the 'Cancel' button", function(Given, When, Then) {
		Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

		When.onTheValueHelpDialogPage.iOpenValueHelpDialogForInput(sInputId);
		When.onTheValueHelpDialogPage.iPressValueHelpDialogCancelButton(sInputId);

		Then.onTheValueHelpDialogPage.iCheckValueHelpDialogIsNotOpenedForInput(sInputId);

		Given.onTheCompTestLibrary.iStopMyApp();
	});

	// ShowFiltersJourney
	QUnit.module("FilterBar");
	sInputId = "valuehelpdialog---mainView--MI-mInput";
	const sInputIdSmartField = "valuehelpdialog---mainView--SF1-input";

	opaTest("When Basic search is enabled the filters area is collapsed", function(Given, When, Then) {
		Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

		When.onTheValueHelpDialogPage.iOpenValueHelpDialogForInput(sInputId);
		When.onTheValueHelpDialogPage.iOpenTabSearchAndSelect();

		Then.onTheValueHelpDialogPage.iCheckFilterBarIsCollapsed();

		Given.onTheCompTestLibrary.iStopMyApp();
	});

	opaTest("When Basic search is disabled the filters area is expanded", function(Given, When, Then) {
		Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

		When.onTheValueHelpDialogPage.iOpenValueHelpDialogForInput(sInputIdSmartField);

		Then.onTheValueHelpDialogPage.iCheckFilterBarIsExpanded();

		Given.onTheCompTestLibrary.iStopMyApp();
	});

	opaTest("FilterBar displays 2 filters", function(Given, When, Then) {
		Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

		When.onTheValueHelpDialogPage.iOpenValueHelpDialogForInput(sInputId);
		When.onTheValueHelpDialogPage.iOpenTabSearchAndSelect();
		When.onTheValueHelpDialogPage.iShowFilters();

		Then.onTheValueHelpDialogPage.iCheckFilterBarDisplaysNFilters(2);
	});

	opaTest("All filters are displayed", function(Given, When, Then) {
		Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

		When.onTheValueHelpDialogPage.iOpenTabSearchAndSelect();
		When.onTheValueHelpDialogPage.iShowFilters();

		Then.onTheValueHelpDialogPage.iCheckFilterBarDisplaysAllFilters();

		Given.onTheCompTestLibrary.iStopMyApp();
	});

	// UpdateCountInTabs
	QUnit.module("Tabs");
	sInputId = "valuehelpdialog---mainView--MI-mInput";

	opaTest(
		"1 items is selected from the items list and the count is in the tab title",
		function(Given, When, Then) {
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			When.onTheValueHelpDialogPage.iOpenValueHelpDialogForInput(sInputId);
			When.onTheValueHelpDialogPage.iOpenTabSearchAndSelect();
			When.onTheValueHelpDialogPage.iSearchByText("");
			When.onTheValueHelpDialogPage.iSelectItemByIndex(0);

			Then.onTheValueHelpDialogPage.iCheckItemIsSelected(0);
			Then.onTheValueHelpDialogPage.iCheckSearchAndSelectTabTitleContainsCount(1);
		}
	);

	opaTest(
		"Selecting 1 more item from the items list increases the count in the 'Search and Select' tab name",
		function(Given, When, Then) {
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			When.onTheValueHelpDialogPage.iOpenTabSearchAndSelect();
			When.onTheValueHelpDialogPage.iSelectItemsByRange(0, 1);

			Then.onTheValueHelpDialogPage.iCheckItemIsSelected(0);
			Then.onTheValueHelpDialogPage.iCheckItemIsSelected(1);
			Then.onTheValueHelpDialogPage.iCheckSearchAndSelectTabTitleContainsCount(2);
		}
	);

	opaTest("Deselecting 1 item from the items list decreases the count in the 'Search and Select' tab name",
		function(Given, When, Then) {
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			When.onTheValueHelpDialogPage.iOpenTabSearchAndSelect();
			When.onTheValueHelpDialogPage.iDeselectItemByIndex(1);

			Then.onTheValueHelpDialogPage.iCheckItemIsNotSelected(1);
			Then.onTheValueHelpDialogPage.iCheckSearchAndSelectTabTitleContainsCount(1);
		}
	);

	opaTest("1 condition is selected and the count is in the tab title", function(Given, When, Then) {
		Given.onTheCompTestLibrary.iEnsureMyAppIsRunning(APPLICATION_UNDER_TEST_NO_BINDIG_CONTEXT_URL);

		When.onTheValueHelpDialogPage.iOpenValueHelpDialogForInput(sInputId);
		When.onTheValueHelpDialogPage.iOpenTabDefineConditions();
		When.onTheValueHelpDialogPage.iEnterConditionValues(0, "Test");
		When.onTheValueHelpDialogPage.iSelectConditionOperator(0, "EQ");

		Then.onTheValueHelpDialogPage.iCheckConditionsCountEqualTo(1);
		Then.onTheValueHelpDialogPage.iCheckConditionsTabTitleContainsCount(1);
	});

	opaTest(
		"Adding new condition increases the count in the 'Define Conditions' tab name",
		function(Given, When, Then) {
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning(APPLICATION_UNDER_TEST_NO_BINDIG_CONTEXT_URL);

			When.onTheValueHelpDialogPage.iOpenTabDefineConditions();
			When.onTheValueHelpDialogPage.iAddNewCondition();
			When.onTheValueHelpDialogPage.iEnterConditionValues(1, "Test-2");
			When.onTheValueHelpDialogPage.iSelectConditionOperator(1, "EQ");

			Then.onTheValueHelpDialogPage.iCheckConditionsCountEqualTo(2);
			Then.onTheValueHelpDialogPage.iCheckConditionsTabTitleContainsCount(2);
		}
	);

	opaTest(
		"Removing existing condition decreases the count in the 'Define Conditions' tab name",
		function(Given, When, Then) {
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning(APPLICATION_UNDER_TEST_NO_BINDIG_CONTEXT_URL);

			When.onTheValueHelpDialogPage.iOpenTabDefineConditions();
			When.onTheValueHelpDialogPage.iRemoveConditionAtIndex(1);

			Then.onTheValueHelpDialogPage.iCheckConditionsCountEqualTo(1);
			Then.onTheValueHelpDialogPage.iCheckConditionsTabTitleContainsCount(1);

			Given.onTheCompTestLibrary.iStopMyApp();
		}
	);

	// RemoveTokens
	QUnit.module("Tokenizer");
	sInputId = "valuehelpdialog---mainView--MI-mInput";

	opaTest("Should remove all tokens", function(Given, When, Then) {
		Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

		When.onTheValueHelpDialogPage.iOpenValueHelpDialogForInput(sInputId);
		When.onTheTokenizer.iRemoveAllTokensFromValueHelpDialog();

		Then.onTheTokenizer.iCheckTokensCountInValueHelpDialogEqualsTo(0);

		Given.onTheCompTestLibrary.iStopMyApp();
	});

	// Whitespace characters
	QUnit.module("Whitespaces");
	const sSFBInputId = "valuehelpdialog---mainView--smartFilterBar-filterItemControlA_-Text";

	opaTest("Whitespace characters should be correct displayed in the tokenizer", function(Given, When, Then) {
		Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

		When.onTheValueHelpDialogPage.iOpenValueHelpDialogForInput(sSFBInputId);
		When.onTheValueHelpDialogPage.iSelectItemByIndex(2);

		Then.onTheTokenizer.iCheckTokenizerInValueHelpDialogContainsToken(whitespaceReplacer("Text   with 3 whitespaces (3)"));

		Given.onTheCompTestLibrary.iStopMyApp();
	});


	QUnit.module("Others");
	sInputId = "valuehelpdialog---mainView--MI-mInput";
	const sAuthorsInputId = "valuehelpdialog---mainView--smartFilterBar-filterItemControlA_-Authors";

	// Waiting for tables team to say is it possible to auto sort a column
	/**
	 * @deprecated As of version 1.120
	 */
	opaTest("First column should be auto sorted", function(Given, When, Then) {
		Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

		When.onTheValueHelpDialogPage.iOpenValueHelpDialogForInput(sInputId);
		When.onTheValueHelpDialogPage.iPressGoButton();

		Then.onTheValueHelpDialogPage.iCheckColumnIsSorted("ID", true);

		When.onTheValueHelpDialogPage.iSearchByText("1");
		When.onTheValueHelpDialogPage.iPressGoButton();

		Then.onTheValueHelpDialogPage.iCheckColumnIsSorted("ID", false);

		Given.onTheCompTestLibrary.iStopMyApp();
	});

	opaTest(
		"Selecting items after search from the items list and clearing search - the count in the 'Search and Select' tab name is correct",
		function(Given, When, Then) {
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			When.onTheValueHelpDialogPage.iOpenValueHelpDialogForInput(sAuthorsInputId);
			When.onTheValueHelpDialogPage.iOpenTabSearchAndSelect();
			When.onTheValueHelpDialogPage.iPressShowFiltersButton();
			When.onTheValueHelpDialogPage.iSearchByFilterIndexAndValue(0, "*2*");
			When.onTheValueHelpDialogPage.iPressGoButton();
			When.onTheValueHelpDialogPage.iSelectItemsByRange(0, 2);

			When.onTheValueHelpDialogPage.iRemoveFilterTokensByFilterIndex(0);
			When.onTheValueHelpDialogPage.iPressGoButton();

			Then.onTheValueHelpDialogPage.iCheckItemIsNotSelected(0);
			Then.onTheValueHelpDialogPage.iCheckSearchAndSelectTabTitleContainsCount(3);

			Given.onTheCompTestLibrary.iStopMyApp();
		}
	);

	QUnit.module("Standalone with SmartTable");

	opaTest("The count in the table header is shown", function(Given, When, Then) {
		// Arrange
		Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

		// Act
		When.waitFor({
			id: "valuehelpdialog---mainView--openWithSmartTable",
			actions: new Press()
		});

		// Assert
		Then.onTheValueHelpDialogPage.iCheckItemsCountEqualTo(20);

		// Cleanup
		Given.onTheCompTestLibrary.iStopMyApp();
	});
});
