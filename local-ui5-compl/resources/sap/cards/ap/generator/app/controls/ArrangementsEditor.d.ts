/// <reference types="openui5" />
/// <reference types="openui5" />
declare module "sap/cards/ap/generator/app/controls/ArrangementsEditor" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    import Button from "sap/m/Button";
    import ComboBox from "sap/m/ComboBox";
    import List from "sap/m/List";
    import Text from "sap/m/Text";
    import Event from "sap/ui/base/Event";
    import Control, { $ControlSettings } from "sap/ui/core/Control";
    import type { MetadataOptions } from "sap/ui/core/Element";
    import RenderManager from "sap/ui/core/RenderManager";
    import Model from "sap/ui/model/Model";
    import JSONModel from "sap/ui/model/json/JSONModel";
    import ResourceModel from "sap/ui/model/resource/ResourceModel";
    import { NavigationParameter, Property } from "sap/cards/ap/generator/helpers/CardGeneratorModel";
    import type { PropertyInfo } from "sap/cards/ap/generator/odata/ODataTypes";
    type ArrangementOptions = {
        name: string;
        value: string;
        propertyKeyForId?: string;
        propertyKeyForDescription: string;
        navigationKeyForId: string;
        navigationKeyForDescription: string;
        isNavigationForId: boolean;
        isNavigationForDescription: boolean;
        navigationalPropertiesForId: Property[];
        navigationalPropertiesForDescription: Property[];
        textArrangement?: string;
        arrangementType: string;
    };
    interface IArrangementsEditor {
        getMode(): string;
        getSelectionKeys(): object;
        getItems(): Array<ArrangementOptions>;
        _addButton: Button;
        _list: List;
    }
    interface ArrangementsEditorSettings extends $ControlSettings {
        mode: string;
        selectionKeys: object;
        navigationSelectionKeys: object;
        items: object;
        change?: (event: ArrangementsEditorChangeEvent) => void;
        selectionChange?: (event: ArrangementsEditorSelectionChangeEvent) => void;
    }
    interface ArrangementsEditorChangeEventParameters {
        value?: number;
    }
    interface ArrangementsEditorSelectionChangeEventParameters {
        value?: number;
    }
    type ArrangementsEditorChangeEvent = Event<ArrangementsEditorChangeEventParameters>;
    type ArrangementsEditorSelectionChangeEvent = Event<ArrangementsEditorSelectionChangeEventParameters>;
    type PropertyMap = {
        [key: string]: string;
    };
    type PropertyInfoMap = Array<PropertyMap>;
    /**
     * @namespace sap.cards.ap.generator.app.controls
     */
    export default class ArrangementsEditor extends Control {
        _list: List;
        _propertyComboBox: ComboBox;
        _idNavigationComboBox: ComboBox;
        _addButton: Button;
        _separatorColon: Text;
        _uomComboBox: ComboBox;
        _descriptionNavigationComboBox: ComboBox;
        _separatorColonText: Text;
        _textArrangementComboBox: ComboBox;
        _deleteButton: Button;
        errorFlag: boolean;
        _setSelectionKeysMap: PropertyInfo;
        static readonly metadata: MetadataOptions;
        constructor(settings: ArrangementsEditorSettings);
        renderer: {
            apiVersion: number;
            render: (rm: RenderManager, control: IArrangementsEditor) => void;
        };
        /**
         * Initializes the ArrangementsEditor custom control
         *
         * This method sets up various controls and event handlers used by the methods in this control
         *
         * @returns {void}
         */
        init(): void;
        /**
         * Performs actions after ArrangementsEditor custom control has been rendered
         *
         * This method is called after the control has been rendered in the UI
         * It updates entity data and refreshes the internal model of the TextArrangementComboBox
         *
         * @returns {void}
         */
        onAfterRendering(): void;
        /**
         * Retrieves the internal model of the ArrangementsEditor control
         *
         * This method checks if the internal model exists. If not, it creates a new JSON model
         * and sets it as the internal model. It then returns the internal model
         *
         * @returns {sap.ui.model.Model} The internal model of the control
         */
        _getInternalModel(): Model;
        getSelectedItem(): Array<ArrangementOptions>;
        /**
         * Creates and returns a JSON model for text arrangement options
         *
         * This method creates a new JSON model using the provided text arrangement options and returns it.
         *
         * @returns {sap.ui.model.json.JSONModel} A JSON model containing text arrangement options
         */
        _getTextArrangementModel(): JSONModel;
        /**
         * Handles the click event of the add button, adds a new item to the array and refreshes the model
         *
         * @returns {void}
         */
        _onAddButtonClicked(): void;
        /**
         * Handles the click event of the delete button, removes item to be deleted, refreshes the model and fires a change event
         *
         * @param {Event} event - The event object representing the click event
         * @returns {void}
         */
        _onDeleteButtonClicked(event: Event): void;
        handleComboBoxEvents(event: Event, editor: ArrangementsEditor, isNavigation?: boolean, isTextArrangementID?: boolean): any;
        getGroupName(group: ArrangementOptions, isNavigation: boolean, isTextArrangementID: boolean): string;
        getGroupValue(group: ArrangementOptions, isNavigation: boolean, isTextArrangementID: boolean, selectedKey: string, navigationProperties: NavigationParameter[]): string;
        updateControlState(control: ComboBox, value: string, selectedKey: string, isValidation: boolean, i18nModel: ResourceModel, editor: ArrangementsEditor): void;
        hasNavigationProperty(navigationProperties: NavigationParameter[], propertyToCheck: string): boolean;
    }
}
//# sourceMappingURL=ArrangementsEditor.d.ts.map