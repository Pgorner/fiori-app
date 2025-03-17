// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/esh/search/ui/SearchShellHelper",
    "sap/esh/search/ui/SearchModel",
    "sap/ushell/renderer/search/util"
], function (
    Controller,
    SearchShellHelper,
    SearchModel,
    searchUtil
) {
    "use strict";

    var isOutdatedElisa = !SearchShellHelper.collapseSearch;

    return Controller.extend("sap/ushell/renderer/search/searchComponent/SearchApp", {

        onInit: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getHashChanger().attachEvent("hashChanged", this.hashChanged);

            if (SearchShellHelper.oSearchFieldGroup === undefined) {
                SearchShellHelper.init();
            }
            if (isOutdatedElisa) {
                SearchShellHelper.setSearchState("EXP_S");
            } else {
                SearchShellHelper.expandSearch();
            }

        },

        hashChanged: function () {
            var model = SearchModel.getModelSingleton({}, "flp");
            model.parseURL();
        },

        onExit: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getHashChanger().detachEvent("hashChanged", this.hashChanged);

            // destroy TablePersoDialog when exit search app to avoid to create same-id-TablePersoDialog triggered by oTablePersoController.active() in SearchCompositeControl.js
            var tablePersoController = this.oView.getContent()[0].oTablePersoController;
            if (tablePersoController && tablePersoController.getTablePersoDialog && tablePersoController.getTablePersoDialog()) {
                tablePersoController.getTablePersoDialog().destroy();
            }

            if (SearchShellHelper.resetModel) {
                SearchShellHelper.resetModel();
            }

            if (isOutdatedElisa) {
                if (SearchShellHelper.getDefaultOpen() !== true) {
                    if (SearchShellHelper.setSearchStateSync) {
                        SearchShellHelper.setSearchStateSync("COL");
                    } else {
                        SearchShellHelper.setSearchState("COL");
                    }
                } else {
                    SearchShellHelper.setSearchState("EXP");
                }
            } else {
                // eslint-disable-next-line no-lonely-if
                if (!searchUtil.isSearchFieldExpandedByDefault()) {
                    SearchShellHelper.collapseSearch();
                } else {
                    SearchShellHelper.expandSearch();
                }
            }

        }
    });

});

