/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/f/DynamicPage", "sap/f/DynamicPageTitle", "sap/fe/base/ClassSupport", "sap/fe/core/buildingBlocks/BuildingBlock", "sap/fe/core/controllerextensions/BusyLocker", "sap/fe/core/controls/CommandExecution", "sap/fe/macros/ObjectTitle", "sap/m/FlexBox", "sap/m/Title", "sap/fe/base/jsx-runtime/jsx"], function (DynamicPage, DynamicPageTitle, ClassSupport, BuildingBlock, BusyLocker, CommandExecution, ObjectTitle, FlexBox, Title, _jsx) {
  "use strict";

  var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;
  var _exports = {};
  var property = ClassSupport.property;
  var defineUI5Class = ClassSupport.defineUI5Class;
  var aggregation = ClassSupport.aggregation;
  function _initializerDefineProperty(e, i, r, l) { r && Object.defineProperty(e, i, { enumerable: r.enumerable, configurable: r.configurable, writable: r.writable, value: r.initializer ? r.initializer.call(l) : void 0 }); }
  function _inheritsLoose(t, o) { t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o); }
  function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
  function _applyDecoratedDescriptor(i, e, r, n, l) { var a = {}; return Object.keys(n).forEach(function (i) { a[i] = n[i]; }), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = !0), a = r.slice().reverse().reduce(function (r, n) { return n(i, e, r) || r; }, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a; }
  function _initializerWarningHelper(r, e) { throw Error("Decorating class property failed. Please ensure that transform-class-properties is enabled and runs after the decorators transform."); }
  /**
   * Provides a page building block that can be used to create a page with a title, content and actions.
   * By default, the page comes with an ObjectTitle
   */
  let Page = (_dec = defineUI5Class("sap.fe.macros.Page"), _dec2 = aggregation({
    type: "sap.ui.core.Control",
    multiple: true,
    isDefault: true
  }), _dec3 = aggregation({
    type: "sap.ui.core.Control",
    multiple: true
  }), _dec4 = property({
    type: "string"
  }), _dec5 = property({
    type: "boolean"
  }), _dec(_class = (_class2 = /*#__PURE__*/function (_BuildingBlock) {
    function Page(idOrSettings, settings) {
      var _this;
      _this = _BuildingBlock.call(this, idOrSettings, settings) || this;
      _initializerDefineProperty(_this, "items", _descriptor, _this);
      _initializerDefineProperty(_this, "actions", _descriptor2, _this);
      _initializerDefineProperty(_this, "title", _descriptor3, _this);
      _initializerDefineProperty(_this, "editable", _descriptor4, _this);
      return _this;
    }
    _exports = Page;
    _inheritsLoose(Page, _BuildingBlock);
    var _proto = Page.prototype;
    _proto.onMetadataAvailable = function onMetadataAvailable() {
      this.content = this.createContent();
    };
    _proto.createContent = function createContent() {
      return _jsx(DynamicPage, {
        id: this.createId("page"),
        children: {
          title: _jsx(DynamicPageTitle, {
            id: this.createId("title"),
            children: {
              heading: this.title ? _jsx(Title, {
                id: this.createId("titleContent"),
                text: this.title
              }) : _jsx(ObjectTitle, {
                id: this.createId("titleContent")
              }),
              actions: this.actions
            }
          }),
          content: _jsx(FlexBox, {
            id: this.createId("content"),
            direction: "Column",
            children: {
              items: this.items.map(item => {
                item.addStyleClass("sapUiMediumMarginBottom");
                return item;
              })
            }
          }),
          dependents: [_jsx(CommandExecution, {
            execute: () => {
              const oContext = this.getBindingContext();
              const oModel = this.getModel("ui");
              BusyLocker.lock(oModel);
              this.getPageController()?.editFlow?.editDocument(oContext).finally(function () {
                BusyLocker.unlock(oModel);
              });
            },
            enabled: true,
            visible: true,
            command: "Edit"
          })]
        }
      });
    };
    return Page;
  }(BuildingBlock), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "items", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "actions", [_dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "title", [_dec4], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "editable", [_dec5], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return false;
    }
  }), _class2)) || _class);
  _exports = Page;
  return _exports;
}, false);
//# sourceMappingURL=Page-dbg.js.map
