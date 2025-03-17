// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

// Provides control sap.ushell.ui.footerbar.ContactSupportButton.
sap.ui.define([
    "sap/m/ButtonRenderer", // will load the renderer async
    "sap/ushell/resources",
    "sap/ushell/ui/launchpad/ActionItem"
], function (
    ButtonRenderer,
    resources,
    ActionItem
) {
    "use strict";

    /**
     * @alias sap.ushell.ui.footerbar.ContactSupportButton
     * @class
     * @classdesc Constructor for a new ui/footerbar/ContactSupportButton.
     * Add your documentation for the new ui/footerbar/CreateTicketButton
     *
     * @param {string} [sId] id for the new control, generated automatically if no id is given
     * @param {object} [mSettings] initial settings for the new control
     *
     * @extends sap.ushell.ui.launchpad.ActionItem
     *
     * @since 1.16.0
     * @private
     */
    var ContactSupportButton = ActionItem.extend("sap.ushell.ui.footerbar.ContactSupportButton", /** @lends sap.ushell.ui.footerbar.ContactSupportButton.prototype */ {
        metadata: { library: "sap.ushell" },
        renderer: ButtonRenderer
    });

    ContactSupportButton.prototype.init = function () {
        // call the parent sap.ushell.ui.launchpad.ActionItem init method
        if (ActionItem.prototype.init) {
            ActionItem.prototype.init.apply(this, arguments);
        }
        this.setIcon("sap-icon://email");
        this.setText(resources.i18n.getText("contactSupportBtn"));
        this.attachPress(this.showContactSupportDialog);
    };

    ContactSupportButton.prototype.showContactSupportDialog = function () {
        return new Promise((resolve) => {
            sap.ui.require([
                "sap/ushell/ui/footerbar/ContactSupportDialog.controller",
                "sap/ui/core/Fragment"
            ], async function (Controller, Fragment) {
                const oDialog = await Fragment.load({
                    id: "contactSupportDialogFragment",
                    name: "sap.ushell.ui.footerbar.ContactSupportDialog",
                    type: "XML",
                    controller: new Controller()
                });
                oDialog.attachAfterOpen(resolve);
                oDialog.open();
            });
        });
    };

    return ContactSupportButton;
});
