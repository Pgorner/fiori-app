// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * This OPA journey tests the personalization of the menu bar.
 */
sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ushell/opa/tests/spacesMode/pages/MenuBar",
    "sap/ushell/opa/tests/spacesMode/pages/NavigationBarMenu",
    "sap/ushell/opa/tests/spacesMode/pages/Runtime",
    "sap/ushell/opa/tests/spacesMode/pages/EditMode"
], function (opaTest) {
    "use strict";

    /* global QUnit */

    var oUshellConfig = {
        ushell: {
            menu: {
                personalization: {
                    enabled: true
                }
            },
            // Test with active home app as this is the main scenario
            homeApp: {
                component: {
                    name: "sap.ushell.demo.HomeApp",
                    url: "test-resources/sap/ushell/demoapps/HomeApp",
                    messages: [
                        "opa",
                        "test"
                    ]
                }
            }
        }
    };

    QUnit.module("Menu personalization");

    opaTest("Should open the FLP and and have all the menu entries pinned", function (Given, When, Then) {
        Given.iStartMyFLP("abap", oUshellConfig);

        Then.onTheMenuBar.iSeeTheMenuEntriesInTheOrder(["My Home", "Test Space 1", "Test Space 2", "Custom Tiles Space"]);
        Then.onTheMenuBar.iSeeTheSeparatorAtIndex(1);
    });

    opaTest("Should disable the menu bar personalization button when a page is in edit mode", function (Given, When, Then) {
        When.onTheMenuBar.iClickOnMenuEntry("Test Space 1");
        When.onTheRuntimeComponent.iOpenUserActionsMenu();
        Then.onTheRuntimeComponent.iSeeTheEditModeButton();
        When.onTheRuntimeComponent.iEnterEditMode();

        Then.onTheMenuBar.iSeeThatTheNavigationBarMenuButtonIsDisabled();

        When.onTheEditModeComponent.iCloseEditMode();
        When.onTheMenuBar.iClickOnMenuEntry("My Home");
    });

    opaTest("Should display the pinned spaces in the pinned spaces list", function (Given, When, Then) {
        When.onTheMenuBar.iClickOnThePersonalizationButton();

        Then.onTheNavigationBarMenu.iSeeThePinnedSpacesEntriesInTheOrder(["Test Space 1", "Test Space 2", "Custom Tiles Space"]);
    });

    opaTest("Should rearrange the spaces in the pinned spaces list", function (Given, When, Then) {
        When.onTheNavigationBarMenu.iDragThePinnedSpacesEntry("Custom Tiles Space");
        When.onTheNavigationBarMenu.iDropThePinnedSpacesEntry("before", "Test Space 1");

        Then.onTheNavigationBarMenu.iSeeThePinnedSpacesEntriesInTheOrder(["Custom Tiles Space", "Test Space 1", "Test Space 2"]);
        Then.onTheMenuBar.iSeeTheMenuEntriesInTheOrder(["My Home", "Custom Tiles Space", "Test Space 1", "Test Space 2"]);
    });

    opaTest("Should unpin a space from the pinned spaces tree", function (Given, When, Then) {
        When.onTheNavigationBarMenu.iClickThePinButtonOnThePinnedSpacesMenuEntry("Test Space 2");

        Then.onTheMenuBar.iSeeTheMenuEntriesInTheOrder(["My Home", "Custom Tiles Space", "Test Space 1"]);
        Then.onTheNavigationBarMenu.iSeeThePinnedSpacesEntriesInTheOrder(["Custom Tiles Space", "Test Space 1"]);
    });

    opaTest("Should unpin a space from the all spaces tree", function (Given, When, Then) {
        When.onTheNavigationBarMenu.iClickThePinButtonOnTheAllSpacesMenuEntry("Test Space 1");

        Then.onTheMenuBar.iSeeTheMenuEntriesInTheOrder(["My Home", "Custom Tiles Space"]);
        Then.onTheNavigationBarMenu.iSeeThePinnedSpacesEntriesInTheOrder(["Custom Tiles Space"]);
        Then.onTheMenuBar.iSeeTheSeparatorAtIndex(1);
    });

    opaTest("Should unpin all spaces", function (Given, When, Then) {
        When.onTheNavigationBarMenu.iClickTheUnpinAllSpacesButton();

        Then.onTheMenuBar.iSeeTheMenuEntriesInTheOrder(["My Home"]);
        Then.onTheNavigationBarMenu.iSeeNoPinnedSpacesEntries();
        Then.onTheMenuBar.iSeeTheSeparatorAtIndex(1);
    });

    opaTest("Should still display all spaces in the all spaces list", function (Given, When, Then) {
        Then.onTheNavigationBarMenu.iSeeTheAllSpacesEntriesInTheOrder(["Test Space 1", "Test Space 2", "Custom Tiles Space"]);
    });

    opaTest("Should navigate to the page in an unpinned space with one pages", function (Given, When, Then) {
        When.onTheNavigationBarMenu.iClickTheAllSpacesItem("Test Space 1");

        // For unpinned spaces with one page, the space title is displayed as page title
        Then.onTheRuntimeComponent.iSeeTheRightPageTitle("Test Space 1");
    });

    opaTest("Should navigate to a page in an unpinned space with multiple pages", function (Given, When, Then) {
        Then.iTeardownMyFLP();
        Given.iStartMyFLP("abap", oUshellConfig);
        When.onTheMenuBar.iClickOnThePersonalizationButton();
        When.onTheNavigationBarMenu.iExpandTheSpace("Test Space 2");
        When.onTheNavigationBarMenu.iClickTheAllSpacesItem("Test Page 3");

        // For unpinned spaces with multiple page, the space title and the page title are displayed as page title
        Then.onTheRuntimeComponent.iSeeTheRightPageTitle("Test Space 2 - Test Page 3");
    });

    opaTest("Should pin one space back", function (Given, When, Then) {
        Then.iTeardownMyFLP();
        Given.iStartMyFLP("abap", oUshellConfig);
        When.onTheMenuBar.iClickOnThePersonalizationButton();
        When.onTheNavigationBarMenu.iClickThePinButtonOnTheAllSpacesMenuEntry("Custom Tiles Space");

        Then.onTheMenuBar.iSeeTheMenuEntriesInTheOrder(["My Home", "Custom Tiles Space"]);
        Then.onTheNavigationBarMenu.iSeeThePinnedSpacesEntriesInTheOrder(["Custom Tiles Space"]);
        Then.onTheMenuBar.iSeeTheSeparatorAtIndex(1);
    });

    opaTest("Should navigate to the page in the pinned space", function (Given, When, Then) {
        When.onTheNavigationBarMenu.iClickTheAllSpacesItem("Custom Tiles Space");

        // For pinned spaces with one page the page title is still hidden
        Then.onTheRuntimeComponent.iDontSeeThePageTitle();
        Then.onTheMenuBar.iSeeTheEntryHighlighted("Custom Tiles Space");
    });

    opaTest("Should restart the FLP and keep the personalization state of the menu items", function (Given, When, Then) {
        Then.iTeardownMyFLP();

        var oUshellConfig = {
            ushell: {
                menu: {
                    personalization: {
                        enabled: true
                    }
                },
                homeApp: {
                    component: {
                        name: "sap.ushell.demo.HomeApp",
                        url: "test-resources/sap/ushell/demoapps/HomeApp",
                        messages: [
                            "opa",
                            "test"
                        ]
                    }
                }
            }
        };
        Given.iStartMyFLP("abap", oUshellConfig);

        Then.onTheMenuBar.iSeeTheMenuEntriesInTheOrder(["My Home", "Custom Tiles Space"]);
        Then.onTheMenuBar.iSeeTheSeparatorAtIndex(1);

        Then.iTeardownMyFLP();
    });

});
