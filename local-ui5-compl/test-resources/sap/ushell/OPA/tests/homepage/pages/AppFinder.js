// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press",
    "sap/ui/test/matchers/Properties",
    "sap/ui/test/matchers/Ancestor",
    "sap/ui/test/OpaBuilder"
], function (Opa5, Press, PropertiesMatcher, AncestorMatcher, OpaBuilder) {
    "use strict";

    Opa5.createPageObjects({
        onTheAppFinder: {
            actions: {
                iPressAllAppsPinButtons: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.appfinder.PinButton",
                        actions: new Press()
                    });
                },
                iClickThePinButtonOnTheTileWithIndex: function (index) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Tile",
                        success: function (aTiles) {
                            this.waitFor({
                                controlType: "sap.ushell.ui.appfinder.PinButton",
                                matchers: new AncestorMatcher(aTiles[index]),
                                actions: new Press()
                            });
                        }
                    });
                },
                iClickOnAllCatalogs: function () {
                    return this.waitFor({
                        controlType: "sap.m.StandardListItem",
                        matchers: new PropertiesMatcher({
                            title: "All"
                        }),
                        actions: new Press()
                    });
                },
                iClickTheButton: function (sId) {
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        id: sId,
                        actions: new Press()
                    });
                },
                iClickTheCloseButtonOnTheGroupListPopover: function () {
                    return this.waitFor({
                        controlType: "sap.m.Toolbar",
                        id: "groupsPopover-footer",
                        searchOpenDialogs: true,
                        success: function (oToolbar) {
                            this.waitFor({
                                controlType: "sap.m.Button",
                                matchers: [
                                    new PropertiesMatcher({
                                        text: "Close"
                                    }),
                                    new AncestorMatcher(oToolbar)
                                ],
                                actions: new Press()
                            });
                        }
                    });
                },
                iClickTheOKButtonOnTheGroupListPopover: function () {
                    return this.waitFor({
                        controlType: "sap.m.Toolbar",
                        id: "groupsPopover-footer",
                        searchOpenDialogs: true,
                        success: function (oToolbar) {
                            this.waitFor({
                                controlType: "sap.m.Button",
                                matchers: [
                                    new PropertiesMatcher({
                                        text: "OK"
                                    }),
                                    new AncestorMatcher(oToolbar)
                                ],
                                actions: new Press()
                            });
                        }
                    });
                },
                iAddTileToGroup: function (sGroup) {
                    this.waitFor({
                        controlType: "sap.m.DisplayListItem",
                        matchers: [
                            new PropertiesMatcher({
                                label: sGroup
                            })
                        ],
                        actions: new Press()
                    });
                },
                iEnterTheNewGroupTitle: function (sTitle) {
                    return OpaBuilder.create(this)
                        .hasType("sap.m.StandardListItem")
                        .hasProperties({
                            title: "New Group"
                        })
                        .isDialogElement(true)
                        .doPress()
                        .error("No New Group item found.")
                        .success(function () {
                            OpaBuilder.create(this)
                                .hasType("sap.m.Input")
                                .hasProperties({
                                    id: "newGroupNameInput"
                                })
                                .isDialogElement(true)
                                .doEnterText(sTitle)
                                .execute();
                        })
                        .execute();
                }
            },
            assertions: {
                iSeeThePopover: function () {
                    return this.waitFor({
                        controlType: "sap.m.Popover",
                        id: "groupsPopover-popover",
                        success: function () {
                            Opa5.assert.ok(true, "The popover was opened.");
                        }
                    });
                }
            }
        }
    });
});
