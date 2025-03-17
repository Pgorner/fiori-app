// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([], function () {
    "use strict";

    const aSearchTermPaths = [
        "descriptor|value|sap.app|id",
        "descriptor|value|sap.app|title",
        "descriptor|value|sap.app|subTitle",
        "descriptor|value|sap.fiori|registrationsIds"
    ];

    const sTypePath = "type";

    /**
     * @param {object} object The object
     * @param {string} path The path separated by '|'
     * @param {*} defaultValue Default value in case nothing is found
     * @returns {*} The value of the accessed property
     */
    function resolvePath (object, path, defaultValue) {
         return path
            .split("|")
            .reduce((o, p) => o ? o[p] : defaultValue, object);
    }

    /**
     * @param {object} visualizationData The visualizations object. See ushell-lib/src/test/js/sap/ushell/OPA/testSiteData/ContentFinder/ContentFinderVisualizations.js for structure
     * @param {string[]} types Array of strings describing the types
     * @param {string} searchTerm Array of objects containing the property path and filter term
     * @returns {object} The filtered visualizations object.
     */
    function filterVisualizations (visualizationData, types, searchTerm) {
        let oResult = {
            visualizations: {
                totalCount: null,
                nodes: []
            }
        };

        visualizationData.visualizations.nodes.forEach((visualization) => {
            if (!types.includes(visualization[sTypePath])) {
                return;
            } else if (!searchTerm) {
                oResult.visualizations.nodes.push(visualization);
                return;
            }

            aSearchTermPaths.forEach((searchTermPath) => {
                if (!oResult.visualizations.nodes.includes(visualization) && resolvePath(visualization, searchTermPath) && resolvePath(visualization, searchTermPath).includes(searchTerm)) {
                    oResult.visualizations.nodes.push(visualization);
                }
            });
        });

        oResult.visualizations.totalCount = oResult.visualizations.nodes.length;
        return oResult;
    }

    return {
        filterVisualizations: filterVisualizations
    };
});
