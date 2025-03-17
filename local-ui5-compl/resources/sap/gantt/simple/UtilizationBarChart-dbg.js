/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"./UtilizationChart",
	"./BaseRectangle",
	"sap/gantt/def/pattern/BackSlashPattern"
], function(jQuery, UtilizationChart, BaseRectangle, BackSlashPattern){
	"use strict";

	/**
	 * Constructor for a new Utilization Bar
	 *
	 * @param {string} [sId] ID of the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * <p>Utilization Bar Chart (UBC) is a complex shape, you can use it to visualize a resource the capacity and actual consumption of a resource.</p>
	 * <p>There is a `line` in UBC to visualize the actual capacity consumption, you can change the `line` color by property <code>stroke</code></p>
	 *
	 * @extends sap.gantt.simple.UtilizationChart
	 *
	 * @author SAP SE
	 * @version 1.132.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.UtilizationBarChart
	 */
	var UtilizationBarChart = UtilizationChart.extend("sap.gantt.simple.UtilizationBarChart", /** @lends sap.gantt.simple.UtilizationBarChart.prototype */ {
		metadata: {
			library: "sap.gantt",
			properties: {

				/**
				 * The color fills in capacity consumption
				 */
				consumptionColor: {type: "sap.gantt.ValueSVGPaintServer", defaultValue: "lightgray"}
			},
			defaultAggregation: "periods",
			aggregations: {
				/**
				 * Periods of UtilizationBarChart
				 */
				periods: {
					type: "sap.gantt.simple.UtilizationPeriod",
					group : "Data"
				}
			}

		},
		renderer: {
			apiVersion: 2    // enable in-place DOM patching
		}
	});

	UtilizationBarChart.prototype.applySettings = function(mSettings, oScope) {
		mSettings = mSettings || {};
		mSettings.remainCapacityColor = mSettings.remainCapacityColor || "#fff";
		UtilizationChart.prototype.applySettings.call(this, mSettings, oScope);

		this._createDefaultDefs();
	};

	/**
	 * Render a shape element with RenderManager
	 * @protected
	 * @param {object} oRm Render Manager
	 * @param {object} oElement shape instance
	 */
	UtilizationBarChart.prototype.renderElement = function(oRm, oElement) {
		oRm.openStart("g", this);
		oRm.class("sapGanttUtilizationBar");
		oRm.openEnd();

		var iX = this.getX(),
			iHeight = this.getHeight(),

			iY = this.getRowYCenter() - (iHeight / 2),
			iWidth = this.getWidth();

		var mProp = {
			x: iX, y: iY, width: iWidth, height:iHeight
		};
		this.renderBackgroundDefs(oRm);
		this.renderUBCBackground(oRm, mProp);

		var aFilteredPeriods = this.filterPeriods();
		if (aFilteredPeriods.length > 0) {

			this._iMaxAllowedSupply = this._getMaxAllowedSupply(aFilteredPeriods);
			this.renderOverConsumptionPolygon(oRm, mProp, aFilteredPeriods);

			this.renderRemainConsumptionPolygon(oRm, mProp, aFilteredPeriods);

			this.renderConsumptionPolygon(oRm, mProp, aFilteredPeriods);

			this.renderConsumptionPath(oRm, mProp, aFilteredPeriods);

			this.renderTooltips(oRm, mProp, aFilteredPeriods);
		}
		oRm.close("g");
	};

	/**
	 * Filter out peroid items which are out of rendered time range, but always keep the first and last item.
	 * Thus at least the UBC can be shown completely in visible area.
	 * @returns {object} filterd items
	 * @private
	 */
	UtilizationBarChart.prototype.filterPeriods = function() {
		var aAllItems = this.getPeriods();

		var oGantt = this.getGanttChartBase(),
			mTimeRange = oGantt.getRenderedTimeRange(),
			oMinTime = mTimeRange[0],
			oMaxTime = mTimeRange[1];

		return aAllItems.filter(function(oItem, iIndex, aItems) {
			var bFirstOrLast = iIndex === 0 || iIndex === aItems.length - 1;
			if (bFirstOrLast) {
				return true;
			} else {
				return oItem.getFrom() >= oMinTime && oItem.getFrom() <= oMaxTime;
			}
		});
	};

	UtilizationBarChart.prototype.renderUBCBackground = function(oRm, mProp) {
		var sFill = this.getFill();
		if (!sFill) {
			sFill = "url(#" + this.getId() + "-defaultBgPattern)";
		}

		var mAttr = jQuery.extend({
			id: this.getId() + "-ubcBg",
			fill: sFill,
			"fill-opacity": this.getFillOpacity()
		}, mProp);
		this.renderRectangleWithAttributes(oRm, mAttr);
	};

	UtilizationBarChart.prototype.renderOverConsumptionPolygon = function(oRm, mProp, aFilteredPeriods) {
		oRm.openStart("polygon", this.getId() + "-ubcOCP");
		oRm.attr("points", this.getPolygonPoints(mProp, function(oItem, iMaxAllowedSupply){
			var iRowHeight = mProp.height,
				iMaxY = mProp.y + iRowHeight;

			return iMaxY - ((oItem.getDemand() / iMaxAllowedSupply) * iRowHeight);
		}, aFilteredPeriods));
		oRm.attr("fill", this.getOverConsumptionColor());
		oRm.openEnd();
		oRm.close("polygon");
	};

	UtilizationBarChart.prototype.renderConsumptionPath = function(oRm, mProp, aFilteredPeriods) {
		oRm.openStart("path", this.getId() + "-ubcPath");
		oRm.attr("d", this.getDemandPathD(mProp, aFilteredPeriods));
		oRm.attr("fill", "none");
		oRm.attr("stroke", this.getStroke() || "#000"); // fallback to black stroke
		oRm.attr("stroke-width", this.getStrokeWidth() || 2);
		oRm.attr("stroke-dasharray", this.getStrokeDasharray() || "0,0");
		oRm.openEnd();
		oRm.close("path");
	};

	UtilizationBarChart.prototype.renderRemainConsumptionPolygon = function(oRm, mProp, aFilteredPeriods) {
		oRm.openStart("polygon", this.getId() + "-ubcRCP");
		oRm.attr("points", this.getPolygonPoints(mProp, function(oItem, iMaxAllowedSupply){
			var iRowHeight = mProp.height,
				iMaxY = mProp.y + iRowHeight;
			return iMaxY - ((oItem.getSupply() / iMaxAllowedSupply) * iRowHeight);
		}, aFilteredPeriods));
		oRm.attr("fill", this.getRemainCapacityColor());
		oRm.openEnd();
		oRm.close("polygon");
	};

	UtilizationBarChart.prototype.renderConsumptionPolygon = function(oRm, mProp, aFilteredPeriods) {
		oRm.openStart("polygon", this.getId() + "-ubcCP");
		oRm.attr("points", this.getPolygonPoints(mProp, function(oItem, iMaxAllowedSupply){
			var iRowHeight = mProp.height,
				iMaxY = mProp.y + iRowHeight;

			var iValue = Math.min(oItem.getDemand(), oItem.getSupply());
			return iMaxY - ((iValue / iMaxAllowedSupply) * iRowHeight);
		}, aFilteredPeriods));

		oRm.attr("fill", this.getConsumptionColor());
		oRm.openEnd();
		oRm.close("polygon");
	};

	UtilizationBarChart.prototype.renderTooltips = function(oRm, mProp, aFilteredPeriods) {
		var aTooltipRects = [];
		oRm.openStart("g");
		oRm.class("ubc-tooltips").openEnd();
		for (var iIndex = 0; iIndex < aFilteredPeriods.length; iIndex++) {
			var oItem = aFilteredPeriods[iIndex];
			var oNextItem = aFilteredPeriods[iIndex + 1];

			if (oNextItem) {
				var iX1  = this.toX(oItem.getFrom()),
					iX2 = this.toX(oNextItem.getFrom());
				aTooltipRects.push(new BaseRectangle({
					x: parseFloat(iX1),
					y: mProp.y,
					height: mProp.height,
					width: Math.abs(iX2 - iX1),
					fill: "transparent",
					tooltip: oItem.getTooltip()
				}).setProperty("childElement", true));
			}
		}
		aTooltipRects.forEach(function(oRect){
			oRect.renderElement(oRm, oRect);
		});
		oRm.close("g");
	};

	UtilizationBarChart.prototype._getMaxAllowedSupply = function(aFilteredPeriods) {
		var iMaxSupplyValue = Math.max.apply(null, aFilteredPeriods.map(function(oItem){
			return oItem.getSupply();
		}));

		var iMaxExceedCap = iMaxSupplyValue * this.getOverConsumptionMargin() / 100;

		return iMaxSupplyValue + iMaxExceedCap;
	};

	UtilizationBarChart.prototype.getPolygonPoints = function(mProp, fnCalcItemPointY, aFilteredPeriods) {

		var iMaxY = mProp.y + mProp.height; // start y point  + expand row height

		var fnPointString = function(x, y) {
			return [x, y].join(",") + " ";
		};
		var sResult = "";
		for (var iIndex = 0; iIndex < aFilteredPeriods.length; iIndex++) {
			var oItem = aFilteredPeriods[iIndex],
				bFirst = iIndex === 0,
				bLast  = iIndex === aFilteredPeriods.length - 1,
				oNextItem = aFilteredPeriods[bLast ? aFilteredPeriods.length - 1 : iIndex + 1];

			var iStartX = this.toX(oItem.getFrom()),
				iEndX = this.toX(oNextItem.getFrom());

			if (bFirst) {
				sResult += fnPointString(iStartX, iMaxY);
			}

			var iCapacityY = fnCalcItemPointY(oItem, this._iMaxAllowedSupply);
			iCapacityY = iCapacityY.toFixed(1);

			sResult += fnPointString(iStartX, iCapacityY);
			sResult += fnPointString(iEndX, iCapacityY);

			if (bLast) {
				sResult += fnPointString(iStartX, iCapacityY);
				sResult += fnPointString(iStartX, iMaxY);
			}
		}
		return sResult;
	};

	UtilizationBarChart.prototype.getDemandPathD = function(mProp, aFilteredPeriods){

		var sResult = "";
		for (var iIndex = 0; iIndex < aFilteredPeriods.length; iIndex++) {
			var oItem = aFilteredPeriods[iIndex],
				bLast  = iIndex === aFilteredPeriods.length - 1,
				oNextItem = aFilteredPeriods[bLast ? aFilteredPeriods.length - 1 : iIndex + 1];

			var x1 = this.toX(oItem.getFrom()),
				x2 = this.toX(oNextItem.getFrom());

			var y1 = this.toY(oItem.getDemand(), mProp),
				y2 = this.toY(oNextItem.getDemand(), mProp);

			sResult += " M " + x1 + " " + y1 + " L " + x2 + " " + y1;
			sResult += " M " + x2 + " " + y1 + " L " + x2 + " " + y2;
		}
		return sResult;
	};

	UtilizationBarChart.prototype.toY = function(iDemand, mProp) {
		var iStartY = mProp.y,
			iRowHeight = mProp.height,
			iMaxY = iStartY + iRowHeight;
		var y = iMaxY - ((iDemand / this._iMaxAllowedSupply) * iRowHeight);

		y = y < iStartY ? iStartY : y; // ensure y is not outside of UBC
		return parseFloat(y.toFixed(1));
	};

	UtilizationBarChart.prototype._createDefaultDefs = function() {
		// no need to create default background defs if user provide a fill
		// which can remove many DOM elements
		if (this.getFill()){ return; }
		this.mDefaultDefs = new sap.gantt.def.SvgDefs({
			defs: [
				new BackSlashPattern({
					id: this.getId() + "-defaultBgPattern",
					tileWidth: 5,
					tileHeight: 9,
					backgroundColor: "#fff",
					stroke: "#ececec",
					strokeWidth: 1
				})
			]
		});
	};

	UtilizationBarChart.prototype.renderBackgroundDefs = function(oRm) {
		if (this.getFill() == null && this.mDefaultDefs) {
			oRm.unsafeHtml(this.mDefaultDefs.getDefString());
		}
	};

	return UtilizationBarChart;
}, /**bExport*/true);
