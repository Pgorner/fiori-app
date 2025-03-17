// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/core/mvc/View"
], function (UIComponent, View) {
    "use strict";

    return UIComponent.extend("sap.ushell.demotiles.cdm.customtile.Component", {
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
            // For better testing of the core-ext-light load logic
            // some dependencies from it are required here.
            // The core-ext-light should always be loaded before this file,
            // so in the network trace you should not see request for the files below.
            //
            // Note: during local development with the flp_proxy
            // this has the effect, that those files are always loaded
            // independent if core-ext-light was already loaded or not.
            // This is because core-ext-light is empty locally so that
            // local resources are not "hidden" by it.
            sap.ui.require([
                "sap/m/Table",
                "sap/m/TimePicker",
                "sap/m/Tree"
            ], function () {
                console.log("modules from core-ext-light.js have been loaded");
            });

            return View.create({
                viewName: "module:sap/ushell/demotiles/cdm/customtile/DynamicTile.view"
            })
                .then(function (oView) {
                    this._controller = oView.getController();
                    return oView;
                }.bind(this));
        }
    });
});
