// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/library",
    "sap/ui/core/Element",
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/api/NewExperience",
    "sap/ushell/components/applicationIntegration/AppLifeCycle",
    "sap/ushell/Config",
    "sap/ushell/EventHub",
    "sap/ushell/library",
    "sap/ushell/ui/shell/OverflowListItem",
    "sap/ushell/Container",
    "sap/ushell/state/ShellModel",
    "sap/ushell/state/StateManager"
], function (
    mobileLibrary,
    Element,
    Controller,
    Device,
    JsonModel,
    NewExperience,
    AppLifeCycle,
    Config,
    EventHub,
    ushellLibrary,
    OverflowListItem,
    Container,
    ShellModel,
    StateManager
) {
    "use strict";

    // shortcut for sap.m.ListType
    const ListType = mobileLibrary.ListType;

    // shortcut for sap.ushell.FloatingNumberType
    const FloatingNumberType = ushellLibrary.FloatingNumberType;

    // shortcut for sap.ushell.state.StateManager.LaunchpadState
    const LaunchpadState = StateManager.LaunchpadState;

    // shortcut for sap.ushell.state.StateManager.Operation
    const Operation = StateManager.Operation;

    const sOverflowBtnId = "endItemsOverflowBtn";

    return Controller.extend("sap.ushell.renderer.shellHeader.ShellHeader", {

        onInit: function () {
            this.aDoables = [];
            this.aDoables.push(EventHub.on("navigateBack").do(this.pressNavBackButton.bind(this)));
            this.aDoables.push(EventHub.on("showEndItemOverflow").do(this.pressEndItemsOverflow.bind(this)));
            this.aDoables.push(EventHub.on("navigateFromShellApplicationNavigationMenu").do(this.navigateFromShellApplicationNavigationMenu.bind(this)));
            this.aDoables.push(EventHub.on("setHeaderCentralAreaElement").do(this._handleSetHeaderCentralAreaElement.bind(this)));

            this.aDoables.push(Config.on("/core/shellHeader/homeUri").do(this._updateHomeUri.bind(this)));
            this._updateHomeUri(Config.last("/core/shellHeader/homeUri"));

            // HeadEndItem Overflow
            this.aDoables.push(EventHub.on("updateHeaderOverflowState").do(this._handleHeadEndItemsOverflow.bind(this)));
            Device.media.attachHandler(this._handleHeadEndItemsOverflow, this, Device.media.RANGESETS.SAP_STANDARD);
            // Overflow must be checked each time when a button is added to the header.
            this.oHeadEndBinding = ShellModel.getModel().bindList("/header/headEndItems");
            this.oHeadEndBinding.attachChange(this._handleHeadEndItemsOverflow, this);

            NewExperience.attachActiveChanged(this._handleHeadEndItemsOverflow, this);
        },

        _handleSetHeaderCentralAreaElement: function (oParameters) {
            const { id, currentState, states } = oParameters;

            if (currentState) {
                StateManager.updateCurrentState("header.centralAreaElement", Operation.Set, id);
            } else if (Array.isArray(states)) {
                StateManager.updateBaseStates(states, "header.centralAreaElement", Operation.Set, id);
            } else {
                // all base states
                StateManager.updateAllBaseStates("header.centralAreaElement", Operation.Set, id);
            }
        },

        _addHeadEndItem: function (sId, bCurrentState, aStates) {
            this._updateHeadEndItems(sId, Operation.Add, bCurrentState, aStates);
        },

        _removeHeadEndItem: function (sId, bCurrentState, aStates) {
            this._updateHeadEndItems(sId, Operation.Remove, bCurrentState, aStates);
        },

        _updateHeadEndItems: function (sId, sOperation, bCurrentState, aStates) {
            if (bCurrentState) {
                StateManager.updateCurrentState("header.headEndItems", sOperation, sId);
            } else if (Array.isArray(aStates) && aStates.length > 0) {
                StateManager.updateBaseStates(aStates, "header.headEndItems", sOperation, sId);
            } else {
                // all base states
                StateManager.updateAllBaseStates("header.headEndItems", sOperation, sId);
            }
        },

        /**
         * Logic to determine if the headEndItemsOverflow button should be visible.
         * Overflow button is shown only when CurrentRangeName is "Phone".
         */
        _handleHeadEndItemsOverflow: function () {
            const aHeaderEndItems = ShellModel.getModel().getProperty("/header/headEndItems");
            var bIsOverflowVisible = aHeaderEndItems.indexOf(sOverflowBtnId) > -1;
            var sDeviceType = Device.media.getCurrentRange(Device.media.RANGESETS.SAP_STANDARD).name;

            if (sDeviceType === "Phone" && (NewExperience.isActive() || (!bIsOverflowVisible && aHeaderEndItems.length > 2))) {
                // Show overflow if more than two buttons are in the header
                // and show overflow always in case of New Experience
                this._addHeadEndItem(sOverflowBtnId, false, [LaunchpadState.Home, LaunchpadState.App]);

                this._moveNewExperienceToOverflow();

            } else if (sDeviceType !== "Phone" && bIsOverflowVisible) {
                // Destroy the popover to avoid duplicate elements ids in the DOM
                // and to ensure the endItems are rendered correctly in the header
                var oPopover = Element.getElementById("headEndItemsOverflow");
                if (oPopover) {
                    if (NewExperience.isActive()) {
                        const oItem = NewExperience.getOverflowItemControl();
                        // try to remove the item from the parent
                        // because we want to reuse the control in the next call
                        oItem.getParent()?.removeItem?.(oItem);
                    }
                    oPopover.destroy();
                }
                this._removeHeadEndItem(sOverflowBtnId, false, [LaunchpadState.Home, LaunchpadState.App]);

                this._moveNewExperienceToShellHeader();
            }
        },

        /**
         * Moves the new experience button into the overflow area.
         *
         * @since 1.127.0
         * @private
         */
        _moveNewExperienceToOverflow: function () {
            if (NewExperience.isActive()) {
                this._addHeadEndItem(NewExperience.getOverflowItemId(), false, [LaunchpadState.Home, LaunchpadState.App]);
            }
            NewExperience.showInOverflow();
        },

        /**
         * Moves the new experience button into the shell header.
         *
         * @since 1.127.0
         * @private
         */
        _moveNewExperienceToShellHeader: function () {
            if (NewExperience.isActive()) {
                this._removeHeadEndItem(NewExperience.getOverflowItemId(), false, [LaunchpadState.Home, LaunchpadState.App]);
            }
            NewExperience.showInShellHeader();
        },

        _updateHomeUri: function (sHomeUri) {
            var oShellHeader = Element.getElementById("shell-header");
            if (oShellHeader) {
                oShellHeader.setHomeUri(sHomeUri);
            }
        },

        pressNavBackButton: function () {
            // set meAria as closed when navigating back
            EventHub.emit("showUserActionsMenu", false);
            AppLifeCycle.service().navigateBack();
        },

        /**
         * In case the endItemsOverflowButtons was pressed we need to show all overflow items in the action sheet.
         * @param {string} sSourceId the id of the source control
         */
        pressEndItemsOverflow: function (sSourceId) {
            var oPopover = Element.getElementById("headEndItemsOverflow"),
                oSource = Element.getElementById(sSourceId),
                oLoadPopover = Promise.resolve(),
                oModel;

            if (!oSource) {
                return;
            }

            if (!oPopover) {
                oLoadPopover = new Promise(function (resolve, reject) {
                    sap.ui.require(["sap/ui/core/Fragment"], function (Fragment) {
                        Fragment.load({
                            name: "sap.ushell.renderer.HeadEndItemsOverflowPopover",
                            type: "XML",
                            controller: this
                        }).then(resolve).catch(reject);
                    }.bind(this), reject);
                }.bind(this)).then(function (popover) {
                    oPopover = popover;
                    var oPopoverList = Element.getElementById("headEndItemsOverflowList");
                    oPopoverList.enhanceAccessibilityState = function (oOverflowListItem, mAriaProps) {
                        if (!oOverflowListItem.isA("sap.ushell.ui.shell.OverflowListItem")) {
                            return mAriaProps;
                        }

                        if (oOverflowListItem.getFloatingNumberType() !== FloatingNumberType.None) {
                            mAriaProps.describedby = oOverflowListItem._oAriaDescribedbyText.getId();
                        }
                        return mAriaProps;
                    };
                    oModel = new JsonModel({
                        headEndItems: ShellModel.getModel().getProperty("/header/headEndItems")
                    });
                    oPopover.setModel(oModel);
                });
            }

            oLoadPopover.then(function () {
                if (oPopover.isOpen()) {
                    oPopover.close();
                } else {
                    // Check for the notifications popover and close it if necessary.
                    // Note that this check needs to be performed to avoid an error in case the notifications
                    // encounter issues during init which will be triggered by this event if it didn't happen already.
                    // This error should not be displayed upon openening the endItemsOverflow
                    if (Element.getElementById("shellNotificationsPopover")) {
                        EventHub.emit("showNotifications", false); // Close the Notifications popover, if opened
                    }
                    oPopover.openBy(oSource);
                }
            });
        },

        headEndItemsOverflowItemFactory: function (sId, oContext) {
            if (NewExperience.isActive() && oContext.getObject() === NewExperience.getOverflowItemId()) {
                return NewExperience.getOverflowItemControl();
            }

            var oShellHeadItem = Element.getElementById(oContext.getObject());

            var sFloatingNumberBindingPath = oShellHeadItem.getBindingPath("floatingNumber");
            var sText = oShellHeadItem.getText();
            var sTooltip = oShellHeadItem.getTooltip();
            var oOverflowListItem = new OverflowListItem({
                id: sId + "-" + oShellHeadItem.getId(),
                icon: oShellHeadItem.getIcon(),
                iconInset: true,
                tooltip: sTooltip !== sText ? sTooltip : null,
                title: sText,
                type: ListType.Active,
                floatingNumber: (sFloatingNumberBindingPath ? { path: sFloatingNumberBindingPath } : undefined),
                floatingNumberMaxValue: oShellHeadItem.getFloatingNumberMaxValue(),
                floatingNumberType: oShellHeadItem.getFloatingNumberType(),
                visible: oShellHeadItem.getVisible(),
                press: function () {
                    if (oShellHeadItem) {
                        oShellHeadItem.firePress();

                        var sTarget = oShellHeadItem.getTarget();
                        if (sTarget) {
                            Container.getServiceAsync("Navigation").then(function (oNavService) {
                                oNavService.navigate({ target: { shellHash: sTarget } });
                            });
                        }
                    }

                    var oPopover = Element.getElementById("headEndItemsOverflow");
                    if (oPopover.isOpen()) {
                        oPopover.close();
                    }
                }
            });
            // Add aria label for the New Dsign list item
            if (oShellHeadItem._oAriaLabel) {
                oOverflowListItem.addAriaLabelledBy(oShellHeadItem._oAriaLabel);
            }
            if (sFloatingNumberBindingPath) {
                oOverflowListItem.setModel(oShellHeadItem.getModel());
            }
            return oOverflowListItem;
        },

        destroyHeadEndItemsOverflow: function (oEvent) {
            if (NewExperience.isActive()) {
                const oItem = NewExperience.getOverflowItemControl();
                // try to remove the item from the parent
                // because we want to reuse the control in the next call
                oItem.getParent()?.removeItem?.(oItem);
            }
            oEvent.getSource().destroy();
        },

        /**
         * return true for buttons that should go in the overflow and not in the header
         * @param {string} sButtonNameInUpperCase button name
         * @returns {boolean} isHeadEndItemInOverflow
         */
        isHeadEndItemInOverflow: function (sButtonNameInUpperCase) {
            return sButtonNameInUpperCase !== "ENDITEMSOVERFLOWBTN" && !this.isHeadEndItemNotInOverflow(sButtonNameInUpperCase);
        },

        /**
         * return true for buttons that should be in the header and not in overflow
         * In case overflow mode is on @see isHeadEndItemOverflow only the
         * NotificationsCountButton and the endItemsOverflowButtons should be in the header
         * In case overflow mode is off, all buttons except endItemsOverflowButtons should be in the header.
         * In case of Fiori 3, all buttons should go into the overflow except the userActionsMenuHeaderButton.
         *
         * @param {string} sButtonNameInUpperCase button name
         * @returns {boolean} isHeadEndItemNotInOverflow
         */
        isHeadEndItemNotInOverflow: function (sButtonNameInUpperCase) {
            var bOverflowVisible = this.isHeadEndItemOverflow();
            var sSizeType = Device.media.getCurrentRange(Device.media.RANGESETS.SAP_STANDARD).name;

            // Overflow Button
            if (sButtonNameInUpperCase === "ENDITEMSOVERFLOWBTN") {
                return bOverflowVisible;
            }

            // No overflow: all buttons are visible
            if (!bOverflowVisible) {
                return true;
            }

            // Fiori 3 specific:
            if (["USERACTIONSMENUHEADERBUTTON", "BACKBTN"].indexOf(sButtonNameInUpperCase) > -1) {
                return true;
            }

            // No more buttons on the phone
            if (sSizeType === "Phone") {
                return false;
            }

            // Tablet and desktop, show Search and FloatingContainer buttons
            if (["SF", "FLOATINGCONTAINERBUTTON"].indexOf(sButtonNameInUpperCase) > -1) {
                return true;
            }

            if (sSizeType === "Desktop" && sButtonNameInUpperCase === "COPILOTBTN") {
                return true;
            }

            return false;
        },

        /**
         * returns true if we are in overflow mode
         * we enter the overflow mode in case:
         *  - userActionsMenu is on
         *  - current width of the screen is not desktop (as received from the sap.ui.Device.media
         *  - we have 3 buttons in the header (excluding the endItemsOverflowBtn)
         * @returns {boolean} result
         */
        isHeadEndItemOverflow: function () {
            var nNumberOfVisibleElements = 0,
                oElement,
                aEndItems = ShellModel.getModel().getProperty("/header/headEndItems");

            if (aEndItems.indexOf("endItemsOverflowBtn") === -1) {
                return false;
            }

            var currentMediaType = Device.media.getCurrentRange(Device.media.RANGESETS.SAP_STANDARD).name;
            var numAllowedBtn = 3;
            if (currentMediaType === "Phone") {
                numAllowedBtn = 1;
            }

            // calculate number nNumberOfVisibleElements
            for (var i = 0; i < aEndItems.length; i++) {
                oElement = Element.getElementById(aEndItems[i]);
                if (oElement && oElement.getVisible()) {
                    nNumberOfVisibleElements++;
                }
            }

            if (Element.getElementById("endItemsOverflowBtn").getVisible()) {
                return nNumberOfVisibleElements > numAllowedBtn + 1;
            }

            return nNumberOfVisibleElements > numAllowedBtn;
        },

        /**
         * method used for navigation from items of the Shell-Application-Navigation-Menu.
         * this method makes sure the view-port is centered before triggering navigation
         * (as the notifications or me-area might be open, and in addition
         * fire an event to closes the popover which opens the navigation menu
         */
        navigateFromShellApplicationNavigationMenu: function (sIntent) {
            //if the target was not change, do nothing
            if (window.hasher.getHash() !== sIntent.substr(1)) {
                // we must make sure the view-port is centered before triggering navigation from shell-app-nav-menu
                EventHub.emit("centerViewPort", Date.now());

                // trigger the navigation
                window.hasher.setHash(sIntent);
            }

            // close the popover which holds the navigation menu
            var oShellAppTitle = Element.getElementById("shellAppTitle");
            if (oShellAppTitle) {
                oShellAppTitle.close();
            }
        },

        onExit: function () {
            this.aDoables.forEach(function (oDoable) {
                oDoable.off();
            });
            this.oHeadEndBinding.destroy();
            NewExperience.detachActiveChanged(this._handleHeadEndItemsOverflow, this);
        }
    });
});
