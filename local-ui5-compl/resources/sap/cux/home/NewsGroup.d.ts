declare module "sap/cux/home/NewsGroup" {
    import type { MetadataOptions } from "sap/ui/core/Element";
    import BaseNewsItem from "sap/cux/home/BaseNewsItem";
    import { $NewsGroupSettings } from "sap/cux/home/NewsGroup";
    /**
     *
     * Class for managing and storing News Group items.
     *
     * @extends sap.cux.home.BaseNewsItem
     *
     * @author SAP SE
     * @version 0.0.1
     * @since 1.121
     *
     * @internal
     * @experimental Since 1.121
     * @private
     *
     * @alias sap.cux.home.NewsGroup
     */
    export default class NewsGroup extends BaseNewsItem {
        private oNewsGroupDialog;
        private oNewsGroupImage;
        private oNewsList;
        constructor(idOrSettings?: string | $NewsGroupSettings);
        constructor(id?: string, settings?: $NewsGroupSettings);
        static readonly metadata: MetadataOptions;
        /**
         * Init lifecycle method
         *
         * @private
         * @override
         */
        init(): void;
        /**
         * Handles the press event on the news item, opens the dialog.
         * @returns {void}
         */
        private pressNewsItem;
        /**
         * Opens the dialog for news details
         * @returns {Promise<void>}
         */
        private openNewsGroupDialog;
        /**
         * Iterate through the provided news details data and loads the news items
         * @param {ICustomNewsFeed[]} aNewsDetails array of news items to be shown in the list
         * @returns {void}
         */
        private loadNewsDetails;
        /**
         * Generates the custom list item templates for the news details
         * @param {ICustomNewsFeed} oItem news feed item for binding the template
         * @param {number} i index of the item
         * @returns {CustomListItem} the template of list item to be shown in the dialog
         */
        private generateNewsListTemplate;
        /**
         * Creates the dialog which contains the news detail items
         * @returns {void}
         */
        private createNewsGroupDialog;
        /**
         * Closes the news details dialog
         * @returns {void}
         */
        private closeNewsGroupDialog;
        /**
         * Handles the click on the show more button of news detail items in news group dialog
         * @param {Event} oEvent
         * @returns {void}
         */
        private handleShowNewsFeedDetails;
    }
}
//# sourceMappingURL=NewsGroup.d.ts.map