/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/base/Log", "sap/ushell/api/S4MyHome", "sap/ushell/Container", "./AdvancedSettingsPanel", "./AppsContainer", "./BaseLayout", "./BaseLayoutRenderer", "./InsightsCardsSettingsPanel", "./InsightsTilesSettingsPanel", "./KeyUserLayoutSettingsPanel", "./KeyUserNewsPagesSettingsPanel", "./KeyUserSettingsDialog", "./LayoutSettingsPanel", "./NewsAndPagesContainer", "./NewsSettingsPanel", "./NoDataContainer", "./PagePanel", "./PageSettingsPanel", "./SettingsDialog", "./ToDosContainer", "./utils/Constants", "./utils/KeyUserPersonalization", "./utils/PersonalisationUtils"], function (Log, S4MyHome, Container, __AdvancedSettingsPanel, __AppsContainer, __BaseLayout, __BaseLayoutRenderer, __InsightsCardsSettingsPanel, __InsightsTilesSettingsPanel, __KeyUserLayoutSettingsPanel, __KeyUserNewsPagesSettingsPanel, __KeyUserSettingsDialog, __LayoutSettingsPanel, __NewsAndPagesContainer, __NewsSettingsPanel, __NoDataContainer, __PagePanel, __PageSettingsPanel, __SettingsDialog, __ToDosContainer, ___utils_Constants, __KeyUserPersonalization, __PersonalisationUtils) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
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
  const AdvancedSettingsPanel = _interopRequireDefault(__AdvancedSettingsPanel);
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
  const AppsContainer = _interopRequireDefault(__AppsContainer);
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
  const BaseLayout = _interopRequireDefault(__BaseLayout);
  const BaseLayoutRenderer = _interopRequireDefault(__BaseLayoutRenderer);
  const InsightsCardsSettingsPanel = _interopRequireDefault(__InsightsCardsSettingsPanel);
  const InsightsTilesSettingsPanel = _interopRequireDefault(__InsightsTilesSettingsPanel);
  const KeyUserLayoutSettingsPanel = _interopRequireDefault(__KeyUserLayoutSettingsPanel);
  const KeyUserNewsPagesSettingsPanel = _interopRequireDefault(__KeyUserNewsPagesSettingsPanel);
  const KeyUserSettingsDialog = _interopRequireDefault(__KeyUserSettingsDialog);
  const LayoutSettingsPanel = _interopRequireDefault(__LayoutSettingsPanel);
  const NewsAndPagesContainer = _interopRequireDefault(__NewsAndPagesContainer);
  const NewsSettingsPanel = _interopRequireDefault(__NewsSettingsPanel);
  const NoDataContainer = _interopRequireDefault(__NoDataContainer);
  const PagePanel = _interopRequireDefault(__PagePanel);
  const PageSettingsPanel = _interopRequireDefault(__PageSettingsPanel);
  const SettingsDialog = _interopRequireDefault(__SettingsDialog);
  const ToDosContainer = _interopRequireDefault(__ToDosContainer);
  const SETTINGS_PANELS_KEYS = ___utils_Constants["SETTINGS_PANELS_KEYS"];
  const KeyUserPersonalization = _interopRequireDefault(__KeyUserPersonalization);
  const PersonalisationUtils = _interopRequireDefault(__PersonalisationUtils);
  /**
   *
   * Layout class for the My Home layout.
   *
   * @extends BaseLayout
   *
   * @author SAP SE
   * @version 0.0.1
   * @since 1.121
   *
   * @internal
   * @experimental Since 1.121
   * @public
   *
   * @alias sap.cux.home.Layout
   */
  const Layout = BaseLayout.extend("sap.cux.home.Layout", {
    renderer: BaseLayoutRenderer,
    metadata: {
      designtime: "sap/cux/home/designtime/Layout.designtime"
    },
    /**
     * Constructor for a new layout.
     *
     * @param {string} [id] ID for the new control, generated automatically if an ID is not provided
     * @param {object} [settings] Initial settings for the new control
     */
    constructor: function _constructor(id, settings) {
      BaseLayout.prototype.constructor.call(this, id, settings);
      this._shellUserActions = [];
      this._isDefaultSettingsDialog = false;
      this._customNoDataContainerPresent = true;
    },
    /**
     * Init lifecycle method
     *
     * @private
     * @async
     * @override
     */
    init: function _init() {
      BaseLayout.prototype.init.call(this);

      //setup layout
      this.setProperty("enableSettings", true);
      this.setProperty("enableFullScreen", true);

      // Setup KeyUserPersonalization
      this._keyUserPersonalization = new KeyUserPersonalization(PersonalisationUtils.getOwnerComponent(this), this._i18nBundle);
    },
    /**
     * Adds all user actions to the Fiori launchpad.
     *
     * @private
     */
    _addUserActions: function _addUserActions() {
      try {
        const _this = this;
        return Promise.resolve(_catch(function () {
          const _temp3 = function () {
            if (_this.getVisible() && !_this._userActionsAdded) {
              _this._userActionsAdded = true;

              // Configure User Actions
              const userActions = [{
                id: `${_this.getId()}-homeSettingsBtn`,
                icon: "sap-icon://edit",
                text: _this._i18nBundle.getText("myHomeSettings"),
                tooltip: _this._i18nBundle.getText("myHomeSettings"),
                press: () => {
                  void _this.openSettingsDialog();
                }
              }];

              // Add RTA User Action if Key User
              return Promise.resolve(_this._keyUserPersonalization.getRTAUserAction()).then(function (rtaUserAction) {
                if (rtaUserAction) {
                  userActions.push(rtaUserAction);
                }

                // Attach User Actions
                return Promise.resolve(Container.getServiceAsync("Extension")).then(function (extensionService) {
                  function _temp2() {
                    // Toggle User Actions on Page Change
                    const toggleUserActions = event => {
                      const show = event.getParameter("isMyHomeRoute");
                      _this._shellUserActions.forEach(function (userAction) {
                        if (show) {
                          userAction.showOnHome();
                        } else {
                          userAction.hideOnHome();
                        }
                      });
                    };
                    S4MyHome.attachRouteMatched({}, toggleUserActions, _this);
                  }
                  const _temp = _forOf(userActions, function (action) {
                    return Promise.resolve(extensionService.createUserAction(action, {
                      controlType: "sap.ushell.ui.launchpad.ActionItem"
                    })).then(function (shellUserAction) {
                      shellUserAction.showOnHome();
                      _this._shellUserActions.push(shellUserAction);
                    });
                  });
                  return _temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp);
                });
              });
            }
          }();
          if (_temp3 && _temp3.then) return _temp3.then(function () {});
        }, function (error) {
          Log.warning("Unable to add User Actions", error instanceof Error ? error.message : "");
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Opens the settings dialog for the layout.
     * Overriden from the BaseLayout to ensure of all panels
     * to the dialog if not already added.
     *
     * @private
     * @param {string} selectedKey The key of the panel to navigate to
     * @override
     */
    openSettingsDialog: function _openSettingsDialog() {
      let selectedKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
      let context = arguments.length > 1 ? arguments[1] : undefined;
      try {
        const _this2 = this;
        const settingsDialog = _this2.getAggregation("settingsDialog");
        if (settingsDialog.getPanels().length !== _this2._getSettingsPanels().length) {
          _this2._addPanelsToSettingsDialog();
        }
        return Promise.resolve(_this2._calculateSectionsState()).then(function () {
          BaseLayout.prototype.openSettingsDialog.call(_this2, selectedKey, context);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Close Settings Dialog
     *
     * @private
     *
     */
    closeSettingsDialog: function _closeSettingsDialog() {
      const settingsDialog = this.getAggregation("settingsDialog");
      settingsDialog?.close();
    },
    /**
     * onBeforeRendering lifecycle method
     *
     * @private
     * @override
     */
    onBeforeRendering: function _onBeforeRendering(event) {
      try {
        const _this3 = this;
        BaseLayout.prototype.onBeforeRendering.call(_this3, event);

        // setup no-data container
        if (!_this3._noDataContainer) {
          _this3._noDataContainer = _this3.getItems().find(item => item instanceof NoDataContainer);

          // if no data container is already present, use it
          if (!_this3._noDataContainer) {
            _this3._customNoDataContainerPresent = false;
            _this3._noDataContainer = new NoDataContainer(`${_this3.getId()}-noDataContainer`);
          }
          _this3._noDataContainer.setVisible(false);
        }

        //prepare layout data, if not already done
        if (!_this3._aOrderedSections) {
          setTimeout(_this3._prepareLayoutData.bind(_this3));
        }

        //setup common layout features
        _this3._setupSettingsDialog();

        // Setup KeyUserPersonalization
        _this3._setupKeyUserSettingsDialog();

        //configure user action button if the layout is in an ushell environment
        return Promise.resolve(_this3._addUserActions()).then(function () {});
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Sets up the settings dialog for the layout.
     *
     * @private
     */
    _setupSettingsDialog: function _setupSettingsDialog() {
      const allPanels = [];
      (this.getItems() || []).forEach(container => {
        //link container to layout
        container.setAssociation("layout", this);

        //enable settings for all panels
        container.getContent().forEach(panel => {
          allPanels.push(panel);
          const panelEnableSettings = panel.getProperty("enableSettings");
          panel.setProperty("enableSettings", panelEnableSettings !== undefined ? panelEnableSettings : true);
        });
      });
      const enableSettings = this.getProperty("enableSettings");
      const settingsDialog = this.getAggregation("settingsDialog");
      if (!settingsDialog) {
        this._isDefaultSettingsDialog = true;

        // If settings dialog is not provided and settings is enabled, create a default settings dialog
        if (enableSettings) {
          const defaultSettingsDialog = this._getDefaultSettingsDialog(allPanels);
          this.setSettingsDialog(defaultSettingsDialog);
        }
      }
    },
    /**
     * Get default settings dialog
     * @private
     * @returns {BaseSettingsDialog} Default settings dialog
     */
    _getDefaultSettingsDialog: function _getDefaultSettingsDialog(allPanels) {
      const defaultSettingsDialog = new SettingsDialog(`${this.getId()}-settings-dialog`);
      allPanels.forEach(panel => {
        const settingsPanel = this._getDefaultSettingsPanel(panel);
        if (settingsPanel) {
          defaultSettingsDialog.addPanel(settingsPanel);
        }
      });

      //sort all panels and add them to the settings dialog
      const sortedPanels = this._sortPanels(defaultSettingsDialog.getPanels());
      defaultSettingsDialog.removeAllPanels();
      sortedPanels.forEach(panel => defaultSettingsDialog.addPanel(panel));
      defaultSettingsDialog.insertPanel(this._getLayoutSettingsPanel(), 0);
      defaultSettingsDialog.addPanel(this._getAdvancedSettingsPanel());
      return defaultSettingsDialog;
    },
    /**
     * Get default Settings Panel
     *
     * @private
     */
    _getDefaultSettingsPanel: function _getDefaultSettingsPanel(panel) {
      let settingsPanel;
      const panelClassName = panel.getMetadata().getName();
      switch (panelClassName) {
        case "sap.cux.home.NewsPanel":
          settingsPanel = new NewsSettingsPanel(`${panel.getId()}-news-settings`);
          break;
        case "sap.cux.home.PagePanel":
          settingsPanel = new PageSettingsPanel(`${panel.getId()}-page-settings`);
          break;
        case "sap.cux.home.TilesPanel":
          settingsPanel = new InsightsTilesSettingsPanel(`${panel.getId()}-tiles-settings`);
          break;
        case "sap.cux.home.CardsPanel":
          settingsPanel = new InsightsCardsSettingsPanel(`${panel.getId()}-cards-settings`);
          break;
        default:
          break;
      }
      settingsPanel?.setAssociation("panel", panel);
      return settingsPanel;
    },
    /**
     * Adds all settings panels to the settings dialog, including
     * the layout settings panel and advanced settings panel.
     *
     * @private
     */
    _addPanelsToSettingsDialog: function _addPanelsToSettingsDialog() {
      const settingsDialog = this.getAggregation("settingsDialog");

      //sort all panels and add them to the settings dialog
      const sortedPanels = this._sortPanels(settingsDialog.getPanels());
      settingsDialog.removeAllPanels();
      sortedPanels.forEach(panel => settingsDialog.addPanel(panel));

      // Layout Settings should be displayed only if no settings dialog is provided
      if (this._isDefaultSettingsDialog) {
        settingsDialog.insertPanel(this._getLayoutSettingsPanel(), 0);
        settingsDialog.addPanel(this._getAdvancedSettingsPanel());
      }
      settingsDialog.addPanel(this._getAdvancedSettingsPanel());
      this._addSettingsPanel(settingsDialog.getPanels(), true);
    },
    /**
     * Sorts settings panels based on a predefined order.
     *
     * @private
     * @returns {BaseSettingsPanel[]} Sorted settings panels.
     */
    _sortPanels: function _sortPanels(panels) {
      return Object.keys(SETTINGS_PANELS_KEYS).map(key => panels.find(panel => panel?.getProperty("key") === key)).filter(Boolean);
    },
    /**
     * Retrieves the advanced settings panel associated with the layout.
     *
     * @private
     * @returns {AdvancedSettingsPanel} The advanced settings panel.
     */
    _getAdvancedSettingsPanel: function _getAdvancedSettingsPanel() {
      if (!this._advancedSettingsPanel) {
        this._advancedSettingsPanel = new AdvancedSettingsPanel(`${this.getId()}-advanced-settings`);
        this._advancedSettingsPanel.setAssociation("panel", this);
      }
      return this._advancedSettingsPanel;
    },
    /**
     * Retrieves the layout settings panel associated with the layout.
     *
     * @private
     * @returns {LayoutSettingsPanel} The layout settings panel.
     */
    _getLayoutSettingsPanel: function _getLayoutSettingsPanel() {
      if (!this._layoutSettingsPanel) {
        this._layoutSettingsPanel = new LayoutSettingsPanel(`${this.getId()}-layout-settings`);
        this._layoutSettingsPanel.setAssociation("panel", this);
      }
      return this._layoutSettingsPanel;
    },
    /**
     * Prepares the layout data.
     *
     * @private
     */
    _prepareLayoutData: function _prepareLayoutData() {
      let hasVisibleSection = false;
      const aElements = this.getItems();
      // set aelementsMap as elementMap[] | [];
      const aElementMap = [];
      aElements.forEach(element => {
        if (element !== this._noDataContainer) {
          const sId = element.getId();

          //if no title set for container , then layout setting should show tooltip as title within the settings dialog
          let title = element.getProperty("title");
          if (!title) {
            title = element.getTooltip();
          }
          const elementVisible = element.getVisible();
          aElementMap.push({
            completeId: sId,
            sContainerType: element.getMetadata().getName(),
            blocked: false,
            visible: element.getProperty("visible"),
            title: element instanceof NewsAndPagesContainer ? this._i18nBundle.getText("myInterestMsg") : title,
            text: this._setTextValue(element)
          });
          if (elementVisible) {
            hasVisibleSection = true;
          }
        }
      });
      this._aOrderedSections = aElementMap;
      if (!this.getProperty("expanded")) {
        this.setNoDataContainerVisibility(!hasVisibleSection);
      }
    },
    /**
     * Sets the text value for the section
     * @private
     */
    _setTextValue: function _setTextValue(element) {
      if (element instanceof ToDosContainer) {
        return this._i18nBundle.getText("forMeTodayMsg");
      } else if (element instanceof AppsContainer) {
        return this._i18nBundle.getText("myAppMsg");
      }
      return "";
    },
    /**
     * Sets the visibility of the no data container
     *
     * @private
     */
    setNoDataContainerVisibility: function _setNoDataContainerVisibility(contentVisible) {
      this._noDataContainer?.setVisible(contentVisible);
      if (!this._customNoDataContainerPresent) {
        if (contentVisible) {
          this.insertItem(this._noDataContainer, 0);
        } else {
          this.removeItem(this._noDataContainer);
        }
      }
    },
    /**
     * Calculates the state of the sections based on the layout's content.
     * @private
     */
    _calculateSectionsState: function _calculateSectionsState() {
      try {
        const _this4 = this;
        const settingsDialog = _this4.getAggregation("settingsDialog");
        const aSettingsPanel = settingsDialog.getPanels();
        _this4._isCustomNews = false;
        aSettingsPanel.forEach(oSettingsPanel => {
          if (oSettingsPanel instanceof NewsSettingsPanel) {
            _this4._isCustomNews = true;
          }
          if (oSettingsPanel instanceof AdvancedSettingsPanel) {
            oSettingsPanel.resetImportModel(true);
          }
        });
        return Promise.resolve(_this4.setSectionDetails()).then(function () {});
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Sets the section details based on the layout's content.
     * @private
     */
    setSectionDetails: function _setSectionDetails() {
      try {
        const _this5 = this;
        const elementArray = _this5.getItems();
        const _temp7 = _forOf(elementArray, function (element) {
          function _temp6() {
            _this5._aOrderedSections?.forEach(oElementItem => {
              if (oElementItem.completeId === sId) {
                oElementItem.blocked = bBlocked;
                oElementItem.visible = element.getVisible();
              }
            });
          }
          let bBlocked = false;
          const sId = element.getId();
          //check news & apps visibility
          const _temp5 = function () {
            if (element instanceof NewsAndPagesContainer && element.getVisible()) {
              function _temp4(_this5$checkPagesBloc) {
                bBlocked = _this5$checkPagesBloc;
              }
              const aNewsAndPagesPanel = element.getContent();
              //check whether user has access to pages
              const _aNewsAndPagesPanel$l = aNewsAndPagesPanel.length;
              return _aNewsAndPagesPanel$l ? Promise.resolve(_this5.checkPagesBlocked(aNewsAndPagesPanel)).then(_temp4) : _temp4(false);
            } else if (element instanceof ToDosContainer) {
              bBlocked = _this5.checkToDoBlocked(element);
            }
          }();
          return _temp5 && _temp5.then ? _temp5.then(_temp6) : _temp6(_temp5);
        });
        return Promise.resolve(_temp7 && _temp7.then ? _temp7.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Check whether My Interest section is blocked or not
     * @private
     */
    checkPagesBlocked: function _checkPagesBlocked(aNewsAndPagesPanel) {
      try {
        const _this6 = this;
        function _temp10() {
          return !_this6._pagesAvailable && !_this6._isCustomNews ? true : false;
        }
        const _temp9 = _forOf(aNewsAndPagesPanel, function (oPanel) {
          const _temp8 = function () {
            if (oPanel instanceof PagePanel) {
              // find if user has any pages accessible
              return Promise.resolve(oPanel.getUserAvailablePages()).then(function (aPages) {
                if (aPages.length) {
                  _this6._pagesAvailable = true;
                }
              });
            }
          }();
          if (_temp8 && _temp8.then) return _temp8.then(function () {});
        });
        return Promise.resolve(_temp9 && _temp9.then ? _temp9.then(_temp10) : _temp10(_temp9)); //if user has no available pages and no  news feed, then block the section
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Check whether For Me Today section is blocked or not
     * @private
     */
    checkToDoBlocked: function _checkToDoBlocked(toDoContainer) {
      if (!toDoContainer.getVisible()) {
        const panels = toDoContainer.getContent();
        if (panels.length === 0) {
          this._toDoAccessible = false;
          return true;
        }
      }
      return false;
    },
    /**
     * Sets up the key user settings dialog for the layout.
     *
     * @private
     */
    _setupKeyUserSettingsDialog: function _setupKeyUserSettingsDialog() {
      const keyUserSettingsDialog = this.getAggregation("keyUserSettingsDialog");
      if (!keyUserSettingsDialog) {
        const defaultKeyUserSettingsDialog = new KeyUserSettingsDialog(`${this.getId()}-keyUser-settings-dialog`);

        // Add Key User Layout Settings Panel
        const keyUserLayoutSettingsPanel = new KeyUserLayoutSettingsPanel(`${this.getId()}-keyUser-layout-settings`);
        keyUserLayoutSettingsPanel.setAssociation("panel", this);
        defaultKeyUserSettingsDialog.addPanel(keyUserLayoutSettingsPanel);

        // Add News and Pages Settings Panel If News and Pages Container is available
        (this.getItems() || []).forEach(container => {
          if (container instanceof NewsAndPagesContainer) {
            const keyUserNewsPagesSettingsPanel = new KeyUserNewsPagesSettingsPanel(`${this.getId()}-keyUser-news-pages-settings`);
            // Set any panel of the containet to the settings panel as association
            keyUserNewsPagesSettingsPanel.setAssociation("panel", container.getContent()?.[0]);
            defaultKeyUserSettingsDialog.addPanel(keyUserNewsPagesSettingsPanel);
          }
        });
        this.setAggregation("keyUserSettingsDialog", defaultKeyUserSettingsDialog);
      }
    },
    /**
     * Return the pages availability value
     * @private
     */
    getpagesAvailable: function _getpagesAvailable() {
      return this._pagesAvailable;
    },
    /**
     * Return the To-Dos availability value
     * @private
     */
    isToDoAccessible: function _isToDoAccessible() {
      return this._toDoAccessible;
    },
    /**
     * Return whether customNews available or not
     */
    customNewAvailable: function _customNewAvailable() {
      return this._isCustomNews;
    },
    /**
     * Returns the set of sections present within the layout
     *
     * @private
     */
    getSections: function _getSections() {
      return this._aOrderedSections;
    },
    /**
     * Sets the sections present within the layout
     *
     * @private
     */
    setSections: function _setSections(sections) {
      this._aOrderedSections = sections;
    },
    /**
     * Resets the ordered sections of the layout.
     *
     * @private
     */
    resetSections: function _resetSections() {
      this._aOrderedSections = undefined;
      this._prepareLayoutData();
    }
  });
  return Layout;
});
//# sourceMappingURL=Layout-dbg-dbg.js.map
