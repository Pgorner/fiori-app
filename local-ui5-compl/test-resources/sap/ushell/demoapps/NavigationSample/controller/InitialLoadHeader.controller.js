// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/ushell/Container"
], function (
    Log,
    Controller,
    JSONModel,
    AppRuntimeService,
    Container
) {
    "use strict";

    return Controller.extend("sap.ushell.demo.NavigationSample.controller.InitialLoadHeader", {
        onInit: function () {
            this.oModel = new JSONModel();

            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCANService) {

                oCANService.isInitialNavigationAsync().then(function (bIsInitialNavigation) {
                    //create the setup
                    AppRuntimeService.sendMessageToOuterShell("sap.ushell.registry.addHeaderBtn", {}).done(function (oRetObj) {
                        Log.debug(oRetObj);
                        this.addHeaderBtn = oRetObj.addHeaderEndBtn;
                    }.bind(this));

                    this.oModel.setData({
                        isInitialNavigation: bIsInitialNavigation ? "yes" : "no",
                        isInitialNavigationColor: bIsInitialNavigation ? "green" : "red",
                        isInitialNavigationIcon: bIsInitialNavigation ? "sap-icon://status-completed" : "sap-icon://status-error"
                    });
                    this.getView().setModel(this.oModel, "initialLoad");
                }.bind(this));

            }.bind(this));
        }
    });

});
