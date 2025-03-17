// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/*************************************
 *
 * THIS COMPONENT IS ONLY NEEDED IN ORDER TO MAKE THE BUILD STEP FOR
 * ZIPPING / COMPONENT-PRELOAD BUILDING WORK!
 * LATER THE GENERATED ZIP WILL BE AUTOMATICALLY UPLOADED TO BSP REPOSITORY
 *
*************************************/

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/core/mvc/View"
], function (UIComponent, View) {
    "use strict";

    return UIComponent.extend("sap_ushell_demotiles_abap_customTileDynamic.Component", {
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
                    viewName: "module:sap/ushell/demotiles/abap/customTileDynamic/DynamicTile.view"
                }).then(function (oView) {
                    this._controller = oView.getController();
                    return oView;
                }.bind(this));
        }
    });
});
