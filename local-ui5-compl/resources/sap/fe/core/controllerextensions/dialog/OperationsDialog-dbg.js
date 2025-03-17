/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/base/ClassSupport", "sap/fe/core/buildingBlocks/BuildingBlock", "sap/m/Bar", "sap/m/Button", "sap/m/Dialog", "sap/m/Title", "sap/ui/core/Lib", "sap/fe/base/jsx-runtime/jsx"], function (ClassSupport, BuildingBlock, Bar, Button, Dialog, Title, Library, _jsx) {
  "use strict";

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17;
  var _exports = {};
  var property = ClassSupport.property;
  var defineUI5Class = ClassSupport.defineUI5Class;
  var defineReference = ClassSupport.defineReference;
  function _initializerDefineProperty(e, i, r, l) { r && Object.defineProperty(e, i, { enumerable: r.enumerable, configurable: r.configurable, writable: r.writable, value: r.initializer ? r.initializer.call(l) : void 0 }); }
  function _inheritsLoose(t, o) { t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o); }
  function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
  function _applyDecoratedDescriptor(i, e, r, n, l) { var a = {}; return Object.keys(n).forEach(function (i) { a[i] = n[i]; }), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = !0), a = r.slice().reverse().reduce(function (r, n) { return n(i, e, r) || r; }, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a; }
  function _initializerWarningHelper(r, e) { throw Error("Decorating class property failed. Please ensure that transform-class-properties is enabled and runs after the decorators transform."); }
  const macroResourceBundle = Library.getResourceBundleFor("sap.fe.macros");
  /**
   * Known limitations for the first tryout as mentioned in git 5806442
   *  - functional block dependency
   * 	- questionable parameters will be refactored
   */
  let OperationsDialog = (_dec = defineUI5Class("sap.fe.core.controllerextensions.dialog.OperationsDialog"), _dec2 = property({
    type: "string",
    required: true
  }), _dec3 = property({
    type: "string"
  }), _dec4 = property({
    type: "object",
    required: true
  }), _dec5 = defineReference(), _dec6 = property({
    type: "boolean",
    required: true
  }), _dec7 = property({
    type: "function"
  }), _dec8 = property({
    type: "function"
  }), _dec9 = property({
    type: "object",
    required: true
  }), _dec10 = property({
    type: "string",
    required: true
  }), _dec11 = property({
    type: "string",
    required: true
  }), _dec12 = property({
    type: "string",
    required: true
  }), _dec13 = property({
    type: "object",
    required: true
  }), _dec14 = property({
    type: "object"
  }), _dec15 = property({
    type: "object"
  }), _dec16 = property({
    type: "object",
    required: true
  }), _dec17 = property({
    type: "boolean"
  }), _dec18 = property({
    type: "function"
  }), _dec(_class = (_class2 = /*#__PURE__*/function (_BuildingBlock) {
    function OperationsDialog(props) {
      var _this;
      _this = _BuildingBlock.call(this, props) || this;
      /*
       * The 'id' property of the dialog
       */
      _initializerDefineProperty(_this, "id", _descriptor, _this);
      /**
       * The 'title' property of the Dialog;
       */
      _initializerDefineProperty(_this, "title", _descriptor2, _this);
      /**
       * The message object that is provided to this dialog
       */
      _initializerDefineProperty(_this, "messageObject", _descriptor3, _this);
      _initializerDefineProperty(_this, "operationsDialog", _descriptor4, _this);
      _initializerDefineProperty(_this, "isMultiContext412", _descriptor5, _this);
      _initializerDefineProperty(_this, "requestSideEffects", _descriptor6, _this);
      _initializerDefineProperty(_this, "resolve", _descriptor7, _this);
      _initializerDefineProperty(_this, "model", _descriptor8, _this);
      _initializerDefineProperty(_this, "groupId", _descriptor9, _this);
      _initializerDefineProperty(_this, "actionName", _descriptor10, _this);
      _initializerDefineProperty(_this, "cancelButtonTxt", _descriptor11, _this);
      _initializerDefineProperty(_this, "strictHandlingPromises", _descriptor12, _this);
      _initializerDefineProperty(_this, "strictHandlingUtilities", _descriptor13, _this);
      _initializerDefineProperty(_this, "messageHandler", _descriptor14, _this);
      _initializerDefineProperty(_this, "messageDialogModel", _descriptor15, _this);
      _initializerDefineProperty(_this, "isGrouped", _descriptor16, _this);
      _initializerDefineProperty(_this, "showMessageInfo", _descriptor17, _this);
      _this.model = props.model;
      return _this;
    }
    _exports = OperationsDialog;
    _inheritsLoose(OperationsDialog, _BuildingBlock);
    var _proto = OperationsDialog.prototype;
    _proto.open = function open() {
      this.createContent();
      this.operationsDialog.current?.open();
    };
    _proto.getBeginButton = function getBeginButton() {
      return new Button({
        press: () => {
          if (!(this.isMultiContext412 ?? false)) {
            this.resolve?.(true);
            this.model.submitBatch(this.groupId);
            if (this.requestSideEffects) {
              this.requestSideEffects();
            }
          } else {
            this.strictHandlingPromises.forEach(strictHandlingPromise => {
              strictHandlingPromise.resolve(true);
              this.model.submitBatch(strictHandlingPromise.groupId);
              if (strictHandlingPromise.requestSideEffects) {
                strictHandlingPromise.requestSideEffects();
              }
            });
            const strictHandlingFails = this.strictHandlingUtilities?.strictHandlingTransitionFails;
            if (strictHandlingFails && strictHandlingFails.length > 0) {
              this.messageHandler?.removeTransitionMessages();
            }
            if (this.strictHandlingUtilities) {
              this.strictHandlingUtilities.strictHandlingWarningMessages = [];
            }
          }
          if (this.strictHandlingUtilities) {
            this.strictHandlingUtilities.is412Executed = true;
          }
          this.messageDialogModel.setData({});
          this.close();
        },
        type: "Emphasized",
        text: this.actionName
      });
    };
    _proto.close = function close() {
      this.operationsDialog.current?.close();
    };
    _proto.getTitle = function getTitle() {
      const sTitle = macroResourceBundle.getText("M_WARNINGS");
      return new Title({
        text: sTitle
      });
    };
    _proto.getEndButton = function getEndButton() {
      return new Button({
        press: () => {
          if (this.strictHandlingUtilities) {
            this.strictHandlingUtilities.strictHandlingWarningMessages = [];
            this.strictHandlingUtilities.is412Executed = false;
          }
          if (!(this.isMultiContext412 ?? false)) {
            this.resolve(false);
          } else {
            this.strictHandlingPromises.forEach(function (strictHandlingPromise) {
              strictHandlingPromise.resolve(false);
            });
          }
          this.messageDialogModel.setData({});
          this.close();
          if (this.isGrouped ?? false) {
            this.showMessageInfo();
          }
        },
        text: this.cancelButtonTxt
      });
    }

    /**
     * The building block render function.
     * @returns An XML-based string with the definition of the field control
     */;
    _proto.createContent = function createContent() {
      return _jsx(Dialog, {
        id: this.id,
        ref: this.operationsDialog,
        resizable: true,
        content: this.messageObject.messageView,
        state: "Warning",
        customHeader: new Bar({
          contentLeft: [this.messageObject.oBackButton],
          contentMiddle: [this.getTitle()]
        }),
        contentHeight: "50%",
        contentWidth: "50%",
        verticalScrolling: false,
        beginButton: this.getBeginButton(),
        endButton: this.getEndButton()
      });
    };
    return OperationsDialog;
  }(BuildingBlock), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "id", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "title", [_dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return "Dialog Standard Title";
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "messageObject", [_dec4], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "operationsDialog", [_dec5], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "isMultiContext412", [_dec6], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "requestSideEffects", [_dec7], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "resolve", [_dec8], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "model", [_dec9], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "groupId", [_dec10], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "actionName", [_dec11], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "cancelButtonTxt", [_dec12], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "strictHandlingPromises", [_dec13], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "strictHandlingUtilities", [_dec14], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "messageHandler", [_dec15], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "messageDialogModel", [_dec16], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "isGrouped", [_dec17], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "showMessageInfo", [_dec18], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _class2)) || _class);
  _exports = OperationsDialog;
  return _exports;
}, false);
//# sourceMappingURL=OperationsDialog-dbg.js.map
