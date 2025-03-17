// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ushell/opa/tests/header/pages/ShellHeader",
    "sap/ushell/opa/tests/spacesMode/pages/Runtime"
], function (opaTest) {
    "use strict";

    /* global QUnit */

    QUnit.module("UnblockHeader");

    opaTest("Should open the FLP and find the Bookmark Sample tile", function (Given, When, Then) {
        Given.iStartMyFLP("abap");
        Then.onTheRuntimeComponent.iSeeTheVisualization("Bookmark Sample");
    });

    opaTest("Should start the Sample app", function (Given, When, Then) {
        When.onTheRuntimeComponent.iClickTheVisualization("Bookmark Sample");
        Then.onShellHeader.iShouldSeeTitle("Bookmark Sample");
    });

    opaTest("Block the shell header", function (Given, When, Then) {
        When.onShellHeader.iBlockHeader();
        Then.onShellHeader.iSeeHeaderBlocked(true);
    });

    opaTest("Should navigate to a space", function (Given, When, Then) {
        When.onTheRuntimeComponent.iChangeTheHash("#");
        Then.onShellHeader.iSeeHeaderBlocked(false);
    });
});
