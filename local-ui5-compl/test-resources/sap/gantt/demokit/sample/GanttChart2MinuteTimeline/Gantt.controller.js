sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/gantt/misc/Format",
	"sap/gantt/library"
], function (Controller, JSONModel, Format, GanttLibrary) {
	"use strict";

	var dayInMilli = 60 * 60 * 24 * 1000;

	var addDays = function (date, days) {
		return new Date(date.getTime() + (days * dayInMilli));
	};

	var horizonStart = new Date(2018, 9, 2);
	horizonStart.setHours(0, 0, 0, 0);

	var offsetDays = 0.001;

	var tHorizon = {
		start: horizonStart,
		end: addDays(horizonStart, offsetDays)
	};

	var vHorizon = {
		start: tHorizon.start,
		end: addDays(tHorizon.start, offsetDays)
	};

	var oData = {
		root: {
			tHorizon: tHorizon,
			vHorizon: vHorizon,
			currentVHorizon: {
				start: vHorizon.start,
				end: vHorizon.end
			}
		}
	};

	var TimeUnit = GanttLibrary.config.TimeUnit;

	var oProportionTimeLineOptions = {
		"50Milliseconds": {
			innerInterval: {
				unit: TimeUnit.millisecond,
				span: 50,
				range: 90,
				selector: function (diff) {
					return diff >= 35;
				}
			},
			largeInterval: {
				unit: TimeUnit.second,
				span: 1,
				pattern: "ha / HH:mm:ss"
			},
			smallInterval: {
				unit: TimeUnit.millisecond,
				span: 50,
				pattern: "SSS"
			}
		},
		"100Milliseconds": {
			innerInterval: {
				unit: TimeUnit.millisecond,
				span: 100,
				range: 90,
				selector: function (diff) {
					return diff >= 30;
				}
			},
			largeInterval: {
				unit: TimeUnit.second,
				span: 1,
				pattern: "ha / HH:mm:ss"
			},
			smallInterval: {
				unit: TimeUnit.millisecond,
				span: 100,
				pattern: "SSS"
			}
		},
		"500Milliseconds": {
			innerInterval: {
				unit: TimeUnit.millisecond,
				span: 500,
				range: 90,
				selector: function (diff) {
					return diff >= 60;
				}
			},
			largeInterval: {
				unit: TimeUnit.second,
				span: 1,
				pattern: "ha / HH:mm:ss"
			},
			smallInterval: {
				unit: TimeUnit.millisecond,
				span: 500,
				pattern: "SSS"
			}
		},
		"1seconds": {
			innerInterval: {
				unit: TimeUnit.second,
				span: 1,
				range: 90,
				selector: function (diff) {
					return diff >= 25;
				}
			},
			largeInterval: {
				unit: TimeUnit.minute,
				span: 1,
				pattern: "ha / HH:mm"
			},
			smallInterval: {
				unit: TimeUnit.second,
				span: 1,
				pattern: "ss"
			}
		},
		"5seconds": {
			innerInterval: {
				unit: TimeUnit.second,
				span: 5,
				range: 90,
				selector: function (diff) {
					return diff >= 45;
				}
			},
			largeInterval: {
				unit: TimeUnit.minute,
				span: 1,
				pattern: "ha / HH:mm"
			},
			smallInterval: {
				unit: TimeUnit.second,
				span: 5,
				pattern: "ss"
			}
		},
		"15seconds": {
			innerInterval: {
				unit: TimeUnit.second,
				span: 15,
				range: 90,
				selector: function (diff) {
					return diff >= 35;
				}
			},
			largeInterval: {
				unit: TimeUnit.minute,
				span: 1,
				pattern: "ha / HH:mm"
			},
			smallInterval: {
				unit: TimeUnit.second,
				span: 15,
				pattern: "ss"
			}
		},
		"30seconds": {
			innerInterval: {
				unit: TimeUnit.second,
				span: 30,
				range: 90,
				selector: function (diff) {
					return diff >= 60;
				}
			},
			largeInterval: {
				unit: TimeUnit.minute,
				span: 1,
				pattern: "ha / HH:mm"
			},
			smallInterval: {
				unit: TimeUnit.second,
				span: 30,
				pattern: "ss"
			}
		},
		"1min": {
			innerInterval: {
				unit: TimeUnit.minute,
				span: 1,
				range: 90,
				selector: function (diff) {
					return diff >= 90;
				}
			},
			largeInterval: {
				unit: TimeUnit.hour,
				span: 1,
				pattern: "ha / HH"
			},
			smallInterval: {
				unit: TimeUnit.minute,
				span: 1,
				pattern: "mm"
			}
		}
	};

	return Controller.extend("sap.gantt.sample.GanttChart2MinuteTimeline.Gantt", {
		onInit: function () {
			var oViewModel = new JSONModel(oData);
			this.getView().setModel(oViewModel, "view");

			var oModel = new JSONModel(sap.ui.require.toUrl("sap/gantt/sample/GanttChart2MinuteTimeline/data.json"));
			this.getView().setModel(oModel);

			var oProportion = this.getView().byId("proportion");
			oProportion.setTimeLineOptions(oProportionTimeLineOptions);
			oProportion.setTimeLineOption(oProportionTimeLineOptions["30seconds"]);

			oProportion.setCoarsestTimeLineOption(oProportionTimeLineOptions["1min"]);
			oProportion.setFinestTimeLineOption(oProportionTimeLineOptions["50Milliseconds"]);
		},
		fnTimeConverter: function (sTimestamp) {
			sTimestamp = sTimestamp.split(" ").join("");
			return Format.abapTimestampToDate(sTimestamp);
		},
		dateToAbapTimestamp: function (oTime) {
			return Format.dateToAbapTimestamp(oTime);
		}
	});
});
