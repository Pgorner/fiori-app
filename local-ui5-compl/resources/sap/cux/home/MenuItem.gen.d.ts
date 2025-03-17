declare module "sap/cux/home/MenuItem" {
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import Event from "sap/ui/base/Event";
import { URI } from "sap/ui/core/library";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ElementSettings } from "sap/ui/core/Element";

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $MenuItemSettings extends $ElementSettings {

        /**
         * Title of the menu item.
         */
        title?: string | PropertyBindingInfo;

        /**
         * Icon of the menu item.
         */
        icon?: URI | PropertyBindingInfo | `{${string}}`;

        /**
         * Type of the menu item visualization in the menu list
         */
        type?: string | PropertyBindingInfo;

        /**
         * Visibility of the menu item in the menu list
         */
        visible?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Fires whenever the menu item is pressed.
         */
        press?: (event: MenuItem$PressEvent) => void;
    }

    export default interface MenuItem {

        // property: title

        /**
         * Gets current value of property "title".
         *
         * Title of the menu item.
         *
         * Default value is: ""
         * @returns Value of property "title"
         */
        getTitle(): string;

        /**
         * Sets a new value for property "title".
         *
         * Title of the menu item.
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: ""
         * @param [title=""] New value for property "title"
         * @returns Reference to "this" in order to allow method chaining
         */
        setTitle(title: string): this;

        // property: icon

        /**
         * Gets current value of property "icon".
         *
         * Icon of the menu item.
         *
         * Default value is: ""
         * @returns Value of property "icon"
         */
        getIcon(): URI;

        /**
         * Sets a new value for property "icon".
         *
         * Icon of the menu item.
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: ""
         * @param [icon=""] New value for property "icon"
         * @returns Reference to "this" in order to allow method chaining
         */
        setIcon(icon: URI): this;

        // property: type

        /**
         * Gets current value of property "type".
         *
         * Type of the menu item visualization in the menu list
         *
         * Default value is: "Active"
         * @returns Value of property "type"
         */
        getType(): string;

        /**
         * Sets a new value for property "type".
         *
         * Type of the menu item visualization in the menu list
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: "Active"
         * @param [type="Active"] New value for property "type"
         * @returns Reference to "this" in order to allow method chaining
         */
        setType(type: string): this;

        // property: visible

        /**
         * Gets current value of property "visible".
         *
         * Visibility of the menu item in the menu list
         *
         * Default value is: true
         * @returns Value of property "visible"
         */
        getVisible(): boolean;

        /**
         * Sets a new value for property "visible".
         *
         * Visibility of the menu item in the menu list
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: true
         * @param [visible=true] New value for property "visible"
         * @returns Reference to "this" in order to allow method chaining
         */
        setVisible(visible: boolean): this;

        // event: press

        /**
         * Attaches event handler "fn" to the "press" event of this "MenuItem".
         *
         * Fires whenever the menu item is pressed.
         *
         * When called, the context of the event handler (its "this") will be bound to "oListener" if specified,
         * otherwise it will be bound to this "MenuItem" itself.
         *
         * @param fn The function to be called when the event occurs
         * @param listener Context object to call the event handler with. Defaults to this "MenuItem" itself
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        attachPress(fn: (event: MenuItem$PressEvent) => void, listener?: object): this;

        /**
         * Attaches event handler "fn" to the "press" event of this "MenuItem".
         *
         * Fires whenever the menu item is pressed.
         *
         * When called, the context of the event handler (its "this") will be bound to "oListener" if specified,
         * otherwise it will be bound to this "MenuItem" itself.
         *
         * @param data An application-specific payload object that will be passed to the event handler along with the event object when firing the event
         * @param fn The function to be called when the event occurs
         * @param listener Context object to call the event handler with. Defaults to this "MenuItem" itself
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        attachPress<CustomDataType extends object>(data: CustomDataType, fn: (event: MenuItem$PressEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Detaches event handler "fn" from the "press" event of this "MenuItem".
         *
         * Fires whenever the menu item is pressed.
         *
         * The passed function and listener object must match the ones used for event registration.
         *
         * @param fn The function to be called, when the event occurs
         * @param listener Context object on which the given function had to be called
         * @returns Reference to "this" in order to allow method chaining
         */
        detachPress(fn: (event: MenuItem$PressEvent) => void, listener?: object): this;

        /**
         * Fires event "press" to attached listeners.
         *
         * Fires whenever the menu item is pressed.
         *
         * @param parameters Parameters to pass along with the event
         * @returns Reference to "this" in order to allow method chaining
         */
        firePress(parameters?: MenuItem$PressEventParameters): this;
    }

    /**
     * Interface describing the parameters of MenuItem's 'press' event.
     * Fires whenever the menu item is pressed.
     */
    // eslint-disable-next-line
    export interface MenuItem$PressEventParameters {
    }

    /**
     * Type describing the MenuItem's 'press' event.
     * Fires whenever the menu item is pressed.
     */
    export type MenuItem$PressEvent = Event<MenuItem$PressEventParameters>;
}
