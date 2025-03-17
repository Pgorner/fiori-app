sap.ui.define([
	'sap/ui/test/Opa5',
	'sap/ui/test/opaQunit',
	'./Arrangement',
	'./Action',
	'./Assertion'
], function (
	Opa5,
	opaTest,
	Arrangement,
	Action,
	Assertion
) {
	"use strict";

	var sFilterIdPrefix = "FilterPanel-filterItemControlA_-applicationUnderTestFiltering---IDView--IDSmartTable-";
	Opa5.extendConfig({
		autoWait:true,
		arrangements: new Arrangement(),
		actions: new Action(),
		assertions: new Assertion(),
		viewNamespace: "view.",
		asyncPolling: false
	});

	opaTest("String exclude operations", function(Given, When, Then) {
		// Arrangements
		var aConditions = [
				{operation: "does not contain", input1: "A"},
				{operation: "not equal to", input1: "B"},
				{operation: "not between", input1: "C", input2: "D"},
				{operation: "does not start with", input1: "E"},
				{operation: "does not end with", input1: "F"},
				{operation: "not less than", input1: "G"},
				{operation: "not less than or equal to", input1: "H"},
				{operation: "not greater than", input1: "I"},
				{operation: "not greater than or equal to", input1: "J"}
			],
			iCondition = 0;
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestFiltering/start.html"));

		// Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iAddFilter("Category");
		When.iOpenTheVHD(sFilterIdPrefix + "Category");
		When.iNavigateToTheDefineConditionsTab();

		aConditions.forEach(function (oCondition) {
			When.iChangeTheCondition(oCondition.operation, iCondition);
			When.iEnterTextInConditionField(iCondition, oCondition.input1, (oCondition.input2 ? oCondition.input2 : undefined));
			When.iPressTheFilterAddButton();
			iCondition++;
		});
		When.iPressTheVHDOKButton();
		When.iPressOkButton();

		// Assertions
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"aFilters": [
						{
							"sPath": "Category",
							"sOperator": "NotContains",
							"oValue1": "A",
							"oValue2": null,
							"_bMultiFilter": false
						},
						{
							"sPath": "Category",
							"sOperator": "NE",
							"oValue1": "B",
							"oValue2": null,
							"_bMultiFilter": false
						},
						{
							"sPath": "Category",
							"sOperator": "NB",
							"oValue1": "C",
							"oValue2": "D",
							"_bMultiFilter": false
						},
						{
							"sPath": "Category",
							"sOperator": "NotStartsWith",
							"oValue1": "E",
							"oValue2": null,
							"_bMultiFilter": false
						},
						{
							"sPath": "Category",
							"sOperator": "NotEndsWith",
							"oValue1": "F",
							"oValue2": null,
							"_bMultiFilter": false
						},
						{
							"sPath": "Category",
							"sOperator": "GE",
							"oValue1": "G",
							"oValue2": null,
							"_bMultiFilter": false
						},
						{
							"sPath": "Category",
							"sOperator": "GT",
							"oValue1": "H",
							"oValue2": null,
							"_bMultiFilter": false
						},
						{
							"sPath": "Category",
							"sOperator": "LE",
							"oValue1": "I",
							"oValue2": null,
							"_bMultiFilter": false
						},
						{
							"sPath": "Category",
							"sOperator": "LT",
							"oValue1": "J",
							"oValue2": null,
							"_bMultiFilter": false
						}
					],
					"bAnd": true,
					"_bMultiFilter": true
				}
			]
		);
		Then.iTeardownMyAppFrame();
	});

	opaTest("Number exclude operations", function(Given, When, Then) {
		// Arrangements
		var aConditions = [
				{operation: "not equal to", input1: "1"},
				{operation: "not between", input1: "2", input2: "3"},
				{operation: "not less than", input1: "4"},
				{operation: "not less than or equal to", input1: "5"},
				{operation: "not greater than", input1: "6"},
				{operation: "not greater than or equal to", input1: "7"}
			],
			iCondition = 0;
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestFiltering/start.html"));

		// Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iAddFilter("Number");
		When.iOpenTheVHD(sFilterIdPrefix + "Number");
		When.iNavigateToTheDefineConditionsTab();

		aConditions.forEach(function (oCondition) {
			When.iChangeTheCondition(oCondition.operation, iCondition);
			When.iEnterTextInConditionField(iCondition, oCondition.input1, (oCondition.input2 ? oCondition.input2 : undefined));
			When.iPressTheFilterAddButton();
			iCondition++;
		});

		When.iPressTheVHDOKButton();
		When.iPressOkButton();

		// Assertions
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"aFilters": [
						{
							"sPath": "Number",
							"sOperator": "NE",
							"oValue1": 1,
							"oValue2": null,
							"_bMultiFilter": false
						},
						{
							"sPath": "Number",
							"sOperator": "NB",
							"oValue1": 2,
							"oValue2": 3,
							"_bMultiFilter": false
						},
						{
							"sPath": "Number",
							"sOperator": "GE",
							"oValue1": 4,
							"oValue2": null,
							"_bMultiFilter": false
						},
						{
							"sPath": "Number",
							"sOperator": "GT",
							"oValue1": 5,
							"oValue2": null,
							"_bMultiFilter": false
						},
						{
							"sPath": "Number",
							"sOperator": "LE",
							"oValue1": 6,
							"oValue2": null,
							"_bMultiFilter": false
						},
						{
							"sPath": "Number",
							"sOperator": "LT",
							"oValue1": 7,
							"oValue2": null,
							"_bMultiFilter": false
						}
					],
					"bAnd": true,
					"_bMultiFilter": true
				}
			]
		);
		Then.iTeardownMyAppFrame();
	});

	opaTest("Other exclude operations by type", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestFiltering/start.html"));

		// Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();

		When.iAddFilter("Date");
		When.iOpenTheVHD(sFilterIdPrefix + "Date");
		When.iNavigateToTheDefineConditionsTab();

		//Assertions
		Then.iShouldSeeExcludeOperations([
			"not equal to",
			"not between",
			"not before",
			"not before or on",
			"not after",
			"not on or after"
		]);

		When.iPressTheVHDOKButton();

		// Date Time Offset
		When.iAddFilter("Date Time Offset");
		When.iOpenTheVHD(sFilterIdPrefix + "DateTimeOffset");
		When.iNavigateToTheDefineConditionsTab();

		//Assertions
		Then.iShouldSeeExcludeOperations([
			"not equal to",
			"not between",
			"not before",
			"not before or on",
			"not after",
			"not on or after"
		]);

		When.iPressTheVHDOKButton();

		// Height
		When.iAddFilter("Height");
		When.iOpenTheVHD(sFilterIdPrefix + "Height");
		When.iNavigateToTheDefineConditionsTab();

		//Assertions
		Then.iShouldSeeExcludeOperations([
			"not equal to",
			"not between",
			"not less than",
			"not less than or equal to",
			"not greater than",
			"not greater than or equal to"
		]);

		When.iPressTheVHDOKButton();

		// My Boolean
		When.iAddFilter("My Boolean");
		When.iOpenTheVHD(sFilterIdPrefix + "MyBool");
		When.iNavigateToTheDefineConditionsTab();

		//Assertions
		Then.iShouldSeeDisabledOperationsDropdown();

		When.iPressTheVHDOKButton();

		// String date
		When.iAddFilter("String date");
		When.iOpenTheVHD(sFilterIdPrefix + "StringDate");
		When.iNavigateToTheDefineConditionsTab();

		//Assertions
		Then.iShouldSeeExcludeOperations([
			"not equal to",
			"not between",
			"not before",
			"not before or on",
			"not after",
			"not on or after",
			"not empty"
		]);

		When.iPressTheVHDOKButton();

		// Cleanup
		Then.iTeardownMyAppFrame();
	});
});
