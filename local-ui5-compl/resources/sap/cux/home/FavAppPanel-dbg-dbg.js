/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/base/Log", "sap/f/GridContainer", "sap/f/GridContainerSettings", "sap/m/Button", "sap/m/ColorPalette", "sap/m/ColorPalettePopover", "sap/m/CustomListItem", "sap/m/Dialog", "sap/m/HBox", "sap/m/IllustratedMessage", "sap/m/Input", "sap/m/Label", "sap/m/List", "sap/m/MessageBox", "sap/m/MessageStrip", "sap/m/MessageToast", "sap/m/NavContainer", "sap/m/ObjectIdentifier", "sap/m/Page", "sap/m/Popover", "sap/m/ScrollContainer", "sap/m/SearchField", "sap/m/StandardListItem", "sap/m/Text", "sap/m/Title", "sap/m/Toolbar", "sap/m/ToolbarSpacer", "sap/m/VBox", "sap/m/library", "sap/ui/base/Event", "sap/ui/core/Element", "sap/ui/core/EventBus", "sap/ui/core/Icon", "sap/ui/core/dnd/DragDropInfo", "sap/ui/core/library", "sap/ui/core/message/MessageType", "sap/ui/core/theming/Parameters", "sap/ui/layout/form/SimpleForm", "sap/ui/layout/library", "sap/ushell/Config", "sap/ushell/Container", "sap/ushell/components/pages/MyHomeImport", "sap/ushell/components/pages/controller/PageRuntime.controller", "./BaseApp", "./BaseAppPersPanel", "./Group", "./MenuItem", "./utils/Constants", "./utils/DataFormatUtils", "./utils/DragDropUtils", "./utils/FESRUtil"], function (Log, GridContainer, GridContainerSettings, Button, ColorPalette, ColorPalettePopover, CustomListItem, Dialog, HBox, IllustratedMessage, Input, Label, List, MessageBox, MessageStrip, MessageToast, NavContainer, ObjectIdentifier, Page, Popover, ScrollContainer, SearchField, StandardListItem, Text, Title, Toolbar, ToolbarSpacer, VBox, sap_m_library, Event, Element, EventBus, Icon, DragDropInfo, sap_ui_core_library, MessageType, Parameters, SimpleForm, sap_ui_layout_library, Config, Container, MyHomeImport, PageRuntime, ___BaseApp, __BaseAppPersPanel, __Group, __MenuItem, ___utils_Constants, __DataFormatUtils, ___utils_DragDropUtils, ___utils_FESRUtil) {
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
  function _finallyRethrows(body, finalizer) {
    try {
      var result = body();
    } catch (e) {
      return finalizer(true, e);
    }
    if (result && result.then) {
      return result.then(finalizer.bind(null, false), finalizer.bind(null, true));
    }
    return finalizer(false, result);
  }
  const ListType = sap_m_library["ListType"];
  const _iteratorSymbol = /*#__PURE__*/typeof Symbol !== "undefined" ? Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator")) : "@@iterator";
  function _settle(pact, state, value) {
    if (!pact.s) {
      if (value instanceof _Pact) {
        if (value.s) {
          if (state & 1) {
            state = value.s;
          }
          value = value.v;
        } else {
          value.o = _settle.bind(null, pact, state);
          return;
        }
      }
      if (value && value.then) {
        value.then(_settle.bind(null, pact, state), _settle.bind(null, pact, 2));
        return;
      }
      pact.s = state;
      pact.v = value;
      const observer = pact.o;
      if (observer) {
        observer(pact);
      }
    }
  }
  const _Pact = /*#__PURE__*/function () {
    function _Pact() {}
    _Pact.prototype.then = function (onFulfilled, onRejected) {
      const result = new _Pact();
      const state = this.s;
      if (state) {
        const callback = state & 1 ? onFulfilled : onRejected;
        if (callback) {
          try {
            _settle(result, 1, callback(this.v));
          } catch (e) {
            _settle(result, 2, e);
          }
          return result;
        } else {
          return this;
        }
      }
      this.o = function (_this) {
        try {
          const value = _this.v;
          if (_this.s & 1) {
            _settle(result, 1, onFulfilled ? onFulfilled(value) : value);
          } else if (onRejected) {
            _settle(result, 1, onRejected(value));
          } else {
            _settle(result, 2, value);
          }
        } catch (e) {
          _settle(result, 2, e);
        }
      };
      return result;
    };
    return _Pact;
  }();
  function _isSettledPact(thenable) {
    return thenable instanceof _Pact && thenable.s & 1;
  }
  function _forTo(array, body, check) {
    var i = -1,
      pact,
      reject;
    function _cycle(result) {
      try {
        while (++i < array.length && (!check || !check())) {
          result = body(i);
          if (result && result.then) {
            if (_isSettledPact(result)) {
              result = result.v;
            } else {
              result.then(_cycle, reject || (reject = _settle.bind(null, pact = new _Pact(), 2)));
              return;
            }
          }
        }
        if (pact) {
          _settle(pact, 1, result);
        } else {
          pact = result;
        }
      } catch (e) {
        _settle(pact || (pact = new _Pact()), 2, e);
      }
    }
    _cycle();
    return pact;
  }
  const PlacementType = sap_m_library["PlacementType"];
  function _forOf(target, body, check) {
    if (typeof target[_iteratorSymbol] === "function") {
      var iterator = target[_iteratorSymbol](),
        step,
        pact,
        reject;
      function _cycle(result) {
        try {
          while (!(step = iterator.next()).done && (!check || !check())) {
            result = body(step.value);
            if (result && result.then) {
              if (_isSettledPact(result)) {
                result = result.v;
              } else {
                result.then(_cycle, reject || (reject = _settle.bind(null, pact = new _Pact(), 2)));
                return;
              }
            }
          }
          if (pact) {
            _settle(pact, 1, result);
          } else {
            pact = result;
          }
        } catch (e) {
          _settle(pact || (pact = new _Pact()), 2, e);
        }
      }
      _cycle();
      if (iterator.return) {
        var _fixup = function (value) {
          try {
            if (!step.done) {
              iterator.return();
            }
          } catch (e) {}
          return value;
        };
        if (pact && pact.then) {
          return pact.then(_fixup, function (e) {
            throw _fixup(e);
          });
        }
        _fixup();
      }
      return pact;
    }
    // No support for Symbol.iterator
    if (!("length" in target)) {
      throw new TypeError("Object is not iterable");
    }
    // Handle live collections properly
    var values = [];
    for (var i = 0; i < target.length; i++) {
      values.push(target[i]);
    }
    return _forTo(values, function (i) {
      return body(values[i]);
    }, check);
  }
  const dnd = sap_ui_core_library["dnd"];
  const form = sap_ui_layout_library["form"];
  const ActionsPopover = ___BaseApp["ActionsPopover"];
  const BaseAppPersPanel = _interopRequireDefault(__BaseAppPersPanel);
  const Group = _interopRequireDefault(__Group);
  const MenuItem = _interopRequireDefault(__MenuItem);
  const DEFAULT_BG_COLOR = ___utils_Constants["DEFAULT_BG_COLOR"];
  const END_USER_COLORS = ___utils_Constants["END_USER_COLORS"];
  const MYHOME_PAGE_ID = ___utils_Constants["MYHOME_PAGE_ID"];
  const DataFormatUtils = _interopRequireDefault(__DataFormatUtils);
  const attachKeyboardHandler = ___utils_DragDropUtils["attachKeyboardHandler"];
  const addFESRId = ___utils_FESRUtil["addFESRId"];
  const addFESRSemanticStepName = ___utils_FESRUtil["addFESRSemanticStepName"];
  const _showAddApps = () => {
    return Config.last("/core/shell/enablePersonalization") || Config.last("/core/catalog/enabled");
  };

  /**
   *
   * Provides the FavAppPanel Class.
   *
   * @extends sap.cux.home.BaseAppPersPanel
   *
   * @author SAP SE
   * @version 0.0.1
   * @since 1.121.0
   *
   * @private
   * @experimental
   * @hidden
   *
   * @alias sap.cux.home.FavAppPanel
   */
  const FavAppPanel = BaseAppPersPanel.extend("sap.cux.home.FavAppPanel", {
    constructor: function constructor() {
      BaseAppPersPanel.prototype.constructor.apply(this, arguments);
      this._selectedApps = [];
      /**
       * Updates the color personalization for an app.
       * @param {IAppPersonalization[]} personalizations - The array of app personalizations.
       * @param {IUpdatePersonalizationConfig} updateConfig - The update configuration.
       * @returns {void}
       * @private
       */
      this._updateAppColorPersonalization = (personalizations, updateConfig) => {
        const {
          visualization,
          color
        } = updateConfig;
        const {
          appId,
          oldAppId,
          persConfig
        } = visualization;
        const sourceGroupId = persConfig?.sectionId;
        const isSourceGroupDefault = persConfig?.isDefaultSection;
        const personalizationIndex = this._getPersonalizationIndex(personalizations, {
          appId,
          oldAppId,
          sectionId: sourceGroupId,
          isRecentlyAddedApp: isSourceGroupDefault
        });
        if (personalizationIndex > -1) {
          personalizations[personalizationIndex].BGColor = color;
        } else {
          personalizations.push({
            BGColor: color,
            sectionId: sourceGroupId,
            isRecentlyAddedApp: isSourceGroupDefault,
            appId,
            isSection: false
          });
        }
      };
    },
    metadata: {
      library: "sap.cux.home",
      defaultAggregation: "apps",
      aggregations: {
        /**
         * Apps aggregation for Favorite apps
         */
        apps: {
          type: "sap.cux.home.App",
          singularName: "app",
          multiple: true,
          visibility: "hidden"
        },
        /**
         * Group aggregation for Favorite apps
         */
        groups: {
          type: "sap.cux.home.Group",
          singularName: "group",
          multiple: true,
          visibility: "hidden"
        }
      }
    },
    init: function _init() {
      BaseAppPersPanel.prototype.init.call(this);
      //Configure Header
      this.setProperty("key", "favApps");
      this.setProperty("title", this._i18nBundle.getText("favoritesTab"));
      this.setProperty("tooltip", this._i18nBundle.getText("favAppsInfo"));
      //Setup Action Buttons
      void this._createActionButtons();
      //Setup Menu Items
      this._createHeaderMenuItems();
      //add drag and drop config
      this._generateAppsWrapper()?.addDragDropConfig(new DragDropInfo(`${this.getId()}-dragDropInfo`, {
        sourceAggregation: "items",
        targetAggregation: "items",
        dropPosition: dnd.DropPosition.OnOrBetween,
        dropLayout: dnd.DropLayout.Horizontal,
        drop: event => {
          void this._onFavItemDrop(event);
        }
      })).attachBrowserEvent("keydown", event => {
        const disablenavigation = event.metaKey || event.ctrlKey;
        void attachKeyboardHandler(event, disablenavigation, dragDropEvent => this._onFavItemDrop(dragDropEvent));
      }).attachBrowserEvent("keydown", event => this._handleKeyboardMoveApp(event));
      this.oEventBus = EventBus.getInstance();
      // Subscribe to the event
      this.oEventBus.subscribe("importChannel", "appsImport", (sChannelId, sEventId, oData) => {
        const _this = this;
        const aSections = oData;
        aSections.forEach(function (oSection) {
          try {
            return Promise.resolve(_this.appManagerInstance.addSection({
              id: oSection.id,
              title: oSection.title,
              default: oSection.default,
              preset: oSection.preset,
              visualizations: oSection.visualizations
            })).then(function () {});
          } catch (e) {
            return Promise.reject(e);
          }
        });
        this._importdone();
      }, this);
      this.oEventBus.subscribe("importChannel", "resetImported", () => {
        this.setImportButtonVisibility(true);
      }, this);
      this.attachNavigated(() => {
        // if while navigating to different page, a group detail dialog was open, then while navigating back group detail dialog should be in open state.
        if (this._selectedGroupId) {
          void this._showGroupDetailDialog(this._selectedGroupId);
        }
      });
      document.addEventListener("click", event => this._resetCutElement(event));
      document.addEventListener("keydown", event => this._resetCutElement(event));
    },
    _importdone: function _importdone() {
      const stateData = {
        status: true
      };
      this.oEventBus.publish("importChannel", "appsImported", stateData);
    },
    /**
     * Fetch fav apps and set apps aggregation
     * @private
     */
    loadApps: function _loadApps() {
      try {
        const _this2 = this;
        return Promise.resolve(_this2.appManagerInstance.fetchFavVizs(true, false)).then(function (favoriteVisualizations) {
          //Create groups
          _this2.destroyAggregation("groups", true);
          const groupVisualizations = favoriteVisualizations.filter(visualization => visualization.isSection).map(groupVisualization => {
            return {
              ...groupVisualization,
              menuItems: _this2._getGroupActions(groupVisualization)
            };
          });
          const groups = _this2._generateGroups(groupVisualizations);
          _this2._setGroups(groups);

          //Create apps
          _this2.destroyAggregation("apps", true);
          const appVisualizations = favoriteVisualizations.filter(visualization => !visualization.isSection).map(appVisualization => {
            return {
              ...appVisualization,
              menuItems: _this2._getAppActions()
            };
          });
          const apps = _this2.generateApps(appVisualizations);
          _this2.setApps(apps);
          if (_this2._selectedGroupId) {
            void _this2._setGroupDetailDialogApps(_this2._selectedGroupId);
          }
          const container = _this2.getParent();
          container.toggleMenuListItem(_this2._createGroupMenuItem, _this2.getApps().length > 0);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Creates and returns group instances for given group objects
     * @private
     * @param {object[]} aGroupObject - Array of group object.
     * @returns {sap.cux.home.Group[]} - Array of group instances
     */
    _generateGroups: function _generateGroups(groupVisualizations) {
      return groupVisualizations.map((groupVisualization, index) => {
        const group = new Group(`${this.getId()}-group-${index}`, {
          title: groupVisualization.title,
          bgColor: groupVisualization.BGColor,
          status: groupVisualization.status,
          icon: groupVisualization.icon,
          number: groupVisualization.badge,
          groupId: groupVisualization.id,
          press: this._handleGroupPress.bind(this)
        });
        groupVisualization.menuItems?.forEach(oMenuItem => {
          group.addAggregation("menuItems", oMenuItem);
        });
        return group;
      });
    },
    /**
     * Add multiple groups in the groups aggregation.
     * @private
     * @param {sap.cux.home.Group[]} groups - Array of groups.
     */
    _setGroups: function _setGroups(groups) {
      groups.forEach(group => {
        this.addAggregation("groups", group, true);
      });
    },
    /**
     * Returns list of actions available for app
     * @param {ssap.cux.home.Group} group - The group containing the app.
     * @private
     * @returns {sap.cux.home.MenuItem[]} - An array of menu items representing available actions for the app.
     */
    _getAppActions: function _getAppActions(group) {
      const groupId = group?.getGroupId();
      const isUngroupedApp = !groupId;
      const appActions = [];
      const selectColorMenuItem = new MenuItem("", {
        title: this._i18nBundle.getText("selectColor"),
        type: ListType.Navigation,
        press: this._openColorPopover.bind(this)
      });
      appActions.push(selectColorMenuItem);
      addFESRId(selectColorMenuItem, "changeColor");
      if (this._getAllowedMoveGroups(groupId)?.length >= 1) {
        const moveToMenuItem = new MenuItem("", {
          title: this._i18nBundle.getText("moveTo"),
          type: ListType.Navigation,
          press: event => this._openMoveToGroupPopover(event, group)
        });
        appActions.push(moveToMenuItem);
        addFESRId(moveToMenuItem, "moveToGroup");
      }
      if (isUngroupedApp) {
        const createGroupMenuItem = new MenuItem({
          title: this._i18nBundle.getText("createGroup"),
          press: event => {
            const source = event.getSource();
            const app = source.getParent();
            this._selectedApps = [app];
            this._openCreateGroupDialog();
          }
        });
        appActions.push(createGroupMenuItem);
        addFESRId(createGroupMenuItem, "createGroupDialog");
      }
      const removeFromMyHomeMenuItem = new MenuItem({
        title: this._i18nBundle.getText("removeFromMyHome"),
        press: event => {
          const source = event.getSource();
          const app = source.getParent();
          this._handleRemove(app, group);
        }
      });
      appActions.push(removeFromMyHomeMenuItem);
      addFESRId(removeFromMyHomeMenuItem, "removeFromMyHome");
      if (!isUngroupedApp) {
        const removeFromGroupMenuItem = new MenuItem({
          title: this._i18nBundle.getText("removeFromGroup"),
          press: event => {
            const source = event.getSource();
            const app = source.getParent();
            void this._handleMoveToGroup(app, groupId);
          }
        });
        appActions.push(removeFromGroupMenuItem);
        addFESRId(removeFromGroupMenuItem, "ungroupApp");
      }
      return appActions;
    },
    /**
     * Returns list of actions available for selected group
     * @private
     * @param {sap.cux.home.Group} group - Group
     * @returns {sap.cux.home.MenuItem[]} - An array of menu items representing available actions for the group.
     */
    _getGroupActions: function _getGroupActions(group) {
      const renameGroupMenuItem = new MenuItem(`id-${group.id}-renameGroup`, {
        title: this._i18nBundle.getText("renameGroup"),
        press: this._onRenameGroup.bind(this)
      });
      addFESRId(renameGroupMenuItem, "renameGroup");
      const selectColorMenuItem = new MenuItem(`id-${group.id}-selectColor`, {
        title: this._i18nBundle.getText("selectColor"),
        type: ListType.Navigation,
        press: this._openColorPopover.bind(this)
      });
      addFESRId(selectColorMenuItem, "changeColor");
      const removeAllAppsMenuItem = new MenuItem(`id-${group.id}-removeAllApps`, {
        title: this._i18nBundle.getText("removeAllApps"),
        press: this._handleUngroupApps.bind(this, group)
      });
      addFESRId(removeAllAppsMenuItem, "removeAllApps");
      const groupActions = [renameGroupMenuItem, selectColorMenuItem, removeAllAppsMenuItem];
      if (!group.isPresetSection) {
        const deleteGroupMenuItem = new MenuItem(`id-${group.id}-delete`, {
          title: this._i18nBundle.getText("delete"),
          press: this._onDeleteGroup.bind(this)
        });
        addFESRId(deleteGroupMenuItem, "deleteGroup");
        groupActions.push(deleteGroupMenuItem);
      }
      return groupActions;
    },
    /**
     * Creates actions buttons for panel.
     * @private
     */
    _createActionButtons: function _createActionButtons() {
      try {
        const _this3 = this;
        if (!_this3._actionButtons) {
          _this3._actionButtons = [];
          if (_showAddApps()) {
            const addAppsBtn = new Button(`${_this3.getId()}-addAppsBtn`, {
              icon: "sap-icon://action",
              tooltip: _this3._i18nBundle.getText("addAppsTooltip"),
              text: _this3._i18nBundle.getText("addApps"),
              press: () => {
                void _this3.navigateToAppFinder();
              }
            });
            addFESRId(addAppsBtn, "addAppsBtn");
            _this3._actionButtons.push(addAppsBtn);
          }
        }
        _this3._actionButtons.forEach(actionButton => {
          _this3.addAggregation("actionButtons", actionButton);
        });
        return Promise.resolve(_this3._validateAppsMigration()).then(function (isImportEnabled) {
          if (isImportEnabled) {
            _this3._createImportButton();
          }
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    _createImportButton: function _createImportButton() {
      if (!this._importButton) {
        this._importButton = new Button(`${this.getId()}-importAppsBtn`, {
          tooltip: this._i18nBundle.getText("importAppsNow"),
          text: this._i18nBundle.getText("importAppsNow"),
          press: this._openImportAppsDialog.bind(this)
        });
        addFESRId(this._importButton, "importAppsDialog");
        this._actionButtons.push(this._importButton);
        this.insertAggregation("actionButtons", this._importButton, 0);
      }
      return this._importButton;
    },
    setImportButtonVisibility: function _setImportButtonVisibility(bVisible) {
      this._createImportButton().setVisible(bVisible);
    },
    /**
     * Creates menu items for panel header.
     * @private
     */
    _createHeaderMenuItems: function _createHeaderMenuItems() {
      if (!this._menuItems) {
        this._createGroupMenuItem = new MenuItem(`${this.getId()}-createGrpMenuBtn`, {
          title: this._i18nBundle.getText("createGroup"),
          icon: "sap-icon://add",
          press: () => this._openCreateGroupDialog()
        });
        this._menuItems = [this._createGroupMenuItem];
        if (_showAddApps()) {
          this._menuItems.push(new MenuItem(`${this.getId()}-addAppsMenuBtn`, {
            title: this._i18nBundle.getText("addApps"),
            icon: "sap-icon://action",
            press: () => {
              void this.navigateToAppFinder();
            }
          }));
        }
        this._menuItems.push(new MenuItem(`${this.getId()}-addInsightsMenuBtn`, {
          title: this._i18nBundle.getText("addFromInsights"),
          icon: "sap-icon://duplicate",
          press: () => {
            void this._handleAddFromInsights();
          }
        }));
        // Assign FESR IDs based on menu items
        addFESRId(this._createGroupMenuItem, "createGroupDialog");
        const addAppsMenuItem = this._menuItems.find(item => item.getId() === `${this.getId()}-addAppsMenuBtn`);
        if (addAppsMenuItem) {
          addFESRId(addAppsMenuItem, "appsAppFinder");
        }
        const addInsightsMenuItem = this._menuItems.find(item => item.getId() === `${this.getId()}-addInsightsMenuBtn`);
        if (addInsightsMenuItem) {
          addFESRId(addInsightsMenuItem, "staticTilesDialog");
        }
        this._menuItems.forEach(oMenuItem => {
          this.addAggregation("menuItems", oMenuItem, true);
        });
      }
    },
    /**
     * Retrieves drag and drop information from the given event.
     * @private
     * @param {Event<DropInfo$DropEventParameters>} event - The event containing drag and drop information.
     * @returns {Promise<IDragDropInfo>} The drag and drop information.
     */
    _getDragDropInfo: function _getDragDropInfo(event, appGroupId) {
      try {
        const _this4 = this;
        const dragTile = event.getParameter?.("draggedControl"),
          dropTile = event.getParameter?.("droppedControl"),
          dropPosition = event.getParameter?.("dropPosition"),
          dropControl = dragTile.getParent(),
          dragItemIndex = dropControl.indexOfItem(dragTile),
          dropItemIndex = dropControl.indexOfItem(dropTile),
          dragItem = _this4._getTileItem(dragTile, appGroupId),
          dropItem = _this4._getTileItem(dropTile, appGroupId);
        const dragDropInfo = {
          dragItem: dragItem,
          dropItem: dropItem,
          dropPosition: dropPosition,
          dropControl,
          dragItemIndex,
          dropItemIndex
        };
        //adjust drap drop info
        const _temp3 = function () {
          if (dragItemIndex !== dropItemIndex) {
            const _temp2 = function () {
              if (!dragItem?.isA("sap.cux.home.Group") && !dropItem?.isA("sap.cux.home.Group")) {
                return Promise.resolve(_this4._adjustAppDragDropInfo(dragDropInfo, appGroupId)).then(function () {});
              } else {
                const _temp = function () {
                  if (dragItem?.isA("sap.cux.home.Group")) {
                    return Promise.resolve(_this4._adjustGroupDragDropInfo(dragDropInfo)).then(function () {});
                  }
                }();
                if (_temp && _temp.then) return _temp.then(function () {});
              }
            }();
            if (_temp2 && _temp2.then) return _temp2.then(function () {});
          }
        }();
        return Promise.resolve(_temp3 && _temp3.then ? _temp3.then(function () {
          return dragDropInfo;
        }) : dragDropInfo);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Adjusts apps drag and drop information.
     * @private
     * @param {IDragDropInfo} dragDropInfo - The drag and drop information to adjust.
     * @returns {Promise<void>} A Promise that resolves when the adjustment is completed.
     */
    _adjustAppDragDropInfo: function _adjustAppDragDropInfo(dragDropInfo, appGroupId) {
      try {
        const _this5 = this;
        let isUpdated = false;
        const dragApp = dragDropInfo.dragItem;
        const dropApp = dragDropInfo.dropItem;
        return Promise.resolve(Promise.all([_this5.appManagerInstance.getVisualization(dragApp.getUrl(), appGroupId), _this5.appManagerInstance.getVisualization(dropApp.getUrl(), appGroupId)])).then(function (_ref) {
          let [dragVisualization, dropVisualization] = _ref;
          if (dragDropInfo.dropPosition === dnd.RelativeDropPosition.Before) {
            //let's say there are two apps a1, a2, if a1 is moved before a2, that essentailly means the drop item index is same as current item index, adjust the dropItemIndex accordingly
            if (dragDropInfo.dragItemIndex === dragDropInfo.dropItemIndex - 1) {
              dragDropInfo.dropItemIndex--;
            }
            if (dragDropInfo.dragItemIndex < dragDropInfo.dropItemIndex && dragVisualization?.persConfig?.sectionIndex === dropVisualization?.persConfig?.sectionIndex) {
              dragDropInfo.dropItemIndex--;
              isUpdated = true;
            }
          } else if (dragDropInfo.dropPosition === dnd.RelativeDropPosition.After) {
            if (dragDropInfo.dragItemIndex === dragDropInfo.dropItemIndex + 1) {
              dragDropInfo.dropItemIndex++;
            }
            if (dragDropInfo.dragItemIndex > dragDropInfo.dropItemIndex && dragVisualization?.persConfig?.sectionIndex === dropVisualization?.persConfig?.sectionIndex) {
              dragDropInfo.dropItemIndex++;
              isUpdated = true;
            }
          }
          if (isUpdated) {
            const tile = dragDropInfo.dropControl.getItems()[dragDropInfo.dropItemIndex];
            const app = _this5._getTileItem(tile, appGroupId);
            if (app) {
              dragDropInfo.dropItem = app;
            }
          }
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    _getTileItem: function _getTileItem(tile, appGroupId) {
      const tileGroupId = tile.data("groupId");
      if (tileGroupId) {
        //tile is a group
        return this._getGroup(tileGroupId);
      } else {
        const group = appGroupId ? this._getGroup(appGroupId) : null;
        const apps = group ? group.getApps() : this.getApps();
        return apps.find(app => DataFormatUtils.getLeanURL(app.getUrl()) === tile.getUrl());
      }
    },
    /**
     * Adjusts app/group drag and drop information.
     * @private
     * @param {IDragDropInfo} dragDropInfo - The drag and drop information to adjust.
     * @returns {Promise<void>} A Promise that resolves when the adjustment is completed.
     */
    _adjustGroupDragDropInfo: function _adjustGroupDragDropInfo(dragDropInfo) {
      try {
        const _this6 = this;
        return Promise.resolve(_this6.appManagerInstance._getSections()).then(function (sections) {
          let dropGroupIndex;
          dragDropInfo.dragItemIndex = sections.findIndex(section => section.id === dragDropInfo.dragItem.getGroupId());

          //If dropped app is the first ungrouped app, put the group at the end
          if (!dragDropInfo.dropItem.isA("sap.cux.home.Group")) {
            const lastGroupIndex = _this6.getAggregation("groups").length;
            dragDropInfo.dropItemIndex = dragDropInfo.dropPosition === dnd.RelativeDropPosition.Before && dragDropInfo.dropItemIndex === lastGroupIndex && dragDropInfo.dragItemIndex !== lastGroupIndex ? lastGroupIndex + 1 : dragDropInfo.dragItemIndex;
          } else {
            dropGroupIndex = sections.findIndex(section => section.id === dragDropInfo.dropItem.getGroupId());
            //update the drop item with section index
            dragDropInfo.dropItemIndex = dropGroupIndex;
          }

          //let's say there are two groups g1, g2, if g1 is moved before g2, that essentailly means the drop item index is same as current item index, adjust the dropItemIndex accordingly
          if (dragDropInfo.dropPosition === dnd.RelativeDropPosition.Before && dragDropInfo.dragItemIndex === dragDropInfo.dropItemIndex - 1) {
            dragDropInfo.dropItemIndex--;
          } else if (dragDropInfo.dropPosition === dnd.RelativeDropPosition.After && (dragDropInfo.dragItemIndex !== dragDropInfo.dropItemIndex || dropGroupIndex && dragDropInfo.dropItemIndex >= dropGroupIndex)) {
            dragDropInfo.dropItemIndex++;
          }
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Handler for drop event of a favorite item.
     * @private
     * @param {Event<DropInfo$DropEventParameters>} event - The drop event containing information about the dropped item.
     * @returns {Promise<void>} A Promise that resolves when the drop event handling is completed.
     */
    _onFavItemDrop: function _onFavItemDrop(event, appGroupId) {
      try {
        const _this7 = this;
        const dragTile = event.getParameter?.("draggedControl");
        return Promise.resolve(_this7._getDragDropInfo(event, appGroupId)).then(function (dragDropInfo) {
          function _temp6() {
            dragTile.removeStyleClass("sapMGTPressActive");
          }
          const {
            dragItemIndex,
            dropItemIndex,
            dropPosition,
            dragItem,
            dropItem
          } = dragDropInfo;
          if (dragItemIndex === dropItemIndex) return;
          const _temp5 = function () {
            if (dropPosition === dnd.RelativeDropPosition.On) {
              return Promise.resolve(_this7._handleOnItemDrop(dragItem, dropItem)).then(function () {
                void _this7.refresh();
              });
            } else {
              const _temp4 = function () {
                if (dropPosition === dnd.RelativeDropPosition.After || dropPosition === dnd.RelativeDropPosition.Before) {
                  _this7._setBusy(true);
                  return Promise.resolve(_this7._handleItemsReorder(dragDropInfo, appGroupId)).then(function () {
                    return Promise.resolve(_this7.refresh()).then(function () {
                      if (appGroupId) {
                        void _this7._setGroupDetailDialogApps(appGroupId);
                      }
                      _this7._setBusy(false);
                    });
                  });
                }
              }();
              if (_temp4 && _temp4.then) return _temp4.then(function () {});
            }
          }();
          return _temp5 && _temp5.then ? _temp5.then(_temp6) : _temp6(_temp5);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Handles the drop of an item onto another item.
     * If an app in dropped over another app, create group dialog is opened.
     * If an app is dropped over a group, app should be moved inside that group.
     * @private
     * @param {Group | App} dragItem - The item being dragged.
     * @param {Group | App} dropItem - The item onto which the dragItem is dropped.
     * @returns {Promise<void>} A Promise that resolves when the dropping of the item is completed.
     */
    _handleOnItemDrop: function _handleOnItemDrop(dragItem, dropItem) {
      try {
        const _this8 = this;
        if (dragItem.isA("sap.cux.home.Group")) return Promise.resolve();
        const _temp7 = function () {
          if (!dropItem.isA("sap.cux.home.Group")) {
            //if both dragged and dropped items are apps, create group dialog is opened.
            const dragApp = dragItem;
            const dropApp = dropItem;
            _this8._selectedApps = [dragApp, dropApp];
            _this8._openCreateGroupDialog(true);
          } else {
            //if dragged item is an app and dropped item is a group, app should be moved into that group.
            const targetGroupId = dropItem.getGroupId();
            _this8._setBusy(true);
            return Promise.resolve(_this8._handleMoveToGroup(dragItem, undefined, targetGroupId)).then(function () {
              _this8._setBusy(false);
            });
          }
        }();
        return Promise.resolve(_temp7 && _temp7.then ? _temp7.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Handles the reordering of items based on drag and drop information.
     * @private
     * @param {IDragDropInfo} dragDropInfo - The drag and drop information.
     * @returns {Promise<void>} A Promise that resolves when the reordering is completed.
     */
    _handleItemsReorder: function _handleItemsReorder(dragDropInfo, appGroupId) {
      try {
        const _this9 = this;
        const {
          dragItem,
          dropItem,
          dragItemIndex,
          dropItemIndex
        } = dragDropInfo;
        const isDragItemGroup = dragItem.isA("sap.cux.home.Group");
        const isDropItemGroup = dropItem.isA("sap.cux.home.Group");
        const _temp9 = function () {
          if (!isDragItemGroup && !isDropItemGroup) {
            const drapApp = dragItem;
            const dropApp = dropItem;
            return Promise.resolve(Promise.all([_this9.appManagerInstance.getVisualization(drapApp.getUrl(), appGroupId), _this9.appManagerInstance.getVisualization(dropApp.getUrl(), appGroupId)])).then(function (_ref2) {
              let [dragVisualization, dropVisualization] = _ref2;
              return Promise.resolve(_this9.appManagerInstance.moveVisualization({
                sourceSectionIndex: dragVisualization?.persConfig?.sectionIndex,
                sourceVisualizationIndex: dragVisualization?.persConfig?.visualizationIndex,
                targetSectionIndex: dropVisualization?.persConfig?.sectionIndex,
                targetVisualizationIndex: dropVisualization?.persConfig?.visualizationIndex
              })).then(function () {});
            });
          } else {
            const _temp8 = function () {
              if (isDragItemGroup && isDropItemGroup) {
                return Promise.resolve(_this9.appManagerInstance.moveSection(dragItemIndex, dropItemIndex)).then(function () {});
              }
            }();
            if (_temp8 && _temp8.then) return _temp8.then(function () {});
          }
        }();
        return Promise.resolve(_temp9 && _temp9.then ? _temp9.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
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
            pageID: MYHOME_PAGE_ID
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
     * Validates if import apps is enabled
     *
     *@returns {Promise} - resolves to boolean value (import is enabled/disabled)
     */
    _validateAppsMigration: function _validateAppsMigration() {
      try {
        return Promise.resolve(MyHomeImport.isImportEnabled());
      } catch (e) {
        return Promise.reject(e);
      }
    },
    _openImportAppsDialog: function _openImportAppsDialog() {
      const pageRuntime = new PageRuntime();
      pageRuntime.onImportDialogPress();
    },
    /**
     * Opens the create group dialog.
     * @private
     * @param {boolean} [skipAppsSelection=false] - Whether to skip the apps selection page.
     */
    _openCreateGroupDialog: function _openCreateGroupDialog() {
      let skipAppsSelection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      const createGroupDialog = this._generateCreateGroupDialog(skipAppsSelection);
      const appsWrapper = this._controlMap.get(`${this.getId()}-createGroupDialog-appsPage-scrollContainer-apps`);
      appsWrapper.destroyItems();
      const tiles = [...this.getApps()].map(app => {
        const appCopy = app.clone();
        appCopy._onPress = e => this._highlightApp(e, appCopy); // override app press behaviour to highlight app
        return this.getParent()._getAppTile(appCopy);
      });
      this._setAggregation(appsWrapper, tiles);
      let apps = this.getApps();
      this.getParent().fireEvent("appsLoaded", {
        apps,
        tiles
      });
      this._updateSelectedAppCount();
      createGroupDialog.open();
    },
    /**
     * Closes the create group dialog.
     * @private
     */
    _closeCreateGroupDialog: function _closeCreateGroupDialog() {
      const createGroupDialog = this._generateCreateGroupDialog();
      createGroupDialog?.close();
      //reset create group dialog on close
      this._resetCreateGroupDialog();
    },
    /**
     * Resets the state of the create group dialog.
     * @private
     */
    _resetCreateGroupDialog: function _resetCreateGroupDialog() {
      const navContainer = this._generateCreateGroupNavContainer();
      const groupNameInput = this._controlMap.get(`${this.getId()}-createGroupDialog-mainPage-form-groupName-input`);
      const searchField = this._controlMap.get(`${this.getId()}-createGroupDialog-appsPage-search`);
      groupNameInput.setValue("");
      navContainer.to(navContainer.getInitialPage());
      this._selectedApps = [];
      searchField.setValue("");
      this._setNoAppsSelectedError(false);
      this._selectedGroupColor = undefined;
    },
    /**
     * Generates or retrieves the dialog for creating a group.
     * @private
     * @param {boolean} bSkipAppsSelection - Whether to skip the apps selection page.
     * @returns {sap.m.Dialog} The generated dialog for creating a group.
     */
    _generateCreateGroupDialog: function _generateCreateGroupDialog() {
      let skipAppsSelection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      const id = `${this.getId()}-createGroupDialog`;
      const navContainer = this._generateCreateGroupNavContainer();
      const _toggleNavButton = skipAppsSelection => {
        const nextBtn = this._controlMap.get(`${id}-nextBtn`);
        const backBtn = this._controlMap.get(`${id}-backBtn`);
        const createBtn = this._controlMap.get(`${id}-createBtn`);
        const currentPageIndex = navContainer.indexOfPage(navContainer.getCurrentPage());
        nextBtn.setVisible(currentPageIndex !== navContainer.getPages().length - 1 && !skipAppsSelection);
        backBtn.setVisible(currentPageIndex !== 0 && !skipAppsSelection);
        createBtn.setVisible(currentPageIndex === navContainer.getPages().length - 1 || skipAppsSelection);
      };
      if (!this._controlMap.get(id)) {
        //set up navigation buttons
        this._controlMap.set(`${id}-nextBtn`, new Button({
          id: `${id}-nextBtn`,
          text: this._i18nBundle.getText("nextButton"),
          press: () => {
            if (this._validateGroupName()) {
              navContainer.to(this._generateCreateGroupAppsPage());
              _toggleNavButton(skipAppsSelection);
              this._highlightSelectedApps();
            }
          },
          type: "Emphasized"
        }));
        // Add FESR for next button
        const nextBtn = this._controlMap.get(`${id}-nextBtn`);
        addFESRSemanticStepName(nextBtn, "press", "createGroupNextBtn");
        this._controlMap.set(`${id}-backBtn`, new Button({
          id: `${id}-backBtn`,
          text: this._i18nBundle.getText("backButton"),
          press: () => {
            navContainer.back();
            _toggleNavButton(skipAppsSelection);
          }
        }));
        // Add FESR for back button
        const backBtn = this._controlMap.get(`${id}-backBtn`);
        addFESRSemanticStepName(backBtn, "press", "createGroupBackBtn");
        this._controlMap.set(`${id}-createBtn`, new Button({
          id: `${id}-createBtn`,
          text: this._i18nBundle.getText("createButton"),
          press: () => {
            void this._onPressGroupCreate();
          },
          type: "Emphasized"
        }));
        // Add FESR for create button
        const createBtn = this._controlMap.get(`${id}-createBtn`);
        addFESRSemanticStepName(createBtn, "press", "addCreateGroup");
        this._controlMap.set(id, new Dialog(id, {
          title: this._i18nBundle.getText("createGroup"),
          content: navContainer,
          escapeHandler: this._closeCreateGroupDialog.bind(this),
          contentHeight: "25rem",
          contentWidth: "41.75rem",
          buttons: [nextBtn, backBtn, createBtn, new Button({
            id: `${id}-cancelBtn`,
            text: this._i18nBundle.getText("cancelBtn"),
            press: this._closeCreateGroupDialog.bind(this)
          })]
        }).addStyleClass("sapCuxCreateGroupDialog sapContrastPlus"));
      }
      _toggleNavButton(skipAppsSelection);
      return this._controlMap.get(id);
    },
    /**
     * Handles the highlighting of an app when selected.
     * @private
     * @param {sap.ui.base.Event} event - The event object.
     * @param {Object} selectedApp - The selected app object.
     */
    _highlightApp: function _highlightApp(event, selectedApp) {
      const oTile = event.getSource(),
        bIsSelected = !oTile.hasStyleClass("sapCuxHighlightApp"),
        oScrollContainer = this._generateAppsScrollContainer();
      this._selectedApps = this._selectedApps || [];
      if (bIsSelected) {
        this._selectedApps.push(selectedApp);
      } else {
        this._selectedApps.splice(this._selectedApps.findIndex(oApp => selectedApp.getUrl() === oApp.getUrl()), 1);
      }
      this._updateSelectedAppCount();
      oTile.toggleStyleClass("sapCuxHighlightApp", bIsSelected);
      this._setNoAppsSelectedError(this._selectedApps.length < 1);
      //adjust scroll container height
      oScrollContainer.setHeight(this._selectedApps.length < 1 ? "15.3rem" : "17.5rem");
    },
    /**
     * Generates the scroll container for displaying apps in the create group dialog.
     * @private
     * @returns {sap.m.ScrollContainer} The scroll container for displaying apps.
     */
    _generateAppsScrollContainer: function _generateAppsScrollContainer() {
      const id = `${this.getId()}-createGroupDialog-appsPage-scrollContainer`;
      if (!this._controlMap.get(id)) {
        this._controlMap.set(`${id}-apps`, new GridContainer({
          id: `${id}-apps`,
          layout: new GridContainerSettings({
            columnSize: "19rem",
            gap: "0.5rem"
          })
        }).addStyleClass("sapCuxAppsGridContainerPadding"));
        this._controlMap.set(id, new ScrollContainer(id, {
          id,
          vertical: true,
          visible: true,
          height: "17.5rem",
          content: [this._controlMap.get(`${id}-apps`)]
        }).addStyleClass("sapUiSmallMarginBeginEnd"));
      }
      return this._controlMap.get(id);
    },
    /**
     * Method for updating selected apps count in create group dialog
     * @private
     */
    _updateSelectedAppCount: function _updateSelectedAppCount() {
      const oAppsCountContol = this._controlMap.get(`${this.getId()}-createGroupDialog-appsPage-headerContainer-count`);
      oAppsCountContol.setText(this._i18nBundle.getText("selectedAppsCount", [this._selectedApps?.length || this._i18nBundle.getText("noAppSelected")]));
    },
    /**
     * Creates or returns the navigation container for the create group dialog.
     * @private
     * @returns {sap.m.NavContainer} The navigation container for the create group dialog.
     */
    _generateCreateGroupNavContainer: function _generateCreateGroupNavContainer() {
      const id = `${this.getId()}-createGroupDialog-wrapper`;
      if (!this._controlMap.get(id)) {
        this._controlMap.set(id, new NavContainer(id, {
          initialPage: `${this.getId()}-createGroupDialog-mainPage`,
          pages: [this._generateCreateGroupMainPage(), this._generateCreateGroupAppsPage()]
        }));
      }
      return this._controlMap.get(id);
    },
    /**
     * Generates or retrieve the main page of the create group dialog.
     * @private
     * @returns {sap.m.Page} The main page of the create group dialog.
     */
    _generateCreateGroupMainPage: function _generateCreateGroupMainPage() {
      const id = `${this.getId()}-createGroupDialog-mainPage`;
      if (!this._controlMap.get(id)) {
        this._controlMap.set(`${id}-form-groupName-input`, new Input({
          id: `${id}-form-groupName-input`,
          width: "13.75rem",
          required: true,
          liveChange: this._validateGroupName.bind(this)
        }));
        this._controlMap.set(id, new Page({
          id,
          showHeader: false,
          enableScrolling: false,
          backgroundDesign: "List",
          content: [new VBox({
            id: `${id}-headerContainer`,
            items: [new Title({
              id: `${id}-title`,
              text: this._i18nBundle.getText("settings")
            }), new Text({
              id: `${id}-description`,
              text: this._i18nBundle.getText("settingsDescription")
            })]
          }).addStyleClass("sapUiSmallMarginTop sapUiSmallMarginBeginEnd sapUiTinyMarginBottom"), new SimpleForm(`${id}-form`, {
            layout: form.SimpleFormLayout.ResponsiveGridLayout,
            labelSpanS: 4,
            labelSpanM: 4,
            content: [new Label({
              id: `${id}-form-groupName-label`,
              text: this._i18nBundle.getText("groupNameLbl")
            }).addStyleClass("sapUiTinyMarginTop"), this._controlMap.get(`${id}-form-groupName-input`), new Label({
              id: `${id}-form-groupColor-label`,
              text: this._i18nBundle.getText("groupColorLbl")
            }).addStyleClass("sapUiTinyMarginTop"), new ColorPalette(`${id}-form-groupColor-pallet`, {
              colors: END_USER_COLORS().map(oColor => oColor.value),
              colorSelect: this._onColorSelect.bind(this)
            })]
          }).addStyleClass("sapUiMediumMarginTop")]
        }));
      }
      return this._controlMap.get(id);
    },
    /**
     * Generates or retrieve the app selection page of the create group dialog.
     * @private
     * @returns {sap.m.Page} The app selection page of the create group dialog.
     */
    _generateCreateGroupAppsPage: function _generateCreateGroupAppsPage() {
      const id = `${this.getId()}-createGroupDialog-appsPage`;
      if (!this._controlMap.get(id)) {
        this._controlMap.set(`${id}-search`, new SearchField({
          id: `${id}-search`,
          liveChange: this._onCreateAppSearch.bind(this)
        }).addStyleClass("sapUiTinyMarginTopBottom"));
        this._controlMap.set(`${id}-errorMessageStrip`, new MessageStrip(`${id}-errorMessageStrip`, {
          id: `${id}-errorMessageStrip`,
          type: MessageType.Error,
          showIcon: true,
          text: this._i18nBundle.getText("selectionErrorMessage"),
          visible: false
        }));
        this._controlMap.set(`${id}-headerContainer-count`, new Text({
          id: `${id}-headerContainer-count`
        }));
        this._controlMap.set(id, new Page(id, {
          showHeader: false,
          backgroundDesign: "List",
          enableScrolling: false,
          content: [new VBox(`${id}-headerContainer`, {
            items: [new HBox(`${id}-headerContainer-titleCount`, {
              id: `${id}-headerContainer-titleCount`,
              items: [new Title({
                id: `${id}-headerContainer-title`,
                text: this._i18nBundle.getText("selectedAppsTitle")
              }).addStyleClass("sapUiTinyMarginEnd"), this._controlMap.get(`${id}-headerContainer-count`)]
            }), new Text({
              id: `${id}-description`,
              text: this._i18nBundle.getText("appsSelectionDescription")
            }).addStyleClass("sapUiTinyMarginBottom"), this._controlMap.get(`${id}-search`), this._controlMap.get(`${id}-errorMessageStrip`)]
          }).addStyleClass("sapUiSmallMarginTop sapUiSmallMarginBeginEnd sapUiTinyMarginBottom"), this._generateAppsScrollContainer(), this._generateCreateGroupErrorMsg()]
        }));
      }
      return this._controlMap.get(id);
    },
    /**
     * Generates the error message for create group dialog, when no apps are found for searched text.
     * @private
     * @returns {sap.m.IllustratedMessage} The error message for no filtered apps.
     */
    _generateCreateGroupErrorMsg: function _generateCreateGroupErrorMsg() {
      const id = `${this.getId()}-createGroupDialog-appsPage-noFilterApps`;
      if (!this._controlMap.get(id)) {
        this._controlMap.set(id, new IllustratedMessage({
          id,
          illustrationSize: "Spot",
          illustrationType: "sapIllus-SearchFolder",
          title: this._i18nBundle.getText("noSearchedAppTitle"),
          description: this._i18nBundle.getText("noSearchedAppDes"),
          visible: false
        }));
      }
      return this._controlMap.get(id);
    },
    /**
     * Handles the color selection event for new group.
     * @private
     * @param {sap.ui.base.Event} event - The event object.
     */
    _onColorSelect: function _onColorSelect(event) {
      this._selectedGroupColor = this._getLegendColor(event.getParameter("value")).key;
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
     * Sets the visibility of the error message strip indicating no apps are selected in create group dialog.
     * @private
     * @param {boolean} error - Whether to show the error message strip (true) or hide it (false).
     */
    _setNoAppsSelectedError: function _setNoAppsSelectedError(error) {
      const messageStrip = this._controlMap.get(`${this.getId()}-createGroupDialog-appsPage-errorMessageStrip`);
      messageStrip.setVisible(error);
    },
    /**
     * Validates the group name entered in the create group dialog.
     * @private
     * @returns {boolean} Whether the group name is valid (true) or not (false).
     */
    _validateGroupName: function _validateGroupName() {
      const groupNameInput = this._controlMap.get(`${this.getId()}-createGroupDialog-mainPage-form-groupName-input`);
      const groupName = groupNameInput.getValue().trim();
      //update value state
      groupNameInput.setValueState(groupName ? "None" : "Error");
      groupNameInput.setValueStateText(groupName ? "" : this._i18nBundle.getText("invalidGroupName"));
      return groupName ? true : false;
    },
    /**
     * Highlights selected apps by adding a CSS class to corresponding tiles.
     * @private
     */
    _highlightSelectedApps: function _highlightSelectedApps() {
      const selectedApps = this._selectedApps || [];
      const tilesContainer = this._controlMap.get(`${this.getId()}-createGroupDialog-appsPage-scrollContainer-apps`);
      const tiles = tilesContainer.getItems() || [];
      tiles.forEach(tile => {
        tile.toggleStyleClass("sapCuxHighlightApp", selectedApps.some(app => DataFormatUtils.getLeanURL(app.getUrl()) === tile.getUrl()));
      });
    },
    /**
     * Handles the search for apps in create group dialog.
     * @private
     * @param {sap.ui.base.Event} event - The event object.
     */
    _onCreateAppSearch: function _onCreateAppSearch(event) {
      const tilesContainer = this._controlMap.get(`${this.getId()}-createGroupDialog-appsPage-scrollContainer-apps`),
        searchQuery = event.getSource().getValue(),
        tiles = tilesContainer.getItems() || [],
        searchExpression = new RegExp(searchQuery, "i");
      tiles.forEach(tile => {
        tile.setVisible(searchExpression.test(tile.getHeader()));
      });
      const filteredTiles = tiles.filter(tile => tile.getVisible());
      const hasFilteredApps = filteredTiles.length > 0;
      this._generateAppsScrollContainer()?.setVisible(hasFilteredApps);
      this._generateCreateGroupErrorMsg()?.setVisible(!hasFilteredApps);
    },
    /**
     * Handles the event when the user presses the button to create a new group.
     * @private
     */
    _onPressGroupCreate: function _onPressGroupCreate() {
      try {
        const _this10 = this;
        const groupNameInput = _this10._controlMap.get(`${_this10.getId()}-createGroupDialog-mainPage-form-groupName-input`);
        const _temp11 = function () {
          if (_this10._validateGroupName()) {
            const _temp10 = function () {
              if (_this10._selectedApps?.length) {
                _this10._setBusy(true);
                return Promise.resolve(_this10._createGroup({
                  selectedApps: _this10._selectedApps,
                  groupName: groupNameInput.getValue(),
                  groupColor: _this10._getGroupColor()
                })).then(function () {
                  return Promise.resolve(_this10.refresh()).then(function () {
                    _this10._setBusy(false);
                    _this10._closeCreateGroupDialog();
                    // Show toast message after successful group creation
                    MessageToast.show(_this10._i18nBundle.getText("newGroupCreated"), {
                      of: _this10._controlMap.get(`${_this10.getId()}-createGroupDialog`),
                      offset: "0 80"
                    });
                    const groups = _this10.getAggregation("groups") || [];
                    void _this10._showGroupDetailDialog(groups[0]?.getGroupId());
                  });
                });
              } else {
                _this10._setNoAppsSelectedError(true);
              }
            }();
            if (_temp10 && _temp10.then) return _temp10.then(function () {});
          }
        }();
        return Promise.resolve(_temp11 && _temp11.then ? _temp11.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Creates a new group with the given properties and adds selected apps to it.
     * @param {Object} params - The properties for creating the group.
     * @param {sap.ui.core.URI[]} params.selectedApps - Target URL unique identifier of the selected apps to be added to the group.
     * @param {string} [params.groupName] - The name of the group. If not provided, a default name will be used.
     * @param {string} [params.groupColor] - The color of the group. If not provided, the default color will be used.
     * @private
     */
    _createGroup: function _createGroup(params) {
      try {
        const _this11 = this;
        const {
          selectedApps,
          groupName,
          groupColor
        } = params;
        return Promise.resolve(_this11.appManagerInstance.getSectionVisualizations()).then(function (sectionVisualizations) {
          const visualizations = selectedApps.reduce((selectedVisualizations, oApp) => {
            const sectionVisualization = sectionVisualizations.find(oSectionViz => oSectionViz.url === oApp.getUrl());
            if (sectionVisualization) {
              selectedVisualizations.push(sectionVisualization);
            }
            return selectedVisualizations;
          }, []);
          const sectionId = visualizations[0].persConfig.sectionId;
          return Promise.resolve(_this11.appManagerInstance.addSection({
            sectionIndex: 1,
            sectionProperties: {
              title: groupName || _this11._i18nBundle.getText("newGroup"),
              visible: true,
              visualizations: visualizations.map(viz => viz.visualization)
            }
          })).then(function () {
            const visualizationsToBeDeleted = visualizations.reduce((visualizationsToBeDeleted, oViz) => {
              if (oViz.visualization?.id) {
                const duplicateVisualizationIds = (oViz.persConfig?.duplicateApps || []).map(oViz => oViz.visualization?.id);
                visualizationsToBeDeleted = visualizationsToBeDeleted.concat([oViz.visualization?.id], duplicateVisualizationIds);
              }
              return visualizationsToBeDeleted;
            }, []);
            return Promise.resolve(_this11.appManagerInstance.removeVisualizations({
              sectionId,
              vizIds: visualizationsToBeDeleted
            })).then(function () {
              return Promise.resolve(_this11.appManagerInstance._getSections(true)).then(function (sections) {
                const defaultSection = sections.find(oSection => oSection.default);
                const targetGroupId = sections[defaultSection ? 1 : 0]?.id;
                //update personalization
                return Promise.resolve(_this11._updateAppPersonalization(visualizations.map(oViz => {
                  return {
                    visualization: oViz,
                    targetGroupId
                  };
                }))).then(function () {
                  return Promise.resolve(_this11._updateGroupPersonalization(targetGroupId, groupColor)).then(function () {});
                });
              });
            });
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Retrieves the color for the group.
     * @private
     * @returns {string} The color for the group.
     */
    _getGroupColor: function _getGroupColor() {
      const defaultColor = DEFAULT_BG_COLOR().key;
      const firstApp = this._selectedApps[0];
      const setDefaultColor = this._selectedApps.some(app => app.getBgColor() !== firstApp.getBgColor());
      //if group color is selected then apply that color, else if all the selected apps have same color then give the same color to group, else apply default color.
      return this._selectedGroupColor || (setDefaultColor ? defaultColor : firstApp.getBgColor());
    },
    /**
     * Opens a color popover for selecting a background color for an item.
     * @param {sap.ui.base.Event} event - The event object.
     * @private
     */
    _openColorPopover: function _openColorPopover(event) {
      const colorPopoverId = `${this.getId()}-colorPopover`,
        colors = END_USER_COLORS().map(oColor => oColor.value);
      const source = event.getSource();
      this._currentItem = source.getParent();
      let colorPopover = this._controlMap.get(colorPopoverId);
      if (!colorPopover) {
        colorPopover = new ColorPalettePopover(colorPopoverId, {
          id: colorPopoverId,
          colors: colors,
          showDefaultColorButton: false,
          showMoreColorsButton: false,
          showRecentColorsSection: false,
          colorSelect: event => {
            ActionsPopover._closeActionsPopover();
            const selectedColor = event.getParameter("value");
            void this._handleColorSelect(this._currentItem, selectedColor);
          }
        }).addStyleClass("sapContrastPlus");
        colorPopover._oPopover.setPlacement(PlacementType.HorizontalPreferredRight);
        this._controlMap.set(colorPopoverId, colorPopover);
      }
      colorPopover.openBy(event.getParameter("listItem"));
    },
    /**
     * Handles the selection of a color for an app or group.
     * @param {sap.cux.home.App | sap.cux.home.Group} item - The item control.
     * @param {string} color - The selected color.
     * @returns {Promise<void>} - A promise that resolves when the color selection is handled.
     * @private
     */
    _handleColorSelect: function _handleColorSelect(item, color) {
      try {
        const _this12 = this;
        const selectedColor = _this12._getLegendColor(color).key;
        item.setProperty("bgColor", selectedColor, true);
        const groupId = item.isA("sap.cux.home.Group") ? item.getGroupId() : null;
        const isGroupedApp = !groupId && item.getParent()?.isA("sap.cux.home.Group");

        //update tile color
        if (isGroupedApp) {
          _this12._refreshGroupDetailDialog(item, false);
        } else {
          //if ungroup app or group
          _this12._applyUngroupedTileColor(item, color);
        }

        //update personalization
        const _temp12 = function () {
          if (groupId) {
            //if group
            void _this12._updateGroupPersonalization(groupId, selectedColor);
            const groupIconControl = _this12._controlMap.get(`${_this12.getId()}-detailDialog-toolbar-color`);
            groupIconControl?.setColor(color);
          } else {
            //if app
            const app = item;
            const groupId = isGroupedApp ? app.getParent().getGroupId() : undefined;
            return Promise.resolve(_this12.appManagerInstance.getVisualization(app.getUrl(), groupId)).then(function (visualization) {
              if (visualization) {
                void _this12._updateAppPersonalization([{
                  visualization,
                  color: selectedColor
                }]);
              }
            });
          }
        }();
        return Promise.resolve(_temp12 && _temp12.then ? _temp12.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Applies the selected color to an ungrouped tile.
     * @param {sap.cux.home.App | sap.cux.home.Group} item - The item control.
     * @param {string} color - The selected color.
     * @private
     */
    _applyUngroupedTileColor: function _applyUngroupedTileColor(item, color) {
      const tiles = this.fetchTileVisualization();
      const groupId = item.isA("sap.cux.home.Group") ? item.getGroupId() : null;
      const updatedTileIndex = tiles.findIndex(tile => groupId ? tile.data("groupId") === groupId : tile.getUrl() === DataFormatUtils.getLeanURL(item.getUrl()));
      tiles[updatedTileIndex].setBackgroundColor(color);
    },
    /**
     * Retrieves the list of groups where apps can be moved, excluding the source group if specified.
     * @param {string|null} sourceGroupId - The ID of the source group from which apps are being moved.
     * @returns {sap.cux.home.Group[]} An array of groups where apps can be moved.
     * @private
     */
    _getAllowedMoveGroups: function _getAllowedMoveGroups(sourceGroupId) {
      let allowedMoveGroups = this.getAggregation("groups") || [];
      if (sourceGroupId) {
        allowedMoveGroups = allowedMoveGroups.filter(allowedMoveGroup => allowedMoveGroup.getGroupId() !== sourceGroupId);
      }
      return allowedMoveGroups;
    },
    /**
     * Sets the busy state for dialogs and the panel.
     * @param {boolean} busy - Indicates whether the dialogs and the panel should be set to busy state.
     * @private
     */
    _setBusy: function _setBusy(busy) {
      [this._generateGroupDetailDialog(), this._generateCreateGroupDialog(), this._generateAddFromInsightsDialog()].forEach(oControl => {
        oControl.setBusy(busy);
      });
      BaseAppPersPanel.prototype.setBusy.call(this, busy);
    },
    /**
     * Opens a popover to move the app to another group.
     * @param {sap.cux.home.Group} sourceGroup - The source group from which the app is being moved.
     * @param {sap.ui.base.Event} event - The event triggering the popover opening.
     * @private
     */
    _openMoveToGroupPopover: function _openMoveToGroupPopover(event, sourceGroup) {
      const popoverId = `${this.getId()}-moveToGroupPopover`,
        source = event?.getSource(),
        app = source?.getParent(),
        sourceGroupId = sourceGroup?.getGroupId();
      let list = this._controlMap.get(`${popoverId}-list`),
        moveToGroupPopover = this._controlMap.get(popoverId);
      if (!moveToGroupPopover) {
        list = new List({
          id: `${popoverId}-list`,
          itemPress: () => ActionsPopover._closeActionsPopover()
        });
        this._controlMap.set(`${popoverId}-list`, list);
        moveToGroupPopover = new Popover({
          id: popoverId,
          showHeader: false,
          placement: PlacementType.HorizontalPreferredRight,
          content: [list]
        }).addStyleClass("sapContrastPlus");
        this._controlMap.set(popoverId, moveToGroupPopover);
      }
      list.removeAllItems();
      this._getAllowedMoveGroups(sourceGroupId).forEach(targetGroup => list.addItem(new StandardListItem({
        title: targetGroup.getTitle(),
        type: "Active",
        press: () => {
          void this._handleMoveToGroup(app, sourceGroupId, targetGroup.getGroupId());
        }
      })));
      moveToGroupPopover.openBy(event.getParameter("listItem"));
    },
    /**
     * Handles the removal of an app, displaying a confirmation dialog to the user.
     * If the app is the last one in the group, a warning dialog is displayed for confirmation.
     * @param {sap.cux.home.App} app - The app to be removed.
     * @param {sap.cux.home.Group} [group] - The group from which the app should be removed. If not provided, the app is considered to be in favorites.
     * @private
     */
    _handleRemove: function _handleRemove(app, group) {
      const _this13 = this;
      const lastAppInGroup = group?.getApps()?.length === 1;
      let message = this._i18nBundle.getText("removeAppMessage", [app.getTitle()]),
        title = this._i18nBundle.getText("remove"),
        actionText = this._i18nBundle.getText("remove"),
        messageIcon = MessageBox.Icon.QUESTION;
      if (lastAppInGroup) {
        message = this._i18nBundle.getText("removeFromMyHomeMessage", [app.getTitle()]);
        title = this._i18nBundle.getText("delete");
        actionText = this._i18nBundle.getText("delete");
        messageIcon = MessageBox.Icon.WARNING;
      }
      MessageBox.show(message, {
        icon: messageIcon,
        title: title,
        actions: [actionText, MessageBox.Action.CANCEL],
        emphasizedAction: actionText,
        onClose: function (action) {
          try {
            const _temp13 = function () {
              if (action === actionText) {
                _this13._setBusy(true);
                return Promise.resolve(_this13._removeApp(app, group)).then(function () {
                  if (lastAppInGroup) {
                    _this13._closeGroupDetailDialog();
                  }
                  if (group) {
                    _this13._refreshGroupDetailDialog(app);
                  }
                  return Promise.resolve(_this13.getParent()._refreshAllPanels()).then(function () {
                    MessageToast.show(_this13._i18nBundle.getText("appRemoved"));
                    _this13._setBusy(false);
                  });
                });
              }
            }();
            return Promise.resolve(_temp13 && _temp13.then ? _temp13.then(function () {}) : void 0);
          } catch (e) {
            return Promise.reject(e);
          }
        }
      });
    },
    /**
     * Removes the specified app from the group or favorites.
     * If the app is the last one in the group, the group will be deleted as well.
     * If the app is an ungrouped app, its duplicate apps (if any) will also be deleted.
     * @param {App} app - The app to be removed.
     * @param {Group} [group] - The group from which the app should be removed. If not provided, the app is considered to be in favorites.
     * @returns {Promise<void>}
     * @private
     */
    _removeApp: function _removeApp(app, group) {
      try {
        const _this14 = this;
        const lastAppInGroup = group?.getApps()?.length === 1,
          groupId = group?.getGroupId(),
          appId = app.getUrl();
        return Promise.resolve(_this14.appManagerInstance.getVisualization(appId, groupId)).then(function (viz) {
          const _temp15 = function () {
            if (lastAppInGroup) {
              //if last app in group, then delete the group as well
              return Promise.resolve(_this14._deleteGroup(groupId)).then(function () {});
            } else {
              let visualizationsToBeDeleted = [viz?.visualization?.id];
              if (!groupId) {
                //for apps outside group i.e. for favorite apps delete duplicate apps as well
                visualizationsToBeDeleted = visualizationsToBeDeleted.concat(viz?.persConfig?.duplicateApps?.map(viz => viz.visualization?.id));
              }
              const _temp14 = function () {
                if (viz?.persConfig?.sectionId && visualizationsToBeDeleted.length > 0) {
                  return Promise.resolve(_this14.appManagerInstance.removeVisualizations({
                    sectionId: viz.persConfig.sectionId,
                    vizIds: visualizationsToBeDeleted
                  })).then(function () {
                    void _this14._deletePersonalization({
                      appId: appId,
                      oldAppId: viz?.oldAppId,
                      sectionId: viz?.persConfig?.sectionId,
                      isRecentlyAddedApp: viz?.persConfig?.isDefaultSection
                    });
                  });
                }
              }();
              if (_temp14 && _temp14.then) return _temp14.then(function () {});
            }
          }();
          if (_temp15 && _temp15.then) return _temp15.then(function () {});
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Handler for moving an app from a source group to a target group.
     * @param {sap.cux.home.App} app - The app to be moved.
     * @param {string} sourceGroupId - The ID of the source group from which the app is being moved.
     * @param {string | null} targetGroupId - The ID of the target group to which the app will be moved.
     * @private
     */
    _handleMoveToGroup: function _handleMoveToGroup(app, sourceGroupId, targetGroupId) {
      try {
        const _this15 = this;
        const sourceGroup = sourceGroupId ? _this15._getGroup(sourceGroupId) : undefined,
          isLastAppInGroup = sourceGroup?.getApps()?.length === 1;
        const _temp16 = function () {
          if (isLastAppInGroup) {
            const confirmationMessage = _this15._i18nBundle.getText("moveAppMessage", [app.getTitle()]);
            const confirmationTitle = _this15._i18nBundle.getText("delete");
            MessageBox.show(confirmationMessage, {
              icon: MessageBox.Icon.WARNING,
              title: confirmationTitle,
              actions: [confirmationTitle, MessageBox.Action.CANCEL],
              emphasizedAction: confirmationTitle,
              onClose: action => {
                if (action === confirmationTitle) {
                  void _this15._moveAppAndHandleGroupChanges(app, sourceGroupId, targetGroupId);
                }
              }
            });
          } else {
            return Promise.resolve(_this15._moveAppAndHandleGroupChanges(app, sourceGroupId, targetGroupId)).then(function () {});
          }
        }();
        return Promise.resolve(_temp16 && _temp16.then ? _temp16.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Moves an app to a different group and handles group changes.
     * @param {App} app - The app to be moved.
     * @param {string} [sourceGroupId] - The ID of the source group from which the app is being moved.
     * @param {string} [targetGroupId] - The ID of the target group to which the app is being moved.
     * @returns {Promise<void>} - A Promise that resolves once the app is moved and group changes are handled.
     * @private
     */
    _moveAppAndHandleGroupChanges: function _moveAppAndHandleGroupChanges(app, sourceGroupId, targetGroupId) {
      try {
        const _this16 = this;
        const sourceGroup = sourceGroupId ? _this16._getGroup(sourceGroupId) : null,
          targetGroup = targetGroupId ? _this16._getGroup(targetGroupId) : null,
          sTargetGroupTile = targetGroup?.getTitle(),
          isLastAppInGroup = sourceGroup?.getApps()?.length === 1;
        const _temp19 = _finallyRethrows(function () {
          return _catch(function () {
            _this16._setBusy(true);
            return Promise.resolve(_this16._moveAppToGroup(app, sourceGroupId, targetGroupId)).then(function () {
              function _temp18() {
                if (sourceGroupId) {
                  _this16._refreshGroupDetailDialog(app);
                }
                const sMsg = sTargetGroupTile ? _this16._i18nBundle.getText("appMoved", [sTargetGroupTile]) : _this16._i18nBundle.getText("appUngrouped");
                MessageToast.show(sMsg);
                return Promise.resolve(_this16.refresh()).then(function () {});
              }
              const _temp17 = function () {
                if (isLastAppInGroup && sourceGroupId) {
                  return Promise.resolve(_this16._deleteGroup(sourceGroupId)).then(function () {
                    _this16._closeGroupDetailDialog();
                  });
                }
              }();
              //delete group, if it is the last app in the group
              return _temp17 && _temp17.then ? _temp17.then(_temp18) : _temp18(_temp17);
            });
          }, function (error) {
            Log.error(error);
          });
        }, function (_wasThrown, _result) {
          _this16._setBusy(false);
          if (_wasThrown) throw _result;
          return _result;
        });
        return Promise.resolve(_temp19 && _temp19.then ? _temp19.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Refreshes the group detail dialog.
     * @param {sap.cux.home.App} updatedApp - The updated app control.
     * @param {boolean} [isRemove=true] - A flag indicating whether to remove the app. Defaults to true.
     * @private
     */
    _refreshGroupDetailDialog: function _refreshGroupDetailDialog(updatedApp) {
      let isRemove = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      const appsWrapper = this._controlMap.get(`${this.getId()}-detailDialog-apps`);
      const tiles = appsWrapper.getItems();
      const group = updatedApp.getParent();
      const groupApps = group.getApps();
      if (isRemove) {
        const updatedAppIndex = groupApps.findIndex(groupApp => groupApp.getUrl() === updatedApp.getUrl());
        groupApps[updatedAppIndex].destroy(true);
        tiles[updatedAppIndex].destroy(true);
      } else {
        //update app color, along with duplicate apps, if any
        groupApps.forEach((groupApp, index) => {
          if (groupApp.getUrl() === updatedApp.getUrl()) {
            groupApp.setProperty("bgColor", updatedApp.getBgColor(), true);
            tiles[index].setBackgroundColor(updatedApp.getBgColor());
          }
        });
      }
    },
    /**
     * Moves an app from a source group to a target group.
     * @param {sap.cux.home.App} app - The app to be moved.
     * @param {string} sourceGroupId - The ID of the source group from which the app is being moved.
     * @param {string} targetGroupId - The ID of the target group to which the app will be moved. If null, the default section is considered.
     * @private
     */
    _moveAppToGroup: function _moveAppToGroup(app, sourceGroupId, targetGroupId) {
      try {
        const _this17 = this;
        const appId = app.getUrl();
        return Promise.resolve(Promise.all([_this17.appManagerInstance.getSectionVisualizations(sourceGroupId), _this17.appManagerInstance._getSections()])).then(function (_ref3) {
          let [visualizations, sections] = _ref3;
          const sourceVisualization = visualizations.find(oViz => oViz.url === appId),
            sourceVisualizationIndex = sourceVisualization?.persConfig?.visualizationIndex ?? -1,
            sourceSectionIndex = sourceVisualization?.persConfig?.sectionIndex;
          const isTargetGroupDefault = !targetGroupId; //if group id is not passed, then we consider it as default section
          const isSourceGroupDefault = !sourceGroupId;
          const targetSectionIndex = sections.findIndex(section => !targetGroupId ? section.default : section.id === targetGroupId);
          const visualization = sourceVisualizationIndex > -1 ? visualizations[sourceVisualizationIndex] : null;
          const _temp24 = function () {
            if (visualization !== null) {
              function _temp23() {
                return Promise.resolve(_this17.appManagerInstance._getSections(true)).then(function (sections) {
                  const defaultSection = sections.find(oSection => oSection.default);
                  return Promise.resolve(_this17._updateAppPersonalization([{
                    visualization: visualization,
                    targetGroupId: targetGroupId ?? defaultSection?.id,
                    isTargetGroupDefault
                  }])).then(function () {});
                });
              }
              const _temp22 = function () {
                if (isTargetGroupDefault) {
                  return Promise.resolve(_this17._moveAppToDefaultGroup(visualization)).then(function () {});
                } else {
                  function _temp21() {
                    return Promise.resolve(_this17.appManagerInstance.moveVisualization({
                      sourceSectionIndex: sourceSectionIndex,
                      sourceVisualizationIndex: sourceVisualizationIndex,
                      targetSectionIndex: targetSectionIndex,
                      targetVisualizationIndex: -1
                    })).then(function () {});
                  }
                  const _temp20 = function () {
                    if (isSourceGroupDefault) {
                      //remove duplicate apps
                      return Promise.resolve(_this17._removeDuplicateVisualizations(visualization)).then(function () {});
                    }
                  }();
                  return _temp20 && _temp20.then ? _temp20.then(_temp21) : _temp21(_temp20);
                }
              }();
              return _temp22 && _temp22.then ? _temp22.then(_temp23) : _temp23(_temp22);
            }
          }();
          if (_temp24 && _temp24.then) return _temp24.then(function () {});
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Moves a visualization to the default group.
     * @param {ICustomVisualization} visualization - The visualization to be moved to the default group.
     * @returns {Promise<void>} - A promise that resolves once the visualization is moved to the default group.
     * @private
     */
    _moveAppToDefaultGroup: function _moveAppToDefaultGroup(visualization) {
      try {
        const _this18 = this;
        return Promise.resolve(_this18._addVisualization(visualization)).then(function () {
          const _temp25 = function () {
            if (visualization.persConfig?.sectionId && visualization.visualization?.id) {
              return Promise.resolve(_this18.appManagerInstance.removeVisualizations({
                sectionId: visualization.persConfig?.sectionId,
                vizIds: [visualization.visualization?.id]
              })).then(function () {});
            }
          }();
          if (_temp25 && _temp25.then) return _temp25.then(function () {});
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Removes duplicate visualizations associated with a specific visualization.
     * @param {ICustomVisualization} visualization - The visualization for which duplicate visualizations should be removed.
     * @returns {Promise<void>} - A promise that resolves once duplicate visualizations are removed.
     * @private
     */
    _removeDuplicateVisualizations: function _removeDuplicateVisualizations(visualization) {
      try {
        const _this19 = this;
        const vizIdsToBeDeleted = visualization?.persConfig?.duplicateApps?.map(oViz => oViz.visualization?.id) || [];
        const _temp26 = function () {
          if (visualization.persConfig?.sectionId && vizIdsToBeDeleted.length > 0) {
            return Promise.resolve(_this19.appManagerInstance.removeVisualizations({
              sectionId: visualization.persConfig?.sectionId,
              vizIds: vizIdsToBeDeleted
            })).then(function () {});
          }
        }();
        return Promise.resolve(_temp26 && _temp26.then ? _temp26.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Handles the event for renaming a group.
     * Opens the group detail dialog in edit mode.
     * @private
     * @param {sap.ui.base.Event} event - The event object.
     */
    _onRenameGroup: function _onRenameGroup(event) {
      const group = event.getSource()?.getParent();
      void this._showGroupDetailDialog(group.getGroupId(), true);
    },
    /**
     * Event Handler for ungroup apps, shows confirmation dialog, ungroups the apps on confirmation
     * @param {sap.cux.home.Group} group - The group from which the apps will be ungrouped.
     * @private
     */
    _handleUngroupApps: function _handleUngroupApps(group) {
      const message = this._i18nBundle.getText("ungroupAppsMessage", [group.title]),
        title = this._i18nBundle.getText("delete"),
        actionText = this._i18nBundle.getText("delete");
      MessageBox.show(message, {
        icon: MessageBox.Icon.WARNING,
        title: title,
        actions: [actionText, MessageBox.Action.CANCEL],
        emphasizedAction: actionText,
        onClose: action => {
          if (action === actionText) {
            void this._ungroupApps(group.id);
          }
        }
      });
    },
    /**
     * Handles the event for deleting a group.
     * Shows confirmation dialog to either delete the group and apps, or move the apps in favorites.
     * @private
     * @param {sap.ui.base.Event} event - The event object.
     */
    _onDeleteGroup: function _onDeleteGroup(event) {
      const _this20 = this;
      const group = event.getSource()?.getParent(),
        message = this._i18nBundle.getText("deleteGroupMessage", [group.getTitle()]),
        title = this._i18nBundle.getText("delete"),
        deleteAction = this._i18nBundle.getText("delete"),
        moveAppAction = this._i18nBundle.getText("moveApps");
      MessageBox.show(message, {
        icon: MessageBox.Icon.WARNING,
        title: title,
        actions: [deleteAction, this._i18nBundle.getText("moveApps"), MessageBox.Action.CANCEL],
        emphasizedAction: deleteAction,
        onClose: function (action) {
          try {
            const _temp27 = function () {
              if (action === deleteAction) {
                _this20._setBusy(true);
                return Promise.resolve(_this20._deleteGroup(group.getGroupId())).then(function () {
                  MessageToast.show(_this20._i18nBundle.getText("groupDeleted"));
                  void _this20.refresh();
                  _this20._closeGroupDetailDialog();
                  _this20._setBusy(false);
                });
              } else if (action === moveAppAction) {
                void _this20._ungroupApps(group.getGroupId());
              }
            }();
            return Promise.resolve(_temp27 && _temp27.then ? _temp27.then(function () {}) : void 0);
          } catch (e) {
            return Promise.reject(e);
          }
        }
      });
    },
    /**
     * Ungroups apps from the specified group Id.
     * @async
     * @private
     * @param {string} groupId - The Id of the group from which apps will be ungrouped.
     * @returns {Promise<void>} - A Promise that resolves once the ungrouping process is complete.
     */
    _ungroupApps: function _ungroupApps(groupId) {
      try {
        const _this21 = this;
        _this21._setBusy(true);
        return Promise.resolve(_this21.appManagerInstance.getSectionVisualizations(groupId)).then(function (visualizations) {
          return Promise.resolve(_this21.appManagerInstance._getSections()).then(function (sections) {
            const section = sections.find(oSection => oSection.id === groupId);
            return Promise.resolve(Promise.all(visualizations.map(oViz => _this21._addVisualization(oViz)))).then(function () {
              return Promise.resolve(_this21.appManagerInstance._getSections(true)).then(function (updatedSections) {
                const defaultSection = updatedSections.find(oSection => oSection.default);
                //update personalization
                //if preset section, then section shouldn't be deleted, instead remove visualizations inside section
                return Promise.resolve(_this21._updateAppPersonalization(visualizations.map(oViz => {
                  return {
                    visualization: oViz,
                    targetGroupId: defaultSection?.id,
                    isTargetGroupDefault: true
                  };
                }))).then(function () {
                  function _temp29() {
                    _this21._setBusy(false);
                    MessageToast.show(_this21._i18nBundle.getText("appsUngrouped") ?? "");
                    _this21._closeGroupDetailDialog();
                    return Promise.resolve(_this21.refresh()).then(function () {});
                  }
                  const _temp28 = function () {
                    if (section?.preset) {
                      return Promise.resolve(_this21.appManagerInstance.removeVisualizations({
                        sectionId: groupId,
                        vizIds: visualizations.map(oViz => oViz.visualization?.id)
                      })).then(function () {});
                    } else {
                      return Promise.resolve(_this21._deleteGroup(groupId)).then(function () {});
                    }
                  }();
                  return _temp28 && _temp28.then ? _temp28.then(_temp29) : _temp29(_temp28);
                });
              });
            });
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Shows the detail dialog for a group.
     * @async
     * @param {string} groupId - The Id of the group.
     * @param {boolean} [editMode=false] - Whether to open the dialog in edit mode.
     * @private
     */
    _showGroupDetailDialog: function _showGroupDetailDialog(groupId) {
      let editMode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      try {
        const _this22 = this;
        const group = _this22._getGroup(groupId);
        if (!group) {
          return Promise.resolve();
        }
        _this22._selectedGroupId = groupId;
        const dialog = _this22._generateGroupDetailDialog();
        //set group icon
        const groupIconControl = _this22._controlMap.get(`${_this22.getId()}-detailDialog-toolbar-color`);
        groupIconControl.setColor(Parameters.get({
          name: group.getBgColor()
        }));
        //set group apps
        return Promise.resolve(_this22._setGroupDetailDialogApps(groupId)).then(function () {
          dialog.open();
          //set group title
          _this22._setGroupNameControl(group.getTitle(), editMode);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Sets the apps for the detail dialog for a group.
     * @async
     * @param {string} groupId - The Id of the group.
     * @returns {Promise<void>} - A Promise that resolves once the apps for the group detail dialog are set.
     * @private
     */
    _setGroupDetailDialogApps: function _setGroupDetailDialogApps(groupId) {
      try {
        const _this23 = this;
        const group = _this23._getGroup(groupId);
        const _temp30 = function () {
          if (group) {
            return Promise.resolve(_this23.appManagerInstance.getSectionVisualizations(groupId, false)).then(function (appVisualizations) {
              appVisualizations = appVisualizations.map(appVisualization => {
                return {
                  ...appVisualization,
                  menuItems: _this23._getAppActions(group) //add actions to show in group
                };
              });
              group.destroyAggregation("apps", true);
              const apps = _this23.generateApps(appVisualizations);
              const appsWrapper = _this23._controlMap.get(`${_this23.getId()}-detailDialog-apps`);
              _this23._setAggregation(group, apps, "apps");
              appsWrapper.destroyItems();
              _this23._setAggregation(appsWrapper, group.getApps().map(app => _this23.getParent()._getAppTile(app)));
              _this23._applyGroupedAppsPersonalization(groupId);
              _this23._dispatchAppsLoadedEvent(apps);
            });
          }
        }();
        return Promise.resolve(_temp30 && _temp30.then ? _temp30.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Applies personalization to the grouped apps within the specified group.
     * @param {string} groupId - The ID of the group to which the apps belong.
     * @private
     */
    _applyGroupedAppsPersonalization: function _applyGroupedAppsPersonalization(groupId) {
      const appsWrapper = this._controlMap.get(`${this.getId()}-detailDialog-apps`);
      const tiles = appsWrapper?.getItems() || [];
      void this._applyTilesPersonalization(tiles, groupId, false);
    },
    /**
     * Applies Deprecated Info for apps inside the group.
     * @param {App[]} apps - The ID of the group to which the apps belong.
     * @private
     */
    _dispatchAppsLoadedEvent: function _dispatchAppsLoadedEvent(apps) {
      const appsWrapper = this._controlMap.get(`${this.getId()}-detailDialog-apps`);
      const tiles = appsWrapper?.getItems() || [];
      this.getParent().fireEvent("appsLoaded", {
        apps,
        tiles
      });
    },
    /**
     * Generates the group detail dialog.
     * @private
     * @returns {sap.m.Dialog} The generated detail dialog for the group.
     */
    _generateGroupDetailDialog: function _generateGroupDetailDialog() {
      const id = `${this.getId()}-detailDialog`;
      if (!this._controlMap.get(id)) {
        //group color icon
        this._controlMap.set(`${id}-toolbar-color`, new Icon({
          id: `${id}-toolbar-color`,
          src: "sap-icon://color-fill",
          size: "1.25rem"
        }).addStyleClass("sapUiTinyMarginEnd"));
        this._controlMap.set(`${id}-toolbar-title`, new Title({
          id: `${id}-toolbar-title`,
          visible: true
        }));
        const oGroupNameInput = new Input({
          id: `${id}-toolbar-title-edit`,
          width: "13.75rem",
          visible: false
        });
        this._controlMap.set(`${id}-toolbar-title-edit`, oGroupNameInput);
        oGroupNameInput.onsapfocusleave = () => {
          void this._onGroupEditName(oGroupNameInput.getValue());
        };

        //apps wrapper
        this._controlMap.set(`${id}-apps`, new GridContainer({
          id: `${id}-apps`,
          layout: new GridContainerSettings({
            columnSize: "19rem",
            gap: "0.5rem"
          })
        })?.addDragDropConfig(new DragDropInfo(`${id}-apps-dragDropInfo`, {
          sourceAggregation: "items",
          targetAggregation: "items",
          dropPosition: dnd.DropPosition.Between,
          dropLayout: dnd.DropLayout.Horizontal,
          drop: event => {
            void this._onFavItemDrop(event, this._selectedGroupId);
          }
        })).attachBrowserEvent("keydown", event => {
          const disablenavigation = event.metaKey || event.ctrlKey;
          void attachKeyboardHandler(event, disablenavigation, dragDropEvent => this._onFavItemDrop(dragDropEvent, this._selectedGroupId));
        }).addStyleClass("sapCuxAppsContainerBorder sapCuxAppsDetailContainerPadding"));

        //add apps button
        this._controlMap.set(`${id}-addAppsBtn`, new Button(`${id}-addAppsBtn`, {
          text: this._i18nBundle.getText("addApps"),
          icon: "sap-icon://action",
          visible: _showAddApps(),
          press: () => {
            const groupId = this._selectedGroupId;
            this._closeGroupDetailDialog();
            this._selectedGroupId = groupId;
            void this.navigateToAppFinder(groupId);
          }
        }));
        this._controlMap.set(id, new Dialog(id, {
          content: this._controlMap.get(`${id}-apps`),
          contentWidth: "60.75rem",
          endButton: new Button({
            id: `${id}-groupDetailCloseBtn`,
            text: this._i18nBundle.getText("closeBtn"),
            press: this._closeGroupDetailDialog.bind(this)
          }),
          escapeHandler: this._closeGroupDetailDialog.bind(this),
          customHeader: new Toolbar(`${this.getId()}-toolbar`, {
            content: [this._controlMap.get(`${id}-toolbar-color`), this._controlMap.get(`${id}-toolbar-title`), this._controlMap.get(`${id}-toolbar-title-edit`), new ToolbarSpacer({
              id: `${this.getId()}-toolbarSpacer`
            }), this._controlMap.get(`${id}-addAppsBtn`), new Button({
              id: "overflowBtn",
              icon: "sap-icon://overflow",
              type: "Transparent",
              press: event => {
                const source = event.getSource();
                const group = this._selectedGroupId ? this._getGroup(this._selectedGroupId) : null;
                const groupActions = group?.getAggregation("menuItems");
                const oPopover = ActionsPopover.get(groupActions);
                oPopover.openBy(source);
              }
            })]
          })
        }).addStyleClass("sapCuxGroupDetailDialog"));
      }
      return this._controlMap.get(id);
    },
    /**
     * Closes the group detail dialog.
     * @private
     */
    _closeGroupDetailDialog: function _closeGroupDetailDialog() {
      const groupDetailDialog = this._controlMap.get(`${this.getId()}-detailDialog`);
      this._selectedGroupId = undefined;
      groupDetailDialog?.close();
    },
    /**
     * Updates the group name with new name.
     * This method is triggered on group name input focus leave.
     * @private
     * @async
     * @param {string} updatedTitle - The new title for the group.
     */
    _onGroupEditName: function _onGroupEditName(updatedTitle) {
      try {
        const _this24 = this;
        function _temp32() {
          _this24._setGroupNameControl(updatedTitle, false);
          _this24._setBusy(false);
        }
        _this24._setBusy(true);
        const groupId = _this24._selectedGroupId,
          group = _this24._getGroup(groupId),
          oldTitle = group?.getTitle();
        const _temp31 = function () {
          if (updatedTitle && updatedTitle !== oldTitle) {
            return Promise.resolve(_this24._renameGroup(groupId, updatedTitle)).then(function () {
              group?.setProperty("title", updatedTitle, true);
              void _this24.refresh();
              MessageToast.show(_this24._i18nBundle.getText("groupNameChanged") || "");
            });
          }
        }();
        return Promise.resolve(_temp31 && _temp31.then ? _temp31.then(_temp32) : _temp32(_temp31));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Renames a group.
     * @async
     * @param {string} groupId - The Id of the group to rename.
     * @param {string} updatedTitle - The new title for the group.
     * @returns {Promise<void>} A Promise that resolves once the group is renamed.
     */
    _renameGroup: function _renameGroup(groupId, updatedTitle) {
      try {
        return Promise.resolve(Container.getServiceAsync("Pages")).then(function (pagesService) {
          const pageIndex = pagesService.getPageIndex(MYHOME_PAGE_ID),
            groups = pagesService.getModel().getProperty(`/pages/${pageIndex}/sections/`),
            groupIndex = groups.findIndex(group => group.id === groupId);
          const _temp33 = function () {
            if (groupIndex > -1) {
              return Promise.resolve(pagesService.renameSection(pageIndex, groupIndex, updatedTitle)).then(function () {});
            }
          }();
          if (_temp33 && _temp33.then) return _temp33.then(function () {});
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Sets the group name control in the detail dialog.
     * Shows input control to edit the group name in edit mode, otherwise, shows group name as title control.
     * @private
     * @param {string} groupTitle - The title of the group.
     * @param {boolean} editMode - Whether the dialog is in edit mode.
     */
    _setGroupNameControl: function _setGroupNameControl(groupTitle, editMode) {
      const groupDetailDialog = this._controlMap.get(`${this.getId()}-detailDialog`);
      const groupTitleControl = this._controlMap.get(`${this.getId()}-detailDialog-toolbar-title`);
      const groupInputControl = this._controlMap.get(`${this.getId()}-detailDialog-toolbar-title-edit`);
      groupInputControl.setValue(groupTitle);
      groupTitleControl.setText(groupTitle);
      groupInputControl?.setVisible(editMode);
      groupTitleControl?.setVisible(!editMode);
      if (editMode) {
        //in edit mode set the focus on input
        groupDetailDialog.setInitialFocus(groupInputControl);
      }
    },
    /**
     * Generates the dialog for adding apps from insights.
     * @returns {sap.m.Dialog} The dialog for adding apps from insights.
     * @private
     */
    _generateAddFromInsightsDialog: function _generateAddFromInsightsDialog() {
      const id = `${this.getId()}-addFromInsightsDialog`;
      const setAddBtnEnabled = () => {
        const selectedItems = this._getSelectedInsights();
        this._controlMap.get(`${id}-addBtn`).setEnabled(selectedItems.length > 0);
      };
      if (!this._controlMap.get(id)) {
        const getAppFinderBtn = (id, btnType) => {
          const appsAppFinder = new Button(id, {
            icon: "sap-icon://action",
            text: this._i18nBundle.getText("appFinderBtn"),
            press: () => {
              this._closeAddFromInsightsDialog();
              void this.navigateToAppFinder();
            },
            visible: _showAddApps(),
            type: btnType || ButtonType.Default
          });
          addFESRSemanticStepName(appsAppFinder, "press", "appsAppFinder");
          return appsAppFinder;
        };
        this._controlMap.set(`${id}-list`, new List({
          id: `${id}-list`,
          mode: "MultiSelect",
          selectionChange: setAddBtnEnabled
        }));
        this._controlMap.set(`${id}-addBtn`, new Button({
          id: `${id}-addBtn`,
          text: this._i18nBundle.getText("addFromInsightsDialogBtn"),
          type: "Emphasized",
          press: () => {
            void this._addFromInsights();
          },
          enabled: false
        }));
        const addStaticTiles = this._controlMap.get(`${id}-addBtn`);
        addFESRSemanticStepName(addStaticTiles, "press", "addStaticTiles");
        this._controlMap.set(`${id}-errorMessage`, new IllustratedMessage({
          id: `${id}-errorMessage`,
          illustrationSize: "Spot",
          illustrationType: "sapIllus-AddColumn",
          title: this._i18nBundle.getText("noAppsTitle"),
          description: this._i18nBundle.getText("noDataMsgInsightTiles"),
          visible: true
        }).addStyleClass("sapUiLargeMarginTop"));
        this._controlMap.set(id, new Dialog(id, {
          title: this._i18nBundle.getText("addFromInsights"),
          content: [new Label({
            id: `${id}-label`,
            text: this._i18nBundle.getText("addFromInsightsDialogLabel"),
            wrapping: true
          }).addStyleClass("sapMTitleAlign sapUiTinyMarginTopBottom sapUiSmallMarginBeginEnd"), new HBox({
            id: `${id}-textContainer`,
            justifyContent: "SpaceBetween",
            alignItems: "Center",
            items: [new Title({
              id: `${id}-text`,
              text: this._i18nBundle.getText("addFromInsightsDialogTitle")
            }), getAppFinderBtn(`${id}-addAppsBtn`, ButtonType.Transparent)]
          }).addStyleClass("sapUiTinyMarginTop dialogHeader sapUiSmallMarginBeginEnd"), this._controlMap.get(`${id}-list`), this._controlMap.get(`${id}-errorMessage`)],
          contentWidth: "42.75rem",
          contentHeight: "32.5rem",
          endButton: new Button({
            id: `${id}-addFromInsightsCloseBtn`,
            text: this._i18nBundle.getText("closeBtn"),
            press: this._closeAddFromInsightsDialog.bind(this)
          }),
          escapeHandler: this._closeAddFromInsightsDialog.bind(this),
          buttons: [this._controlMap.get(`${id}-addBtn`), new Button({
            id: `${id}-cancelBtn`,
            text: this._i18nBundle.getText("cancelBtn"),
            press: this._closeAddFromInsightsDialog.bind(this)
          })]
        }).addStyleClass("sapContrastPlus sapCuxAddFromInsightsDialog"));
      }
      setAddBtnEnabled();
      return this._controlMap.get(id);
    },
    /**
     * Handles the addition of apps from insights.
     * @returns {Promise<void>} A Promise that resolves when the operation is complete.
     * @private
     */
    _handleAddFromInsights: function _handleAddFromInsights() {
      try {
        const _this25 = this;
        return Promise.resolve(_this25._getInsightTilesToAdd()).then(function (appsToAdd) {
          const dialog = _this25._generateAddFromInsightsDialog();
          _this25._controlMap.get(`${_this25.getId()}-addFromInsightsDialog-errorMessage`)?.setVisible(appsToAdd.length === 0);
          _this25._generateInsightListItems(appsToAdd);
          dialog.open();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Generates list items for the provided apps and populates the list in the "Add from Insights" dialog.
     * @param {ICustomVisualization[]} apps - An array of custom visualizations representing the apps to be added.
     * @private
     */
    _generateInsightListItems: function _generateInsightListItems(apps) {
      const list = this._controlMap.get(`${this.getId()}-addFromInsightsDialog-list`);
      if (apps.length) {
        list.destroyItems();
        const listItems = apps.map((app, index) => new CustomListItem({
          id: `${this.getId()}-addFromInsightsDialog-listItem-${index}`,
          content: [new HBox({
            id: `${this.getId()}-addFromInsightsDialog-listItem-${index}-content`,
            alignItems: "Center",
            items: [new Icon({
              id: `${this.getId()}-addFromInsightsDialog-listItem-${index}-content-icon`,
              src: app.icon,
              backgroundColor: this._getLegendColor(app.BGColor || "").value,
              color: "white",
              width: "2.25rem",
              height: "2.25rem",
              size: "1.25rem"
            }).addStyleClass("sapUiRoundedBorder sapUiTinyMargin"), new ObjectIdentifier({
              id: `${this.getId()}-addFromInsightsDialog-listItem-${index}-content-identifier`,
              title: app.title,
              text: app.subtitle,
              tooltip: app.title
            }).addStyleClass("sapUiTinyMargin")]
          })]
        }).addStyleClass("sapUiContentPadding").data("vizId", app.visualization?.vizId));
        this._setAggregation(list, listItems);
      }
      list?.setVisible(apps.length !== 0);
    },
    /**
     * Retrieves the insight tiles to add.
     * @returns {Promise<ICustomVisualization[]>} A Promise that resolves with an array of insight tiles to add.
     * @private
     */
    _getInsightTilesToAdd: function _getInsightTilesToAdd() {
      try {
        const _this26 = this;
        return Promise.resolve(Promise.all([_this26.appManagerInstance.fetchInsightApps(true, _this26._i18nBundle.getText("insights")), _this26.appManagerInstance.fetchFavVizs(false, true)])).then(function (_ref4) {
          let [insightsApps, favoriteApps] = _ref4;
          //check force refresh true?
          //find the visualizations that are present in insight tile but not in favorite apps
          const appsToAdd = insightsApps.reduce((appsToAdd, insightsApp) => {
            if (!insightsApp.isCount && !insightsApp.isSmartBusinessTile) {
              // Check if App is not present in Fav Apps
              const iAppIndex = favoriteApps.findIndex(favoriteApp => favoriteApp.visualization?.vizId === insightsApp.visualization?.vizId || favoriteApp.appId === insightsApp.appId);
              if (iAppIndex === -1) {
                appsToAdd.push(insightsApp);
              }
            }
            return appsToAdd;
          }, []);
          return _this26.appManagerInstance._filterDuplicateVizs(appsToAdd, false);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Closes the dialog for adding apps from insights.
     * @private
     */
    _closeAddFromInsightsDialog: function _closeAddFromInsightsDialog() {
      const dialog = this._generateAddFromInsightsDialog();
      const list = this._controlMap.get(`${this.getId()}-addFromInsightsDialog-list`);
      list.removeSelections();
      dialog?.close();
    },
    /**
     * Retrieves the selected insights from the dialog.
     * @returns {sap.m.ListItemBase[]} An array of selected insights.
     * @private
     */
    _getSelectedInsights: function _getSelectedInsights() {
      const list = this._controlMap.get(`${this.getId()}-addFromInsightsDialog-list`);
      return list.getSelectedItems() || [];
    },
    /**
     * Adds apps from insights.
     * @returns {void}
     * @private
     */
    _addFromInsights: function _addFromInsights() {
      try {
        const _this27 = this;
        function _temp35() {
          _this27._closeAddFromInsightsDialog();
          MessageToast.show(_this27._i18nBundle.getText(selectedItems.length === 1 ? "addFromInsightTileSuccess" : "addFromInsightTilesSuccess", [selectedItems.length]));
          return Promise.resolve(_this27.getParent()._refreshAllPanels()).then(function () {
            _this27._setBusy(false);
          });
        }
        _this27._setBusy(true);
        const selectedItems = _this27._getSelectedInsights();
        const _temp34 = _forOf(selectedItems, function (selectedItem) {
          return Promise.resolve(_this27.appManagerInstance.addVisualization(selectedItem.data("vizId"))).then(function () {});
        });
        return Promise.resolve(_temp34 && _temp34.then ? _temp34.then(_temp35) : _temp35(_temp34));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Updates the personalization data for apps.
     * @param {IUpdatePersonalizationConfig[]} updateConfigs - The array of configurations for updating personalization.
     * @param {IUpdatePersonalizationConfig} updateConfig - Configuration object for updating personalization.
     * @param {ICustomVisualization} updateConfig.visualization - Visualization.
     * @param {string} updateConfig.color - The color to update for the app.
     * @param {boolean} updateConfig.isTargetGroupDefault - A flag indicating whether the target section is the default.
     * @param {string} [updateConfig.targetGroupId] - The Id of the target group. Defaults to source group Id if not provided.
     * @returns {Promise<void>} A promise that resolves when the personalization data is updated.
     * @private
     */
    _updateAppPersonalization: function _updateAppPersonalization(updateConfigs) {
      try {
        const _this28 = this;
        return Promise.resolve(_this28._getAppPersonalization()).then(function (personalizations) {
          for (const updateConfig of updateConfigs) {
            const {
              visualization
            } = updateConfig;
            const {
              persConfig
            } = visualization;
            const sourceGroupId = persConfig?.sectionId;
            const targetGroupId = updateConfig.targetGroupId ?? sourceGroupId;
            if (sourceGroupId !== targetGroupId) {
              //move app scenario
              _this28._updateMoveAppPersonalization(personalizations, updateConfig);
            } else {
              //only color is updated
              _this28._updateAppColorPersonalization(personalizations, updateConfig);
            }
          }
          return Promise.resolve(_this28.setFavAppsPersonalization(personalizations)).then(function () {});
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Updates the personalization when an app is moved to a different group.
     * @param {IAppPersonalization[]} personalizations - The array of app personalizations.
     * @param {IUpdatePersonalizationConfig} updateConfig - The update configuration.
     * @returns {void}
     * @private
     */
    _updateMoveAppPersonalization: function _updateMoveAppPersonalization(personalizations, updateConfig) {
      const {
        visualization,
        isTargetGroupDefault
      } = updateConfig;
      const {
        appId,
        oldAppId,
        persConfig
      } = visualization;
      const sourceGroupId = persConfig?.sectionId;
      const isSourceGroupDefault = persConfig?.isDefaultSection;
      const duplicateApps = persConfig?.duplicateApps || [];
      const targetGroupId = updateConfig.targetGroupId ?? sourceGroupId;
      const sourcePersonalizationIndex = this._getPersonalizationIndex(personalizations, {
        appId,
        oldAppId,
        sectionId: sourceGroupId,
        isRecentlyAddedApp: isSourceGroupDefault
      });
      //if personalization exists for app in source group
      if (sourcePersonalizationIndex > -1) {
        const newPersonalization = {
          ...personalizations[sourcePersonalizationIndex],
          sectionId: targetGroupId,
          isRecentlyAddedApp: isTargetGroupDefault,
          isSection: false
        };
        //if no duplicate apps in source group, clean up source group personlization
        if (duplicateApps.length === 0) {
          personalizations.splice(sourcePersonalizationIndex, 1);
        }

        //update target personalization
        const iTargetPersonalizationIndex = this._getPersonalizationIndex(personalizations, {
          appId,
          oldAppId,
          sectionId: targetGroupId,
          isRecentlyAddedApp: isTargetGroupDefault
        });
        if (iTargetPersonalizationIndex > -1) {
          personalizations.splice(iTargetPersonalizationIndex, 1); //clean up any existing personalization
        }
        //push new personalization for target group
        personalizations.push(newPersonalization);
      }
    },
    /**
     * Updates the personalization data for a group with the selected color.
     * @param {string} groupId - The ID of the group.
     * @param {string} selectedColor - The selected color for the group.
     * @returns {Promise<void>} A promise that resolves when the personalization data is updated.
     * @private
     */
    _updateGroupPersonalization: function _updateGroupPersonalization(groupId, selectedColor) {
      try {
        const _this29 = this;
        return Promise.resolve(_this29._getAppPersonalization()).then(function (personalizations) {
          const personalizationIndex = _this29._getPersonalizationIndex(personalizations, {
            isSection: true,
            sectionId: groupId
          });
          const updatedPersonalization = {
            BGColor: selectedColor,
            isSection: true,
            sectionId: groupId,
            isRecentlyAddedApp: false
          };
          if (personalizationIndex > -1) {
            //if color is already present for the group, update the color
            personalizations[personalizationIndex] = updatedPersonalization;
          } else {
            personalizations.push(updatedPersonalization);
          }
          return Promise.resolve(_this29.setFavAppsPersonalization(personalizations)).then(function () {});
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Finds the index of personalization data matching the specified properties.
     * @param {IAppPersonalization[]} personalizations - The array of personalization data.
     * @param {IAppPersonalization} appPersonalization - The properties to match for finding the index.
     * @param {string} [appPersonalization.appId] -  id of the app.
     * @param {string} [appPersonalization.oldAppId] - old id of the app.
     * @param {string} [appPersonalization.sectionId] - id of the section.
     * @param {boolean} appPersonalization.isSection - A flag indicating whether the personalization is for a section.
     * @param {boolean} appPersonalization.isRecentlyAddedApp - A flag indicating whether the app is a recently added app.
     * @returns {number} The index of the matching personalization data, or -1 if not found.
     * @private
     */
    _getPersonalizationIndex: function _getPersonalizationIndex(personalizations, appPersonalization) {
      const {
        appId,
        oldAppId,
        sectionId,
        isSection,
        isRecentlyAddedApp
      } = appPersonalization;
      return personalizations.findIndex(personalization => {
        if (isSection) {
          return personalization.sectionId === sectionId && personalization.isSection;
        } else {
          return isRecentlyAddedApp ? (personalization.appId === appId || personalization.appId === oldAppId) && personalization.isRecentlyAddedApp : (personalization.appId === appId || personalization.appId === oldAppId) && personalization.sectionId === sectionId;
        }
      });
    },
    /**
     * Adds a visualization.
     * @param {object} oViz - The visualization to be added.
     * @param {object} oViz.visualization - The visualization object.
     * @param {boolean} [oViz.visualization.isBookmark=false] - Indicates if the visualization is a bookmark.
     * @param {string} [oViz.visualization.vizId] - The ID of the visualization if it's not a bookmark.
     * @returns {Promise<void>} A promise that resolves to void after the visualization is added.
     * @private
     */
    _addVisualization: function _addVisualization(viz) {
      if (viz.visualization) {
        return viz.visualization.isBookmark ? this.appManagerInstance.addBookMark(viz.visualization) : this.appManagerInstance.addVisualization(viz.visualization.vizId);
      }
      return Promise.reject(new Error("No visualization provided to add"));
    },
    /**
     * Deletes a group.
     * @param {string} groupId - The Id of the group to delete.
     * @returns {Promise<void>} A Promise that resolves once the group is deleted.
     * @private
     */
    _deleteGroup: function _deleteGroup(groupId) {
      try {
        const _this30 = this;
        return Promise.resolve(Container.getServiceAsync("Pages")).then(function (pagesService) {
          const pageIndex = pagesService.getPageIndex(MYHOME_PAGE_ID),
            groups = pagesService.getModel().getProperty(`/pages/${pageIndex}/sections/`),
            groupIndex = groups.findIndex(group => group.id === groupId);
          const _temp36 = function () {
            if (groupIndex > -1) {
              return Promise.resolve(pagesService.deleteSection(pageIndex, groupIndex)).then(function () {
                void _this30._deletePersonalization({
                  sectionId: groupId,
                  isSection: true
                });
              });
            }
          }();
          if (_temp36 && _temp36.then) return _temp36.then(function () {});
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Deletes personalization data based on the specified properties.
     * @param {IAppPersonalizationConfig} personalizationConfig - The properties to identify the personalization data to delete.
     * @param {boolean} [personalizationConfig.isSection] - A flag indicating whether the personalization is for a group.
     * @param {string} [appPersonalization.appId] -  id of the app.
     * @param {string} [appPersonalization.oldAppId] - old id of the app.
     * @param {string} personalizationConfig.sectionId - The ID of the group associated with the personalization.
     * @param {boolean} [appPersonalization.isRecentlyAddedApp] - A flag indicating whether the app is a recently added app.
     * @returns {Promise<void>} A promise that resolves when the personalization data is deleted.
     * @private
     */
    _deletePersonalization: function _deletePersonalization(personalizationConfig) {
      try {
        const _this31 = this;
        const {
          isSection,
          sectionId
        } = personalizationConfig;
        return Promise.resolve(_this31._getAppPersonalization()).then(function (personalizations) {
          if (!isSection) {
            const personalizationIndex = _this31._getPersonalizationIndex(personalizations, personalizationConfig);
            if (personalizationIndex > -1) {
              personalizations.splice(personalizationIndex, 1);
            }
          } else {
            // Delete personalizations for all associated apps if a group is deleted
            personalizations = personalizations.filter(personalization => personalization.sectionId !== sectionId);
          }
          void _this31.setFavAppsPersonalization(personalizations);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Handles the press event of a group.
     * @param {Group$PressEvent} event - The press event object.
     * @private
     */
    _handleGroupPress: function _handleGroupPress(event) {
      const groupId = event.getParameter("groupId");
      if (groupId) {
        void this._showGroupDetailDialog(groupId);
      }
    },
    /**
     * Handles keyboard events for cutting and moving applications.
     * When the Cmd (Mac) or Ctrl (Windows) key is pressed along with 'x', the currently selected element is cut.
     * When the Cmd (Mac) or Ctrl (Windows) key is pressed along with 'v':
     * - If the operation is performed on a group, the previously cut application is moved into the group.
     * - If the operation is performed on an application, the create group dialog is opened.
     * @param {KeyboardEvent} event - The keyboard event object.
     * @param {string} [appGroupId] - The group Id of the app, if app belongs to a group.
     * @returns {Promise<void>} A Promise that resolves when app is moved to a group or create group dialog is opened.
     * @private
     */
    _handleKeyboardMoveApp: function _handleKeyboardMoveApp(event, appGroupId) {
      try {
        const _this32 = this;
        const currentItem = Element.closestTo(event.target.firstElementChild);
        const container = currentItem.getParent();
        const _temp38 = function () {
          if (event.metaKey || event.ctrlKey) {
            // ctrl(windows)/cmd (mac) + x, sets app to be moved to a group, or to create a group
            if (event.key === "x" && !currentItem.data("groupId") && !_this32._cutApp && !appGroupId) {
              currentItem.$().css("opacity", 0.6);
              currentItem._oMoreIcon.setEnabled(false);
              _this32._cutApp = currentItem;
            }
            const _temp37 = function () {
              if (event.key === "v" && _this32._cutApp && !appGroupId) {
                const dragDropEvent = new Event("keyboardDragDropEvent", container, {
                  draggedControl: _this32._cutApp,
                  droppedControl: currentItem,
                  dropPosition: dnd.RelativeDropPosition.On
                });
                return Promise.resolve(_this32._onFavItemDrop(dragDropEvent)).then(function () {
                  _this32._cutApp = undefined;
                });
              }
            }();
            if (_temp37 && _temp37.then) return _temp37.then(function () {});
          }
        }();
        return Promise.resolve(_temp38 && _temp38.then ? _temp38.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Cancels the cut operation when clicked outside apps section or when focus moves out of apps section.
     * @param {MouseEvent | KeyboardEvent} event - The mouse or keyboard event triggering the reset.
     * @private
     */
    _resetCutElement: function _resetCutElement(event) {
      const appsWrapperId = this._generateAppsWrapper().getId();
      if (!event.target.id.includes(appsWrapperId)) {
        this._cutApp?.$().css("opacity", "");
        this._cutApp = undefined;
      }
    },
    /**
     * Generates illustrated message for favorite apps panel.
     * @private
     * @override
     * @returns {sap.m.IllustratedMessage} Illustrated error message.
     */
    generateIllustratedMessage: function _generateIllustratedMessage() {
      const illustratedMessage = BaseAppPersPanel.prototype.generateIllustratedMessage.call(this);
      //overrride the default title and add additional content
      illustratedMessage.setDescription(this._i18nBundle.getText("noFavAppsDescription"));
      illustratedMessage.addAdditionalContent(new Button(`${this.getId()}-errorMessage-addApps`, {
        text: this._i18nBundle.getText("addApps"),
        tooltip: this._i18nBundle.getText("addAppsTooltip"),
        icon: "sap-icon://action",
        visible: _showAddApps(),
        press: () => {
          void this.navigateToAppFinder();
        },
        type: "Emphasized"
      }));
      return illustratedMessage;
    }
  });
  return FavAppPanel;
});
//# sourceMappingURL=FavAppPanel-dbg-dbg.js.map
