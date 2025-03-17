/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/m/List", "sap/m/Page", "sap/m/StandardListItem", "sap/m/VBox", "sap/ui/core/Element", "sap/ui/core/EventBus", "./BaseSettingsPanel", "./flexibility/Layout.flexibility", "./KeyUserNewsSettingsPanel", "./KeyUserPagesSettingsPanel", "./NewsPanel", "./PagePanel", "./utils/Constants"], function (List, Page, StandardListItem, VBox, Element, EventBus, __BaseSettingsPanel, ___flexibility_Layoutflexibility, __KeyUserNewsSettingsPanel, __KeyUserPagesSettingsPanel, __NewsPanel, __PagePanel, ___utils_Constants) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  function _catch(body, recover) {
    try {
      var result = body();
    } catch (e) {
      return recover(e);
    }
    if (result && result.then) {
      return result.then(void 0, recover);
    }
    return result;
  }
  const BaseSettingsPanel = _interopRequireDefault(__BaseSettingsPanel);
  const CHANGE_TYPES = ___flexibility_Layoutflexibility["CHANGE_TYPES"];
  const KeyUserNewsSettingsPanel = _interopRequireDefault(__KeyUserNewsSettingsPanel);
  const KeyUserPagesSettingsPanel = _interopRequireDefault(__KeyUserPagesSettingsPanel);
  const NewsPanel = _interopRequireDefault(__NewsPanel);
  const PagePanel = _interopRequireDefault(__PagePanel);
  const KEYUSER_SETTINGS_PANELS_KEYS = ___utils_Constants["KEYUSER_SETTINGS_PANELS_KEYS"];
  /**
   *
   * Class for News & Pages Settings Panel for KeyUser Settings Dialog.
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
   * @alias sap.cux.home.KeyUserNewsPagesSettingsPanel
   */
  const KeyUserNewsPagesSettingsPanel = BaseSettingsPanel.extend("sap.cux.home.KeyUserNewsPagesSettingsPanel", {
    metadata: {
      library: "sap.cux.home"
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
      this.setProperty("key", KEYUSER_SETTINGS_PANELS_KEYS.NEWS_PAGES);
      this.setProperty("title", this._i18nBundle.getText("editNewsPages"));

      // Subscribe to event bus
      this._eventBus = EventBus.getInstance();
      this._eventBus.subscribe("KeyUserChanges", "addNewsPagesChanges", (channelId, eventId, data) => {
        //errorstate is false when import is successful
        const {
          changes
        } = data;
        this.addNewsPagesChanges(changes);
      }, this);

      // setup layout content
      this.addAggregation("content", this.getContent());

      // fired every time on panel navigation
      this.attachPanelNavigated(() => this.loadSettings());
    },
    /**
     * Returns the content for the KeyUser News Pages Settings Panel.
     *
     * @private
     * @returns {VBox} The control containing the KeyUser News Pages Settings Panel content.
     */
    getContent: function _getContent() {
      if (!this.wrapperVBox) {
        this.wrapperVBox = new VBox(`${this.getId()}-wrapperVBox`);
      }
      return this.wrapperVBox;
    },
    /**
     * Load settings for the panel.
     *
     * @private
     */
    loadSettings: function _loadSettings() {
      const associatedPanelId = this.getPanel();
      const associatedPanel = Element.getElementById(associatedPanelId);
      const container = associatedPanel?.getParent();
      container.getContent()?.forEach(panel => {
        if (panel instanceof NewsPanel) {
          this.newsPanel = panel;
          this.wrapperVBox.addItem(this.getNewsSettingsList(panel));
        }
        if (panel instanceof PagePanel) {
          this.pagePanel = panel;
          this.wrapperVBox.addItem(this.getPageSettingsList(panel));
        }
      });
    },
    newsVisibilityChangeHandler: function _newsVisibilityChangeHandler(oEvent) {
      const newsVisibilityCheckBox = oEvent.getParameter("listItem");
      this.newsFeedVisibility = newsVisibilityCheckBox?.getSelected();
      const newsPanel = this._getPanel();
      const newsPageContainer = newsPanel.getParent();
      const layout = newsPageContainer.getParent();
      const keyUserChanges = this.getKeyUserChanges();
      const existingChange = keyUserChanges.find(change => {
        return change.changeSpecificData.changeType === CHANGE_TYPES.NEWS_FEED_VISIBILITY;
      });
      if (!this.newsFeedVisibility && this.newsSettingsPanel) {
        this.newsSettingsPanel.removeUrlMesageStrip();
      }
      if (!existingChange) {
        this.addKeyUserChanges({
          selectorControl: layout,
          changeSpecificData: {
            changeType: CHANGE_TYPES.NEWS_FEED_VISIBILITY,
            content: {
              isNewsFeedVisible: this.newsFeedVisibility
            }
          }
        });
      } else if (existingChange.changeSpecificData.content.isNewsFeedVisible !== this.newsFeedVisibility) {
        existingChange.changeSpecificData.content.isNewsFeedVisible = this.newsFeedVisibility;
      }
    },
    /**
     * Returns News Settings Panel to the content.
     *
     * @private
     * @returns {List} The control containing the News Settings Panel content.
     */
    getNewsSettingsList: function _getNewsSettingsList(panel) {
      const newsPanel = this._getPanel();
      if (!this.newsSettingsList) {
        this.newsSettingsList = new List(`${this.getId()}-news-settings-list`, {
          selectionChange: this.newsVisibilityChangeHandler.bind(this),
          mode: "MultiSelect"
        });
        this.standardListItem = new StandardListItem({
          selected: newsPanel._getContent()[0].getParent().getVisible(),
          // TO-DO: Integrate with keyuser data
          press: this.navigateToNewsSettingsPage.bind(this),
          type: "Navigation",
          title: this._i18nBundle.getText("newsFeed")
        });
        this.newsSettingsList.addItem(this.standardListItem);
        this.newsSettingsList.setAssociation("panel", panel);
      } else {
        if (this.newsFeedVisibility === undefined) {
          this.standardListItem.setSelected(Boolean(newsPanel.getParent()?.getProperty("newsFeedVisibility")) && Boolean(newsPanel.getProperty("newsAvailable")));
        } else {
          this.standardListItem.setSelected(this.newsFeedVisibility);
        }
      }
      return this.newsSettingsList;
    },
    /**
     * Returns Page Settings Panel to the content.
     *
     * @private
     * @returns {List} The control containing the Page Settings Panel content.
     */
    getPageSettingsList: function _getPageSettingsList(panel) {
      if (!this.pageSettingsList) {
        this.pageSettingsList = new List(`${this.getId()}-page-settings-list`, {
          mode: "None",
          items: [new StandardListItem({
            selected: true,
            // TO-DO: Integrate with keyuser data
            press: this.openPageSettingsDialog.bind(this),
            type: "Navigation",
            title: this._i18nBundle.getText("pageGroupHeader")
          })]
        });
        this.pageSettingsList.setAssociation("panel", panel);
      }
      return this.pageSettingsList;
    },
    onNavBack: function _onNavBack(navContainer) {
      navContainer?.back();
      if (!this.standardListItem.getSelected()) {
        this.newsSettingsPanel?.removeUrlMesageStrip();
      }
    },
    /**
     * Adds News Settings Page to the dialog.
     *
     * @private
     */
    navigateToNewsSettingsPage: function _navigateToNewsSettingsPage() {
      const navContainer = this.getParent()?.getNavContainer?.();
      if (!this.newsSettingsPage) {
        this.newsSettingsPanel = new KeyUserNewsSettingsPanel();
        this.newsSettingsPanel.setAssociation("panel", this.newsPanel);
        this.newsSettingsPage = new Page(`${this.getId()}-news-settings-page`, {
          title: this.newsSettingsPanel.getProperty("title"),
          showHeader: true,
          content: this.newsSettingsPanel.getAggregation("content"),
          backgroundDesign: "Transparent",
          showNavButton: true,
          navButtonPress: this.onNavBack.bind(this, navContainer)
        });
      }
      navContainer?.addPage(this.newsSettingsPage);
      navContainer?.to(this.newsSettingsPage);
      this.newsSettingsPanel.firePanelNavigated();
    },
    /**
     * Opens Page Settings Dialog.
     *
     * @private
     */
    openPageSettingsDialog: function _openPageSettingsDialog() {
      if (!this.pageSettingsPanel) {
        this.pageSettingsPanel = new KeyUserPagesSettingsPanel();
        this.pageSettingsPanel.setAssociation("panel", this.pagePanel);
        this.pageSettingsDialog = this.pageSettingsPanel.getAggregation("content")?.[0];
      }
      this.pageSettingsDialog?.open();
      this.pageSettingsPanel?.firePanelNavigated();
    },
    /**
     * Handles Space Page Changes.
     *
     * @private
     * @param {Array<IKeyUserChange>} changes All Key User Changes.
     */
    addNewsPagesChanges: function _addNewsPagesChanges(changes) {
      changes.forEach(change => {
        this.addKeyUserChanges(change);
      });
    },
    isNewsChangesValid: function _isNewsChangesValid() {
      const _this = this;
      return Promise.resolve(_catch(function () {
        return Promise.resolve(_this.newsSettingsPanel?.isValidChanges(_this.standardListItem.getSelected()));
      }, function () {
        return true;
      }));
    },
    onSaveClearChanges: function _onSaveClearChanges() {
      this.newsFeedVisibility = undefined;
      this.newsSettingsPanel?.clearKeyUserChanges();
    },
    onCancelClearKeyUserChanges: function _onCancelClearKeyUserChanges() {
      const newsPanel = this._getPanel();
      this.newsFeedVisibility = undefined;
      this.standardListItem?.setSelected(newsPanel._getContent()[0].getParent().getVisible());
      this.newsSettingsPanel?.clearNewsPanelChanges();
    }
  });
  return KeyUserNewsPagesSettingsPanel;
});
//# sourceMappingURL=KeyUserNewsPagesSettingsPanel-dbg-dbg.js.map
