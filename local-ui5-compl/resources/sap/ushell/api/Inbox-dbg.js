// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @file Utility functions for the My Inbox app.
 */
sap.ui.define([
    "sap/ushell/api/common/ComponentInstantiation"
], function (
    ComponentInstantiation
) {
    "use strict";

    /**
     * @alias sap.ushell.api.Inbox
     * @namespace
     * @description The My Inbox app needs to instantiate app components based on intents
     *   for which this API provides utility functions.
     *
     * @since 1.128.0
     * @private
     * @ui5-restricted cross.fnd.fiori.inbox
     */
    class Inbox {

        /**
         * Resolves a given navigation intent (if valid) and returns the respective component instance for further processing.
         *
         * @param {string} sIntent Semantic object and action as a string with a "#" as prefix
         * @param {object} [oComponentData={}] The componentData relevant for this component.
         *   <b>Note:</b> Please don't pass <code>startupParameters</code>, <code>config</code>
         *   and <code>["sap-xapp-state"]</code>
         * @param {sap.ui.core.Component} [oOwnerComponent] If specified, the created component will be called within the context of the oOwnerComponent
         *    (via oOwnerComponent.runAsOwner(fn))
         * @returns {Promise<sap.ui.core.Component>} A promise resolving the component instance.
         *
         * @since 1.128.0
         * @private
         * @ui5-restricted cross.fnd.fiori.inbox
         */
        async createComponentInstance (sIntent, oComponentData, oOwnerComponent) {
            return ComponentInstantiation.createComponentInstance(sIntent, oComponentData, oOwnerComponent);
        }

        /**
         * Resolves a given navigation intent (if valid) and returns the respective component data only for further processing.
         *
         * @param {string} sIntent Semantic object and action as a string with a "#" as prefix
         * @param {sap.ushell.services.Ui5ComponentLoader.ComponentData} [oComponentData] The componentData relevant for this component.
         *   <b>Note:</b> Please don't pass <code>startupParameters</code>, <code>config</code>
         *   and <code>["sap-xapp-state"]</code>
         * @returns {Promise<sap.ushell.services.Ui5ComponentLoader.ComponentData>} A promise resolving the instantiation data for the component.
         *
         * @since 1.128.0
         * @private
         * @ui5-restricted cross.fnd.fiori.inbox
         */
        async createComponentInstantiationData (sIntent, oComponentData) {
            return ComponentInstantiation.createComponentInstantiationData(sIntent, oComponentData);
        }
    }

    return new Inbox();
});
