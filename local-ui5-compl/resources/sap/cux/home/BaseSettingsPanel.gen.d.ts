declare module "sap/cux/home/BaseSettingsPanel" {
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import Event from "sap/ui/base/Event";
import { $ElementSettings } from "sap/ui/core/Element";

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $BaseSettingsPanelSettings extends $ElementSettings {

        /**
         * Associations of the settings panel.
        Id of the panel associated with the settings panel to be provided.
        In case of multiple panels with same Id, the first panel will be associated.
        If no panel is found with the provided id, the settings panel will not be associated with any panel.
         */
        panel?: string | string;

        /**
         * Fired whenever the panel has been navigated to.
         */
        panelNavigated?: (event: BaseSettingsPanel$PanelNavigatedEvent) => void;
    }

    export default interface BaseSettingsPanel {

        // association: panel

        /**
         * ID of the element which is the current target of the association "panel", or "null".
         *
         * Associations of the settings panel.
        Id of the panel associated with the settings panel to be provided.
        In case of multiple panels with same Id, the first panel will be associated.
        If no panel is found with the provided id, the settings panel will not be associated with any panel.
         */
        getPanel(): string;

        /**
         * Sets the associated panel.
         *
         * Associations of the settings panel.
        Id of the panel associated with the settings panel to be provided.
        In case of multiple panels with same Id, the first panel will be associated.
        If no panel is found with the provided id, the settings panel will not be associated with any panel.
         *
         * @param panel ID of an element which becomes the new target of this "panel" association; alternatively, an element instance may be given
         * @returns Reference to "this" in order to allow method chaining
         */
        setPanel(panel?: string | string): this;

        // event: panelNavigated

        /**
         * Attaches event handler "fn" to the "panelNavigated" event of this "BaseSettingsPanel".
         *
         * Fired whenever the panel has been navigated to.
         *
         * When called, the context of the event handler (its "this") will be bound to "oListener" if specified,
         * otherwise it will be bound to this "BaseSettingsPanel" itself.
         *
         * @param fn The function to be called when the event occurs
         * @param listener Context object to call the event handler with. Defaults to this "BaseSettingsPanel" itself
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        attachPanelNavigated(fn: (event: BaseSettingsPanel$PanelNavigatedEvent) => void, listener?: object): this;

        /**
         * Attaches event handler "fn" to the "panelNavigated" event of this "BaseSettingsPanel".
         *
         * Fired whenever the panel has been navigated to.
         *
         * When called, the context of the event handler (its "this") will be bound to "oListener" if specified,
         * otherwise it will be bound to this "BaseSettingsPanel" itself.
         *
         * @param data An application-specific payload object that will be passed to the event handler along with the event object when firing the event
         * @param fn The function to be called when the event occurs
         * @param listener Context object to call the event handler with. Defaults to this "BaseSettingsPanel" itself
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        attachPanelNavigated<CustomDataType extends object>(data: CustomDataType, fn: (event: BaseSettingsPanel$PanelNavigatedEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Detaches event handler "fn" from the "panelNavigated" event of this "BaseSettingsPanel".
         *
         * Fired whenever the panel has been navigated to.
         *
         * The passed function and listener object must match the ones used for event registration.
         *
         * @param fn The function to be called, when the event occurs
         * @param listener Context object on which the given function had to be called
         * @returns Reference to "this" in order to allow method chaining
         */
        detachPanelNavigated(fn: (event: BaseSettingsPanel$PanelNavigatedEvent) => void, listener?: object): this;

        /**
         * Fires event "panelNavigated" to attached listeners.
         *
         * Fired whenever the panel has been navigated to.
         *
         * @param parameters Parameters to pass along with the event
         * @param [mParameters.context] Fired whenever the panel has been navigated to.
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        firePanelNavigated(parameters?: BaseSettingsPanel$PanelNavigatedEventParameters): this;
    }

    /**
     * Interface describing the parameters of BaseSettingsPanel's 'panelNavigated' event.
     * Fired whenever the panel has been navigated to.
     */
    export interface BaseSettingsPanel$PanelNavigatedEventParameters {
        context?: object;
    }

    /**
     * Type describing the BaseSettingsPanel's 'panelNavigated' event.
     * Fired whenever the panel has been navigated to.
     */
    export type BaseSettingsPanel$PanelNavigatedEvent = Event<BaseSettingsPanel$PanelNavigatedEventParameters>;
}
