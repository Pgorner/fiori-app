// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define(["sap/ui/core/UIComponent"], function (UIComponent) {
    "use strict";

    return UIComponent.extend("sap.ushell.demo.AppRuntimeRendererSample.Component", {
        metadata: {
            version: "1.132.1",
            library: "sap.ushell.demo.AppRuntimeRendererSample",
            includes: [],
            dependencies: {
                libs: ["sap.m"],
                components: []
            },
            config: {
                title: "App Runtime Renderer API Sample",
                icon: "sap-icon://Fiori2/F0429",
                fullWidth: true
            },
            rootView: {
                viewName: "sap.ushell.demo.AppRuntimeRendererSample.App",
                type: "XML",
                async: true
            }
        }
    });
});
