"use strict";

sap.ui.define(["../common/Constants", "../common/UI5Util"], function (__Constants, __UI5Util) {
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
  var UI5Util = _interopRequireDefault(__UI5Util);
  var ShellBarButton = /*#__PURE__*/function () {
    function ShellBarButton() {
      _classCallCheck(this, ShellBarButton);
    }
    return _createClass(ShellBarButton, null, [{
      key: "initShellBarButton",
      value: function initShellBarButton(resourceBundle, openSurveyCallback) {
        try {
          var _this = this;
          return Promise.resolve(UI5Util.getExtensionService()).then(function (shellExtensionService) {
            var headerItem = _this.getHeaderItem(resourceBundle, openSurveyCallback);
            return Promise.resolve(shellExtensionService.createHeaderItem(headerItem, {
              position: 'end'
            })).then(function (headerEndItem) {
              headerEndItem.showOnHome().showForAllApps();
            });
          });
        } catch (e) {
          return Promise.reject(e);
        }
      }
    }, {
      key: "getHeaderItem",
      value: function getHeaderItem(resourceBundle, openSurveyCallback) {
        var userInitiatedFeedbackText = resourceBundle.getText(Constants.SHELLBAR_BUTTON_TOOLTIP);
        return {
          id: Constants.SHELLBAR_BTN_ID,
          icon: 'sap-icon://feedback',
          tooltip: userInitiatedFeedbackText,
          ariaLabel: userInitiatedFeedbackText,
          text: userInitiatedFeedbackText,
          press: function press() {
            openSurveyCallback();
          }
        };
      }
    }]);
  }();
  return ShellBarButton;
});
//# sourceMappingURL=ShellBarButton-dbg.js.map
