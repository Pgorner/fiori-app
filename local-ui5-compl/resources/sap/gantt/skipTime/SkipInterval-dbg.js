/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/core/Element"
], function (Element) {
	"use strict";

	/**
	 * Creates and initializes a new class for skip interval.
	 *
	 * @param {string} [sId] ID of the new control. The ID is generated automatically if it is not provided.
	 * @param {object} [mSetting] Initial settings for the new control
	 *
	 * @class
	 * Enables the user to define skip time interval.
	 *
	 * @extends sap.ui.core.Element
	 *
	 * @author SAP SE
	 * @version 1.132.0
	 * @since 1.126
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.skipTime.SkipInterval
	 */

	var SkipInterval = Element.extend("sap.gantt.skipTime.SkipInterval", /** @lends sap.gantt.skipTime.SkipInterval.prototype */ {
		metadata: {
			library: "sap.gantt",
			properties: {
				/**
				 * Start time with in a day from which time is to be skipped. Format: HHMMSS.
				 * @since 1.126
				 */
				startTime: { type: "string", group: "Misc", defaultValue: "000000" },

				/**
				 * End time with in a day till which time is to be skipped. Format: HHMMSS.
				 * @since 1.126
				 */
				endTime: { type: "string", group: "Misc", defaultValue: "235959" }
			}
		}
	});

    // Constants for the default and short time patterns representing the start and end of the day:
    // - START_OF_DAY: Full time format "HHmmss" for the beginning of the day (00:00:00).
    // - SHORT_START_OF_DAY: Shorter time format "HHmm" for the beginning of the day (00:00).
    // - END_OF_DAY: Full time format "HHmmss" for the end of the day (23:59:59).
    // - SHORT_END_OF_DAY: Shorter time format "HHmm" for the end of the day (23:59).
	var START_OF_DAY = "000000";
	var SHORT_START_OF_DAY = "0000";
	var END_OF_DAY = "235959";
	var SHORT_END_OF_DAY = "2359";

	/**
	 * Utility method to format the time slices to d3fc supported value
	 * @returns {Array} returns the formatted start and end pair
	 * @private
	 */
	SkipInterval.prototype._getFormattedTime = function () {
		var sStartTime = this.getStartTime();
		var sEndTime = this.getEndTime();

		if (sStartTime === START_OF_DAY || sStartTime.slice(0, 4) === SHORT_START_OF_DAY) {
			sStartTime = "SOD";
		} else {
			sStartTime = sStartTime.slice(0, 2) + ":" + sStartTime.slice(2, 4) + ":" + (sStartTime.slice(4, 6) || "00");
		}

		if (sEndTime === END_OF_DAY || sEndTime.slice(0, 4) === SHORT_END_OF_DAY) {
			sEndTime = "EOD";
		} else {
			sEndTime = sEndTime.slice(0, 2) + ":" + sEndTime.slice(2, 4) + ":" + (sEndTime.slice(4, 6) || "00");
		}

		return [sStartTime, sEndTime];
	};

	return SkipInterval;
});
