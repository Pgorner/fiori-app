/* globals QUnit */

sap.ui.define([
	"sap/ui/test/opaQunit",
	"applicationUnderTest/test/Util",
	"applicationUnderTest/test/pages/Personalization",
	"test-resources/sap/ui/mdc/testutils/opa/TestLibrary"
], function(
	opaTest,
	ApplicationUnderTestUtil
) {
	"use strict";

	ApplicationUnderTestUtil.windowBlanket();
	ApplicationUnderTestUtil.extendConfig();

	QUnit.module("SelectionPanelKeyUser");

	opaTest("When start the '/navpopover/applicationUnderTest' application, some columns should be shown", function(Given, When, Then) {
		Given.iStartMyUIComponentInViewMode("applicationUnderTest");
		Given.iClearTheLocalStorageFromRtaRestart();

		Then.iShouldSeeStartRtaButton();
		Then.iShouldSeeVisibleColumnsInOrder("sap.m.Column", [
			"Name", "Product ID", "Category"
		]);
		Then.onThePersonalizationPage.iShouldSeeTheColumnInATable("Name");
		Then.onThePersonalizationPage.iShouldSeeTheColumnInATable("Product ID");
		Then.onThePersonalizationPage.iShouldSeeTheColumnInATable("Category");

		Then.iTeardownMyUIComponent();
	});
});
