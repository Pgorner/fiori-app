/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/buildingBlocks/templating/BuildingBlockTemplateProcessor"],function(e){"use strict";var r={};var i=e.xml;function s(e){const r=e.chartAnnotation;if(e.chartMeasure&&r?.Dimensions&&r.Dimensions[0]){return i`<InteractiveLineChart
                        xmlns="sap.suite.ui.microchart"
                        xmlns:core="sap.ui.core"
                        core:require="{VisualFilterRuntime: 'sap/fe/macros/visualfilters/VisualFilterRuntime'}"
                        showError="${e.showError}"
                        errorMessageTitle="${e.errorMessageTitle}"
                        errorMessage="${e.errorMessage}"
                    />`}return""}r.getInteractiveChartWithErrorTemplate=s;return r},false);
//# sourceMappingURL=InteractiveChartWithError.js.map