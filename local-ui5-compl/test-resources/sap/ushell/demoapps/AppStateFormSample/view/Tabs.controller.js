// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/m/Text",
    "sap/ui/core/Component",
    "sap/ui/core/IconPool",
    "sap/ui/core/Icon",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel"

], function (Log, Text, Component, IconPool, Icon, Controller, UIComponent, JSONModel) {
    "use strict";

    return Controller.extend("sap.ushell.demo.AppStateFormSample.view.Tabs", {
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
            var res = [],
                sUri = "sap-icon://Fiori2/F0002",
                names;
            this.collectionNames.forEach(function (sCollectionName) {
                if (IconPool.getIconCollectionNames().indexOf(sCollectionName) < 0) {
                    // in the noshell use case, the icon collections are not registered
                    return;
                }
                names = IconPool.getIconNames(sCollectionName);
                if (names) {
                    names.forEach(function (nm, idx) {
                        sUri = "sap-icon://" + sCollectionName + "/" + nm;
                        res.push({ Key: sUri, Index: idx, CollectionName: sCollectionName });
                    });
                }
            });
            return res;
        },

        renderIcons: function (sCollectionName) {
            var sUri = "sap-icon://Fiori2/F0002",
                nr,
                that,
                names;
            if (IconPool.getIconCollectionNames().indexOf(sCollectionName) < 0) {
                // in the noshell use case, the icon collections are not registered
                return;
            }
            names = IconPool.getIconNames(sCollectionName);
            if (!names) {
                return;
            }
            nr = names.length;
            that = this;
            that.getView().byId("pgView2").addContent(new Text({ text: sCollectionName + ": " + nr + "icons" }));
            names.forEach(function (nm, idx) {
                sUri = "sap-icon://" + sCollectionName + "/" + nm;
                that.getView().byId("pgView2").addContent(new Icon({
                    height: "38px",
                    //press: chips.tiles.utils.onSelectIcon.bind(null, oController),
                    size: "2rem",
                    src: sUri,
                    tooltip: sUri + "(" + idx + ")",
                    width: "38px"
                }));
            });
        },

        /**
        * Called when a controller is instantiated and its View controls (if available) are already created.
        * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
        * @memberof view.Detail
        */
        onInit: function () {
            this.collectionNames.forEach(function (sNm) {
                //      that.renderIcons(sNm);
            });
            this.oModel = new JSONModel({
                search: "abc", icons: this.collectIcons()
                //{Key : "sap-icon://Fiori2/F0002", Index : 3 }
            });
            this.getView().setModel(this.oModel);
        },

        getMyComponent: function () {
            return this.getOwnerComponent();
        },

        updateModel: function () {
            var filter,
                res;
            res = this.collectIcons();
            filter = this.getMyComponent().getModel("AppState").getProperty("/appState/filter");
            Log.error("updateModel ... " + filter);
            filter = filter.split(" ");
            filter.forEach(function (nv) {
                res = res.filter(function (obj) {
                    return obj.Key.indexOf(nv) >= 0;
                });
            });
            this.oModel.getData().icons = res;
            this.oModel.refresh();
        },

        handleChange: function (ev) {
            Log.error("handleChange ..." + ev.oSource.getModel("AppState").getProperty("/appState/filter"));
            // update the model!
            ev.oSource.getModel("AppState").setProperty("/appState/filter", ev.mParameters.newValue);
        },

        setTab: function (tabname) {
            this.getView().byId("idIconTabBar").setSelectedKey(tabname);
        },

        onTabSelect: function (ev, ev2) {
            // prepare editrecord

            //        //ev.oSource.getModel("appState").setProperty("/appState/editRecord", { key : "AA", description: ""});
            this.getMyComponent().navTo(ev.getSource().getSelectedKey());
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
