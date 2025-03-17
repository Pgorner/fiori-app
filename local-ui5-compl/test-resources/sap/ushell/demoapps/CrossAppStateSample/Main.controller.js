// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/IconPool",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (
    IconPool,
    Controller,
    JSONModel
) {
    "use strict";

    /**
     * Builds the table rows for the given icon names and returns them in an array.
     *
     * @param {string} sCollectionName The collection or category name of the icons
     * @param {int} nIdxStart You can pass the start index for the rows
     * @returns {string[]} Returns the prepared table rows for the given collection name
     * @private
     */
    function buildTableRowsForCollectionName (sCollectionName, nIdxStart) {
        var oRes = [];
        // Names of the icons for one icon collection/category (e.g. 'undefined', 'Fiori2')
        var sIconNames = IconPool.getIconNames(sCollectionName);
        if (sIconNames) {
            sIconNames.forEach(function (sIconName, nIdx) {
                var sUri = "sap-icon://" + sCollectionName + "/" + sIconName;
                oRes.push({ key: sUri, index: nIdx + nIdxStart, collectionName: sCollectionName }); //JSON
            });
        }
        return oRes;
    }

    /**
     * Prepares the build of table rows by given collection name.
     *
     * @param {string} sCollectionName Name of icon collection/category (e.g. 'undefined', 'Fiori2')
     * @param {string} sFilter Prepared table rows will be filtered by this value
     * @returns {string[]} Returns the prepared table rows for the given collection name
     * @private
     */
    function generateTableRowsByFilter (sCollectionName, sFilter) {
        var aRes = [];
        if (sCollectionName === "Show All") {
            var aAllCollectionNames = IconPool.getIconCollectionNames();
            aAllCollectionNames.forEach(function (sName) {
                // Array.push.apply because we have to concat JSON objects
                Array.prototype.push.apply(aRes, buildTableRowsForCollectionName(sName, aRes.length + 1));
            });
        } else {
            Array.prototype.push.apply(aRes, buildTableRowsForCollectionName(sCollectionName, aRes.length + 1));
        }
        // filter result
        sFilter.split(" ").forEach(function (sFilterElement) {
            aRes = aRes.filter(function (obj) {
                return obj.key.indexOf(sFilterElement) >= 0;
            });
        });
        return aRes;
    }

    return Controller.extend("sap.ushell.demo.CrossAppStateSample.Main", {
        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         * @memberof Main
         */
        onInit: function () {
            var oComponentModel = this.getMyComponent().getModel("AppState");
            oComponentModel.bindProperty("/appState/CollectionName").attachChange(function () {
                var sCollectionName = oComponentModel.getProperty("/appState/CollectionName");
                var sFilter = oComponentModel.getProperty("/appState/filter");
                this.oModel = new JSONModel({ icons: generateTableRowsByFilter(sCollectionName, sFilter) });
                this.getView().setModel(this.oModel);
            }.bind(this));
            this.getView().setModel(this.oModel);
        },

        getMyComponent: function () {
            return this.getOwnerComponent();
        }
    });
});
