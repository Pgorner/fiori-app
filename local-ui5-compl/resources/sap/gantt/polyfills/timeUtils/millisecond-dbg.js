/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["./interval"], function (interval) {
	"use strict";

	var t0 = new Date(),
		t1 = new Date();

	var millisecond = interval(function (date) {
		return date;
	}, function (date, offset) {
		date.setTime(date.getTime() + Math.floor(offset));
	}, function (date) {
		return date.getMilliseconds();
	});

	millisecond.count = function (start, end) {
		t0.setTime(+start);
		t1.setTime(+end);

		return Math.floor(t1 - t0);
	};


	return millisecond;
});
