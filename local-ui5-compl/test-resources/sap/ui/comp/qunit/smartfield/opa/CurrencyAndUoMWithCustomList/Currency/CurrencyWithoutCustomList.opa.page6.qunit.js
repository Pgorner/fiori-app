/* eslint-disable no-undef */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/core/library",
	"test-resources/sap/ui/comp/testutils/opa/TestLibrary"
], function (
	Opa5,
	opaTest,
	coreLibrary
) {
	"use strict";
	var appUrl = sap.ui.require.toUrl("test-resources/sap/ui/comp/qunit/smartfield/opa/CurrencyAndUoMWithCustomList/applicationUnderTestCurrency/CurrencyWithoutCustomListTextArrangement.html"),
		sCurrencyControlId = "idView--Currency",
		sCurrencyCodeControlId = "idView--Currency-sfEdit",
		ValueState = coreLibrary.ValueState;

	Opa5.extendConfig({
		autoWait: true,
		enabled: false,
		testLibs: {
			compTestLibrary: {
				appUrl: appUrl
			}
		}
	});
	sap.ui.require([
		"sap/ui/comp/qunit/smartfield/opa/CurrencyAndUoMWithCustomList/pages/Application"
	], function() {

		QUnit.module("Currency code with TextArrangement");

		opaTest("When I input a valid amount, it should be formatted correctly with value state NONE", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, null);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.None);

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "EUR");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "Euro (EUR)");

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyControlId, "2");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "2");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "2.00");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.None);

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "EUR");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "Euro (EUR)");

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sCurrencyControlId, "3");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "EUR");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "Euro (EUR)");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "3");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "3.00");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.None);

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(false);

			// Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlValue(sCurrencyControlId, "3.00" + "\u2007");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.start();
	});
});
