/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
], function() {
    "use strict";
    /**
     * @private
     * Provides helper methods for print configurations.
     * @author SAP SE
	 * @version 1.132.0
     * @alias sap.gantt.simple.PrintUtils
     * @since 1.127
     */
    var PrintUtils = {

        /**
         * List of paper configurations.
         * @returns {object} Paper configurations.
         * @private
         */
        _getPaperConfiguarations: function() {
            return {
                "A5": {
                    width: this._mmToPx(148),
                    height: this._mmToPx(210)
                },
                "A4": {
                    width: this._mmToPx(210),
                    height: this._mmToPx(297)
                },
                "A3": {
                    width: this._mmToPx(297),
                    height: this._mmToPx(420)
                },
                "A2": {
                    width: this._mmToPx(420),
                    height: this._mmToPx(594)
                },
                "A1": {
                    width: this._mmToPx(594),
                    height: this._mmToPx(841)
                },
                "A0": {
                    width: this._mmToPx(841),
                    height: this._mmToPx(1189)
                },
                "Letter": {
                    width: this._inToPx(8.5),
                    height: this._inToPx(11)
                },
                "Legal": {
                    width: this._inToPx(8.5),
                    height: this._inToPx(14)
                },
                 "Tabloid": {
                    width: this._inToPx(11),
                    height: this._inToPx(17)
                },
                "Custom": {
                    width: undefined,
                    height: undefined
                }
            };
        },

        /**
         * @param {number} mm - value in milimeter to be converted into pixel.
         * @returns {number} - value in pixel.
         * @private
         */
        _mmToPx: function (mm) {
            return  mm * 3.78;
        },

        /**
         * @param {Number} iIn - value in inches to be converted into pixel.
         * @returns {number} - value in pixel.
         * @private
         */
        _inToPx: function(iIn) {
           return iIn / 0.01042;
        },

        /**
         * @param {number} fPx - value in pixel to be converted into milimeter.
         * @returns {number} - value in milimeter.
         * @private
         */
		_pxToMm: function(fPx) {
			// 1 millimeter = 3.78 pixel
			return fPx / 3.78;
		},

        /**
         * @param {number} fPx - value in pixel to be converted into inches.
         * @returns {number} - value in inches.
         * @private
        */
		_pxToIn: function(fPx) {
			// 1 inch =  pixel 0.01042 pixel
			return fPx * 0.01042;
		},

        /**
         * Converts given value to a pixel based on unit.
         * @param {number} value - The value to be converted.
         * @param {string} unit - The unit of the value.
         * @returns {number} - The converted value in pixels.
         * @private
         */
        _convertUnitToPx: function(value, unit) {
            switch (unit) {
                case "mm":
                    return value * 3.78;
                case "cm":
                    return value * 3.78 * 10;
                case "in":
                    return value / 0.01042;
                default:
                    return undefined;
            }
        },

        /**
         * converts pixel value to given unit.
         * @param {number} fPx - The value to be converted.
         * @param {string} unit - The unit to which the value is to be converted.
         * @returns {number} - The converted value in given unit.
         * @private
         */
		_convertPxToUnit: function (fPx,unit) {
			switch (unit) {
				case "mm":
					return this._pxToMm(fPx);
				case "cm":
					return this._pxToMm(fPx) / 10;
				case "in":
					return this._pxToIn(fPx);
				default:
					return undefined;
			}
		}
    };

    return PrintUtils;

}, /* bExport= */ true);
