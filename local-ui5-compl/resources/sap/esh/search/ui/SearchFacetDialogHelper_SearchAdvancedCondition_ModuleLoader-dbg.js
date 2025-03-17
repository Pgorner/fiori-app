/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["sap/esh/search/ui/SearchFacetDialogHelper", "sap/esh/search/ui/controls/SearchAdvancedCondition"], function (SearchFacetDialogHelper, SearchAdvancedCondition) {
  "use strict";

  /**
   * @namespace sap.esh.search.ui.controls
   */
  class SearchFacetDialogHelper_SearchAdvancedCondition_ModuleLoader {
    constructor() {
      SearchFacetDialogHelper.injectSearchAdvancedCondition(SearchAdvancedCondition);
      SearchAdvancedCondition.injectSearchFacetDialogHelper(SearchFacetDialogHelper);
    }
  }
  return SearchFacetDialogHelper_SearchAdvancedCondition_ModuleLoader;
});
})();