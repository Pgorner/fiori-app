// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * ONLY USED FOR TESTING THE CLASSIC HOMEPAGE!
 * @fileoverview OPA tests for the AnchorNavigationBar of the classic homepage.
 * @deprecated since 1.117
 */

sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ushell/opa/tests/header/pages/UserActionsMenu",
    "sap/ushell/opa/tests/header/pages/ShellHeader",
    "sap/ushell/opa/tests/homepage/pages/AnchorNavigationBar",
    "sap/ushell/opa/tests/homepage/pages/AppFinder",
    "sap/ushell/opa/tests/homepage/pages/Homepage",
    "sap/ushell/opa/tests/homepage/pages/UserSettings"
], function (opaTest) {
    "use strict";

    /* global QUnit */

    // TODO
    // Add tests for:
    // - using the Anchor Navigation Bar

    QUnit.module("AnchorNavigationBar: Render only when more-than-one Group exists", {
        before: function () {
            this.defaultConfig = {};
        }
    });

    opaTest("Enable 'Show one group at a time' - AnchorNavBar not rendered", function (Given, When, Then) {
        // START
        Given.iStartMyFLP("cdm", this.defaultConfig, "classic");

        // Actions
        When.onTheHomepage.iPressOnTheUserActionsMenuButton();
        When.onTheUserActionsMenu.iPressOnActionButton("userSettingsBtn");
        When.onTheUserSettings.iPressOnTheHomePageListItem();
        When.onTheUserSettings.iPressOnTheShowOneGroutAtATimeRadioButton();
        When.onTheUserSettings.iPressOnTheSaveButton();

        // Assertion
        Then.onTheAnchorNavigationBar.iShouldNotFindTheAnchorNavigationBar();
    });

    opaTest("Add some tiles - AnchorNavBar should be rendered", function (Given, When, Then) {
        // Actions -> Go to Action Mode
        When.onTheHomepage.iPressOnTheUserActionsMenuButton();
        When.onTheUserActionsMenu.iPressOnActionButton("ActionModeBtn");

        // Actions -> Add some Tiles to "My Home" group
        When.onTheHomepageInActionMode.iPressOnPlusTileInMyHomeGroup();
        When.onTheAppFinder.iPressAllAppsPinButtons();
        When.onShellHeader.iPressTheBackButton();
        When.onTheHomepageInActionMode.iPressCloseToLeave();

        // Assertion
        Then.onTheAnchorNavigationBar.iShouldFindTheAnchorNavigationBar();
    });

    opaTest("Remove all tiles - AnchorNavigationBar should not be rendered", function (Given, When, Then) {
        // Actions -> Remove all tiles from "My Home" group
        When.onTheHomepage.iPressOnTheUserActionsMenuButton();
        When.onTheUserActionsMenu.iPressOnActionButton("ActionModeBtn");
        When.onTheHomepageInActionMode.iPressOnPlusTileInMyHomeGroup();
        When.onTheAppFinder.iPressAllAppsPinButtons();
        When.onShellHeader.iPressTheBackButton();
        When.onTheHomepageInActionMode.iPressCloseToLeave();

        // Assertion
        Then.onTheAnchorNavigationBar.iShouldNotFindTheAnchorNavigationBar();

        // DONE
        Then.iTeardownMyFLP();
    });
});
