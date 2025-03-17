/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"./timeUtils/day",
	"./timeUtils/days",
	"./timeUtils/millisecond",
	"./timeUtils/monday",
	"./timeUtils/saturday",
	"./timeUtils/weeks",
	"./timeUtils/dayCount"
], function (day, days, millisecond, monday, saturday, weeks, dayCount) {
	"use strict";

	return {
		timeDay: day,
		timeDays: days,
		timeMillisecond: millisecond,
		timeMonday: monday,
		timeSaturday: saturday,
		timeWeeks: weeks,
		dayCount: dayCount
	};
});
