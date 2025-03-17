// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview Provides control sap.ushell.ui.tile.StaticTile.
 * @deprecated since 1.120
 */
sap.ui.define([
    "sap/ushell/library",
    "sap/ushell/ui/tile/TileBase",
    "sap/ushell/ui/tile/StaticTileRenderer"
], function (
    ushellLibrary,
    TileBase,
    StaticTileRenderer
) {
    "use strict";

    /**
     * @alias sap.ushell.ui.tile.StaticTile
     * @class
     * @classdesc Constructor for a new ui/tile/StaticTile.
     * An applauncher tile for simple, static apps, displaying title, subtitle, an icon and additional information
     *
     * @param {string} [sId] id for the new control, generated automatically if no id is given
     * @param {object} [mSettings] initial settings for the new control
     *
     * @extends sap.ushell.ui.tile.TileBase
     *
     * @since 1.15.0
     * @public
     * @deprecated since 1.120
     */
    var StaticTile = TileBase.extend("sap.ushell.ui.tile.StaticTile", /** @lends sap.ushell.ui.tile.StaticTile.prototype */ {
        metadata: {
            library: "sap.ushell"
        },
        renderer: StaticTileRenderer
    });

    return StaticTile;
});
