/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/buildingBlocks/templating/BuildingBlockSupport", "sap/fe/core/buildingBlocks/templating/BuildingBlockTemplatingBase", "sap/fe/core/templating/SemanticObjectHelper", "./field/FieldBlockStructure", "./field/FieldStructure", "./field/FieldStructureHelper"], function (BuildingBlockSupport, BuildingBlockTemplatingBase, SemanticObjectHelper, FieldBlockStructure, FieldStructure, FieldStructureHelper) {
  "use strict";

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21;
  var _exports = {};
  var setUpField = FieldStructureHelper.setUpField;
  var getFieldStructureTemplate = FieldStructure.getFieldStructureTemplate;
  var getTemplateWithFieldApi = FieldBlockStructure.getTemplateWithFieldApi;
  var getPropertyWithSemanticObject = SemanticObjectHelper.getPropertyWithSemanticObject;
  var defineBuildingBlock = BuildingBlockSupport.defineBuildingBlock;
  var blockEvent = BuildingBlockSupport.blockEvent;
  var blockAttribute = BuildingBlockSupport.blockAttribute;
  function _initializerDefineProperty(e, i, r, l) { r && Object.defineProperty(e, i, { enumerable: r.enumerable, configurable: r.configurable, writable: r.writable, value: r.initializer ? r.initializer.call(l) : void 0 }); }
  function _inheritsLoose(t, o) { t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o); }
  function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
  function _applyDecoratedDescriptor(i, e, r, n, l) { var a = {}; return Object.keys(n).forEach(function (i) { a[i] = n[i]; }), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = !0), a = r.slice().reverse().reduce(function (r, n) { return n(i, e, r) || r; }, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a; }
  function _initializerWarningHelper(r, e) { throw Error("Decorating class property failed. Please ensure that transform-class-properties is enabled and runs after the decorators transform."); }
  /**
   * Building block for creating a Field based on the metadata provided by OData V4.
   * <br>
   * Usually, a DataField annotation is expected
   *
   * Usage example:
   * <pre>
   * <internalMacro:Field
   * idPrefix="SomePrefix"
   * contextPath="{entitySet>}"
   * metaPath="{dataField>}"
   * />
   * </pre>
   * @hideconstructor
   * @private
   * @experimental
   * @since 1.94.0
   */
  let InternalFieldBlock = (_dec = defineBuildingBlock({
    name: "Field",
    namespace: "sap.fe.macros.internal",
    publicNamespace: "sap.fe.macros",
    designtime: "sap/fe/macros/internal/Field.designtime"
  }), _dec2 = blockAttribute({
    type: "string",
    isPublic: true,
    required: true
  }), _dec3 = blockAttribute({
    type: "string"
  }), _dec4 = blockAttribute({
    type: "string"
  }), _dec5 = blockAttribute({
    type: "string"
  }), _dec6 = blockAttribute({
    type: "sap.ui.model.Context",
    required: true,
    expectedTypes: ["EntitySet", "NavigationProperty", "EntityType", "Singleton"]
  }), _dec7 = blockAttribute({
    type: "boolean"
  }), _dec8 = blockAttribute({
    type: "sap.ui.model.Context",
    required: true,
    expectedTypes: ["Property"],
    expectedAnnotationTypes: ["com.sap.vocabularies.UI.v1.DataField", "com.sap.vocabularies.UI.v1.DataFieldWithUrl", "com.sap.vocabularies.UI.v1.DataFieldForAnnotation", "com.sap.vocabularies.UI.v1.DataFieldForAction", "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation", "com.sap.vocabularies.UI.v1.DataFieldWithAction", "com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation", "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath", "com.sap.vocabularies.UI.v1.DataPointType", "com.sap.vocabularies.UI.v1.DataFieldForActionGroup"]
  }), _dec9 = blockAttribute({
    type: "sap.ui.mdc.enums.EditMode"
  }), _dec10 = blockAttribute({
    type: "boolean"
  }), _dec11 = blockAttribute({
    type: "string"
  }), _dec12 = blockAttribute({
    type: "string"
  }), _dec13 = blockAttribute({
    type: "sap.ui.core.TextAlign"
  }), _dec14 = blockAttribute({
    type: "string",
    isPublic: true,
    required: false
  }), _dec15 = blockAttribute({
    type: "boolean",
    isPublic: true,
    required: false
  }), _dec16 = blockAttribute({
    type: "boolean"
  }), _dec17 = blockAttribute({
    type: "object",
    validate: function (formatOptionsInput) {
      if (formatOptionsInput.textAlignMode && !["Table", "Form"].includes(formatOptionsInput.textAlignMode)) {
        throw new Error(`Allowed value ${formatOptionsInput.textAlignMode} for textAlignMode does not match`);
      }
      if (formatOptionsInput.displayMode && !["Value", "Description", "ValueDescription", "DescriptionValue"].includes(formatOptionsInput.displayMode)) {
        throw new Error(`Allowed value ${formatOptionsInput.displayMode} for displayMode does not match`);
      }
      if (formatOptionsInput.fieldMode && !["nowrapper", ""].includes(formatOptionsInput.fieldMode)) {
        throw new Error(`Allowed value ${formatOptionsInput.fieldMode} for fieldMode does not match`);
      }
      if (formatOptionsInput.measureDisplayMode && !["Hidden", "ReadOnly"].includes(formatOptionsInput.measureDisplayMode)) {
        throw new Error(`Allowed value ${formatOptionsInput.measureDisplayMode} for measureDisplayMode does not match`);
      }
      if (formatOptionsInput.textExpandBehaviorDisplay && !["InPlace", "Popover"].includes(formatOptionsInput.textExpandBehaviorDisplay)) {
        throw new Error(`Allowed value ${formatOptionsInput.textExpandBehaviorDisplay} for textExpandBehaviorDisplay does not match`);
      }
      if (formatOptionsInput.semanticKeyStyle && !["ObjectIdentifier", "Label", ""].includes(formatOptionsInput.semanticKeyStyle)) {
        throw new Error(`Allowed value ${formatOptionsInput.semanticKeyStyle} for semanticKeyStyle does not match`);
      }
      if (typeof formatOptionsInput.isAnalytics === "string") {
        formatOptionsInput.isAnalytics = formatOptionsInput.isAnalytics === "true";
      }
      if (typeof formatOptionsInput.forInlineCreationRows === "string") {
        formatOptionsInput.forInlineCreationRows = formatOptionsInput.forInlineCreationRows === "true";
      }
      if (typeof formatOptionsInput.radioButtonsHorizontalLayout === "string") {
        formatOptionsInput.radioButtonsHorizontalLayout = formatOptionsInput.radioButtonsHorizontalLayout === "true";
      }
      if (typeof formatOptionsInput.hasDraftIndicator === "string") {
        formatOptionsInput.hasDraftIndicator = formatOptionsInput.hasDraftIndicator === "true";
      }
      if (typeof formatOptionsInput.showDate === "string") {
        formatOptionsInput.showDate = formatOptionsInput.showDate === "true";
      }
      if (typeof formatOptionsInput.showTimezone === "string") {
        formatOptionsInput.showTimezone = formatOptionsInput.showTimezone === "true";
      }
      if (typeof formatOptionsInput.showTime === "string") {
        formatOptionsInput.showTime = formatOptionsInput.showTime === "true";
      }

      /*
      Historical default values are currently disabled
      if (!formatOptionsInput.semanticKeyStyle) {
      	formatOptionsInput.semanticKeyStyle = "";
      }
      */

      return formatOptionsInput;
    }
  }), _dec18 = blockAttribute({
    type: "boolean",
    isPublic: true,
    required: false
  }), _dec19 = blockEvent(), _dec20 = blockEvent(), _dec21 = blockAttribute({
    type: "string",
    isPublic: true,
    required: false
  }), _dec22 = blockAttribute({
    type: "string",
    isPublic: true,
    required: false
  }), _dec(_class = (_class2 = /*#__PURE__*/function (_BuildingBlockTemplat) {
    function InternalFieldBlock(props, controlConfiguration, settings) {
      var _this;
      _this = _BuildingBlockTemplat.call(this, props) || this;
      _initializerDefineProperty(_this, "id", _descriptor, _this);
      _initializerDefineProperty(_this, "_flexId", _descriptor2, _this);
      _initializerDefineProperty(_this, "idPrefix", _descriptor3, _this);
      _initializerDefineProperty(_this, "vhIdPrefix", _descriptor4, _this);
      /**
       * Metadata path to the entity set
       */
      _initializerDefineProperty(_this, "contextPath", _descriptor5, _this);
      /**
       * Flag indicating whether action will navigate after execution
       */
      _initializerDefineProperty(_this, "navigateAfterAction", _descriptor6, _this);
      /**
       * Metadata path to the dataField.
       * This property is usually a metadataContext pointing to a DataField having
       * $Type of DataField, DataFieldWithUrl, DataFieldForAnnotation, DataFieldForAction, DataFieldForIntentBasedNavigation, DataFieldWithNavigationPath, or DataPointType.
       * But it can also be a Property with $kind="Property"
       */
      _initializerDefineProperty(_this, "metaPath", _descriptor7, _this);
      /**
       * Edit Mode of the field.
       *
       * If the editMode is undefined then we compute it based on the metadata
       * Otherwise we use the value provided here.
       */
      _initializerDefineProperty(_this, "editMode", _descriptor8, _this);
      /**
       * Wrap field
       */
      _initializerDefineProperty(_this, "wrap", _descriptor9, _this);
      /**
       * CSS class for margin
       */
      _initializerDefineProperty(_this, "class", _descriptor10, _this);
      /**
       * Property added to associate the label with the Field
       */
      _initializerDefineProperty(_this, "ariaLabelledBy", _descriptor11, _this);
      _initializerDefineProperty(_this, "textAlign", _descriptor12, _this);
      /**
       * Option to add a semantic object to a field
       */
      _initializerDefineProperty(_this, "semanticObject", _descriptor13, _this);
      _initializerDefineProperty(_this, "visible", _descriptor14, _this);
      _initializerDefineProperty(_this, "showErrorObjectStatus", _descriptor15, _this);
      _initializerDefineProperty(_this, "formatOptions", _descriptor16, _this);
      /**
       * The readOnly flag
       */
      _initializerDefineProperty(_this, "readOnly", _descriptor17, _this);
      /**
       * Event handler for change event
       */
      _initializerDefineProperty(_this, "change", _descriptor18, _this);
      /**
       * Event handler for live change event
       */
      _initializerDefineProperty(_this, "onLiveChange", _descriptor19, _this);
      /**
       * This is used to optionally provide an external value that comes from a different model than the oData model
       */
      _initializerDefineProperty(_this, "value", _descriptor20, _this);
      /**
       * This is used to optionally provide an external description that comes from a different model than the oData model
       */
      _initializerDefineProperty(_this, "description", _descriptor21, _this);
      _this.isPublicField = _this.isPublic;
      _this._controlConfiguration = controlConfiguration;
      _this._settings = settings;
      return _this;
    }

    /**
     * The building block template function.
     * @returns An XML-based string with the definition of the field control
     */
    _exports = InternalFieldBlock;
    _inheritsLoose(InternalFieldBlock, _BuildingBlockTemplat);
    /* Property path used for LOCK/UNLOCK collaboration messages */
    /* Rating Indicator properties end */
    InternalFieldBlock.getOverrides = function getOverrides(controlConfiguration, id) {
      /*
      	Qualms: We need to use this TemplateProcessorSettings type to be able to iterate
      	over the properties later on and cast it afterwards as a field property type
      */
      const props = {};
      if (controlConfiguration) {
        const controlConfig = controlConfiguration[id];
        if (controlConfig) {
          Object.keys(controlConfig).forEach(function (configKey) {
            props[configKey] = controlConfig[configKey];
          });
        }
      }
      return props;
    }

    /**
     * Check field to know if it has semantic object.
     * @param internalField The field
     * @param dataModelPath The DataModelObjectPath of the property
     * @returns True if field has a semantic object
     */;
    InternalFieldBlock.propertyOrNavigationPropertyHasSemanticObject = function propertyOrNavigationPropertyHasSemanticObject(internalField, dataModelPath) {
      return !!getPropertyWithSemanticObject(dataModelPath) || internalField.semanticObject !== undefined && internalField.semanticObject !== "";
    };
    var _proto = InternalFieldBlock.prototype;
    _proto.getTemplate = function getTemplate() {
      const preparedProperties = setUpField(this, this._controlConfiguration, this._settings);
      preparedProperties.eventHandlers.change = "FieldAPI.handleChange";
      preparedProperties.eventHandlers.liveChange = "FieldAPI.handleLiveChange";
      preparedProperties.eventHandlers.validateFieldGroup = "FieldAPI.onValidateFieldGroup";
      const box = getFieldStructureTemplate(preparedProperties);
      return getTemplateWithFieldApi(preparedProperties, box);
    };
    return InternalFieldBlock;
  }(BuildingBlockTemplatingBase), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "id", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_flexId", [_dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "idPrefix", [_dec4], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "vhIdPrefix", [_dec5], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "contextPath", [_dec6], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "navigateAfterAction", [_dec7], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return true;
    }
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "metaPath", [_dec8], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "editMode", [_dec9], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "wrap", [_dec10], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "class", [_dec11], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "ariaLabelledBy", [_dec12], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "textAlign", [_dec13], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "semanticObject", [_dec14], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "visible", [_dec15], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "showErrorObjectStatus", [_dec16], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "formatOptions", [_dec17], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return {};
    }
  }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "readOnly", [_dec18], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "change", [_dec19], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "onLiveChange", [_dec20], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "value", [_dec21], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, "description", [_dec22], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _class2)) || _class);
  _exports = InternalFieldBlock;
  return _exports;
}, false);
//# sourceMappingURL=InternalField.block-dbg.js.map
