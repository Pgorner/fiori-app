/* global QUnit */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"test-resources/sap/ui/comp/testutils/opa/TestLibrary"
], function (
	Opa5,
	opaTest
) {
	"use strict";

	var sComponent = "__component0---nullable--";

	Opa5.extendConfig({
		autoWait: true,
		enabled: false,
		testLibs: {
			compTestLibrary: {
				appUrl: "test-resources/sap/ui/comp/smartfield/SmartFieldTypes/SmartField_Types.html#/pages/nullable"
			}
		}
	});

	sap.ui.require([
		"sap/ui/comp/qunit/smartfield/opa/SmartFieldTypes/pages/SmartFieldTypes"
	], function() {

		QUnit.module("Numeric fields with nullable=false");

		opaTest("Numeric fields with nullable=false should have 0 value when the field is empty", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "IINT16", 0);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "IINT16", "0");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "IDECIMAL", 0.00);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "IDECIMAL", "0.00");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "IDOUBLE", 233);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "IDOUBLE", "233");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "ISINGLE", 0);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "ISINGLE", "0");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "IINT32", 0);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "IINT32", "0");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "IINT64", 0);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "IINT64", "0");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "IBYTE", 0);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "IBYTE", "0");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "ISBYTE", 0);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "ISBYTE", "0");

			// Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "IINT16", "");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "IDECIMAL", "");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "IDOUBLE", "");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "ISINGLE", "");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "IINT32", "");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "IINT64", "");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "IBYTE", "");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "ISBYTE", "");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "IINT16", 0);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "IINT16", "0");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "IDECIMAL", 0.00);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "IDECIMAL", "0.00");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "IDOUBLE", 0);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "IDOUBLE", "0");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "ISINGLE", 0);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "ISINGLE", "0");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "IINT32", 0);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "IINT32", "0");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "IINT64", 0);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "IINT64", "0");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "IBYTE", 0);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "IBYTE", "0");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "ISBYTE", 0);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "ISBYTE", "0");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("Numeric fields with nullable=false and mandatory annotation should have 0 value when the field is empty", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "MINT16", 0);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "MINT16", "0");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "MDECIMAL", 0.00);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "MDECIMAL", "0.00");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "MDOUBLE", 233);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "MDOUBLE", "233");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "MSINGLE", 0);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "MSINGLE", "0");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "MINT32", 0);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "MINT32", "0");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "MINT64", 0);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "MINT64", "0");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "MBYTE", 0);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "MBYTE", "0");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "MSBYTE", 0);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "MSBYTE", "0");

			// Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "MINT16", "");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "MDECIMAL", "");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "MDOUBLE", "");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "MSINGLE", "");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "MINT32", "");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "MINT64", "");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "MBYTE", "");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "MSBYTE", "");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "MINT16", 0);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "MINT16", "0");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "MDECIMAL", 0.00);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "MDECIMAL", "0.00");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "MDOUBLE", 0);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "MDOUBLE", "0");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "MSINGLE", 0);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "MSINGLE", "0");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "MINT32", 0);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "MINT32", "0");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "MINT64", 0);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "MINT64", "0");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "MBYTE", 0);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "MBYTE", "0");

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "MSBYTE", 0);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "MSBYTE", "0");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.start();

	});
});
