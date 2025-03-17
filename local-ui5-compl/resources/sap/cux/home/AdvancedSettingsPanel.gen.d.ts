declare module "sap/cux/home/AdvancedSettingsPanel" {
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import Event from "sap/ui/base/Event";
import { $BaseSettingsPanelSettings } from "./BaseSettingsPanel";

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $AdvancedSettingsPanelSettings extends $BaseSettingsPanelSettings {
        sectionsImported?: (event: AdvancedSettingsPanel$SectionsImportedEvent) => void;
    }

    export default interface AdvancedSettingsPanel {

        // event: sectionsImported

        /**
         * Attaches event handler "fn" to the "sectionsImported" event of this "AdvancedSettingsPanel".
         *
         * When called, the context of the event handler (its "this") will be bound to "oListener" if specified,
         * otherwise it will be bound to this "AdvancedSettingsPanel" itself.
         *
         * @param fn The function to be called when the event occurs
         * @param listener Context object to call the event handler with. Defaults to this "AdvancedSettingsPanel" itself
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        attachSectionsImported(fn: (event: AdvancedSettingsPanel$SectionsImportedEvent) => void, listener?: object): this;

        /**
         * Attaches event handler "fn" to the "sectionsImported" event of this "AdvancedSettingsPanel".
         *
         * When called, the context of the event handler (its "this") will be bound to "oListener" if specified,
         * otherwise it will be bound to this "AdvancedSettingsPanel" itself.
         *
         * @param data An application-specific payload object that will be passed to the event handler along with the event object when firing the event
         * @param fn The function to be called when the event occurs
         * @param listener Context object to call the event handler with. Defaults to this "AdvancedSettingsPanel" itself
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        attachSectionsImported<CustomDataType extends object>(data: CustomDataType, fn: (event: AdvancedSettingsPanel$SectionsImportedEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Detaches event handler "fn" from the "sectionsImported" event of this "AdvancedSettingsPanel".
         *
         * The passed function and listener object must match the ones used for event registration.
         *
         * @param fn The function to be called, when the event occurs
         * @param listener Context object on which the given function had to be called
         * @returns Reference to "this" in order to allow method chaining
         */
        detachSectionsImported(fn: (event: AdvancedSettingsPanel$SectionsImportedEvent) => void, listener?: object): this;

        /**
         * Fires event "sectionsImported" to attached listeners.
         *
         * @param parameters Parameters to pass along with the event
         * @returns Reference to "this" in order to allow method chaining
         */
        fireSectionsImported(parameters?: AdvancedSettingsPanel$SectionsImportedEventParameters): this;
    }

    /**
     * Interface describing the parameters of AdvancedSettingsPanel's 'sectionsImported' event.
     */
    // eslint-disable-next-line
    export interface AdvancedSettingsPanel$SectionsImportedEventParameters {
    }

    /**
     * Type describing the AdvancedSettingsPanel's 'sectionsImported' event.
     */
    export type AdvancedSettingsPanel$SectionsImportedEvent = Event<AdvancedSettingsPanel$SectionsImportedEventParameters>;
}
