// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/View",
    "sap/ui/core/UIComponent"
], function (
    View,
    UIComponent
) {
    "use strict";

    return UIComponent.extend("sap.ushell.components.tiles.applauncher", {
        metadata: {
            interfaces: ["sap.ui.core.IAsyncContentCreation"]
        },

        createContent: function () {
            var oComponentData = this.getComponentData();

            return View.create({
                viewName: "module:sap/ushell/components/tiles/applauncher/StaticTile.view",
                viewData: oComponentData
            });
        }
    });
});
