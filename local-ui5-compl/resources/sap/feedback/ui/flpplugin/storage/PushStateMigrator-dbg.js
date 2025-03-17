"use strict";

sap.ui.define(["sap/base/Log", "./LocalStorageHandler", "../common/Constants"], function (Log, __LocalStorageHandler, __Constants) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
  function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
  function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
  function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
  function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
  function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
  function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  var LocalStorageHandler = _interopRequireDefault(__LocalStorageHandler);
  var Constants = _interopRequireDefault(__Constants);
  var PushStateMigrator = /*#__PURE__*/function () {
    function PushStateMigrator() {
      _classCallCheck(this, PushStateMigrator);
    }
    return _createClass(PushStateMigrator, null, [{
      key: "migrate",
      value:
      // returns 'false' only in case of failure while migrating the push state (worst case) else 'true'
      function migrate() {
        var userState = LocalStorageHandler.getUserState();
        if (userState) {
          if (this.isOldPushStateAvailable(userState)) {
            var newUserState = this.getNewUserState(userState);
            return LocalStorageHandler.updateUserState(newUserState);
          } else {
            Log.debug(Constants.DEBUG.NO_OLD_PUSH_STATE, undefined, Constants.COMPONENT.PUSH_STATE_MIGRATOR);
          }
        }
        return true;
      }
    }, {
      key: "isOldPushStateAvailable",
      value: function isOldPushStateAvailable(userState) {
        if (userState.dynamicPushDate || userState.inAppPushDate || userState.featurePushStates) {
          return true;
        }
        return false;
      }
    }, {
      key: "getNewUserState",
      value: function getNewUserState(userState) {
        var _this = this;
        var keyValues = Object.keys(userState).map(function (key) {
          var newKey = _this.pushStateKeyMap[key] || key;
          return _defineProperty({}, newKey, userState[key]);
        });
        return Object.assign.apply(Object, [{}].concat(_toConsumableArray(keyValues)));
      }
    }, {
      key: "pushStateKeyMap",
      get: function get() {
        return {
          dynamicPushDate: 'timedPushDate',
          inAppPushDate: 'appPushDate',
          featurePushStates: 'appPushStates'
        };
      }
    }]);
  }();
  return PushStateMigrator;
});
//# sourceMappingURL=PushStateMigrator-dbg.js.map
