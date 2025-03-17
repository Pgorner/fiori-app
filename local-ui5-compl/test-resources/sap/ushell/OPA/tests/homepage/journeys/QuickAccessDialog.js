// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ushell/opa/tests/header/pages/UserActionsMenu",
    "sap/ushell/opa/tests/homepage/pages/Homepage",
    "sap/ushell/opa/tests/homepage/pages/QuickAccessDialog"
], function (opaTest) {
    "use strict";

    /* global QUnit */

    QUnit.module("Quick Access Dialog: ", {
        before: function () {
            this.defaultConfig = {};
        }
    });

    // add other adapters here, once supported
    var aAdapters = ["cdm"];

    aAdapters.forEach(function (sAdapter) {
        opaTest("Popover contains Quick Access items when click on UserActionsMenu icon", function (Given, When, Then) {
            // Arrangements
            Given.iStartMyFLP(sAdapter, this.defaultConfig);

            // Actions
            When.onTheHomepage.iPressOnTheUserActionsMenuButton();

            // Assertions
            Then.onTheUserActionsMenu.iShouldSeeUserActionsMenuPopover();
            Then.onTheUserActionsMenu.iShouldSeeItemInUserActionsMenuWithTitle("Recent Activities");
            Then.onTheUserActionsMenu.iShouldSeeItemInUserActionsMenuWithTitle("Frequently Used");
        });

        opaTest("The Quick Access dialog opens when pressing the Recent Activities item", function (Given, When, Then) {
            // Actions
            When.onTheUserActionsMenu.iPressOnActionButtonWithTitle("Recent Activities");

            // Assertions
            Then.onTheHomepage.iShouldSeeQuickAccessDialog();
            Then.onTheQuickAccessDialog.iShouldSeeFocusOnRecentActivityFilterTab();
            Then.onTheQuickAccessDialog.iShouldSeeTabSelectedWithId("recentActivityFilter");
        });

        opaTest("The Quick Access dialog opens when pressing the Frequently Used item", function (Given, When, Then) {
            // Actions
            When.onTheQuickAccessDialog.iPressOnTheCloseButton();
            When.onTheHomepage.iPressOnTheUserActionsMenuButton();
            When.onTheUserActionsMenu.iPressOnActionButtonWithTitle("Frequently Used");

            // Assertions
            Then.onTheHomepage.iShouldSeeQuickAccessDialog();
            Then.onTheQuickAccessDialog.iShouldSeeFocusOnFrequentlyUsedFilterTab();
            Then.onTheQuickAccessDialog.iShouldSeeTabSelectedWithId("frequentlyUsedFilter");

            When.onTheQuickAccessDialog.iPressOnTheCloseButton();
            Then.iTeardownMyFLP();
        });
    });
});
