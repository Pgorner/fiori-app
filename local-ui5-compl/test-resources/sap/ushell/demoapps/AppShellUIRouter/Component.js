// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ushell/demo/AppShellUIRouter/localService/mockserver"
], function (UIComponent, MockServer) {
    "use strict";

    return UIComponent.extend("sap.ushell.demo.AppShellUIRouter.Component", {
        metadata: {
            manifest: "json",
            interfaces: ["sap.ui.core.IAsyncContentCreation"]
        },

        init: function () {
            // call the init function of the parent
            UIComponent.prototype.init.apply(this, arguments);

            MockServer.init();
            this.getModel().refreshMetadata();

            // create the views based on the url/hash
            this.getRouter().initialize();
        }
    });
});
