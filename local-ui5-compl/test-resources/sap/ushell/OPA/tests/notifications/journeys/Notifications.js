// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/Device",
    "sap/ui/events/KeyCodes",
    "sap/ui/test/opaQunit",
    "sap/ushell/opa/tests/common/pages/Common",
    "sap/ushell/opa/tests/notifications/data/NotificationsMockData",
    "sap/ushell/opa/tests/header/pages/ShellHeader",
    "sap/ushell/opa/tests/notifications/pages/NotificationsPopup"
], function (Device, KeyCodes, opaTest, Common, mockData) {
    "use strict";

    /* global QUnit */

    const bIsChrome = Device.browser.name === Device.browser.BROWSER.CHROME;

    QUnit.module("notifications popover", {
        before: function () {
            this.oConfig = {
                services: {
                    Notifications: {
                        config: {
                            enabled: true,
                            serviceUrl: "/mockdata/notifications",
                            pollingIntervalInSeconds: 2000
                        }
                    }
                },
                renderers: { fiori2: { componentData: { config: { enableNotificationsUI: true } } } },
                bootstrapPlugins: {
                    PluginAddFakeCopilot: {
                        component: "sap.ushell.demo.PluginAddFakeCopilot",
                        url: "../demoapps/BootstrapPluginSample/PluginAddFakeCopilot"
                    }
                }
            };
        }
    });

    // add other adapters here, once supported
    var aAdapters = ["cdm"];
    aAdapters.forEach(function (sAdapter) {
        opaTest("Test the notifications popover functionality", function (Given, When, Then) {
            var sMockServerUri = "/mockdata/notifications/";
            Given.iStartMyMockServer(sMockServerUri, mockData.requests);
            Given.iStartMyFLP(sAdapter, this.oConfig);

            Then.onTheNotificationsPopup.iShouldSeeTheCount(7);
            // Actions
            When.onShellHeader.iPressTheNotificationsButton();

            // Popover is opened and the count is reset to 0
            Then.onTheNotificationsPopup.iShouldSeeThePopover();
            Then.onTheNotificationsPopup.iShouldSeeTheCount(0);
            Then.onTheNotificationsPopup.iShouldSeeNotifications(7);

            // I switch to the type tab
            When.onTheNotificationsPopup.iSelectTab(1);
            Then.onTheNotificationsPopup.iShouldSeeNotifications(2);
            Then.onTheNotificationsPopup.iShouldSeeNotificationsInGroup(0);

            // I expand the first group
            When.onTheNotificationsPopup.iExpandTheNotificationGroup(0);
            Then.onTheNotificationsPopup.iShouldSeeNotificationsInGroup(4);

            // I switch to the priority tab
            When.onTheNotificationsPopup.iSelectTab(2);
            Then.onTheNotificationsPopup.iShouldSeeNotifications(7);

            // Accept first item
            When.onTheNotificationsPopup.iPressTheOverflowButton(0);
            When.onTheNotificationsPopup.iPressTheItemButton(0, 0);
            Then.onTheNotificationsPopup.iShouldSeeNotifications(6);

            // I switch back to the type tab group should still be expanded
            When.onTheNotificationsPopup.iSelectTab(1);
            Then.onTheNotificationsPopup.iShouldSeeNotifications(2);
            Then.onTheNotificationsPopup.iShouldSeeNotificationsInGroup(3);

            // I reject the first item in the group
            When.onTheNotificationsPopup.iPressTheOverflowButtonInGroup(0, 0);
            When.onTheNotificationsPopup.iPressTheItemButtonInGroup(0, 1);
            Then.onTheNotificationsPopup.iShouldSeeNotifications(2);
            Then.onTheNotificationsPopup.iShouldSeeNotificationsInGroup(2);

            // I switch to the date tab
            When.onTheNotificationsPopup.iSelectTab(0);
            Then.onTheNotificationsPopup.iShouldSeeNotifications(5);

            // I accept the now second item
            When.onTheNotificationsPopup.iPressTheOverflowButton(1);
            When.onTheNotificationsPopup.iPressTheItemButton(1, 0);
            Then.onTheNotificationsPopup.iShouldSeeNotifications(4);

            // I switch back to the type tab group should still be expanded, but should have only one item left
            When.onTheNotificationsPopup.iSelectTab(1);
            Then.onTheNotificationsPopup.iShouldSeeNotifications(2);
            Then.onTheNotificationsPopup.iShouldSeeNotificationsInGroup(1);

            // I reject the last item in the first group
            When.onTheNotificationsPopup.iPressTheOverflowButtonInGroup(0, 0);
            When.onTheNotificationsPopup.iPressTheItemButtonInGroup(0, 0, 1);
            Then.onTheNotificationsPopup.iShouldSeeNotifications(1);
            Then.onTheNotificationsPopup.iShouldSeeNotificationsInGroup(0);

            // I expand the second group
            When.onTheNotificationsPopup.iExpandTheNotificationGroup(0);
            Then.onTheNotificationsPopup.iShouldSeeNotifications(1);
            Then.onTheNotificationsPopup.iShouldSeeNotificationsInGroup(3);

            // I bulk accept all notifications in the second group
            When.onTheNotificationsPopup.iPressTheOverflowButtonOnGroup(0);
            When.onTheBrowser.iPressKey(KeyCodes.ENTER);

            if (bIsChrome) {
                When.onTheNotificationsPopup.iCheckIfIHaveToReopenTheNotificationPopover();
            }

            Then.onTheNotificationsPopup.iShouldSeeNotifications(0);

            // Close the popover
            When.onShellHeader.iPressTheNotificationsButton();
            Then.onTheNotificationsPopup.iShouldSeeTheCount(0);
            Then.onTheNotificationsPopup.iShouldNotSeeThePopover();

            Then.iTeardownMyFLP();
        });
    });
});
