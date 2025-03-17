/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/base/util/merge",
	"./UtilizationChart",
	"sap/ui/core/Core",
	"sap/gantt/simple/StockChartPeriod"
], function(merge, UtilizationChart, Core, StockChartPeriod){
	"use strict";

	/**
	 * Constructor for a new Stock Chart
	 *
	 * @param {string} [sId] ID of the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * <p>
	 * Stock Chart (SC) is a complex shape, you can use it to visualize stock utilization on different dimensions.
	 * Each Stock dimension is represented by a line, you could define different colors for each dimension.
	 * </p>
	 *
	 *
	 * @extends sap.gantt.simple.UtilizationChart
	 *
	 * @author SAP SE
	 * @version 1.132.0
	 * @since 1.95
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.StockChart
	 */
	var StockChart = UtilizationChart.extend("sap.gantt.simple.StockChart", /** @lends sap.gantt.simple.StockChart.prototype */ {
		metadata: {
			library: "sap.gantt",
			properties: {
				/**
				 * Flag to show or hide the middle line in Stock Chart. By default the middle line is a gray dashed line
				 */
				showMiddleLine: { type: "boolean", defaultValue: true },
				/**
				 * value of middle line.
				 * @since 1.97
				 */
				relativeMiddleLinePoint: {type: "float", group: "Misc", defaultValue: 50},
				/**
				 * Minimum value of the Chart.
				*/
                minValue:	{type: "float", group: "Misc", defaultValue: 0},
				/**
				 * Maximum value of the Chart.
				*/
                maxValue:   {type: "float", group: "Misc", defaultValue: 100},
				/**
				 * Property to enable Compact View.
				 * @since 1.100.0
				*/
				showCompactView: {type: "boolean", defaultValue : true}
			},
			defaultAggregation: "stockChartDimensions",
			aggregations: {
				/**
				 * Dimensions of the Stock Chart
				 */
				 stockChartDimensions: {
					type: "sap.gantt.simple.StockChartDimension",
					group : "Data"
				}
			}
		},
		renderer: {
			apiVersion: 2    // enable in-place DOM patching
		}
	});

	StockChart.prototype.applySettings = function(mSettings, oScope) {
		mSettings = mSettings || {};
		UtilizationChart.prototype.applySettings.call(this, mSettings, oScope);
	};

	/**
	 * Render a shape element with RenderManager
	 * @protected
	 * @param {object} oRm Render Manager
	 * @param {object} oElement shape instance
	 */
	StockChart.prototype.renderElement = function(oRm, oElement) {
		var iHeightPaddingPixel = 8;
		if (this.getStockChartDimensions().length === 0) {
			this._renderEmptyDomRefs(oRm, true/**bCloseTag*/);
			return;
		}

		this._renderEmptyDomRefs(oRm, false/**bCloseTag*/);

		var iX = this.getX(),
			iHeight = this.getHeight(),
			iY = this.getRowYCenter() - iHeight / 2,
			iWidth = this.getWidth();

		var mProp = {
			x: iX,
			y: this.getShowCompactView() ? iY + (iHeightPaddingPixel / 2) : iY,
			width: iWidth,
			height: this.getShowCompactView() ? iHeight - iHeightPaddingPixel : iHeight
		};

		// 1. all dimension clip path
		this._renderDefsDimensionClipPaths(oRm, mProp);

		// 2. middle indicator line
		this._renderMiddleLine(oRm, mProp);

		// 3. all dimension paths
		this._renderDimensionPaths(oRm, mProp);

		// 4. render tooltip rectangles
		this._renderTooltips(oRm, mProp);

		oRm.close("g");
	};

	/**
	 * @private
	*/
	StockChart.prototype._renderEmptyDomRefs = function(oRm, bClosedTag) {
		oRm.openStart("g", this);
		oRm.class("sapGanttStock");
		oRm.openEnd();
		if (bClosedTag) {
			oRm.close("g");
		}
	};

	/**
	 * @private
	*/
	StockChart.prototype._renderDefsDimensionClipPaths = function(oRm, mProp) {
		var aDimensions = this.getStockChartDimensions();
		oRm.openStart("defs").openEnd();
		for (var iIndex = 0; iIndex < aDimensions.length; iIndex++) {
			oRm.openStart("clipPath", aDimensions[iIndex].getId() + "-clipPath");
			oRm.openEnd();
			this.renderDimensionPath(oRm,aDimensions[iIndex], mProp.y, mProp.height, null, aDimensions, true);
			oRm.close("clipPath");
		}
		oRm.close("defs");
	};

	/**
	 * creates path for the overlapped threshold.
	 * @param {Object} oThreshold threshold Dimension aggregation
	 * @param {Object} oDimension main Dimension aggregation
	 * @returns {Array} returns array of paths to draw threshold line.
	 * @private
	 */
	StockChart.prototype._createThresholdDefsPath = function(oThreshold, oDimension) {
		var aThresholdPeriods = oThreshold.getStockChartPeriods();
		var aDimensionPeriods = oDimension.getStockChartPeriods();
		var aCombinedPeriod = [];
		var newPeriod = {};
		//Iterate thorugh all the Dimensions Periods
		for (var i = 0; i < aDimensionPeriods.length; i++) {
			var oDimensionPeriod = aDimensionPeriods[i];
			var vValue = oDimensionPeriod.getValue();
			//For Positive Dimension Period and Thresholds
			if ( vValue > oDimension.getRelativePoint() && oThreshold.getRelativePoint() > oDimension.getRelativePoint()) {
				this._createIntersectionThresholdPaths(aDimensionPeriods, aThresholdPeriods, oDimensionPeriod, oDimension, aCombinedPeriod, i, true);
			} else if (vValue < oDimension.getRelativePoint() && oThreshold.getRelativePoint() < oDimension.getRelativePoint()) { //For Negative Dimension Period and Thresholds
				this._createIntersectionThresholdPaths(aDimensionPeriods, aThresholdPeriods, oDimensionPeriod, oDimension, aCombinedPeriod, i, false);
			} else if (vValue == oDimension.getRelativePoint()) { //For Dimension and Thresholds equal to RelativePoint
				var oStartDate = oDimensionPeriod.getFrom();
				var oEndDate = oDimensionPeriod.getTo();
				if (aDimensionPeriods[i - 1] && aDimensionPeriods[i - 1].getTo().getTime() == aDimensionPeriods[i].getFrom().getTime()){
					var oNearestThresholdPeriod = this._getNearestThresholdPeriod(aThresholdPeriods, aDimensionPeriods[i].getFrom());
					if (oNearestThresholdPeriod) {
						var ocurrentThreshold = this._getCurrentThr(aThresholdPeriods,oNearestThresholdPeriod);
						// get period when threshold path is slanted with straight dimension.
						if (ocurrentThreshold && ocurrentThreshold.getFrom().getTime() > oStartDate.getTime() &&
						oNearestThresholdPeriod.getTo().getTime() != ocurrentThreshold.getFrom().getTime()){
							var pt = this._createSlantThresholdPath(oNearestThresholdPeriod, ocurrentThreshold,aDimensionPeriods,i);
							newPeriod = {
								from:oDimensionPeriod.getFrom(),
								to: oDimensionPeriod.getFrom(),
								value: pt.y
							};
							aCombinedPeriod.push(new StockChartPeriod(newPeriod));
						}
					}
				}

				//Create SlantPath for values going from max/min to Dimension RelativePoint
				if (oThreshold.getRelativePoint() > 0 && aDimensionPeriods[i - 1] && aDimensionPeriods[i - 1].getValue() >  oDimension.getRelativePoint()) {
					this._createSlantPath(i, aDimensionPeriods, aThresholdPeriods, oStartDate, oEndDate, oDimension, oDimensionPeriod, aCombinedPeriod, true);
				} else if (oThreshold.getRelativePoint() < 0 && aDimensionPeriods[i - 1] && aDimensionPeriods[i - 1].getValue() < oDimension.getRelativePoint()) {
					this._createSlantPath(i, aDimensionPeriods, aThresholdPeriods, oStartDate, oEndDate, oDimension, oDimensionPeriod, aCombinedPeriod, true);
				}
				newPeriod = {
					from:oDimensionPeriod.getFrom(),
					to: oDimensionPeriod.getTo(),
					value: oDimensionPeriod.getValue()
				};
				aCombinedPeriod.push(new StockChartPeriod(newPeriod));
			} else { // Normal Case
				newPeriod = {
					from:oDimensionPeriod.getFrom(),
					to: oDimensionPeriod.getTo(),
					value: oDimension.getRelativePoint()
				};
				aCombinedPeriod.push(new StockChartPeriod(newPeriod));
			}
		}
		return aCombinedPeriod;
	};

	/**
	 * @private
	*/
	StockChart.prototype._getNearestThresholdPeriod = function(aThresholdPeriods, oDate) {
		var aPreviousPeriods = aThresholdPeriods.filter(function(oThresholdPeriod){
			return  oDate.getTime() - oThresholdPeriod.getFrom().getTime() > 0;
		});
		return aPreviousPeriods[aPreviousPeriods.length - 1] || null;
	};

	/**
	* @private
	*/
	StockChart.prototype._getNextThresholdPeriod = function(aThresholdPeriods, oDate) {
		var anextPeriods = aThresholdPeriods.filter(function(oThresholdPeriod){
			return  oThresholdPeriod.getFrom().getTime() - oDate.getTime() > 0;
		});
		return anextPeriods[0] || null;
	};

	/**
	 * filter the threshold Periods based on Dimension period.
	 * @private
	*/
	StockChart.prototype._getFilterThresholdPeriods = function(aThresholdPeriods, aDimensionPeriods,i) {
		return aThresholdPeriods.filter(function(oThresholdPeriod, index){
		oThresholdPeriod._actualIndex = index;
		var oDimensionPeriod = aDimensionPeriods[i];
		var oDimensionPeriodNext = aDimensionPeriods[ i + 1];
		return oThresholdPeriod.getFrom().getTime() == oDimensionPeriod.getFrom().getTime()
		|| (oDimensionPeriodNext && oDimensionPeriodNext.getFrom().getTime() !== oDimensionPeriod.getTo().getTime() && oThresholdPeriod.getFrom().getTime() == oDimensionPeriod.getTo().getTime())
		|| (oThresholdPeriod.getFrom().getTime() > oDimensionPeriod.getFrom().getTime()
		&& oThresholdPeriod.getFrom().getTime() < oDimensionPeriod.getTo().getTime());
		});
	};

	/**
	 * get value of period for negative or positive threshold.
	 * @param {Object} oDimensionPeriod Main dimension period
	 * @param {Object} oThresholdPeriod threshould period
	 * @param {Boolean} isPositiveThreshold checks if threshould is negavative/positive
	 * @returns {Number} Returns value of period
	 * @private
	 */
	StockChart.prototype._getPeriodValue = function (oDimensionPeriod, oThresholdPeriod, isPositiveThreshold) {
		var value;
		if (isPositiveThreshold) {
			value = oDimensionPeriod.getValue() > oThresholdPeriod.getValue()
								? oThresholdPeriod.getValue()
								: oDimensionPeriod.getValue();
		} else {
			value = oDimensionPeriod.getValue() < oThresholdPeriod.getValue()
								? oThresholdPeriod.getValue()
								: oDimensionPeriod.getValue();
		}
		return value;
	};

	/**
	 * create paths when threshold line intersects with main dimension
	 * @private
	*/
	StockChart.prototype._createIntersectionThresholdPaths = function(aDimensionPeriods, aThresholdPeriods, oDimensionPeriod, oDimension, aCombinedPeriod, i,  isPositiveThreshold) {
		var oStartDate = oDimensionPeriod.getFrom();
		var oEndDate = oDimensionPeriod.getTo();
		var oNearestThresholdPeriod;
		var newPeriod = {};
		//The Dimension Period spans across a time range
		if (oStartDate.getTime() != oEndDate.getTime()) {
			//Get All the thresholds which is equal to Start/EndDate or lie in between the Start/EndDate of the given DimensionPeriod
			var aFilteredThreshold = this._getFilterThresholdPeriods(aThresholdPeriods, aDimensionPeriods,i);
			//Create Path for Slant Periods
			this._createSlantPath(i, aDimensionPeriods, aThresholdPeriods, oStartDate, oEndDate, oDimension, oDimensionPeriod, aCombinedPeriod, false);
			if (aFilteredThreshold.length > 0) {
				for (var j = 0; j < aFilteredThreshold.length; j++) {
					//If first Filtered Threshold Period  is after the startDate create Period with previous from CurrentDimensionPeriod to firstFilteredThresholdPeriod
					if (j == 0 && aFilteredThreshold[j].getFrom().getTime() > oStartDate.getTime()) {
						oNearestThresholdPeriod = this._getNearestThresholdPeriod(aThresholdPeriods, aFilteredThreshold[j].getFrom());
						var ocurrentThreshold = this._getCurrentThr(aThresholdPeriods, oNearestThresholdPeriod);
						if (oNearestThresholdPeriod.getTo().getTime() === ocurrentThreshold.getFrom().getTime()) {
							if (oNearestThresholdPeriod.getTo().getTime() === aFilteredThreshold[j].getFrom().getTime()) {
								newPeriod = {
									from:oDimensionPeriod.getFrom(),
									to: aFilteredThreshold[j].getFrom()
								};
								newPeriod.value = this._getPeriodValue(oDimensionPeriod, oNearestThresholdPeriod, isPositiveThreshold);
							} else {
								var pt = this._createSlantThresholdPath(oNearestThresholdPeriod, aFilteredThreshold[j],aDimensionPeriods,i);
								if (oNearestThresholdPeriod.getTo().getTime() > oStartDate.getTime()){
									newPeriod = {
										from:this.getAxisTime().viewToTime(pt.x),
										to: oNearestThresholdPeriod.getTo() ,
										value: oNearestThresholdPeriod.getValue()
									};
								} else {
									newPeriod = {
										from:oDimensionPeriod.getFrom(),
										to: oDimensionPeriod.getFrom(),
										value:oNearestThresholdPeriod.getValue() < oDimension.getRelativePoint() ? -pt.y : pt.y
									};
								}
							}
							aCombinedPeriod.push(new StockChartPeriod(newPeriod));
						}
					}
					//If StartDates of DimensionPeriod and Threshold Period Intersect
					if (aFilteredThreshold[j].getFrom().getTime() == oStartDate.getTime()) {
						if (i != 0) {
							//ThresholdPeriods Ends after DimensionPeriod create a new Period with Dimension Start/EndDate with lowest of DimensionPeriod/ThresholdPeriod Value
							if (aFilteredThreshold[j].getTo().getTime() > oDimensionPeriod.getTo().getTime()) {
								newPeriod = {
									from: oDimensionPeriod.getFrom(),
									to: oDimensionPeriod.getTo()
								};
								newPeriod.value = this._getPeriodValue(oDimensionPeriod, aFilteredThreshold[j], isPositiveThreshold);
							} else {
								//ThresholdPeriods Ends before DimensionPeriod create a new Period with Dimension Start, Threshold EndDate with lowest of DimensionPeriod/ThresholdPeriod Value
								newPeriod = {
									from: oDimensionPeriod.getFrom(),
									to: aFilteredThreshold[j].getTo()
								};
								newPeriod.value = this._getPeriodValue(oDimensionPeriod, aFilteredThreshold[j], isPositiveThreshold);
							}
						} else {
							newPeriod = {
								from: oDimensionPeriod.getFrom(),
								to: oDimensionPeriod.getTo()
							};
							newPeriod.value = this._getPeriodValue(oDimensionPeriod, aFilteredThreshold[j], isPositiveThreshold);
						}
						aCombinedPeriod.push(new StockChartPeriod(newPeriod));
					} else if (aFilteredThreshold[j].getFrom().getTime() > oStartDate.getTime()) {//If StartDates of DimensionPeriod and Threshold Period Dont Intersect
						oNearestThresholdPeriod = this._getNearestThresholdPeriod(aThresholdPeriods, aFilteredThreshold[j].getFrom());
						//creating a period at the same date to get the intersection position in case of slant threshold
						if (oNearestThresholdPeriod.getTo().getTime()  < oStartDate.getTime()){
							var pt = this._createSlantThresholdPath(oNearestThresholdPeriod,aFilteredThreshold[j],aDimensionPeriods,i);
							var newDate = this.getAxisTime().viewToTime(pt.x);
							newPeriod = {
								value: pt.y
							};
							newPeriod.from = newDate;
							newPeriod.to = newDate;
							aCombinedPeriod.push(new StockChartPeriod(newPeriod));
						}
						//ThresholdPeriods Ends after DimensionPeriod create a new Period with Dimension Start/EndDate with lowest of DimensionPeriod/ThresholdPeriod Value
						if (aFilteredThreshold[j].getTo().getTime() > oDimensionPeriod.getTo().getTime() ) {
							newPeriod = {
								from: aFilteredThreshold[j].getFrom(),
								to: oDimensionPeriod.getTo()
							};
							//if threshold value is less then next dimension period value then take period till threshold end.
							if (oDimensionPeriod.getValue() > aFilteredThreshold[j].getValue() &&
								aDimensionPeriods[i + 1] && aDimensionPeriods[i + 1].getValue() > aFilteredThreshold[j].getValue() ) {
								newPeriod.to = aFilteredThreshold[j].getTo();
							}
							if (aDimensionPeriods[i - 1] && oStartDate.getTime() != aDimensionPeriods[i - 1].getTo().getTime() && oNearestThresholdPeriod.getValue() < aFilteredThreshold[j].getValue() &&
								oNearestThresholdPeriod.getTo().getTime() != aFilteredThreshold[j].getFrom().getTime() ) {
								newPeriod.from = oStartDate;
							}
						} else  {
							newPeriod = {
								from: aFilteredThreshold[j].getFrom(),
								to: aFilteredThreshold[j].getTo()
							};
						}
						newPeriod.value = this._getPeriodValue(oDimensionPeriod, aFilteredThreshold[j], isPositiveThreshold);
						aCombinedPeriod.push(new StockChartPeriod(newPeriod));
					}
				}
			} else if ( !aDimensionPeriods[i - 1] || (oStartDate.getTime() == aDimensionPeriods[i - 1].getTo().getTime())) {
					//Get the previous nearestThresholdPeriod and set the Value for the entire Dimension.

					oNearestThresholdPeriod = this._getNearestThresholdPeriod(aThresholdPeriods, oDimensionPeriod.getFrom());
					var oNextThresholdPeriod = this._getNextThresholdPeriod(aThresholdPeriods, oDimensionPeriod.getFrom());

					if (oNearestThresholdPeriod.getTo().getTime() < oDimensionPeriod.getFrom().getTime() &&
					oNextThresholdPeriod && oNextThresholdPeriod.getFrom().getTime() > oDimensionPeriod.getTo().getTime()
					){
						var pt = this._createSlantThresholdPath(oNearestThresholdPeriod,oNextThresholdPeriod,aDimensionPeriods,i);
						var newDate = this.getAxisTime().viewToTime(pt.x);
						newPeriod = {
							value: pt.y
						};
						newPeriod.from = oDimensionPeriod.getFrom();
						newPeriod.to = oDimensionPeriod.getFrom();
						aCombinedPeriod.push(new StockChartPeriod(newPeriod));
						var pt = this._createSlantThresholdPath(oNextThresholdPeriod,oNearestThresholdPeriod,aDimensionPeriods,i);
						var newDate = this.getAxisTime().viewToTime(pt.x);
						newPeriod = {
							value: pt.y
						};
						newPeriod.from = oDimensionPeriod.getTo();
						newPeriod.to = oDimensionPeriod.getTo();
						aCombinedPeriod.push(new StockChartPeriod(newPeriod));
					} else {
						if (oDimensionPeriod.getFrom().getTime() > oNearestThresholdPeriod.getFrom().getTime()) {

							if (oNearestThresholdPeriod.getTo().getTime() > oDimensionPeriod.getTo().getTime()){
								newPeriod = {
									from: oDimensionPeriod.getFrom(),
									to: oDimensionPeriod.getTo()
								};
								newPeriod.value = this._getPeriodValue(oDimensionPeriod, oNearestThresholdPeriod, isPositiveThreshold);
							} else if (oNearestThresholdPeriod.getTo().getTime() > oDimensionPeriod.getFrom().getTime()){
								newPeriod = {
									from: oDimensionPeriod.getFrom(),
									to: oNearestThresholdPeriod.getTo()
								};
								newPeriod.value = this._getPeriodValue(oDimensionPeriod, oNearestThresholdPeriod, isPositiveThreshold);
							}
						}
						aCombinedPeriod.push(new StockChartPeriod(newPeriod));
					}
			}


		}
	};

	/**
	 * @private
	 */
	StockChart.prototype._createSlantThresholdPath = function (nearestThroshold, currThroshold, aDimensionPeriods, i) {
		var oPathStartDate = nearestThroshold.getTo().getTime();
		var oPathEndDate = currThroshold.getFrom().getTime();
		var iPathStartDateXCord = this.getAxisTime().timeToView(oPathStartDate);
		var iPathEndDateXCord = this.getAxisTime().timeToView(oPathEndDate);
		var nThValue = nearestThroshold.getValue();
		var cThValue = currThroshold.getValue();

		var oDimensionXCord =  this.getAxisTime().timeToView(aDimensionPeriods[i].getTo().getTime());
		var x2 =  aDimensionPeriods[i + 1] ? this.getAxisTime().timeToView( aDimensionPeriods[i + 1].getFrom().getTime()) : oDimensionXCord;
		if (aDimensionPeriods[i].getFrom().getTime() > nearestThroshold.getTo().getTime() &&
			aDimensionPeriods[i].getFrom().getTime() < currThroshold.getFrom().getTime()) {
			oDimensionXCord =  this.getAxisTime().timeToView( aDimensionPeriods[i].getFrom().getTime());
			x2 =  aDimensionPeriods[i - 1] ? this.getAxisTime().timeToView( aDimensionPeriods[i - 1].getTo().getTime()) : oDimensionXCord;
		}
		var p1 = { x:iPathStartDateXCord,y:nThValue };
		var p2 = { x:iPathEndDateXCord , y :cThValue};
		var p3 = { x:oDimensionXCord ,y:cThValue };
		var p4 = { x:x2 , y:nThValue};
		return this._getIntersect(p1,p2,p3,p4);
	};

	/**
	 * calculate intersection of two straight lines
	 * @param {Object} p1
	 * @param {Object} p2
	 * @param {Object} p3
	 * @param {Object} p4
	 * @returns coordinates of intersection.
	 * @private
	 */
	StockChart.prototype._getIntersect = function(p1,p2,p3,p4){

		// down part of intersection point formula

		var d1 = (p1.x - p2.x) * (p3.y - p4.y); // (x1 - x2) * (y3 - y4)
		var d2 = (p1.y - p2.y) * (p3.x - p4.x); // (y1 - y2) * (x3 - x4)
		var d  = (d1) - (d2);
		if (d == 0) {
		throw new Error('Number of intersection points is zero or infinity.');
		}
		// upper part of intersection point formula
		var u1 = (p1.x * p2.y - p1.y * p2.x); // (x1 * y2 - y1 * x2)
		var u4 = (p3.x * p4.y - p3.y * p4.x); // (x3 * y4 - y3 * x4)

		var u2x = p3.x - p4.x; // (x3 - x4)
		var u3x = p1.x - p2.x; // (x1 - x2)
		var u2y = p3.y - p4.y; // (y3 - y4)
		var u3y = p1.y - p2.y; // (y1 - y2)
		// intersection point formula
		var px = (u1 * u2x - u3x * u4) / d;
		var py = (u1 * u2y - u3y * u4) / d;
		var p = { x: px, y: py };
		return p;
	};

	/**
	 * returns current threshold period.
	 * @param {Array} aThresholdPeriods list of threshold period aggregation
	 * @param {Object} oNearestThresholdPeriod threshold closest to current dimension period
	 * @returns {Object} current threshold period
	 * @private
	 */
	StockChart.prototype._getCurrentThr = function(aThresholdPeriods,oNearestThresholdPeriod) {
      var ct,diff  = Number.MAX_SAFE_INTEGER / 2;
       aThresholdPeriods.forEach(function(itemT){
		if (oNearestThresholdPeriod.getFrom().getTime() != itemT.getFrom().getTime() && oNearestThresholdPeriod.getTo().getTime() != itemT.getTo().getTime()){
          var tDiff = Math.abs(itemT.getFrom().getTime() - oNearestThresholdPeriod.getTo().getTime());
		  if (tDiff < diff){
			  diff = tDiff;
			  ct  = itemT;
		  }
		}
	   });
	   return ct;
	};
	/**
	 * @private
	*/
	StockChart.prototype._createSlantPath = function(i, aDimensionPeriods, aThresholdPeriods, oStartDate, oEndDate, oDimension, oDimensionPeriod, aCombinedPeriod, isRelativePoint) {
		if ( aDimensionPeriods[i - 1] && (oStartDate.getTime() != aDimensionPeriods[i - 1].getTo().getTime())) {
			var oNearestThresholdPeriod = this._getNearestThresholdPeriod(aThresholdPeriods, oStartDate);
			var ocurrentThreshold = this._getCurrentThr(aThresholdPeriods,oNearestThresholdPeriod);
			var oPathStartDate = aDimensionPeriods[ i - 1].getTo();
			var iPathStartDateXCord = this.getAxisTime().timeToView(oPathStartDate);
			var p1 = { x:iPathStartDateXCord,y: aDimensionPeriods[ i - 1].getValue() };
			var p2 = {  x:this.getAxisTime().timeToView(aDimensionPeriods[ i ].getFrom().getTime()) , y :aDimensionPeriods[ i ].getValue()};
			var p3,p4;
			if (oNearestThresholdPeriod.getTo().getTime() > oStartDate.getTime()){
			    p3 = { x:this.getAxisTime().timeToView(aDimensionPeriods[ i - 1].getTo().getTime()) ,y:oNearestThresholdPeriod.getValue() };
				p4 = { x:this.getAxisTime().timeToView(oNearestThresholdPeriod.getTo().getTime()) , y:oNearestThresholdPeriod.getValue()};
			} else {
				p3 = { x:this.getAxisTime().timeToView(oNearestThresholdPeriod.getTo().getTime()) ,y:oNearestThresholdPeriod.getValue() };
				p4 = { x:this.getAxisTime().timeToView(ocurrentThreshold.getFrom().getTime()) , y:ocurrentThreshold.getValue()};
			}
			var pt = this._getIntersect(p1,p2,p3,p4);
			var newDate = this.getAxisTime().viewToTime(pt.x);
			var newPeriod = {
				value: pt.y
			};
			newPeriod.from = newDate;
			newPeriod.to = newDate;
			aCombinedPeriod.push(new StockChartPeriod(newPeriod));
		}
	};

	/**
	 * @private
	*/
	StockChart.prototype._renderMiddleLine = function(oRm, mProp) {
		if (this.getShowMiddleLine()) {
			var iMiddleY = this._getMiddleLineY(mProp);
			oRm.openStart("path", this.getId() + "-middleLine");
			oRm.attr("d", "M " + mProp.x + " " + iMiddleY + " h " + mProp.width);
			oRm.class("sapGanttStockMiddleLine");
			oRm.openEnd().close("path");
		}
	};

	/**
	 * @private
	*/
	StockChart.prototype._getMiddleLineY = function(mProp) {
		var iRelativePointValue = this._createTransform(this.getRelativeMiddleLinePoint());
		var iRelativePointPercentageHeight =  mProp.height * (iRelativePointValue / (100));
		var yRelativePoint = (mProp.y + mProp.height) - iRelativePointPercentageHeight;
		return yRelativePoint;
	};

	/**
	 * @private
	*/
	StockChart.prototype._getClipPathIdOfDimension = function(oDimension) {
		return "url(#" + oDimension.getId() + "-clipPath)";
	};

	/**
	 * @private
	*/
	StockChart.prototype._renderDimensionPaths = function(oRm, mProp) {
		var iX = mProp.x,
			iY = mProp.y,
			iWidth = mProp.width,
			iHeight = mProp.height;
			var aNegtivePeriods = [];
			var aPositivePeriods = [];
			var mAttr = {};
			var fill;
		var aDimensions = this.getStockChartDimensions();
		var oMainDimension = aDimensions.filter(function(oDimension){
			return oDimension.getIsThreshold() != true;
		});
		var aPositiveThresholds = aDimensions.filter(function(oDimension){
			return oDimension.getIsThreshold() == true && oDimension.getRelativePoint() > oMainDimension[0].getRelativePoint();
		}).sort(function(oDimension1, oDimension2){
			return oDimension2.getRelativePoint() - oDimension1.getRelativePoint();
		});

		var aNegativeThresholds = aDimensions.filter(function(oDimension){
			return oDimension.getIsThreshold() == true && oDimension.getRelativePoint() < oMainDimension[0].getRelativePoint();
		}).sort(function(oDimension1, oDimension2){
			return oDimension1.getRelativePoint() - oDimension2.getRelativePoint();
		});

		if (oMainDimension) {
			oRm.openStart("g").openEnd();
			var oDimension = oMainDimension[0];
			//Check for NegativePeriods and create Individial Background Rectangle for both Positive and Negative Relative values
			//Else use the exiting apporach of Creating a single Rectangle with only positive Relative Values
			aNegtivePeriods = [];
			aPositivePeriods = [];
			for (var i = 0; i < oDimension.getStockChartPeriods().length; i++) {
				var oPeriod = oDimension.getStockChartPeriods()[i];
				if (oPeriod.getValue() < oDimension.getRelativePoint()) {
					aNegtivePeriods.push(oPeriod);
				} else {
					aPositivePeriods.push(oPeriod);
				}
			}

			 var yOrigin = iHeight; // top row edge
			// If Positive and Negative are available split the height based on RelativePoint
			// and set the height of the Background Rectangle which contains the Capacity Color
			if ( aNegtivePeriods.length > 0 && aPositivePeriods.length > 0) {
				for (var index = 0; index < 2; index++) {
					var iRelativePointValue = this._createTransform(oDimension.getRelativePoint());
					var iRelativePointPercentageHeight = iHeight * (iRelativePointValue / (100));
					var yRelativePoint = yOrigin - iRelativePointPercentageHeight;
					if (index == 1) {
						if (aNegativeThresholds.length > 0) {
							fill = aNegativeThresholds[0].getRemainCapacityColor();
						}  else {
							fill = oDimension.getRemainCapacityColorNegative();
						}
					} else if ( aPositiveThresholds.length > 0) {
							fill = aPositiveThresholds[0].getRemainCapacityColor();
						} else {
							fill = oDimension.getRemainCapacityColor();
						}
					mAttr = {
						id: oDimension.getId() + (index == 1  ? "-scRectNegative" : "-scRect"),
						x: iX,
						y: (index == 1  ? (iY + yRelativePoint) : iY),
						width: iWidth,
						height: (index == 1 ? iHeight - yRelativePoint : iHeight - (iHeight - yRelativePoint)),
						fill: fill,
						"clip-path": this._getClipPathIdOfDimension(oDimension)
					};
					this.renderRectangleWithAttributes(oRm, mAttr);
				}
			} else if (aPositivePeriods.length > 0 || aNegtivePeriods.length > 0) {
				var aThresholdperiod = aPositivePeriods.length > 0 ? aPositiveThresholds : aNegativeThresholds;
				if (aThresholdperiod.length > 0) {
					fill = aThresholdperiod[0].getRemainCapacityColor();
				} else {
					fill = aPositivePeriods.length > 0 ?  oDimension.getRemainCapacityColor() : oDimension.getRemainCapacityColorNegative();
				}
				mAttr = {
					id: oDimension.getId() + (aPositivePeriods.length > 0  ? "-scRect" : "-scRectNegative"),
					x: iX,
					y: iY,
					width: iWidth,
					height: iHeight,
					fill: fill,
					"clip-path": this._getClipPathIdOfDimension(oDimension)
				};
				this.renderRectangleWithAttributes(oRm, mAttr);
			}
			oRm.close("g");
		}
		if (aPositiveThresholds.length > 0) {
			for (var iIndex = 0; iIndex < aPositiveThresholds.length; iIndex++) {
				oRm.openStart("g").openEnd();
				var oPositiveThreshold = aPositiveThresholds[iIndex];
				mAttr = {
					id: oPositiveThreshold.getId() + "-scRect",
					x: iX,
					y: iY,
					width: iWidth,
					height: iHeight,
					fill: aPositiveThresholds[iIndex + 1] ? aPositiveThresholds[iIndex + 1].getRemainCapacityColor() : oMainDimension[0].getRemainCapacityColor(),
					"clip-path": this._getClipPathIdOfDimension(oPositiveThreshold)
				};
				this.renderRectangleWithAttributes(oRm, mAttr);
				oRm.close("g");
			}
		}
		if (aNegativeThresholds.length > 0) {
			for (var iIndex = 0; iIndex < aNegativeThresholds.length; iIndex++) {
				oRm.openStart("g").openEnd();
				var oNegativeThreshold = aNegativeThresholds[iIndex];
				mAttr = {
					id: oNegativeThreshold.getId() + "-scRect",
					x: iX,
					y: iY,
					width: iWidth,
					height: iHeight,
					fill: aNegativeThresholds[iIndex + 1] ? aNegativeThresholds[iIndex + 1].getRemainCapacityColor() : oMainDimension[0].getRemainCapacityColor(),
					"clip-path": this._getClipPathIdOfDimension(oNegativeThreshold)
				};
				this.renderRectangleWithAttributes(oRm, mAttr);
				oRm.close("g");
			}
		}

		// drawing all the paths after completing the rects
		if (oMainDimension) {
			oRm.openStart("g").openEnd();
			var oDimension = oMainDimension[0];
			this.renderDimensionPath(oRm, oDimension, iY, iHeight, "scPath"/**sIdSuffix*/);
			oRm.close("g");
		}
		if (aPositiveThresholds.length > 0) {
			for (var iIndex = 0; iIndex < aPositiveThresholds.length; iIndex++) {
				oRm.openStart("g").openEnd();
				var oPositiveThreshold = aPositiveThresholds[iIndex];
				this.renderDimensionPath(oRm, oPositiveThreshold, iY, iHeight, "scPath"/**sIdSuffix*/);
				oRm.close("g");
			}
		}
		if (aNegativeThresholds.length > 0) {
			for (var iIndex = 0; iIndex < aNegativeThresholds.length; iIndex++) {
				oRm.openStart("g").openEnd();
				var oNegativeThreshold = aNegativeThresholds[iIndex];
				this.renderDimensionPath(oRm, oNegativeThreshold, iY, iHeight, "scPath"/**sIdSuffix*/);
				oRm.close("g");
			}
		}

	};

	/**
	 * @private
	*/
	StockChart.prototype._renderTooltips = function(oRm, mProp) {
		var iY = mProp.y,
			iHeight = mProp.height,
			oStockChartTooltipAttr = {};
		oRm.openStart("g");
		oRm.class("sc-tooltips").openEnd();
		var aDimensionPoints = this.getAllDimensionPoints();
		aDimensionPoints.forEach(function(oPoint, iIndex, aPoints) {

			var oNextPoint = aPoints[iIndex + 1] || oPoint;

			var sTooltip = oPoint.tooltip;

			var bDifferentDimension = oPoint.name !== oNextPoint.name;
			if (bDifferentDimension) {
				sTooltip = oPoint.tooltip + "\n" + oNextPoint.tooltip;
			}

			var iX1 = this.toX(oPoint.from),
				bLastPoint = aPoints.length - 1 === iIndex,
				iX2 = this.toX(bLastPoint ? oNextPoint.to : oNextPoint.from),
				iWidth = Math.abs(iX2 - iX1);

			if (iWidth > 0) {
				// if and only if the rectangle has actual width, then render it
				// otherwise 0 width user can't see anything
				var mDefault = {
					opacity: 0,
					fillOpacity: 0,
					strokeOpacity: 0
				};

				var mAttr = merge({
					x: iX1,
					y: iY,
					width: iWidth,
					height: iHeight
				}, mDefault);
				this.renderRectangleWithAttributes(oRm, mAttr, sTooltip);
				oStockChartTooltipAttr = mAttr;
			}
		}.bind(this));
		if (Object.keys(oStockChartTooltipAttr).length != 0) {
			oStockChartTooltipAttr.x = mProp.x;
			oStockChartTooltipAttr.width = 0;
			oStockChartTooltipAttr.class = "stockChartTooltip";
			this.renderRectangleWithAttributes(oRm, oStockChartTooltipAttr, "stockChartTooltip");
		}
		oRm.close("g");
	};

	/**
	 * @private
	*/
	StockChart.prototype.getAllDimensionPoints = function() {
		var aAllPeriods = [];
		this.getStockChartDimensions().forEach(function(oDimension){
			var sName = oDimension.getName();
			oDimension.getStockChartPeriods().forEach(function(oPeriod, iIndex, aPeriods) {
				var sTooltip = oPeriod.getTooltip();
				if (!sTooltip) {
					sTooltip = sName + ": " + oPeriod.getValue();
				}

				if (oPeriod.getFrom() != oPeriod.getTo()) {
					aAllPeriods.push({
						name: sName,
						from: oPeriod.getFrom(),
						to: oPeriod.getFrom(),
						tooltip: sTooltip
					});
					aAllPeriods.push({
						name: sName,
						from: oPeriod.getTo(),
						to: oPeriod.getTo(),
						tooltip: sTooltip
					});
				} else {
					aAllPeriods.push({
						name: sName,
						from: oPeriod.getFrom(),
						to: oPeriod.getTo(),
						tooltip: sTooltip
					});
				}
			});
		});
		return aAllPeriods;
	};

	/**
	 * @private
	*/
	StockChart.prototype.renderDimensionPath = function(oRm, oDimension, iRowY, iRowHeight, sIdSuffix, aDimensions, bIsDefsCreation) {
		if (oDimension.getIsThreshold() && bIsDefsCreation) {
			var oMainDimension = aDimensions.filter(function(oDimension){
				return oDimension.getIsThreshold() != true;
			});
			var aDimensionPeriods = oDimension.getStockChartPeriods().length > 0 ? this._createThresholdDefsPath(oDimension, oMainDimension[0]) : [];
	   }
		var aPeriods = oDimension.getIsThreshold() && bIsDefsCreation ? aDimensionPeriods : oDimension.getStockChartPeriods();
		var d = "";

		for (var i = 0; i < aPeriods.length; i++) {
			var bFirst = (i === 0),
				bLast  = (i === aPeriods.length - 1);

			var oPeriod = aPeriods[i];
			var xPos1 = this.toX(oPeriod.getFrom());
			var xPos2 = this.toX(oPeriod.getTo());
			var vValue = oPeriod.getValue();

			if (vValue > this.getMaxValue()) {
				vValue = this.getMaxValue();
			}
			if (vValue < this.getMinValue()) {
				vValue = this.getMinValue();
			}

			//Get the YActual Value by converting the actual values to relative value between 0 - 100.
			//Convert the result to value between 0 - iRowHeight
			var yOrigin = iRowY + iRowHeight; // top row edge
			var iPercentageHeight = iRowHeight * (this._createTransform(vValue) / (100));
			var yActual = yOrigin - iPercentageHeight;

			//Convert the given Period values to relative values between 0 - 100
			//Create Midpoint to differentiate Positive / Negative periods based on RelativePoint
			var iRelativePointValue = this._createTransform(oDimension.getIsThreshold() && bIsDefsCreation ? oMainDimension[0].getRelativePoint() : oDimension.getRelativePoint());
			var iRelativePointPercentageHeight = iRowHeight * (iRelativePointValue / (100));
			var iRelativePoint = yOrigin - iRelativePointPercentageHeight;

			if (bIsDefsCreation) {
				d += (bFirst
					? " M " + xPos1 + " " + iRelativePoint
					: "")
				+ " L " + xPos1 + " " + yActual + " L " + xPos2 + " " + yActual +
				(bLast
					? " L " + xPos2 + " " + iRelativePoint
					: "");
			} else {
				d += (bFirst
					? " M " + xPos1 + " " + yActual
					: "")
				+ (bFirst ? "" : " L " + xPos1 + " " + yActual ) + " L " + xPos2 + " " + yActual;
			}
		}

		if (sIdSuffix) {
			oRm.openStart("path", oDimension.getId() + "-" + sIdSuffix);
		} else {
			oRm.openStart("path");
		}
		oRm.attr("d", d);
		oRm.attr("fill", "none");
		oRm.attr("stroke-width", oDimension.getDimensionStrokeWidth());
		if (oDimension.getDimensionStrokeDasharray()) {
			oRm.attr("stroke-dasharray", oDimension.getDimensionStrokeDasharray());
		}
		oRm.attr("stroke", oDimension.getDimensionPathColor());
		oRm.class("sapGanttScDimensionPath");
		oRm.openEnd().close("path");
	};

	/**
	 * @private
	*/
	StockChart.prototype._createTransform = function(value) {
		var oldRange = {max: this.getMaxValue(), min: this.getMinValue()};
		var newRange = {max: 100, min: 0};
		var scale = (newRange.max - newRange.min) / (oldRange.max - oldRange.min);
		var newValue =  (value - oldRange.min) * scale;
		return newValue;
	};

	/**
	 * @private
	*/
	StockChart.prototype.destroy = function() {
		UtilizationChart.prototype.destroy.apply(this, arguments);
	};

	return StockChart;
}, /**bExport*/true);
