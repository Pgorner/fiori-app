declare module "sap/cux/home/NewsGroup" {
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import NewsItem from "sap/cux/home/NewsItem";
import { AggregationBindingInfo } from "sap/ui/base/ManagedObject";
import { $BaseNewsItemSettings } from "./BaseNewsItem";

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $NewsGroupSettings extends $BaseNewsItemSettings {

        /**
         * newsItems aggregation of the news. These items will be shown in a dialog on click of the news
         */
        newsItems?: NewsItem[] | NewsItem | AggregationBindingInfo | `{${string}}`;
    }

    export default interface NewsGroup {

        // aggregation: newsItems

        /**
         * Gets content of aggregation "newsItems".
         *
         * newsItems aggregation of the news. These items will be shown in a dialog on click of the news
         */
        getNewsItems(): NewsItem[];

        /**
         * Adds some newsItem to the aggregation "newsItems".
         *
         * newsItems aggregation of the news. These items will be shown in a dialog on click of the news
         *
         * @param newsItem The newsItem to add; if empty, nothing is inserted
         * @returns Reference to "this" in order to allow method chaining
         */
        addNewsItem(newsItems: NewsItem): this;

        /**
         * Inserts a newsItem into the aggregation "newsItems".
         *
         * newsItems aggregation of the news. These items will be shown in a dialog on click of the news
         *
         * @param newsItem The newsItem to insert; if empty, nothing is inserted
         * @param index The "0"-based index the newsItem should be inserted at; for
         *              a negative value of "iIndex", the newsItem is inserted at position 0; for a value
         *              greater than the current size of the aggregation, the newsItem is inserted at
         *              the last position
         * @returns Reference to "this" in order to allow method chaining
         */
        insertNewsItem(newsItems: NewsItem, index: number): this;

        /**
         * Removes a newsItem from the aggregation "newsItems".
         *
         * newsItems aggregation of the news. These items will be shown in a dialog on click of the news
         *
         * @param newsItem The newsItem to remove or its index or id
         * @returns The removed newsItem or "null"
         */
        removeNewsItem(newsItems: number | string | NewsItem): NewsItem | null;

        /**
         * Removes all the controls from the aggregation "newsItems".
         * Additionally, it unregisters them from the hosting UIArea.
         *
         * newsItems aggregation of the news. These items will be shown in a dialog on click of the news
         *
         * @returns  An array of the removed elements (might be empty)
         */
        removeAllNewsItems(): NewsItem[];

        /**
         * Checks for the provided "sap.cux.home.NewsItem" in the aggregation "newsItems".
         * and returns its index if found or -1 otherwise.
         *
         * newsItems aggregation of the news. These items will be shown in a dialog on click of the news
         *
         * @param newsItem The newsItem whose index is looked for
         * @returns The index of the provided control in the aggregation if found, or -1 otherwise
         */
        indexOfNewsItem(newsItems: NewsItem): number;

        /**
         * Destroys all the newsItems in the aggregation "newsItems".
         *
         * newsItems aggregation of the news. These items will be shown in a dialog on click of the news
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        destroyNewsItems(): this;
    }
}
