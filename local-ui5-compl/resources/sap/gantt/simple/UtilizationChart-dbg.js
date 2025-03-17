/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"./BaseShape",
	"./BaseRectangle",
	"sap/gantt/misc/Format",
	"sap/ui/core/Core",
	"sap/gantt/utils/GanttChartConfigurationUtils"
], function( BaseShape, BaseRectangle, Format, Core, GanttChartConfigurationUtils){
	"use strict";

	/**
	 * Constructor for a new UtilizationChart, to be called by subclasses only.
	 *
	 * @param {string} [sId] ID of the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * UtilizationChart is an abstract base class which inherits by UtilizationLineChart and UtilizationBarChart.
	 * It defines the common properties and functions that reused by both shapes.
	 *
	 * @extends sap.gantt.simple.BaseShape
	 *
	 * @author SAP SE
	 * @version 1.132.0
	 *
	 * @constructor
	 * @abstract
	 * @alias sap.gantt.simple.UtilizationChart
	 * @public
	 */
	var UtilizationChart = BaseShape.extend("sap.gantt.simple.UtilizationChart", {
		metadata: {
			library: "sap.gantt",
			"abstract": true,
			properties: {

				/**
				 * Defines the <code>UtilizationLineChart<code> or <code>UtilizationBarChart</code> height.
				 */
				height: {type: "sap.gantt.SVGLength", defaultValue: "inherit"},

				/**
				 * Defines the margin height of UtilizationChart
				 */
				overConsumptionMargin: { type: "float", defaultValue: 25.0 },

				/**
				 * Defines the over comsumption color, or fill pattern.
				 */
				overConsumptionColor: {type: "sap.gantt.ValueSVGPaintServer", defaultValue: "red"},

				/**
				 * Defines the remain capacity color.
				 */
				remainCapacityColor: {type: "sap.gantt.ValueSVGPaintServer", defaultValue: "lightgray"}
			}
		},
		renderer: {
			apiVersion: 2    // enable in-place DOM patching
		}
	});

	/**
	 * Convert the bound time to svg x coordination
	 *
	 * @returns {float} the x coordination
	 * @protected
	 */
	UtilizationChart.prototype.getX = function() {
		var bRTL = GanttChartConfigurationUtils.getRTL();
		return bRTL ? this.getXByTime(this.getEndTime()) : this.getXByTime(this.getTime());
	};

	/**
	 * Calculate the actual width of the shape.
	 * The width is calculated based on the time range provided by property <code>time</code> and <code>endTime</code> bindings.
	 *
	 * @returns {float} the width of the shape
	 * @protected
	 */
	UtilizationChart.prototype.getWidth = function() {
        var oGantt = this.getGanttChartBase(),iZoomRate,iStartTime,iEndTime,iTimeDiff,viewOffset,viewRange,oAxisTime;

        var aInputKeys, shapeWidthMap;
		oAxisTime = this.getAxisTime();
        if (oGantt && oGantt instanceof sap.gantt.simple.GanttChartWithTable &&
			 this.getTime() && this.getEndTime() && oAxisTime) {
            iStartTime =  this.getTime().valueOf();
            iEndTime  = this.getEndTime().valueOf();
            iTimeDiff = iEndTime - iStartTime;
			if (oAxisTime.discontinuityProvider) {	// when skip time pattern is applied, use distance method to calculate time difference
				iTimeDiff = oAxisTime._discontinuityProviderInstance.distance(this.getTime(), this.getEndTime());
			}
			iZoomRate = oAxisTime.getZoomRate();
			viewOffset = oAxisTime.getViewOffset();
			viewRange = oAxisTime.getViewRange()[1];
            shapeWidthMap = oAxisTime._shapeWidthValue;

            // // check cache first
            var shapeWidthValue = shapeWidthMap.getValue(iZoomRate, iTimeDiff,viewOffset,viewRange);
            if (shapeWidthValue !== undefined) {
                // cache hit
                return shapeWidthValue;
            }
			aInputKeys = [iZoomRate, iTimeDiff,viewOffset,viewRange];
        }
		var xTime  = this.getXByTime(this.getTime());
		var xEndTime = this.getXByTime(this.getEndTime());
		var nRetVal =  Math.abs(xTime - xEndTime);
		if (shapeWidthMap) {
            shapeWidthMap.add(aInputKeys,nRetVal);
        }
		return nRetVal;
	};

	UtilizationChart.prototype.getHeight = function() {
		return BaseRectangle.prototype.getHeight.apply(this);
	};

	/**
	 * Get X coordination
	 *
	 * @returns {float} x coordination
	 * @private
	 * @param {string} vTs timestamp of string type
	 */
	UtilizationChart.prototype.toX = function(vTs) {
		return this.getAxisTime().timeToView(Format.abapTimestampToDate(vTs));
	};

	UtilizationChart.prototype.renderRectangleWithAttributes = function(oRm, mAttr, sTooltip) {
		oRm.openStart("rect");
		Object.keys(mAttr).forEach(function(sName) {
			oRm.attr(sName, mAttr[sName]);
		});
		oRm.openEnd();
		if (sTooltip) {
			oRm.openStart("title").openEnd();
			oRm.text(sTooltip, true);
			oRm.close("title");
		}
		oRm.close("rect");
	};

	return UtilizationChart;
}, /**bExport*/true);
