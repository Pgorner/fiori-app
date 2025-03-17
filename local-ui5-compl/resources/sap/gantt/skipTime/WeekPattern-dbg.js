/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/gantt/skipTime/SkipPattern",
	"./WeeklyDiscontinuousProvider",
	"sap/gantt/misc/Utility",
    "sap/base/i18n/date/TimezoneUtils"
], function (SkipPattern, WeeklyDiscontinuousProvider, Utility, TimezoneUtils) {
	"use strict";

	/**
	 * Creates and initializes a new class for weekly time pattern.
	 *
	 * @param {string} [sId] ID of the new control. The ID is generated automatically if it is not provided.
	 * @param {object} [mSetting] Initial settings for the new control
	 *
	 * @class
	 * Enables the user to define weekly skip pattern.
	 * Non working hours are to be removed for timeLineOptions with innerInterval unit as <code>sap.gantt.config.TimeUnit.day<code>, <code>sap.gantt.config.TimeUnit.hour<code> and <code>sap.gantt.config.TimeUnit.minute<code>
	 *
	 * @extends sap.gantt.skipTime.SkipPattern
	 *
	 * @author SAP SE
	 * @version 1.132.0
	 * @since 1.126
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.skipTime.WeekPattern
	 */

	var WeekPattern = SkipPattern.extend("sap.gantt.skipTime.WeekPattern", /** @lends sap.gantt.skipTime.WeekPattern.prototype */ {
		metadata: {
			library: "sap.gantt",
			defaultAggregation: "dailyIntervals",
			properties: {
				/**
				 * If this property is set to true, week pattern is applied to the gantt chart.
				 * @since 1.126
				 */
				enabled: {type: "boolean", defaultValue: true}
			},
			aggregations: {
				/**
				 * Day-wise non working time. These intervals are going to be skipped for the specified day.
				 * @since 1.126
				 */
				dailyIntervals: {type: "sap.gantt.skipTime.DayInterval", multiple: true, singularName: "dailyInterval"},
				/**
				 * Weekly non working time. This time is going to be skipped for all the days unless dailyIntervals are defined for that day.
				 * @since 1.126
				 */
				weeklyIntervals: {type: "sap.gantt.skipTime.SkipInterval", multiple: true, singularName: "weeklyInterval"}
			}
		}
	});

	var aAllDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

	function formatTime(date, boundary) {
		const [hours, minutes, seconds] = [date.getHours(), date.getMinutes(), date.getSeconds()];

		if (boundary === "SOD" && hours === 0 && minutes === 0 && seconds === 0) {
			return "SOD";
		}

		if (boundary === "EOD" && hours === 23 && minutes === 59 && seconds === 59) {
			return "EOD";
		}

		return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
	}

	function adjustOffset (oDate, iOffset) {
		const timeOffset = oDate.getTime() + iOffset;
		return new Date(timeOffset);
	}

	function setTime(refDate, time) {
		const date = new Date(refDate.getTime());

		if (time === "SOD") {
			date.setHours(0, 0, 0, 0);

			return date;
		}

		if (time === "EOD") {
			date.setHours(23, 59, 59, 999);

			return date;
		}

		const [hour, min, sec] = time.split(':').map(Number);
		date.setHours(hour, min, sec, 0);

		return date;
	}

	function getTotalMilliseconds(date) {
		return date.getHours() * 3600000 + date.getMinutes() * 60000 + date.getSeconds() * 1000;
	}

	/**
	 * Utility method to create both locale and system timezone based weekly patterns
	 * @returns {object} returns the configuration including the formatted patterns and options
	 * @private
	 */
	WeekPattern.prototype._getPatternConfig = function () {
        var oLocalPattern = this._getWeekPattern();
        var oTimezonePattern = null;
        var sTimezone = this._getTimezone();

        if (sTimezone && sTimezone !== TimezoneUtils.getLocalTimezone()) {
			const oTimezoneRange = [];
			oTimezonePattern = {};

			aAllDays.forEach((day, index) => {
				oTimezoneRange[index] = [];
				oTimezonePattern[day] = [];
			});

			const addPattern = (index, startDate, endDate) => {
				oTimezonePattern[aAllDays[index]].push([
					formatTime(startDate, "SOD"),
					formatTime(endDate, "EOD")
				]);
			};

			let refDate = new Date();
			const offsetInfo = Utility.getNonDSTOffsetInfo(sTimezone, refDate);

			// set date to 2, to avoid jumping to secondary DST offset month
			refDate = new Date(refDate.getFullYear(), offsetInfo.month, 2, 0, 0, 0, 0);

            for (let index = 0; index < aAllDays.length; index++) {
                const date = Utility.getNextWeekday(refDate, index);

				for (const [start, end] of oLocalPattern[aAllDays[index]] ?? []) {
					const startDate = adjustOffset(setTime(date, start), offsetInfo.offset);
					const endDate = adjustOffset(setTime(date, end), offsetInfo.offset);

					const startDay = startDate.getDay();
					const endDay = endDate.getDay();

					if (startDay !== endDay) {
						oTimezoneRange[startDay].push(startDate, setTime(startDate, "EOD"));
						oTimezoneRange[endDay].push(setTime(endDate, "SOD"), endDate);
					} else {
						oTimezoneRange[startDay].push(startDate, endDate);
					}
				}
            }

			for (let index = 0; index < aAllDays.length; index++) {
				const dates = oTimezoneRange[index]
					.sort((start, end) => getTotalMilliseconds(start) - getTotalMilliseconds(end));

				for (let i = 0; i < dates.length; i += 2) {
					const currentEnd = dates[i + 1];
					const nextStart = dates[i + 2];
					const endMillisecond = getTotalMilliseconds(currentEnd);

					if (nextStart && getTotalMilliseconds(nextStart) - endMillisecond <= 1000) {
						addPattern(index, dates[i], dates[i + 3]);
						i += 2;
					} else if (endMillisecond - getTotalMilliseconds(dates[i]) >= 1000){
						addPattern(index, dates[i], currentEnd);
					}
				}
			}
		}

		return {
			pattern: oTimezonePattern || oLocalPattern,
			localPattern: oLocalPattern
		};
	};

	/**
	 * Utility method to format the time slices to d3fc supported value
	 * @returns {object} returns the formatted start and end pair
	 * @private
	 */
	WeekPattern.prototype._getWeekPattern = function () {
		var oWeeklyPattern = {};
		var aDailyInterval = this.getDailyIntervals();
		var aWeeklyInterval = this.getWeeklyIntervals();

		if (aWeeklyInterval && aWeeklyInterval.length > 0) {
			var aSkipWeekly = [];

			aWeeklyInterval.forEach(function (oWeeklyInterval) {
				aSkipWeekly.push(oWeeklyInterval._getFormattedTime());
			});

			aAllDays.forEach(function (sDay) {
				oWeeklyPattern[sDay] = aSkipWeekly;
			});
		}

		aDailyInterval.forEach(function (oDayInterval) {
			var oDailyInterval = oDayInterval._getFormattedSkipIntervals();
			if (oDailyInterval.length) {
				oWeeklyPattern[oDayInterval.getDay()] = oDayInterval._getFormattedSkipIntervals();
			}
		});

		return oWeeklyPattern;
	};

	/**
	 * Utility method to calculate the discontinuity provider for the week pattern
	 * @returns {object} returns the discontinuity provider of the week pattern
	 * @public
	 */
	WeekPattern.prototype.getDiscontinuityProvider = function () {
		if (this.getEnabled()) {
			var patternConfig = this._getPatternConfig();
			return Object.keys(patternConfig.pattern).length === 0 ? null : WeeklyDiscontinuousProvider.providers.weeklyPattern(patternConfig);
		}
		return null;
	};
	/**

	 * Method to enable or disable the week pattern
	 * @param {boolean} bEnable flag to enable or disable the week pattern
	 * @public
	 */
	WeekPattern.prototype.setEnabled = function (bEnable) {
		this.setProperty("enabled", bEnable, true);
		this.updateDiscontinuousProvider(this.getDiscontinuityProvider());
	};

	/**
	 * @param {object} oLocale locale value to set
	 * @private
	 */
	WeekPattern.prototype.setLocale = function (oLocale) {
		if (this._oLocale !== oLocale) {
			this._setTimezone(oLocale.getTimeZone());

			if (!this._oLocaleDelegate) {
				this._oLocaleDelegate = {
					"onTimezoneChanged": () => {
						this._setTimezone(oLocale.getTimeZone());
					}
				};
			}

			oLocale.addDelegate(this._oLocaleDelegate);
		}

		SkipPattern.prototype.setLocale.apply(this, arguments);
	};

	/**
     * @private
     */
    WeekPattern.prototype.exit = function () {
        const oLocale = this.getLocale();

        if (this._oLocaleDelegate && oLocale) {
            oLocale.removeDelegate(this._oLocaleDelegate);
        }

        SkipPattern.prototype.exit.apply(this, arguments);
    };

    /**
     * @returns {object} cloned instance
     * @private
     */
    WeekPattern.prototype.clone = function () {
		const oLocale = this.getLocale();

		if (this._oLocaleDelegate && oLocale) {
			oLocale.removeDelegate(this._oLocaleDelegate);
		}

		const clone = SkipPattern.prototype.clone.apply(this, arguments);

		if (oLocale) {
			clone.setLocale(oLocale);
		}

		return clone;
    };

	return WeekPattern;
});
