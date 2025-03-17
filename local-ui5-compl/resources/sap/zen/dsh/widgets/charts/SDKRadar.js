/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/zen/dsh/utils/BaseHandler","sap/zen/dsh/widgets/charts/SDKBaseChart"],function(e,a){"use strict";a.extend("sap.zen.SDKRadarChart",{initCvomChartType:function(){this.cvomType="viz/radar"},getDataFeeding:function(e,a,r,n){var d=this.getChartDataFeedingHelper();var i=d.getDataRadarFeedingColor(e,a,r,n);var t=[];var s=d.getDataRadarFeedingAxes(e,n);var g=[{feedId:"radarAxesValues",binding:[{type:"measureValuesGroup",index:1}]},{feedId:"regionColor",binding:i},{feedId:"regionShape",binding:t},{feedId:"radarAxes",binding:s}];return g}});return sap.zen.SDKRadarChart});
//# sourceMappingURL=SDKRadar.js.map