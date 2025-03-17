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
    var appUrl = sap.ui.require.toUrl("test-resources/sap/ui/comp/qunit/smartfield/opa/CurrencyAndUoMWithCustomList/applicationUnderTestUoM/UoMWithCustomListPrimitiveType.html"),
	sQuantityControlId = "idView--Quantity",
	sUnitCodeControlId = "idView--Quantity-sfEdit",
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
		opaTest("When I input a valid unit amount and code, it should be formatted correctly with value state NONE", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sUnitCodeControlId, "KG");
			When.onTheSmartField.iEnterTextInSmartField(sQuantityControlId, "255");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sUnitCodeControlId, "KG");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sUnitCodeControlId, "KG");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sUnitCodeControlId, ValueState.None);

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sQuantityControlId, "255");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sQuantityControlId, "255.000");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sQuantityControlId, ValueState.None);

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(false);

			// Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlValue(sQuantityControlId, "255.000" + "\u2007");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I input a Quantity value is bigger than the primitive type support the binding Quantity value should fallback to the last valid one with value state of ERROR", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sUnitCodeControlId, "KG");
			When.onTheSmartField.iEnterTextInSmartField(sQuantityControlId, 10);
			When.onTheSmartField.iEnterTextInSmartField(sQuantityControlId, 256);

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sUnitCodeControlId, "KG");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sUnitCodeControlId, "KG");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sUnitCodeControlId, ValueState.None);

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sQuantityControlId, "10");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sQuantityControlId, "256");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sQuantityControlId, ValueState.Error);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});


		QUnit.start();
	});
});
