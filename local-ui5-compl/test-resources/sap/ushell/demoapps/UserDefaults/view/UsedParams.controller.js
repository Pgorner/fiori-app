// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Container"
], function (
    Controller,
    JSONModel,
    Container
) {
    "use strict";

    return Controller.extend("sap.ushell.demo.UserDefaults.view.UsedParams", {
        onInit: function () {
            this.oModel = new JSONModel({
                aParameterNames: [{ name: "InitialParameterName1" }]
            });
            this.getView().setModel(this.oModel);

            // fill the parameters directly on startup
            this.handleRefreshParameters();
        },

        getRouter: function () {
            return this.getOwnerComponent().getRouter();
        },

        handleRefreshParameters: async function () {
            const ClientSideTargetResolution = await Container.getServiceAsync("ClientSideTargetResolution");
            const aParameterNames = await ClientSideTargetResolution.getUserDefaultParameterNames();

            this.updateParametersForModel(aParameterNames, this.oModel);
        },

        updateParametersForModel: function (aParameterNames, oModel) {
            var aParameterNamesTmp = [];
            for (var i in aParameterNames) {
                aParameterNamesTmp.push({ name: aParameterNames[i] });
            }
            oModel.setData({ aParameterNames: aParameterNamesTmp }, false); // false -> do not merge
        }
    });
});
