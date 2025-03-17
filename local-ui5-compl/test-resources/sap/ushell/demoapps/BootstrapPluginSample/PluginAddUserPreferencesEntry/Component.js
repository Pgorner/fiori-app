// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

// define a root UIComponent which exposes the main view

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ushell/demo/PluginAddUserPreferencesEntry"
], function (UIComponent) {

    "use strict";

    return UIComponent.extend("sap.ushell.demo.PluginAddUserPreferencesEntry.Component", {
        metadata: {
            manifest: "json"
        },

        createContent: function () { }
    });
});
