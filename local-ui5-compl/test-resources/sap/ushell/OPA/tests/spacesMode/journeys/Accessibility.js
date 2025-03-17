// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ushell/opa/tests/spacesMode/pages/Runtime",
    "sap/ushell/opa/tests/spacesMode/pages/EditMode",
    "sap/ushell/opa/tests/spacesMode/pages/MenuBar",
    "sap/ushell/opa/tests/header/pages/ShellHeader",
    "sap/ushell/resources",
    "sap/ushell/opa/tests/common/pages/Common"
], function (opaTest) {
    "use strict";

    /**
     * This OPA journey will test the accessibilty features of the pages runtime.
     */

    /* global QUnit */
    QUnit.module("Accessibility tests");

    opaTest("Should open the FLP.", function (Given, When, Then) {
        Given.iStartMyFLP("abap");

        When.onTheBrowser.iHideQUnit();
        Then.onTheRuntimeComponent.iSeeFocusOnGridContainerItemWrapper("News tile");
    });

    // STANDARD VISUALIZATIONS

    opaTest("Should rotate the focus via F6 forwards.", function (Given, When, Then) {
        When.onTheBrowser.iPressF6();
        Then.onShellHeader.iShouldSeeFocusOnLogo();
        When.onTheBrowser.iPressF6();
        Then.onTheMenuBar.iSeeFocusOnMenuEntry("Test Space 1");
        When.onTheBrowser.iPressF6();
        Then.onTheRuntimeComponent.iSeeFocusOnGridContainerItemWrapper("News tile");
    });

    opaTest("Should rotate the focus via F6 backwards.", function (Given, When, Then) {
        When.onTheBrowser.iPressShiftF6();
        Then.onTheMenuBar.iSeeFocusOnMenuEntry("Test Space 1");
        When.onTheBrowser.iPressShiftF6();
        Then.onShellHeader.iShouldSeeFocusOnLogo();
        When.onTheBrowser.iPressShiftF6();
        Then.onTheRuntimeComponent.iSeeFocusOnGridContainerItemWrapper("News tile");
    });

    opaTest("Should focus the second tile in the section Navigation.", function (Given, When, Then) {
        When.onTheRuntimeComponent.iFocusAGridContainerItemWrapper("Bookmark Sample");
        Then.onTheRuntimeComponent.iSeeFocusOnGridContainerItemWrapper("Bookmark Sample");
    });

    opaTest("Should rotate the focus via F6 forwards.", function (Given, When, Then) {
        When.onTheBrowser.iPressF6();
        Then.onShellHeader.iShouldSeeFocusOnLogo();
        When.onTheBrowser.iPressF6();
        Then.onTheMenuBar.iSeeFocusOnMenuEntry("Test Space 1");
        When.onTheBrowser.iPressF6();
        Then.onTheRuntimeComponent.iSeeFocusOnGridContainerItemWrapper("Bookmark Sample");
    });

    opaTest("Should rotate the focus via F6 backwards.", function (Given, When, Then) {
        When.onTheBrowser.iPressShiftF6();
        Then.onTheMenuBar.iSeeFocusOnMenuEntry("Test Space 1");
        When.onTheBrowser.iPressShiftF6();
        Then.onShellHeader.iShouldSeeFocusOnLogo();
        When.onTheBrowser.iPressShiftF6();
        Then.onTheRuntimeComponent.iSeeFocusOnGridContainerItemWrapper("Bookmark Sample");
    });

    // FLAT VISUALIZATION

    opaTest("Should focus the second flat tile in the section Mixed Visualizations.", function (Given, When, Then) {
        When.onTheRuntimeComponent.iFocusAGridContainerItemWrapper("Flat Visualization", 1);

        Then.onTheRuntimeComponent.iSeeFocusOnGridContainerItemWrapper("Flat Visualization", 1);
    });

    opaTest("Should rotate the focus via F6 forwards.", function (Given, When, Then) {
        When.onTheBrowser.iPressF6();
        Then.onShellHeader.iShouldSeeFocusOnLogo();
        When.onTheBrowser.iPressF6();
        Then.onTheMenuBar.iSeeFocusOnMenuEntry("Test Space 1");
        When.onTheBrowser.iPressF6();
        Then.onTheRuntimeComponent.iSeeFocusOnGridContainerItemWrapper("Flat Visualization", 1);
    });

    opaTest("Should rotate the focus via F6 backwards.", function (Given, When, Then) {
        When.onTheBrowser.iPressShiftF6();
        Then.onTheMenuBar.iSeeFocusOnMenuEntry("Test Space 1");
        When.onTheBrowser.iPressShiftF6();
        Then.onShellHeader.iShouldSeeFocusOnLogo();
        When.onTheBrowser.iPressShiftF6();
        Then.onTheRuntimeComponent.iSeeFocusOnGridContainerItemWrapper("Flat Visualization", 1);
    });

    // COMPACT VISUALIZATION

    opaTest("Should focus the second compact tile in the section Mixed Visualizations.", function (Given, When, Then) {
        When.onTheRuntimeComponent.iFocusACompactVisualization("Compact Visualization", 1);

        Then.onTheRuntimeComponent.iSeeFocusOnACompactVisualization("Compact Visualization", 1);
    });

    opaTest("Should rotate the focus via F6 forwards.", function (Given, When, Then) {
        When.onTheBrowser.iPressF6();
        Then.onShellHeader.iShouldSeeFocusOnLogo();
        When.onTheBrowser.iPressF6();
        Then.onTheMenuBar.iSeeFocusOnMenuEntry("Test Space 1");
        When.onTheBrowser.iPressF6();
        Then.onTheRuntimeComponent.iSeeFocusOnACompactVisualization("Compact Visualization", 1);
    });

    opaTest("Should rotate the focus via F6 backwards.", function (Given, When, Then) {
        When.onTheBrowser.iPressShiftF6();
        Then.onTheMenuBar.iSeeFocusOnMenuEntry("Test Space 1");
        When.onTheBrowser.iPressShiftF6();
        Then.onShellHeader.iShouldSeeFocusOnLogo();
        When.onTheBrowser.iPressShiftF6();
        Then.onTheRuntimeComponent.iSeeFocusOnACompactVisualization("Compact Visualization", 1);
    });

    // EDIT MODE

    opaTest("Should enter the editMode", function (Given, When, Then) {
        When.onTheRuntimeComponent.iOpenUserActionsMenu();
        Then.onTheRuntimeComponent.iSeeTheEditModeButton();
        When.onTheRuntimeComponent.iEnterEditMode();
        Then.onTheEditModeComponent.iAmInTheActionMode();
    });

    // EDIT MODE: COMPACT VISUALIZATION

    opaTest("Should rotate the focus via F6 forwards in editMode.", function (Given, When, Then) {
        When.onTheBrowser.iPressF6();
        Then.onTheMenuBar.iSeeFocusOnMenuEntry("Test Space 1");
        When.onTheBrowser.iPressF6();
        Then.onTheEditModeComponent.iSeeFocusOnSection("Mixed Visualizations");
        When.onTheBrowser.iPressF6();
        Then.onTheRuntimeComponent.iSeeFocusOnACompactVisualization("Compact Visualization", 1);
        When.onTheBrowser.iPressF6();
        Then.onTheEditModeComponent.iSeeFocusOnCloseButton();
        When.onTheBrowser.iPressF6();
        Then.onShellHeader.iShouldSeeFocusOnLogo();
    });

    opaTest("Should rotate the focus via F6 backwards in editMode.", function (Given, When, Then) {
        When.onTheBrowser.iPressShiftF6();
        Then.onTheEditModeComponent.iSeeFocusOnCloseButton();
        When.onTheBrowser.iPressShiftF6();
        Then.onTheRuntimeComponent.iSeeFocusOnACompactVisualization("Compact Visualization", 1);
        When.onTheBrowser.iPressShiftF6();
        Then.onTheEditModeComponent.iSeeFocusOnSection("Mixed Visualizations");
        When.onTheBrowser.iPressShiftF6();
        Then.onTheMenuBar.iSeeFocusOnMenuEntry("Test Space 1");
        When.onTheBrowser.iPressShiftF6();
        Then.onShellHeader.iShouldSeeFocusOnLogo();
    });

    // EDIT MODE: FLAT VISUALIZATION

    opaTest("Should focus the second flat tile in the section Mixed Visualizations in edit mode.", function (Given, When, Then) {
        When.onTheRuntimeComponent.iFocusAGridContainerItemWrapper("Flat Visualization", 1);

        Then.onTheRuntimeComponent.iSeeFocusOnGridContainerItemWrapper("Flat Visualization", 1);
    });

    opaTest("Should rotate the focus via F6 forwards in editMode.", function (Given, When, Then) {
        When.onTheBrowser.iPressF6();
        Then.onTheEditModeComponent.iSeeFocusOnCloseButton();
        When.onTheBrowser.iPressF6();
        Then.onShellHeader.iShouldSeeFocusOnLogo();
        When.onTheBrowser.iPressF6();
        Then.onTheMenuBar.iSeeFocusOnMenuEntry("Test Space 1");
        When.onTheBrowser.iPressF6();
        Then.onTheEditModeComponent.iSeeFocusOnSection("Mixed Visualizations");
        When.onTheBrowser.iPressF6();
        Then.onTheRuntimeComponent.iSeeFocusOnGridContainerItemWrapper("Flat Visualization", 1);
    });

    opaTest("Should rotate the focus via F6 backwards in editMode.", function (Given, When, Then) {
        When.onTheBrowser.iPressShiftF6();
        Then.onTheEditModeComponent.iSeeFocusOnSection("Mixed Visualizations");
        When.onTheBrowser.iPressShiftF6();
        Then.onTheMenuBar.iSeeFocusOnMenuEntry("Test Space 1");
        When.onTheBrowser.iPressShiftF6();
        Then.onShellHeader.iShouldSeeFocusOnLogo();
        When.onTheBrowser.iPressShiftF6();
        Then.onTheEditModeComponent.iSeeFocusOnCloseButton();
        When.onTheBrowser.iPressShiftF6();
        Then.onTheRuntimeComponent.iSeeFocusOnGridContainerItemWrapper("Flat Visualization", 1);
    });

    // EDIT MODE: STANDARD VISUALIZATION

    opaTest("Should focus the second tile in the section Navigation in edit mode.", function (Given, When, Then) {
        When.onTheRuntimeComponent.iFocusAGridContainerItemWrapper("Bookmark Sample");
        Then.onTheRuntimeComponent.iSeeFocusOnGridContainerItemWrapper("Bookmark Sample");
    });

    opaTest("Should rotate the focus via F6 forwards in edit mode.", function (Given, When, Then) {
        When.onTheBrowser.iPressF6();
        Then.onTheEditModeComponent.iSeeFocusOnCloseButton();
        When.onTheBrowser.iPressF6();
        Then.onShellHeader.iShouldSeeFocusOnLogo();
        When.onTheBrowser.iPressF6();
        Then.onTheMenuBar.iSeeFocusOnMenuEntry("Test Space 1");
        When.onTheBrowser.iPressF6();
        Then.onTheEditModeComponent.iSeeFocusOnSection("Navigation");
        When.onTheBrowser.iPressF6();
        Then.onTheRuntimeComponent.iSeeFocusOnGridContainerItemWrapper("Bookmark Sample");
    });

    opaTest("Should rotate the focus via F6 backwards in edit mode.", function (Given, When, Then) {
        When.onTheBrowser.iPressShiftF6();
        Then.onTheEditModeComponent.iSeeFocusOnSection("Navigation");
        When.onTheBrowser.iPressShiftF6();
        Then.onTheMenuBar.iSeeFocusOnMenuEntry("Test Space 1");
        When.onTheBrowser.iPressShiftF6();
        Then.onShellHeader.iShouldSeeFocusOnLogo();
        When.onTheBrowser.iPressShiftF6();
        Then.onTheEditModeComponent.iSeeFocusOnCloseButton();
        When.onTheBrowser.iPressShiftF6();
        Then.onTheRuntimeComponent.iSeeFocusOnGridContainerItemWrapper("Bookmark Sample");
    });

    // EDIT MODE: EMPTY SECTION

    opaTest("Should focus the section Empty Group 1 in editMode.", function (Given, When, Then) {
        When.onTheRuntimeComponent.iFocusASection("Empty Group 1");
        Then.onTheEditModeComponent.iSeeFocusOnSection("Empty Group 1");
    });

    opaTest("Should rotate the focus via F6 forwards in editMode and initial focus on an empty section.", function (Given, When, Then) {
        When.onTheBrowser.iPressF6();
        Then.onTheEditModeComponent.iSeeFocusOnCloseButton();
        When.onTheBrowser.iPressF6();
        Then.onShellHeader.iShouldSeeFocusOnLogo();
        When.onTheBrowser.iPressF6();
        Then.onTheMenuBar.iSeeFocusOnMenuEntry("Test Space 1");
        When.onTheBrowser.iPressF6();
        Then.onTheEditModeComponent.iSeeFocusOnSection("Empty Group 1");
    });

    opaTest("Should rotate the focus via F6 backwards in editMode and initial focus on an empty section.", function (Given, When, Then) {
        When.onTheBrowser.iPressShiftF6();
        Then.onTheMenuBar.iSeeFocusOnMenuEntry("Test Space 1");
        When.onTheBrowser.iPressShiftF6();
        Then.onShellHeader.iShouldSeeFocusOnLogo();
        When.onTheBrowser.iPressShiftF6();
        Then.onTheEditModeComponent.iSeeFocusOnCloseButton();
        When.onTheBrowser.iPressShiftF6();
        Then.onTheEditModeComponent.iSeeFocusOnSection("Empty Group 1");
    });

    opaTest("Should exit the editMode", function (Given, When, Then) {
        When.onTheEditModeComponent.iCloseEditMode();
        Then.onTheMenuBar.iSeeTheMenuBarIsEnabled();
    });

    opaTest("Should focus the default visualization", function (Given, When, Then) {
        When.onTheBrowser.iPressF6();
        Then.onShellHeader.iShouldSeeFocusOnLogo();
        When.onTheBrowser.iPressF6();
        Then.onTheMenuBar.iSeeFocusOnMenuEntry("Test Space 1");
        When.onTheBrowser.iPressF6();
        Then.onTheRuntimeComponent.iSeeFocusOnGridContainerItemWrapper("News tile");
    });

    opaTest("Should close the FLP", function (Given, When, Then) {
        When.onTheBrowser.iShowQUnit();
        Then.onTheRuntimeComponent.iSeeFocusOnGridContainerItemWrapper("News tile");
        Then.iTeardownMyFLP();
    });
});
