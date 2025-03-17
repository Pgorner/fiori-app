declare module "sap/cux/home/ToDoPanel" {
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $BasePanelSettings } from "./BasePanel";

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $ToDoPanelSettings extends $BasePanelSettings {

        /**
         * Specifies the base URL for batching requests sent from the panel.
         */
        baseUrl?: string | PropertyBindingInfo;

        /**
         * Specifies the URL for fetching the count of requested to-do cards.
         */
        countUrl?: string | PropertyBindingInfo;

        /**
         * Specifies the URL from where the to-do cards should be fetched.
         */
        dataUrl?: string | PropertyBindingInfo;

        /**
         * Specifies the URL of the target application associated with the to-do cards.
         */
        targetAppUrl?: string | PropertyBindingInfo;
    }

    export default interface ToDoPanel {

        // property: baseUrl

        /**
         * Gets current value of property "baseUrl".
         *
         * Specifies the base URL for batching requests sent from the panel.
         *
         * Default value is: ""
         * @returns Value of property "baseUrl"
         */
        getBaseUrl(): string;

        /**
         * Sets a new value for property "baseUrl".
         *
         * Specifies the base URL for batching requests sent from the panel.
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: ""
         * @param [baseUrl=""] New value for property "baseUrl"
         * @returns Reference to "this" in order to allow method chaining
         */
        setBaseUrl(baseUrl: string): this;

        // property: countUrl

        /**
         * Gets current value of property "countUrl".
         *
         * Specifies the URL for fetching the count of requested to-do cards.
         *
         * Default value is: ""
         * @returns Value of property "countUrl"
         */
        getCountUrl(): string;

        /**
         * Sets a new value for property "countUrl".
         *
         * Specifies the URL for fetching the count of requested to-do cards.
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: ""
         * @param [countUrl=""] New value for property "countUrl"
         * @returns Reference to "this" in order to allow method chaining
         */
        setCountUrl(countUrl: string): this;

        // property: dataUrl

        /**
         * Gets current value of property "dataUrl".
         *
         * Specifies the URL from where the to-do cards should be fetched.
         *
         * Default value is: ""
         * @returns Value of property "dataUrl"
         */
        getDataUrl(): string;

        /**
         * Sets a new value for property "dataUrl".
         *
         * Specifies the URL from where the to-do cards should be fetched.
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: ""
         * @param [dataUrl=""] New value for property "dataUrl"
         * @returns Reference to "this" in order to allow method chaining
         */
        setDataUrl(dataUrl: string): this;

        // property: targetAppUrl

        /**
         * Gets current value of property "targetAppUrl".
         *
         * Specifies the URL of the target application associated with the to-do cards.
         *
         * Default value is: ""
         * @returns Value of property "targetAppUrl"
         */
        getTargetAppUrl(): string;

        /**
         * Sets a new value for property "targetAppUrl".
         *
         * Specifies the URL of the target application associated with the to-do cards.
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: ""
         * @param [targetAppUrl=""] New value for property "targetAppUrl"
         * @returns Reference to "this" in order to allow method chaining
         */
        setTargetAppUrl(targetAppUrl: string): this;
    }
}
