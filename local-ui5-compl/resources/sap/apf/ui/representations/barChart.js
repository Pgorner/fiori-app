/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
sap.ui.define(["sap/apf/ui/representations/BaseVizFrameChartRepresentation","sap/apf/core/constants","sap/apf/ui/utils/constants","sap/apf/utils/exportToGlobal"],function(e,t,a,r){"use strict";function n(t,r){e.apply(this,[t,r]);this.type=a.representationTypes.BAR_CHART;this.chartType=a.vizFrameChartTypes.BAR;this._addDefaultKind()}n.prototype=Object.create(e.prototype);n.prototype.constructor=n;n.prototype._addDefaultKind=function(){this.parameter.measures.forEach(function(e){if(e.kind===undefined){e.kind=t.representationMetadata.kind.YAXIS}});this.parameter.dimensions.forEach(function(e,a){if(e.kind===undefined){e.kind=a===0?t.representationMetadata.kind.XAXIS:t.representationMetadata.kind.LEGEND}})};n.prototype.getAxisFeedItemId=function(e){var a=t.representationMetadata.kind;var r;switch(e){case a.XAXIS:r=t.vizFrame.feedItemTypes.CATEGORYAXIS;break;case a.YAXIS:r=t.vizFrame.feedItemTypes.VALUEAXIS;break;case a.LEGEND:r=t.vizFrame.feedItemTypes.COLOR;break;default:break}return r};r("sap.apf.ui.representations.barChart",n);return n},true);
//# sourceMappingURL=barChart.js.map