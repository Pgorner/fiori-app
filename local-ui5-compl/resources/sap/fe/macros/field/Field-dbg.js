/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/base/ClassSupport", "sap/fe/core/buildingBlocks/templating/BuildingBlockSupport", "sap/fe/macros/controls/BuildingBlockWithTemplating", "sap/fe/macros/internal/InternalField.block"], function (ClassSupport, BuildingBlockSupport, BuildingBlockWithTemplating, InternalFieldBlock) {
  "use strict";

  var _dec, _dec2, _dec3, _class, _class2, _descriptor;
  var _exports = {};
  var convertBuildingBlockMetadata = BuildingBlockSupport.convertBuildingBlockMetadata;
  var xmlEventHandler = ClassSupport.xmlEventHandler;
  var implementInterface = ClassSupport.implementInterface;
  var defineUI5Class = ClassSupport.defineUI5Class;
  function _initializerDefineProperty(e, i, r, l) { r && Object.defineProperty(e, i, { enumerable: r.enumerable, configurable: r.configurable, writable: r.writable, value: r.initializer ? r.initializer.call(l) : void 0 }); }
  function _inheritsLoose(t, o) { t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o); }
  function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
  function _applyDecoratedDescriptor(i, e, r, n, l) { var a = {}; return Object.keys(n).forEach(function (i) { a[i] = n[i]; }), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = !0), a = r.slice().reverse().reduce(function (r, n) { return n(i, e, r) || r; }, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a; }
  function _initializerWarningHelper(r, e) { throw Error("Decorating class property failed. Please ensure that transform-class-properties is enabled and runs after the decorators transform."); }
  /**
   * Building block for creating a field based on the metadata provided by OData V4.
   * <br>
   * Usually, a DataField or DataPoint annotation is expected, but the field can also be used to display a property from the entity type.
   * When creating a Field building block, you must provide an ID to ensure everything works correctly.
   *
   * Usage example:
   * <pre>
   * sap.ui.require(["sap/fe/macros/field/Field"], function(Field) {
   * 	 ...
   * 	 new Field("MyField", {metaPath:"MyProperty"})
   * })
   * </pre>
   *
   * This is currently an experimental API because the structure of the generated content will change to come closer to the Field that you get out of templates.
   * The public method and property will not change but the internal structure will so be careful on your usage.
   * @public
   * @experimental
   * @mixes sap.fe.macros.Field
   */
  let Field = (_dec = defineUI5Class("sap.fe.macros.field.Field", convertBuildingBlockMetadata(InternalFieldBlock)), _dec2 = implementInterface("sap.ui.core.IFormContent"), _dec3 = xmlEventHandler(), _dec(_class = (_class2 = /*#__PURE__*/function (_BuildingBlockWithTem) {
    function Field(props, others) {
      var _this;
      _this = _BuildingBlockWithTem.call(this, props, others) || this;
      _initializerDefineProperty(_this, "__implements__sap_ui_core_IFormContent", _descriptor, _this);
      _this.createProxyMethods(["getValue", "setValue", "getEnabled", "setEnabled", "addMessage", "removeMessage"]);
      return _this;
    }
    _exports = Field;
    _inheritsLoose(Field, _BuildingBlockWithTem);
    var _proto = Field.prototype;
    _proto.getFormDoNotAdjustWidth = function getFormDoNotAdjustWidth() {
      return this.content?.getFormDoNotAdjustWidth?.() ?? false;
    };
    _proto._fireEvent = function _fireEvent(ui5Event, _controller, eventId) {
      this.fireEvent(eventId, ui5Event.getParameters());
    };
    return Field;
  }(BuildingBlockWithTemplating), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "__implements__sap_ui_core_IFormContent", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return true;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "_fireEvent", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "_fireEvent"), _class2.prototype), _class2)) || _class);
  _exports = Field;
  return _exports;
}, false);
//# sourceMappingURL=Field-dbg.js.map
