/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["./i18n", "./SearchResultBaseFormatter", "./SearchResultTableColumnType", "./uiConstants", "sap/base/util/merge", "sap/esh/search/ui/controls/SearchLayoutResponsive", "sap/base/Log"], function (__i18n, __SearchResultBaseFormatter, ___SearchResultTableColumnType, ___uiConstants, merge, SearchLayoutResponsive, Log) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const i18n = _interopRequireDefault(__i18n);
  const SearchResultBaseFormatter = _interopRequireDefault(__SearchResultBaseFormatter);
  const TableColumnType = ___SearchResultTableColumnType["TableColumnType"];
  const initialValueUnicode = ___uiConstants["initialValueUnicode"];
  class SearchResultTableFormatter extends SearchResultBaseFormatter {
    defaultColumnWidth;
    logger = (() => Log.getLogger("sap.esh.search.ui.SearchResultTableFormatter"))();
    constructor(model) {
      super(model);
      this.model = model;
      this.defaultColumnWidth = "100%";
    }

    /*
     * ===================================
     * format columns for table view
     * ===================================
     */
    formatColumns(results) {
      if (results?.length === 0) {
        return [];
      }

      // format columns with dummy state: ordering, visible, width
      const preformattedColumns = this.preformatColumns(results);
      const storedColumns = this.model.getTableColumns(true);
      if (Array.isArray(storedColumns) === false || storedColumns.length === 0) {
        return this.formatInitialColumns(preformattedColumns);
      }
      return this.unifyColumns(preformattedColumns, storedColumns);
    }
    preformatColumns(results) {
      let column;
      const columns = [];
      const addedAttributeKeys = new Set();
      const config = this?.model?.config;

      // detail columns
      // Loop through all results and their itemattributes
      for (const result of results || []) {
        for (const attribute of result?.itemattributes || []) {
          const attributeKey = attribute?.key;
          if (!addedAttributeKeys.has(attributeKey) && (this.isSingleAttributeInDetail(attributeKey) || this.isGroupAttributeInDetail(attributeKey))) {
            // Add the attribute ID to the set to avoid duplicates
            addedAttributeKeys.add(attributeKey);
            column = {
              p13NColumnName: this.createP13NColumnName(attributeKey),
              attributeId: attributeKey,
              name: attribute.name,
              type: TableColumnType.DETAIL,
              visible: true // dummy value
            };
            columns.push(column);
          }
        }
      }

      // related apps column
      for (const result of results || []) {
        if (result.navigationObjects !== undefined && result.navigationObjects.length > 0) {
          column = {
            p13NColumnName: this.createP13NColumnName(TableColumnType.RELATED_APPS),
            name: i18n.getText("intents"),
            type: TableColumnType.RELATED_APPS,
            visible: true // dummy value
          };
          columns.push(column);
          break;
        }
      }

      // extend column
      if (config?.extendTableColumn?.column) {
        column = {
          p13NColumnName: this.createP13NColumnName(TableColumnType.EXTEND),
          attributeId: config.extendTableColumn.column?.attributeId || "",
          name: config.extendTableColumn.column?.name || "",
          type: TableColumnType.EXTEND,
          visible: true // dummy value
        };
        columns.push(column);
      }

      // title description column
      if (results[0].titleDescription !== undefined) {
        column = {
          p13NColumnName: this.createP13NColumnName(TableColumnType.TITLE_DESCRIPTION),
          name: results[0].titleDescriptionLabel + " (" + i18n.getText("titleDescription") + ")",
          type: TableColumnType.TITLE_DESCRIPTION,
          visible: true // dummy value
        };
        columns.unshift(column);
      }

      // title column
      if (results[0].title !== undefined) {
        if (typeof config?.titleColumnName === "string" && config?.titleColumnName.length > 0) {
          column = {
            p13NColumnName: this.createP13NColumnName(TableColumnType.TITLE),
            name: i18n.hasText(config?.titleColumnName) ? i18n.getText(config?.titleColumnName) : config?.titleColumnName,
            // work around. let DWC change titleColumnName to "Business Name", and remove this logic
            type: TableColumnType.TITLE,
            visible: true // dummy value
          };
        } else {
          column = {
            p13NColumnName: this.createP13NColumnName(TableColumnType.TITLE),
            name: this.model.getDataSource().label,
            type: TableColumnType.TITLE,
            visible: true // dummy value
          };
        }
        columns.unshift(column);
      }

      /*
          original order of columns:
          1. title
          2. title description
          3. detail attributes
          4. related apps
          5. extend column
      */

      // add index for later reset initial column
      columns.forEach(function (column, i) {
        column.index = i;
      });

      // set width in formatInitialColumns and unifyColumns

      return columns;
    }
    formatInitialColumns(tableColumns) {
      const columns = merge([], tableColumns); // pass-by-value, not pass-by-reference
      const initialColumns = [];

      // initialize ordering
      columns.sort((a, b) => {
        if (a.index < b.index) {
          return -1;
        } else if (a.index > b.index) {
          return 1;
        } else {
          return 0;
        }
      });

      // initialize width, set dummy visible false
      for (const column of columns) {
        const initialColumn = this.createColumnOfAdaptiveVisibleAndWidth(column, false, undefined);
        initialColumns.push(initialColumn);
      }

      // initialize visibility
      if (this.model?.config?.extendTableColumn?.column) {
        for (const initialColumn of initialColumns) {
          initialColumn.visible = initialColumn.index < 7 || initialColumn.type === TableColumnType.EXTEND;
        }
      } else {
        for (const initialColumn of initialColumns) {
          initialColumn.visible = initialColumn.index < 6;
        }
      }
      return initialColumns;
    }
    unifyColumns(preformattedColumns, storedColumns) {
      // create map for easy search
      const tempoPreformattedColumns = merge([], preformattedColumns); // pass-by-value, not pass-by-reference
      const preformattedColumnMap = new Map(tempoPreformattedColumns.map(column => [column.p13NColumnName, column]));
      const tempoStoredColumns = merge([], storedColumns); // pass-by-value, not pass-by-reference
      const storedColumnMap = new Map(tempoStoredColumns.map(column => [column.p13NColumnName, column]));
      const unifiedColumns = [];

      /*
      case 1: column in preformattedColumns, column in persoStateColumns     -> 
              unified column p13NColumnName   = preformattedColumn p13NColumnName
              unified column attributeId      = preformattedColumn attributeId
              unified column type             = preformattedColumn type
              unified column name             = preformattedColumn name
              unified column index            = preformattedColumn index (IMPORTANT!)
              unified column width            = persoStateColumn width 
              unified column visible          = persoStateColumn visible
              unified column ordering         = persoStateColumn ordering
           case 2: column in preformattedColumns, column NOT in persoStateColumns  -> 
              unified column p13NColumnName   = preformattedColumn p13NColumnName
              unified column attributeId      = preformattedColumn attributeId
              unified column type             = preformattedColumn type
              unified column name             = preformattedColumn name
              unified column index            = preformattedColumn index (IMPORTANT!)
              unified column width            = dummy value
              unified column visible          = true
              unified column ordering         = ordering at end
       case 3: column NOT in preformattedColumns, column in persoStateColumns  -> 
              unified column                  = don't consider
      */

      // case 1
      // loop in storedColumns (NOT preformattedColumns) guarantees unifiedColumns having stored column ordering.
      for (const storedColumn of storedColumns) {
        const matchedColumn = preformattedColumnMap.get(storedColumn.p13NColumnName);
        if (matchedColumn) {
          unifiedColumns.push(this.createColumnOfAdaptiveVisibleAndWidth(matchedColumn, storedColumn.visible, storedColumn.width));
        }
      }

      // all preformattedColumns found in storage
      if (unifiedColumns.length === preformattedColumns.length) {
        return unifiedColumns;
      }

      // case 2
      for (const preformattedColumn of preformattedColumns) {
        const matchedColumn = storedColumnMap.get(preformattedColumn.p13NColumnName);
        if (!matchedColumn) {
          unifiedColumns.push(this.createColumnOfAdaptiveVisibleAndWidth(preformattedColumn, true, undefined));
        }
      }
      return unifiedColumns;
    }
    createColumnOfAdaptiveVisibleAndWidth(column, storedvisible, storedWidth) {
      const tempColumn = column;
      const configWidth = this.getConfigWidth(column);
      tempColumn.visible = storedvisible || false;
      if (this.model?.config?.FF_resizeResultTableColumns === true) {
        // table resizable
        tempColumn.width = storedWidth || configWidth || this.defaultColumnWidth; // set width by configured width or default width
      } else {
        // table NOT resizable
        if (configWidth === undefined) {
          delete tempColumn.width; // delete width
        } else {
          tempColumn.width = configWidth; // set configured width
        }
      }
      return tempColumn;
    }

    /*
     * ===================================
     * format rows with cells for table view
     * ===================================
     */
    formatRows(results, columns) {
      if (results?.length === 0) {
        return [];
      }
      if (columns?.length === 0) {
        return [];
      }

      // format rows
      const rows = [];
      for (let i = 0; i < results.length; i++) {
        rows[i] = {
          cells: []
        };
        // detail cells
        const attributes = results[i].itemattributes;
        for (let j = 0; j < columns.length; j++) {
          if (columns[j].type !== TableColumnType.DETAIL) {
            continue;
          }
          const attributeKey = columns[j].attributeId;
          const attribute = this.getAttribute(attributes, attributeKey);
          if (attribute !== undefined) {
            if (attribute.iconUrl && attribute.defaultNavigationTarget) {
              rows[i].cells.push({
                p13NColumnName: this.createP13NColumnName(attributeKey),
                attributeId: attributeKey,
                value: this.formatCellText(attribute.value, initialValueUnicode),
                // dash
                isHighlighted: attribute.whyfound || false,
                tooltip: this.formatCellText(attribute.tooltip, ""),
                // preserve SearchResultFormatter defined tooltip (hierarchical attribute of DWC)
                icon: attribute.iconUrl,
                defaultNavigationTarget: attribute.defaultNavigationTarget,
                type: TableColumnType.DETAIL
              });
            } else if (attribute.iconUrl) {
              rows[i].cells.push({
                p13NColumnName: this.createP13NColumnName(attributeKey),
                attributeId: attributeKey,
                value: this.formatCellText(attribute.value, initialValueUnicode),
                // dash
                isHighlighted: attribute.whyfound || false,
                // tooltip: this.formatCellText(attribute.tooltip, ""), // ignored, UI sets tooltip by setupEllipsisAndTooltip
                icon: attribute.iconUrl,
                type: TableColumnType.DETAIL
              });
            } else if (attribute.defaultNavigationTarget) {
              rows[i].cells.push({
                p13NColumnName: this.createP13NColumnName(attributeKey),
                attributeId: attributeKey,
                value: this.formatCellText(attribute.value, initialValueUnicode),
                // dash
                isHighlighted: attribute.whyfound || false,
                tooltip: this.formatCellText(attribute.tooltip, ""),
                // preserve SearchResultFormatter defined tooltip (hierarchical attribute of DWC)
                defaultNavigationTarget: attribute.defaultNavigationTarget,
                type: TableColumnType.DETAIL
              });
            } else {
              rows[i].cells.push({
                p13NColumnName: this.createP13NColumnName(attributeKey),
                attributeId: attributeKey,
                value: this.formatCellText(attribute.value, initialValueUnicode),
                // dash
                isHighlighted: attribute.whyfound || false,
                // tooltip: this.formatCellText(attribute.tooltip, ""), // ignored, UI sets tooltip by setupEllipsisAndTooltip
                type: TableColumnType.DETAIL
              });
            }
          } else {
            rows[i].cells.push({
              p13NColumnName: this.createP13NColumnName(attributeKey),
              attributeId: attributeKey,
              value: this.formatCellText("", initialValueUnicode),
              // dash
              isHighlighted: false,
              // tooltip: this.formatCellText("", ""), // ignored, UI sets tooltip by setupEllipsisAndTooltip
              type: TableColumnType.DETAIL
            });
          }
        }

        // related apps cell
        if (results[i].navigationObjects !== undefined && results[i].navigationObjects.length > 0) {
          rows[i].cells.push({
            p13NColumnName: this.createP13NColumnName(TableColumnType.RELATED_APPS),
            value: i18n.getText("intents"),
            isHighlighted: false,
            // tooltip: i18n.getText("intents"), // ignored, UI sets tooltip by setupEllipsisAndTooltip
            navigationObjects: results[i].navigationObjects || [],
            type: TableColumnType.RELATED_APPS
          });
        }

        // custom table columns (DWC)
        if (this.model?.config?.extendTableColumn && typeof this.model?.config?.extendTableColumn["assembleCell"] === "function") {
          const data = {
            id: results[i].attributesMap["id"] || results[i].attributesMap["ID"],
            favorites_user_id: results[i].attributesMap["favorites_user_id"] || results[i].attributesMap["FAVORITES_USER_ID"]
          };
          if (typeof data.id !== "undefined" && typeof data.favorites_user_id !== "undefined") {
            // response (see 'responseAttributes') might not contain these attributes
            try {
              const cell = this.model?.config?.extendTableColumn["assembleCell"](data);
              cell.p13NColumnName = this.createP13NColumnName(TableColumnType.EXTEND);
              cell.value = this.formatCellText(cell.value, initialValueUnicode); // dash
              cell.isHighlighted = false;
              // cell.tooltip = this.formatCellText(cell.value, initialValueUnicode); // ignored, UI sets tooltip by setupEllipsisAndTooltip
              cell.type = TableColumnType.EXTEND;
              rows[i].cells.push(cell);
            } catch (error) {
              this.errorHandler.onError(error);
            }
          }
        }

        // title description cell
        if (results[i].titleDescription !== undefined) {
          rows[i].cells.unshift({
            p13NColumnName: this.createP13NColumnName(TableColumnType.TITLE_DESCRIPTION),
            value: this.formatCellText(results[i]?.titleDescription || "", initialValueUnicode),
            // dash
            isHighlighted: results[i]?.isTitleDescriptionHighlighted || false,
            //tooltip: // ignored, SearchResultFormatter doesn't provide
            type: TableColumnType.TITLE_DESCRIPTION
          });
        }

        // title cell
        if (results[i].title !== undefined) {
          rows[i].cells.unshift({
            p13NColumnName: this.createP13NColumnName(TableColumnType.TITLE),
            value: this.formatCellText(results[i]?.title || "", initialValueUnicode),
            // dash
            isHighlighted: results[i]?.isTitleHighlighted || false,
            //tooltip: // ignored, SearchResultFormatter doesn't provide
            // uri: results[i]["uri"], // ToDo: obsolete?
            titleNavigation: results[i]?.titleNavigation || undefined,
            titleIconUrl: results[i]?.titleIconUrl || "",
            titleInfoIconUrl: results[i]?.titleInfoIconUrl || "",
            type: TableColumnType.TITLE
          });
        }
      }
      return rows;
    }
    isSingleAttributeInDetail(attributeId) {
      try {
        // TODO: check in result metadata, not datasource metadata
        const usage = this.model?.getDataSource()?.getAttributeMetadata(attributeId)["usage"];
        if (usage && usage.Detail && usage.Detail.displayOrder >= 0) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        this.logger.warning("Attribute " + attributeId + " is not found in metadata.", error);
        return false;
      }
    }
    isGroupAttributeInDetail(attributeId) {
      try {
        // TODO: check in result metadata, not datasource metadata
        const usage = this.model?.getDataSource()?.getAttributeGroupMetadata(attributeId)["usage"];
        if (usage && usage.Detail && usage.Detail.displayOrder >= 0) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        this.logger.warning("Attribute " + attributeId + " is not found in group metadata.", error);
        return false;
      }
    }
    createP13NColumnName(key) {
      // possible key is TableColumnType or attribute id
      const p13NColumnNamePrefix = "TABLE-COLUMN-";
      return p13NColumnNamePrefix + key;
    }
    getAttribute(attributes, key) {
      for (let i = 0; i < attributes.length; i++) {
        if (attributes[i].key === key) {
          return attributes[i];
        }
      }
      return undefined;
    }
    getConfigWidth(column) {
      // TODO: refactoring initial column width, provide general column width configuration
      if (column?.type === TableColumnType.TITLE && this.getColumnWidthInPixel(this?.model?.config?.titleColumnWidth)) {
        return this.getColumnWidthInPixel(this?.model?.config?.titleColumnWidth) + "px";
      }
      if (column?.type === TableColumnType.EXTEND && this.getColumnWidthInPixel(this?.model?.config?.extendTableColumn?.column?.width)) {
        return this.getColumnWidthInPixel(this?.model?.config?.extendTableColumn?.column?.width) + "px";
      }
      return undefined;
    }
    getColumnWidthInPixel(valueString) {
      try {
        let value = undefined;

        // digits end with px
        if (/^\d+(px)/.test(valueString)) {
          value = parseInt(valueString, 10);
        }

        // digits end with em or rem
        if (/^\d+(rem)/.test(valueString)) {
          value = new SearchLayoutResponsive()?.convertRemToPixel(parseInt(valueString, 10));
          value = parseInt(value);
        }
        if (value === undefined) {
          return undefined;
        }
        if (value > 0) {
          return value;
        }
        console.warn("Invalid Value: Column width should be defined as a positive integer in pixels (px) or rem units. Example: '10rem'.");
        return undefined;
      } catch (error) {
        this.logger.warning("Invalid Value: Column width should be defined as a positive integer in pixels (px) or rem units. Example: '10rem'.", error);
        return undefined;
      }
    }
    formatCellText(value, defaultValue) {
      if (typeof value === "string" && value.trim().length > 0) {
        return value;
      }
      return defaultValue;
    }
  }
  return SearchResultTableFormatter;
});
})();