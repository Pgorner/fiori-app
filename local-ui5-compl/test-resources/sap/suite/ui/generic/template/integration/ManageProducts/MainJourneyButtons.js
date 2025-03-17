sap.ui.define(["sap/ui/test/opaQunit", "sap/ui/test/Opa5"],
	function(opaTest, Opa5) {

	"use strict";

	QUnit.module("Journey - ManageProducts - MainJourneyButtons");

	if (sap.ui.Device.browser.safari) {
		opaTest("Safari detected - SKIPPED", function (Given, When, Then) {
			Opa5.assert.expect(0);
		});
	} else {

	opaTest("#1 Check if The Main Page Coming With Title", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();
		// Assertions
		When.onTheMainPage.clickGo();
		Then.onTheMainPage.iShouldSeeTheTable();
	});

	opaTest("#2 Check if the header and toolbar are sticky", function(Given, When, Then) {
		// Assertions
		When.onTheMainPage.clickCheckBox();
		Then.onTheMainPage.checkForToolbarVisibility();
		Then.onTheMainPage.checkForHeaderVisibility();
		Then.onTheMainPage.iTeardownMyApp();
	});
}

});
