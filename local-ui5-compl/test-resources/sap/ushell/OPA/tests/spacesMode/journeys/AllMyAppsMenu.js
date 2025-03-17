// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ui/events/KeyCodes",
    "sap/ushell/opa/tests/spacesMode/pages/HierarchyMenu",
    "sap/ushell/opa/tests/header/pages/AllMyAppsMenu",
    "sap/ushell/opa/tests/header/pages/ShellHeader",
    "sap/ushell/opa/tests/common/pages/Common"
], function (opaTest, KeyCodes) {
    "use strict";
    /* global QUnit */
    QUnit.module("Runtime tests");


    opaTest("AllMyApps Menu can be opened and navigation can be triggered", function (Given, When, Then) {
        Given.iStartMyFLP("abap");

        When.onTheRuntimeComponent.iClickOnTheHierarchyMenu();
        Then.onTheAllMyAppsMenu.iSeeTheOpenMenu();
        When.onTheAllMyAppsMenu.iPressAnItem("FLP - Different Tile Types");
        Then.onTheAllMyAppsMenu.iSeeAnItem("Dynamic Tile");
        When.onTheAllMyAppsMenu.iPressAnItem("Dynamic Tile");
        Then.onShellHeader.iShouldSeeTitle("Bookmark Sample");

        Then.iTeardownMyFLP({
            deletePersonalization: true
        });
    });
});
