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

    QUnit.module("Deeplink: after a deep link navigation 'app 1', then navigate to 'app 2'");

    opaTest("Should open the Bookmark application", function (Given, When, Then) {
        var oConfig = {
            ushell: {
                opa5: {
                    directAppHash: "Action-toappnavsample",
                    keepInteractionOpenDuringStartup: true
                }
            }
        };

        Given.iStartMyFLP("abap", oConfig);

        Then.onAppNavSample.iSeeTheChangeButton();
        When.onAppNavSample.iStopTheInteraction();

        Then.onAppNavSample.iCheckThatTheCorrectFESRHandleHasBeenSent({
            appNameLong: "sap.ushell.opa.bootstrap", // This property will be different in a non-test environment.
            appNameShort: "F6407",
            interactionType: 1,
            stepName: "FLP@DEEP_LINK"
        });
    });

    opaTest("Should navigate to another application", function (Given, When, Then) {
        When.onAppNavSample.iClickOnStartAnyIntent();
        Then.onTheBookMarkApp.iCheckThatTheCorrectFESRHandleHasBeenSent({
            appNameLong: "sap.ushell.demo.AppNavSample",
            appNameShort: "F6407",
            interactionType: 2
            // Ignore stepnames like "__link7_press" because of stable ids.
            // We do not want process stepnames for steps within an app anyway.
        });

        When.onAppNavSample.iChangeTheAction("toBookmark");
        When.onAppNavSample.iClickOnToGeneratedLinkButton();

        Then.onTheBookMarkApp.iSeeTheAddBookmarkButton();
        Then.onTheBookMarkApp.iCheckThatTheCorrectFESRHandleHasBeenSent({
            appNameLong: "sap.ushell.demo.bookmark",
            appNameShort: "F6434",
            interactionType: 1,
            stepName: "A2A@F6407"
        });
    });

    opaTest("Should navigate back to the appNavSample", function (Given, When, Then) {
        When.onTheBookMarkApp.iNavigateBack();
        Then.onAppNavSample.iCheckThatTheCorrectFESRHandleHasBeenSent({
            appNameLong: "sap.ushell.demo.AppNavSample",
            appNameShort: "F6407",
            interactionType: 1,
            stepName: "A2A@F6434"
        });

        Then.iTeardownMyFLP();
    });
});
