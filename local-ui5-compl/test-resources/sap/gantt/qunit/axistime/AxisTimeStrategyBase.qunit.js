/*global QUnit */
sap.ui.define([
	"sap/gantt/library",
	"sap/ui/core/Core",
	"sap/ui/core/LocaleData",
	"sap/gantt/axistime/AxisTimeStrategyBase",
	"sap/gantt/misc/Format",
	"sap/gantt/config/TimeHorizon",
	"sap/ui/core/date/CalendarWeekNumbering",
	"sap/ui/core/date/CalendarUtils",
	"sap/gantt/utils/GanttChartConfigurationUtils",
	"sap/gantt/skipTime/WeekPattern",
	"sap/gantt/skipTime/DayInterval",
	"sap/gantt/skipTime/SkipInterval"
], function (library, Core, LocaleData, AxisTimeStrategyBase, Format, TimeHorizon, CalendarWeekNumbering, CalendarUtils, GanttChartConfigurationUtils, WeekPattern, DayInterval, SkipInterval) {
	"use strict";
	var oCustomedTotalHorizon = new TimeHorizon({
		startTime: new Date(2016, 10, 21),
		endTime: new Date(2026, 10, 22)
	});
	var oSetTotalHorizon = new TimeHorizon({
		startTime: new Date(2015, 11, 1),
		endTime: new Date(2021, 9, 11)
	});
	var oCustomedVisibleHorizon = new TimeHorizon({
		startTime: new Date(2016, 10, 22),
		endTime: new Date(2017, 10, 21)
	});
	var oVisibleHorizonForTest = new TimeHorizon({
		startTime: new Date(2016, 11, 1),
		endTime: new Date(2017, 11, 1)
	});
	var oDateTimeForTest = new Date();

	QUnit.module("Create axistime.AxisTimeStrategyBase with default values.", {
		beforeEach: function () {
			this.oAxisTimeStrategyBase = new AxisTimeStrategyBase();
		},
		afterEach: function () {
			this.oAxisTimeStrategyBase.destroy();
			this.oAxisTimeStrategyBase = undefined;
		}
	});

	/**
	 * @deprecated Since version 1.63
	 */
	QUnit.test("Test default configuration values.", function (assert) {
		var oTotalHorizon = this.oAxisTimeStrategyBase.getTotalHorizon(),
			oVisibleHorizon = this.oAxisTimeStrategyBase.getVisibleHorizon();

		var oDefaultTotal = sap.gantt.config.DEFAULT_TOTAL_HORIZON,
			oDefaultVisible = sap.gantt.config.DEFAULT_VISIBLE_HORIZON;

		assert.strictEqual(oTotalHorizon.getStartTime(), oDefaultTotal.getStartTime(), "totalHorizon start time is set to default");
		assert.strictEqual(oTotalHorizon.getEndTime(), oDefaultTotal.getEndTime(), "totalHorizon end time is set to default");

		assert.strictEqual(oVisibleHorizon.getStartTime(), oDefaultVisible.getStartTime(), "visibleHorizon start time is set to default");
		assert.strictEqual(oVisibleHorizon.getEndTime(), oDefaultVisible.getEndTime(), "visibleHorizon end time is set to default");

		assert.strictEqual(this.oAxisTimeStrategyBase.getZoomLevel(), 0, "zoomLevel is correct");
		assert.strictEqual(this.oAxisTimeStrategyBase.getCalendarType(), sap.ui.core.CalendarType.Gregorian, "calendarType is correct");
		assert.strictEqual(this.oAxisTimeStrategyBase.getFirstDayOfWeek(), LocaleData.getInstance(GanttChartConfigurationUtils.getLanguageTag()).getFirstDayOfWeek(), "firstDayOfWeek is correct");
		assert.strictEqual(this.oAxisTimeStrategyBase.getCalendarWeekNumbering(), CalendarWeekNumbering.Default, "Default CalendarWeekNumbering is correct");
		assert.strictEqual(this.oAxisTimeStrategyBase.getMouseWheelZoomType(), sap.gantt.MouseWheelZoomType.FineGranular, "mouse wheel zoom type is correct");
	});

	QUnit.test("Test calendarWeekNumbering", function (assert) {
		var TimeUnit = sap.gantt.config.TimeUnit;
		var oLocaleData = LocaleData.getInstance(sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale());
		var sDayDatePattern = oLocaleData.getCustomDateTimePattern("EEEdd");
		var sCalendarWeekPattern = "'CW'" + oLocaleData.getCustomDateTimePattern("w");
		var sMonthPattern = oLocaleData.getCustomDateTimePattern("yyyMMM");

		var oTimeLineOptions = {
			"OneDay": {
				innerInterval: {
					unit: TimeUnit.day,
						span: 1,
						range: 90
				},
				largeInterval: {
					unit: TimeUnit.week,
						span: 1,
						pattern: sMonthPattern + ", " + sCalendarWeekPattern
				},
				smallInterval: {
					unit: TimeUnit.day,
						span: 1,
						pattern: sDayDatePattern
				}
			}
		};

		var oAxisTimeStrategy = new AxisTimeStrategyBase({
			totalHorizon: new TimeHorizon({
				startTime: "20211231000000",
				endTime: "20220103000000"
			}),
			visibleHorizon: new TimeHorizon({
				startTime: "20211231000000",
				endTime: "20220103000000"
			}),
			timeLineOptions: oTimeLineOptions,
			timeLineOption: oTimeLineOptions["OneDay"]
		});
		oAxisTimeStrategy.createAxisTime(library.config.DEFAULT_LOCALE.clone());
		var aLargeIntervalTicks = oAxisTimeStrategy.getAxisTime().getTickTimeIntervalLabel()[1];
		assert.strictEqual(aLargeIntervalTicks[0].largeLabel, "Dec 2021, CW53", "Correct large interval label when calendarWeekNumbering not defined");
		assert.strictEqual(aLargeIntervalTicks[1].largeLabel, "Jan 2022, CW1", "Correct large interval label when calendarWeekNumbering not defined");
		assert.strictEqual(aLargeIntervalTicks[2].largeLabel, "Jan 2022, CW2", "Correct large interval label when calendarWeekNumbering not defined");
		assert.strictEqual(aLargeIntervalTicks[3].largeLabel, "Jan 2022, CW2", "Correct large interval label when calendarWeekNumbering not defined");
		oAxisTimeStrategy.setCalendarWeekNumbering(CalendarWeekNumbering.Default);
		aLargeIntervalTicks = oAxisTimeStrategy.getAxisTime().getTickTimeIntervalLabel()[1];
		assert.strictEqual(aLargeIntervalTicks[0].largeLabel, "Dec 2021, CW53", "Correct large interval label for calendarWeekNumbering: Default");
		assert.strictEqual(aLargeIntervalTicks[1].largeLabel, "Jan 2022, CW1", "Correct large interval label for calendarWeekNumbering: Default");
		assert.strictEqual(aLargeIntervalTicks[2].largeLabel, "Jan 2022, CW2", "Correct large interval label for calendarWeekNumbering: Default");
		assert.strictEqual(aLargeIntervalTicks[3].largeLabel, "Jan 2022, CW2", "Correct large interval label for calendarWeekNumbering: Default");
		oAxisTimeStrategy.setCalendarWeekNumbering(CalendarWeekNumbering.ISO_8601);
		aLargeIntervalTicks = oAxisTimeStrategy.getAxisTime().getTickTimeIntervalLabel()[1];
		assert.strictEqual(aLargeIntervalTicks[0].largeLabel, "Dec 2021, CW52", "Correct large interval label for calendarWeekNumbering: ISO_8601");
		assert.strictEqual(aLargeIntervalTicks[1].largeLabel, "Jan 2022, CW52", "Correct large interval label for calendarWeekNumbering: ISO_8601");
		assert.strictEqual(aLargeIntervalTicks[2].largeLabel, "Jan 2022, CW52", "Correct large interval label for calendarWeekNumbering: ISO_8601");
		assert.strictEqual(aLargeIntervalTicks[3].largeLabel, "Jan 2022, CW1", "Correct large interval label for calendarWeekNumbering: ISO_8601");
		oAxisTimeStrategy.setCalendarWeekNumbering(CalendarWeekNumbering.MiddleEastern);
		aLargeIntervalTicks = oAxisTimeStrategy.getAxisTime().getTickTimeIntervalLabel()[1];
		assert.strictEqual(aLargeIntervalTicks[0].largeLabel, "Dec 2021, CW53", "Correct large interval label for calendarWeekNumbering: MiddleEastern");
		assert.strictEqual(aLargeIntervalTicks[1].largeLabel, "Jan 2022, CW1", "Correct large interval label for calendarWeekNumbering: MiddleEastern");
		assert.strictEqual(aLargeIntervalTicks[2].largeLabel, "Jan 2022, CW1", "Correct large interval label for calendarWeekNumbering: MiddleEastern");
		assert.strictEqual(aLargeIntervalTicks[3].largeLabel, "Jan 2022, CW1", "Correct large interval label for calendarWeekNumbering: MiddleEastern");
		oAxisTimeStrategy.setCalendarWeekNumbering(CalendarWeekNumbering.WesternTraditional);
		aLargeIntervalTicks = oAxisTimeStrategy.getAxisTime().getTickTimeIntervalLabel()[1];
		assert.strictEqual(aLargeIntervalTicks[0].largeLabel, "Dec 2021, CW53", "Correct large interval label for calendarWeekNumbering: WesternTraditional");
		assert.strictEqual(aLargeIntervalTicks[1].largeLabel, "Jan 2022, CW1", "Correct large interval label for calendarWeekNumbering: WesternTraditional");
		assert.strictEqual(aLargeIntervalTicks[2].largeLabel, "Jan 2022, CW2", "Correct large interval label for calendarWeekNumbering: WesternTraditional");
		assert.strictEqual(aLargeIntervalTicks[3].largeLabel, "Jan 2022, CW2", "Correct large interval label for calendarWeekNumbering: WesternTraditional");
	});

	QUnit.test("Test skipTimePattern aggregation of axisTimeStrategy", function (assert) {
		var oSkipPattern = new WeekPattern();
		var oDailyInterval1 = new DayInterval({day: "Monday"});
		oDailyInterval1.addAggregation("skipIntervals", new SkipInterval({startTime: "000000", endTime: "090000"}));
		oDailyInterval1.addAggregation("skipIntervals", new SkipInterval({startTime: "173000", endTime: "235959"}));
		var oDailyInterval2 = new DayInterval({day: "Saturday"});
		oDailyInterval2.addAggregation("skipIntervals", new SkipInterval({startTime: "000000", endTime: "235959"}));
		oSkipPattern.addAggregation("dailyIntervals", oDailyInterval1);
		oSkipPattern.addAggregation("dailyIntervals", oDailyInterval2);
		oSkipPattern.addAggregation("weeklyIntervals", new SkipInterval({startTime: "120000", endTime: "140000"}));
		oSkipPattern.addAggregation("weeklyIntervals", new SkipInterval({startTime: "180000", endTime: "190000"}));

		assert.strictEqual(this.oAxisTimeStrategyBase.getSkipTimePattern(), null, "Default skip time pattern is null");
		this.oAxisTimeStrategyBase.setSkipTimePattern(oSkipPattern);
		var oSkipTimePattern = this.oAxisTimeStrategyBase.getSkipTimePattern();
		assert.notEqual(oSkipTimePattern, null, "Skip time pattern is set");
		assert.notEqual(this.oAxisTimeStrategyBase.getProperty("_discontinuousProvider"), null, "Discontinuity provider is set");
		oSkipTimePattern.setEnabled(false);
		assert.equal(this.oAxisTimeStrategyBase.getProperty("_discontinuousProvider"), null, "Discontinuity provider set to null when skip pattern is disabled");
	});

	var fnCreateAxisTimeStrategyBase = function(oOptionsObject) {
		var oOptions = oOptionsObject || {};
		var oTimeLineOptions = {
			"25min": {
				innerInterval: {
					unit: sap.gantt.config.TimeUnit.minute,
					span: 25,
					range: 90
				},
				largeInterval: {
					unit: sap.gantt.config.TimeUnit.day,
					span: 1,
					pattern: "cccc dd.M.yyyy"
				},
				smallInterval: {
					unit: sap.gantt.config.TimeUnit.minute,
					span: 15,
					pattern: "HH:mm"
				}
			},
			"40min": {
				innerInterval: {
					unit: sap.gantt.config.TimeUnit.minute,
					span: 30,
					range: 90
				},
				largeInterval: {
					unit: sap.gantt.config.TimeUnit.day,
					span: 1,
					pattern: "cccc dd.M.yyyy"
				},
				smallInterval: {
					unit: sap.gantt.config.TimeUnit.minute,
					span: 30,
					pattern: "HH:mm"
				}
			},
			"6hour": {
				innerInterval: {
					unit: sap.gantt.config.TimeUnit.hour,
					span: 3,
					range: 90
				},
				largeInterval: {
					unit: sap.gantt.config.TimeUnit.day,
					span: 1,
					pattern: "cccc dd.M.yyyy"
				},
				smallInterval: {
					unit: sap.gantt.config.TimeUnit.hour,
					span: 2,
					pattern: "HH:mm"
				}
			}
		};
		var oLocale = new sap.ui.core.Locale("zh_CN");
		return new AxisTimeStrategyBase({
			// Need to clone because when axistime strategy destroyed horizon as aggregation also get destroyed
			totalHorizon: oOptions.totalHorizon || oCustomedTotalHorizon.clone(),
			visibleHorizon: oOptions.visibleHorizon || oCustomedVisibleHorizon.clone(),
			timeLineOption: oTimeLineOptions["40min"],
			coarsestTimeLineOption: oTimeLineOptions["6hour"],
			finestTimeLineOption: oTimeLineOptions["25min"],
			timeLineOptions: oTimeLineOptions,
			zoomLevel: 1,
			zoomLevels: 4,
			calendarType: sap.ui.core.CalendarType.Islamic,
			locale: oLocale
		});
	};

	QUnit.module("Create axistime.AxisTimeStrategyBase with custom values.", {
		beforeEach: function () {
			this.oAxisTimeStrategyBase = fnCreateAxisTimeStrategyBase();
		},
		afterEach: function () {
			this.oAxisTimeStrategyBase.destroy();
			this.oAxisTimeStrategyBase = undefined;
		}
	});

	QUnit.test("Test setVisibleHorizon without start time and end time.", function (assert) {
		var oOriginalVisibleHorizon = this.oAxisTimeStrategyBase.getVisibleHorizon();
		var oTestVisibleHorizon = new TimeHorizon({});
		this.oAxisTimeStrategyBase._setVisibleHorizon(oTestVisibleHorizon);

		var oCurrentVisibleHorizon = this.oAxisTimeStrategyBase.getVisibleHorizon();
		assert.strictEqual(oCurrentVisibleHorizon.getStartTime(), oOriginalVisibleHorizon.getStartTime(), "Set visibleHorizon without start time and end time failed: start time not equal");
		assert.strictEqual(oCurrentVisibleHorizon.getEndTime(), oOriginalVisibleHorizon.getEndTime(), "Set visibleHorizon without start time and end time failed: end time not equal");
	});

	QUnit.test("Test setTotalHorizon.", function (assert) {
		var oRetVal = this.oAxisTimeStrategyBase.setTotalHorizon(oSetTotalHorizon);
		assert.strictEqual(oRetVal, this.oAxisTimeStrategyBase, "setTotalHorizon return instance");
		var oTotalHorizon = this.oAxisTimeStrategyBase.getAggregation("totalHorizon");
		assert.strictEqual(oTotalHorizon.getStartTime(), oSetTotalHorizon.getStartTime(), "TotalHorizon start time is set successfully");
		assert.strictEqual(oTotalHorizon.getEndTime(), oSetTotalHorizon.getEndTime(), "TotalHorizon start time is set successfully");
	});

	QUnit.test("Test getUpperRowFormatter getLowerRowFormatter.", function (assert) {
		var oRetVal = this.oAxisTimeStrategyBase.getUpperRowFormatter();
		assert.strictEqual(oRetVal.oFormatOptions.pattern, "cccc dd.M.yyyy", "getUpperRowFormatter's return value pattern is correct");
		assert.strictEqual(oRetVal.oFormatOptions.style, "medium", "getUpperRowFormatter's return value style is correct");
		assert.strictEqual(oRetVal.oFormatOptions.calendarType, "Islamic", "getUpperRowFormatter's return value calendarType is correct");
		var oRetValLower = this.oAxisTimeStrategyBase.getLowerRowFormatter();
		assert.strictEqual(oRetValLower.oFormatOptions.pattern, "HH:mm", "getLowerRowFormatter's return value pattern is correct");
		assert.strictEqual(oRetValLower.oFormatOptions.style, "medium", "getLowerRowFormatter's return value style is correct");
		assert.strictEqual(oRetValLower.oFormatOptions.calendarType, "Islamic", "getLowerRowFormatter's return value calendarType is correct");
	});

	QUnit.test("Test updateVisibleHorizonOnMouseWheelZoom.", function (assert) {
		//use mocked implementation for the inner call, since this test unit is focus on the logic within 'updateVisibleHorizonOnMouseWheelZoom'
		var stubForUpdateVHFineGranular = this.stub(this.oAxisTimeStrategyBase, "updateVisibleHorizonOnFineGranularMouseWheelZoom");
		var stubForUpdateVHStepWise = this.stub(this.oAxisTimeStrategyBase, "updateVisibleHorizonOnStepWiseMouseWheelZoom");
		//test logic for fine granular zoom type
		this.oAxisTimeStrategyBase.updateVisibleHorizonOnMouseWheelZoom(oDateTimeForTest, 100);
		assert.ok(stubForUpdateVHFineGranular.called, "updateVisibleHorizonOnMouseWheelZoom is successfully excuted for fine granular zoom type");

		//test logic for stepwise zoom type
		this.oAxisTimeStrategyBase.setMouseWheelZoomType(sap.gantt.MouseWheelZoomType.Stepwise);
		this.oAxisTimeStrategyBase.updateVisibleHorizonOnMouseWheelZoom(oDateTimeForTest, 100);
		assert.ok(stubForUpdateVHStepWise.called, "updateVisibleHorizonOnMouseWheelZoom is successfully excuted for stepwise zoom type");
	});

	QUnit.test("Test updateVisibleHorizonOnFineGranularMouseWheelZoom.", function (assert) {
		//use mocked implementation for the inner call, since this test unit is focus on the logic within 'updateVisibleHorizonOnFineGranularMouseWheelZoom'
		this.stub(this.oAxisTimeStrategyBase, "calVisibleHorizonByDelta").returns(oVisibleHorizonForTest);

		this.oAxisTimeStrategyBase.updateVisibleHorizonOnFineGranularMouseWheelZoom(oDateTimeForTest, false, 1);
		var oVisibleHorizon = this.oAxisTimeStrategyBase.getVisibleHorizon();
		assert.ok((oVisibleHorizon.getEndTime() == oVisibleHorizonForTest.getEndTime() && oVisibleHorizon.getStartTime() == oVisibleHorizonForTest.getStartTime()), "updateVisibleHorizonOnFineGranularMouseWheelZoom is successfully excuted");
	});

	QUnit.test("Test updateVisibleHorizonOnStepWiseMouseWheelZoom.", function (assert) {
		//use mocked implementation for the inner call, since this test unit is focus on the logic within 'updateVisibleHorizonOnStepWiseMouseWheelZoom'
		this.stub(this.oAxisTimeStrategyBase, "calVisibleHorizonByRate").returns(oVisibleHorizonForTest);

		this.oAxisTimeStrategyBase._oZoom = { rate: 1 };
		this.oAxisTimeStrategyBase._aZoomRate = [0.5, 1, 2, 3];
		this.oAxisTimeStrategyBase.updateVisibleHorizonOnStepWiseMouseWheelZoom(oDateTimeForTest, true, 2);
		var oVisibleHorizon = this.oAxisTimeStrategyBase.getVisibleHorizon();
		assert.ok((oVisibleHorizon.getEndTime() != oVisibleHorizonForTest.getEndTime() && oVisibleHorizon.getStartTime() != oVisibleHorizonForTest.getStartTime()), "updateVisibleHorizonOnStepWiseMouseWheelZoom is successfully excuted");
	});

	QUnit.test("Test calVisibleHorizonByRate.", function (assert) {
		//use mocked implementation for the inner call, since this test unit is focus on the logic within 'calVisibleHorizonByRate'
		this.stub(this.oAxisTimeStrategyBase, "calVisibleHorizonByDelta").returns(oVisibleHorizonForTest);

		this.oAxisTimeStrategyBase._oZoom = { base: { scale: 10000 }, rate: 1 };
		this.oAxisTimeStrategyBase._aZoomRate = [0.5, 1, 2, 3];
		this.oAxisTimeStrategyBase._nGanttVisibleWidth = 1200;
		var nZoomRate = this.oAxisTimeStrategyBase._aZoomRate[this.oAxisTimeStrategyBase.getZoomLevel() + 1];
		var oVisibleHorizon = this.oAxisTimeStrategyBase.calVisibleHorizonByRate(nZoomRate, oDateTimeForTest);
		assert.ok((oVisibleHorizon.getEndTime() == oVisibleHorizonForTest.getEndTime() && oVisibleHorizon.getStartTime() == oVisibleHorizonForTest.getStartTime()), "calVisibleHorizonByRate is successfully excuted");
	});

	QUnit.test("Test calVisibleHorizonByDelta.", function (assert) {
		var oDateTimeForDeltaTest = new Date(2017,5,1);
		var oCurrentStartTime = Format.abapTimestampToDate(this.oAxisTimeStrategyBase.getVisibleHorizon().getStartTime());
		var oCurrentEndTime = Format.abapTimestampToDate(this.oAxisTimeStrategyBase.getVisibleHorizon().getEndTime());
		var nTimeSpanDelta = (oDateTimeForDeltaTest.getTime() - oCurrentStartTime.getTime()) / 100;

		//do not provoide anchor time, do zoom in
		var nTargetEndTime = oCurrentEndTime.getTime() + nTimeSpanDelta / 2;

		var oVisibleHorizon = this.oAxisTimeStrategyBase.calVisibleHorizonByDelta(nTimeSpanDelta);
		var nAcutalEndTime = Format.abapTimestampToDate(oVisibleHorizon.getEndTime()).getTime();
		//if the deviation is less than 1000 ms (1s), then ok
		assert.ok(Math.abs(nAcutalEndTime - nTargetEndTime) < 1000, "calVisibleHorizonByDelta is successfully excuted with no anchor time provide");

		//put the start time as the zoom anchor time, do zoom out, check boundary
		nTargetEndTime = oCurrentEndTime.getTime() + nTimeSpanDelta;
		oVisibleHorizon = this.oAxisTimeStrategyBase.calVisibleHorizonByDelta(nTimeSpanDelta, oCurrentStartTime);
		nAcutalEndTime = Format.abapTimestampToDate(oVisibleHorizon.getEndTime()).getTime();
		//if the deviation is less than 1000 ms (1s), then ok
		assert.ok(Math.abs(nAcutalEndTime - nTargetEndTime) < 1000, "calVisibleHorizonByDelta is successfully excuted with the visible horizon start time as the anchor time, zoom out");

		//put the start time as the zoom anchor time, do zoom in
		nTargetEndTime = oCurrentEndTime.getTime() - nTimeSpanDelta;
		oVisibleHorizon = this.oAxisTimeStrategyBase.calVisibleHorizonByDelta(0 - nTimeSpanDelta, oCurrentStartTime);
		nAcutalEndTime = Format.abapTimestampToDate(oVisibleHorizon.getEndTime()).getTime();
		//if the deviation is less than 1000 ms (1s), then ok
		assert.ok(Math.abs(nAcutalEndTime - nTargetEndTime) < 1000, "calVisibleHorizonByDelta is successfully excuted with the visible horizon start time as the anchor time, zoom in");

		//zoom out with 0 delta
		nTargetEndTime = oCurrentEndTime.getTime();
		oVisibleHorizon = this.oAxisTimeStrategyBase.calVisibleHorizonByDelta(0, oCurrentStartTime);
		nAcutalEndTime = Format.abapTimestampToDate(oVisibleHorizon.getEndTime()).getTime();
		assert.ok(nAcutalEndTime == nTargetEndTime, "calVisibleHorizonByDelta is successfully excuted with 0 delta, visible horizon range not changed");
	});

	QUnit.test("Test calMiddleDate.", function (assert) {
		var date1 = new Date("2015-01-01");
		var date2 = new Date("2015-01-03");
		var middle = new Date("2015-01-02");

		assert.ok(middle.getTime() === this.oAxisTimeStrategyBase.calMiddleDate(date1, date2).getTime(), "OK");
	});

	/**
	 * @deprecated Since version 1.63
	 */
	QUnit.test("Test createAxisTime.", function (assert) {
		this.oAxisTimeStrategyBase.createAxisTime(library.config.DEFAULT_LOCALE_CET.clone());

		assert.ok(true, "No errors were thrown during createAxisTime call with both horizons set.");

		this.oAxisTimeStrategyBase.setVisibleHorizon(undefined);

		this.oAxisTimeStrategyBase.createAxisTime(library.config.DEFAULT_LOCALE_CET.clone());

		assert.ok(true, "No errors were thrown during createAxisTime call with only total horizon set.");
	});

	QUnit.test("Test firstDayOfWeek.", function (assert) {
		GanttChartConfigurationUtils.setLanguage("zh_CN");
		assert.strictEqual(this.oAxisTimeStrategyBase.getFirstDayOfWeek(), 1, "firstDayOfWeek should be 1 meaning Monday");
		GanttChartConfigurationUtils.setLanguage("zh");
		//"zh" is not available in core so taking from default "en" where first day is sunday.
		assert.strictEqual(this.oAxisTimeStrategyBase.getFirstDayOfWeek(), 0, "firstDayOfWeek should be 0 meaning Sunday");
	});

	QUnit.test("Test firstDayOfWeek for FLP Calendar Week numbering.", function (assert) {
		GanttChartConfigurationUtils.setCalendarWeekNumbering(CalendarWeekNumbering.Default);

		var oWeekConfig = CalendarUtils.getWeekConfigurationValues();

		assert.strictEqual(this.oAxisTimeStrategyBase.getFirstDayOfWeek(), oWeekConfig.firstDayOfWeek, "firstDayOfWeek set to CalendarUtils Week Configuration");

		GanttChartConfigurationUtils.setCalendarWeekNumbering(CalendarWeekNumbering.ISO_8601);

		assert.strictEqual(this.oAxisTimeStrategyBase.getFirstDayOfWeek(), 1, "firstDayOfWeek should be 1 meaning Monday");

		GanttChartConfigurationUtils.setCalendarWeekNumbering(CalendarWeekNumbering.MiddleEastern);

		assert.strictEqual(this.oAxisTimeStrategyBase.getFirstDayOfWeek(), 6, "firstDayOfWeek should be 6 meaning Saturday");

		GanttChartConfigurationUtils.setCalendarWeekNumbering(CalendarWeekNumbering.WesternTraditional);

		assert.strictEqual(this.oAxisTimeStrategyBase.getFirstDayOfWeek(), 0, "firstDayOfWeek should be 0 meaning Sunday");
	});

	var fnGetInitialTotalHorizonStartTime = function() {
		return new Date(2020, 0, 1);
	};

	var fnGetInitialTotalHorizonEndTime = function() {
		return new Date(2020, 11, 1);
	};
	var iTimespanDeltaTwoDaysInMs = new Date(2020, 0, 3) - new Date(2020, 0, 1);

	QUnit.module("Test axistime.AxisTimeStrategyBase.calVisibleHorizonByDelta.", {
		beforeEach: function () {

			this.oInitialTotalHorizon = new TimeHorizon({
				startTime: fnGetInitialTotalHorizonStartTime(),
				endTime: fnGetInitialTotalHorizonEndTime()
			});
		},
		afterEach: function () {
			this.oInitialTotalHorizon.destroy();
			this.oInitialTotalHorizon = undefined;
			this.oInitialVisibleHorizon.destroy();
			this.oInitialVisibleHorizon = undefined;
			this.oExpectedVisibleHorizon.destroy();
			this.oExpectedVisibleHorizon = undefined;
			this.oCalculatedVisibleHorizon.destroy();
			this.oCalculatedVisibleHorizon = undefined;
		}
	});

	var fnTestStartTimeAndEndTimeOfCalVisibleHorizonByDelta = function(assert) {
		var oStrategyOptionsObject = {
			totalHorizon: this.oInitialTotalHorizon,
			visibleHorizon: this.oInitialVisibleHorizon
		};
		var oAxisTimeStrategyBase = fnCreateAxisTimeStrategyBase(oStrategyOptionsObject);
		this.oCalculatedVisibleHorizon = oAxisTimeStrategyBase.calVisibleHorizonByDelta(iTimespanDeltaTwoDaysInMs);

		assert.strictEqual(this.oCalculatedVisibleHorizon.getStartTime(), this.oExpectedVisibleHorizon.getStartTime(),
			"Calculated visible horizon start time matches expected visible horizon start time");
		assert.strictEqual(this.oCalculatedVisibleHorizon.getEndTime(), this.oExpectedVisibleHorizon.getEndTime(),
			"Calculated visible horizon end time matches expected visible horizon end time");

		oAxisTimeStrategyBase.destroy();
		oAxisTimeStrategyBase = undefined;
	};

	QUnit.test("Zoom out by delta subtracts half of delta from the visible horizon start time and adds half of delta to the visible horizon end time when the resulting visible horizon does not overflow total horizon boundaries.", function (assert) {
		this.oInitialVisibleHorizon = new TimeHorizon({
			startTime: new Date(2020, 4, 2),
			endTime: new Date(2020, 5, 1)
		});
		this.oExpectedVisibleHorizon = new TimeHorizon({
			startTime: new Date(2020, 4, 1),
			endTime: new Date(2020, 5, 2)
		});

		fnTestStartTimeAndEndTimeOfCalVisibleHorizonByDelta.call(this, assert);
	});

	QUnit.test("Zoom out by delta adds delta to the visible horizon end time when visible horizon start time is same as total horizon start time", function (assert) {
		this.oInitialVisibleHorizon = new TimeHorizon({
			startTime: fnGetInitialTotalHorizonStartTime(),
			endTime: new Date(2020, 5, 1)
		});
		this.oExpectedVisibleHorizon = new TimeHorizon({
			startTime: fnGetInitialTotalHorizonStartTime(),
			endTime: new Date(2020, 5, 3)
		});
		fnTestStartTimeAndEndTimeOfCalVisibleHorizonByDelta.call(this, assert);
	});

	QUnit.test("Zoom out by delta subtracts delta from visible horizon start time when visible horizon end time is same as total horizon end time.", function (assert) {
		this.oInitialVisibleHorizon = new TimeHorizon({
			startTime: new Date(2020, 5, 3),
			endTime: fnGetInitialTotalHorizonEndTime()
		});
		this.oExpectedVisibleHorizon = new TimeHorizon({
			startTime: new Date(2020, 5, 1),
			endTime: fnGetInitialTotalHorizonEndTime()
		});
		fnTestStartTimeAndEndTimeOfCalVisibleHorizonByDelta.call(this, assert);

	});

});
