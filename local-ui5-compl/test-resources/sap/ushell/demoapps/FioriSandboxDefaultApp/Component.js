// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define(["sap/ui/core/UIComponent", "sap/ushell/Container"], function (UIComponent, Container) {
    "use strict";

    return UIComponent.extend("sap.ushell.demo.FioriSandboxDefaultApp.Component", {
        metadata: {
            version: "1.132.1",
            library: "sap.ushell.demo.FioriSandboxDefaultApp",
            includes: [],
            dependencies: {
                libs: ["sap.m"],
                components: []
            },
            config: {
                title: "Fiori Sandbox Default App",
                icon: "sap-icon://Fiori2/F0429"
            },
            rootView: {
                viewName: "sap.ushell.demo.FioriSandboxDefaultApp.App",
                type: "XML",
                async: true
            }
        },
        exit: function () {
            var oRenderer = Container.getRendererInternal();
            oRenderer.logRecentActivity({
                icon: "sap-icon://Fiori2/F0429",
                title: "Sample Activity Entry",
                appType: "OVP",
                appId: "#Action-todefaultapp",
                url: "#Action-todefaultapp"
            });
        }
    });
});
