/// <reference types="openui5" />
declare module "sap/cards/ap/generator/helpers/CardGeneratorModel" {
    import Component from "sap/ui/core/Component";
    import { CardManifest } from "sap/ui/integration/widgets/Card";
    import JSONModel from "sap/ui/model/json/JSONModel";
    import ResourceModel from "sap/ui/model/resource/ResourceModel";
    import { ArrangementOptions } from "sap/cards/ap/generator/app/controls/ArrangementsEditor";
    import { PropertyInfoMap } from "sap/cards/ap/generator/odata/ODataTypes";
    import { ActionStyles, AnnotationAction, ControlProperties } from "sap/cards/ap/generator/types/ActionTypes";
    import { FormatterConfigurationMap } from "./Formatter";
    type GroupItem = {
        label: string;
        value: string;
        isEnabled: boolean;
        name: string;
        navigationProperty?: string;
        isNavigationEnabled?: boolean;
        navigationalProperties?: Array<string>;
    };
    type EntityType = {
        [key: string]: any;
    };
    type Property = {
        label?: string;
        type: string;
        name: string;
    };
    type NavigationParameter = {
        name: string;
        value: Array<string>;
        properties?: Property[];
    };
    type NavigationalData = {
        name: string;
        value: Property[];
    };
    type NavigationParameters = {
        parameters: NavigationParameter[];
    };
    type ObjectCardGroups = {
        title: string;
        items: Array<GroupItem>;
    };
    type CriticalityOptions = {
        activeCalculation: boolean;
        name: string;
        criticality: string;
    };
    type MainIndicatorOptions = {
        criticality: Array<CriticalityOptions>;
    };
    type UnitOfMeasures = {
        propertyKeyForDescription: string;
        name: string;
        propertyKeyForId: string;
        value: string;
    };
    type AdvancedFormattingOptions = {
        unitOfMeasures: Array<UnitOfMeasures>;
        textArrangements: Array<ArrangementOptions>;
        propertyValueFormatters: Array<object>;
        sourceCriticalityProperty: Array<object>;
        targetFormatterProperty: string;
        sourceUoMProperty: string;
        selectedKeyCriticality: string;
        textArrangementSourceProperty: string;
        isPropertyFormattingEnabled?: boolean;
    };
    type TrendOptions = {
        referenceValue: string;
        downDifference: string;
        upDifference: string;
        targetValue?: string;
        sourceProperty?: string;
    };
    type SideIndicatorOptions = {
        targetValue: string;
        targetUnit: string;
        deviationValue: string;
        deviationUnit: string;
        sourceProperty?: string;
    };
    type CardActions = {
        annotationActions: Array<AnnotationAction>;
        addedActions: ControlProperties[];
        bODataV4: boolean;
        styles: ActionStyles[];
        isAddActionEnabled: boolean;
        actionExists: boolean;
    };
    type PropertyValue = string | null | undefined;
    type TrendOrIndicatorOptions = {
        sourceProperty: string;
    };
    type KeyParameter = {
        key: string;
        formattedValue: string;
    };
    /**
     * Description for the interface CardGeneratorDialogConfiguration
     * @interface CardGeneratorDialogConfiguration
     * @property {string} title The title of the card
     * @property {string} subtitle The subtitle of the card
     * @property {string} headerUOM The header unit of measure
     * @property {MainIndicatorOptions} mainIndicatorOptions The main indicator options
     * @property {string} mainIndicatorStatusKey The main indicator status key
     * @property {string} mainIndicatorStatusUnit The main indicator status unit
     * @property {string} entitySet The entity set
     * @property {Array<ObjectCardGroups>} groups The groups of the card displayed on content
     * @property {Array<object>} properties The properties
     * @property {AdvancedFormattingOptions} advancedFormattingOptions The advanced formatting options
     * @property {Array<object>} selectedTrendOptions The selected trend options
     * @property {Array<object>} selectedIndicatorOptions The selected indicator options
     * @property {TrendOptions} trendOptions The trend options
     * @property {object} $data Data used for adaptive card preview
     * @property {object} targetUnit The target unit
     * @property {object} deviationUnit The deviation unit
     * @property {boolean} groupLimitReached Flag maintained to check if the group limit is reached
     * @property {Array<KeyParameter>} keyParameters The key parameters
     */
    interface CardGeneratorDialogConfiguration {
        title: string;
        subtitle?: string;
        headerUOM?: string;
        mainIndicatorOptions?: MainIndicatorOptions;
        mainIndicatorStatusKey?: string;
        mainIndicatorStatusUnit?: string;
        mainIndicatorNavigationSelectedValue?: string;
        mainIndicatorNavigationSelectedKey?: string;
        entitySet: string;
        groups: Array<ObjectCardGroups>;
        properties: Array<object>;
        advancedFormattingOptions: AdvancedFormattingOptions;
        selectedTrendOptions: Array<TrendOptions>;
        selectedIndicatorOptions: Array<SideIndicatorOptions>;
        navigationProperty: Array<object>;
        selectedContentNavigation: Array<NavigationParameter>;
        selectedHeaderNavigation: Array<NavigationParameter>;
        selectedNavigationPropertyHeader: NavigationParameter;
        trendOptions: TrendOptions;
        oDataV4: boolean;
        serviceUrl: string;
        $data?: object;
        targetUnit?: object;
        deviationUnit?: object;
        actions: CardActions;
        groupLimitReached: boolean;
        keyParameters: Array<KeyParameter>;
    }
    interface CardGeneratorDialog {
        title: string;
        configuration: CardGeneratorDialogConfiguration;
    }
    const UnitCollection: {
        Name: string;
        Value: string;
    }[];
    /**
     * Merges the default property formatters with the user provided property formatters
     *
     * @param {FormatterConfigurationMap} defaultPropertyFormatters The default property formatters
     * @param {FormatterConfigurationMap} userProvidedPropertyFormatters The user provided property formatters
     * @returns {FormatterConfigurationMap} The merged property formatters
     * @private
     *
     */
    function _mergePropertyFormatters(defaultPropertyFormatters?: FormatterConfigurationMap, userProvidedPropertyFormatters?: FormatterConfigurationMap): FormatterConfigurationMap;
    function getCardActionInfo(oAppComponent: Component, data: Record<string, PropertyValue>, resourceModel?: ResourceModel, mCardManifest?: CardManifest): Promise<{
        annotationActions: AnnotationAction[];
        addedActions: ControlProperties[];
        bODataV4: boolean;
        styles: ActionStyles[];
        isAddActionEnabled: boolean;
        actionExists: boolean;
    }>;
    function updateUnitOfMeasures(unitOfMeasures: Array<UnitOfMeasures>, formatterConfigsWithUnit: FormatterConfigurationMap): Array<UnitOfMeasures>;
    const getCardGeneratorDialogModel: (oAppComponent: Component, mCardManifest?: CardManifest) => Promise<JSONModel>;
    function addLabelsForProperties(properties: PropertyInfoMap, data: Record<string, unknown>, mData: {
        [key: string]: PropertyValue;
    }, unitOfMeasures: Array<object>): void;
    function updateNavigationPropertiesWithLabel(navigationProperties: NavigationParameter[], navigationEntityName: string, propertiesWithLabel: Property[]): void;
}
//# sourceMappingURL=CardGeneratorModel.d.ts.map