// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define(["sap/ui/core/UIComponent"], function (UIComponent) {
    "use strict";

    return UIComponent.extend("sap.ushell.demo.localApp.Component", {
        metadata: {
            version: "1.132.1",
            library: "sap.ushell.demo.localApp",
            dependencies: {
                libs: ["sap.m"],
                components: []
            },
            config: {
                title: "Local App",
                icon: "sap-icon://Fiori2/F0429"
            },
            rootView: {
                viewName: "sap.ushell.demo.localApp.App",
                type: "XML",
                async: true
            }
        }
    });
});
