// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Container"
], function (Controller, JSONModel, Container) {
    "use strict";

    return Controller.extend("sap.ushell.demo.app2ContentProviderC.App", {
        onInit: function () {
            this.model = new JSONModel({
                contentProviderId: "Loading..."
            });
            this.getView().setModel(this.model);

            this.setContentProviderId();
            this.setSapSystem();
        },
        setSapSystem: function () {
            var oModel = this.model;
            var oStartupParameters = this.getOwnerComponent().getComponentData().startupParameters || {};
            var aSapSystem = oStartupParameters["sap-system"] || [];
            var sSapSystem = aSapSystem.shift();

            oModel.setProperty("/sapSystem", sSapSystem);
        },
        setContentProviderId: function () {
            var oModel = this.model;

            Container.getServiceAsync("AppLifeCycle")
                .then(function (oService) {
                    oService.attachAppLoaded(null, function (oEvent) {
                        oEvent.getParameters().getSystemContext().then(function (oSystemContext) {
                            oModel.setProperty("/contentProviderId", oSystemContext.id);
                        });
                    });
                });
        }
    });
});
