// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/* This OPA5 test confirms on the ABAP platform in spaces mode that the user can change the tile display format
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
                "sap/ushell_abap/pbServices/ui2/Factory": "sap/ushell/adapters/local/PageBuildingAdapter",
                "sap/ushell_abap/pbServices/ui2/Page": "sap/ushell/adapters/local/PageBuildingAdapter"
            }
        },
        shim: {
            "sap/ushell_abap/pbServices/ui2/Factory": {
                exports: "emptyObject"
            },
            "sap/ushell_abap/pbServices/ui2/Page": {
                exports: "emptyObject"
            }
        }
    });

    QUnit.module("Platform test");

    opaTest("Should open the abap / local FLP", function (Given, When, Then) {
        Given.iStartMyFLP("abap");
        Then.onTheRuntimeComponent.iSeeTheRightIconTabFilterSelected("Test Space 1");
    });

    opaTest("Should display custom tiles", function (Given, When, Then) {
        When.onTheMenuBar.iClickOnMenuEntry("Custom Tiles Space");

        Then.onTheRuntimeComponent.iSeeTheRightIconTabFilterSelected("Custom Tiles Space");

        Then.onTheRuntimeComponent.iSeeAGenericTileWithPropertiesInSection("Custom Tile Test Section", "Custom Tile 1", "Standard", DisplayFormat.Standard);
        Then.onTheRuntimeComponent.iSeeAGenericTileWithPropertiesInSection("Custom Tile Test Section", "Custom Tile 2", "StandardWide", DisplayFormat.StandardWide);
        Then.onTheRuntimeComponent.iSeeAGenericTileWithPropertiesInSection("Custom Tile Test Section", "Custom Tile 3", "FlatWide", DisplayFormat.FlatWide);
        Then.onTheRuntimeComponent.iSeeAGenericTileWithPropertiesInSection("Custom Tile Test Section", "Custom Tile 4", "Compact", DisplayFormat.Compact);
        Then.onTheRuntimeComponent.iSeeAGenericTileWithPropertiesInSection("Custom Tile Test Section", "Custom Tile 5", "Flat", DisplayFormat.Flat);
    });

    opaTest("Should enter edit mode", function (Given, When, Then) {
        When.onTheRuntimeComponent.iOpenUserActionsMenu();
        When.onTheRuntimeComponent.iEnterEditMode();
        Then.onTheRuntimeComponent.iSeeTheSectionWithNameAtIndex("Custom Tile Test Section", 0);
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

    opaTest("A non-custom dynamic standard tile moved via action menu keeps its format.", function (Given, When, Then) {
        When.onTheEditModeComponent.iClickTheVisualization("Dynamic Tile");
        When.onTheEditModeComponent.iClickTheMoveButton();
        When.onTheEditModeComponent.iClickOnTheListEntryWithTitle("My New Title");
        Then.onTheRuntimeComponent.iSeeAGenericTileWithPropertiesInSection("My New Title", "Dynamic Tile", "with Icon", DisplayFormat.Standard);
    });

    // Non-custom tiles

    opaTest("A non-custom static standard tile moved via action menu keeps its format.", function (Given, When, Then) {
        When.onTheEditModeComponent.iClickTheVisualization("Static Tile");
        When.onTheEditModeComponent.iClickTheMoveButton();
        When.onTheEditModeComponent.iClickOnTheListEntryWithTitle("My New Title");
        Then.onTheRuntimeComponent.iSeeAGenericTileWithPropertiesInSection("My New Title", "Static Tile", "with Icon", DisplayFormat.Standard);
    });

    opaTest("Should change the displayFormat of a non-custom static standard tile to compact", function (Given, When, Then) {
        When.onTheEditModeComponent.iClickTheVisualization("Static Tile");
        When.onTheEditModeComponent.iClickTheConvertToLinkButton();
        Then.onTheRuntimeComponent.iSeeAGenericTileWithPropertiesInSection("My New Title", "Static Tile", "with Icon", DisplayFormat.Compact);
    });

    opaTest("Should change the displayFormat of a non-custom dynamic standard tile to compact", function (Given, When, Then) {
        When.onTheEditModeComponent.iClickTheVisualization("Dynamic Tile");
        When.onTheEditModeComponent.iClickTheConvertToLinkButton();
        Then.onTheRuntimeComponent.iSeeAGenericTileWithPropertiesInSection("My New Title", "Dynamic Tile", "with Icon", DisplayFormat.Compact);
    });

    opaTest("A non-custom static compact tile moved via action menu keeps its format.", function (Given, When, Then) {
        When.onTheEditModeComponent.iClickTheCompactVisualization("Static Tile");
        When.onTheEditModeComponent.iClickTheMoveButton();
        When.onTheEditModeComponent.iClickOnTheListEntryWithTitle("Standard Tile Test Section");
        Then.onTheRuntimeComponent.iSeeAGenericTileWithPropertiesInSection("Standard Tile Test Section", "Static Tile", "with Icon", DisplayFormat.Compact);
    });

    opaTest("A non-custom dynamic compact tile moved via action menu keeps its format.", function (Given, When, Then) {
        When.onTheEditModeComponent.iClickTheCompactVisualization("Dynamic Tile");
        When.onTheEditModeComponent.iClickTheMoveButton();
        When.onTheEditModeComponent.iClickOnTheListEntryWithTitle("Standard Tile Test Section");
        Then.onTheRuntimeComponent.iSeeAGenericTileWithPropertiesInSection("Standard Tile Test Section", "Dynamic Tile", "with Icon", DisplayFormat.Compact);
    });

    opaTest("Should change the displayFormat of a non-custom static compact tile to flat", function (Given, When, Then) {
        When.onTheEditModeComponent.iClickTheCompactVisualization("Static Tile");
        When.onTheEditModeComponent.iClickTheConvertToFlatButton();
        Then.onTheRuntimeComponent.iSeeAGenericTileWithPropertiesInSection("Standard Tile Test Section", "Static Tile", "with Icon", DisplayFormat.Flat);
    });

    opaTest("Should change the displayFormat of a non-custom dynamic compact tile to flat", function (Given, When, Then) {
        When.onTheEditModeComponent.iClickTheCompactVisualization("Dynamic Tile");
        When.onTheEditModeComponent.iClickTheConvertToFlatButton();
        Then.onTheRuntimeComponent.iSeeAGenericTileWithPropertiesInSection("Standard Tile Test Section", "Dynamic Tile", "with Icon", DisplayFormat.Flat);
    });

    opaTest("A non-custom static flat tile moved via action menu keeps its format.", function (Given, When, Then) {
        When.onTheEditModeComponent.iClickTheVisualization("Static Tile");
        When.onTheEditModeComponent.iClickTheMoveButton();
        When.onTheEditModeComponent.iClickOnTheListEntryWithTitle("My New Title");
        Then.onTheRuntimeComponent.iSeeAGenericTileWithPropertiesInSection("My New Title", "Static Tile", "with Icon", DisplayFormat.Flat);
    });

    opaTest("A non-custom dynamic flat tile moved via action menu keeps its format.", function (Given, When, Then) {
        When.onTheEditModeComponent.iClickTheVisualization("Dynamic Tile");
        When.onTheEditModeComponent.iClickTheMoveButton();
        When.onTheEditModeComponent.iClickOnTheListEntryWithTitle("My New Title");
        Then.onTheRuntimeComponent.iSeeAGenericTileWithPropertiesInSection("My New Title", "Dynamic Tile", "with Icon", DisplayFormat.Flat);
    });

    opaTest("Should change the displayFormat of a non-custom static flat tile to flatWide", function (Given, When, Then) {
        When.onTheEditModeComponent.iClickTheVisualization("Static Tile");
        When.onTheEditModeComponent.iClickTheConvertToFlatWideButton();
        Then.onTheRuntimeComponent.iSeeAGenericTileWithPropertiesInSection("My New Title", "Static Tile", "with Icon", DisplayFormat.FlatWide);
    });

    opaTest("Should change the displayFormat of a non-custom dynamic flat tile to flatWide", function (Given, When, Then) {
        When.onTheEditModeComponent.iClickTheVisualization("Dynamic Tile");
        When.onTheEditModeComponent.iClickTheConvertToFlatWideButton();
        Then.onTheRuntimeComponent.iSeeAGenericTileWithPropertiesInSection("My New Title", "Dynamic Tile", "with Icon", DisplayFormat.FlatWide);
    });

    opaTest("A non-custom static flat wide tile moved via action menu keeps its format.", function (Given, When, Then) {
        When.onTheEditModeComponent.iClickTheVisualization("Static Tile");
        When.onTheEditModeComponent.iClickTheMoveButton();
        When.onTheEditModeComponent.iClickOnTheListEntryWithTitle("Standard Tile Test Section");
        Then.onTheRuntimeComponent.iSeeAGenericTileWithPropertiesInSection("Standard Tile Test Section", "Static Tile", "with Icon", DisplayFormat.FlatWide);
    });

    opaTest("A non-custom dynamic flat wide tile moved via action menu keeps its format.", function (Given, When, Then) {
        When.onTheEditModeComponent.iClickTheVisualization("Dynamic Tile");
        When.onTheEditModeComponent.iClickTheMoveButton();
        When.onTheEditModeComponent.iClickOnTheListEntryWithTitle("Standard Tile Test Section");
        Then.onTheRuntimeComponent.iSeeAGenericTileWithPropertiesInSection("Standard Tile Test Section", "Dynamic Tile", "with Icon", DisplayFormat.FlatWide);
    });

    opaTest("Should change the displayFormat of a non-custom static flatWide tile to standard", function (Given, When, Then) {
        When.onTheEditModeComponent.iClickTheVisualization("Static Tile");
        When.onTheEditModeComponent.iClickTheConvertToTileButton();
        Then.onTheRuntimeComponent.iSeeAGenericTileWithPropertiesInSection("Standard Tile Test Section", "Static Tile", "with Icon", DisplayFormat.Standard);
    });

    opaTest("Should change the displayFormat of a non-custom dynamic flatWide tile to standard", function (Given, When, Then) {
        When.onTheEditModeComponent.iClickTheVisualization("Dynamic Tile");
        When.onTheEditModeComponent.iClickTheConvertToTileButton();
        Then.onTheRuntimeComponent.iSeeAGenericTileWithPropertiesInSection("Standard Tile Test Section", "Dynamic Tile", "with Icon", DisplayFormat.Standard);
    });

    // End of non-custom tiles

    // Custom Tiles

    opaTest("A custom standard tile moved via action menu keeps its format.", function (Given, When, Then) {
        When.onTheEditModeComponent.iClickTheVisualization("Custom Tile 1");
        When.onTheEditModeComponent.iClickTheMoveButton();
        When.onTheEditModeComponent.iClickOnTheListEntryWithTitle("My New Title");
        Then.onTheRuntimeComponent.iSeeAGenericTileWithPropertiesInSection("My New Title", "Custom Tile 1", "Standard", DisplayFormat.Standard);
    });

    opaTest("A custom standardWide tile moved via action menu keeps its format.", function (Given, When, Then) {
        When.onTheEditModeComponent.iClickTheVisualization("Custom Tile 2");
        When.onTheEditModeComponent.iClickTheMoveButton();
        When.onTheEditModeComponent.iClickOnTheListEntryWithTitle("My New Title");
        Then.onTheRuntimeComponent.iSeeAGenericTileWithPropertiesInSection("My New Title", "Custom Tile 2", "StandardWide", DisplayFormat.StandardWide);
    });

    opaTest("A custom flatWide tile moved via action menu keeps its format.", function (Given, When, Then) {
        When.onTheEditModeComponent.iClickTheVisualization("Custom Tile 3");
        When.onTheEditModeComponent.iClickTheMoveButton();
        When.onTheEditModeComponent.iClickOnTheListEntryWithTitle("My New Title");
        Then.onTheRuntimeComponent.iSeeAGenericTileWithPropertiesInSection("My New Title", "Custom Tile 3", "FlatWide", DisplayFormat.FlatWide);
    });

    opaTest("A custom flat tile moved via action menu keeps its format.", function (Given, When, Then) {
        When.onTheEditModeComponent.iClickTheVisualization("Custom Tile 5");
        When.onTheEditModeComponent.iClickTheMoveButton();
        When.onTheEditModeComponent.iClickOnTheListEntryWithTitle("My New Title");
        Then.onTheRuntimeComponent.iSeeAGenericTileWithPropertiesInSection("My New Title", "Custom Tile 5", "Flat", DisplayFormat.Flat);
    });

    opaTest("A custom compact tile moved via action menu keeps its format.", function (Given, When, Then) {
        When.onTheEditModeComponent.iClickTheCompactVisualization("Custom Tile 4");
        When.onTheEditModeComponent.iClickTheMoveButton();
        When.onTheEditModeComponent.iClickOnTheListEntryWithTitle("My New Title");
        Then.onTheRuntimeComponent.iSeeAGenericTileWithPropertiesInSection("My New Title", "Custom Tile 4", "Compact", DisplayFormat.Compact);
    });

    opaTest("Should change the displayFormat of a custom standard tile to compact", function (Given, When, Then) {
        When.onTheEditModeComponent.iClickTheVisualization("Custom Tile 1");
        When.onTheEditModeComponent.iClickTheConvertToLinkButton();
        Then.onTheRuntimeComponent.iSeeAGenericTileWithPropertiesInSection("My New Title", "Custom Tile 1", "Standard", DisplayFormat.Compact);
    });

    opaTest("Should change the displayFormat of a custom compact tile to standard", function (Given, When, Then) {
        When.onTheEditModeComponent.iClickTheCompactVisualization("Custom Tile 1");
        When.onTheEditModeComponent.iClickTheConvertToTileButton();
        Then.onTheRuntimeComponent.iSeeAGenericTileWithPropertiesInSection("My New Title", "Custom Tile 1", "Standard", DisplayFormat.Standard);
    });

    opaTest("Should change the displayFormat of a custom standardWide tile to flat", function (Given, When, Then) {
        When.onTheEditModeComponent.iClickTheVisualization("Custom Tile 2");
        When.onTheEditModeComponent.iClickTheConvertToFlatButton();
        Then.onTheRuntimeComponent.iSeeAGenericTileWithPropertiesInSection("My New Title", "Custom Tile 2", "StandardWide", DisplayFormat.Flat);
    });

    opaTest("Should change the displayFormat of a custom flat tile to standardWide", function (Given, When, Then) {
        When.onTheEditModeComponent.iClickTheVisualization("Custom Tile 2");
        When.onTheEditModeComponent.iClickTheConvertToStandardWideButton();
        Then.onTheRuntimeComponent.iSeeAGenericTileWithPropertiesInSection("My New Title", "Custom Tile 2", "StandardWide", DisplayFormat.StandardWide);
    });

    opaTest("Should change the displayFormat of a custom standardWide tile to flatWide", function (Given, When, Then) {
        When.onTheEditModeComponent.iClickTheVisualization("Custom Tile 2");
        When.onTheEditModeComponent.iClickTheConvertToFlatWideButton();
        Then.onTheRuntimeComponent.iSeeAGenericTileWithPropertiesInSection("My New Title", "Custom Tile 2", "StandardWide", DisplayFormat.FlatWide);

        Then.iTeardownMyFLP();
    });

    // End of custom tiles

    QUnit.module("Display format of custom tiles from AppFinder");

    opaTest("Should open the abap / local FLP", function (Given, When, Then) {
        Given.iStartMyFLP("abap");
        When.onTheMenuBar.iClickOnMenuEntry("Custom Tiles Space");
        Then.onTheRuntimeComponent.iSeeTheRightIconTabFilterSelected("Custom Tiles Space");
    });

    opaTest("Should enter the AppFinder", function (Given, When, Then) {
        When.onTheRuntimeComponent.iOpenUserActionsMenu();
        When.onTheRuntimeComponent.iEnterAppFinder();

        Then.onTheAppFinderComponent.iSeeTheCatalogEntryContainerWithTitle("FLP - Different Tile Types");
    });

    opaTest("Should Unpin all custom tiles", function (Given, When, Then) {
        When.onTheAppFinderComponent.iClickThePinOnTheCatalogItemWithTitle("Custom Tile 1");
        When.onTheAppFinderComponent.iToggleTheTileAssignmentToAPageWithTitle("Custom Tiles Page");
        When.onTheAppFinderComponent.iClickOkOnThePopover();

        When.onTheAppFinderComponent.iClickThePinOnTheCatalogItemWithTitle("Custom Tile 2");
        When.onTheAppFinderComponent.iToggleTheTileAssignmentToAPageWithTitle("Custom Tiles Page");
        When.onTheAppFinderComponent.iClickOkOnThePopover();

        When.onTheAppFinderComponent.iClickThePinOnTheCatalogItemWithTitle("Custom Tile 3");
        When.onTheAppFinderComponent.iToggleTheTileAssignmentToAPageWithTitle("Custom Tiles Page");
        When.onTheAppFinderComponent.iClickOkOnThePopover();

        When.onTheAppFinderComponent.iClickThePinOnTheCatalogItemWithTitle("Custom Tile 4");
        When.onTheAppFinderComponent.iToggleTheTileAssignmentToAPageWithTitle("Custom Tiles Page");
        When.onTheAppFinderComponent.iClickOkOnThePopover();

        When.onTheAppFinderComponent.iClickThePinOnTheCatalogItemWithTitle("Custom Tile 5");
        When.onTheAppFinderComponent.iToggleTheTileAssignmentToAPageWithTitle("Custom Tiles Page");
        When.onTheAppFinderComponent.iClickOkOnThePopover();

        When.onTheRuntimeComponent.iNavigateBack();

        Then.onTheEditModeComponent.iSeeTheSectionHasTheCorrectNoVisualizationText("Custom Tile Test Section");
    });

    opaTest("Should enter the AppFinder", function (Given, When, Then) {
        When.onTheRuntimeComponent.iOpenUserActionsMenu();
        When.onTheRuntimeComponent.iEnterAppFinder();

        Then.onTheAppFinderComponent.iSeeTheCatalogEntryContainerWithTitle("FLP - Different Tile Types");
    });

    opaTest("Should pin all custom tiles with the correct display format", function (Given, When, Then) {
        When.onTheAppFinderComponent.iClickThePinOnTheCatalogItemWithTitle("Custom Tile 1");
        When.onTheAppFinderComponent.iToggleTheTileAssignmentToAPageWithTitle("Custom Tiles Page");
        When.onTheAppFinderComponent.iClickOkOnThePopover();

        When.onTheAppFinderComponent.iClickThePinOnTheCatalogItemWithTitle("Custom Tile 2");
        When.onTheAppFinderComponent.iToggleTheTileAssignmentToAPageWithTitle("Custom Tiles Page");
        When.onTheAppFinderComponent.iClickOkOnThePopover();

        When.onTheAppFinderComponent.iClickThePinOnTheCatalogItemWithTitle("Custom Tile 3");
        When.onTheAppFinderComponent.iToggleTheTileAssignmentToAPageWithTitle("Custom Tiles Page");
        When.onTheAppFinderComponent.iClickOkOnThePopover();

        When.onTheAppFinderComponent.iClickThePinOnTheCatalogItemWithTitle("Custom Tile 4");
        When.onTheAppFinderComponent.iToggleTheTileAssignmentToAPageWithTitle("Custom Tiles Page");
        When.onTheAppFinderComponent.iClickOkOnThePopover();

        When.onTheAppFinderComponent.iClickThePinOnTheCatalogItemWithTitle("Custom Tile 5");
        When.onTheAppFinderComponent.iToggleTheTileAssignmentToAPageWithTitle("Custom Tiles Page");
        When.onTheAppFinderComponent.iClickOkOnThePopover();

        When.onTheRuntimeComponent.iNavigateBack();

        Then.onTheRuntimeComponent.iSeeAGenericTileWithPropertiesInSection("Recently Added Apps", "Custom Tile 1", "Standard", DisplayFormat.Standard);
        Then.onTheRuntimeComponent.iSeeAGenericTileWithPropertiesInSection("Recently Added Apps", "Custom Tile 2", "StandardWide", DisplayFormat.StandardWide);
        Then.onTheRuntimeComponent.iSeeAGenericTileWithPropertiesInSection("Recently Added Apps", "Custom Tile 3", "FlatWide", DisplayFormat.FlatWide);
        Then.onTheRuntimeComponent.iSeeAGenericTileWithPropertiesInSection("Recently Added Apps", "Custom Tile 4", "Compact", DisplayFormat.Compact);
        Then.onTheRuntimeComponent.iSeeAGenericTileWithPropertiesInSection("Recently Added Apps", "Custom Tile 5", "Flat", DisplayFormat.Flat);

        Then.iTeardownMyFLP();
    });
});
