// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/matchers/Properties"
], function (Opa5, PropertiesMatcher) {
    "use strict";

    Opa5.createPageObjects({
        onTheAnchorNavigationBar: {
            actions: {},
            assertions: {
                iShouldFindTheAnchorNavigationBar: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.AnchorNavigationBar",
                        id: "anchorNavigationBar",
                        success: function () {
                            Opa5.assert.ok(true, "The AnchorNavigationBar was found.");
                        }
                    });
                },
                iShouldNotFindTheAnchorNavigationBar: function () {
                    return this.waitFor({
                        controlType: "sap.m.Page",
                        id: "sapUshellDashboardPage",
                        success: function (oPage) {
                            Opa5.assert.ok(!oPage.getShowHeader(), "The AnchorNavigationBar was not found.");
                        }
                    });
                },
                iShouldSeeFocusOnAnchorItem: function (sTitle) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.AnchorItem",
                        matchers: new PropertiesMatcher({
                            title: sTitle
                        }),
                        check: function (aItems) {
                            return aItems[0].getDomRef() === document.activeElement;
                        },
                        success: function (oItem) {
                            Opa5.assert.ok(oItem, "The ShellAppTitle was focused.");
                        }
                    });
                }
            }
        }
    });
});
