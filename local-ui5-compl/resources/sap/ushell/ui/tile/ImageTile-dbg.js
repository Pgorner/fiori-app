// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

// Provides control sap.ushell.ui.tile.ImageTile.
sap.ui.define([
    "sap/ushell/library",
    "./TileBase",
    "./ImageTileRenderer"
], function (
    library,
    TileBase,
    ImageTileRenderer
) {
    "use strict";

    /**
     * @alias sap.ushell.ui.tile.ImageTile
     * @class
     * @classdesc Constructor for a new ui/tile/ImageTile.
     * Add your documentation for the newui/tile/ImageTile
     *
     * @param {string} [sId] id for the new control, generated automatically if no id is given
     * @param {object} [mSettings] initial settings for the new control
     *
     * @extends sap.ushell.ui.tile.TileBase
     *
     * @private
     */
    var ImageTile = TileBase.extend("sap.ushell.ui.tile.ImageTile", /** @lends sap.ushell.ui.tile.ImageTile.prototype */ {
        metadata: {
            library: "sap.ushell",
            properties: {
                /**
                 * the URL of the image to display
                 */
                imageSource: {type: "string", group: "Appearance", defaultValue: null}
            }
        },
        renderer: ImageTileRenderer
    });

    return ImageTile;

});
