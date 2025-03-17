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

    QUnit.module("PagesRuntime");

    opaTest("Should open the FLP in spaces mode and find the Bookmark Sample app tile and check the FESR handle", function (Given, When, Then) {
        var oConfig = {
            ushell: {
                opa5: {
                    keepInteractionOpenDuringStartup: true
                }
            }
        };
        Given.iStartMyFLP("abap", oConfig);
        Then.onThePage.iSeeTheVisualization("Bookmark Sample");
        Then.onTheMenuBar.iSeeTheEntryHighlighted("Test Space 1");
        When.onThePage.iStopTheInteraction();
        Then.onTheBookMarkApp.iCheckThatTheCorrectFESRHandleHasBeenSent({
            appNameLong: "sap.ushell.opa.bootstrap", // This property will be different in a non-test environment.
            appNameShort: "FLP_PAGE",
            interactionType: 1,
            stepName: "FLP@DEEP_LINK"
        });
    });

    opaTest("Should start the app and check the FESR handle", function (Given, When, Then) {
        When.onThePage.iClickTheVisualization("Bookmark Sample");
        Then.onTheBookMarkApp.iSeeTheAddBookmarkButton();
        Then.onTheBookMarkApp.iCheckThatTheCorrectFESRHandleHasBeenSent({
            appNameLong: "sap.ushell.demo.bookmark",
            appNameShort: "F6434",
            interactionType: 1,
            stepName: "FLP@HOMEPAGE_TILE"
        });
    });

    opaTest("Should start from an application and should go back to home", function (Given, When, Then) {
        When.onTheBookMarkApp.iNavigateBack();
        Then.onThePage.iSeeTheVisualization("Bookmark Sample");
        Then.onThePage.iCheckThatTheCorrectFESRHandleHasBeenSent({
            appNameLong: "sap.ushell.renderer",
            appNameShort: "FLP_PAGE",
            interactionType: 1,
            stepName: "FLP_BACK@F6434"
        });
        Then.iTeardownMyFLP();
    });

});
