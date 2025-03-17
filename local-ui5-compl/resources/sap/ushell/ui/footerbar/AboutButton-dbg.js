// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

// Provides control sap.ushell.ui.footerbar.AboutButton.
sap.ui.define([
    "sap/m/ButtonRenderer", // will load the renderer async
    "sap/ushell/resources",
    "sap/ushell/ui/launchpad/ActionItem",
    "sap/ui/core/Fragment",
    "sap/ushell/ui/footerbar/AboutDialog.controller"
], function (
    ButtonRenderer,
    resources,
    ActionItem,
    Fragment,
    AboutDialogController
) {
    "use strict";

    /**
     * @alias sap.ushell.ui.footerbar.AboutButton
     * @class
     * @classdesc Constructor for a new ui/footerbar/AboutButton.
     * Add your documentation for the new ui/footerbar/AboutButton
     * @param {string} [sId] id for the new control, generated automatically if no id is given
     * @param {object} [mSettings] initial settings for the new control
     *
     * @extends sap.ushell.ui.launchpad.ActionItem
     *
     * @since 1.16.0
     * @private
     */
    var AboutButton = ActionItem.extend("sap.ushell.ui.footerbar.AboutButton", /** @lends sap.ushell.ui.footerbar.AboutButton.prototype */ {
        metadata: { library: "sap.ushell" },
        renderer: ButtonRenderer
    });

    AboutButton.prototype.init = function () {
        // call the parent sap.ushell.ui.launchpad.ActionItem init method
        if (ActionItem.prototype.init) {
            ActionItem.prototype.init.apply(this, arguments);
        }
        this.setIcon("sap-icon://hint");
        this.setText(resources.i18n.getText("about"));
        this.attachPress(this.showAboutDialog);
    };

    AboutButton.prototype.showAboutDialog = function () {
        return new Promise((resolve, reject) => {
            Fragment.load({
                id: "aboutDialogFragment",
                name: "sap.ushell.ui.footerbar.AboutDialog",
                type: "XML",
                controller: new AboutDialogController()
            }).then(function (dialog) {
                dialog.setModel(resources.getTranslationModel(), "i18n");
                dialog.open();
                resolve();
            }).catch(reject);
        });
    };

    return AboutButton;
});
