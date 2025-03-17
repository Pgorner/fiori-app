/* eslint-disable no-undef */
sap.ui.define([
    "sap/ui/core/Lib",
    "sap/ui/test/Opa5",
    "sap/ui/test/opaQunit",
    "sap/ui/comp/qunit/personalization/opaTests/Arrangement",
    "../actions/SmartFieldTextInEditModeSource",
	"../assertions/SmartFieldTextInEditModeSource"
], function (
    Library,
    Opa5,
    opaTest,
    Arrangement,
    Actions,
	Assertions
) {
    "use strict";
    var appUrl = sap.ui.require.toUrl("test-resources/sap/ui/comp/smartfield/TextInEditModeSource/SmartFieldTextInEditModeSource.html");

	var oCoreRB = Library.getResourceBundleFor("sap.ui.core"),
		oCompRB = Library.getResourceBundleFor("sap.ui.comp");

    Opa5.extendConfig({
        viewNamespace: "TextInEditModeSource.Component.view.",
        autoWait: true,
		enabled: false,
        arrangements: new Arrangement({}),
        assertions: Assertions,
        actions: Actions
    });

    // --- ValueList Field Tests
    QUnit.module("ValueList Field");

    opaTest("Should see the ValueHelp Dialog for the ValueList Field", function (Given, When, Then) {
        // Arrangements
        Given.iStartMyAppInAFrame(appUrl);

        // Actions
        When.iPressTheValueListValueHelpButton();

        // Assertions
        Then.iShouldSeeTheValueListValueHelpDialog();

        // Cleanup
        Then.iTeardownMyApp();
    });

    opaTest("Should see the ValueHelp Dialog values for the ValueList field", function (Given, When, Then) {
        // Arrangements
        Given.iStartMyAppInAFrame(appUrl);

        // Actions
        When.iPressTheValueListValueHelpButton();

        // Assertions
        Then.iShouldSeeTheValueListValueHelpDialog();

        // Actions
        When.iPressTheValueListValueHelpDialogGoButton();

        // Assertions
        Then.iShouldSeeTheValueListValueHelpDialogValue("AP (Apple)");
        Then.iShouldSeeTheValueListValueHelpDialogValue("AP2 (Apple)");
        Then.iShouldSeeTheValueListValueHelpDialogValue("DL (Dell)");
        Then.iShouldSeeTheValueListValueHelpDialogValue("LN (Lenovo)");
        Then.iShouldSeeTheValueListValueHelpDialogValue("NV (Nvidia)");
        Then.iShouldSeeTheValueListValueHelpDialogValue("PL (Philipps)");

        // Cleanup
        Then.iTeardownMyApp();
    });

    opaTest("Should see an error 'Value does not exist' for the ValueList Field", function (Given, When, Then) {
        // Arrangements
        Given.iStartMyAppInAFrame(appUrl);

        // Actions
        When.iEnterAManufacturerInTheValueListField("XXX");

        //Assertions
        Then.iShouldSeeAnErrorForTheValueListField(oCompRB.getText("SMARTFIELD_NOT_FOUND"));

        // Cleanup
        Then.iTeardownMyApp();
    });

    opaTest("Should see an error 'Enter a text with a maximum of 3 characters and spaces' for the ValueList Field", function (Given, When, Then) {
        // Arrangements
        Given.iStartMyAppInAFrame(appUrl);

        // Actions
        When.iEnterAManufacturerInTheValueListField("XXXX");

        //Assertions
        Then.iShouldSeeAnErrorForTheValueListField(oCoreRB.getText("EnterTextMaxLength", ["3"]));

        // Cleanup
        Then.iTeardownMyApp();
    });

    opaTest("Should see a correct suggested manufacturer for the ValueList Field", function (Given, When, Then) {
        // Arrangements
        Given.iStartMyAppInAFrame(appUrl);

        // Actions
        When.iEnterAManufacturerInTheValueListField("AP");

        //Assertions
        Then.iShouldSeeASuggestedManufacturerInTheValueListField("Apple (AP)");

        // Cleanup
        Then.iTeardownMyApp();
    });


    // Seems to be broken due to MockServer issues
    //  opaTest("Should see an error for the ValueList Field when entering a copied value", function (Given, When, Then) {
    //     // Arrangements
    //     Given.iStartMyAppInAFrame(appUrl);

    //     // Actions
    //     When.iWaitForPromise(When.iRememberTheValueOfTheValueListField()).then(function() {
    //         When.iEnterTheRememberedValueInTheValueListField();
    //         // Assertion
    //         Then.iShouldSeeAnErrorForTheValueListField("Invalid filter query statement");

    //         // Cleanup
    //     Then.iTeardownMyApp();
    //     });
    // });

    QUnit.module("ValueList Field with GUID");

    opaTest("Shouldn't see an error for a non duplicated GUID Category entry", function (Given, When, Then) {
        // Arrangements
        Given.iStartMyAppInAFrame(appUrl);

        // Actions
        When.iEnterACategoryInTheValueListGUIDField("Smartphone");

        // Assertions
        Then.iShouldNotSeeAnErrorForTheValueListGUIDField();

        // Cleanup
        Then.iTeardownMyApp();
    });

    opaTest("Should see an error for a duplicated GUID Category entry", function (Given, When, Then) {
        // Arrangements
        Given.iStartMyAppInAFrame(appUrl);

        // Actions
        When.iEnterACategoryInTheValueListGUIDField("Smartphone");

        // Assertions
        Then.iShouldNotSeeAnErrorForTheValueListGUIDField();

        // Actions
        When.iWaitForPromise(When.iEnterACategoryInTheValueListGUIDField("Projector")).then(function () {
            //Assertions
            Then.iShouldSeeAnErrorForTheValueListGUIDField(oCompRB.getText("SMARTFIELD_NOT_UNIQUE"));

            // Cleanup
            Then.iTeardownMyApp();
        });
	});

	 QUnit.module("ValueListNoValidation Field");

		opaTest("Should see the ValueHelp Dialog for the ValueHelpNoValidation Field", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyAppInAFrame(appUrl);

		// Actions
		When.iPressTheValueListNoValidationValueHelpButton();

		// Assertions
		Then.iShouldSeeTheValueListNoValidationValueHelpDialog();

		// Cleanup
		Then.iTeardownMyApp();
	});

	opaTest("Should see an error 'Enter a text with a maximum of 3 characters and spaces' for the ValueListNoValidation Field when entering a value", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyAppInAFrame(appUrl);

		// Actions
		When.iEnterAManufacturerInTheValueListNoValidationField("XXXX");

		//Assertions
		Then.iShouldSeeAnErrorForTheValueListNoValidationField(oCoreRB.getText("EnterTextMaxLength", ["3"]));

		// Cleanup
		Then.iTeardownMyApp();
	});

	opaTest("Should be able to enter not existing manufacturer in the ValueListNoValidation Field without error", function (Given, When, Then) {
        // Arrangements
        Given.iStartMyAppInAFrame(appUrl);

        // Actions
        When.iEnterAManufacturerInTheValueListNoValidationField("XXX");

        //Assertions
        Then.iShouldNotSeeAnErrorForTheValueListNoValidationField();

        // Cleanup
        Then.iTeardownMyApp();
	});

	opaTest("Should see a correct suggested manufacturer for the ValueListNoValidation Field", function (Given, When, Then) {
        // Arrangements
        Given.iStartMyAppInAFrame(appUrl);

        // Actions
        When.iEnterAManufacturerInTheValueListNoValidationField("AP");

        //Assertions
        Then.iShouldSeeASuggestedManufacturerInTheValueListNoValidationField("Apple (AP)");

        // Cleanup
        Then.iTeardownMyApp();
    });
});
