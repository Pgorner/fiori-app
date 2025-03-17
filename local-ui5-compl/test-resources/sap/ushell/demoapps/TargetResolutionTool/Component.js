// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/Router"
], function (UIComponent, Router) {
    "use strict";

    return UIComponent.extend("sap.ushell.demo.TargetResolutionTool.Component", {
        metadata: { manifest: "json" },
        getInnerAppRouter: function () {
            return this.oRouter;
        },

        init: function () {
            UIComponent.prototype.init.apply(this, arguments);

            /* Nav (1) declare a route config */
            /* Nav (2) and construct the router instance */
            this.oRouter = new Router([{
                /* we encode the viewname in the path */
                pattern: "{viewName}/",
                name: "toaView" // name of the single route
            }, {
                /* we encode the viewname in the path */
                pattern: ":all*:", // catchall
                name: "_home" // name of the single route
            }]);
            this.oRouter.register("sap.ushell.demo.TargetResolutionTool"); // unique name of router (!)
            this.oRouter.initialize(); // router initialization must be done after view construction
        }
    });
});
