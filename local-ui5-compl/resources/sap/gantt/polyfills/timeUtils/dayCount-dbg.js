/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([], function () {
	"use strict";

	var t0 = new Date(),
		t1 = new Date();

	var durationSecond = 1000;
	var durationMinute = durationSecond * 60;
	var durationHour = durationMinute * 60;
	var durationDay = durationHour * 24;

	function count(start, end) {
		t0.setTime(+start);
		t1.setTime(+end);
		t0.setHours(0, 0, 0, 0);
		t1.setHours(0, 0, 0, 0);

		return Math.floor((t1 - t0 - (t1.getTimezoneOffset() - t0.getTimezoneOffset()) * durationMinute) / durationDay);
	}

	return count;
});
