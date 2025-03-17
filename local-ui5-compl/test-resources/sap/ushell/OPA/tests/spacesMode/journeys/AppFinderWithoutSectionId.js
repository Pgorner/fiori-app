// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ushell/opa/tests/spacesMode/pages/Runtime",
    "sap/ushell/opa/tests/spacesMode/pages/EditMode",
    "sap/ushell/opa/tests/spacesMode/pages/Bookmark",
    "sap/ushell/opa/tests/spacesMode/pages/AppFinder",
    "sap/ushell/opa/tests/homepage/pages/Browser",
    "sap/ushell/resources"
], function (opaTest, Runtime, EditMode, Bookmark, AppFinder, Browser, resources) {
    "use strict";

    /* global QUnit */

    QUnit.module("Test for Appfinder without sectionID URL paramter");

    // Pin tile
    opaTest("Open AppFinder without sectionID URL parameter", function (Given, When, Then) {
        Given.iStartMyFLP("abap");

        When.onTheBrowser.iChangeTheHash('#Shell-appfinder?&/catalog/%7B"pageID":"%252FUI2%252FFLP_DEMO_PAGE"%7D');
        Then.onTheRuntimeComponent.iSeeShellAppTitle('App Finder - Personalize "UI2 FLP Demo - Test Page"');
    });

    opaTest("Pin tile", function (Given, When, Then) {
        When.onTheAppFinderComponent.iClickThePinOnTheCatalogItemWithTitle("DefaultSectionTile");
        Then.onTheAppFinderComponent.iSeeTheCatalogItemPinnedWithTitle("DefaultSectionTile");
    });

    opaTest("The pinned tile should be added in the default section", function (Given, When, Then) {
        When.onTheBrowser.iChangeTheHash("#Shell-home");
        Then.onTheRuntimeComponent.iSeeTheVisualizationInTheSection("DefaultSectionTile", "Recently Added Apps");
    });

    // Unpin tile
    opaTest("Open AppFinder without sectionID URL parameter", function (Given, When, Then) {
        When.onTheBrowser.iChangeTheHash('#Shell-appfinder?&/catalog/%7B"pageID":"%252FUI2%252FFLP_DEMO_PAGE"%7D');
        Then.onTheRuntimeComponent.iSeeShellAppTitle('App Finder - Personalize "UI2 FLP Demo - Test Page"');
    });

    opaTest("Unpin tile", function (Given, When, Then) {
        When.onTheAppFinderComponent.iClickThePinOnTheCatalogItemWithTitle("DefaultSectionTile");
        Then.onTheAppFinderComponent.iSeeTheCatalogItemUnpinnedWithTitle("DefaultSectionTile");
    });

    opaTest("The unpinned tile should be removed from the default section", function (Given, When, Then) {
        When.onTheBrowser.iChangeTheHash("#Shell-home");
        Then.onTheRuntimeComponent.iDontSeeTheSection(resources.i18n.getText("DefaultSection.Title"));
    });

    // Tiles from other pages are unpinned
    opaTest("Tiles from other pages should be unpinned", function (Given, When, Then) {
        When.onTheBrowser.iChangeTheHash('#Shell-appfinder?&/catalog/%7B"pageID":"%252FUI2%252FFLP_DEMO_PAGE"%7D');
        Then.onTheRuntimeComponent.iSeeShellAppTitle('App Finder - Personalize "UI2 FLP Demo - Test Page"');
        Then.onTheAppFinderComponent.iSeeTheCatalogItemUnpinnedWithTitle("Custom Tile 1");

        Then.iTeardownMyFLP();
    });

});
