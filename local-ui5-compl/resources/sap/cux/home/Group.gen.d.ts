declare module "sap/cux/home/Group" {
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import Event from "sap/ui/base/Event";
import App from "sap/cux/home/App";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { AggregationBindingInfo } from "sap/ui/base/ManagedObject";
import { $BaseAppSettings } from "./BaseApp";

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $GroupSettings extends $BaseAppSettings {

        /**
         * Number of apps, shown as folder badge
         */
        number?: string | PropertyBindingInfo;

        /**
         * Id of the group
         */
        groupId?: string | PropertyBindingInfo;

        /**
         * Apps aggregation for Groups
         */
        apps?: App[] | App | AggregationBindingInfo | `{${string}}`;
        press?: (event: Group$PressEvent) => void;
    }

    export default interface Group {

        // property: number

        /**
         * Gets current value of property "number".
         *
         * Number of apps, shown as folder badge
         *
         * Default value is: ""
         * @returns Value of property "number"
         */
        getNumber(): string;

        /**
         * Sets a new value for property "number".
         *
         * Number of apps, shown as folder badge
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: ""
         * @param [number=""] New value for property "number"
         * @returns Reference to "this" in order to allow method chaining
         */
        setNumber(number: string): this;

        // property: groupId

        /**
         * Gets current value of property "groupId".
         *
         * Id of the group
         *
         * Default value is: ""
         * @returns Value of property "groupId"
         */
        getGroupId(): string;

        /**
         * Sets a new value for property "groupId".
         *
         * Id of the group
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: ""
         * @param [groupId=""] New value for property "groupId"
         * @returns Reference to "this" in order to allow method chaining
         */
        setGroupId(groupId: string): this;

        // aggregation: apps

        /**
         * Gets content of aggregation "apps".
         *
         * Apps aggregation for Groups
         */
        getApps(): App[];

        /**
         * Adds some app to the aggregation "apps".
         *
         * Apps aggregation for Groups
         *
         * @param app The app to add; if empty, nothing is inserted
         * @returns Reference to "this" in order to allow method chaining
         */
        addApp(apps: App): this;

        /**
         * Inserts a app into the aggregation "apps".
         *
         * Apps aggregation for Groups
         *
         * @param app The app to insert; if empty, nothing is inserted
         * @param index The "0"-based index the app should be inserted at; for
         *              a negative value of "iIndex", the app is inserted at position 0; for a value
         *              greater than the current size of the aggregation, the app is inserted at
         *              the last position
         * @returns Reference to "this" in order to allow method chaining
         */
        insertApp(apps: App, index: number): this;

        /**
         * Removes a app from the aggregation "apps".
         *
         * Apps aggregation for Groups
         *
         * @param app The app to remove or its index or id
         * @returns The removed app or "null"
         */
        removeApp(apps: number | string | App): App | null;

        /**
         * Removes all the controls from the aggregation "apps".
         * Additionally, it unregisters them from the hosting UIArea.
         *
         * Apps aggregation for Groups
         *
         * @returns  An array of the removed elements (might be empty)
         */
        removeAllApps(): App[];

        /**
         * Checks for the provided "sap.cux.home.App" in the aggregation "apps".
         * and returns its index if found or -1 otherwise.
         *
         * Apps aggregation for Groups
         *
         * @param app The app whose index is looked for
         * @returns The index of the provided control in the aggregation if found, or -1 otherwise
         */
        indexOfApp(apps: App): number;

        /**
         * Destroys all the apps in the aggregation "apps".
         *
         * Apps aggregation for Groups
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        destroyApps(): this;

        // event: press

        /**
         * Attaches event handler "fn" to the "press" event of this "Group".
         *
         * When called, the context of the event handler (its "this") will be bound to "oListener" if specified,
         * otherwise it will be bound to this "Group" itself.
         *
         * @param fn The function to be called when the event occurs
         * @param listener Context object to call the event handler with. Defaults to this "Group" itself
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        attachPress(fn: (event: Group$PressEvent) => void, listener?: object): this;

        /**
         * Attaches event handler "fn" to the "press" event of this "Group".
         *
         * When called, the context of the event handler (its "this") will be bound to "oListener" if specified,
         * otherwise it will be bound to this "Group" itself.
         *
         * @param data An application-specific payload object that will be passed to the event handler along with the event object when firing the event
         * @param fn The function to be called when the event occurs
         * @param listener Context object to call the event handler with. Defaults to this "Group" itself
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        attachPress<CustomDataType extends object>(data: CustomDataType, fn: (event: Group$PressEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Detaches event handler "fn" from the "press" event of this "Group".
         *
         * The passed function and listener object must match the ones used for event registration.
         *
         * @param fn The function to be called, when the event occurs
         * @param listener Context object on which the given function had to be called
         * @returns Reference to "this" in order to allow method chaining
         */
        detachPress(fn: (event: Group$PressEvent) => void, listener?: object): this;

        /**
         * Fires event "press" to attached listeners.
         *
         * @param parameters Parameters to pass along with the event
         * @param [mParameters.groupId]
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        firePress(parameters?: Group$PressEventParameters): this;
    }

    /**
     * Interface describing the parameters of Group's 'press' event.
     */
    export interface Group$PressEventParameters {
        groupId?: string;
    }

    /**
     * Type describing the Group's 'press' event.
     */
    export type Group$PressEvent = Event<Group$PressEventParameters>;
}
