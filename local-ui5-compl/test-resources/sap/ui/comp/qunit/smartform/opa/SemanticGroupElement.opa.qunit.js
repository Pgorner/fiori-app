	/* eslint-disable no-undef */
	sap.ui.define([
	'sap/ui/test/Opa5',
	'sap/ui/test/opaQunit',
	'sap/ui/comp/qunit/personalization/opaTests/Arrangement',
	'./actions/SemanticGroupElement',
	'./assertions/SemanticGroupElement'
	], function (
	Opa5,
	opaTest,
	Arrangement,
	Actions,
	Assertions
	) {
	"use strict";

	var appUrl = sap.ui.require.toUrl("test-resources/sap/ui/comp/qunit/smartform/opa/SematicGroupElement/applicationUnderTest/SmartForm_sematicGroupElement.html");

	Opa5.extendConfig({
		autoWait: true,
		enabled: false,
		arrangements: new Arrangement({}),
		assertions: Assertions,
		actions: Actions
	});

	// --- Default Field tests
	QUnit.module("Default Setup");

	opaTest("Should see the SmartForm", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyAppInAFrame(appUrl);

		// Assertions
		Then.iShouldSeeSmartForm();

		// Cleanup
		Then.iTeardownMyApp();

	});

	QUnit.module("Edit mode");

	opaTest("Should see SmartFields in edit mode", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyAppInAFrame(appUrl);

		// Arrangements
		When.iToggleFormEditMode(true);

		// Assertions
		Then.iShouldSeeSmartFieldWithIdAndValue("__component0---IDView--Office", 1);

		// Cleanup
		Then.iTeardownMyApp();
	});

	opaTest("Should see delimiters of SmartFields in edit mode", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyAppInAFrame(appUrl);

		// Arrangements
		When.iToggleFormEditMode(true);

		// Assertions
		Then.iShouldSeeDelimiterOfSemanticFieldsInEditMode("__component0---IDView--SemanticGroupElement1-delimiter-0", "/");

		// Cleanup
		Then.iTeardownMyApp();
	});

	QUnit.module("Display mode");

	opaTest("Should see the semantically connected fields as text with delimiters", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyAppInAFrame(appUrl);

		// Assertions
		Then.iShouldSeeSemanticFieldsAsText("__component0---IDView--SemanticGroupElement1-display");

		// Cleanup
		Then.iTeardownMyApp();
	});

	opaTest("Should see the semantically connected fields UoM and Currency correctly", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyAppInAFrame(appUrl);

		// Assertions
		Then.iShouldSeeUoMCurrencySemanticFieldsWithCorrectTextValue("__component0---IDView--SemanticGroupElementUoMCurrency-display", "856.49\u2007EUR / 2.000000\u2007KG");

		// Cleanup
		Then.iTeardownMyApp();
	});

	opaTest("Should see the semantically connected fields UoM and Currency text value correctly after toggling the mode", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyAppInAFrame(appUrl);

		// Assertions
		Then.iShouldSeeUoMCurrencySemanticFieldsWithCorrectTextValue("__component0---IDView--SemanticGroupElementUoMCurrency-display", "856.49\u2007EUR / 2.000000\u2007KG");

		// Arrangements
		When.iToggleFormEditMode(true);

		// Assertions
		Then.iShouldSeeDelimiterOfSemanticFieldsInEditMode("__component0---IDView--SemanticGroupElementUoMCurrency-delimiter-0", "/");

		// Arrangements
		When.iPress("__component0---IDView--smartForm-toolbar-sfmain-button-sfmain-editToggle");

		// Assertions
		Then.iShouldSeeUoMCurrencySemanticFieldsWithCorrectTextValue("__component0---IDView--SemanticGroupElementUoMCurrency-display", "856.49\u2007EUR / 2.000000\u2007KG");

		// Cleanup
		Then.iTeardownMyApp();
	});

	opaTest("Should see rendered text when connected fields are in display mode but form is in edit mode", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyAppInAFrame(appUrl);

		// Assertions
		Then.iShouldSeeUoMCurrencySemanticFieldsWithCorrectTextValue("__component0---IDView--SemanticGroupElementUoMCurrencyNotEditable-display", "123.45\u2007USD / 3.000000\u2007PC");

		// Arrangements
		When.iToggleFormEditMode(true);

		// Assertions
		Then.iShouldSeeUoMCurrencySemanticFieldsWithCorrectTextValue("__component0---IDView--SemanticGroupElementUoMCurrencyNotEditable-display", "123.45\u2007USD / 3.000000\u2007PC");

		// Cleanup
		Then.iTeardownMyApp();
	});

	opaTest("Should see rendered SmartLinks when connected fields are in display", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyAppInAFrame(appUrl);

		// Assertions
		Then.iShouldSeeSemanticFieldAsSmartLink("__component0---IDView--category1");
		Then.iShouldSeeSemanticFieldAsSmartLink("__component0---IDView--category2");

		// Cleanup
		Then.iTeardownMyApp();
	});


});
