/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define([], function () {
  "use strict";

  class SearchResultSetItemMemory {
    items = {};
    reset() {
      this.items = {};
    }
    getItem(key) {
      let item = this.items[key];
      if (!item) {
        item = {};
        this.items[key] = item;
      }
      return item;
    }
    setExpanded(key, expanded) {
      const item = this.getItem(key);
      item.expanded = expanded;
    }
    getExpanded(key) {
      return this.getItem(key).expanded;
    }
  }
  return SearchResultSetItemMemory;
});
})();