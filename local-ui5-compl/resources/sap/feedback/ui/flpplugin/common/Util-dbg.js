"use strict";

sap.ui.define(["sap/feedback/ui/thirdparty/sap-px/pxapi", "./Constants", "./Enumerations"], function (___sap_px_pxapi, __Constants, ___Enumerations) {
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
  var Constants = _interopRequireDefault(__Constants);
  var APP_FRAMEWORK = ___Enumerations["APP_FRAMEWORK"];
  var Util = /*#__PURE__*/function () {
    function Util() {
      _classCallCheck(this, Util);
    }
    return _createClass(Util, null, [{
      key: "convertStringToThemeId",
      value: function convertStringToThemeId(stringValue) {
        return ThemeId[stringValue] || ThemeId.none;
      }
    }, {
      key: "formatLanguageTag",
      value: function formatLanguageTag(input) {
        var trimmedInput = input.trim();
        if (trimmedInput && trimmedInput.length > 0) {
          return trimmedInput.toUpperCase();
        } else {
          return Constants.DEFAULT_LANGUAGE;
        }
      }
    }, {
      key: "stringToTitleCase",
      value: function stringToTitleCase(input) {
        if (input) {
          return input.replace(/\w\S*/g, function (intermediate) {
            return intermediate.charAt(0).toUpperCase() + intermediate.substring(1).toLowerCase();
          });
        }
        return input;
      }
    }, {
      key: "convertAppFrameworkTypeToId",
      value: function convertAppFrameworkTypeToId(frameworkType) {
        if (frameworkType) {
          return APP_FRAMEWORK[frameworkType.toLowerCase()] || APP_FRAMEWORK.unknown;
        }
        return APP_FRAMEWORK.unknown;
      }
    }, {
      key: "getWindowSearchLocation",
      value: function getWindowSearchLocation() {
        return window.location.search;
      }
    }, {
      key: "isUrlParamSet",
      value: function isUrlParamSet(urlParamKey) {
        var queryString = this.getWindowSearchLocation();
        if (queryString) {
          var urlParams = new URLSearchParams(queryString);
          if (urlParams && urlParams.has(urlParamKey)) {
            return true;
          }
        }
        return false;
      }
    }, {
      key: "getUrlParamValue",
      value: function getUrlParamValue(urlParamKey) {
        var queryString = this.getWindowSearchLocation();
        if (queryString) {
          var urlParams = new URLSearchParams(queryString);
          if (urlParams && urlParams.has(urlParamKey)) {
            var urlParamState = urlParams.get(urlParamKey);
            if (urlParamState) {
              return urlParamState.trim().toLocaleLowerCase();
            }
          }
        }
        return null;
      }
    }, {
      key: "isUnitIdUrlParamSet",
      value: function isUnitIdUrlParamSet() {
        return this.isUrlParamSet(Constants.URL_PARAMS.UNITID);
      }
    }, {
      key: "getUnitIdUrlParamValue",
      value: function getUnitIdUrlParamValue() {
        return this.getUrlParamValue(Constants.URL_PARAMS.UNITID);
      }
    }, {
      key: "isEnvironmentUrlParamSet",
      value: function isEnvironmentUrlParamSet() {
        return this.isUrlParamSet(Constants.URL_PARAMS.ENVIRONMENT);
      }
    }, {
      key: "getEnvironmentUrlParamValue",
      value: function getEnvironmentUrlParamValue() {
        return this.getUrlParamValue(Constants.URL_PARAMS.ENVIRONMENT);
      }
    }, {
      key: "ensureGlobalContext",
      value: function ensureGlobalContext(firstLevel, secondLevel) {
        if (!globalThis.sap) {
          globalThis.sap = {};
        }
        var globalSapObject = globalThis.sap;
        if (firstLevel) {
          if (!globalSapObject[firstLevel]) {
            globalSapObject[firstLevel] = {};
          }
          var createdFirstLevel = globalSapObject[firstLevel];
          if (secondLevel) {
            if (!createdFirstLevel[secondLevel]) {
              createdFirstLevel[secondLevel] = {};
            }
            return createdFirstLevel[secondLevel];
          }
          return createdFirstLevel;
        }
        return globalSapObject;
      }
    }]);
  }();
  return Util;
});
//# sourceMappingURL=Util-dbg.js.map
