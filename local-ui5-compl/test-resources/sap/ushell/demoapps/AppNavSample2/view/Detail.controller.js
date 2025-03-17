// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/Text",
    "sap/ui/core/Icon",
    "sap/ui/core/IconPool",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel"
], function (Text, Icon, IconPool, Controller, UIComponent, JSONModel) {
    "use strict";

    return Controller.extend("sap.ushell.demo.AppNavSample2.view.Detail", {
        collectionNames: [
            "Fiori2",
            "Fiori3",
            "Fiori4",
            "Fiori5",
            "Fiori6",
            "Fiori7",
            "Fiori8",
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
            var that = this;
            this.collectionNames.forEach(function (sNm) {
                that.renderIcons(sNm);
            });
            this.oModel = new JSONModel({
                search: "abc", icons: this.collectIcons()
                //{Key : "sap-icon://Fiori2/F0002", Index : 3 }
            });
            //        <!--          <uicore:Icon src="sap-icon://Fiori2/F0002" tooltip="sap-icon://Fiori2/F0002"
            //            height="38px" width="38px" size ="2rem" > </uicore:Icon>
            //
            //        });
            this.getView().setModel(this.oModel);
            //this.oModel.register
            this.getView().byId("search").attachLiveChange(this.handleChange.bind(this));
        },

        handleChange: function (ev) {
            var res,
                search;
            // update the model!
            res = this.collectIcons();
            search = ev.mParameters.newValue.split(" ");
            search.forEach(function (nv) {
                res = res.filter(function (obj) {
                    return obj.Key.indexOf(nv) >= 0;
                });
            });
            ev.oSource.getModel().getData().icons = res;
            this.oModel.refresh();
        },

        getRouter: function () {
            return UIComponent.getRouterFor(this);
        },

        onClearSearch: function () {
            this.getView().byId("search").setValue("");
        },
        /**
         * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
         * (NOT before the first rendering! onInit() is used for that one!).
         * @memberof view.Detail
         */
        //onBeforeRendering: function() {
        //
        //},

        handleBtn1Press: function () {
            this.getRouter().navTo("toView1");
        }

    });
});
