declare module "sap/cux/home/NewsPanel" {
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import { NewsType } from "sap/cux/home/library";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $BaseNewsPanelSettings } from "./BaseNewsPanel";

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $NewsPanelSettings extends $BaseNewsPanelSettings {

        /**
         * The URL of the news item.
         */
        url?: string | PropertyBindingInfo;

        /**
         * Type of the news item.
         */
        type?: NewsType | PropertyBindingInfo | `{${string}}`;

        /**
         * The key of custom news feed.
         */
        customFeedKey?: string | PropertyBindingInfo;

        /**
         * The filename of custom news feed.
         */
        customFileName?: string | PropertyBindingInfo;

        /**
         * The flag for custom news feed is checked or not.
         */
        showCustom?: boolean | PropertyBindingInfo | `{${string}}`;
    }

    export default interface NewsPanel {

        // property: url

        /**
         * Gets current value of property "url".
         *
         * The URL of the news item.
         *
         * Default value is: ""
         * @returns Value of property "url"
         */
        getUrl(): string;

        /**
         * Sets a new value for property "url".
         *
         * The URL of the news item.
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: ""
         * @param [url=""] New value for property "url"
         * @returns Reference to "this" in order to allow method chaining
         */
        setUrl(url: string): this;

        // property: type

        /**
         * Gets current value of property "type".
         *
         * Type of the news item.
         *
         * Default value is: "NewsType.RSS"
         * @returns Value of property "type"
         */
        getType(): NewsType;

        /**
         * Sets a new value for property "type".
         *
         * Type of the news item.
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: "NewsType.RSS"
         * @param [type="NewsType.RSS"] New value for property "type"
         * @returns Reference to "this" in order to allow method chaining
         */
        setType(type: NewsType): this;

        // property: customFeedKey

        /**
         * Gets current value of property "customFeedKey".
         *
         * The key of custom news feed.
         *
         * Default value is: ""
         * @returns Value of property "customFeedKey"
         */
        getCustomFeedKey(): string;

        /**
         * Sets a new value for property "customFeedKey".
         *
         * The key of custom news feed.
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: ""
         * @param [customFeedKey=""] New value for property "customFeedKey"
         * @returns Reference to "this" in order to allow method chaining
         */
        setCustomFeedKey(customFeedKey: string): this;

        // property: customFileName

        /**
         * Gets current value of property "customFileName".
         *
         * The filename of custom news feed.
         *
         * Default value is: ""
         * @returns Value of property "customFileName"
         */
        getCustomFileName(): string;

        /**
         * Sets a new value for property "customFileName".
         *
         * The filename of custom news feed.
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: ""
         * @param [customFileName=""] New value for property "customFileName"
         * @returns Reference to "this" in order to allow method chaining
         */
        setCustomFileName(customFileName: string): this;

        // property: showCustom

        /**
         * Gets current value of property "showCustom".
         *
         * The flag for custom news feed is checked or not.
         *
         * Default value is: false
         * @returns Value of property "showCustom"
         */
        getShowCustom(): boolean;

        /**
         * Sets a new value for property "showCustom".
         *
         * The flag for custom news feed is checked or not.
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: false
         * @param [showCustom=false] New value for property "showCustom"
         * @returns Reference to "this" in order to allow method chaining
         */
        setShowCustom(showCustom: boolean): this;
    }
}
