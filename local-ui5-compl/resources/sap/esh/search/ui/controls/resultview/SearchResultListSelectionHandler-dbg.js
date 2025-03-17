/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["sap/ui/base/Object"], function (Object) {
  "use strict";

  /**
   * @namespace sap.esh.search.ui.controls
   */
  const SearchResultListSelectionHandler = Object.extend("sap.esh.search.ui.controls.SearchResultListSelectionHandler", {
    isMultiSelectionAvailable: function _isMultiSelectionAvailable() {
      return false;
    },
    actionsForDataSource: function _actionsForDataSource() {
      return [];
    }
  });
  return SearchResultListSelectionHandler;
});
})();