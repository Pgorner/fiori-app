// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/ushell/plugins/BaseRTAPlugin"
], function (
    Log,
    BaseRTAPlugin
) {
    "use strict";

    var RTAPlugin = BaseRTAPlugin.extend("sap.ushell.plugins.rta-personalize.Component", {
        sType: "rta-personalize",

        metadata: {
            manifest: "json",
            library: "sap.ushell"
        },

        init: function () {
            Log.error("[Deprecated] The FLP plugin for RTA Personalization (sap.ushell.plugins.rta-personalize) is no longer supported.");
        }
    });

    return RTAPlugin;
});
