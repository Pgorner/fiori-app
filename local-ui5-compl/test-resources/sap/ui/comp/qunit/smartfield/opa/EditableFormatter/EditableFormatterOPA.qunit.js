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
				appUrl: "test-resources/sap/ui/comp/qunit/smartfield/opa/EditableFormatter/applicationUnderTest/EditableFormatter.html"
			}
		},
		viewName: "mainView",
		viewNamespace: "",
		autoWait: true,
		async: true,
		timeout: 120
	});

	sap.ui.require([
		"sap/ui/comp/qunit/smartfield/opa/EditableFormatter/applicationUnderTest/test/pages/Application"
	], function() {

		QUnit.module("Defaults");

		opaTest("The SmartField should be in Editable mode when settting binding context to a new record when creatable is true and updatable is false", function(Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheApplicationPage.iPressButton("idView--newRecord");

			// Assert
			Then.onTheApplicationPage.iShouldSeeSmartFieldInMode("idView--Name", "edit");

			// Act
			When.onTheApplicationPage.iPressButton("idView--existingRecord");

			// Assert
			Then.onTheApplicationPage.iShouldSeeSmartFieldInMode("idView--Name", "display");

			// Act
			When.onTheApplicationPage.iPressButton("idView--removeBindingContext");
			When.onTheApplicationPage.iPressButton("idView--newRecord");

			// Assert
			Then.onTheApplicationPage.iShouldSeeSmartFieldInMode("idView--Name", "edit");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("The SmartField should be in Display mode when settting binding context to a new record, creatable is true and updatable is false but editable false is passed from the View", function(Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheApplicationPage.iPressButton("idView--newRecord");

			// Assert
			Then.onTheApplicationPage.iShouldSeeSmartFieldInMode("idView--NameEditableFalse", "display");

			// Act
			When.onTheApplicationPage.iPressButton("idView--existingRecord");

			// Assert
			Then.onTheApplicationPage.iShouldSeeSmartFieldInMode("idView--NameEditableFalse", "display");

			// Act
			When.onTheApplicationPage.iPressButton("idView--removeBindingContext");
			When.onTheApplicationPage.iPressButton("idView--newRecord");

			// Assert
			Then.onTheApplicationPage.iShouldSeeSmartFieldInMode("idView--NameEditableFalse", "display");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("The editable formatter should respect the 'editable' property value of the SmartField if the entity set is creatable, updatable and there are no Editable/Display mode related annotations set.", function(Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheApplicationPage.iPressButton("idView--newUpdatableRecord");

			// Assert
			Then.onTheApplicationPage.iShouldSeeSmartFieldInMode("idView--NameEditableFalse", "display");

			// Act
			When.onTheApplicationPage.iSetSmartFieldControlProperty("idView--NameEditableFalse", "editable", true);

			// Assert
			Then.onTheApplicationPage.iShouldSeeSmartFieldInMode("idView--NameEditableFalse", "edit");

			// Act
			When.onTheSmartField.iEnterTextInSmartField("idView--NameEditableFalse", 1);

			// Assert
			Then.onTheApplicationPage.iShouldSeeSmartFieldInMode("idView--NameEditableFalse", "edit");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.start();

	});

});
