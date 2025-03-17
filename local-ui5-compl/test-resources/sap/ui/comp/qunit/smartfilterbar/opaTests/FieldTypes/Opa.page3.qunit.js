/* global QUnit */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/test/actions/Press",
	"sap/ui/core/library",
	"test-resources/sap/ui/comp/testutils/opa/TestLibrary"
], function (
	Opa5,
	opaTest,
	Press,
	coreLibrary
) {
	"use strict";

	// shortcut for sap.ui.core.ValueState
	var ValueState = coreLibrary.ValueState;

	var oRB = Opa5.getWindow().sap.ui.require("sap/ui/test/OpaPlugin")?.getLibraryResourceBundle("sap.ui.comp");

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

		QUnit.module("In/Out parameters");

		opaTest("basic", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act - enter a valid date directly in the input
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_IN1", "foo");
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("STRING_IN1 eq 'foo'");

			// Act - Open the String InOut VH
			When.onTheSmartFilterBarTypesPage.iOpenTheVHD("smartFilterBar-filterItemControlA_-STRING_INOUT");
			When.onTheSmartFilterBarTypesPage.iExpandVHDFilters("smartFilterBar-filterItemControlA_-STRING_INOUT");

			// Assert - in Parameter should be present in the VH Dialog
			Then.onTheSmartFilterBarTypesPage.waitFor({
				searchOpenDialogs: true,
				controlType: "sap.m.MultiInput",
				id: "smartFilterBar-filterItemControlA_-STRING_INOUT-valueHelpDialog-smartFilterBar-filterItemControlA_-IN1",
				success: function (oInput) {
					Opa5.assert.strictEqual(oInput.getTokens()[0].getText(), "=foo",
						"'in Param from STRING_SINGLE' field should equal the expected value");
				}
			});

			// Act - press the dialog go button
			When.onTheSmartFilterBarTypesPage.waitFor({
				id: "smartFilterBar-filterItemControlA_-STRING_INOUT-valueHelpDialog-smartFilterBar-btnGo",
				controlType: "sap.m.Button",
				actions: new Press(),
				searchOpenDialogs: true
			});

			// Assert - check filter is applied to table and select all rows
			Then.onTheSmartFilterBarTypesPage.waitFor({
				id: "smartFilterBar-filterItemControlA_-STRING_INOUT-valueHelpDialog-table-ui5table",
				controlType: "sap.ui.table.Table",
				searchOpenDialogs: true,
				success: function (oTable) {
					// Assert
					Opa5.assert.strictEqual(oTable.getBindingInfo("rows").filters.length, 1, "Filter is applied to table");

					// Act - Check the select All checkbox - not a UI5 control so click should be done directly with jQuery
					// Also note that using oTable.selectAll is not an option due to event not being fired and we rely on it.
					// select all is no longer available with integration of MultiSelectionPlugin
					// Opa5.getJQuery()"#__xmlview0--smartFilterBar-filterItemControlA_-STRING_INOUT-valueHelpDialog-table-selall").trigger("click");

					// Assert
					var oTableSelectionInstance = oTable._getSelectionPlugin && oTable._getSelectionPlugin().isA("sap.ui.table.plugins.MultiSelectionPlugin") ? oTable._getSelectionPlugin() : oTable;
					oTableSelectionInstance.setSelectionInterval(0, 1).then(function () {
						Opa5.assert.equal(oTableSelectionInstance.getSelectedIndices().length, 2, "We should have 2 indices selected");
					});
				}
			});

			// Act - press the dialog ok button
			When.onTheSmartFilterBarTypesPage.iPressTheVHDOKButton();

			// Assert - the correct tokens are created in the "String InOut" field
			Then.onTheSmartFilterBarTypesPage.waitFor({
				id: "smartFilterBar-filterItemControlA_-STRING_INOUT",
				controlType: "sap.m.MultiInput",
				success: function (oInput) {
					var aTokens = oInput.getTokens();

					Opa5.assert.strictEqual(aTokens.length, 2, "There should be 2 tokens available in the control");
					Opa5.assert.strictEqual(aTokens[0].getKey(), "1", "Key of the first token should match");
					Opa5.assert.strictEqual(aTokens[0].getText(), "Key 1 (1)", "Text of the first token should match");
					Opa5.assert.strictEqual(aTokens[1].getKey(), "2", "Key of the second token should match");
					Opa5.assert.strictEqual(aTokens[1].getText(), "Key 2 (2)", "Text of the second token should match");
				}
			});

			// Assert - correct token is created in "String Out" field
			Then.onTheSmartFilterBarTypesPage.waitFor({
				id: "smartFilterBar-filterItemControlA_-STRING_OUT1",
				controlType: "sap.m.MultiInput",
				success: function (oInput) {
					var aTokens = oInput.getTokens(),
						oToken = aTokens[0],
						oCustomData = oToken.getCustomData()[0];

					Opa5.assert.strictEqual(aTokens.length, 1, "There should be one token created");
					Opa5.assert.strictEqual(oToken.getText(), "=outValue1", "Token with correct text is created");
					Opa5.assert.strictEqual(oCustomData.getKey(), "range", "Key of the custom data should be `range`");
					Opa5.assert.propEqual(
						oCustomData.getValue(),
						{
							exclude: false,
							keyField: "STRING_OUT1",
							operation: "EQ",
							tokenText: null,
							value1: "outValue1",
							value2: null
						},
						"Custom data should be as expected"
					);
				}
			});

			// Assert - Date out field
			Then.onTheSmartFilterBarTypesPage.waitFor({
				id: "smartFilterBar-filterItemControlA_-STRING_OUT2",
				controlType: "sap.m.MultiInput",
				success: function (oInput) {
					var aTokens = oInput.getTokens(),
						oToken = aTokens[0],
						oCustomData = oToken.getCustomData()[0],
						oExcpectedDate = new Date(2014, 11, 5);

					Opa5.assert.strictEqual(aTokens.length, 1, "There should be one token created");
					Opa5.assert.strictEqual(oToken.getText(), "=12/5/14", "Token with correct text is created");
					Opa5.assert.strictEqual(oCustomData.getKey(), "range", "Key of the custom data should be `range`");
					Opa5.assert.propEqual(
						oCustomData.getValue(),
						{
							exclude: false,
							keyField: "STRING_OUT2",
							operation: "EQ",
							tokenText: null,
							value1: {},
							value2: null
						},
						"Custom data should be as expected"
					);
					Opa5.assert.strictEqual(
						oCustomData.getValue().value1.toString(),
						oExcpectedDate.toString(), // "Fri Dec 05 2014 00:00:00 GMT+0200 (Eastern European Standard Time)",
						"Date should match"
					);
				}
			});

			// Act - Create filters
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("STRING_IN1 eq 'foo' and (STRING_INOUT eq '1' or STRING_INOUT eq '2') and STRING_OUT1 eq 'outValue1' and STRING_OUT2 eq datetime'2014-12-05T00:00:00' and STRING_SINGLE_VLTX_FL eq '0001'");

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
		});

		opaTest("multiple", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act - clear the "String In" field
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_IN1", "");

			// Act - Open the String InOut VH
			When.onTheSmartFilterBarTypesPage.iOpenTheVHD("smartFilterBar-filterItemControlA_-STRING_INOUT");

			// Act - press the dialog go button
			When.onTheSmartFilterBarTypesPage.waitFor({
				id: "smartFilterBar-filterItemControlA_-STRING_INOUT-valueHelpDialog-smartFilterBar-btnGo",
				controlType: "sap.m.Button",
				actions: new Press(),
				searchOpenDialogs: true
			});

			// Act - select all rows
			Then.onTheSmartFilterBarTypesPage.waitFor({
				id: "smartFilterBar-filterItemControlA_-STRING_INOUT-valueHelpDialog-table-ui5table",
				controlType: "sap.ui.table.Table",
				searchOpenDialogs: true,
				success: function (oTable) {
					// Act - Check the select All checkbox - not a UI5 control so click should be done directly with jQuery
					// Also note that using oTable.selectAll is not an option due to event not being fired and we rely on it.
					// select all is no longer available with the integration of MultiSelectionPlugin
					// Opa5.getJQuery()"#__xmlview0--smartFilterBar-filterItemControlA_-STRING_INOUT-valueHelpDialog-table-selall").trigger("click");

					var oTableSelectionInstance = oTable._getSelectionPlugin && oTable._getSelectionPlugin().isA("sap.ui.table.plugins.MultiSelectionPlugin") ? oTable._getSelectionPlugin() : oTable;
					oTableSelectionInstance.setSelectionInterval(0, 3).then(function () {
						Opa5.assert.equal(oTableSelectionInstance.getSelectedIndices().length, 4, "We should have 4 indices selected");
					});
				}
			});

			// Act - press the dialog ok button
			When.onTheSmartFilterBarTypesPage.iPressTheVHDOKButton();

			// Assert - Correct tokens are present in "String Out" field
			Then.onTheSmartFilterBarTypesPage.waitFor({
				id: "smartFilterBar-filterItemControlA_-STRING_OUT1",
				controlType: "sap.m.MultiInput",
				success: function (oInput) {
					var aTokens = oInput.getTokens();

					Opa5.assert.strictEqual(aTokens.length, 3, "There should be three tokens created");
					Opa5.assert.strictEqual(aTokens[0].getText(), "=outValue3", "Token with correct text is created");
					Opa5.assert.strictEqual(aTokens[1].getText(), "=outValue2", "Token with correct text is created");
					Opa5.assert.strictEqual(aTokens[2].getText(), "=outValue1", "Token with correct text is created");
					Opa5.assert.ok(aTokens.every(function (oToken) {
						return oToken.getCustomData().length === 1;
					}), "All tokens have custom data assigned to them");
				}
			});

			// Assert - Date out field
			Then.onTheSmartFilterBarTypesPage.waitFor({
				id: "smartFilterBar-filterItemControlA_-STRING_OUT2",
				controlType: "sap.m.MultiInput",
				success: function (oInput) {
					var aTokens = oInput.getTokens();

					Opa5.assert.strictEqual(aTokens.length, 2, "There should be two tokens created");
					Opa5.assert.strictEqual(aTokens[0].getText(), "=12/16/14", "Token with correct text is created");
					Opa5.assert.strictEqual(aTokens[1].getText(), "=12/5/14", "Token with correct text is created");
					Opa5.assert.ok(aTokens.every(function (oToken) {
						return oToken.getCustomData().length === 1;
					}), "All tokens have custom data assigned to them");
				}
			});

			// Act - open the "Date Out" field VH
			When.onTheSmartFilterBarTypesPage.iOpenTheVHD("smartFilterBar-filterItemControlA_-STRING_OUT2");

			// Assert  - there should be 2 defined conditions
			Then.onTheSmartFilterBarTypesPage.waitFor({
				controlType: "sap.m.P13nConditionPanel",
				searchOpenDialogs: true,
				success: function (aPanels) {
					var oIncludes = aPanels[0],
						aConditions = oIncludes.getConditions(),
						oExcpectedDate1 = new Date(2014, 11, 16, 13, 48, 20),
						oExcpectedDate2 = new Date(2014, 11, 5);

					Opa5.assert.strictEqual(aConditions.length, 2, "There should be 2 conditions");
					Opa5.assert.propEqual(
						aConditions[0],
						{
							exclude: false,
							key: "range_0",
							keyField: "STRING_OUT2",
							operation: "EQ",
							showIfGrouped: undefined,
							text: "=" + oExcpectedDate1.toString(), // Tue Dec 16 2014 13:48:20 GMT+0200 (Eastern European Standard Time)
							value1: {},
							value2: null
						},
						"Correct object is assigned"
					);
					Opa5.assert.propEqual(
						aConditions[1],
						{
							exclude: false,
							key: "range_1",
							keyField: "STRING_OUT2",
							operation: "EQ",
							showIfGrouped: undefined,
							text: "=" + oExcpectedDate2.toString(), // Fri Dec 05 2014 00:00:00 GMT+0200 (Eastern European Standard Time)
							value1: {},
							value2: null
						},
						"Correct object is assigned"
					);
				}
			});

			// Act - press the dialog ok button
			When.onTheSmartFilterBarTypesPage.iPressTheVHDOKButton();

			// Act - Create filters
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("(STRING_INOUT eq '1' or STRING_INOUT eq '2' or STRING_INOUT eq '3' or STRING_INOUT eq '4') and (STRING_OUT1 eq 'outValue3' or STRING_OUT1 eq 'outValue2' or STRING_OUT1 eq 'outValue1') and (STRING_OUT2 eq datetime'2014-12-16T00:00:00' or STRING_OUT2 eq datetime'2014-12-05T00:00:00') and STRING_SINGLE_VLTX_FL eq '0001'");

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
		});

		opaTest("When I use the ValueHelp dialog with deprecation code annotation in SmartFilterBar it should hide revoked values", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act - clear the "String In" field
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_INOUT_DEPRECATIONCODE", "");

			// Act - Open the String InOut VH
			When.onTheSmartFilterBarTypesPage.iOpenTheVHD("smartFilterBar-filterItemControlA_-STRING_INOUT_DEPRECATIONCODE");

			// Assert
			Then.onTheSmartFilterBarTypesPage.iShouldSeeValueHelpDialogWithoutMatchingItsTableData("smartFilterBar-filterItemControlA_-STRING_INOUT_DEPRECATIONCODE-valueHelpDialog", "String InOut Deprecation code");

			// Act press the dialog go button to trigger search
			When.onTheSmartFilterBarTypesPage.iPressSearchFieldIconButton("smartFilterBar-filterItemControlA_-STRING_INOUT_DEPRECATIONCODE-valueHelpDialog-smartFilterBar-btnGo");

			//Assert counter should change
			Then.onTheSmartFilterBarTypesPage.waitFor({
				controlType: "sap.m.Title",
				searchOpenDialogs: true,
				success: function (oAllTitles) {
					var oTitle = oAllTitles.filter(function (title) {
						return title.oParent.oParent && title.oParent.oParent.sId === "__xmlview0--smartFilterBar-filterItemControlA_-STRING_INOUT_DEPRECATIONCODE-valueHelpDialog-table";
					});

					// Assert panel header should say that 1500 items are selected
					Opa5.assert.strictEqual(oTitle[0].getText(), oRB.getText("VALUEHELPDLG_TABLETITLE1", [4]), "Counter in Table header should be active and show only 'Items (4)' text ");
				}
			});

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheVHDOKButton();
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
		});

		QUnit.module("Validation");

		opaTest("Single input field with associated value list", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act - enter a valid date directly in the input
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_SINGLE", "not existing key");
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert - Dialog with the correct error message is open
			Then.onTheSmartFilterBarTypesPage.theErrorDialogIsOpen();

			// Act - close the error dialog
			When.onTheSmartFilterBarTypesPage.waitFor({
				controlType: "sap.m.Button",
				actions: new Press(),
				searchOpenDialogs: true
			});

			// Assert
			Then.onTheSmartFilterBarTypesPage.waitFor({
				id: "smartFilterBar-filterItemControlA_-STRING_SINGLE",
				success: function (oInput) {
					Opa5.assert.strictEqual(oInput.getValueState(), ValueState.Error, "Value state should be error");
				}
			});

			// Act - enter a valid string which exist as a key in the associated value list
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_SINGLE", "1");
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.waitFor({
				id: "smartFilterBar-filterItemControlA_-STRING_SINGLE",
				success: function (oInput) {
					Opa5.assert.strictEqual(oInput.getValueState(), ValueState.None, "Value state should be none");
				}
			});
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("STRING_SINGLE eq '1'");

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
		});

		[
			{
				name: "NUMC_SINGLE_TextOnly_FIXED",
				expected: "NUMC_SINGLE_TextOnly_FIXED eq '1'"
			},
			{
				name: "NUMC_SINGLE_TextOnly_STANDARD",
				expected: "NUMC_SINGLE_TextOnly_STANDARD eq '5'"
			},
			{
				name: "STRING_SINGLE_TextOnly_FIXED",
				expected: "STRING_SINGLE_TextOnly_FIXED eq '1'"
			},
			{
				name: "STRING_SINGLE_TextOnly_STANDARD",
				expected: "STRING_SINGLE_TextOnly_STANDARD eq '5'"
			}
		].forEach(function (oField) {
			opaTest("Valid entries matching two descriptions and id in " + oField.name + " filter", function (Given, When, Then) {
				var sFilterId = "smartFilterBar-filterItemControlA_-";

				//Arrange
				Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

				// Act
				// select a valid value which corresponds to 2 descriptions and 1 id,
				// select one of the descriptions in the combo
				// select the one with the id for the input
				When.onTheSmartFilterBarTypesPage.iEnterStringInFiled(sFilterId + oField.name, "5");
				When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

				// Assert
				Then.onTheSmartFilterBarTypesPage.theFilterValueStateShouldMatch(sFilterId + oField.name, ValueState.None);
				Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch(oField.expected);

				// Cleanup
				When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
			});
		});

		[
			{
				name: "NUMC_SINGLE_TextOnly_FIXED"
			},
			{
				name: "NUMC_SINGLE_TextOnly_STANDARD"
			},
			{
				name: "STRING_SINGLE_TextOnly_FIXED"
			},
			{
				name: "STRING_SINGLE_TextOnly_STANDARD"
			}
		].forEach(function (oField) {
			opaTest("Valid entries matching description and id in " + oField.name + " filter", function (Given, When, Then) {
				var sFilterId = "smartFilterBar-filterItemControlA_-";

				//Arrange
				Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

				// Act
				// select a valid value which corresponds to 1 description and 1 id,
				// select the one with the id in both scenarios
				When.onTheSmartFilterBarTypesPage.iEnterStringInFiled(sFilterId + oField.name, "3");
				When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

				// Assert
				Then.onTheSmartFilterBarTypesPage.theFilterValueStateShouldMatch(sFilterId + oField.name, ValueState.None);
				Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch(oField.name + " eq '11'");

				// Cleanup
				When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
			});
		});

		[
			{
				name: "NUMC_SINGLE_TextOnly_STANDARD"
			},
			{
				name: "STRING_SINGLE_TextOnly_STANDARD"
			}
		].forEach(function (oField) {
			opaTest("Valid entries matching id in " + oField.name + " filter", function (Given, When, Then) {
				var sFilterId = "smartFilterBar-filterItemControlA_-";

				//Arrange
				Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

				// Act
				// select a valid value which corresponds to 1 id,
				// select the one with the id in standard scenario
				When.onTheSmartFilterBarTypesPage.iEnterStringInFiled(sFilterId + oField.name, "2");
				When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

				// Assert
				Then.onTheSmartFilterBarTypesPage.theFilterValueStateShouldMatch(sFilterId + oField.name, ValueState.None);
				Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch(oField.name + " eq '2'");

				// Cleanup
				When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
			});
		});

		[
			{
				name: "NUMC_SINGLE_TextOnly_STANDARD"
			},
			{
				name: "STRING_SINGLE_TextOnly_STANDARD"
			}
		].forEach(function (oField) {
			opaTest("Invalid entries in " + oField.name + " filter", function (Given, When, Then) {
				var sFilterId = "smartFilterBar-filterItemControlA_-";

				//Arrange
				Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

				// Act
				// select an invalid value which corresponds to 1 id,
				// throws validation error in combo
				When.onTheSmartFilterBarTypesPage.iEnterStringInFiled(sFilterId + oField.name , "rrr");
				When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

				// Assert - Dialog with the correct error message is open
				Then.onTheSmartFilterBarTypesPage.theErrorDialogIsOpen();

				// Act - close the error dialog
				When.onTheSmartFilterBarTypesPage.waitFor({
					controlType: "sap.m.Button",
					actions: new Press(),
					searchOpenDialogs: true
				});

				// Assert
				Then.onTheSmartFilterBarTypesPage.waitFor({
					id: sFilterId + oField.name ,
					success: function (oInput) {
						Opa5.assert.strictEqual(oInput.getValueState(), ValueState.Error, "Value state should be error");
						Opa5.assert.strictEqual(oInput.getValueStateText(), oRB.getText("VALUELIST_NOT_UNIQUE_ERROR"), "Value state text is correct");
					}
				});

				// Cleanup
				When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
			});
		});

		[
			{
				name: "NUMC_SINGLE_TextOnly_FIXED"
			},
			{
				name: "STRING_SINGLE_TextOnly_FIXED"
			}
		].forEach(function (oField) {
			opaTest("Invalid entries matching id in " + oField.name + " filter", function (Given, When, Then) {
				var sFilterId = "smartFilterBar-filterItemControlA_-";

				//Arrange
				Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

				// Act
				// select an invalid value which corresponds to 1 id,
				// throws validation error in combo
				When.onTheSmartFilterBarTypesPage.iEnterStringInFiled(sFilterId + oField.name, "2");
				When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

				// Assert - Dialog with the correct error message is open
				Then.onTheSmartFilterBarTypesPage.theErrorDialogIsOpen();

				// Act - close the error dialog
				When.onTheSmartFilterBarTypesPage.waitFor({
					controlType: "sap.m.Button",
					actions: new Press(),
					searchOpenDialogs: true
				});

				// Assert
				Then.onTheSmartFilterBarTypesPage.waitFor({
					id: sFilterId + oField.name,
					success: function (oComboBox) {
						Opa5.assert.strictEqual(oComboBox.getValueState(), ValueState.Error, "Value state should be error");
						Opa5.assert.strictEqual(oComboBox.getValueStateText(), oRB.getText("FILTER_BAR_FIELD_ERROR"), "Value state text is correct");
					}
				});

				// Cleanup
				When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
			});
		});

		QUnit.module("Empty for strings");

		opaTest("Empty operation for STRING_AUTO - include and exclude", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_AUTO", "<empty>");
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("(STRING_AUTO eq '' or STRING_AUTO eq null)");

			// Act
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_AUTO", "!(<empty>)", "Field not found");
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("(STRING_AUTO eq '' or STRING_AUTO eq null) and (STRING_AUTO ne '' and STRING_AUTO ne null)");

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
		});

		opaTest("Empty operation for STRING_AUTO with nullable=false - include and exclude", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_AUTO_NOT_NULLABLE", "<empty>");
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("STRING_AUTO_NOT_NULLABLE eq ''");

			// Act
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_AUTO_NOT_NULLABLE", "!(<empty>)", "Field not found");
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("STRING_AUTO_NOT_NULLABLE eq '' and STRING_AUTO_NOT_NULLABLE ne ''");

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
		});

		QUnit.module("Empty for dates");

		opaTest("Empty operation for STRINGDATE_AUTO - include and exclude", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheSmartFilterBarTypesPage.iOpenTheVHD("smartFilterBar-filterItemControlStringDate.Group-STRINGDATE_AUTO");

			When.onTheSmartFilterBarTypesPage.iSelectOperation("Empty");
			When.onTheSmartFilterBarTypesPage.iPressTheFilterAddButton();
			When.onTheSmartFilterBarTypesPage.iSelectOperation("NotEmpty", true);

			When.onTheSmartFilterBarTypesPage.iPressTheVHDOKButton();
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("(STRINGDATE_AUTO eq '' or STRINGDATE_AUTO eq null) and (STRINGDATE_AUTO ne '' and STRINGDATE_AUTO ne null)");

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
		});

		opaTest("Empty operation for STRINGDATE_AUTO auto nullable=false - include and exclude", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheSmartFilterBarTypesPage.iOpenTheVHD("smartFilterBar-filterItemControlA_-STRINGDATE_AUTO_NOT_NULLABLE");

			When.onTheSmartFilterBarTypesPage.iSelectOperation("Empty");
			When.onTheSmartFilterBarTypesPage.iPressTheFilterAddButton();
			When.onTheSmartFilterBarTypesPage.iSelectOperation("NotEmpty", true);

			When.onTheSmartFilterBarTypesPage.iPressTheVHDOKButton();
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("STRINGDATE_AUTO_NOT_NULLABLE eq '' and STRINGDATE_AUTO_NOT_NULLABLE ne ''");

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
		});

		[
			{
				name: "DATE_AUTO",
				controlId: "smartFilterBar-filterItemControlDate.Group-DATE_AUTO",
				expected: "DATE_AUTO eq null and DATE_AUTO ne null"
			},
			{
				name: "DTOFFSET_AUTO",
				controlId: "smartFilterBar-filterItemControlDTOffset.Group-DTOFFSET_AUTO",
				expected: "DTOFFSET_AUTO eq null and DTOFFSET_AUTO ne null"
			},
			{
				name: "DATETIME_AUTO",
				controlId: "smartFilterBar-filterItemControlA_-DATETIME_AUTO",
				expected: "DATETIME_AUTO eq null and DATETIME_AUTO ne null"
			}
		].forEach(function (oField) {
			opaTest("Empty operation for " + oField.name + " - include and exclude", function (Given, When, Then) {
				// Arrange
				Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

				// Act
				When.onTheSmartFilterBarTypesPage.iOpenTheVHD(oField.controlId);

				When.onTheSmartFilterBarTypesPage.iSelectOperation("Empty");
				When.onTheSmartFilterBarTypesPage.iPressTheFilterAddButton();
				When.onTheSmartFilterBarTypesPage.iSelectOperation("NotEmpty", true);

				When.onTheSmartFilterBarTypesPage.iPressTheVHDOKButton();
				When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

				// Assert
				Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch(oField.expected);

				// Cleanup
				When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
			});
		});

		opaTest("No empty operation for DATE_AUTO, DATETIME_AUTO and DTOFFSET_AUTO - include and exclude", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act - DATE_AUTO
			When.onTheSmartFilterBarTypesPage.iOpenTheVHD("smartFilterBar-filterItemControlDate.Group-DATE_AUTO_NOT_NULLABLE");

			// Assert
			Then.onTheSmartFilterBarTypesPage.thereIsNoEmptyOperation("DATE_AUTO_NOT_NULLABLE");
			Then.onTheSmartFilterBarTypesPage.thereIsNoEmptyOperation("DATE_AUTO_NOT_NULLABLE", true);

			// Arrange
			When.onTheSmartFilterBarTypesPage.iPressTheVHDOKButton();

			// Act - DATETIME_AUTO
			When.onTheSmartFilterBarTypesPage.iOpenTheVHD("smartFilterBar-filterItemControlA_-DATETIME_AUTO_NOT_NULLABLE");

			// Assert
			Then.onTheSmartFilterBarTypesPage.thereIsNoEmptyOperation("DATETIME_AUTO_NOT_NULLABLE");
			Then.onTheSmartFilterBarTypesPage.thereIsNoEmptyOperation("DATETIME_AUTO_NOT_NULLABLE", true);

			// Arrange
			When.onTheSmartFilterBarTypesPage.iPressTheVHDOKButton();

			// Act - DTOFFSET_AUTO
			When.onTheSmartFilterBarTypesPage.iOpenTheVHD("smartFilterBar-filterItemControlDTOffset.Group-DTOFFSET_AUTO_NOT_NULLABLE");

			// Assert
			Then.onTheSmartFilterBarTypesPage.thereIsNoEmptyOperation("DTOFFSET_AUTO_NOT_NULLABLE");
			Then.onTheSmartFilterBarTypesPage.thereIsNoEmptyOperation("DTOFFSET_AUTO_NOT_NULLABLE", true);

			// Arrange
			When.onTheSmartFilterBarTypesPage.iPressTheVHDOKButton();

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();

			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.start();
	});
});
