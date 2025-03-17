/// <reference types="openui5" />
/// <reference types="openui5" />
declare module "sap/cards/ap/generator/app/controls/CompactFormatterSelection" {
    import Button from "sap/m/Button";
    import ComboBox from "sap/m/ComboBox";
    import List from "sap/m/List";
    import Select from "sap/m/Select";
    import Event from "sap/ui/base/Event";
    import Control, { $ControlSettings } from "sap/ui/core/Control";
    import type { MetadataOptions } from "sap/ui/core/Element";
    import RenderManager from "sap/ui/core/RenderManager";
    import type { FormatterConfiguration, FormatterConfigurationMap } from "sap/cards/ap/generator/helpers/Formatter";
    export default interface FormatterSelection {
        getType(): string;
        getFormatters(): FormatterConfigurationMap;
    }
    interface PropertyType {
        value: number;
        defaultValue: number;
    }
    type PropertyOptions = {
        name: string;
        value: string;
    };
    interface CompactFormatterSelectionSettings extends $ControlSettings {
        type: string;
        formatters: FormatterConfiguration;
        change?: (event: CompactFormatterSelection$ChangeEvent) => void;
    }
    interface CompactFormatterSelectionChangeEventParameters {
        value?: object;
    }
    type CompactFormatterSelection$ChangeEvent = Event<CompactFormatterSelectionChangeEventParameters>;
    /**
     * @namespace sap.cards.ap.generator.app.controls
     */
    export default class CompactFormatterSelection extends Control {
        _selectorControl: ComboBox;
        _deleteButton: Button;
        _applyButton: Button;
        _List: List;
        static readonly metadata: MetadataOptions;
        constructor(settings: CompactFormatterSelectionSettings);
        renderer: {
            apiVersion: number;
            render: (rm: RenderManager, control: FormatterSelection) => void;
        };
        /**
         * Initializes the component
         * This method creates a new List control (_List) and calls the superclass's init method
         *
         * @returns {void}
         */
        init(): void;
        /**
         * Refreshes the control with the provided formatter
         * @param {FormatterConfiguration} formatter - The formatter to be used for refreshing the control
         * @returns {void}
         * @private
         */
        _refreshControl(formatter: FormatterConfiguration): void;
        /**
         * Creates a select control with the formatter list based on the provided type
         *
         * @param {string} type - The type of the control to be created
         * @returns {void}
         */
        createControl(type: string): void;
        /**
         * Creates a control for displaying and editing parameters based on the provided property type
         *
         * @param {string} id - ID of the control
         * @param {*} context - context object containing information about the property
         * @returns {sap.ui.core.Control} A control for displaying and editing parameters
         * @private
         */
        _createParametersControl(id: string, context: any): Control;
        setDefaultStepInputValue(prop: PropertyType): PropertyType;
        /**
         * Creates a select control based on the provided selected key and property options
         *
         * @param {string} selectedKey - The selected key for the select control
         * @param {Array<PropertyOptions>} propertyOptions - An array of propertyOptions representing the options for the select control
         * @returns {sap.m.Select} Select control populated with the provided property options
         * @private
         */
        _createSelectControl(selectedKey: string, propertyOptions: Array<PropertyOptions>): Select;
        /**
         * Handles the event when a formatter is selected
         *
         * @param {Event} event - The event object representing the selection event
         * @returns {void}
         */
        onFormatterSelected(event: Event): void;
        /**
         * Applies the selected formatter to the control, fires the change event with the updated propertyValueFormatters
         *
         * @returns {void}
         */
        applyFormatter(): void;
        /**
         * Deletes the selected formatter from the control, fires the change event with the updated propertyValueFormatters
         *
         * @returns {void}
         */
        deleteFormatter(): void;
        /**
         * Updates the propertyValueFormatters model with the provided formatter configuration
         *
         * @param formatterConfig - The formatter configuration to be updated
         * @returns {void}
         * @private
         */
        _updatePropertyValueFormatters(formatterConfig: FormatterConfiguration): void;
    }
}
//# sourceMappingURL=CompactFormatterSelection.d.ts.map