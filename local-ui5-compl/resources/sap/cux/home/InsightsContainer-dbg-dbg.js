/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["./BaseContainer", "./CardsPanel", "./ErrorPanel", "./TilesPanel", "./utils/Device"], function (__BaseContainer, ___CardsPanel, __ErrorPanel, ___TilesPanel, ___utils_Device) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BaseContainer = _interopRequireDefault(__BaseContainer);
  const cardsMenuItems = ___CardsPanel["cardsMenuItems"];
  const ErrorPanel = _interopRequireDefault(__ErrorPanel);
  const tilesMenuItems = ___TilesPanel["tilesMenuItems"];
  const DeviceType = ___utils_Device["DeviceType"];
  const tilesPanelName = "sap.cux.home.TilesPanel";
  const cardsPanelName = "sap.cux.home.CardsPanel";
  const errorPanelName = "sap.cux.home.ErrorPanel";

  /**
   *
   * Container class for managing and storing Insights Tiles and Insights Cards.
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
   * @alias sap.cux.home.InsightsContainer
   */
  const InsightsContainer = BaseContainer.extend("sap.cux.home.InsightsContainer", {
    renderer: {
      ...BaseContainer.renderer,
      apiVersion: 2
    },
    /**
     * Constructor for a new Insights container.
     *
     * @param {string} [id] ID for the new control, generated automatically if an ID is not provided
     * @param {object} [settings] Initial settings for the new control
     */
    constructor: function _constructor(id, settings) {
      BaseContainer.prototype.constructor.call(this, id, settings);
      this._visiblePanels = [];
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
      this.setProperty("layout", "Vertical");
      this.setTooltip(String(this._i18nBundle.getText("insightLayoutSectionTitle")));
    },
    onBeforeRendering: function _onBeforeRendering() {
      BaseContainer.prototype.onBeforeRendering.call(this);
      if (this._isInitialRender) {
        const aContent = this.getContent();
        const panels = [];
        // Initially tiles & cards panels will be hidden till data is loaded in the individual panels are unhidden from panel level.
        aContent.forEach(oContent => {
          if (!this.tilesPanel && oContent.isA(tilesPanelName)) {
            this.tilesPanel = oContent;
            panels.push(this.tilesPanel);
          }
          if (!this.cardsPanel && oContent.isA(cardsPanelName)) {
            this.cardsPanel = oContent;
            panels.push(this.cardsPanel);
          }
        });
        this.handleHidePanel(this.tilesPanel);
        this.handleHidePanel(this.cardsPanel);

        // Render individual panels
        panels.forEach(panel => {
          panel.handleRemoveActions();
          panel.attachHandleHidePanel(() => this.handleHidePanel(panel));
          panel.attachHandleUnhidePanel(() => this.unhidePanelIfHidden(panel));
          void panel.renderPanel();
        });
        this._isInitialRender = false;
      }
    },
    /**
     * handleHidePanel
     */
    handleHidePanel: function _handleHidePanel(panel) {
      this.removeContent(panel);
      const panelCount = this.getContent()?.length;
      this._addContainerHeader(this.getContent());
      if (panelCount === 0) {
        if (!this._errorPanel) {
          this._errorPanel = new ErrorPanel(`${this.getId()}-errorPanel`, {
            messageTitle: this._i18nBundle.getText("noAppsTitle"),
            messageDescription: this._i18nBundle.getText("noInsightsMsg")
          });
          this._errorPanel.getData();
        }
        this.addAggregation("content", this._errorPanel);
      } else if (panelCount === 1) {
        const panel = this.getContent()[0];
        if (!panel.isA(errorPanelName)) {
          panel?.handleRemoveActions();
        }
      }
    },
    _addContainerHeader: function _addContainerHeader(panels) {
      this.setProperty("title", this._i18nBundle?.getText("insights"));
      this.setProperty("enableSettings", true);
      const menuItems = [];
      if (panels.length === 0 || panels[0]?.isA(errorPanelName)) {
        this._visiblePanels = [];
        menuItems.push(...this._handleNoPanelMenuItems());
      } else if (panels.length === 1) {
        if (panels[0].isA(tilesPanelName)) {
          this._visiblePanels = [tilesPanelName];
          this.setProperty("title", `${this._i18nBundle?.getText("insights")} (${this.tilesCount || 0})`);
          menuItems.push(...this._handleTilesPanelMenuItems());
        }
        if (panels[0].isA(cardsPanelName)) {
          this._visiblePanels = [cardsPanelName];
          this.setProperty("title", `${this._i18nBundle?.getText("insights")} (${this.cardsCount || 0})`);
          menuItems.push(...this._handleCardsPanelMenuItems());
        }
      }

      // Add Insights Settings Menu Item
      const insightsSettingMenu = (this.getAggregation("menuItems") || [])?.find(menu => menu.getId() === `${this.getId()}-settings`);
      if (insightsSettingMenu) {
        menuItems.push(insightsSettingMenu);
      }

      // Remove Existing Aggregations
      this.removeAllAggregation("menuItems");
      this.removeAllAggregation("actionButtons");

      // Add Tiles Action Buttons to Container Action Buttons
      this.tilesPanel.actionButtons.forEach(actionButton => this.addAggregation("actionButtons", actionButton));
      menuItems.forEach(menuItem => this.addAggregation("menuItems", menuItem));
    },
    _removeContainerHeader: function _removeContainerHeader() {
      this.setProperty("title", "");
      this.setProperty("enableSettings", false);
      this.removeAllAggregation("menuItems");
      this.removeAllAggregation("actionButtons");
      this.getContent().forEach(panel => panel.handleAddActions());
    },
    _handleNoPanelMenuItems: function _handleNoPanelMenuItems() {
      // In case of No Panels, Except Refresh all menu itmes should be shown
      const menuItems = [];
      this.tilesPanel.menuItems.forEach(menuItem => {
        if (menuItem.getId() !== tilesMenuItems.REFRESH.valueOf()) {
          menuItems.push(menuItem);
        }
      });
      const cardsPanelId = this.cardsPanel.getId();
      this.cardsPanel.menuItems.forEach(menuItem => {
        if (menuItem.getId() !== `${cardsPanelId}-${cardsMenuItems.REFRESH.valueOf()}`) {
          menuItems.push(menuItem);
        }
      });
      return menuItems;
    },
    _handleTilesPanelMenuItems: function _handleTilesPanelMenuItems() {
      // In case of TilesPanel visible, Except CardsPanel Refresh all menu itmes should be shown
      const menuItems = [];
      this.tilesPanel.menuItems.forEach(menuItem => menuItems.push(menuItem));
      const cardsPanelId = this.cardsPanel.getId();
      this.cardsPanel.menuItems.forEach(menuItem => {
        if (menuItem.getId() !== `${cardsPanelId}-${cardsMenuItems.REFRESH.valueOf()}`) {
          menuItems.push(menuItem);
        }
      });
      return menuItems;
    },
    _handleCardsPanelMenuItems: function _handleCardsPanelMenuItems() {
      // In case of CardsPanel visible, Except TilesPanel Refresh all menu itmes should be shown and CardsPanel refresh should be shown at the top.
      const menuItems = [];
      this.tilesPanel.menuItems.forEach(menuItem => {
        if (menuItem.getId() !== tilesMenuItems.REFRESH.valueOf()) {
          menuItems.push(menuItem);
        }
      });
      const cardsPanelId = this.cardsPanel.getId();
      this.cardsPanel.menuItems.forEach(menuItem => {
        if (menuItem.getId() === `${cardsPanelId}-${cardsMenuItems.REFRESH.valueOf()}`) {
          menuItems.unshift(menuItem);
        } else {
          menuItems.push(menuItem);
        }
      });
      return menuItems;
    },
    updatePanelsItemCount: function _updatePanelsItemCount(itemCount, panelName) {
      if (panelName === tilesPanelName) {
        this.tilesCount = itemCount;
      } else if (panelName === cardsPanelName) {
        this.cardsCount = itemCount;
      }
      // Container Title Will be displayed only in case of only one panel is present
      if (this.getContent().length === 1) {
        this.setProperty("title", `${this._i18nBundle?.getText("insights")} (${itemCount || 0})`);
      }
    },
    unhidePanelIfHidden: function _unhidePanelIfHidden(panel) {
      this.removeContent(this._errorPanel);
      if (panel.isA(tilesPanelName) && !this._visiblePanels.includes(tilesPanelName)) {
        this._visiblePanels.push(tilesPanelName);
        if (this._visiblePanels.includes(cardsPanelName)) {
          this.removeContent(this.cardsPanel);
          this.addContent(this.tilesPanel);
          this.addContent(this.cardsPanel);
        } else {
          this.addContent(this.tilesPanel);
        }
        const panels = this.getContent();
        if (panels.length > 1) {
          this._removeContainerHeader();
        } else {
          this._addContainerHeader(panels);
        }
      }
      if (panel.isA(cardsPanelName) && !this._visiblePanels.includes(cardsPanelName)) {
        this._visiblePanels.push(cardsPanelName);
        this.addContent(this.cardsPanel);
        const panels = this.getContent();
        if (panels.length === 2) {
          this._removeContainerHeader();
        } else {
          this._addContainerHeader(panels);
        }
      }
    },
    /**
     * Adjusts the layout of the container.
     *
     * @private
     * @override
     */
    adjustLayout: function _adjustLayout() {
      //hide actions if the device is a phone
      this.toggleActionButtons(this.getDeviceType() !== DeviceType.Mobile);

      //adjust layout of all panels
      this.getContent().forEach(panel => panel._adjustLayout?.());
    }
  });
  return InsightsContainer;
});
//# sourceMappingURL=InsightsContainer-dbg-dbg.js.map
