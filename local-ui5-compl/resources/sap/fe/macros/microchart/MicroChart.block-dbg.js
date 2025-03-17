/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/base/BindingToolkit", "sap/fe/core/buildingBlocks/templating/BuildingBlockSupport", "sap/fe/core/buildingBlocks/templating/BuildingBlockTemplateProcessor", "sap/fe/core/buildingBlocks/templating/BuildingBlockTemplatingBase", "sap/fe/core/converters/MetaModelConverter", "sap/fe/core/templating/DataModelPathHelper", "sap/fe/core/templating/UIFormatters", "sap/fe/macros/CommonHelper", "sap/ui/model/odata/v4/AnnotationHelper"], function (BindingToolkit, BuildingBlockSupport, BuildingBlockTemplateProcessor, BuildingBlockTemplatingBase, MetaModelConverter, DataModelPathHelper, UIFormatters, CommonHelper, AnnotationHelper) {
  "use strict";

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15;
  var _exports = {};
  var hasValidAnalyticalCurrencyOrUnit = UIFormatters.hasValidAnalyticalCurrencyOrUnit;
  var getTargetNavigationPath = DataModelPathHelper.getTargetNavigationPath;
  var getInvolvedDataModelObjects = MetaModelConverter.getInvolvedDataModelObjects;
  var convertMetaModelContext = MetaModelConverter.convertMetaModelContext;
  var xml = BuildingBlockTemplateProcessor.xml;
  var defineBuildingBlock = BuildingBlockSupport.defineBuildingBlock;
  var blockAttribute = BuildingBlockSupport.blockAttribute;
  var pathInModel = BindingToolkit.pathInModel;
  var or = BindingToolkit.or;
  var not = BindingToolkit.not;
  var equal = BindingToolkit.equal;
  function _initializerDefineProperty(e, i, r, l) { r && Object.defineProperty(e, i, { enumerable: r.enumerable, configurable: r.configurable, writable: r.writable, value: r.initializer ? r.initializer.call(l) : void 0 }); }
  function _inheritsLoose(t, o) { t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o); }
  function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
  function _applyDecoratedDescriptor(i, e, r, n, l) { var a = {}; return Object.keys(n).forEach(function (i) { a[i] = n[i]; }), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = !0), a = r.slice().reverse().reduce(function (r, n) { return n(i, e, r) || r; }, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a; }
  function _initializerWarningHelper(r, e) { throw Error("Decorating class property failed. Please ensure that transform-class-properties is enabled and runs after the decorators transform."); }
  /**
   * Building block used to create a MicroChart based on the metadata provided by OData V4.
   * {@link demo:sap/fe/core/fpmExplorer/index.html#/buildingBlocks/microchart/microChartDefault Overview of Building Blocks}
   * @hideconstructor
   * @public
   * @since 1.93.0
   */
  let MicroChartBlock = (_dec = defineBuildingBlock({
    name: "MicroChart",
    namespace: "sap.fe.macros.internal",
    publicNamespace: "sap.fe.macros",
    returnTypes: ["sap.fe.macros.controls.ConditionalWrapper", "sap.fe.macros.microchart.MicroChartContainer"]
  }), _dec2 = blockAttribute({
    type: "string",
    isPublic: true,
    required: true
  }), _dec3 = blockAttribute({
    type: "sap.ui.model.Context",
    expectedTypes: ["EntitySet", "EntityType", "NavigationProperty"],
    isPublic: true
  }), _dec4 = blockAttribute({
    type: "sap.ui.model.Context",
    isPublic: true,
    required: true
  }), _dec5 = blockAttribute({
    type: "string",
    isPublic: true
  }), _dec6 = blockAttribute({
    type: "string"
  }), _dec7 = blockAttribute({
    type: "string"
  }), _dec8 = blockAttribute({
    type: "string",
    isPublic: true
  }), _dec9 = blockAttribute({
    type: "string"
  }), _dec10 = blockAttribute({
    type: "sap.fe.macros.NavigationType"
  }), _dec11 = blockAttribute({
    type: "function"
  }), _dec12 = blockAttribute({
    type: "string",
    isPublic: true
  }), _dec13 = blockAttribute({
    type: "boolean"
  }), _dec14 = blockAttribute({
    type: "sap.ui.model.Context"
  }), _dec15 = blockAttribute({
    type: "array"
  }), _dec16 = blockAttribute({
    type: "sap.ui.model.Context"
  }), _dec(_class = (_class2 = /*#__PURE__*/function (_BuildingBlockTemplat) {
    function MicroChartBlock(props) {
      var _this;
      _this = _BuildingBlockTemplat.call(this, props) || this;
      /**
       * ID of the MicroChart.
       */
      _initializerDefineProperty(_this, "id", _descriptor, _this);
      /**
       * Metadata path to the entitySet or navigationProperty.
       */
      _initializerDefineProperty(_this, "contextPath", _descriptor2, _this);
      /**
       * Metadata path to the Chart annotations.
       */
      _initializerDefineProperty(_this, "metaPath", _descriptor3, _this);
      /**
       * To control the rendering of Title, Subtitle and Currency Labels. When the size is xs then we do
       * not see the inner labels of the MicroChart as well.
       * @public
       */
      _initializerDefineProperty(_this, "showOnlyChart", _descriptor4, _this);
      /**
       * Batch group ID along with which this call should be grouped.
       */
      _initializerDefineProperty(_this, "batchGroupId", _descriptor5, _this);
      /**
       * Title for the MicroChart. If no title is provided, the title from the Chart annotation is used.
       */
      _initializerDefineProperty(_this, "title", _descriptor6, _this);
      /**
       * Show blank space in case there is no data in the chart
       * @public
       */
      _initializerDefineProperty(_this, "hideOnNoData", _descriptor7, _this);
      /**
       * Description for the MicroChart. If no description is provided, the description from the Chart annotation is used.
       */
      _initializerDefineProperty(_this, "description", _descriptor8, _this);
      /**
       * Type of navigation, that is, External or InPage
       */
      _initializerDefineProperty(_this, "navigationType", _descriptor9, _this);
      /**
       * Event handler for onTitlePressed event
       */
      _initializerDefineProperty(_this, "onTitlePressed", _descriptor10, _this);
      /**
       * Size of the MicroChart
       * @public
       */
      _initializerDefineProperty(_this, "size", _descriptor11, _this);
      /**
       * Defines whether the MicroChart is part of an analytical table
       */
      _initializerDefineProperty(_this, "isAnalytics", _descriptor12, _this);
      /*
       * This is used in inner fragments, so we need to declare it as block attribute context.
       */
      _initializerDefineProperty(_this, "DataPoint", _descriptor13, _this);
      /*
       * This is sort order for the microcharts.
       */
      _initializerDefineProperty(_this, "sortOrder", _descriptor14, _this);
      /*
       * Target Navigation Path of the Microchart which would help create the binding for MicroChartContainer
       */
      _initializerDefineProperty(_this, "targetNavigationPath", _descriptor15, _this);
      _this.metaPath = _this.metaPath.getModel().createBindingContext(AnnotationHelper.resolve$Path(_this.metaPath));
      const contextObject = getInvolvedDataModelObjects(_this.metaPath, _this.contextPath);
      if (contextObject.targetObject?.term === "com.sap.vocabularies.UI.v1.PresentationVariant") {
        if (contextObject.targetObject.SortOrder?.length != null) {
          _this.sortOrder = _this.getSortOrder(contextObject.targetObject.SortOrder);
        }
        //We only consider the first visualization of the PV and expect it to be a chart (similar to VisualFilters)
        _this.metaPath = _this.metaPath.getModel().createBindingContext("Visualizations/0/$AnnotationPath", _this.metaPath);
      }
      const measureAttributePath = CommonHelper.getMeasureAttributeForMeasure(_this.metaPath.getModel().createBindingContext("Measures/0", _this.metaPath));
      if (measureAttributePath) {
        _this.DataPoint = _this.metaPath.getModel().createBindingContext(measureAttributePath);
      }
      _this.contextObjectPath = getInvolvedDataModelObjects(_this.metaPath, _this.contextPath);
      _this.targetNavigationPath = _this.metaPath.getModel().createBindingContext(getTargetNavigationPath(_this.contextObjectPath));
      return _this;
    }

    /**
     * Gets the sortOrder for the microChart as mentioned in the PresentationVariant.
     * @param sortingProps Sorters from PresentationVariant
     * @returns SortOrder
     */
    _exports = MicroChartBlock;
    _inheritsLoose(MicroChartBlock, _BuildingBlockTemplat);
    var _proto = MicroChartBlock.prototype;
    _proto.getSortOrder = function getSortOrder(sortingProps) {
      return sortingProps.map(sortingProp => {
        return {
          Property: sortingProp.Property?.value,
          Descending: sortingProp.Descending,
          fullyQualifiedName: "",
          $Type: "com.sap.vocabularies.Common.v1.SortOrderType"
        };
      });
    }

    /**
     * Gets the content of the micro chart, such as a reference to the fragment for the given chart type.
     * @returns XML string
     */;
    _proto.getMicroChartContent = function getMicroChartContent() {
      const convertedChart = convertMetaModelContext(this.metaPath);
      switch (convertedChart.ChartType) {
        case "UI.ChartType/Bullet":
          return `<core:Fragment fragmentName="sap.fe.macros.microchart.fragments.BulletMicroChart" type="XML" />`;
        case "UI.ChartType/Donut":
          return `<core:Fragment fragmentName="sap.fe.macros.microchart.fragments.RadialMicroChart" type="XML" />`;
        case "UI.ChartType/Pie":
          return `<core:Fragment fragmentName="sap.fe.macros.microchart.fragments.HarveyBallMicroChart" type="XML" />`;
        case "UI.ChartType/BarStacked":
          return `<core:Fragment fragmentName="sap.fe.macros.microchart.fragments.StackedBarMicroChart" type="XML" />`;
        case "UI.ChartType/Area":
          return `<core:Fragment fragmentName="sap.fe.macros.microchart.fragments.AreaMicroChart" type="XML" />`;
        case "UI.ChartType/Column":
          return `<core:Fragment fragmentName="sap.fe.macros.microchart.fragments.ColumnMicroChart" type="XML" />`;
        case "UI.ChartType/Line":
          return `<core:Fragment fragmentName="sap.fe.macros.microchart.fragments.LineMicroChart" type="XML" />`;
        case "UI.ChartType/Bar":
          return `<core:Fragment fragmentName="sap.fe.macros.microchart.fragments.ComparisonMicroChart" type="XML" />`;
        default:
          return `<m:Text text="This chart type is not supported. Other Types yet to be implemented.." />`;
      }
    }

    /**
     * The building block template function.
     * @returns An XML-based string
     */;
    _proto.getTemplate = function getTemplate() {
      const dataPointValueObjects = getInvolvedDataModelObjects(this.metaPath.getModel().createBindingContext("Value/$Path", this.DataPoint), this.contextPath);
      const wrapperConditionBinding = hasValidAnalyticalCurrencyOrUnit(dataPointValueObjects);
      const wrapperVisibleBinding = or(not(pathInModel("@$ui5.node.isExpanded")), equal(pathInModel("@$ui5.node.level"), 0));
      if (this.isAnalytics) {
        return xml`<controls:ConditionalWrapper
				xmlns:controls="sap.fe.macros.controls"
				condition="${wrapperConditionBinding}"
				visible="${wrapperVisibleBinding}" >
				<controls:contentTrue>
					${this.getMicroChartContent()}
				</controls:contentTrue>
				<controls:contentFalse>
					<m:Text text="*" />
				</controls:contentFalse>
			</controls:ConditionalWrapper>`;
      } else {
        return this.getMicroChartContent();
      }
    };
    return MicroChartBlock;
  }(BuildingBlockTemplatingBase), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "id", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "contextPath", [_dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "metaPath", [_dec4], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "showOnlyChart", [_dec5], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return false;
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "batchGroupId", [_dec6], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return "";
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "title", [_dec7], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return "";
    }
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "hideOnNoData", [_dec8], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return false;
    }
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "description", [_dec9], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return "";
    }
  }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "navigationType", [_dec10], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return "None";
    }
  }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "onTitlePressed", [_dec11], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "size", [_dec12], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "isAnalytics", [_dec13], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return false;
    }
  }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "DataPoint", [_dec14], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "sortOrder", [_dec15], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "targetNavigationPath", [_dec16], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _class2)) || _class);
  _exports = MicroChartBlock;
  return _exports;
}, false);
//# sourceMappingURL=MicroChart.block-dbg.js.map
