// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview example of a static tile for demo purposes
 *
 * @deprecated since 1.108
 * @version 1.132.1
 */
sap.ui.define([
    "sap/ui/core/mvc/JSView",
    "sap/ushell/ui/tile/StaticTile"
], function (JSView, StaticTile) {
    "use strict";

    sap.ui.jsview("sap.ushell.demo.demoTiles.TestViewTile", { // LEGACY API (deprecated)
        createContent: function (oController) {
            this.setDisplayBlock(true);
            var oViewData = this.getViewData && this.getViewData();
            var oTile = new StaticTile(oViewData.properties);
            oController._handleTilePress(oTile);

            return oTile;
        },

        getControllerName: function () {
            return "sap.ushell.demo.demoTiles.TestViewTile";
        }
    });
});
