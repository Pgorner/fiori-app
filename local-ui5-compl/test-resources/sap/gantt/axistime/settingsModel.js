sap.ui.define(["sap/gantt/axistime/ProportionZoomStrategy",
               "sap/gantt/axistime/FullScreenStrategy",
               "sap/gantt/axistime/StepwiseZoomStrategy",
               "sap/gantt/axistime/StepwiseTimeLineOptions"
   ], function(StepwiseTimeLineOptions) {
	   "use strict";

	var dTotalHorizonStartTime = new Date("2014-07-01"),
		dTotalHorizonEndTime = new Date("2016-07-01"),
		dVisibleHorizonStartTime = new Date("2015-01-01"),
		dVisibleHorizonEndTime = new Date("2015-03-01");

	return {
		zoomStrategyType: {
			name : "Zoom Strategy Type",
			typeHelpText : "The control provides several implementations of zoom strategy (e.g. Proportion, Stepwise and Full Screen) but it is also possible for applications to do customizations according to the interface of sap.gantt.axistime.AxisTimeStrategyBase class.",
			controlTypeLabel : "Zoom Control Type",
			controlTypeHelpText: "This is for testing purpose. The control type is relevent to strategy type so please create new toolbarScheme and change the timeZoom attribute when non-default control type is needed.",
			visibleHorizonStartTimeLabel: "Start Time of The Visible Horizon",
			calendarTypeLabel: "Calendar Types",
			totalHorizonStartTime: dTotalHorizonStartTime,
			totalHorizonEndTime: dTotalHorizonEndTime,
			visibleHorizonStartTime: dVisibleHorizonStartTime,
			visibleHorizonEndTime: dVisibleHorizonEndTime,
			defaultSelected : "4",
			values : [{
				key : "0",
				name : "Proportion Zoom Strategy",
				axisTimeStrategy : new sap.gantt.axistime.ProportionZoomStrategy({
					totalHorizon: new sap.gantt.config.TimeHorizon({
						startTime: dTotalHorizonStartTime,
						endTime: dTotalHorizonEndTime
					}),
					visibleHorizon: new sap.gantt.config.TimeHorizon({
						startTime: dVisibleHorizonStartTime,
						endTime: dVisibleHorizonEndTime
					})
				}),
				zoomControlType: {
					defaultSelected : "0",
					values : [{
						key : "0",
						name : "Slider With Buttons",
						value: sap.gantt.config.ZoomControlType.SliderWithButtons
					},{
						key : "1",
						name : "Slider Only",
						value: sap.gantt.config.ZoomControlType.SliderOnly
					},{
						key : "2",
						name : "Buttons Only",
						value: sap.gantt.config.ZoomControlType.ButtonsOnly
					},{
						key : "3",
						name : "None",
						value: sap.gantt.config.ZoomControlType.None
					}]
				}
			},{
				key : "1",
				name : "Full Screen Zoom Strategy",
				axisTimeStrategy : new sap.gantt.axistime.FullScreenStrategy({
					totalHorizon: new sap.gantt.config.TimeHorizon({
						startTime: dTotalHorizonStartTime,
						endTime: dTotalHorizonEndTime
					}),
					visibleHorizon: new sap.gantt.config.TimeHorizon({
						startTime: dVisibleHorizonStartTime,
						endTime: dVisibleHorizonEndTime
					})
				}),
				zoomControlType: {
					defaultSelected : "0",
					values : [{
						key : "0",
						name : "None",
						value: sap.gantt.config.ZoomControlType.None
					}]
				}
			},{
				key : "2",
				name : "Stepwise Zoom Strategy (defalut select)",
				axisTimeStrategy : new sap.gantt.axistime.StepwiseZoomStrategy({
					totalHorizon: new sap.gantt.config.TimeHorizon({
						startTime: dTotalHorizonStartTime,
						endTime: dTotalHorizonEndTime
					}),
					visibleHorizon: new sap.gantt.config.TimeHorizon({
						startTime: dVisibleHorizonStartTime
					}),
					timeLineOption: StepwiseTimeLineOptions.Quarter
				}),
				zoomControlType: {
					defaultSelected : "0",
					values : [{
						key : "0",
						name : "Drop-down List",
						value: sap.gantt.config.ZoomControlType.Select
					}]
				}
			},{
				key : "3",
				name : "Stepwise Zoom Strategy(custom with select)",
				axisTimeStrategy : new sap.gantt.axistime.StepwiseZoomStrategy({
					totalHorizon: new sap.gantt.config.TimeHorizon({
						startTime: dTotalHorizonStartTime,
						endTime: dTotalHorizonEndTime
					}),
					visibleHorizon: new sap.gantt.config.TimeHorizon({
						startTime: dVisibleHorizonStartTime
					}),
					timeLineOptions:{
						"Date": StepwiseTimeLineOptions.Date,
						"WeekOfYear": StepwiseTimeLineOptions.WeekOfYear,
						"TwoWeeks": {
							text: "Two Weeks",
							innerInterval: {
								unit: sap.gantt.config.TimeUnit.week,
								span: 2,
								range: 64
							},
							largeInterval: {
								unit: sap.gantt.config.TimeUnit.month,
								span: 1,
								pattern: "LLL yyyy"
							},
							smallInterval: {
								unit: sap.gantt.config.TimeUnit.week,
								span: 2,
								//e.g. 1, 2..., 52
								pattern: "ww"
							}
						},
						"Month": StepwiseTimeLineOptions.Month,
						"Quarter": StepwiseTimeLineOptions.Quarter,
						"Year": StepwiseTimeLineOptions.Year
					},
					timeLineOption: StepwiseTimeLineOptions.WeekOfYear
				}),
				zoomControlType: {
					defaultSelected : "0",
					values : [{
						key : "0",
						name : "Drop-down List",
						value: sap.gantt.config.ZoomControlType.Select//SliderWithButtons
					}]
				}
			},{
				key : "4",
				name : "Stepwise Zoom Strategy (defalut slider)",
				axisTimeStrategy : new sap.gantt.axistime.StepwiseZoomStrategy({
					totalHorizon: new sap.gantt.config.TimeHorizon({
						startTime: dTotalHorizonStartTime,
						endTime: dTotalHorizonEndTime
					}),
					visibleHorizon: new sap.gantt.config.TimeHorizon({
						startTime: dVisibleHorizonStartTime
					}),
					timeLineOption: StepwiseTimeLineOptions.Quarter
				}),
				zoomControlType: {
					defaultSelected : "0",
					values : [{
						key : "0",
						name : "Slider",
						value: sap.gantt.config.ZoomControlType.SliderWithButtons
					}]
				}
			},{
				key : "5",
				name : "Stepwise Zoom Strategy(customed with slider)",
				axisTimeStrategy : new sap.gantt.axistime.StepwiseZoomStrategy({
					totalHorizon: new sap.gantt.config.TimeHorizon({
						startTime: dTotalHorizonStartTime,
						endTime: dTotalHorizonEndTime
					}),
					visibleHorizon: new sap.gantt.config.TimeHorizon({
						startTime: dVisibleHorizonStartTime
					}),
					timeLineOptions:{
						"Date": StepwiseTimeLineOptions.Date,
						"WeekOfYear": StepwiseTimeLineOptions.WeekOfYear,
						"TwoWeeks": {
							text: "Two Weeks",
							innerInterval: {
								unit: sap.gantt.config.TimeUnit.week,
								span: 2,
								range: 64
							},
							largeInterval: {
								unit: sap.gantt.config.TimeUnit.month,
								span: 1,
								pattern: "LLL yyyy"
							},
							smallInterval: {
								unit: sap.gantt.config.TimeUnit.week,
								span: 2,
								//e.g. 1, 2..., 52
								pattern: "ww"
							}
						},
						"Month": StepwiseTimeLineOptions.Month,
						"Quarter": StepwiseTimeLineOptions.Quarter,
						"Year": StepwiseTimeLineOptions.Year
					},
					timeLineOption: StepwiseTimeLineOptions.Quarter
				}),
				zoomControlType: {
					defaultSelected : "0",
					values : [{
						key : "0",
						name : "Slider",
						value: sap.gantt.config.ZoomControlType.SliderWithButtons
					}]
				}
			}]
		},
		calendarTypes : {
			label: "Calendar Types",
			defaultSelected : 0,
			values : [{
				name : "Gregorian",
				//pattern: "",
				locale: new sap.ui.core.Locale("en-US"),
				type: sap.ui.core.CalendarType.Gregorian
			},{
				name : "Islamic",
				//pattern: "",
				locale: new sap.ui.core.Locale("en-US"),
				type: sap.ui.core.CalendarType.Islamic
			},{
				name : "Japanese",
				//pattern: "",
				locale: new sap.ui.core.Locale("ja-JP"),
				type: sap.ui.core.CalendarType.Japanese
			},{
				name : "Persian",
				//pattern: "",
				locale: new sap.ui.core.Locale("fa-IR"),
				type: sap.ui.core.CalendarType.Persian
			}]
		},
		dataLabel : {
			name: "Labels Display",
			defaultSelected : 0,
			values : [{
				name : "First / Last Date Always",
				row : 2,
				showFirstLastDataOnly: false,
				forceToShowFirstLastData: true
			},{
				name : "First / Last Date Only",
				row : 1,
				showFirstLastDataOnly: true,
				forceToShowFirstLastData: false
			}]
		}
	};
});
