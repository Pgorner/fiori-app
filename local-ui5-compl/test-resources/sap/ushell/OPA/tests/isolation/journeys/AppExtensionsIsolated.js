// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ushell/opa/tests/header/pages/ShellHeader",
    "sap/ushell/opa/tests/isolation/pages/AppExtensionIsolatedApp",
    "sap/ushell/opa/tests/spacesMode/pages/Runtime"
], function (opaTest) {
    "use strict";

    /* global QUnit */

    QUnit.module("AppExtensionsIsolated");

    opaTest("Should open the FLP and find the AppExtension tile", function (Given, When, Then) {
        Given.iStartMyFLP("cdm", {}, "cdmSpacesIsolated");

        Then.onTheRuntimeComponent.iSeeTheVisualization("App Extension Sample");
    });

    opaTest("Should start the AppExtension Sample app", function (Given, When, Then) {
        When.onTheRuntimeComponent.iClickTheVisualization("App Extension Sample");
        Then.onShellHeader.iShouldSeeTitle("App Extension Sample");
        Then.onTheAppExtensionApp.iSeeTheText("App Extension Sample");
    });

    opaTest("Should open the UserActionMenu", function (Given, When, Then) {
        When.onTheRuntimeComponent.iOpenUserActionsMenu();
        Then.onTheRuntimeComponent.iSeeTheUserAction("Hello World #1");
    });

    opaTest("Should press the custom UserAction", function (Given, When, Then) {
        When.onTheRuntimeComponent.iPressTheUserAction("Hello World #1");
        Then.onTheAppExtensionApp.iSeeTheMessageToast("Hello World #1");

        Then.iTeardownMyFLP();
    });
});
