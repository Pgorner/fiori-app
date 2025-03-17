/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["./i18n", "sap/m/p13n/Popup", "sap/m/p13n/SelectionPanel", "./error/ErrorHandler"], function (__i18n, P13NPopup, P13NPanel, __ErrorHandler) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const i18n = _interopRequireDefault(__i18n);
  const ErrorHandler = _interopRequireDefault(__ErrorHandler); // import merge from "sap/base/util/merge";
  // reference:
  // interface P13NColumn {
  //     name: string; // === TableColumn's p13NColumnName
  //     label: string;
  //     visible: boolean;
  // }

  class SearchResultTablePersonalizer {
    model;
    table;
    p13nPanel;
    p13nPopup;
    constructor(searchModel) {
      this.model = searchModel;
    }
    initialize(table) {
      try {
        this.table = table;

        // create popup
        if (this.p13nPopup === undefined) {
          this.createPopup();
        }
      } catch (error) {
        const errorHandler = ErrorHandler.getInstance();
        errorHandler.onError(error);
      }
    }

    // update table columns by p13n popup columns (ordering and visibility)
    updateTableColumns(isReset) {
      if (isReset) {
        this.model.setTableColumns(this.model.getTableInitialColumns(), true);
      } else {
        const p13NColumns = this.p13nPanel.getP13nData(false);
        const oldColumns = this.model.getTableColumns(false);
        const newColumns = [];
        // loop p13NColumns, then loop oldColumns. Make sure the ordering is correct.
        for (const p13NColumn of p13NColumns) {
          for (const oldColumn of oldColumns) {
            if (oldColumn.p13NColumnName === p13NColumn.name) {
              oldColumn.visible = p13NColumn.visible;
              newColumns.push(oldColumn);
              break;
            }
          }
        }
        this.model.setTableColumns(newColumns, true);
      }
    }

    // update p13n popup columns by personalize state columns or initial columns (ordering and visibility)
    updateP13NColumns(isInitial) {
      const p13NColumns = [];
      let columns = [];
      if (isInitial) {
        columns = this.model.getTableInitialColumns();
      } else {
        columns = this.model.getTableColumns(false);
      }
      for (const column of columns) {
        p13NColumns.push({
          name: column.p13NColumnName,
          label: column.name,
          visible: column.visible
        });
      }
      this.p13nPanel.setP13nData(p13NColumns);
    }
    createPopup() {
      // p13n panel
      this.p13nPanel = new P13NPanel({
        showHeader: false
      });

      // p13n dialog
      this.p13nPopup = new P13NPopup(this.table.getId() + "-personalizer", {
        title: i18n.getText("personalizeTable"),
        panels: [this.p13nPanel],
        warningText: i18n.getText("resetColumns"),
        reset: function () {
          this.updateP13NColumns(true);
        }.bind(this),
        close: function (event) {
          if (event.getParameter("reason") === "Ok") {
            this.updateTableColumns(this.p13nPopup.getResetButton().getEnabled() === false);
            this.table.update();
          }
        }.bind(this)
      });
      this.p13nPopup.addStyleClass("sapUshellSearchResultTablePersonalizationDialog");
    }
    destroyControllerAndDialog() {
      this.p13nPopup.destroyPanels();
      this.p13nPopup.destroy();
    }
    openDialog() {
      this.updateP13NColumns(false);
      this.p13nPopup.open(null);
    }
  }
  return SearchResultTablePersonalizer;
});
})();