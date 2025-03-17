// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

// Provides control sap.ushell.ui.launchpad.PlusTile.
sap.ui.define([
    "sap/ui/core/Icon",
    "sap/ushell/library", // css style dependency
    "sap/ushell/resources",
    "sap/ushell/ui/launchpad/PlusTileRenderer",
    "sap/ushell/ui/launchpad/Tile"
], function (
    Icon,
    ushellLibrary,
    resources,
    PlusTileRenderer,
    Tile
) {
    "use strict";

    /**
     * @alias sap.ushell.ui.launchpad.PlusTile
     * @class
     * @classdesc Constructor for a new ui/launchpad/PlusTile.
     * A specialized tile showing a plus icon.
     *
     * @param {string} [sId] id for the new control, generated automatically if no id is given
     * @param {object} [mSettings] initial settings for the new control
     *
     * @extends sap.ushell.ui.launchpad.Tile
     *
     * @private
     */
    var PlusTile = Tile.extend("sap.ushell.ui.launchpad.PlusTile", /** @lends sap.ushell.ui.launchpad.PlusTile.prototype */ {
        metadata: {
            library: "sap.ushell",
            properties: {
                /**
                 */
                groupId: { type: "string", group: "Misc", defaultValue: "" },

                /**
                 */
                enableHelp: { type: "boolean", group: "Misc", defaultValue: false }
            },
            events: {
                /**
                 * Fired when user clicks on the tile
                 */
                press: {}
            }
        },
        renderer: PlusTileRenderer
    });

    PlusTile.prototype.init = function () {
        this.oIcon = new Icon({
            src: "sap-icon://add",
            tooltip: resources.i18n.getText("openAppFinder_tooltip")
        });
    };

    PlusTile.prototype.exit = function () {
        if (this.oIcon) {
            this.oIcon.destroy();
        }
    };

    PlusTile.prototype.onclick = function () {
        var groupModelObject = this.getParent().getBindingContext().getObject();
        if (!groupModelObject.object) {
            //if group is not yet created on the sever side, we can't add tiles to it
            return;
        }

        this.firePress();
    };

    PlusTile.prototype.onsapspace = PlusTile.onclick;
    PlusTile.prototype.onsapenter = PlusTile.onclick;

    return PlusTile;
});
