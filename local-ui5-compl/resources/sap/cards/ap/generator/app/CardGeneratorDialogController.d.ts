/// <reference types="openui5" />
declare module "sap/cards/ap/generator/app/CardGeneratorDialogController" {
    import type ComboBox from "sap/m/ComboBox";
    import type Event from "sap/ui/base/Event";
    import type EventProvider from "sap/ui/base/EventProvider";
    import JSONModel from "sap/ui/model/json/JSONModel";
    import type { NavigationalData } from "../helpers/CardGeneratorModel";
    import type { ControlProperties } from "sap/cards/ap/generator/types/ActionTypes";
    import { ArrangementOptions } from "sap/cards/ap/generator/app/controls/ArrangementsEditor";
    type UnitOfMeasures = {
        propertyKeyForDescription: string;
        name: string;
        propertyKeyForId: string;
        value: string;
    };
    type ValueFormatter = {
        property: string;
    };
    type Criticality = {
        criticality: string;
        name: string;
    };
    type Property = {
        name: string;
    };
    type EventParameters = {
        selectedItem: ArrangementOptions;
        textArrangementChanged: boolean;
    };
    const context: any;
    const aPropsWithUoM: any;
    const MAX_GROUPS = 5;
    const MAX_GROUP_ITEMS = 5;
    const cardActionHandlers: {
        onActionAddClick: () => void;
        onAddedActionDelete: (oEvent: Event) => void;
        validateSelectedAction: (control: ComboBox) => boolean;
        updateRelativeproperties: (addedAction: ControlProperties, sPath: string) => void;
        filterCardActions: (comboBox: ComboBox) => void;
        loadActions: (controlEvent: Event) => void;
        onAddedActionTitleChange: (oEvent: Event) => Promise<void>;
        onAddedActionStyleChange: (oEvent: Event) => void;
    };
    const CardGeneratorDialogController: {
        initialize: (rootComponent: any, control: any, entitySet: string) => void;
        okPressed: typeof okPressed;
        cancelPressed: typeof closeDialog;
        onAddClick: typeof onAddClick;
        onGroupAddClick: typeof onGroupAddClick;
        onGroupDeleteClick: typeof onGroupDeleteClick;
        onDeleteClick: typeof onDeleteClick;
        onPropertySelection: typeof onPropertySelection;
        updateContentNavigationSelection: typeof updateContentNavigationSelection;
        onPropertyLabelChange: typeof onPropertyLabelChange;
        onTitleSelection: typeof onTitleSelection;
        onSubTitleSelection: typeof onSubTitleSelection;
        onGroupTitleChange: typeof onGroupTitleChange;
        validateContol: typeof validateContol;
        onDrop: typeof onDrop;
        onHeaderUOMSelection: typeof onHeaderUOMSelection;
        onStateIndicatorSelection: typeof onStateIndicatorSelection;
        updateHeaderNavigationSelection: typeof updateHeaderNavigationSelection;
        onHeightChange: typeof onHeightChange;
        onWidthChange: typeof onWidthChange;
        onResetPressed: typeof onResetPressed;
        onItemsActionsButtonPressed: typeof onItemsActionsButtonPressed;
        onPreviewTypeChange: typeof onPreviewTypeChange;
        toggleAdvancedSetting: typeof toggleAdvancedSetting;
        getTranslatedText: typeof getTranslatedText;
        onPropertyFormatting: typeof onPropertyFormatting;
        onActionAddClick: () => void;
        onAddedActionDelete: (oEvent: Event) => void;
        onAddedActionStyleChange: (oEvent: Event) => void;
        onAddedActionTitleChange: (oEvent: Event) => Promise<void>;
        validateSelectedAction: (control: ComboBox) => boolean;
        updateRelativeproperties: (addedAction: ControlProperties, sPath: string) => void;
        loadActions: (controlEvent: Event) => void;
        filterCardActions: (comboBox: ComboBox) => void;
        _updateTrendForCardHeader: typeof updateTrendForCardHeader;
        _updateSideIndicatorsForHeader: typeof updateSideIndicatorsForHeader;
        _setAdvancedFormattingOptionsEnablement: typeof setAdvancedFormattingOptionsEnablement;
        _updateHeaderArrangements: typeof updateHeaderArrangements;
        _updateArrangements: typeof updateArrangements;
        _updateCriticality: typeof updateCriticality;
        _validateHeader: typeof validateHeader;
        applyCriticality: typeof applyCriticality;
        applyUoMFormatting: typeof applyUoMFormatting;
        onTrendDelete: typeof onTrendDelete;
        loadAdvancedFormattingConfigurationFragment: typeof loadAdvancedFormattingConfigurationFragment;
        addLabelsForProperties: typeof addLabelsForProperties;
        checkForNavigationProperty: typeof checkForNavigationProperty;
        disableOrEnableUOMAndTrend: typeof disableOrEnableUOMAndTrend;
    };
    function getCriticality(sPropertyName: string, isCalcuationType?: boolean): any;
    /**
     * This functions updates the enablement of the advanced formatting options based on the source property.
     * @param sourceProperty
     * @returns
     */
    function setAdvancedFormattingOptionsEnablement(sourceProperty: string): void;
    /**
     * Updates "sap.card.header" property of integration card manifest and triggers rendering of the card preview.
     *
     * @param oEvent
     * @param key
     * @param fnGetHeaderConfig
     */
    function updateCardHeader(oEvent: Event, fnGetHeaderConfig: Function, key?: string): void;
    /**
     * Handles the change event for card title selection.
     * @param oEvent
     */
    function onTitleSelection(oEvent: Event): void;
    /**
     * Validates the control(control's selected key) based on the provided event and control name.
     * @param {Event} oEvent The event triggered by the control.
     * @param {string} [controlName] The name of the control being validated.
     */
    function validateContol(oEvent: Event, controlName?: string): void;
    /**
     * Handles the change event for card subtitle selection.
     * @param oEvent
     */
    function onSubTitleSelection(oEvent: Event): void;
    /**
     * Handles the change event for card header UOM selection.
     * @param oEvent
     */
    function onHeaderUOMSelection(oEvent: Event): void;
    function addLabelsForProperties(selectedNavigationProperty: NavigationalData, data: Record<string, unknown>): void;
    function updateCardConfigurationData(selectedProperty: string, selectedNavigationProperty: NavigationalData): Promise<void>;
    function updateHeaderNavigationSelection(oEvent: Event): void;
    /**
     * Handles the change event for card KPI value selection.
     * @param oEvent
     */
    function onStateIndicatorSelection(oEvent: Event): Promise<void>;
    /**
     * Disables or enables the apply unit of measure based on the selected property.
     * @param {JSONModel} model - The JSON model containing the configuration.
     * @param {string} selectedProperty - The name of the selected property.
     */
    function disableOrEnableUOMAndTrend(model: JSONModel, selectedProperty: string): void;
    function updateContentNavigationSelection(oEvent: Event): void;
    function updateSelectedNavigation(selectedKey: string, sourceProperty: string, oModel: JSONModel, source: string): void;
    function updateSelectedNavigationProperty(selectedKey: string, isHeader: boolean): Promise<void>;
    function getTranslatedText(sKey: string): any;
    function onAddClick(oEvent: Event): void;
    function okPressed(): Promise<void>;
    function validateHeader(): boolean;
    function validateIndicatorsValues(buttonId: string): boolean;
    function validateTrendValues(buttonId: string): boolean;
    function setValueStateTextForControl(controlId: string, errorMessage: string, isSelectControl?: boolean): void;
    function onGroupAddClick(oEvent: any): void;
    function onGroupDeleteClick(oEvent: any): void;
    function onGroupTitleChange(oEvent: any): void;
    function onDeleteClick(oEvent: any): void;
    /**
     * Updates the sap.card.header.mainIndicator.trend property of the integration card manifest and triggers rendering of the card preview.
     */
    function updateTrendForCardHeader(): void;
    /**
     * Updates the sap.card.header.sideIndicators property of the integration card manifest and triggers rendering of the card preview.
     */
    function updateSideIndicatorsForHeader(): void;
    /**
     * Get trend direction based on the static values.
     * @param staticValues
     * @returns
     */
    function getTrendDirection(staticValues: object | undefined): string;
    function onPropertySelection(oEvent: Event): Promise<void>;
    function onPropertyLabelChange(oEvent: any): void;
    function onDrop(oEvent: any): void;
    function onResetPressed(): void;
    function onHeightChange(oEvent: any): void;
    function onWidthChange(oEvent: any): void;
    function closeDialog(): void;
    function setCriticalitySourceProperty(sProperty: string): void;
    function onPropertyFormatting(oEvent: any): void;
    function onAdvancedFormattingConfigOpen(oEvent: any, oSource: any): void;
    function applyCriticality(oEvent: Event): void;
    function applyUoMFormatting(): void;
    function onTrendDelete(): void;
    function loadAdvancedFormattingConfigurationFragment(oSource: EventProvider, oConfigurationController: object): void;
    function onItemsActionsButtonPressed(oEvent: any): void;
    function onPreviewTypeChange(oEvent: any): void;
    /**
     * Update the sap.card.header of the integration card manifest by appling latest text arrangements, unit of measurement and formatters and triggers rendering of the card preview.
     * - This method is triggered when text arrrangement, unit of measurement or formatters are changed.
     */
    function updateHeaderArrangements(): void;
    function updateArrangements(): void;
    function updateCriticality(isCalcuationType: boolean): void;
    function checkForNavigationProperty(event: Event): Promise<void>;
    function toggleAdvancedSetting(toggleEvent: Event): Promise<void>;
}
//# sourceMappingURL=CardGeneratorDialogController.d.ts.map