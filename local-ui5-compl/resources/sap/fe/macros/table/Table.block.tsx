import type { ConvertedMetadata, EntitySet, EntityType, NavigationProperty } from "@sap-ux/vocabularies-types";
import type {
	LineItem,
	PresentationVariant,
	SelectionPresentationVariant,
	SelectionVariant,
	SelectionVariantType
} from "@sap-ux/vocabularies-types/vocabularies/UI";
import { UIAnnotationTerms } from "@sap-ux/vocabularies-types/vocabularies/UI";
import Log from "sap/base/Log";
import { compileExpression, fn, ref, type CompiledBindingToolkitExpression } from "sap/fe/base/BindingToolkit";
import type { PropertiesOf } from "sap/fe/base/ClassSupport";
import {
	blockAggregation,
	blockAttribute,
	blockEvent,
	defineBuildingBlock
} from "sap/fe/core/buildingBlocks/templating/BuildingBlockSupport";
import type { TemplateProcessorSettings } from "sap/fe/core/buildingBlocks/templating/BuildingBlockTemplateProcessor";
import type ConverterContext from "sap/fe/core/converters/ConverterContext";
import { CreationMode, VisualizationType } from "sap/fe/core/converters/ManifestSettings";
import { getInvolvedDataModelObjects } from "sap/fe/core/converters/MetaModelConverter";
import type { VisualizationAndPath } from "sap/fe/core/converters/controls/Common/DataVisualization";
import {
	getDataVisualizationConfiguration,
	getVisualizationsFromAnnotation
} from "sap/fe/core/converters/controls/Common/DataVisualization";
import type { CreateBehavior, ExternalMethodConfig, TableType, TableVisualization } from "sap/fe/core/converters/controls/Common/Table";
import { getCustomFunctionInfo } from "sap/fe/core/converters/controls/Common/Table";
import { StandardActionKeys } from "sap/fe/core/converters/controls/Common/table/StandardActions";
import { generate } from "sap/fe/core/helpers/StableIdHelper";
import { isAnnotationOfTerm } from "sap/fe/core/helpers/TypeGuards";
import type { DataModelObjectPath } from "sap/fe/core/templating/DataModelPathHelper";
import { getContextRelativeTargetObjectPath } from "sap/fe/core/templating/DataModelPathHelper";
import MacroAPI from "sap/fe/macros/MacroAPI";

import type Action from "sap/fe/macros/table/Action";
import type ActionGroup from "sap/fe/macros/table/ActionGroup";

import type Column from "sap/fe/macros/table/Column";
import { TitleLevel } from "sap/ui/core/library";
import type Context from "sap/ui/model/Context";
type ExtendedActionGroup = ActionGroup & { menuContentActions?: Record<string, Action> };
type ActionOrActionGroup = Record<string, Action | ExtendedActionGroup>;

import type AppComponent from "sap/fe/core/AppComponent";
import BuildingBlockTemplatingBase from "sap/fe/core/buildingBlocks/templating/BuildingBlockTemplatingBase";
import type { PageContextPathTarget } from "sap/fe/core/converters/TemplateConverter";
import type { ChartVisualization } from "sap/fe/core/converters/controls/Common/Chart";
import type { TableBlockProperties } from "sap/fe/macros/table/MdcTableTemplate";
import { getMDCTableTemplate } from "sap/fe/macros/table/MdcTableTemplate";
import TableAPI from "sap/fe/macros/table/TableAPI";
import TableCreationOptions from "sap/fe/macros/table/TableCreationOptions";
import FlexItemData from "sap/m/FlexItemData";
import type ODataMetaModel from "sap/ui/model/odata/v4/ODataMetaModel";
import { createCustomData } from "../TSXUtils";
import TableEventHandlerProvider from "./TableEventHandlerProvider";

const setCustomActionProperties = function (childAction: Element): unknown {
	let menuContentActions: Record<string, Action> | null = null;
	const act = childAction;
	let menuActions: string[] = [];
	const actionKey = act.getAttribute("key")?.replace("InlineXML_", "");
	// For the actionGroup we authorize the both entries <sap.fe.macros:ActionGroup> (compliant with old FPM examples) and <sap.fe.macros.table:ActionGroup>
	if (
		act.children.length &&
		act.localName === "ActionGroup" &&
		act.namespaceURI &&
		["sap.fe.macros", "sap.fe.macros.table"].includes(act.namespaceURI)
	) {
		const actionsToAdd = Array.prototype.slice.apply(act.children);
		let actionIdx = 0;
		menuContentActions = actionsToAdd.reduce((acc, actToAdd) => {
			const actionKeyAdd = actToAdd.getAttribute("key")?.replace("InlineXML_", "") || actionKey + "_Menu_" + actionIdx;
			const curOutObject = {
				key: actionKeyAdd,
				text: actToAdd.getAttribute("text"),
				__noWrap: true,
				press: actToAdd.getAttribute("press"),
				requiresSelection: actToAdd.getAttribute("requiresSelection") === "true",
				enabled: actToAdd.getAttribute("enabled") === null ? true : actToAdd.getAttribute("enabled")
			};
			acc[curOutObject.key] = curOutObject;
			actionIdx++;
			return acc;
		}, {});
		menuActions = Object.values(menuContentActions!)
			.slice(-act.children.length)
			.map(function (menuItem) {
				return menuItem.key;
			});
	}
	return {
		key: actionKey,
		text: act.getAttribute("text"),
		position: {
			placement: act.getAttribute("placement"),
			anchor: act.getAttribute("anchor")
		},
		__noWrap: true,
		press: act.getAttribute("press") === null ? undefined : act.getAttribute("press"),
		requiresSelection: act.getAttribute("requiresSelection") === "true",
		enabled: act.getAttribute("enabled") === null ? true : act.getAttribute("enabled"),
		menu: menuActions.length ? menuActions : null,
		menuContentActions: menuContentActions
	};
};

const setCustomColumnProperties = function (childColumn: Element, aggregationObject: Column): unknown {
	aggregationObject.key = aggregationObject.key.replace("InlineXML_", "");
	childColumn.setAttribute("key", aggregationObject.key);

	function safeGetAttribute(name: string): string | undefined {
		return childColumn.getAttribute(name) ?? undefined;
	}

	return {
		// Defaults are to be defined in Table.ts
		key: aggregationObject.key,
		type: "Slot",
		width: safeGetAttribute("width"),
		widthIncludingColumnHeader: childColumn.getAttribute("widthIncludingColumnHeader")
			? childColumn.getAttribute("widthIncludingColumnHeader") === "true"
			: undefined,
		importance: safeGetAttribute("importance"),
		horizontalAlign: safeGetAttribute("horizontalAlign"),
		availability: childColumn.getAttribute("availability") || "Default",
		header: safeGetAttribute("header"),
		tooltip: safeGetAttribute("tooltip"),
		template: childColumn.children[0]?.outerHTML || safeGetAttribute("template"),
		properties: childColumn.getAttribute("properties") ? childColumn.getAttribute("properties")?.split(",") : undefined,
		position: {
			placement: safeGetAttribute("placement") || safeGetAttribute("positionPlacement"), //positionPlacement is kept for backwards compatibility
			anchor: safeGetAttribute("anchor") || safeGetAttribute("positionAnchor") //positionAnchor is kept for backwards compatibility
		},
		required: safeGetAttribute("required")
	};
};

/**
 * Building block used to create a table based on the metadata provided by OData V4.
 * <br>
 * Usually, a LineItem, PresentationVariant or SelectionPresentationVariant annotation is expected, but the Table building block can also be used to display an EntitySet.
 * <br>
 * If a PresentationVariant is specified, then it must have UI.LineItem as the first property of the Visualizations.
 * <br>
 * If a SelectionPresentationVariant is specified, then it must contain a valid PresentationVariant that also has a UI.LineItem as the first property of the Visualizations.
 *
 * Usage example:
 * <pre>
 * &lt;macros:Table id="MyTable" metaPath="@com.sap.vocabularies.UI.v1.LineItem" /&gt;
 * </pre>
 * @mixes sap.fe.macros.table.TableAPI
 * @augments sap.fe.macros.MacroAPI
 * @public
 */
@defineBuildingBlock({
	name: "Table",
	namespace: "sap.fe.macros.internal",
	publicNamespace: "sap.fe.macros",
	returnTypes: ["sap.fe.macros.table.TableAPI"]
})
export default class TableBlock extends BuildingBlockTemplatingBase {
	//  *************** Public & Required Attributes ********************
	/**
	 * Defines the relative path to a LineItem, PresentationVariant or SelectionPresentationVariant in the metamodel, based on the current contextPath.
	 * @public
	 */
	@blockAttribute({
		type: "sap.ui.model.Context",
		underlyingType: "string",
		expectedTypes: ["EntitySet", "EntityType", "Singleton", "NavigationProperty"],
		expectedAnnotations: [
			"com.sap.vocabularies.UI.v1.LineItem",
			"com.sap.vocabularies.UI.v1.PresentationVariant",
			"com.sap.vocabularies.UI.v1.SelectionPresentationVariant"
		],
		isPublic: true,
		required: true
	})
	metaPath!: Context;

	//  *************** Public Attributes ********************
	/**
	 * An expression that allows you to control the 'busy' state of the table.
	 * @public
	 */
	@blockAttribute({ type: "boolean", isPublic: true, bindable: true })
	busy?: boolean;

	/**
	 * Defines the path of the context used in the current page or block.
	 * This setting is defined by the framework.
	 * @public
	 */
	@blockAttribute({
		type: "sap.ui.model.Context",
		underlyingType: "string",
		expectedTypes: ["EntitySet", "EntityType", "Singleton", "NavigationProperty"],
		isPublic: true
	})
	contextPath?: Context;

	/**
	 * Controls whether the table can be opened in fullscreen mode or not.
	 * @public
	 */
	@blockAttribute({ type: "boolean", isPublic: true })
	private readonly enableFullScreen?: boolean;

	/**
	 * Controls if the export functionality of the table is enabled or not.
	 * @public
	 */
	@blockAttribute({ type: "boolean", isPublic: true })
	public readonly enableExport?: boolean;

	/**
	 * Maximum allowed number of records to be exported in one request.
	 * @public
	 */
	@blockAttribute({ type: "int", isPublic: true })
	private readonly exportRequestSize?: number;

	/**
	 * Number of columns that are fixed on the left. Only columns which are not fixed can be scrolled horizontally.
	 *
	 * This property is not relevant for responsive tables
	 * @public
	 */
	@blockAttribute({ type: "int", isPublic: true })
	private readonly frozenColumnCount?: number;

	/**
	 * Indicates if the column header should be a part of the width calculation.
	 * @public
	 */
	@blockAttribute({ type: "boolean", isPublic: true })
	private readonly widthIncludingColumnHeader?: boolean;

	/**
	 * Defines how the table handles the visible rows. Does not apply to Responsive tables.
	 *
	 * Allowed values are `Auto`, `Fixed`.<br/>
	 * - If set to `Fixed`, the table always has as many rows as defined in the rowCount property.<br/>
	 * - If set to `Auto`, the number of rows is changed by the table automatically. It will then adjust its row count to the space it is allowed to cover (limited by the surrounding container) but it cannot have less than defined in the `rowCount` property.<br/>
	 * @public
	 */
	@blockAttribute({ type: "string", allowedValues: ["Auto", "Fixed"], isPublic: true })
	private readonly rowCountMode?: string;

	/**
	 * Number of rows to be displayed in the table. Does not apply to responsive tables.
	 * @public
	 */
	@blockAttribute({ type: "int", isPublic: true })
	private readonly rowCount?: number;

	/**
	 * Controls if the paste functionality of the table is enabled or not.
	 * @public
	 */
	@blockAttribute({ type: "boolean", isPublic: true })
	private readonly enablePaste?: boolean | CompiledBindingToolkitExpression;

	/**
	 * Controls if the copy functionality of the table is disabled or not.
	 * @public
	 */
	@blockAttribute({ type: "boolean", isPublic: true })
	disableCopyToClipboard?: boolean;

	/**
	 * Defines how many additional data records are requested from the back-end system when the user scrolls vertically in the table.
	 * @public
	 */
	@blockAttribute({ type: "number", isPublic: true })
	scrollThreshold?: number;

	/**
	 * ID of the FilterBar building block associated with the table.
	 * @public
	 */
	@blockAttribute({ type: "string", isPublic: true, isAssociation: true })
	filterBar?: string;

	/**
	 * Specifies the header text that is shown in the table.
	 * @public
	 */
	@blockAttribute({ type: "string", isPublic: true })
	header?: string;

	/**
	 * Defines the "aria-level" of the table header
	 */
	@blockAttribute({ type: "sap.ui.core.TitleLevel", isPublic: true })
	headerLevel: TitleLevel = TitleLevel.Auto;

	/**
	 * Controls if the header text should be shown or not.
	 * @public
	 */
	@blockAttribute({ type: "boolean", isPublic: true })
	headerVisible?: boolean;

	@blockAttribute({ type: "string", isPublic: true })
	id!: string;

	@blockAttribute({ type: "string", isPublic: true })
	annotationId?: string;

	/**
	 * Additionnal SelectionVariant to be applied on the table content.
	 */
	@blockAttribute({
		type: "sap.ui.model.Context",
		underlyingType: "string",
		expectedTypes: ["EntitySet", "EntityType", "Singleton", "NavigationProperty"],
		expectedAnnotations: ["com.sap.vocabularies.UI.v1.SelectionVariant"],
		isPublic: true
	})
	associatedSelectionVariantPath?: Context;

	/**
	 * Defines whether to display the search action.
	 * @public
	 */
	@blockAttribute({ type: "boolean", isPublic: true })
	isSearchable?: boolean;

	/**
	 * Controls which options should be enabled for the table personalization dialog.
	 *
	 * If it is set to `true`, all possible options for this kind of table are enabled.<br/>
	 * If it is set to `false`, personalization is disabled.<br/>
	 * <br/>
	 * You can also provide a more granular control for the personalization by providing a comma-separated list with the options you want to be available.<br/>
	 * Available options are:<br/>
	 * - Sort<br/>
	 * - Column<br/>
	 * - Filter<br/>
	 * @public
	 */
	@blockAttribute({ type: "string", isPublic: true })
	personalization?: string;

	/**
	 * An expression that allows you to control the 'read-only' state of the table.
	 *
	 * If you do not set any expression, SAP Fiori elements hooks into the standard lifecycle to determine the current state.
	 * @public
	 */
	@blockAttribute({ type: "boolean", isPublic: true })
	readOnly?: boolean;

	/**
	 * Defines the type of table that will be used by the building block to render the data.
	 *
	 * Allowed values are `GridTable`, `ResponsiveTable` and `AnalyticalTable`.
	 * @public
	 */
	@blockAttribute({ type: "string", isPublic: true, allowedValues: ["GridTable", "ResponsiveTable", "AnalyticalTable"] })
	protected readonly type?: TableType;

	/**
	 * Specifies whether the table is displayed with condensed layout (true/false). The default setting is `false`.
	 */
	@blockAttribute({ type: "boolean", isPublic: true })
	useCondensedLayout?: boolean;

	/**
	 * Defines the selection mode to be used by the table.
	 *
	 * Allowed values are `None`, `Single`, `ForceSingle`, `Multi`, `ForceMulti` or `Auto`.
	 * If set to 'Single', 'Multi' or 'Auto', SAP Fiori elements hooks into the standard lifecycle to determine the consistent selection mode.
	 * If set to 'ForceSingle' or 'ForceMulti' your choice will be respected but this might not respect the Fiori guidelines.
	 * @public
	 */
	@blockAttribute({ type: "string", isPublic: true, allowedValues: ["None", "Single", "Multi", "Auto", "ForceMulti", "ForceSingle"] })
	private readonly selectionMode?: string;

	/**
	 * Controls the kind of variant management that should be enabled for the table.
	 *
	 * Allowed value is `Control`.<br/>
	 * If set with value `Control`, a variant management control is seen within the table and the table is linked to this.<br/>
	 * If not set with any value, control level variant management is not available for this table.
	 * @public
	 */
	@blockAttribute({ type: "string", isPublic: true, allowedValues: ["Control"] })
	variantManagement?: string;

	/**
	 * Comma-separated value of fields that must be ignored in the OData metadata by the Table building block.<br>
	 * The table building block is not going to create built-in columns or offer table personalization for comma-separated value of fields that are provided in the ignoredfields.<br>
	 * Any column referencing an ignored field is to be removed.<br>
	 * @since 1.124.0
	 * @public
	 */
	@blockAttribute({ type: "string", isPublic: true })
	ignoredFields?: string;

	/**
	 * Changes the size of the IllustratedMessage in the table, or removes it completely.
	 * Allowed values are `illustratedMessage-Auto`, `illustratedMessage-Base`, `illustratedMessage-Dialog`, `illustratedMessage-Dot`, `illustratedMessage-Scene`, `illustratedMessage-Spot` or `text`.
	 * @since 1.129.0
	 * @public
	 */
	@blockAttribute({
		type: "string",
		isPublic: true,
		allowedValues: [
			"illustratedMessage-Auto",
			"illustratedMessage-Base",
			"illustratedMessage-Dialog",
			"illustratedMessage-Dot",
			"illustratedMessage-Scene",
			"illustratedMessage-Spot",
			"text"
		]
	})
	modeForNoDataMessage?: string;

	//  *************** Private Attributes ********************
	private _apiId?: string;

	private readonly collectionEntity: EntitySet | NavigationProperty;

	/**
	 * Defines the header style of the table header
	 */
	@blockAttribute({ type: "sap.ui.core.TitleLevel" })
	headerStyle?: TitleLevel;

	/**
	 * Specifies if the column width is automatically calculated.
	 * @public
	 */
	@blockAttribute({ type: "boolean", isPublic: true })
	enableAutoColumnWidth?: boolean = true;

	@blockAttribute({ type: "string" })
	fieldMode = "";

	@blockAttribute({ type: "boolean" })
	isAlp?: boolean = false;

	/**
	 * ONLY FOR RESPONSIVE TABLE: Setting to define the checkbox in the column header: Allowed values are `Default` or `ClearAll`. If set to `Default`, the sap.m.Table control renders the Select All checkbox, otherwise the Deselect All button is rendered.
	 */
	multiSelectMode?: string;

	/**
	 * Used for binding the table to a navigation path. Only the path is used for binding rows.
	 */
	navigationPath?: string;

	/**
	 * True if the table is in a ListReport multi view
	 */
	@blockAttribute({ type: "boolean" })
	inMultiView?: boolean;

	useBasicSearch?: boolean;

	tableDefinition: TableVisualization; // We require tableDefinition to be there even though it is not formally required

	tableDefinitionContext?: Context;

	@blockAttribute({ type: "string" })
	tabTitle = "";

	@blockAttribute({ type: "boolean" })
	visible?: boolean;

	/**
	 * A set of options that can be configured.
	 * @public
	 */
	@blockAttribute({
		type: "object",
		underlyingType: "sap.fe.macros.table.TableCreationOptions",
		isPublic: true,
		validate: function (creationOptionsInput: TableCreationOptions) {
			if (
				creationOptionsInput.name &&
				!["NewPage", "Inline", "InlineCreationRows", "External", "CreationDialog"].includes(creationOptionsInput.name)
			) {
				throw new Error(`Allowed value ${creationOptionsInput.name} for creationMode does not match`);
			}

			return creationOptionsInput;
		}
	})
	creationMode: PropertiesOf<TableCreationOptions> = {};

	/**
	 * Aggregate actions of the table.
	 * @public
	 */
	@blockAggregation({
		type: "sap.fe.macros.table.Action",
		altTypes: ["sap.fe.macros.table.ActionGroup"],
		isPublic: true,
		multiple: true,
		processAggregations: setCustomActionProperties
	})
	actions?: ActionOrActionGroup;

	/**
	 * Aggregate columns of the table.
	 * @public
	 */
	@blockAggregation({
		type: "sap.fe.macros.table.Column",
		isPublic: true,
		multiple: true,
		hasVirtualNode: true,
		processAggregations: setCustomColumnProperties
	})
	columns?: Record<string, Column>;

	convertedMetadata: ConvertedMetadata;

	contextObjectPath: DataModelObjectPath<LineItem | PresentationVariant | SelectionPresentationVariant>;

	/**
	 * Before a table rebind, an event is triggered that contains information about the binding.
	 *
	 * You can use this event to add selects, and add or read the sorters and filters.
	 * @public
	 */
	@blockEvent()
	private readonly beforeRebindTable?: string;

	/**
	 * An event is triggered when the user chooses a row; the event contains information about which row is chosen.
	 *
	 * You can set this in order to handle the navigation manually.
	 * @public
	 */
	@blockEvent()
	rowPress?: string;

	/**
	 * Event handler to react to the contextChange event of the table.
	 */
	// FIXME only internal
	@blockEvent()
	onContextChange?: string;

	/**
	 * Event handler called when the user chooses an option of the segmented button in the ALP View
	 */
	@blockEvent()
	onSegmentedButtonPressed?: string;

	@blockEvent()
	variantSaved?: string;

	/**
	 * An event triggered when the selection in the table changes.
	 * @public
	 */
	@blockEvent()
	private readonly selectionChange?: string;

	@blockEvent()
	variantSelected?: string;

	@blockAttribute({ type: "boolean", isPublic: true })
	initialLoad?: boolean;

	private readonly appComponent: AppComponent;

	private readonly metaModel: ODataMetaModel;

	constructor(props: PropertiesOf<TableBlock>, controlConfiguration: unknown, settings: TemplateProcessorSettings) {
		super(props, controlConfiguration, settings);
		const contextObjectPath = getInvolvedDataModelObjects<LineItem | PresentationVariant | SelectionPresentationVariant>(
			this.metaPath,
			this.contextPath as Context
		);
		this.contextObjectPath = contextObjectPath;
		const tableSettings = this.getTableSettings();

		this.tableDefinition = TableBlock.createTableDefinition(this, settings, tableSettings);
		this.tableDefinitionContext = MacroAPI.createBindingContext(this.tableDefinition as object, settings);

		this.convertedMetadata = this.contextObjectPath.convertedTypes;
		this.metaModel = settings.models.metaModel;
		this.collectionEntity = this.convertedMetadata.resolvePath(this.tableDefinition.annotation.collection).target as EntitySet;
		this.appComponent = settings.appComponent;
		this.setUpId();

		this.creationMode.name ??= this.tableDefinition.annotation.create.mode as TableCreationOptions["name"];
		this.creationMode.createAtEnd ??= (this.tableDefinition.annotation.create as CreateBehavior).append;
		// Special code for readOnly
		// readonly = false -> Force editable
		// readonly = true -> Force display mode
		// readonly = undefined -> Bound to edit flow
		if (this.readOnly === undefined && this.tableDefinition.annotation.displayMode === true) {
			this.readOnly = true;
		}

		// getCustomInfo and buildEventHandlerWrapper are done in one location so that the format of the custom function names is unconverted
		// and contains "." instead of "/". "/" cannot be used in the table adaption dialog.
		this.beforeRebindTable ??= this.buildEventHandlerWrapper(
			getCustomFunctionInfo(this.tableDefinition.control.beforeRebindTable, this.tableDefinition.control)
		);
		this.selectionChange ??= this.buildEventHandlerWrapper(
			getCustomFunctionInfo(this.tableDefinition.control.selectionChange, this.tableDefinition.control)
		);
		TableAPI.updateColumnsVisibility(this.ignoredFields, [], this.tableDefinition);

		let useBasicSearch = false;

		// Note for the 'filterBar' property:
		// 1. ID relative to the view of the Table.
		// 2. Absolute ID.
		// 3. ID would be considered in association to TableAPI's ID.
		if (!this.filterBar) {
			// filterBar: Public property for building blocks
			// filterBarId: Only used as Internal private property for FE templates
			this.filterBar = generate([this.id, "StandardAction", "BasicSearch"]);
			useBasicSearch = true;
		}
		// Internal properties
		this.useBasicSearch = useBasicSearch;

		if (this.modeForNoDataMessage && this.modeForNoDataMessage !== "text") {
			this.modeForNoDataMessage = this.modeForNoDataMessage.split("-")[1];
		}
		if (!this.modeForNoDataMessage && this.tableDefinition.control.modeForNoDataMessage) {
			if (this.tableDefinition.control.modeForNoDataMessage === "text") {
				this.modeForNoDataMessage = this.tableDefinition.control.modeForNoDataMessage;
			} else {
				this.modeForNoDataMessage = this.tableDefinition.control.modeForNoDataMessage.split("-")[1];
			}
		}
	}

	/**
	 * Returns the annotation path pointing to the visualization annotation (LineItem).
	 * @param contextObjectPath The datamodel object path for the table
	 * @param converterContext The converter context
	 * @returns The annotation path
	 */
	static getVisualizationPath(
		contextObjectPath: DataModelObjectPath<LineItem | PresentationVariant | SelectionPresentationVariant>,
		converterContext: ConverterContext<PageContextPathTarget>
	): string {
		const metaPath = getContextRelativeTargetObjectPath(contextObjectPath) as string;

		// fallback to default LineItem if metapath is not set
		if (!metaPath) {
			Log.error(`Missing meta path parameter for LineItem`);
			return `@${UIAnnotationTerms.LineItem}`;
		}

		if (isAnnotationOfTerm<LineItem>(contextObjectPath.targetObject, UIAnnotationTerms.LineItem)) {
			return metaPath; // MetaPath is already pointing to a LineItem
		}
		//Need to switch to the context related the PV or SPV
		const resolvedTarget = converterContext.getEntityTypeAnnotation(metaPath);

		let visualizations: VisualizationAndPath[] = [];
		if (
			isAnnotationOfTerm<SelectionPresentationVariant>(
				contextObjectPath.targetObject,
				UIAnnotationTerms.SelectionPresentationVariant
			) ||
			isAnnotationOfTerm<PresentationVariant>(contextObjectPath.targetObject, UIAnnotationTerms.PresentationVariant)
		) {
			visualizations = getVisualizationsFromAnnotation(
				contextObjectPath.targetObject,
				metaPath,
				resolvedTarget.converterContext,
				true
			);
		} else {
			Log.error(`Bad metapath parameter for table : ${contextObjectPath.targetObject!.term}`);
		}

		const lineItemViz = visualizations.find((viz) => {
			return viz.visualization.term === UIAnnotationTerms.LineItem;
		});

		if (lineItemViz) {
			return lineItemViz.annotationPath;
		} else {
			// fallback to default LineItem if annotation missing in PV
			Log.error(`Bad meta path parameter for LineItem: ${contextObjectPath.targetObject!.term}`);
			return `@${UIAnnotationTerms.LineItem}`; // Fallback
		}
	}

	static addSetting = (target: Record<string, unknown>, key: string, value: unknown): void => {
		if (value !== undefined) {
			target[key] = value;
		}
	};

	getTableSettings(): Record<string, unknown> {
		const tableSettings: Record<string, unknown> = {};
		TableBlock.addSetting(tableSettings, "enableExport", this.enableExport);
		TableBlock.addSetting(tableSettings, "exportRequestSize", this.exportRequestSize);
		TableBlock.addSetting(tableSettings, "frozenColumnCount", this.frozenColumnCount);
		TableBlock.addSetting(tableSettings, "widthIncludingColumnHeader", this.widthIncludingColumnHeader);
		TableBlock.addSetting(tableSettings, "rowCountMode", this.rowCountMode);
		TableBlock.addSetting(tableSettings, "rowCount", this.rowCount);
		TableBlock.addSetting(tableSettings, "enableFullScreen", this.enableFullScreen);
		TableBlock.addSetting(tableSettings, "enablePaste", this.enablePaste);
		TableBlock.addSetting(tableSettings, "disableCopyToClipboard", this.disableCopyToClipboard);
		TableBlock.addSetting(tableSettings, "scrollThreshold", this.scrollThreshold);
		TableBlock.addSetting(tableSettings, "selectionMode", this.selectionMode);
		TableBlock.addSetting(tableSettings, "type", this.type);

		const creationMode: Record<string, unknown> = {};
		TableBlock.addSetting(creationMode, "name", this.creationMode.name);
		TableBlock.addSetting(creationMode, "creationFields", this.creationMode.creationFields);
		TableBlock.addSetting(creationMode, "createAtEnd", this.creationMode.createAtEnd);
		TableBlock.addSetting(creationMode, "inlineCreationRowsHiddenInEditMode", this.creationMode.inlineCreationRowsHiddenInEditMode);
		if (Object.entries(creationMode).length > 0) {
			tableSettings["creationMode"] = creationMode;
		}
		return tableSettings;
	}

	static createTableDefinition(
		table: TableBlock,
		settings: TemplateProcessorSettings,
		tableSettings: Record<string, unknown>
	): TableVisualization {
		const initialConverterContext = table.getConverterContext(table.contextObjectPath, table.contextPath?.getPath(), settings);
		const visualizationPath = TableBlock.getVisualizationPath(table.contextObjectPath, initialConverterContext);

		const extraParams: Record<
			string,
			{
				actions: ActionOrActionGroup;
				columns: Record<string, Column>;
				tableSettings: Record<string, unknown>;
			}
		> = {};

		// Check if we have ActionGroup and add nested actions
		if (table.actions) {
			Object.values(table.actions)?.forEach((item) => {
				table.actions = { ...table.actions, ...(item as ExtendedActionGroup).menuContentActions };
				delete (item as ExtendedActionGroup).menuContentActions;
			});
		}

		// table actions and columns as {} if not provided to allow merge with manifest settings
		extraParams[visualizationPath] = {
			actions: table.actions || {},
			columns: table.columns || {},
			tableSettings: tableSettings
		};
		const converterContext = table.getConverterContext(table.contextObjectPath, table.contextPath?.getPath(), settings, extraParams);

		let associatedSelectionVariant: SelectionVariantType | undefined;
		if (table.associatedSelectionVariantPath) {
			const svObjectPath = getInvolvedDataModelObjects<SelectionVariant>(
				table.associatedSelectionVariantPath,
				table.contextPath as Context
			);
			associatedSelectionVariant = svObjectPath.targetObject;
		}

		const visualizationDefinition = getDataVisualizationConfiguration(
			(table.inMultiView && table.contextObjectPath.targetObject
				? converterContext.getRelativeAnnotationPath(
						table.contextObjectPath.targetObject.fullyQualifiedName,
						converterContext.getEntityType()
				  )
				: getContextRelativeTargetObjectPath(table.contextObjectPath)) as string,
			converterContext,
			{
				isCondensedTableLayoutCompliant: table.useCondensedLayout,
				associatedSelectionVariant,
				isMacroOrMultipleView: table.inMultiView ?? true
			}
		);

		// take the (first) Table visualization
		const tableDefinition = visualizationDefinition.visualizations.find(
			(viz: TableVisualization | ChartVisualization) => viz.type === VisualizationType.Table
		) as TableVisualization;

		if (table.annotationId) {
			tableDefinition.annotation.id = table.annotationId;
			tableDefinition.annotation.apiId = generate([table.annotationId, "Table"]);
		}

		return tableDefinition;
	}

	setUpId(): void {
		if (this.id) {
			// The given ID shall be assigned to the TableAPI and not to the MDC Table
			this._apiId = this.id;
			this.id = this.getContentId(this.id);
		} else {
			// We generate the ID. Due to compatibility reasons we keep it on the MDC Table but provide assign
			// the ID with a ::Table suffix to the TableAPI
			const tableDefinition = this.tableDefinition;
			this.id ??= tableDefinition.annotation.id;
			this._apiId = tableDefinition.annotation.apiId;
		}
	}

	_getEntityType(): EntityType {
		return (this.collectionEntity as EntitySet)?.entityType || (this.collectionEntity as NavigationProperty)?.targetType;
	}

	getEmptyRowsEnabled(): string | undefined {
		const enabled =
			this.creationMode.name === CreationMode.InlineCreationRows
				? this.tableDefinition.actions.find((a) => a.key === StandardActionKeys.Create)?.enabled
				: undefined;
		return enabled === "false" ? undefined : enabled;
	}

	buildEventHandlerWrapper(eventHandler?: ExternalMethodConfig): string | undefined {
		if (!eventHandler) {
			return undefined;
		}

		// FPM.getCustomFunction returns a function, that's why we have 2 nested function calls below
		return compileExpression(
			fn(
				compileExpression(fn("FPM.getCustomFunction", [eventHandler.moduleName, eventHandler.methodName, ref("$event")])) as string,
				[ref("$event")]
			)
		);
	}

	getTemplate(): string {
		const entityType = this._getEntityType();
		const tableProps = this as unknown as TableBlockProperties;
		tableProps.rowPressHandlerPath = this.rowPress!;
		tableProps.variantSavedHandlerPath = this.variantSaved!;
		tableProps.variantSelectedHandlerPath = this.variantSelected!;
		tableProps.onSegmentedButtonPressedHandlerPath = this.onSegmentedButtonPressed;

		const collectionEntity = this.convertedMetadata.resolvePath(tableProps.tableDefinition.annotation.collection).target as
			| EntitySet
			| NavigationProperty;
		const handlerProvider = new TableEventHandlerProvider(tableProps, collectionEntity);

		return (
			<TableAPI
				core:require="{FPM: 'sap/fe/core/helpers/FPMHelper'}"
				binding={`{internal>controls/${this.id}}`}
				id={this._apiId}
				contentId={this.id}
				visible={this.visible}
				headerLevel={this.headerLevel}
				headerStyle={this.headerStyle}
				headerVisible={this.headerVisible}
				tabTitle={this.tabTitle}
				exportRequestSize={this.exportRequestSize}
				disableCopyToClipboard={this.disableCopyToClipboard}
				scrollThreshold={this.scrollThreshold}
				isSearchable={this.isSearchable}
				busy={this.busy}
				initialLoad={this.initialLoad}
				header={this.header}
				isAlp={this.isAlp}
				fieldMode={this.fieldMode}
				personalization={this.personalization}
				rowPressHandlerPath={this.rowPress}
				variantSavedHandlerPath={this.variantSaved}
				variantSelectedHandlerPath={this.variantSelected}
				variantManagement={this.variantManagement}
				ignoredFields={this.ignoredFields}
				tableDefinition={`{_pageModel>${this.tableDefinitionContext!.getPath()}}` as unknown as TableVisualization}
				entityTypeFullyQualifiedName={entityType?.fullyQualifiedName}
				metaPath={this.metaPath?.getPath()}
				useBasicSearch={this.useBasicSearch}
				enableFullScreen={this.enableFullScreen}
				enableExport={this.enableExport}
				frozenColumnCount={this.frozenColumnCount}
				enablePaste={this.enablePaste}
				rowCountMode={this.rowCountMode}
				rowCount={this.rowCount}
				contextPath={this.contextPath?.getPath()}
				selectionChange={this.selectionChange as unknown as Function}
				contextChange={this.onContextChange as unknown as Function}
				readOnly={this.readOnly}
				selectionMode={this.selectionMode}
				useCondensedLayout={this.useCondensedLayout}
				type={this.type}
				filterBar={this.filterBar}
				emptyRowsEnabled={this.getEmptyRowsEnabled() as unknown as boolean}
				enableAutoColumnWidth={this.enableAutoColumnWidth}
				beforeRebindTable={this.beforeRebindTable as unknown as Function}
				widthIncludingColumnHeader={this.widthIncludingColumnHeader}
				modeForNoDataMessage={this.modeForNoDataMessage}
			>
				{{
					customData: createCustomData("tableAPILocalId", this._apiId),
					creationMode: (
						<TableCreationOptions
							name={this.creationMode.name}
							createAtEnd={this.creationMode.createAtEnd}
							inlineCreationRowsHiddenInEditMode={this.creationMode.inlineCreationRowsHiddenInEditMode}
							outbound={this.creationMode.outbound}
						/>
					),
					layoutData: <FlexItemData maxWidth="100%" />,
					content: getMDCTableTemplate(tableProps, this.convertedMetadata, this.metaModel, handlerProvider, this.appComponent)
				}}
			</TableAPI>
		);
	}
}
