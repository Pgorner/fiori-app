/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/m/library", "./BaseNewsItem"], function (sap_m_library, __BaseNewsItem) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const URLHelper = sap_m_library["URLHelper"];
  const BaseNewsItem = _interopRequireDefault(__BaseNewsItem);
  /**
   *
   * Class for managing and storing News items.
   *
   * @extends sap.cux.home.BaseNewsItem
   *
   * @author SAP SE
   * @version 0.0.1
   * @since 1.121
   *
   * @internal
   * @experimental Since 1.121
   * @private
   *
   * @alias sap.cux.home.NewsItem
   */
  const NewsItem = BaseNewsItem.extend("sap.cux.home.NewsItem", {
    metadata: {
      library: "sap.cux.home",
      properties: {
        /**
         * The URL of the news item. Clicking on the item navigates to this URL.
         */
        url: {
          type: "string",
          group: "Misc",
          defaultValue: ""
        }
      }
    },
    constructor: function _constructor(id, settings) {
      BaseNewsItem.prototype.constructor.call(this, id, settings);
    },
    /**
     * Init lifecycle method
     *
     * @private
     * @override
     */
    init: function _init() {
      BaseNewsItem.prototype.init.call(this);
      this._oTile.attachPress(this, this.pressNewsItem.bind(this));
    },
    /**
     * Sets the URL of the news item.
     * @param {string} sUrl - The URL of the news item.
     */
    setUrl: function _setUrl(sUrl) {
      this._oTile.setUrl(sUrl);
      return this.setProperty("url", sUrl, true);
    },
    /**
     * Gets the URL of the news item.
     * @param {string} sUrl - The URL of the news item.
     */
    getUrl: function _getUrl() {
      return this.getProperty("url");
    },
    /**
     * Handles the press event on the news item, redirecting the user to the specified URL.
     */
    pressNewsItem: function _pressNewsItem() {
      URLHelper.redirect(this.getUrl(), true);
    }
  });
  return NewsItem;
});
//# sourceMappingURL=NewsItem-dbg-dbg.js.map
