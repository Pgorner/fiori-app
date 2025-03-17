// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/Component",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
], function (Component, Controller, UIComponent) {
    "use strict";

    return Controller.extend("sap.ushell.demo.AppStateFormSample.view.EditIconForm", {
        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         * @memberof view.Detail
         */
        onInit: function () {
            var val,
                oModel = this.getView() && this.getView().getModel("AppState");
            if (oModel) {
                val = this.getRouter().getRoute().getName() === "editIconFavorite";
                oModel.setProperty("/appState/editRecord", val);
            }
        },

        /**
         * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
         * (NOT before the first rendering! onInit() is used for that one!).
         * @memberof view.Detail
         */
        //  onBeforeRendering: function () {
        //
        //},

        getRouter: function () {
            return UIComponent.getRouterFor(this);
        },

        handleBtn1Press: function () {
            this.getMyComponent().navTo("toView2");
        },

        getMyComponent: function () {
            return this.getOwnerComponent();
        },

        findIndex: function (sId, aArray) {
            return aArray.reduce(function (prevValue, currentElement, index) {
                if (currentElement.Key === sId) {
                    return index;
                }
                return prevValue;
            }, aArray.length);
        },

        onToggleEditMode: function () {
            var oModel;
            oModel = this.getView().getModel("AppState");
            oModel.setProperty("/appState/editEnabled", !oModel.getProperty("/appState/editEnabled"));
            if (oModel.getProperty("/appState/editEnabled")) {
                oModel.setProperty("/other/editButtonText", "Cancel");
                oModel.setProperty("/appState/undoStack", []);
                oModel.setProperty("/appState/undoStackPresent", false);
                this.getMyComponent().navTo("editIconFavorite");
            } else {
                oModel.setProperty("/other/editButtonText", "Edit Icon");
                this.getMyComponent().navTo("displayIcon");
            }
        },

        onBtnBackPressed: function () {
            this.getMyComponent().navTo("displayFavorites");
        },

        onAddOrSavePress: function () {
            // add the current model to the favorites (or update the values therein).
            var oModel,
                state,
                oMyIconList,
                idx;
            oModel = this.getView().getModel("AppState");
            state = oModel.getProperty("/appState/editRecord");
            oMyIconList = oModel.getProperty("/pers/myicons") || [];
            idx = this.findIndex(state.Key, oMyIconList);
            oMyIconList[idx] = state;
            oModel.setProperty("/pers/myicons", oMyIconList);
            oModel.setProperty("/appState/editEnabled", true);
            this.getMyComponent().updateBackend();
            this.onToggleEditMode();
        },

        onDeletePress: function () {
            var oModel,
                state,
                oMyIconList,
                idx;
            oModel = this.getView().getModel("AppState");
            // add the current model to the favorites (or update the values therein).
            state = oModel.getProperty("/appState/editRecord");
            oMyIconList = oModel.getProperty("/pers/myicons") || [];
            idx = this.findIndex(state.Key, oMyIconList);
            if (idx < oMyIconList.length) {
                oMyIconList.splice(idx, 1);
            }
            oModel.setProperty("/pers/myicons", oMyIconList);
            this.getMyComponent().updateBackend();
            this.onToggleEditMode();
        },

        onUndoPress: function () {
            var aUndoStack,
                sLastKey,
                oModel;
            oModel = this.getView().getModel("AppState");
            this.getMyComponent().inEvent = true;
            // add the current model to the favorites (or update the values therein).
            aUndoStack = oModel.getProperty("/appState/undoStack");
            aUndoStack.pop();
            this.getMyComponent().inEvent = false;
            if (aUndoStack.length > 0) {
                sLastKey = aUndoStack[aUndoStack.length - 1];
                this.getRouter().navTo("editIconFavorite", { iAppState: sLastKey });
            } else {
                this.getMyComponent().inEvent = true;
                oModel.setProperty("/appState/undoStackPresent", aUndoStack.length > 0);
                this.getMyComponent().inEvent = false;
            }
            //oModel.setProperty("/appState/undoStack", aUndoStack);
            //? pop sLastKey = oUndoStack.pop();
        }
    });
});
