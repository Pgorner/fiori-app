// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ushell/opa/tests/userSettings/pages/AboutDialog",
    "sap/ushell/opa/tests/header/pages/UserActionsMenu",
    "sap/ushell/opa/tests/spacesMode/pages/HomeApp",
    "sap/ushell/opa/tests/spacesMode/pages/MenuBar",
    "sap/ushell/opa/tests/spacesMode/pages/Runtime"
], function (opaTest) {
    "use strict";

    /* global QUnit */

    QUnit.module("HomeApp");

    opaTest("Should open the FLP and find the AppNavSample as HomeApp", function (Given, When, Then) {
        var oConfig = {
            ushell: {
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

        Given.iStartMyFLP("abap", oConfig);

        Then.onTheHomeApp.iSeeTheNavigateButton();
        Then.onTheMenuBar.iSeeTheEntryHighlighted("My Home");
    });

    opaTest("Should navigate to a space", function (Given, When, Then) {
        When.onTheMenuBar.iClickOnMenuEntry("Test Space 2");

        Then.onTheRuntimeComponent.iSeeTheRightPageTitle("Test Page 2");
        Then.onTheMenuBar.iSeeTheEntryHighlighted("Test Space 2");
    });

    opaTest("Should open the AboutDialog and see the data of the pages component", function (Given, When, Then) {
        When.onTheRuntimeComponent.iOpenUserActionsMenu();
        Then.onTheUserActionsMenu.iShouldSeeUserActionsMenuPopover();

        When.onTheUserActionsMenu.iPressOnActionButtonWithTitle("About");
        Then.onTheAboutDialog.iSeeTheAboutDialog();

        Then.onTheAboutDialog.iSeeTheFieldWithTextAndI18nKey("LAUNCHPAD", "appId");
        Then.onTheAboutDialog.iSeeTheFieldWithTextAndI18nKey("CA-FLP-FE-COR", "appSupportInfo");
        Then.onTheAboutDialog.iSeeTheFieldWithTextAndI18nKey("sap.ushell.components.pages", "technicalAppComponentId");
    });

    opaTest("Should navigate back to the homeApp and see Shell-home as hash", function (Given, When, Then) {
        When.onTheAboutDialog.iPressTheCloseButton();
        When.onTheMenuBar.iClickOnMenuEntry("My Home");

        Then.onTheMenuBar.iSeeTheEntryHighlighted("My Home");
        Then.onTheRuntimeComponent.iSeeTheHash("Shell-home");
    });

    opaTest("Should open the AboutDialog again and see the data of the homeApp component", function (Given, When, Then) {
        When.onTheRuntimeComponent.iOpenUserActionsMenu();
        Then.onTheUserActionsMenu.iShouldSeeUserActionsMenuPopover();

        When.onTheUserActionsMenu.iPressOnActionButtonWithTitle("About");
        Then.onTheAboutDialog.iSeeTheAboutDialog();

        Then.onTheAboutDialog.iSeeTheFieldWithTextAndI18nKey("LAUNCHPAD (Z9999)", "appId");
        Then.onTheAboutDialog.iSeeTheFieldWithTextAndI18nKey("CA-FLP-FE-UI", "appSupportInfo");
        Then.onTheAboutDialog.iSeeTheFieldWithTextAndI18nKey("sap.ushell.demo.HomeApp", "technicalAppComponentId");
    });

    opaTest("Close the AboutDialog", function (Given, When, Then) {
        When.onTheAboutDialog.iPressTheCloseButton();
        Then.onTheMenuBar.iSeeTheEntryHighlighted("My Home");

        Then.iTeardownMyFLP();
    });

    opaTest("Should restart the FLP and find the ErrorView as HomeApp", function (Given, When, Then) {
        var oConfig = {
            ushell: {
                homeApp: {
                    component: {
                        name: "",
                        url: "",
                        messages: [
                            "opa",
                            "test"
                        ]
                    }
                }
            }
        };

        Given.iStartMyFLP("abap", oConfig);

        Then.onTheHomeAppErrorComponent.iSeeTheCopyButton();
        Then.onTheMenuBar.iSeeTheEntryHighlighted("My Home");
    });

    opaTest("Should open the AboutDialog again and see the data of the homeApp component", function (Given, When, Then) {
        When.onTheRuntimeComponent.iOpenUserActionsMenu();
        Then.onTheUserActionsMenu.iShouldSeeUserActionsMenuPopover();

        When.onTheUserActionsMenu.iPressOnActionButtonWithTitle("About");
        Then.onTheAboutDialog.iSeeTheAboutDialog();

        Then.onTheAboutDialog.iSeeTheFieldWithTextAndI18nKey("LAUNCHPAD", "appId");
        Then.onTheAboutDialog.iSeeTheFieldWithTextAndI18nKey("CA-FLP-FE-COR", "appSupportInfo");
        Then.onTheAboutDialog.iSeeTheFieldWithTextAndI18nKey("sap.ushell.components.homeApp.error", "technicalAppComponentId");
    });

    opaTest("Close the AboutDialog", function (Given, When, Then) {
        When.onTheAboutDialog.iPressTheCloseButton();
        Then.onTheMenuBar.iSeeTheEntryHighlighted("My Home");

        Then.iTeardownMyFLP();
    });
});
