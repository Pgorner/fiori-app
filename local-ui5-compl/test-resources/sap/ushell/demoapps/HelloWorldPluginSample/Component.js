// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/m/MessageToast",
    "sap/ui/core/Component",
    "sap/ui/core/Core"
], function (
    Log,
    MessageToast,
    Component,
    Core
) {
    "use strict";

    return Component.extend("sap.ushell.demo.HelloWorldPluginSample.Component", {
        metadata: {
            manifest: "json"
        },

        init: function () {
            Log.info("HelloWorldPluginSample initialized", undefined, "sap.ushell.demo.HelloWorldPluginSample.Component");

            // just for demo - do NOT directly trigger UI actions in productive plug-ins.
            // UI5 is available, but DOM might not be ready yet.
            Core.ready(this._sayHello.bind(this));
        },

        _sayHello: function () {
            const oConfig = this.getComponentData().config;
            const sMessage = (oConfig && oConfig.message) || "Hello World from SAP Fiori launchpad plug-in";
            const iDuration = oConfig && oConfig.duration;

            MessageToast.show(sMessage, {
                duration: iDuration
            });
        }
    });
});
