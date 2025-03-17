/* global QUnit */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/m/library",
	"sap/ui/core/library",
	"test-resources/sap/ui/comp/testutils/opa/TestLibrary"
], function (
	Opa5,
	opaTest,
	mLibrary,
	coreLibrary
) {
	"use strict";
	var	P13nConditionOperation = mLibrary.P13nConditionOperation,
		ValueState = coreLibrary.ValueState;

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

		QUnit.module("SearchExpression");

		opaTest("Operations", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheSmartFilterBarTypesPage.iOpenTheVHD("smartFilterBar-filterItemControlA_-STRING_SEARCH_EXPRESSION");
			When.onTheSmartFilterBarTypesPage.iNavigateToTheDefineConditionsTab();

			// Assert
			Then.onTheSmartFilterBarTypesPage.iShouldSeeFollowingConditions([
													P13nConditionOperation.Contains,
													P13nConditionOperation.StartsWith,
													P13nConditionOperation.EndsWith,
													P13nConditionOperation.NotContains,
													P13nConditionOperation.NotStartsWith,
													P13nConditionOperation.NotEndsWith
												]);

			// Cleanup
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("Default operation", function (Given, When, Then) {
			var aExpectedFilters;

			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			[
				"*test*", // Contains
				"=test", // Equal To
				"starts...ends", // Between
				"test*", // Starts With
				"*test", // Ends With
				"<test", // Less Than
				"<=test", // Less Than or Equal To
				">test", // Greater Than
				">=test", // Greater Than or Equal To
				"<empty>" // Empty
			].forEach(function (sToken) {
				When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_SEARCH_EXPRESSION", sToken);
			});

			// Assert
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			// All the unsupported operations should be paresed as "Contains" operation.
			aExpectedFilters = [
				"substringof('test',STRING_SEARCH_EXPRESSION)", // Contains
				"substringof('=test',STRING_SEARCH_EXPRESSION)", // Contains
				"substringof('starts...ends',STRING_SEARCH_EXPRESSION)", // Contains
				"startswith(STRING_SEARCH_EXPRESSION,'test')", // Starts With
				"endswith(STRING_SEARCH_EXPRESSION,'test')", // Ends With
				"substringof('<test',STRING_SEARCH_EXPRESSION)", // Contains
				"substringof('<=test',STRING_SEARCH_EXPRESSION)", // Contains
				"substringof('>test',STRING_SEARCH_EXPRESSION)", // Contains
				"substringof('>=test',STRING_SEARCH_EXPRESSION)", // Contains
				"substringof('<empty>',STRING_SEARCH_EXPRESSION)" // Contains
			];

			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch(aExpectedFilters.join(" or "));

			// Cleanup
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("Fixed list ValueList single filter select with popover TextArrangement", function (Given, When, Then) {
			var sControlId = "smartFilterBar-filterItemControlA_-STRING_SINGLE_VLTX_FL";

			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheSmartFilterBarTypesPage.iSelectItemFromComboBox(sControlId, "Key 0001 (0001)");

			// Assert
			Then.onTheSmartFilterBarTypesPage.theComboBoxValueShouldMatch(sControlId, "0001 (Key 0001)");

			// Act
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("STRING_SINGLE_VLTX_FL eq '0001'");

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();

			Given.onTheCompTestLibrary.iStopMyApp();

		});

		opaTest("Fixed list ValueList single filter select with no TextArrangement configuration", function (Given, When, Then) {
			var sControlId = "smartFilterBar-filterItemControlA_-STRING_SINGLE_VLTX_FL_DEFAULT";

			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheSmartFilterBarTypesPage.iSelectItemFromComboBox(sControlId, "Key 1 (1)");

			// Assert
			Then.onTheSmartFilterBarTypesPage.theComboBoxValueShouldMatch(sControlId, "Key 1 (1)");

			// Act
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("STRING_SINGLE_VLTX_FL_DEFAULT eq '1'");

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();

			Given.onTheCompTestLibrary.iStopMyApp();

		});

		opaTest("Standard ValueList single filter select with popover TextArrangement", function (Given, When, Then) {
			var sControlId = "smartFilterBar-filterItemControlA_-STRING_SINGLE_VLTX";

			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheSmartFilterBarTypesPage.iOpenTheVHD(sControlId);
			When.onTheSmartFilterBarTypesPage.iSelectRowsFromVHD(sControlId, ["Key 0001 (0001)"]);

			// Assert
			Then.onTheSmartFilterBarTypesPage.theInputValueShouldMatch(sControlId, "0001 (Key 0001)");

			// Act
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("STRING_SINGLE_VLTX eq '0001'");

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();

			Given.onTheCompTestLibrary.iStopMyApp();

		});

		opaTest("Fixed-list ValueList multiple filter select with popover TextArrangement", function (Given, When, Then) {
			var sControlId = "smartFilterBar-filterItemControlA_-STRING_MULTIPLE_VLTX_FL";

			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Act
			When.onTheSmartFilterBarTypesPage.iSelectItemsFromMultiComboBox(sControlId, ["Key 0001 (0001)", "Key 0002 (0002)"]);

			// Assert
			Then.onTheSmartFilterBarTypesPage.theMultiComboBoxTokensShouldMatch(sControlId, ["0001 (Key 0001)", "0002 (Key 0002)"]);

			// Act
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("STRING_MULTIPLE_VLTX_FL eq '0001' or STRING_MULTIPLE_VLTX_FL eq '0002'");

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();

			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("Fixed-list ValueList multiple filter select with no TextArrangement configuration", function (Given, When, Then) {
			var sControlId = "smartFilterBar-filterItemControlA_-STRING_MULTIPLE_VLTX_FL_DEFAULT";

			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Act
			When.onTheSmartFilterBarTypesPage.iSelectItemsFromMultiComboBox(sControlId, ["Key 1 (1)", "Key 2 (2)"]);

			// Assert
			Then.onTheSmartFilterBarTypesPage.theMultiComboBoxTokensShouldMatch(sControlId, ["Key 1 (1)", "Key 2 (2)"]);

			// Act
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("STRING_MULTIPLE_VLTX_FL_DEFAULT eq '1' or STRING_MULTIPLE_VLTX_FL_DEFAULT eq '2'");

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();

			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("Standard ValueList multiple filter select with popover TextArrangement", function (Given, When, Then) {
			var sControlId = "smartFilterBar-filterItemControlA_-STRING_MULTIPLE_VLTX";

			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheSmartFilterBarTypesPage.iOpenTheVHD(sControlId);
			When.onTheSmartFilterBarTypesPage.iSelectRowsFromVHD(sControlId, ["Key 0001 (0001)", "Key 0002 (0002)"]);
			When.onTheSmartFilterBarTypesPage.iPressTheVHDOK(sControlId);

			// Assert
			Then.onTheSmartFilterBarTypesPage.theMultiInputTokensShouldMatch(sControlId, ["0001 (Key 0001)", "0002 (Key 0002)"]);

			// Act
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("STRING_MULTIPLE_VLTX eq '0001' or STRING_MULTIPLE_VLTX eq '0002'");

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();

			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("Standard ValueList multiple filter select with no Text and TextArrangement configuration", function (Given, When, Then) {
			var sControlId = "smartFilterBar-filterItemControlA_-STRING_MULTIPLE_VL";

			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheSmartFilterBarTypesPage.iOpenTheVHD(sControlId);
			When.onTheSmartFilterBarTypesPage.iSelectRowsFromVHD(sControlId, ["0001", "0002"]);

			// Assert
			Then.onTheSmartFilterBarTypesPage.theValueHelpDialogTokensShouldMatch(sControlId, ["0001", "0002"]);

			// Act
			When.onTheSmartFilterBarTypesPage.iPressTheVHDOK(sControlId);

			// Assert
			Then.onTheSmartFilterBarTypesPage.theMultiInputTokensShouldMatch(sControlId, ["0001", "0002"]);

			// Act
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("STRING_MULTIPLE_VL eq '0001' or STRING_MULTIPLE_VL eq '0002'");

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();

			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("Fixed-list ValueList multiple filter select with no Text and TextArrangement configuration", function (Given, When, Then) {
			var sControlId = "smartFilterBar-filterItemControlA_-STRING_MULTIPLE_VL_FL";

			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Act
			When.onTheSmartFilterBarTypesPage.iSelectItemsFromMultiComboBox(sControlId, ["0001", "0002"]);

			// Assert
			Then.onTheSmartFilterBarTypesPage.theMultiComboBoxTokensShouldMatch(sControlId, ["0001", "0002"]);

			// Act
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("STRING_MULTIPLE_VL_FL eq '0001' or STRING_MULTIPLE_VL_FL eq '0002'");

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();

			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.module("Validation");

		opaTest("The filter error state should get cleared if a valid key is set through ValueList Out parameter", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Act
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_SINGLE_VLTX_FL", "dddd");

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFilterValueStateShouldMatch("smartFilterBar-filterItemControlA_-STRING_SINGLE_VLTX_FL", ValueState.Error);

			//Act
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_INOUT", "2");

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFilterValueStateShouldMatch("smartFilterBar-filterItemControlA_-STRING_SINGLE_VLTX_FL", ValueState.None);


			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("Filter values in Error state should not be propagated back from AdaptFilter dialog", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Actions
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled( "__xmlview0--smartFilterBar-filterItemControlA_-STRING_SINGLE", "sfsdfsdfsdfsdf", "", false);
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled( "__xmlview0--smartFilterBar-filterItemControlA_-STRING_MULTIPLE", "sfsdfsdfsdfsdf", "", false);
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled( "__xmlview0--dateSelectTo", "sfsdfsdfsdfsdf", "", false);

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFilterValueStateShouldMatch("smartFilterBar-filterItemControlA_-STRING_SINGLE", ValueState.Error);
			Then.onTheSmartFilterBarTypesPage.theFilterValueStateShouldMatch("smartFilterBar-filterItemControlA_-STRING_MULTIPLE", ValueState.Error);
			Then.onTheSmartFilterBarTypesPage.theFilterValueStateShouldMatch("__xmlview0--dateSelectTo", ValueState.Error);

			// Actions
			When.onTheSmartFilterBarTypesPage.iOpenTheAdaptFiltersDialog();
			When.onTheSmartFilterBarTypesPage.iSwitchAdaptFiltersToGroupView();
			When.onTheSmartFilterBarTypesPage.iExpandAdaptFiltersGroup("ZEPM_C_SALESORDERITEMQUERYResults");

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFilterValueStateShouldMatch("smartFilterBar-filterItemControlA_-STRING_SINGLE", ValueState.Error);
			Then.onTheSmartFilterBarTypesPage.theFilterValueStateShouldMatch("smartFilterBar-filterItemControlA_-STRING_MULTIPLE", ValueState.Error);
			Then.onTheSmartFilterBarTypesPage.theFilterValueStateShouldMatch("__xmlview0--dateSelectTo", ValueState.Error);
			Then.onTheSmartFilterBarTypesPage.theInputValueShouldMatch("smartFilterBar-filterItemControlA_-STRING_SINGLE", "sfsdfsdfsdfsdf");
			Then.onTheSmartFilterBarTypesPage.theInputValueShouldMatch("smartFilterBar-filterItemControlA_-STRING_MULTIPLE", "sfsdfsdfsdfsdf");
			Then.onTheSmartFilterBarTypesPage.theInputValueShouldMatch("__xmlview0--dateSelectTo", "sfsdfsdfsdfsdf");

			// Actions
			When.onTheSmartFilterBarTypesPage.iPressTheAdaptFiltersOKButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFilterValueStateShouldMatch("smartFilterBar-filterItemControlA_-STRING_SINGLE", ValueState.None);
			Then.onTheSmartFilterBarTypesPage.theFilterValueStateShouldMatch("smartFilterBar-filterItemControlA_-STRING_MULTIPLE", ValueState.None);
			Then.onTheSmartFilterBarTypesPage.theFilterValueStateShouldMatch("__xmlview0--dateSelectTo", ValueState.None);
			Then.onTheSmartFilterBarTypesPage.theInputValueShouldMatch("smartFilterBar-filterItemControlA_-STRING_SINGLE", "");
			Then.onTheSmartFilterBarTypesPage.theInputValueShouldMatch("smartFilterBar-filterItemControlA_-STRING_MULTIPLE", "");
			Then.onTheSmartFilterBarTypesPage.theInputValueShouldMatch("__xmlview0--dateSelectTo", "");

			// Cleanup
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("Filter values in Error state should be propagated back from AdaptFilter dialog when Cancel button is pressed", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Actions
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled( "__xmlview0--smartFilterBar-filterItemControlA_-STRING_SINGLE", "sfsdfsdfsdfsdf", "", false);
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled( "__xmlview0--smartFilterBar-filterItemControlA_-STRING_MULTIPLE", "sfsdfsdfsdfsdf", "", false);

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFilterValueStateShouldMatch("smartFilterBar-filterItemControlA_-STRING_SINGLE", ValueState.Error);
			Then.onTheSmartFilterBarTypesPage.theFilterValueStateShouldMatch("smartFilterBar-filterItemControlA_-STRING_MULTIPLE", ValueState.Error);

			// Actions
			When.onTheSmartFilterBarTypesPage.iOpenTheAdaptFiltersDialog();
			When.onTheSmartFilterBarTypesPage.iSwitchAdaptFiltersToGroupView();
			When.onTheSmartFilterBarTypesPage.iExpandAdaptFiltersGroup("ZEPM_C_SALESORDERITEMQUERYResults");

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFilterValueStateShouldMatch("smartFilterBar-filterItemControlA_-STRING_SINGLE", ValueState.Error);
			Then.onTheSmartFilterBarTypesPage.theFilterValueStateShouldMatch("smartFilterBar-filterItemControlA_-STRING_MULTIPLE", ValueState.Error);
			Then.onTheSmartFilterBarTypesPage.theInputValueShouldMatch("smartFilterBar-filterItemControlA_-STRING_SINGLE", "sfsdfsdfsdfsdf");
			Then.onTheSmartFilterBarTypesPage.theInputValueShouldMatch("smartFilterBar-filterItemControlA_-STRING_MULTIPLE", "sfsdfsdfsdfsdf");

			// Actions
			When.onTheSmartFilterBarTypesPage.iPressTheAdaptFiltersCancelButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFilterValueStateShouldMatch("smartFilterBar-filterItemControlA_-STRING_SINGLE", ValueState.Error);
			Then.onTheSmartFilterBarTypesPage.theFilterValueStateShouldMatch("smartFilterBar-filterItemControlA_-STRING_MULTIPLE", ValueState.Error);
			Then.onTheSmartFilterBarTypesPage.theInputValueShouldMatch("smartFilterBar-filterItemControlA_-STRING_SINGLE", "sfsdfsdfsdfsdf");
			Then.onTheSmartFilterBarTypesPage.theInputValueShouldMatch("smartFilterBar-filterItemControlA_-STRING_MULTIPLE", "sfsdfsdfsdfsdf");

			// Cleanup
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("Validation of ComboBox selectedKey should be skipped if ControlConfiguration hasValidation is set to false", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Actions
			When.onTheSmartFilterBarTypesPage.iSetFilterData( "__xmlview0--smartFilterBar", {
				"ComboBoxNoItemsValidation": "1000",
				"$Parameter.P_ComboBoxNoItemsValidation": "1000"
			});
			// Act
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("ComboBoxNoItemsValidation eq '1000'");
			Then.onTheSmartFilterBarTypesPage.theParameterShouldMatch("P_ComboBoxNoItemsValidation='1000')");

			// Cleanup
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("NUMC field should send the correct value for <Empty> operator", function (Given, When, Then) {
			var sControlId = "smartFilterBar-filterItemControlA_-NUMC_AUTO";

			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheSmartFilterBarTypesPage.iOpenTheVHD(sControlId);
			When.onTheSmartFilterBarTypesPage.iOpenTheDropdown();
			When.onTheSmartFilterBarTypesPage.iChangeTheCondition("empty", false);

			// Assert
			Then.onTheSmartFilterBarTypesPage.theValueHelpDialogTokensShouldMatch(sControlId, ["<empty>"]);

			// Act
			When.onTheSmartFilterBarTypesPage.iPressTheVHDOK(sControlId);
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("NUMC_AUTO eq '0'");

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();

			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("NUMC field should send the correct value for !<Empty> operator", function (Given, When, Then) {
			var sControlId = "smartFilterBar-filterItemControlA_-NUMC_AUTO";

			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheSmartFilterBarTypesPage.iOpenTheVHD(sControlId);
			When.onTheSmartFilterBarTypesPage.iOpenTheDropdown();
			When.onTheSmartFilterBarTypesPage.iChangeTheCondition("not empty", true);

			// Assert
			Then.onTheSmartFilterBarTypesPage.theValueHelpDialogTokensShouldMatch(sControlId, ["!(<empty>)"]);

			// Act
			When.onTheSmartFilterBarTypesPage.iPressTheVHDOK(sControlId);
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("NUMC_AUTO ne '0'");

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();

			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("Field with Edm.Guid should send the correct value for <Empty> operator", function (Given, When, Then) {
			var sControlId = '__xmlview0--smartFilterBar-filterItemControlA_-ObjectUUID1';

			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheSmartFilterBarTypesPage.iOpenTheVHD(sControlId);
			When.onTheSmartFilterBarTypesPage.iNavigateToTheDefineConditionsTab();
			When.onTheSmartFilterBarTypesPage.iOpenTheDropdown();
			When.onTheSmartFilterBarTypesPage.iChangeTheCondition("empty", false);

			// Assert
			Then.onTheSmartFilterBarTypesPage.theValueHelpDialogTokensShouldMatch(sControlId, ["<empty>"]);

			// Act
			When.onTheSmartFilterBarTypesPage.iPressTheVHDOK(sControlId);
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("(ObjectUUID1 eq guid'00000000-0000-0000-0000-000000000000' or ObjectUUID1 eq null)");

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();

			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("Field with Edm.Guid should send the correct value for !<Empty> operator", function (Given, When, Then) {
			var sControlId = '__xmlview0--smartFilterBar-filterItemControlA_-ObjectUUID1';

			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheSmartFilterBarTypesPage.iOpenTheVHD(sControlId);
			When.onTheSmartFilterBarTypesPage.iNavigateToTheDefineConditionsTab();
			When.onTheSmartFilterBarTypesPage.iOpenTheDropdown();
			When.onTheSmartFilterBarTypesPage.iChangeTheCondition("not empty", true);

			// Assert
			Then.onTheSmartFilterBarTypesPage.theValueHelpDialogTokensShouldMatch(sControlId, ["!(<empty>)"]);

			// Act
			When.onTheSmartFilterBarTypesPage.iPressTheVHDOK(sControlId);
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("(ObjectUUID1 ne guid'00000000-0000-0000-0000-000000000000' and ObjectUUID1 ne null)");

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();

			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("The SmartFilterBar search should get triggered even if there are ComboBox filters with no Items", function (Given, When, Then) {

			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Assert
			Then.onTheSmartFilterBarTypesPage.iShouldSeeAFilterControl("__xmlview0--smartFilterBar-filterItemControlA_-ComboBoxNoItems", true);

			// Act
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theRequestURLShouldMatch("/ZEPM_C_SALESORDERITEMQUERY(P_Int=90,P_KeyDate=datetime'2018-12-01T00:00:00',P_DisplayCurrency='EUR',P_Bukrs='0001',P_Time=time'PT12H34M56S',P_Optional='',P_ComboBoxNoItemsValidation='0001')/Results");

			// Cleanup
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("Invalid mandatory custom ComboBox filter should not go to Error state on triggering search if it has customData:hasValue='true'" , function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFilterValueStateShouldMatch("customComboBox", ValueState.None);

			// Cleanup
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.start();
	});
});