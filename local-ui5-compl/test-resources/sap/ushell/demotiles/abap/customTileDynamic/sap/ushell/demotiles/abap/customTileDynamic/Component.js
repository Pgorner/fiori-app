// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/View",
    "sap/ui/core/mvc/ViewType",
    "sap/ui/core/UIComponent"
], function (
    View,
    ViewType,
    UIComponent
) {
    "use strict";

    return UIComponent.extend("sap.ushell.demotiles.abap.customTileDynamic.Component", {
        metadata: {
            manifest: "json",
            interfaces: ["sap.ui.core.IAsyncContentCreation"]
        },

        // new API
        tileSetVisible: function (bNewVisibility) {
            // forward to controller
            this._controller.visibleHandler(bNewVisibility);
        },

        // new API
        tileRefresh: function () {
            // forward to controller
            this._controller.refreshHandler(this._controller);
        },

        // new API
        tileSetVisualProperties: function (oNewVisualProperties) {
            // forward to controller
            this._controller.setVisualPropertiesHandler(oNewVisualProperties);
        },

        createContent: function () {
            return View.create({
                viewName: "sap.ushell.demotiles.abap.customTileDynamic.DynamicTile",
                type: ViewType.JS
            }).then(function (oTile) {
                this._controller = oTile.getController();
            }.bind(this));
        }
    });
});
