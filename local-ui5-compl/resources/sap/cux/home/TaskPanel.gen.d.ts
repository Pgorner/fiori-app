declare module "sap/cux/home/TaskPanel" {
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ToDoPanelSettings } from "./ToDoPanel";

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $TaskPanelSettings extends $ToDoPanelSettings {

        /**
         * Specifies if actions should be enabled for the task cards.
         */
        enableActions?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Specifies the URL that fetches the custom attributes to be displayed along with the task cards.
         */
        customAttributeUrl?: string | PropertyBindingInfo;
    }

    export default interface TaskPanel {

        // property: enableActions

        /**
         * Gets current value of property "enableActions".
         *
         * Specifies if actions should be enabled for the task cards.
         *
         * Default value is: false
         * @returns Value of property "enableActions"
         */
        getEnableActions(): boolean;

        /**
         * Sets a new value for property "enableActions".
         *
         * Specifies if actions should be enabled for the task cards.
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: false
         * @param [enableActions=false] New value for property "enableActions"
         * @returns Reference to "this" in order to allow method chaining
         */
        setEnableActions(enableActions: boolean): this;

        // property: customAttributeUrl

        /**
         * Gets current value of property "customAttributeUrl".
         *
         * Specifies the URL that fetches the custom attributes to be displayed along with the task cards.
         *
         * Default value is: ""
         * @returns Value of property "customAttributeUrl"
         */
        getCustomAttributeUrl(): string;

        /**
         * Sets a new value for property "customAttributeUrl".
         *
         * Specifies the URL that fetches the custom attributes to be displayed along with the task cards.
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: ""
         * @param [customAttributeUrl=""] New value for property "customAttributeUrl"
         * @returns Reference to "this" in order to allow method chaining
         */
        setCustomAttributeUrl(customAttributeUrl: string): this;
    }
}
