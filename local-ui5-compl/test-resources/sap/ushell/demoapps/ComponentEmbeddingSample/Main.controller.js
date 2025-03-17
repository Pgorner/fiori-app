// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/base/Log",
    "sap/m/MessageToast",
    "sap/ushell/Container"
], function (Controller, Log, MessageToast, Container) {
    "use strict";

    return Controller.extend("sap.ushell.demo.ComponentEmbeddingSample.Main", {
        /**
         * Trigger loading of component.
         */
        handleLoadComponent: async function () {
            const sIntent = this.getView().byId("inputNavigationIntent").getValue();
            const oComponentContainer = this.getView().byId("componentContainer");
            const bSetOwnerComponent = this.getView().byId("checkBoxOwner").getSelected();
            const oOwnerComponent = bSetOwnerComponent ? this.getOwnerComponent() : null;

            const oCANService = await Container.getServiceAsync("CrossApplicationNavigation");
            oCANService.createComponentInstance(sIntent, null, oOwnerComponent)
                .done(function (oComponent) {
                    oComponentContainer.setComponent(oComponent);
                })
                .fail(function (oError) {
                    MessageToast.show(oError);
                    Log.error(oError);
                });
        }
    });
});
