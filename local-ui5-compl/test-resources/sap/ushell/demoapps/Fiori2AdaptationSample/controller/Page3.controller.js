// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
], function (
    MessageToast,
    Controller,
    UIComponent
) {
    "use strict";

    return Controller.extend("sap.ushell.demo.Fiori2AdaptationSample.controller.Page3", {
        onUpdateMasterTitle: function () {
            this.getView().byId("master1").setTitle("Master1Updated");
        },
        toMaster2Page: function () {
            var oMaster2 = this.getView().byId("master2");
            this.getView().byId("splitContainer").toMaster(oMaster2);
        },
        backMaster: function () {
            this.getView().byId("splitContainer").backMaster();
        },
        onUpdateDetailTitle: function () {
            this.getView().byId("detail1").setTitle("Detail1Updated");
        },
        toDetail2Page: function () {
            var oDetail2 = this.getView().byId("detail2");
            this.getView().byId("splitContainer").toDetail(oDetail2);
        },
        backDetail: function () {
            this.getView().byId("splitContainer").backDetail();
        },
        toPage4: function () {
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("page4");
        },
        back: function () {
            window.history.back();
            MessageToast.show("Page3CustomBack", { closeOnBrowserNavigation: false });
        }
    });
});
