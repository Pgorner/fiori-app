// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/ActionSheet",
    "sap/m/Button",
    "sap/m/Bar",
    "sap/ui/core/Component",
    "sap/ui/core/mvc/Controller",
    "sap/ushell/ui/footerbar/AddBookmarkButton",
    "sap/ushell/ui/footerbar/JamDiscussButton",
    "sap/ushell/ui/footerbar/JamShareButton",
    "sap/m/library"

], function (ActionSheet, Button, Bar, Component, Controller, AddBookmarkButton, JamDiscussButton, JamShareButton, mLibrary) {
    "use strict";

    // shortcut for sap.m.PlacementType
    var PlacementType = mLibrary.PlacementType;

    return Controller.extend("sap.ushell.demo.AppStateFormSample.view.MasterPanel", {
        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         * @memberof view.List
         */
        onInit: function () {
            var oPage = this.oView.getContent()[0];
            var oActionSheet,
                oActionsButton;

            oPage.setShowFooter(true);
            oActionSheet = new ActionSheet({ placement: PlacementType.Top });
            oActionSheet.addButton(new JamDiscussButton());
            oActionSheet.addButton(new JamShareButton());
            oActionSheet.addButton(new AddBookmarkButton());
            oActionsButton = new Button({
                press: function () {
                    oActionSheet.openBy(this);
                },
                icon: "sap-icon://action"
            });
            oPage.setFooter(new Bar({
                contentRight: oActionsButton
            }));
        },

        getMyComponent: function () {
            return this.getOwnerComponent();
        },

        handleDefaultDetailPress: function () {
            this.getMyComponent().navTo("toDetail");
        },

        handleBtn1Press: function () {
            this.getMyComponent().navTo("displayIcon");
        },

        handleBtn2Press: function () {
            this.getMyComponent().navTo("IconFavoriteList");
        }
    });
});
