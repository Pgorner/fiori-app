// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/demo/AppDirtyStateProvider/controller/BaseController",
    "sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
    "use strict";

    var sIntroText = "A dirty flag provider is an application-defined function that is called lazily by the Fiori Launchpad" +
        "when the dirty state of the application is to be determined." +
        "Simple scenarios (applications made of a single view) are covered by another basic API" +
        "(sap.ushell.Container.setDirtyState(<boolean>)). However, managing dirty state via dirty state providers can be useful if the " +
        "application is composed of multiple views and complex decisions must be taken to determine the dirty state of the application. \n\n" +
        "This application contains sample code that demonstrates how to use dirty state" +
        "providers in UI5 applications that display views based on the UI5 router concept." +
        "Specifically, this example addresses advanced scenario where" +
        "the application has multiple views, but only some of them destroy the input of the user" +
        "upon navigation. To take the correct decision, the dirty state provider" +
        "will check the context in which the navigation occur, managing in detail cross and inner app navigations.\n\n" +
        "The idea is to manage the decision of displaying the dirty state dialog to the user" +
        "centrally, in the application component, while keeping track of the" +
        "current application view.";

    return BaseController.extend("sap.ushell.demo.AppDirtyStateProvider.controller.App", {
        onInit: function () {
            this.oModelData = {
                introText: sIntroText,
                dirtyState: false
            };
            this._setModel(this.oModelData);
        },

        onDisplayNotFound: function () {
            this.getRouter().getTargets().display("notFound", {
                fromTarget: "home"
            });
        },

        onNavToEmployees: function () {
            this.getRouter().navTo("employeeList");
        },

        onNavToEmployeeOverview: function () {
            this.getRouter().navTo("employeeOverview");
        },

        onTextChange: function (oEvent) {
            var bDirty = oEvent.getSource().getValue() !== "";
            this.getView().getModel().setProperty("/dirtyState", bDirty);
        },

        _setModel: function (oJSON) {
            if (!this._oModel) {
                this._oModel = new JSONModel(oJSON);
            } else {
                this._oModel.setData(oJSON);
            }
            this.getView().setModel(this._oModel);
        }
    });
});
