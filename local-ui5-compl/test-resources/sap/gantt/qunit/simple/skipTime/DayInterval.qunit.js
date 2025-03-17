/*global QUnit */
sap.ui.define([
	"sap/gantt/skipTime/DayInterval",
	"sap/gantt/skipTime/SkipInterval"
], function (DayInterval, SkipInterval) {
	"use strict";

	QUnit.module("DayInterval", {});

	QUnit.test("Test DayInterval methods", function (assert) {
		var oDailyInterval = new DayInterval({day: "Monday"});
		oDailyInterval.addAggregation("skipIntervals", new SkipInterval({startTime: "000000", endTime: "090000"}));
		oDailyInterval.addAggregation("skipIntervals", new SkipInterval({startTime: "173000", endTime: "235959"}));
		assert.strictEqual(oDailyInterval.getDay(), "Monday", "Correct day");
		assert.strictEqual(oDailyInterval._getFormattedSkipIntervals().toString(), [["SOD","09:00:00"],["17:30:00","EOD"]].toString(), "Correct daily interval");
		oDailyInterval = new DayInterval({day: "Saturday"});
		oDailyInterval.addAggregation("skipIntervals", new SkipInterval({startTime: "000000", endTime: "235959"}));
		assert.strictEqual(oDailyInterval.getDay(), "Saturday", "Correct day");
		assert.strictEqual(oDailyInterval._getFormattedSkipIntervals().toString(), [["SOD","EOD"]].toString(), "Correct daily interval");
	});
});