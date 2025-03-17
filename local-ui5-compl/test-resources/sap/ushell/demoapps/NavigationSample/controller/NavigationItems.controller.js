// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/library",
    "sap/m/ActionSheet",
    "sap/ushell/ui/footerbar/AddBookmarkButton",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Container"
], function (
    Controller,
    MessageToast,
    mobileLibrary,
    ActionSheet,
    AddBookmarkButton,
    JSONModel,
    Container
) {
    "use strict";

    // shortcut for sap.m.PlacementType
    var PlacementType = mobileLibrary.PlacementType;

    // shortcut for sap.m.URLHelper
    var URLHelper = mobileLibrary.URLHelper;

    var dirtyStateProvider = function () {
        return true;
    };

    return Controller.extend("sap.ushell.demo.NavigationSample.controller.NavigationItems", {

        onInit: function () {

            this.oActionSheet = new ActionSheet({
                id: this.getView().getId() + "actionSheet",
                placement: PlacementType.Top,
                buttons: [
                    new AddBookmarkButton({
                        id: this.getView().getId() + "saveAsTile"
                    })
                ]
            });

            this.oHashModel = new JSONModel({
                sHash: "hrefForAppSpecificHashAsync"
            });

            this.getView().setModel(this.oHashModel, "hrefForAppHash");

            this.hrefForAppSpecificHashAsync();
        },

        goDetails: function (oEvent) {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("toDetail");
        },

        goError: function (oEvent) {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("toError");
        },

        // Subpages

        goIntentSubpages: function (oEvent) {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("toIntentSubpages");
        },

        goGetLinks: function (oEvent) {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("toGetLinks");
        },

        goSapTag: function (oEvent) {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("toSapTag");
        },

        goWiki: function (oEvent) {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("toWiki");
        },

        handleHomeWithParams: function () {
            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCANService) {
                oCANService.toExternal({
                    target: { semanticObject: "Action", action: "toNavigation" },
                    params: { zval: "some data", date: new Date().toString() }
                });
            });
        },

        handleHomeWithLongUrl: function () {
            var s = new Date().toString();
            var params = {
                zval: "some data",
                date: Number(new Date()),
                zzzdate: Number(new Date())
            };

            for (var i = 0; i < 20; ++i) {
                s = s + "123456789" + "ABCDEFGHIJKLMNOPQRSTUVWXY"[i];
            }
            for (var j = 0; j < 20; ++j) {
                params["zz" + j] = "zz" + j + s;
            }

            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCANService) {
                oCANService.toExternal({
                    target: { semanticObject: "Action", action: "toNavigation" },
                    params: params
                },
                    this.getOwnerComponent());
            }.bind(this));
        },

        handleBtnBackPress: function () {
            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCANService) {
                oCANService.backToPreviousApp();
            });
        },

        handleBtnHomePress: function () {
            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCANService) {
                oCANService.toExternal({
                    target: { shellHash: "#" }
                });
            });
        },

        handleSetDirtyFlagOn: function () {
            Container.setDirtyFlag(true);
            MessageToast.show("Dirtyflag ON", { duration: 1000 });
        },

        handleSetDirtyFlagOff: function () {
            Container.setDirtyFlag(false);
            MessageToast.show("Dirtyflag OFF", { duration: 1000 });
        },

        handleRegisterDirtyStateProvider: function () {
            console.log("Register dirty state provider button was clicked!");
            Container.registerDirtyStateProvider(dirtyStateProvider);
        },

        handleDeregisterDirtyStateProvider: function () {
            Container.deregisterDirtyStateProvider(dirtyStateProvider);
        },

        handleHistoryBack: function () {
            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCANService) {
                oCANService.historyBack(1);
            });
        },

        doRedirect: function () {
            URLHelper.redirect(document.URL.split("#")[0] + "#Shell-home", true);
        },

        hrefForAppSpecificHashAsync: function () {
            var oRouter = this.getOwnerComponent().getRouter();

            var view = this.getView();

            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCANService) {
                return oCANService.hrefForAppSpecificHashAsync(oRouter.getURL());
            }).then(function (sHash) {
                view.getModel("hrefForAppHash").setProperty("/sHash", sHash);
            });
        }

    });
}
);
