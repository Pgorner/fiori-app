/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define([], function () {
  "use strict";

  /**
   * @namespace sap.esh.search.ui
   */

  class SearchCompositeControlDragDropConfig {
    eshComp;
    dragDropConfig;
    constructor(settings) {
      this.eshComp = settings.eshComp;
    }
    assignDragDropConfig() {
      let dragDropConfig = this.getDragDropConfig();
      if (dragDropConfig.length === 0) {
        dragDropConfig = this.dragDropConfig || [];
      }
      if (dragDropConfig.length > 0) {
        let controlToAssignDragDropConfig;
        switch (this.eshComp.getResultViewType()) {
          case "appSearchResult":
            // no drag&drop support
            break;
          case "searchResultList":
            if (this.eshComp.searchResultList) {
              controlToAssignDragDropConfig = this.eshComp.searchResultList;
            }
            break;
          case "searchResultTable":
            if (this.eshComp.searchResultTable) {
              controlToAssignDragDropConfig = this.eshComp.searchResultTable;
            }
            break;
          case "searchResultGrid":
            if (this.eshComp.searchResultGrid) {
              controlToAssignDragDropConfig = this.eshComp.searchResultGrid;
            }
            break;
          // for other cases do nothing (empty or not table/list/grid)
        }
        // re-assign D&D config
        if (controlToAssignDragDropConfig) {
          for (const dragDropConfigItem of dragDropConfig) {
            controlToAssignDragDropConfig.addDragDropConfig(dragDropConfigItem);
          }
        }
      }
    }
    addDragDropConfig(oDragDropConfig) {
      // oDragDropConfig cannot be assigned to multiple controls in parallel.
      // -> we need to (re-)assign it to the active result view
      switch (this.eshComp.getResultViewType()) {
        case "appSearchResult":
          // no drag&drop support
          break;
        case "searchResultList":
          if (this.eshComp.searchResultList) {
            this.eshComp.searchResultList.addDragDropConfig(oDragDropConfig);
            this.dragDropConfig = this.getDragDropConfig();
            return this.eshComp.searchResultList;
          }
          break;
        case "searchResultTable":
          if (this.eshComp.searchResultTable) {
            this.eshComp.searchResultTable.addDragDropConfig(oDragDropConfig);
            this.dragDropConfig = this.getDragDropConfig();
            return this.eshComp.searchResultTable;
          }
          break;
        case "searchResultGrid":
          if (this.eshComp.searchResultGrid) {
            this.eshComp.searchResultGrid.addDragDropConfig(oDragDropConfig);
            this.dragDropConfig = this.getDragDropConfig();
            return this.eshComp.searchResultGrid;
          }
          break;
        case "":
          this.dragDropConfig = [oDragDropConfig];
      }
      return this;
    }
    insertDragDropConfig(oDragDropConfig, iIndex) {
      switch (this.eshComp.getResultViewType()) {
        case "appSearchResult":
          // no drag&drop support
          break;
        case "searchResultList":
          if (this.eshComp.searchResultList) {
            this.eshComp.searchResultList.insertDragDropConfig(oDragDropConfig, iIndex);
            this.dragDropConfig = this.getDragDropConfig();
            return this.eshComp.searchResultList;
          }
          break;
        case "searchResultTable":
          if (this.eshComp.searchResultTable) {
            this.eshComp.searchResultTable.insertDragDropConfig(oDragDropConfig, iIndex);
            this.dragDropConfig = this.getDragDropConfig();
            return this.eshComp.searchResultTable;
          }
          break;
        case "searchResultGrid":
          if (this.eshComp.searchResultGrid) {
            this.eshComp.searchResultGrid.insertDragDropConfig(oDragDropConfig, iIndex);
            this.dragDropConfig = this.getDragDropConfig();
            return this.eshComp.searchResultGrid;
          }
          break;
        case "":
          setTimeout(() => this.insertDragDropConfig(oDragDropConfig, iIndex), 500);
        // ToDo: Try to prevent setTimeout
      }
      return this;
    }
    indexOfDragDropConfig(oDragDropConfig) {
      if (this.eshComp.searchResultList?.getDragDropConfig() && this.eshComp.searchResultList?.getDragDropConfig().length > 0) {
        return this.eshComp.searchResultList.indexOfDragDropConfig(oDragDropConfig);
      } else if (this.eshComp.searchResultTable?.getDragDropConfig() && this.eshComp.searchResultTable?.getDragDropConfig().length > 0) {
        return this.eshComp.searchResultTable.indexOfDragDropConfig(oDragDropConfig);
      } else if (this.eshComp.searchResultGrid?.getDragDropConfig() && this.eshComp.searchResultGrid?.getDragDropConfig().length > 0) {
        return this.eshComp.searchResultGrid.indexOfDragDropConfig(oDragDropConfig);
      } else {
        return -1;
      }
    }
    getDragDropConfig() {
      if (this.eshComp.searchResultList?.getDragDropConfig() && this.eshComp.searchResultList?.getDragDropConfig().length > 0) {
        return this.eshComp.searchResultList.getDragDropConfig();
      } else if (this.eshComp.searchResultTable?.getDragDropConfig() && this.eshComp.searchResultTable?.getDragDropConfig().length > 0) {
        return this.eshComp.searchResultTable.getDragDropConfig();
      } else if (this.eshComp.searchResultGrid?.getDragDropConfig() && this.eshComp.searchResultGrid?.getDragDropConfig().length > 0) {
        return this.eshComp.searchResultGrid.getDragDropConfig();
      } else {
        return [];
      }
    }
    removeDragDropConfig(vDragDropConfig) {
      let dragDropBase = null;
      if (this.eshComp.searchResultList?.getDragDropConfig() && this.eshComp.searchResultList?.getDragDropConfig().length > 0) {
        dragDropBase = this.eshComp.searchResultList.removeDragDropConfig(vDragDropConfig);
        this.dragDropConfig = this.getDragDropConfig();
      } else if (this.eshComp.searchResultTable?.getDragDropConfig() && this.eshComp.searchResultTable?.getDragDropConfig().length > 0) {
        dragDropBase = this.eshComp.searchResultTable.removeDragDropConfig(vDragDropConfig);
        this.dragDropConfig = this.getDragDropConfig();
      } else if (this.eshComp.searchResultGrid?.getDragDropConfig() && this.eshComp.searchResultGrid?.getDragDropConfig().length > 0) {
        dragDropBase = this.eshComp.searchResultGrid.removeDragDropConfig(vDragDropConfig);
        this.dragDropConfig = this.getDragDropConfig();
      } else {
        // do nothing
      }
      return dragDropBase;
    }
    removeAllDragDropConfig() {
      let removedDragDropConfig = [];
      if (this.eshComp.searchResultList?.getDragDropConfig() && this.eshComp.searchResultList?.getDragDropConfig().length > 0) {
        removedDragDropConfig = this.eshComp.searchResultList.removeAllDragDropConfig();
        this.dragDropConfig = this.getDragDropConfig();
      } else if (this.eshComp.searchResultTable?.getDragDropConfig() && this.eshComp.searchResultTable?.getDragDropConfig().length > 0) {
        removedDragDropConfig = this.eshComp.searchResultTable.removeAllDragDropConfig();
        this.dragDropConfig = this.getDragDropConfig();
      } else if (this.eshComp.searchResultGrid?.getDragDropConfig() && this.eshComp.searchResultGrid?.getDragDropConfig().length > 0) {
        removedDragDropConfig = this.eshComp.searchResultGrid.removeAllDragDropConfig();
        this.dragDropConfig = this.getDragDropConfig();
      } else {
        // do nothing;
      }
      return removedDragDropConfig;
    }
    destroyDragDropConfig() {
      let control = this.eshComp;
      if (this.eshComp.searchResultList?.getDragDropConfig() && this.eshComp.searchResultList?.getDragDropConfig().length > 0) {
        control = this.eshComp.searchResultList.destroyDragDropConfig();
      } else if (this.eshComp.searchResultTable?.getDragDropConfig() && this.eshComp.searchResultTable?.getDragDropConfig().length > 0) {
        control = this.eshComp.searchResultTable.destroyDragDropConfig();
      } else if (this.eshComp.searchResultGrid?.getDragDropConfig() && this.eshComp.searchResultGrid?.getDragDropConfig().length > 0) {
        control = this.eshComp.searchResultGrid.destroyDragDropConfig();
      } else {
        // do nothing
      }
      this.dragDropConfig = [];
      return control;
    }
  }
  return SearchCompositeControlDragDropConfig;
});
})();