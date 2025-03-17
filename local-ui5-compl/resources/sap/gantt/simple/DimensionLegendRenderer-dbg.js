/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/base/util/ObjectPath",
	"sap/gantt/misc/Utility",
	"./BasePath",
	"sap/ui/core/Core",
	"sap/gantt/utils/GanttChartConfigurationUtils"
], function (ObjectPath, Utility, BasePath, Core, GanttChartConfigurationUtils) {
	"use strict";

	/**
	 * DimensionLegend renderer.
	 *
	 * @namespace
	 */
	var DimensionLegendRenderer = {
		apiVersion: 2    // enable in-place DOM patching
	};

	var _iBaseSpace = 10;

	var fnDensityHeight = function() {
		var iDefaultItemLineHeight = 32;
		var sDensity = Utility.findSapUiSizeClass();
		return Utility.scaleBySapUiSize(sDensity, iDefaultItemLineHeight);
	};

	DimensionLegendRenderer.render = function (oRm, oDimensionLegend) {
		oRm.openStart("div", oDimensionLegend);
		oRm.openEnd();

		var ColumnConfigs = oDimensionLegend.getColumnConfigs();
		var RowConfigs = oDimensionLegend.getRowConfigs();
		var aYDimensionRenderItems = [];

		for (var i = 0; i < RowConfigs.length; i++){
			var oYDimensionConfig = RowConfigs[i];
			var mRowConfigData = {};
			mRowConfigData.text = oYDimensionConfig.getText();

			var sShapeClass = oYDimensionConfig.getShapeClass();
			var sShapeName = oYDimensionConfig.getShapeName();
			var sStroke = oYDimensionConfig.getStroke();
			var fStrokeWidth = oYDimensionConfig.getStrokeWidth();
			var CustomerClass = sap.ui.require(sShapeClass.replaceAll(".","/"));

			var aShapeInstances = [];
			for (var l = 0; l < ColumnConfigs.length; l++){
				var sFill = ColumnConfigs[l].getFill();
				if (sFill == null) {
					var fnFillFactory = ColumnConfigs[l].getFillFactory();
					if (typeof fnFillFactory === 'function' ) {
						sFill = fnFillFactory(sShapeName);
					}
				}
				var oShapeInstance = new CustomerClass({
					stroke: sStroke,
					strokeWidth: fStrokeWidth,
					fill: sFill
				});

				aShapeInstances.push(oShapeInstance);
			}

			mRowConfigData.shapeInstances = aShapeInstances;
			aYDimensionRenderItems.push(mRowConfigData);
		}
		this.renderYDimension(oRm, aYDimensionRenderItems);

		var aXDimensionRenderItems = [];
		for (var j = 0; j < ColumnConfigs.length; j++){
			var oColumnConfigData = {};
			oColumnConfigData.text = ColumnConfigs[j].getText();
			aXDimensionRenderItems.push(oColumnConfigData);
		}

		this.renderXDimension(oRm, aXDimensionRenderItems);

		oRm.close("div");
	};

	DimensionLegendRenderer.renderYDimension = function (oRm, aYDimensionRenderItems) {
		for (var k = 0; k < aYDimensionRenderItems.length; k++) {
			this.renderYItems(oRm, aYDimensionRenderItems[k], k);
		}
	};

	DimensionLegendRenderer.renderYItems = function(oRm, oItem, iIndex) {
		var iLineHeight = fnDensityHeight(),
		sLineHeight = iLineHeight + "px";

		var iHeight = iLineHeight / 2,
		iWidth  = iHeight;

		oRm.openStart("div");
		oRm.attr("title", oItem.text);
		oRm.class("sapGanttDLItem");

		oRm.style("height", sLineHeight);
		oRm.style("line-height", sLineHeight);
		oRm.style(this._getMarginStyle(), (iWidth / 2) + "px");
		oRm.openEnd();

		this.renderYSvgPart(oRm, oItem.shapeInstances, iWidth, iHeight);
		this.renderYLegendText(oRm, oItem.text);

		oRm.close("div");
	};

	DimensionLegendRenderer._getMarginStyle = function() {
		var bRTL = GanttChartConfigurationUtils.getRTL();
		return "margin-" + (bRTL ? "right" : "left");
	};

	DimensionLegendRenderer.normalizeShape = function(oShape, iWidth, iHeight, iIndex) {
		var iHalfHeight = iHeight / 2;
		var mValues = {
			x: iIndex * (iWidth + _iBaseSpace) + _iBaseSpace / 2 , y: 0, x1: 0, y1: iHalfHeight, x2: iWidth, y2: iHalfHeight,
			width: iWidth, height: iHeight,
			yBias: iHalfHeight, rowYCenter: iHalfHeight
		};

		//Move the X-Cordinate to the right based on the width of the shape.
		if (oShape.isA("sap.gantt.simple.BaseCursor") || oShape.isA("sap.gantt.simple.BaseDiamond")) {
			mValues.x += iWidth / 2;
		}

		if (oShape.isA("sap.gantt.simple.shapes.Shape")) {
			oShape.setWidth(iWidth);
			oShape.setHeight(iHeight);
			oShape.setStartX(0);
			oShape.setRowYCenter(iHeight);
		} else {
			Object.keys(mValues).forEach(function (prop) {
				var sPropertySetter = prop.split("-").reduce(function (prefix, name) {
					return prefix + name.charAt(0).toUpperCase() + name.slice(1);
				}, "set");
				if (oShape[sPropertySetter]) {
					oShape[sPropertySetter](mValues[prop]);
				}
			});
		}
	};

	DimensionLegendRenderer.renderYSvgPart = function(oRm, aShapeInstances, iWidth, iHeight) {
		oRm.openStart("svg");
		oRm.attr("tabindex", -1);
		oRm.attr("focusable", false);

		oRm.class("sapGanttDLSvg");

		oRm.style("width", (iWidth + _iBaseSpace) * aShapeInstances.length + "px");
		oRm.openEnd();
		for (var i = 0; i < aShapeInstances.length; i++){
			this.normalizeShape(aShapeInstances[i], iWidth, iHeight, i);
			aShapeInstances[i].renderElement(oRm, aShapeInstances[i]);
		}

		oRm.close("svg");
	};

	DimensionLegendRenderer.renderYLegendText = function(oRm, sText) {
		oRm.openStart("div");
		oRm.class("sapGanttDLItemTxt");
		oRm.openEnd();
		if (sText) {
			oRm.text(sText);
		}
		oRm.close("div");
	};

	DimensionLegendRenderer.renderXDimension = function (oRm, aXDimensionRenderItems) {
		var iLength = aXDimensionRenderItems.length;
		var iLineHeight = fnDensityHeight(),
		sLineHeight = iLineHeight + "px";

		var iHeight = iLineHeight / 2,
		iWidth  = iHeight;

		oRm.openStart("div");
		oRm.class("sapGanttDLItem");

		oRm.style("height", sLineHeight * iLength);
		oRm.style("line-height", sLineHeight);
		oRm.style(this._getMarginStyle(), (iWidth / 2) + "px");
		oRm.openEnd();

		//render path
		this.renderXDimensionPath(oRm, aXDimensionRenderItems);
		//render text
		this.renderXDimensionText(oRm, aXDimensionRenderItems);

		oRm.close("div");
	};

	DimensionLegendRenderer.renderXDimensionPath = function (oRm, aRenderItems) {
		var iLength = aRenderItems.length;
		var iLineHeight = fnDensityHeight();

		var iHeight = iLineHeight / 2,
		iWidth  = iHeight;

		oRm.openStart("div");
		oRm.style("height", iLineHeight * iLength + "px");

		var iSVGWidth =  (iLineHeight / 2 + _iBaseSpace) * iLength;
		oRm.style("width", iSVGWidth + "px");
		oRm.style("display", "block");
		oRm.openEnd();

		oRm.openStart("svg");
		oRm.attr("tabindex", -1);
		oRm.attr("focusable", false);
		oRm.attr("width", iSVGWidth + "px");

		oRm.class("sapGanttDLSvg");
		oRm.openEnd();

		var bRTL = GanttChartConfigurationUtils.getRTL();
		for (var i = 0; i < iLength; i++){
			var iStartX = i * (iWidth + _iBaseSpace) + _iBaseSpace / 2 + iWidth / 2;
			var sD = "M" + iStartX + " 0";
			if (bRTL) {
				sD += " v" + ((i + 0.5) * iLineHeight);
				sD += " h" + (-iStartX);
			} else {
				sD += " v" + ((iLength - i - 0.5) * iLineHeight);
				sD += " h" + ((iLineHeight / 2 + _iBaseSpace) * iLength - iStartX);
			}

			var oBasePath = new BasePath({
				d: sD,
				fill: "transparent",
				strokeWidth: 2.5
			}).addStyleClass("sapGanttDimensionLegendPath");
			oBasePath.renderElement(oRm, oBasePath);
		}
		oRm.close("svg");

		oRm.close("div");
	};

	DimensionLegendRenderer.renderXDimensionText = function (oRm, aRenderItems) {
		var iLength = aRenderItems.length;
		var iLineHeight = fnDensityHeight();

		oRm.openStart("div");
		oRm.class("sapGanttDLItemTxt");

		oRm.style("height", iLineHeight * iLength + "px");
		oRm.style("width", "100%");

		oRm.openEnd();

		for (var i = iLength - 1; i >= 0; i--){
			oRm.openStart("div");
			var sDimensionText = aRenderItems[i].text;
			if (sDimensionText) {
				oRm.attr("title", sDimensionText);
			}

			oRm.class("sapGanttDLItemTxt");
			oRm.style("font-style", "italic");
			oRm.style("height", iLineHeight + "px");

			oRm.openEnd();
			if (sDimensionText) {
				oRm.text(aRenderItems[i].text);
			}
			oRm.close("div");
		}

		oRm.close("div");
	};
	return DimensionLegendRenderer;
}, true);
