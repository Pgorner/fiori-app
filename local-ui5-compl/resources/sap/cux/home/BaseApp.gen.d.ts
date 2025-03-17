declare module "sap/cux/home/BaseApp" {
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ElementSettings } from "sap/ui/core/Element";

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $BaseAppSettings extends $ElementSettings {

        /**
         * Title of the app
         */
        title?: string | PropertyBindingInfo;

        /**
         * Sub header of the app
         */
        subTitle?: string | PropertyBindingInfo;

        /**
         * Background color of the app
         */
        bgColor?: string | PropertyBindingInfo;

        /**
         * Icon of the app
         */
        icon?: string | PropertyBindingInfo;

        /**
         * Whether the app is in loaded or loading status
         */
        status?: string | PropertyBindingInfo;
    }

    export default interface BaseApp {

        // property: title

        /**
         * Gets current value of property "title".
         *
         * Title of the app
         *
         * Default value is: ""
         * @returns Value of property "title"
         */
        getTitle(): string;

        /**
         * Sets a new value for property "title".
         *
         * Title of the app
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: ""
         * @param [title=""] New value for property "title"
         * @returns Reference to "this" in order to allow method chaining
         */
        setTitle(title: string): this;

        // property: subTitle

        /**
         * Gets current value of property "subTitle".
         *
         * Sub header of the app
         *
         * Default value is: ""
         * @returns Value of property "subTitle"
         */
        getSubTitle(): string;

        /**
         * Sets a new value for property "subTitle".
         *
         * Sub header of the app
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: ""
         * @param [subTitle=""] New value for property "subTitle"
         * @returns Reference to "this" in order to allow method chaining
         */
        setSubTitle(subTitle: string): this;

        // property: bgColor

        /**
         * Gets current value of property "bgColor".
         *
         * Background color of the app
         *
         * Default value is: ""
         * @returns Value of property "bgColor"
         */
        getBgColor(): string;

        /**
         * Sets a new value for property "bgColor".
         *
         * Background color of the app
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: ""
         * @param [bgColor=""] New value for property "bgColor"
         * @returns Reference to "this" in order to allow method chaining
         */
        setBgColor(bgColor: string): this;

        // property: icon

        /**
         * Gets current value of property "icon".
         *
         * Icon of the app
         *
         * Default value is: ""
         * @returns Value of property "icon"
         */
        getIcon(): string;

        /**
         * Sets a new value for property "icon".
         *
         * Icon of the app
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: ""
         * @param [icon=""] New value for property "icon"
         * @returns Reference to "this" in order to allow method chaining
         */
        setIcon(icon: string): this;

        // property: status

        /**
         * Gets current value of property "status".
         *
         * Whether the app is in loaded or loading status
         *
         * Default value is: "Loaded"
         * @returns Value of property "status"
         */
        getStatus(): string;

        /**
         * Sets a new value for property "status".
         *
         * Whether the app is in loaded or loading status
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: "Loaded"
         * @param [status="Loaded"] New value for property "status"
         * @returns Reference to "this" in order to allow method chaining
         */
        setStatus(status: string): this;
    }
}
