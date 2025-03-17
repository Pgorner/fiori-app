// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * This OPA journey will test the personalization of an FLP page via edit mode.
 */
sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ushell/resources",
    "sap/ushell/opa/tests/spacesMode/pages/AppFinder",
    "sap/ushell/opa/tests/spacesMode/pages/Bookmark",
    "sap/ushell/opa/tests/spacesMode/pages/EditMode",
    "sap/ushell/opa/tests/spacesMode/pages/Runtime"
], function (opaTest, ushellResources) {
    "use strict";

    /* global QUnit */

    QUnit.module("Appfinder tests");

    opaTest("Should open the FLP and open app finder.", function (Given, When, Then) {
        Given.iStartMyFLP("abap");

        When.onTheRuntimeComponent.iOpenUserActionsMenu();
        When.onTheRuntimeComponent.iEnterAppFinder();

        When.onTheAppFinderComponent.iClickThePinOnTheCatalogItemWithTitle("DefaultSectionTile");
        When.onTheAppFinderComponent.iToggleTheTileAssignmentToAPageWithTitle("UI2 FLP Demo - Test Page");
        When.onTheAppFinderComponent.iClickOkOnThePopover();

        When.onTheRuntimeComponent.iNavigateBack();

        Then.onTheEditModeComponent.iSeeTheDefaultSection();
    });

    opaTest("Entering edit mode shows personalization options.", function (Given, When, Then) {
        When.onTheRuntimeComponent.iOpenUserActionsMenu();
        When.onTheRuntimeComponent.iEnterEditMode();

        Then.onTheEditModeComponent.iSeeTheDefaultSectionHasAText();
    });

    opaTest("Dragging the last visualization out of the default section removes the default section.", function (Given, When, Then) {
        When.onTheEditModeComponent.iDragAVisualizationFromDefaultSectionToSection("DefaultSectionTile", "Navigation");

        Then.onTheRuntimeComponent.iSeeTheVisualizationInTheSection("DefaultSectionTile", "Navigation");
        Then.onTheRuntimeComponent.iDontSeeTheSection(ushellResources.i18n.getText("DefaultSection.Title"));

        Then.iTeardownMyFLP();
    });

    opaTest("Should click on the pin button and open the popover", function (Given, When, Then) {
        Given.iStartMyFLP("abap");

        When.onTheRuntimeComponent.iOpenUserActionsMenu();
        When.onTheRuntimeComponent.iEnterAppFinder();

        When.onTheAppFinderComponent.iClickThePinOnTheCatalogItemWithTitle("DefaultSectionTile2");

        Then.onTheAppFinderComponent.iSeeThePopover();
    });

    opaTest("After selecting a tile and clicking on cancel on the popover, the discard dialog should be shown.", function (Given, When, Then) {
        When.onTheAppFinderComponent.iToggleTheTileAssignmentToAPageWithTitle("Test Page 2");
        When.onTheAppFinderComponent.iClickCancelOnThePopover();

        Then.onTheAppFinderComponent.iSeeDiscardDialog();
    });

    opaTest("After clicking on discard, no tile should be added to the first page.", function (Given, When, Then) {
        When.onTheAppFinderComponent.iClickOnTheButton("Discard");
        When.onTheRuntimeComponent.iNavigateBack();

        Then.onTheRuntimeComponent.iDontSeeTheTile("DefaultSectionTile2");
    });

    opaTest("Clicking on a tile should trigger navigation", function (Given, When, Then) {
        When.onTheRuntimeComponent.iOpenUserActionsMenu();
        When.onTheRuntimeComponent.iEnterAppFinder();
        When.onTheAppFinderComponent.iClickOnTheTileWithTitle("App Navigation Sample 2");

        Then.onTheBookmarkComponent.iSeeTheAppTitle("AppNavSample2(Master View)");

        Then.iTeardownMyFLP();
    });

    opaTest("Opening the appfinder you can search for an application", function (Given, When, Then) {
        Given.iStartMyFLP("abap");

        When.onTheRuntimeComponent.iOpenUserActionsMenu();
        When.onTheRuntimeComponent.iEnterAppFinder();
        When.onTheAppFinderComponent.iSearchForAnApp("DefaultSectionTile2", "appFinderSearch");

        Then.onTheAppFinderComponent.iSeeTheTile("DefaultSectionTile2");
    });

    opaTest("Open popover to pin application", function (Given, When, Then) {
        When.onTheAppFinderComponent.iClickThePinOnTheCatalogItemWithTitle("DefaultSectionTile2");
        When.onTheAppFinderComponent.iSearchForAnApp("Test Page", "sapUshellVisualizationOrganizerSearch");

        Then.onTheAppFinderComponent.iSeeThePageInList("UI2 FLP Demo - Test Page");
    });

    opaTest("Application is pinned and checked on the homepage.", function (Given, When, Then) {
        When.onTheAppFinderComponent.iToggleTheTileAssignmentToAPageWithTitle("UI2 FLP Demo - Test Page");
        When.onTheAppFinderComponent.iClickOkOnThePopover();
        When.onTheRuntimeComponent.iNavigateBack();
        When.onTheRuntimeComponent.iNavigateBack();

        Then.onTheRuntimeComponent.iSeeTheVisualizationInTheSection("DefaultSectionTile2", "Recently Added Apps");
    });

    opaTest("Open popover to filter list for only selected pages.", function (Given, When, Then) {
        When.onTheRuntimeComponent.iOpenUserActionsMenu();
        When.onTheRuntimeComponent.iEnterAppFinder();

        When.onTheAppFinderComponent.iClickThePinOnTheCatalogItemWithTitle("DefaultSectionTile2");
        When.onTheAppFinderComponent.iClickTheToggleButton();
        Then.onTheAppFinderComponent.iSeeThePageInList("UI2 FLP Demo - Test Page");
    });

    opaTest("Unpin the same application and check on homepage", function (Given, When, Then) {
        When.onTheAppFinderComponent.iToggleTheTileAssignmentToAPageWithTitle("UI2 FLP Demo - Test Page");
        When.onTheAppFinderComponent.iClickOkOnThePopover();
        When.onTheRuntimeComponent.iNavigateBack();

        Then.onTheRuntimeComponent.iCannotSeeTheViz("DefaultSectionTile2");
        Then.iTeardownMyFLP();
    });
});
