declare module "sap/cux/home/BasePagePanel" {
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import Page from "sap/cux/home/Page";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { AggregationBindingInfo } from "sap/ui/base/ManagedObject";
import { $BasePanelSettings } from "./BasePanel";

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $BasePagePanelSettings extends $BasePanelSettings {
        title?: string | PropertyBindingInfo;
        key?: string | PropertyBindingInfo;
        pages?: Page[] | Page | AggregationBindingInfo | `{${string}}`;
    }

    export default interface BasePagePanel {

        // property: title

        /**
         * Gets current value of property "title".
         *
         * @returns Value of property "title"
         */
        getTitle(): string;

        /**
         * Sets a new value for property "title".
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * @param title New value for property "title"
         * @returns Reference to "this" in order to allow method chaining
         */
        setTitle(title: string): this;

        // property: key

        /**
         * Gets current value of property "key".
         *
         * @returns Value of property "key"
         */
        getKey(): string;

        /**
         * Sets a new value for property "key".
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * @param key New value for property "key"
         * @returns Reference to "this" in order to allow method chaining
         */
        setKey(key: string): this;

        // aggregation: pages

        /**
         * Gets content of aggregation "pages".
         */
        getPages(): Page[];

        /**
         * Adds some page to the aggregation "pages".
         *
         * @param page The page to add; if empty, nothing is inserted
         * @returns Reference to "this" in order to allow method chaining
         */
        addPage(pages: Page): this;

        /**
         * Inserts a page into the aggregation "pages".
         *
         * @param page The page to insert; if empty, nothing is inserted
         * @param index The "0"-based index the page should be inserted at; for
         *              a negative value of "iIndex", the page is inserted at position 0; for a value
         *              greater than the current size of the aggregation, the page is inserted at
         *              the last position
         * @returns Reference to "this" in order to allow method chaining
         */
        insertPage(pages: Page, index: number): this;

        /**
         * Removes a page from the aggregation "pages".
         *
         * @param page The page to remove or its index or id
         * @returns The removed page or "null"
         */
        removePage(pages: number | string | Page): Page | null;

        /**
         * Removes all the controls from the aggregation "pages".
         * Additionally, it unregisters them from the hosting UIArea.
         *
         * @returns  An array of the removed elements (might be empty)
         */
        removeAllPages(): Page[];

        /**
         * Checks for the provided "sap.cux.home.Page" in the aggregation "pages".
         * and returns its index if found or -1 otherwise.
         *
         * @param page The page whose index is looked for
         * @returns The index of the provided control in the aggregation if found, or -1 otherwise
         */
        indexOfPage(pages: Page): number;

        /**
         * Destroys all the pages in the aggregation "pages".
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        destroyPages(): this;
    }
}
