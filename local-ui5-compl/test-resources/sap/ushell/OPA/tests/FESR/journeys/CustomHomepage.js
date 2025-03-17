// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ushell/opa/tests/FESR/pages/FESR",
    "sap/ushell/opa/tests/spacesMode/pages/MenuBar",
    "sap/ushell/opa/tests/spacesMode/pages/Runtime",
    "sap/ushell/opa/tests/spacesMode/pages/EditMode"
], function (opaTest) {
    "use strict";

    /* global QUnit */

    QUnit.module("Custom Homepage: navigate into an app and then navigate back to home");

    opaTest("Should open the custom Homepage", function (Given, When, Then) {
        var oConfig = {
            ushell: {
                homeApp: {
                    component: {
                        name: "sap.ushell.demo.HomeApp",
                        url: "test-resources/sap/ushell/demoapps/HomeApp",
                        messages: [
                            "opa",
                            "test"
                        ]
                    }
                },
                opa5: {
                    keepInteractionOpenDuringStartup: true
                }
            }
        };

        Given.iStartMyFLP("abap", oConfig);

        Then.onTheHomeApp.iSeeTheNavigateButton();
        Then.onTheMenuBar.iSeeTheEntryHighlighted("My Home");
        When.onThePage.iStopTheInteraction();
        Then.onThePage.iCheckThatTheCorrectFESRHandleHasBeenSent({
            appNameLong: "sap.ushell.opa.bootstrap", // This property will be different in a non-test environment.
            appNameShort: "Z9999",
            interactionType: 1,
            stepName: "FLPCUSTOMHOME@Z9999"
        });
    });

    opaTest("Should navigate to a sample application and navigate back to home", function (Given, When, Then) {
        When.onTheHomeApp.iNavigateToAnApp();
        Then.onAppNavSample.iSeeTheChangeButton();
        Then.onAppNavSample.iCheckThatTheCorrectFESRHandleHasBeenSent(
            {
                appNameLong: "sap.ushell.demo.AppNavSample",
                appNameShort: "F6407",
                interactionType: 1,
                stepName: "APPSTART@CUSTOMHOME"
            });
        When.onAppNavSample.iNavigateBack();
        Then.onAppNavSample.iCheckThatTheCorrectFESRHandleHasBeenSent({
            appNameLong: "sap.ushell.renderer",
            appNameShort: "Z9999",
            interactionType: 1,
            stepName: "FLP_BACK@F6407"
        });
        Then.onTheHomeApp.iSeeTheNavigateButton();

        // No teardown here. This would not work with FESR.
    });


    QUnit.module("navigate to 'page 2', then to 'page 1', then to an app and then back to home");

    opaTest("Should open the custom Homepage", function (Given, When, Then) {
        Then.onTheHomeApp.iSeeTheNavigateButton();
        Then.onTheMenuBar.iSeeTheEntryHighlighted("My Home");

        Then.onThePage.iCheckThatTheCorrectFESRHandleHasBeenSent(null);
    });

    opaTest("Should navigate to page 2 (implicitly by testSpace2)", function (Given, When, Then) {
        When.onTheMenuBar.iClickOnMenuEntry("Test Space 2");

        Then.onTheMenuBar.iSeeTheEntryHighlighted("Test Space 2");
        Then.onThePage.iCheckThatTheCorrectFESRHandleHasBeenSent({
            appNameLong: "sap.ushell.components.pages",
            appNameShort: "FLP_PAGE",
            interactionType: 1,
            stepName: "ZPAGE2@H2H"
        });
    });

    opaTest("Should navigate to page 1 (implicitly by testSpace1)", function (Given, When, Then) {
        When.onTheMenuBar.iClickOnMenuEntry("Test Space 1");

        Then.onTheMenuBar.iSeeTheEntryHighlighted("Test Space 1");
        Then.onThePage.iCheckThatTheCorrectFESRHandleHasBeenSent({
            appNameLong: "sap.ushell.components.tiles.cdm.applauncher",
            appNameShort: "FLP_PAGE",
            interactionType: 1,
            stepName: "/UI2/FLP_DEMO_PA@H2H"
        });
    });

    opaTest("Should navigate to a sample application", function (Given, When, Then) {
        When.onThePage.iClickTheVisualization("Bookmark Sample");
        Then.onTheBookMarkApp.iSeeTheAddBookmarkButton();
        Then.onAppNavSample.iCheckThatTheCorrectFESRHandleHasBeenSent({
            appNameLong: "sap.ushell.demo.bookmark",
            appNameShort: "F6434",
            interactionType: 1,
            stepName: "FLP@HOMEPAGE_TILE"
        });
    });

    opaTest("Should navigate back to the 'Test Space 1'", function (Given, When, Then) {
        When.onAppNavSample.iNavigateBack();
        Then.onAppNavSample.iCheckThatTheCorrectFESRHandleHasBeenSent({
            appNameLong: "sap.ushell.renderer",
            appNameShort: "FLP_PAGE",
            interactionType: 1,
            stepName: "FLP_BACK@F6434"
        });
        Then.onTheMenuBar.iSeeTheEntryHighlighted("Test Space 1");

        Then.iTeardownMyFLP();
    });

});
