// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ushell/opa/tests/header/pages/UserActionsMenu",
    "sap/ushell/opa/tests/homepage/pages/Homepage",
    "sap/ushell/opa/tests/homepage/pages/UserSettings"
], function (opaTest) {
    "use strict";

    /* global QUnit */

    var aMethodsForMockServer = [{
        method: "GET",
        path: /Channels\(ChannelId='SAP_EMAIL'\)/,
        response: function (xhr) {
            xhr.respondJSON(200, {}, { IsActive: true });
        }
    }, {
        method: "PUT",
        path: /NotificationTypePersonalizationSet\(NotificationTypeId=a\)/,
        response: function (xhr) {
            xhr.respondJSON(400, {"x-csrf-token": "required"},
                {
                error: {
                    code: "1123",
                    message: {
                        value: "My error"
                    }
                }
            });
        }
    }, {
        method: "GET",
        path: /Channels\(ChannelId='SAP_SMP'\)/,
        response: function (xhr) {
            xhr.respondJSON(200, {}, { IsActive: false });
        }
    }, {
        method: "GET",
        path: /NotificationTypePersonalizationSet/,
        response: function (xhr) {
            xhr.respondJSON(200, {}, {
                value: [{
                    // enabled true -> email will be delivered
                    NotificationTypeId: "a",
                    NotificationTypeDesc: "1 EmailX[X], EmailId[X], !DelivEmail[_], !Deliv[_]",
                    IsEmailEnabled: true,
                    IsEmailIdMaintained: true,
                    DoNotDeliverEmail: false,
                    DoNotDeliver: false
                }, {
                    // email enabled, email-ID given, do not deliver email
                    NotificationTypeId: "b",
                    NotificationTypeDesc: "2 EmailX[X], EmailId[X], !DelivEmail[X], !Deliv[_]",
                    IsEmailEnabled: true,
                    IsEmailIdMaintained: true,
                    DoNotDeliverEmail: true,
                    DoNotDeliver: false
                }, {
                    // notification type disabled
                    NotificationTypeId: "c",
                    NotificationTypeDesc: "3 EmailX[X], EmailId[X], !DelivEmail[_], !Deliv[X]",
                    IsEmailEnabled: true,
                    IsEmailIdMaintained: true,
                    DoNotDeliverEmail: false,
                    DoNotDeliver: true
                }, {
                    // email not enabled, email-ID given, settings partly disabled
                    NotificationTypeId: "d",
                    NotificationTypeDesc: "4 EmailX[_], EmailId[X], !DelivEmail[_], !Deliv[_]",
                    IsEmailEnabled: false,
                    IsEmailIdMaintained: true,
                    DoNotDeliverEmail: false,
                    DoNotDeliver: false
                }, {
                    // no email-Id
                    NotificationTypeId: "e",
                    NotificationTypeDesc: "5 EmailX[X], EmailId[_], !DelivEmail[X], !Deliv[_]",
                    IsEmailEnabled: true,
                    IsEmailIdMaintained: false,
                    DoNotDeliverEmail: true,
                    DoNotDeliver: false
                }]
            });
        }
    }];

    QUnit.module("User settings Save", {
        beforeEach: function () {
            this.oConfig = {
                renderers: {
                    fiori2: {
                        componentData: {
                            config: {
                                enableNotificationsUI: true,
                                enableUserImgConsent: true,
                                enableSetLanguage: true
                            }
                        }
                    }
                },
                services: {
                    Notifications: {
                        config: {
                            enabled: true,
                            serviceUrl: "/mockdata/notifications",
                            pollingIntervalInSeconds: 100
                        }
                    }
                }
            };
        }
    });

    function saveSetting (Given, When, Then) {
        // Actions
        When.onTheHomepage.iPressOnTheUserActionsMenuButton();
        When.onTheUserActionsMenu.iPressOnActionButtonWithTitle("Settings");
        // all the tabs
        // Accounting
        When.onTheUserSettings.iPressOnTheUserAccountListItem();
        When.onTheUserAccountView.iPressOnProfileImage();
        When.onTheUserAccountView.iPressOnProfileImageCheckbox();
        Then.onTheUserAccountView.iShouldSeeASelectedCheckBox();

        // Appearance
        When.onTheUserSettings.iPressOnTheAppearanceListItem();
        When.onTheAppearanceView.iPressOnSAPBelizePlus();
        Then.onTheAppearanceView.iShouldSeeSAPBelizePlusSelected();

        When.onTheAppearanceView.iPressOnTheDisplaySettingsTab();
        When.onTheAppearanceView.iPressOnOptimizedForTouchInput();
        Then.onTheAppearanceView.iShouldSeeOptimizedForTouchInputUnSelected();

        // User Activity
        When.onTheUserSettings.iPressOnTheUserActivityListItem();
        When.onTheUserActivitiesView.iPressOnTrackMyRecentActivity();
        Then.onTheUserActivitiesView.iShouldSeeTrackMyRecentActivityUnSelected();

        // Notifications
        When.onTheUserSettings.iPressOnTheNotificationsListItem();
        When.onTheNotificationsView.iPressOnHighPriorityCheckBox();
        Then.onTheNotificationsView.iShouldSeeHighPriorityCheckBoxUnselected();
    }

    function checkSavedSetting (Given, When, Then, bChange) {
        // Actions
        When.onTheHomepage.iPressOnTheUserActionsMenuButton();
        When.onTheUserActionsMenu.iPressOnActionButtonWithTitle("Settings");

        // all the tabs
        // Accounting
        When.onTheUserSettings.iPressOnTheUserAccountListItem();
        Then.onTheUserAccountView.iShouldSeeASelectedCheckBox();

        // Appearance
        When.onTheUserSettings.iPressOnTheAppearanceListItem();

        When.onTheUserSettings.iPressOnTheThemeTab();
        Then.onTheAppearanceView.iShouldSeeSAPBelizePlusSelected();

        When.onTheUserSettings.iPressOnTheDisplaySettingsTab();
        Then.onTheAppearanceView.iShouldSeeOptimizedForTouchInputUnSelected();

        // User Activity
        When.onTheUserSettings.iPressOnTheUserActivityListItem();
        Then.onTheUserActivitiesView.iShouldSeeTrackMyRecentActivityUnSelected();

        // Notifications
        When.onTheUserSettings.iPressOnTheNotificationsListItem();
        Then.onTheNotificationsView.iShouldSeeHighPriorityCheckBoxUnselected();
    }
    opaTest("Should save all settings and check if saved", function (Given, When, Then) {
        // Arrangements

        var sMockServerUri = "/mockdata/notifications/";
        Given.iStartMyMockServer(sMockServerUri, aMethodsForMockServer);

        Given.iStartMyFLP("cdm", this.oConfig, "cdmSpaces");
        saveSetting.call(this, Given, When, Then);
        When.onTheUserSettings.iPressOnTheSaveButton();
        checkSavedSetting.call(this, Given, When, Then);
        Then.iTeardownMyFLP();
    });

    opaTest("Should save notification settings with error", function (Given, When, Then) {
        // Arrangements
        var sMockServerUri = "/mockdata/notifications/";
        Given.iStartMyMockServer(sMockServerUri, aMethodsForMockServer);
        Given.iStartMyFLP("cdm", this.oConfig, "cdmSpaces");
        When.onTheHomepage.iPressOnTheUserActionsMenuButton();
        When.onTheUserActionsMenu.iPressOnActionButtonWithTitle("Settings");
        // Notifications
        When.onTheUserSettings.iPressOnTheNotificationsListItem();
        When.onTheNotificationsView.iPressOnCheckBoxForEmailInFirstLineInNotificationTypeTable();
        When.onTheUserSettings.iPressOnTheSaveButton();
        Then.onTheUserSettings.iShouldSeeAnErrorDialog();
        When.onTheUserSettings.iPressOnTheCloseButton();
        Then.iTeardownMyFLP();
    });

    opaTest("Should set Region and language", function (Given, When, Then) {
        // Save is avoided to avoid restart of FLP
        // Arrangements

        var sMockServerUri = "/mockdata/notifications/";
        Given.iStartMyMockServer(sMockServerUri, aMethodsForMockServer);

        Given.iStartMyFLP("cdm", this.oConfig, "cdmSpaces");
        // Actions
        When.onTheHomepage.iPressOnTheUserActionsMenuButton();
        When.onTheUserActionsMenu.iPressOnActionButtonWithTitle("Settings");
        // Language and region entry
        When.onTheUserSettings.iPressOnLanguageAndRegionListItem();
        When.onTheLanguageAndRegionView.iPressOnSelectLanguage();
        When.onTheLanguageAndRegionView.iPressOnLanguageGerman();
        Then.onTheLanguageAndRegionView.iShouldSeeGermanSelected();
        Then.iTeardownMyFLP();
    });

});
