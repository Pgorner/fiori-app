/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/buildingBlocks/templating/BuildingBlockSupport", "./Table.block"], function (BuildingBlockSupport, TableBlock) {
  "use strict";

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5;
  var _exports = {};
  var defineBuildingBlock = BuildingBlockSupport.defineBuildingBlock;
  var blockAttribute = BuildingBlockSupport.blockAttribute;
  function _initializerDefineProperty(e, i, r, l) { r && Object.defineProperty(e, i, { enumerable: r.enumerable, configurable: r.configurable, writable: r.writable, value: r.initializer ? r.initializer.call(l) : void 0 }); }
  function _inheritsLoose(t, o) { t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o); }
  function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
  function _applyDecoratedDescriptor(i, e, r, n, l) { var a = {}; return Object.keys(n).forEach(function (i) { a[i] = n[i]; }), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = !0), a = r.slice().reverse().reduce(function (r, n) { return n(i, e, r) || r; }, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a; }
  function _initializerWarningHelper(r, e) { throw Error("Decorating class property failed. Please ensure that transform-class-properties is enabled and runs after the decorators transform."); }
  /**
   * Building block used to create a tree table based on the metadata provided by OData V4.
   * @mixes sap.fe.macros.Table
   * @augments sap.fe.macros.MacroAPI
   * @public
   */
  let TreeTableBlock = (_dec = defineBuildingBlock({
    name: "TreeTable",
    namespace: "sap.fe.macros.internal",
    publicNamespace: "sap.fe.macros",
    returnTypes: ["sap.fe.macros.table.TableAPI"]
  }), _dec2 = blockAttribute({
    type: "string",
    required: true,
    isPublic: true
  }), _dec3 = blockAttribute({
    type: "string",
    isPublic: true
  }), _dec4 = blockAttribute({
    type: "string",
    isPublic: true
  }), _dec5 = blockAttribute({
    type: "object",
    underlyingType: "sap.fe.macros.table.TreeTableCreationOptions",
    isPublic: true,
    validate: function (creationOptionsInput) {
      if (creationOptionsInput.name && !["NewPage", "Inline", "External", "CreationDialog"].includes(creationOptionsInput.name)) {
        throw new Error(`Allowed value ${creationOptionsInput.name} for creationMode does not match`);
      }
      return creationOptionsInput;
    }
  }), _dec6 = blockAttribute({
    type: "string",
    isPublic: true,
    allowedValues: ["TreeTable"]
  }), _dec(_class = (_class2 = /*#__PURE__*/function (_TableBlock) {
    function TreeTableBlock(props, controlConfiguration, settings) {
      var _this;
      _this = _TableBlock.call(this, props, controlConfiguration, settings) || this;
      /**
       * A set of options that can be configured.
       * @public
       */
      _initializerDefineProperty(_this, "hierarchyQualifier", _descriptor, _this);
      /**
       * Defines the extension point to control if a source node can be dropped on a specific parent node.<br/>
       * @public
       */
      _initializerDefineProperty(_this, "isMoveToPositionAllowed", _descriptor2, _this);
      /**
       * Defines the extension point to control if a node can be dragged.<br/>
       * @public
       */
      _initializerDefineProperty(_this, "isNodeMovable", _descriptor3, _this);
      /**
       * A set of options that can be configured.
       * @public
       */
      _initializerDefineProperty(_this, "creationMode", _descriptor4, _this);
      /**
       * Defines the type of table that will be used by the building block to render the data. This setting is defined by the framework.
       *
       * Allowed value is `TreeTable`.
       * @public
       */
      _initializerDefineProperty(_this, "type", _descriptor5, _this);
      return _this;
    }
    _exports = TreeTableBlock;
    _inheritsLoose(TreeTableBlock, _TableBlock);
    var _proto = TreeTableBlock.prototype;
    _proto.getTableSettings = function getTableSettings() {
      const tableSettings = _TableBlock.prototype.getTableSettings.call(this);
      TableBlock.addSetting(tableSettings, "type", "TreeTable");
      TableBlock.addSetting(tableSettings, "hierarchyQualifier", this.hierarchyQualifier);
      TableBlock.addSetting(tableSettings, "isMoveToPositionAllowed", this.isMoveToPositionAllowed);
      TableBlock.addSetting(tableSettings, "isNodeMovable", this.isNodeMovable);
      const creationMode = tableSettings["creationMode"] ?? {};
      TableBlock.addSetting(creationMode, "createInPlace", this.creationMode.createInPlace);
      if (this.creationMode.nodeType) {
        //Values is passed as Array into the XML but in the manifest it is a dictionary
        // so we need to transform the array into a dictionary
        TableBlock.addSetting(creationMode, "nodeType", {
          propertyName: this.creationMode.nodeType.propertyName,
          values: Object.assign({}, ...(this.creationMode.nodeType.values ?? []).map(value => ({
            [value.key]: {
              label: value.label,
              creationFields: value.creationFields
            }
          })))
        });
      }
      TableBlock.addSetting(creationMode, "isCreateEnabled", this.creationMode.isCreateEnabled);
      if (Object.entries(creationMode).length > 0) {
        tableSettings["creationMode"] = creationMode;
      }
      return tableSettings;
    };
    return TreeTableBlock;
  }(TableBlock), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "hierarchyQualifier", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "isMoveToPositionAllowed", [_dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "isNodeMovable", [_dec4], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "creationMode", [_dec5], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return {};
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "type", [_dec6], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _class2)) || _class);
  _exports = TreeTableBlock;
  return _exports;
}, false);
//# sourceMappingURL=TreeTable.block-dbg.js.map
