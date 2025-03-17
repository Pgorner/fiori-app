// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/ushell/Config",
    "sap/ushell/EventHub",
    "sap/ushell/utils",
    "sap/ushell/Container"
], function (
    Log,
    Controller,
    JSONModel,
    AppRuntimeService,
    Config,
    EventHub,
    ShellUtils,
    Container
) {
    "use strict";

    return Controller.extend("sap.ushell.demo.NavigationSample.controller.Detail", {
        oApplication: null,

        onCreateEndBtn: function () {
            Container.getRendererInternal().addHeaderEndItem(
                "sap.ushell.ui.shell.ShellHeadItem",
                {
                    id: "idButtonSub",
                    icon: "sap-icon://flight",
                    tooltip: "subtract 2 numbers",
                    click: function () {
                        // alert("header button was clicked. This alert is executed inside the iframe");
                        var oView = this.getView();
                        oView.byId("idResult").setValue(Number(oView.byId("idNumber1").getValue()) - Number(oView.byId("idNumber2").getValue()));
                    }.bind(this)
                }, true, true);
        },
        onInit: function () {
            this.oModel = new JSONModel();
            this.contextualDisplayCoord = this.displayCoordinats.bind(this);
            // set the current user in the model (testing UserInfo service)
            Promise.all([
                Container.getServiceAsync("CrossApplicationNavigation"),
                Container.getServiceAsync("UserInfo")
            ]).then(function (aResults) {
                var oCANService = aResults[0];
                var oUserInfoService = aResults[1];
                oCANService.isInitialNavigationAsync().then(function (bIsInitialNavigation) {
                    //create the setup
                    AppRuntimeService.sendMessageToOuterShell("sap.ushell.registry.addHeaderBtn", {}).done(function (oRetObj) {
                        Log.debug(oRetObj);
                        this.addHeaderBtn = oRetObj.addHeaderEndBtn;
                    }.bind(this));

                    this.oModel.setData({
                        coordinates: 12,
                        userId: oUserInfoService.getId(),
                        isInitialNavigation: bIsInitialNavigation ? "yes" : "no",
                        isInitialNavigationColor: bIsInitialNavigation ? "green" : "red",
                        appStartDate: new Date()
                    });
                    this.getView().setModel(this.oModel, "detailView");
                    this.getView().getModel("detailView").setProperty("/coordinates", 99);
                }.bind(this));
            }.bind(this));

            var oModel = this.oModel;

            Container.getServiceAsync("Configuration")
                .then(function (oService) {
                    oService.attachSizeBehaviorUpdate(
                        function (sSizeBehavior) {
                            oModel.setProperty("/sizeBehavior", sSizeBehavior);
                        }
                    );
                });
        },

        _sizeBehaviorUpdate: function (sSizeBehavior) {
            this.oModel.setProperty("/sizeBehavior", sSizeBehavior);
        },

        toggleSizeBehavior: function () {
            var oModel = this.getView().getModel("detailView"),
                sSizeBehavior = oModel.getProperty("/sizeBehavior");
            var sNewSizeBehavior = (sSizeBehavior === "Responsive" ? "Small" : "Responsive");
            Config.emit("/core/home/sizeBehavior", sNewSizeBehavior);
        },

        generateLinks: function () {
            this.getOwnerComponent().getRootControl().getController().generateLinks();
            this.byId("xapplist").setVisible(true);
        },
        onFlipPropertyClicked: function (oEvent) {
            var sConfig = oEvent.getSource().data().config;
            var bCurrent = Config.last(sConfig);
            Config.emit(sConfig, !bCurrent);
        },
        displayCoordinats: function (oEvent) {
            this.getView().getModel("detailView").setProperty("/coordinates", {
                screenX: oEvent.screenX,
                screenY: oEvent.screenY
            });
        },
        onAddEventListener: function (oEvent) {
            document.addEventListener("mousemove", this.contextualDisplayCoord);
        },
        onRemoveEventLister: function (oEvent) {
            document.removeEventListener("mousemove", this.contextualDisplayCoord);
        },

        onAddClickLister: function (oEvent) {
            document.addEventListener("click", this.contextualDisplayCoord);
        },

        onRemoveClickLister: function (oEvent) {
            document.removeEventListener("keypress", this.contextualDisplayCoord);
        }
    });
});
