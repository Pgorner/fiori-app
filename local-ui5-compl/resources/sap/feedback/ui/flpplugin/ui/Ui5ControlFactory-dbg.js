"use strict";

sap.ui.define(["sap/m/Button", "sap/m/Dialog", "sap/m/FormattedText"], function (Button, Dialog, FormattedText) {
  "use strict";

  function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
  function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
  function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
  function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  var Ui5ControlFactory = /*#__PURE__*/function () {
    function Ui5ControlFactory() {
      _classCallCheck(this, Ui5ControlFactory);
    }
    return _createClass(Ui5ControlFactory, null, [{
      key: "createButton",
      value: function createButton(settings) {
        return new Button(settings);
      }
    }, {
      key: "createDialog",
      value: function createDialog(settings, id) {
        return new Dialog(id, settings);
      }
    }, {
      key: "createFormattedText",
      value: function createFormattedText(settings) {
        return new FormattedText(settings);
      }
    }]);
  }();
  return Ui5ControlFactory;
});
//# sourceMappingURL=Ui5ControlFactory-dbg.js.map
