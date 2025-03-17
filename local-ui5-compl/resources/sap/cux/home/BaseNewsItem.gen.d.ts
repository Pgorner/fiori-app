declare module "sap/cux/home/BaseNewsItem" {
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ElementSettings } from "sap/ui/core/Element";

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $BaseNewsItemSettings extends $ElementSettings {

        /**
         * The image URL of the news.
         */
        imageUrl?: string | PropertyBindingInfo;

        /**
         * Title of the news
         */
        title?: string | PropertyBindingInfo;

        /**
         * Subtitle of the app
         */
        subTitle?: string | PropertyBindingInfo;

        /**
         * Footer of the app
         */
        footer?: string | PropertyBindingInfo;
    }

    export default interface BaseNewsItem {

        // property: imageUrl

        /**
         * Gets current value of property "imageUrl".
         *
         * The image URL of the news.
         *
         * @returns Value of property "imageUrl"
         */
        getImageUrl(): string;

        /**
         * Sets a new value for property "imageUrl".
         *
         * The image URL of the news.
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * @param imageUrl New value for property "imageUrl"
         * @returns Reference to "this" in order to allow method chaining
         */
        setImageUrl(imageUrl: string): this;

        // property: title

        /**
         * Gets current value of property "title".
         *
         * Title of the news
         *
         * @returns Value of property "title"
         */
        getTitle(): string;

        /**
         * Sets a new value for property "title".
         *
         * Title of the news
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * @param title New value for property "title"
         * @returns Reference to "this" in order to allow method chaining
         */
        setTitle(title: string): this;

        // property: subTitle

        /**
         * Gets current value of property "subTitle".
         *
         * Subtitle of the app
         *
         * @returns Value of property "subTitle"
         */
        getSubTitle(): string;

        /**
         * Sets a new value for property "subTitle".
         *
         * Subtitle of the app
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * @param subTitle New value for property "subTitle"
         * @returns Reference to "this" in order to allow method chaining
         */
        setSubTitle(subTitle: string): this;

        // property: footer

        /**
         * Gets current value of property "footer".
         *
         * Footer of the app
         *
         * @returns Value of property "footer"
         */
        getFooter(): string;

        /**
         * Sets a new value for property "footer".
         *
         * Footer of the app
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * @param footer New value for property "footer"
         * @returns Reference to "this" in order to allow method chaining
         */
        setFooter(footer: string): this;
    }
}
