// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define(["sap/ui/core/UIComponent"], function (UIComponent) {
    "use strict";

    return UIComponent.extend("sap.ushell.demo.UserDefaults.Component", {
        metadata: { manifest: "json" },

        getAutoPrefixId: function () {
            return true;
        },

        init: function () {
            UIComponent.prototype.init.apply(this, arguments);

            // this component should automatically initialize the router!
            this.getRouter().initialize();
        }
    });
});
