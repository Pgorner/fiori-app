// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press",
    "sap/ui/test/actions/EnterText",
    "sap/ui/test/matchers/Properties",
    "sap/ui/test/matchers/Ancestor"
], function (Opa5, Press, EnterText, PropertiesMatcher, AncestorMatcher) {
    "use strict";

    Opa5.createPageObjects({
        onTheAppFinderComponent: {
            actions: {
                iClickOnTheTileWithTitle: function (sTitle) {
                    this.waitFor({
                        controlType: "sap.ushell.ui.appfinder.AppBoxInternal",
                        matchers: new PropertiesMatcher({ title: sTitle }),
                        success: function (aTiles) {
                            new Press().executeOn(aTiles[0]);
                        }
                    });
                },
                iClickThePinOnTheCatalogItemWithTitle: function (sTitle) {
                    this.waitFor({
                        controlType: "sap.ushell.ui.appfinder.AppBoxInternal",
                        matchers: new PropertiesMatcher({ title: sTitle }),
                        success: function (aTiles) {
                            this.waitFor({
                                controlType: "sap.ushell.ui.appfinder.PinButton",
                                matchers: new AncestorMatcher(aTiles[0]),
                                actions: new Press()
                            });
                        }
                    });
                },
                iAddTheTileToAPage: function (iIndexListItem) {
                    this.waitFor({
                        controlType: "sap.m.Popover",
                        id: "sapUshellVisualizationOrganizerPopover",
                        success: function (aPopovers) {
                            this.waitFor({
                                controlType: "sap.m.StandardListItem",
                                matchers: [
                                    new AncestorMatcher(aPopovers[0])
                                ],
                                success: function (aListItems) {
                                    this.waitFor({
                                        controlType: "sap.m.CheckBox",
                                        matchers: [
                                            new AncestorMatcher(aListItems[iIndexListItem])
                                        ],
                                        actions: new Press()
                                    });
                                }
                            });
                        }
                    });
                },
                iToggleTheTileAssignmentToAPageWithTitle: function (sTitle) {
                    this.waitFor({
                        controlType: "sap.m.Popover",
                        id: "sapUshellVisualizationOrganizerPopover",
                        success: function (aPopovers) {
                            this.waitFor({
                                controlType: "sap.m.StandardListItem",
                                matchers: [
                                    new AncestorMatcher(aPopovers[0]),
                                    new PropertiesMatcher({
                                        title: sTitle
                                    })
                                ],
                                actions: new Press()
                            });
                        }
                    });
                },
                iClickOkOnThePopover: function () {
                    this.waitFor({
                        controlType: "sap.m.Popover",
                        id: "sapUshellVisualizationOrganizerPopover",
                        success: function () {
                            this.waitFor({
                                controlType: "sap.m.Button",
                                id: "sapUshellVisualizationOrganizerOKButton",
                                actions: new Press()
                            });
                        }
                    });
                },
                iClickCancelOnThePopover: function () {
                    this.waitFor({
                        controlType: "sap.m.Popover",
                        id: "sapUshellVisualizationOrganizerPopover",
                        success: function () {
                            this.waitFor({
                                controlType: "sap.m.Button",
                                id: "sapUshellVisualizationOrganizerCloseButton",
                                actions: new Press(),
                                success: function () {
                                    this.waitFor({
                                        controlType: "sap.m.Dialog",
                                        id: "sapUshellVisualizationOrganizerDiscardDialog",
                                        success: function () {
                                            Opa5.assert.ok(true, "Discard dialog was found.");
                                        }
                                    });
                                }
                            });
                        }
                    });
                },
                iClickOnTheButton: function (sText) {
                    this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: new PropertiesMatcher({
                            text: sText
                        }),
                        actions: new Press()
                    });
                },
                iSearchForAnApp: function (sSearchText, sId) {
                    this.waitFor({
                        controlType: "sap.m.SearchField",
                        id: sId,
                        actions: new EnterText({ text: sSearchText }),
                        errorMessage: "The search field was not found."
                    });
                },
                iClickTheToggleButton: function () {
                    this.waitFor({
                        controlType: "sap.m.ToggleButton",
                        id: "sapUshellVisualizationOrganizerSelectedPages",
                        actions: new Press(),
                        errorMessage: "The toggle button was not found."
                    });
                }

            },
            assertions: {
                iSeeThePopover: function () {
                    this.waitFor({
                        controlType: "sap.m.Popover",
                        id: "sapUshellVisualizationOrganizerPopover",
                        success: function () {
                            Opa5.assert.ok(true, "Popover was found.");
                        }
                    });
                },
                iSeeDiscardDialog: function () {
                    this.waitFor({
                        controlType: "sap.m.Dialog",
                        id: "sapUshellVisualizationOrganizerDiscardDialog",
                        success: function () {
                            Opa5.assert.ok(true, "Discard dialog was found.");
                        }
                    });
                },
                iSeeTheTile: function (sTitle) {
                    this.waitFor({
                        controlType: "sap.ushell.ui.appfinder.AppBoxInternal",
                        matchers: new PropertiesMatcher({
                            title: sTitle
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "I see the searched tile.");
                        }
                    });
                },
                iSeeThePageInList: function (sTitle) {
                    this.waitFor({
                        controlType: "sap.m.StandardListItem",
                        matchers: new PropertiesMatcher({
                            title: sTitle
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The correct page was found.");
                        }
                    });
                },
                iSeeTheTileOnHomepage: function (sTitle) {
                    this.waitFor({
                        controlType: "sap.m.GenericTile",
                        matchers: new PropertiesMatcher({
                            header: sTitle
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The tile is there.");
                        }
                    });
                },
                iSeeTheCatalogEntryContainerWithTitle: function (sTitle) {
                    this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.CatalogEntryContainer",
                        matchers: new PropertiesMatcher({
                            header: sTitle
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The Container is there.");
                        }
                    });
                },
                iSeeTheCatalogItemPinnedWithTitle: function (sTitle) {
                    this.waitFor({
                        controlType: "sap.ushell.ui.appfinder.AppBoxInternal",
                        check: function (aAppBoxes) {
                            for (let i = 0; i < aAppBoxes.length; i++) {
                                if (aAppBoxes[i].getTitle() === sTitle) {
                                    return aAppBoxes[i].getPinButton().getProperty("icon") === "sap-icon://accept";
                                }
                            }
                        },
                        success: function () {
                            Opa5.assert.ok(true, "Appbox was pinned.");
                        }
                    });
                },

                iSeeTheCatalogItemUnpinnedWithTitle: function (sTitle) {
                    this.waitFor({
                        controlType: "sap.ushell.ui.appfinder.AppBoxInternal",
                        check: function (aAppBoxes) {
                            for (let i = 0; i < aAppBoxes.length; i++) {
                                if (aAppBoxes[i].getTitle() === sTitle) {
                                    return aAppBoxes[i].getPinButton().getProperty("icon") === "sap-icon://add";
                                }
                            }
                        },
                        success: function () {
                            Opa5.assert.ok(true, "Appbox was unpinned.");
                        }
                    });
                }
            }
        }
    });
});
