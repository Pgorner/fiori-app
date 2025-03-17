// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Config"
], function (Controller, MessageToast, JSONModel, Config) {
    "use strict";

    return Controller.extend("sap.ushell.demo.textverticalization.controller.App", {
        onInit: function () {
            this.oView = this.getView();
            this.oView.setModel(this.getOwnerComponent().getModel("i18n"), "i18n");


            this.oModel = new JSONModel({
                activeTerminologies: JSON.stringify(this.getOwnerComponent().getActiveTerminologies(), null, 2)
            });

            this.oView.setModel(this.oModel);
        },

        showMessageToast: function () {
            var sText = this.oView.getModel("i18n").getResourceBundle().getText("messageToast.text");
            MessageToast.show(sText);
        }
    });
});
