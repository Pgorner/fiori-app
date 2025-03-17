/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["./BaseContainer", "./utils/Device"], function (__BaseContainer, ___utils_Device) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BaseContainer = _interopRequireDefault(__BaseContainer);
  const DeviceType = ___utils_Device["DeviceType"];
  /**
   *
   * Container class for managing and storing News and Pages.
   *
   * @extends sap.cux.home.BaseContainer
   *
   * @author SAP SE
   * @version 0.0.1
   * @since 1.121
   *
   * @internal
   * @experimental Since 1.121
   * @public
   *
   * @alias sap.cux.home.NewsAndPagesContainer
   */
  const NewsAndPagesContainer = BaseContainer.extend("sap.cux.home.NewsAndPagesContainer", {
    metadata: {
      properties: {
        /**
         * Color Personalizations for Spaces & Pages
         */
        colorPersonalizations: {
          type: "array",
          group: "Misc",
          defaultValue: [],
          visibility: "hidden"
        },
        /**
         * Icon Personalizations for Spaces & Pages
         */
        iconPersonalizations: {
          type: "array",
          group: "Misc",
          defaultValue: [],
          visibility: "hidden"
        },
        /**
         * News feed visibility flag
         */
        newsFeedVisibility: {
          type: "boolean",
          group: "Misc",
          defaultValue: true,
          visibility: "hidden"
        }
      }
    },
    renderer: {
      ...BaseContainer.renderer,
      apiVersion: 2
    },
    /**
     * Constructor for the new News and Pages container.
     *
     * @param {string} [id] ID for the new control, generated automatically if an ID is not provided
     * @param {object} [settings] Initial settings for the new control
     */
    constructor: function _constructor(id, settings) {
      BaseContainer.prototype.constructor.call(this, id, settings);
      this.panelLoaded = {};
    },
    /**
     * Init lifecycle method
     *
     * @private
     * @override
     */
    init: function _init() {
      BaseContainer.prototype.init.call(this);
      this.panelLoaded = {};
      this.setProperty("layout", "Horizontal");
    },
    onBeforeRendering: function _onBeforeRendering() {
      BaseContainer.prototype.onBeforeRendering.call(this);
      const aContent = this.getContent();
      aContent.forEach(oContent => {
        void oContent.getData();
      });
    },
    /**
     * Sets property value for colorPersonalization.
     * Overridden to update cached personalizations.
     *
     * @public
     * @override
     * @returns {NewsAndPagesContainer} the container for chaining
     */
    setColorPersonalizations: function _setColorPersonalizations(personalizations) {
      const existingPers = this.getProperty("colorPersonalizations") || [];
      const updatedPers = existingPers.concat(personalizations);
      this.setProperty("colorPersonalizations", updatedPers);
      this.getContent().forEach(oContent => {
        if (oContent.getMetadata().getName() === "sap.cux.home.PagePanel") {
          oContent.applyColorPersonalizations(updatedPers);
        }
      });
      return this;
    },
    /**
     * Sets property value for iconPersonalization.
     * Overridden to update cached personalizations.
     *
     * @public
     * @override
     * @returns {NewsAndPagesContainer} the container for chaining
     */
    setIconPersonalizations: function _setIconPersonalizations(personalizations) {
      const existingPers = this.getProperty("iconPersonalizations") || [];
      const updatedPers = existingPers.concat(personalizations);
      this.setProperty("iconPersonalizations", updatedPers);
      this.getContent().forEach(oContent => {
        if (oContent.getMetadata().getName() === "sap.cux.home.PagePanel") {
          oContent.applyIconPersonalizations(updatedPers);
        }
      });
      return this;
    },
    newsVisibilityChangeHandler: function _newsVisibilityChangeHandler(personalization) {
      const aContent = this.getContent();
      aContent.forEach(oContent => {
        if (oContent.getMetadata().getName() === "sap.cux.home.NewsPanel") {
          let newsPanel = oContent;
          if (personalization.isNewsFeedVisible) {
            this.setProperty("newsFeedVisibility", true);
            this._getPanelContentWrapper(newsPanel).setVisible(true);
          } else {
            this.setProperty("newsFeedVisibility", false);
            this._getPanelContentWrapper(newsPanel).setVisible(false);
          }
        }
      });
    },
    newsPersonalization: function _newsPersonalization(personalizations) {
      const aContent = this.getContent();
      aContent.forEach(oContent => {
        if (oContent.getMetadata().getName() === "sap.cux.home.NewsPanel") {
          let newsPanel = oContent;
          const newsFeedVisibility = Boolean(this.getProperty("newsFeedVisibility"));
          const url = personalizations.newsFeedURL;
          newsPanel.setProperty("url", personalizations.newsFeedURL);
          newsPanel.setProperty("showCustom", personalizations.showCustomNewsFeed);
          newsPanel.setProperty("customFeedKey", personalizations.customNewsFeedKey);
          newsPanel.setProperty("customFileName", personalizations.customNewsFeedFileName);
          if (newsFeedVisibility) {
            this._getPanelContentWrapper(newsPanel).setVisible(true);
            const customFeedKey = String(newsPanel.getProperty("customFeedKey"));
            const showCustom = Boolean(newsPanel.getProperty("showCustom"));
            if (showCustom && customFeedKey) {
              newsPanel.setProperty("newsAvailable", true);
              void newsPanel.setCustomNewsFeed(customFeedKey);
            } else if (!showCustom && url) {
              void newsPanel.setURL(url);
            } else {
              this._getPanelContentWrapper(newsPanel).setVisible(false);
              this.setProperty("newsFeedVisibility", false);
            }
          }
        }
      });
    },
    panelLoadedFn: function _panelLoadedFn(sPanelType, oVal) {
      // same issue of panelwrapper not available at this time
      const aContent = this.getContent();
      aContent.forEach(oContent => {
        if (oContent.getMetadata().getName() === "sap.cux.home.PagePanel") {
          this.pagePanel = oContent;
        } else if (oContent.getMetadata().getName() === "sap.cux.home.NewsPanel") {
          this.newsPanel = oContent;
        }
      });
      this.panelLoaded[sPanelType] = oVal;
      this.adjustLayout();
    },
    adjustStyleLayout: function _adjustStyleLayout(bIsNewsTileVisible) {
      const sDeviceType = this.getDeviceType();
      const newsContentWrapper = this.newsPanel ? this._getPanelContentWrapper(this.newsPanel) : undefined;
      const pagesContentWrapper = this.pagePanel ? this._getPanelContentWrapper(this.pagePanel) : undefined;
      const containerWrapper = this._getInnerControl();
      if (sDeviceType === DeviceType.Desktop || sDeviceType === DeviceType.LargeDesktop) {
        if (bIsNewsTileVisible) {
          pagesContentWrapper?.setWidth("50vw");
        }
        containerWrapper.setAlignItems("Center");
        containerWrapper.setDirection("Row");
        newsContentWrapper?.setWidth("100%");
        newsContentWrapper?.addStyleClass("sapMNewsFlex");
      } else if (sDeviceType === DeviceType.Tablet) {
        pagesContentWrapper?.setWidth("100%");
        newsContentWrapper?.setWidth("calc(100vw - 64px)");
        containerWrapper.setAlignItems("Baseline");
        containerWrapper.setDirection("Column");
      }
      if (pagesContentWrapper) {
        setTimeout(this.pagePanel.attachResizeHandler.bind(this.pagePanel, bIsNewsTileVisible, this.getDomRef()?.clientWidth || 0, pagesContentWrapper, containerWrapper));
      }
    },
    /**
     * Adjusts the layout of the all panels in the container.
     *
     * @private
     * @override
     */
    adjustLayout: function _adjustLayout() {
      if (this.pagePanel && this.newsPanel && this._getPanelContentWrapper(this.newsPanel).getVisible()) {
        if (this.panelLoaded["Page"]?.loaded && this.panelLoaded["News"]?.loaded) {
          // If Both Panels are available wait for both panels are successfully loaded to apply styling
          const bIsNewsTileVisible = true;
          this.adjustStyleLayout(bIsNewsTileVisible);
        } else if (this.panelLoaded["News"]?.loaded === false) {
          // In case News Panel fails to load remove the panel and apply styles for page to take full width
          const bIsNewsTileVisible = false;
          this.removeContent(this.newsPanel);
          this.adjustStyleLayout(bIsNewsTileVisible);
        } else if (this.panelLoaded["Page"]?.loaded === false) {
          this.removeContent(this.pagePanel);
        }
      } else if (this.pagePanel && this.panelLoaded["Page"]?.loaded) {
        // If News Panel is not present apply styles for page to take full width
        const bIsNewsTileVisible = false;
        this.adjustStyleLayout(bIsNewsTileVisible);
      }
    }
  });
  return NewsAndPagesContainer;
});
//# sourceMappingURL=NewsAndPagesContainer-dbg-dbg.js.map
