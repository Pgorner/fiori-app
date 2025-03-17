sap.ui.define([
    "sap/base/util/ObjectPath",
    "sap/suite/ui/generic/template/genericUtilities/FeLogger",
    "sap/suite/ui/generic/template/manifestMerger/MergerUtil"
], function(ObjectPath,FeLogger, MergerUtil) {
    "use strict";
    var oLogger = new FeLogger("manifestMerger.ChangePageConfiguration").getLogger();

    /**
    * This class holds the function which will be invoked from the flex layer when the manifest.appdescr_variant has
    * the changeType "appdescr_ui_generic_app_changePageConfiguration" to extend the Manifest settings
    * @namespace sap.suite.ui.generic.template.manifestMerger.ChangePageConfiguration
    * @private
    */

    /**
     * @typedef {Object} ChangeContent
     *
     * @property {object} parentPage - The parent page details
     * @property {string} parentPage.component - The source page component where the new page will be added
     * @property {string} parentPage.entitySet - The source page entityset name where the new page will be added
     *
     * @property {object} entityPropertyChange - The details of the configuration to be changed
     * @property {string} entityPropertyChange.propertyPath - The property path where the change has to be added
     * @property {string} entityPropertyChange.operation - The operation type
     * @property {object} entityPropertyChange.propertyValue - The property details that has to be modified
     *
     */

    /**
     * @typedef {Object} Change
     * @property {string} changeType - The app descriptor change type name
     * @property {string} layer - The target layer, can have values "CUSTOMER", "CUSTOMER_BASE", "PARTNER" or "VENDOR"
     * @property {() => ChangeContent} getContent - The content of the change
     */
    var GLOBAL_MANIFEST_CHANGE_COMPONENT = "sap.suite.ui.generic.template";
    var changePageConfiguration = {
        /**
         * @param {object} oManifest - Contains the existing Manifest of the application
         * @param {Change} oChange - Contains the setting changes that the user wants to add to the oManifest
         * The oChange for changePageConfiguration should have the following structure:
         * @example
         * {
         *      "changeType": "appdescr_ui_generic_app_changePageConfiguration", // the app descriptor change type name
         *      "layer": Layer.CUSTOMER, // The target layer, can have values  "CUSTOMER" , "CUSTOMER_BASE", "PARTNER" or "VENDOR"
         *      "content": {
         *          "parentPage" : { // source page details
         *              "component": "sap.suite.ui.generic.template.ObjectPage", // source page component where the new page will be added
         *              "entitySet": "C_STTA_SalesOrder_WD_20" // source page entityset name where the new page will be added
         *          },
         *          "entityPropertyChange": { // details of the configuration to be changed
         *              "propertyPath": "component/settings", // property path where the change has to be added
         *              "operation": "UPSERT", // operation type
         *              "propertyValue": { // contains the property details that has to be modified
         *                  "tableType": "ResponsiveTable"
         *              }
         *          }
         *      }
         *  }
         *
         * @example
         * {
         *      "changeType": "appdescr_ui_generic_app_changePageConfiguration", // the app descriptor change type name
         *      "layer": Layer.VENDOR, // The target layer, can have values  "CUSTOMER" , "CUSTOMER_BASE", "PARTNER" or "VENDOR"
         *      "content": {
         *          "parentPage" : { // source page details
         *              "component": "sap.suite.ui.generic.template", // This is the global manifest change
         *          },
         *          "entityPropertyChange": { // details of the configuration to be changed
         *              "propertyPath": "settings", // property path where the change has to be added
         *              "operation": "UPSERT", // operation type
         *              "propertyValue": { // contains the property details that has to be modified
         *                  "statePreservationMode": "persistence"
         *              }
         *          }
         *      }
         *  }
         *
         * @returns {object} the updated oManifest containing the oChange settings
         * @protected
         */
        applyChange:  function(oManifest, oChange) {
            oLogger.info("modifyPageConfiguration use case");
            var oChangeContent = oChange.getContent();
            MergerUtil.consistencyCheck(oChangeContent, "MODIFY");
            var sParentEntitySet = oChangeContent.parentPage.entitySet;
            var sParentComponent = oChangeContent.parentPage.component;
            var oPageStructure;
            if (sParentComponent === GLOBAL_MANIFEST_CHANGE_COMPONENT) {
                oPageStructure = oManifest["sap.ui.generic.app"];
            } else {
                oPageStructure = MergerUtil.iterateAndFind(oManifest["sap.ui.generic.app"], sParentEntitySet, sParentComponent);
            }
            var oPropertyChange = oChangeContent.entityPropertyChange;
            if (typeof oPropertyChange.propertyValue !== "object" || oPropertyChange.propertyValue === null || Array.isArray(oPropertyChange.propertyValue)) {
                var aPropertyPath = oPropertyChange.propertyPath.split("/");
                ObjectPath.set(aPropertyPath, oPropertyChange.propertyValue, oPageStructure);
            } else {
                var aPropertyKeys = Object.keys(oPropertyChange.propertyValue);
                aPropertyKeys.forEach(function (sCurrentKey) {
                    var aPropertyPath = oPropertyChange.propertyPath.split("/");
                    aPropertyPath.push(sCurrentKey);
                    var vVal = ObjectPath.get(aPropertyPath, oPageStructure);
                    if (vVal && typeof vVal === "object") {
                        var oPropertyPathContent = ObjectPath.create(aPropertyPath, oPageStructure);
                        Object.assign(oPropertyPathContent, oPropertyChange.propertyValue[sCurrentKey]);
                    } else {
                        ObjectPath.set(aPropertyPath, oPropertyChange.propertyValue[sCurrentKey], oPageStructure);
                    }
                });
            }
            return oManifest;
        }
     };
     return changePageConfiguration;
});
