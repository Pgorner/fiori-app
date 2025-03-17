declare module "sap/cux/home/TilesPanel" {
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import Event from "sap/ui/base/Event";
import { $BasePanelSettings } from "./BasePanel";

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $TilesPanelSettings extends $BasePanelSettings {
        handleHidePanel?: (event: TilesPanel$HandleHidePanelEvent) => void;
        handleUnhidePanel?: (event: TilesPanel$HandleUnhidePanelEvent) => void;
    }

    export default interface TilesPanel {

        // event: handleHidePanel

        /**
         * Attaches event handler "fn" to the "handleHidePanel" event of this "TilesPanel".
         *
         * When called, the context of the event handler (its "this") will be bound to "oListener" if specified,
         * otherwise it will be bound to this "TilesPanel" itself.
         *
         * @param fn The function to be called when the event occurs
         * @param listener Context object to call the event handler with. Defaults to this "TilesPanel" itself
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        attachHandleHidePanel(fn: (event: TilesPanel$HandleHidePanelEvent) => void, listener?: object): this;

        /**
         * Attaches event handler "fn" to the "handleHidePanel" event of this "TilesPanel".
         *
         * When called, the context of the event handler (its "this") will be bound to "oListener" if specified,
         * otherwise it will be bound to this "TilesPanel" itself.
         *
         * @param data An application-specific payload object that will be passed to the event handler along with the event object when firing the event
         * @param fn The function to be called when the event occurs
         * @param listener Context object to call the event handler with. Defaults to this "TilesPanel" itself
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        attachHandleHidePanel<CustomDataType extends object>(data: CustomDataType, fn: (event: TilesPanel$HandleHidePanelEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Detaches event handler "fn" from the "handleHidePanel" event of this "TilesPanel".
         *
         * The passed function and listener object must match the ones used for event registration.
         *
         * @param fn The function to be called, when the event occurs
         * @param listener Context object on which the given function had to be called
         * @returns Reference to "this" in order to allow method chaining
         */
        detachHandleHidePanel(fn: (event: TilesPanel$HandleHidePanelEvent) => void, listener?: object): this;

        /**
         * Fires event "handleHidePanel" to attached listeners.
         *
         * @param parameters Parameters to pass along with the event
         * @returns Reference to "this" in order to allow method chaining
         */
        fireHandleHidePanel(parameters?: TilesPanel$HandleHidePanelEventParameters): this;

        // event: handleUnhidePanel

        /**
         * Attaches event handler "fn" to the "handleUnhidePanel" event of this "TilesPanel".
         *
         * When called, the context of the event handler (its "this") will be bound to "oListener" if specified,
         * otherwise it will be bound to this "TilesPanel" itself.
         *
         * @param fn The function to be called when the event occurs
         * @param listener Context object to call the event handler with. Defaults to this "TilesPanel" itself
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        attachHandleUnhidePanel(fn: (event: TilesPanel$HandleUnhidePanelEvent) => void, listener?: object): this;

        /**
         * Attaches event handler "fn" to the "handleUnhidePanel" event of this "TilesPanel".
         *
         * When called, the context of the event handler (its "this") will be bound to "oListener" if specified,
         * otherwise it will be bound to this "TilesPanel" itself.
         *
         * @param data An application-specific payload object that will be passed to the event handler along with the event object when firing the event
         * @param fn The function to be called when the event occurs
         * @param listener Context object to call the event handler with. Defaults to this "TilesPanel" itself
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        attachHandleUnhidePanel<CustomDataType extends object>(data: CustomDataType, fn: (event: TilesPanel$HandleUnhidePanelEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Detaches event handler "fn" from the "handleUnhidePanel" event of this "TilesPanel".
         *
         * The passed function and listener object must match the ones used for event registration.
         *
         * @param fn The function to be called, when the event occurs
         * @param listener Context object on which the given function had to be called
         * @returns Reference to "this" in order to allow method chaining
         */
        detachHandleUnhidePanel(fn: (event: TilesPanel$HandleUnhidePanelEvent) => void, listener?: object): this;

        /**
         * Fires event "handleUnhidePanel" to attached listeners.
         *
         * @param parameters Parameters to pass along with the event
         * @returns Reference to "this" in order to allow method chaining
         */
        fireHandleUnhidePanel(parameters?: TilesPanel$HandleUnhidePanelEventParameters): this;
    }

    /**
     * Interface describing the parameters of TilesPanel's 'handleHidePanel' event.
     */
    // eslint-disable-next-line
    export interface TilesPanel$HandleHidePanelEventParameters {
    }

    /**
     * Interface describing the parameters of TilesPanel's 'handleUnhidePanel' event.
     */
    // eslint-disable-next-line
    export interface TilesPanel$HandleUnhidePanelEventParameters {
    }

    /**
     * Type describing the TilesPanel's 'handleHidePanel' event.
     */
    export type TilesPanel$HandleHidePanelEvent = Event<TilesPanel$HandleHidePanelEventParameters>;

    /**
     * Type describing the TilesPanel's 'handleUnhidePanel' event.
     */
    export type TilesPanel$HandleUnhidePanelEvent = Event<TilesPanel$HandleUnhidePanelEventParameters>;
}
