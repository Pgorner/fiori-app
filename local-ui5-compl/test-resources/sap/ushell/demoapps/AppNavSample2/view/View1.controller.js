// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Container"
], function (Controller, UIComponent, JSONModel, Container) {
    "use strict";

    return Controller.extend("sap.ushell.demo.AppNavSample2.view.View1", {
        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         * @memberof view.Detail
         */
        onInit: function () {
            this.oModel = new JSONModel({
                parameterName: "UshellTest1",
                value: ""
            });
            this.getView().setModel(this.oModel, "UserDef");
        },

        getRouter: function () {
            return UIComponent.getRouterFor(this);
        },

        handleBtn1Press: function () {
            this.getRouter().navTo("toView2");
        },

        handleBtnSavePress: function () {
            var sParameterName = this.getView().getModel("UserDef").getProperty("/parameterName");
            if (!sParameterName) {
                sParameterName = "UshellTest1";
            }
            var v1 = this.getView().getModel("UserDef").getProperty("/value");
            if (!v1) {
                v1 = "ABC_" + Number(new Date());
            }
            Container.getServiceAsync("UserDefaultParameterPersistence").then(function (oService) {
                oService.saveParameterValue(sParameterName, { value: v1 });
            });
        },

        handleBtnDeletePress: function () {
            var sParameterName = this.getView().getModel("UserDef").getProperty("/parameterName");
            if (!sParameterName) {
                sParameterName = "UshellTest1";
            }
            Container.getServiceAsync("UserDefaultParameterPersistence").then(function (oService) {
                oService.deleteParameter(sParameterName);
            });
        },

        handleBtnLoadPress: function () {
            var that = this;
            var sParameterName = this.getView().getModel("UserDef").getProperty("/parameterName");
            if (!sParameterName) {
                sParameterName = "UshellTest1";
            }
            Container.getServiceAsync("UserDefaultParameterPersistence").then(function (oService) {
                oService.loadParameterValue(sParameterName).done(function (oValue) {
                    Container.getServiceAsync("MessageInternal").then(function (oMessage) {
                        oMessage.info(" Value is " + JSON.stringify(oValue));
                    });
                    that.getView().getModel("UserDef").setProperty("/value", oValue);
                }).fail(function (sMsg) {
                    Container.getServiceAsync("MessageInternal").then(function (oMessage) {
                        oMessage.info(" Fail: Msg is " + sMsg);
                    });
                    that.getView().getModel("UserDef").setProperty("/value", "<error>" + sMsg);
                });
            });
        },

        handleBtngetStoredParameterNamesPress: function () {
            Container.getServiceAsync("UserDefaultParameterPersistence").then(function (oService) {
                oService.getStoredParameterNames().done(function (oValue) {
                    Container.getServiceAsync("MessageInternal").then(function (oMessage) {
                        oMessage.info(" Names are:" + JSON.stringify(oValue));
                    });
                }).fail(function (sMsg) {
                    Container.getServiceAsync("MessageInternal").then(function (oMessage) {
                        oMessage.info(" Fail: Msg is " + sMsg);
                    });
                });
            });
        },

        handleBtn1DetermineValuePress: function () {
            var that = this;
            var sParameterName = this.getView().getModel("UserDef").getProperty("/parameterName");
            if (!sParameterName) {
                sParameterName = "UshellTest1";
            }
            Container.getServiceAsync("UserDefaultParameters").then(function (oService) {
                oService.getValue(sParameterName).done(function (oValue) {
                    Container.getServiceAsync("MessageInternal").then(function (oMessage) {
                        oMessage.info(" Value is :" + JSON.stringify(oValue));
                    });
                    that.getView().getModel("UserDef").setProperty("/value", oValue.value);
                }).fail(function (sMsg) {
                    Container.getServiceAsync("MessageInternal").then(function (oMessage) {
                        oMessage.info(" Fail: Msg is " + sMsg);
                    });
                    that.getView().getModel("UserDef").setProperty("/value", "<error>" + sMsg);
                });
            });
        }
    });
});
