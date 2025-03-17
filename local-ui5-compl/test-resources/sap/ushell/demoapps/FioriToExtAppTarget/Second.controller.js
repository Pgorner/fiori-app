// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Container"
], function (Controller, History, JSONModel, Container) {
    "use strict";

    return Controller.extend("sap.ushell.demo.FioriToExtAppTarget.Second", {
        onInit: function () {
            var oData = { param1: "[default1]", param2: "[default2]", param3: "0" },
                oModel = new JSONModel(oData);

            this.getView().setModel(oModel);
            this.getOwnerComponent().getRouter().getRoute("Second").attachMatched(this._onRouteMatched, this);
            this.getView().byId("txtDirection").setValue(History.getInstance().getDirection() || "undefined");

        },

        _onRouteMatched: function (oEvent) {
            var oArgs = oEvent.getParameter("arguments");

            var oComponentData = this.getOwnerComponent().getComponentData();
            if (oComponentData) {
                var oStartupParameters = oComponentData.startupParameters;
                if (oStartupParameters.param1) {
                    this.getView().getModel().setProperty("/param1", oStartupParameters.param1[0]);
                }
                if (oStartupParameters.param2) {
                    this.getView().getModel().setProperty("/param2", oStartupParameters.param2[0]);
                }
            }
            this.getView().getModel().setProperty("/param3", oArgs.index);
        },

        onNavigate: function () {
            var sTarget = (window["sap-ushell-config"].ui5appruntime ? "FioriToExtAppIsolated" : "FioriToExtApp");

            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCrossApplicationNavigation) {
                oCrossApplicationNavigation.toExternal({
                    target: {
                        semanticObject: sTarget,
                        action: "NewWindow"
                    }
                });
            });
        }
    });
});
