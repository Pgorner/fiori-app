/* global QUnit, opaSkip */
sap.ui.define([
	"sap/ui/core/Lib",
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/test/actions/Press",
	"sap/ui/test/actions/EnterText",
	"sap/ui/core/library",
	"sap/m/library",
	"test-resources/sap/ui/comp/testutils/opa/TestLibrary"
], function(
	Library,
	Opa5,
	opaTest,
	Press,
	EnterText,
	coreLibrary,
	mobileLibrary
) {
	"use strict";

	// shortcut for sap.ui.core.ValueState
	var ValueState = coreLibrary.ValueState;

	var oRB = Opa5.getWindow().sap.ui.require("sap/ui/test/OpaPlugin")?.getLibraryResourceBundle("sap.ui.comp"),
		oResourceBundle = Library.getResourceBundleFor("sap.m"),
		ButtonType = mobileLibrary.ButtonType;

	Opa5.extendConfig({
		viewName: "SmartFilterBar",
		viewNamespace: "sap.ui.comp.sample.smartfilterbar_types",
		autoWait: true,
		enabled: false,
		async: true,
		logLevel: "ERROR",
		testLibs: {
			compTestLibrary: {
				appUrl: "test-resources/sap/ui/comp/qunit/smartfilterbar/opaTests/FieldTypes/applicationUnderTest/SmartFilterBar_Types.html"
			}
		}
	});

	sap.ui.require([
		"sap/ui/comp/qunit/smartfilterbar/opaTests/FieldTypes/pages/SmartFilterBarTypes"
	], function () {

		QUnit.module("Time fields");

		opaTest("Single", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act - Set time
			When.onTheSmartFilterBarTypesPage.waitFor({
				id: "smartFilterBar-filterItemControlTime.Group-TIME_SINGLE",
				success: function (oInput) {
					oInput.setValue("12:34 PM");
				}
			});
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("TIME_SINGLE eq time'PT12H34M00S'");

			// Act - Open the VH
			When.onTheSmartFilterBarTypesPage.waitFor({
				id: "smartFilterBar-filterItemControlTime.Group-TIME_SINGLE-icon",
				controlType: "sap.ui.core.Icon",
				actions: new Press()
			});

			// Assert - check for the new TimePickerClocks
			// When.onTheSmartFilterBarTypesPage.waitFor({
			// 	id: "smartFilterBar-filterItemControlTime.Group-TIME_SINGLE-clocks",
			// 	controlType: "sap.m.TimePickerClocks",
			// 	success: function(oControl) {
			// 		Opa5.assert.ok(oControl, "TimePickerClocks is now correctly rendered");
			// 	}
			// });

			// Act - click on the ok button
			When.onTheSmartFilterBarTypesPage.iPressTheVHDOKButton();

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
		});

		opaTest("Multiple", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheSmartFilterBarTypesPage.iOpenTheVHD("smartFilterBar-filterItemControlTime.Group-TIME_MULTIPLE");

			// Act - Press the + button 1 time to add one row
			When.onTheSmartFilterBarTypesPage.waitFor({
				controlType: "sap.m.Button",
				searchOpenDialogs: true,
				actions: new Press(),
				matchers: function (oControl) {
					return oControl.hasStyleClass("conditionAddBtnFloatRight");
				}
			});

			// Act - Select/Enter times
			When.onTheSmartFilterBarTypesPage.waitFor({
				controlType: "sap.m.TimePicker",
				searchOpenDialogs: true,
				success: function (aTimePickers) {
					var oText = new EnterText();

					// Populate both TimePicker fields: note using short 1 and 2 due to TimePicker specifics involving
					// MaskInput control
					oText.setText("1");
					oText.executeOn(aTimePickers[0]); // Should be 01:00 AM

					oText.setText("2");
					oText.executeOn(aTimePickers[1]); // Should be 02:00 AM

					// Cleanup
					oText.destroy();
				}
			});

			// Act - press the dialog ok button
			When.onTheSmartFilterBarTypesPage.iPressTheVHDOKButton();

			// Act - Create filters
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("TIME_MULTIPLE eq time'PT01H00M00S' or TIME_MULTIPLE eq time'PT02H00M00S'");

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
		});

		opaTest("Interval", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheSmartFilterBarTypesPage.iOpenTheVHD("smartFilterBar-filterItemControlTime.Group-TIME_INTERVAL");

			// Act - Select/Enter times
			When.onTheSmartFilterBarTypesPage.waitFor({
				controlType: "sap.m.TimePicker",
				searchOpenDialogs: true,
				success: function (aTimePickers) {
					var oText = new EnterText();

					// Populate both TimePicker fields: note using short 1 and 2 due to TimePicker specifics involving
					// MaskInput control
					oText.setText("1");
					oText.executeOn(aTimePickers[0]); // Should be 01:00 AM

					oText.setText("2");
					oText.executeOn(aTimePickers[1]); // Should be 02:00 AM

					// Cleanup
					oText.destroy();
				}
			});

			// Act - press the dialog ok button
			When.onTheSmartFilterBarTypesPage.iPressTheVHDOKButton();

			// Act - Create filters
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("(TIME_INTERVAL ge time'PT01H00M00S' and TIME_INTERVAL le time'PT02H00M00S')");

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
		});

		opaTest("Interval validation for numeric fields", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheSmartFilterBarTypesPage.iOpenTheVHD("smartFilterBar-filterItemControlA_-NUMC_INTERVAL");

			// Act - Select/Enter times
			When.onTheSmartFilterBarTypesPage.waitFor({
				controlType: "sap.m.Input",
				searchOpenDialogs: true,
				success: function (aInputs) {
					var oText = new EnterText({
						pressEnterKey: true
					});

					oText.setText("3");
					oText.executeOn(aInputs[0]);

					oText.setText("2");
					oText.executeOn(aInputs[1]); // 'To' field should be lower than 'From'

					Opa5.assert.strictEqual(aInputs[1].getValueState(), ValueState.Warning, "'To' field should be in Warning state");

					oText.setText("1");
					oText.executeOn(aInputs[0]);

					Opa5.assert.strictEqual(aInputs[1].getValueState(), ValueState.None, "When setting the 'From' field to a valid range, " +
						"'To' field should be in None ValueState");

					oText.setText("3");
					oText.executeOn(aInputs[0]);

					Opa5.assert.strictEqual(aInputs[0].getValueState(), ValueState.Warning, "'From' field should be in Warning state");

					// Cleanup
					oText.destroy();
				}
			});

			// Act - press the dialog ok button
			When.onTheSmartFilterBarTypesPage.iPressTheVHDOKButton();

			// Act - press the dialog ok button
			When.onTheSmartFilterBarTypesPage.waitFor({
				controlType: "sap.m.Button",
				matchers: function (oControl) {
					return oControl.getText() === oRB.getText("VALUEHELPDLG_OK") && oControl.sId.includes("__mbox-btn-");
				},
				actions: new Press(),
				searchOpenDialogs: true
			});

			//Assert that condition is not applied to the Numc Interval input
			Then.onTheSmartFilterBarTypesPage.waitFor({
				id: "smartFilterBar-filterItemControlA_-NUMC_INTERVAL",
				controlType: "sap.m.Input",
				success: function (oInput) {
					Opa5.assert.strictEqual(oInput.getValue(), "", "Range is not created when the interval is wrong");
				}
			});

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
		});

		QUnit.module("Decimal fields");

		opaTest("Interval validation for decimal fields", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheSmartFilterBarTypesPage.iOpenTheVHD("smartFilterBar-filterItemControlA_-DECIMAL_INTERVAL");

			// Act - Select/Enter times
			When.onTheSmartFilterBarTypesPage.waitFor({
				controlType: "sap.m.Input",
				searchOpenDialogs: true,
				success: function (aInputs) {
					var oText = new EnterText({
						pressEnterKey: true
					});

					oText.setText("200");
					oText.executeOn(aInputs[0]);

					oText.setText("1000");
					oText.executeOn(aInputs[1]);

					Opa5.assert.strictEqual(aInputs[0].getValueState(), ValueState.None, "No Warnig state should be shown on 'From' field");
					Opa5.assert.strictEqual(aInputs[1].getValueState(), ValueState.None, "No Warnig state should be shown on 'To' field");

					oText.setText("1,000.00");
					oText.executeOn(aInputs[1]);

					Opa5.assert.strictEqual(aInputs[0].getValueState(), ValueState.None, "No Warnig state should be shown on 'From' field");
					Opa5.assert.strictEqual(aInputs[1].getValueState(), ValueState.None, "No Warnig state should be shown on 'To' field");

					// Cleanup
					oText.destroy();
				}
			});

			// Act - press the dialog ok button
			When.onTheSmartFilterBarTypesPage.iPressTheVHDCancelButton();

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
		});

		QUnit.module("Fiscal fields");

		opaTest("Interval validation for Fiscal fields", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheSmartFilterBarTypesPage.iOpenTheVHD("smartFilterBar-filterItemControlA_-FISCAL_YEAR_PERIOD");
			When.onTheSmartFilterBarTypesPage.iSelectOperation("BT");

			// Act - Select/Enter times
			When.onTheSmartFilterBarTypesPage.waitFor({
				controlType: "sap.m.Input",
				searchOpenDialogs: true,
				success: function (aInputs) {
					var oText = new EnterText({
						pressEnterKey: true
					});

					oText.setText("001/2021");
					oText.executeOn(aInputs[0]);

					oText.setText("001/2020");
					oText.executeOn(aInputs[1]); // 'To' field should be lower than 'From'

					Opa5.assert.strictEqual(aInputs[1].getValueState(), ValueState.Warning, "'To' field should be in Warning state");

					oText.setText("001/2019");
					oText.executeOn(aInputs[0]);

					Opa5.assert.strictEqual(aInputs[1].getValueState(), ValueState.None, "When setting the 'From' field to a valid range, " +
						"'To' field should be in None ValueState");

					oText.setText("002/2020");
					oText.executeOn(aInputs[0]);

					Opa5.assert.strictEqual(aInputs[0].getValueState(), ValueState.Warning, "'From' field should be in Warning state");

					// Cleanup
					oText.destroy();
				}
			});

			// Act - press the dialog ok button
			When.onTheSmartFilterBarTypesPage.iPressTheVHDOKButton();

			// Act - press the dialog ok button
			When.onTheSmartFilterBarTypesPage.waitFor({
				controlType: "sap.m.Button",
				matchers: function (oControl) {
					return oControl.getText() === oRB.getText("VALUEHELPDLG_OK") && oControl.sId.includes("__mbox-btn-");
				},
				actions: new Press(),
				searchOpenDialogs: true
			});

			//Assert that condition is not applied to the Numc Interval input
			Then.onTheSmartFilterBarTypesPage.waitFor({
				id: "smartFilterBar-filterItemControlA_-FISCAL_YEAR_PERIOD",
				controlType: "sap.m.Input",
				success: function (oInput) {
					Opa5.assert.strictEqual(oInput.getValue(), "", "Range is not created when the interval is wrong");
				}
			});

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
		});

		opaSkip("Interval validation for Fiscal period fields with display format NonNegative", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheSmartFilterBarTypesPage.iOpenTheVHD("smartFilterBar-filterItemControlA_-FISCAL_PERIOD_NUMC");

			// Assert
			Then.onTheSmartFilterBarTypesPage.thereIsNoEmptyOperation("FISCAL_PERIOD_NUMC");
			Then.onTheSmartFilterBarTypesPage.thereIsOperation("FISCAL_PERIOD_NUMC", "LT", oResourceBundle.getText("CONDITIONPANEL_OPTION_DATE_LT"));
			Then.onTheSmartFilterBarTypesPage.thereIsOperation("FISCAL_PERIOD_NUMC", "NotLT", oResourceBundle.getText("CONDITIONPANEL_OPTION_DATE_NotLT"));

			When.onTheSmartFilterBarTypesPage.iSelectOperation("EQ");

			// Act - Select/Enter times
			When.onTheSmartFilterBarTypesPage.waitFor({
				controlType: "sap.m.Input",
				searchOpenDialogs: true,
				success: function (aInputs) {
					var oText = new EnterText({
						pressEnterKey: true
					});

					oText.setText("0");
					oText.executeOn(aInputs[0]);

					Opa5.assert.strictEqual(aInputs[0].getValueState(), ValueState.None, "'Value' field should be in None state");

					// Cleanup
					oText.destroy();
				}
			});

			// Act - press the dialog ok button
			When.onTheSmartFilterBarTypesPage.iPressTheVHDOKButton();

			//Assert that condition is not applied to the Numc Interval input
			Then.onTheSmartFilterBarTypesPage.waitFor({
				id: "smartFilterBar-filterItemControlA_-FISCAL_PERIOD_NUMC",
				controlType: "sap.m.Input",
				success: function (oInput) {
					Opa5.assert.strictEqual(oInput.getTokens()[0].getText(), "=0", "The token should be with value =0");
				}
			});

			When.onTheSmartFilterBarTypesPage.iOpenTheVHD("smartFilterBar-filterItemControlA_-FISCAL_PERIOD_NUMC");
			When.onTheSmartFilterBarTypesPage.iSelectOperation("BT");

			// Act - Select/Enter times
			When.onTheSmartFilterBarTypesPage.waitFor({
				controlType: "sap.m.Input",
				searchOpenDialogs: true,
				success: function (aInputs) {
					var oText = new EnterText({
						pressEnterKey: true
					});

					oText.setText("0");
					oText.executeOn(aInputs[0]);
					oText.setText("1");
					oText.executeOn(aInputs[1]);

					Opa5.assert.strictEqual(aInputs[0].getValueState(), ValueState.None, "'Value' field should be in None state");
					Opa5.assert.strictEqual(aInputs[1].getValueState(), ValueState.None, "'Value' field should be in None state");

					// Cleanup
					oText.destroy();
				}
			});

			// Act - press the dialog ok button
			When.onTheSmartFilterBarTypesPage.iPressTheVHDOKButton();

			//Assert that condition is not applied to the Numc Interval input
			Then.onTheSmartFilterBarTypesPage.waitFor({
				id: "smartFilterBar-filterItemControlA_-FISCAL_PERIOD_NUMC",
				controlType: "sap.m.Input",
				success: function (oInput) {
					Opa5.assert.strictEqual(oInput.getTokens()[0].getText(), "0...1", "The token should be with value =0");
				}
			});

			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("(FISCAL_PERIOD_NUMC ge '000' and FISCAL_PERIOD_NUMC le '001')"
			);

			When.onTheSmartFilterBarTypesPage.iOpenTheVHD("smartFilterBar-filterItemControlA_-FISCAL_PERIOD_NUMC");
			When.onTheSmartFilterBarTypesPage.iSelectOperation("NotLE");

			// Act - Select/Enter times
			When.onTheSmartFilterBarTypesPage.waitFor({
				controlType: "sap.m.Input",
				searchOpenDialogs: true,
				success: function (aInputs) {
					var oText = new EnterText({
						pressEnterKey: true
					});

					oText.setText("0");
					oText.executeOn(aInputs[0]);

					Opa5.assert.strictEqual(aInputs[0].getValueState(), ValueState.None, "'Value' field should be in None state");

					// Cleanup
					oText.destroy();
				}
			});

			// Act - press the dialog ok button
			When.onTheSmartFilterBarTypesPage.iPressTheVHDOKButton();

			//Assert that condition is not applied to the Numc Interval input
			Then.onTheSmartFilterBarTypesPage.waitFor({
				id: "smartFilterBar-filterItemControlA_-FISCAL_PERIOD_NUMC",
				controlType: "sap.m.Input",
				success: function (oInput) {
					Opa5.assert.strictEqual(oInput.getTokens()[0].getText(), "!(<=0)", "The token should be with value !(<=0)");
				}
			});

			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("FISCAL_PERIOD_NUMC gt '000'"
			);

			When.onTheSmartFilterBarTypesPage.iOpenTheVHD("smartFilterBar-filterItemControlA_-FISCAL_PERIOD_NUMC");
			When.onTheSmartFilterBarTypesPage.iSelectOperation("GT");

			// Act - Select/Enter times
			When.onTheSmartFilterBarTypesPage.waitFor({
				controlType: "sap.m.Input",
				searchOpenDialogs: true,
				success: function (aInputs) {
					var oText = new EnterText({
						pressEnterKey: true
					});

					oText.setText("0");
					oText.executeOn(aInputs[0]);

					Opa5.assert.strictEqual(aInputs[0].getValueState(), ValueState.None, "'Value' field should be in None state");

					// Cleanup
					oText.destroy();
				}
			});

			// Act - press the dialog ok button
			When.onTheSmartFilterBarTypesPage.iPressTheVHDOKButton();

			//Assert that condition is not applied to the Numc Interval input
			Then.onTheSmartFilterBarTypesPage.waitFor({
				id: "smartFilterBar-filterItemControlA_-FISCAL_PERIOD_NUMC",
				controlType: "sap.m.Input",
				success: function (oInput) {
					Opa5.assert.strictEqual(oInput.getTokens()[0].getText(), ">0", "The token should be with value >0");
				}
			});

			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("FISCAL_PERIOD_NUMC gt '000'"
			);

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
		});

		opaSkip("Interval validation for Fiscal year fields with display format NonNegative", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheSmartFilterBarTypesPage.iOpenTheVHD("smartFilterBar-filterItemControlA_-FISCAL_YEAR_PERIOD_NUMC");

			// Assert
			Then.onTheSmartFilterBarTypesPage.thereIsNoEmptyOperation("FISCAL_YEAR_PERIOD_NUMC");
			Then.onTheSmartFilterBarTypesPage.thereIsOperation("FISCAL_YEAR_PERIOD_NUMC", "LT", oResourceBundle.getText("CONDITIONPANEL_OPTION_DATE_LT"));
			Then.onTheSmartFilterBarTypesPage.thereIsOperation("FISCAL_YEAR_PERIOD_NUMC", "NotLT", oResourceBundle.getText("CONDITIONPANEL_OPTION_DATE_NotLT"));

			// Act - press the dialog ok button
			When.onTheSmartFilterBarTypesPage.iPressTheVHDOKButton();

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
		});

		opaTest("The fiscal field should not be in error state and isDigitSequence annotion should be ignored", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlA_-FISCAL_YEAR_PERIOD_NUMC", "2021122");

			// Assert
			Then.onTheSmartFilterBarTypesPage.waitFor({
				id: "smartFilterBar-filterItemControlA_-FISCAL_YEAR_PERIOD_NUMC",
				success: function (oInput) {
					Opa5.assert.strictEqual(oInput.getValueState(), ValueState.None,
						"FiscalYearPeriodNumc should value state should not be error");
				}
			});

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
		});

		QUnit.module("Strings");

		opaTest("Single", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act - enter a valid date directly in the input
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_SINGLE", "2");

			// Act - Create filters
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("STRING_SINGLE eq '2'");

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
		});

		opaTest("STRING_SINGLE restore the valueState on AdaptFilters cancel", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act - Enter a invalid value in the input
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_SINGLE", "abc");

			// Act - Open AdaptFiltersDialog
			When.onTheSmartFilterBarTypesPage.iOpenTheAdaptFiltersDialog();

			// Act - Press Show Values button
			When.onTheSmartFilterBarTypesPage.iPressTheAdaptFiltersShowValuesButton();

			// Act - Search for the String Single field
			When.onTheSmartFilterBarTypesPage.waitFor({
				controlType: "sap.m.SearchField",
				searchOpenDialogs: true,
				actions: new EnterText({
					text: "String Single"
				})
			});

			// Act - Enter a valid value in the input
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_SINGLE", "0001");

			// Act - Press Adapt Filters cancel button
			When.onTheSmartFilterBarTypesPage.iPressTheAdaptFiltersCancelButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.waitFor({
				id: "smartFilterBar-filterItemControlA_-STRING_SINGLE",
				controlType: "sap.m.Input",
				success: function (oInput) {
					Opa5.assert.strictEqual(oInput.getValueState(), "Error", "The state should be Error");
				}
			});

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
		});

		opaTest("MaxLength with value list BCP: 1970275439", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act - enter a valid date directly in the input
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_VL_MAXLENGTH", "4334" /* >3 characters */);
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert - Dialog with the correct error message is open
			Then.onTheSmartFilterBarTypesPage.waitFor({
				controlType: "sap.m.Dialog",
				searchOpenDialogs: true,
				success: function (aDialogs) {
					var oDialog = aDialogs[0];

					Opa5.assert.ok(oDialog.isA("sap.m.Dialog"), 'Error Dialog should be open');
					// Opa5.assert.strictEqual(oDialog.getTitle(), oRB.getText("VALUEHELPDLG_SELECTIONFAILEDTITLE"),
					// 	"Error dialog title should match");
					Opa5.assert.strictEqual(
						oDialog.getContent()[0].getText(),
						oRB.getText("VALIDATION_ERROR_MESSAGE"),
						"Error message in dialog should match"
					);
				},
				errorMessage: "did not find the filters dialog",
				timeout: 15
			});

			// Act - press the dialog go button
			When.onTheSmartFilterBarTypesPage.waitFor({
				controlType: "sap.m.Button",
				actions: new Press(),
				searchOpenDialogs: true
			});

			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_VL_MAXLENGTH", "1" /* <3 characters */);

			// Act - press the go button
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("STRING_VL_MAXLENGTH eq '1'");

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
		});

		opaTest("String auto - token creation", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act - enter a valid strings directly in the input
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_AUTO", "0002");
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_AUTO", ">0002");

			// Act - Create filters
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("(STRING_AUTO gt '0002' or STRING_AUTO eq '0002') and STRING_OUT1 eq 'outValue1' and STRING_OUT2 eq datetime'2014-12-05T00:00:00'");

			// Act - enter invalid string in the input and press the "go" button
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_AUTO", "Some invalid strings");
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theErrorDialogIsOpen();

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheErrorDialogCloseButton();
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
		});

		opaTest("String auto test duplication of items and ranges", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Act

			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_AUTO", "0001");
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_AUTO", "0003");
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_AUTO", "=0001");
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_AUTO", "=0002");
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert string is equal
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch(function () {
				return "(STRING_AUTO eq '0001' or STRING_AUTO eq '0002' or STRING_AUTO eq '0001' or STRING_AUTO eq '0003') and STRING_OUT1 eq 'outValue1' and STRING_OUT2 eq datetime'2014-12-05T00:00:00'";
			}());

			//Act
			When.onTheSmartFilterBarTypesPage.iPressTheSetfilterDataAsStringButton();

			//Assert
			Then.onTheSmartFilterBarTypesPage.waitFor({
				id: "smartFilterBar-filterItemControlA_-STRING_AUTO",
				controlType: "sap.m.Input",
				success: function (oInput) {
					Opa5.assert.strictEqual(oInput.getTokens().length, 3, "Tokens should be 3");
					Opa5.assert.strictEqual(oInput.getTokens()[0].getText(), "Key 0001 (0001)", "The token should be with value Key 0001 (0001)");
					Opa5.assert.strictEqual(oInput.getTokens()[1].getText(), "Key 0003 (0003)", "The token should be with value Key 0003 (0003)");
					Opa5.assert.strictEqual(oInput.getTokens()[2].getText(), "=0002", "The token should be with value =0002");

				}
			});

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
		});

		// table select all is no longer available with integration of MultiSelectionPlugin in VHD
		opaTest("String auto - test with a lot of tokens", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act - Press button to open String Auto dialog
			When.onTheSmartFilterBarTypesPage.iOpenTheVHD("smartFilterBar-filterItemControlA_-STRING_AUTO");

			// Act - press the dialog go button to trigger search
			When.onTheSmartFilterBarTypesPage.iPressSearchFieldIconButton("smartFilterBar-filterItemControlA_-STRING_AUTO-valueHelpDialog-smartFilterBar-btnGo");

			//Act - click on table
			Then.onTheSmartFilterBarTypesPage.waitFor({
				id: "smartFilterBar-filterItemControlA_-STRING_AUTO-valueHelpDialog-table-ui5table",
				controlType: "sap.ui.table.Table",
				searchOpenDialogs: true,
				success: function (oTable) {
					// Act - Check the select All checkbox - not a UI5 control so click should be done directly with jQuery
					// Also note that using oTable.selectAll is not an option due to event not being fired and we rely on it.
					var oTableSelectionInstance = oTable._getSelectionPlugin && oTable._getSelectionPlugin().isA("sap.ui.table.plugins.MultiSelectionPlugin") ? oTable._getSelectionPlugin() : oTable;
					oTableSelectionInstance.setSelectionInterval(0, 200).then(function () {
						Opa5.assert.equal(oTableSelectionInstance.getSelectedIndices().length, 200, "We should have 200 indices selected");
					});
				}
			});

			//Assert 1500 tokens are displayed in the panel
			Then.onTheSmartFilterBarTypesPage.waitFor({
				id: "smartFilterBar-filterItemControlA_-STRING_AUTO-valueHelpDialog-tokenPanel",
				controlType: "sap.m.Panel",
				searchOpenDialogs: true,
				success: function (oPanel) {

					// Assert panel header should say that 200 items are selected
					Opa5.assert.strictEqual(oPanel.getHeaderText(), oRB.getText("VALUEHELPDLG_SELECTEDITEMS_CONDITIONS", [200]), "Panel header should be correct");
				}
			});

			// Act - press the dialog ok button to trigger search
			When.onTheSmartFilterBarTypesPage.waitFor({
				controlType: "sap.m.Button",
				matchers: function (oControl) {
					return oControl.getText() === oRB.getText("VALUEHELPDLG_OK") && oControl.getType() === ButtonType.Emphasized;
				},
				actions: new Press(),
				searchOpenDialogs: true
			});

			// Act - press the go button
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert string is equal
			Then.waitFor({
				id: "outputAreaFilters",
				success: function (oText) {
					Opa5.assert.strictEqual(
						oText.getText().match(/STRING_AUTO eq '[0-9]{4}'/gm).length,
						200,
						"There are 200 filters generated"
					);
				}
			});

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
		});

		opaTest("String auto - test counting", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Count should stop counting the items
			When.onTheSmartFilterBarTypesPage.setModelDefaultCountModeToNone();

			// Act - Press button to open String Auto dialog
			When.onTheSmartFilterBarTypesPage.iOpenTheVHD("smartFilterBar-filterItemControlA_-STRING_AUTO");


			// Assert - Dialog with the correct title is open
			Then.onTheSmartFilterBarTypesPage.waitFor({
				controlType: "sap.m.Dialog",
				searchOpenDialogs: true,
				success: function (aDialogs) {
					Opa5.assert.strictEqual(aDialogs[0].getTitle(), "String Auto", 'Dialog title should be "String Auto"');
				},
				errorMessage: "did not find the filters dialog"
			});

			// Act - press the dialog go button to trigger search
			When.onTheSmartFilterBarTypesPage.iPressSearchFieldIconButton("smartFilterBar-filterItemControlA_-STRING_AUTO-valueHelpDialog-smartFilterBar-btnGo");

			// Assert counter didn't change
			Then.onTheSmartFilterBarTypesPage.waitFor({
				controlType: "sap.m.Title",
				searchOpenDialogs: true,
				matchers: function (oTitle) {
					return oTitle.getText() === oRB.getText("VALUEHELPDLG_TABLETITLENOCOUNT", [1500]);
				},
				success: function () {
					Opa5.assert.ok(true, "Counter in Table header should be deactivated and show only 'Items' text ");
				}
			});

			When.onTheSmartFilterBarTypesPage.iPressTheVHDOKButton();
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();

			// Count should start counting the items
			When.onTheSmartFilterBarTypesPage.setModelDefaultCountModeToRequest();

			// Act - Press button to open String Auto dialog
			When.onTheSmartFilterBarTypesPage.iOpenTheVHD("smartFilterBar-filterItemControlA_-STRING_AUTO");

			// Act - press the dialog go button to trigger search
			When.onTheSmartFilterBarTypesPage.iPressSearchFieldIconButton("smartFilterBar-filterItemControlA_-STRING_AUTO-valueHelpDialog-smartFilterBar-btnGo");

			// Assert counter should change
			Then.onTheSmartFilterBarTypesPage.waitFor({
				controlType: "sap.m.Title",
				searchOpenDialogs: true,
				matchers: function (oTitle) {
					return oTitle.getText() === oRB.getText("VALUEHELPDLG_TABLETITLE1", ["1,000"]);
				},
				success: function () {
					Opa5.assert.ok(true, "Counter in Table header should be active and show only 'Items (1,000)' text ");
				}
			});

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheVHDOKButton();
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();

			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("String single - text arrangement support", function (Given, When, Then) {
			// Arrange
			var sFilterBarId = "__xmlview0--smartFilterBar";
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			When.onFilterBar.iEnterFilterValue(sFilterBarId, {
				"ZEPM_C_SALESORDERITEMQUERYResults": {
					label: "String Single TextArrangement",
					values: ["0001"]
				}
			});

			Then.onFilterBar.iShouldSeeFilters(sFilterBarId, {
				"String Single TextArrangement": [
					{
						operator: "EQ",
						values: ["Key 0001 (0001)"]
					}
				]
			});

			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("String auto with display formatt uppercase test duplication of items and ranges", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Act

			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_AUTO_UPPERCASE", "0001");
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert string is equal
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch(function () {
				return "STRING_AUTO_UPPERCASE eq '0001'";
			}());

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();

			Given.onTheCompTestLibrary.iStopMyApp();
		});


		QUnit.module("CalendarDateType");
		opaTest("basic", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();
			// Act - enter a valid date directly in the input
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlA_-CalendarYear", "20202");
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlA_-CalendarWeek", "55");
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlA_-CalendarMonth", "13");
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlA_-CalendarQuarter", "5");
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlA_-CalendarYearWeek", "55/2022");
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlA_-CalendarYearMonth", "13/2022");
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlA_-CalendarYearQuarter", "5/2022");


			// Assert
			Then.onTheSmartFilterBarTypesPage.waitFor({
				id: "smartFilterBar-filterItemControlA_-CalendarYear",
				controlType: "sap.m.Input",
				success: function (oInput) {
					Opa5.assert.strictEqual(oInput.getValueState(), ValueState.Error,
						"CalendarYear value state should be error");
				}
			});

			Then.onTheSmartFilterBarTypesPage.waitFor({
				id: "smartFilterBar-filterItemControlA_-CalendarWeek",
				controlType: "sap.m.Input",
				success: function (oInput) {
					Opa5.assert.strictEqual(oInput.getValueState(), ValueState.Error,
						"CalendarYear value state should be error");
				}
			});

			Then.onTheSmartFilterBarTypesPage.waitFor({
				id: "smartFilterBar-filterItemControlA_-CalendarMonth",
				controlType: "sap.m.Input",
				success: function (oInput) {
					Opa5.assert.strictEqual(oInput.getValueState(), ValueState.Error,
						"CalendarYear value state should be error");
				}
			});

			Then.onTheSmartFilterBarTypesPage.waitFor({
				id: "smartFilterBar-filterItemControlA_-CalendarQuarter",
				controlType: "sap.m.Input",
				success: function (oInput) {
					Opa5.assert.strictEqual(oInput.getValueState(), ValueState.Error,
						"CalendarYear value state should be error");
				}
			});

			Then.onTheSmartFilterBarTypesPage.waitFor({
				id: "smartFilterBar-filterItemControlA_-CalendarYearWeek",
				controlType: "sap.m.Input",
				success: function (oInput) {
					Opa5.assert.strictEqual(oInput.getValueState(), ValueState.Error,
						"CalendarYear value state should be error");
				}
			});

			Then.onTheSmartFilterBarTypesPage.waitFor({
				id: "smartFilterBar-filterItemControlA_-CalendarYearMonth",
				controlType: "sap.m.Input",
				success: function (oInput) {
					Opa5.assert.strictEqual(oInput.getValueState(), ValueState.Error,
						"CalendarYear value state should be error");
				}
			});

			Then.onTheSmartFilterBarTypesPage.waitFor({
				id: "smartFilterBar-filterItemControlA_-CalendarYearQuarter",
				controlType: "sap.m.Input",
				success: function (oInput) {
					Opa5.assert.strictEqual(oInput.getValueState(), ValueState.Error,
						"CalendarYear value state should be error");
				}
			});

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();

			// Act - enter a valid date directly in the input
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlA_-CalendarYear", "2020");
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlA_-CalendarWeek", "53");
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlA_-CalendarMonth", "1");
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlA_-CalendarQuarter", "3");
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlA_-CalendarYearWeek", "52/2022");
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlA_-CalendarYearMonth", "12/2022");
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlA_-CalendarYearQuarter", "1/2022");

			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("CalendarYear eq '2020' and CalendarWeek eq '53' and CalendarMonth eq '01' and CalendarQuarter eq '3' and CalendarYearWeek eq '202252' and CalendarYearMonth eq '202212' and CalendarYearQuarter eq '20221'");

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();

			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.start();
	});
});
