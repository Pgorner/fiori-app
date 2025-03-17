// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press"
], function (Opa5, Press) {
    "use strict";

    Opa5.createPageObjects({
        onTheUserActionsMenu: {
            actions: {
                iPressOnActionButton: function (sActionItemId) {
                    return this.waitFor({
                        id: "sapUshellUserActionsMenuPopover",
                        matchers: function (oPopover) {
                            return oPopover.getContent()[0].getItems().find(function (oListItem) {
                                var oCustomData = oListItem.getCustomData().find(function (oCustomData) {
                                    return oCustomData.getKey() === "actionItemId";
                                });
                                return oCustomData.getValue() === sActionItemId;
                            });
                        },
                        actions: new Press(),
                        errorMessage: sActionItemId + " was not found"
                    });
                },
                iPressOnActionButtonWithTitle: function (sTitle) {
                    return this.waitFor({
                        id: "sapUshellUserActionsMenuPopover",
                        matchers: function (oPopover) {
                            return oPopover.getContent()[0].getItems().find(function (oListItem) {
                                return oListItem.getTitle() === sTitle;
                            });
                        },
                        actions: new Press(),
                        errorMessage: sTitle + " was not found"
                    });
                }
            },
            assertions: {
                iShouldSeeUserActionsMenuPopover: function () {
                    return this.waitFor({
                        id: "sapUshellUserActionsMenuPopover",
                        success: function (oPopover) {
                            Opa5.assert.ok(oPopover.isOpen(), "UserActionsMenu popover should be opened.");
                        },
                        errorMessage: "UserActionsMenu popover was not found"
                    });
                },
                iShouldNotSeeUserActionsMenuPopover: function () {
                    return this.waitFor({
                        id: "sapUshellUserActionsMenuPopover",
                        visible: false,
                        success: function (oPopover) {
                            Opa5.assert.ok(!oPopover.isOpen(), "UserActionsMenu popover should be closed.");
                        },
                        errorMessage: "UserActionsMenu popover was not found"
                    });
                },
                iShouldSeeItemInUserActionsMenu: function (sActionItemId) {
                    return this.waitFor({
                        id: "sapUshellUserActionsMenuPopover",
                        matchers: function (oPopover) {
                            return oPopover.getContent()[0].getItems();
                        },
                        success: function (aItems) {
                            var oListItem = aItems.find(function (oItem) {
                                return oItem.getCustomData().some(function (oCustomData) {
                                    return oCustomData.getValue() === sActionItemId;
                                });
                            });
                            Opa5.assert.ok(oListItem, "List item should be shown in popover: " + sActionItemId);
                        },
                        errorMessage: "UserActionsMenu popover was not found"
                    });
                },
                iShouldSeeItemInUserActionsMenuWithTitle: function (sTitle) {
                    return this.waitFor({
                        id: "sapUshellUserActionsMenuPopover",
                        matchers: function (oPopover) {
                            return oPopover.getContent()[0].getItems();
                        },
                        success: function (aItems) {
                            var oListItem = aItems.find(function (oItem) {
                                return oItem.getTitle() === sTitle;
                            });
                            Opa5.assert.ok(oListItem, "List item should be shown in popover: " + sTitle);
                        },
                        errorMessage: "UserActionsMenu popover was not found"
                    });
                }
            }
        }
    });
});
