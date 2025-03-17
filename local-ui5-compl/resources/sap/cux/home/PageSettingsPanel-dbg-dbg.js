/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/m/CustomListItem", "sap/m/HBox", "sap/m/List", "sap/m/Panel", "sap/m/SearchField", "sap/m/Text", "sap/m/Title", "sap/m/ToggleButton", "sap/m/Toolbar", "sap/m/ToolbarSpacer", "sap/m/VBox", "./BaseSettingsPanel", "./utils/Constants", "./utils/PageManager", "./utils/PersonalisationUtils"], function (CustomListItem, HBox, List, Panel, SearchField, Text, Title, ToggleButton, Toolbar, ToolbarSpacer, VBox, __BaseSettingsPanel, ___utils_Constants, __PageManager, __PersonalisationUtils) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BaseSettingsPanel = _interopRequireDefault(__BaseSettingsPanel);
  const PAGE_SELECTION_LIMIT = ___utils_Constants["PAGE_SELECTION_LIMIT"];
  const SETTINGS_PANELS_KEYS = ___utils_Constants["SETTINGS_PANELS_KEYS"];
  const PageManager = _interopRequireDefault(__PageManager);
  const PersonalisationUtils = _interopRequireDefault(__PersonalisationUtils);
  /**
   *
   * Class for My Home Page Settings Panel.
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
   * @alias sap.cux.home.PageSettingsPanel
   */
  const PageSettingsPanel = BaseSettingsPanel.extend("sap.cux.home.PageSettingsPanel", {
    constructor: function constructor() {
      BaseSettingsPanel.prototype.constructor.apply(this, arguments);
      this._initialNavigation = true;
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
      this.setProperty("key", SETTINGS_PANELS_KEYS.PAGES);
      this.setProperty("title", this._i18nBundle.getText("pages"));
      this.setProperty("icon", "sap-icon://course-book");
      this.oWrapperVBox = new VBox(`${this.getId()}--pageSettingsWrapper`, {
        width: "100%"
      }).addStyleClass("sapUiNoPadding sapUiNoMarginEnd");
      this.addAggregation("content", this.oWrapperVBox);

      //fired every time on panel navigation
      this.attachPanelNavigated(() => {
        void this.onPanelNavigated();
      });
    },
    /**
     * Handler for panel navigation event.
     * Initialize the Page Settings Panel on navigation, if it is not already initializaed.
     * @private
     */
    onPanelNavigated: function _onPanelNavigated() {
      try {
        const _this = this;
        function _temp2() {
          if (_this.oSearchField?.getValue()) {
            _this.oSearchField.setValue("");
            _this.sSearchQuery = "";
            _this._renderPages(_this.aSpaces);
          }
        }
        const _temp = function () {
          if (_this._initialNavigation) {
            _this._initialNavigation = false;
            return Promise.resolve(_this._initializePanel()).then(function () {});
          }
        }();
        return Promise.resolve(_temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp)); // Clear Search field and search results
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Initialize the Page Settings Panel.
     * @private
     */
    _initializePanel: function _initializePanel() {
      try {
        const _this2 = this;
        if (!_this2.PageManagerInstance) {
          // initializing the page manager instance on panel navigation, as when on init is triggered, the panel assocation is not yet set
          // we are using this._getPanel() (i.e. corresponding panel) instead of this, as settings panel don't have an ownerId
          _this2.PageManagerInstance = PageManager.getInstance(PersonalisationUtils.getPersContainerId(_this2._getPanel()), PersonalisationUtils.getOwnerComponent(_this2._getPanel()));
        }
        return Promise.resolve(_this2.PageManagerInstance.fetchAllAvailablePages()).then(function (_this2$PageManagerIns) {
          _this2.aAllPages = _this2$PageManagerIns;
          return Promise.resolve(_this2.PageManagerInstance.getFavoritePages()).then(function (_this2$PageManagerIns2) {
            _this2.aFavPages = _this2$PageManagerIns2;
            return Promise.resolve(_this2.PageManagerInstance.fetchAllAvailableSpaces()).then(function (_this2$PageManagerIns3) {
              _this2.aSpaces = _this2$PageManagerIns3;
              _this2._showMessageStrip();
              _this2._showToolbar();
              _this2._showPagesList();
            });
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    _showMessageStrip: function _showMessageStrip() {
      const oMessageStripVBox = new VBox(`${this.getId()}--msgStripContainer`, {
        width: "100%"
      }).addStyleClass("sapUiNoPadding sapUiNoMarginEnd");
      this.oMessage = new Text(`${this.getId()}--msgStripText`).addStyleClass("sapUiSmallMargin");
      this._seHeaderMessage();
      oMessageStripVBox.addItem(this.oMessage);
      this.oWrapperVBox.addItem(oMessageStripVBox);
    },
    _seHeaderMessage: function _seHeaderMessage() {
      this.oMessage.setText(this.aFavPages.length >= PAGE_SELECTION_LIMIT ? this._i18nBundle.getText("myInterestwarning") : this._i18nBundle.getText("myInterestinfo"));
    },
    _showToolbar: function _showToolbar() {
      const oTitle = new Title(`${this.getId()}--pagesListTitle`, {
        text: this._i18nBundle.getText("pageGroupHeader"),
        titleStyle: "H5"
      }).addStyleClass("sapUiSmallMarginBottom");
      this.oSearchField = new SearchField(`${this.getId()}--pagesListSearch`, {
        liveChange: oEvent => this._onPagesSearch(oEvent),
        width: "13.75rem"
      }).addStyleClass("sapUiSmallMarginBottom");
      const oToolbar = new Toolbar(`${this.getId()}--pagesListToolbar`, {
        width: "calc(100% - 2rem)",
        height: "3rem",
        design: "Solid",
        content: [oTitle, new ToolbarSpacer(`${this.getId()}--pagesHeaderToolbarSpacer`), this.oSearchField]
      }).addStyleClass("sapUiSmallMarginBegin pagesToolbarNoPadding");
      this.oWrapperVBox.addItem(oToolbar);
    },
    _showPagesList: function _showPagesList() {
      this.oPagesListVBox = new VBox(`${this.getId()}--pagesListVBox`, {
        width: "calc(100% - 2rem)"
      }).addStyleClass("sapUiSmallMarginBegin");
      this._renderPages(this.aSpaces);
      this.oWrapperVBox.addItem(this.oPagesListVBox);
    },
    _createPagesList: function _createPagesList(oPage) {
      const oText = new Text({
        text: oPage.label
      });
      const oToggleBtn = new ToggleButton({
        tooltip: oPage.selected ? this._i18nBundle.getText("hideBtn") : this._i18nBundle.getText("showBtn"),
        icon: "sap-icon://show",
        type: "Emphasized",
        pressed: !oPage.selected,
        enabled: oPage.selected || this.aFavPages.length < PAGE_SELECTION_LIMIT,
        press: oEvent => void this._pageSelectHandler(oPage.id, oEvent)
      });
      const oHBox = new HBox({
        justifyContent: "SpaceBetween",
        alignItems: "Center",
        items: [oText, oToggleBtn]
      });
      const oCustomListItem = new CustomListItem({
        content: [oHBox]
      }).addStyleClass("pagesPanelItem");
      return oCustomListItem;
    },
    _renderPages: function _renderPages(aSpaces) {
      const pageSettingsPage = this.oPagesListVBox.getParent()?.getParent();
      const scrollContainerDomRef = pageSettingsPage?.getDomRef()?.childNodes[1];
      const currentScrollPosition = scrollContainerDomRef?.scrollTop || 0;
      this.oPagesListVBox.removeAllItems();
      if (!aSpaces.length) {
        if (!this.oNoDataHBox) {
          this.oNoDataHBox = new HBox(`${this.getId()}--noSpacePageHBox`, {
            height: "3rem",
            justifyContent: "Center",
            alignItems: "Center",
            items: [new Text({
              text: this._i18nBundle.getText("noData")
            })]
          }).addStyleClass("pagesBottomBorder");
          this.oWrapperVBox.addItem(this.oNoDataHBox);
        }
        this.oNoDataHBox.setVisible(true);
      } else if (this.oNoDataHBox) {
        this.oNoDataHBox.setVisible(false);
      }
      aSpaces.forEach(oSpace => {
        const aPagesList = [];
        oSpace.children.forEach(oPage => {
          oPage.selected = this.aFavPages.find(oFavPage => oFavPage.pageId === oPage.id) ? true : false;
          aPagesList.push(this._createPagesList(oPage));
        });
        const oHeaderToolbar = this._createHeaderToolbar(oSpace);
        const oPanel = new Panel("", {
          expandable: true,
          expanded: true,
          width: "auto",
          headerToolbar: oHeaderToolbar,
          content: new List({
            items: aPagesList
          })
        }).addStyleClass("pagesPanel");
        this.oPagesListVBox.addItem(oPanel);
      });
      if (currentScrollPosition >= 0 && pageSettingsPage) {
        setTimeout(() => {
          pageSettingsPage.scrollTo(currentScrollPosition);
        }, 0);
      }
    },
    _createHeaderToolbar: function _createHeaderToolbar(oSpace) {
      const oTitle = new Title({
        wrapping: true,
        width: "16rem",
        text: oSpace.label
      }).addStyleClass("dialogPanelTitle");
      const oToolbar = new Toolbar({
        design: "Solid",
        content: [oTitle]
      });
      return oToolbar;
    },
    _pageSelectHandler: function _pageSelectHandler(sPageId, oEvent) {
      try {
        const _this3 = this;
        const bIsCheckBoxSelected = !oEvent.getSource().getPressed();
        const oPageObj = _this3.aAllPages.find(oPage => oPage.pageId === sPageId);
        if (!oPageObj) {
          return Promise.resolve(false);
        }
        if (bIsCheckBoxSelected) {
          _this3.aFavPages.push(oPageObj);
        } else {
          const iIndex = _this3.aFavPages.findIndex(oPage => oPage.pageId === sPageId);
          _this3.aFavPages.splice(iIndex, 1);
        }
        _this3._seHeaderMessage();
        return Promise.resolve(_this3.PageManagerInstance.getFavPages(_this3.aFavPages, true)).then(function () {
          let aFilteredSpaces;
          if (_this3.sSearchQuery?.length) {
            aFilteredSpaces = _this3._filterSpacesPages();
          }
          _this3._renderPages(aFilteredSpaces || _this3.aSpaces);
          void _this3._getPanel().getData();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    _onPagesSearch: function _onPagesSearch(oEvent) {
      this.sSearchQuery = oEvent.getSource().getValue().toLowerCase();
      const aFilteredSpaces = this._filterSpacesPages();
      this._renderPages(aFilteredSpaces);
    },
    _filterSpacesPages: function _filterSpacesPages() {
      const aFilteredSpaces = [];
      this.aSpaces.forEach(oSpace => {
        const children = [];
        const spaceLabel = oSpace.label;
        oSpace.children.forEach(oPage => {
          if (oPage.label?.toLowerCase().includes(this.sSearchQuery) || spaceLabel?.toLowerCase().includes(this.sSearchQuery)) {
            children.push(oPage);
          }
        });
        if (children.length) {
          aFilteredSpaces.push({
            ...oSpace,
            children
          });
        }
      });
      return aFilteredSpaces;
    }
  });
  return PageSettingsPanel;
});
//# sourceMappingURL=PageSettingsPanel-dbg-dbg.js.map
