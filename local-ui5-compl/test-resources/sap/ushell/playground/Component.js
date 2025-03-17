// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/core/util/MockServer",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel",
    "./testData/NavigationBarMenu/NavigationBarMenuSpaces"
], function (
    UIComponent,
    MockServer,
    Device,
    JSONModel,
    navigationBarMenu
) {
    "use strict";

    return UIComponent.extend("sap.ushell.playground.Component", {
        metadata: {
            manifest: "json"
        },

        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
            this.setModel(new JSONModel(Device), "device");
            // we need this menu model here to be able to use the propagateModel property of the ComponentContainer.
            this.setModel(new JSONModel(navigationBarMenu), "menu");

            const oRouter = this.getRouter();

            let oLastMatchedView = null;
            oRouter.attachBeforeRouteMatched(() => {
                oLastMatchedView?.getController?.()?.restoreMocks?.();
                MockServer.stopAll();
            });

            oRouter.attachRouteMatched((oEvent) => {
                oLastMatchedView = oEvent.getParameter("views")[1];
                oLastMatchedView?.getController?.()?.prepareMocks?.();
            });

            oRouter.initialize();
        }
    });
});
