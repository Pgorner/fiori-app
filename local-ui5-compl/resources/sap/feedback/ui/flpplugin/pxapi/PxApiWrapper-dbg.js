"use strict";

sap.ui.define(["./PxApiFactory", "../common/Constants", "../common/Util"], function (__PxApiFactory, __Constants, __Util) {
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
  var PxApiFactory = _interopRequireDefault(__PxApiFactory);
  var Constants = _interopRequireDefault(__Constants);
  var Util = _interopRequireDefault(__Util);
  var PxApiWrapper = /*#__PURE__*/function () {
    function PxApiWrapper(pluginInfo) {
      _classCallCheck(this, PxApiWrapper);
      this._pxApi = PxApiFactory.createPxApi();
      this.updatePxClient(pluginInfo);
    }
    return _createClass(PxApiWrapper, [{
      key: "pxApi",
      get: function get() {
        return this._pxApi;
      }
    }, {
      key: "invitationDialog",
      get: function get() {
        return this._invitationDialog;
      },
      set: function set(value) {
        this._invitationDialog = value;
      }
    }, {
      key: "initialize",
      value: function initialize(tenantInfo, configIdentifier, configJson, surveyInvitationDialogCallback) {
        try {
          var _this = this;
          return Promise.resolve(_this._pxApi.initialize(tenantInfo, configIdentifier, configJson, surveyInvitationDialogCallback));
        } catch (e) {
          return Promise.reject(e);
        }
      }
    }, {
      key: "openSurvey",
      value: function openSurvey(appContextData) {
        this._pxApi.openSurvey(appContextData);
      }
    }, {
      key: "requestPush",
      value: function requestPush(pushData) {
        this._pxApi.requestPush(pushData);
      }
    }, {
      key: "updateThemeId",
      value: function updateThemeId(themeId) {
        this._pxApi.currentThemeId = themeId;
      }
    }, {
      key: "updatePxClient",
      value: function updatePxClient(pluginInfo) {
        var infoContext = Util.ensureGlobalContext('qtx', 'info');
        if (pluginInfo && pluginInfo.version) {
          var version = pluginInfo.version.indexOf('project.version') === -1 ? pluginInfo.version : Constants.PXCLIENT_INFO_VERSION_FALLBACK;
          infoContext.pxclient += " ".concat(pluginInfo.id, "/1.132.0");
          return;
        }
        infoContext.pxlient += "".concat(Constants.PXCLIENT_INFO_NAME_FALLBACK, "/").concat(Constants.PXCLIENT_INFO_VERSION_FALLBACK);
      }
    }]);
  }();
  return PxApiWrapper;
});
//# sourceMappingURL=PxApiWrapper-dbg.js.map
