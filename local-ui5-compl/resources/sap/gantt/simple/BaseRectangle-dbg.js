/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"./BaseShape", "./RenderUtils", "./GanttUtils", "../misc/Format", "../misc/Utility", "../library", "./BaseText"
], function (BaseShape, RenderUtils, GanttUtils, Format, Utility, library, BaseText) {
	"use strict";
	var ShapeAlignment = library.simple.shapes.ShapeAlignment;

	/**
	 * Creates and initializes a new BaseRectangle class.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * BaseRectangle represent a basic shape that creates rectangles, defined by corner positions, width and height.
	 * The rectangle may have their corners rounded.
	 *
	 * @extends sap.gantt.simple.BaseShape
	 *
	 * @author SAP SE
	 * @version 1.132.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.BaseRectangle
	 */
	var BaseRectangle = BaseShape.extend("sap.gantt.simple.BaseRectangle", {
		metadata: {
			library: "sap.gantt",
			properties: {
				/**
				 * x defines a x-axis coordinate in the user coordinate system
				 */
				x: {type: "sap.gantt.SVGLength"},

				/**
				 * defines a y-axis coordinate in the user coordinate system
				 */
				y: {type: "sap.gantt.SVGLength"},

				/**
				 * width defines the horizontal length of the rectangle.
				 * Most of time it's calculated by properties <code>time</code> and <code>endTime</code> automatically
				 */
				width: {type: "sap.gantt.SVGLength"},

				/**
				 * height defines the vertical length of the rectangle.
				 *
				 * By default, the system automatically generates the shape height according to the base row height. You can set the height yourself by using the setter method. However, it cannot exceed the row height.
				 */
				height: {type: "sap.gantt.SVGLength", defaultValue: "auto"},

				/**
				 * rx defines a radius on the x-axis.
				 */
				rx: {type: "sap.gantt.SVGLength", group: "Appearance", defaultValue: 0},

				/**
				 * ry defines a radius on the y-axis.
				 */
				ry: {type: "sap.gantt.SVGLength", group: "Appearance", defaultValue: 0}
			}
		},
		renderer: {
			apiVersion: 2    // enable in-place DOM patching
		}
	});

	var mAttributes = ["x", "y", "width", "height", "style", "rx", "ry", "filter", "opacity", "transform"];

	/**
	 * Gets the value of property <code>x</code>.
	 *
	 * <p>
	 * x coordinate of the top-left corner of the rectangle.
	 *
	 * Usually applications do not set this value. This getter carries out the calculation using property <code>time</code> as a base.
	 * </p>
	 *
	 * @return {number} Value of property <code>x</code>.
	 * @public
	 */
	BaseRectangle.prototype.getX = function () {
		return GanttUtils.getValueX(this);
	};

	/**
	 * Gets the value of property <code>y</code>.
	 *
	 * y coordinate of the top-left corner of the rectangle.
	 *
	 * Usually applications do not set this value. This getter carries out the calculation based on the row height
	 * and uses <code>height</code> value to position the rectangle in the row center.
	 *
	 * @return {number} Value of property <code>y</code>.
	 * @public
	 */
	BaseRectangle.prototype.getY = function () {
		var y = this.getProperty("y"),
			iRowStrokeDensity = 1;
		if (y === null || y === undefined) {
			//Alignment of Shape on the Y Axis based on AlignShape
			var iHeight = Number(this.getHeight());
			y = Math.round(this.getRowYCenter()) - (iHeight / 2);
			if (this._iBaseRowHeight != undefined) {
				if (this.getAlignShape() == ShapeAlignment.Top) {
					y = this.getRowYCenter() - (this._iBaseRowHeight / 2) + iRowStrokeDensity;
				} else if ( this.getAlignShape() == ShapeAlignment.Bottom) {
					y = this.getRowYCenter() + (this._iBaseRowHeight / 2) - (iHeight) - iRowStrokeDensity;
				}
				y = parseInt(y);
			}
		}
		return y;
	};

	/**
	 * Gets the value of property <code>width</code>.
	 *
	 * Width of the rectangle.
	 *
	 * Usually applications do not set this value. This getter carries out the calculation using properties <code>time</code> and
	 * <code>endTime</code>
	 *
	 * @return {number} Value of property <code>width</code>.
	 * @public
	 */
	BaseRectangle.prototype.getWidth = function () {
        var iWidth = this.getProperty("width"),
        oGantt = this.getGanttChartBase(),iZoomRate,iStartTime,iEndTime,iTimeDiff,viewOffset,viewRange;
		if (iWidth !== null && iWidth !== undefined) { return iWidth; }
        var aInputKeys, shapeWidthMap;

		var oAxisTime = this.getAxisTime();
        if (oAxisTime == null) { return 0; }

        if (oGantt && this.getTime() && this.getEndTime()) {
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

            // check cache first
            var shapeWidthValue = shapeWidthMap.getValue(iZoomRate,iTimeDiff,viewOffset,viewRange);
            if (shapeWidthValue !== undefined) {
                // cache hit
                return shapeWidthValue;
            }
			aInputKeys = [iZoomRate,iTimeDiff,viewOffset,viewRange];
        }

        var nRetVal,
            startTime = oAxisTime.timeToView(Format.abapTimestampToDate(this.getTime())),
            endTime = oAxisTime.timeToView(Format.abapTimestampToDate(this.getEndTime()));

        //if nRetVal is not numeric, return itself
        if (!Utility.isNumeric(startTime) || !Utility.isNumeric(endTime)) {
            return 0;
        }

        nRetVal = Math.abs(endTime - startTime);

        // set minimum width 1 to at least make the shape visible
        nRetVal = nRetVal < 1 ? 1 : nRetVal;

        if (shapeWidthMap) {
            shapeWidthMap.add(aInputKeys,nRetVal);
        }
        return nRetVal;
    };

	/**
	 * Gets the value of property <code>height</code>.
	 *
	 * If property height set to "auto", then the height is automatically calculated based on the row height.
	 *
	 * @return {number} Value of property <code>width</code>.
	 * @public
	 */
	BaseRectangle.prototype.getHeight = function() {
		var vHeight = this.getProperty("height");

		if (vHeight === "auto") {
			// Greatest Common Factor 0.625
			var nRetVal = parseFloat(this._iBaseRowHeight * 0.625, 10);
			return nRetVal;
		}

		if (vHeight === "inherit") {
			return this._iBaseRowHeight;
		}
		return vHeight;
	};

	BaseRectangle.prototype.getStyle = function() {
		var sInheritedStyle = BaseShape.prototype.getStyle.apply(this, arguments);
		var oStyles = {
			"fill": this.determineValueColor(this.getFill()),
			"stroke-dasharray": this.getStrokeDasharray(),
			"fill-opacity": this.getFillOpacity(),
			"stroke-opacity": this.getStrokeOpacity()
		};
		return sInheritedStyle + this.getInlineStyle(oStyles);
	};

	BaseRectangle.prototype._isValid = function () {
		var x = this.getX();
		return x !== undefined && x !== null;
	};

	BaseRectangle.prototype.renderElement = function (oRm, oElement) {
		if (!this._isValid()) {
			return;
		}

		this.writeElementData(oRm, "rect", true);
		if (this.aCustomStyleClasses) {
			this.aCustomStyleClasses.forEach(function(sClass){
				oRm.class(sClass);
			});
		}
		RenderUtils.renderAttributes(oRm, oElement, mAttributes);

		oRm.openEnd();
		RenderUtils.renderTooltip(oRm, oElement);
		if (this.getShowAnimation()) {
			RenderUtils.renderElementAnimation(oRm, oElement);
		}
		oRm.close("rect");

		// if title had been set, then display in middle of the rectangle
		if (!oElement.isA("sap.gantt.simple.BaseCalendar") && this.getShowTitle()) {
			RenderUtils.renderElementTitle(oRm, oElement, function (mTextSettings) {
				return new BaseText(mTextSettings);
			});
		}

		BaseShape.prototype.renderElement.apply(this, arguments);
	};

	BaseRectangle.prototype.getShapeAnchors = function () {
		var mBias = Utility.getShapeBias(this);
		var oBBox = this.getDomRef().getBBox();
		var leftAnchorPosition = this.getLeftAnchorPosition() / 100,
			rightAnchorPosition = this.getRightAnchorPosition() / 100;

		return {
			head: {
				x: oBBox.x + mBias.x,
				y: oBBox.y + this.getHeight() * leftAnchorPosition  + mBias.y,  //Change Shape Anchor position based on AlignShape
				dx: 0,
				dy: this.getHeight() * leftAnchorPosition
			},
			tail: {
				x: oBBox.x + this.getWidth() + mBias.x,
				y: oBBox.y + this.getHeight() * rightAnchorPosition + mBias.y,  //Change Shape Anchor position based on AlignShape
				dx: 0,
				dy: this.getHeight() * rightAnchorPosition
			}
		};
	};

	return BaseRectangle;
}, true);
