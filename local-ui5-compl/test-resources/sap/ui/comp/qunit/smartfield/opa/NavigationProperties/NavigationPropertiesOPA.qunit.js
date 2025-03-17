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
				appUrl: "test-resources/sap/ui/comp/qunit/smartfield/opa/NavigationProperties/applicationUnderTest/NavigationProperties.html"
			}
		},
		viewName: "myView",
		viewNamespace: "",
		autoWait: true,
		async: true,
		timeout: 30
	});

	sap.ui.require([
		"sap/ui/comp/qunit/smartfield/opa/NavigationProperties/applicationUnderTest/test/pages/Application"
	], function() {

		QUnit.module("Generic");

		opaTest("Expanded navigation field is editable", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheApplicationPage.iChangeTheValueTo("ProductExpanded", "LaptopModified");

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("CategoriesLT", "LaptopModified");

			// Cleanup
			When.onTheApplicationPage.iResetTheModel();
		});

		opaTest("Not expanded navigation bound field is not editable both persisted and created", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Assert
			Then.onTheApplicationPage.iShouldSeeSmartFieldInMode("ProductNotExpanded", "display");
			Then.onTheApplicationPage.iShouldSeeSmartFieldInMode("CreateField", "display");
		});

		opaTest("Late expand for persisted field", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheApplicationPage.iExpandPersisted();

			// Assert
			Then.onTheApplicationPage.iShouldSeeSmartFieldInMode("ProductNotExpanded", "edit");

			// Act
			When.onTheApplicationPage.iChangeTheValueTo("ProductNotExpanded", "SoundstationModified");

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("CategoriesSS", "SoundstationModified");

			// Cleanup
			When.onTheApplicationPage.iResetTheModel();
		});

		opaTest("Late expand for created field", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheApplicationPage.iExpandCreated();

			// Assert
			Then.onTheApplicationPage.iShouldSeeSmartFieldInMode("CreateField", "edit");

			// Act
			When.onTheApplicationPage.iChangeTheValueTo("CreateField", "SmartphoneModified");

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("CategoriesSP", "SmartphoneModified");

			// Cleanup
			When.onTheApplicationPage.iResetTheModel();

			// Shutdown
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.start();
	});
});
