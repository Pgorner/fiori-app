sap.ui.define([
	"sap/apf/core/constants",
	"sap/apf/ui/representations/BaseVizFrameChartRepresentation"
], function(
	coreConstants,
	BaseVizFrameChartRepresentation
) {
	"use strict";

	/**
	 * @class stackedBarChart constructor.
	 * @alias sap.apf.demokit.app.representation.stackedBarChart
	 * @extends sap.apf.ui.representations.BaseVizFrameChartRepresentation
	 * @param oParametersdefines parameters required for chart such as Dimension/Measures,tooltip, axis information.
	 * @returns chart object
	 */
	function stackedBarChart(oApi, oParameters) {
		BaseVizFrameChartRepresentation.apply(this, [ oApi, oParameters ]);
		this.type = "StackedBarChart";
		this.chartType = "stacked_bar";
		this._createDefaultFeedItemId();
	}
	stackedBarChart.prototype = Object.create(BaseVizFrameChartRepresentation.prototype);
	//Set the "constructor" property to refer to stackedBarChart
	stackedBarChart.prototype.constructor = stackedBarChart;
	/** 
	 * @method _createDefaultFeedItemId
	 * @description reads the oParameters for chart and modifies it by including a default feedItem id 
	 * in case the "kind" property is not defined in dimension/measures
	 */
	stackedBarChart.prototype._createDefaultFeedItemId = function() {
		this.parameter.measures.forEach(function(measure, index) {
			if (measure.kind === undefined) {//handle the scenario where the kind is not available
				measure.axisfeedItemId = index === 0 ? coreConstants.vizFrame.feedItemTypes.VALUEAXIS : coreConstants.vizFrame.feedItemTypes.VALUEAXIS2;
			}
		});
		this.parameter.dimensions.forEach(function(dimension, index) {
			if (dimension.kind === undefined) {//handle the scenario where the kind is not available
				dimension.axisfeedItemId = index === 0 ? coreConstants.vizFrame.feedItemTypes.CATEGORYAXIS : coreConstants.vizFrame.feedItemTypes.COLOR;
			}
		});
	};
	/**
	 * @method handleCustomFormattingOnChart
	 * @description sets the custom format string
	 */
	stackedBarChart.prototype.handleCustomFormattingOnChart = function() {
		var superClass = this;
		var aMeasure = superClass.getMeasures();
		var sFormatString = superClass.getFormatStringForMeasure(aMeasure[0]); //get the format string from base class
		superClass.setFormatString("xAxis", sFormatString);
	};

	// no need for an additional compatiblity export here as the global name matches the module name
	return stackedBarChart;
}, true);
