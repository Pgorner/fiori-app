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
    var appUrl = sap.ui.require.toUrl("test-resources/sap/ui/comp/qunit/smartfield/opa/CurrencyAndUoMWithCustomList/applicationUnderTestUoM/UoMWithCustomListSuppressUnit.html"),
	sQuantityControlId = "idView--Quantity",
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

		QUnit.module("Unit of measure");

		/**
		 * @deprecated As of version 1.64, replaced by {@link sap.ui.comp.smartfield.SmartField#checkValuesValidity}
		 */
		opaTest("When I input a valid Quantity amount and code, it should be formatted correctly with value state NONE", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sQuantityControlId, "2");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sQuantityControlId, "2.000");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sQuantityControlId, ValueState.None);

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sQuantityControlId, "3");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sQuantityControlId, "3");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sQuantityControlId, "3.000");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sQuantityControlId, ValueState.None);

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(false);

			// Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlValue(sQuantityControlId, "3.000");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.start();
	});
});
