declare module "sap/cux/home/BaseLayout" {
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import Event from "sap/ui/base/Event";
import BaseContainer from "sap/cux/home/BaseContainer";
import BaseSettingsDialog from "sap/cux/home/BaseSettingsDialog";
import { AggregationBindingInfo } from "sap/ui/base/ManagedObject";
import { $PageSettings } from "sap/m/Page";

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $BaseLayoutSettings extends $PageSettings {

        /**
         * The items aggregation which should be of type BaseContainer
         */
        items?: BaseContainer[] | BaseContainer | AggregationBindingInfo | `{${string}}`;

        /**
         * The settings dialog aggregation which controls settings for my home controls.
        It should be of type BaseSettingsDialog.
        If Not provided, a default settings dialog will be created from sap.cux.home.SettingsDialog.
        In case of only custom settings panels, the settings dialog should be created and set manually from sap.cux.home.SettingsDialog.
         */
        settingsDialog?: BaseSettingsDialog;

        /**
         * The Key User Settings dialog aggregation which controls key user settings for my home.
        It should be of type BaseSettingsDialog.
        If Not provided, a default settings dialog will be created from sap.cux.home.KeyUserSettingsDialog.
        In case of only custom settings panels, the settings dialog should be created and set manually from sap.cux.home.KeyUserSettingsDialog.
         */
        keyUserSettingsDialog?: BaseSettingsDialog;

        /**
         * Event is fired after the layout is collapsed.
         */
        onCollapse?: (event: BaseLayout$OnCollapseEvent) => void;
    }

    export default interface BaseLayout {

        // aggregation: items

        /**
         * Gets content of aggregation "items".
         *
         * The items aggregation which should be of type BaseContainer
         */
        getItems(): BaseContainer[];

        /**
         * Adds some item to the aggregation "items".
         *
         * The items aggregation which should be of type BaseContainer
         *
         * @param item The item to add; if empty, nothing is inserted
         * @returns Reference to "this" in order to allow method chaining
         */
        addItem(items: BaseContainer): this;

        /**
         * Inserts a item into the aggregation "items".
         *
         * The items aggregation which should be of type BaseContainer
         *
         * @param item The item to insert; if empty, nothing is inserted
         * @param index The "0"-based index the item should be inserted at; for
         *              a negative value of "iIndex", the item is inserted at position 0; for a value
         *              greater than the current size of the aggregation, the item is inserted at
         *              the last position
         * @returns Reference to "this" in order to allow method chaining
         */
        insertItem(items: BaseContainer, index: number): this;

        /**
         * Removes a item from the aggregation "items".
         *
         * The items aggregation which should be of type BaseContainer
         *
         * @param item The item to remove or its index or id
         * @returns The removed item or "null"
         */
        removeItem(items: number | string | BaseContainer): BaseContainer | null;

        /**
         * Removes all the controls from the aggregation "items".
         * Additionally, it unregisters them from the hosting UIArea.
         *
         * The items aggregation which should be of type BaseContainer
         *
         * @returns  An array of the removed elements (might be empty)
         */
        removeAllItems(): BaseContainer[];

        /**
         * Checks for the provided "sap.cux.home.BaseContainer" in the aggregation "items".
         * and returns its index if found or -1 otherwise.
         *
         * The items aggregation which should be of type BaseContainer
         *
         * @param item The item whose index is looked for
         * @returns The index of the provided control in the aggregation if found, or -1 otherwise
         */
        indexOfItem(items: BaseContainer): number;

        /**
         * Destroys all the items in the aggregation "items".
         *
         * The items aggregation which should be of type BaseContainer
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        destroyItems(): this;

        // aggregation: settingsDialog

        /**
         * Gets content of aggregation "settingsDialog".
         *
         * The settings dialog aggregation which controls settings for my home controls.
        It should be of type BaseSettingsDialog.
        If Not provided, a default settings dialog will be created from sap.cux.home.SettingsDialog.
        In case of only custom settings panels, the settings dialog should be created and set manually from sap.cux.home.SettingsDialog.
         */
        getSettingsDialog(): BaseSettingsDialog;

        /**
         * Sets the aggregated settingsDialog.
         *
         * The settings dialog aggregation which controls settings for my home controls.
        It should be of type BaseSettingsDialog.
        If Not provided, a default settings dialog will be created from sap.cux.home.SettingsDialog.
        In case of only custom settings panels, the settings dialog should be created and set manually from sap.cux.home.SettingsDialog.
         *
         * @param settingsDialog The settingsDialog to set
         * @returns Reference to "this" in order to allow method chaining
         */
        setSettingsDialog(settingsDialog: BaseSettingsDialog): this;

        /**
         * Destroys the settingsDialog in the aggregation "settingsDialog".
         *
         * The settings dialog aggregation which controls settings for my home controls.
        It should be of type BaseSettingsDialog.
        If Not provided, a default settings dialog will be created from sap.cux.home.SettingsDialog.
        In case of only custom settings panels, the settings dialog should be created and set manually from sap.cux.home.SettingsDialog.
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        destroySettingsDialog(): this;

        // aggregation: keyUserSettingsDialog

        /**
         * Gets content of aggregation "keyUserSettingsDialog".
         *
         * The Key User Settings dialog aggregation which controls key user settings for my home.
        It should be of type BaseSettingsDialog.
        If Not provided, a default settings dialog will be created from sap.cux.home.KeyUserSettingsDialog.
        In case of only custom settings panels, the settings dialog should be created and set manually from sap.cux.home.KeyUserSettingsDialog.
         */
        getKeyUserSettingsDialog(): BaseSettingsDialog;

        /**
         * Sets the aggregated keyUserSettingsDialog.
         *
         * The Key User Settings dialog aggregation which controls key user settings for my home.
        It should be of type BaseSettingsDialog.
        If Not provided, a default settings dialog will be created from sap.cux.home.KeyUserSettingsDialog.
        In case of only custom settings panels, the settings dialog should be created and set manually from sap.cux.home.KeyUserSettingsDialog.
         *
         * @param keyUserSettingsDialog The keyUserSettingsDialog to set
         * @returns Reference to "this" in order to allow method chaining
         */
        setKeyUserSettingsDialog(keyUserSettingsDialog: BaseSettingsDialog): this;

        /**
         * Destroys the keyUserSettingsDialog in the aggregation "keyUserSettingsDialog".
         *
         * The Key User Settings dialog aggregation which controls key user settings for my home.
        It should be of type BaseSettingsDialog.
        If Not provided, a default settings dialog will be created from sap.cux.home.KeyUserSettingsDialog.
        In case of only custom settings panels, the settings dialog should be created and set manually from sap.cux.home.KeyUserSettingsDialog.
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        destroyKeyUserSettingsDialog(): this;

        // event: onCollapse

        /**
         * Attaches event handler "fn" to the "onCollapse" event of this "BaseLayout".
         *
         * Event is fired after the layout is collapsed.
         *
         * When called, the context of the event handler (its "this") will be bound to "oListener" if specified,
         * otherwise it will be bound to this "BaseLayout" itself.
         *
         * @param fn The function to be called when the event occurs
         * @param listener Context object to call the event handler with. Defaults to this "BaseLayout" itself
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        attachOnCollapse(fn: (event: BaseLayout$OnCollapseEvent) => void, listener?: object): this;

        /**
         * Attaches event handler "fn" to the "onCollapse" event of this "BaseLayout".
         *
         * Event is fired after the layout is collapsed.
         *
         * When called, the context of the event handler (its "this") will be bound to "oListener" if specified,
         * otherwise it will be bound to this "BaseLayout" itself.
         *
         * @param data An application-specific payload object that will be passed to the event handler along with the event object when firing the event
         * @param fn The function to be called when the event occurs
         * @param listener Context object to call the event handler with. Defaults to this "BaseLayout" itself
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        attachOnCollapse<CustomDataType extends object>(data: CustomDataType, fn: (event: BaseLayout$OnCollapseEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Detaches event handler "fn" from the "onCollapse" event of this "BaseLayout".
         *
         * Event is fired after the layout is collapsed.
         *
         * The passed function and listener object must match the ones used for event registration.
         *
         * @param fn The function to be called, when the event occurs
         * @param listener Context object on which the given function had to be called
         * @returns Reference to "this" in order to allow method chaining
         */
        detachOnCollapse(fn: (event: BaseLayout$OnCollapseEvent) => void, listener?: object): this;

        /**
         * Fires event "onCollapse" to attached listeners.
         *
         * Event is fired after the layout is collapsed.
         *
         * @param parameters Parameters to pass along with the event
         * @returns Reference to "this" in order to allow method chaining
         */
        fireOnCollapse(parameters?: BaseLayout$OnCollapseEventParameters): this;
    }

    /**
     * Interface describing the parameters of BaseLayout's 'onCollapse' event.
     * Event is fired after the layout is collapsed.
     */
    // eslint-disable-next-line
    export interface BaseLayout$OnCollapseEventParameters {
    }

    /**
     * Type describing the BaseLayout's 'onCollapse' event.
     * Event is fired after the layout is collapsed.
     */
    export type BaseLayout$OnCollapseEvent = Event<BaseLayout$OnCollapseEventParameters>;
}
