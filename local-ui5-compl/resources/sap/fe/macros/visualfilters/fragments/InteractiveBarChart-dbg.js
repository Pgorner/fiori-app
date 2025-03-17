/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/buildingBlocks/templating/BuildingBlockTemplateProcessor", "sap/fe/core/helpers/StableIdHelper", "sap/fe/core/helpers/TypeGuards", "../InteractiveChartHelper"], function (BuildingBlockTemplateProcessor, StableIdHelper, TypeGuards, InteractiveChartHelper) {
  "use strict";

  var _exports = {};
  var isPathAnnotationExpression = TypeGuards.isPathAnnotationExpression;
  var generate = StableIdHelper.generate;
  var xml = BuildingBlockTemplateProcessor.xml;
  function getInteractiveBarChartTemplate(visualFilter) {
    const interactiveChartProperties = InteractiveChartHelper.getInteractiveChartProperties(visualFilter);
    if (interactiveChartProperties) {
      const id = generate([visualFilter.metaPath?.getPath()]);
      const dimension = visualFilter.chartAnnotation?.Dimensions[0];
      return xml`<InteractiveBarChart
                            xmlns="sap.suite.ui.microchart"
                            xmlns:core="sap.ui.core"
                            xmlns:customData="http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1"
                            core:require="{VisualFilterRuntime: 'sap/fe/macros/visualfilters/VisualFilterRuntime'}"
                            visible="{= ${interactiveChartProperties.showErrorExpression}}"
                            selectionChanged="VisualFilterRuntime.selectionChanged"
                            showError="{= ${interactiveChartProperties.showErrorExpression}}"
                            errorMessageTitle="${interactiveChartProperties.errorMessageTitleExpression}"
                            errorMessage="${interactiveChartProperties.errorMessageExpression}"
                            bars="${interactiveChartProperties.aggregationBinding}"
                            customData:outParameter="${visualFilter.outParameter}"
                            customData:valuelistProperty="${visualFilter.valuelistProperty}"
                            customData:multipleSelectionAllowed="${visualFilter.multipleSelectionAllowed}"
                            customData:dimension="${dimension?.$target?.name}"
                            customData:dimensionText="${isPathAnnotationExpression(dimension?.$target?.annotations.Common?.Text) ? dimension?.$target?.annotations.Common?.Text.path : undefined}"
                            customData:scalefactor="${interactiveChartProperties.scalefactor}"
                            customData:measure="${visualFilter.chartMeasure}"
                            customData:uom="${interactiveChartProperties.uom}"
                            customData:inParameters="${interactiveChartProperties.inParameters}"
                            customData:inParameterFilters="${interactiveChartProperties.inParameterFilters}"
                            customData:dimensionType="${dimension?.$target?.type}"
                            customData:selectionVariantAnnotation="${interactiveChartProperties.selectionVariantAnnotation}"
                            customData:required="${visualFilter.required}"
                            customData:showOverlayInitially="${visualFilter.showOverlayInitially}"
                            customData:requiredProperties="${visualFilter.requiredProperties}"
                            customData:infoPath="${id}"
                            customData:parameters="${interactiveChartProperties.stringifiedParameters}"
                            customData:draftSupported="${visualFilter.draftSupported}"
                        >
                            <bars>
                                <InteractiveBarChartBar
                                    core:require="{VisualFilterRuntime: 'sap/fe/macros/visualfilters/VisualFilterRuntime'}"
                                    label="${interactiveChartProperties.chartLabel}"
                                    value="${interactiveChartProperties.measure}"
                                    displayedValue="${interactiveChartProperties.displayedValue}"
                                    color="${interactiveChartProperties.color}"
                                    selected="{path: '$field>/conditions', formatter: 'sap.fe.macros.visualfilters.VisualFilterRuntime.getAggregationSelected'}"
                                />
                            </bars>
                        </InteractiveBarChart>`;
    }
    return "";
  }
  _exports.getInteractiveBarChartTemplate = getInteractiveBarChartTemplate;
  return _exports;
}, false);
//# sourceMappingURL=InteractiveBarChart-dbg.js.map
