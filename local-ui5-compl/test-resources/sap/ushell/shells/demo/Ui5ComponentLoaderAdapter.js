// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview The UI5 component loader adapter for the demo platform.
 *
 * @version 1.132.1
 */
sap.ui.define([
    "sap/base/util/ObjectPath",
    "sap/ushell/UI5ComponentType"
], function (ObjectPath, UI5ComponentType) {
    "use strict";

    /**
     * This demo adapter allows to modify every UI5 component property instantiated by FLP.
    */
    var Ui5ComponentLoaderAdapter = function () {
        /**
         * modifies any UI5 component property except component_data
         * if this is changed it will be overwritten
         * @param {object} oComponentProperties The component properties
         * @param {string} sUI5ComponentType Type used to define the type of loading a ui5component by FLP
         * @returns {object} Promise A promise that resolves with the modified oComponentProperties
         */
        this.modifyComponentProperties = function (oComponentProperties, sUI5ComponentType) {
            if (sUI5ComponentType === UI5ComponentType.Visualization) {
                if (oComponentProperties.componentData) {
                    delete oComponentProperties.componentData;
                }
                var oCustomManifest = ObjectPath.get(
                    [
                        "manifest",
                        "custom.namespace.of.tile"
                    ],
                    oComponentProperties
                ) || {};
                if (oCustomManifest.addImage) {
                    oCustomManifest.backgroundImageRelativeToComponent = "custom_tile_2.png";
                }
            }
            return Promise.resolve(oComponentProperties);
        };
    };
    return Ui5ComponentLoaderAdapter;
}, /* bExport */ true);
