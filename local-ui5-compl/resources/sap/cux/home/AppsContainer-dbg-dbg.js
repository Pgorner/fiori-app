/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/m/GenericTile", "sap/m/Panel", "sap/m/library", "sap/ui/core/EventBus", "sap/ui/core/theming/Parameters", "./BaseContainer", "./library", "./utils/DataFormatUtils", "./utils/Device"], function (GenericTile, Panel, sap_m_library, EventBus, Parameters, __BaseContainer, ___library, __DataFormatUtils, ___utils_Device) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BackgroundDesign = sap_m_library["BackgroundDesign"];
  const FrameType = sap_m_library["FrameType"];
  const GenericTileMode = sap_m_library["GenericTileMode"];
  const GenericTileScope = sap_m_library["GenericTileScope"];
  const TileSizeBehavior = sap_m_library["TileSizeBehavior"];
  const BaseContainer = _interopRequireDefault(__BaseContainer);
  const LayoutType = ___library["LayoutType"];
  const DataFormatUtils = _interopRequireDefault(__DataFormatUtils);
  const DeviceType = ___utils_Device["DeviceType"];
  const getDefaultAppColor = () => {
    const sLegendName = "sapLegendColor9";
    return {
      key: sLegendName,
      value: Parameters.get({
        name: sLegendName
      }),
      assigned: false
    };
  };
  const CONSTANTS = {
    PLACEHOLDER_ITEMS_COUNT: 5
  };

  /**
   *
   * Container class for managing and storing apps.
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
   * @alias sap.cux.home.AppsContainer
   */
  const AppsContainer = BaseContainer.extend("sap.cux.home.AppsContainer", {
    metadata: {
      events: {
        /**
         * Event is fired when apps are loaded.
         */
        appsLoaded: {
          parameters: {
            apps: {
              type: "App[]"
            },
            tiles: {
              type: "GenericTile[]"
            }
          }
        }
      }
    },
    renderer: {
      ...BaseContainer.renderer,
      apiVersion: 2
    },
    /**
     * Constructor for a new app container.
     *
     * @param {string} [id] ID for the new control, generated automatically if an ID is not provided
     * @param {object} [settings] Initial settings for the new control
     */
    constructor: function _constructor(id, settings) {
      BaseContainer.prototype.constructor.call(this, id, settings);
      this._isInitialRender = true;
    },
    /**
     * Init lifecycle method
     *
     * @private
     * @override
     */
    init: function _init() {
      BaseContainer.prototype.init.call(this);
      this.setProperty("title", this._i18nBundle?.getText("appsTitle"));
      if (this.getDeviceType() === DeviceType.Mobile) {
        this.setProperty("layout", LayoutType.Vertical);
      }
      this._shellNavigationHandler = () => this._onShellNavigated();
      this._oEventBus = EventBus.getInstance();
      this._oEventBus?.subscribe("sap.ushell", "navigated", this._shellNavigationHandler);
      this.addStyleClass("sapCuxAppsContainer");
    },
    /**
     * Exit lifecycle method
     * Clean up event handlers
     * @private
     */
    exit: function _exit() {
      this._oEventBus?.unsubscribe("sap.ushell", "navigated", this._shellNavigationHandler);
    },
    /**
     * onBeforeRendering lifecycle method
     *
     * @private
     * @override
     */
    onBeforeRendering: function _onBeforeRendering() {
      BaseContainer.prototype.onBeforeRendering.call(this);
      if (this._isInitialRender) {
        this._isInitialRender = false;
        this._attachPanelSupportedEvent();
        this._removeUnsupportedPanels();
      }
      const isPhone = this.getDeviceType() === DeviceType.Mobile;
      const selectedPanels = isPhone ? this.getContent() : [this._getSelectedPanel()];
      for (const selectedPanel of selectedPanels) {
        selectedPanel.fireNavigated();
        void this._setApps(selectedPanel);
      }
    },
    /**
     * Handler for navigation event.
     * @private
     * Sets the panels dirty if navigated to different page.
     */
    _onShellNavigated: function _onShellNavigated() {
      this._setPanelsDirty();
    },
    /**
     * Set all panels dirty state to true, to refresh all panels
     * @private
     */
    _setPanelsDirty: function _setPanelsDirty() {
      const panels = this.getContent();
      for (const panel of panels) {
        panel.setDesktopViewDirty(true);
        panel.setMobileViewDirty(true);
      }
    },
    /**
     * Generate placeholer for the panel.
     * @private
     * @param {BaseAppPanel} panel - Panel for which placeholders has to be generated.
     */
    _generatePlaceholder: function _generatePlaceholder(panel) {
      if (!panel.isLoaded()) {
        const placeholderApps = panel.generateApps(new Array(CONSTANTS.PLACEHOLDER_ITEMS_COUNT).fill({
          status: "Loading"
        }));
        panel.destroyAggregation("apps", true);
        panel.setApps(placeholderApps);
        this._updatePanelContent(panel);
      }
    },
    /**
     * Loads and sets the apps.
     * @private
     * @param {BaseAppPanel} panel - Panel for which apps has to be loaded.
     * @returns {Promise<void>} resolves when apps are loaded.
     */
    _setApps: function _setApps(panel) {
      try {
        const _this = this;
        const _temp3 = function () {
          if (panel.isDirty() && panel.isMobileDirty()) {
            _this._generatePlaceholder(panel);
            return Promise.resolve(panel.loadApps?.()).then(function () {
              function _temp2() {
                let tiles = [];
                let apps = panel.getApps();
                tiles = panel.fetchTileVisualization(tiles);
                _this.fireEvent("appsLoaded", {
                  apps,
                  tiles
                });
              }
              if (_this.getDeviceType() === DeviceType.Mobile) {
                panel.setMobileViewDirty(false);
              } else {
                panel.setDesktopViewDirty(false);
              }
              panel.setLoaded(true);
              _this._updatePanelContent(panel);
              const _temp = function () {
                if (panel.isA("sap.cux.home.BaseAppPersPanel")) {
                  return Promise.resolve(panel.applyPersonalization()).then(function () {});
                }
              }();
              return _temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp);
            });
          }
        }();
        // only load the apps if panel is in dirty state
        return Promise.resolve(_temp3 && _temp3.then ? _temp3.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Updates the content of the panel by replacing existing items with new apps and groups.
     * This method selects the appropriate wrapper based on the device type, and add apps/group or mobile cards to the wrapper.
     *
     * @param {BaseAppPanel} panel - The panel whose content needs to be updated.
     * @returns {void}
     * @private
     */
    _updatePanelContent: function _updatePanelContent(panel) {
      const apps = panel.getApps() || [];
      const groups = panel.getAggregation("groups") || [];
      const isPhone = this.getDeviceType() === DeviceType.Mobile;
      const wrapper = isPhone ? panel._generateMobileAppsWrapper() : panel._generateAppsWrapper();
      const aggregationName = isPhone ? "content" : "items";
      wrapper.destroyAggregation(aggregationName);
      let items = isPhone ? this._generateMobileCards([...groups, ...apps]) : this._generateTiles([...groups, ...apps]);
      this._addWrapperContent(wrapper, items, aggregationName);
      this._updatePanelContentVisibility(panel);
    },
    /**
     * Updates the visibility of the panel's content based on the current state and device type.
     * This method determines whether to display the apps or an error message based on the presence of apps and groups.
     * It also adjusts the visibility of different containers depending on whether the device is a phone or not.
     *
     * @param {BaseAppPanel} panel - The panel whose content visibility needs to be updated.
     * @returns {void}
     * @private
     */
    _updatePanelContentVisibility: function _updatePanelContentVisibility(panel) {
      const apps = panel.getApps() || [];
      const groups = panel.getAggregation("groups") || [];
      const isPhone = this.getDeviceType() === DeviceType.Mobile;
      const appsWrapper = panel._generateDesktopAppsWrapper();
      const mobileAppsWrapper = panel._generateMobileAppsWrapper();
      const errorCard = panel._generateErrorMessage();
      const hasApps = [...apps, ...groups].length !== 0;
      appsWrapper.setVisible(hasApps && !isPhone);
      mobileAppsWrapper.setVisible(hasApps && isPhone);
      mobileAppsWrapper.getParent().setWidth(isPhone && hasApps ? "100%" : "auto");
      errorCard.setVisible(!hasApps);
    },
    /**
     * Generates generic tile based on app.
     * @private
     * @param {sap.cux.home.App} app - App.
     * @returns {sap.m.GenericTile}.
     */
    _getAppTile: function _getAppTile(app) {
      const isPhone = this.getDeviceType() === DeviceType.Mobile;
      const actions = app.getAggregation("menuItems") || [];
      return new GenericTile("", {
        scope: actions.length && !isPhone ? GenericTileScope.ActionMore : GenericTileScope.Display,
        state: app.getStatus(),
        mode: GenericTileMode.IconMode,
        sizeBehavior: TileSizeBehavior.Small,
        header: app.getTitle(),
        backgroundColor: app.getBgColor() || getDefaultAppColor()?.key,
        tileIcon: app.getIcon(),
        url: DataFormatUtils.getLeanURL(app.getUrl()),
        frameType: FrameType.TwoByHalf,
        renderOnThemeChange: true,
        dropAreaOffset: 4,
        subheader: app.getSubTitle(),
        press: e => app._onPress(e),
        width: isPhone ? "15rem" : "auto"
      }).addStyleClass("sapMGTTwoByHalf tileLayout");
    },
    /**
     * Generates generic tile based on group.
     * @private
     * @param {sap.cux.home.Group} group - Group.
     * @returns {sap.m.GenericTile}.
     */
    _getGroupTile: function _getGroupTile(group) {
      const isPhone = this.getDeviceType() === DeviceType.Mobile;
      const actions = group.getAggregation("menuItems") || [];
      return new GenericTile("", {
        scope: actions.length && !isPhone ? GenericTileScope.ActionMore : GenericTileScope.Display,
        state: group.getStatus(),
        mode: GenericTileMode.IconMode,
        sizeBehavior: TileSizeBehavior.Small,
        header: group.getTitle(),
        backgroundColor: group.getBgColor() || getDefaultAppColor()?.key,
        tileIcon: group.getIcon(),
        frameType: FrameType.TwoByHalf,
        renderOnThemeChange: true,
        dropAreaOffset: 4,
        tileBadge: group.getNumber(),
        press: e => group._onPress(e),
        width: isPhone ? "15rem" : "auto"
      }).addStyleClass("sapMGTTwoByHalf tileLayout").data("groupId", group.getGroupId());
    },
    /**
     * Overridden method for selection of panel in the IconTabBar.
     * Loads the apps in selected panel
     * @private
     * @returns {Promise<void>} resolves when apps are loaded on panel selection.
     */
    _onPanelSelect: function _onPanelSelect(event) {
      try {
        const _this2 = this;
        BaseContainer.prototype._onPanelSelect.call(_this2, event);
        const selectedPanel = _this2._getSelectedPanel();
        return Promise.resolve(_this2._setApps(selectedPanel)).then(function () {});
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Refresh apps for all the panels.
     * @private
     * @returns {Promise<void>} resolves when all panels are set to dirty and apps for current panel are refreshed.
     */
    _refreshAllPanels: function _refreshAllPanels() {
      try {
        const _this3 = this;
        //set all panels to dirty
        _this3._setPanelsDirty();
        //set apps for current section
        return Promise.resolve(_this3._setApps(_this3._getSelectedPanel())).then(function () {});
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Refresh apps for selected panel.
     * @private
     * @param {BaseAppPanel} panel - Panel that has be refreshed.
     * @returns {Promise<void>} resolves when apps are refreshed.
     */
    refreshPanel: function _refreshPanel(panel) {
      try {
        const _this4 = this;
        panel.setMobileViewDirty(true);
        panel.setDesktopViewDirty(true);
        return Promise.resolve(_this4._setApps(panel)).then(function () {});
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Toggles the visibility of the tab view based on the supported panels.
     * @private
     */
    _toggleTabView: function _toggleTabView() {
      if (this.getDeviceType() !== DeviceType.Mobile) {
        const panels = this.getContent();
        const supportedPanels = panels.filter(panel => panel.isSupported());
        const iconTabBarControl = this._getInnerControl();
        iconTabBarControl?.toggleStyleClass("sapUiITBHide", supportedPanels.length === 1);
      }
    },
    /**
     * Handles the supported state of the current panel.
     * If the panel is supported, it adds the panel to the content.
     * If the panel is not supported, it removes the panel from the content.
     * @param {BaseAppPanel} currentPanel - The panel to handle the supported state for.
     * @private
     */
    _onPanelSupported: function _onPanelSupported(currentPanel, event) {
      const isSupported = event.getParameter("isSupported");
      currentPanel.setSupported(isSupported);
      this._togglePanelVisibility(currentPanel, isSupported);
      this._toggleTabView();
    },
    /**
     * Toggles the visibility of the panel.
     * @param {BaseAppPanel} panel - The panel to toggle the visibility for.
     * @param {boolean} isVisible - The visibility state of the panel.
     * @private
     */
    _togglePanelVisibility: function _togglePanelVisibility(panel, isVisible) {
      if (this.getDeviceType() === DeviceType.Mobile) {
        const panelWrapper = this._getPanelContentWrapper(panel);
        panelWrapper.setVisible(isVisible);
      } else {
        const iconTabBar = this._getInnerControl();
        const tabs = iconTabBar?.getItems() || [];
        const selectedTab = tabs.find(tab => tab.getKey() === panel.getKey());
        selectedTab?.setVisible(isVisible);
      }
    },
    /**
     * Removes unsupported panels from the container.
     * @private
     */
    _removeUnsupportedPanels: function _removeUnsupportedPanels() {
      const panels = this.getContent();
      const unSupportedPanels = panels.filter(panel => !panel.isSupported());
      for (const panel of unSupportedPanels) {
        this._togglePanelVisibility(panel, false);
      }
      this._toggleTabView();
    },
    /**
     * Attaches an event handler to the "supported" event for each panel in the container.
     * @private
     */
    _attachPanelSupportedEvent: function _attachPanelSupportedEvent() {
      const panels = this.getContent();
      for (const panel of panels) {
        if (!panel.hasListeners("supported")) {
          panel.attachSupported(this._onPanelSupported.bind(this, panel));
        }
      }
    },
    /**
     * Adjusts the layout and visibility based on the device type.
     *
     * This method adjusts the layout type and visibility of containers based on whether the device is a phone
     * or not. It sets the container's layout property, toggles visibility of panels and their containers, and
     * adjusts background design accordingly.
     *
     * @private
     * @returns {void}
     */
    adjustLayout: function _adjustLayout() {
      const isPhone = this.getDeviceType() === DeviceType.Mobile;
      const currentLayout = this.getProperty("layout");
      const newLayout = isPhone ? LayoutType.Vertical : LayoutType.SideBySide;
      const shouldAdjustLayout = currentLayout !== newLayout;
      if (!shouldAdjustLayout) {
        return;
      }
      this.setProperty("layout", newLayout);
      const panels = this.getContent();
      panels.forEach(panel => {
        //if both the panels are dirty, then updated data will be loaded from onBeforeRendering, as layout change will trigger re-rendering
        //if both the panels are not dirty, i.e. doen't have any changes, then just toggle the visibility
        if (!panel.isDirty() && !panel.isMobileDirty()) {
          this._updatePanelContentVisibility(panel);
        } else if (panel.isDirty() !== panel.isMobileDirty()) {
          //if one of the panels is dirty i.e. have updated data and other is not, then re-create the inner controls
          panel.setDesktopViewDirty(false);
          panel.setMobileViewDirty(false);
          this._updatePanelContent(panel);
        }
      });
      //hide actions if the device is a phone
      this.toggleActionButtons(!isPhone);

      //this is to handle scenario when unsupported propert is changed and then layout is changed.
      this._removeUnsupportedPanels();
    },
    /**
     * Generates mobile card panel and add given apps/groups in the panel.
     *
     * @private
     * @returns {sap.m.Panel} The newly created mobile card panel.
     */
    _generateMobileCards: function _generateMobileCards(items) {
      const panels = [];
      for (let i = 0; i < items.length; i += 7) {
        const panelItems = items.slice(i, i + 7);
        const panel = new Panel({
          backgroundDesign: BackgroundDesign.Solid,
          height: "23.5rem",
          width: "17rem",
          content: this._generateTiles(panelItems)
        }).addStyleClass("sapUiMobileAppsCard");
        panels.push(panel);
      }
      return panels;
    },
    /**
     * Generates group/app generic tiles for given apps/groups.
     *
     * @private
     * @param {BaseApp[]} items - Apps/Groups for which tiles has to be generated.
     * @returns {sap.m.GenericTile[]} The generated tiles.
     */
    _generateTiles: function _generateTiles(items) {
      return items.map(item => item.isA("sap.cux.home.Group") ? this._getGroupTile(item) : this._getAppTile(item));
    },
    /**
     * Adds given items into the wrapper.
     * @param {HeaderContainer | GridContainer} wrapper - wrapper for which items has to be added.
     * @param {Panel[] | GenericTile[]} items - items to be added.
     * @param {string} aggregationName - aggregation name to which items has to be added.
     * @private
     */
    _addWrapperContent: function _addWrapperContent(wrapper, items, aggregationName) {
      wrapper.destroyAggregation(aggregationName);
      items.forEach(item => {
        wrapper.addAggregation(aggregationName, item);
      });
    }
  });
  return AppsContainer;
});
//# sourceMappingURL=AppsContainer-dbg-dbg.js.map
