sap.ui.define(["sap/gantt/skipTime/DiscontinuousProvider"], function (DiscontinuousProvider) {
	'use strict';

	var skipRangePattern = function (ranges) {

		// returns true if the date is within the range
		var inRange = function inRange(oDate, aRange) {
			return oDate >= aRange[0] && oDate < aRange[1];
		};

		// returns true if the inner interval is completely within the outer interval
		var insideRange = function insideRange(aInnerInterval, aOuterInterval) {
			return aInnerInterval[0] >= aOuterInterval[0] && aInnerInterval[1] <= aOuterInterval[1];
		};

		var oInstance = new DiscontinuousProvider();

		// returns the number of milliseconds between the start and end dates after removing the discontinuities in between
		oInstance.distance = function (oStart, oEnd) {
			var factor = 1;
			if (oEnd < oStart) {
				var oTemp = oStart;
				oStart = oEnd;
				oEnd = oTemp;
				factor = -1;
			}
			oStart = oInstance.clampUp(oStart);
			oEnd = oInstance.clampDown(oEnd);
			var aInsideRanges = ranges.filter(function (oRange) {
				return insideRange(oRange, [oStart, oEnd]);
			});
			var aRangeSizes = aInsideRanges.map(function (r) {
				return r[1] - r[0];
			});
			return factor * (oEnd - oStart - 1 * aRangeSizes.reduce(function (total, current) {
				return total + current;
			}, 0));
		};

		var add = function add(oDate, iOffset) {
			return oDate instanceof Date ? new Date(oDate.getTime() + iOffset) : oDate + iOffset;
		};

		// When given a date and an offset in milliseconds, the date should be advanced by the offset value, skipping any discontinuities, to return the final value.
		oInstance.offset = function (oLocation, iOffset) {
			var currentLocation = oLocation, iOffsetRemaining, aFutureRanges, nextRange, delta;
			function forwardRangeFilter(aRange) {
				return aRange[0] > currentLocation;
			}
			function backwardRangeFilter(aRange) {
				return aRange[1] < currentLocation;
			}
			if (iOffset > 0) {
				currentLocation = oInstance.clampUp(oLocation);
				iOffsetRemaining = iOffset;
				while (iOffsetRemaining > 0) {
					aFutureRanges = ranges.filter(forwardRangeFilter).sort(function (aRange1, aRange2) {
						return aRange1[0] - aRange2[0];
					});

					if (aFutureRanges.length) {
						nextRange = aFutureRanges[0];
						delta = nextRange[0] - currentLocation;

						if (delta > iOffsetRemaining) {
							currentLocation = add(currentLocation, iOffsetRemaining);
							iOffsetRemaining = 0;
						} else {
							currentLocation = nextRange[1];
							iOffsetRemaining -= delta;
						}
					} else {
						currentLocation = add(currentLocation, iOffsetRemaining);
						iOffsetRemaining = 0;
					}
				}
			} else {
				currentLocation = oInstance.clampDown(oLocation);
				iOffsetRemaining = iOffset;

				while (iOffsetRemaining < 0) {
					aFutureRanges = ranges.filter(backwardRangeFilter).sort(function (aRange1, aRange2) {
						return aRange2[0] - aRange1[0];
					});

					if (aFutureRanges.length) {
						nextRange = aFutureRanges[0];
						delta = nextRange[1] - currentLocation;

						if (delta < iOffsetRemaining) {
							currentLocation = add(currentLocation, iOffsetRemaining);
							iOffsetRemaining = 0;
						} else {
							currentLocation = nextRange[0];
							iOffsetRemaining -= delta;
						}
					} else {
						currentLocation = add(currentLocation, iOffsetRemaining);
						iOffsetRemaining = 0;
					}
				}
			}
			return currentLocation;
		};

		// If the given date falls within a discontinuity (i.e. an excluded domain range), it must be moved forward to the discontinuity boundary. Otherwise, it should be returned unchanged.
		oInstance.clampUp = function (oDate) {
			return ranges.reduce(function (value, aRange) {
				return inRange(value, aRange) ? aRange[1] : value;
			}, oDate);
		};

		// If the given date falls within a discontinuity, it must be shifted backwards to the discontinuity boundary. Otherwise, it should be returned unchanged.
		oInstance.clampDown = function (oDate) {
			return ranges.reduce(function (value, aRange) {
				return inRange(value, aRange) ? aRange[0] : value;
			}, oDate);
		};

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

		return oInstance;
	};

	return {
		providers: {
			rangePattern: skipRangePattern
		}
	};
});
