/*!
* SAP APF Analysis Path Framework
* 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
sap.ui.define([
	"sap/apf/core/constants",
	"sap/apf/ui/representations/BaseVizFrameChartRepresentation",
	"sap/apf/ui/utils/constants"
], function(coreConstants, BaseVizFrameChartRepresentation, uiConstants) {
	"use strict";

	var donutChart = function(oApi, oParameters) {
		BaseVizFrameChartRepresentation.apply(this, [ oApi, oParameters ]);
		this.type = uiConstants.representationTypes.DONUT_CHART;
		this.chartType = uiConstants.vizFrameChartTypes.DONUT;
	};

	donutChart.prototype = Object.create(BaseVizFrameChartRepresentation.prototype);
	//Set the "constructor" property to refer to donutChart
	//donutChart.prototype.constructor = donutChart;
	donutChart.prototype.getAxisFeedItemId = function(sKind) {
		var oSupportedTypes = coreConstants.representationMetadata.kind;
		var axisfeedItemId;
		switch (sKind) {
			case oSupportedTypes.SECTORCOLOR:
				axisfeedItemId = coreConstants.vizFrame.feedItemTypes.COLOR;
				break;
			case oSupportedTypes.SECTORSIZE:
				axisfeedItemId = coreConstants.vizFrame.feedItemTypes.SIZE;
				break;
			default:
				break;
		}
		return axisfeedItemId;
	};
	return donutChart;
}, true);