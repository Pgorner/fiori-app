declare module "sap/cards/ap/generator/app/controls/ArrangementsEditor" {
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import Event from "sap/ui/base/Event";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $ArrangementsEditorSettings extends $ControlSettings {
        mode?: string | PropertyBindingInfo;
        selectionKeys?: object | PropertyBindingInfo | `{${string}}`;
        navigationSelectionKeys?: object | PropertyBindingInfo | `{${string}}`;
        items?: object | PropertyBindingInfo | `{${string}}`;
        change?: (event: ArrangementsEditor$ChangeEvent) => void;
        selectionChange?: (event: ArrangementsEditor$SelectionChangeEvent) => void;
    }

    export default interface ArrangementsEditor {

        // property: mode

        /**
         * Gets current value of property "mode".
         *
         * @returns Value of property "mode"
         */
        getMode(): string;

        /**
         * Sets a new value for property "mode".
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * @param mode New value for property "mode"
         * @returns Reference to "this" in order to allow method chaining
         */
        setMode(mode: string): this;

        // property: selectionKeys

        /**
         * Gets current value of property "selectionKeys".
         *
         * Default value is: {}
         * @returns Value of property "selectionKeys"
         */
        getSelectionKeys(): object;

        /**
         * Sets a new value for property "selectionKeys".
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: {}
         * @param [selectionKeys={}] New value for property "selectionKeys"
         * @returns Reference to "this" in order to allow method chaining
         */
        setSelectionKeys(selectionKeys: object): this;

        // property: navigationSelectionKeys

        /**
         * Gets current value of property "navigationSelectionKeys".
         *
         * Default value is: {}
         * @returns Value of property "navigationSelectionKeys"
         */
        getNavigationSelectionKeys(): object;

        /**
         * Sets a new value for property "navigationSelectionKeys".
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: {}
         * @param [navigationSelectionKeys={}] New value for property "navigationSelectionKeys"
         * @returns Reference to "this" in order to allow method chaining
         */
        setNavigationSelectionKeys(navigationSelectionKeys: object): this;

        // property: items

        /**
         * Gets current value of property "items".
         *
         * Default value is: {}
         * @returns Value of property "items"
         */
        getItems(): object;

        /**
         * Sets a new value for property "items".
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: {}
         * @param [items={}] New value for property "items"
         * @returns Reference to "this" in order to allow method chaining
         */
        setItems(items: object): this;

        // event: change

        /**
         * Attaches event handler "fn" to the "change" event of this "ArrangementsEditor".
         *
         * When called, the context of the event handler (its "this") will be bound to "oListener" if specified,
         * otherwise it will be bound to this "ArrangementsEditor" itself.
         *
         * @param fn The function to be called when the event occurs
         * @param listener Context object to call the event handler with. Defaults to this "ArrangementsEditor" itself
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        attachChange(fn: (event: ArrangementsEditor$ChangeEvent) => void, listener?: object): this;

        /**
         * Attaches event handler "fn" to the "change" event of this "ArrangementsEditor".
         *
         * When called, the context of the event handler (its "this") will be bound to "oListener" if specified,
         * otherwise it will be bound to this "ArrangementsEditor" itself.
         *
         * @param data An application-specific payload object that will be passed to the event handler along with the event object when firing the event
         * @param fn The function to be called when the event occurs
         * @param listener Context object to call the event handler with. Defaults to this "ArrangementsEditor" itself
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        attachChange<CustomDataType extends object>(data: CustomDataType, fn: (event: ArrangementsEditor$ChangeEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Detaches event handler "fn" from the "change" event of this "ArrangementsEditor".
         *
         * The passed function and listener object must match the ones used for event registration.
         *
         * @param fn The function to be called, when the event occurs
         * @param listener Context object on which the given function had to be called
         * @returns Reference to "this" in order to allow method chaining
         */
        detachChange(fn: (event: ArrangementsEditor$ChangeEvent) => void, listener?: object): this;

        /**
         * Fires event "change" to attached listeners.
         *
         * @param parameters Parameters to pass along with the event
         * @param [mParameters.value]
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        fireChange(parameters?: ArrangementsEditor$ChangeEventParameters): this;

        // event: selectionChange

        /**
         * Attaches event handler "fn" to the "selectionChange" event of this "ArrangementsEditor".
         *
         * When called, the context of the event handler (its "this") will be bound to "oListener" if specified,
         * otherwise it will be bound to this "ArrangementsEditor" itself.
         *
         * @param fn The function to be called when the event occurs
         * @param listener Context object to call the event handler with. Defaults to this "ArrangementsEditor" itself
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        attachSelectionChange(fn: (event: ArrangementsEditor$SelectionChangeEvent) => void, listener?: object): this;

        /**
         * Attaches event handler "fn" to the "selectionChange" event of this "ArrangementsEditor".
         *
         * When called, the context of the event handler (its "this") will be bound to "oListener" if specified,
         * otherwise it will be bound to this "ArrangementsEditor" itself.
         *
         * @param data An application-specific payload object that will be passed to the event handler along with the event object when firing the event
         * @param fn The function to be called when the event occurs
         * @param listener Context object to call the event handler with. Defaults to this "ArrangementsEditor" itself
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        attachSelectionChange<CustomDataType extends object>(data: CustomDataType, fn: (event: ArrangementsEditor$SelectionChangeEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Detaches event handler "fn" from the "selectionChange" event of this "ArrangementsEditor".
         *
         * The passed function and listener object must match the ones used for event registration.
         *
         * @param fn The function to be called, when the event occurs
         * @param listener Context object on which the given function had to be called
         * @returns Reference to "this" in order to allow method chaining
         */
        detachSelectionChange(fn: (event: ArrangementsEditor$SelectionChangeEvent) => void, listener?: object): this;

        /**
         * Fires event "selectionChange" to attached listeners.
         *
         * @param parameters Parameters to pass along with the event
         * @param [mParameters.value]
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        fireSelectionChange(parameters?: ArrangementsEditor$SelectionChangeEventParameters): this;
    }

    /**
     * Interface describing the parameters of ArrangementsEditor's 'change' event.
     */
    export interface ArrangementsEditor$ChangeEventParameters {
        value?: number;
    }

    /**
     * Interface describing the parameters of ArrangementsEditor's 'selectionChange' event.
     */
    export interface ArrangementsEditor$SelectionChangeEventParameters {
        value?: number;
    }

    /**
     * Type describing the ArrangementsEditor's 'change' event.
     */
    export type ArrangementsEditor$ChangeEvent = Event<ArrangementsEditor$ChangeEventParameters>;

    /**
     * Type describing the ArrangementsEditor's 'selectionChange' event.
     */
    export type ArrangementsEditor$SelectionChangeEvent = Event<ArrangementsEditor$SelectionChangeEventParameters>;
}
