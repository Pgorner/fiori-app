/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/base/BindingToolkit", "sap/fe/core/helpers/FPMHelper", "sap/fe/macros/field/FieldTemplating", "../CommonHelper", "./TableHelper", "./TableRuntime"], function (Log, BindingToolkit, FPMHelper, FieldTemplating, CommonHelper, TableHelper, TableRuntime) {
  "use strict";

  var _exports = {};
  var formatValueRecursively = FieldTemplating.formatValueRecursively;
  var isPathInModelExpression = BindingToolkit.isPathInModelExpression;
  var isConstant = BindingToolkit.isConstant;
  var getExpressionFromAnnotation = BindingToolkit.getExpressionFromAnnotation;
  var compileExpression = BindingToolkit.compileExpression;
  // maximum number of items to open in new tabs simultanously
  const selectionLimitForOpenInNewTab = 10;
  let TableEventHandlerProvider = /*#__PURE__*/function () {
    function TableEventHandlerProvider(tableBlockProperties, collectionEntity, tableAPI) {
      this.tableBlockProperties = tableBlockProperties;
      this.collectionEntity = collectionEntity;
      this.tableAPI = tableAPI;
      this.metaModel = tableBlockProperties.metaPath?.getModel();
      if (tableAPI) {
        this.constructorWithFunctions(tableAPI);
      } else {
        this.constructorWithStrings();
      }
    }

    /**
     * Initializes the event handler properties with string values.
     */
    _exports = TableEventHandlerProvider;
    var _proto = TableEventHandlerProvider.prototype;
    _proto.constructorWithStrings = function constructorWithStrings() {
      const tableType = this.tableBlockProperties.tableDefinition?.control?.type;
      this.addCardToInsightsPress = "API.onAddCardToInsightsPressed($event, $controller)";
      this.beforeExport = "API.onBeforeExport($event)";
      this.beforeOpenContextMenu = "API.onContextMenuPress($event)";
      this.collapseNode = tableType === "TreeTable" ? "API.onCollapseExpandNode($event, false)" : undefined;
      this.contextMenuItemSelected = "TableRuntime.onContextMenuItemSelected";
      const rowNavigationInfo = this.tableBlockProperties.tableDefinition?.annotation.row?.navigationInfo;
      if (rowNavigationInfo !== undefined) {
        if (rowNavigationInfo.type === "Outbound") {
          this.contextMenuOpenInNewTab = `.onOpenInNewTabNavigateOutBound('${rowNavigationInfo.navigationTarget}', %{internal>contextmenu/selectedContexts}, "", ${selectionLimitForOpenInNewTab})`;
        } else {
          this.contextMenuOpenInNewTab = `API.onOpenInNewTabPress($event, $controller, %{internal>contextmenu/selectedContexts}, { callExtension: true, targetPath: '${rowNavigationInfo.targetPath}', navMode: 'openInNewTab' }, ${selectionLimitForOpenInNewTab})`;
        }
      }
      this.dataStateChange = "API.onDataStateChange";
      if (this.tableBlockProperties.tableDefinition?.control?.hasDataStateIndicatorFilter) {
        this.dataStateIndicatorFilter = "TableRuntime.dataStateIndicatorFilter";
      }
      this.displayTableSettings = "TableRuntime.displayTableSettings";
      this.dragStartDocument = tableType === "TreeTable" ? "API.onDragStartDocument" : undefined;
      this.dragEnterDocument = tableType === "TreeTable" ? "API.onDragEnterDocument" : undefined;
      this.dropDocument = tableType === "TreeTable" ? "API.onDropDocument" : undefined;
      this.expandNode = tableType === "TreeTable" ? "API.onCollapseExpandNode($event, true)" : undefined;
      this.quickFilterSelectionChange = "API.onQuickFilterSelectionChange";
      if (this.tableBlockProperties.rowPressHandlerPath) {
        this.rowPress = this.tableBlockProperties.rowPressHandlerPath;
      } else if (rowNavigationInfo !== undefined) {
        if (rowNavigationInfo.type === "Outbound") {
          this.rowPress = `API.onChevronPressNavigateOutBound($event, $controller ,'${rowNavigationInfo.navigationTarget}', \${$parameters>bindingContext})`;
        } else {
          const editable = rowNavigationInfo.checkEditable ? "!${$parameters>bindingContext}.getProperty('IsActiveEntity')" : "undefined";
          const recreateContext = rowNavigationInfo.recreateContext ? ", recreateContext: true" : "";
          this.rowPress = `API.onTableRowPress($event, $controller, \${$parameters>bindingContext}, { callExtension: true, targetPath: '${rowNavigationInfo.targetPath}', editable: ${editable} ${recreateContext} })`;
        }
      }
      this.segmentedButtonPress = this.tableBlockProperties.onSegmentedButtonPressedHandlerPath;
      this.selectionChange = "TableRuntime.setContexts";
      this.tableContextChange = tableType === "TreeTable" ? `TableRuntime.onTreeTableContextChanged($event, ${this.tableBlockProperties.tableDefinition?.annotation?.initialExpansionLevel})` : undefined;
      this.variantSaved = this.tableBlockProperties.variantSavedHandlerPath;
      this.variantSelected = this.tableBlockProperties.variantSelectedHandlerPath;
    }

    /**
     * Initializes the event handler properties with functions.
     * @param tableAPI
     */;
    _proto.constructorWithFunctions = function constructorWithFunctions(tableAPI) {
      const tableType = this.tableBlockProperties.tableDefinition?.control?.type;
      this.addCardToInsightsPress = tableAPI.onAddCardToInsightsPressed.bind(tableAPI);
      this.beforeExport = tableAPI.onBeforeExport.bind(tableAPI);
      this.beforeOpenContextMenu = tableAPI.onContextMenuPress.bind(tableAPI);
      this.collapseNode = tableType === "TreeTable" ? e => {
        tableAPI.onCollapseExpandNode(e, false);
      } : undefined;
      this.contextMenuItemSelected = TableRuntime.onContextMenuItemSelected.bind(TableRuntime);
      const rowNavigationInfo = this.tableBlockProperties.tableDefinition?.annotation.row?.navigationInfo;
      if (rowNavigationInfo !== undefined) {
        if (rowNavigationInfo.type === "Outbound") {
          this.contextMenuOpenInNewTab = _e => {
            const controller = tableAPI.getPageController();
            const internalContext = tableAPI.getBindingContext("internal");
            controller?.onOpenInNewTabNavigateOutBound?.(rowNavigationInfo.navigationTarget, internalContext?.getProperty("contextmenu/selectedContexts"), "", selectionLimitForOpenInNewTab);
          };
        } else {
          this.contextMenuOpenInNewTab = e => {
            const controller = tableAPI.getPageController();
            const internalContext = tableAPI.getBindingContext("internal");
            tableAPI.onOpenInNewTabPress(e, controller, internalContext?.getProperty("contextmenu/selectedContexts"), {
              callExtension: true,
              targetPath: rowNavigationInfo.targetPath,
              navMode: "openInNewTab"
            }, selectionLimitForOpenInNewTab);
          };
        }
      }
      this.dataStateChange = tableAPI.onDataStateChange.bind(tableAPI);
      if (this.tableBlockProperties.tableDefinition?.control?.hasDataStateIndicatorFilter) {
        this.dataStateIndicatorFilter = tableAPI.dataStateIndicatorFilter.bind(tableAPI);
      }
      this.displayTableSettings = TableRuntime.displayTableSettings.bind(TableRuntime);
      this.dragStartDocument = tableType === "TreeTable" ? tableAPI.onDragStartDocument.bind(tableAPI) : undefined;
      this.dragEnterDocument = tableType === "TreeTable" ? tableAPI.onDragEnterDocument.bind(tableAPI) : undefined;
      this.dropDocument = tableType === "TreeTable" ? tableAPI.onDropDocument.bind(tableAPI) : undefined;
      this.expandNode = tableType === "TreeTable" ? e => {
        tableAPI.onCollapseExpandNode(e, true);
      } : undefined;
      this.quickFilterSelectionChange = tableAPI.onQuickFilterSelectionChange.bind(tableAPI);
      if (tableAPI.rowPress) {
        this.rowPress = tableAPI.rowPress;
      } else if (rowNavigationInfo !== undefined) {
        if (rowNavigationInfo.type === "Outbound") {
          this.rowPress = e => {
            const controller = tableAPI.getPageController();
            const event = e;
            tableAPI.onChevronPressNavigateOutBound(e, controller, rowNavigationInfo.navigationTarget, event.getParameter("bindingContext"));
          };
        } else {
          this.rowPress = e => {
            const event = e;
            const editable = rowNavigationInfo.checkEditable ? !event.getParameter("bindingContext").getProperty("IsActiveEntity") : undefined;
            const parameters = {
              callExtension: true,
              targetPath: rowNavigationInfo.targetPath,
              editable,
              recreateContext: rowNavigationInfo.recreateContext
            };
            const controller = tableAPI.getPageController();
            tableAPI.onTableRowPress(e, controller, event.getParameter("bindingContext"), parameters);
          };
        }
      }
      this.segmentedButtonPress = tableAPI.segmentedButtonPress;
      this.selectionChange = TableRuntime.setContexts.bind(TableRuntime);
      this.tableContextChange = tableType === "TreeTable" ? e => {
        TableRuntime.onTreeTableContextChanged(e, this.tableBlockProperties.tableDefinition?.annotation?.initialExpansionLevel);
      } : undefined;
      this.variantSaved = tableAPI.variantSaved;
      this.variantSelected = tableAPI.variantSelected;
    }

    /**
     * Gets the press event handler for the Create button.
     * @param forContextMenu
     * @param forCreationRow
     * @returns The event handler.
     */;
    _proto.getCreateButtonPressHandler = function getCreateButtonPressHandler(forContextMenu, forCreationRow) {
      if (this.tableAPI) {
        return forCreationRow ? TableRuntime.onCreateButtonPress.bind(TableRuntime) : e => {
          const internalContext = this.tableAPI.getBindingContext("internal");
          const path = forContextMenu ? "contextmenu/selectedContexts" : "selectedContexts";
          TableRuntime.onCreateButtonPress(e, internalContext?.getProperty(path));
        };
      } else if (!forCreationRow) {
        return forContextMenu ? "TableRuntime.onCreateButtonPress($event, ${internal>contextmenu/selectedContexts})" : "TableRuntime.onCreateButtonPress($event, ${internal>selectedContexts})";
      } else {
        return "TableRuntime.onCreateButtonPress($event)";
      }
    }

    /**
     * Gets the press event handler for the Create menu item.
     * @param index
     * @param forContextMenu
     * @returns The event handler.
     */;
    _proto.getCreateMenuItemPressHandler = function getCreateMenuItemPressHandler(index, forContextMenu) {
      const path = forContextMenu ? "contextmenu/selectedContexts" : "selectedContexts";
      if (this.tableAPI) {
        return e => {
          TableRuntime.onCreateMenuItemPress(e, index, this.tableAPI.getBindingContext("internal")?.getProperty(path));
        };
      } else {
        return `TableRuntime.onCreateMenuItemPress($event, ${index}, \${internal>${path}})`;
      }
    }

    /**
     * Gets the event handler for the Cut action.
     * @param forContextMenu
     * @returns The event handler.
     */;
    _proto.getCutHandler = function getCutHandler(forContextMenu) {
      if (this.tableAPI) {
        return e => {
          this.tableAPI.onCut(e, forContextMenu);
        };
      } else {
        return `API.onCut($event, ${forContextMenu})`;
      }
    }

    /**
     * Gets the press event handler for an action button.
     * @param dataField
     * @param action
     * @param parentAction
     * @param forContextMenu
     * @returns The event handler.
     */;
    _proto.getDataFieldForActionButtonPressHandler = function getDataFieldForActionButtonPressHandler(dataField, action, parentAction, forContextMenu) {
      if (!dataField) {
        return undefined;
      }
      const actionContextPath = action.annotationPath ? CommonHelper.getActionContext(this.metaModel.createBindingContext(action.annotationPath + "/Action")) : undefined;
      const actionContext = actionContextPath ? this.metaModel.createBindingContext(actionContextPath) : undefined;
      if (this.tableAPI) {
        const actionName = dataField.Action;
        const targetEntityTypeName = this.tableBlockProperties.contextObjectPath.targetEntityType.fullyQualifiedName;
        const isStaticAction = typeof actionContext?.getObject() !== "string" && (TableHelper._isStaticAction(actionContext?.getObject(), actionName) || TableHelper._isActionOverloadOnDifferentType(actionName.toString(), targetEntityTypeName));
        const applicablePropertyPath = !forContextMenu ? "aApplicable" : "aApplicableForContextMenu";
        const notApplicablePropertyPath = !forContextMenu ? "aNotApplicable" : "aNotApplicableForContextMenu";
        const contextMenuPath = !forContextMenu ? "" : "contextmenu/";
        return e => {
          const internalContext = this.tableAPI.getBindingContext("internal");
          const params = {
            contexts: !isStaticAction ? internalContext.getProperty(`${contextMenuPath}selectedContexts`) : null,
            bStaticAction: isStaticAction ? isStaticAction : undefined,
            entitySetName: this.collectionEntity.name,
            applicableContexts: !isStaticAction ? internalContext.getProperty(`dynamicActions/${dataField.Action}/${applicablePropertyPath}/`) : null,
            notApplicableContexts: !isStaticAction ? internalContext.getProperty(`dynamicActions/${dataField.Action}/${notApplicablePropertyPath}/`) : null,
            isNavigable: (parentAction ?? action).isNavigable,
            enableAutoScroll: action.enableAutoScroll,
            defaultValuesExtensionFunction: action.defaultValuesExtensionFunction,
            invocationGrouping: dataField?.InvocationGrouping === "UI.OperationGroupingType/ChangeSet" ? "ChangeSet" : "Isolated",
            controlId: this.tableBlockProperties.id,
            operationAvailableMap: this.tableBlockProperties.tableDefinition.operationAvailableMap,
            label: dataField.Label?.valueOf() ?? "",
            model: this.tableAPI.getPageController().getModel()
          };
          this.tableAPI?.onActionPress(e, this.tableAPI.getPageController(), dataField.Action.valueOf(), params);
        };
      } else {
        return TableHelper.pressEventDataFieldForActionButton({
          contextObjectPath: this.tableBlockProperties.contextObjectPath,
          id: this.tableBlockProperties.id
        }, dataField, this.collectionEntity.name, this.tableBlockProperties.tableDefinition.operationAvailableMap, actionContext?.getObject(), (parentAction ?? action).isNavigable, action.enableAutoScroll, action.defaultValuesExtensionFunction, forContextMenu);
      }
    }

    /**
     * Gets the press event handler for an IBN action.
     * @param action
     * @param forContextMenu
     * @returns The event handler.
     */;
    _proto.getDataFieldForIBNPressHandler = function getDataFieldForIBNPressHandler(action, forContextMenu) {
      if (action.annotationPath === undefined) {
        return undefined;
      }
      const dataFieldContext = this.metaModel.createBindingContext(action.annotationPath);
      const dataField = dataFieldContext?.getObject();
      if (!dataField) {
        return undefined;
      }
      const navigateWithConfirmationDialog = this.tableBlockProperties.tableDefinition.enableAnalytics !== true;
      if (this.tableAPI) {
        return e => {
          const internalContext = this.tableAPI.getBindingContext("internal");
          const navigationParameters = {};
          navigationParameters.navigationContexts = forContextMenu ? internalContext.getProperty("contextmenu/selectedContexts") : internalContext.getProperty("selectedContexts");
          if (dataField.RequiresContext && !dataField.Inline && navigateWithConfirmationDialog) {
            const applicableProperty = !forContextMenu ? "aApplicable" : "aApplicableForContextMenu";
            const notApplicableProperty = !forContextMenu ? "aNotApplicable" : "aNotApplicableForContextMenu";
            navigationParameters.applicableContexts = internalContext.getProperty(`ibn/${dataField.SemanticObject}-${dataField.Action}/${applicableProperty}/`);
            navigationParameters.notApplicableContexts = internalContext.getProperty(`ibn/${dataField.SemanticObject}-${dataField.Action}/${notApplicableProperty}/`);
            navigationParameters.label = dataField.Label;
          }
          navigationParameters.semanticObjectMapping = dataField.Mapping;
          const controller = this.tableAPI.getPageController();
          if (navigateWithConfirmationDialog) {
            controller?._intentBasedNavigation.navigateWithConfirmationDialog(dataField.SemanticObject, dataField.Action, navigationParameters, e.getSource());
          } else {
            controller?._intentBasedNavigation.navigate(dataField.SemanticObject, dataField.Action, navigationParameters, e.getSource());
          }
        };
      } else {
        return CommonHelper.getPressHandlerForDataFieldForIBN(dataField, forContextMenu ? "${internal>contextmenu/selectedContexts}" : "${internal>selectedContexts}", navigateWithConfirmationDialog, forContextMenu);
      }
    };
    _proto.getExpressionForDataFieldValue = function getExpressionForDataFieldValue(dataField, fullContextPath) {
      const value = dataField?.Value;
      if (!value) {
        return undefined;
      }
      if (typeof value === "string") {
        return this.tableAPI ? value : CommonHelper.addSingleQuotes(value, true);
      } else {
        const expression = getExpressionFromAnnotation(value);
        if (isConstant(expression) || isPathInModelExpression(expression)) {
          const valueExpression = formatValueRecursively(expression, fullContextPath);
          return compileExpression(valueExpression);
        }
      }
    }

    /**
     * Gets the press event handler for the Delete button.
     * @param forContextMenu
     * @returns The event handler.
     */;
    _proto.getDeleteButtonPressHandler = function getDeleteButtonPressHandler(forContextMenu) {
      const headerInfo = (this.collectionEntity?.entityType || this.collectionEntity?.targetType)?.annotations?.UI?.HeaderInfo;
      const contextMenuPath = !forContextMenu ? "" : "contextmenu/";
      const deletableContextsPath = `${contextMenuPath}deletableContexts`;
      const selectedContextsPath = `${contextMenuPath}selectedContextsIncludingInactive`;
      const numberOfSelectedContextsPath = !forContextMenu ? `numberOfSelectedContexts` : `${contextMenuPath}numberOfSelectedContextsForDelete`;
      const unSavedContextsPath = `${contextMenuPath}unSavedContexts`;
      const lockedContextsPath = `${contextMenuPath}lockedContexts`;
      const draftsWithDeletableActivePath = `${contextMenuPath}draftsWithDeletableActive`;
      const draftsWithNonDeletableActivePath = `${contextMenuPath}draftsWithNonDeletableActive`;
      const titleExpression = this.getExpressionForDataFieldValue(headerInfo?.Title, this.tableBlockProperties.contextObjectPath);
      const descriptionExpression = this.getExpressionForDataFieldValue(headerInfo?.Description, this.tableBlockProperties.contextObjectPath);
      if (this.tableAPI) {
        return _e => {
          const internalContext = this.tableAPI.getBindingContext("internal");
          const params = {
            id: this.tableBlockProperties.id,
            entitySetName: this.collectionEntity.name,
            numberOfSelectedContexts: internalContext?.getProperty(numberOfSelectedContextsPath),
            unSavedContexts: internalContext?.getProperty(unSavedContextsPath),
            lockedContexts: internalContext?.getProperty(lockedContextsPath),
            draftsWithDeletableActive: internalContext?.getProperty(draftsWithDeletableActivePath),
            draftsWithNonDeletableActive: internalContext?.getProperty(draftsWithNonDeletableActivePath),
            controlId: internalContext?.getProperty("controlId"),
            title: titleExpression,
            description: descriptionExpression,
            selectedContexts: internalContext?.getProperty(selectedContextsPath)
          };
          this.tableAPI.getPageController()?.editFlow.deleteMultipleDocuments(internalContext?.getProperty(deletableContextsPath), params);
        };
      } else {
        const params = {
          id: CommonHelper.addSingleQuotes(this.tableBlockProperties.id),
          entitySetName: CommonHelper.addSingleQuotes(this.collectionEntity.name),
          numberOfSelectedContexts: `\${internal>${numberOfSelectedContextsPath}}`,
          unSavedContexts: `\${internal>${unSavedContextsPath}}`,
          lockedContexts: `\${internal>${lockedContextsPath}}`,
          draftsWithDeletableActive: `\${internal>${draftsWithDeletableActivePath}}`,
          draftsWithNonDeletableActive: `\${internal>${draftsWithNonDeletableActivePath}}`,
          controlId: "${internal>controlId}",
          title: titleExpression,
          description: descriptionExpression,
          selectedContexts: `\${internal>${selectedContextsPath}}`
        };
        return CommonHelper.generateFunction(".editFlow.deleteMultipleDocuments", `\${internal>${deletableContextsPath}}`, CommonHelper.objectToString(params));
      }
    }

    /**
     * Get the press event handler for a manifest action button.
     * @param action
     * @param forContextMenu
     * @returns The event handler.
     */;
    _proto.getManifestActionPressHandler = function getManifestActionPressHandler(action, forContextMenu) {
      if (this.tableAPI) {
        if (action.noWrap === true) {
          // If noWrap = true, then the action is a slot action (defined in the XML view as an aggregation of the table block)
          // We don't support this yet, this requires some refactoring to have action.press as a function
          throw new Error("Slot actions are not supported yet in new mode");
        } else {
          return e => {
            const internalModelPath = forContextMenu ? "contextmenu/selectedContexts" : "selectedContexts";
            const internalContext = this.tableAPI.getBindingContext("internal");
            FPMHelper.actionWrapper(e, action.handlerModule, action.handlerMethod, {
              contexts: internalContext.getProperty(internalModelPath)
            }).catch(err => {
              Log.error("Error while executing custom action", err);
            });
          };
        }
      } else {
        return action.noWrap === true ? action.press : CommonHelper.buildActionWrapper(action, {
          id: this.tableBlockProperties.id
        }, forContextMenu);
      }
    }

    /**
     * Get the press event handler for the mass edit button.
     * @param forContextMenu
     * @returns The event handler.
     */;
    _proto.getMassEditButtonPressHandler = function getMassEditButtonPressHandler(forContextMenu) {
      if (this.tableAPI) {
        return e => {
          this.tableAPI.onMassEditButtonPressed(e, forContextMenu);
        };
      } else {
        return `API.onMassEditButtonPressed($event, ${forContextMenu})`;
      }
    }

    /**
     * Get the press event handler for the move up / move down buttons.
     * @param forMoveUp
     * @param forContextMenu
     * @returns The event handler.
     */;
    _proto.getMoveUpDownHandler = function getMoveUpDownHandler(forMoveUp, forContextMenu) {
      if (this.tableAPI) {
        return e => {
          this.tableAPI.onMoveUpDown(e, forMoveUp, forContextMenu);
        };
      } else {
        return `API.onMoveUpDown($event, ${forMoveUp}, ${forContextMenu})`;
      }
    }

    /**
     * Gets the event handler for the Paste action.
     * @param forContextMenu
     * @returns The event handler.
     */;
    _proto.getPasteHandler = function getPasteHandler(forContextMenu) {
      if (this.tableAPI) {
        const controller = this.tableAPI.getPageController();
        return e => {
          this.tableAPI.onPaste(e, controller, forContextMenu);
        };
      } else {
        return `API.onPaste($event, $controller, ${forContextMenu})`;
      }
    };
    return TableEventHandlerProvider;
  }();
  _exports = TableEventHandlerProvider;
  return _exports;
}, false);
//# sourceMappingURL=TableEventHandlerProvider-dbg.js.map
