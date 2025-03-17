declare module "sap/cux/home/InsightsCardsSettingsPanel" {
    import BaseSettingsPanel from "sap/cux/home/BaseSettingsPanel";
    interface IContext {
        cardId?: string;
    }
    /**
     *
     * Class for My Home Insights Cards Settings Panel.
     *
     * @extends BaseSettingsPanel
     *
     * @author SAP SE
     * @version 0.0.1
     * @since 1.121
     *
     * @internal
     * @experimental Since 1.121
     * @private
     *
     * @alias sap.cux.home.InsightsCardsSettingsPanel
     */
    export default class InsightsCardsSettingsPanel extends BaseSettingsPanel {
        private eventAttached;
        private manageCardsInstance;
        /**
         * Init lifecycle method
         *
         * @public
         * @override
         */
        init(): void;
        /**
         * Returns the content for the Insights Cards Settings Panel.
         *
         * @private
         * @returns {Control} The control containing the Insights Cards Settings Panel content.
         */
        private _getContent;
    }
}
//# sourceMappingURL=InsightsCardsSettingsPanel.d.ts.map