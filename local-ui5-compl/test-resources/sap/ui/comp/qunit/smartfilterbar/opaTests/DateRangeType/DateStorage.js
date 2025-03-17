sap.ui.define([
	"sap/ui/core/date/UniversalDateUtils"
], function (
	UniversalDateUtils
) {
	"use strict";
	var DateStorage = {
		setNextMinutes: function(sId, iMinutes) {
			if (this[sId] === undefined) {
				this[sId] = {};
			}

			this[sId].nextMinutes = UniversalDateUtils.ranges.nextMinutes(iMinutes);
		},
		getNextMinutes: function(sId) {
			return this[sId] && this[sId].nextMinutes;
		},
		setLastMinutes: function(sId, iMinutes) {
			if (this[sId] === undefined) {
				this[sId] = {};
			}

			this[sId].lastMinutes = UniversalDateUtils.ranges.lastMinutes(iMinutes);
		},
		getLastMinutes: function(sId) {
			return this[sId] && this[sId].lastMinutes;
		},
		setLastMinutesIncluded: function(sId, iMinutes) {
			if (this[sId] === undefined) {
				this[sId] = {};
			}

			this[sId].lastMinutesIncluded = UniversalDateUtils.ranges.lastMinutes(iMinutes - 1);
		},
		getLastMinutesIncluded: function(sId) {
			return this[sId] && this[sId].lastMinutesIncluded;
		},
		setLastHoursIncluded: function(sId, iHours) {
			if (this[sId] === undefined) {
				this[sId] = {};
			}

			this[sId].lastHoursIncluded = UniversalDateUtils.ranges.lastHours(iHours - 1);
		},
		getLastHoursIncluded: function(sId) {
			return this[sId] && this[sId].lastHoursIncluded;
		},
		setNextMinutesIncluded: function(sId, iMinutes) {
			if (this[sId] === undefined) {
				this[sId] = {};
			}

			this[sId].nextMinutesIncluded = UniversalDateUtils.ranges.nextMinutes(iMinutes - 1);
		},
		getNextMinutesIncluded: function(sId) {
			return this[sId] && this[sId].nextMinutesIncluded;
		},
		setNextHoursIncluded: function(sId, iHours) {
			if (this[sId] === undefined) {
				this[sId] = {};
			}

			this[sId].nextHoursIncluded = UniversalDateUtils.ranges.nextHours(iHours - 1);
		},
		getNextHoursIncluded: function(sId) {
			return this[sId] && this[sId].nextHoursIncluded;
		}
	};

	return DateStorage;
});
