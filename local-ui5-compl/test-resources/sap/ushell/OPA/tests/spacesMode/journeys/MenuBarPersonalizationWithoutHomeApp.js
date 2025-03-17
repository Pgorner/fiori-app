// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * The main OPA journey for the menu bar personalization is 'MenuBarPersonalization'.
 * This OPA journey only tests special behavior for when there is no home app.
 *
 * This needs an own journey as it is not possible to restart the FLP without home app
 * once it was started with home app. This is because the home app switch is evaluated
 * during module loading of the renderer which is only done once.
 */
sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ushell/opa/tests/spacesMode/pages/MenuBar",
    "sap/ushell/opa/tests/spacesMode/pages/NavigationBarMenu",
    "sap/ushell/opa/tests/spacesMode/pages/Runtime"
], function (opaTest) {
    "use strict";

    /* global QUnit */

    QUnit.module("Menu personalization without home app");

    opaTest("Should open the FLP and and have all the menu entries pinned", function (Given, When, Then) {
        var oUshellConfig = {
            ushell: {
                menu: {
                    personalization: {
                        enabled: true
                    }
                }
            }
        };

        Given.iStartMyFLP("abap", oUshellConfig);

        Then.onTheMenuBar.iSeeTheSeparatorAtIndex(0);
        Then.onTheMenuBar.iSeeTheMenuEntriesInTheOrder(["Test Space 1", "Test Space 2", "Custom Tiles Space"]);
    });

    opaTest("Should unpin a space from the pinned spaces tree", function (Given, When, Then) {
        When.onTheMenuBar.iClickOnThePersonalizationButton();
        When.onTheNavigationBarMenu.iClickThePinButtonOnThePinnedSpacesMenuEntry("Test Space 1");

        Then.onTheMenuBar.iSeeTheSeparatorAtIndex(0);
        Then.onTheMenuBar.iSeeTheMenuEntriesInTheOrder(["Test Space 2", "Custom Tiles Space"]);
        Then.onTheNavigationBarMenu.iSeeThePinnedSpacesEntriesInTheOrder(["Test Space 2", "Custom Tiles Space"]);
    });

    opaTest("Should restart the FLP and start with the first pinned space on #Shell-home", function (Given, When, Then) {
        Then.iTeardownMyFLP();

        var oUshellConfig = {
            ushell: {
                menu: {
                    personalization: {
                        enabled: true
                    }
                }
            }
        };

        Given.iStartMyFLP("abap", oUshellConfig);

        Then.onTheMenuBar.iSeeTheSeparatorAtIndex(0);
        Then.onTheMenuBar.iSeeTheMenuEntriesInTheOrder(["Test Space 2", "Custom Tiles Space"]);
        Then.onTheMenuBar.iSeeTheEntryHighlighted("Test Space 2");
        Then.onTheRuntimeComponent.iSeeTheRightPageTitle("Test Page 2");
    });
});
