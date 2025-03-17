/*global QUnit */
sap.ui.define([
	"sap/gantt/skipTime/SkipInterval"
], function (SkipInterval) {
	"use strict";

	QUnit.module("SkipInterval", {});

	QUnit.test("Test SkipInterval methods", function (assert) {
		var oSkipTimePattern = new SkipInterval({startTime: "000000", endTime: "090000"});
		assert.strictEqual(oSkipTimePattern._getFormattedTime().toString(), ["SOD","09:00:00"].toString(), "Correct formatted time");
		oSkipTimePattern = new SkipInterval({startTime: "000000", endTime: "235959"});
		assert.strictEqual(oSkipTimePattern._getFormattedTime().toString(), ["SOD","EOD"].toString(), "Correct formatted time");
		oSkipTimePattern = new SkipInterval({startTime: "120000", endTime: "235959"});
		assert.strictEqual(oSkipTimePattern._getFormattedTime().toString(), ["12:00:00","EOD"].toString(), "Correct formatted time");
		oSkipTimePattern = new SkipInterval({startTime: "120000", endTime: "210000"});
		assert.strictEqual(oSkipTimePattern._getFormattedTime().toString(), ["12:00:00","21:00:00"].toString(), "Correct formatted time");
	});
});