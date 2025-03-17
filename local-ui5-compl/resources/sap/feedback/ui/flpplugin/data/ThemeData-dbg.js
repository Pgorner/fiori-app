"use strict";

sap.ui.define(["sap/feedback/ui/thirdparty/sap-px/pxapi", "../common/UI5Util", "../storage/LocalStorageHandler"], function (___sap_px_pxapi, __UI5Util, __LocalStorageHandler) {
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
  var ThemeId = ___sap_px_pxapi["ThemeId"];
  var UI5Util = _interopRequireDefault(__UI5Util);
  var LocalStorageHandler = _interopRequireDefault(__LocalStorageHandler);
  var ThemeData = /*#__PURE__*/function () {
    function ThemeData() {
      _classCallCheck(this, ThemeData);
    }
    return _createClass(ThemeData, null, [{
      key: "initLastTheme",
      value: function initLastTheme() {
        var currentThemeId = UI5Util.getThemeId();
        var lastThemeId = currentThemeId;
        var userState = LocalStorageHandler.getUserState();
        if (userState && userState.lastTheme) {
          lastThemeId = ThemeId[userState.lastTheme];
          if (!lastThemeId) {
            lastThemeId = currentThemeId;
          }
        }
        this.updateThemeState(lastThemeId, currentThemeId);
      }
    }, {
      key: "updateCurrentTheme",
      value: function updateCurrentTheme(newCurrentThemeId) {
        // Required as test are currently JavaScript based and input is string and invalid values not prohibited.
        var newThemeId = ThemeId[newCurrentThemeId] || ThemeId.none;
        var userState = LocalStorageHandler.getUserState();
        if (userState) {
          var lastCurrentThemeId = ThemeId[userState.currentTheme] || ThemeId.none;
          if (lastCurrentThemeId !== newThemeId) {
            this.updateThemeState(lastCurrentThemeId, newThemeId);
          }
        }
      }
    }, {
      key: "updateThemeState",
      value: function updateThemeState(newLastThemeId, currentThemeId) {
        LocalStorageHandler.updateLastTheme(newLastThemeId);
        LocalStorageHandler.updateCurrentTheme(currentThemeId);
      }
    }, {
      key: "getPreviousTheme",
      value: function getPreviousTheme() {
        var userState = LocalStorageHandler.getUserState();
        if (userState) {
          return ThemeId[userState.lastTheme] || ThemeId.none;
        }
        return ThemeId.none;
      }
    }]);
  }();
  return ThemeData;
});
//# sourceMappingURL=ThemeData-dbg.js.map
