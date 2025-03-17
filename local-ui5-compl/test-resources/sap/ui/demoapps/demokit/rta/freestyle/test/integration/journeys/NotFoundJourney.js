/*global QUnit*/
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit"
], function(Opa5, opaTest) {
	"use strict";

	QUnit.module("Desktop not found");

	opaTest("Should see the resource not found page and no selection in the master list when navigating to an invalid hash", function(Given,
		When, Then) {
		//Arrangement
		Given.iStartTheApp({urlParameters: "sap-ui-language=en-US"});

		//Actions
		When.onS3ProductDisplayPage.iWaitUntilTheBusyIndicatorIsGone();
		When.onTheMasterPage.iWaitUntilTheListIsLoaded()
			.and.iWaitUntilTheFirstItemIsSelected();
		When.onTheBrowserPage.iChangeTheHashToSomethingInvalid();

		// Assertions
		Then.onTheNotFoundPage.iShouldSeeTheNotFoundPage();
		Then.onTheMasterPage.theListShouldHaveNoSelection().
		and.iTeardownMyAppFrame();
	});
});