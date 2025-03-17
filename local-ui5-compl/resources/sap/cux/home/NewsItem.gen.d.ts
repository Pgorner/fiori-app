declare module "sap/cux/home/NewsItem" {
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $BaseNewsItemSettings } from "./BaseNewsItem";

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $NewsItemSettings extends $BaseNewsItemSettings {

        /**
         * The URL of the news item. Clicking on the item navigates to this URL.
         */
        url?: string | PropertyBindingInfo;
    }

    export default interface NewsItem {

        // property: url

        /**
         * Gets current value of property "url".
         *
         * The URL of the news item. Clicking on the item navigates to this URL.
         *
         * Default value is: ""
         * @returns Value of property "url"
         */
        getUrl(): string;

        /**
         * Sets a new value for property "url".
         *
         * The URL of the news item. Clicking on the item navigates to this URL.
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: ""
         * @param [url=""] New value for property "url"
         * @returns Reference to "this" in order to allow method chaining
         */
        setUrl(url: string): this;
    }
}
