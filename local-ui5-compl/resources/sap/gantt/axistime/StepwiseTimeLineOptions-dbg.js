/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/gantt/library",
	"sap/ui/core/Lib",
	"sap/gantt/utils/GanttChartConfigurationUtils"
], function(library, Lib, GanttChartConfigurationUtils) {
	"use strict";

    var oRb = Lib.getResourceBundleFor("sap.gantt");

	var TimeUnit = library.config.TimeUnit;

	return {
	"FiveMinutes": {
		text: oRb.getText("SWZS_FIVE_MINUTES"),
		innerInterval: {
			unit: TimeUnit.minute,
			span: 5,
			range: 32 //2rem
		},
		largeInterval: {
			unit: TimeUnit.hour,
			span: 1,
			//first label e.g.: 9AM / July 12, 2016; others e.g.: "10AM"
			pattern: "ha / MMMM dd, yyyy "
		},
		smallInterval: {
			unit: TimeUnit.minute,
			span: 5,
			//e.g. 00, 05, ...55
			pattern: "mm "
		}
	},
	"FifteenMinutes": {
		text: oRb.getText("SWZS_FIFTEEN_MINUTES"),
		innerInterval: {
			unit: TimeUnit.minute,
			span: 15,
			range: 48
		},
		largeInterval: {
			unit: TimeUnit.hour,
			span: 1,
			//first label e.g.: 9AM / July 12, 2016; others e.g.: "10AM"
			pattern: "ha / MMMM dd, yyyy "
		},
		smallInterval: {
			unit: TimeUnit.minute,
			span: 15,
			pattern: "mm "
		}
	},
	"Hour": {
		text: oRb.getText("SWZS_HOUR"),
		innerInterval: {
			unit: TimeUnit.hour,
			span: 1,
			range: 48
		},
		largeInterval: {
			unit: TimeUnit.day,
			span: 1,
			pattern: library.config.DEFAULT_DATE_PATTERN
		},
		smallInterval: {
			unit: TimeUnit.hour,
			span: 1,
			pattern: library.config.DEFAULT_TIME_PATTERN
		}
	},
	"SixHours": {
		text: oRb.getText("SWZS_SIX_HOURS"),
		innerInterval: {
			unit: TimeUnit.hour,
			span: 6,
			range: 64
		},
		largeInterval: {
			unit: TimeUnit.day,
			span: 1,
			pattern: library.config.DEFAULT_DATE_PATTERN
		},
		smallInterval: {
			unit: TimeUnit.hour,
			span: 6,
			pattern: library.config.DEFAULT_TIME_PATTERN
		}
	},
	"DayDate": {
		text: oRb.getText("SWZS_DATE_1"),
		innerInterval: {
			unit: TimeUnit.day,
			span: 1,
			range: 64
		},
		largeInterval: {
			unit: TimeUnit.week,
			span: 1,
			//first label e.g.: Jan 2015, Week 04; others e.g. Feb, Mar...
			pattern: oRb.getText("SWZS_DATE_PATTERN", ["LLL yyyy, '", "' ww  "])
		},
		smallInterval: {
			unit: TimeUnit.day,
			span: 1,
			//e.g. Mon 22, Tue 23
			pattern: GanttChartConfigurationUtils.getRTL() ? "dd EEE " : "EEE dd "
		}
	},
	"Date": {
		text: oRb.getText("SWZS_DATE_2"),
		innerInterval: {
			unit: TimeUnit.day,
			span: 1,
			range: 32
		},
		largeInterval: {
			unit: TimeUnit.week,
			span: 1,
			//first label e.g.: Jan 2015, Week 04; others e.g. Feb, Mar...
			pattern: oRb.getText("SWZS_DATE_PATTERN", ["LLL yyyy, '", "' ww  "])
		},
		smallInterval: {
			unit: TimeUnit.day,
			span: 1,
			pattern: "dd "
		}
	},
	"CWWeek": {
		text: oRb.getText("SWZS_WEEK_1"),
		innerInterval: {
			unit: TimeUnit.week,
			span: 1,
			range: 56
		},
		largeInterval: {
			unit: TimeUnit.month,
			span: 1,
			//first label: Jan 2015, others: Feb, Mar...
			pattern: "LLL yyyy "
		},
		smallInterval: {
			unit: TimeUnit.week,
			span: 1,
			//e.g. CW 01, CW 02...
			pattern: "'" + oRb.getText("SWZS_CW") + "' ww  "
		}
	},
	"WeekOfYear": {
		text: oRb.getText("SWZS_WEEK_2"),
		innerInterval: {
			unit: TimeUnit.week,
			span: 1,
			range: 32
		},
		largeInterval: {
			unit: TimeUnit.month,
			span: 1,
			//first label: Jan 2015, others: Feb, Mar...
			pattern: "LLL yyyy "
		},
		smallInterval: {
			unit: TimeUnit.week,
			span: 1,
			//e.g. 01, 02..., 53
			pattern: "ww "
		}
	},
	"Month": {
		text: oRb.getText("SWZS_MONTH"),
		innerInterval: {
			unit: TimeUnit.day,
			span: 30,
			range: 48
		},
		largeInterval: {
			unit: TimeUnit.month,
			span: 3,
			pattern: "yyyy QQQ "
		},
		smallInterval: {
			unit: TimeUnit.month,
			span: 1,
			pattern: "LLL "
		}
	},
	"Quarter": {
		text: oRb.getText("SWZS_QUARTER"),
		innerInterval: {
			unit: TimeUnit.day,
			span: 90,
			range: 48
		},
		largeInterval: {
			unit: TimeUnit.year,
			span: 1,
			//first label: 2015, Q1, others Q2, Q3, Q4, 2016 Q1, Q2...
			pattern: "yyyy "
		},
		smallInterval: {
			unit: TimeUnit.month,
			span: 3,
			pattern: "QQQ "
		}
	},
	"Year": {
		text: oRb.getText("SWZS_YEAR"),
		innerInterval: {
			unit: TimeUnit.day,
			span: 360,
			range: 48
		},
		largeInterval: {
			unit: TimeUnit.year,
			span: 5,
			pattern: "yyyy "
		},
		smallInterval: {
			unit: TimeUnit.year,
			span: 1,
			pattern: "yyyy "
		}
	}
	};
}, true);
