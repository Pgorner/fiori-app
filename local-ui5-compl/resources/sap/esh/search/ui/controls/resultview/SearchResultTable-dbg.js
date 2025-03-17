/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["../../i18n", "../../SearchResultTableFormatter", "../../SearchResultTableP13NPersonalizer", "sap/m/Table", "sap/m/plugins/ColumnResizer", "sap/m/Column", "sap/m/ColumnListItem", "sap/m/CustomListItem", "../../SearchResultTableColumnType", "./SearchText", "../SearchLink", "sap/ui/core/Element", "sap/m/library", "sap/m/HBox", "sap/m/Label", "sap/m/Button", "sap/ui/core/Icon", "../../sinaNexTS/sina/NavigationTarget", "sap/m/ActionSheet", "sap/ui/base/ManagedObject", "sap/base/util/merge", "../../SearchUtil", "sap/esh/search/ui/SearchHelper", "sap/base/Log", "../../error/ErrorHandler"], function (__i18n, __SearchResultTableFormatter, __SearchResultTableP13NPersonalizer, Table, ColumnResizer, Column, ColumnListItem, CustomListItem, ____SearchResultTableColumnType, __SearchText, __SearchLink, Element, sap_m_library, HBox, Label, Button, Icon, ____sinaNexTS_sina_NavigationTarget, ActionSheet, ManagedObject, merge, SearchUtil, SearchHelper, Log, __ErrorHandler) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const i18n = _interopRequireDefault(__i18n);
  const SearchResultTableFormatter = _interopRequireDefault(__SearchResultTableFormatter);
  const SearchResultTableP13NPersonalizer = _interopRequireDefault(__SearchResultTableP13NPersonalizer);
  const TableColumnType = ____SearchResultTableColumnType["TableColumnType"];
  const SearchText = _interopRequireDefault(__SearchText);
  const SearchLink = _interopRequireDefault(__SearchLink);
  const ListMode = sap_m_library["ListMode"];
  const PlacementType = sap_m_library["PlacementType"];
  const PopinDisplay = sap_m_library["PopinDisplay"];
  const PopinLayout = sap_m_library["PopinLayout"];
  const NavigationTarget = ____sinaNexTS_sina_NavigationTarget["NavigationTarget"];
  const ErrorHandler = _interopRequireDefault(__ErrorHandler);
  /**
   * @namespace sap.esh.search.ui.controls
   */
  const SearchResultTable = Table.extend("sap.esh.search.ui.controls.SearchResultTable", {
    renderer: {
      apiVersion: 2
    },
    constructor: function _constructor(sId, options) {
      Table.prototype.constructor.call(this, sId, options);
      this.useStableIds = true;
      this.log = Log.getLogger("sap.esh.search.ui.controls.resultview.SearchResultTable");
      this.errorHandler = ErrorHandler.getInstance();
    },
    assembleTable: function _assembleTable(oModel) {
      this.bindProperty("mode", {
        parts: [{
          path: "/multiSelectionEnabled"
        }],
        formatter: multiSelectionEnabled => {
          return multiSelectionEnabled === true ? ListMode.MultiSelect : ListMode.None;
        }
      });
      this.setProperty("rememberSelections", false);
      this.attachSelectionChange(() => {
        oModel.updateMultiSelectionSelected();
      });
      this.bindProperty("visible", {
        parts: [{
          path: "/resultViewType"
        }, {
          path: "/count"
        }],
        formatter: this.formatVisible.bind(this)
      });
      this.setProperty("sticky", ["ColumnHeaders"]);
      this.setNoDataText(i18n.getText("noCloumnsSelected"));
      this.update();

      // this.setFixedLayout(false);
      if (oModel.config?.FF_resizeResultTableColumns === true) {
        this.setupColumnResizable();
        // this.setupColumnsAbsoluteWidth(); -> need table width in run time, call in onAfterRendering
        this.addStyleClass("sapElisa-search-result-table-resizable");
      } else {
        // this.setAutoPopinMode(true); // not working
        // this.setupPopin(); -> need set setMinScreenWidth in run time, call in onAfterRendering
        this.addStyleClass("sapElisa-search-result-table-might-popin");
      }
      this.addStyleClass("sapElisa-search-result-table");
    },
    formatVisible: function _formatVisible(resultViewType, count) {
      const visible = resultViewType === "searchResultTable" && count !== 0;
      if (visible) {
        if (!this.tablePersonalizer) {
          this.tablePersonalizer = new SearchResultTableP13NPersonalizer(this.getModel());
        }
        this.tablePersonalizer.initialize(this);
      }
      return visible;
    },
    update: function _update() {
      //TODO: remove it and test
      if (!this.getBinding("columns")) {
        this.bindTableColumns();
      }
      //TODO: remove it and test
      if (!this.getBinding("items")) {
        this.bindTableItems();
      }
      if (this.getModel()) {
        this.getModel().updateBindings(true);
      }
    },
    bindTableColumns: function _bindTableColumns() {
      this.bindAggregation("columns", {
        path: "/tableColumns",
        factory: sId => {
          const column = new Column(this.getStableId(sId, "column"), {
            header: new Label(this.getStableId(sId, "headerLabel"), {
              text: "{name}"
            }),
            visible: "{visible}",
            width: "{width}"
          });
          return column;
        }
      });
    },
    bindTableItems: function _bindTableItems() {
      this.bindAggregation("items", {
        path: "/tableRows",
        factory: (id, bData) => {
          return this.assembleTableItems(id, bData);
        }
      });
    },
    handleForwardEllipsis: function _handleForwardEllipsis(oEvent) {
      const domElements = oEvent["srcControl"]?.getDomRef()?.querySelectorAll(".sapUshellSearchResultItem-AttributeValueHighlighted");
      if (domElements && domElements.length > 0) {
        domElements.forEach(function (element) {
          SearchUtil.forwardEllipsis4Whyfound(element);
        });
      }
    },
    assembleTableItems: function _assembleTableItems(id, bData) {
      // footer item
      if (bData.getObject().type === "footer") {
        return new CustomListItem(this.getStableId(id, "item-footer"), {
          visible: false
        });
      }
      // body item
      this.sortCellsInRows(bData.getPath()); // sort cells of current row ONLY
      return this.assembleTableMainItem(id, bData);
    },
    assembleTableMainItem: function _assembleTableMainItem(id, bData) {
      const oModel = this.getModel();
      const columnListItem = new ColumnListItem(this.getStableId(id, "item"), {
        selected: {
          path: "selected"
        }
      }).addStyleClass("sapUshellSearchTable");
      columnListItem.addEventDelegate({
        onAfterRendering: this.handleForwardEllipsis
      });
      if (bData.getObject().customItemStyleClass) {
        columnListItem.addStyleClass(bData.getObject().customItemStyleClass);
      }
      columnListItem.bindAggregation("cells", {
        path: "cells",
        factory: (subPath, bData) => {
          const searchResultTableCell = bData.getObject();
          if (searchResultTableCell.type === TableColumnType.TITLE) {
            // build title cell
            let titleUrl = "";
            let hasTargetFunction = false;
            let enabled = true;
            const titleNavigation = searchResultTableCell.titleNavigation;
            if (titleNavigation instanceof NavigationTarget) {
              hasTargetFunction = typeof titleNavigation.targetFunction === "function";
              titleUrl = titleNavigation.targetUrl;
            }
            if ((typeof titleUrl !== "string" || titleUrl.length === 0) && hasTargetFunction === false) {
              enabled = false;
            }
            let titleLink;
            if (titleNavigation) {
              titleLink = new SearchLink(this.getStableId(subPath, "link"), {
                navigationTarget: titleNavigation,
                text: {
                  path: "value"
                },
                wrapping: false
              });
            } else {
              titleLink = new SearchText(this.getStableId(subPath, "link"), {
                text: {
                  path: "value"
                },
                wrapping: false
              });
            }
            const titleIconUrl = searchResultTableCell.titleIconUrl;
            if (titleIconUrl && !(titleLink.getAggregation("icon") instanceof Icon)) {
              const oIcon = new Icon(this.getStableId(subPath, "icon"), {
                src: ManagedObject.escapeSettingsValue(titleIconUrl)
              });
              titleLink.setIcon(oIcon);
            }
            titleLink.addStyleClass("sapUshellSearchResultListItem-MightOverflow");
            titleLink.addStyleClass("sapUshellSearchTableTitleLink");
            if (searchResultTableCell.isHighlighted) {
              titleLink.addStyleClass("sapUshellSearchResultItem-AttributeValueHighlighted");
            }
            let returnObject = titleLink;
            const titleInfoIconUrl = searchResultTableCell.titleInfoIconUrl;
            if (titleInfoIconUrl) {
              const titleInfoIcon = new Icon(this.getStableId(subPath, "infoIcon"), {
                src: ManagedObject.escapeSettingsValue(titleInfoIconUrl),
                tooltip: i18n.getText("collectionShared")
              }).addStyleClass("sapUshellSearchTableTitleInfoIcon");
              if (!enabled) {
                titleInfoIcon.addStyleClass("sapUshellSearchTableTitleInfoIconDisabled");
              }
              returnObject = new HBox(this.getStableId(subPath, "titleContainer"), {
                items: [titleLink, titleInfoIcon]
              });
            }
            return returnObject;
          }

          // build related objects:
          // 1. button to open action sheet: relAppsButton
          // 2. action sheet: relAppsActionSheet
          // 3. navigation buttons in action sheet: navigationButton
          if (searchResultTableCell.type === TableColumnType.RELATED_APPS) {
            const relatedAppsButton = new Button(this.getStableId(subPath, "relAppsButton"), {
              icon: "sap-icon://action",
              tooltip: i18n.getText("intents"),
              press: () => {
                // destroy old action sheet
                const oldActionSheet = Element.getElementById(this.getStableId(relatedAppsButton.getId(), "relAppsActionSheet"));
                if (oldActionSheet) {
                  oldActionSheet.destroy();
                  return;
                }

                // related app navigation buttons
                const navigationObjects = searchResultTableCell.navigationObjects;
                const navigationButtons = [];
                let navigationButton;
                const pressButton = (event, navigationObject) => {
                  if (navigationObject instanceof NavigationTarget) {
                    navigationObject.performNavigation({
                      event: event
                    });
                  }
                };
                for (let i = 0; i < navigationObjects.length; i++) {
                  const navigationObject = navigationObjects[i];
                  this.destroyControl(this.getStableId(subPath, `navButton${i}`)); // find a better solution
                  navigationButton = new Button(this.getStableId(subPath, `navButton${i}`), {
                    text: ManagedObject.escapeSettingsValue(navigationObject?.text),
                    tooltip: ManagedObject.escapeSettingsValue(navigationObject?.text)
                  });
                  navigationButton.attachPress(navigationObject, pressButton);
                  navigationButtons.push(navigationButton);
                }

                // related app pop over
                const actionSheet = new ActionSheet(this.getStableId(relatedAppsButton.getId(), "relAppsActionSheet"), {
                  buttons: navigationButtons,
                  placement: PlacementType.Auto
                });
                actionSheet.attachAfterClose(() => {
                  actionSheet.destroy();
                });
                actionSheet.openBy(relatedAppsButton);
              }
            });
            relatedAppsButton.addStyleClass("sapElisaSearchTableRelatedAppsButton"); // for test purposes
            return relatedAppsButton;
          }

          // build cell with default navigation
          const navigationTarget = searchResultTableCell.defaultNavigationTarget;
          if (navigationTarget instanceof NavigationTarget) {
            const attributeLink = new SearchLink(this.getStableId(subPath, "attrLink"), {
              navigationTarget: null,
              wrapping: false,
              tooltip: ManagedObject.escapeSettingsValue(searchResultTableCell.tooltip || "") // preserve SearchResultFormatter defined tooltip (hierarchical attribute of DWC)
            });
            // lazy loading because of potential {} in the href will be interpreted as binding path by UI5
            attributeLink.setNavigationTarget(navigationTarget);
            attributeLink.setText(searchResultTableCell.value);
            attributeLink.addStyleClass("sapUshellSearchResultListItem-MightOverflow");
            let oIcon = null;
            const iconSrc = searchResultTableCell.icon;
            const attributeLinkIcon = attributeLink.getAggregation("icon");
            if (attributeLinkIcon instanceof Icon) {
              attributeLinkIcon.addStyleClass("sapUshellSearchResultListItem-AttributeIcon");
            } else if (typeof iconSrc === "string" && iconSrc.startsWith("sap-icon://")) {
              oIcon = new Icon(this.getStableId(subPath, "attrIcon"), {
                src: ManagedObject.escapeSettingsValue(iconSrc)
              });
              oIcon.addStyleClass("sapUshellSearchResultListItem-AttributeIcon");
              attributeLink.setIcon(oIcon);
            }
            return attributeLink;
          }
          if (searchResultTableCell.type === TableColumnType.EXTEND) {
            try {
              return oModel.config.extendTableColumn.bindingFunction(searchResultTableCell); // ToDo
            } catch (e) {
              this.errorHandler.onError(e);
            }
          }

          // build other cells:
          // TableColumnType.TITLE_DESCRIPTION
          // TableColumnType.DETAIL
          const cell = new SearchText(this.getStableId(subPath, "searchText"), {
            text: {
              path: "value"
            },
            //tooltip: ManagedObject.escapeSettingsValue(searchResultTableCell.tooltip || ""), // ignored, UI sets tooltip by setupEllipsisAndTooltip
            wrapping: false
          }).addStyleClass("sapUshellSearchResultListItem-MightOverflow");
          if (searchResultTableCell.icon) {
            const cellIcon = new Icon(this.getStableId(subPath, "cellIcon"), {
              src: ManagedObject.escapeSettingsValue(searchResultTableCell.icon)
            });
            cell.setIcon(cellIcon);
          }
          if (searchResultTableCell.isHighlighted) {
            cell.addStyleClass("sapUshellSearchResultItem-AttributeValueHighlighted");
          }
          return cell;
        }
      });
      return columnListItem;
    },
    sortCellsInRows: function _sortCellsInRows(rowPath) {
      const oModel = this.getModel();
      let rows;
      if (rowPath) {
        const row = [oModel.getProperty(rowPath)][0];
        row.cells = this.getSortedCells(row.cells);
        oModel.setProperty(rowPath, row);
      } else {
        rows = oModel.getProperty("/tableRows");
        for (const row of rows) {
          row.cells = this.getSortedCells(row.cells);
        }
        oModel.setProperty("/tableRows", rows);
      }
    },
    getSortedCells: function _getSortedCells(cells) {
      const sortedCells = [];
      const columns = this.getModel().getTableColumns(false);
      for (const column of columns) {
        for (const cell of cells) {
          if (column.p13NColumnName === cell.p13NColumnName) {
            sortedCells.push(cell);
            break;
          }
        }
      }
      return sortedCells;
    },
    setupColumnResizable: function _setupColumnResizable() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      // that.setFixedLayout(false);
      const columnResizer = new ColumnResizer();
      columnResizer.attachColumnResize(() => {
        /*  Bug: 
                step 1. table has 2 columns, 2nd column has 100% width.
                step 2. resize 2nd column from right side (search UI right side boundary), set column width to 20 pixcel.
                step 3. reload UI, 2nd column has old 100% width, 20 pixcel width expected.
                Reason: ColumnResize event is triggered before new width set to column. New width is not saved. 
                workaround: delay saving width.
            */
        setTimeout(function () {
          that.getModel().saveTableColumns(that.getModel().getTableColumns(false));
        }, 500);
      });
      that.addDependent(columnResizer);
    },
    setupPopin: function _setupPopin() {
      const oModel = this.getModel();
      // check !oModel.config?.FF_resizeResultTableColumns before calling this function
      if (!oModel) {
        return;
      }
      this.setPopinLayout(PopinLayout.Block);
      let visibleCloumns = 0;
      // const uiColumnsOrdered = this.getColumns().sort(this._byOrder); // sort columns by perso order, necessary for setMinScreenWidth()
      this.getColumns().forEach(function (column) {
        column.setDemandPopin(true);
        column.setPopinDisplay(PopinDisplay.Inline);
        if (column.getVisible()) {
          visibleCloumns++;
          column.setMinScreenWidth(12 * visibleCloumns + "rem");
        }
      });

      // if (visibleCloumns <= 3) {
      //     this.setFixedLayout(false);
      // } else {
      //     this.setFixedLayout(true);
      // }
    },
    // private _byOrder(columnA, columnB): number {
    //     if (columnA.getOrder() < columnB.getOrder()) {
    //         return -1;
    //     }
    //     if (columnA.getOrder() > columnB.getOrder()) {
    //         return 1;
    //     }
    //     return 0;
    // }
    setupColumnsAbsoluteWidth: function _setupColumnsAbsoluteWidth() {
      const oModel = this.getModel();
      // check oModel.config?.FF_resizeResultTableColumns before calling this function
      if (!oModel) {
        return;
      }
      const tableWidth = this?.$()?.width();
      if (typeof tableWidth !== "number") {
        return;
      }
      const selectBoxWidth = typeof this?.$()?.find("table th.sapMListTblSelCol").width() !== "number" ? 0 : this?.$()?.find("table.sapMListModeMultiSelect th.sapMListTblSelCol").width();
      const columns = merge([], oModel.getTableColumns(false));
      const searchResultTableFormatter = new SearchResultTableFormatter(oModel);
      let absoluteColumnWidthSum = 0;
      let visibleColumnsWithRelativeWidth = 0;

      // Step 1: sum up absolute width, and count relative and visible columns
      columns.forEach(column => {
        const widthInPixel = searchResultTableFormatter.getColumnWidthInPixel(column.width);
        if (widthInPixel) {
          // column of absolute width (end with px)
          absoluteColumnWidthSum += widthInPixel;
        } else {
          // column of relative width (end with %, or undefined, ...)
          column.width = searchResultTableFormatter.defaultColumnWidth; // overwrite (stored) different formatted width to default width, i.e. undefined
          if (column.visible) {
            visibleColumnsWithRelativeWidth++;
          }
        }
      });

      // Step 2: average rest absulte width to relative columns (visible or invisible, 100% or 30% etc.)
      if (visibleColumnsWithRelativeWidth === 0) {
        return;
      }
      const borderWidth = 2; // avoid x-scroll bar in table after reset columns
      const singleWidth = Math.trunc((tableWidth - selectBoxWidth - absoluteColumnWidthSum) / visibleColumnsWithRelativeWidth - borderWidth) + "px";
      columns.forEach(column => {
        const widthInPixel = searchResultTableFormatter.getColumnWidthInPixel(column.width);
        if (!widthInPixel) {
          // column of relative width (end with %, or undefined)
          // column visible and invisible
          column.width = singleWidth;
        }
      });

      // Step 3: set width in search model
      oModel.setTableColumns(columns, true);
    },
    setupEllipsisAndTooltip: function _setupEllipsisAndTooltip() {
      let objs;

      // tooltip for backward ellipsis
      // normal table cell
      objs = $(this.getDomRef()).find("tbody > tr > td");
      objs.each((i, d) => {
        SearchHelper.attachEventHandlersForTooltip(d);
      });

      // tooltip for backward ellipsis
      // popin table cell
      objs = $(this.getDomRef()).find("tbody .sapMListTblSubCntValInline");
      objs.each((i, d) => {
        SearchHelper.attachEventHandlersForTooltip(d);
      });
    },
    getStableId: function _getStableId(parentId, postfixId, separator = "-") {
      if (this.useStableIds) {
        return `${parentId}${separator}${postfixId}`;
      } else {
        return "";
      }
    },
    destroyControl: function _destroyControl(id) {
      const control = Element.getElementById(id);
      if (control) {
        control.destroy();
      }
    },
    onBeforeRendering: function _onBeforeRendering() {
      // set popin for columns
      // const oModel = this.getModel() as SearchModel;
      // if (oModel.config?.FF_resizeResultTableColumns !== true) {
      //     this.setupPopin();
      // }
    },
    onAfterRendering: function _onAfterRendering() {
      const oModel = this.getModel();
      // colspan for no data cell
      $(this.getDomRef())?.find("table > tbody > tr > td.sapMListTblCellNoData:first")?.attr("colspan", 3);

      // aria-labelledby for table title row
      const $tableTitleRow = $(this.getDomRef())?.find("table > thead > tr:first");
      if ($tableTitleRow) {
        $tableTitleRow?.attr("aria-labelledby", oModel?.getSearchCompositeControlInstanceByChildControl(this)?.countBreadcrumbsHiddenElement.getId());
      }

      // backward and forward ellipsis and tooltip
      this.setupEllipsisAndTooltip();

      // absolute width for columns
      if (oModel.config?.FF_resizeResultTableColumns === true) {
        this.setupColumnsAbsoluteWidth();
      }

      // popin for columns
      if (oModel.config?.FF_resizeResultTableColumns !== true) {
        this.setupPopin();
      }
    }
  });
  return SearchResultTable;
});
})();