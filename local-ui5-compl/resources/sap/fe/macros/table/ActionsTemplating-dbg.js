/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/base/BindingToolkit", "sap/fe/core/converters/ManifestSettings", "sap/fe/core/converters/MetaModelConverter", "sap/fe/core/converters/annotations/DataField", "sap/fe/core/converters/controls/Common/Action", "sap/fe/core/converters/controls/Common/table/StandardActions", "sap/fe/core/helpers/ModelHelper", "sap/fe/core/helpers/StableIdHelper", "sap/fe/macros/CommonHelper", "sap/fe/macros/TSXUtils", "sap/fe/macros/table/TableFullScreenButton", "sap/fe/macros/table/TableHelper", "sap/m/Button", "sap/m/Menu", "sap/m/MenuButton", "sap/m/MenuItem", "sap/m/OverflowToolbarLayoutData", "sap/m/library", "sap/m/upload/ActionsPlaceholder", "sap/ui/mdc/actiontoolbar/ActionToolbarAction", "../internal/helpers/ActionHelper", "./BasicSearch", "sap/fe/base/jsx-runtime/jsx"], function (BindingToolkit, ManifestSettings, MetaModelConverter, DataField, Action, StandardActions, ModelHelper, StableIdHelper, CommonHelper, TSXUtils, TableFullScreenButton, TableHelper, Button, Menu, MenuButton, MenuItem, OverflowToolbarLayoutData, library, ActionsPlaceholder, ActionToolbarAction, ActionHelper, BasicSearchMacro, _jsx) {
  "use strict";

  var _exports = {};
  var MenuButtonMode = library.MenuButtonMode;
  var createCustomData = TSXUtils.createCustomData;
  var generate = StableIdHelper.generate;
  var StandardActionKeys = StandardActions.StandardActionKeys;
  var ButtonType = Action.ButtonType;
  var isDataFieldForIntentBasedNavigation = DataField.isDataFieldForIntentBasedNavigation;
  var isDataFieldForAction = DataField.isDataFieldForAction;
  var isActionWithDialog = DataField.isActionWithDialog;
  var ActionType = ManifestSettings.ActionType;
  var pathInModel = BindingToolkit.pathInModel;
  var notEqual = BindingToolkit.notEqual;
  var equal = BindingToolkit.equal;
  var compileExpression = BindingToolkit.compileExpression;
  var and = BindingToolkit.and;
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
  function getMenuItemForAction(dataField, action, menuItemAction, table, forContextMenu, collectionContext, handlerProvider) {
    if (!menuItemAction.annotationPath) {
      return undefined;
    }
    const actionContextPath = CommonHelper.getActionContext(table.metaPath.getModel().createBindingContext(menuItemAction.annotationPath + "/Action"));
    const actionContext = table.metaPath.getModel().createBindingContext(actionContextPath);
    const dataFieldDataModelObjectPath = actionContext ? MetaModelConverter.getInvolvedDataModelObjects(actionContext, collectionContext) : undefined;
    const isBound = dataField.ActionTarget?.isBound;
    const isOperationAvailable = dataField.ActionTarget?.annotations?.Core?.OperationAvailable?.valueOf() !== false;
    const command = !forContextMenu ? menuItemAction.command : menuItemAction.command + "::ContextMenu";
    const contextMenuText = forContextMenu ? "ContextMenu" : "ActionMenu";
    const pressHandler = menuItemAction.command ? undefined : handlerProvider.getDataFieldForActionButtonPressHandler(dataField, menuItemAction, action, forContextMenu);
    const pressCommand = menuItemAction.command ? `cmd:${command}|press` : undefined;
    const enabled = menuItemAction.enabled !== undefined ? menuItemAction.enabled : TableHelper.isDataFieldForActionEnabled(table.tableDefinition, dataField.Action, !!isBound, actionContext.getObject(), menuItemAction.enableOnSelect, dataFieldDataModelObjectPath?.targetEntityType, forContextMenu);
    if (isBound !== true || isOperationAvailable) {
      const itemId = generate([table.id, menuItemAction.key, action.key, contextMenuText, dataField, "MenuItemForAction"]);
      return _jsx(MenuItem, {
        text: dataField.Label,
        id: itemId,
        press: pressHandler,
        "jsx:command": pressCommand,
        enabled: enabled,
        visible: menuItemAction.visible,
        children: {
          customData: [createCustomData("actionId", itemId)]
        }
      });
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
  function getMenuItemForIntentBasedNavigation(dataField, menuItemAction, table) {
    let forContextMenu = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    let collectionContext = arguments.length > 4 ? arguments[4] : undefined;
    let action = arguments.length > 5 ? arguments[5] : undefined;
    let handlerProvider = arguments.length > 6 ? arguments[6] : undefined;
    const pressHandler = menuItemAction.command ? undefined : handlerProvider.getDataFieldForIBNPressHandler(menuItemAction, forContextMenu);
    const pressCommand = menuItemAction.command ? `cmd:${menuItemAction.command}|press` : undefined;
    const enabled = menuItemAction.enabled !== undefined ? menuItemAction.enabled : TableHelper.isDataFieldForIBNEnabled({
      collection: collectionContext,
      tableDefinition: table.tableDefinition
    }, dataField, dataField.RequiresContext, dataField.NavigationAvailable, forContextMenu);
    const id = forContextMenu ? generate([table.id, menuItemAction.key, action.key, dataField, "MenuItemIntentBasedNavigation", "ContextMenu"]) : generate([table.id, menuItemAction.key, action.key, dataField, "MenuItemIntentBasedNavigation"]);
    return _jsx(MenuItem, {
      text: dataField.Label,
      id: id,
      press: pressHandler,
      "jsx:command": pressCommand,
      enabled: enabled,
      visible: menuItemAction.visible,
      children: {
        customData: [!dataField.RequiresContext ? createCustomData("IBNData", `{semanticObject: '${dataField.SemanticObject}' , action : '${dataField.Action}'}`) : undefined, createCustomData("actionId", id)]
      }
    });
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
  function getMenuItem(action, menuItemAction, table, forContextMenu, collectionContext, handlerProvider) {
    const dataField = menuItemAction.annotationPath ? table.convertedMetadata.resolvePath(menuItemAction.annotationPath).target : undefined;
    switch (dataField && menuItemAction.type) {
      case "ForAction":
        if (isDataFieldForAction(dataField)) {
          if (!forContextMenu || forContextMenu && TableHelper.isActionShownInContextMenu(menuItemAction, table.contextObjectPath)) {
            return getMenuItemForAction(dataField, action, menuItemAction, table, forContextMenu, collectionContext, handlerProvider);
          }
        }
        break;
      case "ForNavigation":
        if (isDataFieldForIntentBasedNavigation(dataField) && (!forContextMenu || forContextMenu && TableHelper.isActionShownInContextMenu(menuItemAction, table.contextObjectPath))) {
          return getMenuItemForIntentBasedNavigation(dataField, menuItemAction, table, forContextMenu, collectionContext, action, handlerProvider);
        }
        break;
      default:
    }
    const command = !forContextMenu ? menuItemAction.command : menuItemAction.command + "::ContextMenu";
    const pressHandler = menuItemAction.command ? undefined : handlerProvider.getManifestActionPressHandler(menuItemAction, forContextMenu);
    const pressCommand = menuItemAction.command ? `cmd:${command}|press` : undefined;
    const enabled = !forContextMenu ? menuItemAction.enabled : menuItemAction.enabledForContextMenu;
    const contextMenuText = forContextMenu ? "ContextMenu" : "ActionMenu";
    const itemId = generate([table.id, menuItemAction.key, contextMenuText, action.key, dataField, "MenuItem"]);
    return _jsx(MenuItem, {
      "core:require": "{FPM: 'sap/fe/core/helpers/FPMHelper'}",
      text: menuItemAction?.text,
      id: itemId,
      press: pressHandler,
      "jsx:command": pressCommand,
      visible: menuItemAction.visible,
      enabled: enabled,
      children: {
        customData: [createCustomData("actionId", itemId)]
      }
    });
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
  function getDataFieldButtonForAction(dataField, action, table, forContextMenu, collectionContext, handlerProvider) {
    const dataFieldActionContext = table.metaPath.getModel().createBindingContext(action.annotationPath + "/Action");
    const actionContextPath = CommonHelper.getActionContext(dataFieldActionContext);
    const actionContext = table.metaPath.getModel().createBindingContext(actionContextPath);
    const dataFieldDataModelObjectPath = actionContext ? MetaModelConverter.getInvolvedDataModelObjects(actionContext, collectionContext) : undefined;
    const isBound = dataField.ActionTarget?.isBound;
    const command = !forContextMenu ? action.command : action.command + "::ContextMenu";
    const pressHandler = action.command ? undefined : handlerProvider.getDataFieldForActionButtonPressHandler(dataField, action, undefined, forContextMenu);
    const pressCommand = action.command ? `cmd:${command}|press` : undefined;
    const enabled = action.enabled !== undefined ? action.enabled : TableHelper.isDataFieldForActionEnabled(table.tableDefinition, dataField.Action, !!isBound, actionContext.getObject(), action.enableOnSelect, dataFieldDataModelObjectPath?.targetEntityType, forContextMenu);
    if (!forContextMenu) {
      // for table toolbar
      const toolbarActionId = generate([table.id, dataField]);
      return _jsx(Button, {
        id: toolbarActionId,
        text: dataField.Label,
        ariaHasPopup: isActionWithDialog(dataField),
        press: pressHandler,
        "jsx:command": pressCommand,
        type: ButtonType.Transparent,
        enabled: enabled,
        visible: action.visible,
        children: {
          customData: [createCustomData("actionId", toolbarActionId)]
        }
      });
    } else {
      // for context menu
      const tableActionContextMenuId = generate([table.id, dataField, "ContextMenu"]);
      return _jsx(MenuItem, {
        id: tableActionContextMenuId,
        text: dataField.Label,
        press: pressHandler,
        "jsx:command": pressCommand,
        enabled: enabled,
        visible: action.visibleForContextMenu,
        children: {
          customData: [createCustomData("actionId", tableActionContextMenuId)]
        }
      });
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
  function getDataFieldButtonForIntentBasedNavigation(dataField, action, table, forContextMenu, collectionContext, handlerProvider) {
    const command = !forContextMenu ? action.command : action.command + "::ContextMenu";
    const pressHandler = action.command ? undefined : handlerProvider.getDataFieldForIBNPressHandler(action, forContextMenu);
    const pressCommand = action.command ? `cmd:${command}|press` : undefined;
    const enabled = action.enabled !== undefined ? action.enabled : TableHelper.isDataFieldForIBNEnabled({
      collection: collectionContext,
      tableDefinition: table.tableDefinition
    }, dataField, dataField.RequiresContext, dataField.NavigationAvailable, forContextMenu);
    const IBNData = !dataField.RequiresContext ? "{semanticObject: '" + dataField.SemanticObject + "' , action : '" + dataField.Action + "'}" : undefined;
    if (!forContextMenu) {
      // for table toolbar
      const toolbarActionId = generate([table.id, dataField]);
      return _jsx(Button, {
        id: toolbarActionId,
        text: dataField.Label,
        press: pressHandler,
        "jsx:command": pressCommand,
        type: ButtonType.Transparent,
        enabled: enabled,
        visible: action.visible,
        children: {
          customData: [createCustomData("IBNData", IBNData), createCustomData("actionId", toolbarActionId)]
        }
      });
    } else {
      // for context menu
      const tableActionContextMenuId = generate([table.id, dataField, "ContextMenu"]);
      return _jsx(MenuItem, {
        id: tableActionContextMenuId,
        text: dataField.Label,
        press: pressHandler,
        "jsx:command": pressCommand,
        enabled: enabled,
        visible: action.visibleForContextMenu,
        children: {
          customData: [createCustomData("IBNData", IBNData), createCustomData("actionId", tableActionContextMenuId)]
        }
      });
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
  function getDataFieldButton(action, table, forContextMenu, collectionContext, handlerProvider) {
    const dataField = action.annotationPath ? table.convertedMetadata.resolvePath(action.annotationPath).target : undefined;
    let template;
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
              template = getDataFieldButtonForAction(dataField, action, table, forContextMenu, collectionContext, handlerProvider);
            }
          }
        }
        break;
      case "ForNavigation":
        if (isDataFieldForIntentBasedNavigation(dataField) && (!forContextMenu || TableHelper.isActionShownInContextMenu(action, table.contextObjectPath))) {
          template = getDataFieldButtonForIntentBasedNavigation(dataField, action, table, forContextMenu, collectionContext, handlerProvider);
        }
        break;
      default:
    }
    if (template === undefined) {
      return undefined;
    }
    if (!forContextMenu) {
      // for table toolbar
      return _jsx(ActionToolbarAction, {
        id: generate([table.id, action.id, dataField, "ActionToolbarAction"]),
        "dt:designtime": action.visible === "true" || action.visible === "false" ? undefined : "not-adaptable-visibility",
        children: {
          action: template
        }
      });
    } else {
      // for context menu
      return template;
    }
  }

  /**
   * Gets the default action handler that is invoked when adding the menu button.
   * @param defaultAction The default action
   * @param dataFieldForDefaultAction The dataField for the default action
   * @param handlerProvider
   * @returns The corresponding event handler or command
   */
  function getDefaultMenuButtonAction(defaultAction, dataFieldForDefaultAction, handlerProvider) {
    if (!defaultAction || !dataFieldForDefaultAction) {
      return {};
    }
    try {
      switch (defaultAction.type) {
        case "ForAction":
          return {
            handler: handlerProvider.getDataFieldForActionButtonPressHandler(dataFieldForDefaultAction, defaultAction, undefined, false)
          };
        case "ForNavigation":
          return {
            handler: handlerProvider.getDataFieldForIBNPressHandler(defaultAction, false)
          };
        default:
          {
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
  function getMenuButton(action, table, forContextMenu, collectionContext, handlerProvider) {
    if (!forContextMenu) {
      // for table toolbar
      const defaultAction = action.defaultAction;
      const dataFieldForDefaultAction = defaultAction?.annotationPath ? table.convertedMetadata.resolvePath(defaultAction.annotationPath).target : undefined;
      const defaultActionHandlers = getDefaultMenuButtonAction(defaultAction, dataFieldForDefaultAction, handlerProvider);
      const menuItems = action.menu?.filter(menuItemAction => typeof menuItemAction !== "string").map(menuItemAction => {
        return getMenuItem(action, menuItemAction, table, forContextMenu, collectionContext, handlerProvider);
      }).filter(item => item !== undefined);
      if (menuItems?.length) {
        const menuId = generate([table.id, action.id]);
        return _jsx(ActionToolbarAction, {
          id: generate([table.id, action.id, "ActionToolbarAction"]),
          "dt:designtime": action.visible === "true" || action.visible === "false" ? undefined : "not-adaptable-visibility",
          children: _jsx(MenuButton, {
            text: action.text,
            type: ButtonType.Transparent,
            menuPosition: "BeginBottom",
            id: menuId,
            visible: action.visible,
            enabled: action.enabled,
            useDefaultActionOnly: !!action.defaultAction,
            buttonMode: action.defaultAction ? MenuButtonMode.Split : MenuButtonMode.Regular,
            defaultAction: defaultActionHandlers.handler,
            "jsx:command": defaultActionHandlers.command,
            children: {
              customData: [createCustomData("actionId", menuId)],
              menu: _jsx(Menu, {
                children: menuItems
              })
            }
          })
        });
      } else {
        return undefined;
      }
    } else {
      // for context menu
      const menuItemsForContextMenu = [];
      action.menu?.forEach(menuItemAction => {
        if (typeof menuItemAction !== "string" && TableHelper.isActionShownInContextMenu(menuItemAction, table.contextObjectPath)) {
          menuItemsForContextMenu?.push(menuItemAction);
        }
      });
      const menuItems = menuItemsForContextMenu.filter(menuItemAction => typeof menuItemAction !== "string").map(menuItemAction => {
        return getMenuItem(action, menuItemAction, table, forContextMenu, collectionContext, handlerProvider);
      }).filter(item => item !== undefined);
      if (menuItems?.length) {
        return _jsx(MenuItem, {
          text: action.text,
          id: generate([table.id, action.id, "ContextMenu"]),
          visible: action.visibleForContextMenu,
          enabled: action.enabled,
          children: {
            items: menuItems
          }
        });
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
  function getDefaultButton(action, table, forContextMenu, handlerProvider) {
    const command = !forContextMenu ? action.command : action.command + "::ContextMenu";
    const pressHandler = action.command ? undefined : handlerProvider.getManifestActionPressHandler(action, forContextMenu);
    const pressCommand = action.command ? `cmd:${command}|press` : undefined;
    if (!forContextMenu) {
      // for table toolbar
      return _jsx(ActionToolbarAction, {
        id: generate([table.id, action.id, "ActionToolbarAction"]),
        "dt:designtime": action.visible === "true" || action.visible === "false" ? undefined : "not-adaptable-visibility",
        children: _jsx(Button, {
          "core:require": "{FPM: 'sap/fe/core/helpers/FPMHelper'}",
          id: generate([table.id, action.id]),
          text: action.text,
          press: pressHandler,
          "jsx:command": pressCommand,
          type: ButtonType.Transparent,
          visible: action.visible,
          enabled: action.enabled,
          children: {
            customData: [createCustomData("actionId", generate([table.id, action.id]))]
          }
        })
      });
    } else if (TableHelper.isActionShownInContextMenu(action, table.contextObjectPath)) {
      const tableActionContextMenuId = generate([table.id, action.id, "ContextMenu"]);
      // for context menu
      return _jsx(MenuItem, {
        "core:require": "{FPM: 'sap/fe/core/helpers/FPMHelper'}",
        id: tableActionContextMenuId,
        text: action.text,
        press: pressHandler,
        "jsx:command": pressCommand,
        visible: action.visibleForContextMenu,
        enabled: action.enabledForContextMenu,
        children: {
          customData: [createCustomData("actionId", tableActionContextMenuId)]
        }
      });
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
  function getAction(action, table, forContextMenu, collectionContext, handlerProvider) {
    switch (action.type) {
      case "Default":
        if ("noWrap" in action) {
          return getDefaultButton(action, table, forContextMenu, handlerProvider);
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
  function getCopyAction(action, table, forContextMenu, collectionContext, handlerProvider) {
    const dataField = action.annotationPath ? table.convertedMetadata.resolvePath(action.annotationPath).target : undefined;
    const actionContextPath = CommonHelper.getActionContext(table.metaPath.getModel().createBindingContext(action.annotationPath + "/Action"));
    const operationAvailable = dataField?.ActionTarget?.annotations?.Core?.OperationAvailable !== undefined;
    const actionContext = table.metaPath.getModel().createBindingContext(actionContextPath);
    const dataFieldDataModelObjectPath = actionContext ? MetaModelConverter.getInvolvedDataModelObjects(actionContext, collectionContext) : undefined;
    const isBound = dataField?.ActionTarget?.isBound;
    const press = dataField ? handlerProvider.getDataFieldForActionButtonPressHandler(dataField, action, undefined, forContextMenu) : undefined;
    const enabled = operationAvailable ? TableHelper.isDataFieldForActionEnabled(table.tableDefinition, dataField.Action, !!isBound, actionContext.getObject(), action.enableOnSelect, dataFieldDataModelObjectPath?.targetEntityType, forContextMenu, true) : `{= ${ActionHelper.getNumberOfContextsExpression("single", forContextMenu)}}`;
    if (!forContextMenu) {
      // for table toolbar
      return _jsx(ActionToolbarAction, {
        id: generate([table.id, dataField, "ActionToolbarAction"]),
        "dt:designtime": action.visible === "true" || action.visible === "false" ? undefined : "not-adaptable-visibility",
        children: _jsx(Button, {
          id: generate([table.id, dataField]),
          text: action.text,
          press: press,
          type: ButtonType.Transparent,
          visible: action.visible,
          enabled: enabled,
          children: {
            customData: [createCustomData("actionId", generate([table.id, dataField]))]
          }
        })
      });
    } else {
      // for context menu
      return _jsx(MenuItem, {
        id: generate([table.id, dataField, "ContextMenu"]),
        text: action.text,
        press: press,
        visible: action.visibleForContextMenu,
        enabled: compileExpression(equal(pathInModel("contextmenu/numberOfSelectedContexts", "internal"), 1)),
        children: {
          customData: [createCustomData("actionId", generate([table.id, dataField, "ContextMenu"]))]
        }
      });
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
  function getCreateButton(standardAction, table, forContextMenu, collectionEntity) {
    const suffixResourceKey = collectionEntity.name;
    const buttonText = table.getTranslatedText("M_COMMON_TABLE_CREATE", undefined, suffixResourceKey);
    const createOutboundDetail = table.tableDefinition.annotation.create.outboundDetail;
    if (table.tableDefinition.control.enableUploadPlugin) {
      return _jsx(ActionsPlaceholder, {
        id: `${table.id}-uploadButton`,
        placeholderFor: "UploadButtonPlaceholder"
      });
    } else if (!forContextMenu) {
      return _jsx(ActionToolbarAction, {
        id: generate([table.id, standardAction.key, "ActionToolbarAction"]),
        "dt:designtime": "not-adaptable-tree",
        children: _jsx(Button, {
          id: generate([table.id, standardAction.key]),
          text: buttonText,
          "jsx:command": "cmd:Create|press",
          type: ButtonType.Transparent,
          visible: standardAction.visible,
          enabled: standardAction.enabled,
          children: {
            customData: createCustomData("IBNData", TableHelper.getIBNData(createOutboundDetail))
          }
        })
      });
    } else {
      return _jsx(MenuItem, {
        id: generate([table.id, standardAction.key, "ContextMenu"]),
        text: buttonText,
        "jsx:command": "cmd:Create::ContextMenu|press",
        visible: standardAction.visible,
        enabled: standardAction.enabledForContextMenu
      });
    }
  }
  function getCreateMenu(standardAction, table, collectionEntity, forContextMenu, handlerProvider) {
    const suffixResourceKey = collectionEntity.name;
    const buttonText = table.getTranslatedText("M_COMMON_TABLE_CREATE", undefined, suffixResourceKey);
    const values = table.tableDefinition.control.nodeType.values;
    const hasCustomCreateEnablement = table.tableDefinition.control.createEnablement !== undefined;
    const menuItems = values.map((allowedValue, index) => {
      const modelName = !forContextMenu ? "" : "contextmenu/";
      const isEnabled = hasCustomCreateEnablement ? notEqual(pathInModel(`${modelName}createEnablement/Create_${index}`, "internal"), false) : undefined;
      const id = forContextMenu ? generate([table.id, allowedValue.value, "ContextMenu"]) : generate([table.id, allowedValue.value]);
      return _jsx(MenuItem, {
        id: id,
        text: allowedValue.text,
        enabled: isEnabled ? compileExpression(isEnabled) : undefined,
        press: handlerProvider.getCreateMenuItemPressHandler(index, forContextMenu)
      });
    });
    if (forContextMenu) {
      return _jsx(MenuItem, {
        id: generate([table.id, standardAction.key, "ContextMenu"]),
        text: buttonText,
        visible: standardAction.visible,
        enabled: standardAction.enabledForContextMenu,
        children: {
          items: menuItems !== undefined && menuItems.length > 0 ? menuItems : undefined
        }
      });
    }
    return _jsx(ActionToolbarAction, {
      id: generate([table.id, standardAction.key, "ActionToolbarAction"]),
      "dt:designtime": "not-adaptable-tree",
      children: _jsx(MenuButton, {
        text: buttonText,
        type: ButtonType.Transparent,
        menuPosition: "BeginBottom",
        id: generate([table.id, standardAction.key]),
        visible: standardAction.visible,
        enabled: standardAction.enabled,
        children: {
          customData: [createCustomData("actionId", generate([table.id, standardAction.key]))],
          menu: _jsx(Menu, {
            children: menuItems
          })
        }
      })
    });
  }

  /**
   * Generates the xml string for the delete button.
   * @param standardAction Standard actions to be evaluated
   * @param table The instance of the table building block
   * @param forContextMenu Indicates if the action appears in the context menu. If false, the action appears in the table toolbar
   * @param collectionEntity The entity set of the collection
   * @returns The xml string for the delete button
   */
  function getDeleteButton(standardAction, table, forContextMenu, collectionEntity) {
    const suffixResourceKey = collectionEntity.name;
    const buttonText = table.getTranslatedText("M_COMMON_TABLE_DELETE", undefined, suffixResourceKey);
    if (!forContextMenu) {
      // for table toolbar
      return _jsx(ActionToolbarAction, {
        id: generate([table.id, standardAction.key, "ActionToolbarAction"]),
        "dt:designtime": "not-adaptable-tree",
        children: _jsx(Button, {
          id: generate([table.id, standardAction.key]),
          text: buttonText,
          "jsx:command": "cmd:DeleteEntry|press",
          type: ButtonType.Transparent,
          visible: standardAction.visible,
          enabled: standardAction.enabled,
          ariaHasPopup: "Dialog"
        })
      });
    } else {
      // for context menu
      return _jsx(MenuItem, {
        id: generate([table.id, standardAction.key, "ContextMenu"]),
        text: buttonText,
        "jsx:command": "cmd:DeleteEntry::ContextMenu|press",
        visible: standardAction.visible,
        enabled: standardAction.enabledForContextMenu
      });
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
  function getStandardAction(action, table, forContextMenu, handlerProvider, collectionEntity) {
    if (action.isTemplated === "false") {
      return undefined;
    }
    switch (action.key) {
      case StandardActionKeys.Create:
        if (!table.tableDefinition.annotation.isInsertUpdateActionsTemplated ||
        // We only have Create on the ContextMenu on the TreeTable
        table.tableDefinition.control.type !== "TreeTable" && forContextMenu) {
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
            return _jsx(ActionToolbarAction, {
              id: generate([table.id, action.key, "ActionToolbarAction"]),
              "dt:designtime": "not-adaptable-tree",
              children: _jsx(Button, {
                id: generate([table.id, action.key]),
                text: "{sap.fe.i18n>M_COMMON_TABLE_MASSEDIT}",
                press: handlerProvider.getMassEditButtonPressHandler(false),
                visible: action.visible,
                enabled: action.enabled
              })
            });
          } else {
            // for context menu
            return _jsx(MenuItem, {
              id: generate([table.id, action.key, "ContextMenu"]),
              text: "{sap.fe.i18n>M_COMMON_TABLE_MASSEDIT}",
              press: handlerProvider.getMassEditButtonPressHandler(true),
              visible: action.visibleForContextMenu,
              enabled: action.enabledForContextMenu
            });
          }
        }
        return undefined;
      case StandardActionKeys.Insights:
        if (!forContextMenu) {
          // for table toolbar
          return _jsx(ActionToolbarAction, {
            id: generate([table.id, action.key, "ActionToolbarAction"]),
            "dt:designtime": action.visible === "true" || action.visible === "false" ? undefined : "not-adaptable-visibility",
            visible: action.visible,
            children: _jsx(Button, {
              id: generate([table.id, action.key]),
              text: "{sap.fe.i18n>M_COMMON_INSIGHTS_CARD}",
              press: handlerProvider.addCardToInsightsPress,
              visible: action.visible,
              enabled: action.enabled,
              children: {
                layoutData: _jsx(OverflowToolbarLayoutData, {
                  priority: "AlwaysOverflow"
                })
              }
            })
          });
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
  function getActions(table, forContextMenu, handlerProvider, collectionContext, collectionEntity) {
    return table.tableDefinition.actions.map(action => {
      switch (action.type) {
        case ActionType.Standard:
          return getStandardAction(action, table, forContextMenu, handlerProvider, collectionEntity);
        case ActionType.Copy:
          return getCopyAction(action, table, forContextMenu, collectionContext, handlerProvider);
        default:
          return getAction(action, table, forContextMenu, collectionContext, handlerProvider);
      }
    }).filter(action => action !== undefined);
  }

  /**
   * Generates the control for BasicSearch.
   * @param useBasicSearch
   * @param filterBarId
   * @param _collectionIsDraftEnabled
   * @param isSearchable
   * @returns The control of the BasicSearch
   */
  _exports.getActions = getActions;
  function getBasicSearch(useBasicSearch, filterBarId, _collectionIsDraftEnabled, isSearchable) {
    if (useBasicSearch) {
      return _jsx(ActionToolbarAction, {
        id: generate([filterBarId, "ActionToolbarAction"]),
        label: "{sap.fe.i18n>M_BASIC_SEARCH}",
        "dt:designtime": "not-adaptable-tree",
        children: {
          action: _jsx(BasicSearchMacro, {
            id: filterBarId,
            useDraftEditState: _collectionIsDraftEnabled,
            visible: isSearchable
          })
        }
      });
    }
    return undefined;
  }

  /**
   * Generates the control for table fullscreen button.
   * @param table The instance of the table building block
   * @returns The control of the button
   */
  function getFullScreen(table) {
    if (table.tableDefinition.control.enableFullScreen) {
      return _jsx(ActionToolbarAction, {
        id: generate([table.id, "StandardAction", "FullScreen", "ActionToolbarAction"]),
        "dt:designtime": "not-adaptable-tree",
        children: {
          action: _jsx(TableFullScreenButton, {
            id: generate([table.id, "StandardAction", "FullScreen"])
          })
        }
      });
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
  function getCutButton(action, table) {
    let forContextMenu = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    if (!forContextMenu) {
      // for table toolbar
      return _jsx(ActionToolbarAction, {
        id: generate([table.id, "Cut", "ActionToolbarAction"]),
        "dt:designtime": "not-adaptable-tree",
        children: _jsx(Button, {
          id: generate([table.id, "Cut"]),
          text: "{sap.fe.i18n>M_TABLE_CUT}",
          "jsx:command": "cmd:Cut|press",
          visible: action.visible,
          enabled: action.enabled
        })
      });
    } else {
      // for context menu
      return _jsx(MenuItem, {
        id: generate([table.id, "Cut", "ContextMenu"]),
        text: "{sap.fe.i18n>M_TABLE_CUT}",
        "jsx:command": "cmd:Cut::ContextMenu|press",
        visible: action.visible,
        enabled: action.enabledForContextMenu
      });
    }
  }
  function getMoveUpDownButton(action, table, forContextMenu) {
    const forMoveUp = action.key === StandardActionKeys.MoveUp;
    if (!forContextMenu) {
      // for table toolbar
      return _jsx(ActionToolbarAction, {
        id: generate([table.id, action.key, "ActionToolbarAction"]),
        visible: action.visible,
        "dt:designtime": "not-adaptable-tree",
        children: _jsx(Button, {
          id: generate([table.id, action.key]),
          text: forMoveUp ? "{sap.fe.i18n>M_TABLE_MOVE_UP}" : "{sap.fe.i18n>M_TABLE_MOVE_DOWN}",
          "jsx:command": forMoveUp ? "cmd:TableMoveElementUp|press" : "cmd:TableMoveElementDown|press",
          visible: action.visible,
          enabled: action.enabled
        })
      });
    } else {
      // for context menu
      return _jsx(MenuItem, {
        id: generate([table.id, action.key, "ContextMenu"]),
        text: forMoveUp ? "{sap.fe.i18n>M_TABLE_MOVE_UP}" : "{sap.fe.i18n>M_TABLE_MOVE_DOWN}",
        "jsx:command": forMoveUp ? "cmd:TableMoveElementUp::ContextMenu|press" : "cmd:TableMoveElementDown::ContextMenu|press",
        visible: action.visible,
        enabled: action.enabledForContextMenu
      });
    }
  }
  /**
   * Generates the XML string for the Paste Button.
   * @param action The Paste action
   * @param table The instance of the table building block
   * @param forContextMenu Indicates if the action appears in the context menu. If false, the action appears in the table toolbar
   * @returns The XML string representation of the Paste Button
   */
  function getPasteButton(action, table) {
    let forContextMenu = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    const tableType = table.tableDefinition.control.type;
    if (tableType === "TreeTable") {
      if (!forContextMenu) {
        // for table toolbar
        return _jsx(ActionToolbarAction, {
          id: generate([table.id, "Paste", "ActionToolbarAction"]),
          "dt:designtime": "not-adaptable-tree",
          children: _jsx(Button, {
            id: generate([table.id, "Paste"]),
            text: "{sap.fe.i18n>M_PASTE}",
            "jsx:command": "cmd:Paste|press",
            visible: action.visible,
            enabled: action.enabled
          })
        });
      } else {
        // for Context Menu
        return _jsx(MenuItem, {
          id: generate([table.id, "Paste", "ContextMenu"]),
          text: "{sap.fe.i18n>M_PASTE}",
          "jsx:command": "cmd:Paste::ContextMenu|press",
          visible: action.visible,
          enabled: action.enabledForContextMenu
        });
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
  function getTableActionsTemplate(table, handlerProvider, collectionContext, collectionEntity) {
    const _collectionIsDraftEnabled = ModelHelper.isDraftNode(collectionEntity) || ModelHelper.isDraftRoot(collectionEntity);
    let searchable;
    if (table.isSearchable === false) {
      searchable = false;
    } else {
      searchable = table.tableDefinition.annotation.searchable;
    }
    const actions = [];
    const basicSearch = getBasicSearch(!!table.useBasicSearch, table.filterBar, _collectionIsDraftEnabled, searchable);
    if (basicSearch) {
      actions.push(basicSearch);
    }
    actions.push(...getActions(table, false, handlerProvider, collectionContext, collectionEntity));
    const fullScreen = getFullScreen(table);
    if (fullScreen) {
      actions.push(fullScreen);
    }
    return actions;
  }

  /**
   * Generates the xml string for context menu actions.
   * @param table The instance of the table building block
   * @param handlerProvider
   * @param collectionContext The context of the collection
   * @param collectionEntity The entity set of the collection
   * @returns The xml string representation of the actions
   */
  _exports.getTableActionsTemplate = getTableActionsTemplate;
  function getTableContextMenuTemplate(table, handlerProvider, collectionContext, collectionEntity) {
    const template = getActions(table, true, handlerProvider, collectionContext, collectionEntity);
    if (table.tableDefinition.control.type === "TreeTable") {
      template.push(getExpandedCollapseActions(table, true, handlerProvider.expandNode));
      template.push(getExpandedCollapseActions(table, false, handlerProvider.collapseNode));
    }
    return template;
  }
  _exports.getTableContextMenuTemplate = getTableContextMenuTemplate;
  function getExpandedCollapseActions(table, expand, pressHandler) {
    const enableExpression = expand ? and(equal(pathInModel("contextmenu/isExpandable", "internal"), true), equal(pathInModel("contextmenu/numberOfSelectedContexts", "internal"), 1)) : and(equal(pathInModel("contextmenu/isCollapsable", "internal"), true), equal(pathInModel("contextmenu/numberOfSelectedContexts", "internal"), 1));
    return _jsx(MenuItem, {
      id: generate([table.id, expand ? "Expand" : "Collapse", "ContextMenu"]),
      text: expand ? "{sap.fe.i18n>M_TABLE_CONTEXTMENU_EXPAND}" : "{sap.fe.i18n>M_TABLE_CONTEXTMENU_COLLAPSE}",
      press: pressHandler,
      enabled: enableExpression
    });
  }
  return _exports;
}, false);
//# sourceMappingURL=ActionsTemplating-dbg.js.map
