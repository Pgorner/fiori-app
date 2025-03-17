declare module "sap/cux/home/BasePanel" {
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import Event from "sap/ui/base/Event";
import Button from "sap/m/Button";
import MenuItem from "sap/cux/home/MenuItem";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { AggregationBindingInfo } from "sap/ui/base/ManagedObject";
import { $ElementSettings } from "sap/ui/core/Element";

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $BasePanelSettings extends $ElementSettings {

        /**
         * Title for the panel.
         */
        title?: string | PropertyBindingInfo;

        /**
         * Key for the panel.
         */
        key?: string | PropertyBindingInfo;

        /**
         * Specifies the actions to be shown within the panel.
         */
        actionButtons?: Button[] | Button | AggregationBindingInfo | `{${string}}`;

        /**
         * Specifies the items that are shown within the dropdown menu of the panel.
         */
        menuItems?: MenuItem[] | MenuItem | AggregationBindingInfo | `{${string}}`;

        /**
         * Event is fired before the container is expanded.
         */
        onExpand?: (event: BasePanel$OnExpandEvent) => void;
    }

    export default interface BasePanel {

        // property: title

        /**
         * Gets current value of property "title".
         *
         * Title for the panel.
         *
         * Default value is: ""
         * @returns Value of property "title"
         */
        getTitle(): string;

        /**
         * Sets a new value for property "title".
         *
         * Title for the panel.
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: ""
         * @param [title=""] New value for property "title"
         * @returns Reference to "this" in order to allow method chaining
         */
        setTitle(title: string): this;

        // property: key

        /**
         * Gets current value of property "key".
         *
         * Key for the panel.
         *
         * Default value is: ""
         * @returns Value of property "key"
         */
        getKey(): string;

        /**
         * Sets a new value for property "key".
         *
         * Key for the panel.
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: ""
         * @param [key=""] New value for property "key"
         * @returns Reference to "this" in order to allow method chaining
         */
        setKey(key: string): this;

        // aggregation: actionButtons

        /**
         * Gets content of aggregation "actionButtons".
         *
         * Specifies the actions to be shown within the panel.
         */
        getActionButtons(): Button[];

        /**
         * Adds some actionButton to the aggregation "actionButtons".
         *
         * Specifies the actions to be shown within the panel.
         *
         * @param actionButton The actionButton to add; if empty, nothing is inserted
         * @returns Reference to "this" in order to allow method chaining
         */
        addActionButton(actionButtons: Button): this;

        /**
         * Inserts a actionButton into the aggregation "actionButtons".
         *
         * Specifies the actions to be shown within the panel.
         *
         * @param actionButton The actionButton to insert; if empty, nothing is inserted
         * @param index The "0"-based index the actionButton should be inserted at; for
         *              a negative value of "iIndex", the actionButton is inserted at position 0; for a value
         *              greater than the current size of the aggregation, the actionButton is inserted at
         *              the last position
         * @returns Reference to "this" in order to allow method chaining
         */
        insertActionButton(actionButtons: Button, index: number): this;

        /**
         * Removes a actionButton from the aggregation "actionButtons".
         *
         * Specifies the actions to be shown within the panel.
         *
         * @param actionButton The actionButton to remove or its index or id
         * @returns The removed actionButton or "null"
         */
        removeActionButton(actionButtons: number | string | Button): Button | null;

        /**
         * Removes all the controls from the aggregation "actionButtons".
         * Additionally, it unregisters them from the hosting UIArea.
         *
         * Specifies the actions to be shown within the panel.
         *
         * @returns  An array of the removed elements (might be empty)
         */
        removeAllActionButtons(): Button[];

        /**
         * Checks for the provided "sap.m.Button" in the aggregation "actionButtons".
         * and returns its index if found or -1 otherwise.
         *
         * Specifies the actions to be shown within the panel.
         *
         * @param actionButton The actionButton whose index is looked for
         * @returns The index of the provided control in the aggregation if found, or -1 otherwise
         */
        indexOfActionButton(actionButtons: Button): number;

        /**
         * Destroys all the actionButtons in the aggregation "actionButtons".
         *
         * Specifies the actions to be shown within the panel.
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        destroyActionButtons(): this;

        // aggregation: menuItems

        /**
         * Gets content of aggregation "menuItems".
         *
         * Specifies the items that are shown within the dropdown menu of the panel.
         */
        getMenuItems(): MenuItem[];

        /**
         * Adds some menuItem to the aggregation "menuItems".
         *
         * Specifies the items that are shown within the dropdown menu of the panel.
         *
         * @param menuItem The menuItem to add; if empty, nothing is inserted
         * @returns Reference to "this" in order to allow method chaining
         */
        addMenuItem(menuItems: MenuItem): this;

        /**
         * Inserts a menuItem into the aggregation "menuItems".
         *
         * Specifies the items that are shown within the dropdown menu of the panel.
         *
         * @param menuItem The menuItem to insert; if empty, nothing is inserted
         * @param index The "0"-based index the menuItem should be inserted at; for
         *              a negative value of "iIndex", the menuItem is inserted at position 0; for a value
         *              greater than the current size of the aggregation, the menuItem is inserted at
         *              the last position
         * @returns Reference to "this" in order to allow method chaining
         */
        insertMenuItem(menuItems: MenuItem, index: number): this;

        /**
         * Removes a menuItem from the aggregation "menuItems".
         *
         * Specifies the items that are shown within the dropdown menu of the panel.
         *
         * @param menuItem The menuItem to remove or its index or id
         * @returns The removed menuItem or "null"
         */
        removeMenuItem(menuItems: number | string | MenuItem): MenuItem | null;

        /**
         * Removes all the controls from the aggregation "menuItems".
         * Additionally, it unregisters them from the hosting UIArea.
         *
         * Specifies the items that are shown within the dropdown menu of the panel.
         *
         * @returns  An array of the removed elements (might be empty)
         */
        removeAllMenuItems(): MenuItem[];

        /**
         * Checks for the provided "sap.cux.home.MenuItem" in the aggregation "menuItems".
         * and returns its index if found or -1 otherwise.
         *
         * Specifies the items that are shown within the dropdown menu of the panel.
         *
         * @param menuItem The menuItem whose index is looked for
         * @returns The index of the provided control in the aggregation if found, or -1 otherwise
         */
        indexOfMenuItem(menuItems: MenuItem): number;

        /**
         * Destroys all the menuItems in the aggregation "menuItems".
         *
         * Specifies the items that are shown within the dropdown menu of the panel.
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        destroyMenuItems(): this;

        // event: onExpand

        /**
         * Attaches event handler "fn" to the "onExpand" event of this "BasePanel".
         *
         * Event is fired before the container is expanded.
         *
         * When called, the context of the event handler (its "this") will be bound to "oListener" if specified,
         * otherwise it will be bound to this "BasePanel" itself.
         *
         * @param fn The function to be called when the event occurs
         * @param listener Context object to call the event handler with. Defaults to this "BasePanel" itself
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        attachOnExpand(fn: (event: BasePanel$OnExpandEvent) => void, listener?: object): this;

        /**
         * Attaches event handler "fn" to the "onExpand" event of this "BasePanel".
         *
         * Event is fired before the container is expanded.
         *
         * When called, the context of the event handler (its "this") will be bound to "oListener" if specified,
         * otherwise it will be bound to this "BasePanel" itself.
         *
         * @param data An application-specific payload object that will be passed to the event handler along with the event object when firing the event
         * @param fn The function to be called when the event occurs
         * @param listener Context object to call the event handler with. Defaults to this "BasePanel" itself
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        attachOnExpand<CustomDataType extends object>(data: CustomDataType, fn: (event: BasePanel$OnExpandEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Detaches event handler "fn" from the "onExpand" event of this "BasePanel".
         *
         * Event is fired before the container is expanded.
         *
         * The passed function and listener object must match the ones used for event registration.
         *
         * @param fn The function to be called, when the event occurs
         * @param listener Context object on which the given function had to be called
         * @returns Reference to "this" in order to allow method chaining
         */
        detachOnExpand(fn: (event: BasePanel$OnExpandEvent) => void, listener?: object): this;

        /**
         * Fires event "onExpand" to attached listeners.
         *
         * Event is fired before the container is expanded.
         *
         * @param parameters Parameters to pass along with the event
         * @returns Reference to "this" in order to allow method chaining
         */
        fireOnExpand(parameters?: BasePanel$OnExpandEventParameters): this;
    }

    /**
     * Interface describing the parameters of BasePanel's 'onExpand' event.
     * Event is fired before the container is expanded.
     */
    // eslint-disable-next-line
    export interface BasePanel$OnExpandEventParameters {
    }

    /**
     * Type describing the BasePanel's 'onExpand' event.
     * Event is fired before the container is expanded.
     */
    export type BasePanel$OnExpandEvent = Event<BasePanel$OnExpandEventParameters>;
}
