// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ushell/opa/tests/demoapps/pages/BookmarkApp",
    "sap/ushell/opa/tests/spacesMode/pages/MenuBar",
    "sap/ushell/opa/tests/spacesMode/pages/Runtime"
], function (opaTest) {
    "use strict";

    /* global QUnit */

    QUnit.module("Bookmark");

    opaTest("Should open the FLP in spaces mode and find the Bookmark Sample app tile", function (Given, When, Then) {
        Given.iStartMyFLP("abap");

        Then.onTheRuntimeComponent.iSeeTheVisualization("Bookmark Sample");
    });

    opaTest("Should start the Bookmark Sample app", function (Given, When, Then) {
        When.onTheRuntimeComponent.iClickTheVisualization("Bookmark Sample");
        Then.onTheBookmarkApp.iSeeTheAddBookmarkButton();
    });

    opaTest("Should open the content node selector dialog", function (Given, When, Then) {
        When.onTheBookmarkApp.iClickTheContentNodeSelector();
        Then.onTheBookmarkApp.iShouldSeeTheValueHelpDialog("Select Pages");
    });

    opaTest("Should type in a content node and select it", function (Given, When, Then) {
        When.onTheBookmarkApp.iClickTheCloseButton();
        When.onTheBookmarkApp.iTypeInANameOfContentNode("Test Page 2");
        Then.onTheBookmarkApp.iSeeTheTokenInMultiInput("Test Page 2");
    });

    opaTest("Should enter the bookmark data and add it", function (Given, When, Then) {
        When.onTheBookmarkApp.iEnterTheBookmarkTitle("Some Bookmark");
        When.onTheBookmarkApp.iClickTheAddButton();
        Then.onTheBookmarkApp.iShouldSeeTheAddConfirmation();
    });

    opaTest("Should navigate back and find the bookmark", function (Given, When, Then) {
        When.onTheRuntimeComponent.iNavigateBack();
        When.onTheMenuBar.iClickOnMenuEntry("Test Space 2");
        Then.onTheRuntimeComponent.iSeeTheVisualization("Some Bookmark");
    });

    opaTest("Should start the Bookmark Sample via the bookmark", function (Given, When, Then) {
        When.onTheRuntimeComponent.iClickTheVisualization("Some Bookmark");
        Then.onTheBookmarkApp.iSeeTheAddBookmarkButton();
    });

    opaTest("Should enter the bookmark data without a content node and add it", function (Given, When, Then) {
        When.onTheBookmarkApp.iEnterTheBookmarkTitle("No content node selected");
        When.onTheBookmarkApp.iClickTheAddButton();
        Then.onTheBookmarkApp.iShouldSeeTheAddConfirmation();
    });

    opaTest("Should navigate back and find the bookmark added to default page", function (Given, When, Then) {
        When.onTheRuntimeComponent.iNavigateBack();
        When.onTheMenuBar.iClickOnMenuEntry("Test Space 1");
        Then.onTheRuntimeComponent.iSeeTheVisualization("No content node selected");
    });

    opaTest("Should start the Bookmark Sample via the bookmark", function (Given, When, Then) {
        When.onTheRuntimeComponent.iClickTheVisualization("No content node selected");
        Then.onTheBookmarkApp.iSeeTheAddBookmarkButton();
    });

    opaTest("Should count the bookmarks", function (Given, When, Then) {
        When.onTheBookmarkApp.iClickTheModifyStandardTab();
        When.onTheBookmarkApp.iClickTheCountButton();
        Then.onTheBookmarkApp.iShouldSeeTheCountConfirmation(2);
    });

    opaTest("Should update the bookmarks", function (Given, When, Then) {
        When.onTheBookmarkApp.iEnterTheBookmarkTitle("Some Updated Bookmark");
        When.onTheBookmarkApp.iClickTheUpdateButton();
        Then.onTheBookmarkApp.iShouldSeeTheUpdateConfirmation(2);
    });

    opaTest("Should navigate back and find the updated bookmark", function (Given, When, Then) {
        When.onTheRuntimeComponent.iNavigateBack();
        Then.onTheRuntimeComponent.iSeeTheVisualization("Some Updated Bookmark");
    });

    opaTest("Should start the Bookmark Sample via the updated bookmark", function (Given, When, Then) {
        When.onTheRuntimeComponent.iClickTheVisualization("Some Updated Bookmark");
        Then.onTheBookmarkApp.iSeeTheAddBookmarkButton();
    });

    opaTest("Should delete the bookmark", function (Given, When, Then) {
        When.onTheBookmarkApp.iClickTheModifyStandardTab();
        When.onTheBookmarkApp.iClickTheDeleteButton();
        Then.onTheBookmarkApp.iShouldSeeTheDeleteConfirmation(2);
    });

    opaTest("Should count the bookmarks", function (Given, When, Then) {
        When.onTheBookmarkApp.iClickTheCountButton();
        Then.onTheBookmarkApp.iShouldSeeTheCountConfirmation(0);
    });

    opaTest("Should navigate back and do not find the bookmark", function (Given, When, Then) {
        When.onTheRuntimeComponent.iNavigateBack();
        Then.onTheRuntimeComponent.iCannotSeeTheViz("Some Updated Bookmark");
        Then.iTeardownMyFLP();
    });
});
