sap.ui.define([
	'sap/ui/test/Opa5',
	'sap/ui/test/opaQunit',
	'./Arrangement',
	'./Action',
	'./Assertion',
	"sap/ui/core/library"
], function (
	Opa5,
	opaTest,
	Arrangement,
	Action,
	Assertion,
	CoreLibrary
) {
	"use strict";

	var sPriceFieldId = "FilterPanel-filterItemControlA_-applicationUnderTestFiltering---IDView--IDSmartTable-Price",
		ValueState = CoreLibrary.ValueState;

	Opa5.extendConfig({
		autoWait:true,
		arrangements: new Arrangement(),
		actions: new Action(),
		assertions: new Assertion(),
		viewNamespace: "view."
	});

	opaTest("When adding a Filter for 'Price' using 'equal to' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Arrangements
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestFiltering/start.html"));

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iAddFilter("Price");
		When.iOpenTheVHD(sPriceFieldId);
		When.iNavigateToTheDefineConditionsTab();
		When.iChangeTheCondition("equal to");
		When.iPressDeleteRowButton(1);
		When.iEnterTextInInput("Value", "123.456");
		When.iPressTheVHDOKButton();
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'GE' (on or after)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Price",
					"sOperator": "EQ",
					"oValue1": "123.456",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'Price' using 'less than' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iOpenTheVHD(sPriceFieldId);
		When.iNavigateToTheDefineConditionsTab();
		When.iChangeTheCondition("less than");
		When.iEnterTextInInput("Value", "1");
		When.iPressTheVHDOKButton();
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'LT' (less than)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Price",
					"sOperator": "LT",
					"oValue1": "1",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'Price' using 'less than or equal to' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iOpenTheVHD(sPriceFieldId);
		When.iNavigateToTheDefineConditionsTab();
		When.iChangeTheCondition("less than or equal to");
		When.iEnterTextInInput("Value", "1");
		When.iPressTheVHDOKButton();
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'LE' (less than or equal to)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Price",
					"sOperator": "LE",
					"oValue1": "1",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'Price' using 'greater than' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iOpenTheVHD(sPriceFieldId);
		When.iNavigateToTheDefineConditionsTab();
		When.iChangeTheCondition("greater than");
		When.iEnterTextInInput("Value", "1");
		When.iPressTheVHDOKButton();
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'GT' (greater than)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Price",
					"sOperator": "GT",
					"oValue1": "1",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'Price' using 'greater than or equal to' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iOpenTheVHD(sPriceFieldId);
		When.iNavigateToTheDefineConditionsTab();
		When.iChangeTheCondition("greater than or equal to");
		When.iEnterTextInInput("Value", "1");
		When.iPressTheVHDOKButton();
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'GE' (greater than or equal to)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Price",
					"sOperator": "GE",
					"oValue1": "1",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'Price' using 'between' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iOpenTheVHD(sPriceFieldId);
		When.iNavigateToTheDefineConditionsTab();
		When.iChangeTheCondition("between");
		When.iEnterTextInInput("from", "1");
		When.iEnterTextInInput("to", "5000");
		When.iPressTheVHDOKButton();
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'BT' (between)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Price",
					"sOperator": "BT",
					"oValue1": "1",
					"oValue2": "5000",
					"_bMultiFilter": false
				}
			]
		);

	});

	opaTest("When adding a Filter for 'Amount' in the SmartFilterBar if the currency is not set there should be warning", function(Given, When, Then) {
		// Action
		When.iEnterTextInFilterWithIdFocusable("applicationUnderTestFiltering---IDView--smartFilterBar-filterItemControlA_-Amount", "=123", false);

		// Assert
		Then.iCheckInputValueStateWithId("applicationUnderTestFiltering---IDView--smartFilterBar-filterItemControlA_-Amount", ValueState.Warning);

		// Action
		When.iEnterTextInFilterWithIdFocusable("applicationUnderTestFiltering---IDView--smartFilterBar-filterItemControlA_-Currency", "=USD", false);

		// Assert
		Then.iCheckInputValueStateWithId("applicationUnderTestFiltering---IDView--smartFilterBar-filterItemControlA_-Amount", ValueState.None);

		// Action
		When.iClearFilterValue("applicationUnderTestFiltering---IDView--smartFilterBar-filterItemControlA_-Currency");

		// Assert
		Then.iCheckInputValueStateWithId("applicationUnderTestFiltering---IDView--smartFilterBar-filterItemControlA_-Amount", ValueState.Warning);

	});

	opaTest("When adding a Filter for 'Amount' in the SmartTable if the currency is not set there should be warning", function(Given, When, Then) {
		// Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iAddFilter("Amount");
		When.iEnterTextInFilterWithIdFocusable("FilterPanel-filterItemControlA_-applicationUnderTestFiltering---IDView--IDSmartTable-Amount", "=123", false);

		// Assert
		Then.iCheckInputValueStateWithId("FilterPanel-filterItemControlA_-applicationUnderTestFiltering---IDView--IDSmartTable-Amount", ValueState.Warning);

		// Action
		When.iAddFilter("Currency");
		When.iEnterTextInFilterWithIdFocusable("FilterPanel-filterItemControlA_-applicationUnderTestFiltering---IDView--IDSmartTable-Currency", "=EUR", false);

		// Assert
		Then.iCheckInputValueStateWithId("FilterPanel-filterItemControlA_-applicationUnderTestFiltering---IDView--IDSmartTable-Amount", ValueState.None);

		// Action
		When.iClearFilterValue("FilterPanel-filterItemControlA_-applicationUnderTestFiltering---IDView--IDSmartTable-Currency");

		// Assert
		Then.iCheckInputValueStateWithId("FilterPanel-filterItemControlA_-applicationUnderTestFiltering---IDView--IDSmartTable-Amount", ValueState.Warning);

		// Cleanup
		Then.iTeardownMyAppFrame();
	});
});
