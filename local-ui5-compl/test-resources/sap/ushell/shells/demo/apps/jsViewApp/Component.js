// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define(["sap/ui/core/UIComponent"], function (UIComponent) {
    "use strict";

    return UIComponent.extend("shells.demo.apps.jsViewApp.Component", {
        metadata: {
            version: "1.132.1",
            library: "shells.demo.apps.jsViewApp",
            includes: [],
            dependencies: {
                libs: ["sap.m"],
                components: []
            },
            config: {
                title: "App letterBoxing",
                icon: "sap-icon://Fiori2/F0429",
                fullWidth: true
            },
            rootView: {
                viewName: "shells.demo.apps.jsViewApp.App",
                type: "XML",
                async: true
            }
        }
    });
});
