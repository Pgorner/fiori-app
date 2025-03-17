// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/Text",
    "sap/ui/core/Icon",
    "sap/ui/core/IconPool",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
], function (Text, Icon, IconPool, Controller, UIComponent) {
    "use strict";

    Controller.extend("sap.ushell.demo.AppNavSample2.view.View2", {
        renderIcons: function (sCollectionName) {
            var sUri = "sap-icon://Fiori2/F0002",
                nr,
                that,
                names;
            if (IconPool.getIconCollectionNames().indexOf(sCollectionName) < 0) {
                // in the noshell use case, the icon collections are not registered
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
            this.renderIcons("Fiori2");
            this.renderIcons("Fiori3");
            this.renderIcons("Fiori4");
            this.renderIcons("Fiori5");
            this.renderIcons("Fiori6");
            this.renderIcons("Fiori7");
            this.renderIcons("Fiori8");
            this.renderIcons("BusinessSuiteInAppSymbols");
            this.renderIcons("FioriInAppIcons");
            this.renderIcons("FioriNonNative");
        },

        /**
        * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
        * (NOT before the first rendering! onInit() is used for that one!).
        * @memberof view.Detail
        */
        // onBeforeRendering: function() {
        //
        // },

        getRouter: function () {
            return UIComponent.getRouterFor(this);
        },

        handleBtn1Press: function () {
            this.getRouter().navTo("toView1");
        },

        handleBtn2Press: function () {
            this.getRouter().navTo("toDetail");
        }
    });
});
