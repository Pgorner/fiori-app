/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap, Promise*/

sap.ui.define("sap/sac/df/model/extensions/contextMenu/ContextMenuProvider", ["sap/ui/base/Object", "sap/base/Log", "sap/sac/df/firefly/library", "sap/sac/df/utils/ListHelper"], function (ObjectBase, Log, FF, ListHelper) {
  "use strict";
  const TABLE_UI_CONTEXT = "Gds.Qb.Table.ContextMenu";
  const facmp = ObjectBase.extend("sap.sac.df.model.extensions.contextMenu.ContextMenuProvider", {
    actionExecution: {},

    constructor: function (oMultiDimModel) {
      this._Model = oMultiDimModel;
      this.actions = {};

    }, /* eslint-disable-next-line no-unused-vars */
    isActionVisible: function (sActionId, context) {
      return true;
    }, /* eslint-disable-next-line no-unused-vars */
    isActionEnabled: function (sActionId, context) {
      return true;
    }, onActionTriggered: function (sActionId, context) {
      const actionDefinition = this.actions[sActionId] || facmp.actionExecution[sActionId];
      if (actionDefinition && (!actionDefinition.builtin || actionDefinition.Type === "Submenu")) {
        actionDefinition.triggerAction(sActionId, this.convertContextMenuContext(context));
      }
    },

    fireOnClickEvent: function () {
      //this._Control.fireOnCellClick({cellContext: this.convertCellClickContext(context)});
    },

    provideMenuConfig: function (context, providerListener, carrier) {
      facmp.actionExecution = {};
      const menuDefinition = FF.PrFactory.createStructure();
      const actionPromises = [];
      if (Object.keys(this.actions).length > 0 && context.getUiContext() === TABLE_UI_CONTEXT) {
        const extensions = menuDefinition.putNewList("MenuExtensions");
        const convertedContext = this.convertContextMenuContext(context);
        const newExtension = extensions.addNewStructure();
        newExtension.putNewList("UiContext").addString(TABLE_UI_CONTEXT);
        const extensionList = newExtension.putNewList("Extension");
        Object.keys(this.actions).forEach(sActionId => {
          const actionDefinition = this.actions[sActionId];

          const extensionDefinition = extensionList.addNewStructure();
          const extensionItems = extensionDefinition.putNewList("Items");
          const item = extensionItems.addNewStructure();

          function fillActionVisible(actionIdToCheck, entryItem) {
            return actionDefinition.isActionVisible(actionIdToCheck, convertedContext).then((actionVisible) => {
              entryItem.putBoolean("Visible", actionVisible);
            });
          }

          function fillActionEnabled(actionIdToCheck, entryItem) {
            return actionDefinition.isActionEnabled(actionIdToCheck, convertedContext).then((actionEnabled) => {
              entryItem.putBoolean("Enabled", actionEnabled);
            });
          }

          function convertActionDescription(actionIdToConvert, subMenuItem, isSubmenu) {
            return actionDefinition.getActionDescription(actionIdToConvert, convertedContext).then((actionDescription) => {
              if (actionDescription.InsertAfter) {
                if (isSubmenu) {
                  return Promise.reject(`Action ${actionIdToConvert} is nested. InsertAfter is not allowed `);
                }
                extensionDefinition.putString("Operation", "InsertAfter");
                extensionDefinition.putString("Reference", actionDescription.InsertAfter);

              } else if (actionDescription.InsertBefore) {
                if (isSubmenu) {
                  return Promise.reject(`Action ${actionIdToConvert} is nested. InsertBefore is not allowed `);
                }
                extensionDefinition.putString("Operation", "InsertBefore");
                extensionDefinition.putString("Reference", actionDescription.InsertBefore);
              } else if (!isSubmenu) {
                extensionDefinition.putString("Operation", "AppendInto");
                extensionDefinition.putString("Reference", "$Root");
              }
              if (!actionDescription.builtin) {
                subMenuItem.putString("Text", actionDescription.Text);
                if (actionDescription.Icon) {
                  subMenuItem.putString("Icon", actionDescription.Icon);
                }
              }
              if (actionDescription.Type === "Submenu") {
                subMenuItem.putString("Type", "Submenu");
                if (actionDescription.OverflowIfMoreThanNItems) {
                  subMenuItem.putString("OverflowIfMoreThanNItems", actionDescription.OverflowIfMoreThanNItems);
                }

                const nestedActions = actionDescription.NestedActions;
                const subMenuItems = subMenuItem.putNewList("Items");
                const nestedActionPromises = [];
                nestedActions.forEach(nestedActionId => {
                  const subMenuItem = subMenuItems.addNewStructure();
                  nestedActionPromises.push(convertActionDescription(nestedActionId, subMenuItem, true));
                  nestedActionPromises.push(fillActionEnabled(nestedActionId, subMenuItem));
                  nestedActionPromises.push(fillActionVisible(nestedActionId, subMenuItem));
                });
                return nestedActionPromises;
              } else {
                subMenuItem.putString("Action", actionIdToConvert);
                facmp.actionExecution[actionIdToConvert] = actionDefinition;
              }
            });
          }

          if (actionDefinition.getActionDescription) {
            actionPromises.push(convertActionDescription(sActionId, item, false));

          } else {
            item.putString("Action", sActionId);
            extensionDefinition.putString("Operation", "AppendInto");
            extensionDefinition.putString("Reference", "$Root");
          }
          if (!actionDefinition.builtin) {
            actionPromises.push(fillActionEnabled(sActionId, item));
            actionPromises.push(fillActionVisible(sActionId, item));
          }
        });
      }
      Promise.all(actionPromises).then(function () {
        if (Log.isLoggable()) {
          Log.debug(FF.PrUtils.serialize(menuDefinition));
        }
        providerListener.onDynamicMenuConfigProvided(context, "flexAnalysisProvider", menuDefinition, carrier);
      }).catch((e) => {
        Log.error("Failed to provide custom context menu", e, "ContextMenuProvider");
        providerListener.onDynamicMenuConfigProvided(context, "flexAnalysisProvider", FF.PrFactory.createStructure(), carrier);
      });
    },

    /**
         * Register a Context Menu extension
         *
         * The extension an object which fulfills following interface
         *
         * extensionDefinition = {
         *           // Returns a Promise which determines  if a given action will be visible in context Menu
         *           isActionVisible: (sActionKey, context): Promise<boolean> => {
         *             return Promise.resolve(checksActionKeyAndContext);
         *           },
         *           isActionEnabled: (sActionKey, context): Promise<boolean>{
         *
         *           },
         *           getActionDescription: (sActionKey, context): Promise<ActionDescription>{
         *            // Return an ActionDescription in following format
         *            {
         *              "Text": "Translatable Text to be used as Menu Entry Label",
         *              "Icon": "Icon to be shown as part of  Menu Entry Label",
         *              "InsertBefore|InsertAfter": "Id of already existing Context Menu Entry to place this Menu Entry before or after",
         *              // Following part is olny relevant for nested submenus
         *              "Type": "Submenu",
         *              "NestedActions": ["Id of the action which will be placed as part of this submenu", "Other id"]
         *              // extenstionDefinition is called recursevely to check visibility and provide corresponding  action definition
         *            }
         *            //or when using
         *            {
         *              builtin: true
         *            }
         *           },
         *           // Executes the action with given sActionKey and context
         *           triggerAction: (sActionKey, context):void => {
         *             alert("Trigger"+ sKey+ ":"+context);
         *           }
         *      }
         *
         *
         * @param sActionId actionId which is then used to be processed via provided extentionDefinition
         * @param oActionDefinition see description above
         */
    registerAction: function (sActionId, oActionDefinition) {
      this.actions[sActionId] = oActionDefinition;
    }, unregisterAction: function (sActionId) {
      delete this.actions[sActionId];
    }, isReleaseLocked: function () {
      return true;
    },

    convertCellClickContext: function (oContext, sDataProviderName) {
      const convertedContext = {
        DataProvider: sDataProviderName,
        Grid: {
          SelectedCells: [], SelectedDataCells: []
        }
      };
      const columnNumber = parseInt(oContext.getParameters().getByKey("column"));
      const rowNumber = parseInt(oContext.getParameters().getByKey("row"));
      if (columnNumber >= 0 && rowNumber >= 0) {
        convertedContext.Grid.SelectedCells.push({
          rowIndex: rowNumber, columnIndex: columnNumber
        });
        this._setSelectedDataCells(convertedContext, rowNumber, columnNumber);
      }
      return convertedContext;
    },

    convertContextMenuContext: function (oContext) {
      var that = this;
      const convertedContext = {
        DataProvider: this._getDataProvider(oContext).Name,
        Grid: {
          SelectedCells: [], SelectedDataCells: []
        }
      };
      let aSelectedCells = ListHelper.arrayFromList(ListHelper.arrayFromList(oContext.getSubContexts("Selected.Cells"))[0].getSubContexts());
      aSelectedCells.forEach(function (oSelectedCellContext) {
        const columnNumber = oSelectedCellContext.getCustomObject().getFirstObject().getInteger();
        const rowNumber = oSelectedCellContext.getCustomObject().getSecondObject().getInteger();
        if (columnNumber >= 0 && rowNumber >= 0) {
          convertedContext.Grid.SelectedCells.push({
            rowIndex: rowNumber, columnIndex: columnNumber
          });
          that._setSelectedDataCells(convertedContext, rowNumber, columnNumber);
        }
      });
      return convertedContext;
    },

    _setSelectedDataCells: function (convertedContext, rowNumber, columnNumber) {
      if (columnNumber && rowNumber) {
        const oDataProvider = this._Model.getDataProvider(convertedContext.DataProvider);
        const oActiveTableContainer = oDataProvider.getGridVisualization()._getFFVisualization().getActiveTableContainer();
        const columnIndex = oActiveTableContainer.getColumnTupleIndex(columnNumber);
        const rowIndex = oActiveTableContainer.getRowTupleIndex(rowNumber);
        const documentId = oActiveTableContainer.getDocumentId(columnNumber, rowNumber);
        if (columnIndex >= 0 && rowIndex >= 0) {
          convertedContext.Grid.SelectedDataCells.push({
            rowIndex: rowIndex, columnIndex: columnIndex, documentId: documentId
          });
        }
      }
    },

    _getDataProvider: function (oContext) {
      let oFFDataProvider = oContext.getSingleSubContext("Olap.DataProvider")?.getCustomObject();
      if (!oFFDataProvider) {
        //For compatability reason of FlexAnalysis
        oFFDataProvider = oContext.getSingleSubContext("Document.QueryBuilder").getCustomObject().getDataProvider();
      }
      return oFFDataProvider && this._Model.getDataProvider(oFFDataProvider.getName());
    }

  });
  return facmp;
});
