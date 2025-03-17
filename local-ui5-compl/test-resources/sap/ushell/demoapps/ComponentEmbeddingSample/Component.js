// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/View",
    "sap/ui/core/UIComponent",
    "./Main.controller"
], function (View, UIComponent) {
    "use strict";

    return UIComponent.extend("sap.ushell.demo.ComponentEmbeddingSample.Component", {
        metadata: {
            manifest: "json",
            interfaces: ["sap.ui.core.IAsyncContentCreation"]
        },

        createContent: function () {
            var oComponentData = this.getComponentData();
            return View.create({
                viewName: "module:sap/ushell/demo/ComponentEmbeddingSample/Main.view",
                viewData: {
                    properties: oComponentData.properties || {}
                }
            });
        }
    });
});
