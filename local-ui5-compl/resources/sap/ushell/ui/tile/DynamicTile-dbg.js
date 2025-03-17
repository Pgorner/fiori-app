// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

// Provides control sap.ushell.ui.tile.DynamicTile.
sap.ui.define([
    "sap/ushell/library",
    "./TileBase",
    "./DynamicTileRenderer"
], function (
    ushellLibrary,
    TileBase,
    DynamicTileRenderer
) {
    "use strict";

    // shortcut for sap.ushell.ui.tile.State
    var State = ushellLibrary.ui.tile.State;

    // shortcut for sap.ushell.ui.tile.StateArrow
    var StateArrow = ushellLibrary.ui.tile.StateArrow;

    /**
     * @alias sap.ushell.ui.tile.DynamicTile
     * @class
     * @classdesc Constructor for a new ui/tile/DynamicTile.
     * An applauncher for apps that need to display dynamically updated information
     *
     * @param {string} [sId] id for the new control, generated automatically if no id is given
     * @param {object} [mSettings] initial settings for the new control
     *
     * @extends sap.ushell.ui.tile.TileBase
     *
     * @private
     */
    var DynamicTile = TileBase.extend("sap.ushell.ui.tile.DynamicTile", /** @lends sap.ushell.ui.tile.DynamicTile.prototype */ {
        metadata: {
            library: "sap.ushell",
            properties: {
                /**
                 * a number to be formatted with numberDigits decimal digits. Can be sap.ui.core.string as well.
                 */
                numberValue: { type: "string", group: "Data", defaultValue: "0.0" },

                /**
                 * The state of the number, indicating positive or negative conditions
                 */
                numberState: { type: "sap.ushell.ui.tile.State", group: "Appearance", defaultValue: State.Neutral },

                /**
                 * The unit in which numberValue is measured
                 */
                numberUnit: { type: "string", group: "Data", defaultValue: null },

                /**
                 * the number of fractional decimal digits
                 */
                numberDigits: { type: "int", group: "Appearance", defaultValue: 0 },

                /**
                 * the state of the trend indicator
                 */
                stateArrow: { type: "sap.ushell.ui.tile.StateArrow", group: "Appearance", defaultValue: StateArrow.None },

                /**
                 * defines a scaling factor (like "%", "M" or "k") right to a scaled number
                 */
                numberFactor: { type: "string", group: "Data", defaultValue: null }
            }
        },
        renderer: DynamicTileRenderer
    });

    return DynamicTile;
});
