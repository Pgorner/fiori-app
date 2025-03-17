// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ui/events/KeyCodes",
    "sap/ushell/opa/tests/spacesMode/pages/HierarchyMenu",
    "sap/ushell/opa/tests/header/pages/AllMyAppsMenu",
    "sap/ushell/opa/tests/header/pages/ShellHeader",
    "sap/ushell/opa/tests/common/pages/Common"
], function (opaTest, KeyCodes) {
    "use strict";
    /* global QUnit */
    QUnit.module("Runtime tests");
    opaTest("There should be an entry in the hierarchy menu reflecting the origin page.", function (Given, When, Then) {
        Given.iStartMyFLP("abap");
        Then.onTheRuntimeComponent.iSeeTheAppNavSampleTile();
        When.onTheRuntimeComponent.iClickOnAppNavSampleTile();
        Then.onTheRuntimeComponent.iSeeTheBackButton();
        When.onTheRuntimeComponent.iClickOnTheHierarchyMenu();
        Then.onTheRuntimeComponent.iSeeEntryWithTitleInTheHierarchyMenu("UI2 FLP Demo - Test Page");
        Then.iTeardownMyFLP({
            deletePersonalization: false
        });
    });
    opaTest("The origin page entry in the hierarchy menu navigates to the origin page.", function (Given, When, Then) {
        Given.iStartMyFLP("abap");
        Then.onTheRuntimeComponent.iSeeTheAppNavSampleTile();
        When.onTheRuntimeComponent.iClickOnAppNavSampleTile();
        Then.onTheRuntimeComponent.iSeeTheBackButton();
        When.onTheRuntimeComponent.iClickOnTheHierarchyMenu();
        Then.onTheRuntimeComponent.iSeeEntryWithTitleInTheHierarchyMenu("UI2 FLP Demo - Test Page");
        When.onTheRuntimeComponent.iClickOnTheHierarchyMenuEntry("UI2 FLP Demo - Test Page");
        Then.onTheRuntimeComponent.iSeeTheAppNavSampleTile();
        Then.iTeardownMyFLP({
            deletePersonalization: false
        });
    });
    opaTest("The app title is shown as the first entry of the hierarchy menu.", function (Given, When, Then) {
        Given.iStartMyFLP("abap");
        Then.onTheRuntimeComponent.iSeeTheAppNavSampleTile();
        When.onTheRuntimeComponent.iClickOnAppNavSampleTile();
        Then.onTheRuntimeComponent.iSeeTheBackButton();
        When.onTheRuntimeComponent.iClickOnTheHierarchyMenu();
        Then.onTheRuntimeComponent.iSeeTheAppTitleAsFirstEntryOfTheNavigationMenu();
        Then.iTeardownMyFLP({
            deletePersonalization: false
        });
    });
    opaTest("Opens and closes the all my apps menu", function (Given, When, Then) {
        Given.iStartMyFLP("abap", {}, "spaces");
        When.onTheRuntimeComponent.iClickOnAppNavSampleTile();
        Then.onTheRuntimeComponent.iSeeTheBackButton();
        When.onTheRuntimeComponent.iClickOnTheHierarchyMenu();
        When.onTheRuntimeComponent.iClickOnTheHierarchyMenuAllMyAppsButton();
        Then.onTheAllMyAppsMenu.iSeeTheOpenMenu();
        When.onTheAllMyAppsMenu.iPressTheBackButton();
        Then.onTheRuntimeComponent.iSeeEntryWithTitleInTheHierarchyMenu("UI2 FLP Demo - Test Page");
        Then.iTeardownMyFLP({
            deletePersonalization: false
        });
    });
    opaTest("Keyboard Navigation.", function (Given, When, Then) {
        Given.iStartMyFLP("abap");
        Then.onTheRuntimeComponent.iSeeTheAppNavSampleTile();
        When.onTheRuntimeComponent.iClickOnAppNavSampleTile();
        Then.onTheRuntimeComponent.iSeeTheBackButton();
        When.onTheRuntimeComponent.iClickOnTheHierarchyMenu();
        Then.onTheRuntimeComponent.iSeeTheAppTitleAsFirstEntryOfTheNavigationMenu();
        Then.onTheRuntimeComponent.iSeeFocusOnTheHierarchyListItem(1);
        When.onTheBrowser.iPressKey(KeyCodes.ARROW_DOWN);
        Then.onTheRuntimeComponent.iSeeFocusOnTheHierarchyListItem(2);
        When.onTheBrowser.iPressKey(KeyCodes.TAB);
        Then.onTheRuntimeComponent.iSeeFocusOnTheMiniTile(1);
        When.onTheBrowser.iPressKey(KeyCodes.ARROW_DOWN);
        Then.onTheRuntimeComponent.iSeeFocusOnTheMiniTile(4);
        When.onTheBrowser.iPressKey(KeyCodes.ARROW_RIGHT);
        Then.onTheRuntimeComponent.iSeeFocusOnTheMiniTile(5);
        When.onTheBrowser.iPressKey(KeyCodes.TAB);
        Then.onTheRuntimeComponent.iSeeFocusOnTheAllMyAppsButton();
        When.onTheBrowser.iPressKey(KeyCodes.SPACE);
        Then.onTheAllMyAppsMenu.iSeeTheOpenMenu();
        // the back button is not pressed with the keyboard as the focus handling
        // of the all my apps popup is currently messed up
        When.onTheAllMyAppsMenu.iPressTheBackButton();
        Then.onTheRuntimeComponent.iSeeFocusOnTheHierarchyListItem(2);
        When.onTheBrowser.iPressKey(KeyCodes.ESCAPE);
        Then.onShellHeader.iShouldSeeFocusOnAppTitle();
        Then.iTeardownMyFLP({
            deletePersonalization: false
        });
    });
});
