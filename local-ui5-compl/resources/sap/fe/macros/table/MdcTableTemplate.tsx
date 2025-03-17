import type { ConvertedMetadata, EntitySet, NavigationProperty } from "@sap-ux/vocabularies-types";
import type {
	Chart,
	DataField,
	DataFieldForAction,
	DataFieldForAnnotation,
	DataPoint,
	FieldGroup,
	LineItem,
	PresentationVariant,
	SelectionPresentationVariant
} from "@sap-ux/vocabularies-types/vocabularies/UI";
import {
	UIAnnotationTerms,
	UIAnnotationTypes,
	type DataFieldAbstractTypes,
	type DataFieldForIntentBasedNavigation
} from "@sap-ux/vocabularies-types/vocabularies/UI";
import Log from "sap/base/Log";
import type { BindingToolkitExpression } from "sap/fe/base/BindingToolkit";
import { and, compileExpression, constant, equal, ifElse, isConstant, isTruthy, not, or, pathInModel } from "sap/fe/base/BindingToolkit";
import type { PropertiesOf, StrictPropertiesOf } from "sap/fe/base/ClassSupport";
import type AppComponent from "sap/fe/core/AppComponent";
import CommonUtils from "sap/fe/core/CommonUtils";
import CommandExecution from "sap/fe/core/controls/CommandExecution";
import FormElementWrapper from "sap/fe/core/controls/FormElementWrapper";
import { CreationMode } from "sap/fe/core/converters/ManifestSettings";
import { getInvolvedDataModelObjects } from "sap/fe/core/converters/MetaModelConverter";
import { hasDataPointTarget, isDataField, isDataFieldForAnnotation, isDataFieldTypes } from "sap/fe/core/converters/annotations/DataField";
import type { CustomAction } from "sap/fe/core/converters/controls/Common/Action";
import type {
	AnnotationTableColumn,
	ComputedTableColumn,
	CustomBasedTableColumn,
	TableColumn,
	TableType,
	TableVisualization
} from "sap/fe/core/converters/controls/Common/Table";
import { StandardActionKeys, type StandardAction } from "sap/fe/core/converters/controls/Common/table/StandardActions";
import { UI, singletonPathVisitor } from "sap/fe/core/helpers/BindingHelper";
import ModelHelper from "sap/fe/core/helpers/ModelHelper";
import { generate } from "sap/fe/core/helpers/StableIdHelper";
import { isAnnotationOfTerm, isAnnotationOfType, isMultipleNavigationProperty, isSingleton } from "sap/fe/core/helpers/TypeGuards";
import {
	enhanceDataModelPath,
	getPathRelativeLocation,
	isPathUpdatable,
	type DataModelObjectPath
} from "sap/fe/core/templating/DataModelPathHelper";
import type { DateTimeStyle } from "sap/fe/core/templating/UIFormatters";
import { isMultiValueField } from "sap/fe/core/templating/UIFormatters";
import { getCommandExecutionForAction } from "sap/fe/macros/ActionCommand";
import CommonHelper from "sap/fe/macros/CommonHelper";
import MultiValueFieldBlock from "sap/fe/macros/MultiValueField";
import { createCustomData, createCustomDatas } from "sap/fe/macros/TSXUtils";
import ValueHelp from "sap/fe/macros/ValueHelp";
import DraftIndicator from "sap/fe/macros/draftIndicator/DraftIndicator";
import FieldHelper from "sap/fe/macros/field/FieldHelper";
import { getDraftIndicatorVisibleBinding, getVisibleExpression } from "sap/fe/macros/field/FieldTemplating";
import CustomFragmentBlock from "sap/fe/macros/fpm/CustomFragment.block";
import InternalFieldBlock from "sap/fe/macros/internal/InternalField.block";
import ActionHelper from "sap/fe/macros/internal/helpers/ActionHelper";
import { buildExpressionForHeaderVisible } from "sap/fe/macros/internal/helpers/TableTemplating";
import MicroChartBlock from "sap/fe/macros/microchart/MicroChart.block";
import SituationsIndicator from "sap/fe/macros/situations/SituationsIndicator";
import { getTableActionsTemplate, getTableContextMenuTemplate } from "sap/fe/macros/table/ActionsTemplating";
import QuickFilterSelector from "sap/fe/macros/table/QuickFilterSelector";
import SlotColumn from "sap/fe/macros/table/SlotColumn";
import type TableAPI from "sap/fe/macros/table/TableAPI";
import type TableCreationOptions from "sap/fe/macros/table/TableCreationOptions";
import TableHelper from "sap/fe/macros/table/TableHelper";
import { getUploadPlugin } from "sap/fe/macros/table/uploadTable/UploadTableTemplate";
import FlexItemData from "sap/m/FlexItemData";
import HBox from "sap/m/HBox";
import Label from "sap/m/Label";
import Menu from "sap/m/Menu";
import MenuItem from "sap/m/MenuItem";
import ObjectStatus from "sap/m/ObjectStatus";
import SegmentedButton from "sap/m/SegmentedButton";
import SegmentedButtonItem from "sap/m/SegmentedButtonItem";
import VBox from "sap/m/VBox";
import { ObjectMarkerVisibility } from "sap/m/library";
import CellSelector from "sap/m/plugins/CellSelector";
import ContextMenuSetting from "sap/m/plugins/ContextMenuSetting";
import CopyProvider from "sap/m/plugins/CopyProvider";
import DataStateIndicator from "sap/m/plugins/DataStateIndicator";
import type Control from "sap/ui/core/Control";
import CustomData from "sap/ui/core/CustomData";
import type UI5Element from "sap/ui/core/Element";
import Library from "sap/ui/core/Lib";
import type { TitleLevel } from "sap/ui/core/library";
import VariantManagement from "sap/ui/fl/variants/VariantManagement";
import MDCTable from "sap/ui/mdc/Table";
import ActionToolbarAction from "sap/ui/mdc/actiontoolbar/ActionToolbarAction";
import TableP13nMode from "sap/ui/mdc/enums/TableP13nMode";
import PersistenceProvider from "sap/ui/mdc/p13n/PersistenceProvider";
import Column from "sap/ui/mdc/table/Column";
import CreationRow from "sap/ui/mdc/table/CreationRow";
import DragDropConfig from "sap/ui/mdc/table/DragDropConfig";
import GridTableType from "sap/ui/mdc/table/GridTableType";
import ResponsiveColumnSettings from "sap/ui/mdc/table/ResponsiveColumnSettings";
import ResponsiveTableType from "sap/ui/mdc/table/ResponsiveTableType";
import RowActionItem from "sap/ui/mdc/table/RowActionItem";
import RowSettings from "sap/ui/mdc/table/RowSettings";
import TreeTableType from "sap/ui/mdc/table/TreeTableType";
import type Context from "sap/ui/model/Context";
import type ODataMetaModel from "sap/ui/model/odata/v4/ODataMetaModel";
import type FieldFormatOptions from "../field/FieldFormatOptions";
import type TableEventHandlerProvider from "./TableEventHandlerProvider";

/**
 * Generates the table type for the table.
 * @param tableDefinition
 * @param _collection
 * @param tableType
 * @param selectionLimit
 * @returns The table type
 */
function getTableType(
	tableDefinition: TableVisualization,
	_collection: Context,
	tableType: TableType,
	selectionLimit: number
): ResponsiveTableType | GridTableType | TreeTableType {
	const collection = _collection.getObject();
	switch (tableType) {
		case "GridTable":
			return (
				<GridTableType
					rowCountMode={tableDefinition.control.rowCountMode}
					rowCount={tableDefinition.control.rowCount}
					selectionLimit={selectionLimit}
					fixedColumnCount={tableDefinition.control.frozenColumnCount}
					scrollThreshold={tableDefinition.control.scrollThreshold}
				/>
			);

		case "TreeTable":
			return (
				<TreeTableType
					rowCountMode={tableDefinition.control.rowCountMode}
					rowCount={tableDefinition.control.rowCount}
					fixedColumnCount={tableDefinition.control.frozenColumnCount}
					scrollThreshold={tableDefinition.control.scrollThreshold}
				/>
			);

		default:
			return (
				<ResponsiveTableType
					showDetailsButton={true}
					detailsButtonSetting={"{=['Low', 'Medium', 'None']}"}
					growingMode={collection.$kind === "EntitySet" ? "Scroll" : undefined}
				/>
			);
	}
}

/**
 * Generates the DataSateIndicator for the table.
 * @param handlerProvider
 * @returns The datastate indicator
 */
function getDataStateIndicator(handlerProvider: TableEventHandlerProvider): DataStateIndicator {
	return (
		<DataStateIndicator
			filter={handlerProvider.dataStateIndicatorFilter}
			enableFiltering={true}
			dataStateChange={handlerProvider.dataStateChange}
		/>
	);
}

/**
 * Generates the valueHelp based on the dataField path.
 * @param id
 * @param dataFieldPath DataFieldPath to be evaluated
 * @param forMultiValueField
 * @returns The valueHelp
 */
function getValueHelpTemplateFromPath(id: string, dataFieldPath?: string, forMultiValueField?: boolean): ValueHelp | undefined {
	if (dataFieldPath) {
		return (
			<ValueHelp
				idPrefix={generate([id, "TableValueHelp"])}
				metaPath={dataFieldPath + "/Value"}
				useMultiValueField={forMultiValueField === true ? true : undefined}
			/>
		);
	}

	return undefined;
}

/**
 * Generates the valueHelps based on a column.
 * @param id
 * @param column Column to be evaluated
 * @param convertedMetaData
 * @param contextObjectPath
 * @returns The valueHelps
 */
function getValueHelps(
	id: string,
	column: AnnotationTableColumn,
	convertedMetaData: ConvertedMetadata,
	contextObjectPath: DataModelObjectPath<LineItem | SelectionPresentationVariant | PresentationVariant>
): ValueHelp[] {
	const dataFieldObject = convertedMetaData.resolvePath(column.annotationPath).target as DataFieldAbstractTypes;
	if (isDataFieldForAnnotation(dataFieldObject) && dataFieldObject.Target.$target?.term === UIAnnotationTerms.Chart) {
		return [];
	} else if (isDataFieldForAnnotation(dataFieldObject) && dataFieldObject.Target.$target?.term === UIAnnotationTerms.FieldGroup) {
		const allVH: ValueHelp[] = [];
		for (const index in dataFieldObject.Target.$target.Data) {
			const vh = getValueHelpTemplateFromPath(id, column.annotationPath + "/Target/$AnnotationPath/Data/" + index);
			if (vh) {
				allVH.push(vh);
			}
		}
		return allVH;
	} else {
		if (isDataFieldTypes(dataFieldObject)) {
			const propertyDataModelObject = enhanceDataModelPath(contextObjectPath, dataFieldObject.Value.path);
			const relativeNavigationProperties = getPathRelativeLocation(contextObjectPath, propertyDataModelObject.navigationProperties);
			if (isMultipleNavigationProperty(relativeNavigationProperties[relativeNavigationProperties.length - 1])) {
				const vh = getValueHelpTemplateFromPath(id, column.annotationPath, true);
				return vh ? [vh] : [];
			}
		}
		const vh = getValueHelpTemplateFromPath(id, column.annotationPath);
		return vh ? [vh] : [];
	}
}

/**
 * Generates the binding expression for the drag and drop enablement.
 * @param contextObjectPath
 * @param tableDefinition
 * @returns The binding expression
 */
function getDragAndDropEnabled(
	contextObjectPath: DataModelObjectPath<LineItem | SelectionPresentationVariant | PresentationVariant>,
	tableDefinition: TableVisualization
): BindingToolkitExpression<boolean> {
	const isPathUpdatableOnNavigation = isPathUpdatable(contextObjectPath, {
		ignoreTargetCollection: true,
		authorizeUnresolvable: true,
		pathVisitor: (path: string, navigationPaths: string[]) =>
			singletonPathVisitor(path, contextObjectPath.convertedTypes, navigationPaths)
	});
	const isPathUpdatableOnTarget = isPathUpdatable(contextObjectPath, {
		authorizeUnresolvable: true,
		pathVisitor: (path: string, navigationPaths: string[]) =>
			singletonPathVisitor(path, contextObjectPath.convertedTypes, navigationPaths)
	});

	if (contextObjectPath.startingEntitySet === contextObjectPath.targetEntitySet) {
		// ListReport case: we allow drag and drop on draft-enabled entities
		if ((contextObjectPath.startingEntitySet as EntitySet).annotations.Common?.DraftRoot !== undefined) {
			return and(
				isPathUpdatableOnNavigation._type === "Unresolvable"
					? ifElse(isConstant(isPathUpdatableOnTarget), isPathUpdatableOnTarget, constant(true))
					: isPathUpdatableOnNavigation,
				tableDefinition.control.isHierarchyParentNodeUpdatable!
			);
		} else {
			return constant(false);
		}
	} else {
		// ObjectPage case: we allow drag and drop in edit mode
		return and(
			isPathUpdatableOnNavigation._type === "Unresolvable"
				? ifElse(isConstant(isPathUpdatableOnTarget), isPathUpdatableOnTarget, constant(true))
				: isPathUpdatableOnNavigation,
			UI.IsEditable,
			tableDefinition.control.isHierarchyParentNodeUpdatable!
		);
	}
}

export function getDependents(
	id: string,
	tableDefinition: TableVisualization,
	tableType: TableType | undefined,
	readOnly: boolean | undefined,
	contextObjectPath: DataModelObjectPath<LineItem | SelectionPresentationVariant | PresentationVariant>,
	variantManagement: string | undefined,
	handlerProvider: TableEventHandlerProvider,
	metaPath: Context,
	collection: Context
): UI5Element[] {
	const dependents: UI5Element[] = [];
	const cutAction = tableDefinition.actions.find((a) => a.key === StandardActionKeys.Cut) as StandardAction | undefined;
	if (cutAction?.isTemplated === "true") {
		dependents.push(
			<CommandExecution
				execute={handlerProvider.getCutHandler(false)}
				command="Cut"
				enabled={cutAction.enabled as unknown as boolean}
			/>
		);
	}
	const pasteAction = tableDefinition.actions.find((a) => a.key === StandardActionKeys.Paste) as StandardAction | undefined;
	if (pasteAction?.visible !== "false" && tableType === "TreeTable") {
		dependents.push(
			<CommandExecution
				execute={handlerProvider.getPasteHandler(false)}
				command="Paste"
				enabled={pasteAction?.enabled as unknown as boolean}
			/>
		);
	}

	if (!readOnly && tableDefinition?.columns) {
		for (const column of tableDefinition.columns) {
			if (column.availability === "Default" && "annotationPath" in column) {
				dependents.push(...getValueHelps(id, column, contextObjectPath.convertedTypes, contextObjectPath));
			}
		}
	}
	const createAction = tableDefinition.actions.find((a) => a.key === StandardActionKeys.Create) as StandardAction | undefined;
	const deleteAction = tableDefinition.actions.find((a) => a.key === StandardActionKeys.Delete) as StandardAction | undefined;

	if (
		tableDefinition.annotation.isInsertUpdateActionsTemplated &&
		createAction?.isTemplated === "true" &&
		tableDefinition.control.nodeType === undefined &&
		tableDefinition.control.enableUploadPlugin === false
	) {
		// The shortcut is not enabled in case of a create menu (i.e. when nodeType is defined)
		dependents.push(
			<CommandExecution
				execute={handlerProvider.getCreateButtonPressHandler(false, false)}
				visible={createAction.visible as unknown as boolean}
				enabled={createAction.enabled as unknown as boolean}
				command="Create"
			/>
		);
	}
	if (deleteAction?.isTemplated === "true") {
		dependents.push(
			<CommandExecution
				execute={handlerProvider.getDeleteButtonPressHandler(false)}
				visible={deleteAction.visible as unknown as boolean}
				enabled={deleteAction.enabled as unknown as boolean}
				command="DeleteEntry"
			/>
		);
	}

	// Move up and down actions
	const moveUpAction = tableDefinition.actions.find((a) => a.key === StandardActionKeys.MoveUp) as StandardAction | undefined;
	const moveDownAction = tableDefinition.actions.find((a) => a.key === StandardActionKeys.MoveDown) as StandardAction | undefined;
	if (
		moveUpAction &&
		moveDownAction &&
		moveUpAction.visible !== "false" &&
		moveDownAction.visible !== "false" &&
		tableType === "TreeTable"
	) {
		dependents.push(
			<CommandExecution
				execute={handlerProvider.getMoveUpDownHandler(true, false)}
				command="TableMoveElementUp"
				enabled={moveUpAction.enabled as unknown as boolean}
			/>
		);
		dependents.push(
			<CommandExecution
				execute={handlerProvider.getMoveUpDownHandler(false, false)}
				command="TableMoveElementDown"
				enabled={moveDownAction.enabled as unknown as boolean}
			/>
		);
	}

	for (const actionName in tableDefinition.commandActions) {
		const action = tableDefinition.commandActions[actionName];
		const actionCommand = getActionCommand(
			actionName,
			action,
			false,
			contextObjectPath.convertedTypes,
			metaPath,
			collection,
			tableDefinition,
			contextObjectPath,
			handlerProvider
		);
		if (actionCommand) {
			dependents.push(actionCommand);
		}
	}

	dependents.push(<CommandExecution execute={handlerProvider.displayTableSettings} command="TableSettings" />);
	if (variantManagement === "None") {
		// Persistence provider offers persisting personalization changes without variant management
		dependents.push(<PersistenceProvider id={generate([id, "PersistenceProvider"])} for={id} />);
	}

	dependents.push(<ContextMenuSetting scope="Selection" />);

	if (tableDefinition.control.enableUploadPlugin) {
		dependents.push(getUploadPlugin(tableDefinition, id));
	}

	return dependents;
}

function getActions(
	table: TableBlockProperties,
	handlerProvider: TableEventHandlerProvider,
	collectionContext: Context,
	collectionEntity: EntitySet | NavigationProperty
): Control[] | undefined {
	const actions: Control[] = [];
	if (handlerProvider.segmentedButtonPress) {
		const alpButtonItems: SegmentedButtonItem[] = [];
		if (CommonHelper.isDesktop()) {
			alpButtonItems.push(
				<SegmentedButtonItem
					tooltip="{sap.fe.i18n>M_COMMON_HYBRID_SEGMENTED_BUTTON_ITEM_TOOLTIP}"
					key="Hybrid"
					icon="sap-icon://chart-table-view"
				/>
			);
		}
		alpButtonItems.push(
			<SegmentedButtonItem
				tooltip="{sap.fe.i18n>M_COMMON_CHART_SEGMENTED_BUTTON_ITEM_TOOLTIP}"
				key="Chart"
				icon="sap-icon://bar-chart"
			/>
		);
		alpButtonItems.push(
			<SegmentedButtonItem
				tooltip="{sap.fe.i18n>M_COMMON_TABLE_SEGMENTED_BUTTON_ITEM_TOOLTIP}"
				key="Table"
				icon="sap-icon://table-view"
			/>
		);

		actions.push(
			<ActionToolbarAction
				layoutInformation={'{ aggregationName: "end", alignment: "End" }'}
				visible={"{= ${pageInternal>alpContentView} === 'Table' }"}
			>
				{{
					action: (
						<SegmentedButton
							id={generate([table.id, "SegmentedButton", "TemplateContentView"])}
							select={handlerProvider.segmentedButtonPress}
							selectedKey="{pageInternal>alpContentView}"
						>
							{{
								items: alpButtonItems
							}}
						</SegmentedButton>
					)
				}}
			</ActionToolbarAction>
		);
	}

	actions.push(...getTableActionsTemplate(table, handlerProvider, collectionContext, collectionEntity));

	return actions.length > 0 ? actions : undefined;
}

function getRowSettings(
	tableDefinition: TableVisualization,
	rowAction: string | undefined,
	tableType: TableType,
	handlerProvider: TableEventHandlerProvider
): RowSettings {
	const rowActionItem = (
		<RowActionItem
			type={rowAction}
			press={tableType === "ResponsiveTable" ? undefined : handlerProvider.rowPress}
			visible={tableDefinition.annotation.row?.visible}
		/>
	);

	return (
		<RowSettings navigated={tableDefinition.annotation.row?.rowNavigated} highlight={tableDefinition.annotation.row?.rowHighlighting}>
			{{
				rowActions: rowAction === "Navigation" ? rowActionItem : undefined
			}}
		</RowSettings>
	);
}

/**
 * Generates the context menu for the table.
 * @param tableProperties
 * @param tableType
 * @param tableDefinition
 * @param collectionEntity
 * @param rowAction
 * @param handlerProvider
 * @param id
 * @param contextObjectPath
 * @param metaPath
 * @param collection
 * @returns The context menu
 */
function getContextMenu(
	tableProperties: TableBlockProperties,
	tableType: TableType,
	tableDefinition: TableVisualization,
	collectionEntity: EntitySet | NavigationProperty,
	rowAction: string | undefined,
	handlerProvider: TableEventHandlerProvider,
	contextObjectPath: DataModelObjectPath<LineItem | SelectionPresentationVariant | PresentationVariant>,
	metaPath: Context,
	collection: Context,
	navigationInEditMode: boolean
): Menu | undefined {
	const menuItems = getTableContextMenuTemplate(tableProperties, handlerProvider, collection, collectionEntity);
	if (rowAction === "Navigation" && !navigationInEditMode) {
		menuItems.push(getOpenInNewTabTemplate(handlerProvider));
	}
	if (menuItems.length > 0) {
		return (
			<Menu itemSelected={handlerProvider.contextMenuItemSelected}>
				{{
					dependents: getDependentsForContextMenu(
						tableDefinition,
						tableType,
						contextObjectPath,
						handlerProvider,
						metaPath,
						collection
					),
					items: menuItems
				}}
			</Menu>
		);
	}
	return undefined;
}

/**
 * Generates the template string for the MenuItem.
 * @param handlerProvider
 * @returns The xml string representation for the MenuItem
 */
function getOpenInNewTabTemplate(handlerProvider: TableEventHandlerProvider): MenuItem {
	// The 'Open in New Tab' action should not be visible for sticky sessions in edit mode
	// For the context menu, the visibility should also consider the 'inactiveContext' property:
	// only when at least one selected context is active (i.e. "contextmenu/inactiveContext" is false), the action should be visible in the context menu
	// The second is only relevant when the table manifest setting "creationMode" is "InlineCreationRows"
	const visible = and(
		not(and(pathInModel("/sessionOn", "internal"), UI.IsEditable)),
		not(pathInModel("contextmenu/inactiveContext", "internal"))
	);

	return (
		<MenuItem
			core:require="{API: 'sap/fe/macros/table/TableAPI'}"
			startsSection={true}
			text="{sap.fe.i18n>M_COMMON_TABLE_CONTEXT_MENU_OPEN_IN_NEW_TAB}"
			press={handlerProvider.contextMenuOpenInNewTab}
			enabled="{= ${internal>contextmenu/numberOfSelectedContexts} > 0}"
			visible={visible}
		/>
	);
}

/**
 * Generates the template string for the Menu dependents.
 * @param tableDefinition
 * @param tableType
 * @param contextObjectPath
 * @param handlerProvider
 * @param metaPath
 * @param collection
 * @returns The xml string representation  the Menu dependents
 */
function getDependentsForContextMenu(
	tableDefinition: TableVisualization,
	tableType: TableType,
	contextObjectPath: DataModelObjectPath<LineItem | SelectionPresentationVariant | PresentationVariant>,
	handlerProvider: TableEventHandlerProvider,
	metaPath: Context,
	collection: Context
): UI5Element[] | undefined {
	const dependents: UI5Element[] = [];

	const createAction = tableDefinition.actions.find((a) => a.key === StandardActionKeys.Create) as StandardAction | undefined;
	if (createAction?.isTemplated === "true" && tableType === "TreeTable") {
		dependents.push(
			<CommandExecution
				execute={handlerProvider.getCreateButtonPressHandler(true, false)}
				command="Create::ContextMenu"
				visible={createAction.visible as unknown as boolean}
				enabled={createAction.enabledForContextMenu as unknown as boolean}
			/>
		);
	}

	const cutAction = tableDefinition.actions.find((a) => a.key === StandardActionKeys.Cut) as StandardAction | undefined;
	if (cutAction?.isTemplated === "true") {
		dependents.push(
			<CommandExecution
				execute={handlerProvider.getCutHandler(true)}
				command="Cut::ContextMenu"
				enabled={cutAction.enabledForContextMenu as unknown as boolean}
			/>
		);
	}
	const pasteAction = tableDefinition.actions.find((a) => a.key === StandardActionKeys.Paste) as StandardAction | undefined;
	if (pasteAction?.visible !== "false" && tableType === "TreeTable") {
		dependents.push(
			<CommandExecution
				execute={handlerProvider.getPasteHandler(true)}
				command="Paste::ContextMenu"
				enabled={pasteAction?.enabledForContextMenu as unknown as boolean}
			/>
		);
	}

	const deleteAction = tableDefinition.actions.find((a) => a.key === StandardActionKeys.Delete) as StandardAction | undefined;

	if (deleteAction?.isTemplated === "true") {
		dependents.push(
			<CommandExecution
				execute={handlerProvider.getDeleteButtonPressHandler(true)}
				visible={deleteAction.visible as unknown as boolean}
				enabled={deleteAction.enabledForContextMenu as unknown as boolean}
				command="DeleteEntry::ContextMenu"
			/>
		);
	}

	// Move up and down actions
	const moveUpAction = tableDefinition.actions.find((a) => a.key === StandardActionKeys.MoveUp) as StandardAction | undefined;
	const moveDownAction = tableDefinition.actions.find((a) => a.key === StandardActionKeys.MoveDown) as StandardAction | undefined;
	if (
		moveUpAction &&
		moveDownAction &&
		moveUpAction.visible !== "false" &&
		moveDownAction.visible !== "false" &&
		tableType === "TreeTable"
	) {
		dependents.push(
			<CommandExecution
				execute={handlerProvider.getMoveUpDownHandler(true, true)}
				command="TableMoveElementUp::ContextMenu"
				enabled={moveUpAction.enabledForContextMenu as unknown as boolean}
			/>
		);
		dependents.push(
			<CommandExecution
				execute={handlerProvider.getMoveUpDownHandler(false, true)}
				command="TableMoveElementDown::ContextMenu"
				enabled={moveDownAction.enabledForContextMenu as unknown as boolean}
			/>
		);
	}

	for (const actionName in tableDefinition.commandActions) {
		const action = tableDefinition.commandActions[actionName];
		const actionCommand = getActionCommand(
			actionName,
			action,
			true,
			contextObjectPath.convertedTypes,
			metaPath,
			collection,
			tableDefinition,
			contextObjectPath,
			handlerProvider
		);
		if (actionCommand) {
			dependents.push(actionCommand);
		}
	}
	return dependents.length > 0 ? dependents : undefined;
}

/**
 * Generates the VariantManagement for the table.
 * @param variantManagement
 * @param id
 * @param headerLevel
 * @param handlerProvider
 * @returns The VariantManagement control
 */
function getVariantManagement(
	variantManagement: string,
	id: string,
	headerLevel: TitleLevel,
	handlerProvider: TableEventHandlerProvider
): VariantManagement | undefined {
	if (variantManagement === "Control") {
		return (
			<VariantManagement
				id={generate([id, "VM"])}
				showSetAsDefault={true}
				select={handlerProvider.variantSelected}
				headerLevel={headerLevel}
				save={handlerProvider.variantSaved}
				for={[id]}
			></VariantManagement>
		);
	}
	return undefined;
}

/**
 * Generates the QuickFilterSelector control for the table.
 * @param tableDefinition
 * @param id
 * @param handlerProvider
 * @param metaPath
 * @returns The QuickFilterSelector control
 */
function getQuickFilter(
	tableDefinition: TableVisualization,
	id: string,
	handlerProvider: TableEventHandlerProvider,
	metaPath: string
): QuickFilterSelector | undefined {
	if (tableDefinition.control.filters?.quickFilters) {
		const quickFilters = tableDefinition.control.filters.quickFilters;

		return (
			<QuickFilterSelector
				id={generate([id, "QuickFilterContainer"])}
				metaPath={metaPath}
				filterConfiguration={quickFilters}
				selectionChange={handlerProvider.quickFilterSelectionChange}
			/>
		);
	}
	return undefined;
}

/**
 * Generates CopyProvider for the table.
 * @param tableType
 * @param contextObjectPath
 * @param disableCopyToClipboard
 * @returns The CopyProvider
 */
function getCopyProvider(
	tableType: TableType,
	contextObjectPath: DataModelObjectPath<LineItem | SelectionPresentationVariant | PresentationVariant>,
	disableCopyToClipboard: boolean | undefined
): CopyProvider {
	let visibleExpression: BindingToolkitExpression<boolean>;
	if (disableCopyToClipboard) {
		visibleExpression = constant(false);
	} else if (tableType === "TreeTable") {
		// For a TreeTable, the copy button shall be visible only when drag and drop is disabled
		if (contextObjectPath.startingEntitySet === contextObjectPath.targetEntitySet) {
			// ListReport: enable copy if the entity is not draft-enabled
			visibleExpression = constant((contextObjectPath.startingEntitySet as EntitySet).annotations.Common?.DraftRoot === undefined);
		} else {
			// ObjectPage: enable copy in read-only
			visibleExpression = not(UI.IsEditable);
		}
	} else {
		visibleExpression = constant(true);
	}

	return <CopyProvider visible={visibleExpression} />;
}

/**
 * Generates the CellSelector for the table.
 * @param tableType
 * @param tableDefinition
 * @param contextObjectPath
 * @param disableCopyToClipboard
 * @returns The CellSelector
 */
function getCellSelector(
	tableType: TableType,
	tableDefinition: TableVisualization,
	contextObjectPath: DataModelObjectPath<LineItem | SelectionPresentationVariant | PresentationVariant>,
	disableCopyToClipboard: boolean | undefined
): CellSelector | undefined {
	if (!disableCopyToClipboard && tableType && ["ResponsiveTable", "GridTable", "TreeTable"].includes(tableType)) {
		return (
			<CellSelector
				enabled={or(tableType !== "TreeTable", not(getDragAndDropEnabled(contextObjectPath, tableDefinition)))}
				rangeLimit={200}
			/>
		);
	}
	return undefined;
}

/**
 * Generates the CreationRow for the table.
 * @param creationMode
 * @param tableDefinition
 * @param id
 * @param disableAddRowButtonForEmptyData
 * @param handlerProvider
 * @param customValidationFunction
 * @returns The CreationRow
 */
function getCreationRow(
	creationMode: TableCreationOptions,
	tableDefinition: TableVisualization,
	id: string,
	disableAddRowButtonForEmptyData: boolean,
	handlerProvider: TableEventHandlerProvider,
	customValidationFunction?: string
): CreationRow | undefined {
	if ((creationMode.name as string) === CreationMode.CreationRow) {
		const creationRowAction = tableDefinition.actions.find((a) => a.key === StandardActionKeys.CreationRow) as
			| StandardAction
			| undefined;
		if (creationRowAction?.isTemplated) {
			const customData = createCustomDatas([
				{ key: "disableAddRowButtonForEmptyData", value: disableAddRowButtonForEmptyData },
				{ key: "customValidationFunction", value: customValidationFunction }
			]);

			return (
				<CreationRow
					id={generate([id, CreationMode.CreationRow])}
					visible={creationRowAction.visible as unknown as boolean}
					apply={handlerProvider.getCreateButtonPressHandler(false, true)}
					applyEnabled={creationRowAction.enabled as unknown as boolean}
				>
					{{
						customData: customData
					}}
				</CreationRow>
			);
		}
	}
	return undefined;
}

/**
 * Generates the drag and drop config for the table.
 * @param tableType
 * @param contextObjectPath
 * @param tableDefinition
 * @param handlerProvider
 * @returns The drag and drop config
 */
function getDragAndDropConfig(
	tableType: TableType,
	contextObjectPath: DataModelObjectPath<LineItem | SelectionPresentationVariant | PresentationVariant>,
	tableDefinition: TableVisualization,
	handlerProvider: TableEventHandlerProvider
): DragDropConfig | undefined {
	if (tableType === "TreeTable") {
		return (
			<DragDropConfig
				enabled={compileExpression(getDragAndDropEnabled(contextObjectPath, tableDefinition))}
				dropPosition={tableDefinition.annotation.allowDropBetweenNodes === true ? "OnOrBetween" : "On"}
				draggable={true}
				droppable={true}
				dragStart={handlerProvider.dragStartDocument}
				dragEnter={handlerProvider.dragEnterDocument}
				drop={handlerProvider.dropDocument}
			/>
		);
	}
	return undefined;
}

/**
 * Generates an actionCommand for the table.
 * @param actionName The name of the action
 * @param action Action to be evaluated
 * @param forContextMenu Indicates if the action appears in the context menu. If false, the action appears in the table toolbar
 * @param convertedMetaData
 * @param metaPath
 * @param collection
 * @param tableDefinition
 * @param contextObjectPath
 * @param handlerProvider
 * @returns The actionCommand
 */
function getActionCommand(
	actionName: string,
	action: CustomAction,
	forContextMenu: boolean,
	convertedMetaData: ConvertedMetadata,
	metaPath: Context,
	collection: Context,
	tableDefinition: TableVisualization,
	contextObjectPath: DataModelObjectPath<LineItem | SelectionPresentationVariant | PresentationVariant>,
	handlerProvider: TableEventHandlerProvider
): CommandExecution | undefined {
	const dataField = action.annotationPath
		? (convertedMetaData.resolvePath(action.annotationPath).target as DataFieldForAction | DataFieldForIntentBasedNavigation)
		: undefined;
	const actionContextPath = action.annotationPath
		? CommonHelper.getActionContext(metaPath.getModel().createBindingContext(action.annotationPath + "/Action")!)
		: undefined;
	const actionContext = metaPath.getModel().createBindingContext(actionContextPath);
	const dataFieldDataModelObjectPath = actionContext ? getInvolvedDataModelObjects(actionContext, collection) : undefined;
	const isBound = (dataField as DataFieldForAction)?.ActionTarget?.isBound;
	const isOperationAvailable =
		(dataField as DataFieldForAction)?.ActionTarget?.annotations?.Core?.OperationAvailable?.valueOf() !== false;
	const displayCommandAction = action.type === "ForAction" ? isBound !== true || isOperationAvailable : true;
	const enabled = !forContextMenu ? action.enabled : action.enabledForContextMenu;
	if (displayCommandAction && (!forContextMenu || TableHelper.isActionShownInContextMenu(action, contextObjectPath))) {
		const command = !forContextMenu ? action.command : action.command + "::ContextMenu";

		const parameters = {
			onExecuteAction: handlerProvider.getDataFieldForActionButtonPressHandler(
				dataField as DataFieldForAction,
				action,
				undefined,
				forContextMenu
			),
			onExecuteIBN: handlerProvider.getDataFieldForIBNPressHandler(action, false),
			onExecuteManifest: handlerProvider.getManifestActionPressHandler(action, forContextMenu),
			isIBNEnabled:
				enabled ??
				TableHelper.isDataFieldForIBNEnabled(
					{ collection: collection, tableDefinition: tableDefinition },
					dataField! as DataFieldForIntentBasedNavigation,
					!!(dataField as DataFieldForIntentBasedNavigation).RequiresContext,
					(dataField as DataFieldForIntentBasedNavigation).NavigationAvailable,
					forContextMenu
				),
			isActionEnabled:
				enabled ??
				TableHelper.isDataFieldForActionEnabled(
					tableDefinition,
					(dataField! as DataFieldForAction).Action,
					!!isBound,
					actionContextPath,
					action.enableOnSelect,
					dataFieldDataModelObjectPath?.targetEntityType,
					forContextMenu
				),
			isEnabled: enabled
		};
		return getCommandExecutionForAction(command, tableDefinition.commandActions![actionName], parameters);
	}
	return undefined;
}

/**
 * Generates the template string for the required modules.
 * @param tableDefinition
 * @returns The list of required modules
 */
function getCoreRequire(tableDefinition: TableVisualization): string {
	const customModules = tableDefinition.control.additionalRequiredModules ?? [];

	return `{TableRuntime: 'sap/fe/macros/table/TableRuntime', API: 'sap/fe/macros/table/TableAPI'${customModules
		.map((module: string, index: number) => `, customModule${index + 1}: '${module}'`)
		.join("")}}`;
}

/**
 * Create the template for a custom column that will load a CustomFragment.
 * @param tableId The TableID
 * @param column The custom column definition
 * @param collection The collection context used for context path
 * @returns The the custom column.
 */
export function getCustomColumnTemplate(tableId: string, column: CustomBasedTableColumn, collection: Context): Column {
	return (
		<Column
			id={generate([tableId, "C", column.id])}
			propertyKey={column.name}
			width={column.width}
			header={column.header}
			hAlign={column.horizontalAlign}
			tooltip={column.tooltip}
			required={column.required}
		>
			{{
				extendedSettings: <ResponsiveColumnSettings importance={column.importance} />,
				template: (
					<CustomFragmentBlock id={column.key} fragmentName={column.template} contextPath={collection}>
						{{
							childCustomData: (
								<CustomData
									key="AssociatedProperties"
									value={TableHelper.createBindingToLoadProperties(column.properties)}
								/>
							)
						}}
					</CustomFragmentBlock>
				)
			}}
		</Column>
	);
}

/**
 * Create the template for a computed column.
 * Currently, this represents only the DraftIndicator and the SituationsIndicator.
 * @param tableId The table ID
 * @param column The computed column definition
 * @param collection The collection context used for context path
 * @param enableAnalytics Whether analytics are enabled
 * @returns The computed column.
 */
export function getComputedColumn(
	tableId: string,
	column: ComputedTableColumn,
	collection: Context,
	enableAnalytics: boolean | undefined
): Column | undefined {
	if (column.isDraftIndicator) {
		return (
			<Column
				id={generate([tableId, "C", "computedColumns", "draftStatus"])}
				headerVisible={false}
				propertyKey={column.name}
				header={column.label}
				tooltip={column.tooltip}
				width="3em"
			>
				<DraftIndicator
					draftIndicatorType={ObjectMarkerVisibility.IconOnly}
					contextPath={collection.getPath()}
					usedInTable={true}
					usedInAnalyticalTable={enableAnalytics}
				/>
			</Column>
		);
	} else if (column.isSituationsIndicator) {
		return (
			<Column
				id={generate([tableId, "C", "computedColumns", "situationsIndicator"])}
				propertyKey={column.name}
				header={column.label}
				tooltip={column.tooltip}
				headerVisible={false}
				width="4em"
			>
				<SituationsIndicator contextPath={collection.getPath()} />
			</Column>
		);
	} else {
		return undefined;
	}
}

/**
 * Create the template for a slot column.
 * This column will either reuse a template control that is defined at runtime (templateId case), or define a slot where the XML content is copied.
 * @param tableId The table ID
 * @param column The slot column definition
 * @param isReadOnly Whether the table is read only
 * @returns The slot column.
 */
export function getSlotColumn(tableId: string, column: CustomBasedTableColumn, isReadOnly: boolean | undefined): Column {
	return (
		<Column
			id={generate([tableId, "C", column.id])}
			propertyKey={column.name}
			width={column.width}
			hAlign={column.horizontalAlign}
			header={column.header}
			tooltip={column.tooltip}
			required={isReadOnly ? undefined : column.required}
		>
			{{
				extendedSettings: <ResponsiveColumnSettings importance={column.importance} />,
				template: (
					<SlotColumn templateId={column.template?.startsWith("<") ? undefined : column.template}>
						{{
							content: column.template?.startsWith("<") ? column.template : undefined
						}}
					</SlotColumn>
				)
			}}
		</Column>
	);
}

/**
 * Create the template for the DraftIndicator.
 * @param collection The context of the collection
 * @param column The column definition
 * @returns The XML string representing the DraftIndicator.
 */
function getDraftIndicator(collection: Context, column: AnnotationTableColumn): FormElementWrapper | undefined {
	if (
		collection.getObject("./@com.sap.vocabularies.Common.v1.DraftRoot") &&
		collection.getObject("./@com.sap.vocabularies.Common.v1.SemanticKey") &&
		column.formatOptions?.fieldGroupDraftIndicatorPropertyPath
	) {
		return (
			<FormElementWrapper>
				<DraftIndicator
					draftIndicatorType={ObjectMarkerVisibility.IconAndText}
					contextPath={collection.getPath()}
					visible={getDraftIndicatorVisibleBinding(column.formatOptions?.fieldGroupName)}
					ariaLabelledBy={["this>ariaLabelledBy"]}
				/>
			</FormElementWrapper>
		);
	}
	return undefined;
}

/**
 * Create the SituationIndicator ObjectStatus.
 * @param collection The context of the collection
 * @param column The column definition
 * @returns The ObjectStatus.
 */
function getSituationIndicator(collection: Context, column: AnnotationTableColumn): ObjectStatus | undefined {
	if (
		collection.getObject("./@com.sap.vocabularies.Common.v1.SemanticKey") &&
		column.formatOptions?.fieldGroupDraftIndicatorPropertyPath
	) {
		return (
			<ObjectStatus
				visible={column.formatOptions?.showErrorObjectStatus}
				class="sapUiSmallMarginBottom"
				text="{sap.fe.i18n>Contains_Errors}"
				state="Error"
			/>
		);
	}
	return undefined;
}

/**
 * Determines the default date-time format style based on the given data field context.
 * @param dataFieldContext The context of the data field
 * @returns Returns 'short' if the underlying data field is of the type 'Edm.TimeOfDay', otherwise undefined.
 */
function getDefaultDateTimeStyle(dataFieldContext: Context): DateTimeStyle | undefined {
	const targetObject = getInvolvedDataModelObjects<DataFieldAbstractTypes>(dataFieldContext).targetObject;
	if (isDataField(targetObject) && targetObject.Value?.$target?.type === "Edm.TimeOfDay") {
		return "short";
	}
	if (
		isDataFieldForAnnotation(targetObject) &&
		hasDataPointTarget(targetObject) &&
		(targetObject.Target.$target as DataPoint)?.Value.$target.type === "Edm.TimeOfDay"
	) {
		return "short";
	}
}

/**
 * Create the template for the creation row.
 * @param tableId The table ID
 * @param column The column definition
 * @param tableType The type of the table
 * @param creationMode The creation mode
 * @param isTableReadOnly Whether the table is read only
 * @param collection The collection context
 * @param dataField The data field context
 * @param fieldMode The field mode
 * @param enableAnalytics Whether analytics are enabled
 * @param customValidationFunction The custom validation function
 * @returns The XML string representing the creation row.
 */
function getCreationTemplate(
	tableId: string,
	column: AnnotationTableColumn,
	tableType: TableType,
	creationMode: PropertiesOf<TableCreationOptions>,
	isTableReadOnly: boolean | undefined,
	collection: Context,
	dataField: Context,
	fieldMode: string | undefined,
	enableAnalytics: boolean | undefined,
	customValidationFunction: string | undefined
): string | undefined {
	if ((creationMode.name as string) === "CreationRow") {
		let columnEditMode: string | undefined;
		switch (isTableReadOnly) {
			case true:
				columnEditMode = "Display";
				break;
			case false:
				columnEditMode = "Editable";
				break;
			default:
				columnEditMode = undefined;
				break;
		}
		const dataFieldObject = dataField.getObject();

		return (
			<InternalFieldBlock
				core:require="{TableRuntime: 'sap/fe/macros/table/TableRuntime'}"
				vhIdPrefix={generate([tableId, "TableValueHelp"])}
				editMode={columnEditMode}
				contextPath={collection}
				metaPath={dataField}
				wrap={tableType === "ResponsiveTable"}
				change={`TableRuntime.onFieldChangeInCreationRow($event, '${customValidationFunction ?? ""}')`}
				showErrorObjectStatus={column.formatOptions?.showErrorObjectStatus}
				formatOptions={
					{
						fieldMode: fieldMode,
						textLinesEdit: column.formatOptions?.textLinesEdit,
						textMaxLines: column.formatOptions?.textMaxLines === undefined ? undefined : column.formatOptions?.textMaxLines,
						textMaxLength: column.formatOptions?.textMaxLength,
						textMaxCharactersDisplay: column.formatOptions?.textMaxCharactersDisplay,
						textExpandBehaviorDisplay: column.formatOptions?.textExpandBehaviorDisplay,
						textAlignMode: "Table",
						semanticKeyStyle: tableType === "ResponsiveTable" ? "ObjectIdentifier" : "Label",
						hasDraftIndicator: column.formatOptions?.hasDraftIndicator,
						fieldGroupDraftIndicatorPropertyPath: column.formatOptions?.fieldGroupDraftIndicatorPropertyPath,
						fieldGroupName: column.formatOptions?.fieldGroupName,
						showIconUrl: dataFieldObject?.Inline && dataFieldObject?.IconUrl,
						ignoreNavigationAvailable: enableAnalytics ?? false,
						isCurrencyAligned: true,
						dateTimeStyle: getDefaultDateTimeStyle(dataField)
					} as FieldFormatOptions
				}
			/>
		);
	}
	return undefined;
}

/**
 * Retrieves the template for the macros:Field inside the column.
 * @param tableId The table ID
 * @param tableDefinition The table definition
 * @param column The column definition
 * @param dataFieldContext The data field context
 * @param collection The collection context
 * @param enableAnalytics Whether analytics are enabled
 * @param tableType The type of the table
 * @param isTableReadOnly Whether the table is read only
 * @param creationMode The creation mode
 * @param fieldMode The field mode
 * @param onChangeFunction The on change function
 * @param isCompactType Whether the table is compact
 * @param textAlign The text alignment
 * @param ariaLabelledBy The aria labelled by
 * @param showEmptyIndicator Whether to show the empty indicator
 * @param className
 * @returns The XML string representing the field.
 */
export function getMacroFieldTemplate(
	tableId: string,
	tableDefinition: TableVisualization,
	column: AnnotationTableColumn,
	dataFieldContext: Context,
	collection: Context,
	enableAnalytics: boolean | undefined,
	tableType: TableType,
	isTableReadOnly: boolean | undefined,
	creationMode: PropertiesOf<TableCreationOptions>,
	fieldMode: string | undefined,
	onChangeFunction: string | undefined,
	isCompactType: boolean | undefined,
	textAlign: string | undefined,
	ariaLabelledBy: string | undefined,
	showEmptyIndicator: boolean | undefined,
	className: string | undefined
): string {
	const dataFieldObject = dataFieldContext.getObject();
	let columnEditMode: string | undefined;
	switch (isTableReadOnly) {
		case true:
			columnEditMode = "Display";
			break;
		case false:
			columnEditMode = "Editable";
			break;
		default:
			columnEditMode = undefined;
	}
	if (tableDefinition.control.enableUploadPlugin && column.typeConfig?.className === "Edm.Stream") {
		columnEditMode = "Display";
	}
	return (
		<InternalFieldBlock
			vhIdPrefix={generate([tableId, "TableValueHelp"])}
			editMode={columnEditMode}
			contextPath={collection}
			metaPath={dataFieldContext}
			textAlign={textAlign}
			wrap={tableType === "ResponsiveTable"}
			class={className}
			onLiveChange={creationMode.name === "InlineCreationRows" ? "TableAPI.onFieldLiveChange($event)" : undefined}
			change={onChangeFunction}
			ariaLabelledBy={ariaLabelledBy ? [ariaLabelledBy] : undefined}
			navigateAfterAction={column.isNavigable}
			showErrorObjectStatus={column.formatOptions?.showErrorObjectStatus}
			formatOptions={
				{
					fieldMode: fieldMode,
					textLinesEdit: column.formatOptions?.textLinesEdit,
					textMaxLines: column.formatOptions?.textMaxLines === undefined ? undefined : column.formatOptions?.textMaxLines,
					textMaxCharactersDisplay: column.formatOptions?.textMaxCharactersDisplay,
					textMaxLength: column.formatOptions?.textMaxLength,
					textExpandBehaviorDisplay: column.formatOptions?.textExpandBehaviorDisplay,
					textAlignMode: "Table",
					showEmptyIndicator: showEmptyIndicator,
					semanticKeyStyle: tableType === "ResponsiveTable" ? "ObjectIdentifier" : "Label",
					hasDraftIndicator: column.formatOptions?.hasDraftIndicator,
					fieldGroupDraftIndicatorPropertyPath: column.formatOptions?.fieldGroupDraftIndicatorPropertyPath,
					fieldGroupName: column.formatOptions?.fieldGroupName,
					showIconUrl: dataFieldObject?.Inline && dataFieldObject?.IconUrl,
					ignoreNavigationAvailable: enableAnalytics ?? false,
					isAnalytics: enableAnalytics,
					forInlineCreationRows: creationMode.name === "InlineCreationRows",
					isCurrencyAligned: true,
					compactSemanticKey: isCompactType === undefined ? undefined : `${isCompactType}`,
					dateTimeStyle: getDefaultDateTimeStyle(dataFieldContext)
				} as FieldFormatOptions
			}
		/>
	);
}

/**
 * Create the template for the column.
 * @param tableId The table ID
 * @param tableDefinition The table definition
 * @param column The column definition
 * @param dataFieldOP The data field object path
 * @param dataFieldContext The data field context
 * @param collection The collection context
 * @param enableAnalytics Whether analytics are enabled
 * @param tableType The type of the table
 * @param isTableReadOnly Whether the table is read only
 * @param creationMode The creation mode
 * @param fieldMode The field mode
 * @param onChangeFunction The on change function
 * @param isCompactType Whether the table is compact
 * @param customValidationFunction The custom validation function
 * @returns The XML string representing the column.
 */
function getColumnContentTemplate(
	tableId: string,
	tableDefinition: TableVisualization,
	column: AnnotationTableColumn,
	dataFieldOP: DataModelObjectPath<DataFieldAbstractTypes>,
	dataFieldContext: Context,
	collection: Context,
	enableAnalytics: boolean | undefined,
	tableType: TableType,
	isTableReadOnly: boolean | undefined,
	creationMode: PropertiesOf<TableCreationOptions>,
	fieldMode: string | undefined,
	onChangeFunction: string | undefined,
	isCompactType: boolean | undefined,
	customValidationFunction: string | undefined
): { template: string; creationTemplate?: string } {
	let template: string;
	let creationTemplate: string | undefined;

	const dataField = dataFieldOP.targetObject as DataFieldAbstractTypes;
	if (
		isAnnotationOfType<DataFieldForAnnotation>(dataField, UIAnnotationTypes.DataFieldForAnnotation) &&
		(isAnnotationOfTerm<Chart>(dataField.Target.$target, UIAnnotationTerms.Chart) ||
			isAnnotationOfTerm<PresentationVariant>(dataField.Target.$target, UIAnnotationTerms.PresentationVariant))
	) {
		const showOnlyChart = (tableType === "ResponsiveTable" ? !column.settings?.showMicroChartLabel : undefined) ?? true;
		const microChartSize = tableType === "ResponsiveTable" ? column.settings?.microChartSize ?? "XS" : "XS";
		let microChartCollection = collection
			.getModel()
			.createBindingContext(collection.getPath(dataFieldContext.getObject("Target/$AnnotationPath")));
		microChartCollection = collection.getModel().createBindingContext(CommonHelper.getNavigationContext(microChartCollection));
		//We only consider the first visualization of the PV in PV case and expect it to be a chart (similar to VisualFilters)
		template = (
			<MicroChartBlock
				id={generate([tableId, dataField])}
				contextPath={microChartCollection}
				metaPath={
					isAnnotationOfTerm<PresentationVariant>(dataField.Target.$target, UIAnnotationTerms.PresentationVariant)
						? dataFieldContext
								.getModel()
								.createBindingContext(
									dataFieldContext.getPath() + "/Target/$AnnotationPath/Visualizations/0/$AnnotationPath"
								)
						: dataFieldContext.getModel().createBindingContext(dataFieldContext.getPath() + "/Target/$AnnotationPath")
				}
				showOnlyChart={showOnlyChart}
				size={microChartSize ?? "XS"}
				hideOnNoData={true}
				isAnalytics={enableAnalytics}
			/>
		);
	} else if (
		isAnnotationOfType<DataField>(dataField, UIAnnotationTypes.DataField) &&
		isMultiValueField(enhanceDataModelPath(dataFieldOP, dataField.Value.path))
	) {
		// when evaluating "@$ui5.context.isInactive" we are forced to add isTruthy to force the binding evaluation
		const isReadOnly = compileExpression(
			ifElse(
				or(isTableReadOnly === true, and(isTruthy(UI.IsInactive), creationMode.name === "InlineCreationRows")),
				constant(true),
				ifElse(equal(fieldMode, "nowrapper"), constant(true), constant(undefined))
			)
		);

		template = (
			<MultiValueFieldBlock
				contextPath={collection.getPath()}
				metaPath={dataFieldContext.getPath()}
				readOnly={isReadOnly}
				vhIdPrefix={generate([tableId, "TableValueHelp"])}
				useParentBindingCache={true}
			/>
		);
	} else if (
		isAnnotationOfType<DataFieldForAnnotation>(dataField, UIAnnotationTypes.DataFieldForAnnotation) &&
		isAnnotationOfTerm<FieldGroup>(dataField.Target.$target, UIAnnotationTerms.FieldGroup)
	) {
		const fieldGroup: FieldGroup = dataField.Target.$target;
		const dataFieldCollectionContext = dataFieldContext
			.getModel()
			.createBindingContext(dataFieldContext.getPath() + "/Target/$AnnotationPath/Data");
		const fieldGroupColectionLength = fieldGroup.Data.length - 1;

		const items = fieldGroup.Data.map((fieldGroupDataField: DataFieldAbstractTypes, fieldGroupDataFieldIdx: number) => {
			const fieldGroupDataFieldContext = dataFieldCollectionContext
				.getModel()
				.createBindingContext(dataFieldCollectionContext.getPath() + "/" + fieldGroupDataFieldIdx);
			const fieldGroupDataFieldOP = getInvolvedDataModelObjects<DataFieldAbstractTypes>(fieldGroupDataFieldContext);
			const fieldGroupLabel = FieldHelper.computeLabelText(fieldGroupDataFieldContext.getObject(), {
				context: fieldGroupDataFieldContext
			});
			if (column.showDataFieldsLabel && !!fieldGroupLabel) {
				const resourceBundle = Library.getResourceBundleFor("sap.fe.macros")!;
				return (
					<HBox
						visible={getVisibleExpression(fieldGroupDataFieldOP)}
						alignItems={FieldHelper.buildExpressionForAlignItems(
							fieldGroupDataFieldContext.getObject("Target/$AnnotationPath/Visualization/$EnumMember")
						)}
					>
						<Label
							id={TableHelper.getFieldGroupLabelStableId(tableId, fieldGroupDataFieldOP)}
							text={resourceBundle.getText("HEADER_FORM_LABEL", [fieldGroupLabel])}
							class="sapUiTinyMarginEnd"
							visible={getVisibleExpression(fieldGroupDataFieldOP)}
						/>
						<VBox>
							{{
								layoutData: <FlexItemData growFactor="1" />,
								items: getMacroFieldTemplate(
									tableId,
									tableDefinition,
									column,
									fieldGroupDataFieldContext,
									collection,
									enableAnalytics,
									tableType,
									isTableReadOnly,
									creationMode,
									undefined,
									onChangeFunction,
									isCompactType,
									"Left",
									`${TableHelper.getColumnStableId(tableId, dataFieldOP)} ${TableHelper.getFieldGroupLabelStableId(
										tableId,
										fieldGroupDataFieldOP
									)}`,
									true,
									TableHelper.getMarginClass(
										fieldGroupDataFieldContext.getObject("Target/$AnnotationPath/Visualization/$EnumMember"),
										fieldGroupDataFieldIdx === fieldGroupColectionLength
									)
								)
							}}
						</VBox>
					</HBox>
				);
			} else {
				return getMacroFieldTemplate(
					tableId,
					tableDefinition,
					column,
					fieldGroupDataFieldContext,
					collection,
					enableAnalytics,
					tableType,
					isTableReadOnly,
					creationMode,
					fieldMode,
					onChangeFunction,
					isCompactType,
					undefined,
					TableHelper.getColumnStableId(tableId, dataFieldOP),
					undefined,
					TableHelper.getMarginClass(
						fieldGroupDataFieldContext.getObject("Target/$AnnotationPath/Visualization/$EnumMember"),
						fieldGroupDataFieldIdx === fieldGroupColectionLength
					)
				);
			}
		});

		const draftIndicator = getDraftIndicator(collection, column);
		if (draftIndicator) {
			items.push(draftIndicator);
		}
		const situationIndicator = getSituationIndicator(collection, column);
		if (situationIndicator) {
			items.push(situationIndicator);
		}

		template = (
			<VBox
				visible={TableHelper.getVBoxVisibility(
					dataFieldCollectionContext.getObject(),
					column.FieldGroupHiddenExpressions,
					dataFieldContext.getObject()
				)}
			>
				{{
					items: items
				}}
			</VBox>
		);
	} else {
		template = getMacroFieldTemplate(
			tableId,
			tableDefinition,
			column,
			dataFieldContext,
			collection,
			enableAnalytics,
			tableType,
			isTableReadOnly,
			creationMode,
			fieldMode,
			onChangeFunction,
			isCompactType,
			undefined,
			undefined,
			false,
			undefined
		);
		creationTemplate = getCreationTemplate(
			tableId,
			column,
			tableType,
			creationMode,
			isTableReadOnly,
			collection,
			dataFieldContext,
			fieldMode,
			enableAnalytics,
			customValidationFunction
		);
	}

	return { template, creationTemplate };
}

/**
 * Create the template for a column.
 * @param tableId The table ID
 * @param tableDefinition The table definition
 * @param column The column definition
 * @param collection The collection context used for context path
 * @param isReadOnly Whether the table is read only
 * @param enableAutoColumnWidth Whether the column width is automatically calculated
 * @param widthIncludingColumnHeader Whether the column width includes the column header
 * @param enableAnalytics Whether analytics are enabled
 * @param tableType The type of the table
 * @param creationMode The creation mode
 * @param fieldMode The field mode
 * @param onChangeFunction The on change function
 * @param isCompactType Whether the table is compact
 * @param customValidationFunction The custom validation function
 * @returns The XML string representing the column.
 */
export function getColumnTemplate(
	tableId: string,
	tableDefinition: TableVisualization,
	column: AnnotationTableColumn,
	collection: Context,
	isReadOnly: boolean | undefined,
	enableAutoColumnWidth: boolean,
	widthIncludingColumnHeader: boolean | undefined,
	enableAnalytics: boolean | undefined,
	tableType: TableType,
	creationMode: PropertiesOf<TableCreationOptions>,
	fieldMode: string | undefined,
	onChangeFunction: string | undefined,
	isCompactType: boolean | undefined,
	customValidationFunction: string | undefined
): Column | undefined {
	let dataFieldContext = collection.getModel().createBindingContext(column.annotationPath);
	if (!dataFieldContext) {
		return undefined;
	}
	dataFieldContext = collection.getModel().createBindingContext(FieldHelper.getDataFieldDefault(dataFieldContext));
	const dataFieldObjectModelPath = getInvolvedDataModelObjects<DataFieldAbstractTypes>(dataFieldContext, collection);
	const dataFieldObject = dataFieldContext?.getObject?.() ?? {};

	const templates = getColumnContentTemplate(
		tableId,
		tableDefinition,
		column,
		dataFieldObjectModelPath,
		dataFieldContext,
		collection,
		enableAnalytics,
		tableType,
		isReadOnly,
		creationMode,
		fieldMode,
		onChangeFunction,
		isCompactType,
		customValidationFunction
	);

	return (
		<Column
			id={TableHelper.getColumnStableId(tableId, dataFieldObjectModelPath)}
			width={
				!CommonUtils.isSmallDevice() || column.width
					? TableHelper.getColumnWidth(
							{ enableAutoColumnWidth, widthIncludingColumnHeader, tableType },
							column,
							dataFieldObject,
							TableHelper.getTextOnActionField(dataFieldObject, { context: dataFieldContext }),
							dataFieldObjectModelPath,
							true,
							{
								title: dataFieldContext.getObject("Target/$AnnotationPath/Title") || "",
								description: dataFieldContext.getObject("Target/$AnnotationPath/Title") || ""
							}
					  )
					: undefined
			}
			minWidth={
				CommonUtils.isSmallDevice()
					? TableHelper.getColumnWidth(
							{ enableAutoColumnWidth, widthIncludingColumnHeader, tableType },
							column,
							dataFieldObject,
							TableHelper.getTextOnActionField(dataFieldObject, { context: dataFieldContext }),
							dataFieldObjectModelPath,
							false,
							{
								title: dataFieldContext.getObject("Target/$AnnotationPath/Title") || "",
								description: dataFieldContext.getObject("Target/$AnnotationPath/Description") || ""
							}
					  )
					: undefined
			}
			header={column.label || column.name}
			propertyKey={column.name}
			hAlign={column.horizontalAlign || FieldHelper.getColumnAlignment(dataFieldObject, { collection: collection })}
			headerVisible={TableHelper.setHeaderLabelVisibility(dataFieldObject, dataFieldContext.getObject("Target/$AnnotationPath/Data"))}
			tooltip={column.tooltip}
			required={isReadOnly ? undefined : column.required}
		>
			{{
				customData: createCustomData("showDataFieldsLabel", column.showDataFieldsLabel),
				extendedSettings: <ResponsiveColumnSettings importance={column.importance} />,
				template: templates.template,
				creationTemplate: templates.creationTemplate
			}}
		</Column>
	);
}

/**
 * Create the template for all the columns in the table.
 * @param tableId The table ID
 * @param tableDefinition The table definition
 * @param columns The list of columns
 * @param collection The collection context used for context path
 * @param isReadOnly Whether the table is read only
 * @param enableAutoColumnWidth Whether the column width is automatically calculated
 * @param widthIncludingColumnHeader Whether the column width includes the column header
 * @param enableAnalytics Whether analytics are enabled
 * @param tableType The type of the table
 * @param creationMode The creation mode
 * @param fieldMode The field mode
 * @param onChangeFunction The on change function
 * @param isCompactType Whether the table is compact
 * @param customValidationFunction The custom validation function
 * @returns The XML string representing the columns.
 */
function getColumns(
	tableId: string,
	tableDefinition: TableVisualization,
	columns: TableColumn[],
	collection: Context,
	isReadOnly: boolean | undefined,
	enableAutoColumnWidth: boolean,
	widthIncludingColumnHeader: boolean | undefined,
	enableAnalytics: boolean | undefined,
	tableType: TableType,
	creationMode: TableCreationOptions,
	fieldMode: string | undefined,
	onChangeFunction: undefined,
	isCompactType: boolean | undefined,
	customValidationFunction?: string
): Column[] {
	return columns
		.map((column) => {
			if (column.availability === "Default" && column.type === "Default") {
				return getCustomColumnTemplate(tableId, column as CustomBasedTableColumn, collection);
			} else if (column.availability === "Default" && column.type === "Annotation") {
				return getColumnTemplate(
					tableId,
					tableDefinition,
					column as AnnotationTableColumn,
					collection,
					isReadOnly,
					enableAutoColumnWidth,
					widthIncludingColumnHeader,
					enableAnalytics,
					tableType,
					creationMode,
					fieldMode,
					onChangeFunction,
					isCompactType,
					customValidationFunction
				);
			} else if (column.availability === "Default" && column.type === "Slot") {
				return getSlotColumn(tableId, column as CustomBasedTableColumn, isReadOnly);
			} else if (column.availability === "Default" && column.type === "Computed") {
				return getComputedColumn(tableId, column as ComputedTableColumn, collection, enableAnalytics);
			}

			return undefined;
		})
		.filter((column) => column !== undefined) as Column[];
}

export type TableBlockProperties = Omit<StrictPropertiesOf<TableAPI>, "metaPath" | "contextPath"> & {
	getTranslatedText(text: string, parameters?: unknown[], metaPath?: string): string;
	["fl:flexibility"]?: string;
	metaPath: Context;
	contextPath: Context;
	convertedMetadata: ConvertedMetadata;
	contextObjectPath: DataModelObjectPath<LineItem | PresentationVariant | SelectionPresentationVariant>;
	isPublic: boolean;
};
/**
 * Determines the designtime for the MDC table.
 * @returns The value to be assigned to dt:designtime
 */
function getDesigntime(): string | undefined {
	return "sap/fe/macros/table/designtime/Table.designtime";
}

/**
 * Maps an internal P13n talbr mode (string) to the MDC enum.
 * @param stringMode
 * @returns The MDC enum value
 */
function getMDCP13nMode(stringMode: string): TableP13nMode {
	switch (stringMode) {
		case "Aggregate":
			return TableP13nMode.Aggregate;
		case "Sort":
			return TableP13nMode.Sort;
		case "Column":
			return TableP13nMode.Column;
		case "Filter":
			return TableP13nMode.Filter;
		case "Group":
			return TableP13nMode.Group;
		default:
			Log.error("Unknown P13n mode: " + stringMode);
			return TableP13nMode.Column;
	}
}

export function getMDCTableTemplate(
	tableProperties: TableBlockProperties,
	convertedMetadata: ConvertedMetadata,
	odataMetaModel: ODataMetaModel,
	handlerProvider: TableEventHandlerProvider,
	appComponent: AppComponent
): MDCTable {
	tableProperties.convertedMetadata = convertedMetadata;
	// For a TreeTable in a ListReport displaying a draft-enabled entity, we only display active instances
	const contextObjectPath = getInvolvedDataModelObjects<LineItem | PresentationVariant | SelectionPresentationVariant>(
		tableProperties.metaPath,
		tableProperties.contextPath
	);
	const navigationInfo = tableProperties.tableDefinition.annotation?.row?.navigationInfo as {
		routePath?: string;
		navigationInEditMode?: boolean;
	};
	const target = navigationInfo?.routePath;
	let navigationInEditMode = false;
	if (target) {
		const targetInformation = appComponent.getRoutingService()._getTargetInformation(target);
		navigationInEditMode = (targetInformation?.options?.settings?.openInEditMode as boolean | undefined) ?? false;
	}

	tableProperties.contextObjectPath = contextObjectPath;
	const tableType = tableProperties.tableDefinition.control.type;
	const filterOnActiveEntities =
		(tableType === "TreeTable" || tableProperties.tableDefinition.enableAnalytics === true) &&
		contextObjectPath.startingEntitySet === contextObjectPath.targetEntitySet &&
		ModelHelper.isObjectPathDraftSupported(contextObjectPath);
	const delegate = TableHelper.getDelegate(
		tableProperties.tableDefinition,
		tableProperties.isAlp === true,
		tableProperties.tableDefinition.annotation.entityName,
		filterOnActiveEntities
	);
	const headerVisible = tableProperties.headerVisible ?? tableProperties.tableDefinition.control.headerVisible;
	const currentHeader = tableProperties.header ?? tableProperties.tableDefinition.annotation.title;
	const headerBindingExpression = buildExpressionForHeaderVisible(currentHeader ?? "", tableProperties.tabTitle ?? "", !!headerVisible);
	const pasteAction = tableProperties.tableDefinition.actions.find((a) => a.key === StandardActionKeys.Paste);
	const collectionEntity = convertedMetadata.resolvePath(tableProperties.tableDefinition.annotation.collection).target as
		| EntitySet
		| NavigationProperty;
	const modelContextChange = tableType === "TreeTable" ? handlerProvider.tableContextChange : undefined;
	const lineItem = TableHelper.getUiLineItemObject(tableProperties.metaPath, convertedMetadata) as
		| DataFieldForIntentBasedNavigation[]
		| undefined;
	const navigationPath = tableProperties.tableDefinition.annotation.navigationPath;
	if (tableProperties.tableDefinition.annotation.collection.startsWith("/") && isSingleton(contextObjectPath.startingEntitySet)) {
		tableProperties.tableDefinition.annotation.collection = navigationPath;
	}

	const collectionContext = odataMetaModel.createBindingContext(tableProperties.tableDefinition.annotation.collection)!;
	const draft = (collectionEntity as EntitySet).annotations.Common?.DraftRoot;
	// Add the definition of the designtime file if designtime is enabled from core or locally via url parameters
	const variantManagement = tableProperties.isPublic
		? tableProperties.variantManagement ?? "None"
		: tableProperties.tableDefinition.annotation.variantManagement;
	const designtime = getDesigntime();
	let rowAction: string | undefined;
	if (tableProperties.rowPressHandlerPath) {
		rowAction = "Navigation";
	}
	rowAction ??= tableProperties.tableDefinition.annotation.row?.action;

	const showCreate = tableProperties.tableDefinition.actions.find((a) => a.key === StandardActionKeys.Create)?.visible || true;
	const disableCopyToClipboard = tableProperties.tableDefinition.control.disableCopyToClipboard;
	/**
	 * Specifies whether the button is hidden when no data has been entered yet in the row (true/false). The default setting is `false`.
	 */
	const disableAddRowButtonForEmptyData = tableProperties.tableDefinition.control.disableAddRowButtonForEmptyData;
	const updatablePropertyPath = tableProperties.tableDefinition.annotation.updatablePropertyPath;

	let currentPersonalization: TableP13nMode[] | undefined;
	switch (tableProperties.personalization) {
		case "false":
			currentPersonalization = undefined;
			break;
		case "true":
			currentPersonalization = [TableP13nMode.Sort, TableP13nMode.Column, TableP13nMode.Filter];
			break;
		case undefined:
			currentPersonalization = tableProperties.tableDefinition.annotation.p13nMode?.map((mode) => getMDCP13nMode(mode));
			break;
		default:
			currentPersonalization = tableProperties.personalization.split(",").map((mode) => getMDCP13nMode(mode.trim()));
	}

	const multiSelectDisabledActions = ActionHelper.getMultiSelectDisabledActions(lineItem);

	const customData = [
		{ key: "kind", value: collectionEntity._type },
		{ key: "navigationPath", value: navigationPath },
		{ key: "enableAnalytics", value: tableProperties.tableDefinition.enableAnalytics },
		{ key: "creationMode", value: tableProperties.creationMode.name },
		{ key: "inlineCreationRowCount", value: tableProperties.tableDefinition.control.inlineCreationRowCount },
		{ key: "showCreate", value: showCreate },
		{ key: "createAtEnd", value: tableProperties.creationMode.createAtEnd },
		{ key: "displayModePropertyBinding", value: tableProperties.readOnly },
		{ key: "tableType", value: tableType },
		{ key: "targetCollectionPath", value: collectionContext.getPath() },
		{ key: "entityType", value: collectionContext.getPath() + "/" },
		{ key: "metaPath", value: collectionContext.getPath() },
		{ key: "onChange", value: "" },
		{ key: "hiddenFilters", value: tableProperties.tableDefinition.control.filters?.hiddenFilters },
		{ key: "requestGroupId", value: "$auto.Workers" },
		{ key: "segmentedButtonId", value: generate([tableProperties.id, "SegmentedButton", "TemplateContentView"]) },
		{ key: "enablePaste", value: tableType === "TreeTable" ? false : pasteAction?.enabled },
		{ key: "disableCopyToClipboard", value: disableCopyToClipboard },
		{ key: "operationAvailableMap", value: CommonHelper.stringifyCustomData(tableProperties.tableDefinition.operationAvailableMap) },
		{ key: "draft", value: draft },
		{ key: "navigationAvailableMap", value: TableHelper.getNavigationAvailableMap(lineItem) },
		{
			key: "actionsMultiselectDisabled",
			value: multiSelectDisabledActions.length > 0 ? multiSelectDisabledActions.join(",") : undefined
		},
		{ key: "updatablePropertyPath", value: updatablePropertyPath || "" },
		{ key: "exportRequestSize", value: tableProperties.tableDefinition.control.exportRequestSize }
	];

	return (
		<MDCTable
			core:require={getCoreRequire(tableProperties.tableDefinition)}
			fl:flexibility={tableProperties["fl:flexibility"]}
			sortConditions={tableProperties.tableDefinition.annotation.sortConditions}
			groupConditions={tableProperties.tableDefinition.annotation.groupConditions}
			aggregateConditions={tableProperties.tableDefinition.annotation.aggregateConditions}
			dt:designtime={designtime}
			id={tableProperties.id}
			busy={tableProperties.busy}
			busyIndicatorDelay={0}
			enableExport={tableProperties.tableDefinition.control.enableExport}
			delegate={delegate}
			rowPress={tableType === "ResponsiveTable" ? handlerProvider.rowPress : undefined}
			beforeOpenContextMenu={handlerProvider.beforeOpenContextMenu}
			autoBindOnInit={tableProperties.useBasicSearch || !tableProperties.filterBar}
			selectionMode={tableProperties.tableDefinition.annotation.selectionMode || "None"}
			selectionChange={handlerProvider.selectionChange}
			showRowCount={tableProperties.tableDefinition.control.showRowCount}
			header={currentHeader}
			headerVisible={headerBindingExpression}
			headerLevel={tableProperties.headerLevel}
			headerStyle={tableProperties.headerStyle}
			threshold={tableProperties.tableDefinition.annotation.threshold}
			p13nMode={currentPersonalization}
			paste={handlerProvider.getPasteHandler(false)}
			beforeExport={handlerProvider.beforeExport}
			class={tableProperties.tableDefinition.control.useCondensedTableLayout === true ? "sapUiSizeCondensed" : undefined}
			multiSelectMode={tableProperties.tableDefinition.control.multiSelectMode}
			showPasteButton={tableType === "TreeTable" ? false : pasteAction?.visible}
			enablePaste={tableType === "TreeTable" ? false : pasteAction?.enabled}
			visible={tableProperties.visible}
			modelContextChange={modelContextChange}
		>
			{{
				customData: createCustomDatas(customData),
				dataStateIndicator: getDataStateIndicator(handlerProvider),
				type: getTableType(
					tableProperties.tableDefinition,
					collectionContext,
					tableType,
					tableProperties.tableDefinition.control.selectionLimit
				),
				dependents: getDependents(
					tableProperties.id,
					tableProperties.tableDefinition,
					tableType,
					tableProperties.readOnly,
					contextObjectPath,
					variantManagement,
					handlerProvider,
					tableProperties.metaPath,
					collectionContext
				),
				actions: getActions(tableProperties, handlerProvider, collectionContext, collectionEntity),
				rowSettings: getRowSettings(tableProperties.tableDefinition, rowAction, tableType, handlerProvider),
				contextMenu: getContextMenu(
					tableProperties,
					tableType,
					tableProperties.tableDefinition,
					collectionEntity,
					rowAction,
					handlerProvider,
					contextObjectPath,
					tableProperties.metaPath,
					collectionContext,
					navigationInEditMode
				),
				columns: getColumns(
					tableProperties.id,
					tableProperties.tableDefinition,
					tableProperties.tableDefinition.columns,
					collectionContext,
					tableProperties.readOnly,
					tableProperties.enableAutoColumnWidth,
					tableProperties.tableDefinition.control.widthIncludingColumnHeader,
					tableProperties.tableDefinition.enableAnalytics,
					tableType,
					tableProperties.creationMode,
					tableProperties.fieldMode,
					undefined,
					tableProperties.tableDefinition.control.isCompactType,
					tableProperties.tableDefinition.control.customValidationFunction
				),
				dragDropConfig: getDragAndDropConfig(tableType, contextObjectPath, tableProperties.tableDefinition, handlerProvider),
				creationRow: getCreationRow(
					tableProperties.creationMode,
					tableProperties.tableDefinition,
					tableProperties.id,
					disableAddRowButtonForEmptyData,
					handlerProvider,
					tableProperties.tableDefinition.control.customValidationFunction
				),
				variant: getVariantManagement(variantManagement, tableProperties.id, tableProperties.headerLevel, handlerProvider),
				quickFilter: getQuickFilter(
					tableProperties.tableDefinition,
					tableProperties.id,
					handlerProvider,
					tableProperties.metaPath.getPath()
				),
				copyProvider: getCopyProvider(tableType, contextObjectPath, disableCopyToClipboard),
				cellSelector: getCellSelector(tableType, tableProperties.tableDefinition, contextObjectPath, disableCopyToClipboard)
			}}
		</MDCTable>
	);
}
