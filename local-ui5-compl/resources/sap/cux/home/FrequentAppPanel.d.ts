declare module "sap/cux/home/FrequentAppPanel" {
    import type { MetadataOptions } from "sap/ui/core/Element";
    import BaseAppPersPanel, { $BaseAppPersPanelSettings } from "sap/cux/home/BaseAppPersPanel";
    /**
     *
     * Provides the class for managing frequent apps.
     *
     * @extends sap.cux.home.BaseAppPersPanel
     *
     * @author SAP SE
     * @version 0.0.1
     * @since 1.121.0
     *
     * @internal
     * @experimental Since 1.121
     * @public
     *
     * @alias sap.cux.home.FrequentAppPanel
     */
    export default class FrequentAppPanel extends BaseAppPersPanel {
        static readonly metadata: MetadataOptions;
        /**
         * Constructor for a new frequent app panel.
         *
         * @param {string} [id] ID for the new control, generated automatically if an ID is not provided
         * @param {object} [settings] Initial settings for the new control
         */
        constructor(id?: string, settings?: $BaseAppPersPanelSettings);
        init(): void;
        /**
         * Fetch frequent apps and set apps aggregation
         * @private
         */
        loadApps(): Promise<void>;
        /**
         * Returns list of frequent apps
         * @private
         * @returns {object[]} - Array of frequent apps.
         */
        private _getFrequentVisualizations;
        /**
         * Returns list of actions available for selected app
         * @private
         * @param {boolean} isAppAddedInFavorite - true if app is already present in favorite, false otherwise.
         * @returns {sap.cux.home.MenuItem[]} - Array of list items.
         */
        private _getActions;
        /**
         * Generates illustrated message for frequent apps panel.
         * @private
         * @override
         * @returns {sap.m.IllustratedMessage} Illustrated error message.
         */
        protected generateIllustratedMessage(): import("sap/m/IllustratedMessage").default;
    }
}
//# sourceMappingURL=FrequentAppPanel.d.ts.map