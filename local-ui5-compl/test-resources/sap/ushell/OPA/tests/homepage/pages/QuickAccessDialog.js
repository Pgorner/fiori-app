// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press"
], function (Opa5, Press) {
    "use strict";

    Opa5.createPageObjects({
        onTheQuickAccessDialog: {
            actions: {
                iPressOnTheCloseButton: function () {
                    return this.waitFor({
                        id: "quickAccessCloseButton",
                        actions: new Press(),
                        errorMessage: "Could not find the close button"
                    });
                }
            },
            assertions: {
                iShouldSeeTabSelectedWithId: function (sId) {
                    return this.waitFor({
                        id: "quickAccessIconTabBar",
                        success: function (oIconTabBar) {
                            Opa5.assert.ok(oIconTabBar.getSelectedKey(), sId);
                        },
                        errorMessage: "Could not find the tab with Id:" + sId
                    });
                },
                iShouldSeeFocusOnRecentActivityFilterTab: function () {
                    return this.waitFor({
                        id: /recentActivityFilter/,
                        controlType: "sap.m.IconTabFilter",
                        success: function (oIconTabFilter) {
                            Opa5.assert.ok(oIconTabFilter[0].getFocusDomRef(), document.activeElement);
                        },
                        errorMessage: "Could not find the tab with Id: recentActivityFilter"
                    });
                },
                iShouldSeeFocusOnFrequentlyUsedFilterTab: function () {
                    return this.waitFor({
                        id: /frequentlyUsedFilter/,
                        controlType: "sap.m.IconTabFilter",
                        success: function (oIconTabFilter) {
                            Opa5.assert.ok(oIconTabFilter[0].getFocusDomRef(), document.activeElement);
                        },
                        errorMessage: "Could not find the tab with Id: frequentlyUsedFilter"
                    });
                }
            }
        }
    });
});
