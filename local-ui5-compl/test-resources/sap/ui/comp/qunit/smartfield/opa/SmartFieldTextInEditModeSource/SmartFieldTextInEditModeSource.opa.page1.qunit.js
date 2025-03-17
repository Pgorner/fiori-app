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

    // --- Default Field tests
    QUnit.module("Default Field");

    opaTest("Should see the ValueHelp Dialog for the Default Field", function (Given, When, Then) {
        // Arrangements
        Given.iStartMyAppInAFrame(appUrl);

        // Actions
        When.iPressTheDefaultValueHelpButton();

        // Assertions
        Then.iShouldSeeTheDefaultValueHelpDialog();

        // Cleanup
        Then.iTeardownMyApp();
    });

    opaTest("Should see the ValueHelp Dialog values for the Default Field", function (Given, When, Then) {
        // Arrangements
        Given.iStartMyAppInAFrame(appUrl);

        // Actions
        When.iPressTheDefaultValueHelpButton();

        // Assertions
        Then.iShouldSeeTheDefaultValueHelpDialog();

        // Actions
        When.iPressTheDefaultValueHelpDialogGoButton();

        // Assertions
        Then.iShouldSeeTheDefaultValueHelpDialogValue("GC (Graphics Card)");
        Then.iShouldSeeTheDefaultValueHelpDialogValue("LT (Laptop)");
        Then.iShouldSeeTheDefaultValueHelpDialogValue("PR (Projector)");
        Then.iShouldSeeTheDefaultValueHelpDialogValue("SP (Smartphone)");
        Then.iShouldSeeTheDefaultValueHelpDialogValue("SS (Soundstation)");

        // Cleanup
        Then.iTeardownMyApp();
    });

    // --- NavigationProperty Field Tests
    QUnit.module("NavigationProperty Field");

    opaTest("Should see the ValueHelp Dialog for the NavigationProperty Field", function (Given, When, Then) {
        // Arrangements
        Given.iStartMyAppInAFrame(appUrl);

        // Actions
        When.iPressTheNavigationPropertyValueHelpButton();

        // Assertions
        Then.iShouldSeeTheNavigationPropertyValueHelpDialog();

        // Cleanup
        Then.iTeardownMyApp();
    });

    opaTest("Should see the ValueHelp Dialog values for the NavigationProperty field", function (Given, When, Then) {
        // Arrangements
        Given.iStartMyAppInAFrame(appUrl);

        // Actions
        When.iPressTheNavigationPropertyValueHelpButton();

        // Assertions
        Then.iShouldSeeTheNavigationPropertyValueHelpDialog();

        // Actions
        When.iPressTheNavigationPropertyValueHelpDialogGoButton();

        // Assertions
        Then.iShouldSeeTheNavigationPropertyValueHelpDialogValue("GC (Graphics Card)");
        Then.iShouldSeeTheNavigationPropertyValueHelpDialogValue("LT (Laptop)");
        Then.iShouldSeeTheNavigationPropertyValueHelpDialogValue("PR (Projector)");
        Then.iShouldSeeTheNavigationPropertyValueHelpDialogValue("SP (Smartphone)");
        Then.iShouldSeeTheNavigationPropertyValueHelpDialogValue("SS (Soundstation)");

        // Cleanup
        Then.iTeardownMyApp();
    });

    opaTest("Should see an error 'Value does not exist' for the NavigationProperty Field when entering a wrong value", function (Given, When, Then) {
        // Arrangements
        Given.iStartMyAppInAFrame(appUrl);

        // Actions
        When.iEnterACategoryInTheNavigationPropertyField("XXX");

        // Assertions
        Then.iShouldSeeAnErrorForTheNavigationPropertyField(oCompRB.getText("SMARTFIELD_NOT_FOUND"));

        // Cleanup
        Then.iTeardownMyApp();
    });

    opaTest("Should see an error 'Enter a text with a maximum of 3 characters and spaces' for the NavigationProperty Field when entering a short value", function (Given, When, Then) {
        // Arrangements
        Given.iStartMyAppInAFrame(appUrl);

        // Actions
        When.iEnterACategoryInTheNavigationPropertyField("XXXX");

        //Assertions
        Then.iShouldSeeAnErrorForTheNavigationPropertyField(oCoreRB.getText("EnterTextMaxLength", ["3"]));

        // Cleanup
        Then.iTeardownMyApp();
    });

    opaTest("Should not see an error for the NavigationProperty Field when entering a copied value", function (Given, When, Then) {
        Given.iStartMyAppInAFrame(appUrl);

        // Actions
		When.iEnterTheRememberedValueInTheNavigationPropertyField();

		// Assertions
		Then.iShouldNotSeeAnErrorForTheNavigationPropertyField();

		// Cleanup
		Then.iTeardownMyApp();
    });

    opaTest("Should see a correct suggested category for the NagivationProperty Field", function (Given, When, Then) {
        // Arrangements
        Given.iStartMyAppInAFrame(appUrl);

        // Actions
        When.iEnterACategoryInTheNavigationPropertyField("GC");

        // Assertions
        Then.iShouldSeeASuggestedCategoryInTheNavigationPropertyField("GC (Graphics Card)");

        // Cleanup
        Then.iTeardownMyApp();
    });
});
