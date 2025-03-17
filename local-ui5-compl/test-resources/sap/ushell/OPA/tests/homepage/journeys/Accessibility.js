// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * ONLY USED FOR TESTING THE CLASSIC HOMEPAGE!
 * @fileoverview OPA tests for the Accessibility of the classic homepage.
 * @deprecated since 1.117
 */

sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ushell/opa/tests/homepage/pages/AnchorNavigationBar",
    "sap/ushell/opa/tests/header/pages/UserActionsMenu",
    "sap/ushell/opa/tests/header/pages/ShellHeader",
    "sap/ushell/opa/tests/homepage/pages/Homepage",
    "sap/ushell/opa/tests/common/pages/Common",
    "sap/ushell/resources"
], function (opaTest, AnchorNavigationBar, UserActionsMenu, ShellHeader, Homepage, Common, resources) {
    "use strict";

    /* global QUnit */

    /**
     * This OPA journey will test the accessibilty features of the classic homepage.
     */

    QUnit.module("Accessibility tests");

    opaTest("Should open the FLP", function (Given, When, Then) {
        Given.iStartMyFLP("cdm", {
            services: {
                CommonDataModel: {
                    adapter: {
                        config: {
                            siteDataUrl: "../OPA/testSiteData/cdmTestSiteWithMultipleGroups.json"
                        }
                    }
                }
            }
        }, "classic");
        When.onTheBrowser.iHideQUnit();
        Then.onTheHomepage.iShouldSeeFocusOnTile("firstGroup-firstTile");
    });

    opaTest("Should rotate the focus via F6 forwards.", function (Given, When, Then) {
        When.onTheBrowser.iPressF6();
        Then.onShellHeader.iShouldSeeFocusOnLogo();
        When.onTheBrowser.iPressF6();
        Then.onTheAnchorNavigationBar.iShouldSeeFocusOnAnchorItem("S/4 - Sales Orders");
        When.onTheBrowser.iPressF6();
        Then.onTheHomepage.iShouldSeeFocusOnTile("firstGroup-firstTile");
    });

    opaTest("Should rotate the focus via F6 backwards.", function (Given, When, Then) {
        When.onTheBrowser.iPressShiftF6();
        Then.onTheAnchorNavigationBar.iShouldSeeFocusOnAnchorItem("S/4 - Sales Orders");
        When.onTheBrowser.iPressShiftF6();
        Then.onShellHeader.iShouldSeeFocusOnLogo();
        When.onTheBrowser.iPressShiftF6();
        Then.onTheHomepage.iShouldSeeFocusOnTile("firstGroup-firstTile");
    });

    // EDIT MODE
    opaTest("Should enter the editMode", function (Given, When, Then) {
        When.onTheHomepage.iPressOnTheUserActionsMenuButton();
        Then.onTheUserActionsMenu.iShouldSeeUserActionsMenuPopover();
        When.onTheUserActionsMenu.iPressOnActionButton("ActionModeBtn");
        Then.onTheHomepage.iShouldSeeHomepageInEditMode();
        Then.onTheHomepage.iShouldSeeFooterInEditMode();
    });

    opaTest("Should rotate the focus via F6 forwards in editMode.", function (Given, When, Then) {
        When.onTheBrowser.iPressF6();
        Then.onTheAnchorNavigationBar.iShouldSeeFocusOnAnchorItem("S/4 - Sales Orders");
        When.onTheBrowser.iPressF6();
        // issue: classic homepage could no remember last tile
        Then.onTheHomepage.iShouldSeeFocusOnPlusTileOfGroup("My Home");
        When.onTheBrowser.iPressF6();
        Then.onTheHomepageInActionMode.iShouldSeeFocusOnCloseButton();
        When.onTheBrowser.iPressF6();
        Then.onShellHeader.iShouldSeeFocusOnLogo();
        When.onTheBrowser.iPressF6();
        Then.onTheAnchorNavigationBar.iShouldSeeFocusOnAnchorItem("My Home");
    });

    opaTest("Should rotate the focus via F6 backwards in editMode.", function (Given, When, Then) {
        Then.onTheAnchorNavigationBar.iShouldSeeFocusOnAnchorItem("My Home");
        When.onTheBrowser.iPressShiftF6();
        Then.onShellHeader.iShouldSeeFocusOnLogo();
        When.onTheBrowser.iPressShiftF6();
        Then.onTheHomepageInActionMode.iShouldSeeFocusOnCloseButton();
        When.onTheBrowser.iPressShiftF6();
        Then.onTheHomepage.iShouldSeeFocusOnPlusTileOfGroup("My Home");
        When.onTheBrowser.iPressShiftF6();
        Then.onTheAnchorNavigationBar.iShouldSeeFocusOnAnchorItem("My Home");
    });

    opaTest("Should close the FLP", function (Given, When, Then) {
        When.onTheBrowser.iShowQUnit();
        Then.onTheAnchorNavigationBar.iShouldSeeFocusOnAnchorItem("My Home");
        Then.iTeardownMyFLP();
    });
});
