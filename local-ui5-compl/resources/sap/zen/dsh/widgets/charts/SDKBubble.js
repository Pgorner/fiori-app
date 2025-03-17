/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/zen/dsh/utils/BaseHandler","sap/zen/dsh/widgets/charts/SDKBaseChart"],function(e,a){"use strict";a.extend("sap.zen.SDKBubbleChart",{getDataFeeding:function(e,a,i,n,t){var d=this.getChartDataFeedingHelper();var r=d.getDataBubbleFeedingColor(i,n);var u=d.getDataBubbleFeedingShape(i,n);var b=d.getDataBubbleFeedingHeight(t);var s=[{feedId:"primaryValues",binding:[{type:"measureValuesGroup",index:1}]},{feedId:"secondaryValues",binding:[{type:"measureValuesGroup",index:2}]},{feedId:"bubbleWidth",binding:[{type:"measureValuesGroup",index:3}]},{feedId:"bubbleHeight",binding:b},{feedId:"regionColor",binding:r},{feedId:"regionShape",binding:u}];return s},initCvomChartType:function(){this.cvomType="viz/bubble"}});return sap.zen.SDKBubbleChart});
//# sourceMappingURL=SDKBubble.js.map