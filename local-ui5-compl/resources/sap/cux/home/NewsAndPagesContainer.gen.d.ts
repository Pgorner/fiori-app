declare module "sap/cux/home/NewsAndPagesContainer" {
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import array from "array";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $BaseContainerSettings } from "./BaseContainer";

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $NewsAndPagesContainerSettings extends $BaseContainerSettings {

        /**
         * Color Personalizations for Spaces & Pages
         */
        colorPersonalizations?: array | PropertyBindingInfo | `{${string}}`;

        /**
         * Icon Personalizations for Spaces & Pages
         */
        iconPersonalizations?: array | PropertyBindingInfo | `{${string}}`;
    }

    export default interface NewsAndPagesContainer {

        // property: colorPersonalizations

        /**
         * Gets current value of property "colorPersonalizations".
         *
         * Color Personalizations for Spaces & Pages
         *
         * Default value is: []
         * @returns Value of property "colorPersonalizations"
         */
        getColorPersonalizations(): array;

        /**
         * Sets a new value for property "colorPersonalizations".
         *
         * Color Personalizations for Spaces & Pages
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: []
         * @param [colorPersonalizations=[]] New value for property "colorPersonalizations"
         * @returns Reference to "this" in order to allow method chaining
         */
        setColorPersonalizations(colorPersonalizations: array): this;

        // property: iconPersonalizations

        /**
         * Gets current value of property "iconPersonalizations".
         *
         * Icon Personalizations for Spaces & Pages
         *
         * Default value is: []
         * @returns Value of property "iconPersonalizations"
         */
        getIconPersonalizations(): array;

        /**
         * Sets a new value for property "iconPersonalizations".
         *
         * Icon Personalizations for Spaces & Pages
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: []
         * @param [iconPersonalizations=[]] New value for property "iconPersonalizations"
         * @returns Reference to "this" in order to allow method chaining
         */
        setIconPersonalizations(iconPersonalizations: array): this;
    }
}
