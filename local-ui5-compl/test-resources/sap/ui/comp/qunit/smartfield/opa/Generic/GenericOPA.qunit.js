/* global QUnit */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/qunit/QUnitUtils",
	"test-resources/sap/ui/comp/testutils/opa/TestLibrary"
], function (
	Opa5,
	opaTest,
	QUnitUtils
) {
	"use strict";

	Opa5.extendConfig({
		testLibs: {
			compTestLibrary: {
				appUrl: "test-resources/sap/ui/comp/qunit/smartfield/opa/Generic/applicationUnderTest/Generic.html"
			}
		},
		viewName: "MyView",
		autoWait: true,
		async: true,
		timeout: 30
	});

	sap.ui.require([
		"sap/ui/comp/qunit/smartfield/opa/Generic/applicationUnderTest/test/pages/Application"
	], function() {

		QUnit.module("Focus");

		opaTest("_getNextModeRenderedPromise", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act - invalid user input
			When.onTheApplicationPage.iSwitchToEdit();

			// Assert
			Then.onTheApplicationPage.iShouldSeeSmartFieldInFocus("Field2");
		});

		opaTest("_getICRenderedPromise", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act - invalid user input
			When.onTheApplicationPage.iSwitchToEdit2();

			// Assert
			Then.onTheApplicationPage.iShouldSeeSmartFieldInFocus("Field4");
		});

		QUnit.module("BCP: 002075129400001371562023 - value with reserved characters");

		opaTest("Correct OData type created", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Assert
			When.waitFor({
				id: "globalbrandname",
				success: function (oControl) {
					var oType = oControl.getFirstInnerControl().getBinding("value").getType();

					Opa5.assert.ok(oType.isA("sap.ui.comp.smartfield.type.String"),
						"Not a text arrangement type.");
				}
			});
		});

		opaTest("Pick from Value Help", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheApplicationPage.iSelectAnItemFromValueHelp("idView--globalbrandname-input", 0);

			// Assert
			Then.onTheApplicationPage.iShouldSeePendingChangeForField("Employees", "globalbrandname", "ABIRATERONE ACETATE (TABLET)");

			// Act
			When.onTheApplicationPage.iSelectAnItemFromValueHelp("idView--globalbrandname-input", 1);

			// Assert
			Then.onTheApplicationPage.iShouldSeePendingChangeForField("Employees", "globalbrandname", "ARGATROBAN (LIQUID IN VIAL)");
			Then.onTheApplicationPage.iShouldSeePendingChangeForField("Employees", "maportfolio", "SZ");

			// Cleanup
			When.onTheApplicationPage.iResetTheODataModel();
		});

		opaTest("Pick from Suggestions", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheApplicationPage.iSelectAnItemFromSuggestions("idView--globalbrandname", 0);

			// Assert
			Then.onTheApplicationPage.iShouldSeePendingChangeForField("Employees", "globalbrandname", "ABIRATERONE ACETATE (TABLET)");

			// Act
			When.onTheApplicationPage.iSelectAnItemFromSuggestions("idView--globalbrandname", 1);

			// Assert
			Then.onTheApplicationPage.iShouldSeePendingChangeForField("Employees", "globalbrandname", "ARGATROBAN (LIQUID IN VIAL)");
			Then.onTheApplicationPage.iShouldSeePendingChangeForField("Employees", "maportfolio", "SZ");

			// Cleanup
			When.onTheApplicationPage.iResetTheODataModel();
		});

		opaTest("Paste/Type", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheApplicationPage.iChangeTheValueTo("idView--globalbrandname", "ABIRATERONE ACETATE (TABLET)");

			// Assert
			Then.onTheApplicationPage.iShouldSeePendingChangeForField("Employees", "globalbrandname", "ABIRATERONE ACETATE (TABLET)");

			// Act
			When.onTheApplicationPage.iChangeTheValueTo("idView--globalbrandname", "ARGATROBAN (LIQUID IN VIAL)");

			// Assert
			Then.onTheApplicationPage.iShouldSeePendingChangeForField("Employees", "globalbrandname", "ARGATROBAN (LIQUID IN VIAL)");

			// Cleanup
			When.onTheApplicationPage.iResetTheODataModel();
		});

		QUnit.module("NBSP Handling");

		opaTest("Pick from Value Help", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheApplicationPage.iSelectAnItemFromValueHelp("idView--FieldNBSP-input", 3);

			// Assert
			Then.onTheApplicationPage.iShouldSeePendingChangeForField("Employees", "Field2", "5[NBSP]");

			// Act
			When.onTheApplicationPage.iSelectAnItemFromValueHelp("idView--FieldNBSP-input", 4);

			// Assert
			Then.onTheApplicationPage.iShouldSeePendingChangeForField("Employees", "Field2", "6[NBSP]  [NBSP]6");

			// Act
			When.onTheApplicationPage.iSelectAnItemFromValueHelp("idView--FieldNBSP-input", 5);

			// Assert
			Then.onTheApplicationPage.iShouldSeePendingChangeForField("Employees", "Field2", "[NBSP]4");

			// Act
			When.onTheApplicationPage.iSubmitChanges();

			// Assert
			Then.onTheApplicationPage.iShouldSeeRequestForField("POST", "Field2", "[NBSP]4");

			// Cleanup
			When.onTheApplicationPage.iResetTheODataModel();
			When.onTheApplicationPage.iClearTheLog();
		});

		opaTest("Pick from Suggestions", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheApplicationPage.iSelectAnItemFromSuggestions("idView--FieldNBSP", 3);

			// Assert
			Then.onTheApplicationPage.iShouldSeePendingChangeForField("Employees", "Field2", "[NBSP]4");

			// Act
			When.onTheApplicationPage.iSelectAnItemFromSuggestions("idView--FieldNBSP", 4);

			// Assert
			Then.onTheApplicationPage.iShouldSeePendingChangeForField("Employees", "Field2", "5[NBSP]");

			// Act
			When.onTheApplicationPage.iSelectAnItemFromSuggestions("idView--FieldNBSP", 5);

			// Assert
			Then.onTheApplicationPage.iShouldSeePendingChangeForField("Employees", "Field2", "6[NBSP]  [NBSP]6");

			// Act
			When.onTheApplicationPage.iSubmitChanges();

			// Assert
			Then.onTheApplicationPage.iShouldSeeRequestForField("POST", "Field2", "6[NBSP]  [NBSP]6");

			// Cleanup
			When.onTheApplicationPage.iResetTheODataModel();
			When.onTheApplicationPage.iClearTheLog();
		});

		opaTest("Paste/Type", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			/*eslint no-irregular-whitespace: 0*/
			When.onTheApplicationPage.iChangeTheValueTo("idView--FieldNBSP", " 123 ");

			// Assert
			Then.onTheApplicationPage.iShouldSeePendingChangeForField("Employees", "Field2", "[NBSP]123[NBSP]");

			// Act
			When.onTheApplicationPage.iSubmitChanges();

			// Assert
			Then.onTheApplicationPage.iShouldSeeRequestForField("POST", "Field2", "[NBSP]123[NBSP]");

			// Cleanup
			When.onTheApplicationPage.iResetTheODataModel();
			When.onTheApplicationPage.iClearTheLog();
		});

		QUnit.module("FunctionImport");

		opaTest("SmartField renders for defined and undefined parameters", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Assert
			Then.onTheApplicationPage.iShouldSeeRenderedSmartField("FieldFI1");
			Then.onTheApplicationPage.iShouldSeeRenderedSmartField("FieldFC");
			Then.onTheApplicationPage.iShouldSeeRenderedSmartField("FieldFI2");
			Then.onTheApplicationPage.iShouldSeeSmartFieldInMode("FieldFI1", "display");
			Then.onTheApplicationPage.iShouldSeeSmartFieldInMode("FieldFC", "display");
		});

		opaTest("Fields have values on binding context creation", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Assert
			Then.onTheApplicationPage.iShouldSeeSmartFieldInMode("FieldControlTypeReadOnlyFunctionImport", "edit");
			Then.onTheApplicationPage.iShouldSeeSmartFieldInMode("ReadOnlyFunctionImport", "edit");

			// Act
			When.onTheApplicationPage.iPressTheFunctionImportBindButton();

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("FieldFI1", "Field5: Some initial value");
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("FieldFC", "FieldFC: Some initial value");
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("FieldFI2", "MyCustomParameter: Some initial value");
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("FieldControlTypeReadOnlyFunctionImport", "FieldControlTypeReadOnlyFunctionImport: Some value");
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("ReadOnlyFunctionImport", "ReadOnlyFunctionImport: Some value");
			Then.onTheApplicationPage.iShouldSeeSmartFieldInMode("FieldFI1", "edit");
			Then.onTheApplicationPage.iShouldSeeSmartFieldInMode("FieldFI2", "edit");
			Then.onTheApplicationPage.iShouldSeeSmartFieldInMode("FieldFC", "display");
			Then.onTheApplicationPage.iShouldSeeSmartFieldInMode("FieldControlTypeReadOnlyFunctionImport", "display");
			Then.onTheApplicationPage.iShouldSeeSmartFieldInMode("ReadOnlyFunctionImport", "display");
		});

		opaTest("ignoreInsertRestrictions is respected for field bound to a created record", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Assert
			Then.onTheApplicationPage.iShouldSeeSmartFieldInMode("FieldFI3", "edit");
		});

		opaTest("UI.Hidden annotation handling", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Assert
			When.waitFor({
				id: "HiddenEntityType",
				success: function (oControl) {
					Opa5.assert.strictEqual(oControl.getVisible(), true,
						"UI.Hidden on EntityType parameter control should be visible");
				}
			});

			When.waitFor({
				id: "HiddenFunctionImport",
				visible: false,
				success: function (oControl) {
					Opa5.assert.strictEqual(oControl.getVisible(), false,
						"UI.Hidden on function import parameter control should not be visible");
				}
			});

			When.waitFor({
				id: "HiddenFunctionImportCustom",
				visible: false,
				success: function (oControl) {
					Opa5.assert.strictEqual(oControl.getVisible(), false,
						"UI.Hidden on function import custom parameter control should not be visible");
				}
			});
		});

		opaTest("Value Help Annotation loaded and field control value changed", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Assert
			Then.onTheApplicationPage.iShouldSeeRenderedSmartField("FunctionImportValueList");
			Then.onTheApplicationPage.iShouldSeeSmartFieldInMode("FunctionImportValueList", "edit");
			Then.onTheApplicationPage.iShouldSeeValueHelpFilterWithLabel("idView--FunctionImportValueList-input", "Key");
			Then.onTheApplicationPage.iShouldSeeValueHelpFilterWithLabel("idView--FunctionImportValueList-input", "Desc");
			Then.onTheApplicationPage.iShouldSeeSmartMandatory("FunctionImportValueList", false);

			// Act
			When.onTheApplicationPage.iPressTheFunctionImportValueHelpBindButton("functionImportValueListBind");

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("FunctionImportValueList", "Name Function Import Value");
			Then.onTheApplicationPage.iShouldSeeSmartFieldInMode("FunctionImportValueList", "edit");
			Then.onTheApplicationPage.iShouldSeeValueHelpFilterWithLabel("idView--FunctionImportValueList-input", "Function Import Key");
			Then.onTheApplicationPage.iShouldSeeValueHelpFilterWithLabel("idView--FunctionImportValueList-input", "Function Import Desc");
			Then.onTheApplicationPage.iShouldSeeSmartMandatory("FunctionImportValueList");
		});

		opaTest("Value Help Annotation lazy loaded and field control value changed", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Assert
			Then.onTheApplicationPage.iShouldSeeRenderedSmartField("FunctionImportValueListLazy");
			Then.onTheApplicationPage.iShouldSeeSmartFieldInMode("FunctionImportValueListLazy", "edit");
			Then.onTheApplicationPage.iShouldSeeValueHelpFilterWithLabel("idView--FunctionImportValueListLazy-input", "Key");
			Then.onTheApplicationPage.iShouldSeeValueHelpFilterWithLabel("idView--FunctionImportValueListLazy-input", "Desc");
			Then.onTheApplicationPage.iShouldSeeSmartMandatory("FunctionImportValueListLazy", false);

			// Act
			When.onTheApplicationPage.iPressTheFunctionImportValueHelpBindButton("functionImportValueListLazyBind");

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("FunctionImportValueListLazy", "Name Function Import Value Lazy");
			Then.onTheApplicationPage.iShouldSeeSmartFieldInMode("FunctionImportValueListLazy", "edit");
			Then.onTheApplicationPage.iShouldSeeValueHelpFilterWithLabel("idView--FunctionImportValueListLazy-input", "Function Import Key Lazy");
			Then.onTheApplicationPage.iShouldSeeValueHelpFilterWithLabel("idView--FunctionImportValueListLazy-input", "Function Import Desc Lazy");
			Then.onTheApplicationPage.iShouldSeeSmartMandatory("FunctionImportValueListLazy");
			Then.onTheApplicationPage.iShouldSeeTheFormatedText("requestedFILazy", "testService/$metadata?sap-value-list=EmployeesNamespace.EmployeesNamespace_Entities/MyFunctionImportLazy/FunctionImportValueListLazy");

			// Cleanup
			When.onTheApplicationPage.iResetTheODataModel();
		});

		opaTest("context precedence over EntitySet", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheApplicationPage.iPressTheFunctionImportValueHelpBindButton("functionImportBind");

			// Assert
			When.waitFor({
				id: "FunctionImportPrecedence",
				success: function (oControl) {
					Opa5.assert.ok(oControl.getFirstInnerControl().isA("sap.m.Input"), "Non-fixed list control expected");
				}
			});
		});

		QUnit.module("BCP: 2370108763");

		opaTest("null value + Common.Text should not be rendered", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Assert
			Then.onTheApplicationPage.iShouldSeeEmptySmartField("FieldNull2");
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("FieldNull1", "1 (0001)");

			// Act
			When.onTheApplicationPage.iSwitchFieldNullToEdit();
			When.onTheApplicationPage.iChangeTheValueTo("idView--FieldNull1", "");
			When.onTheApplicationPage.iSwitchFieldNullToDisplay();

			// Assert
			Then.onTheApplicationPage.iShouldSeeEmptySmartField("FieldNull2");
		});

		QUnit.module("BCP: 2380134089");

		opaTest("Selected value is not taken over", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheApplicationPage.iSelectAnItemFromValueHelp("idView--field6-input", 0);

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("field6", "1");
		});

		QUnit.module("ValueHelp Suggestion items");

		opaTest("The field should have only one listener attached for suggestionItemSelected", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheApplicationPage.iSetShowValueHelp();

			// Assert
			Then.onTheApplicationPage.iShouldSeeListenersCountForField("field7", "suggestionItemSelected", 1);
		});

		QUnit.module("BCP: CS20240007116211");

		opaTest("Update to the correct binding context with async currency and binding context change", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.waitFor({
				id: "PriceSmartForm",
				visible: false,
				success: function (oControl) {
					var aFields = oControl.getSmartFields(),
						oSF = aFields[0],
						oAmountInputFieldFocusDomRef = oSF.getFirstInnerControl().getFocusDomRef();

					oAmountInputFieldFocusDomRef.focus();
					QUnitUtils.triggerCharacterInput(oAmountInputFieldFocusDomRef, "3", "3");
					oAmountInputFieldFocusDomRef.blur();
					oSF.getFirstInnerControl().fireChange();

					// We change the binding context of the updated field before it's value is applied to the model
					oSF.setBindingContext(aFields[2].getBindingContext());
				}
			});

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("Price2", "3");
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("Price3", "2");
			Then.onTheApplicationPage.iShouldSeePendingChangeForField("Employees('0001')", "Price", "3");
		});

		QUnit.module("SNOW: DINC0164426");

		opaTest("Value help dialog has data despite sap:text for not defined navigation", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheApplicationPage.iSelectAnItemFromValueHelp("idView--FieldExpand-input", 0);

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("FieldExpand", "1");
		});

		opaTest("LAST-The purpose of this test is to Cleanup after all the tests", function (Given) {
			Opa5.assert.ok(true); // We need one assertion

			// Cleanup
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.start();
	});
});
