import type { EntitySet, EntityType, NavigationProperty, Property } from "@sap-ux/vocabularies-types";
import type { DataFieldAbstractTypes, DataFieldTypes, DataPointTypeTypes } from "@sap-ux/vocabularies-types/vocabularies/UI";
import Log from "sap/base/Log";
import deepClone from "sap/base/util/deepClone";
import { compileExpression, type CompiledBindingToolkitExpression } from "sap/fe/base/BindingToolkit";
import type { PropertiesOf, XMLEventHolder } from "sap/fe/base/ClassSupport";
import {
	aggregation,
	association,
	defineUI5Class,
	event,
	implementInterface,
	mixin,
	property,
	xmlEventHandler
} from "sap/fe/base/ClassSupport";
import { controllerExtensionHandler } from "sap/fe/base/HookSupport";
import jsx from "sap/fe/base/jsx-runtime/jsx";
import CommonUtils from "sap/fe/core/CommonUtils";
import type IRowBindingInterface from "sap/fe/core/IRowBindingInterface";
import type PageController from "sap/fe/core/PageController";
import type BuildingBlock from "sap/fe/core/buildingBlocks/BuildingBlock";
import { parseXMLString, xml } from "sap/fe/core/buildingBlocks/templating/BuildingBlockTemplateProcessor";
import NotApplicableContextDialog from "sap/fe/core/controllerextensions/editFlow/NotApplicableContextDialog";
import NavigationReason from "sap/fe/core/controllerextensions/routing/NavigationReason";
import Any from "sap/fe/core/controls/Any";
import * as MetaModelConverter from "sap/fe/core/converters/MetaModelConverter";
import { convertTypes, getInvolvedDataModelObjectEntityKeys, getInvolvedDataModelObjects } from "sap/fe/core/converters/MetaModelConverter";
import type { AnnotationTableColumn, TableColumn, TableType, TableVisualization } from "sap/fe/core/converters/controls/Common/Table";
import DeleteHelper from "sap/fe/core/helpers/DeleteHelper";
import type { InternalModelContext } from "sap/fe/core/helpers/ModelHelper";
import PasteHelper from "sap/fe/core/helpers/PasteHelper";
import ResourceModelHelper, { getResourceModel } from "sap/fe/core/helpers/ResourceModelHelper";
import type { RecommendationContextsInfo } from "sap/fe/core/helpers/StandardRecommendationHelper";
import { standardRecommendationHelper } from "sap/fe/core/helpers/StandardRecommendationHelper";
import type { WrappedCard } from "sap/fe/core/services/CollaborationManagerServiceFactory";
import type { RoutingNavigationParameters } from "sap/fe/core/services/RoutingServiceFactory";
import { generateVisibleExpression } from "sap/fe/core/templating/DataFieldFormatters";
import {
	getContextRelativeTargetObjectPath,
	getTargetObjectPath,
	type DataModelObjectPath
} from "sap/fe/core/templating/DataModelPathHelper";
import * as UIFormatters from "sap/fe/core/templating/UIFormatters";
import type { CollectionBindingInfo } from "sap/fe/macros/CollectionBindingInfo";
import MacroAPI from "sap/fe/macros/MacroAPI";
import type ISingleSectionContributor from "sap/fe/macros/controls/section/ISingleSectionContributor";
import type { ConsumerData } from "sap/fe/macros/controls/section/ISingleSectionContributor";
import * as FieldTemplating from "sap/fe/macros/field/FieldTemplating";
import FilterUtils from "sap/fe/macros/filter/FilterUtils";
import type FilterBarBBV4 from "sap/fe/macros/filterBar/FilterBar";
import type FilterBarAPI from "sap/fe/macros/filterBar/FilterBarAPI";
import SemanticDateOperators from "sap/fe/macros/filterBar/SemanticDateOperators";
import type { ControlState } from "sap/fe/macros/insights/CommonInsightsHelper";
import { hasInsightActionEnabled, showGenericErrorMessage } from "sap/fe/macros/insights/CommonInsightsHelper";
import type { InsightsParams, TableContent } from "sap/fe/macros/insights/InsightsService";
import * as InsightsService from "sap/fe/macros/insights/InsightsService";
import * as TableInsightsHelper from "sap/fe/macros/insights/TableInsightsHelper";
import type Action from "sap/fe/macros/table/Action";
import type ActionGroup from "sap/fe/macros/table/ActionGroup";
import type BasicSearch from "sap/fe/macros/table/BasicSearch";
import type Column from "sap/fe/macros/table/Column";
import type { TableBlockProperties } from "sap/fe/macros/table/MdcTableTemplate";
import * as MdcTableTemplate from "sap/fe/macros/table/MdcTableTemplate";
import type QuickFilterSelector from "sap/fe/macros/table/QuickFilterSelector";
import TableCreationOptions from "sap/fe/macros/table/TableCreationOptions";
import TableHelper from "sap/fe/macros/table/TableHelper";
import TableRuntime from "sap/fe/macros/table/TableRuntime";
import TableUtils from "sap/fe/macros/table/Utils";
import { convertPVToState } from "sap/fe/macros/table/adapter/TablePVToState";
import MassEdit from "sap/fe/macros/table/massEdit/MassEdit";
import type { PvProperties } from "sap/fe/navigation/PresentationVariant";
import PresentationVariant from "sap/fe/navigation/PresentationVariant";
import type SelectionVariant from "sap/fe/navigation/SelectionVariant";
import type { CardManifest, CardMessage } from "sap/insights/CardHelper";
import type Dialog from "sap/m/Dialog";
import IllustratedMessage from "sap/m/IllustratedMessage";
import IllustratedMessageType from "sap/m/IllustratedMessageType";
import type Menu from "sap/m/Menu";
import MessageBox from "sap/m/MessageBox";
import MessageToast from "sap/m/MessageToast";
import Text from "sap/m/Text";
import type { DataStateIndicator$DataStateChangeEvent } from "sap/m/plugins/DataStateIndicator";
import type { PasteProvider$PasteEvent } from "sap/m/plugins/PasteProvider";
import type { default as Event, default as UI5Event } from "sap/ui/base/Event";
import type ManagedObject from "sap/ui/base/ManagedObject";
import type Control from "sap/ui/core/Control";
import type { $ControlSettings } from "sap/ui/core/Control";
import UI5Element from "sap/ui/core/Element";
import Fragment from "sap/ui/core/Fragment";
import Library from "sap/ui/core/Lib";
import Messaging from "sap/ui/core/Messaging";
import type DragDropInfo from "sap/ui/core/dnd/DragDropInfo";
import type { TitleLevel } from "sap/ui/core/library";
import Message from "sap/ui/core/message/Message";
import type MessageType from "sap/ui/core/message/MessageType";
import XMLPreprocessor from "sap/ui/core/util/XMLPreprocessor";
import type FilterBar from "sap/ui/mdc/FilterBar";
import type { default as MDCTable, default as Table, Table$BeforeExportEvent, Table$BeforeOpenContextMenuEvent } from "sap/ui/mdc/Table";
import type TableDelegate from "sap/ui/mdc/TableDelegate";
import type ActionToolbarAction from "sap/ui/mdc/actiontoolbar/ActionToolbarAction";
import type { GroupLevels, Items, Sorters } from "sap/ui/mdc/p13n/StateUtil";
import StateUtil from "sap/ui/mdc/p13n/StateUtil";
import type MDCColumn from "sap/ui/mdc/table/Column";
import type { PropertyInfo } from "sap/ui/mdc/util/PropertyHelper";
import Filter from "sap/ui/model/Filter";
import type JSONModel from "sap/ui/model/json/JSONModel";
import type Context from "sap/ui/model/odata/v4/Context";
import type ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import type ODataMetaModel from "sap/ui/model/odata/v4/ODataMetaModel";
import type ODataModel from "sap/ui/model/odata/v4/ODataModel";
import DelegateUtil from "../DelegateUtil";
import StateHelper from "../mdc/adapter/StateHelper";
import TableEventHandlerProvider from "./TableEventHandlerProvider";
import ContextMenuHandler from "./mixin/ContextMenuHandler";
import EmptyRowsHandler from "./mixin/EmptyRowsHandler";
import TableAPIStateHandler from "./mixin/TableAPIStateHandler";
import TableExport from "./mixin/TableExport";
import TableHierarchy from "./mixin/TableHierarchy";
import TableOptimisticBatch from "./mixin/TableOptimisticBatch";

type FilteredColumn = {
	columnName: string;
	sTextArrangement: string;
	sColumnNameVisible: boolean;
};

type TableKey = {
	headerInfoTitlePath: string | undefined;
	filteredTechnicalKeys: string[];
	semanticKeyColumns: string[];
	aFilteredColummns: FilteredColumn[];
};

type DataModelConversion = {
	dataModelPath: DataModelObjectPath<DataFieldAbstractTypes | DataPointTypeTypes | Property>;
	convertedtargetObject: DataFieldAbstractTypes | DataPointTypeTypes;
};

export type TableColumnProperties = {
	key: string;
	visibility: boolean;
}[];

type SortConditions = {
	sorters: {
		name: string;
		descending: boolean;
	}[];
};

export type DynamicVisibilityForColumn = { columnKey: string; visible: boolean };

export type TableState = {
	innerTable?: {
		initialState?: {
			items?: { name: string }[];
			supplementaryConfig?: object;
		};
		fullState?: {
			items?: { name: string }[];
			filter?: object;
		};
	};
	quickFilter?: {
		selectedKey?: string;
	};
	variantManagement?: {
		variantId?: string | null;
	};
	supplementaryConfig?: object;
};

export interface ITableBlock extends BuildingBlock {
	metaPath: string;
	contextPath?: string;
	emptyRowsEnabled: boolean;
	getContent(): Table;
	getTableDefinition(): TableVisualization;
	getSelectedContexts(): Context[];
}

interface TableAPI extends TableAPIStateHandler, TableExport, TableOptimisticBatch, TableHierarchy, EmptyRowsHandler, ContextMenuHandler {
	// aggregation
	getContent(): MDCTable;
	// association
	getFilterBar(): string;
	// property
	getDataInitialized(): boolean;
}

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
 * @private
 */

@defineUI5Class("sap.fe.macros.table.TableAPI", { returnTypes: ["sap.fe.macros.MacroAPI"] })
@mixin(TableAPIStateHandler)
@mixin(TableExport)
@mixin(TableOptimisticBatch)
@mixin(TableHierarchy)
@mixin(EmptyRowsHandler)
@mixin(ContextMenuHandler)
class TableAPI extends MacroAPI implements ISingleSectionContributor, IRowBindingInterface, ITableBlock {
	content!: Table;

	massEdit: MassEdit | undefined;

	originalTableDefinition!: TableVisualization;

	propertyEditModeCache: Record<string, typeof Any> = {};

	propertyUIHiddenCache: Record<string, typeof Any> = {};

	initialControlState: Record<string, unknown> = {};

	constructor(mSettings?: PropertiesOf<TableAPI> & { id?: string }, ...others: $ControlSettings[]) {
		super(mSettings, ...others);
		this.originalTableDefinition = this.tableDefinition;

		this.attachFilterBarAndEvents();
		this.setupOptimisticBatch();
		this.setUpNoDataInformation();
		this.attachStateChangeHandler();
	}

	@implementInterface("sap.fe.core.IRowBindingInterface")
	__implements__sap_fe_core_IRowBindingInterface = true;

	getRowBinding(): ODataListBinding {
		const mdcTable = this.content;
		const dataModel = mdcTable.getModel();
		return mdcTable.getRowBinding() ?? (dataModel?.bindList(this.getRowCollectionPath()) as ODataListBinding);
	}

	private attachStateChangeHandler(): void {
		StateUtil.detachStateChange(this.stateChangeHandler);
		StateUtil.attachStateChange(this.stateChangeHandler);
	}

	stateChangeHandler(oEvent: Event<{ control: Control }>): void {
		const control = oEvent.getParameter("control");
		if (control.isA<Table>("sap.ui.mdc.Table")) {
			const tableAPI = control.getParent() as unknown as { handleStateChange?: Function };
			if (tableAPI?.handleStateChange) {
				tableAPI.handleStateChange();
			}
		}
	}

	private attachFilterBarAndEvents(): void {
		this.updateFilterBar();

		if (this.content) {
			this.content.attachEvent("selectionChange", {}, this.onTableSelectionChange, this);
		}
	}

	/**
	 * Sets an illustrated message during the initialisation of the table API.
	 * Useful if we have a building block in a list report without initial load.
	 * @private
	 */
	private setUpNoDataInformation(): void {
		const table = this.content;
		if (!table || table.getNoData()) {
			return;
		}
		const owner = this._getOwner();
		let description;
		let title;
		if (owner) {
			const resourceModel = getResourceModel(owner);
			if (resourceModel) {
				let suffix;
				const metaPath = this.metaPath;
				if (metaPath) {
					suffix = metaPath.startsWith("/") ? metaPath.substring(1) : metaPath;
				}
				title = resourceModel.getText("T_ILLUSTRATED_MESSAGE_TITLE_BEFORESEARCH");
				description = resourceModel.getText("T_TABLE_AND_CHART_NO_DATA_TEXT", undefined, suffix);
			}
		} else {
			const resourceBundle = Library.getResourceBundleFor("sap.fe.templates")!;
			title = resourceBundle.getText("T_ILLUSTRATED_MESSAGE_TITLE_BEFORESEARCH");
			description = resourceBundle.getText("T_TABLE_AND_CHART_NO_DATA_TEXT");
		}

		if (this.modeForNoDataMessage === "text") {
			this.setAggregation("noData", new Text({ text: description }));
		} else {
			const illustratedMessage = new IllustratedMessage({
				title: title,
				description: description,
				illustrationType: IllustratedMessageType.BeforeSearch,
				illustrationSize: this.modeForNoDataMessage,
				enableDefaultTitleAndDescription: false
			});

			this.setAggregation("noData", illustratedMessage);
		}
	}

	@implementInterface("sap.fe.macros.controls.section.ISingleSectionContributor")
	__implements__sap_fe_macros_controls_section_ISingleSectionContributor = true;

	getSectionContentRole(): "provider" | "consumer" {
		return "consumer";
	}

	/**
	 * Implementation of the sendDataToConsumer method which is a part of the ISingleSectionContributor
	 *
	 * Will be called from the sap.fe.macros.controls.Section control when there is a Table building block rendered within a section
	 * along with the consumerData i.e. section's data such as title and title level which is then applied to the table using the implementation below accordingly.
	 *
	 */

	sendDataToConsumer(consumerData: ConsumerData): void {
		if (this.content?.isA<Table>("sap.ui.mdc.Table")) {
			this.content?.setHeader(consumerData.title);
			this.content?.setHeaderStyle("H4");
			this.content?.setHeaderLevel(consumerData.titleLevel as TitleLevel);
		}
	}

	@property({
		type: "string",
		expectedTypes: ["EntitySet", "EntityType", "Singleton", "NavigationProperty"],
		expectedAnnotations: [
			"com.sap.vocabularies.UI.v1.LineItem",
			"com.sap.vocabularies.UI.v1.PresentationVariant",
			"com.sap.vocabularies.UI.v1.SelectionPresentationVariant"
		],
		required: true
	})
	metaPath!: string;

	@property({
		type: "string",
		expectedTypes: ["EntitySet", "EntityType", "Singleton", "NavigationProperty"]
	})
	contextPath!: string;

	@property({ type: "object" })
	tableDefinition!: TableVisualization;

	@property({ type: "string" })
	contentId!: string;

	@property({ type: "string" })
	entityTypeFullyQualifiedName!: string;

	@property({ type: "boolean" })
	enableFullScreen?: boolean;

	@property({ type: "boolean" })
	enableExport?: boolean;

	@property({ type: "int" })
	frozenColumnCount?: number;

	@property({ type: "string", allowedValues: ["Auto", "Fixed"] })
	rowCountMode?: string;

	@property({ type: "int" })
	rowCount?: number;

	@property({ type: "boolean" })
	enablePaste?: boolean | CompiledBindingToolkitExpression;

	@property({ type: "boolean" })
	disableCopyToClipboard?: boolean;

	@property({ type: "int" })
	scrollThreshold?: number;

	@property({ type: "boolean" })
	isSearchable?: boolean;

	@property({ type: "string", allowedValues: ["GridTable", "ResponsiveTable", "AnalyticalTable"] })
	type?: TableType;

	@property({ type: "boolean" })
	useCondensedLayout?: boolean;

	@property({ type: "string", allowedValues: ["None", "Single", "Multi", "Auto", "ForceMulti", "ForceSingle"] })
	selectionMode?: string;

	@aggregation({
		type: "sap.fe.macros.table.Action",
		altTypes: ["sap.fe.macros.table.ActionGroup"],
		multiple: true
	})
	actions?: (Action | ActionGroup)[];

	@aggregation({
		type: "sap.fe.macros.table.Column",
		multiple: true
	})
	columns?: Column[];

	/**
	 * An expression that allows you to control the 'read-only' state of the table.
	 *
	 * If you do not set any expression, SAP Fiori elements hooks into the standard lifecycle to determine the current state.
	 */
	@property({ type: "boolean" })
	readOnly!: boolean;

	/**
	 * ID of the FilterBar building block associated with the table.
	 */
	@association({ type: "sap.fe.macros.filterBar.FilterBarAPI" })
	filterBar?: string;

	/**
	 * Specifies if the column width is automatically calculated.
	 */
	@property({ type: "boolean", defaultValue: true })
	enableAutoColumnWidth!: boolean;

	/**
	 * Indicates if the column header should be a part of the width calculation.
	 */
	@property({ type: "boolean", defaultValue: false })
	widthIncludingColumnHeader?: boolean;

	/**
	 * Shows a text instead of an IllustratedMessage in the noData aggregation of the Table
	 */
	@property({
		type: "string",
		defaultValue: "Auto",
		allowedValues: ["Auto", "Base", "Dialog", "Dot", "Scene", "Spot", "text"]
	})
	modeForNoDataMessage?: string;

	@property({ type: "boolean", defaultValue: false })
	dataInitialized!: boolean;

	@property({ type: "boolean", defaultValue: false })
	bindingSuspended!: boolean;

	@property({ type: "boolean", defaultValue: false })
	outDatedBinding!: boolean;

	@property({ type: "boolean", defaultValue: false })
	isAlp!: boolean;

	@property({ type: "string" })
	variantManagement?: string;

	@property({ type: "string" })
	ignoredFields?: string;

	@property({ type: "boolean" })
	busy?: boolean;

	@property({ type: "boolean", defaultValue: true })
	visible?: boolean;

	@property({ type: "string" })
	id!: string;

	@property({ type: "string" })
	fieldMode?: string;

	@property({ type: "sap.ui.core.TitleLevel" })
	headerLevel!: TitleLevel;

	@property({ type: "sap.ui.core.TitleLevel" })
	headerStyle?: TitleLevel;

	@property({ type: "int" })
	exportRequestSize?: number;

	@property({ type: "boolean" })
	initialLoad?: boolean;

	/**
	 * Controls which options should be enabled for the table personalization dialog.
	 *
	 * If it is set to `true`, all possible options for this kind of table are enabled.<br/>
	 * If it is set to `false`, personalization is disabled.<br/>
	 *<br/>
	 * You can also provide a more granular control for the personalization by providing a comma-separated list with the options you want to be available.<br/>
	 * Available options are:<br/>
	 *  - Sort<br/>
	 *  - Column<br/>
	 *  - Filter<br/>
	 *
	 */
	@property({ type: "string" })
	personalization?: string;

	/**
	 * Specifies the header text that is shown in the table.
	 *
	 */
	@property({ type: "string" })
	header?: string;

	@property({ type: "boolean" })
	useBasicSearch?: boolean;

	/**
	 * Specifies if the empty rows are enabled. This allows to have dynamic enablement of the empty rows using the setter function.
	 */
	@property({ type: "boolean", defaultValue: false })
	emptyRowsEnabled!: boolean;

	@property({ type: "string" })
	rowPressHandlerPath?: string;

	@property({ type: "string" })
	variantSavedHandlerPath?: string;

	@property({ type: "string" })
	variantSelectedHandlerPath?: string;

	@property({ type: "string" })
	onSegmentedButtonPressedHandlerPath?: string;

	/**
	 * Controls if the header text should be shown or not.
	 *
	 */
	@property({ type: "boolean", isBindingInfo: true })
	headerVisible?: boolean;

	@property({ type: "string" })
	tabTitle?: string;

	@aggregation({ type: "sap.fe.macros.table.TableCreationOptions", defaultClass: TableCreationOptions })
	creationMode!: TableCreationOptions;

	/**
	 * Aggregation to forward the IllustratedMessage control to the mdc control.
	 * @public
	 */
	@aggregation({
		type: "sap.m.IllustratedMessage",
		altTypes: ["sap.m.Text"],
		forwarding: {
			getter: "getMDCTable",
			aggregation: "noData"
		}
	})
	noData?: IllustratedMessage;

	/**
	 * An event is triggered when the table is about to be rebound. This event contains information about the binding info.
	 *
	 * You can use this event to add or read: Filters, Sorters.
	 * You can use this event to read the binding info.
	 * You can use this event to add: Selects.
	 */
	@event()
	beforeRebindTable?: Function;

	/**
	 * An event is triggered when the user chooses a row; the event contains information about which row is chosen.
	 *
	 * You can set this in order to handle the navigation manually.
	 */
	@event()
	rowPress!: Function;

	/**
	 * An event is triggered when the user switched between view in an ALP.
	 */
	@event()
	segmentedButtonPress?: Function;

	/**
	 * An event is triggered when the user saved the variant.
	 */
	@event()
	variantSaved?: Function;

	/**
	 * An event is triggered when the user selected a variant.
	 */
	@event()
	variantSelected?: Function;

	/**
	 * An event triggered when the Table context changes.
	 */
	@event()
	contextChange?: Function;

	@event()
	internalDataRequested!: Function;

	private dynamicVisibilityForColumns: DynamicVisibilityForColumn[] = [];

	private lock: Record<string, boolean> = {};

	/**
	 * Gets the relevant tableAPI for a UI5 event.
	 * An event can be triggered either by the inner control (the table) or the Odata listBinding
	 * The first initiator is the usual one so it's managed by the MacroAPI whereas
	 * the second one is specific to this API and has to managed by the TableAPI.
	 * @param source The UI5 event source
	 * @returns The TableAPI or false if not found
	 * @private
	 */
	static _getAPIExtension(source: ManagedObject): TableAPI | undefined {
		let tableAPI: TableAPI | undefined;
		if (source.isA<ODataListBinding>("sap.ui.model.odata.v4.ODataListBinding")) {
			tableAPI = ((this as unknown as XMLEventHolder).instanceMap?.get(this) as TableAPI[])?.find(
				(api) => api.content?.getRowBinding?.() === source || api.content?.getBinding("items") === source
			);
		}
		return tableAPI;
	}

	/**
	 * Get the sort conditions query string.
	 * @returns The sort conditions query string
	 */
	getSortConditionsQuery(): string {
		const table = this.content;
		const sortConditions = (table.getSortConditions() as SortConditions)?.sorters;
		return sortConditions
			? sortConditions
					.map(function (sortCondition) {
						const sortConditionsPath = table.getPropertyHelper().getProperty(sortCondition.name)?.path;
						if (sortConditionsPath) {
							return `${sortConditionsPath}${sortCondition.descending ? " desc" : ""}`;
						}
						return "";
					})
					.join(",")
			: "";
	}

	/**
	 * Gets contexts from the table that have been selected by the user.
	 * @returns Contexts of the rows selected by the user
	 * @public
	 */
	getSelectedContexts(): Context[] {
		// When a context menu item has been pressed, the selectedContexts correspond to the items on which
		// the corresponding action shall be applied.
		return this.isContextMenuActive()
			? this.getBindingContext("internal")?.getProperty("contextmenu/selectedContexts") ?? []
			: this.content.getSelectedContexts();
	}

	/**
	 * Adds a message to the table.
	 *
	 * The message applies to the whole table and not to an individual table row.
	 * @param [parameters] The parameters to create the message
	 * @param parameters.type Message type
	 * @param parameters.message Message text
	 * @param parameters.description Message description
	 * @param parameters.persistent True if the message is persistent
	 * @returns The ID of the message
	 * @public
	 */
	addMessage(parameters: { type?: MessageType; message?: string; description?: string; persistent?: boolean }): string {
		const msgManager = this._getMessageManager();

		const oTable = this.getContent();

		const oMessage = new Message({
			target: oTable.getRowBinding().getResolvedPath(),
			type: parameters.type,
			message: parameters.message,
			processor: oTable.getModel(),
			description: parameters.description,
			persistent: parameters.persistent
		});

		msgManager.addMessages(oMessage);
		return oMessage.getId();
	}

	/**
	 * This function will check if the table should request recommendations function.
	 * The table in view should only request recommendations if
	 * 1. The Page is in Edit mode
	 * 2. Table is not read only
	 * 3. It has annotation for Common.RecommendedValuesFunction
	 * 4. View is not ListReport, for OP/SubOP and forward views recommendations should be requested.
	 * @param _oEvent
	 * @returns True if recommendations needs to be requested
	 */
	checkIfRecommendationRelevant(_oEvent: UI5Event): boolean {
		const isTableReadOnly = this.getProperty("readOnly");
		const isEditable = CommonUtils.getIsEditable(this);
		const view = CommonUtils.getTargetView(this);
		const viewData = view.getViewData();
		// request for action only if we are in OP/SubOP and in Edit mode, also table is not readOnly
		if (!isTableReadOnly && isEditable && viewData.converterType !== "ListReport") {
			return true;
		}
		return false;
	}

	/**
	 * Removes a message from the table.
	 * @param id The id of the message
	 * @public
	 */
	removeMessage(id: string): void {
		const msgManager = this._getMessageManager();
		const messages = msgManager.getMessageModel().getData();
		const result = messages.find((e: Message) => e.getId() === id);
		if (result) {
			msgManager.removeMessages(result);
		}
	}

	/**
	 * Requests a refresh of the table.
	 * @public
	 */
	refresh(): void {
		const tableRowBinding = this.content.getRowBinding();
		if (tableRowBinding && (tableRowBinding.isRelative() || this.getTableDefinition().control.type === "TreeTable")) {
			// For tree tables, the refresh is always done using side effects to preserve expansion states
			const appComponent = CommonUtils.getAppComponent(this.content);
			const headerContext = tableRowBinding.getHeaderContext();

			if (headerContext) {
				appComponent
					.getSideEffectsService()
					.requestSideEffects([{ $NavigationPropertyPath: "" }], headerContext, tableRowBinding.getGroupId());
			}
		} else {
			tableRowBinding?.refresh();
		}
	}

	getQuickFilter(): QuickFilterSelector | undefined {
		return this.content.getQuickFilter() as QuickFilterSelector | undefined;
	}

	/**
	 * Get the presentation variant that is currently applied on the table.
	 * @returns The presentation variant applied to the table
	 * @throws An error if used for a tree or analytical table
	 * @public
	 */
	async getPresentationVariant(): Promise<PresentationVariant> {
		try {
			const table = this.content;
			const tableState = await StateUtil.retrieveExternalState(table);

			//We remove "Property::" as it is prefixed to those columns that have associated propertyInfos.
			//The Presentation Variant format does not support this (it is only required by the Table and AppState).
			const sortOrder = tableState.sorters?.map((sorter: Sorters) => {
				return {
					Property: sorter.name.replace("Property::", ""),
					Descending: sorter.descending ?? false
				};
			});
			const groupLevels = tableState.groupLevels?.map((group: GroupLevels) => {
				return group.name.replace("Property::", "");
			});
			const tableViz = {
				Content: tableState.items?.map((item: Items) => {
					return {
						Value: item.name
					};
				}),
				Type: "LineItem"
			};
			const aggregations: Record<string, { aggregated?: boolean }> = {};
			let hasAggregations = false;
			for (const key in tableState.aggregations) {
				const newKey = key.replace("Property::", "");
				aggregations[newKey] = tableState.aggregations[key];
				hasAggregations = true;
			}
			const initialExpansionLevel = (table.getPayload() as { initialExpansionLevel?: number; hierarchyQualifier?: string })
				?.initialExpansionLevel;
			const tablePV = new PresentationVariant();
			tablePV.setTableVisualization(tableViz);
			const properties: PvProperties = {
				GroupBy: groupLevels || [],
				SortOrder: sortOrder || []
			};
			if (hasAggregations) {
				properties.Aggregations = aggregations;
			}
			if (initialExpansionLevel) {
				properties.initialExpansionLevel = initialExpansionLevel;
			}
			tablePV.setProperties(properties);
			return tablePV;
		} catch (error) {
			const id = this.getId();
			const message = error instanceof Error ? error.message : String(error);
			Log.error(`Table Building Block (${id}) - get presentation variant failed : ${message}`);
			throw Error(error as string);
		}
	}

	/**
	 * Set a new presentation variant to the table.
	 * @param tablePV The new presentation variant that is to be set on the table.
	 * @throws An error if used for a tree or analytical table
	 * @public
	 */
	async setPresentationVariant(tablePV: PresentationVariant): Promise<void> {
		try {
			const table = this.content;

			const currentStatePV = await this.getPresentationVariant();
			const propertyInfos = await (table.getControlDelegate() as typeof TableDelegate).fetchProperties(table);
			const propertyInfoNames = propertyInfos.map((propInfo: { [x: string]: string }) => propInfo.name);
			const newTableState = convertPVToState(tablePV, currentStatePV, propertyInfoNames);
			const tableProperties = tablePV.getProperties();
			if (tableProperties?.initialExpansionLevel !== undefined) {
				const tablePayload = table.getPayload() as { initialExpansionLevel?: number; hierarchyQualifier?: string };
				tablePayload.initialExpansionLevel = tableProperties.initialExpansionLevel;
			}
			await StateUtil.applyExternalState(table, newTableState);
		} catch (error) {
			const id = this.getId();
			const message = error instanceof Error ? error.message : String(error);
			Log.error(`Table Building Block (${id}) - set presentation variant failed : ${message}`);
			throw Error(message);
		}
	}

	/**
	 * Get the variant management applied to the table.
	 * @returns Key of the currently selected variant. In case the model is not yet set, `null` will be returned.
	 * @public
	 */
	getCurrentVariantKey(): string | null {
		return this.content.getVariant()?.getCurrentVariantKey();
	}

	/**
	 * Set a variant management to the table.
	 * @param key Key of the variant that should be selected. If the passed key doesn't identify a variant, it will be ignored.
	 * @public
	 */
	setCurrentVariantKey(key: string): void {
		const variantManagement = this.content.getVariant();
		variantManagement.setCurrentVariantKey(key);
	}

	_getMessageManager(): Messaging {
		return Messaging;
	}

	/**
	 * An event triggered when the selection in the table changes.
	 */
	@event()
	selectionChange?: Function;

	_getRowBinding(): ODataListBinding {
		const oTable = this.getContent();
		return oTable.getRowBinding();
	}

	async getCounts(): Promise<string> {
		const oTable = this.getContent();
		return TableUtils.getListBindingForCount(oTable, oTable.getBindingContext(), {
			batchGroupId: !this.getProperty("bindingSuspended") ? oTable.data("batchGroupId") : "$auto",
			additionalFilters: TableUtils.getHiddenFilters(oTable)
		})
			.then((iValue: number) => {
				return TableUtils.getCountFormatted(iValue);
			})
			.catch(() => {
				return "0";
			});
	}

	/**
	 * Handles the context change on the table.
	 * An event is fired to propagate the OdataListBinding event and the enablement
	 * of the creation row is calculated.
	 * @param ui5Event The UI5 event
	 */
	@xmlEventHandler()
	onContextChange(ui5Event: UI5Event): void {
		this.fireEvent("contextChange", ui5Event.getParameters());
		this.setFastCreationRowEnablement();
		this.getQuickFilter()?.refreshSelectedCount();
		TableRuntime.setContextsAsync(this.content);
	}

	/**
	 * Handler for the onFieldLiveChange event.
	 * @param ui5Event The event object passed by the onFieldLiveChange event
	 */
	@xmlEventHandler()
	onFieldLiveChange(ui5Event: UI5Event<{}, Control>): void {
		// We can't fully move an xmlEventHandler to a mixin...
		this._onFieldLiveChange(ui5Event);
	}

	/**
	 * Handles the change on a quickFilter
	 * The table is rebound if the FilterBar is not suspended and update the AppState.
	 *
	 */
	@xmlEventHandler()
	onQuickFilterSelectionChange(): void {
		const table = this.content;
		// Rebind the table to reflect the change in quick filter key.
		// We don't rebind the table if the filterBar for the table is suspended
		// as rebind will be done when the filterBar is resumed
		const filterBarID = table.getFilter();
		const filterBar = (filterBarID && UI5Element.getElementById(filterBarID)) as FilterBar | undefined;
		if (!filterBar?.getSuspendSelection?.()) {
			table.rebind();
		}
		(CommonUtils.getTargetView(this)?.getController() as PageController | undefined)?.getExtensionAPI().updateAppState();
	}

	@xmlEventHandler()
	onTableRowPress(oEvent: UI5Event, oController: PageController, oContext: Context, mParameters: object): boolean | undefined {
		if (this.isTableRowNavigationPossible(oContext)) {
			if (this.fullScreenDialog) {
				// Exit fullscreen mode before navigation
				this.fullScreenDialog.close(); // The fullscreendialog will set this.fullScreenDialog to undefined when closing
			}
			const navigationParameters = Object.assign({}, mParameters, { reason: NavigationReason.RowPress });
			oController._routing.navigateForwardToContext(oContext, navigationParameters);
		} else {
			return false;
		}
	}

	isTableRowNavigationPossible(context: Context): boolean {
		// prevent navigation to an empty row
		const emptyRow = context.isInactive() == true && context.isTransient() === true;
		// Or in the case of an analytical table, if we're trying to navigate to a context corresponding to a visual group or grand total
		// --> Cancel navigation
		const analyticalGroupHeaderExpanded =
			this.getTableDefinition().enableAnalytics === true &&
			context.isA("sap.ui.model.odata.v4.Context") &&
			typeof context.getProperty("@$ui5.node.isExpanded") === "boolean";
		return !(emptyRow || analyticalGroupHeaderExpanded);
	}

	@xmlEventHandler()
	onOpenInNewTabPress(
		oEvent: UI5Event,
		controller: PageController,
		contexts: Context[],
		parameters: RoutingNavigationParameters,
		maxNumberofSelectedItems: number
	): void | boolean {
		if (contexts.length <= maxNumberofSelectedItems) {
			// eslint-disable-next-line @typescript-eslint/no-this-alias
			const that = this;
			contexts.forEach(async function (context: Context) {
				if (that.isTableRowNavigationPossible(context)) {
					parameters.editable = !context.getProperty("IsActiveEntity");
					await controller._routing.navigateForwardToContext(context, parameters);
				} else {
					return false;
				}
			});
		} else {
			MessageBox.warning(
				Library.getResourceBundleFor("sap.fe.macros")!.getText("T_TABLE_NAVIGATION_TOO_MANY_ITEMS_SELECTED", [
					maxNumberofSelectedItems
				])
			);
		}
	}

	@xmlEventHandler()
	onInternalPatchCompleted(): void {
		// BCP: 2380023090
		// We handle enablement of Delete for the table here.
		// EditFlow.ts#handlePatchSent is handling the action enablement.
		const internalModelContext = this.getBindingContext("internal") as InternalModelContext;
		const selectedContexts = this.getSelectedContexts();
		DeleteHelper.updateDeleteInfoForSelectedContexts(internalModelContext, selectedContexts);
	}

	@xmlEventHandler()
	onInternalDataReceived(oEvent: UI5Event<{ error: string }, ODataListBinding>): void {
		const isRecommendationRelevant = this.checkIfRecommendationRelevant(oEvent);
		if (isRecommendationRelevant) {
			const contextIdentifier = this.getIdentifierColumn(isRecommendationRelevant) as string[];
			const responseContextsArray = oEvent.getSource().getAllCurrentContexts();
			const newContexts: RecommendationContextsInfo[] = [];
			responseContextsArray.forEach((context) => {
				newContexts.push({
					context,
					contextIdentifier
				});
			});
			this.getController().recommendations.fetchAndApplyRecommendations(newContexts, true);
		}
		if (oEvent.getParameter("error")) {
			this.getController().messageHandler.showMessageDialog({ control: this });
		} else {
			this.getController().messageHandler.releaseHoldByControl(this);
			this.setDownloadUrl();
		}
	}

	@controllerExtensionHandler("collaborationManager", "collectAvailableCards")
	async collectAvailableCards(cards: WrappedCard[]): Promise<void> {
		const actionToolbarItems = this.content.getActions() as ActionToolbarAction[];
		if (hasInsightActionEnabled(actionToolbarItems, this.content.getFilter(), TableInsightsHelper.getInsightsRelevantColumns(this))) {
			const card = await this.getCardManifestTable();
			if (Object.keys(card).length > 0) {
				cards.push({
					card: card,
					title: (this.getTableDefinition().headerInfoTypeName as string | undefined) ?? "",
					callback: this.onAddCardToCollaborationManagerCallback.bind(this)
				});
			}
		}
	}

	@xmlEventHandler()
	onInternalDataRequested(oEvent: UI5Event): void {
		this.setProperty("dataInitialized", true);
		this.fireEvent("internalDataRequested", oEvent.getParameters());
		if (this.getQuickFilter() !== undefined && this.getTableDefinition().control.filters?.quickFilters?.showCounts === true) {
			this.getQuickFilter()?.setCountsAsLoading();
			this.getQuickFilter()?.refreshUnSelectedCounts();
		}
		this.getController().messageHandler.holdMessagesForControl(this);
	}

	/**
	 * Handles the Paste operation.
	 * @param evt The event
	 * @param controller The page controller
	 * @param forContextMenu
	 */
	@xmlEventHandler()
	async onPaste(evt: PasteProvider$PasteEvent, controller: PageController, forContextMenu = false): Promise<void> {
		const rawPastedData = evt.getParameter("data"),
			source = evt.getSource();
		let table: Table;
		if (!forContextMenu) {
			// table toolbar
			table = (source.isA("sap.ui.mdc.Table") ? source : (source as Control).getParent()) as Table;
		} else {
			// context menu
			const menu = (source.isA("sap.m.Menu") ? source : (source as Control).getParent()) as Menu;
			table = menu.getParent()?.getParent() as Table;
		}
		const internalContext = table.getBindingContext("internal") as InternalModelContext | null;

		// If paste is disabled or if we're not in edit mode in an ObjectPage, we can't paste anything
		if (!this.tableDefinition.control.enablePaste || (table.getRowBinding().isRelative() && !CommonUtils.getIsEditable(this))) {
			return;
		}

		//This code is executed only in case of TreeTable
		if (internalContext?.getProperty("pastableContexts")) {
			let targetContext = internalContext.getProperty("pastableContexts")[0] as Context | undefined;
			const newParentContext = !forContextMenu
				? (table.getSelectedContexts()[0] as Context)
				: (internalContext?.getProperty("contextmenu/selectedContexts")[0] as Context);
			// If the targetContext has been disassociated from the table due to expand and collapse actions, we attempt to retrieve it using its path.
			targetContext = table
				.getRowBinding()
				.getCurrentContexts()
				.find((context) => context.getPath() === targetContext?.getPath());

			if (!targetContext) {
				Log.error("The Cut operation is unsuccessful because the relevant context is no longer available");
			} else {
				try {
					await Promise.all([
						targetContext.move({ parent: newParentContext ?? null }),
						this.requestSideEffectsForChangeNextSiblingAction()
					]);
				} catch (error: unknown) {
					MessageToast.show(this.getTranslatedText("M_TABLEDROP_FAILED", [(error as Error).message ?? ""]));
				}
				internalContext.setProperty("pastableContexts", []);
				return;
			}
		}

		//This code is executed for tables excepted TreeTable
		if (table.getEnablePaste() === true && !forContextMenu) {
			const cellSelection = table.getCellSelector()?.getSelection();
			if (cellSelection?.columns.length > 0) {
				PasteHelper.pasteRangeData(rawPastedData ?? [], cellSelection, table);
			} else {
				PasteHelper.pasteData(rawPastedData ?? [], table, controller);
			}
		} else {
			const resourceBundle = Library.getResourceBundleFor("sap.fe.core")!;
			MessageBox.error(resourceBundle.getText("T_OP_CONTROLLER_SAPFE_PASTE_DISABLED_MESSAGE"), {
				title: resourceBundle.getText("C_COMMON_SAPFE_ERROR")
			});
		}
	}

	/**
	 * Handles the Cut operation.
	 * @param evt The UI5 event
	 * @param forContextMenu
	 */
	@xmlEventHandler()
	onCut(evt: UI5Event<{}, UI5Element>, forContextMenu = false): void {
		// We can't fully move an xmlEventHandler to a mixin...
		this._onCut(evt, forContextMenu);
	}

	// This event will allow us to intercept the export before is triggered to cover specific cases
	// that couldn't be addressed on the propertyInfos for each column.
	// e.g. Fixed Target Value for the datapoints
	@xmlEventHandler()
	onBeforeExport(exportEvent: Table$BeforeExportEvent): void {
		// We can't fully move an xmlEventHandler to a mixin...
		this._onBeforeExport(exportEvent);
	}

	/**
	 * Handles the MDC DataStateIndicator plugin to display messageStrip on a table.
	 * @param message
	 * @param control
	 * @returns Whether to render the messageStrip visible
	 */
	dataStateIndicatorFilter(message: Message, control: Control): boolean {
		const mdcTable = control as MDCTable;
		const sTableContextBindingPath = mdcTable.getBindingContext()?.getPath();
		const sTableRowBinding = (sTableContextBindingPath ? `${sTableContextBindingPath}/` : "") + mdcTable.getRowBinding().getPath();
		return sTableRowBinding === message.getTargets()[0] ? true : false;
	}

	/**
	 * This event handles the DataState of the DataStateIndicator plugin from MDC on a table.
	 * It's fired when new error messages are sent from the backend to update row highlighting.
	 * @param evt Event object
	 */
	@xmlEventHandler()
	onDataStateChange(evt: DataStateIndicator$DataStateChangeEvent): void {
		const dataStateIndicator = evt.getSource();
		const filteredMessages = evt.getParameter("filteredMessages") as Message[];
		if (filteredMessages) {
			const hiddenMandatoryProperties = filteredMessages
				.map((msg) => {
					const technicalDetails = (msg.getTechnicalDetails() || {}) as {
						tableId?: string;
						emptyRowMessage?: boolean;
						missingColumn?: string;
					};
					return technicalDetails.emptyRowMessage === true && technicalDetails.missingColumn;
				})
				.filter((hiddenProperty) => !!hiddenProperty);
			if (hiddenMandatoryProperties.length) {
				const messageStripError = Library.getResourceBundleFor("sap.fe.macros")!.getText(
					hiddenMandatoryProperties.length === 1
						? "M_MESSAGESTRIP_EMPTYROW_MANDATORY_HIDDEN"
						: "M_MESSAGESTRIP_EMPTYROW_MANDATORY_HIDDEN_PLURAL",
					[hiddenMandatoryProperties.join(", ")]
				);
				dataStateIndicator.showMessage(messageStripError, "Error");
			}
			const internalModel = dataStateIndicator.getModel("internal") as JSONModel;
			internalModel.setProperty("filteredMessages", filteredMessages, dataStateIndicator.getBindingContext("internal") as Context);
		}
	}

	resumeBinding(bRequestIfNotInitialized: boolean): void {
		this.setProperty("bindingSuspended", false);
		if ((bRequestIfNotInitialized && !this.getDataInitialized()) || this.getProperty("outDatedBinding")) {
			this.setProperty("outDatedBinding", false);
			this.getContent()?.rebind();
		}
	}

	refreshNotApplicableFields(oFilterControl: Control): string[] {
		const oTable = this.getContent();
		return FilterUtils.getNotApplicableFilters(oFilterControl as FilterBar, oTable);
	}

	suspendBinding(): void {
		this.setProperty("bindingSuspended", true);
	}

	invalidateContent(): void {
		this.setProperty("dataInitialized", false);
		this.setProperty("outDatedBinding", false);
	}

	/**
	 * Sets the enablement of the creation row.
	 * @private
	 */
	setFastCreationRowEnablement(): void {
		const table = this.content;
		const fastCreationRow = table.getCreationRow();

		if (fastCreationRow && !fastCreationRow.getBindingContext()) {
			const tableBinding = table.getRowBinding();
			const bindingContext = tableBinding.getContext();

			if (bindingContext) {
				TableHelper.enableFastCreationRow(
					fastCreationRow,
					tableBinding.getPath(),
					bindingContext,
					bindingContext.getModel(),
					Promise.resolve()
				);
			}
		}
	}

	/**
	 * Event handler to create insightsParams and call the API to show insights card preview for table.
	 * @returns Undefined if the card preview is rendered.
	 */
	@xmlEventHandler()
	async onAddCardToInsightsPressed(): Promise<void> {
		try {
			const insightsRelevantColumns = TableInsightsHelper.getInsightsRelevantColumns(this);
			const insightsParams = await TableInsightsHelper.createTableCardParams(this, insightsRelevantColumns);
			if (insightsParams) {
				const message: CardMessage = insightsParams.parameters.isNavigationEnabled
					? undefined
					: {
							type: "Warning",
							text: this.createNavigationErrorMessage(this.content)
					  };

				InsightsService.showInsightsCardPreview(insightsParams, message);
				return;
			}
		} catch (e) {
			showGenericErrorMessage(this.content);
			Log.error(e as string);
		}
	}

	/**
	 * Gets the card manifest optimized for the table case.
	 * @returns Promise of CardManifest
	 */
	private async getCardManifestTable(): Promise<CardManifest> {
		const insightsRelevantColumns = TableInsightsHelper.getInsightsRelevantColumns(this);
		const insightsParams = (await TableInsightsHelper.createTableCardParams(
			this,
			insightsRelevantColumns
		)) as InsightsParams<TableContent>;
		return InsightsService.getCardManifest(insightsParams);
	}

	/**
	 * Event handler to create insightsParams and call the API to show insights card preview for table.
	 * @param card The card manifest to be used for the callback
	 * @returns Undefined if card preview is rendered.
	 */
	async onAddCardToCollaborationManagerCallback(card: CardManifest): Promise<void> {
		try {
			if (card) {
				await InsightsService.showCollaborationManagerCardPreview(card, this.getController().collaborationManager.getService());
				return;
			}
		} catch (e) {
			showGenericErrorMessage(this.content);
			Log.error(e as string);
		}
	}

	createNavigationErrorMessage(scope: Control): string {
		const resourceModel = ResourceModelHelper.getResourceModel(scope);
		return resourceModel.getText("M_ROW_LEVEL_NAVIGATION_DISABLED_MSG_REASON_EXTERNAL_NAVIGATION_CONFIGURED");
	}

	@xmlEventHandler()
	onMassEditButtonPressed(ui5Event: UI5Event, forContextMenu: boolean): void {
		const massEdit = new MassEdit({
			table: this.content,
			onContextMenu: forContextMenu,
			onClose: (): void => {
				this.setMassEdit();
			}
		});
		this.setMassEdit(massEdit);
		massEdit.open();
	}

	@xmlEventHandler()
	onTableSelectionChange(oEvent: UI5Event): void {
		this.fireEvent("selectionChange", oEvent.getParameters());
	}

	@xmlEventHandler()
	async onActionPress(
		oEvent: UI5Event<{}, Control>,
		pageController: PageController,
		actionName: string,
		parameters: {
			model: ODataModel;
			notApplicableContexts: Context[];
			label: string;
			contexts: Context[];
			applicableContexts: Context[];
			entitySetName: string;
		}
	): Promise<unknown> {
		parameters.model = oEvent.getSource().getModel() as ODataModel;
		let executeAction = true;
		if (parameters.notApplicableContexts && parameters.notApplicableContexts.length > 0) {
			// If we have non applicable contexts, we need to open a dialog to ask the user if he wants to continue
			const convertedMetadata = convertTypes(parameters.model.getMetaModel());
			const entityType = convertedMetadata.resolvePath<EntityType>(this.entityTypeFullyQualifiedName).target!;
			const myUnapplicableContextDialog = new NotApplicableContextDialog({
				entityType: entityType,
				notApplicableContexts: parameters.notApplicableContexts,
				title: parameters.label,
				resourceModel: getResourceModel(this),
				entitySet: parameters.entitySetName,
				actionName: actionName
			});
			parameters.contexts = parameters.applicableContexts;
			executeAction = await myUnapplicableContextDialog.open(this);
		}
		if (executeAction) {
			// Direct execution of the action
			try {
				return await pageController.editFlow.invokeAction(actionName, parameters);
			} catch (e) {
				Log.info(e as string);
			}
		}
	}

	@xmlEventHandler()
	onContextMenuPress(oEvent: Table$BeforeOpenContextMenuEvent): void {
		// We can't fully move an xmlEventHandler to a mixin...
		this._onContextMenuPress(oEvent);
	}

	/**
	 * Expose the internal table definition for external usage in the delegate.
	 * @returns The tableDefinition
	 */
	getTableDefinition(): TableVisualization {
		return this.tableDefinition;
	}

	/**
	 * Sets the mass edit related to the table.
	 * @param massEdit
	 */
	setMassEdit(massEdit?: MassEdit): void {
		this.massEdit = massEdit;
	}

	/**
	 * Expose the mass edit related to the table.
	 * @returns The mass edit related to the table, if any
	 */
	getMassEdit(): MassEdit | undefined {
		return this.massEdit;
	}

	/**
	 * connect the filter to the tableAPI if required
	 * @private
	 * @alias sap.fe.macros.TableAPI
	 */

	updateFilterBar(): void {
		const table = this.getContent();
		const filterBarRefId = this.getFilterBar();
		if (table && filterBarRefId && table.getFilter?.() !== filterBarRefId) {
			this._setFilterBar(filterBarRefId);
		}
	}

	/**
	 * Removes the table from the listeners of the filterBar.
	 */
	detachFilterBar(): void {
		const table = this.content;
		table?.setFilter("");
	}

	/**
	 * Sets the filter depending on the type of filterBar.
	 * @param filterBarRefId Id of the filter bar
	 * @private
	 * @alias sap.fe.macros.TableAPI
	 */
	_setFilterBar(filterBarRefId: string): void {
		const table = this.getContent();

		// 'filterBar' property of macros:Table(passed as customData) might be
		// 1. A localId wrt View(FPM explorer example).
		// 2. Absolute Id(this was not supported in older versions).
		// 3. A localId wrt FragmentId(when an XMLComposite or Fragment is independently processed) instead of ViewId.
		//    'filterBar' was supported earlier as an 'association' to the 'mdc:Table' control inside 'macros:Table' in prior versions.
		//    In newer versions 'filterBar' is used like an association to 'macros:TableAPI'.
		//    This means that the Id is relative to 'macros:TableAPI'.
		//    This scenario happens in case of FilterBar and Table in a custom sections in OP of FEV4.

		const tableAPIId = this?.getId();
		const tableAPILocalId = this.data("tableAPILocalId");
		const potentialfilterBarId =
			tableAPILocalId && filterBarRefId && tableAPIId && tableAPIId.replace(new RegExp(tableAPILocalId + "$"), filterBarRefId); // 3

		const filterBar =
			CommonUtils.getTargetView(this)?.byId(filterBarRefId) ||
			UI5Element.getElementById(filterBarRefId) ||
			UI5Element.getElementById(potentialfilterBarId);

		if (filterBar) {
			if (filterBar.isA<FilterBarAPI>("sap.fe.macros.filterBar.FilterBarAPI")) {
				table.setFilter(`${filterBar.getId()}-content`);
			} else if (
				filterBar.isA<FilterBarBBV4>("sap.fe.macros.filterBar.FilterBar") &&
				filterBar?.content?.isA("sap.fe.macros.filterBar.FilterBarAPI")
			) {
				table.setFilter(`${filterBar.content.getId()}-content`);
			} else if (
				filterBar.isA<FilterBar>("sap.ui.mdc.FilterBar") ||
				filterBar.isA<typeof BasicSearch>("sap.fe.macros.table.BasicSearch")
			) {
				table.setFilter(filterBar.getId());
			}
		}
	}

	checkIfColumnExists(aFilteredColummns: FilteredColumn[], columnName: string): boolean {
		return aFilteredColummns.some(function (oColumn: FilteredColumn) {
			if (
				(oColumn?.columnName === columnName && oColumn?.sColumnNameVisible) ||
				(oColumn?.sTextArrangement !== undefined && oColumn?.sTextArrangement === columnName)
			) {
				return columnName;
			}
		});
	}

	getTableIdentifierColumnInfo(): TableKey {
		const oTable = this.getContent();
		const headerInfoTitlePath = this.getTableDefinition().headerInfoTitle;
		const oMetaModel = oTable && (oTable.getModel()?.getMetaModel() as ODataMetaModel),
			sCurrentEntitySetName = oTable.data("metaPath");
		const aTechnicalKeys = oMetaModel.getObject(`${sCurrentEntitySetName}/$Type/$Key`);
		const filteredTechnicalKeys: string[] = [];
		if (aTechnicalKeys && aTechnicalKeys.length > 0) {
			aTechnicalKeys.forEach(function (technicalKey: string) {
				if (technicalKey !== "IsActiveEntity") {
					filteredTechnicalKeys.push(technicalKey);
				}
			});
		}
		const semanticKeyColumns = this.getTableDefinition().semanticKeys;

		const aVisibleColumns: string[] = [];
		const aFilteredColummns: FilteredColumn[] = [];
		const aTableColumns = oTable.getColumns();
		aTableColumns.forEach(function (oColumn: MDCColumn) {
			const column = oColumn?.getPropertyKey?.();
			if (column) {
				aVisibleColumns.push(column);
			}
		});

		aVisibleColumns.forEach(function (oColumn: string) {
			const oTextArrangement = oMetaModel.getObject(`${sCurrentEntitySetName}/$Type/${oColumn}@`);
			const sTextArrangement = oTextArrangement && oTextArrangement["@com.sap.vocabularies.Common.v1.Text"]?.$Path;
			const sTextPlacement =
				oTextArrangement &&
				oTextArrangement["@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement"]?.$EnumMember;
			aFilteredColummns.push({
				columnName: oColumn,
				sTextArrangement: sTextArrangement,
				sColumnNameVisible: !(sTextPlacement === "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly")
			});
		});
		return {
			headerInfoTitlePath,
			filteredTechnicalKeys,
			semanticKeyColumns,
			aFilteredColummns
		};
	}

	getIdentifierColumn(isRecommendationRelevant?: boolean): string | string[] | undefined {
		const { headerInfoTitlePath, filteredTechnicalKeys, semanticKeyColumns, aFilteredColummns } = this.getTableIdentifierColumnInfo();
		let column: string | string[] | undefined;
		if (isRecommendationRelevant) {
			const rootContext = standardRecommendationHelper.getCurrentRootContext() as Context;
			const rootKeys = getInvolvedDataModelObjectEntityKeys(rootContext);
			if (semanticKeyColumns.length > 0) {
				column = semanticKeyColumns.filter((key) => !rootKeys.semanticKeys.includes(key));
			} else if (filteredTechnicalKeys.length > 0) {
				column = filteredTechnicalKeys.filter((key) => !rootKeys.technicalKeys.includes(key));
			}
			return column;
		}

		if (headerInfoTitlePath !== undefined && this.checkIfColumnExists(aFilteredColummns, headerInfoTitlePath)) {
			column = headerInfoTitlePath;
		} else if (
			semanticKeyColumns !== undefined &&
			semanticKeyColumns.length === 1 &&
			this.checkIfColumnExists(aFilteredColummns, semanticKeyColumns[0])
		) {
			column = semanticKeyColumns[0];
		} else if (filteredTechnicalKeys.length === 1 && this.checkIfColumnExists(aFilteredColummns, filteredTechnicalKeys[0])) {
			column = filteredTechnicalKeys[0];
		}
		return column;
	}

	/**
	 * Computes the column value with text arrangement.
	 * @param key Modified key with text annotation path.
	 * @param tableRowContext
	 * @param textAnnotationPath
	 * @param textArrangement
	 * @returns Computed column value.
	 */
	computeColumnValue(key: string, tableRowContext: Context, textAnnotationPath: string, textArrangement: string): string {
		const sCodeValue = tableRowContext.getObject(key);
		let sTextValue;
		let sComputedValue = sCodeValue;

		if (textAnnotationPath) {
			if (key.lastIndexOf("/") > 0) {
				// the target property is replaced with the text annotation path
				key = key.slice(0, key.lastIndexOf("/") + 1);
				key = key.concat(textAnnotationPath);
			} else {
				key = textAnnotationPath;
			}
			sTextValue = tableRowContext.getObject(key);
			if (sTextValue) {
				if (textArrangement) {
					const sEnumNumber = textArrangement.slice(textArrangement.indexOf("/") + 1);
					switch (sEnumNumber) {
						case "TextOnly":
							sComputedValue = sTextValue;
							break;
						case "TextFirst":
							sComputedValue = `${sTextValue} (${sCodeValue})`;
							break;
						case "TextLast":
							sComputedValue = `${sCodeValue} (${sTextValue})`;
							break;
						case "TextSeparate":
							sComputedValue = sCodeValue;
							break;
						default:
					}
				} else {
					sComputedValue = `${sTextValue} (${sCodeValue})`;
				}
			}
		}
		return sComputedValue;
	}

	/**
	 * This function will get the value of first Column of Table with its text Arrangement.
	 * @param tableRowContext
	 * @param textAnnotationPath
	 * @param textArrangement
	 * @param tableColProperty
	 * @returns Column Name with Visibility and its Value.
	 */
	getTableColValue(
		tableRowContext: Context,
		textAnnotationPath: string,
		textArrangement: string,
		tableColProperty: TableColumnProperties
	): string {
		const resourceModel = getResourceModel(this.content);
		let labelNameWithVisibilityAndValue = "";
		const [{ key, visibility }] = tableColProperty;
		const columnLabel = this.getKeyColumnInfo(key)?.label;
		const sComputedValue = this.computeColumnValue(key, tableRowContext, textAnnotationPath, textArrangement);
		labelNameWithVisibilityAndValue = visibility
			? `${columnLabel}: ${sComputedValue}`
			: `${columnLabel} (${resourceModel.getText("T_COLUMN_INDICATOR_IN_TABLE_DEFINITION")}): ${sComputedValue}`;
		return labelNameWithVisibilityAndValue;
	}

	/**
	 * The method that is called to retrieve the column info from the associated message of the message popover.
	 * @param keyColumn string or undefined
	 * @returns Returns the column info.
	 */

	getKeyColumnInfo(keyColumn?: string): TableColumn | undefined {
		return this.getTableDefinition().columns.find(function (oColumn): boolean {
			return oColumn.key.split("::").pop() === keyColumn;
		});
	}

	/**
	 * This method is used to check if the column is Path based UI.Hidden.
	 * @param columnName string
	 * @param rowContext Context
	 * @returns Returns true if the column is Path based UI.Hidden and value visible on the UI, else returns false. Returns string 'true' if the column is not UI.Hidden, else returns 'false'.
	 */

	isColumnValueVisible(columnName: string, rowContext: Context | undefined): string | boolean {
		let anyObject;
		if (!this.propertyUIHiddenCache[columnName]) {
			const dataModelPath = this.getDataModelAndCovertedTargetObject(columnName)?.dataModelPath;
			if (!dataModelPath) {
				return false;
			}
			const visibleExpression = compileExpression(generateVisibleExpression(dataModelPath));
			anyObject = this.createAnyControl(visibleExpression, rowContext);
			this.propertyUIHiddenCache[columnName] = anyObject;
			anyObject.setBindingContext(null); // we need to set the binding context to null otherwise the following addDependent will set it to the context of the table
			this.addDependent(anyObject);
		} else {
			anyObject = this.propertyUIHiddenCache[columnName];
		}
		anyObject.setBindingContext(rowContext);
		const columnValueVisible = anyObject.getAny() as string | boolean;
		anyObject.setBindingContext(null);
		return columnValueVisible;
	}

	/**
	 * Checks whether the column is UI.Hidden or not.
	 * @param columnName string | string[]
	 * @param tableRowContext Context
	 * @returns string[] if the column name is not UI.Hidden.
	 */

	checkColumnValueVisible(columnName: string | string[], tableRowContext: Context | undefined): string[] | undefined {
		const columnAvailability = Array.isArray(columnName) ? columnName : [columnName];
		const availableColumn = [];
		for (const column of columnAvailability) {
			const availability = this.isColumnValueVisible(column, tableRowContext);
			if (availability === "true" || availability === true) {
				availableColumn.push(column);
			}
		}
		if (availableColumn.length > 0) {
			return availableColumn;
		}
	}

	/**
	 * Checks whether the column is present in the table view.
	 * @param key string
	 * @param aFilteredColumns
	 * @returns `true` if the column is visible in the table view.
	 */

	checkVisibility(key: string, aFilteredColumns: FilteredColumn[]): { visibility: boolean } {
		const column = aFilteredColumns.find((col: { columnName: string }) => col.columnName === key);
		if (column) {
			return {
				visibility: column.sColumnNameVisible
			};
		}
		return { visibility: false };
	}

	/**
	 * Retrieves the columns, visibility, and text arrangement based on priority order.
	 * @param tableRowContext Context
	 * @returns An object containing the column name and visibility.
	 */

	getTableColumnVisibilityInfo(tableRowContext: Context | undefined): TableColumnProperties {
		const { headerInfoTitlePath, filteredTechnicalKeys, semanticKeyColumns, aFilteredColummns } = this.getTableIdentifierColumnInfo();
		const columnPropertyAndVisibility = [];

		if (headerInfoTitlePath !== undefined && this.checkColumnValueVisible(headerInfoTitlePath, tableRowContext)) {
			// If the headerInfoTitlePath is not undefined and not UI.Hidden, the headerInfoTitlePath is returned.
			const { visibility } = this.checkVisibility(headerInfoTitlePath, aFilteredColummns);
			columnPropertyAndVisibility.push({ key: headerInfoTitlePath, visibility });
		} else if (
			semanticKeyColumns !== undefined &&
			semanticKeyColumns.length === 1 &&
			this.checkColumnValueVisible(semanticKeyColumns[0], tableRowContext)
		) {
			// if there is only one semanticKey and it is not undefined and not UI.Hidden, the single sematicKey is returned.
			const { visibility } = this.checkVisibility(semanticKeyColumns[0], aFilteredColummns);
			columnPropertyAndVisibility.push({ key: semanticKeyColumns[0], visibility });
		} else if (filteredTechnicalKeys.length === 1 && this.checkColumnValueVisible(filteredTechnicalKeys[0], tableRowContext)) {
			// if there is only one technicalKey and it is not undefined and not UI.Hidden, the single technicalKey is returned.
			const { visibility } = this.checkVisibility(filteredTechnicalKeys[0], aFilteredColummns);
			columnPropertyAndVisibility.push({ key: filteredTechnicalKeys[0], visibility });
		} else if (
			semanticKeyColumns !== undefined &&
			semanticKeyColumns.length > 0 &&
			this.checkColumnValueVisible(semanticKeyColumns, tableRowContext)
		) {
			// if there are multiple semanticKey and it is not undefined and not UI.Hidden, the multiple sematicKey is returned.
			const availableKeys = this.checkColumnValueVisible(semanticKeyColumns, tableRowContext);
			if (availableKeys) {
				for (const key of availableKeys) {
					const { visibility } = this.checkVisibility(key, aFilteredColummns);
					columnPropertyAndVisibility.push({ key: key, visibility });
				}
			}
		} else if (filteredTechnicalKeys.length > 0 && this.checkColumnValueVisible(filteredTechnicalKeys, tableRowContext)) {
			// if there are multiple technicalKey and it is not undefined and not UI.Hidden, the multiple technicalKey is returned.
			const availableKeys = this.checkColumnValueVisible(filteredTechnicalKeys, tableRowContext);
			if (availableKeys) {
				for (const key of availableKeys) {
					const { visibility } = this.checkVisibility(key, aFilteredColummns);
					columnPropertyAndVisibility.push({ key: key, visibility });
				}
			}
		}
		return columnPropertyAndVisibility;
	}

	/**
	 * Handles the CreateActivate event from the ODataListBinding.
	 * @param activateEvent The event sent by the binding
	 */
	@xmlEventHandler()
	async handleCreateActivate(activateEvent: UI5Event<{ context: Context }, ODataListBinding>): Promise<void> {
		// We can't fully move an xmlEventHandler to a mixin...
		await this._handleCreateActivate(activateEvent);
	}

	async getDownloadUrlWithFilters(): Promise<string> {
		const table = this.content;
		const filterBar = UI5Element.getElementById(table.getFilter()) as FilterBar | undefined;

		if (!filterBar) {
			throw new Error("filter bar is not available");
		}
		const binding = table.getRowBinding();
		const model = table.getModel() as ODataModel;
		const filterPropSV = await (filterBar.getParent() as FilterBarAPI).getSelectionVariant();
		// ignore filters with semantic operators which needs to be added later as filters with flp semantic date placeholders
		const filtersWithSemanticDateOpsInfo = SemanticDateOperators.getSemanticOpsFilterProperties(filterPropSV._getSelectOptions());
		const filtersWithoutSemanticDateOps = TableUtils.getAllFilterInfo(
			table,
			filtersWithSemanticDateOpsInfo.map((filterInfo) => filterInfo.filterName)
		);
		const propertiesInfo = filterBar.getPropertyInfoSet();
		// get the filters with semantic date operators with flp placeholder format and append to the exisiting filters
		const [flpMappedPlaceholders, semanticDateFilters] = SemanticDateOperators.getSemanticDateFiltersWithFlpPlaceholders(
			filtersWithSemanticDateOpsInfo,
			propertiesInfo
		);

		let allRelevantFilters: Filter[] = [];
		if (filtersWithoutSemanticDateOps.filters.length > 0) {
			allRelevantFilters = allRelevantFilters.concat(filtersWithoutSemanticDateOps.filters);
		}
		if (semanticDateFilters.length > 0) {
			allRelevantFilters.push(...semanticDateFilters);
		}
		const allFilters = new Filter({
			filters: allRelevantFilters,
			and: true
		});
		const parameters = {
			$search: CommonUtils.normalizeSearchTerm(filterBar.getSearch()) || undefined
		};
		// create hidden binding with all filters e.g. static filters and filters with semantic operators
		const tempTableBinding = model.bindList(binding.getPath(), undefined, undefined, allFilters, parameters);
		let url = (await tempTableBinding.requestDownloadUrl()) ?? "";
		for (const [placeholder, value] of Object.entries(flpMappedPlaceholders)) {
			url = url.replace(placeholder, value);
		}
		return url;
	}

	/**
	 * The dragged element enters a table row.
	 * @param ui5Event UI5 event coming from the MDC drag and drop config
	 */
	@xmlEventHandler()
	onDragEnterDocument(
		ui5Event: UI5Event<{ bindingContext: Context; dragSource: Context; dropPosition: "Before" | "After" | "On" }, DragDropInfo>
	): void {
		// We can't fully move an xmlEventHandler to a mixin...
		this._onDragEnterDocument(ui5Event);
	}

	/**
	 * Starts the drag of the document.
	 * @param ui5Event UI5 event coming from the MDC drag and drop config
	 */
	@xmlEventHandler()
	onDragStartDocument(ui5Event: UI5Event<{ bindingContext: Context }, Control>): void {
		// We can't fully move an xmlEventHandler to a mixin...
		this._onDragStartDocument(ui5Event);
	}

	/**
	 * Drops the document.
	 * @param ui5Event UI5 event coming from the MDC drag and drop config
	 * @returns The Promise
	 */
	@xmlEventHandler()
	async onDropDocument(
		ui5Event: UI5Event<{
			bindingContext: Context;
			dragSource: Context;
			dropPosition: string;
		}>
	): Promise<void> {
		// We can't fully move an xmlEventHandler to a mixin...
		await this._onDropDocument(ui5Event);
	}

	@xmlEventHandler()
	async onCollapseExpandNode(ui5Event: UI5Event, expand: boolean): Promise<void> {
		// We can't fully move an xmlEventHandler to a mixin...
		await this._onCollapseExpandNode(ui5Event, expand);
	}

	/**
	 * Internal method to move a row up or down in a Tree table.
	 * @param ui5Event
	 * @param moveUp True for move up, false for move down
	 * @param forContextMenu
	 */
	@xmlEventHandler()
	async onMoveUpDown(ui5Event: UI5Event, moveUp: boolean, forContextMenu = false): Promise<void> {
		// We can't fully move an xmlEventHandler to a mixin...
		await this._onMoveUpDown(ui5Event, moveUp, forContextMenu);
	}

	/**
	 * Get the selection variant from the table. This function considers only the selection variant applied at the control level.
	 * @returns A promise which resolves with {@link sap.fe.navigation.SelectionVariant}
	 * @public
	 */
	async getSelectionVariant(): Promise<SelectionVariant> {
		return StateHelper.getSelectionVariant(this.getContent());
	}

	/**
	 * Sets {@link sap.fe.navigation.SelectionVariant} to the table. Note: setSelectionVariant will clear existing filters and then apply the SelectionVariant values.
	 * @param selectionVariant The {@link sap.fe.navigation.SelectionVariant} to apply to the table
	 * @param prefillDescriptions Optional. If true, we will use the associated text property values (if they're available in the SelectionVariant) to display the filter value descriptions, instead of loading them from the backend
	 * @returns A promise for asynchronous handling
	 * @public
	 */
	async setSelectionVariant(selectionVariant: SelectionVariant, prefillDescriptions = false): Promise<unknown> {
		return StateHelper.setSelectionVariantToMdcControl(this.getContent(), selectionVariant, prefillDescriptions);
	}

	async _createContent(): Promise<void> {
		const owner = this._getOwner();
		const preprocessorContext = owner?.preprocessorContext;
		if (owner && preprocessorContext) {
			const metaModel = owner.getAppComponent().getMetaModel();
			const metaPath = metaModel.createBindingContext(this.metaPath)!;
			const contextPath = metaModel.createBindingContext(this.contextPath)!;
			const properties = this.getMetadata().getAllProperties();
			const settings: TableBlockProperties = {
				getTranslatedText: this.getTranslatedText.bind(this)
			} as TableBlockProperties;
			for (const propertyName in properties) {
				const propValue = this.getProperty(propertyName);
				if (typeof propValue !== "function") {
					(settings as Record<string, unknown>)[propertyName] = propValue;
				}
			}
			settings.id = this.content.getId();
			this.tableDefinition = deepClone(this.originalTableDefinition);
			settings.tableDefinition = this.tableDefinition;
			settings.creationMode = {
				name: this.creationMode.name,
				createAtEnd: this.creationMode.createAtEnd,
				inlineCreationRowsHiddenInEditMode: this.creationMode.inlineCreationRowsHiddenInEditMode,
				outbound: this.creationMode.outbound
			} as unknown as TableCreationOptions;
			TableAPI.updateColumnsVisibility(settings.ignoredFields, this.dynamicVisibilityForColumns, settings.tableDefinition);

			const tableProperties = { ...settings, metaPath, contextPath };
			const convertedMetadata = convertTypes(metaModel);
			const collectionEntity = convertedMetadata.resolvePath(tableProperties.tableDefinition.annotation.collection).target as
				| EntitySet
				| NavigationProperty;
			const handlerProvider = new TableEventHandlerProvider(tableProperties, collectionEntity);

			const fragment = await XMLPreprocessor.process(
				parseXMLString(
					xml`<root
			xmlns="sap.m"
			xmlns:mdc="sap.ui.mdc"
			xmlns:plugins="sap.m.plugins"
			xmlns:mdcTable="sap.ui.mdc.table"
			xmlns:macroTable="sap.fe.macros.table"
			xmlns:mdcat="sap.ui.mdc.actiontoolbar"
			xmlns:core="sap.ui.core"
			xmlns:control="sap.fe.core.controls"
			xmlns:dt="sap.ui.dt"
			xmlns:fl="sap.ui.fl"
			xmlns:variant="sap.ui.fl.variants"
			xmlns:p13n="sap.ui.mdc.p13n"
			xmlns:internalMacro="sap.fe.macros.internal">${jsx.renderAsXML(() => {
				return MdcTableTemplate.getMDCTableTemplate(
					tableProperties,
					preprocessorContext.getConvertedMetadata(),
					metaModel,
					handlerProvider,
					owner.getAppComponent()
				);
			})}</root>`,
					true
				)[0],
				{ models: {} },
				preprocessorContext
			);
			if (fragment.firstElementChild) {
				// Remove the old MDC table from the list of FilterBar listeners
				this.detachFilterBar();

				this.content?.destroy();
				const content = (await Fragment.load({
					definition: fragment.firstElementChild,
					controller: owner.getRootController(),
					containingView: owner.getRootControl()
				})) as Table;
				this.content = content;

				this.attachFilterBarAndEvents();
			}
		}
	}

	setProperty(propertyKey: string, propertyValue: unknown, bSuppressInvalidate?: boolean): this {
		if (!this._applyingSettings && propertyValue !== undefined && ["ignoredFields", "metaPath"].includes(propertyKey)) {
			super.setProperty(propertyKey, propertyValue, true);
			this._createContent();
		} else {
			super.setProperty(propertyKey, propertyValue, bSuppressInvalidate);
		}
		return this;
	}

	/**
	 * Retrieves the data model and converted target object based on the provided property name.
	 * @param propertyName The name of the property.
	 * @returns Returns data model path and converted target object.
	 */

	getDataModelAndCovertedTargetObject(propertyName: string | undefined): DataModelConversion | undefined {
		const table = this.getContent();
		const metaModel = table.getModel()?.getMetaModel();
		if (!metaModel) {
			return;
		}
		const entityPath = table.data("metaPath");
		const targetMetaPath = table
			.data(DelegateUtil.FETCHED_PROPERTIES_DATA_KEY)
			.find((propertyInfo: PropertyInfo) => propertyInfo.name === propertyName).metadataPath as string;

		const targetObject = metaModel.getContext(targetMetaPath);
		const entitySet = metaModel.getContext(entityPath);
		const convertedtargetObject = MetaModelConverter.convertMetaModelContext(targetObject) as
			| DataFieldAbstractTypes
			| DataPointTypeTypes;
		let dataModelPath = MetaModelConverter.getInvolvedDataModelObjects<DataFieldAbstractTypes | DataPointTypeTypes | Property>(
			targetObject,
			entitySet
		);
		dataModelPath =
			FieldTemplating.getDataModelObjectPathForValue(
				dataModelPath as DataModelObjectPath<DataFieldAbstractTypes | DataPointTypeTypes>
			) || dataModelPath;
		return { dataModelPath: dataModelPath, convertedtargetObject: convertedtargetObject };
	}

	/**
	 * Get the binding context for the given ModeAsExpression.
	 * @param ModeAsExpression
	 * @param rowContext
	 * @returns
	 */

	createAnyControl(ModeAsExpression: CompiledBindingToolkitExpression, rowContext: Context | undefined): typeof Any {
		const table = this.getContent();
		const anyObject = new Any({ any: ModeAsExpression });
		anyObject.setModel(rowContext?.getModel());
		anyObject.setModel(table.getModel("ui"), "ui");
		return anyObject;
	}

	/**
	 * Get the edit mode of a Property.
	 * @param propertyName The name of the property
	 * @param rowContext The context of the row containing the property
	 * @returns The edit mode of the field
	 */

	getPropertyEditMode(propertyName: string, rowContext: Context): string | undefined {
		let anyObject: typeof Any | undefined;
		if (!this.propertyEditModeCache[propertyName]) {
			const dataModelPath = this.getDataModelAndCovertedTargetObject(propertyName)?.dataModelPath;
			const convertedtargetObject = this.getDataModelAndCovertedTargetObject(propertyName)?.convertedtargetObject;
			if (dataModelPath && convertedtargetObject) {
				const propertyForFieldControl = (dataModelPath?.targetObject as unknown as DataFieldTypes)?.Value
					? (dataModelPath?.targetObject as unknown as DataFieldTypes).Value
					: dataModelPath?.targetObject;
				const editModeAsExpression = compileExpression(
					UIFormatters.getEditMode(propertyForFieldControl, dataModelPath, false, true, convertedtargetObject)
				);
				anyObject = this.createAnyControl(editModeAsExpression, rowContext);
				this.propertyEditModeCache[propertyName] = anyObject;
				anyObject.setBindingContext(null); // we need to set the binding context to null otherwise the following addDependent will set it to the context of the table
				this.addDependent(anyObject); // to destroy it when the tableAPI is destroyed
			}
		} else {
			anyObject = this.propertyEditModeCache[propertyName];
		}
		anyObject?.setBindingContext(rowContext);
		const editMode = anyObject?.getAny() as string | undefined;
		anyObject?.setBindingContext(null);
		return editMode;
	}

	private modifyDynamicVisibilityForColumn(columnKey: string, visible: boolean): void {
		const existingDynamicVisibility = this.dynamicVisibilityForColumns.find(
			(dynamicVisibility) => dynamicVisibility.columnKey === columnKey
		);
		if (existingDynamicVisibility) {
			existingDynamicVisibility.visible = visible;
		} else {
			this.dynamicVisibilityForColumns.push({
				columnKey: columnKey,
				visible: visible
			});
		}
	}

	/**
	 * Show the columns with the given column keys by setting their availability to Default.
	 * @param columnKeys The keys for the columns to show
	 * @returns Promise<void>
	 * @public
	 * @experimental As of version 1.124.0
	 * @since 1.124.0
	 */
	async showColumns(columnKeys: string[]): Promise<void> {
		for (const columnKey of columnKeys) {
			this.modifyDynamicVisibilityForColumn(columnKey, true);
		}
		return this._createContent();
	}

	/**
	 * Hide the columns with the given column keys by setting their availability to Default.
	 * @param columnKeys The keys for the columns to hide
	 * @returns Promise<void>
	 * @public
	 * @experimental As of version 1.124.0
	 * @since 1.124.0
	 */
	async hideColumns(columnKeys: string[]): Promise<void> {
		for (const columnKey of columnKeys) {
			this.modifyDynamicVisibilityForColumn(columnKey, false);
		}
		return this._createContent();
	}

	/**
	 * Sets the fields that should be ignored when generating the table.
	 * @param ignoredFields The fields to ignore
	 * @returns Reference to this in order to allow method chaining
	 * @experimental
	 * @since 1.124.0
	 * @public
	 */
	setIgnoredFields(ignoredFields: string): this {
		return this.setProperty("ignoredFields", ignoredFields);
	}

	/**
	 * Get the fields that should be ignored when generating the table.
	 * @returns The value of the ignoredFields property
	 * @experimental
	 * @since 1.124.0
	 * @public
	 */
	getIgnoredFields(): string {
		return this.getProperty("ignoredFields");
	}

	/**
	 * Retrieves the control state based on the given control state key.
	 * @param controlState The current state of the control.
	 * @returns - The full state of the control along with the initial state if available.
	 */
	getControlState(controlState: ControlState): ControlState {
		const initialControlState: Record<string, unknown> = this.initialControlState;
		if (controlState) {
			return {
				fullState: controlState as object,
				initialState: initialControlState as object
			};
		}
		return controlState;
	}

	/**
	 * Returns the key to be used for given control.
	 * @param oControl The control to get state key for
	 * @returns The key to be used for storing the controls state
	 */
	getStateKey(oControl: ManagedObject): string {
		return CommonUtils.getTargetView(this.content)?.getLocalId(oControl.getId()) || oControl.getId();
	}

	/**
	 * Updates the table definition with ignoredFields and dynamicVisibilityForColumns.
	 * @param ignoredFields
	 * @param dynamicVisibilityForColumns
	 * @param tableDefinition
	 */
	public static updateColumnsVisibility(
		ignoredFields: string | undefined,
		dynamicVisibilityForColumns: DynamicVisibilityForColumn[],
		tableDefinition: TableVisualization
	): void {
		if (!ignoredFields && !dynamicVisibilityForColumns.length) {
			return;
		}

		const ignoredFieldNames = ignoredFields ? ignoredFields.split(",").map((name) => name.trim()) : [];
		const columns = tableDefinition.columns;

		// If a columns in the table definition contains an ignored field, mark it as hidden
		columns.forEach((column) => {
			let ignoreColumn = ignoredFieldNames.includes((column as AnnotationTableColumn).relativePath); // Standard column
			if (!ignoreColumn && column.propertyInfos) {
				// Complex column
				ignoreColumn = column.propertyInfos.some((relatedColumnName) => {
					const relatedColumn = columns.find((col) => col.name === relatedColumnName) as AnnotationTableColumn;
					return relatedColumn?.relativePath && ignoredFieldNames.includes(relatedColumn.relativePath);
				});
			}
			if (ignoreColumn) {
				column.availability = "Hidden";
				if ("sortable" in column) {
					column.sortable = false;
				}
				if ("filterable" in column) {
					column.filterable = false;
				}
				if ("isGroupable" in column) {
					column.isGroupable = false;
				}
			}

			const dynamicVisibility = dynamicVisibilityForColumns.find((dynamicVisibility) => dynamicVisibility.columnKey === column.key);
			if (dynamicVisibility) {
				column.availability = dynamicVisibility.visible ? "Default" : "Hidden";
			}
		});
	}

	/**
	 * Returns the MDC table.
	 * This method is called by the forwarding aggregation to get the target of the aggregation.
	 * @private
	 * @returns The mdc table
	 */
	getMDCTable(): MDCTable {
		return this.content;
	}

	/**
	 * Called by the MDC state util when the state for this control's child has changed.
	 */
	handleStateChange(): void {
		this.getPageController()?.getExtensionAPI().updateAppState();
	}

	@xmlEventHandler()
	/**
	 * Event handler for the row press event of the table when there is an outbound navigation defined.
	 * @param ui5Event
	 * @param controller
	 * @param navigationTarget
	 * @param bindingContext
	 * @returns Promise<void>
	 */
	async onChevronPressNavigateOutBound(
		chevronPressEvent: UI5Event,
		controller: PageController,
		navigationTarget: string,
		bindingContext: Context
	): Promise<void> {
		return this.avoidParallelCalls(
			async () => controller._intentBasedNavigation.onChevronPressNavigateOutBound(controller, navigationTarget, bindingContext, ""),
			"onChevronPressNavigateOutBound"
		);
	}

	/**
	 * Calls the asyncCall function only if the lockName is not already locked.
	 * @param asyncCall
	 * @param lockName
	 * @returns Promise<void>
	 */
	async avoidParallelCalls(asyncCall: Function, lockName: string): Promise<void> {
		if (this.lock[lockName]) {
			return;
		}
		this.lock[lockName] = true;
		try {
			await asyncCall();
		} catch {
			this.lock[lockName] = false;
		}
		this.lock[lockName] = false;
	}

	destroy(suppressInvalidate?: boolean): void {
		// We release hold on messageHandler by the control if there is one.
		this.getController()?.messageHandler.releaseHoldByControl(this);
		super.destroy(suppressInvalidate);
	}

	private fullScreenDialog?: Dialog; // The dialog used to display the table in full screen mode

	setFullScreenDialog(dialog: Dialog | undefined): void {
		this.fullScreenDialog = dialog;
	}

	/**
	 * Gets the path for the table collection.
	 * @returns The path
	 */
	getRowCollectionPath(): string {
		const controller = this.getPageController()!;
		const metaModel = controller.getModel().getMetaModel();
		const collectionContext = metaModel.createBindingContext(this.tableDefinition.annotation.collection);
		const contextPath = metaModel.createBindingContext(this.contextPath)!;
		const dataModelPath = getInvolvedDataModelObjects(collectionContext!, contextPath);
		return getContextRelativeTargetObjectPath(dataModelPath) || getTargetObjectPath(dataModelPath);
	}

	/**
	 * Gets the binding info used when creating the list binding for the MDC table.
	 * @returns The table binding info
	 */
	getTableTemplateBindingInfo(): CollectionBindingInfo {
		const controller = this.getPageController()!;
		const path = this.getRowCollectionPath();
		const rowBindingInfo: CollectionBindingInfo = {
			suspended: false,
			path,
			parameters: {
				$count: true
			}
		};

		if (this.tableDefinition.enable$select) {
			// Don't add $select parameter in case of an analytical query, this isn't supported by the model
			const select = this.tableDefinition.requestAtLeast?.join(",");
			if (select) {
				rowBindingInfo.parameters!.$select = select;
			}
		}

		if (this.tableDefinition.enable$$getKeepAliveContext) {
			// we later ensure in the delegate only one list binding for a given targetCollectionPath has the flag $$getKeepAliveContext
			rowBindingInfo.parameters!.$$getKeepAliveContext = true;
		}

		// Clears the selection after a search/filter
		rowBindingInfo.parameters!.$$clearSelectionOnFilter = true;

		rowBindingInfo.parameters!.$$groupId = "$auto.Workers";
		rowBindingInfo.parameters!.$$updateGroupId = "$auto";
		rowBindingInfo.parameters!.$$ownRequest = true;
		rowBindingInfo.parameters!.$$patchWithoutSideEffects = true;

		// Event handlers
		const editFlowExtension = controller.editFlow;
		const eventHandlers: Record<string, Function> = {};
		eventHandlers.patchCompleted = this.onInternalPatchCompleted.bind(this);
		eventHandlers.dataReceived = this.onInternalDataReceived.bind(this);
		eventHandlers.dataRequested = this.onInternalDataRequested.bind(this);
		eventHandlers.change = this.onContextChange.bind(this);
		eventHandlers.createActivate = this.handleCreateActivate.bind(this);
		eventHandlers.createSent = editFlowExtension.handleCreateSent.bind(editFlowExtension);
		if (this.tableDefinition.handlePatchSent) {
			eventHandlers.patchSent = editFlowExtension.handlePatchSent.bind(editFlowExtension);
		}
		rowBindingInfo.events = eventHandlers;

		return rowBindingInfo;
	}
}

export default TableAPI;
