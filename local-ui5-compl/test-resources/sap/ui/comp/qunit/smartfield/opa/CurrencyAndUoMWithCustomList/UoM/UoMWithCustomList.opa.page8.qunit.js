/* eslint-disable no-undef */
sap.ui.define([
	"sap/ui/core/Lib",
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/core/library",
	"test-resources/sap/ui/comp/testutils/opa/TestLibrary"
], function(
	Library,
	Opa5,
	opaTest,
	coreLibrary
) {
    "use strict";
    var appUrl = sap.ui.require.toUrl("test-resources/sap/ui/comp/qunit/smartfield/opa/CurrencyAndUoMWithCustomList/applicationUnderTestUoM/UoMWithCustomListUoMHidden.html"),
		sQuantityControlId = "idView--Quantity",
		sUnitCodeControlId = "idView--UnitCode",
		ValueState = coreLibrary.ValueState,
		compResourceBundle = Library.getResourceBundleFor("sap.ui.comp");

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
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sQuantityControlId, ValueState.None);

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sQuantityControlId, "3");
			When.onTheSmartFieldTypesPage.iClickButton("idView--checkModelMessages");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sQuantityControlId, "3");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sQuantityControlId, "3.000000");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sQuantityControlId, ValueState.None);
			Then.onTheSmartFieldTypesPage.iShouldSeeNumberOfErrors("idView--modelMessages",0);
			Then.onTheSmartFieldTypesPage.iShouldSeeOfErrorsMessage("idView--modelMessages","");

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sUnitCodeControlId, "KG");
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(false);

			// Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlValue(sQuantityControlId, "3.000");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		/**
		 * @deprecated As of version 1.64, replaced by {@link sap.ui.comp.smartfield.SmartField#checkValuesValidity}
		 */
		opaTest("When I input a not valid Quantity amount and code, it should have error log", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sQuantityControlId, ValueState.None);

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sQuantityControlId, "3");
			When.onTheSmartField.iEnterTextInSmartField(sUnitCodeControlId, "KG");
			When.onTheSmartField.iEnterTextInSmartField(sUnitCodeControlId, "");
			When.onTheSmartFieldTypesPage.iClickButton("idView--checkModelMessages");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sQuantityControlId, "3");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sQuantityControlId, "3.000");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sQuantityControlId, ValueState.None);
			Then.onTheSmartFieldTypesPage.iShouldSeeNumberOfErrors("idView--modelMessages",1);
			Then.onTheSmartFieldTypesPage.iShouldSeeOfErrorsMessage("idView--modelMessages",compResourceBundle.getText("MANDATORY_FIELD_WITH_LABEL_ERROR", ["Unit"]));

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sUnitCodeControlId, "KG");
			When.onTheSmartFieldTypesPage.iClickButton("idView--checkModelMessages");
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(false);

			// Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlValue(sQuantityControlId, "3.000");
			Then.onTheSmartFieldTypesPage.iShouldSeeNumberOfErrors("idView--modelMessages",0);
			Then.onTheSmartFieldTypesPage.iShouldSeeOfErrorsMessage("idView--modelMessages","");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.start();
	});
});
