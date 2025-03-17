// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @file Utility functions for the Copilot.
 */
sap.ui.define([
    "sap/ushell/api/common/ComponentInstantiation"
], function (
    ComponentInstantiation
) {
    "use strict";

    /**
     * @alias sap.ushell.api.Copilot
     * @namespace
     * @description The Copilot needs to instantiate app components based on intents
     *   for which this API provides utility functions.
     *
     * @since 1.129.0
     * @private
     * @ui5-restricted sap.cp.ui
     */
    class Copilot {

        /**
         * Resolves a given navigation intent (if valid) and returns the respective component instance for further processing.
         *
         * @param {string} sIntent Semantic object and action as a string with a "#" as prefix
         * @returns {Promise<sap.ui.core.Component>} A promise resolving the component instance.
         *
         * @since 1.129.0
         * @private
         * @ui5-restricted sap.cp.ui
         */
        async createComponentInstance (sIntent) {
            return ComponentInstantiation.createComponentInstance(sIntent);
        }

    }

    return new Copilot();
});
