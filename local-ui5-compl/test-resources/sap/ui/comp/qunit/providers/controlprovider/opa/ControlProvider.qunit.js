/* global QUnit */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit"
], function (
	Opa5,
	opaTest
) {
	"use strict";

	Opa5.extendConfig({
		viewName: "mainView",
		autoWait: true,
		async: true
	});

	sap.ui.require([
		"sap/ui/comp/qunit/providers/controlprovider/opa/applicationUnderTest/tests/Application"
	], function () {

		QUnit.module("Defaults");

		opaTest("With SmartField ValueList and TextArrangement annotations", function (Given, When, Then) {
			// Arrange
			Given.iStartMyAppInAFrame("test-resources/sap/ui/comp/qunit/providers/controlprovider/opa/applicationUnderTest/ControlProvider.html");

			// Assert
			Then.onTheApplicationPage.iShouldSeeNumberOfRequests(1, "/dataServices/schema/0/entityType/0/property/1");

			Then.onTheApplicationPage.iShouldSeeSmartFieldWithValue("idView--smartTable", "Name", 0, "Soundstation (1)");
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithValue("idView--smartTable", "Name", 1, "Boat (3)");
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithValue("idView--smartTable", "Name", 2, "Helicopter (4)");
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithValue("idView--smartTable", "Name", 3, "Bus (5)");

			// Action
			When.onTheApplicationPage.iToggleMode("idView--smartTable", false);

			Then.onTheApplicationPage.iShouldSeeSmartFieldWithValue("idView--smartTable", "Name", 0, "Soundstation (1)");
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithValue("idView--smartTable", "Name", 1, "Boat (3)");
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithValue("idView--smartTable", "Name", 2, "Helicopter (4)");
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithValue("idView--smartTable", "Name", 3, "Bus (5)");

			Given.iTeardownMyApp();
		});

		opaTest("With SmartField without ValueList", function (Given, When, Then) {
			// Arrange
			Given.iStartMyAppInAFrame("test-resources/sap/ui/comp/qunit/providers/controlprovider/opa/applicationUnderTest/ControlProvider.html");

			// Assert
			Then.onTheApplicationPage.iShouldSeeNumberOfRequests(1, "/dataServices/schema/0/entityType/0/property/1");

			Then.onTheApplicationPage.iShouldSeeSmartFieldWithValue("idView--smartTable", "Local Description", 0, "Sofia");
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithValue("idView--smartTable", "Local Description", 1, "Berlin");
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithValue("idView--smartTable", "Local Description", 2, "Praha");
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithValue("idView--smartTable", "Local Description", 3, "Paris");

			// Action
			When.onTheApplicationPage.iToggleMode("idView--smartTable", false);

			Then.onTheApplicationPage.iShouldSeeSmartFieldWithValue("idView--smartTable", "Local Description", 0, "Sofia");
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithValue("idView--smartTable", "Local Description", 1, "Berlin");
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithValue("idView--smartTable", "Local Description", 2, "Praha");
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithValue("idView--smartTable", "Local Description", 3, "Paris");

			Given.iTeardownMyApp();
		});

		opaTest("With initially invisible SmartField with ValueList", function (Given, When, Then) {
			// Arrange
			Given.iStartMyAppInAFrame("test-resources/sap/ui/comp/qunit/providers/controlprovider/opa/applicationUnderTest/ControlProvider.html");

			// Assert
			Then.onTheApplicationPage.iShouldSeeNumberOfRequests(0, "/dataServices/schema/0/entityType/0/property/2");

			// Action
			When.onTheApplicationPage.iOpenSettings("idView--smartTable");
			When.onTheApplicationPage.iChangeColumnVisibility("Department", true);
			When.onTheApplicationPage.iConfirmSettings();

			// Assert
			Then.onTheApplicationPage.iShouldSeeNumberOfRequests(1, "/dataServices/schema/0/entityType/0/property/2");

			Then.onTheApplicationPage.iShouldSeeSmartFieldWithValue("idView--smartTable", "Department", 0, "Purchasing1");
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithValue("idView--smartTable", "Department", 1, "Purchasing3");
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithValue("idView--smartTable", "Department", 2, "Purchasing4");
			Then.onTheApplicationPage.iShouldSeeSmartFieldWithValue("idView--smartTable", "Department", 3, "Purchasing5");

			Given.iTeardownMyApp();
		});

		QUnit.start();

	});
});
