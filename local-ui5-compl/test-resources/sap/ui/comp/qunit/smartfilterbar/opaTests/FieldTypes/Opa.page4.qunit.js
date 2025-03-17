/* global QUnit */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/test/actions/EnterText",
	"sap/ui/core/library",
	'sap/base/strings/whitespaceReplacer',
	"sap/ui/core/Core",
	"test-resources/sap/ui/comp/testutils/opa/TestLibrary"
], function (
	Opa5,
	opaTest,
	EnterText,
	coreLibrary,
	whitespaceReplacer,
	Core
) {
	"use strict";

	// shortcut for sap.ui.core.ValueState
	var ValueState = coreLibrary.ValueState;

	Opa5.extendConfig({
		viewName: "SmartFilterBar",
		viewNamespace: "sap.ui.comp.sample.smartfilterbar_types",
		autoWait: true,
		enabled: false,
		async: true,
		testLibs: {
			compTestLibrary: {
				appUrl: "test-resources/sap/ui/comp/qunit/smartfilterbar/opaTests/FieldTypes/applicationUnderTest/SmartFilterBar_Types.html"
			}
		}
	});

	sap.ui.require([
		"sap/ui/comp/qunit/smartfilterbar/opaTests/FieldTypes/pages/SmartFilterBarTypes"
	], function () {

		QUnit.module("Exclude operations");

		opaTest("String operations", function (Given, When, Then) {
			// Arrangements
			var aConditions = [
				{ operation: "does not contain", input1: "A" },
				{ operation: "not equal to", input1: "B" },
				{ operation: "not between", input1: "C", input2: "D" },
				{ operation: "does not start with", input1: "E" },
				{ operation: "does not end with", input1: "F" },
				{ operation: "not less than", input1: "G" },
				{ operation: "not less than or equal to", input1: "H" },
				{ operation: "not greater than", input1: "I" },
				{ operation: "not greater than or equal to", input1: "J" }
			],
				iCondition = 0;

			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheSmartFilterBarTypesPage.iOpenTheVHD("smartFilterBar-filterItemControlA_-STRING_AUTO");
			When.onTheSmartFilterBarTypesPage.iNavigateToTheDefineConditionsTab();

			aConditions.forEach(function (oCondition) {
				When.onTheSmartFilterBarTypesPage.iChangeTheCondition(oCondition.operation, true, iCondition)
					.and.iEnterTextInConditionField(
						true,
						iCondition,
						oCondition.input1,
						(oCondition.input2 ? oCondition.input2 : undefined)
					);

				When.onTheSmartFilterBarTypesPage.iPressTheFilterAddButton();
				iCondition++;
			});

			When.onTheSmartFilterBarTypesPage.iPressTheVHDOKButton();
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("not substringof('A',STRING_AUTO) and STRING_AUTO ne 'B' and not (STRING_AUTO ge 'C' and STRING_AUTO le 'D') and not startswith(STRING_AUTO,'E') and not endswith(STRING_AUTO,'F') and STRING_AUTO ge 'G' and STRING_AUTO gt 'H' and STRING_AUTO le 'I' and STRING_AUTO lt 'J'");

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
		});

		opaTest("String operations from tokens", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			["!*AAA*", "!=BBB", "!CCC...DDD", "!EEE*", "!*FFF", "!<GGG", "!<=HHH", "!>III", "!>=JJJ"].forEach(function (sToken) {
				When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_AUTO", sToken);
			});

			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("not substringof('AAA',STRING_AUTO) and STRING_AUTO ne 'BBB' and not (STRING_AUTO ge 'CCC' and STRING_AUTO le 'DDD') and not startswith(STRING_AUTO,'EEE') and not endswith(STRING_AUTO,'FFF') and STRING_AUTO ge 'GGG' and STRING_AUTO gt 'HHH' and STRING_AUTO le 'III' and STRING_AUTO lt 'JJJ'");

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
		});

		opaTest("String operations from tokens - alternative input - copy & paste scenario", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			["!(*AAA*)", "!(=BBB)", "!(CCC...DDD)", "!(EEE*)", "!(*FFF)", "!(<GGG)", "!(<=HHH)", "!(>III)", "!(>=JJJ)"].forEach(function (sToken) {
				When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_AUTO", sToken);
			});

			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("not substringof('AAA',STRING_AUTO) and STRING_AUTO ne 'BBB' and not (STRING_AUTO ge 'CCC' and STRING_AUTO le 'DDD') and not startswith(STRING_AUTO,'EEE') and not endswith(STRING_AUTO,'FFF') and STRING_AUTO ge 'GGG' and STRING_AUTO gt 'HHH' and STRING_AUTO le 'III' and STRING_AUTO lt 'JJJ'");

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
		});

		QUnit.module("Value help dialog");

		opaTest("When I use the ValueHelp dialog should take over a value into the basic search", function (Given, When, Then) {
			// Arrange
			var sControlName = "__xmlview0--smartFilterBar-filterItemControlA_-STRING_SINGLE";
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act - enter a valid date directly in the input
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled(sControlName, "1", "", true);
			When.onTheSmartFilterBarTypesPage.iPressValueHelpIcon(sControlName + "-vhi");

			// Assert
			Then.onTheSmartFilterBarTypesPage.iShouldSeeValueHelpDialog(sControlName + "-valueHelpDialog", 1, 1);

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheVHDCancelButton();
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
		});

		QUnit.module("Analytic Parameters");

		opaTest("Validate mandatory property of analytic parameters", function (Given, When, Then) {
			var oExpectedParameters = {
				"smartFilterBar-filterItemControlA_-_Parameter.P_Bukrs": "mandatory",
				"smartFilterBar-filterItemControlA_-_Parameter.P_Optional": "optional",
				"smartFilterBar-filterItemControlA_-_Parameter.P_DisplayCurrency": "mandatory",
				"smartFilterBar-filterItemControlA_-_Parameter.P_Int": "mandatory",
				"smartFilterBar-filterItemControlA_-_Parameter.P_KeyDate": "mandatory",
				"smartFilterBar-filterItemControlA_-_Parameter.P_Time": "mandatory"
			};

			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Assert
			Object.keys(oExpectedParameters).forEach(function (sKey) {
				var bRequired = oExpectedParameters[sKey] === "mandatory";
				Then.onTheSmartFilterBarTypesPage.waitFor({
					id: sKey,
					success: function (oControl) {
						Opa5.assert.strictEqual(oControl.getLabels()[0].getRequired(), bRequired,
							"Control with ID '" + sKey + "' is of expected to be required '" + bRequired + "'");
					}
				});
			});

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
		});

		QUnit.module("Numeric string");

		opaTest("Interval validation for display format NonNegative", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheSmartFilterBarTypesPage.iOpenTheVHD("smartFilterBar-filterItemControlA_-NUMC_AUTO");
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
				id: "smartFilterBar-filterItemControlA_-NUMC_AUTO",
				controlType: "sap.m.Input",
				success: function (oInput) {
					Opa5.assert.strictEqual(oInput.getTokens()[0].getText(), "=0", "The token should be with value =0");
				}
			});

			When.onTheSmartFilterBarTypesPage.iOpenTheVHD("smartFilterBar-filterItemControlA_-NUMC_AUTO");
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
				id: "smartFilterBar-filterItemControlA_-NUMC_AUTO",
				controlType: "sap.m.Input",
				success: function (oInput) {
					Opa5.assert.strictEqual(oInput.getTokens()[0].getText(), "0...1", "The token should be with value =0");
				}
			});

			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("(NUMC_AUTO ge '0000' and NUMC_AUTO le '0001')");

			When.onTheSmartFilterBarTypesPage.iOpenTheVHD("smartFilterBar-filterItemControlA_-NUMC_AUTO");
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
				id: "smartFilterBar-filterItemControlA_-NUMC_AUTO",
				controlType: "sap.m.Input",
				success: function (oInput) {
					Opa5.assert.strictEqual(oInput.getTokens()[0].getText(), "!(<=0)", "The token should be with value !(<=0)");
				}
			});

			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("NUMC_AUTO gt '0000'"
			);

			When.onTheSmartFilterBarTypesPage.iOpenTheVHD("smartFilterBar-filterItemControlA_-NUMC_AUTO");
			When.onTheSmartFilterBarTypesPage.iSelectOperation("GE");

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
				id: "smartFilterBar-filterItemControlA_-NUMC_AUTO",
				controlType: "sap.m.Input",
				success: function (oInput) {
					Opa5.assert.strictEqual(oInput.getTokens()[0].getText(), ">=0", "The token should be with value >0");
				}
			});

			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("NUMC_AUTO ge '0000'"
			);

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
		});

		QUnit.module("Whitespace characters");
		opaTest("SFBMultiInput correct handle whitespace characters", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();
			var sControlName = "smartFilterBar-filterItemControlA_-WS_SFBM";

			// Act
			When.onTheSmartFilterBarTypesPage.iPressValueHelpIcon(sControlName + "-vhi");
			Then.onTheSmartFilterBarTypesPage.waitFor({
				id: "smartFilterBar-filterItemControlA_-WS_SFBM-valueHelpDialog-table-ui5table",
				controlType: "sap.ui.table.Table",
				searchOpenDialogs: true,
				success: function (oTable) {
					Opa5.getJQuery()("#__xmlview0--smartFilterBar-filterItemControlA_-WS_SFBM-valueHelpDialog-table-ui5table-rowsel0").trigger("tap");
				}
			});
			When.onTheSmartFilterBarTypesPage.iPressTheVHDOKButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.waitFor({
				id: "smartFilterBar-filterItemControlA_-WS_SFBM",
				success: function (oControl) {
					Opa5.assert.strictEqual(oControl.getTokens()[0].getText(), whitespaceReplacer("Text          with 10 whitespace characters"));
				}
			});

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
		});

		opaTest("MultiComboBox correct handle whitespace characters", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();
			var sControlName = "smartFilterBar-filterItemControlA_-WS_FIXED";

			//Act
			When.onTheSmartFilterBarTypesPage.waitFor({
				id: sControlName,
				success: function (oControl) {
					var aItems = oControl.getItems();
					oControl.setSelectedItems([aItems[0]]);
					Core.applyChanges();
				}
			});

			// Assert
			Then.onTheSmartFilterBarTypesPage.waitFor({
				id: "smartFilterBar-filterItemControlA_-WS_FIXED",
				success: function (oControl) {
					Opa5.assert.strictEqual(oControl.getSelectedItems()[0].getText(), whitespaceReplacer("Text          with 10 whitespace characters"));
				}
			});

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();

			Given.onTheCompTestLibrary.iStopMyApp();

		});

		opaTest("Empty/NotEmpty operation for Edm.Guid type", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheSmartFilterBarTypesPage.iOpenTheVHD("__xmlview0--smartFilterBar-filterItemControlA_-ObjectUUID1");
			When.onTheSmartFilterBarTypesPage.iNavigateToTheDefineConditionsTab();

			// Assert
			Then.onTheSmartFilterBarTypesPage.thereIsOperation("ObjectUUID1", "Empty");
			Then.onTheSmartFilterBarTypesPage.thereIsOperation("ObjectUUID1", "NotEmpty");

			When.onTheSmartFilterBarTypesPage.iPressTheVHDOKButton();

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();

			Given.onTheCompTestLibrary.iStopMyApp();
		});



	QUnit.module("Adapt Filters");

		opaTest("AriaLabelledBy should have correct value of the filters is AdaptFilter dialog", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Actions
			When.onTheSmartFilterBarTypesPage.iOpenTheAdaptFiltersDialog();

			// Act - Find the first More filters
			When.onTheSmartFilterBarTypesPage.iSwitchAdaptFiltersToGroupView();

			// Assert
			Then.onTheSmartFilterBarTypesPage.waitFor({
				id: "__xmlview0--smartFilterBar-filterItemControlA_-_Parameter.P_Bukrs",
				success: function (oControl) {
					Opa5.assert.strictEqual(oControl.getDomRef().children[0].children[0].getAttribute("aria-labelledBy"), oControl.getLabels()[0].sId);
				}
			});

			// Cleanup
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("SFBMultiComboBox should remove existing token on pressing its remove icon in Adapt Filters Dialog", function (Given, When, Then) {
			var sControlId = "__xmlview0--smartFilterBar-filterItemControlA_-STRING_MULTIPLE_VLTX_FL";

			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheSmartFilterBarTypesPage.iExpandMultiComboBox(sControlId);
			When.onTheSmartFilterBarTypesPage.iPressMultiComboBoxItem(sControlId, "Key 0001 (0001)");
			When.onTheSmartFilterBarTypesPage.iOpenTheAdaptFiltersDialog();
			When.onTheSmartFilterBarTypesPage.iSearchFieldsInAdaptFilters("Multiple with");
			When.onTheSmartFilterBarTypesPage.iPressTheAdaptFiltersShowValuesButton();
			When.onTheSmartFilterBarTypesPage.iPressTokenRemoveIcon(sControlId, "0001 (Key 0001)");

			// Assert
			Then.onTheSmartFilterBarTypesPage.theMultiComboBoxSelectedItemsLengthMatch(sControlId, 0);

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iCloseTheAdaptFiltersDialog();
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();

			Given.onTheCompTestLibrary.iStopMyApp();
		});

		// opaTest("Adding more filters should not trigger scrolling to top", function (Given, When, Then) {
		// 	// Arrange
		// 	Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

		// 	// Actions
		// 	When.onTheSmartFilterBarTypesPage.iOpenTheAdaptFiltersDialog();

		// 	// Act - Find the first More filters
		// 	When.onTheSmartFilterBarTypesPage.waitFor({
		// 		controlType: "sap.m.Button",
		// 		searchOpenDialogs: true,
		// 		actions: new Press(),
		// 		matchers: function (oControl) {
		// 			return oControl.getId().indexOf("expandButton") !== -1;
		// 		}
		// 	});

		// Act - Scroll down to the last item
		// 	When.onTheSmartFilterBarTypesPage.waitFor({
		// 		controlType: "sap.m.Label",
		// 		searchOpenDialogs: true,
		// 		matchers: new PropertyStrictEquals({
		// 			name: "text",
		// 			value: "ZEPM_C_SALESORDERITEMQUERYResults"
		// 		}),
		// 		actions: function (oLabel) {
		// 			// Scroll down
		// 			oLabel.getDomRef().scrollIntoView();
		// 		}
		// 	});

		// Assert - we successfully scrolled
		// 	When.onTheSmartFilterBarTypesPage.waitFor({
		// 		controlType: "sap.m.Dialog",
		// 		searchOpenDialogs: true,
		// 		success: function (aDialogs) {
		// 			Opa5.assert.ok(
		// 				aDialogs[0].$().find(".sapMDialogSection").scrollTop() > 0,
		// 				"scrollTop is greater than zero."
		// 			);
		// 		}
		// 	});

		// Assert - we are not at the top of the scroll
		// 	When.onTheSmartFilterBarTypesPage.waitFor({
		// 		controlType: "sap.m.Dialog",
		// 		searchOpenDialogs: true,
		// 		success: function (aDialogs) {
		// 			Opa5.assert.ok(
		// 				aDialogs[0].$().find(".sapMDialogSection").scrollTop() > 0,
		// 				"scrollTop is greater than zero."
		// 			);
		// 		}
		// 	});

		// 	// Cleanup
		// 	When.onTheSmartFilterBarTypesPage.iPressTheAdaptFiltersGoButton();
		// 	When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
		// });


		QUnit.start();
	});
});
