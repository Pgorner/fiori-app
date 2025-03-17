// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/Token",
    "sap/ushell/Container"
], function (Controller, JSONModel, Token, Container) {
    "use strict";

    return Controller.extend("sap.ushell.demo.AppNavSample.view.SapTagSample", {
        onInit: function () {
            this.oModel = new JSONModel();
            this.getView().setModel(this.oModel, "tagModel");

            var oTagTokenizer = this.getView().byId("tagTokenizer");
            oTagTokenizer.addValidator(function (args) {
                var text = args.text;
                return new Token({
                    key: text,
                    text: text
                });
            });
        },

        onSemanticObjectSelected: function (oEvt) {
            var sSelectedSO = oEvt.getParameter("selectedItem").getText();
            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCANService) {
                oCANService.getPrimaryIntent(sSelectedSO, {}).done(function (oResult) {
                    this.oModel.setProperty("/primaryIntent", oResult);
                }.bind(this));
            }.bind(this));
        },

        onSemanticObjectSelectedForTags: function (oEvt) {
            this.sSelectedSoTags = oEvt.getParameter("selectedItem").getText();
            this.onTokenUpdated();
        },

        onTokenUpdated: function () {
            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCANService) {
                var sSO = this.sSelectedSoTags || "Tagtesting";
                oCANService.getLinks({
                    semanticObject: sSO,
                    tags: this.getView().byId("tagTokenizer").getTokens().map(function (elem, index) {
                        return elem.getKey();
                    })
                }).done(function (oResult) {
                    this.oModel.setProperty("/taggedIntents", oResult);
                }.bind(this));
            }.bind(this));
        }
    });
});
