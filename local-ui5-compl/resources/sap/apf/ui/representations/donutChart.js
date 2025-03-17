/*!
* SAP APF Analysis Path Framework
* 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
sap.ui.define(["sap/apf/core/constants","sap/apf/ui/representations/BaseVizFrameChartRepresentation","sap/apf/ui/utils/constants"],function(e,t,a){"use strict";var r=function(e,r){t.apply(this,[e,r]);this.type=a.representationTypes.DONUT_CHART;this.chartType=a.vizFrameChartTypes.DONUT};r.prototype=Object.create(t.prototype);r.prototype.getAxisFeedItemId=function(t){var a=e.representationMetadata.kind;var r;switch(t){case a.SECTORCOLOR:r=e.vizFrame.feedItemTypes.COLOR;break;case a.SECTORSIZE:r=e.vizFrame.feedItemTypes.SIZE;break;default:break}return r};return r},true);
//# sourceMappingURL=donutChart.js.map