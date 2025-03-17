// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ushell/Container"], function (Controller, Container) {
    "use strict";

    var oSmartNavServicePromise;

    return Controller.extend("sap.ushell.demo.AppNavSample.view.SmartNavSample", {
        onInit: function () {
            oSmartNavServicePromise = Container.getServiceAsync("SmartNavigation");
        },

        onBeforeRendering: function () {
            oSmartNavServicePromise.then(function (oSmartNavService) {
                return oSmartNavService.getLinks({ semanticObject: "Action" });
            }).then(function (links) {
                this.getView().getModel("SOmodel").setProperty("/links", links);
            }.bind(this));
        },

        onSemanticObjectSelected: function (oEvent) {
            var sSemObject = oEvent.getParameter("selectedItem").getText();

            oSmartNavServicePromise.then(function (oSmartNavService) {
                return oSmartNavService.getLinks({ semanticObject: sSemObject });
            }).then(function (links) {
                this.getView().getModel("SOmodel").setProperty("/links", links);
            }.bind(this));
        },

        onItemPressed: function (oEvt) {
            var intent = oEvt.getSource().getText();
            oSmartNavServicePromise.then(function (oSmartNavService) {
                oSmartNavService.toExternal({ target: { shellHash: intent } });
            });
        }
    });
});
