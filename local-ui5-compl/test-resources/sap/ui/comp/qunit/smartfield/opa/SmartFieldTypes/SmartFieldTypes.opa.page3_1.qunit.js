/* global QUnit */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"test-resources/sap/ui/comp/testutils/opa/TestLibrary"
], function(
	Opa5,
	opaTest
) {
	"use strict";

	var sComponent = "__component0---inOut--",
		sOutputAreaId = sComponent + "outputAreaChangedData";

	Opa5.extendConfig({
		autoWait: true,
		enabled: false,
		timeout: 60,
		testLibs: {
			compTestLibrary: {
				appUrl: "test-resources/sap/ui/comp/smartfield/SmartFieldTypes/SmartField_Types.html#/pages/inOut"
			}
		}
	});

	sap.ui.require([
		"sap/ui/comp/qunit/smartfield/opa/SmartFieldTypes/pages/SmartFieldTypes"
	], function() {

		opaTest("When I start the 'SmartField_Types' app, the SmartFields should have the right values displayed", function (Given, When, Then) {

			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "inKey", "A");
		});

		opaTest("When SmartFields gets enabled/disabled, its inner controls of a type SmartLink should get updated accordingly", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", false);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithoutDomAttribute(sComponent + "smartLink", "aria-disabled");

			//Action
			When.onTheSmartField.iSetSmartFieldControlProperty(sComponent + "smartLink", "enabled", false);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithDomAttribute(sComponent + "smartLink", "aria-disabled", "true");

			//Clean
			When.onTheSmartFieldTypesPage.iPressButton(sComponent + "btnEdit-button");

		});

		opaTest("When I use the value help the in-parameters are set as filter", function (Given, When, Then) {

			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheValueHelpDialog.iOpenTheValueHelpForInputField(sComponent + "key-input");
			When.onTheSmartFieldTypesPage.iExpandVHDFilters();

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeValueHelpDialogWithFiltersAndRows(7, 2);
			Then.onTheSmartFieldTypesPage.iCheckFieldContainsToken(sComponent + "key-input-valueHelpDialog-smartFilterBar-filterItemControlA_-InKey", "=A");
		});

		opaTest("When I select an entry out-parameters are set", function (Given, When, Then) {

			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartFieldTypesPage.iSelectRowInVHDTable(1);

			//Assertion

			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "key", "02");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "outDate", "Jan 1, 2019");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "outTime", "1:01:01 AM");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndDateTimeValue(sComponent + "outDateTime", new Date(1546300861000).toString());
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "outStringDate", "Jan 1, 2019");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "outDecimal", "654.32");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "outDouble", "654.32");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "outInt16", "21");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "outByte", "321");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "outBool", false);
			Then.onTheSmartFieldTypesPage.iShouldSeeData(sOutputAreaId, "Key", "02");
			Then.onTheSmartFieldTypesPage.iShouldSeeData(sOutputAreaId, "OutDate", "2019-01-01T00:00:00.000Z");
			Then.onTheSmartFieldTypesPage.iShouldSeeData(sOutputAreaId, "OutTime", {ms: 3661000, __edmType: "Edm.Time"});
			Then.onTheSmartFieldTypesPage.iShouldSeeData(sOutputAreaId, "OutDateTime", "2019-01-01T00:01:01.000Z");
			Then.onTheSmartFieldTypesPage.iShouldSeeData(sOutputAreaId, "OutStringDate", "20190101");
			Then.onTheSmartFieldTypesPage.iShouldSeeData(sOutputAreaId, "OutDecimal", "654.32");
			Then.onTheSmartFieldTypesPage.iShouldSeeData(sOutputAreaId, "OutDouble", 654.32);
			Then.onTheSmartFieldTypesPage.iShouldSeeData(sOutputAreaId, "OutInt16", 21);
			Then.onTheSmartFieldTypesPage.iShouldSeeData(sOutputAreaId, "OutByte", 321);
			Then.onTheSmartFieldTypesPage.iShouldSeeData(sOutputAreaId, "OutBool", false);

			When.onTheSmartFieldTypesPage.iPressButton(sComponent + "btnCancel-button");
			When.onTheSmartFieldTypesPage.iPressButton(sComponent + "btnEdit-button");

		});

		opaTest("When I open the ComboBox I should see the items filtered by A in parameter", function (Given, When, Then) {

			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iOpenSuggestionsForSmartField(sComponent + "key2");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFiledPopupFiltered(sComponent + "key2", 2);

		});

		opaTest("When I select an entry out-parameters are set", function (Given, When, Then) {

			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iSelectSmartFieldFirstDropdownItem(sComponent + "key2");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "key2", "01");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "outDate", "May 20, 2019");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "outTime", "8:32:11 AM");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndDateTimeValue(sComponent + "outDateTime", new Date(1558333855900).toString());
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "outStringDate", "May 20, 2019");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "outDecimal", "123.45");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "outDouble", "123.45");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "outInt16", "12");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "outByte", "123");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "outBool", true);
			Then.onTheSmartFieldTypesPage.iShouldSeeData(sOutputAreaId, "Key2", "01");
			Then.onTheSmartFieldTypesPage.iShouldSeeData(sOutputAreaId, "OutDate", "2019-05-20T00:00:00.000Z");
			Then.onTheSmartFieldTypesPage.iShouldSeeData(sOutputAreaId, "OutTime", {ms: 30731000, __edmType: "Edm.Time"});
			Then.onTheSmartFieldTypesPage.iShouldSeeData(sOutputAreaId, "OutDateTime", "2019-05-20T06:30:55.000Z");
			Then.onTheSmartFieldTypesPage.iShouldSeeData(sOutputAreaId, "OutStringDate", "20190520");
			Then.onTheSmartFieldTypesPage.iShouldSeeData(sOutputAreaId, "OutDecimal", "123.45");
			Then.onTheSmartFieldTypesPage.iShouldSeeData(sOutputAreaId, "OutDouble", 123.45);
			Then.onTheSmartFieldTypesPage.iShouldSeeData(sOutputAreaId, "OutInt16", 12);
			Then.onTheSmartFieldTypesPage.iShouldSeeData(sOutputAreaId, "OutByte", 123);
			Then.onTheSmartFieldTypesPage.iShouldSeeData(sOutputAreaId, "OutBool", true);

			//Clean
			When.onTheSmartFieldTypesPage.iPressButton(sComponent + "btnCancel-button");
			When.onTheSmartFieldTypesPage.iPressButton(sComponent + "btnEdit-button");
		});

		opaTest("When I change the In Parameter and open the combobox, the items are filtered", function (Given, When, Then) {

			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "inKey", "B");
			When.onTheSmartField.iOpenSuggestionsForSmartField(sComponent + "key2");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFiledPopupFiltered(sComponent + "key2", 1);

		});

		opaTest("When I toggle between display/edit mode and open the combobox, the items are filtered", function (Given, When, Then) {

			//Action
			When.onTheSmartFieldTypesPage.iPressButton(sComponent + "btnCancel-button");
			When.onTheSmartFieldTypesPage.iPressButton(sComponent + "btnEdit-button");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "key2", "0");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFiledPopupFiltered(sComponent + "key2", 1);

			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I open the Select I should see the items filtered by A in parameter", function (Given, When, Then) {

			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iOpenSuggestionsForSmartField(sComponent + "key3");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFiledSelectPopupFiltered(sComponent + "key3", 2);
		});

		opaTest("When I select an entry out-parameters are set", function (Given, When, Then) {

			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iSelectSmartFieldFirstDropdownItemForSelect(sComponent + "key3");

			// //Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "key3", "01");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "outDate", "May 20, 2019");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "outTime", "8:32:11 AM");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndDateTimeValue(sComponent + "outDateTime", new Date(1558333855900).toString());
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "outStringDate", "May 20, 2019");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "outDecimal", "123.45");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "outDouble", "123.45");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "outInt16", "12");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "outByte", "123");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "outBool", true);
			Then.onTheSmartFieldTypesPage.iShouldSeeData(sOutputAreaId, "Key3", "01");
			Then.onTheSmartFieldTypesPage.iShouldSeeData(sOutputAreaId, "OutDate", "2019-05-20T00:00:00.000Z");
			Then.onTheSmartFieldTypesPage.iShouldSeeData(sOutputAreaId, "OutTime", {ms: 30731000, __edmType: "Edm.Time"});
			Then.onTheSmartFieldTypesPage.iShouldSeeData(sOutputAreaId, "OutDateTime", "2019-05-20T06:30:55.000Z");
			Then.onTheSmartFieldTypesPage.iShouldSeeData(sOutputAreaId, "OutStringDate", "20190520");
			Then.onTheSmartFieldTypesPage.iShouldSeeData(sOutputAreaId, "OutDecimal", "123.45");
			Then.onTheSmartFieldTypesPage.iShouldSeeData(sOutputAreaId, "OutDouble", 123.45);
			Then.onTheSmartFieldTypesPage.iShouldSeeData(sOutputAreaId, "OutInt16", 12);
			Then.onTheSmartFieldTypesPage.iShouldSeeData(sOutputAreaId, "OutByte", 123);
			Then.onTheSmartFieldTypesPage.iShouldSeeData(sOutputAreaId, "OutBool", true);

			//Clean
			When.onTheSmartFieldTypesPage.iPressButton(sComponent + "btnCancel-button");
			When.onTheSmartFieldTypesPage.iPressButton(sComponent + "btnEdit-button");
		});

		opaTest("When I change the In Parameter and open the Select, the items are filtered", function (Given, When, Then) {

			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "inKey", "B");
			When.onTheSmartField.iOpenSuggestionsForSmartField(sComponent + "key3");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFiledSelectPopupFiltered(sComponent + "key3", 1);

			//Clean
			When.onTheSmartFieldTypesPage.iPressButton(sComponent + "btnCancel-button");
			When.onTheSmartFieldTypesPage.iPressButton(sComponent + "btnEdit-button");
		});

		opaTest("When I toggle between display/edit mode and open the Select, the items are filtered", function (Given, When, Then) {
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartFieldTypesPage.iPressButton(sComponent + "btnCancel-button");
			When.onTheSmartFieldTypesPage.iPressButton(sComponent + "btnEdit-button");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFiledSelectPopupFiltered(sComponent + "key3", 1);

			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When SmartFields has an empty value and is in a Form, it should be indicated in a meaningful way", function (Given, When, Then) {

			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", false);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldNotSeeSmartFieldWithEmptyIndicator(sComponent + "smartLink");

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", true);
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "smartLink", "");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldNotSeeSmartFieldWithEmptyIndicator(sComponent + "smartLink");

			//Assertion
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", false);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithEmptyIndicator(sComponent + "smartLink");

			//Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I use the ValueHelp dialog in SmartFields should take over a value into the basic search", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "key", "0", true);
			When.onTheValueHelpDialog.iOpenTheValueHelpForInputField(sComponent + "key-input");

			//Assertion
			When.onTheSmartFieldTypesPage.iExpandVHDFilters();
			Then.onTheSmartFieldTypesPage.iShouldSeeValueHelpDialogWithFiltersAndRows(7, 2);
			Then.onTheValueHelpDialog.iCheckValueHelpDialogBasicSearchTextEqualsTo("0");

			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.start();

	});
});
