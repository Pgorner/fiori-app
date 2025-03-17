/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/buildingBlocks/templating/BuildingBlockTemplateProcessor","sap/fe/core/helpers/StableIdHelper","sap/fe/core/helpers/TypeGuards","../InteractiveChartHelper"],function(e,t,a,r){"use strict";var s={};var i=a.isPathAnnotationExpression;var o=t.generate;var n=e.xml;function l(e){const t=r.getInteractiveChartProperties(e);if(t){const a=o([e.metaPath?.getPath()]);const r=e.chartAnnotation?.Dimensions[0];return n`<InteractiveBarChart
                            xmlns="sap.suite.ui.microchart"
                            xmlns:core="sap.ui.core"
                            xmlns:customData="http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1"
                            core:require="{VisualFilterRuntime: 'sap/fe/macros/visualfilters/VisualFilterRuntime'}"
                            visible="{= ${t.showErrorExpression}}"
                            selectionChanged="VisualFilterRuntime.selectionChanged"
                            showError="{= ${t.showErrorExpression}}"
                            errorMessageTitle="${t.errorMessageTitleExpression}"
                            errorMessage="${t.errorMessageExpression}"
                            bars="${t.aggregationBinding}"
                            customData:outParameter="${e.outParameter}"
                            customData:valuelistProperty="${e.valuelistProperty}"
                            customData:multipleSelectionAllowed="${e.multipleSelectionAllowed}"
                            customData:dimension="${r?.$target?.name}"
                            customData:dimensionText="${i(r?.$target?.annotations.Common?.Text)?r?.$target?.annotations.Common?.Text.path:undefined}"
                            customData:scalefactor="${t.scalefactor}"
                            customData:measure="${e.chartMeasure}"
                            customData:uom="${t.uom}"
                            customData:inParameters="${t.inParameters}"
                            customData:inParameterFilters="${t.inParameterFilters}"
                            customData:dimensionType="${r?.$target?.type}"
                            customData:selectionVariantAnnotation="${t.selectionVariantAnnotation}"
                            customData:required="${e.required}"
                            customData:showOverlayInitially="${e.showOverlayInitially}"
                            customData:requiredProperties="${e.requiredProperties}"
                            customData:infoPath="${a}"
                            customData:parameters="${t.stringifiedParameters}"
                            customData:draftSupported="${e.draftSupported}"
                        >
                            <bars>
                                <InteractiveBarChartBar
                                    core:require="{VisualFilterRuntime: 'sap/fe/macros/visualfilters/VisualFilterRuntime'}"
                                    label="${t.chartLabel}"
                                    value="${t.measure}"
                                    displayedValue="${t.displayedValue}"
                                    color="${t.color}"
                                    selected="{path: '$field>/conditions', formatter: 'sap.fe.macros.visualfilters.VisualFilterRuntime.getAggregationSelected'}"
                                />
                            </bars>
                        </InteractiveBarChart>`}return""}s.getInteractiveBarChartTemplate=l;return s},false);
//# sourceMappingURL=InteractiveBarChart.js.map