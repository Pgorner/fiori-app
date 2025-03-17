/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["sap/ui/layout/VerticalLayout"], function (VerticalLayout) {
  "use strict";

  /**
   * @namespace sap.esh.search.ui.controls
   */
  const SearchResultContainer = VerticalLayout.extend("sap.esh.search.ui.controls.SearchResultContainer", {
    renderer: {
      apiVersion: 2
    },
    constructor: function _constructor(sId) {
      VerticalLayout.prototype.constructor.call(this, sId);
      // define group for F6 handling
      this.data("sap-ui-fastnavgroup", "true", true /* write  into DOM */);
      this.addStyleClass("sapUshellSearchResultContainer"); // obsolete
      this.addStyleClass("sapElisaSearchResultContainer");
    },
    getNoResultScreen: function _getNoResultScreen() {
      return this.noResultScreen;
    },
    setNoResultScreen: function _setNoResultScreen(object) {
      this.noResultScreen = object;
    }
  });
  return SearchResultContainer;
});
})();