// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileoverview Provides control "sap.ushell.ui.launchpad.TileState"
 * Note: Link counterpart "sap.ushell.ui.launchpad.LinkTileWrapper"
 * @see sap.ushell.ui.launchpad.LinkTileWrapper
 * @deprecated since 1.120
 */
sap.ui.define([
    "sap/ushell/ui/launchpad/TileStateInternal",
    "./TileStateRenderer"
], function (
    TileStateInternal,
    TileStateRenderer
) {
    "use strict";

    /**
     * @alias sap.ushell.ui.launchpad.TileState
     * @class
     * @classdesc Constructor for a new ui/launchpad/TileState.
     * The tile state control that displays loading indicator,
     * while tile view is loading and failed status in case tile view is not available.
     *
     * @param {string} [sId] id for the new control, generated automatically if no id is given
     * @param {object} [mSettings] initial settings for the new control
     *
     * @extends sap.ui.core.Control
     *
     * @public
     * @deprecated since 1.120
     */
    var TileState = TileStateInternal.extend("sap.ushell.ui.launchpad.TileState", /** @lends sap.ushell.ui.launchpad.TileState.prototype */ {
        metadata: {
            library: "sap.ushell",
            properties: {
                // load state
                state: { type: "string", group: "Misc", defaultValue: "Loaded" }
            },
            events: {
                press: {}
            }
        },
        renderer: TileStateRenderer
    });

    return TileState;
});
