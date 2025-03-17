// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define(["sap/ui/core/UIComponent"], function (UIComponent) {
    "use strict";

    // new Component
    return UIComponent.extend("sap.ushell.demo.AppNavSample2.Component", {
        metadata: { manifest: "json" },

        getAutoPrefixId: function () {
            return true;
        },

        init: function () {
            UIComponent.prototype.init.apply(this, arguments);

            // this component should automatically initialize the router!
            this.getRouter().initialize();

            // trigger direct inner-app navigation if intent parameter navTo set
            // we use this for testing the correct stopping of the previous app's
            // router upon cross-app navigation
            var oStartupParameters = this.getComponentData().startupParameters,
                sNavTo = oStartupParameters && oStartupParameters.navTo && oStartupParameters.navTo[0];

            if (sNavTo) {
                this.getRouter().navTo(sNavTo, null, true);
            }
        }
    });
});
