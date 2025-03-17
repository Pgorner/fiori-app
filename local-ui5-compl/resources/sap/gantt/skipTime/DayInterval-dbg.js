/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/core/Element"
], function (Element) {
	"use strict";
	/**
	 * Creates and initializes a new class for day interval.
	 *
	 * @param {string} [sId] ID of the new control. The ID is generated automatically if it is not provided.
	 * @param {object} [mSetting] Initial settings for the new control
	 *
	 * @class
	 * Enables the user to define skip time pattern within a day.
	 *
	 * @extends sap.ui.core.Element
	 *
	 * @author SAP SE
	 * @version 1.132.0
	 * @since 1.126
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.skipTime.DayInterval
	 */
	var DayInterval = Element.extend("sap.gantt.skipTime.DayInterval", /** @lends sap.gantt.skipTime.DayInterval.prototype */ {
		metadata: {
			library: "sap.gantt",
			defaultAggregation: "skipIntervals",
			properties: {
				/**
				 * Non-working day, supported values: "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
				 * @since 1.126
				 */
				day: {type: "string"}
			},
			aggregations: {
				/**
				 * Time intervals to be skipped for the day.
				 * @since 1.126
				 */
				skipIntervals: {type: "sap.gantt.skipTime.SkipInterval", multiple: true, singularName: "skipInterval"}
			}
		}
	});

	/**
	 * Utility method to format skip intervals
	 * @returns {Array} returns array of formatted skip intervals
	 * @private
	 */
	DayInterval.prototype._getFormattedSkipIntervals = function () {
		return this.getSkipIntervals().map(function (oInterval) {
			return oInterval._getFormattedTime();
		});
	};

	return DayInterval;
});
