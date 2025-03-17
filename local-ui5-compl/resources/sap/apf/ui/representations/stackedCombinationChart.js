/*!
* SAP APF Analysis Path Framework
* 
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
*/
sap.ui.define(["sap/apf/core/constants","sap/apf/ui/utils/constants","sap/apf/ui/representations/BaseVizFrameChartRepresentation","sap/apf/utils/exportToGlobal"],function(e,t,a,r){"use strict";var s=function(e,r){a.apply(this,[e,r]);this.type=t.representationTypes.STACKED_COMBINATION_CHART;this.chartType=t.vizFrameChartTypes.STACKED_COMBINATION};s.prototype=Object.create(a.prototype);s.prototype.getAxisFeedItemId=function(t){var a=e.representationMetadata.kind;var r;switch(t){case a.XAXIS:r=e.vizFrame.feedItemTypes.CATEGORYAXIS;break;case a.LEGEND:r=e.vizFrame.feedItemTypes.COLOR;break;case a.YAXIS:r=e.vizFrame.feedItemTypes.VALUEAXIS;break;default:break}return r};r("sap.apf.ui.representations.stackedCombinationChart",s);return s},true);
//# sourceMappingURL=stackedCombinationChart.js.map