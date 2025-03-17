declare module "sap/cux/home/BaseNewsPanel" {
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import BaseNewsItem from "sap/cux/home/BaseNewsItem";
import { AggregationBindingInfo } from "sap/ui/base/ManagedObject";
import { $BasePanelSettings } from "./BasePanel";

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $BaseNewsPanelSettings extends $BasePanelSettings {

        /**
         * Holds the news aggregation
         */
        newsItems?: BaseNewsItem[] | BaseNewsItem | AggregationBindingInfo | `{${string}}`;
    }

    export default interface BaseNewsPanel {

        // aggregation: newsItems

        /**
         * Gets content of aggregation "newsItems".
         *
         * Holds the news aggregation
         */
        getNewsItems(): BaseNewsItem[];

        /**
         * Adds some newsItem to the aggregation "newsItems".
         *
         * Holds the news aggregation
         *
         * @param newsItem The newsItem to add; if empty, nothing is inserted
         * @returns Reference to "this" in order to allow method chaining
         */
        addNewsItem(newsItems: BaseNewsItem): this;

        /**
         * Inserts a newsItem into the aggregation "newsItems".
         *
         * Holds the news aggregation
         *
         * @param newsItem The newsItem to insert; if empty, nothing is inserted
         * @param index The "0"-based index the newsItem should be inserted at; for
         *              a negative value of "iIndex", the newsItem is inserted at position 0; for a value
         *              greater than the current size of the aggregation, the newsItem is inserted at
         *              the last position
         * @returns Reference to "this" in order to allow method chaining
         */
        insertNewsItem(newsItems: BaseNewsItem, index: number): this;

        /**
         * Removes a newsItem from the aggregation "newsItems".
         *
         * Holds the news aggregation
         *
         * @param newsItem The newsItem to remove or its index or id
         * @returns The removed newsItem or "null"
         */
        removeNewsItem(newsItems: number | string | BaseNewsItem): BaseNewsItem | null;

        /**
         * Removes all the controls from the aggregation "newsItems".
         * Additionally, it unregisters them from the hosting UIArea.
         *
         * Holds the news aggregation
         *
         * @returns  An array of the removed elements (might be empty)
         */
        removeAllNewsItems(): BaseNewsItem[];

        /**
         * Checks for the provided "sap.cux.home.BaseNewsItem" in the aggregation "newsItems".
         * and returns its index if found or -1 otherwise.
         *
         * Holds the news aggregation
         *
         * @param newsItem The newsItem whose index is looked for
         * @returns The index of the provided control in the aggregation if found, or -1 otherwise
         */
        indexOfNewsItem(newsItems: BaseNewsItem): number;

        /**
         * Destroys all the newsItems in the aggregation "newsItems".
         *
         * Holds the news aggregation
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        destroyNewsItems(): this;
    }
}
