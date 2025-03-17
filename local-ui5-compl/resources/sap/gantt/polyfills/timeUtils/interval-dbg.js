/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([], function () {
	"use strict";

	function interval(input, step, number) {
		function round(date) {
			var d0 = input(date), d1 = offset(d0, 1);
			return date - d0 < d1 - date ? d0 : d1;
		}

		function ceil(date) {
			date = input(new Date(date - 1));
			step(date, 1);
			return date;
		}

		function offset(date, k) {
			date = new Date(+date);
			step(date, k);
			return date;
		}

		function range(t0, t1, dt) {
			var time = ceil(t0), times = [];

			if (dt > 1) {
				// eslint-disable-next-line no-unmodified-loop-condition
				while (time < t1) {
					if (!(number(time) % dt)) {
						times.push(new Date(+time));
					}
					step(time, 1);
				}
			} else {
				// eslint-disable-next-line no-unmodified-loop-condition
				while (time < t1) {
					times.push(new Date(+time));
					step(time, 1);
				}
			}
			return times;
		}

		input.floor = input;
		input.round = round;
		input.ceil = ceil;
		input.offset = offset;
		input.range = range;

		return input;
	}


	return interval;
}, true);
