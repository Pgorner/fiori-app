/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/m/Button", "sap/m/Column", "sap/m/ColumnListItem", "sap/m/FlexBox", "sap/m/HBox", "sap/m/MessageBox", "sap/m/MessageToast", "sap/m/ObjectIdentifier", "sap/m/ScrollContainer", "sap/m/SearchField", "sap/m/Switch", "sap/m/Table", "sap/m/Text", "sap/m/Title", "sap/m/VBox", "sap/ui/core/Element", "sap/ui/core/Icon", "sap/ui/core/dnd/DragDropInfo", "./BaseSettingsPanel", "./TilesPanel", "./utils/AppManager", "./utils/Constants"], function (Button, Column, ColumnListItem, FlexBox, HBox, MessageBox, MessageToast, ObjectIdentifier, ScrollContainer, SearchField, Switch, Table, Text, Title, VBox, UI5Element, Icon, DragDropInfo, __BaseSettingsPanel, ___TilesPanel, __AppManager, ___utils_Constants) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BaseSettingsPanel = _interopRequireDefault(__BaseSettingsPanel);
  const DisplayFormat = ___TilesPanel["DisplayFormat"];
  const AppManager = _interopRequireDefault(__AppManager);
  const MYHOME_PAGE_ID = ___utils_Constants["MYHOME_PAGE_ID"];
  const SETTINGS_PANELS_KEYS = ___utils_Constants["SETTINGS_PANELS_KEYS"];
  /**
   *
   * Class for My Home Insights Tiles Settings Panel.
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
   * @alias sap.cux.home.InsightsTilesSettingsPanel
   */
  const InsightsTilesSettingsPanel = BaseSettingsPanel.extend("sap.cux.home.InsightsTilesSettingsPanel", {
    /**
     * Init lifecycle method
     *
     * @public
     * @override
     */
    init: function _init() {
      try {
        const _this = this;
        BaseSettingsPanel.prototype.init.call(_this);
        _this._controlMap = new Map();

        //setup panel
        _this.setProperty("key", SETTINGS_PANELS_KEYS.INSIGHTS_TILES);
        _this.setProperty("title", _this._i18nBundle.getText("insightsTiles"));
        _this.setProperty("icon", "sap-icon://manager-insight");

        //Fetch Data
        _this.appManagerInstance = AppManager.getInstance();
        return Promise.resolve(_this.appManagerInstance.fetchInsightApps(true, _this._i18nBundle.getText("insights"))).then(function (_this$appManagerInsta) {
          _this._allInsightsApps = _this$appManagerInsta;
          //setup Container & content Aggregation
          _this._wrapperId = `${_this.getId()}-tilesSettingsWrapper`;
          _this._controlMap.set(_this._wrapperId, new FlexBox(_this._wrapperId, {
            alignItems: "Start",
            justifyContent: "Start",
            height: "100%",
            width: "100%",
            direction: "Column"
          }).addStyleClass("flexContainerCards"));
          _this.addAggregation("content", _this._controlMap.get(_this._wrapperId));

          //setup content for the settings panel
          _this._showMessageStrip();
          _this._showToolbar();
          _this._showTilesList();

          //fired every time on panel navigation
          _this.attachPanelNavigated(() => {
            _this._controlMap.get(`${_this._wrapperId}--searchField`).setValue("");
            void _this.appManagerInstance.fetchInsightApps(false, _this._i18nBundle.getText("insights")).then(insightsApps => {
              _this._allInsightsApps = insightsApps;
              _this._controlMap.get(`${_this._wrapperId}--title`).setText(`${_this._i18nBundle.getText("insightsTilesTitle")} (${_this._allInsightsApps.length})`);
              _this._createTableRows(_this._allInsightsApps);
            });
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Add the Message Strip to the wrapper FlexBox.
     *
     * @private
     */
    _showMessageStrip: function _showMessageStrip() {
      const oMessageStripVBox = new VBox(`${this._wrapperId}--msgStripContainer`, {
        width: "calc(100% - 2rem)"
      }).addStyleClass("sapUiSmallMarginTop sapUiSmallMarginBegin");
      oMessageStripVBox.addItem(new Text(`${this._wrapperId}--msgStripText`, {
        text: this._i18nBundle.getText("insightAppsTabText")
      }));
      this._getWrapperFlexBox().addItem(oMessageStripVBox);
    },
    /**
     * Add the Header ToolBar to the wrapper FlexBox.
     *
     * @private
     */
    _showToolbar: function _showToolbar() {
      this._controlMap.set(`${this._wrapperId}--title`, new Title(`${this._wrapperId}--title`, {
        text: `${this._i18nBundle.getText("insightsTilesTitle")} (${this._allInsightsApps.length})`,
        titleStyle: "H5",
        width: "100%"
      }));
      this._controlMap.set(`${this._wrapperId}--searchField`, new SearchField(`${this._wrapperId}--pagesListSearch`, {
        liveChange: oEvent => this._onTilesSearch(oEvent),
        width: "100%"
      }).addStyleClass("sapUiTinyMarginTop"));
      const titleContainer = new HBox(`${this._wrapperId}--titleContainer`, {
        alignItems: "Center",
        justifyContent: "SpaceBetween",
        width: "100%"
      });
      titleContainer.addItem(this._controlMap.get(`${this._wrapperId}--title`));
      const toolbarContainer = new VBox(`${this._wrapperId}--toolbarContainer`, {
        width: "calc(100% - 2rem)",
        items: [titleContainer, this._controlMap.get(`${this._wrapperId}--searchField`)]
      }).addStyleClass("sapUiSmallMarginTop sapUiSmallMarginBegin");
      this._getWrapperFlexBox().addItem(toolbarContainer);
    },
    /**
     * Handles Search Field change
     * @private
     */
    _onTilesSearch: function _onTilesSearch(event) {
      const sSearchQuery = event.getSource().getValue().toLowerCase();
      const filteredTiles = this._allInsightsApps.filter(app => app.visualization?.title?.toLowerCase().includes(sSearchQuery));
      this._createTableRows(filteredTiles);
    },
    /**
     * Adds Tiles List Table to Wrapper FlexBox
     * @private
     */
    _showTilesList: function _showTilesList() {
      this._createTableWithContainer();
      this._createTableRows(this._allInsightsApps);
    },
    /**
     * Creates Table to Render Tiles List
     * @private
     */
    _createTableWithContainer: function _createTableWithContainer() {
      this._controlMap.set(`${this._wrapperId}-table`, new Table(`${this._wrapperId}-table`, {
        columns: [new Column(`${this._wrapperId}-table-dndIcon`, {
          hAlign: "Center",
          width: "6%"
        }), new Column(`${this._wrapperId}-table-title`, {
          width: "94%"
        })],
        dragDropConfig: new DragDropInfo(`${this._wrapperId}-dragDropInfo`, {
          sourceAggregation: "items",
          targetAggregation: "items",
          groupName: "insightsTilesSettingsItems",
          dropPosition: "On",
          drop: event => void this._handleTilesDrop(event)
        })
      }).addStyleClass("sapContrastPlus"));
      const scrollContainer = new ScrollContainer(`${this._wrapperId}-scrollContainer`, {
        vertical: true,
        horizontal: false,
        height: "100%",
        width: "100%",
        content: [this._controlMap.get(`${this._wrapperId}-table`)]
      });
      const containerVBox = new VBox(`${this._wrapperId}-containerVBox`, {
        height: "100%",
        width: "100%",
        justifyContent: "Start",
        direction: "Column",
        items: [scrollContainer]
      });
      const containerFlexBox = new FlexBox(`${this._wrapperId}-containerFlexBox`, {
        alignItems: "Start",
        justifyContent: "Start",
        height: "100%",
        width: "calc(100% - 2rem)",
        direction: "Row",
        items: [containerVBox]
      }).addStyleClass("sapUiSmallMarginBegin sapUiSmallMarginTop flexContainerCards");
      this._getWrapperFlexBox().addItem(containerFlexBox);
    },
    /**
     * Handles Drag Drop of Tiles
     * @private
     */
    _handleTilesDrop: function _handleTilesDrop(oEvent) {
      try {
        const _this2 = this;
        const oDragItem = oEvent.getParameter?.("draggedControl") || oEvent.draggedControl,
          iDragItemIndex = oDragItem.getParent()?.indexOfItem(oDragItem),
          oDropItem = oEvent.getParameter?.("droppedControl") || oEvent.droppedControl,
          iDropItemIndex = oDragItem.getParent()?.indexOfItem(oDropItem),
          oDragItemPersConfig = oDragItem.data("persConfig"),
          oDropItemPersConfig = oDropItem.data("persConfig");
        const _temp = function () {
          if (iDragItemIndex !== iDropItemIndex) {
            _this2._getWrapperFlexBox().setBusy(true);
            const moveConfigs = {
              pageId: MYHOME_PAGE_ID,
              sourceSectionIndex: oDragItemPersConfig.sectionIndex,
              sourceVisualizationIndex: oDragItemPersConfig.visualizationIndex,
              targetSectionIndex: oDropItemPersConfig.sectionIndex,
              targetVisualizationIndex: oDropItemPersConfig.visualizationIndex
            };
            return Promise.resolve(_this2.appManagerInstance.moveVisualization(moveConfigs)).then(function () {
              return Promise.resolve(_this2.appManagerInstance.fetchInsightApps(true, _this2._i18nBundle.getText("insights"))).then(function (_this2$appManagerInst) {
                _this2._allInsightsApps = _this2$appManagerInst;
                _this2._createTableRows(_this2._allInsightsApps);
                return Promise.resolve(_this2._getTilePanel().refreshData()).then(function () {
                  _this2._getWrapperFlexBox().setBusy(false);
                });
              });
            });
          }
        }();
        return Promise.resolve(_temp && _temp.then ? _temp.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Create Table Rows
     * @private
     */
    _createTableRows: function _createTableRows(insightsApps) {
      const table = this._controlMap.get(`${this._wrapperId}-table`);
      table.removeAllItems();
      let filteredTiles = insightsApps;
      const sSearchQuery = this._controlMap.get(`${this._wrapperId}--searchField`).getValue();
      if (sSearchQuery) {
        filteredTiles = this._allInsightsApps.filter(app => app.visualization?.title?.toLowerCase().includes(sSearchQuery));
      }
      filteredTiles.forEach((filteredTile, index) => {
        table.addItem(this._createColumnListItem(filteredTile, index));
      });
    },
    /**
     * Create ColumnListItem for each Insights App
     * @private
     */
    _createColumnListItem: function _createColumnListItem(insightsApp, index) {
      const id = `insightsTiles-${index}-listItem`;
      const existingControl = UI5Element.getElementById(id);
      if (existingControl) {
        existingControl.destroy();
      }
      // Create Column List Item
      const columnListItem = new ColumnListItem({
        id,
        type: "Inactive"
      }).addStyleClass("insightsListItem insightsListMargin manageSectionsTable");

      // Add first cell as Drag & Drop Icon
      columnListItem.addCell(new HBox({
        items: [new Icon({
          src: "sap-icon://BusinessSuiteInAppSymbols/icon-grip"
        }).addStyleClass("tilesDndIcon")]
      }));

      //Create Convert Switch
      const aSupportedDisplayFormats = insightsApp.visualization?.supportedDisplayFormats || "";
      let convertSwitchContainer;
      // if it is not static tile and standard/standardWide display format is supported, display convert switch
      if ((insightsApp.isCount || insightsApp.isSmartBusinessTile) && aSupportedDisplayFormats.length > 1 && aSupportedDisplayFormats.indexOf(DisplayFormat.Standard) > -1 && aSupportedDisplayFormats.indexOf(DisplayFormat.StandardWide) > -1) {
        convertSwitchContainer = new HBox({
          id: `${id}-convertSwitchContainer`,
          alignItems: "Center",
          items: [new Text({
            id: `${id}-switchAppSizeLabel`,
            text: this._i18nBundle.getText("wide"),
            wrapping: false
          }), new Switch({
            id: `${id}-convertSwitch`,
            // ariaLabelledBy="switchAppSizeLabel"
            state: insightsApp.visualization?.displayFormatHint !== DisplayFormat.Standard,
            change: () => void this._onConvertTilePress(insightsApp),
            customTextOn: " ",
            customTextOff: " ",
            tooltip: insightsApp.visualization?.displayFormatHint === DisplayFormat.Standard ? this._i18nBundle.getText("ConvertToWideTile") : this._i18nBundle.getText("ConvertToTile")
          })]
        });
      }
      const deleteBtn = new Button({
        id: `${id}-deleteAppBtn`,
        type: "Transparent",
        icon: "sap-icon://decline",
        press: () => this._onDeleteApp(insightsApp),
        tooltip: this._i18nBundle.getText("removeFromInsights")
      });
      const buttonsWrapper = new HBox({
        id: `${id}-buttonsWrapper`,
        alignItems: "Center"
      }).addStyleClass("sapUiSmallMarginEnd");
      if (convertSwitchContainer) {
        buttonsWrapper.addItem(convertSwitchContainer);
      }
      buttonsWrapper.addItem(deleteBtn);
      columnListItem.addCell(new HBox({
        id: `${id}-cell`,
        alignItems: "Center",
        justifyContent: "SpaceBetween",
        items: [new ObjectIdentifier({
          title: insightsApp.visualization?.title,
          text: insightsApp.visualization?.subtitle,
          tooltip: insightsApp.visualization?.title
        }).addStyleClass("objectIdentifierMargin"), buttonsWrapper]
      }));
      columnListItem.data("persConfig", insightsApp.persConfig);
      return columnListItem;
    },
    /**
     * Handles Convert Tile
     * @private
     */
    _onConvertTilePress: function _onConvertTilePress(app) {
      try {
        const _this3 = this;
        const displayFormatHint = app.visualization?.displayFormatHint,
          updateConfigs = {
            pageId: MYHOME_PAGE_ID,
            sourceSectionIndex: app.persConfig?.sectionIndex,
            sourceVisualizationIndex: app.persConfig?.visualizationIndex,
            oVisualizationData: {
              displayFormatHint: displayFormatHint === DisplayFormat.Standard ? DisplayFormat.StandardWide : DisplayFormat.Standard
            }
          };
        _this3._getWrapperFlexBox().setBusy(true);
        return Promise.resolve(_this3.appManagerInstance.updateVisualizations(updateConfigs)).then(function () {
          return Promise.resolve(_this3._getTilePanel().refreshData()).then(function () {
            if (app.visualization) {
              app.visualization.displayFormatHint = updateConfigs.oVisualizationData.displayFormatHint;
            }
            _this3._getWrapperFlexBox().setBusy(false);
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Deletes Insights App
     * @private
     */
    _onDeleteApp: function _onDeleteApp(app) {
      MessageBox.show(this._i18nBundle.getText("remove_tile_confirmation_title", [app.title]), {
        id: "removeTileConfirmation",
        styleClass: "msgBoxWidth",
        icon: MessageBox.Icon.QUESTION,
        title: this._i18nBundle.getText("remove"),
        actions: [this._i18nBundle.getText("remove"), MessageBox.Action.CANCEL],
        emphasizedAction: this._i18nBundle.getText("remove"),
        onClose: action => this._handleDeleteApp(action, app)
      });
    },
    /**
     * Handle Delete App Confirmation Decision
     * @private
     */
    _handleDeleteApp: function _handleDeleteApp(action, app) {
      try {
        const _this4 = this;
        const _temp2 = function () {
          if (action === _this4._i18nBundle.getText("remove")) {
            _this4._getWrapperFlexBox().setBusy(true);
            return Promise.resolve(_this4.appManagerInstance.removeVisualizations({
              sectionId: app.persConfig?.sectionId,
              vizIds: [app.visualization?.id]
            })).then(function () {
              MessageToast.show(_this4._i18nBundle.getText("appRemovedInsights"));
              return Promise.resolve(_this4.appManagerInstance.fetchInsightApps(true, _this4._i18nBundle.getText("insights"))).then(function (_this4$appManagerInst) {
                _this4._allInsightsApps = _this4$appManagerInst;
                _this4._controlMap.get(`${_this4._wrapperId}--title`).setText(`${_this4._i18nBundle.getText("insightsTilesTitle")} (${_this4._allInsightsApps.length})`);
                _this4._createTableRows(_this4._allInsightsApps);
                return Promise.resolve(_this4._getTilePanel().refreshData()).then(function () {
                  _this4._getWrapperFlexBox().setBusy(false);
                });
              });
            });
          }
        }();
        return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Returns wrapper FlexBox
     * @private
     */
    _getWrapperFlexBox: function _getWrapperFlexBox() {
      return this._controlMap.get(this._wrapperId);
    },
    /**
     * Returns Tiles Panel
     * @private
     */
    _getTilePanel: function _getTilePanel() {
      return this._getPanel();
    }
  });
  return InsightsTilesSettingsPanel;
});
//# sourceMappingURL=InsightsTilesSettingsPanel-dbg-dbg.js.map
