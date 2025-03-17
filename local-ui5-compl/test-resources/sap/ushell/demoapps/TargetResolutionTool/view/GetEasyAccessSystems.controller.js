// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Container"
], function (oMessageToast, oController, JSONModel, Container) {
    "use strict";

    return oController.extend("sap.ushell.demo.TargetResolutionTool.view.GetEasyAccessSystems", {
        onInit: function () {
            this.oModel = new JSONModel({
                items: [] // text and title
            });
            this.getView().setModel(this.oModel);
        },
        onBtnExecutePress: function (e) {
            e.preventDefault();
            var that = this;

            try {
                Container.getServiceAsync("ClientSideTargetResolution")
                    .then(function (oClientSideTargetResolutionService) {
                        return oClientSideTargetResolutionService.getEasyAccessSystems();
                    })
                    .then((oSystems) => {
                        var aSystems = Object.keys(oSystems).map(function (sSystemId) {
                            return {
                                text: sSystemId,
                                title: oSystems[sSystemId].text,
                                raw: oSystems[sSystemId]
                            };
                        });
                        that.oModel.setData({ items: aSystems });
                        oMessageToast.show("Found " + aSystems.length + " systems");
                    })
                    .catch((sMsg) => {
                        oMessageToast.show("An error occurred while retrieving the inbounds: " + sMsg);
                    });
            } catch (oError) {
                oMessageToast.show("Exception: " + oError);
            }
        },
        onSystemSelected: function (oEvent) {
            var oSelectedInbound = oEvent.getSource().getBindingContext().getObject();
            oMessageToast.show(JSON.stringify(oSelectedInbound.raw, null, "   "));
        },
        _onModelChanged: function () {
            // read from the model and update internal state
        },
        onExit: function () { }
    });
});
