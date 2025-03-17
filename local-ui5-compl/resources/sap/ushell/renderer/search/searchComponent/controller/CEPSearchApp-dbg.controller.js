// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/Element",
    "sap/ui/core/mvc/Controller",
    "sap/esh/search/ui/SearchModel",
    "sap/ushell/Container",
    "../../util"
], function (
    Element,
    Controller,
    SearchModel,
    Container,
    util
) {
    "use strict";
    return Controller.extend("sap/ushell/renderer/search/searchComponent/SearchApp", {

      onInit: async function () {
            SearchModel.getModelSingleton({}, "flp");
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getHashChanger().attachEvent("hashChanged", this.hashChanged);
        },

        hashChanged: function () {
            const model = SearchModel.getModelSingleton({}, "flp");
            model.parseURL();
        },

        onExit: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getHashChanger().detachEvent("hashChanged", this.hashChanged);

            this.oSF = Element.getElementById("CEPSearchField");
            this.oPlaceHolderSF = Element.getElementById("PlaceHolderSearchField");
            // Reset search fields value when exiting the result page
            if (this.oSF && this.oSF.getValue() !== "") {
                this.oSF.setValue("");
            }

            if (this.oPlaceHolderSF && this.oPlaceHolderSF.getValue() !== "") {
                this.oPlaceHolderSF.setValue("");
            }

            // destroy TablePersoDialog when exit search app to avoid to create same-id-TablePersoDialog triggered by oTablePersoController.active() in SearchCompositeControl.js
            const tablePersoController = this.oView.getContent()[0].oTablePersoController;
            if (tablePersoController && tablePersoController.getTablePersoDialog && tablePersoController.getTablePersoDialog()) {
                tablePersoController.getTablePersoDialog().destroy();
            }

        }
    });

});

