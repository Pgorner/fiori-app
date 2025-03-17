/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/gantt/skipTime/SkipPattern",
	"./RangeDiscontinuousProvider",
	"sap/gantt/misc/Format"
], function (SkipPattern, RangeDiscontinuousProvider, Format) {
	"use strict";

	var RangePattern = SkipPattern.extend("sap.gantt.sample.GanttChart2HideNonWorkingDateRanges.RangePattern", {
		metadata: {
			library: "sap.gantt",
			defaultAggregation: "dateIntervals",
			properties: {
				/**
				 * If this property is set to true, range pattern is applied to the gantt chart.
				 */
				enabled: {type: "boolean", defaultValue: true}
			},
			aggregations: {
				/**
				 * Date ranges to be skipped.
				 */
				dateIntervals: { type: "sap.gantt.sample.GanttChart2HideNonWorkingDateRanges.DateInterval", multiple: true, singularName: "dateInterval" }
			}
		}
	});

	RangePattern.prototype.getDateRangePattern = function () {
		var aDateIntervals = this.getDateIntervals();
		if (aDateIntervals.length <= 0) { return []; }
		var aIntervals = [];
		aDateIntervals.forEach(function (oDateInterval) {
			var oStartDate = oDateInterval.getStartDate();
			var oEndDate = oDateInterval.getEndDate();
			var oDateArr = oStartDate <= oEndDate ? [oStartDate, oEndDate] : [oEndDate, oStartDate];
			if (oStartDate && oEndDate) {
				aIntervals.push(oDateArr);
			}
		});
		if (aIntervals.length <= 0) { return []; }

		// sort the intervals in increasing order of start time
		function compareInterval(interval1, interval2) {
			if (interval1[0] < interval2[0]) {
				return -1;
			}
			if (interval1[0] > interval2[0]) {
				return 1;
			}
			return 0;
		}
		aIntervals.sort(compareInterval);

		// merge overlapping intervals i.e, [[3,5],[1,8],[7,10],[12,15]] => [[1,10],[12,15]]
		var aNonOverlapIntervals = [];
		aNonOverlapIntervals.push(aIntervals[0]);

		for (var i = 1; i < aIntervals.length; i++) {
			var top = aNonOverlapIntervals[aNonOverlapIntervals.length - 1];
			if (top[1] < aIntervals[i][0]) {
				aNonOverlapIntervals.push(aIntervals[i]);
			} else if (top[1] < aIntervals[i][1]) {
				top[1] = aIntervals[i][1];
				aNonOverlapIntervals.pop();
				aNonOverlapIntervals.push(top);
			}
		}

		return aNonOverlapIntervals;
	};

	// Returns the discontinuity provider of the range pattern.
	RangePattern.prototype.getDiscontinuityProvider = function () {
		if (this.getEnabled()) {
			var oDateRangePattern = this.getDateRangePattern();
			return oDateRangePattern.length === 0 ? null : RangeDiscontinuousProvider.providers.rangePattern(oDateRangePattern);
		}
		return null;
	};

	RangePattern.prototype.setEnabled = function (bEnable) {
		this.setProperty("enabled", bEnable, true);
		this.updateDiscontinuousProvider(this.getDiscontinuityProvider());
	};

	return RangePattern;
});