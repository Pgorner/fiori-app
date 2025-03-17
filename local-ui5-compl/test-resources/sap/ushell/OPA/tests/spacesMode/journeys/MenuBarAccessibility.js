// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * The main OPA journey for the menu bar personalization is 'MenuBarPersonalization'.
 * This OPA journey only tests the accessibility.
 *
 * This needs an own journey as a journey should never contain to many tests.
 */
sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ui/events/KeyCodes",
    "sap/ushell/opa/tests/spacesMode/pages/MenuBar",
    "sap/ushell/opa/tests/spacesMode/pages/NavigationBarMenu",
    "sap/ushell/opa/tests/spacesMode/pages/Runtime",
    "sap/ushell/opa/tests/common/pages/Common"
], function (opaTest, KeyCodes) {
    "use strict";

    /* global QUnit */

    QUnit.module("MenuBar accessibility");

    var oUshellConfig = {
        ushell: {
            menu: {
                personalization: {
                    enabled: true
                }
            }
        }
    };

    opaTest("Should open the FLP and and have all the menu entries pinned", function (Given, When, Then) {
        Given.iStartMyFLP("abap", oUshellConfig);

        Then.onTheMenuBar.iSeeTheSeparatorAtIndex(0);
        Then.onTheMenuBar.iSeeTheMenuEntriesInTheOrder(["Test Space 1", "Test Space 2", "Custom Tiles Space"]);
    });

    opaTest("The focus is placed on the first pinned space when opening the menu", function (Given, When, Then) {
        When.onTheBrowser.iPressShiftF6();
        When.onTheBrowser.iPressKey(KeyCodes.ENTER);
        Then.onTheNavigationBarMenu.iSeeTheFocusOnPinnedSpace("Test Space 1");
        Then.onTheMenuBar.iSeeTheSeparatorAtIndex(0);
        Then.onTheMenuBar.iSeeTheMenuEntriesInTheOrder(["Test Space 1", "Test Space 2", "Custom Tiles Space"]);
        Then.onTheNavigationBarMenu.iSeeThePinnedSpacesEntriesInTheOrder(["Test Space 1", "Test Space 2", "Custom Tiles Space"]);
    });

    opaTest("Arrow navigation works", function (Given, When, Then) {
        When.onTheBrowser.iPressKey(KeyCodes.ARROW_DOWN);
        Then.onTheNavigationBarMenu.iSeeTheFocusOnPinnedSpace("Test Space 2");
        Then.onTheMenuBar.iSeeTheSeparatorAtIndex(0);
        Then.onTheMenuBar.iSeeTheMenuEntriesInTheOrder(["Test Space 1", "Test Space 2", "Custom Tiles Space"]);
        Then.onTheNavigationBarMenu.iSeeThePinnedSpacesEntriesInTheOrder(["Test Space 1", "Test Space 2", "Custom Tiles Space"]);
    });

    opaTest("After pressing the pin button, the space is unpinned and the focus is placed correctly.", function (Given, When, Then) {
        // browser tab events can not be simulated with JavaScript
        When.onTheNavigationBarMenu.iPlaceTheFocusOnPinnedSpacePinButton("Test Space 2");
        Then.onTheNavigationBarMenu.iSeeTheFocusOnPinnedSpacePinButton("Test Space 2");
        When.onTheBrowser.iPressKey(KeyCodes.ENTER);
        Then.onTheMenuBar.iSeeTheSeparatorAtIndex(0);
        Then.onTheMenuBar.iSeeTheMenuEntriesInTheOrder(["Test Space 1", "Custom Tiles Space"]);
        Then.onTheNavigationBarMenu.iSeeThePinnedSpacesEntriesInTheOrder(["Test Space 1", "Custom Tiles Space"]);
        Then.onTheNavigationBarMenu.iSeeTheFocusOnPinnedSpace("Custom Tiles Space");
    });

    opaTest("Focus is correct after swapping pinned spaces. (up)", function (Given, When, Then) {
        When.onTheBrowser.iPressKeyWithModifier(KeyCodes.ARROW_UP);
        Then.onTheMenuBar.iSeeTheSeparatorAtIndex(0);
        Then.onTheMenuBar.iSeeTheMenuEntriesInTheOrder(["Custom Tiles Space", "Test Space 1"]);
        Then.onTheNavigationBarMenu.iSeeThePinnedSpacesEntriesInTheOrder(["Custom Tiles Space", "Test Space 1"]);
        Then.onTheNavigationBarMenu.iSeeTheFocusOnPinnedSpace("Custom Tiles Space");
    });

    opaTest("Focus is correct after swapping pinned spaces. (down)", function (Given, When, Then) {
        When.onTheBrowser.iPressKeyWithModifier(KeyCodes.ARROW_DOWN);
        Then.onTheMenuBar.iSeeTheSeparatorAtIndex(0);
        Then.onTheMenuBar.iSeeTheMenuEntriesInTheOrder(["Test Space 1", "Custom Tiles Space"]);
        Then.onTheNavigationBarMenu.iSeeThePinnedSpacesEntriesInTheOrder(["Test Space 1", "Custom Tiles Space"]);
        Then.onTheNavigationBarMenu.iSeeTheFocusOnPinnedSpace("Custom Tiles Space");
    });

    opaTest("After pressing the pin button, the space is unpinned and the focus is placed correctly.", function (Given, When, Then) {
        // browser tab events can not be simulated with JavaScript
        When.onTheNavigationBarMenu.iPlaceTheFocusOnPinnedSpacePinButton("Custom Tiles Space");
        Then.onTheNavigationBarMenu.iSeeTheFocusOnPinnedSpacePinButton("Custom Tiles Space");
        When.onTheBrowser.iPressKey(KeyCodes.ENTER);
        Then.onTheMenuBar.iSeeTheSeparatorAtIndex(0);
        Then.onTheMenuBar.iSeeTheMenuEntriesInTheOrder(["Test Space 1"]);
        Then.onTheNavigationBarMenu.iSeeThePinnedSpacesEntriesInTheOrder(["Test Space 1"]);
        Then.onTheNavigationBarMenu.iSeeTheFocusOnPinnedSpace("Test Space 1");
    });

    opaTest("After pressing the pin button, the space is pinned and the focus is placed correctly.", function (Given, When, Then) {
        Then.iTeardownMyFLP();
        Given.iStartMyFLP("abap", oUshellConfig);
        When.onTheBrowser.iPressShiftF6();
        When.onTheBrowser.iPressKey(KeyCodes.ENTER);
        // browser tab events can not be simulated with JavaScript
        When.onTheNavigationBarMenu.iPlaceTheFocusOnAllSpace("Test Space 1");
        Then.onTheNavigationBarMenu.iSeeTheFocusOnAllSpace("Test Space 1");
        When.onTheBrowser.iPressKey(KeyCodes.ARROW_DOWN);
        Then.onTheNavigationBarMenu.iSeeTheFocusOnAllSpace("Test Space 2");
        // browser tab events can not be simulated with JavaScript
        When.onTheNavigationBarMenu.iPlaceTheFocusOnAllSpacePinButton("Test Space 2");
        Then.onTheNavigationBarMenu.iSeeTheFocusOnAllSpacePinButton("Test Space 2");
        When.onTheBrowser.iPressKey(KeyCodes.ENTER);
        Then.onTheMenuBar.iSeeTheSeparatorAtIndex(0);
        Then.onTheMenuBar.iSeeTheMenuEntriesInTheOrder(["Test Space 1", "Test Space 2"]);
        Then.onTheNavigationBarMenu.iSeeThePinnedSpacesEntriesInTheOrder(["Test Space 1", "Test Space 2"]);
        Then.onTheNavigationBarMenu.iSeeTheFocusOnAllSpacePinButton("Test Space 2");

        Then.iTeardownMyFLP();
    });
});
