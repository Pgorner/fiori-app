// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview API facade for the DWS work page builder for usage in design-time.
 */
sap.ui.define([
    "sap/ushell/utils/workpage/WorkPageVizInstantiation",
    "sap/base/util/extend"
], function (
    WorkPageVizInstantiation,
    extend
) {
    "use strict";

    /**
     * @alias sap.ushell.api.workpage.Designtime
     * @class
     * @classdesc Design-time API Facade for work page builder.
     *
     * This class <b>MAY</b> be used in a standalone context, i.e. it does <b>not</b>
     * require a bootstrap of the unified shell container.
     *
     * @hideconstructor
     *
     * @since 1.121.0
     * @private
     * @ui5-restricted dws-packages
     */
    class Designtime {

        static #instance;

        _oWorkPageVizInstantiation;
        _bPreviewMode;

        /**
         * Returns the singleton instance of the Designtime API.
         * @returns {Promise<sap.ushell.api.workpage.Designtime>} A promise that resolves with the designtime instance.
         *
         * @since 1.121.0
         * @private
         * @ui5-restricted dws-packages
         */
        static async getInstance () {
            if (!Designtime.#instance) {
                const oWorkPageVizInstantiation = await WorkPageVizInstantiation.getInstance();
                Designtime.#instance = new Designtime(oWorkPageVizInstantiation);
            }

            return Designtime.#instance;
        }

        constructor (oWorkPageVizInstantiation) {
            this._oWorkPageVizInstantiation = oWorkPageVizInstantiation;
            this._bPreviewMode = true;
        }

        /**
         * @typedef {object} sap.ushell.api.workpage.Designtime.VizData
         * The visualization data as defined in the content API.
         *
         * @property {string} id The visualization id.
         * @property {string} type The visualization type.
         * @property {object} descriptor The visualization descriptor.
         * @property {object} descriptorResources The visualization descriptor resources.
         *
         * @private
         * @ui5-restricted dws-packages
         */

        /**
         * Creates a new visualization instance.
         *
         * @param {sap.ushell.api.workpage.Designtime.VizData} oVizData The visualization data as defined in the content API.
         * @returns {object} a visualization control instance.
         *
         * @since 1.121.0
         * @private
         * @ui5-restricted dws-packages
         */
        createVizInstance (oVizData) {
            const oExtendedVizData = extend({}, oVizData, {
                preview: this._bPreviewMode
            });
            return this._oWorkPageVizInstantiation.createVizInstance(oExtendedVizData);
        }

        /**
         * Creates a new tile card configuration.
         *
         * @param {sap.ushell.api.workpage.Designtime.VizData} oVizData The visualization data as defined in the content API.
         * @returns {object} a card configuration.
         *
         * @see sap.ushell.utils.tilecard.TileCard#TileCardConfiguration
         * @since 1.123.0
         * @private
         * @ui5-restricted dws-packages
         */
        createTileCardConfiguration (oVizData) {
            const oExtendedVizData = extend({}, oVizData, {
                preview: this._bPreviewMode
            });
            return this._oWorkPageVizInstantiation.createTileCardConfiguration(oExtendedVizData);
        }
    }

    return Designtime;
});
