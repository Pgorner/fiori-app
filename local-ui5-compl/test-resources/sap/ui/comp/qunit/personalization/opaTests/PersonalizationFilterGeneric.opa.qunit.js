sap.ui.define([
	'sap/ui/test/Opa5',
	'sap/ui/test/opaQunit',
	'./Util',
	'./Arrangement',
	'./Action',
	'./Assertion'
], function (
	Opa5,
	opaTest,
	Util,
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

	opaTest("When I open the Settings dialog, I want to navigate to FilterPanel", function(Given, When, Then) {
		//Arrangements
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestFiltering/start.html"));

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();

		//Assertions
		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Filter"));
	});

	opaTest("When clicking the KeyField ComboBox on the FilterPanel, I want a list of all filterable properties", function(Given, When, Then) {
		//Actions
		When.iClickOnComboBox("");

		//Assertions
		Then.iShouldSeeComboBoxItems([
			"Category",
			"Currency Code",
			"Date",
			"Name",
			"Price",
			"Product ID",
			"Status"
		]);
	});

	opaTest("When clicking the Operations control on the FilterPanel, I want a list of all possible operations", function(Given, When, Then) {
		//Actions
		When.iAddFilter("Category");
		When.iOpenTheVHD(sFilterIdPrefix + "Category");
		When.iNavigateToTheDefineConditionsTab();

		When.iClickOnComboBox("contains", 1);

		//Assertions
		Then.iShouldSeeIncludeOperations([
			"contains",
			"equal to",
			"between",
			"starts with",
			"ends with",
			"less than",
			"less than or equal to",
			"greater than",
			"greater than or equal to",
			"empty"
		]);
	});

	opaTest("When changing from 'Category' to 'Date', the Select should have different items", function(Given, When, Then) {
		//Actions
		// When.iAddFilter("Category");
		When.iOpenTheVHD(sFilterIdPrefix + "Category");
		When.iNavigateToTheDefineConditionsTab();

		When.iClickOnComboBox("contains", 1); //close
		When.iPressTheVHDOKButton();

		When.iAddFilter("Date");

		When.iOpenTheVHD(sFilterIdPrefix + "Date");
		When.iNavigateToTheDefineConditionsTab();
		When.iEnterTextInDatePicker("Value", "May 13, 2019");
		// When.iChangeTheFilterField("Date");
		When.iClickOnComboBox("equal to");

		//Assertions
		Then.iShouldSeeIncludeOperations([
			"equal to",
			"between",
			"before",
			"before or on",
			"after",
			"on or after"
		]);
		When.iPressTheVHDOKButton();
		When.iPressOkButton();
	});

	opaTest("When changing from 'Category' to 'Date', the Select should have different items", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();

		// Date Time Offset Interval fields should not be added automatically
		When.iAddFilter("Date Time Offset Interval");

		When.iOpenTheVHD(sFilterIdPrefix + "Date");
		When.iNavigateToTheDefineConditionsTab();
		When.iEnterTextInDatePicker("Value", "May 13, 2019");

		// When.iChangeTheFilterField("Date");
		When.iClickOnComboBox("equal to");

		//Assertions
		Then.iShouldSeeIncludeOperations([
			"equal to",
			"between",
			"before",
			"before or on",
			"after",
			"on or after"
		]);
		When.iPressTheVHDOKButton();
	});

	opaTest("When changing from 'Date' to 'Supplier Name', the Select should have different items (maxlength: 1)", function(Given, When, Then) {
		//Actions
		When.iAddFilter("Supplier Name");
		When.iOpenTheVHD(sFilterIdPrefix + "SupplierName");
		When.iNavigateToTheDefineConditionsTab();

		When.iClickOnComboBox("equal to", 1);

		//Assertions
		Then.iShouldSeeIncludeOperations([
			"equal to",
			"between",
			"less than",
			"less than or equal to",
			"greater than",
			"greater than or equal to",
			"empty"
		]);
		When.iPressTheVHDOKButton();

		//dialog needs to be closed for follow-up tests
		When.iPressOkButton();
		//Cleanup
		Then.iTeardownMyAppFrame();
	});
});
