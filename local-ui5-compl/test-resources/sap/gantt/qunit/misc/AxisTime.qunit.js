/*global QUnit, sinon */
sap.ui.define([
	"sap/base/util/ObjectPath",
	"sap/gantt/misc/AxisTime",
	"sap/gantt/axistime/ProportionZoomStrategy",
	"sap/gantt/misc/Format",
	"sap/gantt/config/Locale",
	"sap/gantt/utils/GanttChartConfigurationUtils"
], function (ObjectPath, AxisTime, ProportionZoomStrategy, Format, Locale, GanttChartConfigurationUtils) {
	"use strict";

	QUnit.module("Test sap.gantt.misc.AxisTime", {
		beforeEach: function () {
			this.originalLanguage = GanttChartConfigurationUtils.getLanguage();
			GanttChartConfigurationUtils.setLanguage("en");
		},
		afterEach: function () {
			GanttChartConfigurationUtils.setLanguage(this.originalLanguage);
			this.originalLanguage = undefined;
		}
	});

	QUnit.test("test for AxisTime", function (assert) {
		// construct your input data and output data
		var date = new Date(2013, 11, 30, 12, 0, 0, 0);
		var startDate = d3.time.day.offset(date, -5);
		var endDate = d3.time.day.offset(date, +5);
		var localeClone = sap.gantt.config.DEFAULT_LOCALE_CET.clone();
		var axisX = new AxisTime([startDate, endDate], [100, 200], 2, 10, 0, localeClone, new ProportionZoomStrategy());
		var axisX2 = axisX.clone();
		axisX2.setZoomOrigin(0).setZoomRate(1);

		// assertion for AxisTime with zoom
		assert.strictEqual(axisX.timeToView(date), 280, "Test AxisTime: timeToView with zoom");
		assert.strictEqual(axisX.viewToTime(280).valueOf(), date.valueOf(), "Test AxisTime: viewToTime with zoom");
		assert.strictEqual(axisX.timeToView(axisX.viewToTime(280)), 280, "Test AxisTime: timeToView(viewToTime) with zoom");
		assert.strictEqual(axisX.viewToTime(axisX.timeToView(date)).valueOf(), date.valueOf(), "Test AxisTime: viewToTime(timeToView) with zoom");
		assert.strictEqual(axisX.getViewRange()[0] === 180 && axisX.getViewRange()[1] === 380, true, "Test AxisTime: getViewRange with zoom");

		//assert first day of week
		var timeRangeSet = [],
			viewRangeSet = [],
			timeRange = [new Date(1400782801687), new Date(1444588837872)],
			viewRange = [0, 2321.424];
		var scaleValue = axisX._calculateScale(timeRangeSet, viewRangeSet, timeRange, viewRange, false);
		var visibleScale = scaleValue.visibleScale;
		var oTimeInterval = {
			span: 1,
			unit: "d3.time.week"
		};
		GanttChartConfigurationUtils.setLanguage("zh");
		//"zh" is not available in core so taking from default "en" where first day is sunday.
		assert.deepEqual(axisX._getTimeIntervalTicks(oTimeInterval, visibleScale), visibleScale.ticks(ObjectPath.get("d3.time.sunday.range"), 1), "Test AxisTime: first day of week in different languages.");
		GanttChartConfigurationUtils.setLanguage("zh_CN");
		assert.deepEqual(axisX._getTimeIntervalTicks(oTimeInterval, visibleScale), visibleScale.ticks(ObjectPath.get("d3.time.monday.range"), 1), "Test AxisTime: first day of week in different languages.");

		// assertion for AxisTime with start/end value
		assert.strictEqual(axisX2.viewToTime(100).valueOf(), startDate.valueOf(), "Test AxisTime: viewToTime with start value");
		assert.strictEqual(axisX2.viewToTime(200).valueOf(), endDate.valueOf(), "Test AxisTime: viewToTime with end value");
		assert.strictEqual(axisX2.timeToView(axisX2.viewToTime(100)), 100, "Test AxisTime: timeToView(viewToTime) with start value");
		assert.strictEqual(axisX2.timeToView(axisX2.viewToTime(200)), 200, "Test AxisTime: timeToView(viewToTime) with end value");
		assert.strictEqual(axisX2.getViewRange()[0] === 100 && axisX2.getViewRange()[1] === 200, true, "Test AxisTime: getViewRange");
		assert.strictEqual(axisX2.getCurrentTickTimeIntervalKey(), "4day", "Test AxisTime: getCurrentTickTimeIntervalKey");
	});

	QUnit.test("test for getNowLabel", function (assert) {
		var oLocale = sap.gantt.config.DEFAULT_LOCALE.clone();

		var oAxisTime = new AxisTime([new Date(), new Date()], [0, 0], 0, 0, 0, oLocale);

		// now line in system time
		var oNowLine = oAxisTime.getNowLabel(false)[0];

		var oDate = new Date();
		assert.equal(oNowLine.date.getHours(), oDate.getHours(), "Now line is set to System Time");
		assert.equal(oNowLine.date.getMinutes(), oDate.getMinutes(), "Now line is set to System Time");

		// now line in UTC time
		oNowLine = oAxisTime.getNowLabel(true)[0];
		oDate = new Date();

		assert.equal(oNowLine.date.getHours(), oDate.getUTCHours(), "Now line is set to UTC Time");
		assert.equal(oNowLine.date.getMinutes(), oDate.getUTCMinutes(), "Now line is set to UTC Time");

		oLocale.setTimeZone("UTC");

		// now line in system time
		oNowLine = oAxisTime.getNowLabel(false)[0];
		oDate = new Date();

		assert.equal(oNowLine.date.getHours(), oDate.getHours(), "Now line is set to System Time");
		assert.equal(oNowLine.date.getMinutes(), oDate.getMinutes(), "Now line is set to System Time");

		// now line in UTC time
		oNowLine = oAxisTime.getNowLabel(true)[0];
		oDate = new Date();

		assert.equal(oNowLine.date.getHours(), oAxisTime.offsetTimezoneDiff(oDate).getUTCHours(), "Now line is set to UTC Time");
		assert.equal(oNowLine.date.getMinutes(), oAxisTime.offsetTimezoneDiff(oDate).getUTCMinutes(), "Now line is set to UTC Time");
	});

	QUnit.test("test for cache implementation", function (assert) {
		var startDate = new Date(2013, 11, 1, 12, 0, 0, 0);
		var endDate = new Date(2013, 11, 30, 12, 0, 0, 0);
		var updatedEndDate = new Date(2013, 11, 22, 12, 0, 0, 0);
		var localeClone = sap.gantt.config.DEFAULT_LOCALE_CET.clone();
		var axisTime = new AxisTime([startDate, endDate], [100, 200], 2, 10, 0, localeClone, new ProportionZoomStrategy());
		assert.ok(axisTime._shapeWidthValue,"shape width map exists");
		//set locale not should clear cache
		axisTime._shapeWidthValue.add([2,200],30);
		assert.equal(axisTime._shapeWidthValue.keyStore.length,1,"values added in cache");
		axisTime.setLocale(localeClone);
		//set zoom origin should clear cache
		axisTime._shapeWidthValue.add([2,200],30);
		assert.equal(axisTime._shapeWidthValue.keyStore.length,1,"values added in cache");
		axisTime.setZoomOrigin(10);
		assert.equal(axisTime._shapeWidthValue.keyStore.length,1,"values NOT cleared in cache");
		axisTime.setZoomOrigin(5);
		assert.equal(axisTime._shapeWidthValue.keyStore.length,0,"values cleared in cache");
		//set time range should clear cache
		axisTime._shapeWidthValue.add([2,200],30);
		assert.equal(axisTime._shapeWidthValue.keyStore.length,1,"values added in cache");
		axisTime.setTimeRange([startDate,endDate]);
		assert.equal(axisTime._shapeWidthValue.keyStore.length,1,"values NOT cleared in cache");
		axisTime.setTimeRange([startDate,updatedEndDate]);
		assert.equal(axisTime._shapeWidthValue.keyStore.length,0,"values cleared in cache");
	});

	QUnit.test("test for timeToView", function (assert) {
		const oAxisTime = new AxisTime([new Date(), new Date()], [0, 1]);
		const oScaleRef = {
			scale: () => {}
		};

		const fContinuousScale = sinon.spy(oAxisTime, "continuousScale");
		const fScale = sinon.spy(oScaleRef, "scale");

		oAxisTime.timeToView(new Date());
		assert.ok(fContinuousScale.calledOnce, "Continuous scale used by default");

		oAxisTime.timeToView(new Date(), undefined, fScale);
		assert.ok(fContinuousScale.calledOnce, "Continuous scale not called when custom scale is given");
		assert.ok(fScale.calledOnce, "Custom scale is used when given");

		fContinuousScale.restore();
		fScale.restore();
	});

	QUnit.test("test for AxisTime with Discontinuity Provider", function (assert) {
		const oZoomStrategyRef = {
			getProperty: () => null,
			getTimeLineOption: () => ({
				smallInterval: {}
			})
		};

		const oTimelineOptionSpy = sinon.spy(oZoomStrategyRef, "getTimeLineOption");

		const createAxistime = () => new AxisTime([new Date(), new Date()], [0, 1], undefined, undefined, undefined, null, oZoomStrategyRef);

		let oAxisTime = createAxistime();

		assert.equal(oAxisTime.scale, oAxisTime.continuousScale, "Continuous scale is used when discontinuity provider is not provided");
		assert.equal(oAxisTime.discontinuityProvider, null, "Discontinuity Provider is not available");
		assert.notOk(oTimelineOptionSpy.called, "Timeline option is not used");

		oTimelineOptionSpy.resetHistory();

		window.fc = {
			scaleDiscontinuous: () => ({
				discontinuityProvider: window.d3.time.scale
			})
		};

		const oDiscontinuityProvider = {
			useDiscontinuousScale: () => false
		};

		oZoomStrategyRef.getProperty = () => oDiscontinuityProvider;
		oAxisTime = createAxistime();

		assert.equal(oAxisTime.scale, oAxisTime.continuousScale, "Continuous scale is used when discontinuity provider is not required");
		assert.equal(oAxisTime.discontinuityProvider, null, "Discontinuity Provider is not available");
		assert.equal(oTimelineOptionSpy.callCount,2, "Timeline option is used");

		oTimelineOptionSpy.resetHistory();

		oDiscontinuityProvider.useDiscontinuousScale = () => true;
		oAxisTime = createAxistime();

		assert.equal(oAxisTime.scale, oAxisTime.discontinuousScale, "Discontinuous scale is used when discontinuity provider is required");
		assert.equal(oAxisTime.discontinuityProvider, oDiscontinuityProvider, "Discontinuity Provider is available");
		assert.equal(oTimelineOptionSpy.callCount,2, "Timeline option is used");

		oTimelineOptionSpy.restore();
		window.fc = undefined;
	});

	QUnit.module("Test timezone configurations", {
		beforeEach: function () {
			this.originalLanguage = GanttChartConfigurationUtils.getLanguage();
			GanttChartConfigurationUtils.setLanguage("en");

			var oConfig = new Locale({
				timeZone: null
			});

			this.oStartTime = new Date(2015, 0, 1, 0, 0, 0);
			this.oEndTime = d3.time.day.offset(this.oStartTime, +5);

			this.oAxisTime = new AxisTime([this.oStartTime, this.oEndTime], [0, 100], 1, 0, 0, oConfig, new ProportionZoomStrategy());
		},
		afterEach: function () {
			GanttChartConfigurationUtils.setLanguage(this.originalLanguage);
			this.originalLanguage = undefined;

			this.oAxisTime = null;
		}
	});

	QUnit.test("should return correct timezone config by default", function (assert) {
		assert.strictEqual(Format.dateToAbapTimestamp(this.oAxisTime.convertToTimezone(this.oStartTime)), Format.dateToAbapTimestamp(this.oStartTime));
		assert.strictEqual(Format.dateToAbapTimestamp(this.oAxisTime.offsetTimezoneDiff(this.oStartTime)), Format.dateToAbapTimestamp(this.oStartTime));
	});

	QUnit.test("should return correct timezone config for the specified timezone", function (assert) {
		var oLocalConfig = new Locale({
			timeZone: "Asia/Calcutta"
		});

		var oLocalAxisTime = new AxisTime([], [], 0, 0, 0, oLocalConfig, new ProportionZoomStrategy());

		var oDate = oLocalAxisTime.convertToTimezone(this.oStartTime);

		this.oAxisTime.getLocale().setTimeZone("UTC");

		assert.strictEqual(Format.dateToAbapTimestamp(this.oAxisTime.convertToTimezone(oDate)), Format.isoTimestampToAbapTimestamp(oDate.toISOString()));
		assert.strictEqual(Format.dateToAbapTimestamp(this.oAxisTime.offsetTimezoneDiff(oDate)), "20150101053000");
	});

	QUnit.test("should generate correct ticks for the default timezone", function (assert) {
		var ticks = this.oAxisTime.getTickTimeIntervalLabel(null, null, [-10, 300]);

		assert.strictEqual(Format.dateToAbapTimestamp(ticks[0][0].date), Format.dateToAbapTimestamp(this.oStartTime), "Upper row ticks starts from the starting from the start time");
		assert.strictEqual(ticks[0][0].value, 0, "Upper row ticks starts from the starting from 0px");
		assert.strictEqual(Format.dateToAbapTimestamp(ticks[1][0].date), Format.dateToAbapTimestamp(this.oStartTime), "Lower row ticks starts from the starting from the start time");
		assert.strictEqual(ticks[1][0].value, 0, "Lower row ticks starts from the starting from 0px");

		for (var outerIndex = 0; outerIndex < ticks.length; outerIndex++) {
			for (var index = 0; index < ticks[outerIndex].length; index++) {
				var tick = ticks[outerIndex][index];

				assert.strictEqual(tick.date.getHours(), 0, "tick hours starting from 0");
				assert.strictEqual(tick.date.getMinutes(), 0, "tick minutes starting from 0");
				assert.strictEqual(tick.date.getSeconds(), 0, "tick seconds starting from 0");
				assert.strictEqual(tick.date.getMilliseconds(), 0, "tick milliseconds starting from 0");
			}
		}
	});

	QUnit.test("should generate correct ticks for the specified timezone", function (assert) {
		this.oAxisTime.getLocale().setTimeZone("UTC");

		var ticks = this.oAxisTime.getTickTimeIntervalLabel(null, null, [-10, 300]);

		var firstLargerTickTime = this.oAxisTime.convertToTimezone(ticks[0][0].date);
		var firstSmallerTickTime = this.oAxisTime.convertToTimezone(ticks[1][0].date);

		assert.strictEqual(Format.dateToAbapTimestamp(firstLargerTickTime), Format.dateToAbapTimestamp(this.oStartTime), "Upper row ticks starts from the starting from the start time");
		assert.strictEqual(this.oAxisTime.timeToView(firstLargerTickTime), 0, "Upper row ticks starts from the starting from 0px");
		assert.strictEqual(Format.dateToAbapTimestamp(firstSmallerTickTime), Format.dateToAbapTimestamp(this.oStartTime), "Lower row ticks starts from the starting from the start time");
		assert.strictEqual(this.oAxisTime.timeToView(firstSmallerTickTime), 0, "Lower row ticks starts from the starting from 0px");

		for (var outerIndex = 0; outerIndex < ticks.length; outerIndex++) {
			for (var index = 0; index < ticks[outerIndex].length; index++) {
				var tick = ticks[outerIndex][index];
				var date = this.oAxisTime.convertToTimezone(tick.date);

				assert.strictEqual(date.getHours(), 0, "tick hours starting from 0");
				assert.strictEqual(date.getMinutes(), 0, "tick minutes starting from 0");
				assert.strictEqual(date.getSeconds(), 0, "tick seconds starting from 0");
				assert.strictEqual(date.getMilliseconds(), 0, "tick milliseconds starting from 0");
			}
		}
	});
});
