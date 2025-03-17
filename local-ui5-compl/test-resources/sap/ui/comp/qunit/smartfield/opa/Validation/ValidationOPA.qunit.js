/* global QUnit */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/core/library",
	"test-resources/sap/ui/comp/testutils/opa/TestLibrary"
], function (
	Opa5,
	opaTest,
	CoreLibrary
) {
	"use strict";

	var ValueState = CoreLibrary.ValueState;
	var fnGetTextArrangementUrl = function (sTextArrangement) {
		return "test-resources/sap/ui/comp/qunit/smartfield/opa/Validation/applicationUnderTest/Validation.html";
	};

	Opa5.extendConfig({
		testLibs: {
			compTestLibrary: {}
		},
		viewName: "MyView",
		viewNamespace: "",
		autoWait: true,
		async: true,
		timeout: 60
	});

	sap.ui.require([
		"sap/ui/comp/qunit/smartfield/opa/Validation/applicationUnderTest/test/pages/Application"
	], function() {

		opaTest("Initial load", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning(fnGetTextArrangementUrl());

			// Assert
			Then.onTheApplicationPage.iShouldSeeNoPendingChanges();
		});

		QUnit.module("Non-mandatory ComboBox");

		opaTest("TextInEditModeSource=None", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning(fnGetTextArrangementUrl());

			// Act - invalid user input
			When.onTheApplicationPage.iChangeTheValueTo("Field1", "Invalid user input");

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("Field1", "Invalid user input");
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithState("Field1", ValueState.None);
			Then.onTheApplicationPage.iShouldSeePendingChangeForField("Field1", "Invalid user input");
			Then.onTheApplicationPage.iShouldSeeNoMessageManagerButton();

			// Act - invalid model data
			When.onTheApplicationPage.iResetTheODataModel();
			When.onTheApplicationPage.iBindInvalidData();

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("Field1", "Invalid model update");
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithState("Field1", ValueState.None);
			Then.onTheApplicationPage.iShouldSeeNoPendingChanges();
			Then.onTheApplicationPage.iShouldSeeNoMessageManagerButton();

			// Act - valid user input
			When.onTheApplicationPage.iSelectSmartFieldItemByKey("Field1", "2");
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithRealValue("Field1", "2 (John Doe 2)");
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithState("Field1", ValueState.None);
			Then.onTheApplicationPage.iShouldSeePendingChangeForField("Field1", "2");
			Then.onTheApplicationPage.iShouldSeeNoMessageManagerButton();

			// Act
			When.onTheApplicationPage.iResetTheODataModel();

			// Act - user input exceeding max length constraint
			When.onTheApplicationPage.iChangeTheValueTo("Field1", "Long and invalid user input > 20 characters");

			// Assert
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithState("Field1", ValueState.Error);
			Then.onTheApplicationPage.iShouldSeeNoPendingChanges();

			// Act
			When.onTheApplicationPage.iOpenTheMessagePopover();
			When.onTheApplicationPage.iNavigateBack();

			// Assert
			Then.onTheApplicationPage.iShouldSeeMessage(ValueState.Error, "None");

			// Act - user input empty value
			When.onTheApplicationPage.iChangeTheValueTo("Field1", "");

			// Assert
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithState("Field1", ValueState.None);

			// Cleanup
			When.onTheApplicationPage.iResetTheODataModel();
		});

		opaTest("TextInEditModeSource=ValueListNoValidation", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning(fnGetTextArrangementUrl());

			// Act - invalid user input
			When.onTheApplicationPage.iChangeTheValueTo("Field2", "Invalid user input");

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("Field2", "Invalid user input");
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithState("Field2", ValueState.None);
			Then.onTheApplicationPage.iShouldSeePendingChangeForField("Field2", "Invalid user input");
			Then.onTheApplicationPage.iShouldSeeNoMessageManagerButton();

			// Act - invalid model data
			When.onTheApplicationPage.iResetTheODataModel();
			When.onTheApplicationPage.iBindInvalidData();

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("Field2", "Invalid model update");
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithState("Field2", ValueState.None);
			Then.onTheApplicationPage.iShouldSeeNoPendingChanges();
			Then.onTheApplicationPage.iShouldSeeNoMessageManagerButton();

			// Act - valid user input
			When.onTheApplicationPage.iSelectSmartFieldItemByKey("Field2", "2");
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithRealValue("Field2", "2 (John Doe 2)");
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithState("Field2", ValueState.None);
			Then.onTheApplicationPage.iShouldSeePendingChangeForField("Field2", "2");
			Then.onTheApplicationPage.iShouldSeeNoMessageManagerButton();

			// Act
			When.onTheApplicationPage.iResetTheODataModel();

			// Act - user input exceeding max length constraint
			When.onTheApplicationPage.iChangeTheValueTo("Field2", "Long and invalid user input > 20 characters");

			// Assert
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithState("Field2", ValueState.Error);
			Then.onTheApplicationPage.iShouldSeeNoPendingChanges();

			// Act
			When.onTheApplicationPage.iOpenTheMessagePopover();
			When.onTheApplicationPage.iNavigateBack();

			// Assert
			Then.onTheApplicationPage.iShouldSeeMessage(ValueState.Error, "ValueListNoValidation");

			// Act - user input empty value
			When.onTheApplicationPage.iChangeTheValueTo("Field2", "");

			// Assert
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithState("Field2", ValueState.None);

			// Cleanup
			When.onTheApplicationPage.iResetTheODataModel();
		});

		opaTest("TextInEditModeSource=ValueListWarning", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning(fnGetTextArrangementUrl());

			// Act - invalid user input
			When.onTheApplicationPage.iChangeTheValueTo("Field3", "Invalid user input");

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("Field3", "Invalid user input");
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithState("Field3", ValueState.Warning);
			Then.onTheApplicationPage.iShouldSeePendingChangeForField("Field3", "Invalid user input");

			// Act
			When.onTheApplicationPage.iOpenTheMessagePopover();
			When.onTheApplicationPage.iNavigateBack();

			// Assert
			Then.onTheApplicationPage.iShouldSeeMessage(ValueState.Warning, "ValueListWarning");

			// Act - invalid model data
			When.onTheApplicationPage.iResetTheODataModel();
			When.onTheApplicationPage.iBindInvalidData();

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("Field3", "Invalid model update");
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithState("Field3", ValueState.None);
			Then.onTheApplicationPage.iShouldSeeNoPendingChanges();
			Then.onTheApplicationPage.iShouldSeeNoMessageManagerButton();

			// Act - valid user input
			When.onTheApplicationPage.iSelectSmartFieldItemByKey("Field3", "2");
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithRealValue("Field3", "2 (John Doe 2)");
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithState("Field3", ValueState.None);
			Then.onTheApplicationPage.iShouldSeePendingChangeForField("Field3", "2");
			Then.onTheApplicationPage.iShouldSeeNoMessageManagerButton();

			// Act
			When.onTheApplicationPage.iResetTheODataModel();

			// Act - user input exceeding max length constraint
			When.onTheApplicationPage.iChangeTheValueTo("Field3", "Long and invalid user input > 20 characters");

			// Assert
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithState("Field3", ValueState.Error);
			Then.onTheApplicationPage.iShouldSeeNoPendingChanges();

			// Act
			When.onTheApplicationPage.iOpenTheMessagePopover();
			When.onTheApplicationPage.iNavigateBack();

			// Assert
			Then.onTheApplicationPage.iShouldSeeMessage(ValueState.Error, "ValueListWarning");

			// Act - user input empty value
			When.onTheApplicationPage.iChangeTheValueTo("Field3", "");

			// Assert
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithState("Field3", ValueState.None);

			// Cleanup
			When.onTheApplicationPage.iResetTheODataModel();
		});

		opaTest("TextInEditModeSource=ValueList", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning(fnGetTextArrangementUrl());

			// Act - invalid user input
			When.onTheApplicationPage.iChangeTheValueTo("Field4", "Invalid user input");

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("Field4", "Invalid user input");
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithState("Field4", ValueState.Error);
			Then.onTheApplicationPage.iShouldSeeNoPendingChanges();

			// Act
			When.onTheApplicationPage.iOpenTheMessagePopover();
			When.onTheApplicationPage.iNavigateBack();

			// Assert
			Then.onTheApplicationPage.iShouldSeeMessage(ValueState.Error, "ValueList");

			// Act - invalid model data
			When.onTheApplicationPage.iResetTheODataModel();
			When.onTheApplicationPage.iBindInvalidData();

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("Field4", "Invalid model update");
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithState("Field4", ValueState.None);
			Then.onTheApplicationPage.iShouldSeeNoPendingChanges();
			Then.onTheApplicationPage.iShouldSeeNoMessageManagerButton();

			// Act - valid user input
			When.onTheApplicationPage.iSelectSmartFieldItemByKey("Field4", "2");
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithRealValue("Field4", "2 (John Doe 2)");
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithState("Field4", ValueState.None);
			Then.onTheApplicationPage.iShouldSeePendingChangeForField("Field4", "2");
			Then.onTheApplicationPage.iShouldSeeNoMessageManagerButton();

			// Act
			When.onTheApplicationPage.iResetTheODataModel();

			// Act - user input exceeding max length constraint
			When.onTheApplicationPage.iChangeTheValueTo("Field4", "Long and invalid user input > 20 characters");

			// Assert
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithState("Field4", ValueState.Error);
			Then.onTheApplicationPage.iShouldSeeNoPendingChanges();

			// Act
			When.onTheApplicationPage.iOpenTheMessagePopover();
			When.onTheApplicationPage.iNavigateBack();

			// Assert
			Then.onTheApplicationPage.iShouldSeeMessage(ValueState.Error, "ValueList");

			// Act - user input empty value
			When.onTheApplicationPage.iChangeTheValueTo("Field4", "");

			// Assert
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithState("Field4", ValueState.None);

			// Cleanup
			When.onTheApplicationPage.iResetTheODataModel();
		});

		opaTest("fixedValueListValidationEnabled && TextInEditModeSource=ValueList", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning(fnGetTextArrangementUrl());

			// Act - invalid user input
			When.onTheApplicationPage.iChangeTheValueTo("Field5", "Invalid user input");

			// Assert
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithRealValue("Field5", "Invalid user input");
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithState("Field5", ValueState.None);
			Then.onTheApplicationPage.iShouldSeeNoPendingChanges();
			Then.onTheApplicationPage.iShouldSeeNoMessageManagerButton();

			// Act - invalid model data
			When.onTheApplicationPage.iResetTheODataModel();
			When.onTheApplicationPage.iBindInvalidData();

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("Field5", "Invalid model update");
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithState("Field5", ValueState.None);
			Then.onTheApplicationPage.iShouldSeeNoPendingChanges();
			Then.onTheApplicationPage.iShouldSeeNoMessageManagerButton();

			// Act - valid user input
			When.onTheApplicationPage.iSelectSmartFieldItemByKey("Field5", "2");
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithRealValue("Field5", "2 (John Doe 2)");
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithState("Field5", ValueState.None);
			Then.onTheApplicationPage.iShouldSeePendingChangeForField("Field5", "2");
			Then.onTheApplicationPage.iShouldSeeNoMessageManagerButton();

			// Act - user input exceeding max length constraint
			When.onTheApplicationPage.iChangeTheValueTo("Field5", "Long and invalid user input > 20 characters");

			// Assert
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithState("Field5", ValueState.None);
			Then.onTheApplicationPage.iShouldSeePendingChangeForField("Field5", null);
			Then.onTheApplicationPage.iShouldSeeNoMessageManagerButton();

			// Act - user input empty value
			When.onTheApplicationPage.iChangeTheValueTo("Field5", "");

			// Assert
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithState("Field5", ValueState.None);
			Then.onTheApplicationPage.iShouldSeePendingChangeForField("Field5", null);

			// Cleanup
			When.onTheApplicationPage.iResetTheODataModel();
		});

		QUnit.module("Display to edit mode switch");

		opaTest("TextInEditModeSource=ValueListWarning is working", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning(fnGetTextArrangementUrl());

			// Act - invalid user input
			When.onTheApplicationPage.iChangeTheFormEditMode("smartForm3", true);
			When.onTheApplicationPage.iChangeTheValueTo("DisplayField3", "Invalid user input");

			// Assert
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithState("DisplayField3", ValueState.Warning);
			Then.onTheApplicationPage.iShouldSeePendingChangeForField("Field3", "Invalid user input");

			// Act
			When.onTheApplicationPage.iOpenTheMessagePopover();
			When.onTheApplicationPage.iNavigateBack();

			// Assert
			Then.onTheApplicationPage.iShouldSeeMessage(ValueState.Warning, "ValueListWarning");

			// Cleanup
			When.onTheApplicationPage.iResetTheODataModel();
		});

		opaTest("TextInEditModeSource=ValueList is working", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning(fnGetTextArrangementUrl());

			// Act - invalid user input
			When.onTheApplicationPage.iChangeTheFormEditMode("smartForm3", true);
			When.onTheApplicationPage.iChangeTheValueTo("DisplayField4", "Invalid user input");

			// Assert
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithState("DisplayField4", ValueState.Error);
			Then.onTheApplicationPage.iShouldSeeNoPendingChanges();

			// Act
			When.onTheApplicationPage.iOpenTheMessagePopover();
			When.onTheApplicationPage.iNavigateBack();

			// Assert
			Then.onTheApplicationPage.iShouldSeeMessage(ValueState.Error, "ValueList");

			// Cleanup
			When.onTheApplicationPage.iResetTheODataModel();
		});

		QUnit.module("Changing textInEditModeSource at runtime");

		opaTest("TextInEditModeSource=ValueListWarning is working", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning(fnGetTextArrangementUrl());

			// Act
			When.onTheApplicationPage.iSwitchTheTIEMSTo("ValueListWarning");

			// Assert
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithRealValue("DelayField21", "American Airlines Inc.");

			// Act
			When.onTheApplicationPage.iChangeTheValueTo("DelayField21", "Invalid user input");

			// Assert
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithState("DelayField21", ValueState.Warning);
			Then.onTheApplicationPage.iShouldSeePendingChangeForField("Field21", "Invalid user input");

			// Cleanup
			When.onTheApplicationPage.iResetTheODataModel();
		});

		opaTest("TextInEditModeSource=ValueList is working", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning(fnGetTextArrangementUrl());

			// Act
			When.onTheApplicationPage.iSwitchTheTIEMSTo("ValueList");

			// Assert
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithRealValue("DelayField21", "American Airlines Inc.");

			// Act
			When.onTheApplicationPage.iChangeTheValueTo("DelayField21", "Invalid user input");

			// Assert
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithState("DelayField21", ValueState.Error);
			Then.onTheApplicationPage.iShouldSeeNoPendingChanges();

			// Cleanup
			When.onTheApplicationPage.iResetTheODataModel();
		});

		QUnit.module("Validation only");

		opaTest("TextInEditModeSource=ValueListWarning is working", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning(fnGetTextArrangementUrl());

			// Act
			When.onTheApplicationPage.iChangeTheValueTo("ValidationField1", "Invalid user input");

			// Assert
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithRealValue("ValidationField1", "Invalid user input");
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithState("ValidationField1", ValueState.Warning);
			Then.onTheApplicationPage.iShouldSeePendingChangeForField("Field22", "Invalid user input");

			// Act
			When.onTheApplicationPage.iChangeTheValueTo("ValidationField1", "AA");

			// Assert
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithRealValue("ValidationField1", "AA");
			Then.onTheApplicationPage.iShouldSeePendingChangeForField("Field22", "AA");
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithState("ValidationField1", ValueState.None);

			// Cleanup
			When.onTheApplicationPage.iResetTheODataModel();
		});

		opaTest("TextInEditModeSource=ValueList is working", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning(fnGetTextArrangementUrl());

			// Act
			When.onTheApplicationPage.iChangeTheValueTo("ValidationField2", "Invalid user input");

			// Assert
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithRealValue("ValidationField2", "Invalid user input");
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithState("ValidationField2", ValueState.Error);
			Then.onTheApplicationPage.iShouldSeeNoPendingChanges();

			// Act
			When.onTheApplicationPage.iChangeTheValueTo("ValidationField2", "AA");

			// Assert
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithRealValue("ValidationField2", "AA");
			Then.onTheApplicationPage.iShouldSeePendingChangeForField("Field23", "AA");
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithState("ValidationField2", ValueState.None);

			// Cleanup
			When.onTheApplicationPage.iResetTheODataModel();
		});

		opaTest("TextInEditModeSource=ValueListNoValidation is not throwing exception BCP: 2270163301", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning(fnGetTextArrangementUrl());

			// Note: if exception is thrown the whole test fails as it counts as
			// second assertion.
			Opa5.assert.expect(1);

			When.waitFor({
				id: "NonValidationField1",
				success: function (oControl) {
					// Arrange
					var fnDone = Opa5.assert.async();

					oControl.attachEventOnce("changeModelValue", function () {
						// Assert
						Opa5.assert.ok(true, "Test expects only one assertion");
						fnDone();
					});
				}
			});

			When.onTheApplicationPage.iChangeTheValueTo("NonValidationField1", "1");

			// Cleanup
			When.onTheApplicationPage.iResetTheODataModel();
		});

		QUnit.start();
	});
});
