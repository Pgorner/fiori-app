/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/base/BindingToolkit", "sap/fe/core/CommonUtils", "sap/fe/core/controls/CommandExecution", "sap/fe/core/controls/FormElementWrapper", "sap/fe/core/converters/ManifestSettings", "sap/fe/core/converters/MetaModelConverter", "sap/fe/core/converters/annotations/DataField", "sap/fe/core/converters/controls/Common/table/StandardActions", "sap/fe/core/helpers/BindingHelper", "sap/fe/core/helpers/ModelHelper", "sap/fe/core/helpers/StableIdHelper", "sap/fe/core/helpers/TypeGuards", "sap/fe/core/templating/DataModelPathHelper", "sap/fe/core/templating/UIFormatters", "sap/fe/macros/ActionCommand", "sap/fe/macros/CommonHelper", "sap/fe/macros/MultiValueField", "sap/fe/macros/TSXUtils", "sap/fe/macros/ValueHelp", "sap/fe/macros/draftIndicator/DraftIndicator", "sap/fe/macros/field/FieldHelper", "sap/fe/macros/field/FieldTemplating", "sap/fe/macros/fpm/CustomFragment.block", "sap/fe/macros/internal/InternalField.block", "sap/fe/macros/internal/helpers/ActionHelper", "sap/fe/macros/internal/helpers/TableTemplating", "sap/fe/macros/microchart/MicroChart.block", "sap/fe/macros/situations/SituationsIndicator", "sap/fe/macros/table/ActionsTemplating", "sap/fe/macros/table/QuickFilterSelector", "sap/fe/macros/table/SlotColumn", "sap/fe/macros/table/TableHelper", "sap/fe/macros/table/uploadTable/UploadTableTemplate", "sap/m/FlexItemData", "sap/m/HBox", "sap/m/Label", "sap/m/Menu", "sap/m/MenuItem", "sap/m/ObjectStatus", "sap/m/SegmentedButton", "sap/m/SegmentedButtonItem", "sap/m/VBox", "sap/m/library", "sap/m/plugins/CellSelector", "sap/m/plugins/ContextMenuSetting", "sap/m/plugins/CopyProvider", "sap/m/plugins/DataStateIndicator", "sap/ui/core/CustomData", "sap/ui/core/Lib", "sap/ui/fl/variants/VariantManagement", "sap/ui/mdc/Table", "sap/ui/mdc/actiontoolbar/ActionToolbarAction", "sap/ui/mdc/enums/TableP13nMode", "sap/ui/mdc/p13n/PersistenceProvider", "sap/ui/mdc/table/Column", "sap/ui/mdc/table/CreationRow", "sap/ui/mdc/table/DragDropConfig", "sap/ui/mdc/table/GridTableType", "sap/ui/mdc/table/ResponsiveColumnSettings", "sap/ui/mdc/table/ResponsiveTableType", "sap/ui/mdc/table/RowActionItem", "sap/ui/mdc/table/RowSettings", "sap/ui/mdc/table/TreeTableType", "sap/fe/base/jsx-runtime/jsx", "sap/fe/base/jsx-runtime/jsxs"], function (Log, BindingToolkit, CommonUtils, CommandExecution, FormElementWrapper, ManifestSettings, MetaModelConverter, DataField, StandardActions, BindingHelper, ModelHelper, StableIdHelper, TypeGuards, DataModelPathHelper, UIFormatters, ActionCommand, CommonHelper, MultiValueFieldBlock, TSXUtils, ValueHelp, DraftIndicator, FieldHelper, FieldTemplating, CustomFragmentBlock, InternalFieldBlock, ActionHelper, TableTemplating, MicroChartBlock, SituationsIndicator, ActionsTemplating, QuickFilterSelector, SlotColumn, TableHelper, UploadTableTemplate, FlexItemData, HBox, Label, Menu, MenuItem, ObjectStatus, SegmentedButton, SegmentedButtonItem, VBox, library, CellSelector, ContextMenuSetting, CopyProvider, DataStateIndicator, CustomData, Library, VariantManagement, MDCTable, ActionToolbarAction, TableP13nMode, PersistenceProvider, Column, CreationRow, DragDropConfig, GridTableType, ResponsiveColumnSettings, ResponsiveTableType, RowActionItem, RowSettings, TreeTableType, _jsx, _jsxs) {
  "use strict";

  var _exports = {};
  var ObjectMarkerVisibility = library.ObjectMarkerVisibility;
  var getUploadPlugin = UploadTableTemplate.getUploadPlugin;
  var getTableContextMenuTemplate = ActionsTemplating.getTableContextMenuTemplate;
  var getTableActionsTemplate = ActionsTemplating.getTableActionsTemplate;
  var buildExpressionForHeaderVisible = TableTemplating.buildExpressionForHeaderVisible;
  var getVisibleExpression = FieldTemplating.getVisibleExpression;
  var getDraftIndicatorVisibleBinding = FieldTemplating.getDraftIndicatorVisibleBinding;
  var createCustomDatas = TSXUtils.createCustomDatas;
  var createCustomData = TSXUtils.createCustomData;
  var getCommandExecutionForAction = ActionCommand.getCommandExecutionForAction;
  var isMultiValueField = UIFormatters.isMultiValueField;
  var isPathUpdatable = DataModelPathHelper.isPathUpdatable;
  var getPathRelativeLocation = DataModelPathHelper.getPathRelativeLocation;
  var enhanceDataModelPath = DataModelPathHelper.enhanceDataModelPath;
  var isSingleton = TypeGuards.isSingleton;
  var isMultipleNavigationProperty = TypeGuards.isMultipleNavigationProperty;
  var isAnnotationOfType = TypeGuards.isAnnotationOfType;
  var isAnnotationOfTerm = TypeGuards.isAnnotationOfTerm;
  var generate = StableIdHelper.generate;
  var singletonPathVisitor = BindingHelper.singletonPathVisitor;
  var UI = BindingHelper.UI;
  var StandardActionKeys = StandardActions.StandardActionKeys;
  var isDataFieldTypes = DataField.isDataFieldTypes;
  var isDataFieldForAnnotation = DataField.isDataFieldForAnnotation;
  var isDataField = DataField.isDataField;
  var hasDataPointTarget = DataField.hasDataPointTarget;
  var getInvolvedDataModelObjects = MetaModelConverter.getInvolvedDataModelObjects;
  var CreationMode = ManifestSettings.CreationMode;
  var pathInModel = BindingToolkit.pathInModel;
  var or = BindingToolkit.or;
  var not = BindingToolkit.not;
  var isTruthy = BindingToolkit.isTruthy;
  var isConstant = BindingToolkit.isConstant;
  var ifElse = BindingToolkit.ifElse;
  var equal = BindingToolkit.equal;
  var constant = BindingToolkit.constant;
  var compileExpression = BindingToolkit.compileExpression;
  var and = BindingToolkit.and;
  /**
   * Generates the table type for the table.
   * @param tableDefinition
   * @param _collection
   * @param tableType
   * @param selectionLimit
   * @returns The table type
   */
  function getTableType(tableDefinition, _collection, tableType, selectionLimit) {
    const collection = _collection.getObject();
    switch (tableType) {
      case "GridTable":
        return _jsx(GridTableType, {
          rowCountMode: tableDefinition.control.rowCountMode,
          rowCount: tableDefinition.control.rowCount,
          selectionLimit: selectionLimit,
          fixedColumnCount: tableDefinition.control.frozenColumnCount,
          scrollThreshold: tableDefinition.control.scrollThreshold
        });
      case "TreeTable":
        return _jsx(TreeTableType, {
          rowCountMode: tableDefinition.control.rowCountMode,
          rowCount: tableDefinition.control.rowCount,
          fixedColumnCount: tableDefinition.control.frozenColumnCount,
          scrollThreshold: tableDefinition.control.scrollThreshold
        });
      default:
        return _jsx(ResponsiveTableType, {
          showDetailsButton: true,
          detailsButtonSetting: "{=['Low', 'Medium', 'None']}",
          growingMode: collection.$kind === "EntitySet" ? "Scroll" : undefined
        });
    }
  }

  /**
   * Generates the DataSateIndicator for the table.
   * @param handlerProvider
   * @returns The datastate indicator
   */
  function getDataStateIndicator(handlerProvider) {
    return _jsx(DataStateIndicator, {
      filter: handlerProvider.dataStateIndicatorFilter,
      enableFiltering: true,
      dataStateChange: handlerProvider.dataStateChange
    });
  }

  /**
   * Generates the valueHelp based on the dataField path.
   * @param id
   * @param dataFieldPath DataFieldPath to be evaluated
   * @param forMultiValueField
   * @returns The valueHelp
   */
  function getValueHelpTemplateFromPath(id, dataFieldPath, forMultiValueField) {
    if (dataFieldPath) {
      return _jsx(ValueHelp, {
        idPrefix: generate([id, "TableValueHelp"]),
        metaPath: dataFieldPath + "/Value",
        useMultiValueField: forMultiValueField === true ? true : undefined
      });
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
  function getValueHelps(id, column, convertedMetaData, contextObjectPath) {
    const dataFieldObject = convertedMetaData.resolvePath(column.annotationPath).target;
    if (isDataFieldForAnnotation(dataFieldObject) && dataFieldObject.Target.$target?.term === "com.sap.vocabularies.UI.v1.Chart") {
      return [];
    } else if (isDataFieldForAnnotation(dataFieldObject) && dataFieldObject.Target.$target?.term === "com.sap.vocabularies.UI.v1.FieldGroup") {
      const allVH = [];
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
  function getDragAndDropEnabled(contextObjectPath, tableDefinition) {
    const isPathUpdatableOnNavigation = isPathUpdatable(contextObjectPath, {
      ignoreTargetCollection: true,
      authorizeUnresolvable: true,
      pathVisitor: (path, navigationPaths) => singletonPathVisitor(path, contextObjectPath.convertedTypes, navigationPaths)
    });
    const isPathUpdatableOnTarget = isPathUpdatable(contextObjectPath, {
      authorizeUnresolvable: true,
      pathVisitor: (path, navigationPaths) => singletonPathVisitor(path, contextObjectPath.convertedTypes, navigationPaths)
    });
    if (contextObjectPath.startingEntitySet === contextObjectPath.targetEntitySet) {
      // ListReport case: we allow drag and drop on draft-enabled entities
      if (contextObjectPath.startingEntitySet.annotations.Common?.DraftRoot !== undefined) {
        return and(isPathUpdatableOnNavigation._type === "Unresolvable" ? ifElse(isConstant(isPathUpdatableOnTarget), isPathUpdatableOnTarget, constant(true)) : isPathUpdatableOnNavigation, tableDefinition.control.isHierarchyParentNodeUpdatable);
      } else {
        return constant(false);
      }
    } else {
      // ObjectPage case: we allow drag and drop in edit mode
      return and(isPathUpdatableOnNavigation._type === "Unresolvable" ? ifElse(isConstant(isPathUpdatableOnTarget), isPathUpdatableOnTarget, constant(true)) : isPathUpdatableOnNavigation, UI.IsEditable, tableDefinition.control.isHierarchyParentNodeUpdatable);
    }
  }
  function getDependents(id, tableDefinition, tableType, readOnly, contextObjectPath, variantManagement, handlerProvider, metaPath, collection) {
    const dependents = [];
    const cutAction = tableDefinition.actions.find(a => a.key === StandardActionKeys.Cut);
    if (cutAction?.isTemplated === "true") {
      dependents.push(_jsx(CommandExecution, {
        execute: handlerProvider.getCutHandler(false),
        command: "Cut",
        enabled: cutAction.enabled
      }));
    }
    const pasteAction = tableDefinition.actions.find(a => a.key === StandardActionKeys.Paste);
    if (pasteAction?.visible !== "false" && tableType === "TreeTable") {
      dependents.push(_jsx(CommandExecution, {
        execute: handlerProvider.getPasteHandler(false),
        command: "Paste",
        enabled: pasteAction?.enabled
      }));
    }
    if (!readOnly && tableDefinition?.columns) {
      for (const column of tableDefinition.columns) {
        if (column.availability === "Default" && "annotationPath" in column) {
          dependents.push(...getValueHelps(id, column, contextObjectPath.convertedTypes, contextObjectPath));
        }
      }
    }
    const createAction = tableDefinition.actions.find(a => a.key === StandardActionKeys.Create);
    const deleteAction = tableDefinition.actions.find(a => a.key === StandardActionKeys.Delete);
    if (tableDefinition.annotation.isInsertUpdateActionsTemplated && createAction?.isTemplated === "true" && tableDefinition.control.nodeType === undefined && tableDefinition.control.enableUploadPlugin === false) {
      // The shortcut is not enabled in case of a create menu (i.e. when nodeType is defined)
      dependents.push(_jsx(CommandExecution, {
        execute: handlerProvider.getCreateButtonPressHandler(false, false),
        visible: createAction.visible,
        enabled: createAction.enabled,
        command: "Create"
      }));
    }
    if (deleteAction?.isTemplated === "true") {
      dependents.push(_jsx(CommandExecution, {
        execute: handlerProvider.getDeleteButtonPressHandler(false),
        visible: deleteAction.visible,
        enabled: deleteAction.enabled,
        command: "DeleteEntry"
      }));
    }

    // Move up and down actions
    const moveUpAction = tableDefinition.actions.find(a => a.key === StandardActionKeys.MoveUp);
    const moveDownAction = tableDefinition.actions.find(a => a.key === StandardActionKeys.MoveDown);
    if (moveUpAction && moveDownAction && moveUpAction.visible !== "false" && moveDownAction.visible !== "false" && tableType === "TreeTable") {
      dependents.push(_jsx(CommandExecution, {
        execute: handlerProvider.getMoveUpDownHandler(true, false),
        command: "TableMoveElementUp",
        enabled: moveUpAction.enabled
      }));
      dependents.push(_jsx(CommandExecution, {
        execute: handlerProvider.getMoveUpDownHandler(false, false),
        command: "TableMoveElementDown",
        enabled: moveDownAction.enabled
      }));
    }
    for (const actionName in tableDefinition.commandActions) {
      const action = tableDefinition.commandActions[actionName];
      const actionCommand = getActionCommand(actionName, action, false, contextObjectPath.convertedTypes, metaPath, collection, tableDefinition, contextObjectPath, handlerProvider);
      if (actionCommand) {
        dependents.push(actionCommand);
      }
    }
    dependents.push(_jsx(CommandExecution, {
      execute: handlerProvider.displayTableSettings,
      command: "TableSettings"
    }));
    if (variantManagement === "None") {
      // Persistence provider offers persisting personalization changes without variant management
      dependents.push(_jsx(PersistenceProvider, {
        id: generate([id, "PersistenceProvider"]),
        for: id
      }));
    }
    dependents.push(_jsx(ContextMenuSetting, {
      scope: "Selection"
    }));
    if (tableDefinition.control.enableUploadPlugin) {
      dependents.push(getUploadPlugin(tableDefinition, id));
    }
    return dependents;
  }
  _exports.getDependents = getDependents;
  function getActions(table, handlerProvider, collectionContext, collectionEntity) {
    const actions = [];
    if (handlerProvider.segmentedButtonPress) {
      const alpButtonItems = [];
      if (CommonHelper.isDesktop()) {
        alpButtonItems.push(_jsx(SegmentedButtonItem, {
          tooltip: "{sap.fe.i18n>M_COMMON_HYBRID_SEGMENTED_BUTTON_ITEM_TOOLTIP}",
          icon: "sap-icon://chart-table-view"
        }, "Hybrid"));
      }
      alpButtonItems.push(_jsx(SegmentedButtonItem, {
        tooltip: "{sap.fe.i18n>M_COMMON_CHART_SEGMENTED_BUTTON_ITEM_TOOLTIP}",
        icon: "sap-icon://bar-chart"
      }, "Chart"));
      alpButtonItems.push(_jsx(SegmentedButtonItem, {
        tooltip: "{sap.fe.i18n>M_COMMON_TABLE_SEGMENTED_BUTTON_ITEM_TOOLTIP}",
        icon: "sap-icon://table-view"
      }, "Table"));
      actions.push(_jsx(ActionToolbarAction, {
        layoutInformation: '{ aggregationName: "end", alignment: "End" }',
        visible: "{= ${pageInternal>alpContentView} === 'Table' }",
        children: {
          action: _jsx(SegmentedButton, {
            id: generate([table.id, "SegmentedButton", "TemplateContentView"]),
            select: handlerProvider.segmentedButtonPress,
            selectedKey: "{pageInternal>alpContentView}",
            children: {
              items: alpButtonItems
            }
          })
        }
      }));
    }
    actions.push(...getTableActionsTemplate(table, handlerProvider, collectionContext, collectionEntity));
    return actions.length > 0 ? actions : undefined;
  }
  function getRowSettings(tableDefinition, rowAction, tableType, handlerProvider) {
    const rowActionItem = _jsx(RowActionItem, {
      type: rowAction,
      press: tableType === "ResponsiveTable" ? undefined : handlerProvider.rowPress,
      visible: tableDefinition.annotation.row?.visible
    });
    return _jsx(RowSettings, {
      navigated: tableDefinition.annotation.row?.rowNavigated,
      highlight: tableDefinition.annotation.row?.rowHighlighting,
      children: {
        rowActions: rowAction === "Navigation" ? rowActionItem : undefined
      }
    });
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
  function getContextMenu(tableProperties, tableType, tableDefinition, collectionEntity, rowAction, handlerProvider, contextObjectPath, metaPath, collection, navigationInEditMode) {
    const menuItems = getTableContextMenuTemplate(tableProperties, handlerProvider, collection, collectionEntity);
    if (rowAction === "Navigation" && !navigationInEditMode) {
      menuItems.push(getOpenInNewTabTemplate(handlerProvider));
    }
    if (menuItems.length > 0) {
      return _jsx(Menu, {
        itemSelected: handlerProvider.contextMenuItemSelected,
        children: {
          dependents: getDependentsForContextMenu(tableDefinition, tableType, contextObjectPath, handlerProvider, metaPath, collection),
          items: menuItems
        }
      });
    }
    return undefined;
  }

  /**
   * Generates the template string for the MenuItem.
   * @param handlerProvider
   * @returns The xml string representation for the MenuItem
   */
  function getOpenInNewTabTemplate(handlerProvider) {
    // The 'Open in New Tab' action should not be visible for sticky sessions in edit mode
    // For the context menu, the visibility should also consider the 'inactiveContext' property:
    // only when at least one selected context is active (i.e. "contextmenu/inactiveContext" is false), the action should be visible in the context menu
    // The second is only relevant when the table manifest setting "creationMode" is "InlineCreationRows"
    const visible = and(not(and(pathInModel("/sessionOn", "internal"), UI.IsEditable)), not(pathInModel("contextmenu/inactiveContext", "internal")));
    return _jsx(MenuItem, {
      "core:require": "{API: 'sap/fe/macros/table/TableAPI'}",
      startsSection: true,
      text: "{sap.fe.i18n>M_COMMON_TABLE_CONTEXT_MENU_OPEN_IN_NEW_TAB}",
      press: handlerProvider.contextMenuOpenInNewTab,
      enabled: "{= ${internal>contextmenu/numberOfSelectedContexts} > 0}",
      visible: visible
    });
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
  function getDependentsForContextMenu(tableDefinition, tableType, contextObjectPath, handlerProvider, metaPath, collection) {
    const dependents = [];
    const createAction = tableDefinition.actions.find(a => a.key === StandardActionKeys.Create);
    if (createAction?.isTemplated === "true" && tableType === "TreeTable") {
      dependents.push(_jsx(CommandExecution, {
        execute: handlerProvider.getCreateButtonPressHandler(true, false),
        command: "Create::ContextMenu",
        visible: createAction.visible,
        enabled: createAction.enabledForContextMenu
      }));
    }
    const cutAction = tableDefinition.actions.find(a => a.key === StandardActionKeys.Cut);
    if (cutAction?.isTemplated === "true") {
      dependents.push(_jsx(CommandExecution, {
        execute: handlerProvider.getCutHandler(true),
        command: "Cut::ContextMenu",
        enabled: cutAction.enabledForContextMenu
      }));
    }
    const pasteAction = tableDefinition.actions.find(a => a.key === StandardActionKeys.Paste);
    if (pasteAction?.visible !== "false" && tableType === "TreeTable") {
      dependents.push(_jsx(CommandExecution, {
        execute: handlerProvider.getPasteHandler(true),
        command: "Paste::ContextMenu",
        enabled: pasteAction?.enabledForContextMenu
      }));
    }
    const deleteAction = tableDefinition.actions.find(a => a.key === StandardActionKeys.Delete);
    if (deleteAction?.isTemplated === "true") {
      dependents.push(_jsx(CommandExecution, {
        execute: handlerProvider.getDeleteButtonPressHandler(true),
        visible: deleteAction.visible,
        enabled: deleteAction.enabledForContextMenu,
        command: "DeleteEntry::ContextMenu"
      }));
    }

    // Move up and down actions
    const moveUpAction = tableDefinition.actions.find(a => a.key === StandardActionKeys.MoveUp);
    const moveDownAction = tableDefinition.actions.find(a => a.key === StandardActionKeys.MoveDown);
    if (moveUpAction && moveDownAction && moveUpAction.visible !== "false" && moveDownAction.visible !== "false" && tableType === "TreeTable") {
      dependents.push(_jsx(CommandExecution, {
        execute: handlerProvider.getMoveUpDownHandler(true, true),
        command: "TableMoveElementUp::ContextMenu",
        enabled: moveUpAction.enabledForContextMenu
      }));
      dependents.push(_jsx(CommandExecution, {
        execute: handlerProvider.getMoveUpDownHandler(false, true),
        command: "TableMoveElementDown::ContextMenu",
        enabled: moveDownAction.enabledForContextMenu
      }));
    }
    for (const actionName in tableDefinition.commandActions) {
      const action = tableDefinition.commandActions[actionName];
      const actionCommand = getActionCommand(actionName, action, true, contextObjectPath.convertedTypes, metaPath, collection, tableDefinition, contextObjectPath, handlerProvider);
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
  function getVariantManagement(variantManagement, id, headerLevel, handlerProvider) {
    if (variantManagement === "Control") {
      return _jsx(VariantManagement, {
        id: generate([id, "VM"]),
        showSetAsDefault: true,
        select: handlerProvider.variantSelected,
        headerLevel: headerLevel,
        save: handlerProvider.variantSaved,
        for: [id]
      });
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
  function getQuickFilter(tableDefinition, id, handlerProvider, metaPath) {
    if (tableDefinition.control.filters?.quickFilters) {
      const quickFilters = tableDefinition.control.filters.quickFilters;
      return _jsx(QuickFilterSelector, {
        id: generate([id, "QuickFilterContainer"]),
        metaPath: metaPath,
        filterConfiguration: quickFilters,
        selectionChange: handlerProvider.quickFilterSelectionChange
      });
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
  function getCopyProvider(tableType, contextObjectPath, disableCopyToClipboard) {
    let visibleExpression;
    if (disableCopyToClipboard) {
      visibleExpression = constant(false);
    } else if (tableType === "TreeTable") {
      // For a TreeTable, the copy button shall be visible only when drag and drop is disabled
      if (contextObjectPath.startingEntitySet === contextObjectPath.targetEntitySet) {
        // ListReport: enable copy if the entity is not draft-enabled
        visibleExpression = constant(contextObjectPath.startingEntitySet.annotations.Common?.DraftRoot === undefined);
      } else {
        // ObjectPage: enable copy in read-only
        visibleExpression = not(UI.IsEditable);
      }
    } else {
      visibleExpression = constant(true);
    }
    return _jsx(CopyProvider, {
      visible: visibleExpression
    });
  }

  /**
   * Generates the CellSelector for the table.
   * @param tableType
   * @param tableDefinition
   * @param contextObjectPath
   * @param disableCopyToClipboard
   * @returns The CellSelector
   */
  function getCellSelector(tableType, tableDefinition, contextObjectPath, disableCopyToClipboard) {
    if (!disableCopyToClipboard && tableType && ["ResponsiveTable", "GridTable", "TreeTable"].includes(tableType)) {
      return _jsx(CellSelector, {
        enabled: or(tableType !== "TreeTable", not(getDragAndDropEnabled(contextObjectPath, tableDefinition))),
        rangeLimit: 200
      });
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
  function getCreationRow(creationMode, tableDefinition, id, disableAddRowButtonForEmptyData, handlerProvider, customValidationFunction) {
    if (creationMode.name === CreationMode.CreationRow) {
      const creationRowAction = tableDefinition.actions.find(a => a.key === StandardActionKeys.CreationRow);
      if (creationRowAction?.isTemplated) {
        const customData = createCustomDatas([{
          key: "disableAddRowButtonForEmptyData",
          value: disableAddRowButtonForEmptyData
        }, {
          key: "customValidationFunction",
          value: customValidationFunction
        }]);
        return _jsx(CreationRow, {
          id: generate([id, CreationMode.CreationRow]),
          visible: creationRowAction.visible,
          apply: handlerProvider.getCreateButtonPressHandler(false, true),
          applyEnabled: creationRowAction.enabled,
          children: {
            customData: customData
          }
        });
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
  function getDragAndDropConfig(tableType, contextObjectPath, tableDefinition, handlerProvider) {
    if (tableType === "TreeTable") {
      return _jsx(DragDropConfig, {
        enabled: compileExpression(getDragAndDropEnabled(contextObjectPath, tableDefinition)),
        dropPosition: tableDefinition.annotation.allowDropBetweenNodes === true ? "OnOrBetween" : "On",
        draggable: true,
        droppable: true,
        dragStart: handlerProvider.dragStartDocument,
        dragEnter: handlerProvider.dragEnterDocument,
        drop: handlerProvider.dropDocument
      });
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
  function getActionCommand(actionName, action, forContextMenu, convertedMetaData, metaPath, collection, tableDefinition, contextObjectPath, handlerProvider) {
    const dataField = action.annotationPath ? convertedMetaData.resolvePath(action.annotationPath).target : undefined;
    const actionContextPath = action.annotationPath ? CommonHelper.getActionContext(metaPath.getModel().createBindingContext(action.annotationPath + "/Action")) : undefined;
    const actionContext = metaPath.getModel().createBindingContext(actionContextPath);
    const dataFieldDataModelObjectPath = actionContext ? getInvolvedDataModelObjects(actionContext, collection) : undefined;
    const isBound = dataField?.ActionTarget?.isBound;
    const isOperationAvailable = dataField?.ActionTarget?.annotations?.Core?.OperationAvailable?.valueOf() !== false;
    const displayCommandAction = action.type === "ForAction" ? isBound !== true || isOperationAvailable : true;
    const enabled = !forContextMenu ? action.enabled : action.enabledForContextMenu;
    if (displayCommandAction && (!forContextMenu || TableHelper.isActionShownInContextMenu(action, contextObjectPath))) {
      const command = !forContextMenu ? action.command : action.command + "::ContextMenu";
      const parameters = {
        onExecuteAction: handlerProvider.getDataFieldForActionButtonPressHandler(dataField, action, undefined, forContextMenu),
        onExecuteIBN: handlerProvider.getDataFieldForIBNPressHandler(action, false),
        onExecuteManifest: handlerProvider.getManifestActionPressHandler(action, forContextMenu),
        isIBNEnabled: enabled ?? TableHelper.isDataFieldForIBNEnabled({
          collection: collection,
          tableDefinition: tableDefinition
        }, dataField, !!dataField.RequiresContext, dataField.NavigationAvailable, forContextMenu),
        isActionEnabled: enabled ?? TableHelper.isDataFieldForActionEnabled(tableDefinition, dataField.Action, !!isBound, actionContextPath, action.enableOnSelect, dataFieldDataModelObjectPath?.targetEntityType, forContextMenu),
        isEnabled: enabled
      };
      return getCommandExecutionForAction(command, tableDefinition.commandActions[actionName], parameters);
    }
    return undefined;
  }

  /**
   * Generates the template string for the required modules.
   * @param tableDefinition
   * @returns The list of required modules
   */
  function getCoreRequire(tableDefinition) {
    const customModules = tableDefinition.control.additionalRequiredModules ?? [];
    return `{TableRuntime: 'sap/fe/macros/table/TableRuntime', API: 'sap/fe/macros/table/TableAPI'${customModules.map((module, index) => `, customModule${index + 1}: '${module}'`).join("")}}`;
  }

  /**
   * Create the template for a custom column that will load a CustomFragment.
   * @param tableId The TableID
   * @param column The custom column definition
   * @param collection The collection context used for context path
   * @returns The the custom column.
   */
  function getCustomColumnTemplate(tableId, column, collection) {
    return _jsx(Column, {
      id: generate([tableId, "C", column.id]),
      propertyKey: column.name,
      width: column.width,
      header: column.header,
      hAlign: column.horizontalAlign,
      tooltip: column.tooltip,
      required: column.required,
      children: {
        extendedSettings: _jsx(ResponsiveColumnSettings, {
          importance: column.importance
        }),
        template: _jsx(CustomFragmentBlock, {
          id: column.key,
          fragmentName: column.template,
          contextPath: collection,
          children: {
            childCustomData: _jsx(CustomData, {
              value: TableHelper.createBindingToLoadProperties(column.properties)
            }, "AssociatedProperties")
          }
        })
      }
    });
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
  _exports.getCustomColumnTemplate = getCustomColumnTemplate;
  function getComputedColumn(tableId, column, collection, enableAnalytics) {
    if (column.isDraftIndicator) {
      return _jsx(Column, {
        id: generate([tableId, "C", "computedColumns", "draftStatus"]),
        headerVisible: false,
        propertyKey: column.name,
        header: column.label,
        tooltip: column.tooltip,
        width: "3em",
        children: _jsx(DraftIndicator, {
          draftIndicatorType: ObjectMarkerVisibility.IconOnly,
          contextPath: collection.getPath(),
          usedInTable: true,
          usedInAnalyticalTable: enableAnalytics
        })
      });
    } else if (column.isSituationsIndicator) {
      return _jsx(Column, {
        id: generate([tableId, "C", "computedColumns", "situationsIndicator"]),
        propertyKey: column.name,
        header: column.label,
        tooltip: column.tooltip,
        headerVisible: false,
        width: "4em",
        children: _jsx(SituationsIndicator, {
          contextPath: collection.getPath()
        })
      });
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
  _exports.getComputedColumn = getComputedColumn;
  function getSlotColumn(tableId, column, isReadOnly) {
    return _jsx(Column, {
      id: generate([tableId, "C", column.id]),
      propertyKey: column.name,
      width: column.width,
      hAlign: column.horizontalAlign,
      header: column.header,
      tooltip: column.tooltip,
      required: isReadOnly ? undefined : column.required,
      children: {
        extendedSettings: _jsx(ResponsiveColumnSettings, {
          importance: column.importance
        }),
        template: _jsx(SlotColumn, {
          templateId: column.template?.startsWith("<") ? undefined : column.template,
          children: {
            content: column.template?.startsWith("<") ? column.template : undefined
          }
        })
      }
    });
  }

  /**
   * Create the template for the DraftIndicator.
   * @param collection The context of the collection
   * @param column The column definition
   * @returns The XML string representing the DraftIndicator.
   */
  _exports.getSlotColumn = getSlotColumn;
  function getDraftIndicator(collection, column) {
    if (collection.getObject("./@com.sap.vocabularies.Common.v1.DraftRoot") && collection.getObject("./@com.sap.vocabularies.Common.v1.SemanticKey") && column.formatOptions?.fieldGroupDraftIndicatorPropertyPath) {
      return _jsx(FormElementWrapper, {
        children: _jsx(DraftIndicator, {
          draftIndicatorType: ObjectMarkerVisibility.IconAndText,
          contextPath: collection.getPath(),
          visible: getDraftIndicatorVisibleBinding(column.formatOptions?.fieldGroupName),
          ariaLabelledBy: ["this>ariaLabelledBy"]
        })
      });
    }
    return undefined;
  }

  /**
   * Create the SituationIndicator ObjectStatus.
   * @param collection The context of the collection
   * @param column The column definition
   * @returns The ObjectStatus.
   */
  function getSituationIndicator(collection, column) {
    if (collection.getObject("./@com.sap.vocabularies.Common.v1.SemanticKey") && column.formatOptions?.fieldGroupDraftIndicatorPropertyPath) {
      return _jsx(ObjectStatus, {
        visible: column.formatOptions?.showErrorObjectStatus,
        class: "sapUiSmallMarginBottom",
        text: "{sap.fe.i18n>Contains_Errors}",
        state: "Error"
      });
    }
    return undefined;
  }

  /**
   * Determines the default date-time format style based on the given data field context.
   * @param dataFieldContext The context of the data field
   * @returns Returns 'short' if the underlying data field is of the type 'Edm.TimeOfDay', otherwise undefined.
   */
  function getDefaultDateTimeStyle(dataFieldContext) {
    const targetObject = getInvolvedDataModelObjects(dataFieldContext).targetObject;
    if (isDataField(targetObject) && targetObject.Value?.$target?.type === "Edm.TimeOfDay") {
      return "short";
    }
    if (isDataFieldForAnnotation(targetObject) && hasDataPointTarget(targetObject) && targetObject.Target.$target?.Value.$target.type === "Edm.TimeOfDay") {
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
  function getCreationTemplate(tableId, column, tableType, creationMode, isTableReadOnly, collection, dataField, fieldMode, enableAnalytics, customValidationFunction) {
    if (creationMode.name === "CreationRow") {
      let columnEditMode;
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
      return _jsx(InternalFieldBlock, {
        "core:require": "{TableRuntime: 'sap/fe/macros/table/TableRuntime'}",
        vhIdPrefix: generate([tableId, "TableValueHelp"]),
        editMode: columnEditMode,
        contextPath: collection,
        metaPath: dataField,
        wrap: tableType === "ResponsiveTable",
        change: `TableRuntime.onFieldChangeInCreationRow($event, '${customValidationFunction ?? ""}')`,
        showErrorObjectStatus: column.formatOptions?.showErrorObjectStatus,
        formatOptions: {
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
        }
      });
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
  function getMacroFieldTemplate(tableId, tableDefinition, column, dataFieldContext, collection, enableAnalytics, tableType, isTableReadOnly, creationMode, fieldMode, onChangeFunction, isCompactType, textAlign, ariaLabelledBy, showEmptyIndicator, className) {
    const dataFieldObject = dataFieldContext.getObject();
    let columnEditMode;
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
    return _jsx(InternalFieldBlock, {
      vhIdPrefix: generate([tableId, "TableValueHelp"]),
      editMode: columnEditMode,
      contextPath: collection,
      metaPath: dataFieldContext,
      textAlign: textAlign,
      wrap: tableType === "ResponsiveTable",
      class: className,
      onLiveChange: creationMode.name === "InlineCreationRows" ? "TableAPI.onFieldLiveChange($event)" : undefined,
      change: onChangeFunction,
      ariaLabelledBy: ariaLabelledBy ? [ariaLabelledBy] : undefined,
      navigateAfterAction: column.isNavigable,
      showErrorObjectStatus: column.formatOptions?.showErrorObjectStatus,
      formatOptions: {
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
      }
    });
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
  _exports.getMacroFieldTemplate = getMacroFieldTemplate;
  function getColumnContentTemplate(tableId, tableDefinition, column, dataFieldOP, dataFieldContext, collection, enableAnalytics, tableType, isTableReadOnly, creationMode, fieldMode, onChangeFunction, isCompactType, customValidationFunction) {
    let template;
    let creationTemplate;
    const dataField = dataFieldOP.targetObject;
    if (isAnnotationOfType(dataField, "com.sap.vocabularies.UI.v1.DataFieldForAnnotation") && (isAnnotationOfTerm(dataField.Target.$target, "com.sap.vocabularies.UI.v1.Chart") || isAnnotationOfTerm(dataField.Target.$target, "com.sap.vocabularies.UI.v1.PresentationVariant"))) {
      const showOnlyChart = (tableType === "ResponsiveTable" ? !column.settings?.showMicroChartLabel : undefined) ?? true;
      const microChartSize = tableType === "ResponsiveTable" ? column.settings?.microChartSize ?? "XS" : "XS";
      let microChartCollection = collection.getModel().createBindingContext(collection.getPath(dataFieldContext.getObject("Target/$AnnotationPath")));
      microChartCollection = collection.getModel().createBindingContext(CommonHelper.getNavigationContext(microChartCollection));
      //We only consider the first visualization of the PV in PV case and expect it to be a chart (similar to VisualFilters)
      template = _jsx(MicroChartBlock, {
        id: generate([tableId, dataField]),
        contextPath: microChartCollection,
        metaPath: isAnnotationOfTerm(dataField.Target.$target, "com.sap.vocabularies.UI.v1.PresentationVariant") ? dataFieldContext.getModel().createBindingContext(dataFieldContext.getPath() + "/Target/$AnnotationPath/Visualizations/0/$AnnotationPath") : dataFieldContext.getModel().createBindingContext(dataFieldContext.getPath() + "/Target/$AnnotationPath"),
        showOnlyChart: showOnlyChart,
        size: microChartSize ?? "XS",
        hideOnNoData: true,
        isAnalytics: enableAnalytics
      });
    } else if (isAnnotationOfType(dataField, "com.sap.vocabularies.UI.v1.DataField") && isMultiValueField(enhanceDataModelPath(dataFieldOP, dataField.Value.path))) {
      // when evaluating "@$ui5.context.isInactive" we are forced to add isTruthy to force the binding evaluation
      const isReadOnly = compileExpression(ifElse(or(isTableReadOnly === true, and(isTruthy(UI.IsInactive), creationMode.name === "InlineCreationRows")), constant(true), ifElse(equal(fieldMode, "nowrapper"), constant(true), constant(undefined))));
      template = _jsx(MultiValueFieldBlock, {
        contextPath: collection.getPath(),
        metaPath: dataFieldContext.getPath(),
        readOnly: isReadOnly,
        vhIdPrefix: generate([tableId, "TableValueHelp"]),
        useParentBindingCache: true
      });
    } else if (isAnnotationOfType(dataField, "com.sap.vocabularies.UI.v1.DataFieldForAnnotation") && isAnnotationOfTerm(dataField.Target.$target, "com.sap.vocabularies.UI.v1.FieldGroup")) {
      const fieldGroup = dataField.Target.$target;
      const dataFieldCollectionContext = dataFieldContext.getModel().createBindingContext(dataFieldContext.getPath() + "/Target/$AnnotationPath/Data");
      const fieldGroupColectionLength = fieldGroup.Data.length - 1;
      const items = fieldGroup.Data.map((fieldGroupDataField, fieldGroupDataFieldIdx) => {
        const fieldGroupDataFieldContext = dataFieldCollectionContext.getModel().createBindingContext(dataFieldCollectionContext.getPath() + "/" + fieldGroupDataFieldIdx);
        const fieldGroupDataFieldOP = getInvolvedDataModelObjects(fieldGroupDataFieldContext);
        const fieldGroupLabel = FieldHelper.computeLabelText(fieldGroupDataFieldContext.getObject(), {
          context: fieldGroupDataFieldContext
        });
        if (column.showDataFieldsLabel && !!fieldGroupLabel) {
          const resourceBundle = Library.getResourceBundleFor("sap.fe.macros");
          return _jsxs(HBox, {
            visible: getVisibleExpression(fieldGroupDataFieldOP),
            alignItems: FieldHelper.buildExpressionForAlignItems(fieldGroupDataFieldContext.getObject("Target/$AnnotationPath/Visualization/$EnumMember")),
            children: [_jsx(Label, {
              id: TableHelper.getFieldGroupLabelStableId(tableId, fieldGroupDataFieldOP),
              text: resourceBundle.getText("HEADER_FORM_LABEL", [fieldGroupLabel]),
              class: "sapUiTinyMarginEnd",
              visible: getVisibleExpression(fieldGroupDataFieldOP)
            }), _jsx(VBox, {
              children: {
                layoutData: _jsx(FlexItemData, {
                  growFactor: "1"
                }),
                items: getMacroFieldTemplate(tableId, tableDefinition, column, fieldGroupDataFieldContext, collection, enableAnalytics, tableType, isTableReadOnly, creationMode, undefined, onChangeFunction, isCompactType, "Left", `${TableHelper.getColumnStableId(tableId, dataFieldOP)} ${TableHelper.getFieldGroupLabelStableId(tableId, fieldGroupDataFieldOP)}`, true, TableHelper.getMarginClass(fieldGroupDataFieldContext.getObject("Target/$AnnotationPath/Visualization/$EnumMember"), fieldGroupDataFieldIdx === fieldGroupColectionLength))
              }
            })]
          });
        } else {
          return getMacroFieldTemplate(tableId, tableDefinition, column, fieldGroupDataFieldContext, collection, enableAnalytics, tableType, isTableReadOnly, creationMode, fieldMode, onChangeFunction, isCompactType, undefined, TableHelper.getColumnStableId(tableId, dataFieldOP), undefined, TableHelper.getMarginClass(fieldGroupDataFieldContext.getObject("Target/$AnnotationPath/Visualization/$EnumMember"), fieldGroupDataFieldIdx === fieldGroupColectionLength));
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
      template = _jsx(VBox, {
        visible: TableHelper.getVBoxVisibility(dataFieldCollectionContext.getObject(), column.FieldGroupHiddenExpressions, dataFieldContext.getObject()),
        children: {
          items: items
        }
      });
    } else {
      template = getMacroFieldTemplate(tableId, tableDefinition, column, dataFieldContext, collection, enableAnalytics, tableType, isTableReadOnly, creationMode, fieldMode, onChangeFunction, isCompactType, undefined, undefined, false, undefined);
      creationTemplate = getCreationTemplate(tableId, column, tableType, creationMode, isTableReadOnly, collection, dataFieldContext, fieldMode, enableAnalytics, customValidationFunction);
    }
    return {
      template,
      creationTemplate
    };
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
  function getColumnTemplate(tableId, tableDefinition, column, collection, isReadOnly, enableAutoColumnWidth, widthIncludingColumnHeader, enableAnalytics, tableType, creationMode, fieldMode, onChangeFunction, isCompactType, customValidationFunction) {
    let dataFieldContext = collection.getModel().createBindingContext(column.annotationPath);
    if (!dataFieldContext) {
      return undefined;
    }
    dataFieldContext = collection.getModel().createBindingContext(FieldHelper.getDataFieldDefault(dataFieldContext));
    const dataFieldObjectModelPath = getInvolvedDataModelObjects(dataFieldContext, collection);
    const dataFieldObject = dataFieldContext?.getObject?.() ?? {};
    const templates = getColumnContentTemplate(tableId, tableDefinition, column, dataFieldObjectModelPath, dataFieldContext, collection, enableAnalytics, tableType, isReadOnly, creationMode, fieldMode, onChangeFunction, isCompactType, customValidationFunction);
    return _jsx(Column, {
      id: TableHelper.getColumnStableId(tableId, dataFieldObjectModelPath),
      width: !CommonUtils.isSmallDevice() || column.width ? TableHelper.getColumnWidth({
        enableAutoColumnWidth,
        widthIncludingColumnHeader,
        tableType
      }, column, dataFieldObject, TableHelper.getTextOnActionField(dataFieldObject, {
        context: dataFieldContext
      }), dataFieldObjectModelPath, true, {
        title: dataFieldContext.getObject("Target/$AnnotationPath/Title") || "",
        description: dataFieldContext.getObject("Target/$AnnotationPath/Title") || ""
      }) : undefined,
      minWidth: CommonUtils.isSmallDevice() ? TableHelper.getColumnWidth({
        enableAutoColumnWidth,
        widthIncludingColumnHeader,
        tableType
      }, column, dataFieldObject, TableHelper.getTextOnActionField(dataFieldObject, {
        context: dataFieldContext
      }), dataFieldObjectModelPath, false, {
        title: dataFieldContext.getObject("Target/$AnnotationPath/Title") || "",
        description: dataFieldContext.getObject("Target/$AnnotationPath/Description") || ""
      }) : undefined,
      header: column.label || column.name,
      propertyKey: column.name,
      hAlign: column.horizontalAlign || FieldHelper.getColumnAlignment(dataFieldObject, {
        collection: collection
      }),
      headerVisible: TableHelper.setHeaderLabelVisibility(dataFieldObject, dataFieldContext.getObject("Target/$AnnotationPath/Data")),
      tooltip: column.tooltip,
      required: isReadOnly ? undefined : column.required,
      children: {
        customData: createCustomData("showDataFieldsLabel", column.showDataFieldsLabel),
        extendedSettings: _jsx(ResponsiveColumnSettings, {
          importance: column.importance
        }),
        template: templates.template,
        creationTemplate: templates.creationTemplate
      }
    });
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
  _exports.getColumnTemplate = getColumnTemplate;
  function getColumns(tableId, tableDefinition, columns, collection, isReadOnly, enableAutoColumnWidth, widthIncludingColumnHeader, enableAnalytics, tableType, creationMode, fieldMode, onChangeFunction, isCompactType, customValidationFunction) {
    return columns.map(column => {
      if (column.availability === "Default" && column.type === "Default") {
        return getCustomColumnTemplate(tableId, column, collection);
      } else if (column.availability === "Default" && column.type === "Annotation") {
        return getColumnTemplate(tableId, tableDefinition, column, collection, isReadOnly, enableAutoColumnWidth, widthIncludingColumnHeader, enableAnalytics, tableType, creationMode, fieldMode, onChangeFunction, isCompactType, customValidationFunction);
      } else if (column.availability === "Default" && column.type === "Slot") {
        return getSlotColumn(tableId, column, isReadOnly);
      } else if (column.availability === "Default" && column.type === "Computed") {
        return getComputedColumn(tableId, column, collection, enableAnalytics);
      }
      return undefined;
    }).filter(column => column !== undefined);
  }
  /**
   * Determines the designtime for the MDC table.
   * @returns The value to be assigned to dt:designtime
   */
  function getDesigntime() {
    return "sap/fe/macros/table/designtime/Table.designtime";
  }

  /**
   * Maps an internal P13n talbr mode (string) to the MDC enum.
   * @param stringMode
   * @returns The MDC enum value
   */
  function getMDCP13nMode(stringMode) {
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
  function getMDCTableTemplate(tableProperties, convertedMetadata, odataMetaModel, handlerProvider, appComponent) {
    tableProperties.convertedMetadata = convertedMetadata;
    // For a TreeTable in a ListReport displaying a draft-enabled entity, we only display active instances
    const contextObjectPath = getInvolvedDataModelObjects(tableProperties.metaPath, tableProperties.contextPath);
    const navigationInfo = tableProperties.tableDefinition.annotation?.row?.navigationInfo;
    const target = navigationInfo?.routePath;
    let navigationInEditMode = false;
    if (target) {
      const targetInformation = appComponent.getRoutingService()._getTargetInformation(target);
      navigationInEditMode = targetInformation?.options?.settings?.openInEditMode ?? false;
    }
    tableProperties.contextObjectPath = contextObjectPath;
    const tableType = tableProperties.tableDefinition.control.type;
    const filterOnActiveEntities = (tableType === "TreeTable" || tableProperties.tableDefinition.enableAnalytics === true) && contextObjectPath.startingEntitySet === contextObjectPath.targetEntitySet && ModelHelper.isObjectPathDraftSupported(contextObjectPath);
    const delegate = TableHelper.getDelegate(tableProperties.tableDefinition, tableProperties.isAlp === true, tableProperties.tableDefinition.annotation.entityName, filterOnActiveEntities);
    const headerVisible = tableProperties.headerVisible ?? tableProperties.tableDefinition.control.headerVisible;
    const currentHeader = tableProperties.header ?? tableProperties.tableDefinition.annotation.title;
    const headerBindingExpression = buildExpressionForHeaderVisible(currentHeader ?? "", tableProperties.tabTitle ?? "", !!headerVisible);
    const pasteAction = tableProperties.tableDefinition.actions.find(a => a.key === StandardActionKeys.Paste);
    const collectionEntity = convertedMetadata.resolvePath(tableProperties.tableDefinition.annotation.collection).target;
    const modelContextChange = tableType === "TreeTable" ? handlerProvider.tableContextChange : undefined;
    const lineItem = TableHelper.getUiLineItemObject(tableProperties.metaPath, convertedMetadata);
    const navigationPath = tableProperties.tableDefinition.annotation.navigationPath;
    if (tableProperties.tableDefinition.annotation.collection.startsWith("/") && isSingleton(contextObjectPath.startingEntitySet)) {
      tableProperties.tableDefinition.annotation.collection = navigationPath;
    }
    const collectionContext = odataMetaModel.createBindingContext(tableProperties.tableDefinition.annotation.collection);
    const draft = collectionEntity.annotations.Common?.DraftRoot;
    // Add the definition of the designtime file if designtime is enabled from core or locally via url parameters
    const variantManagement = tableProperties.isPublic ? tableProperties.variantManagement ?? "None" : tableProperties.tableDefinition.annotation.variantManagement;
    const designtime = getDesigntime();
    let rowAction;
    if (tableProperties.rowPressHandlerPath) {
      rowAction = "Navigation";
    }
    rowAction ??= tableProperties.tableDefinition.annotation.row?.action;
    const showCreate = tableProperties.tableDefinition.actions.find(a => a.key === StandardActionKeys.Create)?.visible || true;
    const disableCopyToClipboard = tableProperties.tableDefinition.control.disableCopyToClipboard;
    /**
     * Specifies whether the button is hidden when no data has been entered yet in the row (true/false). The default setting is `false`.
     */
    const disableAddRowButtonForEmptyData = tableProperties.tableDefinition.control.disableAddRowButtonForEmptyData;
    const updatablePropertyPath = tableProperties.tableDefinition.annotation.updatablePropertyPath;
    let currentPersonalization;
    switch (tableProperties.personalization) {
      case "false":
        currentPersonalization = undefined;
        break;
      case "true":
        currentPersonalization = [TableP13nMode.Sort, TableP13nMode.Column, TableP13nMode.Filter];
        break;
      case undefined:
        currentPersonalization = tableProperties.tableDefinition.annotation.p13nMode?.map(mode => getMDCP13nMode(mode));
        break;
      default:
        currentPersonalization = tableProperties.personalization.split(",").map(mode => getMDCP13nMode(mode.trim()));
    }
    const multiSelectDisabledActions = ActionHelper.getMultiSelectDisabledActions(lineItem);
    const customData = [{
      key: "kind",
      value: collectionEntity._type
    }, {
      key: "navigationPath",
      value: navigationPath
    }, {
      key: "enableAnalytics",
      value: tableProperties.tableDefinition.enableAnalytics
    }, {
      key: "creationMode",
      value: tableProperties.creationMode.name
    }, {
      key: "inlineCreationRowCount",
      value: tableProperties.tableDefinition.control.inlineCreationRowCount
    }, {
      key: "showCreate",
      value: showCreate
    }, {
      key: "createAtEnd",
      value: tableProperties.creationMode.createAtEnd
    }, {
      key: "displayModePropertyBinding",
      value: tableProperties.readOnly
    }, {
      key: "tableType",
      value: tableType
    }, {
      key: "targetCollectionPath",
      value: collectionContext.getPath()
    }, {
      key: "entityType",
      value: collectionContext.getPath() + "/"
    }, {
      key: "metaPath",
      value: collectionContext.getPath()
    }, {
      key: "onChange",
      value: ""
    }, {
      key: "hiddenFilters",
      value: tableProperties.tableDefinition.control.filters?.hiddenFilters
    }, {
      key: "requestGroupId",
      value: "$auto.Workers"
    }, {
      key: "segmentedButtonId",
      value: generate([tableProperties.id, "SegmentedButton", "TemplateContentView"])
    }, {
      key: "enablePaste",
      value: tableType === "TreeTable" ? false : pasteAction?.enabled
    }, {
      key: "disableCopyToClipboard",
      value: disableCopyToClipboard
    }, {
      key: "operationAvailableMap",
      value: CommonHelper.stringifyCustomData(tableProperties.tableDefinition.operationAvailableMap)
    }, {
      key: "draft",
      value: draft
    }, {
      key: "navigationAvailableMap",
      value: TableHelper.getNavigationAvailableMap(lineItem)
    }, {
      key: "actionsMultiselectDisabled",
      value: multiSelectDisabledActions.length > 0 ? multiSelectDisabledActions.join(",") : undefined
    }, {
      key: "updatablePropertyPath",
      value: updatablePropertyPath || ""
    }, {
      key: "exportRequestSize",
      value: tableProperties.tableDefinition.control.exportRequestSize
    }];
    return _jsx(MDCTable, {
      "core:require": getCoreRequire(tableProperties.tableDefinition),
      "fl:flexibility": tableProperties["fl:flexibility"],
      sortConditions: tableProperties.tableDefinition.annotation.sortConditions,
      groupConditions: tableProperties.tableDefinition.annotation.groupConditions,
      aggregateConditions: tableProperties.tableDefinition.annotation.aggregateConditions,
      "dt:designtime": designtime,
      id: tableProperties.id,
      busy: tableProperties.busy,
      busyIndicatorDelay: 0,
      enableExport: tableProperties.tableDefinition.control.enableExport,
      delegate: delegate,
      rowPress: tableType === "ResponsiveTable" ? handlerProvider.rowPress : undefined,
      beforeOpenContextMenu: handlerProvider.beforeOpenContextMenu,
      autoBindOnInit: tableProperties.useBasicSearch || !tableProperties.filterBar,
      selectionMode: tableProperties.tableDefinition.annotation.selectionMode || "None",
      selectionChange: handlerProvider.selectionChange,
      showRowCount: tableProperties.tableDefinition.control.showRowCount,
      header: currentHeader,
      headerVisible: headerBindingExpression,
      headerLevel: tableProperties.headerLevel,
      headerStyle: tableProperties.headerStyle,
      threshold: tableProperties.tableDefinition.annotation.threshold,
      p13nMode: currentPersonalization,
      paste: handlerProvider.getPasteHandler(false),
      beforeExport: handlerProvider.beforeExport,
      class: tableProperties.tableDefinition.control.useCondensedTableLayout === true ? "sapUiSizeCondensed" : undefined,
      multiSelectMode: tableProperties.tableDefinition.control.multiSelectMode,
      showPasteButton: tableType === "TreeTable" ? false : pasteAction?.visible,
      enablePaste: tableType === "TreeTable" ? false : pasteAction?.enabled,
      visible: tableProperties.visible,
      modelContextChange: modelContextChange,
      children: {
        customData: createCustomDatas(customData),
        dataStateIndicator: getDataStateIndicator(handlerProvider),
        type: getTableType(tableProperties.tableDefinition, collectionContext, tableType, tableProperties.tableDefinition.control.selectionLimit),
        dependents: getDependents(tableProperties.id, tableProperties.tableDefinition, tableType, tableProperties.readOnly, contextObjectPath, variantManagement, handlerProvider, tableProperties.metaPath, collectionContext),
        actions: getActions(tableProperties, handlerProvider, collectionContext, collectionEntity),
        rowSettings: getRowSettings(tableProperties.tableDefinition, rowAction, tableType, handlerProvider),
        contextMenu: getContextMenu(tableProperties, tableType, tableProperties.tableDefinition, collectionEntity, rowAction, handlerProvider, contextObjectPath, tableProperties.metaPath, collectionContext, navigationInEditMode),
        columns: getColumns(tableProperties.id, tableProperties.tableDefinition, tableProperties.tableDefinition.columns, collectionContext, tableProperties.readOnly, tableProperties.enableAutoColumnWidth, tableProperties.tableDefinition.control.widthIncludingColumnHeader, tableProperties.tableDefinition.enableAnalytics, tableType, tableProperties.creationMode, tableProperties.fieldMode, undefined, tableProperties.tableDefinition.control.isCompactType, tableProperties.tableDefinition.control.customValidationFunction),
        dragDropConfig: getDragAndDropConfig(tableType, contextObjectPath, tableProperties.tableDefinition, handlerProvider),
        creationRow: getCreationRow(tableProperties.creationMode, tableProperties.tableDefinition, tableProperties.id, disableAddRowButtonForEmptyData, handlerProvider, tableProperties.tableDefinition.control.customValidationFunction),
        variant: getVariantManagement(variantManagement, tableProperties.id, tableProperties.headerLevel, handlerProvider),
        quickFilter: getQuickFilter(tableProperties.tableDefinition, tableProperties.id, handlerProvider, tableProperties.metaPath.getPath()),
        copyProvider: getCopyProvider(tableType, contextObjectPath, disableCopyToClipboard),
        cellSelector: getCellSelector(tableType, tableProperties.tableDefinition, contextObjectPath, disableCopyToClipboard)
      }
    });
  }
  _exports.getMDCTableTemplate = getMDCTableTemplate;
  return _exports;
}, false);
//# sourceMappingURL=MdcTableTemplate-dbg.js.map
