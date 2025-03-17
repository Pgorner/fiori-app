/* global QUnit */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"test-resources/sap/ui/comp/testutils/opa/TestLibrary"
], function (
	Opa5,
	opaTest
) {
	"use strict";

	Opa5.extendConfig({
		testLibs: {
			compTestLibrary: {
				appUrl: "test-resources/sap/ui/comp/qunit/smartfield/opa/NoSmartContainer/applicationUnderTest/NoSmartContainer.html"
			}
		},
		viewName: "mainView",
		viewNamespace: "",
		autoWait: true,
		async: true,
		timeout: 120
	});

	sap.ui.require([
		"sap/ui/comp/qunit/smartfield/opa/NoSmartContainer/applicationUnderTest/test/pages/Application"
	], function() {

		QUnit.module("Late creation of SmartField - check connection with SmartLabel");

		opaTest("SmartLabel Should become visible", function(Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheApplicationPage.iPressButtonWithText("Set to visible");

			// Assert
			Then.onTheApplicationPage.iShouldSeeLabelWithId("invisibleLabel");

			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("SmartLabel should have correct text when cloned", function(Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheApplicationPage.iPressButtonWithText("Clone");

			// Assert
			Then.onTheApplicationPage.iShouldSeeClonedLabelWithText("Employee Id");

			Given.onTheCompTestLibrary.iStopMyApp();
		});



		QUnit.start();

	});

});
