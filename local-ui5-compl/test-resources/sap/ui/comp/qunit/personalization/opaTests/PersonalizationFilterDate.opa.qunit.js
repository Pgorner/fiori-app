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
	var sDateFieldId = "FilterPanel-filterItemControlA_-applicationUnderTestFiltering---IDView--IDSmartTable-Date";
	opaTest("When adding a Filter for 'Date' using 'equal to' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Arrangements
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestFiltering/start.html"));

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iAddFilter("Date");
		When.iOpenTheVHD(sDateFieldId);
		When.iNavigateToTheDefineConditionsTab();
		When.iChangeTheCondition("equal to");
		When.iEnterTextInDatePicker("Value", "May 14, 2019");
		When.iPressTheVHDOKButton();
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'EQ' (equal to)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Date",
					"sOperator": "EQ",
					"oValue1": "2019-05-14T00:00:00.000Z",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'Date' using 'between' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iOpenTheVHD(sDateFieldId); // Date filter is already added in the previous opaTest so now we open it
		When.iNavigateToTheDefineConditionsTab();
		When.iChangeTheCondition("between");
		When.iEnterTextInDatePicker("from", "May 14, 2019");
		When.iEnterTextInDatePicker("to", "May 15, 2019");
		When.iPressTheVHDOKButton();
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'BT' (between)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Date",
					"sOperator": "BT",
					"oValue1": "2019-05-14T00:00:00.000Z",
					"oValue2": "2019-05-15T00:00:00.000Z",
					"_bMultiFilter": false
				}
			]
		);
	});
	/*

	opaTest("Entering only a 'from' value for the 'between' operator should cause a warning", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Date").and.iChangeTheCondition("between");
		When.iEnterTextInDatePicker("from", "May 14, 2019");
		When.iEnterTextInDatePicker("to", "");
		When.iPressOkButton();

		//Assertions
		Then.iShouldSeeWarning();

		//Actions - cleanup for next tests
		When.iPressOnIgnoreButton();
	});

	opaTest("Entering only a 'to' value for the 'between' operator should cause a warning", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Date").and.iChangeTheCondition("between");
		When.iEnterTextInDatePicker("from", "");
		When.iEnterTextInDatePicker("to", "May 14, 2019");
		When.iPressOkButton();

		//Assertions
		Then.iShouldSeeWarning();

		//Actions - cleanup for next tests
		When.iPressOnIgnoreButton();
	});

	*/

	opaTest("When adding a Filter for 'Date' using 'before' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iOpenTheVHD(sDateFieldId);
		When.iNavigateToTheDefineConditionsTab();
		When.iChangeTheCondition("before");
		When.iEnterTextInDatePicker("Value", "May 17, 2019");
		When.iPressTheVHDOKButton();
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'LT' (before)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Date",
					"sOperator": "LT",
					"oValue1": "2019-05-17T00:00:00.000Z",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'Date' using 'after' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iOpenTheVHD(sDateFieldId);
		When.iNavigateToTheDefineConditionsTab();
		When.iChangeTheCondition("after");
		When.iEnterTextInDatePicker("Value", "May 17, 2018");
		When.iPressTheVHDOKButton();
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'GT' (after)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Date",
					"sOperator": "GT",
					"oValue1": "2018-05-17T00:00:00.000Z",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'Date' using 'before or on' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iOpenTheVHD(sDateFieldId);
		When.iNavigateToTheDefineConditionsTab();
		When.iChangeTheCondition("before or on");
		When.iEnterTextInDatePicker("Value", "May 13, 2019");
		When.iPressTheVHDOKButton();
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'LE' (before or on)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Date",
					"sOperator": "LE",
					"oValue1": "2019-05-13T00:00:00.000Z",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'Date' using 'on or after' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iPressRestoreButton(); // Cleanup from previous tests
		Then.iShouldSeeWarning();
		When.iPressOkButtonOnTheWarningDialog();
		When.iAddFilter("Date");
		When.iOpenTheVHD(sDateFieldId);
		When.iNavigateToTheDefineConditionsTab();
		When.iChangeTheCondition("on or after");
		When.iEnterTextInDatePicker("Value", "May 13, 2019");
		When.iPressTheVHDOKButton();
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'GE' (on or after)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Date",
					"sOperator": "GE",
					"oValue1": "2019-05-13T00:00:00.000Z",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a incorrect value for Filter 'DateInterval', upon closing and re-opening the dialog the wrong value should not be there", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iPressRestoreButton(); // Cleanup from previous tests
		Then.iShouldSeeWarning();
		When.iPressOkButtonOnTheWarningDialog();
		When.iAddFilter("Date Interval");
		When.iEnterTextInFilterWithIdFocusable(sDateFieldId + "Interval", "123", false);
		When.iPressOkButton();
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iAddFilter("Date Interval");

		// Assert
		Then.iShouldSeeFilterWithValue(sDateFieldId + "Interval", "");

	});

	opaTest("When adding a incorrect value for Filter 'DateInterval', upon closing and re-opening the dialog the wrong value should not be there", function(Given, When, Then) {
		//Actions
		When.iPressRestoreButton(); // Cleanup from previous tests
		Then.iShouldSeeWarning();
		When.iPressOkButtonOnTheWarningDialog();
		When.iAddFilter("Creation Date");

		// Assert
		Then.iShouldSeeFilterOfType("FilterPanel-filterItemControlA_-applicationUnderTestFiltering---IDView--IDSmartTable-CREATION_DATE", "sap.m.DynamicDateRange");

		//Cleanup
		Then.iTeardownMyAppFrame();
	});
});
