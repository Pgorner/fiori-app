/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["./SearchResultListItem"], function (__SearchResultListItem) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const SearchResultListItem = _interopRequireDefault(__SearchResultListItem);
  /**
   * @namespace sap.esh.search.ui.controls
   */
  const CustomSearchResultListItem = SearchResultListItem.extend("sap.esh.search.ui.controls.CustomSearchResultListItem", {
    renderer: {
      apiVersion: 2
    },
    metadata: {
      properties: {
        content: {
          type: "sap.esh.search.ui.controls.CustomSearchResultListItemContent"
        }
      }
    },
    constructor: function _constructor(sId, settings) {
      SearchResultListItem.prototype.constructor.call(this, sId, settings);
    },
    setupCustomContentControl: function _setupCustomContentControl() {
      const content = this.getProperty("content");
      content.setTitle(this.getProperty("title"));
      content.setTitleUrl(this.getProperty("titleUrl"));
      content.setType(this.getProperty("type"));
      content.setImageUrl(this.getProperty("imageUrl"));
      content.setAttributes(this.getProperty("attributes"));
      // content.setIntents(this.getIntents());
    },
    renderer: function _renderer(oRm, oControl) {
      oControl.setupCustomContentControl();
      // eslint-disable-next-line prefer-rest-params
      SearchResultListItem.prototype.getRenderer.call(this).render(arguments);
    },
    // after rendering
    onAfterRendering: function _onAfterRendering() {
      SearchResultListItem.prototype.onAfterRendering.call(this);
      this.getProperty("content").getTitleVisibility();
    }
  });
  return CustomSearchResultListItem;
});
})();