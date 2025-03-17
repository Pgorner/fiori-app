// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

// Provides control sap.ushell.ui.footerbar.LogoutButton.
sap.ui.define([
    "sap/base/Log",
    // will load the renderer async
    "sap/m/ButtonRenderer",
    "sap/m/MessageBox",
    "sap/ui/core/ElementMetadata",
    "sap/ushell/resources",
    "sap/ushell/ui/launchpad/ActionItem",
    "sap/ushell/ui/launchpad/LoadingDialog",
    "sap/ushell/Container"
], function (
    Log,
    ButtonRenderer,
    MessageBox,
    ElementMetadata,
    resources,
    ActionItem,
    LoadingDialog,
    Container
) {
    "use strict";

    // shortcut for sap.m.MessageBox.Action
    var Action = MessageBox.Action;

    // shortcut for sap.m.MessageBox.Icon
    var Icon = MessageBox.Icon;

    /**
     * @alias sap.ushell.ui.footerbar.LogoutButton
     * @class
     * @classdesc Constructor for a new ui/footerbar/LogoutButton.
     * A logout button for the UShell footerbar.
     *
     * @param {string} [sId] id for the new control, generated automatically if no id is given
     * @param {object} [mSettings] initial settings for the new control
     *
     * @extends sap.ushell.ui.launchpad.ActionItem
     *
     * @since 1.16.0
     * @private
     */
    var LogoutButton = ActionItem.extend("sap.ushell.ui.footerbar.LogoutButton", /** @lends sap.ushell.ui.footerbar.LogoutButton.prototype */ {
        metadata: { library: "sap.ushell" },
        renderer: ButtonRenderer
    });

    LogoutButton.prototype.init = function () {
        // call the parent sap.ushell.ui.launchpad.ActionItem init method
        if (ActionItem.prototype.init) {
            ActionItem.prototype.init.apply(this, arguments);
        }
        this.setIcon("sap-icon://log");
        this.setTooltip(resources.i18n.getText("signoutBtn_tooltip"));
        this.setText(resources.i18n.getText("signoutBtn_title"));
        this.attachPress(this.logout);
        this.setEnabled(); // disables button if shell not initialized
    };

    LogoutButton.prototype.logout = function () {
        var bShowLoadingScreen = true,
            bIsLoadingScreenShown = false,
            oLoading = new LoadingDialog({ text: "" });

        Container.getGlobalDirty().done(function (dirtyState) {
            bShowLoadingScreen = false;
            if (bIsLoadingScreenShown === true) {
                oLoading.exit();
                oLoading = new LoadingDialog({ text: "" });
            }

            var oResourceBundle = resources.i18n,
                oLogoutDetails;

            if (dirtyState === Container.DirtyState.DIRTY) {
                // show warning only if it is sure that there are unsaved changes
                oLogoutDetails = {
                    message: oResourceBundle.getText("unsaved_data_warning_popup_message"),
                    icon: Icon.WARNING,
                    messageTitle: oResourceBundle.getText("unsaved_data_warning_popup_title")
                };
            } else {
                // show 'normal' logout confirmation in all other cases, also if dirty state could not be determined
                oLogoutDetails = {
                    message: oResourceBundle.getText("signoutConfirmationMsg"),
                    icon: Icon.QUESTION,
                    messageTitle: oResourceBundle.getText("signoutMsgTitle")
                };
            }

            MessageBox.show(oLogoutDetails.message, oLogoutDetails.icon,
                oLogoutDetails.messageTitle, [Action.OK, Action.CANCEL],
                function (oAction) {
                    if (oAction === Action.OK) {
                        oLoading.openLoadingScreen();
                        oLoading.showAppInfo(resources.i18n.getText("beforeLogoutMsg"), null);
                        Container.logout();
                    }
                }, ElementMetadata.uid("confirm"));
        });

        if (bShowLoadingScreen === true) {
            oLoading.openLoadingScreen();
            bIsLoadingScreenShown = true;
        }
    };

    LogoutButton.prototype.setEnabled = function (bEnabled) {
        if (!Container.isInitialized()) {
            if (this.getEnabled()) {
                Log.warning(
                    "Disabling 'Logout' button: unified shell container not initialized",
                    null,
                    "sap.ushell.ui.footerbar.LogoutButton"
                );
            }
            bEnabled = false;
        }
        ActionItem.prototype.setEnabled.call(this, bEnabled);
    };
    return LogoutButton;
});
