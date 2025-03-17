import type { Action } from "@sap-ux/vocabularies-types/Edm";
import type {
	DataFieldAbstractTypes,
	DataFieldForAction,
	DataFieldForIntentBasedNavigation
} from "@sap-ux/vocabularies-types/vocabularies/UI";

import type { EntitySet, NavigationProperty } from "@sap-ux/vocabularies-types";
import { and, compileExpression, equal, notEqual, pathInModel } from "sap/fe/base/BindingToolkit";
import { ActionType } from "sap/fe/core/converters/ManifestSettings";
import * as MetaModelConverter from "sap/fe/core/converters/MetaModelConverter";
import {
	isActionWithDialog,
	isDataFieldForAction,
	isDataFieldForIntentBasedNavigation
} from "sap/fe/core/converters/annotations/DataField";
import type { AnnotationAction, BaseAction, CustomAction } from "sap/fe/core/converters/controls/Common/Action";
import { ButtonType } from "sap/fe/core/converters/controls/Common/Action";
import type { CreateBehaviorExternal } from "sap/fe/core/converters/controls/Common/Table";
import type { StandardAction } from "sap/fe/core/converters/controls/Common/table/StandardActions";
import { StandardActionKeys } from "sap/fe/core/converters/controls/Common/table/StandardActions";
import ModelHelper from "sap/fe/core/helpers/ModelHelper";
import { generate } from "sap/fe/core/helpers/StableIdHelper";
import CommonHelper from "sap/fe/macros/CommonHelper";
import { createCustomData } from "sap/fe/macros/TSXUtils";
import type { CustomAndAction } from "sap/fe/macros/chart/MdcChartTemplate";
import type { TableBlockProperties } from "sap/fe/macros/table/MdcTableTemplate";
import TableFullScreenButton from "sap/fe/macros/table/TableFullScreenButton";
import TableHelper from "sap/fe/macros/table/TableHelper";
import Button from "sap/m/Button";
import Menu from "sap/m/Menu";
import MenuButton from "sap/m/MenuButton";
import MenuItem from "sap/m/MenuItem";
import OverflowToolbarLayoutData from "sap/m/OverflowToolbarLayoutData";
import { MenuButtonMode } from "sap/m/library";
import ActionsPlaceholder from "sap/m/upload/ActionsPlaceholder";
import type UI5Event from "sap/ui/base/Event";
import type Control from "sap/ui/core/Control";
import ActionToolbarAction from "sap/ui/mdc/actiontoolbar/ActionToolbarAction";
import type Context from "sap/ui/model/Context";
import ActionHelper from "../internal/helpers/ActionHelper";
import BasicSearchMacro from "./BasicSearch";
import type TableEventHandlerProvider from "./TableEventHandlerProvider";

/**
 * Generates the MenuItem for the DataFieldForAction.
 * @param dataField DataField for action
 * @param action The name of the action
 * @param menuItemAction The menuItemAction to be evaluated
 * @param table The instance of the table building block
 * @param forContextMenu Indicates if the action appears in the context menu. If false, the action appears in the table toolbar
 * @param collectionContext The context of the collection
 * @param handlerProvider
 * @returns The MenuItem
 */
function getMenuItemForAction(
	dataField: DataFieldForAction,
	action: BaseAction | AnnotationAction | CustomAction,
	menuItemAction: BaseAction,
	table: TableBlockProperties,
	forContextMenu: boolean,
	collectionContext: Context,
	handlerProvider: TableEventHandlerProvider
): MenuItem | undefined {
	if (!menuItemAction.annotationPath) {
		return undefined;
	}
	const actionContextPath = CommonHelper.getActionContext(
		table.metaPath.getModel().createBindingContext(menuItemAction.annotationPath + "/Action")!
	);
	const actionContext = table.metaPath.getModel().createBindingContext(actionContextPath);
	const dataFieldDataModelObjectPath = actionContext
		? MetaModelConverter.getInvolvedDataModelObjects(actionContext, collectionContext)
		: undefined;
	const isBound = dataField.ActionTarget?.isBound;
	const isOperationAvailable = dataField.ActionTarget?.annotations?.Core?.OperationAvailable?.valueOf() !== false;
	const command = !forContextMenu ? menuItemAction.command : menuItemAction.command + "::ContextMenu";
	const contextMenuText = forContextMenu ? "ContextMenu" : "ActionMenu";
	const pressHandler = menuItemAction.command
		? undefined
		: handlerProvider.getDataFieldForActionButtonPressHandler(dataField, menuItemAction, action, forContextMenu);
	const pressCommand = menuItemAction.command ? `cmd:${command}|press` : undefined;
	const enabled =
		menuItemAction.enabled !== undefined
			? menuItemAction.enabled
			: TableHelper.isDataFieldForActionEnabled(
					table.tableDefinition,
					dataField.Action,
					!!isBound,
					actionContext.getObject(),
					menuItemAction.enableOnSelect,
					dataFieldDataModelObjectPath?.targetEntityType,
					forContextMenu
			  );
	if (isBound !== true || isOperationAvailable) {
		const itemId = generate([table.id, menuItemAction.key, action.key, contextMenuText, dataField, "MenuItemForAction"]);
		return (
			<MenuItem
				text={dataField.Label}
				id={itemId}
				press={pressHandler}
				jsx:command={pressCommand}
				enabled={enabled}
				visible={menuItemAction.visible}
			>
				{{
					customData: [createCustomData("actionId", itemId)]
				}}
			</MenuItem>
		);
	} else {
		return undefined;
	}
}

/**
 * Generates the MenuItem for the DataFieldForIntentBasedNavigation.
 * @param dataField DataField for IntentBasedNavigation
 * @param menuItemAction The menuItemAction to be evaluated
 * @param table The instance of the table building block
 * @param forContextMenu Indicates if the action appears in the context menu. If false, the action appears in the table toolbar
 * @param collectionContext The context of the collection
 * @param action
 * @param handlerProvider
 * @returns The MenuItem
 */
function getMenuItemForIntentBasedNavigation(
	dataField: DataFieldForIntentBasedNavigation,
	menuItemAction: BaseAction,
	table: TableBlockProperties,
	forContextMenu = false,
	collectionContext: Context,
	action: BaseAction | AnnotationAction | CustomAction,
	handlerProvider: TableEventHandlerProvider
): MenuItem {
	const pressHandler = menuItemAction.command
		? undefined
		: handlerProvider.getDataFieldForIBNPressHandler(menuItemAction, forContextMenu);
	const pressCommand = menuItemAction.command ? `cmd:${menuItemAction.command}|press` : undefined;

	const enabled =
		menuItemAction.enabled !== undefined
			? menuItemAction.enabled
			: TableHelper.isDataFieldForIBNEnabled(
					{
						collection: collectionContext,
						tableDefinition: table.tableDefinition
					},
					dataField,
					dataField.RequiresContext,
					dataField.NavigationAvailable,
					forContextMenu
			  );
	const id = forContextMenu
		? generate([table.id, menuItemAction.key, action.key, dataField, "MenuItemIntentBasedNavigation", "ContextMenu"])
		: generate([table.id, menuItemAction.key, action.key, dataField, "MenuItemIntentBasedNavigation"]);
	return (
		<MenuItem
			text={dataField.Label}
			id={id}
			press={pressHandler}
			jsx:command={pressCommand}
			enabled={enabled}
			visible={menuItemAction.visible}
		>
			{{
				customData: [
					!dataField.RequiresContext
						? createCustomData("IBNData", `{semanticObject: '${dataField.SemanticObject}' , action : '${dataField.Action}'}`)
						: undefined,
					createCustomData("actionId", id)
				]
			}}
		</MenuItem>
	);
}

/**
 * Generates the xml string for the MenuItem based on the type of the menuItemAction.
 * @param action The name of the action
 * @param menuItemAction The menuItemAction to be evaluated
 * @param table The instance of the table building block
 * @param forContextMenu Indicates if the action appears in the context menu. If false, the action appears in the table toolbar
 * @param collectionContext The context of the collection
 * @param handlerProvider The entity set of the collection
 * @returns The xml string for the MenuItem
 */
function getMenuItem(
	action: BaseAction | AnnotationAction | CustomAction,
	menuItemAction: BaseAction,
	table: TableBlockProperties,
	forContextMenu: boolean,
	collectionContext: Context,
	handlerProvider: TableEventHandlerProvider
): MenuItem | undefined {
	const dataField = menuItemAction.annotationPath
		? (table.convertedMetadata.resolvePath(menuItemAction.annotationPath).target as DataFieldAbstractTypes)
		: undefined;

	switch (dataField && menuItemAction.type) {
		case "ForAction":
			if (isDataFieldForAction(dataField)) {
				if (
					!forContextMenu ||
					(forContextMenu && TableHelper.isActionShownInContextMenu(menuItemAction, table.contextObjectPath))
				) {
					return getMenuItemForAction(
						dataField,
						action,
						menuItemAction,
						table,
						forContextMenu,
						collectionContext,
						handlerProvider
					);
				}
			}
			break;
		case "ForNavigation":
			if (
				isDataFieldForIntentBasedNavigation(dataField!) &&
				(!forContextMenu || (forContextMenu && TableHelper.isActionShownInContextMenu(menuItemAction, table.contextObjectPath)))
			) {
				return getMenuItemForIntentBasedNavigation(
					dataField,
					menuItemAction,
					table,
					forContextMenu,
					collectionContext,
					action,
					handlerProvider
				);
			}
			break;
		default:
	}

	const command = !forContextMenu ? menuItemAction.command : menuItemAction.command + "::ContextMenu";
	const pressHandler = menuItemAction.command
		? undefined
		: handlerProvider.getManifestActionPressHandler(menuItemAction as CustomAction, forContextMenu);
	const pressCommand = menuItemAction.command ? `cmd:${command}|press` : undefined;
	const enabled = !forContextMenu ? menuItemAction.enabled : (menuItemAction as CustomAction).enabledForContextMenu;
	const contextMenuText = forContextMenu ? "ContextMenu" : "ActionMenu";
	const itemId = generate([table.id, menuItemAction.key, contextMenuText, action.key, dataField, "MenuItem"]);
	return (
		<MenuItem
			core:require="{FPM: 'sap/fe/core/helpers/FPMHelper'}"
			text={menuItemAction?.text}
			id={itemId}
			press={pressHandler}
			jsx:command={pressCommand}
			visible={menuItemAction.visible}
			enabled={enabled}
		>
			{{
				customData: [createCustomData("actionId", itemId)]
			}}
		</MenuItem>
	);
}

/**
 * Generates the control for the DataFieldForActionButton.
 * @param dataField DataField for action
 * @param action The name of the action
 * @param table The instance of the table building block
 * @param forContextMenu Indicates if the action appears in the context menu. If false, the action appears in the table toolbar
 * @param collectionContext The context of the collection
 * @param handlerProvider
 * @returns The control for the DataFieldForActionButton
 */
function getDataFieldButtonForAction(
	dataField: DataFieldForAction,
	action: BaseAction | AnnotationAction | CustomAction,
	table: TableBlockProperties,
	forContextMenu: boolean,
	collectionContext: Context,
	handlerProvider: TableEventHandlerProvider
): Button | MenuItem {
	const dataFieldActionContext = table.metaPath.getModel().createBindingContext(action.annotationPath + "/Action");
	const actionContextPath = CommonHelper.getActionContext(dataFieldActionContext);
	const actionContext = table.metaPath.getModel().createBindingContext(actionContextPath);
	const dataFieldDataModelObjectPath = actionContext
		? MetaModelConverter.getInvolvedDataModelObjects<Action>(actionContext, collectionContext)
		: undefined;
	const isBound = dataField.ActionTarget?.isBound;
	const command = !forContextMenu ? action.command : action.command + "::ContextMenu";
	const pressHandler = action.command
		? undefined
		: handlerProvider.getDataFieldForActionButtonPressHandler(dataField, action, undefined, forContextMenu);
	const pressCommand = action.command ? `cmd:${command}|press` : undefined;
	const enabled =
		action.enabled !== undefined
			? action.enabled
			: TableHelper.isDataFieldForActionEnabled(
					table.tableDefinition,
					dataField.Action,
					!!isBound,
					actionContext.getObject(),
					action.enableOnSelect,
					dataFieldDataModelObjectPath?.targetEntityType,
					forContextMenu
			  );
	if (!forContextMenu) {
		// for table toolbar
		const toolbarActionId = generate([table.id, dataField]);
		return (
			<Button
				id={toolbarActionId}
				text={dataField.Label}
				ariaHasPopup={isActionWithDialog(dataField)}
				press={pressHandler}
				jsx:command={pressCommand}
				type={ButtonType.Transparent}
				enabled={enabled}
				visible={action.visible}
			>
				{{
					customData: [createCustomData("actionId", toolbarActionId)]
				}}
			</Button>
		);
	} else {
		// for context menu
		const tableActionContextMenuId = generate([table.id, dataField, "ContextMenu"]);
		return (
			<MenuItem
				id={tableActionContextMenuId}
				text={dataField.Label}
				press={pressHandler}
				jsx:command={pressCommand}
				enabled={enabled}
				visible={action.visibleForContextMenu}
			>
				{{
					customData: [createCustomData("actionId", tableActionContextMenuId)]
				}}
			</MenuItem>
		);
	}
}

/**
 * Generates the control for the DataFieldForIntentBasedNavigation Button.
 * @param dataField DataField for IntentBasedNavigation
 * @param action The name of the action
 * @param table The instance of the table building block
 * @param forContextMenu Indicates if the action appears in the context menu. If false, the action appears in the table toolbar
 * @param collectionContext The context of the collection
 * @param handlerProvider
 * @returns The control for the DataFieldForIntentBasedNavigation button/menu item
 */
function getDataFieldButtonForIntentBasedNavigation(
	dataField: DataFieldForIntentBasedNavigation,
	action: BaseAction | AnnotationAction | CustomAction,
	table: TableBlockProperties,
	forContextMenu: boolean,
	collectionContext: Context,
	handlerProvider: TableEventHandlerProvider
): Button | MenuItem {
	const command = !forContextMenu ? action.command : action.command + "::ContextMenu";
	const pressHandler = action.command ? undefined : handlerProvider.getDataFieldForIBNPressHandler(action, forContextMenu);
	const pressCommand = action.command ? `cmd:${command}|press` : undefined;
	const enabled =
		action.enabled !== undefined
			? action.enabled
			: TableHelper.isDataFieldForIBNEnabled(
					{
						collection: collectionContext,
						tableDefinition: table.tableDefinition
					},
					dataField,
					dataField.RequiresContext,
					dataField.NavigationAvailable,
					forContextMenu
			  );
	const IBNData = !dataField.RequiresContext
		? "{semanticObject: '" + dataField.SemanticObject + "' , action : '" + dataField.Action + "'}"
		: undefined;
	if (!forContextMenu) {
		// for table toolbar
		const toolbarActionId = generate([table.id, dataField]);
		return (
			<Button
				id={toolbarActionId}
				text={dataField.Label}
				press={pressHandler}
				jsx:command={pressCommand}
				type={ButtonType.Transparent}
				enabled={enabled}
				visible={action.visible}
			>
				{{
					customData: [createCustomData("IBNData", IBNData), createCustomData("actionId", toolbarActionId)]
				}}
			</Button>
		);
	} else {
		// for context menu
		const tableActionContextMenuId = generate([table.id, dataField, "ContextMenu"]);
		return (
			<MenuItem
				id={tableActionContextMenuId}
				text={dataField.Label}
				press={pressHandler}
				jsx:command={pressCommand}
				enabled={enabled}
				visible={action.visibleForContextMenu}
			>
				{{
					customData: [createCustomData("IBNData", IBNData), createCustomData("actionId", tableActionContextMenuId)]
				}}
			</MenuItem>
		);
	}
}

/**
 * Generates the control for the button based on the type of the action.
 * @param action The name of the action
 * @param table The instance of the table building block
 * @param forContextMenu Indicates if the action appears in the context menu. If false, the action appears in the table toolbar
 * @param collectionContext The context of the collection
 * @param handlerProvider
 * @returns The control for the button/menu item
 */
function getDataFieldButton(
	action: BaseAction | AnnotationAction | CustomAction,
	table: TableBlockProperties,
	forContextMenu: boolean,
	collectionContext: Context,
	handlerProvider: TableEventHandlerProvider
): ActionToolbarAction | MenuItem | undefined {
	const dataField = action.annotationPath
		? (table.convertedMetadata.resolvePath(action.annotationPath).target as DataFieldAbstractTypes)
		: undefined;
	let template: MenuItem | Button | undefined;
	if (!dataField) {
		return undefined;
	}
	switch (action.type) {
		case "ForAction":
			if (isDataFieldForAction(dataField)) {
				const isBound = dataField.ActionTarget?.isBound;
				const isOperationAvailable = dataField.ActionTarget?.annotations?.Core?.OperationAvailable?.valueOf() !== false;
				// show only bound actions in context menu
				if (!forContextMenu || TableHelper.isActionShownInContextMenu(action, table.contextObjectPath)) {
					if (isBound !== true || isOperationAvailable) {
						template = getDataFieldButtonForAction(
							dataField,
							action,
							table,
							forContextMenu,
							collectionContext,
							handlerProvider
						);
					}
				}
			}
			break;
		case "ForNavigation":
			if (
				isDataFieldForIntentBasedNavigation(dataField) &&
				(!forContextMenu || TableHelper.isActionShownInContextMenu(action, table.contextObjectPath))
			) {
				template = getDataFieldButtonForIntentBasedNavigation(
					dataField,
					action,
					table,
					forContextMenu,
					collectionContext,
					handlerProvider
				);
			}
			break;
		default:
	}

	if (template === undefined) {
		return undefined;
	}

	if (!forContextMenu) {
		// for table toolbar
		return (
			<ActionToolbarAction
				id={generate([table.id, action.id, dataField, "ActionToolbarAction"])}
				dt:designtime={action.visible === "true" || action.visible === "false" ? undefined : "not-adaptable-visibility"}
			>
				{{
					action: template
				}}
			</ActionToolbarAction>
		);
	} else {
		// for context menu
		return template as MenuItem;
	}
}

/**
 * Gets the default action handler that is invoked when adding the menu button.
 * @param defaultAction The default action
 * @param dataFieldForDefaultAction The dataField for the default action
 * @param handlerProvider
 * @returns The corresponding event handler or command
 */
function getDefaultMenuButtonAction(
	defaultAction: CustomAction | undefined,
	dataFieldForDefaultAction: DataFieldForIntentBasedNavigation | DataFieldForAction | undefined,
	handlerProvider: TableEventHandlerProvider
): { handler?: (e: UI5Event) => void; command?: string } {
	if (!defaultAction || !dataFieldForDefaultAction) {
		return {};
	}

	try {
		switch (defaultAction.type) {
			case "ForAction":
				return {
					handler: handlerProvider.getDataFieldForActionButtonPressHandler(
						dataFieldForDefaultAction as DataFieldForAction,
						defaultAction,
						undefined,
						false
					)
				};

			case "ForNavigation":
				return {
					handler: handlerProvider.getDataFieldForIBNPressHandler(defaultAction, false)
				};

			default: {
				if (defaultAction.command) {
					return {
						command: `cmd:${defaultAction.command}|defaultAction`
					};
				} else {
					return {
						handler: handlerProvider.getManifestActionPressHandler(defaultAction, false)
					};
				}
			}
		}
	} catch (e) {
		return {};
	}
}

/**
 * Generates the control for the MenuButton control which enables the user to show a hierarchical menu.
 * @param action The name of the action
 * @param table The instance of the table building block
 * @param forContextMenu Indicates if the action appears in the context menu. If false, the action appears in the table toolbar
 * @param collectionContext The context of the collection
 * @param handlerProvider
 * @returns The MenuButton control
 */
function getMenuButton(
	action: BaseAction | AnnotationAction | CustomAction,
	table: TableBlockProperties,
	forContextMenu: boolean,
	collectionContext: Context,
	handlerProvider: TableEventHandlerProvider
): ActionToolbarAction | MenuItem | undefined {
	if (!forContextMenu) {
		// for table toolbar
		const defaultAction = (action as CustomAction).defaultAction as CustomAction | undefined;
		const dataFieldForDefaultAction = defaultAction?.annotationPath
			? table.convertedMetadata.resolvePath<DataFieldForAction | DataFieldForIntentBasedNavigation>(defaultAction.annotationPath)
					.target
			: undefined;
		const defaultActionHandlers = getDefaultMenuButtonAction(defaultAction, dataFieldForDefaultAction, handlerProvider);
		const menuItems = action.menu
			?.filter((menuItemAction) => typeof menuItemAction !== "string")
			.map((menuItemAction) => {
				return getMenuItem(action, menuItemAction, table, forContextMenu, collectionContext, handlerProvider);
			})
			.filter((item) => item !== undefined);

		if (menuItems?.length) {
			const menuId = generate([table.id, action.id]);
			return (
				<ActionToolbarAction
					id={generate([table.id, action.id, "ActionToolbarAction"])}
					dt:designtime={action.visible === "true" || action.visible === "false" ? undefined : "not-adaptable-visibility"}
				>
					<MenuButton
						text={action.text}
						type={ButtonType.Transparent}
						menuPosition="BeginBottom"
						id={menuId}
						visible={action.visible}
						enabled={action.enabled}
						useDefaultActionOnly={!!(action as CustomAndAction).defaultAction}
						buttonMode={(action as CustomAndAction).defaultAction ? MenuButtonMode.Split : MenuButtonMode.Regular}
						defaultAction={defaultActionHandlers.handler}
						jsx:command={defaultActionHandlers.command}
					>
						{{
							customData: [createCustomData("actionId", menuId)],
							menu: <Menu>{menuItems}</Menu>
						}}
					</MenuButton>
				</ActionToolbarAction>
			);
		} else {
			return undefined;
		}
	} else {
		// for context menu
		const menuItemsForContextMenu: BaseAction[] = [];
		action.menu?.forEach((menuItemAction) => {
			if (typeof menuItemAction !== "string" && TableHelper.isActionShownInContextMenu(menuItemAction, table.contextObjectPath)) {
				menuItemsForContextMenu?.push(menuItemAction);
			}
		});

		const menuItems = menuItemsForContextMenu
			.filter((menuItemAction) => typeof menuItemAction !== "string")
			.map((menuItemAction) => {
				return getMenuItem(action, menuItemAction, table, forContextMenu, collectionContext, handlerProvider);
			})
			.filter((item) => item !== undefined);

		if (menuItems?.length) {
			return (
				<MenuItem
					text={action.text}
					id={generate([table.id, action.id, "ContextMenu"])}
					visible={action.visibleForContextMenu}
					enabled={action.enabled}
				>
					{{
						items: menuItems
					}}
				</MenuItem>
			);
		} else {
			return undefined;
		}
	}
}

/**
 * Generates the xml string for the default button.
 * @param action The name of the action
 * @param table The instance of the table building block
 * @param forContextMenu Indicates if the action appears in the context menu. If false, the action appears in the table toolbar
 * @param handlerProvider
 * @returns The xml string for the default button.
 */
function getDefaultButton(
	action: CustomAction,
	table: TableBlockProperties,
	forContextMenu: boolean,
	handlerProvider: TableEventHandlerProvider
): ActionToolbarAction | MenuItem | undefined {
	const command = !forContextMenu ? action.command : action.command + "::ContextMenu";
	const pressHandler = action.command ? undefined : handlerProvider.getManifestActionPressHandler(action, forContextMenu);
	const pressCommand = action.command ? `cmd:${command}|press` : undefined;
	if (!forContextMenu) {
		// for table toolbar
		return (
			<ActionToolbarAction
				id={generate([table.id, action.id, "ActionToolbarAction"])}
				dt:designtime={action.visible === "true" || action.visible === "false" ? undefined : "not-adaptable-visibility"}
			>
				<Button
					core:require="{FPM: 'sap/fe/core/helpers/FPMHelper'}"
					id={generate([table.id, action.id])}
					text={action.text}
					press={pressHandler}
					jsx:command={pressCommand}
					type={ButtonType.Transparent}
					visible={action.visible}
					enabled={action.enabled}
				>
					{{
						customData: [createCustomData("actionId", generate([table.id, action.id]))]
					}}
				</Button>
			</ActionToolbarAction>
		);
	} else if (TableHelper.isActionShownInContextMenu(action, table.contextObjectPath)) {
		const tableActionContextMenuId = generate([table.id, action.id, "ContextMenu"]);
		// for context menu
		return (
			<MenuItem
				core:require="{FPM: 'sap/fe/core/helpers/FPMHelper'}"
				id={tableActionContextMenuId}
				text={action.text}
				press={pressHandler}
				jsx:command={pressCommand}
				visible={action.visibleForContextMenu}
				enabled={action.enabledForContextMenu}
			>
				{{
					customData: [createCustomData("actionId", tableActionContextMenuId)]
				}}
			</MenuItem>
		);
	} else {
		return undefined;
	}
}

/**
 * Generates the control for an action button/menu item based on the type of the action.
 * @param action The action to get
 * @param table The instance of the table building block
 * @param forContextMenu Indicates if the action appears in the context menu. If false, the action appears in the table toolbar
 * @param collectionContext The context of the collection
 * @param handlerProvider
 * @returns The control of the action
 */
function getAction(
	action: BaseAction,
	table: TableBlockProperties,
	forContextMenu: boolean,
	collectionContext: Context,
	handlerProvider: TableEventHandlerProvider
): ActionToolbarAction | MenuItem | undefined {
	switch (action.type) {
		case "Default":
			if ("noWrap" in action) {
				return getDefaultButton(action as CustomAction, table, forContextMenu, handlerProvider);
			}
			break;
		case "Menu":
			return getMenuButton(action, table, forContextMenu, collectionContext, handlerProvider);
		default:
	}
	return getDataFieldButton(action, table, forContextMenu, collectionContext, handlerProvider);
}

/**
 * Generates the copy action.
 * @param action The copy action
 * @param table The instance of the table building block
 * @param forContextMenu Indicates if action is for Action Toolbar of Context Menu
 * @param collectionContext The context of the collection
 * @param handlerProvider
 * @returns The action
 */
function getCopyAction(
	action: BaseAction,
	table: TableBlockProperties,
	forContextMenu: boolean,
	collectionContext: Context,
	handlerProvider: TableEventHandlerProvider
): ActionToolbarAction | MenuItem {
	const dataField = action.annotationPath
		? (table.convertedMetadata.resolvePath(action.annotationPath).target as DataFieldForAction)
		: undefined;
	const actionContextPath = CommonHelper.getActionContext(
		table.metaPath.getModel().createBindingContext(action.annotationPath + "/Action")!
	);
	const operationAvailable = dataField?.ActionTarget?.annotations?.Core?.OperationAvailable !== undefined;
	const actionContext = table.metaPath.getModel().createBindingContext(actionContextPath);
	const dataFieldDataModelObjectPath = actionContext
		? MetaModelConverter.getInvolvedDataModelObjects(actionContext, collectionContext)
		: undefined;
	const isBound = dataField?.ActionTarget?.isBound;
	const press = dataField
		? handlerProvider.getDataFieldForActionButtonPressHandler(dataField, action, undefined, forContextMenu)
		: undefined;
	const enabled = operationAvailable
		? TableHelper.isDataFieldForActionEnabled(
				table.tableDefinition,
				dataField.Action,
				!!isBound,
				actionContext.getObject(),
				action.enableOnSelect,
				dataFieldDataModelObjectPath?.targetEntityType,
				forContextMenu,
				true
		  )
		: `{= ${ActionHelper.getNumberOfContextsExpression("single", forContextMenu)}}`;
	if (!forContextMenu) {
		// for table toolbar
		return (
			<ActionToolbarAction
				id={generate([table.id, dataField, "ActionToolbarAction"])}
				dt:designtime={action.visible === "true" || action.visible === "false" ? undefined : "not-adaptable-visibility"}
			>
				<Button
					id={generate([table.id, dataField])}
					text={action.text}
					press={press}
					type={ButtonType.Transparent}
					visible={action.visible}
					enabled={enabled}
				>
					{{
						customData: [createCustomData("actionId", generate([table.id, dataField]))]
					}}
				</Button>
			</ActionToolbarAction>
		);
	} else {
		// for context menu
		return (
			<MenuItem
				id={generate([table.id, dataField, "ContextMenu"])}
				text={action.text}
				press={press}
				visible={action.visibleForContextMenu as unknown as boolean}
				enabled={compileExpression(equal(pathInModel("contextmenu/numberOfSelectedContexts", "internal"), 1)) as unknown as boolean}
			>
				{{
					customData: [createCustomData("actionId", generate([table.id, dataField, "ContextMenu"]))]
				}}
			</MenuItem>
		);
	}
}

/**
 * Generates the xml string for the create button.
 * @param standardAction Standard actions to be evaluated
 * @param table The instance of the table building block
 * @param forContextMenu Indicates whether the action appears in the context menu. If set to `false`, the action appears in the table toolbar.
 * @param collectionEntity The entity set of the collection
 * @returns The xml string for the create button
 */
function getCreateButton(
	standardAction: StandardAction,
	table: TableBlockProperties,
	forContextMenu: boolean,
	collectionEntity: EntitySet | NavigationProperty
): ActionsPlaceholder | ActionToolbarAction | MenuItem {
	const suffixResourceKey = collectionEntity.name;
	const buttonText = table.getTranslatedText("M_COMMON_TABLE_CREATE", undefined, suffixResourceKey);
	const createOutboundDetail = (table.tableDefinition.annotation.create as CreateBehaviorExternal).outboundDetail;

	if (table.tableDefinition.control.enableUploadPlugin) {
		return <ActionsPlaceholder id={`${table.id}-uploadButton`} placeholderFor="UploadButtonPlaceholder" />;
	} else if (!forContextMenu) {
		return (
			<ActionToolbarAction id={generate([table.id, standardAction.key, "ActionToolbarAction"])} dt:designtime="not-adaptable-tree">
				<Button
					id={generate([table.id, standardAction.key])}
					text={buttonText}
					jsx:command="cmd:Create|press"
					type={ButtonType.Transparent}
					visible={standardAction.visible as unknown as boolean}
					enabled={standardAction.enabled as unknown as boolean}
				>
					{{
						customData: createCustomData("IBNData", TableHelper.getIBNData(createOutboundDetail))
					}}
				</Button>
			</ActionToolbarAction>
		);
	} else {
		return (
			<MenuItem
				id={generate([table.id, standardAction.key, "ContextMenu"])}
				text={buttonText}
				jsx:command="cmd:Create::ContextMenu|press"
				visible={standardAction.visible as unknown as boolean}
				enabled={standardAction.enabledForContextMenu as unknown as boolean}
			/>
		);
	}
}

function getCreateMenu(
	standardAction: StandardAction,
	table: TableBlockProperties,
	collectionEntity: EntitySet | NavigationProperty,
	forContextMenu: boolean,
	handlerProvider: TableEventHandlerProvider
): ActionToolbarAction | MenuItem {
	const suffixResourceKey = collectionEntity.name;
	const buttonText = table.getTranslatedText("M_COMMON_TABLE_CREATE", undefined, suffixResourceKey);
	const values = table.tableDefinition.control.nodeType!.values;
	const hasCustomCreateEnablement = table.tableDefinition.control.createEnablement !== undefined;

	const menuItems = values.map((allowedValue, index) => {
		const modelName = !forContextMenu ? "" : "contextmenu/";

		const isEnabled = hasCustomCreateEnablement
			? notEqual(pathInModel(`${modelName}createEnablement/Create_${index}`, "internal"), false)
			: undefined;
		const id = forContextMenu ? generate([table.id, allowedValue.value, "ContextMenu"]) : generate([table.id, allowedValue.value]);
		return (
			<MenuItem
				id={id}
				text={allowedValue.text}
				enabled={isEnabled ? compileExpression(isEnabled) : undefined}
				press={handlerProvider.getCreateMenuItemPressHandler(index, forContextMenu)}
			/>
		);
	});

	if (forContextMenu) {
		return (
			<MenuItem
				id={generate([table.id, standardAction.key, "ContextMenu"])}
				text={buttonText}
				visible={standardAction.visible as unknown as boolean}
				enabled={standardAction.enabledForContextMenu as unknown as boolean}
			>
				{{
					items: menuItems !== undefined && menuItems.length > 0 ? menuItems : undefined
				}}
			</MenuItem>
		);
	}

	return (
		<ActionToolbarAction id={generate([table.id, standardAction.key, "ActionToolbarAction"])} dt:designtime="not-adaptable-tree">
			<MenuButton
				text={buttonText}
				type={ButtonType.Transparent}
				menuPosition="BeginBottom"
				id={generate([table.id, standardAction.key])}
				visible={standardAction.visible as unknown as boolean}
				enabled={standardAction.enabled as unknown as boolean}
			>
				{{
					customData: [createCustomData("actionId", generate([table.id, standardAction.key]))],
					menu: <Menu>{menuItems}</Menu>
				}}
			</MenuButton>
		</ActionToolbarAction>
	);
}

/**
 * Generates the xml string for the delete button.
 * @param standardAction Standard actions to be evaluated
 * @param table The instance of the table building block
 * @param forContextMenu Indicates if the action appears in the context menu. If false, the action appears in the table toolbar
 * @param collectionEntity The entity set of the collection
 * @returns The xml string for the delete button
 */
function getDeleteButton(
	standardAction: StandardAction,
	table: TableBlockProperties,
	forContextMenu: boolean,
	collectionEntity: EntitySet | NavigationProperty
): ActionToolbarAction | MenuItem {
	const suffixResourceKey = collectionEntity.name;
	const buttonText = table.getTranslatedText("M_COMMON_TABLE_DELETE", undefined, suffixResourceKey);
	if (!forContextMenu) {
		// for table toolbar
		return (
			<ActionToolbarAction id={generate([table.id, standardAction.key, "ActionToolbarAction"])} dt:designtime="not-adaptable-tree">
				<Button
					id={generate([table.id, standardAction.key])}
					text={buttonText}
					jsx:command="cmd:DeleteEntry|press"
					type={ButtonType.Transparent}
					visible={standardAction.visible as unknown as boolean}
					enabled={standardAction.enabled as unknown as boolean}
					ariaHasPopup="Dialog"
				/>
			</ActionToolbarAction>
		);
	} else {
		// for context menu
		return (
			<MenuItem
				id={generate([table.id, standardAction.key, "ContextMenu"])}
				text={buttonText}
				jsx:command="cmd:DeleteEntry::ContextMenu|press"
				visible={standardAction.visible as unknown as boolean}
				enabled={standardAction.enabledForContextMenu as unknown as boolean}
			/>
		);
	}
}

/**
 * Generates the xml string for standard actions based on the key of the standard action.
 * @param action The action to template
 * @param table The instance of the table building block
 * @param forContextMenu Indicates if the action appears in the context menu. If false, the action appears in the table toolbar
 * @param handlerProvider
 * @param collectionEntity The entity set of the collection
 * @returns The xml string representation of the standard action
 */
function getStandardAction(
	action: StandardAction,
	table: TableBlockProperties,
	forContextMenu: boolean,
	handlerProvider: TableEventHandlerProvider,
	collectionEntity: EntitySet | NavigationProperty
): ActionToolbarAction | MenuItem | ActionsPlaceholder | undefined {
	if (action.isTemplated === "false") {
		return undefined;
	}

	switch (action.key) {
		case StandardActionKeys.Create:
			if (
				!table.tableDefinition.annotation.isInsertUpdateActionsTemplated ||
				// We only have Create on the ContextMenu on the TreeTable
				(table.tableDefinition.control.type !== "TreeTable" && forContextMenu)
			) {
				return undefined;
			} else if (table.tableDefinition.control.nodeType) {
				return getCreateMenu(action, table, collectionEntity, forContextMenu, handlerProvider);
			} else {
				return getCreateButton(action, table, forContextMenu, collectionEntity);
			}

		case StandardActionKeys.Delete:
			return getDeleteButton(action, table, forContextMenu, collectionEntity);
		case StandardActionKeys.Cut:
			return getCutButton(action, table, forContextMenu);
		case StandardActionKeys.Paste:
			return getPasteButton(action, table, forContextMenu);

		case StandardActionKeys.MassEdit:
			if (table.tableDefinition.annotation.isInsertUpdateActionsTemplated) {
				if (!forContextMenu) {
					// for table toolbar
					return (
						<ActionToolbarAction
							id={generate([table.id, action.key, "ActionToolbarAction"])}
							dt:designtime="not-adaptable-tree"
						>
							<Button
								id={generate([table.id, action.key])}
								text="{sap.fe.i18n>M_COMMON_TABLE_MASSEDIT}"
								press={handlerProvider.getMassEditButtonPressHandler(false)}
								visible={action.visible as unknown as boolean}
								enabled={action.enabled as unknown as boolean}
							/>
						</ActionToolbarAction>
					);
				} else {
					// for context menu
					return (
						<MenuItem
							id={generate([table.id, action.key, "ContextMenu"])}
							text="{sap.fe.i18n>M_COMMON_TABLE_MASSEDIT}"
							press={handlerProvider.getMassEditButtonPressHandler(true)}
							visible={action.visibleForContextMenu as unknown as boolean}
							enabled={action.enabledForContextMenu as unknown as boolean}
						/>
					);
				}
			}
			return undefined;

		case StandardActionKeys.Insights:
			if (!forContextMenu) {
				// for table toolbar
				return (
					<ActionToolbarAction
						id={generate([table.id, action.key, "ActionToolbarAction"])}
						dt:designtime={action.visible === "true" || action.visible === "false" ? undefined : "not-adaptable-visibility"}
						visible={action.visible}
					>
						<Button
							id={generate([table.id, action.key])}
							text="{sap.fe.i18n>M_COMMON_INSIGHTS_CARD}"
							press={handlerProvider.addCardToInsightsPress}
							visible={action.visible as unknown as boolean}
							enabled={action.enabled as unknown as boolean}
						>
							{{
								layoutData: <OverflowToolbarLayoutData priority="AlwaysOverflow" />
							}}
						</Button>
					</ActionToolbarAction>
				);
			}
			return undefined;

		case StandardActionKeys.MoveUp:
		case StandardActionKeys.MoveDown:
			return getMoveUpDownButton(action, table, forContextMenu);

		default:
			return undefined;
	}
}

/**
 * Generates the xml string for standard, annotation, and custom actions of the table.
 * @param table The instance of the table building block
 * @param forContextMenu Indicates if the action appears in the context menu. If false, the action appears in the table toolbar
 * @param handlerProvider
 * @param collectionContext The context of the collection
 * @param collectionEntity The entity set of the collection
 * @returns The xml string representation of the actions
 */
export function getActions(
	table: TableBlockProperties,
	forContextMenu: boolean,
	handlerProvider: TableEventHandlerProvider,
	collectionContext: Context,
	collectionEntity: EntitySet | NavigationProperty
): (ActionToolbarAction | MenuItem | ActionsPlaceholder)[] {
	return table.tableDefinition.actions
		.map((action) => {
			switch (action.type) {
				case ActionType.Standard:
					return getStandardAction(action as StandardAction, table, forContextMenu, handlerProvider, collectionEntity);
				case ActionType.Copy:
					return getCopyAction(action, table, forContextMenu, collectionContext, handlerProvider);
				default:
					return getAction(action, table, forContextMenu, collectionContext, handlerProvider);
			}
		})
		.filter((action) => action !== undefined) as (ActionToolbarAction | MenuItem | ActionsPlaceholder)[];
}

/**
 * Generates the control for BasicSearch.
 * @param useBasicSearch
 * @param filterBarId
 * @param _collectionIsDraftEnabled
 * @param isSearchable
 * @returns The control of the BasicSearch
 */
function getBasicSearch(
	useBasicSearch: boolean,
	filterBarId: string | undefined,
	_collectionIsDraftEnabled: boolean,
	isSearchable: boolean
): ActionToolbarAction | undefined {
	if (useBasicSearch) {
		return (
			<ActionToolbarAction
				id={generate([filterBarId, "ActionToolbarAction"])}
				label="{sap.fe.i18n>M_BASIC_SEARCH}"
				dt:designtime="not-adaptable-tree"
			>
				{{
					action: <BasicSearchMacro id={filterBarId} useDraftEditState={_collectionIsDraftEnabled} visible={isSearchable} />
				}}
			</ActionToolbarAction>
		);
	}
	return undefined;
}

/**
 * Generates the control for table fullscreen button.
 * @param table The instance of the table building block
 * @returns The control of the button
 */
function getFullScreen(table: TableBlockProperties): ActionToolbarAction | undefined {
	if (table.tableDefinition.control.enableFullScreen) {
		return (
			<ActionToolbarAction
				id={generate([table.id, "StandardAction", "FullScreen", "ActionToolbarAction"])}
				dt:designtime="not-adaptable-tree"
			>
				{{
					action: <TableFullScreenButton id={generate([table.id, "StandardAction", "FullScreen"])} />
				}}
			</ActionToolbarAction>
		);
	}
	return undefined;
}

/**
 * Generates the XML string for the Cut Button.
 * @param action The instance of the standardAction
 * @param table The instance of the table building block
 * @param forContextMenu
 * @returns The XML string representation of the Cut Button
 */
function getCutButton(action: StandardAction, table: TableBlockProperties, forContextMenu = false): ActionToolbarAction | MenuItem {
	if (!forContextMenu) {
		// for table toolbar
		return (
			<ActionToolbarAction id={generate([table.id, "Cut", "ActionToolbarAction"])} dt:designtime="not-adaptable-tree">
				<Button
					id={generate([table.id, "Cut"])}
					text="{sap.fe.i18n>M_TABLE_CUT}"
					jsx:command="cmd:Cut|press"
					visible={action.visible as unknown as boolean}
					enabled={action.enabled as unknown as boolean}
				/>
			</ActionToolbarAction>
		);
	} else {
		// for context menu
		return (
			<MenuItem
				id={generate([table.id, "Cut", "ContextMenu"])}
				text="{sap.fe.i18n>M_TABLE_CUT}"
				jsx:command="cmd:Cut::ContextMenu|press"
				visible={action.visible as unknown as boolean}
				enabled={action.enabledForContextMenu as unknown as boolean}
			/>
		);
	}
}

function getMoveUpDownButton(action: StandardAction, table: TableBlockProperties, forContextMenu: boolean): ActionToolbarAction | MenuItem {
	const forMoveUp = action.key === StandardActionKeys.MoveUp;
	if (!forContextMenu) {
		// for table toolbar
		return (
			<ActionToolbarAction
				id={generate([table.id, action.key, "ActionToolbarAction"])}
				visible={action.visible}
				dt:designtime="not-adaptable-tree"
			>
				<Button
					id={generate([table.id, action.key])}
					text={forMoveUp ? "{sap.fe.i18n>M_TABLE_MOVE_UP}" : "{sap.fe.i18n>M_TABLE_MOVE_DOWN}"}
					jsx:command={forMoveUp ? "cmd:TableMoveElementUp|press" : "cmd:TableMoveElementDown|press"}
					visible={action.visible as unknown as boolean}
					enabled={action.enabled as unknown as boolean}
				/>
			</ActionToolbarAction>
		);
	} else {
		// for context menu
		return (
			<MenuItem
				id={generate([table.id, action.key, "ContextMenu"])}
				text={forMoveUp ? "{sap.fe.i18n>M_TABLE_MOVE_UP}" : "{sap.fe.i18n>M_TABLE_MOVE_DOWN}"}
				jsx:command={forMoveUp ? "cmd:TableMoveElementUp::ContextMenu|press" : "cmd:TableMoveElementDown::ContextMenu|press"}
				visible={action.visible as unknown as boolean}
				enabled={action.enabledForContextMenu as unknown as boolean}
			/>
		);
	}
}
/**
 * Generates the XML string for the Paste Button.
 * @param action The Paste action
 * @param table The instance of the table building block
 * @param forContextMenu Indicates if the action appears in the context menu. If false, the action appears in the table toolbar
 * @returns The XML string representation of the Paste Button
 */
function getPasteButton(
	action: StandardAction,
	table: TableBlockProperties,
	forContextMenu = false
): ActionToolbarAction | MenuItem | undefined {
	const tableType = table.tableDefinition.control.type;
	if (tableType === "TreeTable") {
		if (!forContextMenu) {
			// for table toolbar
			return (
				<ActionToolbarAction id={generate([table.id, "Paste", "ActionToolbarAction"])} dt:designtime="not-adaptable-tree">
					<Button
						id={generate([table.id, "Paste"])}
						text="{sap.fe.i18n>M_PASTE}"
						jsx:command="cmd:Paste|press"
						visible={action.visible as unknown as boolean}
						enabled={action.enabled as unknown as boolean}
					/>
				</ActionToolbarAction>
			);
		} else {
			// for Context Menu
			return (
				<MenuItem
					id={generate([table.id, "Paste", "ContextMenu"])}
					text="{sap.fe.i18n>M_PASTE}"
					jsx:command="cmd:Paste::ContextMenu|press"
					visible={action.visible as unknown as boolean}
					enabled={action.enabledForContextMenu as unknown as boolean}
				/>
			);
		}
	}
	return undefined;
}

/**
 * Generates the XML string for actions.
 * @param table The instance of the table building block
 * @param handlerProvider
 * @param collectionContext The context of the collection
 * @param collectionEntity The entity set of the collection
 * @returns The XML string representation of the actions
 */
export function getTableActionsTemplate(
	table: TableBlockProperties,
	handlerProvider: TableEventHandlerProvider,
	collectionContext: Context,
	collectionEntity: EntitySet | NavigationProperty
): Control[] {
	const _collectionIsDraftEnabled = ModelHelper.isDraftNode(collectionEntity) || ModelHelper.isDraftRoot(collectionEntity);
	let searchable: boolean;
	if (table.isSearchable === false) {
		searchable = false;
	} else {
		searchable = table.tableDefinition.annotation.searchable;
	}

	const actions: (ActionToolbarAction | MenuItem | ActionsPlaceholder)[] = [];
	const basicSearch = getBasicSearch(!!table.useBasicSearch, table.filterBar, _collectionIsDraftEnabled, searchable);
	if (basicSearch) {
		actions.push(basicSearch);
	}
	actions.push(...getActions(table, false, handlerProvider, collectionContext, collectionEntity));
	const fullScreen = getFullScreen(table);
	if (fullScreen) {
		actions.push(fullScreen);
	}

	return actions as Control[];
}

/**
 * Generates the xml string for context menu actions.
 * @param table The instance of the table building block
 * @param handlerProvider
 * @param collectionContext The context of the collection
 * @param collectionEntity The entity set of the collection
 * @returns The xml string representation of the actions
 */
export function getTableContextMenuTemplate(
	table: TableBlockProperties,
	handlerProvider: TableEventHandlerProvider,
	collectionContext: Context,
	collectionEntity: EntitySet | NavigationProperty
): MenuItem[] {
	const template: MenuItem[] = getActions(table, true, handlerProvider, collectionContext, collectionEntity) as unknown as MenuItem[];
	if (table.tableDefinition.control.type === "TreeTable") {
		template.push(getExpandedCollapseActions(table, true, handlerProvider.expandNode));
		template.push(getExpandedCollapseActions(table, false, handlerProvider.collapseNode));
	}
	return template;
}

function getExpandedCollapseActions(table: TableBlockProperties, expand: boolean, pressHandler?: (e: UI5Event) => void): MenuItem {
	const enableExpression = expand
		? and(
				equal(pathInModel("contextmenu/isExpandable", "internal"), true),
				equal(pathInModel("contextmenu/numberOfSelectedContexts", "internal"), 1)
		  )
		: and(
				equal(pathInModel("contextmenu/isCollapsable", "internal"), true),
				equal(pathInModel("contextmenu/numberOfSelectedContexts", "internal"), 1)
		  );
	return (
		<MenuItem
			id={generate([table.id, expand ? "Expand" : "Collapse", "ContextMenu"])}
			text={expand ? "{sap.fe.i18n>M_TABLE_CONTEXTMENU_EXPAND}" : "{sap.fe.i18n>M_TABLE_CONTEXTMENU_COLLAPSE}"}
			press={pressHandler}
			enabled={enableExpression}
		/>
	);
}
