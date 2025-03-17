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

	["Date", "Date Time Offset"].forEach(function (sField) {
		opaTest(sField + " nullable - include and exclude operations", function(Given, When, Then) {
			//Arrangements
			Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestFiltering/start.html"));
			var sFieldId = sField.split(" ").join("") + "Nullable";

			//Actions
			When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
			When.iAddFilter(sField + " nullable");
			When.iOpenTheVHD("FilterPanel-filterItemControlA_-applicationUnderTestFiltering---IDView--IDSmartTable-" + sFieldId);
			When.iNavigateToTheDefineConditionsTab();
			When.iChangeTheCondition("empty");
			When.iPressTheFilterAddButton();
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
								"sPath": sFieldId,
								"sOperator": "NE",
								"oValue1": null,
								"_bMultiFilter": false
							}
						],
						"bAnd": true,
						"_bMultiFilter": true
					},
					{
						"sPath": sFieldId,
						"sOperator": "EQ",
						"oValue1": null,
						"_bMultiFilter": false
					}
				]
			);
		});

		opaTest(sField + " - no empty operation should be available", function(Given, When, Then) {
			//Actions
			When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
			When.iAddFilter(sField);
			When.iOpenTheVHD("FilterPanel-filterItemControlA_-applicationUnderTestFiltering---IDView--IDSmartTable-" + sField.split(" ").join(""));
			When.iNavigateToTheDefineConditionsTab();
			// When.iChangeTheFilterField(sField);

			//Assertions
			Then.iShouldSeeNoEmptyOperation();

			//Actions - cleanup for the next test
			When.iPressOkButton();

			//Cleanup
			Then.iTeardownMyAppFrame();
		});
	});

	opaTest("StringDate nullable - include and exclude operations", function(Given, When, Then) {
		//Arrangements
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestFiltering/start.html"));

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iAddFilter("String date nullable");
		When.iOpenTheVHD("FilterPanel-filterItemControlA_-applicationUnderTestFiltering---IDView--IDSmartTable-StringDateNullable");
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
							"sPath": "StringDateNullable",
							"sOperator": "NE",
							"oValue1": "",
							"_bMultiFilter": false
						},
						{
							"sPath": "StringDateNullable",
							"sOperator": "NE",
							"oValue1": null,
							"_bMultiFilter": false
						}
					],
					"bAnd": true,
					"_bMultiFilter": true
				},
				{
					"sPath": "StringDateNullable",
					"sOperator": "EQ",
					"oValue1": "",
					"_bMultiFilter": false
				},
				{
					"sPath": "StringDateNullable",
					"sOperator": "EQ",
					"oValue1": null,
					"_bMultiFilter": false
				}
			]
		);

		//Cleanup
		Then.iTeardownMyAppFrame();
	});

	opaTest("StringDate - include and exclude operations", function(Given, When, Then) {

		//Arrangements
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestFiltering/start.html"));

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iAddFilter("String date");
		When.iOpenTheVHD("FilterPanel-filterItemControlA_-applicationUnderTestFiltering---IDView--IDSmartTable-StringDate");
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
							"sPath": "StringDate",
							"sOperator": "NE",
							"oValue1": "",
							"_bMultiFilter": false
						}
					],
					"bAnd": true,
					"_bMultiFilter": true
				},
				{
					"sPath": "StringDate",
					"sOperator": "EQ",
					"oValue1": "",
					"_bMultiFilter": false
				}
			]
		);
		//Cleanup
		Then.iTeardownMyAppFrame();
	});

	opaTest("Date Custom - include and exclude operations", function(Given, When, Then) {
		//Arrangements
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestFiltering/start.html"));

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iAddFilter("Date Custom");
		When.iOpenTheVHD("FilterPanel-filterItemControlA_-applicationUnderTestFiltering---IDView--IDSmartTable-DateCustomDateCustom");
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
							"sPath": "DateCustom",
							"sOperator": "NE",
							"oValue1": null,
							"_bMultiFilter": false
						}
					],
					"bAnd": true,
					"_bMultiFilter": true
				},
				{
					"sPath": "DateCustom",
					"sOperator": "EQ",
					"oValue1": null,
					"_bMultiFilter": false
				}
			]
		);

		//Cleanup
		Then.iTeardownMyAppFrame();
	});
});
