/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["sap/ui/layout/FixFlex"], function (FixFlex) {
  "use strict";

  /**
   * @namespace sap.esh.search.ui.controls
   */
  const SearchResultPanel = FixFlex.extend("sap.esh.search.ui.controls.SearchResultPanel", {
    renderer: {
      apiVersion: 2
    },
    constructor: function _constructor(sId, mSettings) {
      FixFlex.prototype.constructor.call(this, sId, mSettings);
      // define group for F6 handling
      this.data("sap-ui-fastnavgroup", "true", true /* write  into DOM */);
    }
  });
  return SearchResultPanel;
});
})();