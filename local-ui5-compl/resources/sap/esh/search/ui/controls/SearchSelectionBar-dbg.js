/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["../i18n", "sap/m/Text", "sap/m/Toolbar", "sap/m/library"], function (__i18n, Text, Toolbar, sap_m_library) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const i18n = _interopRequireDefault(__i18n);
  const ToolbarDesign = sap_m_library["ToolbarDesign"];
  /**
   * @namespace sap.esh.search.ui.controls
   */
  const SearchSelectionBar = Toolbar.extend("sap.esh.search.ui.controls.SearchSelectionBar", {
    renderer: {
      apiVersion: 2
    },
    constructor: function _constructor(sId) {
      Toolbar.prototype.constructor.call(this, sId);
      this.setProperty("design", ToolbarDesign.Info);
      this.addStyleClass("sapElisaSearchSelectionBar");
      this.selectionText = new Text(this.getId() + "-selectionText", {
        text: {
          parts: [{
            path: "/multiSelectionObjects"
          }, {
            path: "/count"
          }],
          formatter: this.textFormatter.bind(this)
        }
      }).addStyleClass("sapElisaSearchSelectionText");
      this.bindProperty("visible", {
        parts: [{
          path: "/multiSelectionObjects"
        }, {
          path: "/config"
        }],
        formatter: this.visibleFormatter.bind(this)
      }); // hide the toolbar if no selection

      this.addContent(this.selectionText);
    },
    textFormatter: function _textFormatter(selectedObjects, count) {
      // if (selectedObjects.length === 0) {
      //     return "";
      // }
      const selectedCount = selectedObjects.filter(result => result.selected).length;
      return i18n.getText("selectionText", [selectedCount, count]);
    },
    visibleFormatter: function _visibleFormatter(selectedObjects, config) {
      return selectedObjects.length >= config.enableSearchSelectionBarStartingWith;
    }
  });
  return SearchSelectionBar;
});
})();