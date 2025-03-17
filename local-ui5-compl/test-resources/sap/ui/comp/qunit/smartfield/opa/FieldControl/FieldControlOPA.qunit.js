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
				appUrl: "test-resources/sap/ui/comp/qunit/smartfield/opa/FieldControl/applicationUnderTest/FieldControl.html"
			}
		},
		viewName: "mainView",
		viewNamespace: "",
		autoWait: true,
		async: true,
		timeout: 120
	});

	sap.ui.require([
		"sap/ui/comp/qunit/smartfield/opa/FieldControl/applicationUnderTest/test/pages/Application"
	], function() {

		QUnit.module("Defaults");

		opaTest("SmartField with FieldControl - check required state", function(Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Assert
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithRequiredState("V4Optional", false);
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithRequiredState("V4Mandatory", true);
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithRequiredState("ReadOnly", false);
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithRequiredState("NullableFalse", true);
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithRequiredState("V2Optional", false);
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithRequiredState("V2Mandatory", true);
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithRequiredState("V2MandatoryV4Optional", false);
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithRequiredState("V2OptionalV4Mandatory", true);

			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("SmartField with FieldControl - check parseKeepEmptyString", function(Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Action
			When.onTheApplicationPage.iChangeTheValueTo("V4Optional", "");
			When.onTheApplicationPage.iChangeTheValueTo("V2Optional", "");
			When.onTheApplicationPage.iChangeTheValueTo("V2MandatoryV4Optional", "");

			// Assert
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithIdAndBindingValue("V4Optional", "");
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithIdAndBindingValue("V2Optional",  "");
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithIdAndBindingValue("V2MandatoryV4Optional",  "");

			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.start();

	});

});
