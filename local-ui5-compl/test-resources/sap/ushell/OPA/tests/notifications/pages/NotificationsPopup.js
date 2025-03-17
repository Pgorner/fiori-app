// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/Element",
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press",
    "sap/ui/test/matchers/Ancestor"
], function (Element, Opa5, Press, Ancestor) {
    "use strict";

    Opa5.createPageObjects({
        onTheNotificationsPopup: {
            actions: {
                iPressTheOverflowButton: function (itemNumber) {
                    return this.waitFor({
                        controlType: "sap.m.NotificationList",
                        matchers: function (oList) {
                            return oList.getItems()[itemNumber];
                        },
                        success: function (oListItem) {
                            return this.waitFor({
                                id: /overflowToolbar-overflowButton/,
                                matchers: new Ancestor(oListItem[0]),
                                actions: new Press(),
                                errorMessage: "Overflow button on item " + itemNumber + " not found"
                            });
                        },
                        errorMessage: "List item " + itemNumber + " not found"
                    });
                },
                iPressTheOverflowButtonInGroup: function (groupNumber, itemNumber) {
                    return this.waitFor({
                        controlType: "sap.m.NotificationList",
                        matchers: function (oList) {
                            return oList.getItems()[groupNumber].getItems()[itemNumber];
                        },
                        success: function (oListItem) {
                            return this.waitFor({
                                controlType: "sap.m.Button",
                                matchers: new Ancestor(oListItem[0]),
                                actions: new Press(),
                                errorMessage: "Overflow button on item " + itemNumber + " not found"
                            });
                        },
                        errorMessage: "List item " + itemNumber + " not found"
                    });
                },
                iPressTheOverflowButtonOnGroup: function (groupNumber) {
                    return this.waitFor({
                        controlType: "sap.m.NotificationList",
                        matchers: function (oList) {
                            return oList.getItems()[groupNumber];
                        },
                        success: function (oListItem) {
                            return this.waitFor({
                                controlType: "sap.m.ToggleButton",
                                matchers: (oToggleButton) => {
                                    if (oToggleButton.getParent().getParent() !== oListItem[0]) {
                                        return false;
                                    }
                                    oToggleButton.focus();

                                    return oToggleButton;
                                },
                                actions: new Press(),
                                errorMessage: "Overflow toggle button on group " + groupNumber + " not found"
                            });
                        },
                        errorMessage: "Notification group " + groupNumber + " not found"
                    });
                },
                iPressTheItemButton: function (itemNumber, buttonNumber) {
                    buttonNumber = buttonNumber || 0; // Accept - 0. Reject - 1
                    return this.waitFor({
                        controlType: "sap.m.NotificationList",
                        matchers: function (oList) {
                            var oItem = oList.getItems()[itemNumber];
                            return oItem.getButtons()[buttonNumber];
                        },
                        actions: new Press(),
                        errorMessage: "Button " + buttonNumber + " on item " + itemNumber + " not found"
                    });
                },
                iPressTheItemButtonInGroup: function (groupNumber, itemNumber, buttonNumber) {
                    buttonNumber = buttonNumber || 0; // Accept - 0. Reject - 1
                    return this.waitFor({
                        controlType: "sap.m.NotificationList",
                        matchers: function (oList) {
                            return oList.getItems()[groupNumber].getItems()[itemNumber].getButtons()[buttonNumber];
                        },
                        success: function (aButtons) {
                            aButtons[0].firePress();
                        },
                        errorMessage: "List item " + itemNumber + " not found"
                    });
                },
                iSelectTab: function (tabNumber) {
                    return this.waitFor({
                        id: "notificationsView--notificationIconTabBar",
                        actions: function (oIconTabBar) {
                            var oItem = oIconTabBar.getItems()[tabNumber];
                            oItem.focus();
                            oIconTabBar.setSelectedItem(oItem);
                        }
                    });
                },
                iExpandTheNotificationGroup: function (itemNumber) {
                    return this.waitFor({
                        id: /sapUshellNotificationsListType/,
                        controlType: "sap.m.NotificationList",
                        matchers: function (oList) {
                            return oList.getItems()[itemNumber];
                        },
                        success: function (oListItem) {
                            return this.waitFor({
                                id: /collapseButton/,
                                controlType: "sap.m.Button",
                                matchers: new Ancestor(oListItem[0]),
                                actions: new Press(),
                                errorMessage: "No collapsed button to press."
                            });
                        },
                        errorMessage: "sap.m.NotificationList with id sapUshellNotificationsListType was not found."
                    });
                },
                iCheckIfIHaveToReopenTheNotificationPopover: function () {
                    return this.waitFor({
                        matchers: function () {
                            return document.getElementById("shellNotificationsPopover");
                        },
                        success: function (oPopover) {
                            var bIsClosed = !jQuery(oPopover).is(":visible");
                            if (bIsClosed) {
                                return this.waitFor({
                                    id: "NotificationsCountButton",
                                    actions: new Press(),
                                    errorMessage: "Notifications button is not available"
                                });
                            }
                        },
                        errorMessage: "Notification Popover was not found"
                    });
                }
            },
            assertions: {
                iShouldSeeThePopover: function () {
                    return this.waitFor({
                        id: "shellNotificationsPopover",
                        success: function (oPopover) {
                            Opa5.assert.strictEqual(oPopover.isOpen(), true, "The popover is opened");
                        },
                        errorMessage: "Notifications popover is not found"
                    });
                },
                iShouldNotSeeThePopover: function (bOpen) {
                    return this.waitFor({
                        success: function () {
                            var oPopover = Element.getElementById("shellNotificationsPopover");
                            Opa5.assert.ok(!oPopover || !oPopover.isOpen(), "The popover is not visible");
                        }
                    });
                },
                iShouldSeeTheCount: function (count) {
                    return this.waitFor({
                        id: "NotificationsCountButton",
                        matchers: function (oButton) {
                            var sCount = oButton.$().attr("data-counter-content");
                            return count ? sCount === count + "" : !sCount;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The notifications count badge is correctly set");
                        },
                        errorMessage: "Notifications count is not set"
                    });
                },
                iShouldSeeNotifications: function (count) {
                    return this.waitFor({
                        id: "notificationsView--notificationIconTabBar",
                        success: function (oIconTabBar) {
                            var sKey = oIconTabBar.getSelectedKey();
                            var oTab;
                            oIconTabBar.getItems().some(function (oItem) {
                                if (oItem.getKey() === sKey) {
                                    oTab = oItem;
                                    return true;
                                }
                                return false;
                            });
                            var oList = oTab.getContent()[0];
                            Opa5.assert.strictEqual(oList.getItems().length, count, "Expect notifications: " + count);
                        },
                        errorMessage: "Notifications list is not found"
                    });
                },
                iShouldSeeNotificationsInGroup: function (count) {
                    return this.waitFor({
                        controlType: "sap.m.NotificationListGroup",
                        visible: count > 0,
                        success: function (aNotificationListGroups) {
                            const iNrOfItems = aNotificationListGroups.reduce((acc, group) => {
                                return acc + group.getItems().length;
                            }, 0);
                            Opa5.assert.strictEqual(iNrOfItems, count, "Expect notifications: " + count);
                        },
                        errorMessage: "sap.m.NotificationListItems were not found."
                    });
                }
            }
        }
    });
});
