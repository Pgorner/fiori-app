/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  [
    "jquery.sap.global",
    "sap/sac/df/thirdparty/lodash",
    "sap/zen/dsh/utils/BaseHandler"
  ],
  function() {
    "use strict";
    var AlignCharts = function() {
      this.charts = [];
    };
    AlignCharts.prototype.addChart = function(vizFrame) {
      this.charts.push(vizFrame);
    };
    AlignCharts.prototype.alignValueAxis = function(){
      var maxValue = 0;
      var currViz, props;
      for (var i = 0; i < this.charts.length; i++) {
        currViz = this.charts[i];
        props = currViz.getVizFrame().properties();
        if (maxValue < props.categoryAxis.layout.autoHeight){
          maxValue = props.categoryAxis.layout.autoHeight;
        }
      }
      for (i = 0; i < this.charts.length; i++) {
        currViz = this.charts[i];
        var newProps = { categoryAxis : {layout: {height : maxValue} }};
        props = currViz.getVizFrame().properties();
        if (maxValue !== props.categoryAxis.layout.autoHeight){
          currViz.getVizFrame().properties(newProps);
        }
      }
    };
    sap.zen.dsh.info = sap.zen.dsh.info || {} ;
    sap.zen.dsh.info.AlignCharts = AlignCharts;
  }
);
