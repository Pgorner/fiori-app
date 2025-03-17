"use strict";

sap.ui.define(["sap/base/Log", "../common/Constants"], function (Log, __Constants) {
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
  var Constants = _interopRequireDefault(__Constants);
  var LocalStorageHandler = /*#__PURE__*/function () {
    function LocalStorageHandler() {
      _classCallCheck(this, LocalStorageHandler);
    }
    return _createClass(LocalStorageHandler, null, [{
      key: "getUserState",
      value: function getUserState() {
        try {
          var userStateString = this.getLocalStorage().getItem(Constants.PUSH_STATE_STORAGE_KEY);
          if (userStateString) {
            return JSON.parse(userStateString);
          }
        } catch (error) {
          Log.error(Constants.ERROR.UNABLE_TO_PARSE_USER_STATE, error.message, Constants.COMPONENT.LOCAL_STORAGE_HANDLER);
        }
        return undefined;
      }
    }, {
      key: "updateUserState",
      value: function updateUserState(userState) {
        try {
          if (userState) {
            var userStateString = JSON.stringify(userState);
            this.getLocalStorage().setItem(Constants.PUSH_STATE_STORAGE_KEY, userStateString);
            Log.debug(Constants.DEBUG.PUSH_STATE_MIGRATED);
          }
        } catch (error) {
          Log.error(Constants.ERROR.UNABLE_TO_UPDATE_USER_STATE, error.message, Constants.COMPONENT.LOCAL_STORAGE_HANDLER);
          return false;
        }
        return true;
      }
    }, {
      key: "updateLastTheme",
      value: function updateLastTheme(themeId) {
        var userState = this.getUserState();
        if (userState && themeId) {
          userState.lastTheme = themeId;
          this.updateUserState(userState);
        }
      }
    }, {
      key: "updateCurrentTheme",
      value: function updateCurrentTheme(themeId) {
        var userState = this.getUserState();
        if (userState && themeId) {
          userState.currentTheme = themeId;
          this.updateUserState(userState);
        }
      }
    }, {
      key: "getLocalStorage",
      value: function getLocalStorage() {
        return localStorage;
      }
    }]);
  }();
  return LocalStorageHandler;
});
//# sourceMappingURL=LocalStorageHandler-dbg.js.map
