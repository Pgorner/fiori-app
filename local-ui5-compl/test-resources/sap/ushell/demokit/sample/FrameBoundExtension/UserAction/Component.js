// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ushell/sample/FrameBoundExtension/UserAction/Plugin.controller",
    "sap/ushell/sample/LaunchpadSetup"
], function (
    UIComponent,
    PluginController,
    LaunchpadSetup
) {
    "use strict";

    return UIComponent.extend("sap.ushell.sample.FrameBoundExtension.UserAction.Component", {
        metadata: {
            library: "sap.ushell",
            dependencies: {
                libs: [
                    "sap.ushell",
                    "sap.ui.core",
                    "sap.ui.layout"
                ]
            },
            includes: [],
            config: {
                sample: {
                    stretch: true,
                    files: [
                        "Plugin.controller.js"
                    ]
                }
            }
        },

        createContent: function () {
            return LaunchpadSetup.createPlaceholderControl(PluginController.runCode);
        }
    });
});
