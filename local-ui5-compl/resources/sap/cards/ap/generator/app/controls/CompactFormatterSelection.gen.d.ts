declare module "sap/cards/ap/generator/app/controls/CompactFormatterSelection" {
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
    interface $CompactFormatterSelectionSettings extends $ControlSettings {
        type?: string | PropertyBindingInfo;
        formatters?: object | PropertyBindingInfo | `{${string}}`;
        change?: (event: CompactFormatterSelection$ChangeEvent) => void;
    }

    export default interface CompactFormatterSelection {

        // property: type

        /**
         * Gets current value of property "type".
         *
         * @returns Value of property "type"
         */
        getType(): string;

        /**
         * Sets a new value for property "type".
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * @param type New value for property "type"
         * @returns Reference to "this" in order to allow method chaining
         */
        setType(type: string): this;

        // property: formatters

        /**
         * Gets current value of property "formatters".
         *
         * @returns Value of property "formatters"
         */
        getFormatters(): object;

        /**
         * Sets a new value for property "formatters".
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * @param formatters New value for property "formatters"
         * @returns Reference to "this" in order to allow method chaining
         */
        setFormatters(formatters: object): this;

        // event: change

        /**
         * Attaches event handler "fn" to the "change" event of this "CompactFormatterSelection".
         *
         * When called, the context of the event handler (its "this") will be bound to "oListener" if specified,
         * otherwise it will be bound to this "CompactFormatterSelection" itself.
         *
         * @param fn The function to be called when the event occurs
         * @param listener Context object to call the event handler with. Defaults to this "CompactFormatterSelection" itself
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        attachChange(fn: (event: CompactFormatterSelection$ChangeEvent) => void, listener?: object): this;

        /**
         * Attaches event handler "fn" to the "change" event of this "CompactFormatterSelection".
         *
         * When called, the context of the event handler (its "this") will be bound to "oListener" if specified,
         * otherwise it will be bound to this "CompactFormatterSelection" itself.
         *
         * @param data An application-specific payload object that will be passed to the event handler along with the event object when firing the event
         * @param fn The function to be called when the event occurs
         * @param listener Context object to call the event handler with. Defaults to this "CompactFormatterSelection" itself
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        attachChange<CustomDataType extends object>(data: CustomDataType, fn: (event: CompactFormatterSelection$ChangeEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Detaches event handler "fn" from the "change" event of this "CompactFormatterSelection".
         *
         * The passed function and listener object must match the ones used for event registration.
         *
         * @param fn The function to be called, when the event occurs
         * @param listener Context object on which the given function had to be called
         * @returns Reference to "this" in order to allow method chaining
         */
        detachChange(fn: (event: CompactFormatterSelection$ChangeEvent) => void, listener?: object): this;

        /**
         * Fires event "change" to attached listeners.
         *
         * @param parameters Parameters to pass along with the event
         * @param [mParameters.value]
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        fireChange(parameters?: CompactFormatterSelection$ChangeEventParameters): this;
    }

    /**
     * Interface describing the parameters of CompactFormatterSelection's 'change' event.
     */
    export interface CompactFormatterSelection$ChangeEventParameters {
        value?: object;
    }

    /**
     * Type describing the CompactFormatterSelection's 'change' event.
     */
    export type CompactFormatterSelection$ChangeEvent = Event<CompactFormatterSelection$ChangeEventParameters>;
}
