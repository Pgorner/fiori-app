/*!
* SAP APF Analysis Path Framework
* 
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
*/
sap.ui.define(["sap/apf/core/constants","sap/apf/ui/utils/constants","sap/apf/ui/representations/BaseVizFrameChartRepresentation","sap/apf/utils/exportToGlobal"],function(e,t,a,i){"use strict";var r=function(e,i){a.apply(this,[e,i]);this.type=t.representationTypes.DUAL_COMBINATION_CHART;this.chartType=t.vizFrameChartTypes.DUAL_COMBINATION};r.prototype=Object.create(a.prototype);r.prototype.getAxisFeedItemId=function(t){var a=e.representationMetadata.kind;var i;switch(t){case a.XAXIS:i=e.vizFrame.feedItemTypes.CATEGORYAXIS;break;case a.LEGEND:i=e.vizFrame.feedItemTypes.COLOR;break;case a.YAXIS:i=e.vizFrame.feedItemTypes.VALUEAXIS;break;case a.YAXIS2:i=e.vizFrame.feedItemTypes.VALUEAXIS2;break;default:break}return i};r.prototype.setVizPropsOfThumbnailForSpecificRepresentation=function(){if(!this.thumbnailChart){return}this.thumbnailChart.setVizProperties({valueAxis2:{visible:false,title:{visible:false}}})};i("sap.apf.ui.representations.dualCombinationChart",r);return r},true);
//# sourceMappingURL=dualCombinationChart.js.map