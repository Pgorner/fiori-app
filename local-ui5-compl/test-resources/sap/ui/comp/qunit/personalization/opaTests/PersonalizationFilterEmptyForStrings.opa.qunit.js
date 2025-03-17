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

	Opa5.extendConfig({
		autoWait:true,
		arrangements: new Arrangement(),
		actions: new Action(),
		assertions: new Assertion(),
		viewNamespace: "view."
	});

	opaTest("String Custom Column nullable - include and exclude operations", function(Given, When, Then) {
		//Arrangements
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestFiltering/start.html"));

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iAddFilter("String Custom Nullable");
		When.iOpenTheVHD("FilterPanel-filterItemControlA_-applicationUnderTestFiltering---IDView--IDSmartTable-StringCustomNullableStringCustomNullable");
		When.iNavigateToTheDefineConditionsTab();
		When.iChangeTheCondition("empty");
		When.iPressTheFilterAddButton();
		// return;
		When.iChangeTheCondition("not empty", 1);
		When.iPressTheVHDOKButton();
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'EQ' (empty)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"aFilters": [
						{
							"sPath": "StringCustomNullable",
							"sOperator": "NE",
							"oValue1": "",
							"_bMultiFilter": false
						},
						{
							"sPath": "StringCustomNullable",
							"sOperator": "NE",
							"oValue1": null,
							"_bMultiFilter": false
						}
					],
					"bAnd": true,
					"_bMultiFilter": true
				},
				{
					"sPath": "StringCustomNullable",
					"sOperator": "EQ",
					"oValue1": "",
					"_bMultiFilter": false
				},
				{
					"sPath": "StringCustomNullable",
					"sOperator": "EQ",
					"oValue1": null,
					"_bMultiFilter": false
				}
			]
		);

		//Cleanup
		Then.iTeardownMyAppFrame();
	});

	opaTest("String Custom column - include and exclude operations", function(Given, When, Then) {

		//Arrangements
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestFiltering/start.html"));

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iAddFilter("String Custom");
		When.iOpenTheVHD("FilterPanel-filterItemControlA_-applicationUnderTestFiltering---IDView--IDSmartTable-StringCustomStringCustom");
		When.iNavigateToTheDefineConditionsTab();
		When.iChangeTheCondition("empty");
		When.iPressTheFilterAddButton();
		// return;
		When.iChangeTheCondition("not empty", 1);
		When.iPressTheVHDOKButton();
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'EQ' (empty)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"aFilters": [
						{
							"sPath": "StringCustom",
							"sOperator": "NE",
							"oValue1": "",
							"_bMultiFilter": false
						}
					],
					"bAnd": true,
					"_bMultiFilter": true
				},
				{
					"sPath": "StringCustom",
					"sOperator": "EQ",
					"oValue1": "",
					"_bMultiFilter": false
				}
			]
		);
		//Cleanup
		Then.iTeardownMyAppFrame();
	});
});
