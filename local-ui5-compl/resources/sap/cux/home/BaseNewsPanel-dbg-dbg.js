/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/m/Button", "sap/m/FlexItemData", "sap/m/IllustratedMessage", "sap/m/VBox", "sap/ui/layout/VerticalLayout", "./BasePanel", "./utils/Constants"], function (Button, FlexItemData, IllustratedMessage, VBox, VerticalLayout, __BasePanel, ___utils_Constants) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BasePanel = _interopRequireDefault(__BasePanel);
  const SETTINGS_PANELS_KEYS = ___utils_Constants["SETTINGS_PANELS_KEYS"];
  /**
   *
   * Base Panel class for managing and storing News.
   *
   * @extends sap.cux.home.BasePanel
   *
   * @author SAP SE
   * @version 0.0.1
   * @since 1.121
   *
   * @abstract
   * @internal
   * @experimental Since 1.121
   * @private
   *
   * @alias sap.cux.home.BaseNewsPanel
   */
  const BaseNewsPanel = BasePanel.extend("sap.cux.home.BaseNewsPanel", {
    metadata: {
      library: "sap.cux.home",
      aggregations: {
        /**
         * Holds the news aggregation
         */
        newsItems: {
          type: "sap.cux.home.BaseNewsItem",
          singularName: "newsItem",
          multiple: true
        }
      }
    },
    constructor: function _constructor(id, settings) {
      BasePanel.prototype.constructor.call(this, id, settings);
    },
    /**
     * Init lifecycle method
     *
     * @private
     * @override
     */
    init: function _init() {
      BasePanel.prototype.init.call(this);
      this.newsVerticalLayout = new VerticalLayout(`${this.getId()}-newsContent`, {
        content: [this.generateErrorMessage()],
        layoutData: new FlexItemData({
          id: `${this.getId()}-flexItemdata`,
          order: 0,
          growFactor: 1,
          maxWidth: "39.75rem"
        })
      });
      this._addContent(this.newsVerticalLayout);
    },
    /**
     * Generates app wrapper for displaying apps.
     * @private
     * @returns The generated apps wrapper.
     */
    getNewsWrapper: function _getNewsWrapper() {
      return this.newsVerticalLayout;
    },
    /**
     * Generates the error message wrapper with illustrated message.
     * @private
     * @returns Wrapper with illustrated message.
     */
    generateErrorMessage: function _generateErrorMessage() {
      if (!this.errorCard) {
        const oErrorMessage = new IllustratedMessage(`${this.getId()}-errorMessage`, {
          illustrationSize: "Spot",
          illustrationType: "sapIllus-SleepingBell",
          title: this._i18nBundle.getText("noNewsTitle"),
          description: this._i18nBundle.getText("noNewsDescription"),
          additionalContent: [new Button(`${this.getId()}-idManageNewsBtn`, {
            text: this._i18nBundle.getText("editLinkNews"),
            tooltip: this._i18nBundle.getText("editLinkNews"),
            type: "Emphasized",
            press: this.handleEditNews.bind(this)
          })]
        });
        this.errorCard = new VBox(`${this.getId()}-errorCard`, {
          wrap: "Wrap",
          backgroundDesign: "Solid",
          items: [oErrorMessage],
          visible: false
        });
      }
      return this.errorCard;
    },
    /**
     * Handles the edit news event.
     * Opens the news dialog for managing news data.
     * @private
     */
    handleEditNews: function _handleEditNews() {
      const parentContainer = this.getParent();
      parentContainer?._getLayout().openSettingsDialog(SETTINGS_PANELS_KEYS.NEWS);
    }
  });
  return BaseNewsPanel;
});
//# sourceMappingURL=BaseNewsPanel-dbg-dbg.js.map
