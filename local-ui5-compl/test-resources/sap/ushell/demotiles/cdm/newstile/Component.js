// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/core/mvc/View"
], function (UIComponent, View) {
    "use strict";

    // ===========================================================================================
    //       This demo tile is only used for test content and shall not be used productively!
    // ===========================================================================================
    // The demo version does only support a limited set of features in comparison to the original news tile

    return UIComponent.extend("sap.ushell.demotiles.cdm.newstile.Component", {
        metadata: {
            manifest: "json"
        },

        // new API (optional)
        tileSetVisible: function (bNewVisibility) {
            // forward to controller
            // not implemented
            //this._controller.visibleHandler(bNewVisibility);
        },

        // new API (optional)
        tileRefresh: function () {
            // forward to controller
            // not implemented
            // this._controller.refresh();
        },

        // new API (mandatory)
        tileSetVisualProperties: function (oNewVisualProperties) {
            // forward to controller
            // NOP: visual properties are not displayed on the tile
        }
    });
});
