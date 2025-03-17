// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ushell/renderer/search/controls/SearchFieldGroup",
    "sap/ushell/renderer/search/getModelSingleton",
    "sap/ushell/renderer/search/inputhelp/SearchInputHelpService"
], function (
    Controller,
    SearchFieldGroup,
    getModelSingleton,
    SearchInputHelpService
) {
    "use strict";

    return Controller.extend("sap.ushell.shells.demo.searchRoutingApp.controller.View1", {
        onInit: function () {
            SearchInputHelpService.init(function () {
                // init search model
                if (!this.getOwnerComponent().getModel("searchModel")) {
                    this.oModel = getModelSingleton();
                    // this.oModel.isSearchInputHelp = true;
                    this.oModel.preventUpdateURL = true;
                    this.oModel.config.searchScopeWithoutAll = true;
                    this.getOwnerComponent().setModel(this.oModel, "searchModel");
                }

                this.oSearchFieldGroup = new SearchFieldGroup("searchFieldGroup");
                this.oSearchFieldGroup.setModel(this.oModel);
                this.getView().getContent()[0].getContent()[0].addContent(this.oSearchFieldGroup.select);

                this.oModel.initBusinessObjSearch().then(function () {
                    var dataSources = this.oModel.getProperty("/dataSources");
                    if (dataSources[0] === this.oModel.allDataSource) {
                        dataSources.shift();
                        this.oModel.setDataSource(dataSources[0]);
                    }
                }.bind(this));
            }.bind(this));
        },

        onToPage2: function () {
            this.getOwnerComponent().getRouter().navTo("page2");
            this.oModel._firePerspectiveQuery();
        }
    });
});
