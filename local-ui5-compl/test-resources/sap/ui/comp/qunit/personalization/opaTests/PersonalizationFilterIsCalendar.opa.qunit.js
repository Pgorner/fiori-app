sap.ui.define([
	'sap/ui/test/Opa5',
	'sap/ui/test/opaQunit',
	'./Arrangement',
	'./Action',
	'./Assertion',
	'./Util'
], function (
	Opa5,
	opaTest,
	Arrangement,
	Action,
	Assertion,
	Util
) {
	"use strict";

	var sFilterIdPrefix = "FilterPanel-filterItemControlA_-applicationUnderTestFilteringIsCalendar---IDView--IDSmartTable-",
		sNewVariantName = "IsCalendarTypes-" + new Date().toISOString();

	Opa5.extendConfig({
		autoWait:true,
		arrangements: new Arrangement(),
		actions: new Action(),
		assertions: new Assertion(),
		viewNamespace: "view."
	});

	opaTest("When adding a Filter for 'CalendarMonth' using 'equal to' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Arrangements
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestFilteringIsCalendar/start.html"));

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iAddFilter("IsCalendarMonth");
		When.iOpenTheVHD(sFilterIdPrefix + "CalendarMonth");
		When.iEnterTextInInputFocusable("Value", "3", false);

		When.iPressTheVHDOKButton();
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'EQ' (equal to)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFilteringIsCalendar---IDView--dataTable",
			[
				{
					"sPath": "CalendarMonth",
					"sOperator": "EQ",
					"oValue1": "03",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'CalendarQuarter' using 'equal to' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iPressRestoreButton(); // Cleanup from previous tests
		When.iPressOkButtonOnTheWarningDialog();
		When.iAddFilter("IsCalendarQuarter");
		When.iOpenTheVHD(sFilterIdPrefix + "CalendarQuarter");
		When.iEnterTextInInputFocusable("Value", "3", false);
		When.iPressTheVHDOKButton();
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'EQ' (equal to)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFilteringIsCalendar---IDView--dataTable",
			[
				{
					"sPath": "CalendarQuarter",
					"sOperator": "EQ",
					"oValue1": "3",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'CalendarWeek' using 'equal to' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iPressRestoreButton(); // Cleanup from previous tests
		When.iPressOkButtonOnTheWarningDialog();
		When.iAddFilter("IsCalendarWeek");
		When.iOpenTheVHD(sFilterIdPrefix + "CalendarWeek");
		When.iEnterTextInInputFocusable("Value", "4", false);
		When.iPressTheVHDOKButton();
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'EQ' (equal to)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFilteringIsCalendar---IDView--dataTable",
			[
				{
					"sPath": "CalendarWeek",
					"sOperator": "EQ",
					"oValue1": "04",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'CalendarYear' using 'equal to' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iPressRestoreButton(); // Cleanup from previous tests
		When.iPressOkButtonOnTheWarningDialog();
		When.iAddFilter("IsCalendarYear");
		When.iOpenTheVHD(sFilterIdPrefix + "CalendarYear");
		When.iEnterTextInInputFocusable("Value", "2023", false);
		When.iPressTheVHDOKButton();
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'EQ' (equal to)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFilteringIsCalendar---IDView--dataTable",
			[
				{
					"sPath": "CalendarYear",
					"sOperator": "EQ",
					"oValue1": "2023",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'CalendarYearMonth' using 'equal to' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iPressRestoreButton(); // Cleanup from previous tests
		When.iPressOkButtonOnTheWarningDialog();
		When.iAddFilter("IsCalendarYearMonth");
		When.iOpenTheVHD(sFilterIdPrefix + "CalendarYearMonth");
		When.iEnterTextInInputFocusable("Value", "3/2023", false);
		When.iPressTheVHDOKButton();
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'EQ' (equal to)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFilteringIsCalendar---IDView--dataTable",
			[
				{
					"sPath": "CalendarYearMonth",
					"sOperator": "EQ",
					"oValue1": "202303",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'CalendarYearQuarter' using 'equal to' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iPressRestoreButton(); // Cleanup from previous tests
		When.iPressOkButtonOnTheWarningDialog();
		When.iAddFilter("IsCalendarYearQuarter");
		When.iOpenTheVHD(sFilterIdPrefix + "CalendarYearQuarter");
		When.iEnterTextInInputFocusable("Value", "3/2023", false);
		When.iPressTheVHDOKButton();
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'EQ' (equal to)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFilteringIsCalendar---IDView--dataTable",
			[
				{
					"sPath": "CalendarYearQuarter",
					"sOperator": "EQ",
					"oValue1": "20233",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'CalendarYearWeek' using 'equal to' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iPressRestoreButton(); // Cleanup from previous tests
		When.iPressOkButtonOnTheWarningDialog();
		When.iAddFilter("IsCalendarYearWeek");
		When.iOpenTheVHD(sFilterIdPrefix + "CalendarYearWeek");
		When.iEnterTextInInputFocusable("Value", "20/2023", false);
		When.iPressTheVHDOKButton();
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'EQ' (equal to)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFilteringIsCalendar---IDView--dataTable",
			[
				{
					"sPath": "CalendarYearWeek",
					"sOperator": "EQ",
					"oValue1": "202320",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filters for 'IsCalendar*' using 'equal to' the filter statement for the SmartTable should contain my and SmartVariants should apply them correctly", function(Given, When, Then) {

		var aExpectedFilters = [
			{
				"sPath": "CalendarYearQuarter",
				"sOperator": "EQ",
				"oValue1": "20233",
				"oValue2": null,
				"_bMultiFilter": false
			},
			{
				"sPath": "CalendarYearMonth",
				"sOperator": "EQ",
				"oValue1": "202303",
				"oValue2": null,
				"_bMultiFilter": false
			},
			{
				"sPath": "CalendarYearWeek",
				"sOperator": "EQ",
				"oValue1": "202320",
				"oValue2": null,
				"_bMultiFilter": false
			},
			{
				"sPath": "CalendarQuarter",
				"sOperator": "EQ",
				"oValue1": "3",
				"oValue2": null,
				"_bMultiFilter": false
			},
			{
				"sPath": "CalendarMonth",
				"sOperator": "EQ",
				"oValue1": "03",
				"oValue2": null,
				"_bMultiFilter": false
			},
			{
				"sPath": "CalendarWeek",
				"sOperator": "EQ",
				"oValue1": "04",
				"oValue2": null,
				"_bMultiFilter": false
			},
			{
				"sPath": "CalendarYear",
				"sOperator": "EQ",
				"oValue1": "2023",
				"oValue2": null,
				"_bMultiFilter": false
			}
		];

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iPressRestoreButton(); // Cleanup from previous tests
		When.iPressOkButtonOnTheWarningDialog();

		When.iAddFilter("IsCalendarMonth");

		When.iOpenTheVHD(sFilterIdPrefix + "CalendarMonth");
		When.iEnterTextInInputFocusable("Value", "3", false);
		When.iPressTheVHDOKButton();

		When.iAddFilter("IsCalendarQuarter");
		When.iOpenTheVHD(sFilterIdPrefix + "CalendarQuarter");
		When.iEnterTextInInputFocusable("Value", "3", false);
		When.iPressTheVHDOKButton();

		When.iAddFilter("IsCalendarWeek");
		When.iOpenTheVHD(sFilterIdPrefix + "CalendarWeek");
		When.iEnterTextInInputFocusable("Value", "4", false);
		When.iPressTheVHDOKButton();

		When.iAddFilter("IsCalendarYearMonth");
		When.iOpenTheVHD(sFilterIdPrefix + "CalendarYearMonth");
		When.iEnterTextInInputFocusable("Value", "3/2023", false);
		When.iPressTheVHDOKButton();

		When.iAddFilter("IsCalendarYearQuarter");
		When.iOpenTheVHD(sFilterIdPrefix + "CalendarYearQuarter");
		When.iEnterTextInInputFocusable("Value", "3/2023", false);
		When.iPressTheVHDOKButton();

		When.iAddFilter("IsCalendarYearWeek");
		When.iOpenTheVHD(sFilterIdPrefix + "CalendarYearWeek");
		When.iEnterTextInInputFocusable("Value", "20/2023", false);
		When.iPressTheVHDOKButton();

		When.iAddFilter("IsCalendarYear");
		When.iOpenTheVHD(sFilterIdPrefix + "CalendarYear");
		When.iEnterTextInInputFocusable("Value", "2023", false);
		When.iPressTheVHDOKButton();

		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'EQ' (equal to)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFilteringIsCalendar---IDView--dataTable", aExpectedFilters);

		When.iSaveVariantAs("Standard", sNewVariantName);
		When.iSelectVariant("Standard");

		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFilteringIsCalendar---IDView--dataTable", []);

		// When.iSelectVariant(sNewVariantName).and.iPressOnPersonalizationButton(true).and.iNavigateToPanel(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Filter"));
		When.iSelectVariant(sNewVariantName);

		//Assertions
		//-------------- operation: 'EQ' (equal to)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFilteringIsCalendar---IDView--dataTable", aExpectedFilters);

		// Assertions
		// Then.thePersonalizationDialogOpens();

		//Cleanup
		Then.iTeardownMyAppFrame();
	});
});
