/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/sac/df/thirdparty/lodash","sap/zen/dsh/utils/BaseHandler"],function(){"use strict";var t=function(){this.charts=[]};t.prototype.addChart=function(t){this.charts.push(t)};t.prototype.alignValueAxis=function(){var t=0;var a,s;for(var i=0;i<this.charts.length;i++){a=this.charts[i];s=a.getVizFrame().properties();if(t<s.categoryAxis.layout.autoHeight){t=s.categoryAxis.layout.autoHeight}}for(i=0;i<this.charts.length;i++){a=this.charts[i];var e={categoryAxis:{layout:{height:t}}};s=a.getVizFrame().properties();if(t!==s.categoryAxis.layout.autoHeight){a.getVizFrame().properties(e)}}};sap.zen.dsh.info=sap.zen.dsh.info||{};sap.zen.dsh.info.AlignCharts=t});
//# sourceMappingURL=align_charts.js.map