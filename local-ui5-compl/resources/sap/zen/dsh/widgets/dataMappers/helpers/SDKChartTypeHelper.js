/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define([],function(){"use strict";function t(){var t="viz/scatter";var r="viz/bubble";var i="viz/dual";var a="viz/radar";var n="viz/multi_radar";this.isRadarChart=function(t){return t===a||t===n};this.isScatterBubbleChart=function(t){return this.isScatterChart(t)||this.isBubbleChart(t)};this.isDualChart=function(t){return t!==undefined&&t.indexOf(i)!==-1};this.isScatterChart=function(r){return r===t};this.isBubbleChart=function(t){return t===r}}return t});
//# sourceMappingURL=SDKChartTypeHelper.js.map