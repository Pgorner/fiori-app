import type { EntitySet, Property, PropertyPath, ServiceObject } from "@sap-ux/vocabularies-types";
import type {
	DataFieldAbstractTypes,
	DataFieldForAnnotation,
	DataFieldTypes,
	DataPoint,
	DataPointTypeTypes
} from "@sap-ux/vocabularies-types/vocabularies/UI";
import { UIAnnotationTerms, UIAnnotationTypes } from "@sap-ux/vocabularies-types/vocabularies/UI";
import type {
	BindingToolkitExpression,
	CompiledBindingToolkitExpression,
	ExpressionOrPrimitive,
	PathInModelExpression
} from "sap/fe/base/BindingToolkit";
import {
	and,
	compileExpression,
	constant,
	equal,
	fn,
	formatResult,
	formatWithTypeInformation,
	getExpressionFromAnnotation,
	ifElse,
	not,
	pathInModel,
	resolveBindingString,
	wrapBindingExpression
} from "sap/fe/base/BindingToolkit";
import type { PropertiesOf } from "sap/fe/base/ClassSupport";
import type AppComponent from "sap/fe/core/AppComponent";
import type { XMLPreprocessorContext } from "sap/fe/core/TemplateComponent";
import type { TemplateProcessorSettings } from "sap/fe/core/buildingBlocks/templating/BuildingBlockTemplateProcessor";
import { CollaborationFieldGroupPrefix } from "sap/fe/core/controllerextensions/collaboration/CollaborationCommon";
import * as MetaModelConverter from "sap/fe/core/converters/MetaModelConverter";
import { isDataField } from "sap/fe/core/converters/annotations/DataField";
import * as CollaborationFormatters from "sap/fe/core/formatters/CollaborationFormatter";
import valueFormatters from "sap/fe/core/formatters/ValueFormatter";
import { UI } from "sap/fe/core/helpers/BindingHelper";
import {
	getRequiredPropertiesFromInsertRestrictions,
	getRequiredPropertiesFromUpdateRestrictions
} from "sap/fe/core/helpers/MetaModelFunction";
import ModelHelper from "sap/fe/core/helpers/ModelHelper";
import { generate } from "sap/fe/core/helpers/StableIdHelper";
import { getTitleBindingExpression } from "sap/fe/core/helpers/TitleHelper";
import { isProperty, isPropertyPathExpression } from "sap/fe/core/helpers/TypeGuards";
import type { DataModelObjectPath } from "sap/fe/core/templating/DataModelPathHelper";
import { getContextRelativeTargetObjectPath, getRelativePaths, getTargetObjectPath } from "sap/fe/core/templating/DataModelPathHelper";
import { getAssociatedExternalIdProperty, getAssociatedExternalIdPropertyPath, isSemanticKey } from "sap/fe/core/templating/PropertyHelper";
import { getPropertyWithSemanticObject, manageSemanticObjectsForCurrentUser } from "sap/fe/core/templating/SemanticObjectHelper";
import type { DisplayMode } from "sap/fe/core/templating/UIFormatters";
import * as UIFormatters from "sap/fe/core/templating/UIFormatters";
import type { InputMaskFormatOptions } from "sap/fe/core/type/InputMask";
import * as FieldTemplating from "sap/fe/macros/field/FieldTemplating";
import {
	getDataModelObjectPathForValue,
	getDraftIndicatorVisibleBinding,
	getTextBindingExpression,
	getValueBinding,
	getVisibleExpression,
	hasPropertyInsertRestrictions,
	isRetrieveTextFromValueListEnabled,
	isUsedInNavigationWithQuickViewFacets,
	setEditStyleProperties
} from "sap/fe/macros/field/FieldTemplating";
import additionalValueFormatter from "sap/fe/macros/internal/valuehelp/AdditionalValueFormatter";
import SituationsIndicator from "sap/fe/macros/situations/SituationsIndicator";
import type Control from "sap/ui/core/Control";
import FieldEditMode from "sap/ui/mdc/enums/FieldEditMode";
import type Context from "sap/ui/model/Context";
import type ODataMetaModel from "sap/ui/model/odata/v4/ODataMetaModel";
import type { EventHandler } from "types/extension_types";
import type FieldAPI from "../../field/FieldAPI";
import type FieldFormatOptions from "../../field/FieldFormatOptions";
import type { DisplayStyle as DisplayStyleType, EditStyle as EditStyleType, FieldProperties } from "../InternalField.block";

export type InputFieldBlockProperties = PropertiesOf<FieldAPI> & {
	isPublicField?: boolean; //
	//add events from FieldAPI - 'PropertiesOf' does not include them
	change?: EventHandler;
	liveChange?: EventHandler;
	onLiveChange?: string;
};
export type FieldBlockProperties = Omit<FieldAPI, "metaPath" | "contextPath" | "change" | "visible"> & {
	change: string | undefined | EventHandler;
	metaPath: Context;
	contextPath: Context;
	isPublicField: boolean;
	visible?: boolean | CompiledBindingToolkitExpression;
	liveChange: EventHandler;
	onLiveChange?: string | EventHandler;
	semanticObject: string;
	value?: string;
	mainPropertyRelativePath?: string;
	//-----
	formatOptions: FieldFormatOptions;
	property: Property;
	dataModelPath: DataModelObjectPath<Property>;
	valueAsStringBindingExpression?: CompiledBindingToolkitExpression;
	unitBindingExpression?: string;
	displayVisible?: string | boolean;
	hasValidAnalyticalCurrencyOrUnit?: CompiledBindingToolkitExpression;
	_flexId?: string;
	idPrefix?: string;
	convertedMetaPath: DataFieldAbstractTypes | DataPointTypeTypes;
	class?: string;
	ariaLabelledBy?: string[];
	hasUnitOrCurrency?: boolean;
	text?: BindingToolkitExpression<string> | CompiledBindingToolkitExpression;
	emptyIndicatorMode?: string;
	editableExpression: string | CompiledBindingToolkitExpression;
	fieldGroupIds?: string;
	displayStyleId?: string;
	wrap?: boolean;
	textFromValueList?: CompiledBindingToolkitExpression;
	hasQuickView: boolean;
	identifierTitle?: CompiledBindingToolkitExpression;
	identifierText?: CompiledBindingToolkitExpression;
	hasSituationsIndicator?: boolean;
	situationsIndicatorPropertyPath: string;
	showErrorIndicator: boolean;
	showErrorObjectStatus?: boolean | CompiledBindingToolkitExpression;
	dynamicSemanticObjects?: BindingToolkitExpression<string>[];
	collaborationExpression: BindingToolkitExpression<boolean>;
	collaborationEnabled?: boolean;
	dataSourcePath?: string;
	editStyleId?: string;
	enabledExpression: string | CompiledBindingToolkitExpression;
	requiredExpression?: string;
	editModeAsObject: CompiledBindingToolkitExpression | BindingToolkitExpression<string>;
	valueBindingExpression?: CompiledBindingToolkitExpression;
	showTimezone?: boolean;
	minDateExpression: BindingToolkitExpression<unknown> | undefined | CompiledBindingToolkitExpression;
	maxDateExpression: BindingToolkitExpression<unknown> | undefined | CompiledBindingToolkitExpression;
	liveChangeEnabled?: boolean;
	editStylePlaceholder?: string;
	staticDescription?: string;
	_vhFlexId?: string;
	vhIdPrefix: string;
	valueState?: CompiledBindingToolkitExpression;
	editMode?: FieldEditMode | CompiledBindingToolkitExpression;
	textBindingExpression?: CompiledBindingToolkitExpression;
	ratingIndicatorTooltip?: CompiledBindingToolkitExpression;
	ratingIndicatorTargetValue?: CompiledBindingToolkitExpression;
	mask?: InputMaskFormatOptions | null;
	editStyle?: EditStyleType | null;
	_apiId?: string;
	navigateAfterAction: boolean | undefined;
	textAlign?: string;
	entityType?: Context;
	odataMetaModel: ODataMetaModel;
	propertyForFieldControl: UIFormatters.PropertyOrPath<Property>;
	descriptionBindingExpression?: string;
	quickViewType?: "SemanticLinks" | "Facets" | "FacetsAndSemanticLinks";
	displayStyle?: DisplayStyleType;
	unitEditable?: string;
	staticUnit?: string;
	valueInputWidth?: string;
	valueInputFieldWidth?: string;
	unitInputVisible?: CompiledBindingToolkitExpression;
	draftIndicatorVisible?: string;
	hasPropertyInsertRestrictions?: boolean | ExpressionOrPrimitive<boolean>;
	addDraftIndicator: boolean | undefined;
	convertedMetaPathExternalID?: Property;
	dataModelPathExternalID?: DataModelObjectPath<Property | PropertyPath>;
	valueHelpMetaPath?: Context;
	showValueHelpTemplate: boolean;
	id: string;
	readOnly?: boolean;
	metaPathContext: Context | undefined;
	contextPathContext: Context | undefined;
	eventHandlers: {
		change: EventHandler;
		liveChange: EventHandler;
		validateFieldGroup: EventHandler;
	};
};

export function setUpField(
	internalField: InputFieldBlockProperties,
	controlConfiguration: TemplateProcessorSettings,
	settings: TemplateProcessorSettings | XMLPreprocessorContext,
	metaPath?: Context | undefined,
	contextPath?: Context | undefined
): FieldBlockProperties {
	const resultField = { ...internalField } as unknown as FieldBlockProperties;

	resultField.change = internalField.change;
	resultField.metaPath = (metaPath ? metaPath : internalField.metaPath) as Context;
	resultField.contextPath = (contextPath ? contextPath : internalField.contextPath) as Context;
	resultField.visible = internalField.visible;
	resultField.liveChangeEnabled = !!internalField.onLiveChange || (internalField as unknown as Control).hasListeners?.("liveChange");
	resultField.semanticObject = internalField.semanticObject as string;
	resultField.value = internalField.value;
	resultField.mainPropertyRelativePath = internalField.mainPropertyRelativePath;

	//this currently works only for the internal field
	if (!resultField.vhIdPrefix) {
		resultField.vhIdPrefix = "FieldValueHelp";
		resultField._flexId = internalField.id;
		if (!resultField.idPrefix) {
			resultField.idPrefix = internalField.id;
		}
		resultField.showValueHelpTemplate = true;
	}

	resultField.formatOptions ??= {} as FieldFormatOptions;
	resultField.formatOptions = getFormatOptions(resultField);

	resultField.valueHelpMetaPath = metaPath ? metaPath : resultField.metaPath;
	computeCommonProperties(resultField, settings as unknown as TemplateProcessorSettings);
	resultField.convertedMetaPath = setUpDataPointType(resultField.convertedMetaPath);
	setUpVisibleProperties(resultField);
	computeIDs(resultField);
	resultField.dataSourcePath = getTargetObjectPath(resultField.dataModelPath);

	/* EXTERNALID */
	computeExternalID(resultField);
	resultField.entityType = resultField.odataMetaModel.createBindingContext(
		`/${resultField.dataModelPath.targetEntityType.fullyQualifiedName}`
	);
	if (resultField.formatOptions?.forInlineCreationRows === true) {
		resultField.hasPropertyInsertRestrictions = hasPropertyInsertRestrictions(resultField.dataModelPath);
	}
	computeEditMode(resultField);
	computeCollaborationProperties(resultField);
	computeEditableExpressions(resultField);
	resultField.formatOptions = resultField.formatOptions ? resultField.formatOptions : ({} as FieldFormatOptions);
	setUpFormatOptions(
		resultField,
		(resultField.dataModelPathExternalID as DataModelObjectPath<Property>) || resultField.dataModelPath,
		controlConfiguration,
		settings as unknown as TemplateProcessorSettings
	);
	setUpDisplayStyle(
		resultField,
		resultField.convertedMetaPath,
		resultField.dataModelPath,
		settings as unknown as TemplateProcessorSettings
	);
	setUpEditStyle(resultField, settings?.appComponent);

	resultField.valueState = setUpValueState(resultField);
	if (resultField.editStyle === "InputWithValueHelp") {
		resultField.editStylePlaceholder = setInputWithValuehelpPlaceholder(resultField);
	}

	// ---------------------------------------- compute bindings----------------------------------------------------
	const aDisplayStylesWithoutPropText = ["Avatar", "AmountWithCurrency"];
	if (
		resultField.displayStyle &&
		!aDisplayStylesWithoutPropText.includes(resultField.displayStyle) &&
		resultField.dataModelPath.targetObject
	) {
		resultField.text =
			resultField.text ??
			resultField.value ??
			FieldTemplating.getTextBinding(
				(resultField.dataModelPathExternalID as DataModelObjectPath<Property>) || resultField.dataModelPath,
				resultField.formatOptions
			);
	} else {
		resultField.text = "";
	}

	if (resultField.formatOptions.showEmptyIndicator) {
		resultField.emptyIndicatorMode = String(resultField.formatOptions.showEmptyIndicator) === "true" ? "On" : undefined;
	} else {
		resultField.emptyIndicatorMode = undefined;
	}

	// If the target is a property with a DataFieldDefault, use this as data field
	if (isProperty(resultField.convertedMetaPath) && resultField.convertedMetaPath.annotations?.UI?.DataFieldDefault !== undefined) {
		resultField.metaPath = resultField.odataMetaModel.createBindingContext(
			`@${UIAnnotationTerms.DataFieldDefault}`,
			metaPath ? metaPath : resultField.metaPath
		);
	}

	if (resultField.readOnly !== undefined) {
		resultField.editMode = compileExpression(
			ifElse(equal(resolveBindingString(resultField.readOnly, "boolean"), true), "Display", "Editable")
		);
	}

	resultField.eventHandlers = {
		change: (): void => {},
		liveChange: (): void => {},
		validateFieldGroup: (): void => {}
	};

	return resultField;
}

/**
 * This helper computes the properties that are needed for the collaboration avatar.
 * @param internalField Reference to the current internal field instance
 */
export function computeCollaborationProperties(internalField: FieldBlockProperties): void {
	const computedEditableExpression = UIFormatters.getEditableExpressionAsObject(
		internalField.propertyForFieldControl,
		internalField.convertedMetaPath,
		internalField.dataModelPath
	);
	if (ModelHelper.isCollaborationDraftSupported(internalField.odataMetaModel) && internalField.editMode !== FieldEditMode.Display) {
		const collaborationEnabled = true;
		// Expressions needed for Collaboration Visualization
		const collaborationExpression = UIFormatters.getCollaborationExpression(
			internalField.dataModelPath,
			CollaborationFormatters.hasCollaborationActivity
		);
		const editableExpression = compileExpression(and(computedEditableExpression, not(collaborationExpression)));

		const editMode = compileExpression(
			ifElse(
				collaborationExpression,
				constant("ReadOnly"),
				ifElse(and(UI.IsInactive, !!internalField.hasPropertyInsertRestrictions), "Display", internalField.editModeAsObject)
			)
		);
		internalField.collaborationEnabled = collaborationEnabled;
		internalField.collaborationExpression = collaborationExpression;
		internalField.editableExpression = editableExpression;
		internalField.editMode = editMode;
	} else {
		internalField.editableExpression = compileExpression(computedEditableExpression);
	}
}

/**
 * This helper sets the common properties convertedMetaPath, dataModelPath
 * and property that can be reused in the individual templates if required.
 * @param internalField Reference to the current internal field instance
 * @param settings
 */
export function computeCommonProperties(internalField: FieldBlockProperties, settings: TemplateProcessorSettings): void {
	internalField.convertedMetaPath = MetaModelConverter.convertMetaModelContext(
		internalField.metaPathContext ? internalField.metaPathContext : internalField.metaPath
	) as DataFieldAbstractTypes | DataPointTypeTypes;

	let dataModelPath = MetaModelConverter.getInvolvedDataModelObjects<DataFieldAbstractTypes | DataPointTypeTypes | Property>(
		internalField.metaPathContext ? internalField.metaPathContext : internalField.metaPath,
		internalField.contextPath
	);
	dataModelPath =
		getDataModelObjectPathForValue(dataModelPath as DataModelObjectPath<DataFieldAbstractTypes | DataPointTypeTypes>) || dataModelPath;
	internalField.dataModelPath = dataModelPath as DataModelObjectPath<Property>;
	internalField.property = dataModelPath.targetObject as Property;
	internalField.odataMetaModel = settings.models.metaModel || settings.models.contextPath;
	internalField.propertyForFieldControl = (dataModelPath?.targetObject as unknown as DataFieldTypes)?.Value
		? (dataModelPath?.targetObject as unknown as DataFieldTypes).Value
		: dataModelPath?.targetObject;
}

/**
 * Helper to computes some of the expression for further processing.
 * @param internalField Reference to the current internal field instance
 */
export function computeEditableExpressions(internalField: FieldBlockProperties): void {
	const requiredPropertiesFromInsertRestrictions = getRequiredPropertiesFromInsertRestrictions(
		(internalField.contextPathContext ? internalField.contextPathContext : internalField.contextPath)
			?.getPath()
			.replaceAll("/$NavigationPropertyBinding/", "/"),
		internalField.odataMetaModel
	);
	const requiredPropertiesFromUpdateRestrictions = getRequiredPropertiesFromUpdateRestrictions(
		(internalField.contextPathContext ? internalField.contextPathContext : internalField.contextPath)
			?.getPath()
			.replaceAll("/$NavigationPropertyBinding/", "/"),
		internalField.odataMetaModel
	);
	const oRequiredProperties = {
		requiredPropertiesFromInsertRestrictions: requiredPropertiesFromInsertRestrictions,
		requiredPropertiesFromUpdateRestrictions: requiredPropertiesFromUpdateRestrictions
	};

	const liveChangeEnabled = internalField.liveChangeEnabled;
	const enabledExpression = UIFormatters.getEnabledExpression(
		internalField.propertyForFieldControl,
		internalField.convertedMetaPath,
		false,
		internalField.dataModelPath
	) as CompiledBindingToolkitExpression;
	const requiredExpression = UIFormatters.getRequiredExpression(
		internalField.propertyForFieldControl,
		internalField.convertedMetaPath,
		false,
		false,
		oRequiredProperties,
		internalField.dataModelPath
	) as CompiledBindingToolkitExpression;

	internalField.liveChangeEnabled = liveChangeEnabled;
	internalField.enabledExpression = enabledExpression;
	internalField.requiredExpression = requiredExpression;
}

export function computeEditMode(internalField: FieldBlockProperties): void {
	if (internalField.editMode !== undefined && internalField.editMode !== null) {
		// Even if it provided as a string it's a valid part of a binding expression that can be later combined into something else.
		internalField.editModeAsObject = internalField.editMode;
	} else {
		const measureReadOnly = internalField.formatOptions?.measureDisplayMode
			? internalField.formatOptions.measureDisplayMode === "ReadOnly"
			: false;

		internalField.editModeAsObject = UIFormatters.getEditMode(
			internalField.propertyForFieldControl,
			internalField.dataModelPath,
			measureReadOnly,
			true,
			internalField.convertedMetaPath
		);
		internalField.editMode = compileExpression(
			ifElse(and(UI.IsInactive, !!internalField.hasPropertyInsertRestrictions), "Display", internalField.editModeAsObject)
		);
	}
}

export function computeExternalID(internalField: FieldBlockProperties): void {
	const externalIDProperty = getAssociatedExternalIdProperty(internalField.property);

	if (externalIDProperty) {
		if (internalField.property) internalField.property.type = externalIDProperty.type;
		if (isDataField(internalField.convertedMetaPath)) {
			internalField.convertedMetaPath.Value.$target.type = externalIDProperty.type;
		}
		const externalIdPropertyPath = getAssociatedExternalIdPropertyPath(internalField.property);
		const externalIdContext = internalField.metaPath
			.getModel()
			.createBindingContext(internalField.contextPath?.getPath() + "/" + externalIdPropertyPath, internalField.metaPath);

		internalField.convertedMetaPathExternalID = MetaModelConverter.convertMetaModelContext(externalIdContext) as Property;

		let dataModelPath: DataModelObjectPath<Property> = MetaModelConverter.getInvolvedDataModelObjects(
			externalIdContext as Context,
			internalField.contextPath
		);
		dataModelPath = getDataModelObjectPathForValue(dataModelPath as DataModelObjectPath<DataFieldAbstractTypes>) || dataModelPath;
		internalField.dataModelPathExternalID = dataModelPath;
	}
}

/**
 * Calculate the fieldGroupIds for an Input or other edit control.
 * @param field
 * @param appComponent
 * @returns The fieldGroupIds
 */
function computeFieldGroupIds(field: FieldBlockProperties, appComponent?: AppComponent): string | undefined {
	const typesForCollaborationFocusManagement = [
		"InputWithValueHelp",
		"TextArea",
		"DatePicker",
		"TimePicker",
		"DateTimePicker",
		"InputWithUnit",
		"Input",
		"InputMask"
	];

	if (!appComponent) {
		//for ValueHelp / Mass edit Templating the appComponent is not passed to the templating
		return;
	}
	const sideEffectService = appComponent.getSideEffectsService();
	const fieldGroupIds = sideEffectService.computeFieldGroupIds(
		field.dataModelPath.targetEntityType?.fullyQualifiedName ?? "",
		field.dataModelPath.targetObject?.fullyQualifiedName ?? ""
	);

	if (field.collaborationEnabled && typesForCollaborationFocusManagement.includes(field.editStyle || "")) {
		const collaborationFieldGroup = `${CollaborationFieldGroupPrefix}${field.dataSourcePath}`;
		fieldGroupIds.push(collaborationFieldGroup);
		field.mainPropertyRelativePath = isProperty(field.dataModelPath.targetObject)
			? getContextRelativeTargetObjectPath(field.dataModelPath)
			: undefined;
	}

	return fieldGroupIds.length ? fieldGroupIds.join(",") : undefined;
}

/**
 * This helper is for the ID of the InternalField according to several different scenarios.
 *
 * displayStyleId is used for all controls inside the field wrapper in display mode. A <sap.m.text> control would get this ID. An example is: ApplicationContext::Field-display.
 * editStyleId is used for all controls inside the field wrapper in edit mode. A <sap.ui.mdc.field> control would get this ID. An example is: ApplicationContext::Field-edit.
 *
 * If no wrapper exists the wrappers ID will be propagated to the first control displayed, A <sap.m.text> control would get this ID. An example is: ApplicationContext::Field-content.
 * @param internalField Reference to the current internal field instance
 */
export function computeIDs(internalField: Partial<FieldBlockProperties>): void {
	if (internalField._flexId) {
		internalField._apiId = internalField._flexId;
		internalField._flexId = getContentId(internalField._flexId);
		internalField._vhFlexId = `${internalField._flexId}_${internalField.vhIdPrefix}`;
	}

	if (internalField.idPrefix) {
		internalField.editStyleId = generate([internalField.idPrefix, "Field-edit"]);
	}
	//NoWrapperId scenario is for the LR table.
	if (internalField.formatOptions?.fieldMode === "nowrapper" && internalField.editMode === "Display") {
		if (internalField._flexId) {
			internalField.displayStyleId = internalField._flexId;
		} else {
			internalField.displayStyleId = internalField.idPrefix ? generate([internalField.idPrefix, "Field-content"]) : undefined;
		}
	} else if (internalField.idPrefix) {
		internalField.displayStyleId = generate([internalField.idPrefix, "Field-display"]);
	}
}

/**
 * Sets the internal formatOptions for the building block.
 * @param field
 * @returns A string with the internal formatOptions for the building block
 */
export function getFormatOptions(field: FieldBlockProperties): FieldFormatOptions {
	return {
		...field.formatOptions,
		textAlignMode: field.formatOptions.textAlignMode ?? "Form",
		showEmptyIndicator: field.formatOptions.showEmptyIndicator ?? true,
		displayMode: field.formatOptions.displayMode as DisplayMode,
		measureDisplayMode: field.formatOptions.measureDisplayMode,
		textLinesEdit: field.formatOptions.textLinesEdit,
		textMaxLines: field.formatOptions.textMaxLines,
		textMaxCharactersDisplay: field.formatOptions.textMaxCharactersDisplay,
		textExpandBehaviorDisplay: field.formatOptions.textExpandBehaviorDisplay,
		textMaxLength: field.formatOptions.textMaxLength,
		fieldEditStyle: field.formatOptions.fieldEditStyle,
		radioButtonsHorizontalLayout: field.formatOptions.radioButtonsHorizontalLayout,
		showTime: field.formatOptions.showTime,
		showTimezone: field.formatOptions.showTimezone,
		showDate: field.formatOptions.showDate
	} as FieldFormatOptions;
}

function getObjectIdentifierText(
	fieldFormatOptions: FieldFormatOptions,
	propertyDataModelObjectPath: DataModelObjectPath<Property | PropertyPath>
): CompiledBindingToolkitExpression {
	let propertyBindingExpression: BindingToolkitExpression<string> = pathInModel(
		getContextRelativeTargetObjectPath(propertyDataModelObjectPath)
	);
	const targetDisplayMode = fieldFormatOptions?.displayMode;
	const propertyDefinition = isPropertyPathExpression(propertyDataModelObjectPath.targetObject)
		? (propertyDataModelObjectPath.targetObject.$target as Property)
		: (propertyDataModelObjectPath.targetObject as Property);

	const commonText = propertyDefinition.annotations?.Common?.Text;
	if (commonText === undefined) {
		return undefined;
	}
	propertyBindingExpression = formatWithTypeInformation(propertyDefinition, propertyBindingExpression);

	switch (targetDisplayMode) {
		case "ValueDescription":
			const relativeLocation = getRelativePaths(propertyDataModelObjectPath);
			return compileExpression(getExpressionFromAnnotation(commonText, relativeLocation));
		case "DescriptionValue":
			return compileExpression(formatResult([propertyBindingExpression], valueFormatters.formatToKeepWhitespace));
		default:
			return undefined;
	}
}

function getOverrides(controlConfiguration: TemplateProcessorSettings, id: string): FieldProperties {
	/*
		Qualms: We need to use this TemplateProcessorSettings type to be able to iterate
		over the properties later on and cast it afterwards as a field property type
	*/
	const props = {} as TemplateProcessorSettings;

	if (controlConfiguration) {
		const controlConfig = controlConfiguration[id] as TemplateProcessorSettings;
		if (controlConfig) {
			Object.keys(controlConfig).forEach(function (configKey) {
				props[configKey] = controlConfig[configKey];
			});
		}
	}
	return props as unknown as FieldProperties;
}

/**
 * Prepare the display style of the field in case of semantic objects or quickview facets.
 * @param internalField The field
 * @param settings
 * @param dataModelPath The DataModelObjectPath of the property
 * @param hasSemanticObjects
 * @param hasQuickView
 */
function manageQuickViewForDisplayStyle(
	internalField: FieldBlockProperties,
	settings: TemplateProcessorSettings,
	dataModelPath: DataModelObjectPath<Property>,
	hasSemanticObjects: boolean,
	hasQuickView: boolean
): void {
	if (hasQuickView) {
		internalField.hasQuickView = true;
		internalField.quickViewType = "Facets";
	}
	if (hasSemanticObjects) {
		const foundSemanticObjects = manageSemanticObjectsForCurrentUser(internalField.semanticObject, dataModelPath, settings);
		if (foundSemanticObjects.hasReachableStaticSemanticObject || foundSemanticObjects.dynamicSemanticObjects.length) {
			internalField.hasQuickView = true;
			internalField.quickViewType = hasQuickView ? "FacetsAndSemanticLinks" : "SemanticLinks";
			internalField.dynamicSemanticObjects =
				foundSemanticObjects.hasReachableStaticSemanticObject !== true ? foundSemanticObjects.dynamicSemanticObjects : undefined;
		}
	}
}

/**
 * Check field to know if it has semantic object.
 * @param internalField The field
 * @param dataModelPath The DataModelObjectPath of the property
 * @returns True if field has a semantic object
 */
function propertyOrNavigationPropertyHasSemanticObject(
	internalField: FieldBlockProperties,
	dataModelPath: DataModelObjectPath<Property>
): boolean {
	return (
		!!getPropertyWithSemanticObject(dataModelPath) ||
		(internalField.semanticObject !== undefined && internalField.semanticObject !== "")
	);
}

export function setInputWithValuehelpPlaceholder(internalField: FieldBlockProperties): CompiledBindingToolkitExpression {
	let targetEntityType;
	const editStylePlaceholder = internalField.editStylePlaceholder;
	const fieldContainerType = internalField.formatOptions.textAlignMode;
	if (fieldContainerType === "Table") {
		targetEntityType = internalField.dataModelPath.targetEntityType;
	}
	const propertyPath = internalField.dataModelPath.targetObject?.name;
	const recommendationValue = pathInModel(`${propertyPath}@$ui5.fe.recommendations.placeholderValue`);
	const recommendationDescription = pathInModel(`${propertyPath}@$ui5.fe.recommendations.placeholderDescription`);
	const placeholderExp = formatResult(
		[
			recommendationValue,
			recommendationDescription,
			pathInModel(`/recommendationsData`, "internal"),
			pathInModel(`/currentCtxt`, "internal"),
			pathInModel(`${propertyPath}@$ui5.fe.messageType`),
			editStylePlaceholder,
			internalField.formatOptions.displayMode
		],
		additionalValueFormatter.formatPlaceholder,
		targetEntityType
	);

	return compileExpression(placeholderExp);
}

export function setUpDataPointType(dataField: DataFieldAbstractTypes | DataPointTypeTypes): DataFieldAbstractTypes | DataPointTypeTypes {
	// data point annotations need not have $Type defined, so add it if missing
	const dataPointType = { ...dataField };
	if ((dataField as unknown as DataPoint)?.term === "com.sap.vocabularies.UI.v1.DataPoint") {
		dataPointType.$Type = dataField.$Type || UIAnnotationTypes.DataPointType;
	}
	return dataPointType;
}

export function setUpDisplayStyle(
	internalField: FieldBlockProperties,
	dataField: DataFieldAbstractTypes | DataPointTypeTypes,
	dataModelPath: DataModelObjectPath<DataFieldAbstractTypes | DataPointTypeTypes | Property>,
	settings: TemplateProcessorSettings
): FieldBlockProperties {
	const resultField: FieldBlockProperties = internalField;
	const property: Property = dataModelPath.targetObject as Property;
	if (!dataModelPath.targetObject) {
		resultField.displayStyle = "Text";
		return resultField;
	}

	resultField.hasUnitOrCurrency =
		property.annotations?.Measures?.Unit !== undefined || property.annotations?.Measures?.ISOCurrency !== undefined;
	resultField.hasValidAnalyticalCurrencyOrUnit = UIFormatters.hasValidAnalyticalCurrencyOrUnit(
		dataModelPath as DataModelObjectPath<Property>
	);
	resultField.textFromValueList = wrapBindingExpression(
		compileExpression(
			fn("FieldRuntime.retrieveTextFromValueList", [
				pathInModel(getContextRelativeTargetObjectPath(dataModelPath)),
				`/${property.fullyQualifiedName}`,
				resultField.formatOptions.displayMode
			])
		) as string,
		false
	);

	if (property.annotations?.UI?.IsImage) {
		resultField.displayStyle = "File";
		return resultField;
	}
	if (property.annotations?.UI?.IsImageURL) {
		resultField.displayStyle = "Avatar";
		return resultField;
	}
	if (property.annotations?.UI?.InputMask) {
		resultField.displayStyle = "Text";
		return resultField;
	}
	// For compatibility reasons, Stream will be shown within an entity instance as circle if the entity is annotated as IsNaturalPerson
	// and neither IsImage nor IsImageURL annotation has been used.
	if (property.type === "Edm.Stream") {
		resultField.displayStyle = "File";
		return resultField;
	}
	setUpDraftIndicator(dataModelPath as DataModelObjectPath<Property>, resultField);
	switch (dataField.$Type as string) {
		case UIAnnotationTypes.DataPointType:
			resultField.displayStyle = "DataPoint";
			return resultField;
		case UIAnnotationTypes.DataFieldForAnnotation:
			if ((dataField as unknown as DataFieldForAnnotation).Target?.$target?.$Type === UIAnnotationTypes.DataPointType) {
				resultField.displayStyle = "DataPoint";
				return resultField;
			} else if (
				(dataField as unknown as DataFieldForAnnotation).Target?.$target?.$Type ===
				"com.sap.vocabularies.Communication.v1.ContactType"
			) {
				resultField.displayStyle = "Contact";
				return resultField;
			}
			break;
		case UIAnnotationTypes.DataFieldForAction:
		case UIAnnotationTypes.DataFieldForIntentBasedNavigation:
			resultField.displayStyle = "Button";
			return resultField;
		case UIAnnotationTypes.DataFieldWithIntentBasedNavigation:
		case UIAnnotationTypes.DataFieldWithNavigationPath:
		case UIAnnotationTypes.DataFieldWithAction:
			resultField.displayStyle = "Link";
			return resultField;
	}
	const hasQuickView = isUsedInNavigationWithQuickViewFacets(dataModelPath, property);
	const hasSemanticObjects = propertyOrNavigationPropertyHasSemanticObject(resultField, dataModelPath as DataModelObjectPath<Property>);

	if (isSemanticKey(property, dataModelPath) && resultField.formatOptions.semanticKeyStyle) {
		manageQuickViewForDisplayStyle(
			resultField,
			settings,
			dataModelPath as DataModelObjectPath<Property>,
			hasSemanticObjects,
			hasQuickView
		);
		setUpObjectIdentifierTitleAndText(resultField, dataModelPath as DataModelObjectPath<Property>);
		resultField.showErrorIndicator =
			(dataModelPath.contextLocation as unknown as DataModelObjectPath<ServiceObject>)?.targetObject?._type ===
				"NavigationProperty" && !resultField.formatOptions.fieldGroupDraftIndicatorPropertyPath;
		resultField.situationsIndicatorPropertyPath = (dataModelPath.targetObject as Property).name;
		resultField.displayStyle =
			resultField.formatOptions.semanticKeyStyle === "ObjectIdentifier" ? "ObjectIdentifier" : "LabelSemanticKey";
		return resultField;
	}
	if (dataField.Criticality) {
		manageQuickViewForDisplayStyle(
			resultField,
			settings,
			dataModelPath as DataModelObjectPath<Property>,
			hasSemanticObjects,
			hasQuickView
		);
		resultField.displayStyle = "ObjectStatus";
		return resultField;
	}
	if (
		property.annotations?.Measures?.ISOCurrency &&
		String(resultField.formatOptions.isCurrencyAligned) === "true" &&
		resultField.formatOptions.measureDisplayMode !== "Hidden"
	) {
		resultField.valueAsStringBindingExpression = resultField.value
			? resultField.value
			: getValueBinding(dataModelPath as DataModelObjectPath<Property>, resultField.formatOptions, true, true, undefined, true);
		resultField.unitBindingExpression = compileExpression(
			UIFormatters.getBindingForUnitOrCurrency(dataModelPath as DataModelObjectPath<Property>)
		);
		resultField.displayStyle = "AmountWithCurrency";

		return resultField;
	}
	if (property.annotations?.Communication?.IsEmailAddress || property.annotations?.Communication?.IsPhoneNumber) {
		resultField.displayStyle = "Link";
		return resultField;
	}
	if (property.annotations?.UI?.MultiLineText) {
		resultField.displayStyle = "ExpandableText";
		return resultField;
	}

	if (dataField.$Type === UIAnnotationTypes.DataFieldWithUrl) {
		resultField.displayStyle = "Link";
		return resultField;
	}

	resultField.displayStyle = "Text";
	manageQuickViewForDisplayStyle(resultField, settings, dataModelPath as DataModelObjectPath<Property>, hasSemanticObjects, hasQuickView);
	if (resultField.hasQuickView) {
		resultField.displayStyle = "LinkWithQuickView";
	}
	return resultField;
}

/**
 * This determines whether we should add a draft indicator within the field template.
 * @param dataModelPath DataModelObjectPath pointing to the main property for the field
 * @param internalField
 */
function setUpDraftIndicator(dataModelPath: DataModelObjectPath<Property>, internalField: FieldBlockProperties): void {
	if (isSemanticKey(dataModelPath.targetObject as Property, dataModelPath)) {
		internalField.hasSituationsIndicator =
			SituationsIndicator.getSituationsNavigationProperty(dataModelPath.targetEntityType) !== undefined;
		if (
			(dataModelPath.contextLocation?.targetEntitySet as EntitySet | undefined)?.annotations?.Common?.DraftRoot &&
			(dataModelPath.targetEntitySet as EntitySet | undefined)?.annotations?.Common?.DraftRoot &&
			internalField.formatOptions?.hasDraftIndicator === true
		) {
			// In case of a grid table or tree table hasDraftIndicator will be false since the draft
			// indicator needs to be rendered into a separate column
			// Hence we then fall back to display styles ObjectIdentifier or LabelSemanticKey instead
			// of the combined ID and draft indicator style
			internalField.draftIndicatorVisible = getDraftIndicatorVisibleBinding(dataModelPath.targetObject?.name) as string;
			internalField.addDraftIndicator = true;
		}
	}
}

export function setUpEditStyle(field: FieldBlockProperties, appComponent?: AppComponent): FieldBlockProperties {
	const resultField = field;
	setEditStyleProperties(resultField, resultField.convertedMetaPath, resultField.dataModelPath);
	resultField.fieldGroupIds = computeFieldGroupIds(resultField, appComponent);
	return resultField;
}

export function setUpObjectIdentifierTitleAndText(
	internalField: FieldBlockProperties,
	propertyDataModelObjectPath: DataModelObjectPath<Property>
): void {
	const semanticStyle = internalField.formatOptions?.semanticKeyStyle;
	const displayMode = internalField.formatOptions.displayMode;
	internalField.identifierTitle = getTitleBindingExpression(
		propertyDataModelObjectPath,
		getTextBindingExpression,
		{ displayMode, splitTitleOnTwoLines: internalField.formatOptions.semanticKeyStyle === "ObjectIdentifier" },
		undefined,
		undefined
	);
	internalField.identifierText =
		semanticStyle === "ObjectIdentifier"
			? getObjectIdentifierText(internalField.formatOptions, propertyDataModelObjectPath)
			: undefined;
}

export function setUpFormatOptions(
	internalField: FieldBlockProperties,
	dataModelPath: DataModelObjectPath<Property>,
	controlConfiguration: TemplateProcessorSettings,
	settings: TemplateProcessorSettings
): void {
	const overrideProps = getOverrides(
		controlConfiguration,
		(internalField.metaPathContext ? internalField.metaPathContext : internalField.metaPath).getPath()
	);

	if (!internalField.formatOptions.displayMode) {
		internalField.formatOptions.displayMode = UIFormatters.getDisplayMode(dataModelPath);
	}
	if (internalField.formatOptions.displayMode === "Description") {
		internalField.valueAsStringBindingExpression = internalField.value
			? internalField.value
			: getValueBinding(dataModelPath, internalField.formatOptions, true, true, undefined, true);
	}
	internalField.formatOptions.textLinesEdit =
		(overrideProps as unknown as FieldFormatOptions).textLinesEdit ||
		(overrideProps.formatOptions && overrideProps.formatOptions.textLinesEdit) ||
		internalField.formatOptions.textLinesEdit ||
		4;
	internalField.formatOptions.textMaxLines =
		(overrideProps as unknown as FieldFormatOptions).textMaxLines ||
		(overrideProps.formatOptions && overrideProps.formatOptions.textMaxLines) ||
		internalField.formatOptions.textMaxLines;

	// Retrieve text from value list as fallback feature for missing text annotation on the property
	if (settings.models.viewData?.getProperty("/retrieveTextFromValueList")) {
		internalField.formatOptions.retrieveTextFromValueList = isRetrieveTextFromValueListEnabled(
			dataModelPath.targetObject!,
			internalField.formatOptions
		);
		if (internalField.formatOptions.retrieveTextFromValueList) {
			// Consider TextArrangement at EntityType otherwise set default display format 'DescriptionValue'
			const hasEntityTextArrangement = !!dataModelPath?.targetEntityType?.annotations?.UI?.TextArrangement;
			internalField.formatOptions.displayMode = hasEntityTextArrangement
				? internalField.formatOptions.displayMode
				: "DescriptionValue";
		}
	}
}

export function setUpValueState(internalField: FieldBlockProperties): CompiledBindingToolkitExpression {
	let valueStateExp;
	const fieldContainerType = internalField.formatOptions?.textAlignMode ? internalField.formatOptions?.textAlignMode : "Form";
	const propertyPathInModel = pathInModel(
		getContextRelativeTargetObjectPath(internalField.dataModelPath)
	) as PathInModelExpression<Property>;
	const relativeLocation = getRelativePaths(internalField.dataModelPath);
	const textPath = getExpressionFromAnnotation(internalField.dataModelPath?.targetObject?.annotations?.Common?.Text, relativeLocation);
	const propertyPath = internalField.dataModelPath.targetObject?.name;
	const recommendationValue = pathInModel(`${propertyPath}@$ui5.fe.recommendations.placeholderValue`);
	const recommendationDescription = pathInModel(`${propertyPath}@$ui5.fe.recommendations.placeholderDescription`);
	if (fieldContainerType === "Table") {
		valueStateExp = formatResult(
			[
				recommendationValue,
				recommendationDescription,
				pathInModel(`/recommendationsData`, "internal"),
				pathInModel(`/isEditable`, "ui"),
				internalField.dataSourcePath,
				propertyPathInModel,
				textPath
			],
			additionalValueFormatter.formatValueState,
			internalField.dataModelPath.targetEntityType
		);
	} else {
		valueStateExp = formatResult(
			[
				recommendationValue,
				recommendationDescription,
				pathInModel(`/recommendationsData`, "internal"),
				pathInModel(`/isEditable`, "ui"),
				internalField.dataSourcePath,
				propertyPathInModel,
				textPath
			],
			additionalValueFormatter.formatValueState
		);
	}

	internalField.valueState = compileExpression(valueStateExp);
	return internalField.valueState;
}

export function setUpVisibleProperties(internalField: FieldBlockProperties): void {
	// we do this before enhancing the dataModelPath so that it still points at the DataField
	// const visibleProperties: Partial<InternalFieldBlock> = {};
	const propertyDataModelObjectPath = MetaModelConverter.getInvolvedDataModelObjects<DataFieldAbstractTypes>(
		internalField.metaPathContext ? internalField.metaPathContext : internalField.metaPath,
		internalField.contextPath
	);

	internalField.visible = internalField.visible ??= getVisibleExpression(propertyDataModelObjectPath, internalField.formatOptions);
	internalField.displayVisible = internalField.formatOptions?.fieldMode === "nowrapper" ? internalField.visible : undefined;
}

function getContentId(macroId: string): string {
	return `${macroId}-content`;
}
