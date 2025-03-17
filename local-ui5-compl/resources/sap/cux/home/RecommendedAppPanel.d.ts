declare module "sap/cux/home/RecommendedAppPanel" {
    import VBox from "sap/m/VBox";
    import type { MetadataOptions } from "sap/ui/core/Element";
    import BaseAppPersPanel, { $BaseAppPersPanelSettings } from "sap/cux/home/BaseAppPersPanel";
    const CONSTANTS: {
        USER_PREFERENCE_SRVC_URL: string;
        KEY: string;
    };
    /**
     *
     * Provides the RecommendedAppPanel Class.
     *
     * @extends sap.cux.home.BaseAppPersPanel
     *
     * @author SAP SE
     * @version 0.0.1
     * @since 1.128.0
     *
     * @private
     * @experimental
     * @hidden
     *
     * @alias sap.cux.home.RecommendedAppPanel
     */
    export default class RecommendedAppPanel extends BaseAppPersPanel {
        static readonly metadata: MetadataOptions;
        constructor(id?: string, settings?: $BaseAppPersPanelSettings);
        init(): void;
        /**
         * Overrides the wrapper for the apps panel to add message strip.
         *
         * @private
         * @returns {sap.m.VBox} The apps panel wrapper.
         */
        protected _generateWrapper(): VBox;
        /**
         * Fetch recommended apps and set apps aggregation
         * @private
         */
        loadApps(): Promise<void>;
        /**
         * Returns message strip for recommended tab
         * @private
         * @returns {sap.cux.home.MessageStrip} - Message strip control.
         */
        private _generateMessageStrip;
        /**
         * Returns list of actions available for selected app
         * @private
         * @returns {sap.cux.home.MenuItem[]} - Array of list items.
         */
        private _getActions;
        /**
         * Rejects the selected app as recommendation
         * @private
         * @param {sap.ui.base.MenuItem$PressEvent} event - Event object.
         */
        private _rejectRecommendation;
        /**
         * Checks if recommendation is enabled based on recommendation feature toggle and user personalization.
         * @private
         * @returns {Boolean} - Returns true if recommendation is enabled otherwise false.
         */
        private _isRecommendationEnabled;
        /**
         * Show recommendation tab if recommendation is enabled
         * @private
         */
        private _enableRecommendationTab;
        /**
         * Generates illustrated message for recommended apps panel.
         * @private
         * @override
         * @returns {sap.m.IllustratedMessage} Illustrated error message.
         */
        protected generateIllustratedMessage(): import("sap/m/IllustratedMessage").default;
    }
}
//# sourceMappingURL=RecommendedAppPanel.d.ts.map