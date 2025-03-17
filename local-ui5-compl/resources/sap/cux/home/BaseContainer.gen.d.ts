declare module "sap/cux/home/BaseContainer" {
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import Event from "sap/ui/base/Event";
import { CSSSize } from "sap/ui/core/library";
import BasePanel from "sap/cux/home/BasePanel";
import Button from "sap/m/Button";
import MenuItem from "sap/cux/home/MenuItem";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { AggregationBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $BaseContainerSettings extends $ControlSettings {

        /**
         * Width to be set for the container.
         */
        width?: CSSSize | PropertyBindingInfo | `{${string}}`;

        /**
         * Height to be set for the container.
         */
        height?: CSSSize | PropertyBindingInfo | `{${string}}`;

        /**
         * The container content aggregation which should be of type BasePanel.
         */
        content?: BasePanel[] | BasePanel | AggregationBindingInfo | `{${string}}`;

        /**
         * This aggregation contains the actions that should be displayed within the container.
         */
        actionButtons?: Button[] | Button | AggregationBindingInfo | `{${string}}`;

        /**
         * This aggregation holds the items that should be shown within the dropdown menu of the container.
         */
        menuItems?: MenuItem[] | MenuItem | AggregationBindingInfo | `{${string}}`;

        /**
         * Event is fired before the container is expanded.
         */
        onExpand?: (event: BaseContainer$OnExpandEvent) => void;
    }

    export default interface BaseContainer {

        // property: width

        /**
         * Gets current value of property "width".
         *
         * Width to be set for the container.
         *
         * Default value is: "100%"
         * @returns Value of property "width"
         */
        getWidth(): CSSSize;

        /**
         * Sets a new value for property "width".
         *
         * Width to be set for the container.
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: "100%"
         * @param [width="100%"] New value for property "width"
         * @returns Reference to "this" in order to allow method chaining
         */
        setWidth(width: CSSSize): this;

        // property: height

        /**
         * Gets current value of property "height".
         *
         * Height to be set for the container.
         *
         * @returns Value of property "height"
         */
        getHeight(): CSSSize;

        /**
         * Sets a new value for property "height".
         *
         * Height to be set for the container.
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * @param height New value for property "height"
         * @returns Reference to "this" in order to allow method chaining
         */
        setHeight(height: CSSSize): this;

        // aggregation: content

        /**
         * Gets content of aggregation "content".
         *
         * The container content aggregation which should be of type BasePanel.
         */
        getContent(): BasePanel[];

        /**
         * Adds some content to the aggregation "content".
         *
         * The container content aggregation which should be of type BasePanel.
         *
         * @param content The content to add; if empty, nothing is inserted
         * @returns Reference to "this" in order to allow method chaining
         */
        addContent(content: BasePanel): this;

        /**
         * Inserts a content into the aggregation "content".
         *
         * The container content aggregation which should be of type BasePanel.
         *
         * @param content The content to insert; if empty, nothing is inserted
         * @param index The "0"-based index the content should be inserted at; for
         *              a negative value of "iIndex", the content is inserted at position 0; for a value
         *              greater than the current size of the aggregation, the content is inserted at
         *              the last position
         * @returns Reference to "this" in order to allow method chaining
         */
        insertContent(content: BasePanel, index: number): this;

        /**
         * Removes a content from the aggregation "content".
         *
         * The container content aggregation which should be of type BasePanel.
         *
         * @param content The content to remove or its index or id
         * @returns The removed content or "null"
         */
        removeContent(content: number | string | BasePanel): BasePanel | null;

        /**
         * Removes all the controls from the aggregation "content".
         * Additionally, it unregisters them from the hosting UIArea.
         *
         * The container content aggregation which should be of type BasePanel.
         *
         * @returns  An array of the removed elements (might be empty)
         */
        removeAllContent(): BasePanel[];

        /**
         * Checks for the provided "sap.cux.home.BasePanel" in the aggregation "content".
         * and returns its index if found or -1 otherwise.
         *
         * The container content aggregation which should be of type BasePanel.
         *
         * @param content The content whose index is looked for
         * @returns The index of the provided control in the aggregation if found, or -1 otherwise
         */
        indexOfContent(content: BasePanel): number;

        /**
         * Destroys all the content in the aggregation "content".
         *
         * The container content aggregation which should be of type BasePanel.
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        destroyContent(): this;

        // aggregation: actionButtons

        /**
         * Gets content of aggregation "actionButtons".
         *
         * This aggregation contains the actions that should be displayed within the container.
         */
        getActionButtons(): Button[];

        /**
         * Adds some actionButton to the aggregation "actionButtons".
         *
         * This aggregation contains the actions that should be displayed within the container.
         *
         * @param actionButton The actionButton to add; if empty, nothing is inserted
         * @returns Reference to "this" in order to allow method chaining
         */
        addActionButton(actionButtons: Button): this;

        /**
         * Inserts a actionButton into the aggregation "actionButtons".
         *
         * This aggregation contains the actions that should be displayed within the container.
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
         * This aggregation contains the actions that should be displayed within the container.
         *
         * @param actionButton The actionButton to remove or its index or id
         * @returns The removed actionButton or "null"
         */
        removeActionButton(actionButtons: number | string | Button): Button | null;

        /**
         * Removes all the controls from the aggregation "actionButtons".
         * Additionally, it unregisters them from the hosting UIArea.
         *
         * This aggregation contains the actions that should be displayed within the container.
         *
         * @returns  An array of the removed elements (might be empty)
         */
        removeAllActionButtons(): Button[];

        /**
         * Checks for the provided "sap.m.Button" in the aggregation "actionButtons".
         * and returns its index if found or -1 otherwise.
         *
         * This aggregation contains the actions that should be displayed within the container.
         *
         * @param actionButton The actionButton whose index is looked for
         * @returns The index of the provided control in the aggregation if found, or -1 otherwise
         */
        indexOfActionButton(actionButtons: Button): number;

        /**
         * Destroys all the actionButtons in the aggregation "actionButtons".
         *
         * This aggregation contains the actions that should be displayed within the container.
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        destroyActionButtons(): this;

        // aggregation: menuItems

        /**
         * Gets content of aggregation "menuItems".
         *
         * This aggregation holds the items that should be shown within the dropdown menu of the container.
         */
        getMenuItems(): MenuItem[];

        /**
         * Adds some menuItem to the aggregation "menuItems".
         *
         * This aggregation holds the items that should be shown within the dropdown menu of the container.
         *
         * @param menuItem The menuItem to add; if empty, nothing is inserted
         * @returns Reference to "this" in order to allow method chaining
         */
        addMenuItem(menuItems: MenuItem): this;

        /**
         * Inserts a menuItem into the aggregation "menuItems".
         *
         * This aggregation holds the items that should be shown within the dropdown menu of the container.
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
         * This aggregation holds the items that should be shown within the dropdown menu of the container.
         *
         * @param menuItem The menuItem to remove or its index or id
         * @returns The removed menuItem or "null"
         */
        removeMenuItem(menuItems: number | string | MenuItem): MenuItem | null;

        /**
         * Removes all the controls from the aggregation "menuItems".
         * Additionally, it unregisters them from the hosting UIArea.
         *
         * This aggregation holds the items that should be shown within the dropdown menu of the container.
         *
         * @returns  An array of the removed elements (might be empty)
         */
        removeAllMenuItems(): MenuItem[];

        /**
         * Checks for the provided "sap.cux.home.MenuItem" in the aggregation "menuItems".
         * and returns its index if found or -1 otherwise.
         *
         * This aggregation holds the items that should be shown within the dropdown menu of the container.
         *
         * @param menuItem The menuItem whose index is looked for
         * @returns The index of the provided control in the aggregation if found, or -1 otherwise
         */
        indexOfMenuItem(menuItems: MenuItem): number;

        /**
         * Destroys all the menuItems in the aggregation "menuItems".
         *
         * This aggregation holds the items that should be shown within the dropdown menu of the container.
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        destroyMenuItems(): this;

        // event: onExpand

        /**
         * Attaches event handler "fn" to the "onExpand" event of this "BaseContainer".
         *
         * Event is fired before the container is expanded.
         *
         * When called, the context of the event handler (its "this") will be bound to "oListener" if specified,
         * otherwise it will be bound to this "BaseContainer" itself.
         *
         * @param fn The function to be called when the event occurs
         * @param listener Context object to call the event handler with. Defaults to this "BaseContainer" itself
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        attachOnExpand(fn: (event: BaseContainer$OnExpandEvent) => void, listener?: object): this;

        /**
         * Attaches event handler "fn" to the "onExpand" event of this "BaseContainer".
         *
         * Event is fired before the container is expanded.
         *
         * When called, the context of the event handler (its "this") will be bound to "oListener" if specified,
         * otherwise it will be bound to this "BaseContainer" itself.
         *
         * @param data An application-specific payload object that will be passed to the event handler along with the event object when firing the event
         * @param fn The function to be called when the event occurs
         * @param listener Context object to call the event handler with. Defaults to this "BaseContainer" itself
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        attachOnExpand<CustomDataType extends object>(data: CustomDataType, fn: (event: BaseContainer$OnExpandEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Detaches event handler "fn" from the "onExpand" event of this "BaseContainer".
         *
         * Event is fired before the container is expanded.
         *
         * The passed function and listener object must match the ones used for event registration.
         *
         * @param fn The function to be called, when the event occurs
         * @param listener Context object on which the given function had to be called
         * @returns Reference to "this" in order to allow method chaining
         */
        detachOnExpand(fn: (event: BaseContainer$OnExpandEvent) => void, listener?: object): this;

        /**
         * Fires event "onExpand" to attached listeners.
         *
         * Event is fired before the container is expanded.
         *
         * @param parameters Parameters to pass along with the event
         * @returns Reference to "this" in order to allow method chaining
         */
        fireOnExpand(parameters?: BaseContainer$OnExpandEventParameters): this;
    }

    /**
     * Interface describing the parameters of BaseContainer's 'onExpand' event.
     * Event is fired before the container is expanded.
     */
    // eslint-disable-next-line
    export interface BaseContainer$OnExpandEventParameters {
    }

    /**
     * Type describing the BaseContainer's 'onExpand' event.
     * Event is fired before the container is expanded.
     */
    export type BaseContainer$OnExpandEvent = Event<BaseContainer$OnExpandEventParameters>;
}
