/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/base/Log", "sap/ushell/Container", "./BaseContainer", "./utils/Device"], function (Log, Container, __BaseContainer, ___utils_Device) {
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
  const BaseContainer = _interopRequireDefault(__BaseContainer);
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
  const DeviceType = ___utils_Device["DeviceType"];
  /**
   *
   * Container class for managing and storing To-Do cards.
   *
   * @extends BaseContainer
   *
   * @author SAP SE
   * @version 0.0.1
   * @since 1.121
   *
   * @internal
   * @experimental Since 1.121
   * @public
   *
   * @alias sap.cux.home.ToDosContainer
   */
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
  const ToDosContainer = BaseContainer.extend("sap.cux.home.ToDosContainer", {
    renderer: {
      ...BaseContainer.renderer,
      apiVersion: 2
    },
    metadata: {
      library: "sap.cux.home",
      properties: {
        fullScreenName: {
          type: "string",
          group: "Misc",
          defaultValue: "ST1",
          visibility: "hidden"
        }
      }
    },
    /**
     * Constructor for a new To-Dos container.
     *
     * @param {string} [id] ID for the new control, generated automatically if an ID is not provided
     * @param {object} [settings] Initial settings for the new control
     */
    constructor: function _constructor(id, settings) {
      BaseContainer.prototype.constructor.call(this, id, settings);
    },
    /**
     * Init lifecycle method
     *
     * @private
     * @override
     */
    init: function _init() {
      BaseContainer.prototype.init.call(this);

      //Update Container Title
      this.setProperty("title", this._i18nBundle?.getText("toDosTitle"));
      this.addStyleClass("sapCuxToDosContainer");
      this._isAuthCheckRequired = true;
    },
    /**
     * onBeforeRendering lifecycle method
     *
     * @private
     * @override
     */
    onBeforeRendering: function _onBeforeRendering() {
      try {
        const _this = this;
        BaseContainer.prototype.onBeforeRendering.call(_this);
        _this._iconTabBarControl = _this._getInnerControl();

        //initiate loading of all cards after auth check
        const _temp2 = _catch(function () {
          return Promise.resolve(_this._performAuthCheck()).then(function () {
            const panels = _this.getContent() || [];
            const unsupportedPanels = panels.filter(panel => !panel._getSupported());
            const _temp = function () {
              if (unsupportedPanels.length === panels.length) {
                _this._handleToDoUnauthorizedAccess();
              } else {
                // Hide IconTabBar header if only one panel is accessible
                const isOnePanelSupported = panels.length - unsupportedPanels.length === 1;
                _this._iconTabBarControl?.toggleStyleClass("sapUiITBHide", isOnePanelSupported);
                return Promise.resolve(_this._loadAllPanels()).then(function () {});
              }
            }();
            if (_temp && _temp.then) return _temp.then(function () {});
          });
        }, function (error) {
          _this._handleToDoUnauthorizedAccess(error);
        });
        return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Performs an authorization check for the ToDosContainer.
     * Checks if the authorization check is required and updates panel support accordingly.
     *
     * @private
     * @async
     * @returns {Promise<void>} A Promise that resolves when the authorization check is completed.
     * @throws {Error} If an error occurs during the authorization check.
     */
    _performAuthCheck: function _performAuthCheck() {
      try {
        const _this2 = this;
        return Promise.resolve(_catch(function () {
          if (!_this2._isAuthCheckRequired) {
            return Promise.resolve();
          } else {
            return Promise.resolve(Container.getServiceAsync("Navigation")).then(function (navigationService) {
              const panels = _this2.getContent() || [];
              const intents = panels.map(panel => panel._getAppIntent());
              return Promise.resolve(navigationService.isNavigationSupported(intents)).then(function (_navigationService$is) {
                const responses = _navigationService$is;
                //Update panel support information
                panels.forEach((panel, index) => panel._setSupported(responses[index].supported));
                _this2._isAuthCheckRequired = false;
                return Promise.resolve();
              });
            });
          }
        }, function (oError) {
          return Promise.reject(oError);
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Handles unauthorized access to the ToDosContainer by hiding all inner controls
     *
     * @private
     * @param {Error} error - An optional custom error message or an Error object.
     */
    _handleToDoUnauthorizedAccess: function _handleToDoUnauthorizedAccess(error) {
      //Remove all Inner Controls
      Log.error(error?.message || "User has no access to any available panels");
      this.getContent()?.forEach(panel => this.removeContent(panel));
      this.setVisible(false);
    },
    /**
     * Asynchronously loads all panels, ensuring the currently selected panel is loaded first.
     *
     * @private
     * @async
     * @param {boolean} forceRefresh - force refresh cards
     * @returns {Promise<void>} A promise that resolves when all panels are loaded.
     */
    _loadAllPanels: function _loadAllPanels(forceRefresh) {
      try {
        const _this3 = this;
        //Sort panels so that the current panel is always loaded first
        const selectedKey = _this3.getProperty("selectedKey");
        const panels = _this3.getContent() || [];
        const sortedPanels = [...panels].sort((firstPanel, secondPanel) => {
          if (firstPanel.getProperty("key") === selectedKey) {
            return -1;
          }
          if (secondPanel.getProperty("key") === selectedKey) {
            return 1;
          }
          return 0;
        });
        return Promise.resolve(_forOf(sortedPanels, function (panel) {
          const _temp3 = function () {
            if (!panel._isLoaded?.()) {
              return Promise.resolve(panel._loadCards(forceRefresh)).then(function () {});
            }
          }();
          if (_temp3 && _temp3.then) return _temp3.then(function () {});
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Overridden method for selection of panel in the IconTabBar.
     * Loads the selected panel and updates the header elements as well
     *
     * @private
     * @async
     * @override
     */
    _onPanelSelect: function _onPanelSelect(event) {
      try {
        const _this4 = this;
        function _temp5() {
          //updates refresh information of the selected panel
          selectedPanel._updateRefreshInformation();
        }
        BaseContainer.prototype._onPanelSelect.call(_this4, event);

        //load panel if not loaded already
        const selectedPanel = _this4._getSelectedPanel();
        const _temp4 = function () {
          if (!selectedPanel._isLoaded()) {
            return Promise.resolve(selectedPanel._loadCards(true)).then(function () {});
          }
        }();
        return Promise.resolve(_temp4 && _temp4.then ? _temp4.then(_temp5) : _temp5(_temp4));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Asynchronously refreshes the section by forcing all inner panels to be reloaded.
     *
     * @public
     * @async
     * @returns {Promise<void>} A promise that resolves when the section is successfully refreshed.
     */
    refreshData: function _refreshData() {
      try {
        const _this5 = this;
        //Force all inner panels to be reloaded
        _this5.getContent()?.forEach(panel => panel._setLoaded(false));
        return Promise.resolve(_this5._loadAllPanels(true));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Gets the selected key of the To-Dos container.
     * If no selected key is set, it defaults to the first item.
     *
     * @public
     * @returns {string} The selected key.
     */
    getSelectedKey: function _getSelectedKey() {
      //Default selected key to first item, if null
      if (!this.getProperty("selectedKey")) {
        this.setProperty("selectedKey", this._getDefaultKey());
      }
      return this.getProperty("selectedKey");
    },
    /**
     * Gets the default key for the ToDosContainer by returning the key of the first panel
     *
     * @private
     * @returns {string} The default key if it exists, or null if there are no panels
     */
    _getDefaultKey: function _getDefaultKey() {
      return this.getContent()?.[0]?.getProperty("key");
    },
    /**
     * Adjusts the layout of the all panels in the container.
     *
     * @private
     * @override
     */
    adjustLayout: function _adjustLayout() {
      //hide actions if the device is a phone
      this.toggleActionButtons(this.getDeviceType() !== DeviceType.Mobile);

      //adjust layout of all panels
      this.getContent()?.forEach(panel => panel._adjustLayout());
    }
  });
  return ToDosContainer;
});
//# sourceMappingURL=ToDosContainer-dbg-dbg.js.map
