/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/zen/dsh/utils/BaseHandler","sap/zen/dsh/widgets/charts/SDKBaseChart"],function(e,a){"use strict";a.extend("sap.zen.SDKScatterChart",{initCvomChartType:function(){this.cvomType="viz/scatter"},getDataFeeding:function(e,a,t,n){var r=this.getChartDataFeedingHelper();var i=r.getDataScatterFeedingColor(e,a,t,n);var d=r.getDataScatterFeedingShape(e,a,t,n);var s=[{feedId:"primaryValues",binding:[{type:"measureValuesGroup",index:1}]},{feedId:"secondaryValues",binding:[{type:"measureValuesGroup",index:2}]},{feedId:"regionColor",binding:i},{feedId:"regionShape",binding:d}];return s}});return sap.zen.SDKScatterChart});
//# sourceMappingURL=SDKScatter.js.map