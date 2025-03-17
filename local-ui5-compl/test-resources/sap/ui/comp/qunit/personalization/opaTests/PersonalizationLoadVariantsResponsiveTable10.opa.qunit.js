sap.ui.define([
	'sap/ui/test/Opa5',
	'sap/ui/test/opaQunit',
	'sap/ui/comp/qunit/personalization/opaTests/Util',
	'sap/ui/comp/qunit/personalization/opaTests/Arrangement',
	'sap/ui/comp/qunit/personalization/opaTests/Action',
	'sap/ui/comp/qunit/personalization/opaTests/Assertion'

], function(Opa5, opaTest, Util, Arrangement, Action, Assertion) {
	'use strict';

	Opa5.extendConfig({
		asyncPolling: false,
		arrangements: new Arrangement(),
		actions: new Action(),
		assertions: new Assertion(),
		viewNamespace: "applicationUnderTestWithVariant.view."
	});

	opaTest("When I press on personalization button, the personalization dialog opens", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyAppInAFrame('test-resources/sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestWithVariant/start.html');

		//Actions
		When.iPressOnPersonalizationButton();

		// Assertions
		Then.thePersonalizationDialogOpens();
	});

	opaTest("When Filters are changed by external coding, upon opening the filter dialog we should have correctly updated filters", function(Given, When, Then) {
		// Actions
		When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "FILTERPANEL_TITLE"));
		When.iAddFilter("Product Name");
		When.iEnterTextInFilterWithId("FilterPanel-filterItemControlA_-applicationUnderTestWithVariant---IDView--IDSmartTable-Name", "Webcam");
		When.iPressOkButton();
		When.iSaveVariantAs("Standard", "Standard Filtered");
		When.iSelectVariant("Standard");
		When.iPressOnPersonalizationButton(true);
		When.iPressOkButton();

		// Assertions
		Then.iShouldSeeTableWithFilters("applicationUnderTestWithVariant---IDView--IDSmartTable", []);

		// Cleanup
		Then.iTeardownMyAppFrame();

	});
});
