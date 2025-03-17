/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/base/Log", "./BaseRectangle", "./BasePath", "./RenderUtils", "sap/gantt/library", "sap/gantt/misc/Utility"
], function(Log, BaseRectangle, BasePath, RenderUtils, library, Utility) {
	"use strict";
	var ShapeAlignment = library.simple.shapes.ShapeAlignment;
	/**
	 * Creates and initializes a new Cursor class.
	 *
	 * @param {string} [sId] ID of the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings of the new control
	 *
	 * @class
	 * This class usually represents a transient shape
	 *
	 * @extends sap.gantt.simple.BaseRectangle
	 *
	 * @author SAP SE
	 * @version 1.132.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.BaseCursor
	 */
	var BaseCursor = BaseRectangle.extend("sap.gantt.simple.BaseCursor", /** @lends sap.gantt.simple.BaseCursor.prototype */ {
		metadata: {
			library: "sap.gantt",
			properties: {
				/**
				 * The horizontal length of a cursor. This property influences generated value <code>d</code>.
				 */
				length: {
					type: "float",
					defaultValue: 10
				},

				/**
				 * The vertical size minus the point size of a cursor. This property influences generated value <code>d</code>.
				 */
				width: {
					type: "float",
					defaultValue: 5
				},

				/**
				 * The point size of a cursor. This property influences generated value <code>d</code>.
				 */
				pointHeight: {
					type: "float",
					defaultValue: 5
				}
			}
		}
	});

	/**
	 * Gets the value of property <code>d</code>.
	 *
	 * @return {string} attribute <code>d</code> value for Cursor
	 * @private
	 */
	BaseCursor.prototype.getD = function() {
		var sD;
		var nPointHeight = this.getPointHeight();
		var nWidth = this.getWidth();
		var nLength = this.getLength();
		var nHalflength = nLength / 2;

		var aCenter = this._getCenter();

		if (this._isPropertiesValid(nPointHeight, nWidth, nLength,nHalflength)) {
			sD = ["M " , aCenter.join(" ") ,
				" m " , -nHalflength , " " , -(nWidth + nPointHeight) / 2 ,
				" l " , nLength , " 0 l 0 " , nWidth , " l -" , nHalflength ,
				" " , nPointHeight , " l -" , nHalflength , " -" , nPointHeight , " z"].join("");
		}

		if (RenderUtils.isValidD(sD)) {
			return sD;
		} else {
			Log.warning("Cursor shape generated invalid d: " + sD);
			return null;
		}
	};

	BaseCursor.prototype._getCenter = function () {
		var nX = BaseRectangle.prototype.getX.apply(this, arguments),
		nY = this.getRowYCenter(),
		iRowStrokeDensity = 1;
		//Alignment of Shape on the Y Axis based on AlignShape
		if (this._iBaseRowHeight != undefined) {
			if (this.getAlignShape() == ShapeAlignment.Top) {
				nY = this.getRowYCenter() - (this._iBaseRowHeight / 2) + (this.getLength() / 2) + iRowStrokeDensity;
			} else if ( this.getAlignShape() == ShapeAlignment.Bottom) {
				nY = this.getRowYCenter() + (this._iBaseRowHeight / 2) - (this.getLength() / 2) - iRowStrokeDensity;
			}
			nY = parseInt(nY);
		}

		return [nX, nY];
	};

	BaseCursor.prototype._isPropertiesValid = function (nPointHeight, nWidth, nLength,nHalflength) {
		return Utility.isNumeric(nPointHeight) &&
				Utility.isNumeric(nWidth) &&
				Utility.isNumeric(nLength) &&
				Utility.isNumeric(nHalflength);
	};

	BaseCursor.prototype.renderElement = function () {
		if (this._isValid()) {
			BasePath.prototype.renderElement.apply(this, arguments);
		}
	};

	return BaseCursor;
}, true);
