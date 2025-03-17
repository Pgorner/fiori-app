// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/ui/core/Component",
    "sap/ui/core/IconPool",
    "sap/ui/core/UIComponent",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"

], function (
    Log,
    Component,
    IconPool,
    UIComponent,
    Controller,
    JSONModel

) {
    "use strict";

    return Controller.extend("sap.ushell.demo.AppStateFormSample.view.AllIcons", {
        collectionNames: [
            "Fiori2",
            "Fiori3",
            "Fiori4",
            "Fiori5",
            "Fiori6",
            "Fiori7",
            "BusinessSuiteInAppSymbols",
            "FioriInAppIcons",
            "FioriNonNative"
        ],

        collectIcons: function () {
            var res = [];
            var sUri = "sap-icon://Fiori2/F0002";
            this.collectionNames.forEach(function (sCollectionName) {
                if (IconPool.getIconCollectionNames().indexOf(sCollectionName) < 0) {
                    // in the no-shell use case, the icon collections are not registered
                    return;
                }
                var names = IconPool.getIconNames(sCollectionName);
                if (names) {
                    names.forEach(function (nm, idx) {
                        sUri = "sap-icon://" + sCollectionName + "/" + nm;
                        res.push({ Key: sUri, Index: idx, CollectionName: sCollectionName, IsFavicon: "" });
                    });
                }
            });
            return res;
        },

        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         * @memberof view.Detail
         */
        onInit: function () {
            this.oModel = new JSONModel({
                search: "abc", icons: this.collectIcons()
                // { Key: "sap-icon://Fiori2/F0002", Index: 3 }
            });
            this.getView().setModel(this.oModel);
            // this.oModel.register
            this.getView().byId("search").attachLiveChange(this.handleChange.bind(this));
            this.getMyComponent().getModel("AppState").bindProperty("/appState/filter").attachChange(this.updateModel.bind(this));
            this.getMyComponent().getModel("AppState").bindTree("/").attachChange(this.updateModelIfPersMyIcons.bind(this));
            this.updateModel();
        },

        getMyComponent: function () {
            return this.getOwnerComponent();
        },

        updateModelIfPersMyIcons: function () {
            var sNewString;
            sNewString = JSON.stringify(this.getMyComponent().getModel("AppState").getProperty("/pers/myicons") || []);
            // update the model if the favorites have changed
            if (this.sOldPersModel !== sNewString) {
                this.sOldPersModel = sNewString;
                this.updateModel();
            }
        },

        updateModel: function () {
            var res = this.collectIcons();
            var filter = this.getMyComponent().getModel("AppState").getProperty("/appState/filter");
            Log.error("updateModel ... " + filter);
            filter = filter.split(" ");
            var aFavorites = this.getMyComponent().getModel("AppState").getProperty("/pers/myicons") || [];
            filter.forEach(function (nv) {
                res = res.filter(function (obj) {
                    return obj.Key.indexOf(nv) >= 0;
                });
            });
            res.forEach(function (nv) {
                var bIsFavicon = (aFavorites.filter(function (fav) { return fav.Key === nv.Key; })).length;
                var sIsFavicon = bIsFavicon ? "sap-icon://favorite" : "";
                nv.IsFavicon = sIsFavicon;
            });
            this.oModel.getData().icons = res;
            this.oModel.refresh();
        },

        handleChange: function (ev) {
            Log.error("handleChange ..." + ev.oSource.getModel("AppState").getProperty("/appState/filter"));
            // update the model
            ev.oSource.getModel("AppState").setProperty("/appState/filter", ev.mParameters.newValue);
        },

        onListItemPress: function (ev, ev2) {
            // prepare editrecord
            var path = ev.oSource.getSelectedContextPaths()[0];
            var record = ev.oSource.getModel().getProperty(path);
            var obj = JSON.parse(JSON.stringify(record));
            obj.description = obj.description || "";
            obj.name = obj.semanticName || "";
            ev.oSource.getModel("AppState").setProperty("/appState/editRecord", obj);
            this.getMyComponent().navTo("displayIcon");
        },

        onListItemPressTable: function (ev, ev2) {
            ev.oSource.getSelectedItem();
            this.getMyComponent().navTo("displayIcon");
        },

        onTableItemPress: function (ev, ev2) {
            // prepare editrecord
            var path = ev.oSource.getSelectedContextPaths()[0];
            var record = ev.oSource.getModel().getProperty(path);
            var obj = JSON.parse(JSON.stringify(record));
            obj.description = obj.description || "";
            obj.name = obj.semanticName || "";
            ev.oSource.getModel("AppState").setProperty("/appState/editRecord", obj);
            this.getMyComponent().navTo("displayIcon");
        },

        getRouter: function () {
            return UIComponent.getRouterFor(this);
        },

        onClearSearch: function () {
            this.getView().byId("search").setValue("");
        },

        handleBtn1Press: function () {
            this.getRouter().navTo("IconFavoriteList", { iAppState: this.getMyComponent().getInnerAppStateKey() });
        }
    });
});
