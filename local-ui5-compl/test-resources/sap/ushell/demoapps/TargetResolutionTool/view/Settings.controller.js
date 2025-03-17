// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Container"
], function (
    MessageToast,
    Controller,
    JSONModel,
    Container
) {
    "use strict";

    return Controller.extend("sap.ushell.demo.TargetResolutionTool.view.Settings", {
        onInit: function () {
            var that = this;
            Container.getServiceAsync("ClientSideTargetResolution").then(function (oClientSideTargetResolution) {
                this.aOriginalInbounds = []; // To be determined
                oClientSideTargetResolution._oInboundProvider.getInbounds()
                    .then(function (aInbounds) {
                        that.aOriginalInbounds = aInbounds;

                        that.oModel = new JSONModel({
                            inboundConfiguration: JSON.stringify(aInbounds, null, "   ")
                        });
                        that.getView().setModel(that.oModel);

                        that.oModel.bindTree("/").attachChange(that._onModelChanged);
                    })
                    .catch(function (sMsg) {
                        MessageToast.show("Error while calling ClientSideTargetResolution#_oInboundProvider.getInbounds: " +
                            sMsg);
                    });
            });
        },
        onBtnLoadCurrentInboundsPress: function (oEvent) {
            var oThisController = this.getView().getController();

            if (!oThisController.oModel) {
                MessageToast.show("Current model was never created when instantiating the Settings controller!");
                return;
            }

            // Update model with the original result from ensure inbounds
            oThisController.oModel.setData({
                inboundConfiguration: JSON.stringify(oThisController.aOriginalInbounds, null, "   ")
            });
        },
        _onModelChanged: function () {
            var sJson = this.oModel.getData().inboundConfiguration;

            try {
                var aInbounds = JSON.parse(sJson);

                // mock _oInboundProvider to return the specified inbounds
                Container.getServiceAsync("ClientSideTargetResolution").then(function (oClientSideTargetResolution) {
                    oClientSideTargetResolution._oInboundProvider.getInbounds = async function () {
                        return aInbounds;
                    };
                });

                MessageToast.show("Inbounds updated");
            } catch (oError) {
                MessageToast.show("Cannot update inbounds: " + oError);
            }
        },
        onExit: function () { }
    });
});
