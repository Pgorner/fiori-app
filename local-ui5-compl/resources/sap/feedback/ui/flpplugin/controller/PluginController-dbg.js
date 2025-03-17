"use strict";

sap.ui.define(["sap/base/Log", "sap/ui/core/Theming", "../common/Constants", "../common/UI5Util", "../common/Util", "../data/AppContextData", "../data/ThemeData", "../ui/ShellBarButton"], function (Log, Theming, __Constants, __UI5Util, __Util, __AppContextData, __ThemeData, __ShellBarButton) {
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
  function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
  function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
  function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
  function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  var Constants = _interopRequireDefault(__Constants);
  var UI5Util = _interopRequireDefault(__UI5Util);
  var Util = _interopRequireDefault(__Util);
  var AppContextData = _interopRequireDefault(__AppContextData);
  var ThemeData = _interopRequireDefault(__ThemeData);
  var ShellBarButton = _interopRequireDefault(__ShellBarButton);
  var PluginController = /*#__PURE__*/function () {
    function PluginController(pxApiWrapper, resourceBundle) {
      _classCallCheck(this, PluginController);
      this._pxApiWrapper = pxApiWrapper;
      this._resourceBundle = resourceBundle;
    }

    // init
    return _createClass(PluginController, [{
      key: "initPlugin",
      value: function initPlugin() {
        try {
          var _temp2 = function _temp2() {
            _this.prepareThemingSupport();
            _this.initAppTriggeredPush();
          };
          var _this = this;
          var _temp = function () {
            if (_this._pxApiWrapper.pxApi.isUserInitiatedFeedbackEnabled) {
              return Promise.resolve(_this.initUserInitiatedFeedback()).then(function () {});
            }
          }();
          return Promise.resolve(_temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp));
        } catch (e) {
          return Promise.reject(e);
        }
      }
    }, {
      key: "prepareThemingSupport",
      value: function prepareThemingSupport() {
        ThemeData.initLastTheme();
        this._pxApiWrapper.updateThemeId(UI5Util.getTheme());
        this.subscribeThemeChanged();
      }
    }, {
      key: "initUserInitiatedFeedback",
      value: function initUserInitiatedFeedback() {
        try {
          var _this2 = this;
          return Promise.resolve(ShellBarButton.initShellBarButton(_this2._resourceBundle, _this2.openSurveyCallback.bind(_this2))).then(function () {});
        } catch (e) {
          return Promise.reject(e);
        }
      }
    }, {
      key: "subscribeThemeChanged",
      value: function subscribeThemeChanged() {
        //ActionItem:  UI5 2.0 Refactoring required
        // Done but untested
        Theming.attachApplied(this.themeChanged.bind(this));
      }
    }, {
      key: "themeChanged",
      value: function themeChanged(eventData) {
        this.onThemeChanged(eventData.theme);
      }
    }, {
      key: "openSurveyCallback",
      value: function openSurveyCallback() {
        try {
          var _this3 = this;
          var _temp3 = _catch(function () {
            return Promise.resolve(AppContextData.getData()).then(function (appContextData) {
              _this3._pxApiWrapper.openSurvey(appContextData);
            });
          }, function (error) {
            var message;
            if (error instanceof Error) {
              message = error.message;
            }
            Log.error(Constants.ERROR.CANNOT_TRIGGER_USER_INITIATED_FEEDBACK, message, Constants.COMPONENT.PLUGIN_CONTROLLER);
          });
          return Promise.resolve(_temp3 && _temp3.then ? _temp3.then(function () {}) : void 0);
        } catch (e) {
          return Promise.reject(e);
        }
      }
    }, {
      key: "onThemeChanged",
      value: function onThemeChanged(themeId) {
        var newThemeId = Util.convertStringToThemeId(themeId);
        this._pxApiWrapper.updateThemeId(newThemeId);
        ThemeData.updateCurrentTheme(newThemeId);
      }
    }, {
      key: "initAppTriggeredPush",
      value: function initAppTriggeredPush() {
        UI5Util.getEventBus().subscribe(Constants.EVENT_BUS.CHANNEL_ID, Constants.EVENT_BUS.EVENT_ID, this.eventBusCallback, this);
      }
    }, {
      key: "eventBusCallback",
      value: function eventBusCallback(_, __, eventData) {
        this._pxApiWrapper.requestPush(eventData);
      }
    }, {
      key: "unsubscribeFromTheEventBusForTesting",
      value: function unsubscribeFromTheEventBusForTesting() {
        UI5Util.getEventBus().unsubscribe(Constants.EVENT_BUS.CHANNEL_ID, Constants.EVENT_BUS.EVENT_ID, this.eventBusCallback, this);
      }
    }]);
  }();
  return PluginController;
});
//# sourceMappingURL=PluginController-dbg.js.map
