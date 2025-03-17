declare module "sap/cux/home/ErrorPanel" {
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import Button from "sap/m/Button";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $BasePanelSettings } from "./BasePanel";

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $ErrorPanelSettings extends $BasePanelSettings {
        messageTitle?: string | PropertyBindingInfo;
        messageDescription?: string | PropertyBindingInfo;
        actionButton?: Button | PropertyBindingInfo | `{${string}}`;
    }

    export default interface ErrorPanel {

        // property: messageTitle

        /**
         * Gets current value of property "messageTitle".
         *
         * Default value is: ""
         * @returns Value of property "messageTitle"
         */
        getMessageTitle(): string;

        /**
         * Sets a new value for property "messageTitle".
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: ""
         * @param [messageTitle=""] New value for property "messageTitle"
         * @returns Reference to "this" in order to allow method chaining
         */
        setMessageTitle(messageTitle: string): this;

        // property: messageDescription

        /**
         * Gets current value of property "messageDescription".
         *
         * Default value is: ""
         * @returns Value of property "messageDescription"
         */
        getMessageDescription(): string;

        /**
         * Sets a new value for property "messageDescription".
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: ""
         * @param [messageDescription=""] New value for property "messageDescription"
         * @returns Reference to "this" in order to allow method chaining
         */
        setMessageDescription(messageDescription: string): this;

        // property: actionButton

        /**
         * Gets current value of property "actionButton".
         *
         * @returns Value of property "actionButton"
         */
        getActionButton(): Button;

        /**
         * Sets a new value for property "actionButton".
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * @param actionButton New value for property "actionButton"
         * @returns Reference to "this" in order to allow method chaining
         */
        setActionButton(actionButton: Button): this;
    }
}
