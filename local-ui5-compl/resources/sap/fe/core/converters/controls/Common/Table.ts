import type {
	EntitySet,
	EntityType,
	NavigationProperty,
	PathAnnotationExpression,
	Property,
	PropertyAnnotationValue,
	PropertyPath
} from "@sap-ux/vocabularies-types";
import type { FilterFunctions } from "@sap-ux/vocabularies-types/vocabularies/Capabilities";
import type { EntitySetAnnotations_Capabilities } from "@sap-ux/vocabularies-types/vocabularies/Capabilities_Edm";
import type { SemanticKey } from "@sap-ux/vocabularies-types/vocabularies/Common";
import { CommonAnnotationTerms } from "@sap-ux/vocabularies-types/vocabularies/Common";
import type { EntitySetAnnotations_Common } from "@sap-ux/vocabularies-types/vocabularies/Common_Edm";
import type { EntitySetAnnotations_Session } from "@sap-ux/vocabularies-types/vocabularies/Session_Edm";
import type {
	Criticality,
	DataField,
	DataFieldAbstractTypes,
	DataFieldForAction,
	DataFieldForActionGroup,
	DataFieldForActionTypes,
	DataFieldForAnnotation,
	DataFieldForIntentBasedNavigation,
	DataFieldTypes,
	DataPoint,
	DataPointTypeTypes,
	FieldGroup,
	LineItem,
	PresentationVariantType,
	SelectOptionType,
	SelectionVariant,
	SelectionVariantType
} from "@sap-ux/vocabularies-types/vocabularies/UI";
import { UIAnnotationTerms, UIAnnotationTypes } from "@sap-ux/vocabularies-types/vocabularies/UI";
import Log from "sap/base/Log";
import type { BindingToolkitExpression, CompiledBindingToolkitExpression } from "sap/fe/base/BindingToolkit";
import {
	EDM_TYPE_MAPPING,
	and,
	compileExpression,
	constant,
	equal,
	formatResult,
	getExpressionFromAnnotation,
	ifElse,
	isConstant,
	not,
	or,
	pathInModel,
	resolveBindingString
} from "sap/fe/base/BindingToolkit";
import type { PageContextPathTarget } from "sap/fe/core/converters/TemplateConverter";
import type { ComplexPropertyInfo } from "sap/fe/core/converters/annotations/DataField";
import {
	collectRelatedProperties,
	collectRelatedPropertiesRecursively,
	getDataFieldDataType,
	getSemanticObjectPath,
	getTargetValueOnDataPoint,
	hasDataPointTarget,
	hasFieldGroupTarget,
	isDataField,
	isDataFieldForActionAbstract,
	isDataFieldForActionGroup,
	isDataFieldForAnnotation,
	isDataFieldTypes,
	isDataPointFromDataFieldDefault,
	isRatingVisualizationFromDataFieldDefault,
	visibleExpression
} from "sap/fe/core/converters/annotations/DataField";
import type {
	AnnotationAction,
	AnnotationActionGroup,
	BaseAction,
	CombinedAction,
	CustomAction,
	OverrideTypeAction
} from "sap/fe/core/converters/controls/Common/Action";
import {
	dataFieldIsCopyAction,
	getActionsFromManifest,
	getAnnotationMenuActionItems,
	getCopyAction,
	getEnabledForAnnotationAction,
	getMatchingManifestAction,
	getVisibilityEnablementMenuActions,
	isActionNavigable,
	prepareMenuActions,
	removeDuplicateActions
} from "sap/fe/core/converters/controls/Common/Action";
import type { ConfigurableObject, CustomElement } from "sap/fe/core/converters/helpers/ConfigurableObject";
import { OverrideType, Placement, insertCustomElements } from "sap/fe/core/converters/helpers/ConfigurableObject";
import { IssueCategory, IssueCategoryType, IssueSeverity, IssueType } from "sap/fe/core/converters/helpers/IssueManager";
import { KeyHelper } from "sap/fe/core/converters/helpers/Key";
import { Entity, UI } from "sap/fe/core/helpers/BindingHelper";
import ModelHelper from "sap/fe/core/helpers/ModelHelper";
import { generate, replaceSpecialChars } from "sap/fe/core/helpers/StableIdHelper";
import * as TypeGuards from "sap/fe/core/helpers/TypeGuards";
import {
	isAnnotationOfType,
	isNavigationProperty,
	isPathAnnotationExpression,
	isProperty,
	isTypeDefinition
} from "sap/fe/core/helpers/TypeGuards";
import {
	enhanceDataModelPath,
	getContextPropertyRestriction,
	getContextRelativeTargetObjectPath,
	getHierarchyParentNavigationPropertyPath,
	getNonUpdatableNavigationProperties,
	getTargetObjectPath,
	isPathDeletable,
	isPathSearchable,
	isPathUpdatable,
	type DataModelObjectPath
} from "sap/fe/core/templating/DataModelPathHelper";
import { getDisplayMode, type DisplayMode } from "sap/fe/core/templating/DisplayModeFormatter";
import { getRestrictionsOnProperties, type RestrictionsOnProperties } from "sap/fe/core/templating/EntitySetHelper";
import { hasFieldControlNotMandatory, isStaticallyMandatory } from "sap/fe/core/templating/FieldControlHelper";
import {
	getAssociatedCurrencyProperty,
	getAssociatedCurrencyPropertyPath,
	getAssociatedTextProperty,
	getAssociatedTimezoneProperty,
	getAssociatedUnitProperty,
	getAssociatedUnitPropertyPath,
	getStaticTimezone,
	getStaticUnitOrCurrency,
	isTimezone
} from "sap/fe/core/templating/PropertyHelper";
import { isMultiValueField } from "sap/fe/core/templating/UIFormatters";
import type { DefaultTypeForEdmType } from "sap/fe/core/type/EDM";
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { criticalityExpressionForIntegrationCards } from "sap/fe/core/templating/CriticalityFormatters";
import tableFormatters from "sap/fe/macros/formatters/TableFormatter";
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import ActionHelper from "sap/fe/macros/internal/helpers/ActionHelper";
import Library from "sap/ui/core/Lib";
import MessageType from "sap/ui/core/message/MessageType";
import type ConverterContext from "../../ConverterContext";
import type {
	AvailabilityType,
	CustomDefinedTableColumn,
	CustomDefinedTableColumnForOverride,
	FormatOptionsType,
	ManifestAction,
	NavigationSettingsConfiguration,
	NavigationTargetConfiguration,
	TableColumnSettings,
	TableManifestConfiguration,
	TableManifestSettingsConfiguration
} from "../../ManifestSettings";
import {
	ActionType,
	CreationMode,
	HorizontalAlign,
	Importance,
	OperationGroupingMode,
	SelectionMode,
	TemplateType,
	VariantManagementType,
	VisualizationType
} from "../../ManifestSettings";
import type ManifestWrapper from "../../ManifestWrapper";
import { AggregationHelper } from "../../helpers/Aggregation";
import { isReferencePropertyStaticallyHidden } from "../../helpers/DataFieldHelper";
import { getTableID } from "../../helpers/ID";
import { getMessageTypeFromCriticalityType } from "./Criticality";
import type { StandardAction } from "./table/StandardActions";
import {
	StandardActionKeys,
	generateStandardActionsContext,
	getCreationRow,
	getCutVisibility,
	getDeleteVisibility,
	getInsertUpdateActionsTemplating,
	getMassEditVisibility,
	getRestrictions,
	getStandardActionCreate,
	getStandardActionCut,
	getStandardActionDelete,
	getStandardActionInsights,
	getStandardActionMassEdit,
	getStandardActionMoveUpDown,
	getStandardActionPaste,
	isDraftOrStickySupported,
	isInDisplayMode
} from "./table/StandardActions";

type UploadTableSettings = {
	stream: string;
	fileName?: string;
	fileNameMaxLength?: int;
	acceptableMediaTypes?: string[];
	maxLength?: int;
	uploadAction?: StandardAction;
};

type RowNavigationInfo =
	| {
			type: "Outbound";
			navigationTarget: string;
			navigationInEditMode?: boolean;
	  }
	| {
			type: "Navigation";
			targetPath: string;
			checkEditable: boolean;
			recreateContext: boolean;
			routePath: string;
			navigationInEditMode?: boolean;
	  };

type RowConfiguration = {
	action?: string;
	navigationInfo?: RowNavigationInfo;
	rowHighlighting: CompiledBindingToolkitExpression;
	rowNavigated: CompiledBindingToolkitExpression;
	rowCriticalityForInsights?: CompiledBindingToolkitExpression;
	visible?: CompiledBindingToolkitExpression;
};

export type MassEditTableConfiguration = {
	enabled: boolean;
	visibleFields: string[];
	ignoredFields: string[];
	operationGroupingMode: OperationGroupingMode;
	customFragment?: string;
};

type TableSortConditions = {
	sorters: {
		name: string;
		descending: boolean;
	}[];
};

type TableGroupConditions = {
	groupLevels: { name: string }[];
};

type TableAggregateConditions = Record<string, object>;

type TableP13nMode = "Aggregate" | "Column" | "Filter" | "Group" | "Sort";

export type TableAnnotationConfiguration = {
	collection: string;
	variantManagement: VariantManagementType;
	filterId?: string;
	id: string;
	apiId: string;
	navigationPath: string;
	p13nMode?: TableP13nMode[];
	row?: RowConfiguration;
	selectionMode: string | undefined;
	isInsertUpdateActionsTemplated: boolean;
	updatablePropertyPath: string;
	displayMode?: boolean;
	threshold: number;
	entityName: string;
	entityTypeName: string;
	sortConditions?: TableSortConditions;
	groupConditions?: TableGroupConditions;
	aggregateConditions?: TableAggregateConditions;
	initialExpansionLevel?: number;
	allowDropBetweenNodes?: boolean;
	changeSiblingForRootsSupported?: boolean;
	/** Create new entries */
	create: CreateBehavior | CreateBehaviorExternal;
	title: string | undefined;
	searchable: boolean;
	requiredProperties?: string[];
	uploadTable?: UploadTableSettings;
};
/**
 * New entries are created within the app (default case)
 */
export type CreateBehavior = {
	mode: CreationMode;
	append: boolean;
	newAction?: string;
	navigateToTarget?: string;
};

export type ExternalMethodConfig = {
	moduleName: string;
	methodName: string;
};
/**
 * New entries are created by navigating to some target
 */
export type CreateBehaviorExternal = {
	mode: "External";
	outbound: string;
	outboundDetail: NavigationTargetConfiguration["outboundDetail"];
	navigationSettings: NavigationSettingsConfiguration;
};
export type TableCapabilityRestriction = {
	isDeletable: boolean;
	isUpdatable: boolean;
};
export type TableFiltersConfiguration = {
	paths: {
		annotationPath: string;
	}[];
	showCounts?: boolean;
};
export type SelectionVariantConfiguration = {
	propertyNames: string[];
	text?: string;
};

export type TableControlConfiguration = {
	disableRequestCache: boolean;
	createAtEnd: boolean;
	createInPlace?: boolean;
	creationMode: CreationMode;
	disableAddRowButtonForEmptyData: boolean;
	customValidationFunction: string | undefined;
	useCondensedTableLayout: boolean;
	enableExport: boolean;
	enablePastingOfComputedProperties?: boolean;
	frozenColumnCount?: number;
	widthIncludingColumnHeader?: boolean;
	header?: string;
	headerVisible?: boolean;
	filters?: Partial<Record<"quickFilters" | "hiddenFilters", TableFiltersConfiguration>>;
	type: TableType;
	rowCountMode?: TableRowCountMode;
	rowCount?: number;
	scrollThreshold?: number;
	selectAll?: boolean;
	selectionLimit: number;
	multiSelectMode: string | undefined;
	enablePaste: boolean;
	disableCopyToClipboard?: boolean;
	enableFullScreen: boolean;
	showRowCount: boolean;
	inlineCreationRowCount?: number;
	inlineCreationRowsHiddenInEditMode?: boolean;
	massEdit: MassEditTableConfiguration;
	enableAutoColumnWidth: boolean;
	hasDataStateIndicatorFilter: boolean;
	isCompactType?: boolean;
	hierarchyQualifier?: string;
	isHierarchyParentNodeUpdatable?: boolean;
	enableAddCardToInsights?: boolean | undefined;
	creationDialogFields?: string[];
	nodeType?: {
		propertyName: string;
		values: { value: string; text: string; creationDialogFields?: string[] }[];
	};
	createEnablement?: ExternalMethodConfig;
	isNodeMovable?: ExternalMethodConfig;
	isMoveToPositionAllowed?: ExternalMethodConfig;
	selectionChange?: string;
	additionalRequiredModules?: string[];
	beforeRebindTable?: string;
	exportRequestSize?: number;
	enableUploadPlugin?: boolean;
	modeForNoDataMessage?: string;
};
export type TableType = "GridTable" | "ResponsiveTable" | "AnalyticalTable" | "TreeTable";
export type TableRowCountMode = "Auto" | "Fixed";

enum ColumnType {
	Default = "Default", // Default Type (Custom Column)
	Annotation = "Annotation",
	Slot = "Slot",
	Computed = "Computed"
}
// Custom Column from Manifest
export type ManifestDefinedCustomColumn = CustomDefinedTableColumn & {
	type?: ColumnType.Default;
};
// Slot Column from Building Block
export type FragmentDefinedSlotColumn = CustomDefinedTableColumn & {
	type: ColumnType.Slot;
};
// Properties all ColumnTypes have:
export type BaseTableColumn = ConfigurableObject & {
	type: ColumnType; //Origin of the source where we are getting the templated information from
	width?: string;
	widthIncludingColumnHeader?: boolean;
	importance?: Importance;
	horizontalAlign?: HorizontalAlign;
	availability?: AvailabilityType;
	isNavigable?: boolean;
	caseSensitive: boolean;
	label?: string;
	tooltip?: string;
};
// Properties on Custom Columns and Slot Columns
export type CustomBasedTableColumn = BaseTableColumn & {
	id: string;
	name: string;
	header?: string;
	template: string;
	propertyInfos?: string[];
	exportSettings?: ColumnExportSettings | null;
	formatOptions: FormatOptionsType;
	isGroupable: boolean;
	isNavigable: boolean;
	sortable: boolean;
	visualSettings: { widthCalculation: null };
	properties?: string[];
	required?: CompiledBindingToolkitExpression;
};

export type ComputedTableColumn = BaseTableColumn & {
	name: string;
	label: string;
	propertyKey: string;
	isDraftIndicator?: boolean;
	isSituationsIndicator?: boolean;
	formatOptions?: FormatOptionsType | null;
	propertyInfos?: string[];
	exportSettings?: ColumnExportSettings | null;
	clipboardSettings?: Object | null;
	required?: CompiledBindingToolkitExpression;
};

// Properties derived from Manifest to override Annotation configurations
export type AnnotationTableColumnForOverride = BaseTableColumn & {
	settings?: TableColumnSettings;
	formatOptions?: FormatOptionsType;
	exportSettings?: ColumnExportSettings | null;
};
export type PropertyTypeConstraints = Partial<{
	scale: number;
	precision: number;
	maxLength: number;
	nullable: boolean;
	minimum: string;
	maximum: string;
	isDigitSequence: boolean;
}>;
export type PropertyTypeFormatOptions = Partial<{
	parseAsString: boolean;
	emptyString: string;
	parseKeepsEmptyString: boolean;
}>;
export type PropertyTypeConfig = {
	type?: string;
	constraints: PropertyTypeConstraints;
	formatOptions: PropertyTypeFormatOptions;
	typeInstance?: unknown;
	baseType?: string;
	className?: keyof typeof DefaultTypeForEdmType;
};
export type ColumnExportSettings = Partial<{
	template: string;
	label: string;
	wrap: boolean;
	type: string;
	inputFormat: string;
	format: string;
	scale: number;
	delimiter: boolean;
	unit: string;
	unitProperty: string;
	timezone: string;
	timezoneProperty: string;
	utc: boolean;
	dataPointTargetValue: string;
	isCurrency: boolean;
	property: string[];
	width: number;
	autoScale: boolean;
}>;
// Properties for Annotation Columns
export type AnnotationTableColumn = AnnotationTableColumnForOverride & {
	name: string;
	propertyInfos?: string[];
	annotationPath: string;
	relativePath: string;
	label?: string;
	tooltip?: string;
	groupLabel?: string;
	group?: string;
	FieldGroupHiddenExpressions?: CompiledBindingToolkitExpression;
	showDataFieldsLabel?: boolean;
	required?: CompiledBindingToolkitExpression;
	isKey?: boolean;
	isGroupable?: boolean;
	unit?: string;
	unitText?: string;
	timezoneText?: string;
	timezone?: string;
	semanticObjectPath?: string;
	sortable: boolean;
	filterable?: boolean;
	exportSettings?: ColumnExportSettings | null;
	textArrangement?: {
		textProperty: string;
		mode: DisplayMode;
	};
	additionalPropertyInfos?: string[];
	visualSettings?: VisualSettings;
	typeConfig?: PropertyTypeConfig;
	isPartOfLineItem?: boolean; // temporary indicator to only allow filtering on navigation properties when they're part of a line item
	isPartOfCustomColumn?: boolean;
	additionalLabels?: string[];
	exportDataPointTargetValue?: string;
	aggregatable?: boolean;
	extension?: ExtensionForAnalytics;
	isMultiValue?: boolean;
};
export type ExtensionForAnalytics = {
	additionalProperties?: string[];
};
export type TechnicalColumn = AnnotationTableColumn & {
	extension?: {
		technicallyGroupable: boolean;
		technicallyAggregatable: boolean;
	};
};
export type VisualSettings = {
	widthCalculation?: WidthCalculation;
};
export type WidthCalculation = null | {
	minWidth?: number;
	maxWidth?: number;
	defaultWidth?: number;
	truncateLabel?: boolean;
	gap?: number;
	// only relevant for complex types
	excludeProperties?: string[];
	verticalArrangement?: boolean;
};

export type TableColumn = CustomBasedTableColumn | AnnotationTableColumn | ComputedTableColumn | TechnicalColumn;
export type ManifestColumn = CustomElement<CustomBasedTableColumn | AnnotationTableColumnForOverride>;
export type InternalExtensionForAnalytics = ExtensionForAnalytics & {
	fromGroupableProperty: boolean;
	relativePath: string;
};
export type TableVisualization = {
	type: VisualizationType.Table;
	annotation: TableAnnotationConfiguration;
	control: TableControlConfiguration;
	columns: TableColumn[];
	actions: BaseAction[];
	commandActions?: Record<string, CustomAction>;
	analyticsExtensions?: Record<string, InternalExtensionForAnalytics>;
	requestAtLeast?: string[];
	enableAnalytics?: boolean;
	enableBasicSearch?: boolean;
	operationAvailableMap: string;
	operationAvailableProperties: string;
	headerInfoTitle: string;
	semanticKeys: string[];
	headerInfoTypeName: PropertyAnnotationValue<String> | undefined;
	enable$select: boolean;
	enable$$getKeepAliveContext: boolean;
	isInsightsEnabled?: boolean;
	header?: string;
	headerVisible?: boolean;
	handlePatchSent: boolean;
};

/**
 * Returns an array of all standard, annotation-based, and manifest-based table actions.
 * @param lineItemAnnotation
 * @param visualizationPath
 * @param converterContext
 * @param standardActions
 * @param navigationSettings
 * @returns The complete table actions
 */
export function getTableActions(
	lineItemAnnotation: LineItem,
	visualizationPath: string,
	converterContext: ConverterContext<PageContextPathTarget>,
	standardActions: StandardActionsConfiguration["standardActions"],
	navigationSettings?: NavigationSettingsConfiguration
): CombinedAction {
	// 1. Get actions from annotations
	const tableActions = getTableAnnotationActions(lineItemAnnotation, visualizationPath, converterContext);
	// 2. Get actions from manifest
	const manifestActions = getActionsFromManifest(
		converterContext.getManifestControlConfiguration<TableManifestConfiguration>(visualizationPath).actions as Record<
			string,
			ManifestAction
		>,
		converterContext,
		tableActions.tableActions,
		navigationSettings,
		true
	);
	// The "Copy" action always needs to be placed after the "Create" action, so we need to separate it
	const copyActions = tableActions.tableActions.filter((a) => a.type === ActionType.Copy);
	const annotationActions = tableActions.tableActions.filter((a) => a.type !== ActionType.Copy);
	// Combine standard, annotation, and custom actions together, respecting the fixed order of standard actions
	const annotationAndStandardActions = (
		[
			...annotationActions,
			standardActions.create,
			...copyActions,
			standardActions.delete,
			standardActions.massEdit,
			standardActions.insights,
			standardActions.creationRow, // Not templated as a button
			standardActions.cut,
			standardActions.paste,
			standardActions.moveUp,
			standardActions.moveDown
		] as BaseAction[]
	).filter((action) => action !== undefined);
	// Anchor all non-anchored manifest custom actions/menus before the standard actions
	for (const manifestAction of Object.values(manifestActions.actions)) {
		if ((manifestAction.type === ActionType.Default || manifestAction.type === ActionType.Menu) && !manifestAction.position?.anchor) {
			manifestAction.position = {
				anchor: StandardActionKeys.Create,
				placement: Placement.Before
			};
		}
	}
	// Insert twice to allow regular override for non-standard actions and positional override for standard actions
	const manifestActionEntries = Object.entries(manifestActions.actions);
	const standardManifestActions = Object.fromEntries(manifestActionEntries.filter(([key]) => key.startsWith("StandardAction::")));
	const nonStandardManifestActions = Object.fromEntries(manifestActionEntries.filter(([key]) => !standardManifestActions[key]));
	const actionOverwriteConfig: OverrideTypeAction = {
		isNavigable: OverrideType.overwrite,
		enableOnSelect: OverrideType.overwrite,
		enableAutoScroll: OverrideType.overwrite,
		enabled: OverrideType.overwrite,
		visible: OverrideType.overwrite,
		visibleForContextMenu: OverrideType.overwrite,
		defaultValuesExtensionFunction: OverrideType.overwrite,
		command: OverrideType.overwrite,
		position: OverrideType.overwrite,
		menu: OverrideType.overwrite
	};
	// 3. Get all annotation menu items
	const annotationMenuActionItems = getAnnotationMenuActionItems(annotationActions);
	// 4. Find manifest actions which override any annotation menu items
	const matchingManifestActions = getMatchingManifestAction(annotationMenuActionItems, manifestActions.actions);
	// 5. Get overridden annotation menu items
	const overwrittenMenuActionItems = insertCustomElements(annotationMenuActionItems, matchingManifestActions, actionOverwriteConfig);
	// 6. Override all actions
	let actions = insertCustomElements(annotationAndStandardActions, nonStandardManifestActions, actionOverwriteConfig) as CustomAction[];
	actions = insertCustomElements(actions, standardManifestActions, {
		position: OverrideType.overwrite
	});
	// 7. Replace original menu items with their corresponding overridden menu items
	prepareMenuActions(actions, overwrittenMenuActionItems);
	// 8. Remove duplicate actions which are menu items
	actions = removeDuplicateActions(actions);
	// 9. Hide menus where all menu items are hidden
	actions = getVisibilityEnablementMenuActions(actions);
	return {
		actions: actions,
		commandActions: manifestActions.commandActions
	};
}
/**
 * Returns an array of all columns, annotation-based as well as manifest-based.
 * They are sorted and some properties can be overwritten via the manifest (check out the keys that can be overwritten).
 * @param lineItemAnnotation Collection of data fields for representation in a table or list
 * @param visualizationPath
 * @param converterContext
 * @param navigationSettings
 * @returns Returns all table columns that should be available, regardless of templating or personalization or their origin
 */
export function getTableColumns(
	lineItemAnnotation: LineItem,
	visualizationPath: string,
	converterContext: ConverterContext<PageContextPathTarget>,
	navigationSettings?: NavigationSettingsConfiguration
): TableColumn[] {
	const annotationColumns = getColumnsFromAnnotations(lineItemAnnotation, visualizationPath, converterContext);
	const manifestColumns = getColumnsFromManifest(
		converterContext.getManifestControlConfiguration<TableManifestConfiguration>(visualizationPath).columns ?? {},
		annotationColumns,
		converterContext,
		converterContext.getAnnotationEntityType(lineItemAnnotation),
		navigationSettings
	);

	const tableColumns: TableColumn[] = insertCustomElements(
		annotationColumns as TableColumn[],
		manifestColumns as Record<string, CustomElement<TableColumn>>,
		{
			width: OverrideType.overwrite,
			widthIncludingColumnHeader: OverrideType.overwrite,
			importance: OverrideType.overwrite,
			horizontalAlign: OverrideType.overwrite,
			availability: OverrideType.overwrite,
			isNavigable: OverrideType.overwrite,
			settings: OverrideType.overwrite,
			formatOptions: OverrideType.overwrite,
			exportSettings: OverrideType.overwrite
		}
	);

	return addComputedColumns(tableColumns, visualizationPath, converterContext);
}

//Returns the ContextDefiningProperties from the custom aggregate annotation or from the aggregation annotation on the property itself.
function getContextDefiningPropertiesFromAggregationAnnotation(aggregationHelper: AggregationHelper): Record<string, string[]> {
	const customAggregateAnnotations = aggregationHelper.getCustomAggregateDefinitions();
	const customAggregatedefinitions: Record<string, string[]> = {};
	customAggregateAnnotations.forEach((annotation) => {
		const aggregatedProperty = aggregationHelper._entityType.entityProperties.find((property) => {
			return property.name === annotation.qualifier;
		});
		if (aggregatedProperty) {
			const contextDefiningProperties =
				annotation.annotations?.Aggregation?.ContextDefiningProperties ??
				aggregatedProperty.annotations.Aggregation?.ContextDefiningProperties;
			customAggregatedefinitions[aggregatedProperty.name] =
				contextDefiningProperties?.map((ctxDefProperty) => ctxDefProperty.value) ?? [];
		}
	});
	return customAggregatedefinitions;
}

/**
 * Retrieve the extension information for all aggregable properties .
 * @param entityType The target entity type.
 * @param tableColumns The array of columns for the entity type.
 * @param converterContext The converter context.
 * @returns The aggregate definitions from the entityType, or undefined if the entity doesn't support analytical queries.
 */
export const getExtensionInfoFromEntityType = function (
	entityType: EntityType,
	tableColumns: TableColumn[],
	converterContext: ConverterContext<PageContextPathTarget>
): Record<string, InternalExtensionForAnalytics> | undefined {
	const aggregationHelper = new AggregationHelper(entityType, converterContext);
	if (!aggregationHelper.isAnalyticsSupported()) {
		return undefined;
	}
	// Keep a set of all currency/unit properties, as we don't want to consider them as aggregates
	// They are aggregates for technical reasons (to manage multi-units situations) but it doesn't make sense from a user standpoint
	const currencyOrUnitProperties = new Set();
	tableColumns.forEach((column) => {
		const tableColumn = column as AnnotationTableColumn;
		if (tableColumn.unit) {
			const targetUnitProperty = tableColumns.find((prop) => prop.name === tableColumn.unit) as AnnotationTableColumn;
			currencyOrUnitProperties.add(targetUnitProperty.relativePath);
		}
	});
	const contextDefiningPropertiesFromAggregation = getContextDefiningPropertiesFromAggregationAnnotation(aggregationHelper);
	const result: Record<string, InternalExtensionForAnalytics> = {};
	tableColumns.forEach((column) => {
		const tableColumn = column as AnnotationTableColumn;
		const property = entityType.entityProperties.find((prop) => prop.name === tableColumn.relativePath);
		if (tableColumn.propertyInfos === undefined && tableColumn.relativePath) {
			let rawContextDefiningProperties = contextDefiningPropertiesFromAggregation[tableColumn.relativePath] as string[] | undefined;

			// if there is no custom aggregate definition, and the property is groupable, then we can use the default context defining properties
			let fromGroupableProperty = false;
			if (!rawContextDefiningProperties && property && !!aggregationHelper.isPropertyGroupable(property)) {
				fromGroupableProperty = true;
				rawContextDefiningProperties = property.annotations.Aggregation?.ContextDefiningProperties?.map(
					(ctxDefProperty) => ctxDefProperty.value
				);
			}
			// Ignore aggregates corresponding to currencies or units of measure
			if (rawContextDefiningProperties && !currencyOrUnitProperties.has(tableColumn.relativePath)) {
				result[tableColumn.name] = {
					fromGroupableProperty: fromGroupableProperty,
					relativePath: tableColumn.relativePath
				};
				const contextDefiningProperties: string[] = [];
				rawContextDefiningProperties.forEach((contextDefiningPropertyName) => {
					// Ignore contextdefiningproperties corresponding to currencies or units of measure
					if (currencyOrUnitProperties.has(contextDefiningPropertyName)) {
						return;
					}
					const foundColumn = findColumnByPath(contextDefiningPropertyName, tableColumns);
					if (foundColumn) {
						contextDefiningProperties.push(foundColumn.name);
					}
				});
				if (contextDefiningProperties.length) {
					result[tableColumn.name].additionalProperties = contextDefiningProperties;
				}
			}
		}
	});
	return result;
};
/**
 * Updates a table visualization for analytical use cases.
 * @param tableVisualization The visualization to be updated
 * @param entityType The entity type displayed in the table
 * @param converterContext The converter context
 * @param presentationVariantAnnotation The presentationVariant annotation (if any)
 */
export function updateTableVisualizationForType(
	tableVisualization: TableVisualization,
	entityType: EntityType,
	converterContext: ConverterContext<PageContextPathTarget>,
	presentationVariantAnnotation?: PresentationVariantType
): void {
	if (tableVisualization.control.type === "AnalyticalTable") {
		const aggregationData = getExtensionInfoFromEntityType(entityType, tableVisualization.columns, converterContext),
			aggregationHelper = new AggregationHelper(entityType, converterContext);
		if (aggregationData) {
			tableVisualization.enableAnalytics = true;
			tableVisualization.enable$select = false;
			tableVisualization.enable$$getKeepAliveContext = false;
			tableVisualization.analyticsExtensions = aggregationData;
			_updatePropertyInfosWithAggregatesDefinitions(tableVisualization);
			const allowedTransformations = aggregationHelper.getAllowedTransformations();
			tableVisualization.enableBasicSearch = allowedTransformations ? allowedTransformations.includes("search") : true;
			// Add group and sort conditions from the presentation variant
			tableVisualization.annotation.groupConditions = getGroupConditions(
				presentationVariantAnnotation,
				tableVisualization.columns,
				tableVisualization.control.type
			);
			tableVisualization.annotation.aggregateConditions = getAggregateConditions(
				presentationVariantAnnotation,
				tableVisualization.columns,
				aggregationData
			);

			if (ModelHelper.isObjectPathDraftSupported(converterContext.getDataModelObjectPath())) {
				// For an analytical table displaying a draft-enabled entity, we always load 'HasActiveEntity'
				// because it's needed for the row criticality expression
				if (tableVisualization.requestAtLeast) {
					tableVisualization.requestAtLeast.push("HasActiveEntity");
				} else {
					tableVisualization.requestAtLeast = ["HasActiveEntity"];
				}

				// We always load 'HasDraftEntity' in a LR because it's needed to navigate to the draft instance if there's one when clicking on the active instance
				if (ModelHelper.isDraftRoot(converterContext.getEntitySet())) {
					tableVisualization.requestAtLeast.push("HasDraftEntity");
				}
			}
		} else {
			Log.error(`Aggregation not supported for this entity type: ${entityType.name}`);
		}
		tableVisualization.control.type = "GridTable"; // AnalyticalTable isn't a real type for the MDC:Table, so we always switch back to Grid
	} else if (tableVisualization.control.type === "ResponsiveTable") {
		tableVisualization.annotation.groupConditions = getGroupConditions(
			presentationVariantAnnotation,
			tableVisualization.columns,
			tableVisualization.control.type
		);
	} else if (tableVisualization.control.type === "TreeTable") {
		const aggregationHelper = new AggregationHelper(entityType, converterContext);
		const allowedTransformations = aggregationHelper.getAllowedTransformations();
		tableVisualization.enableBasicSearch = allowedTransformations ? allowedTransformations.includes("search") : true;
		tableVisualization.enable$$getKeepAliveContext = true;
		tableVisualization.annotation.changeSiblingForRootsSupported = (entityType?.annotations.Hierarchy?.[
			`RecursiveHierarchyActions#${tableVisualization.control.hierarchyQualifier ?? ""}`
		]?.ChangeSiblingForRootsSupported ?? true) as boolean;

		tableVisualization.annotation.allowDropBetweenNodes =
			!!entityType.annotations.Hierarchy?.[`RecursiveHierarchyActions#${tableVisualization.control.hierarchyQualifier ?? ""}`]
				?.ChangeNextSiblingAction;

		// We always load 'HasDraftEntity' in a LR because it's needed to navigate to the draft instance if there's one when clicking on the active instance
		if (ModelHelper.isDraftRoot(converterContext.getEntitySet())) {
			if (tableVisualization.requestAtLeast) {
				tableVisualization.requestAtLeast.push("HasDraftEntity");
			} else {
				tableVisualization.requestAtLeast = ["HasDraftEntity"];
			}
		}
	}

	if (tableVisualization.control.enableUploadPlugin) {
		const streamProperty = converterContext.getAnnotationEntityType().annotations?.UI?.MediaResource?.Stream?.$target;
		if (!streamProperty) {
			throw "UI.MediaResource annotation with Stream property missing";
		}

		// the upload action is treated as the create action
		const uploadAction = tableVisualization.actions.find((a) => a.key === StandardActionKeys.Create) as StandardAction;

		tableVisualization.annotation.uploadTable = {
			stream: streamProperty.name,
			fileName: (streamProperty.annotations.Core?.ContentDisposition?.Filename as PathAnnotationExpression<string> | undefined)?.path,
			fileNameMaxLength: streamProperty.annotations.Core?.ContentDisposition?.Filename?.$target?.maxLength,
			acceptableMediaTypes: streamProperty.annotations.Core?.AcceptableMediaTypes,
			maxLength: streamProperty.maxLength,
			uploadAction: uploadAction
		};
	}
}

/**
 * Creates and returns a select query with the selected fields from the parameters that were passed.
 * @param lineItem The LineItem we want the requested properties from.
 * @param converterContext The converter context.
 * @param operationAvailable A string containing the available operation, which we'll take the properties to add to the select query.
 * @param presentationVariantAnnotation The presentation variant annotation which we'll take the RequestAtLeast properties from.
 * @returns The 'select' query that has the selected fields from the parameters that were passed.
 */
export function createRequestedProperties(
	lineItem: LineItem,
	converterContext: ConverterContext,
	operationAvailable?: string,
	presentationVariantAnnotation?: PresentationVariantType
): string[] {
	const entityType = converterContext.getAnnotationEntityType(lineItem);
	const selectedFields: string[] = [];
	function pushField(field: string): void {
		if (field && !selectedFields.includes(field) && field.indexOf("/") !== 0) {
			// Do not add singleton property (with absolute path) to $select
			selectedFields.push(field);
		}
	}

	function pushFieldList(fields: string[]): void {
		if (fields?.length) {
			fields.forEach(pushField);
		}
	}

	const operationAvailableProperties = (operationAvailable || "").split(",");
	const validProperties = operationAvailableProperties.filter(function (propName: string) {
		return entityType.resolvePath(propName);
	});
	const semanticKeys: string[] = (entityType.annotations.Common?.SemanticKey || []).map((semanticKey) => semanticKey.value);
	const capabilitiesAnnotation = converterContext.getEntitySet()?.annotations?.Capabilities;
	const alternateAndSecondaryKeys = ModelHelper.getAlternateAndSecondaryKeys(entityType, converterContext.getEntitySet() as EntitySet);
	if (presentationVariantAnnotation) {
		pushFieldList(presentationVariantAnnotation.RequestAtLeast?.map((propertyPath) => propertyPath.value));
	}
	pushFieldList(getNavigationAvailableFieldsFromLineItem(lineItem, entityType));
	pushFieldList(validProperties);
	pushFieldList(semanticKeys);
	pushFieldList(alternateAndSecondaryKeys);
	if (capabilitiesAnnotation) {
		pushField((capabilitiesAnnotation.DeleteRestrictions?.Deletable as PathAnnotationExpression<boolean>)?.path);
		pushField((capabilitiesAnnotation.UpdateRestrictions?.Updatable as PathAnnotationExpression<boolean>)?.path);
	}

	return selectedFields;
}

/**
 * This return the property that are available from the NavigationAvailable annotation on IBN Fields.
 * @param lineItem The line item annotation.
 * @param entityType The Entity Type.
 * @returns An array containing the properties name.
 */
function getNavigationAvailableFieldsFromLineItem(lineItem: LineItem, entityType: EntityType): string[] {
	const selectedFields: string[] = [];
	lineItem.forEach(function (record) {
		if (
			record.$Type === UIAnnotationTypes.DataFieldForIntentBasedNavigation &&
			!record.Inline &&
			!record.Determining &&
			isPathAnnotationExpression(record.NavigationAvailable)
		) {
			const path = (record.NavigationAvailable as unknown as { path: string }).path;
			if (entityType.resolvePath(path)) {
				selectedFields.push(path);
			}
		}
	});
	return selectedFields;
}

/**
 * Get the navigation target path from manifest settings.
 * @param converterContext The converter context
 * @param navigationPropertyPath The navigation path to check in the manifest settings
 * @returns Navigation path from manifest settings
 */
export function getNavigationTargetPath(converterContext: ConverterContext<PageContextPathTarget>, navigationPropertyPath: string): string {
	const manifestWrapper = converterContext.getManifestWrapper();
	if (navigationPropertyPath && manifestWrapper.getNavigationConfiguration(navigationPropertyPath)) {
		const navConfig = manifestWrapper.getNavigationConfiguration(navigationPropertyPath);
		if (Object.keys(navConfig).length > 0) {
			return navigationPropertyPath;
		}
	}
	const dataModelPath = converterContext.getDataModelObjectPath();
	const contextPath = converterContext.getContextPath();
	const navConfigForContextPath = manifestWrapper.getNavigationConfiguration(contextPath);
	if (navConfigForContextPath && Object.keys(navConfigForContextPath).length > 0) {
		return contextPath;
	}
	return dataModelPath.targetEntitySet ? dataModelPath.targetEntitySet.name : dataModelPath.startingEntitySet.name;
}
function findColumnByPath(path: string, tableColumns: TableColumn[]): TableColumn | undefined {
	return tableColumns.find((column) => {
		const annotationColumn = column as AnnotationTableColumn;
		return annotationColumn.propertyInfos === undefined && annotationColumn.relativePath === path;
	});
}
/**
 * Sets the 'unit', 'textArrangement', 'timezone' and 'exportsettings' properties in columns when necessary.
 * @param converterContext The instance of the converter context
 * @param tableColumns The columns to be updated
 */
export function updateLinkedProperties(converterContext: ConverterContext, tableColumns: TableColumn[]): void {
	const dataModelObjectPath = converterContext.getConverterContextFor(converterContext.getContextPath()).getDataModelObjectPath();
	tableColumns.forEach((oColumn) => {
		const tableColumn = oColumn as AnnotationTableColumn;
		if (tableColumn.propertyInfos === undefined && tableColumn.relativePath) {
			const propertyDataModelObjectPath = enhanceDataModelPath<Property>(dataModelObjectPath, tableColumn.relativePath);
			const property = propertyDataModelObjectPath.targetObject;
			if (property) {
				addCurrencyOrUoMToProperty(property, propertyDataModelObjectPath, tableColumns, tableColumn);
				const timezoneProperty = getAssociatedTimezoneProperty(property);
				const timezone = property?.annotations?.Common?.Timezone;
				if (timezoneProperty) {
					const oTimezoneColumn = findColumnByPath(timezoneProperty.name, tableColumns);
					tableColumn.timezone = oTimezoneColumn?.name;
				} else if (timezone) {
					tableColumn.timezoneText = timezone.toString();
				}
				const displayMode = getDisplayMode(property),
					textAnnotation = property.annotations.Common?.Text;
				if (isPathAnnotationExpression(textAnnotation) && displayMode !== "Value") {
					const textColumn = findColumnByPath(textAnnotation.path, tableColumns);
					if (textColumn && textColumn.name !== tableColumn.name) {
						tableColumn.textArrangement = {
							textProperty: textColumn.name,
							mode: displayMode
						};
						// If text properties are used but hidden, we must include them to the export as there are used in the paste
						if (!textColumn.exportSettings) {
							textColumn.exportSettings = { type: "String" };
						}
					}
				}
			}
		}
	});
}

/**
 * Adds the "unit" property into the columns when neccesary for columns with unit of measure and currencies.
 * @param property The property referenced on the column
 * @param dataModelObjectPath The property DataModelObjectPath.
 * @param tableColumns The list of columns displayed on the table
 * @param tableColumn The table column which adds the currency or unit
 * @returns The updated property with the UoM or currency
 */

function addCurrencyOrUoMToProperty(
	property: Property,
	propertyDataModelObjectPath: DataModelObjectPath<Property>,
	tableColumns: TableColumn[],
	tableColumn: AnnotationTableColumn
): void {
	const currencyOrUoMProperty = getAssociatedCurrencyPropertyPath(property) || getAssociatedUnitPropertyPath(property);
	if (currencyOrUoMProperty) {
		const currencyOrUoMPropertyDataModelObjectPath = enhanceDataModelPath<Property>(propertyDataModelObjectPath, currencyOrUoMProperty);
		const currencyOrUoMRelativePath = getContextRelativeTargetObjectPath(currencyOrUoMPropertyDataModelObjectPath);
		if (currencyOrUoMRelativePath) {
			const unitColumn = findColumnByPath(currencyOrUoMRelativePath, tableColumns);
			tableColumn.unit = unitColumn?.name;
		}
	} else {
		const unit = property?.annotations?.Measures?.ISOCurrency || property?.annotations?.Measures?.Unit;
		if (unit) {
			tableColumn.unitText = `${unit}`;
		}
	}
}
function getSemanticKeysAndTitleInfo(converterContext: ConverterContext<PageContextPathTarget>): {
	headerInfoTitlePath: string;
	semanticKeyColumns: string[];
	headerInfoTypeName: PropertyAnnotationValue<String> | undefined;
} {
	const headerInfoTitlePath = (converterContext.getAnnotationEntityType()?.annotations?.UI?.HeaderInfo?.Title as DataFieldTypes)?.Value
		?.path;
	const semanticKeyAnnotations = converterContext.getAnnotationEntityType()?.annotations?.Common?.SemanticKey;
	const headerInfoTypeName = converterContext?.getAnnotationEntityType()?.annotations?.UI?.HeaderInfo?.TypeName;
	const semanticKeyColumns: string[] = [];
	if (semanticKeyAnnotations) {
		semanticKeyAnnotations.forEach(function (oColumn) {
			semanticKeyColumns.push(oColumn.value);
		});
	}
	return { headerInfoTitlePath, semanticKeyColumns, headerInfoTypeName };
}
export function createTableVisualization(
	lineItemAnnotation: LineItem,
	visualizationPath: string,
	converterContext: ConverterContext<PageContextPathTarget>,
	params?: Partial<{
		presentationVariantAnnotation: PresentationVariantType;
		selectionVariantAnnotation: SelectionVariantType;
		isCondensedTableLayoutCompliant: boolean;
	}>
): TableVisualization {
	const { presentationVariantAnnotation, isCondensedTableLayoutCompliant, selectionVariantAnnotation } = params ?? {};
	const tableManifestConfig = getTableManifestConfiguration(
		lineItemAnnotation,
		visualizationPath,
		converterContext,
		isCondensedTableLayoutCompliant,
		selectionVariantAnnotation
	);
	const { navigationPropertyPath } = splitPath(visualizationPath);
	const navigationTargetPath = getNavigationTargetPath(converterContext, navigationPropertyPath);
	const navigationSettings = converterContext.getManifestWrapper().getNavigationConfiguration(navigationTargetPath);
	const columns = getTableColumns(lineItemAnnotation, visualizationPath, converterContext, navigationSettings);
	const operationAvailableMap = getOperationAvailableMap(lineItemAnnotation, converterContext);
	const semanticKeysAndHeaderInfoTitle = getSemanticKeysAndTitleInfo(converterContext);
	const standardActionsConfiguration = getStandardActionsConfiguration(
		lineItemAnnotation,
		visualizationPath,
		converterContext,
		tableManifestConfig,
		navigationSettings
	);
	const tableAnnotation = getTableAnnotationConfiguration(
		lineItemAnnotation,
		visualizationPath,
		converterContext,
		tableManifestConfig,
		columns,
		navigationSettings,
		standardActionsConfiguration,
		presentationVariantAnnotation
	);
	const tableActions = getTableActions(
		lineItemAnnotation,
		visualizationPath,
		converterContext,
		standardActionsConfiguration.standardActions,
		navigationSettings
	);
	const operationAvailable = getOperationAvailableProperties(operationAvailableMap, converterContext);
	let header = tableManifestConfig.header;
	header ??= tableAnnotation.title === "" ? undefined : tableAnnotation.title;
	const oVisualization: TableVisualization = {
		type: VisualizationType.Table,
		annotation: tableAnnotation,
		control: tableManifestConfig,
		actions: tableActions.actions,
		commandActions: tableActions.commandActions,
		columns: columns,
		operationAvailableMap: JSON.stringify(operationAvailableMap),
		operationAvailableProperties: operationAvailable,
		headerInfoTitle: semanticKeysAndHeaderInfoTitle.headerInfoTitlePath,
		semanticKeys: semanticKeysAndHeaderInfoTitle.semanticKeyColumns,
		headerInfoTypeName: semanticKeysAndHeaderInfoTitle.headerInfoTypeName,
		enable$select: true,
		enable$$getKeepAliveContext: true,
		header: header,
		headerVisible: tableManifestConfig.headerVisible,
		requestAtLeast: createRequestedProperties(lineItemAnnotation, converterContext, operationAvailable, presentationVariantAnnotation),
		handlePatchSent: converterContext.getManifestWrapper().getTemplateType() !== TemplateType.ListReport
	};
	updateLinkedProperties(converterContext, columns);
	updateTableVisualizationForType(
		oVisualization,
		converterContext.getAnnotationEntityType(lineItemAnnotation),
		converterContext,
		presentationVariantAnnotation
	);
	return oVisualization;
}
export function createDefaultTableVisualization(
	converterContext: ConverterContext<PageContextPathTarget>,
	isBlankTable?: boolean
): TableVisualization {
	const tableManifestConfig = getTableManifestConfiguration(undefined, "", converterContext, false);
	const columns = getColumnsFromEntityType(
		{},
		converterContext.getEntityType(),
		[],
		converterContext,
		tableManifestConfig.type,
		tableManifestConfig.creationMode,
		{}
	);
	const operationAvailableMap = getOperationAvailableMap(undefined, converterContext);
	const semanticKeysAndHeaderInfoTitle = getSemanticKeysAndTitleInfo(converterContext);
	const navigationTargetPath = getNavigationTargetPath(converterContext, "");
	const navigationSettings = converterContext.getManifestWrapper().getNavigationConfiguration(navigationTargetPath);
	const standardActionsConfiguration = getStandardActionsConfiguration(
		undefined,
		"",
		converterContext,
		tableManifestConfig,
		navigationSettings
	);
	const oVisualization: TableVisualization = {
		type: VisualizationType.Table,
		annotation: getTableAnnotationConfiguration(
			undefined,
			"",
			converterContext,
			tableManifestConfig,
			isBlankTable ? [] : columns,
			navigationSettings,
			standardActionsConfiguration
		),
		control: tableManifestConfig,
		actions: [],
		columns: columns,
		operationAvailableMap: JSON.stringify(operationAvailableMap),
		operationAvailableProperties: getOperationAvailableProperties(operationAvailableMap, converterContext),
		headerInfoTitle: semanticKeysAndHeaderInfoTitle.headerInfoTitlePath,
		semanticKeys: semanticKeysAndHeaderInfoTitle.semanticKeyColumns,
		headerInfoTypeName: semanticKeysAndHeaderInfoTitle.headerInfoTypeName,
		enable$select: true,
		enable$$getKeepAliveContext: true,
		header: tableManifestConfig.header,
		headerVisible: tableManifestConfig.headerVisible,
		handlePatchSent: converterContext.getManifestWrapper().getTemplateType() !== TemplateType.ListReport
	};
	updateLinkedProperties(converterContext, columns);
	updateTableVisualizationForType(oVisualization, converterContext.getEntityType(), converterContext);
	return oVisualization;
}
/**
 * Gets the map of Core.OperationAvailable property paths for all DataFieldForActions.
 * @param lineItemAnnotation The instance of the line item
 * @param converterContext The instance of the converter context
 * @returns The record containing all action names and their corresponding Core.OperationAvailable property paths
 */
function getOperationAvailableMap(
	lineItemAnnotation: LineItem | undefined,
	converterContext: ConverterContext<PageContextPathTarget>
): Record<string, unknown> {
	return ActionHelper.getOperationAvailableMap(lineItemAnnotation, "table", converterContext);
}
/**
 * Gets updatable propertyPath for the current entityset if valid.
 * @param converterContext The instance of the converter context
 * @returns The updatable property for the rows
 */
function getCurrentEntitySetUpdatablePath(converterContext: ConverterContext<PageContextPathTarget>): string {
	const restrictions = getRestrictions(converterContext);
	const entitySet = converterContext.getEntitySet();
	const updatable = restrictions.isUpdatable;
	const isOnlyDynamicOnCurrentEntity = !isConstant(updatable.expression) && updatable.navigationExpression._type === "Unresolvable";
	const updatableExpression = entitySet?.annotations.Capabilities?.UpdateRestrictions?.Updatable;
	const updatablePropertyPath = isPathAnnotationExpression(updatableExpression) && updatableExpression.path;
	return isOnlyDynamicOnCurrentEntity ? (updatablePropertyPath as string) : "";
}
/**
 * Method to retrieve all property paths assigned to the Core.OperationAvailable annotation.
 * @param operationAvailableMap The record consisting of actions and their Core.OperationAvailable property paths
 * @param converterContext The instance of the converter context
 * @returns The CSV string of all property paths associated with the Core.OperationAvailable annotation
 */
function getOperationAvailableProperties(
	operationAvailableMap: Record<string, unknown>,
	converterContext: ConverterContext<PageContextPathTarget>
): string {
	const properties = new Set();
	for (const actionName in operationAvailableMap) {
		const propertyName = operationAvailableMap[actionName];
		if (propertyName === null) {
			// Annotation configured with explicit 'null' (action advertisement relevant)
			properties.add(actionName);
		} else if (typeof propertyName === "string") {
			// Add property paths and not Constant values.
			properties.add(propertyName);
		}
	}
	if (properties.size) {
		// Some actions have an operation available based on property --> we need to load the HeaderInfo.Title property
		// so that the dialog on partial actions is displayed properly (BCP 2180271425)
		const entityType = converterContext.getEntityType();
		const titleProperty = (entityType.annotations?.UI?.HeaderInfo?.Title as DataFieldTypes)?.Value?.path;
		if (titleProperty) {
			properties.add(titleProperty);
		}
	}
	return Array.from(properties).join(",");
}
/**
 * Iterates over the DataFieldForAction and DataFieldForIntentBasedNavigation of a line item and
 * returns all the UI.Hidden annotation expressions.
 * @param lineItemAnnotation Collection of data fields used for representation in a table or list
 * @param currentEntityType Current entity type
 * @param contextDataModelObjectPath Object path of the data model
 * @returns All the `UI.Hidden` path expressions found in the relevant actions
 */
function getUIHiddenExpForActionsRequiringContext(
	lineItemAnnotation: LineItem,
	currentEntityType: EntityType,
	contextDataModelObjectPath: DataModelObjectPath<PageContextPathTarget>
): BindingToolkitExpression<boolean>[] {
	const aUiHiddenPathExpressions: BindingToolkitExpression<boolean>[] = [];
	lineItemAnnotation.forEach((dataField) => {
		// Check if the lineItem context is the same as that of the action:
		if (
			(dataField.$Type === UIAnnotationTypes.DataFieldForAction &&
				dataField?.ActionTarget?.isBound &&
				currentEntityType === dataField?.ActionTarget.sourceEntityType) ||
			(dataField.$Type === UIAnnotationTypes.DataFieldForIntentBasedNavigation &&
				dataField.RequiresContext &&
				dataField?.Inline?.valueOf() !== true)
		) {
			if (typeof dataField.annotations?.UI?.Hidden?.valueOf() === "object") {
				aUiHiddenPathExpressions.push(equal(getHiddenExpressionAtTableLevel(dataField, contextDataModelObjectPath), false));
			}
		}
	});
	return aUiHiddenPathExpressions;
}
/**
 * This method is used to get the binding expression of the path of a DataField.
 * @param expression CompiledBindingToolkitExpression
 * @returns The binding expression
 */
function getPathFromActionAnnotation(expression: CompiledBindingToolkitExpression): CompiledBindingToolkitExpression {
	let path: CompiledBindingToolkitExpression;
	if (isPathAnnotationExpression(expression)) {
		path = expression.path;
	} else {
		path = expression;
	}
	return path;
}
/**
 * This method is used to change the context currently referenced by this binding by removing the last navigation property.
 *
 * It is used (specifically in this case), to transform a binding made for a NavProp context /MainObject/NavProp1/NavProp2,
 * into a binding on the previous context /MainObject/NavProp1.
 * @param source DataFieldForAction | DataFieldForIntentBasedNavigation | CustomAction
 * @param contextDataModelObjectPath DataModelObjectPath
 * @returns The binding expression
 */
function getHiddenExpressionAtTableLevel(
	source: DataFieldAbstractTypes,
	contextDataModelObjectPath: DataModelObjectPath<PageContextPathTarget>
): BindingToolkitExpression<unknown> {
	const expression = source.annotations?.UI?.Hidden as CompiledBindingToolkitExpression;
	let path = getPathFromActionAnnotation(expression);
	if (typeof path === "object") {
		return constant(false);
	} else if (typeof path === "string") {
		if ("visible" in source) {
			path = path.substring(1, path.length - 1);
		}
		if (path.indexOf("/") > 0) {
			//check if the navigation property is correct:
			const splitPathForNavigationProperty = path.split("/");
			const navigationPath = splitPathForNavigationProperty[0];
			if (
				isNavigationProperty(contextDataModelObjectPath?.targetObject) &&
				contextDataModelObjectPath.targetObject.partner === navigationPath
			) {
				return pathInModel(splitPathForNavigationProperty.slice(1).join("/"));
			} else {
				return constant(true);
			}
		} else {
			return constant(false);
		}
	}
	return constant(true);
}
/**
 * Loop through the manifest actions and check the following:
 *
 * If the data field is also referenced as a custom action.
 * If the underlying manifest action is either a bound action or has the 'RequiresContext' property set to true.
 *
 * If so, the 'requiresSelection' property is forced to 'true' in the manifest.
 * @param dataFieldId Id of the DataField evaluated
 * @param dataField DataField evaluated
 * @param manifestActions The actions defined in the manifest
 * @returns `true` if the DataField is found among the manifest actions
 */
function updateManifestActionAndTagIt(
	dataFieldId: string,
	dataField: DataFieldForAction | DataFieldForIntentBasedNavigation,
	manifestActions: Record<string, CustomAction>
): boolean {
	return Object.keys(manifestActions).some((actionKey) => {
		if (actionKey === dataFieldId) {
			if (
				(dataField as DataFieldForAction)?.ActionTarget?.isBound ||
				(dataField as DataFieldForIntentBasedNavigation)?.RequiresContext
			) {
				manifestActions[dataFieldId].requiresSelection = true;
			}
			return true;
		}
		return false;
	});
}
/**
 * Loop through the DataFieldForAction and DataFieldForIntentBasedNavigation of a line item and
 * check the following:
 * If at least one of them is always visible in the table toolbar and requires a context
 * If an action is also defined in the manifest, it is set aside and will be considered
 * when going through the manifest.
 * @param lineItemAnnotation Collection of data fields for representation in a table or list
 * @param manifestActions The actions defined in the manifest
 * @param currentEntityType Current Entity Type
 * @returns `true` if there is at least 1 action that meets the criteria
 */
function hasBoundActionsAlwaysVisibleInToolBar(
	lineItemAnnotation: LineItem,
	manifestActions: Record<string, CustomAction>,
	currentEntityType: EntityType
): boolean {
	return lineItemAnnotation.some((dataField) => {
		if (
			(dataField.$Type === UIAnnotationTypes.DataFieldForAction ||
				dataField.$Type === UIAnnotationTypes.DataFieldForIntentBasedNavigation) &&
			dataField?.Inline?.valueOf() !== true &&
			(dataField.annotations?.UI?.Hidden?.valueOf() === false || dataField.annotations?.UI?.Hidden?.valueOf() === undefined)
		) {
			if (dataField.$Type === UIAnnotationTypes.DataFieldForAction) {
				const manifestActionId = generate(["DataFieldForAction", dataField.Action as string]);
				// if the DataFieldForActon from annotation also exists in the manifest, its visibility will be evaluated later on
				if (updateManifestActionAndTagIt(manifestActionId, dataField, manifestActions)) {
					return false;
				}
				// Check if the lineItem context is the same as that of the action:
				return dataField?.ActionTarget?.isBound && currentEntityType === dataField?.ActionTarget.sourceEntityType;
			} else if (dataField.$Type === UIAnnotationTypes.DataFieldForIntentBasedNavigation) {
				// if the DataFieldForIntentBasedNavigation from annotation also exists in the manifest, its visibility will be evaluated later on
				if (
					updateManifestActionAndTagIt(
						`DataFieldForIntentBasedNavigation::${dataField.SemanticObject}::${dataField.Action}`,
						dataField,
						manifestActions
					)
				) {
					return false;
				}
				return dataField.RequiresContext;
			}
		}
		return false;
	});
}
/**
 * Checks if a custom action that requires a context is always visible in the toolbar.
 * @param manifestActions The actions defined in the manifest
 * @returns `true` if there is at least 1 action that meets the criteria
 */
function hasCustomActionsAlwaysVisibleInToolBar(manifestActions: Record<string, CustomAction>): boolean {
	const customActions = Object.keys(manifestActions).reduce((actions: CustomAction[], actionKey) => {
		const action = manifestActions[actionKey];
		if (!action.menu) {
			//simple custom action
			actions.push(action);
		} else {
			// grouped actions
			actions = [...actions, ...(action.menu.filter((menuAction) => typeof menuAction !== "string") as CustomAction[])];
		}
		return actions;
	}, []);
	return !!customActions.find(
		(action) => action.requiresSelection && (action.visible === undefined || action.visible?.toString() === "true")
	);
}
/**
 * Iterates over the custom actions (with key requiresSelection) declared in the manifest for the current line item and returns all the
 * visible key values as an expression.
 * @param manifestActions The actions defined in the manifest
 * @returns Array<Expression<boolean>> All the visible path expressions of the actions that meet the criteria
 */
function getVisibleExpForCustomActionsRequiringContext(manifestActions: Record<string, CustomAction>): BindingToolkitExpression<boolean>[] {
	const aVisiblePathExpressions: BindingToolkitExpression<boolean>[] = [];
	if (manifestActions) {
		Object.keys(manifestActions).forEach((actionKey) => {
			const action = manifestActions[actionKey];
			if (action.requiresSelection === true && action.visible !== undefined) {
				if (typeof action.visible === "string") {
					/*The final aim would be to check if the path expression depends on the parent context
					and considers only those expressions for the expression evaluation,
					but currently not possible from the manifest as the visible key is bound on the parent entity.
					Tricky to differentiate the path as it's done for the Hidden annotation.
					For the time being we consider all the paths of the manifest*/
					aVisiblePathExpressions.push(resolveBindingString(action?.visible?.valueOf()));
				}
			}
		});
	}
	return aVisiblePathExpressions;
}
/**
 * Evaluate if the path is statically deletable or updatable.
 * @param converterContext
 * @returns The table capabilities
 */
export function getCapabilityRestriction(converterContext: ConverterContext<PageContextPathTarget>): TableCapabilityRestriction {
	const isDeletable = isPathDeletable(converterContext.getDataModelObjectPath());
	const isUpdatable = isPathUpdatable(converterContext.getDataModelObjectPath());
	return {
		isDeletable: !(isConstant(isDeletable) && isDeletable.value === false),
		isUpdatable: !(isConstant(isUpdatable) && isUpdatable.value === false)
	};
}
export function getSelectionMode(
	lineItemAnnotation: LineItem | undefined,
	visualizationPath: string,
	converterContext: ConverterContext<PageContextPathTarget>,
	isEntitySet: boolean,
	targetCapabilities: TableCapabilityRestriction,
	deleteButtonVisibilityExpression?: BindingToolkitExpression<boolean>,
	massEditVisibilityExpression: BindingToolkitExpression<boolean> = constant(false),
	cutButtonVisibilityExpression: BindingToolkitExpression<boolean> = constant(false)
): string | undefined {
	const tableManifestSettings = converterContext.getManifestControlConfiguration<TableManifestConfiguration>(visualizationPath);
	const tableType = tableManifestSettings.tableSettings?.type;
	let selectionMode = tableManifestSettings.tableSettings?.selectionMode;

	// The collapse/Expand action of a tree table is a bound action, as a result, a tree table should always have a selection mode to "Multi" when no selectionMode has been set in the manifest
	if (tableType === "TreeTable" && !selectionMode) {
		return SelectionMode.Multi;
	}

	// If the selection mode is forced to 'None' in the manifest/macro table parameters, we keep it unless here is a delete button
	if (!lineItemAnnotation || selectionMode === SelectionMode.None) {
		if (targetCapabilities.isDeletable && deleteButtonVisibilityExpression) {
			return compileExpression(ifElse(deleteButtonVisibilityExpression, constant(SelectionMode.Multi), constant(SelectionMode.None)));
		}
		return SelectionMode.None;
	}
	if (selectionMode === SelectionMode.ForceMulti) {
		return SelectionMode.Multi;
	} else if (selectionMode === SelectionMode.ForceSingle) {
		return SelectionMode.Single;
	}
	let aHiddenBindingExpressions: BindingToolkitExpression<boolean>[] = [],
		aVisibleBindingExpressions: BindingToolkitExpression<boolean>[] = [];
	const manifestActions = getActionsFromManifest(
		converterContext.getManifestControlConfiguration<TableManifestConfiguration>(visualizationPath).actions,
		converterContext,
		[],
		undefined,
		false
	);
	let isParentDeletable, parentEntitySetDeletable;
	if (converterContext.getTemplateType() === TemplateType.ObjectPage) {
		isParentDeletable = isPathDeletable(converterContext.getDataModelObjectPath());
		parentEntitySetDeletable = isParentDeletable ? compileExpression(isParentDeletable, true) : isParentDeletable;
	}
	const bMassEditEnabled: boolean = !isConstant(massEditVisibilityExpression) || massEditVisibilityExpression.value !== false;
	if (!selectionMode || selectionMode === SelectionMode.Auto) {
		selectionMode = SelectionMode.Multi;
	}
	if (bMassEditEnabled) {
		// Override default selection mode when mass edit is visible
		selectionMode = selectionMode === SelectionMode.Single ? SelectionMode.Single : SelectionMode.Multi;
	}
	if (
		hasBoundActionsAlwaysVisibleInToolBar(lineItemAnnotation, manifestActions.actions, converterContext.getEntityType()) ||
		hasCustomActionsAlwaysVisibleInToolBar(manifestActions.actions)
	) {
		return selectionMode;
	}
	aHiddenBindingExpressions = getUIHiddenExpForActionsRequiringContext(
		lineItemAnnotation,
		converterContext.getEntityType(),
		converterContext.getDataModelObjectPath()
	);
	aVisibleBindingExpressions = getVisibleExpForCustomActionsRequiringContext(manifestActions.actions);
	// No action requiring a context:
	if (
		aHiddenBindingExpressions.length === 0 &&
		aVisibleBindingExpressions.length === 0 &&
		(cutButtonVisibilityExpression || deleteButtonVisibilityExpression || bMassEditEnabled)
	) {
		if (!isEntitySet) {
			// Example: OP case
			if (targetCapabilities.isDeletable || parentEntitySetDeletable !== "false" || bMassEditEnabled) {
				// Building expression for delete and mass edit
				const buttonVisibilityExpression = or(
					cutButtonVisibilityExpression || true,
					deleteButtonVisibilityExpression || true, // default delete visibility as true
					massEditVisibilityExpression
				);
				return compileExpression(
					ifElse(and(UI.IsEditable, buttonVisibilityExpression), constant(selectionMode), constant(SelectionMode.None))
				);
			} else {
				return compileExpression(
					ifElse(cutButtonVisibilityExpression, constant(SelectionMode.Single), constant(SelectionMode.None))
				);
			}
			// EntitySet deletable:
		} else if (bMassEditEnabled) {
			// example: LR scenario
			return selectionMode;
		} else if (targetCapabilities.isDeletable && deleteButtonVisibilityExpression) {
			return compileExpression(ifElse(deleteButtonVisibilityExpression, constant(selectionMode), constant(SelectionMode.None)));
			// EntitySet not deletable:
		} else {
			return SelectionMode.None;
		}
		// There are actions requiring a context:
	} else if (!isEntitySet) {
		// Example: OP case
		if (targetCapabilities.isDeletable || parentEntitySetDeletable !== "false" || bMassEditEnabled) {
			// Use selectionMode in edit mode if delete is enabled or mass edit is visible
			const editModebuttonVisibilityExpression = ifElse(
				bMassEditEnabled && !targetCapabilities.isDeletable,
				massEditVisibilityExpression,
				constant(true)
			);
			return compileExpression(
				ifElse(
					and(UI.IsEditable, editModebuttonVisibilityExpression),
					constant(selectionMode),
					ifElse(
						or(...aHiddenBindingExpressions.concat(aVisibleBindingExpressions)),
						constant(selectionMode),
						constant(SelectionMode.None)
					)
				)
			);
		} else {
			return compileExpression(
				ifElse(
					or(...aHiddenBindingExpressions.concat(aVisibleBindingExpressions)),
					constant(selectionMode),
					constant(SelectionMode.None)
				)
			);
		}
		//EntitySet deletable:
	} else if (targetCapabilities.isDeletable || bMassEditEnabled) {
		// Example: LR scenario
		return selectionMode;
		//EntitySet not deletable:
	} else {
		return compileExpression(
			ifElse(
				or(...aHiddenBindingExpressions.concat(aVisibleBindingExpressions), massEditVisibilityExpression),
				constant(selectionMode),
				constant(SelectionMode.None)
			)
		);
	}
}

/**
 * Method to retrieve all table actions from annotations.
 * @param lineItemAnnotation
 * @param visualizationPath
 * @param converterContext
 * @returns The table annotation actions
 */
function getTableAnnotationActions(
	lineItemAnnotation: LineItem,
	visualizationPath: string,
	converterContext: ConverterContext<PageContextPathTarget>
): { tableActions: Array<AnnotationAction | AnnotationActionGroup> } {
	const tableActions: Array<AnnotationAction | AnnotationActionGroup> = [];
	const copyDataField = getCopyAction(
		lineItemAnnotation.filter((dataField) => {
			return dataFieldIsCopyAction(dataField as DataFieldForActionTypes);
		}) as DataFieldForActionTypes[]
	);
	if (copyDataField) {
		tableActions.push({
			type: ActionType.Copy,
			annotationPath: converterContext.getEntitySetBasedAnnotationPath(copyDataField.fullyQualifiedName),
			key: KeyHelper.generateKeyFromDataField(copyDataField),
			visible: compileExpression(visibleExpression(copyDataField, converterContext)),
			visibleForContextMenu: compileExpression(visibleForContextMenuExpression(copyDataField, converterContext)),
			text: copyDataField.Label?.toString() ?? Library.getResourceBundleFor("sap.fe.core")!.getText("C_COMMON_COPY"),
			isNavigable: true
		});
	}
	lineItemAnnotation
		.filter((dataField) => {
			return !dataFieldIsCopyAction(dataField as DataFieldForAction);
		})
		.forEach((dataField: DataFieldAbstractTypes) => {
			if (
				isDataFieldForActionAbstract(dataField) &&
				dataField.Inline?.valueOf() !== true &&
				dataField.Determining?.valueOf() !== true
			) {
				const tableAction = getDataFieldAnnotationAction(dataField, converterContext);
				if (tableAction) {
					tableActions.push(tableAction);
				}
			} else if (isDataFieldForActionGroup(dataField)) {
				const dataFieldGroup = getDataFieldAnnotationAction(dataField, converterContext);
				if (dataFieldGroup) {
					tableActions.push(dataFieldGroup);
				}
			}
		});

	return {
		tableActions
	};
}

// For the context menu, the visibility should also consider the 'inactiveContext' property:
// only when at least one selected context is active (i.e. "contextmenu/inactiveContext" is false), the action should be visible in the context menu
// This is only relevant when the table manifest setting "creationMode" is "InlineCreationRows"
function visibleForContextMenuExpression(
	dataField: DataFieldForAction | DataFieldForIntentBasedNavigation | DataFieldForActionGroup | undefined,
	converterContext: ConverterContext<PageContextPathTarget>
): BindingToolkitExpression<boolean> {
	return and(visibleExpression(dataField, converterContext), equal(pathInModel("contextmenu/inactiveContext", "internal"), false));
}

function getDataFieldAnnotationAction(
	dataField: DataFieldAbstractTypes,
	converterContext: ConverterContext<PageContextPathTarget>
): AnnotationAction | AnnotationActionGroup | void {
	switch (dataField.$Type) {
		case UIAnnotationTypes.DataFieldForAction:
			const tableAction: AnnotationAction = {
				type: ActionType.DataFieldForAction,
				annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
				key: KeyHelper.generateKeyFromDataField(dataField),
				visible: compileExpression(visibleExpression(dataField, converterContext)),
				visibleForContextMenu: compileExpression(visibleForContextMenuExpression(dataField, converterContext)),
				isNavigable: true
			};
			const sEntityType = converterContext.getEntityType().fullyQualifiedName;
			if (_useEnabledExpression(dataField, sEntityType)) {
				tableAction.enabled = getEnabledForAnnotationAction(converterContext, dataField.ActionTarget, true);
			}
			return tableAction;
		case UIAnnotationTypes.DataFieldForIntentBasedNavigation:
			return {
				type: ActionType.DataFieldForIntentBasedNavigation,
				annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
				key: KeyHelper.generateKeyFromDataField(dataField),
				visible: compileExpression(visibleExpression(dataField, converterContext)),
				visibleForContextMenu: compileExpression(visibleForContextMenuExpression(dataField, converterContext))
			};
		case UIAnnotationTypes.DataFieldForActionGroup:
			return {
				type: ActionType.Menu,
				key: KeyHelper.generateKeyFromDataField(dataField),
				id: KeyHelper.generateKeyFromDataField(dataField),
				text: dataField.Label?.toString(),
				visible: compileExpression(visibleExpression(dataField, converterContext)),
				visibleForContextMenu: compileExpression(visibleForContextMenuExpression(dataField, converterContext)),
				menu: dataField.Actions.map((action) => getDataFieldAnnotationAction(action, converterContext))
			} as AnnotationActionGroup;
		default:
			return;
	}
}

/**
 * Generate the bindingExpression for the highlight rowSetting parameter.
 * @param criticalityAnnotation Path or value of the criticality
 * @param isDraftRootOrNode  Is the current entitySet an Draft root or a node
 * @param targetEntityType The targeted entityType
 * @returns An expressionBinding
 */
function getHighlightRowBinding(
	criticalityAnnotation: Criticality | undefined,
	isDraftRootOrNode: boolean,
	targetEntityType?: EntityType
): BindingToolkitExpression<MessageType> {
	let defaultHighlightRowDefinition: MessageType | BindingToolkitExpression<MessageType> = MessageType.None;
	if (criticalityAnnotation) {
		if (typeof criticalityAnnotation === "object") {
			defaultHighlightRowDefinition = getExpressionFromAnnotation(criticalityAnnotation) as BindingToolkitExpression<MessageType>;
		} else {
			// Enum Value so we get the corresponding static part
			defaultHighlightRowDefinition = getMessageTypeFromCriticalityType(criticalityAnnotation);
		}
	}
	return formatResult(
		[
			defaultHighlightRowDefinition,
			pathInModel(`filteredMessages`, "internal"),
			isDraftRootOrNode && Entity.HasActive,
			isDraftRootOrNode && Entity.IsActive,
			`${isDraftRootOrNode}`,
			pathInModel("@$ui5.fe.contextPath"),
			UI.IsInactive
		],
		tableFormatters.rowHighlighting,
		targetEntityType
	);
}
function _getCreationBehaviour(
	lineItemAnnotation: LineItem | undefined,
	tableManifestConfiguration: TableControlConfiguration,
	converterContext: ConverterContext<PageContextPathTarget>,
	navigationSettings: NavigationSettingsConfiguration,
	visualizationPath: string
): TableAnnotationConfiguration["create"] {
	const navigation = navigationSettings?.create || navigationSettings?.detail;
	const tableManifestSettings: TableManifestConfiguration = converterContext.getManifestControlConfiguration(visualizationPath);
	const originalTableSettings = (tableManifestSettings && tableManifestSettings.tableSettings) || {};
	// cross-app
	if (navigation?.outbound && navigation.outboundDetail && navigationSettings?.create) {
		return {
			mode: "External",
			outbound: navigation.outbound,
			outboundDetail: navigation.outboundDetail,
			navigationSettings: navigationSettings
		};
	}
	if (
		converterContext.getTemplateType() === TemplateType.ListReport &&
		![CreationMode.NewPage, CreationMode.External, CreationMode.CreationDialog].includes(tableManifestConfiguration.creationMode)
	) {
		// Fallback to "NewPage"
		Log.warning(
			`Creation mode '${tableManifestConfiguration.creationMode}' can not be used within the List Report. Instead, the default mode "NewPage" is used.`
		);
		tableManifestConfiguration.creationMode = CreationMode.NewPage;
	} else if (
		converterContext.getTemplateType() !== TemplateType.ListReport &&
		tableManifestConfiguration.type === "TreeTable" &&
		![CreationMode.NewPage, CreationMode.Inline, CreationMode.CreationDialog].includes(tableManifestConfiguration.creationMode)
	) {
		// Fallback to "NewPage" in case of a non-supported mode for a TreeTable
		Log.warning(
			`Creation mode '${tableManifestConfiguration.creationMode}' can not be used with a Tree Table. Instead, the default mode "NewPage" is used.`
		);
		tableManifestConfiguration.creationMode = CreationMode.NewPage;
	}
	let newAction;
	if (lineItemAnnotation) {
		// in-app
		const targetAnnotations = converterContext.getEntitySet()?.annotations;
		const targetAnnotationsCommon = targetAnnotations?.Common as EntitySetAnnotations_Common,
			targetAnnotationsSession = targetAnnotations?.Session as EntitySetAnnotations_Session;
		newAction = targetAnnotationsCommon?.DraftRoot?.NewAction || targetAnnotationsSession?.StickySessionSupported?.NewAction;
		if (tableManifestConfiguration.creationMode === CreationMode.CreationRow && newAction) {
			// A combination of 'CreationRow' and 'NewAction' does not make sense
			throw Error(`Creation mode '${CreationMode.CreationRow}' can not be used with a custom 'new' action (${newAction})`);
		}
		if (navigation?.route) {
			// route specified
			return {
				mode: tableManifestConfiguration.creationMode,
				append: tableManifestConfiguration.createAtEnd,
				newAction: newAction?.toString(),
				navigateToTarget: tableManifestConfiguration.creationMode === CreationMode.NewPage ? navigation.route : undefined // navigate only in NewPage mode
			};
		}
	}
	// no navigation or no route specified - fallback to inline create if original creation mode was 'NewPage'
	if (tableManifestConfiguration.creationMode === CreationMode.NewPage) {
		if (converterContext.getTemplateType() === TemplateType.ListReport) {
			Log.error("The creation mode 'NewPage' is used but the navigation configuration to the sub page is missing.");
		} else {
			tableManifestConfiguration.creationMode = CreationMode.Inline;
			// In case there was no specific configuration for the createAtEnd we force it to false
			if (originalTableSettings.creationMode?.createAtEnd === undefined) {
				tableManifestConfiguration.createAtEnd = false;
			}
			Log.info("The creation mode was changed from 'NewPage' to 'Inline' due to missing navigation configuration to the sub page.");
		}
	}
	return {
		mode: tableManifestConfiguration.creationMode,
		append: tableManifestConfiguration.createAtEnd,
		newAction: newAction?.toString()
	};
}
const _getRowConfigurationProperty = function (
	lineItemAnnotation: LineItem | undefined,
	converterContext: ConverterContext<PageContextPathTarget>,
	navigationSettings: NavigationSettingsConfiguration,
	targetPath: string,
	tableType: TableType
): RowConfiguration {
	let navigationInfo: RowNavigationInfo | undefined;
	let criticalityProperty: BindingToolkitExpression<MessageType> = constant(MessageType.None);
	const targetEntityType = converterContext.getEntityType();
	const criticalityAnnotation = lineItemAnnotation?.annotations?.UI?.Criticality;
	if (navigationSettings && lineItemAnnotation) {
		const navigationTarget = navigationSettings.display?.target || navigationSettings.detail?.outbound;
		const targetEntitySet = converterContext.getEntitySet();
		criticalityProperty = getHighlightRowBinding(
			criticalityAnnotation,
			!!ModelHelper.getDraftRoot(targetEntitySet) || !!ModelHelper.getDraftNode(targetEntitySet),
			targetEntityType
		);
		if (navigationTarget) {
			navigationInfo = { type: "Outbound", navigationTarget };
		}
		if (!navigationTarget && navigationSettings.detail?.route) {
			const checkEditable =
				ModelHelper.getDraftRoot(targetEntitySet) !== undefined || ModelHelper.getDraftNode(targetEntitySet) !== undefined;
			navigationInfo = {
				type: "Navigation",
				routePath: navigationSettings.detail.route,
				targetPath,
				checkEditable,
				recreateContext: tableType === "AnalyticalTable"
			};
		}
	}
	const rowNavigatedExpression: BindingToolkitExpression<boolean> = formatResult(
		[pathInModel("/deepestPath", "internal")],
		tableFormatters.navigatedRow,
		targetEntityType
	);
	return {
		navigationInfo,
		action: navigationInfo ? "Navigation" : undefined,
		rowHighlighting: compileExpression(criticalityProperty),
		rowNavigated: compileExpression(rowNavigatedExpression),
		rowCriticalityForInsights: criticalityAnnotation ? criticalityExpressionForIntegrationCards(criticalityAnnotation) : undefined,
		visible: compileExpression(not(UI.IsInactive))
	};
};
/**
 * Retrieve the columns from the entityType.
 * @param columnsToBeCreated The columns to be created.
 * @param entityType The target entity type.
 * @param annotationColumns The array of columns created based on LineItem annotations.
 * @param converterContext The converter context.
 * @param tableType The table type.
 * @param tableCreationMode The creation mode of the table.
 * @param displayModeOfDescriptionPropertiesMap The map of properties referenced as description on a text arrangement annotation.
 * @param restrictionsOnProperties The existing restrictions on properties
 * @returns The column from the entityType
 */
export const getColumnsFromEntityType = function (
	columnsToBeCreated: Record<string, Property>,
	entityType: EntityType,
	annotationColumns: AnnotationTableColumn[],
	converterContext: ConverterContext<PageContextPathTarget>,
	tableType: TableType,
	tableCreationMode: CreationMode,
	displayModeOfDescriptionPropertiesMap: Record<string, DisplayMode>,
	restrictionsOnProperties?: RestrictionsOnProperties
): AnnotationTableColumn[] {
	if (annotationColumns === undefined) {
		annotationColumns = [];
	}

	let propertiesNotToBeConsidered: string[] = [];
	const tableColumns: (AnnotationTableColumn | TechnicalColumn)[] = annotationColumns;
	const aggregationHelper = new AggregationHelper(entityType, converterContext);
	const groupableProperties = aggregationHelper.getGroupableProperties();
	//For Analytical table, we exclude all properties that are not groupable and used as Text in a groupable Property.
	if (tableType === "AnalyticalTable" && aggregationHelper.isAnalyticsSupported() && groupableProperties) {
		propertiesNotToBeConsidered = groupableProperties
			.map((property) => property.$target)
			.filter((target) => target !== undefined)
			.map((target) => getAssociatedTextProperty(target as Property))
			.filter((textProp) => textProp && !aggregationHelper.isPropertyGroupable(textProp))
			.map((prop) => prop?.name)
			.filter((name) => name !== undefined) as string[];
	}
	entityType.entityProperties.forEach((property: Property) => {
		// Catch already existing columns - which were added before by LineItem Annotations
		const exists = annotationColumns.some((column) => {
			return column.name === property.name;
		});
		// if target type exists, it is a complex property and should be ignored
		if (!property.targetType && !exists && !propertiesNotToBeConsidered.includes(property.name)) {
			const relatedPropertiesInfo: ComplexPropertyInfo = collectRelatedProperties(
				property.name,
				property,
				converterContext,
				true,
				tableType
			);
			const relatedPropertyNames: string[] = Object.keys(relatedPropertiesInfo.properties);
			const additionalPropertyNames: string[] = Object.keys(relatedPropertiesInfo.additionalProperties);
			// Include the text properties and their corresponding text arrangement
			relatedPropertyNames.forEach((name) => {
				addPropertyToDisplayModeOfDescriptionPropertiesMap(displayModeOfDescriptionPropertiesMap, relatedPropertiesInfo, name);
			});

			const columnInfo = getColumnDefinitionFromProperty(
				property,
				converterContext.getEntitySetBasedAnnotationPath(property.fullyQualifiedName),
				property.name,
				true,
				true,
				aggregationHelper,
				converterContext,
				displayModeOfDescriptionPropertiesMap,
				restrictionsOnProperties,
				tableCreationMode,
				relatedPropertiesInfo
			);
			if (relatedPropertyNames.length > 0) {
				columnInfo.propertyInfos = relatedPropertyNames;
				if (relatedPropertiesInfo.exportSettings.dataPointTargetValue) {
					columnInfo.exportDataPointTargetValue = relatedPropertiesInfo.exportSettings.dataPointTargetValue;
				}
				// Collect information of related columns to be created.
				relatedPropertyNames.forEach((name) => {
					columnsToBeCreated[name] = relatedPropertiesInfo.properties[name].annotationProperty;
				});
			}
			// update Property Label when it's referenced only once in a column, new label will be the label of the column
			updatePropertyLabel(annotationColumns, columnsToBeCreated, columnInfo);
			if (additionalPropertyNames.length > 0) {
				columnInfo.additionalPropertyInfos = additionalPropertyNames;
				// Create columns for additional properties identified for ALP use case.
				additionalPropertyNames.forEach((additionalPropertyName) => {
					// Intentional overwrite as we require only one new PropertyInfo for a related Property.
					columnsToBeCreated[additionalPropertyName] = relatedPropertiesInfo.additionalProperties[additionalPropertyName];
				});
			}
			tableColumns.push(columnInfo);
		}
		// In case a property has defined a #TextOnly text arrangement that points to a text property (and not a 'hard coded text') don't only create the complex property with the text property as a child property,
		// but also the property itself as it can be used as within the sortConditions or on custom columns.
		// This step must be valid also from the columns added via LineItems or from a column available on the p13n.
		if (getDisplayMode(property) === "Description") {
			restrictionsOnProperties?.nonSortableProperties.push(property.name);
			if (isPathAnnotationExpression(property?.annotations?.Common?.Text)) {
				tableColumns.push(
					getColumnDefinitionFromProperty(
						property,
						converterContext.getEntitySetBasedAnnotationPath(property.fullyQualifiedName),
						property.name,
						false,
						false,
						aggregationHelper,
						converterContext,
						displayModeOfDescriptionPropertiesMap,
						restrictionsOnProperties,
						tableCreationMode
					)
				);
			}
		}
	});
	// Create a propertyInfo for each related property.
	const relatedColumns = _createRelatedColumns(
		columnsToBeCreated,
		tableColumns,
		converterContext,
		entityType,
		displayModeOfDescriptionPropertiesMap,
		tableCreationMode,
		restrictionsOnProperties
	);
	return tableColumns.concat(relatedColumns);
};
/**
 * Create a column definition from a property.
 * @param property Entity type property for which the column is created
 * @param fullPropertyPath The full path to the target property
 * @param relativePath The relative path to the target property based on the context
 * @param useDataFieldPrefix Should be prefixed with "DataField::", else it will be prefixed with "Property::"
 * @param availableForAdaptation Decides whether the column should be available for adaptation
 * @param aggregationHelper The aggregationHelper for the entity
 * @param converterContext The converter context
 * @param displayModeOfDescriptionPropertiesMap The map of properties referenced as description on a text arrangement annotation
 * @param restrictionsOnProperties The existing restrictions on properties
 * @param tableCreationMode The creation mode of the table
 * @param relatedPropertiesInfo The properties identified so far for the column
 * @param relativePathForMultiValue The MDC path used for the 1:n property to allow filtering from MDC
 * @returns The annotation column definition
 */
const getColumnDefinitionFromProperty = function (
	property: Property,
	fullPropertyPath: string,
	relativePath: string,
	useDataFieldPrefix: boolean,
	availableForAdaptation: boolean,
	aggregationHelper: AggregationHelper,
	converterContext: ConverterContext<PageContextPathTarget>,
	displayModeOfDescriptionPropertiesMap: Record<string, DisplayMode>,
	restrictionsOnProperties?: RestrictionsOnProperties,
	tableCreationMode?: CreationMode,
	relatedPropertiesInfo?: ComplexPropertyInfo,
	relativePathForMultiValue?: string
): AnnotationTableColumn | TechnicalColumn {
	let name, key;
	const semanticObjectAnnotationPath = getSemanticObjectPath(converterContext, property);
	const isHidden = isReferencePropertyStaticallyHidden(property);
	const groupPath: string | undefined = property.name ? _sliceAtSlash(property.name, true, false) : undefined;
	const isGroup: boolean = groupPath != property.name;
	const label = getLabel(property, isGroup);
	const dataType: string | undefined = getDataFieldDataType(property);
	const propertyTypeConfig = getTypeConfig(property, dataType);
	const isAPropertyFromTextOnlyAnnotation = displayModeOfDescriptionPropertiesMap[relativePath] === "Description";
	const sortable =
		(!isHidden || isAPropertyFromTextOnlyAnnotation) && !restrictionsOnProperties?.nonSortableProperties.includes(relativePath);
	const filterable = !isAPropertyFromTextOnlyAnnotation && !restrictionsOnProperties?.nonFilterableProperties.includes(relativePath);
	const typeConfig = {
		className: property.type || dataType,
		formatOptions: propertyTypeConfig.formatOptions,
		constraints: propertyTypeConfig.constraints
	};
	let exportSettings: ColumnExportSettings | null = null;
	if (_isExportableColumn(property)) {
		exportSettings = createColumnExportSettings(property, relatedPropertiesInfo);
	}
	const availability: AvailabilityType =
		!availableForAdaptation || isHidden || displayModeOfDescriptionPropertiesMap[relativePath] ? "Hidden" : "Adaptation";
	const collectedNavigationPropertyLabels: string[] | undefined = _getCollectedNavigationPropertyLabels(relativePath, converterContext);
	if (relativePathForMultiValue) {
		name = relativePathForMultiValue;
		key = "DataField::" + replaceSpecialChars(relativePathForMultiValue);
		relativePath = relativePathForMultiValue;
	} else {
		name = useDataFieldPrefix ? relativePath : `Property::${relativePath}`;
		key = (useDataFieldPrefix ? "DataField::" : "Property::") + replaceSpecialChars(relativePath);
	}

	const column: AnnotationTableColumn = {
		key: key,
		type: ColumnType.Annotation,
		label: label,
		groupLabel: isGroup ? getLabel(property) : undefined,
		group: isGroup ? groupPath : undefined,
		annotationPath: fullPropertyPath,
		semanticObjectPath: semanticObjectAnnotationPath,
		availability: availability,
		name: name,
		relativePath: relativePath,
		sortable: sortable,
		filterable: filterable,
		isGroupable: aggregationHelper.isAnalyticsSupported() ? !!aggregationHelper.isPropertyGroupable(property) : sortable,
		isKey: property.isKey,
		exportSettings: exportSettings,
		caseSensitive: isFilteringCaseSensitive(converterContext),
		typeConfig: typeConfig as PropertyTypeConfig,
		importance: getImportance(converterContext, property.annotations?.UI?.DataFieldDefault),
		required: isRequiredColumn(converterContext, property, tableCreationMode),
		additionalLabels: collectedNavigationPropertyLabels
	};
	_addToolTip(property, column);
	_setExportSettingsForDataPoint(property, column);

	if (
		aggregationHelper.isAnalyticsSupported() &&
		ModelHelper.isObjectPathDraftSupported(converterContext.getDataModelObjectPath()) &&
		(relativePath === "HasActiveEntity" || relativePath === "HasDraftEntity")
	) {
		// In case of analytical table on a draft-enabled entity, we always consider the HasDraftEntity and HasActiveEntity properties as
		// technically groupable, as we need to load them for our internal logic.
		const enhancedColumn = column as TechnicalColumn;
		enhancedColumn.extension = {
			technicallyAggregatable: false,
			technicallyGroupable: true
		};
		return enhancedColumn;
	} else {
		return column;
	}
};
/**
 * Create the export settings for a given column.
 * @param column The given column from a line item as a data field or a property from the entity type
 * @param relatedPropertiesInfo The related properties linked to the column (named also complex property)
 * @returns The export settings in a the given column
 */
const createColumnExportSettings = function (
	column: Property | DataFieldAbstractTypes,
	relatedPropertiesInfo?: ComplexPropertyInfo
): ColumnExportSettings {
	let unitProperty, timezoneProperty, unitText, timezoneText, utc, isATimezone, currencyProperty, scale;
	const relatedPropertyNames = relatedPropertiesInfo ? Object.keys(relatedPropertiesInfo.properties) : [];
	if (relatedPropertiesInfo && relatedPropertyNames?.length === 1) {
		// Create the export settings of a column based on the related (child) property in case there is only one.
		// This is required when we have a text only annotation to compute the export settings from the text instead of the value
		column = relatedPropertiesInfo.properties[relatedPropertyNames[0]].annotationProperty;
	}
	const dataType = getDataFieldDataType(column);
	if (isProperty(column)) {
		unitProperty = getAssociatedUnitProperty(column);
		currencyProperty = getAssociatedCurrencyProperty(column);
		timezoneProperty = getAssociatedTimezoneProperty(column);
		unitText = getStaticUnitOrCurrency(column);
		timezoneText = getStaticTimezone(column);
		isATimezone = isTimezone(column);
		scale = column.scale;
	}
	unitProperty = relatedPropertiesInfo?.exportSettings?.unitProperty ?? unitProperty?.name ?? currencyProperty?.name;
	timezoneProperty = relatedPropertiesInfo?.exportSettings?.timezoneProperty ?? timezoneProperty?.name;
	scale = relatedPropertiesInfo?.exportSettings?.scale ?? scale;
	const exportType = getExportDataType(dataType, isATimezone, !!currencyProperty, relatedPropertiesInfo?.exportSettings);
	if (timezoneProperty || (exportType === "DateTime" && !timezoneText)) {
		utc = false;
	}
	const exportSettings: ColumnExportSettings = {
		type: exportType,
		inputFormat: getDateInputFormat(dataType),
		delimiter: getDelimiter(dataType),
		scale: scale,
		unitProperty: unitProperty,
		unit: relatedPropertiesInfo?.exportSettings.unit ?? unitText,
		timezoneProperty: timezoneProperty,
		timezone: relatedPropertiesInfo?.exportSettings.timezone ?? timezoneText?.toString(),
		template: relatedPropertiesInfo?.exportSettings.template,
		//only in case of complex properties, wrap the cell content	on the excel exported file
		wrap: relatedPropertiesInfo?.exportSettings.wrap,
		utc: utc
	};
	if (exportSettings.unitProperty || exportSettings.unit) {
		exportSettings.autoScale = true;
	}
	return removeUndefinedFromExportSettings(exportSettings);
};
/**
 * Gets the export format template for columns with dates.
 * @param dataType The data type of the column
 * @returns The inputFormat
 */
const getDateInputFormat = function (dataType?: string): string | undefined {
	return dataType === "Edm.Date" ? "YYYY-MM-DD" : undefined;
};
/**
 * Gets the delimiter in numeric columns.
 * The delimiter is used to display thousands separator in numeric columns.
 * @param dataType The data type of the column
 * @returns True to display thousands separator in numeric columns
 */
const getDelimiter = function (dataType?: string): boolean | undefined {
	return dataType === "Edm.Int64" ? true : undefined;
};
/**
 * Removes undefined values from the export settings object of a column.
 * @param exportSettings The export settings configurations for a column
 * @returns The export settings configurations without undefined values
 */
const removeUndefinedFromExportSettings = function (exportSettings: ColumnExportSettings): ColumnExportSettings {
	//Remove undefined settings from exportSetting object
	for (const setting in exportSettings) {
		if (exportSettings[setting as keyof ColumnExportSettings] === undefined) {
			delete exportSettings[setting as keyof ColumnExportSettings];
		}
	}
	return exportSettings;
};
/**
 * Update property label in case it's only referenced in one column. The label of the column must be used instead of the property label.
 * This update also is applied for the tooltip as it is based on the column's label.
 * @param annotationColumns The array of columns created based on LineItem annotations.
 * @param columnsToBeCreated The columns to be created
 * @param columnInfo The column definition
 * @param columnName The name of the column
 */
function updatePropertyLabel(
	annotationColumns: AnnotationTableColumn[],
	columnsToBeCreated: Record<string, Property>,
	columnInfo: AnnotationTableColumn,
	columnName?: string
): void {
	const linkedAnnotationColumns = annotationColumns.filter(
		(col) => col.propertyInfos?.includes(columnInfo.relativePath) || (columnName && col.propertyInfos?.includes(columnName))
	);
	if (
		linkedAnnotationColumns?.length === 1 &&
		(columnsToBeCreated[columnInfo.relativePath] || (columnName && columnsToBeCreated[columnName])) &&
		linkedAnnotationColumns[0].propertyInfos?.length === 1
	) {
		columnInfo.label = linkedAnnotationColumns[0].label;
		columnInfo.tooltip = linkedAnnotationColumns[0].tooltip;
	}
}
/**
 * Returns Boolean true for exportable columns, false for non exportable columns.
 * @param source The dataField or property to be evaluated
 * @returns True for exportable column, false for non exportable column
 */
function _isExportableColumn(source: DataFieldAbstractTypes | Property): boolean {
	let propertyType, property;
	const dataFieldDefaultProperty = (source as Property).annotations.UI?.DataFieldDefault;
	if (isProperty(source)) {
		if (isReferencePropertyStaticallyHidden(source)) {
			return false;
		}
		propertyType = dataFieldDefaultProperty?.$Type;
	} else if (isReferencePropertyStaticallyHidden(source)) {
		return false;
	} else {
		property = source;
		propertyType = property.$Type;
		if (propertyType === UIAnnotationTypes.DataFieldForAnnotation && (property as DataFieldForAnnotation).Target?.$target?.$Type) {
			//For Chart
			propertyType = (property as DataFieldForAnnotation).Target?.$target?.$Type;
			return propertyType !== undefined && !UIAnnotationTypes.ChartDefinitionType.includes(propertyType);
		} else if (
			(property as DataField).Value?.$target?.annotations?.Core?.MediaType?.term === "Org.OData.Core.V1.MediaType" &&
			(property as DataField).Value?.$target?.annotations?.Core?.isURL !== true
		) {
			//For Stream
			return false;
		}
	}
	return propertyType
		? ![
				UIAnnotationTypes.DataFieldForAction,
				UIAnnotationTypes.DataFieldForIntentBasedNavigation,
				UIAnnotationTypes.DataFieldForActionGroup
		  ].includes(propertyType)
		: true;
}
/**
 * Returns Boolean true for valid columns, false for invalid columns.
 * @param dataField Different DataField types defined in the annotations
 * @returns True for valid columns, false for invalid columns
 */
const _isValidColumn = function (dataField: DataFieldAbstractTypes): boolean {
	switch (dataField.$Type) {
		case UIAnnotationTypes.DataFieldForAction:
		case UIAnnotationTypes.DataFieldForIntentBasedNavigation:
			return !!dataField.Inline;
		case UIAnnotationTypes.DataFieldWithAction:
		case UIAnnotationTypes.DataFieldWithIntentBasedNavigation:
		case UIAnnotationTypes.DataField:
		case UIAnnotationTypes.DataFieldWithUrl:
		case UIAnnotationTypes.DataFieldForAnnotation:
		case UIAnnotationTypes.DataFieldWithNavigationPath:
			return true;
		default:
			// Todo: Replace with proper Log statement once available
			//  throw new Error("Unhandled DataField Abstract type: " + dataField.$Type);
			return false;
	}
};
/**
 * Returns the binding expression to evaluate the visibility of a DataField or DataPoint annotation.
 *
 * SAP Fiori elements will evaluate either the UI.Hidden annotation defined on the annotation itself or on the target property.
 * @param dataFieldModelPath The metapath referring to the annotation that is evaluated by SAP Fiori elements.
 * @returns An expression that you can bind to the UI.
 */
export const _getVisibleExpression = function (
	dataFieldModelPath: DataModelObjectPath<DataFieldAbstractTypes | DataPointTypeTypes>
): BindingToolkitExpression<boolean> {
	const targetObject = dataFieldModelPath.targetObject;
	let propertyValue;
	if (targetObject) {
		switch (targetObject.$Type) {
			case UIAnnotationTypes.DataField:
			case UIAnnotationTypes.DataFieldWithUrl:
			case UIAnnotationTypes.DataFieldWithNavigationPath:
			case UIAnnotationTypes.DataFieldWithIntentBasedNavigation:
			case UIAnnotationTypes.DataFieldWithAction:
			case UIAnnotationTypes.DataPointType:
				propertyValue = targetObject.Value.$target;
				break;
			case UIAnnotationTypes.DataFieldForAnnotation:
				// if it is a DataFieldForAnnotation pointing to a DataPoint we look at the dataPoint's value
				if (targetObject?.Target?.$target?.$Type === UIAnnotationTypes.DataPointType) {
					propertyValue = targetObject.Target.$target?.Value.$target;
				}
				break;
			case UIAnnotationTypes.DataFieldForIntentBasedNavigation:
			case UIAnnotationTypes.DataFieldForAction:
			default:
				propertyValue = undefined;
		}
	}
	const isAnalyticalGroupHeaderExpanded = /*formatOptions?.isAnalytics ? UI.IsExpanded :*/ constant(false);
	const isAnalyticalLeaf = /*formatOptions?.isAnalytics ? equal(UI.NodeLevel, 0) :*/ constant(false);
	// A data field is visible if:
	// - the UI.Hidden expression in the original annotation does not evaluate to 'true'
	// - the UI.Hidden expression in the target property does not evaluate to 'true'
	// - in case of Analytics it's not visible for an expanded GroupHeader
	return and(
		...[
			not(equal(getExpressionFromAnnotation(targetObject?.annotations?.UI?.Hidden), true)),
			ifElse(
				!!propertyValue,
				propertyValue && not(equal(getExpressionFromAnnotation(propertyValue.annotations?.UI?.Hidden), true)),
				true
			),
			or(not(isAnalyticalGroupHeaderExpanded), isAnalyticalLeaf)
		]
	);
};
/**
 * Returns hidden binding expressions for a field group.
 * @param dataFieldGroup DataField defined in the annotations
 * @returns Compile binding of field group expressions.
 */
const _getFieldGroupHiddenExpressions = function (dataFieldGroup: DataFieldAbstractTypes): CompiledBindingToolkitExpression | undefined {
	const fieldGroupHiddenExpressions: BindingToolkitExpression<boolean>[] = [];
	if (
		dataFieldGroup.$Type === UIAnnotationTypes.DataFieldForAnnotation &&
		dataFieldGroup.Target?.$target?.$Type === UIAnnotationTypes.FieldGroupType
	) {
		if (dataFieldGroup?.annotations?.UI?.Hidden) {
			return compileExpression(not(equal(getExpressionFromAnnotation(dataFieldGroup.annotations.UI.Hidden), true)));
		} else {
			dataFieldGroup.Target.$target.Data?.forEach((innerDataField: DataFieldAbstractTypes | DataPointTypeTypes) => {
				fieldGroupHiddenExpressions.push(
					_getVisibleExpression({ targetObject: innerDataField } as DataModelObjectPath<
						DataFieldAbstractTypes | DataPointTypeTypes
					>)
				);
			});
			return compileExpression(ifElse(or(...fieldGroupHiddenExpressions), constant(true), constant(false)));
		}
	} else {
		return undefined;
	}
};
/**
 * Returns the label for the property and dataField.
 * @param [property] Property, DataField or Navigation Property defined in the annotations
 * @param isGroup
 * @returns Label of the property or DataField
 */
const getLabel = function (property: DataFieldAbstractTypes | Property | NavigationProperty, isGroup = false): string | undefined {
	if (!property) {
		return undefined;
	}
	if (isProperty(property) || isNavigationProperty(property)) {
		const dataFieldDefault = (property as Property).annotations?.UI?.DataFieldDefault;
		if (dataFieldDefault && !dataFieldDefault.qualifier && dataFieldDefault.Label) {
			return dataFieldDefault.Label?.toString();
		}
		return property.annotations.Common?.Label?.toString() ?? property.name;
	} else if (isDataFieldTypes(property)) {
		if (!!isGroup && property.$Type === UIAnnotationTypes.DataFieldWithIntentBasedNavigation) {
			return property?.Label?.toString();
		}
		return (
			property?.Label?.toString() ??
			compileExpression(
				getExpressionFromAnnotation(property.Value?.$target?.annotations?.Common?.Label, [], property.Value?.$target?.name)
			)
		);
	} else if (property.$Type === UIAnnotationTypes.DataFieldForAnnotation) {
		return (
			property.Label?.toString() ??
			compileExpression(
				getExpressionFromAnnotation((property.Target?.$target as DataPoint)?.Value?.$target?.annotations?.Common?.Label?.valueOf())
			)
		);
	} else {
		return property.Label?.toString();
	}
};
const _getTooltip = function (source: DataFieldAbstractTypes | Property): string | undefined {
	if (!source) {
		return undefined;
	}
	if (isProperty(source) || source.annotations?.Common?.QuickInfo) {
		return source.annotations?.Common?.QuickInfo
			? compileExpression(getExpressionFromAnnotation(source.annotations.Common.QuickInfo))
			: undefined;
	} else if (isDataFieldTypes(source)) {
		return source.Value?.$target?.annotations?.Common?.QuickInfo
			? compileExpression(getExpressionFromAnnotation(source.Value.$target.annotations.Common.QuickInfo))
			: undefined;
	} else if (source.$Type === UIAnnotationTypes.DataFieldForAnnotation) {
		const datapointTarget = source.Target?.$target as DataPoint;
		return datapointTarget?.Value?.$target?.annotations?.Common?.QuickInfo
			? compileExpression(getExpressionFromAnnotation(datapointTarget.Value.$target.annotations.Common.QuickInfo))
			: undefined;
	} else {
		return undefined;
	}
};
export function getRowStatusVisibility(colName: string, isSemanticKeyInFieldGroup?: boolean): BindingToolkitExpression<boolean> {
	return formatResult(
		[
			pathInModel(`semanticKeyHasDraftIndicator`, "internal"),
			pathInModel(`filteredMessages`, "internal"),
			colName,
			isSemanticKeyInFieldGroup
		],
		tableFormatters.getErrorStatusTextVisibilityFormatter
	);
}
/**
 * Creates a PropertyInfo for each identified property consumed by a LineItem.
 * @param columnsToBeCreated Identified properties.
 * @param existingColumns The list of columns created for LineItems and Properties of entityType.
 * @param converterContext The converter context.
 * @param entityType The entity type for the LineItem
 * @param displayModeOfDescriptionPropertiesMap The map of properties referenced as text on a text arrangement annotation.
 * @param tableCreationMode The creation mode of the table
 * @param restrictionsOnProperties The existing restrictions on properties
 * @returns The array of columns created.
 */
const _createRelatedColumns = function (
	columnsToBeCreated: Record<string, Property>,
	existingColumns: AnnotationTableColumn[],
	converterContext: ConverterContext<PageContextPathTarget>,
	entityType: EntityType,
	displayModeOfDescriptionPropertiesMap: Record<string, DisplayMode>,
	tableCreationMode?: CreationMode,
	restrictionsOnProperties?: RestrictionsOnProperties
): AnnotationTableColumn[] {
	const relatedColumns: (AnnotationTableColumn | TechnicalColumn)[] = [];
	const relatedPropertyNameMap: Record<string, string> = {};
	const aggregationHelper = new AggregationHelper(entityType, converterContext);
	Object.keys(columnsToBeCreated).forEach((name) => {
		const property = columnsToBeCreated[name],
			annotationPath = converterContext.getAbsoluteAnnotationPath(name),
			// Check whether the related column already exists.
			relatedColumn = existingColumns.find((column) => column.name === name);
		const dataModelObjectPath = converterContext.getConverterContextFor(converterContext.getContextPath()).getDataModelObjectPath();
		const propertyObjectPath = enhanceDataModelPath<PageContextPathTarget>(dataModelObjectPath, name);
		if (isMultiValueField(propertyObjectPath)) {
			const newNameRelativeTargetPath = getContextRelativeTargetObjectPath(propertyObjectPath, false, true);
			const column = getColumnDefinitionFromProperty(
				property,
				annotationPath,
				name,
				true,
				false,
				aggregationHelper,
				converterContext,
				displayModeOfDescriptionPropertiesMap,
				restrictionsOnProperties,
				tableCreationMode,
				undefined,
				newNameRelativeTargetPath
			);
			computeHiddenOnRelatedColumns(existingColumns, name, column);
			updatePropertyLabel(existingColumns, columnsToBeCreated, column, name);
			relatedColumns.push(column);
			relatedPropertyNameMap[name] = newNameRelativeTargetPath ?? name;
		} else if (relatedColumn === undefined) {
			// Case 1: Key contains DataField prefix to ensure all property columns have the same key format.
			// New created property column is set to hidden.
			const column = getColumnDefinitionFromProperty(
				property,
				annotationPath,
				name,
				true,
				false,
				aggregationHelper,
				converterContext,
				displayModeOfDescriptionPropertiesMap,
				restrictionsOnProperties,
				tableCreationMode
			);
			computeHiddenOnRelatedColumns(existingColumns, name, column);
			updatePropertyLabel(existingColumns, columnsToBeCreated, column);
			relatedColumns.push(column);
		} else if (relatedColumn.annotationPath !== annotationPath || relatedColumn.propertyInfos) {
			// Case 2: The existing column points to a LineItem (or)
			// Case 3: This is a self reference from an existing column
			const newName = `Property::${name}`;
			// Checking whether the related property column has already been created in a previous iteration.
			if (!existingColumns.some((column) => column.name === newName)) {
				// Create a new property column with 'Property::' prefix,
				// Set it to hidden as it is only consumed by Complex property infos.
				const column = getColumnDefinitionFromProperty(
					property,
					annotationPath,
					name,
					false,
					false,
					aggregationHelper,
					converterContext,
					displayModeOfDescriptionPropertiesMap,
					restrictionsOnProperties,
					tableCreationMode
				);
				computeHiddenOnRelatedColumns(existingColumns, name, column);
				updatePropertyLabel(existingColumns, columnsToBeCreated, column);
				relatedColumns.push(column);
				relatedPropertyNameMap[name] = newName;
			} else if (
				existingColumns.some((column) => column.name === newName) &&
				existingColumns.some((column) => column.propertyInfos?.includes(name))
			) {
				relatedPropertyNameMap[name] = newName;
			}
		} else if (
			displayModeOfDescriptionPropertiesMap[name] === "Description" &&
			!relatedColumn.filterable &&
			!restrictionsOnProperties?.nonFilterableProperties.includes(name)
		) {
			// Case 4: The column is a referenced text only property. Set it to hidden, non sortable nor groupable.
			// Case 5: The column isn't already available for filtering as it could be referenced on another column (e.g. text first).
			restrictionsOnProperties?.nonSortableProperties.push(name);
			const column = getColumnDefinitionFromProperty(
				property,
				annotationPath,
				name,
				false,
				false,
				aggregationHelper,
				converterContext,
				{},
				restrictionsOnProperties,
				tableCreationMode
			);
			column.isGroupable = false;
			relatedColumns.push(column);
		}
	});
	// The property 'name' has been prefixed with 'Property::' for uniqueness.
	// Update the same in other propertyInfos[] references which point to this property.
	existingColumns.forEach((column) => {
		column.propertyInfos = column.propertyInfos?.map((propertyInfo) => relatedPropertyNameMap[propertyInfo] ?? propertyInfo);
		column.additionalPropertyInfos = column.additionalPropertyInfos?.map(
			(propertyInfo) => relatedPropertyNameMap[propertyInfo] ?? propertyInfo
		);
	});
	return relatedColumns;
};
/**
 * Getting the Column Name
 * If it points to a DataField with one property or DataPoint with one property, it will use the property name
 * here to be consistent with the existing flex changes.
 * @param dataField Different DataField types defined in the annotations
 * @returns The name of annotation columns
 */
const _getAnnotationColumnName = function (dataField: DataFieldAbstractTypes): string {
	// This is needed as we have flexibility changes already that we have to check against
	if (isDataFieldTypes(dataField) && dataField.Value?.path) {
		return dataField.Value?.path;
	} else if (dataField.$Type === UIAnnotationTypes.DataFieldForAnnotation && (dataField.Target?.$target as DataPoint)?.Value?.path) {
		// This is for removing duplicate properties. For example, 'Progress' Property is removed if it is already defined as a DataPoint
		return (dataField.Target?.$target as DataPoint)?.Value.path;
	} else {
		return KeyHelper.generateKeyFromDataField(dataField);
	}
};
/**
 * Creates a PropertyInfo for the identified additional property for the ALP table use-case.
 *
 * For e.g. If UI.Hidden points to a property, include this technical property in the additionalProperties of ComplexPropertyInfo object.
 * @param name The name of the property to be created.
 * @param columns The list of columns created for LineItems and Properties of entityType from the table visualization.
 * @param relatedAdditionalPropertyNameMap
 */
const createTechnicalProperty = function (
	name: string,
	columns: TableColumn[],
	relatedAdditionalPropertyNameMap: Record<string, string>
): void {
	const key = `Property_Technical::${name}`;
	// Validate if the technical property hasn't yet been created on previous iterations.
	const columnExists = columns.find((column) => column.key === key);
	// Retrieve the simple property used by the hidden annotation, it will be used as a base for the mandatory attributes of newly created technical property. For e.g. relativePath
	const additionalProperty =
		!columnExists && (columns.find((column) => column.name === name && !column.propertyInfos) as AnnotationTableColumn)!;
	if (additionalProperty) {
		const technicalColumn: TechnicalColumn = {
			key: key,
			type: ColumnType.Annotation,
			label: additionalProperty.label,
			annotationPath: additionalProperty.annotationPath,
			availability: "Hidden",
			name: key,
			relativePath: additionalProperty.relativePath,
			sortable: false,
			isGroupable: false,
			isKey: false,
			exportSettings: null,
			caseSensitive: false,
			aggregatable: false,
			filterable: false,
			extension: {
				technicallyGroupable: true,
				technicallyAggregatable: true
			}
		};
		columns.push(technicalColumn);
		relatedAdditionalPropertyNameMap[name] = technicalColumn.name;
	}
};
/**
 * Determines if the data field labels have to be displayed in the table.
 * @param fieldGroupName The `DataField` name being processed.
 * @param visualizationPath
 * @param converterContext
 * @returns `showDataFieldsLabel` value from the manifest
 */
const _getShowDataFieldsLabel = function (
	fieldGroupName: string,
	visualizationPath: string,
	converterContext: ConverterContext<PageContextPathTarget>
): boolean | undefined {
	const columns = converterContext.getManifestControlConfiguration<TableManifestConfiguration>(visualizationPath)?.columns;
	const columnKeys = columns && Object.keys(columns);
	return (
		columnKeys &&
		!!columnKeys.find(function (key: string) {
			return key === fieldGroupName && (columns[key] as CustomDefinedTableColumnForOverride).showDataFieldsLabel;
		})
	);
};
/**
 * Determines the relative path of the property with respect to the root entity.
 * @param dataField The `DataField` being processed.
 * @returns The relative path
 */
const _getRelativePath = function (dataField: DataFieldAbstractTypes): string {
	let relativePath = "";
	switch (dataField.$Type) {
		case UIAnnotationTypes.DataField:
		case UIAnnotationTypes.DataFieldWithNavigationPath:
		case UIAnnotationTypes.DataFieldWithUrl:
		case UIAnnotationTypes.DataFieldWithIntentBasedNavigation:
		case UIAnnotationTypes.DataFieldWithAction:
			relativePath = (dataField as DataField)?.Value?.path;
			break;
		case UIAnnotationTypes.DataFieldForAnnotation:
			relativePath = dataField?.Target?.value;
			break;
		case UIAnnotationTypes.DataFieldForAction:
		case UIAnnotationTypes.DataFieldForIntentBasedNavigation:
		case UIAnnotationTypes.DataFieldForActionGroup:
		case UIAnnotationTypes.DataFieldWithActionGroup:
			relativePath = KeyHelper.generateKeyFromDataField(dataField);
			break;
	}
	return relativePath;
};
const _sliceAtSlash = function (path: string, isLastSlash: boolean, isLastPart: boolean): string {
	const iSlashIndex = isLastSlash ? path.lastIndexOf("/") : path.indexOf("/");
	if (iSlashIndex === -1) {
		return path;
	}
	return isLastPart ? path.substring(iSlashIndex + 1, path.length) : path.substring(0, iSlashIndex);
};
/**
 * Determines if the column contains a multi-value field.
 * @param dataField The DataField being processed
 * @param converterContext The converter context
 * @returns True if the DataField corresponds to a multi-value field.
 */
const _isColumnMultiValued = function (
	dataField: DataFieldAbstractTypes,
	converterContext: ConverterContext<PageContextPathTarget>
): boolean {
	if (isDataFieldTypes(dataField) && isPathAnnotationExpression(dataField.Value)) {
		const propertyObjectPath = enhanceDataModelPath<PageContextPathTarget>(
			converterContext.getDataModelObjectPath(),
			dataField.Value.path
		);
		return isMultiValueField(propertyObjectPath);
	} else {
		return false;
	}
};
/**
 * Determine whether a column is sortable.
 * @param dataField The data field being processed
 * @param propertyPath The property path
 * @param nonSortableColumns Collection of non-sortable column names as per annotation
 * @param relatedPropertiesInfo The related properties linked to the column
 * @returns True if the column is sortable
 */
const _isColumnSortable = function (
	dataField: DataFieldAbstractTypes,
	propertyPath: string,
	nonSortableColumns: string[],
	relatedPropertiesInfo: ComplexPropertyInfo
): boolean {
	return (
		!nonSortableColumns.includes(propertyPath) && // Column is not marked as non-sortable via annotation
		(((dataField.$Type === UIAnnotationTypes.DataField || dataField.$Type === UIAnnotationTypes.DataFieldForAnnotation) &&
			Object.keys(relatedPropertiesInfo.properties).some((propName) => {
				const isHidden = isReferencePropertyStaticallyHidden(relatedPropertiesInfo.properties[propName].annotationProperty);
				return !isHidden && !nonSortableColumns.includes(propName);
			})) ||
			dataField.$Type === UIAnnotationTypes.DataFieldWithUrl ||
			dataField.$Type === UIAnnotationTypes.DataFieldWithIntentBasedNavigation ||
			dataField.$Type === UIAnnotationTypes.DataFieldWithAction)
	);
};
/**
 * Returns whether filtering on the table is case sensitive.
 * @param converterContext The instance of the converter context
 * @returns Returns 'false' if FilterFunctions annotation supports 'tolower', else 'true'
 */
export const isFilteringCaseSensitive = function (converterContext: ConverterContext<PageContextPathTarget>): boolean {
	const filterFunctions: FilterFunctions | undefined = _getFilterFunctions(converterContext);
	return Array.isArray(filterFunctions) ? !(filterFunctions as String[]).includes("tolower") : true;
};
function _getFilterFunctions(ConverterContext: ConverterContext<PageContextPathTarget>): FilterFunctions | undefined {
	const entitySet = ConverterContext.getEntitySet();
	if (TypeGuards.isEntitySet(entitySet)) {
		return (
			entitySet.annotations.Capabilities?.FilterFunctions ??
			ConverterContext.getEntityContainer().annotations.Capabilities?.FilterFunctions
		);
	}
	return undefined;
}
/**
 * Returns default format options for text fields in a table.
 * @param formatOptions
 * @returns Collection of format options with default values
 */
function _getDefaultFormatOptionsForTable(formatOptions: FormatOptionsType | undefined): FormatOptionsType | undefined {
	return formatOptions === undefined
		? undefined
		: {
				textLinesEdit: 4,
				...formatOptions
		  };
}
function _findSemanticKeyValues(semanticKeys: SemanticKey, name: string): { values: string[]; semanticKeyFound: boolean } {
	const aSemanticKeyValues: string[] = [];
	let bSemanticKeyFound = false;
	for (let i = 0; i < semanticKeys.length; i++) {
		aSemanticKeyValues.push(semanticKeys[i].value);
		if (semanticKeys[i].value === name) {
			bSemanticKeyFound = true;
		}
	}
	return {
		values: aSemanticKeyValues,
		semanticKeyFound: bSemanticKeyFound
	};
}
function _findProperties(
	semanticKeyValues: string[],
	fieldGroupProperties: string[]
): { semanticKeyHasPropertyInFieldGroup: boolean; fieldGroupPropertyPath?: string } {
	let semanticKeyHasPropertyInFieldGroup = false;
	let sPropertyPath;
	if (semanticKeyValues && semanticKeyValues.length >= 1 && fieldGroupProperties && fieldGroupProperties.length >= 1) {
		for (let i = 0; i < semanticKeyValues.length; i++) {
			if ([semanticKeyValues[i]].some((tmp) => fieldGroupProperties.includes(tmp))) {
				semanticKeyHasPropertyInFieldGroup = true;
				sPropertyPath = semanticKeyValues[i];
				break;
			}
		}
	}
	return {
		semanticKeyHasPropertyInFieldGroup: semanticKeyHasPropertyInFieldGroup,
		fieldGroupPropertyPath: sPropertyPath
	};
}
/**
 * Find the first property in the fieldGroup that is part of the semantic keys.
 * @param dataFieldGroup
 * @param semanticKeyValues
 * @returns An object containing a flag true if a property is found and a propertyPath.
 */
function _findSemanticKeyValuesInFieldGroup(
	dataFieldGroup: DataFieldAbstractTypes | null,
	semanticKeyValues: string[]
): { semanticKeyHasPropertyInFieldGroup: boolean; propertyPath?: string } {
	// this info is used in FieldHelper#isDraftIndicatorVisibleInFieldGroup to show a draft indicator at the end of a field group
	const aProperties: string[] = [];
	let _propertiesFound: { semanticKeyHasPropertyInFieldGroup: boolean; fieldGroupPropertyPath?: string } = {
		semanticKeyHasPropertyInFieldGroup: false,
		fieldGroupPropertyPath: undefined
	};
	if (
		dataFieldGroup &&
		dataFieldGroup.$Type === UIAnnotationTypes.DataFieldForAnnotation &&
		dataFieldGroup.Target?.$target?.$Type === UIAnnotationTypes.FieldGroupType
	) {
		dataFieldGroup.Target.$target.Data?.forEach((innerDataField: DataFieldAbstractTypes) => {
			if (
				(innerDataField.$Type === UIAnnotationTypes.DataField || innerDataField.$Type === UIAnnotationTypes.DataFieldWithUrl) &&
				innerDataField.Value
			) {
				aProperties.push(innerDataField.Value.path);
			}
			_propertiesFound = _findProperties(semanticKeyValues, aProperties);
		});
	}
	return {
		semanticKeyHasPropertyInFieldGroup: _propertiesFound.semanticKeyHasPropertyInFieldGroup,
		propertyPath: _propertiesFound.fieldGroupPropertyPath
	};
}
/**
 * Returns default format options with draftIndicator for a column.
 * @param name
 * @param semanticKeys
 * @param dataFieldGroup
 * @returns Collection of format options with default values
 */
function getDefaultDraftIndicatorForColumn(
	name: string,
	semanticKeys: SemanticKey,
	dataFieldGroup: DataFieldAbstractTypes | null
): Partial<{
	fieldGroupDraftIndicatorPropertyPath: string;
	fieldGroupName: string;
	showErrorObjectStatus: CompiledBindingToolkitExpression;
	hasDraftIndicator: boolean;
}> {
	if (!semanticKeys) {
		return {};
	}
	const semanticKey = _findSemanticKeyValues(semanticKeys, name);
	const semanticKeyInFieldGroup = _findSemanticKeyValuesInFieldGroup(dataFieldGroup, semanticKey.values);
	if (semanticKeyInFieldGroup.semanticKeyHasPropertyInFieldGroup) {
		// Semantic Key has a property in a FieldGroup
		return {
			//TODO we should rather store hasSemanticKeyInFieldGroup
			fieldGroupDraftIndicatorPropertyPath: semanticKeyInFieldGroup.propertyPath,
			fieldGroupName: name,
			showErrorObjectStatus: compileExpression(getRowStatusVisibility(name, true))
		};
	} else if (semanticKey.semanticKeyFound) {
		return {
			hasDraftIndicator: true,
			showErrorObjectStatus: compileExpression(getRowStatusVisibility(name, false))
		};
	}
	return {};
}
function _getImpNumber(dataField: DataFieldTypes): number {
	const importance = dataField?.annotations?.UI?.Importance as string;
	if (importance && importance.includes("UI.ImportanceType/High")) {
		return 3;
	}
	if (importance && importance.includes("UI.ImportanceType/Medium")) {
		return 2;
	}
	if (importance && importance.includes("UI.ImportanceType/Low")) {
		return 1;
	}
	return 0;
}
function _getDataFieldImportance(dataField: DataFieldTypes): Importance {
	const importance = dataField?.annotations?.UI?.Importance as string;
	return importance ? (importance.split("/")[1] as Importance) : Importance.None;
}
/**
 * Sets the export settings of a column containing datapoints.
 * @param property The property referenced on a given column
 * @param column The column to be updated
 */

function _setExportSettingsForDataPoint(property: Property, column: AnnotationTableColumn): void {
	const targetValuefromDP = getTargetValueOnDataPoint(property);
	if (
		isDataPointFromDataFieldDefault(property) &&
		typeof targetValuefromDP === "string" &&
		column.exportSettings &&
		column.exportSettings?.unit !== "%"
	) {
		column.exportDataPointTargetValue = targetValuefromDP;
		column.exportSettings.template = "{0}/" + targetValuefromDP;
	}
}

function _getMaxImportance(fields: DataFieldTypes[]): Importance {
	if (fields && fields.length > 0) {
		let maxImpNumber = -1;
		let impNumber = -1;
		let DataFieldWithMaxImportance;
		for (const field of fields) {
			impNumber = _getImpNumber(field);
			if (impNumber > maxImpNumber) {
				maxImpNumber = impNumber;
				DataFieldWithMaxImportance = field;
			}
		}
		return _getDataFieldImportance(DataFieldWithMaxImportance as DataFieldTypes);
	}
	return Importance.None;
}
/**
 * Returns the importance value for a column.
 * @param converterContext
 * @param dataField
 * @returns The importance value
 */
export function getImportance(
	converterContext: ConverterContext<PageContextPathTarget>,
	dataField: DataFieldAbstractTypes | undefined
): Importance | undefined {
	if (!dataField) {
		return undefined;
	}
	const semanticKeys = converterContext.getDataModelObjectPath().targetEntityType.annotations.Common?.SemanticKey ?? [];
	const requiredProperties = getRequiredProperties(converterContext);
	const highKeys = [...semanticKeys, ...requiredProperties].map((propertyPath) => propertyPath.$target?.fullyQualifiedName);
	//Evaluate default Importance is not set explicitly
	let fieldsWithImportance;
	if (isAnnotationOfType<DataFieldForAnnotation>(dataField, UIAnnotationTypes.DataFieldForAnnotation)) {
		const dataFieldTarget = dataField.Target.$target;
		if (isAnnotationOfType<FieldGroup>(dataFieldTarget, UIAnnotationTypes.FieldGroupType)) {
			const fieldGroupData = dataFieldTarget.Data;
			//If a FieldGroup contains a semanticKey or required property, importance set to High
			if (
				fieldGroupData.some(function (fieldGroupDataField: DataFieldAbstractTypes): boolean {
					return (
						isDataFieldTypes(fieldGroupDataField) && highKeys.includes(fieldGroupDataField.Value?.$target?.fullyQualifiedName)
					);
				})
			) {
				return Importance.High;
			} else {
				//If the DataFieldForAnnotation has an Importance we take it
				if (dataField?.annotations?.UI?.Importance) {
					return _getDataFieldImportance(dataField as unknown as DataFieldTypes);
				}
				// else the highest importance (if any) is returned
				fieldsWithImportance = fieldGroupData.filter(function (item) {
					return item?.annotations?.UI?.Importance;
				});
				return _getMaxImportance(fieldsWithImportance as DataFieldTypes[]);
			}
		}
	}
	return highKeys.includes((dataField as DataFieldTypes).Value?.$target?.fullyQualifiedName)
		? Importance.High
		: _getDataFieldImportance(dataField as unknown as DataFieldTypes);
}
/**
 * Returns line items from metadata annotations.
 * @param lineItemAnnotation Collection of data fields with their annotations
 * @param visualizationPath The visualization path
 * @param converterContext The converter context
 * @returns The columns from the annotations
 */
const getColumnsFromAnnotations = function (
	lineItemAnnotation: LineItem,
	visualizationPath: string,
	converterContext: ConverterContext<PageContextPathTarget>
): AnnotationTableColumn[] {
	const entityType: EntityType = converterContext.getAnnotationEntityType(lineItemAnnotation),
		annotationColumns: AnnotationTableColumn[] = [],
		columnsToBeCreated: Record<string, Property> = {},
		displayModeOfDescriptionPropertiesMap: Record<string, DisplayMode> = {},
		restrictionsOnProperties = getRestrictionsOnProperties(converterContext.getEntitySet()),
		tableManifestSettings: TableManifestConfiguration = converterContext.getManifestControlConfiguration(visualizationPath),
		tableType = getTableType(converterContext, tableManifestSettings),
		defaultCreationMode =
			converterContext.getManifestWrapper().getSapFeManifestConfiguration()?.macros?.table?.defaultCreationMode ===
			"InlineCreationRows"
				? CreationMode.InlineCreationRows
				: undefined,
		tableCreationMode: CreationMode =
			tableManifestSettings?.tableSettings?.creationMode?.name ?? defaultCreationMode ?? CreationMode.Inline;
	const semanticKeys: SemanticKey = converterContext.getAnnotationsByTerm("Common", CommonAnnotationTerms.SemanticKey, [
		converterContext.getEntityType()
	])[0] as SemanticKey;
	if (lineItemAnnotation) {
		const tableConverterContext = converterContext.getConverterContextFor<PageContextPathTarget>(
			getTargetObjectPath(converterContext.getDataModelObjectPath())
		);
		lineItemAnnotation.forEach((dataField) => {
			// TODO: variable name should be datafield and not lineItem
			if (!_isValidColumn(dataField)) {
				return;
			}
			let exportSettings: ColumnExportSettings | null = null;
			const semanticObjectAnnotationPath =
				isDataFieldTypes(dataField) && dataField.Value?.$target?.fullyQualifiedName
					? getSemanticObjectPath(converterContext, dataField)
					: undefined;
			const relativePath = _getRelativePath(dataField);
			// Determine properties which are consumed by this LineItem.
			const relatedPropertiesInfo: ComplexPropertyInfo = collectRelatedPropertiesRecursively(dataField, converterContext, tableType);
			const relatedPropertyNames: string[] = Object.keys(relatedPropertiesInfo.properties);
			const additionalPropertyNames: string[] = Object.keys(relatedPropertiesInfo.additionalProperties);
			const groupPath: string | undefined = relativePath ? _sliceAtSlash(relativePath, true, false) : undefined;
			const isGroup: boolean = groupPath != relativePath;
			const sLabel: string | undefined = getLabel(dataField, isGroup);
			const name = _getAnnotationColumnName(dataField);
			const isFieldGroupColumn: boolean = groupPath ? groupPath.includes(`@${UIAnnotationTerms.FieldGroup}`) : false;
			const showDataFieldsLabel: boolean | undefined = isFieldGroupColumn
				? _getShowDataFieldsLabel(name, visualizationPath, converterContext)
				: false;
			const dataType: string | undefined = getDataFieldDataType(dataField);
			const formatOptions = _getDefaultFormatOptionsForTable(getDefaultDraftIndicatorForColumn(name, semanticKeys, dataField));
			const propertyDataModelObjectPath = enhanceDataModelPath<DataFieldAbstractTypes>(
				converterContext.getDataModelObjectPath(),
				relativePath
			);
			// Determine if we need a situations indicator
			const navigationProperties: NavigationProperty[] = propertyDataModelObjectPath.targetEntityType.navigationProperties;
			const situationsNavProps = navigationProperties.filter(
				(navigationProperty) =>
					!navigationProperty.isCollection &&
					navigationProperty.targetType.annotations.Common?.SAPObjectNodeType?.Name === "BusinessSituation"
			);
			const situationsNavProp: NavigationProperty | undefined = situationsNavProps.length >= 1 ? situationsNavProps[0] : undefined;
			if (situationsNavProp && formatOptions) {
				formatOptions.hasSituationsIndicator = true;
			}

			let fieldGroupHiddenExpressions: CompiledBindingToolkitExpression;
			if (
				dataField.$Type === UIAnnotationTypes.DataFieldForAnnotation &&
				dataField.Target?.$target?.$Type === UIAnnotationTypes.FieldGroupType
			) {
				fieldGroupHiddenExpressions = _getFieldGroupHiddenExpressions(dataField);
			}
			const isMultiValue = _isColumnMultiValued(dataField, tableConverterContext);
			if (!isMultiValue && _isExportableColumn(dataField)) {
				//exclude the types listed above for the Export (generates error on Export as PDF)
				exportSettings = createColumnExportSettings(dataField, relatedPropertiesInfo);
			}
			let propertyTypeConfig: PropertyTypeConfig | undefined;
			if (dataType) {
				propertyTypeConfig = getTypeConfig(dataField, dataType);
			}
			const typeConfig: PropertyTypeConfig = {
				className: dataType as keyof typeof DefaultTypeForEdmType,
				formatOptions: {
					...formatOptions,
					...propertyTypeConfig?.formatOptions
				},
				constraints: { ...propertyTypeConfig?.constraints }
			};
			const visualSettings: VisualSettings = {};
			if (!dataType || !typeConfig) {
				// for charts
				visualSettings.widthCalculation = null;
			}
			const sortable =
				!isMultiValue &&
				_isColumnSortable(dataField, relativePath, restrictionsOnProperties.nonSortableProperties, relatedPropertiesInfo);
			const availability = isReferencePropertyStaticallyHidden(dataField) ? "Hidden" : "Default";
			const column: AnnotationTableColumn = {
				key: KeyHelper.generateKeyFromDataField(dataField),
				type: ColumnType.Annotation,
				label: sLabel,
				groupLabel: isGroup ? getLabel(dataField) : undefined,
				group: isGroup ? groupPath : undefined,
				FieldGroupHiddenExpressions: fieldGroupHiddenExpressions,
				annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
				semanticObjectPath: semanticObjectAnnotationPath,
				availability: availability,
				name: name,
				showDataFieldsLabel: showDataFieldsLabel,
				required: isRequiredColumn(converterContext, dataField as DataFieldTypes, tableCreationMode),
				relativePath: relativePath,
				sortable: sortable,
				propertyInfos: relatedPropertyNames.length ? relatedPropertyNames : undefined,
				additionalPropertyInfos: additionalPropertyNames.length > 0 ? additionalPropertyNames : undefined,
				exportSettings: exportSettings,
				width: (dataField.annotations?.HTML5?.CssDefaults?.width?.valueOf() as string) || undefined,
				importance: getImportance(converterContext, dataField as DataFieldTypes),
				isNavigable: true,
				formatOptions: formatOptions,
				caseSensitive: isFilteringCaseSensitive(converterContext),
				typeConfig: typeConfig,
				visualSettings: visualSettings,
				timezoneText: exportSettings?.timezone,
				isPartOfLineItem: true,
				isMultiValue
			};
			const tooltip = _getTooltip(dataField) ?? sLabel;
			if (tooltip) {
				column.tooltip = tooltip;
			}
			if (relatedPropertiesInfo.exportSettings.dataPointTargetValue) {
				column.exportDataPointTargetValue = relatedPropertiesInfo.exportSettings.dataPointTargetValue;
			}
			annotationColumns.push(column);
			// Collect information of related columns to be created.
			relatedPropertyNames.forEach((relatedPropertyName) => {
				columnsToBeCreated[relatedPropertyName] = relatedPropertiesInfo.properties[relatedPropertyName].annotationProperty;
				// In case of a multi-value, related properties cannot be sorted as we go through a 1-n relation
				if (isMultiValue) {
					restrictionsOnProperties.nonSortableProperties.push(relatedPropertyName);
				}
				addPropertyToDisplayModeOfDescriptionPropertiesMap(
					displayModeOfDescriptionPropertiesMap,
					relatedPropertiesInfo,
					relatedPropertyName
				);
				// In case the lineItem points to a navigation property with a textArrangement TextOnly, we need to create the column with the value navigation property.
				// The text property is referenced on the related properties of the lineItem, so will be created on the _createRelatedColumns method.
				if (relatedPropertiesInfo.properties[relatedPropertyName].displayModeOfPropertyUsedAsDescription === "Description") {
					createPropertyAnnotatedTextOnly(
						converterContext,
						propertyDataModelObjectPath,
						dataField,
						columnsToBeCreated,
						relativePath,
						restrictionsOnProperties
					);
				}
			});
			// Create columns for additional properties identified for ALP use case.
			additionalPropertyNames.forEach((additionalPropertyName) => {
				// Intentional overwrite as we require only one new PropertyInfo for a related Property.
				columnsToBeCreated[additionalPropertyName] = relatedPropertiesInfo.additionalProperties[additionalPropertyName];
			});
		});
	}
	// Get columns from the Properties of EntityType
	return getColumnsFromEntityType(
		columnsToBeCreated,
		entityType,
		annotationColumns,
		converterContext,
		tableType,
		tableCreationMode,
		displayModeOfDescriptionPropertiesMap,
		restrictionsOnProperties
	);
};
/**
 * Gets the property names from the manifest and checks against existing properties already added by annotations.
 * If a not yet stored property is found it adds it for sorting and filtering only to the annotationColumns.
 * @param properties
 * @param annotationColumns
 * @param converterContext
 * @param entityType
 * @returns The columns from the annotations
 */
const _getPropertyNames = function (
	properties: string[] | undefined,
	annotationColumns: AnnotationTableColumn[],
	converterContext: ConverterContext<PageContextPathTarget>,
	entityType: EntityType
): string[] | undefined {
	let matchedProperties: string[] | undefined;
	if (properties) {
		matchedProperties = properties.map(function (propertyPath) {
			const annotationColumn = annotationColumns.find(function (annotationColumn) {
				return annotationColumn.relativePath === propertyPath && annotationColumn.propertyInfos === undefined;
			});
			if (annotationColumn) {
				return annotationColumn.name;
			} else {
				const relatedColumns = _createRelatedColumns(
					{ [propertyPath]: entityType.resolvePath(propertyPath) },
					annotationColumns,
					converterContext,
					entityType,
					{}
				);
				annotationColumns.push(relatedColumns[0]);
				return relatedColumns[0].name;
			}
		});
	}
	return matchedProperties;
};

/**
 * Determines if the field group has to be flagged as required.
 * @param converterContext The converter context
 * @param fieldGroup The fieldGroup being processed
 * @param tableCreationMode The creation mode of the underlying table
 * @returns True if the fieldGroup is required.
 */
const isRequiredFieldGroup = function (
	converterContext: ConverterContext<PageContextPathTarget>,
	fieldGroup: FieldGroup,
	tableCreationMode: CreationMode
): boolean {
	const fieldGroupData = fieldGroup.Data;
	return fieldGroupData.some(function (item) {
		// we exclude boolean type, the end-user may want to keep the underlying check box empty on purpose
		if (isDataField(item) && item?.Value?.$target.type !== "Edm.Boolean") {
			return (
				isStaticallyMandatory(item) ||
				(tableCreationMode === CreationMode.InlineCreationRows &&
					isAnnotatedRequiredProperty(item.Value.$target.fullyQualifiedName, converterContext))
			);
		}
	});
};

/**
 * Determines if the dataFieldForAnnotation has to be flagged as required.
 * @param converterContext The converter context
 * @param dataFieldForAnnotation The property being processed
 * @param tableCreationMode The creation mode of the underlying table
 * @returns True if the property is required.
 */
const isRequiredDataFieldForAnnotation = function (
	converterContext: ConverterContext<PageContextPathTarget>,
	dataFieldForAnnotation: DataFieldForAnnotation,
	tableCreationMode: CreationMode
): boolean {
	const dataFieldTarget = dataFieldForAnnotation.Target.$target;
	const DataFieldForAnnotationFieldControlNotMandatory = hasFieldControlNotMandatory(dataFieldForAnnotation);
	// Check if the DataFieldForAnnotation points to a FieldGroup
	if (hasFieldGroupTarget(dataFieldForAnnotation)) {
		if (isRequiredFieldGroup(converterContext, dataFieldTarget as FieldGroup, tableCreationMode)) {
			return true;
		}
		const fieldGroupData = (dataFieldTarget as FieldGroup).Data;
		return fieldGroupData.some((innerDataField: DataFieldAbstractTypes) => {
			return isRequiredColumn(converterContext, innerDataField, tableCreationMode);
		});
	}
	/*If the underlying datapoint is a rating indicator, the end-user may want to keep the rating empty (value 0) on purpose.
	Besides, currently, only a fieldControl set on a dataFieldForAnnotation pointing to a dataPoint has an influence in the table.
	Accordingly, if a datapoint comes from a dataFieldForAnnotation with a fieldControl set as not mandatory, this dataPoint must not be flagged as "required"*/
	if (hasDataPointTarget(dataFieldForAnnotation) && (dataFieldTarget as DataPoint).Visualization !== "UI.VisualizationType/Rating") {
		if (DataFieldForAnnotationFieldControlNotMandatory) {
			return false;
		}
		if (isStaticallyMandatory(dataFieldForAnnotation)) {
			return true;
		}
		return isRequiredDataPoint(converterContext, dataFieldTarget as DataPoint, tableCreationMode);
	}
	return false;
};

/**
 * Determines if the property has to be flagged as required.
 * @param converterContext The converter context
 * @param property The property being processed
 * @param tableCreationMode The creation mode of the underlying table
 * @returns True if the property is required.
 */
const isRequiredProperty = function (
	converterContext: ConverterContext<PageContextPathTarget>,
	property: Property,
	tableCreationMode: CreationMode
): boolean {
	return (
		property.type !== "Edm.Boolean" &&
		!isRatingVisualizationFromDataFieldDefault(property) &&
		(isStaticallyMandatory(property) ||
			(tableCreationMode === CreationMode.InlineCreationRows &&
				isAnnotatedRequiredProperty(property.fullyQualifiedName, converterContext)))
	);
};

/**
 * Determines if the dataPoint has to be flagged as required.
 * @param converterContext The converter context
 * @param dataPoint The dataPoint being processed
 * @param tableCreationMode The creation mode of the underlying table
 * @returns True if the dataPoint is required.
 */
const isRequiredDataPoint = function (
	converterContext: ConverterContext<PageContextPathTarget>,
	dataPoint: DataPoint,
	tableCreationMode: CreationMode
): boolean {
	return (
		isStaticallyMandatory(dataPoint) ||
		(tableCreationMode === CreationMode.InlineCreationRows &&
			isAnnotatedRequiredProperty(dataPoint.Value.$target.fullyQualifiedName, converterContext))
	);
};

/**
 * Determines if the underlying column has to be flagged as required.
 * @param converterContext The converter context
 * @param target The target being processed
 * @param tableCreationMode The creation mode of the underlying table
 * @returns The binding expression for the 'required' property of the table column.
 */
const isRequiredColumn = function (
	converterContext: ConverterContext<PageContextPathTarget>,
	target: DataFieldAbstractTypes | Property,
	tableCreationMode?: CreationMode
): CompiledBindingToolkitExpression {
	const creationMode = tableCreationMode || CreationMode.Inline;
	if (
		converterContext.getTemplateType() === TemplateType.ListReport ||
		converterContext.getTemplateType() === TemplateType.AnalyticalListPage
	) {
		return undefined;
	}
	if (isProperty(target)) {
		return isRequiredProperty(converterContext, target, creationMode) ? compileExpression(UI.IsEditable) : undefined;
	}
	// Check if the dataField is of type DataFieldForAnnotation
	if (isDataFieldForAnnotation(target)) {
		return isRequiredDataFieldForAnnotation(converterContext, target, creationMode) ? compileExpression(UI.IsEditable) : undefined;
	}
	//If the underlying property is a boolean, the end-user may want to keep the check box empty on purpose
	if (isDataField(target) && target.Value?.$target?.type !== "Edm.Boolean") {
		return isStaticallyMandatory(target) ||
			(creationMode === CreationMode.InlineCreationRows &&
				isAnnotatedRequiredProperty(target.Value.$target.fullyQualifiedName, converterContext))
			? compileExpression(UI.IsEditable)
			: undefined;
	}
	return undefined;
};
const _appendCustomTemplate = function (properties: string[] | undefined, exportProperties: string[] | undefined): string | undefined {
	if (exportProperties?.length) {
		properties = exportProperties;
	}
	if (properties) {
		return properties
			.map((property) => {
				return `{${properties!.indexOf(property)}}`;
			})
			.join(`${"\n"}`);
	}
	return undefined;
};
/**
 * Returns table column definitions from manifest.
 *
 * These may be custom columns defined in the manifest, slot columns coming through
 * a building block, or annotation columns to overwrite annotation-based columns.
 * @param columns
 * @param annotationColumns
 * @param converterContext
 * @param entityType
 * @param navigationSettings
 * @returns The columns from the manifest
 */
const getColumnsFromManifest = function (
	columns: Record<string, CustomDefinedTableColumn | CustomDefinedTableColumnForOverride>,
	annotationColumns: AnnotationTableColumn[],
	converterContext: ConverterContext<PageContextPathTarget>,
	entityType: EntityType,
	navigationSettings?: NavigationSettingsConfiguration
): Record<string, ManifestColumn> {
	const internalColumns: Record<string, ManifestColumn> = {};
	function isAnnotationColumn(
		column: CustomDefinedTableColumn | CustomDefinedTableColumnForOverride,
		key: string
	): column is CustomDefinedTableColumnForOverride {
		return annotationColumns.some((annotationColumn) => annotationColumn.key === key);
	}
	function isSlotColumn(manifestColumn: CustomDefinedTableColumn): manifestColumn is FragmentDefinedSlotColumn {
		return manifestColumn.type === ColumnType.Slot;
	}
	function isCustomColumn(manifestColumn: CustomDefinedTableColumn): manifestColumn is ManifestDefinedCustomColumn {
		return manifestColumn.type === undefined && !!manifestColumn.template;
	}
	function _updateLinkedPropertiesOnCustomColumns(propertyInfos: string[], annotationTableColumns: AnnotationTableColumn[]): void {
		const restrictionsOnProperties = getRestrictionsOnProperties(converterContext.getEntitySet());
		propertyInfos.forEach((property) => {
			annotationTableColumns.forEach((prop) => {
				if (prop.name === property) {
					prop.sortable = !restrictionsOnProperties.nonSortableProperties.includes(property.replace("Property::", ""));
					prop.isGroupable = prop.sortable;
					prop.filterable = !restrictionsOnProperties.nonFilterableProperties.includes(property.replace("Property::", ""));
					prop.isPartOfCustomColumn = true;
				}
			});
		});
	}
	for (const key in columns) {
		const manifestColumn = columns[key];
		KeyHelper.validateKey(key);
		// BaseTableColumn
		const baseTableColumn = {
			key: key,
			widthIncludingColumnHeader: manifestColumn.widthIncludingColumnHeader,
			width: manifestColumn.width || undefined,
			position: {
				anchor: manifestColumn.position?.anchor,
				placement: manifestColumn.position === undefined ? Placement.After : manifestColumn.position.placement
			},
			caseSensitive: isFilteringCaseSensitive(converterContext)
		};
		if (isAnnotationColumn(manifestColumn, key)) {
			const propertiesToOverwriteAnnotationColumn: CustomElement<AnnotationTableColumnForOverride> = {
				...baseTableColumn,
				importance: manifestColumn?.importance,
				horizontalAlign: manifestColumn?.horizontalAlign,
				availability: manifestColumn?.availability,
				type: ColumnType.Annotation,
				isNavigable: isAnnotationColumn(manifestColumn, key)
					? undefined
					: isActionNavigable(manifestColumn, navigationSettings, true),
				settings: manifestColumn.settings,
				formatOptions: _getDefaultFormatOptionsForTable(manifestColumn.formatOptions),
				exportSettings: getCustomExportSettings(
					manifestColumn?.exportSettings,
					annotationColumns,
					converterContext,
					entityType,
					undefined,
					key
				)
			};
			internalColumns[key] = propertiesToOverwriteAnnotationColumn;
		} else {
			const propertyInfos: string[] | undefined = _getPropertyNames(
				manifestColumn.properties,
				annotationColumns,
				converterContext,
				entityType
			);
			const tooltipText = converterContext.fetchTextFromMetaModel(manifestColumn.tooltip),
				headerText = converterContext.fetchTextFromMetaModel(manifestColumn.header);

			const customColumnExportSettings: ColumnExportSettings | null = propertyInfos
				? getCustomExportSettings(manifestColumn?.exportSettings, annotationColumns, converterContext, entityType, propertyInfos)
				: null;
			const baseManifestColumn = {
				...baseTableColumn,
				header: headerText,
				importance: manifestColumn?.importance || Importance.None,
				horizontalAlign: manifestColumn?.horizontalAlign || HorizontalAlign.Begin,
				availability: manifestColumn?.availability || "Default",
				template: manifestColumn.template,
				propertyInfos: propertyInfos,
				exportSettings: customColumnExportSettings,
				id: `CustomColumn::${key}`,
				name: `CustomColumn::${key}`,
				//Needed for MDC:
				formatOptions: { textLinesEdit: 4 },
				isGroupable: false,
				isNavigable: false,
				sortable: false,
				visualSettings: { widthCalculation: null },
				tooltip: tooltipText ? tooltipText : headerText,
				properties: manifestColumn.properties,
				required:
					manifestColumn.required &&
					converterContext.getTemplateType() !== TemplateType.ListReport &&
					converterContext.getTemplateType() !== TemplateType.AnalyticalListPage
						? compileExpression(UI.IsEditable)
						: undefined
			};
			if (propertyInfos) {
				_updateLinkedPropertiesOnCustomColumns(propertyInfos, annotationColumns);
			}
			if (isSlotColumn(manifestColumn)) {
				const customTableColumn: CustomElement<CustomBasedTableColumn> = {
					...baseManifestColumn,
					type: ColumnType.Slot
				};
				internalColumns[key] = customTableColumn;
			} else if (isCustomColumn(manifestColumn)) {
				const customTableColumn: CustomElement<CustomBasedTableColumn> = {
					...baseManifestColumn,
					type: ColumnType.Default
				};
				internalColumns[key] = customTableColumn;
			} else {
				const message = `The annotation column '${key}' referenced in the manifest is not found`;
				converterContext
					.getDiagnostics()
					.addIssue(
						IssueCategory.Manifest,
						IssueSeverity.Low,
						message,
						IssueCategoryType,
						IssueCategoryType?.AnnotationColumns?.InvalidKey
					);
			}
		}
	}
	return internalColumns;
};

/**
 * Adds computed columns such as the draft status and situations status.
 * @param tableColumns The table columns collected so far
 * @param visualizationPath
 * @param converterContext
 * @returns The enriched set of table columns
 */
export function addComputedColumns(
	tableColumns: TableColumn[],
	visualizationPath: string,
	converterContext: ConverterContext<PageContextPathTarget>
): TableColumn[] {
	const tableManifestSettings: TableManifestConfiguration = converterContext.getManifestControlConfiguration(visualizationPath);
	const tableType = getTableType(converterContext, tableManifestSettings);

	if (!["GridTable", "TreeTable", "AnalyticalTable"].includes(tableType)) {
		// Computed columns are not used in Responsive tables
		return tableColumns;
	}

	// In case a grid table or tree table is used, we display the situations indicator in a separate column
	// so we have to disable it here to ensure, that the field building block
	// does not render it into the ID column
	const columnWithSituationsIndicator: TableColumn | undefined = tableColumns.find(
		(column) => column.formatOptions?.hasSituationsIndicator !== undefined && column.formatOptions?.hasSituationsIndicator === true
	);
	if (columnWithSituationsIndicator?.formatOptions) {
		// Switch off the situations indicator in the found column
		columnWithSituationsIndicator.formatOptions.hasSituationsIndicator = false;

		// Insert a separate situations indicator column
		const situationsIndicatorColumn: ComputedTableColumn = {
			key: "situationsIndicator",
			name: "situationsIndicator",
			propertyKey: columnWithSituationsIndicator.name,
			isSituationsIndicator: true,
			availability: "Default",
			label: "{sap.fe.i18n>C_SITUATIONS_STATUS_COLUMN_LABEL_TOOLTIP}",
			tooltip: "{sap.fe.i18n>C_SITUATIONS_STATUS_COLUMN_LABEL_TOOLTIP}",
			type: ColumnType.Computed,
			formatOptions: null,
			exportSettings: null,
			clipboardSettings: null,
			propertyInfos: undefined,
			caseSensitive: false
		};

		// Place the draft status column after the first visible column
		const indexOfFirstVisibleColumn: int = tableColumns.findIndex((column) => column.availability !== "Hidden");
		tableColumns.splice(indexOfFirstVisibleColumn + 1, 0, situationsIndicatorColumn);
	}

	// In case a grid table or tree table is used, we display the draft indicator in a separate column
	// so we have to disable it here to ensure, that the field building block
	// does not render it into the ID column
	// The additional column is only added for tables on a LR and in case tehe entity is draft enabled!
	const columnsWithDraftIndicator: TableColumn[] = tableColumns.filter((column) => column.formatOptions?.hasDraftIndicator === true);
	if (
		columnsWithDraftIndicator.length &&
		converterContext.getTemplateType() === TemplateType.ListReport &&
		(ModelHelper.isDraftNode(converterContext.getEntitySet()) || ModelHelper.isDraftRoot(converterContext.getEntitySet()))
	) {
		// Switch off the draft indicator in the found column
		columnsWithDraftIndicator.forEach((columnWithDraftIndicator: TableColumn) => {
			if (columnWithDraftIndicator?.formatOptions) {
				columnWithDraftIndicator.formatOptions.hasDraftIndicator = false;
			}
		});

		// Insert a separate draft indicator column
		const draftIndicatorColumn: ComputedTableColumn = {
			key: "draftStatus",
			name: "draftStatus",
			propertyKey: columnsWithDraftIndicator[0].name,
			isDraftIndicator: true,
			availability: "Default",
			label: "{sap.fe.i18n>C_DRAFT_STATUS_COLUMN_LABEL_TOOLTIP}",
			tooltip: "{sap.fe.i18n>C_DRAFT_STATUS_COLUMN_LABEL_TOOLTIP}",
			type: ColumnType.Computed,
			formatOptions: null,
			exportSettings: null,
			caseSensitive: false
		};
		let columnIndexToInsertAfter: int = 0;
		if (columnWithSituationsIndicator) {
			// If there's a situations indicator column, place the draft status column before it
			columnIndexToInsertAfter =
				tableColumns.findIndex((column) => (column as ComputedTableColumn).isSituationsIndicator === true) - 1;
		} else {
			// Otherwise place the draft status column after the first visible column
			columnIndexToInsertAfter = tableColumns.findIndex((column) => column.availability !== "Hidden");
		}
		tableColumns.splice(columnIndexToInsertAfter + 1, 0, draftIndicatorColumn);
	}

	return tableColumns;
}

export function getP13nMode(
	visualizationPath: string,
	converterContext: ConverterContext<PageContextPathTarget>,
	tableManifestConfiguration: TableControlConfiguration
): TableP13nMode[] | undefined {
	const manifestWrapper: ManifestWrapper = converterContext.getManifestWrapper();
	const tableManifestSettings: TableManifestConfiguration = converterContext.getManifestControlConfiguration(visualizationPath);
	const variantManagement: VariantManagementType = manifestWrapper.getVariantManagement();
	const modes: TableP13nMode[] = [];
	const isAnalyticalTable = tableManifestConfiguration.type === "AnalyticalTable";
	const isResponsiveTable = tableManifestConfiguration.type === "ResponsiveTable";
	if (tableManifestSettings?.tableSettings?.personalization !== undefined) {
		// Personalization configured in manifest.
		const personalization = tableManifestSettings.tableSettings.personalization;
		if (personalization === true) {
			// Table personalization fully enabled.
			switch (tableManifestConfiguration.type) {
				case "AnalyticalTable":
					return ["Sort", "Column", "Filter", "Group", "Aggregate"];
				case "ResponsiveTable":
					return ["Sort", "Column", "Filter", "Group"];
				default:
					return ["Sort", "Column", "Filter"];
			}
		} else if (typeof personalization === "object") {
			// Specific personalization options enabled in manifest. Use them as is.
			if (personalization.sort) {
				modes.push("Sort");
			}
			if (personalization.column) {
				modes.push("Column");
			}
			if (personalization.filter) {
				modes.push("Filter");
			}
			if (personalization.group && (isAnalyticalTable || isResponsiveTable)) {
				modes.push("Group");
			}
			if (personalization.aggregate && isAnalyticalTable) {
				modes.push("Aggregate");
			}
			return modes.length > 0 ? modes : undefined;
		}
	} else {
		// No personalization configured in manifest.
		modes.push("Sort");
		modes.push("Column");
		if (converterContext.getTemplateType() === TemplateType.ListReport) {
			if (variantManagement === VariantManagementType.Control || _isFilterBarHidden(manifestWrapper, converterContext)) {
				// Feature parity with V2.
				// Enable table filtering by default only in case of Control level variant management.
				// Or when the LR filter bar is hidden via manifest setting
				modes.push("Filter");
			}
		} else {
			modes.push("Filter");
		}
		if (isAnalyticalTable) {
			modes.push("Group");
			modes.push("Aggregate");
		}
		if (isResponsiveTable) {
			modes.push("Group");
		}
		return modes;
	}
}
/**
 * Returns a Boolean value suggesting if a filter bar is being used on the page.
 *
 * Chart has a dependency to filter bar (issue with loading data). Once resolved, the check for chart should be removed here.
 * Until then, hiding filter bar is now allowed if a chart is being used on LR.
 * @param manifestWrapper Manifest settings getter for the page
 * @param converterContext The instance of the converter context
 * @returns Boolean suggesting if a filter bar is being used on the page.
 */
function _isFilterBarHidden(manifestWrapper: ManifestWrapper, converterContext: ConverterContext<PageContextPathTarget>): boolean {
	return (
		manifestWrapper.isFilterBarHidden() &&
		!converterContext.getManifestWrapper().hasMultipleVisualizations() &&
		converterContext.getTemplateType() !== TemplateType.AnalyticalListPage
	);
}
/**
 * Returns a JSON string containing the sort conditions for the presentation variant.
 * @param converterContext The instance of the converter context
 * @param presentationVariantAnnotation Presentation variant annotation
 * @param columns Table columns processed by the converter
 * @returns Sort conditions for a presentation variant.
 */
function getSortConditions(
	converterContext: ConverterContext<PageContextPathTarget>,
	presentationVariantAnnotation: PresentationVariantType | undefined,
	columns: TableColumn[]
): TableSortConditions | undefined {
	// Currently navigation property is not supported as sorter
	const nonSortableProperties = getRestrictionsOnProperties(converterContext.getEntitySet()).nonSortableProperties;
	const sortConditions: TableSortConditions = {
		sorters: []
	};
	if (presentationVariantAnnotation?.SortOrder) {
		presentationVariantAnnotation.SortOrder.forEach((condition) => {
			const conditionProperty = condition.Property;
			if (conditionProperty?.$target !== undefined && !nonSortableProperties.includes(conditionProperty.$target.name)) {
				const infoName = convertPropertyPathsToInfoNames([conditionProperty], columns)[0];
				if (infoName) {
					sortConditions.sorters.push({
						name: infoName,
						descending: !!condition.Descending
					});
				}
			}
		});
	}
	return sortConditions.sorters.length ? sortConditions : undefined;
}
function getInitialExpansionLevel(presentationVariantAnnotation: PresentationVariantType | undefined): number | undefined {
	if (!presentationVariantAnnotation) {
		return undefined;
	}
	const level = presentationVariantAnnotation.InitialExpansionLevel?.valueOf();
	return typeof level === "number" ? level + 1 : undefined;
}
/**
 * Converts an array of propertyPath to an array of propertyInfo names.
 * @param paths The array to be converted
 * @param columns The array of propertyInfos
 * @returns An array of propertyInfo names
 */
function convertPropertyPathsToInfoNames(paths: PropertyPath[], columns: TableColumn[]): string[] {
	const infoNames: string[] = [];
	let propertyInfo: TableColumn | undefined, annotationColumn: AnnotationTableColumn;
	paths.forEach((currentPath) => {
		if (currentPath?.value) {
			propertyInfo = columns.find((column) => {
				annotationColumn = column as AnnotationTableColumn;
				return !annotationColumn.propertyInfos && annotationColumn.relativePath === currentPath?.value;
			});
			if (propertyInfo) {
				infoNames.push(propertyInfo.name);
			}
		}
	});
	return infoNames;
}
/**
 * Returns a JSON string containing Presentation Variant group conditions.
 * @param presentationVariantAnnotation Presentation variant annotation
 * @param columns Converter processed table columns
 * @param tableType The table type.
 * @returns Group conditions for a Presentation variant.
 */
function getGroupConditions(
	presentationVariantAnnotation: PresentationVariantType | undefined,
	columns: TableColumn[],
	tableType: string
): TableGroupConditions | undefined {
	const groupConditions: TableGroupConditions = {
		groupLevels: []
	};
	if (presentationVariantAnnotation?.GroupBy) {
		let aGroupBy = presentationVariantAnnotation.GroupBy;
		if (tableType === "ResponsiveTable") {
			aGroupBy = aGroupBy.slice(0, 1);
		}
		groupConditions.groupLevels = convertPropertyPathsToInfoNames(aGroupBy, columns).map((infoName) => {
			return { name: infoName };
		});
	}
	return groupConditions.groupLevels.length ? groupConditions : undefined;
}
/**
 * Updates the column's propertyInfos of a analytical table integrating all extensions and binding-relevant property info part.
 * @param tableVisualization The visualization to be updated
 */
function _updatePropertyInfosWithAggregatesDefinitions(tableVisualization: TableVisualization): void {
	const relatedAdditionalPropertyNameMap: Record<string, string> = {};
	tableVisualization.columns.forEach((column) => {
		column = column as AnnotationTableColumn;
		const aggregatablePropertyName = Object.keys(tableVisualization.analyticsExtensions!).find(
			(aggregate) => aggregate === column.name
		);
		if (aggregatablePropertyName) {
			const aggregatablePropertyDefinition = tableVisualization.analyticsExtensions![aggregatablePropertyName];
			column.aggregatable = !aggregatablePropertyDefinition.fromGroupableProperty;
			column.extension = aggregatablePropertyDefinition ?? {};
		}
		if (column.additionalPropertyInfos?.length) {
			column.additionalPropertyInfos.forEach((additionalPropertyInfo) => {
				// Create propertyInfo for each additional property.
				// The new property 'name' has been prefixed with 'Property_Technical::' for uniqueness and it has been named technical property as it requires dedicated MDC attributes (technicallyGroupable and technicallyAggregatable).
				createTechnicalProperty(additionalPropertyInfo, tableVisualization.columns, relatedAdditionalPropertyNameMap);
			});
		}
	});
	tableVisualization.columns.forEach((column) => {
		column = column as AnnotationTableColumn;
		if (column.additionalPropertyInfos) {
			column.additionalPropertyInfos = column.additionalPropertyInfos.map(
				(propertyInfo) => relatedAdditionalPropertyNameMap[propertyInfo] ?? propertyInfo
			);
			// Add additional properties to the complex property using the hidden annotation.
			column.propertyInfos = column.propertyInfos?.concat(column.additionalPropertyInfos);
		}
	});
}
/**
 * Provides the required properties set on the annotations.
 * @param converterContext  The instance of the converter context
 * @returns The paths of the restricted properties
 */
function getRequiredProperties(converterContext: ConverterContext<PageContextPathTarget>): PropertyPath[] {
	return getContextPropertyRestriction(
		converterContext.getDataModelObjectPath(),
		(capabilities) => {
			return (capabilities as EntitySetAnnotations_Capabilities | undefined)?.InsertRestrictions?.RequiredProperties;
		},
		false
	);
}
/**
 * Determines if the property is annotated as a required property.
 * @param name The name of the property
 * @param converterContext The instance of the converter context
 * @returns True if the property is required
 */
function isAnnotatedRequiredProperty(name: string, converterContext: ConverterContext<PageContextPathTarget>): boolean {
	return getRequiredProperties(converterContext)
		.map((property) => property.$target?.fullyQualifiedName)
		.includes(name);
}
/**
 * Returns a JSON string containing Presentation Variant aggregate conditions.
 * @param presentationVariantAnnotation Presentation variant annotation
 * @param columns Converter processed table columns
 * @param extensionInfoMap
 * @returns Group conditions for a Presentation variant.
 */
function getAggregateConditions(
	presentationVariantAnnotation: PresentationVariantType | undefined,
	columns: TableColumn[],
	extensionInfoMap: Record<string, InternalExtensionForAnalytics>
): TableAggregateConditions | undefined {
	const aggregateConditions: TableAggregateConditions = {};
	if (presentationVariantAnnotation?.Total) {
		const aTotals = presentationVariantAnnotation.Total;
		convertPropertyPathsToInfoNames(aTotals, columns).forEach((infoName) => {
			aggregateConditions[infoName] = {};
		});
	} else {
		for (const key in extensionInfoMap) {
			if (!extensionInfoMap[key].fromGroupableProperty) {
				aggregateConditions[key] = {};
			}
		}
	}
	return Object.keys(aggregateConditions).length ? aggregateConditions : undefined;
}
export type StandardActionsConfiguration = {
	creationBehaviour: TableAnnotationConfiguration["create"];
	cutButtonVisibilityExpression: BindingToolkitExpression<boolean>;
	deleteButtonVisibilityExpression: BindingToolkitExpression<boolean>;
	massEditButtonVisibilityExpression: BindingToolkitExpression<boolean>;
	isInsertUpdateActionsTemplated: boolean;
	standardActions: {
		create: StandardAction;
		delete: StandardAction;
		paste: StandardAction;
		massEdit: StandardAction;
		insights: StandardAction;
		creationRow: StandardAction;
		cut: StandardAction;
		moveUp?: StandardAction;
		moveDown?: StandardAction;
	};
};
/**
 * Calculates the standard actions and adjacent properties that are needed in the further conversion process.
 * @param lineItemAnnotation Collection of data fields used for representation in a table or list
 * @param visualizationPath The visualization path
 * @param converterContext The instance of the converter context
 * @param tableManifestConfiguration The table manifest configuration
 * @param navigationSettings The navigation target manifest configuration
 * @returns Standard actions and connected properties
 */
export function getStandardActionsConfiguration(
	lineItemAnnotation: LineItem | undefined,
	visualizationPath: string,
	converterContext: ConverterContext<PageContextPathTarget>,
	tableManifestConfiguration: TableControlConfiguration,
	navigationSettings: NavigationSettingsConfiguration
): StandardActionsConfiguration {
	const creationBehaviour = _getCreationBehaviour(
		lineItemAnnotation,
		tableManifestConfiguration,
		converterContext,
		navigationSettings,
		visualizationPath
	);
	const standardActionsContext = generateStandardActionsContext(
		converterContext,
		creationBehaviour.mode as CreationMode,
		tableManifestConfiguration
	);
	const cutButtonVisibilityExpression = getCutVisibility(converterContext, standardActionsContext);
	const deleteButtonVisibilityExpression = getDeleteVisibility(converterContext, standardActionsContext);
	const massEditButtonVisibilityExpression = getMassEditVisibility(converterContext, standardActionsContext);
	const isInsertUpdateActionsTemplated = getInsertUpdateActionsTemplating(
		standardActionsContext,
		isDraftOrStickySupported(converterContext)
	);
	const standardActions = {
		cut: getStandardActionCut(converterContext, standardActionsContext),
		create: getStandardActionCreate(converterContext, standardActionsContext),
		delete: getStandardActionDelete(converterContext, standardActionsContext),
		paste: getStandardActionPaste(converterContext, standardActionsContext, isInsertUpdateActionsTemplated),
		massEdit: getStandardActionMassEdit(converterContext, standardActionsContext),
		insights: getStandardActionInsights(converterContext, standardActionsContext, visualizationPath),
		creationRow: getCreationRow(converterContext, standardActionsContext)
	};
	const configuration: StandardActionsConfiguration = {
		creationBehaviour,
		cutButtonVisibilityExpression,
		deleteButtonVisibilityExpression,
		massEditButtonVisibilityExpression,
		isInsertUpdateActionsTemplated,
		standardActions
	};

	if (standardActionsContext.tableManifestConfiguration.type === "TreeTable") {
		configuration.standardActions.moveUp = getStandardActionMoveUpDown(converterContext, standardActionsContext, true);
		configuration.standardActions.moveDown = getStandardActionMoveUpDown(converterContext, standardActionsContext, false);
	}

	return configuration;
}
export function getTableAnnotationConfiguration(
	lineItemAnnotation: LineItem | undefined,
	visualizationPath: string,
	converterContext: ConverterContext<PageContextPathTarget>,
	tableManifestConfiguration: TableControlConfiguration,
	columns: TableColumn[],
	navigationSettings: NavigationSettingsConfiguration,
	standardActionsConfiguration: StandardActionsConfiguration,
	presentationVariantAnnotation?: PresentationVariantType
): TableAnnotationConfiguration {
	// Need to get the target
	const { navigationPropertyPath } = splitPath(visualizationPath);
	const typeNamePlural = converterContext.getDataModelObjectPath().targetEntityType.annotations?.UI?.HeaderInfo?.TypeNamePlural;
	const title = typeNamePlural && compileExpression(getExpressionFromAnnotation(typeNamePlural));
	const entitySet = converterContext.getDataModelObjectPath().targetEntitySet;
	const pageManifestSettings: ManifestWrapper = converterContext.getManifestWrapper();
	const hasAbsolutePath = navigationPropertyPath.length === 0;
	const p13nMode = getP13nMode(visualizationPath, converterContext, tableManifestConfiguration);
	const id = navigationPropertyPath ? getTableID(visualizationPath) : getTableID(converterContext.getContextPath(), "LineItem");
	const targetCapabilities = getCapabilityRestriction(converterContext);
	const navigationTargetPath = getNavigationTargetPath(converterContext, navigationPropertyPath);
	const selectionMode = getSelectionMode(
		lineItemAnnotation,
		visualizationPath,
		converterContext,
		hasAbsolutePath,
		targetCapabilities,
		standardActionsConfiguration.deleteButtonVisibilityExpression,
		standardActionsConfiguration.massEditButtonVisibilityExpression,
		standardActionsConfiguration.cutButtonVisibilityExpression
	);
	let threshold = navigationPropertyPath ? 10 : 30;
	if (presentationVariantAnnotation?.MaxItems) {
		threshold = presentationVariantAnnotation.MaxItems.valueOf();
	} else if (tableManifestConfiguration.type === "TreeTable") {
		// To make scrolling smooth, we set the threshold value higher for tree tables
		threshold = 200;
	} else if (tableManifestConfiguration.type === "GridTable" || tableManifestConfiguration.type === "AnalyticalTable") {
		threshold = 100;
	}
	const variantManagement: VariantManagementType = pageManifestSettings.getVariantManagement();
	const isSearchable = isPathSearchable(converterContext.getDataModelObjectPath());
	return {
		id: id,
		apiId: generate([id, "Table"]),
		entityName: entitySet ? entitySet.name : "",
		entityTypeName: entitySet && entitySet.entityType ? entitySet.entityType.name : "",
		collection: getTargetObjectPath(converterContext.getDataModelObjectPath()),
		navigationPath: navigationPropertyPath,
		row: _getRowConfigurationProperty(
			lineItemAnnotation,
			converterContext,
			navigationSettings,
			navigationTargetPath,
			tableManifestConfiguration.type
		),
		p13nMode,
		isInsertUpdateActionsTemplated: standardActionsConfiguration.isInsertUpdateActionsTemplated,
		updatablePropertyPath: getCurrentEntitySetUpdatablePath(converterContext),
		displayMode: isInDisplayMode(converterContext, true),
		create: standardActionsConfiguration.creationBehaviour,
		selectionMode: selectionMode,
		variantManagement: variantManagement === "Control" && !p13nMode ? VariantManagementType.None : variantManagement,
		threshold: threshold,
		sortConditions: getSortConditions(converterContext, presentationVariantAnnotation, columns),
		title: title,
		searchable: tableManifestConfiguration.type !== "AnalyticalTable" && !(isConstant(isSearchable) && isSearchable.value === false),
		initialExpansionLevel: getInitialExpansionLevel(presentationVariantAnnotation),
		requiredProperties: getRequiredProperties(converterContext)
			.filter((property) => property?.$target?.type !== "Edm.Boolean")
			.map((property) => property.value)
	};
}
/**
 * Gets the data type of a column for the export.
 * @param dataType The data type of a property, column
 * @param isATimezone Is the given property a timezone
 * @param isCurrency Is the given property a currency
 * @param exportSettings The already detected export settings from datafields
 * @returns The supported export type
 */
function getExportDataType(
	dataType: string | undefined,
	isATimezone = false,
	isCurrency = false,
	exportSettings?: ColumnExportSettings
): string {
	let exportDataType = "String";
	if (!dataType || exportSettings?.dataPointTargetValue) {
		return exportDataType;
	}
	if (exportSettings?.isCurrency || isCurrency) {
		return "Currency";
	}
	if (isATimezone) {
		return "Timezone";
	}
	if (exportSettings?.wrap) {
		return exportDataType;
	}
	switch (dataType) {
		case "Edm.Decimal":
		case "Edm.Int32":
		case "Edm.Int64":
		case "Edm.Double":
		case "Edm.Byte":
			exportDataType = "Number";
			break;
		case "Edm.DateOfTime":
		case "Edm.Date":
			exportDataType = "Date";
			break;
		case "Edm.DateTimeOffset":
			exportDataType = "DateTime";
			break;
		case "Edm.TimeOfDay":
			exportDataType = "Time";
			break;
		case "Edm.Boolean":
			exportDataType = "Boolean";
			break;
		default:
			exportDataType = "String";
	}
	return exportDataType;
}
/**
 * Splits the visualization path into navigation property path and annotation.
 * @param visualizationPath
 * @returns The split path
 */
export function splitPath(visualizationPath: string): { navigationPropertyPath: string; annotationPath: string } {
	const [targetNavigationPropertyPath, annotationPath] = visualizationPath.split("@");
	let navigationPropertyPath = targetNavigationPropertyPath;
	if (navigationPropertyPath.lastIndexOf("/") === navigationPropertyPath.length - 1) {
		// Drop trailing slash
		navigationPropertyPath = navigationPropertyPath.substring(0, navigationPropertyPath.length - 1);
	}
	return { navigationPropertyPath, annotationPath };
}
export function getSelectionVariantConfiguration(
	selectionVariantPath: string,
	converterContext: ConverterContext<PageContextPathTarget>
): SelectionVariantConfiguration | undefined {
	const resolvedTarget = converterContext.getEntityTypeAnnotation(selectionVariantPath);
	const selection: SelectionVariant = resolvedTarget.annotation as SelectionVariant;
	if (selection) {
		const propertyNames: string[] = [];
		selection.SelectOptions?.forEach((selectOption: SelectOptionType) => {
			const propertyName = selectOption.PropertyName;
			const propertyPath: string = propertyName?.value ?? "";
			if (!propertyNames.includes(propertyPath)) {
				propertyNames.push(propertyPath);
			}
		});
		return {
			text: selection?.Text?.toString(),
			propertyNames: propertyNames
		};
	}
	return undefined;
}
function _getFullScreenBasedOnDevice(
	tableSettings: TableManifestSettingsConfiguration,
	converterContext: ConverterContext<PageContextPathTarget>,
	isIphone: boolean
): boolean {
	// If enableFullScreen is not set, use as default true on phone and false otherwise
	let enableFullScreen = tableSettings.enableFullScreen ?? isIphone;
	// Make sure that enableFullScreen is not set on ListReport for desktop or tablet
	if (!isIphone && enableFullScreen && converterContext.getTemplateType() === TemplateType.ListReport) {
		enableFullScreen = false;
		converterContext.getDiagnostics().addIssue(IssueCategory.Manifest, IssueSeverity.Low, IssueType.FULLSCREENMODE_NOT_ON_LISTREPORT);
	}
	return enableFullScreen;
}
function _getMultiSelectMode(
	tableSettings: TableManifestSettingsConfiguration,
	tableType: TableType,
	converterContext: ConverterContext<PageContextPathTarget>
): string | undefined {
	let multiSelectMode: string | undefined;
	if (tableType !== "ResponsiveTable") {
		return undefined;
	}
	switch (converterContext.getTemplateType()) {
		case TemplateType.ListReport:
		case TemplateType.ObjectPage:
			multiSelectMode = tableSettings.selectAll === false ? "ClearAll" : "Default";
			if (converterContext.getTemplateType() === TemplateType.ObjectPage && converterContext.getManifestWrapper().useIconTabBar()) {
				multiSelectMode = !tableSettings.selectAll ? "ClearAll" : "Default";
			}
			break;
		case TemplateType.AnalyticalListPage:
			multiSelectMode = !tableSettings.selectAll ? "ClearAll" : "Default";
			break;
		default:
	}
	return multiSelectMode;
}
function _getTableMode(
	tableType: TableType,
	tableSettings: TableManifestSettingsConfiguration,
	isTemplateListReport: boolean
): { rowCountMode?: TableRowCountMode; rowCount?: number } {
	if (tableType !== "ResponsiveTable") {
		if (isTemplateListReport) {
			return {
				rowCountMode: "Auto",
				rowCount: 3
			};
		} else {
			return {
				rowCountMode: tableSettings.rowCountMode ?? "Fixed",
				rowCount: tableSettings.rowCount ?? (tableType === "GridTable" ? 5 : 10)
			};
		}
	} else {
		return {};
	}
}
function _getCondensedTableLayout(_tableType: TableType, _tableSettings: TableManifestSettingsConfiguration): boolean {
	return _tableSettings.condensedTableLayout !== undefined && _tableType !== "ResponsiveTable"
		? _tableSettings.condensedTableLayout
		: false;
}
function _getTableSelectionLimit(_tableSettings: TableManifestSettingsConfiguration): number {
	return _tableSettings.selectAll === true || _tableSettings.selectionLimit === 0 ? 0 : _tableSettings.selectionLimit || 200;
}
function _getTableInlineCreationRowCount(_tableSettings: TableManifestSettingsConfiguration): number {
	return _tableSettings.creationMode?.inlineCreationRowCount ? _tableSettings.creationMode?.inlineCreationRowCount : 1;
}

function _getEnableExport(
	tableSettings: TableManifestSettingsConfiguration,
	converterContext: ConverterContext<PageContextPathTarget>,
	enablePaste: boolean
): boolean {
	return tableSettings.enableExport !== undefined
		? tableSettings.enableExport
		: converterContext.getTemplateType() !== "ObjectPage" || enablePaste;
}
function _getFrozenColumnCount(tableSettings: TableManifestSettingsConfiguration): number | undefined {
	return tableSettings.frozenColumnCount;
}

/**
 * Get the widthIncludingColumnHeader value from the tableSettings if it exists.
 * @param tableSettings TableSettings Object
 * @returns Returns the value of widthIncludingColumnHeader or false
 */
function _getWidthIncludingColumnHeader(tableSettings: TableManifestSettingsConfiguration): boolean {
	return tableSettings.widthIncludingColumnHeader ?? false;
}

function getFilterConfiguration(
	tableSettings: TableManifestSettingsConfiguration,
	lineItemAnnotation: LineItem,
	converterContext: ConverterContext<PageContextPathTarget>,
	selectionVariantAnnotation: SelectionVariantType | undefined
): {
	filters: Partial<Record<"quickFilters" | "hiddenFilters", TableFiltersConfiguration>>;
	headerVisible: boolean;
} {
	let hideTableTitle = false;
	const filters: Partial<Record<"quickFilters" | "hiddenFilters", TableFiltersConfiguration>> = {};
	const targetEntityType = converterContext.getAnnotationEntityType(lineItemAnnotation);
	if (tableSettings.quickVariantSelection) {
		const quickFilterPaths = (tableSettings.quickVariantSelection.paths ?? []).reduce(
			(filterPaths: { annotationPath: string }[], path) => {
				if (targetEntityType.resolvePath(path.annotationPath)) {
					filterPaths.push({ annotationPath: path.annotationPath });
				}
				return filterPaths;
			},
			[]
		);
		if (quickFilterPaths.length) {
			filters.quickFilters = {
				showCounts: tableSettings.quickVariantSelection.showCounts,
				paths: quickFilterPaths
			};
		}
	}
	if (selectionVariantAnnotation) {
		/**
		 * Provide Selection Variant to hiddenFilters in order to set the SV filters to the table.
		 * MDC Table overrides binding Filter and from SAP FE the only method where we are able to add
		 * additional filter is 'rebindTable' into Table delegate.
		 * To avoid implementing specific LR feature to SAP FE Macro Table, the filter(s)  not managed by the FilterBar
		 * can be passed to macro table via parameter/context named filters and key hiddenFilters.
		 */
		filters.hiddenFilters = { paths: [{ annotationPath: `@${selectionVariantAnnotation.fullyQualifiedName.split("@")[1]}` }] };
	}

	hideTableTitle = !!tableSettings.quickVariantSelection?.hideTableTitle;
	return {
		filters: filters,
		headerVisible: !(filters?.quickFilters && hideTableTitle)
	};
}
/**
 * Adds the tooltip configuration for a given column.
 * @param property The property referenced on the column
 * @param column The column to be updated
 */
function _addToolTip(property: Property, column: AnnotationTableColumn): void {
	const tooltip = _getTooltip(property) ?? column.label;
	if (tooltip) {
		column.tooltip = tooltip;
	}
}
function _getCollectedNavigationPropertyLabels(
	relativePath: string,
	converterContext: ConverterContext<PageContextPathTarget>
): string[] | undefined {
	const navigationProperties = enhanceDataModelPath(converterContext.getDataModelObjectPath(), relativePath).navigationProperties;
	if (navigationProperties?.length > 0) {
		const collectedNavigationPropertyLabels: string[] = [];
		navigationProperties.forEach((navProperty) => {
			collectedNavigationPropertyLabels.push(getLabel(navProperty) || navProperty.name);
		});
		return collectedNavigationPropertyLabels;
	}
}
/**
 * Determines if the action will have an expression for enablement generated.
 * @param dataField The dataField containing an action
 * @param sEntityType The current entity for templating
 * @returns Whether an expression for enablement is to be generated
 */
function _useEnabledExpression(dataField: DataFieldForActionTypes, sEntityType: string): boolean {
	// There are three cases when a table action has an OperationAvailable that leads to an enablement expression
	// and is not dependent upon the table entries.
	// 1. An action with an overload, that is executed against a parent entity.
	// 2. An unbound action
	// 3. A static action (that is, bound to a collection)
	let useEnabledExpression = false;
	if (dataField.ActionTarget?.annotations?.Core?.OperationAvailable !== undefined) {
		// Unbound action. Is recognised, but getExpressionFromAnnotation checks for isBound = true, so not generated.
		const isBound = dataField.ActionTarget?.isBound;
		//overload action
		const overloadAction = isBound && dataField.ActionTarget?.sourceType !== sEntityType;
		//static action
		const staticAction = dataField.ActionTarget?.parameters[0]?.isCollection;
		//copy action
		if (!isBound || overloadAction || staticAction) {
			useEnabledExpression = true;
		}
	}
	return useEnabledExpression;
}

/**
 * Updates the table control configuration with Tree-Table specific information.
 * @param tableConfiguration The table configuration
 * @param tableSettings Settings from the manifest
 * @param converterContext The instance of the converter context
 */
function updateTreeTableManifestConfiguration(
	tableConfiguration: TableControlConfiguration,
	tableSettings: TableManifestSettingsConfiguration,
	converterContext: ConverterContext
): void {
	const dataModelObjectPath = converterContext.getDataModelObjectPath();
	tableConfiguration.hierarchyQualifier = tableSettings.hierarchyQualifier;
	const hierarchyParentNavigationPropertyPath = getHierarchyParentNavigationPropertyPath(
		dataModelObjectPath,
		tableConfiguration.hierarchyQualifier!
	);
	const nonUpdatableNavigationProperties = getNonUpdatableNavigationProperties(dataModelObjectPath);
	tableConfiguration.isHierarchyParentNodeUpdatable = !nonUpdatableNavigationProperties?.includes(hierarchyParentNavigationPropertyPath);
	tableConfiguration.isNodeMovable = getCustomFunctionInfo(tableSettings.isNodeMovable, tableConfiguration);
	tableConfiguration.isMoveToPositionAllowed = getCustomFunctionInfo(tableSettings.isMoveToPositionAllowed, tableConfiguration);
	tableConfiguration.createEnablement = getCustomFunctionInfo(tableSettings.creationMode?.isCreateEnabled, tableConfiguration);

	if (tableSettings.creationMode?.nodeType?.propertyName && tableSettings.creationMode?.nodeType?.values) {
		const values = tableSettings.creationMode.nodeType.values;
		tableConfiguration.nodeType = {
			propertyName: tableSettings.creationMode.nodeType.propertyName,
			values: Object.keys(values).map((value) => {
				const nodeTypeInfo = values[value];

				if (typeof nodeTypeInfo === "string") {
					return {
						value,
						text: nodeTypeInfo
					};
				} else {
					return {
						value,
						text: nodeTypeInfo.label,
						creationDialogFields:
							tableConfiguration.creationMode === CreationMode.CreationDialog
								? getFieldList(nodeTypeInfo.creationFields, converterContext)
								: undefined
					};
				}
			})
		};
	}

	// Create in place
	if (tableSettings.creationMode?.createInPlace) {
		tableConfiguration.createInPlace = true;
	}
}

export function getCustomFunctionInfo(
	value: string | undefined,
	tableConfiguration: TableControlConfiguration
): ExternalMethodConfig | undefined {
	if (!value) {
		return undefined;
	}
	const lastDotIndex = value.lastIndexOf(".") || -1;
	const moduleName = value.substring(0, lastDotIndex).replace(/\./gi, "/");
	const methodName = value.substring(lastDotIndex + 1);

	// Add the custom module in the list of required modules if necessary
	if (!moduleName.startsWith("/extension/")) {
		if (!tableConfiguration.additionalRequiredModules) {
			tableConfiguration.additionalRequiredModules = [moduleName];
		} else if (!tableConfiguration.additionalRequiredModules.includes(moduleName)) {
			tableConfiguration.additionalRequiredModules.push(moduleName);
		}
	}

	return { moduleName, methodName };
}

/**
 * Retrieve the table control configuration optimistic batch information.
 * @param tableManifestSettings The table configuration
 @returns True if Optimistic batch mode is disabled
 */
function getOptimisticBatchSettingsFromManifest(tableManifestSettings: TableManifestConfiguration): boolean {
	// Optimistic batch is set by default
	return tableManifestSettings?.tableSettings?.disableRequestCache || false;
}

/**
 * Gets the settings coming from the manifest related to the mass edit dialog.
 * @param tableSettings The table configuration
 * @param converterContext The instance of the converter context
 * @returns The mass edit configuration.
 */
export function getMassEditSettings(
	tableSettings: TableManifestSettingsConfiguration,
	converterContext: ConverterContext<PageContextPathTarget>
): MassEditTableConfiguration {
	const defaultFieldConfiguration = {
		visibleFields: [],
		ignoredFields: [],
		operationGroupingMode:
			converterContext.getTemplateType() === TemplateType.ListReport
				? OperationGroupingMode.Isolated
				: OperationGroupingMode.ChangeSet
	};
	if (!tableSettings.enableMassEdit) {
		return { enabled: false, ...defaultFieldConfiguration };
	}
	if (tableSettings.enableMassEdit === true) {
		return { enabled: tableSettings.enableMassEdit, ...defaultFieldConfiguration };
	} else if (typeof tableSettings.enableMassEdit === "object") {
		return {
			enabled: true,
			visibleFields: getFieldList(tableSettings.enableMassEdit.visibleFields, converterContext),
			ignoredFields: getFieldList(tableSettings.enableMassEdit.ignoredFields, converterContext),
			operationGroupingMode:
				tableSettings.enableMassEdit.operationGroupingMode &&
				Object.values(OperationGroupingMode).includes(tableSettings.enableMassEdit.operationGroupingMode)
					? tableSettings.enableMassEdit.operationGroupingMode
					: defaultFieldConfiguration.operationGroupingMode,
			customFragment: tableSettings.enableMassEdit.customFragment
		};
	}
	return { enabled: false, ...defaultFieldConfiguration };
}

/**
 * Gets a list of the fields coming from the manifest.
 * @param fields The fields, could be a FieldGroup or fields separated by a comma
 * @param converterContext The instance of the converter context
 * @returns The list of fields.
 */
function getFieldList(fields: string | undefined, converterContext: ConverterContext<PageContextPathTarget>): string[] {
	if (!fields) {
		return [];
	}
	if (fields.startsWith(UIAnnotationTerms.FieldGroup)) {
		const fieldGroup = converterContext.getEntityTypeAnnotation<FieldGroup>(`@${fields}`);
		if (isAnnotationOfType<FieldGroup>(fieldGroup.annotation, UIAnnotationTypes.FieldGroupType)) {
			return fieldGroup.annotation.Data.reduce((properties: string[], field) => {
				if (isDataField(field) && isPathAnnotationExpression(field.Value)) {
					properties.push(field.Value.path);
				}
				return properties;
			}, []);
		}
		return [];
	}
	return fields
		.replace(/\s/g, "")
		.split(",")
		.map((name) => name.trim());
}

export function getTableManifestConfiguration(
	lineItemAnnotation: LineItem | undefined,
	visualizationPath: string,
	converterContext: ConverterContext<PageContextPathTarget>,
	checkCondensedLayout = true,
	selectionVariantAnnotation?: SelectionVariantType
): TableControlConfiguration {
	const _manifestWrapper = converterContext.getManifestWrapper();
	const tableManifestSettings: TableManifestConfiguration = converterContext.getManifestControlConfiguration(visualizationPath);
	const tableSettings = tableManifestSettings?.tableSettings ?? {};
	const globalFEManifestSettings = _manifestWrapper.getSapFeManifestConfiguration();
	const defaultCreationMode =
		globalFEManifestSettings?.macros?.table?.defaultCreationMode === "InlineCreationRows" ? CreationMode.InlineCreationRows : undefined;
	const creationMode: CreationMode = tableSettings.creationMode?.name ?? defaultCreationMode ?? CreationMode.NewPage;
	const enableAutoColumnWidth = !_manifestWrapper.isPhone();
	const disableCopyToClipboard = tableSettings.disableCopyToClipboard;
	const templateType = converterContext.getTemplateType();
	const isCondensedTableLayoutCompliant = checkCondensedLayout && _manifestWrapper.isCondensedLayoutCompliant();
	const oFilterConfiguration = lineItemAnnotation
		? getFilterConfiguration(tableSettings, lineItemAnnotation, converterContext, selectionVariantAnnotation)
		: {};
	const customValidationFunction = tableSettings.creationMode?.customValidationFunction;
	const exportRequestSize = tableSettings.exportRequestSize;
	const tableType = getTableType(converterContext, tableManifestSettings);
	// By default, paste is enabled on an ObjectPage and on a ListReport with a draft TreeTable
	const enablePaste =
		tableSettings.enablePaste ??
		(converterContext.getTemplateType() === "ObjectPage" ||
			(tableType === "TreeTable" && (converterContext.getEntitySet() as EntitySet)?.annotations.Common?.DraftRoot !== undefined));
	const tableRowMode = _getTableMode(tableType, tableSettings, templateType === TemplateType.ListReport);
	const defaultScrollThreshold = tableType !== "ResponsiveTable" ? 300 : undefined;
	const condensedTableLayout = _getCondensedTableLayout(tableType, tableSettings);
	let inlineCreationRowsHiddenInEditMode = false;
	if (tableSettings.creationMode?.inlineCreationRowsHiddenInEditMode) {
		inlineCreationRowsHiddenInEditMode =
			typeof tableSettings.creationMode?.inlineCreationRowsHiddenInEditMode === "string"
				? tableSettings.creationMode?.inlineCreationRowsHiddenInEditMode === "true"
				: tableSettings.creationMode?.inlineCreationRowsHiddenInEditMode;
	}
	let useTextForNoDataMessages: string;
	if (converterContext.getTemplateType() === "ListReport") {
		useTextForNoDataMessages = "illustratedMessage-Auto";
	} else {
		useTextForNoDataMessages = _manifestWrapper.getUseTextForNoDataMessages() ? "text" : "illustratedMessage-Dot";
	}
	const oConfiguration = {
		// If no createAtEnd is specified it will be false for Inline/CreationDialog create and true otherwise
		createAtEnd:
			tableSettings.creationMode?.createAtEnd !== undefined
				? tableSettings.creationMode?.createAtEnd
				: ![CreationMode.Inline, CreationMode.CreationDialog].includes(creationMode),
		creationMode: creationMode,
		creationDialogFields:
			creationMode === CreationMode.CreationDialog
				? getFieldList(tableSettings.creationMode?.creationFields, converterContext)
				: undefined,
		customValidationFunction: customValidationFunction,
		hasDataStateIndicatorFilter: templateType === TemplateType.ListReport,
		// if a custom validation function is provided, disableAddRowButtonForEmptyData should not be considered, i.e. set to false
		disableAddRowButtonForEmptyData: !customValidationFunction ? !!tableSettings.creationMode?.disableAddRowButtonForEmptyData : false,
		enableAutoColumnWidth: enableAutoColumnWidth,
		enablePastingOfComputedProperties: tableSettings.enablePastingOfComputedProperties,
		enableExport: _getEnableExport(tableSettings, converterContext, enablePaste),
		frozenColumnCount: _getFrozenColumnCount(tableSettings),
		widthIncludingColumnHeader: _getWidthIncludingColumnHeader(tableSettings),
		enableFullScreen: _getFullScreenBasedOnDevice(tableSettings, converterContext, _manifestWrapper.isPhone()),
		massEdit: getMassEditSettings(tableSettings, converterContext),
		enableAddCardToInsights: tableSettings?.enableAddCardToInsights,
		enablePaste: enablePaste,
		disableCopyToClipboard: disableCopyToClipboard,
		headerVisible: true,
		header: tableSettings.header,
		multiSelectMode: _getMultiSelectMode(tableSettings, tableType, converterContext),
		selectionLimit: _getTableSelectionLimit(tableSettings),
		inlineCreationRowCount: _getTableInlineCreationRowCount(tableSettings),
		inlineCreationRowsHiddenInEditMode: inlineCreationRowsHiddenInEditMode,
		showRowCount: tableSettings?.quickVariantSelection?.paths ? false : !_manifestWrapper.getViewConfiguration()?.showCounts,
		type: tableType,
		disableRequestCache: getOptimisticBatchSettingsFromManifest(tableManifestSettings),
		useCondensedTableLayout: condensedTableLayout && isCondensedTableLayoutCompliant,
		isCompactType: _manifestWrapper.isCompactType(),
		beforeRebindTable: tableSettings.beforeRebindTable,
		exportRequestSize: exportRequestSize,
		enableUploadPlugin: !!converterContext.getAnnotationEntityType().annotations?.UI?.MediaResource?.Stream,
		selectionChange: tableSettings.selectionChange,
		modeForNoDataMessage: useTextForNoDataMessages,
		scrollThreshold: tableSettings.scrollThreshold ?? defaultScrollThreshold
	};

	const tableConfiguration: TableControlConfiguration = { ...oConfiguration, ...tableRowMode, ...oFilterConfiguration };
	if (tableType === "TreeTable") {
		updateTreeTableManifestConfiguration(tableConfiguration, tableSettings, converterContext);
	}

	if (tableSettings.headerVisible !== undefined) {
		tableConfiguration.headerVisible = tableSettings.headerVisible;
	}

	return tableConfiguration;
}

function getTableType(
	converterContext: ConverterContext<PageContextPathTarget>,
	tableManifestSettings?: TableManifestConfiguration
): TableType {
	if (tableManifestSettings?.tableSettings?.type) {
		// in case the application specified a table type we will use this one
		return tableManifestSettings.tableSettings.type;
	}

	// default is the ResponsiveTable
	return "ResponsiveTable";
}

/**
 * Creates a property using the text arrangement annotation set to text only.
 * @param converterContext The converter context.
 * @param propertyDataModelObjectPath The corresponding DataModelObjectPath.
 * @param lineItem The column to be evaluated.
 * @param columnsToBeCreated The list of columns to be created.
 * @param relativePath The relative path to the target property based on the context.
 * @param restrictionsOnProperties The existing restrictions on properties
 */
function createPropertyAnnotatedTextOnly(
	converterContext: ConverterContext<PageContextPathTarget>,
	propertyDataModelObjectPath: DataModelObjectPath<DataFieldAbstractTypes>,
	lineItem: DataFieldAbstractTypes,
	columnsToBeCreated: Record<string, Property>,
	relativePath: string,
	restrictionsOnProperties: RestrictionsOnProperties
): void {
	const isPropertyNavigated =
		propertyDataModelObjectPath.navigationProperties.length !== converterContext.getDataModelObjectPath().navigationProperties.length;
	if (isPropertyNavigated && isDataField(lineItem)) {
		columnsToBeCreated[relativePath] = lineItem.Value.$target;
		restrictionsOnProperties.nonSortableProperties.push(relativePath);
	} else if (isDataFieldForAnnotation(lineItem) && hasFieldGroupTarget(lineItem)) {
		(lineItem.Target.$target as FieldGroup).Data.forEach((field) => {
			if (isDataField(field) && getDisplayMode(field.Value.$target) === "Description") {
				const inheredPropertyDataModelObjectPath = enhanceDataModelPath(
					converterContext.getDataModelObjectPath(),
					field.Value.path
				);
				const isInheredPropertyNavigated =
					inheredPropertyDataModelObjectPath.navigationProperties.length !==
					converterContext.getDataModelObjectPath().navigationProperties.length;
				if (isInheredPropertyNavigated) {
					columnsToBeCreated[field.Value.path] = field.Value.$target;
					restrictionsOnProperties.nonSortableProperties.push(field.Value.path);
				}
			}
		});
	}
}

export function getTypeConfig(oProperty: Property | DataFieldAbstractTypes | undefined, dataType: string | undefined): PropertyTypeConfig {
	let oTargetMapping;
	if (isProperty(oProperty)) {
		oTargetMapping = isTypeDefinition(oProperty.targetType)
			? EDM_TYPE_MAPPING[oProperty.targetType.underlyingType]
			: EDM_TYPE_MAPPING[oProperty.type];
	}
	if (oTargetMapping === undefined && dataType !== undefined) {
		oTargetMapping = EDM_TYPE_MAPPING[dataType];
	}
	const propertyTypeConfig: PropertyTypeConfig = {
		type: oTargetMapping?.type,
		constraints: {},
		formatOptions: {}
	};
	if (isProperty(oProperty) && oTargetMapping !== undefined) {
		propertyTypeConfig.constraints = {
			scale: oTargetMapping.constraints?.$Scale ? oProperty.scale : undefined,
			precision: oTargetMapping.constraints?.$Precision ? oProperty.precision : undefined,
			maxLength: oTargetMapping.constraints?.$MaxLength ? oProperty.maxLength : undefined,
			nullable: oTargetMapping.constraints?.$Nullable ? oProperty.nullable : undefined,
			minimum:
				oTargetMapping.constraints?.["@Org.OData.Validation.V1.Minimum/$Decimal"] &&
				!isNaN(oProperty.annotations?.Validation?.Minimum)
					? `${oProperty.annotations?.Validation?.Minimum}`
					: undefined,
			maximum:
				oTargetMapping.constraints?.["@Org.OData.Validation.V1.Maximum/$Decimal"] &&
				!isNaN(oProperty.annotations?.Validation?.Maximum)
					? `${oProperty.annotations?.Validation?.Maximum}`
					: undefined,
			isDigitSequence:
				propertyTypeConfig.type === "sap.ui.model.odata.type.String" &&
				oTargetMapping.constraints?.[`@${CommonAnnotationTerms.IsDigitSequence}`] &&
				oProperty.annotations?.Common?.IsDigitSequence
					? true
					: undefined
		};
	}
	propertyTypeConfig.formatOptions = {
		parseAsString:
			propertyTypeConfig?.type?.indexOf("sap.ui.model.odata.type.Int") === 0 ||
			propertyTypeConfig?.type?.indexOf("sap.ui.model.odata.type.Double") === 0
				? false
				: undefined,
		emptyString:
			propertyTypeConfig?.type?.indexOf("sap.ui.model.odata.type.Int") === 0 ||
			propertyTypeConfig?.type?.indexOf("sap.ui.model.odata.type.Double") === 0
				? ""
				: undefined,
		parseKeepsEmptyString:
			propertyTypeConfig.type === "sap.ui.model.odata.type.String" && propertyTypeConfig.constraints.nullable === false
				? true
				: undefined
	};
	return propertyTypeConfig;
}
/**
 * Add a description property to the list of description properties used by the columns of a table
 * @param textProperties The list of properties referenced as text on a text arrangement annotation
 * @param relatedPropertiesInfo The related properties linked to the column (named also complex property)
 * @param relatedPropertyName The property name to be added
 */

function addPropertyToDisplayModeOfDescriptionPropertiesMap(
	displayModeOfDescriptionPropertiesMap: Record<string, DisplayMode>,
	relatedPropertiesInfo: ComplexPropertyInfo,
	relatedPropertyName: string
): void {
	if (
		relatedPropertiesInfo.properties[relatedPropertyName].displayModeOfPropertyUsedAsDescription &&
		!displayModeOfDescriptionPropertiesMap[relatedPropertyName]
	) {
		displayModeOfDescriptionPropertiesMap[relatedPropertyName] =
			relatedPropertiesInfo.properties[relatedPropertyName].displayModeOfPropertyUsedAsDescription!;
	}
}

/**
 * Computes the referenced properties of a LineItem in case the LineItem is annotated as hidden.
 * @param existingColumns The list of columns created from LineItems and from properties of entityType
 * @param name The name of the property to be evaluated
 * @param column The given column from lineItem or property of entitySet
 */
function computeHiddenOnRelatedColumns(existingColumns: AnnotationTableColumn[], name: string, column: AnnotationTableColumn): void {
	const relatedAnnotationColumns = existingColumns.filter(
		(existingColumn) => existingColumn.propertyInfos?.includes(name) && existingColumn.isPartOfLineItem
	);
	column.isPartOfLineItem = !!relatedAnnotationColumns.length;
	if (
		relatedAnnotationColumns.length &&
		!relatedAnnotationColumns?.some((annotationColumn) => annotationColumn.availability !== "Hidden")
	) {
		column.sortable = false;
		column.isGroupable = false;
		column.filterable = false;
	}
}

/**
 * Gets the export settings properties of a manifest column.
 * @param exportSettings The customized/overwritten export settings of a manifest column
 * @param annotationColumns The list of columns created from LineItems
 * @param converterContext The converter context
 * @param entityType The target entity type
 * @param propertyInfos The properties linked to a complex column
 * @param columnKey The column key of the column to be overwritten
 * @returns The export settings of the column merging customized export settings with the default values detected on the annotation column
 */
function getCustomExportSettings(
	exportSettings: ColumnExportSettings | undefined,
	annotationColumns: AnnotationTableColumn[],
	converterContext: ConverterContext<PageContextPathTarget>,
	entityType: EntityType,
	propertyInfos?: string[],
	columnKey?: string
): ColumnExportSettings | null {
	let columnFromAnnotations;
	if (columnKey) {
		columnFromAnnotations = annotationColumns.find((annotationColumn) => annotationColumn.key === columnKey);
		if (columnFromAnnotations?.exportSettings === null) {
			return columnFromAnnotations?.exportSettings;
		}
	}
	const enableWrapping =
		exportSettings?.wrap ??
		(!!(exportSettings?.property && exportSettings.property?.length > 1) || !!(propertyInfos && propertyInfos.length > 1));
	const customExportSettings: ColumnExportSettings = {
		...columnFromAnnotations?.exportSettings,
		type: exportSettings?.type ?? columnFromAnnotations?.exportSettings?.type,
		template:
			exportSettings?.template ??
			_appendCustomTemplate(propertyInfos, exportSettings?.property) ??
			columnFromAnnotations?.exportSettings?.template,
		property: exportSettings?.property
			? _getPropertyNames(exportSettings?.property, annotationColumns, converterContext, entityType)
			: undefined,
		width: exportSettings?.width,
		wrap: enableWrapping
	};
	return removeUndefinedFromExportSettings(customExportSettings);
}

export default {
	getTableActions,
	getTableColumns,
	getColumnsFromEntityType,
	updateLinkedProperties,
	createTableVisualization,
	createDefaultTableVisualization,
	getCapabilityRestriction,
	getImportance,
	getSelectionMode,
	getRowStatusVisibility,
	getP13nMode,
	getStandardActionsConfiguration,
	getTableAnnotationConfiguration,
	isFilteringCaseSensitive,
	splitPath,
	getSelectionVariantConfiguration,
	getTableManifestConfiguration,
	getTypeConfig,
	updateTableVisualizationForType,
	createRequestedProperties,
	getNavigationTargetPath,
	getCustomFunctionInfo
};
