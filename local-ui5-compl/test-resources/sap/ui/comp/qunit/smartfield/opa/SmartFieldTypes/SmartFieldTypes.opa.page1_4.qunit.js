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

	var sComponent = "__component0---types--",
		sOutputAreaId = sComponent + "outputAreaChangedData",
		sRemoveButtonId = sComponent + "btnRemoveBindingContext-button";

	Opa5.extendConfig({
		autoWait: true,
		enabled: false,
		timeout: 60,
		testLibs: {
			compTestLibrary: {
				appUrl: "test-resources/sap/ui/comp/smartfield/SmartFieldTypes/SmartField_Types.html#/pages/types"
			}
		}
	});

	sap.ui.require([
		"sap/ui/comp/qunit/smartfield/opa/SmartFieldTypes/pages/SmartFieldTypes"
	], function() {

		opaTest("All instances of sap.m.Input generated from SmartField should have _setPreferUserInteraction set", function (Given, When, Then) {
			// Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			Then.waitFor({
				controlType: "sap.ui.comp.smartfield.SmartField",
				matchers: function (oSF) {
					return oSF.getFirstInnerControl() !== null;
				},
				success: function (aSmartFields) {
					var aInputs = [];

					// Filter out internally generated inputs which are rendered
					aSmartFields.forEach(function (oSF) {
						var oControl = oSF.getFirstInnerControl();

						if (oControl.isA("sap.m.InputBase") && oControl.getDomRef()) {
							aInputs.push(oControl);
						}
					});

					// Assert
					Opa5.assert.ok(aInputs.length > 10, "We did found some input controls rendered from SmartField");
					aInputs.forEach(function (oControl) {
						Opa5.assert.strictEqual(
							oControl._bPreferUserInteraction,
							true,
							"Control has proper configuration applied"
						);
					});
				}
			});

		});

		opaTest("SmartField for UoM (amount) and numeric Edm Types should be right aligned in edit mode", function (Given, When, Then) {
			// Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Assert
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldInMode(sComponent + "Quantity", "edit");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldInMode(sComponent + "decimal", "edit");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithTextAlign(sComponent + "Quantity", "End");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithTextAlign(sComponent + "decimal", "End");

			// Cleanup
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("SmartField should destroy its control factory and base controls, if bindingContext is removed", function (Given, When, Then) {
			//Arrangement
			var sStringDateValue = "Dec 15, 2000",
				sDateTimeValue = "Oct 24, 2014, 2:20:00 PM", // sap.ui.model.odata.type.DateTimeBase.prototype.formatValue(new Date("Oct 24, 2014, 2:20:00 PM"), "string")
				sDateTimeOffsetValue = "Oct 24, 2014, 2:20:00 PM", // sap.ui.model.odata.type.DateTimeOffset.prototype.formatValue(new Date("Oct 24, 2014, 2:20:00 PM"), "string")
				sDateValue = "Oct 24, 2014";

			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "date", sDateValue);
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "dateTime", sDateTimeValue);
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "dtOffset", sDateTimeOffsetValue);
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "stringDate", sStringDateValue);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "date", sDateValue);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "dateTime", sDateTimeValue);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "dtOffset", sDateTimeOffsetValue);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "stringDate", sStringDateValue);

			//Action
			When.onTheSmartFieldTypesPage.iPressButton(sRemoveButtonId);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "date", null);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "dateTime", null);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "dtOffset", null);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "stringDate", null);

			//Action
			When.onTheSmartFieldTypesPage.iPressSelectProduct("1001");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "date", sDateValue);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "dateTime", sDateTimeValue);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "dtOffset", sDateTimeOffsetValue);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "stringDate", sStringDateValue);

			// Cleanup
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("SmartField should set placeholder if its base controls get destroyed", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndPlaceholder(sComponent + "date", false);

			//Action
			When.onTheSmartFieldTypesPage.iPressButton(sRemoveButtonId);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndPlaceholder(sComponent + "date", true);

			//Action
			When.onTheSmartFieldTypesPage.iPressSelectProduct("1001");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndPlaceholder(sComponent + "date", false);

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", false);
			When.onTheSmartFieldTypesPage.iPressButton(sRemoveButtonId);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndPlaceholder(sComponent + "date", true);

			//Action
			When.onTheSmartFieldTypesPage.iPressSelectProduct("1002");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndPlaceholder(sComponent + "date", false);

			// Cleanup
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("SmartField should set placeholder from annotation", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeInnerControlWith(sComponent + "CurrencyCodeFixedValues", "placeholder", "Placeholder annotation text");

			// Cleanup
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("SmartField property placeholder should have precedence if annotation is defined too", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeInnerControlWith(sComponent + "CurrencyCode", "placeholder", "Placeholder property text");

			// Cleanup
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("SmartField annotation placeholder should have precedence over initial Date placeholder", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartFieldTypesPage.iEnterValueInSmartField(sComponent + "date", "");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeInnerControlWith(sComponent + "date", "placeholder", "Placeholder annotation text");

			// Cleanup
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I use the SmartFields without editable related annotation, the SmartField display/edit state should stay consistent on data model refresh", function (Given, When, Then) {
			var bForceDataModelRefresh = true;
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Assertion
			Then.onTheSmartFieldTypesPage.iCheckSmartFieldProperyHasValue(sComponent + "editModeControl", "editable", true);
			Then.onTheSmartFieldTypesPage.iCheckSmartFieldProperyHasValue(sComponent + "displayModeControl", "editable", false);

			//Action
			When.onTheSmartField.iRefreshDataModel(sComponent + "editModeControl", bForceDataModelRefresh);

			//Assertion
			Then.onTheSmartFieldTypesPage.iCheckSmartFieldProperyHasValue(sComponent + "editModeControl", "editable", true);
			Then.onTheSmartFieldTypesPage.iCheckSmartFieldProperyHasValue(sComponent + "displayModeControl", "editable", false);
		});

		opaTest("Mandatory field with clientSideMandatoryCheck=false allows empty string", function (Given, When, Then) {
			// Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Action
			When.onTheSmartField.iRefreshDataModel(sComponent + "editModeControl", true);
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "stringMandatory", "");

			// Assert
			Then.onTheSmartFieldTypesPage.iShouldSeeData(sOutputAreaId, "STRINGMANDATORY", "");

			// Cleanup
			Given.onTheCompTestLibrary.iStopMyApp();
		});


		QUnit.start();

	});
});
