/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/m/GenericTile", "sap/m/NewsContent", "sap/m/TileContent", "sap/ui/core/Element", "sap/ui/core/Lib"], function (GenericTile, NewsContent, TileContent, Element, Lib) {
  "use strict";

  /**
   *
   * Base class for managing and storing News items.
   *
   * @extends sap.ui.core.Element
   *
   * @author SAP SE
   * @version 0.0.1
   * @since 1.121
   *
   * @internal
   * @experimental Since 1.121
   * @private
   *
   * @alias sap.cux.home.BaseNewsItem
   */
  const BaseNewsItem = Element.extend("sap.cux.home.BaseNewsItem", {
    metadata: {
      library: "sap.cux.home",
      properties: {
        /**
         * The image URL of the news.
         */
        imageUrl: {
          type: "string",
          group: "Misc"
        },
        /**
         * Title of the news
         */
        title: {
          type: "string",
          group: "Misc"
        },
        /**
         * Subtitle of the app
         */
        subTitle: {
          type: "string",
          group: "Misc"
        },
        /**
         * Footer of the app
         */
        footer: {
          type: "string",
          group: "Misc"
        }
      }
    },
    constructor: function _constructor(id, settings) {
      Element.prototype.constructor.call(this, id, settings);
    },
    /**
     * Init lifecycle method
     *
     * @private
     * @override
     */
    init: function _init() {
      Element.prototype.init.call(this);
      this._i18nBundle = Lib.getResourceBundleFor("sap.cux.home.i18n");
      if (!this._oTile) {
        this.createTile();
      }
    },
    /**
     * Sets the image URL for the news item.
     * @param {string} sUrl - The URL of the image.
     */
    setImageUrl: function _setImageUrl(sUrl) {
      const imageUrl = sUrl;
      this._oTile.setBackgroundImage(imageUrl);
      return this.setProperty("imageUrl", imageUrl, true);
    },
    /**
     * Sets the subTitle of the news item.
     * @param {string} sText - The subTitle of the news item.
     */
    setSubTitle: function _setSubTitle(sText) {
      this._oTile.getTileContent()[0].getContent().setSubheader(sText);
      return this.setProperty("subTitle", sText, true);
    },
    /**
     * Sets the title of the news item.
     * @param {string} sText - The Title of the news item.
     */
    setTitle: function _setTitle(sText) {
      this._oTile.getTileContent()[0].getContent().setContentText(sText);
      return this.setProperty("title", sText, true);
    },
    /**
     * Sets the footer of the news item.
     * @param {string} sText - The footer of the news item.
     */
    setFooter: function _setFooter(sText) {
      this._oTile.getTileContent()[0].setFooter(sText);
      return this.setProperty("footer", sText, true);
    },
    /**
     * Retrieves the tile control associated with the news item.
     * If the tile control does not exist, it is created.
     * @returns {sap.m.Tile} The tile control.
     */
    getTile: function _getTile() {
      if (!this._oTile) {
        this.createTile();
      }
      return this._oTile;
    },
    /**
     * Creates the tile control associated with the news item.
     * @private
     */
    createTile: function _createTile() {
      this._oTile = new GenericTile({
        mode: "ArticleMode",
        frameType: "Stretch",
        backgroundImage: this.getImageUrl(),
        tileContent: [new TileContent("", {
          footer: this.getFooter(),
          content: new NewsContent("", {
            contentText: this.getTitle(),
            subheader: this.getSubTitle()
          })
        })]
      });
    }
  });
  return BaseNewsItem;
});
//# sourceMappingURL=BaseNewsItem-dbg-dbg.js.map
