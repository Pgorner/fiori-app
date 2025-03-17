/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/core/Element","sap/ui/core/theming/Parameters"],function(t,e){"use strict";var a=t.extend("sap.gantt.simple.StockChartDimension",{metadata:{library:"sap.gantt",properties:{name:{type:"string"},dimensionPathColor:{type:"sap.gantt.ValueSVGPaintServer"},remainCapacityColor:{type:"sap.gantt.ValueSVGPaintServer"},remainCapacityColorNegative:{type:"sap.gantt.ValueSVGPaintServer"},relativePoint:{type:"float",defaultValue:0},isThreshold:{type:"boolean",defaultValue:false},dimensionStrokeDasharray:{type:"string"},dimensionStrokeWidth:{type:"float",defaultValue:2}},defaultAggregation:"stockChartPeriods",aggregations:{stockChartPeriods:{type:"sap.gantt.simple.StockChartPeriod"}}}});a.prototype.getDimensionPathColor=function(){return this.getProperty("dimensionPathColor")||e.get("sapUiChartNeutral")};a.prototype.getRemainCapacityColor=function(){return this.getProperty("remainCapacityColor")||e.get("sapUiChartNeutral")};a.prototype.getRemainCapacityColorNegative=function(){return this.getProperty("remainCapacityColorNegative")||e.get("sapUiChartBad")};return a},true);
//# sourceMappingURL=StockChartDimension.js.map