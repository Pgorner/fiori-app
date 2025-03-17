// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press"
], function (
    Opa5,
    Press
) {
    "use strict";

    Opa5.createPageObjects({
        onTheAllMyAppsMenu: {
            actions: {
                iPressTheBackButton: function () {
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        id: "sapUshellAppTitleBackButton",
                        actions: new Press()
                    });
                },
                iPressAnItem: function (sItemTitle) {
                    return this.waitFor({
                        controlType: "sap.m.StandardListItem",
                        matchers: function (oListItem) {
                            return oListItem.getTitle() === sItemTitle;
                        },
                        actions: new Press()
                    });
                }
            },
            assertions: {
                iSeeTheOpenMenu: function () {
                    return this.waitFor({
                        controlType: "sap.m.Popover",
                        id: "sapUshellAllMyAppsPopover-popover",
                        success: function () {
                            Opa5.assert.ok(true, "The All My Apps menu is open");
                        }
                    });
                },
                iSeeFocusOnTheBackButton: function () {
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        id: "sapUshellAppTitleBackButton",
                        check: function (oButton) {
                            return oButton.getFocusDomRef() === document.activeElement;
                        },
                        success: function (oTitle) {
                            Opa5.assert.ok(oTitle, "The back button is focused");
                        }
                    });
                },
                iSeeAnItem: function (sItemTitle) {
                    return this.waitFor({
                        controlType: "sap.m.StandardListItem",
                        matchers: function (oListItem) {
                            return oListItem.getTitle() === sItemTitle;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "Item with title " + sItemTitle + " is visible");
                        }
                    });
                }
            }
        }
    });
});
