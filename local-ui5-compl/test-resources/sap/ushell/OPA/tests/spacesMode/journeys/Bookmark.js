// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ushell/resources",
    "sap/ushell/opa/tests/demoapps/pages/BookmarkApp",
    "sap/ushell/opa/tests/header/pages/ShellHeader",
    "sap/ushell/opa/tests/spacesMode/pages/Bookmark",
    "sap/ushell/opa/tests/spacesMode/pages/MenuBar",
    "sap/ushell/opa/tests/spacesMode/pages/Runtime"
], function (opaTest, ushellResources) {
    "use strict";

    /* global QUnit */

    QUnit.module("Bookmark");

    opaTest("Should open the FLP and find the Bookmark Sample tile", function (Given, When, Then) {
        Given.iStartMyFLP("abap");

        Then.onTheRuntimeComponent.iSeeTheVisualization("Bookmark Sample");
    });

    opaTest("Should start the Bookmark Sample app", function (Given, When, Then) {
        When.onTheRuntimeComponent.iClickTheVisualization("Bookmark Sample");
        Then.onShellHeader.iShouldSeeTitle("Bookmark Sample");
        Then.onTheBookmarkApp.iSeeTheBookmarkTitleInput();
    });

    opaTest("Should clear the Bookmark Sample app inputs", function (Given, When, Then) {
        When.onTheBookmarkApp.iEnterTheBookmarkTitle("");
        When.onTheBookmarkApp.iEnterTheBookmarkSubtitle("");
        When.onTheBookmarkApp.iEnterTheBookmarkIcon("");
        Then.onTheBookmarkComponent.iSeeTheAddBookmarkButton();
    });

    opaTest("Should open the save as tile dialog", function (Given, When, Then) {
        When.onTheBookmarkComponent.iClickTheAddBookmarkButton();
        Then.onTheBookmarkComponent.iSeeTheSaveAsTileDialog();
    });

    opaTest("Should enter no data", function (Given, When, Then) {
        When.onTheBookmarkComponent.iPressOkInTheDialog();
        Then.onTheBookmarkComponent.iSeeAnErrorInput();
        Then.onTheBookmarkComponent.iSeeAnErrorMultiComboBox();
    });

    opaTest("Should not see the discard dialog", function (Given, When, Then) {
        When.onTheBookmarkComponent.iPressCancelInTheDialog();
        Then.onTheBookmarkComponent.iDoNotSeeTheDiscardDialog();
    });

    opaTest("Should enter a serviceUrl", function (Given, When, Then) {
        When.onTheBookmarkApp.iEnterTheBookmarkServiceUrl("someUrl");
        Then.onTheBookmarkComponent.iSeeTheAddBookmarkButton();
    });

    opaTest("Should open the save as tile dialog and see the KPI placeholder", function (Given, When, Then) {
        When.onTheBookmarkComponent.iClickTheAddBookmarkButton();
        Then.onTheBookmarkComponent.iSeeTheSaveAsTileDialog();
        Then.onTheBookmarkComponent.iSeeTheKpiPlaceholder("0");
    });

    opaTest("Should enter data in all fields", function (Given, When, Then) {
        When.onTheBookmarkComponent.iEnterTheTitleInTheDialog("Link to BookmarkSampleApp");
        When.onTheBookmarkComponent.iEnterTheSubtitleInTheDialog("Bookmark");
        When.onTheBookmarkComponent.iEnterTheDescriptionInTheDialog("I love bookmarks!");
        When.onTheBookmarkComponent.iSelectAPage("Test Page 2");
        When.onTheBookmarkComponent.iPressApplyInPageSelection();
        Then.onTheBookmarkComponent.iSeeATileWithPropertiesInTheDialog("Link to BookmarkSampleApp", "Bookmark", "I love bookmarks!");
    });

    opaTest("Should see the discard dialog", function (Given, When, Then) {
        When.onTheBookmarkComponent.iPressCancelInTheDialog();
        Then.onTheBookmarkComponent.iSeeTheDiscardDialog();
    });

    opaTest("Should not see the discard dialog anymore", function (Given, When, Then) {
        When.onTheBookmarkComponent.iPressCancelInTheDiscardDialog();
        Then.onTheBookmarkComponent.iDoNotSeeTheDiscardDialog();
    });

    opaTest("Should save the bookmark tile", function (Given, When, Then) {
        var sExpectedMessageToast = ushellResources.i18n.getText("SaveAsTileDialog.MessageToast.TileCreatedInPage");
        When.onTheBookmarkComponent.iPressOkInTheDialog();
        Then.onTheBookmarkComponent.iShouldSeeTheMessageToast(sExpectedMessageToast);
    });

    opaTest("Should navigate to a space", function (Given, When, Then) {
        When.onTheRuntimeComponent.iNavigateBack();
        When.onTheMenuBar.iClickOnMenuEntry("Test Space 2");

        Then.onTheRuntimeComponent.iSeeTheRightPageTitle("Test Page 2");
        Then.onTheRuntimeComponent.iSeeTheVisualizationAtTheCorrectIndex(ushellResources.i18n.getText("DefaultSection.Title"), "Link to BookmarkSampleApp", 0);
        Then.onTheRuntimeComponent.iSeeTheVisualizationHasTheCorrectProperties(ushellResources.i18n.getText("DefaultSection.Title"), "Link to BookmarkSampleApp", "Bookmark", "I love bookmarks!");
    });

    opaTest("Should start the new Bookmark", function (Given, When, Then) {
        When.onTheRuntimeComponent.iClickTheVisualization("Link to BookmarkSampleApp");
        Then.onShellHeader.iShouldSeeTitle("Bookmark Sample");
        Then.onTheBookmarkApp.iSeeTheBookmarkTitleInput();
    });

    opaTest("Should open the save as tile dialog", function (Given, When, Then) {
        When.onTheBookmarkComponent.iClickTheAddBookmarkButton();
        Then.onTheBookmarkComponent.iSeeTheSaveAsTileDialog();
    });

    opaTest("Should enter data in all fields", function (Given, When, Then) {
        When.onTheBookmarkComponent.iEnterTheTitleInTheDialog("Spreading");
        When.onTheBookmarkComponent.iEnterTheSubtitleInTheDialog("this Bookmark");
        When.onTheBookmarkComponent.iEnterTheDescriptionInTheDialog("on multiple Pages!");
        When.onTheBookmarkComponent.iSelectAPage("UI2 FLP Demo - Test Page");
        When.onTheBookmarkComponent.iSelectAPage("Test Page 2");
        When.onTheBookmarkComponent.iPressApplyInPageSelection();
        Then.onTheBookmarkComponent.iSeeATileWithPropertiesInTheDialog("Spreading", "this Bookmark", "on multiple Pages!");
    });

    opaTest("Should save the bookmark tile", function (Given, When, Then) {
        var sExpectedMessageToast = ushellResources.i18n.getText("SaveAsTileDialog.MessageToast.TileCreatedInPages");
        When.onTheBookmarkComponent.iPressOkInTheDialog();
        Then.onTheBookmarkComponent.iShouldSeeTheMessageToast(sExpectedMessageToast);
    });

    opaTest("Should navigate to the first space", function (Given, When, Then) {
        When.onTheRuntimeComponent.iNavigateBack();

        Then.onTheRuntimeComponent.iSeeTheRightPageTitle("Test Page 2");
        Then.onTheRuntimeComponent.iSeeTheVisualizationAtTheCorrectIndex(ushellResources.i18n.getText("DefaultSection.Title"), "Spreading", 1);
        Then.onTheRuntimeComponent.iSeeTheVisualizationHasTheCorrectProperties(ushellResources.i18n.getText("DefaultSection.Title"), "Spreading", "this Bookmark", "on multiple Pages!");
    });

    opaTest("Should navigate to the second space", function (Given, When, Then) {
        When.onTheMenuBar.iClickOnMenuEntry("Test Space 1");

        Then.onTheRuntimeComponent.iSeeTheVisualizationAtTheCorrectIndex(ushellResources.i18n.getText("DefaultSection.Title"), "Spreading", 0);
        Then.onTheRuntimeComponent.iSeeTheVisualizationHasTheCorrectProperties(ushellResources.i18n.getText("DefaultSection.Title"), "Spreading", "this Bookmark", "on multiple Pages!");

        Then.iTeardownMyFLP();
    });
});
