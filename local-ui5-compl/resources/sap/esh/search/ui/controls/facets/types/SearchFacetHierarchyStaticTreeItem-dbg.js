/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * This control is identical to sap.m.CustomTreeItem but adds a new property selectLine
 * which can be used to mark the CustromTreemItem as selected. Changing the property triggers
 * a rerender and therefor also onAfterRendering. In onAfterRendering the css class for selection
 * sapMLIBSelected is added/removed.
 *
 * (This is control is needed because the selected property of CustomTreeItem cannot be used)
 */
sap.ui.define(["../../../tree/TreeViewItem"], function (__TreeViewItem) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const TreeViewItem = _interopRequireDefault(__TreeViewItem);
  /**
   * @namespace sap.esh.search.ui.controls
   */
  const SearchFacetHierarchyStaticTreeItem = TreeViewItem.extend("sap.esh.search.ui.controls.SearchFacetHierarchyStaticTreeItem", {
    renderer: {
      apiVersion: 2
    },
    metadata: {
      properties: {
        selectLine: {
          type: "boolean",
          defaultValue: false
        }
      }
    },
    constructor: function _constructor(sId, options) {
      TreeViewItem.prototype.constructor.call(this, sId, options);
      const delegate = {
        onAfterRendering: () => {
          const domRef = this.getDomRef();
          if (this.getProperty("selectLine")) {
            if (!domRef.classList.contains("sapMLIBSelected")) {
              domRef.classList.add("sapMLIBSelected");
            }
          } else {
            if (domRef.classList.contains("sapMLIBSelected")) {
              domRef.classList.remove("sapMLIBSelected");
            }
          }
        }
      };
      this.addEventDelegate(delegate, this);
    }
  });
  return SearchFacetHierarchyStaticTreeItem;
});
})();