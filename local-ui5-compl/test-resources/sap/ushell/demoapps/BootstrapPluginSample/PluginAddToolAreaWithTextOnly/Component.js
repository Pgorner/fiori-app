// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

// define a root UIComponent which exposes the main view


sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ushell/demo/PluginAddToolAreaWithTextOnly"
], function (UIComponent /*,PluginAddToolAreaWithTextOnly*/) {
    "use strict";

    return UIComponent.extend("sap.ushell.demo.PluginAddToolAreaWithTextOnly.Component", {
        // use inline declaration instead of component.json to save 1 round trip
        metadata: { manifest: "json" },

        createContent: function () { }
    });
});

