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

	var sSmartFieldTestId = "__field1-__clone0";

	Opa5.extendConfig({
		testLibs: {
			compTestLibrary: {
				appUrl: "test-resources/sap/ui/comp/qunit/smartfield/opa/TextArrangementInTable/applicationUnderTest/TextArrangementInTable.html"
			}
		},
		viewNamespace: "",
		autoWait: true,
		async: true,
		timeout: 120
	});

	sap.ui.require([
		"sap/ui/comp/qunit/smartfield/opa/TextArrangementInTable/applicationUnderTest/test/pages/Application"
	], function() {

		QUnit.module("Defaults");
		opaTest("Check initial value", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue(sSmartFieldTestId, "1 (Soundstation)");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});
		opaTest("Check the value in display mode", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheApplicationPage.iToggleTableEditMode(false);

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue(sSmartFieldTestId, "1 (Soundstation)");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});
		opaTest("Check the value is changed correctly", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheApplicationPage.iChangeTheValueTo(sSmartFieldTestId, "3");

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue(sSmartFieldTestId, "3 (Boat)");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("Check the change event value", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheApplicationPage.iChangeTheValueTo(sSmartFieldTestId, "5");

			// Assert
			Then.onTheApplicationPage.iShouldSeeChangeEventWithText(JSON.stringify({"Employees('0001')":{"__metadata":{"uri":"testService.Employees/Employees('0001')","type":"EmployeesNamespace.Employee","deepPath":"/Employees('0001')"},"Name":"5"}}));

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("Check show all filters set with custom data", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheApplicationPage.iOpenVHD("__field1-__clone0");

			// Assert
			Then.onTheApplicationPage.iShouldSeeAllFilters(true);
			Then.onTheApplicationPage.iShouldSeeFilterBarExpanded(true);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.start();

	});

});
