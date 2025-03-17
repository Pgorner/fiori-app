/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/base/ClassSupport", "sap/fe/core/buildingBlocks/BuildingBlock", "sap/sac/df/DesignerPanel", "sap/sac/df/utils/MetaPathHelper", "sap/fe/base/jsx-runtime/jsx"], function (ClassSupport, BuildingBlock, DFDesignerPanel, MetaPathHelper, _jsx) {
  "use strict";

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5;
  var _exports = {};
  var property = ClassSupport.property;
  var defineUI5Class = ClassSupport.defineUI5Class;
  function _initializerDefineProperty(e, i, r, l) { r && Object.defineProperty(e, i, { enumerable: r.enumerable, configurable: r.configurable, writable: r.writable, value: r.initializer ? r.initializer.call(l) : void 0 }); }
  function _inheritsLoose(t, o) { t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o); }
  function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
  function _applyDecoratedDescriptor(i, e, r, n, l) { var a = {}; return Object.keys(n).forEach(function (i) { a[i] = n[i]; }), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = !0), a = r.slice().reverse().reduce(function (r, n) { return n(i, e, r) || r; }, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a; }
  function _initializerWarningHelper(r, e) { throw Error("Decorating class property failed. Please ensure that transform-class-properties is enabled and runs after the decorators transform."); }
  /**
   * Building block for creating a dragonfly designer panel
   * @experimental
   */
  let DesignerPanel = (_dec = defineUI5Class("sap.fe.ina.blocks.DesignerPanel"), _dec2 = property({
    type: "string",
    required: true
  }), _dec3 = property({
    type: "string",
    required: true
  }), _dec4 = property({
    type: "string",
    required: false,
    defaultValue: true
  }), _dec5 = property({
    type: "string",
    required: false
  }), _dec6 = property({
    type: "string",
    required: false
  }), _dec(_class = (_class2 = /*#__PURE__*/function (_BuildingBlock) {
    function DesignerPanel(idOrSettings, settings) {
      var _this;
      _this = _BuildingBlock.call(this, idOrSettings, settings) || this;
      _initializerDefineProperty(_this, "id", _descriptor, _this);
      _initializerDefineProperty(_this, "metaPath", _descriptor2, _this);
      _initializerDefineProperty(_this, "hideAvailableObjects", _descriptor3, _this);
      _initializerDefineProperty(_this, "height", _descriptor4, _this);
      _initializerDefineProperty(_this, "width", _descriptor5, _this);
      return _this;
    }
    _exports = DesignerPanel;
    _inheritsLoose(DesignerPanel, _BuildingBlock);
    var _proto = DesignerPanel.prototype;
    _proto.applySettings = function applySettings(mSettings, oScope) {
      _BuildingBlock.prototype.applySettings.call(this, mSettings, oScope);
      this.content = this.createContent();
      return this;
    };
    _proto.createContent = function createContent() {
      this.id = this.id + "::DesignerPanel";
      const sMetaPath = "mdm>" + MetaPathHelper.PathTo.DataProviders + this.metaPath;
      return _jsx(DFDesignerPanel, {
        id: this.id,
        metaPath: sMetaPath,
        hideAvailableObjects: this.hideAvailableObjects,
        height: this.height,
        width: this.width
      });
    };
    return DesignerPanel;
  }(BuildingBlock), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "id", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "metaPath", [_dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "hideAvailableObjects", [_dec4], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "height", [_dec5], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return "100%";
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "width", [_dec6], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return "100%";
    }
  }), _class2)) || _class);
  _exports = DesignerPanel;
  return _exports;
}, false);
//# sourceMappingURL=DesignerPanel-dbg.js.map
