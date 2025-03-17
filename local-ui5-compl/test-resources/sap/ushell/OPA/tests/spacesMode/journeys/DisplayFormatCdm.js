// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/* This OPA5 test confirms on the CDM platform in spaces mode that the user can change the tile display format
 * (standard, standardWide, compact, flat, flatWide) of standard and custom tiles as desired with the tile action menu.
 * The test also confirms that the tile display format is kept when a tile is moved between sections or pinned with the app finder.
 * Drag & drop is not used.
 */
sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ushell/library",
    "sap/ushell/opa/tests/spacesMode/pages/AppFinder",
    "sap/ushell/opa/tests/spacesMode/pages/EditMode",
    "sap/ushell/opa/tests/spacesMode/pages/MenuBar",
    "sap/ushell/opa/tests/spacesMode/pages/Runtime"
], function (opaTest, ushellLibrary) {
    "use strict";

    // shortcut for sap.ushell.DisplayFormat
    var DisplayFormat = ushellLibrary.DisplayFormat;

    /* global QUnit */

    /*
    Mock the ui2services, they are not necessary for the tests and not available in the safetyNet.
    We do this by mapping the required files to an arbitrary file (which is required because ui5 needs something to load).
    Afterwards, we map the result to an empty global object to avoid side effects.
    */
    window.emptyObject = { empty: true };

    sap.ui.loader.config({
        map: {
            "sap/ushell/services/PageBuilding": {
                "sap/ui2/srvc/factory": "sap/ushell/adapters/local/PageBuildingAdapter",
                "sap/ui2/srvc/page": "sap/ushell/adapters/local/PageBuildingAdapter"
            }
        },
        shim: {
            "sap/ui2/srvc/factory": {
                exports: "emptyObject"
            },
            "sap/ui2/srvc/page": {
                exports: "emptyObject"
            }
        }
    });

    QUnit.module("Platform test");

    opaTest("Should open the cdm FLP", function (Given, When, Then) {
        Given.iStartMyFLP("cdm", {}, "cdmSpaces");
        Then.onTheRuntimeComponent.iSeeTheRightIconTabFilterSelected("Sales Space");
    });

    opaTest("Should display custom tiles", function (Given, When, Then) {
        When.onTheMenuBar.iClickOnMenuEntry("Sales Space");

        Then.onTheRuntimeComponent.iSeeTilesInSection(3, "S/4 - Sales Orders");

    });

    opaTest("Should enter edit mode", function (Given, When, Then) {
        When.onTheRuntimeComponent.iOpenUserActionsMenu();
        When.onTheRuntimeComponent.iEnterEditMode();
        Then.onTheRuntimeComponent.iSeeTheSectionWithNameAtIndex("S/4 - Sales Orders", 0);
    });

    opaTest("Pressing 'Add Section' adds a new Section.", function (Given, When, Then) {
        When.onTheEditModeComponent.iPressTheAddSectionButtonWithIndex(0);
        Then.onTheRuntimeComponent.iSeeTheSectionWithNameAtIndex("", 1);
        Then.onTheEditModeComponent.iSeeTheSectionHasAnInputField("");
    });

    opaTest("Entering a new title for a section renames the section.", function (Given, When, Then) {
        When.onTheEditModeComponent.iEnterANewTitleForASection("", "My New Title");
        Then.onTheRuntimeComponent.iSeeTheSectionWithNameAtIndex("My New Title", 1);
    });

    opaTest("A news tile moved via action menu keeps its format.", function (Given, When, Then) {
        When.onTheEditModeComponent.iClickTheVisualization("News");
        When.onTheEditModeComponent.iClickTheMoveButton();
        When.onTheEditModeComponent.iClickOnTheListEntryWithTitle("My New Title");
        Then.onTheRuntimeComponent.iSeeACdmTileWithPropertiesInSection("My New Title", "News", "no subtitle", DisplayFormat.StandardWide);
    });

    opaTest("Should change the displayFormat of a news tile to compact", function (Given, When, Then) {
        When.onTheEditModeComponent.iClickTheVisualization("News");
        When.onTheEditModeComponent.iClickTheConvertToLinkButton();
        Then.onTheRuntimeComponent.iSeeACdmLinkWithPropertiesInSection("My New Title", "News", "no subtitle", DisplayFormat.Compact);
    });

    opaTest("A compact tile moved via action menu keeps its format.", function (Given, When, Then) {
        When.onTheEditModeComponent.iClickTheCompactVisualization("News");
        When.onTheEditModeComponent.iClickTheMoveButton();
        When.onTheEditModeComponent.iClickOnTheListEntryWithTitle("S/4 - Sales Orders");
        Then.onTheRuntimeComponent.iSeeACdmLinkWithPropertiesInSection("S/4 - Sales Orders", "News", "no subtitle", DisplayFormat.Compact);
    });

    opaTest("Should change the displayFormat of a compact news tile to standardWide", function (Given, When, Then) {
        When.onTheEditModeComponent.iClickTheCompactVisualization("News");
        When.onTheEditModeComponent.iClickTheConvertToStandardWideButton();
        Then.onTheRuntimeComponent.iSeeACdmTileWithPropertiesInSection("S/4 - Sales Orders", "News", "no subtitle", DisplayFormat.StandardWide);
    });

    opaTest("A news tile moved via action menu keeps its format.", function (Given, When, Then) {
        When.onTheEditModeComponent.iClickTheVisualization("News");
        When.onTheEditModeComponent.iClickTheMoveButton();
        When.onTheEditModeComponent.iClickOnTheListEntryWithTitle("My New Title");
        Then.onTheRuntimeComponent.iSeeACdmTileWithPropertiesInSection("My New Title", "News", "no subtitle", DisplayFormat.StandardWide);
    });

    opaTest("Should enter the AppFinder", function (Given, When, Then) {
        When.onTheRuntimeComponent.iOpenUserActionsMenu();
        When.onTheRuntimeComponent.iEnterAppFinder();

        Then.onTheAppFinderComponent.iSeeTheCatalogEntryContainerWithTitle("Custom Tiles");
    });

    opaTest("Should Unpin the news tile", function (Given, When, Then) {
        When.onTheAppFinderComponent.iClickThePinOnTheCatalogItemWithTitle("News");
        When.onTheAppFinderComponent.iToggleTheTileAssignmentToAPageWithTitle("The First Page");
        When.onTheAppFinderComponent.iClickOkOnThePopover();

        When.onTheRuntimeComponent.iNavigateBack();

        Then.onTheEditModeComponent.iSeeTheSectionHasTheCorrectNoVisualizationText("My New Title");
    });

    opaTest("Should enter the AppFinder", function (Given, When, Then) {
        When.onTheRuntimeComponent.iOpenUserActionsMenu();
        When.onTheRuntimeComponent.iEnterAppFinder();

        Then.onTheAppFinderComponent.iSeeTheCatalogEntryContainerWithTitle("Custom Tiles");
    });

    opaTest("Should pin the news tile with the correct display format", function (Given, When, Then) {
        When.onTheAppFinderComponent.iClickThePinOnTheCatalogItemWithTitle("News");
        When.onTheAppFinderComponent.iToggleTheTileAssignmentToAPageWithTitle("The First Page");
        When.onTheAppFinderComponent.iClickOkOnThePopover();

        When.onTheRuntimeComponent.iNavigateBack();

        Then.onTheRuntimeComponent.iSeeACdmTileWithPropertiesInSection("Recently Added Apps", "News", "no subtitle", DisplayFormat.StandardWide);

        Then.iTeardownMyFLP();
    });
});
