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

	opaTest("When adding a Filter for 'Category' using 'equal to' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Arrangements
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestFiltering/start.html"));

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iAddFilter("Category");
		When.iOpenTheVHD(sFilterIdPrefix + "Category");
		When.iNavigateToTheDefineConditionsTab();
		When.iChangeTheCondition("equal to");
		When.iEnterTextInInput("Value", "Accessory");
		When.iPressTheVHDOKButton();
		When.iPressOkButton();

		//Assertions
		Then.thePersonalizationDialogShouldBeClosed();

		/* CodeEditor ID's
		*
		* SmartTable personalization controller data: 'applicationUnderTestFiltering---IDView--dataTableController'
		* SmartTable _getPersonalizationData result : 'applicationUnderTestFiltering---IDView--dataTable'
		* SmartChart personalization controller data: 'applicationUnderTestFiltering---IDView--currentSmartChartFilterDataController'
		* SmartChart _getPersonalizationData result : 'applicationUnderTestFiltering---IDView--currentSmartChartFilterData'
		*
		*/

		//-------------- operation: 'EQ' (equal to)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Category",
					"sOperator": "EQ",
					"oValue1": "Accessory",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'Category' using 'contains' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iOpenTheVHD(sFilterIdPrefix + "Category");
		When.iNavigateToTheDefineConditionsTab();
		When.iChangeTheCondition("contains");
		When.iEnterTextInInput("Value", "Ac");
		When.iPressTheVHDOKButton();
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'Contains' (contains)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Category",
					"sOperator": "Contains",
					"oValue1": "Ac",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'Category' using 'starts with' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iOpenTheVHD(sFilterIdPrefix + "Category");
		When.iNavigateToTheDefineConditionsTab();
		When.iChangeTheCondition("starts with");
		When.iEnterTextInInput("Value", "Ac");
		When.iPressTheVHDOKButton();
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'StartsWith' (starts with)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Category",
					"sOperator": "StartsWith",
					"oValue1": "Ac",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'Category' using 'ends with' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iOpenTheVHD(sFilterIdPrefix + "Category");
		When.iNavigateToTheDefineConditionsTab();
		When.iChangeTheCondition("ends with");

		When.iEnterTextInInput("Value", "ry");
		When.iPressTheVHDOKButton();
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'EndsWith' (ends with)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Category",
					"sOperator": "EndsWith",
					"oValue1": "ry",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'Category' using 'less than' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iOpenTheVHD(sFilterIdPrefix + "Category");
		When.iNavigateToTheDefineConditionsTab();
		When.iChangeTheCondition("less than");
		When.iEnterTextInInput("Value", "a");
		When.iPressTheVHDOKButton();
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'LT' (less than)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Category",
					"sOperator": "LT",
					"oValue1": "a",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'Category' using 'less than or equal to' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iOpenTheVHD(sFilterIdPrefix + "Category");
		When.iNavigateToTheDefineConditionsTab();
		When.iChangeTheCondition("less than or equal to");
		When.iEnterTextInInput("Value", "a");
		When.iPressTheVHDOKButton();
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'LE' (less than or equal to)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Category",
					"sOperator": "LE",
					"oValue1": "a",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'Category' using 'greater than' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iOpenTheVHD(sFilterIdPrefix + "Category");
		When.iNavigateToTheDefineConditionsTab();
		When.iChangeTheCondition("greater than");
		When.iEnterTextInInput("Value", "A");
		When.iPressTheVHDOKButton();
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'GT' (greater than)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Category",
					"sOperator": "GT",
					"oValue1": "A",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'Category' using 'greater than or equal to' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iOpenTheVHD(sFilterIdPrefix + "Category");
		When.iNavigateToTheDefineConditionsTab();
		When.iChangeTheCondition("greater than or equal to");
		When.iEnterTextInInput("Value", "A");
		When.iPressTheVHDOKButton();
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'GE' (greater than or equal to)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Category",
					"sOperator": "GE",
					"oValue1": "A",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'Category' using 'empty' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iOpenTheVHD(sFilterIdPrefix + "Category");
		When.iNavigateToTheDefineConditionsTab();
		When.iChangeTheCondition("empty");
		When.iPressTheVHDOKButton();
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'EQ' (empty)-------------------
		// "Category" field is annotated as "nullable=false"
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Category",
					"sOperator": "EQ",
					"oValue1": "",
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'Category nullable' using 'empty' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iPressOnButtonWithIcon('sap-icon://decline');
		When.iAddFilter("Category nullable");
		When.iOpenTheVHD(sFilterIdPrefix + "CategoryNullable");
		When.iNavigateToTheDefineConditionsTab();
		When.iChangeTheCondition("empty");
		When.iPressTheVHDOKButton();
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'EQ' (empty)-------------------
		// "Category nullable" field is not annotated as "nullable=false"
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "CategoryNullable",
					"sOperator": "EQ",
					"oValue1": "",
					"_bMultiFilter": false
				},
				{
					"sPath": "CategoryNullable",
					"sOperator": "EQ",
					"oValue1": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'Category' using 'between' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iPressOnButtonWithIcon('sap-icon://decline');
		When.iAddFilter("Category");
		When.iOpenTheVHD(sFilterIdPrefix + "Category");
		When.iNavigateToTheDefineConditionsTab();
		When.iChangeTheCondition("between");
		When.iEnterTextInInput("from", "A");
		When.iEnterTextInInput("to", "a");
		When.iPressTheVHDOKButton();
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'BT' (between)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Category",
					"sOperator": "BT",
					"oValue1": "A",
					"oValue2": "a",
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'Category' using 'between' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iPressOnButtonWithIcon('sap-icon://decline');
		When.iAddFilter("String Custom Column Key");
		When.iOpenTheVHD(sFilterIdPrefix + "string.test:Custom___test1.string2string.test:Custom_test1.string2");
		When.iNavigateToTheDefineConditionsTab();
		When.iChangeTheCondition("equal to");
		When.iEnterTextInInput("Value", "test");
		When.iPressTheVHDOKButton();
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'BT' (between)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "StringCustom2",
					"sOperator": "EQ",
					"oValue1": "test",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'Category Single' and select from suggestions the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iPressOnButtonWithIcon('sap-icon://decline');
		When.iAddFilter("Category Single");
		When.iEnterTextInFilterWithId(sFilterIdPrefix + "CategorySingle", "S");
		When.iSelectFromSuggestions(0);
		Then.iShouldSeeInputWithValue(sFilterIdPrefix + "CategorySingle", "SmartPhone");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'BT' (between)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "CategorySingle",
					"sOperator": "EQ",
					"oValue1": "SmartPhone",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);

		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		Then.iShouldSeeInputWithValue(sFilterIdPrefix + "CategorySingle", "SmartPhone");
		When.iPressOkButton();

	});

	opaTest("Test defaultFilterBarExpanded and defaultShowAllFilters added through customData for SmartFilterBar", function(Given, When, Then) {
		// Actions
		When.iOpenTheVHD("applicationUnderTestFiltering---IDView--smartFilterBar-filterItemControlA_-VH_many_filters");

		// Assertions
		Then.iShouldSeeFilterBarExpanded();
		Then.iShouldSeeAllFilters();

		When.iPressTheVHDOKButton();

	});

	opaTest("Test defaultFilterBarExpanded and defaultShowAllFilters added through customData for FilterPanel", function(Given, When, Then) {
		// Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iPressOnButtonWithIcon('sap-icon://decline');
		When.iAddFilter("ValueHelp with many filters");
		When.iOpenTheVHD(sFilterIdPrefix + "VH_many_filters");

		// Assertions
		Then.iShouldSeeFilterBarExpanded();
		Then.iShouldSeeAllFilters();

		When.iPressTheVHDOKButton();
		When.iPressOkButton();

	});

	opaTest("When adding a Filter for dropdown it should take displayBehavior from the SFB ControlConfiguration", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iAddFilter("String MultiComboBox with ValueList");
		When.iOpenVHDropdown("FilterPanel-filterItemControlA_-applicationUnderTestFiltering---IDView--IDSmartTable-STRING_MULTIPLE_VLTX_FL");

		//Assertions
		Then.iShouldSeeDropdownFirstItem("FilterPanel-filterItemControlA_-applicationUnderTestFiltering---IDView--IDSmartTable-STRING_MULTIPLE_VLTX_FL-popup-list", "0001");

		When.iPressOkButton();

		//Cleanup
		Then.iTeardownMyAppFrame();

	});
	opaTest("Test showSelectAll should disable MultiSelectionPlugin for VHD on filters from the SmartFilterBar", function(Given, When, Then) {
		//Arrangements
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestFiltering/start.html"));

		// Actions
		When.iOpenTheVHD("applicationUnderTestFiltering---IDView--smartFilterBar-filterItemControlA_-VH_many_filters");

		// Assertions
		Then.iShouldSeeMultiSelectionPlugin("applicationUnderTestFiltering---IDView--smartFilterBar-filterItemControlA_-VH_many_filters-valueHelpDialog-table-ui5table", false);

		When.iPressTheVHDOKButton();

		//Cleanup
		Then.iTeardownMyAppFrame();
	});

	opaTest("Test showSelectAll should disable MultiSelectionPlugin on filters from the Table Personalization", function(Given, When, Then) {
		//Arrangements
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestFiltering/start.html"));

		// Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iAddFilter("ValueHelp with many filters");
		When.iOpenTheVHD(sFilterIdPrefix + "VH_many_filters");

		// Assertions
		Then.iShouldSeeMultiSelectionPlugin("FilterPanel-filterItemControlA_-applicationUnderTestFiltering---IDView--IDSmartTable-VH_many_filters-valueHelpDialog-table-ui5table", false);

		When.iPressTheVHDOKButton();
		When.iPressOkButton();

		//Cleanup
		Then.iTeardownMyAppFrame();
	});

	opaTest("When adding a Filter for dropdown it should take controlType from the SFB ControlConfiguration", function(Given, When, Then) {

		//Arrangements
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestFiltering/start.html"));

		// Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iAddFilter("String with controlType dropDownList");
		When.iOpenVHDropdown("FilterPanel-filterItemControlA_-applicationUnderTestFiltering---IDView--IDSmartTable-STRING_MULTIPLE_VLTX_FL_CT");

		// Assertions
		Then.iShouldSeeFilterMultiComboBox("STRING_MULTIPLE_VLTX_FL_CT");

		When.iPressOkButton();

		// Cleanup
		Then.iTeardownMyAppFrame();

	});

	opaTest("When adding a Filter it should NOT take customControl configuration from the SFB ControlConfiguration", function(Given, When, Then) {

		//Arrangements
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestFiltering/start.html"));

		// Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iAddFilter("Supplier Name");

		// Assertions
		Then.iShouldSeeFilterOfType("FilterPanel-filterItemControlA_-applicationUnderTestFiltering---IDView--IDSmartTable-SupplierName", "sap.ui.comp.smartfilterbar.SFBMultiInput");

		// Cleanup
		Then.iTeardownMyAppFrame();

	});
});
