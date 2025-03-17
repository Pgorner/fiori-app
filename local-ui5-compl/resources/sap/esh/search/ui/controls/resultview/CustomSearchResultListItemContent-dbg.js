/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["sap/ui/base/ManagedObject"], function (ManagedObject) {
  "use strict";

  /*
   * @namespace sap.esh.search.ui.controls
   */
  const CustomSearchResultListItemContent = ManagedObject.extend("sap.esh.search.ui.controls.CustomSearchResultListItemContent", {
    metadata: {
      properties: {
        title: "string",
        titleUrl: "string",
        type: "string",
        imageUrl: "string",
        attributes: {
          type: "object",
          multiple: true
        },
        intents: {
          type: "object",
          multiple: true
        }
      }
    },
    // overwrite this method and return the custom content of the item
    getContent: function _getContent() {
      // should return sap.ui.core.Control or sap.ui.core.Control[]
      return undefined;
    },
    // overwrite the following methods to customize the item
    // show or Hide the Title and Category
    getTitleVisibility: function _getTitleVisibility() {
      return true;
    }
  });
  return CustomSearchResultListItemContent;
});
})();