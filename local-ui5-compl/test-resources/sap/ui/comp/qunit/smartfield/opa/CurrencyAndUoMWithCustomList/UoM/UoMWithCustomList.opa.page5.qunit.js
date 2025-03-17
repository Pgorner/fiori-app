/* eslint-disable no-undef */
sap.ui.define([
	'sap/ui/test/Opa5',
	'sap/ui/test/opaQunit',
	'sap/ui/core/library',
	"test-resources/sap/ui/comp/testutils/opa/TestLibrary"
], function (
	Opa5,
	opaTest,
	coreLibrary
) {
    "use strict";
    var appUrl = sap.ui.require.toUrl("test-resources/sap/ui/comp/qunit/smartfield/opa/CurrencyAndUoMWithCustomList/applicationUnderTestUoM/UoMWithCustomListTextArrangement.html"),
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
		opaTest("When I input a valid Quantity amount and code, it should be formatted correctly with value state NONE", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sQuantityControlId, "2");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sQuantityControlId, "2.000");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sQuantityControlId, ValueState.None);

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sUnitCodeControlId, "KG");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sUnitCodeControlId, "KG (Kilogram)");

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sQuantityControlId, "3");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sUnitCodeControlId, "KG");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sUnitCodeControlId, "KG (Kilogram)");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sQuantityControlId, "3");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sQuantityControlId, "3.000");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sQuantityControlId, ValueState.None);

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(false);

			// Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlValue(sQuantityControlId, "3.000" + "\u2007");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		/**
		 * @deprecated As of version 1.64, replaced by {@link sap.ui.comp.smartfield.SmartField#checkValuesValidity}
		 */
		opaTest("When I input a valid Quantity amount and code, it should be formatted correctly with value state NONE when unit is editable", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();
			When.onTheSmartFieldTypesPage.iToggleEditMode(sUnitCodeControlId, true);

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sQuantityControlId, "2");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sQuantityControlId, "2.000");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sQuantityControlId, ValueState.None);

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sUnitCodeControlId, "KG");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sUnitCodeControlId, "KG");

			//Action
			//on every entered value the editable property for UoM is get from the binding this is why we set it
			//to be able to reproduce app case
			When.onTheSmartField.iEnterTextInSmartField(sQuantityControlId, "3");
			When.onTheSmartFieldTypesPage.iToggleEditMode(sUnitCodeControlId, true);
			When.onTheSmartField.iEnterTextInSmartField(sUnitCodeControlId, "TO");
			When.onTheSmartFieldTypesPage.iToggleEditMode(sUnitCodeControlId, true);

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sUnitCodeControlId, "TO");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sUnitCodeControlId, "TO");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sQuantityControlId, "3");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sQuantityControlId, "3.0");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sQuantityControlId, ValueState.None);

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(false);

			// Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlValue(sQuantityControlId, "3.0" + "\u2007");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.start();
	});
});
