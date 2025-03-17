/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"./Shape",
	"sap/gantt/library",
	"sap/gantt/simple/InnerGanttChartRenderer",
	"sap/gantt/simple/RenderUtils"
], function (Shape, library, InnerGanttChartRenderer, RenderUtils) {
	"use strict";

	var TaskType = library.simple.shapes.TaskType;

	var ShapeAlignment = library.simple.shapes.ShapeAlignment;

	var COMPLEX_SHAPE_MIN_WIDTH = 10;

	function generateOverlappingSettings(mSettings) {
		var mOverlappingSettings = Object.assign({}, mSettings);
		mOverlappingSettings.iStartX -= 1;
		mOverlappingSettings.iEndX += 1;
		mOverlappingSettings.iHeight += 2;
		return mOverlappingSettings;
	}

	/**
	 * Creates and initializes a new Task class.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSetting] Initial settings for the new control
	 *
	 * @class
	 * A shape representing one task.
	 *
	 * @extends sap.gantt.simple.shapes.Shape
	 *
	 * @author SAP SE
	 * @version 1.132.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.shapes.Task
	 * @since 1.69
	 */
	var Task = Shape.extend("sap.gantt.simple.shapes.Task", {
		metadata: {
			library: "sap.gantt",
			properties: {
				/**
				 * Type of the task.
				 */
				type: {type: "sap.gantt.simple.shapes.TaskType", defaultValue: TaskType.Normal},
				/**
				 * Position of utilisation information.
				 */
				utilizationDown: {type: "boolean", defaultValue: true},
				/**
				 * Title used for legend.
				 */
				title: {type: "string", defaultValue: null},
				/**
				 * Alignment of the shape representing a task.
				 */
				alignShape: {type: "sap.gantt.simple.shapes.ShapeAlignment", defaultValue: ShapeAlignment.Middle}
			}
		},
		renderer: {
			apiVersion: 2    // enable in-place DOM patching
		}
	});

	Task.prototype._generateRectD = function (mSettings) {
		var sD = "";
		sD += "M " + mSettings.iStartX + " " + mSettings.iAlignShapeY;
		var iUp = mSettings.iHeight / 2,
			iLen = mSettings.iEndX - mSettings.iStartX,
			iRadius = this.generateArcRadius(iUp, iLen);
		sD += " l 0 " + (-iUp + iRadius);
		sD += " a " + iRadius + " " + iRadius + " 0 0 1 " + iRadius + " " + (-iRadius);
		iLen -= iRadius;
		var iRadius2 = this.generateArcRadius(iLen - iRadius, iUp);
		iLen -= iRadius2;
		sD += " l " + iLen + " 0";
		sD += " a " + iRadius2 + " " + iRadius2 + " 0 0 1 " + iRadius2 + " " + iRadius2;
		sD += " l 0 " + (2 * iUp - iRadius2 - iRadius);
		sD += " a " + iRadius2 + " " + iRadius2 + " 0 0 1 " + (-iRadius2) + " " + iRadius2;
		sD += " l " + (-iLen) + " 0";
		sD += " a " + iRadius + " " + iRadius + " 0 0 1 " + (-iRadius) + " " + (-iRadius);
		sD += " Z";
		return sD;
	};

	Task.prototype._renderOverlappingRectangle = function (oRm, mSettings) {
		var sD = this._generateRectD(generateOverlappingSettings(mSettings));
		oRm.openStart("path");
		oRm.class("sapGanttShapeOverlappingBorder");
		oRm.attr("d", sD);
		oRm.openEnd().close("path");
	};

	Task.prototype.renderNoramlTask = function (oRm, mSettings) {
		this._renderOverlappingRectangle(oRm, mSettings);
		var sD = this._generateRectD(mSettings);
		oRm.openStart("path");
		oRm.attr("d", sD);
		if (this.getHoverState()) {
			oRm.attr("fill", this.getHoverBackgroundColor());
			oRm.attr("stroke-width", 1);
			oRm.attr("stroke", this.getHoverColor());
		} else if (this.getSelected()) {
			oRm.attr("fill", this.getSelectedColor());
		} else {
			oRm.attr("fill", this.getTranslatedColor());
		}
		oRm.openEnd();
		RenderUtils.renderTooltip(oRm, this);
		if (this.getShowAnimation()) {
			RenderUtils.renderElementAnimation(oRm, this);
		}
		oRm.close("path");
	};

	Task.prototype._generateSummaryD = function (mSettings, bForShadow) {
		var sD = "",iLineWidth = bForShadow ? 7 : 5;
		sD += "M " + mSettings.iStartX + " " + mSettings.iAlignShapeY;
		var iUp = mSettings.iHeight / 2,
			iLen = mSettings.iEndX - mSettings.iStartX,
			iRadius = this.generateArcRadius(iUp, iLen);
		sD += " l 0 " + (-iUp + iRadius);
		sD += " a " + iRadius + " " + iRadius + " 0 0 1 " + iRadius + " " + (-iRadius);
		iLen -= iRadius;
		var iRadius2 = this.generateArcRadius(iLen - iRadius, iUp);
		iLen -= iRadius2;
		sD += " l " + iLen + " 0";
		sD += " a " + iRadius2 + " " + iRadius2 + " 0 0 1 " + iRadius2 + " " + iRadius2;
		sD += " l 0 " + (2 * iUp - iRadius2 - 3);
		sD += " a 3 5 0 0 1 -" + iLineWidth + " 0";
		sD += " l 0 " + (-2 * iUp + iRadius2 + iLineWidth);
		sD += " l " + (-iLen + 2 * iLineWidth - iRadius - iRadius2) + " 0";
		sD += " l 0 " + (2 * iUp - iRadius - iLineWidth);
		sD += " a 3 5 0 0 1 -" + iLineWidth + " 0";
		sD += " Z";
		return sD;
	};

	Task.prototype.renderSummaryTaskExpanded = function (oRm, mSettings) {
		if (Math.abs(mSettings.iEndX - mSettings.iStartX) <= COMPLEX_SHAPE_MIN_WIDTH) {
			this.renderNoramlTask(oRm, mSettings);
		} else {
			var sD;
			if (!mSettings.bFromCollapsed) {
				sD = this._generateSummaryD(generateOverlappingSettings(mSettings), true);
				oRm.openStart("path");
				oRm.class("sapGanttShapeOverlappingBorder");
				oRm.attr("d", sD);
				oRm.openEnd().close("path");
			}
			sD = this._generateSummaryD(mSettings);
			oRm.openStart("path");
			oRm.attr("d", sD);
			if (this.getHoverState()) {
				oRm.attr("fill", this.getHoverBackgroundColor());
				oRm.attr("stroke-width", 1);
				oRm.attr("stroke", this.getHoverColor());
			} else if (this.getSelected()) {
				oRm.attr("fill", this.getSelectedColor());
				if (mSettings.bFromCollapsed) {
					oRm.attr("stroke-width", 1.0001);
					oRm.attr("stroke", "white");
					oRm.attr("shape-rendering", "crispEdges");
				}
			} else {
				oRm.attr("fill", this.getTranslatedColor());
			}
			oRm.openEnd();
			RenderUtils.renderTooltip(oRm, this);
			if (this.getShowAnimation()) {
				RenderUtils.renderElementAnimation(oRm, this);
			}
			oRm.close("path");
		}
	};

	Task.prototype.renderSummaryTaskCollapsed = function (oRm, mSettings) {
		if (Math.abs(mSettings.iEndX - mSettings.iStartX) <= COMPLEX_SHAPE_MIN_WIDTH) {
			this.renderNoramlTask(oRm, mSettings);
		} else {
			this._renderOverlappingRectangle(oRm, mSettings);
			var sD = this._generateRectD(mSettings);
			oRm.openStart("path");
			oRm.attr("d", sD);
			if (this.getHoverState()) {
				oRm.attr("fill", this.getHoverBackgroundColor());
				oRm.attr("stroke-width", 1);
				oRm.attr("stroke", this.getHoverColor());
			} else if (this.getSelected()) {
				oRm.attr("fill", this.getSelectedColor());
			} else {
				oRm.attr("fill", this.getTranslatedColor());
				oRm.attr("fill-opacity", 0.7);
			}
			oRm.openEnd();
			RenderUtils.renderTooltip(oRm, this);
			if (this.getShowAnimation()) {
				RenderUtils.renderElementAnimation(oRm, this);
			}
			oRm.close("path");
			this.renderSummaryTaskExpanded(oRm, Object.assign({}, mSettings, {bFromCollapsed: true}));
		}
	};

	Task.prototype.renderErrorTask = function (oRm, mSettings) {
		this._renderOverlappingRectangle(oRm, mSettings);
		var sMaskId = this.getId() + "-mask",
			sD = this._generateRectD(mSettings),
			sStrokeColor,
			sFillColor,
			sPatternMask;
		if (this.getGanttChartBase()) {
			sPatternMask = this.getGanttChartBase().getId() + "-helperDef-linePattern";
		} else {
			InnerGanttChartRenderer.renderHelperDefs(oRm, this.getId());
			sPatternMask = this.getId() + "-helperDef-linePattern";
		}
		if (this.getHoverState()) {
			sStrokeColor = this.getHoverColor();
			sFillColor = this.getHoverBackgroundColor();
		} else if (this.getSelected()) {
			sStrokeColor = sFillColor = this.getSelectedColor();
		} else {
			sStrokeColor = sFillColor = this.getTranslatedColor();
		}
		oRm.openStart("mask", sMaskId);
		oRm.openEnd();
		oRm.openStart("path");
		oRm.attr("d", sD);
		oRm.attr("stroke", "white");
		oRm.attr("stroke-width", 1);
		oRm.attr("fill", "url(#" + sPatternMask + ")");
		oRm.openEnd().close("path");
		oRm.close("mask");
		oRm.openStart("path");
		oRm.attr("d", sD);
		oRm.attr("stroke", sStrokeColor);
		oRm.attr("stroke-width", 1);
		oRm.attr("fill", sFillColor);
		oRm.attr("mask", "url(#" + sMaskId + ")");
		oRm.openEnd();
		RenderUtils.renderTooltip(oRm, this);
		if (this.getShowAnimation()) {
			RenderUtils.renderElementAnimation(oRm, this);
		}
		oRm.close("path");
	};

	Task.prototype.renderContent = function (oRm) {
		var mSettings = {
			iHeight: this.getPixelHeight() - this.getRowPadding(),
			iStartX: this.getXStart(),
			iEndX: this.getXEnd(),
			iAlignShapeY: this.getRowYCenter() //Set Default Task Allignment to RowCenter
		};
		switch (this.getType()) {
			case TaskType.Normal:
				this.renderNoramlTask(oRm, mSettings);
				break;
			case TaskType.Error:
				this.renderErrorTask(oRm, mSettings);
				break;
			case TaskType.SummaryCollapsed:
				this._generateAlignShapeX(mSettings);
				this.renderSummaryTaskCollapsed(oRm, mSettings);
				break;
			case TaskType.SummaryExpanded:
				this._generateAlignShapeX(mSettings);
				this.renderSummaryTaskExpanded(oRm, mSettings);
				break;
			default:
				throw new Error("Unknown type of Task: " + this.getType());
		}
	};

	Task.prototype.renderElement = function (oRm) {
		this.writeElementData(oRm, "g", true);
		oRm.attr("pointer-events", "bounding-box");
		oRm.openEnd();
		this.renderContent(oRm);
		oRm.close("g");
	};

	//Function to calculate X-Cordinate of the Task based on allignShape property for SumamryCollapsed/SummaryExpanded
	Task.prototype._generateAlignShapeX = function(mSettings){
		if (this._iBaseRowHeight != undefined) {
			if (this.getAlignShape() == ShapeAlignment.Top) {
				mSettings.iAlignShapeY = this.getRowYCenter() - (this._iBaseRowHeight / 2) + (mSettings.iHeight / 2);
			} else if ( this.getAlignShape() == ShapeAlignment.Bottom) {
				mSettings.iAlignShapeY = this.getRowYCenter() + (this._iBaseRowHeight / 2) - (mSettings.iHeight / 2);
			}
		}
	};

	return Task;
});
