// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/UIComponent"
], function (UIComponent) {
    "use strict";

    return UIComponent.extend("sap.ushell.demo.FioriToExtAppTarget.Component", {
        metadata: {
            version: "1.132.1",

            library: "sap.ushell.demo.FioriToExtAppTarget",

            includes: [],

            dependencies: {
                libs: ["sap.m"],
                components: []
            },
            config: {
                title: "Fiori Target App",
                icon: "sap-icon://Fiori2/F0429"
            },

            rootView: {
                viewName: "sap.ushell.demo.FioriToExtAppTarget.App",
                type: "XML"
            },

            routing: {
                config: {
                    routerClass: "sap.m.routing.Router",
                    viewType: "XML",
                    viewPath: "sap.ushell.demo.FioriToExtAppTarget", // leave empty, common prefix
                    targetControl: "rootControl",
                    controlId: "rootControl",
                    controlAggregation: "pages"
                },
                routes: [{
                    pattern: "", // will be the url and from has to be provided in the data
                    view: "First",
                    name: "First"
                }, {
                    pattern: "Second/{index}", // will be the url and from has to be provided in the data
                    view: "Second",
                    name: "Second"
                }]
            }
        },

        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
            this.getRouter().initialize();
        }
    });
});
