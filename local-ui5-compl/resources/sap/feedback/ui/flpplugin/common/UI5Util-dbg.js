"use strict";

sap.ui.define(["sap/base/i18n/Localization", "sap/ui/core/EventBus", "sap/ui/core/Theming", "./Util"], function (Localization, EventBus, Theming, __Util) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
  function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
  function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
  function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  var Util = _interopRequireDefault(__Util);
  var UI5Util = /*#__PURE__*/function () {
    function UI5Util() {
      _classCallCheck(this, UI5Util);
    }
    return _createClass(UI5Util, null, [{
      key: "getShellContainer",
      value: function getShellContainer() {
        try {
          //ActionItem: UI5 2.0 Refactoring required
          // Done but untested & workaround
          return Promise.resolve(new Promise(function (fnResolve) {
            sap.ui.require(['sap/ushell/Container'], function (Container) {
              fnResolve(Container);
            });
          }));
        } catch (e) {
          return Promise.reject(e);
        }
      }
    }, {
      key: "getAppLifeCycleService",
      value: function getAppLifeCycleService() {
        try {
          var _this = this;
          return Promise.resolve(_this.getShellContainer()).then(function (shellContainer) {
            // ActionItem: As per JSDoc, getServiceAsync returns 'Promise<sap.ushell.services.Service>' as return value
            var appLifeCycleService = shellContainer.getServiceAsync('AppLifeCycle');
            return appLifeCycleService;
          });
        } catch (e) {
          return Promise.reject(e);
        }
      }
    }, {
      key: "getExtensionService",
      value: function getExtensionService() {
        try {
          var _this2 = this;
          return Promise.resolve(_this2.getShellContainer()).then(function (shellContainer) {
            // ActionItem: As per JSDoc, getServiceAsync returns 'Promise<sap.ushell.services.Service>' as return value
            var appLifeCycleService = shellContainer.getServiceAsync('Extension');
            return appLifeCycleService;
          });
        } catch (e) {
          return Promise.reject(e);
        }
      }
    }, {
      key: "getCurrentApp",
      value: function getCurrentApp() {
        try {
          var _this3 = this;
          return Promise.resolve(_this3.getAppLifeCycleService()).then(function (appAppLifeCycleService) {
            return appAppLifeCycleService.getCurrentApplication();
          });
        } catch (e) {
          return Promise.reject(e);
        }
      }
    }, {
      key: "getTheme",
      value: function getTheme() {
        //ActionItem:  UI5 2.0 Refactoring required
        // Done but untested
        return Theming.getTheme();
      }
    }, {
      key: "getThemeId",
      value: function getThemeId() {
        //ActionItem:  UI5 2.0 Refactoring required
        // Done but untested
        var themeId = this.getTheme();
        return Util.convertStringToThemeId(themeId);
      }
    }, {
      key: "getLanguage",
      value: function getLanguage() {
        //ActionItem:  UI5 2.0 Refactoring required
        // Done but untested
        return Localization.getLanguage();
      }
    }, {
      key: "getEventBus",
      value: function getEventBus() {
        return EventBus.getInstance();
      }
    }]);
  }();
  return UI5Util;
});
//# sourceMappingURL=UI5Util-dbg.js.map
