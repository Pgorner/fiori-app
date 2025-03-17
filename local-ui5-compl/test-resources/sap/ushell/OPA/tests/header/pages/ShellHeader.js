// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press",
    "sap/ushell/EventHub",
    "sap/ui/test/matchers/Ancestor",
    "sap/ui/test/matchers/Properties",
    "sap/ui/qunit/utils/nextUIUpdate"
], function (
    Opa5,
    Press,
    EventHub,
    AncestorMatcher,
    PropertiesMatcher,
    nextUIUpdate
) {
    "use strict";

    Opa5.createPageObjects({
        onShellHeader: {
            actions: {
                iBlockHeader: function () {
                    return this.waitFor({
                        id: "shell-header",
                        actions: (oHeader) => oHeader.setBlocked(true),
                        errorMessage: "Shell header is not displayed"
                    });
                },
                iPressOnTheEndItemsOverflowBtn: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.shell.ShellHeadItem",
                        visible: false,
                        id: "endItemsOverflowBtn",
                        actions: new Press(),
                        errorMessage: "End items overflow button is not present in the header"
                    });
                },
                iPressTheSearchBtn: function () {
                    return this.waitFor({
                        id: "sf",
                        actions: new Press(),
                        errorMessage: "Search button is not present in the header"
                    });
                },
                iPressTheNotificationsButton: function () {
                    return this.waitFor({
                        id: "NotificationsCountButton",
                        actions: new Press(),
                        errorMessage: "Notifications button is not available"
                    });
                },
                iPressTheBackButton: function () {
                    return this.waitFor({
                        id: "backBtn",
                        actions: new Press()
                    });
                }
            },
            assertions: {
                iSeeHeaderBlocked: function (bBlocked) {
                    return this.waitFor({
                        id: "shell-header",
                        success: function (oHeader) {
                            Opa5.assert.strictEqual(oHeader.getBlocked(), bBlocked, "Blocked state is " + bBlocked);
                        },
                        errorMessage: "Shell header is not displayed"
                    });
                },
                iShouldSeeHeaderItems: function (iNumber) {
                    return this.waitFor({
                        id: "shell-header",
                        success: function (oElement) {
                            var aVisibleItems = oElement.getHeadItems().filter(function (oItem) {
                                return oItem.getVisible();
                            });
                            Opa5.assert.strictEqual(aVisibleItems.length, iNumber, "Expected " + iNumber + " headerItems in header");
                        },
                        errorMessage: "Header Items was not found"
                    });
                },
                iShouldSeeHeaderEndItems: function (iNumber) {
                    return this.waitFor({
                        id: "shell-header",
                        success: function (oElement) {
                            var aVisibleItems = oElement.getHeadEndItems().filter(function (oItem) {
                                return oItem.getVisible();
                            });
                            Opa5.assert.strictEqual(aVisibleItems.length, iNumber, "Expected " + iNumber + " headerEndItems in header");
                        },
                        errorMessage: "Header End Items was not found"
                    });
                },
                iShouldSeeHeaderEndItem: function (sIconProperty) {
                    return this.waitFor({
                        id: "shell-header",
                        success: function (aShellHeader) {
                            return this.waitFor({
                                controlType: "sap.ushell.ui.shell.ShellHeadItem",
                                matchers: [
                                    new AncestorMatcher(aShellHeader[0]),
                                    new PropertiesMatcher({
                                        icon: sIconProperty
                                    })
                                ],
                                success: function () {
                                    Opa5.assert.ok(true, "The HeaderEndItem with icon " + sIconProperty + " was found");
                                },
                                errorMessage: "Did not find HeaderEndItem icon."
                            });
                        },
                        errorMessage: "Did not find ShellHeader."
                    });
                },
                iShouldSeeHiddenHeaderEndItemsInPopover: function (iNumber) {
                    return this.waitFor({
                        id: "headEndItemsOverflow",
                        matchers: function (oPopover) {
                            return oPopover.getContent()[0].getItems();
                        },
                        success: function (aItems) {
                            Opa5.assert.strictEqual(aItems.length, iNumber, "Expected " + iNumber + " headerEndItems in overflow");
                        },
                        errorMessage: "headEndItemsOverflow was not found"
                    });
                },
                iShouldSeeSearchIcon: function () {
                    return this.waitFor({
                        id: "sf",
                        errorMessage: "Search icon is not visible in the header"
                    });
                },
                iShouldSeeSettingsIcon: function () {
                    return this.waitFor({
                        id: "userSettingsBtn",
                        errorMessage: "Settings icon is not visible in the header"
                    });
                },
                iShouldSeeOpenSearch: function () {
                    return this.waitFor({
                        id: "searchFieldInShell",
                        success: function (oSearchField) {
                            Opa5.assert.ok(oSearchField.$().width() > 0, "Search field is visible");
                        },
                        errorMessage: "Search field is not in the header"
                    });
                },
                iShouldNotSeeSearchOverlay: function () {
                    return this.waitFor({
                        id: "shell-header",
                        success: function (oShellHeader) {
                            Opa5.assert.ok(!oShellHeader.hasStyleClass("sapUshellShellShowSearchOverlay"),
                                "Search overlay is not set on the header");
                        },
                        errorMessage: "Search field is not in the header"
                    });
                },
                iShouldSeeTitle: function (sTitle) {
                    return this.waitFor({
                        id: "shellAppTitle",
                        success: function (oShellAppTitle) {
                            Opa5.assert.strictEqual(oShellAppTitle.getText(), sTitle, "Expected title is " + sTitle);
                        },
                        errorMessage: "shellAppTitle was not found"
                    });
                },
                iShouldSeeFocusOnAppTitle: function () {
                    return this.waitFor({
                        id: "shellAppTitle",
                        check: function (oTitle) {
                            return oTitle.getFocusDomRef() === document.activeElement;
                        },
                        success: function (oTitle) {
                            Opa5.assert.ok(oTitle, "The ShellAppTitle was focused.");
                        }
                    });
                },
                iShouldSeeFocusOnLogo: function () {
                    return this.waitFor({
                        id: "shell-header",
                        check: function () {
                            return document.getElementById("shell-header-logo") === document.activeElement;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The Logo was focused.");
                        }
                    });
                }
            }
        }
    });
});
