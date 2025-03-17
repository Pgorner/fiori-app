// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

// Provides control sap.ushell.ui.launchpad.ActionItem.
sap.ui.define([
    "sap/m/Button",
    "sap/m/ButtonRenderer", // will load the renderer async
    "sap/m/library"
], function (
    Button,
    ButtonRenderer,
    mobileLibrary
) {
    "use strict";

    // shortcut for sap.m.ButtonType
    var ButtonType = mobileLibrary.ButtonType;

    /**
     * @alias sap.ushell.ui.launchpad.ActionItem
     * @class
     * @classdesc Constructor for a new ui/launchpad/ActionItem.
     *
     * @param {string} [sId] id for the new control, generated automatically if no id is given
     * @param {object} [mSettings] initial settings for the new control
     *
     * @extends sap.m.Button
     *
     * @public
     */
    var ActionItem = Button.extend("sap.ushell.ui.launchpad.ActionItem", /** @lends sap.ushell.ui.launchpad.ActionItem.prototype */ {
        metadata: {
            library: "sap.ushell",
            properties: {
                // type of button to create
                actionType: { type: "string", group: "Appearance", defaultValue: "standard" }
            },
            events: {
                press: {},
                afterRendering: {}
            }
        },
        renderer: ButtonRenderer
    });

    ActionItem.prototype.setActionType = function (sType) {
        if (!this.sOrigType) {
            this.sOrigType = this.getType();
        }
        this.setType(sType === "action" ? ButtonType.Unstyled : this.sOrigType || ButtonType.Standard);
        this.setProperty("actionType", sType, true);
    };

    return ActionItem;
});
