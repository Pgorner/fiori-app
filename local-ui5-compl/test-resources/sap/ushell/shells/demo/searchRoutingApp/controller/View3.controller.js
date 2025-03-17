// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/core/routing/History"], function (Controller, History) {
    "use strict";

    return Controller.extend("sap.ushell.shells.demo.searchRoutingApp.controller.View3", {
        onInit: function () {
            this.oModel = this.getOwnerComponent().getModel("searchModel");
            this.getView().setModel(this.oModel);
        },

        onToPage2: function () {
            this.getOwnerComponent().getRouter().navTo("page2");
        },

        onBack: function () {
            var sPreviousHash = History.getInstance().getPreviousHash();

            // The history contains a previous entry
            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                // There is no history!
                // replace the current hash with page 1 (will not add an history entry)
                this.getOwnerComponent().getRouter().navTo("page2", null, true);
            }
        }
    });
});
