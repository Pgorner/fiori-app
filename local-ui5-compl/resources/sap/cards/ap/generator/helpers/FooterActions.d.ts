/// <reference types="openui5" />
/// <reference types="openui5" />
declare module "sap/cards/ap/generator/helpers/FooterActions" {
    import { ButtonType } from "sap/m/library";
    import type UIComponent from "sap/ui/core/Component";
    import type { AdaptiveCardAction, AdaptiveCardActionParameter, CardManifest } from "sap/ui/integration/widgets/Card";
    import V2ODataMetaModel from "sap/ui/model/odata/ODataMetaModel";
    import type { FunctionImportParameter } from "sap/ui/model/odata/ODataMetaModel/FunctionImportParameter";
    import V4ODataMetaModel from "sap/ui/model/odata/v4/ODataMetaModel";
    import V4ODataModel from "sap/ui/model/odata/v4/ODataModel";
    import ResourceModel from "sap/ui/model/resource/ResourceModel";
    import type { ActionAnnotation, ActionStyles, AnnotationAction, ControlProperties, CriticalAction } from "sap/cards/ap/generator/types/ActionTypes";
    type ActionParameter = {
        $Type?: string;
        $Nullable?: boolean;
        $Name: string;
    };
    type Action = {
        $IsBound: boolean;
        $Parameter?: Array<ActionParameter>;
        $Action?: string;
    };
    type DataFieldString = {
        String: string;
    };
    type DataFieldV4 = {
        $Type: string;
        RecordType: string;
        Label: string;
        Action: string;
    };
    type DataField = {
        $Type: string;
        RecordType: string;
        Label: DataFieldString;
        Action: DataFieldString;
    };
    type EntityTypeAnnotation = {
        [key: string]: Array<DataField>;
    };
    type ParametersInfoV2 = {
        parameterData: {
            [key: string]: Array<object>;
        };
        additionalParameters: Array<FunctionImportParameter>;
    };
    type KeyMap = {
        [key: string]: boolean;
    };
    type SkipProperty = {
        [key: string]: string;
    };
    type ValueListAnnotationInfo = {
        $model: V4ODataModel;
        ["CollectionPath"]: string;
        Parameters: Array<any>;
    };
    type PropertyValue = string | null | undefined;
    interface ValueListParameter {
        LocalDataProperty: {
            $PropertyPath: string;
        };
        ValueListProperty: {
            String: string;
        };
        RecordType: string;
    }
    /**
     * Forms the action info from the data field
     * @param dataField The data field
     * @param bODataV4 The OData version
     * @returns Action info
     */
    function formActionInfoFromDataField(dataField: DataField, bODataV4: boolean, metaModel: V2ODataMetaModel | V4ODataMetaModel, entitySetName: string): {
        label: string | DataFieldString;
        action: string | DataFieldString;
        isConfirmationRequired: boolean;
        enablePath: string;
    };
    /**
     * Gets the button type for the card
     * @param actionStyle The action style
     * @returns The button type
     */
    function getButtonTypeForCard(actionStyle: string | undefined): ButtonType.Accept | ButtonType.Default | ButtonType.Reject;
    /**
     *
     * Adds action information to integration card configuration parameters
     *
     * @param manifest
     * @param actionInfo
     * @param controlProperties
     */
    function addActionInfoToConfigParameters(manifest: CardManifest, actionInfo: AdaptiveCardAction, controlProperties: ControlProperties): void;
    /**
     *
     * Removes action information from integration card configuration parameters
     *
     * @param manifest
     * @param controlProperties
     */
    function removeActionInfoFromConfigParams(manifest: CardManifest, controlProperties: ControlProperties): void;
    /**
     *
     * Updates the style and enablePath for the adaptive card action
     *
     * @param manifest
     * @param controlProperties
     * @param adaptiveCardStyle
     * @param enablePath
     */
    function updateAdaptiveCardInfo(manifest: CardManifest, controlProperties: ControlProperties, adaptiveCardStyle: string, enablePath: string): void;
    /**
     * Adds the action to the card footer
     * @param manifest The card manifest
     * @param actionInfo The action info
     */
    function addActionToCardFooter(manifest: CardManifest, actionInfo: AdaptiveCardAction, controlProperties: ControlProperties): void;
    /**
     * Gets the action styles for the card
     * @returns The action styles
     */
    function getActionStyles(): ActionStyles[];
    /**
     * Forms action info from the data field
     * @param dataFields The data fields
     * @param bODataV4 The OData version
     * @returns Action info
     */
    function getActionFromDataField(dataFields: Array<DataField>, bODataV4: boolean, metaModel: V2ODataMetaModel | V4ODataMetaModel, entitySetName: string): AnnotationAction[];
    /**
     *
     * Updates the action parameter data to the model data.
     * Resolves the i18n keys for label, errorMessage and placeholder properties of adaptive card action parameters.
     *
     *
     * @param actionParameters
     * @param data
     * @param resourceBundle
     */
    const updateActionParameterData: (actionParameters: AdaptiveCardActionParameter[], data: Record<string, PropertyValue>, resourceBundle?: ResourceModel) => Promise<void>;
    /**
     *
     * Gets the saved action from card manifest
     * Resolves i18n keys to text for label and ok button used for Submit type of action in adaptive card.
     *
     * @param cardManifest
     * @param data
     * @param resourceBundle
     * @returns
     */
    const getActionsFromManifest: (cardManifest: CardManifest, data: Record<string, PropertyValue>, resourceBundle?: ResourceModel) => Promise<ControlProperties[]>;
    /**
     * Gets the saved actions if exists in card manifest otherwise an initial action with default values
     *
     * @param resourceModel
     * @param data
     * @param mCardManifest
     * @returns
     */
    const getDefaultAction: (resourceModel?: ResourceModel, data?: Record<string, PropertyValue>, mCardManifest?: CardManifest) => Promise<ControlProperties[]>;
    /**
     * Gets the card actions
     * @param appComponent The app component
     * @param entitySetName The entity set name
     * @param bODataV4 The OData version
     * @returns The card actions
     */
    function getCardActions(appComponent: UIComponent, entitySetName: string, bODataV4: boolean): AnnotationAction[];
    /**
     * Adds the action to the card manifest
     * @param manifest The card manifest
     * @param controlProperties The control properties
     * @param context
     */
    function addActionToCardManifest(manifest: CardManifest, controlProperties: ControlProperties, context: any): Promise<void>;
    /**
     * Removes the action from the card manifest
     * @param manifest The card manifest
     * @param controlProperties The control properties
     */
    function removeActionFromManifest(manifest: CardManifest, controlProperties: ControlProperties): void;
    /**
     * Updates the actions in the footer of the card manifest based on the provided control properties.
     *
     * @param {CardManifest} manifest - The card manifest object that contains the footer actions.
     */
    function resetCardActions(manifest: CardManifest): void;
    /**
     * Updates the actions in the footer of the card manifest based on the provided control properties.
     *
     * @param {CardManifest} manifest - The card manifest object that contains the footer actions.
     * @param {ControlProperties} controlProperties - The control properties used to update the footer actions.
     */
    function updateCardManifestAction(manifest: CardManifest, controlProperties: ControlProperties): void;
    /**
     * Gets the action style
     * @param controlProperties The control properties
     * @returns Action style
     */
    function getActionStyle(controlProperties: ControlProperties): string;
    /**
     *
     * Gets the OData V2 action parameters for the card
     *
     * @param parameters The parameters
     * @param context The context
     * @returns The OData V2 action parameters
     */
    const getActionParameters: (parameters: Array<FunctionImportParameter>, context: any) => Promise<AdaptiveCardActionParameter[]>;
    /**
     * Forms the Adaptive Card action from the control properties
     * @param controlProperties The control properties
     * @param bODataV4 The OData version
     * @param metaModel The meta model
     * @param context Context
     * @returns The action info
     */
    const getAdaptiveCardAction: (controlProperties: ControlProperties, bODataV4: boolean, metaModel: V2ODataMetaModel | V4ODataMetaModel, context: any) => Promise<AdaptiveCardAction>;
    /**
     * Gets the related bound action for OData V4 model
     * @param actionValue The action value
     * @param actionType The action type
     * @returns Bound action
     */
    function getRelatedBoundAction(actionValue: Array<Action>, actionType: string): Action[];
    /**
     * Returns the related unbound actions for OData V4 model
     * @param actionValue The action value
     * @returns
     */
    function getRelatedUnboundActions(actionValue: Array<Action>): Action[];
    /**
     * Gets the valuehelp info for OData V4 metamodel
     *
     * @param metaModel
     * @param contextPath
     * @param actionParamName
     * @returns
     */
    const getValueHelpInfo: (metaModel: V4ODataMetaModel, contextPath: string, actionParamName?: string) => Promise<{
        valueHelpAnnotation: any;
        valueListPropertyName: string;
        valueHelpEntitySet: string;
        valueListModelServiceUrl: string;
    }>;
    /**
     * Returns the action parameter name for OData V4 model
     * @param context
     * @param actionVerb
     * @param actionParamName
     * @returns The action parameter label for OData V4 model
     */
    const getActionParameterName: (context: any, actionVerb: string, actionParamName?: string) => Promise<any>;
    /**
     * Returns the value list property name from annotations
     *
     * @param oValueList
     * @param sPropertyName
     * @returns
     */
    function getValueListPropertyName(oValueList: ValueListAnnotationInfo, sPropertyName: string): string;
    /**
     * Function to get the action parameter value based on the text arrangement annotation
     *
     * @param propertyPath
     * @param descriptionPath
     * @param textArrangementType
     * @returns
     */
    function getActionParameterValue(propertyPath: string, descriptionPath: string, textArrangementType: string): string;
    /**
     * Updates the model data with value help data for the action parameter
     *
     * @param data
     * @param serviceUrl
     * @param valueHelpEntitySet
     */
    const updateModelData: (data: Record<string, PropertyValue>, serviceUrl: string, valueHelpEntitySet: string) => Promise<void>;
    /**
     * Get Action Parameter Data for OData V4 model
     *
     * @param context
     * @param actionVerb
     * @param actionParamName
     * @returns
     */
    const getActionParameterConfiguration: (context: any, actionVerb: string, actionParamName?: string) => Promise<{
        serviceUrl: string;
        value: string;
        entitySet: string;
        title: string;
    }>;
    /**
     * Get Action Parameter Info for OData V4 application's Action
     *
     * The action parameter will consist of errorMessage and placeholder which will be used by adaptive card.
     * Currently the errorMessage and placeholder will have values only for actions having dropdown value as input.
     *
     * @param relatedAction The related action
     * @param context The context
     * @param actionVerb The action verb
     * @param isBoundAction Is bound action
     * @returns The action parameter info
     */
    const getActionParameterInfo: (relatedAction: Action, context: any, actionVerb: string, isBoundAction?: boolean) => Promise<any>;
    /**
     * Gets the enabled value from annotation
     *
     * @param actionAnnotation
     * @returns
     */
    function getEnabledValueFromAnnotation(actionAnnotation: ActionAnnotation): string;
    /**
     * Gets the critical value from annotation
     *
     * @param oCriticalAnnotation
     * @returns
     */
    function getCriticalValueFromAnnotation(oCriticalAnnotation: CriticalAction): boolean;
    /**
     *
     * Returns the metadata annotation info for OData V4 model ( enabled or critical value coming from metadata annotations )
     *
     * @param dataField
     * @param metaModel
     * @param entityTypeName
     * @returns
     */
    function getMetadataAnnotationInfoV4(dataField: DataFieldV4, metaModel: V4ODataMetaModel, entitySetName: string): {
        enablePath: string;
        isConfirmationRequired: boolean;
    };
    /**
     * Get the metadata annotation info for OData V2 model
     *
     * @param dataField
     * @param metaModel
     * @returns
     */
    function getMetadataAnnotationInfoV2(dataField: DataField, metaModel: V2ODataMetaModel): {
        enablePath: any;
        isConfirmationRequired: boolean;
    };
    /**
     * Gets the action parameters for OData V4 model
     * @param controlProperties The control properties
     * @param metaModel The meta model
     * @param context The context
     * @returns Action parameters
     */
    const getActionParams: (controlProperties: ControlProperties, metaModel: V4ODataMetaModel, context: any) => Promise<any>;
    /**
     * Get the action verb for OData V4 model
     * @param controlProperties The control properties
     * @param metaModel The meta model
     * @returns Returns the action string
     */
    function getActionVerb(controlProperties: ControlProperties, metaModel: V4ODataMetaModel): string;
    /**
     * Get the function import info for OData V2 model's action
     *
     * @param controlProperties The control properties
     * @param metaModel The meta model
     * @param context Current context
     * @returns Functionimport info
     */
    function getFunctionImportInfo(controlProperties: ControlProperties, metaModel: V2ODataMetaModel, context: any): {
        mActionParams: ParametersInfoV2;
        functionImport: FunctionImport;
    };
    /**
     * Get the property keys for the entity type
     * @param entityType The entity type
     * @returns The property keys map
     */
    const getPropertyKeys: (entityType: EntityType) => KeyMap;
    /**
     * Adds the parameter label to the entity type property
     *
     * @param parameter The Action parameter
     * @param entityType The entity type
     * @param metaModel The meta model
     */
    const addParameterLabel: (parameter: FunctionImportParameter, entityType: EntityType, metaModel: V2ODataMetaModel) => void;
    /**
     *
     * Returns the service URL, valueListPropertyPath, descriptionPath for OData V2 model using the value list parameters
     *
     * @param serviceUrlPrefix
     * @param valueListParameters
     * @returns
     */
    function getParameterConfigFromValueList(serviceUrlPrefix: string, valueListParameters: ValueListParameter[]): {
        serviceUrl: string;
        valueListPropertyPath: string;
        descriptionPath: string;
    };
    /**
     *
     * Get the action parameter configuration for OData V2 model
     *
     * @param parameter
     * @param context
     * @returns The action parameter configuration for OData V2 model
     */
    const getActionParameterConfigurationV2: (parameter: FunctionImportParameter, context: any) => Promise<{
        entitySet: any;
        serviceUrl: string;
        value: string;
        title: string;
    }>;
}
//# sourceMappingURL=FooterActions.d.ts.map