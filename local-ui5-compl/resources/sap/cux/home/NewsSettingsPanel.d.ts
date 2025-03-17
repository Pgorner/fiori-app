declare module "sap/cux/home/NewsSettingsPanel" {
    import BaseSettingsPanel from "sap/cux/home/BaseSettingsPanel";
    /**
     *
     * Class for My Home News Settings Panel.
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
     * @alias sap.cux.home.NewsSettingsPanel
     */
    export default class NewsSettingsPanel extends BaseSettingsPanel {
        private oShowSwitch;
        private oList;
        private oPersonalizer;
        private oNewsPanel;
        private aFavNewsFeed;
        /**
         * Init lifecycle method
         *
         * @public
         * @override
         */
        init(): void;
        /**
         * Returns the content for the News Settings Panel.
         *
         * @private
         * @returns {Control} The control containing the News Settings Panel content.
         */
        private getContent;
        /**
         * Get personalization instance
         */
        private getPersonalization;
        /**
         * Returns the content for the News Settings Panel Header.
         *
         * @private
         * @returns {sap.ui.core.Control} The control containing the News Settings Panel's Header content.
         */
        private setHeader;
        /**
         * Returns the content for the News Settings Panel Title description.
         *
         * @private
         * @returns {sap.ui.core.Control} The control containing the News Settings Panel's Title description.
         */
        private setTitleMessage;
        /**
         * Returns the content for the news List
         *
         * @private
         * @returns {sap.ui.core.Control} The control containing the News Settings Panel's List
         */
        private setNewsList;
        /**
         *
         * Saves news feed settings and shows news feed based on selection change of list of switch
         *
         * @private
         */
        private saveNewsFeedSettings;
        /** Set items for the NewsList
         * @param {Array} [aItems] news items to be set as items aggregation
         * @private
         */
        private setItems;
        /**
         * Loads news feed settings
         *
         * @returns {Promise} resolves to news feed settings
         */
        private loadNewsFeedSettings;
    }
}
//# sourceMappingURL=NewsSettingsPanel.d.ts.map