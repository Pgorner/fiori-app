/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  [
  ],
  function( ){
    "use strict";
    function SDKChartTypeHelper() {
      var SCATTER = "viz/scatter";
      var BUBBLE = "viz/bubble";
      var DUAL = "viz/dual";
      var RADAR = "viz/radar";
      var MULTI_RADAR = "viz/multi_radar";
      this.isRadarChart = function (charttype) {
        return charttype === RADAR || charttype === MULTI_RADAR;
      };
      this.isScatterBubbleChart = function (charttype) {
        return this.isScatterChart(charttype) || this.isBubbleChart(charttype);
      };
      this.isDualChart = function (charttype) {
        return charttype !== undefined && charttype.indexOf(DUAL) !== -1;
      };
      this.isScatterChart = function (charttype) {
        return charttype === SCATTER;
      };
      this.isBubbleChart = function (charttype) {
        return charttype === BUBBLE;
      };
    }
    return SDKChartTypeHelper;
  }
);
