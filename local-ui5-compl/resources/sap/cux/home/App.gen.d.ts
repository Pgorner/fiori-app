declare module "sap/cux/home/App" {
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $BaseAppSettings } from "./BaseApp";

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $AppSettings extends $BaseAppSettings {

        /**
         * Url of the app where the user navigates to on click
         */
        url?: string | PropertyBindingInfo;

        /**
         * VizId of the app. Used for enabling addition of apps to FavoriteApp panel
         */
        vizId?: string | PropertyBindingInfo;
    }

    export default interface App {

        // property: url

        /**
         * Gets current value of property "url".
         *
         * Url of the app where the user navigates to on click
         *
         * Default value is: ""
         * @returns Value of property "url"
         */
        getUrl(): string;

        /**
         * Sets a new value for property "url".
         *
         * Url of the app where the user navigates to on click
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: ""
         * @param [url=""] New value for property "url"
         * @returns Reference to "this" in order to allow method chaining
         */
        setUrl(url: string): this;

        // property: vizId

        /**
         * Gets current value of property "vizId".
         *
         * VizId of the app. Used for enabling addition of apps to FavoriteApp panel
         *
         * Default value is: ""
         * @returns Value of property "vizId"
         */
        getVizId(): string;

        /**
         * Sets a new value for property "vizId".
         *
         * VizId of the app. Used for enabling addition of apps to FavoriteApp panel
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: ""
         * @param [vizId=""] New value for property "vizId"
         * @returns Reference to "this" in order to allow method chaining
         */
        setVizId(vizId: string): this;
    }
}
