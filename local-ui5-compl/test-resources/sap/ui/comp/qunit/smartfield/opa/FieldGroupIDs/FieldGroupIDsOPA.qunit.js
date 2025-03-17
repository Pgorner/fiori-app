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
				appUrl: "test-resources/sap/ui/comp/qunit/smartfield/opa/FieldGroupIDs/applicationUnderTest/FieldGroupIDs.html"
			}
		},
		viewName: "myView",
		viewNamespace: "",
		autoWait: true,
		async: true,
		timeout: 30
	});

	sap.ui.require([
		"sap/ui/comp/qunit/smartfield/opa/FieldGroupIDs/applicationUnderTest/test/pages/Application"
	], function() {

		QUnit.module("Generic");

		opaTest("Initial state", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Assert
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithFieldGroupIDs("FGSM");
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithSpecificFieldGroupIDs("NOFG", []);

			// Assert - check precedence on field with service metadata field group ID's and also property set
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithSpecificFieldGroupIDs("FGP", ["TestFG1", "TestFG2"]);
		});

		opaTest("Calculate and apply field groups to field without such", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheApplicationPage.iApplyFieldGroupIDs();

			// Assert
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithFieldGroupIDs("NOFG");
		});

		opaTest("Runtime change", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheApplicationPage.iSetFieldGroupIDs("FGSM", ["TestFG3", "TestFG4"]);

			// Assert
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithSpecificFieldGroupIDs("FGSM", ["TestFG3", "TestFG4"]);

			// Cleanup
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.start();
	});
});
