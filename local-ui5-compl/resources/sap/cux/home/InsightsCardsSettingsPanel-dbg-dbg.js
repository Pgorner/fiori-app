/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/insights/ManageCards", "./BaseSettingsPanel", "./utils/Constants"], function (ManageCards, __BaseSettingsPanel, ___utils_Constants) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BaseSettingsPanel = _interopRequireDefault(__BaseSettingsPanel);
  const SETTINGS_PANELS_KEYS = ___utils_Constants["SETTINGS_PANELS_KEYS"];
  /**
   *
   * Class for My Home Insights Cards Settings Panel.
   *
   * @extends BaseSettingsPanel
   *
   * @author SAP SE
   * @version 0.0.1
   * @since 1.121
   *
   * @internal
   * @experimental Since 1.121
   * @private
   *
   * @alias sap.cux.home.InsightsCardsSettingsPanel
   */
  const InsightsCardsSettingsPanel = BaseSettingsPanel.extend("sap.cux.home.InsightsCardsSettingsPanel", {
    constructor: function constructor() {
      BaseSettingsPanel.prototype.constructor.apply(this, arguments);
      this.eventAttached = false;
    },
    /**
     * Init lifecycle method
     *
     * @public
     * @override
     */
    init: function _init() {
      BaseSettingsPanel.prototype.init.call(this);

      //setup panel
      this.setProperty("key", SETTINGS_PANELS_KEYS.INSIGHTS_CARDS);
      this.setProperty("title", this._i18nBundle.getText("insightsCards"));
      this.setProperty("icon", "sap-icon://card");
      this.setProperty("showHeader", false);

      //setup layout content
      this.addAggregation("content", this._getContent());

      //fired every time on panel navigation
      this.attachPanelNavigated(event => {
        const cardId = event.getParameter("context")?.cardId;
        this.manageCardsInstance?.setProperty("cardId", cardId || "");
        if (!this.eventAttached) {
          this.eventAttached = true;
          this.getParent()?.attachAfterClose(() => {
            void this._getPanel()?.renderPanel();
          });
        }
      });
    },
    /**
     * Returns the content for the Insights Cards Settings Panel.
     *
     * @private
     * @returns {Control} The control containing the Insights Cards Settings Panel content.
     */
    _getContent: function _getContent() {
      if (!this.manageCardsInstance) {
        this.manageCardsInstance = new ManageCards();
      }
      return this.manageCardsInstance;
    }
  });
  return InsightsCardsSettingsPanel;
});
//# sourceMappingURL=InsightsCardsSettingsPanel-dbg-dbg.js.map
