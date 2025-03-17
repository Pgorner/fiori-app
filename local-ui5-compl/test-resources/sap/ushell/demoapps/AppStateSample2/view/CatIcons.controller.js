// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/ui/core/IconPool",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], (
    Log,
    IconPool,
    Controller,
    JSONModel
) => {
    "use strict";

    /**
     * Prepares the build of table rows by given collection name.
     *
     * @param {string} sSelectedCollectionName Name of icon collection/category (e.g. "undefined", "Fiori2", etc)
     * @returns {string[]} Returns the prepared table rows for the given collection name
     * @private
     */
    function buildTableRows (sSelectedCollectionName) {
        const aCollectionNames = (sSelectedCollectionName === "Show All") ? IconPool.getIconCollectionNames() : [sSelectedCollectionName];
        return aCollectionNames.reduce(
            (aAccumulator, sCollectionName) => aAccumulator.concat(
                IconPool.getIconNames(sCollectionName).map((sIconName, iIconIndex) => ({
                    key: `sap-icon://${sCollectionName}/${sIconName}`,
                    index: aAccumulator.length + iIconIndex + 1,
                    collectionName: sCollectionName
                }))
            ),
            []
        );
    }

    function loadTableRows (oModel, oAppStateModel) {
        const sFilter = oAppStateModel.getProperty("/appState/filter") || "";
        Log.info(`updateAppStateModel ... ${sFilter}`);
        oModel.setProperty("/icons", buildTableRows(oAppStateModel.getProperty("/appState/CollectionName")).filter(
            (oIcon) => oIcon.key.includes(sFilter.trim())
        ));
    }

    return Controller.extend("sap.ushell.demo.AppStateSample2.view.CatIcons", {
        onInit: function () {
            const oAppStateModel = this.getOwnerComponent().getModel("AppState");
            this.oModel = new JSONModel();
            this.oModel.setSizeLimit(Infinity);
            this.getView().setModel(this.oModel);
            this.getView().byId("search").attachLiveChange((oEvent) => {
                Log.info(`liveChange ... ${oAppStateModel.getProperty("/appState/filter")}`);
                oAppStateModel.setProperty("/appState/filter", oEvent.getParameter("newValue"));
            });

            // preload icon collections with an arbitrary icon, otherwise "IconPool.getIconCollectionNames()" does not return them
            IconPool.getIconInfo("icon-heart", "BusinessSuiteInAppSymbols", "sync");
            IconPool.getIconInfo("technicalsystem", "SAP-icons-TNT", "sync");
            IconPool.getIconInfo("technicalsystem", "TNTIcons", "sync"); // legacy name

            loadTableRows(this.oModel, oAppStateModel);

            // Register event handler for collection change
            // This takes place when user selects category and respective list Item Press handler changes AppState Model's collection name
            oAppStateModel.bindProperty("/appState/CollectionName").attachChange(() => {
                loadTableRows(this.oModel, oAppStateModel);
            });

            oAppStateModel.bindProperty("/appState/filter").attachChange(() => {
                loadTableRows(this.oModel, oAppStateModel);
                // This navTo is needed to obtain the sap-iapp-state in the browser URL to be able to
                // get the current filter applied immediately when using the URL with this app state
                this.getOwnerComponent().navTo("toCatIcons");
            });
        }
    });
});
