/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/core/buildingBlocks/templating/BuildingBlockSupport", "sap/fe/core/buildingBlocks/templating/BuildingBlockTemplateProcessor", "sap/fe/core/buildingBlocks/templating/BuildingBlockTemplatingBase", "sap/fe/core/converters/MetaModelConverter", "sap/fe/core/converters/controls/Common/DataVisualization", "sap/fe/core/converters/helpers/Aggregation", "sap/fe/core/helpers/ModelHelper", "sap/fe/core/helpers/StableIdHelper", "./InteractiveChartHelper", "./fragments/InteractiveBarChart", "./fragments/InteractiveChartWithError", "./fragments/InteractiveLineChart"], function (Log, BuildingBlockSupport, BuildingBlockTemplateProcessor, BuildingBlockTemplatingBase, MetaModelConverter, DataVisualization, Aggregation, ModelHelper, StableIdHelper, InteractiveChartHelper, InteractiveBarChart, InteractiveChartWithError, InteractiveLineChart) {
  "use strict";

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24;
  var _exports = {};
  var getInteractiveLineChartTemplate = InteractiveLineChart.getInteractiveLineChartTemplate;
  var getInteractiveChartWithErrorTemplate = InteractiveChartWithError.getInteractiveChartWithErrorTemplate;
  var getInteractiveBarChartTemplate = InteractiveBarChart.getInteractiveBarChartTemplate;
  var generate = StableIdHelper.generate;
  var AggregationHelper = Aggregation.AggregationHelper;
  var getDefaultSelectionVariant = DataVisualization.getDefaultSelectionVariant;
  var getInvolvedDataModelObjects = MetaModelConverter.getInvolvedDataModelObjects;
  var xml = BuildingBlockTemplateProcessor.xml;
  var defineBuildingBlock = BuildingBlockSupport.defineBuildingBlock;
  var blockAttribute = BuildingBlockSupport.blockAttribute;
  function _initializerDefineProperty(e, i, r, l) { r && Object.defineProperty(e, i, { enumerable: r.enumerable, configurable: r.configurable, writable: r.writable, value: r.initializer ? r.initializer.call(l) : void 0 }); }
  function _inheritsLoose(t, o) { t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o); }
  function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
  function _applyDecoratedDescriptor(i, e, r, n, l) { var a = {}; return Object.keys(n).forEach(function (i) { a[i] = n[i]; }), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = !0), a = r.slice().reverse().reduce(function (r, n) { return n(i, e, r) || r; }, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a; }
  function _initializerWarningHelper(r, e) { throw Error("Decorating class property failed. Please ensure that transform-class-properties is enabled and runs after the decorators transform."); }
  /**
   * Building block for creating a VisualFilter based on the metadata provided by OData V4.
   * <br>
   * A Chart annotation is required to bring up an interactive chart
   *
   *
   * Usage example:
   * <pre>
   * &lt;macros:VisualFilter
   * collection="{entitySet&gt;}"
   * chartAnnotation="{chartAnnotation&gt;}"
   * id="someID"
   * groupId="someGroupID"
   * title="some Title"
   * /&gt;
   * </pre>
   * @private
   * @experimental
   */
  let VisualFilterBlock = (_dec = defineBuildingBlock({
    name: "VisualFilter",
    namespace: "sap.fe.macros"
  }), _dec2 = blockAttribute({
    type: "string",
    required: true
  }), _dec3 = blockAttribute({
    type: "string"
  }), _dec4 = blockAttribute({
    type: "sap.ui.model.Context",
    required: true,
    expectedTypes: ["EntitySet", "NavigationProperty"]
  }), _dec5 = blockAttribute({
    type: "sap.ui.model.Context",
    required: true
  }), _dec6 = blockAttribute({
    type: "string"
  }), _dec7 = blockAttribute({
    type: "string"
  }), _dec8 = blockAttribute({
    type: "sap.ui.model.Context"
  }), _dec9 = blockAttribute({
    type: "array"
  }), _dec10 = blockAttribute({
    type: "boolean"
  }), _dec11 = blockAttribute({
    type: "boolean"
  }), _dec12 = blockAttribute({
    type: "boolean"
  }), _dec13 = blockAttribute({
    type: "string"
  }), _dec14 = blockAttribute({
    type: "string"
  }), _dec15 = blockAttribute({
    type: "sap.ui.model.Context"
  }), _dec16 = blockAttribute({
    type: "boolean"
  }), _dec17 = blockAttribute({
    type: "string"
  }), _dec18 = blockAttribute({
    type: "boolean"
  }), _dec19 = blockAttribute({
    type: "boolean"
  }), _dec20 = blockAttribute({
    type: "boolean"
  }), _dec21 = blockAttribute({
    type: "string"
  }), _dec22 = blockAttribute({
    type: "string"
  }), _dec23 = blockAttribute({
    type: "string"
  }), _dec24 = blockAttribute({
    type: "boolean"
  }), _dec25 = blockAttribute({
    type: "boolean"
  }), _dec(_class = (_class2 = /*#__PURE__*/function (_BuildingBlockTemplat) {
    /******************************************************
     * Internal Properties
     * ***************************************************/

    function VisualFilterBlock(props, configuration, mSettings) {
      var _this;
      _this = _BuildingBlockTemplat.call(this, props, configuration, mSettings) || this;
      _initializerDefineProperty(_this, "id", _descriptor, _this);
      _initializerDefineProperty(_this, "title", _descriptor2, _this);
      _initializerDefineProperty(_this, "contextPath", _descriptor3, _this);
      _initializerDefineProperty(_this, "metaPath", _descriptor4, _this);
      _initializerDefineProperty(_this, "outParameter", _descriptor5, _this);
      _initializerDefineProperty(_this, "valuelistProperty", _descriptor6, _this);
      _initializerDefineProperty(_this, "selectionVariantAnnotation", _descriptor7, _this);
      _initializerDefineProperty(_this, "inParameters", _descriptor8, _this);
      _initializerDefineProperty(_this, "multipleSelectionAllowed", _descriptor9, _this);
      _initializerDefineProperty(_this, "required", _descriptor10, _this);
      _initializerDefineProperty(_this, "showOverlayInitially", _descriptor11, _this);
      _initializerDefineProperty(_this, "renderLineChart", _descriptor12, _this);
      _initializerDefineProperty(_this, "requiredProperties", _descriptor13, _this);
      _initializerDefineProperty(_this, "filterBarEntityType", _descriptor14, _this);
      _initializerDefineProperty(_this, "showError", _descriptor15, _this);
      _initializerDefineProperty(_this, "chartMeasure", _descriptor16, _this);
      _initializerDefineProperty(_this, "UoMHasCustomAggregate", _descriptor17, _this);
      _initializerDefineProperty(_this, "showValueHelp", _descriptor18, _this);
      _initializerDefineProperty(_this, "customAggregate", _descriptor19, _this);
      _initializerDefineProperty(_this, "groupId", _descriptor20, _this);
      _initializerDefineProperty(_this, "errorMessageTitle", _descriptor21, _this);
      _initializerDefineProperty(_this, "errorMessage", _descriptor22, _this);
      _initializerDefineProperty(_this, "draftSupported", _descriptor23, _this);
      _initializerDefineProperty(_this, "isValueListWithFixedValues", _descriptor24, _this);
      _this.groupId = "$auto.visualFilters";
      _this.path = _this.metaPath?.getPath();
      const contextObjectPath = getInvolvedDataModelObjects(_this.metaPath, _this.contextPath);
      const converterContext = _this.getConverterContext(contextObjectPath, undefined, mSettings);
      const aggregationHelper = new AggregationHelper(converterContext.getEntityType(), converterContext);
      const customAggregates = aggregationHelper.getCustomAggregateDefinitions();
      const pvAnnotation = contextObjectPath.targetObject;
      let measure;
      const visualizations = pvAnnotation && pvAnnotation.Visualizations;
      _this.getChartAnnotation(visualizations, converterContext);
      let aggregations = [],
        custAggMeasure = [];
      if (_this.chartAnnotation?.Measures?.length) {
        custAggMeasure = customAggregates.filter(custAgg => {
          return custAgg.qualifier === _this.chartAnnotation?.Measures[0].value;
        });
        measure = custAggMeasure.length > 0 ? custAggMeasure[0].qualifier : _this.chartAnnotation.Measures[0].value;
        aggregations = aggregationHelper.getAggregatedProperties()[0];
      }
      // if there are AggregatedProperty objects but no dynamic measures, rather there are transformation aggregates found in measures
      if (aggregations && aggregations.length > 0 && !_this.chartAnnotation?.DynamicMeasures && custAggMeasure.length === 0 && _this.chartAnnotation?.Measures && _this.chartAnnotation?.Measures.length > 0) {
        Log.warning("The transformational aggregate measures are configured as Chart.Measures but should be configured as Chart.DynamicMeasures instead. Please check the SAP Help documentation and correct the configuration accordingly.");
      }
      //if the chart has dynamic measures, but with no other custom aggregate measures then consider the dynamic measures
      if (_this.chartAnnotation?.DynamicMeasures) {
        if (custAggMeasure.length === 0) {
          measure = converterContext.getConverterContextFor(converterContext.getAbsoluteAnnotationPath(_this.chartAnnotation.DynamicMeasures[0].value)).getDataModelObjectPath().targetObject?.Name.toString();
          aggregations = aggregationHelper.getAggregatedProperty();
        } else {
          Log.warning("The dynamic measures have been ignored as visual filters can deal with only 1 measure and the first (custom aggregate) measure defined under Chart.Measures is considered.");
        }
      }
      if (customAggregates.some(function (custAgg) {
        return custAgg.qualifier === measure;
      })) {
        _this.customAggregate = true;
      }
      const defaultSelectionVariant = getDefaultSelectionVariant(converterContext.getEntityType());
      _this.checkSelectionVariant(defaultSelectionVariant);
      const aggregation = _this.getAggregateProperties(aggregations, measure);
      if (aggregation) {
        _this.aggregateProperties = aggregation;
      }
      const propertyAnnotations = visualizations && _this.chartAnnotation?.Measures && _this.chartAnnotation?.Measures[0]?.$target?.annotations;
      const aggregatablePropertyAnnotations = aggregation?.AggregatableProperty?.$target?.annotations;
      _this.checkIfUOMHasCustomAggregate(customAggregates, propertyAnnotations, aggregatablePropertyAnnotations);
      const propertyHidden = propertyAnnotations?.UI?.Hidden;
      const hiddenMeasure = propertyHidden?.valueOf();
      const chartType = _this.chartAnnotation?.ChartType;
      _this.chartType = chartType;
      _this.showValueHelp = _this.getShowValueHelp(chartType, hiddenMeasure);
      _this.draftSupported = ModelHelper.isDraftSupported(mSettings.models.metaModel, _this.contextPath?.getPath());
      /**
       * If the measure of the chart is marked as 'hidden', or if the chart type is invalid, or if the data type for the line chart is invalid,
       * the call is made to the InteractiveChartWithError fragment (using error-message related APIs, but avoiding batch calls)
       */
      _this.errorMessage = _this.getErrorMessage(hiddenMeasure, measure);
      _this.chartMeasure = measure;
      _this.measureDimensionTitle = InteractiveChartHelper.getMeasureDimensionTitle(_this.chartAnnotation, _this.customAggregate, _this.aggregateProperties);
      const collection = getInvolvedDataModelObjects(_this.contextPath);
      _this.toolTip = InteractiveChartHelper.getToolTip(_this.chartAnnotation, collection, _this.path, _this.customAggregate, _this.aggregateProperties, _this.renderLineChart);
      _this.UoMVisibility = InteractiveChartHelper.getUoMVisiblity(_this.chartAnnotation, _this.showError);
      _this.scaleUoMTitle = InteractiveChartHelper.getScaleUoMTitle(_this.chartAnnotation, collection, _this.path, _this.customAggregate, _this.aggregateProperties);
      _this.filterCountBinding = InteractiveChartHelper.getfilterCountBinding(_this.chartAnnotation);
      return _this;
    }
    _exports = VisualFilterBlock;
    _inheritsLoose(VisualFilterBlock, _BuildingBlockTemplat);
    var _proto = VisualFilterBlock.prototype;
    _proto.checkIfUOMHasCustomAggregate = function checkIfUOMHasCustomAggregate(customAggregates, propertyAnnotations, aggregatablePropertyAnnotations) {
      const measures = propertyAnnotations?.Measures;
      const aggregatablePropertyMeasures = aggregatablePropertyAnnotations?.Measures;
      const UOM = this.getUoM(measures, aggregatablePropertyMeasures);
      if (UOM && customAggregates.some(function (custAgg) {
        return custAgg.qualifier === UOM;
      })) {
        this.UoMHasCustomAggregate = true;
      } else {
        this.UoMHasCustomAggregate = false;
      }
    };
    _proto.getChartAnnotation = function getChartAnnotation(visualizations, converterContext) {
      if (visualizations) {
        for (let i = 0; i < visualizations.length; i++) {
          const sAnnotationPath = visualizations[i] && visualizations[i].value;
          this.chartAnnotation = converterContext.getEntityTypeAnnotation(sAnnotationPath) && converterContext.getEntityTypeAnnotation(sAnnotationPath).annotation;
        }
      }
    };
    _proto.getErrorMessage = function getErrorMessage(hiddenMeasure, measure) {
      let validChartType;
      if (this.chartAnnotation) {
        if (this.chartAnnotation.ChartType === "UI.ChartType/Line" || this.chartAnnotation.ChartType === "UI.ChartType/Bar") {
          validChartType = true;
        } else {
          validChartType = false;
        }
      }
      if (typeof hiddenMeasure === "boolean" && hiddenMeasure || !validChartType || this.renderLineChart === "false") {
        this.showError = true;
        this.errorMessageTitle = hiddenMeasure || !validChartType ? this.getTranslatedText("M_VISUAL_FILTERS_ERROR_MESSAGE_TITLE") : this.getTranslatedText("M_VISUAL_FILTER_LINE_CHART_INVALID_DATATYPE");
        if (hiddenMeasure) {
          return this.getTranslatedText("M_VISUAL_FILTER_HIDDEN_MEASURE", [measure]);
        } else if (!validChartType) {
          return this.getTranslatedText("M_VISUAL_FILTER_UNSUPPORTED_CHART_TYPE");
        } else {
          return this.getTranslatedText("M_VISUAL_FILTER_LINE_CHART_UNSUPPORTED_DIMENSION");
        }
      }
    };
    _proto.getShowValueHelp = function getShowValueHelp(chartType, hiddenMeasure) {
      const sDimensionType = this.chartAnnotation?.Dimensions[0] && this.chartAnnotation?.Dimensions[0].$target && this.chartAnnotation.Dimensions[0].$target.type;
      if (sDimensionType === "Edm.Date" || sDimensionType === "Edm.Time" || sDimensionType === "Edm.DateTimeOffset") {
        return false;
      } else if (typeof hiddenMeasure === "boolean" && hiddenMeasure) {
        return false;
      } else if (!(chartType === "UI.ChartType/Bar" || chartType === "UI.ChartType/Line")) {
        return false;
      } else if (this.renderLineChart === "false" && chartType === "UI.ChartType/Line") {
        return false;
      } else if (this.isValueListWithFixedValues === true) {
        return false;
      } else {
        return true;
      }
    };
    _proto.checkSelectionVariant = function checkSelectionVariant(defaultSelectionVariant) {
      let selectionVariant;
      if (this.selectionVariantAnnotation) {
        const selectionVariantContext = this.metaPath?.getModel().createBindingContext(this.selectionVariantAnnotation.getPath());
        selectionVariant = selectionVariantContext && getInvolvedDataModelObjects(selectionVariantContext, this.contextPath).targetObject;
      }
      if (!selectionVariant && defaultSelectionVariant) {
        selectionVariant = defaultSelectionVariant;
      }
      if (selectionVariant && selectionVariant.SelectOptions && !this.multipleSelectionAllowed) {
        for (const selectOption of selectionVariant.SelectOptions) {
          if (selectOption.PropertyName?.value === this.chartAnnotation?.Dimensions[0].value) {
            if (selectOption.Ranges.length > 1) {
              Log.error("Multiple SelectOptions for FilterField having SingleValue Allowed Expression");
            }
          }
        }
      }
    };
    _proto.getAggregateProperties = function getAggregateProperties(aggregations, measure) {
      let matchedAggregate;
      if (!aggregations) {
        return;
      }
      aggregations.some(function (aggregate) {
        if (aggregate.Name === measure) {
          matchedAggregate = aggregate;
          return true;
        }
      });
      return matchedAggregate;
    };
    _proto.getUoM = function getUoM(measures, aggregatablePropertyMeasures) {
      let ISOCurrency = measures?.ISOCurrency;
      let unit = measures?.Unit;
      if (!ISOCurrency && !unit && aggregatablePropertyMeasures) {
        ISOCurrency = aggregatablePropertyMeasures.ISOCurrency;
        unit = aggregatablePropertyMeasures.Unit;
      }
      return ISOCurrency?.path || unit?.path;
    };
    _proto.getRequired = function getRequired() {
      if (this.required) {
        return xml`<Label text="" width="0.5rem" required="true">
							<layoutData>
								<OverflowToolbarLayoutData priority="Never" />
							</layoutData>
						</Label>`;
      } else {
        return "";
      }
    };
    _proto.getUoMTitle = function getUoMTitle(showErrorExpression) {
      if (this.UoMVisibility) {
        return xml`<Title
							id="${generate([this.id, "ScaleUoMTitle"])}"
							visible="{= !${showErrorExpression}}"
							text="${this.scaleUoMTitle}"
							titleStyle="H6"
							level="H3"
							width="4.15rem"
						/>`;
      } else {
        return "";
      }
    };
    _proto.getValueHelp = function getValueHelp(showErrorExpression) {
      if (this.showValueHelp) {
        return xml`<ToolbarSpacer />
						<Button
							id="${generate([this.id, "VisualFilterValueHelpButton"])}"
							type="Transparent"
							ariaHasPopup="Dialog"
							text="${this.filterCountBinding}"
							press="VisualFilterRuntime.fireValueHelp"
							enabled="{= !${showErrorExpression}}"
							customData:multipleSelectionAllowed="${this.multipleSelectionAllowed}"
						>
							<layoutData>
								<OverflowToolbarLayoutData priority="Never" />
							</layoutData>
						</Button>`;
      } else {
        return "";
      }
    };
    _proto.getInteractiveChartFragment = function getInteractiveChartFragment() {
      if (this.showError) {
        return getInteractiveChartWithErrorTemplate(this);
      } else if (this.chartType === "UI.ChartType/Bar") {
        return getInteractiveBarChartTemplate(this);
      } else if (this.chartType === "UI.ChartType/Line") {
        return getInteractiveLineChartTemplate(this);
      }
      return "";
    };
    _proto.getTemplate = function getTemplate() {
      const id = generate([this.path]);
      const showErrorExpression = "${internal>" + id + "/showError}";
      const cozyMode = document.body.classList.contains("sapUiSizeCozy");
      const overallHeight = cozyMode ? "13rem" : "100%";
      const chartHeight = cozyMode ? "100%" : "7.5rem";
      return xml`
		<fbControls:VisualFilter
		core:require="{VisualFilterRuntime: 'sap/fe/macros/visualfilters/VisualFilterRuntime'}"
		xmlns="sap.m"
		xmlns:fbControls="sap.fe.macros.controls.filterbar"
		xmlns:customData="http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1"
		xmlns:core="sap.ui.core"
		id="${this.id}"
		height="${overallHeight}"
		width="20.5rem"
		class="sapUiSmallMarginBeginEnd"
		customData:infoPath="${generate([this.path])}"
	>
		<VBox height="2rem" class="sapUiTinyMarginTopBottom">
			<OverflowToolbar style="Clear">
				${this.getRequired()}
				<Title
					id="${generate([this.id, "MeasureDimensionTitle"])}"
					text="${this.measureDimensionTitle}"
					tooltip="${this.toolTip}"
					titleStyle="H6"
					level="H3"
					class="sapUiTinyMarginEnd sapUiNoMarginBegin"
				/>
				${this.getUoMTitle(showErrorExpression)}
				${this.getValueHelp(showErrorExpression)}
			</OverflowToolbar>
		</VBox>
		<VBox height="${chartHeight}" width="100%">
			${this.getInteractiveChartFragment()}
		</VBox>
	</fbControls:VisualFilter>`;
    };
    return VisualFilterBlock;
  }(BuildingBlockTemplatingBase), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "id", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "title", [_dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return "";
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "contextPath", [_dec4], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "metaPath", [_dec5], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "outParameter", [_dec6], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "valuelistProperty", [_dec7], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "selectionVariantAnnotation", [_dec8], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "inParameters", [_dec9], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "multipleSelectionAllowed", [_dec10], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "required", [_dec11], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "showOverlayInitially", [_dec12], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "renderLineChart", [_dec13], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "requiredProperties", [_dec14], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "filterBarEntityType", [_dec15], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "showError", [_dec16], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "chartMeasure", [_dec17], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "UoMHasCustomAggregate", [_dec18], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "showValueHelp", [_dec19], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "customAggregate", [_dec20], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return false;
    }
  }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "groupId", [_dec21], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return "$auto.visualFilters";
    }
  }), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, "errorMessageTitle", [_dec22], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor22 = _applyDecoratedDescriptor(_class2.prototype, "errorMessage", [_dec23], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor23 = _applyDecoratedDescriptor(_class2.prototype, "draftSupported", [_dec24], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor24 = _applyDecoratedDescriptor(_class2.prototype, "isValueListWithFixedValues", [_dec25], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _class2)) || _class);
  _exports = VisualFilterBlock;
  return _exports;
}, false);
//# sourceMappingURL=VisualFilter.block-dbg.js.map
