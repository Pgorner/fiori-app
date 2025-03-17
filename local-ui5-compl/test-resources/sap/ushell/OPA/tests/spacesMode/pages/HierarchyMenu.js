// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press",
    "sap/ui/test/matchers/Properties"
], function (
    Opa5,
    Press,
    PropertiesMatcher
) {
    "use strict";

    Opa5.createPageObjects({
        onTheRuntimeComponent: {
            actions: {
                iClickOnAppNavSampleTile: function (sText) {
                    return this.waitFor({
                        controlType: "sap.m.GenericTile",
                        matchers: new PropertiesMatcher({
                            header: "Dynamic App Launcher"
                        }),
                        actions: new Press()
                    });
                },
                iClickOnTheHierarchyMenu: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.shell.ShellAppTitle",
                        id: "shellAppTitle",
                        actions: new Press()
                    });
                },
                iClickOnTheHierarchyMenuEntry: function (pageTitle) {
                    return this.waitFor({
                        controlType: "sap.m.StandardListItem",
                        matchers: new PropertiesMatcher({
                            title: pageTitle
                        }),
                        actions: new Press()
                    });
                },
                iClickOnTheHierarchyMenuAllMyAppsButton: function () {
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        id: "allMyAppsButton",
                        actions: new Press()
                    });
                }
            },
            assertions: {
                iSeeTheAppNavSampleTile: function () {
                    return this.waitFor({
                        controlType: "sap.m.GenericTile",
                        matchers: new PropertiesMatcher({
                            header: "Dynamic App Launcher"
                        }),
                        success: function () {
                            Opa5.assert.ok("App Tile was found");
                        }
                    });
                },
                iSeeAppNavSampleAppStarted: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.shell.ShellAppTitle",
                        matchers: new PropertiesMatcher({
                            text: "Sample Application For Navigation"
                        }),
                        success: function () {
                            Opa5.assert.ok("App started");
                        }
                    });
                },
                iSeeEntryWithTitleInTheHierarchyMenu: function (sEntryTitle) {
                    return this.waitFor({
                        controlType: "sap.m.StandardListItem",
                        matchers: new PropertiesMatcher({
                            title: sEntryTitle
                        }),
                        success: function () {
                            Opa5.assert.ok("Title found");
                        }
                    });
                },
                iSeeTheAppTitleAsFirstEntryOfTheNavigationMenu: function () {
                    return this.waitFor({
                        controlType: "sap.m.Title",
                        visible: false,
                        id: "navMenuInnerTitle",
                        success: function () {
                            Opa5.assert.ok("Title found");
                        }
                    });
                },
                iSeeFocusOnTheHierarchyListItem: function (itemPos) {
                    return this.waitFor({
                        id: "sapUshellNavHierarchyItems",
                        check: function () {
                            var oFocusedElement = document.activeElement;
                            return (oFocusedElement.tagName === "LI") && (oFocusedElement.getAttribute("aria-posinset") === itemPos + "");
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The correct list item focused.");
                        }
                    });
                },
                iSeeFocusOnTheMiniTile: function (itemPos) {
                    return this.waitFor({
                        id: "sapUshellNavHierarchyItems",
                        check: function () {
                            var oFocusedElement = document.activeElement;
                            return (oFocusedElement.tagName === "DIV") && (oFocusedElement.getAttribute("aria-posinset") === itemPos + "");
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The correct mini tile focused.");
                        }
                    });
                },
                iSeeFocusOnTheAllMyAppsButton: function () {
                    return this.waitFor({
                        id: "sapUshellNavHierarchyItems",
                        check: function () {
                            return document.activeElement.id === "allMyAppsButton";
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The All My Apps Button is focused.");
                        }
                    });
                },
                iSeeTheBackButton: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.shell.ShellHeadItem",
                        matchers: new PropertiesMatcher({ id: "backBtn" }),
                        check: function (aControls) {
                            return (aControls.length === 1);
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The back button is there.");
                        }
                    });
                }
            }
        }
    });
});
