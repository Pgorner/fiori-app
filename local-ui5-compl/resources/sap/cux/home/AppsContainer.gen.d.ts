declare module "sap/cux/home/AppsContainer" {
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import App from "App";
import GenericTile from "GenericTile";
import Event from "sap/ui/base/Event";
import { $BaseContainerSettings } from "./BaseContainer";

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $AppsContainerSettings extends $BaseContainerSettings {

        /**
         * Event is fired when apps are loaded.
         */
        appsLoaded?: (event: AppsContainer$AppsLoadedEvent) => void;
    }

    export default interface AppsContainer {

        // event: appsLoaded

        /**
         * Attaches event handler "fn" to the "appsLoaded" event of this "AppsContainer".
         *
         * Event is fired when apps are loaded.
         *
         * When called, the context of the event handler (its "this") will be bound to "oListener" if specified,
         * otherwise it will be bound to this "AppsContainer" itself.
         *
         * @param fn The function to be called when the event occurs
         * @param listener Context object to call the event handler with. Defaults to this "AppsContainer" itself
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        attachAppsLoaded(fn: (event: AppsContainer$AppsLoadedEvent) => void, listener?: object): this;

        /**
         * Attaches event handler "fn" to the "appsLoaded" event of this "AppsContainer".
         *
         * Event is fired when apps are loaded.
         *
         * When called, the context of the event handler (its "this") will be bound to "oListener" if specified,
         * otherwise it will be bound to this "AppsContainer" itself.
         *
         * @param data An application-specific payload object that will be passed to the event handler along with the event object when firing the event
         * @param fn The function to be called when the event occurs
         * @param listener Context object to call the event handler with. Defaults to this "AppsContainer" itself
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        attachAppsLoaded<CustomDataType extends object>(data: CustomDataType, fn: (event: AppsContainer$AppsLoadedEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Detaches event handler "fn" from the "appsLoaded" event of this "AppsContainer".
         *
         * Event is fired when apps are loaded.
         *
         * The passed function and listener object must match the ones used for event registration.
         *
         * @param fn The function to be called, when the event occurs
         * @param listener Context object on which the given function had to be called
         * @returns Reference to "this" in order to allow method chaining
         */
        detachAppsLoaded(fn: (event: AppsContainer$AppsLoadedEvent) => void, listener?: object): this;

        /**
         * Fires event "appsLoaded" to attached listeners.
         *
         * Event is fired when apps are loaded.
         *
         * @param parameters Parameters to pass along with the event
         * @param [mParameters.apps] Event is fired when apps are loaded.
         * @param [mParameters.tiles] Event is fired when apps are loaded.
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        fireAppsLoaded(parameters?: AppsContainer$AppsLoadedEventParameters): this;
    }

    /**
     * Interface describing the parameters of AppsContainer's 'appsLoaded' event.
     * Event is fired when apps are loaded.
     */
    export interface AppsContainer$AppsLoadedEventParameters {
        apps?: App[];
        tiles?: GenericTile[];
    }

    /**
     * Type describing the AppsContainer's 'appsLoaded' event.
     * Event is fired when apps are loaded.
     */
    export type AppsContainer$AppsLoadedEvent = Event<AppsContainer$AppsLoadedEventParameters>;
}
