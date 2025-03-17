// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/core/Fragment",
    "sap/ui/Device",
    "sap/ui/test/opaQunit",
    "sap/base/util/Version",
    "sap/ui/core/Core",
    "sap/ui/VersionInfo",
    "sap/ushell/opa/tests/header/pages/UserActionsMenu",
    "sap/ushell/opa/tests/homepage/pages/Homepage",
    "sap/ushell/opa/tests/userSettings/pages/AboutDialog",
    "sap/ushell/opa/tests/demoapps/pages/AppInfoSample"

], function (Fragment, Device, opaTest, Version, Core, VersionInfo) {
    "use strict";

    /* global QUnit */
    QUnit.module("About Dialog", {
        after: function () {
            delete Device.support.touch;
            delete Device.system.phone;
            delete Device.system.tablet;
            delete Device.system.desktop;
            delete Device.system.combi;
        }
    });

    // add other adapters here, once supported
    opaTest("Open dialog when clicking on UserSettings icon", function (Given, When, Then) {
        // Arrangements
        Given.iStartMyFLP("cdm", {}, "cdmSpaces");

        // Actions
        When.onTheHomepage.iPressOnTheUserActionsMenuButton();
        When.onTheUserActionsMenu.iPressOnActionButton("aboutBtn");

        // Assertions
        Then.onTheUserActionsMenu.iShouldNotSeeUserActionsMenuPopover();
        Then.onTheHomepage.iShouldSeeAboutDialog();
        When.onTheAboutDialog.iPressTheCloseButton();
    });

    opaTest("About dialog should show the Application Details Page with correct items", function (Given, When, Then) {
        // Actions
        When.onTheHomepage.iPressOnTheUserActionsMenuButton();
        When.onTheUserActionsMenu.iPressOnActionButton("aboutBtn");
        // Assertions
        Then.onTheAboutDialog.iSeeNumberOfListItem(3);
        Then.onTheAboutDialog.iSeeTheFieldWithTextAndI18nKey("LAUNCHPAD", "appId");
        Then.onTheAboutDialog.iSeeTheFieldWithTextAndI18nKey("CA-FLP-FE-COR", "appSupportInfo");
        Then.onTheAboutDialog.iSeeTheFieldWithTextAndI18nKey("sap.ushell.components.pages", "technicalAppComponentId");
        Then.onTheAboutDialog.iSeeTheFieldWithTextAndI18nKey("UI5", "appFrameworkId");
        VersionInfo.load()
            .then((oVersion) => {
                const sVersion = ((oVersion.version || "") + (" (" + (oVersion.buildTimestamp || "") + ")") || "");
                Then.onTheAboutDialog.iSeeTheFieldWithTextAndI18nKey(sVersion, "appFrameworkVersion");
                When.onTheAboutDialog.iPressTheCloseButton();
            });


    });

    opaTest("About dialog should show the System Details Page with correct items", function (Given, When, Then) {
        // Actions
        When.onTheHomepage.iPressOnTheUserActionsMenuButton();
        When.onTheUserActionsMenu.iPressOnActionButton("aboutBtn");
        // Assertions
        Then.onTheAboutDialog.iSeeNumberOfListItem(3);
        When.onTheAboutDialog.iPressTheSystemDetailsListItem();
        Then.onTheAboutDialog.iSeeTheFieldWithTextAndI18nKey("My Product Name", "productName");
        Then.onTheAboutDialog.iSeeTheFieldWithTextAndI18nKey("My Product Version", "productVersionFld");
        Then.onTheAboutDialog.iSeeTheFieldWithTextAndI18nKey("My System Role", "systemRole");
        Then.onTheAboutDialog.iSeeTheFieldWithTextAndI18nKey("My System Name", "systemName");
        Then.onTheAboutDialog.iSeeTheFieldWithTextAndI18nKey("My Tenant Role", "tenantRole");
        When.onTheAboutDialog.iPressTheCloseButton();


    });

    opaTest("About dialog should show the Environment Details Page with correct items", function (Given, When, Then) {
        // Actions
        When.onTheHomepage.iPressOnTheUserActionsMenuButton();
        When.onTheUserActionsMenu.iPressOnActionButton("aboutBtn");
        // Assertions
        Then.onTheAboutDialog.iSeeNumberOfListItem(3);
        When.onTheAboutDialog.iPressTheEnvironmentDetailsListItem();
        var sDeviceType;
        if (Device.system.combi) {
            sDeviceType = "Combi Device";
        } else if (Device.system.desktop) {
            sDeviceType = "Desktop";
        } else if (Device.system.tablet) {
            sDeviceType = "Tablet";
        } else if (Device.system.phone) {
            sDeviceType = "Phone";
        }
        Then.onTheAboutDialog.iSeeTheFieldWithTextAndI18nKey(sDeviceType, "deviceType");
        Then.onTheAboutDialog.iSeeTheFieldWithTextAndI18nKey("sap_belize", "activeTheme");
        Then.onTheAboutDialog.iSeeTheFieldWithTextAndI18nKey("Yes", "AppearanceContentDensityLabel");
        const sTouchSupport = (Device.support.touch && (Device.system.tablet || Device.system.phone || Device.system.combi)) ? "Yes" : "No";
        Then.onTheAboutDialog.iSeeTheFieldWithTextAndI18nKey(sTouchSupport, "touchSupported");
        Then.onTheAboutDialog.iSeeTheFieldWithTextAndI18nKey(navigator.userAgent, "userAgentFld");
        When.onTheAboutDialog.iPressTheCloseButton();
    });

    opaTest("About dialog should show the correct device-related environment fields for a combi device on the Environment Details Page", function (Given, When, Then) {
        // Arrangements
        Device.support.touch = true;
        Device.system.phone = false;
        Device.system.tablet = false;
        Device.system.desktop = true;
        Device.system.combi = true;

        // Actions
        When.onTheHomepage.iPressOnTheUserActionsMenuButton();
        When.onTheUserActionsMenu.iPressOnActionButton("aboutBtn");
        When.onTheAboutDialog.iPressTheEnvironmentDetailsListItem();
        Then.onTheAboutDialog.iSeeTheFieldWithTextAndI18nKey("Yes", "touchSupported");
        Then.onTheAboutDialog.iSeeTheFieldWithTextAndI18nKey("Combi Device", "deviceType");
        When.onTheAboutDialog.iPressTheCloseButton();
    });

    opaTest("About dialog should show the correct device-related environment fields for a desktop device on the Environment Details Page", function (Given, When, Then) {
        // Arrangements
        Device.support.touch = false;
        Device.system.phone = false;
        Device.system.tablet = false;
        Device.system.desktop = true;
        Device.system.combi = false;

        // Actions
        When.onTheHomepage.iPressOnTheUserActionsMenuButton();
        When.onTheUserActionsMenu.iPressOnActionButton("aboutBtn");
        When.onTheAboutDialog.iPressTheEnvironmentDetailsListItem();
        Then.onTheAboutDialog.iSeeTheFieldWithTextAndI18nKey("No", "touchSupported");
        Then.onTheAboutDialog.iSeeTheFieldWithTextAndI18nKey("Desktop", "deviceType");
        When.onTheAboutDialog.iPressTheCloseButton();
    });

    opaTest("About dialog should show the correct device-related environment fields for a phone on the Environment Details Page", function (Given, When, Then) {
        // Arrangements
        Device.support.touch = true;
        Device.system.phone = true;
        Device.system.tablet = false;
        Device.system.desktop = false;
        Device.system.combi = false;

        // Actions
        When.onTheHomepage.iPressOnTheUserActionsMenuButton();
        When.onTheUserActionsMenu.iPressOnActionButton("aboutBtn");
        When.onTheAboutDialog.iPressTheEnvironmentDetailsListItem();
        Then.onTheAboutDialog.iSeeTheFieldWithTextAndI18nKey("Yes", "touchSupported");
        Then.onTheAboutDialog.iSeeTheFieldWithTextAndI18nKey("Phone", "deviceType");
        When.onTheAboutDialog.iPressTheCloseButton();
    });

    opaTest("About dialog should show the correct device-related environment fields for a tablet on the Environment Details Page", function (Given, When, Then) {
        // Arrangements
        Device.support.touch = true;
        Device.system.phone = false;
        Device.system.tablet = true;
        Device.system.desktop = false;
        Device.system.combi = false;

        // Actions
        When.onTheHomepage.iPressOnTheUserActionsMenuButton();
        When.onTheUserActionsMenu.iPressOnActionButton("aboutBtn");
        When.onTheAboutDialog.iPressTheEnvironmentDetailsListItem();
        Then.onTheAboutDialog.iSeeTheFieldWithTextAndI18nKey("Yes", "touchSupported");
        Then.onTheAboutDialog.iSeeTheFieldWithTextAndI18nKey("Tablet", "deviceType");
        When.onTheAboutDialog.iPressTheCloseButton();
    });

    opaTest("Should open the App Info Sample", function (Given, When, Then) {
        When.onTheHomepage.iPressOnTheGenericTileWithTitle("AppInfoSample");

        Then.onTheAppInfoSample.iSeeTheAppText("App Info Sample");
    });

    opaTest("Should open about dialog which contains the custom entries", function (Given, When, Then) {
        When.onTheHomepage.iPressOnTheUserActionsMenuButton();
        When.onTheUserActionsMenu.iPressOnActionButton("aboutBtn");

        Then.onTheAboutDialog.iSeeTheFieldWithTextAndLabel("Value #1", "Label #1");
        Then.onTheAboutDialog.iSeeTheFieldWithTextAndLabel("Value #2", "Label #2");
        Then.onTheAboutDialog.iSeeTheFieldWithTextAndLabel("", "Label #3");
        Then.onTheAboutDialog.iDoNotSeeTheLabel("Label #4");
        Then.onTheAboutDialog.iDoNotSeeTheLabel("Label #5");
        When.onTheAboutDialog.iPressTheCloseButton();

        // Assertions
        Then.iTeardownMyFLP();
    });
});
