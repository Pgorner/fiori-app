// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview API facade for the DWS work page builder for usage in Runtime.
 */
sap.ui.define([
    "./Designtime",
    "sap/ushell/utils/workpage/WorkPageVizInstantiation",
    "sap/ushell/utils/workpage/WorkPageService",
    "sap/ushell/utils/workpage/WorkPageHost",
    "sap/ushell/EventHub"
], function (
    Designtime,
    WorkPageVizInstantiation,
    WorkPageService,
    WorkPageHost,
    EventHub
) {
    "use strict";


    /**
     * @alias sap.ushell.api.workpage.Runtime
     * @class
     * @classdesc Runtime API Facade for work page builder.
     *
     * This class <b>MUST</b> only be used in a running unified shell context, i.e. only after the unified shell
     * container has been initialized.
     *
     * @hideconstructor
     * @augments sap.ushell.api.workpage.Designtime
     *
     * @since 1.121.0
     * @private
     * @ui5-restricted dws-packages
     */
    class Runtime extends Designtime {

        static #instance;

        _oWorkPageService;

        /**
         * Returns the singleton instance of the Runtime API.
         * @returns {Promise<sap.ushell.api.workpage.Runtime>} A promise that resolves with the runtime instance.
         *
         * @since 1.121.0
         * @private
         * @ui5-restricted dws-packages
         */
        static async getInstance () {
            if (!Runtime.#instance) {
                const oWorkPageVizInstantiation = await WorkPageVizInstantiation.getInstance();
                Runtime.#instance = new Runtime(oWorkPageVizInstantiation, new WorkPageService());
            }

            return Runtime.#instance;
        }

        constructor (oWorkPageVizInstantiation, oWorkPageService) {
            super(oWorkPageVizInstantiation);
            this._oWorkPageService = oWorkPageService;
            this._bPreviewMode = false;
        }

        /**
         * @typedef {object} sap.ushell.api.workpage.Runtime.SiteData
         * Additional visualization properties retrieved from the CDM Runtime Site
         *
         * @property {object} [target] The harmonized navigation target of the visualization
         * @property {string} [targetURL] The target URL of the visualization
         * @property {object} [dataSource] The data source for the indicator data source of the visualization
         * @property {string} [contentProviderId] The content provider id of the visualization
         *
         * @private
         * @ui5-restricted dws-packages
         */

        /**
         * @typedef {object} sap.ushell.api.workpage.Runtime.ExtendedVisualization
         * An extension of a visualization retrieved from the content API
         *
         * @property {string} id The id of the visualization
         * @property {string} type The type of the visualization
         * @property {object} descriptor The descriptor of the visualization
         * @property {object} descriptorResources The descriptor resources of the visualization
         * @property {sap.ushell.api.workpage.Runtime.SiteData} [_siteData] The additional app properties retrieved from the CDM Runtime Site
         *
         * @private
         * @ui5-restricted dws-packages
         */

        /**
         * Load the WorkPage data for the given page id and the visualizations used on that WorkPage.
         * Additionally, lookup the corresponding target app in the CDM runtime site and add data from the
         * app in the <code>_siteData</code> property.
         *
         * @param {string} sPageId The WorkPage id.
         * @returns {Promise<{ workPage: { usedVisualizations: { nodes: sap.ushell.api.workpage.Runtime.ExtendedVisualization[] }, editable: boolean } }>}
         *  A promise resolving with the loaded work page and visualizations, enhanced with app data retrieved from the CDM Runtime Site.
         *
         * @private
         * @ui5-restricted dws-packages
         */
        fetchPageData (sPageId) {
            return this._oWorkPageService.loadWorkPageAndVisualizations(sPageId, true);
        }

        /**
         * Event that should be fired after the content for the first page has been added.
         * This will trigger loading of lazy shell components like menu bar, user settings, search, ...
         *
         * @private
         * @ui5-restricted dws-packages
         */
        fireAfterContentAdded () {
            EventHub.emit("CenterViewPointContentRendered");
        }

        /**
         * Creates a new work page host instance.
         *
         * @param {string} sId the ID of the host.
         * @param {object} [mSettings] the settings of the host instance.
         * @returns {sap.ui.integration.Host} a new work page host instance.
         *
         * @private
         * @ui5-restricted dws-packages
         */
        createHost (sId, mSettings) {
            return new WorkPageHost(sId, mSettings);
        }
    }

    return Runtime;
});
