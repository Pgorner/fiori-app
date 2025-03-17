sap.ui.define([
	'sap/ui/test/Opa5',
	'sap/ui/test/opaQunit',
	'./Util',
	'./Arrangement',
	'./Action',
	'./Assertion'
], function(
	Opa5,
	opaTest,
	Util,
	Arrangement,
	Action,
	Assertion
) {
	'use strict';
	var sId = "FilterPanel-appplicationUnderTestJSONModel---mainView--IDSmartTable-";
	Opa5.extendConfig({
		autoWait:true,
		arrangements: new Arrangement(),
		actions: new Action(),
		assertions: new Assertion(),
		viewNamespace: "view."
	});

	opaTest("Start the test application and test filter without given type", function(Given, When, Then) {
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestJSONModel/start.html"));

		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();

		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Filter"));

		When.iAddFilter("Customer");
		When.iOpenTheVHD(sId + "Bukrs");

		Then.iShouldSeeConditionInputOfType("sap.m.Input");

		When.iEnterTextInConditionField(0, "2");
		When.iPressTheVHDOKButton();
		When.iPressOkButton();
	});

	opaTest("Test filter of type string", function(Given, When, Then) {
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iAddFilter("Company Code");
		When.iOpenTheVHD(sId + "Kunnr");

		Then.iShouldSeeConditionInputOfType("sap.m.Input");

		When.iPressTheVHDOKButton();
		When.iPressOkButton();
	});

	opaTest("test removing tokens from filter", function(Given, When, Then) {
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iClearFilterValue(sId + "Bukrs");
		When.iPressOkButton();

		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();

		Then.iShouldSeeEmptyFilterPanel();

		When.iPressOkButton();
	});

	opaTest("Test filter of type numeric", function(Given, When, Then) {
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iAddFilter("Amount");
		When.iOpenTheVHD(sId + "Cnt");


		Then.iShouldSeeConditionInputOfType("sap.m.Input");

		When.iEnterTextInConditionField(0, "asd");
		Then.iShouldSeeConditionInputWithValueState("Warning");

		When.iPressTheVHDCancelButton();
		When.iPressOkButton();
	});

	opaTest("Test filter of type date", function(Given, When, Then) {
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iAddFilter("Posting Date");
		When.iOpenTheVHD(sId + "BUDAT");


		Then.iShouldSeeConditionInputOfType("sap.m.DatePicker");
		Then.iShouldSeeNoEmptyOperation();
		When.iPressTheVHDOKButton();
		When.iPressOkButton();
	});

	opaTest("Test filter of type boolean", function(Given, When, Then) {
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iAddFilter("Validated");
		When.iOpenTheVHD(sId + "MyBoolean");


		Then.iShouldSeeConditionInputOfType("sap.m.Select");

		When.iPressTheVHDOKButton();
		When.iPressOkButton();
	});

	opaTest("Test filter of type time", function(Given, When, Then) {
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iAddFilter("Posting Time");
		When.iOpenTheVHD(sId + "Time");


		Then.iShouldSeeConditionInputOfType("sap.m.TimePicker");

		When.iPressTheVHDOKButton();
		When.iPressOkButton();


	});

	opaTest("Test Reset functionality", function(Given, When, Then) {
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iAddFilter("Customer");
		When.iOpenTheVHD(sId + "Bukrs");
		When.iEnterTextInConditionField(0, "2");
		When.iPressTheVHDOKButton();
		When.iPressOkButton();

		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iPressRestoreButton();
		When.iPressOkButtonOnTheWarningDialog();
		When.iPressOkButton();

		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();

		Then.iShouldSeeEmptyFilterPanel();
		When.iPressOkButton();

	});

	opaTest("Test Variant Management functionality", function(Given, When, Then) {
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iAddFilter("Customer");
		When.iOpenTheVHD(sId + "Bukrs");
		When.iEnterTextInConditionField(0, "2");
		When.iPressTheVHDOKButton();
		When.iPressOkButton();

		When.iSaveVariantAs("Standard", "Standard Test");

		When.iSelectVariant("Standard");
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		Then.iShouldSeeEmptyFilterPanel();
		When.iPressOkButton();

		When.iSelectVariant("Standard Test");

		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		Then.iShouldSeeFilterWithNameAndToken("Bukrs", "*2*", "Contains", "sap.m.MultiInput");

		Then.iTeardownMyAppFrame();
	});

});
