/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["../i18n", "sap/ui/export/Spreadsheet", "../error/ErrorHandler", "sap/ui/core/mvc/Controller", "sap/esh/search/ui/SearchResultFormatter", "sap/ui/core/Element", "../SearchResultTableColumnType", "../sinaNexTS/sina/SearchResultSetItemAttributeGroup", "../sinaNexTS/sina/AttributeType", "sap/ui/export/library", "sap/m/MessageBox"], function (__i18n, Spreadsheet, __ErrorHandler, Controller, SearchResultFormatter, Element, ___SearchResultTableColumnType, ___sinaNexTS_sina_SearchResultSetItemAttributeGroup, ___sinaNexTS_sina_AttributeType, sap_ui_export_library, MessageBox) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const i18n = _interopRequireDefault(__i18n);
  const ErrorHandler = _interopRequireDefault(__ErrorHandler);
  const TableColumnType = ___SearchResultTableColumnType["TableColumnType"];
  const SearchResultSetItemAttributeGroup = ___sinaNexTS_sina_SearchResultSetItemAttributeGroup["SearchResultSetItemAttributeGroup"];
  const AttributeType = ___sinaNexTS_sina_AttributeType["AttributeType"];
  const EdmType = sap_ui_export_library["EdmType"]; // import Dialog from "sap/m/Dialog";
  // import Text from "sap/m/Text";
  // import VerticalLayout from "sap/ui/layout/VerticalLayout";
  // import RadioButtonGroup from "sap/m/RadioButtonGroup";
  // import RadioButton from "sap/m/RadioButton";
  // import MessageStrip from "sap/m/MessageStrip";
  /**
   * @namespace sap.esh.search.ui.controls
   */
  const SearchSpreadsheet = Controller.extend("sap.esh.search.ui.controls.SearchSpreadsheet", {
    constructor: function constructor() {
      Controller.prototype.constructor.apply(this, arguments);
      this.limit = 1000;
    },
    onExport: async function _onExport(model) {
      this.model = model;
      if (this.model.getProperty("/boCount") > this.limit) {
        MessageBox.information(i18n.getText("exportDataInfo"), {
          actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
          onClose: async oAction => {
            let isExport;
            if (oAction == MessageBox.Action.OK) {
              isExport = true;
            }
            if (oAction == MessageBox.Action.CANCEL) {
              isExport = false;
            }
            await this.controlExport(isExport);
          },
          styleClass: "sapUshellSearchResultExportDialog"
        });
      } else {
        await this.controlExport(true);
      }
    },
    controlExport: async function _controlExport(isExport) {
      try {
        this.lockUI();
        if (!isExport) {
          return;
        }
        const exportData = await this.formatExportData();
        await this.doUI5Export(exportData);
      } catch (error) {
        const errorHandler = ErrorHandler.getInstance();
        errorHandler.onError(error);
      } finally {
        this.unlockUI();
      }
    },
    formatExportData: async function _formatExportData() {
      // search query
      const exportQuery = this.model.query.clone();
      exportQuery.setCalculateFacets(false);
      exportQuery.setTop(this.limit);

      // search result format
      const searchResultSet = await exportQuery.getResultSetAsync();
      const formatter = new SearchResultFormatter(this.model);
      const formattedResults = formatter.format(searchResultSet, exportQuery.filter.searchTerm, {
        suppressHighlightedValues: true
      });

      // export data type
      this.exportDataType = "technical"; // default value type

      // UI visible columns
      this.visibleColumns = this.getVisibleColumns();

      // export columns
      const exportColumns = this.formatExportColumns(formattedResults);

      // export rows
      const exportRows = this.formatExportRows(formattedResults);
      return {
        exportColumns: exportColumns,
        exportRows: exportRows
      };
    },
    getVisibleColumns: function _getVisibleColumns() {
      const visibleColumns = [];
      if (this.model.getResultViewType() !== "searchResultTable") {
        // export columns: initial state columns, original ordering, first 6/7 visible
        this.model.getTableInitialColumns().forEach(column => {
          if (column.visible === true) {
            visibleColumns.push(column);
          }
        });
      } else {
        // export columns: real-time table visible columns
        this.model.getTableColumns(false).forEach(column => {
          if (column.visible === true) {
            visibleColumns.push(column);
          }
        });
      }
      return visibleColumns;
    },
    formatExportColumns: function _formatExportColumns(formattedResults) {
      const formattedAttributes = formattedResults[0].itemattributes;
      let exportColumns = [];
      for (const visibleColumn of this.visibleColumns) {
        switch (visibleColumn.type) {
          case TableColumnType.TITLE:
          case TableColumnType.TITLE_DESCRIPTION:
            exportColumns.push({
              label: visibleColumn.name,
              property: visibleColumn.p13NColumnName,
              type: EdmType.String,
              columnType: visibleColumn.type
            });
            break;
          case TableColumnType.DETAIL:
            if (this.exportDataType === "formatted") {
              // export single attribute as one column
              // export group attribute as one merged column
              exportColumns = exportColumns.concat([this.formatMergedColumn(visibleColumn)]);
            } else {
              // export single attribute as one column
              // export group attribute as multiple separate columns
              exportColumns = exportColumns.concat(this.formatSeparateColumns(visibleColumn, formattedAttributes));
            }
            break;
          default:
            // case TableColumnType.RELATED_APPS:
            // case TableColumnType.EXTEND:
            // don't export
            break;
        }
      }
      return exportColumns;
    },
    formatMergedColumn: function _formatMergedColumn(visibleColumn) {
      return {
        label: visibleColumn.name,
        property: visibleColumn.attributeId,
        type: EdmType.String,
        columnType: TableColumnType.DETAIL
      };
    },
    formatSeparateColumns: function _formatSeparateColumns(visibleColumn, formattedAttributes) {
      const matchedAttribute = formattedAttributes.find(formattedAttribute => formattedAttribute?.sinaAttribute?.id === visibleColumn.attributeId);
      const sinaAttribute = matchedAttribute?.sinaAttribute;
      if (sinaAttribute) {
        if (sinaAttribute instanceof SearchResultSetItemAttributeGroup) {
          return this.formatColumnsForGroupAttribute(sinaAttribute);
        } else {
          return [this.formatColumnForSingleAttribute(sinaAttribute)];
        }
      }
      return [];
    },
    formatColumnsForGroupAttribute: function _formatColumnsForGroupAttribute(attribute) {
      const columns = [];
      const attributesInGroup = attribute?.attributes || [];
      for (const attributeInGroup of attributesInGroup) {
        if (attributeInGroup?.attribute instanceof SearchResultSetItemAttributeGroup) {
          const childColumns = this.formatColumnsForGroupAttribute(attributeInGroup?.attribute);
          columns.push(...childColumns);
        } else {
          columns.push(this.formatColumnForSingleAttribute(attributeInGroup.attribute));
        }
      }
      return columns;
    },
    formatColumnForSingleAttribute: function _formatColumnForSingleAttribute(attribute) {
      // return array of single column
      if (attribute) {
        return {
          label: attribute?.label,
          property: attribute?.id,
          type: this.isNumberType(attribute) ? EdmType.Number : EdmType.String,
          columnType: TableColumnType.DETAIL
        };
      }
      return {};
    },
    formatExportRows: function _formatExportRows(formattedResults) {
      const exportRows = [];
      for (const formattedResult of formattedResults) {
        exportRows.push(this.formatExportRow(formattedResult));
      }
      return exportRows;
    },
    formatExportRow: function _formatExportRow(formattedResult) {
      let exportRow = {};
      for (const visibleColumn of this.visibleColumns) {
        switch (visibleColumn.type) {
          case TableColumnType.TITLE:
            exportRow[visibleColumn.p13NColumnName] = formattedResult.title;
            break;
          case TableColumnType.TITLE_DESCRIPTION:
            exportRow[visibleColumn.p13NColumnName] = formattedResult.titleDescription;
            break;
          case TableColumnType.DETAIL:
            if (this.exportDataType === "formatted") {
              // export single attribute formatted value as one cell
              // export group attribute formatted values as one merged cell
              exportRow = {
                ...exportRow,
                ...this.formatMergedCell(visibleColumn, formattedResult.itemattributes)
              };
            } else {
              // export single attribute technical value as one cell
              // export group attribute technical values as multiple separate cells
              exportRow = {
                ...exportRow,
                ...this.formatSeparateCells(visibleColumn, formattedResult.itemattributes)
              };
            }
            break;
          default:
            // TableColumnType.DETAIL
            // TableColumnType.RELATED_APPS
            // TableColumnType.EXTEND
            // don't export
            break;
        }
      }
      return exportRow;
    },
    formatMergedCell: function _formatMergedCell(visibleColumn, formattedAttributes) {
      const matchedAttribute = formattedAttributes.find(formattedAttribute => formattedAttribute?.sinaAttribute?.id === visibleColumn.attributeId);
      if (matchedAttribute) {
        const key = visibleColumn?.attributeId;
        const value = matchedAttribute?.value || ""; // formatted value
        return {
          [key]: value
        };
      }
      return {};
    },
    formatSeparateCells: function _formatSeparateCells(visibleColumn, formattedAttributes) {
      const matchedAttribute = formattedAttributes.find(formattedAttribute => formattedAttribute?.sinaAttribute?.id === visibleColumn.attributeId);
      if (matchedAttribute) {
        const sinaAttribute = matchedAttribute?.sinaAttribute;
        if (sinaAttribute instanceof SearchResultSetItemAttributeGroup) {
          return this.formatCellsForGroupAttribute(sinaAttribute);
        } else {
          return this.formatCellsForSingleAttribute(sinaAttribute);
        }
      }
      return {};
    },
    formatCellsForGroupAttribute: function _formatCellsForGroupAttribute(attribute) {
      let cells = {};
      const attributesInGroup = attribute?.attributes || [];
      for (const attributeInGroup of attributesInGroup) {
        // if (attributeInGroup?.attribute?.metadata?.type === AttributeType.Group) {
        if (attributeInGroup?.attribute instanceof SearchResultSetItemAttributeGroup) {
          const childCells = this.formatCellsForGroupAttribute(attributeInGroup?.attribute);
          cells = {
            ...cells,
            ...childCells
          };
        } else {
          cells = {
            ...cells,
            ...this.formatCellsForSingleAttribute(attributeInGroup.attribute)
          };
        }
      }
      return cells;
    },
    formatCellsForSingleAttribute: function _formatCellsForSingleAttribute(attribute) {
      if (attribute) {
        const key = attribute?.id;
        let value;
        // compatible to old version
        if (this.isNumberType(attribute)) {
          value = attribute?.value || ""; // technical value
        } else {
          value = attribute?.valueFormatted || "";
        }
        return {
          [key]: value
        };
      }
      return {};
    },
    isNumberType: function _isNumberType(attribute) {
      if (attribute?.metadata?.type === AttributeType.Double || attribute?.metadata?.type === AttributeType.Integer) {
        return true;
      } else {
        return false;
      }
    },
    doUI5Export: async function _doUI5Export(exportData) {
      const oSettings = {
        workbook: {
          columns: exportData.exportColumns
        },
        fileName: i18n.getText("exportFileName"),
        dataSource: exportData.exportRows
      };
      new Spreadsheet(oSettings).build().then(() => {
        // do nothing
      }, error => {
        const errorHandler = ErrorHandler.getInstance();
        errorHandler.onError(error);
      });
    },
    lockUI: function _lockUI() {
      const exportButtonId = document?.querySelectorAll('[id$="ushell-search-result-dataExportButton"]')[0]?.id;
      const exportButton = Element.getElementById(exportButtonId);
      exportButton?.setEnabled(false);
      this.model?.busyIndicator?.setBusy(true);
    },
    unlockUI: function _unlockUI() {
      const exportButtonId = document?.querySelectorAll('[id$="ushell-search-result-dataExportButton"]')[0]?.id;
      const exportButton = Element.getElementById(exportButtonId);
      exportButton?.setEnabled(true);
      this.model?.busyIndicator?.setBusy(false);
    }
  });
  return SearchSpreadsheet;
});
})();