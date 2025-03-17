/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/m/Button", "sap/m/NavContainer", "sap/m/Page", "sap/ui/core/Element", "sap/ui/core/EventBus", "./BaseSettingsDialog", "./changeHandler/LayoutHandler", "./flexibility/Layout.flexibility"], function (Button, NavContainer, Page, Element, EventBus, __BaseSettingsDialog, __layoutHandler, ___flexibility_Layoutflexibility) {
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
  const BaseSettingsDialog = _interopRequireDefault(__BaseSettingsDialog);
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
  const layoutHandler = _interopRequireDefault(__layoutHandler);
  const CHANGE_TYPES = ___flexibility_Layoutflexibility["CHANGE_TYPES"];
  /**
   *
   * Dialog class for Key User Settings.
   *
   * @extends BaseSettingsDialog
   *
   * @author SAP SE
   * @version 0.0.1
   * @since 1.121
   *
   * @internal
   * @experimental Since 1.122
   * @private
   *
   * @alias sap.cux.home.KeyUserSettingsDialog
   */
  const KeyUserSettingsDialog = BaseSettingsDialog.extend("sap.cux.home.KeyUserSettingsDialog", {
    metadata: {
      designtime: "not-adaptable-tree"
    },
    renderer: {
      apiVersion: 2
    },
    /**
     * Init lifecycle method
     *
     * @public
     * @override
     */
    init: function _init() {
      BaseSettingsDialog.prototype.init.call(this);
      this.controlMap = new Map();
      this.detailPageMap = new Map();

      //setup dialog
      this.setContentWidth("23.636rem");
      this.setContentHeight("23.33rem");
      this.setStretch(false);
      this.setShowHeader(false);

      //setup dialog buttons
      this.addButton(new Button(`${this.getId()}-dialog-save-btn`, {
        text: this._i18nBundle.getText("saveButton"),
        type: "Emphasized",
        press: this.saveChanges.bind(this)
      }));
      this.addButton(new Button(`${this.getId()}-dialog-close-btn`, {
        text: this._i18nBundle.getText("closeSettings"),
        type: "Transparent",
        press: this.handleCancel.bind(this)
      }));

      //setup dialog content
      const navContainerId = `${this.getId()}-navContainer`;
      const navContainer = new NavContainer(navContainerId);
      this.controlMap.set(navContainerId, navContainer);
      this.addContent(this.controlMap.get(navContainerId));
      this._eventBus = EventBus.getInstance();
      this._eventBus.subscribe("KeyUserChanges", "disabledSaveBtn", (channelId, eventId, data) => {
        //errorstate is false when import is successful
        // const { changes  = data as {disable: boolean, date: Date};
        this.getButtons()[0].setEnabled(!data?.disable);
      }, this);
    },
    /**
     * onBeforeRendering lifecycle method.
     * Prepares the SettingsDialog content.
     *
     * @public
     * @override
     */
    onBeforeRendering: function _onBeforeRendering(event) {
      BaseSettingsDialog.prototype.onBeforeRendering.call(this, event);
      const navContainer = this.getNavContainer();
      navContainer.removeAllPages();

      //setup master and detail page content
      this.getPanels().forEach((panel, index) => {
        navContainer.addPage(this.getPage(panel, !index));
      });

      // navigate to the first page
      if (navContainer.getPages()?.length) {
        this.navigateToPage(navContainer.getPages()[0]);
      }
    },
    /**
     * Returns the page content for the SettingsDialog.
     *
     * @private
     * @returns {Page} The page content for the SettingsDialog.
     */
    getPage: function _getPage(panel, isMasterPage) {
      const id = `${this.getId()}-${panel.getId()}-page`;
      let page = this.controlMap.get(id);
      if (!page) {
        const navContainer = this.getNavContainer();
        page = new Page(id, {
          title: panel.getProperty("title"),
          showHeader: true,
          content: panel.getAggregation("content"),
          backgroundDesign: "Transparent",
          showNavButton: isMasterPage ? false : true,
          navButtonPress: () => navContainer.back()
        });
        this.controlMap.set(id, page);

        // Set the details page map for navigation
        const associatedPanelId = panel.getAssociation("panel", null);
        const associatedPanel = Element.getElementById(associatedPanelId);
        const containerId = associatedPanel?.getParent()?.getId();
        if (containerId) {
          this.detailPageMap.set(containerId, page);
        }
      }
      return page;
    },
    /**
     * Navigates to the selected page.
     *
     * @param {Page} page The page to navigate to.
     */
    navigateToPage: function _navigateToPage(page) {
      const pageId = page?.getId();
      const panelId = pageId?.substring(0, pageId.lastIndexOf("-page"));
      const panel = this.getPanels().find(panel => panelId?.includes(panel.getId()));
      panel?.firePanelNavigated();
      const navContainerId = `${this.getId()}-navContainer`;
      const navContainer = this.controlMap.get(navContainerId);
      if (page) {
        navContainer.to(page);
      }
    },
    /**
     * Returns the details page for the selected panel.
     *
     * @param {BaseSettingsPanel} panel The selected panel.
     * @returns {Page | undefined} The details page for the selected panel.
     */
    getDetailsPage: function _getDetailsPage(containerId) {
      return this.detailPageMap.get(containerId);
    },
    /**
     * Checks if the selected panel has a details page.
     *
     * @param {BaseSettingsPanel} panel The selected panel.
     * @returns {boolean} True if the selected panel has a details page, false otherwise.
     */
    hasDetailsPage: function _hasDetailsPage(containerId) {
      return this.detailPageMap.has(containerId);
    },
    /**
     * Returns the NavContainer.
     *
     * @returns {NavContainer} NavContainer.
     */
    getNavContainer: function _getNavContainer() {
      const navContainerId = `${this.getId()}-navContainer`;
      return this.controlMap.get(navContainerId);
    },
    /**
     * Save the changes.
     *
     * @private
     */
    saveChanges: function _saveChanges() {
      try {
        const _this = this;
        return Promise.resolve(_this.isValidChanges()).then(function (isValidChanges) {
          if (isValidChanges) {
            const allPanels = _this.getPanels();
            allPanels.forEach(panel => {
              const panelChanges = panel.getKeyUserChanges();
              if (panelChanges.length) {
                _this.createAndAddChanges(panelChanges);
                panel.clearKeyUserChanges();
              }
            });
            allPanels[1]?.onSaveClearChanges();
            _this.close();
            layoutHandler.resolve();
            layoutHandler.clearChanges();
          }
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    isValidChanges: function _isValidChanges() {
      try {
        const _this2 = this;
        let isValidChanges = true;
        const keyUserNewsPagePanel = _this2.getPanels()[1];
        const panelChanges = keyUserNewsPagePanel.getKeyUserChanges();
        const _temp2 = _forOf(panelChanges, function (change) {
          const _temp = function () {
            if (change.changeSpecificData.changeType === CHANGE_TYPES.NEWS_FEED_URL) {
              return Promise.resolve(keyUserNewsPagePanel.isNewsChangesValid()).then(function (_keyUserNewsPagePanel) {
                isValidChanges = _keyUserNewsPagePanel;
              });
            }
          }();
          if (_temp && _temp.then) return _temp.then(function () {});
        });
        return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {
          return isValidChanges;
        }) : isValidChanges);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Create and add keyuser changes to layoutHandler
     *
     * @private
     */
    createAndAddChanges: function _createAndAddChanges(changes) {
      const allChanges = [];
      changes.forEach(change => {
        allChanges.push(change);
      });
      layoutHandler.addChanges(allChanges);
    },
    /**
     * Handle cancel event.
     *
     * @private
     */
    handleCancel: function _handleCancel() {
      const allPanels = this.getPanels();
      allPanels.forEach(panel => {
        const panelChanges = panel.getKeyUserChanges();
        if (panelChanges.length) {
          panel.clearKeyUserChanges();
        }
      });
      const keyUserNewsPagePanel = this.getPanels()[1];
      keyUserNewsPagePanel.onCancelClearKeyUserChanges();
      this.close();
    }
  });
  return KeyUserSettingsDialog;
});
//# sourceMappingURL=KeyUserSettingsDialog-dbg-dbg.js.map
