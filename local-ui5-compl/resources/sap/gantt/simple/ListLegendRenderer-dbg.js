/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define(["sap/gantt/misc/Utility","./RenderUtils", "sap/gantt/simple/LegendShapeGroupOrientation", "sap/ui/core/IconPool", "sap/gantt/utils/GanttChartConfigurationUtils"],
function (Utility, RenderUtils, LegendShapeGroupOrientation, IconPool, GanttChartConfigurationUtils) {
	"use strict";

	/**
	 * ListLegend renderer.
	 *
	 * @namespace
	 */
	var ListLegendRenderer = {
		apiVersion: 2    // enable in-place DOM patching
	};

	var fnDensityHeight = function() {
		var iDefaultItemLineHeight = 32;
		var sDensity = Utility.findSapUiSizeClass();
		return Utility.scaleBySapUiSize(sDensity, iDefaultItemLineHeight);
	};

	ListLegendRenderer.render = function (oRm, oLegend) {
		oRm.openStart("div", oLegend);
		oRm.attr("role", "listbox");
		oRm.attr("tabindex", -1);
		oRm.openEnd();
		if (oLegend.getParent().isA("sap.gantt.simple.LegendContainer") && oLegend.getParent().getEnableFlatLegends() && !oLegend.getParent()._isSingleVisibleList()) {
			this.renderSubHeader(oRm, oLegend);
		}
		var aItems = oLegend.getItems();
		var bHasInteractiveItem = aItems.some(function(oItem){
			return oItem.getInteractive();
		});
		for (var i = 0; i < aItems.length; i++) {
			if (aItems[i].getVisible()) {
				this.renderLegendItem(oRm, aItems[i], bHasInteractiveItem, i);
			}
		}
		oRm.close("div");
	};

	// Renders title of ListLegend if multiple legends are grouped in single Page.
	ListLegendRenderer.renderSubHeader = function(oRm, oLegend) {
		oRm.openStart("div", oLegend.getId());
			oRm.class("sapGanttLLItemSectionTitle");
			oRm.class("sapUiSmallMarginBegin");
			oRm.class("sapUiSmallMarginTop");
			oRm.openEnd();
			oRm.text(oLegend.getTitle());
			oRm.close("div");
			oRm.voidStart("hr");
			oRm.voidEnd();
	};
	ListLegendRenderer.renderLegendItem = function (oRm, oItem, bHasInteractiveItem, index) {
		// Check if LegendShapeGroup aggregation has been provided by the user
		var bIsLegendGroup = oItem.getAggregation('legendShapeGroup');
		var bIsShape = oItem.getAggregation('shape');
		if (bIsLegendGroup) {
			this.renderShapeGroup(oRm, oItem, bHasInteractiveItem, index);
		} else if (bIsShape) {
			this.renderShape(oRm, oItem, bHasInteractiveItem, index);
		}
	};

	ListLegendRenderer.renderShape = function (oRm, oItem, bHasInteractiveItem, index) {
		var oShape = oItem.getShape();
		var iLineHeight = fnDensityHeight(),
			sLineHeight = iLineHeight + "px";

		var iHeight = iLineHeight / 2,
			iWidth  = iHeight;
		var yBias = oShape.getYBias();
		//Handling BaseConditionalShape in ListLegendItem
		if (oShape.isA("sap.gantt.simple.BaseConditionalShape") && oShape._getActiveShapeElement()) {
			var baseConditionalShape = oShape._getActiveShapeElement();
			var aYBias = baseConditionalShape.getYBias() ? baseConditionalShape.getYBias() : yBias;
			this.normalizeShape(baseConditionalShape, iWidth, iHeight, aYBias);
		} else {
			this.normalizeShape(oShape, iWidth, iHeight, yBias);
		}
		oRm.openStart("div", oItem);
		oRm.attr("title", oShape.getTitle());
		oRm.attr("tabindex", -1);
		oRm.attr("role", "option");
		oRm.attr("aria-posinset", index + 1);
		oRm.class("sapGanttLLItem");

		oRm.style("height", sLineHeight);
		oRm.style("line-height", sLineHeight);
		var sMargin = "margin-" + (GanttChartConfigurationUtils.getRTL() ? "right" : "left");
		if (bHasInteractiveItem && !oItem.getInteractive()) {
			oRm.style(sMargin, sLineHeight);
		} else if (!oItem.getInteractive()){
			oRm.style(sMargin, (iWidth / 2) + "px");
		}
		oRm.openEnd();

		oRm.renderControl(oItem.getAggregation("_checkbox"));

		this.renderSvgPart(oRm, [oShape], iWidth);
		this.renderLegendText(oRm, oShape.getTitle());

		oRm.close("div");
	};

	ListLegendRenderer.renderShapeGroup = function (oRm, oItem, bHasInteractiveItem, index) {
		var oLegendShapeGroup = oItem.getAggregation('legendShapeGroup');
		var aShapes = oLegendShapeGroup.getAggregation('shapes');
		var sOrientation = oLegendShapeGroup.getOrientation();
		var yBias = oLegendShapeGroup.getYBias();
		var sTitle = oLegendShapeGroup.getTitle();
		var iLineHeight = fnDensityHeight(),
			sLineHeight = iLineHeight + "px";

		var iHeight = iLineHeight / 2,
			iWidth = iHeight;

		oRm.openStart("div", oItem);
		oRm.attr("tabindex", -1);
		oRm.attr("role", "option");
		oRm.attr("aria-posinset", index + 1);
		oRm.attr("title", sTitle);
		oRm.class("sapGanttLLItem");

		oRm.style("height", sLineHeight).style("line-height", sLineHeight);

		var sMargin = "margin-" + (GanttChartConfigurationUtils.getRTL() ? "right" : "left");
		if (bHasInteractiveItem && !oItem.getInteractive()) {
			oRm.style(sMargin, sLineHeight);
		} else if (!oItem.getInteractive()) {
			oRm.style(sMargin, (iWidth / 2) + "px");
		}
		oRm.openEnd();

		oRm.renderControl(oItem.getAggregation("_checkbox"));
		aShapes.forEach(function (oSubShape, index) {
			var aYBias = oSubShape.getYBias() ?  oSubShape.getYBias() : yBias;
			this.normalizeShapeGroup(aShapes, oSubShape, sOrientation, iWidth, iHeight, index, aYBias);
		}.bind(this));
		this.renderSvgPart(oRm, aShapes, iWidth);
		this.renderLegendText(oRm, sTitle, true, sLineHeight);
		oRm.close("div");
	};

	ListLegendRenderer.normalizeShapeGroup = function (allShapes, subShape, orientation, iWidth, legendItemHeight, index, yBias) {
		//Handling BaseConditionalShape in ListLegendItem
		if (subShape.isA("sap.gantt.simple.BaseConditionalShape") && subShape._getActiveShapeElement()) {
			var baseConditionalShape = subShape._getActiveShapeElement();
			if (baseConditionalShape.isA('sap.gantt.simple.LegendShapeGroup')) {
				this.normalizeLegendShapeGroup(baseConditionalShape, iWidth, legendItemHeight, yBias);
			} else {
				this.normalizeShape(baseConditionalShape, iWidth, legendItemHeight, yBias);
			}
			return;
        }
		if (subShape.isA('sap.gantt.simple.LegendShapeGroup')){
			this.normalizeLegendShapeGroup(subShape, iWidth, legendItemHeight, yBias);
			return;
		}

		var iHalfHeight = legendItemHeight / 2;
		var iStrokeWidth = subShape.getStrokeWidth() || 0;
		var iY = 0;
		var iX = 0;
		var iX2 = 0;
		var iY2 = 0;
		var aYBais = yBias ? yBias : iHalfHeight;

		// Prepare mValues based on the orientation and previous shape type
		if (orientation === LegendShapeGroupOrientation.Vertical) {
			if (index > 0) {
				if (allShapes[index - 1].isA('sap.gantt.simple.BaseLine')){
					iY = parseFloat(allShapes[index - 1].getStrokeWidth()) + Math.max(parseFloat(allShapes[index - 1].getY1()), parseFloat(allShapes[index - 1].getY2()));
				} else if (allShapes[index - 1].isA('sap.gantt.simple.BaseCursor')){
					iY = allShapes[index - 1].getLength() + (allShapes[index - 1].getRowYCenter() - (iWidth / 4));
				} else if (allShapes[index - 1].isA('sap.gantt.simple.BaseImage')){
					iY = parseFloat(allShapes[index - 1].getY());
				} else if (allShapes[index - 1].isA("sap.gantt.simple.BasePath")){
					iY = 0;
				} else {
					iY = parseFloat(allShapes[index - 1].getHeight()) + parseFloat(allShapes[index - 1].getY());
				}
			}
		} else if (orientation === LegendShapeGroupOrientation.Horizontal){
			if (index > 0){
				if (allShapes[index - 1].isA('sap.gantt.simple.BaseLine')){
					iX = parseFloat(allShapes[index - 1].getStrokeWidth()) + Math.max(parseFloat(allShapes[index - 1].getX1()), parseFloat(allShapes[index - 1].getX2()));
				} else if (allShapes[index - 1].isA('sap.gantt.simple.BaseDiamond')){
					iX = parseFloat(allShapes[index - 1].getWidth()) + parseFloat(allShapes[index - 1].getX());
					iX -= allShapes[index - 1].getWidth() / 2;
				} else if (allShapes[index - 1].isA("sap.gantt.simple.BaseCursor")){
					iX = parseFloat(allShapes[index - 1].getWidth()) + parseFloat(allShapes[index - 1].getX());
					iX -= allShapes[index - 1].getLength();
				} else if (allShapes[index - 1].isA("sap.gantt.simple.BasePath")){
					iX = 0;
				} else {
					iX = parseFloat(allShapes[index - 1].getWidth()) + parseFloat(allShapes[index - 1].getX());
				}
			}
			if (subShape.isA('sap.gantt.simple.BaseCursor')){
				iX += (subShape.getLength() / 2);
			}
		}
		if (subShape.isA('sap.gantt.simple.BaseLine')){
			iX = subShape.getX1();
			iX2 = subShape.getX2();
			iY = subShape.getY1();
			iY2 = subShape.getY2();
		}

		var mValues = {
			x: iX, y: iY, x1: iX, y1: iY, x2: iX2, y2: iY2,
			yBias: aYBais,
			rowYCenter: parseFloat(iY)
		};

		if (subShape.getWidth) {
			if (!subShape.getWidth()) {
				mValues.width = iWidth - 2 * iStrokeWidth;
			} else {
				mValues.width = subShape.getWidth();
			}
		}
		if (subShape.getHeight) {
			if (!subShape.getHeight()) {
				mValues.height = legendItemHeight - 2 * iStrokeWidth;
			} else {
				mValues.height = subShape.getHeight();
			}
		}

		// Calculating attributes based on shape types
		if (subShape.isA("sap.gantt.simple.BaseCursor")){
			if (orientation === LegendShapeGroupOrientation.Horizontal){
				mValues.rowYCenter = parseFloat((subShape.getWidth() + subShape.getPointHeight()) / 2);
			} else if (orientation === LegendShapeGroupOrientation.Vertical) {
				mValues.x = iWidth / 2;
				mValues.rowYCenter = iY + (iWidth / 4);
			}
		} else if (subShape.isA("sap.gantt.simple.BaseDiamond")){
			mValues.x += (mValues.width) / 2;
			if (orientation === LegendShapeGroupOrientation.Vertical) {
				mValues.rowYCenter = iY + (iWidth / 4);
			} else if (orientation === LegendShapeGroupOrientation.Horizontal) {
				mValues.rowYCenter = parseFloat(mValues.height / 2);
			}
		} else if (subShape.isA('sap.gantt.simple.BaseChevron')){
			mValues.rowYCenter = iY + parseFloat(mValues.height / 2);
		} else if (subShape.isA('sap.gantt.simple.BaseImage')){
			if (orientation === LegendShapeGroupOrientation.Vertical){
				mValues.y = iY + parseFloat(mValues.height);
			} else if (orientation === LegendShapeGroupOrientation.Horizontal){
				mValues.y = iY + parseFloat(mValues.height / 2);
			}
		}

		// Setting the calculated values to the shape object
		Object.keys(mValues).forEach(function (prop) {
			var sPropertySetter = prop.split("-").reduce(function (prefix, name) {
				return prefix + name.charAt(0).toUpperCase() + name.slice(1);
			}, "set");
			if (subShape[sPropertySetter]) {
				subShape[sPropertySetter](mValues[prop]);
			}
		});
	};

	ListLegendRenderer.normalizeLegendShapeGroup = function (aLegendShapeGroup, iWidth, legendItemHeight, yBias) {
		var aShapes = aLegendShapeGroup.getAggregation('shapes');
		var sShapeGroupOrientation = aLegendShapeGroup.getOrientation();
		aShapes.forEach(function(oSubShape, index) {
			var aYBias = oSubShape.getYBias() ? oSubShape.getYBias() : yBias;
			this.normalizeShapeGroup(aShapes, oSubShape, sShapeGroupOrientation, iWidth, legendItemHeight, index, aYBias);
		}.bind(this));
	};

	ListLegendRenderer.normalizeShape = function (oShape, iWidth, iHeight, yBias) {
		var iHalfHeight = iHeight / 2;
		var aYBias = yBias ? yBias : iHalfHeight;
		var iStrokeWidth = oShape.getStrokeWidth() || 0;
		var mValues = {
			x: iStrokeWidth, y: iStrokeWidth, x1: iStrokeWidth, y1: iHalfHeight + iStrokeWidth, x2: iWidth, y2: iHalfHeight,
			yBias: aYBias,
			rowYCenter: iHalfHeight
		};
		if (oShape.getWidth) {
			if (!oShape.getWidth()) {
				mValues.width = iWidth - 2 * iStrokeWidth;
			} else {
				mValues.width = oShape.getWidth();
			}
		}
		if (oShape.getHeight) {
			if (!oShape.getHeight()) {
				mValues.height = iHeight - 2 * iStrokeWidth;
			} else {
				mValues.height = oShape.getHeight();
			}
		}

		//Move the X-Cordinate to the right based on the width of the shape.
		if (oShape.isA("sap.gantt.simple.BaseCursor") || oShape.isA("sap.gantt.simple.BaseDiamond")) {
			mValues.x += iWidth / 2;
		}
		//Setting rowYCenter to zero for BaseTriangle to handle misaligment
		if (oShape.isA("sap.gantt.simple.BaseTriangle")) {
			mValues.rowYCenter = 0;
		}
		if (oShape.isA("sap.gantt.simple.shapes.Shape")) {
			oShape.setWidth(iWidth);
			oShape.setHeight(iHeight);
			oShape.setStartX(0);
			oShape.setRowYCenter(iHeight);
		} else {
			Object.keys(mValues).forEach(function(prop){
				var sPropertySetter = prop.split("-").reduce(function(prefix, name){
					return prefix + name.charAt(0).toUpperCase() + name.slice(1);
				}, "set");
				if (oShape[sPropertySetter]) {
					oShape[sPropertySetter](mValues[prop]);
				}
			});
		}
	};

	ListLegendRenderer.renderSvgPart = function(oRm, aShapes, iWidth) {
		oRm.openStart("svg");

		oRm.class("sapGanttLLSvg");

		oRm.style("width", iWidth + "px");
		oRm.openEnd();
		aShapes.forEach(function (oShape) {
			this.renderShapeGroupRecursively(oRm, oShape);
		}.bind(this));

		oRm.close("svg");
	};

	ListLegendRenderer.renderShapeGroupRecursively = function(oRm, oShape) {
		if (oShape.isA('sap.gantt.simple.LegendShapeGroup')){
			this.renderLegendShapeGroup(oShape, oRm);
		} else if (oShape.isA("sap.gantt.simple.BaseConditionalShape") && oShape._getActiveShapeElement()) {
			var baseConditionalShape = oShape._getActiveShapeElement();
			if (baseConditionalShape.isA('sap.gantt.simple.LegendShapeGroup')) {
				this.renderLegendShapeGroup(baseConditionalShape, oRm);
			}
        }
		oRm.openStart("g").openEnd();
		if (oShape.isA('sap.gantt.simple.BaseImage')){
			// Calling custom renderer for Image
			this.renderImage(oRm, oShape);
		} else {
			oShape.renderElement(oRm, oShape);
		}
		oRm.close("g");
	};

	ListLegendRenderer.renderLegendShapeGroup = function(oShape, oRm) {
		var aShapes = oShape.getAggregation('shapes');
		aShapes.forEach(function(oSubShape){
			this.renderShapeGroupRecursively(oRm, oSubShape);
		}.bind(this));
		return;
	};

	ListLegendRenderer.renderLegendText = function(oRm, sText, bIsLegendGroup, sLineHeight) {
		oRm.openStart("div");
		//oRm.attr("tabindex", -1);
		oRm.class("sapGanttLLItemTxt");
		if (bIsLegendGroup) {
			oRm.style("line-height", sLineHeight);
		}
		oRm.openEnd();
		if (sText) {
			oRm.text(sText);
		}
		oRm.close("div");
	};

	ListLegendRenderer.renderImage = function (oRm, oElement) {

		//Check if the provided image is an icon
		if (IconPool.isIconURI(oElement.getSrc())){
			var mAttributes = ["x", "y", "text-anchor", "style", "filter", "transform"];
			oRm.openStart("text", oElement);

			RenderUtils.renderAttributes(oRm, oElement, mAttributes);
			oRm.openEnd();

			var oIconInfo = IconPool.getIconInfo(oElement.getSrc());
			if (oIconInfo) {
				oRm.text(oIconInfo.content);
			}
			oRm.close('text');
		} else {
			var mImageAttributes = ["x", "y", "width", "height"];
			oRm.openStart("image", oElement);
			RenderUtils.renderAttributes(oRm, oElement, mImageAttributes);
			oRm.attr("href", oElement.getProperty("src"));
			oRm.openEnd();

			RenderUtils.renderTooltip(oRm, oElement);

			oRm.close("image");
		}
	};

	return ListLegendRenderer;
}, true);
