/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([], function () {
	'use strict';

	var createDiscontinuityProvider = function(pattern) {
		const instance = window.fc.discontinuitySkipWeeklyPattern(pattern);

		instance.tickFilter = function (adoptedTicks) {
			var filteredSet = adoptedTicks.reduce(function (ticks, tick) {
				var up = this.clampUp(tick).getTime();
				var down = this.clampDown(tick).getTime();

				if (up !== down) {
					ticks.add(up);
				} else {
					ticks.add(tick.getTime());
				}

				return ticks;
			}.bind(this), new Set());

			var aFilteredTicks = Array.from(filteredSet).map(function (value) {
				return new Date(value);
			});

			return aFilteredTicks;
		};

		return instance;
	};

	var skipWeeklyPattern = function (config) {
		var oInstance = createDiscontinuityProvider(config.pattern);

		if (config.localPattern) {
			oInstance.localInstance = createDiscontinuityProvider(config.localPattern);
		}

		oInstance.tradingWeekdays = oInstance.tradingDays.reduce(function (aTradingWeekdays, _, index) {
			if (oInstance.tradingDays[index].totalTradingTimeInMiliseconds > 0) {
				aTradingWeekdays.push({
					index: index,
					tradingDay: oInstance.tradingDays[index]
				});
			}

			return aTradingWeekdays;
		}, []);

		oInstance.tradingWeekdaysIndex = oInstance.tradingWeekdays.map(function (tradingDay) { return tradingDay.index; });

		oInstance.tickFilter = function (adoptedTicks) {
			var filteredSet = adoptedTicks.reduce(function (ticks, tick) {
				var up = this.clampUp(tick).getTime();
				var down = this.clampDown(tick).getTime();

				if (up !== down) {
					ticks.add(up);
				} else {
					ticks.add(tick.getTime());
				}

				return ticks;
			}.bind(this), new Set());

			var aFilteredTicks = Array.from(filteredSet).map(function (value) {
				return new Date(value);
			});

			return aFilteredTicks;
		};

		oInstance.firstTradingDayOfWeek = function (firstDayOfWeek) {
			var aTradingWeekdays = oInstance.tradingWeekdays;

			if (aTradingWeekdays.length === 0) {
				return firstDayOfWeek;
			}

			var firstTradingDay = aTradingWeekdays[0].index;

			if (aTradingWeekdays.length > 1 && firstTradingDay !== firstDayOfWeek) {
				for (var i = 0; i < aTradingWeekdays.length; i++) {
					var tradingDayIndex = aTradingWeekdays[i].index;

					if (tradingDayIndex === firstDayOfWeek) {
						firstTradingDay = firstDayOfWeek;
						break;
					} else if (tradingDayIndex > firstDayOfWeek && tradingDayIndex < firstTradingDay) {
						firstTradingDay = tradingDayIndex;
					}
				}
			}

			return firstTradingDay;
		};

		oInstance.useDiscontinuousScale = function (unit) {
			return unit === "d3.time.minute" || unit === "d3.time.hour" || unit === "d3.time.day";
		};

		return oInstance;
	};

	return {
		providers: {
			weeklyPattern: skipWeeklyPattern
		}
	};
});
