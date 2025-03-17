// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/core/mvc/View",
    "sap/ui/core/mvc/ViewType",
    "sap/ui/core/UIComponent"
], function (View, ViewType, UIComponent) {
    "use strict";

    // The tile view could be specified directly in the CHIP. However, by using a component
    // the tile can be loaded as component preload bundle instead of single files for
    // for view, controller and additional files that might be needed
    return UIComponent.extend("sap.ushell.demotiles.abap.customDemoTile.Component", {
        metadata: {
            manifest: "json",
            interfaces: ["sap.ui.core.IAsyncContentCreation"]
        },

        // the root view could be specified in the manifest but as the component data needs
        // be forwarded to the view the createContent method has to be implemented
        createContent: function () {
            return View.create({
                viewName: "sap.ushell.demotiles.abap.customDemoTile.CustomDemoTile",
                type: ViewType.XML,
                // the CHIP API is passed via the component data and has to be forwarded
                // to the view if it should be accessed in the tile
                viewData: this.getComponentData()
            });
        }
    });
});
