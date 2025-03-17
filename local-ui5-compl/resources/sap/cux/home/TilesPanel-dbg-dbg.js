/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/f/GridContainer", "sap/f/GridContainerItemLayoutData", "sap/m/Button", "sap/m/CustomListItem", "sap/m/Dialog", "sap/m/HBox", "sap/m/HeaderContainer", "sap/m/IllustratedMessage", "sap/m/Label", "sap/m/List", "sap/m/ObjectIdentifier", "sap/m/Title", "sap/m/library", "sap/ui/core/EventBus", "sap/ui/core/Icon", "sap/ui/core/Lib", "sap/ui/core/dnd/DragDropInfo", "sap/ui/core/library", "sap/ui/model/json/JSONModel", "sap/ushell/Config", "sap/ushell/Container", "sap/ushell/api/S4MyHome", "./BasePanel", "./MenuItem", "./utils/AppManager", "./utils/Constants", "./utils/Device", "./utils/DragDropUtils", "./utils/FESRUtil"], function (GridContainer, GridContainerItemLayoutData, Button, CustomListItem, Dialog, HBox, HeaderContainer, IllustratedMessage, Label, List, ObjectIdentifier, Title, sap_m_library, EventBus, Icon, Lib, DragDropInfo, sap_ui_core_library, JSONModel, Config, Container, S4MyHome, __BasePanel, __MenuItem, __AppManager, ___utils_Constants, ___utils_Device, ___utils_DragDropUtils, ___utils_FESRUtil) {
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
  const ButtonType = sap_m_library["ButtonType"];
  const dnd = sap_ui_core_library["dnd"];
  const BasePanel = _interopRequireDefault(__BasePanel);
  const MenuItem = _interopRequireDefault(__MenuItem);
  const AppManager = _interopRequireDefault(__AppManager);
  const DEFAULT_BG_COLOR = ___utils_Constants["DEFAULT_BG_COLOR"];
  const END_USER_COLORS = ___utils_Constants["END_USER_COLORS"];
  const MYHOME_PAGE_ID = ___utils_Constants["MYHOME_PAGE_ID"];
  const MYINSIGHT_SECTION_ID = ___utils_Constants["MYINSIGHT_SECTION_ID"];
  const SETTINGS_PANELS_KEYS = ___utils_Constants["SETTINGS_PANELS_KEYS"];
  const DeviceType = ___utils_Device["DeviceType"];
  const fetchElementProperties = ___utils_Device["fetchElementProperties"];
  const attachKeyboardHandler = ___utils_DragDropUtils["attachKeyboardHandler"];
  const addFESRId = ___utils_FESRUtil["addFESRId"];
  const addFESRSemanticStepName = ___utils_FESRUtil["addFESRSemanticStepName"];
  const FESR_EVENTS = ___utils_FESRUtil["FESR_EVENTS"];
  var tilesMenuItems = /*#__PURE__*/function (tilesMenuItems) {
    tilesMenuItems["REFRESH"] = "tiles-refresh";
    tilesMenuItems["ADD_APPS"] = "tiles-addSmartApps";
    tilesMenuItems["EDIT_TILES"] = "tiles-editTiles";
    return tilesMenuItems;
  }(tilesMenuItems || {});
  var DisplayFormat = /*#__PURE__*/function (DisplayFormat) {
    DisplayFormat["Standard"] = "standard";
    DisplayFormat["StandardWide"] = "standardWide";
    return DisplayFormat;
  }(DisplayFormat || {});
  const _showAddApps = () => {
    return Config.last("/core/shell/enablePersonalization") || Config.last("/core/catalog/enabled");
  };

  /**
   *
   * Tiles Panel class for managing and storing Insights Tiles.
   *
   * @extends sap.cux.home.BasePanel
   *
   * @author SAP SE
   * @version 0.0.1
   * @since 1.122.0
   *
   * @internal
   * @experimental Since 1.122
   * @public
   *
   * @alias sap.cux.home.TilesPanel
   */
  const TilesPanel = BasePanel.extend("sap.cux.home.TilesPanel", {
    metadata: {
      library: "sap.cux.home",
      properties: {
        /**
         * Title for the tiles panel
         */
        title: {
          type: "string",
          group: "Misc",
          defaultValue: "",
          visibility: "hidden"
        },
        /**
         * Key for the tiles panel
         */
        key: {
          type: "string",
          group: "Misc",
          defaultValue: "",
          visibility: "hidden"
        },
        /**
         * The name of the URL parameter used to expand the container into full-screen mode.
         */
        fullScreenName: {
          type: "string",
          group: "Misc",
          defaultValue: "SI1",
          visibility: "hidden"
        }
      },
      defaultAggregation: "tiles",
      aggregations: {
        /**
         * Aggregation of tiles available within the tiles Panel
         */
        tiles: {
          type: "sap.cux.home.App",
          multiple: true,
          singularName: "tile",
          visibility: "hidden"
        }
      },
      events: {
        handleHidePanel: {
          parameters: {}
        },
        handleUnhidePanel: {
          parameters: {}
        }
      }
    },
    /**
     * Constructor for a new Tiles Panel.
     *
     * @param {string} [id] ID for the new control, generated automatically if an ID is not provided
     * @param {object} [settings] Initial settings for the new control
     */
    constructor: function _constructor(id, settings) {
      BasePanel.prototype.constructor.call(this, id, settings);
      this._insightsSectionTitle = this._i18nBundle.getText("insights");
      this._addFromFavDialogId = `${this.getId()}-addFromFavDialog`;
    },
    init: function _init() {
      try {
        const _this = this;
        BasePanel.prototype.init.call(_this);
        _this._controlMap = new Map();
        //Initialise Tiles Model
        _this._oData = {
          tiles: [],
          activateInsightsTiles: true
        };
        _this._controlModel = new JSONModel(_this._oData);
        _this.appManagerInstance = AppManager.getInstance();
        _this.setProperty("title", `${_this._i18nBundle?.getText("insights")} ${_this._i18nBundle.getText("insightsTilesTitle")}`);
        const refreshMenuItem = new MenuItem(tilesMenuItems.REFRESH, {
          title: _this._i18nBundle.getText("refresh"),
          icon: "sap-icon://refresh",
          press: () => void _this.refreshData(true)
        });
        addFESRId(refreshMenuItem, "tilesRefresh");
        const addfromFavAppMenuItem = new MenuItem(tilesMenuItems.ADD_APPS, {
          title: _this._i18nBundle.getText("addSmartApps"),
          icon: "sap-icon://duplicate",
          press: () => void _this._handleAddFromFavApps()
        });
        addFESRId(addfromFavAppMenuItem, "smartAppsDialog");
        const editTilesMenuItem = new MenuItem(tilesMenuItems.EDIT_TILES, {
          title: _this._i18nBundle.getText("editLinkTiles"),
          icon: "sap-icon://edit",
          press: event => _this.handleEditTiles(event)
        });
        addFESRId(editTilesMenuItem, "manageTiles");
        _this.menuItems = [refreshMenuItem, addfromFavAppMenuItem, editTilesMenuItem];
        const addTilesButton = new Button({
          id: `${_this.getId()}-addTilesButton`,
          text: _this._i18nBundle.getText("appFinderLink"),
          press: () => void _this._handleAddFromFavApps()
        });
        addFESRId(addTilesButton, "smartAppsDialog");
        _this.actionButtons = [addTilesButton];

        // Setup Header Content
        _this._setupHeader();
        return Promise.resolve(Container.getServiceAsync("VisualizationInstantiation")).then(function (_Container$getService) {
          _this.VizInstantiationService = _Container$getService;
          _this.oEventBus = EventBus.getInstance();
          // Subscribe to the event
          // Toggles the activity of tiles
          _this.oEventBus.subscribe("importChannel", "tilesImport", function (sChannelId, sEventId, oData) {
            try {
              return Promise.resolve(_this.appManagerInstance.createInsightSection(_this._i18nBundle.getText("insightsTiles"))).then(function () {
                return Promise.resolve(_this._addSectionViz(oData, MYINSIGHT_SECTION_ID)).then(function () {
                  _this._adjustLayout();
                  _this._importdone();
                });
              });
            } catch (e) {
              return Promise.reject(e);
            }
          }, _this);
          _this._toggleTileActivity();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Toggles the activity of tiles on route change.
     *
     * @private
     * @returns {void}
     */
    _toggleTileActivity: function _toggleTileActivity() {
      const _this2 = this;
      const toggleUserActions = function (event) {
        try {
          const show = event.getParameter("isMyHomeRoute");
          _this2._controlModel.setProperty("/activateInsightsTiles", show);
          const _temp = function () {
            if (show) {
              return Promise.resolve(_this2.refreshData(true)).then(function () {});
            }
          }();
          return Promise.resolve(_temp && _temp.then ? _temp.then(function () {}) : void 0);
        } catch (e) {
          return Promise.reject(e);
        }
      };
      S4MyHome.attachRouteMatched({}, toggleUserActions, this);
    },
    /**
     * Takes the visualizations and add it to the provided section id
     * @param {IVisualization[]} aSectionViz - array of visualizations
     * @param {string} sSectionId - section id where the visualizations to be added
     * @returns {any}
     */
    _addSectionViz: function _addSectionViz(aSectionViz, sSectionId) {
      return aSectionViz.reduce((promiseChain, oViz) => {
        return promiseChain.then(() => {
          if (oViz.isBookmark) {
            return this.appManagerInstance.addBookMark(oViz);
          } else {
            return sSectionId ? this.appManagerInstance.addVisualization(oViz.vizId, sSectionId) : this.appManagerInstance.addVisualization(oViz.vizId);
          }
        });
      }, Promise.resolve());
    },
    _importdone: function _importdone() {
      const stateData = {
        status: true
      };
      this.oEventBus.publish("importChannel", "tilesImported", stateData);
    },
    _setupHeader: function _setupHeader() {
      this.menuItems.forEach(menuItem => this.addAggregation("menuItems", menuItem));
      this.actionButtons.forEach(actionButton => this.addAggregation("actionButtons", actionButton));
      this.setProperty("enableFullScreen", true);
    },
    renderPanel: function _renderPanel() {
      let bRefresh = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      try {
        let _exit = false;
        const _this3 = this;
        function _temp3(_result2) {
          return _exit ? _result2 : Promise.resolve();
        }
        const _temp2 = _catch(function () {
          if (!_this3.tilesContainer || bRefresh) {
            _this3._createWrapperFlexBox();
            return Promise.resolve(_this3.refreshData()).then(function (_await$_this3$refresh) {
              _exit = true;
              return _await$_this3$refresh;
            });
          }
        }, function (error) {
          _this3.fireHandleHidePanel();
        });
        return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(_temp3) : _temp3(_temp2));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    refreshData: function _refreshData() {
      let refreshTiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      try {
        const _this4 = this;
        return Promise.resolve(_this4.appManagerInstance.fetchInsightApps(true, _this4._insightsSectionTitle)).then(function (_this4$appManagerInst) {
          function _temp5() {
            _this4._controlModel.setProperty("/tiles", _this4.aInsightsApps);
            if (_this4.aInsightsApps?.length) {
              _this4.fireHandleUnhidePanel();
              if (refreshTiles && _this4.tilesContainer) {
                const sDefaultAggreName = _this4.tilesContainer.getMetadata().getDefaultAggregationName();
                const dynamicTiles = _this4.tilesContainer.getAggregation(sDefaultAggreName) || [];
                dynamicTiles.forEach(tiles => tiles.refresh?.());
              }
              _this4.fireHandleUnhidePanel();
              _this4._getInsightsContainer().updatePanelsItemCount(_this4.aInsightsApps.length, _this4.getMetadata().getName());
              if (_this4.getProperty("title")) {
                _this4.setProperty("title", `${_this4._i18nBundle?.getText("insights")} ${_this4._i18nBundle.getText("insightsTilesTitle")} (${_this4.aInsightsApps.length})`);
              }
            } else {
              _this4.fireHandleHidePanel();
            }

            //adjust layout
            _this4._adjustLayout();
          }
          _this4.aInsightsApps = _this4$appManagerInst;
          const bIsSmartBusinessTilePresent = _this4.aInsightsApps.some(oApp => oApp.isSmartBusinessTile);
          const _temp4 = function () {
            if (bIsSmartBusinessTilePresent) {
              return Promise.resolve(Lib.load({
                name: "sap.cloudfnd.smartbusiness.lib.reusetiles"
              })).then(function () {});
            }
          }();
          return _temp4 && _temp4.then ? _temp4.then(_temp5) : _temp5(_temp4);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    _createWrapperFlexBox: function _createWrapperFlexBox() {
      if (!this.tilesContainer) {
        if (this.getDeviceType() === DeviceType.Mobile) {
          this.tilesContainer = new HeaderContainer(`${this.getId()}-insightsTilesMobileContainer`, {
            scrollStep: 0,
            scrollStepByItem: 1,
            gridLayout: true,
            scrollTime: 1000,
            showDividers: false
          }).addStyleClass("sectionMarginTopTilesInsight sapMHeaderContainerAlign sapMHeaderContainerMarginBottom tilesBoxShadow");
        } else {
          this.tilesContainer = new GridContainer(`${this.getId()}-insightsTilesContainer`, {}).addStyleClass("insightTiles sapUiSmallMarginTop sapUiSmallMarginBottom");
        }
        this.tilesContainer.setModel(this._controlModel);
        const sDefaultAggreName = this.tilesContainer.getMetadata().getDefaultAggregationName();
        this.tilesContainer.bindAggregation(sDefaultAggreName, {
          path: "/tiles",
          factory: (id, context) => {
            const oApp = context.getObject(),
              oVisualization = this.VizInstantiationService.instantiateVisualization(oApp.visualization);
            oVisualization.setLayoutData?.(new GridContainerItemLayoutData({
              minRows: 2,
              columns: oVisualization.getDisplayFormat?.() === DisplayFormat.Standard ? 2 : 4
            }));
            oVisualization?.bindProperty?.("active", "/activateInsightsTiles");
            return oVisualization;
          }
        });
        this.tilesContainer.addDragDropConfig(new DragDropInfo({
          sourceAggregation: "items",
          targetAggregation: "items",
          dropPosition: dnd.DropPosition.Between,
          dropLayout: dnd.DropLayout.Horizontal,
          drop: oEvent => this._handleTilesDnd(oEvent)
        })).attachBrowserEvent("keydown", event => {
          const disablenavigation = event.metaKey || event.ctrlKey;
          void attachKeyboardHandler(event, disablenavigation, dragDropEvent => this._handleTilesDnd(dragDropEvent));
        });
      }
      this._addContent(this.tilesContainer);
    },
    _handleTilesDnd: function _handleTilesDnd(oEvent) {
      const sInsertPosition = oEvent.getParameter?.("dropPosition"),
        oDragItem = oEvent?.getParameter?.("draggedControl"),
        oDropItem = oEvent.getParameter("droppedControl"),
        iDragItemIndex = oDragItem.getParent()?.indexOfItem(oDragItem);
      let iDropItemIndex = oDragItem.getParent()?.indexOfItem(oDropItem);
      if (sInsertPosition === "Before" && iDragItemIndex === iDropItemIndex - 1) {
        iDropItemIndex--;
      } else if (sInsertPosition === "After" && iDragItemIndex === iDropItemIndex + 1) {
        iDropItemIndex++;
      }
      if (iDragItemIndex !== iDropItemIndex) {
        void this._DragnDropTiles(iDragItemIndex, iDropItemIndex, sInsertPosition);
      }
    },
    _DragnDropTiles: function _DragnDropTiles(iDragItemIndex, iDropItemIndex, sInsertPosition) {
      try {
        const _this5 = this;
        if (sInsertPosition === "Before" && iDragItemIndex < iDropItemIndex) {
          iDropItemIndex--;
        } else if (sInsertPosition === "After" && iDragItemIndex > iDropItemIndex) {
          iDropItemIndex++;
        }
        const oDisplacedItem = _this5.aInsightsApps[iDropItemIndex],
          oItemMoved = _this5.aInsightsApps.splice(iDragItemIndex, 1)[0];
        _this5.aInsightsApps.splice(iDropItemIndex, 0, oItemMoved);
        const moveConfigs = {
          pageId: MYHOME_PAGE_ID,
          sourceSectionIndex: oItemMoved.persConfig?.sectionIndex,
          sourceVisualizationIndex: oItemMoved.persConfig?.visualizationIndex,
          targetSectionIndex: oDisplacedItem.persConfig?.sectionIndex,
          targetVisualizationIndex: oDisplacedItem.persConfig?.visualizationIndex
        };
        _this5._controlModel.setProperty("/tiles", _this5.aInsightsApps);
        return Promise.resolve(_this5.appManagerInstance.moveVisualization(moveConfigs)).then(function () {
          return Promise.resolve(_this5.renderPanel(true)).then(function () {});
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    handleEditTiles: function _handleEditTiles(event) {
      /* If called from Panel Header event.source() will return TilesPanel, if called from Insights Container event.source() will return InsightsContainer.
      _getLayout is available at Container Level*/
      let parent = event.getSource().getParent() || this;
      if (parent?.isA("sap.cux.home.TilesPanel")) {
        parent = parent.getParent();
      }
      parent?._getLayout().openSettingsDialog(SETTINGS_PANELS_KEYS.INSIGHTS_TILES);
    },
    handleRemoveActions: function _handleRemoveActions() {
      this.setProperty("title", "");
      this.setProperty("enableSettings", false);
      this.setProperty("enableFullScreen", false);
      this.removeAllAggregation("actionButtons");
      this.removeAllAggregation("menuItems");
    },
    handleAddActions: function _handleAddActions() {
      this.setProperty("title", `${this._i18nBundle?.getText("insights")} ${this._i18nBundle.getText("insightsTilesTitle")} (${this.aInsightsApps.length})`);
      this.setProperty("enableSettings", true);
      this.setProperty("enableFullScreen", true);
      this._setupHeader();
    },
    _closeAddFromFavDialog: function _closeAddFromFavDialog() {
      this._controlMap.get(this._addFromFavDialogId)?.close();
    },
    /**
     * Navigates to the App Finder with optional group Id.
     * @async
     * @private
     * @param {string} [groupId] - Optional group Id
     */
    navigateToAppFinder: function _navigateToAppFinder(groupId) {
      try {
        return Promise.resolve(Container.getServiceAsync("Navigation")).then(function (navigationService) {
          const navigationObject = {
            pageID: MYHOME_PAGE_ID,
            sectionID: MYINSIGHT_SECTION_ID
          };
          if (groupId) {
            navigationObject.sectionID = groupId;
          }
          return Promise.resolve(navigationService.navigate({
            target: {
              shellHash: `Shell-appfinder?&/catalog/${JSON.stringify(navigationObject)}`
            }
          })).then(function () {});
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Retrieves the key of the legend color based on the provided color value.
     * @param {string} color - The color value for which to retrieve the legend color key.
     * @returns {string} The legend color key corresponding to the provided color value, or the default background color key if not found.
     * @private
     */
    _getLegendColor: function _getLegendColor(color) {
      return END_USER_COLORS().find(oColor => oColor.value === color) || DEFAULT_BG_COLOR();
    },
    /**
     * Handles the addition of tiles from favorite apps.
     * @returns {Promise<void>} A Promise that resolves when the operation is complete.
     * @private
     */
    _handleAddFromFavApps: function _handleAddFromFavApps() {
      try {
        const _this6 = this;
        return Promise.resolve(_this6._getFavToAdd()).then(function (appsToAdd) {
          const dialog = _this6._generateAddFromFavAppsDialog();
          _this6._controlMap.get(`${_this6._addFromFavDialogId}-errorMessage`)?.setVisible(appsToAdd.length === 0);
          _this6._generateAddFromFavAppsListItems(appsToAdd);
          dialog.open();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    _getFavToAdd: function _getFavToAdd() {
      try {
        const _this7 = this;
        return Promise.resolve(_this7.appManagerInstance.fetchFavVizs(false, true)).then(function (aFavApps) {
          const aDynamicApps = aFavApps.filter(function (oDynApp) {
            return oDynApp.isCount || oDynApp.isSmartBusinessTile;
          });
          const aFilteredFavApps = aDynamicApps.filter(oDynApp => {
            const iAppIndex = _this7.aInsightsApps.findIndex(function (oInsightApps) {
              return !oDynApp.visualization?.isBookmark && oInsightApps.visualization?.vizId === oDynApp.visualization?.vizId || oDynApp.visualization?.isBookmark && oInsightApps.visualization?.targetURL === oDynApp.visualization?.targetURL;
            });
            return iAppIndex === -1;
          });
          return aFilteredFavApps;
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Retrieves the selected Apps from the dialog.
     * @returns {sap.m.ListItemBase[]} An array of selected Apps.
     * @private
     */
    _getSelectedInsights: function _getSelectedInsights() {
      const list = this._controlMap.get(`${this._addFromFavDialogId}-list`);
      return list.getSelectedItems() || [];
    },
    _generateAddFromFavAppsListItems: function _generateAddFromFavAppsListItems(appsToAdd) {
      const id = this._addFromFavDialogId;
      const list = this._controlMap.get(`${id}-list`);
      if (appsToAdd.length) {
        list.destroyItems();
        const listItems = appsToAdd.map((app, index) => new CustomListItem({
          id: `${id}-listItem-${index}`,
          content: [new HBox({
            id: `${id}-listItem-${index}-content`,
            alignItems: "Center",
            items: [new Icon({
              id: `${id}-listItem-${index}-content-icon`,
              src: app.icon,
              backgroundColor: this._getLegendColor(app.BGColor || "").value,
              color: "white",
              width: "2.25rem",
              height: "2.25rem",
              size: "1.25rem"
            }).addStyleClass("sapUiRoundedBorder sapUiTinyMargin"), new ObjectIdentifier({
              id: `${id}-listItem-${index}-content-identifier`,
              title: app.title,
              text: app.subtitle,
              tooltip: app.title
            }).addStyleClass("sapUiTinyMargin")]
          })]
        }).addStyleClass("sapUiContentPadding").data("app", app));
        listItems.forEach(item => list.addItem(item));
      }
      list?.setVisible(appsToAdd.length !== 0);
    },
    _generateAddFromFavAppsDialog: function _generateAddFromFavAppsDialog() {
      const id = this._addFromFavDialogId;
      if (!this._controlMap.get(id)) {
        const getAppFinderBtn = (id, btnType) => {
          const appFinderBtn = new Button(id, {
            icon: "sap-icon://action",
            text: this._i18nBundle.getText("appFinderBtn"),
            press: () => {
              this._closeAddFromFavDialog();
              void this.navigateToAppFinder();
            },
            visible: _showAddApps(),
            type: btnType || ButtonType.Default
          });
          addFESRSemanticStepName(appFinderBtn, FESR_EVENTS.PRESS, "tilesAppFinder");
          return appFinderBtn;
        };
        const setAddBtnEnabled = () => {
          const selectedItems = this._getSelectedInsights();
          this._controlMap.get(`${id}-addBtn`).setEnabled(selectedItems.length > 0);
        };
        this._controlMap.set(`${id}-list`, new List({
          id: `${id}-list`,
          mode: "MultiSelect",
          selectionChange: setAddBtnEnabled
        }));
        const addButton = new Button({
          id: `${id}-addBtn`,
          text: this._i18nBundle.getText("addBtn"),
          type: "Emphasized",
          press: () => {
            void this._addFromFavApps();
          },
          enabled: false
        });
        addFESRSemanticStepName(addButton, FESR_EVENTS.PRESS, "addSmartApps");
        this._controlMap.set(`${id}-addBtn`, addButton);
        this._controlMap.set(`${id}-errorMessage`, new IllustratedMessage({
          id: `${id}-errorMessage`,
          illustrationSize: "Spot",
          illustrationType: "sapIllus-AddDimensions",
          title: this._i18nBundle.getText("noAppsTitle"),
          description: this._i18nBundle.getText("tilesSectionNoDataDescription"),
          visible: true
        }).addStyleClass("sapUiLargeMarginTop"));
        this._controlMap.set(id, new Dialog(id, {
          title: this._i18nBundle.getText("addSmartApps"),
          content: [new Label({
            id: `${id}-label`,
            text: this._i18nBundle.getText("suggTileDialogLabel"),
            wrapping: true
          }).addStyleClass("sapMTitleAlign sapUiTinyMarginTopBottom sapUiSmallMarginBeginEnd"), new HBox({
            id: `${id}-textContainer`,
            justifyContent: "SpaceBetween",
            alignItems: "Center",
            items: [new Title({
              id: `${id}-text`,
              text: this._i18nBundle.getText("suggTileDialogTitle")
            }), getAppFinderBtn(`${id}-addAppsBtn`, ButtonType.Transparent)]
          }).addStyleClass("sapUiTinyMarginTop dialogHeader sapUiSmallMarginBeginEnd"), this._controlMap.get(`${id}-list`), this._controlMap.get(`${id}-errorMessage`)],
          contentWidth: "42.75rem",
          contentHeight: "32.5rem",
          endButton: new Button({
            text: this._i18nBundle.getText("closeBtn"),
            press: this._closeAddFromFavDialog.bind(this)
          }),
          escapeHandler: this._closeAddFromFavDialog.bind(this),
          buttons: [this._controlMap.get(`${id}-addBtn`), new Button({
            id: `${id}-cancelBtn`,
            text: this._i18nBundle.getText("cancelBtn"),
            press: this._closeAddFromFavDialog.bind(this)
          })]
        }).addStyleClass("sapContrastPlus sapCuxAddFromInsightsDialog"));
      }
      return this._controlMap.get(id);
    },
    _addFromFavApps: function _addFromFavApps() {
      try {
        const _this8 = this;
        const dialog = _this8._controlMap.get(_this8._addFromFavDialogId);
        dialog.setBusy(true);
        const selectedItems = _this8._getSelectedInsights();
        return Promise.resolve(selectedItems.reduce(function (promise, oApp) {
          return Promise.resolve(promise).then(function () {
            const app = oApp.data("app");
            const oMovingConfig = {
              pageId: MYHOME_PAGE_ID,
              sourceSectionIndex: app.persConfig?.sectionIndex,
              sourceVisualizationIndex: app.persConfig?.visualizationIndex,
              targetSectionIndex: _this8.appManagerInstance.insightsSectionIndex,
              targetVisualizationIndex: -1
            };
            if (app.visualization?.displayFormatHint !== "standard" && app.visualization?.displayFormatHint !== "standardWide") {
              if (app.visualization?.supportedDisplayFormats?.includes("standard")) {
                app.visualization.displayFormatHint = "standard";
              } else if (app.visualization?.supportedDisplayFormats?.includes("standardWide")) {
                app.visualization.displayFormatHint = "standardWide";
              }
            }
            // Add Selected App to Insights Section
            if (!app.visualization?.vizId) {
              app.visualization.vizId = app.visualization?.targetURL || "";
            }
            const _temp6 = function () {
              if (app.visualization?.isBookmark === true) {
                return Promise.resolve(_this8.appManagerInstance.addBookMark(app.visualization, oMovingConfig)).then(function () {});
              } else {
                return Promise.resolve(_this8.appManagerInstance.addVisualization(app.visualization?.vizId, MYINSIGHT_SECTION_ID)).then(function () {});
              }
            }();
            if (_temp6 && _temp6.then) return _temp6.then(function () {});
          });
        }, Promise.resolve())).then(function () {
          return Promise.resolve(_this8.refreshData()).then(function () {
            dialog.setBusy(false);
            dialog.close();
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Calculates the number of visible tiles that can fit within the available width of the parent container.
     *
     * @private
     * @param {ICustomVisualization[]} insightsApps - An array of custom visualizations to be displayed as tiles.
     * @returns {number} - The number of visible tiles.
     */
    _calculateVisibleTileCount: function _calculateVisibleTileCount(insightsApps) {
      const layoutDomRef = this._getInsightsContainer()?._getLayout()?.getDomRef();
      const apps = insightsApps || [];
      let count = 0;
      if (layoutDomRef && apps.length) {
        const sectionDomRef = layoutDomRef.childNodes[0];
        const domProperties = fetchElementProperties(sectionDomRef, ["width", "padding-left", "padding-right"]);
        let availableWidth = domProperties.width - domProperties["padding-left"] - domProperties["padding-right"];
        const widthMap = {};
        widthMap[DisplayFormat.Standard] = 176 + 16; // Width + Gap
        widthMap[DisplayFormat.StandardWide] = 368 + 16; // Width + Gap

        let nextTileWidth = widthMap[apps[count].visualization?.displayFormatHint || DisplayFormat.Standard];
        do {
          availableWidth -= nextTileWidth;
          ++count;
          nextTileWidth = widthMap[apps[count] && apps[count].visualization?.displayFormatHint || DisplayFormat.Standard];
        } while (availableWidth > nextTileWidth);
      }
      return count || 1;
    },
    /**
     * Adjusts the layout of the tiles panel based on the current layout and device type.
     *
     * @private
     * @override
     */
    _adjustLayout: function _adjustLayout() {
      const layout = this._getInsightsContainer()?._getLayout();
      const isFullScreenEnabled = this.getProperty("enableFullScreen");
      const isMobileDevice = this.getDeviceType() === DeviceType.Mobile;
      if (layout && isFullScreenEnabled) {
        const visibleTileCount = isMobileDevice ? this.aInsightsApps?.length : this._calculateVisibleTileCount(this.aInsightsApps);
        const isElementExpanded = layout._getCurrentExpandedElementName() === this.getProperty("fullScreenName");
        this._controlModel.setProperty("/tiles", isElementExpanded ? this.aInsightsApps : this.aInsightsApps?.slice(0, visibleTileCount));

        //Show/Hide Full Screen Button if available
        this._getInsightsContainer()?.toggleFullScreenElements(this, this.aInsightsApps?.length > visibleTileCount, isElementExpanded);
      }
    },
    _getInsightsContainer: function _getInsightsContainer() {
      if (!this.insightsContainer) {
        this.insightsContainer = this.getParent();
      }
      return this.insightsContainer;
    }
  });
  TilesPanel.tilesMenuItems = tilesMenuItems;
  TilesPanel.DisplayFormat = DisplayFormat;
  return TilesPanel;
});
//# sourceMappingURL=TilesPanel-dbg-dbg.js.map
