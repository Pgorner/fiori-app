/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import Log from "sap/base/Log";
import { ButtonType } from "sap/m/library";
import type UIComponent from "sap/ui/core/Component";
import CoreLib from "sap/ui/core/Lib";
import type {
	ActionParameterConfiguration,
	AdaptiveCardAction,
	AdaptiveCardActionParameter,
	CardManifest,
	Data
} from "sap/ui/integration/widgets/Card";
import V2ODataMetaModel from "sap/ui/model/odata/ODataMetaModel";
import type { EntitySet } from "sap/ui/model/odata/ODataMetaModel/EntitySet";
import type { EntityType } from "sap/ui/model/odata/ODataMetaModel/EntityType";
import type { FunctionImport } from "sap/ui/model/odata/ODataMetaModel/FunctionImport";
import type { FunctionImportParameter } from "sap/ui/model/odata/ODataMetaModel/FunctionImportParameter";
import type { Property } from "sap/ui/model/odata/ODataMetaModel/Property";
import V2ODataModel from "sap/ui/model/odata/v2/ODataModel";
import V4ODataMetaModel from "sap/ui/model/odata/v4/ODataMetaModel";
import V4ODataModel from "sap/ui/model/odata/v4/ODataModel";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import { ApplicationInfo, ODataModelVersion } from "../helpers/ApplicationInfo";
import { resolveI18nTextFromResourceModel } from "../helpers/I18nHelper";
import type { ActionAnnotation, ActionStyles, AnnotationAction, ControlProperties, CriticalAction } from "../types/ActionTypes";

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
function formActionInfoFromDataField(
	dataField: DataField,
	bODataV4: boolean,
	metaModel: V2ODataMetaModel | V4ODataMetaModel,
	entitySetName: string
) {
	let metadataAnnotationInfo = {
		isConfirmationRequired: false,
		enablePath: ""
	};

	if (bODataV4) {
		metadataAnnotationInfo = getMetadataAnnotationInfoV4(
			dataField as unknown as DataFieldV4,
			metaModel as V4ODataMetaModel,
			entitySetName
		);
	} else {
		metadataAnnotationInfo = getMetadataAnnotationInfoV2(dataField as unknown as DataField, metaModel as V2ODataMetaModel);
	}

	return {
		label: bODataV4 ? dataField.Label : dataField.Label.String,
		action: bODataV4 ? dataField.Action : dataField.Action.String.split("/")[1],
		isConfirmationRequired: metadataAnnotationInfo.isConfirmationRequired || false,
		enablePath: metadataAnnotationInfo.enablePath
	};
}

/**
 * Gets the button type for the card
 * @param actionStyle The action style
 * @returns The button type
 */

function getButtonTypeForCard(actionStyle: string | undefined) {
	if (actionStyle === "Positive") {
		return ButtonType.Accept;
	}
	if (actionStyle === "Negative") {
		return ButtonType.Reject;
	}
	return ButtonType.Default;
}

/**
 *
 * Adds action information to integration card configuration parameters
 *
 * @param manifest
 * @param actionInfo
 * @param controlProperties
 */
function addActionInfoToConfigParameters(manifest: CardManifest, actionInfo: AdaptiveCardAction, controlProperties: ControlProperties) {
	if (!manifest["sap.card"].configuration) {
		manifest["sap.card"].configuration = {
			parameters: {
				footerActionParameters: {},
				_adaptiveFooterActionParameters: {}
			}
		};
	} else if (manifest["sap.card"].configuration && !manifest["sap.card"].configuration.parameters) {
		manifest["sap.card"].configuration.parameters = {
			footerActionParameters: {},
			_adaptiveFooterActionParameters: {}
		};
	}

	const cardConfiguration = manifest["sap.card"].configuration;
	const configParams = cardConfiguration.parameters;

	if (configParams && !configParams._adaptiveFooterActionParameters) {
		configParams._adaptiveFooterActionParameters = {};
	}
	if (configParams && !configParams.footerActionParameters) {
		configParams.footerActionParameters = {};
	}

	if (configParams?._adaptiveFooterActionParameters && configParams?.footerActionParameters) {
		configParams.footerActionParameters[controlProperties.titleKey] = actionInfo.parameters || {};
		configParams._adaptiveFooterActionParameters[controlProperties.titleKey] = actionInfo || {};
	}
}

/**
 *
 * Removes action information from integration card configuration parameters
 *
 * @param manifest
 * @param controlProperties
 */
function removeActionInfoFromConfigParams(manifest: CardManifest, controlProperties: ControlProperties) {
	const cardConfiguration = manifest["sap.card"].configuration;
	const configParams = cardConfiguration?.parameters;
	if (configParams?._adaptiveFooterActionParameters && configParams?.footerActionParameters) {
		delete configParams.footerActionParameters[controlProperties.titleKey];
		delete configParams._adaptiveFooterActionParameters[controlProperties.titleKey];
	}
}

/**
 *
 * Updates the style and enablePath for the adaptive card action
 *
 * @param manifest
 * @param controlProperties
 * @param adaptiveCardStyle
 * @param enablePath
 */
function updateAdaptiveCardInfo(
	manifest: CardManifest,
	controlProperties: ControlProperties,
	adaptiveCardStyle: string,
	enablePath: string
) {
	const cardConfiguration = manifest["sap.card"].configuration;
	const configParams = cardConfiguration?.parameters;

	if (configParams?._adaptiveFooterActionParameters && configParams?.footerActionParameters) {
		const adaptiveCardActionInfo = configParams._adaptiveFooterActionParameters[controlProperties.titleKey];
		adaptiveCardActionInfo.style = adaptiveCardStyle;
		adaptiveCardActionInfo.enablePath = enablePath;
	}
}

/**
 * Adds the action to the card footer
 * @param manifest The card manifest
 * @param actionInfo The action info
 */
function addActionToCardFooter(manifest: CardManifest, actionInfo: AdaptiveCardAction, controlProperties: ControlProperties) {
	let cardFooter = manifest["sap.card"].footer;

	if (!cardFooter) {
		manifest["sap.card"].footer = {
			actionsStrip: []
		};
		cardFooter = manifest["sap.card"].footer;
	}

	const actionLength = cardFooter.actionsStrip.length;

	if (actionLength < 2) {
		cardFooter.actionsStrip.push({
			type: "Button",
			visible: false,
			text: actionInfo.label,
			buttonType: getButtonTypeForCard(actionInfo.style),
			actions: [
				{
					type: "custom",
					enabled: actionInfo.enablePath ? "${" + actionInfo.enablePath + "}" : "true",
					parameters: "{{parameters.footerActionParameters." + controlProperties.titleKey + "}}"
				}
			]
		});

		addActionInfoToConfigParameters(manifest, actionInfo, controlProperties);
	}
}

/**
 * Gets the action styles for the card
 * @returns The action styles
 */
export function getActionStyles() {
	const actionStyles: Array<ActionStyles> = [
		{
			name: "Default",
			label: "Default",
			labelWithValue: "Default"
		},
		{
			name: "Positive",
			label: "Positive",
			labelWithValue: "Positive"
		},
		{
			name: "Negative",
			label: "Negative",
			labelWithValue: "Negative"
		}
	];

	return actionStyles;
}

/**
 * Forms action info from the data field
 * @param dataFields The data fields
 * @param bODataV4 The OData version
 * @returns Action info
 */
function getActionFromDataField(
	dataFields: Array<DataField>,
	bODataV4: boolean,
	metaModel: V2ODataMetaModel | V4ODataMetaModel,
	entitySetName: string
) {
	const actions: Array<AnnotationAction> = [];
	const dataFieldForAnnotation: string = "com.sap.vocabularies.UI.v1.DataFieldForAction";

	dataFields
		?.filter(function (dataField: DataField) {
			const dataFieldType: string = bODataV4 ? dataField?.$Type : dataField?.RecordType;
			return dataFieldType === dataFieldForAnnotation;
		})
		.map(function (dataField: DataField) {
			const actionInfo = formActionInfoFromDataField(dataField, bODataV4, metaModel, entitySetName) as AnnotationAction;
			actions.push(actionInfo);
		});

	return actions;
}

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
const updateActionParameterData = async function (
	actionParameters: AdaptiveCardActionParameter[],
	data: Record<string, PropertyValue>,
	resourceBundle?: ResourceModel
) {
	for (const actionParameter of actionParameters) {
		if (resourceBundle) {
			actionParameter.label = resolveI18nTextFromResourceModel(actionParameter.label, resourceBundle);
			actionParameter.errorMessage = resolveI18nTextFromResourceModel(actionParameter?.errorMessage || "", resourceBundle);
			actionParameter.placeholder = resolveI18nTextFromResourceModel(actionParameter?.placeholder || "", resourceBundle);
		}

		const actionParameterConfig = actionParameter.configuration;
		const valueHelpEntitySet = actionParameterConfig?.entitySet;

		if (valueHelpEntitySet) {
			await updateModelData(data, actionParameterConfig?.serviceUrl, valueHelpEntitySet);
		}
	}
};

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
const getActionsFromManifest = async function (
	cardManifest: CardManifest,
	data: Record<string, PropertyValue>,
	resourceBundle?: ResourceModel
) {
	const cardConfiguration = cardManifest["sap.card"].configuration;
	const configParams = cardConfiguration?.parameters;
	const actions: Array<ControlProperties> = [];

	if (configParams?._adaptiveFooterActionParameters) {
		const _adaptiveFooterActionParameters = configParams._adaptiveFooterActionParameters;
		const aKeys = Object.keys(_adaptiveFooterActionParameters);

		for (const key of aKeys) {
			const action = _adaptiveFooterActionParameters[key];

			if (resourceBundle) {
				action.label = resolveI18nTextFromResourceModel(action.label, resourceBundle);
				action.triggerActionText = resolveI18nTextFromResourceModel(action.triggerActionText, resourceBundle);
			}

			if (action.actionParameters?.length) {
				await updateActionParameterData(action.actionParameters, data, resourceBundle);
			}

			let style = "Default";

			if (action.style === "positive") {
				style = "Positive";
			} else if (action.style === "destructive") {
				style = "Negative";
			}

			const actionInfo: ControlProperties = {
				title: action.label,
				titleKey: key,
				style: style,
				enablePathKey: action.enablePath,
				isStyleControlEnabled: true,
				isConfirmationRequired: action.data?.isConfirmationRequired || false,
				triggerActionText: action.triggerActionText
			};
			actions.push(actionInfo);
		}
		return actions;
	}

	return [
		{
			title: "",
			titleKey: "",
			style: "Default",
			enablePathKey: "",
			isStyleControlEnabled: false
		}
	];
};

/**
 * Gets the saved actions if exists in card manifest otherwise an initial action with default values
 *
 * @param resourceModel
 * @param data
 * @param mCardManifest
 * @returns
 */
export const getDefaultAction = async function (
	resourceModel?: ResourceModel,
	data?: Record<string, PropertyValue>,
	mCardManifest?: CardManifest
) {
	if (mCardManifest && data) {
		return await getActionsFromManifest(mCardManifest, data, resourceModel);
	}

	return [
		{
			title: "",
			titleKey: "",
			style: "Default",
			enablePathKey: "",
			isStyleControlEnabled: false
		}
	];
};

/**
 * Gets the card actions
 * @param appComponent The app component
 * @param entitySetName The entity set name
 * @param bODataV4 The OData version
 * @returns The card actions
 */
export function getCardActions(appComponent: UIComponent, entitySetName: string, bODataV4: boolean) {
	const appModel = bODataV4 ? (appComponent.getModel() as V2ODataModel) : (appComponent.getModel() as V4ODataModel),
		metaModel = appModel.getMetaModel(),
		entitySet: EntitySet = bODataV4
			? metaModel.getObject("/" + entitySetName)
			: (metaModel as V2ODataMetaModel).getODataEntitySet(entitySetName),
		entityTypeName: string = bODataV4 ? entitySet?.$Type : entitySet?.entityType,
		entityType: EntityType = bODataV4
			? metaModel.getObject("/" + entityTypeName)
			: (metaModel as V2ODataMetaModel).getODataEntityType(entityTypeName),
		identificationPath: string = bODataV4 ? "@com.sap.vocabularies.UI.v1.Identification" : "com.sap.vocabularies.UI.v1.Identification";
	let entityTypeAnnotation: EntityTypeAnnotation = {};

	if (bODataV4) {
		entityTypeAnnotation = metaModel.getObject("/" + entityTypeName + "@");
	}

	const entityTypeKeys: Array<string> = bODataV4 ? Object.keys(entityTypeAnnotation) : Object.keys(entityType);
	const identificationAnnotation: Array<string> = entityTypeKeys?.filter((key: string) => {
		return key === identificationPath;
	});
	let dataFields: Array<DataField> = [];

	if (identificationAnnotation?.length) {
		dataFields = bODataV4 ? entityTypeAnnotation[identificationPath] : entityType[identificationPath];
	}

	return getActionFromDataField(dataFields, bODataV4, metaModel, entitySetName);
}

/**
 * Adds the action to the card manifest
 * @param manifest The card manifest
 * @param controlProperties The control properties
 * @param context
 */
export async function addActionToCardManifest(manifest: CardManifest, controlProperties: ControlProperties, context: any) {
	const bODataV4: boolean = context.dialog.getModel().getProperty("/configuration/actions/bODataV4");
	const metaModel: V2ODataMetaModel | V4ODataMetaModel = context.appModel.getMetaModel();
	const actionInfo = await getAdaptiveCardAction(controlProperties, bODataV4, metaModel, context);
	addActionToCardFooter(manifest, actionInfo, controlProperties);
}

/**
 * Removes the action from the card manifest
 * @param manifest The card manifest
 * @param controlProperties The control properties
 */
export function removeActionFromManifest(manifest: CardManifest, controlProperties: ControlProperties) {
	const cardFooter = manifest["sap.card"]?.footer;
	const actionLength = cardFooter?.actionsStrip.length;

	if (actionLength && cardFooter) {
		const relatedAction = cardFooter.actionsStrip.filter((actionsStrip) => {
			const cardParameters = actionsStrip.actions[0].parameters;
			return cardParameters !== "{{parameters.footerActionParameters." + controlProperties.titleKey + "}}";
		});

		if (relatedAction.length) {
			cardFooter.actionsStrip = relatedAction;
		} else {
			delete manifest["sap.card"]?.footer;
		}

		removeActionInfoFromConfigParams(manifest, controlProperties);
	}
}

/**
 * Updates the actions in the footer of the card manifest based on the provided control properties.
 *
 * @param {CardManifest} manifest - The card manifest object that contains the footer actions.
 */
export function resetCardActions(manifest: CardManifest) {
	manifest["sap.card"].footer = {
		actionsStrip: []
	};

	const cardConfiguration = manifest["sap.card"].configuration;
	const configParams = cardConfiguration?.parameters;
	if (configParams) {
		configParams._adaptiveFooterActionParameters = {};
		configParams.footerActionParameters = {};
	}
}

/**
 * Updates the actions in the footer of the card manifest based on the provided control properties.
 *
 * @param {CardManifest} manifest - The card manifest object that contains the footer actions.
 * @param {ControlProperties} controlProperties - The control properties used to update the footer actions.
 */
export function updateCardManifestAction(manifest: CardManifest, controlProperties: ControlProperties) {
	const cardFooter = manifest["sap.card"].footer;
	const actionLength = cardFooter?.actionsStrip.length;

	if (actionLength && cardFooter) {
		cardFooter.actionsStrip.forEach((actionsStrip) => {
			const action = actionsStrip.actions[0];
			const cardParameters = action.parameters;

			if (cardParameters === "{{parameters.footerActionParameters." + controlProperties.titleKey + "}}") {
				const isEnabledExpression = controlProperties.enablePathKey ? "${" + controlProperties.enablePathKey + "}" : "true";
				const adaptiveCardStyle = getActionStyle(controlProperties);
				actionsStrip.buttonType = getButtonTypeForCard(controlProperties.style);
				action.enabled = isEnabledExpression;
				updateAdaptiveCardInfo(manifest, controlProperties, adaptiveCardStyle, controlProperties.enablePathKey || "");
			}
		});
	}
}

/**
 * Gets the action style
 * @param controlProperties The control properties
 * @returns Action style
 */

function getActionStyle(controlProperties: ControlProperties) {
	let actionStyle: string = "default";

	if (controlProperties.style === "Positive") {
		actionStyle = "positive";
	} else if (controlProperties.style === "Negative") {
		actionStyle = "destructive";
	}
	return actionStyle;
}

/**
 *
 * Gets the OData V2 action parameters for the card
 *
 * @param parameters The parameters
 * @param context The context
 * @returns The OData V2 action parameters
 */
const getActionParameters = async function (parameters: Array<FunctionImportParameter>, context: any) {
	const actionParameters: Array<AdaptiveCardActionParameter> = [];
	const oResourceBundle = CoreLib.getResourceBundleFor("sap.cards.ap.generator.i18n");

	for (const parameter of parameters) {
		const EnumMember = parameter?.["com.sap.vocabularies.Common.v1.FieldControl"]?.EnumMember;
		const isRequired = EnumMember === "com.sap.vocabularies.Common.v1.FieldControlType/Mandatory" || parameter?.nullable === "false";
		const actionParamInfoToAdd: AdaptiveCardActionParameter = {
			label: parameter?.["sap:label"] || parameter?.name || "",
			id: parameter?.name || "",
			isRequired: isRequired,
			errorMessage: isRequired ? oResourceBundle.getText("GENERATOR_ADAPTIVE_CARD_ACTION_PARAMETERS_ERROR_MESSAGE") : "",
			placeholder: ""
		};

		if (parameter?.["sap:value-list"] === "fixed-values") {
			const actionParameterConfig = await getActionParameterConfigurationV2(parameter, context);

			if (actionParameterConfig?.entitySet) {
				actionParamInfoToAdd.configuration = actionParameterConfig;
				actionParamInfoToAdd.placeholder = oResourceBundle.getText("GENERATOR_ADAPTIVE_CARD_ACTION_PARAMETERS_PLACEHOLDER");
			}
		}
		actionParameters.push(actionParamInfoToAdd);
	}

	return actionParameters;
};

/**
 * Forms the Adaptive Card action from the control properties
 * @param controlProperties The control properties
 * @param bODataV4 The OData version
 * @param metaModel The meta model
 * @param context Context
 * @returns The action info
 */
const getAdaptiveCardAction = async function (
	controlProperties: ControlProperties,
	bODataV4: boolean,
	metaModel: V2ODataMetaModel | V4ODataMetaModel,
	context: any
) {
	const oResourceBundle = CoreLib.getResourceBundleFor("sap.cards.ap.generator.i18n");
	const actionStyle = getActionStyle(controlProperties);
	let actionParameters: Array<AdaptiveCardActionParameter> = [];
	let functionImportInfo;
	const data: Data = {
		isConfirmationRequired: controlProperties.isConfirmationRequired || false
	};
	const enabledPathKey = controlProperties.enablePathKey;
	const actionInfo: AdaptiveCardAction = {
		style: actionStyle,
		verb: "",
		label: controlProperties.title,
		actionParameters: [],
		data: data,
		enablePath: enabledPathKey || "",
		triggerActionText: oResourceBundle.getText("GENERATOR_ADAPTIVE_CARD_SUBMIT_ACTION_OK_BUTTON")
	};

	if (bODataV4) {
		actionParameters = await getActionParams(controlProperties, metaModel as V4ODataMetaModel, context);
		actionInfo.verb = getActionVerb(controlProperties, metaModel as V4ODataMetaModel);
		actionInfo.actionParameters = actionParameters || [];

		return actionInfo;
	} else {
		functionImportInfo = getFunctionImportInfo(controlProperties, metaModel as V2ODataMetaModel, context);
		actionInfo.verb = controlProperties.titleKey;
		actionInfo.parameters = functionImportInfo?.mActionParams?.parameterData;
		actionInfo.actionParameters = await getActionParameters(functionImportInfo?.mActionParams?.additionalParameters, context);
		data.actionParams = {
			keys: Object.keys(functionImportInfo?.mActionParams?.parameterData)
		};
		actionInfo.data = data;

		return actionInfo;
	}
};

/**
 * Gets the related bound action for OData V4 model
 * @param actionValue The action value
 * @param actionType The action type
 * @returns Bound action
 */

function getRelatedBoundAction(actionValue: Array<Action>, actionType: string) {
	return actionValue?.filter((action: Action) => {
		const isBoundAction: boolean = action?.$IsBound;
		if (isBoundAction) {
			return action?.$Parameter?.some((actionParam: ActionParameter) => {
				return actionType === actionParam?.$Type;
			});
		}
	});
}

/**
 * Returns the related unbound actions for OData V4 model
 * @param actionValue The action value
 * @returns
 */
function getRelatedUnboundActions(actionValue: Array<Action>) {
	return actionValue?.filter((action: Action) => {
		return !action?.$IsBound;
	});
}

/**
 * Gets the valuehelp info for OData V4 metamodel
 *
 * @param metaModel
 * @param contextPath
 * @param actionParamName
 * @returns
 */
const getValueHelpInfo = async function (metaModel: V4ODataMetaModel, contextPath: string, actionParamName?: string) {
	const valueListInfo = await metaModel.requestValueListInfo(contextPath, true);
	const valueListAnnotationInfo = valueListInfo?.[""] as ValueListAnnotationInfo;
	const valueListModel = valueListAnnotationInfo?.$model;
	const valueListPropertyName = getValueListPropertyName(valueListAnnotationInfo, actionParamName || "");
	const valueHelpEntitySet = valueListAnnotationInfo?.["CollectionPath"];
	const valueHelpAnnotation = valueListModel?.getMetaModel()?.getObject(`/${valueHelpEntitySet}/${valueListPropertyName}@`);
	return {
		valueHelpAnnotation,
		valueListPropertyName,
		valueHelpEntitySet,
		valueListModelServiceUrl: valueListModel?.getServiceUrl()
	};
};

/**
 * Returns the action parameter name for OData V4 model
 * @param context
 * @param actionVerb
 * @param actionParamName
 * @returns The action parameter label for OData V4 model
 */
const getActionParameterName = async function (context: any, actionVerb: string, actionParamName?: string) {
	if (actionParamName) {
		const entitySetName = context.entitySet;
		const metaModel = context.appModel.getMetaModel();
		const contextPath = `/${entitySetName}/${actionVerb}/${actionParamName}`;
		const entitySet: EntitySet = metaModel.getObject("/" + context?.entitySet);
		const actionParameterAnnotation = metaModel.getObject("/" + entitySet?.$Type + "/" + actionParamName + "@");

		if (metaModel.getObject(`${contextPath}@`)?.["@com.sap.vocabularies.Common.v1.ValueListWithFixedValues"]) {
			const { valueHelpAnnotation } = await getValueHelpInfo(metaModel as V4ODataMetaModel, contextPath, actionParamName);

			return (
				actionParameterAnnotation?.["@com.sap.vocabularies.Common.v1.Label"] ||
				valueHelpAnnotation?.["@com.sap.vocabularies.Common.v1.Label"]
			);
		}

		return actionParameterAnnotation?.["@com.sap.vocabularies.Common.v1.Label"] || actionParamName;
	}
};

/**
 * Returns the value list property name from annotations
 *
 * @param oValueList
 * @param sPropertyName
 * @returns
 */
function getValueListPropertyName(oValueList: ValueListAnnotationInfo, sPropertyName: string): string {
	const oValueListParameter = oValueList?.Parameters.find(function (oParameter: ValueListParameter) {
		return oParameter?.LocalDataProperty?.$PropertyPath === sPropertyName;
	});
	return oValueListParameter?.ValueListProperty;
}

/**
 * Function to get the action parameter value based on the text arrangement annotation
 *
 * @param propertyPath
 * @param descriptionPath
 * @param textArrangementType
 * @returns
 */
export function getActionParameterValue(propertyPath: string, descriptionPath: string, textArrangementType: string): string {
	if (textArrangementType === "TextOnly") {
		return "${" + descriptionPath + "}";
	} else if (textArrangementType === "TextLast") {
		return "${" + propertyPath + "}" + " (" + "${" + descriptionPath + "}" + ")";
	} else if (textArrangementType === "TextSeparate") {
		return "${" + propertyPath + "}";
	}

	return "${" + descriptionPath + "}" + " (${" + propertyPath + "})";
}

/**
 * Updates the model data with value help data for the action parameter
 *
 * @param data
 * @param serviceUrl
 * @param valueHelpEntitySet
 */
export const updateModelData = async function (data: Record<string, PropertyValue>, serviceUrl: string, valueHelpEntitySet: string) {
	const valueHelpData = await fetch(serviceUrl);
	const { odataModel } = ApplicationInfo.getInstance().fetchDetails();
	const bODataV4 = odataModel === ODataModelVersion.V4;

	if (valueHelpData && typeof valueHelpData.json === "function") {
		const valueHelpDataJson = await valueHelpData.json();
		const valueHelpDataValue = bODataV4 ? valueHelpDataJson?.value : valueHelpDataJson?.d?.results;

		if (valueHelpDataValue?.length) {
			data[valueHelpEntitySet] = valueHelpDataValue;
		}
	}
};

/**
 * Get Action Parameter Data for OData V4 model
 *
 * @param context
 * @param actionVerb
 * @param actionParamName
 * @returns
 */
const getActionParameterConfiguration = async function (context: any, actionVerb: string, actionParamName?: string) {
	const actionParameterConfig = {
		serviceUrl: "",
		value: "",
		entitySet: "",
		title: ""
	};

	if (!actionParamName) {
		return actionParameterConfig;
	}

	const entitySetName = context.entitySet;
	const oDialogModel = context.dialog.getModel();
	const metaModel = context.appModel.getMetaModel();
	const contextPath = `/${entitySetName}/${actionVerb}/${actionParamName}`;
	const actionParamAnnotations = metaModel.getObject(`${contextPath}@`);
	if (!actionParamAnnotations?.["@com.sap.vocabularies.Common.v1.ValueListWithFixedValues"]) {
		return actionParameterConfig;
	}

	const { valueHelpAnnotation, valueListPropertyName, valueHelpEntitySet, valueListModelServiceUrl } = await getValueHelpInfo(
		metaModel as V4ODataMetaModel,
		contextPath,
		actionParamName
	);
	const textArrangementPath = valueHelpAnnotation?.["@com.sap.vocabularies.Common.v1.Text"]?.$Path;
	const textArrangementAnnotation =
		valueHelpAnnotation?.["@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement"];
	const actionParameterValue =
		(textArrangementAnnotation?.$EnumMember && valueListPropertyName && textArrangementPath) ||
		(valueListPropertyName && textArrangementPath)
			? getActionParameterValue(valueListPropertyName, textArrangementPath, textArrangementAnnotation?.$EnumMember?.split("/")[1])
			: "${" + valueListPropertyName + "}";

	let serviceUrl = valueListModelServiceUrl;
	serviceUrl =
		valueListPropertyName && textArrangementPath
			? `${serviceUrl}${valueHelpEntitySet}?$select=${valueListPropertyName},${textArrangementPath}`
			: `${serviceUrl}${valueHelpEntitySet}?$select=${valueListPropertyName}`;
	serviceUrl = `${serviceUrl}&skip=0&$top=20`;

	const data = oDialogModel.getProperty("/configuration/$data");
	await updateModelData(data, serviceUrl, valueHelpEntitySet);
	oDialogModel.setProperty("/configuration/$data", data);

	return {
		entitySet: valueHelpEntitySet,
		serviceUrl: serviceUrl,
		value: actionParameterValue,
		title: "${" + valueListPropertyName + "}"
	};
};

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
const getActionParameterInfo = async function (relatedAction: Action, context: any, actionVerb: string, isBoundAction?: boolean) {
	const actionParamInfo: any = [];
	let actionIndex = 0;

	if (relatedAction && relatedAction.$Parameter) {
		const oResourceBundle = CoreLib.getResourceBundleFor("sap.cards.ap.generator.i18n");

		for (const actionParam of relatedAction.$Parameter) {
			const isActionRequired = !isBoundAction || (isBoundAction && actionIndex > 0);
			if (isActionRequired) {
				const isRequired = actionParam.$Nullable === false;
				const actionParamInfoToAdd: AdaptiveCardActionParameter = {
					isRequired: isRequired,
					id: actionParam.$Name,
					label: await getActionParameterName(context, actionVerb, actionParam.$Name),
					errorMessage: isRequired ? oResourceBundle.getText("GENERATOR_ADAPTIVE_CARD_ACTION_PARAMETERS_ERROR_MESSAGE") : "",
					placeholder: ""
				};
				const actionParameterConfig = (await getActionParameterConfiguration(
					context,
					actionVerb,
					actionParam.$Name
				)) as ActionParameterConfiguration;
				if (actionParameterConfig?.entitySet) {
					actionParamInfoToAdd["configuration"] = actionParameterConfig;
					actionParamInfoToAdd.placeholder = oResourceBundle.getText("GENERATOR_ADAPTIVE_CARD_ACTION_PARAMETERS_PLACEHOLDER");
				}
				actionParamInfo.push(actionParamInfoToAdd);
			}
			actionIndex++;

			if (actionIndex === relatedAction.$Parameter.length) {
				return actionParamInfo;
			}
		}
	}
};

/**
 * Gets the enabled value from annotation
 *
 * @param actionAnnotation
 * @returns
 */
function getEnabledValueFromAnnotation(actionAnnotation: ActionAnnotation) {
	if (actionAnnotation) {
		const operationAvailable = actionAnnotation["@Org.OData.Core.V1.OperationAvailable"];

		if (operationAvailable?.$Path) {
			return operationAvailable.$Path;
		} else if (operationAvailable?.Bool) {
			return operationAvailable.Bool;
		}
	}

	return "";
}

/**
 * Gets the critical value from annotation
 *
 * @param oCriticalAnnotation
 * @returns
 */
function getCriticalValueFromAnnotation(oCriticalAnnotation: CriticalAction) {
	if (!oCriticalAnnotation) {
		return false;
	}
	if (oCriticalAnnotation.Bool === undefined) {
		return true;
	}

	const oParameterValue = oCriticalAnnotation.Bool;

	if (typeof oParameterValue === "string") {
		const oActionValue = oParameterValue.toLowerCase();
		return !(oActionValue == "false" || oActionValue == "" || oActionValue == " ");
	}

	return !!oParameterValue;
}

/**
 *
 * Returns the metadata annotation info for OData V4 model ( enabled or critical value coming from metadata annotations )
 *
 * @param dataField
 * @param metaModel
 * @param entityTypeName
 * @returns
 */

function getMetadataAnnotationInfoV4(dataField: DataFieldV4, metaModel: V4ODataMetaModel, entitySetName: string) {
	const dataFieldAction = dataField.Action;
	const actionVerb = dataFieldAction.indexOf("(") > -1 ? dataFieldAction.split("(")[0] : dataFieldAction;
	const actionAnnotation = metaModel.getObject("/" + entitySetName + "/" + actionVerb + "@");
	const enablePath = getEnabledValueFromAnnotation(actionAnnotation);
	const isConfirmationRequired = getCriticalValueFromAnnotation(actionAnnotation?.["@com.sap.vocabularies.UI.v1.Critical"]);

	return {
		enablePath: enablePath,
		isConfirmationRequired: isConfirmationRequired
	};
}

/**
 * Get the metadata annotation info for OData V2 model
 *
 * @param dataField
 * @param metaModel
 * @returns
 */
function getMetadataAnnotationInfoV2(dataField: DataField, metaModel: V2ODataMetaModel) {
	const functionName: string = dataField.Action.String.split("/")[1];
	const functionImport: FunctionImport = metaModel.getODataFunctionImport(functionName);

	return {
		enablePath: functionImport?.["sap:applicable-path"] || "",
		isConfirmationRequired: getCriticalValueFromAnnotation(functionImport?.["com.sap.vocabularies.Common.v1.IsActionCritical"])
	};
}

/**
 * Gets the action parameters for OData V4 model
 * @param controlProperties The control properties
 * @param metaModel The meta model
 * @param context The context
 * @returns Action parameters
 */
const getActionParams = async function (controlProperties: ControlProperties, metaModel: V4ODataMetaModel, context: any) {
	const titleKey = controlProperties.titleKey || "";
	const actionVerb: string = titleKey.indexOf("(") > -1 ? titleKey.split("(")[0] : titleKey;
	const actionValue = metaModel.getObject(`/${context.entitySet}/${actionVerb}`);
	let actionType: string = titleKey.indexOf("(") > -1 ? titleKey?.split("(")[1] : "";
	actionType = actionType.indexOf(")") > -1 ? actionType.replace(")", "") : actionType;

	//Get action Parameters for unbound action
	if (actionValue?.$kind === "ActionImport" && actionValue?.$Action) {
		const unBoundActions = metaModel.getObject("/" + actionValue?.$Action);
		const relatedUnboundAction = getRelatedUnboundActions(unBoundActions);
		return getActionParameterInfo(relatedUnboundAction[0], context, actionVerb);
	}

	//Get action Parameters for Bound actions
	const relatedBoundAction = getRelatedBoundAction(actionValue, actionType);

	if (relatedBoundAction?.length && relatedBoundAction[0]?.$Parameter != null && relatedBoundAction[0]?.$Parameter.length > 1) {
		return await getActionParameterInfo(relatedBoundAction[0], context, actionVerb, true);
	}
};

/**
 * Get the action verb for OData V4 model
 * @param controlProperties The control properties
 * @param metaModel The meta model
 * @returns Returns the action string
 */
function getActionVerb(controlProperties: ControlProperties, metaModel: V4ODataMetaModel) {
	const titleKey = controlProperties.titleKey || "";
	const actionVerb = titleKey.indexOf("(") > -1 ? titleKey.split("(")[0] : titleKey;
	const actionValue = metaModel.getObject("/" + actionVerb) || [];
	let actionType: string = titleKey.indexOf("(") > -1 ? titleKey.split("(")[1] : "";
	actionType = actionType.indexOf(")") > -1 ? actionType.replace(")", "") : actionType;

	//Get action string for unbound action
	if (actionValue?.$kind === "ActionImport" && actionValue?.$Action) {
		return titleKey?.split("/")[1];
	}

	const relatedBoundAction = getRelatedBoundAction(actionValue, actionType);
	//Get action string for bound action
	if (relatedBoundAction?.length) {
		return actionVerb;
	}

	return actionVerb;
}

/**
 * Get the function import info for OData V2 model's action
 *
 * @param controlProperties The control properties
 * @param metaModel The meta model
 * @param context Current context
 * @returns Functionimport info
 */
function getFunctionImportInfo(controlProperties: ControlProperties, metaModel: V2ODataMetaModel, context: any) {
	const functionName: string = controlProperties.titleKey;
	const functionImport: FunctionImport = metaModel.getODataFunctionImport(functionName);
	const oContextObject = context.dialog.getModel().getProperty("/configuration/$data");
	const entitySet: EntitySet = metaModel.getODataEntitySet(context?.entitySet);
	const entityType: EntityType = metaModel.getODataEntityType(entitySet?.entityType);
	const mKeyProperties: KeyMap = getPropertyKeys(entityType);
	const oSkipProperties: SkipProperty = {};
	const mActionParams: ParametersInfoV2 = {
		parameterData: {},
		additionalParameters: []
	};

	functionImport?.parameter?.forEach(function (importParameter: FunctionImportParameter) {
		addParameterLabel(importParameter, entityType, metaModel);

		const parameterName: string = importParameter?.name || "";
		const isKey = !!mKeyProperties[parameterName];
		let parameterValue;

		if (oContextObject?.hasOwnProperty(parameterName)) {
			parameterValue = oContextObject[parameterName];
		} else if (isKey && oContextObject && functionImport["sap:action-for"]) {
			// parameter is key but not part of the current projection - raise error
			Log.error("Key parameter of action not found in current context: " + parameterName);
			throw new Error("Key parameter of action not found in current context: " + parameterName);
		}

		mActionParams.parameterData[parameterName] = parameterValue;

		const skip = !!oSkipProperties[parameterName];
		if (!skip && (!isKey || !functionImport["sap:action-for"]) && importParameter.mode.toUpperCase() == "IN") {
			// offer as optional parameter with default value from context
			mActionParams.additionalParameters.push(importParameter);
		}
	});

	return {
		mActionParams: mActionParams,
		functionImport: functionImport
	};
}

/**
 * Get the property keys for the entity type
 * @param entityType The entity type
 * @returns The property keys map
 */
const getPropertyKeys = function (entityType: EntityType) {
	const oKeyMap: KeyMap = {};

	entityType.key.propertyRef.forEach((property: Property) => {
		if (property.name) {
			oKeyMap[property.name] = true;
		}
	});

	return oKeyMap;
};

/**
 * Adds the parameter label to the entity type property
 *
 * @param parameter The Action parameter
 * @param entityType The entity type
 * @param metaModel The meta model
 */
const addParameterLabel = function (parameter: FunctionImportParameter, entityType: EntityType, metaModel: V2ODataMetaModel) {
	if (entityType && parameter && !parameter["com.sap.vocabularies.Common.v1.Label"]) {
		const property: Property = metaModel.getODataProperty(entityType, parameter.name, false);
		if (property && property["com.sap.vocabularies.Common.v1.Label"]) {
			// copy label from property to parameter with same name as default if no label is set for function import parameter
			parameter["com.sap.vocabularies.Common.v1.Label"] = property["com.sap.vocabularies.Common.v1.Label"];
		}
	}
};

/**
 *
 * Returns the service URL, valueListPropertyPath, descriptionPath for OData V2 model using the value list parameters
 *
 * @param serviceUrlPrefix
 * @param valueListParameters
 * @returns
 */
function getParameterConfigFromValueList(serviceUrlPrefix: string, valueListParameters: ValueListParameter[]) {
	const selectProps: Array<string> = [];
	let valueListPropertyPath = "",
		descriptionPath = "";

	valueListParameters.forEach((valueListParameter) => {
		const valueListProperty = valueListParameter?.ValueListProperty?.String;
		if (valueListProperty) {
			selectProps.push(valueListProperty);
			descriptionPath =
				valueListParameter?.RecordType === "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					? valueListProperty
					: descriptionPath;
			valueListPropertyPath =
				valueListParameter?.RecordType === "com.sap.vocabularies.Common.v1.ValueListParameterInOut"
					? valueListProperty
					: valueListPropertyPath;
		}
	});

	const serviceUrl = `${serviceUrlPrefix}?$select=${selectProps.join(",")}`;

	return {
		serviceUrl,
		valueListPropertyPath,
		descriptionPath
	};
}

/**
 *
 * Get the action parameter configuration for OData V2 model
 *
 * @param parameter
 * @param context
 * @returns The action parameter configuration for OData V2 model
 */
export const getActionParameterConfigurationV2 = async function (parameter: FunctionImportParameter, context: any) {
	const actionParameterConfig = {
		serviceUrl: "",
		value: "",
		entitySet: "",
		title: ""
	};

	if (!parameter) {
		return actionParameterConfig;
	}

	const ValueListAnnotation = parameter?.["com.sap.vocabularies.Common.v1.ValueList"];
	const valueListParameters = ValueListAnnotation?.Parameters as ValueListParameter[];
	const entitySetName = ValueListAnnotation?.CollectionPath?.String;
	const { serviceUrl, valueListPropertyPath, descriptionPath } = getParameterConfigFromValueList(
		`${context.appModel.sServiceUrl}/${entitySetName}`,
		valueListParameters
	);

	let textArrangementType = "TextOnly";

	if (parameter?.["com.sap.vocabularies.UI.v1.TextArrangement"]) {
		textArrangementType = parameter["com.sap.vocabularies.UI.v1.TextArrangement"]?.EnumMember?.split("/")[1];
	}

	const actionParameterValue =
		valueListPropertyPath && descriptionPath
			? getActionParameterValue(valueListPropertyPath, descriptionPath, textArrangementType)
			: "${" + valueListPropertyPath + "}";

	const oDialogModel = context.dialog.getModel();
	const data = oDialogModel.getProperty("/configuration/$data");
	await updateModelData(data, serviceUrl, entitySetName);
	oDialogModel.setProperty("/configuration/$data", data);

	return {
		entitySet: entitySetName,
		serviceUrl: serviceUrl,
		value: actionParameterValue,
		title: "${" + valueListPropertyPath + "}"
	};
};
