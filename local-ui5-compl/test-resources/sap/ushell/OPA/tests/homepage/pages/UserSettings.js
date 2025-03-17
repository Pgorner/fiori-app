// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press",
    "sap/ui/test/matchers/Properties",
    "sap/ushell/resources"
], function (Opa5, Press, PropertiesMatcher, ushellResources) {
    "use strict";

    function checkboxCheckProperty (iRow, sPropertyName, bValue) {
        return this.waitFor({
            id: "notificationsSetting--table",
            matchers: function (oTable) {
                var oItem = oTable.getItems()[iRow];
                return oItem.getCells()[2];
            },
            success: function (oElement) {
                Opa5.assert.strictEqual(oElement.getProperty(sPropertyName),
                    bValue, "Checkbox is " + (bValue ? " " : "not ") + sPropertyName + ": " +
                oElement.getBindingContext().getProperty("NotificationTypeDesc"));
            },
            errorMessage: "No Checkbox found"
        });
    }

    Opa5.createPageObjects({
        onTheUserSettings: {
            actions: {
                iPressOnTheNotificationsListItem: function () {
                    return this.waitFor({
                        id: "settingsView--userSettingEntryList",
                        matchers: function (oList) {
                            var aItems = oList.getItems();
                            for (var i = 0; i < aItems.length; i++) {
                                if (aItems[i].getCustomData()[0].getValue() === "notificationsEntry") {
                                    return aItems[i];
                                }
                            }
                        },
                        actions: new Press(),
                        errorMessage: "No notifications list item"
                    });
                },
                iPressOnTheCancelButton: function () {
                    return this.waitFor({
                        id: "settingsView--userSettingCancelButton",
                        actions: new Press(),
                        errorMessage: "No cancel button"
                    });
                },
                iPressOnTheSaveButton: function () {
                    return this.waitFor({
                        id: "settingsView--userSettingSaveButton",
                        actions: new Press(),
                        errorMessage: "No save button"
                    });
                },
                iPressOnTheUserAccountListItem: function () {
                    return this.waitFor({
                        id: "settingsView--userSettingEntryList",
                        matchers: function (oList) {
                            var aItems = oList.getItems();
                            for (var i = 0; i < aItems.length; i++) {
                                if (aItems[i].getCustomData()[0].getValue() === "userAccountEntry") {
                                    return aItems[i];
                                }
                            }
                        },
                        actions: new Press()
                    });
                },
                iPressOnTheAppearanceListItem: function () {
                    return this.waitFor({
                        id: "settingsView--userSettingEntryList",
                        matchers: function (oList) {
                            var aItems = oList.getItems();
                            for (var i = 0; i < aItems.length; i++) {
                                if (aItems[i].getCustomData()[0].getValue() === "themes") {
                                    return aItems[i];
                                }
                            }
                        },
                        actions: new Press()
                    });
                },
                iPressOnTheHomePageListItem: function () {
                    return this.waitFor({
                        id: "settingsView--userSettingEntryList",
                        matchers: function (oList) {
                            var aItems = oList.getItems();
                            for (var i = 0; i < aItems.length; i++) {
                                if (aItems[i].getCustomData()[0].getValue() === "homepageEntry") {
                                    return aItems[i];
                                }
                            }
                        },
                        actions: new Press()
                    });
                },
                iPressOnTheUserActivityListItem: function () {
                    return this.waitFor({
                        id: "settingsView--userSettingEntryList",
                        matchers: function (oList) {
                            var aItems = oList.getItems();
                            for (var i = 0; i < aItems.length; i++) {
                                if (aItems[i].getCustomData()[0].getValue() === "userActivitiesEntry") {
                                    return aItems[i];
                                }
                            }
                        },
                        actions: new Press()
                    });
                },
                iPressOnLanguageAndRegionListItem: function () {
                    return this.waitFor({
                        id: "settingsView--userSettingEntryList",
                        matchers: function (oList) {
                            var aItems = oList.getItems();
                            for (var i = 0; i < aItems.length; i++) {
                                if (aItems[i].getCustomData()[0].getValue() === "language") {
                                    return aItems[i];
                                }
                            }
                        },
                        actions: new Press()
                    });
                },
                iPressOnTheThemeTab: function () {
                    return this.waitFor({
                        id: "userPrefThemeSelector",
                        matchers: function (oView) {
                            return oView.byId("idIconTabBar").getItems()[0];
                        },
                        actions: new Press()
                    });
                },
                iPressOnTheDisplaySettingsTab: function () {
                    return this.waitFor({
                        id: "userPrefThemeSelector",
                        matchers: function (oView) {
                            return oView.byId("idIconTabBar").getItems()[1];
                        },
                        actions: new Press()
                    });
                },
                iPressOnTheShowOneGroutAtATimeRadioButton: function () {
                    return this.waitFor({
                        id: "UserSettingsHomepageSettingsView--anchorBarDisplayMode",
                        controlType: "sap.m.RadioButtonGroup",
                        matchers: function (oRadioButtonGroup) {
                            return oRadioButtonGroup.getButtons()[1];
                        },
                        actions: new Press()
                    });
                },
                iPressOnTheShowAllContentRadioButton: function () {
                    return this.waitFor({
                        id: "UserSettingsHomepageSettingsView--anchorBarDisplayMode",
                        controlType: "sap.m.RadioButtonGroup",
                        matchers: function (oRadioButtonGroup) {
                            return oRadioButtonGroup.getButtons()[0];
                        },
                        actions: new Press()
                    });
                },
                iPressOnTheSmallTileSizeRadioButton: function () {
                    return this.waitFor({
                        id: "userPrefThemeSelector",
                        matchers: function (oView) {
                            return oView.byId("tileSizeRadioButtonGroup").getButtons()[0];
                        },
                        actions: new Press(),
                        errorMessage: "No radio button at first position"
                    });
                },
                iPressOnTheCloseButton: function () {
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: function (oButton) {
                            return oButton.getText() === ushellResources.i18n.getText("closeBtn");
                        },
                        actions: new Press(),
                        errorMessage: "No close button found"
                    });
                },
                iPressOnTheResponsiveTileSizeRadioButton: function () {
                    return this.waitFor({
                        id: "userPrefThemeSelector",
                        matchers: function (oView) {
                            return oView.byId("tileSizeRadioButtonGroup").getButtons()[1];
                        },
                        actions: new Press(),
                        errorMessage: "No radio button at second position"
                    });
                }
            },
            assertions: {
                iShouldSeeAnErrorDialog: function () {
                    return this.waitFor({
                        controlType: "sap.m.Dialog",
                        success: function (oDialog) {
                            Opa5.assert.ok(oDialog, "dialog found");
                        },
                        errorMessage: "Dialog is not visible"
                    });
                },
                iShouldSeeShowOneGroupAtATimeSelected: function () {
                    return this.waitFor({
                        id: "UserSettingsHomepageSettingsView--anchorBarDisplayMode",
                        matchers: function (oRadioButtonGroup) {
                            return oRadioButtonGroup.getButtons()[1];
                        },
                        success: function (oElement) {
                            Opa5.assert.strictEqual(oElement.getSelected(), true, "One group at a time not selected");
                        }
                    });
                },
                iShouldNotSeeTheTileSizeSetting: function () {
                    return this.waitFor({
                        id: "userPrefThemeSelector",
                        success: function (oElement) {
                            Opa5.assert.ok(!oElement.byId("tileSizeRadioButtonGroup").getDomRef(), "No tile size selector");
                        },
                        errorMessage: "Tiles size selector visible but should not."
                    });
                },
                iShouldSeeNoEmailColumn: function () {
                    return this.waitFor({
                        id: "notificationsSetting--table",
                        matchers: function (oTable) {
                            return oTable.getColumns()[2];
                        },
                        success: function (oElement) {
                            Opa5.assert.strictEqual(oElement.getVisible(), false, "no email column visible");
                        },
                        errorMessage: "no notification settings table found"
                    });
                },
                iShouldSeeAnEnabledCheckbox: function (iRow) {
                    return checkboxCheckProperty.call(this, iRow, "enabled", true);
                },
                iShouldSeeASelectedCheckbox: function (iRow) {
                    return checkboxCheckProperty.call(this, iRow, "selected", true);
                },
                iShouldSeeAnUnselectedCheckbox: function (iRow) {
                    return checkboxCheckProperty.call(this, iRow, "selected", false);
                },
                iShouldSeeACheckbox: function (iRow) {
                    return checkboxCheckProperty.call(this, iRow, "visible", true);
                },
                iShouldSeeSettingsDialog: function () {
                    return this.waitFor({
                        id: "settingsView--userSettingsDialog",
                        success: function (oDialog) {
                            Opa5.assert.ok(oDialog.isOpen(), "userSettingsDialog was opened");
                        },
                        errorMessage: "userSettingsDialog was not found"
                    });
                },
                iShouldNotSeeSettingsDialog: function () {
                    return this.waitFor({
                        id: "settingsView--userSettingsDialog",
                        visible: false,
                        success: function (oDialog) {
                            Opa5.assert.ok(!oDialog.isOpen(), "userSettingsDialog should be closed.");
                        },
                        errorMessage: "userSettingsDialog was not found"
                    });
                },
                iShouldSeeContentDensityCheckboxSelected: function () {
                    return this.waitFor({
                        id: "userPrefThemeSelector--contentDensityCheckBox",
                        controlType: "sap.m.CheckBox",
                        matchers: new PropertiesMatcher({
                            selected: true
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "contentDensityCheckBox should be selected.");
                        },
                        errorMessage: "contentDensityCheckBox was not found."
                    });
                }
            }
        },
        onTheUserAccountView: {
            actions: {
                iPressOnProfileImage: function () {
                    return this.waitFor({
                        matchers: function (oList) {
                             return oList.getItems()[1];
                        },
                        controlType: "sap.m.IconTabBar",
                        actions: new Press(),
                        errorMessage: "No Profile Image icontabfilter"
                    });
                },
                iPressOnProfileImageCheckbox: function () {
                    return this.waitFor({
                        controlType: "sap.m.CheckBox",
                        actions: new Press(),
                        errorMessage: "No checkbox image consent found."
                    });
                }
            },

            assertions: {
                iShouldSeeASelectedCheckBox: function () {
                    return this.waitFor({
                        controlType: "sap.m.CheckBox",
                        matchers: new PropertiesMatcher({
                            selected: true
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "Image consent CheckBox should be selected.");
                        },
                        errorMessage: "No Image consent CheckBox was not found."
                    });
                }
            }
        },
        onTheAppearanceView: {
            actions: {
                iPressOnSAPBelizePlus: function () {
                    return this.waitFor({
                        id: "userPrefThemeSelector--themeList",
                        matchers: function (oList) {
                            return oList.getItems()[1];
                        },
                        actions: new Press(),
                        errorMessage: "SAP Belize Plus not  found."
                    });
                },
                iPressOnOptimizedForTouchInput: function () {
                    return this.waitFor({
                        controlType: "sap.m.CheckBox",
                        actions: new Press(),
                        errorMessage: "Checkbox Optimized for Touch Input not found."
                    });
                },
                iPressOnTheDisplaySettingsTab: function () {
                    return this.waitFor({
                        id: "userPrefThemeSelector",
                        matchers: function (oView) {
                            return oView.byId("idIconTabBar").getItems()[1];
                        },
                        actions: new Press()
                    });
                }
            },
            assertions: {
                iShouldSeeSAPBelizePlusSelected: function () {
                    return this.waitFor({
                        id: "userPrefThemeSelector--themeList",
                        matchers: function (oList) {
                            return oList.getItems()[1].getSelected();
                        },
                        success: function () {
                            Opa5.assert.ok(true, "SAP Belize Plus should be selected");
                        },
                        errorMessage: "SAP Belize Plus was not selected"
                    });
                },
                iShouldSeeOptimizedForTouchInputUnSelected: function () {
                    return this.waitFor({
                        controlType: "sap.m.CheckBox",
                        matchers: new PropertiesMatcher({
                            selected: false
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "Optimized For Touch Input unselected");
                        },
                        errorMessage: "Optimized For Touch Input was not selected"
                    });
                }
            }
        },
        onTheUserActivitiesView: {
            actions: {
                iPressOnTrackMyRecentActivity: function () {
                    return this.waitFor({
                        controlType: "sap.m.CheckBox",
                        actions: new Press(),
                        errorMessage: "Checkbox Track my Recent Activity not found."
                    });
                }
            },
            assertions: {
                iShouldSeeTrackMyRecentActivityUnSelected: function () {
                    return this.waitFor({
                        controlType: "sap.m.CheckBox",
                        matchers: new PropertiesMatcher({
                            selected: false
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "Track my recent activities unselected");
                        },
                        errorMessage: " Track my recent activities selected"
                    });
                }
            }
        },
        onTheLanguageAndRegionView: {
            actions: {
                iPressOnLanguageGerman: function () {
                    return this.waitFor({
                        controlType: "sap.m.ComboBox",
                        matchers: function (oComboBox) {
                            var oItem = oComboBox.getItemByKey("de");
                            return oItem ? oComboBox : undefined;
                        },
                        actions: function (oComboBox) {
                            oComboBox.setSelectedKey("de");
                        },
                        errorMessage: "Listitem German not found"
                    });
                },
                iPressOnSelectLanguage: function () {
                    return this.waitFor({
                        controlType: "sap.m.ComboBox",
                        actions: new Press(),
                        errorMessage: "Select for language not found"
                    });
                }
            },
            assertions: {
                iShouldSeeGermanSelected: function () {
                    return this.waitFor({
                        controlType: "sap.m.ComboBox",
                        matchers: new PropertiesMatcher({
                            selectedKey: "de"
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "German is selected");
                        },
                        errorMessage: "German is not selected"
                    });
                }
            }
        },
        onTheNotificationsView: {
            actions: {
                iPressOnHighPriorityCheckBox: function () {
                    return this.waitFor({
                        id: "notificationsSetting--showHighPrioCheckbox",
                        actions: new Press(),
                        errorMessage: "Show High Priority CheckBox not found"
                    });
                },
                iPressOnCheckBoxForEmailInFirstLineInNotificationTypeTable: function () {
                    return this.waitFor({
                        id: "notificationsSetting--cellCheckboxEmail-notificationsSetting--table-0",
                        actions: new Press(),
                        errorMessage: "Email checkbox in first line of Notification Type table not found"

                    });
                }
            },
            assertions: {
                iShouldSeeHighPriorityCheckBoxUnselected: function () {
                    return this.waitFor({
                        id: "notificationsSetting--showHighPrioCheckbox",
                        controlType: "sap.m.CheckBox",
                        matchers: new PropertiesMatcher({
                            selected: false
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "High priority is unselected");
                        },
                        errorMessage: "High priority is selected"
                    });
                }
            }

        }
    });
});
