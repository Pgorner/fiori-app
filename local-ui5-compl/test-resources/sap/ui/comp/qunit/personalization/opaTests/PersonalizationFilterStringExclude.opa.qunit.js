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
		viewNamespace: "view."
	});

	opaTest("When adding a exclude Filter for 'Category' using 'empty' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Arrangements
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestFiltering/start.html"));

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iAddFilter("Category");
		When.iOpenTheVHD(sFilterIdPrefix + "Category");
		When.iNavigateToTheDefineConditionsTab();
		When.iChangeTheCondition("not empty");
		When.iPressTheVHDOKButton();
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'EQ' (empty)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"aFilters": [
						{
							"sPath": "Category",
							"sOperator": "NE",
							"oValue1": "",
							"_bMultiFilter": false
						}
					],
					"bAnd": true,
					"_bMultiFilter": true
				}
			]
		);
	});

	opaTest("When adding a exclude Filter for 'Category' using 'equal to' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iOpenTheVHD(sFilterIdPrefix + "Category");
		When.iNavigateToTheDefineConditionsTab();
		When.iChangeTheCondition("not equal to");
		When.iEnterTextInInput("Value", "1");
		When.iPressTheVHDOKButton();
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'EQ' (empty)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"aFilters": [
						{
							"sPath": "Category",
							"sOperator": "NE",
							"oValue1": "1",
							"oValue2": null,
							"_bMultiFilter": false
						}
					],
					"bAnd": true,
					"_bMultiFilter": true
				}
			]
		);
	});

	opaTest("When adding a exclude Filter for 'Category nullable' using 'empty' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iPressOnButtonWithIcon('sap-icon://decline');
		When.iAddFilter("Category nullable");
		When.iOpenTheVHD(sFilterIdPrefix + "CategoryNullable");
		When.iNavigateToTheDefineConditionsTab();
		When.iChangeTheCondition("not empty");
		When.iPressTheVHDOKButton();
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'EQ' (empty)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"aFilters": [
						{
							"sPath": "CategoryNullable",
							"sOperator": "NE",
							"oValue1": "",
							"_bMultiFilter": false
						},
						{
							"sPath": "CategoryNullable",
							"sOperator": "NE",
							"oValue1": null,
							"_bMultiFilter": false
						}
					],
					"bAnd": true,
					"_bMultiFilter": true
				}
			]
		);
		//Cleanup
		Then.iTeardownMyAppFrame();
	});
});
