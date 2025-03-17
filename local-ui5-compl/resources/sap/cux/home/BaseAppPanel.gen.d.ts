declare module "sap/cux/home/BaseAppPanel" {
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import Event from "sap/ui/base/Event";
import App from "sap/cux/home/App";
import { AggregationBindingInfo } from "sap/ui/base/ManagedObject";
import { $BasePanelSettings } from "./BasePanel";

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $BaseAppPanelSettings extends $BasePanelSettings {

        /**
         * Holds the apps aggregation
         */
        apps?: App[] | App | AggregationBindingInfo | `{${string}}`;

        /**
         * Fired when OnBeforeRendering of container is triggered.
         */
        navigated?: (event: BaseAppPanel$NavigatedEvent) => void;

        /**
         * Fired when the panel supported property is changed.
         */
        supported?: (event: BaseAppPanel$SupportedEvent) => void;
    }

    export default interface BaseAppPanel {

        // aggregation: apps

        /**
         * Gets content of aggregation "apps".
         *
         * Holds the apps aggregation
         */
        getApps(): App[];

        /**
         * Adds some app to the aggregation "apps".
         *
         * Holds the apps aggregation
         *
         * @param app The app to add; if empty, nothing is inserted
         * @returns Reference to "this" in order to allow method chaining
         */
        addApp(apps: App): this;

        /**
         * Inserts a app into the aggregation "apps".
         *
         * Holds the apps aggregation
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
         * Holds the apps aggregation
         *
         * @param app The app to remove or its index or id
         * @returns The removed app or "null"
         */
        removeApp(apps: number | string | App): App | null;

        /**
         * Removes all the controls from the aggregation "apps".
         * Additionally, it unregisters them from the hosting UIArea.
         *
         * Holds the apps aggregation
         *
         * @returns  An array of the removed elements (might be empty)
         */
        removeAllApps(): App[];

        /**
         * Checks for the provided "sap.cux.home.App" in the aggregation "apps".
         * and returns its index if found or -1 otherwise.
         *
         * Holds the apps aggregation
         *
         * @param app The app whose index is looked for
         * @returns The index of the provided control in the aggregation if found, or -1 otherwise
         */
        indexOfApp(apps: App): number;

        /**
         * Destroys all the apps in the aggregation "apps".
         *
         * Holds the apps aggregation
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        destroyApps(): this;

        // event: navigated

        /**
         * Attaches event handler "fn" to the "navigated" event of this "BaseAppPanel".
         *
         * Fired when OnBeforeRendering of container is triggered.
         *
         * When called, the context of the event handler (its "this") will be bound to "oListener" if specified,
         * otherwise it will be bound to this "BaseAppPanel" itself.
         *
         * @param fn The function to be called when the event occurs
         * @param listener Context object to call the event handler with. Defaults to this "BaseAppPanel" itself
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        attachNavigated(fn: (event: BaseAppPanel$NavigatedEvent) => void, listener?: object): this;

        /**
         * Attaches event handler "fn" to the "navigated" event of this "BaseAppPanel".
         *
         * Fired when OnBeforeRendering of container is triggered.
         *
         * When called, the context of the event handler (its "this") will be bound to "oListener" if specified,
         * otherwise it will be bound to this "BaseAppPanel" itself.
         *
         * @param data An application-specific payload object that will be passed to the event handler along with the event object when firing the event
         * @param fn The function to be called when the event occurs
         * @param listener Context object to call the event handler with. Defaults to this "BaseAppPanel" itself
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        attachNavigated<CustomDataType extends object>(data: CustomDataType, fn: (event: BaseAppPanel$NavigatedEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Detaches event handler "fn" from the "navigated" event of this "BaseAppPanel".
         *
         * Fired when OnBeforeRendering of container is triggered.
         *
         * The passed function and listener object must match the ones used for event registration.
         *
         * @param fn The function to be called, when the event occurs
         * @param listener Context object on which the given function had to be called
         * @returns Reference to "this" in order to allow method chaining
         */
        detachNavigated(fn: (event: BaseAppPanel$NavigatedEvent) => void, listener?: object): this;

        /**
         * Fires event "navigated" to attached listeners.
         *
         * Fired when OnBeforeRendering of container is triggered.
         *
         * @param parameters Parameters to pass along with the event
         * @returns Reference to "this" in order to allow method chaining
         */
        fireNavigated(parameters?: BaseAppPanel$NavigatedEventParameters): this;

        // event: supported

        /**
         * Attaches event handler "fn" to the "supported" event of this "BaseAppPanel".
         *
         * Fired when the panel supported property is changed.
         *
         * When called, the context of the event handler (its "this") will be bound to "oListener" if specified,
         * otherwise it will be bound to this "BaseAppPanel" itself.
         *
         * @param fn The function to be called when the event occurs
         * @param listener Context object to call the event handler with. Defaults to this "BaseAppPanel" itself
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        attachSupported(fn: (event: BaseAppPanel$SupportedEvent) => void, listener?: object): this;

        /**
         * Attaches event handler "fn" to the "supported" event of this "BaseAppPanel".
         *
         * Fired when the panel supported property is changed.
         *
         * When called, the context of the event handler (its "this") will be bound to "oListener" if specified,
         * otherwise it will be bound to this "BaseAppPanel" itself.
         *
         * @param data An application-specific payload object that will be passed to the event handler along with the event object when firing the event
         * @param fn The function to be called when the event occurs
         * @param listener Context object to call the event handler with. Defaults to this "BaseAppPanel" itself
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        attachSupported<CustomDataType extends object>(data: CustomDataType, fn: (event: BaseAppPanel$SupportedEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Detaches event handler "fn" from the "supported" event of this "BaseAppPanel".
         *
         * Fired when the panel supported property is changed.
         *
         * The passed function and listener object must match the ones used for event registration.
         *
         * @param fn The function to be called, when the event occurs
         * @param listener Context object on which the given function had to be called
         * @returns Reference to "this" in order to allow method chaining
         */
        detachSupported(fn: (event: BaseAppPanel$SupportedEvent) => void, listener?: object): this;

        /**
         * Fires event "supported" to attached listeners.
         *
         * Fired when the panel supported property is changed.
         *
         * @param parameters Parameters to pass along with the event
         * @param [mParameters.isSupported] Fired when the panel supported property is changed.
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        fireSupported(parameters?: BaseAppPanel$SupportedEventParameters): this;
    }

    /**
     * Interface describing the parameters of BaseAppPanel's 'navigated' event.
     * Fired when OnBeforeRendering of container is triggered.
     */
    // eslint-disable-next-line
    export interface BaseAppPanel$NavigatedEventParameters {
    }

    /**
     * Interface describing the parameters of BaseAppPanel's 'supported' event.
     * Fired when the panel supported property is changed.
     */
    export interface BaseAppPanel$SupportedEventParameters {
        isSupported?: boolean;
    }

    /**
     * Type describing the BaseAppPanel's 'navigated' event.
     * Fired when OnBeforeRendering of container is triggered.
     */
    export type BaseAppPanel$NavigatedEvent = Event<BaseAppPanel$NavigatedEventParameters>;

    /**
     * Type describing the BaseAppPanel's 'supported' event.
     * Fired when the panel supported property is changed.
     */
    export type BaseAppPanel$SupportedEvent = Event<BaseAppPanel$SupportedEventParameters>;
}
