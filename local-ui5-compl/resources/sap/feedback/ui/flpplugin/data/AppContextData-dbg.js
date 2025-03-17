"use strict";

sap.ui.define(["sap/base/Log", "sap/ushell/services/AppConfiguration", "./ThemeData", "../common/Constants", "../common/UI5Util", "../common/Util"], function (Log, AppConfiguration, __ThemeData, __Constants, __UI5Util, __Util) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
  function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
  function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
  function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  var ThemeData = _interopRequireDefault(__ThemeData);
  var Constants = _interopRequireDefault(__Constants);
  var UI5Util = _interopRequireDefault(__UI5Util);
  var Util = _interopRequireDefault(__Util);
  /**
   * NOTE: Need to verify few un-identified UI5 Types which are currently missing in UI5 type definitions, marked them as TODO below.
   */
  var AppContextData = /*#__PURE__*/function () {
    function AppContextData() {
      _classCallCheck(this, AppContextData);
    }
    return _createClass(AppContextData, null, [{
      key: "getData",
      value: function getData() {
        try {
          var _this = this;
          return Promise.resolve(_this.calculateAppContextData());
        } catch (e) {
          return Promise.reject(e);
        }
      }
    }, {
      key: "calculateAppContextData",
      value: function calculateAppContextData() {
        try {
          var _this2 = this;
          return Promise.resolve(UI5Util.getCurrentApp()).then(function (currentApp) {
            if (currentApp) {
              if (_this2.isAppTypeSupported(currentApp.applicationType.toLowerCase())) {
                return Promise.resolve(_this2.getAppInfo(currentApp)).then(function (appInfo) {
                  return _this2.getContextData(appInfo);
                });
              } else {
                Log.warning(Constants.WARNING.UNSUPPORTED_APP_TYPE, undefined, Constants.COMPONENT.APP_CONTEXT_DATA);
                return _this2._appContextData;
              }
            } else {
              Log.error(Constants.ERROR.CURRENT_APP_NOT_AVAILABLE, undefined, Constants.COMPONENT.APP_CONTEXT_DATA);
              throw new Error(Constants.ERROR.CURRENT_APP_NOT_AVAILABLE);
            }
          });
        } catch (e) {
          return Promise.reject(e);
        }
      }
    }, {
      key: "isAppTypeSupported",
      value: function isAppTypeSupported(appType) {
        return Constants.SUPPORTED_APP_TYPES.indexOf(appType) > -1;
      }
    }, {
      key: "getAppInfo",
      value: function getAppInfo(currentApp) {
        try {
          return Promise.resolve(currentApp.getInfo(['appId', 'appVersion', 'appSupportInfo', 'technicalAppComponentId', 'appFrameworkId', 'appFrameworkVersion'])).then(function (_currentApp$getInfo) {
            var appInfo = _currentApp$getInfo;
            if (appInfo) {
              var metadata = AppConfiguration.getMetadata(); // Open: no getMetadata function as per definition
              if (metadata !== null && metadata !== void 0 && metadata.title) {
                appInfo.appTitle = metadata.title;
              }
              if ((appInfo === null || appInfo === void 0 ? void 0 : appInfo.appId) === Constants.LAUNCHPAD_VALUE) {
                appInfo.appTitle = Util.stringToTitleCase(appInfo.appId);
              }
            }
            return appInfo;
          });
        } catch (e) {
          return Promise.reject(e);
        }
      }
    }, {
      key: "getContextData",
      value: function getContextData(appInfo) {
        try {
          var _this3 = this;
          var contextData = {};
          contextData.previousTheme = ThemeData.getPreviousTheme();
          contextData.theme = UI5Util.getTheme();
          contextData.languageTag = _this3.getLanguage();
          if (appInfo) {
            contextData.appFrameworkId = Util.convertAppFrameworkTypeToId(appInfo['appFrameworkId']);
            contextData.appFrameworkVersion = appInfo['appFrameworkVersion'] || Constants.DEFAULT_VALUE_NA;
            contextData.appId = appInfo['appId'] || Constants.DEFAULT_VALUE_NA;
            contextData.appTitle = appInfo['appTitle'] || Constants.DEFAULT_VALUE_NA;
            contextData.technicalAppComponentId = appInfo['technicalAppComponentId'] || Constants.DEFAULT_VALUE_NA;
            contextData.appVersion = appInfo['appVersion'] || Constants.DEFAULT_VALUE_NA;
            contextData.appSupportInfo = appInfo['appSupportInfo'] || Constants.DEFAULT_VALUE_NA;
          } else {
            contextData.appFrameworkId = Util.convertAppFrameworkTypeToId(undefined);
            contextData.appFrameworkVersion = Constants.DEFAULT_VALUE_NA;
            contextData.appId = Constants.DEFAULT_VALUE_NA;
            contextData.appTitle = Constants.DEFAULT_VALUE_NA;
            contextData.technicalAppComponentId = Constants.DEFAULT_VALUE_NA;
            contextData.appVersion = Constants.DEFAULT_VALUE_NA;
            contextData.appSupportInfo = Constants.DEFAULT_VALUE_NA;
          }
          return Promise.resolve(contextData);
        } catch (e) {
          return Promise.reject(e);
        }
      }
    }, {
      key: "getLanguage",
      value: function getLanguage() {
        return Util.formatLanguageTag(UI5Util.getLanguage());
      }
    }]);
  }();
  _defineProperty(AppContextData, "_appContextData", {
    appFrameworkId: Constants.DEFAULT_VALUE_NA,
    appFrameworkVersion: Constants.DEFAULT_VALUE_NA,
    theme: Constants.DEFAULT_VALUE_NA,
    appId: Constants.DEFAULT_VALUE_NA,
    appTitle: Constants.DEFAULT_VALUE_NA,
    languageTag: Constants.DEFAULT_VALUE_NA,
    technicalAppComponentId: Constants.DEFAULT_VALUE_NA,
    appVersion: Constants.DEFAULT_VALUE_NA,
    appSupportInfo: Constants.DEFAULT_VALUE_NA
  });
  return AppContextData;
});
//# sourceMappingURL=AppContextData-dbg.js.map
